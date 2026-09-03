/* Aufrufzähler für zettelini.de
 *
 * Zählt Seitenaufrufe, ohne Menschen wiederzuerkennen. Gespeichert werden nur:
 * Zeitstempel, Pfad, die Domain des Verweises und ein optionaler Kampagnenwert.
 *
 * Was hier bewusst NICHT passiert:
 *   - kein Cookie, kein localStorage, kein sessionStorage
 *   - keine Geräte- oder Browserkennung, kein Fingerprinting
 *   - keine IP-Speicherung (die Adresse sieht der Server nur technisch, wie bei jedem Aufruf)
 *   - keine vollständige Verweis-URL, nur deren Domain
 *
 * Weil kein Zugriff auf den Endgerätespeicher stattfindet, greift § 25 TDDDG nicht;
 * es braucht daher kein Einwilligungsbanner. Wer daran etwas ändert – etwa eine
 * Besucherkennung einführt –, ändert damit auch die Rechtslage und muss die
 * Datenschutzerklärung anpassen.
 *
 * Der Zähler ist absichtlich zahnlos: Er läuft asynchron, blockiert nichts und
 * verschluckt jeden Fehler. Wenn Supabase nicht antwortet, merkt das niemand.
 */
(function () {
  "use strict";

  var ZIEL = "https://qaunugzebrdopraopxff.supabase.co/rest/v1/aufrufe";
  var SCHLUESSEL = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdW51Z3plYnJkb3ByYW9weGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzU3MDcsImV4cCI6MjA5Njk1MTcwN30.wHWVsn6SanXPV11FeaDMS_SAs6dLEBXT6ol3iQ16yf0";

  function saeubern(wert, laenge) {
    if (!wert) return null;
    var s = String(wert).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, laenge);
    return s || null;
  }

  try {
    // Pfad statt voller Adresse: /ratgeber/brotbox-ideen/ genügt zur Auswertung
    var pfad = (location.pathname || "/").slice(0, 120);

    // Nur die Domain des Verweises. Aufrufe innerhalb der eigenen Seite zählen nicht als Verweis.
    var refDomain = null;
    if (document.referrer) {
      try {
        var h = new URL(document.referrer).hostname;
        if (h && h !== location.hostname) refDomain = h.slice(0, 80);
      } catch (e) { /* unbrauchbarer Verweis: weglassen */ }
    }

    // Kampagnenwert. Nötig, weil Instagram im eigenen Browser meist keinen Verweis sendet.
    // "von" markiert den Weg Startseite -> Planer, ebenfalls ohne Wiedererkennung.
    var via = null;
    try {
      var q = new URLSearchParams(location.search);
      via = saeubern(q.get("via"), 40);
      if (!via && q.get("von")) via = saeubern("von-" + q.get("von"), 40);
    } catch (e) { /* alte Browser: ohne Kampagnenwert weiterzählen */ }

    fetch(ZIEL, {
      method: "POST",
      headers: {
        "apikey": SCHLUESSEL,
        "Authorization": "Bearer " + SCHLUESSEL,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ pfad: pfad, ref_domain: refDomain, via: via }),
      keepalive: true,
      mode: "cors",
      credentials: "omit"
    }).catch(function () { /* stillschweigend */ });

    // Kampagnenparameter aus der Adresszeile entfernen, ohne die Seite neu zu laden
    if (location.search && window.history && history.replaceState) {
      try {
        var rest = new URLSearchParams(location.search);
        if (rest.has("via") || rest.has("von")) {
          rest.delete("via");
          rest.delete("von");
          var such = rest.toString();
          history.replaceState(null, "", location.pathname + (such ? "?" + such : "") + location.hash);
        }
      } catch (e) { /* Adresszeile bleibt eben stehen, kein Beinbruch */ }
    }
  } catch (e) {
    /* Ein kaputter Zähler darf die Seite niemals beeinträchtigen. */
  }
})();
