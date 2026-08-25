function showRoundResults() {
            document.getElementById('t-tour-end-title').innerText = t('t-round-results');
            document.getElementById('results-content').innerHTML = currentRoundHTML;
            document.getElementById('t-btn-next-round').style.display = 'block';
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
            const playerStillInTournament = Array.isArray(tournamentBracket)
                && tournamentBracket.some(candidate => typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate));
            if (simulateTournamentButton) {
                simulateTournamentButton.style.display = activeTournament && tournamentBracket.length > 1 && !playerStillInTournament
                    ? 'block'
                    : 'none';
            }
            document.getElementById('t-btn-tour-back').style.display = 'none';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function showTournamentEnd() {
            document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
            document.getElementById('results-content').innerHTML = lastTournamentResults;
            document.getElementById('t-btn-next-round').style.display = 'none';
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
            if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
            document.getElementById('t-btn-tour-back').style.display = 'block';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function showCompletedTournamentResults(tournament) {
            if (!tournament?.historyLogs) return false;
            document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
            document.getElementById('results-content').innerHTML = tournament.historyLogs;
            document.getElementById('t-btn-next-round').style.display = 'none';
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
            if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
            document.getElementById('t-btn-tour-back').style.display = 'block';
            document.getElementById('results-modal').style.display = 'flex';
            return true;
        }

        function proceedToNextRound() {
            document.getElementById('results-modal').style.display = 'none';
            showBracket();
        }
        
        
