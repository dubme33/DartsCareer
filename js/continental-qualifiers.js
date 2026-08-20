const CONTINENTAL_QUALIFIER_TYPE = 'continentalQualifier';

const CONTINENTAL_QUALIFIER_TRANSLATIONS = {
    pl: {
        qualifierSuffix: 'Kwalifikacje',
        qualified: 'Gratulacje! Awansujesz do {tournament}.',
        eliminated: 'Nie udało się wywalczyć awansu do {tournament}.',
        completed: 'Kwalifikacje do {tournament} zostały zakończone.',
        history: 'Awans do {tournament}: {players}'
    },
    en: {
        qualifierSuffix: 'Qualifiers',
        qualified: 'Congratulations! You qualify for {tournament}.',
        eliminated: 'You did not qualify for {tournament}.',
        completed: 'The qualifiers for {tournament} have concluded.',
        history: 'Qualified for {tournament}: {players}'
    },
    de: {
        qualifierSuffix: 'Qualifikation',
        qualified: 'Glückwunsch! Du qualifizierst dich für {tournament}.',
        eliminated: 'Du hast die Qualifikation für {tournament} verpasst.',
        completed: 'Die Qualifikation für {tournament} ist abgeschlossen.',
        history: 'Qualifiziert für {tournament}: {players}'
    },
    nl: {
        qualifierSuffix: 'Kwalificaties',
        qualified: 'Gefeliciteerd! Je plaatst je voor {tournament}.',
        eliminated: 'Je hebt je niet geplaatst voor {tournament}.',
        completed: 'De kwalificaties voor {tournament} zijn afgerond.',
        history: 'Gekwalificeerd voor {tournament}: {players}'
    }
};

const CONTINENTAL_QUALIFIER_SCHEDULE = [
    ['Continental Tour 1', 1, 18], ['Continental Tour 2', 1, 25], ['Continental Tour 3', 2, 9],
    ['Continental Tour 4', 2, 17], ['Continental Tour 5', 2, 24], ['Continental Tour 6', 3, 14],
    ['Continental Tour 7', 4, 6], ['Continental Tour 8', 4, 20], ['Continental Tour 9', 5, 18],
    ['Continental Tour 10', 6, 15], ['Continental Tour 11', 7, 5], ['Continental Tour 12', 7, 23],
    ['Continental Tour 13', 8, 15], ['Continental Tour 14', 9, 8], ['Continental Tour 15', 9, 15]
];

function trContinentalQualifier(key, values = {}) {
    const language = typeof currentLang === 'string' && CONTINENTAL_QUALIFIER_TRANSLATIONS[currentLang]
        ? currentLang
        : 'pl';
    const template = CONTINENTAL_QUALIFIER_TRANSLATIONS[language][key] || CONTINENTAL_QUALIFIER_TRANSLATIONS.pl[key] || key;
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

function getContinentalQualifierDisplayName(tournament) {
    const mainName = tournament?.qualifierFor || String(tournament?.name || '').replace(/\s*-\s*Qualifiers?$/i, '');
    return `${mainName} — ${trContinentalQualifier('qualifierSuffix')}`;
}

function getContinentalQualificationPlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id || `${candidate.name}|${candidate.country}`;
}

function sortContinentalQualificationRank(first, second, property) {
    const difference = (Number(second?.[property]) || 0) - (Number(first?.[property]) || 0);
    if (difference !== 0) return difference;
    const careerDifference = Number(isCurrentPlayer(second)) - Number(isCurrentPlayer(first));
    if (careerDifference !== 0) return careerDifference;
    return String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getContinentalQualifierEligiblePlayers() {
    const aiPlayers = Array.isArray(pdcPlayers)
        ? pdcPlayers.filter(candidate => candidate && candidate.hasTourCard !== false)
        : [];
    return [...aiPlayers, player].filter(Boolean);
}

function getContinentalQualificationSeason() {
    return currentDate instanceof Date && !Number.isNaN(currentDate.getTime())
        ? currentDate.getFullYear()
        : new Date().getFullYear();
}

function resolveContinentalQualificationPlayers(keys, eligiblePlayers = getContinentalQualifierEligiblePlayers()) {
    const byKey = new Map(eligiblePlayers.map(candidate => [getContinentalQualificationPlayerKey(candidate), candidate]));
    return (keys || []).map(key => byKey.get(key)).filter(Boolean);
}

function getLinkedContinentalTour(qualifierTournament) {
    if (!qualifierTournament?.qualifierFor || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(tournament => tournament.name === qualifierTournament.qualifierFor) || null;
}

function ensureContinentalQualificationState(mainTournament, eligiblePlayers = getContinentalQualifierEligiblePlayers()) {
    if (!mainTournament) return null;
    const season = getContinentalQualificationSeason();
    const existingState = mainTournament.continentalQualification;
    if (existingState?.year === season && Array.isArray(existingState.oomPlayerIds) && Array.isArray(existingState.proTourPlayerIds)) {
        return existingState;
    }

    const oomRanked = [...eligiblePlayers].sort((first, second) => sortContinentalQualificationRank(first, second, 'prizeMoney'));
    const oomPlayers = oomRanked.slice(0, 16);
    const automaticKeys = new Set(oomPlayers.map(getContinentalQualificationPlayerKey));
    const proTourRanked = [...eligiblePlayers].sort((first, second) => sortContinentalQualificationRank(first, second, 'proTourPrizeMoney'));
    const proTourPlayers = [];
    for (const candidate of proTourRanked) {
        if (automaticKeys.has(getContinentalQualificationPlayerKey(candidate))) continue;
        proTourPlayers.push(candidate);
        automaticKeys.add(getContinentalQualificationPlayerKey(candidate));
        if (proTourPlayers.length === 16) break;
    }

    const qualifierCandidates = [...eligiblePlayers]
        .filter(candidate => !automaticKeys.has(getContinentalQualificationPlayerKey(candidate)))
        .sort((first, second) => sortContinentalQualificationRank(first, second, 'proTourPrizeMoney'));
    let qualifierPlayers = qualifierCandidates.slice(0, 128);
    if (!automaticKeys.has(getContinentalQualificationPlayerKey(player)) && !qualifierPlayers.some(isCurrentPlayer)) {
        qualifierPlayers = [...qualifierPlayers.slice(0, 127), player];
    }

    const state = {
        version: 1,
        year: season,
        oomPlayerIds: oomPlayers.map(getContinentalQualificationPlayerKey),
        proTourPlayerIds: proTourPlayers.map(getContinentalQualificationPlayerKey),
        qualifierPlayerIds: qualifierPlayers.map(getContinentalQualificationPlayerKey),
        qualifiedPlayerIds: [],
        completed: false
    };
    mainTournament.continentalQualification = state;
    return state;
}

function getContinentalTourQualifierParticipants(qualifierTournament) {
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    if (!mainTournament) return [];
    const eligiblePlayers = getContinentalQualifierEligiblePlayers();
    const state = ensureContinentalQualificationState(mainTournament, eligiblePlayers);
    return resolveContinentalQualificationPlayers(state?.qualifierPlayerIds, eligiblePlayers);
}

function isCareerPlayerDirectlyQualifiedForContinentalTour(qualifierTournament) {
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    const state = mainTournament && ensureContinentalQualificationState(mainTournament);
    if (!state) return false;
    const playerKey = getContinentalQualificationPlayerKey(player);
    return [...state.oomPlayerIds, ...state.proTourPlayerIds].includes(playerKey);
}

function getContinentalTourMainField(mainTournament) {
    const eligiblePlayers = getContinentalQualifierEligiblePlayers();
    const state = ensureContinentalQualificationState(mainTournament, eligiblePlayers);
    if (!state) return null;

    // Bezpieczna migracja zapisu, który był już na terminie turnieju głównego
    // przed dodaniem do kalendarza kwalifikacji.
    if (!state.completed) {
        state.qualifiedPlayerIds = state.qualifierPlayerIds.slice(0, 16);
        state.completed = true;
        state.migratedWithoutQualifier = true;
    }

    return {
        state,
        oomPlayers: resolveContinentalQualificationPlayers(state.oomPlayerIds, eligiblePlayers),
        proTourPlayers: resolveContinentalQualificationPlayers(state.proTourPlayerIds, eligiblePlayers),
        qualifiedPlayers: resolveContinentalQualificationPlayers(state.qualifiedPlayerIds, eligiblePlayers)
    };
}

function completeContinentalTourQualifier(qualifierTournament, qualifiedPlayers) {
    const mainTournament = getLinkedContinentalTour(qualifierTournament);
    if (!mainTournament) return null;
    const state = ensureContinentalQualificationState(mainTournament);
    state.qualifiedPlayerIds = (qualifiedPlayers || []).map(getContinentalQualificationPlayerKey);
    state.completed = true;
    qualifierTournament.completed = true;
    qualifierTournament.historyLogs = lastTournamentResults;
    return state;
}

function getContinentalQualifierOutcomeMessage(qualified) {
    const mainTournament = getLinkedContinentalTour(activeTournament);
    const tournament = mainTournament?.name || activeTournament?.qualifierFor || '';
    return trContinentalQualifier(qualified ? 'qualified' : 'eliminated', { tournament });
}

function migrateContinentalTourQualifiersCalendar() {
    if (!Array.isArray(tournamentDatabase)) return;
    CONTINENTAL_QUALIFIER_SCHEDULE.forEach(([mainName, month, day]) => {
        const mainTournament = tournamentDatabase.find(tournament => tournament.name === mainName);
        if (!mainTournament) return;
        const existingQualifier = tournamentDatabase.find(tournament =>
            (tournament.specialType === CONTINENTAL_QUALIFIER_TYPE && tournament.qualifierFor === mainName) ||
            tournament.name === `${mainName} - Qualifiers`);
        const qualifierName = `${mainName} - Qualifiers`;
        if (existingQualifier) {
            existingQualifier.name = qualifierName;
            existingQualifier.month = month;
            existingQualifier.day = day;
            existingQualifier.endDay = undefined;
            existingQualifier.format = 'legs';
            existingQualifier.minOvr = 0;
            existingQualifier.city = mainTournament.city;
            existingQualifier.country = mainTournament.country;
            existingQualifier.specialType = CONTINENTAL_QUALIFIER_TYPE;
            existingQualifier.qualifierFor = mainName;
        } else {
            tournamentDatabase.push({
                name: qualifierName, month, day, format: 'legs', minOvr: 0,
                city: mainTournament.city, country: mainTournament.country,
                specialType: CONTINENTAL_QUALIFIER_TYPE, qualifierFor: mainName,
                completed: false, historyLogs: ''
            });
        }
    });
    tournamentDatabase.sort((first, second) => first.month - second.month || first.day - second.day || String(first.name).localeCompare(String(second.name), 'pl'));
}
