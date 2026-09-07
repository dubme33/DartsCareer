const CALENDAR_FILTER_VERSION = 1;
const CALENDAR_FILTER_CYCLE_ORDER = Object.freeze([
    'premierLeague',
    'playersChampionship',
    'europeanTour',
    'worldSeries',
    'challengeTour',
    'developmentTour',
    'worldCup',
    'other'
]);

const CALENDAR_FILTER_TRANSLATIONS = Object.freeze({
    pl: {
        title: '🔎 Filtruj kalendarz',
        hint: 'Odznacz cały cykl albo rozwiń go i wybierz pojedyncze turnieje.',
        showAll: 'Pokaż wszystko', hideAll: 'Ukryj wszystko', visible: 'Widoczne: {visible}/{total}',
        empty: 'Żaden turniej nie pasuje do wybranych filtrów.',
        premierLeague: 'Global Darts League (Premier League)',
        playersChampionship: 'Pro Players Cup (Players Championship)',
        europeanTour: 'Continental Tour (European Tour)',
        worldSeries: 'Global Masters (World Series)',
        challengeTour: 'Rising Stars Circuit (Challenge Tour)',
        developmentTour: 'Future Champions Circuit (Development Tour)',
        worldCup: 'Puchar Narodów', other: 'Pozostałe turnieje'
    },
    en: {
        title: '🔎 Filter calendar',
        hint: 'Untick an entire circuit or expand it to choose individual tournaments.',
        showAll: 'Show all', hideAll: 'Hide all', visible: 'Visible: {visible}/{total}',
        empty: 'No tournaments match the selected filters.',
        premierLeague: 'Global Darts League (Premier League)',
        playersChampionship: 'Pro Players Cup (Players Championship)',
        europeanTour: 'Continental Tour (European Tour)',
        worldSeries: 'Global Masters (World Series)',
        challengeTour: 'Rising Stars Circuit (Challenge Tour)',
        developmentTour: 'Future Champions Circuit (Development Tour)',
        worldCup: 'World Cup', other: 'Other tournaments'
    },
    de: {
        title: '🔎 Kalender filtern',
        hint: 'Deaktiviere eine ganze Serie oder öffne sie, um einzelne Turniere auszuwählen.',
        showAll: 'Alle anzeigen', hideAll: 'Alle ausblenden', visible: 'Sichtbar: {visible}/{total}',
        empty: 'Keine Turniere entsprechen den ausgewählten Filtern.',
        premierLeague: 'Global Darts League (Premier League)',
        playersChampionship: 'Pro Players Cup (Players Championship)',
        europeanTour: 'Continental Tour (European Tour)',
        worldSeries: 'Global Masters (World Series)',
        challengeTour: 'Rising Stars Circuit (Challenge Tour)',
        developmentTour: 'Future Champions Circuit (Development Tour)',
        worldCup: 'World Cup', other: 'Andere Turniere'
    },
    nl: {
        title: '🔎 Kalender filteren',
        hint: 'Vink een hele reeks uit of klap deze open om afzonderlijke toernooien te kiezen.',
        showAll: 'Alles tonen', hideAll: 'Alles verbergen', visible: 'Zichtbaar: {visible}/{total}',
        empty: 'Geen toernooien voldoen aan de geselecteerde filters.',
        premierLeague: 'Global Darts League (Premier League)',
        playersChampionship: 'Pro Players Cup (Players Championship)',
        europeanTour: 'Continental Tour (European Tour)',
        worldSeries: 'Global Masters (World Series)',
        challengeTour: 'Rising Stars Circuit (Challenge Tour)',
        developmentTour: 'Future Champions Circuit (Development Tour)',
        worldCup: 'World Cup', other: 'Andere toernooien'
    }
});

function trCalendarFilter(key, replacements = {}) {
    const language = typeof currentLang === 'string' && CALENDAR_FILTER_TRANSLATIONS[currentLang]
        ? currentLang
        : 'pl';
    let text = CALENDAR_FILTER_TRANSLATIONS[language][key]
        || CALENDAR_FILTER_TRANSLATIONS.pl[key]
        || key;
    Object.entries(replacements).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, String(value));
    });
    return text;
}

function escapeCalendarFilterHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function normalizeCalendarFilterName(value) {
    return String(value || '').trim();
}

function getCalendarTournamentFilterKey(tournament) {
    if (!tournament || typeof tournament !== 'object') return '';
    if (tournament.specialType === 'challengeTour' && Number.isInteger(tournament.challengeTourEvent)) {
        return `challengeTour:${tournament.challengeTourEvent}`;
    }
    if (tournament.specialType === 'developmentTour' && Number.isInteger(tournament.developmentTourEvent)) {
        return `developmentTour:${tournament.developmentTourEvent}`;
    }
    if (tournament.worldMastersEvent) return `worldSeries:${tournament.worldMastersEvent}`;
    const sourceName = normalizeCalendarFilterName(tournament.sourceName || tournament.name);
    if (sourceName) return `tournament:${sourceName}`;
    return `event:${normalizeCalendarFilterName(tournament.specialType) || 'other'}:${Number(tournament.month) || 0}:${Number(tournament.day) || 0}`;
}

function getCalendarTournamentCycle(tournament) {
    if (!tournament || typeof tournament !== 'object') return 'other';
    const type = normalizeCalendarFilterName(tournament.specialType);
    const sourceName = normalizeCalendarFilterName(tournament.sourceName || tournament.name).toLowerCase();

    if (type === 'challengeTour' || /rising stars circuit|challenge tour/.test(sourceName)) return 'challengeTour';
    if (type === 'developmentTour' || /future champions circuit|development tour/.test(sourceName)) return 'developmentTour';
    if (['worldMasters', 'worldMastersFinals', 'worldMastersFinalsQualifier'].includes(type)
        || /global masters|world series/.test(sourceName)) return 'worldSeries';
    if (type === 'continentalQualifier'
        || /^(continental|european) tour \d+/.test(sourceName)
        || /continental championship|european championship/.test(sourceName)) return 'europeanTour';
    if (/^(pro players cup|players championship) \d+/.test(sourceName)
        || /pro players finals|players championship finals/.test(sourceName)) return 'playersChampionship';
    if (/global darts league|premier league/.test(sourceName)) return 'premierLeague';
    if (['worldCup', 'worldCupQualifiers'].includes(type)
        || /puchar narodów|world cup/.test(sourceName)) return 'worldCup';
    return 'other';
}

let fallbackCalendarFilterState = { version: CALENDAR_FILTER_VERSION, hiddenTournamentKeys: [] };

function normalizeCalendarFilterState(state) {
    const keys = Array.isArray(state?.hiddenTournamentKeys)
        ? state.hiddenTournamentKeys
            .filter(key => typeof key === 'string' && key.length > 0 && key.length <= 250)
            .slice(0, 1000)
        : [];
    return {
        version: CALENDAR_FILTER_VERSION,
        hiddenTournamentKeys: [...new Set(keys)].sort()
    };
}

function getCalendarFilterState() {
    if (typeof player !== 'undefined' && player && typeof player === 'object') {
        player.calendarFilters = normalizeCalendarFilterState(player.calendarFilters);
        return player.calendarFilters;
    }
    fallbackCalendarFilterState = normalizeCalendarFilterState(fallbackCalendarFilterState);
    return fallbackCalendarFilterState;
}

function getCalendarFilterTournament(entry) {
    return entry && typeof entry === 'object' && entry.tour ? entry.tour : entry;
}

function getVisibleCalendarTournamentEntries(entries) {
    const hidden = new Set(getCalendarFilterState().hiddenTournamentKeys);
    return (Array.isArray(entries) ? entries : []).filter(entry => {
        const key = getCalendarTournamentFilterKey(getCalendarFilterTournament(entry));
        return key && !hidden.has(key);
    });
}

function storeCalendarFilterVisibility(keys, visible, refresh = true) {
    const state = getCalendarFilterState();
    const hidden = new Set(state.hiddenTournamentKeys);
    (Array.isArray(keys) ? keys : [keys]).filter(Boolean).forEach(key => {
        if (visible) hidden.delete(key);
        else hidden.add(key);
    });
    state.hiddenTournamentKeys = [...hidden].sort();
    if (typeof player !== 'undefined' && player && typeof player === 'object') player.calendarFilters = state;
    else fallbackCalendarFilterState = state;
    if (typeof saveGame === 'function') saveGame(true);
    if (refresh && typeof showCalendar === 'function') showCalendar();
    return state;
}

function setCalendarTournamentFilterVisibility(tournamentKey, visible, refresh = true) {
    return storeCalendarFilterVisibility([tournamentKey], visible, refresh);
}

function setCalendarCycleFilterVisibility(cycle, visible, entries = null, refresh = true) {
    const sourceEntries = Array.isArray(entries)
        ? entries
        : (typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase) ? tournamentDatabase : []);
    const keys = sourceEntries
        .map(getCalendarFilterTournament)
        .filter(tournament => getCalendarTournamentCycle(tournament) === cycle)
        .map(getCalendarTournamentFilterKey);
    return storeCalendarFilterVisibility(keys, visible, refresh);
}

function getCalendarFilterEventLabel(tournament) {
    if (typeof getTournamentDisplayName === 'function') return getTournamentDisplayName(tournament);
    return tournament?.name || '';
}

function getCalendarFilterEventDate(tournament) {
    const month = String((Number(tournament?.month) || 0) + 1).padStart(2, '0');
    return `${Number(tournament?.day) || 1}.${month}`;
}

function renderCalendarTournamentFilters(entries) {
    if (typeof document === 'undefined' || typeof document.getElementById !== 'function') return;
    const panel = document.getElementById('calendar-filter-panel');
    if (!panel) return;

    const sourceEntries = (Array.isArray(entries) ? entries : [])
        .filter(entry => getCalendarFilterTournament(entry))
        .slice()
        .sort((first, second) => {
            const firstTournament = getCalendarFilterTournament(first);
            const secondTournament = getCalendarFilterTournament(second);
            return (Number(firstTournament.month) || 0) - (Number(secondTournament.month) || 0)
                || (Number(firstTournament.day) || 0) - (Number(secondTournament.day) || 0)
                || getCalendarFilterEventLabel(firstTournament).localeCompare(getCalendarFilterEventLabel(secondTournament));
        });
    const hidden = new Set(getCalendarFilterState().hiddenTournamentKeys);
    const grouped = new Map(CALENDAR_FILTER_CYCLE_ORDER.map(cycle => [cycle, []]));
    sourceEntries.forEach(entry => {
        const tournament = getCalendarFilterTournament(entry);
        grouped.get(getCalendarTournamentCycle(tournament)).push({
            tournament,
            key: getCalendarTournamentFilterKey(tournament)
        });
    });
    const visibleTotal = sourceEntries.filter(entry =>
        !hidden.has(getCalendarTournamentFilterKey(getCalendarFilterTournament(entry)))).length;

    const groupsHtml = CALENDAR_FILTER_CYCLE_ORDER.map(cycle => {
        const events = grouped.get(cycle);
        if (!events.length) return '';
        const visibleInCycle = events.filter(event => !hidden.has(event.key)).length;
        const allVisible = visibleInCycle === events.length;
        const eventsHtml = events.map(event => `<label class="calendar-filter-event">
            <input type="checkbox" data-calendar-filter-key="${escapeCalendarFilterHtml(event.key)}"${hidden.has(event.key) ? '' : ' checked'}>
            <span class="calendar-filter-event-date">${escapeCalendarFilterHtml(getCalendarFilterEventDate(event.tournament))}</span>
            <span>${escapeCalendarFilterHtml(getCalendarFilterEventLabel(event.tournament))}</span>
        </label>`).join('');
        return `<details class="calendar-filter-cycle">
            <summary>
                <label class="calendar-filter-cycle-label">
                    <input type="checkbox" data-calendar-filter-cycle="${cycle}"${allVisible ? ' checked' : ''}>
                    <span>${escapeCalendarFilterHtml(trCalendarFilter(cycle))}</span>
                </label>
                <span class="calendar-filter-cycle-count">${visibleInCycle}/${events.length}</span>
            </summary>
            <div class="calendar-filter-events">${eventsHtml}</div>
        </details>`;
    }).join('');

    panel.setAttribute('aria-label', trCalendarFilter('title'));
    panel.innerHTML = `<div class="calendar-filter-heading">
        <div><h3>${escapeCalendarFilterHtml(trCalendarFilter('title'))}</h3><p>${escapeCalendarFilterHtml(trCalendarFilter('hint'))}</p></div>
        <strong class="calendar-filter-visible" aria-live="polite">${escapeCalendarFilterHtml(trCalendarFilter('visible', { visible: visibleTotal, total: sourceEntries.length }))}</strong>
    </div>
    <div class="calendar-filter-actions">
        <button type="button" data-calendar-filter-action="show">${escapeCalendarFilterHtml(trCalendarFilter('showAll'))}</button>
        <button type="button" data-calendar-filter-action="hide">${escapeCalendarFilterHtml(trCalendarFilter('hideAll'))}</button>
    </div>
    <div class="calendar-filter-groups">${groupsHtml}</div>`;

    panel.querySelectorAll('[data-calendar-filter-key]').forEach(input => {
        input.addEventListener('change', () => {
            setCalendarTournamentFilterVisibility(input.dataset.calendarFilterKey, input.checked);
        });
    });
    panel.querySelectorAll('[data-calendar-filter-cycle]').forEach(input => {
        const events = grouped.get(input.dataset.calendarFilterCycle) || [];
        const visibleInCycle = events.filter(event => !hidden.has(event.key)).length;
        input.indeterminate = visibleInCycle > 0 && visibleInCycle < events.length;
        input.addEventListener('click', event => event.stopPropagation());
        input.addEventListener('change', () => {
            setCalendarCycleFilterVisibility(input.dataset.calendarFilterCycle, input.checked, sourceEntries);
        });
    });
    panel.querySelectorAll('.calendar-filter-cycle-label').forEach(label => {
        label.addEventListener('click', event => event.stopPropagation());
    });
    panel.querySelectorAll('[data-calendar-filter-action]').forEach(button => {
        button.addEventListener('click', () => {
            storeCalendarFilterVisibility(
                sourceEntries.map(entry => getCalendarTournamentFilterKey(getCalendarFilterTournament(entry))),
                button.dataset.calendarFilterAction === 'show'
            );
        });
    });
}
