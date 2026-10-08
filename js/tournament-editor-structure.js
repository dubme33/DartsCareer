// Configuration helpers shared by the editor, draw, groups and portable packs.
const EDITOR_STRUCTURE_TEXT = {
    title: ['Zaproszenia, drabinka, grupy i ligi', 'Invitations, draw, groups and leagues', 'Einladungen, Auslosung, Gruppen und Ligen', 'Uitnodigingen, schema, groepen en competities'],
    invites: ['Zaproszeni zawodnicy', 'Invited players', 'Eingeladene Spieler', 'Uitgenodigde spelers'],
    add: ['Zaproszeni + pozostali z kwalifikacji', 'Invitations + qualified entrants', 'Einladungen + qualifizierte Spieler', 'Uitnodigingen + gekwalificeerde spelers'],
    only: ['Tylko zaproszeni', 'Invited players only', 'Nur eingeladene Spieler', 'Alleen uitgenodigde spelers'],
    search: ['Szukaj zawodnika…', 'Search players…', 'Spieler suchen…', 'Spelers zoeken…'],
    selected: ['Wybrano: {count}', 'Selected: {count}', 'Ausgewählt: {count}', 'Geselecteerd: {count}'],
    phase: ['Przebieg turnieju', 'Tournament stages', 'Turnierphasen', 'Toernooifasen'],
    knockout: ['Faza pucharowa', 'Knockout', 'K.-o.-Phase', 'Knock-out'],
    groups: ['Grupy, potem faza pucharowa', 'Groups, then knockout', 'Gruppen, danach K.-o.', 'Groepen, daarna knock-out'],
    count: ['Liczba grup', 'Number of groups', 'Anzahl der Gruppen', 'Aantal groepen'],
    advance: ['Awansujących z każdej grupy', 'Qualifiers per group', 'Qualifizierte je Gruppe', 'Door per groep'],
    extra: ['Dodatkowy awans z kolejnej pozycji', 'Extra qualifiers from the next position', 'Weitere Qualifizierte vom nächsten Platz', 'Extra door van de volgende plaats'],
    groupLegs: ['Legi do wygrania w grupach', 'Legs to win in groups', 'Legs zum Sieg in Gruppen', 'Legs om te winnen in groepen'],
    points: ['Punkty za zwycięstwo', 'Points for a win', 'Punkte für einen Sieg', 'Punten voor winst'],
    tie: ['Przy równej liczbie punktów', 'When points are tied', 'Bei Punktgleichheit', 'Bij gelijke punten'],
    difference: ['Bilans legów, wygrane legi, rozstawienie', 'Leg difference, legs won, seeding', 'Legdifferenz, gewonnene Legs, Setzung', 'Legsaldo, gewonnen legs, plaatsing'],
    head: ['Bezpośrednie mecze, bilans legów, rozstawienie', 'Head-to-head, leg difference, seeding', 'Direkter Vergleich, Legdifferenz, Setzung', 'Onderling resultaat, legsaldo, plaatsing'],
    assign: ['Przydział do grup', 'Group assignments', 'Gruppenzuordnung', 'Groepsindeling'],
    draw: ['Drabinka fazy pucharowej', 'Knockout draw', 'K.-o.-Auslosung', 'Knock-outschema'],
    random: ['Automatyczna', 'Automatic', 'Automatisch', 'Automatisch'],
    manual: ['Ręcznie ustawione pozycje', 'Manually assigned slots', 'Manuell zugewiesene Plätze', 'Handmatig toegewezen plaatsen'],
    slot: ['Mecz {match} · pozycja {side}', 'Match {match} · slot {side}', 'Match {match} · Platz {side}', 'Wedstrijd {match} · plaats {side}'],
    auto: ['Automatycznie', 'Automatic', 'Automatisch', 'Automatisch'],
    bye: ['Wolny los', 'Bye', 'Freilos', 'Bye'],
    group: ['Grupa', 'Group', 'Gruppe', 'Groep'],
    play: ['Rozegraj mecz', 'Play match', 'Match spielen', 'Speel wedstrijd'],
    groupRound: ['Symuluj kolejkę grupową', 'Simulate group round', 'Gruppenrunde simulieren', 'Groepsronde simuleren'],
    rules: ['{groups} grup · awans: {advance} z każdej + {extra} najlepszych z kolejnej pozycji. Każdy gra z każdym. Dodatkowy awans: punkty, bilans legów, wygrane legi, rozstawienie.', '{groups} groups · advance: {advance} per group + {extra} best from the next position. Round robin. Extra places: points, leg difference, legs won, seeding.', '{groups} Gruppen · Weiter: {advance} je Gruppe + {extra} Beste vom nächsten Platz. Jeder gegen jeden. Weitere Plätze: Punkte, Legdifferenz, gewonnene Legs, Setzung.', '{groups} groepen · door: {advance} per groep + {extra} besten van de volgende plaats. Iedereen tegen iedereen. Extra plaatsen: punten, legsaldo, gewonnen legs, plaatsing.'],
    hint: ['Zaproszeni zajmują miejsca przed pozostałymi uczestnikami. Warunki płci, karty, wieku, overallu i dostępności nadal obowiązują. Własna drabinka lub grupy zastępują wbudowane zasady turnieju. Sąsiednie pozycje drabinki tworzą parę; zwycięzcy sąsiednich par spotkają się w kolejnej rundzie.', 'Invitations take priority over other entrants. Gender, card, age, overall and availability rules still apply. A custom draw or groups replaces built-in event rules. Adjacent slots play each other; adjacent match winners meet in the next round.', 'Einladungen haben Vorrang. Geschlecht, Karte, Alter, Overall und Verfügbarkeit gelten weiterhin. Eigene Auslosungen oder Gruppen ersetzen integrierte Regeln. Benachbarte Plätze spielen gegeneinander; deren Sieger treffen in der nächsten Runde aufeinander.', 'Uitnodigingen krijgen voorrang. Geslacht, kaart, leeftijd, overall en beschikbaarheid blijven gelden. Eigen schema’s of groepen vervangen ingebouwde regels. Aangrenzende plaatsen spelen tegen elkaar; winnaars van aangrenzende wedstrijden treffen elkaar daarna.'],
    invalid: ['Sprawdź zaproszenia, pozycje drabinki i grupy. Zawodnik może zajmować tylko jedno miejsce. Grupy muszą mieć od 2 do 8 miejsc, a awans musi prowadzić do co najmniej dwóch uczestników.', 'Check invitations, draw slots and groups. An entrant can occupy only one slot. Groups need 2–8 slots and at least two entrants must advance.', 'Einladungen, Plätze und Gruppen prüfen. Ein Teilnehmer darf nur einen Platz belegen. Gruppen benötigen 2–8 Plätze und mindestens zwei Teilnehmer müssen weiterkommen.', 'Controleer uitnodigingen, plaatsen en groepen. Een deelnemer mag maar één plaats hebben. Groepen hebben 2–8 plaatsen nodig en minstens twee deelnemers moeten doorgaan.'],
    unavailable: ['Te opcje są dostępne dla turniejów indywidualnych i własnych turniejów drużynowych. Aby stworzyć własny format World Cup, dodaj turniej reprezentacji lub par.', 'These options support singles and custom team events. Create a national-team or pairs event for a custom World Cup format.', 'Diese Optionen gelten für Einzel und eigene Teamturniere. Erstelle für ein eigenes World-Cup-Format ein Nationalteam- oder Doppelturnier.', 'Deze opties ondersteunen individuele en eigen teamtoernooien. Maak een landen- of koppeltoernooi voor een eigen World Cup-formaat.'],
    eliminated: ['Nagroda za odpadnięcie w grupie (£)', 'Prize for group elimination (£)', 'Preisgeld bei Gruppenaus (£)', 'Prijs bij uitschakeling in groep (£)']
};
function trEditorStructure(key, params = {}) {
    const index = Math.max(0, ['pl', 'en', 'de', 'nl'].indexOf(typeof currentLang === 'string' ? currentLang : 'pl'));
    return (EDITOR_STRUCTURE_TEXT[key]?.[index] || key).replace(/\{(\w+)\}/g, (_, field) => String(params[field] ?? ''));
}
function editorStructureGroupLabel(index) {
    return index < 26 ? String.fromCharCode(65 + index) : `G${index + 1}`;
}
function isEditorGroupTournament(event) { return Boolean(event?.editorStructure?.groups); }
function isEditorSeasonLeague(event) { return Boolean(event?.editorStructure?.league); }
function normalizeEditorSeasonLeague(raw, size) {
    if (raw == null) return null;
    const fail = () => { throw new Error(trEditorStructure('leagueInvalid')); };
    const integer = (value, min, max) => { if (!Number.isInteger(value) || value < min || value > max) fail(); return value; };
    if (!raw || ![8, 16, 32].includes(size) || !['difference', 'head'].includes(raw.tie)
        || ![0, 2, 4, 8, 16, 32].includes(raw.playoffs) || raw.playoffs > size) fail();
    return { cycles: integer(raw.cycles, 1, 2), playoffs: raw.playoffs, legsToWin: integer(raw.legsToWin, 1, 30),
        winPoints: integer(raw.winPoints, 1, 10), tie: raw.tie };
}
function editorStructureKey(entrant) {
    if (entrant?.players?.length === 1) return getTournamentEditorPlayerKey(entrant.players[0]);
    if (entrant?.players) return `team:${entrant.players.map(getTournamentEditorPlayerKey).sort().join('|')}`;
    return getTournamentEditorPlayerKey(entrant);
}
function normalizeEditorInvitations(raw, size) {
    if (raw == null) return null;
    const fail = () => { throw new Error(trEditorStructure('invalid')); };
    if (!raw || !['add', 'only'].includes(raw.mode) || !Array.isArray(raw.players) || raw.players.length > size) fail();
    const players = raw.players.map(reference => {
        if (!reference || typeof reference !== 'object') fail();
        const clean = (value, required) => {
            if (value == null && !required) return '';
            if (typeof value !== 'string' || value.length > 240 || /[\u0000-\u001f\u007f]/.test(value) || required && !value.trim()) fail();
            return value.trim();
        };
        return { id: clean(reference.id == null ? '' : String(reference.id), false), name: clean(reference.name, true), country: clean(reference.country, false) };
    });
    if (new Set(players.map(getTournamentEditorPlayerKey)).size !== players.length || raw.mode === 'only' && players.length < 2) fail();
    return players.length ? { mode: raw.mode, players } : null;
}
function normalizeEditorStructure(raw, size) {
    if (raw == null) return null;
    const fail = () => { throw new Error(trEditorStructure('invalid')); };
    const integer = (value, min, max) => {
        if (!Number.isInteger(value) || value < min || value > max) fail();
        return value;
    };
    if (!raw || !['auto', 'manual'].includes(raw.draw) || ![8, 16, 32, 64, 128, 256].includes(size)) fail();
    const league = normalizeEditorSeasonLeague(raw.league, size);
    if (league) {
        if (raw.groups || raw.draw !== 'auto' || raw.slots?.length || raw.assignments?.length) fail();
        return { draw: 'auto', slots: [], assignments: [], groups: null, league };
    }
    let groups = null;
    if (raw.groups != null) {
        const g = raw.groups;
        const count = integer(g.count, 1, 64), groupSize = size / count;
        if (!Number.isInteger(groupSize) || groupSize < 2 || groupSize > 8) fail();
        const advance = integer(g.advance, 1, groupSize - 1), extra = integer(g.extra, 0, count - 1);
        if (count * advance + extra < 2 || !['difference', 'head'].includes(g.tie)) fail();
        groups = { count, advance, extra, legsToWin: integer(g.legsToWin, 1, 30), winPoints: integer(g.winPoints, 1, 10),
            tie: g.tie, eliminationPrize: integer(g.eliminationPrize ?? 0, 0, 999999999) };
    }
    const drawSize = groups ? 2 ** Math.ceil(Math.log2(groups.count * groups.advance + groups.extra)) : size;
    if (!Array.isArray(raw.slots) || raw.slots.length > drawSize) fail();
    const slots = raw.slots.map(value => {
        if (typeof value !== 'string' || value.length > 600 || /[\u0000-\u001f\u007f]/.test(value)) fail();
        return value;
    });
    const selected = slots.filter(value => value && value !== 'bye');
    if (new Set(selected).size !== selected.length) fail();
    if (raw.draw === 'manual' && drawSize - slots.filter(value => value === 'bye').length < 2) fail();
    if (groups) {
        const codes = new Set(editorStructureQualifierCodes(groups));
        if (selected.some(value => !codes.has(value))) fail();
    }
    if (!Array.isArray(raw.assignments) || raw.assignments.length > size) fail();
    const assignments = raw.assignments.map(entry => {
        if (!groups || !entry || typeof entry.key !== 'string' || !entry.key || entry.key.length > 600
            || /[\u0000-\u001f\u007f]/.test(entry.key)) fail();
        return { key: entry.key, group: integer(entry.group, 0, groups.count - 1) };
    });
    if (new Set(assignments.map(entry => entry.key)).size !== assignments.length) fail();
    if (groups && Array.from({ length: groups.count }, (_, index) => assignments.filter(entry => entry.group === index).length)
        .some(count => count > size / groups.count)) fail();
    return groups || raw.draw === 'manual' ? { draw: raw.draw, slots: raw.draw === 'manual' ? slots : [], groups, assignments } : null;
}
function editorStructureQualifierCodes(groups) {
    const codes = [];
    for (let position = 1; position <= groups.advance; position++) {
        for (let index = 0; index < groups.count; index++) codes.push(`${editorStructureGroupLabel(index)}${position}`);
    }
    for (let index = 1; index <= groups.extra; index++) codes.push(`X${index}`);
    return codes;
}
function applyTournamentEditorInvitations(event, participants, candidates, referenceDate = currentDate, options = {}) {
    if (!event?.editorInvitations) return participants;
    const rules = event.editorQualification || { card: 'all' };
    const pool = getTournamentEditorCandidates(candidates).filter(candidate =>
        isTournamentEditorCandidateEligible({ ...event, editorQualification: rules }, candidate, referenceDate, options));
    const invited = event.editorInvitations.players.map(reference => pool.find(candidate => reference.id && candidate.id
        ? String(candidate.id) === String(reference.id) : candidate.name === reference.name && candidate.country === reference.country)).filter(Boolean);
    const source = event.editorInvitations.mode === 'only' ? invited : [...invited, ...participants];
    return getTournamentEditorCandidates(source).slice(0, Number(event.editorFieldSize) || 32);
}
function applyEditorManualDraw(event, entrants, size, key = editorStructureKey) {
    if (event?.editorStructure?.draw !== 'manual') return null;
    const byKey = new Map(entrants.filter(Boolean).map(entrant => [key(entrant), entrant]));
    const used = new Set();
    const slots = Array.from({ length: size }, (_, index) => {
        const selected = event.editorStructure.slots[index] || '';
        if (selected) used.add(selected);
        return selected && selected !== 'bye' ? byKey.get(selected) || null : null;
    });
    const remaining = entrants.filter(entrant => entrant && !used.has(key(entrant)));
    // Fill automatic positions across halves first; fixed positions keep their paths.
    const bits = Math.log2(size);
    for (let index = 0; index < size; index++) {
        let position = 0;
        for (let bit = 0; bit < bits; bit++) position = position * 2 + ((index >> bit) & 1);
        if (!event.editorStructure.slots[position]) slots[position] = remaining.shift() || null;
    }
    return slots;
}
function createEditorRoundRobin(ids) {
    const wheel = [...ids];
    if (wheel.length % 2) wheel.push(null);
    const matches = [];
    for (let round = 0; round < wheel.length - 1; round++) {
        for (let index = 0; index < wheel.length / 2; index++) {
            const first = wheel[index], second = wheel[wheel.length - 1 - index];
            if (first && second) matches.push({ first, second, round });
        }
        wheel.splice(1, 0, wheel.pop());
    }
    return matches;
}
