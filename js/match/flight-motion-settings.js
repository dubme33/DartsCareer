const DART_FLIGHT_MOTION_KEY = 'dartsCareer.dartFlightMotion';
const DART_FLIGHT_MOTION_MODES = Object.freeze(['enabled', 'system', 'disabled']);
let dartFlightMotionFallback = 'enabled';
const DART_FLIGHT_MOTION_TEXT = {
    pl: {
        title: '🎯 Animacja lotki 3D', intro: 'Wybierz, czy lotka ma być widoczna podczas lotu.',
        label: 'Animacja lotki 3D', enabled: 'Włączona (domyślnie)', system: 'Zgodnie z ustawieniami systemu',
        disabled: 'Wyłączona', hint: 'Domyślnie działa także przy wyłączonych animacjach systemu. Nie zmienia celności ani wyników.'
    },
    en: {
        title: '🎯 3D dart flight', intro: 'Choose whether to show the dart travelling to the board.',
        label: '3D dart flight animation', enabled: 'On (default)', system: 'Follow system motion setting',
        disabled: 'Off', hint: 'On by default even when system animations are disabled. Accuracy and results are unchanged.'
    },
    de: {
        title: '🎯 3D-Dartflug', intro: 'Wähle, ob der Dart beim Flug zum Board sichtbar sein soll.',
        label: '3D-Dartfluganimation', enabled: 'Ein (Standard)', system: 'Systemeinstellung beachten',
        disabled: 'Aus', hint: 'Standardmäßig auch bei deaktivierten Systemanimationen aktiv. Treffer und Ergebnisse bleiben gleich.'
    },
    nl: {
        title: '🎯 3D-dartvlucht', intro: 'Kies of je de dart tijdens de vlucht naar het bord wilt zien.',
        label: '3D-dartvluchtanimatie', enabled: 'Aan (standaard)', system: 'Systeeminstelling volgen',
        disabled: 'Uit', hint: 'Standaard ook aan als systeemanimaties uitstaan. Nauwkeurigheid en uitslagen blijven gelijk.'
    }
};

function getDartFlightMotionPreference() {
    try {
        const stored = localStorage.getItem(DART_FLIGHT_MOTION_KEY);
        return DART_FLIGHT_MOTION_MODES.includes(stored) ? stored : dartFlightMotionFallback;
    } catch (_error) { return dartFlightMotionFallback; }
}

function shouldAnimateDartFlight(systemReducedMotion = false) {
    const preference = getDartFlightMotionPreference();
    return preference === 'enabled' || preference === 'system' && !systemReducedMotion;
}

function refreshDartFlightMotionUI() {
    if (typeof document === 'undefined') return;
    const copy = DART_FLIGHT_MOTION_TEXT[typeof currentLang === 'string' ? currentLang : 'pl'] || DART_FLIGHT_MOTION_TEXT.pl;
    for (const [key, id] of [['title', 'dart-flight-motion-title'], ['intro', 'dart-flight-motion-intro'],
        ['label', 'dart-flight-motion-label'], ['hint', 'dart-flight-motion-hint']]) {
        const element = document.getElementById(id);
        if (element) element.textContent = copy[key];
    }
    const select = document.getElementById('hub-dart-flight-motion');
    if (!select) return;
    select.value = getDartFlightMotionPreference();
    for (const option of select.options) option.textContent = copy[option.value];
}

function changeDartFlightMotion(value) {
    if (!DART_FLIGHT_MOTION_MODES.includes(value)) return false;
    dartFlightMotionFallback = value;
    try { localStorage.setItem(DART_FLIGHT_MOTION_KEY, value); }
    catch (_error) { /* The choice still works for this session. */ }
    refreshDartFlightMotionUI();
    return true;
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', refreshDartFlightMotionUI);
}
