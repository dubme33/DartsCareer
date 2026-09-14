const PANEL_TOP_BACK_EXCLUDED_SCREENS = new Set([
            'screen-create-player',
            'screen-hub',
            'screen-match'
        ]);

        function getPanelTopBackLabel() {
            if (typeof t === 'function') {
                const translated = t('t-panel-top-back');
                if (translated && translated !== 't-panel-top-back') return translated;
            }
            const labels = { pl: '← Wróć', en: '← Back', de: '← Zurück', nl: '← Terug' };
            return labels[typeof currentLang === 'string' ? currentLang : 'pl'] || labels.pl;
        }

        function refreshPanelTopBackTranslations() {
            if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
            document.querySelectorAll('.panel-top-back').forEach(button => {
                button.textContent = getPanelTopBackLabel();
            });
        }

        function returnToCareerHubFromPanel(screenId) {
            if (screenId === 'screen-player-editor' && typeof stopPlayerEditorWalkonPreview === 'function') {
                stopPlayerEditorWalkonPreview();
            }
            ['bracket-modal', 'results-modal', 'event-modal'].forEach(id => {
                const overlay = typeof document !== 'undefined' ? document.getElementById(id) : null;
                if (overlay) overlay.style.display = 'none';
            });
            showScreen('screen-hub');
        }

        function ensurePanelTopBackButton(screen) {
            if (!screen || PANEL_TOP_BACK_EXCLUDED_SCREENS.has(screen.id)
                || typeof document === 'undefined' || typeof document.createElement !== 'function'
                || typeof screen.querySelector !== 'function' || typeof screen.prepend !== 'function') return null;
            let button = screen.querySelector(':scope > .panel-top-back');
            if (!button) {
                button = document.createElement('button');
                button.type = 'button';
                button.className = 'panel-top-back';
                button.dataset.panelScreen = screen.id;
                button.onclick = () => returnToCareerHubFromPanel(screen.id);
                screen.prepend(button);
            }
            button.textContent = getPanelTopBackLabel();
            return button;
        }

        function showScreen(screenId) {
            // Wyciszamy wszystkie dźwięki meczowe przy wychodzeniu z meczu
            if(screenId !== 'screen-match') { 
                cancelMatchIntro();
                clearTimeout(window.aiTimeout);
                if(crowdAudio) { crowdAudio.pause(); crowdAudio.currentTime = 0; }
                if(postMatchAudio) { postMatchAudio.pause(); postMatchAudio.currentTime = 0; }
            }
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const nextScreen = document.getElementById(screenId);
            ensurePanelTopBackButton(nextScreen);
            nextScreen.classList.add('active');
            if (screenId === 'screen-hub' && typeof initializeHubNavigation === 'function') {
                initializeHubNavigation();
            }
        }

        let existingPlayerCareerStarting = false;
        async function startCareerAsExistingPlayer() {
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
            if (existingPlayerCareerStarting) return;
            existingPlayerCareerStarting = true;
            const startButton = document.getElementById('career-start-existing-button');
            if (startButton) startButton.disabled = true;
            try {
                if (typeof waitForPersistedModRestore === 'function') {
                    await waitForPersistedModRestore();
                }
                const select = document.getElementById('existing-player-select');
                const selectedPlayer = select
                    ? getCareerStartPlayers().find(candidate => candidate && candidate.id === select.value)
                    : null;

                if (!selectedPlayer) {
                    alert(trCareerStart('empty'));
                    return;
                }

                const careerStartAssets = moddedAssets;
                const careerStartPlayer = player;
                const modMedia = await getModCareerProfileMedia(careerStartAssets, selectedPlayer.name);
                if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
                // W trakcie odczytu pliku użytkownik mógł wczytać inną karierę lub moda.
                if (player !== careerStartPlayer || moddedAssets !== careerStartAssets || !pdcPlayers.includes(selectedPlayer)) return;

                const { overall, scoring, doubles, prizeMoney, proTourPrizeMoney, pcPrizeMoney, europeanTourPrizeMoney }
                    = getCareerStartPlayerStats(selectedPlayer);
                const asNumber = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

                // Przenosimy dokładnie tego zawodnika z puli AI do kariery, bez tworzenia duplikatu.
                const selectedIndex = pdcPlayers.indexOf(selectedPlayer);
                if (selectedIndex !== -1) pdcPlayers.splice(selectedIndex, 1);

                if (typeof clearCareerProfileMediaRuntime === 'function') clearCareerProfileMediaRuntime();
                player = {
                    ...selectedPlayer,
                    id: selectedPlayer.id,
                    // Zachowujemy powiązanie z wpisem bazowym/moda. Dzięki temu po
                    // ponownym wczytaniu baza nie odtworzy tego samego zawodnika jako AI.
                    sourceName: selectedPlayer.sourceName || selectedPlayer.name,
                    difficulty: typeof getSelectedCareerDifficulty === 'function'
                        ? getSelectedCareerDifficulty('existing') : 'normal',
                    walkonTournamentMode: 'stage',
                    defaultTemplateIndex: Number.isInteger(selectedPlayer.defaultTemplateIndex)
                        ? selectedPlayer.defaultTemplateIndex
                        : selectedIndex,
                    overall, ovr: overall, scoring, doubles,
                    baseOvr: overall, baseScoring: scoring, baseDoubles: doubles, form: 0,
                    favoriteDouble: asNumber(selectedPlayer.favoriteDouble, 20),
                    favoriteDoubles: Array.isArray(selectedPlayer.favoriteDoubles)
                        ? selectedPlayer.favoriteDoubles.slice(0, 3) : [asNumber(selectedPlayer.favoriteDouble, 20), null, null],
                    // Prize money determines ranking; the budget is the separate amount used in the shop.
                    budget: Math.min(10000, Math.max(500, Math.round(prizeMoney * 0.002))),
                    prof: Math.min(95, Math.max(55, Math.round(45 + (overall - 40) * 0.75))),
                    pop: Math.min(85, Math.max(20, Math.round(10 + (overall - 40) * 1.2))),
                    stamina: 100,
                    prizeMoney, proTourPrizeMoney, pcPrizeMoney, europeanTourPrizeMoney,
                    photo: (typeof modMedia.photo === 'string' && modMedia.photo) || selectedPlayer.photo || '',
                    walkon: (typeof modMedia.walkon === 'string' && modMedia.walkon) || selectedPlayer.walkon || null,
                    historyPT: selectedPlayer.historyPT && typeof selectedPlayer.historyPT === 'object'
                        ? { ...selectedPlayer.historyPT }
                        : {},
                    historyMain: selectedPlayer.historyMain && typeof selectedPlayer.historyMain === 'object'
                        ? { ...selectedPlayer.historyMain }
                        : {},
                    mainPrizeHistory: Array.isArray(selectedPlayer.mainPrizeHistory)
                        ? selectedPlayer.mainPrizeHistory.map(entry => ({ ...entry }))
                        : [],
                    mainOomHistoryVersion: selectedPlayer.mainOomHistoryVersion,
                    activeSponsors: [], technicalPartner: null,
                    equipment: { board: 0, surround: 0, light: 0 },
                    scoringXP: 0, doublesXP: 0,
                    trainingWeekKey: null, trainingSessionsThisWeek: 0,
                    achievements: [],
                    careerStats: { highestAvg: 0, highestCheckout: 0, total180s: 0, nineDarters: 0, tonPlusCheckouts: 0, trophies: [] },
                    rivalries: {}, activeRivalIds: [], careerChronicle: [],
                    calendarFilters: { version: 1, hiddenTournamentKeys: [] }
                };
                if (typeof initializeCareerDifficulty === 'function') initializeCareerDifficulty(player);
                for (const kind of ['photo', 'walkon']) {
                    if (modMedia[kind] instanceof Blob) setPlayerProfileMediaFromFile(kind, modMedia[kind]);
                }

                // Usuń także historyczne aliasy tego zawodnika, nie tylko dokładnie wybrany wpis.
                if (typeof removeCareerPlayerFromAiPool === 'function') removeCareerPlayerFromAiPool();

                currentMatch = null;
                activeTournament = null;
                tournamentBracket = [];
                tournamentMatchHistory = null;
                tournamentRound = 32;
                lastTournamentResults = '';
                currentRoundHTML = '';
                preTournamentRanks = { main: 0, pt: 0, pc: 0 };
                gdlTable = [];
                if (typeof resetGrandSlamState === 'function') resetGrandSlamState();
                emails = [];
                unreadMailsCount = 0;

                normalizePlayerIds(pdcPlayers, player);
                if (typeof refreshMainOrderOfMerit === 'function') {
                    refreshMainOrderOfMerit([...pdcPlayers, player], currentDate);
                }
                if (typeof migratePdcTourCardSystem === 'function') {
                    migratePdcTourCardSystem([...pdcPlayers, player], currentDate);
                }
                if (typeof initializeCareerRecords === 'function') initializeCareerRecords(true);
                if (typeof initializeTournamentFinances === 'function') initializeTournamentFinances(true);
                initAllPlayerSeasonStats();
                if (typeof resetSponsorOffers === 'function') resetSponsorOffers();
                if (typeof initializeWorldNews === 'function') initializeWorldNews(true);
                if (typeof initializeSeasonArchive === 'function') initializeSeasonArchive(true);
                if (typeof initializePlayerStaff === 'function') initializePlayerStaff(true);
                if (typeof initializePlayerEvents === 'function') initializePlayerEvents(true);
                if (typeof initializeTournamentWatchSettings === 'function') initializeTournamentWatchSettings(player, true);
                if (typeof initializeBounceOutSettings === 'function') initializeBounceOutSettings(player, true);
                if (typeof initializeAllPlayerTraits === 'function') initializeAllPlayerTraits(true);
                if (typeof initializeCareerInfrastructure === 'function') initializeCareerInfrastructure(true);
                if (typeof initializeCareerLifestyle === 'function') initializeCareerLifestyle(true);
                if (typeof initializePlayerEquipmentWear === 'function') initializePlayerEquipmentWear(true);
                initCareerStats();
                initCareerChronicle();
                initRivalries();
                initPlayerXP();
                if (typeof initializeTutorialForNewCareer === 'function') initializeTutorialForNewCareer();
                renderOpponentOptions();
                renderCareerPlayerOptions();
                updateMailBadge();

                const hubPhoto = document.getElementById('hub-photo');
                if (hubPhoto) hubPhoto.src = player.photo || 'https://via.placeholder.com/120?text=ZAWODNIK';
                updateHub();
                showScreen('screen-hub');
            } finally {
                existingPlayerCareerStarting = false;
                if (startButton) startButton.disabled = false;
            }
        }

        document.getElementById('create-player-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return;
            if (typeof waitForPersistedModRestore === 'function') {
                await waitForPersistedModRestore();
            }
            
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return;
            const favoriteDoubles = getFavoriteDoubleSelectValues();
            updateFavoriteDoubleChoices();
            if (favoriteDoubles.some(value => !Number.isInteger(value) || value < 1 || value > 20)
                || new Set(favoriteDoubles).size !== 3) {
                document.getElementById('favorite-double')?.reportValidity?.();
                return;
            }
            const potVal = document.getElementById('potential').value;
            let ovr = 55;
            if (potVal === 'weak') ovr = 45;
            else if (potVal === 'medium') ovr = 55;
            else if (potVal === 'good') ovr = 65;
            else if (potVal === 'very_good') ovr = 75;
            else if (potVal === 'goat') ovr = 82;
            
            if (typeof clearCareerProfileMediaRuntime === 'function') clearCareerProfileMediaRuntime();
            player = {
                id: createEntityId('player'),
                name: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
                country: document.getElementById('nationality').value,
                birthYear: (currentDate instanceof Date ? currentDate.getFullYear() : 2026) - parseInt(document.getElementById('age').value, 10),
                careerDebutSeason: currentDate.getFullYear(),
                difficulty: typeof getSelectedCareerDifficulty === 'function'
                    ? getSelectedCareerDifficulty('custom') : 'normal',
                walkonTournamentMode: 'stage',
                overall: ovr, ovr: ovr, scoring: ovr + 2, doubles: ovr - 2,
                favoriteDouble: favoriteDoubles[0],
                favoriteDoubles,
                budget: 150, prof: 50, pop: 20, stamina: 100,
                prizeMoney: 0,
                proTourPrizeMoney: 0,
                pcPrizeMoney: 0,
                challengeTourPrizeMoney: 0,
                developmentTourPrizeMoney: 0,
                europeanTourPrizeMoney: 0,
                scoringXP: 0, doublesXP: 0,
                trainingWeekKey: null, trainingSessionsThisWeek: 0,
                photo: "", walkon: null,
                historyPT: {},
                historyMain: {},
                mainPrizeHistory: [],
                mainOomHistoryVersion: typeof MAIN_ORDER_OF_MERIT_VERSION !== 'undefined'
                    ? MAIN_ORDER_OF_MERIT_VERSION
                    : 1,
                rivalries: {},
                activeRivalIds: [],
                careerChronicle: [],
                calendarFilters: { version: 1, hiddenTournamentKeys: [] }
            };
            if (typeof initializeCareerDifficulty === 'function') initializeCareerDifficulty(player);
            emails = [];
            unreadMailsCount = 0;
            const startsWithTourCard = document.getElementById('start-with-tour-card')?.value === 'yes';
            if (startsWithTourCard && typeof seedCareerPlayerIntoPdcTop64 === 'function') {
                seedCareerPlayerIntoPdcTop64(player, [...pdcPlayers, player], currentDate);
            } else if (typeof clearPdcTourCard === 'function' && typeof getPdcTourCardCycleYear === 'function') {
                clearPdcTourCard(player, getPdcTourCardCycleYear(currentDate));
            } else {
                player.hasTourCard = startsWithTourCard;
            }
            if (typeof resetGrandSlamState === 'function') resetGrandSlamState();
            if (typeof initializeCareerRecords === 'function') initializeCareerRecords(true);
            if (typeof initializeTournamentFinances === 'function') initializeTournamentFinances(true);
            initAllPlayerSeasonStats();
            if (typeof resetSponsorOffers === 'function') resetSponsorOffers();
            if (typeof initializeWorldNews === 'function') initializeWorldNews(true);
            if (typeof initializeSeasonArchive === 'function') initializeSeasonArchive(true);
            if (typeof initializePlayerStaff === 'function') initializePlayerStaff(true);
                if (typeof initializePlayerEvents === 'function') initializePlayerEvents(true);
                if (typeof initializeTournamentWatchSettings === 'function') initializeTournamentWatchSettings(player, true);
                if (typeof initializeBounceOutSettings === 'function') initializeBounceOutSettings(player, true);
            if (typeof initializeAllPlayerTraits === 'function') initializeAllPlayerTraits(true);
            if (typeof initializeCareerInfrastructure === 'function') initializeCareerInfrastructure(true);
            if (typeof initializeCareerLifestyle === 'function') initializeCareerLifestyle(true);
            if (typeof initializePlayerEquipmentWear === 'function') initializePlayerEquipmentWear(true);
            if (typeof initializeTutorialForNewCareer === 'function') initializeTutorialForNewCareer();

            const photoInput = document.getElementById('photoUpload');
            const audioInput = document.getElementById('walkonUpload');

            try {
                // Pliki są trzymane jako Bloby w IndexedDB; Data URL pozostaje zgodnym fallbackiem.
                if (photoInput && photoInput.files.length > 0) {
                    player.photo = typeof setPlayerProfileMediaFromFile === 'function'
                        ? setPlayerProfileMediaFromFile('photo', photoInput.files[0])
                        : await convertFileToBase64(photoInput.files[0]);
                    document.getElementById('hub-photo').src = player.photo;
                } else {
                    document.getElementById('hub-photo').src = "https://via.placeholder.com/120?text=ZAWODNIK";
                }

                if (audioInput && audioInput.files.length > 0) {
                    player.walkon = typeof setPlayerProfileMediaFromFile === 'function'
                        ? setPlayerProfileMediaFromFile('walkon', audioInput.files[0])
                        : await convertFileToBase64(audioInput.files[0]);
                }
            } catch (error) {
                console.error('Nie udało się odczytać pliku profilu.', error);
                alert('Nie udało się odczytać zdjęcia lub muzyki. Kariera zostanie utworzona bez tego pliku.');
                player.photo = '';
                player.walkon = null;
                if (typeof clearCareerProfileMediaRuntime === 'function') clearCareerProfileMediaRuntime();
            }

            updateHub(); 
            showScreen('screen-hub');
        });

        function updateHub() {
            if (typeof player.stamina === 'undefined') player.stamina = 100; // Inicjalizacja dla starych zapisów
            if (typeof refreshCareerDifficultyUI === 'function') refreshCareerDifficultyUI();
            if (typeof refreshWalkonSettingsUI === 'function') refreshWalkonSettingsUI();
            if (typeof refreshTournamentWatchSettingsUI === 'function') refreshTournamentWatchSettingsUI();
            if (typeof refreshBounceOutSettingsUI === 'function') refreshBounceOutSettingsUI();
            if (typeof updateTournamentEntrySimulationButton === 'function') updateTournamentEntrySimulationButton('t-btn-sim-to-match-hub');

            document.getElementById('hub-name').innerText = player.name;
            document.getElementById('hub-flag').innerHTML = getFlagImg(player.country);
            
            let bStats = typeof getBoostedPlayerStats === 'function' ? getBoostedPlayerStats() : { overall: player.overall, scoring: player.scoring, doubles: player.doubles, bonusStr: '', staminaPenalty: 0 };
            if (typeof getPlayerEventMatchRatings === 'function') bStats = getPlayerEventMatchRatings(player, bStats);
            
            document.getElementById('hub-ovr').innerText = bStats.overall;
            
            // Kolorowe dopiski o sprzęcie i zmęczeniu
            let extraHTML = "";
            if (bStats.bonusStr) extraHTML += `<span style="font-size: 11px; color: var(--accent-green); margin-left: 5px;">${bStats.bonusStr}</span>`;
            if (bStats.staminaPenalty < 0) extraHTML += `<span style="font-size: 11px; color: var(--accent-red); margin-left: 5px;">(${bStats.staminaPenalty} OVR)</span>`;
            document.getElementById('hub-ovr').innerHTML += extraHTML;
            
            document.getElementById('hub-score-stat').innerText = bStats.scoring;
            document.getElementById('hub-double-stat').innerText = bStats.doubles;
            if(document.getElementById('hub-budget')) document.getElementById('hub-budget').innerText = `£${player.budget.toLocaleString('en-GB')}`;

            // Wyświetlanie energii
            if(document.getElementById('hub-stamina')) {
                document.getElementById('hub-stamina').innerText = `${Math.round(player.stamina)}%`;
                let stamColor = player.stamina > 70 ? '#27ae60' : (player.stamina > 40 ? '#f39c12' : '#c0392b');
                document.getElementById('hub-stamina').style.color = stamColor;
            }
            
            // --- ALGORYTM FOLLOWERSÓW ---
            if (typeof player.pop === 'undefined') player.pop = 20;
            if (typeof player.prof === 'undefined') player.prof = 50;

            let rank = getPlayerRank('main');
            let rankFactor = Math.max(1, 130 - rank); // Skala od 1 do 129
            
            // Baza fanów oparta na rankingu (Top 1 ma ogromną przewagę)
            let baseByRank = Math.pow(rankFactor, 2.5); 
            
            // Mnożnik medialności (od 0.6 dla nudziarzy do x16 dla showmanów 100 Pop)
            const effectivePop = typeof getPlayerMediaPresence === 'function' ? getPlayerMediaPresence() : player.pop;
            const effectiveProf = typeof getPlayerProfessionalism === 'function' ? getPlayerProfessionalism() : player.prof;
            let popFactor = Math.pow(effectivePop / 25, 2); 
            
            let followers = Math.floor(baseByRank * popFactor * 0.8);
            
            if(document.getElementById('hub-prof')) document.getElementById('hub-prof').innerText = Math.round(effectiveProf);
            if(document.getElementById('hub-pop')) document.getElementById('hub-pop').innerText = Math.round(effectivePop);
            if(document.getElementById('hub-followers')) document.getElementById('hub-followers').innerText = followers.toLocaleString('pl-PL');
            if (typeof refreshActiveRivals === 'function') {
                const rivalTileDesc = document.getElementById('rival-tile-desc');
                if (rivalTileDesc) rivalTileDesc.innerText = trRival('active', { count: refreshActiveRivals().length });
            }
            if (typeof updateWorldNewsBadge === 'function') updateWorldNewsBadge();
            if (typeof updatePlayerStaffHub === 'function') updatePlayerStaffHub();
            if (typeof refreshPlayerEventsViews === 'function') refreshPlayerEventsViews();
            if (typeof renderPlayerTraitsHub === 'function') renderPlayerTraitsHub();
            if (typeof updateCareerInfrastructureHub === 'function') updateCareerInfrastructureHub();
            if (typeof updateCareerLifestyleHub === 'function') updateCareerLifestyleHub();
            if (typeof updateTutorialTile === 'function') updateTutorialTile();
            if (typeof updateHubOverview === 'function') updateHubOverview();
        }

        // --- 5. SYSTEM CZASU, POCZTY I KALENDARZA ---
        function updateDateDisplay() {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            document.getElementById('game-date-display').innerText = currentDate.toLocaleDateString('pl-PL', options);
        }

        function getPendingTournamentForCareerDate(date = currentDate, includeOverdue = false) {
            if (!(date instanceof Date) || Number.isNaN(date.getTime())
                || typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return null;

            const careerYear = date.getFullYear();
            const targetMonth = date.getMonth();
            const targetDay = date.getDate();
            return tournamentDatabase
                .filter(tournament => tournament && tournament.completed !== true
                    && (typeof isTournamentScheduledForCareerYear !== 'function'
                        || isTournamentScheduledForCareerYear(tournament, careerYear))
                    && (includeOverdue
                        ? tournament.month < targetMonth || (tournament.month === targetMonth && tournament.day <= targetDay)
                        : tournament.month === targetMonth && tournament.day === targetDay))
                .sort((first, second) => first.month - second.month || first.day - second.day)[0]
                || null;
        }

        function activateTournamentFromCalendar(tournament) {
            if (!tournament) return null;
            activeTournament = tournament;
            const tournamentDisplayName = typeof getTournamentDisplayName === 'function'
                ? getTournamentDisplayName(tournament)
                : tournament.name;
            const nameDisplay = typeof document !== 'undefined'
                ? document.getElementById('tour-name-display')
                : null;
            const tournamentTile = typeof document !== 'undefined'
                ? document.getElementById('tile-tournament')
                : null;
            if (nameDisplay) nameDisplay.innerText = tournamentDisplayName;
            if (tournamentTile) tournamentTile.style.display = 'block';
            if (typeof updateTournamentEntrySimulationButton === 'function') updateTournamentEntrySimulationButton('t-btn-sim-to-match-hub');
            if (typeof updateCareerInfrastructureHub === 'function') updateCareerInfrastructureHub();
            return tournament;
        }

        function recoverPendingTournamentForCurrentDate(includeOverdue = false) {
            if (activeTournament && !activeTournament.completed) return activeTournament;
            const pendingTournament = getPendingTournamentForCareerDate(currentDate, includeOverdue);
            return pendingTournament ? activateTournamentFromCalendar(pendingTournament) : null;
        }

        // Zwraca true wyłącznie wtedy, gdy zawodnik kariery faktycznie znajduje się
        // w obsadzie danego wydarzenia. Przy braku wystarczających danych wybieramy
        // bezpieczną odpowiedź „tak”, aby nie dopuścić do treningu przed własnym meczem.
        function isCareerPlayerParticipatingInTournament(tournament, careerPlayer = player) {
            if (!tournament || !careerPlayer) return true;
            if (typeof isPlayerInjured === 'function' && isPlayerInjured(careerPlayer)) return false;
            const isCareerPlayer = candidate => {
                if (!candidate) return false;
                if (candidate === careerPlayer) return true;
                if (careerPlayer === player && typeof isCurrentPlayer === 'function') return isCurrentPlayer(candidate);
                return Boolean(careerPlayer.id && candidate.id && careerPlayer.id === candidate.id)
                    || (candidate.name === careerPlayer.name && candidate.country === careerPlayer.country);
            };
            const hasOpeningDraw = activeTournament === tournament
                && typeof tournamentRound !== 'undefined' && Number(tournamentRound) > 1
                && typeof tournamentBracket !== 'undefined' && Array.isArray(tournamentBracket)
                && tournamentBracket.length > 1;
            if (hasOpeningDraw) {
                if (typeof isUKOpenTournament === 'function' && isUKOpenTournament(tournament)
                    && typeof getUKOpenFullField === 'function') {
                    const candidates = typeof getPdcTourCardPlayers === 'function'
                        ? getPdcTourCardPlayers(true)
                        : [careerPlayer, ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])];
                    return getUKOpenFullField(tournament, candidates, currentDate, true).some(isCareerPlayer);
                }
                return tournamentBracket.some(isCareerPlayer);
            }

            const name = String(tournament.name || '').toLowerCase();
            const isLeague = name.includes('premier') || name.includes('global darts league');
            if (isLeague) {
                const leagueTable = typeof gdlTable !== 'undefined' && Array.isArray(gdlTable) ? gdlTable : [];
                if (!leagueTable.length) return true;
                if (name.includes('play-off')) {
                    if (leagueTable.length < 4) return true;
                    const finalists = [...leagueTable]
                        .sort((first, second) => (second.points - first.points)
                            || ((second.legsWon - second.legsLost) - (first.legsWon - first.legsLost)))
                        .slice(0, 4)
                        .map(row => row.player);
                    return finalists.some(isCareerPlayer);
                }
                return leagueTable.some(row => isCareerPlayer(row.player));
            }

            if (typeof isWorldCupTournament === 'function' && isWorldCupTournament(tournament)) {
                const teams = typeof worldCupState !== 'undefined' && Array.isArray(worldCupState?.teams)
                    ? worldCupState.teams : [];
                return teams.length ? teams.some(team => Array.isArray(team.players) && team.players.some(isCareerPlayer)) : true;
            }
            if (typeof isWorldCupQualifierTournament === 'function' && isWorldCupQualifierTournament(tournament)) return true;

            const isWorldMastersEvent = (typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(tournament))
                || (typeof isWorldMastersFinalsTournament === 'function' && isWorldMastersFinalsTournament(tournament))
                || (typeof isWorldMastersFinalsQualifierTournament === 'function' && isWorldMastersFinalsQualifierTournament(tournament));
            if (isWorldMastersEvent) {
                if (typeof getWorldMastersTournamentParticipants !== 'function') return true;
                try {
                    const participants = getWorldMastersTournamentParticipants(tournament);
                    return Array.isArray(participants) && participants.length
                        ? participants.some(isCareerPlayer)
                        : true;
                } catch (_error) {
                    return true;
                }
            }

            if (typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(tournament)) {
                return careerPlayer.hasTourCard !== true;
            }
            if (typeof isChallengeTourTournament === 'function' && isChallengeTourTournament(tournament)) {
                return careerPlayer.hasTourCard !== true;
            }
            if (typeof isDevelopmentTourTournament === 'function' && isDevelopmentTourTournament(tournament)) {
                const developmentCandidates = typeof getPdcTourCardPlayers === 'function'
                    ? getPdcTourCardPlayers(true)
                    : [careerPlayer, ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])];
                return typeof isDevelopmentTourEligiblePlayer === 'function'
                    ? isDevelopmentTourEligiblePlayer(careerPlayer, developmentCandidates, currentDate)
                    : false;
            }
            if (typeof isPdcTourCardQualifierTournament === 'function' && isPdcTourCardQualifierTournament(tournament)) {
                if (careerPlayer.hasTourCard !== true) return false;
                return !(typeof isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier === 'function'
                    && isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier(tournament));
            }
            if (typeof isCrownMastersQualifierTournament === 'function' && isCrownMastersQualifierTournament(tournament)) {
                return typeof isCareerPlayerEligibleForCrownMastersQualifier === 'function'
                    ? isCareerPlayerEligibleForCrownMastersQualifier(tournament, careerPlayer)
                    : true;
            }
            // Wyznaczenie obsady kwalifikatora Continental Tour zapisuje jej stan.
            // Nie robimy tego przy samym sprawdzeniu treningu — w razie braku już
            // utworzonej drabinki zachowujemy blokadę jako bezpieczny wariant.
            if (typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(tournament)) return true;

            const candidates = typeof getPdcTourCardPlayers === 'function'
                ? getPdcTourCardPlayers(true)
                : [careerPlayer, ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])]
                    .filter(candidate => candidate && candidate.hasTourCard !== false);

            // Turnieje z podglądem kwalifikacji (m.in. Continental Tour,
            // Matchplay, Grand Prix, Masters i MŚ) używają dokładnie tych samych
            // grup, co ich późniejsza drabinka. "pending" nie jest wpisem do
            // głównego turnieju, więc w takim przypadku trening jest dozwolony.
            if (typeof buildQualificationPreview === 'function') {
                try {
                    const preview = buildQualificationPreview(tournament, candidates, currentDate, careerPlayer);
                    if (preview?.kind) return preview.status === 'in' || preview.status === 'confirmed';
                } catch (_error) {
                    return true;
                }
            }

            const isPlayersChampionship = (typeof isPlayersChampionshipTournament === 'function'
                && isPlayersChampionshipTournament(tournament))
                || ((name.includes('players championship') || name.includes('pro players cup')) && !name.includes('final'));
            if (isPlayersChampionship) {
                const cardHolders = [...candidates].filter(candidate => candidate.hasTourCard === true)
                    .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
                const replacements = [...candidates].filter(candidate => candidate.hasTourCard !== true)
                    .sort((first, second) => typeof comparePlayersChampionshipReserveOrder === 'function'
                        ? comparePlayersChampionshipReserveOrder(first, second)
                        : (Number(second.challengeTourPrizeMoney) || 0) - (Number(first.challengeTourPrizeMoney) || 0)
                            || (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
                const field = [...cardHolders.slice(0, 128), ...replacements.slice(0, Math.max(0, 128 - cardHolders.length))];
                return field.some(isCareerPlayer);
            }

            // Zwykłe wydarzenia rozgrywane są przez Top 16 OOM oraz kolejne
            // miejsca z ProTour do pełnej stawki 32 zawodników.
            if (!tournament.specialType) {
                const oomRanked = [...candidates].sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
                const proTourRanked = [...candidates].sort((first, second) => (Number(second.proTourPrizeMoney) || 0) - (Number(first.proTourPrizeMoney) || 0));
                const field = new Set(oomRanked.slice(0, 16));
                for (const candidate of proTourRanked) {
                    field.add(candidate);
                    if (field.size >= 32) break;
                }
                return [...field].some(isCareerPlayer);
            }

            return true;
        }

        function advanceDay({ recoverStamina = true } = {}) {
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
            // Starszy zapis mógł powstać już w dniu turnieju, zanim autosave
            // zdążył przypiąć wydarzenie. Nie pozwalamy przeskoczyć takiej imprezy;
            // dotyczy to również wcześniejszych wydarzeń pominiętych przez dawny próg OVR.
            if ((!activeTournament || activeTournament.completed)
                && typeof recoverPendingTournamentForCurrentDate === 'function') {
                if (activeTournament?.completed) activeTournament = null;
                recoverPendingTournamentForCurrentDate(true);
            }
            if (activeTournament && !activeTournament.completed) {
                const autoSimulatePending = typeof shouldAutoSimulateUnwatchedTournament === 'function'
                    ? shouldAutoSimulateUnwatchedTournament(activeTournament)
                    : typeof isPlayerInjured === 'function' && isPlayerInjured(player);
                if (autoSimulatePending
                    && typeof startTournament === 'function') {
                    // The draw makes the final eligibility decision. Do not
                    // withdraw a player based on an advance qualification preview.
                    if (typeof shouldAutoSimulateUnwatchedTournament !== 'function') isSkippingTournament = true;
                    const simulation = startTournament();
                    const resumeDay = () => activeTournament && !activeTournament.completed
                        ? false : advanceDay({ recoverStamina });
                    return simulation && typeof simulation.then === 'function'
                        ? simulation.then(completed => completed ? resumeDay() : false) : resumeDay();
                }
                const messages = {
                    pl: 'Najpierw dokończ turniej albo wybierz opcję „Odpuść turniej”.',
                    en: 'Finish the tournament first or choose “Skip tournament”.',
                    de: 'Beende zuerst das Turnier oder wähle „Turnier überspringen“.',
                    nl: 'Maak eerst het toernooi af of kies „Toernooi overslaan“. '
                };
                alert(messages[currentLang] || messages.en);
                return;
            }

            if (currentDate.getMonth() === 11 && currentDate.getDate() === 31
                && typeof settleAiSeasonDevelopment === 'function') {
                settleAiSeasonDevelopment(currentDate.getFullYear());
            }
            if (currentDate.getMonth() === 11 && currentDate.getDate() === 31
                && typeof finalizeSeasonArchive === 'function') {
                finalizeSeasonArchive(currentDate.getFullYear());
            }
            if (currentDate.getMonth() === 11 && currentDate.getDate() === 31
                && typeof settleSponsorGoals === 'function') {
                settleSponsorGoals(currentDate.getFullYear());
            }
            currentDate.setDate(currentDate.getDate() + 1);
            const investmentIncome = typeof processCareerInvestmentIncome === 'function' ? processCareerInvestmentIncome() : null;
            const staffPayroll = typeof processPlayerStaffPayroll === 'function' ? processPlayerStaffPayroll() : null;
            const infrastructureMaintenance = typeof processCareerInfrastructureMaintenance === 'function'
                ? processCareerInfrastructureMaintenance()
                : null;
            const equipmentWear = typeof processPlayerEquipmentWear === 'function'
                ? processPlayerEquipmentWear()
                : null;
            if (typeof refreshMainOrderOfMerit === 'function') {
                refreshMainOrderOfMerit([...pdcPlayers, player], currentDate);
            }
            if (typeof refreshProTourOrderOfMerit === 'function') {
                refreshProTourOrderOfMerit([...pdcPlayers, player], currentDate);
            }
            updateDateDisplay();

            if (recoverStamina) {
                if (typeof recoverDailyStamina === 'function') {
                    recoverDailyStamina(player);
                } else {
                    // Awaryjna ścieżka dla przeglądarki, która ma jeszcze starszy
                    // plik modułu w pamięci podręcznej.
                    const currentStamina = Number.isFinite(Number(player.stamina)) ? Number(player.stamina) : 100;
                    player.stamina = Math.min(100, currentStamina + 10);
                }
                if (typeof recoverCareerPreparation === 'function') recoverCareerPreparation(player);
            }
            updateHub();

            // --- Wypłaty i reset na początku miesiąca/roku ---
            if (currentDate.getDate() === 1) {
                
                // 1. Zwykłe rozliczenia sponsorskie
                let totalSponsorship = 0;
                if (player.activeSponsors && player.activeSponsors.length > 0) {
                    player.activeSponsors.forEach(s => { totalSponsorship += s.monthlyValue; s.months--; });
                    player.activeSponsors = player.activeSponsors.filter(s => s.months > 0);
                }
                const staffSponsorBonus = typeof getPlayerStaffSponsorBonus === 'function' ? getPlayerStaffSponsorBonus(totalSponsorship) : 0;
                totalSponsorship += staffSponsorBonus;
                if (player.technicalPartner) {
                    totalSponsorship += player.technicalPartner.monthlyValue;
                    player.technicalPartner.months--;
                    if(player.technicalPartner.months <= 0) player.technicalPartner = null;
                }
                if (totalSponsorship > 0) {
                    player.budget += totalSponsorship;
                    let subSpon = t('t-email-spon-sub');
                    let bodySpon = t('t-email-spon-body').replace('{amount}', totalSponsorship.toLocaleString('en-GB'));
                    if (staffSponsorBonus > 0 && typeof trPlayerStaff === 'function') {
                        bodySpon += `<p>${escapeHtml(trPlayerStaff('managerIncome', { amount: playerStaffMoney(staffSponsorBonus) }))}</p>`;
                    }
                    addEmail(t('t-sender-acc'), subSpon, bodySpon);
                    generateOffers(); updateHub();
                }

                // 2. Reset rankingów liczonych w roku kalendarzowym (1 stycznia)
                if (currentDate.getMonth() === 0) {
                    if (typeof resetSponsorOffers === 'function') resetSponsorOffers();
                    const completedYear = currentDate.getFullYear() - 1;
                    addCareerChronicleEvent('season', {
                        year: completedYear,
                        rank: getPlayerRank('main'),
                        prize: player.prizeMoney || 0,
                        timestamp: new Date(completedYear, 11, 31).getTime()
                    });
                    if (typeof processAnnualPlayerLifecycle === 'function') {
                        processAnnualPlayerLifecycle(completedYear);
                    }
                    if (typeof processPdcTourCardCycleStart === 'function') {
                        processPdcTourCardCycleStart([...pdcPlayers, player], currentDate);
                    }
                    if (typeof awardPdcSecondaryTourCards === 'function') {
                        awardPdcSecondaryTourCards([...pdcPlayers, player], completedYear, player);
                    }
                    if (typeof fillPdcTourCardVacancies === 'function'
                        && (typeof isPdcQSchoolYear !== 'function' || !isPdcQSchoolYear(currentDate))) {
                        fillPdcTourCardVacancies([...pdcPlayers, player], currentDate, 'vacancy');
                    }
                    player.pcPrizeMoney = 0;
                    if (typeof pdcPlayers !== 'undefined') {
                        pdcPlayers.forEach(p => p.pcPrizeMoney = 0);
                    }
                    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('pc');
                    if (typeof resetEuropeanTourOrderOfMerit === 'function') {
                        resetEuropeanTourOrderOfMerit([...pdcPlayers, player]);
                    }
                    if (typeof resetChallengeTourOrderOfMerit === 'function') {
                        resetChallengeTourOrderOfMerit([...pdcPlayers, player]);
                    }
                    if (typeof resetDevelopmentTourOrderOfMerit === 'function') {
                        resetDevelopmentTourOrderOfMerit([...pdcPlayers, player]);
                    }
                    if (typeof tournamentDatabase !== 'undefined') {
                        tournamentDatabase.forEach(tournament => {
                            tournament.completed = false;
                            tournament.historyLogs = '';
                            delete tournament.matchHistory;
                            delete tournament.bracketSeedPlayerKeys;
                            delete tournament.staminaChargedYear;
                            delete tournament.travelChargedYear;
                            delete tournament.travelRequestedStandard;
                            delete tournament.travelStandardUsed;
                            delete tournament.travelCostPaid;
                            delete tournament.travelPreparationLoss;
                            delete tournament.playersChampionshipWithdrawals;
                            delete tournament.playersChampionshipReplacements;
                            delete tournament.playersChampionshipPairedWithdrawalKeys;
                            delete tournament.withdrawalReportEntries;
                            delete tournament.withdrawalReportSent;
                            delete tournament.withdrawalReportSentYear;
                        });
                    }
                    gdlTable = [];
                    resetAllPlayerSeasonStats(currentDate.getFullYear());
                    if (typeof resetWorldMastersSeason === 'function') resetWorldMastersSeason(currentDate.getFullYear());
                    if (typeof initializeSeasonArchive === 'function') initializeSeasonArchive();
                    
                    // Powiadomienie e-mail o nowym sezonie
                    addEmail(t('t-sender-league'), t('t-email-newyear-sub'), t('t-email-newyear-body'));
                    updateHub();
                }
            }
            const playerEvents = typeof processDailyPlayerEvents === 'function' ? processDailyPlayerEvents() : null;
            if (playerEvents?.changed) updateHub();
            if (typeof recordWorldNewsRankingChange === 'function') recordWorldNewsRankingChange();
            const shouldAutoSaveToday = currentDate.getDate() === 1 || currentDate.getDate() === 15
                || staffPayroll?.changed === true || infrastructureMaintenance?.changed === true || investmentIncome?.changed === true
                || equipmentWear?.changed === true || playerEvents?.changed === true;

            // --- Kwalifikacje do Ligi (1 lutego) ---
            if (currentDate.getMonth() === 1 && currentDate.getDate() === 1) {
                let oomRanked = [...pdcPlayers, player]
                    .filter(candidate => typeof isPdcTourCardEligiblePlayer !== 'function' || isPdcTourCardEligiblePlayer(candidate))
                    .sort((a,b) => b.prizeMoney - a.prizeMoney);
                gdlTable = [];
                // Top 4 Order of Merit
                oomRanked.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                // Losowi 4 gracze z miejsc 5-12
                let candidates = shuffle(oomRanked.slice(4, 12));
                candidates.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                
                let isMeSelected = gdlTable.some(g => isCurrentPlayer(g.player));
                let leagueName = pdcPlayers.some(p => p.name === "Luke Littler") ? "Premier League" : "Global Darts League";
                
                let bodyStr = isMeSelected 
                    ? t('t-email-league-qual-yes').replace('{league}', leagueName)
                    : t('t-email-league-qual-no').replace('{league}', leagueName);
                addEmail(t('t-sender-league'), t('t-email-league-qual-sub').replace('{league}', leagueName), bodyStr);
            }
            // -----------------------------------------------------

            document.getElementById('tile-tournament').style.display = 'none';

            if (typeof tournamentDatabase !== 'undefined') {
                const todayTournament = typeof getPendingTournamentForCareerDate === 'function'
                    ? getPendingTournamentForCareerDate(currentDate)
                    : tournamentDatabase.find(t_tour =>
                        t_tour.completed !== true
                        && t_tour.month === currentDate.getMonth()
                        && t_tour.day === currentDate.getDate()
                        && (typeof isTournamentScheduledForCareerYear !== 'function'
                            || isTournamentScheduledForCareerYear(t_tour, currentDate.getFullYear()))
                    );
                if (todayTournament) {
                    const tournamentDisplayName = typeof getTournamentDisplayName === 'function'
                        ? getTournamentDisplayName(todayTournament)
                        : todayTournament.name;
                    if (typeof handleWorldMastersTournamentDay === 'function') handleWorldMastersTournamentDay(todayTournament);
                    let formatWarning = todayTournament.format === 'DIDO' ? t('t-alert-tour-dido') : "";
                    
                    let subjectToday = t('t-email-tour-today-sub').replace('{tour}', tournamentDisplayName);
                    let bodyToday = t('t-email-tour-today-body').replace('{city}', t(todayTournament.city));
                    addEmail(t('t-sender-org'), subjectToday, bodyToday);
                    
                    const autoSimulateToday = typeof shouldAutoSimulateUnwatchedTournament === 'function'
                        && shouldAutoSimulateUnwatchedTournament(todayTournament);
                    if (!autoSimulateToday) alert(`${t('t-alert-tour-start')} ${tournamentDisplayName}!${formatWarning}`);

                    if (typeof shouldAutoSimulateUnwatchedTournament === 'function') {
                        activateTournamentFromCalendar(todayTournament);
                        if (shouldAutoSaveToday && typeof saveGame === 'function') saveGame(true);
                        return startTournament();
                    }

                    const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function'
                        && isContinentalQualifierTournament(todayTournament);
                    const playerSkipsContinentalQualifier = isContinentalQualifier
                        && typeof getContinentalTourQualifierParticipants === 'function'
                        && !getContinentalTourQualifierParticipants(todayTournament).some(isCurrentPlayer);
                    const cardHolderSkipsQSchool = typeof isPdcQSchoolTournament === 'function'
                        && isPdcQSchoolTournament(todayTournament)
                        && player?.hasTourCard === true;
                    const cardHolderSkipsChallengeTour = typeof isChallengeTourTournament === 'function'
                        && isChallengeTourTournament(todayTournament)
                        && player?.hasTourCard === true;
                    const playerSkipsDevelopmentTour = typeof isDevelopmentTourTournament === 'function'
                        && isDevelopmentTourTournament(todayTournament)
                        && typeof isDevelopmentTourEligiblePlayer === 'function'
                        && !isDevelopmentTourEligiblePlayer(player, getPdcTourCardPlayers(true), currentDate);
                    const playerSkipsTourCardQualifier = typeof isPdcTourCardQualifierTournament === 'function'
                        && isPdcTourCardQualifierTournament(todayTournament)
                        && (player?.hasTourCard !== true
                            || (typeof isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier === 'function'
                                 && isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier(todayTournament)));
                    const playerSkipsCrownMastersQualifier = typeof isCrownMastersQualifierTournament === 'function'
                        && isCrownMastersQualifierTournament(todayTournament)
                        && typeof isCareerPlayerEligibleForCrownMastersQualifier === 'function'
                        && !isCareerPlayerEligibleForCrownMastersQualifier(todayTournament, player);
                    const playerSkipsForInjury = typeof isPlayerInjured === 'function' && isPlayerInjured(player);
                    if (playerSkipsForInjury || playerSkipsContinentalQualifier || cardHolderSkipsQSchool
                        || cardHolderSkipsChallengeTour || playerSkipsDevelopmentTour || playerSkipsTourCardQualifier
                        || playerSkipsCrownMastersQualifier) {
                        // Gracz nie bierze udziału w tej ścieżce kwalifikacji.
                        // Rozstrzygamy ją w tle, bez otwierania drabinki i bez
                        // konieczności wybierania opcji „Odpuść”.
                        activateTournamentFromCalendar(todayTournament);
                        if (shouldAutoSaveToday && typeof saveGame === 'function') saveGame(true);
                        return startTournament();
                    }

                    // minOvr było dawnym skrótem kwalifikacji. Obecna obsada jest
                    // wyliczana w startTournament na podstawie rankingów i ścieżek
                    // kwalifikacyjnych, więc nawet gracz spoza stawki musi móc
                    // otworzyć oraz zasymulować turniej AI.
                    activateTournamentFromCalendar(todayTournament);
                    if (shouldAutoSaveToday && typeof saveGame === 'function') saveGame(true);
                    return; 
                }
            }

            if (shouldAutoSaveToday && typeof saveGame === 'function') saveGame(true);

        }

    function getStoredEmailTimestamp(email) {
        const storedTimestamp = Number(email?.createdAt);
        if (Number.isFinite(storedTimestamp) && storedTimestamp > 0) return storedTimestamp;

        const legacyDate = String(email?.date || '').match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (!legacyDate) return null;
        const parsedTimestamp = new Date(
            Number(legacyDate[3]),
            Number(legacyDate[2]) - 1,
            Number(legacyDate[1])
        ).getTime();
        return Number.isFinite(parsedTimestamp) ? parsedTimestamp : null;
    }

    // Tylko odciski dawnych maili w czterech językach, do czyszczenia starych zapisów.
    // Nie zawierają treści ani szablonów do generowania nowych wiadomości.
    const LEGACY_RANDOM_EMAIL_FINGERPRINTS = new Set([
        "133:e544ed12", "122:c62fb748", "142:3890e6cc", "136:dc1660eb", "148:708b5085", "150:9775ffed",
        "179:37477dd9", "158:67757c63", "194:986372ae", "191:6b44ee08", "221:7d4a084e", "223:11f71e80",
        "152:763e938", "156:92642d52", "191:9602365d", "154:fe9808cc", "147:31df6941", "159:90d06937",
        "193:38c4321", "177:4c0cc8be", "163:ba1c1f34", "153:b51f3f34", "184:679d2cf", "179:bf6eedcc",
        "164:d63e5af", "162:ded31318", "180:7f1d3342", "168:696ec53a", "183:98a0e9ee", "183:f4680e4d",
        "206:6bbee18a", "203:e9479121", "160:24be6594", "162:16a99e59", "173:8d25dcb0", "154:a8e719d",
        "137:e0ecb1a9", "120:b7af2349", "134:6f86a1cc", "130:e0fbfd34", "154:eb52ffe4", "146:a0b8b83d",
        "184:94b0183d", "165:b3cb4159", "187:4b10f913", "179:da00f337", "213:f8909389", "201:6073f135",
        "156:d7f406a0", "153:14559167", "155:e0705bf0", "155:5d0c5111", "164:424492e5", "159:2480eae8",
        "186:b5c917c6", "188:c58a4dae", "167:97afbadb", "148:7da5a549", "180:b6c94b65", "168:adf63bfe",
        "176:8ed5bea5", "150:d97b5d15", "181:260b7854", "179:252ab1d9", "155:606c81e2", "153:9773b205",
        "169:5069d752", "168:5c225cad", "153:68f67a74", "141:867de6c0", "175:3b94f370", "169:4857cec4",
        "158:a5e75c00", "144:348d6a16", "173:96ec1bab", "170:606a6c24", "162:bf9f380", "176:4659f56d",
        "188:d81d7930", "189:a557aaf2", "167:7b18f681", "145:cdf6533", "190:b5c5c86", "174:de2bcafe",
        "162:9da31e49", "161:b2431fba", "197:9e013618", "191:76a0e498", "144:6727aca3", "150:b08dd125",
        "173:53f0c0f0", "168:5ce30415", "125:5c6182e8", "150:cd207f02", "166:bff40404", "152:9b4ab101",
        "139:16461b5c", "155:6a1c7593", "178:dbd8377f", "163:2a903eee", "155:e153d834", "164:f144f09c",
        "184:a664b340", "171:96edb804", "156:2acdc270", "174:6fde53dd", "256:b07367cb", "193:7f0ff59c",
        "152:36259456", "146:a0187f4e", "154:86ead9ef", "147:d1e698ff", "162:8447e4e0", "162:511d3d4f",
        "221:9422b941", "185:87b6e56d", "162:101e17f5", "180:268c7af0", "217:18a9b096", "220:784a87b9",
        "162:260a4a38", "142:4c2a38c9", "166:a28f24cf", "163:3e36378f", "139:42948260", "127:12c9d4ab",
        "155:5c91e484", "155:ce76e5f0", "151:cdae0dae", "154:7d5ad3ae", "175:96798b7c", "183:ef87f6b3",
        "148:32efd4cb", "168:96ea4dab", "176:ee48392a", "166:e071242f", "144:bd545afa", "167:fd3ccdde",
        "199:fcb58572", "189:62685c6b", "153:5acecf9e", "152:1f8a1188", "173:27851185", "147:338553b8",
        "162:55b0facb", "173:8896f6f1", "198:1057295e", "196:9edaf611", "163:92c61994", "169:55289b41",
        "190:e7a5fed", "151:3f273a3e", "154:58e03dbb", "134:f6218ba", "174:8945e1b1", "129:eeb4bf69",
        "109:eeb2e79b", "111:4478644c", "115:b28c934c", "110:8a2dcefa", "151:37b06094", "142:5ab8f058",
        "168:8244a22b", "147:91d6eef2", "144:ce25b320", "132:c20bc269", "175:82bb27e7", "142:650a889a",
        "138:1303a5e5", "115:8185cf62", "160:fe09cdfe", "138:b177200d", "143:9471ad4", "134:df913fa3",
        "155:b34985d0", "145:484eae90", "138:66088179", "131:b00ccb85", "148:9712cbee", "144:138a28f8",
        "130:4e598dbc", "126:75fb7d3d", "157:42498fdb", "126:23382378", "134:33d68f44", "127:e19d2b2b",
        "158:ae18bb7e", "144:3cd62998", "136:33d9196", "123:b8158203", "139:dc241749", "132:7b6c9114",
        "137:3e33159e", "128:b990e999", "154:6db21277", "143:5e0c64c2", "128:c31b55c4", "126:86b91f85",
        "150:986f8487", "121:fd209394", "152:edfd6e70", "146:10690c55", "151:7af63e4a", "143:7920c36a",
        "159:46f6d877", "138:9496069d", "163:5439836b", "173:a4592b66", "141:22858edb", "144:d1607c01",
        "161:d0e36559", "162:7cd42623", "149:da539cc7", "149:aea64689", "177:cbe8f16a", "166:bcadb8a6",
        "142:541e62cc", "151:ea4f9147", "174:8a92ae7", "172:55e032af", "151:220d9221", "143:a65942a9",
        "172:5b931256", "161:7f1e76c8", "141:759d7b08", "145:94f50ba3", "161:1420261c", "146:b9c27921",
        "143:d17579d4", "143:7918a4d6", "162:ce3fd761", "149:23d9a1ba", "138:d1cf8c6b", "130:ab82375c",
        "153:b63c33c1", "147:d6d9fac", "142:d8994022", "146:1b0627e6", "146:4beb5fd3", "156:37a6b95f",
        "141:6195f403", "148:ed8250a7", "161:1a216c22", "164:e95378d3", "156:cc585e61", "150:d389e4d4",
        "159:e5beb91", "157:29bea6d3", "146:e6b35a56", "157:70aa6ca1", "189:2ad0c255", "169:88d39e79",
        "146:54dce7a6", "151:ef23ecd7", "156:6df0106d", "137:efb6a718", "120:e11d0659", "117:23d3da67",
        "153:580cf30d", "128:eb47118e", "164:886af16", "173:94eb9f36", "174:b15f7226", "163:caad45d6",
        "142:536da52c", "141:26ebb76", "150:a327bcde", "155:546b3163", "133:b998825f", "134:16127a79",
        "135:a2e134ab", "133:127450de", "140:cdf0522d", "130:345b14fd", "139:f0eb4dbc", "130:97277f0f",
        "156:a0bd236b", "162:809928b9", "177:ad05e6c5", "167:c2e7247e", "140:2bd91fcb", "133:4e35b411",
        "149:4c675baf", "137:f3aa4d48", "140:9d0125ca", "140:4de036ff", "164:ec413bce", "172:bfa4e0f",
        "140:75cea5ca", "178:11b28976", "203:6f29aee2", "184:89e6b8f7", "150:d0cd8fe2", "156:869a47cf",
        "185:5ead344", "158:b8b061e3", "114:ce3e879", "116:9539c937", "135:d8c4fb4", "110:dc73ab39",
        "147:30ef69bd", "135:9397d51a", "145:ad1c1441", "141:95ae8f8e", "141:92f1146f", "153:35d60666",
        "173:aa82a89d", "168:8a0b3f15", "149:b41a9953", "136:7d3a69ae", "165:7b1ae0aa", "143:e0dab644",
        "161:dd1002ea", "156:dde9e8d7", "157:b3461a39", "155:dae8332c", "158:c9fa23ad", "146:200777da",
        "180:db214187", "155:5b6e0d89"
    ]);

    function isStoredRandomEmail(email) {
        if (email?.kind === 'random') return true;
        if (email?.kind === 'system') return false;
        if (!email || typeof email !== 'object') return false;

        const text = JSON.stringify([email.sender, email.subject, email.body]);
        let hash = 2166136261;
        for (let index = 0; index < text.length; index++) {
            hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
        }
        return LEGACY_RANDOM_EMAIL_FINGERPRINTS.has(`${text.length}:${(hash >>> 0).toString(16)}`);
    }

    function normalizeStoredEmails(sourceEmails, legacyUnreadCount = 0) {
        const safeEmails = Array.isArray(sourceEmails)
            ? sourceEmails.filter(email => email && typeof email === 'object')
            : [];
        const unreadLimit = Math.max(0, Math.min(safeEmails.length, Number(legacyUnreadCount) || 0));

        return safeEmails.map((email, index) => {
            const timestamp = getStoredEmailTimestamp(email);
            const hasCurrentMetadata = Number.isFinite(Number(email.createdAt))
                && (email.kind === 'random' || email.kind === 'system');
            return {
                ...email,
                createdAt: timestamp,
                kind: isStoredRandomEmail(email) ? 'random' : 'system',
                // Starsze wersje nie aktualizowały pola read. Licznik nieprzeczytanych
                // pozwala odtworzyć stan: najnowsze wiadomości są na początku tablicy.
                read: hasCurrentMetadata ? email.read === true : index >= unreadLimit
            };
        });
    }

    function removeRetiredRandomEmails(legacyUnreadCount = unreadMailsCount) {
        // Najpierw odtwarzamy stan przeczytania, dopiero potem usuwamy losowe maile.
        // Ich usunięcie nie może przesunąć granicy nieprzeczytanych wiadomości w starym zapisie.
        emails = normalizeStoredEmails(emails, legacyUnreadCount).filter(email => email.kind !== 'random');
        unreadMailsCount = emails.reduce((count, email) => count + (email.read === true ? 0 : 1), 0);
        return emails;
    }

    function addEmail(sender, subject, body, options = {}) {
        if (isStoredRandomEmail({ sender, subject, body, kind: options.kind })) return false;
        emails.unshift({
            sender,
            subject,
            body,
            date: currentDate.toLocaleDateString('pl-PL'),
            createdAt: currentDate.getTime(),
            kind: 'system',
            read: false,
            action: options.action === 'tutorial' ? 'tutorial' : undefined
        });
        unreadMailsCount++;
        updateMailBadge();
    }

        function updateMailBadge() {
            const badge = document.getElementById('mail-badge');
            if (unreadMailsCount > 0) {
                badge.innerText = unreadMailsCount; badge.style.display = "inline";
            } else {
                badge.style.display = "none";
            }
        }

        function showMailbox() {
    const list = document.getElementById('email-list');
    removeRetiredRandomEmails();
    const mailboxHtml = emails.map(e => `<div style="background:#0f3460; padding:10px; margin-bottom:10px; border-radius:5px; border-left:4px solid var(--accent-green);">
            <small style="color:#bdc3c7;">${escapeHtml(e.date)} | ${t('t-from')}: <strong>${escapeHtml(e.sender)}</strong></small>
            <h4 style="margin:5px 0;">${escapeHtml(e.subject)}</h4>
            <p style="margin:0; font-size:13px;">${sanitizeEmailHtml(e.body)}</p>
            ${typeof getTutorialEmailActionHtml === 'function' ? getTutorialEmailActionHtml(e) : ''}
        </div>`).join('');
    list.innerHTML = mailboxHtml || `<p style='text-align:center;'>${t('t-no-mails')}</p>`;
    emails.forEach(email => { email.read = true; });
    unreadMailsCount = 0; 
    updateMailBadge();
    showScreen('screen-mailbox');
}


        function showCalendar() {
            const list = document.getElementById('calendar-list');
            if(typeof tournamentDatabase === 'undefined') {
                list.innerHTML = "";
                if (typeof renderCalendarTournamentFilters === 'function') renderCalendarTournamentFilters([]);
                return;
            }
            // Budujemy całą listę przed zmianą DOM, aby każdy kolejny turniej
            // nie powodował ponownego parsowania wszystkich poprzednich wierszy.
            let calendarHtml = "";

            const scheduledEntries = tournamentDatabase
                .map((tour, idx) => ({ tour, idx }))
                .filter(({ tour }) => typeof isTournamentScheduledForCareerYear !== 'function'
                    || isTournamentScheduledForCareerYear(tour, currentDate.getFullYear()));
            const visibleEntries = typeof getVisibleCalendarTournamentEntries === 'function'
                ? getVisibleCalendarTournamentEntries(scheduledEntries)
                : scheduledEntries;
            if (typeof renderCalendarTournamentFilters === 'function') {
                renderCalendarTournamentFilters(scheduledEntries);
            }

            visibleEntries
                .sort((first, second) => first.tour.month - second.tour.month || first.tour.day - second.tour.day || first.idx - second.idx)
                .forEach(({ tour, idx }) => {
                let statusBadge = tour.completed 
                    ? `<button class="btn-sign" style="background:#3498db;" onclick="viewTournamentHistory(${idx})">${t('t-btn-results')}</button>` 
                    : `<span style="color:var(--accent-green)">${t('t-scheduled')}</span>`;
                    
                const planningButton = !tour.completed && typeof getPlanningTournamentKind === 'function' && getPlanningTournamentKind(tour)
                    ? `<button type="button" class="btn-sign planning-event-link" onclick="showCareerPlanning('qualification', ${idx})">${escapeHtml(trPlanning('qualification'))}</button>` : '';
                const championsButton = typeof isCareerChampionship === 'function' && isCareerChampionship(tour)
                    ? `<button type="button" class="btn-sign records-event-link" onclick="showTournamentChampions(${idx})">${escapeHtml(trCareerRecords('champions'))}</button>` : '';
                const financeButton = typeof trTournamentFinance === 'function'
                    ? `<button type="button" class="btn-sign finance-event-link" onclick="showTournamentFinance(${idx})">${escapeHtml(trTournamentFinance('link'))}</button>` : '';
                const year = currentDate.getFullYear();
                const startMonth = (tour.month + 1).toString().padStart(2, '0');
                const endMonth = ((Number.isInteger(tour.endMonth) ? tour.endMonth : tour.month) + 1).toString().padStart(2, '0');
                let dateStr = tour.endDay
                    ? (endMonth === startMonth
                        ? `${tour.day}-${tour.endDay}.${startMonth}.${year}`
                        : `${tour.day}.${startMonth}-${tour.endDay}.${endMonth}.${year}`)
                    : `${tour.day}.${startMonth}.${year}`;
                
                calendarHtml += `<div style="border-bottom:1px solid var(--border-color); padding:10px 0; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${dateStr}</strong> - <span style="color:white; font-size:15px;">${escapeHtml(typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tour) : tour.name)}</span>
                        <br><small style="color:#bdc3c7; display: flex; align-items: center; gap: 5px; margin-top: 3px;">
                            📍 ${escapeHtml(t(tour.city))}, ${getFlagImg(tour.country)} ${escapeHtml(t(tour.country))}
                        </small>
                    </div>
                    <div${championsButton || financeButton ? ' class="calendar-event-actions"' : ''}>${statusBadge}${planningButton}${championsButton}${financeButton}</div>
                </div>`;
            });
            list.innerHTML = calendarHtml || (scheduledEntries.length > 0 && typeof trCalendarFilter === 'function'
                ? `<p class="calendar-filter-empty">${escapeHtml(trCalendarFilter('empty'))}</p>`
                : '');
            showScreen('screen-calendar');
        }

        function viewTournamentHistory(index) {
            const tour = tournamentDatabase[index];
            const compactOrLegacyHistory = tour && typeof getCompletedTournamentHistoryHtml === 'function'
                ? getCompletedTournamentHistoryHtml(tour)
                : (tour?.historyLogs || '');
            const dynamicWorldCupHistory = tour?.specialType === 'worldCup' && tour.worldCupWinner && typeof trWorldCup === 'function'
                ? `<strong>${escapeHtml(getTournamentDisplayName(tour))}</strong><br>${trWorldCup('historyWinner', {
                    country: escapeHtml(getWorldCupCountryName(tour.worldCupWinner.country)),
                    players: escapeHtml((tour.worldCupWinner.players || []).join(' / '))
                })}`
                : '';
            const detailedWorldCupHistory = tour?.specialType === 'worldCup' && tour.worldCupWinner &&
                typeof buildWorldCupTournamentHistory === 'function' &&
                typeof worldCupState !== 'undefined' && worldCupState?.completed
                ? buildWorldCupTournamentHistory(tour.worldCupWinner)
                : '';
            const historyHtml = detailedWorldCupHistory || compactOrLegacyHistory || dynamicWorldCupHistory;
            if (tour && historyHtml) {
                document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
                // Nowe podsumowania World Cup zawierają pełną fazę grupową i pucharową.
                // Dla starych zapisów bez tego szczegółowego logu zostawiamy krótki komunikat o mistrzu.
                document.getElementById('results-content').innerHTML = historyHtml;
                if (typeof updateTournamentFinanceResults === 'function') updateTournamentFinanceResults(tour);
                document.getElementById('t-btn-next-round').style.display = 'none';
                const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
                if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
                if (typeof updateTournamentEntrySimulationButton === 'function') updateTournamentEntrySimulationButton('t-btn-sim-to-match-results', false);
                document.getElementById('t-btn-tour-back').style.display = 'block';
                document.getElementById('results-modal').style.display = 'flex';
            } else {
                alert(t('t-alert-no-history'));
            }
        }

        function triggerInterview(interviewContext = null) {
            if (typeof interviewsDB === 'undefined' || interviewsDB.length === 0) return false;

            const context = interviewContext || (typeof buildPostMatchInterviewContext === 'function'
                ? buildPostMatchInterviewContext(currentMatch, activeTournament, tournamentRound)
                : null);
            if (!context) return false;

            const validInterviews = typeof getVerifiedPostMatchInterviews === 'function'
                ? getVerifiedPostMatchInterviews(interviewsDB, context)
                : interviewsDB.filter(interview => interview?.trigger
                    && interview.trigger !== 'unverified'
                    && context.flags?.[interview.trigger] === true);
            if (validInterviews.length === 0) return false;

            const priorityInterviews = validInterviews.filter(interview => interview.trigger !== 'verified_summary');
            const fallbackInterviews = validInterviews.filter(interview => interview.trigger === 'verified_summary');
            const chosenPool = priorityInterviews.length > 0 && Math.random() < 0.75
                ? priorityInterviews
                : (fallbackInterviews.length > 0 ? fallbackInterviews : validInterviews);
            const interview = chosenPool[Math.floor(Math.random() * chosenPool.length)];
            const langSuffix = `_${currentLang}`;
            const renderText = template => typeof formatPostMatchInterviewText === 'function'
                ? formatPostMatchInterviewText(template, context)
                : String(template || '');

            document.getElementById('event-title').innerText = renderText(interview[`title${langSuffix}`] || interview.title_pl);
            document.getElementById('event-desc').innerText = renderText(interview[`desc${langSuffix}`] || interview.desc_pl);

            const choicesDiv = document.getElementById('event-choices');
            choicesDiv.innerHTML = '';

            interview.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = renderText(choice[`text${langSuffix}`] || choice.text_pl);

                button.onclick = function() {
                    player.prof = clamp((player.prof || 50) + choice.effect.prof, 0, 100);
                    player.pop = clamp((player.pop || 20) + choice.effect.pop, 0, 100);

                    alert(renderText(choice[`outcome${langSuffix}`] || choice.outcome_pl));

                    updateHub();
                    document.getElementById('event-modal').style.display = 'none';
                };
                choicesDiv.appendChild(button);
            });
            document.getElementById('event-modal').style.display = 'flex';
            return true;
        }

        // --- SYSTEM RYWALI I HISTORII H2H ---
        const ACTIVE_RIVALS_LIMIT = 10;

        function initRivalries() {
            if (!isPlainObject(player.rivalries)) player.rivalries = {};
            if (!Array.isArray(player.activeRivalIds)) player.activeRivalIds = [];
        }

        function getOpponentById(opponentId) {
            return pdcPlayers.find(candidate => candidate.id === opponentId) || null;
        }

        function getRivalryScore(record) {
            const closeRecordBonus = Math.min(record.wins, record.losses) * 3;
            return (record.matches * 3) + (record.importantMatches * 5) + (record.finals * 8) + (Math.abs(record.currentStreak) * 2) + closeRecordBonus;
        }

        function refreshActiveRivals() {
            initRivalries();
            const activeRivals = Object.values(player.rivalries)
                .filter(record => getOpponentById(record.opponentId))
                .filter(record => record.matches >= 2 || record.importantMatches >= 1)
                .sort((first, second) => getRivalryScore(second) - getRivalryScore(first) || second.lastDate - first.lastDate)
                .slice(0, ACTIVE_RIVALS_LIMIT);

            player.activeRivalIds = activeRivals.map(record => record.opponentId);
            return activeRivals;
        }

        function recordRivalryMatch(winner, loser, tournament, round, playerScore = '') {
            if (!isCurrentPlayer(winner) && !isCurrentPlayer(loser)) return;
            const opponent = isCurrentPlayer(winner) ? loser : winner;
            if (!opponent || opponent.isBye || !opponent.id) return;

            initRivalries();
            const wasActive = new Set(player.activeRivalIds);
            const playerWon = isCurrentPlayer(winner);
            const record = player.rivalries[opponent.id] || {
                opponentId: opponent.id, matches: 0, wins: 0, losses: 0,
                importantMatches: 0, finals: 0, currentStreak: 0,
                lastTournament: '', lastDate: 0, lastScore: '', lastResult: ''
            };

            record.matches++;
            if (playerWon) {
                record.wins++;
                record.currentStreak = record.currentStreak >= 0 ? record.currentStreak + 1 : 1;
            } else {
                record.losses++;
                record.currentStreak = record.currentStreak <= 0 ? record.currentStreak - 1 : -1;
            }
            if (round <= 8) record.importantMatches++;
            if (round === 2) record.finals++;
            record.lastTournament = tournament?.name || '';
            record.lastDate = currentDate.getTime();
            record.lastScore = playerScore;
            record.lastResult = playerWon ? 'win' : 'loss';
            player.rivalries[opponent.id] = record;

            refreshActiveRivals();
            const becameRival = !wasActive.has(opponent.id) && player.activeRivalIds.includes(opponent.id);
            if (becameRival) {
                addCareerChronicleEvent('rival', { opponentId: opponent.id, opponentName: opponent.name });
                addEmail(
                    trRival('rivalMailSender'),
                    trRival('rivalMailSubject', { name: opponent.name }),
                    trRival('rivalMailBody', { name: opponent.name, wins: record.wins, losses: record.losses })
                );
            }
        }

        function getRivalryStatus(record) {
            const difference = record.wins - record.losses;
            if (difference > 0) return { text: trRival('ahead'), color: 'var(--accent-green)' };
            if (difference < 0) return { text: trRival('behind'), color: 'var(--accent-red)' };
            return { text: trRival('even'), color: '#f1c40f' };
        }

        // Premia jest mała: H2H musi wyraźnie przechylać się w jedną stronę,
        // a maksymalna zmiana wynosi 2 punkty do scoringu i dubli.
        function getRivalryMatchModifier(record) {
            if (!record) return 0;
            const h2hDifference = (record.wins || 0) - (record.losses || 0);
            const streak = record.currentStreak || 0;
            let modifier = 0;

            if (Math.abs(h2hDifference) >= 3) modifier += Math.sign(h2hDifference);
            if (Math.abs(streak) >= 2) modifier += Math.sign(streak);

            return clamp(modifier, -2, 2);
        }

        function applyRivalryMatchModifier(stats, isPlayer) {
            const modifier = isPlayer && currentMatch ? (Number(currentMatch.rivalryModifier) || 0) : 0;
            if (!modifier) return stats;
            return {
                ...stats,
                scoring: clamp((stats.scoring || 0) + modifier, 25, 100),
                doubles: clamp((stats.doubles || 0) + modifier, 25, 100)
            };
        }

        function showRivalriesScreen() {
            updateRivalUIStrings();
            const list = document.getElementById('rival-list');
            const summary = document.getElementById('rival-summary');
            const rivals = refreshActiveRivals();
            summary.innerText = trRival('active', { count: rivals.length });
            list.innerHTML = '';

            if (rivals.length === 0) {
                list.innerHTML = `<p style="text-align:center; color:#bdc3c7; margin-top:70px; line-height:1.5;">${trRival('empty')}</p>`;
            } else {
                rivals.forEach(record => {
                    const opponent = getOpponentById(record.opponentId);
                    if (!opponent) return;
                    const status = getRivalryStatus(record);
                    const streakText = record.currentStreak > 0
                        ? trRival('streakWin', { count: record.currentStreak })
                        : record.currentStreak < 0 ? trRival('streakLoss', { count: Math.abs(record.currentStreak) }) : '';
                    const lastDate = record.lastDate ? new Date(record.lastDate).toLocaleDateString(currentLang) : '—';
                    const scoreText = record.lastScore ? ` · ${escapeHtml(record.lastScore)}` : '';

                    list.innerHTML += `<div style="background:#0f3460; border-left:4px solid ${status.color}; padding:14px; margin-bottom:12px; border-radius:6px;">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                            <strong style="font-size:16px;">${getFlagImg(opponent.country)} ${escapeHtml(opponent.name)}</strong>
                            <span style="color:${status.color}; font-weight:bold; white-space:nowrap;">${status.text}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; gap:10px; margin-top:9px; color:#bdc3c7; font-size:13px; flex-wrap:wrap;">
                            <span>${trRival('h2h')}: <strong style="color:white;">${record.wins}–${record.losses}</strong> (${record.matches} ${trRival('matches')})</span>
                            <span>${record.importantMatches} ${trRival('important')} · ${record.finals} ${trRival('finals')} · ${streakText || '—'}</span>
                        </div>
                        <div style="margin-top:8px; font-size:12px; color:#95a5a6;">${trRival('last')}: ${lastDate} · ${escapeHtml(record.lastTournament || '—')}${scoreText}</div>
                    </div>`;
                });
            }
            showScreen('screen-rivals');
        }

        function attachRankingProfileLinks(list, rankingType) {
            if (typeof openPlayerProfile !== 'function') return;
            list.querySelectorAll('[data-player-id]').forEach(row => {
                row.addEventListener('click', () => openPlayerProfile(row.dataset.playerId, rankingType));
            });
        }

        let currentPdcRankingType = 'main';

        function showPdcRankings(type = 'main') {
            currentPdcRankingType = type;
            document.getElementById('btn-rank-main').style.background = type === 'main' ? 'var(--accent-green)' : '#34495e';
            document.getElementById('btn-rank-pt').style.background = type === 'protour' ? 'var(--accent-green)' : '#34495e';
            document.getElementById('btn-rank-pc').style.background = type === 'pc' ? 'var(--accent-green)' : '#34495e';
            const btnEuropeanTour = document.getElementById('btn-rank-et');
            if (btnEuropeanTour) btnEuropeanTour.style.background = type === 'europeanTour' ? 'var(--accent-green)' : '#34495e';
            const btnChallengeTour = document.getElementById('btn-rank-challenge-tour');
            if (btnChallengeTour) {
                btnChallengeTour.style.background = type === 'challengeTour' ? 'var(--accent-green)' : '#d35400';
                if (typeof trChallengeTour === 'function') btnChallengeTour.innerText = trChallengeTour('tableName');
            }
            const btnDevelopmentTour = document.getElementById('btn-rank-development-tour');
            if (btnDevelopmentTour) {
                btnDevelopmentTour.style.background = type === 'developmentTour' ? 'var(--accent-green)' : '#2980b9';
                if (typeof trDevelopmentTour === 'function') btnDevelopmentTour.innerText = trDevelopmentTour('tableName');
            }
            const btnAverageRecords = document.getElementById('btn-rank-averages');
            if (btnAverageRecords) {
                btnAverageRecords.style.background = type === 'averages' ? 'var(--accent-green)' : '#2471a3';
            }
            
            // INTELIGENTNE WYKRYWANIE MODA (Sprawdza czy Littler jest w grze)
            let isModded = pdcPlayers.some(p => p.name === "Luke Littler");
            let leagueName = isModded ? "Premier League" : "Global Darts League";
            let leagueShort = isModded ? "PL" : "GDL";

            let btnGdl = document.getElementById('btn-rank-gdl');
            if(btnGdl) {
                btnGdl.style.background = type === 'gdl' ? 'var(--accent-green)' : '#8e44ad';
                btnGdl.innerText = t('t-gdl-btn').replace('{league}', leagueShort);
            }
            const btnWorldMasters = document.getElementById('btn-rank-world-masters');
            if (btnWorldMasters) {
                btnWorldMasters.style.background = type === 'worldMasters' ? 'var(--accent-green)' : '#8e44ad';
                if (typeof trWorldMasters === 'function') btnWorldMasters.innerText = trWorldMasters('tableName');
            }

            const list = document.getElementById('pdc-list');
            let rankingHtml = '';

            if (type === 'challengeTour') {
                if (typeof renderChallengeTourRanking === 'function') renderChallengeTourRanking(list);
                else list.innerHTML = '<div style="text-align:center; margin-top:40px; color:#bdc3c7;">Tabela Rising Stars jest niedostępna.</div>';
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }

            if (type === 'developmentTour') {
                if (typeof renderDevelopmentTourRanking === 'function') renderDevelopmentTourRanking(list);
                else list.innerHTML = '<div style="text-align:center; margin-top:40px; color:#bdc3c7;">Tabela Future Champions jest niedostępna.</div>';
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }

            if (type === 'worldMasters') {
                if (typeof renderWorldMastersRanking === 'function') renderWorldMastersRanking(list);
                else list.innerHTML = '<div style="text-align:center; margin-top:40px; color:#bdc3c7;">Tabela Global Masters jest niedostępna.</div>';
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }

            if (type === 'averages') {
                if (typeof renderAverageRecordsRanking === 'function') renderAverageRecordsRanking(list);
                else list.innerHTML = `<div style="text-align:center; margin-top:40px; color:#bdc3c7;">${escapeHtml(t('t-average-records-unavailable'))}</div>`;
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }
            
            // --- Wyświetlanie tabeli Ligi ---
            if (type === 'gdl') {
                const pointsGuide = `<div class="ranking-points-guide" role="note">ℹ️ ${escapeHtml(t('t-gdl-points-guide'))}</div>`;
                if (typeof gdlTable === 'undefined' || gdlTable.length === 0) {
                    list.innerHTML = `${pointsGuide}<div style="text-align:center; margin-top:40px; color:#bdc3c7;">Sezon ${leagueName} jeszcze się nie rozpoczął (start 1 lutego).</div>`;
                    showScreen('screen-pdc');
                    return;
                }
                
                // Sortowanie tabeli GDL: 1. Punkty, 2. Różnica legów, 3. Wygrane legi
                let sortedGDL = [...gdlTable].sort((a,b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    let diffA = a.legsWon - a.legsLost;
                    let diffB = b.legsWon - b.legsLost;
                    if (diffB !== diffA) return diffB - diffA;
                    return b.legsWon - a.legsWon;
                });
                
                rankingHtml += `${pointsGuide}<div style="border-bottom: 2px solid var(--accent-green); padding: 5px 10px; display: flex; font-size: 12px; color: #bdc3c7; font-weight: bold; background: #0f3460;">
                    <div style="flex: 3;">${t('t-gdl-player')}</div>
                    <div style="flex: 1; text-align: center;">${t('t-gdl-pts')}</div>
                    <div style="flex: 1; text-align: center;">${t('t-gdl-nights')}</div>
                    <div style="flex: 2; text-align: center;">${t('t-gdl-legs')}</div>
                </div>`;
                
                sortedGDL.forEach((row, index) => {
                    let isMe = isCurrentPlayer(row.player);
                    // Podświetlamy TOP 4 (strefa awansu do Play-offów)
                    let bgStyle = isMe ? 'background: rgba(39, 174, 96, 0.2);' : (index < 4 ? 'background: rgba(41, 128, 185, 0.1);' : '');
                    // Oddzielamy TOP 4 przerywaną linią
                    let borderStyle = index === 3 ? 'border-bottom: 2px dashed #3498db;' : 'border-bottom: 1px solid var(--border-color);';
                    
                    let legDiff = row.legsWon - row.legsLost;
                    let sign = legDiff > 0 ? '+' : '';
                    
                    rankingHtml += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(row.player.id)}" style="${borderStyle} ${bgStyle}">
                        <div style="flex: 3;">
                            <strong>${index + 1}.</strong> ${getFlagImg(row.player.country)} ${escapeHtml(row.player.name)} ${isMe ? "<b style='color:var(--accent-green)'>(TY)</b>" : ""}
                        </div>
                        <div style="flex: 1; text-align: center; color: #f1c40f; font-weight: bold; font-size: 16px;">
                            ${row.points}
                        </div>
                        <div style="flex: 1; text-align: center; color: #ecf0f1;">
                            ${row.nightsWon}
                        </div>
                        <div style="flex: 2; text-align: center; color: #bdc3c7;">
                            ${row.legsWon}-${row.legsLost} <span style="font-size: 11px; margin-left: 3px;">(${sign}${legDiff})</span>
                        </div>
                    </button>`;
                });
                list.innerHTML = rankingHtml;
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }

            // --- STANDARDOWE RANKINGI OOM / PT / PC ---
            const sortedPlayers = getCachedRankedPlayers(type);

            if (type === 'europeanTour') {
                rankingHtml = '<div style="border-bottom: 2px solid var(--accent-green); padding: 8px 10px; color: #bdc3c7; font-size: 12px; background: #0f3460;">European Tour Order of Merit · Top 32 kwalifikuje się do European Championship</div>';
            }
            
            sortedPlayers.forEach((p, index) => {
                let isMe = isCurrentPlayer(p);
                let bgStyle = isMe ? 'background: rgba(39, 174, 96, 0.2);' : '';
                
                let displayMoney = 0;
                if (type === 'protour') displayMoney = p.proTourPrizeMoney;
                else if (type === 'pc') displayMoney = p.pcPrizeMoney;
                else if (type === 'europeanTour') displayMoney = typeof getEuropeanTourPrizeMoney === 'function'
                    ? getEuropeanTourPrizeMoney(p)
                    : (p.europeanTourPrizeMoney || 0);
                else displayMoney = p.prizeMoney;

                let formattedPrize = displayMoney.toLocaleString('en-GB');
                let displayOvr = Math.round(p.ovr); 
                const tourCardBadge = p.hasTourCard === true
                    ? `<span title="${escapeHtml(typeof getPdcTourCardLabel === 'function' ? getPdcTourCardLabel(p) : 'Posiadacz karty PDC')}" style="display:inline-block; margin-left:6px; padding:2px 6px; border-radius:10px; background:#8e44ad; color:white; font-size:10px; font-weight:bold;">PDC CARD</span>`
                    : '';

                rankingHtml += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(p.id)}" style="border-bottom: 1px solid var(--border-color); ${bgStyle}">
                    <div>
                        <strong>#${index + 1}</strong> ${getFlagImg(p.country)} ${escapeHtml(p.name)}${tourCardBadge}
                        <span style="color: #bdc3c7; font-size: 13px; margin-left: 5px;">OVR: ${displayOvr}</span> ${isMe ? "<b>(TY)</b>" : ""}
                    </div>
                    <div style="color: #f1c40f; font-weight: bold;">
                        £${formattedPrize}
                    </div>
                </button>`;
            });
            list.innerHTML = rankingHtml;
            attachRankingProfileLinks(list, type);
            showScreen('screen-pdc');
        }

        // --- 6. MECHANIKA MECZU, TURNIEJÓW I CALLER ---
        
        let tournamentRound = 32; 
        let tournamentBracket = [];
        let tournamentMatchHistory = null;
        let preTournamentRanks = { main: 0, pt: 0, pc: 0, et: 0 };
        let lastTournamentResults = "";
        let currentRoundHTML = "";

        const playerRankingCache = new Map();

        function invalidatePlayerRankingCache(type = null) {
            if (type) playerRankingCache.delete(type);
            else playerRankingCache.clear();
        }

        function getPlayerRankingCacheValue(candidate, type) {
            if (type === 'protour') return Number(candidate?.proTourPrizeMoney) || 0;
            if (type === 'pc') return Number(candidate?.pcPrizeMoney) || 0;
            if (type === 'challengeTour') return [
                Number(candidate?.challengeTourPrizeMoney) || 0,
                Number(candidate?.prizeMoney) || 0,
                Number(candidate?.ovr ?? candidate?.overall) || 0,
                String(candidate?.name || '')
            ].join('|');
            if (type === 'developmentTour') return [
                Number(candidate?.developmentTourPrizeMoney) || 0,
                Number(candidate?.prizeMoney) || 0,
                Number(candidate?.ovr ?? candidate?.overall) || 0,
                String(candidate?.name || '')
            ].join('|');
            if (type === 'europeanTour') {
                return [
                    Number(candidate?.europeanTourPrizeMoney) || 0,
                    Number(candidate?.prizeMoney) || 0,
                    Number(candidate?.ovr) || 0,
                    String(candidate?.name || '')
                ].join('|');
            }
            return Number(candidate?.prizeMoney) || 0;
        }

        function getCachedRankedPlayers(type = 'main') {
            const rankingType = ['main', 'protour', 'pc', 'europeanTour', 'challengeTour', 'developmentTour'].includes(type) ? type : 'main';
            const combinedPlayers = [...pdcPlayers, player].filter(candidate => candidate && !candidate.isBye);
            if (rankingType === 'protour' && typeof refreshProTourOrderOfMerit === 'function') {
                refreshProTourOrderOfMerit(combinedPlayers, currentDate);
            }

            const cached = playerRankingCache.get(rankingType);
            const canReuse = cached
                && cached.candidates.length === combinedPlayers.length
                && combinedPlayers.every((candidate, index) =>
                    cached.candidates[index] === candidate
                    && cached.values[index] === getPlayerRankingCacheValue(candidate, rankingType));
            if (canReuse) return cached.rankedPlayers;

            const rankedPlayers = [...combinedPlayers].sort((first, second) => {
                if (rankingType === 'protour') return (second.proTourPrizeMoney || 0) - (first.proTourPrizeMoney || 0);
                if (rankingType === 'pc') return (second.pcPrizeMoney || 0) - (first.pcPrizeMoney || 0);
                if (rankingType === 'challengeTour') return typeof compareChallengeTourOrderOfMerit === 'function'
                    ? compareChallengeTourOrderOfMerit(first, second)
                    : (second.challengeTourPrizeMoney || 0) - (first.challengeTourPrizeMoney || 0);
                if (rankingType === 'developmentTour') return typeof compareDevelopmentTourOrderOfMerit === 'function'
                    ? compareDevelopmentTourOrderOfMerit(first, second)
                    : (second.developmentTourPrizeMoney || 0) - (first.developmentTourPrizeMoney || 0);
                if (rankingType === 'europeanTour') return typeof compareEuropeanTourOrderOfMerit === 'function'
                    ? compareEuropeanTourOrderOfMerit(first, second)
                    : (second.europeanTourPrizeMoney || 0) - (first.europeanTourPrizeMoney || 0);
                return (second.prizeMoney || 0) - (first.prizeMoney || 0);
            });
            playerRankingCache.set(rankingType, {
                candidates: combinedPlayers,
                values: combinedPlayers.map(candidate => getPlayerRankingCacheValue(candidate, rankingType)),
                rankedPlayers
            });
            return rankedPlayers;
        }

        function getPlayerRank(type) {
            return getCachedRankedPlayers(type).findIndex(isCurrentPlayer) + 1;
        }

        function sendTournamentSummaryEmail(tName, prize, wonTournament) {
            let postRanks = { main: getPlayerRank('main'), pt: getPlayerRank('protour'), pc: getPlayerRank('pc'), et: getPlayerRank('europeanTour') };

            let rankChanges = "";
            let diffMain = preTournamentRanks.main - postRanks.main;
            
            rankChanges += `${t('t-main-rank')} #${postRanks.main} `;
            if (diffMain > 0) rankChanges += `<span style="color:var(--accent-green)">(+${diffMain} ⬆️)</span><br>`;
            else if (diffMain < 0) rankChanges += `<span style="color:var(--accent-red)">(${Math.abs(diffMain)} ⬇️)</span><br>`;
            else rankChanges += `(-)<br>`;

            if (tName.includes("European Tour") || tName.includes("Continental Tour") || tName.includes("Players Championship") || tName.includes("Pro Players Cup") || tName.includes("UK Open") || tName.includes("World Darts Championship") || tName.includes("Global")) {
                let diffPt = preTournamentRanks.pt - postRanks.pt;
                rankChanges += `${t('t-pro-rank')} #${postRanks.pt} `;
                if (diffPt > 0) rankChanges += `<span style="color:var(--accent-green)">(+${diffPt} ⬆️)</span><br>`;
                else if (diffPt < 0) rankChanges += `<span style="color:var(--accent-red)">(${Math.abs(diffPt)} ⬇️)</span><br>`;
                else rankChanges += `(-)<br>`;
            }

            if (typeof isEuropeanTourTournament === 'function' && isEuropeanTourTournament(tName)) {
                const diffEt = preTournamentRanks.et - postRanks.et;
                rankChanges += `European Tour OOM: #${postRanks.et} `;
                if (diffEt > 0) rankChanges += `<span style="color:var(--accent-green)">(+${diffEt} ⬆️)</span><br>`;
                else if (diffEt < 0) rankChanges += `<span style="color:var(--accent-red)">(${Math.abs(diffEt)} ⬇️)</span><br>`;
                else rankChanges += `(-)<br>`;
            }

            let body1 = t('t-email-tour-sum-body1').replace('{tour}', tName).replace('{prize}', prize.toLocaleString('en-GB'));
            let body = `${body1}${rankChanges}`;

            addEmail(t('t-sender-league'), t('t-email-tour-sum-sub').replace('{tour}', tName), body);
        }


        
