
       // --- 1. ZMIENNE GLOBALNE I FLAGI ---
        const worldRegions = {
            "Europa": {
                "Albania": "al", "Andora": "ad", "Anglia": "gb-eng", "Austria": "at", "Belgia": "be",
                "Białoruś": "by", "Bośnia i Hercegowina": "ba", "Bułgaria": "bg", "Chorwacja": "hr",
                "Czarnogóra": "me", "Czechy": "cz", "Cypr": "cy", "Dania": "dk", "Estonia": "ee", "Gibraltar": "gi",
                "Finlandia": "fi", "Francja": "fr", "Grecja": "gr", "Hiszpania": "es", "Holandia": "nl",
                "Irlandia": "ie", "Irlandia Północna": "gb-nir", "Islandia": "is", "Kosowo": "xk",
                "Liechtenstein": "li", "Litwa": "lt", "Luksemburg": "lu", "Łotwa": "lv", 
                "Macedonia Północna": "mk", "Malta": "mt", "Mołdawia": "md", "Monako": "mc", 
                "Niemcy": "de", "Norwegia": "no", "Polska": "pl", "Portugalia": "pt", "Rosja": "ru",
                "Rumunia": "ro", "San Marino": "sm", "Serbia": "rs", "Słowacja": "sk", 
                "Słowenia": "si", "Szkocja": "gb-sct", "Szwajcaria": "ch", "Szwecja": "se", 
                "Walia": "gb-wls", "Watykan": "va", "Węgry": "hu", "Włochy": "it", "Ukraina": "ua"
            },
            "Ameryka Północna": {
                "Antigua i Barbuda": "ag", "Bahamy": "bs", "Barbados": "bb", "Belize": "bz", 
                "Dominika": "dm", "Dominikana": "do", "Grenada": "gd", "Gwatemala": "gt", 
                "Haiti": "ht", "Honduras": "hn", "Jamajka": "jm", "Kanada": "ca", "Kostaryka": "cr", 
                "Kuba": "cu", "Meksyk": "mx", "Nikaragua": "ni", "Panama": "pa", "Portoryko": "pr", 
                "Saint Kitts i Nevis": "kn", "Saint Lucia": "lc", "Saint Vincent i Grenadyny": "vc", 
                "Salwador": "sv", "Trynidad i Tobago": "tt", "USA": "us"
            },
            "Ameryka Południowa": {
                "Argentyna": "ar", "Boliwia": "bo", "Brazylia": "br", "Chile": "cl", "Ekwador": "ec", 
                "Gujana": "gy", "Kolumbia": "co", "Paragwaj": "py", "Peru": "pe", "Surinam": "sr", 
                "Urugwaj": "uy", "Wenezuela": "ve"
            },
            "Azja": {
                "Afganistan": "af", "Arabia Saudyjska": "sa", "Armenia": "am", "Azerbejdżan": "az", 
                "Bahrajn": "bh", "Bangladesz": "bd", "Bhutan": "bt", "Brunei": "bn", "Chiny": "cn", 
                "Filipiny": "ph", "Gruzja": "ge", "Hongkong": "hk", "Indie": "in", "Indonezja": "id", 
                "Irak": "iq", "Iran": "ir", "Izrael": "il", "Japonia": "jp", "Jemen": "ye", 
                "Jordania": "jo", "Kambodża": "kh", "Katar": "qa", "Kazachstan": "kz", "Kirgistan": "kg", 
                "Korea Południowa": "kr", "Korea Północna": "kp", "Kuwejt": "kw", "Laos": "la", 
                "Liban": "lb", "Malediwy": "mv", "Malezja": "my", "Mjanma": "mm", "Mongolia": "mn", 
                "Nepal": "np", "Oman": "om", "Pakistan": "pk", "Palestyna": "ps", "Singapur": "sg", "Sri Lanka": "lk", 
                "Syria": "sy", "Tadżykistan": "tj", "Tajlandia": "th", "Tajwan": "tw", 
                "Timor Wschodni": "tl", "Turcja": "tr", "Turkmenistan": "tm", "Uzbekistan": "uz", 
                "Wietnam": "vn", "Zjednoczone Emiraty Arabskie": "ae"
            },
            "Afryka": {
                "Algieria": "dz", "Angola": "ao", "Benin": "bj", "Botswana": "bw", "Burkina Faso": "bf", 
                "Burundi": "bi", "Czad": "td", "Demokratyczna Republika Konga": "cd", "Dżibuti": "dj", 
                "Egipt": "eg", "Erytrea": "er", "Eswatini": "sz", "Etiopia": "et", "Gabon": "ga", 
                "Gambia": "gm", "Ghana": "gh", "Gwinea": "gn", "Gwinea Bissau": "gw", "Gwinea Równikowa": "gq", 
                "Kamerun": "cm", "Kenia": "ke", "Komory": "km", "Kongo": "cg", "Lesotho": "ls", 
                "Liberia": "lr", "Libia": "ly", "Madagaskar": "mg", "Malawi": "mw", "Mali": "ml", 
                "Maroko": "ma", "Mauretania": "mr", "Mauritius": "mu", "Mozambik": "mz", "Namibia": "na", 
                "Niger": "ne", "Nigeria": "ng", "Republika Środkowoafrykańska": "cf", 
                "Republika Zielonego Przylądka": "cv", "RPA": "za", "Rwanda": "rw", "Senegal": "sn", 
                "Seszele": "sc", "Sierra Leone": "sl", "Somalia": "so", "Sudan": "sd", "Sudan Południowy": "ss", 
                "Tanzania": "tz", "Togo": "tg", "Tunezja": "tn", "Uganda": "ug", "Wybrzeże Kości Słoniowej": "ci", 
                "Wyspy Świętego Tomasza i Książęca": "st", "Zambia": "zm", "Zimbabwe": "zw"
            },
            "Australia i Oceania": {
                "Australia": "au", "Fidżi": "fj", "Kiribati": "ki", "Mikronezja": "fm", "Nauru": "nr", 
                "Nowa Zelandia": "nz", "Palau": "pw", "Papua-Nowa Gwinea": "pg", "Samoa": "ws", 
                "Tonga": "to", "Tuvalu": "tv", "Vanuatu": "vu", "Wyspy Marshalla": "mh", "Wyspy Salomona": "sb"
            }
        };

        // Automatycznie "spłaszczamy" podzielony słownik do starego formatu, 
        // aby cała reszta gry (zdjęcia przy wyniku, hub, tabele PDC) nadal działała bezbłędnie!
        const flags = {};
        Object.values(worldRegions).forEach(region => Object.assign(flags, region));
        const countries = Object.keys(flags);

        // Niezmienny wzorzec bazowej listy. Umożliwia bezpieczne dopisywanie nowych
        // zawodników do istniejących zapisów kariery po aktualizacji gry.
        const defaultPdcPlayerTemplates = pdcPlayers.map(candidate => ({ ...candidate }));
        
        function getFlagImg(country) {
            if(!flags[country]) return "";
            return `<img src="https://flagcdn.com/w20/${flags[country]}.png" alt="${escapeHtml(country)}" style="vertical-align: middle; margin-right: 5px;">`;
        }

        // Dane gracza mogą pochodzić z zapisu lub moda. Nazwa jest wyłącznie etykietą,
        // a stałe ID odpowiada za poprawne rozpoznawanie zawodnika w drabinkach i rankingach.
        function escapeHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, char => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
            })[char]);
        }

        function sanitizeEmailHtml(value) {
            const template = document.createElement('template');
            template.innerHTML = String(value ?? '');
            const allowedTags = new Set(['STRONG', 'B', 'BR', 'SPAN']);
            template.content.querySelectorAll('*').forEach(element => {
                if (!allowedTags.has(element.tagName)) {
                    element.replaceWith(document.createTextNode(element.textContent || ''));
                } else {
                    [...element.attributes].forEach(attribute => element.removeAttribute(attribute.name));
                }
            });
            return template.innerHTML;
        }

        function createEntityId(prefix = 'player') {
            if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
                return `${prefix}-${globalThis.crypto.randomUUID()}`;
            }
            return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
        }

        function normalizePlayerIds(players, currentPlayer) {
            const seenIds = new Set();
            const assignId = (candidate, prefix) => {
                if (!candidate || candidate.isBye) return;
                if (typeof candidate.id !== 'string' || !candidate.id.trim() || seenIds.has(candidate.id)) {
                    candidate.id = createEntityId(prefix);
                }
                seenIds.add(candidate.id);
            };

            if (Array.isArray(players)) players.forEach(p => assignId(p, 'ai'));
            assignId(currentPlayer, 'player');
        }

        function getPlayerAge(candidate, referenceDate = currentDate) {
            const birthYear = candidate?.birthYear;
            const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);

            if (!Number.isInteger(birthYear) || Number.isNaN(date.getTime())) return null;
            return date.getFullYear() - birthYear;
        }

        function samePlayer(first, second) {
            return Boolean(first && second && first.id && second.id && first.id === second.id);
        }

        function isCurrentPlayer(candidate) {
            return samePlayer(candidate, player);
        }

        function renderOpponentOptions() {
            const opponentSelect = document.getElementById('opponent-select');
            if (!opponentSelect || typeof pdcPlayers === 'undefined') return;

            opponentSelect.replaceChildren();
            pdcPlayers.forEach((candidate, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${candidate.name} (OVR: ${candidate.ovr})`;
                opponentSelect.appendChild(option);
            });
        }

        function getCareerStartPlayers() {
            if (typeof pdcPlayers === 'undefined') return [];
            return pdcPlayers
                .filter(candidate => candidate && !candidate.isBye)
                .slice()
                .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
        }

        function renderCareerPlayerOptions() {
            const select = document.getElementById('existing-player-select');
            if (!select) return;

            const previousValue = select.value;
            const candidates = getCareerStartPlayers();
            select.replaceChildren();

            if (candidates.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = trCareerStart('empty');
                select.appendChild(option);
                select.disabled = true;
            } else {
                candidates.forEach((candidate, index) => {
                    const option = document.createElement('option');
                    option.value = candidate.id;
                    option.textContent = `${candidate.name} — ${t(candidate.country)} · OVR ${Math.round(candidate.ovr)} · #${index + 1}`;
                    select.appendChild(option);
                });
                select.disabled = false;
                if (candidates.some(candidate => candidate.id === previousValue)) select.value = previousValue;
            }

            updateExistingPlayerPreview();
        }

        function updateExistingPlayerPreview() {
            const select = document.getElementById('existing-player-select');
            const preview = document.getElementById('existing-player-preview');
            if (!select || !preview) return;

            const candidate = typeof pdcPlayers === 'undefined'
                ? null
                : pdcPlayers.find(item => item && item.id === select.value);
            if (!candidate) {
                preview.textContent = trCareerStart('empty');
                return;
            }

            const rank = getCareerStartPlayers().findIndex(item => item.id === candidate.id) + 1;
            preview.textContent = trCareerStart('preview', {
                country: t(candidate.country),
                ovr: Math.round(candidate.ovr),
                rank,
                prize: (Number(candidate.prizeMoney) || 0).toLocaleString('en-GB')
            });
        }

        // Lewa kolumna ekranu startowego kończy się równo z formularzem po prawej.
        // Nadmiar wpisów pozostaje dostępny przez przewijanie wewnątrz changeloga.
        function syncStartScreenChangelogHeight() {
            const changelog = document.querySelector('.changelog-box');
            const form = document.querySelector('.create-form-wrapper');
            if (!changelog || !form) return;

            if (window.matchMedia('(max-width: 900px)').matches) {
                changelog.style.height = '';
                changelog.style.maxHeight = '';
                return;
            }

            const formHeight = Math.ceil(form.getBoundingClientRect().height);
            if (formHeight > 0) {
                changelog.style.height = `${formHeight}px`;
                changelog.style.maxHeight = `${formHeight}px`;
            }
        }

        function setupStartScreenLayoutSync() {
            const form = document.querySelector('.create-form-wrapper');
            if (!form) return;

            syncStartScreenChangelogHeight();
            window.addEventListener('resize', syncStartScreenChangelogHeight);

            if (typeof ResizeObserver === 'function') {
                const observer = new ResizeObserver(syncStartScreenChangelogHeight);
                observer.observe(form);
            }
        }

        let player = {};
        let currentMatch = null;
        let drawnDarts = [];
        let currentTurnScore = 0;
        let currentDate = new Date(2026, 0, 1);
        let emails = [];
        let unreadMailsCount = 0;
        let activeTournament = null;
        let gdlTable = []; // Przechowuje statystyki Global Darts League
        let currentWalkonAudio = null; 
        let crowdAudio = null;         
        let postMatchAudio = null;     
        let oppAudio = null;           // Muzyka rywala
        let walkonTimeout = null;      // Zegar muzyki
        let walkonInterval = null;     // Zegar ściszania
        let isWalkonSkipped = false;   // Flaga pomijania
        let globalVolume = 1.0;
        let isSkippingTournament = false;

        function changeVolume(val) {
            globalVolume = parseFloat(val);
            if (crowdAudio) crowdAudio.volume = 0.15 * globalVolume;
            if (postMatchAudio) postMatchAudio.volume = 0.5 * globalVolume;
            if (currentWalkonAudio) currentWalkonAudio.volume = 0.6 * globalVolume;
            if (oppAudio) oppAudio.volume = 0.6 * globalVolume;
        }
        
        const dartboardOrder = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

        // --- 2. INICJALIZACJA GRY ---
        window.onload = function() {
    changeLanguage('en'); // <--- DODAJ TĘ LINIJKĘ TUTAJ

    if(typeof pdcPlayers !== 'undefined') {
        normalizePlayerIds(pdcPlayers, player);
        initPlayersForm();
    }
    updateDateDisplay();

    renderNationalityDropdown();

            const selectSector = document.getElementById('aim-sector');
            if(selectSector) {
                selectSector.innerHTML = "";
                for(let i = 20; i >= 1; i--) selectSector.innerHTML += `<option value="${i}">${i}</option>`;
                selectSector.innerHTML += `<option value="25">25 (Outer Bull)</option>`;
                selectSector.innerHTML += `<option value="50">50 (Inner Bull)</option>`;
            }

            const selectMultiplier = document.getElementById('aim-multiplier');
            if (selectSector && selectMultiplier) {
                selectSector.addEventListener('change', function() {
                    if (this.value === "25") {
                        selectMultiplier.value = "1";
                        selectMultiplier.disabled = true;
                    } else if (this.value === "50") {
                        selectMultiplier.value = "2";
                        selectMultiplier.disabled = true;
                    } else {
                        selectMultiplier.disabled = false;
                    }
                });
            }

            const favoriteDoubleSelect = document.getElementById('favorite-double');
            if (favoriteDoubleSelect) {
                favoriteDoubleSelect.innerHTML = "";
                for (let i = 20; i >= 1; i--) {
                    favoriteDoubleSelect.innerHTML += `<option value="${i}" ${i === 20 ? 'selected' : ''}>D${i}</option>`;
                }
            }
            
            renderOpponentOptions();
            requestAnimationFrame(setupStartScreenLayoutSync);
        };

        function updatePotentialHint() {
            const val = document.getElementById('potential').value;
            let ovr = 55;
            if (val === 'weak') ovr = 45;
            else if (val === 'medium') ovr = 55;
            else if (val === 'good') ovr = 65;
            else if (val === 'very_good') ovr = 75;
            else if (val === 'goat') ovr = 82;
            
            const hintEl = document.getElementById('potential-hint');
            if (hintEl) {
                // Tłumaczenie dla różnych języków
                let prefix = currentLang === 'pl' ? 'Początkowy OVR:' : (currentLang === 'de' ? 'Start-OVR:' : (currentLang === 'nl' ? 'Start-OVR:' : 'Starting OVR:'));
                hintEl.innerText = `${prefix} ~${ovr}`;
            }
        }

        function initPlayersForm() {
            normalizePlayerIds(pdcPlayers, player);
            pdcPlayers.forEach(p => {
                p.baseOvr = p.ovr;
                p.baseScoring = p.scoring;
                p.baseDoubles = p.doubles;
                p.form = Math.floor(Math.random() * 5) - 2; 
                // NOWOŚĆ: Historia dla 1-rocznego PT i 2-letniego OOM
                p.historyPT = {}; 
                p.historyMain = {};
                applyForm(p);
            });
            renderCareerPlayerOptions();
        }

        function applyForm(p) {
            p.ovr = p.baseOvr + p.form;
            p.scoring = p.baseScoring + p.form;
            p.doubles = p.baseDoubles + p.form;
        }

        function updateAllPlayersForm() {
            pdcPlayers.forEach(p => {
                let formChange = Math.floor(Math.random() * 3) - 1;
                p.form += formChange;
                if(p.form > 5) p.form = 5;
                if(p.form < -5) p.form = -5;
                applyForm(p);
            });
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        // Niezależne od implementacji sort() i statystycznie równomierne tasowanie.
        function shuffle(items) {
            const shuffled = [...items];
            for (let index = shuffled.length - 1; index > 0; index--) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
            }
            return shuffled;
        }

        function getDisplayedOvr(p) {
            return Math.round(isCurrentPlayer(p) ? player.overall : p.ovr);
        }

        function ensureBaseRatings(p) {
            if (typeof p.baseOvr !== 'number') p.baseOvr = p.ovr;
            if (typeof p.baseScoring !== 'number') p.baseScoring = p.scoring;
            if (typeof p.baseDoubles !== 'number') p.baseDoubles = p.doubles;
        }

        function changeTournamentOverall(p, delta) {
            if (!p || !Number.isFinite(delta)) return;

            if (isCurrentPlayer(p)) {
                const previous = player.overall;
                player.overall = clamp(previous + delta, 45, 99);
                const appliedDelta = player.overall - previous;
                player.ovr = player.overall;
                player.scoring = clamp(player.scoring + appliedDelta, 45, 100);
                player.doubles = clamp(player.doubles + appliedDelta, 40, 99);
                return;
            }

            ensureBaseRatings(p);
            const previous = p.baseOvr;
            p.baseOvr = clamp(previous + delta, 45, 99);
            const appliedDelta = p.baseOvr - previous;
            p.baseScoring = clamp(p.baseScoring + appliedDelta, 45, 100);
            p.baseDoubles = clamp(p.baseDoubles + appliedDelta, 40, 99);
            applyForm(p);
        }

        function getTournamentSimulationProfile(tournament = activeTournament) {
            const name = (tournament?.name || '').toLowerCase();
            const profile = {
                key: 'standard', ratingScale: 25, formSpread: 3, matchNoise: 1.5,
                underdogHotChance: 0.05, hotRunMin: 3, hotRunRange: 3,
                favoriteColdChance: 0.04, coldRunMin: 2, coldRunRange: 3, maxForm: 7
            };

            // Krótsze turnieje są bardziej podatne na „dzień konia” zawodnika.
            if ((name.includes('players championship') || name.includes('pro players cup')) && !name.includes('final')) {
                return { ...profile, key: 'floor', ratingScale: 30, formSpread: 5, matchNoise: 2.5, underdogHotChance: 0.10, hotRunMin: 4, hotRunRange: 4, favoriteColdChance: 0.08, coldRunMin: 3, coldRunRange: 3, maxForm: 10 };
            }
            if (name.includes('european tour') || name.includes('continental tour')) {
                return { ...profile, key: 'european', ratingScale: 28, formSpread: 4, matchNoise: 2, underdogHotChance: 0.08, hotRunMin: 4, hotRunRange: 3, favoriteColdChance: 0.06, coldRunMin: 2, coldRunRange: 3, maxForm: 9 };
            }
            if (name.includes('uk open') || name.includes('british open') || name.includes('european championship') || name.includes('continental championship')) {
                return { ...profile, key: 'open', ratingScale: 27, formSpread: 4, matchNoise: 2, underdogHotChance: 0.07, hotRunMin: 3, hotRunRange: 3, favoriteColdChance: 0.05, coldRunMin: 2, coldRunRange: 3, maxForm: 8 };
            }
            if (name.includes('global darts league') || name.includes('premier')) {
                return { ...profile, key: 'league', ratingScale: 22, formSpread: 2, matchNoise: 1, underdogHotChance: 0.02, hotRunMin: 2, hotRunRange: 2, favoriteColdChance: 0.02, coldRunMin: 2, coldRunRange: 2, maxForm: 4 };
            }
            if (name.includes('world darts championship') || name.includes('global darts championship') || name.includes('matchplay') || name.includes('grand prix') || name.includes('champion\'s slam') || name.includes('grand slam') || name.includes('finals')) {
                return { ...profile, key: 'major', ratingScale: 23, formSpread: 2, matchNoise: 1, underdogHotChance: 0.03, hotRunMin: 2, hotRunRange: 2, favoriteColdChance: 0.03, coldRunMin: 2, coldRunRange: 2, maxForm: 5 };
            }
            return profile;
        }

        function getSimulationPlayerKey(candidate) {
            if (!candidate || candidate.isBye) return '';
            return typeof candidate.id === 'string' && candidate.id ? candidate.id : candidate.name;
        }

        function getTournamentSimulationForm(candidate) {
            const key = getSimulationPlayerKey(candidate);
            const form = activeTournament?.simulationForm?.[key];
            return Number.isFinite(form) ? form : 0;
        }

        // Forma jest losowana raz na cały turniej. Dzięki temu niżej notowany gracz,
        // który „ma dzień konia”, może realnie utrzymać poziom przez kilka rund.
        function prepareTournamentSimulationForm(participants) {
            if (!activeTournament || !Array.isArray(participants)) return;

            const profile = getTournamentSimulationProfile(activeTournament);
            const rankedPlayers = [...pdcPlayers, player].sort((a, b) => (b.prizeMoney || 0) - (a.prizeMoney || 0));
            const rankByKey = new Map(rankedPlayers.map((candidate, index) => [getSimulationPlayerKey(candidate), index + 1]));
            const simulationForm = {};

            participants.forEach(candidate => {
                const key = getSimulationPlayerKey(candidate);
                if (!key || candidate.isBye || Object.prototype.hasOwnProperty.call(simulationForm, key)) return;

                const rank = rankByKey.get(key) || rankedPlayers.length;
                let modifier = (Math.random() + Math.random() - 1) * profile.formSpread;

                // Zawodnicy spoza Top 30 częściej mogą zagrać turniej życia,
                // a ścisła czołówka czasem trafia na słabszy weekend.
                if (rank > 30 && Math.random() < profile.underdogHotChance) {
                    modifier += profile.hotRunMin + (Math.random() * profile.hotRunRange);
                }
                if (rank <= 12 && Math.random() < profile.favoriteColdChance) {
                    modifier -= profile.coldRunMin + (Math.random() * profile.coldRunRange);
                }

                simulationForm[key] = Math.round(clamp(modifier, -profile.maxForm, profile.maxForm) * 10) / 10;
            });

            activeTournament.simulationForm = simulationForm;
        }

        function getTournamentWinChance(p1, p2, includeMatchNoise = true) {
            const profile = getTournamentSimulationProfile(activeTournament);
            let p1Ovr = (isCurrentPlayer(p1) ? player.overall : p1.ovr) + getTournamentSimulationForm(p1);
            let p2Ovr = (isCurrentPlayer(p2) ? player.overall : p2.ovr) + getTournamentSimulationForm(p2);

            if (includeMatchNoise) {
                p1Ovr += (Math.random() + Math.random() - 1) * profile.matchNoise;
                p2Ovr += (Math.random() + Math.random() - 1) * profile.matchNoise;
            }

            return 1 / (1 + Math.exp(-(p1Ovr - p2Ovr) / profile.ratingScale));
        }

        function applyTournamentRatingChange(winner, loser, round) {
            const expectedWinner = getTournamentWinChance(winner, loser, false);
            
            // 1. Zmniejszone mnożniki dla rund (znacznie wolniejszy przyrost OVR za pojedynczy mecz)
            const roundWeight = round === 2 ? 0.8 : round === 4 ? 0.6 : round === 8 ? 0.5 : 0.3;
            
            // 2. Zbalansowany system Elo (żeby średni OVR w lidze się zgadzał)
            let winnerDelta = (1 - expectedWinner) * 0.8 * roundWeight;
            let loserDelta = -(expectedWinner) * 0.8 * roundWeight;

            // 3. "Szklany sufit" dla czołówki - drastycznie obcinamy punkty powyżej 90 OVR
            const winnerOvr = isCurrentPlayer(winner) ? player.overall : (winner.baseOvr || winner.ovr);
            if (winnerOvr >= 90) {
                // Przy 95 OVR gracz dostaje 40% punktów, przy 98 OVR zaledwie 10%.
                winnerDelta *= Math.max(0.1, (99 - winnerOvr) / 10); 
            }

            changeTournamentOverall(winner, winnerDelta);
            changeTournamentOverall(loser, loserDelta);
        }

        // --- SŁOWNIK TŁUMACZEŃ (UI) ---
        
