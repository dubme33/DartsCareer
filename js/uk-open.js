const UK_OPEN_TYPE = 'ukOpen';
const UK_OPEN_QUALIFICATION_VERSION = 2;
const UK_OPEN_FIELD_SIZE = 160;
const UK_OPEN_CARD_HOLDER_PLACES = 128;
const UK_OPEN_SIDE_TOUR_PLACES = 16;
const UK_OPEN_STAGE_DRAW_SIZE = 64;

const UK_OPEN_PRIZE_MONEY = Object.freeze({
    winner: 120000,
    2: 60000,
    4: 35000,
    8: 20000,
    16: 12500,
    32: 7500,
    64: 3000,
    96: 2000,
    128: 1250,
    160: 0
});

const UK_OPEN_GROUPS = Object.freeze([
    Object.freeze({ key: 'ukOpenOom1To32', places: 32, stateKey: 'oom1To32PlayerIds', entryRound: 64 }),
    Object.freeze({ key: 'ukOpenOom33To64', places: 32, stateKey: 'oom33To64PlayerIds', entryRound: 96 }),
    Object.freeze({ key: 'ukOpenOom65To96', places: 32, stateKey: 'oom65To96PlayerIds', entryRound: 128 }),
    Object.freeze({ key: 'ukOpenOom97To128', places: 32, stateKey: 'oom97To128PlayerIds', entryRound: 160 }),
    Object.freeze({ key: 'ukOpenChallenge16', places: 16, stateKey: 'challengeTourPlayerIds', entryRound: 160 }),
    Object.freeze({ key: 'ukOpenDevelopment16', places: 16, stateKey: 'developmentTourPlayerIds', entryRound: 160 })
]);

function getUKOpenSearchableName(tournamentOrName) {
    if (tournamentOrName && typeof tournamentOrName === 'object') {
        return `${tournamentOrName.name || ''} ${tournamentOrName.sourceName || ''}`.toLocaleLowerCase('pl');
    }
    const name = String(tournamentOrName || '');
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === name || candidate?.sourceName === name)
        : null;
    return `${name} ${tournament?.name || ''} ${tournament?.sourceName || ''}`.toLocaleLowerCase('pl');
}

function isUKOpenTournament(tournamentOrName = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    if (tournamentOrName && typeof tournamentOrName === 'object'
        && tournamentOrName.specialType === UK_OPEN_TYPE) return true;
    const name = getUKOpenSearchableName(tournamentOrName);
    return name.includes('uk open') || name.includes('british open');
}

function getUKOpenPlayerKey(candidate) {
    if (!candidate || candidate.isBye) return '';
    if (typeof getPdcTourCardPlayerKey === 'function') return getPdcTourCardPlayerKey(candidate);
    return candidate.id || `${candidate.sourceName || candidate.name || ''}|${candidate.country || ''}`;
}

function getUKOpenCandidates(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const unique = new Map();
    source.forEach(candidate => {
        if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return;
        if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return;
        const key = getUKOpenPlayerKey(candidate);
        if (key && !unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function compareUKOpenOom(first, second) {
    return (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getUKOpenSideTourLeaders(ranked, usedKeys) {
    const selected = [];
    for (const candidate of ranked) {
        const key = getUKOpenPlayerKey(candidate);
        if (!key || candidate.hasTourCard === true || usedKeys.has(key)) continue;
        usedKeys.add(key);
        selected.push(candidate);
        if (selected.length >= UK_OPEN_SIDE_TOUR_PLACES) break;
    }
    return selected;
}

function buildUKOpenQualificationState(candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    const all = getUKOpenCandidates(candidates);
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate || Date.now());
    const safeDate = Number.isNaN(date.getTime()) ? new Date(2026, 2, 6) : date;
    const cardHolders = all.filter(candidate => candidate.hasTourCard === true)
        .sort(compareUKOpenOom).slice(0, UK_OPEN_CARD_HOLDER_PLACES);
    const nonCardKeys = new Set(cardHolders.map(getUKOpenPlayerKey));
    const challengeRanking = typeof getChallengeTourOrderOfMerit === 'function'
        ? getChallengeTourOrderOfMerit(all, { includeZero: true })
        : all.filter(candidate => candidate.hasTourCard !== true).sort(compareUKOpenOom);
    const challengePlayers = getUKOpenSideTourLeaders(challengeRanking, nonCardKeys);
    const developmentRanking = typeof getDevelopmentTourEligiblePlayers === 'function'
        ? getDevelopmentTourEligiblePlayers(all, safeDate)
        : (typeof getDevelopmentTourOrderOfMerit === 'function'
            ? getDevelopmentTourOrderOfMerit(all, { includeZero: true })
            : all.filter(candidate => candidate.hasTourCard !== true).sort(compareUKOpenOom));
    const developmentPlayers = getUKOpenSideTourLeaders(developmentRanking, nonCardKeys);

    return {
        version: UK_OPEN_QUALIFICATION_VERSION,
        year: safeDate.getFullYear(),
        oom1To32PlayerIds: cardHolders.slice(0, 32).map(getUKOpenPlayerKey),
        oom33To64PlayerIds: cardHolders.slice(32, 64).map(getUKOpenPlayerKey),
        oom65To96PlayerIds: cardHolders.slice(64, 96).map(getUKOpenPlayerKey),
        oom97To128PlayerIds: cardHolders.slice(96, 128).map(getUKOpenPlayerKey),
        challengeTourPlayerIds: challengePlayers.map(getUKOpenPlayerKey),
        developmentTourPlayerIds: developmentPlayers.map(getUKOpenPlayerKey)
    };
}

function isValidUKOpenQualificationState(state, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate || Date.now());
    const year = Number.isNaN(date.getTime()) ? 2026 : date.getFullYear();
    if (!state || state.version !== UK_OPEN_QUALIFICATION_VERSION || state.year !== year
        || !UK_OPEN_GROUPS.every(group => Array.isArray(state[group.stateKey])
            && state[group.stateKey].length === group.places)) return false;
    const playerIds = UK_OPEN_GROUPS.flatMap(group => state[group.stateKey]);
    return playerIds.length === UK_OPEN_FIELD_SIZE && new Set(playerIds).size === UK_OPEN_FIELD_SIZE;
}

function ensureUKOpenQualificationState(tournament, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    if (!tournament) return buildUKOpenQualificationState(candidates, referenceDate);
    if (!isValidUKOpenQualificationState(tournament.ukOpenQualification, referenceDate)) {
        const availablePlayers = getUKOpenCandidates(candidates);
        if (availablePlayers.filter(candidate => candidate.hasTourCard === true).length < UK_OPEN_CARD_HOLDER_PLACES
            && typeof fillPdcTourCardVacancies === 'function') {
            fillPdcTourCardVacancies(availablePlayers, referenceDate, 'vacancy');
        }
        tournament.ukOpenQualification = buildUKOpenQualificationState(candidates, referenceDate);
    }
    return tournament.ukOpenQualification;
}

function previewUKOpenQualificationState(tournament, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    return isValidUKOpenQualificationState(tournament?.ukOpenQualification, referenceDate)
        ? tournament.ukOpenQualification
        : buildUKOpenQualificationState(candidates, referenceDate);
}

function resolveUKOpenPlayerIds(ids, candidates) {
    const byKey = new Map(getUKOpenCandidates(candidates).map(candidate => [getUKOpenPlayerKey(candidate), candidate]));
    return (Array.isArray(ids) ? ids : []).map(key => byKey.get(key)).filter(candidate => candidate
        && (typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate)));
}

function getUKOpenQualificationGroups(tournament, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null), lock = false) {
    const state = lock
        ? ensureUKOpenQualificationState(tournament, candidates, referenceDate)
        : previewUKOpenQualificationState(tournament, candidates, referenceDate);
    return UK_OPEN_GROUPS.map(group => ({
        key: group.key,
        places: group.places,
        entryRound: group.entryRound,
        players: resolveUKOpenPlayerIds(state[group.stateKey], candidates)
    }));
}

function getUKOpenFullField(tournament, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null), lock = true) {
    return getUKOpenQualificationGroups(tournament, candidates, referenceDate, lock)
        .flatMap(group => group.players);
}

function getUKOpenPlayerEntryRound(tournament, candidate, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    const key = getUKOpenPlayerKey(candidate);
    if (!key || !isUKOpenTournament(tournament)) return null;
    const group = getUKOpenQualificationGroups(tournament, candidates, referenceDate)
        .find(group => group.players.some(entrant => getUKOpenPlayerKey(entrant) === key));
    return group?.entryRound || null;
}

function getUKOpenOpeningParticipants(tournament, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    return getUKOpenQualificationGroups(tournament, candidates, referenceDate, true)
        .filter(group => group.entryRound === 160).flatMap(group => group.players);
}

function createUKOpenBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

function shuffleUKOpenPlayers(players, random = Math.random) {
    const shuffled = [...players];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function buildUKOpenStageDraw(participants, targetSize = UK_OPEN_STAGE_DRAW_SIZE, random = Math.random) {
    const field = getUKOpenCandidates(participants).slice(0, targetSize);
    while (field.length < targetSize) field.push(createUKOpenBye());
    return shuffleUKOpenPlayers(field, random);
}

function getUKOpenNextStage(tournament, winners, completedRound, candidates, random = Math.random) {
    const nextRoundByRound = { 160: 128, 128: 96, 96: 64, 64: 32, 32: 16, 16: 8, 8: 4, 4: 2, 2: 1 };
    const nextRound = nextRoundByRound[Number(completedRound)] || Math.max(1, Number(completedRound) / 2);
    const entrantRound = [128, 96, 64].includes(nextRound) ? nextRound : null;
    let nextPlayers = getUKOpenCandidates(winners);
    if (entrantRound) {
        const group = getUKOpenQualificationGroups(tournament, candidates, undefined, true)
            .find(candidateGroup => candidateGroup.entryRound === entrantRound);
        nextPlayers = [...nextPlayers, ...(group?.players || [])];
        return { round: nextRound, bracket: buildUKOpenStageDraw(nextPlayers, UK_OPEN_STAGE_DRAW_SIZE, random) };
    }
    return { round: nextRound, bracket: shuffleUKOpenPlayers(nextPlayers, random) };
}

function removeUKOpenParticipant(tournament, candidate, candidates) {
    const state = ensureUKOpenQualificationState(tournament, candidates);
    const key = getUKOpenPlayerKey(candidate);
    if (!key) return false;
    let removed = false;
    UK_OPEN_GROUPS.forEach(group => {
        const ids = state[group.stateKey];
        const filtered = ids.filter(id => id !== key);
        if (filtered.length !== ids.length) {
            state[group.stateKey] = filtered;
            removed = true;
        }
    });
    return removed;
}

function getUKOpenPrizeMoney(round, won) {
    if (won && Number(round) === 2) return UK_OPEN_PRIZE_MONEY.winner;
    return UK_OPEN_PRIZE_MONEY[Number(round)] || 0;
}

function getUKOpenMatchFormat(round) {
    const numericRound = Number(round);
    if ([160, 128, 96].includes(numericRound)) return { type: 'legs', legsToWin: 6 };
    if ([4, 2].includes(numericRound)) return { type: 'legs', legsToWin: 11 };
    return { type: 'legs', legsToWin: 10 };
}

function getUKOpenRoundName(round) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const labels = {
        pl: { 160: '1. runda (Last 160)', 128: '2. runda (Last 128)', 96: '3. runda (Last 96)', 64: '4. runda (Last 64)' },
        en: { 160: 'Round 1 (Last 160)', 128: 'Round 2 (Last 128)', 96: 'Round 3 (Last 96)', 64: 'Round 4 (Last 64)' },
        de: { 160: 'Runde 1 (Letzte 160)', 128: 'Runde 2 (Letzte 128)', 96: 'Runde 3 (Letzte 96)', 64: 'Runde 4 (Letzte 64)' },
        nl: { 160: 'Ronde 1 (Laatste 160)', 128: 'Ronde 2 (Laatste 128)', 96: 'Ronde 3 (Laatste 96)', 64: 'Ronde 4 (Laatste 64)' }
    };
    return labels[language]?.[Number(round)] || labels.pl[Number(round)] || '';
}
