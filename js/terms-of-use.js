(function () {
    'use strict';
    function setLanguage(language, retainScroll) {
        const lang = language === 'pl' ? 'pl' : 'en';
        const previous = document.querySelector('article:not([hidden])');
        const sections = previous ? [...previous.querySelectorAll('section')] : [];
        const anchor = sections.find(section => section.getBoundingClientRect().bottom > 135);
        const offset = anchor?.getBoundingClientRect().top;
        document.querySelectorAll('article').forEach(article => { article.hidden = article.lang !== lang; });
        document.documentElement.lang = lang;
        document.title = (lang === 'pl' ? 'Regulamin korzystania' : 'Terms of Use') + ' — Darts Career';
        document.querySelectorAll('[data-en][data-pl]').forEach(element => { element.textContent = element.dataset[lang]; });
        document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === lang)); });
        document.querySelectorAll('[data-privacy-link]').forEach(link => { link.href = '../privacy-policy/index.html?lang=' + lang; });
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        if (url.hash.startsWith('#terms-')) url.hash = url.hash.replace(/terms-(?:en|pl)-/, 'terms-' + lang + '-');
        window.history.replaceState(null, '', url);
        if (retainScroll && anchor) {
            const target = document.getElementById('terms-' + lang + '-' + anchor.dataset.section);
            window.scrollBy(0, target.getBoundingClientRect().top - offset);
        }
    }
    document.querySelectorAll('[data-language]').forEach(button => {
        button.addEventListener('click', () => setLanguage(button.dataset.language, true));
    });
    setLanguage(new URL(window.location.href).searchParams.get('lang'), false);
})();
