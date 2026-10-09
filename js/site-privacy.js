/* Basic Consent Mode adapter for Google's published Privacy & messaging CMP.
 * Load this BEFORE the real CMP tag. The CMP alone collects/stores choices and
 * sends consent updates; this adapter only gates Analytics using its purpose API.
 * No publisher ID, CMP loader, ad tag, own consent banner or game storage here.
 */
(function (window, document) {
    'use strict';
    if (window.dartsPrivacy) return;
    const measurementId = 'G-J5GF9EPVRM';
    const disableKey = 'ga-disable-' + measurementId;
    const purposeFields = {
        analytics_storage: 'analyticsStoragePurposeConsentStatus',
        ad_storage: 'adStoragePurposeConsentStatus',
        ad_user_data: 'adUserDataPurposeConsentStatus',
        ad_personalization: 'adPersonalizationPurposeConsentStatus'
    };
    const denied = () => Object.fromEntries(Object.keys(purposeFields).map(key => [key, 'denied']));
    let purposes = denied(), apiReady = false, listenerRegistered = false, listenerFailed = false;
    let tagRequested = false, tagLoaded = false, tagFailed = false, pageViewSent = false;
    let gdprApplies = null, purposeStatuses = {};
    let waitingForChoice = false, refreshTimer = null, status = 'awaiting-cmp';
    let settingsTimer = null, revocationPending = false, revocationUiSeen = false;
    window[disableKey] = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', denied());
    window.googlefc = window.googlefc || {};
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

    function suspendAnalytics() { window[disableKey] = true; }
    function sendPageView() {
        if (tagLoaded && !window[disableKey] && !pageViewSent) {
            pageViewSent = true;
            window.gtag('event', 'page_view', { send_to: measurementId });
        }
    }
    function loadAnalytics() {
        if (tagRequested) { sendPageView(); return; }
        tagRequested = true;
        const script = document.createElement('script');
        script.id = 'darts-consented-analytics';
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
        script.onload = () => { tagLoaded = true; sendPageView(); };
        script.onerror = () => { tagFailed = true; status = 'analytics-unavailable'; suspendAnalytics(); };
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false
        });
        document.head.appendChild(script);
    }
    function purposeStatus(cmp, name) {
        // Google's enum reference uses short keys; its sample uses prefixed keys.
        // Resolve the actual enum, never treat a missing API or a numeric guess as consent.
        const values = cmp.ConsentModePurposeStatusEnum;
        return values?.[name] ?? values?.['CONSENT_MODE_PURPOSE_STATUS_' + name];
    }
    function readCmpPurposes() {
        if (waitingForChoice || listenerFailed) { suspendAnalytics(); return; }
        try {
            const cmp = window.googlefc;
            if (typeof cmp.getGoogleConsentModeValues !== 'function') { status = 'cmp-unavailable'; suspendAnalytics(); return; }
            const values = cmp.getGoogleConsentModeValues();
            const granted = purposeStatus(cmp, 'GRANTED');
            // UNKNOWN, DENIED, NOT_APPLICABLE and NOT_CONFIGURED all fail closed.
            // A configured, explicit analytics grant is required independently of ads.
            purposeStatuses = Object.fromEntries(Object.entries(purposeFields).map(([key, field]) =>
                [key, values?.[field] ?? null]));
            purposes = Object.fromEntries(Object.entries(purposeStatuses).map(([key, value]) =>
                [key, typeof granted === 'number' && granted > 0 && value === granted ? 'granted' : 'denied']));
            const inapplicable = purposeStatus(cmp, 'NOT_APPLICABLE');
            status = purposes.analytics_storage !== 'granted' && (gdprApplies === false ||
                (inapplicable !== undefined && purposeStatuses.analytics_storage === inapplicable))
                ? 'regional-policy-required' : 'cmp-ready';
            if (tagFailed) status = 'analytics-unavailable';
            window[disableKey] = purposes.analytics_storage !== 'granted' || tagFailed;
            if (!window[disableKey]) loadAnalytics();
        } catch (_error) { purposes = denied(); status = 'cmp-unavailable'; suspendAnalytics(); }
    }
    function queuePurposeRead() {
        window.googlefc.callbackQueue.push({ CONSENT_MODE_DATA_READY: readCmpPurposes });
    }
    function registerConsentListener() {
        apiReady = true;
        if (listenerRegistered || typeof window.__tcfapi !== 'function') return;
        listenerRegistered = true;
        try { window.__tcfapi('addEventListener', 2, (data, success) => {
            if (!success || data?.cmpStatus === 'error') {
                listenerFailed = true;
                purposes = denied(); status = 'cmp-unavailable'; suspendAnalytics(); return;
            }
            listenerFailed = false;
            if (typeof data?.gdprApplies === 'boolean') gdprApplies = data.gdprApplies;
            if (data?.eventStatus === 'cmpuishown') {
                waitingForChoice = true;
                revocationUiSeen = true;
                if (settingsTimer !== null) window.clearTimeout(settingsTimer);
                settingsTimer = null;
                suspendAnalytics();
                return;
            }
            if (data?.eventStatus !== 'useractioncomplete' && data?.eventStatus !== 'tcloaded' && gdprApplies !== false) return;
            waitingForChoice = false;
            revocationPending = false;
            if (settingsTimer !== null) window.clearTimeout(settingsTimer);
            settingsTimer = null;
            suspendAnalytics();
            // Let the CMP finish updating its own Consent Mode purpose values.
            // No TCF-purpose guessing and no competing gtag consent updates.
            if (refreshTimer !== null) window.clearTimeout(refreshTimer);
            refreshTimer = window.setTimeout(() => { refreshTimer = null; queuePurposeRead(); }, 0);
        }); } catch (_error) {
            listenerRegistered = false;
            listenerFailed = true;
            purposes = denied(); status = 'cmp-unavailable'; suspendAnalytics();
        }
    }
    window.googlefc.callbackQueue.push({ CONSENT_API_READY: registerConsentListener });
    queuePurposeRead();

    function language() {
        const gameLanguage = typeof currentLang === 'string' ? currentLang : document.documentElement.lang;
        return gameLanguage === 'pl' ? 'pl' : 'en';
    }
    const copy = {
        pl: {
            title: 'Ustawienia prywatności i cookies', close: 'Zamknij', policy: 'Polityka prywatności',
            unavailable: 'Panel zgód Google jest obecnie niedostępny. Opcjonalne śledzenie Google Analytics jest w tej sesji wstrzymane.',
            regional: 'Europejski panel zgód Google nie jest dostępny dla Twojego regionu. Brak tego komunikatu nie oznacza zgody na śledzenie. Opcjonalne śledzenie Google Analytics jest w tej sesji wstrzymane.',
            protected: 'Ustawienia zgód nie usuwają zapisów kariery, modów ani ustawień gry. Lokalne dane niezbędne do rozgrywki pozostają na Twoim urządzeniu.',
            contact: 'Pytania dotyczące prywatności: dartscareer@gmail.com.'
        },
        en: {
            title: 'Privacy & Cookie Settings', close: 'Close', policy: 'Privacy Policy',
            unavailable: 'The Google consent panel is currently unavailable. Optional Google Analytics tracking is paused for this session.',
            regional: 'The European Google consent panel is not available in your region. The absence of that message does not mean consent to tracking. Optional Google Analytics tracking is paused for this session.',
            protected: 'Consent settings do not delete career saves, mods or game settings. Local data required to play remains on your device.',
            contact: 'Privacy enquiries: dartscareer@gmail.com.'
        }
    };
    function showUnavailable() {
        let dialog = document.getElementById('privacy-settings-status');
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.id = 'privacy-settings-status';
            dialog.className = 'privacy-settings-dialog';
            dialog.setAttribute('aria-labelledby', 'privacy-settings-title');
            const heading = document.createElement('h2'); heading.id = 'privacy-settings-title';
            dialog.appendChild(heading);
            for (const key of ['unavailable', 'protected', 'contact']) {
                const paragraph = document.createElement('p'); paragraph.dataset.privacyCopy = key; dialog.appendChild(paragraph);
            }
            const link = document.createElement('a'); link.dataset.privacyCopy = 'policy'; dialog.appendChild(link);
            const form = document.createElement('form'); form.method = 'dialog';
            const button = document.createElement('button'); button.type = 'submit'; button.dataset.privacyCopy = 'close';
            form.appendChild(button); dialog.appendChild(form); document.body.appendChild(dialog);
            dialog.addEventListener('click', event => {
                if (event.target !== dialog) return;
                const bounds = dialog.getBoundingClientRect();
                if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
            });
        }
        const lang = language(), text = copy[lang];
        dialog.lang = lang;
        dialog.querySelector('h2').textContent = text.title;
        dialog.querySelectorAll('[data-privacy-copy]').forEach(element => { element.textContent = text[element.dataset.privacyCopy]; });
        if (status === 'regional-policy-required') dialog.querySelector('[data-privacy-copy="unavailable"]').textContent = text.regional;
        dialog.querySelector('a').href = (document.documentElement.dataset.privacyPage === 'true' ? 'index.html' : 'privacy-policy/index.html') + '?lang=' + lang;
        if (!dialog.open) dialog.showModal();
    }
    function openSettings() {
        suspendAnalytics();
        if (revocationPending) return false;
        const cmp = window.googlefc;
        const inapplicable = purposeStatus(cmp, 'NOT_APPLICABLE');
        if (gdprApplies === false || (inapplicable !== undefined && purposeStatuses.analytics_storage === inapplicable)) {
            status = 'regional-policy-required'; showUnavailable(); return false;
        }
        if (!apiReady || typeof cmp.showRevocationMessage !== 'function' || typeof cmp.callbackQueue?.push !== 'function') {
            status = 'cmp-unavailable'; showUnavailable(); return false;
        }
        waitingForChoice = true;
        revocationPending = true;
        revocationUiSeen = false;
        function unavailableSettings() {
            revocationPending = false; waitingForChoice = false;
            status = 'cmp-unavailable'; showUnavailable();
        }
        // API calls must run through the official callback queue, after readiness.
        cmp.callbackQueue.push(() => {
            if (!revocationPending) return;
            try {
                if (typeof window.googlefc.showRevocationMessage !== 'function') throw new Error('CMP unavailable');
                window.googlefc.showRevocationMessage();
            } catch (_error) { unavailableSettings(); }
        });
        // An available API is not proof that Google can serve the account's panel.
        // If its queue/message never opens, keep GA paused and explain the failure.
        if (revocationPending && !revocationUiSeen) settingsTimer = window.setTimeout(() => {
            settingsTimer = null;
            if (revocationPending && !revocationUiSeen) unavailableSettings();
        }, 6000);
        return false;
    }
    window.dartsPrivacy = Object.freeze({
        openSettings,
        getStatus: () => ({ measurementId, status, apiReady, gdprApplies, purposes: { ...purposes },
            purposeStatuses: { ...purposeStatuses }, outsideEuropePolicy: 'explicit-analytics-consent',
            analyticsRequested: tagRequested, analyticsLoaded: tagLoaded,
            analyticsEnabled: !window[disableKey], awaitingChoice: waitingForChoice, adsEnabled: false })
    });
})(window, document);
