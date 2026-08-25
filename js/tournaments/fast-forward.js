let isFastForwardingTournament = false;

function isCareerPlayerInRemainingBracket() {
    return Array.isArray(tournamentBracket)
        && tournamentBracket.some(candidate => typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate));
}

function setRemainingTournamentButtonsDisabled(disabled) {
    ['t-btn-sim-tournament', 't-btn-sim-tournament-results'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = disabled;
    });
}

function awardGlobalLeaguePlayoffPlacementPrizes(tournament) {
    if (!tournament?.name?.includes('Play-offs') || typeof gdlTable === 'undefined' || !Array.isArray(gdlTable)) return;
    const sortedLeague = [...gdlTable].sort((first, second) => second.points - first.points
        || (second.legsWon - second.legsLost) - (first.legsWon - first.legsLost));
    const placementPrizes = [95000, 90000, 85000, 80000];
    placementPrizes.forEach((prize, index) => {
        const row = sortedLeague[index + 4];
        if (row) awardPrizeMoney(row.player, prize, tournament.name);
    });
}

function finishFastForwardedTournament({ announceWinner = false } = {}) {
    if (!activeTournament || !Array.isArray(tournamentBracket) || tournamentBracket.length !== 1) return null;

    const completedTournament = activeTournament;
    const winner = tournamentBracket[0];
    const winnerPrize = getPrizeMoney(completedTournament.name, 2, true);

    completedTournament.completed = true;
    completedTournament.historyLogs = lastTournamentResults;
    awardPrizeMoney(winner, winnerPrize, completedTournament.name);
    if (typeof completeWorldMastersTournament === 'function') completeWorldMastersTournament(completedTournament, winner);
    if (typeof isGrandSlamTournament === 'function' && isGrandSlamTournament(completedTournament)
        && typeof grandSlamState !== 'undefined' && grandSlamState) {
        grandSlamState.phase = 'completed';
    }
    recordSeasonTournamentResult(winner, completedTournament, { round: 2, prizeMoney: winnerPrize, won: true });
    awardGlobalLeaguePlayoffPlacementPrizes(completedTournament);

    if (announceWinner) {
        alert(t('t-alert-tour-sim-end').replace('{tour}', completedTournament.name).replace('{winner}', winner.name));
    }

    const bracketModal = document.getElementById('bracket-modal');
    if (bracketModal) bracketModal.style.display = 'none';
    const resultsModal = document.getElementById('results-modal');
    if (resultsModal) resultsModal.style.display = 'none';

    showTournamentEnd();
    activeTournament = null;
    tournamentBracket = [];

    const tournamentTile = document.getElementById('tile-tournament');
    if (tournamentTile) tournamentTile.style.display = 'none';
    if (typeof updateHub === 'function') updateHub();
    if (typeof saveGame === 'function') saveGame(true);
    return { tournament: completedTournament, winner };
}

function finishFastForwardedSpecialTournament(outcome) {
    const bracketModal = document.getElementById('bracket-modal');
    if (bracketModal) bracketModal.style.display = 'none';
    const resultsModal = document.getElementById('results-modal');
    if (resultsModal) resultsModal.style.display = 'none';

    if (outcome === true) {
        concludeContinentalTourQualifierEvent(true);
        showTournamentEnd();
        return true;
    }
    if (outcome === 'worldMastersFinalsQualifier') {
        concludeWorldMastersFinalsQualifierEvent(true);
        showTournamentEnd();
        return true;
    }
    if (outcome === 'pdcQSchool') {
        concludePdcQSchoolEvent(true);
        showTournamentEnd();
        return true;
    }
    if (outcome === 'pdcTourCardQualifier') {
        concludePdcTourCardQualifierEvent(true);
        showTournamentEnd();
        return true;
    }
    return false;
}

function simulateRemainingTournament() {
    if (isFastForwardingTournament || !activeTournament || !Array.isArray(tournamentBracket)
        || tournamentBracket.length <= 1 || isCareerPlayerInRemainingBracket()) return false;

    isFastForwardingTournament = true;
    setRemainingTournamentButtonsDisabled(true);

    try {
        let specialTournamentOutcome = false;
        let simulatedRounds = 0;

        while (tournamentBracket.length > 1 && simulatedRounds < 16) {
            specialTournamentOutcome = advanceTournament(false);
            simulatedRounds++;
            if (specialTournamentOutcome) break;
        }

        if (finishFastForwardedSpecialTournament(specialTournamentOutcome)) return true;
        if (tournamentBracket.length !== 1) return false;

        finishFastForwardedTournament({ announceWinner: false });
        return true;
    } finally {
        isFastForwardingTournament = false;
        setRemainingTournamentButtonsDisabled(false);
    }
}
