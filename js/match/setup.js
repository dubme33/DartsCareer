function startMatch(vsAI) {
            if (currentMatch && currentMatch.isTournament && activeTournament) {
                if (!confirm(t('t-confirm-free-match'))) return;
            }

            let customLegs = vsAI ? parseInt(document.getElementById('legs-select').value) : 6;
            const matchFormat = { type: 'legs', legsToWin: customLegs };

            let starter = vsAI ? (Math.random() < 0.5 ? 'p1' : 'p2') : 'p1';
            currentMatch = { 
                vsAI: vsAI, opponent: vsAI ? pdcPlayers[document.getElementById('opponent-select').value] : null, 
                p1Score: 501, p2Score: 501, p1Legs: 0, p2Legs: 0, p1Sets: 0, p2Sets: 0, totalLegsPlayed: 0, legsToWin: customLegs,
                matchFormat: matchFormat, turn: starter, startingPlayer: starter, dartsThrown: 0, isTurnLocked: false, p1TurnStartScore: 501, p2TurnStartScore: 501, isTournament: false,
                stats: { 
                    p1TotalDarts: 0, p1AccumulatedScore: 0, p1First9Score: 0, p1First9Darts: 0, p1LegDarts: 0, p1HighCheckout: 0, p1DoubleAttempts: 0, p1DoubleHits: 0, p1OneEighties: 0,
                    p2TotalDarts: 0, p2AccumulatedScore: 0, p2First9Score: 0, p2First9Darts: 0, p2LegDarts: 0, p2HighCheckout: 0, p2DoubleAttempts: 0, p2DoubleHits: 0, p2OneEighties: 0 
                }
            };
            currentTurnScore = 0; document.getElementById('match-log').innerHTML = "";
            drawnDarts = []; drawDartboard(); updateDartDots();

            document.getElementById('match-p1-name').innerHTML = `${getFlagImg(player.country)} ${escapeHtml(player.name)}`;

            // --- WCZYTYWANIE ZDJĘCIA GRACZA ---
            let p1PhotoSrc = player.photo ? player.photo : "https://placehold.co/100/16213e/FFFFFF?text=TY";
            document.getElementById('score-photo-p1').classList.remove('world-cup-flag-photo');
            document.getElementById('score-photo-p2').classList.remove('world-cup-flag-photo');
            document.getElementById('score-photo-p1').src = p1PhotoSrc;

            if (vsAI) {
                document.getElementById('score-col-ai').style.display = 'flex'; 
                document.getElementById('match-p2-name').innerHTML = `${getFlagImg(currentMatch.opponent.country)} ${escapeHtml(currentMatch.opponent.name)}`;
                document.getElementById('match-title').innerText = `${t('t-friendly-title-1')} ${customLegs} ${t('t-friendly-title-2')}`; // PODMIENIONO
                
                // --- WCZYTYWANIE ZDJĘCIA RYWALA ---
                let p2Img = document.getElementById('score-photo-p2');
            // Zamiast korzystać z domyślnych plików, używamy tych z wybranego moda (jeśli są)
            p2Img.src = moddedAssets.photos[currentMatch.opponent.name] || `zdjecia/${currentMatch.opponent.name}.png`;
                p2Img.onerror = function() { this.onerror=null; this.src='https://placehold.co/100/16213e/FFFFFF?text=AI'; };
                
            } else {
                document.getElementById('score-col-ai').style.display = 'none';
                document.getElementById('match-title').innerText = t('t-training-501'); // PODMIENIONO
            }
            updateScores(); updateMatchStatsUI(); setTurnUI(); showScreen('screen-match');
            
            if (vsAI) { playMatchIntro(player.name, currentMatch.opponent.name); }
        }

        function updateScores() {
            const isSetMatch = currentMatch.matchFormat && currentMatch.matchFormat.type === 'sets';
            
            document.getElementById('badge-sets-p1').style.display = isSetMatch ? 'block' : 'none';
            document.getElementById('badge-sets-p2').style.display = isSetMatch && currentMatch.vsAI ? 'block' : 'none';

            if (isSetMatch) {
                document.getElementById('val-sets-p1').innerText = currentMatch.p1Sets;
                document.getElementById('val-sets-p2').innerText = currentMatch.p2Sets;
            }

            if (currentMatch.suddenDeath) {
                const suddenDeath = currentMatch.suddenDeath;
                document.getElementById('match-score-p1').innerText = suddenDeath.p1Score;
                document.getElementById('match-score-p2').innerText = suddenDeath.p2Score;
                document.getElementById('checkout-p1').innerText = `Nagła śmierć · lotki: ${suddenDeath.p1Darts}/3`;
                document.getElementById('checkout-p2').innerText = `Nagła śmierć · lotki: ${suddenDeath.p2Darts}/3`;
                document.getElementById('val-legs-p1').innerText = currentMatch.p1Legs;
                document.getElementById('val-legs-p2').innerText = currentMatch.p2Legs;
                return;
            }

            document.getElementById('match-score-p1').innerText = currentMatch.p1Score;
            document.getElementById('checkout-p1').innerText = getCheckoutPath(currentMatch.p1Score);
            document.getElementById('val-legs-p1').innerText = currentMatch.p1Legs;
            
            if(currentMatch.vsAI) {
                document.getElementById('match-score-p2').innerText = currentMatch.p2Score;
                document.getElementById('checkout-p2').innerText = getCheckoutPath(currentMatch.p2Score);
                document.getElementById('val-legs-p2').innerText = currentMatch.p2Legs;
                updateMomentumUI();
            }
        }

        function formatStat(num, dem) {
            if(dem === 0) return "0.00";
            return ((num / dem) * 3).toFixed(2);
        }

        function updateMatchStatsUI() {
            if (!currentMatch.stats) return;
            let s = currentMatch.stats;
            
            let p1TotalPts = s.p1AccumulatedScore + (501 - currentMatch.p1Score);
            document.getElementById('stat-avg').innerText = formatStat(p1TotalPts, s.p1TotalDarts);
            document.getElementById('stat-f9').innerText = formatStat(s.p1First9Score, s.p1First9Darts);
            document.getElementById('stat-leg-avg').innerText = formatStat((501 - currentMatch.p1Score), s.p1LegDarts);
            document.getElementById('stat-leg-darts').innerText = `${t('t-darts')}: ${s.p1LegDarts}`;
            document.getElementById('stat-high-checkout').innerText = s.p1HighCheckout || "—";
            document.getElementById('stat-doubles').innerText = s.p1DoubleAttempts > 0 ? `${s.p1DoubleHits}/${s.p1DoubleAttempts} (${((s.p1DoubleHits / s.p1DoubleAttempts) * 100).toFixed(0)}%)` : "0/0 (0%)";
            document.getElementById('stat-180s').innerText = s.p1OneEighties;

            let p2TotalPts = s.p2AccumulatedScore + (501 - currentMatch.p2Score);
            document.getElementById('stat-opp-avg').innerText = formatStat(p2TotalPts, s.p2TotalDarts);
            document.getElementById('stat-opp-f9').innerText = formatStat(s.p2First9Score, s.p2First9Darts);
            document.getElementById('stat-opp-leg-avg').innerText = formatStat((501 - currentMatch.p2Score), s.p2LegDarts);
            document.getElementById('stat-opp-leg-darts').innerText = `${t('t-darts')}: ${s.p2LegDarts}`;
            document.getElementById('stat-opp-high-checkout').innerText = s.p2HighCheckout || "—";
            document.getElementById('stat-opp-doubles').innerText = s.p2DoubleAttempts > 0 ? `${s.p2DoubleHits}/${s.p2DoubleAttempts} (${((s.p2DoubleHits / s.p2DoubleAttempts) * 100).toFixed(0)}%)` : "0/0 (0%)";
            document.getElementById('stat-opp-180s').innerText = s.p2OneEighties;

            // Czysty tekst bez małych, zagnieżdżonych obrazków w statystykach
            if (currentMatch.isDoubles) {
                document.getElementById('stat-p1-title').innerHTML = `${getFlagImg(currentMatch.worldCupTeamP1.country)} ${escapeHtml(currentMatch.worldCupTeamP1.country)}`;
                document.getElementById('stat-p2-title').innerHTML = `${getFlagImg(currentMatch.worldCupTeamP2.country)} ${escapeHtml(currentMatch.worldCupTeamP2.country)}`;
            } else {
                const p1Candidate = typeof getCurrentSinglesMatchPlayer === 'function'
                    ? getCurrentSinglesMatchPlayer(true)
                    : player;
                const p2Candidate = typeof getCurrentSinglesMatchPlayer === 'function'
                    ? getCurrentSinglesMatchPlayer(false)
                    : currentMatch.opponent;
                if (p1Candidate) {
                    document.getElementById('stat-p1-title').innerHTML = `${getFlagImg(p1Candidate.country)} ${escapeHtml(p1Candidate.name)}`;
                }
                if (p2Candidate) {
                    document.getElementById('stat-p2-title').innerHTML = `${getFlagImg(p2Candidate.country)} ${escapeHtml(p2Candidate.name)}`;
                }
            }
            
            document.getElementById('in-game-stats').style.display = 'grid';
        }

        function setTurnUI() {
            clearTimeout(window.aiTimeout); // Usuwamy stare opóźnienia
            if (!currentMatch || currentMatch.isFinishing) {
                document.getElementById('throw-btn').disabled = true;
                return;
            }
            
            const playerControlsP1 = !currentMatch.isSpectator
                && (!currentMatch.isDoubles || isCareerPlayerThrowing(true));
            if (currentMatch.turn === 'p1' && playerControlsP1) {
                document.getElementById('score-col-player').classList.add('active-turn'); document.getElementById('score-col-ai').classList.remove('active-turn');
                document.getElementById('player-controls').style.opacity = "1"; document.getElementById('throw-btn').disabled = false;
            } else {
                document.getElementById('score-col-player').classList.toggle('active-turn', currentMatch.turn === 'p1'); document.getElementById('score-col-ai').classList.toggle('active-turn', currentMatch.turn === 'p2');
                document.getElementById('player-controls').style.opacity = "0.5"; document.getElementById('throw-btn').disabled = true;
                if (typeof scheduleSpectatorPlaybackAction === 'function') {
                    window.aiTimeout = scheduleSpectatorPlaybackAction(aiTurn, 1200, 900);
                } else window.aiTimeout = setTimeout(aiTurn, 1200);
            }
        }

        function handleBust(isP1) {
            const throwerName = currentMatch.isDoubles
                ? getCurrentMatchThrowerName(isP1)
                : (typeof getCurrentSinglesMatchPlayerName === 'function'
                    ? getCurrentSinglesMatchPlayerName(isP1)
                    : (isP1 ? t('t-you') : currentMatch.opponent.name));
            logThrow(`${throwerName}: ${t('t-log-bust')}`, isP1 ? 'miss' : 'ai');
            if(isP1) currentMatch.p1Score = currentMatch.p1TurnStartScore; else currentMatch.p2Score = currentMatch.p2TurnStartScore;
            currentTurnScore = 0; updateScores(); updateMatchStatsUI(); endTurn();
        }

        function finishMatch() {
            if (!currentMatch || currentMatch.isFinishing
                || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) return false;
            clearTimeout(window.aiTimeout);
            const match = currentMatch;
            // Wspólna logika wyniku i nagród, lecz reszta rundy oddaje sterowanie
            // po partiach meczów. Pozostałe tryby zachowują dotychczasowy przebieg.
            const isCareerKnockout = match.isTournament && activeTournament && !match.isSpectator && !match.isWorldCup
                && !(typeof isGrandSlamCareerGroupMatch === 'function' && isGrandSlamCareerGroupMatch(match));
            if (isCareerKnockout) {
                const tournament = activeTournament;
                const bracket = tournamentBracket;
                const round = tournamentRound;
                return runTournamentSimulation(() => runTournamentSimulationSteps(
                    iterateMatchCompletion(), round, Math.ceil(bracket.length / 2), () => {
                        if (currentMatch !== match || activeTournament !== tournament
                            || tournamentBracket !== bracket || tournamentRound !== round) {
                            throw new Error('Stan meczu zmienił się podczas rozliczania rundy.');
                        }
                    }
                ), { match, onRestored: () => {
                    currentMatch = match;
                    match.opponent = resolveLoadedPlayer(match.opponent);
                    ['bracket-modal', 'results-modal', 'event-modal'].forEach(id => {
                        const modal = document.getElementById(id);
                        if (modal) modal.style.display = 'none';
                    });
                    updateScores();
                    updateMatchStatsUI();
                    showScreen('screen-match');
                } });
            }
            const steps = iterateMatchCompletion();
            let step = steps.next();
            while (!step.done) step = steps.next();
            return step.value;
        }

        function* iterateMatchCompletion() {
            if (currentMatch?.isSpectator && typeof finishSpectatedTournamentMatch === 'function') {
                finishSpectatedTournamentMatch();
                return;
            }
            if (currentMatch && currentMatch.isWorldCup && typeof finishWorldCupMatch === 'function') {
                finishWorldCupMatch();
                return;
            }
            // --- CHASE THE SUN (Odpalane od razu) ---
            if (postMatchAudio) { postMatchAudio.pause(); }
            if (typeof moddedAssets !== 'undefined' && moddedAssets.sounds["chasethesun"]) {
                postMatchAudio = new Audio(moddedAssets.sounds["chasethesun"]);
                postMatchAudio.volume = 0.5 * globalVolume; 
                postMatchAudio.play().then(() => {
                    // Czas zacznie upływać zaraz po zamknięciu alertu
                    setTimeout(() => {
                        if (!postMatchAudio) return;
                        let fadeVol = postMatchAudio.volume;
                        let fadeInterval = setInterval(() => {
                            fadeVol -= 0.05;
                            if (fadeVol > 0) {
                                postMatchAudio.volume = fadeVol;
                            } else {
                                postMatchAudio.pause();
                                clearInterval(fadeInterval);
                            }
                        }, 200);
                    }, 10000); 
                }).catch(e => console.log("Odtwarzanie zablokowane:", e));
            }
            // -------------------------------------------------------------------------------

            let isP1Winner = false;
            if (currentMatch.matchFormat && currentMatch.matchFormat.type === 'sets') {
                isP1Winner = currentMatch.p1Sets > currentMatch.p2Sets;
            } else {
                isP1Winner = currentMatch.p1Legs > currentMatch.p2Legs;
            }

            // NOWOŚĆ: Najpierw zapisujemy życiówki i odejmujemy energię ZANIM zrobimy cokolwiek innego!
            initCareerStats();
            let finalP1TotalPts = currentMatch.stats.p1AccumulatedScore + (501 - currentMatch.p1Score);
            let finalMatchAvg = null;
            if (currentMatch.stats.p1TotalDarts > 0) {
                finalMatchAvg = (finalP1TotalPts / currentMatch.stats.p1TotalDarts) * 3;
                recordCareerBestAverage(finalMatchAvg);
            }
            if (currentMatch.isTournament && finalMatchAvg !== null) {
                recordSeasonHighestAverage(player, finalMatchAvg);
            }
            if (currentMatch.isTournament && currentMatch.opponent && currentMatch.stats.p2TotalDarts > 0) {
                const finalP2TotalPts = currentMatch.stats.p2AccumulatedScore + (501 - currentMatch.p2Score);
                const opponentMatchAvg = (finalP2TotalPts / currentMatch.stats.p2TotalDarts) * 3;
                recordSeasonHighestAverage(currentMatch.opponent, opponentMatchAvg);
            }
            if (typeof recordCompletedSinglesMatch === 'function') recordCompletedSinglesMatch(currentMatch);
            const finalHighCheckout = currentMatch.stats.p1HighCheckout || 0;
            if (finalHighCheckout > (player.careerStats.highestCheckout || 0)) {
                player.careerStats.highestCheckout = finalHighCheckout;
                addCareerChronicleEvent('checkout', { value: finalHighCheckout });
            }

            checkAchievements('stats'); // <--- DODANE TUTAJ (skanuje po każdym meczu)

            // Przechodzimy do rozstrzygnięcia
            if (currentMatch.isTournament && activeTournament) {
                if (typeof isGrandSlamCareerGroupMatch === 'function' && isGrandSlamCareerGroupMatch(currentMatch)) {
                    const grandSlamOutcome = finishGrandSlamCareerGroupMatch(isP1Winner, currentMatch);
                    currentMatch = null;
                    if (typeof updateHub === 'function') updateHub();
                    showScreen('screen-hub');

                    if (grandSlamOutcome?.phase === 'knockout') {
                        alert(grandSlamOutcome.playerAdvanced
                            ? 'Wygrywasz swoją grupę Grand Slam i awansujesz do Last 16!'
                            : 'Nie wygrywasz swojej grupy Grand Slam. Faza pucharowa będzie kontynuowana przez AI.');
                        showBracket();
                    } else {
                        showGrandSlamGroups();
                    }
                    saveGame(true);
                    return;
                }
                const specialTournamentOutcome = yield* iterateTournamentRound(isP1Winner);

                if (specialTournamentOutcome === true) {
                    currentMatch = null;
                    document.getElementById('bracket-modal').style.display = 'none';
                    concludeContinentalTourQualifierEvent(true);
                    showTournamentEnd();
                    if (typeof updateHub === 'function') updateHub();
                    showScreen('screen-hub');
                    saveGame(true);
                    return;
                }
                if (specialTournamentOutcome === 'worldMastersFinalsQualifier') {
                    currentMatch = null;
                    document.getElementById('bracket-modal').style.display = 'none';
                    concludeWorldMastersFinalsQualifierEvent(true);
                    showTournamentEnd();
                    if (typeof updateHub === 'function') updateHub();
                    showScreen('screen-hub');
                    saveGame(true);
                    return;
                }
                if (specialTournamentOutcome === 'pdcQSchool') {
                    currentMatch = null;
                    document.getElementById('bracket-modal').style.display = 'none';
                    concludePdcQSchoolEvent(true);
                    showTournamentEnd();
                    if (typeof updateHub === 'function') updateHub();
                    showScreen('screen-hub');
                    saveGame(true);
                    return;
                }
                if (specialTournamentOutcome === 'pdcTourCardQualifier') {
                    currentMatch = null;
                    document.getElementById('bracket-modal').style.display = 'none';
                    concludePdcTourCardQualifierEvent(true);
                    showTournamentEnd();
                    if (typeof updateHub === 'function') updateHub();
                    showScreen('screen-hub');
                    saveGame(true);
                    return;
                }

                if (tournamentBracket.length === 1) {
                    activeTournament.completed = true;
                    if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(activeTournament);
                    else activeTournament.historyLogs = lastTournamentResults;
                    
                    let winner = tournamentBracket[0];
                    let winPrize = getPrizeMoney(activeTournament.name, 2, true);
                    awardPrizeMoney(winner, winPrize, activeTournament.name); 
                    if (typeof completeWorldMastersTournament === 'function') completeWorldMastersTournament(activeTournament, winner);
                    recordSeasonTournamentResult(winner, activeTournament, { round: 2, prizeMoney: winPrize, won: true });

                    // Wypłaty za miejsca 5-8 po finałach Play-offs!
                    if (activeTournament.name.includes("Play-offs")) {
                        let sortedGDL = [...gdlTable].sort((a,b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost));
                        if(sortedGDL[4]) awardPrizeMoney(sortedGDL[4].player, 95000, activeTournament.name);
                        if(sortedGDL[5]) awardPrizeMoney(sortedGDL[5].player, 90000, activeTournament.name);
                        if(sortedGDL[6]) awardPrizeMoney(sortedGDL[6].player, 85000, activeTournament.name);
                        if(sortedGDL[7]) awardPrizeMoney(sortedGDL[7].player, 80000, activeTournament.name);
                    }

                    if (isCurrentPlayer(winner)) {
                        alert(t('t-alert-tour-win').replace('{tour}', activeTournament.name).replace('{prize}', winPrize.toLocaleString('en-GB')));
                        player.careerStats.trophies.push(activeTournament.name);
                        addCareerChronicleEvent('trophy', { tournament: activeTournament.name, prize: winPrize });
                        sendTournamentSummaryEmail(activeTournament.name, winPrize, true);
                        checkAchievements('tour_win', activeTournament); // Przekazujemy turniej, aby uwzględnić również nazwy z modów.
                    } else {
                        alert(t('t-alert-tour-end').replace('{tour}', activeTournament.name).replace('{winner}', winner.name));
                        let myPrize = getPrizeMoney(activeTournament.name, 2, false);
                        sendTournamentSummaryEmail(activeTournament.name, myPrize, false);
                    }
                    
                    showTournamentEnd();
                    activeTournament = null;
                    tournamentBracket = []; // <--- CZYŚCI DRABINKĘ GDY TY WYGRYWASZ
                    document.getElementById('tile-tournament').style.display = 'none';
                    
                    // Czyścimy mecz i wracamy do huba
                    currentMatch = null;
                    if (typeof updateHub === 'function') updateHub();
                    showScreen('screen-hub');
                    saveGame(true);

                } else if (!isP1Winner) {
                    const qualifierMessage = typeof getNonPrizeQualifierEliminationMessage === 'function'
                        ? getNonPrizeQualifierEliminationMessage(activeTournament, player)
                        : '';
                    if (qualifierMessage) {
                        alert(qualifierMessage);
                    } else {
                        const myPrize = Number(getPrizeMoney(activeTournament.name, tournamentRound * 2, false));
                        if (Number.isFinite(myPrize)) {
                            alert(t('t-alert-knockout').replace('{tour}', activeTournament.name).replace('{prize}', myPrize.toLocaleString('en-GB')));
                            sendTournamentSummaryEmail(activeTournament.name, myPrize, false);
                        } else {
                            // Modowane lub starsze kwalifikatory również mogą nie
                            // mieć tabeli nagród. Brak kwoty nie może przerwać rundy.
                            alert(t('t-alert-no-qual').replace('{tour}', activeTournament.name));
                        }
                    }
                    
                    // KLUCZOWE ZABEZPIECZENIE: Czyścimy mecz po odpadnięciu!
                    currentMatch = null;
                    if (typeof updateHub === 'function') updateHub();
                    
                    showRoundResults(); 
                } else {
                    // KLUCZOWE ZABEZPIECZENIE: Czyścimy mecz po wygranej, bo przed nami wyniki rundy!
                    currentMatch = null;
                    if (typeof updateHub === 'function') updateHub();
                    
                    // Sprawdzamy, czy to zwykły turniej podłogowy bez kamer
                    let isFloorTournament = activeTournament.name.includes("Players Championship") || activeTournament.name.includes("Pro Players Cup");
                    let isFinals = activeTournament.name.includes("Finals"); // Finały PC to już turniej TV!

                    // Wywiad: Szansa 40%, od ćwierćfinału w górę, TYLKO w turniejach TV/Scenicznych
                    if (tournamentRound <= 8 && (!isFloorTournament || isFinals) && Math.random() < 0.40) {
                        triggerInterview();
                    }

                    showRoundResults(); 
                }
            } else {
                // Logika dla zwykłego sparingu poza turniejem
                if (isP1Winner) {
                    alert(t('t-alert-friendly-win').replace('{opp}', currentMatch.opponent.name));
                    if (typeof player.money !== 'undefined') player.money += 50; 
                } else {
                    alert(t('t-alert-friendly-lose').replace('{opp}', currentMatch.opponent.name));
                }
                
                currentMatch = null;
                if (typeof updateHub === 'function') updateHub();
                showScreen('screen-hub');
            }
        }

        
