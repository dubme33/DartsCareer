function checkAchievements(type, data = null) {
            if (!player.achievements) player.achievements = [];
            let newlyUnlocked = false;
            const langSuffix = `_${currentLang}`;

            achievementsDB.forEach(ach => {
                if (player.achievements.includes(ach.id)) return; // Jeśli już masz, pomiń

                let unlock = false;
                
                // Weryfikacja starych warunków
                if (ach.type === '180s' && player.careerStats.total180s >= ach.target) unlock = true;
                if (ach.type === '9darter' && type === '9darter') unlock = true;
                if (ach.type === 'sudden_death' && type === 'sudden_death') unlock = true;
                if (ach.type === 'tour_win' && type === 'tour_win') unlock = true;
                if (ach.type === 'specific_tour' && type === 'tour_win' && data) {
                    const tournament = typeof data === 'object' ? data : null;
                    const tournamentName = tournament ? tournament.name : data;
                    const matchesTournamentName = ach.tourMatches
                        ? ach.tourMatches.includes(tournamentName)
                        : tournamentName && tournamentName.includes(ach.tourMatch);
                    const matchesTournamentType = tournament && ach.tournamentSpecialType && tournament.specialType === ach.tournamentSpecialType;
                    if (matchesTournamentName || matchesTournamentType) unlock = true;
                }
                
                // NOWE WARUNKI: Big Fish, Zamki 100+, Ranking
                if (ach.type === '170_checkout' && player.careerStats.highestCheckout === 170) unlock = true;
                if (ach.type === '100plus_checkouts' && (player.careerStats.tonPlusCheckouts || 0) >= ach.target) unlock = true;
                if (ach.type === 'rank') {
                    // Pobieramy aktualny ranking (miejsce gracza) w głównym OOM
                    let currentRank = getPlayerRank('main');
                    if (currentRank <= ach.rankTarget) unlock = true;
                }

                // Odblokowanie!
                if (unlock) {
                    player.achievements.push(ach.id);
                    player.budget += ach.rewardMoney;
                    let title = ach[`title${langSuffix}`] || ach.title_pl;
                    
                    const amount = ach.rewardMoney.toLocaleString('en-GB');
                    const message = typeof trAchievementUi === 'function'
                        ? trAchievementUi('unlockedAlert', { title, amount })
                        : `🏆 ODBLOKOWANO OSIĄGNIĘCIE!\n\n${title}\nOtrzymujesz bonus: £${amount}`;
                    alert(message);
                    newlyUnlocked = true;
                }
            });

            if (newlyUnlocked) {
                updateHub();
                saveGame();
            }
        }

        function startSuddenDeath() {
            const st = currentMatch.stats;
            st.p1AccumulatedScore += (501 - currentMatch.p1Score);
            st.p2AccumulatedScore += (501 - currentMatch.p2Score);
            st.p1LegDarts = 0;
            st.p2LegDarts = 0;

            currentMatch.p1Score = 501;
            currentMatch.p2Score = 501;
            currentMatch.p1TurnStartScore = 501;
            currentMatch.p2TurnStartScore = 501;
            currentMatch.suddenDeath = { p1Score: 0, p2Score: 0, p1Darts: 0, p2Darts: 0 };
            currentMatch.turn = 'p1';
            currentMatch.dartsThrown = 0;
            currentTurnScore = 0;
            drawnDarts = [];

            document.getElementById('match-title').innerText += ` — ${t('t-sudden-death')}`;
            logThrow(`⚡ ${t('t-log-sd-start')}`, 'hit');
            updateScores();
            updateMatchStatsUI();
            updateDartDots();
            drawDartboard();
            setTurnUI();
        }

        function resolveSuddenDeath() {
            const suddenDeath = currentMatch.suddenDeath;
            const isP1 = suddenDeath.p1Score > suddenDeath.p2Score;
            if (suddenDeath.p1Score === suddenDeath.p2Score) {
                logThrow(`⚡ ${t('t-log-sd-tie')}`, 'miss');
                setTimeout(() => {
                    if (!currentMatch || !currentMatch.suddenDeath) return;
                    currentMatch.suddenDeath = { p1Score: 0, p2Score: 0, p1Darts: 0, p2Darts: 0 };
                    currentMatch.turn = 'p1';
                    currentMatch.dartsThrown = 0;
                    currentTurnScore = 0;
                    drawnDarts = [];
                    updateScores();
                    updateDartDots();
                    drawDartboard();
                    setTurnUI();
                }, 1500);
                return;
            }

            const winnerName = currentMatch.isDoubles ? getDoublesTeamName(isP1) : (isP1 ? player.name : currentMatch.opponent.name);
            logThrow(`⚡ ${winnerName} ${t('t-log-sd-win')}`, isP1 ? 'hit' : 'ai');

            // W mistrzostwach świata sudden death rozstrzyga ostatni, decydujący set.
            // Dopiero teraz dopisujemy go do wyniku meczu — nie do zwykłego licznika legów.
            if (currentMatch.suddenDeathDecidesSet) {
                if (isP1) currentMatch.p1Sets++;
                else currentMatch.p2Sets++;
                currentMatch.suddenDeathDecidesSet = false;
                logThrow(`🏆 ${winnerName} ${t('t-log-wins-set')}`, isP1 ? 'hit' : 'ai');
            }

            currentMatch.suddenDeath = null;
            if (isP1) checkAchievements('sudden_death'); // <--- DODANE TUTAJ
            finishMatch(isP1, winnerName);
        }

        function processSuddenDeathThrow(isP1, targetSec, targetMult, hitSec, hitMult) {
            const suddenDeath = currentMatch.suddenDeath;
            const points = hitSec * hitMult;
            const playerName = currentMatch.isDoubles ? getCurrentMatchThrowerName(isP1) : (isP1 ? player.name : currentMatch.opponent.name);
            const logType = isP1 ? 'hit' : 'ai';

            addDartToCanvas(hitSec, hitMult, isP1 ? '#f1c40f' : '#ecf0f1', targetSec, targetMult);
            if (isP1) {
                suddenDeath.p1Score += points;
                suddenDeath.p1Darts++;
                currentMatch.dartsThrown = suddenDeath.p1Darts;
            } else {
                suddenDeath.p2Score += points;
                suddenDeath.p2Darts++;
                currentMatch.dartsThrown = suddenDeath.p2Darts;
            }

            logThrow(`⚡ ${playerName} ${t('t-log-throws')}: ${getPrefix(hitMult)}${hitSec} (${points})`, logType);
            updateScores();
            updateDartDots();

            if (isP1 && suddenDeath.p1Darts === 3) {
                currentMatch.turn = 'p2';
                currentMatch.dartsThrown = 0;
                setTurnUI();
                return;
            }

            if (!isP1 && suddenDeath.p2Darts === 3) {
                resolveSuddenDeath();
                return;
            }

            if (!isP1) {
                clearTimeout(window.aiTimeout);
                window.aiTimeout = setTimeout(aiTurn, 1200);
            }
        }

       function handleCompletedLeg(isP1, playerName) {
            const st = currentMatch.stats;
            // --- SPRAWDZANIE 9-DARTERA ---
            if (isP1 && st.p1LegDarts === 9 && (!currentMatch.isDoubles || isCareerPlayerThrowing(true))) {
                setTimeout(() => triggerNineDarterAlert(), 1500);
                checkAchievements('9darter');
            }
            // -----------------------------
            const isSetMatch = currentMatch.matchFormat && currentMatch.matchFormat.type === 'sets';
            let setWasWon = false;
            
            // 1. Zwiększenie licznika rozegranych legów
            currentMatch.totalLegsPlayed++;

            // 2. KLUCZOWA POPRAWKA: Dodanie wygranego lega do wyniku!
            if (isP1) {
                currentMatch.p1Legs++;
            } else {
                currentMatch.p2Legs++;
            }

            const format = currentMatch.matchFormat || {};
            const isDecidingSet = isSetMatch && format.decidingSetWinByTwo &&
                currentMatch.p1Sets === format.setsToWin - 1 &&
                currentMatch.p2Sets === format.setsToWin - 1;
            const legDifference = Math.abs(currentMatch.p1Legs - currentMatch.p2Legs);
            const setHasLegWinner = currentMatch.p1Legs >= format.legsPerSet || currentMatch.p2Legs >= format.legsPerSet;
            const setWonByRequiredMargin = !isDecidingSet || legDifference >= 2;

            // 3. Sprawdzanie wygranej w formacie setowym. W decydującym secie MŚ
            // wymagane są dwa legi przewagi, więc wynik 3:2 nie kończy jeszcze seta.
            if (isSetMatch && setHasLegWinner && setWonByRequiredMargin) {
                setWasWon = true;
                if (isP1) currentMatch.p1Sets++;
                else currentMatch.p2Sets++;
                logThrow(`🏆 ${currentMatch.isDoubles ? getDoublesTeamName(isP1) : (isP1 ? player.name : currentMatch.opponent.name)} ${t('t-log-wins-set')}`, isP1 ? 'hit' : 'ai');
            }

            const decidingSetReachedSuddenDeath = isDecidingSet && format.decidingSetSuddenDeathAt &&
                currentMatch.p1Legs === format.decidingSetSuddenDeathAt &&
                currentMatch.p2Legs === format.decidingSetSuddenDeathAt;
            const legMatchReachedSuddenDeath = format.suddenDeathAt &&
                currentMatch.p1Legs === format.suddenDeathAt &&
                currentMatch.p2Legs === format.suddenDeathAt;

            // 4. Sudden death w zwykłym meczu legowym lub przy 5:5 w decydującym secie MŚ.
            if (decidingSetReachedSuddenDeath || legMatchReachedSuddenDeath) {
                currentMatch.suddenDeathDecidesSet = decidingSetReachedSuddenDeath;
                updateScores(); // Odświeżamy wynik przed nagłą śmiercią
                startSuddenDeath();
                return true;
            }

           // 5. Sprawdzanie czy mecz się zakończył
            if (isMatchFinished()) {
                document.getElementById('throw-btn').disabled = true;
                announceAudio('win_match', playerName); // Sędzia krzyczy koniec meczu!
                updateScores(); // Pokazuje ostateczny wynik np. 6:4
                
                // Czekamy 2.5 sekundy, żeby sędzia zdążył wybrzmieć, zanim wyskoczy okienko
                setTimeout(() => {
                    finishMatch();
                }, 2500);
                return true;
            }

            if (currentMatch.isDoubles) {
                const side = isP1 ? 'p1' : 'p2';
                currentMatch.doublesThrower[side] = currentMatch.doublesThrower[side] === 0 ? 1 : 0;
            }

            document.getElementById('throw-btn').disabled = true;
            announceAudio('win_leg', playerName);
            updateScores(); // Od razu aktualizuje wynik na tablicy (np. na 1:0)

            setTimeout(() => {
                if (!currentMatch) return;
                
                // Dodajemy resztkę z 501 do ogólnej sumy punktów (do średniej)
                st.p1AccumulatedScore += (501 - currentMatch.p1Score);
                st.p2AccumulatedScore += (501 - currentMatch.p2Score);

                // Reset punktacji do 501
                currentMatch.p1Score = 501;
                currentMatch.p2Score = 501;
                currentMatch.p1TurnStartScore = 501;
                currentMatch.p2TurnStartScore = 501;
                st.p1LegDarts = 0;
                st.p2LegDarts = 0;

                // --- NOWOŚĆ: Emocje opadają co leg ---
                currentMatch.p1Momentum = 0; 
                currentMatch.p2Momentum = 0;

                // Jeśli ktoś wygrał seta, zerujemy legi na nową partię
                if (setWasWon) {
                    currentMatch.p1Legs = 0;
                    currentMatch.p2Legs = 0;
                }

                // Zmiana rozpoczynającego (naprzemiennie co leg)
                currentMatch.turn = (currentMatch.totalLegsPlayed % 2 === 0) ? currentMatch.startingPlayer : (currentMatch.startingPlayer === 'p1' ? 'p2' : 'p1');
                currentMatch.dartsThrown = 0;
                currentTurnScore = 0;
                drawnDarts = [];

                updateScores();
                updateMatchStatsUI();
                setTurnUI();
                drawDartboard();
                updateDartDots();
            }, 2500);

            return true;
        }

        function processThrow(isP1, targetSec, targetMult, hitSec, hitMult) {
            if (currentMatch.suddenDeath) {
                if (typeof processSuddenDeathThrow === 'function') processSuddenDeathThrow(isP1, targetSec, targetMult, hitSec, hitMult);
                return;
            }

            if (currentMatch.p1Momentum === undefined) { currentMatch.p1Momentum = 0; currentMatch.p2Momentum = 0; }

            let points = hitSec * hitMult; 
            let currentScore = isP1 ? currentMatch.p1Score : currentMatch.p2Score;
            let playerName = currentMatch.isDoubles ? getCurrentMatchThrowerName(isP1) : (isP1 ? player.name : currentMatch.opponent.name); 
            let logType = isP1 ? 'hit' : 'ai';
            
            if (activeTournament && activeTournament.format === 'DIDO' && currentScore === 501) {
                if (hitMult !== 2) {
                    logThrow(`${playerName}: ${t('t-log-miss-dido')}`, logType);
                    points = 0; adjustMomentum(isP1, -1);
                }
            }

            currentTurnScore += points;
            if (typeof addDartToCanvas === 'function') addDartToCanvas(hitSec, hitMult, isP1 ? '#f1c40f' : '#ecf0f1', targetSec, targetMult);

            let st = currentMatch.stats; let newScore = currentScore - points;

            let isAimingAtFinishingDouble = (targetMult === 2 && (currentScore <= 40 || (currentScore === 50 && targetSec === 25)));

            if (isP1) {
                st.p1TotalDarts++; st.p1LegDarts++;
                if (st.p1LegDarts <= 9 && newScore >= 0) { st.p1First9Score += points; st.p1First9Darts++; }
                if (isAimingAtFinishingDouble) {
                    st.p1DoubleAttempts++;
                    if (newScore === 0 && hitMult === 2) st.p1DoubleHits++;
                }
            } else {
                st.p2TotalDarts++; st.p2LegDarts++;
                if (st.p2LegDarts <= 9 && newScore >= 0) { st.p2First9Score += points; st.p2First9Darts++; }
                if (isAimingAtFinishingDouble) {
                    st.p2DoubleAttempts++;
                    if (newScore === 0 && hitMult === 2) st.p2DoubleHits++;
                }
            }

            if (newScore < 0 || newScore === 1 || (newScore === 0 && hitMult !== 2)) {
                logThrow(`${playerName}: ${t('t-log-bust')}`, logType);
                newScore = isP1 ? currentMatch.p1TurnStartScore : currentMatch.p2TurnStartScore; 
                currentTurnScore = 0; 
                
                // NOWOŚĆ: Doliczanie brakujących lotek do statystyk przy furze!
                let missingDarts = 2 - currentMatch.dartsThrown; 
                if (isP1) {
                    st.p1TotalDarts += missingDarts;
                    st.p1LegDarts += missingDarts;
                } else {
                    st.p2TotalDarts += missingDarts;
                    st.p2LegDarts += missingDarts;
                }
                
                // Ustawiamy na 2, ponieważ na dole funkcji "processThrow" znajduje się "currentMatch.dartsThrown++", 
                // co za chwilę podbije tę wartość do idealnych, ostatecznych 3 lotek.
                currentMatch.dartsThrown = 2; 
                adjustMomentum(isP1, -2);
            } else {
                let multStr = hitMult === 3 ? 'T' : (hitMult === 2 ? 'D' : '');
                let secStr = hitSec === 25 ? (hitMult === 2 ? 'Bull' : '25') : hitSec;
                if (points > 0) logThrow(`${playerName} ${t('t-log-throws')}: ${multStr}${secStr} (${points})`, logType);
                else logThrow(`${playerName} ${t('t-log-throws')}: ${t('t-log-miss-0')}`, logType);

                if (currentScore <= 50 && targetMult === 2 && hitMult !== 2) adjustMomentum(isP1, -1);
            }

            if (isP1) currentMatch.p1Score = newScore; else currentMatch.p2Score = newScore;
            currentMatch.dartsThrown++; 

            if (currentMatch.dartsThrown >= 3 && currentTurnScore === 180) {
                if (isP1) {
                    st.p1OneEighties++;
                    if (!currentMatch.isDoubles || isCareerPlayerThrowing(true)) {
                        initCareerStats();
                        player.careerStats.total180s++; 
                    }
                } else { st.p2OneEighties++; }
                adjustMomentum(isP1, 3);
            }

            updateScores(); updateMatchStatsUI(); updateDartDots();

            if (newScore === 0 && hitMult === 2) {
                if (isP1) {
                    st.p1HighCheckout = Math.max(st.p1HighCheckout || 0, currentTurnScore);
                    if (!currentMatch.isDoubles || isCareerPlayerThrowing(true)) {
                        initCareerStats();
                        if (currentTurnScore > (player.careerStats.highestCheckout || 0)) {
                            player.careerStats.highestCheckout = currentTurnScore;
                            addCareerChronicleEvent('checkout', { value: currentTurnScore });
                        }
                        
                        // NOWOŚĆ: Śledzenie checkoutów powyżej 100 punktów
                        if (currentTurnScore >= 100) {
                            player.careerStats.tonPlusCheckouts = (player.careerStats.tonPlusCheckouts || 0) + 1;
                        }
                    }
                }
                else st.p2HighCheckout = Math.max(st.p2HighCheckout || 0, currentTurnScore);
                
                if (currentTurnScore >= 100) adjustMomentum(isP1, 2);
                updateMatchStatsUI(); 

                logThrow(`🎯 ${playerName} ${t('t-log-wins-leg')}`, 'system');
                setTimeout(() => handleCompletedLeg(isP1, playerName), 1000);
                return;
            }

            if (currentMatch.dartsThrown >= 3) {
                setTimeout(() => endTurn(), 100);
            } else if (!isP1 || (currentMatch.isDoubles && !isCareerPlayerThrowing(isP1))) {
                clearTimeout(window.aiTimeout); // Czyścimy przed kolejnym rzutem
                window.aiTimeout = setTimeout(() => aiTurn(), 650); 
            }
        }

        function endTurn() {
            let wasP1 = currentMatch.turn === 'p1';
            
            if (currentMatch.dartsThrown === 3) {
                if (currentTurnScore >= 100) adjustMomentum(wasP1, 1);
                else if (currentTurnScore < 40) adjustMomentum(wasP1, -1);
            }

            if (currentMatch.p1Score > 0 && currentMatch.p2Score > 0) announceAudio(currentTurnScore);
            currentMatch.dartsThrown = 0; currentTurnScore = 0; updateDartDots(); drawnDarts = []; setTimeout(() => { drawDartboard(); }, 500);
            if (currentMatch.p1Score === 0 || currentMatch.p2Score === 0) return;
            
            if (currentMatch.vsAI) {
                if (currentMatch.isDoubles) {
                    const side = wasP1 ? 'p1' : 'p2';
                    currentMatch.doublesThrower[side] = currentMatch.doublesThrower[side] === 0 ? 1 : 0;
                }
                currentMatch.turn = currentMatch.turn === 'p1' ? 'p2' : 'p1';
                if(currentMatch.turn === 'p1') { 
                    currentMatch.p1TurnStartScore = currentMatch.p1Score; 
                    if (currentMatch.p1Score <= 170) setTimeout(() => announceRequire(currentMatch.p1Score), 1500);
                } else { currentMatch.p2TurnStartScore = currentMatch.p2Score; }
                setTurnUI();
            } else { 
                currentMatch.p1TurnStartScore = currentMatch.p1Score; 
                if (currentMatch.p1Score <= 170) setTimeout(() => announceRequire(currentMatch.p1Score), 1500);
            }
        }

        
