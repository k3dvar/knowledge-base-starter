---
name: audit-vault
description: >-
  Audits the whole Obsidian vault and always ends with a numbered list of concrete fixes
  (exact notes and the skill or command for each), then executes only the numbers the user
  picks. Its centerpiece is the momentum of every area in [[Moje 12 Problemów]], growing ones
  included: which areas and questions are growing, which have stalled and which were never
  touched, plus the material already waiting that could move them. It also reviews the whole
  zettel base: finds duplicate theses and builds antitheses from existing zettels, with the
  counter text drafted and ready to add under `---`. It also covers the lint checks from CLAUDE.md (empty
  nodes, orphans, duplicates, tags outside the taxonomy, zettels with a wrong `dotyczy:`,
  dataview blocks missing sub-questions), the processing backlog (99 Raw, sources without
  zettels, #todo markers, meetings without a project), overdue projects, journal activity
  and notes that look like they store passwords. Use for "zrób audyt vaulta", "przegląd
  vaulta", "lint vaulta", "które pytania stoją w miejscu", "czego nie ruszam", "jak rozwija
  się mój second brain". Add "pełny" for a deeper semantic pass.
---

# Audit vault: dane → diagnoza → propozycje

Audyt najpierw **tylko czyta**, a raport zawsze kończy się ponumerowaną listą konkretnych
napraw. Żadnej naprawy nie wykonujesz, dopóki użytkownik nie wskaże jej numeru, zgodnie
z sekcją „Lint vaultu" w `CLAUDE.md`, która jest źródłem prawdy dla konwencji.

**Tryby:**
- **domyślny** opiera się na danych ze skryptu i ich interpretacji;
- **pełny** (gdy wywołanie zawiera słowo „pełny") dodaje czytanie treści wszystkich zettli
  w większych obszarach i ocenę, które pod-pytania są już wyczerpane (Krok 3).

## Krok 1 — Zbierz dane

Uruchom skrypt z katalogu vaultu. Zwraca JSON i niczego nie zmienia:

```bash
obsidian eval code="$(cat .claude/skills/audit-vault/scripts/collect.js)"
```

Nie licz niczego ręcznie, jeśli skrypt to już policzył. Gdy skrypt zwróci błąd, pokaż go
i zakończ, zamiast odtwarzać audyt na oko.

**Jak czytać daty.** Aktywność to data utworzenia pliku zettla. `zettelCreationDays` pokazuje
dni z największą liczbą zettli. Dzień z kilkudziesięcioma zettlami na starcie vaultu
to zwykle import, a nie praca nad pytaniem, więc zettle z tego dnia nie świadczą o ruchu
w obszarze. Daty mogą być przybliżone, jeśli pliki były przenoszone.

## Krok 2 — Moje 12 Problemów: co się rusza, a co stoi

To najważniejsza część raportu. Dla każdego obszaru (`areas`) nadaj status:

| Status | Warunek |
|---|---|
| 🟢 **Rozwija się** | Co najmniej jeden nowy zettel w ostatnich 30 dniach (`last30 > 0`). |
| 🟡 **Stoi w miejscu** | Ma zettle, ale najnowszy ma 30 dni lub więcej, albo wszystkie pochodzą z dnia importu. |
| 🔴 **Nieruszany** | Zero zettli w całym obszarze. |

Oprócz statusu sprawdź:
- **pod-pytania bez żadnego zettla** (`emptySubs`), także w obszarach, które się rozwijają;
- **nierównowagę**, czyli obszar z ponad 25% wszystkich zettli albo z 30-dniową aktywnością
  skupioną w jednym pod-pytaniu;
- **pytanie przewodnie z własnymi zettlami**, które są poprawne tylko przy tezach strategicznych
  (`CLAUDE.md`, „Nowy zettel", pkt 2);
- **utrzymanie `dataview`** (`dataviewMissing`) i brakujące notatki pytań
  (`missingQuestionNotes`).

**Omów każdy obszar, także 🟢.** Obszar, który się rozwija, też może mieć puste pod-pytania,
aktywność skupioną w jednym miejscu albo pytania już wyczerpane.

**Dla każdego obszaru 🟡 i 🔴 oraz dla każdego pustego pod-pytania w obszarze 🟢 poszukaj
materiału, który już czeka:**
1. Przejrzyj `sources.waiting`, czyli źródła z ostatnich 60 dni bez zettla, i wybierz te,
   których temat pasuje do obszaru.
2. Wykonaj 1–2 wyszukiwania kluczowych słów obszaru, np.
   `obsidian search query="<słowo>" path="10 Notatki" limit=10`. Szukasz
   źródeł, Story, Cytatów i pojęć, które dotykają tematu, ale nigdy nie dały zettla.
3. Wybierz jedną z czterech dróg jako naprawę do planu z Kroku 5:
   - `/make-zettels <notatka>` na konkretnym, znalezionym materiale;
   - źródło do przeczytania, gdy w vaulcie nic nie ma;
   - przeformułowanie albo scalenie pytania, gdy jest zbyt szerokie lub dubluje inne;
   - świadome zdjęcie pytania z MOC, gdy przestało być ważne.

## Krok 3 — Zettle: duplikaty i antytezy (zawsze)

Zettle to rdzeń wiedzy, więc audyt przegląda **całą ich bazę**, a nie tylko próbkę. Szuka
tez powtórzonych innymi słowami oraz buduje antytezy z tego, co już jest w vaulcie, zgodnie
z pkt 6 „Nowego zettla" w `CLAUDE.md` (kontra pod linią `---`).

**Dane ze skryptu (`zettelReview`):**
- `byArea` zawiera tytuły wszystkich zettli pogrupowane według obszarów MOC. Znacznik `⟂n`
  oznacza, że zettel ma już `n` linków do innych zettli pod `---`.
- `similarPairs` to wstępnie wybrane pary o wspólnym słownictwie, ze statusem „kontra jest",
  „powiązane" albo „bez powiązania". To tylko sito, więc wiele trafnych par w ogóle w nim
  nie wystąpi.
- `withCounter` i `withoutCounter` mówią, ile zettli ma kontrę, a ile nie.

**Przebieg:**
1. **Przeczytaj wszystkie tytuły z `byArea`**, obszar po obszarze, a potem przejrzyj całość
   jeszcze raz pod kątem par między obszarami (np. AI w pracy i uczenie się,
   sen i produktywność). Tytuł zettla to atomowa teza, więc większość dubli i napięć widać już
   na tym poziomie.
2. **Zbierz kandydatów**, czyli pary z `similarPairs` o statusie innym niż „kontra jest"
   i pary, które sam dostrzegłeś w tytułach. Szukaj zwłaszcza tez z tym samym zaleceniem,
   tez z przeciwnymi zaleceniami w tej samej sytuacji oraz tez absolutnych („nigdy",
   „zawsze", „tylko"), które inny zettel ogranicza.
3. **Przeczytaj oba zettle z każdej pary w całości** i przypisz parze jedną kategorię:

   | Kategoria | Kiedy | Naprawa |
   |---|---|---|
   | **Duplikat** | ta sama teza i to samo zalecenie, inne słowa | **do decyzji:** scal w jeden zettel |
   | **Antyteza** | przeciwne zalecenia albo jedna teza ogranicza zakres drugiej | dopisz kontrę pod `---` w obu zettlach |
   | **Wsparcie** | tezy się wzmacniają albo jedna wyjaśnia mechanizm drugiej | opcjonalny wzajemny link w treści, bez `---` |
   | **Wspólny temat** | tylko ten sam obszar, bez relacji między tezami | brak |

   Duplikatem nie jest para, w której jedna teza jest szczególnym przypadkiem drugiej. Taka
   para to wsparcie albo antyteza.
4. **Dla każdej antytezy przygotuj od razu treść kontry**, czyli 1–2 pełne zdania dla każdego
   z dwóch zettli. Mają mówić, na czym polega napięcie i kiedy wygrywa która teza,
   i linkować do drugiego zettla. Dzięki temu naprawa jest gotowa do wykonania bez
   ponownej analizy.
5. **Zettle bez kontry.** Dla zettli z tezą absolutną, dla których w bazie nie ma antytezy,
   odnotuj brak w raporcie zbiorczo, jako kandydatów do przyszłego szukania kontrargumentu
   w nowych źródłach. Nie wymyślaj kontry spoza vaultu.

Przy dużej bazie (ponad około 150 zettli) możesz rozdzielić krok 1–3 między subagentów, po
jednym na grupę obszarów. Każdy dostaje tytuły swojej grupy oraz pełną listę tytułów do
porównań między obszarami i zwraca pary z uzasadnieniem. Każdą zwróconą parę i tak
weryfikujesz sam, czytając oba zettle.

**Tryb pełny** dodaje:
- czytanie treści (a nie tylko tytułów) wszystkich zettli w obszarach z co najmniej
  5 zettlami, żeby wyłapać napięcia niewidoczne w tytułach;
- wskazanie **pod-pytań, na które zettle odpowiadają już w pełni**, co może oznaczać, że czas
  na trudniejsze pytanie.

## Krok 4 — Reszta vaultu

Z danych skryptu zbuduj pozostałe sekcje. Pokazuj liczby i do 10 przykładów na pozycję,
a pełne listy tylko na prośbę.

- **Bezpieczeństwo** (`secrets`): notatki, które wyglądają na zawierające hasła lub klucze.
  **Podaj wyłącznie nazwę notatki, nigdy wartości**, i umieść tę pozycję na górze raportu.
- **Zettle** (`zettelIssues`): brak `dotyczy:`, `dotyczy:` wskazujące coś spoza MOC (np. ogólny
  temat albo brak notatki) oraz nieistniejące `źródło:`.
- **Graf** (`links`, `structure`):
  - puste węzły, czyli linki bez notatki, z pominięciem dat;
  - sieroty;
  - kandydaci na duplikaty, czyli notatki, których nazwa lub alias pokrywa się z inną;
  - puste notatki-pojęcia i firmy, co łamie regułę „bez pustych linków";
  - liczba pustych notatek osób, która jest dozwolona i służy tylko jako informacja.
- **Taksonomia** (`structure`): notatki bez tagu (z pominięciem pytań z MOC), tagi spoza
  taksonomii, tagi z `#` we frontmatterze i pliki w roocie poza `CLAUDE.md` i `README.md`.
- **Przepływ** (`raw`, `sources`, `meetings`, `journal`):
  - nieprzetworzone klipy i najstarszy z nich;
  - liczba źródeł bez żadnego zettla;
  - wiszące markery `#todo/*`;
  - spotkania bez projektu;
  - `uczestnicy:` zapisane jako string;
  - dni z treścią w dzienniku i poranne strony w ostatnich 30 dniach.
- **Projekty** (`projects`): przekroczony `deadline` przy statusie innym niż `Zakończone`
  i projekty bez statusu.

## Krok 5 — Raport

Pokaż raport w rozmowie, w tej kolejności:

1. **Najważniejsze w trzech zdaniach**, czyli ogólny stan, największe ryzyko i najważniejszy
   ruch do zrobienia.
2. **⚠️ Bezpieczeństwo**, tylko jeśli coś wykryto.
3. **Moje 12 Problemów.** Najpierw tabela **wszystkich** obszarów w kolejności z MOC, bez
   pomijania tych, które się rozwijają:

   | Obszar | Status | Zettle (30 dni) | Ostatni zettel | Puste pod-pytania |
   |---|---|---|---|---|

   Pod tabelą napisz dla **każdego** obszaru 1–3 zdania. Przy 🟢 wskaż, co go napędza, oraz puste
   pod-pytania i nierównowagę, jeśli są. Przy 🟡 i 🔴 podaj puste pod-pytania i znaleziony
   materiał z Kroku 2.
4. **Zettle: duplikaty i antytezy** z Kroku 3. Podaj, ile zettli ma kontrę, a potem pokaż
   dwie tabele:

   | Duplikat | Dlaczego to ta sama teza | Który tytuł zostawić |
   |---|---|---|

   | Antyteza | Na czym polega napięcie | Kontra do dopisania (w obu zettlach) |
   |---|---|---|

   Pary „wsparcie" wymień krótko, a zettle z tezą absolutną bez kontry podaj zbiorczo.
5. **Stan vaultu** z sekcjami z Kroku 4, z liczbami i przykładami.
6. **Proponowane naprawy.** Ta sekcja jest **obowiązkowa** i zamyka każdy raport. Każdy
   problem z punktów 2–5 dostaje w niej konkretną naprawę, gotową do wykonania:

   | # | Naprawa | Czego dotyczy | Jak | Skala |
   |---|---|---|---|---|
   | 1 | Wyciągnij zettle z „Tytuł" dla pytania „…?" | obszar 3 | `/make-zettels Tytuł` | 1 notatka |
   | 2 | Załóż notatki dla pustych węzłów | graf | `/link-concepts <notatki źródłowe>` | 78 linków |

   - Uporządkuj naprawy według wartości dla MOC: najpierw bezpieczeństwo, potem ruch
     w obszarach 🔴 i 🟡, potem antytezy, duplikaty i błędy zettli oraz `dataview`, a na
     końcu porządki w grafie i taksonomii.
   - Każda antyteza to osobna naprawa z gotową treścią kontry, a każdy duplikat to osobna
     pozycja „do decyzji".
   - Każda naprawa wskazuje dokładne notatki albo polecenie, a nie ogólny kierunek. Typowe
     narzędzia są następujące:
     - puste węzły, notatki bez tagu i puste pojęcia obsługuje `/link-concepts`;
     - klipy obsługuje `/process-raw`;
     - źródła bez zettli i materiał dla stojących pytań obsługuje `/make-zettels`;
     - spotkania bez projektu obsługuje `/evening-review`;
     - drobne poprawki frontmattera (błędne `dotyczy:`, brakujące człony `dataview`,
       statusy projektów) robisz bezpośrednio.
   - Decyzje, które należą do użytkownika (zdjęcie pytania z MOC, scalenie duplikatów,
     usunięcie notatki, dane wrażliwe), oznacz jako **„do decyzji"** zamiast przesądzać wynik.
   - Na koniec zapytaj, które numery wykonać, np. „Napisz numery napraw do wykonania albo
     »wszystkie«".

Pisz pełnymi zdaniami, zgodnie ze stylem z `CLAUDE.md`. Raport nie trafia do vaultu, chyba
że użytkownik o to poprosi.

## Po akceptacji

Wykonuj wyłącznie naprawy o numerach wskazanych przez użytkownika, przez właściwe skille,
a nie ręcznymi poprawkami w obejściu ich reguł. „Wszystkie" nie obejmuje pozycji
„do decyzji", o które pytasz osobno. Zmiany w `[[Moje 12 Problemów]]` (nowe, przeformułowane
albo zdjęte pytania) wprowadzaj według `CLAUDE.md`, razem z aktualizacją bloków `dataview`
w notatkach pytań przewodnich. Masowe zmiany (dziesiątki plików) zapowiedz z liczbą plików,
bo przy włączonej synchronizacji generują duży ruch. Na koniec podaj, które naprawy wykonano, a które nie
i dlaczego.

**Antyteza.** Dopisz kontrę na końcu obu zettli. Jeśli zettel ma już sekcję pod `---`, dodaj
nowy akapit pod istniejącą kontrą zamiast tworzyć drugą linię. Każdy akapit linkuje do
drugiego zettla pełnym tytułem.

**Scalenie duplikatu.**
1. Zostaw zettel o lepszym tytule, czyli bardziej atomowym i w głosie „do siebie
   z przyszłości".
2. Przenieś do niego brakującą treść, połącz `dotyczy:` i `źródło:` oraz zachowaj kontry
   z obu zettli.
3. Przepnij linki do usuwanego zettla w całym vaulcie, także w `00 Planer/`.
4. Usuwany zettel przenieś do kosza (`app.vault.trash(file, true)`) dopiero wtedy, gdy nie
   ma już linków przychodzących.
