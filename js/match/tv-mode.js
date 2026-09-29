/* Full-screen television presentation for interactive and spectator matches. */
(function () {
    'use strict';
    const screen = document.getElementById('screen-match');
    const button = document.getElementById('match-tv-toggle');
    const aiSpeedControl = document.getElementById('match-tv-ai-speed-control');
    const aiSpeedSelect = document.getElementById('match-tv-ai-speed');
    if (!screen || !button) return;
    const toolbar = screen.querySelector('.board-view-controls');
    const actions = screen.querySelector('.match-actions');
    const scoreboard = document.getElementById('broadcast-scoreboard');
    const statCard = document.getElementById('tv-stat-card');
    let layoutFrame = null;
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
    function layoutSidebar() {
        layoutFrame = null;
        // Portrait phones have their own stacked layout. In the side rail,
        // measure real heights: translations, zoom and stat rows can all grow.
        if (!active() || innerWidth <= 600 || !toolbar || !actions || !scoreboard || !statCard) return;
        const setSize = (name, value) => {
            const size = `${Math.max(0, value).toFixed(2)}px`;
            if (screen.style.getPropertyValue(name) !== size) screen.style.setProperty(name, size);
        };
        const gap = innerHeight <= 480 ? 4 : innerHeight <= 680 ? 8 : 12;
        const top = toolbar.getBoundingClientRect().bottom + gap;
        const scoreTop = scoreboard.getBoundingClientRect().top;
        const spectator = screen.classList.contains('tv-spectator');
        const actionsTop = scoreTop - gap - (spectator ? 0 : actions.offsetHeight);
        setSize('--tv-actions-bottom', innerHeight - scoreTop + gap);
        const cardBottom = spectator ? scoreTop - gap : actionsTop - gap;
        const available = Math.max(0, cardBottom - top);
        // Keep aiming usable even on a very short landscape screen. Only an
        // exceptionally tall card needs to scroll inside its own space.
        const aimingReserve = spectator ? 0 : Math.min(160, available * .55);
        setSize('--tv-stat-max-height', available - aimingReserve - (spectator ? 0 : gap));
        setSize('--tv-stat-bottom', innerHeight - cardBottom);
        const aimBottom = statCard.hidden ? actionsTop : cardBottom - statCard.offsetHeight;
        setSize('--tv-aim-top', top);
        setSize('--tv-aim-height', aimBottom - gap - top);
    }
    function scheduleSidebarLayout() {
        if (layoutFrame === null) layoutFrame = requestAnimationFrame(layoutSidebar);
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
        scheduleSidebarLayout();
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
        if (window.walkonFullscreen?.handlesNative()) return;
        if (document.fullscreenElement === screen) {
            nativeSession = true;
            if (!active()) setActive(true);
        } else if (nativeSession) {
            nativeSession = false; setActive(false);
        }
    });
    document.addEventListener('keydown', event => {
        if (window.walkonFullscreen?.handlesNative()) return;
        if (event.key === 'Escape' && active() && document.fullscreenElement !== screen) exit();
    });
    new MutationObserver(() => {
        if (!screen.classList.contains('active') && active()) exit();
        scheduleSidebarLayout();
    })
        .observe(screen, { attributes: true, attributeFilter: ['class'] });
    if (typeof ResizeObserver === 'function') {
        const sidebarObserver = new ResizeObserver(scheduleSidebarLayout);
        [toolbar, actions, scoreboard, statCard].filter(Boolean).forEach(node => sidebarObserver.observe(node));
    }
    if (statCard) new MutationObserver(scheduleSidebarLayout)
        .observe(statCard, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('resize', scheduleSidebarLayout);
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
