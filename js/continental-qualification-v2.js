const CONTINENTAL_QUALIFIER_TYPE = 'continentalQualifier';
const CONTINENTAL_QUALIFICATION_VERSION = 2;
const CONTINENTAL_TOUR_FIELD_SIZE = 48;

const CONTINENTAL_QUALIFIER_PATHS = Object.freeze({
    card: { places: 10, label: 'Pro Card Qualifier' },
    host: { places: 4, label: 'Host Nation Qualifier' },
    nordicBaltic: { places: 1, label: 'Nordic & Baltic Qualifier' },
    eastEurope: { places: 1, label: 'East Europe Qualifier' }
});

const CONTINENTAL_NORDIC_BALTIC_COUNTRIES = new Set([
    'Dania', 'Estonia', 'Islandia', 'Finlandia', 'Łotwa', 'Grenlandia', 'Norwegia', 'Litwa', 'Wyspy Owcze', 'Szwecja'
]);

const CONTINENTAL_EAST_EUROPE_COUNTRIES = new Set([
    'Albania', 'Białoruś', 'Bośnia i Hercegowina', 'Bułgaria', 'Chorwacja', 'Cypr', 'Czechy', 'Grecja',
    'Węgry', 'Kosowo', 'Mołdawia', 'Czarnogóra', 'Macedonia Północna', 'Polska', 'Rumunia', 'Rosja',
    'Serbia', 'Słowacja', 'Słowenia', 'Turcja', 'Ukraina'
]);

const CONTINENTAL_QUALIFIER_TRANSLATIONS = {
    pl: { qualified: 'Gratulacje! Awansujesz do {tournament}.', eliminated: 'Nie udało się wywalczyć awansu do {tournament}.' },
    en: { qualified: 'Congratulations! You qualify for {tournament}.', eliminated: 'You did not qualify for {tournament}.' },
    de: { qualified: 'Glückwunsch! Du qualifizierst dich für {tournament}.', eliminated: 'Du hast die Qualifikation für {tournament} verpasst.' },
    nl: { qualified: 'Gefeliciteerd! Je plaatst je voor {tournament}.', eliminated: 'Je hebt de kwalificatie voor {tournament} gemist.' }
};

function trContinentalQualifier(key, values = {}) {
    const language = typeof currentLang === 'string' && CONTINENTAL_QUALIFIER_TRANSLATIONS[currentLang]
        ? currentLang
        : 'pl';
    const template = CONTINENTAL_QUALIFIER_TRANSLATIONS[language][key]
        || CONTINENTAL_QUALIFIER_TRANSLATIONS.pl[key]
        || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function isContinentalQualifierTournament(tournament = activeTournament) {
    return Boolean(tournament && tournament.specialType === CONTINENTAL_QUALIFIER_TYPE);
}

function isContinentalTourTournament(tournament) {
    if (!tournament || isContinentalQualifierTournament(tournament)) return false;
    const name = typeof tournament === 'string' ? tournament : tournament.name;
    return /(?:european|continental) tour/i.test(name || '');
}

function getContinentalQualifierPath(tournament) {
    return CONTINENTAL_QUALIFIER_PATHS[tournament?.qualifierPath] ? tournament.qualifierPath : 'card';
}

function getContinentalQualifierPlaces(tournament) {
    return CONTINENTAL_QUALIFIER_PATHS[getContinentalQualifierPath(tournament)].places;
}

function getContinentalQualifierDisplayName(tournament) {
    const mainName = tournament?.qualifierFor || String(tournament?.name || '').replace(/\s*-\s*.+Qualifier$/i, '');
    return `${mainName} — ${CONTINENTAL_QUALIFIER_PATHS[getContinentalQualifierPath(tournament)].label}`;
}

function getContinentalQualificationPlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id || `${candidate.name || ''}|${candidate.country || ''}`;
}

function isContinentalQualificationPlayerEligible(candidate) {
    if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return false;
    return !(typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate));
}

function getContinentalQualificationPlayers() {
    const candidates = [
        ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
        ...(typeof player !== 'undefined' && player?.name ? [player] : [])
    ];
    const unique = new Map();
    candidates.forEach(candidate => {
        if (!isContinentalQualificationPlayerEligible(candidate)) return;
        const key = getContinentalQualificationPlayerKey(candidate);
        if (!unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function sortContinentalQualificationRank(first, second, property = 'prizeMoney') {
    const difference = (Number(second?.[property]) || 0) - (Number(first?.[property]) || 0);
    if (difference !== 0) return difference;
    const overallDifference = (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0);
    if (overallDifference !== 0) return overallDifference;
    const currentPlayerDifference = Number(typeof isCurrentPlayer === 'function' && isCurrentPlayer(second))
        - Number(typeof isCurrentPlayer === 'function' && isCurrentPlayer(first));
    if (currentPlayerDifference !== 0) return currentPlayerDifference;
    return String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getContinentalQualificationSeason() {
    return typeof currentDate !== 'undefined' && currentDate instanceof Date && !Number.isNaN(currentDate.getTime())
        ? currentDate.getFullYear()
        : new Date().getFullYear();
}

function resolveContinentalQualificationPlayers(keys, candidates = getContinentalQualificationPlayers()) {
    const byKey = new Map(candidates.map(candidate => [getContinentalQualificationPlayerKey(candidate), candidate]));
    return (Array.isArray(keys) ? keys : []).map(key => byKey.get(key)).filter(Boolean);
}

function getLinkedContinentalTour(qualifierTournament) {
    if (!qualifierTournament?.qualifierFor || typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(tournament => tournament.name === qualifierTournament.qualifierFor) || null;
}

function getContinentalQualificationPathState(state, path) {
    if (!state.paths || typeof state.paths !== 'object') state.paths = {};
    if (!state.paths[path]) state.paths[path] = { participantIds: [], qualifiedPlayerIds: [], completed: false };
    return state.paths[path];
}

function refreshContinentalQualificationAggregate(state) {
    const qualifiedPlayerIds = [];
    const seen = new Set();
    Object.keys(CONTINENTAL_QUALIFIER_PATHS).forEach(path => {
        const pathState = getContinentalQualificationPathState(state, path);
        pathState.qualifiedPlayerIds.forEach(key => {
            if (seen.has(key)) return;
            seen.add(key);
            qualifiedPlayerIds.push(key);
        });
    });
    state.qualifiedPlayerIds = qualifiedPlayerIds;
    state.completed = Object.keys(CONTINENTAL_QUALIFIER_PATHS)
        .every(path => getContinentalQualificationPathState(state, path).completed === true);
    return state;
}

function ensureContinentalQualificationState(mainTournament, candidates = getContinentalQualificationPlayers()) {
    if (!mainTournament) return null;
    const season = getContinentalQualificationSeason();
    const existing = mainTournament.continentalQualification;
    if (existing?.version === CONTINENTAL_QUALIFICATION_VERSION && existing.year === season
        && Array.isArray(existing.oomPlayerIds) && Array.isArray(existing.proTourPlayerIds)) {
        return refreshContinentalQualificationAggregate(existing);
    }

    const allPlayers = candidates.filter(isContinentalQualificationPlayerEligible);
    const cardHolders = allPlayers.filter(candidate => candidate.hasTourCard === true);
    const oomPlayers = [...cardHolders]
        .sort((first, second) => sortContinentalQualificationRank(first, second, 'prizeMoney'))
        .slice(0, 16);
    const automaticKeys = new Set(oomPlayers.map(getContinentalQualificationPlayerKey));
    const proTourPlayers = [];
    const proTourRanked = [...cardHolders]
        .sort((first, second) => sortContinentalQualificationRank(first, second, 'proTourPrizeMoney'));
    for (const candidate of proTourRanked) {
        const key = getContinentalQualificationPlayerKey(candidate);
        if (automaticKeys.has(key)) continue;
        proTourPlayers.push(candidate);
        automaticKeys.add(key);
        if (proTourPlayers.length === 16) break;
    }

    const state = {
        version: CONTINENTAL_QUALIFICATION_VERSION,
        year: season,
        oomPlayerIds: oomPlayers.map(getContinentalQualificationPlayerKey),
        proTourPlayerIds: proTourPlayers.map(getContinentalQualificationPlayerKey),
        paths: {},
        qualifiedPlayerIds: [],
        completed: false
    };
    if (existing?.completed && Array.isArray(existing.qualifiedPlayerIds)) {
        const cardPath = getContinentalQualificationPathState(state, 'card');
        cardPath.qualifiedPlayerIds = existing.qualifiedPlayerIds.slice(0, 10);
        cardPath.completed = true;
        cardPath.initialized = true;
        state.migratedLegacyQualification = true;
    }
    mainTournament.continentalQualification = state;
    return refreshContinentalQualificationAggregate(state);
}

function getCompletedContinentalQualifierKeys(state, exceptPath = '') {
    const keys = new Set([...state.oomPlayerIds, ...state.proTourPlayerIds]);
    Object.keys(CONTINENTAL_QUALIFIER_PATHS).forEach(path => {
        if (path === exceptPath) return;
        getContinentalQualificationPathState(state, path).qualifiedPlayerIds.forEach(key => keys.add(key));
    });
    return keys;
}

function buildContinentalQualifierPool(mainTournament, path, state, candidates = getContinentalQualificationPlayers()) {
    const excludedKeys = getCompletedContinentalQualifierKeys(state, path);
    const remaining = candidates.filter(candidate => !excludedKeys.has(getContinentalQualificationPlayerKey(candidate)));
    let pool;

    if (path === 'card') {
        pool = remaining
            .filter(candidate => candidate.hasTourCard === true)
            .sort((first, second) => sortContinentalQualificationRank(first, second, 'proTourPrizeMoney'))
            .slice(0, 80);
    } else {
        const nonCardPlayers = remaining.filter(candidate => candidate.hasTourCard !== true);
        if (path === 'host') {
            pool = nonCardPlayers.filter(candidate => candidate.country === mainTournament.country);
        } else if (path === 'nordicBaltic') {
            pool = nonCardPlayers.filter(candidate => CONTINENTAL_NORDIC_BALTIC_COUNTRIES.has(candidate.country));
        } else {
            pool = nonCardPlayers.filter(candidate => CONTINENTAL_EAST_EUROPE_COUNTRIES.has(candidate.country));
        }
        pool.sort((first, second) => sortContinentalQualificationRank(first, second, 'ovr'));
    }

    if (path === 'card' && typeof player !== 'undefined' && player?.hasTourCard === true) {
        const playerKey = getContinentalQualificationPlayerKey(player);
        const playerEligible = remaining.some(candidate => getContinentalQualificationPlayerKey(candidate) === playerKey);
        if (playerEligible && !pool.some(candidate => getContinentalQualificationPlayerKey(candidate) === playerKey)) {
            pool = [...pool.slice(0, 79), player];
        }
    }
    return pool;
}

function ensureContinentalQualifierPathState(mainTournament, path, candidates = getContinentalQualificationPlayers()) {
    const state = ensureContinentalQualificationState(mainTournament, candidates);
    const pathState = getContinentalQualificationPathState(state, path);
    if (!pathState.initialized) {
        pathState.participantIds = buildContinentalQualifierPool(mainTournament, path, state, candidates)
            .map(getContinentalQualificationPlayerKey);
        pathState.qualifiedPlayerIds = [];
        pathState.completed = false;
        pathState.initialized = true;
    }
    return pathState;
}

function getContinentalTourQualifierParticipants(qualifierTournament) {
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    if (!mainTournament) return [];
    const candidates = getContinentalQualificationPlayers();
    const path = getContinentalQualifierPath(qualifierTournament);
    const state = ensureContinentalQualificationState(mainTournament, candidates);
    const pathState = ensureContinentalQualifierPathState(mainTournament, path, candidates);
    const excludedKeys = getCompletedContinentalQualifierKeys(state, path);
    return resolveContinentalQualificationPlayers(pathState.participantIds, candidates)
        .filter(candidate => !excludedKeys.has(getContinentalQualificationPlayerKey(candidate)))
        .filter(candidate => path === 'card' ? candidate.hasTourCard === true : candidate.hasTourCard !== true);
}

function getContinentalQualifierOpeningRound(qualifierTournament, participantCount) {
    const places = getContinentalQualifierPlaces(qualifierTournament);
    if (getContinentalQualifierPath(qualifierTournament) === 'card') return 80;
    let bracketSize = Math.max(places, places * 2);
    while (bracketSize < participantCount) bracketSize *= 2;
    return bracketSize;
}

function createContinentalQualifierBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

function shuffleContinentalQualifierPlayers(candidates, random = Math.random) {
    const shuffled = [...candidates];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function buildContinentalQualifierDraw(qualifierTournament, participants, random = Math.random) {
    const entrants = shuffleContinentalQualifierPlayers(participants, random);
    const bracketSize = getContinentalQualifierOpeningRound(qualifierTournament, entrants.length);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;
    for (; index < byeCount && index < entrants.length; index++) draw.push(entrants[index], createContinentalQualifierBye());
    for (; index < entrants.length; index += 2) draw.push(entrants[index], entrants[index + 1] || createContinentalQualifierBye());
    while (draw.length < bracketSize) draw.push(createContinentalQualifierBye());
    return draw;
}

function isCareerPlayerDirectlyQualifiedForContinentalTour(qualifierTournament) {
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    const state = mainTournament && ensureContinentalQualificationState(mainTournament);
    if (!state || typeof player === 'undefined') return false;
    const playerKey = getContinentalQualificationPlayerKey(player);
    return [...state.oomPlayerIds, ...state.proTourPlayerIds].includes(playerKey);
}

function completeContinentalTourQualifier(qualifierTournament, qualifiedPlayers) {
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    if (!mainTournament) return null;
    const candidates = getContinentalQualificationPlayers();
    const state = ensureContinentalQualificationState(mainTournament, candidates);
    const path = getContinentalQualifierPath(qualifierTournament);
    const pathState = ensureContinentalQualifierPathState(mainTournament, path, candidates);
    const places = getContinentalQualifierPlaces(qualifierTournament);
    const excludedKeys = getCompletedContinentalQualifierKeys(state, path);
    const unique = new Map();
    (Array.isArray(qualifiedPlayers) ? qualifiedPlayers : []).forEach(candidate => {
        if (!isContinentalQualificationPlayerEligible(candidate) || candidate.isBye) return;
        const key = getContinentalQualificationPlayerKey(candidate);
        if (excludedKeys.has(key) || unique.has(key)) return;
        if (path === 'card' ? candidate.hasTourCard !== true : candidate.hasTourCard === true) return;
        unique.set(key, candidate);
    });
    pathState.qualifiedPlayerIds = [...unique.keys()].slice(0, places);
    pathState.completed = true;
    qualifierTournament.completed = true;
    qualifierTournament.historyLogs = typeof lastTournamentResults === 'string' ? lastTournamentResults : '';
    return refreshContinentalQualificationAggregate(state);
}

function automaticallyCompleteContinentalQualifierPath(mainTournament, path, candidates) {
    const state = ensureContinentalQualificationState(mainTournament, candidates);
    const pathState = ensureContinentalQualifierPathState(mainTournament, path, candidates);
    if (pathState.completed) return pathState;
    const excludedKeys = getCompletedContinentalQualifierKeys(state, path);
    pathState.qualifiedPlayerIds = resolveContinentalQualificationPlayers(pathState.participantIds, candidates)
        .filter(candidate => !excludedKeys.has(getContinentalQualificationPlayerKey(candidate)))
        .filter(candidate => path === 'card' ? candidate.hasTourCard === true : candidate.hasTourCard !== true)
        .slice(0, CONTINENTAL_QUALIFIER_PATHS[path].places)
        .map(getContinentalQualificationPlayerKey);
    pathState.completed = true;
    pathState.migratedWithoutQualifier = true;
    refreshContinentalQualificationAggregate(state);
    return pathState;
}

function getContinentalTourMainField(mainTournament) {
    const candidates = getContinentalQualificationPlayers();
    const state = ensureContinentalQualificationState(mainTournament, candidates);
    if (!state) return null;
    Object.keys(CONTINENTAL_QUALIFIER_PATHS).forEach(path => automaticallyCompleteContinentalQualifierPath(mainTournament, path, candidates));
    const paths = Object.fromEntries(Object.keys(CONTINENTAL_QUALIFIER_PATHS).map(path => [
        path,
        resolveContinentalQualificationPlayers(getContinentalQualificationPathState(state, path).qualifiedPlayerIds, candidates)
    ]));
    const qualifiedPlayers = Object.values(paths).flat();
    const oomPlayers = resolveContinentalQualificationPlayers(state.oomPlayerIds, candidates);
    const proTourPlayers = resolveContinentalQualificationPlayers(state.proTourPlayerIds, candidates);
    const fieldSize = oomPlayers.length + proTourPlayers.length + qualifiedPlayers.length;
    return {
        state,
        oomPlayers,
        proTourPlayers,
        qualifiedPlayers,
        qualifierPaths: paths,
        fieldSize,
        shortfall: Math.max(0, CONTINENTAL_TOUR_FIELD_SIZE - fieldSize)
    };
}

function getContinentalQualifierOutcomeMessage(qualified) {
    const mainTournament = getLinkedContinentalTour(activeTournament);
    return trContinentalQualifier(qualified ? 'qualified' : 'eliminated', {
        tournament: mainTournament?.name || activeTournament?.qualifierFor || ''
    });
}

function migrateContinentalTourQualifiersCalendar() {
    if (typeof syncContinentalTourQualificationCalendar === 'function') {
        return syncContinentalTourQualificationCalendar(tournamentDatabase);
    }
    return tournamentDatabase;
}
