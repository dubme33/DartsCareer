const CONTINENTAL_QUALIFIER_TYPE = 'continentalQualifier';
const CONTINENTAL_QUALIFICATION_VERSION = 2;
const CONTINENTAL_TOUR_FIELD_SIZE = 48;
const CONTINENTAL_TOP_16_WITHDRAWAL_CHANCE = 0.15;

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
    pl: { qualified: 'Gratulacje! Awansujesz do {tournament}.', eliminated: 'Nie udało się wywalczyć awansu do {tournament}.', reserve: 'Zajmujesz miejsce {position} na liście rezerwowej do {tournament}.', replacementSubject: 'European Tour: awans z listy rezerwowej', replacementBody: 'Zastępujesz {withdrawn} w {tournament}. Rozpoczynasz od rundy {round}.' },
    en: { qualified: 'Congratulations! You qualify for {tournament}.', eliminated: 'You did not qualify for {tournament}.', reserve: 'You are reserve number {position} for {tournament}.', replacementSubject: 'European Tour: reserve entry confirmed', replacementBody: 'You replace {withdrawn} in {tournament}. You enter in round {round}.' },
    de: { qualified: 'Glückwunsch! Du qualifizierst dich für {tournament}.', eliminated: 'Du hast die Qualifikation für {tournament} verpasst.', reserve: 'Du stehst auf Nachrückerplatz {position} für {tournament}.', replacementSubject: 'European Tour: Nachrückerplatz bestätigt', replacementBody: 'Du ersetzt {withdrawn} bei {tournament}. Du steigst in Runde {round} ein.' },
    nl: { qualified: 'Gefeliciteerd! Je plaatst je voor {tournament}.', eliminated: 'Je hebt de kwalificatie voor {tournament} gemist.', reserve: 'Je bent reserve nummer {position} voor {tournament}.', replacementSubject: 'European Tour: reserveplaats bevestigd', replacementBody: 'Je vervangt {withdrawn} bij {tournament}. Je begint in ronde {round}.' }
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
    const sourceName = typeof tournament === 'object' ? tournament.sourceName : '';
    return /(?:european|continental) tour/i.test(name || '')
        || /(?:european|continental) tour/i.test(sourceName || '');
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
    return tournamentDatabase.find(tournament => tournament.name === qualifierTournament.qualifierFor)
        || tournamentDatabase.find(tournament => tournament.sourceName === qualifierTournament.qualifierFor)
        || null;
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

function hasContinentalQualificationResults(history, legacyHtml = '') {
    if (Number(history?.version) === 1 && Array.isArray(history.blocks) && Array.isArray(history.players)) {
        // Same nagłówki rund po BYE nie oznaczają rozegranego meczu.
        return history.blocks.some(block => block?.matches?.length > 0 || block?.type === 'grandSlamGroups');
    }
    return (Array.isArray(history) && history.length > 0)
        || (typeof legacyHtml === 'string' && legacyHtml.trim().length > 0);
}

function isActiveContinentalTournament(tournament) {
    return Boolean(tournament && typeof activeTournament !== 'undefined' && activeTournament
        && (activeTournament === tournament || activeTournament.name === tournament.name));
}

function hasContinentalTournamentStarted(tournament) {
    if (!tournament) return false;
    if (hasContinentalQualificationResults(tournament.matchHistory, tournament.historyLogs)
        || Object.keys(tournament.spectatedMatchResults || {}).length > 0) return true;
    if (!isActiveContinentalTournament(tournament)) return false;
    if (typeof currentMatch !== 'undefined' && currentMatch?.isTournament) return true;
    // Po zakończeniu poprzedniego turnieju historia może jeszcze pozostać
    // w pamięci; należy do aktywnego wydarzenia dopiero razem z jego drabinką.
    if (typeof tournamentBracket === 'undefined' || !tournamentBracket?.length) return false;
    return hasContinentalQualificationResults(
        typeof tournamentMatchHistory !== 'undefined' ? tournamentMatchHistory : null,
        `${typeof lastTournamentResults === 'string' ? lastTournamentResults : ''}${typeof currentRoundHTML === 'string' ? currentRoundHTML : ''}`
    );
}

function canRepairContinentalCardQualifier(mainTournament, qualifierTournament) {
    return Boolean(mainTournament && qualifierTournament
        && !mainTournament.completed && !qualifierTournament.completed
        && !hasContinentalTournamentStarted(mainTournament)
        && !hasContinentalTournamentStarted(qualifierTournament)
        && !(isActiveContinentalTournament(mainTournament)
            && typeof tournamentBracket !== 'undefined' && tournamentBracket?.length > 0));
}

function repairMigratedContinentalCardQualification(mainTournament, state) {
    const cardPath = state.paths?.card;
    if (!state.migratedLegacyQualification || state.migratedLegacyQualificationYear === state.year
        || !cardPath?.initialized || cardPath.participantIds?.length > 0) return;
    const qualifier = typeof tournamentDatabase !== 'undefined' && tournamentDatabase.find(tournament =>
        isContinentalQualifierTournament(tournament) && getContinentalQualifierPath(tournament) === 'card'
        && getLinkedContinentalTour(tournament) === mainTournament);
    if (!canRepairContinentalCardQualifier(mainTournament, qualifier)) return;

    // Starsza wersja przenosiła zeszłorocznych zwycięzców do nowego sezonu,
    // oznaczając pustą pulę jako zainicjalizowaną. Pozostałe ścieżki zachowujemy.
    state.paths.card = { participantIds: [], qualifiedPlayerIds: [], completed: false };
    delete state.migratedLegacyQualification;
}

function buildContinentalAutomaticField(candidates) {
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

    return { oomPlayers, proTourPlayers };
}

function ensureContinentalQualificationState(mainTournament, candidates = getContinentalQualificationPlayers()) {
    if (!mainTournament) return null;
    const season = getContinentalQualificationSeason();
    const existing = mainTournament.continentalQualification;
    if (existing?.version === CONTINENTAL_QUALIFICATION_VERSION && existing.year === season
        && Array.isArray(existing.oomPlayerIds) && Array.isArray(existing.proTourPlayerIds)) {
        repairMigratedContinentalCardQualification(mainTournament, existing);
        return refreshContinentalQualificationAggregate(existing);
    }
    const { oomPlayers, proTourPlayers } = buildContinentalAutomaticField(candidates);
    const state = {
        version: CONTINENTAL_QUALIFICATION_VERSION,
        year: season,
        oomPlayerIds: oomPlayers.map(getContinentalQualificationPlayerKey),
        proTourPlayerIds: proTourPlayers.map(getContinentalQualificationPlayerKey),
        paths: {},
        qualifiedPlayerIds: [],
        completed: false
    };
    if (existing?.year === season && Number(existing.version || 1) < CONTINENTAL_QUALIFICATION_VERSION
        && existing.completed && Array.isArray(existing.qualifiedPlayerIds)) {
        const cardPath = getContinentalQualificationPathState(state, 'card');
        cardPath.participantIds = Array.isArray(existing.qualifierPlayerIds) ? [...existing.qualifierPlayerIds] : [];
        cardPath.qualifiedPlayerIds = existing.qualifiedPlayerIds.slice(0, 10);
        cardPath.completed = true;
        cardPath.initialized = true;
        state.migratedLegacyQualification = true;
        state.migratedLegacyQualificationYear = season;
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

function isContinentalQualifierPathEligible(candidate, mainTournament, path) {
    if (!isContinentalQualificationPlayerEligible(candidate)) return false;
    if (path === 'card') return candidate.hasTourCard === true;
    if (candidate.hasTourCard === true) return false;
    if (path === 'host') return Boolean(mainTournament?.country && candidate.country === mainTournament.country);
    if (path === 'nordicBaltic') return CONTINENTAL_NORDIC_BALTIC_COUNTRIES.has(candidate.country);
    if (path === 'eastEurope') return CONTINENTAL_EAST_EUROPE_COUNTRIES.has(candidate.country);
    return false;
}

function buildContinentalQualifierPool(mainTournament, path, state, candidates = getContinentalQualificationPlayers()) {
    const excludedKeys = getCompletedContinentalQualifierKeys(state, path);
    const remaining = candidates.filter(candidate => isContinentalQualifierPathEligible(candidate, mainTournament, path)
        && !excludedKeys.has(getContinentalQualificationPlayerKey(candidate)));
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
        .filter(candidate => isContinentalQualifierPathEligible(candidate, mainTournament, path));
}

function shouldRefreshEmptyContinentalQualifierDraw(qualifierTournament, bracket) {
    if (!isContinentalQualifierTournament(qualifierTournament) || getContinentalQualifierPath(qualifierTournament) !== 'card'
        || !Array.isArray(bracket) || bracket.length < 2 || bracket.some(candidate => candidate && !candidate.isBye)) return false;
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    return canRepairContinentalCardQualifier(mainTournament, qualifierTournament)
        && getContinentalTourQualifierParticipants(qualifierTournament).length > 0;
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
        if (!isContinentalQualifierPathEligible(candidate, mainTournament, path)) return;
        const key = getContinentalQualificationPlayerKey(candidate);
        if (excludedKeys.has(key) || unique.has(key)) return;
        unique.set(key, candidate);
    });
    pathState.qualifiedPlayerIds = [...unique.keys()].slice(0, places);
    pathState.completed = true;
    qualifierTournament.completed = true;
    qualifierTournament.historyLogs = typeof lastTournamentResults === 'string' ? lastTournamentResults : '';
    if (path === 'card') {
        pathState.reservePlayerIds = getContinentalTourReservePlayers(mainTournament, state, candidates)
            .sort((first, second) => sortContinentalQualificationRank(first, second, 'prizeMoney'))
            .map(getContinentalQualificationPlayerKey);
    }
    return refreshContinentalQualificationAggregate(state);
}

function recordContinentalQualifierFinalLoser(qualifier, candidate, round) {
    if (!isContinentalQualifierTournament(qualifier) || getContinentalQualifierPath(qualifier) !== 'card'
        || Number(round) !== CONTINENTAL_QUALIFIER_PATHS.card.places * 2) return;
    const main = getLinkedContinentalTour(qualifier);
    if (!main || !isContinentalQualifierPathEligible(candidate, main, 'card')) return;
    const state = ensureContinentalQualificationState(main);
    const card = getContinentalQualificationPathState(state, 'card');
    const key = getContinentalQualificationPlayerKey(candidate);
    if (!card.participantIds.includes(key)) return;
    if (!Array.isArray(card.reservePlayerIds)) card.reservePlayerIds = [];
    if (!card.reservePlayerIds.includes(key)) card.reservePlayerIds.push(key);
}

// Older saves can recover actual final-round losers from compact match history.
// Missing histories and automatically filled qualifier places never invent reserves.
function recoverContinentalReservePlayerIds(main, state, candidates) {
    if (!state?.paths?.card?.completed || state.paths.card.migratedWithoutQualifier) return [];
    const qualifier = typeof tournamentDatabase !== 'undefined' && tournamentDatabase.find(event =>
        isContinentalQualifierTournament(event) && getContinentalQualifierPath(event) === 'card'
        && event.completed && getLinkedContinentalTour(event) === main);
    if (!qualifier) return [];
    const history = qualifier.matchHistory || (isActiveContinentalTournament(qualifier)
        && typeof tournamentMatchHistory !== 'undefined' ? tournamentMatchHistory : null);
    if (history?.version !== 1 || !Array.isArray(history.players) || !Array.isArray(history.blocks)) return [];
    const byHistoryKey = new Map(candidates.map(candidate => [candidate.id ? `id:${candidate.id}`
        : `name:${String(candidate.name || '').trim()}|${String(candidate.country || '').trim()}`, candidate]));
    const losers = history.blocks.filter(block => block.type === 'round' && Number(block.round) === 20)
        .flatMap(block => (block.matches || []).flatMap(match => {
            if (!Array.isArray(match) || match.length < 4 || Number(match[2]) === Number(match[3])) return [];
            const loserIndex = Number(match[2]) < Number(match[3]) ? match[0] : match[1];
            const candidate = byHistoryKey.get(history.players[loserIndex]?.[0]);
            return candidate ? [candidate] : [];
        }));
    return losers.sort((first, second) => sortContinentalQualificationRank(first, second, 'prizeMoney'))
        .map(getContinentalQualificationPlayerKey);
}

function getContinentalEffectivePlayerIds(keys, state) {
    const replacements = new Map((state?.withdrawals || []).map(entry =>
        [entry.withdrawnPlayerId, entry.replacementPlayerId]));
    return (keys || []).map(key => {
        const seen = new Set();
        while (replacements.has(key) && !seen.has(key)) {
            seen.add(key);
            key = replacements.get(key);
        }
        return key;
    });
}

function getContinentalTourReservePlayers(main, state = main?.continentalQualification,
    candidates = getContinentalQualificationPlayers()) {
    if (state?.year !== getContinentalQualificationSeason() || !state.paths?.card?.completed) return [];
    const card = state.paths.card;
    const originalField = [...(state.oomPlayerIds || []), ...(state.proTourPlayerIds || []),
        ...Object.values(state.paths || {}).flatMap(path => path.qualifiedPlayerIds || [])];
    const excluded = new Set([...originalField, ...getContinentalEffectivePlayerIds(originalField, state),
        ...(state.withdrawals || []).map(entry => entry.withdrawnPlayerId)]);
    const ids = Array.isArray(card.reservePlayerIds) ? card.reservePlayerIds
        : recoverContinentalReservePlayerIds(main, state, candidates);
    return resolveContinentalQualificationPlayers([...new Set(ids)], candidates)
        .filter(candidate => isContinentalQualifierPathEligible(candidate, main, 'card')
            && !excluded.has(getContinentalQualificationPlayerKey(candidate)));
}

function prepareContinentalTourWithdrawals(main, { skipCareerPlayer = false, random = Math.random } = {}) {
    if (!isContinentalTourTournament(main)) return null;
    const field = getContinentalTourMainField(main);
    if (!field || main.completed || hasContinentalTournamentStarted(main)) return field;
    const state = field.state;
    if (state.withdrawalsProcessed) return field;
    const candidates = getContinentalQualificationPlayers();
    const own = candidate => typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
    const reserves = getContinentalTourReservePlayers(main, state, candidates)
        .filter(candidate => !skipCareerPlayer || !own(candidate));
    if (!Array.isArray(state.paths.card.reservePlayerIds)) {
        state.paths.card.reservePlayerIds = getContinentalTourReservePlayers(main, state, candidates)
            .map(getContinentalQualificationPlayerKey);
    }
    state.withdrawals = [];
    const replace = (candidate, entryRound, forced = false) => {
        if (!reserves.length && !forced) return;
        const replacement = reserves.shift();
        state.withdrawals.push({ withdrawnPlayerId: getContinentalQualificationPlayerKey(candidate),
            replacementPlayerId: replacement ? getContinentalQualificationPlayerKey(replacement) : null,
            withdrawnPlayerName: candidate.name, replacementPlayerName: replacement?.name || '',
            entryRound });
    };
    // A deliberate career-player withdrawal uses the same queue, never a random outsider.
    if (skipCareerPlayer) {
        const careerEntrant = [...field.oomPlayers, ...field.proTourPlayers, ...field.qualifiedPlayers].find(own);
        if (careerEntrant) replace(careerEntrant, field.oomPlayers.includes(careerEntrant) ? 32 : 64, true);
    }
    field.oomPlayers.forEach(candidate => {
        if (candidate && !candidate.isBye && !own(candidate) && reserves.length
            && random() < CONTINENTAL_TOP_16_WITHDRAWAL_CHANCE) replace(candidate, 32);
    });
    state.withdrawalsProcessed = true;
    const careerEntry = state.withdrawals.find(entry => entry.replacementPlayerId
        && entry.replacementPlayerId === getContinentalQualificationPlayerKey(typeof player !== 'undefined' ? player : null));
    if (careerEntry && typeof addEmail === 'function' && typeof escapeHtml === 'function') {
        addEmail('European Tour', trContinentalQualifier('replacementSubject'),
            `<p>${escapeHtml(trContinentalQualifier('replacementBody', { withdrawn: careerEntry.withdrawnPlayerName,
                tournament: main.name, round: careerEntry.entryRound === 32 ? 2 : 1 }))}</p>`);
    }
    return getContinentalTourMainField(main);
}

function automaticallyCompleteContinentalQualifierPath(mainTournament, path, candidates) {
    const state = ensureContinentalQualificationState(mainTournament, candidates);
    const pathState = ensureContinentalQualifierPathState(mainTournament, path, candidates);
    if (pathState.completed) return pathState;
    const excludedKeys = getCompletedContinentalQualifierKeys(state, path);
    pathState.qualifiedPlayerIds = resolveContinentalQualificationPlayers(pathState.participantIds, candidates)
        .filter(candidate => !excludedKeys.has(getContinentalQualificationPlayerKey(candidate)))
        .filter(candidate => isContinentalQualifierPathEligible(candidate, mainTournament, path))
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
    const byKey = new Map(candidates.map(candidate => [getContinentalQualificationPlayerKey(candidate), candidate]));
    const resolveField = ids => getContinentalEffectivePlayerIds(ids, state).flatMap(key => key === null
        ? [createContinentalQualifierBye()] : byKey.has(key) ? [byKey.get(key)] : []);
    const paths = Object.fromEntries(Object.keys(CONTINENTAL_QUALIFIER_PATHS).map(path => [
        path,
        resolveField(getContinentalQualificationPathState(state, path).qualifiedPlayerIds)
    ]));
    const qualifiedPlayers = Object.values(paths).flat();
    const oomPlayers = resolveField(state.oomPlayerIds);
    const proTourPlayers = resolveField(state.proTourPlayerIds);
    const fieldSize = [...oomPlayers, ...proTourPlayers, ...qualifiedPlayers].filter(candidate => !candidate.isBye).length;
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
    const position = !qualified && mainTournament && typeof player !== 'undefined'
        ? getContinentalTourReservePlayers(mainTournament).findIndex(candidate =>
            getContinentalQualificationPlayerKey(candidate) === getContinentalQualificationPlayerKey(player)) + 1 : 0;
    return trContinentalQualifier(qualified ? 'qualified' : position ? 'reserve' : 'eliminated', {
        position,
        tournament: mainTournament?.name || activeTournament?.qualifierFor || ''
    });
}

function migrateContinentalTourQualifiersCalendar() {
    if (typeof syncContinentalTourQualificationCalendar === 'function') {
        return syncContinentalTourQualificationCalendar(tournamentDatabase);
    }
    return tournamentDatabase;
}
