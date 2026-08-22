// Sezonowy European Tour Order of Merit. Do klasyfikacji zaliczamy wyłącznie
// nagrody zdobyte w turniejach European Tour (w niemodowanej bazie nazwanych
// Continental Tour), a nie cały ranking ProTour ani główny OOM.
const EUROPEAN_CHAMPIONSHIP_DRAW_VERSION = 1;
const PRO_TOUR_ORDER_OF_MERIT_VERSION = 3;
const PRO_TOUR_ROLLING_PERIOD_MS = 52 * 7 * 24 * 60 * 60 * 1000;
const EUROPEAN_CHAMPIONSHIP_SEED_ORDER = [
    1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21,
    2, 31, 15, 18, 7, 26, 10, 23, 3, 30, 14, 19, 6, 27, 11, 22
];

function getEuropeanTourTournamentName(tournamentOrName) {
    return typeof tournamentOrName === 'string'
        ? tournamentOrName
        : (tournamentOrName?.name || '');
}

function getTournamentSourceName(tournamentOrName) {
    if (tournamentOrName && typeof tournamentOrName === 'object') {
        return tournamentOrName.sourceName || tournamentOrName.name || '';
    }

    const name = getEuropeanTourTournamentName(tournamentOrName);
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === name)
        : null;
    return tournament?.sourceName || name;
}

function isEuropeanTourTournament(tournamentOrName) {
    const name = getEuropeanTourTournamentName(tournamentOrName).toLocaleLowerCase();
    const sourceName = getTournamentSourceName(tournamentOrName).toLocaleLowerCase();
    return sourceName.includes('european tour') || sourceName.includes('continental tour') || sourceName.includes('(et')
        // Prawdziwe nazwy European Tour stosowane przez mody, które nie zachowują
        // technicznej nazwy źródłowej Continental Tour.
        || name.includes('darts open') || name.includes('darts trophy') || name.includes('darts grand prix')
        || name.includes('german darts championship') || name.includes('dutch darts championship');
}

function isPlayersChampionshipTournament(tournamentOrName) {
    const name = getTournamentSourceName(tournamentOrName).toLocaleLowerCase();
    const isPlayersChampionship = name.includes('players championship') || name.includes('pro players cup');
    return isPlayersChampionship && !name.includes('final');
}

function isProTourRankingTournament(tournamentOrName) {
    return isEuropeanTourTournament(tournamentOrName) || isPlayersChampionshipTournament(tournamentOrName);
}

function isEuropeanChampionshipTournament(tournamentOrName) {
    const name = getEuropeanTourTournamentName(tournamentOrName).toLocaleLowerCase();
    return name.includes('european championship') || name.includes('continental championship');
}

function getEuropeanTourPrizeMoney(candidate) {
    return Math.max(0, Number(candidate?.europeanTourPrizeMoney) || 0);
}

function compareEuropeanTourOrderOfMerit(first, second) {
    const moneyDifference = getEuropeanTourPrizeMoney(second) - getEuropeanTourPrizeMoney(first);
    if (moneyDifference !== 0) return moneyDifference;

    // Tie-break służy wyłącznie do ułożenia zawodników z identycznymi zarobkami
    // European Tour; nie dodaje pieniędzy z innych cykli do rankingu.
    const mainOomDifference = (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0);
    if (mainOomDifference !== 0) return mainOomDifference;

    const ovrDifference = (Number(second?.ovr) || 0) - (Number(first?.ovr) || 0);
    if (ovrDifference !== 0) return ovrDifference;
    return String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getEuropeanTourOrderOfMerit(candidates) {
    return [...(Array.isArray(candidates) ? candidates : [])]
        .filter(candidate => candidate && !candidate.isBye)
        .sort(compareEuropeanTourOrderOfMerit);
}

function awardEuropeanTourOrderOfMeritPrizeMoney(candidate, amount, tournamentOrName) {
    if (!candidate || !isEuropeanTourTournament(tournamentOrName)) return;
    candidate.europeanTourPrizeMoney = getEuropeanTourPrizeMoney(candidate) + Math.max(0, Number(amount) || 0);
}

function resetEuropeanTourOrderOfMerit(candidates) {
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (candidate && !candidate.isBye) candidate.europeanTourPrizeMoney = 0;
    });
}

function getProTourReferenceTime(referenceDate = typeof currentDate !== 'undefined' ? currentDate : null) {
    const time = referenceDate instanceof Date ? referenceDate.getTime() : new Date(referenceDate).getTime();
    return Number.isFinite(time) ? time : Date.now();
}

function getPreviousProTourEventDate(tournamentName, referenceTime) {
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === tournamentName || candidate?.sourceName === tournamentName)
        : null;
    if (!tournament || !Number.isInteger(tournament.month) || !Number.isInteger(tournament.day)) return referenceTime;

    const referenceDate = new Date(referenceTime);
    const eventDay = Number.isInteger(tournament.endDay) ? tournament.endDay : tournament.day;
    const eventDate = new Date(referenceDate.getFullYear(), tournament.month, eventDay);
    if (eventDate.getTime() > referenceTime) eventDate.setFullYear(eventDate.getFullYear() - 1);
    return eventDate.getTime();
}

function normaliseProTourPrizeHistory(candidate, referenceTime) {
    if (!candidate || candidate.isBye) return [];

    if (Array.isArray(candidate.proTourPrizeHistory)) {
        candidate.proTourPrizeHistory = candidate.proTourPrizeHistory
            .map(entry => ({
                tournament: String(entry?.tournament || ''),
                amount: Math.max(0, Number(entry?.amount) || 0),
                earnedAt: Number(entry?.earnedAt)
            }))
            .filter(entry => entry.tournament && entry.amount > 0 && Number.isFinite(entry.earnedAt));
        return candidate.proTourPrizeHistory;
    }

    const legacyHistory = candidate.historyPT && typeof candidate.historyPT === 'object' ? candidate.historyPT : {};
    const entries = [];
    let eligibleTotal = 0;
    let ineligibleTotal = 0;

    Object.entries(legacyHistory).forEach(([tournamentName, value]) => {
        const amount = Math.max(0, Number(value) || 0);
        if (amount <= 0) return;
        if (!isProTourRankingTournament(tournamentName)) {
            ineligibleTotal += amount;
            return;
        }
        eligibleTotal += amount;
        entries.push({
            tournament: tournamentName,
            amount,
            earnedAt: getPreviousProTourEventDate(tournamentName, referenceTime)
        });
    });

    // Baza startowa nie przechowuje rozbicia na dawne eventy. Zachowujemy jej
    // nieudokumentowaną część jako wpis przejściowy, zamiast traktować ją jako
    // nową nagrodę z nieprawidłowego turnieju.
    const legacyBalance = Math.max(0, (Number(candidate.proTourPrizeMoney) || 0) - eligibleTotal - ineligibleTotal);
    if (legacyBalance > 0) entries.push({ tournament: '__legacy__', amount: legacyBalance, earnedAt: referenceTime });

    candidate.historyPT = Object.fromEntries(
        Object.entries(legacyHistory).filter(([tournamentName]) => isProTourRankingTournament(tournamentName))
    );
    candidate.proTourPrizeHistory = entries;
    return entries;
}

function refreshProTourOrderOfMerit(candidates, referenceDate) {
    const referenceTime = getProTourReferenceTime(referenceDate);
    const cutoff = referenceTime - PRO_TOUR_ROLLING_PERIOD_MS;

    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (!candidate || candidate.isBye) return;
        const activeEntries = normaliseProTourPrizeHistory(candidate, referenceTime)
            .filter(entry => entry.earnedAt > cutoff && entry.earnedAt <= referenceTime);
        candidate.proTourPrizeHistory = activeEntries;
        candidate.proTourPrizeMoney = activeEntries.reduce((total, entry) => total + entry.amount, 0);
        candidate.proTourRankingVersion = PRO_TOUR_ORDER_OF_MERIT_VERSION;
    });
}

function awardProTourOrderOfMeritPrizeMoney(candidate, amount, tournamentOrName, referenceDate) {
    if (!candidate || !isProTourRankingTournament(tournamentOrName)) return;

    const prize = Math.max(0, Number(amount) || 0);
    if (prize <= 0) return;

    const tournamentName = getEuropeanTourTournamentName(tournamentOrName);
    const referenceTime = getProTourReferenceTime(referenceDate);
    refreshProTourOrderOfMerit([candidate], referenceTime);
    candidate.proTourPrizeHistory.push({ tournament: tournamentName, amount: prize, earnedAt: referenceTime });
    if (!candidate.historyPT || typeof candidate.historyPT !== 'object') candidate.historyPT = {};
    candidate.historyPT[tournamentName] = (Number(candidate.historyPT[tournamentName]) || 0) + prize;
    refreshProTourOrderOfMerit([candidate], referenceTime);
}

// Wersje zapisu sprzed poprawki mogły zawierać w ProTour pieniądze z majorów.
// Migracja usuwa je z historii, a nagrody z właściwych eventów otrzymują daty
// potrzebne do dalszego działania 52-tygodniowego okna.
function migrateProTourOrderOfMeritFromHistory(candidates, tournaments, referenceDate) {
    const referenceTime = getProTourReferenceTime(referenceDate);
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (!candidate || candidate.isBye) return;
        if (candidate.proTourRankingVersion !== PRO_TOUR_ORDER_OF_MERIT_VERSION) {
            delete candidate.proTourPrizeHistory;
        }
    });
    refreshProTourOrderOfMerit(candidates, referenceTime);
}

// Zapisy utworzone przed dodaniem tego rankingu nie mają osobnego pola, ale
// zawierają historię nagród ProTour dla ukończonych eventów. Dzięki temu możemy
// odtworzyć bieżący sezon bez doliczania pieniędzy z innych turniejów.
function migrateEuropeanTourOrderOfMeritFromHistory(candidates, tournaments) {
    const completedEuropeanTourNames = new Set(
        (Array.isArray(tournaments) ? tournaments : [])
            .filter(tournament => tournament?.completed && isEuropeanTourTournament(tournament))
            .map(tournament => tournament.name)
    );

    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (!candidate || candidate.isBye) return;

        const savedValue = candidate.europeanTourPrizeMoney;
        if (savedValue !== undefined && savedValue !== null && Number.isFinite(Number(savedValue))) {
            candidate.europeanTourPrizeMoney = Math.max(0, Number(savedValue));
            return;
        }

        candidate.europeanTourPrizeMoney = [...completedEuropeanTourNames]
            .reduce((total, tournamentName) => total + Math.max(0, Number(candidate.historyPT?.[tournamentName]) || 0), 0);
    });
}

function buildEuropeanChampionshipDraw(candidates) {
    const seeds = getEuropeanTourOrderOfMerit(candidates).slice(0, 32);
    return EUROPEAN_CHAMPIONSHIP_SEED_ORDER
        .map(seedNumber => seeds[seedNumber - 1])
        .filter(Boolean);
}
