const CROWN_MASTERS_TYPE = 'classicMasters';
const CROWN_MASTERS_QUALIFIER_TYPE = 'classicMastersQualifier';
const CROWN_MASTERS_NAME = 'Crown Masters';
const CROWN_MASTERS_QUALIFIER_NAME = 'Crown Masters Qualifier';
const CROWN_MASTERS_FIELD_SIZE = 32;
const CROWN_MASTERS_AUTOMATIC_PLACES = 24;
const CROWN_MASTERS_QUALIFYING_PLACES = 8;
const CROWN_MASTERS_SECONDARY_TOUR_PLACES = 8;
const CROWN_MASTERS_QUALIFICATION_VERSION = 1;
const CROWN_MASTERS_TEXT = Object.freeze({
    pl: Object.freeze({ qualified: 'Awansujesz do turnieju {name}!', automatic: 'Masz już bezpośredni awans do turnieju {name}.', complete: 'Kwalifikacje do turnieju {name} zostały zakończone.' }),
    en: Object.freeze({ qualified: 'You qualify for {name}!', automatic: 'You have already qualified directly for {name}.', complete: 'The qualifier for {name} is complete.' }),
    de: Object.freeze({ qualified: 'Du qualifizierst dich für {name}!', automatic: 'Du bist bereits direkt für {name} qualifiziert.', complete: 'Die Qualifikation für {name} ist beendet.' }),
    nl: Object.freeze({ qualified: 'Je plaatst je voor {name}!', automatic: 'Je bent al rechtstreeks geplaatst voor {name}.', complete: 'De kwalificatie voor {name} is afgerond.' })
});

function trCrownMasters(key, values = {}) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    return (CROWN_MASTERS_TEXT[language]?.[key] || CROWN_MASTERS_TEXT.pl[key] || key)
        .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function getCrownMastersCalendarTournament(tournamentOrName) {
    if (tournamentOrName && typeof tournamentOrName === 'object') return tournamentOrName;
    const name = String(tournamentOrName || '');
    if (!name || typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(tournament => tournament?.name === name || tournament?.sourceName === name) || null;
}

function getCrownMastersSearchableName(tournamentOrName) {
    const tournament = getCrownMastersCalendarTournament(tournamentOrName);
    return `${typeof tournamentOrName === 'string' ? tournamentOrName : ''} ${tournament?.name || ''} ${tournament?.sourceName || ''}`
        .toLocaleLowerCase('pl');
}

function isCrownMastersTournament(tournamentOrName = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    const tournament = getCrownMastersCalendarTournament(tournamentOrName);
    if (tournament?.specialType === CROWN_MASTERS_TYPE) return true;
    const name = getCrownMastersSearchableName(tournamentOrName);
    return !name.includes('qualifier') && !name.includes('kwalifikacj')
        && (name.includes('crown masters') || name.includes('winmau world masters'));
}

function isCrownMastersQualifierTournament(tournamentOrName = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    const tournament = getCrownMastersCalendarTournament(tournamentOrName);
    if (tournament?.specialType === CROWN_MASTERS_QUALIFIER_TYPE) return true;
    const name = getCrownMastersSearchableName(tournamentOrName);
    return (name.includes('crown masters') || name.includes('winmau world masters'))
        && (name.includes('qualifier') || name.includes('kwalifikacj'));
}

function getCrownMastersPlayerKey(candidate) {
    if (!candidate || candidate.isBye) return '';
    return candidate.id || `${candidate.sourceName || candidate.name || ''}|${candidate.country || ''}`;
}

function getCrownMastersCandidates(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const unique = new Map();
    source.forEach(candidate => {
        if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return;
        if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return;
        const key = getCrownMastersPlayerKey(candidate);
        if (key && !unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function compareCrownMastersOom(first, second) {
    return (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function compareCrownMastersPreseason(first, second) {
    return (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getCrownMastersPreviousTourLeaders(candidates, moneyProperty, yearProperty, previousYear) {
    return getCrownMastersCandidates(candidates)
        .filter(candidate => candidate.hasTourCard !== true
            && Number(candidate?.[yearProperty]) === previousYear
            && (Number(candidate?.[moneyProperty]) || 0) > 0)
        .sort((first, second) => (Number(second?.[moneyProperty]) || 0) - (Number(first?.[moneyProperty]) || 0)
            || compareCrownMastersPreseason(first, second));
}

function getCrownMastersMainTournament(tournamentOrName) {
    const tournament = getCrownMastersCalendarTournament(tournamentOrName);
    if (isCrownMastersTournament(tournament)) return tournament;
    if (!isCrownMastersQualifierTournament(tournament) || !Array.isArray(tournamentDatabase)) return null;
    const linkedNames = [tournament.qualifierFor, tournament.sourceQualifierFor].filter(Boolean);
    return tournamentDatabase.find(candidate => linkedNames.includes(candidate?.name) || linkedNames.includes(candidate?.sourceName))
        || tournamentDatabase.find(candidate => candidate?.specialType === CROWN_MASTERS_TYPE)
        || null;
}

function getCrownMastersQualifierTournament(mainTournament) {
    const main = getCrownMastersMainTournament(mainTournament);
    if (!main || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(candidate => candidate?.specialType === CROWN_MASTERS_QUALIFIER_TYPE
        && [main.name, main.sourceName].filter(Boolean).includes(candidate.qualifierFor))
        || tournamentDatabase.find(candidate => candidate?.specialType === CROWN_MASTERS_QUALIFIER_TYPE)
        || null;
}

function resolveCrownMastersPlayerKeys(keys, candidates) {
    const players = getCrownMastersCandidates(candidates);
    const byKey = new Map(players.map(candidate => [getCrownMastersPlayerKey(candidate), candidate]));
    return (Array.isArray(keys) ? keys : []).map(key => byKey.get(key)).filter(Boolean);
}

function completeCrownMastersSecondaryTourLeaders(ranked, fallback, excludedKeys) {
    const selected = [];
    const used = new Set(excludedKeys || []);
    const add = candidate => {
        const key = getCrownMastersPlayerKey(candidate);
        if (!key || used.has(key) || selected.length >= CROWN_MASTERS_SECONDARY_TOUR_PLACES) return;
        used.add(key);
        selected.push(candidate);
    };
    ranked.forEach(add);
    fallback.forEach(add);
    return selected;
}

function buildCrownMastersQualificationState(candidates, referenceDate) {
    const all = getCrownMastersCandidates(candidates);
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate || Date.now());
    const safeDate = Number.isNaN(date.getTime()) ? new Date(2026, 0, 28) : date;
    const cardHolders = all.filter(candidate => candidate.hasTourCard === true).sort(compareCrownMastersOom);
    const automatic = cardHolders.slice(0, CROWN_MASTERS_AUTOMATIC_PLACES);
    const automaticKeys = new Set(automatic.map(getCrownMastersPlayerKey));

    const previousYear = safeDate.getFullYear() - 1;
    const challengeRanked = getCrownMastersPreviousTourLeaders(
        all, 'previousChallengeTourPrizeMoney', 'previousChallengeTourYear', previousYear
    );
    const challengeFallback = (typeof getChallengeTourEligiblePlayers === 'function'
        ? getChallengeTourEligiblePlayers(all)
        : all.filter(candidate => candidate.hasTourCard !== true)).sort(compareCrownMastersPreseason);
    const challengeLeaders = completeCrownMastersSecondaryTourLeaders(
        challengeRanked,
        challengeFallback,
        automaticKeys
    );

    const usedForDevelopment = new Set([...automaticKeys, ...challengeLeaders.map(getCrownMastersPlayerKey)]);
    const developmentRanked = getCrownMastersPreviousTourLeaders(
        all, 'previousDevelopmentTourPrizeMoney', 'previousDevelopmentTourYear', previousYear
    );
    const developmentFallback = (typeof getDevelopmentTourEligiblePlayers === 'function'
        ? getDevelopmentTourEligiblePlayers(all, safeDate)
        : all).filter(candidate => candidate.hasTourCard !== true).sort(compareCrownMastersPreseason);
    const developmentLeaders = completeCrownMastersSecondaryTourLeaders(
        developmentRanked,
        developmentFallback,
        usedForDevelopment
    );

    const qualifierPlayers = [];
    const qualifierKeys = new Set(automaticKeys);
    const addQualifier = candidate => {
        const key = getCrownMastersPlayerKey(candidate);
        if (!key || qualifierKeys.has(key)) return;
        qualifierKeys.add(key);
        qualifierPlayers.push(candidate);
    };
    cardHolders.slice(CROWN_MASTERS_AUTOMATIC_PLACES).forEach(addQualifier);
    challengeLeaders.forEach(addQualifier);
    developmentLeaders.forEach(addQualifier);

    return {
        version: CROWN_MASTERS_QUALIFICATION_VERSION,
        year: safeDate.getFullYear(),
        qualifyingPlaces: CROWN_MASTERS_QUALIFYING_PLACES,
        automaticPlayerIds: automatic.map(getCrownMastersPlayerKey),
        challengeTourPlayerIds: challengeLeaders.map(getCrownMastersPlayerKey),
        developmentTourPlayerIds: developmentLeaders.map(getCrownMastersPlayerKey),
        qualifierPlayerIds: qualifierPlayers.map(getCrownMastersPlayerKey),
        qualifiedPlayerIds: [],
        completed: false
    };
}

function ensureCrownMastersQualificationState(tournamentOrName, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    const mainTournament = getCrownMastersMainTournament(tournamentOrName);
    if (!mainTournament) return null;
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate || Date.now());
    const year = Number.isNaN(date.getTime()) ? 2026 : date.getFullYear();
    const existing = mainTournament.crownMastersQualification;
    if (existing?.version === CROWN_MASTERS_QUALIFICATION_VERSION && existing.year === year
        && Array.isArray(existing.automaticPlayerIds) && Array.isArray(existing.qualifierPlayerIds)) {
        if (!Array.isArray(existing.qualifiedPlayerIds)) existing.qualifiedPlayerIds = [];
        return existing;
    }
    const state = buildCrownMastersQualificationState(candidates, date);
    mainTournament.crownMastersQualification = state;
    return state;
}

function previewCrownMastersQualification(tournamentOrName, candidates, referenceDate) {
    const mainTournament = getCrownMastersMainTournament(tournamentOrName);
    if (!mainTournament) return null;
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate || Date.now());
    const year = Number.isNaN(date.getTime()) ? 2026 : date.getFullYear();
    const saved = mainTournament.crownMastersQualification;
    if (saved?.version === CROWN_MASTERS_QUALIFICATION_VERSION && saved.year === year) return saved;
    return buildCrownMastersQualificationState(candidates, date);
}

function getCrownMastersQualifierParticipants(qualifierTournament, candidates) {
    const state = ensureCrownMastersQualificationState(qualifierTournament, candidates);
    return resolveCrownMastersPlayerKeys(state?.qualifierPlayerIds, candidates);
}

function isCareerPlayerAutomaticallyQualifiedForCrownMasters(qualifierTournament, candidate = (typeof player !== 'undefined' ? player : null)) {
    const state = ensureCrownMastersQualificationState(qualifierTournament);
    return Boolean(state?.automaticPlayerIds?.includes(getCrownMastersPlayerKey(candidate)));
}

function isCareerPlayerEligibleForCrownMastersQualifier(qualifierTournament, candidate = (typeof player !== 'undefined' ? player : null)) {
    const state = ensureCrownMastersQualificationState(qualifierTournament);
    return Boolean(state?.qualifierPlayerIds?.includes(getCrownMastersPlayerKey(candidate)));
}

function getCrownMastersQualifierOpeningRound(participantCount) {
    let size = 16;
    while (size < Math.max(Number(participantCount) || 0, CROWN_MASTERS_QUALIFYING_PLACES * 2)) size *= 2;
    return size;
}

function createCrownMastersBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

function shuffleCrownMastersPlayers(players, random = Math.random) {
    const result = [...players];
    for (let index = result.length - 1; index > 0; index--) {
        const target = Math.floor(random() * (index + 1));
        [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
}

function buildCrownMastersQualifierDraw(participants, random = Math.random) {
    const entrants = shuffleCrownMastersPlayers(getCrownMastersCandidates(participants), random);
    const bracketSize = getCrownMastersQualifierOpeningRound(entrants.length);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;
    for (; index < byeCount && index < entrants.length; index++) draw.push(entrants[index], createCrownMastersBye());
    for (; index < entrants.length; index += 2) draw.push(entrants[index], entrants[index + 1] || createCrownMastersBye());
    while (draw.length < bracketSize) draw.push(createCrownMastersBye());
    return draw;
}

function completeCrownMastersQualifier(qualifierTournament, qualifiedPlayers, candidates) {
    const mainTournament = getCrownMastersMainTournament(qualifierTournament);
    const state = ensureCrownMastersQualificationState(qualifierTournament, candidates);
    if (!mainTournament || !state) return null;
    const entrantKeys = new Set(state.qualifierPlayerIds);
    const qualifiers = getCrownMastersCandidates(qualifiedPlayers)
        .filter(candidate => entrantKeys.has(getCrownMastersPlayerKey(candidate)))
        .slice(0, CROWN_MASTERS_QUALIFYING_PLACES);
    state.qualifiedPlayerIds = qualifiers.map(getCrownMastersPlayerKey);
    state.completed = state.qualifiedPlayerIds.length === CROWN_MASTERS_QUALIFYING_PLACES;
    qualifierTournament.completed = state.completed;
    return state;
}

function getCrownMastersMainParticipants(mainTournament, candidates) {
    const qualifierTournament = getCrownMastersQualifierTournament(mainTournament);
    const state = ensureCrownMastersQualificationState(mainTournament, candidates);
    if (!state) return [];
    if (!state.completed && qualifierTournament?.completed !== true) {
        // Awaryjna migracja: normalny kalendarz zawsze rozgrywa kwalifikator dzień
        // wcześniej. Uzupełnienie zapobiega pustej obsadzie w ręcznie zmienionym zapisie.
        state.qualifiedPlayerIds = state.qualifierPlayerIds.slice(0, CROWN_MASTERS_QUALIFYING_PLACES);
        state.completed = true;
        state.migratedWithoutQualifier = true;
    }
    const automatic = resolveCrownMastersPlayerKeys(state.automaticPlayerIds, candidates);
    const qualifiers = resolveCrownMastersPlayerKeys(state.qualifiedPlayerIds, candidates);
    const field = getCrownMastersCandidates([...automatic, ...qualifiers]);
    const used = new Set(field.map(getCrownMastersPlayerKey));
    const addReplacement = candidate => {
        const key = getCrownMastersPlayerKey(candidate);
        if (!key || used.has(key) || field.length >= CROWN_MASTERS_FIELD_SIZE) return;
        used.add(key);
        field.push(candidate);
    };
    resolveCrownMastersPlayerKeys(state.mainReplacementPlayerIds, candidates).forEach(addReplacement);
    resolveCrownMastersPlayerKeys(state.qualifierPlayerIds, candidates).forEach(addReplacement);
    getCrownMastersCandidates(candidates).sort(compareCrownMastersOom).forEach(addReplacement);
    state.mainReplacementPlayerIds = field
        .filter(candidate => !state.automaticPlayerIds.includes(getCrownMastersPlayerKey(candidate))
            && !state.qualifiedPlayerIds.includes(getCrownMastersPlayerKey(candidate)))
        .map(getCrownMastersPlayerKey);
    return field.slice(0, CROWN_MASTERS_FIELD_SIZE);
}

function buildCrownMastersDraw(participants, tournament, random = Math.random) {
    const entrants = getCrownMastersCandidates(participants);
    const state = tournament?.crownMastersQualification;
    const byKey = new Map(entrants.map(candidate => [getCrownMastersPlayerKey(candidate), candidate]));
    const seeds = (state?.automaticPlayerIds || []).slice(0, 16).map(key => byKey.get(key)).filter(Boolean);
    const seedKeys = new Set(seeds.map(getCrownMastersPlayerKey));
    const unseeded = shuffleCrownMastersPlayers(entrants.filter(candidate => !seedKeys.has(getCrownMastersPlayerKey(candidate))), random);
    const seedOrder = [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11];
    const draw = new Array(CROWN_MASTERS_FIELD_SIZE);
    for (let index = 0; index < 16; index++) {
        draw[index * 2] = seeds[seedOrder[index] - 1] || unseeded.shift() || createCrownMastersBye();
        draw[index * 2 + 1] = unseeded.shift() || createCrownMastersBye();
    }
    return draw;
}

function getCrownMastersPrizeMoney(tournamentOrName, round, won) {
    if (isCrownMastersQualifierTournament(tournamentOrName)) {
        if (won) return 0;
        return ({ 64: 750, 32: 1000, 16: 2500 })[Number(round)] || 0;
    }
    if (!isCrownMastersTournament(tournamentOrName)) return 0;
    if (won && Number(round) === 2) return 100000;
    return ({ 2: 50000, 4: 30000, 8: 17500, 16: 10000, 32: 5000 })[Number(round)] || 0;
}

function getCrownMastersMatchFormat(tournamentOrName, round) {
    if (isCrownMastersQualifierTournament(tournamentOrName)) {
        return { type: 'sets', setsToWin: 3, legsPerSet: 2 };
    }
    const setsToWin = Number(round) >= 32 ? 3 : Number(round) >= 8 ? 4 : Number(round) === 4 ? 5 : 6;
    return { type: 'sets', setsToWin, legsPerSet: 2 };
}

function getCrownMastersQualifierOutcomeMessage(qualifierTournament, candidate = (typeof player !== 'undefined' ? player : null)) {
    const mainTournament = getCrownMastersMainTournament(qualifierTournament);
    const state = mainTournament?.crownMastersQualification;
    const qualified = state?.qualifiedPlayerIds?.includes(getCrownMastersPlayerKey(candidate));
    const name = mainTournament?.name || CROWN_MASTERS_NAME;
    if (qualified) return trCrownMasters('qualified', { name });
    if (state?.automaticPlayerIds?.includes(getCrownMastersPlayerKey(candidate))) return trCrownMasters('automatic', { name });
    return trCrownMasters('complete', { name });
}
