---
name: evening-review
description: >-
  Evening review of the Obsidian journal: reads daily notes, morning pages and the notes they
  link to, proposes projects for meetings that have none, collects open checkboxes and hidden
  commitments into the Todoist Inbox (without duplicates), links concepts via /link-concepts
  and writes a single "Wieczorne review" section into each daily note. Use for "wieczorne
  review", "review dnia", "przejrzyj dziennik", "zrób review", "co się działo dziś / w tym
  tygodniu", "sprawdź notatki z dzisiaj", "zindeksuj dziennik". Defaults to today; accepts
  a range such as "ostatni tydzień", "7 dni", "ostatnie 3 dni" or a single date. Supports an
  unattended mode for scheduled runs.
---

# Evening review: dziennik → spotkania → zadania → linki → sekcja review

Skill spina wpisy dziennika z resztą vaultu. `CLAUDE.md` jest źródłem prawdy dla konwencji.

## Tryb pracy

- **Tryb interaktywny** (domyślny) pozwala pytać użytkownika o decyzje.
- **Tryb bez nadzoru** obowiązuje, gdy wywołanie zawiera słowo `unattended` albo pochodzi
  z zadania zaplanowanego. Wtedy **niczego nie pytasz i niczego nie ustawiasz za użytkownika**,
  tylko zapisujesz propozycje w sekcji review, a wszystkie kroki wykonujesz do końca.

## Krok 0 — Zakres dat

Domyślnie analizujesz dzisiaj. „Ostatnie N dni" albo „ostatni tydzień" (N = 7) oznacza N dni
wstecz włącznie z dzisiaj, a konkretna data („wczoraj", „2026-06-29") oznacza tylko ten dzień.

Nazwę dnia generuj tym poleceniem (`i` to liczba dni wstecz), bo samo `%a` zwraca angielski
skrót („Thu"):

```bash
echo "$(date -v-${i}d +%Y-%m-%d), $(echo 'pon. wt. śr. czw. pt. sob. ndz.' | cut -d' ' -f$(date -v-${i}d +%u))"
```

Plik dziennika to `00 Planer/01 Dziennik/<data>.md`, np. `2026-09-24, czw..md`.

## Krok 1 — Zbierz notatki

Dla każdego dnia:
- wczytaj notatkę dzienną;
- wczytaj `00 Planer/01 Dziennik/Poranne strony/Poranne strony - <data>.md`, jeśli istnieje,
  bo jej brak jest normalny;
- pobierz linki wychodzące (`obsidian links path="<ścieżka dziennika>"`)
  i wczytaj podlinkowane notatki z `10 Notatki/`.

Ta lista notatek jest wejściem Kroku 4.

## Krok 2 — Spotkania bez projektu

Sprawdzasz **tylko spotkania zebrane w Kroku 1**, czyli notatki `input/meet` z pustym
`projekt:`, a nie cały vault. Projekt to notatka z tagiem `projekt/*`, a pole `projekt:`
zawiera wikilink do niej (`"[[Nowa strona WWW]]"`), nigdy goły tag. Listę projektów pobierz tak:

```bash
obsidian eval code="app.vault.getMarkdownFiles().filter(f=>{let t=app.metadataCache.getFileCache(f)?.frontmatter?.tags;t=Array.isArray(t)?t:[t];return t.some(x=>typeof x==='string'&&x.startsWith('projekt/'));}).map(f=>f.basename)"
```

Dopasuj każde spotkanie do projektu po temacie, uczestnikach, treści i wcześniejszych
spotkaniach z tej samej serii.

- **Tryb interaktywny:** zapytaj o każde przypisanie, a po akceptacji ustaw pole przez
  `app.fileManager.processFrontMatter` (`fm.projekt='[[<Projekt>]]'`).
- **Tryb bez nadzoru:** niczego nie ustawiaj, tylko zapisz propozycję z uzasadnieniem
  w sekcji review.

Jeśli żaden projekt nie pasuje, zaproponuj utworzenie notatki z szablonu `Projekt.md`. Nigdy
nie twórz projektu bez zgody.

## Krok 3 — Zadania i Todoist

1. **Otwarte checkboxy** `- [ ]` z notatki dziennej, porannych stron i podlinkowanych notatek
   (`obsidian tasks path="<ścieżka>" todo`). Puste checkboxy z szablonu,
   bez treści, pomiń.
2. **Ukryte zobowiązania** w treści, czyli intencje („powinienem…", „warto by…"), obietnice
   wobec innych („obiecałem X, że…"), niedokończone wątki („muszę jeszcze sprawdzić…") i decyzje
   do podjęcia („zastanawiam się, czy…"). Zapisz je jako konkretne, wykonalne zadania. Gdy
   w tekście nie ma takich sygnałów, niczego nie dodawaj.
3. **Todoist.** Użyj dostępnego w sesji narzędzia Todoist. Przed dodaniem **zawsze** wyszukaj
   każde zadanie po treści i pomiń te, które już istnieją. Nowe zadania dodaj jednym wywołaniem
   do Inboxa: `content` to zwięzła treść po polsku, `description` to pochodzenie, np.
   `ze: [[Nazwa notatki]]`. Jeśli narzędzie Todoist jest niedostępne, zapisz to w podsumowaniu
   i kontynuuj.

## Krok 4 — Dolinkuj pojęcia

Wywołaj `/link-concepts` na wszystkich notatkach z Kroku 1, także gdy wyglądają na puste
szkielety. Wtedy raport po prostu pokaże „brak". Ten krok wykonujesz przed zapisaniem sekcji
review, żeby jego wynik trafił do niej od razu.

## Krok 5 — Sekcja „Wieczorne review"

Na końcu każdej analizowanej notatki dziennej zapisz **jedną** sekcję. Jeśli `## Wieczorne
review` już istnieje (ponowny przebieg), uzupełnij ją o nowe pozycje narzędziem `Edit`, zamiast
dopisywać drugą.

```markdown
---

## Wieczorne review

### Zadania
- [ ] Konkretne zadanie (ze: [[Notatka]])

### Projekty spotkań
- [[Spotkanie]] → [[Projekt]] (ustawiono)
- [[Spotkanie]] → propozycja: [[Projekt]], bo …

### Linkowanie
- Dolinkowano: [[Pojęcie]] w [[Notatka]]
- Nowe notatki: [[Nowe pojęcie]] (pojęcie)
```

- Gdy zadań nie ma, napisz w `### Zadania` zdanie „Brak nowych zadań.", **bez checkboxa**,
  bo pusty checkbox jest fałszywym zadaniem.
- Nagłówek `### Projekty spotkań` różni się celowo od `### Spotkania`, który dopisuje
  `calendar-to-journal`. Pomiń podsekcję, gdy nie ma w niej treści.
- Przy wielu dniach każda notatka dzienna dostaje tylko pozycje, które jej dotyczą.

## Na koniec

Podsumuj w rozmowie zadania dodane do Todoist (i pominięte duplikaty), przypisane lub
proponowane projekty oraz raport z `/link-concepts`. Jeśli materiał ma potencjał na zettel
dla aktualnego pytania z `[[Moje 12 Problemów]]`, zaproponuj go, ale go nie twórz.
