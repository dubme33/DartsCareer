function getPrizeMoney(tName, round, won) {
    if (typeof isWorldMastersName === 'function' && isWorldMastersName(tName)) {
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
        if(won && round === 2) return 200000; if(!won && round === 2) return 100000;
        if(!won && round === 4) return 60000; if(!won && round === 8) return 35000;
        if(!won && round === 16) return 20000; if(!won && round === 32) return 10000;
    } else if (tName.includes("UK Open") || tName.includes("British Open")) {
        if(won && round === 2) return 120000; if(!won && round === 2) return 60000;
        if(!won && round === 4) return 35000; if(!won && round === 8) return 20000;
        if(!won && round === 16) return 12500; if(!won && round === 32) return 7500;
        if(!won && round === 64) return 3000; if(!won && round === 128) return 1250;
    } else if (tName.includes("Players Championship Finals") || tName.includes("Pro Players Finals")) {
        if(won && round === 2) return 120000; if(!won && round === 2) return 60000;
        if(!won && round === 4) return 30000; if(!won && round === 8) return 20000;
        if(!won && round === 16) return 10000; if(!won && round === 32) return 6500;
        if(!won && round === 64) return 3000;
    } else if (tName.includes("Players Championship") || tName.includes("Pro Players Cup")) {
        if(won && round === 2) return 15000; if(!won && round === 2) return 10000;
        if(!won && round === 4) return 6500; if(!won && round === 8) return 4000;
        if(!won && round === 16) return 3000; if(!won && round === 32) return 2000;
        if(!won && round === 64) return 1250; if(!won && round === 128) return 1000;
    } else if (tName.includes("Global Darts League - Play-offs") || (tName.includes("Premier") && tName.includes("Play-offs"))) {
        if(won && round === 2) return 350000;
        if(!won && round === 2) return 170000;
        if(!won && round === 4) return 110000;
    } else if (tName.includes("Global Darts League") || tName.includes("Premier")) {
        if(won && round === 2) return 10000; // Tygodniowy bonus
        return 0; // Pozostali nic nie dostają co tydzień
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

        function awardPrizeMoney(p, amount, tName) {
            if (!p || typeof amount !== 'number' || isNaN(amount) || amount <= 0) return;
            
            // Zabezpieczenie przed uszkodzonym zapisem (przywraca 0 zamiast błędu)
            if (typeof p.prizeMoney !== 'number' || isNaN(p.prizeMoney)) p.prizeMoney = 0;
            if (typeof p.proTourPrizeMoney !== 'number' || isNaN(p.proTourPrizeMoney)) p.proTourPrizeMoney = 0;
            if (typeof p.pcPrizeMoney !== 'number' || isNaN(p.pcPrizeMoney)) p.pcPrizeMoney = 0;
            if (typeof p.europeanTourPrizeMoney !== 'number' || isNaN(p.europeanTourPrizeMoney)) p.europeanTourPrizeMoney = 0;

            // Turnieje nierankingowe: nagroda trafia wyłącznie do budżetu gracza.
            if (tName.includes("Global Darts League") || tName.includes("Premier")) {
                if (isCurrentPlayer(p)) player.budget += amount;
                return;
            }
            if (typeof isWorldMastersName === 'function' && isWorldMastersName(tName)) {
                if (isCurrentPlayer(p)) player.budget += amount;
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

            // --- 1. RANKING PROTOUR (kroczące 52 tygodnie) ---
            if (isProTour) {
                if (typeof awardProTourOrderOfMeritPrizeMoney === 'function') {
                    awardProTourOrderOfMeritPrizeMoney(p, amount, tName, typeof currentDate !== 'undefined' ? currentDate : null);
                } else {
                    p.proTourPrizeMoney += amount;
                    p.historyPT[tName] = (Number(p.historyPT[tName]) || 0) + amount;
                }
            }

            // --- 2. GŁÓWNY ORDER OF MERIT (Kroczący 24-miesięczny / 2-letni) ---
            if (!p.historyMain[tName]) {
                let estimatedPast = Math.round(p.prizeMoney / 80);
                p.historyMain[tName] = [estimatedPast, estimatedPast]; 
            }

            let droppedMain = p.historyMain[tName].shift(); 
            p.prizeMoney = Math.max(0, p.prizeMoney - droppedMain) + amount;
            p.historyMain[tName].push(amount);

            // --- 3. RANKING PLAYERS CHAMPIONSHIP (Resetowany co roku 1 stycznia!) ---
            if (isPC) {
                // Nie bronimy tu żadnych punktów - one tylko rosną przez cały rok.
                p.pcPrizeMoney += amount;
            }

            // European Tour OOM jest osobną, sezonową klasyfikacją służącą
            // wyłącznie do kwalifikacji do European Championship.
            if (typeof awardEuropeanTourOrderOfMeritPrizeMoney === 'function') {
                awardEuropeanTourOrderOfMeritPrizeMoney(p, amount, tName);
            }

            if (isCurrentPlayer(p)) player.budget += amount;
        }

        
