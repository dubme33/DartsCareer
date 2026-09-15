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
    if (typeof hideCareerEntranceVisual === 'function') hideCareerEntranceVisual();
}

function startCrowd() {
            if (window.matchCrowd) window.matchCrowd.start(currentMatch, activeTournament);
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

        function getMatchIntroMainOomRank(candidate) {
            if (!candidate) return Number.MAX_SAFE_INTEGER;
            let ranking = [];
            if (typeof getCachedRankedPlayers === 'function') {
                ranking = getCachedRankedPlayers('main');
            } else {
                ranking = [
                    ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
                    ...(typeof player !== 'undefined' && player ? [player] : [])
                ].filter(Boolean).sort((first, second) =>
                    (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
            }
            const index = ranking.findIndex(rankedCandidate => rankedCandidate === candidate
                || (typeof samePlayer === 'function' && samePlayer(rankedCandidate, candidate)));
            return index >= 0 ? index + 1 : Number.MAX_SAFE_INTEGER;
        }

        function getMatchIntroOrder(p1Candidate, p2Candidate) {
            const p1Rank = getMatchIntroMainOomRank(p1Candidate);
            const p2Rank = getMatchIntroMainOomRank(p2Candidate);
            // Wyższy numer oznacza niższe miejsce w OOM, więc ten zawodnik
            // wychodzi pierwszy. Przy nierozstrzygnięciu zachowujemy dawną,
            // stabilną kolejność P2 -> P1.
            return p1Rank > p2Rank
                ? [{ candidate: p1Candidate, isP1: true }, { candidate: p2Candidate, isP1: false }]
                : [{ candidate: p2Candidate, isP1: false }, { candidate: p1Candidate, isP1: true }];
        }

        function isFloorTournamentWithoutWalkons(tournament) {
            if (!tournament) return false;
            if (tournament.noWalkons === true) return true;
            const name = `${tournament.name || ''} ${tournament.sourceName || ''}`.toLocaleLowerCase('pl');
            const specialType = String(tournament.specialType || '').toLocaleLowerCase('pl');
            const isQualifier = specialType.includes('qualifier')
                || specialType === 'pdcqschool'
                || name.includes('qualifier')
                || name.includes('kwalifikacj')
                || name.includes('q-school')
                || name.includes('pro card trials');
            const isPlayersChampionship = name.includes('players championship') || name.includes('pro players cup');
            const isPlayersChampionshipFinals = name.includes('players championship finals')
                || name.includes('pro players finals');
            const isChallengeTour = specialType === 'challengetour'
                || name.includes('rising stars circuit')
                || name.includes('challenge tour');
            const isDevelopmentTour = specialType === 'developmenttour'
                || name.includes('future champions circuit')
                || name.includes('development tour');
            return isQualifier || isChallengeTour || isDevelopmentTour
                || (isPlayersChampionship && !isPlayersChampionshipFinals);
        }

        function startMatchWithoutWalkons() {
            const skipBtn = document.getElementById('t-btn-skip-walkon');
            if (skipBtn) skipBtn.style.display = 'none';
            if (typeof hideCareerEntranceVisual === 'function') hideCareerEntranceVisual();
            if (window.matchCrowd) window.matchCrowd.stop();
            if (crowdAudio) {
                crowdAudio.pause();
                crowdAudio.currentTime = 0;
            }
            clearTimeout(window.aiTimeout);
            if (currentMatch) currentMatch.introInProgress = false;
            setTurnUI();
        }

        function getMatchWalkonAudioSource(candidate) {
            if (!candidate?.name) return '';
            if (typeof candidate.walkon === 'string' && candidate.walkon) return candidate.walkon;
            const sourceName = candidate.sourceName || candidate.name;
            const modSource = moddedAssets?.music?.[candidate.name] || moddedAssets?.music?.[sourceName];
            return typeof modSource === 'string' ? modSource : `music/${encodeURIComponent(sourceName)}.mp3`;
        }

        async function acquireMatchWalkonAudio(candidate) {
            if (!candidate?.walkon && candidate?.name && typeof acquireModMusicAsset === 'function') {
                const names = [...new Set([candidate.name, candidate.sourceName].filter(Boolean))];
                for (const name of names) {
                    try {
                        const music = await acquireModMusicAsset(moddedAssets, name);
                        if (music.url) return music;
                        music.release();
                    } catch (error) {
                        // Wadliwy utwór nie może zablokować rozpoczęcia meczu.
                        console.warn('Nie udało się odczytać muzyki wejściowej z moda.', error);
                    }
                }
            }
            return { url: getMatchWalkonAudioSource(candidate), release() {} };
        }

        function playMatchIntro(p1Name, p2Name) {
            cancelMatchIntro();
            const tournament = typeof activeTournament !== 'undefined' ? activeTournament : null;
            const allTournamentWalkons = typeof areWalkonsEnabledInAllTournaments === 'function'
                && areWalkonsEnabledInAllTournaments();
            if (currentMatch?.isTournament && isFloorTournamentWithoutWalkons(tournament)
                && !allTournamentWalkons) {
                startMatchWithoutWalkons();
                return false;
            }
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
            const [firstEntrance, secondEntrance] = getMatchIntroOrder(p1Candidate, p2Candidate);
            const firstCandidate = firstEntrance.candidate;
            const secondCandidate = secondEntrance.candidate;
            const firstName = firstCandidate?.name || '';
            const secondName = secondCandidate?.name || '';
            const firstCountryEn = enCountries[firstCandidate?.country] || firstCandidate?.country || '';
            const secondCountryEn = enCountries[secondCandidate?.country] || secondCandidate?.country || '';
            if (typeof showCareerEntranceVisual === 'function') showCareerEntranceVisual(firstCandidate);
            
            let u1 = hasSpeechSynthesis
                ? new SpeechSynthesisUtterance(`Ladies and gentlemen, please welcome... from ${firstCountryEn}... ${firstName}!`)
                : {};
            u1.lang = 'en-GB'; u1.pitch = 0.85; u1.rate = 0.9; u1.volume = 1.0 * globalVolume;
            
            let u2 = hasSpeechSynthesis
                ? new SpeechSynthesisUtterance(`And his opponent... from ${secondCountryEn}... ${secondName}!`)
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

            u1.onend = () => playCandidateWalkon(firstCandidate, firstEntrance.isP1, playSecondIntro);

            function playSecondIntro() {
                if (!isActive()) return;
                if (typeof showCareerEntranceVisual === 'function') showCareerEntranceVisual(secondCandidate);
                if (hasSpeechSynthesis) window.speechSynthesis.speak(u2);
                else u2.onend();
            }

            u2.onend = () => playCandidateWalkon(secondCandidate, secondEntrance.isP1, finishWalkon);
            if (hasSpeechSynthesis) window.speechSynthesis.speak(u1);
            else u1.onend();
            return true;
        }

        function finishWalkon() {
            if (matchIntroFinishing) return;
            matchIntroFinishing = true;
            const generation = matchIntroGeneration;
            const introMatch = currentMatch;
            const isCurrent = () => generation === matchIntroGeneration && currentMatch === introMatch;
            if (typeof hideCareerEntranceVisual === 'function') hideCareerEntranceVisual();
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

        
