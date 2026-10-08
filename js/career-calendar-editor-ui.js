const CAREER_CALENDAR_EDITOR_TEXT = {
    pl: {
        manage: 'Cykle i karty', manageHint: 'Zbuduj własny system rozgrywek. Zasady cyklu obowiązują we wszystkich jego turniejach.',
        clear: 'Wyczyść cały kalendarz', clearConfirm: 'Usunąć wszystkie turnieje i kwalifikacje z tej kariery? Kalendarz pozostanie pusty także po wczytaniu gry i w kolejnych sezonach. Wyniki historyczne zostaną zachowane.', cleared: 'Kalendarz został wyczyszczony.',
        tours: 'Zarządzaj cyklami', cards: 'Zarządzaj kartami', choose: 'Wybierz', newTour: '＋ Nowy cykl', newCard: '＋ Nowa karta',
        name: 'Nazwa', ranking: 'Ranking cyklu', nativeRanking: 'Wbudowane rankingi', ownRanking: 'Własny ranking sezonowy (£)', noRanking: 'Bez rankingu',
        entry: 'Uczestnictwo w całym cyklu', nativeEntry: 'Zasady każdego turnieju', openEntry: 'Otwarty cykl', cardEntry: 'Wymagana karta', fixedEntry: 'Stały skład',
        size: 'Liczba uczestników', roster: 'Zawodnicy (Ctrl / ⌘ — wybór wielu)', rosterHint: 'Wybierz dokładnie tylu zawodników, ile wynosi liczba uczestników. Ten sam skład zagra we wszystkich turniejach cyklu; niedostępni zawodnicy zostawią wolne miejsca.',
        card: 'Wymagana karta', none: 'Bez dodatkowej karty', save: 'Zapisz', remove: 'Usuń cykl wraz z turniejami', removeCard: 'Usuń kartę',
        removeConfirm: 'Usunąć cykl {name} i jego turnieje ({count}), wraz z powiązanymi kwalifikacjami?', cardConfirm: 'Usunąć kartę {name} ze wszystkich zawodników?',
        saved: 'Zapisano ustawienia.', removed: 'Usunięto cykl.', cardRemoved: 'Usunięto kartę.', invalid: 'Sprawdź nazwę, liczby, kartę i skład cyklu.', usedCard: 'Ta karta jest wymagana przez cykl lub turniej. Najpierw zmień jego zasady uczestnictwa.',
        tier: 'Poziom karty (wyżej = silniejsza)', higher: 'Akceptuj także karty wyższego poziomu', duration: 'Ważność karty (sezony)',
        awardTour: 'Karta za miejsce w rankingu cyklu', manual: 'Tylko ręczne przydzielanie', awardPlaces: 'Miejsca nagradzane kartą',
        holders: 'Posiadacze karty', cardHint: 'Karty własne są przyznawane liderom wybranego rankingu na kolejny sezon. Możesz także przydzielać je ręcznie. Karta wyższego poziomu daje dostęp, gdy wymagany typ akceptuje wyższe poziomy.',
        pdcHint: 'Karta PDC zachowuje kwalifikacje Q-School i reguły gry. Zmienione limity działają od następnego cyklu kart; ręczny skład działa od razu.',
        oom: 'Karty z głównego OOM', qschool: 'Karty z Q-School', secondary: 'Karty z każdego cyklu młodzieżowego / Challenge Tour',
        roundMode: 'Legi osobno dla każdej rundy', roundHint: 'Legi potrzebne do wygrania meczu. 0 oznacza wbudowany format tej rundy.', final: 'Finał', semi: 'Półfinał', quarter: 'Ćwierćfinał', last: 'Ostatnia {count}',
        search: 'Szukaj zawodników…', tourCardHint: 'Dodatkowa karta obowiązuje zarówno gracza, jak i zawodników AI. Ustawienia cyklu mogą wymagać innej karty.',
        tourRuleHint: 'Otwarty cykl, karta i stały skład ustalają uczestników całego cyklu, zastępując kwalifikacje poszczególnych turniejów. Własne grupy i ligi zachowują swój format. Ranking własny nie zasila innych rankingów.',
        configPack: 'Pakiet zawiera również ustawienia cykli i kart; ich import zastąpi obecne ustawienia. Posiadacze kart i wyniki rankingowe pozostaną danymi tej kariery.'
    },
    en: {
        manage: 'Tours and cards', manageHint: 'Build your own competition system. Tour rules apply to every event in that tour.',
        clear: 'Clear the entire calendar', clearConfirm: 'Remove all events and qualifiers from this career? The calendar will remain empty after loading and in future seasons. Historical results will be kept.', cleared: 'The calendar has been cleared.',
        tours: 'Manage tours', cards: 'Manage cards', choose: 'Select', newTour: '＋ New tour', newCard: '＋ New card',
        name: 'Name', ranking: 'Tour ranking', nativeRanking: 'Built-in rankings', ownRanking: 'Separate seasonal ranking (£)', noRanking: 'No ranking',
        entry: 'Entry across the tour', nativeEntry: 'Individual event rules', openEntry: 'Open tour', cardEntry: 'Card required', fixedEntry: 'Fixed field',
        size: 'Field size', roster: 'Players (Ctrl / ⌘ to select multiple)', rosterHint: 'Select exactly the field size. The same players enter every event in this tour; unavailable players leave byes.',
        card: 'Required card', none: 'No additional card', save: 'Save', remove: 'Remove tour and events', removeCard: 'Remove card',
        removeConfirm: 'Remove {name} and its events ({count}), including linked qualifiers?', cardConfirm: 'Remove {name} from all players?',
        saved: 'Settings saved.', removed: 'Tour removed.', cardRemoved: 'Card removed.', invalid: 'Check the name, numbers, card and tour field.', usedCard: 'A tour or event requires this card. Change its entry rules first.',
        tier: 'Card tier (higher = stronger)', higher: 'Also accept higher-tier cards', duration: 'Card duration (seasons)',
        awardTour: 'Earn through a tour ranking', manual: 'Manual assignment only', awardPlaces: 'Ranking places receiving a card',
        holders: 'Card holders', cardHint: 'Custom cards are awarded to the chosen tour ranking leaders for the next season. You can also assign them manually. A higher-tier card grants access when the required type accepts higher tiers.',
        pdcHint: 'The PDC card keeps Q-School and game qualification rules. New limits take effect next card cycle; manual holders change immediately.',
        oom: 'Main OOM card places', qschool: 'Q-School card places', secondary: 'Card places from each Development / Challenge Tour',
        roundMode: 'Legs per round', roundHint: 'Legs needed to win a match. 0 uses that round’s built-in format.', final: 'Final', semi: 'Semi-final', quarter: 'Quarter-final', last: 'Last {count}',
        search: 'Search players…', tourCardHint: 'The additional card applies to your player and AI entrants. Tour rules may require a different card.',
        tourRuleHint: 'Open, card and fixed-field tours determine entrants across the tour, replacing individual event qualification. Custom groups and leagues retain their format. A separate ranking does not feed other rankings.',
        configPack: 'This pack also contains tour and card settings; importing it replaces current settings. Card holders and ranking results remain career data.'
    }
};
Object.assign(CAREER_CALENDAR_EDITOR_TEXT.pl, { managedHint: 'Cykl {name}: {size} uczestników. Skład i kwalifikacje ustawiasz w „Zarządzaj cyklami” powyżej.' });
Object.assign(CAREER_CALENDAR_EDITOR_TEXT.en, { managedHint: '{name} tour: {size} players. Configure its field and entry rules in “Manage tours” above.' });
CAREER_CALENDAR_EDITOR_TEXT.de = {
    manage: 'Touren und Karten', manageHint: 'Erstelle dein eigenes Turniersystem. Tourregeln gelten für alle Turniere dieser Tour.',
    clear: 'Gesamten Kalender leeren', clearConfirm: 'Alle Turniere und Qualifikationen dieser Karriere entfernen? Der Kalender bleibt nach dem Laden und in zukünftigen Saisons leer. Historische Ergebnisse bleiben erhalten.', cleared: 'Der Kalender wurde geleert.',
    tours: 'Touren verwalten', cards: 'Karten verwalten', choose: 'Auswählen', newTour: '＋ Neue Tour', newCard: '＋ Neue Karte', name: 'Name',
    ranking: 'Tourrangliste', nativeRanking: 'Integrierte Ranglisten', ownRanking: 'Eigene Saisonrangliste (£)', noRanking: 'Keine Rangliste',
    entry: 'Teilnahme an der gesamten Tour', nativeEntry: 'Regeln der einzelnen Turniere', openEntry: 'Offene Tour', cardEntry: 'Karte erforderlich', fixedEntry: 'Festes Teilnehmerfeld',
    size: 'Teilnehmerzahl', roster: 'Spieler (Strg / ⌘ für Mehrfachauswahl)', rosterHint: 'Wähle genau so viele Spieler wie die Teilnehmerzahl. Dieselben Spieler nehmen an jedem Turnier teil; nicht verfügbare Spieler hinterlassen Freilose.',
    card: 'Erforderliche Karte', none: 'Keine zusätzliche Karte', save: 'Speichern', remove: 'Tour und Turniere entfernen', removeCard: 'Karte entfernen',
    removeConfirm: '{name} mit seinen Turnieren ({count}) und verknüpften Qualifikationen entfernen?', cardConfirm: '{name} bei allen Spielern entfernen?',
    saved: 'Einstellungen gespeichert.', removed: 'Tour entfernt.', cardRemoved: 'Karte entfernt.', invalid: 'Prüfe Name, Zahlen, Karte und Teilnehmerfeld.', usedCard: 'Eine Tour oder ein Turnier benötigt diese Karte. Ändere zuerst die Teilnahmebedingungen.',
    tier: 'Kartenstufe (höher = stärker)', higher: 'Auch Karten höherer Stufen akzeptieren', duration: 'Gültigkeit (Saisons)',
    awardTour: 'Karte über eine Tourrangliste verdienen', manual: 'Nur manuelle Vergabe', awardPlaces: 'Ranglistenplätze mit Karte', holders: 'Karteninhaber',
    cardHint: 'Eigene Karten werden für die nächste Saison an die besten Spieler der gewählten Rangliste vergeben. Du kannst sie auch manuell vergeben. Höhere Stufen gelten, wenn die erforderliche Karte sie akzeptiert.',
    pdcHint: 'Die PDC-Karte behält Q-School und die Spielregeln. Neue Limits gelten ab dem nächsten Kartenzyklus; manuelle Inhaber gelten sofort.',
    oom: 'Karten über den Haupt-OOM', qschool: 'Karten über Q-School', secondary: 'Karten je Development / Challenge Tour',
    roundMode: 'Legs je Runde', roundHint: 'Legs zum Matchsieg. 0 nutzt das integrierte Rundenformat.', final: 'Finale', semi: 'Halbfinale', quarter: 'Viertelfinale', last: 'Letzte {count}',
    search: 'Spieler suchen…', tourCardHint: 'Die zusätzliche Karte gilt für deinen Spieler und KI-Spieler. Die Tourregeln können eine andere Karte verlangen.',
    tourRuleHint: 'Offene Touren, Kartentouren und feste Felder bestimmen die Teilnehmer der Tour und ersetzen einzelne Qualifikationsregeln. Eigene Gruppen und Ligen behalten ihr Format. Eigene Ranglisten zählen nicht zu anderen Ranglisten.',
    configPack: 'Dieses Paket enthält Tour- und Karteneinstellungen und ersetzt die aktuellen Einstellungen. Karteninhaber und Ranglistenergebnisse bleiben Karrieredaten.',
    managedHint: 'Tour {name}: {size} Spieler. Feld und Teilnahmebedingungen werden oben unter „Touren verwalten“ festgelegt.'
};
CAREER_CALENDAR_EDITOR_TEXT.nl = {
    manage: 'Tours en kaarten', manageHint: 'Maak je eigen toernooisysteem. Tourregels gelden voor alle evenementen in die tour.',
    clear: 'Hele kalender wissen', clearConfirm: 'Alle toernooien en kwalificaties uit deze carrière verwijderen? De kalender blijft leeg na laden en in volgende seizoenen. Historische resultaten blijven behouden.', cleared: 'De kalender is gewist.',
    tours: 'Tours beheren', cards: 'Kaarten beheren', choose: 'Selecteren', newTour: '＋ Nieuwe tour', newCard: '＋ Nieuwe kaart', name: 'Naam',
    ranking: 'Tourranglijst', nativeRanking: 'Ingebouwde ranglijsten', ownRanking: 'Eigen seizoensranglijst (£)', noRanking: 'Geen ranglijst',
    entry: 'Deelname aan de hele tour', nativeEntry: 'Regels per toernooi', openEntry: 'Open tour', cardEntry: 'Kaart vereist', fixedEntry: 'Vast deelnemersveld',
    size: 'Aantal deelnemers', roster: 'Spelers (Ctrl / ⌘ voor meerdere)', rosterHint: 'Selecteer precies het aantal deelnemers. Dezelfde spelers doen aan elk toernooi mee; niet-beschikbare spelers laten byes achter.',
    card: 'Vereiste kaart', none: 'Geen extra kaart', save: 'Opslaan', remove: 'Tour en toernooien verwijderen', removeCard: 'Kaart verwijderen',
    removeConfirm: '{name} met de toernooien ({count}) en gekoppelde kwalificaties verwijderen?', cardConfirm: '{name} van alle spelers verwijderen?',
    saved: 'Instellingen opgeslagen.', removed: 'Tour verwijderd.', cardRemoved: 'Kaart verwijderd.', invalid: 'Controleer naam, getallen, kaart en deelnemersveld.', usedCard: 'Een tour of toernooi vereist deze kaart. Wijzig eerst de deelnameregels.',
    tier: 'Kaartniveau (hoger = sterker)', higher: 'Ook kaarten van hogere niveaus toelaten', duration: 'Geldigheid (seizoenen)',
    awardTour: 'Kaart verdienen via een tourranglijst', manual: 'Alleen handmatig toewijzen', awardPlaces: 'Ranglijstplaatsen die een kaart krijgen', holders: 'Kaarthouders',
    cardHint: 'Eigen kaarten gaan voor het volgende seizoen naar de leiders van de gekozen ranglijst. Je kunt ze ook handmatig toewijzen. Hogere niveaus gelden wanneer de vereiste kaart ze accepteert.',
    pdcHint: 'De PDC-kaart behoudt Q-School en de spelregels. Nieuwe limieten gelden vanaf de volgende kaartcyclus; handmatige kaarthouders gelden meteen.',
    oom: 'Kaarten via de hoofd-OOM', qschool: 'Kaarten via Q-School', secondary: 'Kaarten per Development / Challenge Tour',
    roundMode: 'Legs per ronde', roundHint: 'Legs voor een wedstrijdzege. 0 gebruikt het ingebouwde rondeformaat.', final: 'Finale', semi: 'Halve finale', quarter: 'Kwartfinale', last: 'Laatste {count}',
    search: 'Spelers zoeken…', tourCardHint: 'De extra kaart geldt voor jouw speler en AI-spelers. Tourregels kunnen een andere kaart vereisen.',
    tourRuleHint: 'Open tours, kaarttours en vaste velden bepalen de deelnemers van de tour en vervangen kwalificatieregels per toernooi. Eigen groepen en competities behouden hun formaat. Eigen ranglijsten tellen niet mee voor andere ranglijsten.',
    configPack: 'Dit pakket bevat tour- en kaartinstellingen en vervangt de huidige instellingen. Kaarthouders en ranglijstresultaten blijven carrièregegevens.',
    managedHint: 'Tour {name}: {size} spelers. Stel het veld en de deelnameregels hierboven in bij “Tours beheren”.'
};
function trCareerEditor(key, params = {}) {
    const text = CAREER_CALENDAR_EDITOR_TEXT[typeof currentLang === 'string' ? currentLang : 'pl'] || CAREER_CALENDAR_EDITOR_TEXT.en;
    return String(text[key] || key).replace(/\{(\w+)\}/g, (_, field) => String(params[field] ?? ''));
}
function careerEditorHtml(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function careerEditorOptions(items, selected = '') {
    return items.map(([value, label]) => `<option value="${careerEditorHtml(value)}"${value === selected ? ' selected' : ''}>${careerEditorHtml(label)}</option>`).join('');
}
function careerEditorTourChoices() {
    const state = getCareerCalendarEditorState();
    const tours = new Map();
    const language = TOURNAMENT_EDITOR_TEXT[currentLang] ? currentLang : 'en';
    TOURNAMENT_EDITOR_CYCLES.filter(id => !['auto', 'custom'].includes(id)).forEach(id => {
        const index = TOURNAMENT_EDITOR_CYCLES.indexOf(id);
        tours.set(id, TOURNAMENT_EDITOR_TEXT[language].cycleOptions[index]);
    });
    tournamentDatabase.forEach(event => {
        const id = getCareerEditorTourId(event);
        if (!tours.has(id)) tours.set(id, event.editorTourName || id);
    });
    state.tours.forEach(tour => { if (!tour.removed) tours.set(tour.id, tour.name); else tours.delete(tour.id); });
    return [...tours];
}
function careerEditorPlayerOptions(selected = []) {
    const keys = new Set(selected);
    return getTournamentEditorCandidates().sort((a, b) => a.name.localeCompare(b.name)).map(candidate => {
        const key = getTournamentEditorPlayerKey(candidate);
        return `<option value="${careerEditorHtml(key)}"${keys.has(key) ? ' selected' : ''}>${careerEditorHtml(candidate.name)} · ${careerEditorHtml(candidate.country)}</option>`;
    }).join('');
}
function careerEditorSelectedPlayers(id) { return [...document.getElementById(id).selectedOptions].map(option => option.value); }
function filterCareerEditorPlayers(input, id) {
    const search = input.value.trim().toLocaleLowerCase();
    [...document.getElementById(id).options].forEach(option => { option.hidden = !option.textContent.toLocaleLowerCase().includes(search); });
}
function careerEditorLabel(key, input) { return `<label><span>${careerEditorHtml(trCareerEditor(key))}</span>${input}</label>`; }
function careerEditorNumber(id, value, min, max) { return `<input id="${id}" type="number" min="${min}" max="${max}" step="1" value="${value}" required>`; }
function careerEditorInteger(id, min, max) {
    const raw = document.getElementById(id).value, value = Number(raw);
    if (!raw.trim() || !Number.isInteger(value) || value < min || value > max) throw new Error(trCareerEditor('invalid'));
    return value;
}
function renderCareerCalendarManager() {
    const panel = document.getElementById('career-calendar-manager');
    if (!panel) return;
    const tours = careerEditorTourChoices();
    const cards = [['pdc', getCareerEditorCard('pdc').name], ...getCareerCalendarEditorState().cards.map(card => [card.id, card.name])];
    panel.innerHTML = `<div class="career-editor-toolbar"><div><h3>${careerEditorHtml(trCareerEditor('manage'))}</h3><p>${careerEditorHtml(trCareerEditor('manageHint'))}</p></div><button type="button" id="te-clear-calendar" onclick="clearCareerEditorCalendar()">${careerEditorHtml(trCareerEditor('clear'))}</button></div>
        <div class="career-editor-managers"><details id="ce-tours"><summary>${careerEditorHtml(trCareerEditor('tours'))}</summary><select id="ce-tour-select" aria-label="${careerEditorHtml(trCareerEditor('tours'))}" onchange="populateCareerTourManager(this.value)">${careerEditorOptions([['', trCareerEditor('newTour')], ...tours])}</select><div id="ce-tour-form"></div></details>
        <details id="ce-cards"><summary>${careerEditorHtml(trCareerEditor('cards'))}</summary><select id="ce-card-select" aria-label="${careerEditorHtml(trCareerEditor('cards'))}" onchange="populateCareerCardManager(this.value)">${careerEditorOptions([['', trCareerEditor('newCard')], ...cards], 'pdc')}</select><div id="ce-card-form"></div></details></div><p id="ce-status" role="status"></p>`;
    populateCareerTourManager('');
    populateCareerCardManager('pdc');
    refreshCareerEditorEventCards();
}
function refreshCareerCalendarManagerTranslations() {
    const panel = document.getElementById('career-calendar-manager');
    if (!panel) return;
    const values = [...panel.querySelectorAll('input[id], select[id]')].map(node => ({ id: node.id, value: node.value,
        checked: node.checked, selected: node.multiple ? [...node.selectedOptions].map(option => option.value) : null }));
    const open = [...panel.querySelectorAll('details[id]')].map(node => [node.id, node.open]);
    renderCareerCalendarManager();
    for (const id of ['ce-tour-select', 'ce-card-select']) {
        const saved = values.find(value => value.id === id);
        if (saved) { document.getElementById(id).value = saved.value; (id === 'ce-tour-select' ? populateCareerTourManager : populateCareerCardManager)(saved.value); }
    }
    values.forEach(saved => {
        const node = document.getElementById(saved.id);
        if (!node) return;
        if (saved.selected) [...node.options].forEach(option => { option.selected = saved.selected.includes(option.value); });
        else { node.value = saved.value; if (node.type === 'checkbox') node.checked = saved.checked; }
    });
    open.forEach(([id, value]) => { document.getElementById(id).open = value; });
    updateCareerTourManagerFields();
}
function populateCareerTourManager(id) {
    const saved = getCareerCalendarEditorState().tours.find(tour => tour.id === id);
    const tour = saved || { id, name: new Map(careerEditorTourChoices()).get(id) || '', ranking: id && !id.startsWith('custom:') ? 'native' : 'own', entry: 'native', fieldSize: 32, playerKeys: [] };
    const options = careerEditorOptions([['native', trCareerEditor('nativeRanking')], ['own', trCareerEditor('ownRanking')], ['none', trCareerEditor('noRanking')]], tour.ranking);
    const cards = [['pdc', getCareerEditorCard('pdc').name], ...getCareerCalendarEditorState().cards.map(card => [card.id, card.name])];
    document.getElementById('ce-tour-form').innerHTML = `<form onsubmit="saveCareerTourManager(event)"><div class="tournament-editor-fields">
        ${careerEditorLabel('name', `<input id="ce-tour-name" value="${careerEditorHtml(tour.name)}" maxlength="80" required>`)}
        ${careerEditorLabel('ranking', `<select id="ce-tour-ranking">${options}</select>`)}
        ${careerEditorLabel('entry', `<select id="ce-tour-entry" onchange="updateCareerTourManagerFields()">${careerEditorOptions(['native', 'open', 'card', 'fixed'].map((value, index) => [value, trCareerEditor(['nativeEntry', 'openEntry', 'cardEntry', 'fixedEntry'][index])]), tour.entry)}</select>`)}
        <div id="ce-tour-size-wrap">${careerEditorLabel('size', `<select id="ce-tour-size">${careerEditorOptions(CAREER_EDITOR_FIELD_SIZES.map(size => [String(size), String(size)]), String(tour.fieldSize))}</select>`)}</div>
        <div id="ce-tour-card-wrap">${careerEditorLabel('card', `<select id="ce-tour-card">${careerEditorOptions(cards, tour.requiredCardId)}</select>`)}</div></div>
        <div id="ce-tour-roster-wrap">${careerEditorLabel('roster', `<input type="search" placeholder="${careerEditorHtml(trCareerEditor('search'))}" oninput="filterCareerEditorPlayers(this, 'ce-tour-roster')"><select id="ce-tour-roster" multiple size="8">${careerEditorPlayerOptions(tour.playerKeys)}</select>`)}<p>${careerEditorHtml(trCareerEditor('rosterHint'))}</p></div>
        <p>${careerEditorHtml(trCareerEditor('tourRuleHint'))}</p>${typeof renderCareerTourPromotionFields === 'function' ? renderCareerTourPromotionFields(tour) : ''}<div class="career-editor-actions"><button type="submit">${careerEditorHtml(trCareerEditor('save'))}</button>${id ? `<button type="button" class="ce-danger" onclick="removeCareerEditorTour()">${careerEditorHtml(trCareerEditor('remove'))}</button>` : ''}</div></form>`;
    updateCareerTourManagerFields();
}
function updateCareerTourManagerFields() {
    const entry = document.getElementById('ce-tour-entry').value;
    document.getElementById('ce-tour-size-wrap').hidden = entry === 'native';
    document.getElementById('ce-tour-card-wrap').hidden = entry !== 'card';
    document.getElementById('ce-tour-roster-wrap').hidden = entry !== 'fixed';
}
function setCareerEditorStatus(text, error = false) {
    const status = document.getElementById('ce-status');
    if (status) { status.textContent = text; status.classList.toggle('is-error', error); }
}
async function persistCareerEditorSettings(message) {
    let saved;
    try { saved = typeof saveGame !== 'function' || await saveGame(true, { immediate: true }); }
    catch (_) { saved = false; }
    setCareerEditorStatus(saved === false ? trTournamentEditor('saveFailed') : message, saved === false);
}
async function saveCareerTourManager(event) {
    event?.preventDefault();
    try {
        const state = getCareerCalendarEditorState();
        const oldId = document.getElementById('ce-tour-select').value;
        const name = document.getElementById('ce-tour-name').value.trim().replace(/\s+/g, ' ');
        const id = oldId || `custom:${encodeURIComponent(name.toLocaleLowerCase())}`;
        if (!name || !oldId && state.tours.some(tour => tour.id === id && !tour.removed)
            || state.tours.some(tour => tour.id !== oldId && tour.id.startsWith('custom:') && !tour.removed
                && tour.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error(trCareerEditor('invalid'));
        const events = tournamentDatabase.filter(tournament => getCareerEditorTourId(tournament) === id);
        if (events.some(isTournamentEditorActive)) throw new Error(trTournamentEditor('inUse'));
        const tour = { id, name, ranking: document.getElementById('ce-tour-ranking').value,
            entry: document.getElementById('ce-tour-entry').value, fieldSize: Number(document.getElementById('ce-tour-size').value),
            playerKeys: careerEditorSelectedPlayers('ce-tour-roster'), requiredCardId: document.getElementById('ce-tour-card').value, removed: false,
            promotion: typeof getCareerTourPromotionFormData === 'function' ? getCareerTourPromotionFormData() : undefined };
        const cards = state.cards.map(card => card.awardTourId === id && tour.ranking !== 'own'
            ? { ...card, awardTourId: null, awardPlaces: 0 } : card);
        const configuration = normalizeCareerCalendarConfiguration({ ...state, cards, tours: [...state.tours.filter(item => item.id !== id), tour] });
        const leagueUpdates = typeof prepareEditorLeagueTourUpdate === 'function' ? prepareEditorLeagueTourUpdate(events, tour) : [];
        state.tours = configuration.tours;
        state.cards = configuration.cards;
        for (const [root, updated] of leagueUpdates) {
            Object.assign(root, updated);
            rebuildEditorLeagueCalendar(root);
        }
        if (id.startsWith('custom:')) {
            events.forEach(tournament => { tournament.editorTourName = name; tournament.editorModified = true; });
            if (events.includes(tournamentEditorSelected)) document.getElementById('te-custom-tour').value = name;
        }
        if (id === 'premierLeague' && tour.entry === 'fixed' && typeof gdlTable !== 'undefined') {
            const candidates = getTournamentEditorCandidates();
            gdlTable = tour.playerKeys.map(key => {
                const candidate = candidates.find(item => getTournamentEditorPlayerKey(item) === key);
                return gdlTable.find(row => getTournamentEditorPlayerKey(row.player) === key)
                    || { player: candidate, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 };
            }).filter(row => row.player);
        }
        renderCareerCalendarManager();
        document.getElementById('ce-tours').open = true;
        document.getElementById('ce-tour-select').value = id;
        populateCareerTourManager(id);
        refreshTournamentEditorTourSuggestions();
        updateTournamentEditorManagedTourFields();
        await persistCareerEditorSettings(trCareerEditor('saved'));
        return true;
    } catch (error) { setCareerEditorStatus(error.message === 'Invalid tour/card configuration' ? trCareerEditor('invalid') : error.message, true); return false; }
}
function removeCareerEditorEvents(events) {
    const removed = new Set(events);
    // Follow qualifier links recursively; never leave a qualifier for a removed event.
    let changed = true;
    while (changed) {
        changed = false;
        const names = new Set([...removed].flatMap(event => [event.name, event.sourceName]).filter(Boolean));
        tournamentDatabase.forEach(event => { if (!removed.has(event) && (names.has(event.qualifierFor)
            || [...removed].some(root => event.editorLeagueParentKey === tournamentEditorKey(root)))) { removed.add(event); changed = true; } });
    }
    if ([...removed].some(isTournamentEditorActive)) throw new Error(trTournamentEditor('inUse'));
    const keys = new Set(player.tournamentEditorDeletedKeys || []);
    removed.forEach(event => keys.add(tournamentEditorKey(event)));
    player.tournamentEditorDeletedKeys = [...keys];
    tournamentDatabase.splice(0, tournamentDatabase.length, ...tournamentDatabase.filter(event => !removed.has(event)));
    // Release custom routes pointing at removed qualifiers.
    tournamentDatabase.forEach(main => {
        const rules = main.editorQualification;
        if (!rules?.routes) return;
        let freed = 0;
        rules.routes = rules.routes.filter(route => { if (route.source === 'qualifier' && keys.has(route.qualifierKey)) { freed += route.places; return false; } return true; });
        if (freed) { const direct = rules.routes.find(route => route.source !== 'qualifier'); if (direct) direct.places += freed; else rules.routes.unshift({ source: 'oom', places: freed }); }
    });
    tournamentEditorSelected = null;
    if (tournamentDatabase.length) populateTournamentEditorForm(tournamentDatabase[0]); else startAddingTournament();
}
async function clearCareerEditorCalendar() {
    if (typeof activeTournament !== 'undefined' && activeTournament) { setCareerEditorStatus(trTournamentEditor('inUse'), true); return false; }
    if (!confirm(trCareerEditor('clearConfirm'))) return false;
    const state = getCareerCalendarEditorState();
    careerEditorTourChoices().forEach(([id, name]) => {
        if (!state.tours.some(tour => tour.id === id)) state.tours.push({ id, name, ranking: 'none', entry: 'native', fieldSize: 32, playerKeys: [], removed: true });
    });
    removeCareerEditorEvents([...tournamentDatabase]);
    state.emptyCalendar = true;
    state.tours.forEach(tour => { tour.removed = true; });
    state.tours.forEach(tour => { delete tour.promotion; });
    state.cards.forEach(card => { card.awardTourId = null; card.awardPlaces = 0; });
    renderCareerCalendarManager();
    await persistCareerEditorSettings(trCareerEditor('cleared'));
    return true;
}
async function removeCareerEditorTour() {
    const id = document.getElementById('ce-tour-select').value;
    if (!id) return false;
    const state = getCareerCalendarEditorState();
    const tour = state.tours.find(item => item.id === id) || { id, name: new Map(careerEditorTourChoices()).get(id), ranking: 'none', entry: 'native', fieldSize: 32, playerKeys: [] };
    const events = tournamentDatabase.filter(event => getCareerEditorTourId(event) === id);
    if (events.some(isTournamentEditorActive)) { setCareerEditorStatus(trTournamentEditor('inUse'), true); return false; }
    if (!confirm(trCareerEditor('removeConfirm', { name: tour.name, count: events.length }))) return false;
    try { removeCareerEditorEvents(events); } catch (error) { setCareerEditorStatus(error.message, true); return false; }
    tour.removed = true;
    delete tour.promotion;
    state.tours.forEach(candidate => { if (candidate.promotion?.targetId === id) delete candidate.promotion; });
    if (!state.tours.includes(tour)) state.tours.push(tour);
    state.cards.filter(card => card.awardTourId === id).forEach(card => { card.awardTourId = null; card.awardPlaces = 0; });
    renderCareerCalendarManager();
    await persistCareerEditorSettings(trCareerEditor('removed'));
    return true;
}
function populateCareerCardManager(id) {
    const state = getCareerCalendarEditorState(), pdc = id === 'pdc';
    const card = pdc ? { id, name: getCareerEditorCard('pdc').name, durationYears: 2, oomPlaces: 64, qschoolPlaces: 64, secondaryPlaces: 2, ...state.pdc }
        : getCareerEditorCard(id) || { name: '', tier: 1, durationYears: 1, awardPlaces: 0 };
    const holders = getTournamentEditorCandidates().filter(candidate => id && (pdc ? hasCareerEditorCard(candidate, id)
        : (candidate.editorCards || []).some(held => held.id === id && held.startYear <= currentDate.getFullYear()
            && held.expiryYear > currentDate.getFullYear()))).map(getTournamentEditorPlayerKey);
    const awardTours = state.tours.filter(tour => tour.ranking === 'own' && !tour.removed).map(tour => [tour.id, tour.name]);
    document.getElementById('ce-card-form').innerHTML = `<form onsubmit="saveCareerCardManager(event)"><div class="tournament-editor-fields">
        ${careerEditorLabel('name', `<input id="ce-card-name" value="${careerEditorHtml(card.name)}" maxlength="80" required>`)}
        ${careerEditorLabel('duration', careerEditorNumber('ce-card-duration', card.durationYears, 1, 10))}
        ${pdc ? careerEditorLabel('oom', careerEditorNumber('ce-card-oom', card.oomPlaces, 0, 256)) + careerEditorLabel('qschool', careerEditorNumber('ce-card-qschool', card.qschoolPlaces, 0, 256)) + careerEditorLabel('secondary', careerEditorNumber('ce-card-secondary', card.secondaryPlaces, 0, 64))
        : careerEditorLabel('tier', careerEditorNumber('ce-card-tier', card.tier, 1, 100)) + careerEditorLabel('awardTour', `<select id="ce-card-award-tour">${careerEditorOptions([['', trCareerEditor('manual')], ...awardTours], card.awardTourId)}</select>`) + careerEditorLabel('awardPlaces', careerEditorNumber('ce-card-award-places', card.awardPlaces, 0, 256)) + `<label class="te-checkbox te-wide"><input id="ce-card-higher" type="checkbox"${card.acceptHigher ? ' checked' : ''}><span>${careerEditorHtml(trCareerEditor('higher'))}</span></label>`}</div>
        ${careerEditorLabel('holders', `<input type="search" placeholder="${careerEditorHtml(trCareerEditor('search'))}" oninput="filterCareerEditorPlayers(this, 'ce-card-holders')"><select id="ce-card-holders" multiple size="8">${careerEditorPlayerOptions(holders)}</select>`)}
        <p>${careerEditorHtml(trCareerEditor(pdc ? 'pdcHint' : 'cardHint'))}</p><div class="career-editor-actions"><button type="submit">${careerEditorHtml(trCareerEditor('save'))}</button>${id && !pdc ? `<button type="button" class="ce-danger" onclick="removeCareerEditorCard()">${careerEditorHtml(trCareerEditor('removeCard'))}</button>` : ''}</div></form>`;
}
async function saveCareerCardManager(event) {
    event?.preventDefault();
    try {
        if (typeof activeTournament !== 'undefined' && activeTournament) throw new Error(trTournamentEditor('inUse'));
        const state = getCareerCalendarEditorState(), oldId = document.getElementById('ce-card-select').value;
        const name = document.getElementById('ce-card-name').value.trim().replace(/\s+/g, ' ');
        if (!name || !oldId && state.cards.some(card => card.name.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error(trCareerEditor('invalid'));
        const id = oldId || `card:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
        const card = { id, name, durationYears: careerEditorInteger('ce-card-duration', 1, 10) };
        let configuration;
        if (id === 'pdc') {
            Object.assign(card, { oomPlaces: careerEditorInteger('ce-card-oom', 0, 256), qschoolPlaces: careerEditorInteger('ce-card-qschool', 0, 256), secondaryPlaces: careerEditorInteger('ce-card-secondary', 0, 64) });
            configuration = normalizeCareerCalendarConfiguration({ ...state, pdc: card });
        } else {
            Object.assign(card, { tier: careerEditorInteger('ce-card-tier', 1, 100), acceptHigher: document.getElementById('ce-card-higher').checked,
                awardTourId: document.getElementById('ce-card-award-tour').value || null, awardPlaces: careerEditorInteger('ce-card-award-places', 0, 256) });
            if (card.awardTourId && !card.awardPlaces || !card.awardTourId && card.awardPlaces) throw new Error(trCareerEditor('invalid'));
            configuration = normalizeCareerCalendarConfiguration({ ...state, cards: [...state.cards.filter(item => item.id !== id), card] });
        }
        const keys = new Set(careerEditorSelectedPlayers('ce-card-holders'));
        Object.assign(state, configuration);
        if (id === 'pdc') state.pdcManualCycleYear = getPdcTourCardCycleYear(currentDate);
        const year = currentDate.getFullYear();
        getTournamentEditorCandidates().forEach(candidate => {
            if (id === 'pdc') {
                if (keys.has(getTournamentEditorPlayerKey(candidate))) setPdcTourCard(candidate, candidate.tourCardSource || 'editor', year);
                else clearPdcTourCard(candidate, getPdcTourCardCycleYear(currentDate));
            } else {
                candidate.editorCards = (candidate.editorCards || []).filter(held => held.id !== id);
                if (keys.has(getTournamentEditorPlayerKey(candidate))) grantCareerEditorCard(candidate, card, year);
            }
        });
        renderCareerCalendarManager();
        document.getElementById('ce-cards').open = true;
        document.getElementById('ce-card-select').value = id;
        populateCareerCardManager(id);
        await persistCareerEditorSettings(trCareerEditor('saved'));
        return true;
    } catch (error) { setCareerEditorStatus(error.message === 'Invalid tour/card configuration' ? trCareerEditor('invalid') : error.message, true); return false; }
}
async function removeCareerEditorCard() {
    const id = document.getElementById('ce-card-select').value, card = getCareerEditorCard(id);
    if (!id || id === 'pdc' || !card) return false;
    if (typeof activeTournament !== 'undefined' && activeTournament) { setCareerEditorStatus(trTournamentEditor('inUse'), true); return false; }
    const state = getCareerCalendarEditorState();
    if (state.tours.some(tour => !tour.removed && tour.requiredCardId === id) || tournamentDatabase.some(event => event.editorRequiredCardId === id)) {
        setCareerEditorStatus(trCareerEditor('usedCard'), true); return false;
    }
    if (!confirm(trCareerEditor('cardConfirm', { name: card.name }))) return false;
    state.cards = state.cards.filter(item => item.id !== id);
    getTournamentEditorCandidates().forEach(candidate => { candidate.editorCards = (candidate.editorCards || []).filter(held => held.id !== id); });
    renderCareerCalendarManager();
    await persistCareerEditorSettings(trCareerEditor('cardRemoved'));
    return true;
}
function refreshCareerEditorEventCards() {
    const select = document.getElementById('te-required-card');
    if (!select) return;
    const value = select.value;
    select.innerHTML = careerEditorOptions([['', trCareerEditor('none')], ['pdc', getCareerEditorCard('pdc').name], ...getCareerCalendarEditorState().cards.map(card => [card.id, card.name])], value);
    document.getElementById('te-required-card-label').textContent = trCareerEditor('card');
    document.getElementById('te-required-card-hint').textContent = trCareerEditor('tourCardHint');
}
function renderTournamentEditorRoundFormats(event) {
    const wrap = document.getElementById('te-round-formats');
    if (!wrap) return;
    const rounds = [256, 128, 64, 32, 16, 8, 4, 2];
    if (event?.specialType === 'ukOpen') rounds.splice(1, 0, 160, 96);
    if (event?.specialType === 'continentalQualifier' && event.qualifierPath === 'card') rounds.splice(2, 0, 80, 40, 20, 10);
    wrap.innerHTML = `<p>${careerEditorHtml(trCareerEditor('roundHint'))}</p><div class="tournament-editor-prize-grid">${rounds.map(round => {
        const native = event && typeof getTournamentMatchFormat === 'function'
            ? getTournamentMatchFormat({ ...event, editorMatchFormat: null }, round) : { type: 'legs', legsToWin: 6 };
        const saved = event?.editorMatchFormat?.type === 'rounds' ? event.editorMatchFormat.rounds[round]?.legsToWin || 0
            : event?.editorMatchFormat?.type === 'legs' ? event.editorMatchFormat.legsToWin : native.type === 'legs' ? native.legsToWin : 0;
        const label = round === 2 ? trCareerEditor('final') : round === 4 ? trCareerEditor('semi') : round === 8 ? trCareerEditor('quarter') : trCareerEditor('last', { count: round });
        return `<label><span>${careerEditorHtml(label)}</span><input id="te-round-${round}" data-round="${round}" type="number" min="0" max="30" step="1" value="${saved}"></label>`;
    }).join('')}</div>`;
    updateTournamentEditorRoundVisibility();
}
function getTournamentEditorProposedTourEvent() {
    const cycle = document.getElementById('te-cycle')?.value;
    return { ...(tournamentEditorSelected || {}), editorCycle: cycle === 'auto' ? null : cycle,
        editorTourName: document.getElementById('te-custom-tour')?.value || '' };
}
function updateTournamentEditorRoundVisibility() {
    const event = getTournamentEditorProposedTourEvent();
    const managed = hasCareerTourEntryOverride(event);
    const known = managed || tournamentEditorCreating || event.isEditorTournament || document.getElementById('te-qualification-mode')?.value === 'custom';
    const size = managed ? getCareerTourFieldSize(event) : Number(document.getElementById('te-field-size')?.value) || 256;
    document.querySelectorAll('#te-round-formats input[data-round]').forEach(input => { input.closest('label').hidden = known && Number(input.dataset.round) > size; });
}
function updateTournamentEditorManagedTourFields() {
    const event = getTournamentEditorProposedTourEvent(), managed = hasCareerTourEntryOverride(event);
    const hint = document.getElementById('te-managed-tour-hint');
    if (hint) {
        hint.hidden = !managed;
        hint.textContent = managed ? trCareerEditor('managedHint', { name: getCareerEditorTour(event).name, size: getCareerTourFieldSize(event) }) : '';
    }
    const qualification = document.getElementById('te-qualification-panel');
    if (qualification && !(typeof isEditorTeamTournament === 'function' && isEditorTeamTournament(event))) qualification.hidden = managed;
    if (managed) {
        document.getElementById('te-field-size').value = String(getCareerTourFieldSize(event));
        document.getElementById('te-field-size-wrap').hidden = true;
    } else if (typeof updateTournamentEditorQualificationFields === 'function') updateTournamentEditorQualificationFields();
    updateTournamentEditorRoundVisibility();
}
function getTournamentEditorRoundFormatData() {
    const rounds = {};
    document.querySelectorAll('#te-round-formats input[data-round]').forEach(input => {
        if (input.closest('label').hidden) return;
        const value = Number(input.value);
        if (!input.value.trim() || !Number.isInteger(value) || value < 0 || value > 30) throw new Error(trTournamentEditor('invalidNumbers'));
        if (value) rounds[input.dataset.round] = { type: 'legs', legsToWin: value };
    });
    if (!Object.keys(rounds).length) throw new Error(trTournamentEditor('invalidNumbers'));
    return { type: 'rounds', rounds };
}
function refreshCareerTourRankingButtons() {
    const mapping = { 'btn-rank-pt': 'proTour', 'btn-rank-pc': 'playersChampionship', 'btn-rank-et': 'europeanTour', 'btn-rank-challenge-tour': 'challengeTour', 'btn-rank-development-tour': 'developmentTour', 'btn-rank-gdl': 'premierLeague', 'btn-rank-world-masters': 'worldSeries' };
    Object.entries(mapping).forEach(([id, tourId]) => {
        const button = document.getElementById(id);
        if (button) button.hidden = !isCareerEditorTourRankingEnabled(tourId)
            || getCareerCalendarEditorState().tours.some(tour => tour.id === tourId && tour.ranking === 'own')
            || isCareerEditorCalendarEmpty() && !tournamentDatabase.some(event => getCareerEditorTourId(event) === tourId);
    });
    const panel = document.getElementById('career-tour-ranking-buttons');
    if (!panel) return;
    panel.replaceChildren();
    getCareerCalendarEditorState().tours.filter(tour => !tour.removed && tour.ranking === 'own').forEach(tour => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'action-btn'; button.textContent = tour.name;
        button.onclick = () => showPdcRankings(`tour:${tour.id}`);
        panel.appendChild(button);
    });
}
function renderCareerTourRanking(id, list) {
    const tour = getCareerCalendarEditorState().tours.find(item => item.id === id);
    if (!tour || tour.removed || tour.ranking !== 'own') return false;
    const rows = getCareerTourRanking(id).filter(candidate => getCareerTourPrizeMoney(candidate, id) > 0
        || tour.playerKeys.includes(getTournamentEditorPlayerKey(candidate)));
    list.innerHTML = `<h3>${careerEditorHtml(tour.name)} · ${currentDate.getFullYear()}</h3><table class="career-tour-ranking"><thead><tr><th>#</th><th>${careerEditorHtml(trCareerEditor('roster').split(' (')[0])}</th><th>£</th></tr></thead><tbody>${rows.map((candidate, index) => `<tr><td>${index + 1}</td><td>${careerEditorHtml(candidate.name)}</td><td>£${getCareerTourPrizeMoney(candidate, id).toLocaleString('en-GB')}</td></tr>`).join('')}</tbody></table>`;
    return true;
}
