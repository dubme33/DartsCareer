// Career preferences use original tournament names so mod labels and season
// date changes do not reset a player's selection.
const TOURNAMENT_WATCH_TEXT = {
    pl: { title: '👀 Obserwowane turnieje', intro: 'Wybierz turnieje, które chcesz oglądać runda po rundzie, gdy nie bierzesz w nich udziału. Pozostałe symulują się automatycznie w dniu rozpoczęcia.', hint: 'Twoje własne turnieje zawsze wymagają rozegrania lub wybrania „Odpuść”. Ustawienia zapisują się z karierą i obowiązują w kolejnych sezonach.', all: 'Obserwuj wszystkie', none: 'Wszystkie w tle', select: 'Zaznacz cykl', clear: 'Odznacz cykl', count: 'Wybrane: {selected} / {total}', empty: 'Brak turniejów w kalendarzu.', groups: ['Główne turnieje', 'Players Championship', 'European Tour', 'Challenge Tour', 'Development Tour', 'Liga', 'World Series', 'Kwalifikacje'], watchTitle: 'Obserwuj dzisiejszy turniej', watchDesc: 'Ten turniej jest wybrany do obserwacji. Symuluj kolejne rundy lub pomiń całe wydarzenie.', groupRound: 'Symuluj kolejną rundę grupową' },
    en: { title: '👀 Watched tournaments', intro: 'Choose tournaments to follow round by round when you are not participating. Other events are simulated automatically on their start date.', hint: 'Your own tournaments always require playing or choosing “Skip”. Preferences are saved with your career and apply in future seasons.', all: 'Watch all', none: 'All in background', select: 'Select series', clear: 'Deselect series', count: 'Selected: {selected} / {total}', empty: 'No tournaments in the calendar.', groups: ['Major tournaments', 'Players Championship', 'European Tour', 'Challenge Tour', 'Development Tour', 'League', 'World Series', 'Qualifiers'], watchTitle: "Watch today's tournament", watchDesc: 'This event is selected for watching. Simulate successive rounds or skip the whole event.', groupRound: 'Simulate next group round' },
    de: { title: '👀 Beobachtete Turniere', intro: 'Wähle Turniere, die du ohne eigene Teilnahme Runde für Runde verfolgen möchtest. Andere Events werden am Starttag automatisch simuliert.', hint: 'Eigene Turniere erfordern immer Spielen oder „Überspringen“. Die Auswahl wird mit der Karriere gespeichert und gilt auch in kommenden Saisons.', all: 'Alle beobachten', none: 'Alle im Hintergrund', select: 'Serie auswählen', clear: 'Serie abwählen', count: 'Ausgewählt: {selected} / {total}', empty: 'Keine Turniere im Kalender.', groups: ['Hauptturniere', 'Players Championship', 'European Tour', 'Challenge Tour', 'Development Tour', 'Liga', 'World Series', 'Qualifikationen'], watchTitle: 'Heutiges Turnier beobachten', watchDesc: 'Dieses Event ist zum Beobachten ausgewählt. Simuliere einzelne Runden oder überspringe das gesamte Event.', groupRound: 'Nächste Gruppenrunde simulieren' },
    nl: { title: '👀 Gevolgde toernooien', intro: 'Kies toernooien die je zonder eigen deelname ronde voor ronde wilt volgen. Andere evenementen worden automatisch op hun startdatum gesimuleerd.', hint: 'Je eigen toernooien vereisen altijd spelen of “Overslaan”. De keuze wordt met je carrière opgeslagen en geldt ook in volgende seizoenen.', all: 'Alles volgen', none: 'Alles op achtergrond', select: 'Serie selecteren', clear: 'Serie deselecteren', count: 'Geselecteerd: {selected} / {total}', empty: 'Geen toernooien in de kalender.', groups: ['Hoofdtoernooien', 'Players Championship', 'European Tour', 'Challenge Tour', 'Development Tour', 'Competitie', 'World Series', 'Kwalificaties'], watchTitle: 'Volg het toernooi van vandaag', watchDesc: 'Dit evenement is geselecteerd om te volgen. Simuleer opeenvolgende rondes of sla het hele evenement over.', groupRound: 'Volgende groepsronde simuleren' }
};

function getTournamentWatchText() {
    return TOURNAMENT_WATCH_TEXT[typeof currentLang === 'string' ? currentLang : 'en'] || TOURNAMENT_WATCH_TEXT.en;
}

function getTournamentWatchKey(tournament) {
    return JSON.stringify([String(tournament?.sourceName || tournament?.name || '').trim(), String(tournament?.specialType || '')]);
}

function normalizeTournamentWatchSettings(value) {
    const settings = { version: 1, defaultWatch: value?.defaultWatch === true, overrides: {} };
    if (value?.overrides && typeof value.overrides === 'object' && !Array.isArray(value.overrides)) {
        Object.entries(value.overrides).slice(0, 3000).forEach(([key, watched]) => {
            if (key.length <= 500 && typeof watched === 'boolean' && watched !== settings.defaultWatch) {
                try {
                    const parts = JSON.parse(key);
                    if (Array.isArray(parts) && parts.length === 2 && parts.every(part => typeof part === 'string')) settings.overrides[key] = watched;
                } catch (_error) { /* Ignore malformed save entries. */ }
            }
        });
    }
    return settings;
}

function initializeTournamentWatchSettings(candidate = player, reset = false) {
    if (!candidate) return null;
    candidate.tournamentWatchSettings = normalizeTournamentWatchSettings(reset ? null : candidate.tournamentWatchSettings);
    return candidate.tournamentWatchSettings;
}

function isTournamentSelectedForWatching(tournament, candidate = player) {
    if (!tournament || !candidate) return false;
    const settings = candidate.tournamentWatchSettings;
    const watched = settings?.overrides?.[getTournamentWatchKey(tournament)];
    return typeof watched === 'boolean' ? watched : settings?.defaultWatch === true;
}

function shouldAutoSimulateUnwatchedTournament(tournament, participating) {
    if (!tournament || isTournamentSelectedForWatching(tournament)) return false;
    // Elimination from a tournament the player entered keeps the usual manual
    // continuation. A viewing preference never withdraws a qualified player.
    if (typeof currentDate !== 'undefined' && Number(tournament.staminaChargedYear) === currentDate.getFullYear()) return false;
    if (typeof participating !== 'boolean') {
        if (typeof isCareerPlayerParticipatingInTournament !== 'function') return false;
        participating = isCareerPlayerParticipatingInTournament(tournament);
    }
    return participating === false;
}

function getTournamentWatchEntries() {
    return typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.filter(tournament => tournament && tournament.name).map(tournament => tournament) : [];
}

function getTournamentWatchGroup(tournament) {
    const names = `${tournament.name || ''} ${tournament.sourceName || ''} ${tournament.specialType || ''}`;
    if (/qualifier|kwalifikac|qschool|q-school|card trials/i.test(names)) return 7;
    if (typeof isChallengeTourTournament === 'function' && isChallengeTourTournament(tournament)) return 3;
    if (typeof isDevelopmentTourTournament === 'function' && isDevelopmentTourTournament(tournament)) return 4;
    if (typeof isPlayersChampionshipTournament === 'function' && isPlayersChampionshipTournament(tournament)) return 1;
    if (typeof isEuropeanTourTournament === 'function' && isEuropeanTourTournament(tournament)) return 2;
    if (/premier|global darts league/i.test(names)) return 5;
    if (tournament.specialType === 'worldMasters') return 6;
    return 0;
}

function canChangeTournamentWatchSettings() {
    return typeof player === 'object' && Boolean(player?.name)
        && !(typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy());
}

function saveTournamentWatchSettings() {
    refreshTournamentWatchSettingsUI();
    if (typeof updateHubOverview === 'function') updateHubOverview();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function changeTournamentWatching(index, watched) {
    if (!canChangeTournamentWatchSettings()) return false;
    const tournament = getTournamentWatchEntries()[index];
    if (!tournament || typeof watched !== 'boolean') return false;
    const settings = initializeTournamentWatchSettings();
    const key = getTournamentWatchKey(tournament);
    if (watched === settings.defaultWatch) delete settings.overrides[key];
    else settings.overrides[key] = watched;
    return saveTournamentWatchSettings();
}

function changeTournamentWatchGroup(group, watched) {
    if (!canChangeTournamentWatchSettings() || typeof watched !== 'boolean' || !Number.isInteger(group) || group < 0 || group > 7) return false;
    const settings = initializeTournamentWatchSettings();
    getTournamentWatchEntries().filter(tournament => getTournamentWatchGroup(tournament) === group).forEach(tournament => {
        const key = getTournamentWatchKey(tournament);
        if (watched === settings.defaultWatch) delete settings.overrides[key];
        else settings.overrides[key] = watched;
    });
    return saveTournamentWatchSettings();
}

function changeAllTournamentWatching(watched) {
    if (!canChangeTournamentWatchSettings() || typeof watched !== 'boolean') return false;
    player.tournamentWatchSettings = { version: 1, defaultWatch: watched, overrides: {} };
    return saveTournamentWatchSettings();
}

function refreshTournamentWatchSettingsUI() {
    if (typeof document === 'undefined') return;
    const text = getTournamentWatchText();
    ['title', 'intro', 'hint', 'all', 'none'].forEach(key => {
        const element = document.getElementById(`tournament-watch-${key}`);
        if (element) element.textContent = text[key];
    });
    const list = document.getElementById('tournament-watch-list');
    if (!list) return;
    const previousGroups = Array.from(list.querySelectorAll?.('details') || []);
    const openGroups = new Set(previousGroups.filter(element => element.open).map(element => element.dataset.watchGroup));
    const scrollPositions = new Map(previousGroups.map(element => [element.dataset.watchGroup, element.querySelector('.tournament-watch-events')?.scrollTop || 0]));
    const focusedIndex = document.activeElement?.dataset?.watchIndex;
    const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    const entries = getTournamentWatchEntries();
    const count = (selected, total) => text.count.replace('{selected}', selected).replace('{total}', total);
    const summary = document.getElementById('tournament-watch-count');
    if (summary) summary.textContent = count(entries.filter(tournament => isTournamentSelectedForWatching(tournament)).length, entries.length);
    list.innerHTML = entries.length ? text.groups.map((label, group) => {
        const members = entries.map((tournament, index) => ({ tournament, index })).filter(entry => getTournamentWatchGroup(entry.tournament) === group);
        if (!members.length) return '';
        const selected = members.filter(entry => isTournamentSelectedForWatching(entry.tournament)).length;
        return `<details data-watch-group="${group}"${openGroups.has(String(group)) ? ' open' : ''}><summary><strong>${escape(label)}</strong><span>${selected} / ${members.length}</span></summary><div class="tournament-watch-group-actions"><button type="button" onclick="changeTournamentWatchGroup(${group}, true)">${escape(text.select)}</button><button type="button" onclick="changeTournamentWatchGroup(${group}, false)">${escape(text.clear)}</button></div><div class="tournament-watch-events">${members.map(({ tournament, index }) => {
            const name = typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : tournament.name;
            return `<label><input type="checkbox" data-watch-index="${index}" onchange="changeTournamentWatching(${index}, this.checked)"${isTournamentSelectedForWatching(tournament) ? ' checked' : ''}><span>${escape(name)}</span><small>${String(tournament.day).padStart(2, '0')}.${String(Number(tournament.month) + 1).padStart(2, '0')}</small></label>`;
        }).join('')}</div></details>`;
    }).join('') : `<p>${escape(text.empty)}</p>`;
    Array.from(list.querySelectorAll?.('details') || []).forEach(element => {
        const events = element.querySelector('.tournament-watch-events');
        if (events) events.scrollTop = scrollPositions.get(element.dataset.watchGroup) || 0;
    });
    if (focusedIndex !== undefined) list.querySelector?.(`[data-watch-index="${Number(focusedIndex)}"]`)?.focus({ preventScroll: true });
}

if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('DOMContentLoaded', refreshTournamentWatchSettingsUI);
