---
name: process-book
description: >-
  Processes a whole book, either from a PDF file (not epub) or from an existing `input/książka`
  note whose `## Notatki` section the user filled in by hand. Builds or completes the source
  note from the `Książka.md` template, extracts stories and real quotes into Story and Cytat
  notes, links everything via /link-concepts, and proposes zettels via /make-zettels, including
  a brand-new area in [[Moje 12 Problemów]] when the book's topic fits none. Use for
  "przetwórz tę książkę", "przeanalizuj ten PDF i zrób notatki", "zrób zettele z tej książki",
  "przetwórz notatkę <Tytuł>, dodałem tam notatki z książki ręcznie".
---

# Process book: tekst → notatka → Story i Cytaty → linki → zettle

`CLAUDE.md` jest źródłem prawdy dla tagów, frontmattera i linkowania. Ten plik opisuje przepływ
dla dwóch trybów wejścia.

## Krok 0 — Ustal tryb

- **Tryb PDF**, gdy na wejściu jest plik PDF.
- **Tryb notatki**, gdy na wejściu jest tytuł notatki. Sprawdź, że ma tag `input/książka`
  i niepustą sekcję `## Notatki`. W przeciwnym razie zapytaj, czy to właściwa notatka albo czy
  chodziło o PDF.

## Krok 1 — Wczytaj cały materiał

**Tryb PDF.** Czytaj PDF narzędziem `Read` fragmentami po maksymalnie 20 stron (`pages="1-20"`,
`"21-40"` …) aż do ostatniej strony, zachowując numery stron. Strony skanowane odczytaj jako
obrazy. Błąd odczytu nie oznacza końca książki, więc zanotuj nieodczytane strony i czytaj dalej.
**Musisz przejść całą książkę**, a nie tylko wstęp. Autora i tytuł ustal ze strony tytułowej,
a gdy się nie da, zapytaj.

**Tryb notatki.** Wczytaj całą notatkę. Ręczne `## Notatki` są jedynym materiałem wejściowym,
a autor i tytuł pochodzą z frontmattera.

## Krok 2 — Notatka źródłowa (tylko tryb PDF)

Najpierw sprawdź, czy książka ma już notatkę (tytuł, autor, wydanie). Jeśli tak, pracuj na niej,
zachowując ręczne dopiski i właściwości.

Jeśli nie, wypełnij szablon `90 Ekstra/91 Szablony/Książka.md`:
- `autor:` to `"[[Imię Nazwisko]]"`;
- `data ukończenia:` to dzisiejsza notatka dzienna. Datę z polskim skrótem dnia generuj tym
  poleceniem, bo samo `%a` zwraca angielski skrót („Thu"):
  ```bash
  echo "$(date +%Y-%m-%d), $(echo 'pon. wt. śr. czw. pt. sob. ndz.' | cut -d' ' -f$(date +%u))"
  ```
- `dotyczy:` to szerokie tematy książki (np. `"[[AI]]"`), a nie wąskie pojęcia ani pytania
  z MOC;
- w bloku `dataview` sekcji `## Wiedza` podstaw `{{title}}` tytułem notatki i nic więcej
  nie zmieniaj.

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="..."
```

## Krok 3 — Analiza treści

**Tryb PDF.** Dla każdego fragmentu dopisuj do `## Notatki` kluczowe tezy w punktach, pełnymi
zdaniami. Zanotuj dosłowne cytaty razem z mówiącym i stroną do Kroku 4. Nie zamieniaj zwykłego
zdania w cytat cudzysłowem.

**Tryb notatki.** Nie dopisuj własnej analizy i nie przepisuj sformułowań użytkownika. Wyszukaj
tylko cytaty i historie do Kroku 4.

W obu trybach **nie linkuj** jeszcze pojęć i nie dodawaj markerów `#todo/zettel` ani
`#todo/cytat`, bo wszystko to dzieje się w tym samym przebiegu.

## Krok 4 — Wyodrębnij Story i Cytaty

Wykonaj procedurę z [stories-and-quotes.md](../process-raw/references/stories-and-quotes.md),
przekazując notatkę książki i tekst PDF-u z numerami stron albo ręczne notatki. W trybie notatki
wyodrębniaj tylko to, co faktycznie w niej zapisano, i nie udawaj dostępu do całej książki.

## Krok 5 — Dolinkuj zapisane materiały

Wywołaj `/link-concepts` na notatce książki oraz utworzonych lub uzupełnionych Story i Cytatach.
Zrób to przed pokazaniem tabeli zettli.

## Krok 6 — Zaproponuj zettle

Wywołaj `/make-zettels <Tytuł notatki książki>`. Przy tak obszernym źródle `/make-zettels`
śmielej proponuje nowy obszar w MOC. Zettle zapisuje i dolinkowuje on sam, po akceptacji.

## Na koniec

Podsumuj:
- ile stron lub rozdziałów przetworzono i które strony były nieczytelne (w trybie notatki
  podaj zakres ręcznych notatek zamiast deklarować przeczytanie książki);
- utworzone i ponownie użyte Story oraz Cytaty albo informację, że ich nie było;
- raport z `/link-concepts`;
- tabelę z `/make-zettels`.
