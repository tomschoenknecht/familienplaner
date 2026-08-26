const fs = require('fs');
const path = require('path');

const BASIS = 'C:/claude-projekt/familienplaner';
const URL_BASIS = 'https://zettelini.de';
const HEUTE = '2026-08-21';

const artikel = [
  {
    slug: 'wochenplan-erstellen',
    titel: 'Wochenplan fürs Familienessen: so stellst du ihn auf',
    kurz: 'Ein Gerüst mit festen Ankern schlägt sieben frei erfundene Gerichte.',
    beschreibung: 'Essensplan für die Woche aufstellen: mit festen Ankertagen, Vorratscheck und realistischen Zeitfenstern statt sieben frei erfundenen Gerichten.',
    lead: 'Die Sonntagabend-Verzweiflung hat selten mit fehlenden Rezepten zu tun. Sie hat mit fehlender Struktur zu tun.',
    einleitung: 'Verzweifelst du auch regelmäßig an der Essensplanung? Puh, was hat mich das schon Nerven gekostet. Und alle zwei Tage Spontaneinkauf im Supermarkt ist am Ende des Monats richtig teuer. Wer sich hinsetzt und sieben Gerichte aus dem Nichts erfinden will, stellt sich eine Aufgabe, an der jeder scheitert. Ein guter Wochenplan wird nicht erfunden, er wird zusammengesetzt – aus wenigen festen Bausteinen, die sich jede Woche wiederholen dürfen.',
    abschnitte: [
      { h: 'Zuerst das Gerüst, dann die Gerichte', p: ['Feste Anker nehmen dir die Hälfte der Entscheidungen ab. Ein Tag in der Woche ist Nudeltag, einer Restetag, einer der Tag, an dem es schnell gehen muss, weil Sport ist. Diese Anker ändern sich über Monate nicht – du füllst sie nur unterschiedlich.', 'Der Rest ergibt sich fast von selbst: Zwei bis drei Abende bleiben frei für das, worauf ihr Lust habt oder was weg muss.'] },
      { h: 'Der Vorratscheck kommt vor dem Planen', p: ['Bevor du irgendetwas aufschreibst, schau in Kühlschrank, Vorrat und Tiefkühler. Was dort schon liegt, bestimmt zwei Abende der Woche – und verhindert, dass du zum dritten Mal Kokosmilch kaufst.', 'Diese Reihenfolge ist der häufigste Fehler. Wer erst plant und dann schaut, kauft doppelt und wirft weg.'] },
      { h: 'Zeit ist die Zutat, die am häufigsten fehlt', p: ['Trage die Woche zuerst als Kalender ein, nicht als Speisekarte. An welchem Tag seid ihr erst um sieben zu Hause? Wann ist jemand außer Haus? Ein Gericht mit vierzig Minuten Ofenzeit an einem Dienstag mit Turnen ist kein Plan, sondern eine Enttäuschung mit Vorlauf.'] },
      { h: 'So sieht eine tragfähige Woche aus', tabelle: { kopf: ['Tag', 'Anker', 'Was das heißt'], zeilen: [['Montag', 'Einfach', 'Ein Topf, wenig Aufwand, Start in die Woche'], ['Dienstag', 'Schnell', 'Höchstens 20 Minuten, weil der Nachmittag voll ist'], ['Mittwoch', 'Nudeln', 'Wechselnde Sauce, immer dieselbe Basis'], ['Donnerstag', 'Vorrat', 'Was aus Tiefkühler und Regal weg muss'], ['Freitag', 'Lieblingsessen', 'Der Tag, auf den sich alle freuen'], ['Samstag', 'Aufwendiger', 'Wenn Zeit da ist, sonst tauschen'], ['Sonntag', 'Reste', 'Was die Woche übrig gelassen hat']] } },
      { h: 'Zwei Regeln, die den Plan haltbar machen', p: ['Erstens: Plane höchstens fünf Abende fest. Zwei Lücken sind kein Versäumnis, sondern der Puffer, an dem der ganze Plan hängt – spontane Einladungen, ein Kind wird krank, es wird später.', 'Zweitens: Ein neues Gericht pro Woche, nicht drei. Neue Rezepte kosten Zeit, Aufmerksamkeit und manchmal einen Abend. Eines ist Abwechslung, drei sind ein Projekt.'] }
    ],
    schluss: 'Ein Wochenplan ist kein Vertrag. Er ist eine Entscheidung, die du einmal triffst, damit du sie nicht siebenmal treffen musst.',
    cta: 'Zettelini stellt dir die Woche aus deinen eigenen Gerichten zusammen – und merkt sich, was bei euch tatsächlich gegessen wird.',
    verwandt: ['was-koche-ich-diese-woche', 'einkaufsliste-erstellen', 'meal-prep-familie']
  },
  {
    slug: 'was-koche-ich-diese-woche',
    titel: 'Was koche ich diese Woche? Ein Vorgehen statt einer Rezeptliste',
    kurz: 'Die Frage ist keine Ideenfrage. Sie ist eine Entscheidungsfrage.',
    beschreibung: 'Warum Rezeptlisten bei der Frage "Was koche ich diese Woche" nicht helfen – und wie eine Stammliste aus 20 Gerichten die Planung in zehn Minuten erledigt.',
    lead: 'Es fehlt dir nicht an Rezepten. Es fehlt an einer Entscheidung, und die wird nicht leichter, wenn du noch mehr Rezepte siehst.',
    einleitung: 'Ach, was habe ich mich schon durch langatmige, mit Werbung gespickte Kochrezepte geklickt. Darauf habe ich keine Lust mehr, das geht auch unkomplizierter. Wer die Frage in eine Suchmaschine tippt, bekommt tausend Vorschläge und ist danach ratloser als vorher, denn das Problem ist nicht Mangel, sondern Überfluss. Jede zusätzliche Option macht die Entscheidung teurer.',
    abschnitte: [
      { h: 'Die meisten Familien kochen zwanzig Gerichte', p: ['Wenn du aufschreibst, was bei euch in den letzten drei Monaten wirklich auf dem Tisch stand, kommst du selten über zwanzig verschiedene Gerichte. Das ist kein Armutszeugnis, sondern völlig normal – und es ist die Lösung.', 'Diese zwanzig sind deine Stammliste. Sie sind erprobt, die Zutaten sind vertraut, niemand muss überredet werden. Was du planst, ist eine Auswahl daraus, keine Erfindung.'] },
      { h: 'Die Stammliste anlegen', p: ['Setz dich einmal hin und schreib alles auf, was ihr esst und was funktioniert. Nicht das, was du gerne kochen würdest – das, was ihr tatsächlich esst. Zwanzig Zeilen, mehr braucht es nicht.', 'Sortiere sie dann nach Aufwand: schnell, normal, aufwendig. Damit hast du beim Planen sofort die Antwort auf die eigentliche Frage, nämlich nicht "was", sondern "was passt an einen Dienstag".'] },
      { h: 'Wiederholung ist kein Makel', p: ['Meine Kinder mögen Wiederholung, solange es ihnen schmeckt. Sie essen lieber, was sie kennen – und du kochst schneller, was du auswendig kannst. Ein Gericht alle zwei Wochen ist keine Eintönigkeit, sondern Verlässlichkeit.', 'Abwechslung entsteht besser über Beilagen und Saucen als über ständig neue Rezepte. Dieselben Nudeln mit vier Saucen sind vier Gerichte. Und so mogelst du auch mal etwas Gesundes darunter.'] },
      { h: 'Wann neue Gerichte dazukommen', p: ['Einmal pro Woche eines, am besten an einem Tag mit Luft. Was funktioniert, wandert in die Stammliste. Was nicht, wird gestrichen und nie wieder erwähnt.', 'So wächst die Liste langsam und bleibt trotzdem erprobt. Nach einem Jahr hast du dreißig Gerichte, von denen jedes einzelne schon einmal geklappt hat.'] }
    ],
    schluss: 'Die Frage "Was koche ich diese Woche" beantwortet man nicht mit Inspiration, sondern mit einer Liste, die man schon hat.',
    cta: 'In Zettelini legst du deine Stammgerichte einmal an – danach ist die Wochenplanung eine Auswahl statt einer Suche.',
    verwandt: ['wochenplan-erstellen', 'kinder-essen-nichts-neues', 'einkaufsliste-erstellen']
  },
  {
    slug: 'einkaufsliste-erstellen',
    titel: 'Einkaufsliste aus dem Essensplan: warum die Reihenfolge entscheidet',
    kurz: 'Erst der Plan, dann die Liste. Andersherum kaufst du doppelt.',
    beschreibung: 'Wie aus dem Wochenplan eine Einkaufsliste wird, die nichts vergisst und nichts doppelt kauft – sortiert nach Ladenwegen statt nach Gerichten.',
    lead: 'Wer erst einkauft und dann plant, kommt mit vollen Taschen und ohne Abendessen nach Hause.',
    einleitung: 'Erst der Plan, dann die Einkaufsliste. Kein Rumschreiben und Kopieren, wo man am Ende doch wieder etwas vergisst – haben wir alle schon erlebt, oder? Trotzdem wird die Reihenfolge ständig umgedreht, mit dem Ergebnis, dass drei Sorten Joghurt im Kühlschrank stehen und für Mittwoch nichts da ist.',
    abschnitte: [
      { h: 'Schritt eins: der Vorratscheck', p: ['Bevor eine einzige Zeile entsteht, gehst du durch Kühlschrank, Vorratsschrank und Tiefkühler. Was da ist, kommt nicht auf die Liste, sondern in den Plan.', 'Das ist der Schritt, der Geld spart und Reste verhindert – und der einzige, den fast alle überspringen.'] },
      { h: 'Schritt zwei: Zutaten je Gericht, Mengen je Person', p: ['Geh den Plan Abend für Abend durch und schreib die Zutaten auf. Rechne dabei sofort in Personen um: Ein Rezept für zwei bei einer vierköpfigen Familie ist die häufigste Ursache für zu kleine Portionen.', 'Bei Gerichten, die mehrfach vorkommen, addierst du. Zwei Abende mit Zwiebeln sind nicht zwei Zeilen, sondern eine mit der Summe.'] },
      { h: 'Schritt drei: nach Ladenwegen sortieren', p: ['Eine Liste nach Gerichten sortiert schickt dich fünfmal durch den Laden. Eine Liste nach Warengruppen – Obst und Gemüse, Kühlregal, Trockenes, Tiefkühl – schickt dich einmal und macht den Einkauf beinahe zum Spaziergang.', 'Das klingt nach Kleinigkeit und spart bei einem großen Wocheneinkauf zehn bis fünfzehn Minuten. Vor allem aber verhindert es, dass du auf dem Rückweg noch drei Dinge mitnimmst, die du nicht brauchst.'] },
      { h: 'Die drei Zeilen, die immer fehlen', tabelle: { kopf: ['Was', 'Warum es vergessen wird'], zeilen: [['Grundzutaten', 'Öl, Salz, Mehl stehen in keinem Rezept ganz oben und sind irgendwann leer'], ['Frühstück und Brotbox', 'Der Plan deckt Abendessen ab, gegessen wird aber den ganzen Tag'], ['Der Puffer', 'Ein Ersatzgericht aus dem Vorrat für den Abend, an dem alles anders kommt']] } }
    ],
    schluss: 'Eine gute Einkaufsliste ist keine Gedächtnisstütze. Sie ist der Wochenplan, übersetzt in die Reihenfolge des Ladens.',
    cta: 'Zettelini erzeugt die Einkaufsliste direkt aus deinem Wochenplan – zusammengefasst nach Mengen, nicht nach Rezepten.',
    verwandt: ['wochenplan-erstellen', 'meal-prep-familie', 'was-koche-ich-diese-woche']
  },
  {
    slug: 'kinder-essen-nichts-neues',
    titel: 'Kinder essen nichts Neues: wie man trotzdem plant',
    kurz: 'Ein sicheres Element auf jedem Teller – und kein zweites Menü.',
    beschreibung: 'Wählerische Kinder sind normal, nicht schlecht erzogen. Wie ein Essensplan aussieht, der alle satt macht, ohne dass zweimal gekocht wird.',
    lead: 'Ein Kind, das nur Nudeln mit Butter isst, ist kein Erziehungsproblem. Es ist eine Entwicklungsphase mit sehr schlechtem Timing.',
    einleitung: 'Kennst du das auch? Zuhause isst das Kind so gut wie gar nichts, außerhalb futtert es anstandslos alles, was auf den Tisch kommt. Nervig. Dahinter steckt aber keine Erziehungsfrage, sondern Biologie: Zwischen dem zweiten und dem sechsten Lebensjahr lehnen die meisten Kinder Unbekanntes reflexhaft ab. Das war sinnvoll, als kleine Menschen selbst durch die Gegend liefen und Beeren fanden. Am Familientisch ist es vor allem anstrengend – und es geht vorbei, wenn man es nicht zum Machtkampf macht.',
    abschnitte: [
      { h: 'Ein sicheres Element auf jedem Teller', p: ['Die praktikabelste Regel im Alltag: Auf dem Tisch steht immer mindestens eine Sache, die das Kind sicher isst. Brot, Nudeln, Reis, Gurke – irgendetwas Vertrautes.', 'Das ist kein Nachgeben, sondern die Bedingung dafür, dass ein Kind überhaupt entspannt genug ist, um vom Rest zu probieren. Wer hungrig und unter Druck am Tisch sitzt, probiert nichts.'] },
      { h: 'Getrennt servieren statt vermischt', p: ['Aufläufe, Eintöpfe und Saucen, in denen alles miteinander verschwindet, sind für skeptische Kinder das Schwierigste. Dieselben Zutaten nebeneinander auf dem Teller werden deutlich eher gegessen.', 'Plane deshalb Gerichte, die sich zerlegen lassen: Bolognese getrennt von den Nudeln, Gemüse als Beilage statt untergemischt, Toppings zum Selbstnehmen.'] },
      { h: 'Wiederholung ohne Druck', p: ['Kinder brauchen ein Lebensmittel oft zehnmal oder häufiger auf dem Teller, bevor sie es annehmen. Nicht zehn Diskussionen – zehn beiläufige Begegnungen.', 'Das heißt konkret: Es liegt da, es wird nicht kommentiert, es muss nicht gegessen werden. Wer probiert, bekommt kein Lob, wer ablehnt, keine Bemerkung. Genau diese Gleichgültigkeit ist das Wirksame daran.'] },
      { h: 'Warum nicht zweimal gekocht wird', p: ['Ein zweites Gericht auf Bestellung ist kurzfristig Frieden und langfristig eine Falle: Es garantiert, dass nie etwas Neues probiert wird, und es kostet dich jeden Abend doppelt.', 'Der Mittelweg heißt Auswahl innerhalb des Gerichts. Es gibt, was es gibt – aber jeder stellt sich vom Angebot auf dem Tisch seinen Teller selbst zusammen.'] }
    ],
    schluss: 'Der Plan muss nicht jedem Kind gefallen. Er muss nur dafür sorgen, dass niemand hungrig aufsteht und niemand streiten muss.',
    cta: 'In Zettelini hinterlegst du die Vorlieben jedes Familienmitglieds – Vorschläge kommen dann so, dass für alle etwas dabei ist.',
    verwandt: ['was-koche-ich-diese-woche', 'brotbox-ideen', 'wochenplan-erstellen']
  },
  {
    slug: 'brotbox-ideen',
    titel: 'Brotbox für die Schulwoche: ein Baukasten statt täglicher Ideen',
    kurz: 'Vier Bausteine, jeden Morgen neu kombiniert.',
    beschreibung: 'Brotbox-Ideen für die Schulwoche als System: vier Bausteine kombinieren, am Vorabend vorbereiten, und wissen, was bis zur großen Pause hält.',
    lead: 'Um sieben Uhr morgens ist niemand kreativ. Deshalb braucht die Brotdose kein Rezept, sondern ein Muster – sonst landet am Ende doch alles wieder im Müll.',
    einleitung: 'Bei Tiktok und Instagram sehe ich immer so unglaublich tolle Brotboxideen. Aber vom Abspeichern zum Selbermachen sind sie dann alle wieder futsch – die Realität killt Essensträume und gute Vorsätze. Wer jeden Morgen neu überlegt, landet nach zwei Wochen wieder beim Käsebrot und beim schlechten Gewissen. Ein Baukasten löst das, weil er die Entscheidung von der Uhrzeit trennt, zu der sie getroffen werden muss.',
    abschnitte: [
      { h: 'Die vier Bausteine', p: ['Jede Box bekommt vier Dinge: etwas Sättigendes, etwas mit Eiweiß, etwas Frisches und eine Kleinigkeit. Wenn diese vier Plätze besetzt sind, ist die Box fertig – unabhängig davon, was genau darin liegt.'], tabelle: { kopf: ['Baustein', 'Beispiele'], zeilen: [['Sättigend', 'Brot, Wrap, Nudelsalat, Reiskugeln, Pfannkuchenrolle'], ['Eiweiß', 'Käse, Ei, Frischkäse, Hähnchen, Hummus, Joghurt'], ['Frisch', 'Gurke, Paprika, Möhre, Apfel, Trauben, Beeren'], ['Kleinigkeit', 'Nüsse, Waffel, ein Keks, getrocknete Früchte']] } },
      { h: 'Was hält und was matscht', p: ['Bis zur großen Pause vergehen drei bis vier Stunden ohne Kühlung. Gut halten sich harte Gemüsesorten, Vollkornbrot, fester Käse, gekochte Eier und alles Trockene.', 'Schlecht halten sich geschnittene Bananen und Äpfel ohne Zitrone, wässrige Tomaten direkt auf dem Brot, Blattsalat und alles mit Mayonnaise. Der einfachste Trick gegen matschiges Brot ist eine Schicht Butter oder Frischkäse als Sperre zwischen Brot und Belag.'] },
      { h: 'Der Abend ist die bessere Uhrzeit', p: ['Alles, was nicht angeschnitten werden muss, kann am Vorabend in die Box. Gemüsesticks halten über Nacht im Kühlschrank sogar besser, wenn sie in einem geschlossenen Behälter liegen.', 'Zehn Minuten am Abend ersetzen zehn hektische Minuten am Morgen – und die Entscheidung fällt zu einer Zeit, in der man sie treffen kann.'] },
      { h: 'Einmal in der Woche vorbereiten', p: ['Wer am Sonntag Gemüse schneidet, Eier kocht und Aufstriche anrührt, hat für vier Tage die halbe Arbeit erledigt. Geschnittene Möhren und Paprika halten sich in Wasser oder luftdicht bis Donnerstag.'] }
    ],
    schluss: 'Die beste Brotbox ist nicht die aufwendigste, sondern die, die leer zurückkommt.',
    cta: 'Zettelini denkt Frühstück und Brotbox mit – sie stehen im Wochenplan und landen automatisch auf der Einkaufsliste.',
    verwandt: ['kinder-essen-nichts-neues', 'meal-prep-familie', 'einkaufsliste-erstellen']
  },
  {
    slug: 'meal-prep-familie',
    titel: 'Meal Prep für Familien: was im Alltag wirklich funktioniert',
    kurz: 'Komponenten vorbereiten statt fünf fertige Boxen stapeln.',
    beschreibung: 'Meal Prep mit Kindern funktioniert anders als auf Instagram: Warum Komponenten-Vorbereitung im Familienalltag trägt und fertige Menüboxen scheitern.',
    lead: 'Fünf identische Boxen im Kühlschrank funktionieren für eine Person mit festem Tagesablauf. Eine Familie ist beides nicht.',
    einleitung: 'Meal Prep hat ein Bildproblem: gestapelte Behälter mit fünfmal demselben Reisgericht. Keine Fließbandproduktion bitte – in einer Familie isst am Dienstag jemand auswärts, am Mittwoch kommt ein Kind früher, und am Donnerstag will niemand mehr Reis sehen. Was trägt, ist die Mischung aus Vorbereiten und Variieren.',
    abschnitte: [
      { h: 'Komponenten statt Menüs', p: ['Bereite keine fertigen Gerichte vor, sondern Bausteine: gekochtes Getreide, eine Basissauce, gewaschener Salat, geschnittenes Gemüse, gegartes Hackfleisch oder Linsen.', 'Aus denselben fünf Komponenten entstehen an drei Abenden drei verschiedene Gerichte. Das ist der Unterschied zwischen Vorbereitung und Vorwegnahme.'] },
      { h: 'Was sich wirklich lohnt', tabelle: { kopf: ['Vorbereitung', 'Zeitgewinn', 'Hält'] , zeilen: [['Tomatensauce in größerer Menge', 'sehr hoch', '3 Tage gekühlt, Monate eingefroren'], ['Zwiebeln und Hartgemüse schneiden', 'hoch', '2 bis 3 Tage luftdicht'], ['Getreide und Hülsenfrüchte kochen', 'hoch', '2 bis 3 Tage gekühlt'], ['Teig für Pfannkuchen ansetzen', 'mittel', '1 Tag'], ['Blattsalat waschen', 'mittel', '2 Tage, trocken gelagert']] } },
      { h: 'Zwei Regeln aus der Küchenhygiene', p: ['Gekochtes muss zügig abkühlen und dann in den Kühlschrank – nicht stundenlang auf dem Herd stehen bleiben. Bei Reis ist das besonders wichtig, weil sich darin Keime bilden können, die auch das Aufwärmen übersteht.', 'Und alles, was vorbereitet wurde, bekommt ein Datum. Ein Klebeband mit drei Zahlen darauf verhindert die Frage, die sonst jeden Donnerstag im Kühlschrank steht.'] },
      { h: 'Der realistische Zeitrahmen', p: ['Sechzig bis neunzig Minuten am Wochenende reichen für drei bis vier Komponenten. Wer sich vier Stunden vornimmt, macht es einmal und nie wieder.', 'Am besten koppelst du es an etwas, das ohnehin passiert: Während der Auflauf für Sonntag im Ofen ist, wird das Gemüse für Montag und Dienstag geschnitten.'] }
    ],
    schluss: 'Meal Prep für Familien heißt nicht, das Kochen vorwegzunehmen. Es heißt, die lästigen zwanzig Minuten aus jedem Abend herauszunehmen.',
    cta: 'Zettelini zeigt dir, welche Zutaten in deiner Woche mehrfach vorkommen – das sind genau die, die sich vorzubereiten lohnen.',
    verwandt: ['wochenplan-erstellen', 'einkaufsliste-erstellen', 'brotbox-ideen']
  }
];

const titelVon = {};
artikel.forEach(a => { titelVon[a.slug] = a.titel; });

function kopf(a) {
  const url = URL_BASIS + '/ratgeber/' + a.slug + '/';
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.titel,
    description: a.beschreibung,
    inLanguage: 'de',
    datePublished: HEUTE,
    author: { '@type': 'Person', name: 'Tom Schönknecht' },
    publisher: { '@type': 'Organization', name: 'Zettelini' },
    mainEntityOfPage: url
  };
  return [
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + a.titel + ' | Zettelini</title>',
    '<meta name="description" content="' + a.beschreibung + '">',
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:site_name" content="Zettelini">',
    '<meta property="og:locale" content="de_DE">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:title" content="' + a.titel + '">',
    '<meta property="og:description" content="' + a.kurz + '">',
    '<meta name="twitter:card" content="summary">',
    '<link rel="stylesheet" href="../ratgeber.css">',
    '<script type="application/ld+json">',
    JSON.stringify(ld, null, 2),
    '<\/script>',
    '</head>',
    '<body>',
    '',
    '<header class="nav">',
    '  <a class="nav-brand" href="../../">Zettelini</a>',
    '  <a class="nav-cta" href="../../app/">Planer öffnen</a>',
    '</header>',
    ''
  ].join('\n');
}

function tabelleHtml(t) {
  let s = '  <div class="tbl-wrap">\n  <table>\n    <thead><tr>';
  t.kopf.forEach(k => { s += '<th>' + k + '</th>'; });
  s += '</tr></thead>\n    <tbody>\n';
  t.zeilen.forEach(z => {
    s += '      <tr>';
    z.forEach(feld => { s += '<td>' + feld + '</td>'; });
    s += '</tr>\n';
  });
  s += '    </tbody>\n  </table>\n  </div>\n';
  return s;
}

function seite(a) {
  let s = kopf(a);
  s += '<div class="wrap">\n<article>\n';
  s += '  <div class="eyebrow">Ratgeber</div>\n';
  s += '  <h1>' + a.titel + '</h1>\n\n';
  s += '  <p class="lead">' + a.lead + '</p>\n';
  s += '  <p>' + a.einleitung + '</p>\n\n';
  s += '  <hr class="sep">\n\n';
  a.abschnitte.forEach(ab => {
    s += '  <h2>' + ab.h + '</h2>\n';
    (ab.p || []).forEach(t => { s += '  <p>' + t + '</p>\n'; });
    if (ab.tabelle) s += tabelleHtml(ab.tabelle);
    s += '\n';
  });
  s += '  <hr class="sep">\n\n';
  s += '  <p>' + a.schluss + '</p>\n\n';
  s += '  <div class="cta-box">\n    <p>' + a.cta + '</p>\n    <a class="cta-btn" href="../../app/">Planer öffnen</a>\n  </div>\n\n';
  s += '  <div class="related">\n    <h3>Weiterlesen</h3>\n';
  a.verwandt.forEach(v => { s += '    <a href="../' + v + '/">' + titelVon[v] + '</a>\n'; });
  s += '  </div>\n</article>\n</div>\n\n';
  s += '<footer>\n  <a href="../../">Zettelini</a> · <a href="../">Ratgeber</a> · <a href="../../impressum/">Impressum</a> · <a href="../../datenschutz/">Datenschutz</a>\n</footer>\n\n</body>\n</html>\n';
  return s;
}

// Artikelseiten schreiben
artikel.forEach(a => {
  const ordner = path.join(BASIS, 'ratgeber', a.slug);
  fs.mkdirSync(ordner, { recursive: true });
  fs.writeFileSync(path.join(ordner, 'index.html'), seite(a), 'utf8');
  console.log('geschrieben: ratgeber/' + a.slug + '/index.html');
});

// Uebersichtsseite
let ue = [
  '<!DOCTYPE html>',
  '<html lang="de">',
  '<head>',
  '<meta charset="UTF-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '<title>Ratgeber: Wochenplan, Einkauf und Brotbox | Zettelini</title>',
  '<meta name="description" content="Ratgeber rund um die Essensplanung für Familien: Wochenplan aufstellen, Einkaufsliste erzeugen, wählerische Kinder, Brotbox und Meal Prep.">',
  '<link rel="canonical" href="' + URL_BASIS + '/ratgeber/">',
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="Zettelini">',
  '<meta property="og:locale" content="de_DE">',
  '<meta property="og:url" content="' + URL_BASIS + '/ratgeber/">',
  '<meta property="og:title" content="Ratgeber: Wochenplan, Einkauf und Brotbox">',
  '<meta property="og:description" content="Essensplanung für Familien, von der Wochenstruktur bis zur Brotbox.">',
  '<link rel="stylesheet" href="ratgeber.css">',
  '</head>',
  '<body>',
  '',
  '<header class="nav">',
  '  <a class="nav-brand" href="../">Zettelini</a>',
  '  <a class="nav-cta" href="../app/">Planer öffnen</a>',
  '</header>',
  '',
  '<div class="wrap">',
  '  <div class="eyebrow">Ratgeber</div>',
  '  <h1>Essensplanung für Familien</h1>',
  '  <p class="lead">Wie aus der Frage "Was gibt es diese Woche?" eine Sache von zehn Minuten wird.</p>',
  '  <div class="rg-liste">'
].join('\n') + '\n';

artikel.forEach(a => {
  ue += '    <a class="rg-card" href="' + a.slug + '/">\n';
  ue += '      <h2>' + a.titel + '</h2>\n';
  ue += '      <p>' + a.kurz + '</p>\n';
  ue += '    </a>\n';
});

ue += '  </div>\n</div>\n\n<footer>\n  <a href="../">Zettelini</a> · <a href="../impressum/">Impressum</a> · <a href="../datenschutz/">Datenschutz</a>\n</footer>\n\n</body>\n</html>\n';
fs.writeFileSync(path.join(BASIS, 'ratgeber', 'index.html'), ue, 'utf8');
console.log('geschrieben: ratgeber/index.html');

// sitemap.xml
let sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
sm += '  <url>\n    <loc>' + URL_BASIS + '/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n';
sm += '  <url>\n    <loc>' + URL_BASIS + '/app/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n';
sm += '  <url>\n    <loc>' + URL_BASIS + '/ratgeber/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
artikel.forEach(a => {
  sm += '  <url>\n    <loc>' + URL_BASIS + '/ratgeber/' + a.slug + '/</loc>\n    <changefreq>yearly</changefreq>\n    <priority>0.7</priority>\n  </url>\n';
});
sm += '</urlset>\n';
fs.writeFileSync(path.join(BASIS, 'sitemap.xml'), sm, 'utf8');
console.log('geschrieben: sitemap.xml (' + (artikel.length + 3) + ' URLs)');
