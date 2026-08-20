let playerLifecycleState = {
    lastProcessedYear: null,
    retiredPlayerKeys: []
};

const PLAYER_LIFECYCLE_TRANSLATIONS = {
    pl: {
        sender: 'Federacja Darta', subject: 'Koniec sezonu {year} — emerytury zawodników',
        bodySingle: 'Po sezonie {year} zawodową karierę zakończył następujący zawodnik:<br><br>{retirements}',
        bodyPlural: 'Po sezonie {year} zawodową karierę zakończyli następujący zawodnicy:<br><br>{retirements}',
        retirementRow: '<strong>{name}</strong> ({country}) · miejsce w OOM: <strong>#{rank}</strong> · wiek: <strong>{age}</strong>'
    },
    en: {
        sender: 'Darts Federation', subject: 'End of the {year} season — player retirements',
        bodySingle: 'After the {year} season, the following player retired from professional darts:<br><br>{retirements}',
        bodyPlural: 'After the {year} season, the following players retired from professional darts:<br><br>{retirements}',
        retirementRow: '<strong>{name}</strong> ({country}) · OOM rank: <strong>#{rank}</strong> · age: <strong>{age}</strong>'
    },
    de: {
        sender: 'Dartsverband', subject: 'Ende der Saison {year} — Rücktritte',
        bodySingle: 'Nach der Saison {year} beendete der folgende Spieler seine Profikarriere:<br><br>{retirements}',
        bodyPlural: 'Nach der Saison {year} beendeten die folgenden Spieler ihre Profikarriere:<br><br>{retirements}',
        retirementRow: '<strong>{name}</strong> ({country}) · OOM-Rang: <strong>#{rank}</strong> · Alter: <strong>{age}</strong>'
    },
    nl: {
        sender: 'Dartsfederatie', subject: 'Einde seizoen {year} — spelers met pensioen',
        bodySingle: 'Na het seizoen {year} heeft de volgende speler zijn professionele carrière beëindigd:<br><br>{retirements}',
        bodyPlural: 'Na het seizoen {year} hebben de volgende spelers hun professionele carrière beëindigd:<br><br>{retirements}',
        retirementRow: '<strong>{name}</strong> ({country}) · OOM-positie: <strong>#{rank}</strong> · leeftijd: <strong>{age}</strong>'
    }
};

const NEWGEN_DARTS_HEARTLANDS = [
    { country: 'Anglia', weight: 24 }, { country: 'Niemcy', weight: 18 }, { country: 'Holandia', weight: 15 },
    { country: 'Szkocja', weight: 12 }, { country: 'Walia', weight: 10 }, { country: 'Irlandia Północna', weight: 10 },
    { country: 'Irlandia', weight: 11 }
];

const NEWGEN_FIRST_NAMES = [
    'Alden', 'Branik', 'Cyran', 'Daven', 'Eryk', 'Faron', 'Galen', 'Hendrik', 'Ivar', 'Joren', 'Kael', 'Luken',
    'Marek', 'Neron', 'Oren', 'Pavel', 'Quinn', 'Riven', 'Soren', 'Taren', 'Ulric', 'Varek', 'Wylan', 'Zorin'
];

const NEWGEN_LAST_NAMES = [
    'Ashmere', 'Barkett', 'Caldren', 'Dovrin', 'Eldmark', 'Fennor', 'Gravik', 'Haldane', 'Ironwood', 'Jaspert',
    'Kendric', 'Lornel', 'Marlowe', 'Norrick', 'Orvane', 'Pellor', 'Quenby', 'Ravell', 'Seldric', 'Tolland',
    'Ulmere', 'Vandor', 'Westin', 'Yarwick', 'Zandell'
];

function trPlayerLifecycle(key, values = {}) {
    const language = typeof currentLang === 'string' && PLAYER_LIFECYCLE_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = PLAYER_LIFECYCLE_TRANSLATIONS[language][key] || PLAYER_LIFECYCLE_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function ensurePlayerLifecycleState() {
    if (!playerLifecycleState || typeof playerLifecycleState !== 'object') {
        playerLifecycleState = { lastProcessedYear: null, retiredPlayerKeys: [] };
    }
    if (!Array.isArray(playerLifecycleState.retiredPlayerKeys)) playerLifecycleState.retiredPlayerKeys = [];
    if (!Number.isInteger(playerLifecycleState.lastProcessedYear)) playerLifecycleState.lastProcessedYear = null;
    return playerLifecycleState;
}

function restorePlayerLifecycleState(savedState) {
    playerLifecycleState = {
        lastProcessedYear: Number.isInteger(savedState?.lastProcessedYear) ? savedState.lastProcessedYear : null,
        retiredPlayerKeys: Array.isArray(savedState?.retiredPlayerKeys) ? [...new Set(savedState.retiredPlayerKeys)] : []
    };
    return ensurePlayerLifecycleState();
}

function getLifecyclePlayerKey(candidate) {
    return `${candidate?.name || ''}|${candidate?.country || ''}`;
}

function getRetirementChance(age) {
    if (!Number.isInteger(age) || age < 45) return 0;
    return Math.min(100, (age - 44) * 5);
}

function getAnnualDecline(age) {
    if (!Number.isInteger(age) || age <= 45) return 0;
    return 1 + Math.floor((age - 46) / 3);
}

function getPlayerLifecycleRankings() {
    const ranked = [...(Array.isArray(pdcPlayers) ? pdcPlayers : []), player]
        .filter(candidate => candidate && !candidate.isBye)
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
    return new Map(ranked.map((candidate, index) => [candidate.id || getLifecyclePlayerKey(candidate), index + 1]));
}

function applyAnnualAgeDecline(candidate, age) {
    const decline = getAnnualDecline(age);
    if (!decline) return 0;

    const clampRating = value => Math.max(40, Math.min(99, Math.round(value)));
    const baseOvr = Number(candidate.baseOvr ?? candidate.ovr ?? candidate.overall) || 55;
    const baseScoring = Number(candidate.baseScoring ?? candidate.scoring) || baseOvr;
    const baseDoubles = Number(candidate.baseDoubles ?? candidate.doubles) || baseOvr;
    candidate.baseOvr = clampRating(baseOvr - decline);
    candidate.baseScoring = clampRating(baseScoring - decline);
    candidate.baseDoubles = clampRating(baseDoubles - decline);
    candidate.form = Number.isFinite(Number(candidate.form)) ? Number(candidate.form) : 0;

    if (typeof applyForm === 'function') {
        applyForm(candidate);
    } else {
        candidate.ovr = candidate.baseOvr + candidate.form;
        candidate.scoring = candidate.baseScoring + candidate.form;
        candidate.doubles = candidate.baseDoubles + candidate.form;
    }
    candidate.ovr = clampRating(candidate.ovr);
    candidate.scoring = clampRating(candidate.scoring);
    candidate.doubles = clampRating(candidate.doubles);
    candidate.overall = candidate.ovr;
    return decline;
}

function pickWeightedNewgenCountry() {
    const totalWeight = NEWGEN_DARTS_HEARTLANDS.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of NEWGEN_DARTS_HEARTLANDS) {
        roll -= entry.weight;
        if (roll <= 0) return entry.country;
    }
    return NEWGEN_DARTS_HEARTLANDS[0].country;
}

function pickNewgenCountry() {
    if (Math.random() < 0.7) return pickWeightedNewgenCountry();
    const globalCountries = (typeof countries !== 'undefined' ? countries : [])
        .filter(country => country && !NEWGEN_DARTS_HEARTLANDS.some(entry => entry.country === country));
    return globalCountries.length ? globalCountries[Math.floor(Math.random() * globalCountries.length)] : pickWeightedNewgenCountry();
}

function createFictionalNewgenName(existingNames) {
    for (let attempt = 0; attempt < 100; attempt++) {
        const first = NEWGEN_FIRST_NAMES[Math.floor(Math.random() * NEWGEN_FIRST_NAMES.length)];
        const last = NEWGEN_LAST_NAMES[Math.floor(Math.random() * NEWGEN_LAST_NAMES.length)];
        const name = `${first} ${last}`;
        if (!existingNames.has(name)) return name;
    }
    const first = NEWGEN_FIRST_NAMES[Math.floor(Math.random() * NEWGEN_FIRST_NAMES.length)];
    const last = NEWGEN_LAST_NAMES[Math.floor(Math.random() * NEWGEN_LAST_NAMES.length)];
    let suffix = 2;
    while (existingNames.has(`${first} ${last} ${suffix}`)) suffix++;
    return `${first} ${last} ${suffix}`;
}

function getNewgenStartingOverall() {
    const roll = Math.random();
    if (roll < 0.05) return 70 + Math.floor(Math.random() * 5);
    if (roll < 0.28) return 64 + Math.floor(Math.random() * 6);
    if (roll < 0.72) return 57 + Math.floor(Math.random() * 7);
    return 52 + Math.floor(Math.random() * 5);
}

function createAnnualNewgen(year, existingNames) {
    const overall = getNewgenStartingOverall();
    const age = 17 + Math.floor(Math.random() * 6);
    const scoring = Math.max(40, Math.min(99, overall + (Math.floor(Math.random() * 5) - 1)));
    const doubles = Math.max(40, Math.min(99, overall + (Math.floor(Math.random() * 5) - 3)));
    const name = createFictionalNewgenName(existingNames);
    existingNames.add(name);
    return {
        id: createEntityId('newgen'),
        name,
        country: pickNewgenCountry(),
        birthYear: year - age,
        overall,
        ovr: overall,
        scoring,
        doubles,
        favoriteDouble: [16, 20, 18, 12, 8][Math.floor(Math.random() * 5)],
        prizeMoney: 0,
        proTourPrizeMoney: 0,
        pcPrizeMoney: 0,
        baseOvr: overall,
        baseScoring: scoring,
        baseDoubles: doubles,
        form: 0,
        historyPT: {},
        historyMain: {},
        seasonStats: { year, highestAvg: 0, results: [] },
        isNewgen: true,
        joinedSeason: year
    };
}

function getLifecycleCountryName(country) {
    if (typeof getWorldCupCountryName === 'function') return getWorldCupCountryName(country);
    return typeof t === 'function' ? t(country) : country;
}

function sendRetirementSummaryEmail(completedYear, retirements) {
    if (!retirements.length || typeof addEmail !== 'function') return;
    const rows = retirements.map(retirement => trPlayerLifecycle('retirementRow', {
        name: escapeHtml(retirement.name),
        country: escapeHtml(getLifecycleCountryName(retirement.country)),
        rank: retirement.rank || '—',
        age: retirement.age
    })).join('<br>');
    const bodyKey = retirements.length === 1 ? 'bodySingle' : 'bodyPlural';
    addEmail(
        trPlayerLifecycle('sender'),
        trPlayerLifecycle('subject', { year: completedYear }),
        trPlayerLifecycle(bodyKey, { year: completedYear, retirements: rows })
    );
}

function processAnnualPlayerLifecycle(completedYear) {
    const state = ensurePlayerLifecycleState();
    if (!Number.isInteger(completedYear) || state.lastProcessedYear === completedYear || !Array.isArray(pdcPlayers)) {
        return { retirements: [], newgens: [] };
    }

    const newSeasonYear = completedYear + 1;
    const rankingByPlayer = getPlayerLifecycleRankings();
    const retirements = [];
    const retiredIds = new Set();
    const survivingPlayers = [];

    pdcPlayers.forEach(candidate => {
        if (!candidate || candidate.isBye) return;
        const age = Number.isInteger(candidate.birthYear) ? newSeasonYear - candidate.birthYear : null;
        if (age !== null && Math.random() * 100 < getRetirementChance(age)) {
            retirements.push({
                id: candidate.id,
                name: candidate.name,
                country: candidate.country,
                age,
                rank: rankingByPlayer.get(candidate.id || getLifecyclePlayerKey(candidate)) || null
            });
            retiredIds.add(candidate.id);
            const key = getLifecyclePlayerKey(candidate);
            if (!state.retiredPlayerKeys.includes(key)) state.retiredPlayerKeys.push(key);
            return;
        }
        if (age !== null) applyAnnualAgeDecline(candidate, age);
        survivingPlayers.push(candidate);
    });

    pdcPlayers.splice(0, pdcPlayers.length, ...survivingPlayers);
    if (player && Array.isArray(player.activeRivalIds) && retiredIds.size) {
        player.activeRivalIds = player.activeRivalIds.filter(id => !retiredIds.has(id));
    }

    const newgenCount = Math.max(2 + Math.floor(Math.random() * 3), retirements.length);
    const existingNames = new Set([...pdcPlayers, player].filter(Boolean).map(candidate => candidate.name));
    const newgens = Array.from({ length: newgenCount }, () => createAnnualNewgen(newSeasonYear, existingNames));
    pdcPlayers.push(...newgens);

    state.lastProcessedYear = completedYear;
    sendRetirementSummaryEmail(completedYear, retirements);
    if (typeof renderOpponentOptions === 'function') renderOpponentOptions();
    return { retirements, newgens };
}
