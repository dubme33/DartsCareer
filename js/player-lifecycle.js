let playerLifecycleState = {
    lastProcessedYear: null,
    retiredPlayerKeys: [],
    retiredPlayerNames: [],
    retiredPlayerIds: [],
    retiredTemplateIndexes: []
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

const NEWGEN_FEMALE_FIRST_NAMES = [
    'Ayla', 'Brina', 'Celia', 'Daria', 'Elara', 'Freya', 'Greta', 'Helena', 'Iona', 'Juna', 'Kira', 'Livia',
    'Mara', 'Nadia', 'Orla', 'Petra', 'Rina', 'Selma', 'Talia', 'Vera', 'Willa', 'Zara'
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
        playerLifecycleState = { lastProcessedYear: null, retiredPlayerKeys: [], retiredPlayerNames: [], retiredPlayerIds: [], retiredTemplateIndexes: [] };
    }
    if (!Array.isArray(playerLifecycleState.retiredPlayerKeys)) playerLifecycleState.retiredPlayerKeys = [];
    if (!Array.isArray(playerLifecycleState.retiredPlayerNames)) {
        playerLifecycleState.retiredPlayerNames = playerLifecycleState.retiredPlayerKeys
            .map(key => getLifecyclePlayerNameKey(String(key).split('|')[0]))
            .filter(Boolean);
    }
    playerLifecycleState.retiredPlayerNames = [...new Set(playerLifecycleState.retiredPlayerNames
        .map(getLifecyclePlayerNameKey)
        .filter(Boolean))];
    if (!Array.isArray(playerLifecycleState.retiredPlayerIds)) playerLifecycleState.retiredPlayerIds = [];
    playerLifecycleState.retiredPlayerIds = [...new Set(playerLifecycleState.retiredPlayerIds
        .filter(id => typeof id === 'string' && id.trim()))];
    if (!Array.isArray(playerLifecycleState.retiredTemplateIndexes)) playerLifecycleState.retiredTemplateIndexes = [];
    playerLifecycleState.retiredTemplateIndexes = [...new Set(playerLifecycleState.retiredTemplateIndexes
        .map(Number)
        .filter(index => Number.isInteger(index) && index >= 0))];
    if (!Number.isInteger(playerLifecycleState.lastProcessedYear)) playerLifecycleState.lastProcessedYear = null;
    hydrateRetiredTemplateIndexes(playerLifecycleState);
    return playerLifecycleState;
}

function restorePlayerLifecycleState(savedState) {
    playerLifecycleState = {
        lastProcessedYear: Number.isInteger(savedState?.lastProcessedYear) ? savedState.lastProcessedYear : null,
        retiredPlayerKeys: Array.isArray(savedState?.retiredPlayerKeys) ? [...new Set(savedState.retiredPlayerKeys)] : [],
        retiredPlayerNames: Array.isArray(savedState?.retiredPlayerNames)
            ? [...new Set(savedState.retiredPlayerNames)]
            : (Array.isArray(savedState?.retiredPlayerKeys)
                ? savedState.retiredPlayerKeys.map(key => getLifecyclePlayerNameKey(String(key).split('|')[0])).filter(Boolean)
                : []),
        retiredPlayerIds: Array.isArray(savedState?.retiredPlayerIds)
            ? [...new Set(savedState.retiredPlayerIds)]
            : [],
        retiredTemplateIndexes: Array.isArray(savedState?.retiredTemplateIndexes)
            ? [...new Set(savedState.retiredTemplateIndexes)]
            : []
    };
    return ensurePlayerLifecycleState();
}

function getLifecyclePlayerKey(candidate) {
    return `${candidate?.name || ''}|${candidate?.country || ''}`;
}

function getLifecyclePlayerNameKey(candidate) {
    const name = typeof candidate === 'string' ? candidate : candidate?.name;
    return String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
}

function getLifecycleTemplateIndex(candidate) {
    if (!candidate || candidate.isBye) return null;
    if (Number.isInteger(candidate.defaultTemplateIndex) && candidate.defaultTemplateIndex >= 0) {
        return candidate.defaultTemplateIndex;
    }
    if (typeof defaultPdcPlayerTemplates === 'undefined' || !Array.isArray(defaultPdcPlayerTemplates)) return null;

    const candidateNames = [candidate.sourceName, candidate.name]
        .map(getLifecyclePlayerNameKey)
        .filter(Boolean);
    if (!candidateNames.length) return null;
    const candidateCountry = String(candidate.country || '').trim().toLocaleLowerCase('pl');
    const matchingIndex = defaultPdcPlayerTemplates.findIndex(template => {
        const sameName = candidateNames.includes(getLifecyclePlayerNameKey(template));
        const templateCountry = String(template?.country || '').trim().toLocaleLowerCase('pl');
        return sameName && (!candidateCountry || !templateCountry || candidateCountry === templateCountry);
    });
    return matchingIndex >= 0 ? matchingIndex : null;
}

function hydrateRetiredTemplateIndexes(state = playerLifecycleState) {
    if (!state || typeof state !== 'object' || typeof pdcPlayers === 'undefined') return [];
    const retiredKeys = new Set(Array.isArray(state.retiredPlayerKeys) ? state.retiredPlayerKeys : []);
    const retiredNames = new Set((Array.isArray(state.retiredPlayerNames) ? state.retiredPlayerNames : [])
        .map(getLifecyclePlayerNameKey)
        .filter(Boolean));
    if (!retiredKeys.size && !retiredNames.size) return state.retiredTemplateIndexes || [];

    const matchesRetiredIdentity = candidate => {
        if (!candidate || candidate.isBye) return false;
        const templateIndex = getLifecycleTemplateIndex(candidate);
        const sourceTemplate = Number.isInteger(templateIndex) && Array.isArray(defaultPdcPlayerTemplates)
            ? defaultPdcPlayerTemplates[templateIndex]
            : null;
        const identities = [candidate, sourceTemplate].filter(Boolean);
        const keys = identities.flatMap(identity => [identity.name, identity.sourceName]
            .filter(Boolean)
            .map(name => `${name}|${identity.country || ''}`));
        const names = identities.flatMap(identity => [identity.name, identity.sourceName].map(getLifecyclePlayerNameKey));
        return keys.some(key => retiredKeys.has(key)) || names.some(name => retiredNames.has(name));
    };
    const indexes = new Set(Array.isArray(state.retiredTemplateIndexes) ? state.retiredTemplateIndexes : []);
    const ids = new Set(Array.isArray(state.retiredPlayerIds) ? state.retiredPlayerIds : []);
    const candidates = [
        ...(Array.isArray(defaultPdcPlayerTemplates) ? defaultPdcPlayerTemplates : []),
        ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])
    ];
    candidates.filter(matchesRetiredIdentity).forEach(candidate => {
        const index = getLifecycleTemplateIndex(candidate);
        if (Number.isInteger(index) && index >= 0) indexes.add(index);
        if (typeof candidate.id === 'string' && candidate.id.trim()) ids.add(candidate.id);
    });
    state.retiredTemplateIndexes = [...indexes];
    state.retiredPlayerIds = [...ids];
    return state.retiredTemplateIndexes;
}

function isRetiredPlayer(candidate, templateIndex = getLifecycleTemplateIndex(candidate), state = ensurePlayerLifecycleState()) {
    if (!candidate || candidate.isBye) return false;
    const retiredKeys = new Set(state.retiredPlayerKeys);
    const retiredNames = new Set(state.retiredPlayerNames);
    const retiredIds = new Set(state.retiredPlayerIds);
    const retiredTemplateIndexes = new Set(state.retiredTemplateIndexes);
    const keys = [candidate.name, candidate.sourceName]
        .filter(Boolean)
        .map(name => `${name}|${candidate.country || ''}`);
    const names = [candidate.name, candidate.sourceName].map(getLifecyclePlayerNameKey);
    return (typeof candidate.id === 'string' && retiredIds.has(candidate.id))
        || (Number.isInteger(templateIndex) && retiredTemplateIndexes.has(templateIndex))
        || keys.some(key => retiredKeys.has(key))
        || names.some(name => retiredNames.has(name));
}

function removeRetiredPlayersFromPool(players = (typeof pdcPlayers !== 'undefined' ? pdcPlayers : null)) {
    if (!Array.isArray(players)) return 0;
    const initialCount = players.length;
    const state = ensurePlayerLifecycleState();
    const activePlayers = players.filter(candidate => candidate && !candidate.isBye && !isRetiredPlayer(candidate, undefined, state));
    if (activePlayers.length !== players.length) players.splice(0, players.length, ...activePlayers);
    return initialCount - activePlayers.length;
}

function getRetirementChance(age) {
    if (!Number.isInteger(age) || age < 46) return 0;
    return Math.min(100, (age - 45) * 2.5);
}

function getAnnualDecline(age) {
    if (!Number.isInteger(age) || age <= 40) return 0;
    // Weterani zaczynają tracić część poziomu już po czterdziestce.
    // Po 46. roku życia spadek wyraźnie przyspiesza.
    if (age <= 45) return 0.5;
    return 1 + Math.floor((age - 46) / 3);
}

function getPlayerLifecycleRankings() {
    const ranked = [...(Array.isArray(pdcPlayers) ? pdcPlayers : []), player]
        .filter(candidate => candidate && !candidate.isBye)
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
    return new Map(ranked.map((candidate, index) => [candidate.id || getLifecyclePlayerKey(candidate), index + 1]));
}

function applyAnnualAgeDecline(candidate, age) {
    const baseDecline = getAnnualDecline(age);
    const decline = typeof scalePlayerDevelopmentChange === 'function'
        ? -scalePlayerDevelopmentChange(candidate, -baseDecline)
        : baseDecline;
    if (!decline) return 0;

    const clampBaseRating = value => Math.max(40, Math.min(99, Number(value) || 40));
    const clampDisplayedRating = value => Math.max(40, Math.min(99, Math.round(Number(value) || 40)));
    const baseOvr = Number(candidate.baseOvr ?? candidate.ovr ?? candidate.overall) || 55;
    const baseScoring = Number(candidate.baseScoring ?? candidate.scoring) || baseOvr;
    const baseDoubles = Number(candidate.baseDoubles ?? candidate.doubles) || baseOvr;
    candidate.baseOvr = clampBaseRating(baseOvr - decline);
    candidate.baseScoring = clampBaseRating(baseScoring - decline);
    candidate.baseDoubles = clampBaseRating(baseDoubles - decline);
    candidate.form = Number.isFinite(Number(candidate.form)) ? Number(candidate.form) : 0;

    if (typeof applyForm === 'function') {
        applyForm(candidate);
    } else {
        candidate.ovr = candidate.baseOvr + candidate.form;
        candidate.scoring = candidate.baseScoring + candidate.form;
        candidate.doubles = candidate.baseDoubles + candidate.form;
    }
    candidate.ovr = clampDisplayedRating(candidate.ovr);
    candidate.scoring = clampDisplayedRating(candidate.scoring);
    candidate.doubles = clampDisplayedRating(candidate.doubles);
    candidate.overall = candidate.ovr;
    return decline;
}

function applyCareerAnnualAgeDecline(age) {
    if (!player || player.isBye) return 0;
    const baseDecline = getAnnualDecline(age);
    const decline = typeof scalePlayerDevelopmentChange === 'function'
        ? -scalePlayerDevelopmentChange(player, -baseDecline)
        : baseDecline;
    if (!decline) return 0;

    const clampStat = value => Math.max(40, Math.min(100, Number(value) || 40));
    player.scoring = clampStat((Number(player.scoring) || 55) - decline);
    player.doubles = clampStat((Number(player.doubles) || 55) - decline);
    player.overall = Math.round((player.scoring * 0.6) + (player.doubles * 0.4));
    player.ovr = player.overall;
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

function createFictionalNewgenName(existingNames, gender = 'male') {
    const firstNames = gender === 'female' ? NEWGEN_FEMALE_FIRST_NAMES : NEWGEN_FIRST_NAMES;
    for (let attempt = 0; attempt < 100; attempt++) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = NEWGEN_LAST_NAMES[Math.floor(Math.random() * NEWGEN_LAST_NAMES.length)];
        const name = `${first} ${last}`;
        if (!existingNames.has(name)) return name;
    }
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
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
    // New professionals can break through later too, not only as teenagers.
    const age = 17 + Math.floor(Math.random() * 19); // 17–35 inclusive
    const scoring = Math.max(40, Math.min(99, overall + (Math.floor(Math.random() * 5) - 1)));
    const doubles = Math.max(40, Math.min(99, overall + (Math.floor(Math.random() * 5) - 3)));
    const gender = Math.random() < 0.18 ? 'female' : 'male';
    const name = createFictionalNewgenName(existingNames, gender);
    existingNames.add(name);
    return {
        id: createEntityId('newgen'),
        name,
        gender,
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
        europeanTourPrizeMoney: 0,
        hasTourCard: false,
        tourCardSource: null,
        tourCardStartYear: null,
        tourCardExpiryYear: null,
        tourCardCycleYear: typeof getPdcTourCardCycleYear === 'function' ? getPdcTourCardCycleYear(year) : year,
        tourCardSystemVersion: typeof PDC_TOUR_CARD_SYSTEM_VERSION !== 'undefined' ? PDC_TOUR_CARD_SYSTEM_VERSION : 1,
        baseOvr: overall,
        baseScoring: scoring,
        baseDoubles: doubles,
        form: 0,
        historyPT: {},
        historyMain: {},
        mainPrizeHistory: [],
        mainOomHistoryVersion: typeof MAIN_ORDER_OF_MERIT_VERSION !== 'undefined'
            ? MAIN_ORDER_OF_MERIT_VERSION
            : 1,
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
            if (typeof candidate.id === 'string' && candidate.id.trim() && !state.retiredPlayerIds.includes(candidate.id)) {
                state.retiredPlayerIds.push(candidate.id);
            }
            const key = getLifecyclePlayerKey(candidate);
            if (!state.retiredPlayerKeys.includes(key)) state.retiredPlayerKeys.push(key);
            const nameKey = getLifecyclePlayerNameKey(candidate);
            if (nameKey && !state.retiredPlayerNames.includes(nameKey)) state.retiredPlayerNames.push(nameKey);
            const templateIndex = getLifecycleTemplateIndex(candidate);
            if (Number.isInteger(templateIndex) && !state.retiredTemplateIndexes.includes(templateIndex)) {
                state.retiredTemplateIndexes.push(templateIndex);
            }
            return;
        }
        if (age !== null) applyAnnualAgeDecline(candidate, age);
        survivingPlayers.push(candidate);
    });

    pdcPlayers.splice(0, pdcPlayers.length, ...survivingPlayers);
    if (player && Array.isArray(player.activeRivalIds) && retiredIds.size) {
        player.activeRivalIds = player.activeRivalIds.filter(id => !retiredIds.has(id));
    }
    const careerPlayerAge = Number.isInteger(player?.birthYear) ? newSeasonYear - player.birthYear : null;
    if (careerPlayerAge !== null) applyCareerAnnualAgeDecline(careerPlayerAge);

    const newgenCount = Math.max(2 + Math.floor(Math.random() * 3), retirements.length);
    const existingNames = new Set([...pdcPlayers, player].filter(Boolean).map(candidate => candidate.name));
    const newgens = Array.from({ length: newgenCount }, () => createAnnualNewgen(newSeasonYear, existingNames));
    pdcPlayers.push(...newgens);

    state.lastProcessedYear = completedYear;
    sendRetirementSummaryEmail(completedYear, retirements);
    if (typeof renderOpponentOptions === 'function') renderOpponentOptions();
    return { retirements, newgens };
}
