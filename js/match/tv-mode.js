/* Full-screen television presentation for interactive and spectator matches. */
(function () {
    'use strict';
    const screen = document.getElementById('screen-match');
    const button = document.getElementById('match-tv-toggle');
    const aiSpeedControl = document.getElementById('match-tv-ai-speed-control');
    const aiSpeedSelect = document.getElementById('match-tv-ai-speed');
    if (!screen || !button) return;
    const aiSpeeds = Object.freeze([.5, .75, 1]);
    const aiSpeedKey = 'dartsCareer.tvAiSpeed';
    const copy = {
        pl: { open: 'Tryb telewizyjny', close: 'Zamknij tryb TV', label: 'Pełnoekranowy tryb telewizyjny', aiSpeed: 'Tempo rzutów AI' },
        en: { open: 'TV mode', close: 'Close TV mode', label: 'Full-screen television mode', aiSpeed: 'AI throw speed' },
        de: { open: 'TV-Modus', close: 'TV-Modus schließen', label: 'Vollbild-TV-Modus', aiSpeed: 'KI-Wurftempo' },
        nl: { open: 'TV-modus', close: 'TV-modus sluiten', label: 'Televisiemodus op volledig scherm', aiSpeed: 'AI-werptempo' }
    };
    let nativeSession = false;
    let aiSpeed = readAiSpeed();
    function active() { return screen.classList.contains('match-tv-mode'); }
    function labels() { return copy[typeof currentLang === 'string' ? currentLang : 'pl'] || copy.en; }
    function readAiSpeed() {
        try {
            const stored = Number(localStorage.getItem(aiSpeedKey));
            return aiSpeeds.includes(stored) ? stored : .75;
        } catch (_error) { return .75; }
    }
    function writeAiSpeed(value) {
        try { localStorage.setItem(aiSpeedKey, String(value)); } catch (_error) { /* A private session may block storage. */ }
    }
    function setAiSpeed(value) {
        const parsed = Number(value);
        if (!aiSpeeds.includes(parsed)) return aiSpeed;
        aiSpeed = parsed;
        writeAiSpeed(aiSpeed);
        refresh();
        return aiSpeed;
    }
    function aiThrowDelay(normalDelay) {
        const delay = Math.max(0, Number(normalDelay) || 0);
        if (!active() || currentMatch?.isSpectator) return delay;
        return Math.max(25, Math.round(delay / aiSpeed));
    }
    function refresh() {
        const text = labels(), enabled = active();
        button.textContent = enabled ? `✕ ${text.close}` : `📺 ${text.open}`;
        button.setAttribute('aria-pressed', String(enabled));
        button.setAttribute('aria-label', enabled ? text.close : text.label);
        const spectator = Boolean(enabled && typeof currentMatch !== 'undefined' && currentMatch?.isSpectator);
        screen.classList.toggle('tv-spectator', spectator);
        if (aiSpeedControl) {
            aiSpeedControl.hidden = !enabled || spectator;
            aiSpeedControl.title = text.aiSpeed;
        }
        if (aiSpeedSelect) {
            aiSpeedSelect.value = String(aiSpeed);
            aiSpeedSelect.setAttribute('aria-label', text.aiSpeed);
        }
    }
    function resizeBoard() {
        window.dispatchEvent(new Event('resize'));
        if (typeof drawDartboard === 'function') drawDartboard();
    }
    function setActive(enabled) {
        screen.classList.toggle('match-tv-mode', enabled);
        document.body.classList.toggle('match-tv-active', enabled);
        refresh();
        window.matchTVDirector?.onMode(enabled);
        requestAnimationFrame(() => requestAnimationFrame(resizeBoard));
    }
    async function enter(requestNative = true) {
        if (!currentMatch || active()) return active();
        setActive(true);
        if (requestNative && screen.requestFullscreen) {
            try {
                await screen.requestFullscreen({ navigationUI: 'hide' });
                nativeSession = document.fullscreenElement === screen;
            } catch (_error) { nativeSession = false; }
        }
        return true;
    }
    async function exit() {
        if (document.fullscreenElement === screen && document.exitFullscreen) {
            try { await document.exitFullscreen(); } catch (_error) { /* CSS mode can still close. */ }
        }
        nativeSession = false; setActive(false); return false;
    }
    async function toggle() { return active() ? exit() : enter(true); }
    button.addEventListener('click', toggle);
    aiSpeedSelect?.addEventListener('change', () => setAiSpeed(aiSpeedSelect.value));
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement === screen) {
            nativeSession = true;
            if (!active()) setActive(true);
        } else if (nativeSession) {
            nativeSession = false; setActive(false);
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && active() && document.fullscreenElement !== screen) exit();
    });
    new MutationObserver(() => { if (!screen.classList.contains('active') && active()) exit(); })
        .observe(screen, { attributes: true, attributeFilter: ['class'] });
    const refreshBoardLabels = window.refreshMatchBoardViewTranslations;
    window.refreshMatchBoardViewTranslations = function () {
        if (typeof refreshBoardLabels === 'function') refreshBoardLabels();
        refresh();
    };
    window.getMatchTVAiThrowDelay = aiThrowDelay;
    window.setMatchTVAiSpeed = setAiSpeed;
    window.matchTVMode = Object.freeze({ enter, exit, toggle, refresh, setAiSpeed, getAiSpeed: () => aiSpeed,
        getState: () => ({ active: active(), native: document.fullscreenElement === screen,
            spectator: screen.classList.contains('tv-spectator'), aiSpeed }) });
    refresh();
})();
