// Replace a quota inside the native World Championship field without changing its stages.
const TOURNAMENT_EDITOR_NATIVE_ROUTE_TEXT = {
    nativeRoutes: ['Podmiana pojedynczych ścieżek MŚ', 'Replace individual World Championship routes', 'Einzelne WM-Qualifikationswege ersetzen', 'Afzonderlijke WK-routes vervangen'],
    nativeRouteHint: ['Wybierz ścieżkę i liczbę miejsc do podmiany. Pozostałe miejsca, rozstawienie i format MŚ zostają zachowane. Ranking cyklu musi być własny, a wszystkie jego turnieje muszą skończyć się przed MŚ. Awans przechodzi na kolejnego niezakwalifikowanego zawodnika; braki uzupełnia OOM.', 'Choose a route and the number of places to replace. Other places, seeding and World Championship stages are preserved. The cycle needs its own ranking and all its events must finish before the World Championship. Places pass to the next unqualified player; shortfalls are filled by OOM.', 'Wähle einen Weg und die Anzahl der zu ersetzenden Plätze. Andere Plätze, Setzliste und WM-Phasen bleiben erhalten. Der Zyklus braucht eine eigene Rangliste und muss vor der WM enden. Plätze gehen an den nächsten nicht qualifizierten Spieler; Lücken füllt die OOM.', 'Kies een route en het aantal te vervangen plaatsen. Andere plaatsen, plaatsing en WK-fases blijven behouden. De cyclus heeft een eigen ranking nodig en moet vóór het WK eindigen. Plaatsen schuiven door naar de volgende ongeplaatste speler; tekorten worden aangevuld via de OOM.'],
    nativeRoute: ['Ścieżka do podmiany', 'Route to replace', 'Zu ersetzender Weg', 'Te vervangen route'],
    nativeRouteExample: ['Przykład: Azja + Liderzy rankingu cyklu + Asian Tour + 4 miejsca daje awans pierwszej czwórce cyklu.', 'Example: Asia + Cycle ranking leaders + Asian Tour + 4 places qualifies the cycle’s top four players.', 'Beispiel: Asien + Führende der Zyklusrangliste + Asian Tour + 4 Plätze qualifiziert die besten vier Spieler des Zyklus.', 'Voorbeeld: Azië + Leiders van de cyclusranking + Asian Tour + 4 plaatsen laat de beste vier spelers van de cyclus kwalificeren.'],
    nativeSystemHint: ['Pojedyncze ścieżki MŚ możesz podmienić poniżej, zachowując wbudowane zasady turnieju.', 'Replace individual World Championship routes below while preserving the built-in event rules.', 'Einzelne WM-Wege unten ersetzen und die integrierten Turnierregeln beibehalten.', 'Vervang hieronder afzonderlijke WK-routes en behoud de ingebouwde toernooiregels.'],
    addNativeRoute: ['＋ Podmień ścieżkę', '＋ Replace route', '＋ Weg ersetzen', '＋ Route vervangen'],
    invalidNativeRoute: ['Sprawdź podmieniane ścieżki: każdą można wybrać raz, a liczba miejsc nie może przekraczać jej puli. Cykl musi mieć własny ranking i zakończyć się przed MŚ.', 'Check replacement routes: select each once and keep places within its quota. The cycle must have its own ranking and finish before the World Championship.', 'Ersatzwege prüfen: jeden nur einmal wählen und die Platzanzahl nicht überschreiten. Der Zyklus braucht eine eigene Rangliste und muss vor der WM enden.', 'Controleer vervangende routes: kies elke route één keer en blijf binnen het aantal plaatsen. De cyclus moet een eigen ranking hebben en vóór het WK eindigen.']
};
Object.entries(TOURNAMENT_EDITOR_NATIVE_ROUTE_TEXT).forEach(([key, texts]) =>
    ['pl', 'en', 'de', 'nl'].forEach((language, index) => { TOURNAMENT_EDITOR_TEXT[language][key] = texts[index]; }));
['pl', 'en', 'de', 'nl'].forEach(language => {
    TOURNAMENT_EDITOR_TEXT[language].nativeRouteHint += ` ${TOURNAMENT_EDITOR_TEXT[language].nativeRouteExample}`;
});

function tournamentEditorNativeDefinitionLabel(definition) {
    const label = typeof getPlanningRouteLabel === 'function' ? getPlanningRouteLabel(definition.key) : definition.label;
    return `${label} (${definition.requested})`;
}

function addTournamentEditorNativeRoute(route = null) {
    const container = tournamentEditorElement('te-native-routes');
    const definitions = getTournamentEditorNativeRouteDefinitions(tournamentEditorSelected);
    const used = [...container.querySelectorAll('.te-native-key')].map(select => select.value);
    const definition = definitions.find(candidate => !used.includes(candidate.key));
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
    ['tourRanking', ...Object.keys(TOURNAMENT_EDITOR_RANKINGS), 'country'].forEach(key =>
        appendTournamentEditorOption(source, key, trTournamentEditor(key === 'country' ? 'countryRoute' : key)));
    source.value = route.source;
    const places = document.createElement('input'); places.className = 'te-native-places';
    places.type = 'number'; places.min = '1'; places.step = '1'; places.value = route.places;
    const tour = document.createElement('select'); tour.className = 'te-native-tour';
    populateTournamentEditorTourRankingOptions(tour, route.tourId);
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
        countryLabel.hidden = rankingLabel.hidden = source.value !== 'country';
    };
    native.addEventListener('change', update); source.addEventListener('change', update); update();
    row.append(labelField('nativeRoute', native), labelField('routeSource', source), labelField('routePlaces', places), remove,
        tourLabel, countryLabel, rankingLabel);
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
        country: row.querySelector('.te-native-country').value, ranking: row.querySelector('.te-native-ranking').value
    }));
    try {
        const routes = normalizeTournamentEditorNativeRoutes(rows, proposed);
        validateTournamentEditorNativeRouteLinks(proposed, routes);
        return routes;
    } catch (_error) { throw new Error(trTournamentEditor('invalidNativeRoute')); }
}
