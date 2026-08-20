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
                matchFormat: matchFormat, turn: starter, startingPlayer: starter, dartsThrown: 0, p1TurnStartScore: 501, p2TurnStartScore: 501, isTournament: false,
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
            document.getElementById('stat-p1-title').innerHTML = `${getFlagImg(player.country)} ${escapeHtml(player.name)}`;
            
            if (currentMatch.opponent) {
                document.getElementById('stat-p2-title').innerHTML = `${getFlagImg(currentMatch.opponent.country)} ${escapeHtml(currentMatch.opponent.name)}`;
            }
            
            document.getElementById('in-game-stats').style.display = 'grid';
        }

        function setTurnUI() {
            clearTimeout(window.aiTimeout); // Usuwamy stare opóźnienia
            
            if (currentMatch.turn === 'p1') {
                document.getElementById('score-col-player').classList.add('active-turn'); document.getElementById('score-col-ai').classList.remove('active-turn');
                document.getElementById('player-controls').style.opacity = "1"; document.getElementById('throw-btn').disabled = false;
            } else {
                document.getElementById('score-col-player').classList.remove('active-turn'); document.getElementById('score-col-ai').classList.add('active-turn');
                document.getElementById('player-controls').style.opacity = "0.5"; document.getElementById('throw-btn').disabled = true;
                window.aiTimeout = setTimeout(aiTurn, 1000);
            }
        }

        function handleBust(isP1) {
            logThrow(`${isP1 ? t('t-you') : currentMatch.opponent.name}: ${t('t-log-bust')}`, isP1 ? 'miss' : 'ai');
            if(isP1) currentMatch.p1Score = currentMatch.p1TurnStartScore; else currentMatch.p2Score = currentMatch.p2TurnStartScore;
            currentTurnScore = 0; updateScores(); updateMatchStatsUI(); endTurn();
        }

        function finishMatch() {
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
            if (currentMatch.stats.p1TotalDarts > 0) {
                let finalMatchAvg = (finalP1TotalPts / currentMatch.stats.p1TotalDarts) * 3;
                if (finalMatchAvg > (player.careerStats.highestAvg || 0)) {
                    player.careerStats.highestAvg = finalMatchAvg;
                    addCareerChronicleEvent('average', { value: Number(finalMatchAvg.toFixed(2)) });
                }
            }
            const finalHighCheckout = currentMatch.stats.p1HighCheckout || 0;
            if (finalHighCheckout > (player.careerStats.highestCheckout || 0)) {
                player.careerStats.highestCheckout = finalHighCheckout;
                addCareerChronicleEvent('checkout', { value: finalHighCheckout });
            }

            if (typeof player.stamina !== 'undefined') {
                // NOWY BALANS: 2% za mecz turniejowy, 1% za sparing
                let drain = currentMatch.isTournament ? 2 : 1; 
                // Math.max gwarantuje, że energia nigdy nie spadnie poniżej 0!
                player.stamina = Math.max(0, player.stamina - drain); 
            }
            
            checkAchievements('stats'); // <--- DODANE TUTAJ (skanuje po każdym meczu)

            // Przechodzimy do rozstrzygnięcia
            if (currentMatch.isTournament && activeTournament) {
                advanceTournament(isP1Winner);

                if (tournamentBracket.length === 1) {
                    activeTournament.completed = true;
                    activeTournament.historyLogs = lastTournamentResults; 
                    
                    let winner = tournamentBracket[0];
                    let winPrize = getPrizeMoney(activeTournament.name, 2, true);
                    awardPrizeMoney(winner, winPrize, activeTournament.name); 

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
                        checkAchievements('tour_win', activeTournament.name); // <--- DODANE TUTAJ
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

                } else if (!isP1Winner) {
                    let myPrize = getPrizeMoney(activeTournament.name, tournamentRound * 2, false);
                    alert(t('t-alert-knockout').replace('{tour}', activeTournament.name).replace('{prize}', myPrize.toLocaleString('en-GB')));
                    sendTournamentSummaryEmail(activeTournament.name, myPrize, false);
                    
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
                if (ach.type === 'specific_tour' && type === 'tour_win' && data && data.includes(ach.tourMatch)) unlock = true;
                
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
                    
                    alert(`🏆 ODBLOKOWANO OSIĄGNIĘCIE!\n\n${title}\nOtrzymujesz bonus: £${ach.rewardMoney.toLocaleString('en-GB')}`);
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

            const winnerName = isP1 ? player.name : currentMatch.opponent.name;
            logThrow(`⚡ ${winnerName} ${t('t-log-sd-win')}`, isP1 ? 'hit' : 'ai');
            currentMatch.suddenDeath = null;
            if (isP1) checkAchievements('sudden_death'); // <--- DODANE TUTAJ
            finishMatch(isP1, winnerName);
        }

        function processSuddenDeathThrow(isP1, targetSec, targetMult, hitSec, hitMult) {
            const suddenDeath = currentMatch.suddenDeath;
            const points = hitSec * hitMult;
            const playerName = isP1 ? player.name : currentMatch.opponent.name;
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
                window.aiTimeout = setTimeout(aiTurn, 1000);
            }
        }

       function handleCompletedLeg(isP1, playerName) {
            const st = currentMatch.stats;
            // --- SPRAWDZANIE 9-DARTERA ---
            if (isP1 && st.p1LegDarts === 9) {
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

            // 3. Sprawdzanie wygranej w formacie setowym (np. Mistrzostwa Świata)
            if (isSetMatch && (currentMatch.p1Legs >= currentMatch.matchFormat.legsPerSet || currentMatch.p2Legs >= currentMatch.matchFormat.legsPerSet)) {
                setWasWon = true;
                if (isP1) currentMatch.p1Sets++;
                else currentMatch.p2Sets++;
                logThrow(`🏆 ${isP1 ? player.name : currentMatch.opponent.name} ${t('t-log-wins-set')}`, isP1 ? 'hit' : 'ai');
            }

            // 4. Sprawdzanie nagłej śmierci (Sudden Death) np. w World Matchplay
            if (currentMatch.matchFormat && currentMatch.matchFormat.suddenDeathAt &&
                currentMatch.p1Legs === currentMatch.matchFormat.suddenDeathAt &&
                currentMatch.p2Legs === currentMatch.matchFormat.suddenDeathAt) {
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
            let playerName = isP1 ? player.name : currentMatch.opponent.name; 
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
                    initCareerStats();
                    player.careerStats.total180s++; 
                } else { st.p2OneEighties++; }
                adjustMomentum(isP1, 3);
            }

            updateScores(); updateMatchStatsUI(); updateDartDots();

            if (newScore === 0 && hitMult === 2) {
                if (isP1) {
                    st.p1HighCheckout = Math.max(st.p1HighCheckout || 0, currentTurnScore);
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
                else st.p2HighCheckout = Math.max(st.p2HighCheckout || 0, currentTurnScore);
                
                if (currentTurnScore >= 100) adjustMomentum(isP1, 2);
                updateMatchStatsUI(); 

                logThrow(`🎯 ${playerName} ${t('t-log-wins-leg')}`, 'system');
                setTimeout(() => handleCompletedLeg(isP1, playerName), 1000);
                return;
            }

            if (currentMatch.dartsThrown >= 3) {
                setTimeout(() => endTurn(), 100);
            } else if (!isP1) {
                clearTimeout(window.aiTimeout); // Czyścimy przed kolejnym rzutem
                window.aiTimeout = setTimeout(() => aiTurn(), 400); 
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

        function announceAudio(event, playerName = "") {
            let soundKey = "";
            if (event === 180) soundKey = "180";
            else if (event === 'win_match') soundKey = "game_shot_match";
            else if (event === 'win_leg') soundKey = "game_shot";
            else soundKey = event.toString();

            // Ubezpieczenie - wymuszamy małe litery
            soundKey = soundKey.toLowerCase();

            // 1. Priorytet: Dźwięk z wgranego moda (.ZIP)
            if (moddedAssets.sounds[soundKey]) {
                let realAudio = new Audio(moddedAssets.sounds[soundKey]);
                realAudio.volume = 1.0 * globalVolume; 
                realAudio.play().catch(e => {
                    console.error("Błąd odtwarzania pliku z moda:", e);
                    playRobotCaller(event, playerName); 
                });
            } 
            // 2. Opcja awaryjna: Dźwięk z dysku lub głos robota
            else {
                let fallbackAudio = new Audio(`sounds/${soundKey}.wav`);
                fallbackAudio.volume = 1.0 * globalVolume;
                fallbackAudio.play().catch(e => {
                    playRobotCaller(event, playerName); 
                });
            }
        }

        // Awaryjny robot (stara funkcja)
        function playRobotCaller(event, playerName) {
            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel(); 
            let utterance = new SpeechSynthesisUtterance();
            utterance.lang = 'en-GB'; 
            utterance.volume = 1.0 * globalVolume; // Robot też słucha suwaka!
            
            if (event === 180) {
                utterance.text = "ONE HUNDRED AND EIGHTY!!!";
                utterance.pitch = 1.6; utterance.rate = 1.1;
            } else if (event === 'win_match') {
                utterance.text = `Game shot, and the match! ${playerName}`;
                utterance.pitch = 1.1; utterance.rate = 0.9;
            } else if (event === 'win_leg') {
                utterance.text = `Game shot!`;
                utterance.pitch = 1.1; utterance.rate = 0.9;
            } else {
                utterance.text = event === 0 ? "No score" : event.toString();
                utterance.pitch = 1.0; utterance.rate = 0.9;
            }
            window.speechSynthesis.speak(utterance);
        }

        function announceRequire(score) {
            let reqSrc = moddedAssets.sounds["require"] || 'sounds/require.wav';
            let requireAudio = new Audio(reqSrc);
            requireAudio.volume = 1.0 * globalVolume;
            
            let scoreSrc = moddedAssets.sounds[score] || `sounds/${score}.wav`;
            let scoreAudio = new Audio(scoreSrc);
            scoreAudio.volume = 1.0 * globalVolume;

            requireAudio.play().then(() => {
                requireAudio.onended = () => {
                    scoreAudio.play().catch(e => {
                        fallbackRequireSynth(score, false);
                    });
                };
            }).catch(e => {
                fallbackRequireSynth(score, true);
            });
        }

        function fallbackRequireSynth(score, fullPhrase) {
            if (!window.speechSynthesis) return;
            let utteranceText = fullPhrase ? `You require ${score}` : `${score}`;
            let utterance = new SpeechSynthesisUtterance(utteranceText);
            utterance.lang = 'en-GB';
            utterance.pitch = 1.0; 
            utterance.rate = 0.9;
            utterance.volume = 1.0 * globalVolume;
            window.speechSynthesis.speak(utterance);
        }

       function playerThrow() {
            let tSec = parseInt(document.getElementById('aim-sector').value); 
            let tMult = parseInt(document.getElementById('aim-multiplier').value);
            if (tSec === 50) { tSec = 25; tMult = 2; } else if (tSec === 25) { tMult = 1; }

            let boostedPlayer = { ...player };
            let bStats = typeof getBoostedPlayerStats === 'function' ? getBoostedPlayerStats() : null;
            if(bStats) { boostedPlayer.scoring = bStats.scoring; boostedPlayer.doubles = bStats.doubles; }
            boostedPlayer = applyRivalryMatchModifier(boostedPlayer, true);

            if (currentMatch && currentMatch.p1Momentum !== undefined) {
                boostedPlayer.scoring += (currentMatch.p1Momentum * 2.5); 
                boostedPlayer.doubles += (currentMatch.p1Momentum * 2.5);
            }

            let result = calculateThrow(tSec, tMult, boostedPlayer); 
            processThrow(true, tSec, tMult, result.sector, result.mult);
        }

        function aiTurn() {
            // ZABEZPIECZENIE: Upewniamy się, że to faktycznie tura AI i ma mniej niż 3 rzucone lotki
            if(!currentMatch || currentMatch.turn !== 'p2' || currentMatch.dartsThrown >= 3) return;
            
            let score = currentMatch.p2Score; 
            let isDIDO = activeTournament && activeTournament.format === 'DIDO';
            let dartsLeft = 3 - currentMatch.dartsThrown;
            
            // AI używa teraz jednej, wspólnej logiki ze wszystkimi wyjątkami!
            let aim = getOptimalAim(score, isDIDO, dartsLeft);
            
            let aiStats = { ...currentMatch.opponent };
            if (currentMatch && currentMatch.p2Momentum !== undefined) {
            // ... reszta funkcji pozostaje bez zmian ...
                aiStats.scoring += (currentMatch.p2Momentum * 2.5);
                aiStats.doubles += (currentMatch.p2Momentum * 2.5);
            }

            let result = calculateThrow(aim.sector, aim.mult, aiStats); 
            processThrow(false, aim.sector, aim.mult, result.sector, result.mult);
        }

        function getAdjacentSector(sector) {
            if (sector === 25) return dartboardOrder[Math.floor(Math.random()*20)];
            let idx = dartboardOrder.indexOf(sector);
            idx += (Math.random() < 0.5 ? -1 : 1);
            if (idx < 0) idx = 19; if (idx > 19) idx = 0;
            return dartboardOrder[idx];
        }

        function calculateThrow(targetSector, targetMult, stats) {
            // Dedykowana logika dla środka tarczy (Outer / Inner Bull)
            if (targetSector === 25) {
                let stat = targetMult === 2 ? stats.doubles : stats.scoring;
                stat = clamp(stat - 10, 20, 95);
                let roll = Math.random() * 100;

                if (targetMult === 2) {
                    // Celowanie w 50 (Inner Bull)
                    let bullHitChance = clamp(stat * 0.35, 10, 45);
                    let outerHitChance = bullHitChance + 35; // Pudło ląduje w Outer Bull (25)

                    if (roll <= bullHitChance) {
                        return { sector: 25, mult: 2 }; // Trafienie 50 (D-Bull)
                    } else if (roll <= outerHitChance) {
                        return { sector: 25, mult: 1 }; // Trafienie 25 (Outer Bull)
                    } else {
                        // Duże pudło ląduje w pojedynczym sąsiadującym sektorze
                        return { sector: dartboardOrder[Math.floor(Math.random() * 20)], mult: 1 };
                    }
                } else {
                    // Celowanie w 25 (Outer Bull)
                    let outerHitChance = clamp(stat * 0.55, 20, 65);
                    if (roll <= outerHitChance) {
                        return { sector: 25, mult: 1 };
                    } else if (roll <= outerHitChance + 10) {
                        return { sector: 25, mult: 2 }; // Przypadkowe trafienie w 50
                    } else {
                        return { sector: dartboardOrder[Math.floor(Math.random() * 20)], mult: 1 };
                    }
                }
            }

            // Standardowe sektory 1-20
            let stat = targetMult === 2 ? stats.doubles : stats.scoring;
            stat = clamp(stat, 25, 100);
            let hitMult = targetMult, hitSector = targetSector, roll = Math.random() * 100;
            const isFavoriteDouble = targetMult === 2 && stats.favoriteDouble === targetSector;

            if (targetMult === 3) {
                const tripleHitChance = clamp(stat * 0.42, 12, 48);
                const targetSingleChance = Math.min(98, tripleHitChance + 65); 
                
                if (roll <= tripleHitChance) { 
                    hitMult = 3; 
                } else if (roll <= targetSingleChance) { 
                    hitMult = 1; 
                } else { 
                    hitSector = getAdjacentSector(targetSector); 
                    hitMult = Math.random() < 0.10 ? 3 : 1; 
                }
            } else if (targetMult === 2) {
                const doubleHitChance = clamp(stat * 0.45 + (isFavoriteDouble ? 5 : 0), 12, 52);
                
                // ZMNIEJSZONO z 55 na 25. Teraz lotka wpada w singla tylko w ok. 25% przypadków pudeł.
                const targetSingleChance = Math.min(90, doubleHitChance + 25);
                
                if (roll <= doubleHitChance) {
                    hitMult = 2;
                } else if (roll <= targetSingleChance) {
                    hitMult = 1; // Wpadło tuż pod drutem w dużego singla
                } else { 
                    // Zwiększona szansa na rzut poza tarczę przy pudle
                if (Math.random() < 0.90) {
                    hitSector = 0; hitMult = 0; // Teraz aż 90% pudeł ląduje CAŁKOWICIE poza tarczą (Fura na 0)
                } else { 
                    hitSector = getAdjacentSector(targetSector); 
                    hitMult = Math.random() < 0.30 ? 2 : 1;
                }
                }
            } else {
                if (roll <= Math.min(99, stat + 22)) { hitMult = 1; }
                else { hitSector = getAdjacentSector(targetSector); hitMult = 1; }
            }
            return { sector: hitSector, mult: hitMult };
        }

        function getPrefix(m) { return m === 1 ? "" : (m === 2 ? "D" : "T"); }
        function logThrow(text, type) {
            const logBox = document.getElementById('match-log');
            logBox.innerHTML = `<div class="log-entry ${type}">${escapeHtml(text)}</div>` + logBox.innerHTML;
        }

        function drawDartboard() {
            const canvas = document.getElementById('dartboard'); const ctx = canvas.getContext('2d');
            const cx = canvas.width / 2, cy = canvas.height / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath(); ctx.arc(cx, cy, canvas.width/2, 0, 2*Math.PI); 
            let grad = ctx.createRadialGradient(cx, cy, 140, cx, cy, 170);
            grad.addColorStop(0, '#1a1a1a'); grad.addColorStop(1, '#0a0a0a');
            ctx.fillStyle = grad; ctx.fill();

            ctx.font = "bold 20px 'Trebuchet MS', Arial, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";

            const cBlack = '#1a1a1a'; const cWhite = '#f0e5d3'; const cRed = '#c21e24'; const cGreen = '#008a3d';

            for(let i = 0; i < 20; i++) {
                let startAngle = -Math.PI/2 - Math.PI/20 + (i * (Math.PI/10));
                let endAngle = startAngle + (Math.PI/10);
                let midAngle = startAngle + (Math.PI/20);
                let isBlack = i % 2 === 0;

                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 130, startAngle, endAngle);
                ctx.fillStyle = isBlack ? cBlack : cWhite; ctx.fill();

                ctx.beginPath(); ctx.arc(cx, cy, 130, startAngle, endAngle); ctx.arc(cx, cy, 120, endAngle, startAngle, true); ctx.closePath();
                ctx.fillStyle = isBlack ? cRed : cGreen; ctx.fill();

                ctx.beginPath(); ctx.arc(cx, cy, 80, startAngle, endAngle); ctx.arc(cx, cy, 70, endAngle, startAngle, true); ctx.closePath();
                ctx.fillStyle = isBlack ? cRed : cGreen; ctx.fill();

                ctx.fillStyle = '#fff'; 
                ctx.fillText(dartboardOrder[i], cx + 148 * Math.cos(midAngle), cy + 148 * Math.sin(midAngle));
            }

            ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 2*Math.PI); ctx.fillStyle = cGreen; ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, 6.5, 0, 2*Math.PI); ctx.fillStyle = cRed; ctx.fill();

            ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(210, 210, 210, 0.6)'; 
            for(let i = 0; i < 20; i++) {
                let angle = -Math.PI/2 - Math.PI/20 + (i * (Math.PI/10));
                ctx.beginPath(); ctx.moveTo(cx + 16 * Math.cos(angle), cy + 16 * Math.sin(angle));
                ctx.lineTo(cx + 130 * Math.cos(angle), cy + 130 * Math.sin(angle)); ctx.stroke();
            }
            ctx.beginPath(); ctx.arc(cx, cy, 130, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 120, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 80, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 70, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 6.5, 0, 2*Math.PI); ctx.stroke();
            
            ctx.lineWidth = 2; ctx.strokeStyle = '#888';
            ctx.beginPath(); ctx.arc(cx, cy, 163, 0, 2*Math.PI); ctx.stroke();

            drawnDarts.forEach(d => { 
                ctx.beginPath(); 
                ctx.arc(d.x, d.y, 5, 0, 2*Math.PI); 
                ctx.fillStyle = d.color; 
                ctx.fill(); 
                ctx.lineWidth = 1.5; 
                ctx.strokeStyle = '#000'; 
                ctx.stroke();

                ctx.beginPath(); 
                ctx.arc(d.x, d.y, 1.5, 0, 2*Math.PI); 
                ctx.fillStyle = '#fff'; 
                ctx.fill(); 
            });
        }

        function addDartToCanvas(hitSec, hitMult, color, targetSec, targetMult) {
            const canvas = document.getElementById('dartboard'); const cx = canvas.width / 2, cy = canvas.height / 2; let angle, radius;
            
            let displaySec = hitSec === 0 ? targetSec : hitSec; 
            
            if (displaySec === 25) { 
                angle = Math.random() * 2 * Math.PI; 
                if (hitMult === 2) radius = Math.random() * 6;
                else if (hitMult === 1) radius = 6 + Math.random() * 9;
                else radius = 133 + Math.random() * 20; 
            }
            else {
                let baseAngle = -Math.PI/2 + (dartboardOrder.indexOf(displaySec) * (Math.PI/10)); 
                angle = baseAngle + (Math.random() * 0.8 - 0.4) * (Math.PI/10); 
                
                if (hitMult === 3) radius = 71 + Math.random() * 8; 
                else if (hitMult === 2) radius = 121 + Math.random() * 7; 
                else if (hitMult === 0) radius = 133 + Math.random() * 9;
                // --- NOWOŚĆ: Rzut w bulla, który wylądował w innym sektorze (singlu) ---
                else if (targetSec === 25) radius = 18 + Math.random() * 25; 
                else if (targetMult === 3) radius = Math.random() < 0.55 ? 59 + Math.random() * 9 : 81 + Math.random() * 11;
                else if (targetMult === 2) radius = 106 + Math.random() * 12;
                else radius = 92 + Math.random() * 24;
            }
            drawnDarts.push({x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), color}); drawDartboard();
        }

        