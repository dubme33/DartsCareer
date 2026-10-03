/* Career-scoped national team selections for the next World Cup edition. */
const WORLD_CUP_EDITOR_TEXT = {
    pl: {
        switch: '🌍 Reprezentacje World Cup', eyebrow: 'REPREZENTACJE', title: '🌍 Edytor zespołów World Cup',
        intro: 'Wybierz dwóch zawodników z tego samego kraju. Składy zostaną użyte w kolejnej edycji turnieju.',
        back: 'Wróć do edytora zawodników', list: 'Reprezentacje', add: '＋ Nowy kraj', search: 'Szukaj kraju lub zawodnika',
        choose: 'Wybierz reprezentację', country: 'Kraj', playerOne: 'Pierwszy zawodnik', playerTwo: 'Drugi zawodnik',
        entryType: 'Droga do turnieju', directEntry: 'Bezpośredni udział', qualifierEntry: 'Kwalifikacje regionalne', qualifierEvent: 'Wybrane kwalifikacje',
        replaces: 'Zastępuje kraj z puli bezpośredniej', qualifierReplaces: 'Zastępuje kraj w tych kwalifikacjach', addToQualifier: 'Dodaj bez zastępowania kraju',
        rule: 'World Cup ma 33 miejsca bezpośrednie i 7 z kwalifikacji. Nowy kraj może zastąpić uczestnika albo dołączyć do wybranych kwalifikacji.',
        active: 'Bieżąca edycja World Cup już trwa. Zmiany obejmą następną edycję.', save: 'Zapisz skład', reset: 'Przywróć automatyczny skład',
        remove: 'Usuń nową reprezentację', custom: 'Własny skład', automatic: 'Automatyczny skład', qualifier: 'Kwalifikacje', direct: 'Bezpośredni udział',
        count: '{shown} z {total} reprezentacji', new: 'Nowa reprezentacja', noPlayers: 'Dodaj dwóch zawodników tego kraju w edytorze zawodników.',
        noCountries: 'Brak nowego kraju z co najmniej dwoma zawodnikami. Dodaj zawodników w edytorze.',
        invalidPlayers: 'Wybierz dwóch różnych zawodników reprezentujących ten sam kraj.',
        invalidReplacement: 'Wybierz wolny kraj z puli bezpośredniej, który zastąpi nowa reprezentacja.',
        invalidQualifier: 'Wybierz kwalifikacje i kraj do zastąpienia albo dodaj reprezentację bez zastępowania.',
        saved: 'Zapisano skład {country}.', removed: 'Przywrócono automatyczny skład {country}.',
        deleted: 'Usunięto reprezentację {country}; poprzedni kraj wrócił do stawki.',
        deletedAddition: 'Usunięto reprezentację {country} z kwalifikacji.'
    },
    en: {
        switch: '🌍 World Cup teams', eyebrow: 'NATIONAL TEAMS', title: '🌍 World Cup team editor',
        intro: 'Choose two players from the same country. The lineup will be used in the next edition.',
        back: 'Back to player editor', list: 'National teams', add: '＋ New country', search: 'Search country or player',
        choose: 'Select a team', country: 'Country', playerOne: 'First player', playerTwo: 'Second player',
        entryType: 'Route to the tournament', directEntry: 'Direct entry', qualifierEntry: 'Regional qualifiers', qualifierEvent: 'Qualifier event',
        replaces: 'Replaces a direct-entry country', qualifierReplaces: 'Replaces a country in this qualifier', addToQualifier: 'Add without replacing a country',
        rule: 'The World Cup has 33 direct entries and 7 qualifier places. A new country can replace a team or join a qualifier event.',
        active: 'The current World Cup is already under way. Changes apply to the next edition.', save: 'Save lineup', reset: 'Restore automatic lineup',
        remove: 'Remove new team', custom: 'Custom lineup', automatic: 'Automatic lineup', qualifier: 'Qualifiers', direct: 'Direct entry',
        count: '{shown} of {total} teams', new: 'New national team', noPlayers: 'Add two players from this country in the player editor.',
        noCountries: 'No new country has at least two players. Add players in the editor first.',
        invalidPlayers: 'Choose two different players representing the same country.',
        invalidReplacement: 'Choose an available direct-entry country for the new team to replace.',
        invalidQualifier: 'Choose a qualifier event and an available country to replace, or add the team without replacing one.',
        saved: 'Saved the {country} lineup.', removed: 'Restored the automatic {country} lineup.',
        deleted: 'Removed {country}; the replaced country is back in the field.',
        deletedAddition: 'Removed {country} from the qualifiers.'
    },
    de: {
        switch: '🌍 World-Cup-Teams', eyebrow: 'NATIONALTEAMS', title: '🌍 World-Cup-Teameditor',
        intro: 'Wähle zwei Spieler desselben Landes. Das Team spielt ab der nächsten Ausgabe.',
        back: 'Zurück zum Spielereditor', list: 'Nationalteams', add: '＋ Neues Land', search: 'Land oder Spieler suchen',
        choose: 'Team auswählen', country: 'Land', playerOne: 'Erster Spieler', playerTwo: 'Zweiter Spieler',
        entryType: 'Weg ins Turnier', directEntry: 'Direkte Teilnahme', qualifierEntry: 'Regionale Qualifikation', qualifierEvent: 'Qualifikation',
        replaces: 'Ersetzt ein direkt qualifiziertes Land', qualifierReplaces: 'Ersetzt ein Land in dieser Qualifikation', addToQualifier: 'Hinzufügen ohne ein Land zu ersetzen',
        rule: 'Der World Cup hat 33 direkte Plätze und 7 Qualifikationsplätze. Ein neues Land kann ein Team ersetzen oder an einer Qualifikation teilnehmen.',
        active: 'Der aktuelle World Cup läuft bereits. Änderungen gelten ab der nächsten Ausgabe.', save: 'Team speichern', reset: 'Automatisches Team wiederherstellen',
        remove: 'Neues Team entfernen', custom: 'Eigenes Team', automatic: 'Automatisches Team', qualifier: 'Qualifikation', direct: 'Direkt qualifiziert',
        count: '{shown} von {total} Teams', new: 'Neues Nationalteam', noPlayers: 'Füge im Spielereditor zwei Spieler dieses Landes hinzu.',
        noCountries: 'Kein neues Land hat mindestens zwei Spieler. Füge zuerst Spieler hinzu.',
        invalidPlayers: 'Wähle zwei verschiedene Spieler desselben Landes.',
        invalidReplacement: 'Wähle ein verfügbares direkt qualifiziertes Land als Ersatz.',
        invalidQualifier: 'Wähle eine Qualifikation und ein verfügbares Land als Ersatz oder füge das Team zusätzlich hinzu.',
        saved: 'Team {country} gespeichert.', removed: 'Automatisches Team {country} wiederhergestellt.',
        deleted: '{country} entfernt; das ersetzte Land ist wieder im Teilnehmerfeld.',
        deletedAddition: '{country} aus der Qualifikation entfernt.'
    },
    nl: {
        switch: '🌍 World Cup-teams', eyebrow: 'LANDENTEAMS', title: '🌍 World Cup-teameditor',
        intro: 'Kies twee spelers uit hetzelfde land. Het team speelt vanaf de volgende editie.',
        back: 'Terug naar spelereditor', list: 'Landenteams', add: '＋ Nieuw land', search: 'Zoek land of speler',
        choose: 'Kies een team', country: 'Land', playerOne: 'Eerste speler', playerTwo: 'Tweede speler',
        entryType: 'Route naar het toernooi', directEntry: 'Direct geplaatst', qualifierEntry: 'Regionale kwalificatie', qualifierEvent: 'Kwalificatietoernooi',
        replaces: 'Vervangt een direct geplaatst land', qualifierReplaces: 'Vervangt een land in deze kwalificatie', addToQualifier: 'Toevoegen zonder een land te vervangen',
        rule: 'De World Cup heeft 33 directe plaatsen en 7 kwalificatieplaatsen. Een nieuw land kan een team vervangen of aan een kwalificatie deelnemen.',
        active: 'De huidige World Cup is al begonnen. Wijzigingen gelden vanaf de volgende editie.', save: 'Team opslaan', reset: 'Automatisch team herstellen',
        remove: 'Nieuw team verwijderen', custom: 'Eigen team', automatic: 'Automatisch team', qualifier: 'Kwalificatie', direct: 'Direct geplaatst',
        count: '{shown} van {total} teams', new: 'Nieuw landenteam', noPlayers: 'Voeg twee spelers uit dit land toe in de spelereditor.',
        noCountries: 'Geen nieuw land heeft minstens twee spelers. Voeg eerst spelers toe.',
        invalidPlayers: 'Kies twee verschillende spelers uit hetzelfde land.',
        invalidReplacement: 'Kies een beschikbaar direct geplaatst land om te vervangen.',
        invalidQualifier: 'Kies een kwalificatie en een beschikbaar land om te vervangen, of voeg het team extra toe.',
        saved: 'Team {country} opgeslagen.', removed: 'Automatisch team {country} hersteld.',
        deleted: '{country} verwijderd; het vervangen land doet weer mee.',
        deletedAddition: '{country} uit de kwalificatie verwijderd.'
    }
};

let worldCupEditorSelectedCountry = null;
let worldCupEditorCreating = false;
let worldCupEditorReturnScreen = 'screen-player-editor';
const worldCupEditorElement = id => document.getElementById(`world-cup-editor-${id}`);
function trWorldCupEditor(key, values = {}) {
    const language = typeof currentLang === 'string' && WORLD_CUP_EDITOR_TEXT[currentLang] ? currentLang : 'pl';
    return (WORLD_CUP_EDITOR_TEXT[language][key] || WORLD_CUP_EDITOR_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, field) => String(values[field] ?? ''));
}
function getWorldCupEditorPlayers(country) {
    const unique = new Map();
    [typeof player !== 'undefined' ? player : null, ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : [])]
        .filter(candidate => candidate && !candidate.isBye && candidate.country === country).forEach(candidate => {
            const key = getWorldCupPlayerIdentity(candidate);
            if (key && !unique.has(key)) unique.set(key, candidate);
        });
    return [...unique.values()].sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0)
        || String(first.name).localeCompare(String(second.name)));
}
function getWorldCupEditorCountries() {
    return [...new Set([...getWorldCupAutomaticNationList(),
        ...getWorldCupQualifierEvents().flatMap(event => event.nations)])]
        .sort((first, second) => getWorldCupCountryName(first).localeCompare(getWorldCupCountryName(second)));
}
function getWorldCupEditorNewCountries() {
    const current = new Set(getWorldCupEditorCountries());
    const standard = new Set([...WORLD_CUP_AUTOMATIC_NATIONS,
        ...WORLD_CUP_QUALIFIER_EVENTS.flatMap(event => event.nations)]);
    const all = new Set([typeof player !== 'undefined' ? player?.country : '',
        ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers.map(candidate => candidate?.country) : [])]);
    return [...all].filter(country => country && !current.has(country) && !standard.has(country)
        && getWorldCupEditorPlayers(country).length >= 2)
        .sort((first, second) => getWorldCupCountryName(first).localeCompare(getWorldCupCountryName(second)));
}
function worldCupEditorOption(value, label) {
    const option = document.createElement('option');
    option.value = value; option.textContent = label;
    return option;
}
function setWorldCupEditorStatus(message = '', error = false) {
    const status = worldCupEditorElement('status');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', error);
}
function renderWorldCupTeamEditorList() {
    if (typeof document === 'undefined' || !worldCupEditorElement('list')) return;
    const countries = getWorldCupEditorCountries();
    const teams = new Map(buildWorldCupTeams(countries).map(team => [team.country, team]));
    const directCountries = new Set(getWorldCupAutomaticNationList());
    const qualifierEvents = getWorldCupQualifierEvents();
    const search = worldCupEditorElement('search').value.trim().toLocaleLowerCase();
    const shown = countries.filter(country => {
        const names = teams.get(country)?.players.map(candidate => candidate.name).join(' ') || '';
        return `${getWorldCupCountryName(country)} ${country} ${names}`.toLocaleLowerCase().includes(search);
    });
    const list = worldCupEditorElement('list');
    list.replaceChildren();
    shown.forEach(country => {
        const team = teams.get(country), override = getWorldCupTeamOverrides()[country];
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'world-cup-editor-list-item';
        button.classList.toggle('is-selected', !worldCupEditorCreating && worldCupEditorSelectedCountry === country);
        const title = document.createElement('strong'); title.textContent = getWorldCupCountryName(country);
        const detail = document.createElement('small');
        const qualifierEvent = qualifierEvents.find(event => event.nations.includes(country));
        const route = !directCountries.has(country) && qualifierEvent
            ? getWorldCupQualifierLabel(qualifierEvent) : trWorldCupEditor('direct');
        detail.textContent = `${team.players.map(candidate => candidate.name).join(' / ')} · ${route}`
            + (override ? ` · ${trWorldCupEditor('custom')}` : '');
        button.append(title, detail);
        button.addEventListener('click', () => selectWorldCupTeamEditorCountry(country));
        list.appendChild(button);
    });
    worldCupEditorElement('count').textContent = trWorldCupEditor('count', { shown: shown.length, total: countries.length });
}
function updateWorldCupTeamEditorCountry() {
    const country = worldCupEditorElement('country').value;
    const candidates = getWorldCupEditorPlayers(country);
    const selectedTeam = country ? buildWorldCupTeams([country])[0] : null;
    for (const [index, id] of ['player-one', 'player-two'].entries()) {
        const select = worldCupEditorElement(id);
        select.replaceChildren(worldCupEditorOption('', '—'));
        candidates.forEach(candidate => select.appendChild(worldCupEditorOption(getWorldCupPlayerIdentity(candidate), candidate.name)));
        const chosen = selectedTeam?.players[index];
        if (chosen && !chosen.isWorldCupGuest) select.value = getWorldCupPlayerIdentity(chosen);
    }
    const override = getWorldCupTeamOverrides()[country];
    const entryType = worldCupEditorElement('entry-type');
    entryType.value = override?.qualifierEventId ? 'qualifier' : 'direct';
    const qualifierEvent = worldCupEditorElement('qualifier-event');
    qualifierEvent.replaceChildren(...WORLD_CUP_QUALIFIER_EVENTS.map(event =>
        worldCupEditorOption(event.id, getWorldCupQualifierLabel(event))));
    qualifierEvent.value = override?.qualifierEventId || WORLD_CUP_QUALIFIER_EVENTS[0].id;
    worldCupEditorElement('replaces').value = '';
    updateWorldCupTeamEditorEntry();
    worldCupEditorElement('form-title').textContent = worldCupEditorCreating
        ? trWorldCupEditor('new') : country ? getWorldCupCountryName(country) : trWorldCupEditor('choose');
    const reset = worldCupEditorElement('reset');
    reset.hidden = worldCupEditorCreating || !override;
    reset.textContent = override?.replaces || override?.qualifierEventId
        ? trWorldCupEditor('remove') : trWorldCupEditor('reset');
    worldCupEditorElement('save').disabled = !country || candidates.length < 2;
    if (country && candidates.length < 2) setWorldCupEditorStatus(trWorldCupEditor('noPlayers'), true);
    else setWorldCupEditorStatus('');
}

function isCustomWorldCupEditorNation(country) {
    return Boolean(country && !WORLD_CUP_AUTOMATIC_NATIONS.includes(country)
        && !WORLD_CUP_QUALIFIER_EVENTS.some(event => event.nations.includes(country))
        && !(player?.country === country && !getWorldCupTeamOverrides()[country]
            && getWorldCupAutomaticNationList().includes(country)));
}

function updateWorldCupTeamEditorEntry() {
    const country = worldCupEditorElement('country').value;
    const isNewNation = isCustomWorldCupEditorNation(country);
    const qualifier = worldCupEditorElement('entry-type').value === 'qualifier';
    worldCupEditorElement('entry-wrap').hidden = !isNewNation;
    worldCupEditorElement('qualifier-wrap').hidden = !isNewNation || !qualifier;
    worldCupEditorElement('replaces-wrap').hidden = !isNewNation;
    worldCupEditorElement('replaces-label').textContent = trWorldCupEditor(qualifier ? 'qualifierReplaces' : 'replaces');
    const replaces = worldCupEditorElement('replaces');
    const previous = replaces.value;
    replaces.replaceChildren(worldCupEditorOption('', qualifier ? trWorldCupEditor('addToQualifier') : '—'));
    if (!isNewNation) return;
    const eventId = worldCupEditorElement('qualifier-event').value;
    const candidates = qualifier ? WORLD_CUP_QUALIFIER_EVENTS.find(event => event.id === eventId)?.nations || []
        : WORLD_CUP_AUTOMATIC_NATIONS;
    const overrides = getWorldCupTeamOverrides();
    const occupied = new Set(Object.entries(overrides).filter(([other]) => other !== country)
        .map(([, value]) => value?.replaces).filter(Boolean));
    candidates.filter(candidate => !occupied.has(candidate) && candidate !== player?.country
        && !overrides[candidate]).forEach(candidate =>
        replaces.appendChild(worldCupEditorOption(candidate, getWorldCupCountryName(candidate))));
    const saved = overrides[country];
    const preferred = saved && (qualifier ? saved.qualifierEventId === eventId : !saved.qualifierEventId)
        ? saved.replaces : previous;
    replaces.value = [...replaces.options].some(option => option.value === preferred) ? preferred : '';
}
function selectWorldCupTeamEditorCountry(country) {
    worldCupEditorCreating = false;
    worldCupEditorSelectedCountry = country;
    const select = worldCupEditorElement('country');
    select.replaceChildren(worldCupEditorOption(country, getWorldCupCountryName(country)));
    select.value = country;
    updateWorldCupTeamEditorCountry();
    renderWorldCupTeamEditorList();
}
function startAddingWorldCupTeam() {
    const countries = getWorldCupEditorNewCountries();
    if (!countries.length) { setWorldCupEditorStatus(trWorldCupEditor('noCountries'), true); return false; }
    worldCupEditorCreating = true;
    worldCupEditorSelectedCountry = null;
    const select = worldCupEditorElement('country');
    select.replaceChildren(...countries.map(country => worldCupEditorOption(country, getWorldCupCountryName(country))));
    select.value = countries[0];
    updateWorldCupTeamEditorCountry();
    renderWorldCupTeamEditorList();
    select.focus();
    return true;
}
function saveWorldCupTeamEditor(event) {
    event?.preventDefault?.();
    const country = worldCupEditorElement('country').value;
    const candidates = getWorldCupEditorPlayers(country);
    const first = candidates.find(candidate => getWorldCupPlayerIdentity(candidate) === worldCupEditorElement('player-one').value);
    const second = candidates.find(candidate => getWorldCupPlayerIdentity(candidate) === worldCupEditorElement('player-two').value);
    if (!first || !second || first === second || first.country !== country || second.country !== country) {
        setWorldCupEditorStatus(trWorldCupEditor('invalidPlayers'), true); return false;
    }
    const isNewNation = isCustomWorldCupEditorNation(country);
    const qualifierRequested = isNewNation && worldCupEditorElement('entry-type').value === 'qualifier';
    const qualifierEventId = qualifierRequested
        ? worldCupEditorElement('qualifier-event').value : '';
    const qualifierEvent = WORLD_CUP_QUALIFIER_EVENTS.find(item => item.id === qualifierEventId);
    const replaces = isNewNation ? worldCupEditorElement('replaces').value : '';
    const taken = Object.entries(getWorldCupTeamOverrides()).some(([other, override]) => other !== country && override?.replaces === replaces);
    if (isNewNation && (qualifierRequested && !qualifierEvent
        || !qualifierRequested && !WORLD_CUP_AUTOMATIC_NATIONS.includes(replaces)
        || replaces && (replaces === player?.country || taken || getWorldCupTeamOverrides()[replaces]))) {
        setWorldCupEditorStatus(trWorldCupEditor(qualifierRequested ? 'invalidQualifier' : 'invalidReplacement'), true); return false;
    }
    if (qualifierEvent && replaces && !qualifierEvent.nations.includes(replaces)) {
        setWorldCupEditorStatus(trWorldCupEditor('invalidQualifier'), true); return false;
    }
    const reference = candidate => ({ id: candidate.id || null, name: candidate.name,
        identity: getWorldCupPlayerIdentity(candidate) });
    player.worldCupTeamOverrides = { ...getWorldCupTeamOverrides(), [country]: {
        players: [reference(first), reference(second)], ...(replaces ? { replaces } : {}),
        ...(qualifierEventId ? { qualifierEventId } : {})
    } };
    if (typeof saveGame === 'function') saveGame(true, { immediate: true });
    selectWorldCupTeamEditorCountry(country);
    setWorldCupEditorStatus(trWorldCupEditor('saved', { country: getWorldCupCountryName(country) }));
    return true;
}
function resetWorldCupTeamEditor() {
    const country = worldCupEditorSelectedCountry;
    const override = getWorldCupTeamOverrides()[country];
    if (!country || !override) return false;
    const next = { ...getWorldCupTeamOverrides() };
    delete next[country];
    player.worldCupTeamOverrides = next;
    if (typeof saveGame === 'function') saveGame(true, { immediate: true });
    const customNation = Boolean(override.replaces || override.qualifierEventId);
    const nextCountry = customNation ? (typeof player !== 'undefined' && player?.country
        && getWorldCupEditorCountries().includes(player.country) ? player.country : getWorldCupEditorCountries()[0]) : country;
    selectWorldCupTeamEditorCountry(nextCountry);
    const message = customNation ? override.qualifierEventId && !override.replaces ? 'deletedAddition' : 'deleted' : 'removed';
    setWorldCupEditorStatus(trWorldCupEditor(message, { country: getWorldCupCountryName(country) }));
    return true;
}
function refreshWorldCupTeamEditorTranslations() {
    if (typeof document === 'undefined' || !worldCupEditorElement('title')) return;
    const labels = { eyebrow: 'eyebrow', title: 'title', intro: 'intro', back: 'back', 'list-title': 'list', new: 'add',
        'search-label': 'search', rule: 'rule', 'country-label': 'country', 'player-one-label': 'playerOne',
        'player-two-label': 'playerTwo', 'entry-label': 'entryType', 'qualifier-label': 'qualifierEvent',
        'replaces-label': 'replaces', save: 'save' };
    for (const [id, key] of Object.entries(labels)) worldCupEditorElement(id).textContent = trWorldCupEditor(key);
    const button = document.getElementById('player-editor-world-cup');
    if (button) button.textContent = trWorldCupEditor('switch');
    const tournamentButton = document.getElementById('tournament-editor-world-cup');
    if (tournamentButton) tournamentButton.textContent = trWorldCupEditor('switch');
    const activeHint = worldCupEditorElement('active-hint');
    activeHint.hidden = !(typeof worldCupState !== 'undefined' && worldCupState && !worldCupState.completed);
    activeHint.textContent = trWorldCupEditor('active');
    const entryType = worldCupEditorElement('entry-type');
    entryType.options[0].textContent = trWorldCupEditor('directEntry');
    entryType.options[1].textContent = trWorldCupEditor('qualifierEntry');
    for (const option of worldCupEditorElement('qualifier-event').options) {
        const event = WORLD_CUP_QUALIFIER_EVENTS.find(candidate => candidate.id === option.value);
        if (event) option.textContent = getWorldCupQualifierLabel(event);
    }
    for (const id of ['country', 'replaces']) {
        for (const option of worldCupEditorElement(id).options) {
            if (option.value) option.textContent = getWorldCupCountryName(option.value);
        }
    }
    worldCupEditorElement('form-title').textContent = worldCupEditorCreating ? trWorldCupEditor('new')
        : worldCupEditorSelectedCountry ? getWorldCupCountryName(worldCupEditorSelectedCountry) : trWorldCupEditor('choose');
    const override = getWorldCupTeamOverrides()[worldCupEditorSelectedCountry];
    worldCupEditorElement('reset').textContent = override?.replaces || override?.qualifierEventId
        ? trWorldCupEditor('remove') : trWorldCupEditor('reset');
    updateWorldCupTeamEditorEntry();
    if (worldCupEditorElement('list').children.length) renderWorldCupTeamEditorList();
}
function showWorldCupTeamEditor() {
    if (typeof player === 'undefined' || !player) return false;
    if (!document.getElementById('screen-world-cup-editor').classList.contains('active')) {
        worldCupEditorReturnScreen = document.getElementById('screen-tournament-editor')?.classList.contains('active')
            ? 'screen-tournament-editor' : 'screen-player-editor';
    }
    refreshWorldCupTeamEditorTranslations();
    if (typeof showScreen === 'function') showScreen('screen-world-cup-editor');
    const countries = getWorldCupEditorCountries();
    const chosen = countries.includes(worldCupEditorSelectedCountry) ? worldCupEditorSelectedCountry
        : countries.includes(player.country) ? player.country : countries[0];
    if (chosen) selectWorldCupTeamEditorCountry(chosen);
    return true;
}
function closeWorldCupTeamEditor() {
    if (worldCupEditorReturnScreen === 'screen-tournament-editor' && typeof showTournamentEditor === 'function')
        return showTournamentEditor();
    if (typeof showPlayerEditor === 'function') return showPlayerEditor();
    if (typeof showScreen === 'function') showScreen('screen-player-editor');
    return true;
}
if (typeof document !== 'undefined') refreshWorldCupTeamEditorTranslations();
