function announceAudio(event, playerName = "") {
            let soundKey = "";
            if (event === 180) soundKey = "180";
            else if (event === 'win_match') soundKey = "game_shot_match";
            else if (event === 'win_leg') soundKey = "game_shot";
            else soundKey = event.toString();

            // Ubezpieczenie - wymuszamy małe litery
            soundKey = soundKey.toLowerCase();
            const modSource = moddedAssets.sounds[soundKey];
            const source = modSource || `sounds/${soundKey}.wav`;

            // Zwracany Promise kończy się dopiero po pełnym komunikacie callera.
            // Reżyser TV używa go do ustawienia powtórki za zapowiedzią wyniku.
            return playCallerClip(source, event, playerName, Boolean(modSource));
        }

        function playCallerClip(source, event, playerName, isModded) {
            return new Promise(resolve => {
                let audio;
                try { audio = new Audio(source); }
                catch (_error) { playRobotCaller(event, playerName).then(resolve); return; }

                audio.volume = 1.0 * globalVolume;
                let settled = false;
                let fallbackStarted = false;
                const timeout = setTimeout(() => useRobotCaller(new Error('Caller audio timeout')), 20000);
                const cleanup = () => {
                    clearTimeout(timeout);
                    audio.onended = null;
                    audio.onerror = null;
                };
                const finish = () => {
                    if (settled) return;
                    settled = true;
                    cleanup();
                    resolve();
                };
                const useRobotCaller = error => {
                    if (settled || fallbackStarted) return;
                    fallbackStarted = true;
                    cleanup();
                    try { audio.pause(); } catch (_error) { /* Nie każdy testowy odtwarzacz ma pause(). */ }
                    if (isModded && error) console.error("Błąd odtwarzania pliku z moda:", error);
                    playRobotCaller(event, playerName).then(finish, finish);
                };

                audio.onended = finish;
                audio.onerror = () => useRobotCaller(new Error('Caller audio could not be decoded'));
                try {
                    const started = audio.play();
                    if (started && typeof started.catch === 'function') started.catch(useRobotCaller);
                } catch (error) { useRobotCaller(error); }
            });
        }

        // Awaryjny robot (stara funkcja)
        function playRobotCaller(event, playerName) {
            return new Promise(resolve => {
                if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') { resolve(); return; }
                window.speechSynthesis.cancel();
                let utterance = new SpeechSynthesisUtterance();
                utterance.lang = 'en-GB';
                utterance.volume = 1.0 * globalVolume; // Robot też słucha suwaka!

                if (event === 180) {
                    utterance.text = "ONE HUNDRED AND EIGHTY!!!";
                    utterance.pitch = 1.6; utterance.rate = 1.1;
                } else if (event === 'win_match') {
                    utterance.text = `Game shot, and the match! ${playerName}`;
                    utterance.pitch = 1.1; utterance.rate = 0.9;
                } else if (event === 'win_leg') {
                    utterance.text = `Game shot!`;
                    utterance.pitch = 1.1; utterance.rate = 0.9;
                } else {
                    utterance.text = event === 0 ? "No score" : event.toString();
                    utterance.pitch = 1.0; utterance.rate = 0.9;
                }

                let settled = false;
                const finish = () => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeout);
                    resolve();
                };
                const timeout = setTimeout(finish, Math.min(12000, Math.max(3500, utterance.text.length * 160)));
                utterance.onend = finish;
                utterance.onerror = finish;
                try { window.speechSynthesis.speak(utterance); }
                catch (_error) { finish(); }
            });
        }

        function announceRequire(score) {
            let reqSrc = moddedAssets.sounds["require"] || 'sounds/require.wav';
            let requireAudio = new Audio(reqSrc);
            requireAudio.volume = 1.0 * globalVolume;
            
            let scoreSrc = moddedAssets.sounds[score] || `sounds/${score}.wav`;
            let scoreAudio = new Audio(scoreSrc);
            scoreAudio.volume = 1.0 * globalVolume;

            requireAudio.play().then(() => {
                requireAudio.onended = () => {
                    scoreAudio.play().catch(e => {
                        fallbackRequireSynth(score, false);
                    });
                };
            }).catch(e => {
                fallbackRequireSynth(score, true);
            });
        }

        function fallbackRequireSynth(score, fullPhrase) {
            if (!window.speechSynthesis) return;
            let utteranceText = fullPhrase ? `You require ${score}` : `${score}`;
            let utterance = new SpeechSynthesisUtterance(utteranceText);
            utterance.lang = 'en-GB';
            utterance.pitch = 1.0; 
            utterance.rate = 0.9;
            utterance.volume = 1.0 * globalVolume;
            window.speechSynthesis.speak(utterance);
        }

       
