let matchIntroGeneration = 0;
let matchIntroFinishTimeout = null;
let matchIntroFinishing = false;
const walkonAudioReleases = new WeakMap();

function releaseMatchWalkonAudio(audio) {
    if (!audio) return;
    audio.pause();
    const release = walkonAudioReleases.get(audio);
    if (release) {
        walkonAudioReleases.delete(audio);
        // Odłącz dekoder przed ewentualnym usunięciem pliku z cache.
        audio.removeAttribute('src');
        audio.load();
        release();
    }
    if (currentWalkonAudio === audio) currentWalkonAudio = null;
    if (oppAudio === audio) oppAudio = null;
}

function cancelMatchIntro() {
    // Każda prezentacja ma własny numer: spóźniony odczyt ZIP-a nie uruchomi audio.
    matchIntroGeneration++;
    isWalkonSkipped = true;
    clearTimeout(walkonTimeout);
    clearInterval(walkonInterval);
    clearTimeout(matchIntroFinishTimeout);
    matchIntroFinishTimeout = null;
    matchIntroFinishing = false;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    releaseMatchWalkonAudio(currentWalkonAudio);
    releaseMatchWalkonAudio(oppAudio);
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
            if (typeof candidate.walkon === 'string' && candidate.walkon) return candidate.walkon;
            const modSource = moddedAssets.music[candidate.name];
            return typeof modSource === 'string' ? modSource : `music/${candidate.name}.mp3`;
        }

        async function acquireMatchWalkonAudio(candidate) {
            if (!candidate?.walkon && candidate?.name && typeof acquireModMusicAsset === 'function') {
                try {
                    const music = await acquireModMusicAsset(moddedAssets, candidate.name);
                    if (music.url) return music;
                    music.release();
                } catch (error) {
                    // Wadliwy utwór nie może zablokować rozpoczęcia meczu.
                    console.warn('Nie udało się odczytać muzyki wejściowej z moda.', error);
                }
            }
            return { url: getMatchWalkonAudioSource(candidate), release() {} };
        }

        function playMatchIntro(p1Name, p2Name) {
            cancelMatchIntro();
            isWalkonSkipped = false;
            const generation = matchIntroGeneration;
            const introMatch = currentMatch;
            const isActive = () => generation === matchIntroGeneration && currentMatch === introMatch && !isWalkonSkipped;
            
            // POPRAWKA: Zmienione ID przycisku na takie ze słownika
            let skipBtn = document.getElementById('t-btn-skip-walkon');
            if(skipBtn) skipBtn.style.display = 'inline-block';

            // NOWOŚĆ: Blokujemy rzucanie i resetujemy stoper AI na czas wejść!
            const throwButton = document.getElementById('throw-btn');
            if (throwButton) throwButton.disabled = true;
            clearTimeout(window.aiTimeout);

            if (currentMatch) currentMatch.introInProgress = true;
            const hasSpeechSynthesis = Boolean(window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined');
            if(crowdAudio) { crowdAudio.pause(); }

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
            
            async function playCandidateWalkon(candidate, isP1, onFinished) {
                if (!isActive()) return;
                const music = await acquireMatchWalkonAudio(candidate);
                if (!isActive()) { music.release(); return; }
                if (!music.url) { music.release(); onFinished(); return; }
                let audio;
                let completed = false;
                const advance = () => {
                    if (completed) return;
                    completed = true;
                    if (audio) releaseMatchWalkonAudio(audio);
                    else music.release();
                    if (isActive()) onFinished();
                };
                const beginWalkon = () => {
                    if (!isActive()) { advance(); return; }
                    walkonTimeout = setTimeout(() => {
                        if (!isActive() || completed) return;
                        let fadeVol = 0.6;
                        walkonInterval = setInterval(() => {
                            if (!isActive() || completed) return;
                            fadeVol -= 0.05;
                            if (fadeVol > 0) {
                                audio.volume = fadeVol * globalVolume;
                            } else {
                                clearInterval(walkonInterval);
                                advance();
                            }
                        }, isP1 ? 300 : 200);
                    }, 20000); // Dotychczasowe czasy wejść pozostają bez zmian.
                };
                try {
                    audio = new Audio(music.url);
                    walkonAudioReleases.set(audio, music.release);
                    if (isP1) currentWalkonAudio = audio;
                    else oppAudio = audio;
                    audio.volume = 0.6 * globalVolume;
                    const playPromise = audio.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.then(beginWalkon).catch(advance);
                    } else beginWalkon();
                } catch (_) {
                    advance();
                }
            }

            u1.onend = () => playCandidateWalkon(p2Candidate, false, playPlayerIntro);

            function playPlayerIntro() { 
                if (!isActive()) return;
                if (hasSpeechSynthesis) window.speechSynthesis.speak(u2);
                else u2.onend();
            }

            u2.onend = () => playCandidateWalkon(p1Candidate, true, finishWalkon);
            if (hasSpeechSynthesis) window.speechSynthesis.speak(u1);
            else u1.onend();
        }

        function finishWalkon() {
            if (matchIntroFinishing) return;
            matchIntroFinishing = true;
            const generation = matchIntroGeneration;
            const introMatch = currentMatch;
            const isCurrent = () => generation === matchIntroGeneration && currentMatch === introMatch;
            startCrowd();
            
            // POPRAWKA: Zmienione ID przycisku na takie ze słownika
            let skipBtn = document.getElementById('t-btn-skip-walkon');
            if(skipBtn) skipBtn.style.display = 'none';

            let audioSrc = moddedAssets.sounds["game_on"] || 'sounds/game_on.wav';
            let gameOnAudio = new Audio(audioSrc);
            gameOnAudio.volume = 1.0 * globalVolume; 

            matchIntroFinishTimeout = setTimeout(() => {
                if (!isCurrent()) return;
                let playPromise = gameOnAudio.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        if (isCurrent() && window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined') {
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
            if (matchIntroFinishing) return;
            cancelMatchIntro();
            finishWalkon();
        }

        
