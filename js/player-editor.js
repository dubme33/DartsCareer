const PLAYER_EDITOR_MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PLAYER_EDITOR_MAX_WALKON_BYTES = 4 * 1024 * 1024;
const PLAYER_EDITOR_FALLBACK_YEAR = 2026;

const PLAYER_EDITOR_TRANSLATIONS = {
    pl: {
        tileTitle: '🪪 Edytor zawodników', tileDesc: 'Edytuj bazę, statystyki, zdjęcia i walk-ony lub dodaj nową postać.',
        eyebrow: 'BAZA ZAWODNIKÓW', title: '🪪 Edytor zawodników',
        intro: 'Zmiany dotyczą bieżącej kariery i zostaną zapisane razem z nią.', baseMode: 'Gra podstawowa', modMode: 'Aktywny mod',
        roster: 'Zawodnicy', count: '{shown} z {total} zawodników', add: '＋ Dodaj', searchLabel: 'Szukaj zawodnika',
        search: 'Szukaj po nazwisku lub kraju…', empty: 'Nie znaleziono zawodników pasujących do wyszukiwania.',
        editKicker: 'EDYCJA WPISU', addKicker: 'NOWY WPIS', choose: 'Wybierz zawodnika', create: 'Nowy zawodnik',
        baseOrigin: 'Baza gry', modOrigin: 'Wpis moda', customOrigin: 'Dodany w edytorze', careerOrigin: 'Twoja postać',
        photo: 'Zdjęcie zawodnika', noPhoto: 'BRAK ZDJĘCIA', photoHint: 'PNG, JPG lub WebP, maksymalnie 2 MB.',
        uploadPhoto: 'Wybierz zdjęcie', removePhoto: 'Usuń zdjęcie', photoAlt: 'Zdjęcie zawodnika',
        personal: 'Dane zawodnika', firstName: 'Imię', lastName: 'Nazwisko', country: 'Kraj', birthYear: 'Rok urodzenia',
        gender: 'Płeć', male: 'Mężczyzna', female: 'Kobieta', favoriteDouble: 'Ulubiony double',
        ratings: 'Oceny meczowe', overall: 'Overall', scoring: 'Punktowanie', doubles: 'Podwójne',
        traits: 'Cechy dodatkowe', endurance: 'Wytrzymałość', consistency: 'Regularność', mental: 'Mental',
        back: 'Wróć do menu', save: 'Zapisz zmiany', createButton: 'Dodaj zawodnika',
        saved: 'Zapisano zmiany zawodnika {name}.', added: 'Dodano zawodnika {name}.',
        invalidName: 'Podaj imię i nazwisko zawodnika.', invalidCountry: 'Wybierz kraj.',
        invalidBirthYear: 'Rok urodzenia musi mieścić się między {min} a {max}.', invalidRating: 'Sprawdź zakresy wszystkich ocen.',
        duplicate: 'Zawodnik o tej nazwie i kraju już istnieje.', invalidPhoto: 'Wybierz plik PNG, JPG lub WebP.',
        photoTooLarge: 'Zdjęcie jest za duże. Maksymalny rozmiar to 2 MB.', photoReadError: 'Nie udało się odczytać zdjęcia.',
        photoReady: 'Zdjęcie jest gotowe. Zapisz zmiany, aby je przypisać.', photoRemoved: 'Zdjęcie zostanie usunięte po zapisaniu zmian.',
        walkon: 'Muzyka wejściowa (walk-on)', walkonHint: 'MP3, WAV lub OGG, maksymalnie 4 MB.', uploadWalkon: 'Wybierz utwór',
        removeWalkon: 'Przywróć domyślny', walkonCustom: 'Własny utwór — możesz go odsłuchać poniżej.',
        walkonMod: 'Utwór z aktywnego moda będzie używany w meczu.', walkonDefault: 'Gra użyje domyślnej muzyki tego zawodnika.',
        walkonNone: 'Brak własnego utworu.', invalidWalkon: 'Wybierz plik MP3, WAV lub OGG.',
        walkonTooLarge: 'Utwór jest za duży. Maksymalny rozmiar to 4 MB.', walkonReadError: 'Nie udało się odczytać utworu.',
        walkonReady: 'Walk-on jest gotowy. Zapisz zmiany, aby go przypisać.', walkonRemoved: 'Po zapisaniu zostanie przywrócona muzyka domyślna lub utwór z moda.'
    },
    en: {
        tileTitle: '🪪 Player editor', tileDesc: 'Edit the roster, ratings, photos and walk-ons or add a new player.',
        eyebrow: 'PLAYER DATABASE', title: '🪪 Player editor', intro: 'Changes apply to this career and are saved together with it.',
        baseMode: 'Base game', modMode: 'Active mod', roster: 'Players', count: '{shown} of {total} players', add: '＋ Add',
        searchLabel: 'Search players', search: 'Search by name or country…', empty: 'No players match your search.',
        editKicker: 'EDIT ENTRY', addKicker: 'NEW ENTRY', choose: 'Select a player', create: 'New player',
        baseOrigin: 'Game database', modOrigin: 'Mod entry', customOrigin: 'Added in editor', careerOrigin: 'Your player', photo: 'Player photo', noPhoto: 'NO PHOTO',
        photoHint: 'PNG, JPG or WebP, up to 2 MB.', uploadPhoto: 'Choose photo', removePhoto: 'Remove photo', photoAlt: 'Player photo',
        personal: 'Player details', firstName: 'First name', lastName: 'Last name', country: 'Country', birthYear: 'Year of birth',
        gender: 'Gender', male: 'Male', female: 'Female', favoriteDouble: 'Favourite double', ratings: 'Match ratings',
        overall: 'Overall', scoring: 'Scoring', doubles: 'Doubles', traits: 'Additional traits', endurance: 'Endurance',
        consistency: 'Consistency', mental: 'Mental', back: 'Back to menu', save: 'Save changes', createButton: 'Add player',
        saved: 'Saved changes to {name}.', added: 'Added player {name}.', invalidName: 'Enter the player’s first and last name.',
        invalidCountry: 'Select a country.', invalidBirthYear: 'Year of birth must be between {min} and {max}.',
        invalidRating: 'Check the allowed ranges for all ratings.', duplicate: 'A player with this name and country already exists.',
        invalidPhoto: 'Choose a PNG, JPG or WebP file.', photoTooLarge: 'The photo is too large. Maximum size is 2 MB.',
        photoReadError: 'The photo could not be read.', photoReady: 'The photo is ready. Save changes to assign it.',
        photoRemoved: 'The photo will be removed when you save the changes.',
        walkon: 'Walk-on music', walkonHint: 'MP3, WAV or OGG, up to 4 MB.', uploadWalkon: 'Choose track',
        removeWalkon: 'Restore default', walkonCustom: 'Custom track — you can preview it below.',
        walkonMod: 'The active mod track will be used in the match.', walkonDefault: 'The game will use this player’s default music.',
        walkonNone: 'No custom track.', invalidWalkon: 'Choose an MP3, WAV or OGG file.',
        walkonTooLarge: 'The track is too large. Maximum size is 4 MB.', walkonReadError: 'The track could not be read.',
        walkonReady: 'The walk-on is ready. Save changes to assign it.', walkonRemoved: 'Saving will restore the default or mod track.'
    },
    de: {
        tileTitle: '🪪 Spielereditor', tileDesc: 'Kader, Werte, Fotos und Walk-ons bearbeiten oder einen neuen Spieler hinzufügen.',
        eyebrow: 'SPIELERDATENBANK', title: '🪪 Spielereditor', intro: 'Änderungen gelten für diese Karriere und werden mit ihr gespeichert.',
        baseMode: 'Grundspiel', modMode: 'Aktiver Mod', roster: 'Spieler', count: '{shown} von {total} Spielern', add: '＋ Hinzufügen',
        searchLabel: 'Spieler suchen', search: 'Nach Name oder Land suchen…', empty: 'Keine passenden Spieler gefunden.',
        editKicker: 'EINTRAG BEARBEITEN', addKicker: 'NEUER EINTRAG', choose: 'Spieler auswählen', create: 'Neuer Spieler',
        baseOrigin: 'Spieldatenbank', modOrigin: 'Mod-Eintrag', customOrigin: 'Im Editor erstellt', careerOrigin: 'Dein Spieler', photo: 'Spielerfoto', noPhoto: 'KEIN FOTO',
        photoHint: 'PNG, JPG oder WebP, maximal 2 MB.', uploadPhoto: 'Foto wählen', removePhoto: 'Foto entfernen', photoAlt: 'Spielerfoto',
        personal: 'Spielerdaten', firstName: 'Vorname', lastName: 'Nachname', country: 'Land', birthYear: 'Geburtsjahr',
        gender: 'Geschlecht', male: 'Männlich', female: 'Weiblich', favoriteDouble: 'Lieblingsdoppel', ratings: 'Matchwerte',
        overall: 'Overall', scoring: 'Scoring', doubles: 'Doppel', traits: 'Zusätzliche Eigenschaften', endurance: 'Ausdauer',
        consistency: 'Konstanz', mental: 'Mental', back: 'Zurück zum Menü', save: 'Änderungen speichern', createButton: 'Spieler hinzufügen',
        saved: 'Änderungen für {name} gespeichert.', added: 'Spieler {name} hinzugefügt.', invalidName: 'Vor- und Nachname eingeben.',
        invalidCountry: 'Land auswählen.', invalidBirthYear: 'Das Geburtsjahr muss zwischen {min} und {max} liegen.',
        invalidRating: 'Bitte alle Wertebereiche prüfen.', duplicate: 'Ein Spieler mit diesem Namen und Land existiert bereits.',
        invalidPhoto: 'Bitte PNG, JPG oder WebP auswählen.', photoTooLarge: 'Das Foto ist zu groß. Maximal 2 MB.',
        photoReadError: 'Das Foto konnte nicht gelesen werden.', photoReady: 'Das Foto ist bereit. Änderungen speichern, um es zuzuweisen.',
        photoRemoved: 'Das Foto wird beim Speichern entfernt.',
        walkon: 'Walk-on-Musik', walkonHint: 'MP3, WAV oder OGG, maximal 4 MB.', uploadWalkon: 'Titel wählen',
        removeWalkon: 'Standard wiederherstellen', walkonCustom: 'Eigener Titel — unten kannst du ihn anhören.',
        walkonMod: 'Im Match wird der Titel des aktiven Mods verwendet.', walkonDefault: 'Das Spiel verwendet die Standardmusik dieses Spielers.',
        walkonNone: 'Kein eigener Titel.', invalidWalkon: 'Bitte MP3, WAV oder OGG auswählen.',
        walkonTooLarge: 'Der Titel ist zu groß. Maximal 4 MB.', walkonReadError: 'Der Titel konnte nicht gelesen werden.',
        walkonReady: 'Der Walk-on ist bereit. Änderungen speichern, um ihn zuzuweisen.', walkonRemoved: 'Beim Speichern wird der Standard- oder Mod-Titel wiederhergestellt.'
    },
    nl: {
        tileTitle: '🪪 Spelerseditor', tileDesc: 'Bewerk spelers, ratings, foto’s en walk-ons of voeg een nieuwe speler toe.',
        eyebrow: 'SPELERSDATABASE', title: '🪪 Spelerseditor', intro: 'Wijzigingen gelden voor deze carrière en worden ermee opgeslagen.',
        baseMode: 'Basisspel', modMode: 'Actieve mod', roster: 'Spelers', count: '{shown} van {total} spelers', add: '＋ Toevoegen',
        searchLabel: 'Spelers zoeken', search: 'Zoek op naam of land…', empty: 'Geen spelers gevonden voor deze zoekopdracht.',
        editKicker: 'ITEM BEWERKEN', addKicker: 'NIEUW ITEM', choose: 'Kies een speler', create: 'Nieuwe speler',
        baseOrigin: 'Speldatabase', modOrigin: 'Mod-item', customOrigin: 'Toegevoegd in editor', careerOrigin: 'Jouw speler', photo: 'Spelersfoto', noPhoto: 'GEEN FOTO',
        photoHint: 'PNG, JPG of WebP, maximaal 2 MB.', uploadPhoto: 'Kies foto', removePhoto: 'Foto verwijderen', photoAlt: 'Spelersfoto',
        personal: 'Spelersgegevens', firstName: 'Voornaam', lastName: 'Achternaam', country: 'Land', birthYear: 'Geboortejaar',
        gender: 'Geslacht', male: 'Man', female: 'Vrouw', favoriteDouble: 'Favoriete dubbel', ratings: 'Wedstrijdratings',
        overall: 'Overall', scoring: 'Scoring', doubles: 'Dubbels', traits: 'Extra eigenschappen', endurance: 'Uithoudingsvermogen',
        consistency: 'Regelmaat', mental: 'Mentaal', back: 'Terug naar menu', save: 'Wijzigingen opslaan', createButton: 'Speler toevoegen',
        saved: 'Wijzigingen voor {name} opgeslagen.', added: 'Speler {name} toegevoegd.', invalidName: 'Vul voor- en achternaam in.',
        invalidCountry: 'Kies een land.', invalidBirthYear: 'Het geboortejaar moet tussen {min} en {max} liggen.',
        invalidRating: 'Controleer het bereik van alle ratings.', duplicate: 'Een speler met deze naam en dit land bestaat al.',
        invalidPhoto: 'Kies een PNG-, JPG- of WebP-bestand.', photoTooLarge: 'De foto is te groot. Maximaal 2 MB.',
        photoReadError: 'De foto kon niet worden gelezen.', photoReady: 'De foto is klaar. Sla de wijzigingen op om hem toe te wijzen.',
        photoRemoved: 'De foto wordt verwijderd zodra je de wijzigingen opslaat.',
        walkon: 'Walk-onmuziek', walkonHint: 'MP3, WAV of OGG, maximaal 4 MB.', uploadWalkon: 'Kies nummer',
        removeWalkon: 'Standaard herstellen', walkonCustom: 'Eigen nummer — je kunt het hieronder beluisteren.',
        walkonMod: 'Het nummer uit de actieve mod wordt in de wedstrijd gebruikt.', walkonDefault: 'De game gebruikt de standaardmuziek van deze speler.',
        walkonNone: 'Geen eigen nummer.', invalidWalkon: 'Kies een MP3-, WAV- of OGG-bestand.',
        walkonTooLarge: 'Het nummer is te groot. Maximaal 4 MB.', walkonReadError: 'Het nummer kon niet worden gelezen.',
        walkonReady: 'De walk-on is klaar. Sla de wijzigingen op om hem toe te wijzen.', walkonRemoved: 'Bij opslaan wordt het standaard- of modnummer hersteld.'
    }
};

let playerEditorSelectedId = '';
let playerEditorCreating = false;
let playerEditorPendingPhoto;
let playerEditorPhotoChanged = false;
let playerEditorPendingWalkon;
let playerEditorWalkonChanged = false;

function trPlayerEditor(key, values = {}) {
    const language = typeof currentLang === 'string' && PLAYER_EDITOR_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = PLAYER_EDITOR_TRANSLATIONS[language][key] || PLAYER_EDITOR_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function setPlayerEditorText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function getPlayerEditorReferenceYear() {
    return typeof currentDate !== 'undefined' && currentDate instanceof Date && !Number.isNaN(currentDate.getTime())
        ? currentDate.getFullYear()
        : PLAYER_EDITOR_FALLBACK_YEAR;
}

function getPlayerEditorNameParts(candidate) {
    const parts = String(candidate?.name || '').trim().split(/\s+/).filter(Boolean);
    return { firstName: parts.shift() || '', lastName: parts.join(' ') };
}

function normalizePlayerEditorIdentity(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
}

function getPlayerEditorRosterPlayers() {
    const roster = typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)
        ? pdcPlayers.filter(candidate => candidate && !candidate.isBye)
        : [];
    if (typeof player !== 'undefined' && player?.name && !roster.some(candidate => candidate === player || (candidate.id && candidate.id === player.id))) {
        roster.push(player);
    }
    return roster;
}

function getPlayerEditorCandidate(id = playerEditorSelectedId) {
    return getPlayerEditorRosterPlayers().find(candidate => candidate.id === id) || null;
}

function getPlayerEditorPhotoSource(candidate) {
    if (!candidate) return '';
    if (typeof candidate.photo === 'string' && candidate.photo) return candidate.photo;
    if (typeof moddedAssets !== 'undefined' && moddedAssets?.photos) {
        const modPhoto = moddedAssets.photos[candidate.name] || moddedAssets.photos[candidate.sourceName];
        if (modPhoto) return modPhoto;
    }
    const bundledName = candidate.sourceName || candidate.name;
    return bundledName ? `zdjecia/${encodeURIComponent(bundledName)}.png` : '';
}

function setPlayerEditorStatus(message = '', isError = false) {
    const status = document.getElementById('player-editor-status');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function renderPlayerEditorPhoto(source = '') {
    const preview = document.getElementById('player-editor-photo-preview');
    const wrap = preview?.closest('.player-editor-photo-wrap');
    if (!preview || !wrap) return;
    preview.onerror = null;
    wrap.classList.toggle('has-photo', Boolean(source));
    preview.removeAttribute('src');
    if (!source) return;
    preview.onerror = () => {
        preview.onerror = null;
        preview.removeAttribute('src');
        wrap.classList.remove('has-photo');
    };
    preview.src = source;
}

function getPlayerEditorModWalkon(candidate) {
    if (!candidate || typeof moddedAssets === 'undefined' || !moddedAssets?.music) return '';
    return moddedAssets.music[candidate.name] || moddedAssets.music[candidate.sourceName] || '';
}

function stopPlayerEditorWalkonPreview() {
    const preview = document.getElementById('player-editor-walkon-preview');
    if (!preview) return;
    preview.pause?.();
    preview.removeAttribute('src');
    preview.load?.();
    preview.hidden = true;
}

function renderPlayerEditorWalkon(candidate = null, customSource = '') {
    const preview = document.getElementById('player-editor-walkon-preview');
    const removeButton = document.getElementById('player-editor-walkon-remove');
    stopPlayerEditorWalkonPreview();
    const hasCustomSource = typeof customSource === 'string' && Boolean(customSource);
    if (preview && hasCustomSource) {
        preview.src = customSource;
        preview.hidden = false;
    }
    if (removeButton) removeButton.disabled = !hasCustomSource;
    const sourceKey = hasCustomSource
        ? 'walkonCustom'
        : getPlayerEditorModWalkon(candidate)
            ? 'walkonMod'
            : candidate
                ? 'walkonDefault'
                : 'walkonNone';
    setPlayerEditorText('player-editor-walkon-source', trPlayerEditor(sourceKey));
}

function renderPlayerEditorCountryOptions(selectedCountry = '') {
    const select = document.getElementById('player-editor-country');
    if (!select || typeof countries === 'undefined' || !Array.isArray(countries)) return;
    const locale = typeof currentLang === 'string' ? currentLang : 'pl';
    const entries = countries.map(country => ({
        value: country,
        label: typeof t === 'function' ? t(country) : country
    })).sort((first, second) => first.label.localeCompare(second.label, locale));
    select.replaceChildren();
    entries.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.value;
        option.textContent = entry.label;
        select.appendChild(option);
    });
    if (entries.some(entry => entry.value === selectedCountry)) select.value = selectedCountry;
    else if (entries.some(entry => entry.value === 'Polska')) select.value = 'Polska';
}

function renderPlayerEditorDoubleOptions(selectedDouble = 16) {
    const select = document.getElementById('player-editor-favorite-double');
    if (!select) return;
    select.replaceChildren();
    for (let value = 1; value <= 20; value++) {
        const option = document.createElement('option');
        option.value = String(value);
        option.textContent = `D${value}`;
        select.appendChild(option);
    }
    select.value = String(Number.isInteger(Number(selectedDouble)) ? selectedDouble : 16);
}

function renderPlayerEditorRoster() {
    const list = document.getElementById('player-editor-roster-list');
    if (!list || typeof pdcPlayers === 'undefined' || !Array.isArray(pdcPlayers)) return;
    const search = normalizePlayerEditorIdentity(document.getElementById('player-editor-search')?.value);
    const locale = typeof currentLang === 'string' ? currentLang : 'pl';
    const players = getPlayerEditorRosterPlayers().slice()
        .sort((first, second) => String(first.name || '').localeCompare(String(second.name || ''), locale));
    const filtered = players.filter(candidate => !search || [candidate.name, candidate.country,
        typeof t === 'function' ? t(candidate.country) : candidate.country]
        .some(value => normalizePlayerEditorIdentity(value).includes(search)));

    list.replaceChildren();
    filtered.forEach(candidate => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `player-editor-roster-item${candidate.id === playerEditorSelectedId && !playerEditorCreating ? ' is-selected' : ''}`;
        button.setAttribute('aria-pressed', candidate.id === playerEditorSelectedId && !playerEditorCreating ? 'true' : 'false');
        button.addEventListener('click', () => selectPlayerEditorCandidate(candidate.id));

        const name = document.createElement('strong');
        name.textContent = candidate.name || '—';
        const country = document.createElement('small');
        country.textContent = typeof t === 'function' ? t(candidate.country) : candidate.country;
        const overall = document.createElement('b');
        overall.textContent = `OVR ${Math.round(Number(candidate.baseOvr ?? candidate.ovr ?? candidate.overall) || 0)}`;
        button.append(name, country, overall);
        list.appendChild(button);
    });
    if (!filtered.length) {
        const empty = document.createElement('p');
        empty.className = 'player-editor-empty-list';
        empty.textContent = trPlayerEditor('empty');
        list.appendChild(empty);
    }
    setPlayerEditorText('player-editor-roster-count', trPlayerEditor('count', { shown: filtered.length, total: players.length }));
}

function getPlayerEditorOrigin(candidate) {
    if (typeof player !== 'undefined' && candidate === player) return trPlayerEditor('careerOrigin');
    if (candidate?.editorCreated) return trPlayerEditor('customOrigin');
    return typeof activeModData !== 'undefined' && activeModData ? trPlayerEditor('modOrigin') : trPlayerEditor('baseOrigin');
}

function populatePlayerEditorForm(candidate = null) {
    const creating = !candidate;
    const year = getPlayerEditorReferenceYear();
    const parts = getPlayerEditorNameParts(candidate);
    const setValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.value = value ?? '';
    };

    setPlayerEditorText('player-editor-form-kicker', trPlayerEditor(creating ? 'addKicker' : 'editKicker'));
    setPlayerEditorText('player-editor-form-title', creating ? trPlayerEditor('create') : candidate.name);
    setPlayerEditorText('player-editor-origin', creating ? trPlayerEditor('customOrigin') : getPlayerEditorOrigin(candidate));
    setPlayerEditorText('player-editor-save', trPlayerEditor(creating ? 'createButton' : 'save'));

    setValue('player-editor-first-name', parts.firstName);
    setValue('player-editor-last-name', parts.lastName);
    renderPlayerEditorCountryOptions(candidate?.country || 'Polska');
    setValue('player-editor-birth-year', Number.isInteger(candidate?.birthYear) ? candidate.birthYear : year - 24);
    const birthInput = document.getElementById('player-editor-birth-year');
    if (birthInput) birthInput.max = String(year - 12);
    setValue('player-editor-gender', candidate?.gender === 'female' ? 'female' : 'male');
    renderPlayerEditorDoubleOptions(candidate?.favoriteDouble ?? 16);

    const overall = Math.round(Number(candidate?.baseOvr ?? candidate?.ovr ?? candidate?.overall) || 60);
    setValue('player-editor-overall', overall);
    setValue('player-editor-scoring', Math.round(Number(candidate?.baseScoring ?? candidate?.scoring) || overall));
    setValue('player-editor-doubles', Math.round(Number(candidate?.baseDoubles ?? candidate?.doubles) || overall));
    setValue('player-editor-endurance', candidate && typeof getPlayerTrait === 'function' ? Math.round(getPlayerTrait(candidate, 'endurance')) : 60);
    setValue('player-editor-consistency', candidate && typeof getPlayerTrait === 'function' ? Math.round(getPlayerTrait(candidate, 'consistency')) : 60);
    setValue('player-editor-mental', candidate && typeof getPlayerTrait === 'function' ? Math.round(getPlayerTrait(candidate, 'mental')) : 60);

    playerEditorPendingPhoto = undefined;
    playerEditorPhotoChanged = false;
    const photoInput = document.getElementById('player-editor-photo-input');
    if (photoInput) photoInput.value = '';
    renderPlayerEditorPhoto(getPlayerEditorPhotoSource(candidate));
    playerEditorPendingWalkon = undefined;
    playerEditorWalkonChanged = false;
    const walkonInput = document.getElementById('player-editor-walkon-input');
    if (walkonInput) walkonInput.value = '';
    renderPlayerEditorWalkon(candidate, typeof candidate?.walkon === 'string' ? candidate.walkon : '');
    setPlayerEditorStatus();
}

function selectPlayerEditorCandidate(id) {
    const candidate = getPlayerEditorCandidate(id);
    if (!candidate) return false;
    playerEditorSelectedId = candidate.id;
    playerEditorCreating = false;
    renderPlayerEditorRoster();
    populatePlayerEditorForm(candidate);
    return true;
}

function startAddingPlayer() {
    playerEditorSelectedId = '';
    playerEditorCreating = true;
    renderPlayerEditorRoster();
    populatePlayerEditorForm(null);
    document.getElementById('player-editor-first-name')?.focus();
}

function getPlayerEditorNumber(id, min, max) {
    const value = Number(document.getElementById(id)?.value);
    return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

function createPlayerEditorPlayer(data) {
    const year = getPlayerEditorReferenceYear();
    const id = typeof createEntityId === 'function' ? createEntityId('editor') : `editor-${Date.now()}`;
    return {
        id,
        name: data.name,
        sourceName: data.name,
        country: data.country,
        gender: data.gender,
        birthYear: data.birthYear,
        favoriteDouble: data.favoriteDouble,
        overall: data.overall,
        ovr: data.overall,
        scoring: data.scoring,
        doubles: data.doubles,
        baseOvr: data.overall,
        baseScoring: data.scoring,
        baseDoubles: data.doubles,
        form: 0,
        prizeMoney: 0,
        proTourPrizeMoney: 0,
        pcPrizeMoney: 0,
        europeanTourPrizeMoney: 0,
        hasTourCard: false,
        tourCardSource: null,
        tourCardStartYear: null,
        tourCardExpiryYear: null,
        historyPT: {},
        historyMain: {},
        mainPrizeHistory: [],
        seasonStats: { year, highestAvg: 0, results: [] },
        joinedSeason: year,
        editorCreated: true
    };
}

function applyPlayerEditorTraits(candidate, values) {
    if (typeof initializePlayerTraits === 'function') initializePlayerTraits(candidate);
    const previous = candidate.traits && typeof candidate.traits === 'object' ? candidate.traits : {};
    const enduranceBaseline = typeof getTraitAgeBaseline === 'function' ? getTraitAgeBaseline(candidate) : values.endurance;
    const mentalAgeBonus = typeof getMentalAgeBonus === 'function' ? getMentalAgeBonus(candidate) : 0;
    const mentalTitleBonus = typeof getMentalTitleCount === 'function' ? Math.min(20, getMentalTitleCount(candidate)) : 0;
    candidate.traits = {
        ...previous,
        version: typeof PLAYER_TRAITS_CONFIG !== 'undefined' ? PLAYER_TRAITS_CONFIG.version : (previous.version || 2),
        endurance: values.endurance,
        consistency: values.consistency,
        mental: values.mental,
        enduranceXP: 0,
        consistencyXP: 0,
        mentalXP: 0,
        ageBaseline: enduranceBaseline,
        mentalAgeBonus,
        mentalTitleBonus,
        matchXP: previous.matchXP && typeof previous.matchXP === 'object'
            ? previous.matchXP
            : { week: '', endurance: 0, consistency: 0 }
    };
}

function collectPlayerEditorForm(candidate) {
    const firstName = String(document.getElementById('player-editor-first-name')?.value || '').trim().replace(/\s+/g, ' ');
    const lastName = String(document.getElementById('player-editor-last-name')?.value || '').trim().replace(/\s+/g, ' ');
    if (!firstName || !lastName) return { error: trPlayerEditor('invalidName') };
    const country = document.getElementById('player-editor-country')?.value || '';
    if (!country || (typeof countries !== 'undefined' && Array.isArray(countries) && !countries.includes(country))) {
        return { error: trPlayerEditor('invalidCountry') };
    }
    const year = getPlayerEditorReferenceYear();
    const birthYear = getPlayerEditorNumber('player-editor-birth-year', 1900, year - 12);
    if (birthYear === null) return { error: trPlayerEditor('invalidBirthYear', { min: 1900, max: year - 12 }) };

    const values = {
        name: `${firstName} ${lastName}`,
        country,
        birthYear,
        gender: document.getElementById('player-editor-gender')?.value === 'female' ? 'female' : 'male',
        favoriteDouble: getPlayerEditorNumber('player-editor-favorite-double', 1, 20) || 16,
        overall: getPlayerEditorNumber('player-editor-overall', 40, 99),
        scoring: getPlayerEditorNumber('player-editor-scoring', 40, 100),
        doubles: getPlayerEditorNumber('player-editor-doubles', 40, 100),
        endurance: getPlayerEditorNumber('player-editor-endurance', 0, 100),
        consistency: getPlayerEditorNumber('player-editor-consistency', 0, 100),
        mental: getPlayerEditorNumber('player-editor-mental', 0, 100)
    };
    if ([values.overall, values.scoring, values.doubles, values.endurance, values.consistency, values.mental].some(value => value === null)) {
        return { error: trPlayerEditor('invalidRating') };
    }
    const duplicate = getPlayerEditorRosterPlayers().find(other =>
        other !== candidate
        && normalizePlayerEditorIdentity(other?.name) === normalizePlayerEditorIdentity(values.name)
        && normalizePlayerEditorIdentity(other?.country) === normalizePlayerEditorIdentity(values.country));
    if (duplicate) return { error: trPlayerEditor('duplicate') };
    return { values };
}

function savePlayerEditor(event) {
    event?.preventDefault?.();
    const existing = playerEditorCreating ? null : getPlayerEditorCandidate();
    if (!playerEditorCreating && !existing) {
        setPlayerEditorStatus(trPlayerEditor('choose'), true);
        return false;
    }
    const collected = collectPlayerEditorForm(existing);
    if (collected.error) {
        setPlayerEditorStatus(collected.error, true);
        return false;
    }
    const values = collected.values;
    const candidate = existing || createPlayerEditorPlayer(values);
    const wasCreated = !existing;
    if (existing && !candidate.sourceName) candidate.sourceName = candidate.name;
    Object.assign(candidate, {
        name: values.name,
        country: values.country,
        birthYear: values.birthYear,
        gender: values.gender,
        favoriteDouble: values.favoriteDouble,
        overall: values.overall,
        ovr: values.overall,
        scoring: values.scoring,
        doubles: values.doubles,
        baseOvr: values.overall,
        baseScoring: values.scoring,
        baseDoubles: values.doubles,
        form: 0
    });
    applyPlayerEditorTraits(candidate, values);
    if (playerEditorPhotoChanged) candidate.photo = playerEditorPendingPhoto || '';
    if (playerEditorWalkonChanged) candidate.walkon = playerEditorPendingWalkon || null;
    if (typeof enforcePlayerRatingLimits === 'function') enforcePlayerRatingLimits(candidate);
    if (wasCreated) pdcPlayers.push(candidate);
    if (typeof normalizePlayerIds === 'function') normalizePlayerIds(pdcPlayers, typeof player !== 'undefined' ? player : null);
    if (typeof initPlayerSeasonStats === 'function') initPlayerSeasonStats(candidate);
    if (typeof invalidatePlayerLifecycleCache === 'function') invalidatePlayerLifecycleCache();
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache();
    if (typeof renderOpponentOptions === 'function') renderOpponentOptions();
    if (typeof renderCareerPlayerOptions === 'function') renderCareerPlayerOptions();
    if (typeof player !== 'undefined' && candidate === player && typeof updateHub === 'function') updateHub();

    playerEditorSelectedId = candidate.id;
    playerEditorCreating = false;
    renderPlayerEditorRoster();
    populatePlayerEditorForm(candidate);
    setPlayerEditorStatus(trPlayerEditor(wasCreated ? 'added' : 'saved', { name: candidate.name }));
    if (typeof saveGame === 'function') saveGame(true);
    return candidate;
}

function loadPlayerEditorPhoto(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) return;
    const supportedType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
        || (!file.type && /\.(?:png|jpe?g|webp)$/i.test(file.name || ''));
    if (!supportedType) {
        setPlayerEditorStatus(trPlayerEditor('invalidPhoto'), true);
        input.value = '';
        return;
    }
    if (file.size > PLAYER_EDITOR_MAX_PHOTO_BYTES) {
        setPlayerEditorStatus(trPlayerEditor('photoTooLarge'), true);
        input.value = '';
        return;
    }
    const selectionKey = `${playerEditorCreating ? 'new' : playerEditorSelectedId}`;
    const reader = new FileReader();
    reader.onload = () => {
        if (selectionKey !== `${playerEditorCreating ? 'new' : playerEditorSelectedId}`) return;
        playerEditorPendingPhoto = String(reader.result || '');
        playerEditorPhotoChanged = Boolean(playerEditorPendingPhoto);
        renderPlayerEditorPhoto(playerEditorPendingPhoto);
        setPlayerEditorStatus(trPlayerEditor('photoReady'));
    };
    reader.onerror = () => setPlayerEditorStatus(trPlayerEditor('photoReadError'), true);
    reader.readAsDataURL(file);
}

function removePlayerEditorPhoto() {
    playerEditorPendingPhoto = '';
    playerEditorPhotoChanged = true;
    const input = document.getElementById('player-editor-photo-input');
    if (input) input.value = '';
    renderPlayerEditorPhoto('');
    setPlayerEditorStatus(trPlayerEditor('photoRemoved'));
}

function isPlayerEditorWalkonFile(file) {
    if (!file) return false;
    const supportedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg'];
    return supportedTypes.includes(String(file.type || '').toLowerCase())
        || (!file.type && /\.(?:mp3|wav|ogg)$/i.test(file.name || ''));
}

function loadPlayerEditorWalkon(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) return;
    if (!isPlayerEditorWalkonFile(file)) {
        setPlayerEditorStatus(trPlayerEditor('invalidWalkon'), true);
        input.value = '';
        return;
    }
    if (file.size > PLAYER_EDITOR_MAX_WALKON_BYTES) {
        setPlayerEditorStatus(trPlayerEditor('walkonTooLarge'), true);
        input.value = '';
        return;
    }
    const selectionKey = `${playerEditorCreating ? 'new' : playerEditorSelectedId}`;
    const reader = new FileReader();
    reader.onload = () => {
        if (selectionKey !== `${playerEditorCreating ? 'new' : playerEditorSelectedId}`) return;
        playerEditorPendingWalkon = String(reader.result || '');
        playerEditorWalkonChanged = Boolean(playerEditorPendingWalkon);
        renderPlayerEditorWalkon(getPlayerEditorCandidate(), playerEditorPendingWalkon);
        setPlayerEditorStatus(trPlayerEditor('walkonReady'));
    };
    reader.onerror = () => setPlayerEditorStatus(trPlayerEditor('walkonReadError'), true);
    reader.readAsDataURL(file);
}

function removePlayerEditorWalkon() {
    playerEditorPendingWalkon = '';
    playerEditorWalkonChanged = true;
    const input = document.getElementById('player-editor-walkon-input');
    if (input) input.value = '';
    renderPlayerEditorWalkon(getPlayerEditorCandidate(), '');
    setPlayerEditorStatus(trPlayerEditor('walkonRemoved'));
}

function refreshPlayerEditorTranslations() {
    const textMap = {
        'player-editor-tile-title': 'tileTitle', 'player-editor-tile-desc': 'tileDesc', 'player-editor-eyebrow': 'eyebrow',
        'player-editor-title': 'title', 'player-editor-intro': 'intro', 'player-editor-roster-title': 'roster',
        'player-editor-new': 'add', 'player-editor-search-label': 'searchLabel', 'player-editor-photo-title': 'photo',
        'player-editor-photo-empty': 'noPhoto', 'player-editor-photo-hint': 'photoHint',
        'player-editor-photo-upload-label': 'uploadPhoto', 'player-editor-photo-remove': 'removePhoto',
        'player-editor-walkon-title': 'walkon', 'player-editor-walkon-hint': 'walkonHint',
        'player-editor-walkon-upload-label': 'uploadWalkon', 'player-editor-walkon-remove': 'removeWalkon',
        'player-editor-personal-title': 'personal', 'player-editor-first-name-label': 'firstName',
        'player-editor-last-name-label': 'lastName', 'player-editor-country-label': 'country',
        'player-editor-birth-year-label': 'birthYear', 'player-editor-gender-label': 'gender',
        'player-editor-favorite-double-label': 'favoriteDouble', 'player-editor-ratings-title': 'ratings',
        'player-editor-overall-label': 'overall', 'player-editor-scoring-label': 'scoring',
        'player-editor-doubles-label': 'doubles', 'player-editor-traits-title': 'traits',
        'player-editor-endurance-label': 'endurance', 'player-editor-consistency-label': 'consistency',
        'player-editor-mental-label': 'mental', 'player-editor-back': 'back'
    };
    Object.entries(textMap).forEach(([id, key]) => setPlayerEditorText(id, trPlayerEditor(key)));
    const search = document.getElementById('player-editor-search');
    if (search) search.placeholder = trPlayerEditor('search');
    const preview = document.getElementById('player-editor-photo-preview');
    if (preview) preview.alt = trPlayerEditor('photoAlt');
    const walkonPreview = document.getElementById('player-editor-walkon-preview');
    if (walkonPreview) walkonPreview.setAttribute('aria-label', trPlayerEditor('walkon'));
    const gender = document.getElementById('player-editor-gender');
    if (gender?.options?.length >= 2) {
        gender.options[0].textContent = trPlayerEditor('male');
        gender.options[1].textContent = trPlayerEditor('female');
    }
    setPlayerEditorText('player-editor-mode', typeof activeModData !== 'undefined' && activeModData ? trPlayerEditor('modMode') : trPlayerEditor('baseMode'));
    if (document.getElementById('screen-player-editor')?.classList.contains('active')) {
        const selectedCountry = document.getElementById('player-editor-country')?.value;
        renderPlayerEditorCountryOptions(selectedCountry);
        renderPlayerEditorRoster();
        setPlayerEditorText('player-editor-form-kicker', trPlayerEditor(playerEditorCreating ? 'addKicker' : 'editKicker'));
        setPlayerEditorText('player-editor-origin', playerEditorCreating ? trPlayerEditor('customOrigin') : getPlayerEditorOrigin(getPlayerEditorCandidate()));
        setPlayerEditorText('player-editor-save', trPlayerEditor(playerEditorCreating ? 'createButton' : 'save'));
        const candidate = playerEditorCreating ? null : getPlayerEditorCandidate();
        const walkonSource = playerEditorWalkonChanged
            ? playerEditorPendingWalkon
            : (typeof candidate?.walkon === 'string' ? candidate.walkon : '');
        renderPlayerEditorWalkon(candidate, walkonSource);
    }
}

function closePlayerEditor() {
    stopPlayerEditorWalkonPreview();
    if (typeof showScreen === 'function') showScreen('screen-hub');
}

function showPlayerEditor() {
    if (typeof pdcPlayers === 'undefined' || !Array.isArray(pdcPlayers)) return false;
    if (typeof normalizePlayerIds === 'function') normalizePlayerIds(pdcPlayers, typeof player !== 'undefined' ? player : null);
    refreshPlayerEditorTranslations();
    const selected = getPlayerEditorCandidate()
        || (typeof player !== 'undefined' && player?.name ? player : null)
        || pdcPlayers.find(candidate => candidate && !candidate.isBye)
        || null;
    if (selected) {
        playerEditorSelectedId = selected.id;
        playerEditorCreating = false;
        populatePlayerEditorForm(selected);
    } else {
        startAddingPlayer();
    }
    renderPlayerEditorRoster();
    if (typeof showScreen === 'function') showScreen('screen-player-editor');
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'auto' });
    return true;
}

if (typeof document !== 'undefined') refreshPlayerEditorTranslations();
