// Replace a quota inside the native World Championship field without changing its stages.
const TOURNAMENT_EDITOR_NATIVE_ROUTE_TEXT = {
    nativeRoutes: ["Źródła uczestników wbudowanych ścieżek","Entrant sources for built-in routes","Teilnehmerquellen integrierter Wege","Deelnemersbronnen voor ingebouwde routes"],
    nativeRouteHint: ["Dodaj kilka źródeł do tej samej ścieżki. Ich łączna liczba miejsc nie może przekroczyć puli; pozostałe miejsca zachowują wbudowaną zasadę. Wybierz ranking cyklu albo wyniki rozegranego turnieju lub kwalifikatora. Źródła muszą zakończyć się wcześniej.","Add multiple sources to the same route. Their combined places must fit its quota; remaining places keep the built-in rule. Choose a cycle ranking or played tournament / qualifier results. Sources must finish earlier.","Mehrere Quellen pro Weg sind möglich. Zusammen dürfen sie das Platzkontingent nicht überschreiten; übrige Plätze behalten die integrierte Regel. Zyklusrangliste oder gespielte Turnier-/Qualifikationsergebnisse wählen. Quellen müssen vorher enden.","Voeg meerdere bronnen aan dezelfde route toe. Samen mogen ze het aantal plaatsen niet overschrijden; overige plaatsen behouden de ingebouwde regel. Kies een cyclusranking of gespeelde toernooi-/kwalificatieresultaten. Bronnen moeten eerder eindigen."],
    nativeRoute: ['Ścieżka do podmiany', 'Route to replace', 'Zu ersetzender Weg', 'Te vervangen route'],
    nativeRouteExample: ["Przykład: Azja → Asian Tour: 5 miejsc + Asian Championship: 2 miejsca.","Example: Asia → Asian Tour: 5 places + Asian Championship: 2 places.","Beispiel: Asien → Asian Tour: 5 Plätze + Asian Championship: 2 Plätze.","Voorbeeld: Azië → Asian Tour: 5 plaatsen + Asian Championship: 2 plaatsen."],
    nativeSystemHint: ["Zmień źródła poniższych ścieżek, zachowując wbudowany format turnieju.","Change the sources below while preserving the built-in tournament format.","Quellen unten ändern und das integrierte Turnierformat beibehalten.","Wijzig de bronnen hieronder en behoud het ingebouwde toernooiformaat."],
    addNativeRoute: ["＋ Dodaj źródło","＋ Add source","＋ Quelle hinzufügen","＋ Bron toevoegen"],
    invalidNativeRoute: ["Sprawdź źródła: suma miejsc w każdej ścieżce musi mieścić się w jej puli. Cykl z własnym rankingiem lub turniej źródłowy musi istnieć i zakończyć się przed turniejem docelowym.","Check sources: combined places must fit each route quota. The cycle with its own ranking or source tournament must exist and finish before the target event.","Quellen prüfen: Platzsummen müssen innerhalb der Kontingente liegen. Zyklus mit eigener Rangliste oder Quellturnier muss existieren und vorher enden.","Controleer bronnen: het totaal moet binnen elke route passen. De cyclus met eigen ranking of het brontoernooi moet bestaan en vóór het doel eindigen."]
};
Object.entries(TOURNAMENT_EDITOR_NATIVE_ROUTE_TEXT).forEach(([key, texts]) =>
    ['pl', 'en', 'de', 'nl'].forEach((language, index) => { TOURNAMENT_EDITOR_TEXT[language][key] = texts[index]; }));
['pl', 'en', 'de', 'nl'].forEach(language => {
    TOURNAMENT_EDITOR_TEXT[language].nativeRouteHint += ` ${TOURNAMENT_EDITOR_TEXT[language].nativeRouteExample}`;
});

function tournamentEditorNativeDefinitionLabel(definition) {
    const label = definition.key === 'field' ? trTournamentEditor('nativeField')
        : typeof getPlanningRouteLabel === 'function' ? getPlanningRouteLabel(definition.key) : definition.label || definition.key;
    return `${label} (${definition.requested})`;
}

function addTournamentEditorNativeRoute(route = null) {
    const container = tournamentEditorElement('te-native-routes');
    const definitions = getTournamentEditorNativeRouteDefinitions(tournamentEditorSelected);
    const definition = definitions[0];
    if (!route && !definition) return;
    route ||= { nativeKey: definition.key, source: 'tourRanking', places: 1 };
    const row = document.createElement('div'); row.className = 'te-route te-native-route';
    const labelField = (key, element) => {
        const label = document.createElement('label');
        const caption = document.createElement('span'); caption.dataset.teNativeText = key;
        caption.textContent = trTournamentEditor(key); label.append(caption, element); return label;
    };
    const native = document.createElement('select'); native.className = 'te-native-key';
    definitions.forEach(value => appendTournamentEditorOption(native, value.key, tournamentEditorNativeDefinitionLabel(value)));
    native.value = route.nativeKey;
    const source = document.createElement('select'); source.className = 'te-native-source';
    ['tourRanking', 'tournament', ...Object.keys(TOURNAMENT_EDITOR_RANKINGS), 'country'].forEach(key =>
        appendTournamentEditorOption(source, key, trTournamentEditor(key === 'country' ? 'countryRoute' : key)));
    source.value = route.source;
    const places = document.createElement('input'); places.className = 'te-native-places';
    places.type = 'number'; places.min = '1'; places.step = '1'; places.value = route.places;
    const tour = document.createElement('select'); tour.className = 'te-native-tour';
    populateTournamentEditorTourRankingOptions(tour, route.tourId);
    const resultSource = document.createElement('select'); resultSource.className = 'te-native-tournament';
    populateTournamentEditorResultSourceOptions(resultSource, route.tournamentKey);
    const resultLabel = labelField('selectTournamentSource', resultSource);
    const resultHint = document.createElement('small'); resultHint.dataset.teNativeText = 'tournamentSourceHint';
    resultHint.textContent = trTournamentEditor('tournamentSourceHint'); resultLabel.appendChild(resultHint);
    const country = document.createElement('select'); country.className = 'te-native-country';
    appendTournamentEditorOption(country, '', trTournamentEditor('selectCountry'));
    getTournamentEditorRouteCountries(route.country).forEach(value => appendTournamentEditorOption(country, value, typeof t === 'function' ? t(value) : value));
    country.value = route.country || '';
    const ranking = document.createElement('select'); ranking.className = 'te-native-ranking';
    Object.keys(TOURNAMENT_EDITOR_RANKINGS).forEach(key => appendTournamentEditorOption(ranking, key, trTournamentEditor(key)));
    ranking.value = route.ranking || 'oom';
    const tourLabel = labelField('selectTourRanking', tour), countryLabel = labelField('routeCountry', country), rankingLabel = labelField('routeRanking', ranking);
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×';
    remove.setAttribute('aria-label', trTournamentEditor('removeRoute'));
    remove.addEventListener('click', () => row.remove());
    const update = () => {
        places.max = definitions.find(value => value.key === native.value)?.requested || 1;
        tourLabel.hidden = source.value !== 'tourRanking';
        resultLabel.hidden = source.value !== 'tournament';
        countryLabel.hidden = rankingLabel.hidden = source.value !== 'country';
    };
    native.addEventListener('change', update); source.addEventListener('change', update); update();
    row.append(labelField('nativeRoute', native), labelField('routeSource', source), labelField('routePlaces', places), remove,
        tourLabel, resultLabel, countryLabel, rankingLabel);
    container.appendChild(row);
}

function updateTournamentEditorNativeRouteFields() {
    const panel = tournamentEditorElement('te-native-route-panel');
    if (panel) panel.hidden = tournamentEditorValue('te-qualification-mode') !== 'native'
        || !getTournamentEditorNativeRouteDefinitions(tournamentEditorSelected).length;
}

function populateTournamentEditorNativeRoutes(tournament) {
    const container = tournamentEditorElement('te-native-routes');
    if (!container) return;
    container.replaceChildren();
    (tournament?.editorNativeRoutes || []).forEach(addTournamentEditorNativeRoute);
    refreshTournamentEditorNativeRouteTranslations();
}

function refreshTournamentEditorNativeRouteTranslations() {
    const panel = tournamentEditorElement('te-native-route-panel');
    if (!panel) return;
    for (const [id, key] of [['te-native-route-title', 'nativeRoutes'], ['te-native-route-hint', 'nativeRouteHint'], ['te-add-native-route', 'addNativeRoute']])
        tournamentEditorElement(id).textContent = trTournamentEditor(key);
    const definitions = getTournamentEditorNativeRouteDefinitions(tournamentEditorSelected);
    panel.querySelectorAll('[data-te-native-text]').forEach(label => { label.textContent = trTournamentEditor(label.dataset.teNativeText); });
    panel.querySelectorAll('.te-native-key option').forEach(option => {
        const definition = definitions.find(value => value.key === option.value);
        if (definition) option.textContent = tournamentEditorNativeDefinitionLabel(definition);
    });
    panel.querySelectorAll('.te-native-source option, .te-native-ranking option').forEach(option => {
        option.textContent = trTournamentEditor(option.value === 'country' ? 'countryRoute' : option.value);
    });
    panel.querySelectorAll('.te-native-tour option[value=""]').forEach(option => { option.textContent = trTournamentEditor('selectTourRanking'); });
    panel.querySelectorAll('.te-native-tournament option[value=""]').forEach(option => { option.textContent = trTournamentEditor('selectTournamentSource'); });
    panel.querySelectorAll('.te-native-country option').forEach(option => {
        option.textContent = option.value ? (typeof t === 'function' ? t(option.value) : option.value) : trTournamentEditor('selectCountry');
    });
    panel.querySelectorAll('button').forEach(button => { if (button.id !== 'te-add-native-route') button.setAttribute('aria-label', trTournamentEditor('removeRoute')); });
}

function getTournamentEditorNativeRoutesFormData(values) {
    if (values.editorQualification || tournamentEditorValue('te-qualification-mode') !== 'native') return null;
    const proposed = { ...tournamentEditorSelected, ...values,
        sourceName: tournamentEditorSelected?.sourceName || tournamentEditorSelected?.name || values.name };
    const rows = [...document.querySelectorAll('#te-native-routes .te-native-route')].map(row => ({
        nativeKey: row.querySelector('.te-native-key').value, source: row.querySelector('.te-native-source').value,
        places: Number(row.querySelector('.te-native-places').value), tourId: row.querySelector('.te-native-tour').value,
        tournamentKey: row.querySelector('.te-native-tournament').value,
        country: row.querySelector('.te-native-country').value, ranking: row.querySelector('.te-native-ranking').value
    }));
    try {
        const routes = normalizeTournamentEditorNativeRoutes(rows, proposed);
        validateTournamentEditorNativeRouteLinks(proposed, routes);
        validateTournamentEditorResultSourceLinks(proposed, routes);
        return routes;
    } catch (_error) { throw new Error(trTournamentEditor('invalidNativeRoute')); }
}
