// Career events are rolled only when the calendar advances. Match engines and
// UI read dated effects without changing the permanent player ratings.
const PLAYER_EVENTS_CONFIG = Object.freeze({
    version: 1, injuryChance: 0.0006, formRiseChance: 0.002, formDropChance: 0.002,
    formMinDays: 7, formMaxDays: 21, formMinModifier: 3, formMaxModifier: 8,
    cooldownDays: 7,
    injuries: Object.freeze([
        Object.freeze({ id: 'wrist', minDays: 7, maxDays: 14 }),
        Object.freeze({ id: 'shoulder', minDays: 14, maxDays: 28 }),
        Object.freeze({ id: 'elbow', minDays: 21, maxDays: 42 })
    ])
});

function playerEventDateKey(value = currentDate) {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parsePlayerEventDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return playerEventDateKey(date) === value ? date : null;
}

function addPlayerEventDays(value, days) {
    const date = parsePlayerEventDate(value);
    if (!date || !Number.isInteger(days)) return '';
    date.setDate(date.getDate() + days);
    return playerEventDateKey(date);
}

function getValidPlayerTimedEvent(event, injury = false) {
    if (!event || typeof event !== 'object' || !parsePlayerEventDate(event.startedOn)
        || !parsePlayerEventDate(event.endsOn) || event.endsOn <= event.startedOn) return null;
    const config = injury ? PLAYER_EVENTS_CONFIG.injuries.find(item => item.id === event.type) : null;
    if (injury && !config) return null;
    const minDays = injury ? config.minDays : PLAYER_EVENTS_CONFIG.formMinDays;
    const maxDays = injury ? config.maxDays : PLAYER_EVENTS_CONFIG.formMaxDays;
    if (event.endsOn < addPlayerEventDays(event.startedOn, minDays)
        || event.endsOn > addPlayerEventDays(event.startedOn, maxDays)) return null;
    if (injury) return { type: config.id, startedOn: event.startedOn, endsOn: event.endsOn };
    const modifier = Number(event.modifier);
    if (!Number.isInteger(modifier) || Math.abs(modifier) < PLAYER_EVENTS_CONFIG.formMinModifier
        || Math.abs(modifier) > PLAYER_EVENTS_CONFIG.formMaxModifier) return null;
    return { modifier, startedOn: event.startedOn, endsOn: event.endsOn };
}

function getPlayerEventRoster() {
    const source = [typeof player !== 'undefined' ? player : null,
        ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : [])];
    const unique = new Map();
    for (const candidate of source) {
        if (!candidate?.name || candidate.isBye || candidate.isWorldCupGuest
            || (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate))) continue;
        const key = candidate.id || `${candidate.name}|${candidate.country || ''}`;
        if (!unique.has(key)) unique.set(key, candidate);
    }
    return [...unique.values()];
}

function initializePlayerEvents(reset = false, candidates = getPlayerEventRoster()) {
    const today = playerEventDateKey();
    for (const candidate of candidates) {
        const saved = !reset && candidate.playerEvents?.version === PLAYER_EVENTS_CONFIG.version ? candidate.playerEvents : null;
        const lastRolledOn = parsePlayerEventDate(saved?.lastRolledOn) && saved.lastRolledOn <= today ? saved.lastRolledOn : today;
        const injury = getValidPlayerTimedEvent(saved?.injury, true);
        const form = getValidPlayerTimedEvent(saved?.form);
        candidate.playerEvents = {
            version: PLAYER_EVENTS_CONFIG.version, lastRolledOn,
            cooldownUntil: parsePlayerEventDate(saved?.cooldownUntil)
                && saved.cooldownUntil <= addPlayerEventDays(today, PLAYER_EVENTS_CONFIG.cooldownDays) ? saved.cooldownUntil : '',
            injury: injury && injury.startedOn <= today ? injury : null,
            form: form && form.startedOn <= today ? form : null
        };
    }
}

function getActivePlayerTimedEvent(candidate, injury = false, referenceDate = currentDate) {
    if (candidate?.playerEvents?.version !== PLAYER_EVENTS_CONFIG.version) return null;
    const event = getValidPlayerTimedEvent(injury ? candidate.playerEvents.injury : candidate.playerEvents.form, injury);
    const today = playerEventDateKey(referenceDate);
    return event && today && event.startedOn <= today && today < event.endsOn ? event : null;
}

function isPlayerInjured(candidate, referenceDate = currentDate) {
    return Boolean(getActivePlayerTimedEvent(candidate, true, referenceDate));
}

function isPlayerAvailableForPlay(candidate, referenceDate = currentDate) {
    return Boolean(candidate && !candidate.isBye && !isPlayerInjured(candidate, referenceDate));
}

function getPlayerFormEventModifier(candidate, referenceDate = currentDate) {
    return getActivePlayerTimedEvent(candidate, false, referenceDate)?.modifier || 0;
}

function getPlayerEventMatchRatings(candidate, stats = candidate) {
    const modifier = getPlayerFormEventModifier(candidate);
    if (!modifier || !stats) return stats;
    const result = { ...stats };
    for (const field of ['overall', 'ovr', 'scoring', 'doubles']) {
        if (Number.isFinite(Number(stats[field]))) result[field] = Math.max(40,
            Math.min(field === 'overall' || field === 'ovr' ? 99 : 100, Number(stats[field]) + modifier));
    }
    return result;
}

function createPlayerEventBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

// Preserve bracket positions and seeding. An unavailable entrant cannot receive
// match statistics, ranking money or development for a walkover.
function repairInjuredTournamentBracket(bracket) {
    const entries = Array.from(bracket || []);
    if (entries.every(candidate => candidate && !isPlayerInjured(candidate))) return bracket;
    return entries.map(candidate => !candidate || isPlayerInjured(candidate) ? createPlayerEventBye() : candidate);
}

function processDailyPlayerEvents(random = Math.random) {
    const result = { changed: false, events: [] };
    if ((typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())
        || (typeof currentMatch !== 'undefined' && currentMatch)
        || (typeof activeTournament !== 'undefined' && activeTournament && !activeTournament.completed)) return result;
    const today = playerEventDateKey();
    if (!today) return result;
    const roster = getPlayerEventRoster();
    initializePlayerEvents(false, roster);
    const integer = (min, max) => min + Math.min(max - min, Math.floor(Math.max(0, Math.min(1, random())) * (max - min + 1)));
    const record = (candidate, kind, event) => {
        result.changed = true;
        result.events.push({ candidate, kind, ...event });
    };
    for (const candidate of roster) {
        const state = candidate.playerEvents;
        if (state.lastRolledOn >= today) continue;
        state.lastRolledOn = today;
        for (const field of ['injury', 'form']) {
            const expired = state[field];
            if (!expired || today < expired.endsOn) continue;
            record(candidate, field === 'injury' ? 'recovered' : 'formEnded', expired);
            state.cooldownUntil = addPlayerEventDays(today, PLAYER_EVENTS_CONFIG.cooldownDays);
            state[field] = null;
        }
        if (state.injury || state.form || (state.cooldownUntil && today < state.cooldownUntil)) continue;
        const roll = random();
        if (roll < PLAYER_EVENTS_CONFIG.injuryChance) {
            const injury = PLAYER_EVENTS_CONFIG.injuries[integer(0, PLAYER_EVENTS_CONFIG.injuries.length - 1)];
            const event = { type: injury.id, startedOn: today, endsOn: addPlayerEventDays(today, integer(injury.minDays, injury.maxDays)) };
            state.injury = event;
            record(candidate, 'injury', event);
        } else if (roll < PLAYER_EVENTS_CONFIG.injuryChance + PLAYER_EVENTS_CONFIG.formRiseChance + PLAYER_EVENTS_CONFIG.formDropChance) {
            const positive = roll < PLAYER_EVENTS_CONFIG.injuryChance + PLAYER_EVENTS_CONFIG.formRiseChance;
            const event = { modifier: integer(PLAYER_EVENTS_CONFIG.formMinModifier, PLAYER_EVENTS_CONFIG.formMaxModifier) * (positive ? 1 : -1),
                startedOn: today, endsOn: addPlayerEventDays(today, integer(PLAYER_EVENTS_CONFIG.formMinDays, PLAYER_EVENTS_CONFIG.formMaxDays)) };
            state.form = event;
            record(candidate, positive ? 'formUp' : 'formDown', event);
        }
    }
    if (result.changed && typeof notifyPlayerEvents === 'function') notifyPlayerEvents(result);
    return result;
}
