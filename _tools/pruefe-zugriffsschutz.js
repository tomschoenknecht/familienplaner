// Prueft, ob der Zugriffsschutz der Datenbank haelt.
//
// Aufruf:  node _tools/pruefe-zugriffsschutz.js
//
// Hintergrund: Bis zum 2026-09-04 war die Tabelle familienplaner_data fuer jeden
// lesbar, aenderbar und loeschbar - die Datenbankregel lautete schlicht "true".
// Seitdem prueft sie den Familien-Code aus der Kopfzeile x-haushalt. Dieses Skript
// weist nach, dass die Regel noch steht, und schlaegt an, wenn sie wieder faellt.
//
// Es enthaelt keine Geheimnisse: Adresse und oeffentlicher Schluessel werden aus
// app/index.html gelesen, wo sie ohnehin fuer jeden Besucher sichtbar stehen. Der
// echte Familien-Code kommt hier nicht vor und gehoert auch nicht hinein - geprueft
// wird ausschliesslich, dass ohne gueltigen Code nichts herausgegeben wird.
//
// Beim Zaehler ist die Erwartung umgekehrt: Schreiben muss gehen, Lesen und Loeschen
// nicht. Deshalb steht die Auswertung nur im Supabase-Dashboard zur Verfuegung.

const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..', 'app', 'index.html');
const quelle = fs.readFileSync(APP, 'utf8');
const urlTreffer = quelle.match(/const SUPABASE_URL = "([^"]+)"/);
const keyTreffer = quelle.match(/const SUPABASE_ANON_KEY = "([^"]+)"/);

if (!urlTreffer || !keyTreffer) {
  console.error('Adresse oder Schluessel nicht in app/index.html gefunden.');
  console.error('Vermutlich wurden die Konstanten umbenannt - dann dieses Skript nachziehen.');
  process.exit(2);
}

const BASIS = urlTreffer[1] + '/rest/v1/';
const SCHLUESSEL = keyTreffer[1];
const ERFUNDEN = 'pruefung-zugriffsschutz-' + Date.now();

function kopfzeilen(haushalt) {
  const h = {
    apikey: SCHLUESSEL,
    Authorization: 'Bearer ' + SCHLUESSEL,
    'Content-Type': 'application/json'
  };
  if (haushalt) h['x-haushalt'] = haushalt;
  return h;
}

let fehler = 0;

function melde(bestanden, was, zusatz) {
  console.log((bestanden ? '  ok      ' : '  FEHLER  ') + was + (zusatz ? '   ' + zusatz : ''));
  if (!bestanden) fehler++;
}

async function hole(pfad, haushalt, methode, koerper) {
  const optionen = { method: methode || 'GET', headers: kopfzeilen(haushalt) };
  if (koerper) optionen.body = JSON.stringify(koerper);
  const antwort = await fetch(BASIS + pfad, optionen);
  const text = await antwort.text();
  return { status: antwort.status, text: text };
}

function istLeer(text) {
  return text.trim() === '[]';
}

async function main() {
  console.log('');
  console.log('Zugriffsschutz von ' + BASIS);
  console.log('');
  console.log('Familiendaten (familienplaner_data)');

  const ohne = await hole('familienplaner_data?select=household,key&limit=5');
  melde(istLeer(ohne.text) || ohne.status === 401 || ohne.status === 403,
    'ohne Familien-Code kommen keine Zeilen zurueck',
    'HTTP ' + ohne.status + ', Antwort ' + ohne.text.slice(0, 60));

  const falsch = await hole('familienplaner_data?select=household,key&limit=5', ERFUNDEN);
  melde(istLeer(falsch.text) || falsch.status === 401 || falsch.status === 403,
    'mit falschem Code kommen keine Zeilen zurueck',
    'HTTP ' + falsch.status + ', Antwort ' + falsch.text.slice(0, 60));

  // Schreibversuch unter einem Haushalt, den es nicht gibt. Wird er angenommen,
  // koennte jeder fremde Wochenplaene ueberschreiben - der schwerere Fall.
  const schreib = await hole('familienplaner_data', ERFUNDEN + '-anders', 'POST',
    { household: ERFUNDEN, key: 'pruefung', value: null });
  const abgelehnt = schreib.status >= 400;
  melde(abgelehnt, 'Schreiben unter fremdem Code wird abgelehnt', 'HTTP ' + schreib.status);
  if (!abgelehnt) {
    console.log('          Achtung: Es wurde eine Zeile angelegt. Haushalt "' + ERFUNDEN + '"');
    console.log('          im Table Editor loeschen und die Datenbankregel pruefen.');
  }

  console.log('');
  console.log('Aufrufzaehler (aufrufe)');

  const zaehlerLesen = await hole('aufrufe?select=*&limit=5');
  melde(istLeer(zaehlerLesen.text) || zaehlerLesen.status >= 400,
    'Zaehlerdaten sind nicht auslesbar',
    'HTTP ' + zaehlerLesen.status + ', Antwort ' + zaehlerLesen.text.slice(0, 60));

  // Bewusst kein Loeschversuch: Greift die Regel nicht, wuerde der Test genau die
  // Daten vernichten, die er pruefen soll. Greift sie, zeigt er nichts, was die
  // Leseprobe nicht schon zeigt. Ob es eine DELETE-Regel fuer anon gibt, steht im
  // Dashboard unter Authentication - Policies; erlaubt ist dort nur INSERT.

  console.log('');
  if (fehler === 0) {
    console.log('Alles in Ordnung: ohne gueltigen Code gibt die Datenbank nichts heraus.');
  } else {
    console.log(fehler + ' Pruefung(en) fehlgeschlagen. Siehe SICHERHEIT-ZETTELINI.md im');
    console.log('Strategie-Ordner - dort steht, welche Regel gesetzt sein muss.');
  }
  console.log('');
  process.exit(fehler === 0 ? 0 : 1);
}

main().catch(e => {
  console.error('Pruefung nicht durchfuehrbar: ' + e.message);
  process.exit(2);
});
