function announceAudio(event, playerName = "") {
            let soundKey = "";
            if (event === 180) soundKey = "180";
            else if (event === 'win_match') soundKey = "game_shot_match";
            else if (event === 'win_leg') soundKey = "game_shot";
            else soundKey = event.toString();

            // Ubezpieczenie - wymuszamy małe litery
            soundKey = soundKey.toLowerCase();

            // 1. Priorytet: Dźwięk z wgranego moda (.ZIP)
            if (moddedAssets.sounds[soundKey]) {
                let realAudio = new Audio(moddedAssets.sounds[soundKey]);
                realAudio.volume = 1.0 * globalVolume; 
                realAudio.play().catch(e => {
                    console.error("Błąd odtwarzania pliku z moda:", e);
                    playRobotCaller(event, playerName); 
                });
            } 
            // 2. Opcja awaryjna: Dźwięk z dysku lub głos robota
            else {
                let fallbackAudio = new Audio(`sounds/${soundKey}.wav`);
                fallbackAudio.volume = 1.0 * globalVolume;
                fallbackAudio.play().catch(e => {
                    playRobotCaller(event, playerName); 
                });
            }
        }

        // Awaryjny robot (stara funkcja)
        function playRobotCaller(event, playerName) {
            if (!window.speechSynthesis) return;
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
            window.speechSynthesis.speak(utterance);
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

       