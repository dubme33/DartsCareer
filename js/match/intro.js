function startCrowd() {
            if(!crowdAudio) {
                let crowdSrc = moddedAssets.sounds["crowd"] || 'sounds/crowd.mp3';
                crowdAudio = new Audio(crowdSrc);
                crowdAudio.loop = true;
            }
            crowdAudio.volume = 0.15 * globalVolume;
            crowdAudio.play().catch(e => console.log("Crowd zablokowany", e));
        }

        function getMatchIntroPlayer(isP1, fallbackName) {
            if (typeof getCurrentSinglesMatchPlayer === 'function') {
                const matchPlayer = getCurrentSinglesMatchPlayer(isP1);
                if (matchPlayer) return matchPlayer;
            }
            if (isP1 && typeof player !== 'undefined') return player;
            if (!isP1 && currentMatch?.opponent) return currentMatch.opponent;
            return { name: fallbackName, country: '' };
        }

        function getMatchWalkonAudioSource(candidate) {
            if (!candidate?.name) return '';
            if (candidate.walkon) return candidate.walkon;
            return moddedAssets.music[candidate.name] || `music/${candidate.name}.mp3`;
        }

        function playMatchIntro(p1Name, p2Name) {
            isWalkonSkipped = false;
            
            // POPRAWKA: Zmienione ID przycisku na takie ze słownika
            let skipBtn = document.getElementById('t-btn-skip-walkon');
            if(skipBtn) skipBtn.style.display = 'inline-block';

            // NOWOŚĆ: Blokujemy rzucanie i resetujemy stoper AI na czas wejść!
            const throwButton = document.getElementById('throw-btn');
            if (throwButton) throwButton.disabled = true;
            clearTimeout(window.aiTimeout);

            if (currentMatch) currentMatch.introInProgress = true;
            const hasSpeechSynthesis = Boolean(window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined');
            if (hasSpeechSynthesis) window.speechSynthesis.cancel();
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

            const p1Candidate = getMatchIntroPlayer(true, p1Name);
            const p2Candidate = getMatchIntroPlayer(false, p2Name);
            p1Name = p1Candidate.name || p1Name;
            p2Name = p2Candidate.name || p2Name;
            let p2CountryEn = enCountries[p2Candidate.country] || p2Candidate.country || '';
            let p1CountryEn = enCountries[p1Candidate.country] || p1Candidate.country || '';
            
            let u1 = hasSpeechSynthesis
                ? new SpeechSynthesisUtterance(`Ladies and gentlemen, please welcome... from ${p2CountryEn}... ${p2Name}!`)
                : {};
            u1.lang = 'en-GB'; u1.pitch = 0.85; u1.rate = 0.9; u1.volume = 1.0 * globalVolume;
            
            let u2 = hasSpeechSynthesis
                ? new SpeechSynthesisUtterance(`And his opponent... from ${p1CountryEn}... ${p1Name}!`)
                : {};
            u2.lang = 'en-GB'; u2.pitch = 0.8; u2.rate = 0.9; u2.volume = 1.0 * globalVolume;
            
            u1.onend = () => {
                if(isWalkonSkipped) return;
                let audioSrc = getMatchWalkonAudioSource(p2Candidate);
                oppAudio = new Audio(audioSrc);
                oppAudio.volume = 0.6 * globalVolume;
                const beginOpponentWalkon = () => {
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
                };
                const playPromise = oppAudio.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.then(beginOpponentWalkon).catch(() => {
                        if(!isWalkonSkipped) playPlayerIntro();
                    });
                } else beginOpponentWalkon();
            };

            function playPlayerIntro() { 
                if (isWalkonSkipped) return;
                if (hasSpeechSynthesis) window.speechSynthesis.speak(u2);
                else u2.onend();
            }

            u2.onend = () => {
                if(isWalkonSkipped) return;
                const audioSrc = getMatchWalkonAudioSource(p1Candidate);
                if (audioSrc) {
                    currentWalkonAudio = new Audio(audioSrc);
                    currentWalkonAudio.volume = 0.6 * globalVolume;
                    const beginPlayerWalkon = () => {
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
                        }, 20000);
                    };
                    let playPromise = currentWalkonAudio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(beginPlayerWalkon).catch(() => {
                            if (!isWalkonSkipped) finishWalkon();
                        });
                    } else beginPlayerWalkon();
                } else {
                    finishWalkon();
                }
            };
            if (hasSpeechSynthesis) window.speechSynthesis.speak(u1);
            else u1.onend();
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
                        if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
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
                if (currentMatch) {
                    currentMatch.introInProgress = false;
                    setTurnUI();
                }

            }, 800);
        }

        function skipWalkon() {
            isWalkonSkipped = true;
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if(currentWalkonAudio) { currentWalkonAudio.pause(); currentWalkonAudio = null; }
            if(oppAudio) { oppAudio.pause(); oppAudio = null; }
            clearTimeout(walkonTimeout);
            clearInterval(walkonInterval);
            
            finishWalkon();
        }

        
