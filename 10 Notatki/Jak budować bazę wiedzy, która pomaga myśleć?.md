## Zettle odpowiadające na to pytanie

> [!tip] Lista zbierana automatycznie z `dotyczy:` wszystkich zettli tej domeny (pytanie przewodnie + jego pod-pytania). Gdy dopiszesz nowe pod-pytanie w [[Moje 12 Problemów]], dorzuć tu kolejny `OR contains(dotyczy, [[…]])`.

```dataview
TABLE dotyczy AS "Dotyczy"
FROM #wiedza/zettel
WHERE contains(dotyczy, [[Jak budować bazę wiedzy, która pomaga myśleć?]]) OR contains(dotyczy, [[Jak odróżnić wiedzę od informacji?]]) OR contains(dotyczy, [[Jak korzystać z AI, żeby nie oddać mu myślenia?]])
SORT file.name ASC
```
