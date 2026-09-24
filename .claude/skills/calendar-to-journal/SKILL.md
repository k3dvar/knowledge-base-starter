---
name: calendar-to-journal
description: >-
  Syncs Google Calendar meetings into the Obsidian journal: fetches the day's events, creates
  a meeting note from the `Spotkanie.md` template for each real meeting (with participants as
  person notes), and lists them with start times under "Spotkania" in the daily note.
  Idempotent, so it is safe to re-run. Use for "wstaw spotkania z kalendarza", "co mam dziś
  w kalendarzu", "utwórz notatki ze spotkań", "dodaj spotkania do dziennika", "zsynchronizuj
  kalendarz", "przygotuj dzień z kalendarza". Defaults to today; accepts "jutro", "pojutrze"
  or a specific date.
---

# Calendar to journal: kalendarz → notatki spotkań → dziennik

Każde spotkanie z kalendarza staje się notatką w vaulcie, gotową na kontekst i wnioski.
`CLAUDE.md` jest źródłem prawdy dla konwencji.

## Krok 0 — Ustal dzień

Domyślnie to dzisiaj, „jutro" to `-v+1d`, „pojutrze" to `-v+2d`, a konkretną datę podajesz
przez `-j -f %Y-%m-%d <data>`. Nazwę notatki dziennej generuj tym poleceniem, bo samo `%a`
zwraca angielski skrót („Thu"):

```bash
echo "$(date -v+0d +%Y-%m-%d), $(echo 'pon. wt. śr. czw. pt. sob. ndz.' | cut -d' ' -f$(date -v+0d +%u))"
```

Plik dziennika to `00 Planer/01 Dziennik/<data>.md`, np. `2026-09-24, czw..md`. Zwykle już
istnieje jako pusty szkielet, więc dopisujesz do niego. Tworzysz go tylko wtedy, gdy go brakuje.

## Krok 1 — Pobierz wydarzenia

Użyj dostępnego w sesji narzędzia Google Calendar do listowania wydarzeń, z zakresem od 00:00
do 23:59:59 wybranego dnia w lokalnej strefie czasowej użytkownika, i pobierz wszystkie strony wyników.
Jeśli integracja jest niedostępna, powiedz to i zakończ, bez tworzenia spotkań z domysłów.

**Pomiń** wydarzenia całodniowe będące markerami (urlop, święto, OOO), wydarzenia bez tytułu
albo z samym emoji oraz własne bloki skupienia bez innych uczestników.
**Zachowaj** każde wydarzenie z uczestnikami i każde, którego tytuł wskazuje na spotkanie
(call, sync, review, 1:1, rozmowa, briefing). Gdy nic nie zostaje, powiedz to i zakończ.

## Krok 2 — Utwórz notatki spotkań

**Tytuł** to tytuł wydarzenia. Spotkania cykliczne i tytuły ogólne dostają zawsze sufiks daty,
np. `Anna - Piotr - Status - 2026-09-24`. Tytuł nie może zawierać `/`.

**Idempotencja:** jeśli `10 Notatki/<Tytuł>.md` już istnieje, nie twórz go ponownie, tylko użyj
go przy linkowaniu w dzienniku.

**Frontmatter** według szablonu `90 Ekstra/91 Szablony/Spotkanie.md`:

```yaml
---
tags:
  - input/meet
data ukończenia: "[[2026-09-24, czw.]]"
temat: Tytuł wydarzenia
uczestnicy:
  - "[[Imię Nazwisko]]"
  - "[[Imię Nazwisko 2]]"
projekt:
---
```

- `uczestnicy:` to **lista YAML**, jeden link w wierszu, a nigdy string z przecinkami, którego
  Obsidian nie rozpozna jako listy. Siebie, czyli właściciela kalendarza, pomiń.
- Każdy uczestnik bez notatki (sprawdź też aliasy) dostaje notatkę osoby z tagiem
  `wiedza/osoba`. Jedno zdanie kontekstu dopisz tylko wtedy, gdy wynika z danych, np. adres
  w domenie firmy właściciela kalendarza daje zdanie „**Imię Nazwisko** pracuje w <firma>.".
  Nie przypisuj tej firmy osobom z zewnątrz.
- `projekt:` zostaje puste, chyba że tytuł albo opis wydarzenia jednoznacznie wskazują
  notatkę-projekt. Wtedy wpisz do niego wikilink.

**Treść** skopiuj z szablonu, czyli sekcje `## Agenda`, `## Notatki` i
`## Decyzje / Action items`.

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="..."
```

## Krok 3 — Zlinkuj spotkania w dzienniku

Jeśli notatka dzienna nie ma sekcji `### Spotkania`, dopisz ją:

```markdown
### Spotkania

- 09:30 [[Tytuł spotkania 1]]
- 11:15 [[Tytuł spotkania 2]]
```

Godzina to start wydarzenia w lokalnej strefie czasowej użytkownika. Jeśli sekcja istnieje, dopisz w niej
tylko brakujące pozycje, w kolejności chronologicznej.

## Krok 4 — Dolinkuj pojęcia

Wywołaj `/link-concepts` na notatkach spotkań z tego przebiegu. Świeże szkielety zwykle nie mają
nic do zlinkowania i to jest normalne, ale notatki wypełnione przed ponownym uruchomieniem mogą
już coś zawierać.

## Na koniec

Podsumuj liczbę pobranych wydarzeń, utworzone i istniejące notatki spotkań, nowe notatki osób,
pozycje dopisane do dziennika, raport z `/link-concepts` oraz niejasności do ręcznego
uzupełnienia (np. wydarzenie bez uczestników albo niepewny projekt).
