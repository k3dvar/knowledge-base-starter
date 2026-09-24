---
name: link-concepts
description: >-
  Adds wikilinks for concepts, people and companies in the given Obsidian notes (at every
  meaningful occurrence, with inflection aliases) and creates any missing target notes
  (wiedza/pojęcie, wiedza/osoba, wiedza/firma) following CLAUDE.md, then returns a fixed
  four-section report. Use when asked to link concepts ("dolinkuj pojęcia", "podlinkuj to",
  "zrób linki w tej notatce") and as the final step of process-raw, process-book, make-zettels,
  evening-review and calendar-to-journal. Input is a list of notes; if none is given, ask which
  notes to scan. Never use on content that leaves the vault (write-article, write-post,
  write-comment).
---

# Link concepts: indeks → linki → brakujące notatki → raport

Skill stosuje reguły `CLAUDE.md` „Nie zostawiaj pustych linków", „Co linkować" i „Jedna nazwa
+ aliasy" do **już zapisanej** treści notatek. `CLAUDE.md` jest źródłem prawdy dla konwencji,
a ten plik opisuje wyłącznie przepływ.

**Wejście** to lista notatek od skilla wywołującego albo od użytkownika. Skill nie ustala
zakresu dat ani nie szuka notatek sam. Jeśli wejścia brakuje, zapytaj, które notatki
przeskanować.

## Krok 1 — Pobierz indeks notatek (raz na całe wywołanie)

```bash
obsidian eval code="app.vault.getMarkdownFiles().filter(f=>f.path.startsWith('10 Notatki/')).map(f=>{const fm=app.metadataCache.getFileCache(f)?.frontmatter;return {n:f.basename,a:fm?.aliases||[],t:fm?.tags||[]};})"
```

Dopasowujesz po nazwie notatki i po aliasach, bez względu na wielkość liter.

## Krok 2 — Wczytaj notatki z wejścia

Wczytaj każdą notatkę na nowo narzędziem `Read`, z pełnej ścieżki w vaulcie. Nie polegaj na
treści zapamiętanej z wcześniejszych kroków, bo skill wywołujący mógł ją przed chwilą zmienić.

## Krok 3 — Dolinkuj pojęcia, które mają już notatkę

Dodaj wikilink przy **każdym** sensownym wystąpieniu pojęcia, a nie tylko przy pierwszym.
Odmianę podpinaj aliasem, np. `[[sen|snu]]` albo `[[kora przedczołowa|korze przedczołowej]]`.

**Nie ruszaj tych fragmentów:**
- frontmattera, bloków kodu, bloków `dataview`, adresów URL i istniejących `[[…]]`;
- dosłownych cytatów, czyli sekcji `## Cytat` w notatkach `wiedza/cytat` (razem z oznaczonym
  tłumaczeniem), bloków `>` i wypowiedzi przytoczonych w cudzysłowie w innych notatkach.
  Linkuj kontekst wokół cytatu, a same cytaty oznacz w raporcie zbiorczo jako zachowane.

Pytania z `[[Moje 12 Problemów]]` linkuj **wyłącznie w zettlach** (`wiedza/zettel`), nigdy
w źródłach, Story, Cytatach, dzienniku ani notatkach strukturalnych.

**Edytuj narzędziem `Edit`** na pliku w vaulcie, a nie regexem przez `obsidian eval`. Regex
nie rozumie kontekstu markdownu, a jego `\b` nie działa na słowach zaczynających się polską
literą (np. „żywica"). Używaj `replace_all` tylko wtedy, gdy dana forma nie pada w żadnym
z chronionych fragmentów.

## Krok 4 — Inwentarz terminów bez linku

Wypisz roboczo **wszystkie** pogrubienia, nazwy własne (osoby, firmy, produkty, narzędzia,
nazwane modele, zjawiska, badania) i terminy techniczne, które nadal nie mają linku. Dla każdej
pozycji podejmij jawną decyzję:

- **zasługuje na notatkę**, bo to pojęcie, które może łączyć notatki → załóż ją (Krok 5)
  i dolinkuj wszystkie wystąpienia;
- **świadomie pomijam**, bo to słowo generyczne, czasownik, tytuł cytowanej pracy albo
  jednorazowy przykład → zapisz krótki powód.

Nie przechodź do raportu, dopóki każda pozycja nie ma decyzji. Ten krok najczęściej ratuje
terminy przeoczone przy szybkim przeglądzie.

## Krok 5 — Załóż brakujące notatki

Najpierw sprawdź w indeksie, czy termin nie istnieje pod aliasem. Tytuł i aliasy dobieraj
według sekcji „Styl pisania w treści notatek" z `CLAUDE.md`, czyli domyślnie po polsku, z aliasem
w drugim języku, i z wyjątkami dziedzinowymi, jeśli `CLAUDE.md` je definiuje. Zapisuj zawsze przez
`path="10 Notatki/<Tytuł>.md"`, nigdy przez `name=`. Tytuł nie może zawierać `/`.

| Typ bytu | Tag | Treść |
|---|---|---|
| pojęcie, technika, substancja, termin | `wiedza/pojęcie` | Jeden akapit po polsku o tym, czym to jest i po co. |
| osoba | `wiedza/osoba` | Opcjonalne jedno zdanie o tym, kim jest ta osoba i skąd ją znasz. |
| firma, marka, produkt, narzędzie | `wiedza/firma` | Jeden akapit o tym, czym jest ten byt. |
| film, serial, uniwersum, utwór (gdy nie jest źródłem) | `wiedza/dzieło` | Jeden akapit o tym, czym jest to dzieło. |

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="---
tags:
  - wiedza/pojęcie
aliases:
  - <drugi język albo odmiany>
---
**<Tytuł>** to …"
```

W treści nowej notatki też linkuj pojęcia, jeśli mają sens jako węzły.

**Nigdy nie twórz** nowych pytań ani obszarów w `[[Moje 12 Problemów]]`, bo to należy do
`/make-zettels`. Kandydata na nowe pytanie zgłoś w raporcie jako obserwację.

## Krok 6 — Raport

Zwróć raport w tym formacie. Każdą z czterech sekcji podaj zawsze, a pustą oznacz słowem
„brak", żeby było widać, że została sprawdzona.

```
### Dolinkowano
- [[Pojęcie]] — N wystąpień w [[Notatka X]]

### Nowe notatki
- [[Nowe pojęcie]] (pojęcie | osoba | firma) — w [[Notatka X]]

### Świadomie pominięte
- „fraza" (w [[Notatka X]]) — powód

### Przeskanowane notatki
[[Notatka X]], [[Notatka Y]]
```
