function achievementMatchesTournament(achievement, data) {
            if (!achievement || !data) return false;
            const tournament = typeof data === 'object' ? data : null;
            const names = [tournament?.name, tournament?.sourceName, tournament ? null : data]
                .map(value => String(value || '').trim())
                .filter(Boolean);
            const exactMatch = Array.isArray(achievement.tourMatches)
                && achievement.tourMatches.some(expected => names.includes(expected));
            const partialMatch = typeof achievement.tourMatch === 'string' && achievement.tourMatch
                && names.some(name => name.includes(achievement.tourMatch));
            let patternMatch = false;
            if (typeof achievement.tourNamePattern === 'string' && achievement.tourNamePattern) {
                try {
                    const pattern = new RegExp(achievement.tourNamePattern, 'i');
                    patternMatch = names.some(name => pattern.test(name));
                } catch (_error) {
                    patternMatch = false;
                }
            }
            const typeMatch = Boolean(tournament && achievement.tournamentSpecialType
                && tournament.specialType === achievement.tournamentSpecialType);
            return Boolean(exactMatch || partialMatch || patternMatch || typeMatch);
        }

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
                    if (achievementMatchesTournament(ach, data)) unlock = true;
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
                    if (typeof recordTournamentAchievementCash === 'function') recordTournamentAchievementCash(ach.rewardMoney, type === 'tour_win' ? data : null);
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

        function startSuddenDeath(completedLegWinnerIsP1 = null) {
            resetMatchThrowGrouping(currentMatch);
            const st = currentMatch.stats;
            st.p1AccumulatedScore += (501 - currentMatch.p1Score);
            st.p2AccumulatedScore += (501 - currentMatch.p2Score);
            st.p1LegDarts = 0;
            st.p2LegDarts = 0;

            currentMatch.p1Score = 501;
            currentMatch.p2Score = 501;
            currentMatch.p1TurnStartScore = 501;
            currentMatch.p2TurnStartScore = 501;
            // Sudden death jest wyłącznie znacznikiem decydującego lega. Punktacja,
            // kolejność podejść, busty i double-out korzystają ze zwykłego silnika 501.
            currentMatch.suddenDeath = { decidingLeg: true };
            currentMatch.p1Momentum = 0;
            currentMatch.p2Momentum = 0;
            if (currentMatch.isDoubles && completedLegWinnerIsP1 !== null) {
                const side = completedLegWinnerIsP1 ? 'p1' : 'p2';
                currentMatch.doublesThrower[side] = currentMatch.doublesThrower[side] === 0 ? 1 : 0;
            }
            currentMatch.turn = (currentMatch.totalLegsPlayed % 2 === 0)
                ? currentMatch.startingPlayer
                : (currentMatch.startingPlayer === 'p1' ? 'p2' : 'p1');
            currentMatch.dartsThrown = 0;
            currentMatch.isTurnLocked = false;
            currentMatch.isDartInFlight = false;
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

       function handleCompletedLeg(isP1, playerName) {
            resetMatchThrowGrouping(currentMatch);
            const st = currentMatch.stats;
            const wasSuddenDeath = Boolean(currentMatch.suddenDeath);
            // --- SPRAWDZANIE 9-DARTERA ---
            if (isP1 && !currentMatch.isSpectator && st.p1LegDarts === 9 && (!currentMatch.isDoubles || isCareerPlayerThrowing(true))) {
                if (!currentMatch.interviewFacts) currentMatch.interviewFacts = {};
                currentMatch.interviewFacts.nineDarter = true;
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
            if (!Array.isArray(currentMatch.interviewLegScores)) currentMatch.interviewLegScores = [];
            currentMatch.interviewLegScores.push({
                p1: currentMatch.p1Legs,
                p2: currentMatch.p2Legs,
                p1Sets: currentMatch.p1Sets,
                p2Sets: currentMatch.p2Sets
            });

            const format = currentMatch.matchFormat || {};
            const isDecidingSet = isSetMatch && format.decidingSetWinByTwo &&
                currentMatch.p1Sets === format.setsToWin - 1 &&
                currentMatch.p2Sets === format.setsToWin - 1;
            const legDifference = Math.abs(currentMatch.p1Legs - currentMatch.p2Legs);
            const setHasLegWinner = currentMatch.p1Legs >= format.legsPerSet || currentMatch.p2Legs >= format.legsPerSet;
            const setWonByRequiredMargin = !isDecidingSet || legDifference >= 2 || wasSuddenDeath;

            // 3. Sprawdzanie wygranej w formacie setowym. W decydującym secie MŚ
            // wymagane są dwa legi przewagi, więc wynik 3:2 nie kończy jeszcze seta.
            if (isSetMatch && setHasLegWinner && setWonByRequiredMargin) {
                setWasWon = true;
                if (isP1) currentMatch.p1Sets++;
                else currentMatch.p2Sets++;
                const setWinnerName = currentMatch.isDoubles
                    ? getDoublesTeamName(isP1)
                    : (typeof getCurrentSinglesMatchPlayerName === 'function'
                        ? getCurrentSinglesMatchPlayerName(isP1)
                        : (isP1 ? player.name : currentMatch.opponent.name));
                logThrow(`🏆 ${setWinnerName} ${t('t-log-wins-set')}`, isP1 ? 'hit' : 'ai');
            }

            if (wasSuddenDeath) {
                const winnerName = currentMatch.isDoubles
                    ? getDoublesTeamName(isP1)
                    : (typeof getCurrentSinglesMatchPlayerName === 'function'
                        ? getCurrentSinglesMatchPlayerName(isP1)
                        : (isP1 ? player.name : currentMatch.opponent.name));
                logThrow(`⚡ ${winnerName} ${t('t-log-sd-win')}`, isP1 ? 'hit' : 'ai');
                currentMatch.suddenDeath = null;
                currentMatch.suddenDeathDecidesSet = false;
                if (isP1 && !currentMatch.isSpectator) checkAchievements('sudden_death');
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
                const beginSuddenDeath = () => startSuddenDeath(isP1);
                if (!(typeof window !== 'undefined' && window.matchTVDirector?.deferMatchAction?.(beginSuddenDeath))) {
                    beginSuddenDeath();
                }
                return true;
            }

           // 5. Sprawdzanie czy mecz się zakończył
            if (isMatchFinished()) {
                document.getElementById('throw-btn').disabled = true;
                const visitButton = document.getElementById('t-btn-sim-visit');
                if (visitButton) visitButton.disabled = true;
                const completedMatch = currentMatch;
                const completedTournament = activeTournament;
                const winnerSide = isP1 ? 'p1' : 'p2';
                const callerCompletion = announceAudio('win_match', playerName); // Sędzia krzyczy koniec meczu!
                updateScores(); // Pokazuje ostateczny wynik np. 6:4

                const finishAction = () => {
                    if (currentMatch === completedMatch) finishMatch();
                };
                const startFinalPresentation = () => {
                    if (currentMatch !== completedMatch) return;
                    if (typeof window !== 'undefined') {
                        window.matchCrowd?.playPostMatch?.(completedMatch, completedTournament);
                        const presentation = window.matchFinalScore?.show?.({
                            match: completedMatch, tournament: completedTournament, winnerSide
                        });
                        if (presentation && typeof presentation.then === 'function') {
                            presentation.then(finishAction, finishAction);
                            return;
                        }
                    }
                    if (typeof scheduleSpectatorPlaybackAction === 'function') {
                        window.aiTimeout = scheduleSpectatorPlaybackAction(finishAction, 2500, 2800);
                    } else window.aiTimeout = setTimeout(finishAction, 2500);
                };
                const afterCaller = () => {
                    if (callerCompletion && typeof callerCompletion.then === 'function') {
                        Promise.resolve(callerCompletion).catch(() => undefined).then(startFinalPresentation);
                    } else startFinalPresentation();
                };

                // Jeżeli reżyser TV pokazuje powtórkę ostatniej lotki, plansza wyniku
                // czeka zarówno na tę powtórkę, jak i na pełną zapowiedź callera.
                if (typeof window !== 'undefined' && window.matchTVDirector?.deferMatchAction?.(afterCaller)) {
                    window.aiTimeout = null;
                } else afterCaller();
                return true;
            }

            if (currentMatch.isDoubles) {
                const side = isP1 ? 'p1' : 'p2';
                currentMatch.doublesThrower[side] = currentMatch.doublesThrower[side] === 0 ? 1 : 0;
            }

            document.getElementById('throw-btn').disabled = true;
            const visitButton = document.getElementById('t-btn-sim-visit');
            if (visitButton) visitButton.disabled = true;
            announceAudio('win_leg', playerName);
            updateScores(); // Od razu aktualizuje wynik na tablicy (np. na 1:0)

            const startNextLeg = () => {
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
                currentMatch.isTurnLocked = false;
                currentMatch.isDartInFlight = false;
                currentTurnScore = 0;
                drawnDarts = [];

                updateScores();
                updateMatchStatsUI();
                setTurnUI();
                drawDartboard();
                updateDartDots();
            };
            if (typeof window !== 'undefined' && window.matchTVDirector?.deferMatchAction?.(startNextLeg)) {
                window.aiTimeout = null;
            } else if (typeof scheduleSpectatorPlaybackAction === 'function') {
                window.aiTimeout = scheduleSpectatorPlaybackAction(startNextLeg, 2500, 2500);
            } else window.aiTimeout = setTimeout(startNextLeg, 2500);

            return true;
        }

        function processThrow(isP1, targetSec, targetMult, hitSec, hitMult, result = null) {
            if (!currentMatch || currentMatch.isFinishing) return;

            // To jest ostateczna granica bezpieczeństwa dla wszystkich źródeł
            // rzutu (przycisk gracza, AI i ewentualne wywołania programowe).
            // Dzięki temu żadne opóźnione lub wielokrotne kliknięcie nie może
            // dopisać czwartej lotki do bieżącego podejścia.
            const throwingSide = isP1 ? 'p1' : 'p2';
            if (currentMatch.turn !== throwingSide || currentMatch.dartsThrown >= 3
                || currentMatch.isTurnLocked || currentMatch.isDartInFlight) return;

            // Resolve the physical hit before checkout, bust, statistics and report handling.
            // Direct/programmatic throws use the same solver as player, AI and fast visits.
            if (typeof dartPhysics !== 'undefined' && !result?.physicsResolved && typeof getDartboardHitPoint === 'function') {
                const point = result?.boardPoint || getDartboardHitPoint(result?.bouncedSector ?? hitSec,
                    result?.bouncedMult ?? hitMult, targetSec, targetMult);
                result = dartPhysics.resolve({ ...(result || {}), sector: hitSec, mult: hitMult }, point, drawnDarts,
                    Math.random, typeof areBounceOutsEnabled !== 'function' || areBounceOutsEnabled());
                hitSec = result.sector; hitMult = result.mult;
            }
            const bounced = result?.bounceOut === true;
            if (bounced) {
                hitSec = 0; hitMult = 0;
                if (typeof recordMatchBounceOut === 'function') recordMatchBounceOut(isP1, result);
                if (typeof showBounceOutFeedback === 'function') showBounceOutFeedback(result);
            }

            if (currentMatch.p1Momentum === undefined) { currentMatch.p1Momentum = 0; currentMatch.p2Momentum = 0; }

            let points = hitSec * hitMult; 
            let currentScore = isP1 ? currentMatch.p1Score : currentMatch.p2Score;
            let playerName = currentMatch.isDoubles
                ? getCurrentMatchThrowerName(isP1)
                : (typeof getCurrentSinglesMatchPlayerName === 'function'
                    ? getCurrentSinglesMatchPlayerName(isP1)
                    : (isP1 ? player.name : currentMatch.opponent.name));
            let logType = isP1 ? 'hit' : 'ai';
            
            if (activeTournament && activeTournament.format === 'DIDO' && currentScore === 501) {
                if (hitMult !== 2) {
                    logThrow(`${playerName}: ${t('t-log-miss-dido')}`, logType);
                    points = 0; adjustMomentum(isP1, -1);
                }
            }

            currentTurnScore += points;
            if (!bounced && typeof addDartToCanvas === 'function') addDartToCanvas(hitSec, hitMult, isP1 ? '#f1c40f' : '#ecf0f1', targetSec, targetMult, result, isP1 ? 'p1' : 'p2');
            if (result?.collision && typeof getDartCollisionText === 'function') logThrow(`↗ ${playerName}: ${getDartCollisionText(result)}`, logType);

            let st = currentMatch.stats; let newScore = currentScore - points;
            const actualResult = { ...(result || {}), sector: hitSec, mult: hitMult };
            if (typeof recordMatchReportDart === 'function') {
                recordMatchReportDart(currentMatch, isP1, currentScore, { sector: targetSec, mult: targetMult }, actualResult);
            }
            if (typeof recordMentalThrowOutcome === 'function') {
                recordMentalThrowOutcome(isP1, currentScore, { sector: targetSec, mult: targetMult }, actualResult);
            }

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

            const bust = newScore < 0 || newScore === 1 || (newScore === 0 && hitMult !== 2);
            if (bust) {
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
                else logThrow(bounced ? `${playerName}: ${getBounceOutText().log}` : `${playerName} ${t('t-log-throws')}: ${t('t-log-miss-0')}`, logType);

                if (currentScore <= 50 && targetMult === 2 && hitMult !== 2) adjustMomentum(isP1, -1);
            }

            if (isP1) currentMatch.p1Score = newScore; else currentMatch.p2Score = newScore;
            currentMatch.dartsThrown++; 

            const legCompleted = newScore === 0 && hitMult === 2;
            if (currentMatch.dartsThrown >= 3 || legCompleted) {
                resetMatchThrowGrouping(currentMatch);
                currentMatch.isTurnLocked = true;
                const visitButton = document.getElementById('t-btn-sim-visit');
                if (visitButton) visitButton.disabled = true;
            }

            if (currentMatch.dartsThrown >= 3 && currentTurnScore === 180) {
                if (isP1) {
                    st.p1OneEighties++;
                    if (!currentMatch.isSpectator && (!currentMatch.isDoubles || isCareerPlayerThrowing(true))) {
                        initCareerStats();
                        player.careerStats.total180s++; 
                    }
                } else { st.p2OneEighties++; }
                adjustMomentum(isP1, 3);
            }

            if (legCompleted) {
                if (isP1) {
                    st.p1HighCheckout = Math.max(st.p1HighCheckout || 0, currentTurnScore);
                    if (!currentMatch.isSpectator && (!currentMatch.isDoubles || isCareerPlayerThrowing(true))) {
                        initCareerStats();
                        if (currentTurnScore > (player.careerStats.highestCheckout || 0)) {
                            player.careerStats.highestCheckout = currentTurnScore;
                            addCareerChronicleEvent('checkout', { value: currentTurnScore });
                        }
                        if (currentTurnScore >= 100) {
                            player.careerStats.tonPlusCheckouts = (player.careerStats.tonPlusCheckouts || 0) + 1;
                        }
                    }
                } else {
                    st.p2HighCheckout = Math.max(st.p2HighCheckout || 0, currentTurnScore);
                }
                if (currentTurnScore >= 100) adjustMomentum(isP1, 2);
            }

            const matchThrowEvent = {
                side: isP1 ? 'p1' : 'p2', playerName,
                scoreBefore: currentScore, scoreAfter: newScore,
                target: { sector: targetSec, mult: targetMult },
                hit: { sector: hitSec, mult: hitMult },
                points: bounced ? 0 : points, bounced, bust,
                collision: result?.collision || null,
                boardPoint: result?.boardPoint || null,
                dartPose: result?.dartPose || null,
                dartNumber: currentMatch.dartsThrown,
                legDarts: isP1 ? st.p1LegDarts : st.p2LegDarts,
                visitScore: currentTurnScore,
                visitComplete: currentMatch.dartsThrown >= 3 || legCompleted,
                legCompleted
            };
            const throwingMatch = currentMatch;
            const revealThrowAtImpact = () => {
                if (currentMatch !== throwingMatch) return;
                throwingMatch.isDartInFlight = false;
                updateScores(); updateMatchStatsUI(); updateDartDots();
                if (throwingMatch.isTurnLocked) {
                    const throwButton = document.getElementById('throw-btn');
                    if (throwButton) throwButton.disabled = true;
                }
                if (typeof window !== 'undefined' && window.matchTVDirector) {
                    try {
                        window.matchTVDirector.onThrow(matchThrowEvent);
                    } catch (_error) { /* Television graphics cannot interrupt match scoring. */ }
                }
                if (typeof window !== 'undefined' && window.matchCrowd) {
                    try { window.matchCrowd.onThrow(matchThrowEvent); }
                    catch (_error) { /* Crowd audio cannot interrupt match scoring. */ }
                }
            };
            throwingMatch.isDartInFlight = true;
            const waitsForImpact = typeof window !== 'undefined'
                && window.matchBoard3D?.onNextImpact?.(revealThrowAtImpact);
            if (!waitsForImpact) revealThrowAtImpact();

            if (legCompleted) {
                logThrow(`🎯 ${playerName} ${t('t-log-wins-leg')}`, 'system');
                const completeLeg = () => handleCompletedLeg(isP1, playerName);
                const legDelay = typeof getMatchBoardAnimationDelay === 'function' ? getMatchBoardAnimationDelay(1000) : 1000;
                const spectatorLegDelay = typeof getMatchBoardAnimationDelay === 'function' ? getMatchBoardAnimationDelay(1300) : 1300;
                if (typeof scheduleSpectatorPlaybackAction === 'function') {
                    window.aiTimeout = scheduleSpectatorPlaybackAction(completeLeg, legDelay, spectatorLegDelay);
                } else window.aiTimeout = setTimeout(completeLeg, legDelay);
                return;
            }

            if (currentMatch.dartsThrown >= 3) {
                const turnDelay = typeof getMatchBoardAnimationDelay === 'function' ? getMatchBoardAnimationDelay(100) : 100;
                const spectatorTurnDelay = typeof getMatchBoardAnimationDelay === 'function' ? getMatchBoardAnimationDelay(300) : 300;
                if (typeof window !== 'undefined' && window.matchTVDirector?.deferMatchAction?.(endTurn)) {
                    window.aiTimeout = null;
                } else if (typeof scheduleSpectatorPlaybackAction === 'function') {
                    window.aiTimeout = scheduleSpectatorPlaybackAction(endTurn, turnDelay, spectatorTurnDelay);
                } else window.aiTimeout = setTimeout(endTurn, turnDelay);
            } else if (currentMatch.isSpectator || !isP1 || (currentMatch.isDoubles && !isCareerPlayerThrowing(isP1))) {
                clearTimeout(window.aiTimeout); // Czyścimy przed kolejnym rzutem
                const aiDelay = typeof getMatchTVAiThrowDelay === 'function' ? getMatchTVAiThrowDelay(650) : 650;
                if (typeof window !== 'undefined' && window.matchTVDirector?.deferMatchAction?.(aiTurn)) {
                    window.aiTimeout = null;
                } else if (typeof scheduleSpectatorPlaybackAction === 'function') {
                    window.aiTimeout = scheduleSpectatorPlaybackAction(aiTurn, aiDelay, 650);
                } else window.aiTimeout = setTimeout(aiTurn, aiDelay);
            }
        }

        function endTurn() {
            if (!currentMatch || currentMatch.isFinishing) return;
            resetMatchThrowGrouping(currentMatch);
            let wasP1 = currentMatch.turn === 'p1';
            
            if (currentMatch.dartsThrown === 3) {
                if (currentTurnScore >= 100) adjustMomentum(wasP1, 1);
                else if (currentTurnScore < 40) adjustMomentum(wasP1, -1);
            }

            const announcedScore = currentTurnScore;
            const finishTurn = () => {
                if (!currentMatch || currentMatch.isFinishing) return;
                currentMatch.dartsThrown = 0; currentMatch.isTurnLocked = false; currentMatch.isDartInFlight = false;
                currentTurnScore = 0; updateDartDots(); drawnDarts = [];
                if (typeof window !== 'undefined') window.matchBoard3D?.clear();
                const boardClearDelay = typeof getSpectatorPlaybackDelay === 'function'
                    ? getSpectatorPlaybackDelay(500, 500)
                    : 500;
                setTimeout(() => { drawDartboard(); }, boardClearDelay);
                if (currentMatch.p1Score === 0 || currentMatch.p2Score === 0) return;

                if (currentMatch.vsAI) {
                    if (currentMatch.isDoubles) {
                        const side = wasP1 ? 'p1' : 'p2';
                        currentMatch.doublesThrower[side] = currentMatch.doublesThrower[side] === 0 ? 1 : 0;
                    }
                    currentMatch.turn = currentMatch.turn === 'p1' ? 'p2' : 'p1';
                    if(currentMatch.turn === 'p1') {
                        currentMatch.p1TurnStartScore = currentMatch.p1Score;
                        if (currentMatch.p1Score <= 170) {
                            const requireDelay = typeof getSpectatorPlaybackDelay === 'function'
                                ? getSpectatorPlaybackDelay(1500, 1800)
                                : 1500;
                            setTimeout(() => announceRequire(currentMatch.p1Score), requireDelay);
                        }
                    } else { currentMatch.p2TurnStartScore = currentMatch.p2Score; }
                    if (currentMatch.isSpectator) {
                        clearTimeout(window.aiTimeout);
                        const continueMatch = () => {
                            if (currentMatch?.isSpectator) setTurnUI();
                        };
                        if (typeof scheduleSpectatorPlaybackAction === 'function') {
                            window.aiTimeout = scheduleSpectatorPlaybackAction(continueMatch, 0, 1800);
                        } else window.aiTimeout = setTimeout(continueMatch, 1800);
                    } else setTurnUI();
                } else {
                    currentMatch.p1TurnStartScore = currentMatch.p1Score;
                    if (currentMatch.p1Score <= 170) setTimeout(() => announceRequire(currentMatch.p1Score), 1500);
                    setTurnUI();
                }
            };

            let callerCompletion = null;
            if (currentMatch.p1Score > 0 && currentMatch.p2Score > 0) callerCompletion = announceAudio(announcedScore);
            let replayWaitsForCaller = false;
            if (typeof window !== 'undefined' && window.matchTVDirector?.onCaller) {
                try {
                    replayWaitsForCaller = window.matchTVDirector.onCaller(callerCompletion, {
                        side: wasP1 ? 'p1' : 'p2', visitScore: announcedScore
                    });
                } catch (_error) { /* Synchronizacja callera nie może przerwać meczu. */ }
            }
            if (replayWaitsForCaller && window.matchTVDirector?.deferMatchAction?.(finishTurn)) {
                window.aiTimeout = null;
                return;
            }
            finishTurn();
        }

        
