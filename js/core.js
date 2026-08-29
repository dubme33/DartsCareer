
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

        const AGE_DEVELOPMENT_PROFILES = Object.freeze({
            // Młodzi reagują na wyniki nieco szybciej w obie strony. Dawne ×1,65
            // wzrostu przy zaledwie ×0,8 spadku stale pompowało OVR całej grupy.
            young: {
                growthMultiplier: 1.15,
                declineMultiplier: 1.15,
                // Zachowujemy dotychczasowe tempo kariery gracza. Ta korekta
                // dotyczy inflacji w puli AI, a nie jego treningu i rozwoju.
                careerGrowthMultiplier: 1.25,
                careerDeclineMultiplier: 0.8
            },
            prime: { growthMultiplier: 1, declineMultiplier: 1 },
            // Wyniki weteranów nadal zmieniają ich poziom, ale w obie strony
            // jednakowo wolniej. Dzięki temu sam bilans meczów nie tworzy
            // dodatkowej, ukrytej kary wieku ponad coroczny regres.
            veteran: { growthMultiplier: 0.9, declineMultiplier: 0.9 }
        });

        function getAgeDevelopmentProfile(candidate, referenceDate = currentDate) {
            const age = getPlayerAge(candidate, referenceDate);
            if (!Number.isInteger(age)) return AGE_DEVELOPMENT_PROFILES.prime;
            if (age < 25) return AGE_DEVELOPMENT_PROFILES.young;
            if (age >= 44) return AGE_DEVELOPMENT_PROFILES.veteran;
            return AGE_DEVELOPMENT_PROFILES.prime;
        }

        function scalePlayerDevelopmentChange(candidate, change, referenceDate = currentDate) {
            const numericChange = Number(change);
            if (!Number.isFinite(numericChange) || numericChange === 0) return 0;
            const profile = getAgeDevelopmentProfile(candidate, referenceDate);
            const isCareerPlayer = typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
            const growthMultiplier = isCareerPlayer && Number.isFinite(profile.careerGrowthMultiplier)
                ? profile.careerGrowthMultiplier
                : profile.growthMultiplier;
            const declineMultiplier = isCareerPlayer && Number.isFinite(profile.careerDeclineMultiplier)
                ? profile.careerDeclineMultiplier
                : profile.declineMultiplier;
            return numericChange > 0
                ? numericChange * growthMultiplier
                : numericChange * declineMultiplier;
        }

        function samePlayer(first, second) {
            return Boolean(first && second && first.id && second.id && first.id === second.id);
        }

        const playerNameAliases = Object.freeze({
            // W starszych zapisach nazwisko Sebastiana Białeckiego było zapisane z literówką.
            'sebastian bielicki': 'sebastian bialecki',
            // Kopie dodane dawniej do regionalnych składów reprezentacji.
            'cor dekar': 'cor deckers',
            'jim longe': 'jimmy longley',
            'oscar lucasi': 'oscar lukas',
            'viktor tingren': 'victor tingstrom',
            'adam leeke': 'adam leak'
        });

        function normalizePlayerIdentityPart(value) {
            return String(value || '')
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/ł/gi, 'l')
                .replace(/\s+/g, ' ')
                .toLocaleLowerCase('pl');
        }

        function getCanonicalPlayerIdentityKey(candidate) {
            if (!candidate || candidate.isBye) return '';
            // Mod może podmienić nazwę wyświetlaną, zachowując sourceName jako
            // stabilne powiązanie z zawodnikiem z bazy podstawowej.
            const rawName = normalizePlayerIdentityPart(candidate.sourceName || candidate.name);
            const name = playerNameAliases[rawName] || rawName;
            const country = normalizePlayerIdentityPart(candidate.country);
            return name && country ? `${name}|${country}` : '';
        }

        function isCareerPlayerDuplicate(candidate, careerPlayer = player) {
            if (!candidate || !careerPlayer || candidate.isBye || careerPlayer.isBye) return false;
            if (samePlayer(candidate, careerPlayer)) return true;
            const candidateKey = getCanonicalPlayerIdentityKey(candidate);
            const careerKey = getCanonicalPlayerIdentityKey(careerPlayer);
            return Boolean(candidateKey && careerKey && candidateKey === careerKey);
        }

        function removeCareerPlayerFromAiPool() {
            if (!Array.isArray(pdcPlayers) || !player) return 0;
            const initialCount = pdcPlayers.length;
            const remainingPlayers = pdcPlayers.filter(candidate => !isCareerPlayerDuplicate(candidate));
            if (remainingPlayers.length !== initialCount) {
                pdcPlayers.splice(0, pdcPlayers.length, ...remainingPlayers);
            }
            return initialCount - remainingPlayers.length;
        }

        function repairCareerTournamentBracket(bracket) {
            if (!Array.isArray(bracket)) return bracket;

            let careerPlayerIncluded = false;
            return bracket.map(candidate => {
                if (!isCareerPlayerDuplicate(candidate)) return candidate;
                if (!careerPlayerIncluded) {
                    careerPlayerIncluded = true;
                    return player;
                }
                return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
            });
        }

        function isCurrentPlayer(candidate) {
            // ID jest podstawowym identyfikatorem, ale stare zapisy mogły mieć
            // własny wpis kariery i wpis AI tej samej osoby pod różnymi ID.
            return isCareerPlayerDuplicate(candidate);
        }

        function renderOpponentOptions() {
            const opponentSelect = document.getElementById('opponent-select');
            if (!opponentSelect || typeof pdcPlayers === 'undefined') return;

            opponentSelect.replaceChildren();
            pdcPlayers.forEach((candidate, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${candidate.name} (OVR: ${getDisplayedOvr(candidate)})`;
                opponentSelect.appendChild(option);
            });
        }

        function getCareerStartPlayers() {
            if (typeof pdcPlayers === 'undefined') return [];
            // Ta sama historia nagród i data co w głównym rankingu gry.
            // W trwającej karierze uwzględniamy też gracza przy ochronie Top 64.
            if (typeof refreshMainOrderOfMerit === 'function') {
                const rankedPlayers = typeof player !== 'undefined' && player?.name
                    ? [...pdcPlayers, player] : pdcPlayers;
                refreshMainOrderOfMerit(rankedPlayers, currentDate);
            }
            return pdcPlayers
                .filter(candidate => candidate && !candidate.isBye)
                .slice()
                .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
        }

        function getCareerStartPlayerStats(candidate) {
            const asNumber = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
            // Forma AI jest tymczasowa i nie może stać się trwałym OVR gracza.
            // Lista, podgląd i utworzona kariera korzystają z tych samych ocen.
            const overall = Math.round(asNumber(candidate.baseOvr ?? candidate.ovr ?? candidate.overall, 55));
            return {
                overall,
                scoring: Math.round(asNumber(candidate.baseScoring ?? candidate.scoring, overall)),
                doubles: Math.round(asNumber(candidate.baseDoubles ?? candidate.doubles, overall)),
                prizeMoney: asNumber(candidate.prizeMoney, 0),
                proTourPrizeMoney: asNumber(candidate.proTourPrizeMoney, 0),
                pcPrizeMoney: asNumber(candidate.pcPrizeMoney, 0),
                europeanTourPrizeMoney: asNumber(candidate.europeanTourPrizeMoney, 0)
            };
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
                    const stats = getCareerStartPlayerStats(candidate);
                    const option = document.createElement('option');
                    option.value = candidate.id;
                    option.textContent = `${candidate.name} — ${t(candidate.country)} · OVR ${stats.overall} · OOM #${index + 1} · £${stats.prizeMoney.toLocaleString('en-GB')}`;
                    select.appendChild(option);
                });
                select.disabled = false;
                if (candidates.some(candidate => candidate.id === previousValue)) select.value = previousValue;
            }

            updateExistingPlayerPreview(candidates);
        }

        function updateExistingPlayerPreview(candidates = null) {
            const select = document.getElementById('existing-player-select');
            const preview = document.getElementById('existing-player-preview');
            if (!select || !preview) return;

            const availablePlayers = Array.isArray(candidates) ? candidates : getCareerStartPlayers();
            const candidate = availablePlayers.find(item => item && item.id === select.value);
            if (!candidate) {
                preview.textContent = trCareerStart('empty');
                return;
            }

            const stats = getCareerStartPlayerStats(candidate);
            const rank = availablePlayers.findIndex(item => item.id === candidate.id) + 1;
            preview.textContent = trCareerStart('preview', {
                country: t(candidate.country),
                ovr: stats.overall,
                rank,
                prize: stats.prizeMoney.toLocaleString('en-GB')
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
        window.onload = async function() {
    changeLanguage('en'); // <--- DODAJ TĘ LINIJKĘ TUTAJ

    if (typeof waitForPersistedModRestore === 'function') {
        await waitForPersistedModRestore();
    }

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
                removeLegacyPlayerForm(p);
                enforcePlayerRatingLimits(p);
                // Historia ProTour (52 tygodnie) i 2-letniego głównego OOM.
                p.historyPT = {}; 
                p.historyMain = {};
                applyForm(p);
            });
            renderCareerPlayerOptions();
        }

        function applyForm(p) {
            // Zachowujemy dawną nazwę funkcji dla rozwoju i starzenia zawodników,
            // ale oceny nie otrzymują już losowego modyfikatora formy.
            p.form = 0;
            p.ovr = clamp(Math.round(p.baseOvr), 40, 99);
            p.scoring = clamp(Math.round(p.baseScoring), 40, 100);
            p.doubles = clamp(Math.round(p.baseDoubles), 40, 100);
            if (Object.prototype.hasOwnProperty.call(p, 'overall')) p.overall = p.ovr;
        }

        function removeLegacyPlayerForm(candidate, careerPlayer = null) {
            if (!candidate || candidate.isBye) return;
            // Oceny gracza rosną m.in. przez trening, niezależnie od baseOvr.
            // Dawna forma nie była do nich dodawana, więc niczego nie odejmujemy.
            if (candidate === careerPlayer) {
                candidate.form = 0;
                return;
            }

            const legacyForm = Number.isFinite(Number(candidate.form)) ? Math.round(Number(candidate.form)) : 0;
            const overall = Number(candidate.ovr ?? candidate.overall);
            [['ovr', 'baseOvr', 99], ['scoring', 'baseScoring', 100], ['doubles', 'baseDoubles', 100]]
                .forEach(([field, baseField, max]) => {
                    const base = candidate[baseField] == null ? NaN : Number(candidate[baseField]);
                    const current = Number(candidate[field] ?? overall);
                    // Pełna baza zachowuje rozwój i pozwala odtworzyć oceny nawet
                    // wtedy, gdy stary wynik z formą był przycięty do 40 lub 99.
                    candidate[baseField] = clamp(Number.isFinite(base) ? base
                        : (Number.isFinite(current) ? current - legacyForm : 55), 40, max);
                });
            applyForm(candidate);
        }

        function updateAllPlayersForm() {
            pdcPlayers.forEach(candidate => removeLegacyPlayerForm(candidate));
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

        function enforcePlayerRatingLimits(candidate, careerPlayer = null) {
            if (!candidate || candidate.isBye) return;

            const clampRating = (value, min, max, fallback) => {
                const numericValue = Number(value);
                return Number.isFinite(numericValue)
                    ? clamp(numericValue, min, max)
                    : fallback;
            };

            // Zapis przechowuje także ułamkowy rozwój. Zaokrąglamy dopiero
            // w interfejsie (oraz ocenach AI w applyForm), nigdy jego bazę.
            const currentOverall = candidate === careerPlayer
                ? candidate.overall ?? candidate.ovr : candidate.ovr ?? candidate.overall;
            const overall = clampRating(currentOverall, 40, 99, 55);
            candidate.ovr = overall;
            if (Object.prototype.hasOwnProperty.call(candidate, 'overall')) candidate.overall = overall;
            candidate.scoring = clampRating(candidate.scoring, 40, 100, overall);
            candidate.doubles = clampRating(candidate.doubles, 40, 100, overall);

            if (Object.prototype.hasOwnProperty.call(candidate, 'baseOvr')) candidate.baseOvr = clampRating(candidate.baseOvr, 40, 99, overall);
            if (Object.prototype.hasOwnProperty.call(candidate, 'baseScoring')) candidate.baseScoring = clampRating(candidate.baseScoring, 40, 100, candidate.scoring);
            if (Object.prototype.hasOwnProperty.call(candidate, 'baseDoubles')) candidate.baseDoubles = clampRating(candidate.baseDoubles, 40, 100, candidate.doubles);
        }

        function ensureBaseRatings(p) {
            if (typeof p.baseOvr !== 'number') p.baseOvr = p.ovr;
            if (typeof p.baseScoring !== 'number') p.baseScoring = p.scoring;
            if (typeof p.baseDoubles !== 'number') p.baseDoubles = p.doubles;
        }

        function changeTournamentOverall(p, delta) {
            if (!p || !Number.isFinite(delta)) return;
            const ageAdjustedDelta = scalePlayerDevelopmentChange(p, delta);

            if (isCurrentPlayer(p)) {
                const previous = player.overall;
                player.overall = clamp(previous + ageAdjustedDelta, 45, 99);
                const appliedDelta = player.overall - previous;
                player.ovr = player.overall;
                player.scoring = clamp(player.scoring + appliedDelta, 45, 100);
                player.doubles = clamp(player.doubles + appliedDelta, 40, 100);
                return;
            }

            ensureBaseRatings(p);
            const previous = p.baseOvr;
            p.baseOvr = clamp(previous + ageAdjustedDelta, 45, 99);
            const appliedDelta = p.baseOvr - previous;
            p.baseScoring = clamp(p.baseScoring + appliedDelta, 45, 100);
            p.baseDoubles = clamp(p.baseDoubles + appliedDelta, 40, 100);
            applyForm(p);
        }

        function getTournamentSimulationProfile(tournament = activeTournament) {
            const name = (tournament?.name || '').toLowerCase();
            const profile = {
                key: 'standard', ratingScale: 28, formSpread: 4, matchNoise: 2.2,
                underdogHotChance: 0.09, hotRunMin: 3, hotRunRange: 4, underdogRank: 24,
                favoriteColdChance: 0.06, coldRunMin: 2, coldRunRange: 3, favoriteRank: 12, maxForm: 9
            };

            // Krótsze turnieje są bardziej podatne na „dzień konia” zawodnika.
            if ((name.includes('players championship') || name.includes('pro players cup')) && !name.includes('final')) {
                return { ...profile, key: 'floor', ratingScale: 36, formSpread: 6.5, matchNoise: 4.2, underdogHotChance: 0.18, hotRunMin: 5, hotRunRange: 6, underdogRank: 16, favoriteColdChance: 0.13, coldRunMin: 3, coldRunRange: 4, favoriteRank: 16, maxForm: 14 };
            }
            if (name.includes('european tour') || name.includes('continental tour')) {
                // European Tour sprzyja niespodziankom, ale jest nieco bardziej
                // przewidywalny od turniejów podłogowych.
                return { ...profile, key: 'european', ratingScale: 33, formSpread: 5.3, matchNoise: 3.4, underdogHotChance: 0.14, hotRunMin: 4, hotRunRange: 5, underdogRank: 20, favoriteColdChance: 0.09, coldRunMin: 3, coldRunRange: 3, favoriteRank: 14, maxForm: 11 };
            }
            if (name.includes('uk open') || name.includes('british open') || name.includes('european championship') || name.includes('continental championship')) {
                return { ...profile, key: 'open', ratingScale: 30, formSpread: 4.5, matchNoise: 2.6, underdogHotChance: 0.10, hotRunMin: 3, hotRunRange: 4, underdogRank: 24, favoriteColdChance: 0.07, coldRunMin: 2, coldRunRange: 3, favoriteRank: 14, maxForm: 10 };
            }
            if (name.includes('global darts league') || name.includes('premier')) {
                return { ...profile, key: 'league', ratingScale: 23, formSpread: 2.5, matchNoise: 1.2, underdogHotChance: 0.035, hotRunMin: 2, hotRunRange: 3, underdogRank: 18, favoriteColdChance: 0.03, coldRunMin: 2, coldRunRange: 2, favoriteRank: 8, maxForm: 5 };
            }
            if (name.includes('world darts championship') || name.includes('global darts championship') || name.includes('matchplay') || name.includes('grand prix') || name.includes('champion\'s slam') || name.includes('grand slam') || name.includes('finals')) {
                return { ...profile, key: 'major', ratingScale: 25.5, formSpread: 3, matchNoise: 1.6, underdogHotChance: 0.055, hotRunMin: 3, hotRunRange: 3, underdogRank: 24, favoriteColdChance: 0.045, coldRunMin: 2, coldRunRange: 2, favoriteRank: 12, maxForm: 7 };
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

        // Pojedynczy wyjątkowy mecz jest czymś innym niż forma na cały turniej.
        // AI od 80 OVR może zagrać mecz życia, lecz zawodnicy z czołówki robią to
        // zauważalnie częściej. Nie zmienia to ich trwałych ocen.
        function rollAiPeakMatchPerformance(candidate, random = Math.random) {
            const overall = Number(candidate?.ovr ?? candidate?.overall) || 0;
            const isCareerPlayer = typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
            if (!candidate || candidate.isBye || isCareerPlayer || overall < 80) return null;

            const isElite = overall >= 88;
            const chance = isElite
                ? Math.min(0.08, 0.018 + ((overall - 88) * 0.007))
                : Math.min(0.016, 0.003 + ((overall - 80) * 0.0015));
            if (random() >= chance) return null;

            return {
                ratingBoost: isElite ? 3 + (random() * 2) : 5 + (random() * 2),
                accuracyBoost: isElite ? 8 + (random() * 5) : 13 + (random() * 5),
                averageFloor: isElite
                    ? Math.min(120, 105 + ((overall - 88) * 0.8) + (random() * 3))
                    : Math.min(116, 108 + ((overall - 80) * 0.35) + (random() * 3))
            };
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
                if (typeof getConsistencySpread === 'function') modifier *= getConsistencySpread(candidate);

                // Zawodnicy spoza rozstawionej czołówki częściej mogą zagrać turniej życia,
                // a ścisła czołówka czasem trafia na słabszy weekend. Parametry zależą
                // od rangi turnieju, aby Majory nie zamieniły się w loterię.
                if (rank > profile.underdogRank && Math.random() < profile.underdogHotChance) {
                    modifier += profile.hotRunMin + (Math.random() * profile.hotRunRange);
                }
                if (rank <= profile.favoriteRank && Math.random() < profile.favoriteColdChance) {
                    modifier -= profile.coldRunMin + (Math.random() * profile.coldRunRange);
                }

                simulationForm[key] = Math.round(clamp(modifier, -profile.maxForm, profile.maxForm) * 10) / 10;
            });

            activeTournament.simulationForm = simulationForm;
        }

        function getTournamentWinChance(p1, p2, includeMatchNoise = true) {
            const profile = getTournamentSimulationProfile(activeTournament);
            const p1IsCareer = isCurrentPlayer(p1), p2IsCareer = isCurrentPlayer(p2);
            let p1Ratings = p1IsCareer ? player : p1;
            let p2Ratings = p2IsCareer ? player : p2;
            if (typeof getWorldMastersMatchRatings === 'function') {
                p1Ratings = getWorldMastersMatchRatings(p1, p1Ratings);
                p2Ratings = getWorldMastersMatchRatings(p2, p2Ratings);
            }
            let p1Ovr = (p1IsCareer ? p1Ratings.overall : p1Ratings.ovr) + getTournamentSimulationForm(p1);
            let p2Ovr = (p2IsCareer ? p2Ratings.overall : p2Ratings.ovr) + getTournamentSimulationForm(p2);

            if (includeMatchNoise) {
                p1Ovr += (Math.random() + Math.random() - 1) * profile.matchNoise * (typeof getConsistencySpread === 'function' ? getConsistencySpread(p1) : 1);
                p2Ovr += (Math.random() + Math.random() - 1) * profile.matchNoise * (typeof getConsistencySpread === 'function' ? getConsistencySpread(p2) : 1);
            }

            return 1 / (1 + Math.exp(-(p1Ovr - p2Ovr) / profile.ratingScale));
        }

        const AI_TOURNAMENT_RATING_TRANSFER = 0.2;
        const CAREER_TOURNAMENT_RATING_TRANSFER = 0.8;

        function getTournamentRatingTransferFactor(candidate) {
            const rating = Number(isCurrentPlayer(candidate) ? player.overall
                : candidate?.baseOvr ?? candidate?.ovr ?? candidate?.overall);
            if (!Number.isFinite(rating) || rating <= 85) return 1;
            // Wynik wciąż może przesunąć elitę, lecz jeden dobry sezon nie powinien
            // zamieniać kilkunastu graczy 85–89 OVR w kolejną grupę 90+.
            return Math.max(0.08, (97 - rating) / 12);
        }

        function applyTournamentRatingChange(winner, loser, round) {
            const expectedWinner = getTournamentWinChance(winner, loser, false);

            // Finały ważą więcej, lecz przy ponad 60 imprezach w sezonie nawet
            // wczesna runda musi być jedynie małą korektą długoterminowej oceny.
            const roundWeight = round === 2 ? 0.8 : round === 4 ? 0.6 : round === 8 ? 0.5 : 0.3;

            // Prawdziwy transfer Elo: dokładnie ta sama bazowa wartość trafia do
            // zwycięzcy i znika u przegranego. Poprzedni wzór odejmował od przegranego
            // expectedWinner zamiast 1 - expectedWinner, więc niespodzianki tworzyły OVR.
            // Mecze kariery zachowują dotychczasową siłę nagrody dla prowadzonego
            // zawodnika. Mniejszy współczynnik stosujemy do licznych spotkań AI–AI,
            // które były źródłem inflacji całej czołówki rankingu.
            const transferRate = isCurrentPlayer(winner) || isCurrentPlayer(loser)
                ? CAREER_TOURNAMENT_RATING_TRANSFER
                : AI_TOURNAMENT_RATING_TRANSFER;
            const transfer = (1 - expectedWinner) * transferRate * roundWeight
                * Math.min(getTournamentRatingTransferFactor(winner), getTournamentRatingTransferFactor(loser));
            changeTournamentOverall(winner, transfer);
            changeTournamentOverall(loser, -transfer);
        }

        // --- SŁOWNIK TŁUMACZEŃ (UI) ---
        
