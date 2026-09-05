const fs = require('fs');
const path = require('path');

const BASIS = 'C:/claude-projekt/familienplaner';
const URL_BASIS = 'https://zettelini.de';
const HEUTE = '2026-08-21';
const GEAENDERT = '2026-09-05';

// Text, der in ein HTML-Attribut wandert, muss escapt werden. Ohne das brach jede
// Beschreibung mit Anfuehrungszeichen das content-Attribut auf, und Suchmaschinen lasen
// nur den Anfang. Im Fliesstext wird bewusst nicht escapt, dort stehen gewollte Links.
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const artikel = [
  {
    slug: 'wochenplan-erstellen',
    titel: 'Wochenplan fürs Familienessen: so stellst du ihn auf',
    kurz: 'Ein Gerüst mit festen Ankern schlägt sieben frei erfundene Gerichte.',
    beschreibung: 'Essensplan für die Woche aufstellen: mit festen Ankertagen, Vorratscheck und realistischen Zeitfenstern statt sieben frei erfundenen Gerichten.',
    lead: 'Die Sonntagabend-Verzweiflung hat selten mit fehlenden Rezepten zu tun. Sie hat mit fehlender Struktur zu tun.',
    einleitung: 'Verzweifelst du auch regelmäßig an der Essensplanung? Puh, was hat mich das schon Nerven gekostet. Und alle zwei Tage Spontaneinkauf im Supermarkt ist am Ende des Monats richtig teuer. Wer sich hinsetzt und sieben Gerichte aus dem Nichts erfinden will, stellt sich eine Aufgabe, an der jeder scheitert. Ein guter Wochenplan wird nicht erfunden, er wird zusammengesetzt – aus wenigen festen Bausteinen, die sich jede Woche wiederholen dürfen.',
    abschnitte: [
      { h: 'Zuerst das Gerüst, dann die Gerichte', p: ['Feste Anker nehmen dir die Hälfte der Entscheidungen ab. Ein Tag in der Woche ist Nudeltag, einer Restetag, einer der Tag, an dem es schnell gehen muss, weil Sport ist. Diese Anker ändern sich über Monate nicht – du füllst sie nur unterschiedlich.', 'Der Rest ergibt sich fast von selbst: Zwei bis drei Abende bleiben frei für das, worauf ihr Lust habt oder was weg muss.', 'Der Gewinn dahinter ist ein psychologischer. Die Frage, was es am Mittwoch gibt, hat unendlich viele Antworten. Die Frage, welche Sauce am Mittwoch zu den Nudeln kommt, hat vier. Anker verwandeln eine offene Frage in eine geschlossene, und geschlossene Fragen beantwortet man nebenbei.'] },
      { h: 'Der Vorratscheck kommt vor dem Planen', p: ['Bevor du irgendetwas aufschreibst, schau in Kühlschrank, Vorrat und Tiefkühler. Was dort schon liegt, bestimmt zwei Abende der Woche – und verhindert, dass du zum dritten Mal Kokosmilch kaufst.', 'Diese Reihenfolge ist der häufigste Fehler. Wer erst plant und dann schaut, kauft doppelt und wirft weg.', 'Es reichen drei Minuten und drei Fragen: Was ist angebrochen? Was läuft bald ab? Was liegt seit Wochen unangetastet im Tiefkühler? Die Antworten sind der Anfang deines Plans, nicht sein Rest.'] },
      { h: 'Zeit ist die Zutat, die am häufigsten fehlt', p: ['Trage die Woche zuerst als Kalender ein, nicht als Speisekarte. An welchem Tag seid ihr erst um sieben zu Hause? Wann ist jemand außer Haus? Ein Gericht mit vierzig Minuten Ofenzeit an einem Dienstag mit Turnen ist kein Plan, sondern eine Enttäuschung mit Vorlauf.', 'Rechne dabei ehrlich. Die zwanzig Minuten, die im Rezept stehen, sind reine Kochzeit. Schneiden, Suchen, Abräumen und die Frage, wer den Tisch deckt, stehen nirgends – und dauern zusammen oft länger als das Kochen selbst.'] },
      { h: 'So sieht eine tragfähige Woche aus', tabelle: { kopf: ['Tag', 'Anker', 'Was das heißt'], zeilen: [['Montag', 'Einfach', 'Ein Topf, wenig Aufwand, Start in die Woche'], ['Dienstag', 'Schnell', 'Höchstens 20 Minuten, weil der Nachmittag voll ist'], ['Mittwoch', 'Nudeln', 'Wechselnde Sauce, immer dieselbe Basis'], ['Donnerstag', 'Vorrat', 'Was aus Tiefkühler und Regal weg muss'], ['Freitag', 'Lieblingsessen', 'Der Tag, auf den sich alle freuen'], ['Samstag', 'Aufwendiger', 'Wenn Zeit da ist, sonst tauschen'], ['Sonntag', 'Reste', 'Was die Woche übrig gelassen hat']] } },
      { h: 'Zwanzig Minuten, einmal in der Woche', p: ['Ein Plan entsteht nicht nebenbei zwischen Tür und Angel. Er braucht einen festen Termin, sonst wird er zur Aufgabe, die man vor sich herschiebt, bis der Kühlschrank die Entscheidung trifft.', 'Bei uns ist es der Samstagvormittag, weil danach der Einkauf kommt. Der Ablauf ist immer derselbe:'], liste: ['In den Kalender schauen: Welche Abende sind eng, wer ist außer Haus, kommt Besuch?', 'In den Vorrat schauen: Was muss weg, was ist noch da?', 'Fünf Abende füllen, zwei frei lassen.', 'Frühstück und Brotbox mitdenken – sonst deckt der Plan nur ein Drittel der Mahlzeiten ab.', 'Die <a href="../einkaufsliste-erstellen/">Einkaufsliste</a> direkt daraus schreiben, nicht später aus dem Gedächtnis.'] },
      { h: 'Zwei Regeln, die den Plan haltbar machen', p: ['Erstens: Plane höchstens fünf Abende fest. Zwei Lücken sind kein Versäumnis, sondern der Puffer, an dem der ganze Plan hängt – spontane Einladungen, ein Kind wird krank, es wird später.', 'Zweitens: Ein neues Gericht pro Woche, nicht drei. Neue Rezepte kosten Zeit, Aufmerksamkeit und manchmal einen Abend. Eines ist Abwechslung, drei sind ein Projekt.'] },
      { h: 'Wenn der Plan kippt', p: ['Er wird kippen, und zwar regelmäßig. Der Unterschied zwischen einem Plan, der hält, und einem, der nach drei Wochen in der Schublade liegt, ist die Reaktion darauf.', 'Die Regel heißt tauschen, nicht streichen. Wenn der Dienstag platzt, rutscht das Dienstagsgericht auf Donnerstag und der Vorratstag auf Dienstag. Die Zutaten sind gekauft, sie verderben nicht über Nacht, und der Plan bleibt ganz.', 'Dafür braucht es einen Notnagel im Vorrat: ein Gericht, das komplett aus haltbaren Zutaten besteht und in zehn Minuten fertig ist. Nudeln mit Pesto zählen. Was bei euch zählt, entscheidet ihr – Hauptsache, es steht immer bereit und wird nie im normalen Plan verbraucht.'] }
    ],
    schluss: 'Ein Wochenplan ist kein Vertrag. Er ist eine Entscheidung, die du einmal triffst, damit du sie nicht siebenmal treffen musst.',
    faq: [
      { f: 'Wie lange dauert es, einen Wochenplan aufzustellen?', a: 'Mit einer festen Gerichteliste und Ankertagen etwa zwanzig Minuten, Einkaufsliste inbegriffen. Die erste Woche dauert länger, weil das Gerüst erst entsteht. Ab der dritten Woche ist es Routine.' },
      { f: 'Wie viele Abende sollte man fest verplanen?', a: 'Fünf von sieben. Zwei Lücken fangen ab, was ohnehin dazwischenkommt: spontane Einladungen, Krankheit, ein Abend, an dem niemand Hunger hat. Wer alle sieben verplant, hat nach dem ersten Ausfall keinen Plan mehr, sondern eine Liste von Vorwürfen.' },
      { f: 'Lohnt sich ein Wochenplan auch für zwei Personen?', a: 'Ja, aber aus einem anderen Grund. Bei Familien geht es um Zeit und Nerven, bei Paaren vor allem ums Geld und um weniger Weggeworfenes. Kleine Haushalte kaufen anteilig mehr, als sie essen.' },
      { f: 'Wie weit im Voraus sollte man planen?', a: 'Eine Woche. Zwei Wochen klingen effizienter, scheitern aber am Frischeeinkauf und daran, dass niemand weiß, worauf er in elf Tagen Lust hat.' }
    ],
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
      { h: 'Die Stammliste anlegen', p: ['Setz dich einmal hin und schreib alles auf, was ihr esst und was funktioniert. Nicht das, was du gerne kochen würdest – das, was ihr tatsächlich esst. Zwanzig Zeilen, mehr braucht es nicht.', 'Wenn dir nichts einfällt, hilft ein Blick in die Kassenbons oder in die Fotos der letzten Wochen. Der Kopf erinnert sich an das aufwendige Sonntagsessen, nicht an die vier Dienstage davor – dabei sind es die Dienstage, die den Plan tragen.', 'Sortiere sie dann nach Aufwand: schnell, normal, aufwendig. Damit hast du beim Planen sofort die Antwort auf die eigentliche Frage, nämlich nicht was es gibt, sondern was an einen Dienstag passt.'] },
      { h: 'Drei Schubladen statt einer Liste', p: ['Die Sortierung nach Aufwand ist der eigentliche Gewinn. Beim Planen schaust du nicht mehr auf zwanzig Gerichte, sondern auf die fünf, die zu dem Abend passen, den du gerade vor dir hast.'], tabelle: { kopf: ['Schublade', 'Zeit', 'Wofür sie da ist'], zeilen: [['Schnell', 'bis 20 Minuten', 'Volle Nachmittage, späte Heimkehr, Tage ohne Nerven'], ['Normal', '30 bis 45 Minuten', 'Der Regelfall, drei- bis viermal die Woche'], ['Aufwendig', 'über 45 Minuten', 'Wochenende, Besuch, oder wenn jemand Lust darauf hat']] } },
      { h: 'Wiederholung ist kein Makel', p: ['Meine Kinder mögen Wiederholung, solange es ihnen schmeckt. Sie essen lieber, was sie kennen – und du kochst schneller, was du auswendig kannst. Ein Gericht alle zwei Wochen ist keine Eintönigkeit, sondern Verlässlichkeit.', 'Abwechslung entsteht besser über Beilagen und Saucen als über ständig neue Rezepte. Dieselben Nudeln mit vier Saucen sind vier Gerichte. Und so mogelst du auch mal etwas Gesundes darunter.', 'Der Vergleichsmaßstab ist ohnehin schief: Restaurants und Kochsendungen leben von Abwechslung, Familienküchen von Verlässlichkeit. Vom Frühstück erwartet auch niemand, dass es jeden Tag anders aussieht.'] },
      { h: 'Wann neue Gerichte dazukommen', p: ['Einmal pro Woche eines, am besten an einem Tag mit Luft. Was funktioniert, wandert in die Stammliste. Was nicht, wird gestrichen und nie wieder erwähnt.', 'So wächst die Liste langsam und bleibt trotzdem erprobt. Nach einem Jahr hast du dreißig Gerichte, von denen jedes einzelne schon einmal geklappt hat.', 'Und wenn ein neues Gericht durchfällt, ist der Abend gerettet, solange Brot im Haus ist. Das ist kein Scheitern, sondern der Preis für die Erweiterung – zwei Treffer aus fünf Versuchen sind eine gute Quote.'] },
      { h: 'Warum Rezeptportale die Frage nicht beantworten', p: ['Ein Rezeptportal löst ein anderes Problem als deins. Es beantwortet, wie man ein bestimmtes Gericht kocht – du fragst aber, was es am Mittwoch gibt, wenn ihr erst um halb sieben da seid und noch Möhren weg müssen.', 'Diese Frage kennt nur, wer deinen Kalender, deinen Vorrat und die Vorlieben am Tisch kennt. Deshalb führt der Weg über die eigene Liste, nicht über die fremde Datenbank. Wie daraus eine ganze Woche wird, steht im Artikel zum <a href="../wochenplan-erstellen/">Wochenplan</a>.'] }
    ],
    schluss: 'Die Frage, was es diese Woche gibt, beantwortet man nicht mit Inspiration, sondern mit einer Liste, die man schon hat.',
    faq: [
      { f: 'Wie viele Gerichte braucht man für eine Stammliste?', a: 'Zwanzig reichen. Bei fünf gekochten Abenden pro Woche kommt damit jedes Gericht etwa alle vier Wochen einmal vor – das nimmt niemand als Wiederholung wahr.' },
      { f: 'Was tun, wenn einem partout nichts einfällt?', a: 'Nicht suchen, sondern erinnern. Fotos der letzten Wochen, Kassenbons oder ein Blick in den Gewürzschrank bringen mehr als jede Rezeptsuche, weil sie zeigen, was ihr wirklich esst.' },
      { f: 'Wie oft darf sich ein Gericht wiederholen?', a: 'Öfter, als man denkt. Kinder empfinden Wiederholung als verlässlich, nicht als langweilig. Kritisch wird es erst bei zweimal in derselben Woche.' },
      { f: 'Muss man wirklich jede Woche etwas Neues ausprobieren?', a: 'Nein, aber ohne neue Gerichte schrumpft die Liste über die Jahre, weil Gerichte ausfallen und nichts nachkommt. Eines pro Woche hält sie gerade so am Wachsen.' }
    ],
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
      { h: 'Schritt zwei: Zutaten je Gericht, Mengen je Person', p: ['Geh den Plan Abend für Abend durch und schreib die Zutaten auf. Rechne dabei sofort in Personen um: Ein Rezept für zwei bei einer vierköpfigen Familie ist die häufigste Ursache für zu kleine Portionen.', 'Bei Gerichten, die mehrfach vorkommen, addierst du. Zwei Abende mit Zwiebeln sind nicht zwei Zeilen, sondern eine mit der Summe.', 'Und schreib die Menge dazu, nicht nur die Zutat. "Hackfleisch" im Laden ist eine offene Frage, "800 g Hackfleisch" ist eine Anweisung. Wer ohne Mengen einkauft, entscheidet im Laden neu – und entscheidet dort erfahrungsgemäß großzügiger.'] },
      { h: 'Schritt drei: nach Ladenwegen sortieren', p: ['Eine Liste nach Gerichten sortiert schickt dich fünfmal durch den Laden. Eine Liste nach Warengruppen – Obst und Gemüse, Kühlregal, Trockenes, Tiefkühl – schickt dich einmal und macht den Einkauf beinahe zum Spaziergang.', 'Das klingt nach Kleinigkeit und spart bei einem großen Wocheneinkauf zehn bis fünfzehn Minuten. Vor allem aber verhindert es, dass du auf dem Rückweg noch drei Dinge mitnimmst, die du nicht brauchst.'] },
      { h: 'Die drei Zeilen, die immer fehlen', tabelle: { kopf: ['Was', 'Warum es vergessen wird'], zeilen: [['Grundzutaten', 'Öl, Salz, Mehl stehen in keinem Rezept ganz oben und sind irgendwann leer'], ['Frühstück und Brotbox', 'Der Plan deckt Abendessen ab, gegessen wird aber den ganzen Tag'], ['Der Puffer', 'Ein Ersatzgericht aus dem Vorrat für den Abend, an dem alles anders kommt']] } },
      { h: 'Ein großer Einkauf, ein kleiner Nachkauf', p: ['Der Versuch, eine ganze Woche in einem Einkauf zu erledigen, scheitert an der Frische. Salat, Beeren und Kräuter halten nicht bis Freitag, und Fisch will man am dritten Tag nicht mehr essen.', 'Bewährt hat sich eine Zweiteilung: ein großer Einkauf für alles Haltbare und die ersten drei Tage, dann ein kurzer Nachkauf am Mittwoch oder Donnerstag für Frisches. Der zweite dauert zehn Minuten, wenn die Liste dafür schon beim Planen entstanden ist.', 'Wichtig ist nur, dass die zweite Liste nicht neu erfunden wird. Sie ist der Rest der ersten, nicht ein zweiter Anlauf.'] },
      { h: 'Zettel, Handy oder Foto', p: ['Der Papierzettel ist unschlagbar, solange nur einer einkauft. Sobald zwei Menschen sich den Einkauf teilen oder jemand unterwegs noch etwas mitbringen soll, ist er die schlechteste aller Lösungen: Er liegt immer beim anderen.', 'Ein Foto vom Zettel hilft halb – man sieht die Liste, kann aber nichts abhaken, und der Vorrat zu Hause ändert sich derweil.', 'Was tatsächlich trägt, ist eine Liste, die sich aus dem Plan selbst ergibt und die beide sehen. Dann fragt niemand mehr, ob die Milch schon im Wagen liegt.'] }
    ],
    schluss: 'Eine gute Einkaufsliste ist keine Gedächtnisstütze. Sie ist der <a href="../wochenplan-erstellen/">Wochenplan</a>, übersetzt in die Reihenfolge des Ladens.',
    faq: [
      { f: 'Wie schreibt man eine Einkaufsliste aus dem Wochenplan?', a: 'In drei Schritten: erst den Vorrat prüfen, dann die Zutaten je Gericht auf die Personenzahl umrechnen und gleiche Zutaten addieren, zuletzt nach Warengruppen sortieren statt nach Gerichten.' },
      { f: 'Warum sollte man nach Warengruppen sortieren?', a: 'Weil der Laden so aufgebaut ist. Eine nach Gerichten sortierte Liste schickt dich mehrfach durch dieselben Gänge und kostet bei einem Wocheneinkauf zehn bis fünfzehn Minuten.' },
      { f: 'Was gehört auf jede Einkaufsliste, egal was geplant ist?', a: 'Grundzutaten wie Öl, Salz und Mehl, alles für Frühstück und Brotbox, und die Zutaten für ein einfaches Ersatzgericht aus dem Vorrat.' },
      { f: 'Reicht ein Einkauf pro Woche?', a: 'Für Haltbares ja, für Frisches nicht. Salat, Beeren und Kräuter überstehen keine sieben Tage. Ein kurzer Nachkauf in der Wochenmitte ist realistischer als der Versuch, alles auf einmal zu besorgen.' }
    ],
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
      { h: 'Ein sicheres Element auf jedem Teller', p: ['Die praktikabelste Regel im Alltag: Auf dem Tisch steht immer mindestens eine Sache, die das Kind sicher isst. Brot, Nudeln, Reis, Gurke – irgendetwas Vertrautes.', 'Das ist kein Nachgeben, sondern die Bedingung dafür, dass ein Kind überhaupt entspannt genug ist, um vom Rest zu probieren. Wer hungrig und unter Druck am Tisch sitzt, probiert nichts.', 'Für die Planung heißt das: Bei jedem Gericht kurz prüfen, ob dieses eine Element dabei ist. Ist es nicht dabei, kommt Brot dazu. Das ist die ganze Anpassung – kein zweites Gericht, keine Extrawurst.'] },
      { h: 'Getrennt servieren statt vermischt', p: ['Aufläufe, Eintöpfe und Saucen, in denen alles miteinander verschwindet, sind für skeptische Kinder das Schwierigste. Dieselben Zutaten nebeneinander auf dem Teller werden deutlich eher gegessen.', 'Plane deshalb Gerichte, die sich zerlegen lassen: Bolognese getrennt von den Nudeln, Gemüse als Beilage statt untergemischt, Toppings zum Selbstnehmen.', 'Das kostet dich nichts außer einer Schüssel mehr auf dem Tisch. Und es verlagert die Entscheidung vom Herd auf den Teller – dorthin, wo das Kind sie selbst treffen kann.'] },
      { h: 'Wiederholung ohne Druck', p: ['Kinder brauchen ein Lebensmittel oft zehnmal oder häufiger auf dem Teller, bevor sie es annehmen. Nicht zehn Diskussionen – zehn beiläufige Begegnungen.', 'Das heißt konkret: Es liegt da, es wird nicht kommentiert, es muss nicht gegessen werden. Wer probiert, bekommt kein Lob, wer ablehnt, keine Bemerkung. Genau diese Gleichgültigkeit ist das Wirksame daran.', 'Am schwersten fällt dabei das Lob. Es fühlt sich freundlich an und macht aus dem Essen doch eine Prüfung, die man bestehen oder nicht bestehen kann. Wer nichts sagt, nimmt dem Teller die Bedeutung – und damit den Streit.'] },
      { h: 'Warum nicht zweimal gekocht wird', p: ['Ein zweites Gericht auf Bestellung ist kurzfristig Frieden und langfristig eine Falle: Es garantiert, dass nie etwas Neues probiert wird, und es kostet dich jeden Abend doppelt.', 'Der Mittelweg heißt Auswahl innerhalb des Gerichts. Es gibt, was es gibt – aber jeder stellt sich vom Angebot auf dem Tisch seinen Teller selbst zusammen.'] },
      { h: 'Kinder in die Planung holen', p: ['Wer mitentscheidet, streitet weniger. Jedes Kind bekommt einen Abend in der Woche, an dem es das Gericht bestimmt – aus der Liste dessen, was ihr ohnehin kocht, nicht aus dem Nichts.', 'Erwarte dabei keine ausgewogene Auswahl. Es wird Nudeln geben, dann Pfannkuchen, dann wieder Nudeln. Das ist in Ordnung: Der Gewinn liegt nicht im Gericht, sondern darin, dass an vier anderen Abenden nicht mehr verhandelt wird.', 'Der zweite Hebel ist die Küche selbst. Kinder, die Gemüse waschen, Teig rühren oder den Tisch decken, essen erwiesenermaßen bereitwilliger, was sie mit vorbereitet haben. Und sie brauchen dafür keine Aufgabe, die etwas bringt – sie brauchen eine, die ihnen gehört.'] },
      { h: 'Wann es mehr als eine Phase ist', p: ['Wählerisch sein ist normal. Es gibt aber Anzeichen, bei denen man nicht auf das Ende der Phase warten sollte: wenn ganze Lebensmittelgruppen über Monate wegfallen, wenn ein Kind nur noch eine Handvoll Dinge isst und die Liste immer kürzer wird, wenn Gewicht oder Wachstum abweichen, oder wenn Essen mit Würgen, Schmerzen oder großer Angst verbunden ist.', 'Dann gehört das zum Kinderarzt, nicht in einen Ratgeber. Das ist keine dramatische Aussage, sondern eine praktische: Hinter anhaltender Verweigerung stecken manchmal Unverträglichkeiten oder Schluckprobleme, und beides löst man nicht mit Planung.'] }
    ],
    schluss: 'Der Plan muss nicht jedem Kind gefallen. Er muss nur dafür sorgen, dass niemand hungrig aufsteht und niemand streiten muss.',
    faq: [
      { f: 'Ab wann und wie lange sind Kinder wählerisch?', a: 'Meist zwischen dem zweiten und dem sechsten Lebensjahr, mit dem Höhepunkt um das dritte. Bei den meisten Kindern lässt es danach von selbst nach.' },
      { f: 'Soll man für wählerische Kinder extra kochen?', a: 'Besser nicht. Ein zweites Gericht auf Bestellung schafft kurzfristig Ruhe und sorgt dafür, dass nie etwas Neues probiert wird. Tragfähiger ist ein vertrautes Element auf dem Tisch, aus dem sich jeder selbst bedienen kann.' },
      { f: 'Wie oft muss ein Kind etwas probieren, bevor es schmeckt?', a: 'Oft zehnmal oder häufiger – aber als beiläufige Begegnung, nicht als Aufforderung. Entscheidend ist, dass weder Probieren gelobt noch Ablehnen kommentiert wird.' },
      { f: 'Wann sollte man ärztlichen Rat suchen?', a: 'Wenn die Liste der gegessenen Lebensmittel über Monate immer kürzer wird, ganze Gruppen dauerhaft fehlen, Gewicht oder Wachstum abweichen oder Essen mit Würgen, Schmerzen oder Angst verbunden ist.' }
    ],
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
      { h: 'Eine Woche, einmal durchkombiniert', p: ['Aus vier Plätzen und wenigen Zutaten entsteht eine Woche, in der sich nichts wiederholt, obwohl fast alles gleich bleibt. So sieht das konkret aus:'], tabelle: { kopf: ['Tag', 'Sättigend', 'Eiweiß', 'Frisch'], zeilen: [['Montag', 'Vollkornbrot', 'Frischkäse', 'Gurkenscheiben'], ['Dienstag', 'Wrap', 'Hähnchenreste vom Vortag', 'Paprikastreifen'], ['Mittwoch', 'Nudelsalat', 'Käsewürfel', 'Möhrensticks'], ['Donnerstag', 'Pfannkuchenrolle', 'gekochtes Ei', 'Apfelspalten'], ['Freitag', 'Brötchen', 'Hummus', 'Trauben']] } },
      { h: 'Was hält und was matscht', p: ['Bis zur großen Pause vergehen drei bis vier Stunden ohne Kühlung. Gut halten sich harte Gemüsesorten, Vollkornbrot, fester Käse, gekochte Eier und alles Trockene.', 'Schlecht halten sich geschnittene Bananen und Äpfel ohne Zitrone, wässrige Tomaten direkt auf dem Brot, Blattsalat und alles mit Mayonnaise. Der einfachste Trick gegen matschiges Brot ist eine Schicht Butter oder Frischkäse als Sperre zwischen Brot und Belag.', 'Wenn die Box in einem warmen Ranzen liegt, hilft ein Kühlakku in der Größe einer Streichholzschachtel mehr als jede Auswahl. Bei Ei, Wurst und allem mit Joghurt lohnt er sich im Sommer immer.'] },
      { h: 'Der Abend ist die bessere Uhrzeit', p: ['Alles, was nicht angeschnitten werden muss, kann am Vorabend in die Box. Gemüsesticks halten über Nacht im Kühlschrank sogar besser, wenn sie in einem geschlossenen Behälter liegen.', 'Zehn Minuten am Abend ersetzen zehn hektische Minuten am Morgen – und die Entscheidung fällt zu einer Zeit, in der man sie treffen kann.'] },
      { h: 'Einmal in der Woche vorbereiten', p: ['Wer am Sonntag Gemüse schneidet, Eier kocht und Aufstriche anrührt, hat für vier Tage die halbe Arbeit erledigt. Geschnittene Möhren und Paprika halten sich in Wasser oder luftdicht bis Donnerstag.', 'Damit ist die Brotbox nichts anderes als <a href="../meal-prep-familie/">Meal Prep</a> im Kleinen: nicht fünf fertige Boxen stapeln, sondern die Bestandteile bereitlegen und morgens nur noch zusammensetzen.'] },
      { h: 'Was zurückkommt, ist eine Information', p: ['Die halb volle Box am Nachmittag ist kein Vorwurf, sondern der einzige verlässliche Rückmeldekanal, den du hast. Ein Kind sagt nicht, dass die Paprika seit vier Wochen langweilig ist – es lässt sie einfach liegen.', 'Schau eine Woche lang hin, was regelmäßig zurückkommt, und streich es. Was leer zurückkommt, bleibt. Nach drei Wochen hast du eine Liste, die tatsächlich gegessen wird, statt einer, die gut gemeint ist.', 'Und rechne mit der Pausenlänge. Manchmal liegt es nicht am Inhalt, sondern daran, dass zwanzig Minuten für ein ganzes belegtes Brot nicht reichen. Kleingeschnittenes verschwindet dann zuverlässiger als Ganzes.'] }
    ],
    schluss: 'Die beste Brotbox ist nicht die aufwendigste, sondern die, die leer zurückkommt.',
    faq: [
      { f: 'Was gehört in eine gute Brotbox?', a: 'Vier Plätze: etwas Sättigendes, etwas mit Eiweiß, etwas Frisches und eine Kleinigkeit. Sind sie besetzt, ist die Box vollständig – unabhängig davon, was genau darin liegt.' },
      { f: 'Was hält sich bis zur großen Pause?', a: 'Hartes Gemüse, Vollkornbrot, fester Käse, gekochte Eier und alles Trockene. Schlecht halten sich Blattsalat, wässrige Tomaten auf dem Brot, geschnittene Bananen und alles mit Mayonnaise.' },
      { f: 'Wie verhindert man, dass das Brot matscht?', a: 'Mit einer Sperrschicht aus Butter oder Frischkäse zwischen Brot und Belag, und indem Feuchtes wie Tomate oder Gurke getrennt daneben liegt.' },
      { f: 'Wann packt man die Brotbox am besten?', a: 'Am Vorabend. Alles außer frisch Angeschnittenem übersteht die Nacht im Kühlschrank problemlos, und die Entscheidung fällt zu einer Uhrzeit, zu der man sie treffen kann.' }
    ],
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
      { h: 'Komponenten statt Menüs', p: ['Bereite keine fertigen Gerichte vor, sondern Bausteine: gekochtes Getreide, eine Basissauce, gewaschener Salat, geschnittenes Gemüse, gegartes Hackfleisch oder Linsen.', 'Aus denselben fünf Komponenten entstehen an drei Abenden drei verschiedene Gerichte. Das ist der Unterschied zwischen Vorbereitung und Vorwegnahme.', 'Der praktische Vorteil zeigt sich an dem Abend, an dem alles anders kommt. Ein fertiges Menü, das keiner essen will, ist verloren. Eine Schüssel gekochter Reis findet immer eine Verwendung.'] },
      { h: 'Was sich wirklich lohnt', tabelle: { kopf: ['Vorbereitung', 'Zeitgewinn', 'Hält'] , zeilen: [['Tomatensauce in größerer Menge', 'sehr hoch', '3 Tage gekühlt, Monate eingefroren'], ['Zwiebeln und Hartgemüse schneiden', 'hoch', '2 bis 3 Tage luftdicht'], ['Getreide und Hülsenfrüchte kochen', 'hoch', '2 bis 3 Tage gekühlt'], ['Teig für Pfannkuchen ansetzen', 'mittel', '1 Tag'], ['Blattsalat waschen', 'mittel', '2 Tage, trocken gelagert']] } },
      { h: 'Ein Sonntag, konkret', p: ['Neunzig Minuten reichen für eine ganze Woche Vorsprung, wenn parallel gearbeitet wird statt nacheinander. Ein Ablauf, der sich bewährt hat:'], liste: ['Zuerst alles aufsetzen, was lange dauert und allein kocht: Getreide, Hülsenfrüchte, Eier.', 'Währenddessen Zwiebeln und Hartgemüse schneiden – das ist die Arbeit, die im Alltag jeden Abend zwanzig Minuten frisst.', 'Dann die Basissauce ansetzen und köcheln lassen.', 'Zum Schluss Salat waschen und trocken lagern, Gemüsesticks für die <a href="../brotbox-ideen/">Brotbox</a> schneiden.', 'Alles beschriften und kühlen, bevor aufgeräumt wird.'] },
      { h: 'Zwei Regeln aus der Küchenhygiene', p: ['Gekochtes muss zügig abkühlen und dann in den Kühlschrank – nicht stundenlang auf dem Herd stehen bleiben. Bei Reis ist das besonders wichtig, weil sich darin Keime bilden können, die auch das Aufwärmen übersteht.', 'Und alles, was vorbereitet wurde, bekommt ein Datum. Ein Klebeband mit drei Zahlen darauf verhindert die Frage, die sonst jeden Donnerstag im Kühlschrank steht.'] },
      { h: 'Einfrieren: was geht und was nicht', p: ['Der Tiefkühler ist der eigentliche Verbündete, weil er den Zeitdruck aus der Vorbereitung nimmt. Gut einfrieren lassen sich Saucen, Suppen, Eintöpfe, Hackfleisch, Brot, Pfannkuchen und geschnittenes Gemüse zum Weiterverarbeiten.', 'Schlecht vertragen es rohe Kartoffeln, Blattsalat, Gurke, gekochte Nudeln und alles mit viel Sahne oder Joghurt – das wird beim Auftauen wässrig oder flockig.', 'Friere in Portionen ein, die zu einem Abend passen, nicht in einem großen Block. Ein Kilo Sauce am Stück ist am Dienstagabend genauso wenig hilfreich wie gar keine.'] },
      { h: 'Was am dritten Tag noch schmeckt', p: ['Der ehrlichste Einwand gegen Meal Prep lautet: Es schmeckt nicht mehr. Das stimmt für fertige Gerichte und stimmt nicht für Komponenten – und darin liegt der ganze Unterschied.', 'Was gewinnt, sind Saucen, Eintöpfe und Schmorgerichte. Was verliert, ist alles Knusprige, jedes gebratene Stück Fleisch und alles, was in Sauce liegt, ohne darin gekocht worden zu sein. Deshalb bleibt die Sauce getrennt von den Nudeln, bis beides auf dem Teller ist.', 'Ein zweiter Punkt wird unterschätzt: Frisches am Schluss rettet fast jedes vorbereitete Gericht. Kräuter, ein Spritzer Zitrone, geriebener Käse oder ein paar Scheiben rohes Gemüse kosten dreißig Sekunden und lassen den Rest wieder nach heute schmecken statt nach Sonntag.'] },
      { h: 'Der realistische Zeitrahmen', p: ['Sechzig bis neunzig Minuten am Wochenende reichen für drei bis vier Komponenten. Wer sich vier Stunden vornimmt, macht es einmal und nie wieder.', 'Am besten koppelst du es an etwas, das ohnehin passiert: Während der Auflauf für Sonntag im Ofen ist, wird das Gemüse für Montag und Dienstag geschnitten.'] }
    ],
    schluss: 'Meal Prep für Familien heißt nicht, das Kochen vorwegzunehmen. Es heißt, die lästigen zwanzig Minuten aus jedem Abend herauszunehmen.',
    faq: [
      { f: 'Was bereitet man beim Meal Prep für Familien am besten vor?', a: 'Komponenten statt fertiger Gerichte: eine Basissauce, gekochtes Getreide, geschnittenes Hartgemüse, gegartes Hackfleisch oder Linsen. Daraus entstehen an mehreren Abenden verschiedene Gerichte.' },
      { f: 'Wie lange hält sich Vorbereitetes im Kühlschrank?', a: 'Gekochtes Getreide und Hülsenfrüchte zwei bis drei Tage, geschnittenes Hartgemüse luftdicht ebenso lange, Tomatensauce etwa drei Tage. Alles mit Datum beschriften.' },
      { f: 'Wie viel Zeit muss man einplanen?', a: 'Sechzig bis neunzig Minuten am Wochenende für drei bis vier Komponenten. Größere Vorhaben scheitern meist daran, dass sie kein zweites Mal stattfinden.' },
      { f: 'Was sollte man nicht einfrieren?', a: 'Rohe Kartoffeln, Blattsalat, Gurke, gekochte Nudeln und Gerichte mit viel Sahne oder Joghurt. Sie werden beim Auftauen wässrig oder flockig.' }
    ],
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
    dateModified: GEAENDERT,
    author: { '@type': 'Person', name: 'Tom Schönknecht' },
    publisher: { '@type': 'Organization', name: 'Zettelini' },
    mainEntityOfPage: url
  };
  const bloecke = ['<script type="application/ld+json">', JSON.stringify(ld, null, 2), '<\/script>'];
  // Die Fragen noch einmal als FAQPage. Das ist die Auszeichnung, an der Suchmaschinen
  // und Sprachmodelle eine Antwort erkennen und einzeln zitieren koennen.
  if (a.faq && a.faq.length) {
    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: a.faq.map(q => ({
        '@type': 'Question',
        name: q.f,
        acceptedAnswer: { '@type': 'Answer', text: q.a }
      }))
    };
    bloecke.push('<script type="application/ld+json">', JSON.stringify(faqLd, null, 2), '<\/script>');
  }
  return [
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + esc(a.titel) + ' | Zettelini</title>',
    '<meta name="description" content="' + esc(a.beschreibung) + '">',
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:site_name" content="Zettelini">',
    '<meta property="og:locale" content="de_DE">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:title" content="' + esc(a.titel) + '">',
    '<meta property="og:description" content="' + esc(a.kurz) + '">',
    '<meta name="twitter:card" content="summary">',
    '<link rel="stylesheet" href="../ratgeber.css">',
    '<script defer src="../../zaehler.js"></' + 'script>'
  ].concat(bloecke).concat([
    '</head>',
    '<body>',
    '',
    '<header class="nav">',
    '  <a class="nav-brand" href="../../">Zettelini</a>',
    '  <a class="nav-cta" href="../../app/?von=ratgeber">Planer öffnen</a>',
    '</header>',
    ''
  ]).join('\n');
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

function listeHtml(punkte) {
  let s = '  <ul>\n';
  punkte.forEach(p => { s += '    <li>' + p + '</li>\n'; });
  s += '  </ul>\n';
  return s;
}

function faqHtml(faq) {
  let s = '  <h2>Häufige Fragen</h2>\n';
  faq.forEach(q => {
    s += '  <h3>' + q.f + '</h3>\n';
    s += '  <p>' + q.a + '</p>\n';
  });
  return s + '\n';
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
    if (ab.liste) s += listeHtml(ab.liste);
    if (ab.tabelle) s += tabelleHtml(ab.tabelle);
    s += '\n';
  });
  s += '  <hr class="sep">\n\n';
  s += '  <p>' + a.schluss + '</p>\n\n';
  if (a.faq && a.faq.length) s += faqHtml(a.faq);
  s += '  <div class="cta-box">\n    <p>' + a.cta + '</p>\n    <a class="cta-btn" href="../../app/?von=artikel">Planer öffnen</a>\n  </div>\n\n';
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
  '<script defer src="../zaehler.js"></' + 'script>',
  '</head>',
  '<body>',
  '',
  '<header class="nav">',
  '  <a class="nav-brand" href="../">Zettelini</a>',
  '  <a class="nav-cta" href="../app/?von=ratgeber">Planer öffnen</a>',
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
sm += '  <url>\n    <loc>' + URL_BASIS + '/ratgeber/</loc>\n    <lastmod>' + GEAENDERT + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
artikel.forEach(a => {
  sm += '  <url>\n    <loc>' + URL_BASIS + '/ratgeber/' + a.slug + '/</loc>\n    <lastmod>' + GEAENDERT + '</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.7</priority>\n  </url>\n';
});
sm += '</urlset>\n';
fs.writeFileSync(path.join(BASIS, 'sitemap.xml'), sm, 'utf8');
console.log('geschrieben: sitemap.xml (' + (artikel.length + 3) + ' URLs)');
