# CLAUDE.md

Ten plik zawiera wskazówki dla Claude Code do pracy w tym vaulcie.

To **nie jest repozytorium kodu**, tylko osobisty „drugi mózg" w Obsidianie, prowadzony po **polsku** w hybrydzie PARA + Zettelkasten. Nazwy folderów, tagi, klucze właściwości i nazwy szablonów to polskie identyfikatory, które **należy zachowywać dosłownie**, razem z diakrytykami i prefiksami cyfrowymi. Treść notatek jest po polsku, tak jak ten plik.

> [!tip] Ten plik jest punktem startowym
> Dostosuj go do siebie. Zmieniaj reguły, gdy przestają Ci służyć, ale rób to tutaj, bo skille w `.claude/skills/` opisują tylko przepływ i odsyłają do tego pliku po konwencje.

## Styl pisania w treści notatek

Reguły dotyczą każdej treści dopisywanej do vaultu (źródeł, zettli, pojęć, podsumowań), a nie identyfikatorów systemu.

- **Wyłącznie pełne, gramatyczne zdania.** Nawet w punktach każdy punkt jest kompletnym zdaniem, bez równoważników i skrótów myślowych.
- **Zero hybryd polsko-angielskich.** Nie doczepiaj polskiej końcówki do angielskiego rdzenia ani odwrotnie, jeśli taki twór nie istnieje naturalnie w języku. Termin piszesz albo w pełni po polsku, albo jako nietknięty angielski wikilink (`[[reinforcement learning]]`).
- **Tytuły notatek też podlegają tej regule.** Domyślnie tytuł notatki-pojęcia jest po polsku („pamięć", a nie „memory"). Po angielsku zostają:
  - **nazwy własne** (`Kubernetes`, `Claude`, `Notion`);
  - **akronimy** używane w żargonie bez rozwijania (`LLM`, `RAG`, `MCP`);
  - terminy **tak specjalistyczne**, że nie mają naturalnego polskiego odpowiednika.

  Gdy sensowny polski odpowiednik istnieje, wybierz go (`uczenie ze wzmocnieniem`), a angielski oryginał przenieś do `aliases`. **Zawsze dodawaj alias w drugim języku.** Tytuł istniejącej notatki zmieniaj przez `obsidian rename`, a nie przez `mv`, bo tylko tak aktualizują się backlinki.
- **Wyjątki dziedzinowe (opcjonalne).** Jeśli w jakiejś dziedzinie kanoniczne są nazwy angielskie, wypisz je tutaj. Przykład: w notatkach o fotografii nazwy technik (`bracketing`, `panning`, `long exposure`) zostają po angielsku, a polskie odpowiedniki trafiają wyłącznie do `aliases`.

## ⭐ Moje 12 Problemów — serce vaultu

`[[Moje 12 Problemów]]` to **najważniejszy element vaultu**, czyli centralna Mapa Treści (MOC). Zawiera obszary z pytaniami przewodnimi i pod-pytaniami, sformułowanymi jako tytuły notatek, na które właściciel vaultu szuka odpowiedzi.

- **Lista jest dynamiczna.** Zanim cokolwiek z nią porównasz, **odczytaj jej aktualny stan** i nie zakładaj wcześniejszego zestawu pytań.
- **„12" to odwołanie do metody, a nie licznik.** Nazwa nawiązuje do *12 ulubionych problemów* **Richarda Feynmana**, który wierzył, że podświadomość stale pracuje nad zagadkami, jeśli da się jej odpowiednie ramy. Obszarów może być więcej lub mniej niż dwanaście, a **nazwy pliku nie zmieniamy**.
- **Do pytań linkuje wyłącznie zettel** (`wiedza/zettel`), zarówno w `dotyczy:`, jak i w treści. Źródła, Story, Cytaty, pojęcia, osoby, firmy, spotkania i treści `output/*` nigdy nie linkują do pytań z MOC.

### Listy zettli w pytaniach przewodnich

Każda notatka pytania przewodniego ma blok `dataview`, który zbiera zettle z całej domeny, łącząc operatorem `OR` samo pytanie przewodnie i wszystkie jego pod-pytania. Dzięki temu widać też zettle podpięte pod pod-pytania, czego natywne backlinki nie pokazują. Tytuły zapisujesz jak zwykłe wikilinki, bez cudzysłowów:

````
```dataview
TABLE dotyczy AS "Dotyczy"
FROM #wiedza/zettel
WHERE contains(dotyczy, [[Pytanie?]]) OR contains(dotyczy, [[Pod-pytanie?]])
SORT file.name ASC
```
````

**Reguła utrzymania.** Po dopisaniu nowego pod-pytania do MOC dodaj w notatce pytania przewodniego człon `OR contains(dotyczy, [[Nowe pod-pytanie?]])`. Przy zmianie nazwy pytania zaktualizuj ten człon. Nowy obszar dostaje od razu własną notatkę pytania przewodniego z takim blokiem. Nowe zettle pojawiają się na liście automatycznie.

## Przepływ wiedzy

Vault jest sterowany **taksonomią tagów** i **grafem wikilinków**, a nie folderami. Materiał przechodzi przez trzy etapy:

1. **Przechwycenie.** Źródło trafia do `10 Notatki/` z pasującego szablonu. Klipy z Web Clippera lądują najpierw w `99 Raw/`.
2. **Obróbka.** Powstaje podsumowanie z wnioskami, a konkretne historie i rzeczywiste cytaty trafiają do osobnych notatek Story i Cytat. Pojęcia są linkowane bez pustych węzłów.
3. **Promocja.** Tezy, które wnoszą coś do aktualnych pytań z MOC, stają się zettlami, **zawsze po akceptacji użytkownika**.

### Nowe źródło

Dotyczy artykułu, wideo, książki, kursu, tweeta i spotkania.

1. **Podsumowanie** mówi zwięźle, o czym jest materiał.
2. **Najważniejsze wnioski** są zapisane w punktach, pełnymi zdaniami.
3. **Pojęcia kluczowe są podlinkowane** według reguł z sekcji „Linkowanie".
4. **Propozycja zettla** pojawia się na końcu, jeśli materiał wnosi coś do aktualnego pytania z MOC. Zettla nie tworzysz bez akceptacji.

`dotyczy:` w źródle wskazuje ogólne notatki-tematy, np. `"[[Prokrastynacja]]"`.

**Markery `#todo/*`** służą do ręcznego czytania. Oznaczasz nimi fragmenty do późniejszej obróbki: `#todo/zettel` (myśl do wypromowania), `#todo/cytat` (cytat do wyodrębnienia) i `#todo/przemysl` (coś do przemyślenia). Przy obróbce przez skill **nie dodawaj nowych markerów**, bo zettle, Story i Cytaty powstają w tym samym przebiegu. Istniejący marker usuwasz dopiero wtedy, gdy jego treść faktycznie trafiła do właściwej notatki.

### Story i Cytat

- **Story** (`wiedza/story`) to konkretna historia, przypadek albo badanie do opowiedzenia na warsztacie, na dowolny temat. Ogólna porada albo sama teza nie wystarczają.
- **Cytat** (`wiedza/cytat`) powstaje wyłącznie z **rzeczywistej wypowiedzi** oznaczonej w materiale jako cytat, np. cudzysłowem albo blokiem `>`. Samo ciekawe zdanie autora się nie kwalifikuje. Cytat zachowuje dosłowne brzmienie i język oryginału, bez wikilinków wewnątrz. To wyjątek od pisania po polsku i od linkowania każdego wystąpienia. Kontekst piszesz po polsku i linkujesz normalnie. `autor:` wskazuje osobę cytowaną, a nie automatycznie autora źródła.

Oba typy powstają automatycznie, bez bramki akceptacji. Mają `źródło:` prowadzące do przetworzonej notatki źródłowej (nie do klipu) i `dotyczy:` z faktycznymi tematami. Przed zapisem sprawdzasz duplikaty, a na samym dole źródła utrzymujesz sekcję `## Wyodrębnione materiały` z podsekcjami `### Historie` i `### Cytaty`. Szczegółową procedurę opisuje `.claude/skills/process-raw/references/stories-and-quotes.md`.

### Nowy zettel (`wiedza/zettel`)

1. **`źródło:`** wskazuje notatkę, z której zettel powstał, a przy samodzielnej myśli zostaje puste.
2. **`dotyczy:`** wskazuje **najwęższe pytanie**, na które zettel faktycznie odpowiada, czyli zwykle pod-pytanie, a nie pytanie przewodnie obszaru. Przykład: `dotyczy: "[[Jak odróżnić wiedzę od informacji?]]"` zamiast `"[[Jak budować bazę wiedzy, która pomaga myśleć?]]"`. Pytań może być kilka. Pytanie przewodnie jest poprawne tylko wtedy, gdy zettel niesie tezę strategiczną dla całego obszaru. Ogólne tematy (`[[sen]]`, `[[LLM]]`) linkujesz w treści, nigdy w `dotyczy:`.
3. **Brak trafnego pytania** oznacza propozycję nowego pod-pytania albo nowego obszaru w MOC, zawsze do akceptacji.
4. **Głos to wiadomość do siebie z przyszłości**, czyli „**Musisz**", „**Możesz**", „**Pamiętaj**", „**Zaczniesz**" zamiast „Muszę", „Mogę". Tytuł zettla to atomowa teza.
5. **Zettel jest zrozumiały sam z siebie.** Każde pojęcie, na którym stoi teza (np. `[[chain of thought]]`), musi mieć notatkę-pojęcie z wyjaśnieniem. W zettlu ta reguła obowiązuje najostrzej.
6. **Kontrargument.** Przeszukaj istniejące zettle. Jeśli istnieje teza przeciwna lub niuansująca, dopisz ją pod poziomą linią `---` z linkiem. Przykład: zettel *„Bazy grafowe wymagają większych zasobów…"* ma pod linią kontrę „W większości przypadków do budowy systemów `[[RAG]]` wystarczy `[[baza wektorowa]]`".

## Linkowanie

- **Nie zostawiaj pustych linków.** Każde linkowane pojęcie bez notatki od razu dostaje notatkę z krótkim wyjaśnieniem, żeby klik zawsze prowadził do treści. Reguła obowiązuje we wszystkich notatkach wiedzy.
- **Co linkować.** Linkujesz rzeczowniki i pojęcia, które mogą mieć własną stronę i łączą notatki, przy **każdym** sensownym wystąpieniu, a nie tylko przy pierwszym. Słowa generyczne i czasowniki pomijasz, bo liczy się jakość węzłów.
- **Jedna nazwa i aliasy.** Nazwa węzła jest stała, a odmiany podpinasz aliasem `|` (`[[sen|snu]]`, `[[kora przedczołowa|korze przedczołowej]]`). Inaczej odmiana rozbija jeden węzeł na kilka.
- **MOC to kompas, a nie lista słów.** Pojęcia z aktualnych pytań mają priorytet, ale linkujesz też pojęcia spoza nich, bo mosty między tematami są najcenniejsze.
- **Treści wychodzące z vaultu** (`output/*`) nigdy nie cytują zettli tytułem ani ich nie linkują. Szczegóły opisują skille `write-*`.

### Notatki strukturalne: pojęcia, osoby, firmy, dzieła

Powstają masowo przy linkowaniu (`/link-concepts`). **Każda ma własny tag we frontmatterze**, żeby dało się ją odfiltrować w `dataview` i w plikach `.base`:

| Tag | Czym jest | Treść |
|---|---|---|
| `wiedza/pojęcie` | pojęcie, technika, substancja, termin żargonowy | jeden akapit po polsku o tym, czym to jest i po co |
| `wiedza/osoba` | autor, uczestnik spotkania, postać przywoływana w notatce | opcjonalne jedno zdanie o tym, kim jest i skąd ją znasz |
| `wiedza/firma` | organizacja, marka, produkt, narzędzie (`Anthropic`, `Obsidian`) | jeden akapit o tym, czym jest |
| `wiedza/dzieło` | film, serial, uniwersum albo utwór przywoływany w notatkach (`Diuna`, `Incepcja`), gdy nie jest przetwarzanym źródłem | jeden akapit o tym, czym jest to dzieło |

`wiedza/firma` opisuje byt ze świata, a `projekt/*` oznacza Twoją własną pracę prowadzoną w vaulcie. Opisu nie wymagają wyłącznie linki, których sensem jest sam tytuł, czyli pytania z MOC i notatki dat.

## Odpowiadanie na pytania z vaultu

1. **Najpierw zajrzyj do notatek**, zwłaszcza zettli i pojęć, a dopiero potem do wiedzy ogólnej.
2. **Cytuj źródło** wikilinkami do notatek, z których wynika odpowiedź.
3. **Priorytet mają zettle** jako gotowe, atomowe tezy, a notatki-pojęcia tłumaczą żargon.
4. **Przyznaj lukę.** Jeśli vault tego nie pokrywa, powiedz to wprost i zaproponuj źródło do przetworzenia, zamiast zmyślać.

## Układ vaultu

```
00 Planer/
  01 Dziennik/           # Notatki dzienne "YYYY-MM-DD, ddd.", np. "2026-09-24, czw."
    Poranne strony/      # "Poranne strony - YYYY-MM-DD, ddd.", jedna na dzień
10 Notatki/              # Wszystkie notatki wiedzy, płasko, bez podfolderów
90 Ekstra/
  91 Szablony/           # Szablony, podstawa każdej nowej notatki
  92 Pliki/              # Załączniki (skonfigurowany folder załączników)
99 Raw/                  # Surowe klipy z Web Clippera (input/raw), nie notatki wiedzy
setup/                   # Pliki pomocnicze do instalacji, nie notatki
```

- **`10 Notatki/`** zawiera źródła, zettle, Story, Cytaty, pojęcia, osoby, firmy, projekty, spotkania, pytania z MOC i treści `output/*`. W roocie vaultu leżą wyłącznie `CLAUDE.md` i `README.md`.
- **Notatki dzienne** mogą być pustymi szkieletami utworzonymi z wyprzedzeniem, co jest oczekiwane. Skrót dnia jest **zawsze po polsku**. Polecenie `date +%a` zwraca angielski skrót („Thu"), więc datę generuj tak:
  ```bash
  echo "$(date +%Y-%m-%d), $(echo 'pon. wt. śr. czw. pt. sob. ndz.' | cut -d' ' -f$(date +%u))"
  ```
- **`99 Raw/`** to archiwum klipów 1:1, które chroni przed link rot i pozwala na ponowną obróbkę. Klip przetworzony dostaje właściwość `przetworzone: "[[Notatka źródłowa]]"` i zostaje na miejscu. Usuwasz go tylko na wyraźną prośbę. Obrazy lokalizujesz wtyczką Local Images Plus do `90 Ekstra/92 Pliki/` tylko dla klipów, które będą jeszcze czytane.

## Szablony (`90 Ekstra/91 Szablony/`)

Każdą nową notatkę **zaczynasz od pasującego szablonu** i trzymasz się jego frontmattera.

| Szablon | Tag | Kiedy | Kluczowe właściwości i sekcje |
|---|---|---|---|
| `Artykuł.md` | `input/artykuł` | artykuł, wpis blogowy, dokumentacja webowa | tytuł oryginalny, autor, link, data ukończenia, dotyczy + `## Notatki` |
| `Video.md` | `input/video` | wideo, nagranie, wykład (najpierw zdobądź transkrypt) | tytuł oryginalny, autor, link, data ukończenia, dotyczy |
| `Książka.md` | `input/książka` | książka | autor, data ukończenia, dotyczy + `## Wiedza` (`dataview`) + `## Notatki` |
| `Kurs.md` | `input/kurs` | kurs online z lekcjami | autor (instruktor), link, status, data ukończenia, dotyczy + `## Lekcje` + `## Notatki` + `## Wiedza` (`dataview`) |
| `Tweet.md` | `input/tweet` | tweet albo wątek | autor, link, dotyczy |
| `Spotkanie.md` | `input/meet` | spotkanie, call | data ukończenia, temat, uczestnicy, projekt + `## Agenda` + `## Notatki` + `## Decyzje / Action items` |
| `Story.md` | `wiedza/story` | historia, przypadek, badanie do opowiedzenia | dotyczy, źródło + `## Historia` + `## Do omówienia na warsztacie` + `## Miejsce w źródle` |
| `Cytat.md` | `wiedza/cytat` | rzeczywisty cytat z materiału | dotyczy, źródło, autor + `## Cytat` + `## Kontekst` + `## Miejsce w źródle` |
| `Zettel.md` | `wiedza/zettel` | atomowa teza, jedyny typ linkujący do pytań z MOC | źródło, dotyczy |
| `Nowa treść.md` | `output/artykuł` albo `output/social` | własny artykuł albo post do publikacji (tag rozróżnia typ) | dotyczy |
| `Komentarz.md` | `output/komentarz` | komentarz pod cudzym tekstem | autor, link (tekst zewnętrzny) albo źródło (notatka w vaulcie), dotyczy |
| `Projekt.md` | `projekt/osobisty` (albo `projekt/praca`) | nowy projekt, do którego linkują spotkania | status, deadline, data ukończenia, dotyczy |
| `Poranne strony.md` | brak | poranne strony osadzane w notatce dziennej | osadza `[[…/Poranne strony - {{title}}]]` |

- **Silnikiem jest rdzeniowy plugin Templates** (bez Templatera), z formatem daty `YYYY-MM-DD, ddd.`. W UI placeholdery `{{title}}`, `{{date}}` i `{{time}}` podmieniają się same. **Przy tworzeniu z CLI podstawiasz je ręcznie**, także `{{title}}` w blokach `dataview`.
- **Bloki `dataview` w `Książka.md` i `Kurs.md`** zbierają każdą notatkę `#wiedza`, której `źródło` wskazuje daną notatkę (`WHERE contains(źródło, [[{{title}}]])`). Przy edycji zachowuj je bez zmian.
- **Bloki zapytań twórz wyłącznie w `dataview`.**

## Frontmatter

**Tagi** we frontmatterze piszesz w formie gołej, bez `#` i bez cudzysłowów (`- input/video`). Inline w treści tagi przetwarzania wymagają `#` (`#todo/zettel`).

**Taksonomia tagów** jest kręgosłupem vaultu, więc trzymaj ją spójną i nie wymyślaj nowych gałęzi:
- `input/*` oznacza źródła: `input/artykuł`, `input/video`, `input/książka`, `input/kurs`, `input/tweet`, `input/meet`, `input/raw`;
- `output/*` oznacza własne treści: `output/artykuł`, `output/social`, `output/komentarz`, a także `output/styl` dla notatki `Styl pisania`, która steruje skillami `write-*`;
- `wiedza/*` oznacza trwałą wiedzę: `wiedza/zettel`, `wiedza/pojęcie`, `wiedza/osoba`, `wiedza/firma`, `wiedza/dzieło`, `wiedza/story`, `wiedza/cytat`;
- `projekt/*` oznacza projekty: `projekt/praca`, `projekt/osobisty`;
- `todo/*` oznacza markery przetwarzania: `todo/zettel`, `todo/cytat`, `todo/przemysl`.

Jeśli zmienisz taksonomię, zaktualizuj też listę `TAXONOMY` w `.claude/skills/audit-vault/scripts/collect.js`.

**Klucze właściwości** są polskie, część ze spacjami, i piszesz je dokładnie tak: `tags`, `aliases`, `autor`, `dotyczy`, `źródło`, `status`, `uczestnicy`, `data`, `link`, `tytuł oryginalny`, `data ukończenia`, `temat`, `projekt`, `deadline`, `przetworzone` (tylko w klipach z `99 Raw/`). Typy części z nich definiuje `.obsidian/types.json`.

**Wartości:**
- `autor:` to notatka osoby, np. `"[[Gary Keller]]"`;
- `dotyczy:` to notatki tematów, a w zettlach pytania z MOC;
- `źródło:` to wikilink do notatki źródłowej, np. `"[[Jedna Rzecz]]"`, na którym opierają się bloki `dataview`;
- `data ukończenia:` to notatka dzienna, np. `"[[2026-07-01, śr.]]"`;
- `projekt:` to wikilink do **notatki-projektu**, np. `"[[Nowa strona WWW]]"`. Goły tag `projekt/praca` w tym polu nie tworzy projektu, więc najpierw zakładasz notatkę z `Projekt.md`;
- `status:` w projekcie przyjmuje wartości `Planowanie` → `Aktywny` → `Wstrzymany` → `Zakończone`;
- **właściwości wielowartościowe** (`uczestnicy`, `aliases`, `dotyczy`, `źródło`) zapisujesz jako listę YAML, po jednej wartości w wierszu, a nigdy jako string z przecinkami.

## Skille vaultu (`.claude/skills/`)

| Skill | Rola |
|---|---|
| `/process-raw` | Przetwarza klipy z `99 Raw/` w źródła, Story i Cytaty, a potem proponuje zettle. |
| `/process-book` | Przetwarza książkę z PDF-u albo z ręcznych notatek. |
| `/make-zettels` | Prowadzi bramkę akceptacji zettli i nowych pytań w MOC. |
| `/link-concepts` | Linkuje pojęcia i zakłada brakujące notatki strukturalne. Jest końcowym krokiem pozostałych skilli. |
| `/audit-vault` | Robi audyt całego vaultu: dynamikę pytań z MOC, dublety i antytezy wśród zettli, lint, zaległości w obróbce i bezpieczeństwo. Kończy się numerowaną listą napraw i wykonuje tylko wybrane pozycje. |
| `/write-article`, `/write-post`, `/write-comment` | Piszą treści w autorskim głosie według notatki `10 Notatki/Styl pisania.md`. |
| `/calendar-to-journal` | *Opcjonalny.* Przenosi spotkania z Google Calendar do dziennika. Wymaga połączenia z Google Calendar. |
| `/evening-review` | *Opcjonalny.* Robi review dziennika i przenosi zadania do Todoist. Wymaga połączenia z Todoist. |

Konwencje opisuje ten plik, a skille opisują tylko przepływ.

## Praca z vaultem z poziomu CLI

- **Odczyt, wyszukiwanie, tworzenie i właściwości** obsługujesz skillem `obsidian:obsidian-cli`, a składnię Obsidiana skillem `obsidian:obsidian-markdown`. Pliki `.base` i `.canvas` obsługują `obsidian:obsidian-bases` i `obsidian:json-canvas`. Te skille pochodzą z pluginu `obsidian@obsidian-skills`, który włącza `.claude/settings.json`.
- **Obsidian musi być uruchomiony**, a CLI włączone w ustawieniach Obsidiana. Polecenia `obsidian` trafiają do aktywnego vaultu. Jeśli masz otwartych kilka vaultów, dodawaj do poleceń `vault="<nazwa vaultu>"`.
- **⚠️ Notatki twórz zawsze przez `path=`, nigdy przez `name=`.** `obsidian create name="…"` tworzy plik w roocie vaultu, bo CLI ignoruje ustawienie domyślnego folderu. Poprawna forma to `obsidian create path="10 Notatki/<Tytuł>.md" content="..." silent`. Plik, który mimo to trafił do roota, przenieś przez `app.fileManager.renameFile(file, '10 Notatki/<Tytuł>.md')`, bo to aktualizuje linki. Tytuł nie może zawierać `/`.
- **Nazwy plików i wikilinki są mechanizmem łączenia.** Opcja `alwaysUpdateLinks` jest włączona, więc zmiany nazw kaskadują. Nie spłaszczaj polskich znaków w nazwach ani linkach.

## Konfiguracja Obsidiana (`.obsidian/`)

- **Widok:** domyślny tryb to `preview`, a `99 Raw/` jest wykluczony z wyszukiwania i grafu.
- **Pluginy społecznościowe:**
  - `dataview` renderuje bloki `dataview`;
  - `obsidian-local-images-plus` lokalizuje obrazy z klipów;
  - `tag-wrangler` służy do zmiany nazw i scalania tagów;
  - `calendar` daje widok kalendarza dla notatek dziennych.
- **Daty rdzeniowe:** notatki dzienne trafiają do `00 Planer/01 Dziennik`, a szablony do `90 Ekstra/91 Szablony`, oba w formacie `YYYY-MM-DD, ddd.`.
- **Synchronizacja:** jeśli włączysz Obsidian Sync albo inną synchronizację, unikaj masowych, mechanicznych przepisań, które generują duży ruch, chyba że zostały wyraźnie zlecone.

## Lint vaultu (przegląd na żądanie)

Gdy poproszę o przegląd, uruchom `/audit-vault`, **zgłoś listę problemów z propozycjami i niczego nie naprawiaj bez akceptacji**. Przegląd obejmuje co najmniej te pozycje:
- **sieroty**, czyli notatki bez linków przychodzących i wychodzących (np. `Untitled*`), do scalenia, dolinkowania albo usunięcia;
- **puste węzły**, czyli wikilinki bez notatki docelowej;
- **notatki strukturalne bez tagu** `wiedza/pojęcie`, `wiedza/osoba`, `wiedza/firma` albo `wiedza/dzieło`, a także tagi spoza taksonomii;
- **zettle bez `dotyczy:`** albo wskazujące nieistniejące pytanie z MOC;
- **sprzeczne lub nieaktualne tezy** między zettlami bez sekcji `---` z kontrą;
- **nieprzetworzone źródła** z wiszącym `#todo/*`;
- **zerwane linki** po zmianach nazw.
