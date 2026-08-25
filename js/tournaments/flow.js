const PLAYERS_CHAMPIONSHIP_FIELD_SIZE = 128;
const PLAYERS_CHAMPIONSHIP_TOP_16_WITHDRAWAL_CHANCE = 0.15;

function buildPlayersChampionshipField(cardHolders, replacementPoolOrRandom = [], random = Math.random) {
    const legacyCall = typeof replacementPoolOrRandom === 'function';
    const randomFn = legacyCall ? replacementPoolOrRandom : random;
    const rankedCardHolders = [...(Array.isArray(cardHolders) ? cardHolders : [])].sort((a, b) =>
        (Number(b?.prizeMoney) || 0) - (Number(a?.prizeMoney) || 0));
    const replacementPool = legacyCall
        ? rankedCardHolders.slice(PLAYERS_CHAMPIONSHIP_FIELD_SIZE)
        : [...(Array.isArray(replacementPoolOrRandom) ? replacementPoolOrRandom : [])]
            .filter(candidate => !rankedCardHolders.includes(candidate))
            .sort((a, b) => (Number(b?.prizeMoney) || 0) - (Number(a?.prizeMoney) || 0));
    const guaranteedCardField = rankedCardHolders.slice(0, PLAYERS_CHAMPIONSHIP_FIELD_SIZE);
    const vacantPlaceCount = Math.max(0, PLAYERS_CHAMPIONSHIP_FIELD_SIZE - guaranteedCardField.length);
    const vacancyReplacements = replacementPool.slice(0, vacantPlaceCount);
    const baseField = [...guaranteedCardField, ...vacancyReplacements];
    const remainingReplacementPool = replacementPool.slice(vacancyReplacements.length);
    const requestedWithdrawals = baseField
        .slice(0, 16)
        .filter(candidate => candidate?.hasTourCard === true && !isCurrentPlayer(candidate)
            && randomFn() < PLAYERS_CHAMPIONSHIP_TOP_16_WITHDRAWAL_CHANCE);

    // Nie skracamy drabinki, gdy w bazie byłoby zbyt mało zastępców.
    const withdrawnPlayers = requestedWithdrawals.slice(0, remainingReplacementPool.length);
    const withdrawnSet = new Set(withdrawnPlayers);
    const replacements = remainingReplacementPool.slice(0, withdrawnPlayers.length);

    return {
        participants: [...baseField.filter(candidate => !withdrawnSet.has(candidate)), ...replacements],
        withdrawnPlayers,
        replacements: [...vacancyReplacements, ...replacements]
    };
}

function skipActiveTournament() {
            if (!confirm(t('t-confirm-skip'))) return;
            isSkippingTournament = true;
            startTournament(); 
        }

        function startTournament() {
            if (!activeTournament) return;
            if (currentMatch && currentMatch.isTournament && currentMatch.p1Score !== undefined) {
                if (typeof chargeTournamentParticipationStamina === 'function') {
                    chargeTournamentParticipationStamina(activeTournament);
                }
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
            if (!isSkippingTournament && typeof isGrandSlamGroupStageActive === 'function' && isGrandSlamGroupStageActive(activeTournament)) {
                showGrandSlamGroups();
                return;
            }
            // Zapis sprzed wprowadzenia prawdziwej fazy grupowej zawierał już
            // sztuczną drabinkę Last 32. Możemy ją bezpiecznie zastąpić tylko
            // przed rozegraniem pierwszej rundy.
            if (typeof shouldRefreshGrandSlamOpeningDraw === 'function' && shouldRefreshGrandSlamOpeningDraw(activeTournament)) {
                tournamentBracket = [];
                if (activeTournament) activeTournament.simulationForm = null;
            }
            // Kariera prawdziwym zawodnikiem nie może pozostawić jego dawnego
            // wpisu AI w obsadzie. Naprawiamy też drabinki zapisane przed tą zmianą.
            if (typeof removeCareerPlayerFromAiPool === 'function') removeCareerPlayerFromAiPool();
            if (tournamentBracket && tournamentBracket.length > 1 && typeof repairCareerTournamentBracket === 'function') {
                tournamentBracket = repairCareerTournamentBracket(tournamentBracket);
            }
            if (tournamentBracket && tournamentBracket.length > 1 && typeof repairRetiredTournamentBracket === 'function') {
                tournamentBracket = repairRetiredTournamentBracket(tournamentBracket);
            }
            // --- ZABEZPIECZENIE: Jeśli turniej już trwa (drabinka jest wygenerowana), to tylko ją pokazujemy i kontynuujemy grę! ---
            if (tournamentBracket && tournamentBracket.length > 1) {
                const isWorldMastersActiveTournament = typeof isWorldMastersTournament === 'function' && (
                    isWorldMastersTournament(activeTournament) ||
                    isWorldMastersFinalsTournament(activeTournament) ||
                    isWorldMastersFinalsQualifierTournament(activeTournament)
                );
                const expectedOpeningRound = isWorldMastersActiveTournament && typeof getWorldMastersTournamentRound === 'function'
                    ? getWorldMastersTournamentRound(activeTournament)
                    : null;
                const isWorldMastersFinalsQualifierDraw = typeof isWorldMastersFinalsQualifierTournament === 'function'
                    && isWorldMastersFinalsQualifierTournament(activeTournament);
                const staleWorldMastersOpeningDraw = typeof shouldRefreshWorldMastersEventField === 'function'
                    && shouldRefreshWorldMastersEventField(activeTournament);
                const malformedOpeningWorldMastersDraw = expectedOpeningRound === tournamentRound && (
                    tournamentBracket.length !== expectedOpeningRound
                    || tournamentBracket.some(candidate => !candidate || (
                        candidate.isBye
                            ? !isWorldMastersFinalsQualifierDraw
                            : isWorldMastersFinalsQualifierDraw && candidate.hasTourCard !== true
                    ))
                    || staleWorldMastersOpeningDraw
                );
                const staleWorldMastersFinalsQualifierDraw = isWorldMastersFinalsQualifierDraw && (
                    tournamentBracket.some(candidate => candidate && !candidate.isBye && candidate.hasTourCard !== true)
                    || ((!Array.isArray(tournamentMatchHistory) || tournamentMatchHistory.length === 0)
                        && (tournamentRound !== expectedOpeningRound || tournamentBracket.length !== expectedOpeningRound))
                );
                const staleEuropeanChampionshipOpeningDraw = typeof isEuropeanChampionshipTournament === 'function'
                    && isEuropeanChampionshipTournament(activeTournament)
                    && tournamentRound === 32
                    && tournamentBracket.length === 32
                    && (!Array.isArray(tournamentMatchHistory) || tournamentMatchHistory.length === 0)
                    && activeTournament.europeanChampionshipDrawVersion !== EUROPEAN_CHAMPIONSHIP_DRAW_VERSION;
                const activeTournamentName = String(activeTournament?.name || '').toLowerCase();
                const staleWorldChampionshipOpeningDraw = (
                    activeTournamentName.includes('world darts championship')
                    || activeTournamentName.includes('global darts championship')
                ) && tournamentRound === 128
                    && (!Array.isArray(tournamentMatchHistory) || tournamentMatchHistory.length === 0)
                    && (
                        tournamentBracket.some(candidate => candidate?.isBye)
                        || activeTournament.worldChampionshipQualification?.version !== (
                            typeof WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION === 'number'
                                ? WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION
                                : 1
                        )
                    );
                const staleContinentalQualificationDraw = activeTournament?.specialType === 'continentalQualifier'
                    && (!Array.isArray(tournamentMatchHistory) || tournamentMatchHistory.length === 0)
                    && activeTournament.continentalQualificationVersion !== 2;
                const staleQSchoolOpeningDraw = activeTournament?.specialType === 'pdcQSchool'
                    && (!Array.isArray(tournamentMatchHistory) || tournamentMatchHistory.length === 0)
                    && activeTournament.qSchoolDrawVersion !== (
                        typeof PDC_QSCHOOL_DRAW_VERSION === 'number' ? PDC_QSCHOOL_DRAW_VERSION : 2
                    );

                // Starsze zapisy mogły zachować niepełną drabinkę po emeryturze
                // lokalnego uczestnika albo nierozpoczętą obsadę sprzed zmiany
                // zasad zaproszeń. Nie wznawiamy takiej drabinki — tworzymy ją
                // ponownie z dostępnymi zastępcami i aktualną regułą OOM.
                if (!malformedOpeningWorldMastersDraw && !staleWorldMastersFinalsQualifierDraw && !staleEuropeanChampionshipOpeningDraw
                    && !staleWorldChampionshipOpeningDraw && !staleContinentalQualificationDraw && !staleQSchoolOpeningDraw) {
                    if (tournamentBracket.some(isCurrentPlayer) && typeof chargeTournamentParticipationStamina === 'function') {
                        chargeTournamentParticipationStamina(activeTournament);
                    }
                    showBracket();
                    return;
                }
                tournamentBracket = [];
                if (activeTournament) activeTournament.simulationForm = null;
            }

            let tName = activeTournament.name;
            let tNameLow = tName.toLowerCase();
            let tournamentDisplayName = typeof getTournamentDisplayName === 'function'
                ? getTournamentDisplayName(activeTournament)
                : tName;
            // Karta daje stały dostęp do Pro Touru. Gracz bez karty nadal pozostaje
            // w rankingach i może wywalczyć telewizyjny turniej albo wejść jako rezerwowy.
            let allPlayers = typeof getPdcTourCardPlayers === 'function'
                ? getPdcTourCardPlayers(true)
                : [...pdcPlayers, player].filter(candidate => candidate && candidate.hasTourCard !== false);
            let tourCardPlayers = allPlayers.filter(candidate => candidate.hasTourCard === true)
                .sort((a, b) => (Number(b.prizeMoney) || 0) - (Number(a.prizeMoney) || 0));
            let nonCardPlayers = allPlayers.filter(candidate => candidate.hasTourCard !== true)
                .sort((a, b) => (Number(b.prizeMoney) || 0) - (Number(a.prizeMoney) || 0));
            if (typeof refreshProTourOrderOfMerit === 'function') {
                refreshProTourOrderOfMerit(allPlayers, currentDate);
            }
            let oomRanked = [...allPlayers].sort((a,b) => b.prizeMoney - a.prizeMoney);
            let ptRanked = [...allPlayers].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
            let pcRanked = [...allPlayers].sort((a,b) => b.pcPrizeMoney - a.pcPrizeMoney);
            let etRanked = typeof getEuropeanTourOrderOfMerit === 'function'
                ? getEuropeanTourOrderOfMerit(allPlayers)
                : [...allPlayers].sort((a, b) => (b.europeanTourPrizeMoney || 0) - (a.europeanTourPrizeMoney || 0));
            const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(activeTournament);
            const isContinentalMainEvent = typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(activeTournament);
            const isWorldMastersEvent = typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(activeTournament);
            const isWorldMastersFinals = typeof isWorldMastersFinalsTournament === 'function' && isWorldMastersFinalsTournament(activeTournament);
            const isWorldMastersFinalsQualifier = typeof isWorldMastersFinalsQualifierTournament === 'function' && isWorldMastersFinalsQualifierTournament(activeTournament);
            const isGrandSlamEvent = typeof isGrandSlamTournament === 'function' && isGrandSlamTournament(activeTournament);
            const isEuropeanChampionship = typeof isEuropeanChampionshipTournament === 'function'
                ? isEuropeanChampionshipTournament(activeTournament)
                : (tNameLow.includes('european championship') || tNameLow.includes('continental championship'));
            const isQSchoolEvent = typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(activeTournament);
            const isTourCardQualifierEvent = typeof isPdcTourCardQualifierTournament === 'function'
                && isPdcTourCardQualifierTournament(activeTournament);

            let participants = [];

            // --- 1. WYBÓR UCZESTNIKÓW I ROZMIAR DRABINKI ---
            
            // Finały Play-offs
            if (isTourCardQualifierEvent) {
                participants = typeof getPdcTourCardQualifierParticipants === 'function'
                    ? getPdcTourCardQualifierParticipants(activeTournament, allPlayers)
                    : tourCardPlayers;
                tournamentRound = typeof getPdcQSchoolOpeningRound === 'function'
                    ? getPdcQSchoolOpeningRound(participants.length)
                    : 128;

            } else if (isQSchoolEvent) {
                participants = typeof getPdcQSchoolParticipants === 'function'
                    ? getPdcQSchoolParticipants(allPlayers)
                    : nonCardPlayers;
                tournamentRound = typeof getPdcQSchoolOpeningRound === 'function'
                    ? getPdcQSchoolOpeningRound(participants.length)
                    : 128;

            } else if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && tNameLow.includes("play-off")) {
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
                const playersChampionshipField = buildPlayersChampionshipField(tourCardPlayers, nonCardPlayers);
                participants = playersChampionshipField.participants;
                activeTournament.playersChampionshipWithdrawals = playersChampionshipField.withdrawnPlayers
                    .map(candidate => candidate.id || candidate.name);
                activeTournament.playersChampionshipReplacements = playersChampionshipField.replacements
                    .map(candidate => candidate.id || candidate.name);
                tournamentRound = 128;
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
                const worldChampionshipCandidates = [
                    ...(Array.isArray(pdcPlayers) ? pdcPlayers : []),
                    ...(player?.name ? [player] : [])
                ];
                participants = typeof getWorldChampionshipQualificationField === 'function'
                    ? getWorldChampionshipQualificationField(activeTournament, worldChampionshipCandidates, currentDate)
                    : oomRanked.slice(0, 128);
                tournamentRound = 128;
            } else if (tNameLow.includes("uk open") || tNameLow.includes("british open")) {
                participants = tourCardPlayers.slice(0, 128);
                if (participants.length < 128) {
                    participants.push(...nonCardPlayers.slice(0, 128 - participants.length));
                }
                tournamentRound = 128;
            } else if (isContinentalQualifier) {
                participants = getContinentalTourQualifierParticipants(activeTournament);
                tournamentRound = typeof getContinentalQualifierOpeningRound === 'function'
                    ? getContinentalQualifierOpeningRound(activeTournament, participants.length)
                    : participants.length;
                activeTournament.continentalQualificationVersion = typeof CONTINENTAL_QUALIFICATION_VERSION === 'number'
                    ? CONTINENTAL_QUALIFICATION_VERSION
                    : 2;
            } else if (isContinentalMainEvent) {
                const continentalField = getContinentalTourMainField(activeTournament);
                participants = continentalField
                    ? [...continentalField.oomPlayers, ...continentalField.proTourPlayers, ...continentalField.qualifiedPlayers]
                    : [];
                tournamentRound = 64;
            } else if (tNameLow.includes("grand slam") || tNameLow.includes("champion's slam")) {
                const qualifiedField = typeof getPdcTourCardQualifiedMainField === 'function'
                    ? getPdcTourCardQualifiedMainField(activeTournament, allPlayers)
                    : null;
                if (qualifiedField) participants = qualifiedField;
                else {
                    let qualified = new Set();
                    oomRanked.slice(0, 16).forEach(p => qualified.add(p));
                    let ptIndex = 0;
                    while(qualified.size < 48 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; }
                    participants = Array.from(qualified);
                }
                tournamentRound = 16; 
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
            } else if (isEuropeanChampionship) {
                participants = etRanked.slice(0, 32);
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
                const replacementRanking = (isQSchoolEvent || isTourCardQualifierEvent || isContinentalQualifier || isWorldMastersFinalsQualifier)
                    ? []
                    : [...nonCardPlayers, ...(isEuropeanChampionship ? etRanked : ptRanked)];
                const replacement = replacementRanking.find(p => !participants.includes(p) && !isCurrentPlayer(p));
                participants = replacement
                    ? participants.map(p => isCurrentPlayer(p) ? replacement : p)
                    : participants.filter(p => !isCurrentPlayer(p));
                playerInTournament = false;
            }

            let isHeadlessSim = false;

            if (isSkippingTournament) {
                // Jeśli gracz celowo nacisnął "Odpuść", symulujemy cały turniej w tle
                alert(t('t-alert-skip-tour').replace('{tour}', tournamentDisplayName));
                isHeadlessSim = true;
            } else if (isQSchoolEvent && !playerInTournament) {
                // Posiadacz karty nie musi brać udziału w Q-Schoolu. Wyniki walki
                // pozostałych zawodników rozstrzygamy automatycznie.
                isHeadlessSim = true;
            } else if (isTourCardQualifierEvent && !playerInTournament) {
                // Brak karty albo bezpośrednia kwalifikacja wyłącza gracza z tego
                // turnieju; wyniki pozostałych posiadaczy kart liczymy w tle.
                isHeadlessSim = true;
            } else if (!playerInTournament) {
                // Jeśli gracz się nie zakwalifikował, tylko o tym informujemy, 
                // ale NIE włączamy symulacji w tle, by pokazać mu drabinkę!
                alert(t('t-alert-no-qual').replace('{tour}', tournamentDisplayName));
            }

            isSkippingTournament = false;

            if (playerInTournament && typeof chargeTournamentParticipationStamina === 'function') {
                chargeTournamentParticipationStamina(activeTournament);
            }

            lastTournamentResults = ""; 
            tournamentMatchHistory = [];
            preTournamentRanks = { main: getPlayerRank('main'), pt: getPlayerRank('protour'), pc: getPlayerRank('pc'), et: getPlayerRank('europeanTour') };
            prepareTournamentSimulationForm(participants);

            if (isGrandSlamEvent && typeof initializeGrandSlamTournament === 'function') {
                const grandSlamStage = initializeGrandSlamTournament(participants, isHeadlessSim);
                if (!grandSlamStage) return;
                if (grandSlamStage.phase === 'groups') {
                    if (typeof saveGame === 'function') saveGame(true);
                    showGrandSlamGroups();
                    return;
                }
                participants = grandSlamStage.participants;
                tournamentRound = 16;
            }

            // --- 2. LOSOWANIE / ROZSTAWIENIE ---
            if (isTourCardQualifierEvent) {
                participants = typeof buildPdcTourCardQualifierDraw === 'function'
                    ? buildPdcTourCardQualifierDraw(participants)
                    : shuffle(participants);
                tournamentRound = participants.length;
            } else if (isQSchoolEvent) {
                participants = typeof buildPdcQSchoolDraw === 'function'
                    ? buildPdcQSchoolDraw(participants)
                    : shuffle(participants);
                tournamentRound = participants.length;
                activeTournament.qSchoolDrawVersion = typeof PDC_QSCHOOL_DRAW_VERSION === 'number'
                    ? PDC_QSCHOOL_DRAW_VERSION
                    : 2;
            } else if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && !tNameLow.includes("play-off")) {
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
                participants = typeof buildContinentalQualifierDraw === 'function'
                    ? buildContinentalQualifierDraw(activeTournament, participants)
                    : shuffle(participants);
                tournamentRound = participants.length;

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
                participants = typeof buildWorldChampionshipDraw === 'function'
                    ? buildWorldChampionshipDraw(participants)
                    : shuffle(participants);

            } else if (isGrandSlamEvent) {
                // Zwycięzcy 16 rzeczywistych grup są już rozstawieni przez
                // initializeGrandSlamTournament() w drabince Last 16.
                participants = tournamentBracket;

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
            
            } else if (isEuropeanChampionship) {
                participants = typeof buildEuropeanChampionshipDraw === 'function'
                    ? buildEuropeanChampionshipDraw(participants)
                    : participants;
                activeTournament.europeanChampionshipDrawVersion = typeof EUROPEAN_CHAMPIONSHIP_DRAW_VERSION === 'number'
                    ? EUROPEAN_CHAMPIONSHIP_DRAW_VERSION
                    : 1;

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
                if (specialTournamentOutcome === 'pdcQSchool') {
                    concludePdcQSchoolEvent(false);
                    return;
                }
                if (specialTournamentOutcome === 'pdcTourCardQualifier') {
                    concludePdcTourCardQualifierEvent(false);
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

        function concludePdcQSchoolEvent(showOutcome = true) {
            if (typeof isPdcQSchoolTournament !== 'function' || !isPdcQSchoolTournament(activeTournament)) return null;
            const qSchoolTournament = activeTournament;
            const playerQualified = player?.hasTourCard === true && player.tourCardSource === 'qschool';
            qSchoolTournament.completed = true;
            qSchoolTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            const tile = document.getElementById('tile-tournament');
            if (tile) tile.style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);
            if (showOutcome && typeof getPdcTourCardOutcomeMessage === 'function') {
                alert(getPdcTourCardOutcomeMessage(player));
            }
            return { playerQualified, tournament: qSchoolTournament };
        }

        function concludePdcTourCardQualifierEvent(showOutcome = true) {
            if (typeof isPdcTourCardQualifierTournament !== 'function'
                || !isPdcTourCardQualifierTournament(activeTournament)) return null;
            const qualifierTournament = activeTournament;
            const message = showOutcome && typeof getPdcTourCardQualifierOutcomeMessage === 'function'
                ? getPdcTourCardQualifierOutcomeMessage(qualifierTournament, player)
                : '';
            qualifierTournament.completed = true;
            qualifierTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            const tile = document.getElementById('tile-tournament');
            if (tile) tile.style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);
            if (message) alert(message);
            return { tournament: qualifierTournament };
        }
        

       function showBracket() {
            document.getElementById('t-btn-play-match').onclick = closeBracketAndPlay;
            document.getElementById('t-btn-sim-round').onclick = simulateNextRound;
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament');
            if (simulateTournamentButton) simulateTournamentButton.onclick = simulateRemainingTournament;
            document.getElementById('t-btn-play-match').innerText = t('t-btn-play-match');
            document.getElementById('t-btn-sim-round').innerText = t('t-btn-sim-round');
            if (simulateTournamentButton) simulateTournamentButton.innerText = t('t-btn-sim-tournament');
            document.getElementById('bracket-title').innerText = `🏆 ${t('t-bracket')}: ${getRoundName(tournamentRound)}`;
            const list = document.getElementById('bracket-list'); list.innerHTML = "";
            
            let isPlayerInRound = false;

            for(let i = 0; i < tournamentBracket.length; i += 2) {
                let p1 = tournamentBracket[i]; let p2 = tournamentBracket[i+1];
                let isPlayerMatch = isCurrentPlayer(p1) || isCurrentPlayer(p2);
                const watchedResult = typeof getSpectatedTournamentMatchResult === 'function'
                    ? getSpectatedTournamentMatchResult(p1, p2, tournamentRound, false)
                    : null;
                const canWatchMatch = !isPlayerMatch && !p1?.isBye && !p2?.isBye;
                const watchControl = watchedResult
                    ? `<div style="display:flex; flex-direction:column; align-items:center; min-width:155px; gap:3px;">
                        <button class="btn-sign" disabled style="background:#34495e; margin:0;">✓ ${watchedResult.p1Score}:${watchedResult.p2Score}</button>
                        <small style="color:#bdc3c7;">${t('t-avg-short')} ${watchedResult.p1Avg} – ${watchedResult.p2Avg}</small>
                    </div>`
                    : (canWatchMatch
                        ? `<button class="btn-sign" onclick="startSpectatingTournamentMatch(${i})" style="background:#8e44ad; margin:0; min-width:155px;">👁 ${t('t-btn-watch-match')}</button>`
                        : '');
                
                if (isPlayerMatch) isPlayerInRound = true;

                list.innerHTML += `<div class="bracket-match ${isPlayerMatch ? 'player-match' : ''}">
                    <div style="flex: 1; text-align: left;">${isCurrentPlayer(p1) ? getFlagImg(player.country) : getFlagImg(p1.country)} ${escapeHtml(p1.name)} <span style="color:#bdc3c7; font-size:12px;">(OVR ${getDisplayedOvr(p1)})</span></div>
                    <div class="bracket-vs" style="flex: 0 0 40px; text-align: center;">VS</div>
                    <div style="flex: 1; text-align: right;">${isCurrentPlayer(p2) ? getFlagImg(player.country) : getFlagImg(p2.country)} ${escapeHtml(p2.name)} <span style="color:#bdc3c7; font-size:12px;">(OVR ${getDisplayedOvr(p2)})</span></div>
                    ${watchControl}
                </div>`;
            }

            // Zarządzanie przyciskami w zależności od tego, czy gracz nadal jest w turnieju
            if (isPlayerInRound) {
                document.getElementById('t-btn-play-match').style.display = 'block';
                document.getElementById('t-btn-sim-round').style.display = 'none';
                if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
            } else {
                document.getElementById('t-btn-play-match').style.display = 'none';
                document.getElementById('t-btn-sim-round').style.display = 'block';
                if (simulateTournamentButton) simulateTournamentButton.style.display = 'block';
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
            if (specialTournamentOutcome === 'pdcQSchool') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludePdcQSchoolEvent(true);
                showTournamentEnd();
                return;
            }
            if (specialTournamentOutcome === 'pdcTourCardQualifier') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludePdcTourCardQualifierEvent(true);
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
    const p1PeakPerformance = typeof rollAiPeakMatchPerformance === 'function'
        ? rollAiPeakMatchPerformance(p1)
        : null;
    const p2PeakPerformance = typeof rollAiPeakMatchPerformance === 'function'
        ? rollAiPeakMatchPerformance(p2)
        : null;
    let p1Chance = getTournamentWinChance(p1, p2);
    p1Chance = Math.max(0.05, Math.min(0.95, p1Chance +
        (((p1PeakPerformance?.ratingBoost || 0) - (p2PeakPerformance?.ratingBoost || 0)) / 100)));
    let p1Legs = 0, p2Legs = 0, p1Sets = 0, p2Sets = 0;

    let isSets = matchFormat.type === 'sets';
    let targetLegs = matchFormat.legsToWin || 6;
    let targetSets = matchFormat.setsToWin || 3;
    let legsPerSet = matchFormat.legsPerSet || 3;

    // Szybka matematyczna symulacja meczu leg po legu
    while (true) {
        if (Math.random() < p1Chance) p1Legs++; else p2Legs++;

        if (isSets) {
            const isDecidingSet = matchFormat.decidingSetWinByTwo &&
                p1Sets === targetSets - 1 && p2Sets === targetSets - 1;
            const legDifference = Math.abs(p1Legs - p2Legs);
            const setHasLegWinner = p1Legs >= legsPerSet || p2Legs >= legsPerSet;

            if (isDecidingSet && matchFormat.decidingSetSuddenDeathAt &&
                p1Legs === matchFormat.decidingSetSuddenDeathAt &&
                p2Legs === matchFormat.decidingSetSuddenDeathAt) {
                // Sudden death rozstrzyga set i tym samym cały mecz.
                if (Math.random() < p1Chance) p1Sets++; else p2Sets++;
                p1Legs = 0;
                p2Legs = 0;
            } else if (setHasLegWinner && (!isDecidingSet || legDifference >= 2)) {
                if (p1Legs > p2Legs) p1Sets++;
                else p2Sets++;
                p1Legs = 0;
                p2Legs = 0;
            }
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

    // Wybitny występ AI ma odzwierciedlenie zarówno w większej szansie na wygraną,
    // jak i w średniej widocznej w wynikach symulacji.
    const getSimulatedAverage = (baseAverage, won, peakPerformance) => {
        const regularAverage = baseAverage + (Math.random() * 9 - 4) + (won ? 2 : 0);
        const exceptionalAverage = peakPerformance
            ? Math.max(regularAverage, peakPerformance.averageFloor)
            : regularAverage;
        return Math.max(45, Math.min(125, exceptionalAverage)).toFixed(2);
    };
    let p1Avg = getSimulatedAverage(p1BaseAvg, p1Won, p1PeakPerformance);
    let p2Avg = getSimulatedAverage(p2BaseAvg, !p1Won, p2PeakPerformance);

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
            const isQSchoolEvent = typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(activeTournament);
            const isTourCardQualifierEvent = typeof isPdcTourCardQualifierTournament === 'function'
                && isPdcTourCardQualifierTournament(activeTournament);
            const isNonPrizeQualifier = isContinentalQualifier || isWorldMastersFinalsQualifier || isQSchoolEvent || isTourCardQualifierEvent;
            let prize = isNonPrizeQualifier ? 0 : getPrizeMoney(activeTournament.name, tournamentRound, false);

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
                    if (!isNonPrizeQualifier) awardPrizeMoney(loser, prize, activeTournament.name); 
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
                    let matchRes = typeof resolveTournamentAiMatch === 'function'
                        ? resolveTournamentAiMatch(p1, p2, format, tournamentRound)
                        : simulateAImatch(p1, p2, format);
                    
                    winner = matchRes.winner; 
                    loser = matchRes.loser;
                    
                    // ZMIANA: Zapisanie wyniku meczu AI do wyciągniętych wyżej zmiennych (zawsze wyższa dla zwycięzcy)
                    matchWScore = Math.max(matchRes.p1Score, matchRes.p2Score);
                    matchLScore = Math.min(matchRes.p1Score, matchRes.p2Score);

                    nextRoundBracket.push(winner);
                    if (!isNonPrizeQualifier) awardPrizeMoney(loser, prize, activeTournament.name);
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

                if (!isNonPrizeQualifier) {
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
            if (isContinentalQualifier && tournamentBracket.length <= (
                typeof getContinentalQualifierPlaces === 'function'
                    ? getContinentalQualifierPlaces(activeTournament)
                    : 16
            )) {
                completeContinentalTourQualifier(activeTournament, tournamentBracket);
                return true;
            }
            if (isWorldMastersFinalsQualifier && tournamentRound === 4) {
                if (typeof completeWorldMastersFinalsQualifier === 'function') {
                    completeWorldMastersFinalsQualifier(activeTournament, tournamentBracket);
                }
                return 'worldMastersFinalsQualifier';
            }
            if (isQSchoolEvent && tournamentRound === 64) {
                if (typeof completePdcQSchool === 'function') {
                    completePdcQSchool(activeTournament, tournamentBracket, currentDate);
                }
                return 'pdcQSchool';
            }
            if (isTourCardQualifierEvent) {
                const qualifyingPlaces = Math.max(1, Number(activeTournament.qualifyingPlaces) || 8);
                if (tournamentRound === qualifyingPlaces) {
                    if (typeof completePdcTourCardQualifier === 'function') {
                        completePdcTourCardQualifier(activeTournament, tournamentBracket);
                    }
                    return 'pdcTourCardQualifier';
                }
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
            const opponentPeakPerformance = typeof rollAiPeakMatchPerformance === 'function'
                ? rollAiPeakMatchPerformance(opponent)
                : null;

            let starter = Math.random() < 0.5 ? 'p1' : 'p2';
            currentMatch = { 
                vsAI: true, opponent: opponent, 
                p1Score: 501, p2Score: 501, p1Legs: 0, p2Legs: 0, p1Sets: 0, p2Sets: 0, totalLegsPlayed: 0,
                legsToWin: matchFormat.type === 'sets' ? matchFormat.legsPerSet : matchFormat.legsToWin,
                matchFormat: matchFormat, turn: starter, startingPlayer: starter, dartsThrown: 0, isTurnLocked: false, p1TurnStartScore: 501, p2TurnStartScore: 501, isTournament: true, isRivalryMatch: isRivalryMatch, rivalryModifier: rivalryModifier, opponentPeakPerformance,
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

        
