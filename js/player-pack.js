// Share editor-controlled player data without copying another career's results or finances.
const PLAYER_PACK_FORMAT = 'darts-career-player-pack';
const PLAYER_PACK_VERSION = 1;
const PLAYER_PACK_MAX_BYTES = 64 * 1024 * 1024;
const PLAYER_PACK_MAX_PLAYERS = 5000;
const PLAYER_PACK_TEXT = {
    pl: { title: 'Pakiety zawodników', intro: 'Udostępnij bazę AI w pliku JSON lub wczytaj bazę od innego gracza.',
        export: 'Eksportuj bazę', import: 'Wczytaj bazę', preview: 'Podgląd importu',
        hint: 'Wybierz działanie dla każdej zmiany. Wyniki, pieniądze rankingowe i własna postać kariery nie są przenoszone. Usunięcia są domyślnie pomijane.',
        cancel: 'Anuluj', apply: 'Zastosuj wybrane zmiany', add: 'Dodaj', replace: 'Zastąp dane', remove: 'Usuń', skip: 'Pomiń',
        summary: 'Dodaj: {add} · zastąp: {replace} · usuń: {remove} · pomiń: {skip}',
        exported: 'Wyeksportowano {count} zawodników.', imported: 'Zastosowano {count} zmian w bazie zawodników.',
        invalid: 'Nieprawidłowy lub nieobsługiwany pakiet zawodników.', tooLarge: 'Pakiet przekracza limit 64 MB.',
        noChanges: 'Nie wybrano żadnych zmian.', saveFailed: 'Zmiany są aktywne, ale zapis kariery się nie powiódł.',
        duplicate: 'Powtarzający się zawodnik: {name}', conflict: 'Nie można zastosować wyboru: {reason}',
        career: 'To Twoja postać kariery', retired: 'Zawodnik zakończył już karierę w tym zapisie',
        ambiguous: 'Nie można jednoznacznie dopasować zawodnika',
        inUse: 'Zawodnik bierze udział w trwających rozgrywkach', missing: 'Zawodnika nie ma w tej karierze',
        same: 'Bez zmian', details: '{country} · OVR {overall} · {birthYear}', deleted: 'Usunięty zawodnik',
        fieldName: 'nazwisko', fieldCountry: 'kraj', fieldNickname: 'pseudonim', fieldBirth: 'rok urodzenia',
        fieldGender: 'płeć', fieldDoubles: 'ulubione double', fieldRatings: 'oceny', fieldTraits: 'cechy',
        fieldPhoto: 'zdjęcie', fieldWalkon: 'muzyka wejściowa', fieldDarts: 'lotki' },
    en: { title: 'Player packs', intro: 'Share the AI roster as a JSON file or load another player’s database.',
        export: 'Export database', import: 'Load database', preview: 'Import preview',
        hint: 'Choose an action for each change. Match results, ranking money and your career player are not transferred. Deletions are skipped by default.',
        cancel: 'Cancel', apply: 'Apply selected changes', add: 'Add', replace: 'Replace details', remove: 'Remove', skip: 'Skip',
        summary: 'Add: {add} · replace: {replace} · remove: {remove} · skip: {skip}',
        exported: 'Exported {count} players.', imported: 'Applied {count} player database changes.',
        invalid: 'Invalid or unsupported player pack.', tooLarge: 'The pack exceeds the 64 MB limit.',
        noChanges: 'No changes selected.', saveFailed: 'Changes are active, but saving the career failed.',
        duplicate: 'Duplicate player: {name}', conflict: 'Cannot apply selection: {reason}',
        career: 'This is your career player', retired: 'This player has retired in this career',
        ambiguous: 'Player match is ambiguous',
        inUse: 'Player is in an active competition', missing: 'Player is absent from this career',
        same: 'No changes', details: '{country} · OVR {overall} · {birthYear}', deleted: 'Deleted player',
        fieldName: 'name', fieldCountry: 'country', fieldNickname: 'nickname', fieldBirth: 'birth year',
        fieldGender: 'gender', fieldDoubles: 'favourite doubles', fieldRatings: 'ratings', fieldTraits: 'traits',
        fieldPhoto: 'photo', fieldWalkon: 'walk-on music', fieldDarts: 'darts' },
    de: { title: 'Spielerpakete', intro: 'KI-Spielerdatenbank als JSON-Datei teilen oder eine andere Datenbank laden.',
        export: 'Datenbank exportieren', import: 'Datenbank laden', preview: 'Importvorschau',
        hint: 'Wähle für jede Änderung eine Aktion. Ergebnisse, Ranglisten-Preisgeld und dein Karriere-Spieler werden nicht übertragen. Löschungen werden standardmäßig übersprungen.',
        cancel: 'Abbrechen', apply: 'Ausgewählte Änderungen übernehmen', add: 'Hinzufügen', replace: 'Daten ersetzen', remove: 'Entfernen', skip: 'Überspringen',
        summary: 'Neu: {add} · ersetzen: {replace} · entfernen: {remove} · überspringen: {skip}',
        exported: '{count} Spieler exportiert.', imported: '{count} Änderungen an der Spielerdatenbank übernommen.',
        invalid: 'Ungültiges oder nicht unterstütztes Spielerpaket.', tooLarge: 'Das Paket überschreitet 64 MB.',
        noChanges: 'Keine Änderungen ausgewählt.', saveFailed: 'Änderungen sind aktiv, aber die Karriere konnte nicht gespeichert werden.',
        duplicate: 'Doppelter Spieler: {name}', conflict: 'Auswahl kann nicht übernommen werden: {reason}',
        career: 'Das ist dein Karriere-Spieler', retired: 'Dieser Spieler hat seine Karriere bereits beendet',
        ambiguous: 'Spieler kann nicht eindeutig zugeordnet werden',
        inUse: 'Spieler nimmt an einem laufenden Wettbewerb teil', missing: 'Spieler fehlt in dieser Karriere',
        same: 'Keine Änderungen', details: '{country} · OVR {overall} · {birthYear}', deleted: 'Gelöschter Spieler',
        fieldName: 'Name', fieldCountry: 'Land', fieldNickname: 'Spitzname', fieldBirth: 'Geburtsjahr',
        fieldGender: 'Geschlecht', fieldDoubles: 'Lieblingsdoppel', fieldRatings: 'Werte', fieldTraits: 'Eigenschaften',
        fieldPhoto: 'Foto', fieldWalkon: 'Walk-on-Musik', fieldDarts: 'Darts' },
    nl: { title: 'Spelerspakketten', intro: 'Deel de AI-spelersdatabase als JSON of laad een database van een andere speler.',
        export: 'Database exporteren', import: 'Database laden', preview: 'Importvoorbeeld',
        hint: 'Kies per wijziging een actie. Wedstrijdresultaten, rankinggeld en je eigen carrièrespeler worden niet overgenomen. Verwijderingen worden standaard overgeslagen.',
        cancel: 'Annuleren', apply: 'Gekozen wijzigingen toepassen', add: 'Toevoegen', replace: 'Gegevens vervangen', remove: 'Verwijderen', skip: 'Overslaan',
        summary: 'Toevoegen: {add} · vervangen: {replace} · verwijderen: {remove} · overslaan: {skip}',
        exported: '{count} spelers geëxporteerd.', imported: '{count} wijzigingen in de spelersdatabase toegepast.',
        invalid: 'Ongeldig of niet ondersteund spelerspakket.', tooLarge: 'Het pakket is groter dan 64 MB.',
        noChanges: 'Geen wijzigingen gekozen.', saveFailed: 'Wijzigingen zijn actief, maar de carrière kon niet worden opgeslagen.',
        duplicate: 'Dubbele speler: {name}', conflict: 'Keuze kan niet worden toegepast: {reason}',
        career: 'Dit is je eigen carrièrespeler', retired: 'Deze speler is in deze carrière gestopt',
        ambiguous: 'Speler kan niet eenduidig worden gekoppeld',
        inUse: 'Speler speelt in een lopende competitie', missing: 'Speler ontbreekt in deze carrière',
        same: 'Geen wijzigingen', details: '{country} · OVR {overall} · {birthYear}', deleted: 'Verwijderde speler',
        fieldName: 'naam', fieldCountry: 'land', fieldNickname: 'bijnaam', fieldBirth: 'geboortejaar',
        fieldGender: 'geslacht', fieldDoubles: 'favoriete dubbels', fieldRatings: 'ratings', fieldTraits: 'eigenschappen',
        fieldPhoto: 'foto', fieldWalkon: 'walk-onmuziek', fieldDarts: 'darts' }
};

function trPlayerPack(key, values = {}) {
    const lang = typeof currentLang === 'string' && PLAYER_PACK_TEXT[currentLang] ? currentLang : 'pl';
    return (PLAYER_PACK_TEXT[lang][key] || PLAYER_PACK_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, field) => String(values[field] ?? ''));
}
function playerPackError(key, values) { return new Error(trPlayerPack(key, values)); }
function playerPackString(value, max = 120, required = false) {
    if (typeof value !== 'string') throw playerPackError('invalid');
    const clean = value.trim();
    if (clean.length > max || required && !clean || /[\u0000-\u001f\u007f]/.test(clean)) throw playerPackError('invalid');
    return clean;
}
function playerPackInt(value, min, max) {
    if (!Number.isInteger(value) || value < min || value > max) throw playerPackError('invalid');
    return value;
}
function playerPackIdentity(value) { return normalizePlayerEditorIdentity(value); }
function playerPackKey(candidate) {
    const index = candidate?.defaultTemplateIndex;
    if (Number.isInteger(index) && index >= 0) return `template:${index}`;
    const source = playerPackIdentity(candidate?.sourceName || candidate?.name);
    const country = playerPackIdentity(candidate?.country);
    return `${candidate?.editorCreated ? 'custom' : 'source'}:${source}|${country}`;
}
function playerPackAsset(value, kind) {
    if (value === '' || value == null) return '';
    const pattern = kind === 'photo' ? /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/
        : /^data:audio\/(?:mpeg|mp3|wav|x-wav|ogg);base64,[A-Za-z0-9+/]+={0,2}$/;
    const limit = kind === 'photo' ? PLAYER_EDITOR_MAX_PHOTO_BYTES : PLAYER_EDITOR_MAX_WALKON_BYTES;
    if (typeof value !== 'string' || value.length > Math.ceil(limit * 4 / 3) + 80 || !pattern.test(value)) throw playerPackError('invalid');
    const encoded = value.slice(value.indexOf(',') + 1);
    if (Math.floor(encoded.length * 3 / 4) > limit + 2) throw playerPackError('invalid');
    return value;
}
function normalizePlayerPackEntry(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !['template', 'source', 'custom'].includes(raw.kind)) throw playerPackError('invalid');
    const index = raw.kind === 'template' ? playerPackInt(raw.defaultTemplateIndex, 0, 99999) : null;
    const name = playerPackString(raw.name, 120, true);
    if (name.split(/\s+/).length < 2) throw playerPackError('invalid');
    const entry = {
        kind: raw.kind, defaultTemplateIndex: index, sourceName: playerPackString(raw.sourceName, 120, true), name,
        country: playerPackString(raw.country, 80, true), nickname: playerPackString(raw.nickname, 48),
        birthYear: playerPackInt(raw.birthYear, 1900, 2100), gender: raw.gender,
        favoriteDoubles: raw.favoriteDoubles, overall: playerPackInt(raw.overall, 40, 99),
        scoring: playerPackInt(raw.scoring, 40, 100), doubles: playerPackInt(raw.doubles, 40, 100),
        endurance: playerPackInt(raw.endurance, 0, 100), consistency: playerPackInt(raw.consistency, 0, 100),
        mental: playerPackInt(raw.mental, 0, 100), photo: playerPackAsset(raw.photo, 'photo'),
        walkon: playerPackAsset(raw.walkon, 'walkon')
    };
    if (!['male', 'female'].includes(entry.gender) || !Array.isArray(entry.favoriteDoubles)
        || entry.favoriteDoubles.length !== 3) throw playerPackError('invalid');
    entry.favoriteDoubles = entry.favoriteDoubles.map(value => value == null ? null : playerPackInt(value, 1, 20));
    const doubles = entry.favoriteDoubles.filter(value => value != null);
    if (entry.favoriteDoubles[0] == null || new Set(doubles).size !== doubles.length) throw playerPackError('invalid');
    entry.key = playerPackKey({ ...entry, editorCreated: entry.kind === 'custom' });
    if (raw.key !== entry.key) throw playerPackError('invalid');
    if (Object.prototype.hasOwnProperty.call(raw, 'darts')) {
        if (raw.darts === null) entry.darts = null;
        else if (typeof isValidAiDartAppearance === 'function' && isValidAiDartAppearance(raw.darts))
            entry.darts = normalizeAiDartAppearance(raw.darts);
        else throw playerPackError('invalid');
    }
    return entry;
}
function normalizePlayerPackDeletion(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !['template', 'source', 'custom'].includes(raw.kind)) throw playerPackError('invalid');
    const entry = { kind: raw.kind, defaultTemplateIndex: raw.kind === 'template'
        ? playerPackInt(raw.defaultTemplateIndex, 0, 99999) : null,
        sourceName: playerPackString(raw.sourceName, 120, true), name: playerPackString(raw.name, 120, true),
        country: playerPackString(raw.country, 80, true) };
    entry.key = playerPackKey({ ...entry, editorCreated: entry.kind === 'custom' });
    if (raw.key !== entry.key) throw playerPackError('invalid');
    return entry;
}
function parsePlayerPack(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.format !== PLAYER_PACK_FORMAT
        || raw.version !== PLAYER_PACK_VERSION || !Array.isArray(raw.players) || !Array.isArray(raw.deleted)
        || raw.players.length > PLAYER_PACK_MAX_PLAYERS || raw.deleted.length > PLAYER_PACK_MAX_PLAYERS) throw playerPackError('invalid');
    const players = raw.players.map(normalizePlayerPackEntry);
    const deleted = raw.deleted.map(normalizePlayerPackDeletion);
    const keys = new Set();
    for (const entry of [...players, ...deleted]) {
        if (keys.has(entry.key)) throw playerPackError('duplicate', { name: entry.name });
        keys.add(entry.key);
    }
    return { format: PLAYER_PACK_FORMAT, version: PLAYER_PACK_VERSION, players, deleted };
}
function createPlayerPackEntry(candidate) {
    const ratings = getPlayerEditorDisplayedRatings(candidate);
    const favoriteDoubles = typeof getPlayerFavoriteDoubles === 'function' ? getPlayerFavoriteDoubles(candidate)
        : candidate.favoriteDoubles || [candidate.favoriteDouble || 16, null, null];
    const value = trait => typeof getPlayerTrait === 'function' ? Math.round(getPlayerTrait(candidate, trait))
        : Math.round(Number(candidate.traits?.[trait]) || 60);
    const templateIndex = getPlayerEditorTemplateIndex(candidate);
    const kind = Number.isInteger(templateIndex) && templateIndex >= 0
        ? 'template' : candidate.editorCreated ? 'custom' : 'source';
    const raw = { key: playerPackKey({ ...candidate, defaultTemplateIndex: templateIndex }), kind,
        defaultTemplateIndex: kind === 'template' ? templateIndex : null,
        sourceName: candidate.sourceName || candidate.name, name: candidate.name, country: candidate.country,
        nickname: candidate.nickname || '', birthYear: candidate.birthYear || getPlayerEditorReferenceYear() - 24,
        gender: candidate.gender === 'female' ? 'female' : 'male', favoriteDoubles: [favoriteDoubles[0] || 16,
            favoriteDoubles[1] ?? null, favoriteDoubles[2] ?? null],
        overall: ratings.overall, scoring: ratings.scoring, doubles: ratings.doubles,
        endurance: value('endurance'), consistency: value('consistency'), mental: value('mental'),
        photo: typeof candidate.photo === 'string' && candidate.photo.startsWith('data:') ? candidate.photo : '',
        walkon: typeof candidate.walkon === 'string' && candidate.walkon.startsWith('data:') ? candidate.walkon : '' };
    if (typeof normalizeAiDartAppearance === 'function') raw.darts = candidate.aiDartAppearance
        ? normalizeAiDartAppearance(candidate.aiDartAppearance) : null;
    return normalizePlayerPackEntry(raw);
}
function createPlayerPack() {
    if (typeof pdcPlayers === 'undefined' || !Array.isArray(pdcPlayers)) throw playerPackError('invalid');
    const players = pdcPlayers.filter(candidate => candidate && !candidate.isBye && !candidate.isNewgen
        && candidate !== player && candidate.id !== player?.id && !isPlayerEditorDeleted(candidate))
        .map(createPlayerPackEntry);
    const deleted = getPlayerEditorDeletedPlayers().map(record => {
        const template = Number.isInteger(record.defaultTemplateIndex)
            ? (typeof defaultPdcPlayerTemplates !== 'undefined' ? defaultPdcPlayerTemplates[record.defaultTemplateIndex] : null)
            : null;
        const sourceName = record.sourceName || template?.sourceName || template?.name;
        const country = record.country || template?.country;
        const name = record.name || template?.name || sourceName;
        if (!sourceName || !country || !name) return null;
        const kind = Number.isInteger(record.defaultTemplateIndex) ? 'template' : record.editorCreated ? 'custom' : 'source';
        const entry = { kind, defaultTemplateIndex: kind === 'template' ? record.defaultTemplateIndex : null,
            sourceName, name, country };
        entry.key = playerPackKey({ ...entry, editorCreated: kind === 'custom' });
        return entry;
    }).filter(Boolean);
    return parsePlayerPack({ format: PLAYER_PACK_FORMAT, version: PLAYER_PACK_VERSION, players, deleted });
}

function createPlayerPackLookup(database) {
    const lookup = { key: new Map(), identity: new Map(), source: new Map(), name: new Map() };
    const add = (map, key, candidate) => {
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(candidate);
    };
    for (const candidate of database) {
        if (!candidate || candidate.isBye || candidate.isNewgen) continue;
        add(lookup.key, playerPackKey({ ...candidate,
            defaultTemplateIndex: getPlayerEditorTemplateIndex(candidate) }), candidate);
        const source = playerPackIdentity(candidate.sourceName || candidate.name);
        add(lookup.identity, `${source}|${playerPackIdentity(candidate.country)}`, candidate);
        add(lookup.source, source, candidate);
        add(lookup.name, `${playerPackIdentity(candidate.name)}|${playerPackIdentity(candidate.country)}`, candidate);
    }
    return lookup;
}
function findPlayerPackTarget(entry, database = pdcPlayers, lookup = createPlayerPackLookup(database)) {
    const byKey = lookup.key.get(entry.key) || [];
    if (byKey.length === 1) return { target: byKey[0] };
    if (byKey.length > 1) return { reason: 'ambiguous' };
    const source = playerPackIdentity(entry.sourceName);
    const byIdentity = lookup.identity.get(`${source}|${playerPackIdentity(entry.country)}`) || [];
    if (byIdentity.length === 1) return { target: byIdentity[0] };
    if (byIdentity.length > 1) return { reason: 'ambiguous' };
    const bySource = lookup.source.get(source) || [];
    if (bySource.length === 1) return { target: bySource[0] };
    if (bySource.length > 1) return { reason: 'ambiguous' };
    const byName = lookup.name.get(`${playerPackIdentity(entry.name)}|${playerPackIdentity(entry.country)}`) || [];
    if (byName.length === 1) return { target: byName[0] };
    return byName.length ? { reason: 'ambiguous' } : { target: null };
}
function isPlayerPackCareer(entry, target) {
    if (target && target === player) return true;
    if (entry.kind === 'template' && getPlayerEditorTemplateIndex(player) === entry.defaultTemplateIndex) return true;
    return Boolean(playerPackIdentity(entry.sourceName)
        && playerPackIdentity(player?.sourceName || player?.name) === playerPackIdentity(entry.sourceName));
}
function getPlayerPackChanges(target, entry) {
    if (!target) return [];
    const current = createPlayerPackEntry(target);
    const changed = (fields, key) => fields.some(field => current[field] !== entry[field]) ? [trPlayerPack(key)] : [];
    return [
        ...changed(['name'], 'fieldName'), ...changed(['country'], 'fieldCountry'),
        ...changed(['nickname'], 'fieldNickname'), ...changed(['birthYear'], 'fieldBirth'),
        ...changed(['gender'], 'fieldGender'),
        ...(current.favoriteDoubles.some((value, index) => value !== entry.favoriteDoubles[index])
            ? [trPlayerPack('fieldDoubles')] : []),
        ...changed(['overall', 'scoring', 'doubles'], 'fieldRatings'),
        ...changed(['endurance', 'consistency', 'mental'], 'fieldTraits'),
        ...changed(['photo'], 'fieldPhoto'), ...changed(['walkon'], 'fieldWalkon'),
        ...(entry.darts !== undefined && JSON.stringify(current.darts) !== JSON.stringify(entry.darts)
            ? [trPlayerPack('fieldDarts')] : [])
    ];
}
function planPlayerPackImport(pack, choices = {}, database = pdcPlayers) {
    const rows = [];
    const lookup = createPlayerPackLookup(database);
    for (const entry of pack.players) {
        const match = findPlayerPackTarget(entry, database, lookup);
        const reason = match.reason || (isPlayerPackCareer(entry, match.target) ? 'career'
            : !match.target && typeof isRetiredPlayer === 'function'
                && isRetiredPlayer(entry, entry.defaultTemplateIndex ?? undefined) ? 'retired' : '');
        const changes = match.target && !reason ? getPlayerPackChanges(match.target, entry) : [];
        const same = match.target && !reason && changes.length === 0;
        const available = reason ? ['skip'] : match.target ? ['replace', 'skip'] : ['add', 'skip'];
        const defaultAction = reason || same ? 'skip' : match.target ? 'replace' : 'add';
        const action = available.includes(choices[entry.key]) ? choices[entry.key] : defaultAction;
        rows.push({ entry, target: match.target, reason, available, action, choiceKey: entry.key, same: !!same, changes });
    }
    for (const entry of pack.deleted) {
        const match = findPlayerPackTarget(entry, database, lookup);
        const reason = match.reason || (isPlayerPackCareer(entry, match.target) ? 'career'
            : match.target && isPlayerEditorCandidateInUse(match.target) ? 'inUse'
                : !match.target ? 'missing' : '');
        const available = reason ? ['skip'] : ['skip', 'remove'];
        const choiceKey = `delete:${entry.key}`;
        rows.push({ entry, target: match.target, reason, available,
            action: available.includes(choices[choiceKey]) ? choices[choiceKey] : 'skip', choiceKey, deleted: true });
    }
    return rows;
}
function validatePlayerPackPlan(rows, database = pdcPlayers) {
    const changing = rows.filter(row => row.action !== 'skip');
    const targets = new Set();
    for (const row of changing) {
        if (row.reason || !row.available.includes(row.action)) throw playerPackError('conflict', { reason: trPlayerPack(row.reason || 'invalid') });
        if (row.target) {
            if (targets.has(row.target)) throw playerPackError('duplicate', { name: row.entry.name });
            targets.add(row.target);
        }
    }
    const final = database.filter(candidate => candidate && !changing.some(row => row.action === 'remove' && row.target === candidate));
    const names = new Map();
    for (const candidate of [...final, player]) {
        if (!candidate || candidate.isBye) continue;
        const replacement = changing.find(row => row.action === 'replace' && row.target === candidate);
        const name = replacement?.entry.name || candidate.name;
        const country = replacement?.entry.country || candidate.country;
        const key = `${playerPackIdentity(name)}|${playerPackIdentity(country)}`;
        if (names.has(key) && (replacement || names.get(key).replacement)) throw playerPackError('duplicate', { name });
        names.set(key, { replacement: !!replacement });
    }
    for (const row of changing.filter(row => row.action === 'add')) {
        const key = `${playerPackIdentity(row.entry.name)}|${playerPackIdentity(row.entry.country)}`;
        if (names.has(key)) throw playerPackError('duplicate', { name: row.entry.name });
        names.set(key, { replacement: true });
    }
    return changing;
}
function applyPlayerPackDetails(candidate, entry) {
    Object.assign(candidate, { name: entry.name, nickname: entry.nickname, country: entry.country,
        birthYear: entry.birthYear, gender: entry.gender, favoriteDouble: entry.favoriteDoubles[0],
        favoriteDoubles: entry.favoriteDoubles.slice(), overall: entry.overall, ovr: entry.overall,
        scoring: entry.scoring, doubles: entry.doubles, baseOvr: entry.overall,
        baseScoring: entry.scoring, baseDoubles: entry.doubles, photo: entry.photo,
        walkon: entry.walkon || null, playerEditorNicknameOverride: true,
        playerEditorRatingOverride: true, playerEditorProfileOverride: true });
    if (entry.darts !== undefined) {
        if (entry.darts === null) delete candidate.aiDartAppearance;
        else candidate.aiDartAppearance = normalizeAiDartAppearance(entry.darts);
    }
    if (typeof initializePlayerTraits === 'function') initializePlayerTraits(candidate);
    candidate.traits = { ...(candidate.traits || {}), endurance: entry.endurance,
        consistency: entry.consistency, mental: entry.mental };
    if (typeof enforcePlayerRatingLimits === 'function') enforcePlayerRatingLimits(candidate);
}
function removePlayerPackDeletion(entry) {
    if (!Array.isArray(player?.editorDeletedPlayers)) return;
    player.editorDeletedPlayers = player.editorDeletedPlayers.filter(record => {
        if (entry.kind === 'template' && record.defaultTemplateIndex === entry.defaultTemplateIndex) return false;
        return playerPackKey({ ...record, sourceName: record.sourceName || record.name,
            editorCreated: record.editorCreated }) !== entry.key;
    });
}

let stagedPlayerPack = null;
let playerPackChoices = {};
let playerPackFileGeneration = 0;
function setPlayerPackStatus(message, error = false) {
    const element = document.getElementById('player-pack-status');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', error);
}
function refreshPlayerPackTranslations() {
    if (typeof document === 'undefined' || !document.getElementById('player-pack-heading')) return;
    const ids = { 'player-pack-heading': 'title', 'player-pack-intro': 'intro', 'player-pack-export': 'export',
        'player-pack-import': 'import', 'player-pack-preview-title': 'preview', 'player-pack-hint': 'hint',
        'player-pack-cancel': 'cancel', 'player-pack-apply': 'apply' };
    Object.entries(ids).forEach(([id, key]) => { document.getElementById(id).textContent = trPlayerPack(key); });
    if (stagedPlayerPack) renderPlayerPackPreview();
}
function exportPlayerPack() {
    try {
        const pack = createPlayerPack();
        const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
        if (blob.size > PLAYER_PACK_MAX_BYTES) throw playerPackError('tooLarge');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = 'darts-career-player-pack.json';
        document.body.appendChild(link);
        link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
        setPlayerPackStatus(trPlayerPack('exported', { count: pack.players.length }));
        return true;
    } catch (error) {
        setPlayerPackStatus(error.message || trPlayerPack('invalid'), true);
        return false;
    }
}
function openPlayerPackPicker() {
    const input = document.getElementById('player-pack-file');
    if (!input) return;
    input.value = '';
    input.click();
}
function stagePlayerPackText(text) {
    try {
        if (typeof text !== 'string' || new Blob([text]).size > PLAYER_PACK_MAX_BYTES) throw playerPackError('tooLarge');
        stagedPlayerPack = parsePlayerPack(JSON.parse(text.replace(/^\uFEFF/, '')));
        playerPackChoices = {};
        renderPlayerPackPreview();
        setPlayerPackStatus('');
        return true;
    } catch (error) {
        stagedPlayerPack = null;
        document.getElementById('player-pack-preview').hidden = true;
        setPlayerPackStatus(error instanceof SyntaxError ? trPlayerPack('invalid') : error.message || trPlayerPack('invalid'), true);
        return false;
    }
}
async function stagePlayerPackFile(event) {
    const file = event?.target?.files?.[0];
    if (!file) return false;
    const generation = ++playerPackFileGeneration;
    stagedPlayerPack = null;
    playerPackChoices = {};
    document.getElementById('player-pack-preview').hidden = true;
    if (file.size > PLAYER_PACK_MAX_BYTES) { setPlayerPackStatus(trPlayerPack('tooLarge'), true); return false; }
    try {
        const text = await file.text();
        return generation === playerPackFileGeneration && stagePlayerPackText(text);
    } catch (_) { setPlayerPackStatus(trPlayerPack('invalid'), true); return false; }
}
function cancelPlayerPackImport() {
    playerPackFileGeneration++;
    stagedPlayerPack = null;
    playerPackChoices = {};
    document.getElementById('player-pack-preview').hidden = true;
    setPlayerPackStatus('');
}
function choosePlayerPackAction(key, action) {
    playerPackChoices[key] = action;
    renderPlayerPackPreview();
}
function renderPlayerPackPreview() {
    if (!stagedPlayerPack || typeof document === 'undefined') return;
    const rows = planPlayerPackImport(stagedPlayerPack, playerPackChoices);
    const list = document.getElementById('player-pack-list');
    list.replaceChildren();
    const counts = { add: 0, replace: 0, remove: 0, skip: 0 };
    for (const row of rows) {
        counts[row.action]++;
        if (row.same && row.action === 'skip') continue;
        const item = document.createElement('div'); item.className = 'player-pack-row';
        if (row.reason) item.classList.add('locked');
        const description = document.createElement('div');
        const title = document.createElement('strong'); title.textContent = row.entry.name;
        const subtitle = document.createElement('small'); subtitle.textContent = row.reason ? trPlayerPack(row.reason)
            : row.deleted ? trPlayerPack('deleted')
                : row.target ? row.changes.join(' · ') || trPlayerPack('same')
                    : trPlayerPack('details', row.entry);
        description.append(title, subtitle);
        const select = document.createElement('select');
        select.setAttribute('aria-label', row.entry.name);
        for (const action of row.available) {
            const option = document.createElement('option'); option.value = action; option.textContent = trPlayerPack(action);
            select.appendChild(option);
        }
        select.value = row.action;
        select.disabled = row.available.length === 1;
        select.addEventListener('change', () => choosePlayerPackAction(row.choiceKey, select.value));
        item.append(description, select); list.appendChild(item);
    }
    document.getElementById('player-pack-summary').textContent = trPlayerPack('summary', counts);
    const validation = document.getElementById('player-pack-validation');
    validation.textContent = '';
    let valid = true;
    try { validatePlayerPackPlan(rows); }
    catch (error) { valid = false; validation.textContent = error.message || trPlayerPack('invalid'); }
    document.getElementById('player-pack-apply').disabled = !valid || counts.add + counts.replace + counts.remove === 0;
    document.getElementById('player-pack-preview').hidden = false;
}
async function applyStagedPlayerPack() {
    if (!stagedPlayerPack) return false;
    try {
        const changing = validatePlayerPackPlan(planPlayerPackImport(stagedPlayerPack, playerPackChoices));
        if (!changing.length) { setPlayerPackStatus(trPlayerPack('noChanges')); return false; }
        for (const row of changing) {
            if (row.action === 'remove') {
                rememberPlayerEditorDeletion(row.target);
                const index = pdcPlayers.indexOf(row.target);
                if (index >= 0) pdcPlayers.splice(index, 1);
                if (Array.isArray(player?.activeRivalIds)) player.activeRivalIds = player.activeRivalIds.filter(id => id !== row.target.id);
            } else if (row.action === 'replace') {
                applyPlayerPackDetails(row.target, row.entry);
            } else if (row.action === 'add') {
                const entry = row.entry;
                const candidate = createPlayerEditorPlayer({ ...entry,
                    favoriteDouble: entry.favoriteDoubles[0], rankingMoney: {
                        main: 0, proTour: 0, playersChampionship: 0, europeanTour: 0,
                        challengeTour: 0, developmentTour: 0 } });
                candidate.sourceName = entry.sourceName;
                candidate.editorCreated = entry.kind === 'custom';
                if (entry.kind === 'template') candidate.defaultTemplateIndex = entry.defaultTemplateIndex;
                applyPlayerPackDetails(candidate, entry);
                removePlayerPackDeletion(entry);
                pdcPlayers.push(candidate);
                if (typeof initPlayerSeasonStats === 'function') initPlayerSeasonStats(candidate);
            }
        }
        if (typeof normalizePlayerIds === 'function') normalizePlayerIds(pdcPlayers, player);
        if (typeof invalidatePlayerLifecycleCache === 'function') invalidatePlayerLifecycleCache();
        if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache();
        if (typeof renderOpponentOptions === 'function') renderOpponentOptions();
        if (typeof renderCareerPlayerOptions === 'function') renderCareerPlayerOptions();
        const selected = getPlayerEditorCandidate(playerEditorSelectedId) || getPlayerEditorRosterPlayers()[0] || null;
        playerEditorSelectedId = selected?.id || '';
        playerEditorCreating = !selected;
        renderPlayerEditorCountryFilterOptions();
        renderPlayerEditorRoster();
        populatePlayerEditorForm(selected);
        cancelPlayerPackImport();
        let saved = true;
        try { saved = typeof saveGame !== 'function' || await saveGame(true, { immediate: true }); }
        catch (_) { saved = false; }
        setPlayerPackStatus(saved === false ? trPlayerPack('saveFailed')
            : trPlayerPack('imported', { count: changing.length }), saved === false);
        return true;
    } catch (error) {
        setPlayerPackStatus(trPlayerPack('conflict', { reason: error.message || trPlayerPack('invalid') }), true);
        return false;
    }
}

if (typeof document !== 'undefined') refreshPlayerPackTranslations();
