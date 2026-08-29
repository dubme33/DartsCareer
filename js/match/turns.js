function playerThrow() {
            // Kliknięcia mogą już czekać w kolejce zdarzeń, gdy trzecia lotka
            // kończy podejście. Nie pozwalamy im wejść do logiki punktacji.
            if (!currentMatch || currentMatch.isFinishing || currentMatch.isSpectator || currentMatch.turn !== 'p1' || currentMatch.dartsThrown >= 3 || currentMatch.isTurnLocked) return;
            if (currentMatch.isDoubles && !isCareerPlayerThrowing(true)) return;

            let tSec = parseInt(document.getElementById('aim-sector').value); 
            let tMult = parseInt(document.getElementById('aim-multiplier').value);
            if (tSec === 50) { tSec = 25; tMult = 2; } else if (tSec === 25) { tMult = 1; }

            let boostedPlayer = { ...player };
            let bStats = typeof getBoostedPlayerStats === 'function' ? getBoostedPlayerStats() : null;
            if(bStats) { boostedPlayer.scoring = bStats.scoring; boostedPlayer.doubles = bStats.doubles; }
            if (currentMatch.isTournament && !currentMatch.isDoubles && typeof getWorldMastersMatchRatings === 'function') {
                boostedPlayer = getWorldMastersMatchRatings(player, boostedPlayer);
            }
            boostedPlayer = applyRivalryMatchModifier(boostedPlayer, true);

            if (currentMatch && currentMatch.p1Momentum !== undefined) {
                boostedPlayer.scoring = Math.min(100, boostedPlayer.scoring + (currentMatch.p1Momentum * 2.5));
                boostedPlayer.doubles = Math.min(100, boostedPlayer.doubles + (currentMatch.p1Momentum * 2.5));
            }

            if (typeof applyPlayerTraitsToMatchStats === 'function') boostedPlayer = applyPlayerTraitsToMatchStats(player, boostedPlayer, true);
            const mentalAim = { sector: tSec, mult: tMult };
            if (typeof applyMentalPressureToStats === 'function') boostedPlayer = applyMentalPressureToStats(player, boostedPlayer, true, mentalAim, currentMatch.p1Score);
            let result = calculateThrow(tSec, tMult, boostedPlayer);
            if (typeof recordMentalThrowOutcome === 'function') recordMentalThrowOutcome(true, currentMatch.p1Score, mentalAim, result);
            processThrow(true, tSec, tMult, result.sector, result.mult);
        }

        function aiTurn() {
            if (!currentMatch || currentMatch.isFinishing || currentMatch.dartsThrown >= 3) return;
            if (currentMatch.isSpectator && currentMatch.spectatorPaused) return;
            const isP1 = currentMatch.turn === 'p1';
            if (!isP1 && currentMatch.turn !== 'p2') return;
            if (!currentMatch.isDoubles && isP1 && !currentMatch.isSpectator) return;
            if (currentMatch.isDoubles && isP1 && isCareerPlayerThrowing(true)) return;
            
            let score = isP1 ? currentMatch.p1Score : currentMatch.p2Score;
            let isDIDO = activeTournament && activeTournament.format === 'DIDO';
            let dartsLeft = 3 - currentMatch.dartsThrown;
            
            // AI używa teraz jednej, wspólnej logiki ze wszystkimi wyjątkami!
            let aim = getOptimalAim(score, isDIDO, dartsLeft);
            
            const aiPlayer = currentMatch.isDoubles
                ? getDoublesCurrentThrower(isP1)
                : (currentMatch.isSpectator && isP1 ? currentMatch.spectatorP1 : currentMatch.opponent);
            let aiStats = { ...aiPlayer };
            if (currentMatch.isTournament && !currentMatch.isDoubles && typeof getWorldMastersMatchRatings === 'function') {
                aiStats = getWorldMastersMatchRatings(aiPlayer, aiStats);
            }
            const tournamentForm = currentMatch.isSpectator && typeof getTournamentSimulationForm === 'function'
                ? getTournamentSimulationForm(aiPlayer)
                : 0;
            aiStats.scoring = (Number(aiStats.scoring) || 0) + tournamentForm;
            aiStats.doubles = (Number(aiStats.doubles) || 0) + tournamentForm;
            const peakPerformance = currentMatch.isSpectator
                ? (isP1 ? currentMatch.p1PeakPerformance : currentMatch.p2PeakPerformance)
                : currentMatch.opponentPeakPerformance;
            const peakAccuracyBoost = !currentMatch.isDoubles
                ? (peakPerformance?.accuracyBoost || 0)
                : 0;
            aiStats.peakMatchAccuracyBoost = peakAccuracyBoost;
            const momentum = isP1 ? currentMatch.p1Momentum : currentMatch.p2Momentum;
            if (currentMatch && momentum !== undefined) {
                aiStats.scoring = Math.min(100, aiStats.scoring + (momentum * 2.5));
                aiStats.doubles = Math.min(100, aiStats.doubles + (momentum * 2.5));
            }

            if (typeof applyPlayerTraitsToMatchStats === 'function') aiStats = applyPlayerTraitsToMatchStats(aiPlayer, aiStats, isP1);
            if (typeof applyMentalPressureToStats === 'function') aiStats = applyMentalPressureToStats(aiPlayer, aiStats, isP1, aim, score);
            let result = calculateThrow(aim.sector, aim.mult, aiStats);
            if (typeof recordMentalThrowOutcome === 'function') recordMentalThrowOutcome(isP1, score, aim, result);
            processThrow(isP1, aim.sector, aim.mult, result.sector, result.mult);
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
            stat = clamp(stat + (Number(stats.peakMatchAccuracyBoost) || 0), 25, 110);
            let hitMult = targetMult, hitSector = targetSector, roll = Math.random() * 100;
            const isFavoriteDouble = targetMult === 2 && stats.favoriteDouble === targetSector;

            if (targetMult === 3) {
                const tripleHitChance = clamp(stat * 0.42, 12, 54);
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
                const doubleHitChance = clamp(stat * 0.45 + (isFavoriteDouble ? 5 : 0), 12, 57);
                
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

        
