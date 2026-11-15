/* Analytics-only Basic Consent Mode. Advertising needs a separate certified CMP
 * before ads are enabled; AdSense ownership verification uses the meta/ads.txt.
 * This module touches only its preference key and this GA4 property's cookies.
 */
(function (window, document) {
    'use strict';
    if (window.dartsPrivacy) return;
    const measurementId = 'G-J5GF9EPVRM', disableKey = 'ga-disable-' + measurementId;
    const storageKey = 'dartscareer.analytics-consent.v1', lifetime = 180 * 24 * 60 * 60 * 1000;
    const policyPage = document.documentElement.dataset.privacyPage === 'true';
    const deny = { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' };
    let choice = null, banner = null, tagRequested = false, tagLoaded = false, tagFailed = false, pageViewSent = false;
    let saved = false, expiryTimer = null;
    window[disableKey] = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ...deny });

    function readChoice() {
        try {
            const value = JSON.parse(window.localStorage.getItem(storageKey));
            if (value?.version === 1 && ['granted','denied'].includes(value.analytics)
                && Number.isFinite(value.updatedAt) && value.updatedAt <= Date.now()
                && value.expiresAt === value.updatedAt + lifetime && value.expiresAt > Date.now()) return value;
        } catch (_error) { /* An unavailable preference store must not prevent play. */ }
        return null;
    }
    function cleanAnalyticsCookies() {
        const names = ['_ga', '_ga_' + measurementId.slice(2)];
        const hostname = window.location.hostname, parts = hostname.split('.');
        const domains = new Set(['', hostname, '.' + hostname]);
        for (let i = 1; i < parts.length - 1; i++) domains.add('.' + parts.slice(i).join('.'));
        for (const name of names) for (const domain of domains) {
            document.cookie = name + '=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/'
                + (domain ? '; Domain=' + domain : '') + '; SameSite=Lax';
        }
    }
    function sendPageView() {
        if (tagLoaded && !window[disableKey] && !pageViewSent) {
            pageViewSent = true; window.gtag('event','page_view',{send_to:measurementId});
        }
    }
    function loadAnalytics() {
        if (policyPage || window[disableKey]) return;
        if (tagRequested) { sendPageView(); return; }
        tagRequested = true;
        const script = document.createElement('script');script.id = 'darts-consented-analytics';script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
        script.onload = () => { tagLoaded = true;sendPageView(); };
        script.onerror = () => { tagFailed = true;window[disableKey] = true; };
        window.gtag('js',new Date());
        window.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,
            allow_ad_personalization_signals:false, cookie_flags:'SameSite=Lax;Secure'});
        document.head.appendChild(script);
    }
    function applyChoice() {
        const granted = choice?.analytics === 'granted';
        window[disableKey] = !granted || policyPage || tagFailed;
        window.gtag('consent','update',{...deny,analytics_storage:granted ? 'granted' : 'denied'});
        if (granted) loadAnalytics();
    }
    function scheduleExpiry() {
        if (expiryTimer !== null) window.clearTimeout(expiryTimer);
        expiryTimer = null;
        if (!choice) return;
        expiryTimer = window.setTimeout(() => {
            expiryTimer = null;
            if (!choice) return;
            if (Date.now() < choice.expiresAt) { scheduleExpiry();return; }
            choice = null;saved = false;applyChoice();cleanAnalyticsCookies();
            if (!policyPage) openSettings();
        },Math.min(choice.expiresAt - Date.now(),2147483647));
    }
    function decide(analytics) {
        if (!['granted','denied'].includes(analytics)) return false;
        const now = Date.now();choice = {version:1,analytics,updatedAt:now,expiresAt:now+lifetime};saved = false;
        try { window.localStorage.setItem(storageKey,JSON.stringify(choice));saved = true; } catch (_error) {}
        applyChoice();scheduleExpiry();if (analytics === 'denied') cleanAnalyticsCookies();
        if (banner) banner.hidden = true;
        return true;
    }
    const copy = {
        pl:{title:'Prywatność i statystyki',body:'Za Twoją zgodą używamy cookies Google Analytics do pomiaru odwiedzin. Dane o korzystaniu ze strony trafiają do Google. Odmowa nie ogranicza gry ani zapisu kariery.',
            accept:'Zezwól na statystyki',reject:'Tylko niezbędne',policy:'Polityka prywatności',
            hint:'Wybór pamiętamy przez 180 dni. Możesz go zmienić w ustawieniach prywatności w stopce. Zgoda na statystyki nie jest zgodą na reklamy.',
            granted:'Obecny wybór: statystyki włączone.',denied:'Obecny wybór: tylko niezbędne.'},
        en:{title:'Privacy and statistics',body:'With your permission, we use Google Analytics cookies to measure visits. Information about website use is sent to Google. Refusing does not limit the game or career saves.',
            accept:'Allow statistics',reject:'Necessary only',policy:'Privacy Policy',
            hint:'We remember your choice for 180 days. Change it in the footer privacy settings. Analytics consent does not grant advertising consent.',
            granted:'Current choice: statistics enabled.',denied:'Current choice: necessary only.'},
        de:{title:'Datenschutz und Statistik',body:'Mit deiner Einwilligung verwenden wir Google-Analytics-Cookies zur Besuchsmessung. Nutzungsdaten werden an Google gesendet. Eine Ablehnung schränkt das Spiel und Spielstände nicht ein.',
            accept:'Statistik erlauben',reject:'Nur notwendige',policy:'Datenschutzerklärung',
            hint:'Wir speichern deine Auswahl 180 Tage. Du kannst sie über die Datenschutzeinstellungen im Seitenfuß ändern. Die Einwilligung gilt nicht für Werbung.',
            granted:'Aktuelle Auswahl: Statistik aktiviert.',denied:'Aktuelle Auswahl: nur notwendige.'},
        nl:{title:'Privacy en statistieken',body:'Met je toestemming gebruiken we Google Analytics-cookies om bezoeken te meten. Gegevens over websitegebruik worden naar Google verzonden. Weigeren beperkt het spel en carrièreopslag niet.',
            accept:'Statistieken toestaan',reject:'Alleen noodzakelijk',policy:'Privacybeleid',
            hint:'We onthouden je keuze 180 dagen. Wijzig deze via de privacyinstellingen onderaan de pagina. Toestemming voor statistieken is geen toestemming voor advertenties.',
            granted:'Huidige keuze: statistieken ingeschakeld.',denied:'Huidige keuze: alleen noodzakelijk.'}
    };
    function language() {
        const lang = typeof currentLang === 'string' ? currentLang
            : new URL(window.location.href).searchParams.get('lang') || window.navigator?.language || document.documentElement.lang;
        return Object.hasOwn(copy,String(lang).slice(0,2)) ? String(lang).slice(0,2) : 'en';
    }
    function refresh() {
        if (!banner) return;
        const lang = language(), text = copy[lang];banner.lang = lang;
        banner.querySelectorAll('[data-privacy-copy]').forEach(el => { el.textContent = text[el.dataset.privacyCopy]; });
        const current = banner.querySelector('[data-privacy-current]');
        current.textContent = choice ? text[choice.analytics] : '';current.hidden = !choice;
        banner.querySelector('a').href = (policyPage ? 'index.html' : 'privacy-policy/index.html') + '?lang=' + (lang === 'pl' ? 'pl' : 'en');
    }
    function ensureBanner() {
        if (banner || !document.body) return;
        banner = document.createElement('section');banner.id = 'privacy-banner';banner.className = 'privacy-banner';
        banner.hidden = true;banner.tabIndex = -1;banner.setAttribute('role','region');banner.setAttribute('aria-labelledby','privacy-banner-title');
        banner.innerHTML = '<div class="privacy-banner-copy"><h2 id="privacy-banner-title" data-privacy-copy="title"></h2><p data-privacy-copy="body"></p><small data-privacy-copy="hint"></small><p data-privacy-current class="privacy-current"></p></div><div class="privacy-banner-actions"><button type="button" data-privacy-reject data-privacy-copy="reject"></button><button type="button" data-privacy-accept data-privacy-copy="accept"></button><a data-privacy-copy="policy"></a></div>';
        banner.querySelector('[data-privacy-accept]').addEventListener('click',() => decide('granted'));
        banner.querySelector('[data-privacy-reject]').addEventListener('click',() => decide('denied'));
        document.body.appendChild(banner);refresh();
    }
    function openSettings() {
        ensureBanner();refresh();if (banner) { banner.hidden = false;banner.focus(); }return false;
    }
    window.dartsPrivacy = Object.freeze({openSettings,refresh,
        getStatus:() => ({measurementId,status:tagFailed ? 'analytics-unavailable' : policyPage ? 'policy-page'
            : !choice ? 'awaiting-choice' : choice.analytics === 'denied' ? 'analytics-denied' : tagLoaded ? 'analytics-ready' : 'analytics-requested',
            purposes:{...deny,analytics_storage:choice?.analytics === 'granted' ? 'granted' : 'denied'},
            analyticsRequested:tagRequested,analyticsLoaded:tagLoaded,analyticsEnabled:!window[disableKey],
            awaitingChoice:!choice,preferenceSaved:saved,expiresAt:choice?.expiresAt ?? null,adsEnabled:false})});
    choice = readChoice();saved = !!choice;
    if (choice) { applyChoice();scheduleExpiry(); }
    function ready() { ensureBanner();if (!choice && !policyPage) openSettings(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
    window.addEventListener('storage',event => {
        if (event.key !== storageKey && event.key !== null) return;
        choice = readChoice();saved = !!choice;applyChoice();scheduleExpiry();
        if (choice?.analytics !== 'granted') cleanAnalyticsCookies();
        refresh();if (banner) banner.hidden = !!choice || policyPage;
    });
})(window,document);
