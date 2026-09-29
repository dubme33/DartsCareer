/* Temporary full-screen presentation of both entrances, independent of TV mode. */
(function () {
    'use strict';
    const screen = document.getElementById('screen-match');
    const stage = document.getElementById('career-walkon-stage');
    const button = document.getElementById('walkon-fullscreen-toggle');
    if (!screen || !stage || !button) return;
    let enabled = false;
    let requestPending = false;
    let nativeOwned = false;
    let closing = false;
    const visible = () => !stage.hidden && screen.classList.contains('active');
    const native = () => document.fullscreenElement === screen;
    // TV mode must not acquire the native session belonging to a walk-on,
    // including a request that resolves after the introduction was skipped.
    const handlesNative = () => enabled || requestPending || nativeOwned || closing;

    function refresh() {
        const active = enabled || native();
        const label = trWalkonCard(active ? 'exitFullscreen' : 'fullscreen');
        button.textContent = `${active ? '✕' : '⛶'} ${label}`;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(active));
        button.disabled = requestPending || closing || !visible();
    }
    function setPresentation(value) {
        enabled = value;
        screen.classList.toggle('walkon-fullscreen', value);
        document.body.classList.toggle('walkon-fullscreen-active', value);
        refresh();
    }
    async function exit() {
        setPresentation(false);
        if (closing) return;
        if (nativeOwned && native() && document.exitFullscreen) {
            closing = true;
            refresh();
            try { await document.exitFullscreen(); }
            catch (_error) { /* Browser controls can still leave native full screen. */ }
            finally { nativeOwned = native(); closing = false; }
        } else if (!native()) nativeOwned = false;
        refresh();
    }
    async function enter() {
        if (!visible() || requestPending || closing) return false;
        setPresentation(true);
        // Keep an existing ancestor's full-screen session; only close a native
        // session requested by this control when the introductions finish.
        if (!document.fullscreenElement && screen.requestFullscreen) {
            requestPending = true;
            refresh();
            try {
                await screen.requestFullscreen({ navigationUI: 'hide' });
                nativeOwned = native();
            } catch (_error) { /* The presentation still fills the browser window. */ }
            finally { requestPending = false; }
            if (!enabled || !visible()) await exit();
        }
        refresh();
        return enabled;
    }
    async function toggle() {
        if (requestPending || closing || !visible()) return;
        if (enabled || nativeOwned) return exit();
        if (native()) {
            // Explicitly closing a TV full-screen presentation uses its owner.
            if (window.matchTVMode?.getState().active) return window.matchTVMode.exit();
            if (document.exitFullscreen) {
                try { await document.exitFullscreen(); } catch (_error) { /* Keep the current layout. */ }
            }
            return refresh();
        }
        return enter();
    }
    button.addEventListener('click', toggle);
    document.addEventListener('fullscreenchange', () => {
        if (enabled && native()) nativeOwned = true;
        else if (nativeOwned && !native()) {
            nativeOwned = false;
            setPresentation(false);
        }
        refresh();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && handlesNative()) exit();
    });
    const visibility = new MutationObserver(() => {
        if (!visible() && handlesNative()) exit();
        refresh();
    });
    visibility.observe(stage, { attributes: true, attributeFilter: ['hidden'] });
    visibility.observe(screen, { attributes: true, attributeFilter: ['class'] });
    window.walkonFullscreen = Object.freeze({ enter, exit, toggle, refresh, handlesNative,
        getState: () => ({ active: enabled, native: native(), pending: requestPending || closing }) });
    refresh();
})();
