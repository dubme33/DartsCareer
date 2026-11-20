/* Career preferences for the live match scoreboard. */
(function (root) {
    'use strict';

    const copy = {
        pl: { title: 'Kolory tablicy wyników', intro: 'Ustaw własny kolor dla każdego cyklu. Działa w zwykłych meczach i w trybie TV.', cycle: 'Cykl lub turniej', color: 'Kolor', save: 'Zapisz kolor', reset: 'Przywróć domyślny', preview: 'Podgląd', empty: 'Brak cykli w kalendarzu.', youth: 'Mistrzostwa świata juniorów', qschool: 'Pro Card Trials (Q-School)' },
        en: { title: 'Scoreboard colours', intro: 'Set a custom colour per circuit. It applies in regular matches and TV mode.', cycle: 'Circuit or tournament', color: 'Colour', save: 'Save colour', reset: 'Restore default', preview: 'Preview', empty: 'There are no circuits in the calendar.', youth: 'World Youth Championship', qschool: 'Pro Card Trials (Q-School)' },
        de: { title: 'Farben der Ergebnisanzeige', intro: 'Wähle eine eigene Farbe pro Serie. Sie gilt in normalen Spielen und im TV-Modus.', cycle: 'Serie oder Turnier', color: 'Farbe', save: 'Farbe speichern', reset: 'Standard wiederherstellen', preview: 'Vorschau', empty: 'Im Kalender sind keine Serien vorhanden.', youth: 'Jugend-Weltmeisterschaft', qschool: 'Pro Card Trials (Q-School)' },
        nl: { title: 'Scorebordkleuren', intro: 'Kies per circuit een eigen kleur. Die geldt in gewone wedstrijden en in de tv-modus.', cycle: 'Circuit of toernooi', color: 'Kleur', save: 'Kleur opslaan', reset: 'Standaard herstellen', preview: 'Voorbeeld', empty: 'Er staan geen circuits in de kalender.', youth: 'Wereldkampioenschap jeugd', qschool: 'Pro Card Trials (Q-School)' }
    };
    const defaultSwatch = '#446d96';

    function normalizeColor(value) {
        if (typeof value !== 'string') return '';
        const hex = value.trim().replace(/^#/, '').toLowerCase();
        if (/^[0-9a-f]{3}$/.test(hex)) return '#' + [...hex].map(digit => digit + digit).join('');
        return /^[0-9a-f]{6}$/.test(hex) ? `#${hex}` : '';
    }

    function textColor(color) {
        const channels = color.slice(1).match(/../g).map(pair => parseInt(pair, 16) / 255);
        const [r, g, b] = channels.map(channel => channel <= 0.04045
            ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? '#000' : '#fff';
    }

    function cycleId(event) {
        const id = getCareerEditorTourId(event);
        if (event.editorCycle && event.editorCycle !== 'auto') return id;
        // One-off majors have their own presentation, even though the calendar groups them.
        if (id === 'major') return `major:${getCalendarTournamentFilterKey(event)}`;
        if (event.specialType === 'worldYouth') return 'worldYouth';
        if (event.specialType === 'pdcQSchool') return 'qSchool';
        return id;
    }

    function savedColor(id) {
        const colors = typeof player === 'object' ? player?.scoreboardColors : null;
        return colors && Object.hasOwn(colors, id) ? normalizeColor(colors[id]) : '';
    }

    root.matchScoreboardColors = Object.freeze({
        forTournament(event) { return event ? savedColor(cycleId(event)) : ''; },
        textColor
    });

    const settings = root.document?.getElementById('scoreboard-color-settings');
    if (!settings) return;
    const select = settings.querySelector('#scoreboard-color-cycle');
    const form = settings.querySelector('form');
    const picker = settings.querySelector('#scoreboard-color-picker');
    const hex = settings.querySelector('#scoreboard-color-hex');
    const reset = settings.querySelector('#scoreboard-color-reset');
    const preview = settings.querySelector('.scoreboard-color-preview');
    const empty = settings.querySelector('#scoreboard-color-empty');
    let optionsKey = '';
    let lastPlayer = null;
    let lastColor = '';

    function listCycles(labels) {
        const cycles = new Map();
        for (const event of tournamentDatabase) {
            if (!event?.name) continue;
            const id = cycleId(event);
            if (cycles.has(id)) continue;
            let name = trCalendarFilter(id);
            if (id.startsWith('custom:')) name = event.editorTourName;
            if (id.startsWith('major:')) name = getCalendarFilterEventLabel(event);
            if (id === 'worldYouth') name = labels.youth;
            if (id === 'qSchool') name = labels.qschool;
            cycles.set(id, name);
        }
        for (const tour of getCareerCalendarEditorState().tours) {
            if (!tour?.removed && tour?.id?.startsWith('custom:')) cycles.set(tour.id, tour.name);
        }
        return [...cycles].sort((a, b) => a[1].localeCompare(b[1], document.documentElement.lang || 'en'));
    }

    function updatePreview(color) {
        preview.style.setProperty('--scoreboard-color', color);
        preview.style.setProperty('--scoreboard-color-text', textColor(color));
    }

    function loadColor() {
        lastColor = savedColor(select.value);
        hex.value = lastColor;
        picker.value = lastColor || defaultSwatch;
        reset.disabled = !lastColor;
        updatePreview(picker.value);
    }

    function refresh() {
        const labels = copy[typeof currentLang === 'string' ? currentLang : 'pl'] || copy.en;
        for (const node of settings.querySelectorAll('[data-scoreboard-label]')) {
            const label = labels[node.dataset.scoreboardLabel];
            if (node.textContent !== label) node.textContent = label;
        }
        if (!settings.open) return;
        const career = typeof player === 'object' && player?.name ? player : null;
        const options = career ? listCycles(labels) : [];
        const key = JSON.stringify(options);
        const previous = lastPlayer === career ? select.value : '';
        if (key !== optionsKey) {
            select.replaceChildren(...options.map(([id, name]) => new Option(name, id)));
            optionsKey = key;
        }
        select.value = options.some(([id]) => id === previous) ? previous : options[0]?.[0] || '';
        form.hidden = !options.length;
        empty.hidden = Boolean(options.length);
        if (career !== lastPlayer || previous !== select.value || lastColor !== savedColor(select.value)) loadColor();
        lastPlayer = career;
    }

    function save(color) {
        if (player !== lastPlayer || !select.value) return;
        const colors = { ...player.scoreboardColors };
        if (color) colors[select.value] = color;
        else delete colors[select.value];
        player.scoreboardColors = colors;
        if (typeof saveGame === 'function') saveGame(true);
        loadColor();
    }

    settings.addEventListener('toggle', refresh);
    select.addEventListener('change', loadColor);
    picker.addEventListener('input', () => {
        hex.value = picker.value;
        updatePreview(picker.value);
    });
    hex.addEventListener('input', () => {
        const color = normalizeColor(hex.value);
        if (color) {
            picker.value = color;
            updatePreview(color);
        }
    });
    form.addEventListener('submit', event => {
        event.preventDefault();
        const color = normalizeColor(hex.value);
        if (color) save(color);
    });
    reset.addEventListener('click', () => save(''));
    root.refreshMatchScoreboardSettings = refresh;
    refresh();
})(typeof window !== 'undefined' ? window : globalThis);
