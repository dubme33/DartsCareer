// Presentation only. Opening help never saves or changes the career.
const PUBLIC_INTRO_COPY = Object.freeze({
    en: {
        title: 'Build your darts career',
        description: 'DartsCareer is a free browser darts career simulator. Create a player or choose one from the database. Enter tournaments, develop skills and climb rankings across seasons as AI rivals develop too. Use editors, customisation and community mods.',
        existing: 'Choose a player', custom: 'Create a player', guide: 'How to Play',
        newTab: 'opens in a new tab',
        featureCareer: 'A career across seasons', featureAI: 'AI rivals that develop', featureEditors: 'Editors and customisation',
        changelogDescription: "Tour Cards, women's and youth events, editors and match viewing.",
        showMore: 'Show more', showLess: 'Show less', featuresLabel: 'Game features', startLabel: 'Start and help', historyLabel: 'Full changelog'
    },
    pl: {
        title: 'Zbuduj swoją karierę dartera',
        description: 'DartsCareer to darmowy symulator kariery dartera w przeglądarce. Stwórz zawodnika lub wybierz postać z bazy. Graj w turniejach, rozwijaj umiejętności i awansuj w rankingach przez wiele sezonów. Rozwijają się też rywale AI. Dostępne są edytory, personalizacja i mody społeczności.',
        existing: 'Wybierz zawodnika', custom: 'Stwórz zawodnika', guide: 'Jak grać',
        newTab: 'otwiera się w nowej karcie',
        featureCareer: 'Wielosezonowa kariera', featureAI: 'Rozwój rywali AI', featureEditors: 'Edytory i personalizacja',
        changelogDescription: 'Karty PDC, rozgrywki kobiet i młodzieży, edytory oraz oglądanie meczów.',
        showMore: 'Pokaż więcej', showLess: 'Pokaż mniej', featuresLabel: 'Możliwości gry', startLabel: 'Rozpocznij grę i pomoc', historyLabel: 'Pełna historia zmian'
    },
    de: {
        title: 'Gestalte deine Dartkarriere',
        description: 'DartsCareer ist eine kostenlose Dartkarriere-Simulation im Browser. Erstelle einen Spieler oder wähle einen aus der Datenbank. Spiele Turniere, entwickle Fähigkeiten und steige über mehrere Saisons in den Ranglisten auf. Auch KI-Rivalen entwickeln sich. Nutze Editoren, Anpassungen und Community-Mods.',
        existing: 'Spieler wählen', custom: 'Spieler erstellen', guide: 'Spielanleitung',
        newTab: 'öffnet sich in einem neuen Tab',
        featureCareer: 'Eine Karriere über viele Saisons', featureAI: 'KI-Rivalen entwickeln sich', featureEditors: 'Editoren und Anpassungen',
        changelogDescription: 'Tour Cards, Frauen- und Nachwuchsturniere, Editoren und Matches zum Zuschauen.',
        showMore: 'Mehr anzeigen', showLess: 'Weniger anzeigen', featuresLabel: 'Spielfunktionen', startLabel: 'Spielstart und Hilfe', historyLabel: 'Vollständiger Änderungsverlauf'
    },
    nl: {
        title: 'Bouw je dartscarrière op',
        description: 'DartsCareer is een gratis dartscarrièresimulator in je browser. Maak een speler of kies iemand uit de database. Speel toernooien, ontwikkel vaardigheden en klim seizoenenlang op de ranglijsten. Ook AI-tegenstanders groeien. Gebruik editors, personalisatie en communitymods.',
        existing: 'Kies een speler', custom: 'Maak een speler', guide: 'Speluitleg',
        newTab: 'opent in een nieuw tabblad',
        featureCareer: 'Een carrière over vele seizoenen', featureAI: 'AI-tegenstanders groeien', featureEditors: 'Editors en personalisatie',
        changelogDescription: 'Tour Cards, vrouwen- en jeugdtoernooien, editors en wedstrijden bekijken.',
        showMore: 'Meer tonen', showLess: 'Minder tonen', featuresLabel: 'Spelmogelijkheden', startLabel: 'Beginnen en hulp', historyLabel: 'Volledige wijzigingsgeschiedenis'
    }
});

const PUBLIC_GUIDE_PATHS = Object.freeze({
    en: 'en/how-to-play/', pl: 'pl/jak-grac/',
    de: 'de/spielanleitung/', nl: 'nl/handleiding/'
});

function refreshPublicIntroTranslations() {
    const language = typeof currentLang === 'string' && PUBLIC_INTRO_COPY[currentLang] ? currentLang : 'en';
    const copy = PUBLIC_INTRO_COPY[language];
    document.documentElement.lang = language;
    for (const [id, key] of Object.entries({
        'public-intro-title': 'title', 'public-intro-description': 'description',
        'public-intro-existing': 'existing', 'public-intro-custom': 'custom',
        'public-intro-feature-career': 'featureCareer', 'public-intro-feature-ai': 'featureAI',
        'public-intro-feature-editors': 'featureEditors', 'start-changelog-description': 'changelogDescription',
        'start-changelog-more': 'showMore', 'start-changelog-less': 'showLess'
    })) {
        const element = document.getElementById(id);
        if (element) element.textContent = copy[key];
    }
    for (const id of ['public-intro-guide', 'site-footer-guide']) {
        const link = document.getElementById(id);
        if (!link) continue;
        link.textContent = copy.guide;
        link.href = PUBLIC_GUIDE_PATHS[language];
        link.hreflang = language;
        link.setAttribute('aria-label', `${copy.guide} — ${copy.newTab}`);
    }
    for (const [id, key] of Object.entries({'public-intro-features':'featuresLabel',
        'public-intro-navigation':'startLabel','start-changelog-history':'historyLabel'})) {
        document.getElementById(id)?.setAttribute('aria-label', copy[key]);
    }
    refreshStartPlayerName();
}

function refreshStartPlayerName() {
    const select = document.getElementById('existing-player-select');
    const name = document.getElementById('start-existing-player-name');
    if (!select || !name) return;
    const option = select.selectedOptions?.[0];
    const candidate = typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)
        ? pdcPlayers.find(p => p?.id === select.value) : null;
    name.textContent = select.value ? (candidate?.name || option?.textContent || '') : '';
    select.title = option?.textContent || '';
}

function initializePublicStartPresentation() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const details = document.getElementById('start-changelog-details');
    if (details) {
        const mobile = window.matchMedia('(max-width: 900px)');
        let mobileOpen = false;
        details.addEventListener('toggle', () => { if (mobile.matches) mobileOpen = details.open; });
        const synchronize = () => { details.open = mobile.matches ? mobileOpen : true; };
        if (typeof mobile.addEventListener === 'function') mobile.addEventListener('change', synchronize);
        else if (typeof mobile.addListener === 'function') mobile.addListener(synchronize);
        synchronize();
    }
    document.getElementById('existing-player-select')?.addEventListener('change', refreshStartPlayerName);
    const preview = document.getElementById('existing-player-preview');
    if (preview && typeof MutationObserver === 'function') {
        new MutationObserver(refreshStartPlayerName).observe(preview, {childList:true, characterData:true, subtree:true});
    }
    refreshStartPlayerName();
}
refreshPublicIntroTranslations();
initializePublicStartPresentation();
