const TOURNAMENT_EDITOR_QUALIFICATION_TEXT = {
    qualification: ['Zasady kwalifikacji', 'Qualification rules', 'Qualifikationsregeln', 'Kwalificatieregels'],
    qualificationMode: ['Zasady uczestnictwa', 'Entry rules', 'Teilnahmeregeln', 'Deelnameregels'],
    nativeRules: ['Wbudowane zasady turnieju', 'Built-in event rules', 'Integrierte Turnierregeln', 'Ingebouwde toernooiregels'],
    customRules: ['Własne zasady i drabinka pucharowa', 'Custom rules and knockout draw', 'Eigene Regeln und K.-o.-Auslosung', 'Eigen regels en knock-outschema'],
    qualificationHint: ['Własne zasady zastępują wbudowany dobór uczestników i etapy turnieju zwykłą drabinką pucharową. Ścieżki liczone są od góry; zawodnik zajmuje jedno miejsce. Brakujący uczestnicy oznaczają wolne losy. Kwalifikatory wyłaniają awansujących, bez nagród pieniężnych.', 'Custom rules replace the built-in field selection and stages with a knockout draw. Routes run from top to bottom; each player takes one place. Missing entrants become BYEs. Qualifiers award places without prize money.', 'Eigene Regeln ersetzen Teilnehmerauswahl und Phasen durch eine K.-o.-Auslosung. Wege gelten von oben nach unten; jeder Spieler belegt einen Platz. Fehlende Teilnehmer ergeben Freilose. Qualifikationen vergeben Plätze ohne Preisgeld.', 'Eigen regels vervangen selectie en fases door een knock-outschema. Routes gelden van boven naar beneden; iedere speler krijgt één plaats. Ontbrekende spelers worden BYEs. Kwalificaties geven plaatsen zonder prijzengeld.'],
    eventKind: ['Rodzaj wydarzenia', 'Event type', 'Veranstaltungsart', 'Evenementtype'],
    mainEvent: ['Turniej główny', 'Main event', 'Hauptturnier', 'Hoofdtoernooi'],
    qualifierEvent: ['Kwalifikator do turnieju', 'Event qualifier', 'Turnierqualifikation', 'Toernooikwalificatie'],
    targetEvent: ['Turniej docelowy', 'Target event', 'Zielturnier', 'Doeltoernooi'],
    qualifyingPlaces: ['Liczba awansujących', 'Qualifying places', 'Qualifikationsplätze', 'Kwalificatieplaatsen'],
    qualifierHint: ['Wybierz turniej z własnymi zasadami. Kwalifikacje muszą zakończyć się przed nim. Miejsca awansujących zostaną automatycznie dodane do jego ścieżek kosztem miejsc rankingowych. Zawodnicy z bezpośrednim awansem są wykluczeni.', 'Select an event with custom rules. The qualifier must finish before it. Qualifying places are automatically added to its routes, replacing ranking places. Direct entrants are excluded.', 'Wähle ein Turnier mit eigenen Regeln. Die Qualifikation muss vorher enden. Qualifikationsplätze ersetzen automatisch Ranglistenplätze. Direkt qualifizierte Spieler sind ausgeschlossen.', 'Kies een toernooi met eigen regels. De kwalificatie moet eerder eindigen. Kwalificatieplaatsen vervangen automatisch rankingplaatsen. Direct geplaatste spelers zijn uitgesloten.'],
    cardRule: ['Karta zawodnicza', 'Tour Card', 'Tour Card', 'Tour Card'],
    allPlayers: ['Wszyscy zawodnicy', 'All players', 'Alle Spieler', 'Alle spelers'],
    holders: ['Tylko posiadacze karty', 'Card holders only', 'Nur Karteninhaber', 'Alleen kaarthouders'],
    nonholders: ['Tylko zawodnicy bez karty', 'Players without a card', 'Spieler ohne Karte', 'Spelers zonder kaart'],
    minAge: ['Minimalny wiek (0 = bez limitu)', 'Minimum age (0 = no limit)', 'Mindestalter (0 = ohne Grenze)', 'Minimumleeftijd (0 = geen limiet)'],
    maxAge: ['Maksymalny wiek (0 = bez limitu)', 'Maximum age (0 = no limit)', 'Höchstalter (0 = ohne Grenze)', 'Maximumleeftijd (0 = geen limiet)'],
    countries: ['Kraje zawodników, po przecinku (puste = wszystkie)', 'Player countries, comma separated (empty = all)', 'Spielerländer, durch Kommas getrennt (leer = alle)', 'Spelerslanden, met komma’s (leeg = alle)'],
    routes: ['Ścieżki i liczba miejsc', 'Routes and places', 'Wege und Plätze', 'Routes en plaatsen'],
    routeSource: ['Źródło uczestników', 'Entrant source', 'Teilnehmerquelle', 'Deelnemersbron'],
    routePlaces: ['Liczba miejsc', 'Places', 'Plätze', 'Plaatsen'],
    countryRoute: ['Kraj zawodnika', 'Player country', 'Spielerland', 'Spelersland'],
    routeCountry: ['Reprezentowany kraj', 'Represented country', 'Vertretenes Land', 'Vertegenwoordigd land'],
    routeRanking: ['Ranking wśród zawodników kraju', 'Ranking within the country', 'Rangliste innerhalb des Landes', 'Ranking binnen het land'],
    selectCountry: ['Wybierz kraj', 'Select country', 'Land auswählen', 'Kies land'],
    countryRouteHint: ['Ścieżka „Kraj zawodnika” rezerwuje miejsca dla reprezentantów wybranego kraju według wybranego rankingu. Dodaj osobne ścieżki dla kolejnych krajów. Wszystkie ograniczenia uczestnictwa nadal obowiązują.', 'A “Player country” route reserves places for players representing that country, using the selected ranking. Add separate routes for other countries. All entry restrictions still apply.', 'Ein Weg „Spielerland” reserviert Plätze für Spieler dieses Landes anhand der gewählten Rangliste. Für weitere Länder eigene Wege hinzufügen. Alle Teilnahmebeschränkungen gelten weiterhin.', 'Een route “Spelersland” reserveert plaatsen voor spelers van dat land volgens de gekozen ranking. Voeg aparte routes voor andere landen toe. Alle deelnamebeperkingen blijven gelden.'],
    invalidCountryRoute: ['W każdej ścieżce krajowej wybierz reprezentowany kraj oraz ranking.', 'Select a represented country and ranking for each country route.', 'Für jeden Länderweg ein vertretenes Land und eine Rangliste auswählen.', 'Kies voor elke landenroute een vertegenwoordigd land en ranking.'],
    addRoute: ['＋ Dodaj ścieżkę', '＋ Add route', '＋ Weg hinzufügen', '＋ Route toevoegen'],
    removeRoute: ['Usuń ścieżkę', 'Remove route', 'Weg entfernen', 'Route verwijderen'],
    open: ['Otwarty nabór (kolejność OOM)', 'Open entry (OOM order)', 'Offene Teilnahme (OOM-Reihenfolge)', 'Open inschrijving (OOM-volgorde)'],
    oom: ['Główny ranking OOM', 'Main Order of Merit', 'Haupt-Order of Merit', 'Hoofd-Order of Merit'],
    protour: ['Ranking ProTour', 'ProTour ranking', 'ProTour-Rangliste', 'ProTour-ranking'],
    pc: ['Ranking Players Championship', 'Players Championship ranking', 'Players-Championship-Rangliste', 'Players Championship-ranking'],
    europeanTour: ['Ranking European Tour', 'European Tour ranking', 'European-Tour-Rangliste', 'European Tour-ranking'],
    challengeTour: ['Ranking Challenge Tour', 'Challenge Tour ranking', 'Challenge-Tour-Rangliste', 'Challenge Tour-ranking'],
    developmentTour: ['Ranking Development Tour', 'Development Tour ranking', 'Development-Tour-Rangliste', 'Development Tour-ranking'],
    qualifier: ['Wyniki kwalifikatora', 'Qualifier results', 'Qualifikationsergebnisse', 'Kwalificatieresultaten'],
    selectQualifier: ['Wybierz kwalifikator', 'Select qualifier', 'Qualifikation auswählen', 'Kies kwalificatie'],
    selectTarget: ['Wybierz turniej docelowy', 'Select target event', 'Zielturnier auswählen', 'Kies doeltoernooi'],
    invalidQualification: ['Sprawdź ścieżki, liczbę miejsc oraz ograniczenia wieku. Suma miejsc musi być równa liczbie uczestników.', 'Check routes, places and age limits. Places must total the field size.', 'Wege, Plätze und Altersgrenzen prüfen. Die Summe muss der Teilnehmerzahl entsprechen.', 'Controleer routes, plaatsen en leeftijdsgrenzen. Het totaal moet gelijk zijn aan het deelnemersveld.'],
    invalidQualifier: ['Wybierz turniej główny z własnymi zasadami. Kwalifikator musi skończyć się przed nim, a liczba awansujących musi być potęgą 2, mniejszą od pola kwalifikatora. W turnieju głównym musi wystarczyć miejsc rankingowych.', 'Select a main event with custom rules. The qualifier must finish before it; advancing places must be a power of two smaller than its field. The main event needs enough ranking places.', 'Wähle ein Hauptturnier mit eigenen Regeln. Die Qualifikation muss vorher enden; Plätze müssen eine Zweierpotenz kleiner als das Feld sein. Das Hauptturnier braucht genug Ranglistenplätze.', 'Kies een hoofdtoernooi met eigen regels. De kwalificatie moet eerder eindigen; plaatsen moeten een macht van twee kleiner dan het veld zijn. Het hoofdtoernooi heeft genoeg rankingplaatsen nodig.'],
    completedRules: ['Zasady ukończonych kwalifikacji i ich turnieju docelowego można zmienić dopiero w następnym sezonie.', 'Completed qualifier rules and their target cannot be changed until next season.', 'Regeln abgeschlossener Qualifikationen und ihr Ziel können erst nächste Saison geändert werden.', 'Regels van voltooide kwalificaties en hun doel kunnen pas volgend seizoen wijzigen.'],
    linkedRules: ['Najpierw usuń lub przepnij powiązane kwalifikatory, aby wyłączyć własne zasady.', 'Remove or relink linked qualifiers before disabling custom rules.', 'Verknüpfte Qualifikationen vor dem Abschalten entfernen oder umleiten.', 'Verwijder of koppel kwalificaties opnieuw voordat je eigen regels uitschakelt.'],
    qualified: ['Wywalczono awans do turnieju głównego.', 'Qualified for the main event.', 'Für das Hauptturnier qualifiziert.', 'Geplaatst voor het hoofdtoernooi.'],
    notQualified: ['Nie wywalczono awansu do turnieju głównego.', 'Did not qualify for the main event.', 'Nicht für das Hauptturnier qualifiziert.', 'Niet geplaatst voor het hoofdtoernooi.'],
    teamRules: ['Turnieje drużynowe i liga korzystają z wbudowanych zasad uczestnictwa.', 'Team events and the league use built-in entry rules.', 'Teamturniere und Liga nutzen integrierte Teilnahmeregeln.', 'Teamtoernooien en de competitie gebruiken ingebouwde deelnameregels.']
};
TOURNAMENT_EDITOR_QUALIFICATION_TEXT.qualifierHint = [
    'Wybierz istniejący lub własny turniej. Kwalifikator musi zakończyć się przed nim. Przy wbudowanych zasadach awansujący zastępują najniżej sklasyfikowanych uczestników (maksymalnie 4 miejsca); w European Tour zajmują miejsca ścieżki gospodarzy.',
    'Select a built-in or custom event. The qualifier must finish first. With built-in rules, winners replace the lowest-ranked entrants (up to 4 places); in European Tour they take host-nation places.',
    'Wähle ein bestehendes oder eigenes Turnier. Die Qualifikation muss vorher enden. Bei integrierten Regeln ersetzen die Sieger bis zu vier der am niedrigsten platzierten Teilnehmer; bei der European Tour belegen sie Gastgeberplätze.',
    'Kies een bestaand of eigen toernooi. De kwalificatie moet eerder eindigen. Bij ingebouwde regels vervangen winnaars maximaal vier van de laagst gerangschikte deelnemers; in de European Tour bezetten zij gastlandplaatsen.'
];
TOURNAMENT_EDITOR_QUALIFICATION_TEXT.invalidQualifier = [
    'Wybierz turniej docelowy, który jeszcze się nie rozpoczął. Kwalifikator musi skończyć się wcześniej, a liczba awansujących musi być potęgą 2 mniejszą od jego pola. Limit: 4 miejsca w turnieju wbudowanym.',
    'Select a target event that has not started. The qualifier must finish earlier, and advancing places must be a power of two smaller than its field. Limit: 4 places in a built-in event.',
    'Wähle ein noch nicht begonnenes Zielturnier. Die Qualifikation muss vorher enden; die Aufstiegsplätze müssen eine Zweierpotenz unter der Feldgröße sein. Limit: 4 Plätze bei integrierten Turnieren.',
    'Kies een doeltoernooi dat nog niet is begonnen. De kwalificatie moet eerder eindigen; het aantal plaatsen moet een macht van twee kleiner dan het deelnemersveld zijn. Limiet: 4 plaatsen bij ingebouwde toernooien.'
];
Object.entries(TOURNAMENT_EDITOR_QUALIFICATION_TEXT).forEach(([key, texts]) =>
    ['pl', 'en', 'de', 'nl'].forEach((language, index) => { TOURNAMENT_EDITOR_TEXT[language][key] = texts[index]; }));

function appendTournamentEditorOption(select, value, label) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
}

function getTournamentEditorRouteCountries(savedCountry = '') {
    const available = [
        ...(typeof countries !== 'undefined' && Array.isArray(countries) ? countries : []),
        ...getTournamentEditorCandidates().map(candidate => candidate.country), savedCountry
    ].filter(country => typeof country === 'string' && country.trim()).map(country => country.trim());
    return [...new Set(available)].sort((first, second) =>
        (typeof t === 'function' ? t(first) : first).localeCompare(typeof t === 'function' ? t(second) : second));
}

function addTournamentEditorRoute(route = { source: 'oom', places: 8 }) {
    const row = document.createElement('div');
    row.className = 'te-route';
    const source = document.createElement('select');
    source.className = 'te-route-source';
    source.setAttribute('aria-label', trTournamentEditor('routeSource'));
    Object.keys(TOURNAMENT_EDITOR_RANKINGS).concat('country', 'qualifier').forEach(key =>
        appendTournamentEditorOption(source, key, trTournamentEditor(key === 'country' ? 'countryRoute' : key)));
    source.value = route.source;
    const qualifier = document.createElement('select');
    qualifier.className = 'te-route-qualifier';
    qualifier.setAttribute('aria-label', trTournamentEditor('selectQualifier'));
    appendTournamentEditorOption(qualifier, '', trTournamentEditor('selectQualifier'));
    tournamentDatabase.filter(event => isTournamentEditorQualifier(event)
        && event.editorQualification.targetKey === tournamentEditorKey(tournamentEditorSelected)).forEach(event =>
        appendTournamentEditorOption(qualifier, tournamentEditorKey(event), event.name));
    qualifier.value = route.qualifierKey || '';
    const countryFields = document.createElement('div');
    countryFields.className = 'te-route-country-fields';
    const countryLabel = document.createElement('label');
    const countryText = document.createElement('span');
    countryText.dataset.teRouteText = 'routeCountry';
    countryText.textContent = trTournamentEditor('routeCountry');
    const country = document.createElement('select');
    country.className = 'te-route-country';
    appendTournamentEditorOption(country, '', trTournamentEditor('selectCountry'));
    getTournamentEditorRouteCountries(route.country).forEach(value =>
        appendTournamentEditorOption(country, value, typeof t === 'function' ? t(value) : value));
    country.value = route.country?.trim() || '';
    countryLabel.append(countryText, country);
    const rankingLabel = document.createElement('label');
    const rankingText = document.createElement('span');
    rankingText.dataset.teRouteText = 'routeRanking';
    rankingText.textContent = trTournamentEditor('routeRanking');
    const ranking = document.createElement('select');
    ranking.className = 'te-route-country-ranking';
    Object.keys(TOURNAMENT_EDITOR_RANKINGS).forEach(key => appendTournamentEditorOption(ranking, key, trTournamentEditor(key)));
    ranking.value = route.ranking || 'oom';
    rankingLabel.append(rankingText, ranking);
    countryFields.append(countryLabel, rankingLabel);
    const places = document.createElement('input');
    places.type = 'number'; places.min = '1'; places.max = '256'; places.step = '1'; places.value = route.places;
    places.className = 'te-route-places';
    places.setAttribute('aria-label', trTournamentEditor('routePlaces'));
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', trTournamentEditor('removeRoute'));
    remove.addEventListener('click', () => row.remove());
    const update = () => {
        qualifier.hidden = source.value !== 'qualifier';
        countryFields.hidden = source.value !== 'country';
    };
    source.addEventListener('change', update); update();
    row.append(source, qualifier, places, remove, countryFields);
    tournamentEditorElement('te-routes').appendChild(row);
}

function updateTournamentEditorQualificationFields() {
    const custom = tournamentEditorValue('te-qualification-mode') === 'custom';
    const qualifier = tournamentEditorValue('te-event-kind') === 'qualifier';
    tournamentEditorElement('te-qualification-fields').hidden = !custom;
    tournamentEditorElement('te-target-wrap').hidden = !qualifier;
    tournamentEditorElement('te-qualifying-places-wrap').hidden = !qualifier;
    tournamentEditorElement('te-qualifier-hint').hidden = !qualifier;
    tournamentEditorElement('te-prizes-panel').hidden = custom && qualifier;
    tournamentEditorElement('te-ranking').disabled = custom && qualifier;
    tournamentEditorElement('te-field-size').disabled = !custom && !tournamentEditorCreating
        && tournamentEditorSelected?.isEditorTournament !== true;
    tournamentEditorElement('te-field-size-wrap').hidden = tournamentEditorElement('te-field-size').disabled;
}

function updateTournamentEditorFieldSize() {
    const rows = document.querySelectorAll('#te-routes .te-route');
    if (rows.length === 1 && rows[0].querySelector('.te-route-source').value !== 'qualifier') {
        rows[0].querySelector('.te-route-places').value = tournamentEditorValue('te-field-size');
    }
}

function populateTournamentEditorQualification(tournament) {
    const rules = tournament?.editorQualification;
    tournamentEditorElement('te-qualification-mode').value = rules?.mode || (tournament ? 'native' : 'custom');
    const name = String(tournament?.sourceName || tournament?.name || '').toLowerCase();
    const teamOrLeague = tournament?.isEditorTournament !== true && (/world cup|global cup|puchar narodów|premier|global darts league/.test(name)
        || ['worldCup', 'worldCupQualifier', 'worldCupQualifiers'].includes(tournament?.specialType));
    tournamentEditorElement('te-qualification-mode').disabled = teamOrLeague;
    tournamentEditorElement('te-team-rules').hidden = !teamOrLeague;
    tournamentEditorElement('te-event-kind').value = rules?.kind || 'main';
    tournamentEditorElement('te-card-rule').value = rules?.card || 'all';
    tournamentEditorElement('te-min-age').value = rules?.minAge || 0;
    tournamentEditorElement('te-max-age').value = rules?.maxAge || 0;
    tournamentEditorElement('te-countries').value = (rules?.countries || []).join(', ');
    tournamentEditorElement('te-qualifying-places').value = rules?.qualifyingPlaces || 8;
    const target = tournamentEditorElement('te-target');
    target.replaceChildren();
    appendTournamentEditorOption(target, '', trTournamentEditor('selectTarget'));
    tournamentDatabase.filter(event => event !== tournament
        && ((hasTournamentEditorQualification(event) && !isTournamentEditorQualifier(event))
            || isTournamentEditorNativeTarget(event))).forEach(event =>
        appendTournamentEditorOption(target, tournamentEditorKey(event), event.name));
    target.value = rules?.targetKey || '';
    tournamentEditorElement('te-routes').replaceChildren();
    (rules?.routes || [{ source: 'oom', places: tournament?.editorFieldSize || 32 }]).forEach(addTournamentEditorRoute);
    refreshTournamentEditorQualificationTranslations();
    updateTournamentEditorQualificationFields();
}

function refreshTournamentEditorQualificationTranslations() {
    const fields = { 'te-qualification-title': 'qualification', 'te-qualification-mode-label': 'qualificationMode',
        'te-qualification-hint': 'qualificationHint', 'te-event-kind-label': 'eventKind', 'te-target-label': 'targetEvent',
        'te-qualifying-places-label': 'qualifyingPlaces', 'te-qualifier-hint': 'qualifierHint', 'te-card-rule-label': 'cardRule',
        'te-min-age-label': 'minAge', 'te-max-age-label': 'maxAge', 'te-countries-label': 'countries',
        'te-routes-label': 'routes', 'te-country-route-hint': 'countryRouteHint', 'te-add-route': 'addRoute', 'te-team-rules': 'teamRules' };
    Object.entries(fields).forEach(([id, key]) => { tournamentEditorElement(id).textContent = trTournamentEditor(key); });
    [['te-qualification-mode', ['nativeRules', 'customRules']], ['te-event-kind', ['mainEvent', 'qualifierEvent']],
        ['te-card-rule', ['allPlayers', 'holders', 'nonholders']]].forEach(([id, keys]) =>
        [...tournamentEditorElement(id).options].forEach((option, index) => { option.textContent = trTournamentEditor(keys[index]); }));
    document.querySelectorAll('#te-routes .te-route-source option').forEach(option => {
        option.textContent = trTournamentEditor(option.value === 'country' ? 'countryRoute' : option.value);
    });
    document.querySelectorAll('#te-routes [data-te-route-text]').forEach(label => {
        label.textContent = trTournamentEditor(label.dataset.teRouteText);
    });
    document.querySelectorAll('#te-routes .te-route-country option').forEach(option => {
        option.textContent = option.value ? (typeof t === 'function' ? t(option.value) : option.value) : trTournamentEditor('selectCountry');
    });
    document.querySelectorAll('#te-routes .te-route-country-ranking option').forEach(option => {
        option.textContent = trTournamentEditor(option.value);
    });
    document.querySelectorAll('#te-routes .te-route').forEach(row => {
        row.querySelector('.te-route-source').setAttribute('aria-label', trTournamentEditor('routeSource'));
        row.querySelector('.te-route-places').setAttribute('aria-label', trTournamentEditor('routePlaces'));
        row.querySelector('.te-route-qualifier').setAttribute('aria-label', trTournamentEditor('selectQualifier'));
        row.querySelector('.te-route-qualifier option[value=""]').textContent = trTournamentEditor('selectQualifier');
        row.querySelector('button').setAttribute('aria-label', trTournamentEditor('removeRoute'));
    });
}

function getTournamentEditorQualificationFormData(values) {
    if (tournamentEditorValue('te-qualification-mode') !== 'custom') return null;
    const integer = (value, min, max) => {
        const number = Number(value);
        if (!String(value).trim() || !Number.isInteger(number) || number < min || number > max) throw new Error(trTournamentEditor('invalidQualification'));
        return number;
    };
    const routes = [...document.querySelectorAll('#te-routes .te-route')].map(row => {
        const source = row.querySelector('.te-route-source').value;
        if (!Object.hasOwn(TOURNAMENT_EDITOR_RANKINGS, source) && source !== 'qualifier' && source !== 'country') throw new Error(trTournamentEditor('invalidQualification'));
        const route = { source, places: integer(row.querySelector('.te-route-places').value, 1, 256) };
        if (source === 'qualifier') route.qualifierKey = row.querySelector('.te-route-qualifier').value;
        if (source === 'country') {
            route.country = row.querySelector('.te-route-country').value.trim();
            route.ranking = row.querySelector('.te-route-country-ranking').value;
            if (!route.country || !Object.hasOwn(TOURNAMENT_EDITOR_RANKINGS, route.ranking)) {
                throw new Error(trTournamentEditor('invalidCountryRoute'));
            }
        }
        return route;
    });
    const minAge = integer(tournamentEditorValue('te-min-age'), 0, 100);
    const maxAge = integer(tournamentEditorValue('te-max-age'), 0, 100);
    if ((maxAge && minAge > maxAge) || !routes.length || routes.reduce((sum, route) => sum + route.places, 0) !== values.editorFieldSize) {
        throw new Error(trTournamentEditor('invalidQualification'));
    }
    const kind = tournamentEditorValue('te-event-kind');
    const rules = { mode: 'custom', kind, card: tournamentEditorValue('te-card-rule'), minAge, maxAge,
        countries: tournamentEditorValue('te-countries').split(',').map(value => value.trim()).filter(Boolean), routes };
    if (kind === 'qualifier') {
        rules.targetKey = tournamentEditorValue('te-target');
        rules.qualifyingPlaces = integer(tournamentEditorValue('te-qualifying-places'), 1, 128);
        if (routes.some(route => route.source === 'qualifier') || ![1, 2, 4, 8, 16, 32, 64, 128].includes(rules.qualifyingPlaces)
            || rules.qualifyingPlaces >= values.editorFieldSize) throw new Error(trTournamentEditor('invalidQualifier'));
    }
    return rules;
}

function prepareTournamentEditorQualificationUpdate(tournament, values) {
    const proposed = { ...tournament, ...values };
    const rules = values.editorQualification;
    const linked = tournamentDatabase.filter(event => isTournamentEditorQualifier(event)
        && event.editorQualification.targetKey === tournamentEditorKey(tournament));
    if (linked.length && hasTournamentEditorQualification(tournament)
        && (!rules || rules.kind !== 'main')) throw new Error(trTournamentEditor('linkedRules'));
    const rulesChanged = JSON.stringify(tournament?.editorQualification || null) !== JSON.stringify(rules)
        || (hasTournamentEditorQualification(tournament) && (tournament.editorFieldSize !== values.editorFieldSize || tournament.minOvr !== values.minOvr));
    if (rulesChanged && ((isTournamentEditorQualifier(tournament) && tournament.completed) || linked.some(event => event.completed))) {
        throw new Error(trTournamentEditor('completedRules'));
    }
    if (rules && rules.kind === 'main' && linked.some(event => rules.routes.filter(route =>
        route.source === 'qualifier' && route.qualifierKey === tournamentEditorKey(event)).length !== 1)) {
        throw new Error(trTournamentEditor('invalidQualifier'));
    }
    if (rules && rules.kind === 'main') rules.routes.filter(route => route.source === 'qualifier').forEach(route => {
        const event = tournamentDatabase.find(candidate => tournamentEditorKey(candidate) === route.qualifierKey);
        if (!isTournamentEditorQualifier(event) || event.editorQualification.targetKey !== tournamentEditorKey(tournament)
            || route.places !== event.editorQualification.qualifyingPlaces) throw new Error(trTournamentEditor('invalidQualifier'));
    });
    const updates = [];
    const previousMain = isTournamentEditorQualifier(tournament) ? getTournamentEditorLinkedMain(tournament) : null;
    const nextMain = isTournamentEditorQualifier(proposed) ? getTournamentEditorLinkedMain(proposed) : null;
    if (isTournamentEditorQualifier(proposed)) {
        const end = new Date(2027, values.endMonth ?? values.month, values.endDay ?? values.day);
        if (!nextMain || nextMain === tournament || nextMain.completed || isTournamentEditorActive(nextMain)
            || (!hasTournamentEditorQualification(nextMain) && !isTournamentEditorNativeTarget(nextMain))
            || isTournamentEditorQualifier(nextMain)
            || end >= new Date(2027, nextMain.month, nextMain.day)) throw new Error(trTournamentEditor('invalidQualifier'));
        if (isTournamentEditorNativeTarget(nextMain)) {
            const linkedPlaces = tournamentDatabase.filter(event => event !== tournament
                && isTournamentEditorQualifier(event)
                && event.editorQualification.targetKey === tournamentEditorKey(nextMain))
                .reduce((total, event) => total + event.editorQualification.qualifyingPlaces, 0);
            const limit = 4;
            if (linkedPlaces + rules.qualifyingPlaces > limit) throw new Error(trTournamentEditor('invalidQualifier'));
        }
    }
    linked.forEach(event => {
        const end = new Date(2027, event.endMonth ?? event.month, event.endDay ?? event.day);
        if (end >= new Date(2027, values.month, values.day)) throw new Error(trTournamentEditor('invalidQualifier'));
    });
    for (const main of new Set([previousMain, nextMain].filter(Boolean))) {
        if (isTournamentEditorActive(main)) throw new Error(trTournamentEditor('inUse'));
        if (!hasTournamentEditorQualification(main)) continue;
        const updated = structuredClone(main.editorQualification);
        const qualifierKey = tournamentEditorKey(tournament) || values.name;
        const oldRoute = updated.routes.find(route => route.source === 'qualifier' && route.qualifierKey === qualifierKey);
        const oldPlaces = oldRoute?.places || 0;
        const newPlaces = main === nextMain ? rules.qualifyingPlaces : 0;
        let delta = newPlaces - oldPlaces;
        if (delta > 0) {
            for (let index = updated.routes.length - 1; index >= 0 && delta > 0; index--) {
                const route = updated.routes[index];
                if (route.source === 'qualifier') continue;
                const taken = Math.min(route.places, delta); route.places -= taken; delta -= taken;
            }
            if (delta) throw new Error(trTournamentEditor('invalidQualifier'));
        } else if (delta < 0) {
            const direct = updated.routes.find(route => route.source !== 'qualifier');
            if (direct) direct.places -= delta;
            else updated.routes.unshift({ source: 'oom', places: -delta });
        }
        updated.routes = updated.routes.filter(route => route.places > 0 && route !== oldRoute);
        if (newPlaces) updated.routes.push({ source: 'qualifier', qualifierKey, places: newPlaces });
        updates.push({ main, rules: updated });
    }
    return updates;
}
