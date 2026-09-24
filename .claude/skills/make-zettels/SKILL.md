---
name: make-zettels
description: >-
  Extracts atomic zettel candidates from a vault note or from pasted theses, maps each one to
  the current state of [[Moje 12 Problemów]], checks existing zettels for duplicates and
  counterarguments, and shows a proposal table for acceptance. Creates only the zettels (and new
  questions or areas) the user accepts. It is the shared final step of process-raw and
  process-book, and should also be used directly for requests like "zrób zettele z tej
  notatki", "zaproponuj zettle z <Tytuł>", "przepuść to przez bramkę zettli" or "zrób z tego
  zettel".
---

# Make zettels: teza → propozycja → akceptacja → zapis

Skill realizuje bramkę akceptacji zettli z `CLAUDE.md` (sekcja „Nowy zettel"), która jest
źródłem prawdy dla frontmattera, głosu i linkowania. Zettel to **jedyny** typ notatki
linkujący do pytań z `[[Moje 12 Problemów]]`, dlatego każda teza przechodzi tę samą bramkę.

## Wejście

- **Notatka w vaulcie** (źródło albo pojęcie). Wczytaj ją w całości i wypisz kandydatów na
  atomowe tezy. `źródło:` wskazuje tę notatkę.
- **Tezy wklejone wprost.** Potraktuj tekst jako listę kandydatów. Zapytaj o `źródło:` tylko
  wtedy, gdy teza wyraźnie pochodzi z konkretnej notatki; samodzielna myśl ma puste `źródło:`.

Jeśli nie wiadomo, który to przypadek, zapytaj.

## Krok 1 — Odczytaj świeży stan MOC

```bash
obsidian read path="10 Notatki/Moje 12 Problemów.md"
```

Lista pytań się zmienia, więc nigdy nie zakładaj wcześniejszego zestawu.

## Krok 2 — Przypisz każdą tezę

1. **Pasuje do istniejącego pod-pytania** → `dotyczy:` wskazuje to pod-pytanie.
2. **Pasuje do obszaru, ale żadne pod-pytanie jej nie oddaje** → zaproponuj nowe pod-pytanie.
3. **Nie pasuje do żadnego obszaru** → zaproponuj nowy obszar zamiast naciągać tezę. Przy
   obszernym źródle (`input/książka`) proponuj nowy obszar śmielej niż przy tweecie czy artykule.

Gdy wybór między 2 a 3 jest niejednoznaczny, pokaż obie opcje i zostaw decyzję użytkownikowi.

`dotyczy:` zawiera **wyłącznie** najwęższe trafne pytania z MOC, może ich być kilka. Ogólne
tematy (np. `[[sen]]`, `[[LLM]]`) idą do treści zettla jako wikilinki, nigdy do `dotyczy:`.

## Krok 3 — Duplikaty i kontrargumenty

Porównuj **tylko z zapisanymi już zettlami**, a nie z innymi propozycjami z tej samej tabeli.
Samo wyszukiwanie słów kluczowych przepuszcza duble sformułowane innymi słowami, więc zrób
dwie rzeczy:

1. **Przeczytaj tytuły wszystkich zettli z obszaru**, pod który trafia teza, czyli z bloku
   `dataview` w notatce jego pytania przewodniego. Tytuł zettla to atomowa teza, więc dubel
   albo antytezę zwykle widać już w nim.
2. **Wyszukaj w całej bazie** kilka wariantów kluczowych słów tezy, bo pasujący zettel może
   siedzieć w innym obszarze:

   ```bash
   obsidian search query="tag:#wiedza/zettel <słowo kluczowe>"
   ```

Każdego podejrzanego kandydata przeczytaj w całości, zanim uznasz go za dubel albo kontrę.

- **Duplikat** → nie proponuj zettla, tylko zaznacz w tabeli „już istnieje: `[[Tytuł]]`".
- **Teza przeciwna lub niuansująca** → w treści nowego zettla dodaj pod linią `---` kontrę
  z linkiem do tamtego zettla.

## Krok 4 — Przygotuj treść propozycji

- **Tytuł** to atomowa teza w głosie „do siebie z przyszłości" („Musisz…", „Możesz…",
  „Pamiętaj…").
- **Treść** jest jasna, bez skrótów myślowych i z wikilinkami do pojęć, osób i firm. Brakujących
  notatek-pojęć jeszcze nie zakładaj, bo propozycja może zostać odrzucona.

## Krok 5 — Tabela do akceptacji

Wszystkie propozycje (zettle, nowe pod-pytania, nowe obszary) pokaż w jednej tabeli, także
wtedy, gdy jest tylko jeden wiersz:

| # | Teza (tytuł zettla) | `dotyczy:` | `źródło:` | Decyzja |
|---|---|---|---|---|
| 1 | *Musisz…* | pytanie albo „nowe: …" | notatka | *(czekam na tak/nie)* |

Nie twórz niczego przed odpowiedzią i nie zakładaj „tak" za użytkownika. Jeśli materiał nic
nie wnosi do aktualnych pytań, powiedz to wprost i nie twórz zettla na siłę.

## Krok 6 — Zapisz zaakceptowane pozycje

Zettle twórz z szablonu `90 Ekstra/91 Szablony/Zettel.md`, z gołą formą tagów:

```bash
obsidian create path="10 Notatki/<Tytuł zettla>.md" silent content="..."
```

- **Nowe pod-pytanie:** dopisz je pod właściwym obszarem w `[[Moje 12 Problemów]]`, a potem
  w notatce pytania przewodniego dodaj człon `OR contains(dotyczy, [[<Nowe pod-pytanie>]])` do
  klauzuli `WHERE` bloku `dataview`. Bez tego zettle nowego pod-pytania nie pojawią się na liście
  domeny.
- **Nowy obszar:** dopisz sekcję w `[[Moje 12 Problemów]]` i utwórz notatkę
  `10 Notatki/<Nowe pytanie przewodnie>.md` z blokiem `dataview` wzorowanym na istniejących
  pytaniach przewodnich:

  ````
  ```dataview
  TABLE dotyczy AS "Dotyczy"
  FROM #wiedza/zettel
  WHERE contains(dotyczy, [[<Nowe pytanie przewodnie>]])
  SORT file.name ASC
  ```
  ````

## Krok 7 — Dolinkuj nowe zettle

Wywołaj `/link-concepts` na wszystkich zettlach zapisanych w Kroku 6. Jeśli nic nie
zapisano, pomiń ten krok.

## Na koniec

Najpierw podaj, ile tez rozpatrzono i ile odrzucono jako duplikaty (z linkami), i pokaż tabelę.
Po decyzji użytkownika potwierdź, co faktycznie powstało, i dołącz raport z `/link-concepts`.
