let matchIntroGeneration = 0;
let matchIntroFinishTimeout = null;
let matchIntroFinishing = false;
let matchIntroCurrentEntrance = null;
const walkonAudioReleases = new WeakMap();
let matchWalkonAudioPlayer = null;

function getMatchWalkonAudioPlayer() {
    // Safari grants playback permission to the element. Reuse it for both
    // entrants and later matches instead of creating a new locked player.
    if (!matchWalkonAudioPlayer) matchWalkonAudioPlayer = new Audio();
    return matchWalkonAudioPlayer;
}

function setMatchWalkonMusicBlocked(blocked) {
    const button = document.getElementById('walkon-card-play-music');
    if (!button) return;
    button.hidden = !blocked;
    button.disabled = false;
    button.textContent = typeof trWalkonCard === 'function' ? trWalkonCard('playMusic') : '▶ Play music';
}

function resumeBlockedWalkonMusic() {
    // Keep play() in the trusted click handler, with no await or timer first.
    return matchIntroCurrentEntrance?.resumeMusic?.() || false;
}

let matchIntroCountryAliases = null;

function getMatchIntroEnglishCountry(country) {
    if (typeof country !== 'string' || !country.trim()) return '';
    const normalize = value => value.trim().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ');
    if (!matchIntroCountryAliases) {
        matchIntroCountryAliases = new Map();
        const catalog = typeof flags === 'object' ? flags : {};
        const labels = typeof translations === 'object' ? translations : {};
        for (const [canonical, code] of Object.entries(catalog)) {
            const english = labels.en?.[canonical];
            if (typeof english !== 'string' || !english.trim()) continue;
            const aliases = [canonical, code, english, `the ${english}`,
                ...['pl', 'de', 'nl'].map(language => labels[language]?.[canonical])];
            if (canonical === 'USA') aliases.push('United States', 'the United States', 'United States of America');
            for (const alias of aliases) {
                if (typeof alias === 'string' && alias.trim()) {
                    matchIntroCountryAliases.set(normalize(alias), english);
                }
            }
        }
    }
    // Unknown custom labels are omitted, never spoken as a foreign country name.
    return matchIntroCountryAliases.get(normalize(country)) || '';
}

function getMatchIntroCountryAnnouncement(country) {
    const english = getMatchIntroEnglishCountry(country);
    if (!english) return '';
    const article = ['Netherlands', 'USA', 'Czech Republic', 'Philippines',
        'Bahamas', 'Gambia', 'United Arab Emirates'].includes(english) ? 'the ' : '';
    return `from ${article}${english}... `;
}

function releaseMatchWalkonAudio(audio) {
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
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
    matchIntroCurrentEntrance = null;
    setMatchWalkonMusicBlocked(false);
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

        function getMatchIntroMainOomRanking() {
            if (typeof getCachedRankedPlayers === 'function') {
                return getCachedRankedPlayers('main');
            }
            return [
                ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
                ...(typeof player !== 'undefined' && player ? [player] : [])
            ].filter(candidate => candidate && !candidate.isBye).sort((first, second) =>
                (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
        }

        function getMatchIntroMainOomRank(candidate, ranking = getMatchIntroMainOomRanking()) {
            if (!candidate || candidate.isBye) return Number.MAX_SAFE_INTEGER;
            const id = candidate.id && typeof pdcPlayerIdAliases !== 'undefined'
                ? pdcPlayerIdAliases.get(candidate.id) || candidate.id : candidate.id;
            let index = ranking.findIndex(rankedCandidate => rankedCandidate === candidate
                || (id && rankedCandidate.id === id));
            // Only references from before stable IDs may use a unique identity.
            // Different modern IDs remain different people, even with the same name.
            if (index < 0 && !id) {
                const identityKey = person => typeof getCanonicalPlayerIdentityKey === 'function'
                    ? getCanonicalPlayerIdentityKey(person)
                    : [person?.sourceName || person?.name, person?.country]
                        .map(value => String(value || '').trim().toLocaleLowerCase('pl')).join('|');
                const key = identityKey(candidate);
                const matches = key && (candidate.sourceName || candidate.name)
                    ? ranking.map((person, position) => identityKey(person) === key ? position : -1)
                        .filter(position => position >= 0) : [];
                if (matches.length === 1) index = matches[0];
            }
            return index >= 0 ? index + 1 : Number.MAX_SAFE_INTEGER;
        }

        function getMatchIntroOrder(p1Candidate, p2Candidate) {
            const ranking = getMatchIntroMainOomRanking();
            const p1Rank = getMatchIntroMainOomRank(p1Candidate, ranking);
            const p2Rank = getMatchIntroMainOomRank(p2Candidate, ranking);
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

            const p1Candidate = getMatchIntroPlayer(true, p1Name);
            const p2Candidate = getMatchIntroPlayer(false, p2Name);
            p1Name = p1Candidate.name || p1Name;
            p2Name = p2Candidate.name || p2Name;
            const [firstEntrance, secondEntrance] = getMatchIntroOrder(p1Candidate, p2Candidate);
            const firstCandidate = firstEntrance.candidate;
            const secondCandidate = secondEntrance.candidate;
            const firstName = firstCandidate?.name || '';
            const secondName = secondCandidate?.name || '';
            const firstCountryEn = getMatchIntroCountryAnnouncement(firstCandidate?.country);
            const secondCountryEn = getMatchIntroCountryAnnouncement(secondCandidate?.country);
            
            let u1 = hasSpeechSynthesis
                ? new SpeechSynthesisUtterance(`Ladies and gentlemen, please welcome... ${firstCountryEn}${firstName}!`)
                : {};
            u1.lang = 'en-GB'; u1.pitch = 0.85; u1.rate = 0.9; u1.volume = 1.0 * globalVolume;
            
            let u2 = hasSpeechSynthesis
                ? new SpeechSynthesisUtterance(`And his opponent... ${secondCountryEn}${secondName}!`)
                : {};
            u2.lang = 'en-GB'; u2.pitch = 0.8; u2.rate = 0.9; u2.volume = 1.0 * globalVolume;
            
            function playEntrance(candidate, isP1, utterance, onFinished) {
                if (!isActive()) return;
                let audio;
                let music;
                let completed = false;
                let musicStarted = false;
                let playbackStarted = false;
                let playAttemptPending = false;
                let waitingForGesture = false;
                const entrance = {};
                const isEntranceActive = () => isActive() && matchIntroCurrentEntrance === entrance && !completed;
                const advance = (cancelSpeech = false) => {
                    if (!isEntranceActive()) return false;
                    completed = true;
                    matchIntroCurrentEntrance = null;
                    setMatchWalkonMusicBlocked(false);
                    clearTimeout(walkonTimeout);
                    clearInterval(walkonInterval);
                    if (cancelSpeech && window.speechSynthesis) window.speechSynthesis.cancel();
                    if (audio) releaseMatchWalkonAudio(audio);
                    else if (music) music.release();
                    if (isActive()) onFinished();
                    return true;
                };
                entrance.skip = () => advance(true);
                entrance.resumeMusic = () => waitingForGesture && tryPlayMusic();
                matchIntroCurrentEntrance = entrance;
                setMatchWalkonMusicBlocked(false);
                if (typeof showCareerEntranceVisual === 'function') showCareerEntranceVisual(candidate);
                const beginWalkon = () => {
                    if (!isEntranceActive() || playbackStarted) return;
                    playbackStarted = true;
                    waitingForGesture = false;
                    setMatchWalkonMusicBlocked(false);
                    walkonTimeout = setTimeout(() => {
                        if (!isEntranceActive()) return;
                        let fadeVol = 0.6;
                        walkonInterval = setInterval(() => {
                            if (!isEntranceActive()) return;
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
                const playbackFailed = error => {
                    if (!isEntranceActive()) return;
                    playAttemptPending = false;
                    if (error?.name === 'NotAllowedError') {
                        // The file is ready, but Safari requires a fresh tap.
                        // Keep this entrance on screen; skipping still works.
                        waitingForGesture = true;
                        setMatchWalkonMusicBlocked(true);
                    } else advance();
                };
                function tryPlayMusic() {
                    if (!isEntranceActive() || !audio || playAttemptPending || playbackStarted) return false;
                    playAttemptPending = true;
                    const button = document.getElementById('walkon-card-play-music');
                    if (button) button.disabled = true;
                    try {
                        const playPromise = audio.play();
                        if (playPromise && typeof playPromise.then === 'function') {
                            playPromise.then(() => { playAttemptPending = false; beginWalkon(); }).catch(playbackFailed);
                        } else { playAttemptPending = false; beginWalkon(); }
                    } catch (error) { playbackFailed(error); }
                    return true;
                }
                utterance.onend = async () => {
                    if (!isEntranceActive() || musicStarted) return;
                    musicStarted = true;
                    music = await acquireMatchWalkonAudio(candidate);
                    if (!isEntranceActive()) { music.release(); return; }
                    if (!music.url) { advance(); return; }
                    try {
                        audio = getMatchWalkonAudioPlayer();
                        audio.src = music.url;
                        audio.preload = 'auto';
                        walkonAudioReleases.set(audio, music.release);
                        if (isP1) currentWalkonAudio = audio;
                        else oppAudio = audio;
                        audio.volume = 0.6 * globalVolume;
                        audio.onerror = () => advance();
                        audio.onended = () => advance();
                        tryPlayMusic();
                    } catch (_) {
                        advance();
                    }
                };
                utterance.onerror = utterance.onend;
                if (hasSpeechSynthesis) {
                    try { window.speechSynthesis.speak(utterance); }
                    catch (_error) { utterance.onend(); }
                }
                else utterance.onend();
            }

            function playSecondIntro() {
                playEntrance(secondCandidate, secondEntrance.isP1, u2, finishWalkon);
            }

            playEntrance(firstCandidate, firstEntrance.isP1, u1, playSecondIntro);
            return true;
        }

        function finishWalkon() {
            if (matchIntroFinishing) return;
            matchIntroFinishing = true;
            matchIntroCurrentEntrance = null;
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

        function skipCurrentWalkon() {
            if (!currentMatch?.introInProgress || matchIntroFinishing) return false;
            return matchIntroCurrentEntrance?.skip() || false;
        }

        
