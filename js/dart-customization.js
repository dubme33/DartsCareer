(function (root) {
    'use strict';

    const text = {
        pl: {
            diameterLabel: 'Średnica barrela', resetDiameter: 'Domyślna dla kształtu',
            title: 'Personalizacja lotek', subtitle: 'Zbuduj własny zestaw. Wygląd nie zmienia celności ani statystyk.',
            preview: 'Aktualny zestaw', owned: 'Załóż', selected: 'Wybrane', buy: 'Kup',
            noFunds: 'Nie masz wystarczająco dużo pieniędzy.',
            confirm: 'Kupić „{item}” za £{price}?', purchased: 'Kupiono i założono: {item}.',
            shaftColor: 'Kolor shafta', flightColor: 'Kolor piórek', barrelColor: 'Kolor barrela',
            tipColor: 'Kolor grota', barrelShape: 'Kształt barrela', flightShape: 'Kształt piórek',
            barrelPattern: 'Grip na całym barrelu', barrelAccentColor: 'Drugi kolor barrela', barrelAccentStyle: 'Rozmieszczenie koloru',
            flightAccentColor: 'Drugi kolor piórek', flightPattern: 'Nadruk piórek', tipLength: 'Długość grota',
            tipStyle: 'Wykończenie grota', shaftLength: 'Długość shafta', shaftStyle: 'Materiał shafta',
            customColor: 'Dowolny kolor', catalogueColor: 'Przywróć kolor z katalogu',
            flightSystem: 'System shafta i piórka', integratedColor: 'Kolor zintegrowanego systemu',
            integratedHint: 'Shaft i piórko tworzą jedną część we wspólnym kolorze. Kształt i nadruk wybierzesz w zakładce Piórka.',
            barrel: 'Barrel', flights: 'Piórka', shaft: 'Shaft', point: 'Grot', tryOn: 'Przymierz',
            trying: 'Przymierzasz: {item}', reset: 'Wróć do zestawu', rotate: 'Przeciągnij, aby obrócić · strzałki na klawiaturze',
            resetView: 'Reset widoku', fallback: 'Podgląd 2D', measurements: 'Grot {tip} mm · barrel {barrel} mm · shaft {shaft} mm · {weight} g',
            weightLabel: 'Waga lotki', lengthLabel: 'Długość barrela', gripZonesTitle: 'Grip w poszczególnych strefach',
            gripZonesHint: 'Dziewięć mniejszych sekcji. Na liście są wszystkie gripy. Niekupione mają podaną cenę i można je kupić przy wyborze. Przód jest przy grocie, tył przy shafcie.',
            gripFront: 'Przód', gripMiddle: 'Środek', gripRear: 'Tył',
            artworkTitle: 'Własna grafika piórka', artworkHint: 'PNG, JPG lub WebP (do 5 MB). Grafika zastępuje nadruk na piórkach i działa także z systemami zintegrowanymi.',
            artworkAdd: 'Wybierz grafikę', artworkChange: 'Zmień grafikę', artworkRemove: 'Usuń grafikę',
            artworkInvalid: 'Nie udało się wczytać obrazu. Wybierz plik PNG, JPG lub WebP do 5 MB.'
        },
        en: {
            diameterLabel: 'Barrel diameter', resetDiameter: 'Shape default',
            title: 'Dart customisation', subtitle: 'Build your own set. Its appearance does not change accuracy or attributes.',
            preview: 'Current set', owned: 'Equip', selected: 'Selected', buy: 'Buy',
            noFunds: 'You do not have enough money.', confirm: 'Buy “{item}” for £{price}?',
            purchased: 'Purchased and equipped: {item}.', shaftColor: 'Shaft colour', flightColor: 'Flight colour',
            barrelColor: 'Barrel colour', tipColor: 'Point colour', barrelShape: 'Barrel shape',
            flightShape: 'Flight shape', barrelPattern: 'Grip on the whole barrel', barrelAccentColor: 'Barrel accent colour', barrelAccentStyle: 'Colour placement',
            flightAccentColor: 'Flight accent colour', flightPattern: 'Flight print', tipLength: 'Point length',
            tipStyle: 'Point finish', shaftLength: 'Shaft length', shaftStyle: 'Shaft material',
            customColor: 'Custom colour', catalogueColor: 'Restore catalogue colour',
            flightSystem: 'Shaft and flight system', integratedColor: 'Integrated system colour',
            integratedHint: 'Shaft and flight form one piece in a shared colour. Choose the shape and print in the Flights tab.',
            barrel: 'Barrel', flights: 'Flights', shaft: 'Shaft', point: 'Point', tryOn: 'Try on',
            trying: 'Trying on: {item}', reset: 'Back to equipped set', rotate: 'Drag to rotate · keyboard arrows',
            resetView: 'Reset view', fallback: '2D preview', measurements: 'Point {tip} mm · barrel {barrel} mm · shaft {shaft} mm · {weight} g',
            weightLabel: 'Dart weight', lengthLabel: 'Barrel length', gripZonesTitle: 'Grip by barrel section',
            gripZonesHint: 'Nine smaller sections. All grips are listed. Unowned grips show their price and can be bought when selected. Front is near the point; rear is near the shaft.',
            gripFront: 'Front', gripMiddle: 'Middle', gripRear: 'Rear',
            artworkTitle: 'Custom flight artwork', artworkHint: 'PNG, JPG or WebP (up to 5 MB). The image replaces the flight print and works with integrated systems too.',
            artworkAdd: 'Choose an image', artworkChange: 'Change image', artworkRemove: 'Remove image',
            artworkInvalid: 'Could not load the image. Choose a PNG, JPG or WebP file up to 5 MB.'
        },
        de: {
            diameterLabel: 'Barrel-Durchmesser', resetDiameter: 'Standard der Form',
            title: 'Dart-Anpassung', subtitle: 'Stelle dein eigenes Set zusammen. Das Aussehen ändert weder Präzision noch Werte.',
            preview: 'Aktuelles Set', owned: 'Ausrüsten', selected: 'Ausgewählt', buy: 'Kaufen',
            noFunds: 'Du hast nicht genug Geld.', confirm: '„{item}“ für £{price} kaufen?',
            purchased: 'Gekauft und ausgerüstet: {item}.', shaftColor: 'Schaftfarbe', flightColor: 'Flight-Farbe',
            barrelColor: 'Barrel-Farbe', tipColor: 'Spitzenfarbe', barrelShape: 'Barrel-Form',
            flightShape: 'Flight-Form', barrelPattern: 'Grip auf dem ganzen Barrel', barrelAccentColor: 'Zweite Barrel-Farbe', barrelAccentStyle: 'Farbverteilung',
            flightAccentColor: 'Zweite Flight-Farbe', flightPattern: 'Flight-Druck', tipLength: 'Spitzenlänge',
            tipStyle: 'Spitzenoberfläche', shaftLength: 'Schaftlänge', shaftStyle: 'Schaftmaterial',
            customColor: 'Eigene Farbe', catalogueColor: 'Katalogfarbe wiederherstellen',
            flightSystem: 'Schaft- und Flight-System', integratedColor: 'Farbe des integrierten Systems',
            integratedHint: 'Schaft und Flight bilden ein Teil in derselben Farbe. Form und Druck findest du unter Flights.',
            barrel: 'Barrel', flights: 'Flights', shaft: 'Schaft', point: 'Spitze', tryOn: 'Anprobieren',
            trying: 'Vorschau: {item}', reset: 'Zum aktuellen Set', rotate: 'Ziehen zum Drehen · Pfeiltasten',
            resetView: 'Ansicht zurücksetzen', fallback: '2D-Vorschau', measurements: 'Spitze {tip} mm · Barrel {barrel} mm · Schaft {shaft} mm · {weight} g',
            weightLabel: 'Dartgewicht', lengthLabel: 'Barrel-Länge', gripZonesTitle: 'Grip nach Barrel-Bereich',
            gripZonesHint: 'Neun kleinere Abschnitte. Alle Grips stehen zur Wahl. Noch nicht gekaufte Grips zeigen ihren Preis und können direkt gekauft werden. Vorn liegt an der Spitze, hinten am Schaft.',
            gripFront: 'Vorn', gripMiddle: 'Mitte', gripRear: 'Hinten',
            artworkTitle: 'Eigenes Flight-Motiv', artworkHint: 'PNG, JPG oder WebP (bis 5 MB). Das Bild ersetzt den Flight-Druck und funktioniert auch mit integrierten Systemen.',
            artworkAdd: 'Bild auswählen', artworkChange: 'Bild ändern', artworkRemove: 'Bild entfernen',
            artworkInvalid: 'Bild konnte nicht geladen werden. Wähle eine PNG-, JPG- oder WebP-Datei bis 5 MB.'
        },
        nl: {
            diameterLabel: 'Barreldiameter', resetDiameter: 'Standaard van de vorm',
            title: 'Darts personaliseren', subtitle: 'Stel je eigen set samen. Het uiterlijk verandert de nauwkeurigheid of eigenschappen niet.',
            preview: 'Huidige set', owned: 'Gebruiken', selected: 'Geselecteerd', buy: 'Kopen',
            noFunds: 'Je hebt niet genoeg geld.', confirm: '„{item}” kopen voor £{price}?',
            purchased: 'Gekocht en geselecteerd: {item}.', shaftColor: 'Shaftkleur', flightColor: 'Flightkleur',
            barrelColor: 'Barrelkleur', tipColor: 'Puntkleur', barrelShape: 'Barrelvorm',
            flightShape: 'Flightvorm', barrelPattern: 'Grip op de hele barrel', barrelAccentColor: 'Tweede barrelkleur', barrelAccentStyle: 'Kleurverdeling',
            flightAccentColor: 'Tweede flightkleur', flightPattern: 'Flightopdruk', tipLength: 'Puntlengte',
            tipStyle: 'Puntafwerking', shaftLength: 'Shaftlengte', shaftStyle: 'Shaftmateriaal',
            customColor: 'Eigen kleur', catalogueColor: 'Cataloguskleur herstellen',
            flightSystem: 'Shaft- en flightsysteem', integratedColor: 'Kleur geïntegreerd systeem',
            integratedHint: 'Shaft en flight vormen één onderdeel in dezelfde kleur. Kies de vorm en opdruk onder Flights.',
            barrel: 'Barrel', flights: 'Flights', shaft: 'Shaft', point: 'Punt', tryOn: 'Voorbeeld',
            trying: 'Voorbeeld: {item}', reset: 'Terug naar huidige set', rotate: 'Sleep om te draaien · pijltjestoetsen',
            resetView: 'Weergave herstellen', fallback: '2D-voorbeeld', measurements: 'Punt {tip} mm · barrel {barrel} mm · shaft {shaft} mm · {weight} g',
            weightLabel: 'Dartgewicht', lengthLabel: 'Barrellengte', gripZonesTitle: 'Grip per barrelgedeelte',
            gripZonesHint: 'Negen kleinere delen. Alle grips staan in de lijst. Bij niet-gekochte grips staat de prijs; je kunt ze direct kopen. Voor zit bij de punt, achter bij de shaft.',
            gripFront: 'Voor', gripMiddle: 'Midden', gripRear: 'Achter',
            artworkTitle: 'Eigen flightafbeelding', artworkHint: 'PNG, JPG of WebP (maximaal 5 MB). De afbeelding vervangt de opdruk en werkt ook met geïntegreerde systemen.',
            artworkAdd: 'Afbeelding kiezen', artworkChange: 'Afbeelding wijzigen', artworkRemove: 'Afbeelding verwijderen',
            artworkInvalid: 'Kan de afbeelding niet laden. Kies een PNG-, JPG- of WebP-bestand van maximaal 5 MB.'
        }
    };
    const entryAngleText = {
        pl: ['Kąt wbicia lotek', '0°: poziomo. Wartości ujemne opuszczają tył lotki, dodatnie go unoszą. Dotyczy kolejnych rzutów.'],
        en: ['Dart entry angle', '0°: horizontal. Negative values lower the tail; positive values raise it. Applies to subsequent throws.'],
        de: ['Einschlagwinkel der Darts', '0°: waagerecht. Negative Werte senken das hintere Ende, positive heben es. Gilt für die nächsten Würfe.'],
        nl: ['Insteekhoek van de darts', '0°: horizontaal. Negatieve waarden laten de achterkant zakken; positieve tillen hem op. Geldt voor volgende worpen.']
    };
    // Stable database identities: Van Veen, Ratajski, Barry and Owen.
    // Independent newgens and custom profiles must never inherit a namesake's stance.
    const entryAngleTemplates = new Map([[1, -2], [20, 7], [58, -2], [60, -2]]);
    function entryAngleTranslation(index) {
        return (entryAngleText[typeof currentLang === 'string' ? currentLang : 'pl'] || entryAngleText.pl)[index];
    }
    function getDartEntryAngleForPlayer(candidate) {
        if (Number.isInteger(candidate?.dartEntryAngle) && candidate.dartEntryAngle >= -10 && candidate.dartEntryAngle <= 45)
            return candidate.dartEntryAngle;
        if (!candidate || candidate.isNewgen || candidate.editorCreated || candidate.kind === 'custom') return null;
        if (isCareerPlayer(candidate) && !candidate.sourceName && !Number.isInteger(candidate.defaultTemplateIndex)) return null;
        const index = typeof getLifecycleTemplateIndex === 'function' ? getLifecycleTemplateIndex(candidate)
            : Number.isInteger(candidate.defaultTemplateIndex) ? candidate.defaultTemplateIndex : null;
        return entryAngleTemplates.get(index) ?? null;
    }
    function withDartEntryAngle(loadout, candidate) {
        const angle = getDartEntryAngleForPlayer(candidate);
        return angle === null ? loadout : Object.freeze({ ...loadout, dartEntryAngle: angle });
    }
    function dartEntryAnglePreview(angle) {
        const safe = Number.isInteger(Number(angle)) && Number(angle) >= -10 && Number(angle) <= 45 ? Number(angle) : 20;
        return `<svg viewBox="0 0 220 120" aria-hidden="true" focusable="false">
            <path d="M25 10v100" stroke="#a8bacb" stroke-width="10"/><path d="M25 65v20" stroke="#cf3448" stroke-width="10"/>
            <path d="M30 75h180" stroke="#a8bacb" stroke-dasharray="4 4" opacity=".45"/>
            <g transform="translate(30 75) rotate(${-safe})"><path d="M-5 0h35" stroke="#dce5ea" stroke-width="3"/>
            <rect x="30" y="-5" width="55" height="10" rx="4" fill="#c1a35f"/>
            <path d="M85 0h40" stroke="#becddd" stroke-width="5"/>
            <path d="M125 0l17-14h26v28h-26z" fill="#58b995" stroke="#e3f5ee"/></g></svg>`;
    }
    function updateDartEntryAngleControl(control) {
        if (!control) return;
        const field = control.closest('.dart-entry-angle');
        if (!field) return;
        field.querySelector('output').textContent = `${Number(control.value)}°`;
        field.querySelector('[data-entry-angle-preview]').innerHTML = dartEntryAnglePreview(control.value);
    }
    function setDartEntryAngle(value) {
        const angle = Number(value);
        if (typeof player === 'undefined' || !player || !Number.isInteger(angle) || angle < -10 || angle > 45) return false;
        player.dartEntryAngle = angle;
        notifyChange('dartEntryAngle');
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    const item = (id, price, color, names) => Object.freeze({ id, price, color, names: Object.freeze(names) });
    const catalogue = Object.freeze({
        shaftColor: Object.freeze([
            item('graphite', 0, '#263640', ['Grafitowy', 'Graphite', 'Graphit', 'Grafiet']),
            item('crimson', 220, '#b71932', ['Karmazynowy', 'Crimson', 'Karminrot', 'Karmozijn']),
            item('royal-blue', 220, '#1769aa', ['Królewski błękit', 'Royal blue', 'Königsblau', 'Koningsblauw']),
            item('ivory', 280, '#e8e3d7', ['Kość słoniowa', 'Ivory', 'Elfenbein', 'Ivoor']),
            item('emerald', 320, '#087f5b', ['Szmaragdowy', 'Emerald', 'Smaragd', 'Smaragd']),
            item('violet', 360, '#6930a8', ['Fioletowy', 'Violet', 'Violett', 'Violet']),
            item('gold', 650, '#c99516', ['Złoty', 'Gold', 'Gold', 'Goud']),
            item('neon-yellow', 260, '#efd82b', ['Neonowy żółty', 'Neon yellow', 'Neongelb', 'Neongeel']),
            item('teal', 280, '#16a9a3', ['Turkusowy', 'Teal', 'Türkis', 'Turkoois'])
        ]),
        flightColor: Object.freeze([
            item('career-gold', 0, '#f1c40f', ['Career Gold', 'Career Gold', 'Career Gold', 'Career Gold']),
            item('signal-red', 180, '#d71936', ['Czerwień sygnałowa', 'Signal red', 'Signalrot', 'Signaalrood']),
            item('ice-blue', 180, '#28a9e0', ['Lodowy błękit', 'Ice blue', 'Eisblau', 'IJsblauw']),
            item('snow', 200, '#f4f6f7', ['Śnieżny', 'Snow', 'Schneeweiß', 'Sneeuwwit']),
            item('lime', 260, '#75c900', ['Limonkowy', 'Lime', 'Limette', 'Limoen']),
            item('hot-pink', 300, '#e84393', ['Różowy', 'Hot pink', 'Pink', 'Felroze']),
            item('blackout', 340, '#15181d', ['Blackout', 'Blackout', 'Blackout', 'Blackout']),
            item('amber', 380, '#ff8f00', ['Bursztynowy', 'Amber', 'Bernstein', 'Amber']),
            item('navy', 280, '#172958', ['Granatowy', 'Navy', 'Marineblau', 'Marineblauw']),
            item('teal', 280, '#169e9a', ['Turkusowy', 'Teal', 'Türkis', 'Turkoois']),
            item('violet', 300, '#603e91', ['Fioletowy', 'Violet', 'Violett', 'Violet'])
        ]),
        barrelColor: Object.freeze([
            item('tungsten', 0, '#c7cdd1', ['Wolfram', 'Tungsten', 'Wolfram', 'Wolfraam']),
            item('black-titanium', 480, '#333a40', ['Czarny tytan', 'Black titanium', 'Schwarztitan', 'Zwart titanium']),
            item('rose-copper', 520, '#b66d55', ['Różowa miedź', 'Rose copper', 'Rosékupfer', 'Rosékoper']),
            item('champagne', 620, '#c7a54b', ['Szampański', 'Champagne', 'Champagner', 'Champagne']),
            item('electric-blue', 700, '#2367c9', ['Elektryczny błękit', 'Electric blue', 'Elektroblau', 'Elektrisch blauw'])
        ]),
        tipColor: Object.freeze([
            item('steel', 0, '#d9e0e4', ['Stalowy', 'Steel', 'Stahl', 'Staal']),
            item('black', 160, '#262a2e', ['Czarny', 'Black', 'Schwarz', 'Zwart']),
            item('gold-point', 340, '#caa234', ['Złoty', 'Gold', 'Gold', 'Goud']),
            item('copper-point', 300, '#a96643', ['Miedziany', 'Copper', 'Kupfer', 'Koper'])
        ]),
        barrelShape: Object.freeze([
            item('straight', 0, null, ['Prosty', 'Straight', 'Gerade', 'Recht']),
            item('torpedo', 680, null, ['Torpedo', 'Torpedo', 'Torpedo', 'Torpedo']),
            item('scallop', 820, null, ['Scallop — wcięcie', 'Scallop', 'Scallop', 'Scallop']),
            item('bomb', 740, null, ['Bomb — pękaty', 'Bomb', 'Bomb', 'Bomb']),
            item('tapered', 700, null, ['Zwężany', 'Tapered', 'Konisch', 'Taps'])
        ]),
        flightShape: Object.freeze([
            item('standard', 0, null, ['Standard', 'Standard', 'Standard', 'Standaard']),
            item('kite', 340, null, ['Kite', 'Kite', 'Kite', 'Kite']),
            item('pear', 420, null, ['Gruszka', 'Pear', 'Birne', 'Peer']),
            item('slim', 360, null, ['Slim — wąskie', 'Slim', 'Slim', 'Slim']),
            item('no6', 380, null, ['No. 6 — kompaktowe', 'No. 6 — compact', 'No. 6 — kompakt', 'No. 6 — compact']),
            item('shield', 420, null, ['Tarcza', 'Shield', 'Schild', 'Schild']),
            item('delta', 380, null, ['Delta', 'Delta', 'Delta', 'Delta']),
            item('fan', 460, null, ['Wachlarz', 'Fan', 'Fächer', 'Waaier'])
        ]),
        barrelPattern: Object.freeze([
            item('rings', 0, null, ['Klasyczne ringi', 'Classic rings', 'Klassische Ringe', 'Klassieke ringen']),
            item('micro', 460, null, ['Micro grip', 'Micro grip', 'Micro-Grip', 'Microgrip']),
            item('shark', 580, null, ['Shark grip', 'Shark grip', 'Shark-Grip', 'Sharkgrip']),
            item('smooth', 0, null, ['Gładki', 'Smooth', 'Glatt', 'Glad']),
            item('knurled', 640, null, ['Radełkowany — diament', 'Diamond knurl', 'Diamanträndelung', 'Diamantkarteling']),
            item('pixel', 740, null, ['Pixel — frezowana siatka', 'Pixel cuts', 'Pixel-Grip', 'Pixelgrip']),
            item('axial', 680, null, ['Nacięcia wzdłużne', 'Axial cuts', 'Längsrillen', 'Lengtegroeven']),
            item('hybrid', 860, null, ['Hybrydowy — ringi i diament', 'Hybrid — rings & knurl', 'Hybrid — Ringe & Rändelung', 'Hybride — ringen & karteling']),
            item('double-rings', 480, null, ['Podwójne ringi', 'Double rings', 'Doppelringe', 'Dubbele ringen']),
            item('razor', 540, null, ['Razor — ostre nacięcia', 'Razor cuts', 'Razor-Schnitte', 'Razor-groeven']),
            item('wave', 500, null, ['Falowany', 'Wave grip', 'Wellengriff', 'Golfgrip']),
            item('cross-cut', 640, null, ['Krzyżowe nacięcia', 'Cross-cut', 'Kreuzschnitt', 'Kruisgroeven']),
            item('spiral', 700, null, ['Spiralny', 'Spiral grip', 'Spiralgriff', 'Spiraalgrip']),
            item('scalloped-rings', 620, null, ['Zaokrąglone ringi', 'Scalloped rings', 'Gerundete Ringe', 'Afgeronde ringen'])
        ]),
        barrelAccentColor: Object.freeze([
            item('graphite', 0, '#263640', ['Grafitowy', 'Graphite', 'Graphit', 'Grafiet']),
            item('silver', 240, '#ced5db', ['Srebrny', 'Silver', 'Silber', 'Zilver']),
            item('gold', 380, '#c7a54b', ['Złoty', 'Gold', 'Gold', 'Goud']),
            item('copper', 320, '#b66d55', ['Miedziany', 'Copper', 'Kupfer', 'Koper']),
            item('blue', 280, '#2367c9', ['Niebieski', 'Blue', 'Blau', 'Blauw']),
            item('red', 280, '#b71932', ['Czerwony', 'Red', 'Rot', 'Rood']),
            item('teal', 280, '#169e9a', ['Turkusowy', 'Teal', 'Türkis', 'Turkoois'])
        ]),
        barrelAccentStyle: Object.freeze([
            item('grooves', 0, null, ['W nacięciach gripu', 'Inside grip cuts', 'In den Grip-Rillen', 'In de gripgroeven']),
            item('bands', 300, null, ['Dwie strefy koloru', 'Twin colour bands', 'Zwei Farbzonen', 'Twee kleurzones']),
            item('split', 420, null, ['Dwie połówki', 'Two-tone split', 'Zweifarbig geteilt', 'Tweekleurig verdeeld'])
        ]),
        flightAccentColor: Object.freeze([
            item('graphite', 0, '#15181d', ['Grafitowy', 'Graphite', 'Graphit', 'Grafiet']),
            item('white', 160, '#f4f6f7', ['Biały', 'White', 'Weiß', 'Wit']),
            item('gold', 220, '#efd82b', ['Złoty', 'Gold', 'Gold', 'Goud']),
            item('red', 180, '#d71936', ['Czerwony', 'Red', 'Rot', 'Rood']),
            item('blue', 180, '#28a9e0', ['Błękitny', 'Blue', 'Blau', 'Blauw']),
            item('violet', 200, '#8053bb', ['Fioletowy', 'Violet', 'Violett', 'Violet'])
        ]),
        flightPattern: Object.freeze([
            item('stripe', 0, null, ['Ukośny pas', 'Diagonal stripe', 'Diagonalstreifen', 'Diagonale streep']),
            item('solid', 0, null, ['Jednolite', 'Solid', 'Einfarbig', 'Effen']),
            item('chevron', 240, null, ['Chevron', 'Chevron', 'Chevron', 'Chevron']),
            item('split', 220, null, ['Dwa kolory', 'Split colour', 'Zweifarbig', 'Tweekleurig']),
            item('hex', 340, null, ['Plaster miodu', 'Honeycomb', 'Waben', 'Honingraat']),
            item('lightning', 280, null, ['Błyskawice', 'Lightning', 'Blitze', 'Bliksem']),
            item('checker', 240, null, ['Szachownica', 'Checkerboard', 'Schachbrett', 'Schaakbord']),
            item('sunburst', 320, null, ['Promienie', 'Sunburst', 'Strahlen', 'Zonnestralen']),
            item('circuit', 360, null, ['Obwody', 'Circuit', 'Leiterbahnen', 'Printplaat']),
            item('contour', 300, null, ['Kontury', 'Contour', 'Konturen', 'Contouren']),
            item('crown', 380, null, ['Korona', 'Crown', 'Krone', 'Kroon']),
            item('target', 300, null, ['Tarcza', 'Target', 'Zielscheibe', 'Doelwit']),
            item('dots', 220, null, ['Kropki', 'Dots', 'Punkte', 'Stippen']),
            item('flames', 340, null, ['Płomienie', 'Flames', 'Flammen', 'Vlammen']),
            item('waves', 280, null, ['Fale', 'Waves', 'Wellen', 'Golven']),
            item('tartan', 360, null, ['Kratka tartan', 'Tartan', 'Tartan', 'Schotse ruit']),
            item('arrows', 300, null, ['Strzałki', 'Arrows', 'Pfeile', 'Pijlen']),
            item('stars', 320, null, ['Gwiazdy', 'Stars', 'Sterne', 'Sterren']),
            item('camo', 380, null, ['Kamuflaż', 'Camo', 'Tarnmuster', 'Camouflage'])
        ]),
        tipLength: Object.freeze([
            item('26', 180, null, ['26 mm', '26 mm', '26 mm', '26 mm']),
            item('30', 0, null, ['30 mm', '30 mm', '30 mm', '30 mm']),
            item('35', 220, null, ['35 mm', '35 mm', '35 mm', '35 mm']),
            item('40', 240, null, ['40 mm', '40 mm', '40 mm', '40 mm']),
            item('50', 320, null, ['50 mm', '50 mm', '50 mm', '50 mm'])
        ]),
        tipStyle: Object.freeze([
            item('smooth', 0, null, ['Gładki', 'Smooth', 'Glatt', 'Glad']),
            item('ringed', 220, null, ['Ring grip', 'Ring grip', 'Ring-Grip', 'Ringgrip']),
            item('etched', 280, null, ['Micro grip', 'Micro grip', 'Micro-Grip', 'Microgrip']),
            item('ringed-front', 240, null, ['Ringi z przodu', 'Front ring grip', 'Ring-Grip vorne', 'Ringgrip vooraan']),
            item('ringed-rear', 260, null, ['Ringi przy barrelu', 'Rear ring grip', 'Ring-Grip am Barrel', 'Ringgrip bij de barrel']),
            item('spiral', 360, null, ['Spiralny', 'Spiral grip', 'Spiral-Grip', 'Spiraalgrip']),
            item('diamond', 380, null, ['Diamentowy', 'Diamond grip', 'Diamant-Grip', 'Diamantgrip']),
            item('fluted', 340, null, ['Podłużne nacięcia', 'Fluted', 'Längsrillen', 'Lengtegroeven']),
            item('dual-grip', 420, null, ['Podwójny grip', 'Dual grip', 'Doppel-Grip', 'Dubbele grip']),
            item('tapered', 300, null, ['Wydłużone przejście', 'Extended taper', 'Langer Übergang', 'Verlengde overgang'])
        ]),
        shaftLength: Object.freeze([
            item('35', 0, null, ['35 mm — intermediate', '35 mm — intermediate', '35 mm — intermediate', '35 mm — intermediate']),
            item('28', 200, null, ['28 mm — krótki', '28 mm — short', '28 mm — kurz', '28 mm — kort']),
            item('41', 240, null, ['41 mm — długi', '41 mm — long', '41 mm — lang', '41 mm — lang']),
            item('50', 280, null, ['50 mm', '50 mm', '50 mm', '50 mm']),
            item('55', 300, null, ['55 mm', '55 mm', '55 mm', '55 mm']),
            item('65', 320, null, ['65 mm — bardzo długi', '65 mm — extra long', '65 mm — extra lang', '65 mm — extra lang'])
        ]),
        shaftStyle: Object.freeze([
            item('nylon', 0, null, ['Nylon', 'Nylon', 'Nylon', 'Nylon']),
            item('aluminium', 360, null, ['Aluminium', 'Aluminium', 'Aluminium', 'Aluminium']),
            item('carbon', 520, null, ['Włókno węglowe', 'Carbon fibre', 'Carbonfaser', 'Koolstofvezel'])
        ]),
        flightSystem: Object.freeze([
            item('separate', 0, null, ['Osobny shaft i piórko', 'Separate shaft and flight', 'Schaft und Flight getrennt', 'Losse shaft en flight']),
            item('integrated-solid', 650, null, ['Zintegrowany — nieprzezroczysty', 'Integrated — opaque', 'Integriert — undurchsichtig', 'Geïntegreerd — ondoorzichtig']),
            item('integrated-clear', 750, null, ['Zintegrowany — przezroczysty', 'Integrated — transparent', 'Integriert — transparent', 'Geïntegreerd — transparant']),
            item('integrated-ribbed', 850, null, ['Zintegrowany — żebrowany', 'Integrated — ribbed', 'Integriert — gerippt', 'Geïntegreerd — geribbeld']),
            item('integrated-frosted', 800, null, ['Zintegrowany — matowy', 'Integrated — frosted', 'Integriert — matt', 'Geïntegreerd — mat'])
        ]),
        integratedColor: Object.freeze([
            item('white', 0, '#f4f6f7', ['Biały / bezbarwny', 'White / clear', 'Weiß / farblos', 'Wit / kleurloos']),
            item('violet', 260, '#713cc4', ['Fioletowy', 'Violet', 'Violett', 'Violet']),
            item('royal-blue', 220, '#1556db', ['Królewski błękit', 'Royal blue', 'Königsblau', 'Koningsblauw']),
            item('teal', 220, '#14a6a0', ['Turkusowy', 'Teal', 'Türkis', 'Turkoois']),
            item('neon-yellow', 260, '#c8f51a', ['Neonowy żółty', 'Neon yellow', 'Neongelb', 'Neongeel']),
            item('black', 220, '#242935', ['Czarny / dymiony', 'Black / smoke', 'Schwarz / Rauch', 'Zwart / rook']),
            item('red', 220, '#dc2547', ['Czerwony', 'Red', 'Rot', 'Rood']),
            item('orange', 240, '#ff8b24', ['Pomarańczowy', 'Orange', 'Orange', 'Oranje'])
        ])
    });
    const categoryKeys = Object.freeze(Object.keys(catalogue));
    const customColorFields = Object.freeze(['barrelColor', 'barrelAccentColor', 'shaftColor', 'tipColor',
        'flightColor', 'flightAccentColor', 'integratedColor']);
    const validCustomColor = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
    const defaults = Object.freeze({ ...Object.fromEntries(categoryKeys.map(key => [key, catalogue[key][0].id])), tipLength: '30' });
    const parts = Object.freeze({ barrel: ['barrelShape', 'barrelPattern', 'barrelColor', 'barrelAccentColor', 'barrelAccentStyle'],
        flights: ['flightShape', 'flightColor', 'flightAccentColor', 'flightPattern'],
        shaft: ['flightSystem', 'shaftLength', 'integratedColor', 'shaftStyle', 'shaftColor'], point: ['tipLength', 'tipStyle', 'tipColor'] });
    let activePart = 'barrel';
    let previewSelection = null;

    const kitSlotText = {
        pl: { title: 'Twoje zestawy', hint: '3 wolne sloty na własne zestawy. Zapisujesz założone elementy, wraz z gripem, wymiarami, kolorami i grafiką piórek. Przymierzane elementy nie są zapisywane.',
            slot: 'Slot {number}', empty: 'Pusty slot', name: 'Własna nazwa (opcjonalnie)', save: 'Zapisz zestaw', load: 'Wczytaj', rename: 'Zmień nazwę', clear: 'Wyczyść',
            saved: 'Ostatni zapis: {date}', overwrite: 'Zastąpić zestaw w slocie „{name}” aktualnie założonymi lotkami?', remove: 'Wyczyścić slot „{name}”? Założone lotki pozostaną bez zmian.',
            done: 'Zapisano zestaw w slocie {number}.', loaded: 'Wczytano zestaw ze slotu {number}.', renamed: 'Zmieniono nazwę slotu {number}.', cleared: 'Wyczyszczono slot {number}.',
            unavailable: 'Nie można wczytać tego zestawu: brakuje zakupionych elementów lub zapis jest nieprawidłowy.', saveFailed: 'Zmiana pozostaje w bieżącej grze, ale zapis w przeglądarce się nie powiódł. Wyeksportuj karierę do JSON, aby ją zachować.' },
        en: { title: 'Your dart sets', hint: '3 free slots for your own sets. Save equipped parts, including grip, dimensions, colours and flight artwork. Items being tried on are not saved.',
            slot: 'Slot {number}', empty: 'Empty slot', name: 'Custom name (optional)', save: 'Save set', load: 'Load', rename: 'Rename', clear: 'Clear',
            saved: 'Last saved: {date}', overwrite: 'Replace the set in “{name}” with your currently equipped darts?', remove: 'Clear “{name}”? Your equipped darts will stay unchanged.',
            done: 'Set saved in slot {number}.', loaded: 'Set loaded from slot {number}.', renamed: 'Slot {number} renamed.', cleared: 'Slot {number} cleared.',
            unavailable: 'This set cannot be loaded: purchased parts are missing or the saved set is invalid.', saveFailed: 'The change remains in your current game, but browser saving failed. Export your career to JSON to preserve it.' },
        de: { title: 'Deine Dartsets', hint: '3 freie Plätze für eigene Sets. Gespeichert werden ausgerüstete Teile mit Grip, Maßen, Farben und Flight-Motiv. Vorschauartikel werden nicht gespeichert.',
            slot: 'Platz {number}', empty: 'Leerer Platz', name: 'Eigener Name (optional)', save: 'Set speichern', load: 'Laden', rename: 'Umbenennen', clear: 'Leeren',
            saved: 'Zuletzt gespeichert: {date}', overwrite: 'Das Set in „{name}“ durch deine aktuell ausgerüsteten Darts ersetzen?', remove: '„{name}“ leeren? Deine ausgerüsteten Darts bleiben unverändert.',
            done: 'Set auf Platz {number} gespeichert.', loaded: 'Set von Platz {number} geladen.', renamed: 'Platz {number} umbenannt.', cleared: 'Platz {number} geleert.',
            unavailable: 'Dieses Set kann nicht geladen werden: Gekaufte Teile fehlen oder das Set ist ungültig.', saveFailed: 'Die Änderung bleibt im aktuellen Spiel, konnte aber nicht im Browser gespeichert werden. Exportiere deine Karriere als JSON.' },
        nl: { title: 'Jouw dartsets', hint: '3 vrije slots voor eigen sets. Bewaar gebruikte onderdelen met grip, afmetingen, kleuren en flightafbeelding. Onderdelen in de voorbeeldweergave worden niet opgeslagen.',
            slot: 'Slot {number}', empty: 'Leeg slot', name: 'Eigen naam (optioneel)', save: 'Set opslaan', load: 'Laden', rename: 'Hernoemen', clear: 'Wissen',
            saved: 'Laatst opgeslagen: {date}', overwrite: 'De set in “{name}” vervangen door je huidige darts?', remove: '“{name}” wissen? Je huidige darts blijven ongewijzigd.',
            done: 'Set opgeslagen in slot {number}.', loaded: 'Set uit slot {number} geladen.', renamed: 'Slot {number} hernoemd.', cleared: 'Slot {number} gewist.',
            unavailable: 'Deze set kan niet worden geladen: gekochte onderdelen ontbreken of de opslag is ongeldig.', saveFailed: 'De wijziging blijft in je huidige spel, maar opslaan in de browser is mislukt. Exporteer je carrière naar JSON om deze te bewaren.' }
    };
    let kitSlotNotice = null;
    const validKitSlotIndex = index => Number.isInteger(index) && index >= 0 && index < 3;
    const copyKitSelection = selected => ({ ...selected, gripZones: { ...selected.gripZones },
        gripSections: [...selected.gripSections], gripRegions: selected.gripRegions?.map(region => ({ ...region })) ?? null });
    function trKitSlot(key, values = {}) {
        const lang = typeof currentLang === 'string' && kitSlotText[currentLang] ? currentLang : 'pl';
        return kitSlotText[lang][key].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
    }
    function normalizeDartKitConfiguration(raw) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
        const selected = raw.selected;
        if (!selected || typeof selected !== 'object' || Array.isArray(selected)
            || categoryKeys.some(key => !catalogue[key].some(item => item.id === selected[key]))
            || !Number.isInteger(selected.weightGrams) || selected.weightGrams < 12 || selected.weightGrams > 40
            || !Number.isInteger(selected.barrelLength) || selected.barrelLength < 35 || selected.barrelLength > 55
            || selected.barrelDiameter !== root.dartModel.normalizeBarrelDiameter(selected.barrelDiameter)
            || !isDartOptionCompatible('shaftLength', selected.shaftLength, selected)) return null;
        const validGrip = id => catalogue.barrelPattern.some(item => item.id === id);
        if (!selected.gripZones || ['front', 'middle', 'rear'].some(zone => !validGrip(selected.gripZones[zone]))
            || !Array.isArray(selected.gripSections) || selected.gripSections.length !== 9 || !selected.gripSections.every(validGrip)
            || !root.dartModel.validGripRegions(selected.gripRegions, selected.barrelLength)) return null;
        if (raw.flightArtwork !== null && !root.dartModel.validFlightArtwork(raw.flightArtwork)) return null;
        if (raw.dartEntryAngle !== null && (!Number.isInteger(raw.dartEntryAngle) || raw.dartEntryAngle < -10 || raw.dartEntryAngle > 45)) return null;
        const customColors = {};
        for (const key of customColorFields) {
            if (Object.hasOwn(raw.customColors || {}, key)) {
                if (!validCustomColor(raw.customColors[key])) return null;
                customColors[key] = raw.customColors[key].toLowerCase();
            }
        }
        const clean = Object.fromEntries(categoryKeys.map(key => [key, selected[key]]));
        Object.assign(clean, { weightGrams: selected.weightGrams, barrelLength: selected.barrelLength,
            barrelDiameter: selected.barrelDiameter, gripZones: Object.fromEntries(['front', 'middle', 'rear'].map(zone => [zone, selected.gripZones[zone]])),
            gripSections: [...selected.gripSections], gripRegions: root.dartModel.normalizeGripRegions(selected.gripRegions, selected.barrelLength) });
        return { selected: clean, customColors, flightArtwork: raw.flightArtwork,
            flightArtworkName: raw.flightArtwork ? String(raw.flightArtworkName || '').slice(0, 60) : '', dartEntryAngle: raw.dartEntryAngle };
    }
    function normalizeDartKitSlots(candidate) {
        if (!candidate || typeof candidate !== 'object') return [null, null, null];
        const previous = Array.isArray(candidate.dartKitSlots) ? candidate.dartKitSlots : [];
        candidate.dartKitSlots = Array.from({ length: 3 }, (_, index) => {
            const slot = previous[index];
            const configuration = slot?.version === 1 ? normalizeDartKitConfiguration(slot.configuration) : null;
            return configuration ? { version: 1, name: typeof slot.name === 'string' ? slot.name.trim().slice(0, 40) : '',
                savedAt: Number.isFinite(slot.savedAt) && slot.savedAt > 0 && slot.savedAt <= 8640000000000000 ? slot.savedAt : 0, configuration } : null;
        });
        return candidate.dartKitSlots;
    }
    function kitSlotChangeAllowed(index) {
        return validKitSlotIndex(index) && typeof player !== 'undefined' && !!player?.name
            && !(typeof isCareerSlotOperationBusy === 'function' && isCareerSlotOperationBusy())
            && !(typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy());
    }
    function kitSlotLabel(slot, index) { return slot?.name || trKitSlot('slot', { number: index + 1 }); }
    function updateKitSlotNotice(key, index, owner = player) {
        if (typeof player === 'undefined' || player !== owner) return;
        kitSlotNotice = { owner, key, number: index + 1 };
        const status = typeof document !== 'undefined' && document.getElementById('dart-kit-slot-status');
        if (status) status.textContent = trKitSlot(key, { number: index + 1 });
    }
    function saveKitSlotChange(key, index) {
        const owner = player;
        const finish = success => updateKitSlotNotice(success === false ? 'saveFailed' : key, index, owner);
        if (typeof saveGame !== 'function') { finish(true); return; }
        try { Promise.resolve(saveGame(true)).then(finish, () => finish(false)); }
        catch (_) { finish(false); }
    }
    function refreshKitSlotPanel() {
        if (typeof document === 'undefined') return;
        const panel = document.getElementById('dart-kit-slots');
        if (panel) panel.outerHTML = dartKitSlotsMarkup();
    }
    function saveDartKitSlot(index, name) {
        if (!kitSlotChangeAllowed(index)) return false;
        const slots = normalizeDartKitSlots(player), old = slots[index];
        if (old && typeof confirm === 'function' && !confirm(trKitSlot('overwrite', { name: kitSlotLabel(old, index) }))) return false;
        const state = normalizeDartCustomization(player), selected = copyKitSelection(state.selected);
        // A system change may leave an incompatible, inactive shaft length in the editor.
        selected.shaftLength = isDartOptionCompatible('shaftLength', selected.shaftLength, selected) ? selected.shaftLength : defaults.shaftLength;
        const configuration = normalizeDartKitConfiguration({ selected, customColors: { ...state.customColors }, flightArtwork: state.flightArtwork,
            flightArtworkName: state.flightArtworkName, dartEntryAngle: getDartEntryAngleForPlayer(player) });
        if (!configuration) return false;
        slots[index] = { version: 1, name: typeof name === 'string' ? name.trim().slice(0, 40) : old?.name || '', savedAt: Date.now(), configuration };
        kitSlotNotice = null; refreshKitSlotPanel(); saveKitSlotChange('done', index); return true;
    }
    function loadDartKitSlot(index) {
        if (!kitSlotChangeAllowed(index)) return false;
        const slot = normalizeDartKitSlots(player)[index];
        if (!slot) return false;
        const state = normalizeDartCustomization(player), config = slot.configuration;
        const grips = [...Object.values(config.selected.gripZones), ...config.selected.gripSections,
            ...(config.selected.gripRegions || []).map(region => region.pattern)];
        if (categoryKeys.some(key => !state.owned[key].includes(config.selected[key])) || grips.some(id => !state.owned.barrelPattern.includes(id))) {
            updateKitSlotNotice('unavailable', index); return false;
        }
        state.selected = copyKitSelection(config.selected); state.customColors = { ...config.customColors };
        state.flightArtwork = config.flightArtwork; state.flightArtworkName = config.flightArtworkName;
        if (config.dartEntryAngle === null) delete player.dartEntryAngle; else player.dartEntryAngle = config.dartEntryAngle;
        previewSelection = null; kitSlotNotice = null; notifyChange();
        if (typeof showShopScreen === 'function') showShopScreen(); else refreshPreview();
        refreshKitSlotPanel(); saveKitSlotChange('loaded', index); return true;
    }
    function renameDartKitSlot(index, name) {
        if (!kitSlotChangeAllowed(index) || typeof name !== 'string') return false;
        const slot = normalizeDartKitSlots(player)[index]; if (!slot) return false;
        slot.name = name.trim().slice(0, 40); kitSlotNotice = null; refreshKitSlotPanel(); saveKitSlotChange('renamed', index); return true;
    }
    function clearDartKitSlot(index) {
        if (!kitSlotChangeAllowed(index)) return false;
        const slots = normalizeDartKitSlots(player), slot = slots[index]; if (!slot) return false;
        if (typeof confirm === 'function' && !confirm(trKitSlot('remove', { name: kitSlotLabel(slot, index) }))) return false;
        slots[index] = null; kitSlotNotice = null; refreshKitSlotPanel(); saveKitSlotChange('cleared', index); return true;
    }
    function dartKitSlotsMarkup() {
        const slots = normalizeDartKitSlots(player), locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[currentLang] || 'pl-PL';
        return `<section id="dart-kit-slots" class="dart-kit-slots"><h5>${escapeHtml(trKitSlot('title'))}</h5><p>${escapeHtml(trKitSlot('hint'))}</p>
            <div class="dart-kit-slot-list">${slots.map((slot, index) => `<article class="dart-kit-slot" data-dart-kit-slot="${index}">
                <h6>${escapeHtml(trKitSlot('slot', { number: index + 1 }))}</h6><p>${escapeHtml(slot ? trKitSlot('saved', { date: slot.savedAt ? new Date(slot.savedAt).toLocaleString(locale) : '—' }) : trKitSlot('empty'))}</p>
                ${slot ? dartKitThumbnailMarkup(slot.configuration, index) : '<div class="dart-kit-slot-empty" aria-hidden="true">—</div>'}
                <label for="dart-kit-name-${index}">${escapeHtml(trKitSlot('name'))}</label><input id="dart-kit-name-${index}" type="text" maxlength="40" value="${escapeHtml(slot?.name || '')}" autocomplete="off"/>
                <div class="dart-kit-slot-actions"><button type="button" data-kit-save="${index}" onclick="saveDartKitSlot(${index},document.getElementById('dart-kit-name-${index}').value)">${escapeHtml(trKitSlot('save'))}</button>
                <button type="button" data-kit-load="${index}" onclick="loadDartKitSlot(${index})" ${slot ? '' : 'disabled'}>${escapeHtml(trKitSlot('load'))}</button>
                <button type="button" data-kit-rename="${index}" onclick="renameDartKitSlot(${index},document.getElementById('dart-kit-name-${index}').value)" ${slot ? '' : 'disabled'}>${escapeHtml(trKitSlot('rename'))}</button>
                <button type="button" data-kit-clear="${index}" onclick="clearDartKitSlot(${index})" ${slot ? '' : 'disabled'}>${escapeHtml(trKitSlot('clear'))}</button></div></article>`).join('')}</div>
            <p id="dart-kit-slot-status" role="status" aria-live="polite">${escapeHtml(kitSlotNotice?.owner === player ? trKitSlot(kitSlotNotice.key, kitSlotNotice) : '')}</p></section>`;
    }

    function dartKitThumbnailMarkup(configuration, index) {
        const owner = { dartCustomization: configuration };
        const loadout = buildLoadout(configuration.selected, 'career', owner), dimensions = root.dartModel.dimensions(root.dartModel.normalize(loadout));
        const measurements = tr('measurements').replace('{tip}', loadout.tipLength).replace('{barrel}', loadout.barrelLength)
            .replace('{shaft}', loadout.shaftLength).replace('{weight}', loadout.weightGrams) + ` · Ø ${(dimensions.barrelRadius * 2).toFixed(1)} mm`;
        return `<div class="dart-kit-slot-preview" data-kit-preview="${index}">${previewMarkup(loadout, `kit-slot-${index}`)}</div>
            <p class="dart-kit-slot-dimensions" data-kit-dimensions="${index}">${escapeHtml(measurements)}</p>`;
    }

    function languageIndex() {
        return { pl: 0, en: 1, de: 2, nl: 3 }[typeof currentLang === 'string' ? currentLang : 'pl'] ?? 0;
    }
    function tr(key) {
        const lang = typeof currentLang === 'string' && text[currentLang] ? currentLang : 'pl';
        return text[lang][key] || text.pl[key] || key;
    }
    function nameOf(entry) { return entry.names[languageIndex()] || entry.names[0]; }
    function findItem(category, id) { return catalogue[category]?.find(entry => entry.id === id)
        || catalogue[category]?.find(entry => entry.id === defaults[category]); }
    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
    }

    function normalizeDartCustomization(candidate) {
        if (!candidate || typeof candidate !== 'object') return null;
        const previous = candidate.dartCustomization && typeof candidate.dartCustomization === 'object'
            ? candidate.dartCustomization : {};
        const selected = previous.selected && typeof previous.selected === 'object' ? previous.selected : {};
        const owned = previous.owned && typeof previous.owned === 'object' ? previous.owned : {};
        const artwork = typeof root.dartModel?.validFlightArtwork === 'function' && root.dartModel.validFlightArtwork(previous.flightArtwork)
            ? previous.flightArtwork : null;
        const customColors = previous.customColors && typeof previous.customColors === 'object' && !Array.isArray(previous.customColors)
            ? previous.customColors : {};
        const normalized = { version: 8, selected: {}, owned: {}, customColors: {}, flightArtwork: artwork,
            flightArtworkName: artwork ? String(previous.flightArtworkName || '').slice(0, 60) : '' };
        customColorFields.forEach(field => {
            if (Object.hasOwn(customColors, field) && validCustomColor(customColors[field]))
                normalized.customColors[field] = customColors[field].toLowerCase();
        });
        categoryKeys.forEach(category => {
            const validIds = new Set(catalogue[category].map(entry => entry.id));
            const migrate = id => category === 'tipLength' ? ({ '32': '30', '38': '40', '45': '50' }[id] || id) : id;
            const collection = Array.isArray(owned[category]) ? owned[category].map(migrate).filter(id => validIds.has(id)) : [];
            normalized.owned[category] = [...new Set([...catalogue[category].filter(entry => entry.price === 0).map(entry => entry.id), ...collection])];
            const migratedChoice = migrate(selected[category]);
            const choice = validIds.has(migratedChoice) && normalized.owned[category].includes(migratedChoice)
                ? migratedChoice : defaults[category];
            normalized.selected[category] = choice;
        });
        const savedZones = selected.gripZones && typeof selected.gripZones === 'object' ? selected.gripZones : {};
        normalized.selected.gripZones = Object.fromEntries(['front', 'middle', 'rear'].map(zone => [zone,
            normalized.owned.barrelPattern.includes(savedZones[zone]) ? savedZones[zone] : normalized.selected.barrelPattern]));
        const savedSections = Array.isArray(selected.gripSections) && selected.gripSections.length === 9
            ? selected.gripSections : [];
        normalized.selected.gripSections = Array.from({ length: 9 }, (_, index) =>
            normalized.owned.barrelPattern.includes(savedSections[index]) ? savedSections[index]
                : normalized.selected.gripZones[['front', 'middle', 'rear'][Math.floor(index / 3)]]);
        const weight = Number(selected.weightGrams), length = Number(selected.barrelLength);
        normalized.selected.weightGrams = Number.isInteger(weight) && weight >= 12 && weight <= 40 ? weight : 23;
        normalized.selected.barrelLength = Number.isInteger(length) && length >= 35 && length <= 55 ? length : 50;
        normalized.selected.barrelDiameter = root.dartModel.normalizeBarrelDiameter(selected.barrelDiameter);
        normalized.selected.gripRegions = root.dartModel.normalizeGripRegions(selected.gripRegions,normalized.selected.barrelLength);
        if (normalized.selected.gripRegions) normalized.selected.gripRegions = normalized.selected.gripRegions
            .filter(region => normalized.owned.barrelPattern.includes(region.pattern));
        candidate.dartCustomization = normalized;
        return normalized;
    }

    function hashIdentity(candidate) {
        const identity = [candidate?.id, candidate?.sourceName, candidate?.name, candidate?.country, candidate?.birthYear]
            .filter(value => value !== undefined && value !== null).join('|') || 'darts-career-ai';
        let hash = 2166136261;
        for (let i = 0; i < identity.length; i++) {
            hash ^= identity.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function isCareerPlayer(candidate) {
        if (!candidate || typeof player === 'undefined' || !player) return false;
        if (candidate === player) return true;
        try { return typeof samePlayer === 'function' && samePlayer(candidate, player); }
        catch (_error) { return false; }
    }

    function aiSelections(candidate) {
        const hash = hashIdentity(candidate);
        const picks = {};
        categoryKeys.forEach((category, index) => {
            // Adding a selectable length must not reroll existing AI equipment.
            const list = category === 'shaftLength' ? catalogue[category].filter(entry => ['28', '35', '41'].includes(entry.id)) : catalogue[category];
            const mixed = Math.imul(hash ^ Math.imul(index + 3, 0x9e3779b1), 0x85ebca6b) >>> 0;
            picks[category] = list[mixed % list.length].id;
        });
        return picks;
    }

    function buildLoadout(selections, source, owner, trying = {}) {
        const values = Object.fromEntries(categoryKeys.map(category => [category, findItem(category, selections[category])]));
        if (source === 'career') customColorFields.forEach(field => {
            const color = owner?.dartCustomization?.customColors?.[field];
            if (validCustomColor(color) && !Object.hasOwn(trying, field))
                values[field] = { ...values[field], id: 'custom', color };
        });
        const integrated = values.flightSystem.id !== 'separate';
        const shaftLength = root.dartModel.shaftLengths(values.flightSystem.id).includes(Number(values.shaftLength.id))
            ? Number(values.shaftLength.id) : Number(defaults.shaftLength);
        const shaft = integrated ? values.integratedColor : values.shaftColor;
        const flight = integrated ? values.integratedColor : values.flightColor;
        return Object.freeze({
            source,
            shaftColorId: shaft.id, shaftColor: shaft.color,
            flightColorId: flight.id, flightColor: flight.color,
            flightSystem: values.flightSystem.id, integratedColor: values.integratedColor.color,
            integratedColorId: values.integratedColor.id,
            barrelColorId: values.barrelColor.id, barrelColor: values.barrelColor.color,
            tipColorId: values.tipColor.id, tipColor: values.tipColor.color,
            barrelShape: values.barrelShape.id, flightShape: values.flightShape.id,
            barrelPattern: values.barrelPattern.id, patternAccent: values.flightAccentColor.color,
            gripZones: { ...selections.gripZones },
            gripSections: selections.gripSections ? [...selections.gripSections] : undefined,
            gripRegions: root.dartModel.normalizeGripRegions(selections.gripRegions,Number(selections.barrelLength) || 50),
            weightGrams: Number(selections.weightGrams) || 23,
            barrelLength: Number(selections.barrelLength) || 50,
            barrelDiameter: root.dartModel.normalizeBarrelDiameter(selections.barrelDiameter),
            barrelAccentColorId: values.barrelAccentColor.id, barrelAccentColor: values.barrelAccentColor.color,
            barrelAccentStyle: values.barrelAccentStyle.id,
            flightAccentColorId: values.flightAccentColor.id, flightAccentColor: values.flightAccentColor.color,
            flightPattern: values.flightPattern.id,
            flightArtwork: source === 'career' ? owner?.dartCustomization?.flightArtwork || null : null,
            tipLength: Number(values.tipLength.id), tipStyle: values.tipStyle.id,
            shaftLength, shaftStyle: values.shaftStyle.id,
            ownerKey: String(owner?.id || owner?.sourceName || owner?.name || '')
        });
    }

    const aiDartSelectFields = ['barrelShape', 'barrelPattern', 'barrelAccentStyle', 'flightShape',
        'flightPattern', 'flightSystem', 'shaftStyle', 'tipStyle'];
    const aiDartColorFields = ['barrelColor', 'barrelAccentColor', 'shaftColor', 'tipColor',
        'flightColor', 'flightAccentColor', 'integratedColor'];
    function normalizeAiDartAppearance(input = {}) {
        const raw = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
        const base = root.dartModel.normalize();
        const result = {};
        for (const field of aiDartSelectFields) {
            result[field] = catalogue[field].some(item => item.id === raw[field]) ? raw[field] : base[field];
        }
        for (const field of aiDartColorFields) {
            result[field] = typeof raw[field] === 'string' && /^#[0-9a-f]{6}$/i.test(raw[field])
                ? raw[field].toLowerCase() : base[field];
        }
        result.tipLength = [26, 30, 35, 40, 50].includes(Number(raw.tipLength)) ? Number(raw.tipLength) : base.tipLength;
        result.shaftLength = root.dartModel.shaftLengths(result.flightSystem).includes(Number(raw.shaftLength)) ? Number(raw.shaftLength) : base.shaftLength;
        result.barrelLength = Number.isInteger(Number(raw.barrelLength)) && Number(raw.barrelLength) >= 35
            && Number(raw.barrelLength) <= 55 ? Number(raw.barrelLength) : base.barrelLength;
        result.barrelDiameter = root.dartModel.normalizeBarrelDiameter(raw.barrelDiameter);
        result.weightGrams = Number.isInteger(Number(raw.weightGrams)) && Number(raw.weightGrams) >= 12
            && Number(raw.weightGrams) <= 40 ? Number(raw.weightGrams) : base.weightGrams;
        const zones = raw.gripZones && typeof raw.gripZones === 'object' && !Array.isArray(raw.gripZones)
            ? raw.gripZones : {};
        result.gripZones = Object.fromEntries(['front', 'middle', 'rear'].map(zone => [zone,
            catalogue.barrelPattern.some(item => item.id === zones[zone]) ? zones[zone] : result.barrelPattern]));
        result.gripSections = root.dartModel.normalize({ ...result, gripSections: raw.gripSections }).gripSections;
        result.gripRegions = root.dartModel.normalizeGripRegions(raw.gripRegions,result.barrelLength);
        result.flightArtwork = root.dartModel.validFlightArtwork(raw.flightArtwork) ? raw.flightArtwork : null;
        return result;
    }
    function isValidAiDartAppearance(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input)) return false;
        const normal = normalizeAiDartAppearance(input);
        const fields = [...aiDartSelectFields, ...aiDartColorFields, 'tipLength', 'shaftLength',
            'barrelLength', 'weightGrams', 'flightArtwork'];
        const hasSections = Object.prototype.hasOwnProperty.call(input, 'gripSections');
        const hasDiameter = Object.prototype.hasOwnProperty.call(input, 'barrelDiameter');
        const hasRegions = Object.prototype.hasOwnProperty.call(input, 'gripRegions');
        if (Object.keys(input).length !== fields.length + 1 + Number(hasSections) + Number(hasDiameter) + Number(hasRegions)) return false;
        if (hasRegions && !root.dartModel.validGripRegions(input.gripRegions,normal.barrelLength)) return false;
        if (hasDiameter && input.barrelDiameter !== normal.barrelDiameter) return false;
        if (hasSections && (!Array.isArray(input.gripSections) || input.gripSections.length !== 9
            || input.gripSections.some((grip, index) => grip !== normal.gripSections[index]))) return false;
        if (fields.some(field => !Object.prototype.hasOwnProperty.call(input, field)
            || input[field] !== normal[field])) return false;
        const zones = input.gripZones;
        return !!zones && typeof zones === 'object' && !Array.isArray(zones)
            && Object.keys(zones).length === 3
            && ['front', 'middle', 'rear'].every(zone => zones[zone] === normal.gripZones[zone]);
    }

    function applyCareerDartAppearance(candidate, input) {
        if (!isCareerPlayer(candidate) || !isValidAiDartAppearance(input)) return false;
        const appearance = normalizeAiDartAppearance(input);
        const state = normalizeDartCustomization(candidate);
        for (const category of categoryKeys) {
            const isColor = customColorFields.includes(category);
            const choice = catalogue[category].find(entry => isColor
                ? entry.color.toLowerCase() === appearance[category]
                : entry.id === String(appearance[category]));
            if (choice) {
                state.selected[category] = choice.id;
                if (!state.owned[category].includes(choice.id)) state.owned[category].push(choice.id);
            }
            if (isColor) state.customColors[category] = appearance[category];
        }
        state.selected.gripZones = { ...appearance.gripZones };
        state.selected.gripSections = [...appearance.gripSections];
        state.selected.gripRegions = appearance.gripRegions;
        for (const pattern of [...Object.values(appearance.gripZones), ...appearance.gripSections,
            ...(appearance.gripRegions || []).map(region => region.pattern)]) {
            if (!state.owned.barrelPattern.includes(pattern)) state.owned.barrelPattern.push(pattern);
        }
        state.selected.weightGrams = appearance.weightGrams;
        state.selected.barrelLength = appearance.barrelLength;
        state.selected.barrelDiameter = appearance.barrelDiameter;
        state.flightArtwork = appearance.flightArtwork;
        state.flightArtworkName = '';
        // The career uses its editable, owned kit rather than the AI override.
        delete candidate.aiDartAppearance;
        candidate.dartCustomization = state;
        notifyChange();
        return true;
    }

    function getDartLoadoutForPlayer(candidate) {
        if (isCareerPlayer(candidate)) {
            const state = normalizeDartCustomization(player);
            return withDartEntryAngle(buildLoadout(state.selected, 'career', player), player);
        }
        if (candidate?.aiDartAppearance) return withDartEntryAngle(Object.freeze({
            ...root.dartModel.normalize(normalizeAiDartAppearance(candidate.aiDartAppearance)),
            source: 'opponent', ownerKey: String(candidate.id || candidate.sourceName || candidate.name || '')
        }), candidate);
        return withDartEntryAngle(buildLoadout(aiSelections(candidate), 'opponent', candidate), candidate);
    }

    function getMatchParticipant(side) {
        if (typeof currentMatch === 'undefined' || !currentMatch) return typeof player !== 'undefined' ? player : null;
        if (currentMatch.isWorldCup) {
            const team = side === 'p2' ? currentMatch.worldCupTeamP2 : currentMatch.worldCupTeamP1;
            const thrower = Number(currentMatch.doublesThrower?.[side]) || 0;
            return team?.players?.[thrower] || team?.players?.[0] || null;
        }
        if (side === 'p2') return currentMatch.opponent || null;
        if (currentMatch.isSpectator) return currentMatch.spectatorP1 || null;
        return typeof player !== 'undefined' ? player : null;
    }

    function getMatchDartLoadout(side = 'p1') {
        return getDartLoadoutForPlayer(getMatchParticipant(side));
    }

    async function uploadDartFlightArtwork(input) {
        const file = input?.files?.[0] || input;
        if (input?.files) input.value = '';
        if (typeof player === 'undefined' || !file) return false;
        const owner = player;
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            if (typeof alert === 'function') alert(tr('artworkInvalid'));
            return false;
        }
        let url;
        try {
            url = URL.createObjectURL(file);
            const image = await new Promise((resolve, reject) => {
                const loaded = new Image();
                loaded.onload = () => resolve(loaded);
                loaded.onerror = reject;
                loaded.src = url;
            });
            if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth > 8192 || image.naturalHeight > 8192)
                throw new Error('Invalid artwork dimensions');
            let canvas;
            if (root.flightArtworkEditor) {
                canvas = await root.flightArtworkEditor.open(image, {
                    shape: normalizeDartCustomization(owner).selected.flightShape, filename: file.name
                });
                if (!canvas || player !== owner) return false;
            } else {
                canvas = document.createElement('canvas');
                canvas.width = canvas.height = 256;
                const side = Math.min(image.naturalWidth, image.naturalHeight);
                canvas.getContext('2d').drawImage(image, (image.naturalWidth - side) / 2,
                    (image.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
            }
            const artwork = canvas.toDataURL('image/png');
            if (!root.dartModel?.validFlightArtwork(artwork)) throw new Error('Artwork exceeds save limit');
            root.dartModel.registerFlightArtwork(artwork, canvas);
            const state = normalizeDartCustomization(owner);
            state.flightArtwork = artwork;
            state.flightArtworkName = String(file.name || '').slice(0, 60);
            if (typeof saveGame === 'function') saveGame(true);
            if (typeof showShopScreen === 'function') showShopScreen();
            else refreshPreview();
            notifyChange('flightArtwork');
            return true;
        } catch (_error) {
            if (typeof alert === 'function') alert(tr('artworkInvalid'));
            return false;
        } finally {
            if (url) URL.revokeObjectURL(url);
        }
    }

    function removeDartFlightArtwork() {
        if (typeof player === 'undefined') return false;
        const state = normalizeDartCustomization(player);
        if (!state.flightArtwork) return false;
        state.flightArtwork = null;
        state.flightArtworkName = '';
        if (typeof saveGame === 'function') saveGame(true);
        if (typeof showShopScreen === 'function') showShopScreen();
        else refreshPreview();
        notifyChange('flightArtwork');
        return true;
    }

    function notifyChange(category) {
        if (previewSelection) {
            delete previewSelection[category];
            if (!Object.keys(previewSelection).length) previewSelection = null;
        }
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('dart-loadout-change'));
        }
        if (typeof drawDartboard === 'function') drawDartboard();
    }

    function isDartOptionCompatible(category, id, selections) {
        return category !== 'shaftLength' || root.dartModel.shaftLengths(selections.flightSystem).includes(Number(id));
    }

    function equipDartCustomization(category, id) {
        if (typeof player === 'undefined' || !catalogue[category]) return false;
        const state = normalizeDartCustomization(player);
        if (!state.owned[category].includes(id) || !findItem(category, id) || !isDartOptionCompatible(category, id, state.selected)) return false;
        state.selected[category] = id;
        if (customColorFields.includes(category)) delete state.customColors[category];
        if (category === 'barrelPattern') {
            state.selected.gripZones = { front: id, middle: id, rear: id };
            state.selected.gripSections = Array(9).fill(id);
            state.selected.gripRegions = null;
        }
        notifyChange(category);
        if (typeof showShopScreen === 'function') showShopScreen();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function buyDartCustomization(category, id) {
        if (typeof player === 'undefined' || !catalogue[category]) return false;
        const state = normalizeDartCustomization(player);
        const product = findItem(category, id);
        if (!product || product.id !== id || !isDartOptionCompatible(category, id, state.selected)) return false;
        if (state.owned[category].includes(id)) return equipDartCustomization(category, id);
        const budget = Math.max(0, Number(player.budget) || 0);
        if (budget < product.price) {
            if (typeof alert === 'function') alert(tr('noFunds'));
            return false;
        }
        const question = tr('confirm').replace('{item}', nameOf(product)).replace('{price}', product.price.toLocaleString('en-GB'));
        if (typeof confirm === 'function' && !confirm(question)) return false;
        player.budget = budget - product.price;
        state.owned[category].push(id);
        state.selected[category] = id;
        if (customColorFields.includes(category)) delete state.customColors[category];
        if (category === 'barrelPattern') {
            state.selected.gripZones = { front: id, middle: id, rear: id };
            state.selected.gripSections = Array(9).fill(id);
            state.selected.gripRegions = null;
        }
        if (typeof updateHub === 'function') updateHub();
        notifyChange(category);
        if (typeof showShopScreen === 'function') showShopScreen();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function setDartCustomColor(category, value, persist = true) {
        if (typeof player === 'undefined' || !customColorFields.includes(category)
            || (value !== null && !validCustomColor(value))) return false;
        const state = normalizeDartCustomization(player);
        if (value === null) delete state.customColors[category];
        else state.customColors[category] = value.toLowerCase();
        notifyChange(category);
        refreshPreview();
        if (persist && typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function setDartDimension(kind, value) {
        if (typeof player === 'undefined' || !['weightGrams', 'barrelLength', 'barrelDiameter'].includes(kind)) return false;
        if (kind === 'barrelDiameter') {
            const diameter = root.dartModel.normalizeBarrelDiameter(value);
            if (value !== null && diameter === null) return false;
            const state = normalizeDartCustomization(player);
            if (state.selected.barrelDiameter === diameter) return true;
            state.selected.barrelDiameter = diameter;previewSelection = null;notifyChange(kind);refreshPreview();
            if (typeof saveGame === 'function') saveGame(true);
            return true;
        }
        const number = Number(value), minimum = kind === 'weightGrams' ? 12 : 35, maximum = kind === 'weightGrams' ? 40 : 55;
        if (!Number.isInteger(number) || number < minimum || number > maximum) return false;
        const state = normalizeDartCustomization(player);
        if (state.selected[kind] === number) return true;
        if (kind === 'barrelLength') state.selected.gripRegions = root.dartModel.rescaleGripRegions(
            state.selected.gripRegions,state.selected.barrelLength,number);
        state.selected[kind] = number;
        previewSelection = null;
        notifyChange(kind);
        if (kind === 'barrelLength' && Array.isArray(state.selected.gripRegions) && typeof showShopScreen === 'function') showShopScreen();
        else refreshPreview();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function setDartGripRegions(input) {
        if (typeof player === 'undefined') return false;
        const state = normalizeDartCustomization(player);
        if (!root.dartModel.validGripRegions(input,state.selected.barrelLength)) return false;
        const regions = root.dartModel.normalizeGripRegions(input,state.selected.barrelLength);
        const patterns = [...new Set((regions || []).map(region => region.pattern))];
        const purchases = patterns.filter(id => !state.owned.barrelPattern.includes(id)).map(id => catalogue.barrelPattern.find(p => p.id === id));
        const price = purchases.reduce((sum,part) => sum + part.price,0), budget = Math.max(0,Number(player.budget) || 0);
        if (price > budget) { if (typeof alert === 'function') alert(tr('noFunds'));return false; }
        if (price && typeof confirm === 'function' && !confirm(tr('confirm').replace('{item}',purchases.map(nameOf).join(', '))
            .replace('{price}',price.toLocaleString('en-GB')))) return false;
        if (price) {
            player.budget = budget - price;purchases.forEach(part => state.owned.barrelPattern.push(part.id));
            if (typeof updateHub === 'function') updateHub();
        }
        state.selected.gripRegions = regions;previewSelection = null;notifyChange('gripRegions');
        if (typeof showShopScreen === 'function') showShopScreen();else refreshPreview();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function setDartGripZone(zone, id, control = null) {
        const zones = ['front', 'middle', 'rear'];
        const fine = Number.isInteger(zone);
        if (typeof player === 'undefined' || !(fine ? zone >= 0 && zone < 9 : zones.includes(zone))) return false;
        const state = normalizeDartCustomization(player);
        const product = catalogue.barrelPattern.find(entry => entry.id === id);
        const selectedGrip = fine ? state.selected.gripSections[zone] : state.selected.gripZones[zone];
        const restoreSelection = () => { if (control) control.value = selectedGrip; };
        if (!product) { restoreSelection(); return false; }
        if (selectedGrip === id && state.selected.gripRegions === null) return true;
        const needsPurchase = !state.owned.barrelPattern.includes(id);
        if (needsPurchase) {
            const budget = Math.max(0, Number(player.budget) || 0);
            if (budget < product.price) {
                if (typeof alert === 'function') alert(tr('noFunds'));
                restoreSelection();
                return false;
            }
            const question = tr('confirm').replace('{item}', nameOf(product)).replace('{price}', product.price.toLocaleString('en-GB'));
            if (typeof confirm === 'function' && !confirm(question)) {
                restoreSelection();
                return false;
            }
            player.budget = budget - product.price;
            state.owned.barrelPattern.push(id);
            if (typeof updateHub === 'function') updateHub();
        }
        state.selected.gripRegions = null;
        if (fine) {
            state.selected.gripSections[zone] = id;
            const group = Math.floor(zone / 3);
            state.selected.gripZones[zones[group]] = state.selected.gripSections[group * 3 + 1];
        } else {
            state.selected.gripZones[zone] = id;
            const start = zones.indexOf(zone) * 3;
            state.selected.gripSections.fill(id, start, start + 3);
        }
        previewSelection = null;
        notifyChange('gripZones');
        refreshPreview();
        if (needsPurchase && typeof showShopScreen === 'function') showShopScreen();
        if (typeof document !== 'undefined') document.querySelectorAll('[data-category="barrelPattern"]').forEach(option => {
            const selected = state.selected.gripSections.every(grip => grip === option.dataset.item);
            option.classList.toggle('selected', selected);
            const button = option.querySelector('button:not(.dart-try-button)');
            if (button) {
                button.disabled = selected;
                button.textContent = selected ? tr('selected') : tr('owned');
            }
        });
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }


    function previewMarkup(loadout, idPrefix = 'kit') {
        const prefix = /^[a-z][\w-]*$/i.test(idPrefix) ? idPrefix : 'kit';
        const a = root.dartModel.normalize(loadout), d = root.dartModel.dimensions(a);
        const integrated = a.flightSystem !== 'separate', clear = a.flightSystem === 'integrated-clear' || a.flightSystem === 'integrated-frosted';
        const r = root.dartModel.radiusAt, cut = root.dartModel.gripCutAt;
        const barrel = [];
        for (let z = 0; z <= a.barrelLength + .001; z += .2) barrel.push([a.tipLength + z, -(r(a.barrelShape, z, a.barrelLength, a.barrelDiameter) - cut(a, z))]);
        for (let z = a.barrelLength; z >= -.001; z -= .2) barrel.push([a.tipLength + z, r(a.barrelShape, z, a.barrelLength, a.barrelDiameter) - cut(a, z)]);
        const outline = barrel.map(p => p.join(',')).join(' ');
        const point = [];
        for (let z = 0; z < a.tipLength; z += .15) point.push([z, -root.dartModel.tipRadiusAt(a, z)]);
        point.push([a.tipLength, -1.2], [a.tipLength, 1.2]);
        for (let z = a.tipLength; z >= 0; z -= .15) point.push([z, root.dartModel.tipRadiusAt(a, z)]);
        const flight = root.dartModel.outlines[a.flightShape];
        const wing = flight.map(([x,z]) => `${d.flightStart + z},${-x}`).concat([...flight].reverse().map(([x,z]) => `${d.flightStart + z},${x}`)).join(' ');
        const print = document.createElement('canvas'); print.width = print.height = 128;
        root.dartModel.drawFlight(print.getContext('2d'), a, 128);
        const flightPrint = print.toDataURL();
        return `<svg class="dart-preview-fallback" viewBox="-5 -26 ${d.totalLength + 10} 52" role="img" aria-label="${escapeHtml(tr('fallback'))}">
            <defs>
                <linearGradient id="${prefix}-metal" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".2" stop-color="#fff" stop-opacity=".1"/>
                    <stop offset=".4" stop-color="#fff" stop-opacity=".8"/><stop offset=".55" stop-color="#fff" stop-opacity=".1"/>
                    <stop offset="1" stop-color="#000" stop-opacity=".65"/>
                </linearGradient>
                <clipPath id="${prefix}-barrel"><polygon points="${outline}"/></clipPath>
                <clipPath id="${prefix}-flight"><polygon points="${wing}"/></clipPath>
            </defs>
            <polygon points="${point.map(p => p.join(',')).join(' ')}" fill="${a.tipColor}"/>
            <polygon points="${outline}" fill="${a.barrelColor}"/>
            <g clip-path="url(#${prefix}-barrel)" fill="${a.barrelAccentColor}">
                ${a.barrelAccentStyle === 'split' ? `<rect x="${a.tipLength}" y="-5" width="${a.barrelLength / 2}" height="10"/>`
                    : a.barrelAccentStyle === 'bands' ? [a.barrelLength * .2, a.barrelLength * .7].map(z => `<rect x="${a.tipLength + z}" y="-5" width="${a.barrelLength * .1}" height="10"/>`).join('')
                        : Array.from({length: Math.ceil((a.barrelLength - 9) * 5)}, (_,i) => i*.2+5).filter(z => cut(a,z) > .16).map(z => `<rect x="${a.tipLength+z}" y="-5" width=".2" height="10"/>`).join('')}
            </g>
            <polygon points="${outline}" fill="url(#${prefix}-metal)"/>
            <path d="M${a.tipLength+a.barrelLength} -2.4 L${d.flightStart} -1.2 L${integrated ? d.totalLength : a.tipLength+a.barrelLength+a.shaftLength} -.6 V.6 L${d.flightStart} 1.2 L${a.tipLength+a.barrelLength} 2.4 Z" fill="${a.shaftColor}" opacity="${clear ? .68 : 1}"/>
            <g clip-path="url(#${prefix}-flight)">
                <image href="${flightPrint}" width="256" height="256" transform="matrix(0 ${-17.5/256} ${-42/256} 0 ${d.flightStart+42} 0)"/>
                <image href="${flightPrint}" width="256" height="256" transform="matrix(0 ${17.5/256} ${-42/256} 0 ${d.flightStart+42} 0)"/>
            </g>
            <polygon points="${wing}" fill="${a.flightColor}" transform="scale(1 .24)" stroke="${integrated ? a.flightColor : a.flightAccentColor}" stroke-width=".2" opacity="${clear ? .38 : 1}"/>
            ${clear ? `<polygon points="${wing}" fill="none" stroke="${a.flightColor}" stroke-width=".3" opacity=".7"/>` : ''}
            <path d="M${d.flightStart} 0 H${d.totalLength}" stroke="${a.shaftColor}" stroke-width=".5"/>
        </svg>`;
    }

    function refreshPreview() {
        if (typeof document === 'undefined' || typeof player === 'undefined') return;
        const host = document.getElementById('dart-kit-preview');
        if (!host) return;
        const state = normalizeDartCustomization(player);
        if (previewSelection?.shaftLength && !isDartOptionCompatible('shaftLength', previewSelection.shaftLength, { ...state.selected, ...previewSelection })) {
            delete previewSelection.shaftLength;
            if (!Object.keys(previewSelection).length) previewSelection = null;
        }
        const selections = { ...state.selected, ...(previewSelection || {}) };
        if (previewSelection?.barrelPattern) {
            selections.gripZones = { front: previewSelection.barrelPattern,
                middle: previewSelection.barrelPattern, rear: previewSelection.barrelPattern };
            selections.gripSections = Array(9).fill(previewSelection.barrelPattern);
            selections.gripRegions = null;
        }
        const loadout = buildLoadout(selections, 'career', player, previewSelection || {});
        const diameter = root.dartModel.dimensions(loadout).barrelRadius * 2;
        document.querySelectorAll('[data-barrel-diameter]').forEach(input => {
            input.value = diameter;input.nextElementSibling.textContent = diameter.toFixed(1) + ' mm';
        });
        document.querySelectorAll('[data-reset-barrel-diameter]').forEach(button => { button.disabled = state.selected.barrelDiameter === null; });
        const integrated = loadout.flightSystem !== 'separate';
        document.querySelectorAll('[data-dart-category]').forEach(section => {
            const category = section.dataset.dartCategory;
            section.hidden = category === 'barrelPattern' && Array.isArray(loadout.gripRegions) ? true : category === 'integratedColor' ? !integrated
                : integrated && ['shaftStyle', 'shaftColor', 'flightColor'].includes(category);
        });
        document.querySelectorAll('[data-integrated-hint]').forEach(hint => { hint.hidden = !integrated; });
        host.innerHTML = previewMarkup(loadout);
        const tried = previewSelection ? Object.entries(previewSelection).map(([category,id]) => nameOf(findItem(category,id))).join(' · ') : '';
        document.getElementById('dart-preview-status').textContent = tried ? tr('trying').replace('{item}', tried) : tr('preview');
        document.getElementById('dart-preview-reset').hidden = !tried;
        document.getElementById('dart-preview-measurements').textContent = tr('measurements').replace('{tip}', loadout.tipLength)
            .replace('{barrel}', loadout.barrelLength).replace('{shaft}', loadout.shaftLength).replace('{weight}', loadout.weightGrams)
            + ` · Ø ${diameter.toFixed(1)} mm`
            + (integrated ? ` · ${nameOf(findItem('flightSystem', loadout.flightSystem))}` : '');
        document.querySelectorAll('.dart-option').forEach(option => {
            option.hidden = !isDartOptionCompatible(option.dataset.category, option.dataset.item, selections);
            const trying = previewSelection?.[option.dataset.category] === option.dataset.item;
            option.classList.toggle('trying', trying);
            option.querySelector('.dart-try-button')?.setAttribute('aria-pressed', String(trying));
            if (customColorFields.includes(option.dataset.category)) {
                const selected = !state.customColors[option.dataset.category] && state.selected[option.dataset.category] === option.dataset.item;
                option.classList.toggle('selected', selected);
                const owned = state.owned[option.dataset.category].includes(option.dataset.item);
                const button = option.querySelector('button:not(.dart-try-button)');
                button.disabled = selected;
                button.textContent = selected ? tr('selected') : owned ? tr('owned')
                    : `${tr('buy')} £${findItem(option.dataset.category, option.dataset.item).price.toLocaleString('en-GB')}`;
                button.setAttribute('aria-label', `${button.textContent}: ${tr(option.dataset.category)} — ${nameOf(findItem(option.dataset.category, option.dataset.item))}`);
            }
        });
        document.querySelectorAll('[data-custom-color]').forEach(input => {
            const field = input.dataset.customColor;
            input.value = loadout[field];
            input.nextElementSibling.textContent = loadout[field].toUpperCase();
        });
        document.querySelectorAll('[data-custom-color-reset]').forEach(button => {
            button.disabled = !state.customColors[button.dataset.customColorReset];
        });
        root.dartPreview?.mount(host, loadout, tr('rotate'));
    }

    function previewDartCustomization(category, id) {
        const product = catalogue[category]?.find(entry => entry.id === id);
        if (!product) return false;
        const selections = { ...normalizeDartCustomization(player).selected, ...(previewSelection || {}) };
        if (!isDartOptionCompatible(category, id, selections)) return false;
        previewSelection = { ...previewSelection, [category]: id };
        refreshPreview();
        return true;
    }
    function resetDartCustomizationPreview() { previewSelection = null; refreshPreview(); }
    function selectDartCustomizationPart(part) {
        if (!parts[part]) return;
        activePart = part;
        document.querySelectorAll('[data-dart-part]').forEach(panel => { panel.hidden = panel.dataset.dartPart !== part; });
        document.querySelectorAll('[data-dart-tab]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.dartTab === part));
        });
    }
    function optionSymbol(category, product) {
        if (product.color) return `<i class="dart-option-swatch" style="--swatch:${product.color}" aria-hidden="true"></i>`;
        if (category === 'flightPattern') {
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
            root.dartModel.drawFlight(canvas.getContext('2d'), { flightColor: '#254b70', flightAccentColor: '#e5bb54', flightPattern: product.id }, 64);
            return `<img class="dart-option-symbol dart-print-sample" src="${canvas.toDataURL()}" alt=""/>`;
        }
        if (category === 'barrelPattern') {
            if (product.id === 'pixel') return `<svg class="dart-option-symbol" viewBox="0 0 36 16" aria-hidden="true"><rect width="36" height="16" rx="2" fill="#becad4"/><g fill="none" stroke="#374956" stroke-width=".9">${[1, 9].map(y => `<path d="M0 ${y} H36 M0 ${y+1.7} H36"/>${[3, 10, 17, 24, 31].map(x => `<path d="M${x} ${y+2} v3 a1.7 1.7 0 0 0 3.4 0 v-3"/>`).join('')}`).join('')}</g></svg>`;
            let path = '';
            for (let x = 0; x <= 36; x += .25) path += `${x ? 'L' : 'M'}${x} ${3 + root.dartModel.cutAt(product.id, x+6, .7)*9} `;
            return `<svg class="dart-option-symbol" viewBox="0 0 36 16" aria-hidden="true"><path d="${path} L36 13 H0 Z" fill="#becad4"/></svg>`;
        }
        if (category === 'tipStyle') {
            const a = root.dartModel.normalize({ tipStyle: product.id, tipLength: 35 }), points = [];
            for (let z = 0; z <= 35; z += .2) points.push(`${z},${-root.dartModel.tipRadiusAt(a,z)*2.4}`);
            for (let z = 35; z >= 0; z -= .2) points.push(`${z},${root.dartModel.tipRadiusAt(a,z)*2.4}`);
            return `<svg class="dart-option-symbol" viewBox="-1 -4 37 8" aria-hidden="true"><polygon points="${points.join(' ')}" fill="#becad4" stroke="#7293aa" stroke-width=".15"/></svg>`;
        }
        if (category === 'flightShape') {
            const points = root.dartModel.outlines[product.id].map(([x,z]) => `${z},${18-x}`).concat([...root.dartModel.outlines[product.id]].reverse().map(([x,z]) => `${z},${18+x}`)).join(' ');
            return `<svg class="dart-option-symbol" viewBox="-1 -1 44 38" aria-hidden="true"><polygon points="${points}" fill="#8bd4ff"/></svg>`;
        }
        return '<span class="dart-option-mark" aria-hidden="true">◇</span>';
    }

    function renderDartCustomizationShop(container = null) {
        if (typeof document === 'undefined' || typeof player === 'undefined') return false;
        const host = typeof container === 'string' ? document.getElementById(container) : container;
        if (!host) return false;
        const state = normalizeDartCustomization(player);
        let html = `<section class="dart-customizer" id="dart-customizer">
            <header class="dart-customizer-header"><h4>${escapeHtml(tr('title'))}</h4><p>${escapeHtml(tr('subtitle'))}</p></header>
            ${dartKitSlotsMarkup()}
            <div class="dart-customizer-workbench">
                <div class="dart-customizer-preview">
                    <strong id="dart-preview-status" aria-live="polite">${escapeHtml(tr('preview'))}</strong>
                    <div class="dart-kit-preview" id="dart-kit-preview"></div>
                    <p id="dart-preview-measurements" class="dart-preview-measurements"></p>
                    <div class="dart-preview-toolbar"><span>${escapeHtml(tr('rotate'))}</span><button type="button" onclick="dartPreview.reset()">${escapeHtml(tr('resetView'))}</button></div>
                    <button type="button" id="dart-preview-reset" class="dart-preview-reset" onclick="resetDartCustomizationPreview()" hidden>${escapeHtml(tr('reset'))}</button>
                </div>
                <div class="dart-customizer-controls">
                    <section class="dart-entry-angle">
                        <label class="dart-dimension" for="dart-entry-angle">${escapeHtml(entryAngleTranslation(0))}
                            <span class="dart-dimension-input"><input id="dart-entry-angle" type="range" min="-10" max="45" step="1"
                                value="${getDartEntryAngleForPlayer(player) ?? 20}" oninput="updateDartEntryAngleControl(this)" onchange="setDartEntryAngle(this.value)"/>
                                <output for="dart-entry-angle">${getDartEntryAngleForPlayer(player) ?? 20}°</output></span></label>
                        <p>${escapeHtml(entryAngleTranslation(1))}</p>
                        <div data-entry-angle-preview>${dartEntryAnglePreview(getDartEntryAngleForPlayer(player) ?? 20)}</div>
                    </section>
                    <nav class="dart-part-tabs" aria-label="${escapeHtml(tr('title'))}">${Object.keys(parts).map(part => `<button type="button" data-dart-tab="${part}" aria-pressed="${activePart === part}" onclick="selectDartCustomizationPart('${part}')">${escapeHtml(tr(part))}</button>`).join('')}</nav>`;
        Object.entries(parts).forEach(([part, categories]) => {
            html += `<div class="dart-customizer-categories" data-dart-part="${part}" ${activePart === part ? '' : 'hidden'}>`;
            if (part === 'barrel') html += `<section class="dart-barrel-controls">
                <label class="dart-dimension">${escapeHtml(tr('weightLabel'))}<span class="dart-dimension-input">
                    <input type="range" min="12" max="40" step="1" value="${state.selected.weightGrams}" aria-label="${escapeHtml(tr('weightLabel'))}"
                        oninput="this.nextElementSibling.textContent=this.value+' g'" onchange="setDartDimension('weightGrams',this.value)"/>
                    <output>${state.selected.weightGrams} g</output></span></label>
                <label class="dart-dimension">${escapeHtml(tr('lengthLabel'))}<span class="dart-dimension-input">
                    <input type="range" min="35" max="55" step="1" value="${state.selected.barrelLength}" aria-label="${escapeHtml(tr('lengthLabel'))}"
                        oninput="this.nextElementSibling.textContent=this.value+' mm'" onchange="setDartDimension('barrelLength',this.value)"/>
                    <output>${state.selected.barrelLength} mm</output></span></label>
                <div class="dart-diameter-control"><label class="dart-dimension">${escapeHtml(tr('diameterLabel'))}<span class="dart-dimension-input">
                    <input data-barrel-diameter type="range" min="5" max="9" step="0.1" value="${state.selected.barrelDiameter ?? root.dartModel.defaultBarrelDiameter(state.selected.barrelShape)}" aria-label="${escapeHtml(tr('diameterLabel'))}"
                        oninput="this.nextElementSibling.textContent=Number(this.value).toFixed(1)+' mm'" onchange="setDartDimension('barrelDiameter',this.value)"/>
                    <output>${(state.selected.barrelDiameter ?? root.dartModel.defaultBarrelDiameter(state.selected.barrelShape)).toFixed(1)} mm</output></span></label>
                    <button type="button" data-reset-barrel-diameter onclick="setDartDimension('barrelDiameter',null)" ${state.selected.barrelDiameter === null ? 'disabled' : ''}>${escapeHtml(tr('resetDiameter'))}</button></div>
                <div class="dart-grip-zones"><h5>${escapeHtml(tr('gripZonesTitle'))}</h5>
                    <p ${Array.isArray(state.selected.gripRegions) ? 'hidden' : ''}>${escapeHtml(tr('gripZonesHint'))}</p><div class="dart-grip-zone-fields dart-grip-fine-fields" ${Array.isArray(state.selected.gripRegions) ? 'hidden' : ''}>
                    ${Array.from({ length: 9 }, (_, index) => { const label = `${tr(['gripFront', 'gripMiddle', 'gripRear'][Math.floor(index / 3)])} ${index % 3 + 1}`;
                        return `<label>${escapeHtml(label)}
                        <select data-grip-section="${index}" aria-label="${escapeHtml(label)}" onchange="setDartGripSection(${index},this.value,this)">
                        ${catalogue.barrelPattern.map(entry =>
                            `<option value="${entry.id}" data-owned="${state.owned.barrelPattern.includes(entry.id)}" ${state.selected.gripSections[index] === entry.id ? 'selected' : ''}>${escapeHtml(nameOf(entry))}${state.owned.barrelPattern.includes(entry.id) ? '' : ` · £${entry.price.toLocaleString('en-GB')}`}</option>`).join('')}
                        </select></label>`; }).join('')}
                    </div>${root.dartGripEditor ? root.dartGripEditor.markup('career',state.selected,state.owned.barrelPattern) : ''}</div></section>`;
            if (part === 'shaft' || part === 'flights') html += `<p class="dart-integrated-hint" data-integrated-hint hidden>${escapeHtml(tr('integratedHint'))}</p>`;
            if (part === 'flights') html += `<section class="dart-artwork"><h5>${escapeHtml(tr('artworkTitle'))}</h5>
                <p>${escapeHtml(tr('artworkHint'))}</p><div class="dart-artwork-actions">
                ${state.flightArtwork ? `<img src="${state.flightArtwork}" alt="" class="dart-artwork-thumb"/><span class="dart-artwork-name">${escapeHtml(state.flightArtworkName)}</span>` : ''}
                <label class="dart-artwork-upload">${escapeHtml(tr(state.flightArtwork ? 'artworkChange' : 'artworkAdd'))}
                    <input type="file" accept="image/png,image/jpeg,image/webp" onchange="uploadDartFlightArtwork(this)"/></label>
                ${state.flightArtwork ? `<button type="button" onclick="removeDartFlightArtwork()">${escapeHtml(tr('artworkRemove'))}</button>` : ''}
                ${root.flightArtworkEditor ? root.flightArtworkEditor.controlsMarkup(state.selected.flightShape) : ''}
                </div></section>`;
            categories.forEach(category => {
                html += `<section class="dart-customizer-category" data-dart-category="${category}"><h5>${escapeHtml(tr(category))}</h5>`;
                if (customColorFields.includes(category)) html += `<div class="dart-color-picker">
                    <label for="dart-color-${category}">${escapeHtml(tr('customColor'))}</label>
                    <div class="dart-color-picker-row"><input type="color" id="dart-color-${category}" data-custom-color="${category}"
                        value="${state.customColors[category] || findItem(category, state.selected[category]).color}"
                        aria-label="${escapeHtml(tr(category))}: ${escapeHtml(tr('customColor'))}"
                        oninput="setDartCustomColor('${category}',this.value,false)" onchange="setDartCustomColor('${category}',this.value)"/>
                        <output for="dart-color-${category}"></output>
                        <button type="button" data-custom-color-reset="${category}" onclick="setDartCustomColor('${category}',null)">${escapeHtml(tr('catalogueColor'))}</button>
                    </div></div>`;
                html += '<div class="dart-customizer-options">';
                catalogue[category].forEach(product => {
                    const selectedId = category === 'shaftLength' && !isDartOptionCompatible(category, state.selected[category], state.selected)
                        ? defaults.shaftLength : state.selected[category];
                    const selected = category === 'barrelPattern'
                ? state.selected.gripSections.every(grip => grip === product.id)
                        : selectedId === product.id && !state.customColors[category];
                    const owned = state.owned[category].includes(product.id);
                    const action = owned
                        ? `onclick="equipDartCustomization('${category}','${product.id}')"`
                        : `onclick="buyDartCustomization('${category}','${product.id}')"`;
                    const label = selected ? tr('selected') : owned ? tr('owned') : `${tr('buy')} £${product.price.toLocaleString('en-GB')}`;
                    const name = escapeHtml(nameOf(product));
                    html += `<article class="dart-option${selected ? ' selected' : ''}" data-category="${category}" data-item="${product.id}">
                        ${optionSymbol(category, product)}<span>${name}</span>
                        <button type="button" class="dart-try-button" aria-pressed="false" aria-label="${escapeHtml(tr('tryOn'))}: ${escapeHtml(tr(category))} — ${name}" title="${escapeHtml(tr('tryOn'))}" onclick="previewDartCustomization('${category}','${product.id}')"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M2 12Q12 1 22 12Q12 23 2 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg></button>
                        <button type="button" ${action} ${selected ? 'disabled' : ''} aria-label="${escapeHtml(label)}: ${escapeHtml(tr(category))} — ${name}">${escapeHtml(label)}</button></article>`;
                });
                html += '</div></section>';
            });
            html += '</div>';
        });
        html += '</div></div></section>';
        host.querySelector('#dart-customizer')?.remove();
        host.insertAdjacentHTML('beforeend', html);
        refreshPreview();
        return true;
    }

    root.dartCustomizationCatalogue = catalogue;
    // Read a saved configuration without equipping it or normalizing the career owner.
    root.getDartConfigurationLoadout = configuration => buildLoadout(configuration.selected, 'career', {dartCustomization:configuration});
    root.getDartLoadoutSnapshot = candidate => {
        if (!isCareerPlayer(candidate)) return getDartLoadoutForPlayer(candidate);
        const configuration=normalizeDartCustomization({dartCustomization:player.dartCustomization});
        return withDartEntryAngle(buildLoadout(configuration.selected,'career',{dartCustomization:configuration}),player);
    };
    root.normalizeDartKitSlots = normalizeDartKitSlots;
    root.saveDartKitSlot = saveDartKitSlot;
    root.loadDartKitSlot = loadDartKitSlot;
    root.renameDartKitSlot = renameDartKitSlot;
    root.clearDartKitSlot = clearDartKitSlot;
    root.normalizeAiDartAppearance = normalizeAiDartAppearance;
    root.isValidAiDartAppearance = isValidAiDartAppearance;
    root.dartCustomizationPreviewMarkup = previewMarkup;
    root.normalizeDartCustomization = normalizeDartCustomization;
    root.applyCareerDartAppearance = applyCareerDartAppearance;
    root.getDartLoadoutForPlayer = getDartLoadoutForPlayer;
    root.getDartEntryAngleForPlayer = getDartEntryAngleForPlayer;
    root.setDartEntryAngle = setDartEntryAngle;
    root.updateDartEntryAngleControl = updateDartEntryAngleControl;
    root.dartEntryAnglePreview = dartEntryAnglePreview;
    root.getMatchDartLoadout = getMatchDartLoadout;
    root.buyDartCustomization = buyDartCustomization;
    root.equipDartCustomization = equipDartCustomization;
    root.renderDartCustomizationShop = renderDartCustomizationShop;
    root.previewDartCustomization = previewDartCustomization;
    root.resetDartCustomizationPreview = resetDartCustomizationPreview;
    root.selectDartCustomizationPart = selectDartCustomizationPart;
    root.setDartDimension = setDartDimension;
    root.setDartCustomColor = setDartCustomColor;
    root.setDartGripZone = setDartGripZone;
    root.setDartGripRegions = setDartGripRegions;
    root.setDartGripSection = (index, id, control = null) => setDartGripZone(index, id, control);
    root.uploadDartFlightArtwork = uploadDartFlightArtwork;
    root.removeDartFlightArtwork = removeDartFlightArtwork;
    if (typeof root.addEventListener === 'function') root.addEventListener('dart-flight-artwork-ready', () => {
        if (typeof document !== 'undefined' && document.getElementById('dart-kit-preview')) { refreshKitSlotPanel(); refreshPreview(); }
    });
})(typeof window !== 'undefined' ? window : globalThis);
