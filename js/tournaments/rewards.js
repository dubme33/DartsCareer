const PLAYERS_CHAMPIONSHIP_PRIZE_MONEY = Object.freeze({
    winner: 15000,
    2: 10000,
    4: 6500,
    8: 4000,
    16: 3000,
    32: 2000,
    64: 1250,
    128: 0
});

const GLOBAL_LEAGUE_PLACEMENT_PRIZES = Object.freeze({ 5: 95000, 6: 90000, 7: 85000, 8: 80000 });

const GRAND_SLAM_PRIZE_MONEY = Object.freeze({
    winner: 200000, 2: 100000, 4: 60000, 8: 35000, 16: 20000,
    groupSecond: 12500, groupThird: 5000
});
const GRAND_SLAM_PRIZE_FUND = GRAND_SLAM_PRIZE_MONEY.winner + GRAND_SLAM_PRIZE_MONEY[2]
    + 2 * GRAND_SLAM_PRIZE_MONEY[4] + 4 * GRAND_SLAM_PRIZE_MONEY[8] + 8 * GRAND_SLAM_PRIZE_MONEY[16]
    + 16 * (GRAND_SLAM_PRIZE_MONEY.groupSecond + GRAND_SLAM_PRIZE_MONEY.groupThird);

function getGrandSlamGroupPrizeMoney(position) {
    return position === 2 ? GRAND_SLAM_PRIZE_MONEY.groupSecond
        : position === 3 ? GRAND_SLAM_PRIZE_MONEY.groupThird : 0;
}

function getPrizeMoney(tName, round, won) {
    if (typeof isUKOpenTournament === 'function' && isUKOpenTournament(tName)) {
        return getUKOpenPrizeMoney(round, won);
    } else if (typeof isCrownMastersTournament === 'function'
        && (isCrownMastersTournament(tName) || isCrownMastersQualifierTournament(tName))) {
        return getCrownMastersPrizeMoney(tName, round, won);
    } else if (typeof isDevelopmentTourTournament === 'function' && isDevelopmentTourTournament(tName)) {
        return typeof getDevelopmentTourEventPrize === 'function'
            ? getDevelopmentTourEventPrize(round, won)
            : 0;
    } else if (typeof isChallengeTourTournament === 'function' && isChallengeTourTournament(tName)) {
        return typeof getChallengeTourEventPrize === 'function'
            ? getChallengeTourEventPrize(round, won)
            : 0;
    } else if (typeof isWorldMastersName === 'function' && isWorldMastersName(tName)) {
        return getWorldMastersPrizeMoney(tName, round, won);
    } else if (tName.includes("World Darts Championship") || tName.includes("Global Darts Championship")) {
        if(won && round === 2) return 1000000; if(!won && round === 2) return 400000;
        if(!won && round === 4) return 200000; if(!won && round === 8) return 100000;
        if(!won && round === 16) return 50000; if(!won && round === 32) return 35000;
        if(!won && round === 64) return 25000; if(!won && round === 128) return 15000;
    } else if (tName.includes("Matchplay")) {
        if(won && round === 2) return 225000; if(!won && round === 2) return 125000;
        if(!won && round === 4) return 60000; if(!won && round === 8) return 30000;
        if(!won && round === 16) return 15000; if(!won && round === 32) return 10000;
    } else if (tName.includes("Grand Prix")) {
        if(won && round === 2) return 120000; if(!won && round === 2) return 60000;
        if(!won && round === 4) return 40000; if(!won && round === 8) return 25000;
        if(!won && round === 16) return 15000; if(!won && round === 32) return 7500;
    } else if (tName.includes("Grand Slam") || tName.includes("Champion's Slam")) {
        return won && round === 2 ? GRAND_SLAM_PRIZE_MONEY.winner : GRAND_SLAM_PRIZE_MONEY[round] || 0;
    } else if (tName.includes("UK Open") || tName.includes("British Open")) {
        if(won && round === 2) return 120000; if(!won && round === 2) return 60000;
        if(!won && round === 4) return 35000; if(!won && round === 8) return 20000;
        if(!won && round === 16) return 12500; if(!won && round === 32) return 7500;
        if(!won && round === 64) return 3000; if(!won && round === 96) return 2000;
        if(!won && round === 128) return 1250; if(!won && round === 160) return 0;
    } else if (tName.includes("Players Championship Finals") || tName.includes("Pro Players Finals")) {
        if(won && round === 2) return 120000; if(!won && round === 2) return 60000;
        if(!won && round === 4) return 30000; if(!won && round === 8) return 20000;
        if(!won && round === 16) return 10000; if(!won && round === 32) return 6500;
        if(!won && round === 64) return 3000;
    } else if (tName.includes("Players Championship") || tName.includes("Pro Players Cup")) {
        if (won && round === 2) return PLAYERS_CHAMPIONSHIP_PRIZE_MONEY.winner;
        return PLAYERS_CHAMPIONSHIP_PRIZE_MONEY[round] || 0;
    } else if (tName.includes("Global Darts League - Play-offs") || (tName.includes("Premier") && tName.includes("Play-offs"))) {
        if(won && round === 2) return 350000;
        if(!won && round === 2) return 170000;
        if(!won && round === 4) return 110000;
    } else if (tName.includes("Global Darts League") || tName.includes("Premier")) {
        if(won && round === 2) return 10000; // Tygodniowy bonus
        return 0; // Pozostali nic nie dostają co tydzień
    } else if (tName.includes("European Championship") || tName.includes("Continental Championship")) {
        // European Championship: 32-player fixed bracket, ranked in the main OOM.
        if (won && round === 2) return 150000;
        if (!won && round === 2) return 80000;
        if (!won && round === 4) return 50000;
        if (!won && round === 8) return 35000;
        if (!won && round === 16) return 20000;
        if (!won && round === 32) return 7500;
        return 0;
    } else if (tName.includes("European Tour") || tName.includes("Continental Tour")) {
        // European / Continental Tour: drabinka 64 zawodników, z wolnymi losami dla 16 rozstawionych.
        if (won && round === 2) return 35000;
        if (!won && round === 2) return 15000;
        if (!won && round === 4) return 10000;
        if (!won && round === 8) return 8000;
        if (!won && round === 16) return 5000;
        if (!won && round === 32) return 3500;
        if (!won && round === 64) return 2000;
        return 0;
    } else {
        // Domyślna tabela dla turniejów niestandardowych.
        if(won && round === 2) return 35000; if(!won && round === 2) return 15000;
        if(!won && round === 4) return 10000; if(!won && round === 8) return 8000;
        if(!won && round === 16) return 5000; if(!won && round === 32) return 35000;
        return 2000;
    }
}

function getTournamentPrizePayout(candidate, amount) {
    const grossAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
    const taxRate = typeof getCareerDifficultyTournamentPrizeTaxRate === 'function'
        ? getCareerDifficultyTournamentPrizeTaxRate(candidate) : 0;
    const taxAmount = Math.round(grossAmount * taxRate * 100) / 100;
    const netAmount = taxAmount ? Math.round((grossAmount - taxAmount) * 100) / 100 : grossAmount;
    return { grossAmount, taxRate, taxAmount, netAmount };
}

function payCareerTournamentPrizeMoney(candidate, amount, tournament) {
    const payout = getTournamentPrizePayout(candidate, amount);
    if (!isCurrentPlayer(candidate) || payout.grossAmount <= 0) return payout;
    player.budget = (Number(player.budget) || 0) + payout.netAmount;
    if (typeof recordTournamentCash === 'function') {
        recordTournamentCash(tournament, 'prize', payout.grossAmount);
        recordTournamentCash(tournament, 'tax', payout.taxAmount);
    }
    return payout;
}

        function awardPrizeMoney(p, amount, tName, { countTowardsRankings = true } = {}) {
            if (!p || !Number.isFinite(amount) || amount <= 0) return;
            tName = String(tName || '');
            const isChallengeTourEvent = typeof isChallengeTourTournament === 'function'
                && isChallengeTourTournament(tName);
            const isDevelopmentTourEvent = typeof isDevelopmentTourTournament === 'function'
                && isDevelopmentTourTournament(tName);
            const isSecondaryTourEvent = isChallengeTourEvent || isDevelopmentTourEvent;
            payCareerTournamentPrizeMoney(p, amount, tName);
            if (typeof recordSeasonArchivePrize === 'function') {
                recordSeasonArchivePrize(p, amount, tName, {
                    countTowardsRankings: countTowardsRankings && !isSecondaryTourEvent
                });
            }
            
            // Zabezpieczenie przed uszkodzonym zapisem (przywraca 0 zamiast błędu)
            if (typeof p.prizeMoney !== 'number' || isNaN(p.prizeMoney)) p.prizeMoney = 0;
            if (typeof p.proTourPrizeMoney !== 'number' || isNaN(p.proTourPrizeMoney)) p.proTourPrizeMoney = 0;
            if (typeof p.pcPrizeMoney !== 'number' || isNaN(p.pcPrizeMoney)) p.pcPrizeMoney = 0;
            if (typeof p.europeanTourPrizeMoney !== 'number' || isNaN(p.europeanTourPrizeMoney)) p.europeanTourPrizeMoney = 0;

            // Rising Stars Circuit posiada własną klasyfikację finansową. Nagrody
            // nie zasilają głównego OOM, ProTour OOM, PC OOM ani European Tour OOM.
            if (isChallengeTourEvent) {
                if (typeof awardChallengeTourPrizeMoney === 'function') {
                    awardChallengeTourPrizeMoney(p, amount);
                } else {
                    p.challengeTourPrizeMoney = (Number(p.challengeTourPrizeMoney) || 0) + amount;
                }
                return;
            }

            // Future Champions Circuit prowadzi odrębny ranking zarobkowy.
            // Wypłaty nie zmieniają żadnego standardowego Order of Merit.
            if (isDevelopmentTourEvent) {
                if (typeof awardDevelopmentTourPrizeMoney === 'function') {
                    awardDevelopmentTourPrizeMoney(p, amount);
                } else {
                    p.developmentTourPrizeMoney = (Number(p.developmentTourPrizeMoney) || 0) + amount;
                }
                return;
            }

            // Turnieje nierankingowe: nagroda trafia wyłącznie do budżetu gracza.
            if (tName.includes("Global Darts League") || tName.includes("Premier")) {
                return;
            }
            if (typeof isWorldMastersName === 'function' && isWorldMastersName(tName)
                && !(typeof isCrownMastersTournament === 'function'
                    && (isCrownMastersTournament(tName) || isCrownMastersQualifierTournament(tName)))) {
                return;
            }

            // Wypłata może być wyłącznie faktycznym zarobkiem (bez wpływu na
            // dowolny ranking), np. dla rozstawionych European Tour odpadających
            // w swoim pierwszym meczu po wolnym losie.
            if (!countTowardsRankings) {
                return;
            }

            if (!p.historyPT) p.historyPT = {};
            if (!p.historyMain) p.historyMain = {};

            const isProTour = typeof isProTourRankingTournament === 'function'
                ? isProTourRankingTournament(tName)
                : (tName.includes("European Tour") || tName.includes("Continental Tour") ||
                    ((tName.includes("Players Championship") || tName.includes("Pro Players Cup")) && !tName.includes("Final")));
            const isPC = typeof isPlayersChampionshipTournament === 'function'
                ? isPlayersChampionshipTournament(tName)
                : ((tName.includes("Players Championship") || tName.includes("Pro Players Cup")) && !tName.includes("Final"));
            const isMainRanking = typeof isMainOrderOfMeritRankingTournament === 'function'
                ? isMainOrderOfMeritRankingTournament(tName)
                : isProTour || tName.includes("World Darts Championship") || tName.includes("Global Darts Championship")
                    || tName.includes("UK Open") || tName.includes("British Open") || tName.includes("Matchplay")
                    || tName.includes("Grand Prix") || tName.includes("European Championship")
                    || tName.includes("Continental Championship") || tName.includes("Grand Slam")
                    || tName.includes("Champion's Slam") || tName.includes("Players Championship Finals")
                    || tName.includes("Pro Players Finals");

            // --- 1. RANKING PROTOUR (kroczące 52 tygodnie) ---
            if (isProTour) {
                if (typeof awardProTourOrderOfMeritPrizeMoney === 'function') {
                    awardProTourOrderOfMeritPrizeMoney(p, amount, tName, typeof currentDate !== 'undefined' ? currentDate : null);
                } else {
                    p.proTourPrizeMoney += amount;
                    p.historyPT[tName] = (Number(p.historyPT[tName]) || 0) + amount;
                }
            }

            // --- 2. GŁÓWNY ORDER OF MERIT (dokładne, kroczące dwa lata) ---
            if (isMainRanking) {
                if (typeof awardMainOrderOfMeritPrizeMoney === 'function') {
                    awardMainOrderOfMeritPrizeMoney(
                        p,
                        amount,
                        tName,
                        typeof currentDate !== 'undefined' ? currentDate : null
                    );
                } else {
                    p.prizeMoney += amount;
                    p.historyMain[tName] = (Number(p.historyMain[tName]) || 0) + amount;
                }
            }

            // --- 3. RANKING PLAYERS CHAMPIONSHIP (Resetowany co roku 1 stycznia!) ---
            if (isPC) {
                // Nie bronimy tu żadnych punktów - one tylko rosną przez cały rok.
                p.pcPrizeMoney += amount;
                if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('pc');
            }

            // European Tour OOM jest osobną, sezonową klasyfikacją służącą
            // wyłącznie do kwalifikacji do European Championship.
            if (typeof awardEuropeanTourOrderOfMeritPrizeMoney === 'function') {
                awardEuropeanTourOrderOfMeritPrizeMoney(p, amount, tName);
            }

        }

        
