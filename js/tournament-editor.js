const TOURNAMENT_EDITOR_PRIZE_ROUNDS = ['winner', '2', '4', '8', '16', '32', '64', '128', '256'];
const TOURNAMENT_EDITOR_TEXT = {
    pl: {
        switch: '🏆 Edytor turniejów', eyebrow: 'KALENDARZ KARIERY', title: '🏆 Edytor turniejów',
        intro: 'Dodawaj, zmieniaj i usuwaj turnieje w bieżącej karierze. Zmiany zapisują się wraz z grą.',
        back: 'Wróć do edytora zawodników', list: 'Turnieje', add: '＋ Dodaj turniej', searchLabel: 'Szukaj turnieju',
        search: 'Nazwa, miasto lub kraj…', count: '{shown} z {total} turniejów', choose: 'Wybierz turniej', new: 'Nowy turniej',
        base: 'Turniej gry', mod: 'Turniej moda', own: 'Turniej własny', name: 'Nazwa turnieju', start: 'Początek', end: 'Koniec',
        city: 'Miasto', country: 'Kraj', minOvr: 'Minimalny overall', fieldSize: 'Liczba uczestników',
        gameFormat: 'Zasada rozpoczęcia lega', standard: 'Zwykła (double-out)', dido: 'Double-in / double-out',
        matchMode: 'Format meczu', auto: 'Według zasad turnieju', legs: 'Stała liczba legów', sets: 'Stała liczba setów',
        legsToWin: 'Legi do wygrania', setsToWin: 'Sety do wygrania', legsPerSet: 'Legi w secie',
        ranking: 'Turniej rankingowy — nagrody zaliczają się do odpowiednich rankingów', prizes: 'Nagrody za wynik (£)',
        prizesHint: 'Kwoty brutto wypłacane zawodnikowi. Puste rundy ustaw na 0.',
        winner: 'Zwycięzca', runnerUp: 'Finalista', semi: 'Półfinalista', quarter: 'Ćwierćfinalista',
        last16: '1/8 finału', last32: '1/16 finału', last64: 'Ostatnia 64', last128: 'Ostatnia 128', last256: 'Ostatnia 256',
        specialHint: 'Ten turniej korzysta z wbudowanych zasad kwalifikacji i drabinki. Aby zmienić dobór i liczbę uczestników, wybierz własne zasady kwalifikacji poniżej.',
        ownHint: 'Turniej własny korzysta z wybranej liczby uczestników i podanych nagród. Przeprowadzany jest co sezon.',
        save: 'Zapisz zmiany', create: 'Dodaj turniej', delete: 'Usuń turniej', saved: 'Zapisano turniej {name}.',
        created: 'Dodano turniej {name}.', deleted: 'Usunięto turniej {name}.',
        duplicate: 'Turniej o tej nazwie już istnieje.', invalidDate: 'Wybierz poprawne daty w jednym roku; koniec nie może być przed początkiem.',
        invalidNumbers: 'Sprawdź overall, format meczów, liczbę uczestników i wszystkie nagrody.',
        inUse: 'Nie można zmienić ani usunąć trwającego turnieju. Dokończ go lub odpuść.',
        deleteConfirm: 'Usunąć turniej {name} z tej kariery? Powiązane kwalifikacje ({count}) również zostaną usunięte.',
        saveFailed: 'Zmiana działa w tej sesji, ale zapis kariery się nie powiódł.'
    },
    en: {
        switch: '🏆 Tournament editor', eyebrow: 'CAREER CALENDAR', title: '🏆 Tournament editor',
        intro: 'Add, edit and remove tournaments in this career. Changes are saved with the game.',
        back: 'Back to player editor', list: 'Tournaments', add: '＋ Add tournament', searchLabel: 'Search tournaments',
        search: 'Name, city or country…', count: '{shown} of {total} tournaments', choose: 'Select a tournament', new: 'New tournament',
        base: 'Game event', mod: 'Mod event', own: 'Custom event', name: 'Tournament name', start: 'Start', end: 'End',
        city: 'City', country: 'Country', minOvr: 'Minimum overall', fieldSize: 'Field size',
        gameFormat: 'Leg opening rule', standard: 'Standard (double-out)', dido: 'Double-in / double-out',
        matchMode: 'Match format', auto: 'Event rules', legs: 'Fixed legs', sets: 'Fixed sets',
        legsToWin: 'Legs to win', setsToWin: 'Sets to win', legsPerSet: 'Legs per set',
        ranking: 'Ranking event — prize money counts towards the relevant rankings', prizes: 'Prizes by result (£)',
        prizesHint: 'Gross cash paid to each player. Enter 0 for unpaid rounds.',
        winner: 'Winner', runnerUp: 'Runner-up', semi: 'Semi-finalist', quarter: 'Quarter-finalist',
        last16: 'Last 16', last32: 'Last 32', last64: 'Last 64', last128: 'Last 128', last256: 'Last 256',
        specialHint: 'This event uses built-in qualification and draw rules. Select custom qualification rules below to change its entrants and field size.',
        ownHint: 'Custom events use the selected field size and prize table. They run each season.',
        save: 'Save changes', create: 'Add tournament', delete: 'Remove tournament', saved: 'Saved {name}.',
        created: 'Added {name}.', deleted: 'Removed {name}.', duplicate: 'A tournament with this name already exists.',
        invalidDate: 'Choose valid dates within one year; the end cannot precede the start.',
        invalidNumbers: 'Check overall, match format, field size and all prize amounts.',
        inUse: 'An active tournament cannot be edited or removed. Finish or skip it first.',
        deleteConfirm: 'Remove {name} from this career? Its linked qualifiers ({count}) will also be removed.',
        saveFailed: 'The change is active in this session, but saving the career failed.'
    },
    de: {
        switch: '🏆 Turniereditor', eyebrow: 'KARRIEREKALENDER', title: '🏆 Turniereditor',
        intro: 'Turniere dieser Karriere hinzufügen, bearbeiten und entfernen. Änderungen werden mit dem Spiel gespeichert.',
        back: 'Zurück zum Spielereditor', list: 'Turniere', add: '＋ Turnier hinzufügen', searchLabel: 'Turniere suchen',
        search: 'Name, Stadt oder Land…', count: '{shown} von {total} Turnieren', choose: 'Turnier auswählen', new: 'Neues Turnier',
        base: 'Spielturnier', mod: 'Mod-Turnier', own: 'Eigenes Turnier', name: 'Turniername', start: 'Beginn', end: 'Ende',
        city: 'Stadt', country: 'Land', minOvr: 'Mindest-Overall', fieldSize: 'Teilnehmerzahl',
        gameFormat: 'Leg-Eröffnung', standard: 'Standard (Double-out)', dido: 'Double-in / Double-out',
        matchMode: 'Matchformat', auto: 'Turnierregeln', legs: 'Feste Legzahl', sets: 'Feste Satzzahl',
        legsToWin: 'Legs zum Sieg', setsToWin: 'Sätze zum Sieg', legsPerSet: 'Legs je Satz',
        ranking: 'Ranglistenturnier — Preisgeld zählt für die relevanten Ranglisten', prizes: 'Preisgeld nach Ergebnis (£)',
        prizesHint: 'Bruttobetrag je Spieler. Für unbezahlte Runden 0 eintragen.',
        winner: 'Sieger', runnerUp: 'Finalist', semi: 'Halbfinalist', quarter: 'Viertelfinalist',
        last16: 'Letzte 16', last32: 'Letzte 32', last64: 'Letzte 64', last128: 'Letzte 128', last256: 'Letzte 256',
        specialHint: 'Dieses Turnier nutzt integrierte Qualifikations- und Auslosungsregeln. Wähle unten eigene Regeln, um Teilnehmerauswahl und Feldgröße zu ändern.',
        ownHint: 'Eigene Turniere nutzen die gewählte Teilnehmerzahl und Preisgeldtabelle. Sie finden jede Saison statt.',
        save: 'Änderungen speichern', create: 'Turnier hinzufügen', delete: 'Turnier entfernen', saved: '{name} gespeichert.',
        created: '{name} hinzugefügt.', deleted: '{name} entfernt.', duplicate: 'Ein Turnier mit diesem Namen existiert bereits.',
        invalidDate: 'Gültige Daten innerhalb eines Jahres wählen; das Ende darf nicht vor dem Beginn liegen.',
        invalidNumbers: 'Overall, Matchformat, Teilnehmerzahl und Preisgelder prüfen.',
        inUse: 'Ein laufendes Turnier kann nicht bearbeitet oder entfernt werden. Beende oder überspringe es zuerst.',
        deleteConfirm: '{name} aus dieser Karriere entfernen? Verknüpfte Qualifikationen ({count}) werden ebenfalls entfernt.',
        saveFailed: 'Die Änderung gilt in dieser Sitzung, aber die Karriere konnte nicht gespeichert werden.'
    },
    nl: {
        switch: '🏆 Toernooieditor', eyebrow: 'CARRIÈREKALENDER', title: '🏆 Toernooieditor',
        intro: 'Voeg toernooien toe, wijzig ze of verwijder ze in deze carrière. Wijzigingen worden met het spel opgeslagen.',
        back: 'Terug naar spelereditor', list: 'Toernooien', add: '＋ Toernooi toevoegen', searchLabel: 'Toernooien zoeken',
        search: 'Naam, stad of land…', count: '{shown} van {total} toernooien', choose: 'Kies een toernooi', new: 'Nieuw toernooi',
        base: 'Speltoernooi', mod: 'Modtoernooi', own: 'Eigen toernooi', name: 'Toernooinaam', start: 'Begin', end: 'Einde',
        city: 'Stad', country: 'Land', minOvr: 'Minimale overall', fieldSize: 'Deelnemersveld',
        gameFormat: 'Startregel leg', standard: 'Standaard (double-out)', dido: 'Double-in / double-out',
        matchMode: 'Wedstrijdformaat', auto: 'Toernooiregels', legs: 'Vast aantal legs', sets: 'Vast aantal sets',
        legsToWin: 'Legs om te winnen', setsToWin: 'Sets om te winnen', legsPerSet: 'Legs per set',
        ranking: 'Rankingtoernooi — prijzengeld telt mee voor de relevante ranglijsten', prizes: 'Prijzen per resultaat (£)',
        prizesHint: 'Brutobedrag per speler. Vul 0 in voor rondes zonder prijs.',
        winner: 'Winnaar', runnerUp: 'Finalist', semi: 'Halve finalist', quarter: 'Kwartfinalist',
        last16: 'Laatste 16', last32: 'Laatste 32', last64: 'Laatste 64', last128: 'Laatste 128', last256: 'Laatste 256',
        specialHint: 'Dit toernooi gebruikt ingebouwde kwalificatie- en lotingsregels. Kies hieronder eigen regels om de selectie en het deelnemersveld te wijzigen.',
        ownHint: 'Eigen toernooien gebruiken het gekozen deelnemersveld en prijzenschema. Ze worden elk seizoen gespeeld.',
        save: 'Wijzigingen opslaan', create: 'Toernooi toevoegen', delete: 'Toernooi verwijderen', saved: '{name} opgeslagen.',
        created: '{name} toegevoegd.', deleted: '{name} verwijderd.', duplicate: 'Een toernooi met deze naam bestaat al.',
        invalidDate: 'Kies geldige datums in hetzelfde jaar; het einde mag niet vóór het begin liggen.',
        invalidNumbers: 'Controleer overall, wedstrijdformaat, deelnemersveld en alle prijzengelden.',
        inUse: 'Een lopend toernooi kan niet worden gewijzigd of verwijderd. Rond het eerst af of sla het over.',
        deleteConfirm: '{name} uit deze carrière verwijderen? Gekoppelde kwalificaties ({count}) worden ook verwijderd.',
        saveFailed: 'De wijziging werkt in deze sessie, maar het opslaan van de carrière is mislukt.'
    }
};

let tournamentEditorSelected = null;
let tournamentEditorCreating = false;

TOURNAMENT_EDITOR_TEXT.pl.etHostHint = 'Kraj European Tour określa też kraj kwalifikacji gospodarzy. Zmień kraj tutaj i zapisz — nie trzeba zmieniać zasad ani całego turnieju.';
TOURNAMENT_EDITOR_TEXT.en.etHostHint = 'The European Tour country also determines host-nation qualifier eligibility. Change the country here and save; no need to replace the event rules.';
TOURNAMENT_EDITOR_TEXT.de.etHostHint = 'Das Land der European Tour bestimmt auch die Teilnahme an der Gastgeberqualifikation. Ändere hier das Land und speichere, ohne die Turnierregeln zu ersetzen.';
TOURNAMENT_EDITOR_TEXT.nl.etHostHint = 'Het land van de European Tour bepaalt ook wie aan de gastlandkwalificatie mag deelnemen. Wijzig het land hier en sla op; de toernooiregels blijven behouden.';

function trTournamentEditor(key, params = {}) {
    const language = typeof currentLang === 'string' && TOURNAMENT_EDITOR_TEXT[currentLang] ? currentLang : 'pl';
    return String(TOURNAMENT_EDITOR_TEXT[language][key] || TOURNAMENT_EDITOR_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, field) => String(params[field] ?? ''));
}

function tournamentEditorElement(id) { return document.getElementById(id); }
function tournamentEditorValue(id) { return tournamentEditorElement(id).value; }
function setTournamentEditorStatus(message, error = false) {
    const status = tournamentEditorElement('tournament-editor-status');
    status.textContent = message;
    status.classList.toggle('is-error', error);
}
function tournamentEditorKey(tournament) { return String(tournament?.sourceName || tournament?.name || ''); }
function isTournamentEditorActive(tournament) {
    return typeof activeTournament !== 'undefined' && activeTournament
        && (activeTournament === tournament || tournamentEditorKey(activeTournament) === tournamentEditorKey(tournament));
}
function tournamentEditorDate(month, day, year) {
    const date = new Date(year, month, day);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseTournamentEditorDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!match) return null;
    const year = Number(match[1]), month = Number(match[2]) - 1, day = Number(match[3]);
    const date = new Date(year, month, day);
    const normalYearDate = new Date(2027, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day
        || normalYearDate.getMonth() !== month || normalYearDate.getDate() !== day) return null;
    return { year, month, day, date };
}
function getTournamentEditorDefaultRanking(tournament) {
    if (typeof tournament?.rankingOverride === 'boolean') return tournament.rankingOverride;
    if (['challengeTour', 'developmentTour'].includes(tournament?.specialType)) return true;
    return typeof isMainOrderOfMeritRankingTournament === 'function'
        && isMainOrderOfMeritRankingTournament(tournament);
}
function updateTournamentEditorMatchFields() {
    if (typeof document === 'undefined') return;
    const mode = tournamentEditorValue('te-match-mode');
    tournamentEditorElement('te-legs-wrap').hidden = mode !== 'legs';
    tournamentEditorElement('te-sets-wrap').hidden = mode !== 'sets';
    tournamentEditorElement('te-legs-per-set-wrap').hidden = mode !== 'sets';
}
function populateTournamentEditorForm(tournament) {
    if (!tournament) return;
    tournamentEditorSelected = tournament;
    tournamentEditorCreating = false;
    const year = typeof currentDate !== 'undefined' && currentDate instanceof Date ? currentDate.getFullYear() : 2026;
    tournamentEditorElement('te-name').value = tournament.name || '';
    tournamentEditorElement('te-start').value = tournamentEditorDate(tournament.month, tournament.day, year);
    tournamentEditorElement('te-end').value = tournamentEditorDate(tournament.endMonth ?? tournament.month,
        tournament.endDay ?? tournament.day, year);
    tournamentEditorElement('te-city').value = tournament.city || '';
    tournamentEditorElement('te-country').value = tournament.country || '';
    tournamentEditorElement('te-min-ovr').value = Number(tournament.minOvr) || 0;
    tournamentEditorElement('te-field-size').value = String(tournament.editorFieldSize || 32);
    tournamentEditorElement('te-field-size').disabled = tournament.isEditorTournament !== true;
    tournamentEditorElement('te-game-format').value = tournament.format === 'DIDO' ? 'DIDO' : 'standard';
    tournamentEditorElement('te-match-mode').value = tournament.editorMatchFormat?.type || 'auto';
    tournamentEditorElement('te-legs').value = tournament.editorMatchFormat?.legsToWin || 6;
    tournamentEditorElement('te-sets').value = tournament.editorMatchFormat?.setsToWin || 3;
    tournamentEditorElement('te-legs-per-set').value = tournament.editorMatchFormat?.legsPerSet || 3;
    tournamentEditorElement('te-ranking').checked = getTournamentEditorDefaultRanking(tournament);
    TOURNAMENT_EDITOR_PRIZE_ROUNDS.forEach(round => {
        const amount = typeof getPrizeMoney === 'function' ? getPrizeMoney(tournament, Number(round) || 2, round === 'winner') : 0;
        tournamentEditorElement(`te-prize-${round}`).value = Number.isFinite(amount) && amount >= 0 ? amount : 0;
    });
    populateTournamentEditorQualification(tournament);
    updateTournamentEditorMatchFields();
    refreshTournamentEditorFormText();
    renderTournamentEditorList();
    setTournamentEditorStatus('');
}
function startAddingTournament() {
    tournamentEditorSelected = null;
    tournamentEditorCreating = true;
    const date = typeof currentDate !== 'undefined' && currentDate instanceof Date
        ? new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7)
        : new Date(2026, 0, 8);
    tournamentEditorElement('tournament-editor-form').reset();
    tournamentEditorElement('te-start').value = tournamentEditorDate(date.getMonth(), date.getDate(), date.getFullYear());
    tournamentEditorElement('te-end').value = tournamentEditorValue('te-start');
    tournamentEditorElement('te-field-size').value = '32';
    tournamentEditorElement('te-field-size').disabled = false;
    tournamentEditorElement('te-min-ovr').value = '0';
    tournamentEditorElement('te-match-mode').value = 'legs';
    tournamentEditorElement('te-ranking').checked = true;
    const defaults = { winner: 35000, 2: 15000, 4: 10000, 8: 8000, 16: 5000, 32: 2000, 64: 0, 128: 0, 256: 0 };
    TOURNAMENT_EDITOR_PRIZE_ROUNDS.forEach(round => { tournamentEditorElement(`te-prize-${round}`).value = defaults[round]; });
    populateTournamentEditorQualification(null);
    updateTournamentEditorMatchFields();
    refreshTournamentEditorFormText();
    renderTournamentEditorList();
    setTournamentEditorStatus('');
    tournamentEditorElement('te-name').focus();
}
function renderTournamentEditorList() {
    if (typeof document === 'undefined' || typeof tournamentDatabase === 'undefined') return;
    const list = tournamentEditorElement('tournament-editor-list');
    const search = tournamentEditorValue('tournament-editor-search').trim().toLocaleLowerCase();
    const entries = tournamentDatabase.map((tournament, index) => ({ tournament, index }))
        .filter(({ tournament }) => [tournament.name, tournament.city, tournament.country]
            .some(value => String(value || '').toLocaleLowerCase().includes(search)))
        .sort((first, second) => first.tournament.month - second.tournament.month
            || first.tournament.day - second.tournament.day
            || String(first.tournament.name).localeCompare(String(second.tournament.name)));
    list.replaceChildren();
    entries.forEach(({ tournament, index }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tournament-editor-list-item';
        button.classList.toggle('is-selected', tournament === tournamentEditorSelected);
        const name = document.createElement('strong');
        name.textContent = tournament.name;
        const details = document.createElement('small');
        details.textContent = `${String(tournament.day).padStart(2, '0')}.${String(tournament.month + 1).padStart(2, '0')} · ${tournament.city || ''}, ${tournament.country || ''}`;
        button.append(name, details);
        button.addEventListener('click', () => populateTournamentEditorForm(tournamentDatabase[index]));
        list.appendChild(button);
    });
    tournamentEditorElement('tournament-editor-count').textContent = trTournamentEditor('count', {
        shown: entries.length, total: tournamentDatabase.length
    });
}
function refreshTournamentEditorFormText() {
    if (typeof document === 'undefined') return;
    const tournament = tournamentEditorSelected;
    tournamentEditorElement('tournament-editor-form-title').textContent = tournamentEditorCreating
        ? trTournamentEditor('new') : (tournament?.name || trTournamentEditor('choose'));
    tournamentEditorElement('tournament-editor-origin').textContent = tournamentEditorCreating || tournament?.isEditorTournament
        ? trTournamentEditor('own') : tournament?.sourceName && tournament.sourceName !== tournament.name
            ? trTournamentEditor('mod') : trTournamentEditor('base');
    tournamentEditorElement('tournament-editor-system-hint').textContent = tournamentEditorCreating || tournament?.isEditorTournament
        ? trTournamentEditor('ownHint') : hasTournamentEditorQualification(tournament)
            ? trTournamentEditor('qualificationHint')
            : typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(tournament)
                ? trTournamentEditor('etHostHint') : trTournamentEditor('specialHint');
    tournamentEditorElement('tournament-editor-save').textContent = trTournamentEditor(tournamentEditorCreating ? 'create' : 'save');
    tournamentEditorElement('tournament-editor-delete').hidden = tournamentEditorCreating || !tournament;
}
function refreshTournamentEditorTranslations() {
    if (typeof document === 'undefined' || !tournamentEditorElement('screen-tournament-editor')) return;
    const fields = {
        'player-editor-tournaments': 'switch', 'tournament-editor-eyebrow': 'eyebrow', 'tournament-editor-title': 'title',
        'tournament-editor-intro': 'intro', 'tournament-editor-back': 'back', 'tournament-editor-list-title': 'list',
        'tournament-editor-new': 'add', 'tournament-editor-search-label': 'searchLabel', 'te-name-label': 'name',
        'te-start-label': 'start', 'te-end-label': 'end', 'te-city-label': 'city', 'te-country-label': 'country',
        'te-min-ovr-label': 'minOvr', 'te-field-size-label': 'fieldSize', 'te-game-format-label': 'gameFormat',
        'te-match-mode-label': 'matchMode', 'te-legs-label': 'legsToWin', 'te-sets-label': 'setsToWin',
        'te-legs-per-set-label': 'legsPerSet', 'te-ranking-label': 'ranking', 'te-prizes-title': 'prizes',
        'te-prizes-hint': 'prizesHint', 'te-prize-winner-label': 'winner', 'te-prize-2-label': 'runnerUp',
        'te-prize-4-label': 'semi', 'te-prize-8-label': 'quarter', 'te-prize-16-label': 'last16',
        'te-prize-32-label': 'last32', 'te-prize-64-label': 'last64', 'te-prize-128-label': 'last128',
        'te-prize-256-label': 'last256', 'tournament-editor-delete': 'delete'
    };
    Object.entries(fields).forEach(([id, key]) => { const node = tournamentEditorElement(id); if (node) node.textContent = trTournamentEditor(key); });
    tournamentEditorElement('tournament-editor-search').placeholder = trTournamentEditor('search');
    [['te-game-format', ['standard', 'dido']], ['te-match-mode', ['auto', 'legs', 'sets']]].forEach(([id, keys]) => {
        [...tournamentEditorElement(id).options].forEach((option, index) => { option.textContent = trTournamentEditor(keys[index]); });
    });
    refreshTournamentEditorQualificationTranslations();
    if (typeof refreshTournamentPackTranslations === 'function') refreshTournamentPackTranslations();
    refreshTournamentEditorFormText();
    renderTournamentEditorList();
}
function showTournamentEditor() {
    if (typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return false;
    refreshTournamentEditorTranslations();
    if (tournamentEditorSelected && tournamentDatabase.includes(tournamentEditorSelected)) {
        populateTournamentEditorForm(tournamentEditorSelected);
    } else if (tournamentDatabase.length) {
        populateTournamentEditorForm(tournamentDatabase[0]);
    } else startAddingTournament();
    if (typeof showScreen === 'function') showScreen('screen-tournament-editor');
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo(0, 0);
    return true;
}
function closeTournamentEditor() {
    if (typeof showPlayerEditor === 'function') showPlayerEditor();
    else if (typeof showScreen === 'function') showScreen('screen-hub');
}
function getTournamentEditorFormData() {
    const name = tournamentEditorValue('te-name').trim().replace(/\s+/g, ' ');
    const city = tournamentEditorValue('te-city').trim().replace(/\s+/g, ' ');
    const country = tournamentEditorValue('te-country').trim().replace(/\s+/g, ' ');
    const start = parseTournamentEditorDate(tournamentEditorValue('te-start'));
    const end = parseTournamentEditorDate(tournamentEditorValue('te-end'));
    if (!name || !city || !country || !start || !end || start.year !== end.year || end.date < start.date) {
        throw new Error(trTournamentEditor('invalidDate'));
    }
    if (tournamentDatabase.some(other => other !== tournamentEditorSelected
        && String(other.name || '').toLocaleLowerCase() === name.toLocaleLowerCase())) {
        throw new Error(trTournamentEditor('duplicate'));
    }
    const integer = (id, min, max) => {
        const value = Number(tournamentEditorValue(id));
        if (!Number.isInteger(value) || value < min || value > max) throw new Error(trTournamentEditor('invalidNumbers'));
        return value;
    };
    const minOvr = integer('te-min-ovr', 0, 100);
    const editorFieldSize = integer('te-field-size', 8, 256);
    if (![8, 16, 32, 64, 128, 256].includes(editorFieldSize)) throw new Error(trTournamentEditor('invalidNumbers'));
    const matchMode = tournamentEditorValue('te-match-mode');
    const editorMatchFormat = matchMode === 'legs' ? { type: 'legs', legsToWin: integer('te-legs', 1, 30) }
        : matchMode === 'sets' ? { type: 'sets', setsToWin: integer('te-sets', 1, 15), legsPerSet: integer('te-legs-per-set', 1, 7) }
            : null;
    const editorPrizes = {};
    TOURNAMENT_EDITOR_PRIZE_ROUNDS.forEach(round => { editorPrizes[round] = integer(`te-prize-${round}`, 0, 999999999); });
    const values = { name, month: start.month, day: start.day, endMonth: end.month, endDay: end.day,
        city, country, minOvr, format: tournamentEditorValue('te-game-format') === 'DIDO' ? 'DIDO' : 'legs',
        editorFieldSize, editorMatchFormat, rankingOverride: tournamentEditorElement('te-ranking').checked, editorPrizes };
    values.editorQualification = getTournamentEditorQualificationFormData(values);
    return values;
}
async function persistTournamentEditorChange(successMessage) {
    const saved = typeof saveGame !== 'function' || await saveGame(true, { immediate: true });
    setTournamentEditorStatus(saved === false ? trTournamentEditor('saveFailed') : successMessage, saved === false);
}
async function saveTournamentEditor(event) {
    event?.preventDefault();
    if (tournamentEditorSelected && isTournamentEditorActive(tournamentEditorSelected)) {
        setTournamentEditorStatus(trTournamentEditor('inUse'), true); return false;
    }
    let values;
    try { values = getTournamentEditorFormData(); }
    catch (error) { setTournamentEditorStatus(error.message, true); return false; }
    const creating = tournamentEditorCreating;
    const tournament = creating ? { completed: false, historyLogs: '', isEditorTournament: true,
        isCustomTournament: true, sourceName: values.name } : tournamentEditorSelected;
    if (!tournament) return false;
    if (!creating && values.country !== tournament.country && !tournament.completed
        && typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(tournament)
        && tournamentDatabase.some(candidate => candidate.specialType === 'continentalQualifier'
            && candidate.qualifierPath === 'host' && candidate.completed
            && [tournament.name, tournament.sourceName].filter(Boolean).includes(candidate.qualifierFor))) {
        setTournamentEditorStatus(trTournamentEditor('completedRules'), true); return false;
    }
    let qualificationUpdates;
    try { qualificationUpdates = prepareTournamentEditorQualificationUpdate(tournament, values); }
    catch (error) { setTournamentEditorStatus(error.message, true); return false; }
    const previousName = tournament.name;
    const previousCountry = tournament.country;
    const previousCity = tournament.city;
    if (!creating && !tournament.sourceName) tournament.sourceName = tournament.name;
    Object.assign(tournament, values, { editorModified: true });
    if (!values.editorQualification) delete tournament.editorQualification;
    if (isTournamentEditorQualifier(tournament)) tournament.qualifierFor = getTournamentEditorLinkedMain(tournament)?.name;
    else if (qualificationUpdates.length) delete tournament.qualifierFor;
    qualificationUpdates.forEach(({ main, rules }) => { main.editorQualification = rules; main.editorModified = true; });
    if (previousName) tournamentDatabase.forEach(candidate => {
        if (candidate.qualifierFor === previousName) candidate.qualifierFor = tournament.name;
    });
    if (typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(tournament)) {
        if (previousCountry !== tournament.country) {
            const host = tournament.continentalQualification?.paths?.host;
            if (host) {
                host.participantIds = [];
                host.qualifiedPlayerIds = [];
                host.initialized = false;
                host.completed = false;
                delete host.editorNativeOriginalQualifiedPlayerIds;
                if (typeof refreshContinentalQualificationAggregate === 'function') {
                    refreshContinentalQualificationAggregate(tournament.continentalQualification);
                }
            }
        }
        tournamentDatabase.filter(candidate => candidate.specialType === 'continentalQualifier'
            && candidate.qualifierPath === 'host'
            && [tournament.name, tournament.sourceName].filter(Boolean).includes(candidate.qualifierFor)).forEach(candidate => {
            candidate.country = tournament.country;
            if (candidate.city === previousCity) candidate.city = tournament.city;
        });
    }
    if (!values.editorMatchFormat) delete tournament.editorMatchFormat;
    if (values.endMonth === values.month) delete tournament.endMonth;
    if (values.endDay === values.day && !Object.hasOwn(tournament, 'endMonth')) delete tournament.endDay;
    if (creating) tournamentDatabase.push(tournament);
    tournamentEditorSelected = tournament;
    tournamentEditorCreating = false;
    populateTournamentEditorQualification(tournament);
    refreshTournamentEditorFormText();
    renderTournamentEditorList();
    await persistTournamentEditorChange(trTournamentEditor(creating ? 'created' : 'saved', { name: tournament.name }));
    return true;
}
async function deleteTournamentEditorCandidate() {
    const tournament = tournamentEditorSelected;
    if (!tournament) return false;
    if (isTournamentEditorActive(tournament)) { setTournamentEditorStatus(trTournamentEditor('inUse'), true); return false; }
    const linkedNames = new Set([tournament.name, tournament.sourceName].filter(name => typeof name === 'string' && name.trim()));
    const dependents = tournamentDatabase.filter(candidate => candidate !== tournament
        && typeof candidate.qualifierFor === 'string' && candidate.qualifierFor.trim()
        && linkedNames.has(candidate.qualifierFor));
    if (dependents.some(isTournamentEditorActive)) { setTournamentEditorStatus(trTournamentEditor('inUse'), true); return false; }
    if (!confirm(trTournamentEditor('deleteConfirm', { name: tournament.name, count: dependents.length }))) return false;
    const removed = [tournament, ...dependents];
    if (isTournamentEditorQualifier(tournament)) {
        const main = getTournamentEditorLinkedMain(tournament);
        if (main && (isTournamentEditorActive(main) || main.completed)) {
            setTournamentEditorStatus(trTournamentEditor('inUse'), true); return false;
        }
        if (main && hasTournamentEditorQualification(main)) {
            const key = tournamentEditorKey(tournament);
            const freed = main.editorQualification.routes.filter(route => route.source === 'qualifier' && route.qualifierKey === key)
                .reduce((sum, route) => sum + route.places, 0);
            main.editorQualification.routes = main.editorQualification.routes.filter(route => route.qualifierKey !== key);
            const direct = main.editorQualification.routes.find(route => route.source !== 'qualifier');
            if (direct) direct.places += freed;
            else if (freed) main.editorQualification.routes.unshift({ source: 'oom', places: freed });
            main.editorModified = true;
        }
    }
    if (typeof player !== 'undefined' && player) {
        const deletedKeys = new Set(Array.isArray(player.tournamentEditorDeletedKeys) ? player.tournamentEditorDeletedKeys : []);
        removed.forEach(candidate => deletedKeys.add(tournamentEditorKey(candidate)));
        player.tournamentEditorDeletedKeys = [...deletedKeys];
    }
    removed.forEach(candidate => {
        const index = tournamentDatabase.indexOf(candidate);
        if (index >= 0) tournamentDatabase.splice(index, 1);
    });
    tournamentEditorSelected = null;
    if (tournamentDatabase.length) populateTournamentEditorForm(tournamentDatabase[0]);
    else startAddingTournament();
    await persistTournamentEditorChange(trTournamentEditor('deleted', { name: tournament.name }));
    return true;
}

// Qualification labels are loaded by the following script before the editor opens.
