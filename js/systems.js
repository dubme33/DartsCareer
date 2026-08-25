function showOpponentSelection() { showScreen('screen-select-opponent'); }
        function updateDartDots() {
            for(let i=1; i<=3; i++) {
                let dot = document.getElementById(`dart-dot-${i}`);
                if(dot) { dot.classList.remove('active'); if (i <= currentMatch.dartsThrown) dot.classList.add('active'); }
            }
        }
    
    // --- SYSTEM ZAPISU I WCZYTYWANIA GRY ---

        // Podczas migracji starego zapisu dwa wpisy tego samego zawodnika mogą mieć
        // różne ID. Mapa pozwala nadal odtworzyć ich referencje w drabinkach i tabelach.
        let pdcPlayerIdAliases = new Map();

        function getWorldCupPlayerSaveReference(candidate) {
            if (!candidate || typeof candidate !== 'object') return candidate;

            // Kwalifikanci spoza bazy zawodników nie mają odpowiednika do odtworzenia po
            // wczytaniu, więc zachowujemy ich pełne, niewielkie obiekty.
            if (candidate.isWorldCupGuest) return { ...candidate };

            return getPlayerSaveReference(candidate);
        }

        function getPlayerSaveReference(candidate) {
            if (!candidate || typeof candidate !== 'object') return candidate;
            if (candidate.isBye) return { ...candidate };

            const knownPlayers = [player, ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])];
            const savedPlayer = knownPlayers.find(known => samePlayer(known, candidate));

            // Zawodnicy z bazy są już zapisani w player/pdcPlayers. Ponowne zapisywanie
            // ich historii w drabince, tabeli ligi i zespołach tylko zużywa localStorage.
            if (!savedPlayer) return { ...candidate };
            return {
                id: savedPlayer.id,
                name: savedPlayer.name,
                country: savedPlayer.country
            };
        }

        function getActiveTournamentSaveReference(tournament) {
            if (!isPlainObject(tournament)) return tournament || null;
            return {
                name: tournament.name,
                month: tournament.month,
                day: tournament.day,
                specialType: tournament.specialType
            };
        }

        function getSaveStateWithoutProfileMedia(gameState) {
            return {
                ...gameState,
                player: {
                    ...gameState.player,
                    photo: '',
                    walkon: null
                }
            };
        }

        function getWorldCupStateForSave(state) {
            if (!isPlainObject(state)) return null;
            return {
                ...state,
                teams: Array.isArray(state.teams)
                    ? state.teams.map(team => ({
                        ...team,
                        players: Array.isArray(team.players)
                            ? team.players.map(getWorldCupPlayerSaveReference)
                            : []
                    }))
                    : []
            };
        }

        function buildGameState() {
            return {
                version: 2,
                player, pdcPlayers, tournamentDatabase,
                currentDate: currentDate.getTime(), emails, unreadMailsCount,
                gdlTable: Array.isArray(gdlTable)
                    ? gdlTable.map(row => isPlainObject(row) ? { ...row, player: getPlayerSaveReference(row.player) } : row)
                    : [],
                activeTournament: getActiveTournamentSaveReference(activeTournament),
                tournamentRound,
                tournamentBracket: Array.isArray(tournamentBracket) ? tournamentBracket.map(getPlayerSaveReference) : [],
                preTournamentRanks,
                lastTournamentResults, currentRoundHTML,
                worldCupState: typeof worldCupState !== 'undefined' ? getWorldCupStateForSave(worldCupState) : null,
                worldMastersState: typeof worldMastersState !== 'undefined' ? worldMastersState : null,
                grandSlamState: typeof getGrandSlamStateForSave === 'function' ? getGrandSlamStateForSave() : null,
                playerLifecycleState: typeof playerLifecycleState !== 'undefined' ? playerLifecycleState : null
            };
        }

        function isPlainObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        }

        function validateGameState(gameState) {
            if (!isPlainObject(gameState) || !isPlainObject(gameState.player)) {
                throw new Error('Brak danych zawodnika.');
            }
            if (!Array.isArray(gameState.pdcPlayers) || !gameState.pdcPlayers.every(isPlainObject)) {
                throw new Error('Niepoprawna lista zawodników.');
            }
            if (!Array.isArray(gameState.tournamentDatabase) || !gameState.tournamentDatabase.every(isPlainObject)) {
                throw new Error('Niepoprawny kalendarz turniejów.');
            }
            if (Number.isNaN(new Date(gameState.currentDate).getTime())) {
                throw new Error('Niepoprawna data kariery.');
            }
            if (gameState.gdlTable !== undefined && !Array.isArray(gameState.gdlTable)) {
                throw new Error('Niepoprawna tabela ligi.');
            }
            if (gameState.tournamentBracket !== undefined && !Array.isArray(gameState.tournamentBracket)) {
                throw new Error('Niepoprawna drabinka turniejowa.');
            }
        }

        function resolveLoadedPlayer(savedPlayer) {
            if (!savedPlayer || savedPlayer.isBye) return savedPlayer;
            // Referencja z drabinki może wskazywać na zawodnika usuniętego po
            // emeryturze. Nie zwracamy wtedy niepełnego obiektu { id, name,
            // country }, bo nie ma on statystyk potrzebnych do symulacji meczu.
            if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(savedPlayer)) return null;

            const allPlayers = [player, ...pdcPlayers];
            const resolvedId = savedPlayer.id && pdcPlayerIdAliases.has(savedPlayer.id)
                ? pdcPlayerIdAliases.get(savedPlayer.id)
                : savedPlayer.id;
            const playerReference = resolvedId && resolvedId !== savedPlayer.id
                ? { ...savedPlayer, id: resolvedId }
                : savedPlayer;
            const byId = allPlayers.find(candidate => samePlayer(candidate, playerReference));
            if (byId) return byId;

            // Migracja zapisów sprzed wprowadzenia ID. W nowych zapisach działa wyłącznie ścieżka ID.
            if (savedPlayer.name === player.name) return player;
            const matchingAi = pdcPlayers.filter(candidate => candidate.name === savedPlayer.name);
            return matchingAi.length === 1 ? matchingAi[0] : savedPlayer;
        }

        function repairRetiredTournamentBracket(bracket) {
            if (!Array.isArray(bracket)) return [];
            const getIdentity = candidate => {
                if (!candidate || candidate.isBye) return '';
                if (candidate.id) return `id:${candidate.id}`;
                if (typeof getCanonicalPlayerIdentityKey === 'function') return getCanonicalPlayerIdentityKey(candidate);
                return `${candidate.name || ''}|${candidate.country || ''}`;
            };
            const usedIdentities = new Set(bracket.map(getIdentity).filter(Boolean));
            const isUnavailable = candidate => !candidate
                || (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate));
            const replacements = (Array.isArray(pdcPlayers) ? pdcPlayers : [])
                .filter(candidate => candidate && !candidate.isBye && !isUnavailable(candidate)
                    && (typeof isPdcTourCardEligiblePlayer !== 'function' || isPdcTourCardEligiblePlayer(candidate)))
                .sort((first, second) => Number(first.hasTourCard === true) - Number(second.hasTourCard === true)
                    || (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0)
                    || (Number(second.ovr) || 0) - (Number(first.ovr) || 0));

            return bracket.map(candidate => {
                if (!isUnavailable(candidate)) return candidate;
                const replacement = replacements.find(candidate => !usedIdentities.has(getIdentity(candidate)));
                if (!replacement) return { name: 'BYE', isBye: true };
                usedIdentities.add(getIdentity(replacement));
                return replacement;
            });
        }

        function getDefaultMergeRating(candidate) {
            const rating = Number(candidate?.baseOvr ?? candidate?.ovr ?? candidate?.overall);
            return Number.isFinite(rating) ? rating : null;
        }

        function isModReplacementForDefaultPlayer(template, templateIndex) {
            const candidate = pdcPlayers[templateIndex];
            if (!candidate || candidate.isNewgen || candidate.isBye) return false;

            const hasSameName = candidate.name === template.name && candidate.country === template.country;
            if (hasSameName) return false;

            // Nowe mody oznaczają pozycję zawodnika w bazie. Dla starszych zapisów
            // stosujemy bezpieczną migrację: ten sam slot, kraj i zbliżony OVR.
            if (candidate.defaultTemplateIndex === templateIndex) return true;
            if (candidate.country !== template.country) return false;

            const candidateRating = getDefaultMergeRating(candidate);
            const templateRating = getDefaultMergeRating(template);
            return candidateRating !== null && templateRating !== null && Math.abs(candidateRating - templateRating) <= 12;
        }

        function removeDefaultDuplicatesFromModSave() {
            if (typeof defaultPdcPlayerTemplates === 'undefined' || !Array.isArray(defaultPdcPlayerTemplates)) return;

            // W starszych zapisach po modzie prawdziwe nazwisko było już na pozycji
            // bazowego zawodnika, a podczas wczytywania gra dopisywała obok jego
            // domyślną wersję. Usuwamy wyłącznie takie później dopisane kopie.
            defaultPdcPlayerTemplates.forEach((template, templateIndex) => {
                if (!isModReplacementForDefaultPlayer(template, templateIndex)) return;
                const defaultKey = `${template.name}|${template.country}`;
                for (let playerIndex = pdcPlayers.length - 1; playerIndex >= 0; playerIndex--) {
                    if (playerIndex === templateIndex) continue;
                    const candidate = pdcPlayers[playerIndex];
                    if (`${candidate?.name}|${candidate?.country}` === defaultKey) {
                        pdcPlayers.splice(playerIndex, 1);
                    }
                }
            });
        }

        function getPdcPlayerDuplicateKey(candidate) {
            if (!candidate || candidate.isBye) return '';
            if (typeof getCanonicalPlayerIdentityKey === 'function') {
                return getCanonicalPlayerIdentityKey(candidate);
            }
            const normalize = value => String(value || '')
                .trim()
                .replace(/\s+/g, ' ')
                .toLocaleLowerCase('pl');
            const name = normalize(candidate.name);
            const country = normalize(candidate.country);
            return name && country ? `${name}|${country}` : '';
        }

        function mergeDuplicatePdcPlayerData(keeper, duplicate) {
            // Zachowujemy dane z głównego wpisu, ale uzupełniamy brakujące elementy
            // (np. historię sezonu albo zdjęcie dodane przez mod).
            ['historyPT', 'historyMain'].forEach(field => {
                if (!isPlainObject(duplicate[field])) return;
                if (!isPlainObject(keeper[field])) keeper[field] = {};
                Object.entries(duplicate[field]).forEach(([key, value]) => {
                    if (keeper[field][key] === undefined) keeper[field][key] = value;
                });
            });

            Object.entries(duplicate).forEach(([key, value]) => {
                if (keeper[key] === undefined || keeper[key] === null || keeper[key] === '') keeper[key] = value;
            });
        }

        function deduplicatePdcPlayers() {
            if (!Array.isArray(pdcPlayers)) return 0;

            const playersByKey = new Map();
            const uniquePlayers = [];
            let removedCount = 0;

            pdcPlayers.forEach(candidate => {
                const key = getPdcPlayerDuplicateKey(candidate);
                if (!key || !playersByKey.has(key)) {
                    if (key) playersByKey.set(key, candidate);
                    uniquePlayers.push(candidate);
                    return;
                }

                const keeper = playersByKey.get(key);
                mergeDuplicatePdcPlayerData(keeper, candidate);
                if (candidate.id && keeper.id && candidate.id !== keeper.id) {
                    pdcPlayerIdAliases.set(candidate.id, keeper.id);
                }
                removedCount++;
            });

            if (removedCount > 0) {
                pdcPlayers.splice(0, pdcPlayers.length, ...uniquePlayers);
            }
            return removedCount;
        }

        function mergeNewDefaultPlayersIntoSave() {
            if (typeof defaultPdcPlayerTemplates === 'undefined' || !Array.isArray(defaultPdcPlayerTemplates)) {
                return deduplicatePdcPlayers();
            }
            removeDefaultDuplicatesFromModSave();
            const retiredPlayerKeys = new Set(typeof playerLifecycleState !== 'undefined' && Array.isArray(playerLifecycleState.retiredPlayerKeys)
                ? playerLifecycleState.retiredPlayerKeys
                : []);
            const getRetiredNameKey = candidate => typeof getLifecyclePlayerNameKey === 'function'
                ? getLifecyclePlayerNameKey(candidate)
                : String(typeof candidate === 'string' ? candidate : candidate?.name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
            const retiredPlayerNames = new Set(typeof playerLifecycleState !== 'undefined' && Array.isArray(playerLifecycleState.retiredPlayerNames)
                ? playerLifecycleState.retiredPlayerNames.map(getRetiredNameKey).filter(Boolean)
                : [...retiredPlayerKeys].map(key => getRetiredNameKey(String(key).split('|')[0])).filter(Boolean));

            // Starsze zapisy lub mody mogły zmienić imię albo kraj zawodnika po
            // jego emeryturze. Najpierw usuwamy go z bieżącej puli, a następnie
            // nie pozwalamy domyślnej bazie dopisać go ponownie.
            if (typeof removeRetiredPlayersFromPool === 'function') {
                removeRetiredPlayersFromPool(pdcPlayers);
            } else if (retiredPlayerKeys.size || retiredPlayerNames.size) {
                const activePlayers = pdcPlayers.filter(candidate => {
                    const playerKey = `${candidate?.name || ''}|${candidate?.country || ''}`;
                    return !retiredPlayerKeys.has(playerKey) && !retiredPlayerNames.has(getRetiredNameKey(candidate));
                });
                if (activePlayers.length !== pdcPlayers.length) pdcPlayers.splice(0, pdcPlayers.length, ...activePlayers);
            }

            const getIdentityKey = candidate => typeof getCanonicalPlayerIdentityKey === 'function'
                ? getCanonicalPlayerIdentityKey(candidate)
                : `${candidate?.name || ''}|${candidate?.country || ''}`;
            const normalizedName = value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
            const careerSourceName = normalizedName(player?.sourceName);
            const isCareerPlayerTemplate = (template, templateIndex) => {
                if (!player || !template) return false;
                if (Number.isInteger(player.defaultTemplateIndex)) {
                    return player.defaultTemplateIndex === templateIndex;
                }
                // Zapis kariery utworzony w starszej wersji moda nie musi mieć
                // indeksu, ale może nadal przechowywać nazwę wpisu źródłowego.
                return Boolean(careerSourceName && normalizedName(template.name) === careerSourceName);
            };
            const existingPlayers = new Set([...pdcPlayers, player]
                .filter(Boolean)
                .map(getIdentityKey)
                .filter(Boolean));
            defaultPdcPlayerTemplates.forEach((template, templateIndex) => {
                const key = getIdentityKey(template);
                const isRetiredTemplate = typeof isRetiredPlayer === 'function'
                    ? isRetiredPlayer(template, templateIndex)
                    : (retiredPlayerKeys.has(key) || retiredPlayerNames.has(getRetiredNameKey(template)));
                if (existingPlayers.has(key) || isRetiredTemplate || isCareerPlayerTemplate(template, templateIndex) || isModReplacementForDefaultPlayer(template, templateIndex)) return;
                pdcPlayers.push({
                    ...template,
                    historyPT: {},
                    historyMain: {},
                    europeanTourPrizeMoney: 0,
                    baseOvr: template.ovr,
                    baseScoring: template.scoring,
                    baseDoubles: template.doubles,
                    form: 0
                });
                existingPlayers.add(key);
            });
            return deduplicatePdcPlayers();
        }

        function migrateWorldCupCalendar() {
            const existingWorldCup = tournamentDatabase.find(tournament => tournament.specialType === 'worldCup');
            const existingQualifier = tournamentDatabase.find(tournament => tournament.specialType === 'worldCupQualifiers');
            const nationsCupName = existingWorldCup?.name || (typeof WORLD_CUP_TOURNAMENT_NAME === 'string'
                ? WORLD_CUP_TOURNAMENT_NAME
                : 'Puchar Narodów');
            const qualifierName = existingQualifier?.name || (typeof WORLD_CUP_QUALIFIER_TOURNAMENT_NAME === 'string'
                ? WORLD_CUP_QUALIFIER_TOURNAMENT_NAME
                : 'Kwalifikacje Pucharu Narodów');
            const legacyWorldCup = tournamentDatabase.find(tournament => tournament.name === 'World Cup of Darts');
            if (legacyWorldCup && !existingWorldCup) legacyWorldCup.name = nationsCupName;

            if (!tournamentDatabase.some(tournament => tournament.specialType === 'worldCup' || tournament.name === nationsCupName)) {
                tournamentDatabase.push({
                    name: nationsCupName, month: 5, day: 11, endDay: 14,
                    format: 'doubles', minOvr: 0, city: 'Frankfurt', country: 'Niemcy', specialType: 'worldCup',
                    completed: false, historyLogs: ''
                });
            }

            const qualifierEvent = existingQualifier || tournamentDatabase.find(tournament => tournament.name === qualifierName);
            if (qualifierEvent) {
                qualifierEvent.name = qualifierName;
                qualifierEvent.month = 5;
                qualifierEvent.day = 9;
                qualifierEvent.endDay = 10;
                qualifierEvent.format = 'doubles';
                qualifierEvent.minOvr = 0;
                qualifierEvent.city = 'Frankfurt';
                qualifierEvent.country = 'Niemcy';
                qualifierEvent.specialType = 'worldCupQualifiers';
            } else {
                tournamentDatabase.push({
                    name: qualifierName, month: 5, day: 9, endDay: 10,
                    format: 'doubles', minOvr: 0, city: 'Frankfurt', country: 'Niemcy', specialType: 'worldCupQualifiers',
                    completed: false, historyLogs: ''
                });
            }
        }

        function saveGame(isAutoSave = false) {
            let gameState = null;
            try {
                gameState = buildGameState();
                localStorage.setItem('dartsCareerSave', JSON.stringify(gameState));
                if (!isAutoSave) alert(t('t-alert-save-ok'));
                return true;
            } catch (error) {
                console.error('Nie udało się zapisać kariery.', error);

                if (!gameState) {
                    if (!isAutoSave) alert('Nie udało się przygotować zapisu kariery. Pobierz plik .JSON, aby nie utracić postępów.');
                    return false;
                }

                // Zdjęcie i muzyka są wyłącznie elementami wizualnymi. Jeżeli to one
                // przekraczają limit localStorage, zachowujemy całą karierę bez nich.
                try {
                    localStorage.setItem('dartsCareerSave', JSON.stringify(getSaveStateWithoutProfileMedia(gameState)));
                    console.warn('Kariera została zapisana bez zdjęcia i muzyki profilu z powodu limitu localStorage.');
                    if (!isAutoSave) alert('Kariera została zapisana. W zapisie przeglądarki pominięto tylko zdjęcie i muzykę profilu, bo przekraczały limit pamięci. Aby zachować je również, pobierz plik .JSON.');
                    return true;
                } catch (fallbackError) {
                    console.error('Nie udało się zapisać także odchudzonej kariery.', fallbackError);
                    if (!isAutoSave) alert('Nie udało się zapisać kariery w pamięci przeglądarki. Pobierz plik .JSON, aby nie utracić postępów.');
                    return false;
                }
            }
        }

        // Restores an already parsed save. Keeping this separate lets a downloaded
        // .JSON save be loaded even when the browser's local storage is full.
        function restoreGameState(gameState, showFeedback = true) {
            try {
                validateGameState(gameState);

                player = gameState.player;
                if (!player.activeSponsors) player.activeSponsors = [];
                if (typeof player.technicalPartner === 'undefined') player.technicalPartner = null;
                if (!player.historyPT) player.historyPT = {};
                if (!player.historyMain) player.historyMain = {};

                pdcPlayerIdAliases = new Map();
                pdcPlayers.length = 0;
                gameState.pdcPlayers.forEach(candidate => {
                    if (!candidate.historyPT) candidate.historyPT = {};
                    if (!candidate.historyMain) candidate.historyMain = {};
                    pdcPlayers.push(candidate);
                });
                if (typeof restorePlayerLifecycleState === 'function') restorePlayerLifecycleState(gameState.playerLifecycleState);
                mergeNewDefaultPlayersIntoSave();
                if (typeof applyKnownPlayerCorrections === 'function') applyKnownPlayerCorrections([player, ...pdcPlayers]);
                if (typeof deduplicatePdcPlayers === 'function') deduplicatePdcPlayers();
                // Zawodnicy dodani pierwotnie do regionalnych składów Pucharu
                // Narodów zaczynają z zerowym rankingiem, ale od tej chwili są
                // pełnoprawnymi uczestnikami kariery. Nie zerujemy ponownie ich
                // nagród ani kart przy każdym wczytaniu zapisu.
                applyKnownPlayerBirthYears([player, ...pdcPlayers]);
                if (typeof removeCareerPlayerFromAiPool === 'function') removeCareerPlayerFromAiPool();
                normalizePlayerIds(pdcPlayers, player);
                if (typeof enforcePlayerRatingLimits === 'function') {
                    enforcePlayerRatingLimits(player);
                    pdcPlayers.forEach(candidate => enforcePlayerRatingLimits(candidate));
                }

                tournamentDatabase.length = 0;
                gameState.tournamentDatabase.forEach(tournament => tournamentDatabase.push(tournament));
                migrateWorldCupCalendar();
                if (typeof migrateContinentalTourQualifiersCalendar === 'function') migrateContinentalTourQualifiersCalendar();
                if (typeof migrateWorldMastersCalendar === 'function') migrateWorldMastersCalendar();
                if (typeof syncPdc2026TournamentCalendar === 'function') syncPdc2026TournamentCalendar();
                currentDate = new Date(gameState.currentDate);
                if (typeof migrateEuropeanTourOrderOfMeritFromHistory === 'function') {
                    migrateEuropeanTourOrderOfMeritFromHistory([player, ...pdcPlayers], tournamentDatabase);
                }
                if (typeof migrateProTourOrderOfMeritFromHistory === 'function') {
                    migrateProTourOrderOfMeritFromHistory([player, ...pdcPlayers], tournamentDatabase, currentDate);
                }
                if (typeof migrateMainOrderOfMeritFromHistory === 'function') {
                    migrateMainOrderOfMeritFromHistory([player, ...pdcPlayers], tournamentDatabase, currentDate);
                }
                if (typeof migratePdcTourCardSystem === 'function') {
                    migratePdcTourCardSystem([player, ...pdcPlayers], currentDate);
                }
                initAllPlayerSeasonStats();
                emails = Array.isArray(gameState.emails) ? gameState.emails : [];
                unreadMailsCount = Number.isFinite(gameState.unreadMailsCount) ? gameState.unreadMailsCount : 0;

                gdlTable = (gameState.gdlTable || [])
                    .filter(isPlainObject)
                    .map(row => ({ ...row, player: resolveLoadedPlayer(row.player) }))
                    .filter(row => row.player);

                const savedTournament = gameState.activeTournament;
                if (savedTournament && (savedTournament.specialType === 'worldCup' || savedTournament.name === 'World Cup of Darts')) {
                    savedTournament.name = typeof WORLD_CUP_TOURNAMENT_NAME === 'string'
                        ? WORLD_CUP_TOURNAMENT_NAME
                        : 'Puchar Narodów';
                }
                activeTournament = savedTournament
                    ? tournamentDatabase.find(tournament => tournament.name === savedTournament.name && tournament.month === savedTournament.month && tournament.day === savedTournament.day) || savedTournament
                    : null;
                tournamentRound = Number.isFinite(gameState.tournamentRound) ? gameState.tournamentRound : 32;
                const savedPreTournamentRanks = isPlainObject(gameState.preTournamentRanks) ? gameState.preTournamentRanks : {};
                preTournamentRanks = {
                    main: Number(savedPreTournamentRanks.main) || 0,
                    pt: Number(savedPreTournamentRanks.pt) || 0,
                    pc: Number(savedPreTournamentRanks.pc) || 0,
                    et: Number(savedPreTournamentRanks.et) || 0
                };
                lastTournamentResults = typeof gameState.lastTournamentResults === 'string' ? gameState.lastTournamentResults : '';
                currentRoundHTML = typeof gameState.currentRoundHTML === 'string' ? gameState.currentRoundHTML : '';
                tournamentBracket = (gameState.tournamentBracket || []).map(resolveLoadedPlayer);
                if (typeof repairRetiredTournamentBracket === 'function') {
                    tournamentBracket = repairRetiredTournamentBracket(tournamentBracket);
                }
                if (typeof repairCareerTournamentBracket === 'function') {
                    tournamentBracket = repairCareerTournamentBracket(tournamentBracket);
                }
                if (typeof restoreGrandSlamState === 'function') restoreGrandSlamState(gameState.grandSlamState);
                worldCupState = gameState.worldCupState && isPlainObject(gameState.worldCupState)
                    ? gameState.worldCupState
                    : null;
                if (worldCupState && Array.isArray(worldCupState.teams)) {
                    worldCupState.teams.forEach(team => {
                        if (Array.isArray(team.players)) team.players = team.players.map(resolveLoadedPlayer);
                        team.containsPlayer = Array.isArray(team.players) && team.players.some(candidate => isCurrentPlayer(candidate));
                    });
                    if (typeof repairWorldCupTeamRosters === 'function') repairWorldCupTeamRosters();
                    if (typeof rebuildCompletedWorldCupCalendarHistory === 'function') rebuildCompletedWorldCupCalendarHistory();
                }
                if (typeof restoreWorldMastersState === 'function') restoreWorldMastersState(gameState.worldMastersState);

                if (activeTournament) {
                    document.getElementById('tour-name-display').innerText = typeof getTournamentDisplayName === 'function'
                        ? getTournamentDisplayName(activeTournament)
                        : activeTournament.name;
                    document.getElementById('tile-tournament').style.display = 'block';
                } else {
                    document.getElementById('tile-tournament').style.display = 'none';
                }

                renderOpponentOptions();
                updateDateDisplay(); updateMailBadge(); updateHub(); showScreen('screen-hub');
                if (showFeedback) alert(t('t-alert-load-ok'));
                return true;
            } catch (error) {
                console.error('Nie udało się wczytać kariery.', error);
                if (showFeedback) alert('Nie udało się wczytać zapisu. Plik jest uszkodzony lub nie pochodzi z tej wersji gry.');
                return false;
            }
        }

        function loadGame(showFeedback = true) {
            const saveData = localStorage.getItem('dartsCareerSave');
            if (!saveData) {
                if (showFeedback) alert(t('t-alert-load-fail'));
                return false;
            }

            try {
                return restoreGameState(JSON.parse(saveData), showFeedback);
            } catch (error) {
                console.error('Nie udało się wczytać kariery.', error);
                if (showFeedback) alert('Nie udało się wczytać zapisu. Plik jest uszkodzony lub nie pochodzi z tej wersji gry.');
                return false;
            }
        }

        // --- ZAPIS I ODCZYT Z FIZYCZNEGO PLIKU (.JSON) ---
        function exportSaveToFile() {
            const file = new Blob([JSON.stringify(buildGameState())], { type: 'application/json' });
            const fileUrl = URL.createObjectURL(file);
            const dlAnchorNode = document.createElement('a');
            dlAnchorNode.href = fileUrl;
            dlAnchorNode.download = `darts_career_save_${Date.now()}.json`;
            document.body.appendChild(dlAnchorNode);
            dlAnchorNode.click();
            dlAnchorNode.remove();
            URL.revokeObjectURL(fileUrl);
        }

        function importSaveFromFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const gameState = JSON.parse(e.target.result);
                    if (!restoreGameState(gameState, false)) throw new Error('Nie udało się odtworzyć zapisu.');

                    // The restored state is saved again through buildGameState(),
                    // which stores a compact World Cup state instead of duplicate
                    // player histories. A failed local save must not invalidate a
                    // correct .JSON file or interrupt the current session.
                    const savedLocally = saveGame(true);
                    if (savedLocally) {
                        alert(t('t-alert-import-ok') || 'Zapis poprawnie wczytany z pliku!');
                    } else {
                        alert('Zapis został wczytany z pliku, ale pamięć przeglądarki jest pełna. Możesz grać dalej — po zakończeniu pobierz nowy plik .JSON, aby zachować postęp.');
                    }
                } catch(error) {
                    console.error('Nie udało się zaimportować zapisu.', error);
                    alert(t('t-alert-import-err') || 'Błąd! Niepoprawny plik zapisu.');
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

    // --- SYSTEM SPONSORÓW ---
        const regularSponsorsDB = [
            "Dartify", "Bullseye Brews", "AeroFlights", "Precision Logistics", "Oche Energy",
            "DoubleTop Betting", "Trevs Tyres", "MaxScore Analytics", "DartKing Apparel", "Perfect9 Solutions",
            // 7 Nowych sponsorów:
            "DartsPlanet", "OcheKings", "FlightClub", "180 Sports", "Tungsten Tech", "MegaBet", "DartsConnect"
        ];
        const techSponsorsDB = [
            "AimX", "BladeDart", "Crimson Drake", "Quest Darts", "ArrowsTech", "Strike",
            "Taurus", "Pegasus", "Locks", "ELITE", "CueSpirit", "Galaxy Darts"
        ];

        let availableSponsorOffers = [];
        let availableTechOffers = [];

        function calculateBaseSponsorValue() {
            let rank = getPlayerRank('main');
            // Złoty środek: im wyższy OVR i im wyższy ranking, tym większa baza
            let rankBonus = Math.max(0, 130 - rank) * 15; // Bycie #1 to bonus ~1950 funtów/mc
            let ovrBonus = Math.max(0, player.overall - 45) * 40; 
            let base = 250;
            let popMultiplier = 0.5 + (player.pop / 100); // 100 Medialności daje 50% WIĘCEJ kasy od każdego sponsora!
            return (base + rankBonus + ovrBonus) * popMultiplier;
        }

        function generateOffers() {
            availableSponsorOffers = [];
            availableTechOffers = [];
            
            let baseValue = calculateBaseSponsorValue();

            // Losowanie aż 8 zwykłych sponsorów z puli, by gracz miał w czym przebierać
            let shuffledRegular = shuffle(regularSponsorsDB).slice(0, 8);
            shuffledRegular.forEach(name => {
                // Skrajne rozbieżności: od 50% do aż 250% bazowej wartości!
                let valueMultiplier = Math.random() * 2.0 + 0.5; 
                let monthlyVal = Math.round(baseValue * valueMultiplier);
                
                // Zwykle najwyższe stawki są na krótszy okres czasu (dylemat ryzyka)
                let months = 6;
                if (valueMultiplier < 1.0) months = Math.floor(Math.random() * 6) + 12; // 12-18 msc (Bezpieczna, mała kasa)
                else if (valueMultiplier < 1.8) months = Math.floor(Math.random() * 6) + 8;  // 8-13 msc (Średnia)
                else months = Math.floor(Math.random() * 4) + 4; // 4-7 msc (Ogromny, szybki zastrzyk gotówki)

                availableSponsorOffers.push({
                    id: Math.random().toString(36).substr(2, 9), name: name, type: 'regular',
                    monthlyValue: monthlyVal,
                    months: months
                });
            });

            // Losowanie 4 ofert technicznych (dylemat: Kasa czy Sprzęt?)
            let shuffledTech = shuffle(techSponsorsDB).slice(0, 4);
            shuffledTech.forEach(name => {
                let tier = sponsorTiers[name] || 'C';
                let techMultiplier = 1.0;

                // Najlepsi (S/A) dają mało pieniędzy, bo inwestują w Twój rozwój (Sprzęt dający +3/+4)
                // Najgorsi (C/D) dają ogromne pieniądze, bo ich sprzęt nie daje prawie żadnych bonusów
                if (tier === 'S') techMultiplier = 0.4 + (Math.random() * 0.2);      // Bardzo mało gotówki (0.4x - 0.6x)
                else if (tier === 'A') techMultiplier = 0.7 + (Math.random() * 0.3); // Średnio-mało (0.7x - 1.0x)
                else if (tier === 'B') techMultiplier = 1.1 + (Math.random() * 0.4); // Norma (1.1x - 1.5x)
                else if (tier === 'C') techMultiplier = 1.7 + (Math.random() * 0.5); // Dużo! (1.7x - 2.2x)
                else if (tier === 'D') techMultiplier = 2.5 + (Math.random() * 0.8); // FORTUNA (2.5x - 3.3x)

                // Techniczny bazowo ma też x1.5 wyższe stawki ogólne
                let finalTechValue = Math.round(baseValue * 1.5 * techMultiplier);

                availableTechOffers.push({
                    id: Math.random().toString(36).substr(2, 9), name: name, type: 'tech',
                    monthlyValue: finalTechValue,
                    months: Math.floor(Math.random() * 10) + 8 // 8 do 17 miesięcy
                });
            });
        }

        function getSponsorLogoHTML(sponsorName) {
            // Szuka loga w modzie, jeśli go nie ma -> szuka go w lokalnym folderze sponsors/, jeśli i tego nie ma -> wyświetla sam tekst
            let imgSrc = (moddedAssets && moddedAssets.sponsors && moddedAssets.sponsors[sponsorName]) 
                ? moddedAssets.sponsors[sponsorName] 
                : `sponsors/${sponsorName}.png`;
                
            const safeName = escapeHtml(sponsorName);
            return `<div class="sponsor-logo" style="overflow: hidden; padding: 2px;">
                        <img src="${escapeHtml(imgSrc)}" alt="${safeName}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span style="display:none; font-size:10px; line-height:1.2;">${safeName}</span>
                    </div>`;
        }

        function showSupportersScreen() {
            showScreen('screen-supporters');
        }

        function showSponsorsScreen() {
            if (!player.activeSponsors) player.activeSponsors = [];
            
            // Jeśli nie ma ofert (pierwsze wejście), wygeneruj je
            if (availableSponsorOffers.length === 0) generateOffers();

            document.getElementById('sponsor-count').innerText = player.activeSponsors.length;

            // Renderowanie Aktywnych Zwykłych Sponsorów
            const actRegBox = document.getElementById('sponsors-active');
            actRegBox.innerHTML = player.activeSponsors.length === 0 ? `<span style='color:gray; font-size:13px;'>${t('t-no-active-reg')}</span>` : "";
            player.activeSponsors.forEach(s => {
                actRegBox.innerHTML += `<div class="sponsor-card">
                    ${getSponsorLogoHTML(s.name)}
                    <div class="sponsor-info">
                        <p class="sponsor-name">${escapeHtml(s.name)}</p>
                        <p class="sponsor-details">${t('t-payout')} £${s.monthlyValue}/mc | ${s.months} ${t('t-months')}</p>
                    </div>
                </div>`;
            });

            // Renderowanie Aktywnego Partnera Technicznego
            const actTechBox = document.getElementById('tech-partner-active');
            if (player.technicalPartner) {
                let tech = player.technicalPartner; // Zmiana nazwy zmiennej z 't' na 'tech', by nie psuć tłumaczeń!
                actTechBox.innerHTML = `<div class="sponsor-card" style="border-color:#3498db;">
                    ${getSponsorLogoHTML(tech.name)}
                    <div class="sponsor-info">
                        <p class="sponsor-name">${escapeHtml(tech.name)}</p>
                        <p class="sponsor-details">${t('t-payout')} £${tech.monthlyValue}/mc | ${tech.months} ${t('t-months')}</p>
                    </div>
                </div>`;
            } else {
                actTechBox.innerHTML = `<span style='color:gray; font-size:13px;'>${t('t-no-active-tech')}</span>`;
            }

            // Renderowanie Ofert Zwykłych
            const offRegBox = document.getElementById('sponsor-offers-list');
            offRegBox.innerHTML = "";
            availableSponsorOffers.forEach(s => {
                let btn = player.activeSponsors.length >= 3 ? `<button class="btn-sign" disabled style="background:gray;">Limit (3/3)</button>` : `<button class="btn-sign" onclick="signContract('${s.id}', 'regular')">${t('t-sign')}</button>`;
                offRegBox.innerHTML += `<div class="sponsor-card">
                    ${getSponsorLogoHTML(s.name)}
                    <div class="sponsor-info">
                        <p class="sponsor-name">${escapeHtml(s.name)}</p>
                        <p class="sponsor-details">${t('t-payout')} £${s.monthlyValue}/mc<br>${t('t-contract')} ${s.months} ${t('t-months')}</p>
                    </div>
                    ${btn}
                </div>`;
            });

            // Renderowanie Ofert Technicznych
            const offTechBox = document.getElementById('tech-offers-list');
            offTechBox.innerHTML = "";
            availableTechOffers.forEach(offer => { // Zmiana nazwy zmiennej z 't' na 'offer'
                let btn = player.technicalPartner ? `<button class="btn-sign" disabled style="background:gray;">Limit (1/1)</button>` : `<button class="btn-sign" onclick="signContract('${offer.id}', 'tech')">${t('t-sign')}</button>`;
                offTechBox.innerHTML += `<div class="sponsor-card">
                    ${getSponsorLogoHTML(offer.name)}
                    <div class="sponsor-info">
                        <p class="sponsor-name">${escapeHtml(offer.name)}</p>
                        <p class="sponsor-details">${t('t-payout')} £${offer.monthlyValue}/mc<br>${t('t-contract')} ${offer.months} ${t('t-months')}</p>
                    </div>
                    ${btn}
                </div>`;
            });

            showScreen('screen-sponsors');
        }

        function signContract(id, type) {
            if (type === 'regular') {
                let offerIndex = availableSponsorOffers.findIndex(o => o.id === id);
                player.activeSponsors.push(availableSponsorOffers[offerIndex]);
                availableSponsorOffers.splice(offerIndex, 1);
            } else {
                let offerIndex = availableTechOffers.findIndex(o => o.id === id);
                player.technicalPartner = availableTechOffers[offerIndex];
                availableTechOffers = []; 
            }
            alert(t('t-alert-contract'));
            showSponsorsScreen();
        }
    
// --- SYSTEM SKLEPU I SPRZĘTU ---
        const shopDatabase = {
            board: [
                { id: 1, name: "ELITE Proscore FLX", stars: 1, price: 500, eff: 5 },
                { id: 2, name: "Pegasus Eclipse 2", stars: 2, price: 2500, eff: 10 },
                { id: 3, name: "ArrowsTech Fortis", stars: 3, price: 12000, eff: 15 },
                { id: 4, name: "AimX Core", stars: 4, price: 45000, eff: 20 },
                { id: 5, name: "BladeDart Master X", stars: 5, price: 150000, eff: 35 }
            ],
            surround: [
                { id: 1, name: "Składana opona", stars: 1, price: 200, eff: 2 },
                { id: 2, name: "Taurus EP Surround", stars: 2, price: 1200, eff: 5 },
                { id: 3, name: "ONE180 Plain Surround", stars: 3, price: 6000, eff: 10 },
                { id: 4, name: "BladeDart Guard 6", stars: 4, price: 25000, eff: 15 },
                { id: 5, name: "Pro League Surround", stars: 5, price: 80000, eff: 25 }
            ],
            light: [
                { id: 1, name: "Quest Torus 120", stars: 1, price: 350, eff: 3 },
                { id: 2, name: "BladeDart Polaris 120", stars: 2, price: 1800, eff: 7 },
                { id: 3, name: "Taurus Lumo 2", stars: 3, price: 8500, eff: 12 },
                { id: 4, name: "BladeDart Plasma", stars: 4, price: 35000, eff: 20 },
                { id: 5, name: "AimX Halo Vision", stars: 5, price: 120000, eff: 30 }
            ]
        };

        const sponsorTiers = {
            'AimX': 'S', 'Crimson Drake': 'S',
            'ArrowsTech': 'A', 'BladeDart': 'A',
            'Pegasus': 'B', 'Quest Darts': 'B', "Taurus": 'B', 'Galaxy Darts': 'B', 'Strike': 'B',
            'ELITE': 'C',
            'Locks': 'D', 'CueSpirit': 'D'
        };

        // Zbalansowane bonusy (OVR, Scoring, Doubles) w zależności od tieru
        const tierBonuses = {
            'S': { o: 3, s: 4, d: 3 },
            'A': { o: 2, s: 3, d: 2 },
            'B': { o: 2, s: 2, d: 1 },
            'C': { o: 1, s: 1, d: 1 },
            'D': { o: 1, s: 1, d: 0 },
            'NONE': { o: 0, s: 0, d: 0 }
        };

        // Zwraca aktywne bonusy gracza od lotek
        function getPlayerDartsBonus() {
            if (!player.technicalPartner) return tierBonuses['NONE'];
            let tier = sponsorTiers[player.technicalPartner.name] || 'C';
            return tierBonuses[tier];
        }

        // Zwraca pełne statystyki gracza uwzględniające bonus ze sprzętu i kary zmęczenia
function getBoostedPlayerStats() {
    let b = getPlayerDartsBonus();

    // --- SYSTEM ZMĘCZENIA ---
    let sPenalty = 0;
    if (player.stamina < 20) sPenalty = -6;
    else if (player.stamina < 40) sPenalty = -3;
    else if (player.stamina < 70) sPenalty = -1;

    return {
        overall: Math.min(100, Math.max(40, Math.round(player.overall) + b.o + sPenalty)),
        scoring: Math.min(100, Math.max(40, Math.round(player.scoring) + b.s + sPenalty)),
        doubles: Math.min(100, Math.max(40, Math.round(player.doubles) + b.d + sPenalty)),
        bonusStr: b.o > 0 ? `(+${b.o} ${t('t-gear')})` : '',
        staminaPenalty: sPenalty
    };
}

        function getStarString(count) {
            let starsHTML = "";
            for (let i = 0; i < 5; i++) {
                if (i < count) starsHTML += "<span style='color: #f1c40f;'>★</span>";
                else starsHTML += "<span style='color: #34495e;'>★</span>";
            }
            return starsHTML;
        }

        function showShopScreen() {
            if (!player.equipment) player.equipment = { board: 0, surround: 0, light: 0 };
            
            document.getElementById('shop-budget').innerText = `£${player.budget.toLocaleString('en-GB')}`;
            
            // Renderowanie informacji o Lotkach
            let dartsInfo = document.getElementById('shop-darts-info');
            if (player.technicalPartner) {
                let pName = player.technicalPartner.name;
                let tier = sponsorTiers[pName] || 'C';
                let bonus = tierBonuses[tier];
                dartsInfo.innerHTML = `
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <div style="font-size: 40px;">🎯</div>
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: white;">${t('t-darts')}: ${pName} Signature Darts</h4>
                            <p style="margin: 0; font-size: 13px; color: #bdc3c7;">${t('t-quality')} <strong style="color:var(--accent-red)">Tier ${tier}</strong></p>
                            <p style="margin: 5px 0 0 0; font-size: 14px; color: var(--accent-green); font-weight: bold;">
                                +${bonus.o} OVR | +${bonus.s} ${t('t-score')} | +${bonus.d} ${t('t-doubles')}
                            </p>
                        </div>
                    </div>`;
            } else {
                dartsInfo.innerHTML = `
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <div style="font-size: 40px; opacity: 0.5;">🎯</div>
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: gray;">${t('t-no-darts')}</h4>
                            <p style="margin: 0; font-size: 13px; color: #bdc3c7;">${t('t-no-darts-desc')}</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #f39c12;">${t('t-no-darts-hint')}</p>
                        </div>
                    </div>`;
            }

            // Renderowanie Wyposażenia Bazy
            let effTotal = 0;
            ['board', 'surround', 'light'].forEach(cat => {
                let box = document.getElementById(`shop-cat-${cat}s`);
                let catName = cat === 'board' ? t('t-board') : (cat === 'surround' ? t('t-surround') : t('t-light'));
                let currentLvl = player.equipment[cat];
                
                let html = `<h4 style="background:#1a1a2e; padding:8px; border-radius:5px; margin-top:0;">${catName}</h4>`;
                
                shopDatabase[cat].forEach(item => {
                    let isOwned = currentLvl >= item.id;
                    let btnHTML = isOwned 
                        ? `<button class="btn-sign" disabled style="background:gray; width:100%;">${t('t-owned')}</button>`
                        : `<button class="btn-sign" onclick="buyEquipment('${cat}', ${item.id}, ${item.price})" style="width:100%;">${t('t-buy')} £${item.price}</button>`;
                    
                    if (isOwned && currentLvl === item.id) effTotal += item.eff;

                    html += `
                    <div style="background:#16213e; padding:10px; margin-bottom:10px; border-radius:5px; border: 1px solid ${isOwned ? 'var(--accent-green)' : '#2c3e50'};">
                        <div style="font-size:11px; margin-bottom:3px;">${getStarString(item.stars)}</div>
                        <div style="font-weight:bold; font-size:14px; margin-bottom:5px;">${t(item.name)}</div>
                        <div style="font-size:12px; color:#bdc3c7; margin-bottom:8px;">${t('t-train')} +${item.eff}%</div>
                        ${btnHTML}
                    </div>`;
                });
                box.innerHTML = html;
            });

            const effectiveTrainingBonus = Math.min(effTotal, TRAINING_CONFIG.equipmentBonusCap);
            document.getElementById('shop-training-eff').innerText = `${effectiveTrainingBonus}% / ${TRAINING_CONFIG.equipmentBonusCap}%`;
            showScreen('screen-shop');
        }

        function buyEquipment(category, itemId, price) {
            if (player.budget < price) {
                alert(t('t-alert-no-funds'));
                return;
            }
            if (!confirm(t('t-confirm-buy').replace('{price}', price))) return;

            player.budget -= price;
            player.equipment[category] = itemId;
            updateHub();
            showShopScreen();
        }

        function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function updateProfilePhoto(event) {
            const file = event.target.files[0];
            if (file) {
                player.photo = await convertFileToBase64(file);
                document.getElementById('hub-photo').src = player.photo;
                alert(t('t-alert-photo'));
            }
        }

async function updateProfileWalkon(event) {
            const file = event.target.files[0];
            if (file) {
                player.walkon = await convertFileToBase64(file);
                alert(t('t-alert-walkon'));
            }
        }

// --- 7. MODUŁ TRENINGU ---

        const TRAINING_CONFIG = Object.freeze({
            weeklyLimit: 2,
            staminaCost: STAMINA_CONFIG.trainingCost,
            equipmentBonusCap: 50,
            randomEventXpPerStatPoint: 12
        });

        function getTrainingWeekKey(date = currentDate) {
            const calendarDate = date instanceof Date && !Number.isNaN(date.getTime())
                ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
                : new Date();
            const daysSinceMonday = (calendarDate.getDay() + 6) % 7;
            calendarDate.setDate(calendarDate.getDate() - daysSinceMonday);

            return `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(calendarDate.getDate()).padStart(2, '0')}`;
        }

        function initTrainingLimit() {
            if (!player) return;

            const currentWeekKey = getTrainingWeekKey();
            if (player.trainingWeekKey !== currentWeekKey) {
                player.trainingWeekKey = currentWeekKey;
                player.trainingSessionsThisWeek = 0;
            } else {
                const savedSessions = Number(player.trainingSessionsThisWeek);
                player.trainingSessionsThisWeek = Number.isFinite(savedSessions)
                    ? Math.max(0, Math.min(TRAINING_CONFIG.weeklyLimit, Math.floor(savedSessions)))
                    : 0;
            }
        }

        function getTrainingEquipmentBonus() {
            let totalBonus = 0;
            ['board', 'surround', 'light'].forEach(category => {
                if (!player.equipment || !player.equipment[category]) return;
                const item = shopDatabase[category].find(candidate => candidate.id === player.equipment[category]);
                if (item) totalBonus += item.eff;
            });

            return Math.min(totalBonus, TRAINING_CONFIG.equipmentBonusCap);
        }

        // Inicjalizacja pasków XP przy nowej grze/wczytaniu
        function initPlayerXP() {
            if (typeof player.scoringXP === 'undefined') player.scoringXP = 0;
            if (typeof player.doublesXP === 'undefined') player.doublesXP = 0;
        }

        function awardPlayerStatXP(type, amount) {
            initPlayerXP();

            const isScoring = type === 'scoring';
            const xpKey = isScoring ? 'scoringXP' : 'doublesXP';
            const statKey = isScoring ? 'scoring' : 'doubles';
            const normalizedAmount = Number(amount) || 0;
            const startingXP = Number(player[xpKey]) || 0;
            let nextXP = Math.max(0, startingXP + normalizedAmount);
            let levelsGained = 0;

            while (nextXP >= 100 && player[statKey] < 100) {
                nextXP -= 100;
                player[statKey] += 1;
                levelsGained++;
            }

            player[xpKey] = player[statKey] >= 100 ? 0 : nextXP;
            player.overall = Math.round((player.scoring * 0.6) + (player.doubles * 0.4));
            player.ovr = player.overall;

            return levelsGained;
        }

        function showTrainingScreen() {
            initPlayerXP();
            initTrainingLimit();
            const sessionsThisWeek = player.trainingSessionsThisWeek;
            const sessionsRemaining = TRAINING_CONFIG.weeklyLimit - sessionsThisWeek;
            
            document.getElementById('train-scoring-val').innerText = Math.round(player.scoring);
            document.getElementById('train-scoring-bar').style.width = `${player.scoringXP}%`;
            document.getElementById('train-scoring-xp').innerText = `${t('t-progress')} ${Math.floor(player.scoringXP)}/100 XP`;
            
            document.getElementById('train-doubles-val').innerText = Math.round(player.doubles);
            document.getElementById('train-doubles-bar').style.width = `${player.doublesXP}%`;
            document.getElementById('train-doubles-xp').innerText = `${t('t-progress')} ${Math.floor(player.doublesXP)}/100 XP`;

            const weeklyLimit = document.getElementById('train-weekly-limit');
            if (weeklyLimit) {
                weeklyLimit.innerText = t('t-train-weekly-limit')
                    .replace('{used}', sessionsThisWeek)
                    .replace('{limit}', TRAINING_CONFIG.weeklyLimit)
                    .replace('{remaining}', sessionsRemaining);
            }

            ['t-train-sc-btn', 't-train-db-btn'].forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) button.disabled = sessionsRemaining <= 0;
            });

            showScreen('screen-training');
        }

        function performTraining(type) {
            initPlayerXP();
            initTrainingLimit();
            if (player.trainingSessionsThisWeek >= TRAINING_CONFIG.weeklyLimit) {
                alert(t('t-alert-training-limit'));
                return;
            }
            if (player.stamina < TRAINING_CONFIG.staminaCost) {
                alert(t('t-alert-exhausted'));
                return;
            }

            changePlayerStamina(player, -TRAINING_CONFIG.staminaCost);
            let currentStat = type === 'scoring' ? player.scoring : player.doubles;
            let baseXP = 20;
            
            if (currentStat >= 90) baseXP = 1;
            else if (currentStat >= 85) baseXP = 3;
            else if (currentStat >= 75) baseXP = 6;
            else if (currentStat >= 65) baseXP = 12;

            const equipmentBonus = getTrainingEquipmentBonus();
            const profMultiplier = 0.8 + (player.prof / 100) * 0.4; // 100 Profesjonalizmu daje 20% więcej XP za trening
            const rawGainedXP = Math.max(1, baseXP + (Math.random() * 4 - 2)) * (1 + (equipmentBonus / 100)) * profMultiplier;
            const gainedXP = typeof scalePlayerDevelopmentChange === 'function'
                ? scalePlayerDevelopmentChange(player, rawGainedXP)
                : rawGainedXP;
            const levelsGained = awardPlayerStatXP(type, gainedXP);
            if (levelsGained > 0) alert(type === 'scoring' ? t('t-alert-lvl-sc') : t('t-alert-lvl-db'));

            player.trainingSessionsThisWeek += 1;
            advanceDay(); updateHub();
            if (document.getElementById('screen-training').classList.contains('active')) showTrainingScreen();
        }

    // --- 8. SILNIK BŁYSKAWICZNEJ SYMULACJI (FAST-FORWARD) ---

        function simulateTurnFast(isP1) {
            const isDoublesMatch = Boolean(currentMatch.isDoubles && typeof getDoublesCurrentThrower === 'function');
            const pObj = isDoublesMatch
                ? getDoublesCurrentThrower(isP1)
                : (isP1 ? player : currentMatch.opponent);
            const isCareerThrower = isP1 && (!isDoublesMatch || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(pObj)));
            let statsObj = isCareerThrower && typeof getBoostedPlayerStats === 'function' ? getBoostedPlayerStats() : pObj;
            statsObj = applyRivalryMatchModifier(statsObj, isCareerThrower);
            let startScore = isP1 ? currentMatch.p1Score : currentMatch.p2Score;
            let currentScore = startScore;
            let st = currentMatch.stats;
            let turnScore = 0;
            let dartsThrown = 0;
            // ... fragment w simulateTurnFast ...
            let isDIDO = activeTournament && activeTournament.format === 'DIDO';

            for (let i = 0; i < 3; i++) {
                // Dodano przekazanie pozostałych lotek: 3 - i
                let aim = getOptimalAim(currentScore, isDIDO, 3 - i); 
                let result = calculateThrow(aim.sector, aim.mult, statsObj);
            // ... reszta kodu ...
                let hitSec = result.sector;
                let hitMult = result.mult;
                let points = hitSec * hitMult;

                if (isDIDO && currentScore === 501 && hitMult !== 2) points = 0;

                let newScore = currentScore - points;
                turnScore += points;
                dartsThrown++;

                // Zapis statystyk (idealnie odwzorowane z normalnej gry)
                if (isP1) {
                    st.p1TotalDarts++; st.p1LegDarts++;
                    if (st.p1LegDarts <= 9 && newScore >= 0) { st.p1First9Score += points; st.p1First9Darts++; }
                    if (currentScore <= 50 && aim.mult === 2 && points > 0) {
                        st.p1DoubleAttempts++;
                        if (newScore === 0 && hitMult === 2) st.p1DoubleHits++;
                    }
                } else {
                    st.p2TotalDarts++; st.p2LegDarts++;
                    if (st.p2LegDarts <= 9 && newScore >= 0) { st.p2First9Score += points; st.p2First9Darts++; }
                    if (currentScore <= 50 && aim.mult === 2 && points > 0) {
                        st.p2DoubleAttempts++;
                        if (newScore === 0 && hitMult === 2) st.p2DoubleHits++;
                    }
                }

                // Fura (Bust)
                if (newScore < 0 || newScore === 1 || (newScore === 0 && hitMult !== 2)) {
                    // NOWOŚĆ: Doliczanie brakujących lotek do statystyk w symulacji
                    let missingDarts = 2 - i; // "i" to indeks obecnej lotki (0, 1 lub 2)
                    if (isP1) {
                        st.p1TotalDarts += missingDarts;
                        st.p1LegDarts += missingDarts;
                    } else {
                        st.p2TotalDarts += missingDarts;
                        st.p2LegDarts += missingDarts;
                    }

                    newScore = startScore;
                    if (isP1) currentMatch.p1Score = newScore; else currentMatch.p2Score = newScore;
                    break;
                }

                currentScore = newScore;
                if (isP1) currentMatch.p1Score = currentScore; else currentMatch.p2Score = currentScore;

                // Koniec lega
                if (currentScore === 0 && hitMult === 2) {
                    if (isP1) {
                        st.p1HighCheckout = Math.max(st.p1HighCheckout || 0, turnScore);
                        if (isCareerThrower) {
                            initCareerStats();
                            if (turnScore > (player.careerStats.highestCheckout || 0)) {
                                player.careerStats.highestCheckout = turnScore;
                                addCareerChronicleEvent('checkout', { value: turnScore });
                            }
                            if (turnScore >= 100) player.careerStats.tonPlusCheckouts = (player.careerStats.tonPlusCheckouts || 0) + 1;
                        }
                    } else {
                        st.p2HighCheckout = Math.max(st.p2HighCheckout || 0, turnScore);
                    }
                    return 'won';
                }
            }

            // Sprawdzanie 180
            if (dartsThrown === 3 && turnScore === 180) {
                if (isP1) {
                    st.p1OneEighties++;
                    if (isCareerThrower) {
                        initCareerStats();
                        player.careerStats.total180s++;
                    }
                } else {
                    st.p2OneEighties++;
                }
            }
            return 'continue';
        }

        function handleFastLegWin(isP1) {
            const st = currentMatch.stats;
            const isSetMatch = currentMatch.matchFormat && currentMatch.matchFormat.type === 'sets';
            let setWasWon = false;

            // Szybka symulacja musi zapisać idealny leg tak samo jak zwykłe rzucanie.
            if (isP1 && !currentMatch.isDoubles && st.p1LegDarts === 9) {
                triggerNineDarterAlert();
                checkAchievements('9darter');
            }
            
            currentMatch.totalLegsPlayed++;
            if (isP1) currentMatch.p1Legs++; else currentMatch.p2Legs++;

            if (isSetMatch && (currentMatch.p1Legs >= currentMatch.matchFormat.legsPerSet || currentMatch.p2Legs >= currentMatch.matchFormat.legsPerSet)) {
                setWasWon = true;
                if (isP1) currentMatch.p1Sets++; else currentMatch.p2Sets++;
                logThrow(`🏆 ${isP1 ? player.name : currentMatch.opponent.name} wygrywa seta!`, 'system');
            }

            if (currentMatch.matchFormat && currentMatch.matchFormat.suddenDeathAt && currentMatch.p1Legs === currentMatch.matchFormat.suddenDeathAt && currentMatch.p2Legs === currentMatch.matchFormat.suddenDeathAt) {
                startSuddenDeath();
                return;
            }

            if (isMatchFinished()) return;

            st.p1AccumulatedScore += (501 - currentMatch.p1Score);
            st.p2AccumulatedScore += (501 - currentMatch.p2Score);

            currentMatch.p1Score = 501; currentMatch.p2Score = 501;
            currentMatch.p1TurnStartScore = 501; currentMatch.p2TurnStartScore = 501;
            st.p1LegDarts = 0; st.p2LegDarts = 0;

            if (setWasWon) { currentMatch.p1Legs = 0; currentMatch.p2Legs = 0; }

            if (currentMatch.isDoubles) {
                const winningSide = isP1 ? 'p1' : 'p2';
                currentMatch.doublesThrower[winningSide] = currentMatch.doublesThrower[winningSide] === 0 ? 1 : 0;
            }
            currentMatch.turn = (currentMatch.totalLegsPlayed % 2 === 0) ? currentMatch.startingPlayer : (currentMatch.startingPlayer === 'p1' ? 'p2' : 'p1');
            currentMatch.dartsThrown = 0; currentTurnScore = 0; drawnDarts = [];
        }

        function processFastLeg() {
            if (currentMatch.suddenDeath) {
                // Szybkie rozwiązanie nagłej śmierci (Sudden Death)
                while(currentMatch.suddenDeath) {
                    currentMatch.suddenDeath.p1Score = 0; currentMatch.suddenDeath.p2Score = 0;
                    currentMatch.suddenDeath.p1Darts = 0; currentMatch.suddenDeath.p2Darts = 0;
                    let statsObjP1 = typeof getBoostedPlayerStats === 'function' ? getBoostedPlayerStats() : player;
                    statsObjP1 = applyRivalryMatchModifier(statsObjP1, true);
                    
                    for(let i=0; i<3; i++) {
                        let resP1 = calculateThrow(20, 3, statsObjP1);
                        currentMatch.suddenDeath.p1Score += resP1.sector * resP1.mult;
                        let resP2 = calculateThrow(20, 3, currentMatch.opponent);
                        currentMatch.suddenDeath.p2Score += resP2.sector * resP2.mult;
                    }
                    if (currentMatch.suddenDeath.p1Score !== currentMatch.suddenDeath.p2Score) {
                        let isP1 = currentMatch.suddenDeath.p1Score > currentMatch.suddenDeath.p2Score;
                        currentMatch.suddenDeath = null;
                        finishMatch(); return;
                    }
                }
                return;
            }

            let safetyCounter = 0; let legWon = false;
            while (!legWon && safetyCounter < 500) {
                safetyCounter++;
                let res = simulateTurnFast(currentMatch.turn === 'p1');
                if (res === 'won') {
                    legWon = true;
                    handleFastLegWin(currentMatch.turn === 'p1');
                    break;
                }
                if (currentMatch.isDoubles) {
                    const currentSide = currentMatch.turn;
                    currentMatch.doublesThrower[currentSide] = currentMatch.doublesThrower[currentSide] === 0 ? 1 : 0;
                }
                currentMatch.turn = currentMatch.turn === 'p1' ? 'p2' : 'p1';
                if (currentMatch.turn === 'p1') currentMatch.p1TurnStartScore = currentMatch.p1Score;
                else currentMatch.p2TurnStartScore = currentMatch.p2Score;
            }
            logThrow(`⏩ ${t('t-log-sim')}`, "system");
        }

        function simulateOneLegFast() {
            skipWalkon(); // Wycisza muzykę, żeby uniknąć nakładania dźwięków
            clearTimeout(window.aiTimeout); // ZABEZPIECZENIE: Przerywa zaplanowane ruchy AI
            if (currentMatch.suddenDeath) { processFastLeg(); return; }
            
            processFastLeg();
            
            updateScores(); updateMatchStatsUI(); drawnDarts = [];
            drawDartboard(); updateDartDots(); setTurnUI();
            
            if (isMatchFinished()) finishMatch();
        }

        function simulateMatchFast() {
            if (!confirm(t('t-confirm-sim-match'))) return;
            skipWalkon(); 
            clearTimeout(window.aiTimeout);
            let safety = 0;
            while (!isMatchFinished() && !currentMatch.suddenDeath && safety < 100) {
                processFastLeg(); safety++;
            }
            if (currentMatch.suddenDeath) processFastLeg(); 
            if (isMatchFinished()) {
                updateScores(); updateMatchStatsUI(); finishMatch();
            }
        }

    // --- 9. SYSTEM MOMENTUM (PRESJI) ---
        function updateMomentumUI() {
            if (!currentMatch || currentMatch.p1Momentum === undefined) return;
            const getMomText = (m) => {
                if (m >= 4) return `<span style="color: #e74c3c;">🔥 ${t('t-on-fire')} (+${m})</span>`;
                if (m >= 2) return `<span style="color: #f39c12;">⚡ ${t('t-on-run')} (+${m})</span>`;
                if (m <= -4) return `<span style="color: #3498db;">🧊 ${t('t-under-pressure')} (${m})</span>`;
                if (m <= -2) return `<span style="color: #95a5a6;">${t('t-discouraged')} (${m})</span>`;
                return `<span style="color: #7f8c8d;">➖ ${t('t-neutral')}</span>`;
            };
            let m1 = document.getElementById('momentum-p1'); if(m1) m1.innerHTML = getMomText(currentMatch.p1Momentum);
            let m2 = document.getElementById('momentum-p2'); if(m2) m2.innerHTML = getMomText(currentMatch.p2Momentum);
        }

        function adjustMomentum(isP1, amount) {
            if (!currentMatch || currentMatch.p1Momentum === undefined) return;
            if (isP1) currentMatch.p1Momentum = Math.max(-5, Math.min(5, currentMatch.p1Momentum + amount));
            else currentMatch.p2Momentum = Math.max(-5, Math.min(5, currentMatch.p2Momentum + amount));
            updateMomentumUI();
        }

    // --- 11. KRONIKA KARIERY, SALA TROFEÓW I REKORDY ---

        
