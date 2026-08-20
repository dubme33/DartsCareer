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

        