const MATCH_LAYOUT_STORAGE_KEY = 'dartsCareer.matchLayout';
const MATCH_LAYOUT_SCALES = Object.freeze({ compact: 0.82, standard: 1, large: 1.18 });
let matchLayoutFallback = { board: 'standard', ui: 'standard' };
const MATCH_LAYOUT_COPY = {
    pl: { title: '📐 Wielkość tarczy i interfejsu', intro: 'Dopasuj osobno widok tarczy i elementy sterowania podczas meczu.',
        board: 'Tarcza', ui: 'Interfejs', compact: 'Kompaktowy', standard: 'Standardowy', large: 'Duży',
        preview: 'Podgląd układu', hint: 'Działa w zwykłym meczu i trybie TV. Nie zmienia celności ani wyników.' },
    en: { title: '📐 Board and interface size', intro: 'Adjust the board and match controls independently.',
        board: 'Board', ui: 'Interface', compact: 'Compact', standard: 'Standard', large: 'Large',
        preview: 'Layout preview', hint: 'Works in regular matches and TV mode. Accuracy and results are unchanged.' },
    de: { title: '📐 Board- und Oberflächengröße', intro: 'Passe Board und Bedienelemente im Spiel getrennt an.',
        board: 'Board', ui: 'Oberfläche', compact: 'Kompakt', standard: 'Standard', large: 'Groß',
        preview: 'Layoutvorschau', hint: 'Gilt für normale Spiele und den TV-Modus. Treffer und Ergebnisse bleiben gleich.' },
    nl: { title: '📐 Grootte van bord en interface', intro: 'Pas het bord en de bediening tijdens wedstrijden afzonderlijk aan.',
        board: 'Bord', ui: 'Interface', compact: 'Compact', standard: 'Standaard', large: 'Groot',
        preview: 'Voorbeeld van indeling', hint: 'Werkt in gewone wedstrijden en tv-modus. Nauwkeurigheid en uitslagen blijven gelijk.' }
};

function readMatchLayoutSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(MATCH_LAYOUT_STORAGE_KEY));
        if (stored && typeof stored === 'object') {
            return {
                board: Object.hasOwn(MATCH_LAYOUT_SCALES, stored.board) ? stored.board : matchLayoutFallback.board,
                ui: Object.hasOwn(MATCH_LAYOUT_SCALES, stored.ui) ? stored.ui : matchLayoutFallback.ui
            };
        }
    } catch (_error) { /* Storage may be unavailable or contain an older value. */ }
    return { ...matchLayoutFallback };
}

function getMatchBoardSizeScale() { return MATCH_LAYOUT_SCALES[readMatchLayoutSettings().board]; }
function getMatchUiScale() { return MATCH_LAYOUT_SCALES[readMatchLayoutSettings().ui]; }

function applyMatchLayoutSettings() {
    if (typeof document === 'undefined') return;
    const settings = readMatchLayoutSettings();
    const screen = document.getElementById('screen-match');
    const preview = document.getElementById('match-layout-preview');
    if (screen) {
        screen.dataset.boardSize = settings.board;
        screen.dataset.uiSize = settings.ui;
        screen.style.setProperty('--match-board-scale', MATCH_LAYOUT_SCALES[settings.board]);
        screen.style.setProperty('--match-ui-scale', MATCH_LAYOUT_SCALES[settings.ui]);
    }
    if (preview) {
        preview.style.setProperty('--preview-board-scale', MATCH_LAYOUT_SCALES[settings.board]);
        preview.style.setProperty('--preview-ui-scale', MATCH_LAYOUT_SCALES[settings.ui]);
    }
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function'
        && typeof Event === 'function') {
        window.dispatchEvent(new Event('match-layout-settings-change'));
        window.dispatchEvent(new Event('resize'));
    }
}

function refreshMatchLayoutSettingsUI() {
    if (typeof document === 'undefined') return;
    const lang = typeof currentLang === 'string' ? currentLang : 'pl';
    const copy = MATCH_LAYOUT_COPY[lang] || MATCH_LAYOUT_COPY.pl;
    for (const [key, id] of [['title', 'match-layout-title'], ['intro', 'match-layout-intro'],
        ['board', 'match-layout-board-label'], ['ui', 'match-layout-ui-label'],
        ['preview', 'match-layout-preview-label'], ['hint', 'match-layout-hint']]) {
        const node = document.getElementById(id);
        if (node) node.textContent = copy[key];
    }
    const settings = readMatchLayoutSettings();
    for (const [field, id] of [['board', 'hub-match-board-size'], ['ui', 'hub-match-ui-size']]) {
        const select = document.getElementById(id);
        if (!select) continue;
        select.value = settings[field];
        for (const option of select.options) option.textContent = copy[option.value];
    }
    applyMatchLayoutSettings();
}

function changeMatchLayoutSetting(field, value) {
    if (!['board', 'ui'].includes(field) || !Object.hasOwn(MATCH_LAYOUT_SCALES, value)) return false;
    matchLayoutFallback = { ...readMatchLayoutSettings(), [field]: value };
    try { localStorage.setItem(MATCH_LAYOUT_STORAGE_KEY, JSON.stringify(matchLayoutFallback)); }
    catch (_error) { /* The setting still applies until this session ends. */ }
    refreshMatchLayoutSettingsUI();
    return true;
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', refreshMatchLayoutSettingsUI);
}
