# Wyodrębnianie historii i cytatów

Procedurę wykonują `process-raw` i `process-book` po zapisaniu notatki źródłowej, a przed
`/link-concepts` i `/make-zettels`. Wejściem jest notatka źródłowa i odczytany materiał
pierwotny (pełny klip, tekst książki z numerami stron albo ręczne notatki). Story i Cytaty
powstają automatycznie, niezależnie od tego, czy materiał wnosi coś do `[[Moje 12 Problemów]]`.

## Zasady wspólne

- Zacznij od szablonów `90 Ekstra/91 Szablony/Story.md` i `Cytat.md`, z tagami `wiedza/story`
  i `wiedza/cytat` bez `#`.
- Każda historia i każdy cytat to osobna notatka w `10 Notatki/`, zapisana przez `path=`.
  Pliki nazywaj `Story — <opis zdarzenia>.md` albo `Cytat — <temat wypowiedzi>.md`, po polsku,
  z nazwami własnymi bez zmian i bez znaku `/`.
- `źródło:` to wikilink do **notatki źródłowej**, a nie do klipu ani URL-a. Przy kilku
  źródłach to lista wikilinków.
- `dotyczy:` to wikilinki do rzeczywistych tematów tej historii lub cytatu, sprawdzone
  z kanonicznymi nazwami i aliasami w vaulcie (np. `"[[AI]]"`, nigdy `#AI`). Nie kopiuj
  wszystkich tematów źródła i nie linkuj pytań z MOC.
- `## Miejsce w źródle` wskazuje stronę, rozdział, nagłówek albo znacznik czasu, wyłącznie
  z odczytanych danych. Bez takiego oznaczenia opisz fragment słowami i nie wymyślaj numeru.
- Nieczytelny lub niepełny tekst zgłoś jako ograniczenie. Nie odtwarzaj treści z pamięci
  ani ze streszczenia.

## Story

Story to konkretne zdarzenie, przypadek albo badanie, które da się opowiedzieć na warsztacie:
ktoś coś zrobił w jakiejś sytuacji i coś z tego wynikło. Temat nie musi dotyczyć AI. Ogólna
porada, lista funkcji albo sama teza bez przypadku nie wystarczają.

- `## Historia` opowiada własnymi słowami, kto, co i z jakim skutkiem, w długości na 1–2 minuty
  opowieści. Przy badaniu podaj pytanie, badanych, metodę, wynik i ograniczenia, o ile źródło
  je podaje. Nie dopowiadaj liczb ani przyczyn.
- Zachowaj status opisu: odróżnij rzeczywiste zdarzenie od demonstracji, symulacji albo relacji
  autora. Nie wzmacniaj sensacyjnego nagłówka ponad treść materiału.
- `## Do omówienia na warsztacie` wyjaśnia, jaki problem ilustruje historia, i proponuje jedno
  pytanie do uczestników. Oddziel własny pomysł od wniosków autorów.

## Cytat

Warunkiem jest **rzeczywisty cytat w materiale**, czyli wypowiedź ujęta w cudzysłów albo
wydzielona jako cytat (np. blokiem `>`). Nie kwalifikują się ciekawe zdania autora, nazwy
i terminy w cudzysłowie ani sam marker `#todo/cytat`.

- `## Cytat` zawiera wypowiedź w bloku `>`, dosłownie i w języku oryginału, bez poprawek
  i bez wikilinków. Polskie tłumaczenie dodaj osobno, z wyraźną etykietą.
- `autor:` to osoba, której wypowiedź przytoczono, a nie automatycznie autor źródła. Gdy
  mówiący jest nieznany, zostaw pole puste i wyjaśnij to w kontekście.
- `## Kontekst` wyjaśnia po polsku, czego dotyczy wypowiedź i gdzie padła, także to, że autor
  źródła cytuje kogoś innego.
- Porównaj zapis z materiałem. Gdy brzmienia nie da się pewnie ustalić, pomiń cytat i podaj
  powód.
- Nie dodawaj nowych `#todo/cytat`. Istniejący marker usuń dopiero wtedy, gdy cytat ma
  notatkę i odnośnik do niej. Resztę notatek użytkownika zostaw bez zmian.

## Duplikaty i połączenie ze źródłem

1. Przed zapisem przeszukaj istniejące `wiedza/story` i `wiedza/cytat`, porównując zdarzenie
   i uczestników albo treść i autora, a nie tylko tytuły. Uwzględnij odnośniki na dole źródła
   i notatki utworzone w bieżącym przebiegu.
2. Jeśli notatka istnieje, użyj jej. Gdy ta sama historia lub cytat pada w nowym źródle, dopisz
   je do listy `źródło:` i dodaj miejsce w tekście, zachowując ręczne dopiski. Nigdy nie twórz
   kopii pod nowym tytułem ani z numerem.
3. Na **samym dole** notatki źródłowej, po całej treści i blokach `dataview`, dodaj albo uzupełnij
   `## Wyodrębnione materiały` z podsekcjami `### Historie` i `### Cytaty`. Każdy punkt to pełne
   zdanie z linkiem, np. `- Historię do omówienia opisuje [[Story — …]].` Dodawaj tylko
   podsekcje z treścią, nie powielaj nagłówków ani linków i nie traktuj tej listy jako
   materiału źródłowego.
4. Zwróć listę utworzonych i ponownie użytych notatek z ich źródłami oraz braki materiału.
   Wynik zerowy jest poprawny.
