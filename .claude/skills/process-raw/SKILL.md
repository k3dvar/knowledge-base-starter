---
name: process-raw
description: >-
  Turns Web Clipper clips from `99 Raw/` into proper source notes in `10 Notatki/` (article,
  video, tweet or book, detected from the link), automatically extracts stories and real quotes
  into Story and Cytat notes, links everything via /link-concepts and then proposes zettels via
  /make-zettels. Use for "przetwórz raw", "obrób inbox", "raw do notatek", "zrób notatki
  z klipów", "wyczyść 99 Raw", and for extracting stories or quotes from already processed
  sources ("wyciągnij historie i cytaty z przetworzonych materiałów"). By default handles only
  unprocessed clips; revisits the archive only on explicit request.
---

# Process raw: klip → źródło → Story i Cytaty → linki → zettle

Surowy klip to paliwo, a nie wiedza. Skill przekuwa go w notatkę źródłową, wyodrębnia z niej
historie i cytaty, a na końcu przekazuje materiał do bramki zettli. `CLAUDE.md` jest źródłem
prawdy dla tagów, frontmattera i linkowania.

Automatycznie powstają źródła, Story i Cytaty. Akceptacji wymagają wyłącznie zettle i nowe
pytania w MOC.

## Krok 0 — Znajdź nieprzetworzone klipy

Klip jest nieprzetworzony, gdy nie ma właściwości `przetworzone:`:

```bash
obsidian eval code="app.vault.getMarkdownFiles().filter(f=>f.path.startsWith('99 Raw/')&&!app.metadataCache.getFileCache(f)?.frontmatter?.przetworzone).map(f=>f.path)"
```

Z argumentem przetwarzasz tylko wskazany plik, a bez argumentu wszystkie po kolei. Pusta lista
oznacza koniec pracy, co trzeba powiedzieć wprost.

## Krok 1 — Sprawdź, czy źródło już istnieje

Brak `przetworzone:` nie dowodzi, że notatki źródłowej nie ma. Porównaj z notatkami w
`10 Notatki/` adres (bez parametrów śledzących, ale z identyfikatorem wpisu lub filmu),
`tytuł oryginalny`, tytuł i treść. Inny język tytułu albo ponownie zapisany klip to nadal
to samo źródło.

Jeśli źródło istnieje, uzupełnij tylko `przetworzone:` w klipie (Krok 4) i pomiń jego obróbkę.
Nigdy nie twórz kopii z innym tytułem ani numerem.

## Krok 2 — Wczytaj klip i rozpoznaj typ

Wczytaj klip i weź z frontmattera `source`/`link`, `author`, `title` i `published`. Typ
rozpoznaj **zawsze z domeny w linku** (dopasowanie podłańcuchem, bo linki mają `www.`,
`m.`, parametry itd.):

| Fragment domeny | Szablon | Tag |
|---|---|---|
| `x.com`, `twitter.com`, `threads.net`, `bsky.app` | `Tweet.md` | `input/tweet` |
| `youtube.com`, `youtu.be`, `vimeo.com`, `tiktok.com` | `Video.md` | `input/video` |
| brak URL, kontekst książki (okładka, ISBN) | `Książka.md` | `input/książka` |
| każdy inny URL | `Artykuł.md` | `input/artykuł` |

`Artykuł.md` to wybór ostateczny, gdy żaden wcześniejszy wiersz nie pasuje. Gdy linku brak,
poszukaj URL-a w treści klipu. Gdy nadal nie da się ustalić typu, zapytaj.

Przeczytaj wybrany szablon z `90 Ekstra/91 Szablony/`, żeby odwzorować jego klucze.

## Krok 3 — Utwórz notatkę źródłową

**Frontmatter** (gołe tagi, bez `#`):
- `tytuł oryginalny:` to dokładny tytuł z klipu;
- `autor:` to `"[[Imię Nazwisko]]"`;
- `link:` to URL źródła;
- `data ukończenia:` zostaje **puste**, bo wpisujesz je sam po przeczytaniu;
- `dotyczy:` wskazuje notatki tematów, nigdy pytania z `[[Moje 12 Problemów]]`.

**Treść** według reguły „Nowe źródło" z `CLAUDE.md`, czyli podsumowanie i najważniejsze wnioski
w punktach, pełnymi zdaniami. Na tym etapie **nie linkuj** pojęć, bo zrobi to Krok 6.
Nie wstawiaj markerów `#todo/zettel`, bo zettle są proponowane w tym samym przebiegu. Zanotuj
dosłowne brzmienie cytatów i miejsca z historiami do Kroku 5, zamiast polegać na własnym
streszczeniu.

**Tytuł pliku** to naturalne polskie tłumaczenie tytułu oryginału, z nietkniętymi nazwami
własnymi. Przykład: „How Claude Code is used in practice" daje plik
`Jak Claude Code jest używany w praktyce.md`. Tytuł nie może zawierać `/`.

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="..."
```

## Krok 4 — Zepnij klip z notatką

```bash
obsidian eval code="(async()=>{const f=app.vault.getAbstractFileByPath('99 Raw/<plik>.md');await app.fileManager.processFrontMatter(f,fm=>{fm.przetworzone='[[<Tytuł>]]';});})()"
```

Klip zostaje w `99 Raw/` jako archiwum. Usuń go tylko na wyraźną prośbę.

## Krok 5 — Wyodrębnij Story i Cytaty

Wykonaj procedurę z [stories-and-quotes.md](references/stories-and-quotes.md), przekazując
notatkę źródłową i pełny tekst klipu. Brak historii albo cytatów jest poprawnym wynikiem.

## Krok 6 — Dolinkuj zapisane materiały

Wywołaj `/link-concepts` na wszystkich źródłach z tego przebiegu oraz na utworzonych lub
uzupełnionych Story i Cytatach. Zrób to przed pokazaniem tabeli zettli, żeby zapisane
materiały były kompletne niezależnie od decyzji o zettlach.

## Krok 7 — Zaproponuj zettle

Wywołaj `/make-zettels <Tytuł notatki>` osobno dla każdego źródła i pokaż tabele łącznie.
Po akceptacji `/make-zettels` sam zapisuje i dolinkowuje zettle.

## Tryb archiwum: uzupełnij wcześniej przetworzone materiały

Uruchamiaj go **tylko** na wyraźną prośbę o historie lub cytaty z przetworzonych już źródeł.

1. Zakresem jest wskazana notatka albo, przy prośbie o wszystko, unikalne notatki z
   `przetworzone:` w `99 Raw/` oraz źródła `input/*` w `10 Notatki/` (bez `input/raw`). Każdą
   notatkę bierzesz raz.
2. Wczytaj notatkę i materiał pierwotny (klip, PDF, transkrypt, ręczne notatki). Samo
   streszczenie nie wystarczy do odtworzenia cytatu. Jeśli materiału nie ma lokalnie, spróbuj
   otworzyć link. Brak dostępu zgłoś i przejdź do następnej notatki.
3. Wykonaj Kroki 5 i 6, zachowując treść, właściwości i `przetworzone:`. Nie twórz źródła od
   nowa i nie proponuj zettli, chyba że użytkownik o to poprosi.

## Na koniec

Podsumuj:
- klipy przetworzone i **rozpoznany typ każdego** (np. „video → input/video"), żeby pomyłka
  była widoczna od razu;
- klipy pominięte, bo źródło już istniało;
- utworzone i ponownie użyte Story oraz Cytaty albo informację, że ich nie było;
- raport z `/link-concepts`;
- tabele z `/make-zettels`;
- braki dostępu do materiału.

W trybie archiwum podaj liczbę sprawdzonych źródeł, nowe odnośniki i źródła, których nie udało
się odczytać, bez tabeli zettli.
