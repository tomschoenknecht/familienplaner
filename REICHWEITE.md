# Reichweitenplan Familienwochenplan

Stand: 2026-08-21. Die App ist live unter https://tomschoenknecht.github.io/familienplaner/ –
Essensplanung für Familien mit Rezeptauswahl nach Vorlieben, Wochenplan, automatischer Einkaufsliste,
Frühstück und Brotbox.

**Vorbehalt:** Für diese App gibt es keine Personas und keine Positionierung – und das bleibt so
(Entscheidung Tom, 2026-08-21, Persona-Pflicht für diese App ausgesetzt). Die inhaltlichen Aussagen
hier sind damit dauerhaft Annahme statt Befund. Die technischen Punkte gelten unabhängig davon.

## Der eigentliche Befund

GEO und SEO greifen bei dieser App derzeit nicht, und zwar nicht wegen fehlender Tags, sondern weil es
nichts zu finden gibt. Bei bari-guide funktionieren die sechs GEO-Punkte, weil dort sechs Informationsseiten
stehen, die echte Fragen beantworten. Bei hortini.de sind es neun Ratgeberartikel. Hier ist es eine App
ohne ein einziges Wort Inhalt – eine solche Seite wird weder gegoogelt noch von einem KI-Modell zitiert,
weil sie zu keiner Frage passt.

Dazu kommt die Adresse. Unter `tomschoenknecht.github.io/familienplaner/` liegt die App auf einem
Unterpfad einer fremden Domain. llms.txt und robots.txt gehören ins Wurzelverzeichnis einer Domain, das
dir dort nicht gehört. Ohne eigene Domain fällt die halbe Checkliste aus.

## Erledigt (Stand 2026-08-21)

Meta-Description, Canonical, Open-Graph- und Twitter-Tags sowie Schema.org (WebApplication) in
index.html ergänzt. Wirkung: Wer den Link per WhatsApp teilt, sieht jetzt Titel und Beschreibung statt
einer nackten URL. Das ist der einzige GEO-Schritt, der ohne eigene Domain und ohne Inhalte etwas bringt.

**Nachtrag 2026-08-21 – Korrektur zur Domain-Frage:** Das Wurzelverzeichnis tomschoenknecht.github.io
gehört Tom sehr wohl, es wird nur von keinem Repository bedient (aktuell 404). Ein Repo mit dem Namen
`tomschoenknecht.github.io` würde es füllen, die Dateien gälten dann aber für alle Projekte auf der
Domain. Sitemap und IndexNow brauchen das Wurzelverzeichnis NICHT – beide funktionieren im
Unterverzeichnis und sind seit 2026-08-21 eingerichtet. Nur llms.txt und robots.txt hängen am Root.

**Ebenfalls erledigt:** Sechs Ratgeberartikel unter /familienplaner/ratgeber/ (Wochenplan,
Gerichteauswahl, Einkaufsliste, wählerische Kinder, Brotbox, Meal Prep), Übersichtsseite, eigenes
Stylesheet, sitemap.xml mit 8 URLs, IndexNow gemeldet, Ratgeber-Link im Fuß der App. Artikellänge 410
bis 510 Wörter – für spezifische Suchanfragen ausreichend, für stark umkämpfte Begriffe knapp.

## Reihenfolge, wenn es weitergehen soll

1. **Eigene Domain** plus schlanke Landingpage vor der App, so wie hortini.de es vormacht.
2. ~~Vier bis sechs Ratgeberartikel~~ – erledigt am 2026-08-21, sechs Artikel stehen. Offen bleiben
   llms.txt und robots.txt (brauchen das Wurzelverzeichnis, also die eigene Domain) sowie die
   Anmeldung in der Google Search Console.
3. **Pinterest** als erster Kanal, aus denselben Gründen wie bei Hortini: Essensplanung ist ein Such- und
   Planungsthema, Pins verlinken direkt, und Wochenplan-Inhalte werden dort massiv nachgefragt.

## Artikelthemen als Entwurf

Nach echten Suchanfragen formuliert, nicht nach Features:

- Wochenplan fürs Familienessen – wie man ihn aufstellt, ohne jeden Sonntag zu verzweifeln
- Was koche ich diese Woche? Ein Vorgehen statt einer Rezeptliste
- Einkaufsliste aus dem Essensplan – warum die Reihenfolge über den Erfolg entscheidet
- Kinder essen nichts Neues – wie man einen Plan macht, den alle mittragen
- Brotbox-Ideen für die Schulwoche, ohne jeden Morgen neu zu überlegen
- Meal Prep für Familien – was davon im Alltag wirklich funktioniert

## Was nicht gilt

Die Instagram-Kommentarstrategie aus dem bari-guide-Plan passt hier nicht. Beim Familienessen gibt es
keine Betroffenen-Community, in der man sich glaubwürdig macht – es gibt Menschen mit einer Frage am
Donnerstagabend. Die erreicht man über Suche, nicht über Gemeinschaft.
