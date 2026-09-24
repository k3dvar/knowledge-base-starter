---
name: write-post
description: >-
  Writes a short, professional social media post (e.g. LinkedIn) in the author's own voice,
  from given content, an existing vault note, a bare topic or zettels already in the vault.
  Plain text only, with no emoji, exclamation marks or markdown, ready to paste. Use for
  "napisz post na LinkedIn o…", "przygotuj post", "zrób z tego post", "skróć to do posta",
  or a social media version of an article. Voice and form rules live in the vault note
  `10 Notatki/Styl pisania.md`, section "Skrót dla posta".
---

# Write post: treść → teza → post → zapis

**Źródłem prawdy dla głosu i formy jest notatka `10 Notatki/Styl pisania.md`, sekcja „Skrót dla
posta"** (razem z częścią artykułową, do której ta sekcja odsyła). Wczytaj ją w całości narzędziem
`Read`, zanim napiszesz pierwsze zdanie. Ten plik opisuje tylko przepływ.

## Krok 1 — Teza

Wejściem jest gotowa treść, wskazana notatka w vaulcie (wtedy ją wczytujesz) albo sam temat.
Wyłuskaj z niego **konkretną tezę** i **dowód lub przykład**, który już w nim jest. Własnego
dowodu nie dopisujesz. Jeśli wejście jest zbyt ogólne na tezę, zapytaj.

## Krok 2 — Materiał (tylko gdy podano sam temat)

```bash
obsidian search query="tag:#wiedza/zettel <słowo kluczowe>"
obsidian search query="tag:#wiedza/story <słowo kluczowe>"
obsidian search query="tag:#wiedza/cytat <słowo kluczowe>"
```

Do posta wystarczy jeden mocny zettel, historia albo cytat.

## Krok 3 — Bramka braków

Jeśli teza nie ma pokrycia ani w wejściu, ani w materiale, **zatrzymaj się i powiedz**, czego
brakuje. Nie uzupełniaj braku wiedzą ogólną ani zmyślonym przykładem.

## Krok 4 — Tekst

Napisz post według łuku i wszystkich zasad z sekcji „Skrót dla posta". Szczególnie pilnuj
twardych zakazów z notatki stylu w zdaniu otwierającym, bo trafi ono też do tytułu notatki.

Nigdy nie cytuj zettla tytułem ani nie linkuj go. Post opuszcza vault, więc treść zettla
wplatasz jako własną myśl.

## Krok 5 — Autokorekta

Przejdź „Szybki test «czy to brzmi jak ja, ale krócej?»" z notatki stylu i popraw wszystko,
co wypada „nie". Wyniku testu nie pokazuj.

## Krok 6 — Zapisz notatkę

Użyj szablonu `90 Ekstra/91 Szablony/Nowa treść.md`, zamieniając tag na `output/social`.
`dotyczy:` wskazuje notatki tematów, nigdy pytania z `[[Moje 12 Problemów]]`. Tytuł notatki
to teza posta, czyli pierwsze zdanie, w razie potrzeby skrócone i bez znaku `/`.

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="..."
```

## Na koniec

Pokaż post jako czysty tekst gotowy do wklejenia, bez bloku kodu. Pod nim podaj, gdzie jest
notatka, z jakiego materiału skorzystałeś i co ewentualnie pominąłeś w Kroku 3.
