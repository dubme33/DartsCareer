// Wspólna, bezstanowa selekcja dla drabinki i podglądu kwalifikacji.
function getRankingQualificationGroups(tournament, candidates) {
    const name = String(tournament?.name || '').toLowerCase();
    const rank = property => [...candidates].sort((a, b) => (Number(b[property]) || 0) - (Number(a[property]) || 0));
    const group = (key, places, players) => ({ key, places, players });
    if (name.includes('players championship finals') || name.includes('pro players finals')) {
        return [group('pc64', 64, rank('pcPrizeMoney').slice(0, 64))];
    }
    if (isEuropeanChampionshipTournament(tournament)) {
        return [group('et32', 32, getEuropeanTourOrderOfMerit(candidates).slice(0, 32))];
    }
    if (name.includes('uk open') || name.includes('british open')) {
        const ranked = rank('prizeMoney');
        const holders = ranked.filter(p => p.hasTourCard === true).slice(0, 128);
        return [group('card128', 128, holders),
            group('reserves', 128 - holders.length, ranked.filter(p => p.hasTourCard !== true).slice(0, 128 - holders.length))];
    }
    if (name.includes('matchplay') || name.includes('grand prix')) {
        const seeds = rank('prizeMoney').slice(0, 16);
        const selected = new Set(seeds);
        return [group('oom16', 16, seeds),
            group('pt16', 16, rank('proTourPrizeMoney').filter(p => !selected.has(p)).slice(0, 16))];
    }
    return null;
}

const checkoutGuide = {
            170: "T20 T20 BULL", 167: "T20 T19 BULL", 164: "T20 T18 BULL", 161: "T20 T17 BULL",
            160: "T20 T20 D20", 158: "T20 T20 D19", 157: "T20 T19 D20", 156: "T20 T20 D18",
            155: "T20 T19 D19", 154: "T20 T18 D20", 153: "T20 T19 D18", 152: "T20 T20 D16",
            151: "T20 T17 D20", 150: "T20 T18 D18", 149: "T20 T19 D16", 148: "T20 T16 D20",
            147: "T20 T17 D18", 146: "T20 T18 D16", 145: "T20 T15 D20", 144: "T20 T20 D12",
            143: "T20 T17 D16", 142: "T20 T14 D20", 141: "T20 T19 D12", 140: "T20 T20 D10",
            139: "T20 T13 D20", 138: "T20 T18 D12", 137: "T20 T19 D10", 136: "T20 T20 D8",
            135: "T20 T17 D12", 134: "T20 T14 D16", 133: "T20 T19 D8",  132: "BULL BULL D16",
            131: "T20 T13 D16", 130: "T20 T20 D5",  129: "T19 T16 D12", 128: "T18 T14 D16",
            127: "T20 T17 D8",  126: "T19 T19 D6",  125: "T18 T13 D16", 124: "T20 T16 D8",
            123: "T19 T16 D9",  122: "T18 T20 D4",  121: "T20 T11 D14", 120: "T20 20 D20",
            119: "T19 T10 D16", 118: "T20 18 D20",  117: "T20 17 D20",  116: "T20 16 D20",
            115: "T20 15 D20",  114: "T20 14 D20",  113: "T20 13 D20",  112: "T20 12 D20",
            111: "T20 11 D20",  110: "T20 10 D20",  109: "T19 12 D20",  108: "T20 16 D16",
            107: "T19 10 D20",  106: "T20 10 D18",  105: "T19 16 D16",  104: "T18 10 D20",
            103: "T19 10 D18",  102: "T20 10 D16",  101: "T17 10 D20",  100: "T20 D20",
            99:  "T19 10 D16",  98:  "T20 D19",     97:  "T19 D20",     96:  "T20 D18",
            95:  "T19 D19",     94:  "T18 D20",     93:  "T19 D18",     92:  "T20 D16",
            91:  "T17 D20",     90:  "T18 D18",     89:  "T19 D16",     88:  "T16 D20",
            87:  "T17 D18",     86:  "T18 D16",     85:  "T15 D20",     84:  "T20 D12",
            83:  "T17 D16",     82:  "BULL D16",    81:  "T19 D12",     80:  "T20 D10",
            79:  "T13 D20",     78:  "T18 D12",     77:  "T19 D10",     76:  "T20 D8",
            75:  "T17 D12",     74:  "T14 D16",     73:  "T19 D8",      72:  "T16 D12",
            71:  "T13 D16",     70:  "T18 D8",      69:  "T15 D12",     68:  "T20 D4",
            67:  "T17 D8",      66:  "T10 D18",     65:  "T19 D4",      64:  "T16 D8",
            63:  "T13 D12",     62:  "T10 D16",     61:  "T15 D8",      60:  "20 D20",
            59:  "19 D20",      58:  "18 D20",      57:  "17 D20",      56:  "16 D20",
            55:  "15 D20",      54:  "14 D20",      53:  "13 D20",      52:  "12 D20",
            51:  "11 D20",      50:  "BULL",        49:  "9 D20",       48:  "16 D16",
            47:  "15 D16",      46:  "14 D16",      45:  "13 D16",      44:  "12 D16",
            43:  "11 D16",      42:  "10 D16",      41:  "9 D16",       40:  "D20",
            39:  "7 D16",       38:  "D19",         37:  "5 D16",       36:  "D18",
            35:  "3 D16",       34:  "D17",         33:  "1 D16",       32:  "D16",
            31:  "15 D8",       30:  "D15",         29:  "13 D8",       28:  "D14",
            27:  "11 D8",       26:  "D13",         25:  "9 D8",        24:  "D12",
            23:  "7 D8",        22:  "D11",         21:  "5 D8",        20:  "D10",
            19:  "3 D8",        18:  "D9",          17:  "1 D8",        16:  "D8",
            15:  "7 D4",        14:  "D7",          13:  "5 D4",        12:  "D6",
            11:  "3 D4",        10:  "D5",          9:   "1 D4",        8:   "D4",
            7:   "3 D2",        6:   "D3",          5:   "1 D2",        4:   "D2",
            3:   "1 D1",        2:   "D1"
        };

        function getCheckoutPath(score) {
            if (score > 170 || [169, 168, 166, 165, 163, 162, 159].includes(score)) return "";
            if (checkoutGuide[score]) return checkoutGuide[score];
            return "";
        }

        function getRoundName(r) {
            if (typeof isContinentalQualifierTournament === 'function'
                && isContinentalQualifierTournament(typeof activeTournament !== 'undefined' ? activeTournament : null)
                && typeof getContinentalQualifierPath === 'function'
                && getContinentalQualifierPath(activeTournament) === 'card'
                && [80, 40, 20, 10].includes(r)) return `Top ${r}`;
            if(r === 256) return 'Last 256';
            if(r === 128) return t('t-r-128');
            if(r === 64) return t('t-r-64');
            if(r === 32) return t('t-r-32'); 
            if(r === 16) return t('t-r-16');
            if(r === 8) return t('t-r-8'); 
            if(r === 4) return t('t-r-4');
            if(r === 2) return t('t-r-2'); 
            return "";
        }

        function getTournamentMatchFormat(tournament, round) {
            const name = tournament ? tournament.name : "";

            if (typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(tournament)) {
                return { type: 'legs', legsToWin: 11 };
            }
            if (typeof isPdcTourCardQualifierTournament === 'function' && isPdcTourCardQualifierTournament(tournament)) {
                return { type: 'legs', legsToWin: 6 };
            }

            if (typeof isWorldMastersTournament === 'function' &&
                (isWorldMastersTournament(tournament) || isWorldMastersFinalsTournament(tournament) || isWorldMastersFinalsQualifierTournament(tournament))) {
                return getWorldMastersMatchFormat(tournament, round);
            }

            if (typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(tournament)) {
                return { type: 'legs', legsToWin: 6 };
            }

            if (name.includes("Global Darts League - Play-offs") || (name.includes("Premier") && name.includes("Play-offs"))) {
                if (round === 4) return { type: 'legs', legsToWin: 10 }; // Semi
                return { type: 'legs', legsToWin: 11 }; // Finał
            }
            if (name.includes("Global Darts League") || name.includes("Premier")) {
                return { type: 'legs', legsToWin: 6 }; // Zwykła noc
            }
            if (name.includes("World Darts Championship") || name.includes("Global Darts Championship")) {
                const setsToWin = round >= 64 ? 3 : round >= 16 ? 4 : round === 8 ? 5 : round === 4 ? 6 : 7;
                return {
                    type: 'sets',
                    setsToWin,
                    legsPerSet: 3,
                    decidingSetWinByTwo: true,
                    decidingSetSuddenDeathAt: 5
                };
            }
            if (name.includes("World Matchplay") || name.includes("Matchplay")) {
                if (round === 32) return { type: 'legs', legsToWin: 10, winByTwo: true, suddenDeathAt: 12 };
                if (round === 16) return { type: 'legs', legsToWin: 11 };
                if (round === 8) return { type: 'legs', legsToWin: 16 };
                if (round === 4) return { type: 'legs', legsToWin: 17 };
                return { type: 'legs', legsToWin: 18 };
            }
            if (name.includes("Grand Prix")) {
                // World Grand Prix: all legs are best of five under the tournament's DIDO rules.
                // Round 1: Bo3 sets; R2/QF: Bo5; SF: Bo9; Final: Bo11.
                const setsToWin = round === 32 ? 2 : (round === 16 || round === 8) ? 3 : round === 4 ? 5 : 6;
                return { type: 'sets', setsToWin, legsPerSet: 3 };
            }
            if (name.includes("Grand Slam") || name.includes("Champion's Slam")) {
                if (round === 32) return { type: 'legs', legsToWin: 5 };
                if (round === 16) return { type: 'legs', legsToWin: 10 };
                return { type: 'legs', legsToWin: 16 };
            }
            if (name.includes("Players Championship Finals") || name.includes("Pro Players Finals")) {
                if (round >= 32) return { type: 'legs', legsToWin: 6 };
                if (round >= 8) return { type: 'legs', legsToWin: 10 };
                return { type: 'legs', legsToWin: 11 };
            }
            if (name.includes("Players Championship") || name.includes("Pro Players Cup")) {
                if (round >= 8) return { type: 'legs', legsToWin: 6 };
                if (round === 4) return { type: 'legs', legsToWin: 7 };
                return { type: 'legs', legsToWin: 8 };
            }
            if (name.includes("UK Open") || name.includes("British Open")) {
                if (round >= 32) return { type: 'legs', legsToWin: 6 };
                if (round >= 8) return { type: 'legs', legsToWin: 10 };
                return { type: 'legs', legsToWin: 11 };
            }
            if (typeof isEuropeanChampionshipTournament === 'function' && isEuropeanChampionshipTournament(tournament)) {
                if (round === 32) return { type: 'legs', legsToWin: 6 };
                if (round === 16 || round === 8) return { type: 'legs', legsToWin: 10 };
                return { type: 'legs', legsToWin: 11 };
            }
            if (name.includes("(ET") || name.includes("European Tour") || name.includes("Continental Tour")) {
                if (round >= 8) return { type: 'legs', legsToWin: 6 };
                if (round === 4) return { type: 'legs', legsToWin: 7 };
                return { type: 'legs', legsToWin: 8 };
            }

            return { type: 'legs', legsToWin: 6 };
        }

        function getMatchFormatLabel(format) {
            if (format.type === 'sets') {
                let label = `${t('t-fmt-sets-1')} ${format.setsToWin} ${t('t-fmt-sets-2')} ${format.legsPerSet} ${t('t-fmt-sets-3')}`;
                if (format.decidingSetWinByTwo) {
                    label += `; ${t('t-fmt-deciding-set-sd')} ${format.decidingSetSuddenDeathAt}:${format.decidingSetSuddenDeathAt}`;
                }
                return label;
            }
            let label = `${t('t-fmt-legs-1')} ${format.legsToWin} ${t('t-fmt-legs-2')}`;
            if (format.winByTwo) label += `, przewaga 2 legów; nagła śmierć przy ${format.suddenDeathAt}:${format.suddenDeathAt}`; // tę część na razie zostawmy, w przyszłości można ją łatwo rozbudować
            return label;
        }

        function isMatchFinished(match = currentMatch) {
            if (match.matchFormat && match.matchFormat.type === 'sets') {
                return match.p1Sets >= match.matchFormat.setsToWin || match.p2Sets >= match.matchFormat.setsToWin;
            }

            if (match.matchFormat && match.matchFormat.winByTwo) {
                const legDifference = Math.abs(match.p1Legs - match.p2Legs);
                return (match.p1Legs >= match.legsToWin || match.p2Legs >= match.legsToWin) && legDifference >= 2;
            }

            return match.p1Legs >= match.legsToWin || match.p2Legs >= match.legsToWin;
        }

        
