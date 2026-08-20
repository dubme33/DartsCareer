function showRoundResults() {
            document.getElementById('t-tour-end-title').innerText = t('t-round-results');
            document.getElementById('results-content').innerHTML = currentRoundHTML;
            document.getElementById('t-btn-next-round').style.display = 'block';
            document.getElementById('t-btn-tour-back').style.display = 'none';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function showTournamentEnd() {
            document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
            document.getElementById('results-content').innerHTML = lastTournamentResults;
            document.getElementById('t-btn-next-round').style.display = 'none';
            document.getElementById('t-btn-tour-back').style.display = 'block';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function proceedToNextRound() {
            document.getElementById('results-modal').style.display = 'none';
            showBracket();
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

            if (name.includes("Global Darts League - Play-offs") || (name.includes("Premier") && name.includes("Play-offs"))) {
                if (round === 4) return { type: 'legs', legsToWin: 10 }; // Semi
                return { type: 'legs', legsToWin: 11 }; // Finał
            }
            if (name.includes("Global Darts League") || name.includes("Premier")) {
                return { type: 'legs', legsToWin: 6 }; // Zwykła noc
            }
            if (name.includes("World Darts Championship") || name.includes("Global Darts Championship")) {
                const setsToWin = round >= 64 ? 3 : round >= 16 ? 4 : round === 8 ? 5 : round === 4 ? 6 : 7;
                return { type: 'sets', setsToWin, legsPerSet: 3 };
            }
            if (name.includes("World Matchplay") || name.includes("Matchplay")) {
                if (round === 32) return { type: 'legs', legsToWin: 10, winByTwo: true, suddenDeathAt: 12 };
                if (round === 16) return { type: 'legs', legsToWin: 11 };
                if (round === 8) return { type: 'legs', legsToWin: 16 };
                if (round === 4) return { type: 'legs', legsToWin: 17 };
                return { type: 'legs', legsToWin: 18 };
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
            if (name.includes("(ET") || name.includes("European Tour") || name.includes("Continental Tour")) {
                if (round >= 8) return { type: 'legs', legsToWin: 6 };
                if (round === 4) return { type: 'legs', legsToWin: 7 };
                return { type: 'legs', legsToWin: 8 };
            }

            return { type: 'legs', legsToWin: 6 };
        }

        function getMatchFormatLabel(format) {
            if (format.type === 'sets') return `${t('t-fmt-sets-1')} ${format.setsToWin} ${t('t-fmt-sets-2')} ${format.legsPerSet} ${t('t-fmt-sets-3')}`;
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

        function startCrowd() {
            if(!crowdAudio) {
                let crowdSrc = moddedAssets.sounds["crowd"] || 'sounds/crowd.mp3';
                crowdAudio = new Audio(crowdSrc);
                crowdAudio.loop = true;
            }
            crowdAudio.volume = 0.15 * globalVolume;
            crowdAudio.play().catch(e => console.log("Crowd zablokowany", e));
        }

        function playMatchIntro(p1Name, p2Name) {
            isWalkonSkipped = false;
            
            // POPRAWKA: Zmienione ID przycisku na takie ze słownika
            let skipBtn = document.getElementById('t-btn-skip-walkon');
            if(skipBtn) skipBtn.style.display = 'inline-block';

            // NOWOŚĆ: Blokujemy rzucanie i resetujemy stoper AI na czas wejść!
            document.getElementById('throw-btn').disabled = true;
            clearTimeout(window.aiTimeout);

            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel(); 
            if(currentWalkonAudio) { currentWalkonAudio.pause(); currentWalkonAudio = null; }
            if(oppAudio) { oppAudio.pause(); oppAudio = null; }
            if(crowdAudio) { crowdAudio.pause(); }
            clearTimeout(walkonTimeout); clearInterval(walkonInterval);

            // Tłumaczenie państw na angielski dla płynniejszej wymowy callera
            const enCountries = { 
                "Polska": "Poland", "Anglia": "England", "Szkocja": "Scotland", "Walia": "Wales", "Irlandia Północna": "Northern Ireland", 
                "Holandia": "the Netherlands", "Niemcy": "Germany", "Irlandia": "Ireland", "Belgia": "Belgium", "Australia": "Australia", 
                "USA": "the USA", "Austria": "Austria", "Słowacja": "Slovakia", "Węgry": "Hungary", "Czechy": "the Czech Republic", 
                "Szwajcaria": "Switzerland", "Łotwa": "Latvia", "Szwecja": "Sweden", "Francja": "France", "Hiszpania": "Spain", 
                "Kanada": "Canada", "Litwa": "Lithuania", "Słowenia": "Slovenia", "Chorwacja": "Croatia", "Finlandia": "Finland" 
            };

            let p2CountryEn = enCountries[currentMatch.opponent.country] || currentMatch.opponent.country;
            let p1CountryEn = enCountries[player.country] || player.country;
            
            let u1 = new SpeechSynthesisUtterance(`Ladies and gentlemen, please welcome... from ${p2CountryEn}... ${p2Name}!`);
            u1.lang = 'en-GB'; u1.pitch = 0.85; u1.rate = 0.9; u1.volume = 1.0 * globalVolume;
            
            let u2 = new SpeechSynthesisUtterance(`And his opponent... from ${p1CountryEn}... ${p1Name}!`);
            u2.lang = 'en-GB'; u2.pitch = 0.8; u2.rate = 0.9; u2.volume = 1.0 * globalVolume;
            
            u1.onend = () => {
                if(isWalkonSkipped) return;
                let audioSrc = moddedAssets.music[p2Name] || `music/${p2Name}.mp3`;
                oppAudio = new Audio(audioSrc);
                oppAudio.volume = 0.6 * globalVolume;
                oppAudio.play().then(() => {
                    walkonTimeout = setTimeout(() => {
                        if(isWalkonSkipped) return;
                        let fadeVol = 0.6;
                        walkonInterval = setInterval(() => {
                            fadeVol -= 0.05;
                            if(fadeVol > 0) {
                                if(oppAudio) oppAudio.volume = fadeVol * globalVolume;
                            } else { 
                                clearInterval(walkonInterval); 
                                if(oppAudio) oppAudio.pause(); 
                                playPlayerIntro(); 
                            }
                        }, 200);
                    }, 20000); // 20 sekund dla rywala
                }).catch(e => { if(!isWalkonSkipped) playPlayerIntro(); });
            };

            function playPlayerIntro() { 
                if(!isWalkonSkipped) window.speechSynthesis.speak(u2); 
            }

            u2.onend = () => {
                if(isWalkonSkipped) return;
                if (player.walkon) {
                    currentWalkonAudio = new Audio(player.walkon);
                    currentWalkonAudio.volume = 0.6 * globalVolume;
                    let playPromise = currentWalkonAudio.play();
                    if (playPromise !== undefined) playPromise.catch(e => console.log("Auto-play zablokowany", e));
                    
                    walkonTimeout = setTimeout(() => {
                        if(isWalkonSkipped) return;
                        let fadeVol = 0.6;
                        walkonInterval = setInterval(() => {
                            fadeVol -= 0.05;
                            if(fadeVol > 0) {
                                if(currentWalkonAudio) currentWalkonAudio.volume = fadeVol * globalVolume;
                            } else { 
                                clearInterval(walkonInterval); 
                                if(currentWalkonAudio) currentWalkonAudio.pause(); 
                                if(!isWalkonSkipped) finishWalkon();
                            }
                        }, 300);
                    }, 20000); // 20 sekund dla gracza
                } else {
                    finishWalkon();
                }
            };
            window.speechSynthesis.speak(u1);
        }

        function finishWalkon() {
            startCrowd();
            
            // POPRAWKA: Zmienione ID przycisku na takie ze słownika
            let skipBtn = document.getElementById('t-btn-skip-walkon');
            if(skipBtn) skipBtn.style.display = 'none';

            let audioSrc = moddedAssets.sounds["game_on"] || 'sounds/game_on.wav';
            let gameOnAudio = new Audio(audioSrc);
            gameOnAudio.volume = 1.0 * globalVolume; 

            setTimeout(() => {
                let playPromise = gameOnAudio.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (window.speechSynthesis) {
                            let utterance = new SpeechSynthesisUtterance("Game on!");
                            utterance.lang = 'en-GB';
                            utterance.pitch = 1.1; 
                            utterance.rate = 0.9;
                            utterance.volume = 1.0 * globalVolume;
                            window.speechSynthesis.speak(utterance);
                        }
                    });
                }
                
                // NOWOŚĆ: Dopiero teraz odpalamy przypisanie tury.
                // Jeśli AI miało zacząć, to dopiero tu włączymy jego stoper!
                if (currentMatch) setTurnUI();

            }, 800);
        }

        function skipWalkon() {
            isWalkonSkipped = true;
            window.speechSynthesis.cancel();
            if(currentWalkonAudio) { currentWalkonAudio.pause(); currentWalkonAudio = null; }
            if(oppAudio) { oppAudio.pause(); oppAudio = null; }
            clearTimeout(walkonTimeout);
            clearInterval(walkonInterval);
            
            finishWalkon();
        }

        function getPrizeMoney(tName, round, won) {
    if (tName.includes("World Darts Championship") || tName.includes("Global Darts Championship")) {
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
    } else {
        // Domyślnie (np. Continental Tour)
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

            // NOWOŚĆ: Blokada rankingowa dla Ligi!
            if (tName.includes("Global Darts League") || tName.includes("Premier")) {
                if (isCurrentPlayer(p)) player.budget += amount;
                return; // KOŃCZYMY FUNKCJĘ! Pieniądze nie lecą do rankingu.
            }

            if (!p.historyPT) p.historyPT = {};
            if (!p.historyMain) p.historyMain = {};

            const isProTour = tName.includes("European Tour") || tName.includes("Continental Tour") || 
                              tName.includes("Players Championship") || tName.includes("Pro Players Cup") || 
                              tName.includes("Darts Open") || tName.includes("Trophy") || tName.includes("Championship");
            
            const isPC = (tName.includes("Players Championship") || tName.includes("Pro Players Cup")) && !tName.includes("Finals");

            // --- 1. RANKING PROTOUR (Kroczący 12-miesięczny / 1-roczny) ---
            if (isProTour) {
                let defendedPT = p.historyPT[tName] !== undefined ? p.historyPT[tName] : Math.round(p.proTourPrizeMoney / 30);
                p.proTourPrizeMoney = Math.max(0, p.proTourPrizeMoney - defendedPT) + amount;
                p.historyPT[tName] = amount; 
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

            if (isCurrentPlayer(p)) player.budget += amount;
        }

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
            // --- ZABEZPIECZENIE: Jeśli turniej już trwa (drabinka jest wygenerowana), to tylko ją pokazujemy i kontynuujemy grę! ---
            if (tournamentBracket && tournamentBracket.length > 1) {
                showBracket();
                return;
            }

            let tName = activeTournament.name;
            let tNameLow = tName.toLowerCase();
            let allPlayers = [...pdcPlayers, player];
            let oomRanked = [...allPlayers].sort((a,b) => b.prizeMoney - a.prizeMoney);
            let ptRanked = [...allPlayers].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
            let pcRanked = [...allPlayers].sort((a,b) => b.pcPrizeMoney - a.pcPrizeMoney);

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
            } else if (tNameLow.includes("european tour") || tNameLow.includes("continental tour")) {
                let qualified = new Set();
                oomRanked.slice(0, 16).forEach(p => qualified.add(p)); 
                let ptIndex = 0;
                while(qualified.size < 48 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; }
                participants = Array.from(qualified); tournamentRound = 64; 
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
                alert(t('t-alert-skip-tour').replace('{tour}', tName));
                isHeadlessSim = true;
            } else if (!playerInTournament) {
                // Jeśli gracz się nie zakwalifikował, tylko o tym informujemy, 
                // ale NIE włączamy symulacji w tle, by pokazać mu drabinkę!
                alert(t('t-alert-no-qual').replace('{tour}', tName));
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

            } else if (tNameLow.includes("european tour") || tNameLow.includes("continental tour")) {
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
                while (tournamentBracket.length > 1) {
                    advanceTournament(false); 
                }
                
                // Przypisanie nagród i ostateczne zamknięcie turnieju
                activeTournament.completed = true;
                activeTournament.historyLogs = lastTournamentResults;
                
                let winner = tournamentBracket[0];
                let winPrize = getPrizeMoney(activeTournament.name, 2, true);
                awardPrizeMoney(winner, winPrize, activeTournament.name);

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
                
                // Ukrywamy kafelek aktywnego turnieju, aktualizujemy dane i wracamy do Hubu
                let tileTour = document.getElementById('tile-tournament');
                if (tileTour) tileTour.style.display = 'none';
                
                updateHub();
                showScreen('screen-hub');
                return;
            }

            showBracket();
        }
        

       function showBracket() {
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
            advanceTournament(false);

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

                alert(t('t-alert-tour-sim-end').replace('{tour}', activeTournament.name).replace('{winner}', winner.name));
                
                document.getElementById('bracket-modal').style.display = 'none';
                
                showTournamentEnd(); 

                activeTournament = null;
                tournamentBracket = []; // <--- CZYŚCI DRABINKĘ PO MECZACH AI
                document.getElementById('tile-tournament').style.display = 'none';
                updateHub();
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

    // --- AKTUALIZACJA REKORDÓW Z SYMULACJI ---
    if (isCurrentPlayer(p1) || isCurrentPlayer(p2)) {
        if (typeof initCareerStats === 'function') initCareerStats(); // Zabezpieczenie obiektu
        
        let myAvg = parseFloat(isCurrentPlayer(p1) ? p1Avg : p2Avg);
        
        // Zapisanie najwyższej średniej z symulacji matematycznej
        if (myAvg > (player.careerStats.highestAvg || 0)) {
            player.careerStats.highestAvg = myAvg;
            addCareerChronicleEvent('average', { value: Number(myAvg.toFixed(2)) });
        }
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
            let prize = getPrizeMoney(activeTournament.name, tournamentRound, false);

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
                    awardPrizeMoney(loser, prize, activeTournament.name); 
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

                } else {
                    let format = getTournamentMatchFormat(activeTournament, tournamentRound);
                    let matchRes = simulateAImatch(p1, p2, format);
                    
                    winner = matchRes.winner; 
                    loser = matchRes.loser;
                    
                    // ZMIANA: Zapisanie wyniku meczu AI do wyciągniętych wyżej zmiennych (zawsze wyższa dla zwycięzcy)
                    matchWScore = Math.max(matchRes.p1Score, matchRes.p2Score);
                    matchLScore = Math.min(matchRes.p1Score, matchRes.p2Score);

                    nextRoundBracket.push(winner);
                    awardPrizeMoney(loser, prize, activeTournament.name);
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
            document.getElementById('match-title').innerText = `${rivalryPrefix}🏆 ${activeTournament.name} - ${getRoundName(tournamentRound)} (${getMatchFormatLabel(matchFormat)})`;
            
            // --- WCZYTYWANIE ZDJĘĆ NA TABLICĘ ---
            let p1PhotoSrc = player.photo ? player.photo : "https://placehold.co/100/16213e/FFFFFF?text=TY";
            document.getElementById('score-photo-p1').src = p1PhotoSrc;
            
            let p2Img = document.getElementById('score-photo-p2');
            // Zamiast korzystać z domyślnych plików, używamy tych z wybranego moda (jeśli są)
            p2Img.src = moddedAssets.photos[currentMatch.opponent.name] || `zdjecia/${currentMatch.opponent.name}.png`;
            p2Img.onerror = function() { this.onerror=null; this.src='https://placehold.co/100/16213e/FFFFFF?text=AI'; };
            // -----------------------------------

            updateScores(); updateMatchStatsUI(); setTurnUI(); showScreen('screen-match');
            playMatchIntro(player.name, currentMatch.opponent.name);
        }

        