(function (root) {
    'use strict';

    const text = {
        pl: {
            title: 'Personalizacja lotek', subtitle: 'Zbuduj własny zestaw. Wygląd nie zmienia celności ani statystyk.',
            preview: 'Aktualny zestaw', owned: 'Załóż', selected: 'Wybrane', buy: 'Kup',
            noFunds: 'Nie masz wystarczająco dużo pieniędzy.',
            confirm: 'Kupić „{item}” za £{price}?', purchased: 'Kupiono i założono: {item}.',
            shaftColor: 'Kolor shafta', flightColor: 'Kolor piórek', barrelColor: 'Kolor barrela',
            tipColor: 'Kolor grota', barrelShape: 'Kształt barrela', flightShape: 'Kształt piórek',
            barrelPattern: 'Rodzaj gripu', barrelAccentColor: 'Drugi kolor barrela', barrelAccentStyle: 'Rozmieszczenie koloru',
            flightAccentColor: 'Drugi kolor piórek', flightPattern: 'Nadruk piórek', tipLength: 'Długość grota',
            tipStyle: 'Wykończenie grota', shaftLength: 'Długość shafta', shaftStyle: 'Materiał shafta',
            flightSystem: 'System shafta i piórka', integratedColor: 'Kolor zintegrowanego systemu',
            integratedHint: 'Shaft i piórko tworzą jedną część we wspólnym kolorze. Kształt i nadruk wybierzesz w zakładce Piórka.',
            barrel: 'Barrel', flights: 'Piórka', shaft: 'Shaft', point: 'Grot', tryOn: 'Przymierz',
            trying: 'Przymierzasz: {item}', reset: 'Wróć do zestawu', rotate: 'Przeciągnij, aby obrócić · strzałki na klawiaturze',
            resetView: 'Reset widoku', fallback: 'Podgląd 2D', measurements: 'Grot {tip} mm · barrel 50 mm · shaft {shaft} mm'
        },
        en: {
            title: 'Dart customisation', subtitle: 'Build your own set. Its appearance does not change accuracy or attributes.',
            preview: 'Current set', owned: 'Equip', selected: 'Selected', buy: 'Buy',
            noFunds: 'You do not have enough money.', confirm: 'Buy “{item}” for £{price}?',
            purchased: 'Purchased and equipped: {item}.', shaftColor: 'Shaft colour', flightColor: 'Flight colour',
            barrelColor: 'Barrel colour', tipColor: 'Point colour', barrelShape: 'Barrel shape',
            flightShape: 'Flight shape', barrelPattern: 'Grip type', barrelAccentColor: 'Barrel accent colour', barrelAccentStyle: 'Colour placement',
            flightAccentColor: 'Flight accent colour', flightPattern: 'Flight print', tipLength: 'Point length',
            tipStyle: 'Point finish', shaftLength: 'Shaft length', shaftStyle: 'Shaft material',
            flightSystem: 'Shaft and flight system', integratedColor: 'Integrated system colour',
            integratedHint: 'Shaft and flight form one piece in a shared colour. Choose the shape and print in the Flights tab.',
            barrel: 'Barrel', flights: 'Flights', shaft: 'Shaft', point: 'Point', tryOn: 'Try on',
            trying: 'Trying on: {item}', reset: 'Back to equipped set', rotate: 'Drag to rotate · keyboard arrows',
            resetView: 'Reset view', fallback: '2D preview', measurements: 'Point {tip} mm · barrel 50 mm · shaft {shaft} mm'
        },
        de: {
            title: 'Dart-Anpassung', subtitle: 'Stelle dein eigenes Set zusammen. Das Aussehen ändert weder Präzision noch Werte.',
            preview: 'Aktuelles Set', owned: 'Ausrüsten', selected: 'Ausgewählt', buy: 'Kaufen',
            noFunds: 'Du hast nicht genug Geld.', confirm: '„{item}“ für £{price} kaufen?',
            purchased: 'Gekauft und ausgerüstet: {item}.', shaftColor: 'Schaftfarbe', flightColor: 'Flight-Farbe',
            barrelColor: 'Barrel-Farbe', tipColor: 'Spitzenfarbe', barrelShape: 'Barrel-Form',
            flightShape: 'Flight-Form', barrelPattern: 'Grip-Typ', barrelAccentColor: 'Zweite Barrel-Farbe', barrelAccentStyle: 'Farbverteilung',
            flightAccentColor: 'Zweite Flight-Farbe', flightPattern: 'Flight-Druck', tipLength: 'Spitzenlänge',
            tipStyle: 'Spitzenoberfläche', shaftLength: 'Schaftlänge', shaftStyle: 'Schaftmaterial',
            flightSystem: 'Schaft- und Flight-System', integratedColor: 'Farbe des integrierten Systems',
            integratedHint: 'Schaft und Flight bilden ein Teil in derselben Farbe. Form und Druck findest du unter Flights.',
            barrel: 'Barrel', flights: 'Flights', shaft: 'Schaft', point: 'Spitze', tryOn: 'Anprobieren',
            trying: 'Vorschau: {item}', reset: 'Zum aktuellen Set', rotate: 'Ziehen zum Drehen · Pfeiltasten',
            resetView: 'Ansicht zurücksetzen', fallback: '2D-Vorschau', measurements: 'Spitze {tip} mm · Barrel 50 mm · Schaft {shaft} mm'
        },
        nl: {
            title: 'Darts personaliseren', subtitle: 'Stel je eigen set samen. Het uiterlijk verandert de nauwkeurigheid of eigenschappen niet.',
            preview: 'Huidige set', owned: 'Gebruiken', selected: 'Geselecteerd', buy: 'Kopen',
            noFunds: 'Je hebt niet genoeg geld.', confirm: '„{item}” kopen voor £{price}?',
            purchased: 'Gekocht en geselecteerd: {item}.', shaftColor: 'Shaftkleur', flightColor: 'Flightkleur',
            barrelColor: 'Barrelkleur', tipColor: 'Puntkleur', barrelShape: 'Barrelvorm',
            flightShape: 'Flightvorm', barrelPattern: 'Griptype', barrelAccentColor: 'Tweede barrelkleur', barrelAccentStyle: 'Kleurverdeling',
            flightAccentColor: 'Tweede flightkleur', flightPattern: 'Flightopdruk', tipLength: 'Puntlengte',
            tipStyle: 'Puntafwerking', shaftLength: 'Shaftlengte', shaftStyle: 'Shaftmateriaal',
            flightSystem: 'Shaft- en flightsysteem', integratedColor: 'Kleur geïntegreerd systeem',
            integratedHint: 'Shaft en flight vormen één onderdeel in dezelfde kleur. Kies de vorm en opdruk onder Flights.',
            barrel: 'Barrel', flights: 'Flights', shaft: 'Shaft', point: 'Punt', tryOn: 'Voorbeeld',
            trying: 'Voorbeeld: {item}', reset: 'Terug naar huidige set', rotate: 'Sleep om te draaien · pijltjestoetsen',
            resetView: 'Weergave herstellen', fallback: '2D-voorbeeld', measurements: 'Punt {tip} mm · barrel 50 mm · shaft {shaft} mm'
        }
    };

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
            item('no6', 380, null, ['No. 6 — kompaktowe', 'No. 6 — compact', 'No. 6 — kompakt', 'No. 6 — compact'])
        ]),
        barrelPattern: Object.freeze([
            item('rings', 0, null, ['Klasyczne ringi', 'Classic rings', 'Klassische Ringe', 'Klassieke ringen']),
            item('micro', 460, null, ['Micro grip', 'Micro grip', 'Micro-Grip', 'Microgrip']),
            item('shark', 580, null, ['Shark grip', 'Shark grip', 'Shark-Grip', 'Sharkgrip']),
            item('smooth', 260, null, ['Gładki', 'Smooth', 'Glatt', 'Glad']),
            item('knurled', 640, null, ['Radełkowany — diament', 'Diamond knurl', 'Diamanträndelung', 'Diamantkarteling']),
            item('pixel', 740, null, ['Pixel — frezowana siatka', 'Pixel cuts', 'Pixel-Grip', 'Pixelgrip']),
            item('axial', 680, null, ['Nacięcia wzdłużne', 'Axial cuts', 'Längsrillen', 'Lengtegroeven']),
            item('hybrid', 860, null, ['Hybrydowy — ringi i diament', 'Hybrid — rings & knurl', 'Hybrid — Ringe & Rändelung', 'Hybride — ringen & karteling'])
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
            item('crown', 380, null, ['Korona', 'Crown', 'Krone', 'Kroon'])
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
            item('etched', 280, null, ['Micro grip', 'Micro grip', 'Micro-Grip', 'Microgrip'])
        ]),
        shaftLength: Object.freeze([
            item('35', 0, null, ['35 mm — intermediate', '35 mm — intermediate', '35 mm — intermediate', '35 mm — intermediate']),
            item('28', 200, null, ['28 mm — krótki', '28 mm — short', '28 mm — kurz', '28 mm — kort']),
            item('41', 240, null, ['41 mm — długi', '41 mm — long', '41 mm — lang', '41 mm — lang'])
        ]),
        shaftStyle: Object.freeze([
            item('nylon', 0, null, ['Nylon', 'Nylon', 'Nylon', 'Nylon']),
            item('aluminium', 360, null, ['Aluminium', 'Aluminium', 'Aluminium', 'Aluminium']),
            item('carbon', 520, null, ['Włókno węglowe', 'Carbon fibre', 'Carbonfaser', 'Koolstofvezel'])
        ]),
        flightSystem: Object.freeze([
            item('separate', 0, null, ['Osobny shaft i piórko', 'Separate shaft and flight', 'Schaft und Flight getrennt', 'Losse shaft en flight']),
            item('integrated-solid', 650, null, ['Zintegrowany — nieprzezroczysty', 'Integrated — opaque', 'Integriert — undurchsichtig', 'Geïntegreerd — ondoorzichtig']),
            item('integrated-clear', 750, null, ['Zintegrowany — przezroczysty', 'Integrated — transparent', 'Integriert — transparent', 'Geïntegreerd — transparant'])
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
    const defaults = Object.freeze({ ...Object.fromEntries(categoryKeys.map(key => [key, catalogue[key][0].id])), tipLength: '30' });
    const parts = Object.freeze({ barrel: ['barrelShape', 'barrelPattern', 'barrelColor', 'barrelAccentColor', 'barrelAccentStyle'],
        flights: ['flightShape', 'flightColor', 'flightAccentColor', 'flightPattern'],
        shaft: ['flightSystem', 'shaftLength', 'integratedColor', 'shaftStyle', 'shaftColor'], point: ['tipLength', 'tipStyle', 'tipColor'] });
    let activePart = 'barrel';
    let previewSelection = null;

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
        const normalized = { version: 3, selected: {}, owned: {} };
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
            const list = catalogue[category];
            const mixed = Math.imul(hash ^ Math.imul(index + 3, 0x9e3779b1), 0x85ebca6b) >>> 0;
            picks[category] = list[mixed % list.length].id;
        });
        return picks;
    }

    function buildLoadout(selections, source, owner) {
        const values = Object.fromEntries(categoryKeys.map(category => [category, findItem(category, selections[category])]));
        const integrated = values.flightSystem.id !== 'separate';
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
            barrelAccentColorId: values.barrelAccentColor.id, barrelAccentColor: values.barrelAccentColor.color,
            barrelAccentStyle: values.barrelAccentStyle.id,
            flightAccentColorId: values.flightAccentColor.id, flightAccentColor: values.flightAccentColor.color,
            flightPattern: values.flightPattern.id,
            tipLength: Number(values.tipLength.id), tipStyle: values.tipStyle.id,
            shaftLength: Number(values.shaftLength.id), shaftStyle: values.shaftStyle.id,
            ownerKey: String(owner?.id || owner?.sourceName || owner?.name || '')
        });
    }

    function getDartLoadoutForPlayer(candidate) {
        if (isCareerPlayer(candidate)) {
            const state = normalizeDartCustomization(player);
            return buildLoadout(state.selected, 'career', player);
        }
        return buildLoadout(aiSelections(candidate), 'opponent', candidate);
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

    function equipDartCustomization(category, id) {
        if (typeof player === 'undefined' || !catalogue[category]) return false;
        const state = normalizeDartCustomization(player);
        if (!state.owned[category].includes(id) || !findItem(category, id)) return false;
        state.selected[category] = id;
        notifyChange(category);
        if (typeof showShopScreen === 'function') showShopScreen();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function buyDartCustomization(category, id) {
        if (typeof player === 'undefined' || !catalogue[category]) return false;
        const state = normalizeDartCustomization(player);
        const product = findItem(category, id);
        if (!product || product.id !== id) return false;
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
        if (typeof updateHub === 'function') updateHub();
        notifyChange(category);
        if (typeof showShopScreen === 'function') showShopScreen();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }


    function previewMarkup(loadout) {
        const a = root.dartModel.normalize(loadout), d = root.dartModel.dimensions(a);
        const integrated = a.flightSystem !== 'separate', clear = a.flightSystem === 'integrated-clear';
        const r = root.dartModel.radiusAt, cut = root.dartModel.cutAt;
        const barrel = [];
        for (let z = 0; z <= 50; z += .2) barrel.push([a.tipLength + z, -(r(a.barrelShape, z) - cut(a.barrelPattern, z))]);
        for (let z = 50; z >= 0; z -= .2) barrel.push([a.tipLength + z, r(a.barrelShape, z) - cut(a.barrelPattern, z)]);
        const outline = barrel.map(p => p.join(',')).join(' ');
        const flight = root.dartModel.outlines[a.flightShape];
        const wing = flight.map(([x,z]) => `${d.flightStart + z},${-x}`).concat([...flight].reverse().map(([x,z]) => `${d.flightStart + z},${x}`)).join(' ');
        const print = document.createElement('canvas'); print.width = print.height = 128;
        root.dartModel.drawFlight(print.getContext('2d'), a, 128);
        const flightPrint = print.toDataURL();
        return `<svg class="dart-preview-fallback" viewBox="-5 -26 ${d.totalLength + 10} 52" role="img" aria-label="${escapeHtml(tr('fallback'))}">
            <defs>
                <linearGradient id="kit-metal" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".2" stop-color="#fff" stop-opacity=".1"/>
                    <stop offset=".4" stop-color="#fff" stop-opacity=".8"/><stop offset=".55" stop-color="#fff" stop-opacity=".1"/>
                    <stop offset="1" stop-color="#000" stop-opacity=".65"/>
                </linearGradient>
                <clipPath id="kit-barrel"><polygon points="${outline}"/></clipPath>
                <clipPath id="kit-flight"><polygon points="${wing}"/></clipPath>
            </defs>
            <path d="M0 0 Q5 -1 11 -1.05 H${a.tipLength} V1.05 H11 Q5 1 0 0" fill="${a.tipColor}"/>
            <polygon points="${outline}" fill="${a.barrelColor}"/>
            <g clip-path="url(#kit-barrel)" fill="${a.barrelAccentColor}">
                ${a.barrelAccentStyle === 'split' ? `<rect x="${a.tipLength}" y="-5" width="25" height="10"/>`
                    : a.barrelAccentStyle === 'bands' ? [10,35].map(z => `<rect x="${a.tipLength + z}" y="-5" width="5" height="10"/>`).join('')
                        : Array.from({length: 205}, (_,i) => i*.2+5).filter(z => cut(a.barrelPattern,z) > .16).map(z => `<rect x="${a.tipLength+z}" y="-5" width=".2" height="10"/>`).join('')}
            </g>
            <polygon points="${outline}" fill="url(#kit-metal)"/>
            <path d="M${a.tipLength+50} -2.4 L${d.flightStart} -1.2 L${integrated ? d.totalLength : a.tipLength+50+a.shaftLength} -.6 V.6 L${d.flightStart} 1.2 L${a.tipLength+50} 2.4 Z" fill="${a.shaftColor}" opacity="${clear ? .68 : 1}"/>
            <image href="${flightPrint}" x="${d.flightStart}" y="-17.5" width="42" height="35" preserveAspectRatio="none" clip-path="url(#kit-flight)"/>
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
        const selections = { ...state.selected, ...(previewSelection || {}) };
        const loadout = buildLoadout(selections, 'career', player);
        const integrated = loadout.flightSystem !== 'separate';
        document.querySelectorAll('[data-dart-category]').forEach(section => {
            const category = section.dataset.dartCategory;
            section.hidden = category === 'integratedColor' ? !integrated
                : integrated && ['shaftStyle', 'shaftColor', 'flightColor'].includes(category);
        });
        document.querySelectorAll('[data-integrated-hint]').forEach(hint => { hint.hidden = !integrated; });
        host.innerHTML = previewMarkup(loadout);
        const tried = previewSelection ? Object.entries(previewSelection).map(([category,id]) => nameOf(findItem(category,id))).join(' · ') : '';
        document.getElementById('dart-preview-status').textContent = tried ? tr('trying').replace('{item}', tried) : tr('preview');
        document.getElementById('dart-preview-reset').hidden = !tried;
        document.getElementById('dart-preview-measurements').textContent = tr('measurements').replace('{tip}', loadout.tipLength).replace('{shaft}', loadout.shaftLength)
            + (integrated ? ` · ${nameOf(findItem('flightSystem', loadout.flightSystem))}` : '');
        document.querySelectorAll('.dart-option').forEach(option => {
            const trying = previewSelection?.[option.dataset.category] === option.dataset.item;
            option.classList.toggle('trying', trying);
            option.querySelector('.dart-try-button')?.setAttribute('aria-pressed', String(trying));
        });
        root.dartPreview?.mount(host, loadout, tr('rotate'));
    }

    function previewDartCustomization(category, id) {
        const product = catalogue[category]?.find(entry => entry.id === id);
        if (!product) return false;
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
            let path = '';
            for (let x = 0; x <= 36; x += .25) path += `${x ? 'L' : 'M'}${x} ${3 + root.dartModel.cutAt(product.id, x+6, .7)*9} `;
            return `<svg class="dart-option-symbol" viewBox="0 0 36 16" aria-hidden="true"><path d="${path} L36 13 H0 Z" fill="#becad4"/></svg>`;
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
            <div class="dart-customizer-workbench">
                <div class="dart-customizer-preview">
                    <strong id="dart-preview-status" aria-live="polite">${escapeHtml(tr('preview'))}</strong>
                    <div class="dart-kit-preview" id="dart-kit-preview"></div>
                    <p id="dart-preview-measurements" class="dart-preview-measurements"></p>
                    <div class="dart-preview-toolbar"><span>${escapeHtml(tr('rotate'))}</span><button type="button" onclick="dartPreview.reset()">${escapeHtml(tr('resetView'))}</button></div>
                    <button type="button" id="dart-preview-reset" class="dart-preview-reset" onclick="resetDartCustomizationPreview()" hidden>${escapeHtml(tr('reset'))}</button>
                </div>
                <div class="dart-customizer-controls">
                    <nav class="dart-part-tabs" aria-label="${escapeHtml(tr('title'))}">${Object.keys(parts).map(part => `<button type="button" data-dart-tab="${part}" aria-pressed="${activePart === part}" onclick="selectDartCustomizationPart('${part}')">${escapeHtml(tr(part))}</button>`).join('')}</nav>`;
        Object.entries(parts).forEach(([part, categories]) => {
            html += `<div class="dart-customizer-categories" data-dart-part="${part}" ${activePart === part ? '' : 'hidden'}>`;
            if (part === 'shaft' || part === 'flights') html += `<p class="dart-integrated-hint" data-integrated-hint hidden>${escapeHtml(tr('integratedHint'))}</p>`;
            categories.forEach(category => {
                html += `<section class="dart-customizer-category" data-dart-category="${category}"><h5>${escapeHtml(tr(category))}</h5><div class="dart-customizer-options">`;
                catalogue[category].forEach(product => {
                    const selected = state.selected[category] === product.id;
                    const owned = state.owned[category].includes(product.id);
                    const action = selected ? '' : owned
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
    root.normalizeDartCustomization = normalizeDartCustomization;
    root.getDartLoadoutForPlayer = getDartLoadoutForPlayer;
    root.getMatchDartLoadout = getMatchDartLoadout;
    root.buyDartCustomization = buyDartCustomization;
    root.equipDartCustomization = equipDartCustomization;
    root.renderDartCustomizationShop = renderDartCustomizationShop;
    root.previewDartCustomization = previewDartCustomization;
    root.resetDartCustomizationPreview = resetDartCustomizationPreview;
    root.selectDartCustomizationPart = selectDartCustomizationPart;
})(typeof window !== 'undefined' ? window : globalThis);
