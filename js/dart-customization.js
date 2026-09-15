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
            barrelPattern: 'Wzór barrela'
        },
        en: {
            title: 'Dart customisation', subtitle: 'Build your own set. Its appearance does not change accuracy or attributes.',
            preview: 'Current set', owned: 'Equip', selected: 'Selected', buy: 'Buy',
            noFunds: 'You do not have enough money.', confirm: 'Buy “{item}” for £{price}?',
            purchased: 'Purchased and equipped: {item}.', shaftColor: 'Shaft colour', flightColor: 'Flight colour',
            barrelColor: 'Barrel colour', tipColor: 'Point colour', barrelShape: 'Barrel shape',
            flightShape: 'Flight shape', barrelPattern: 'Barrel pattern'
        },
        de: {
            title: 'Dart-Anpassung', subtitle: 'Stelle dein eigenes Set zusammen. Das Aussehen ändert weder Präzision noch Werte.',
            preview: 'Aktuelles Set', owned: 'Ausrüsten', selected: 'Ausgewählt', buy: 'Kaufen',
            noFunds: 'Du hast nicht genug Geld.', confirm: '„{item}“ für £{price} kaufen?',
            purchased: 'Gekauft und ausgerüstet: {item}.', shaftColor: 'Schaftfarbe', flightColor: 'Flight-Farbe',
            barrelColor: 'Barrel-Farbe', tipColor: 'Spitzenfarbe', barrelShape: 'Barrel-Form',
            flightShape: 'Flight-Form', barrelPattern: 'Barrel-Muster'
        },
        nl: {
            title: 'Darts personaliseren', subtitle: 'Stel je eigen set samen. Het uiterlijk verandert de nauwkeurigheid of eigenschappen niet.',
            preview: 'Huidige set', owned: 'Gebruiken', selected: 'Geselecteerd', buy: 'Kopen',
            noFunds: 'Je hebt niet genoeg geld.', confirm: '„{item}” kopen voor £{price}?',
            purchased: 'Gekocht en geselecteerd: {item}.', shaftColor: 'Shaftkleur', flightColor: 'Flightkleur',
            barrelColor: 'Barrelkleur', tipColor: 'Puntkleur', barrelShape: 'Barrelvorm',
            flightShape: 'Flightvorm', barrelPattern: 'Barrelpatroon'
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
            item('gold', 650, '#c99516', ['Złoty', 'Gold', 'Gold', 'Goud'])
        ]),
        flightColor: Object.freeze([
            item('career-gold', 0, '#f1c40f', ['Career Gold', 'Career Gold', 'Career Gold', 'Career Gold']),
            item('signal-red', 180, '#d71936', ['Czerwień sygnałowa', 'Signal red', 'Signalrot', 'Signaalrood']),
            item('ice-blue', 180, '#28a9e0', ['Lodowy błękit', 'Ice blue', 'Eisblau', 'IJsblauw']),
            item('snow', 200, '#f4f6f7', ['Śnieżny', 'Snow', 'Schneeweiß', 'Sneeuwwit']),
            item('lime', 260, '#75c900', ['Limonkowy', 'Lime', 'Limette', 'Limoen']),
            item('hot-pink', 300, '#e84393', ['Różowy', 'Hot pink', 'Pink', 'Felroze']),
            item('blackout', 340, '#15181d', ['Blackout', 'Blackout', 'Blackout', 'Blackout']),
            item('amber', 380, '#ff8f00', ['Bursztynowy', 'Amber', 'Bernstein', 'Amber'])
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
            item('scallop', 820, null, ['Scallop', 'Scallop', 'Scallop', 'Scallop'])
        ]),
        flightShape: Object.freeze([
            item('standard', 0, null, ['Standard', 'Standard', 'Standard', 'Standaard']),
            item('kite', 340, null, ['Kite', 'Kite', 'Kite', 'Kite']),
            item('pear', 420, null, ['Gruszka', 'Pear', 'Birne', 'Peer'])
        ]),
        barrelPattern: Object.freeze([
            item('rings', 0, null, ['Klasyczne ringi', 'Classic rings', 'Klassische Ringe', 'Klassieke ringen']),
            item('micro', 460, null, ['Micro grip', 'Micro grip', 'Micro-Grip', 'Microgrip']),
            item('shark', 580, null, ['Shark grip', 'Shark grip', 'Shark-Grip', 'Sharkgrip']),
            item('smooth', 260, null, ['Gładki', 'Smooth', 'Glatt', 'Glad'])
        ])
    });
    const categoryKeys = Object.freeze(Object.keys(catalogue));
    const defaults = Object.freeze(Object.fromEntries(categoryKeys.map(key => [key, catalogue[key][0].id])));

    function languageIndex() {
        return { pl: 0, en: 1, de: 2, nl: 3 }[typeof currentLang === 'string' ? currentLang : 'pl'] ?? 0;
    }
    function tr(key) {
        const lang = typeof currentLang === 'string' && text[currentLang] ? currentLang : 'pl';
        return text[lang][key] || text.pl[key] || key;
    }
    function nameOf(entry) { return entry.names[languageIndex()] || entry.names[0]; }
    function findItem(category, id) { return catalogue[category]?.find(entry => entry.id === id) || catalogue[category]?.[0]; }
    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
    }

    function normalizeDartCustomization(candidate) {
        if (!candidate || typeof candidate !== 'object') return null;
        const previous = candidate.dartCustomization && typeof candidate.dartCustomization === 'object'
            ? candidate.dartCustomization : {};
        const selected = previous.selected && typeof previous.selected === 'object' ? previous.selected : {};
        const owned = previous.owned && typeof previous.owned === 'object' ? previous.owned : {};
        const normalized = { version: 1, selected: {}, owned: {} };
        categoryKeys.forEach(category => {
            const validIds = new Set(catalogue[category].map(entry => entry.id));
            const collection = Array.isArray(owned[category]) ? owned[category].filter(id => validIds.has(id)) : [];
            normalized.owned[category] = [...new Set([defaults[category], ...collection])];
            const choice = validIds.has(selected[category]) && normalized.owned[category].includes(selected[category])
                ? selected[category] : defaults[category];
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
        const accentChoices = ['#111820', '#f4f6f7', '#f1c40f', '#d71936'];
        const accentIndex = hashIdentity(owner) % accentChoices.length;
        return Object.freeze({
            source,
            shaftColorId: values.shaftColor.id, shaftColor: values.shaftColor.color,
            flightColorId: values.flightColor.id, flightColor: values.flightColor.color,
            barrelColorId: values.barrelColor.id, barrelColor: values.barrelColor.color,
            tipColorId: values.tipColor.id, tipColor: values.tipColor.color,
            barrelShape: values.barrelShape.id, flightShape: values.flightShape.id,
            barrelPattern: values.barrelPattern.id, patternAccent: accentChoices[accentIndex],
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

    function notifyChange() {
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
        notifyChange();
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
        notifyChange();
        if (typeof showShopScreen === 'function') showShopScreen();
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }

    function previewMarkup(loadout) {
        const style = `--dart-tip:${loadout.tipColor};--dart-barrel:${loadout.barrelColor};--dart-shaft:${loadout.shaftColor};--dart-flight:${loadout.flightColor};--dart-accent:${loadout.patternAccent}`;
        return `<div class="dart-kit-preview" style="${style}" aria-hidden="true">
            <span class="dart-preview-point"></span>
            <span class="dart-preview-barrel barrel-${escapeHtml(loadout.barrelShape)} pattern-${escapeHtml(loadout.barrelPattern)}"></span>
            <span class="dart-preview-shaft"></span>
            <span class="dart-preview-flight flight-${escapeHtml(loadout.flightShape)}"><i></i></span>
        </div>`;
    }

    function renderDartCustomizationShop(container = null) {
        if (typeof document === 'undefined' || typeof player === 'undefined') return false;
        const host = typeof container === 'string' ? document.getElementById(container) : container;
        if (!host) return false;
        const state = normalizeDartCustomization(player);
        const loadout = buildLoadout(state.selected, 'career', player);
        let html = `<section class="dart-customizer" id="dart-customizer">
            <header class="dart-customizer-header"><div><h4>${escapeHtml(tr('title'))}</h4><p>${escapeHtml(tr('subtitle'))}</p></div>
            <div class="dart-customizer-preview"><strong>${escapeHtml(tr('preview'))}</strong>${previewMarkup(loadout)}</div></header>
            <div class="dart-customizer-categories">`;
        categoryKeys.forEach(category => {
            html += `<section class="dart-customizer-category"><h5>${escapeHtml(tr(category))}</h5><div class="dart-customizer-options">`;
            catalogue[category].forEach(product => {
                const selected = state.selected[category] === product.id;
                const owned = state.owned[category].includes(product.id);
                const color = product.color ? `<i class="dart-option-swatch" style="--swatch:${product.color}"></i>` : '';
                const action = selected ? '' : owned
                    ? `onclick="equipDartCustomization('${category}','${product.id}')"`
                    : `onclick="buyDartCustomization('${category}','${product.id}')"`;
                const label = selected ? tr('selected') : owned ? tr('owned')
                    : `${tr('buy')} £${product.price.toLocaleString('en-GB')}`;
                html += `<article class="dart-option${selected ? ' selected' : ''}">${color}<span>${escapeHtml(nameOf(product))}</span>
                    <button type="button" ${action} ${selected ? 'disabled' : ''}>${escapeHtml(label)}</button></article>`;
            });
            html += '</div></section>';
        });
        html += '</div></section>';
        host.insertAdjacentHTML('beforeend', html);
        return true;
    }

    root.dartCustomizationCatalogue = catalogue;
    root.normalizeDartCustomization = normalizeDartCustomization;
    root.getDartLoadoutForPlayer = getDartLoadoutForPlayer;
    root.getMatchDartLoadout = getMatchDartLoadout;
    root.buyDartCustomization = buyDartCustomization;
    root.equipDartCustomization = equipDartCustomization;
    root.renderDartCustomizationShop = renderDartCustomizationShop;
})(typeof window !== 'undefined' ? window : globalThis);
