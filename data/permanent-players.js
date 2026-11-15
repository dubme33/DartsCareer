// Project-approved real identities use a stable source, outside mod template slots.
const PERMANENT_PLAYER_DEFINITIONS = Object.freeze([
    Object.freeze({
        permanentPlayerId: 'david-schlichting', id: 'permanent-david-schlichting',
        name: 'David Schlichting', sourceName: 'David Schlichting', nickname: 'The Turtle', country: 'Niemcy', gender: 'male',
        birthYear: 2002, birthDate: '2002-11-07', birthDateSource: 'project-confirmed',
        photo: 'assets/players/David-Schlichting.png',
        ovr: 54, scoring: 54, doubles: 54,
        prizeMoney: 0, proTourPrizeMoney: 0, pcPrizeMoney: 0, europeanTourPrizeMoney: 0,
        hasTourCard: false
    })
]);

function getPermanentPlayerDefinition(candidate) {
    if (!candidate) return null;
    const normalize = name => String(name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
    if (typeof candidate === 'string') return PERMANENT_PLAYER_DEFINITIONS.find(def => normalize(def.name) === normalize(candidate)) || null;
    const marked = PERMANENT_PLAYER_DEFINITIONS.find(def => candidate.permanentPlayerId === def.permanentPlayerId || candidate.id === def.id);
    if (marked) return marked;
    if (candidate.isNewgen || candidate.isBye) return null;
    return PERMANENT_PLAYER_DEFINITIONS.find(def => [candidate.name, candidate.sourceName].some(name => normalize(name) === normalize(def.name))) || null;
}

function getPermanentPlayerPhoto(candidate) {
    return getPermanentPlayerDefinition(candidate)?.photo || '';
}

function applyPermanentPlayerIdentity(candidate, { preserveProgress = true } = {}) {
    const def = getPermanentPlayerDefinition(candidate);
    if (!def) return false;
    for (const field of ['permanentPlayerId', 'name', 'sourceName', 'nickname', 'country', 'gender', 'birthYear', 'birthDate', 'birthDateSource', 'photo']) candidate[field] = def[field];
    if (!candidate.id) candidate.id = def.id;
    // A third-party mod can use any roster position for this person. It must not
    // turn that position into a link to an unrelated default player.
    delete candidate.defaultTemplateIndex;
    candidate.editorCreated = false;
    if (candidate.kind === 'custom') delete candidate.kind;
    if (!preserveProgress) {
        for (const field of ['ovr', 'scoring', 'doubles']) candidate[field] = def[field];
        candidate.baseOvr = def.ovr; candidate.baseScoring = def.scoring; candidate.baseDoubles = def.doubles; candidate.form = 0;
        if (Object.hasOwn(candidate, 'overall')) candidate.overall = def.ovr;
    }
    return true;
}

function ensurePermanentPlayersInRoster(roster, { careerPlayer = null, preserveProgress = true } = {}) {
    if (!Array.isArray(roster)) return;
    for (const def of PERMANENT_PLAYER_DEFINITIONS) {
        const career = getPermanentPlayerDefinition(careerPlayer) === def;
        if (career) applyPermanentPlayerIdentity(careerPlayer, { preserveProgress });
        const matches = roster.filter(candidate => getPermanentPlayerDefinition(candidate) === def);
        matches.forEach(candidate => applyPermanentPlayerIdentity(candidate, { preserveProgress }));
        // ID-based retirement remains authoritative; a renamed/imported copy also
        // keeps the real identity in the retirement registry.
        const names = typeof playerLifecycleState !== 'undefined' ? playerLifecycleState?.retiredPlayerNames : null;
        const unavailable = (typeof isRetiredPlayer === 'function' && isRetiredPlayer(def))
            || (typeof isPlayerEditorDeleted === 'function' && isPlayerEditorDeleted(def))
            || (Array.isArray(names) && names.some(name => String(name).trim().toLocaleLowerCase() === def.name.toLocaleLowerCase()));
        if (unavailable && !career) {
            const active = roster.filter(candidate => getPermanentPlayerDefinition(candidate) !== def);
            if (active.length !== roster.length) roster.splice(0, roster.length, ...active);
            continue;
        }
        if (career || matches.length) continue;
        const candidate = { ...def, baseOvr: def.ovr, baseScoring: def.scoring, baseDoubles: def.doubles, form: 0, historyPT: {}, historyMain: {} };
        roster.push(candidate);
    }
}

ensurePermanentPlayersInRoster(pdcPlayers);
