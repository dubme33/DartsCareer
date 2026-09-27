const TV_DIRECTOR_SETTING_MODES = Object.freeze(['off', 'rare', 'normal', 'often']);
const TV_DIRECTOR_SETTINGS_KEY = 'dartsCareer.tvDirectorSettings';
const TV_DIRECTOR_SETTINGS_TEXT = {
    pl: {
        title: '🎬 Opcje reżysera', intro: 'Dostosuj liczbę powtórek i plansz statystycznych w trybie telewizyjnym.',
        replays: 'Powtórki', statistics: 'Statystyki podczas meczu',
        off: 'Wyłączone', rare: 'Rzadko', normal: 'Normalnie (domyślne)', often: 'Często',
        replayOff: 'Bez automatycznych powtórek.', replayRare: 'Co trzecia ważna akcja otrzyma powtórkę.',
        replayNormal: 'Powtórki zakończeń legów, 180, podejść 170–171 i odbić lotek.',
        replayOften: 'Jak normalnie, dodatkowo powtórki pozostałych podejść 140+.',
        statsOff: 'Bez automatycznych plansz podczas meczu.', statsRare: 'Co czwarta z normalnie proponowanych plansz.',
        statsNormal: 'Plansze po ważnych akcjach oraz co dwie zakończone kolejki.',
        statsOften: 'Plansze mogą pojawiać się po każdej zakończonej kolejce.',
        hint: 'Dotyczy gry i oglądania meczów w TV. Raporty pomeczowe mają osobne ustawienie.'
    },
    en: {
        title: '🎬 Director options', intro: 'Adjust the number of replays and statistics cards in TV mode.',
        replays: 'Replays', statistics: 'In-match statistics',
        off: 'Off', rare: 'Rarely', normal: 'Normal (default)', often: 'Often',
        replayOff: 'No automatic replays.', replayRare: 'Every third highlight gets a replay.',
        replayNormal: 'Replays of leg finishes, 180s, 170–171 visits and bounce-outs.',
        replayOften: 'Normal coverage plus other 140+ visits.',
        statsOff: 'No automatic in-match cards.', statsRare: 'Every fourth card from normal coverage.',
        statsNormal: 'Cards after highlights and every two completed visits.',
        statsOften: 'Cards may appear after every completed visit.',
        hint: 'Applies to playing and watching TV matches. Post-match reports have a separate setting.'
    },
    de: {
        title: '🎬 Regieoptionen', intro: 'Passe die Anzahl der Wiederholungen und Statistikkarten im TV-Modus an.',
        replays: 'Wiederholungen', statistics: 'Statistiken während des Spiels',
        off: 'Aus', rare: 'Selten', normal: 'Normal (Standard)', often: 'Häufig',
        replayOff: 'Keine automatischen Wiederholungen.', replayRare: 'Jede dritte wichtige Aktion wird wiederholt.',
        replayNormal: 'Wiederholungen von Leg-Finishes, 180ern, Aufnahmen mit 170–171 und Bounce-outs.',
        replayOften: 'Normale Übertragung plus weitere Aufnahmen mit 140+.',
        statsOff: 'Keine automatischen Karten während des Spiels.', statsRare: 'Jede vierte Karte der normalen Übertragung.',
        statsNormal: 'Karten nach wichtigen Aktionen und jeweils zwei abgeschlossenen Aufnahmen.',
        statsOften: 'Karten können nach jeder abgeschlossenen Aufnahme erscheinen.',
        hint: 'Gilt für gespielte und beobachtete TV-Matches. Spielberichte haben eine eigene Einstellung.'
    },
    nl: {
        title: '🎬 Regieopties', intro: 'Pas het aantal herhalingen en statistiekkaarten in de TV-modus aan.',
        replays: 'Herhalingen', statistics: 'Statistieken tijdens de wedstrijd',
        off: 'Uit', rare: 'Zelden', normal: 'Normaal (standaard)', often: 'Vaak',
        replayOff: 'Geen automatische herhalingen.', replayRare: 'Elke derde belangrijke actie krijgt een herhaling.',
        replayNormal: 'Herhalingen van legfinishes, 180s, beurten van 170–171 en bounce-outs.',
        replayOften: 'Normale dekking plus andere beurten van 140+.',
        statsOff: 'Geen automatische kaarten tijdens de wedstrijd.', statsRare: 'Elke vierde kaart van de normale dekking.',
        statsNormal: 'Kaarten na belangrijke acties en elke twee voltooide beurten.',
        statsOften: 'Kaarten kunnen na elke voltooide beurt verschijnen.',
        hint: 'Geldt voor gespeelde en bekeken TV-wedstrijden. Wedstrijdrapporten hebben een aparte instelling.'
    }
};

function normalizeTVDirectorSettings(value) {
    const valid = mode => TV_DIRECTOR_SETTING_MODES.includes(mode) ? mode : 'normal';
    return { replays: valid(value?.replays), statistics: valid(value?.statistics) };
}

function readTVDirectorSettingsPreference() {
    try { return normalizeTVDirectorSettings(JSON.parse(localStorage.getItem(TV_DIRECTOR_SETTINGS_KEY))); }
    catch (_error) { return normalizeTVDirectorSettings(null); }
}

let tvDirectorSettingsPreference = readTVDirectorSettingsPreference();

function getTVDirectorSettings(candidate = typeof player !== 'undefined' ? player : null) {
    return normalizeTVDirectorSettings(candidate?.tvDirectorSettings || tvDirectorSettingsPreference);
}

function refreshTVDirectorSettingsUI() {
    if (typeof document === 'undefined') return;
    const text = TV_DIRECTOR_SETTINGS_TEXT[typeof currentLang === 'string' ? currentLang : 'en']
        || TV_DIRECTOR_SETTINGS_TEXT.en;
    const settings = getTVDirectorSettings();
    document.querySelectorAll('[data-tv-director-text]').forEach(element => {
        const key = element.dataset.tvDirectorText;
        if (text[key]) element.textContent = text[key];
        if (element.tagName === 'SUMMARY') element.title = text[key];
    });
    for (const key of ['replays', 'statistics']) {
        document.querySelectorAll(`[data-tv-director-setting="${key}"]`).forEach(select => {
            select.value = settings[key];
            for (const option of select.options) option.textContent = text[option.value];
        });
        const prefix = key === 'replays' ? 'replay' : 'stats';
        const mode = settings[key];
        document.querySelectorAll(`[data-tv-director-description="${key}"]`).forEach(element => {
            element.textContent = text[prefix + mode[0].toUpperCase() + mode.slice(1)];
        });
    }
}

function changeTVDirectorSetting(key, value) {
    if (!['replays', 'statistics'].includes(key) || !TV_DIRECTOR_SETTING_MODES.includes(value)
        || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) {
        refreshTVDirectorSettingsUI();
        return false;
    }
    const previous = getTVDirectorSettings();
    const settings = { ...previous, [key]: value };
    const candidate = typeof player !== 'undefined' ? player : null;
    tvDirectorSettingsPreference = settings;
    if (candidate?.name) candidate.tvDirectorSettings = { ...settings };
    try { localStorage.setItem(TV_DIRECTOR_SETTINGS_KEY, JSON.stringify(settings)); }
    catch (_error) { /* Settings still work when browser storage is unavailable. */ }
    if (typeof window !== 'undefined') window.matchTVDirector?.onSettingsChange?.(settings, previous);
    refreshTVDirectorSettingsUI();
    if (candidate?.name && typeof saveGame === 'function') saveGame(true, { immediate: true });
    return true;
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', refreshTVDirectorSettingsUI);
}
