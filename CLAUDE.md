# Zettelini (Familienplaner)

Essensplanung für Familien: Rezeptauswahl nach Vorlieben, Wochenplan, automatische Einkaufsliste,
Frühstück und Brotbox.

**Marke: Zettelini**, gewählt am 2026-08-21. Domain `zettelini.de` (Registrar INWX, noch nicht
registriert – Stand 2026-08-21). Bis dahin läuft alles unter
https://tomschoenknecht.github.io/familienplaner/ . Verworfene Namen samt Begründung stehen in
`C:\claude-projekt\Strategie\MARKETING-FAMILIENPLANER.md` – nicht neu aufrollen.

## Stack und Struktur

Kein Build-Schritt, kein Server.

- `index.html` – die Landingpage (statisches HTML, eigenes CSS inline). Liegt auf der Wurzel, damit
  geteilte Links und Suchmaschinen dort ankommen und nicht direkt in der App.
- `app/index.html` – die komplette App. React 18 und Babel werden über unpkg im Browser geladen, der
  Code steht in einem `<script type="text/babel">` direkt in der Datei. Daten liegen im localStorage.
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
2. **`zettelini.de` bei INWX registrieren.** Erst danach die `CNAME`-Datei ins Repo – vorher macht
   sie die Seite unerreichbar, weil GitHub Pages dann auf eine Domain umleitet, die nicht auflöst.
   DNS: vier A-Records auf 185.199.108–111.153, dazu `www` als CNAME auf `tomschoenknecht.github.io`.
   Nach der Propagation in den Repo-Einstellungen "Enforce HTTPS" setzen.
3. ~~Datenübernahme beim Domainwechsel~~ – gelöst am 2026-08-22. Der Sync läuft (Haushalt
   `schoenknecht2026`, alle zehn Schlüssel in der Cloud), und im Sync-Tab gibt es jetzt eine
   Datensicherung mit Export und Import. Merksatz für alles Weitere: **beim Verbinden gewinnt die
   Cloud bedingungslos**, ohne Zeitstempelvergleich – ein Import bei verbundenem Code wird beim
   nächsten Verbinden überschrieben.
4. **Bild für die Landingpage.** Im Hero steht ein Platzhalter, dort gehört ein Screenshot des
   Wochenplans hin.
5. **Monetarisierung** ist beschlossen (2026-08-21). Zwei Stufen, gratis plus 29 EUR im Jahr für Sync
   und Foto-Rezepterkennung. Das erzwingt Auth, einen serverseitigen KI-Aufruf, Stripe und die
   Rechtstexte – Einzelheiten und Marktvergleich in
   `C:\claude-projekt\Strategie\MARKETING-FAMILIENPLANER.md`. Architekturwechsel, keine Erweiterung.
6. **Rechtstexte fehlen vollständig.** Impressum, Datenschutz, AGB, Widerruf. Mit dem Verkauf Pflicht.
7. **Artikel schärfen.** Die sechs Ratgebertexte liegen bei 410 bis 510 Wörtern.
