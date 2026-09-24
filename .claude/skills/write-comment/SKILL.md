---
name: write-comment
description: >-
  Writes a comment under someone else's text (a post, an article or another comment) in the
  author's own voice, from the source text (pasted, a vault note or a URL) plus the author's
  thought dump on how to respond, then always shows a visible fit analysis of whether the
  comment actually answers the source or drifts away from it. Saves the comment as an
  `output/komentarz` note. Use for "skomentuj to", "napisz komentarz do…", "odpowiedz na ten
  post", "przygotuj komentarz pod…". Input format: `<source text> | <thought dump>`. Rules live
  in `comment-rules.md` next to this file.
---

# Write comment: źródło + zrzut myśli → komentarz → analiza trafności → zapis

Substancję dobrego komentarza opisuje [comment-rules.md](comment-rules.md), a formę notatka
`10 Notatki/Styl pisania.md`, sekcja „Skrót dla posta". **Wczytaj oba pliki w całości, zanim
napiszesz pierwsze zdanie.** Ten plik opisuje tylko przepływ.

## Krok 1 — Dwa wejścia

1. **Tekst źródłowy** to tekst wklejony, notatka w vaulcie (wtedy ją wczytujesz) albo URL
   (wtedy pobierasz treść skillem `obsidian:defuddle`, a w razie problemów `WebFetch`).
2. **Zrzut myśli** to Twoja surowa reakcja na ten tekst.

**Zanotuj od razu pochodzenie źródła**, czyli URL albo tytuł notatki, bo Krok 7 go wymaga.

Separatorem obu części jest pierwszy znak `|`, a po jego lewej stronie stoi tekst źródłowy. Bez
`|` nie zgaduj granicy po stylu wypowiedzi, bo dyktowany zrzut myśli bywa nieodróżnialny od
streszczenia źródła. Zapytaj, gdzie kończy się źródło. Jeśli brakuje jednej z części, zapytaj
o nią.

## Krok 2 — Punkt zaczepienia

Wskaż **konkretne** zdanie, tezę albo przykład ze źródła, do którego odnosi się komentarz.
Ogólny temat tekstu nie wystarcza. Zapamiętaj ten punkt do Kroku 6.

## Krok 3 — Teza komentarza

Wyłuskaj tezę ze zrzutu myśli. Jeśli zrzut zawiera dwie lub więcej reakcji o podobnej wadze,
zatrzymaj się, pokaż je po jednym zdaniu i zapytaj, która ma być komentarzem.

Jeśli teza opiera się na fakcie, liczbie albo przykładzie, którego nie ma ani w zrzucie, ani
w źródle, **powiedz o tym** zamiast dopisywać dowód. Oparcia w zettlach komentarz nie potrzebuje.

## Krok 4 — Tekst

Napisz komentarz w konstrukcji punkt zaczepienia → teza → opcjonalny dowód, zgodnie
z `comment-rules.md` i sekcją „Skrót dla posta". Szczególnie pilnuj twardych zakazów z notatki stylu, bo komentarz korygujący cudzy tekst
najłatwiej w nie wpada. Nigdy nie cytuj
zettla tytułem ani go nie linkuj.

## Krok 5 — Autokorekta

Przejdź „Szybki test «czy to dobry komentarz?»" z `comment-rules.md` i popraw wszystko, co wypada
„nie". Wyniku testu nie pokazuj.

## Krok 6 — Analiza trafności (zawsze widoczna)

Pokaż ją jako osobną sekcję pod komentarzem:

1. Punkt zaczepienia ze źródła, w jednym zdaniu.
2. Teza komentarza, w jednym zdaniu.
3. Ocena, czy teza odpowiada na punkt zaczepienia (zgoda, kontra, rozszerzenie, pytanie),
   czy tylko dotyka tego samego tematu.
4. Zdania bez oparcia w punkcie zaczepienia ani w zrzucie myśli, wskazane po imieniu razem
   z konkretną poprawką.
5. Werdykt: **Trafione**, **Częściowo odjechało** albo **Odjechało od tematu**. Przy dwóch
   ostatnich zapytaj, czy poprawić komentarz od razu.

## Krok 7 — Zapisz notatkę

Użyj szablonu `90 Ekstra/91 Szablony/Komentarz.md` (`output/komentarz`):
- `autor:` to autor źródła jako wikilink, gdy ma już notatkę, a w przeciwnym razie samo imię
  i nazwisko bez linku (bez zakładania notatki osoby);
- `link:` to URL, gdy źródło przyszło jako URL;
- `źródło:` to `"[[Tytuł notatki]]"`, gdy źródło jest notatką w vaulcie;
- `dotyczy:` wskazuje notatki tematów, nigdy pytania z `[[Moje 12 Problemów]]`.

Wypełnij `link:` albo `źródło:` zgodnie z pochodzeniem z Kroku 1. Oba zostają puste tylko przy
tekście wklejonym bez adresu. **Przed zapisem sprawdź**, czy właściwe pole jest wypełnione.

Tytuł notatki to teza komentarza, czyli jego pierwsze zdanie, w razie potrzeby skrócone i bez
znaku `/`.

```bash
obsidian create path="10 Notatki/<Tytuł>.md" silent content="..."
```

## Na koniec

Pokaż komentarz jako czysty tekst gotowy do wklejenia, bez bloku kodu. Pod nim umieść analizę
trafności, ścieżkę notatki i informację o tym, co ewentualnie pominąłeś.
