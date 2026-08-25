const STAMINA_CONFIG = Object.freeze({
    dailyRecovery: 5,
    trainingCost: 20,
    regularTournamentCost: 10,
    majorTournamentCost: 20,
    decemberWorldChampionshipCost: 30
});

function changePlayerStamina(candidate, amount) {
    if (!candidate) return 0;
    const currentStamina = Number.isFinite(Number(candidate.stamina))
        ? Number(candidate.stamina)
        : 100;
    candidate.stamina = Math.max(0, Math.min(100, currentStamina + amount));
    return candidate.stamina;
}

function recoverDailyStamina(candidate = player) {
    return changePlayerStamina(candidate, STAMINA_CONFIG.dailyRecovery);
}

function getTournamentStaminaCost(tournament) {
    if (!tournament) return 0;

    const sourceName = typeof getTournamentSourceName === 'function'
        ? getTournamentSourceName(tournament)
        : (tournament.sourceName || tournament.name || '');
    const name = `${tournament.name || ''} ${sourceName}`.toLocaleLowerCase();
    const isDecemberWorldChampionship = Number(tournament.month) === 11 && (
        name.includes('world darts championship') ||
        name.includes('global darts championship')
    );

    if (isDecemberWorldChampionship) return STAMINA_CONFIG.decemberWorldChampionshipCost;

    const isPlayersEvent = typeof isPlayersChampionshipTournament === 'function'
        ? isPlayersChampionshipTournament(tournament)
        : ((name.includes('players championship') || name.includes('pro players cup')) && !name.includes('final'));
    const isContinentalTourEvent = typeof isEuropeanTourTournament === 'function'
        ? isEuropeanTourTournament(tournament)
        : (name.includes('continental tour') || name.includes('european tour'));
    const isPremierLeagueEvent = name.includes('premier league') || name.includes('global darts league');

    if (isPlayersEvent || isContinentalTourEvent || isPremierLeagueEvent) {
        return STAMINA_CONFIG.regularTournamentCost;
    }

    return STAMINA_CONFIG.majorTournamentCost;
}

function chargeTournamentParticipationStamina(tournament, participationDate = currentDate) {
    if (!tournament || typeof player === 'undefined' || !player) return 0;

    const parsedDate = new Date(participationDate);
    const validDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const participationYear = validDate.getFullYear();
    if (Number(tournament.staminaChargedYear) === participationYear) return 0;

    const staminaCost = getTournamentStaminaCost(tournament);
    changePlayerStamina(player, -staminaCost);
    tournament.staminaChargedYear = participationYear;
    return staminaCost;
}
