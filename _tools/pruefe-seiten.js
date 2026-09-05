// Prueft alle ausgelieferten Seiten auf tote Verweise und fehlende Auszeichnung.
//
// Aufruf:  node _tools/pruefe-seiten.js
//
// Geprueft wird gegen die Dateien im Arbeitsverzeichnis, nicht gegen die
// veroeffentlichte Seite - der Lauf zeigt also, was ein Push ausliefern wuerde.
// Seiten auf noindex werden bei den Suchmaschinen-Angaben milder behandelt: Titel
// und Beschreibung erscheinen dort nirgends.

const fs = require('fs');
const path = require('path');
const BASIS = path.join(__dirname, '..');

const seiten = ['index.html', 'app/index.html', 'ratgeber/index.html',
  'impressum/index.html', 'datenschutz/index.html'];
for (const d of fs.readdirSync(path.join(BASIS, 'ratgeber'))) {
  const rel = 'ratgeber/' + d + '/index.html';
  if (fs.existsSync(path.join(BASIS, rel))) seiten.push(rel);
}

const befunde = [];
const titelGesehen = {};
const beschrGesehen = {};

function attribut(kopf, muster) {
  // Bis zum naechsten Anfuehrungszeichen lesen und pruefen, ob das Attribut dort
  // auch wirklich endet. Sonst steckt ein rohes Anfuehrungszeichen im Text und
  // bricht das Attribut auf - genau der Fehler, der in den Ratgebertiteln steckte.
  const m = kopf.match(muster);
  if (!m) return null;
  const rest = kopf.slice(m.index + m[0].length);
  return { wert: m[1], sauber: /^\s*\/?>/.test(rest) };
}

function pruefe(rel) {
  const voll = path.join(BASIS, rel);
  const s = fs.readFileSync(voll, 'utf8');
  const kopf = s.slice(0, 8000);
  const istApp = rel.startsWith('app/');
  const nichtIndexiert = /noindex/.test(kopf);
  const melde = t => befunde.push(rel + ': ' + t);

  const t = (kopf.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  if (!t) melde('kein Titel');
  else {
    if (titelGesehen[t]) melde('Titel doppelt, auch in ' + titelGesehen[t]);
    titelGesehen[t] = rel;
    if (!nichtIndexiert && t.length > 65) melde('Titel ' + t.length + ' Zeichen, wird in den Suchergebnissen gekuerzt');
  }

  const d = attribut(kopf, /<meta name="description" content="([^"]*)"/);
  if (!d) melde('keine Beschreibung');
  else {
    if (!d.sauber) melde('Beschreibung bricht das Attribut auf, vermutlich rohes Anfuehrungszeichen');
    if (beschrGesehen[d.wert]) melde('Beschreibung doppelt, auch in ' + beschrGesehen[d.wert]);
    beschrGesehen[d.wert] = rel;
    if (!nichtIndexiert) {
      if (d.wert.length > 165) melde('Beschreibung ' + d.wert.length + ' Zeichen (ueber 165)');
      if (d.wert.length < 70) melde('Beschreibung nur ' + d.wert.length + ' Zeichen');
    }
  }

  if (!/<link rel="canonical"/.test(kopf)) melde('kein Canonical');
  if (!/<html lang="de"/.test(kopf)) melde('kein lang="de"');
  if (!/property="og:title"/.test(kopf)) melde('kein og:title');

  if (!istApp) {
    const h1 = (s.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) melde(h1 + ' h1-Ueberschriften statt einer');
  }

  for (const m of s.matchAll(/<img\s[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) melde('Bild ohne alt-Text  ' + m[0].slice(0, 70));
  }

  const ordner = path.dirname(voll);
  for (const m of s.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const ziel = m[1];
    if (/^(https?:|mailto:|data:|tel:|\/\/)/.test(ziel)) continue;
    const roh = ziel.split('?')[0].split('#')[0];
    if (!roh) continue;
    let z = path.resolve(ordner, roh);
    if (fs.existsSync(z) && fs.statSync(z).isDirectory()) z = path.join(z, 'index.html');
    if (!fs.existsSync(z)) melde('toter Verweis  ' + ziel);
  }
}

seiten.forEach(pruefe);
console.log('');
console.log('Geprueft: ' + seiten.length + ' Seiten');
console.log('');
if (befunde.length === 0) {
  console.log('Keine Befunde.');
} else {
  befunde.forEach(b => console.log('- ' + b));
  console.log('');
  console.log(befunde.length + ' Befund(e).');
}
console.log('');
process.exit(befunde.length === 0 ? 0 : 1);
