const WALKON_TOURNAMENT_MODES = Object.freeze({
    STAGE_ONLY: 'stage',
    ALL_TOURNAMENTS: 'all'
});

const WALKON_SETTINGS_TEXT = Object.freeze({
    pl: {
        title: '🎵 Muzyka walk-on',
        intro: 'Wybierz, w jakich turniejach mają być odtwarzane wejścia zawodników.',
        label: 'Walk-ony w turniejach',
        stage: 'Tylko turnieje sceniczne (domyślne)',
        all: 'Wszystkie turnieje',
        stageDetails: 'Turnieje podłogowe i kwalifikacje rozpoczynają się bez walk-onów.',
        allDetails: 'Muzyka i zapowiedzi są odtwarzane także w podłogówkach, kwalifikacjach i cyklach pobocznych.'
    },
    en: {
        title: '🎵 Walk-on music',
        intro: 'Choose which tournaments should include player entrances.',
        label: 'Tournament walk-ons',
        stage: 'Stage events only (default)',
        all: 'All tournaments',
        stageDetails: 'Floor events and qualifiers start without walk-ons.',
        allDetails: 'Music and introductions also play at floor events, qualifiers and secondary tours.'
    },
    de: {
        title: '🎵 Walk-on-Musik',
        intro: 'Wähle, bei welchen Turnieren die Einläufe der Spieler abgespielt werden.',
        label: 'Walk-ons bei Turnieren',
        stage: 'Nur Bühnenturniere (Standard)',
        all: 'Alle Turniere',
        stageDetails: 'Floor-Turniere und Qualifikationen beginnen ohne Walk-ons.',
        allDetails: 'Musik und Ansagen laufen auch bei Floor-Turnieren, Qualifikationen und Nebentouren.'
    },
    nl: {
        title: '🎵 Walk-onmuziek',
        intro: 'Kies bij welke toernooien de opkomst van spelers wordt afgespeeld.',
        label: 'Walk-ons bij toernooien',
        stage: 'Alleen podiumtoernooien (standaard)',
        all: 'Alle toernooien',
        stageDetails: 'Floortoernooien en kwalificaties beginnen zonder walk-ons.',
        allDetails: 'Muziek en aankondigingen spelen ook bij floortoernooien, kwalificaties en neventours.'
    }
});

function normalizeWalkonTournamentMode(value) {
    return value === WALKON_TOURNAMENT_MODES.ALL_TOURNAMENTS
        ? WALKON_TOURNAMENT_MODES.ALL_TOURNAMENTS
        : WALKON_TOURNAMENT_MODES.STAGE_ONLY;
}

function getWalkonTournamentMode(candidate = typeof player !== 'undefined' ? player : null) {
    return normalizeWalkonTournamentMode(candidate?.walkonTournamentMode);
}

function areWalkonsEnabledInAllTournaments(candidate = typeof player !== 'undefined' ? player : null) {
    return getWalkonTournamentMode(candidate) === WALKON_TOURNAMENT_MODES.ALL_TOURNAMENTS;
}

function getWalkonSettingsText() {
    const language = typeof currentLang === 'string' && WALKON_SETTINGS_TEXT[currentLang]
        ? currentLang
        : 'en';
    return WALKON_SETTINGS_TEXT[language];
}

function refreshWalkonSettingsUI() {
    if (typeof document === 'undefined') return;
    const text = getWalkonSettingsText();
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    setText('walkon-settings-title', text.title);
    setText('walkon-settings-intro', text.intro);
    setText('walkon-settings-label', text.label);

    const mode = getWalkonTournamentMode();
    const select = document.getElementById('hub-walkon-tournament-mode');
    if (select) select.value = mode;
    document.querySelectorAll('[data-walkon-tournament-option]').forEach(option => {
        option.textContent = text[normalizeWalkonTournamentMode(option.value)];
    });
    setText('walkon-settings-current', text[`${mode}Details`]);
}

function initializeWalkonTournamentMode(candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate) return WALKON_TOURNAMENT_MODES.STAGE_ONLY;
    candidate.walkonTournamentMode = getWalkonTournamentMode(candidate);
    if (typeof player !== 'undefined' && candidate === player) refreshWalkonSettingsUI();
    return candidate.walkonTournamentMode;
}

function setWalkonTournamentMode(value, options = {}) {
    if (typeof player === 'undefined' || !player || !player.name) return false;
    const mode = normalizeWalkonTournamentMode(value);
    player.walkonTournamentMode = mode;
    refreshWalkonSettingsUI();
    if (options.save !== false && typeof saveGame === 'function') saveGame(true);
    return true;
}

function changeWalkonTournamentMode(value) {
    return setWalkonTournamentMode(value);
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshWalkonSettingsUI);
    else refreshWalkonSettingsUI();
}
