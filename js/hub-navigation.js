const HUB_NAVIGATION_CATEGORIES = Object.freeze(['career', 'calendar', 'rankings', 'player', 'more']);

const HUB_NAVIGATION_TEXT = {
    pl: {
        eyebrow: 'CENTRUM KARIERY', title: '🧭 Co teraz?', summary: 'Najważniejsze informacje i jedna rekomendowana akcja na dziś.',
        nextEvent: 'Następny turniej', qualification: 'Kwalifikacja', readiness: 'Gotowość', sponsorGoal: 'Cel sponsora',
        noEvent: 'Brak kolejnego wydarzenia', seasonComplete: 'Sprawdź kalendarz nowego sezonu.', today: 'Dzisiaj', tomorrow: 'Jutro', inDays: 'Za {days} dni',
        noQualification: 'Brak aktywnej prognozy', noQualificationMeta: 'Pełne warunki znajdziesz w sekcji Kalendarz.',
        qualificationConfirmed: 'Awans zapewniony', qualificationIn: 'Obecnie w stawce', qualificationPending: 'Potrzebny kwalifikator', qualificationReserve: 'Lista rezerwowa', qualificationOut: 'Poza stawką',
        energy: 'Energia {energy}%', preparation: 'Przygotowanie {preparation}/100', readyHigh: 'Wysoka gotowość meczowa', readyMedium: 'Warto zadbać o regenerację', readyLow: 'Najpierw odpocznij',
        noSponsor: 'Brak aktywnego sponsora', noSponsorMeta: 'Podpisz umowę, aby otrzymywać wypłaty i cele.', noSponsorGoal: 'Brak celu sezonowego', noSponsorGoalMeta: 'Aktywne umowy nie mają obecnie dodatkowego celu.',
        recommendation: 'REKOMENDOWANA AKCJA',
        actionTournamentTitle: 'Zagraj dzisiejszy turniej', actionTournamentDesc: 'Wydarzenie jest gotowe. Nie przesuwaj dnia przed rozegraniem lub pominięciem turnieju.', actionTournamentButton: 'Przejdź do turnieju', actionTournamentSkipButton: 'Odpuść (symuluj)',
        actionTutorialTitle: 'Poznaj pierwsze kroki', actionTutorialDesc: 'Samouczek prowadzi przez hub, trening, kalendarz i pierwszy mecz. Postęp: {done}/{total}.', actionTutorialButton: 'Otwórz samouczek',
        actionMailboxTitle: 'Przeczytaj nowe wiadomości', actionMailboxDesc: 'Masz {count} nieprzeczytanych wiadomości lub zaproszeń.', actionMailboxButton: 'Otwórz skrzynkę',
        actionRestTitle: 'Zregeneruj energię', actionRestDesc: 'Niska energia osłabia trening i mecze. Przesuń dzień bez treningu.', actionRestButton: 'Odpocznij 1 dzień',
        actionPreparationTitle: 'Popraw przygotowanie', actionPreparationDesc: 'Ważne wydarzenie jest blisko, a przygotowanie jest niskie. Sprawdź bazę i podróż.', actionPreparationButton: 'Baza i podróże',
        actionTrainingTitle: 'Wykorzystaj trening', actionTrainingDesc: 'Masz energię i wolną sesję treningową w tym tygodniu.', actionTrainingButton: 'Przejdź do treningu',
        actionSponsorTitle: 'Znajdź sponsora', actionSponsorDesc: 'Nie masz aktywnej umowy. Sprawdź dostępne oferty i premie sezonowe.', actionSponsorButton: 'Otwórz sponsorów',
        actionPlanningTitle: 'Sprawdź drogę kwalifikacji', actionPlanningDesc: 'Najbliższa duża impreza nadal wymaga awansu lub poprawy rankingu.', actionPlanningButton: 'Kwalifikacje i OOM',
        actionCalendarTitle: 'Zaplanuj kolejne dni', actionCalendarDesc: 'Sprawdź terminy, zanim zdecydujesz o treningu lub odpoczynku.', actionCalendarButton: 'Otwórz kalendarz',
        navTitle: 'SEKCJE HUBA', communityTitle: 'Społeczność', communityDesc: 'Bądź z nami na bieżąco i poznaj osoby wspierające grę.',
        categories: {
            career: ['Kariera', 'Najważniejsze działania, wiadomości i historia kariery.'],
            calendar: ['Kalendarz', 'Turnieje, terminarz oraz warunki kwalifikacji.'],
            rankings: ['Rankingi', 'Baza graczy, rywale, archiwum i osiągnięcia.'],
            player: ['Zawodnik', 'Trening, sztab, baza, personalizacja i sprzęt.'],
            more: ['Więcej', 'Zapisy, mody, społeczność i pozostałe opcje.']
        }
    },
    en: {
        eyebrow: 'CAREER CENTRE', title: '🧭 What now?', summary: 'The key information and one recommended action for today.',
        nextEvent: 'Next tournament', qualification: 'Qualification', readiness: 'Readiness', sponsorGoal: 'Sponsor goal',
        noEvent: 'No upcoming event', seasonComplete: 'Check the new season calendar.', today: 'Today', tomorrow: 'Tomorrow', inDays: 'In {days} days',
        noQualification: 'No active projection', noQualificationMeta: 'Full conditions are available under Calendar.',
        qualificationConfirmed: 'Qualification secured', qualificationIn: 'Currently in the field', qualificationPending: 'Qualifier required', qualificationReserve: 'Reserve list', qualificationOut: 'Outside the field',
        energy: 'Energy {energy}%', preparation: 'Preparation {preparation}/100', readyHigh: 'High match readiness', readyMedium: 'Recovery would help', readyLow: 'Rest first',
        noSponsor: 'No active sponsor', noSponsorMeta: 'Sign a deal to receive income and goals.', noSponsorGoal: 'No seasonal goal', noSponsorGoalMeta: 'Your active deals currently have no extra target.',
        recommendation: 'RECOMMENDED ACTION',
        actionTournamentTitle: "Play today's tournament", actionTournamentDesc: 'The event is ready. Do not advance the day before playing or skipping it.', actionTournamentButton: 'Go to tournament', actionTournamentSkipButton: 'Skip (simulate)',
        actionTutorialTitle: 'Learn the first steps', actionTutorialDesc: 'The tutorial covers the hub, training, calendar and your first match. Progress: {done}/{total}.', actionTutorialButton: 'Open tutorial',
        actionMailboxTitle: 'Read new messages', actionMailboxDesc: 'You have {count} unread messages or invitations.', actionMailboxButton: 'Open mailbox',
        actionRestTitle: 'Recover energy', actionRestDesc: 'Low energy weakens training and matches. Advance a day without training.', actionRestButton: 'Rest for 1 day',
        actionPreparationTitle: 'Improve preparation', actionPreparationDesc: 'An important event is close and preparation is low. Check your base and travel.', actionPreparationButton: 'Base & travel',
        actionTrainingTitle: 'Use a training session', actionTrainingDesc: 'You have enough energy and a free training session this week.', actionTrainingButton: 'Go to training',
        actionSponsorTitle: 'Find a sponsor', actionSponsorDesc: 'You have no active deal. Review available offers and seasonal bonuses.', actionSponsorButton: 'Open sponsors',
        actionPlanningTitle: 'Check your qualification route', actionPlanningDesc: 'The next major event still requires qualification or a better ranking.', actionPlanningButton: 'Qualification & OOM',
        actionCalendarTitle: 'Plan the next few days', actionCalendarDesc: 'Check event dates before choosing training or rest.', actionCalendarButton: 'Open calendar',
        navTitle: 'HUB SECTIONS', communityTitle: 'Community', communityDesc: 'Stay connected and meet the people supporting the game.',
        categories: {
            career: ['Career', 'Core actions, messages and your career story.'], calendar: ['Calendar', 'Tournaments, schedule and qualification routes.'],
            rankings: ['Rankings', 'Players, rivals, archives and achievements.'], player: ['Player', 'Training, staff, base, customisation and equipment.'],
            more: ['More', 'Saves, mods, community and additional options.']
        }
    },
    de: {
        eyebrow: 'KARRIEREZENTRALE', title: '🧭 Was jetzt?', summary: 'Die wichtigsten Informationen und eine Empfehlung für heute.',
        nextEvent: 'Nächstes Turnier', qualification: 'Qualifikation', readiness: 'Bereitschaft', sponsorGoal: 'Sponsorenziel',
        noEvent: 'Kein kommendes Event', seasonComplete: 'Prüfe den Kalender der neuen Saison.', today: 'Heute', tomorrow: 'Morgen', inDays: 'In {days} Tagen',
        noQualification: 'Keine aktive Prognose', noQualificationMeta: 'Alle Bedingungen findest du unter Kalender.',
        qualificationConfirmed: 'Qualifikation gesichert', qualificationIn: 'Aktuell im Feld', qualificationPending: 'Qualifikation nötig', qualificationReserve: 'Nachrückerliste', qualificationOut: 'Außerhalb des Feldes',
        energy: 'Energie {energy}%', preparation: 'Vorbereitung {preparation}/100', readyHigh: 'Hohe Spielbereitschaft', readyMedium: 'Erholung wäre sinnvoll', readyLow: 'Zuerst ausruhen',
        noSponsor: 'Kein aktiver Sponsor', noSponsorMeta: 'Schließe einen Vertrag für Einnahmen und Ziele ab.', noSponsorGoal: 'Kein Saisonziel', noSponsorGoalMeta: 'Aktive Verträge haben derzeit kein Zusatzziel.',
        recommendation: 'EMPFOHLENE AKTION',
        actionTournamentTitle: 'Heutiges Turnier spielen', actionTournamentDesc: 'Das Event ist bereit. Spiele oder überspringe es, bevor du den Tag fortsetzt.', actionTournamentButton: 'Zum Turnier', actionTournamentSkipButton: 'Auslassen (simulieren)',
        actionTutorialTitle: 'Erste Schritte lernen', actionTutorialDesc: 'Das Tutorial erklärt Hub, Training, Kalender und das erste Match. Fortschritt: {done}/{total}.', actionTutorialButton: 'Tutorial öffnen',
        actionMailboxTitle: 'Neue Nachrichten lesen', actionMailboxDesc: 'Du hast {count} ungelesene Nachrichten oder Einladungen.', actionMailboxButton: 'Postfach öffnen',
        actionRestTitle: 'Energie regenerieren', actionRestDesc: 'Niedrige Energie schwächt Training und Matches. Lege einen Ruhetag ein.', actionRestButton: '1 Tag ausruhen',
        actionPreparationTitle: 'Vorbereitung verbessern', actionPreparationDesc: 'Ein wichtiges Event ist nah und die Vorbereitung niedrig. Prüfe Basis und Reise.', actionPreparationButton: 'Basis & Reisen',
        actionTrainingTitle: 'Training nutzen', actionTrainingDesc: 'Du hast Energie und eine freie Trainingseinheit in dieser Woche.', actionTrainingButton: 'Zum Training',
        actionSponsorTitle: 'Sponsor finden', actionSponsorDesc: 'Du hast keinen aktiven Vertrag. Prüfe Angebote und Saisonboni.', actionSponsorButton: 'Sponsoren öffnen',
        actionPlanningTitle: 'Qualifikationsweg prüfen', actionPlanningDesc: 'Für das nächste große Event brauchst du noch die Qualifikation oder ein besseres Ranking.', actionPlanningButton: 'Qualifikation & OOM',
        actionCalendarTitle: 'Nächste Tage planen', actionCalendarDesc: 'Prüfe Termine, bevor du Training oder Erholung wählst.', actionCalendarButton: 'Kalender öffnen',
        navTitle: 'HUB-BEREICHE', communityTitle: 'Community', communityDesc: 'Bleib mit uns verbunden und entdecke die Unterstützer des Spiels.',
        categories: {
            career: ['Karriere', 'Kernaktionen, Nachrichten und Karrieregeschichte.'], calendar: ['Kalender', 'Turniere, Termine und Qualifikationswege.'],
            rankings: ['Ranglisten', 'Spieler, Rivalen, Archiv und Erfolge.'], player: ['Spieler', 'Training, Team, Basis, Anpassung und Ausrüstung.'],
            more: ['Mehr', 'Spielstände, Mods, Community und weitere Optionen.']
        }
    },
    nl: {
        eyebrow: 'CARRIÈRECENTRUM', title: '🧭 Wat nu?', summary: 'De belangrijkste informatie en één aanbevolen actie voor vandaag.',
        nextEvent: 'Volgend toernooi', qualification: 'Kwalificatie', readiness: 'Gereedheid', sponsorGoal: 'Sponsordoel',
        noEvent: 'Geen komend evenement', seasonComplete: 'Bekijk de kalender van het nieuwe seizoen.', today: 'Vandaag', tomorrow: 'Morgen', inDays: 'Over {days} dagen',
        noQualification: 'Geen actieve prognose', noQualificationMeta: 'Alle voorwaarden staan onder Kalender.',
        qualificationConfirmed: 'Plaats verzekerd', qualificationIn: 'Momenteel geplaatst', qualificationPending: 'Kwalificatie nodig', qualificationReserve: 'Reservelijst', qualificationOut: 'Buiten het veld',
        energy: 'Energie {energy}%', preparation: 'Voorbereiding {preparation}/100', readyHigh: 'Hoge wedstrijdgereedheid', readyMedium: 'Herstel zou helpen', readyLow: 'Rust eerst uit',
        noSponsor: 'Geen actieve sponsor', noSponsorMeta: 'Sluit een contract voor inkomsten en doelen.', noSponsorGoal: 'Geen seizoensdoel', noSponsorGoalMeta: 'Actieve contracten hebben nu geen extra doel.',
        recommendation: 'AANBEVOLEN ACTIE',
        actionTournamentTitle: 'Speel het toernooi van vandaag', actionTournamentDesc: 'Het evenement is klaar. Speel of sla het over voordat je de dag voortzet.', actionTournamentButton: 'Naar toernooi', actionTournamentSkipButton: 'Overslaan (simuleren)',
        actionTutorialTitle: 'Leer de eerste stappen', actionTutorialDesc: 'De tutorial behandelt hub, training, kalender en je eerste wedstrijd. Voortgang: {done}/{total}.', actionTutorialButton: 'Tutorial openen',
        actionMailboxTitle: 'Lees nieuwe berichten', actionMailboxDesc: 'Je hebt {count} ongelezen berichten of uitnodigingen.', actionMailboxButton: 'Postvak openen',
        actionRestTitle: 'Herstel energie', actionRestDesc: 'Weinig energie verzwakt training en wedstrijden. Neem een rustdag.', actionRestButton: '1 dag rusten',
        actionPreparationTitle: 'Verbeter voorbereiding', actionPreparationDesc: 'Een belangrijk evenement is dichtbij en je voorbereiding is laag. Bekijk basis en reizen.', actionPreparationButton: 'Basis & reizen',
        actionTrainingTitle: 'Gebruik een training', actionTrainingDesc: 'Je hebt energie en deze week nog een vrije trainingssessie.', actionTrainingButton: 'Naar training',
        actionSponsorTitle: 'Vind een sponsor', actionSponsorDesc: 'Je hebt geen actief contract. Bekijk aanbiedingen en seizoensbonussen.', actionSponsorButton: 'Sponsors openen',
        actionPlanningTitle: 'Bekijk je kwalificatieroute', actionPlanningDesc: 'Voor het volgende grote evenement is nog kwalificatie of een betere ranking nodig.', actionPlanningButton: 'Kwalificatie & OOM',
        actionCalendarTitle: 'Plan de komende dagen', actionCalendarDesc: 'Bekijk data voordat je voor training of rust kiest.', actionCalendarButton: 'Kalender openen',
        navTitle: 'HUBSECTIES', communityTitle: 'Community', communityDesc: 'Blijf verbonden en ontdek de mensen die het spel steunen.',
        categories: {
            career: ['Carrière', 'Belangrijkste acties, berichten en carrièreverhaal.'], calendar: ['Kalender', 'Toernooien, planning en kwalificatieroutes.'],
            rankings: ['Ranglijsten', 'Spelers, rivalen, archief en prestaties.'], player: ['Speler', 'Training, staf, basis, personalisatie en uitrusting.'],
            more: ['Meer', 'Opslaan, mods, community en extra opties.']
        }
    }
};

let activeHubCategory = 'career';
let hubRecommendedAction = 'calendar';

function getHubNavigationText() {
    const language = typeof currentLang === 'string' && HUB_NAVIGATION_TEXT[currentLang] ? currentLang : 'en';
    return HUB_NAVIGATION_TEXT[language];
}

function hubNavigationFormat(template, values = {}) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function setHubNavigationText(id, value) {
    if (typeof document === 'undefined') return;
    const element = document.getElementById(id);
    if (element) element.textContent = String(value ?? '');
}

function getHubNavigationLocale() {
    return { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[typeof currentLang === 'string' ? currentLang : 'en'] || 'en-GB';
}

function getHubTournamentDisplayName(tournament) {
    if (!tournament) return '';
    return typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : String(tournament.name || '');
}

function isHubValidDate(value) {
    return Boolean(value && typeof value.getTime === 'function' && !Number.isNaN(value.getTime()));
}

function hubDateAtMidnight(value) {
    const date = isHubValidDate(value) ? value : new Date(value);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getHubDaysBetween(first, second) {
    return Math.round((hubDateAtMidnight(first) - hubDateAtMidnight(second)) / 86400000);
}

function isHubTournamentRelevant(tournament) {
    if (!tournament || typeof player !== 'object' || !player) return Boolean(tournament);
    const qSchool = typeof isPdcQSchoolTournament === 'function'
        ? isPdcQSchoolTournament(tournament)
        : tournament.specialType === 'pdcQSchool';
    if (qSchool && player.hasTourCard === true) return false;

    const cardQualifier = typeof isPdcTourCardQualifierTournament === 'function'
        ? isPdcTourCardQualifierTournament(tournament)
        : tournament.specialType === 'pdcTourCardQualifier';
    if (cardQualifier) {
        if (player.hasTourCard !== true) return false;
        if (typeof isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier === 'function'
            && isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier(tournament)) return false;
    }
    return true;
}

function getHubUpcomingTournament() {
    if (typeof currentDate === 'undefined' || !isHubValidDate(currentDate)) return null;
    if (typeof activeTournament === 'object' && activeTournament && activeTournament.completed !== true) {
        return { tournament: activeTournament, date: new Date(currentDate), days: 0, active: true };
    }
    if (typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return null;
    const year = currentDate.getFullYear();
    return tournamentDatabase.map((tournament, index) => {
        const date = new Date(year, tournament.month, tournament.day);
        const end = new Date(year, tournament.endMonth ?? tournament.month, tournament.endDay ?? tournament.day);
        return { tournament, index, date, end, days: getHubDaysBetween(date, currentDate), active: false };
    }).filter(entry => entry.tournament && entry.tournament.completed !== true && isHubTournamentRelevant(entry.tournament)
        && entry.end >= hubDateAtMidnight(currentDate)
        && (typeof isTournamentScheduledForCareerYear !== 'function' || isTournamentScheduledForCareerYear(entry.tournament, year)))
        .sort((a, b) => a.date - b.date || a.index - b.index)[0] || null;
}

function getHubQualificationOverview() {
    if (typeof getPlanningTournaments !== 'function' || typeof buildQualificationPreview !== 'function') return null;
    try {
        const entry = getPlanningTournaments()[0];
        if (!entry) return null;
        const candidates = typeof getPdcTourCardPlayers === 'function'
            ? getPdcTourCardPlayers(true)
            : [typeof player === 'object' ? player : null, ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : [])].filter(Boolean);
        return { entry, preview: buildQualificationPreview(entry.tournament, candidates) };
    } catch (_error) {
        return null;
    }
}

function getHubSponsorGoalOverview() {
    const text = getHubNavigationText();
    if (typeof player !== 'object' || !player) return { value: text.noSponsor, meta: text.noSponsorMeta };
    const year = typeof currentDate !== 'undefined' && isHubValidDate(currentDate) ? currentDate.getFullYear() : new Date().getFullYear();
    const goals = typeof getSponsorGoalsForYear === 'function' ? getSponsorGoalsForYear(year) : [];
    const goal = goals.find(candidate => candidate?.status === 'pending') || null;
    if (goal) {
        const rank = typeof getPlayerRank === 'function' ? getPlayerRank('main') : 0;
        const progress = goal.type === 'rank'
            ? (typeof trSponsorGoal === 'function' ? trSponsorGoal('rankProgress', { rank: rank || '—', target: goal.target }) : `#${rank || '—'} / ${goal.target}`)
            : (typeof trSponsorGoal === 'function' ? trSponsorGoal('countProgress', { count: goal.progress, target: goal.target }) : `${goal.progress}/${goal.target}`);
        const label = typeof trSponsorGoal === 'function' ? trSponsorGoal(goal.type, goal) : progress;
        return { value: goal.sponsor || text.sponsorGoal, meta: `${label} · ${progress}`, goal };
    }
    return Array.isArray(player.activeSponsors) && player.activeSponsors.length
        ? { value: text.noSponsorGoal, meta: text.noSponsorGoalMeta }
        : { value: text.noSponsor, meta: text.noSponsorMeta };
}

function isHubCareerInFirstFortnight() {
    if (typeof currentDate === 'undefined' || !isHubValidDate(currentDate) || typeof player !== 'object' || !player) return false;
    const debutYear = Number.isFinite(Number(player.careerDebutSeason)) ? Number(player.careerDebutSeason) : currentDate.getFullYear();
    const dayOfYear = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
        - Date.UTC(currentDate.getFullYear(), 0, 1)) / 86400000) + 1;
    return currentDate.getFullYear() === debutYear && dayOfYear <= 14;
}

function getHubRecommendation(upcoming, qualification) {
    const text = getHubNavigationText();
    const tutorialState = typeof ensureTutorialState === 'function' ? ensureTutorialState() : null;
    const tutorialProgress = typeof getTutorialProgress === 'function' ? getTutorialProgress() : { done: 0, total: 0 };
    const stamina = Math.round(Number(typeof player === 'object' && player ? player.stamina : 0) || 0);
    const preparation = Math.round(Number(typeof player === 'object' && player ? player.preparation : 70) || 0);
    const trainingUsed = Number(typeof player === 'object' && player ? player.trainingSessionsThisWeek : 0) || 0;
    const unread = Number(typeof unreadMailsCount !== 'undefined' ? unreadMailsCount : 0) || 0;

    if (upcoming?.days <= 0) return { action: 'tournament', title: text.actionTournamentTitle, desc: text.actionTournamentDesc, button: text.actionTournamentButton };
    if (isHubCareerInFirstFortnight() && tutorialState && (!tutorialState.opened || !tutorialState.visitedSections.includes('firstSteps'))) {
        return { action: 'tutorial', title: text.actionTutorialTitle, desc: hubNavigationFormat(text.actionTutorialDesc, tutorialProgress), button: text.actionTutorialButton };
    }
    if (unread > 0) return { action: 'mailbox', title: text.actionMailboxTitle, desc: hubNavigationFormat(text.actionMailboxDesc, { count: unread }), button: text.actionMailboxButton };
    if (stamina < 50) return { action: 'rest', title: text.actionRestTitle, desc: text.actionRestDesc, button: text.actionRestButton };
    if (upcoming && upcoming.days <= 7 && preparation < 55) return { action: 'infrastructure', title: text.actionPreparationTitle, desc: text.actionPreparationDesc, button: text.actionPreparationButton };
    if (stamina >= 70 && trainingUsed < 2) return { action: 'training', title: text.actionTrainingTitle, desc: text.actionTrainingDesc, button: text.actionTrainingButton };
    if (!Array.isArray(player?.activeSponsors) || !player.activeSponsors.length) return { action: 'sponsors', title: text.actionSponsorTitle, desc: text.actionSponsorDesc, button: text.actionSponsorButton };
    if (qualification && ['pending', 'out', 'reserve'].includes(qualification.preview.status)) return { action: 'planning', title: text.actionPlanningTitle, desc: text.actionPlanningDesc, button: text.actionPlanningButton };
    return { action: 'calendar', title: text.actionCalendarTitle, desc: text.actionCalendarDesc, button: text.actionCalendarButton };
}

function updateHubOverview() {
    if (typeof document === 'undefined' || !document.getElementById('hub-now-panel') || typeof player !== 'object' || !player) return;
    const text = getHubNavigationText();
    const upcoming = getHubUpcomingTournament();
    const qualification = getHubQualificationOverview();
    const sponsor = getHubSponsorGoalOverview();
    const stamina = Math.round(Number(player.stamina) || 0);
    const preparation = Math.round(Number(player.preparation ?? 70) || 0);

    setHubNavigationText('hub-now-eyebrow', text.eyebrow);
    setHubNavigationText('hub-now-title', text.title);
    setHubNavigationText('hub-now-summary', text.summary);
    setHubNavigationText('hub-now-next-label', text.nextEvent);
    setHubNavigationText('hub-now-qualification-label', text.qualification);
    setHubNavigationText('hub-now-readiness-label', text.readiness);
    setHubNavigationText('hub-now-sponsor-label', text.sponsorGoal);
    setHubNavigationText('hub-now-recommendation-label', text.recommendation);

    if (upcoming) {
        setHubNavigationText('hub-now-next-value', getHubTournamentDisplayName(upcoming.tournament));
        const timing = upcoming.days <= 0 ? text.today : upcoming.days === 1 ? text.tomorrow : hubNavigationFormat(text.inDays, { days: upcoming.days });
        setHubNavigationText('hub-now-next-meta', `${timing} · ${upcoming.date.toLocaleDateString(getHubNavigationLocale())}`);
    } else {
        setHubNavigationText('hub-now-next-value', text.noEvent);
        setHubNavigationText('hub-now-next-meta', text.seasonComplete);
    }

    if (qualification) {
        const statusKey = `qualification${qualification.preview.status.charAt(0).toUpperCase()}${qualification.preview.status.slice(1)}`;
        setHubNavigationText('hub-now-qualification-value', text[statusKey] || text.noQualification);
        setHubNavigationText('hub-now-qualification-meta', getHubTournamentDisplayName(qualification.entry.tournament));
    } else {
        setHubNavigationText('hub-now-qualification-value', text.noQualification);
        setHubNavigationText('hub-now-qualification-meta', text.noQualificationMeta);
    }

    setHubNavigationText('hub-now-readiness-value', `${hubNavigationFormat(text.energy, { energy: stamina })} · ${hubNavigationFormat(text.preparation, { preparation })}`);
    setHubNavigationText('hub-now-readiness-meta', stamina < 50 ? text.readyLow : stamina < 70 || preparation < 60 ? text.readyMedium : text.readyHigh);
    setHubNavigationText('hub-now-sponsor-value', sponsor.value);
    setHubNavigationText('hub-now-sponsor-meta', sponsor.meta);

    const recommendation = getHubRecommendation(upcoming, qualification);
    hubRecommendedAction = recommendation.action;
    setHubNavigationText('hub-now-action-title', recommendation.title);
    setHubNavigationText('hub-now-action-desc', recommendation.desc);
    setHubNavigationText('hub-now-action-button', recommendation.button);
    const skipButton = document.getElementById('hub-now-skip-button');
    if (skipButton) {
        skipButton.textContent = text.actionTournamentSkipButton;
        skipButton.hidden = hubRecommendedAction !== 'tournament';
    }
}

function runHubRecommendedAction() {
    const handlers = {
        tournament: () => typeof startTournament === 'function' && startTournament(),
        tutorial: () => typeof showTutorial === 'function' && showTutorial(),
        mailbox: () => typeof showMailbox === 'function' && showMailbox(),
        rest: () => typeof advanceDay === 'function' && advanceDay(),
        infrastructure: () => typeof showCareerInfrastructure === 'function' && showCareerInfrastructure(),
        training: () => typeof showTrainingScreen === 'function' && showTrainingScreen(),
        sponsors: () => typeof showSponsorsScreen === 'function' && showSponsorsScreen(),
        planning: () => typeof showCareerPlanning === 'function' && showCareerPlanning('qualification'),
        calendar: () => typeof showCalendar === 'function' && showCalendar()
    };
    const handler = handlers[hubRecommendedAction] || handlers.calendar;
    return handler();
}

function skipHubRecommendedTournament() {
    if (typeof activeTournament !== 'object' || !activeTournament || typeof skipActiveTournament !== 'function') return false;
    return skipActiveTournament();
}

function selectHubCategory(category, options = {}) {
    if (!HUB_NAVIGATION_CATEGORIES.includes(category) || typeof document === 'undefined') return false;
    activeHubCategory = category;
    const text = getHubNavigationText();
    document.querySelectorAll('[data-hub-tab]').forEach(button => {
        const selected = button.dataset.hubTab === category;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        const label = text.categories[button.dataset.hubTab]?.[0];
        const labelNode = button.querySelector('span');
        if (labelNode && label) labelNode.textContent = label;
    });
    document.querySelectorAll('#hub-menu-grid > [data-hub-category]').forEach(tile => {
        const belongsToCategory = String(tile.dataset.hubCategory || '').split(/\s+/).includes(category);
        const isSharedTile = tile.dataset.hubShared === 'true';
        tile.hidden = !belongsToCategory && !isSharedTile;
    });
    setHubNavigationText('hub-category-nav-title', text.navTitle);
    setHubNavigationText('hub-category-active-title', text.categories[category][0]);
    setHubNavigationText('hub-category-active-desc', text.categories[category][1]);
    setHubNavigationText('hub-community-title', text.communityTitle);
    setHubNavigationText('hub-community-desc', text.communityDesc);
    if (options.focus === true) document.querySelector(`[data-hub-tab="${category}"]`)?.focus();
    return true;
}

function handleHubCategoryKeydown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = HUB_NAVIGATION_CATEGORIES.indexOf(event.currentTarget.dataset.hubTab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? HUB_NAVIGATION_CATEGORIES.length - 1
        : (current + (event.key === 'ArrowRight' ? 1 : -1) + HUB_NAVIGATION_CATEGORIES.length) % HUB_NAVIGATION_CATEGORIES.length;
    selectHubCategory(HUB_NAVIGATION_CATEGORIES[next], { focus: true });
}

function initializeHubNavigation() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-hub-tab]').forEach(button => {
        if (button.dataset.hubNavigationReady === 'true') return;
        button.dataset.hubNavigationReady = 'true';
        button.addEventListener('click', () => selectHubCategory(button.dataset.hubTab));
        button.addEventListener('keydown', handleHubCategoryKeydown);
    });
    selectHubCategory(activeHubCategory);
    updateHubOverview();
}

function refreshHubNavigationTranslations() {
    selectHubCategory(activeHubCategory);
    updateHubOverview();
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeHubNavigation);
    else initializeHubNavigation();
}
