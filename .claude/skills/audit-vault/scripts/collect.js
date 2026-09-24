// Collects vault audit data and returns it as JSON.
// Run from the vault root:
//   obsidian eval code="$(cat .claude/skills/audit-vault/scripts/collect.js)"
(async () => {
  const DAY = 864e5;
  const now = Date.now();
  const MOC_PATH = '10 Notatki/Moje 12 Problemów.md';
  const TAXONOMY = [
    'input/artykuł', 'input/video', 'input/książka', 'input/kurs', 'input/tweet', 'input/meet', 'input/raw',
    'output/artykuł', 'output/social', 'output/komentarz', 'output/styl',
    'wiedza/zettel', 'wiedza/pojęcie', 'wiedza/osoba', 'wiedza/firma', 'wiedza/dzieło', 'wiedza/story', 'wiedza/cytat',
    'projekt/praca', 'projekt/osobisty',
  ];

  const mc = app.metadataCache;
  const VAULT_DIRS = ['00 Planer/', '10 Notatki/', '90 Ekstra/', '99 Raw/'];
  const files = app.vault.getMarkdownFiles().filter((f) => !f.path.includes('/') || VAULT_DIRS.some((d) => f.path.startsWith(d)));
  const isKnowledge = (path) => path.startsWith('10 Notatki/') || path.startsWith('00 Planer/');
  const cache = (f) => mc.getFileCache(f) || {};
  const fmOf = (f) => cache(f).frontmatter || {};
  const asList = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : [v]);
  const tagsOf = (f) => asList(fmOf(f).tags).map(String);
  const hasTag = (f, t) => tagsOf(f).includes(t);
  const day = (ms) => new Date(ms).toISOString().slice(0, 10);
  const daysAgo = (ms) => Math.floor((now - ms) / DAY);
  const resolve = (link, from) => mc.getFirstLinkpathDest(String(link).replace(/^\[\[|\]\]$/g, '').split('|')[0].split('#')[0], from);
  const linkTargets = (value, from) => asList(value).map((v) => resolve(v, from)).filter(Boolean);
  const body = async (f) => (await app.vault.cachedRead(f)).replace(/^---[\s\S]*?\n---\n?/, '');

  const inNotes = files.filter((f) => f.path.startsWith('10 Notatki/'));
  const zettels = inNotes.filter((f) => hasTag(f, 'wiedza/zettel'));

  // --- MOC structure ---------------------------------------------------------
  const moc = app.vault.getAbstractFileByPath(MOC_PATH);
  const mocText = await app.vault.read(moc);
  const areas = [];
  let area = null;
  for (const line of mocText.split('\n')) {
    const h = line.match(/^#{2,4}\s+(.*)$/);
    if (h) { area = { name: h[1].trim(), guiding: null, subs: [] }; areas.push(area); continue; }
    if (!area) continue;
    const links = [...line.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map((m) => m[1].trim());
    if (!links.length) continue;
    if (/Pytanie przewodnie/i.test(line)) area.guiding = links[0];
    else if (/^\s*[*-]\s/.test(line)) area.subs.push(...links);
  }

  // --- Zettels per question --------------------------------------------------
  const zettelsByQuestion = new Map();
  const zettelIssues = { noDotyczy: [], dotyczyOutsideMoc: [], missingSource: [] };
  const mocQuestionPaths = new Set();
  for (const a of areas) for (const q of [a.guiding, ...a.subs].filter(Boolean)) {
    const f = resolve(q, MOC_PATH);
    if (f) mocQuestionPaths.add(f.path);
  }
  for (const z of zettels) {
    const fm = fmOf(z);
    const targets = linkTargets(fm.dotyczy, z.path);
    if (!asList(fm.dotyczy).length) zettelIssues.noDotyczy.push(z.basename);
    for (const t of targets) {
      if (!mocQuestionPaths.has(t.path)) zettelIssues.dotyczyOutsideMoc.push(`${z.basename} → ${t.basename}`);
      if (!zettelsByQuestion.has(t.path)) zettelsByQuestion.set(t.path, []);
      zettelsByQuestion.get(t.path).push(z);
    }
    const unresolvedDotyczy = asList(fm.dotyczy).filter((v) => !resolve(v, z.path));
    for (const u of unresolvedDotyczy) zettelIssues.dotyczyOutsideMoc.push(`${z.basename} → ${u} (brak notatki)`);
    const src = asList(fm['źródło']);
    if (src.length && !linkTargets(src, z.path).length) zettelIssues.missingSource.push(`${z.basename} → ${src.join(', ')}`);
  }

  // Only zettels may link to MOC questions (CLAUDE.md). Question notes and the MOC itself are exempt.
  const nonZettelMocLinks = [];
  for (const f of inNotes) {
    if (hasTag(f, 'wiedza/zettel') || mocQuestionPaths.has(f.path) || f.path === MOC_PATH) continue;
    const c = cache(f);
    const targets = [...(c.links || []), ...(c.frontmatterLinks || [])].map((l) => mc.getFirstLinkpathDest(l.link, f.path)).filter(Boolean);
    const hits = [...new Set(targets.filter((t) => mocQuestionPaths.has(t.path)).map((t) => t.basename))];
    if (hits.length) nonZettelMocLinks.push(`${f.basename} → ${hits.join(', ')}`);
  }

  const questionStats = (q) => {
    const f = resolve(q, MOC_PATH);
    const zs = f ? zettelsByQuestion.get(f.path) || [] : [];
    const times = zs.map((z) => z.stat.ctime).sort((a, b) => b - a);
    return {
      question: q,
      exists: !!f,
      zettels: zs.length,
      last: times[0] ? day(times[0]) : null,
      daysSinceLast: times[0] ? daysAgo(times[0]) : null,
      last30: times.filter((t) => now - t < 30 * DAY).length,
    };
  };

  const areaReport = [];
  for (const a of areas.filter((x) => x.guiding)) {
    const guiding = questionStats(a.guiding);
    const subs = a.subs.map(questionStats);
    const all = [guiding, ...subs];
    // Dataview maintenance rule: the guiding note must query every sub-question.
    const gFile = resolve(a.guiding, MOC_PATH);
    let dataviewMissing = null;
    if (gFile) {
      const text = await app.vault.read(gFile);
      const block = (text.match(/```dataview[\s\S]*?```/) || [''])[0];
      dataviewMissing = [a.guiding, ...a.subs].filter((q) => !block.includes(`[[${q}]]`));
    }
    areaReport.push({
      area: a.name,
      // Compact per-question rows: question | zettels | last zettel | zettels in last 30 days.
      questions: all.map((x, i) => `${i === 0 ? '[przewodnie] ' : ''}${x.question} | ${x.zettels} | ${x.last || '—'} | ${x.last30}`),
      totalZettels: all.reduce((s, x) => s + x.zettels, 0),
      last30: all.reduce((s, x) => s + x.last30, 0),
      daysSinceLast: Math.min(...all.map((x) => x.daysSinceLast ?? Infinity)),
      lastActivity: all.map((x) => x.last).filter(Boolean).sort().pop() || null,
      emptySubs: subs.filter((s) => s.zettels === 0).map((s) => s.question),
      missingQuestionNotes: all.filter((x) => !x.exists).map((x) => x.question),
      dataviewMissing,
    });
  }

  // --- Links -----------------------------------------------------------------
  const unresolved = {};
  for (const [src, targets] of Object.entries(mc.unresolvedLinks)) {
    if (!isKnowledge(src)) continue;
    for (const t of Object.keys(targets)) (unresolved[t] = unresolved[t] || []).push(src.replace(/^.*\//, '').replace(/\.md$/, ''));
  }
  const isDate = (t) => /^\d{4}-\d{2}-\d{2}/.test(t);
  const incoming = new Set();
  for (const [src, targets] of Object.entries(mc.resolvedLinks)) for (const t of Object.keys(targets)) if (t !== src) incoming.add(t);
  const orphans = inNotes.filter((f) => !incoming.has(f.path) && !Object.keys(mc.resolvedLinks[f.path] || {}).length).map((f) => f.basename);

  // --- Tags, structure, content ----------------------------------------------
  const untagged = [], badTags = {}, hashTags = [], emptyConcepts = [], emptyCompanies = [], emptyPeople = [];
  const aliasOwner = new Map(), duplicates = new Set();
  for (const f of inNotes) {
    const ts = tagsOf(f);
    if (!ts.length && !mocQuestionPaths.has(f.path) && f.path !== MOC_PATH) untagged.push(f.basename);
    for (const t of ts) {
      if (t.startsWith('#')) hashTags.push(`${f.basename}: ${t}`);
      else if (!TAXONOMY.includes(t)) (badTags[t] = badTags[t] || []).push(f.basename);
    }
    for (const name of [f.basename, ...asList(fmOf(f).aliases).map(String)]) {
      const key = name.toLowerCase();
      if (aliasOwner.has(key) && aliasOwner.get(key) !== f.basename) duplicates.add(`${aliasOwner.get(key)} ⇄ ${f.basename}`);
      else aliasOwner.set(key, f.basename);
    }
    const isConcept = ts.includes('wiedza/pojęcie'), isCompany = ts.includes('wiedza/firma'), isPerson = ts.includes('wiedza/osoba');
    if (isConcept || isCompany || isPerson) {
      const text = (await body(f)).trim();
      if (text.length < 20) (isConcept ? emptyConcepts : isCompany ? emptyCompanies : emptyPeople).push(f.basename);
    }
  }

  // --- Zettel review: duplicates and antitheses ------------------------------
  // For every zettel: the MOC areas it answers, the zettels it already cites under a '---' counter
  // section, and a crude word-stem set (6-letter prefixes) used to pre-select similar pairs.
  // The skill judges the pairs semantically; this only narrows ~40k pairs down to candidates.
  const areaOfQuestion = new Map();
  for (const a of areas.filter((x) => x.guiding)) {
    for (const q of [a.guiding, ...a.subs]) {
      const f = resolve(q, MOC_PATH);
      if (f) areaOfQuestion.set(f.path, a.name);
    }
  }
  const STOP = new Set(['jest', 'które', 'który', 'która', 'którą', 'żeby', 'jeśli', 'zanim', 'tylko', 'bardziej', 'przez', 'oraz',
    'może', 'możesz', 'musisz', 'pamiętaj', 'swoje', 'swoich', 'sobie', 'kiedy', 'jako', 'będzie', 'nawet', 'więcej', 'mniej', 'tego',
    'tych', 'takie', 'czyli', 'również', 'także', 'albo', 'czego', 'dlaczego', 'zamiast', 'jeszcze', 'wtedy', 'dopiero', 'każdy',
    'każde', 'twoją', 'twojej', 'twoim', 'ciebie', 'masz', 'jego', 'twój', 'twoje', 'twoja', 'gdzie', 'czym', 'nigdy', 'zawsze']);
  const stems = (text) => new Set((text.toLowerCase().replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .match(/[a-ząćęłńóśźż0-9]{4,}/g) || []).filter((w) => !STOP.has(w)).map((w) => w.slice(0, 6)));
  const zettelSet = new Set(zettels.map((z) => z.path));
  const zettelInfo = [];
  for (const z of zettels) {
    const [thesis, ...rest] = (await body(z)).split(/\n-{3,}[ \t]*\n/);
    const counterLinks = [...rest.join('\n').matchAll(/\[\[([^\]|#]+)/g)]
      .map((m) => resolve(m[1], z.path)).filter((t) => t && zettelSet.has(t.path)).map((t) => t.path);
    const links = new Set((cache(z).links || []).map((l) => mc.getFirstLinkpathDest(l.link, z.path)?.path).filter(Boolean));
    const zAreas = [...new Set(linkTargets(fmOf(z).dotyczy, z.path).map((t) => areaOfQuestion.get(t.path)).filter(Boolean))];
    zettelInfo.push({ z, zAreas, counterLinks, links, words: stems(`${z.basename} ${z.basename} ${thesis.slice(0, 600)}`) });
  }
  const zettelsByArea = {};
  for (const i of zettelInfo) {
    for (const a of i.zAreas.length ? i.zAreas : ['(poza MOC)']) {
      (zettelsByArea[a] = zettelsByArea[a] || []).push(`${i.z.basename}${i.counterLinks.length ? ` ⟂${i.counterLinks.length}` : ''}`);
    }
  }
  const similarPairs = [];
  for (let x = 0; x < zettelInfo.length; x++) {
    for (let y = x + 1; y < zettelInfo.length; y++) {
      const A = zettelInfo[x], B = zettelInfo[y];
      let shared = 0;
      for (const w of A.words) if (B.words.has(w)) shared++;
      const score = shared / Math.max(1, Math.min(A.words.size, B.words.size));
      if (shared >= 2 && score >= 0.2) {
        const linked = A.links.has(B.z.path) || B.links.has(A.z.path);
        const countered = A.counterLinks.includes(B.z.path) || B.counterLinks.includes(A.z.path);
        similarPairs.push({ score, line: `${A.z.basename} ⇄ ${B.z.basename} | ${score.toFixed(2)} | ${countered ? 'kontra jest' : linked ? 'powiązane' : 'bez powiązania'}` });
      }
    }
  }
  similarPairs.sort((a, b) => b.score - a.score);

  // --- Sources, todo markers, raw inbox, meetings, projects ------------------
  const sources = inNotes.filter((f) => tagsOf(f).some((t) => t.startsWith('input/') && t !== 'input/meet'));
  const sourceHasZettel = new Set(zettels.flatMap((z) => linkTargets(fmOf(z)['źródło'], z.path).map((t) => t.path)));
  // Also flags notes that look like they store secrets. Only note names are returned, never values.
  const todoMarkers = [], secrets = [];
  const SECRET = /(hasło|haslo|password|passwd|login|api[ _-]?key|secret|token)\s*[:=]\s*\S+/i;
  for (const f of files.filter((x) => isKnowledge(x.path))) {
    const text = await app.vault.cachedRead(f);
    const m = text.match(/#todo\/(zettel|cytat|przemysl)/g);
    if (m) todoMarkers.push(`${f.basename}: ${m.length}× ${[...new Set(m)].join(', ')}`);
    if (SECRET.test(text.replace(/```[\s\S]*?```/g, ''))) secrets.push(f.path);
  }
  // Sources from the last 60 days that have not produced a single zettel yet: material waiting for /make-zettels.
  const sourcesWaiting = sources
    .filter((f) => now - f.stat.ctime < 60 * DAY && !sourceHasZettel.has(f.path))
    .map((f) => `${f.basename} (${day(f.stat.ctime)}; dotyczy: ${asList(fmOf(f).dotyczy).map((v) => String(v).replace(/\[|\]/g, '')).join(', ') || '—'})`);

  // Journal activity: daily notes and morning pages with real content in the last 30 days.
  const journal = files.filter((f) => f.path.startsWith('00 Planer/01 Dziennik/'));
  const dateOf = (f) => Date.parse(f.basename.replace(/^Poranne strony - /, '').slice(0, 10));
  const lastMonth = journal.filter((f) => now - dateOf(f) < 30 * DAY && dateOf(f) <= now);
  let dailyWithContent = 0, morningPages = 0;
  for (const f of lastMonth) {
    const text = (await body(f)).replace(/\s+/g, '');
    if (text.length <= 50) continue;
    if (f.path.includes('/Poranne strony/')) morningPages++;
    else dailyWithContent++;
  }

  const raw = files.filter((f) => f.path.startsWith('99 Raw/'));
  const rawPending = raw.filter((f) => !fmOf(f).przetworzone).sort((a, b) => a.stat.ctime - b.stat.ctime);

  const meetings = inNotes.filter((f) => hasTag(f, 'input/meet'));
  const projects = inNotes.filter((f) => tagsOf(f).some((t) => t.startsWith('projekt/')));
  const today = day(now);

  return {
    generated: today,
    counts: {
      notes10: inNotes.length, zettels: zettels.length, sources: sources.length, meetings: meetings.length,
      projects: projects.length, rawTotal: raw.length, rawPending: rawPending.length,
      zettelsLast30: zettels.filter((z) => now - z.stat.ctime < 30 * DAY).length,
      zettelsLast90: zettels.filter((z) => now - z.stat.ctime < 90 * DAY).length,
    },
    zettelCreationDays: Object.entries(zettels.reduce((acc, z) => { const d = day(z.stat.ctime); acc[d] = (acc[d] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 3),
    areas: areaReport,
    zettelIssues,
    nonZettelMocLinks,
    zettelReview: {
      withCounter: zettelInfo.filter((i) => i.counterLinks.length).length,
      withoutCounter: zettelInfo.filter((i) => !i.counterLinks.length).length,
      byArea: zettelsByArea,
      similarPairs: similarPairs.slice(0, 60).map((p) => p.line),
      similarPairsTotal: similarPairs.length,
    },
    links: {
      unresolved: Object.entries(unresolved).filter(([t]) => !isDate(t)).map(([t, s]) => `${t} ← ${[...new Set(s)].slice(0, 3).join(', ')}`),
      unresolvedDates: Object.keys(unresolved).filter(isDate).length,
      orphans,
    },
    structure: {
      rootNotes: files.filter((f) => !f.path.includes('/')).map((f) => f.path),
      untitled: files.filter((f) => /^Untitled/i.test(f.basename)).map((f) => f.path),
      untagged, badTags, hashTags, duplicates: [...duplicates],
      emptyConcepts, emptyCompanies, emptyPeopleCount: emptyPeople.length,
    },
    sources: {
      withoutZettel: sources.filter((f) => !sourceHasZettel.has(f.path)).length,
      waiting: sourcesWaiting,
      todoMarkers,
    },
    secrets,
    journal: { dailyNotesWithContent30d: dailyWithContent, morningPages30d: morningPages },
    raw: { oldestPending: rawPending.slice(0, 5).map((f) => `${f.basename} (${day(f.stat.ctime)})`) },
    meetings: {
      withoutProject: meetings.filter((f) => !fmOf(f).projekt).length,
      participantsAsString: meetings.filter((f) => typeof fmOf(f).uczestnicy === 'string' && fmOf(f).uczestnicy.includes(',')).map((f) => f.basename),
    },
    projects: projects.map((f) => {
      const fm = fmOf(f);
      // Deadlines may be plain dates or links to daily notes, e.g. [[2024-09-01, ndz.]].
      const deadline = fm.deadline ? String(fm.deadline).replace(/^\[\[/, '').slice(0, 10) : null;
      return { name: f.basename, status: asList(fm.status).join(', ') || null, deadline, overdue: !!(deadline && deadline < today && !/Zakończone/.test(String(fm.status))) };
    }),
  };
})()
