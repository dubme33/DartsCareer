function showRoundResults() {
            document.getElementById('t-tour-end-title').innerText = t('t-round-results');
            document.getElementById('results-content').innerHTML = currentRoundHTML;
            document.getElementById('t-btn-next-round').style.display = 'block';
            document.getElementById('t-btn-tour-back').style.display = 'none';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function showTournamentEnd() {
            document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
            document.getElementById('results-content').innerHTML = lastTournamentResults;
            document.getElementById('t-btn-next-round').style.display = 'none';
            document.getElementById('t-btn-tour-back').style.display = 'block';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function proceedToNextRound() {
            document.getElementById('results-modal').style.display = 'none';
            showBracket();
        }
        
        