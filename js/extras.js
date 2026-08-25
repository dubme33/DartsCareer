const ACHIEVEMENT_UI_TRANSLATIONS = {
    pl: { reward: 'Nagroda: £{amount}', unlocked: '★ ODBLOKOWANE', unlockedAlert: '🏆 ODBLOKOWANO OSIĄGNIĘCIE!\n\n{title}\nOtrzymujesz bonus: £{amount}' },
    en: { reward: 'Reward: £{amount}', unlocked: '★ UNLOCKED', unlockedAlert: '🏆 ACHIEVEMENT UNLOCKED!\n\n{title}\nYou receive a bonus: £{amount}' },
    de: { reward: 'Belohnung: £{amount}', unlocked: '★ FREIGESCHALTET', unlockedAlert: '🏆 ERFOLG FREIGESCHALTET!\n\n{title}\nDu erhältst einen Bonus: £{amount}' },
    nl: { reward: 'Beloning: £{amount}', unlocked: '★ ONTGRENDELD', unlockedAlert: '🏆 PRESTATIE ONTGRENDELD!\n\n{title}\nJe ontvangt een bonus: £{amount}' }
};

function trAchievementUi(key, values = {}) {
    const language = typeof currentLang === 'string' && ACHIEVEMENT_UI_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = ACHIEVEMENT_UI_TRANSLATIONS[language][key] || ACHIEVEMENT_UI_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function initCareerChronicle() {
            if (!Array.isArray(player.careerChronicle)) player.careerChronicle = [];
        }

        function addCareerChronicleEvent(type, data = {}) {
            if (!player) return;
            initCareerChronicle();
            const timestamp = currentDate instanceof Date && Number.isFinite(currentDate.getTime()) ? currentDate.getTime() : Date.now();
            player.careerChronicle.push({
                id: createEntityId('chronicle'),
                type,
                timestamp,
                ...data
            });

            // Historia pozostaje lekka nawet przy bardzo długiej karierze.
            if (player.careerChronicle.length > 160) player.careerChronicle.splice(0, player.careerChronicle.length - 160);
        }

        // Najwyższa średnia jest jednym aktualnym rekordem, a nie historią dawnych rekordów.
        function getCurrentCareerBestAverage() {
            initCareerStats();
            initCareerChronicle();

            const storedAverage = Number(player.careerStats.highestAvg);
            const chronicleAverage = player.careerChronicle
                .filter(event => event.type === 'average')
                .reduce((best, event) => Math.max(best, Number(event.value) || 0), 0);
            const bestAverage = Math.max(Number.isFinite(storedAverage) ? storedAverage : 0, chronicleAverage);
            const roundedAverage = Number(bestAverage.toFixed(2));

            player.careerStats.highestAvg = roundedAverage;
            return roundedAverage;
        }

        function recordCareerBestAverage(average) {
            const roundedAverage = Number(Number(average).toFixed(2));
            if (!Number.isFinite(roundedAverage) || roundedAverage <= getCurrentCareerBestAverage()) return false;

            player.careerStats.highestAvg = roundedAverage;
            // Usuwamy poprzednie rekordy średniej: w kronice ma być widoczny tylko aktualny rekord kariery.
            player.careerChronicle = player.careerChronicle.filter(event => event.type !== 'average');
            addCareerChronicleEvent('average', { value: roundedAverage });
            return true;
        }

        // Najwyższy checkout, podobnie jak średnia, jest jednym aktualnym rekordem kariery.
        function getCurrentCareerBestCheckout() {
            initCareerStats();
            initCareerChronicle();

            const storedCheckout = Number(player.careerStats.highestCheckout);
            const chronicleCheckout = player.careerChronicle
                .filter(event => event.type === 'checkout')
                .reduce((best, event) => Math.max(best, Number(event.value) || 0), 0);
            const bestCheckout = Math.max(Number.isFinite(storedCheckout) ? storedCheckout : 0, chronicleCheckout);
            const roundedCheckout = Math.round(bestCheckout);

            player.careerStats.highestCheckout = roundedCheckout;
            return roundedCheckout;
        }

        function getChronicleDate(timestamp) {
            const date = new Date(timestamp);
            if (!Number.isFinite(date.getTime())) return '';
            const locales = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' };
            return date.toLocaleDateString(locales[currentLang] || locales.en, { day: '2-digit', month: 'short', year: 'numeric' });
        }

        function getChronicleEventPresentation(event) {
            const money = Number(event.prize || 0).toLocaleString('en-GB');
            const value = Number(event.value || 0);
            const styles = {
                trophy: { icon: '🏆', color: '#f1c40f' },
                average: { icon: '📈', color: '#3498db' },
                checkout: { icon: '🎯', color: '#e67e22' },
                rival: { icon: '🔥', color: '#e74c3c' },
                season: { icon: '🗓️', color: '#9b59b6' }
            };
            const style = styles[event.type] || { icon: '📖', color: '#bdc3c7' };

            if (event.type === 'trophy') {
                const tournament = typeof getTournamentDisplayName === 'function'
                    ? getTournamentDisplayName(event.tournament)
                    : (event.tournament || '');
                return { ...style, title: trChronicle('trophyTitle'), detail: trChronicle('trophyDetail', { tournament, prize: money }) };
            }
            if (event.type === 'average') return { ...style, title: trChronicle('averageTitle'), detail: trChronicle('averageDetail', { value: value.toFixed(2) }) };
            if (event.type === 'checkout') return { ...style, title: trChronicle('checkoutTitle'), detail: trChronicle('checkoutDetail', { value: Math.round(value) }) };
            if (event.type === 'rival') return { ...style, title: trChronicle('rivalTitle'), detail: trChronicle('rivalDetail', { name: event.opponentName || '' }) };
            if (event.type === 'season') return { ...style, title: trChronicle('seasonTitle', { year: event.year || '' }), detail: trChronicle('seasonDetail', { rank: event.rank || '—', prize: money }) };
            return { ...style, title: '', detail: '' };
        }

        function showCareerChronicle() {
            initCareerChronicle();
            initCareerStats();
            initRivalries();
            updateChronicleUIStrings();

            const currentRank = getPlayerRank('main');
            const summaryItems = [
                { label: trChronicle('entries'), value: player.careerChronicle.length, color: '#3498db' },
                { label: trChronicle('trophies'), value: player.careerStats.trophies.length, color: '#f1c40f' },
                { label: trChronicle('rank'), value: currentRank ? `#${currentRank}` : '—', color: 'var(--accent-green)' },
                { label: trChronicle('rivals'), value: player.activeRivalIds.length, color: '#e74c3c' }
            ];
            document.getElementById('chronicle-summary').innerHTML = summaryItems.map(item => `
                <div style="background:#0f3460; border:1px solid #34495e; border-radius:8px; padding:10px 16px; min-width:125px; text-align:center;">
                    <div style="font-size:12px; color:#bdc3c7;">${escapeHtml(item.label)}</div>
                    <div style="font-weight:bold; color:${item.color}; margin-top:3px;">${escapeHtml(item.value)}</div>
                </div>`).join('');

            const list = document.getElementById('chronicle-list');
            const bestAverage = getCurrentCareerBestAverage();
            const bestCheckout = getCurrentCareerBestCheckout();
            let averageRecordShown = false;
            let checkoutRecordShown = false;
            const events = [...player.careerChronicle]
                .sort((first, second) => (second.timestamp || 0) - (first.timestamp || 0))
                .filter(event => {
                    if (event.type === 'average') {
                        if (Number(event.value).toFixed(2) !== bestAverage.toFixed(2) || averageRecordShown) return false;
                        averageRecordShown = true;
                        return true;
                    }
                    if (event.type === 'checkout') {
                        if (Math.round(Number(event.value) || 0) !== bestCheckout || checkoutRecordShown) return false;
                        checkoutRecordShown = true;
                        return true;
                    }
                    return true;
                });
            if (events.length === 0) {
                list.innerHTML = `<div style="text-align:center; color:#95a5a6; padding:35px 15px; background:#0f3460; border-radius:8px;">${escapeHtml(trChronicle('empty'))}</div>`;
            } else {
                list.innerHTML = events.map(event => {
                    const presentation = getChronicleEventPresentation(event);
                    return `<div class="career-entry">
                        <div class="career-dot" style="border-color:${presentation.color};">${presentation.icon}</div>
                        <div class="career-card">
                            <span class="career-date">${escapeHtml(getChronicleDate(event.timestamp))}</span>
                            <div class="career-title">${escapeHtml(presentation.title)}</div>
                            <div class="career-detail">${escapeHtml(presentation.detail)}</div>
                        </div>
                    </div>`;
                }).join('');
            }

            showScreen('screen-chronicle');
        }

        // Inicjalizacja dla starych zapisów
        function initCareerStats() {
            if (!player.careerStats) {
                player.careerStats = {
                    highestAvg: 0,
                    highestCheckout: 0,
                    total180s: 0,
                    nineDarters: 0,
                    trophies: []
                };
            }
        }

        function showTrophyRoom() {
            if (typeof initCareerStats === 'function') initCareerStats();

            document.getElementById('trophy-avg').innerText = getCurrentCareerBestAverage().toFixed(2);
            document.getElementById('trophy-checkout').innerText = getCurrentCareerBestCheckout();
            document.getElementById('trophy-180s').innerText = player.careerStats.total180s;
            document.getElementById('trophy-9darters').innerText = player.careerStats.nineDarters || 0;

            const list = document.getElementById('trophy-list');
            list.innerHTML = "";
            if (player.careerStats.trophies.length === 0) {
                list.innerHTML = `<p style="color: gray; text-align: center;">${t('t-no-trophy')}</p>`;
            } else {
                player.careerStats.trophies.forEach(tr => {
                    const tournament = typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tr) : tr;
                    list.innerHTML += `<div style="padding: 5px; border-bottom: 1px solid #34495e;">🏆 ${escapeHtml(tournament)}</div>`;
                });
            }

            // --- NOWOŚĆ: RENDEROWANIE OSIĄGNIĘĆ ---
            const achievList = document.getElementById('achievements-list');
            if (achievList) {
                achievList.innerHTML = "";
                if (!player.achievements) player.achievements = []; // Zabezpieczenie
                
                const langSuffix = `_${currentLang}`;
                
                achievementsDB.forEach(ach => {
                    let isUnlocked = player.achievements.includes(ach.id);
                    let title = ach[`title${langSuffix}`] || ach.title_pl;
                    let desc = ach[`desc${langSuffix}`] || ach.desc_pl;
                    let rewardText = trAchievementUi('reward', { amount: ach.rewardMoney.toLocaleString('en-GB') });
                    
                    let progress = 0;
                    if (ach.type === '180s') progress = player.careerStats.total180s;
                    if (ach.type === '100plus_checkouts') progress = player.careerStats.tonPlusCheckouts || 0; // NOWOŚĆ
                    let progressPercent = Math.min(100, (progress / ach.target) * 100);

                    let html = `
                    <div class="achiev-card ${isUnlocked ? 'unlocked' : 'locked'}">
                        <div class="achiev-icon">${ach.icon}</div>
                        <div class="achiev-info">
                            <p class="achiev-title">${title}</p>
                            <p class="achiev-desc">${desc}</p>
                            <span class="achiev-reward">${isUnlocked ? trAchievementUi('unlocked') : rewardText}</span>
                            ${!isUnlocked && ach.target > 1 ? `
                            <div class="achiev-progress-bg">
                                <div class="achiev-progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>` : ''}
                        </div>
                    </div>`;
                    achievList.innerHTML += html;
                });
            }
            // -------------------------------------

            showScreen('screen-trophy');
        }

        function triggerNineDarterAlert() {
            let overlay = document.getElementById('nine-darter-overlay');
            if(overlay) overlay.style.display = 'flex';
            
            player.budget += 50000;
            initCareerStats();
            player.careerStats.nineDarters++;
            
            if(window.speechSynthesis) {
                let u = new SpeechSynthesisUtterance("Nine Darter! Absolutely brilliant!");
                u.lang = 'en-GB'; u.pitch = 1.3; u.rate = 1.1; u.volume = globalVolume;
                window.speechSynthesis.speak(u);
            }
        }

        // Pamięć wirtualna na wgrane z ZIPa zdjęcia, muzykę i loga
        let moddedAssets = { photos: {}, music: {}, sounds: {}, sponsors: {} };

        // --- SYSTEM MODÓW (IMPORT PACZEK .ZIP) ---
        function validateModData(modData) {
            if (!isPlainObject(modData)) throw new Error('mod.json musi zawierać obiekt JSON.');

            const arrayFields = ['pdcPlayers', 'tournamentDatabase', 'randomEventsDatabase', 'techSponsorsDB'];
            arrayFields.forEach(field => {
                if (modData[field] !== undefined && !Array.isArray(modData[field])) {
                    throw new Error(`Pole ${field} musi być tablicą.`);
                }
            });
            if (modData.pdcPlayers && !modData.pdcPlayers.every(isPlainObject)) throw new Error('Niepoprawna lista zawodników w modzie.');
            if (modData.tournamentDatabase && !modData.tournamentDatabase.every(isPlainObject)) throw new Error('Niepoprawna lista turniejów w modzie.');
            if (modData.sponsorTiers !== undefined && !isPlainObject(modData.sponsorTiers)) throw new Error('Niepoprawne poziomy sponsorów.');
            if (modData.shopDatabase !== undefined && !isPlainObject(modData.shopDatabase)) throw new Error('Niepoprawna baza sklepu.');
        }

        function getAssetInfo(relativePath) {
            const filename = relativePath.split('/').pop();
            const dotIndex = filename.lastIndexOf('.');
            if (dotIndex <= 0) return null;
            return { name: filename.slice(0, dotIndex), extension: filename.slice(dotIndex + 1).toLowerCase() };
        }

        async function readModAssets(zipContent) {
            const assets = { photos: {}, music: {}, sounds: {}, sponsors: {} };
            const imageTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
            const audioTypes = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg' };
            const tasks = [];

            zipContent.forEach((relativePath, zipEntry) => {
                if (zipEntry.dir) return;
                const [folder] = relativePath.split('/');
                const info = getAssetInfo(relativePath);
                if (!info) return;

                if ((folder === 'zdjecia' || folder === 'sponsors') && imageTypes[info.extension]) {
                    tasks.push(zipEntry.async('base64').then(content => {
                        const destination = folder === 'zdjecia' ? assets.photos : assets.sponsors;
                        destination[info.name] = `data:${imageTypes[info.extension]};base64,${content}`;
                    }));
                } else if ((folder === 'music' || folder === 'sounds') && audioTypes[info.extension]) {
                    tasks.push(zipEntry.async('base64').then(content => {
                        const destination = folder === 'music' ? assets.music : assets.sounds;
                        const key = folder === 'sounds' ? info.name.toLowerCase() : info.name;
                        destination[key] = `data:${audioTypes[info.extension]};base64,${content}`;
                    }));
                }
            });

            await Promise.all(tasks);
            return assets;
        }

        function copyModObjectValues(target, source) {
            Object.entries(source).forEach(([key, value]) => {
                if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') target[key] = value;
            });
        }

        function applyModData(modData, isCareerActive) {
            if (!isCareerActive) {
                if (modData.pdcPlayers) {
                    pdcPlayers.length = 0;
                    modData.pdcPlayers.forEach((candidate, index) => pdcPlayers.push({
                        ...candidate,
                        // Łączy zawodnika moda z odpowiadającym mu wpisem bazowym,
                        // aby przy kolejnym wczytaniu nie powstała druga kopia.
                        defaultTemplateIndex: Number.isInteger(candidate.defaultTemplateIndex)
                            ? candidate.defaultTemplateIndex
                            : index
                    }));
                    if (typeof removeRetiredPlayersFromPool === 'function') removeRetiredPlayersFromPool(pdcPlayers);
                    if (typeof applyKnownPlayerCorrections === 'function') applyKnownPlayerCorrections(pdcPlayers);
                    if (typeof deduplicatePdcPlayers === 'function') deduplicatePdcPlayers();
                    normalizePlayerIds(pdcPlayers, player);
                    initPlayersForm();
                }
                if (modData.tournamentDatabase) {
                    tournamentDatabase.length = 0;
                    modData.tournamentDatabase.forEach(tournament => tournamentDatabase.push({ ...tournament }));
                }
            } else {
                // Podczas trwającej kariery pozostawiamy wyniki, OVR i identyfikatory zawodników.
                if (modData.pdcPlayers) {
                    const playersBySourceName = new Map(pdcPlayers.map(candidate => [candidate.sourceName || candidate.name, candidate]));
                    const normalizeSourceName = value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
                    const careerSourceName = normalizeSourceName(player.sourceName || player.name);
                    if (!Number.isInteger(player.defaultTemplateIndex) && Array.isArray(defaultPdcPlayerTemplates)) {
                        const inferredTemplateIndex = defaultPdcPlayerTemplates.findIndex(template => (
                            normalizeSourceName(template?.name) === careerSourceName &&
                            normalizeSourceName(template?.country) === normalizeSourceName(player.country)
                        ));
                        if (inferredTemplateIndex >= 0) player.defaultTemplateIndex = inferredTemplateIndex;
                    }
                    const careerTemplateIndex = Number.isInteger(player.defaultTemplateIndex)
                        ? player.defaultTemplateIndex
                        : null;
                    modData.pdcPlayers.forEach((modPlayer, index) => {
                        const sourceName = modPlayer.sourceName || modPlayer.name;
                        const templateIndex = Number.isInteger(modPlayer.defaultTemplateIndex)
                            ? modPlayer.defaultTemplateIndex
                            : index;
                        const isCareerPlayerEntry = templateIndex === careerTemplateIndex || (
                            Boolean(careerSourceName) && normalizeSourceName(sourceName) === careerSourceName
                        );
                        if (isCareerPlayerEntry) {
                            ['name', 'sourceName', 'birthYear', 'country', 'hasTourCard', 'favoriteDouble'].forEach(field => {
                                if (modPlayer[field] !== undefined) player[field] = modPlayer[field];
                            });
                            player.defaultTemplateIndex = templateIndex;
                            return;
                        }
                        const indexedCandidate = pdcPlayers[index];
                        const candidate = playersBySourceName.get(sourceName) || (
                            indexedCandidate &&
                            indexedCandidate.country === modPlayer.country &&
                            Number(indexedCandidate.ovr) === Number(modPlayer.ovr)
                                ? indexedCandidate
                                : null
                        );
                        if (candidate) {
                            ['name', 'sourceName', 'birthYear', 'country', 'hasTourCard', 'favoriteDouble'].forEach(field => {
                                if (modPlayer[field] !== undefined) candidate[field] = modPlayer[field];
                            });
                            if (!Number.isInteger(candidate.defaultTemplateIndex) && candidate === indexedCandidate) {
                                candidate.defaultTemplateIndex = index;
                            }
                        } else {
                            pdcPlayers.push({
                                ...modPlayer,
                                defaultTemplateIndex: Number.isInteger(modPlayer.defaultTemplateIndex)
                                    ? modPlayer.defaultTemplateIndex
                                    : index
                            });
                        }
                    });
                    // Mod nie może wskrzesić zawodnika usuniętego przez system
                    // emerytur — nawet gdy jego prawdziwe nazwisko różni się od
                    // bazowego pseudonimu.
                    if (typeof removeRetiredPlayersFromPool === 'function') removeRetiredPlayersFromPool(pdcPlayers);
                    if (typeof applyKnownPlayerCorrections === 'function') applyKnownPlayerCorrections(pdcPlayers);
                    if (typeof deduplicatePdcPlayers === 'function') deduplicatePdcPlayers();
                    if (typeof removeCareerPlayerFromAiPool === 'function') removeCareerPlayerFromAiPool();
                    normalizePlayerIds(pdcPlayers, player);
                    if (typeof repairRetiredTournamentBracket === 'function' && Array.isArray(tournamentBracket)) {
                        tournamentBracket = repairRetiredTournamentBracket(tournamentBracket);
                    }
                }
                if (modData.tournamentDatabase) {
                    const tournamentsBySourceName = new Map(tournamentDatabase.map(tournament => [tournament.sourceName || tournament.name, tournament]));
                    const tournamentSignature = tournament => [tournament.month, tournament.day, tournament.country, tournament.city, tournament.format].join('|');
                    const tournamentsBySignature = new Map(tournamentDatabase.map(tournament => [tournamentSignature(tournament), tournament]));
                    modData.tournamentDatabase.forEach(modTournament => {
                        const sourceName = modTournament.sourceName || modTournament.name;
                        const tournament = tournamentsBySourceName.get(sourceName) || tournamentsBySignature.get(tournamentSignature(modTournament));
                        if (tournament) {
                            ['name', 'sourceName', 'specialType', 'qualifierFor', 'worldMastersEvent'].forEach(field => {
                                if (modTournament[field] !== undefined) tournament[field] = modTournament[field];
                            });
                        } else {
                            tournamentDatabase.push({ ...modTournament });
                        }
                    });
                }
            }

            if (modData.randomEventsDatabase && typeof randomEventsDatabase !== 'undefined') {
                randomEventsDatabase.length = 0;
                modData.randomEventsDatabase.forEach(randomEvent => randomEventsDatabase.push(randomEvent));
            }
            if (modData.techSponsorsDB) {
                techSponsorsDB.length = 0;
                modData.techSponsorsDB.forEach(sponsor => techSponsorsDB.push(sponsor));
            }
            if (modData.sponsorTiers) copyModObjectValues(sponsorTiers, modData.sponsorTiers);
            if (modData.shopDatabase) {
                ['board', 'surround', 'light'].forEach(category => {
                    if (Array.isArray(modData.shopDatabase[category])) shopDatabase[category] = modData.shopDatabase[category];
                });
            }

            const techNameMap = {
                'AimX': 'Target', 'BladeDart': 'Winmau', 'Crimson Drake': 'Red Dragon',
                'Quest Darts': 'Mission', 'ArrowsTech': 'Harrows', 'Strike': 'Shot',
                'Taurus': "Bull's", 'Pegasus': 'Unicorn', 'Locks': 'Loxley',
                'ELITE': 'GOAT', 'CueSpirit': 'Cuesoul', 'Galaxy Darts': 'Cosmo'
            };
            if (player.technicalPartner && techNameMap[player.technicalPartner.name]) {
                player.technicalPartner.name = techNameMap[player.technicalPartner.name];
            }

            if (typeof migrateMainOrderOfMeritFromHistory === 'function') {
                migrateMainOrderOfMeritFromHistory(
                    isCareerActive ? [player, ...pdcPlayers] : pdcPlayers,
                    tournamentDatabase,
                    currentDate
                );
            }
            if (typeof migratePdcTourCardSystem === 'function') {
                migratePdcTourCardSystem(isCareerActive ? [player, ...pdcPlayers] : pdcPlayers, currentDate);
            }

            renderOpponentOptions();
            const tDescPlay = document.getElementById('t-desc-play'); if (tDescPlay) tDescPlay.innerText = 'Zmierz się z AI z PDC.';
            const tTilePdc = document.getElementById('t-tile-pdc'); if (tTilePdc) tTilePdc.innerText = '🏆 Baza PDC';
            const screenPdcH2 = document.querySelector('#screen-pdc h2'); if (screenPdcH2) screenPdcH2.innerText = 'Rankingi PDC';
            const btnRankMain = document.getElementById('btn-rank-main'); if (btnRankMain) btnRankMain.innerText = 'PDC Order of Merit';
            const btnRankPt = document.getElementById('btn-rank-pt'); if (btnRankPt) btnRankPt.innerText = 'ProTour OOM';
            const btnRankPc = document.getElementById('btn-rank-pc'); if (btnRankPc) btnRankPc.innerText = 'Players Champ OOM';
            const btnRankEt = document.getElementById('btn-rank-et'); if (btnRankEt) btnRankEt.innerText = 'European Tour OOM';
            const screenCalH2 = document.querySelector('#screen-calendar h2'); if (screenCalH2) screenCalH2.innerText = 'Kalendarz Sezonu PDC';
            if (isCareerActive) updateHub();
        }

        async function loadMod(event) {
            const input = event.target;
            const file = input.files[0];
            if (!file) return;

            try {
                const zipContent = await JSZip.loadAsync(file);
                const configEntry = zipContent.file('mod.json');
                const modData = configEntry ? JSON.parse(await configEntry.async('string')) : {};
                validateModData(modData);

                // Stan gry zostaje zmieniony dopiero, gdy wszystkie pliki ZIP zostały poprawnie odczytane.
                const loadedAssets = await readModAssets(zipContent);
                const isCareerActive = Boolean(player && player.name);
                applyModData(modData, isCareerActive);
                moddedAssets = loadedAssets;

                alert(isCareerActive ? t('t-alert-mod-career') : t('t-alert-mod-new'));
            } catch (error) {
                console.error('Nie udało się wczytać moda.', error);
                alert(t('t-alert-mod-err'));
            } finally {
                input.value = '';
            }
        }

    
