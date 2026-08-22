# Umzug auf zettelini.de – Ablauf

Stand 2026-08-22. Ausgangslage: Alle Dateien im Repo sind bereits auf `zettelini.de` und die Marke
Zettelini umgestellt, die Landingpage liegt auf der Wurzel, die App unter `app/`. Nichts davon ist
gepusht, die Domain ist nicht registriert. Live ist weiterhin
`https://tomschoenknecht.github.io/familienplaner/` mit dem alten Stand.

Wer was macht, steht bei jedem Schritt dabei.

---

## Teil 1 – Vorbereiten, bevor die Domain kommt

### Schritt 1: Datenübernahme – erledigt am 2026-08-22

Geprüft: Der Supabase-Sync läuft. Ein einziger Haushalt `schoenknecht2026`, alle zehn Schlüssel aus
`DATEN_KEYS` liegen in der Cloud. Der Umzug funktioniert also über den Familien-Code.

Zusätzlich gebaut: **Datensicherung** im Sync-Tab, mit Export in eine JSON-Datei und Import zurück.
Beides getestet. Der Export liest bewusst aus dem localStorage statt aus dem React-State, damit auch
Schlüssel mitkommen, die gerade keine Ansicht hält.

Zu beachten, weil es bei der Reihenfolge leicht schiefgeht: Beim Verbinden **gewinnt die Cloud
bedingungslos**, ohne Zeitstempelvergleich. Wer eine Sicherung einliest, während ein Familien-Code
verbunden ist, verliert sie beim nächsten Verbinden wieder. Entweder vorher trennen oder danach
"Cloud jetzt überschreiben" drücken. Die App weist im Dialog darauf hin.

**Vor dem Umschalten auf jedem Gerät:** einmal in den Sync-Tab schauen, ob dort "Synchronisiert"
steht, und eine Sicherung speichern. Geräte, die nie verbunden waren, haben ihre Daten nirgends
sonst – für die ist die Sicherungsdatei der einzige Weg.

### Schritt 2: Screenshot für die Landingpage (Claude)

Im Hero der Startseite steht ein Platzhalter. Dort gehört ein Bild des Wochenplans hin. Braucht eine
Session, in der sich die Browser-Vorschau anzeigen lässt.

---

## Teil 2 – Domain

### Schritt 3: Registrieren (Tom)

`zettelini.de` bei INWX registrieren. `zettelini.com` gleich mitnehmen und später auf die .de-Domain
weiterleiten – sie ist frei, kostet wenig und sichert den Namen international ab.

### Schritt 4: DNS-Einträge setzen (Tom)

Dieselben Einträge wie bei hortini.de. Für die nackte Domain vier A-Records:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

Optional zusätzlich vier AAAA-Records:

    2606:50c0:8000::153
    2606:50c0:8001::153
    2606:50c0:8002::153
    2606:50c0:8003::153

Dazu ein CNAME für `www` auf `tomschoenknecht.github.io.` (mit Punkt am Ende).

### Schritt 5: Propagation abwarten und prüfen (Claude)

    dig +short zettelini.de

Erst weitermachen, wenn die vier GitHub-IPs zurückkommen. Das dauert je nach Registrar Minuten bis
wenige Stunden.

---

## Teil 3 – Umschalten

### Schritt 6: CNAME-Datei anlegen (Claude)

Eine Datei `CNAME` im Repo-Wurzelverzeichnis mit dem Inhalt `zettelini.de`, sonst nichts.

**Nicht vorher.** Liegt sie im Repo, bevor die DNS-Einträge greifen, leitet GitHub Pages auf eine
Domain um, die nicht auflöst – die App ist dann für alle unerreichbar.

### Schritt 7: Push (Claude, nach Freigabe)

Ein Commit mit allem: Rebranding, Landingpage, Struktur mit `app/`, robots.txt, llms.txt, CNAME.
Vorher zeige ich den Diff.

Ab diesem Moment ist der alte Pfad `tomschoenknecht.github.io/familienplaner/` nur noch eine
Weiterleitung auf die neue Domain.

### Schritt 8: HTTPS aktivieren (Tom)

In den Repo-Einstellungen unter Pages prüfen, ob die Custom Domain korrekt erkannt wurde, dann
"Enforce HTTPS" setzen. Das Zertifikat wird automatisch ausgestellt und braucht manchmal eine
Viertelstunde.

### Schritt 9: Durchklicken (Claude)

Prüfen, ob `zettelini.de`, `/app/`, `/ratgeber/`, alle sechs Artikel, `robots.txt`, `llms.txt` und
`sitemap.xml` erreichbar sind und die Links untereinander stimmen.

### Schritt 10: Daten zurückholen (Tom und Familie)

Auf jedem Gerät einmal `zettelini.de/app/` öffnen und den Haushaltscode eingeben – oder die zuvor
exportierte Datei einlesen. Erst danach die alte Adresse aus den Lesezeichen nehmen.

---

## Teil 4 – Sichtbarkeit

### Schritt 11: Suchmaschinen informieren (Claude)

- Sitemap per IndexNow melden (Schlüsseldatei liegt bereits im Repo)
- Google Search Console: neue Property anlegen, Sitemap einreichen
- Bing Webmaster Tools: dasselbe

### Schritt 12: Erst danach Reichweite (später)

Pinterest als erster Kanal, aus denselben Gründen wie bei Hortini: Essensplanung ist ein Such- und
Planungsthema. Siehe `REICHWEITE.md`.

---

## Teil 5 – Monetarisierung (eigener Block, nach dem Umzug)

Nicht parallel anfangen. Erst wenn die Domain steht und die Seite sauber läuft.

1. **Auth** – Supabase Magic Link, im Gartenplaner erprobt. Der Haushaltscode bleibt daneben bestehen
   oder wird abgelöst, das ist zu entscheiden.
2. **KI-Aufruf serverseitig** – die Foto-Rezepterkennung wandert in eine Supabase Edge Function, mit
   Nutzungszähler pro Konto. Der bisherige Weg über einen vom Nutzer hinterlegten API-Schlüssel ist
   bei einem bezahlten Produkt nicht zumutbar.
3. **Stripe** – Checkout Session über Edge Function, Webhook `checkout.session.completed`, Tier in
   Supabase, Customer Portal für Kündigung.
4. **Rechtstexte** – Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung. Mit dem Verkauf Pflicht,
   bisher existiert keiner davon.
5. **Landingpage überarbeiten** – der Preisblock sagt derzeit "0 EUR, kein Abo". Das stimmt dann nicht
   mehr.

Preismodell und Marktvergleich: `C:\claude-projekt\Strategie\MARKETING-FAMILIENPLANER.md`
