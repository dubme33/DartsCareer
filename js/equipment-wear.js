// Training equipment is purchased tier by tier and loses one tier after every
// full year of use. The numeric player.equipment fields remain the source of
// the active training bonus so older saves and training calculations stay compatible.
const PLAYER_EQUIPMENT_CATEGORIES = Object.freeze(['board', 'surround', 'light']);
const PLAYER_EQUIPMENT_MAX_TIER = 5;

const EQUIPMENT_WEAR_TEXT = Object.freeze({
    pl: Object.freeze({
        rule: 'Każdą kategorię rozwijasz kolejno od Tier 1. Po roku od ostatniego zakupu sprzęt traci jeden tier, a ulepszenie uruchamia nowy roczny okres użytkowania.',
        noEquipment: 'Brak sprzętu',
        currentTier: 'Aktualnie: Tier {tier}',
        nextWear: 'Spadek do Tier {tier}: {date}',
        wearsOut: 'Zużycie do Tier 0: {date}',
        inUse: 'Używane',
        reached: 'Osiągnięto',
        buy: 'Kup za {price}',
        locked: 'Najpierw Tier {tier}',
        sequenceAlert: 'Sprzęt trzeba kupować kolejno. Najpierw odblokuj Tier {tier}.',
        sender: 'Serwis bazy treningowej',
        mailSubject: 'Sprzęt treningowy stracił poziom',
        mailIntro: 'Roczny okres użytkowania dobiegł końca. Zużycie obniżyło jakość sprzętu:',
        mailLine: '{category}: Tier {from} → Tier {to}',
        mailHint: 'Możesz ponownie kupić utracony tier w sklepie. Nowy zakup uruchomi kolejny rok użytkowania.',
        board: 'Tarcza', surround: 'Opona', light: 'Oświetlenie'
    }),
    en: Object.freeze({
        rule: 'Each category must be upgraded in order from Tier 1. One year after the latest purchase, equipment loses one tier; an upgrade starts a new one-year service period.',
        noEquipment: 'No equipment',
        currentTier: 'Current: Tier {tier}',
        nextWear: 'Drops to Tier {tier}: {date}',
        wearsOut: 'Wears out to Tier 0: {date}',
        inUse: 'In use',
        reached: 'Reached',
        buy: 'Buy for {price}',
        locked: 'Tier {tier} first',
        sequenceAlert: 'Equipment must be bought in order. Unlock Tier {tier} first.',
        sender: 'Training Base Service',
        mailSubject: 'Training equipment lost a tier',
        mailIntro: 'A full year of use has passed. Wear reduced the quality of your equipment:',
        mailLine: '{category}: Tier {from} → Tier {to}',
        mailHint: 'You can buy the lost tier again in the shop. A new purchase starts another year of use.',
        board: 'Board', surround: 'Surround', light: 'Lighting'
    }),
    de: Object.freeze({
        rule: 'Jede Kategorie wird der Reihe nach ab Tier 1 ausgebaut. Ein Jahr nach dem letzten Kauf verliert die Ausrüstung einen Tier; ein Upgrade startet eine neue einjährige Nutzungszeit.',
        noEquipment: 'Keine Ausrüstung',
        currentTier: 'Aktuell: Tier {tier}',
        nextWear: 'Fällt auf Tier {tier}: {date}',
        wearsOut: 'Verschleißt auf Tier 0: {date}',
        inUse: 'In Gebrauch',
        reached: 'Erreicht',
        buy: 'Kaufen für {price}',
        locked: 'Zuerst Tier {tier}',
        sequenceAlert: 'Ausrüstung muss der Reihe nach gekauft werden. Schalte zuerst Tier {tier} frei.',
        sender: 'Service der Trainingsbasis',
        mailSubject: 'Trainingsausrüstung hat einen Tier verloren',
        mailIntro: 'Ein volles Nutzungsjahr ist vorbei. Verschleiß hat die Qualität deiner Ausrüstung gesenkt:',
        mailLine: '{category}: Tier {from} → Tier {to}',
        mailHint: 'Du kannst den verlorenen Tier erneut im Shop kaufen. Ein neuer Kauf startet ein weiteres Nutzungsjahr.',
        board: 'Dartscheibe', surround: 'Schutzring', light: 'Beleuchtung'
    }),
    nl: Object.freeze({
        rule: 'Elke categorie moet op volgorde vanaf Tier 1 worden verbeterd. Een jaar na de laatste aankoop verliest materiaal één tier; een upgrade start een nieuwe gebruiksperiode van een jaar.',
        noEquipment: 'Geen materiaal',
        currentTier: 'Huidig: Tier {tier}',
        nextWear: 'Daalt naar Tier {tier}: {date}',
        wearsOut: 'Slijt naar Tier 0: {date}',
        inUse: 'In gebruik',
        reached: 'Bereikt',
        buy: 'Koop voor {price}',
        locked: 'Eerst Tier {tier}',
        sequenceAlert: 'Materiaal moet op volgorde worden gekocht. Ontgrendel eerst Tier {tier}.',
        sender: 'Service trainingsbasis',
        mailSubject: 'Trainingsmateriaal verloor een tier',
        mailIntro: 'Een volledig gebruiksjaar is voorbij. Slijtage heeft de kwaliteit van je materiaal verlaagd:',
        mailLine: '{category}: Tier {from} → Tier {to}',
        mailHint: 'Je kunt de verloren tier opnieuw in de winkel kopen. Een nieuwe aankoop start een nieuw gebruiksjaar.',
        board: 'Dartbord', surround: 'Beschermring', light: 'Verlichting'
    })
});

function trEquipmentWear(key, params = {}) {
    const lang = typeof currentLang === 'string' && EQUIPMENT_WEAR_TEXT[currentLang] ? currentLang : 'en';
    const template = EQUIPMENT_WEAR_TEXT[lang][key] ?? EQUIPMENT_WEAR_TEXT.en[key] ?? key;
    return String(template).replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match);
}

function getPlayerEquipmentCurrentDate() {
    return typeof currentDate !== 'undefined' && currentDate instanceof Date && !Number.isNaN(currentDate.getTime())
        ? new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
        : new Date();
}

function parsePlayerEquipmentDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }
    const match = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1
        || date.getDate() !== Number(match[3])) return null;
    return date;
}

function getPlayerEquipmentDateKey(value) {
    const date = parsePlayerEquipmentDate(arguments.length === 0 ? getPlayerEquipmentCurrentDate() : value);
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addPlayerEquipmentYear(value) {
    const date = parsePlayerEquipmentDate(value);
    if (!date) return '';
    const nextYear = date.getFullYear() + 1;
    const month = date.getMonth();
    const lastDay = new Date(nextYear, month + 1, 0).getDate();
    return getPlayerEquipmentDateKey(new Date(nextYear, month, Math.min(date.getDate(), lastDay)));
}

function normalizePlayerEquipmentTier(value) {
    const tier = Number(value);
    return Number.isFinite(tier) ? Math.max(0, Math.min(PLAYER_EQUIPMENT_MAX_TIER, Math.floor(tier))) : 0;
}

function initializePlayerEquipmentWear(reset = false, candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate) return null;
    const todayKey = getPlayerEquipmentDateKey();
    const previous = !reset && candidate.equipmentWear && typeof candidate.equipmentWear === 'object'
        ? candidate.equipmentWear
        : {};

    const equipment = !reset && candidate.equipment && typeof candidate.equipment === 'object'
        ? candidate.equipment
        : {};
    candidate.equipment = equipment;
    const normalized = { version: 1 };

    PLAYER_EQUIPMENT_CATEGORIES.forEach(category => {
        const tier = reset ? 0 : normalizePlayerEquipmentTier(equipment[category]);
        equipment[category] = tier;
        const saved = !reset && previous[category] && typeof previous[category] === 'object'
            ? previous[category]
            : {};
        if (tier === 0) {
            normalized[category] = { lastPurchaseOn: '', lastWearOn: '', nextWearOn: '' };
            return;
        }

        const lastPurchaseOn = getPlayerEquipmentDateKey(saved.lastPurchaseOn) || todayKey;
        normalized[category] = {
            lastPurchaseOn,
            lastWearOn: getPlayerEquipmentDateKey(saved.lastWearOn),
            // Older careers keep their current tier and receive a full year before
            // the first wear event instead of being downgraded during migration.
            nextWearOn: getPlayerEquipmentDateKey(saved.nextWearOn) || addPlayerEquipmentYear(todayKey)
        };
    });

    if (!reset && previous === candidate.equipmentWear) Object.assign(previous, normalized);
    else candidate.equipmentWear = normalized;
    return candidate.equipmentWear;
}

function restorePlayerEquipmentWear() {
    return initializePlayerEquipmentWear(false);
}

function getPlayerEquipmentLevel(category, candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate || !PLAYER_EQUIPMENT_CATEGORIES.includes(category)) return 0;
    return normalizePlayerEquipmentTier(candidate.equipment?.[category]);
}

function getPlayerEquipmentNextWearOn(category, candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate || !PLAYER_EQUIPMENT_CATEGORIES.includes(category)) return '';
    const state = initializePlayerEquipmentWear(false, candidate);
    return state?.[category]?.nextWearOn || '';
}

function canPurchasePlayerEquipmentTier(category, tier, candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate || !PLAYER_EQUIPMENT_CATEGORIES.includes(category)) return false;
    const requestedTier = Number(tier);
    if (!Number.isInteger(requestedTier) || requestedTier < 1 || requestedTier > PLAYER_EQUIPMENT_MAX_TIER) return false;
    return requestedTier === getPlayerEquipmentLevel(category, candidate) + 1;
}

function recordPlayerEquipmentPurchase(category, tier, candidate = typeof player !== 'undefined' ? player : null) {
    if (!canPurchasePlayerEquipmentTier(category, tier, candidate)) return false;
    const state = initializePlayerEquipmentWear(false, candidate);
    const purchaseOn = getPlayerEquipmentDateKey();
    candidate.equipment[category] = normalizePlayerEquipmentTier(tier);
    state[category] = {
        lastPurchaseOn: purchaseOn,
        lastWearOn: '',
        nextWearOn: addPlayerEquipmentYear(purchaseOn)
    };
    return true;
}

function notifyPlayerEquipmentWear(changes) {
    if (!Array.isArray(changes) || changes.length === 0 || typeof addEmail !== 'function') return;
    const safe = typeof escapeHtml === 'function' ? escapeHtml : value => String(value);
    const lines = changes.map(change => `<li>${safe(trEquipmentWear('mailLine', {
        category: trEquipmentWear(change.category), from: change.fromTier, to: change.toTier
    }))}</li>`).join('');
    const body = `<p>${safe(trEquipmentWear('mailIntro'))}</p><ul>${lines}</ul><p>${safe(trEquipmentWear('mailHint'))}</p>`;
    addEmail(trEquipmentWear('sender'), trEquipmentWear('mailSubject'), body);
}

function processPlayerEquipmentWear(value = getPlayerEquipmentCurrentDate(), candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate) return { changed: false, changes: [] };
    const today = parsePlayerEquipmentDate(value);
    if (!today) return { changed: false, changes: [] };
    const state = initializePlayerEquipmentWear(false, candidate);
    const changes = [];

    PLAYER_EQUIPMENT_CATEGORIES.forEach(category => {
        let tier = getPlayerEquipmentLevel(category, candidate);
        let nextWearOn = state[category].nextWearOn;
        let due = parsePlayerEquipmentDate(nextWearOn);
        while (tier > 0 && due && due.getTime() <= today.getTime()) {
            const fromTier = tier;
            tier -= 1;
            candidate.equipment[category] = tier;
            state[category].lastWearOn = nextWearOn;
            state[category].nextWearOn = tier > 0 ? addPlayerEquipmentYear(nextWearOn) : '';
            changes.push({ category, fromTier, toTier: tier, wornOn: nextWearOn });
            nextWearOn = state[category].nextWearOn;
            due = parsePlayerEquipmentDate(nextWearOn);
        }
    });

    if (changes.length > 0 && candidate === (typeof player !== 'undefined' ? player : null)) {
        notifyPlayerEquipmentWear(changes);
    }
    return { changed: changes.length > 0, changes };
}

function formatPlayerEquipmentWearDate(value) {
    const date = parsePlayerEquipmentDate(value);
    if (!date) return '';
    const locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[
        typeof currentLang === 'string' ? currentLang : 'en'
    ] || 'en-GB';
    return date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}
