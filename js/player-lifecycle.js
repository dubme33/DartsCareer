let playerLifecycleState = {
    lastProcessedYear: null,
    retiredPlayerKeys: [],
    retiredPlayerNames: [],
    retiredPlayerIds: [],
    retiredTemplateIndexes: []
};

let playerLifecycleValidationCache = null;
const PLAYER_LIFECYCLE_IDENTITY_FIELDS = ['retiredPlayerKeys', 'retiredPlayerNames', 'retiredPlayerIds', 'retiredTemplateIndexes'];

function invalidatePlayerLifecycleCache() {
    playerLifecycleValidationCache = null;
}

function getPlayerLifecycleCacheStamp(state) {
    return [state.lastProcessedYear, ...PLAYER_LIFECYCLE_IDENTITY_FIELDS.map(field =>
        Array.isArray(state[field]) ? JSON.stringify(state[field]) : null)].join('|');
}

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

function trPlayerLifecycle(key, values = {}) {
    const language = typeof currentLang === 'string' && PLAYER_LIFECYCLE_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = PLAYER_LIFECYCLE_TRANSLATIONS[language][key] || PLAYER_LIFECYCLE_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function ensurePlayerLifecycleState() {
    if (!playerLifecycleState || typeof playerLifecycleState !== 'object') {
        playerLifecycleState = { lastProcessedYear: null, retiredPlayerKeys: [], retiredPlayerNames: [], retiredPlayerIds: [], retiredTemplateIndexes: [] };
    }
    const roster = typeof pdcPlayers !== 'undefined' ? pdcPlayers : null;
    const templates = typeof defaultPdcPlayerTemplates !== 'undefined' ? defaultPdcPlayerTemplates : null;
    const stamp = getPlayerLifecycleCacheStamp(playerLifecycleState);
    if (playerLifecycleValidationCache?.state === playerLifecycleState
        && playerLifecycleValidationCache.stamp === stamp
        && playerLifecycleValidationCache.roster === roster
        && playerLifecycleValidationCache.rosterLength === roster?.length
        && playerLifecycleValidationCache.templates === templates
        && playerLifecycleValidationCache.templatesLength === templates?.length) return playerLifecycleState;
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
    // Kosztowna migracja nazw moda i indeksów bazy jest potrzebna tylko po
    // zmianie stanu emerytur lub składu bazy, nie dla każdego zawodnika.
    hydrateRetiredTemplateIndexes(playerLifecycleState);
    playerLifecycleValidationCache = {
        state: playerLifecycleState, stamp: getPlayerLifecycleCacheStamp(playerLifecycleState),
        roster, rosterLength: roster?.length, templates, templatesLength: templates?.length
    };
    return playerLifecycleState;
}

function restorePlayerLifecycleState(savedState) {
    invalidatePlayerLifecycleCache();
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
    // Mod mógł podmienić nazwy/ID w miejscu, bez zmiany długości tablicy.
    invalidatePlayerLifecycleCache();
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
    if (!Number.isInteger(age) || age <= 43) return 0;

    // Darterzy mogą utrzymywać światowy poziom znacznie dłużej niż zawodnicy
    // sportów wymagających szybkości i wydolności. Regres zaczyna się łagodnie
    // i nigdy nie przyspiesza do dawnych 3–5 punktów OVR na jeden sezon.
    if (age <= 46) return 0.25;
    if (age <= 49) return 0.5;
    if (age <= 52) return 0.75;
    if (age <= 56) return 1;
    return 1.25;
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
    candidate.form = 0;

    if (typeof applyForm === 'function') {
        applyForm(candidate);
    } else {
        candidate.ovr = candidate.baseOvr;
        candidate.scoring = candidate.baseScoring;
        candidate.doubles = candidate.baseDoubles;
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

function getNewgenCountryDistribution() {
    return typeof NEWGEN_COUNTRY_DISTRIBUTION !== 'undefined' && Array.isArray(NEWGEN_COUNTRY_DISTRIBUTION)
        ? NEWGEN_COUNTRY_DISTRIBUTION
        : [];
}

function getNewgenNameProfile(country) {
    const distribution = getNewgenCountryDistribution();
    const entry = distribution.find(candidate => candidate.country === country) || distribution[0];
    const profiles = typeof NEWGEN_NAME_PROFILES !== 'undefined' ? NEWGEN_NAME_PROFILES : {};
    return profiles[entry?.profile] || profiles.english || null;
}

function pickWeightedNewgenCountry(random = Math.random) {
    const distribution = getNewgenCountryDistribution();
    const totalWeight = distribution.reduce((sum, entry) => sum + Math.max(0, Number(entry.weight) || 0), 0);
    if (!distribution.length || totalWeight <= 0) return 'Anglia';

    let roll = random() * totalWeight;
    for (const entry of distribution) {
        roll -= entry.weight;
        if (roll <= 0) return entry.country;
    }
    return distribution[distribution.length - 1].country;
}

function pickNewgenCountry(random = Math.random) {
    return pickWeightedNewgenCountry(random);
}

function normalizeNewgenName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
}

function createFictionalNewgenName(existingNames, country, gender = 'male', random = Math.random) {
    const profile = getNewgenNameProfile(country);
    if (!profile) throw new Error(`Brak profilu imion newgenów dla kraju: ${country || 'nieznany'}`);

    const firstNames = gender === 'female' ? profile.female : profile.male;
    const lastNames = gender === 'female' && Array.isArray(profile.femaleLast) ? profile.femaleLast : profile.last;
    const normalizedExistingNames = [...(existingNames || [])].map(normalizeNewgenName);
    const existingNameSet = new Set(normalizedExistingNames);
    const firstNameUsage = new Map(firstNames.map(first => {
        const normalizedFirst = `${normalizeNewgenName(first)} `;
        return [first, normalizedExistingNames.filter(name => name.startsWith(normalizedFirst)).length];
    }));
    const lastNameUsage = new Map(lastNames.map(last => {
        const normalizedLast = ` ${normalizeNewgenName(last)}`;
        return [last, normalizedExistingNames.filter(name => name.endsWith(normalizedLast)).length];
    }));

    let bestScore = Number.POSITIVE_INFINITY;
    let bestCandidates = [];
    for (const first of firstNames) {
        for (const last of lastNames) {
            const name = `${first} ${last}`;
            if (existingNameSet.has(normalizeNewgenName(name))) continue;
            const score = (firstNameUsage.get(first) || 0) + (lastNameUsage.get(last) || 0);
            if (score < bestScore) {
                bestScore = score;
                bestCandidates = [name];
            } else if (score === bestScore) {
                bestCandidates.push(name);
            }
        }
    }

    if (bestCandidates.length) return bestCandidates[Math.floor(random() * bestCandidates.length)];

    // Pełna pula daje setki realistycznych kombinacji. Po jej wyczerpaniu
    // dopuszczamy prawdziwie możliwego imiennika zamiast dopisywać cyfrę.
    const first = firstNames[Math.floor(random() * firstNames.length)];
    const last = lastNames[Math.floor(random() * lastNames.length)];
    return `${first} ${last}`;
}

function getNewgenStartingOverall(random = Math.random) {
    const roll = random();
    if (roll < 0.05) return 70 + Math.floor(random() * 5);
    if (roll < 0.28) return 64 + Math.floor(random() * 6);
    if (roll < 0.72) return 57 + Math.floor(random() * 7);
    return 52 + Math.floor(random() * 5);
}

function createAnnualNewgen(year, existingNames, random = Math.random) {
    const overall = getNewgenStartingOverall(random);
    // New professionals can break through later too, not only as teenagers.
    const age = 17 + Math.floor(random() * 19); // 17–35 inclusive
    const scoring = Math.max(40, Math.min(99, overall + (Math.floor(random() * 5) - 1)));
    const doubles = Math.max(40, Math.min(99, overall + (Math.floor(random() * 5) - 3)));
    const gender = random() < 0.18 ? 'female' : 'male';
    const country = pickNewgenCountry(random);
    const name = createFictionalNewgenName(existingNames, country, gender, random);
    existingNames.add(name);
    return {
        id: createEntityId('newgen'),
        name,
        gender,
        country,
        birthYear: year - age,
        overall,
        ovr: overall,
        scoring,
        doubles,
        favoriteDouble: [16, 20, 18, 12, 8][Math.floor(random() * 5)],
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
        nameGenerationVersion: 2,
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
    if (typeof initializeAllPlayerTraits === 'function') initializeAllPlayerTraits();

    state.lastProcessedYear = completedYear;
    sendRetirementSummaryEmail(completedYear, retirements);
    if (typeof renderOpponentOptions === 'function') renderOpponentOptions();
    return { retirements, newgens };
}
