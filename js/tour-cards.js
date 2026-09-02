const PDC_TOUR_CARD_SYSTEM_VERSION = 1;
const PDC_TOUR_CARD_CYCLE_START_YEAR = 2026;
const PDC_TOUR_CARD_CYCLE_LENGTH = 2;
const PDC_TOUR_CARD_OOM_PLACES = 64;
const PDC_TOUR_CARD_QSCHOOL_PLACES = 64;
const PDC_TOUR_CARD_TOTAL = PDC_TOUR_CARD_OOM_PLACES + PDC_TOUR_CARD_QSCHOOL_PLACES;
const PDC_QSCHOOL_TYPE = 'pdcQSchool';
const PDC_TOUR_CARD_QUALIFIER_TYPE = 'pdcTourCardQualifier';
const PDC_QSCHOOL_DRAW_VERSION = 2;

function getPdcTourCardReferenceYear(referenceDate = currentDate) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    return Number.isNaN(date.getTime()) ? PDC_TOUR_CARD_CYCLE_START_YEAR : date.getFullYear();
}

function getPdcTourCardCycleYear(referenceDate = currentDate) {
    const year = getPdcTourCardReferenceYear(referenceDate);
    if (year <= PDC_TOUR_CARD_CYCLE_START_YEAR) return PDC_TOUR_CARD_CYCLE_START_YEAR;
    return PDC_TOUR_CARD_CYCLE_START_YEAR
        + Math.floor((year - PDC_TOUR_CARD_CYCLE_START_YEAR) / PDC_TOUR_CARD_CYCLE_LENGTH) * PDC_TOUR_CARD_CYCLE_LENGTH;
}

function isPdcQSchoolYear(yearOrDate = currentDate) {
    const year = yearOrDate instanceof Date
        ? getPdcTourCardReferenceYear(yearOrDate)
        : Number(yearOrDate);
    return Number.isInteger(year)
        && year >= PDC_TOUR_CARD_CYCLE_START_YEAR
        && (year - PDC_TOUR_CARD_CYCLE_START_YEAR) % PDC_TOUR_CARD_CYCLE_LENGTH === 0;
}

function isPdcQSchoolTournament(tournament = activeTournament) {
    return Boolean(tournament && tournament.specialType === PDC_QSCHOOL_TYPE);
}

function isPdcTourCardQualifierTournament(tournament = activeTournament) {
    return Boolean(tournament && tournament.specialType === PDC_TOUR_CARD_QUALIFIER_TYPE);
}

function isTournamentScheduledForCareerYear(tournament, year = getPdcTourCardReferenceYear()) {
    if (!isPdcQSchoolTournament(tournament)) return true;
    return isPdcQSchoolYear(year);
}

function isPdcTourCardEligiblePlayer(candidate) {
    if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return false;
    if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return false;
    return true;
}

function getPdcTourCardPlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id || `${candidate.name || ''}|${candidate.country || ''}`;
}

function uniquePdcTourCardPlayers(candidates) {
    const unique = new Map();
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (!isPdcTourCardEligiblePlayer(candidate)) return;
        const key = getPdcTourCardPlayerKey(candidate);
        if (!unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function getPdcTourCardPlayers(includeCareerPlayer = true) {
    const candidates = Array.isArray(pdcPlayers) ? [...pdcPlayers] : [];
    if (includeCareerPlayer && typeof player !== 'undefined' && player?.name) candidates.push(player);
    return uniquePdcTourCardPlayers(candidates);
}

function comparePdcTourCardRanking(first, second) {
    return (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function setPdcTourCard(candidate, source, cycleYear) {
    if (!candidate) return candidate;
    candidate.hasTourCard = true;
    candidate.tourCardSource = source;
    candidate.tourCardStartYear = cycleYear;
    candidate.tourCardExpiryYear = cycleYear + PDC_TOUR_CARD_CYCLE_LENGTH;
    candidate.tourCardCycleYear = cycleYear;
    candidate.tourCardSystemVersion = PDC_TOUR_CARD_SYSTEM_VERSION;
    return candidate;
}

function clearPdcTourCard(candidate, cycleYear) {
    if (!candidate) return candidate;
    candidate.hasTourCard = false;
    candidate.tourCardSource = null;
    candidate.tourCardStartYear = null;
    candidate.tourCardExpiryYear = null;
    candidate.tourCardCycleYear = cycleYear;
    candidate.tourCardSystemVersion = PDC_TOUR_CARD_SYSTEM_VERSION;
    return candidate;
}

function beginPdcTourCardCycle(candidates, referenceDate = currentDate) {
    const cycleYear = getPdcTourCardCycleYear(referenceDate);
    const ranked = uniquePdcTourCardPlayers(candidates).sort(comparePdcTourCardRanking);

    ranked.forEach(candidate => clearPdcTourCard(candidate, cycleYear));
    ranked.slice(0, PDC_TOUR_CARD_OOM_PLACES)
        .forEach(candidate => setPdcTourCard(candidate, 'oom', cycleYear));
    return ranked;
}

function migratePdcTourCardSystem(candidates, referenceDate = currentDate) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    const safeDate = Number.isNaN(date.getTime()) ? new Date(PDC_TOUR_CARD_CYCLE_START_YEAR, 0, 1) : date;
    const cycleYear = getPdcTourCardCycleYear(safeDate);
    const ranked = uniquePdcTourCardPlayers(candidates).sort(comparePdcTourCardRanking);
    const hasCurrentSystem = ranked.some(candidate => candidate.tourCardSystemVersion === PDC_TOUR_CARD_SYSTEM_VERSION);

    if (!hasCurrentSystem) {
        beginPdcTourCardCycle(ranked, safeDate);
        const qSchoolAlreadyPassed = safeDate.getFullYear() > cycleYear
            || (safeDate.getFullYear() === cycleYear && (safeDate.getMonth() > 0 || safeDate.getDate() > 11));
        if (qSchoolAlreadyPassed) {
            ranked.slice(PDC_TOUR_CARD_OOM_PLACES, PDC_TOUR_CARD_TOTAL)
                .forEach(candidate => setPdcTourCard(candidate, 'qschool-migration', cycleYear));
        }
        return ranked;
    }

    ranked.forEach(candidate => {
        const expiryYear = Number(candidate.tourCardExpiryYear);
        const hasValidCard = candidate.hasTourCard === true
            && Number.isInteger(expiryYear)
            && expiryYear > safeDate.getFullYear();
        if (!hasValidCard) clearPdcTourCard(candidate, cycleYear);
        else candidate.tourCardSystemVersion = PDC_TOUR_CARD_SYSTEM_VERSION;
    });
    return ranked;
}

function processPdcTourCardCycleStart(candidates, referenceDate = currentDate) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    if (Number.isNaN(date.getTime()) || date.getMonth() !== 0 || date.getDate() !== 1 || !isPdcQSchoolYear(date)) {
        return false;
    }
    const cycleYear = getPdcTourCardCycleYear(date);
    const players = uniquePdcTourCardPlayers(candidates);
    if (players.some(candidate => candidate.tourCardCycleYear === cycleYear)) return false;
    beginPdcTourCardCycle(players, date);
    return true;
}

function getPdcTourCardHolders(candidates = getPdcTourCardPlayers()) {
    return uniquePdcTourCardPlayers(candidates).filter(candidate => candidate.hasTourCard === true);
}

function getPdcNonCardPlayers(candidates = getPdcTourCardPlayers()) {
    return uniquePdcTourCardPlayers(candidates)
        .filter(candidate => candidate.hasTourCard !== true)
        .sort(comparePdcTourCardRanking);
}

function getPdcQSchoolParticipants(candidates = getPdcTourCardPlayers()) {
    return getPdcNonCardPlayers(candidates);
}

function getPdcQSchoolOpeningRound(participantCount) {
    let bracketSize = 128;
    while (bracketSize < participantCount) bracketSize *= 2;
    return bracketSize;
}

function getPdcTourCardQualifierMainTournament(qualifierTournament) {
    if (!qualifierTournament?.qualifierFor || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(tournament => tournament.name === qualifierTournament.qualifierFor)
        || tournamentDatabase.find(tournament => tournament.sourceName === qualifierTournament.qualifierFor)
        || null;
}

function buildPdcTourCardAutomaticField(mainTournament, candidates = getPdcTourCardPlayers()) {
    const allPlayers = uniquePdcTourCardPlayers(candidates);
    const name = String(mainTournament?.name || '').toLowerCase();
    const oomRanked = [...allPlayers].sort(comparePdcTourCardRanking);
    const proTourRanked = [...allPlayers].sort((first, second) =>
        (Number(second.proTourPrizeMoney) || 0) - (Number(first.proTourPrizeMoney) || 0)
        || comparePdcTourCardRanking(first, second));
    const qualified = new Set();

    if (name.includes('champion\'s slam') || name.includes('grand slam')) {
        oomRanked.slice(0, 16).forEach(candidate => qualified.add(candidate));
        for (const candidate of proTourRanked) {
            qualified.add(candidate);
            if (qualified.size >= 40) break;
        }
    } else if (name.includes('world darts championship') || name.includes('global darts championship')) {
        oomRanked.slice(0, 32).forEach(candidate => qualified.add(candidate));
        for (const candidate of proTourRanked) {
            qualified.add(candidate);
            if (qualified.size >= 64) break;
        }
        for (const candidate of oomRanked) {
            qualified.add(candidate);
            if (qualified.size >= 96) break;
        }
    }
    return [...qualified];
}

function ensurePdcTourCardQualificationState(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    if (!mainTournament) return null;
    const year = getPdcTourCardReferenceYear();
    const existing = mainTournament.pdcTourCardQualification;
    if (existing?.year === year && Array.isArray(existing.automaticPlayerIds)
        && Array.isArray(existing.qualifierPlayerIds)) {
        if (!Array.isArray(existing.qualifiedPlayerIds)) existing.qualifiedPlayerIds = [];
        existing.qualifyingPlaces = Math.max(1, Number(existing.qualifyingPlaces)
            || Number(qualifierTournament.qualifyingPlaces) || 8);
        return existing;
    }

    const allPlayers = uniquePdcTourCardPlayers(candidates);
    const automaticPlayers = buildPdcTourCardAutomaticField(mainTournament, allPlayers);
    const automaticKeys = new Set(automaticPlayers.map(getPdcTourCardPlayerKey));
    const qualifierPlayers = getPdcTourCardHolders(allPlayers)
        .filter(candidate => !automaticKeys.has(getPdcTourCardPlayerKey(candidate)))
        .sort(comparePdcTourCardRanking);
    const state = {
        version: 1,
        year,
        qualifyingPlaces: Math.max(1, Number(qualifierTournament.qualifyingPlaces) || 8),
        automaticPlayerIds: automaticPlayers.map(getPdcTourCardPlayerKey),
        qualifierPlayerIds: qualifierPlayers.map(getPdcTourCardPlayerKey),
        qualifiedPlayerIds: [],
        completed: false
    };
    mainTournament.pdcTourCardQualification = state;
    return state;
}

function resolvePdcTourCardPlayerKeys(keys, candidates = getPdcTourCardPlayers()) {
    const byKey = new Map(uniquePdcTourCardPlayers(candidates).map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    return (Array.isArray(keys) ? keys : []).map(key => byKey.get(key)).filter(Boolean);
}

function getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    if (!state) return [];
    const automaticKeys = new Set(state.automaticPlayerIds);
    return getPdcTourCardHolders(candidates)
        .filter(candidate => !automaticKeys.has(getPdcTourCardPlayerKey(candidate)))
        .sort(comparePdcTourCardRanking);
}

function getPdcTourCardQualifierParticipants(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    const eligibleKeys = new Set(getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates)
        .map(getPdcTourCardPlayerKey));
    return resolvePdcTourCardPlayerKeys(state?.qualifierPlayerIds, candidates)
        .filter(candidate => eligibleKeys.has(getPdcTourCardPlayerKey(candidate)));
}

function getPdcTourCardQualifierOpeningRound(participantCount, qualifyingPlaces = 8) {
    const minimumSize = Math.max(2, Number(participantCount) || 0, Math.max(1, Number(qualifyingPlaces) || 8) * 2);
    let bracketSize = 2;
    while (bracketSize < minimumSize) bracketSize *= 2;
    return bracketSize;
}

function buildPdcTourCardQualifierDraw(participants, random = Math.random, qualifyingPlaces = undefined) {
    const entrants = shufflePdcQSchoolPlayers(getPdcTourCardHolders(participants), random);
    const places = Math.max(1, Number(qualifyingPlaces)
        || Number(typeof activeTournament !== 'undefined' && activeTournament?.qualifyingPlaces) || 8);
    const bracketSize = getPdcTourCardQualifierOpeningRound(entrants.length, places);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;
    for (; index < byeCount && index < entrants.length; index++) draw.push(entrants[index], createPdcQSchoolBye());
    for (; index < entrants.length; index += 2) draw.push(entrants[index], entrants[index + 1] || createPdcQSchoolBye());
    while (draw.length < bracketSize) draw.push(createPdcQSchoolBye());
    return draw;
}

function completePdcTourCardQualifier(qualifierTournament, qualifiedPlayers) {
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    const state = ensurePdcTourCardQualificationState(qualifierTournament);
    if (!mainTournament || !state) return null;
    const eligibleKeys = new Set(getPdcTourCardQualifierEligiblePlayers(qualifierTournament)
        .map(getPdcTourCardPlayerKey));
    const qualifiers = uniquePdcTourCardPlayers(qualifiedPlayers)
        .filter(candidate => eligibleKeys.has(getPdcTourCardPlayerKey(candidate)))
        .slice(0, state.qualifyingPlaces);
    state.qualifiedPlayerIds = qualifiers.map(getPdcTourCardPlayerKey);
    state.completed = true;
    qualifierTournament.completed = true;
    qualifierTournament.historyLogs = typeof lastTournamentResults === 'string' ? lastTournamentResults : '';
    return state;
}

function repairLegacyGrandSlamQualification(mainTournament, qualifierTournament, state, candidates) {
    const blocks = qualifierTournament?.matchHistory?.blocks;
    const mainName = `${mainTournament?.name || ''} ${mainTournament?.sourceName || ''}`.toLowerCase();
    // Starsze wersje mogły uruchomić grupy wewnątrz kwalifikatora albo zbudować
    // dla małej obsady drabinkę Last 128. W obu przypadkach zapisywały mniej niż
    // osiem miejsc. Zachowujemy przyznane awanse, a brakujące odtwarzamy według
    // najdalszej osiągniętej rundy. Nie powtarzamy meczów ani nie zmieniamy ich historii.
    if (!state?.completed || mainTournament?.completed
        || (!mainName.includes('grand slam') && !mainName.includes("champion's slam"))
        || state.qualifiedPlayerIds.length >= state.qualifyingPlaces) return false;
    const eligible = new Map(getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates)
        .map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    const selected = new Set();
    const addKey = key => {
        if (selected.size < state.qualifyingPlaces && eligible.has(key)) selected.add(key);
    };
    state.qualifiedPlayerIds.forEach(addKey);
    const historyPlayers = qualifierTournament?.matchHistory?.players || [];
    const addHistoryPlayer = index => {
        const entry = historyPlayers[index];
        if (typeof entry?.[0] !== 'string') return;
        const key = entry[0].startsWith('id:') ? entry[0].slice(3) : entry[0].replace(/^name:/, '');
        addKey(key);
    };
    const rounds = (Array.isArray(blocks) ? blocks : [])
        .filter(block => block?.type === 'round' && Array.isArray(block.matches))
        .sort((first, second) => Number(first.round) - Number(second.round));
    for (const round of rounds) {
        round.matches.forEach(match => addHistoryPlayer(Number(match[2]) >= Number(match[3]) ? match[0] : match[1]));
        round.matches.forEach(match => addHistoryPlayer(Number(match[2]) >= Number(match[3]) ? match[1] : match[0]));
        if (selected.size >= state.qualifyingPlaces) break;
    }
    // Gdy fragment starej historii nie istnieje, korzystamy z kolejności
    // zapisanej listy uczestników tego kwalifikatora, nadal tylko z kartą.
    state.qualifierPlayerIds.forEach(addKey);
    if (selected.size <= state.qualifiedPlayerIds.length) return false;
    state.qualifiedPlayerIds = [...selected];
    state.legacyGrandSlamQualifierRepaired = true;
    return true;
}

function getPdcTourCardQualifiedMainField(mainTournament, candidates = getPdcTourCardPlayers()) {
    const qualifierTournament = Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(tournament => tournament.specialType === PDC_TOUR_CARD_QUALIFIER_TYPE
            && (tournament.qualifierFor === mainTournament?.name || tournament.qualifierFor === mainTournament?.sourceName))
        : null;
    if (!qualifierTournament) return null;
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    repairLegacyGrandSlamQualification(mainTournament, qualifierTournament, state, candidates);
    if (!state.completed) {
        state.qualifiedPlayerIds = getPdcTourCardQualifierParticipants(qualifierTournament, candidates)
            .slice(0, state.qualifyingPlaces).map(getPdcTourCardPlayerKey);
        state.completed = true;
        state.migratedWithoutQualifier = true;
    }
    const eligibleKeys = new Set(getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates)
        .map(getPdcTourCardPlayerKey));
    return uniquePdcTourCardPlayers([
        ...resolvePdcTourCardPlayerKeys(state.automaticPlayerIds, candidates),
        ...resolvePdcTourCardPlayerKeys(state.qualifiedPlayerIds, candidates)
            .filter(candidate => eligibleKeys.has(getPdcTourCardPlayerKey(candidate)))
    ]);
}

function isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier(qualifierTournament) {
    const state = ensurePdcTourCardQualificationState(qualifierTournament);
    return Boolean(state?.automaticPlayerIds.includes(getPdcTourCardPlayerKey(player)));
}

function getPdcTourCardQualifierOutcomeMessage(qualifierTournament, candidate = player) {
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    const state = mainTournament?.pdcTourCardQualification;
    const qualified = Boolean(state?.qualifiedPlayerIds.includes(getPdcTourCardPlayerKey(candidate)));
    const eventName = mainTournament?.name || qualifierTournament?.qualifierFor || '';
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const messages = qualified
        ? { pl: `Awansujesz do ${eventName}!`, en: `You qualify for ${eventName}!`, de: `Du qualifizierst dich für ${eventName}!`, nl: `Je plaatst je voor ${eventName}!` }
        : { pl: `Nie udało Ci się awansować do ${eventName}.`, en: `You did not qualify for ${eventName}.`, de: `Du hast dich nicht für ${eventName} qualifiziert.`, nl: `Je hebt je niet geplaatst voor ${eventName}.` };
    return messages[language] || messages.pl;
}

function shufflePdcQSchoolPlayers(candidates, random = Math.random) {
    const shuffled = [...candidates];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function createPdcQSchoolBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

function buildPdcQSchoolDraw(participants, random = Math.random) {
    const entrants = shufflePdcQSchoolPlayers(uniquePdcTourCardPlayers(participants), random);
    const bracketSize = getPdcQSchoolOpeningRound(entrants.length);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;

    for (; index < byeCount && index < entrants.length; index++) {
        draw.push(entrants[index], createPdcQSchoolBye());
    }
    for (; index < entrants.length; index += 2) {
        draw.push(entrants[index], entrants[index + 1] || createPdcQSchoolBye());
    }
    while (draw.length < bracketSize) draw.push(createPdcQSchoolBye());
    return draw;
}

function completePdcQSchool(tournament, qualifiedPlayers, referenceDate = currentDate) {
    const cycleYear = getPdcTourCardCycleYear(referenceDate);
    const qualifiers = uniquePdcTourCardPlayers(qualifiedPlayers).slice(0, PDC_TOUR_CARD_QSCHOOL_PLACES);
    qualifiers.forEach(candidate => setPdcTourCard(candidate, 'qschool', cycleYear));

    if (tournament) {
        tournament.completed = true;
        tournament.qSchoolYear = cycleYear;
        tournament.qSchoolQualifiedPlayerIds = qualifiers.map(getPdcTourCardPlayerKey);
        if (typeof lastTournamentResults === 'string') tournament.historyLogs = lastTournamentResults;
    }
    return qualifiers;
}

function seedCareerPlayerIntoPdcTop64(candidate, candidates, referenceDate = currentDate) {
    if (!candidate) return false;
    const rankedOthers = uniquePdcTourCardPlayers(candidates)
        .filter(other => other !== candidate)
        .sort(comparePdcTourCardRanking);
    const threshold = Number(rankedOthers[PDC_TOUR_CARD_OOM_PLACES - 1]?.prizeMoney) || 0;
    const currentAmount = Number(candidate.prizeMoney) || 0;
    const requiredAmount = Math.max(0, threshold + 1 - currentAmount);

    if (!Array.isArray(candidate.mainPrizeHistory)) candidate.mainPrizeHistory = [];
    if (requiredAmount > 0) {
        candidate.mainPrizeHistory.push({
            tournament: 'PDC Tour Card start placement',
            amount: requiredAmount,
            earnedAt: referenceDate instanceof Date ? referenceDate.getTime() : new Date(referenceDate).getTime(),
            historical: false,
            tourCardSeed: true
        });
        candidate.prizeMoney = currentAmount + requiredAmount;
    }
    beginPdcTourCardCycle([...rankedOthers, candidate], referenceDate);
    return candidate.hasTourCard === true;
}

function getPdcTourCardLabel(candidate) {
    if (!candidate?.hasTourCard) return '';
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const labels = {
        pl: 'Posiadacz karty PDC',
        en: 'PDC Tour Card holder',
        de: 'PDC-Tour-Card-Inhaber',
        nl: 'PDC Tour Card-houder'
    };
    return labels[language] || labels.pl;
}

function getPdcTourCardOutcomeMessage(candidate = player) {
    const qualified = candidate?.hasTourCard === true && candidate.tourCardSource === 'qschool';
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const messages = qualified
        ? {
            pl: 'Gratulacje! Zdobywasz kartę PDC na dwa lata.',
            en: 'Congratulations! You earn a two-year PDC Tour Card.',
            de: 'Glückwunsch! Du erhältst eine PDC Tour Card für zwei Jahre.',
            nl: 'Gefeliciteerd! Je verdient een PDC Tour Card voor twee jaar.'
        }
        : {
            pl: 'Nie udało Ci się zdobyć karty PDC w tym Q-Schoolu.',
            en: 'You did not earn a PDC Tour Card at this Q-School.',
            de: 'Du hast bei dieser Q-School keine PDC Tour Card gewonnen.',
            nl: 'Je hebt bij deze Q-School geen PDC Tour Card verdiend.'
        };
    return messages[language] || messages.pl;
}

// Nowa gra zaczyna się od 64 kart przyznanych według stanu OOM.
if (typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)) {
    migratePdcTourCardSystem(pdcPlayers, typeof currentDate !== 'undefined' ? currentDate : new Date(2026, 0, 1));
}
