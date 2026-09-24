---
name: write-article
description: >-
  Writes a new article (`output/artykuł`) in the author's own voice, starting from their
  thought dump on the topic (pasted directly or given as the title of an existing vault note)
  and building the argument on material already in the vault: zettels, Cytat and Story notes
  and quotes from book notes. Stops to report missing material instead of inventing it. Use
  for "napisz artykuł o…", "zbuduj tekst z zettli o…", "przygotuj wpis blogowy na temat…",
  "rozwiń to w artykuł", "napisz artykuł z notatki <Tytuł>". Voice and form rules live in the
  vault note `10 Notatki/Styl pisania.md`, section "Pełne zasady (artykuł)".
---

# Write article: transkrypcja → materiał → bramka braków → tekst → zapis

**Źródłem prawdy dla głosu i formy jest notatka `10 Notatki/Styl pisania.md`, sekcja „Pełne
zasady (artykuł)".** Wczytaj ją w całości narzędziem `Read`, zanim napiszesz pierwsze zdanie,
i stosuj przy każdym zdaniu. Ten plik opisuje tylko przepływ. Konwencje zapisu notatki pochodzą
z `CLAUDE.md`.

## Krok 1 — Teza z transkrypcji

Transkrypcja jest wklejona w prompcie albo podana jako tytuł notatki, którą wtedy wczytujesz
w całości. Jeśli notatki nie ma, zapytaj o właściwy tytuł.

Wyłuskaj z niej:
- **główną tezę**, która zasili otwierającą kontrowersję;
- **wątki poboczne** do części „obrona";
- **przykłady i anegdoty**, które już podałeś, bo tylko one mogą zasilić wątek osobisty.

**Transkrypcja może skakać między wątkami, bo to zrzut myśli, a nie gotowy plan.** Jeśli widać jeden dominujący
wątek z dygresjami, dygresje stają się materiałem na „obronę". Jeśli widać dwa lub więcej wątków
o podobnej wadze albo wątek urwany bez powrotu, **zatrzymaj się przed szukaniem materiału**.
Pokaż wyłuskane tezy jako krótką listę po jednym zdaniu i zapytaj, która jest główna. Długość
fragmentu nie przesądza o tym, który wątek jest główny.

Jeśli transkrypcja podaje tylko szeroki temat bez tezy, zapytaj o tezę.

## Krok 2 — Zbierz materiał z vaultu

Artykuł stoi przede wszystkim na materiale z vaultu, a nie na wiedzy ogólnej. Szukaj kilkoma
wariantami słów kluczowych:

```bash
obsidian search query="tag:#wiedza/zettel <słowo kluczowe>"
obsidian search query="tag:#wiedza/cytat <słowo kluczowe>"
obsidian search query="tag:#wiedza/story <słowo kluczowe>"
obsidian search query="tag:#input/książka <słowo kluczowe>"
```

Każde trafienie przeczytaj w całości. Kontra pod `---` w zettlu to gotowy materiał na
„obronę", a Story daje anegdotę. W notatkach książek cytaty bywają zapisane jako linijka
`"cytat" Autor`.

## Krok 3 — Bramka braków

Jeśli teza albo ważny wątek nie ma pokrycia w materiale, **zatrzymaj się i powiedz**, czego
brakuje i co by pomogło (zettel z jakiego źródła, cytat, pominięcie wątku). Nigdy nie
uzupełniaj braku wiedzą ogólną ani zmyślonym przykładem. Wątek poboczny, który da się pominąć
bez osłabienia tezy, pomiń i zgłoś to w podsumowaniu.

## Krok 4 — Plan i tekst

Zaplanuj łuk z notatki stylu (kontrowersja → obrona → wniosek) i napisz tekst zgodnie ze
wszystkimi jej zasadami. Najczęściej łamane są zakazy z sekcji „Czego unikać (twarde zakazy)", więc sprawdź je
szczególnie uważnie.

**Linki w tekście, który opuszcza vault:**
- **Nigdy nie cytuj zettla tytułem ani nie linkuj go wikilinkiem.** Zettel to Twoja własna,
  przetrawiona myśl, więc wplatasz jego treść w argumentację jako własne zdanie.
- Wikilinki do nazw bytów (pojęcia, narzędzia, osoby, firmy, np. `[[Claude Code]]`) mogą zostać.
  Rozróżnik jest prosty: tytuł w formie zdania-tezy oznacza zettel, którego nie linkujesz,
  a nazwa bytu oznacza pojęcie, które linkujesz.
- Cytaty przytaczaj dosłownie w bloku `>` z autorem, np.
  `> Treść cytatu. — Autor, [[Tytuł książki]]`.

## Krok 5 — Autokorekta

Przejdź punkt po punkcie „Szybki test «czy to brzmi jak ja?»" z notatki stylu i popraw
wszystko, co wypada „nie". Wyniku testu nie pokazuj.

## Krok 6 — Zapisz notatkę

Użyj szablonu `90 Ekstra/91 Szablony/Nowa treść.md` z tagiem `output/artykuł`. `dotyczy:`
wskazuje notatki tematów, nigdy pytania z `[[Moje 12 Problemów]]`. Tytuł notatki to tytuł
artykułu.

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="..."
```

## Na koniec

Pokaż gotowy tekst, wymień wykorzystane zettle, cytaty i Story, a jeśli coś pominąłeś
w Kroku 3, napisz co i dlaczego.
