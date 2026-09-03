# Zettelini (Familienplaner)

Essensplanung für Familien: Rezeptauswahl nach Vorlieben, Wochenplan, automatische Einkaufsliste,
Frühstück und Brotbox.

**Marke: Zettelini**, gewählt am 2026-08-21. **Live unter https://zettelini.de** seit 2026-08-22
(Registrar und DNS: INWX, Hosting GitHub Pages, HTTPS erzwungen). Die alte Adresse
`tomschoenknecht.github.io/familienplaner/` leitet mit 301 dorthin um. Verworfene Namen samt Begründung stehen in
`C:\claude-projekt\Strategie\MARKETING-FAMILIENPLANER.md` – nicht neu aufrollen.

## Stack und Struktur

Kein Build-Schritt, kein Server.

- `index.html` – die Landingpage (statisches HTML, eigenes CSS inline). Liegt auf der Wurzel, damit
  geteilte Links und Suchmaschinen dort ankommen und nicht direkt in der App.
- `app/index.html` – die komplette App. React 18 und Babel liegen lokal unter `bibliotheken/` und
  werden im Browser ausgeführt; der Code steht in einem `<script type="text/babel">` direkt in der
  Datei. Daten liegen im localStorage.
- `schriften/`, `bibliotheken/` – lokal ausgelieferte Schriften und Programmbibliotheken. Siehe
  Abschnitt "Keine Drittanbieter beim Aufruf" weiter unten.
- `impressum/`, `datenschutz/` – Rechtstexte, aus jeder Seite verlinkt, auf noindex gesetzt.
- `ratgeber/` – öffentliche Inhaltsseiten (statisches HTML, kein React). Gemeinsames Stylesheet
  `ratgeber/ratgeber.css`, Farbklima aus der App: `#c2410c` Akzent, `#3b2412` Text, `#fffaf5` Grund.
- `sitemap.xml` – neun URLs, wird vom Bau-Skript geschrieben.
- `robots.txt`, `llms.txt` – seit der eigenen Domain möglich, liegen auf der Wurzel.
- `593d0c06909f5d201407235b58323497.txt` – IndexNow-Schlüssel. Nicht löschen, sonst schlagen künftige
  IndexNow-Meldungen fehl.
- `.claude/launch.json` – lokale Vorschau (`npx serve`, Port 5610). Wird nicht mitversioniert.
  Achtung: Das Preview-Tool löst den Namen über die launch.json des Sessionverzeichnisses auf; ein
  gleichnamiger Eintrag liegt deshalb zusätzlich in `C:\claude-projekt\Strategie\.claude\launch.json`.

## Namen, die nicht umbenannt werden dürfen

Der Supabase-Realtime-Kanal heißt `familienplaner-<household>`, die Tabelle `familienplaner_data`.
Beide gehören zum bestehenden Supabase-Projekt. Wer sie im Zuge des Rebrandings umbenennt, kappt die
Verbindung zu allen gespeicherten Daten.

## Deployment

GitHub Pages, Branch `main`, Repo `tomschoenknecht/familienplaner`. Ein Push deployt. Bis die Änderung
live ist, vergehen ein bis drei Minuten.

Vor dem Push die Änderung zeigen und Freigabe abwarten.

## Was beim Bearbeiten zu beachten ist

- Die Meta-, OG- und Schema.org-Tags stehen ganz oben im `<head>` von `index.html`, direkt nach dem
  `<title>`. Beim Bearbeiten der App nicht versehentlich überschreiben.
- Am Ende von `index.html`, direkt vor `</body>`, steht die Fußleiste mit dem Link zum Ratgeber
  (`id="ratgeber-fuss"`). Sie liegt bewusst außerhalb des React-Roots, damit React sie nicht überschreibt.
  Ohne diesen Link finden weder Nutzer noch Crawler die Inhaltsseiten.
- Neue Ratgeberartikel: Ordner unter `ratgeber/<slug>/index.html` anlegen, Schema.org und Canonical
  ergänzen, in `ratgeber/index.html` als Karte eintragen, in `sitemap.xml` aufnehmen und per IndexNow
  melden. Das Generierungsskript für die bestehenden sechs Artikel liegt unter
  `_tools/bau-ratgeber.js` – Artikeldaten oben im Array ergänzen und `node _tools/bau-ratgeber.js`
  ausführen, das schreibt Artikelseiten, Übersicht und Sitemap neu.
- Keine Emojis. Echte Umlaute, nie ae/oe/ue/ss.

## Strategie und Kontext

Liegt im Strategie-Projekt unter `C:\claude-projekt\Strategie`:

- `REICHWEITE-FAMILIENPLANER.md` – Reichweitenplan, was GEO hier leistet und was nicht, Artikelthemen
- `PLAN-GEO-SOCIAL-2026-08.md` – Gesamtplan über alle Apps mit Statusspalte
- `APPS.md` – App-Übersicht

Der Reichweitenplan liegt seit der Übergabe hier im Projekt: `REICHWEITE.md`.

## Offene Punkte

1. **Keine Personas – und das bleibt so.** Tom hat die Persona-Pflicht aus der globalen CLAUDE.md für
   diese App am 2026-08-21 ausdrücklich ausgesetzt. Nicht erneut anstoßen. Folge: alle inhaltlichen
   Aussagen über die Zielgruppe sind Annahme, nicht Befund.
2. ~~`zettelini.de` registrieren~~ – erledigt am 2026-08-22. DNS bei INWX auf GitHub Pages,
   `CNAME` im Repo, HTTPS erzwungen (die Checkbox reagierte nicht, gesetzt per
   `gh api -X PUT repos/.../pages -F https_enforced=true` nach `gh auth refresh -s repo`).
3. ~~Datenübernahme beim Domainwechsel~~ – gelöst am 2026-08-22. Der Sync läuft (Haushaltscode nicht hier notieren,
   alle zehn Schlüssel in der Cloud), und im Sync-Tab gibt es jetzt eine
   Datensicherung mit Export und Import. Merksatz für alles Weitere: **beim Verbinden gewinnt die
   Cloud bedingungslos**, ohne Zeitstempelvergleich – ein Import bei verbundenem Code wird beim
   nächsten Verbinden überschrieben.
4. ~~Bild für die Landingpage~~ – erledigt am 2026-08-23. Screenshot des Wochenplans im Hero,
   eigene Fassung fürs Handy, dazu ein Vorschaubild für geteilte Links (`bilder/`).
5. **Monetarisierung** ist beschlossen (2026-08-21). Zwei Stufen, gratis plus 29 EUR im Jahr für Sync
   und Foto-Rezepterkennung. Das erzwingt Auth, einen serverseitigen KI-Aufruf, Stripe und die
   Rechtstexte – Einzelheiten und Marktvergleich in
   `C:\claude-projekt\Strategie\MARKETING-FAMILIENPLANER.md`. Architekturwechsel, keine Erweiterung.
6. **Rechtstexte:** Impressum und Datenschutzerklärung sind seit 2026-08-26 live und vollständig
   (`impressum/`, `datenschutz/`), verlinkt aus jeder Seite. Offen bleiben AGB und Widerrufs-
   belehrung – die werden erst mit dem Verkauf Pflicht.
7. **Artikel schärfen.** Die sechs Ratgebertexte liegen bei 410 bis 510 Wörtern.

## Offener Sicherheitsbefund (2026-09-03)

**Die Tabelle `familienplaner_data` ist mit dem öffentlichen Anon-Schlüssel ohne Familien-Code
lesbar.** Gemessen: eine GET-Anfrage liefert Zeilen aus allen Haushalten. Der Familien-Code schützt
also nichts – man muss ihn nicht kennen, man kann ihn abfragen.

Folgen: Der geplante Codewechsel bringt fast nichts, und vor dem ersten fremden Nutzer muss das
behoben sein. Befund, offene Prüfpunkte und die Wege zur Absicherung stehen in
`C:\claude-projekt\Strategie\SICHERHEIT-ZETTELINI.md`. Nicht ins Repo kopieren.

Die neue Tabelle `aufrufe` ist korrekt abgesichert (INSERT ja, SELECT und DELETE nein) und dient
als Vorlage, wie es aussehen soll.

## Was niemals ins Repo gehört

Das Repo ist öffentlich, und GitHub Pages liefert **alle** Dateien aus – auch Markdown. `CLAUDE.md`,
`UMZUG.md` und `REICHWEITE.md` sind unter `https://zettelini.de/<dateiname>` für jeden abrufbar.

Deshalb: keine Familien-Codes, keine Schlüssel, keine Zugangsdaten in irgendeiner Datei dieses
Projekts – auch nicht in Kommentaren, Beispielen oder Platzhaltern. Der Familien-Code wirkt wie ein
Passwort: Wer ihn kennt, liest und ändert über den öffentlichen Supabase-Anon-Key alle Daten der
Familie. Ein Platzhalter im Eingabefeld muss ein erfundener Beispielwert sein, nie der echte.

Wer so etwas doch einmal einträgt: Entfernen reicht nicht, der Wert bleibt in der Git-History. Dann
muss das Geheimnis selbst gewechselt werden.

## Keine fremden Drittanbieter beim Aufruf

Stand 2026-09-03: Schriften liegen unter `schriften/`, React, Babel und die Supabase-Bibliothek unter
`bibliotheken/`. Es wird nichts von Google, unpkg, jsdelivr oder einem anderen fremden Server geladen.

Zwei Verbindungen zu Supabase gibt es – und nur zu Supabase, das ohnehin Teil der Anwendung ist:

1. **Aufrufzähler** (`zaehler.js`, eingebunden auf jeder Seite): schreibt bei jedem Aufruf
   Zeitstempel, Pfad, Verweis-Domain und Kampagnenwert in die Tabelle `aufrufe`. Kein Cookie, kein
   Speicherzugriff, keine Kennung, keine IP. Schema, Row Level Security und Auswertungsabfragen
   stehen in `_tools/zaehler.sql`.
2. **Aufwärmanfrage** (`keepAlive`): läuft nur bei vorhandenem Familien-Code.

Das ist kein Zufall, sondern die Grundlage der Datenschutzerklärung. Wer hier eine Schriftart, ein
Skript oder ein Bild von einem fremden Server einbindet, macht die Aussage dort falsch – und handelt
sich das Abmahnrisiko ein, das der Google-Fonts-Einbindung anhing.

Und wer den Zähler erweitert, muss die Rechtslage mitdenken: Sobald eine Besucherkennung oder ein
Zugriff auf den Endgerätespeicher dazukommt, greift § 25 TDDDG und es braucht ein
Einwilligungsbanner. Genau deshalb zählt er anonym.

## Kampagnenparameter

`?via=<wert>` kennzeichnet die Herkunft von außen (Instagram sendet im eigenen Browser meist keinen
Verweis). `?von=<wert>` markiert Wege innerhalb der Seite; gesetzt ist das an den Planer-Knöpfen der
Landingpage (`von=start`) und der Ratgeberseiten (`von=ratgeber`, `von=artikel`). Beide Parameter
nimmt `zaehler.js` per `history.replaceState` wieder aus der Adresszeile.
