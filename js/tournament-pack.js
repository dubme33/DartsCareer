// Portable tournament configuration. Match results, players, finances and save data never enter a pack.
const TOURNAMENT_PACK_FORMAT = 'darts-career-tournament-pack';
const TOURNAMENT_PACK_VERSION = 3;
const TOURNAMENT_PACK_MAX_BYTES = 2 * 1024 * 1024;
const TOURNAMENT_PACK_MAX_EVENTS = 1000;
const TOURNAMENT_PACK_FIELD_SIZES = [8, 16, 32, 64, 128, 256];
const TOURNAMENT_PACK_RANKINGS = ['open', 'oom', 'protour', 'pc', 'europeanTour', 'challengeTour', 'developmentTour'];
const TOURNAMENT_PACK_CYCLES = ['major', 'proTour', 'playersChampionship', 'europeanTour',
    'challengeTour', 'developmentTour', 'worldSeries', 'premierLeague', 'worldCup', 'qualifier', 'custom', 'other'];
const TOURNAMENT_PACK_TEXT = {
    pl: { title: 'Pakiety turniejów', intro: 'Zapisz kalendarz i zasady w pliku JSON albo wczytaj pakiet od innego gracza.',
        export: 'Eksportuj pakiet', import: 'Wczytaj pakiet', preview: 'Podgląd importu',
        hint: 'Sprawdź zmiany i wybierz działanie przy każdej nazwie. Wyniki rozegranych turniejów nie są przenoszone. Usunięcia są domyślnie pomijane.',
        cancel: 'Anuluj', apply: 'Zastosuj wybrane zmiany', add: 'Dodaj', replace: 'Zastąp ustawienia', skip: 'Pomiń', remove: 'Usuń',
        same: 'Bez zmian', date: 'termin', place: 'miejsce', field: 'liczba uczestników', rules: 'zasady kwalifikacji',
        format: 'format meczu', prize: 'nagrody', ranking: 'ranking', name: 'nazwa', eligibility: 'warunki udziału',
        calendar: 'kalendarz', removed: 'Usunięty turniej', missing: 'Turniej wbudowany lub moda nie istnieje w tej karierze',
        locked: 'Trwający lub ukończony turniej — ustawień nie można teraz zastąpić',
        typeMismatch: 'Nazwa jest zajęta przez inny rodzaj turnieju', ambiguous: 'Niejednoznaczny konflikt nazw',
        alreadyRemoved: 'Nie ma go w bieżącym kalendarzu', summary: 'Dodaj: {add} · zastąp: {replace} · usuń: {remove} · pomiń: {skip}',
        exported: 'Wyeksportowano {count} turniejów.', imported: 'Zastosowano {count} zmian w kalendarzu.',
        noChanges: 'Nie wybrano żadnych zmian.', invalid: 'Nieprawidłowy lub nieobsługiwany pakiet turniejów.',
        tooLarge: 'Plik jest za duży. Maksymalnie 2 MB.', saveFailed: 'Zmiany działają w tej sesji, ale zapis kariery się nie powiódł.',
        conflict: 'Sprawdź wybory: {reason}', linkMissing: 'Brakuje powiązanego kwalifikatora lub turnieju: {name}',
        linkInvalid: 'Niezgodne zasady powiązanych turniejów: {name}', duplicate: 'Powtarzająca się nazwa lub identyfikator: {name}' },
    en: { title: 'Tournament packs', intro: 'Save the calendar and rules to one JSON file, or load a pack from another player.',
        export: 'Export pack', import: 'Load pack', preview: 'Import preview',
        hint: 'Review changes and choose an action for each name. Played results are never imported. Removals are skipped by default.',
        cancel: 'Cancel', apply: 'Apply selected changes', add: 'Add', replace: 'Replace settings', skip: 'Skip', remove: 'Remove',
        same: 'No changes', date: 'date', place: 'location', field: 'field size', rules: 'qualification rules',
        format: 'match format', prize: 'prizes', ranking: 'ranking', name: 'name', eligibility: 'entry criteria',
        calendar: 'calendar', removed: 'Deleted event', missing: 'Built-in or mod event is absent from this career',
        locked: 'Active or completed event — its settings cannot be replaced now',
        typeMismatch: 'This name belongs to a different type of event', ambiguous: 'Ambiguous name conflict',
        alreadyRemoved: 'Already absent from the calendar', summary: 'Add: {add} · replace: {replace} · remove: {remove} · skip: {skip}',
        exported: 'Exported {count} events.', imported: 'Applied {count} calendar changes.',
        noChanges: 'No changes selected.', invalid: 'Invalid or unsupported tournament pack.',
        tooLarge: 'The file is too large. Maximum 2 MB.', saveFailed: 'Changes are active in this session, but saving the career failed.',
        conflict: 'Review your choices: {reason}', linkMissing: 'Linked qualifier or target is missing: {name}',
        linkInvalid: 'Linked event rules do not agree: {name}', duplicate: 'Duplicate name or identifier: {name}' },
    de: { title: 'Turnierpakete', intro: 'Kalender und Regeln als JSON-Datei speichern oder ein Paket anderer Spieler laden.',
        export: 'Paket exportieren', import: 'Paket laden', preview: 'Importvorschau',
        hint: 'Änderungen prüfen und je Namen eine Aktion wählen. Spielergebnisse werden nicht übertragen. Löschungen werden standardmäßig übersprungen.',
        cancel: 'Abbrechen', apply: 'Ausgewählte Änderungen übernehmen', add: 'Hinzufügen', replace: 'Einstellungen ersetzen', skip: 'Überspringen', remove: 'Entfernen',
        same: 'Keine Änderungen', date: 'Termin', place: 'Ort', field: 'Teilnehmerzahl', rules: 'Qualifikationsregeln',
        format: 'Spielformat', prize: 'Preisgelder', ranking: 'Rangliste', name: 'Name', eligibility: 'Teilnahmebedingungen',
        calendar: 'Kalender', removed: 'Gelöschtes Turnier', missing: 'Spiel- oder Mod-Turnier fehlt in dieser Karriere',
        locked: 'Laufendes oder abgeschlossenes Turnier — Einstellungen derzeit gesperrt',
        typeMismatch: 'Name gehört zu einem anderen Turniertyp', ambiguous: 'Mehrdeutiger Namenskonflikt',
        alreadyRemoved: 'Bereits nicht im Kalender', summary: 'Neu: {add} · ersetzen: {replace} · entfernen: {remove} · überspringen: {skip}',
        exported: '{count} Turniere exportiert.', imported: '{count} Kalenderänderungen übernommen.',
        noChanges: 'Keine Änderungen ausgewählt.', invalid: 'Ungültiges oder nicht unterstütztes Turnierpaket.',
        tooLarge: 'Datei zu groß. Maximal 2 MB.', saveFailed: 'Änderungen gelten in dieser Sitzung, aber die Karriere konnte nicht gespeichert werden.',
        conflict: 'Auswahl prüfen: {reason}', linkMissing: 'Verknüpfte Qualifikation oder Ziel fehlt: {name}',
        linkInvalid: 'Regeln verknüpfter Turniere stimmen nicht überein: {name}', duplicate: 'Doppelter Name oder Bezeichner: {name}' },
    nl: { title: 'Toernooipakketten', intro: 'Sla kalender en regels op in één JSON-bestand of laad een pakket van een andere speler.',
        export: 'Pakket exporteren', import: 'Pakket laden', preview: 'Importvoorbeeld',
        hint: 'Bekijk de wijzigingen en kies een actie per naam. Gespeelde resultaten worden niet overgenomen. Verwijderingen worden standaard overgeslagen.',
        cancel: 'Annuleren', apply: 'Gekozen wijzigingen toepassen', add: 'Toevoegen', replace: 'Instellingen vervangen', skip: 'Overslaan', remove: 'Verwijderen',
        same: 'Geen wijzigingen', date: 'datum', place: 'locatie', field: 'deelnemersveld', rules: 'kwalificatieregels',
        format: 'wedstrijdformaat', prize: 'prijzengeld', ranking: 'ranking', name: 'naam', eligibility: 'toelating',
        calendar: 'kalender', removed: 'Verwijderd toernooi', missing: 'Ingebouwd of modtoernooi ontbreekt in deze carrière',
        locked: 'Lopend of voltooid toernooi — instellingen kunnen nu niet worden vervangen',
        typeMismatch: 'Deze naam hoort bij een ander type toernooi', ambiguous: 'Onduidelijk naamconflict',
        alreadyRemoved: 'Staat al niet meer in de kalender', summary: 'Toevoegen: {add} · vervangen: {replace} · verwijderen: {remove} · overslaan: {skip}',
        exported: '{count} toernooien geëxporteerd.', imported: '{count} kalenderwijzigingen toegepast.',
        noChanges: 'Geen wijzigingen geselecteerd.', invalid: 'Ongeldig of niet ondersteund toernooipakket.',
        tooLarge: 'Bestand is te groot. Maximaal 2 MB.', saveFailed: 'Wijzigingen gelden in deze sessie, maar de carrière kon niet worden opgeslagen.',
        conflict: 'Controleer de keuzes: {reason}', linkMissing: 'Gekoppelde kwalificatie of doel ontbreekt: {name}',
        linkInvalid: 'Regels van gekoppelde toernooien komen niet overeen: {name}', duplicate: 'Dubbele naam of identificatie: {name}' }
};

function trTournamentPack(key, values = {}) {
    const lang = typeof currentLang === 'string' && TOURNAMENT_PACK_TEXT[currentLang] ? currentLang : 'pl';
    return (TOURNAMENT_PACK_TEXT[lang][key] || TOURNAMENT_PACK_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, field) => String(values[field] ?? ''));
}

function tournamentPackError(key, values) { return new Error(trTournamentPack(key, values)); }
function tournamentPackString(value, max = 120, required = false) {
    if (typeof value !== 'string') throw tournamentPackError('invalid');
    const clean = value.trim();
    if (clean.length > max || (required && !clean) || /[\u0000-\u001f\u007f]/.test(clean)) throw tournamentPackError('invalid');
    return clean;
}
function tournamentPackInteger(value, min, max) {
    if (!Number.isInteger(value) || value < min || value > max) throw tournamentPackError('invalid');
    return value;
}
function tournamentPackDay(month, day) {
    tournamentPackInteger(month, 0, 11);
    tournamentPackInteger(day, 1, 31);
    const date = new Date(2027, month, day);
    if (date.getMonth() !== month || date.getDate() !== day) throw tournamentPackError('invalid');
}
function tournamentPackKey(value) { return String(value || '').trim().toLocaleLowerCase(); }

function normalizeTournamentPackRules(raw, fieldSize) {
    if (raw == null) return null;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.mode !== 'custom'
        || !['main', 'qualifier'].includes(raw.kind) || !['all', 'holders', 'nonholders'].includes(raw.card)
        || !Array.isArray(raw.routes) || !raw.routes.length || raw.routes.length > 40
        || !Array.isArray(raw.countries) || raw.countries.length > 50) throw tournamentPackError('invalid');
    const minAge = tournamentPackInteger(raw.minAge, 0, 100);
    const maxAge = tournamentPackInteger(raw.maxAge, 0, 100);
    if (maxAge && minAge > maxAge) throw tournamentPackError('invalid');
    const countries = raw.countries.map(country => tournamentPackString(country, 80, true));
    const routes = raw.routes.map(rawRoute => {
        if (!rawRoute || typeof rawRoute !== 'object' || Array.isArray(rawRoute)) throw tournamentPackError('invalid');
        const source = rawRoute.source;
        if (![...TOURNAMENT_PACK_RANKINGS, 'qualifier', 'country'].includes(source)) throw tournamentPackError('invalid');
        const route = { source, places: tournamentPackInteger(rawRoute.places, 1, 256) };
        if (source === 'qualifier') route.qualifierKey = tournamentPackString(rawRoute.qualifierKey, 120, true);
        if (source === 'country') {
            route.country = tournamentPackString(rawRoute.country, 80, true);
            if (!TOURNAMENT_PACK_RANKINGS.includes(rawRoute.ranking)) throw tournamentPackError('invalid');
            route.ranking = rawRoute.ranking;
        }
        return route;
    });
    if (routes.reduce((sum, route) => sum + route.places, 0) !== fieldSize) throw tournamentPackError('invalid');
    const rules = { mode: 'custom', kind: raw.kind, card: raw.card, minAge, maxAge, countries, routes };
    if (raw.kind === 'qualifier') {
        rules.targetKey = tournamentPackString(raw.targetKey, 120, true);
        rules.qualifyingPlaces = tournamentPackInteger(raw.qualifyingPlaces, 1, 128);
        if (routes.some(route => route.source === 'qualifier') || ![1, 2, 4, 8, 16, 32, 64, 128].includes(rules.qualifyingPlaces)
            || rules.qualifyingPlaces >= fieldSize) throw tournamentPackError('invalid');
    }
    return rules;
}

function normalizeTournamentPackEvent(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !['custom', 'existing'].includes(raw.kind)) {
        throw tournamentPackError('invalid');
    }
    const key = tournamentPackString(raw.key, 120, true);
    const name = tournamentPackString(raw.name, 120, true);
    const city = tournamentPackString(raw.city, 100, raw.kind === 'custom');
    const country = tournamentPackString(raw.country, 100, raw.kind === 'custom');
    const month = tournamentPackInteger(raw.month, 0, 11), day = tournamentPackInteger(raw.day, 1, 31);
    const endMonth = tournamentPackInteger(raw.endMonth ?? month, 0, 11);
    const endDay = tournamentPackInteger(raw.endDay ?? day, 1, 31);
    tournamentPackDay(month, day); tournamentPackDay(endMonth, endDay);
    const size = raw.editorFieldSize == null ? null : tournamentPackInteger(raw.editorFieldSize, 8, 256);
    if (size !== null && !TOURNAMENT_PACK_FIELD_SIZES.includes(size) || raw.kind === 'custom' && size === null) {
        throw tournamentPackError('invalid');
    }
    let editorMatchFormat = null;
    if (raw.editorMatchFormat != null) {
        const format = raw.editorMatchFormat;
        if (!format || typeof format !== 'object' || Array.isArray(format)) throw tournamentPackError('invalid');
        if (format.type === 'legs') editorMatchFormat = { type: 'legs', legsToWin: tournamentPackInteger(format.legsToWin, 1, 30) };
        else if (format.type === 'sets') editorMatchFormat = { type: 'sets', setsToWin: tournamentPackInteger(format.setsToWin, 1, 15),
            legsPerSet: tournamentPackInteger(format.legsPerSet, 1, 7) };
        else throw tournamentPackError('invalid');
    }
    let editorPrizes = null;
    if (raw.editorPrizes != null) {
        if (typeof raw.editorPrizes !== 'object' || Array.isArray(raw.editorPrizes)) throw tournamentPackError('invalid');
        editorPrizes = {};
        for (const round of TOURNAMENT_EDITOR_PRIZE_ROUNDS) {
            if (Object.hasOwn(raw.editorPrizes, round)) editorPrizes[round] = tournamentPackInteger(raw.editorPrizes[round], 0, 999999999);
        }
    }
    const rankingOverride = raw.rankingOverride == null ? null : raw.rankingOverride;
    if (rankingOverride !== null && typeof rankingOverride !== 'boolean') throw tournamentPackError('invalid');
    const editorCycle = raw.editorCycle == null ? null : raw.editorCycle;
    if (editorCycle !== null && !TOURNAMENT_PACK_CYCLES.includes(editorCycle)) throw tournamentPackError('invalid');
    const editorTourName = editorCycle === 'custom'
        ? tournamentPackString(raw.editorTourName, 80, true) : null;
    if (editorCycle !== 'custom' && raw.editorTourName != null) throw tournamentPackError('invalid');
    if (!['DIDO', 'legs'].includes(raw.format)) throw tournamentPackError('invalid');
    const editorQualification = normalizeTournamentPackRules(raw.editorQualification, size);
    if (editorQualification && size === null) throw tournamentPackError('invalid');
    const editorTeamMode = raw.editorTeamMode == null ? null : raw.editorTeamMode;
    if (editorTeamMode !== null && (raw.kind !== 'custom' || !['national', 'pairs'].includes(editorTeamMode)
        || editorQualification)) throw tournamentPackError('invalid');
    let editorTeamEntries = null;
    if (editorTeamMode) {
        if (!Array.isArray(raw.editorTeamEntries) || raw.editorTeamEntries.length > size) throw tournamentPackError('invalid');
        editorTeamEntries = raw.editorTeamEntries.map(entry => {
            if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw tournamentPackError('invalid');
            if (editorTeamMode === 'national') return { country: tournamentPackString(entry.country, 80, true) };
            if (!Array.isArray(entry.players) || entry.players.length !== 2) throw tournamentPackError('invalid');
            return { name: tournamentPackString(entry.name || '', 80), players: entry.players.map(reference => ({
                id: reference.id == null ? null : tournamentPackString(String(reference.id), 120),
                name: tournamentPackString(reference.name, 120, true),
                country: tournamentPackString(reference.country, 80, true)
            })) };
        });
        if (editorTeamMode === 'national' && editorTeamEntries.length === 1
            || editorTeamMode === 'pairs' && editorTeamEntries.length < 2) throw tournamentPackError('invalid');
        if (editorTeamMode === 'national' && new Set(editorTeamEntries.map(entry => entry.country)).size !== editorTeamEntries.length
            || editorTeamMode === 'pairs' && new Set(editorTeamEntries.flatMap(entry => entry.players.map(reference =>
                `${reference.name}|${reference.country}`))).size !== editorTeamEntries.length * 2) throw tournamentPackError('invalid');
    } else if (raw.editorTeamEntries != null) throw tournamentPackError('invalid');
    if (raw.kind === 'custom' && endMonth < month || raw.kind === 'custom' && endMonth === month && endDay < day) {
        throw tournamentPackError('invalid');
    }
    return { key, kind: raw.kind, name, month, day, endMonth, endDay, city, country,
        minOvr: tournamentPackInteger(raw.minOvr ?? 0, 0, 100), editorFieldSize: size,
        format: raw.format, editorMatchFormat, rankingOverride, editorPrizes, editorQualification,
        editorCycle, editorTourName, editorTeamMode, editorTeamEntries,
        qualifierFor: raw.qualifierFor == null ? null : tournamentPackString(raw.qualifierFor, 120, true) };
}

function parseTournamentPack(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.format !== TOURNAMENT_PACK_FORMAT
        || ![1, 2, TOURNAMENT_PACK_VERSION].includes(value.version) || !Array.isArray(value.events)
        || value.events.length > TOURNAMENT_PACK_MAX_EVENTS || !Array.isArray(value.deletedKeys)
        || value.deletedKeys.length > TOURNAMENT_PACK_MAX_EVENTS) throw tournamentPackError('invalid');
    const events = value.events.map(normalizeTournamentPackEvent);
    const deletedKeys = value.deletedKeys.map(key => tournamentPackString(key, 120, true));
    const keys = new Set(), names = new Set();
    for (const event of events) {
        const key = tournamentPackKey(event.key), name = tournamentPackKey(event.name);
        if (keys.has(key) || names.has(name)) throw tournamentPackError('duplicate', { name: event.name });
        keys.add(key); names.add(name);
    }
    const deleted = new Set();
    for (const key of deletedKeys) {
        const normalized = tournamentPackKey(key);
        if (keys.has(normalized) || deleted.has(normalized)) throw tournamentPackError('duplicate', { name: key });
        deleted.add(normalized);
    }
    return { format: TOURNAMENT_PACK_FORMAT, version: TOURNAMENT_PACK_VERSION, events, deletedKeys };
}

function createTournamentPackEvent(tournament) {
    const event = { key: tournamentEditorKey(tournament), kind: tournament.isEditorTournament ? 'custom' : 'existing',
        name: tournament.name, month: tournament.month, day: tournament.day,
        endMonth: tournament.endMonth ?? tournament.month, endDay: tournament.endDay ?? tournament.day,
        city: tournament.city || '', country: tournament.country || '', minOvr: Number(tournament.minOvr) || 0,
        editorFieldSize: tournament.editorFieldSize ?? (tournament.isEditorTournament ? 32 : null),
        format: tournament.format === 'DIDO' ? 'DIDO' : 'legs', editorMatchFormat: tournament.editorMatchFormat || null,
        rankingOverride: typeof tournament.rankingOverride === 'boolean' ? tournament.rankingOverride : null,
        editorCycle: tournament.editorCycle || null,
        editorTourName: tournament.editorTourName || null,
        editorTeamMode: tournament.editorTeamMode || null,
        editorTeamEntries: tournament.editorTeamEntries || null,
        editorPrizes: tournament.editorPrizes || null, editorQualification: tournament.editorQualification || null,
        qualifierFor: tournament.qualifierFor || null };
    return normalizeTournamentPackEvent(event);
}
function createTournamentPack() {
    if (typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) throw tournamentPackError('invalid');
    return parseTournamentPack({ format: TOURNAMENT_PACK_FORMAT, version: TOURNAMENT_PACK_VERSION,
        events: tournamentDatabase.map(createTournamentPackEvent),
        deletedKeys: Array.isArray(player?.tournamentEditorDeletedKeys) ? player.tournamentEditorDeletedKeys : [] });
}

function tournamentPackDate(event) {
    const day = (month, date) => `${String(date).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}`;
    const start = day(event.month, event.day);
    const end = day(event.endMonth, event.endDay);
    return start === end ? start : `${start}–${end}`;
}
function tournamentPackPlace(event) { return [event.city, event.country].filter(Boolean).join(', ') || '—'; }
function tournamentPackRules(event) {
    const rules = event.editorQualification;
    if (!rules) return '—';
    const routes = rules.routes.map(route => `${route.places}× ${route.source === 'qualifier' ? route.qualifierKey
        : route.source === 'country' ? `${route.country} (${route.ranking})` : route.source}`).join(', ');
    const criteria = [rules.card, `${rules.minAge}–${rules.maxAge || '∞'}`,
        rules.countries.length ? rules.countries.join(', ') : 'all countries'].join('; ');
    return `${rules.kind === 'qualifier' ? `${routes} → ${rules.qualifyingPlaces}× ${rules.targetKey}` : routes} [${criteria}]`;
}
function tournamentPackMatchFormat(event) {
    const match = event.editorMatchFormat;
    if (!match) return event.format;
    return `${event.format}, ${match.type === 'sets' ? `${match.setsToWin} sets × ${match.legsPerSet} legs`
        : `${match.legsToWin} legs`}`;
}
function getTournamentPackChanges(target, event) {
    if (!target) return [tournamentPackDate(event), tournamentPackPlace(event),
        event.editorFieldSize ? `${trTournamentPack('field')}: ${event.editorFieldSize}` : '',
        event.editorCycle ? `${trTournamentPack('calendar')}: ${[event.editorCycle, event.editorTourName].filter(Boolean).join(' / ')}` : '',
        event.editorQualification ? `${trTournamentPack('rules')}: ${tournamentPackRules(event)}` : ''].filter(Boolean);
    const old = createTournamentPackEvent(target);
    const groups = [
        ['name', old.name, event.name],
        ['date', tournamentPackDate(old), tournamentPackDate(event)],
        ['place', tournamentPackPlace(old), tournamentPackPlace(event)],
        ['eligibility', old.minOvr, event.minOvr],
        ['field', old.editorFieldSize ?? '—', event.editorFieldSize ?? '—'],
        ['format', tournamentPackMatchFormat(old), tournamentPackMatchFormat(event)],
        ['ranking', old.rankingOverride ?? '—', event.rankingOverride ?? '—'],
        ['calendar', [old.editorCycle, old.editorTourName].filter(Boolean).join(' / ') || '—',
            [event.editorCycle, event.editorTourName].filter(Boolean).join(' / ') || '—'],
        ['field', JSON.stringify([old.editorTeamMode, old.editorTeamEntries]),
            JSON.stringify([event.editorTeamMode, event.editorTeamEntries])],
        ['prize', JSON.stringify(old.editorPrizes || {}), JSON.stringify(event.editorPrizes || {})],
        ['rules', `${tournamentPackRules(old)}${old.qualifierFor ? ` → ${old.qualifierFor}` : ''}`,
            `${tournamentPackRules(event)}${event.qualifierFor ? ` → ${event.qualifierFor}` : ''}`]
    ];
    return groups.filter(([, before, after]) => before !== after)
        .map(([key, before, after]) => `${trTournamentPack(key)}: ${before} → ${after}`);
}

function findTournamentPackTarget(key, name, database) {
    const byKey = database.filter(tournament => tournamentPackKey(tournamentEditorKey(tournament)) === tournamentPackKey(key));
    const byName = database.filter(tournament => tournamentPackKey(tournament.name) === tournamentPackKey(name));
    const matches = [...new Set([...byKey, ...byName])];
    return { target: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1 };
}

function planTournamentPackImport(pack, choices = {}, database = tournamentDatabase) {
    const entries = pack.events.map(event => {
        const { target, ambiguous } = findTournamentPackTarget(event.key, event.name, database);
        const changes = !ambiguous && (target || event.kind === 'custom') ? getTournamentPackChanges(target, event) : [];
        const hostQualifierLocked = target && target.country !== event.country
            && typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(target)
            && database.some(candidate => candidate.specialType === 'continentalQualifier'
                && candidate.qualifierPath === 'host'
                && [target.name, target.sourceName].filter(Boolean).includes(candidate.qualifierFor)
                && (candidate.completed || isTournamentEditorActive(candidate)));
        const reason = ambiguous ? 'ambiguous' : target && Boolean(target.isEditorTournament) !== (event.kind === 'custom')
            ? 'typeMismatch' : target && (target.completed || isTournamentEditorActive(target) || hostQualifierLocked) ? 'locked'
                : !target && event.kind === 'existing' ? 'missing' : null;
        const available = reason ? ['skip'] : target ? ['skip', 'replace'] : ['skip', 'add'];
        const fallback = reason || target && !changes.length ? 'skip' : target ? 'replace' : 'add';
        const action = available.includes(choices[`event:${event.key}`]) ? choices[`event:${event.key}`] : fallback;
        return { event, target, changes, reason, available, action, choiceKey: `event:${event.key}` };
    });
    const removals = pack.deletedKeys.map(key => {
        const { target, ambiguous } = findTournamentPackTarget(key, key, database);
        const reason = ambiguous ? 'ambiguous' : !target ? 'alreadyRemoved'
            : target.completed || isTournamentEditorActive(target) ? 'locked' : null;
        const available = reason ? ['skip'] : ['skip', 'remove'];
        const action = available.includes(choices[`delete:${key}`]) ? choices[`delete:${key}`] : 'skip';
        return { key, target, reason, available, action, choiceKey: `delete:${key}` };
    });
    return { entries, removals };
}

function setTournamentPackConfiguration(tournament, event) {
    if (!tournament.sourceName) tournament.sourceName = tournament.name || event.key;
    tournament.name = event.name;
    tournament.month = event.month; tournament.day = event.day;
    tournament.city = event.city; tournament.country = event.country;
    tournament.minOvr = event.minOvr; tournament.format = event.format;
    tournament.editorModified = true;
    for (const field of ['endMonth', 'endDay', 'editorFieldSize', 'editorMatchFormat',
        'rankingOverride', 'editorPrizes', 'editorQualification', 'qualifierFor', 'editorCycle', 'editorTourName',
        'editorTeamMode', 'editorTeamEntries']) {
        const value = event[field];
        if (value == null || field === 'endMonth' && value === event.month
            || field === 'endDay' && value === event.day && event.endMonth === event.month) delete tournament[field];
        else tournament[field] = value && typeof value === 'object' ? structuredClone(value) : value;
    }
    if (tournament.isEditorTournament === true) {
        if (event.editorTeamMode) tournament.isDoubles = true;
        else delete tournament.isDoubles;
    }
}

function validateTournamentPackLinks(events, touchedKeys) {
    const byKey = new Map(events.map(event => [tournamentPackKey(tournamentEditorKey(event)), event]));
    for (const event of events) {
        const rules = event.editorQualification;
        if (rules?.mode !== 'custom') continue;
        const key = tournamentPackKey(tournamentEditorKey(event));
        const relevant = touchedKeys.has(key) || rules.kind === 'qualifier' && touchedKeys.has(tournamentPackKey(rules.targetKey))
            || rules.routes?.some(route => route.source === 'qualifier' && touchedKeys.has(tournamentPackKey(route.qualifierKey)));
        if (!relevant) continue;
        if (rules.kind === 'main') {
            for (const route of rules.routes.filter(route => route.source === 'qualifier')) {
                const qualifier = byKey.get(tournamentPackKey(route.qualifierKey));
                if (!qualifier) throw tournamentPackError('linkMissing', { name: route.qualifierKey });
                if (qualifier.editorQualification?.kind !== 'qualifier'
                    || tournamentPackKey(qualifier.editorQualification.targetKey) !== key
                    || qualifier.editorQualification.qualifyingPlaces !== route.places) {
                    throw tournamentPackError('linkInvalid', { name: event.name });
                }
            }
        } else if (rules.kind === 'qualifier') {
            const main = byKey.get(tournamentPackKey(rules.targetKey));
            if (!main) throw tournamentPackError('linkMissing', { name: rules.targetKey });
            const mainRules = main.editorQualification;
            if (mainRules?.mode === 'custom' && mainRules.kind === 'main') {
                const matchingRoutes = mainRules.routes.filter(route => route.source === 'qualifier'
                    && tournamentPackKey(route.qualifierKey) === key && route.places === rules.qualifyingPlaces);
                if (matchingRoutes.length !== 1) throw tournamentPackError('linkInvalid', { name: event.name });
            } else if (typeof isTournamentEditorNativeTarget !== 'function' || !isTournamentEditorNativeTarget(main)) {
                throw tournamentPackError('linkInvalid', { name: event.name });
            }
            const qualifierEnd = new Date(2027, event.endMonth ?? event.month, event.endDay ?? event.day);
            const mainStart = new Date(2027, main.month, main.day);
            if (qualifierEnd >= mainStart) throw tournamentPackError('linkInvalid', { name: event.name });
            if (mainRules?.mode !== 'custom') {
                const nativePlaces = events.filter(candidate => candidate.editorQualification?.kind === 'qualifier'
                    && tournamentPackKey(candidate.editorQualification.targetKey) === tournamentPackKey(rules.targetKey))
                    .reduce((total, candidate) => total + candidate.editorQualification.qualifyingPlaces, 0);
                const capacity = getTournamentEditorNativeQualifierCapacity(main);
                if (capacity !== null && nativePlaces > capacity)
                    throw tournamentPackError('linkInvalid', { name: main.name });
            }
        }
    }
}

function projectTournamentPackImport(plan, database = tournamentDatabase,
    oldDeletedKeys = Array.isArray(player?.tournamentEditorDeletedKeys) ? player.tournamentEditorDeletedKeys : []) {
    const originalCopies = new Map(database.map(event => [event, { ...event }]));
    const final = database.map(event => originalCopies.get(event));
    const originalForCopy = new Map(database.map(event => [originalCopies.get(event), event]));
    const importedTargets = new Map();
    const touchedKeys = new Set();
    const renamed = [];
    const deletedKeys = new Map(oldDeletedKeys.map(key => [tournamentPackKey(key), key]));
    let count = 0, firstSelected = null;
    for (const row of plan.entries) {
        if (row.action === 'skip') {
            if (row.target) importedTargets.set(tournamentPackKey(row.event.key), originalCopies.get(row.target));
            continue;
        }
        if (!row.available.includes(row.action) || row.reason) throw tournamentPackError('conflict', { reason: row.event.name });
        const target = row.action === 'replace' ? originalCopies.get(row.target) : {
            completed: false, historyLogs: '', isEditorTournament: true, isCustomTournament: true,
            sourceName: row.event.key
        };
        if (!target) throw tournamentPackError('conflict', { reason: row.event.name });
        const previousName = target.name;
        setTournamentPackConfiguration(target, row.event);
        if (row.action === 'add') final.push(target);
        else if (previousName !== target.name) renamed.push({ previousName, nextName: target.name });
        importedTargets.set(tournamentPackKey(row.event.key), target);
        touchedKeys.add(tournamentPackKey(tournamentEditorKey(target)));
        touchedKeys.add(tournamentPackKey(row.event.key));
        deletedKeys.delete(tournamentPackKey(row.event.key));
        if (!firstSelected) firstSelected = target;
        count++;
    }
    for (const row of plan.removals) {
        if (row.action === 'skip') continue;
        if (row.action !== 'remove' || !row.available.includes('remove') || !row.target) {
            throw tournamentPackError('conflict', { reason: row.key });
        }
        const target = originalCopies.get(row.target);
        const index = final.indexOf(target);
        if (index < 0) throw tournamentPackError('conflict', { reason: row.key });
        final.splice(index, 1);
        touchedKeys.add(tournamentPackKey(tournamentEditorKey(target)));
        deletedKeys.set(tournamentPackKey(tournamentEditorKey(target)), tournamentEditorKey(target));
        count++;
    }
    const lookup = value => importedTargets.get(tournamentPackKey(value));
    for (const row of plan.entries) {
        if (row.action === 'skip') continue;
        const target = lookup(row.event.key);
        const rules = target.editorQualification;
        if (rules?.kind === 'qualifier') {
            const main = lookup(rules.targetKey);
            if (main) { rules.targetKey = tournamentEditorKey(main); target.qualifierFor = main.name; }
        }
        if (rules?.kind === 'main') for (const route of rules.routes) {
            if (route.source !== 'qualifier') continue;
            const qualifier = lookup(route.qualifierKey);
            if (qualifier) route.qualifierKey = tournamentEditorKey(qualifier);
        }
        if (target.qualifierFor) {
            const main = plan.entries.find(entry => entry.event.name === target.qualifierFor
                || entry.event.key === target.qualifierFor);
            if (main && lookup(main.event.key)) target.qualifierFor = lookup(main.event.key).name;
        }
    }
    for (const { previousName, nextName } of renamed) for (const event of final) {
        if (event.qualifierFor === previousName) event.qualifierFor = nextName;
    }
    for (const row of plan.entries) {
        if (row.action !== 'replace' || row.target.country === row.event.country
            || typeof isContinentalTourTournament !== 'function' || !isContinentalTourTournament(row.target)) continue;
        const main = originalCopies.get(row.target);
        const qualification = row.target.continentalQualification;
        if (qualification?.paths?.host) {
            main.continentalQualification = structuredClone(qualification);
            const host = main.continentalQualification.paths.host;
            host.participantIds = []; host.qualifiedPlayerIds = [];
            host.initialized = false; host.completed = false;
            delete host.editorNativeOriginalQualifiedPlayerIds;
        }
        for (const candidate of final) {
            if (candidate.specialType !== 'continentalQualifier' || candidate.qualifierPath !== 'host'
                || ![row.target.name, row.target.sourceName, main.name].filter(Boolean).includes(candidate.qualifierFor)) continue;
            candidate.country = main.country;
            if (candidate.city === row.target.city) candidate.city = main.city;
        }
    }
    const seenNames = new Set(), seenKeys = new Set();
    for (const event of final) {
        const name = tournamentPackKey(event.name), key = tournamentPackKey(tournamentEditorKey(event));
        if (seenNames.has(name) || seenKeys.has(key)) throw tournamentPackError('duplicate', { name: event.name });
        seenNames.add(name); seenKeys.add(key);
    }
    validateTournamentPackLinks(final, touchedKeys);
    return { final, originalForCopy, deletedKeys: [...deletedKeys.values()], count, firstSelected };
}

let stagedTournamentPack = null;
let tournamentPackChoices = {};
let tournamentPackFileGeneration = 0;

function setTournamentPackStatus(message, error = false) {
    const element = document.getElementById('tournament-pack-status');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', error);
}
function refreshTournamentPackTranslations() {
    if (typeof document === 'undefined' || !document.getElementById('tournament-pack-heading')) return;
    const ids = { 'tournament-pack-heading': 'title', 'tournament-pack-intro': 'intro',
        'tournament-pack-export': 'export', 'tournament-pack-import': 'import',
        'tournament-pack-preview-title': 'preview', 'tournament-pack-hint': 'hint',
        'tournament-pack-cancel': 'cancel', 'tournament-pack-apply': 'apply' };
    Object.entries(ids).forEach(([id, key]) => { document.getElementById(id).textContent = trTournamentPack(key); });
    if (stagedTournamentPack) renderTournamentPackPreview();
}
function exportTournamentPack() {
    try {
        const pack = createTournamentPack();
        const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
        if (blob.size > TOURNAMENT_PACK_MAX_BYTES) throw tournamentPackError('tooLarge');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'darts-career-tournament-pack.json';
        document.body.appendChild(link);
        link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
        setTournamentPackStatus(trTournamentPack('exported', { count: pack.events.length }));
        return true;
    } catch (error) {
        setTournamentPackStatus(error.message || trTournamentPack('invalid'), true);
        return false;
    }
}
function openTournamentPackPicker() {
    const input = document.getElementById('tournament-pack-file');
    input.value = '';
    input.click();
}
function stageTournamentPackText(text) {
    try {
        if (typeof text !== 'string' || text.length > TOURNAMENT_PACK_MAX_BYTES) throw tournamentPackError('tooLarge');
        stagedTournamentPack = parseTournamentPack(JSON.parse(text.replace(/^\uFEFF/, '')));
        tournamentPackChoices = {};
        renderTournamentPackPreview();
        setTournamentPackStatus('');
        return true;
    } catch (error) {
        stagedTournamentPack = null;
        document.getElementById('tournament-pack-preview').hidden = true;
        setTournamentPackStatus(error instanceof SyntaxError ? trTournamentPack('invalid') : error.message || trTournamentPack('invalid'), true);
        return false;
    }
}
async function stageTournamentPackFile(event) {
    const file = event?.target?.files?.[0];
    if (!file) return false;
    const generation = ++tournamentPackFileGeneration;
    stagedTournamentPack = null;
    tournamentPackChoices = {};
    document.getElementById('tournament-pack-preview').hidden = true;
    if (file.size > TOURNAMENT_PACK_MAX_BYTES) {
        setTournamentPackStatus(trTournamentPack('tooLarge'), true); return false;
    }
    try {
        const text = await file.text();
        return generation === tournamentPackFileGeneration && stageTournamentPackText(text);
    } catch (_) {
        setTournamentPackStatus(trTournamentPack('invalid'), true); return false;
    }
}
function cancelTournamentPackImport() {
    tournamentPackFileGeneration++;
    stagedTournamentPack = null;
    tournamentPackChoices = {};
    document.getElementById('tournament-pack-preview').hidden = true;
    setTournamentPackStatus('');
}
function chooseTournamentPackAction(key, action) {
    tournamentPackChoices[key] = action;
    renderTournamentPackPreview();
}
function renderTournamentPackPreview() {
    if (!stagedTournamentPack || typeof document === 'undefined') return;
    const plan = planTournamentPackImport(stagedTournamentPack, tournamentPackChoices);
    const list = document.getElementById('tournament-pack-list');
    list.replaceChildren();
    const counts = { add: 0, replace: 0, remove: 0, skip: 0 };
    const appendRow = (name, details, row) => {
        counts[row.action]++;
        const item = document.createElement('div'); item.className = 'tournament-pack-row';
        if (row.reason) item.classList.add('locked');
        const description = document.createElement('div');
        const title = document.createElement('strong'); title.textContent = name;
        const subtitle = document.createElement('small'); subtitle.textContent = row.reason
            ? trTournamentPack(row.reason) : details;
        description.append(title, subtitle);
        const select = document.createElement('select');
        select.setAttribute('aria-label', name);
        for (const action of row.available) {
            const option = document.createElement('option');
            option.value = action; option.textContent = trTournamentPack(action);
            select.appendChild(option);
        }
        select.value = row.action;
        select.disabled = row.available.length === 1;
        select.addEventListener('change', () => chooseTournamentPackAction(row.choiceKey, select.value));
        item.append(description, select);
        list.appendChild(item);
    };
    plan.entries.forEach(row => {
        if (row.action === 'skip' && row.target && !row.reason && !row.changes.length) {
            counts.skip++; return;
        }
        appendRow(row.event.name, row.changes.length ? row.changes.join(' · ') : trTournamentPack('same'), row);
    });
    plan.removals.forEach(row => appendRow(row.target?.name || row.key, trTournamentPack('removed'), row));
    document.getElementById('tournament-pack-summary').textContent = trTournamentPack('summary', counts);
    const validation = document.getElementById('tournament-pack-validation');
    validation.textContent = '';
    let valid = true;
    if (counts.add + counts.replace + counts.remove > 0) {
        try { projectTournamentPackImport(plan); }
        catch (error) { valid = false; validation.textContent = error.message || trTournamentPack('invalid'); }
    }
    document.getElementById('tournament-pack-apply').disabled = !valid || counts.add + counts.replace + counts.remove === 0;
    document.getElementById('tournament-pack-preview').hidden = false;
}
async function applyStagedTournamentPack() {
    if (!stagedTournamentPack) return false;
    try {
        const plan = planTournamentPackImport(stagedTournamentPack, tournamentPackChoices);
        const projection = projectTournamentPackImport(plan);
        if (!projection.count) { setTournamentPackStatus(trTournamentPack('noChanges')); return false; }
        const changedContinentalHosts = plan.entries.filter(row => row.action === 'replace'
            && row.target.country !== row.event.country && typeof isContinentalTourTournament === 'function'
            && isContinentalTourTournament(row.target)).map(row => row.target);
        const final = projection.final.map(copy => {
            const original = projection.originalForCopy.get(copy);
            if (!original) return copy;
            for (const field of ['endMonth', 'endDay', 'editorFieldSize', 'editorMatchFormat',
                'rankingOverride', 'editorPrizes', 'editorQualification', 'qualifierFor', 'editorCycle', 'editorTourName',
                'editorTeamMode', 'editorTeamEntries']) {
                if (!Object.hasOwn(copy, field)) delete original[field];
            }
            Object.assign(original, copy);
            return original;
        });
        tournamentDatabase.splice(0, tournamentDatabase.length, ...final);
        if (typeof refreshContinentalQualificationAggregate === 'function') for (const main of changedContinentalHosts) {
            if (main.continentalQualification?.paths?.host) refreshContinentalQualificationAggregate(main.continentalQualification);
        }
        if (typeof player !== 'undefined' && player) player.tournamentEditorDeletedKeys = projection.deletedKeys;
        const selected = projection.firstSelected && (projection.originalForCopy.get(projection.firstSelected) || projection.firstSelected);
        if (selected) populateTournamentEditorForm(selected);
        else if (tournamentEditorSelected && tournamentDatabase.includes(tournamentEditorSelected)) renderTournamentEditorList();
        else if (tournamentDatabase.length) populateTournamentEditorForm(tournamentDatabase[0]);
        else startAddingTournament();
        cancelTournamentPackImport();
        let saved = true;
        try { saved = typeof saveGame !== 'function' || await saveGame(true, { immediate: true }); }
        catch (_) { saved = false; }
        setTournamentPackStatus(saved === false ? trTournamentPack('saveFailed')
            : trTournamentPack('imported', { count: projection.count }), saved === false);
        return true;
    } catch (error) {
        setTournamentPackStatus(trTournamentPack('conflict', { reason: error.message || trTournamentPack('invalid') }), true);
        return false;
    }
}
