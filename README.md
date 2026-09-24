# Knowledge Brain Starter

Pusty, gotowy do pracy vault Obsidiana z Claude Code, zbudowany w hybrydzie PARA + Zettelkasten. W środku nie ma żadnej wiedzy, jest tylko szkielet: struktura folderów, szablony, taksonomia tagów, `CLAUDE.md` z konwencjami i skille, które przerabiają surowe materiały na notatki, historie, cytaty i zettle.

> Nie kopiuj cudzej wiedzy, skopiuj szkielet. Wartość tego systemu zależy od danych, które do niego włożysz, i od pytań, na które szukasz odpowiedzi.

## Jak to działa

1. **Pytania.** Wszystko zaczyna się od [[Moje 12 Problemów]], czyli listy obszarów i pytań, które Cię zajmują (metoda 12 ulubionych problemów Richarda Feynmana). To filtr: materiał, który nie pomaga odpowiedzieć na żadne pytanie, nie musi trafiać do bazy.
2. **Przechwycenie.** Artykuł, wideo albo tweet zapisujesz Web Clipperem do `99 Raw/`.
3. **Obróbka.** `/process-raw` robi z klipu notatkę źródłową, wyodrębnia historie (Story) i cytaty, a potem linkuje pojęcia.
4. **Promocja.** `/make-zettels` proponuje atomowe tezy (zettle) przypięte do Twoich pytań. **Żaden zettel nie powstaje bez Twojej akceptacji.**
5. **Wynik.** `/write-article`, `/write-post` i `/write-comment` piszą treści z Twojego materiału i w Twoim głosie.

## Wymagania

- [Obsidian](https://obsidian.md) w wersji 1.12 lub nowszej, z włączonym CLI (*Ustawienia → Ogólne → Command line interface*).
- [Claude Code](https://docs.claude.com/en/docs/claude-code).
- Opcjonalnie [Obsidian Web Clipper](https://obsidian.md/clipper) w przeglądarce.

## Instalacja w 5 krokach

1. **Sklonuj repo** w miejsce, w którym chcesz trzymać vault:
   ```bash
   git clone <adres-repo> moja-baza-wiedzy
   ```
2. **Otwórz folder jako vault** w Obsidianie (*Open folder as vault*). Gdy Obsidian zapyta o pluginy społecznościowe, wybierz *Trust author and enable plugins*. Pluginy są już w repo.
3. **Uruchom Claude Code** w katalogu vaultu, przy otwartym Obsidianie:
   ```bash
   cd moja-baza-wiedzy && claude
   ```
   Przy pierwszym uruchomieniu zaakceptuj marketplace `obsidian-skills` i plugin `obsidian`, które włącza `.claude/settings.json`. Dają one Claude'owi skille do obsługi Obsidian CLI i składni Obsidiana.
4. **Zaimportuj szablon Web Clippera** z pliku `setup/web-clipper-99-raw.json` (*Web Clipper → Settings → Templates → Import*). Klipy trafią wtedy do `99 Raw/` z właściwościami, których oczekuje `/process-raw`.
5. **Wypełnij dwie notatki:**
   - `10 Notatki/Moje 12 Problemów.md`, w której zastępujesz przykładowy obszar swoimi pytaniami;
   - `10 Notatki/Styl pisania.md`, w której opisujesz swój głos, jeśli chcesz używać skilli `write-*`.

## Pierwsze 15 minut

1. Wpisz 3 pytania, które naprawdę Cię zajmują, do `Moje 12 Problemów`. Każde pytanie przewodnie potrzebuje notatki z blokiem `dataview`, a wzór jest w przykładowym obszarze. Możesz też poprosić Claude'a: *„Dodaj do MOC obszar X z pytaniem przewodnim Y i pod-pytaniami Z, razem z notatką pytania przewodniego."*
2. Zapisz Web Clipperem jeden artykuł na temat jednego z tych pytań.
3. W Claude Code wpisz `/process-raw`.
4. Przejrzyj notatkę źródłową, historie i cytaty, a potem zaakceptuj albo odrzuć propozycje zettli.
5. Otwórz notatkę pytania przewodniego i zobacz, że nowy zettel pojawił się na liście.

## Co jest w środku

```
knowledge-brain-starter/
├── CLAUDE.md                  # konwencje vaultu, źródło prawdy dla skilli
├── README.md
├── .claude/
│   ├── settings.json          # włącza plugin obsidian@obsidian-skills
│   └── skills/                # skille vaultu (tabela niżej)
├── .obsidian/                 # konfiguracja i pluginy społecznościowe
├── 00 Planer/01 Dziennik/     # notatki dzienne i poranne strony
├── 10 Notatki/                # cała wiedza, płasko
│   ├── Moje 12 Problemów.md   # MOC z przykładowym obszarem
│   └── Styl pisania.md        # szkic Twojego głosu do wypełnienia
├── 90 Ekstra/
│   ├── 91 Szablony/           # 13 szablonów notatek
│   └── 92 Pliki/              # załączniki
├── 99 Raw/                    # surowe klipy z Web Clippera
└── setup/                     # szablon Web Clippera
```

### Skille

| Skill | Co robi | Zależności |
|---|---|---|
| `/process-raw` | Przerabia klipy z `99 Raw/` na źródła, Story i Cytaty, linkuje pojęcia i proponuje zettle. | brak |
| `/process-book` | Przetwarza książkę z PDF-u albo z Twoich ręcznych notatek. | brak |
| `/make-zettels` | Bramka akceptacji zettli i nowych pytań w MOC. | brak |
| `/link-concepts` | Linkuje pojęcia, osoby i firmy oraz zakłada brakujące notatki. | brak |
| `/audit-vault` | Przegląd całego vaultu: które pytania się rozwijają, a które stoją, dublety i antytezy wśród zettli, puste węzły i sieroty. Kończy się numerowaną listą napraw do wyboru. | brak |
| `/write-article` | Pisze artykuł z Twojego zrzutu myśli i materiału z vaultu. | `Styl pisania.md` |
| `/write-post` | Pisze krótki post do mediów społecznościowych. | `Styl pisania.md` |
| `/write-comment` | Pisze komentarz pod cudzym tekstem i ocenia, czy trafia w temat. | `Styl pisania.md` |
| `/calendar-to-journal` | Przenosi spotkania z kalendarza do dziennika jako notatki spotkań. | połączenie z Google Calendar |
| `/evening-review` | Wieczorny przegląd dziennika, zadania do Todoist i linkowanie. | połączenie z Todoist |

Dwa ostatnie skille są opcjonalne. Bez połączeń z Google Calendar i Todoist po prostu zgłoszą brak integracji. Jeśli ich nie potrzebujesz, usuń ich katalogi z `.claude/skills/`.

### Pluginy Obsidiana

| Plugin | Po co | Licencja |
|---|---|---|
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | Listy zettli w pytaniach przewodnich i wiedza w notatkach książek. | MIT |
| [Tag Wrangler](https://github.com/pjeby/tag-wrangler) | Zmiana nazw i scalanie tagów. | ISC |
| [Local Images Plus](https://github.com/Sergei-Korneev/obsidian-local-images-plus) | Pobieranie obrazów z klipów do `90 Ekstra/92 Pliki/`. | MIT |
| [Calendar](https://github.com/liamcain/obsidian-calendar-plugin) | Kalendarz notatek dziennych w panelu bocznym. | MIT |

## Dostosowanie

- **Język.** Vault jest po polsku, łącznie z nazwami folderów, tagów i właściwości. Zmiana języka wymaga zmiany w `CLAUDE.md`, szablonach, skillach i `.obsidian/types.json` jednocześnie.
- **Taksonomia tagów.** Opisuje ją `CLAUDE.md`. Po jej zmianie zaktualizuj listę `TAXONOMY` w `.claude/skills/audit-vault/scripts/collect.js`.
- **Reguły.** Zmieniaj je w `CLAUDE.md`. Skille opisują tylko przepływ i odsyłają tam po konwencje.
- **System operacyjny.** Polecenia `date` w skillach `calendar-to-journal` i `evening-review` używają składni macOS (`date -v`). Na Linuksie poproś Claude'a o zamianę na `date -d`.

## Zasady, które warto zostawić

- **Najpierw pytania, potem notatki.** Baza bez pytań szybko zamienia się w kolekcję klipów.
- **Zettel zawsze po akceptacji.** AI może proponować tezy, ale decyzja, co uznajesz za wiedzę, należy do Ciebie.
- **Kontrargument pod linią `---`.** Wiedza bez kontry to tylko opinia.
- **Bez pustych linków.** Każde pojęcie, do którego prowadzi link, ma krótkie wyjaśnienie.
