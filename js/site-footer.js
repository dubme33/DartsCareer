document.getElementById('site-footer-privacy')?.addEventListener('click', event => {
    const language = typeof currentLang === 'string' && currentLang === 'pl' ? 'pl' : 'en';
    event.currentTarget.href = 'privacy-policy/index.html?lang=' + language;
});

document.getElementById('site-footer-terms')?.addEventListener('click', event => {
    const language = typeof currentLang === 'string' && currentLang === 'pl' ? 'pl' : 'en';
    event.currentTarget.href = 'terms-of-use/index.html?lang=' + language;
});

document.getElementById('site-footer-contact')?.addEventListener('click', event => {
    const language = typeof currentLang === 'string' && currentLang === 'pl' ? 'pl' : 'en';
    event.currentTarget.href = 'contact/index.html?lang=' + language;
});
