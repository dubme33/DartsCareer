function skipActiveTournament() {
            if (!confirm(t('t-confirm-skip'))) return;
            isSkippingTournament = true;
            startTournament(); 
        }

        function startTournament() {
            if (!activeTournament) return;
            if (currentMatch && currentMatch.isTournament && currentMatch.p1Score !== undefined) {
                showScreen('screen-match'); return;
            }
            if (typeof isWorldCupTournament === 'function' && isWorldCupTournament(activeTournament)) {
                startWorldCupTournament();
                return;
            }
            if (typeof isWorldCupQualifierTournament === 'function' && isWorldCupQualifierTournament(activeTournament)) {
                startWorldCupQualifiers();
                return;
            }
            // --- ZABEZPIECZENIE: Jeśli turniej już trwa (drabinka jest wygenerowana), to tylko ją pokazujemy i kontynuujemy grę! ---
            if (tournamentBracket && tournamentBracket.length > 1) {
                showBracket();
                return;
            }

            let tName = activeTournament.name;
            let tNameLow = tName.toLowerCase();
            let tournamentDisplayName = typeof getTournamentDisplayName === 'function'
                ? getTournamentDisplayName(activeTournament)
                : tName;
            // Zawodnicy dodani wyłącznie do reprezentacji Pucharu Narodów nie mają
            // kart PDC, dlatego nie trafiają do indywidualnych turniejów rankingowych.
            let allPlayers = [...pdcPlayers.filter(candidate => candidate.hasTourCard !== false), player];
            let oomRanked = [...allPlayers].sort((a,b) => b.prizeMoney - a.prizeMoney);
            let ptRanked = [...allPlayers].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
            let pcRanked = [...allPlayers].sort((a,b) => b.pcPrizeMoney - a.pcPrizeMoney);
            const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(activeTournament);
            const isContinentalMainEvent = typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(activeTournament);
            const isWorldMastersEvent = typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(activeTournament);
            const isWorldMastersFinals = typeof isWorldMastersFinalsTournament === 'function' && isWorldMastersFinalsTournament(activeTournament);
            const isWorldMastersFinalsQualifier = typeof isWorldMastersFinalsQualifierTournament === 'function' && isWorldMastersFinalsQualifierTournament(activeTournament);

            let participants = [];

            // --- 1. WYBÓR UCZESTNIKÓW I ROZMIAR DRABINKI ---
            
            // Finały Play-offs
            if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && tNameLow.includes("play-off")) {
                if (!gdlTable || gdlTable.length === 0) {
                    oomRanked.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                }
                let sortedGDL = [...gdlTable].sort((a,b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost));
                participants = [sortedGDL[0].player, sortedGDL[3].player, sortedGDL[1].player, sortedGDL[2].player];
                tournamentRound = 4;

            // Zwykła noc ligowa (Night 1-16)
            } else if (tNameLow.includes("premier") || tNameLow.includes("global darts league")) {
                // Zabezpieczenie: jeśli tabela jest pusta, twórz stawkę natychmiast
                if (!gdlTable || gdlTable.length === 0) {
                    gdlTable = [];
                    oomRanked.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                    let candidates = shuffle(oomRanked.slice(4, 12));
                    candidates.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                }
                participants = gdlTable.map(g => g.player);
                tournamentRound = 8;

            } else if ((tNameLow.includes("players championship") || tNameLow.includes("pro players cup")) && !tNameLow.includes("final")) {
                participants = oomRanked.slice(0, 128); tournamentRound = 128;
            } else if (isWorldMastersEvent || isWorldMastersFinals || isWorldMastersFinalsQualifier) {
                participants = typeof getWorldMastersTournamentParticipants === 'function'
                    ? getWorldMastersTournamentParticipants(activeTournament)
                    : [];
                tournamentRound = typeof getWorldMastersTournamentRound === 'function'
                    ? getWorldMastersTournamentRound(activeTournament)
                    : (isWorldMastersFinals ? 32 : 16);
            } else if (tNameLow.includes("players championship finals") || tNameLow.includes("pro players finals")) {
                participants = pcRanked.slice(0, 64); tournamentRound = 64;
            } else if (tNameLow.includes("world darts championship") || tNameLow.includes("global darts championship")) {
                let qualified = new Set();
                oomRanked.slice(0, 32).forEach(p => qualified.add(p)); 
                let ptIndex = 0;
                while(qualified.size < 64 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; } 
                let oomIndex = 0;
                while(qualified.size < 96 && oomIndex < oomRanked.length) { qualified.add(oomRanked[oomIndex]); oomIndex++; } 
                participants = Array.from(qualified); tournamentRound = 128;
            } else if (tNameLow.includes("uk open") || tNameLow.includes("british open")) {
                let qualified = new Set();
                oomRanked.slice(0, 128).forEach(p => qualified.add(p)); 
                participants = Array.from(qualified); tournamentRound = 128;
            } else if (isContinentalQualifier) {
                participants = getContinentalTourQualifierParticipants(activeTournament);
                tournamentRound = 128;
            } else if (isContinentalMainEvent) {
                const continentalField = getContinentalTourMainField(activeTournament);
                participants = continentalField
                    ? [...continentalField.oomPlayers, ...continentalField.proTourPlayers, ...continentalField.qualifiedPlayers]
                    : [];
                tournamentRound = 64;
            } else if (tNameLow.includes("grand slam") || tNameLow.includes("champion's slam")) {
                let qualified = new Set();
                oomRanked.slice(0, 16).forEach(p => qualified.add(p)); 
                let ptIndex = 0;
                while(qualified.size < 48 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; }
                participants = Array.from(qualified); 
                tournamentRound = 32; 
            } else if (tNameLow.includes("matchplay") || tNameLow.includes("grand prix")) {
                let seeds = oomRanked.slice(0, 16);
                let unseeded = [];
                let ptIndex = 0;
                while (unseeded.length < 16 && ptIndex < ptRanked.length) {
                    if (!seeds.includes(ptRanked[ptIndex])) unseeded.push(ptRanked[ptIndex]);
                    ptIndex++;
                }
                participants = [...seeds, ...unseeded]; 
                tournamentRound = 32;
            } else if (tNameLow.includes("european championship") || tNameLow.includes("continental championship")) {
                let qualified = new Set();
                let ptIndex = 0;
                while(qualified.size < 32 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; }
                participants = Array.from(qualified); 
                tournamentRound = 32;
            } else {
                let qualified = new Set();
                oomRanked.slice(0, 16).forEach(p => qualified.add(p)); 
                let ptIndex = 0;
                while(qualified.size < 32 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; } 
                participants = Array.from(qualified); tournamentRound = 32;
            }

            let playerInTournament = participants.some(isCurrentPlayer);
            
            if (isSkippingTournament && playerInTournament) {
                let replacement = ptRanked.find(p => !participants.includes(p) && !isCurrentPlayer(p));
                if (!replacement) replacement = pdcPlayers[0];
                participants = participants.map(p => isCurrentPlayer(p) ? replacement : p);
                playerInTournament = false;
            }

            let isHeadlessSim = false;

            if (isSkippingTournament) {
                // Jeśli gracz celowo nacisnął "Odpuść", symulujemy cały turniej w tle
                alert(t('t-alert-skip-tour').replace('{tour}', tournamentDisplayName));
                isHeadlessSim = true;
            } else if (isContinentalQualifier && !playerInTournament) {
                // Gracze z Top 16 OOM / Top 16 ProTour są już w turnieju głównym.
                // Ich kwalifikacje rozstrzygamy w tle, bez blokowania kalendarza.
                isHeadlessSim = true;
            } else if (!playerInTournament) {
                // Jeśli gracz się nie zakwalifikował, tylko o tym informujemy, 
                // ale NIE włączamy symulacji w tle, by pokazać mu drabinkę!
                alert(t('t-alert-no-qual').replace('{tour}', tournamentDisplayName));
            }

            isSkippingTournament = false;

            lastTournamentResults = ""; 
            tournamentMatchHistory = [];
            preTournamentRanks = { main: getPlayerRank('main'), pt: getPlayerRank('protour'), pc: getPlayerRank('pc') };
            prepareTournamentSimulationForm(participants);

            // --- 2. LOSOWANIE / ROZSTAWIENIE ---
            if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && !tNameLow.includes("play-off")) {
                participants = shuffle(participants);
            } else if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && tNameLow.includes("play-off")) {
                // Drabinka play-off już ustalona (1 vs 4, 2 vs 3)
            } else if (tNameLow.includes("uk open") || tNameLow.includes("british open")) {
                participants = shuffle(participants); 
            } else if ((tNameLow.includes("players championship") || tNameLow.includes("pro players cup")) && !tNameLow.includes("final")) {
                let sortedByPT = [...participants].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
                let seeds = sortedByPT.slice(0, 32); 
                let unseeded = shuffle(sortedByPT.slice(32)); 
                let draw = new Array(128);
                const seedOrder = [1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21, 2, 31, 15, 18, 7, 26, 10, 23, 3, 30, 14, 19, 6, 27, 11, 22];

                let unIndex = 0;
                for (let i = 0; i < 32; i++) {
                    let boardStart = i * 4; 
                    draw[boardStart] = seeds[seedOrder[i] - 1]; 
                    draw[boardStart + 1] = unseeded[unIndex++]; 
                    draw[boardStart + 2] = unseeded[unIndex++]; 
                    draw[boardStart + 3] = unseeded[unIndex++]; 
                }
                participants = draw;
                
            } else if (tNameLow.includes("players championship finals") || tNameLow.includes("pro players finals")) {
                let seeds = [...participants].sort((a,b) => b.pcPrizeMoney - a.pcPrizeMoney);
                let draw = new Array(64);
                const pcfSeedOrder = [
                    1, 64, 32, 33, 16, 49, 17, 48, 8, 57, 25, 40, 9, 56, 24, 41,
                    4, 61, 29, 36, 13, 52, 20, 45, 5, 60, 28, 37, 12, 53, 21, 44,
                    2, 63, 31, 34, 15, 50, 18, 47, 7, 58, 26, 39, 10, 55, 23, 42,
                    3, 62, 30, 35, 14, 51, 19, 46, 6, 59, 27, 38, 11, 54, 22, 43
                ];
                for (let i = 0; i < 64; i++) { draw[i] = seeds[pcfSeedOrder[i] - 1]; }
                participants = draw;

            } else if (isContinentalQualifier) {
                participants = shuffle(participants);

            } else if (isContinentalMainEvent) {
                let seeds = participants.slice(0, 16);
                let unseeded = shuffle(participants.slice(16)); 
                let draw = new Array(64);
                const etSeedOrder = [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11];
                let unIndex = 0;
                for (let i = 0; i < 16; i++) {
                    let s = seeds[etSeedOrder[i] - 1]; 
                    let boardStart = i * 4; 
                    draw[boardStart] = s; 
                    draw[boardStart + 1] = { name: "(BYE)", isBye: true, country: "Brak", ovr: 0, overall: 0 }; 
                    draw[boardStart + 2] = unseeded[unIndex++]; 
                    draw[boardStart + 3] = unseeded[unIndex++]; 
                }
                participants = draw;

            } else if (isWorldMastersEvent || isWorldMastersFinals || isWorldMastersFinalsQualifier) {
                participants = typeof buildWorldMastersTournamentDraw === 'function'
                    ? buildWorldMastersTournamentDraw(activeTournament, participants)
                    : shuffle(participants);

            } else if (tNameLow.includes("world darts championship") || tNameLow.includes("global darts championship")) {
                let sortedByOOM = [...participants].sort((a,b) => b.prizeMoney - a.prizeMoney);
                let seeds = sortedByOOM.slice(0, 32);
                let unseeded = shuffle(sortedByOOM.slice(32)); 
                let draw = new Array(128);
                const wdcSeedOrder = [1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21, 2, 31, 15, 18, 7, 26, 10, 23, 3, 30, 14, 19, 6, 27, 11, 22];
                let unIndex = 0;
                for (let i = 0; i < 32; i++) {
                    let s = seeds[wdcSeedOrder[i] - 1]; 
                    let boardStart = i * 4; 
                    draw[boardStart] = s; 
                    draw[boardStart + 1] = { name: "(BYE)", isBye: true, country: "Brak", ovr: 0, overall: 0 }; 
                    draw[boardStart + 2] = unseeded[unIndex++]; 
                    draw[boardStart + 3] = unseeded[unIndex++]; 
                }
                participants = draw;

            } else if (tNameLow.includes("grand slam") || tNameLow.includes("champion's slam")) {
                let seeds = participants.slice(0, 16);
                let unseeded = shuffle(participants.slice(16));
                let advancedToKnockout = new Array(32);
                
                let gsPlayerInTournament = !isHeadlessSim && participants.some(isCurrentPlayer);
                let gsPlayerAdvanced = false;

                for (let i = 0; i < 16; i++) {
                    let group = [seeds[i], unseeded[i * 2], unseeded[i * 2 + 1]];
                    group.sort((a, b) => {
                        let scoreA = a.ovr + (isCurrentPlayer(a) ? 10 : 0) + (Math.random() * 25);
                        let scoreB = b.ovr + (isCurrentPlayer(b) ? 10 : 0) + (Math.random() * 25);
                        return scoreB - scoreA;
                    });

                    if (!isHeadlessSim && (isCurrentPlayer(group[0]) || isCurrentPlayer(group[1]))) {
                        gsPlayerAdvanced = true;
                    }

                    advancedToKnockout[i * 2] = group[0];
                    advancedToKnockout[i * 2 + 1] = group[1];
                }

                if (gsPlayerInTournament && !gsPlayerAdvanced) {
                    alert("Zająłeś 3. miejsce w swojej grupie na Grand Slam of Darts i odpadasz z turnieju.");
                    activeTournament = null; document.getElementById('tile-tournament').style.display = 'none';
                    updateHub(); showScreen('screen-hub'); return;
                } else if (gsPlayerAdvanced) {
                    alert("Gratulacje! Wyszedłeś z fazy grupowej Grand Slam of Darts. Czas na fazę pucharową (Last 32)!");
                }

                for(let i = 1; i < 31; i += 4) {
                    let temp = advancedToKnockout[i];
                    advancedToKnockout[i] = advancedToKnockout[i+2];
                    if(advancedToKnockout[i+2]) advancedToKnockout[i+2] = temp;
                }
                participants = advancedToKnockout;

            } else if (tNameLow.includes("matchplay") || tNameLow.includes("grand prix")) {
                let seeds = participants.slice(0, 16);
                let unseeded = shuffle(participants.slice(16)); 
                let draw = new Array(32);
                const wmSeedOrder = [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11];
                for (let i = 0; i < 16; i++) {
                    let s = seeds[wmSeedOrder[i] - 1]; 
                    let matchStart = i * 2; 
                    draw[matchStart] = s; 
                    draw[matchStart + 1] = unseeded[i]; 
                }
                participants = draw;
            
            } else if (tNameLow.includes("european championship") || tNameLow.includes("continental championship")) {
                let seeds = [...participants].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
                let draw = new Array(32);
                const ecSeedOrder = [1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21, 2, 31, 15, 18, 7, 26, 10, 23, 3, 30, 14, 19, 6, 27, 11, 22];
                for (let i = 0; i < 32; i++) { draw[i] = seeds[ecSeedOrder[i] - 1]; }
                participants = draw;

            } else {
                let unseeded = shuffle(participants.slice(participants.length / 2));
                let draw = new Array(participants.length);
                let head = 0; let tail = participants.length - 2; 
                for(let i = 0; i < participants.length / 2; i++) {
                    let seed = participants[i]; let randomUnseeded = unseeded[i];
                    if (i % 2 === 0) { draw[head] = seed; draw[head+1] = randomUnseeded; head += 2; } 
                    else { draw[tail] = seed; draw[tail+1] = randomUnseeded; tail -= 2; }
                }
                participants = draw;
            }

            tournamentBracket = participants; 
            
            if (isHeadlessSim) {
                // Błyskawiczna symulacja całego turnieju w tle!
                let specialTournamentOutcome = false;
                while (tournamentBracket.length > 1) {
                    specialTournamentOutcome = advanceTournament(false);
                    if (specialTournamentOutcome) break;
                }

                if (specialTournamentOutcome === true) {
                    concludeContinentalTourQualifierEvent(false);
                    return;
                }
                if (specialTournamentOutcome === 'worldMastersFinalsQualifier') {
                    concludeWorldMastersFinalsQualifierEvent(false);
                    return;
                }
                
                // Przypisanie nagród i ostateczne zamknięcie turnieju
                activeTournament.completed = true;
                activeTournament.historyLogs = lastTournamentResults;
                
                let winner = tournamentBracket[0];
                let winPrize = getPrizeMoney(activeTournament.name, 2, true);
                awardPrizeMoney(winner, winPrize, activeTournament.name);
                if (typeof completeWorldMastersTournament === 'function') completeWorldMastersTournament(activeTournament, winner);
                recordSeasonTournamentResult(winner, activeTournament, { round: 2, prizeMoney: winPrize, won: true });

                // Wypłaty za miejsca 5-8 po finałach Play-offs
                if (activeTournament.name.includes("Play-offs")) {
                    let sortedGDL = [...gdlTable].sort((a,b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost));
                    if(sortedGDL[4]) awardPrizeMoney(sortedGDL[4].player, 95000, activeTournament.name);
                    if(sortedGDL[5]) awardPrizeMoney(sortedGDL[5].player, 90000, activeTournament.name);
                    if(sortedGDL[6]) awardPrizeMoney(sortedGDL[6].player, 85000, activeTournament.name);
                    if(sortedGDL[7]) awardPrizeMoney(sortedGDL[7].player, 80000, activeTournament.name);
                }
                
                activeTournament = null; 
                tournamentBracket = []; // <--- CZYŚCI DRABINKĘ PO SYMULACJI
                saveGame(true);
                
                // Ukrywamy kafelek aktywnego turnieju, aktualizujemy dane i wracamy do Hubu
                let tileTour = document.getElementById('tile-tournament');
                if (tileTour) tileTour.style.display = 'none';
                
                updateHub();
                showScreen('screen-hub');
                return;
            }

            showBracket();
        }

        function concludeContinentalTourQualifierEvent(showOutcome = true) {
            if (typeof isContinentalQualifierTournament !== 'function' || !isContinentalQualifierTournament(activeTournament)) return null;

            const qualifierTournament = activeTournament;
            const mainTournament = typeof getLinkedContinentalTour === 'function'
                ? getLinkedContinentalTour(qualifierTournament)
                : null;
            const qualificationState = mainTournament?.continentalQualification;
            const playerKey = typeof getContinentalQualificationPlayerKey === 'function'
                ? getContinentalQualificationPlayerKey(player)
                : '';
            const playerQualified = Boolean(qualificationState?.qualifiedPlayerIds?.includes(playerKey));
            const outcomeMessage = showOutcome && typeof getContinentalQualifierOutcomeMessage === 'function'
                ? getContinentalQualifierOutcomeMessage(playerQualified)
                : '';

            qualifierTournament.completed = true;
            qualifierTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            document.getElementById('tile-tournament').style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);

            if (outcomeMessage) alert(outcomeMessage);
            return { playerQualified, mainTournament };
        }
        

       function showBracket() {
            document.getElementById('t-btn-play-match').onclick = closeBracketAndPlay;
            document.getElementById('t-btn-sim-round').onclick = simulateNextRound;
            document.getElementById('t-btn-play-match').innerText = 'Przejdź do meczu!';
            document.getElementById('t-btn-sim-round').innerText = 'Symuluj Rundę (Mecze AI)';
            document.getElementById('bracket-title').innerText = `🏆 ${t('t-bracket')}: ${getRoundName(tournamentRound)}`;
            const list = document.getElementById('bracket-list'); list.innerHTML = "";
            
            let isPlayerInRound = false;

            for(let i = 0; i < tournamentBracket.length; i += 2) {
                let p1 = tournamentBracket[i]; let p2 = tournamentBracket[i+1];
                let isPlayerMatch = isCurrentPlayer(p1) || isCurrentPlayer(p2);
                
                if (isPlayerMatch) isPlayerInRound = true;

                list.innerHTML += `<div class="bracket-match ${isPlayerMatch ? 'player-match' : ''}">
                    <div style="flex: 1; text-align: left;">${isCurrentPlayer(p1) ? getFlagImg(player.country) : getFlagImg(p1.country)} ${escapeHtml(p1.name)} <span style="color:#bdc3c7; font-size:12px;">(OVR ${getDisplayedOvr(p1)})</span></div>
                    <div class="bracket-vs" style="flex: 0 0 40px; text-align: center;">VS</div>
                    <div style="flex: 1; text-align: right;">${isCurrentPlayer(p2) ? getFlagImg(player.country) : getFlagImg(p2.country)} ${escapeHtml(p2.name)} <span style="color:#bdc3c7; font-size:12px;">(OVR ${getDisplayedOvr(p2)})</span></div>
                </div>`;
            }

            // Zarządzanie przyciskami w zależności od tego, czy gracz nadal jest w turnieju
            if (isPlayerInRound) {
                document.getElementById('t-btn-play-match').style.display = 'block';
                document.getElementById('t-btn-sim-round').style.display = 'none';
            } else {
                document.getElementById('t-btn-play-match').style.display = 'none';
                document.getElementById('t-btn-sim-round').style.display = 'block';
            }

            document.getElementById('bracket-modal').style.display = "flex";
        }

        function simulateNextRound() {
            const specialTournamentOutcome = advanceTournament(false);

            if (specialTournamentOutcome === true) {
                document.getElementById('bracket-modal').style.display = 'none';
                concludeContinentalTourQualifierEvent(true);
                showTournamentEnd();
                return;
            }
            if (specialTournamentOutcome === 'worldMastersFinalsQualifier') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludeWorldMastersFinalsQualifierEvent(true);
                showTournamentEnd();
                return;
            }

            if (tournamentBracket.length === 1) {
                activeTournament.completed = true;
                activeTournament.historyLogs = lastTournamentResults;
                
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

                alert(t('t-alert-tour-sim-end').replace('{tour}', activeTournament.name).replace('{winner}', winner.name));
                
                document.getElementById('bracket-modal').style.display = 'none';
                
                showTournamentEnd(); 

                activeTournament = null;
                tournamentBracket = []; // <--- CZYŚCI DRABINKĘ PO MECZACH AI
                document.getElementById('tile-tournament').style.display = 'none';
                updateHub();
                saveGame(true);
            } else {
                document.getElementById('bracket-modal').style.display = 'none'; // <--- TA LINIJKA NAPRAWIA BŁĄD
                showRoundResults(); 
            }
        }

        function closeBracketAndPlay() { 
            let opponent = null;
            for(let i = 0; i < tournamentBracket.length; i += 2) {
                if(isCurrentPlayer(tournamentBracket[i])) opponent = tournamentBracket[i+1];
                else if(isCurrentPlayer(tournamentBracket[i+1])) opponent = tournamentBracket[i];
            }
            
            if (opponent && opponent.isBye) {
                alert("Otrzymujesz wolny los (BYE) jako zawodnik rozstawiony! Awansujesz do kolejnej fazy bez gry.");
                advanceTournament(true);
                showRoundResults(); // Pokaże symulację rywali
                return;
            }
            
            document.getElementById('bracket-modal').style.display = "none"; 
            startTournamentMatch(); 
        }

        function simulateAImatch(p1, p2, matchFormat) {
    let p1Chance = getTournamentWinChance(p1, p2);
    let p1Legs = 0, p2Legs = 0, p1Sets = 0, p2Sets = 0;

    let isSets = matchFormat.type === 'sets';
    let targetLegs = matchFormat.legsToWin || 6;
    let targetSets = matchFormat.setsToWin || 3;
    let legsPerSet = matchFormat.legsPerSet || 3;

    // Szybka matematyczna symulacja meczu leg po legu
    while (true) {
        if (Math.random() < p1Chance) p1Legs++; else p2Legs++;

        if (isSets) {
            if (p1Legs >= legsPerSet) { p1Sets++; p1Legs = 0; p2Legs = 0; }
            else if (p2Legs >= legsPerSet) { p2Sets++; p1Legs = 0; p2Legs = 0; }
            if (p1Sets >= targetSets || p2Sets >= targetSets) break;
        } else {
            if (matchFormat.winByTwo) {
                if ((p1Legs >= targetLegs || p2Legs >= targetLegs) && Math.abs(p1Legs - p2Legs) >= 2) break;
                // Nagła śmierć (np. w World Matchplay)
                if (p1Legs === matchFormat.suddenDeathAt && p2Legs === matchFormat.suddenDeathAt) {
                    if (Math.random() < p1Chance) p1Legs++; else p2Legs++;
                    break;
                }
            } else {
                if (p1Legs >= targetLegs || p2Legs >= targetLegs) break;
            }
        }
    }

    let p1Won = isSets ? (p1Sets > p2Sets) : (p1Legs > p2Legs);
    
    // ZMIANA TUTAJ: Zawsze najpierw przypisujemy wynik zwycięzcy, a potem przegranego
    let wScore = p1Won ? (isSets ? p1Sets : p1Legs) : (isSets ? p2Sets : p2Legs);
    let lScore = p1Won ? (isSets ? p2Sets : p2Legs) : (isSets ? p1Sets : p1Legs);
    let scoreStr = `${wScore}:${lScore}`;

    // Forma turniejowa wpływa także na wyświetlaną średnią, aby niespodzianka miała wiarygodne statystyki.
    const p1TournamentForm = getTournamentSimulationForm(p1);
    const p2TournamentForm = getTournamentSimulationForm(p2);
    let p1BaseAvg = 60 + (p1.ovr * 0.42) + (p1TournamentForm * 0.4);
    let p2BaseAvg = 60 + (p2.ovr * 0.42) + (p2TournamentForm * 0.4);

    // Dodajemy losowe odchylenie meczowe oraz premię +2 punkty dla zwycięzcy.
    let p1Avg = (p1BaseAvg + (Math.random() * 9 - 4) + (p1Won ? 2 : 0)).toFixed(2);
    let p2Avg = (p2BaseAvg + (Math.random() * 9 - 4) + (!p1Won ? 2 : 0)).toFixed(2);

    // Każdy symulowany oficjalny mecz, także AI kontra AI, aktualizuje rekord sezonu.
    recordSeasonHighestAverage(p1, Number(p1Avg));
    recordSeasonHighestAverage(p2, Number(p2Avg));

    // --- AKTUALIZACJA REKORDÓW Z SYMULACJI ---
    if (isCurrentPlayer(p1) || isCurrentPlayer(p2)) {
        if (typeof initCareerStats === 'function') initCareerStats(); // Zabezpieczenie obiektu
        
        let myAvg = parseFloat(isCurrentPlayer(p1) ? p1Avg : p2Avg);
        
        // Zapisanie najwyższej średniej z symulacji matematycznej
        recordCareerBestAverage(myAvg);
        saveGame();
    }

    return {
        winner: p1Won ? p1 : p2,
        loser: p1Won ? p2 : p1,
        scoreStr: scoreStr,
        p1Avg: p1Avg,
        p2Avg: p2Avg,
        p1Score: isSets ? p1Sets : p1Legs,
        p2Score: isSets ? p2Sets : p2Legs
    };
}

        function advanceTournament(playerAdvancing = true) {
            let nextRoundBracket = [];
            const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(activeTournament);
            const isWorldMastersEvent = typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(activeTournament);
            const isWorldMastersFinalsQualifier = typeof isWorldMastersFinalsQualifierTournament === 'function' && isWorldMastersFinalsQualifierTournament(activeTournament);
            let prize = isContinentalQualifier ? 0 : getPrizeMoney(activeTournament.name, tournamentRound, false);

            let roundHeader = `<h4 style='color:var(--accent-green); margin:15px 0 5px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 3px;'>${getRoundName(tournamentRound)}</h4>`;
            lastTournamentResults += roundHeader;
            currentRoundHTML = roundHeader; 

            for(let i=0; i<tournamentBracket.length; i+=2) {
                let p1 = tournamentBracket[i]; let p2 = tournamentBracket[i+1];
                
                // Zabezpieczenie przed pustymi miejscami w drabince
                if (!p1 || !p2) continue; 
                
                let winner, loser;
                
                // ZMIANA: Deklaracja wyników na samej górze pętli, aby były widoczne dla tabeli GDL!
                let matchWScore = 6, matchLScore = 0; 

                if (p1.isBye) { nextRoundBracket.push(p2); continue; }
                if (p2.isBye) { nextRoundBracket.push(p1); continue; }

                if (isCurrentPlayer(p1) || isCurrentPlayer(p2)) {
                    if (playerAdvancing) {
                        winner = isCurrentPlayer(p1) ? p1 : p2;
                        loser = isCurrentPlayer(p1) ? p2 : p1;
                    } else {
                        winner = isCurrentPlayer(p1) ? p2 : p1;
                        loser = isCurrentPlayer(p1) ? p1 : p2;
                    }
                    nextRoundBracket.push(winner);
                    if (!isContinentalQualifier) awardPrizeMoney(loser, prize, activeTournament.name); 
                    applyTournamentRatingChange(winner, loser, tournamentRound);

                    let scoreStr = "W:O";
                    let wAvg = "0.00", lAvg = "0.00";
                    if (currentMatch && currentMatch.stats) {
                        let isSets = currentMatch.matchFormat && currentMatch.matchFormat.type === 'sets';
                        
                        // ZMIANA: Zapisanie Twojego wyniku do wyciągniętych wyżej zmiennych
                        matchWScore = isCurrentPlayer(winner) ? (isSets ? currentMatch.p1Sets : currentMatch.p1Legs) : (isSets ? currentMatch.p2Sets : currentMatch.p2Legs);
                        matchLScore = isCurrentPlayer(loser) ? (isSets ? currentMatch.p1Sets : currentMatch.p1Legs) : (isSets ? currentMatch.p2Sets : currentMatch.p2Legs);
                        scoreStr = `${matchWScore}:${matchLScore}`;
                        
                        let p1Avg = formatStat(currentMatch.stats.p1AccumulatedScore + (501 - currentMatch.p1Score), currentMatch.stats.p1TotalDarts);
                        let p2Avg = formatStat(currentMatch.stats.p2AccumulatedScore + (501 - currentMatch.p2Score), currentMatch.stats.p2TotalDarts);
                        wAvg = isCurrentPlayer(winner) ? p1Avg : p2Avg;
                        lAvg = isCurrentPlayer(loser) ? p1Avg : p2Avg;
                    }

                    // Oficjalny mecz z tym samym przeciwnikiem buduje historię H2H i może stworzyć rywalizację.
                    const playedOpponent = isCurrentPlayer(p1) ? p2 : p1;
                    if (currentMatch && currentMatch.isTournament && currentMatch.stats && samePlayer(currentMatch.opponent, playedOpponent)) {
                        const playerScore = isCurrentPlayer(winner)
                            ? `${matchWScore}:${matchLScore}`
                            : `${matchLScore}:${matchWScore}`;
                        recordRivalryMatch(winner, loser, activeTournament, tournamentRound, playerScore);
                    }

                    // --- NOWY, REALISTYCZNY UKŁAD DRABINKI (Twój mecz) ---
                    let isP1Winner = (winner === p1);
                    let p1Style = isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    let p2Style = !isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    
                    let p1FinalAvg = isP1Winner ? wAvg : lAvg;
                    let p2FinalAvg = !isP1Winner ? wAvg : lAvg;
                    let finalScoreStr = isP1Winner ? `${matchWScore}:${matchLScore}` : `${matchLScore}:${matchWScore}`;

                    let matchResultHTML = `<div style="font-size: 13px; border-bottom: 1px solid #2c3e50; padding: 6px; background: rgba(39, 174, 96, 0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="flex: 1; text-align: right; ${p1Style}">${escapeHtml(p1.name)}</span>
                            <span style="flex: 0 0 50px; text-align: center; color: #f1c40f; font-weight: bold;">${finalScoreStr}</span>
                            <span style="flex: 1; text-align: left; ${p2Style}">${escapeHtml(p2.name)}</span>
                        </div>
                        <div style="color: #7f8c8d; font-size: 11px; text-align: center; margin-top: 3px;">
                            (${t('t-avg-short')} ${p1FinalAvg} - ${p2FinalAvg})
                        </div>
                    </div>`;

                    lastTournamentResults += matchResultHTML;
                    currentRoundHTML += matchResultHTML;

                    if (isWorldMastersEvent && typeof recordWorldMastersMatchResult === 'function') {
                        recordWorldMastersMatchResult(activeTournament, winner, loser, {
                            round: tournamentRound, winnerLegs: matchWScore, loserLegs: matchLScore,
                            winnerAverage: Number(wAvg), loserAverage: Number(lAvg)
                        });
                    }

                } else {
                    let format = getTournamentMatchFormat(activeTournament, tournamentRound);
                    let matchRes = simulateAImatch(p1, p2, format);
                    
                    winner = matchRes.winner; 
                    loser = matchRes.loser;
                    
                    // ZMIANA: Zapisanie wyniku meczu AI do wyciągniętych wyżej zmiennych (zawsze wyższa dla zwycięzcy)
                    matchWScore = Math.max(matchRes.p1Score, matchRes.p2Score);
                    matchLScore = Math.min(matchRes.p1Score, matchRes.p2Score);

                    nextRoundBracket.push(winner);
                    if (!isContinentalQualifier) awardPrizeMoney(loser, prize, activeTournament.name);
                    applyTournamentRatingChange(winner, loser, tournamentRound);

                    let wAvg = winner === p1 ? matchRes.p1Avg : matchRes.p2Avg;
                    let lAvg = loser === p1 ? matchRes.p1Avg : matchRes.p2Avg;

                    // --- NOWY, REALISTYCZNY UKŁAD DRABINKI (Mecze AI) ---
                    let isP1Winner = (winner === p1);
                    let p1Style = isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    let p2Style = !isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    
                    let p1FinalAvg = isP1Winner ? wAvg : lAvg;
                    let p2FinalAvg = !isP1Winner ? wAvg : lAvg;
                    let finalScoreStr = isP1Winner ? `${matchWScore}:${matchLScore}` : `${matchLScore}:${matchWScore}`;

                    let matchResultHTML = `<div style="font-size: 13px; border-bottom: 1px solid #2c3e50; padding: 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="flex: 1; text-align: right; ${p1Style}">${escapeHtml(p1.name)}</span>
                            <span style="flex: 0 0 50px; text-align: center; color: #f1c40f; font-weight: bold;">${finalScoreStr}</span>
                            <span style="flex: 1; text-align: left; ${p2Style}">${escapeHtml(p2.name)}</span>
                        </div>
                        <div style="color: #7f8c8d; font-size: 11px; text-align: center; margin-top: 3px;">
                            (${t('t-avg-short')} ${p1FinalAvg} - ${p2FinalAvg})
                        </div>
                    </div>`;

                    lastTournamentResults += matchResultHTML;
                    currentRoundHTML += matchResultHTML;

                    if (isWorldMastersEvent && typeof recordWorldMastersMatchResult === 'function') {
                        recordWorldMastersMatchResult(activeTournament, winner, loser, {
                            round: tournamentRound, winnerLegs: matchWScore, loserLegs: matchLScore,
                            winnerAverage: Number(wAvg), loserAverage: Number(lAvg)
                        });
                    }
                }

                if (!isContinentalQualifier) {
                    recordSeasonTournamentResult(loser, activeTournament, { round: tournamentRound, prizeMoney: prize });
                }

                // --- NOWOŚĆ: Punkty i legi do tabeli Ligi ---
                if ((activeTournament.name.includes("Global Darts League") || activeTournament.name.includes("Premier")) && !activeTournament.name.includes("Play-offs")) {
                    let wGdl = gdlTable.find(g => samePlayer(g.player, winner));
                    let lGdl = gdlTable.find(g => samePlayer(g.player, loser));
                    
                    // Używamy bezpiecznie przekazanych zmiennych matchWScore i matchLScore
                    if(wGdl) { wGdl.legsWon += matchWScore; wGdl.legsLost += matchLScore; }
                    if(lGdl) { lGdl.legsWon += matchLScore; lGdl.legsLost += matchWScore; }

                    if (tournamentRound === 4) { 
                        // Ktoś przegrał w Półfinale GDL
                        if (lGdl) lGdl.points += 2;
                    } else if (tournamentRound === 2) { 
                        // Finał! Zwycięzca i przegrany dostają punkty
                        if (lGdl) lGdl.points += 3;
                        if (wGdl) { wGdl.points += 5; wGdl.nightsWon += 1; }
                    }
                }
            } // Koniec pętli for
            tournamentBracket = nextRoundBracket; tournamentRound /= 2;
            if (isContinentalQualifier && tournamentRound === 16) {
                completeContinentalTourQualifier(activeTournament, tournamentBracket);
                return true;
            }
            if (isWorldMastersFinalsQualifier && tournamentRound === 4) {
                if (typeof completeWorldMastersFinalsQualifier === 'function') {
                    completeWorldMastersFinalsQualifier(activeTournament, tournamentBracket);
                }
                return 'worldMastersFinalsQualifier';
            }
            return false;
        }

        function startTournamentMatch() {
            let opponent = null;
            for(let i = 0; i < tournamentBracket.length; i += 2) {
                if(isCurrentPlayer(tournamentBracket[i])) opponent = tournamentBracket[i+1];
                else if(isCurrentPlayer(tournamentBracket[i+1])) opponent = tournamentBracket[i];
            }

            const matchFormat = getTournamentMatchFormat(activeTournament, tournamentRound);
            initRivalries();
            const rivalryRecord = opponent && opponent.id ? player.rivalries[opponent.id] : null;
            const isRivalryMatch = Boolean(rivalryRecord && player.activeRivalIds.includes(opponent.id));
            const rivalryModifier = isRivalryMatch ? getRivalryMatchModifier(rivalryRecord) : 0;

            let starter = Math.random() < 0.5 ? 'p1' : 'p2';
            currentMatch = { 
                vsAI: true, opponent: opponent, 
                p1Score: 501, p2Score: 501, p1Legs: 0, p2Legs: 0, p1Sets: 0, p2Sets: 0, totalLegsPlayed: 0,
                legsToWin: matchFormat.type === 'sets' ? matchFormat.legsPerSet : matchFormat.legsToWin,
                matchFormat: matchFormat, turn: starter, startingPlayer: starter, dartsThrown: 0, p1TurnStartScore: 501, p2TurnStartScore: 501, isTournament: true, isRivalryMatch: isRivalryMatch, rivalryModifier: rivalryModifier,
                stats: { 
                    p1TotalDarts: 0, p1AccumulatedScore: 0, p1First9Score: 0, p1First9Darts: 0, p1LegDarts: 0, p1HighCheckout: 0, p1DoubleAttempts: 0, p1DoubleHits: 0, p1OneEighties: 0,
                    p2TotalDarts: 0, p2AccumulatedScore: 0, p2First9Score: 0, p2First9Darts: 0, p2LegDarts: 0, p2HighCheckout: 0, p2DoubleAttempts: 0, p2DoubleHits: 0, p2OneEighties: 0 
                }
            };
            
            currentTurnScore = 0; document.getElementById('match-log').innerHTML = "";
            if (isRivalryMatch) {
                logThrow(`🔥 ${trRival('h2h')}: ${rivalryRecord.wins}-${rivalryRecord.losses}`, 'system');
                if (rivalryModifier !== 0) {
                    const effectKey = rivalryModifier > 0 ? 'mentalBoost' : 'mentalPressure';
                    logThrow(`🧠 ${trRival(effectKey, { value: Math.abs(rivalryModifier) })}`, 'system');
                }
            }
            drawnDarts = []; drawDartboard(); updateDartDots();

            document.getElementById('score-col-ai').style.display = 'flex'; 
            document.getElementById('match-p1-name').innerHTML = `${getFlagImg(player.country)} ${escapeHtml(player.name)}`;
            document.getElementById('match-p2-name').innerHTML = `${getFlagImg(currentMatch.opponent.country)} ${escapeHtml(currentMatch.opponent.name)}`;
            const rivalryPrefix = isRivalryMatch ? `🔥 ${trRival('tileTitle')} · ` : '';
            const tournamentName = typeof getTournamentDisplayName === 'function'
                ? getTournamentDisplayName(activeTournament)
                : activeTournament.name;
            document.getElementById('match-title').innerText = `${rivalryPrefix}🏆 ${tournamentName} - ${getRoundName(tournamentRound)} (${getMatchFormatLabel(matchFormat)})`;
            
            // --- WCZYTYWANIE ZDJĘĆ NA TABLICĘ ---
            let p1PhotoSrc = player.photo ? player.photo : "https://placehold.co/100/16213e/FFFFFF?text=TY";
            document.getElementById('score-photo-p1').classList.remove('world-cup-flag-photo');
            document.getElementById('score-photo-p2').classList.remove('world-cup-flag-photo');
            document.getElementById('score-photo-p1').src = p1PhotoSrc;
            
            let p2Img = document.getElementById('score-photo-p2');
            // Zamiast korzystać z domyślnych plików, używamy tych z wybranego moda (jeśli są)
            p2Img.src = moddedAssets.photos[currentMatch.opponent.name] || `zdjecia/${currentMatch.opponent.name}.png`;
            p2Img.onerror = function() { this.onerror=null; this.src='https://placehold.co/100/16213e/FFFFFF?text=AI'; };
            // -----------------------------------

            updateScores(); updateMatchStatsUI(); setTurnUI(); showScreen('screen-match');
            playMatchIntro(player.name, currentMatch.opponent.name);
        }

        
