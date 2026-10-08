// Career-owned tour definitions and access cards. Defaults preserve existing saves.
const CAREER_EDITOR_FIELD_SIZES = [8, 16, 32, 64, 128, 256];
function getCareerCalendarEditorState() {
    if (typeof player === 'undefined' || !player) return { tours: [], cards: [] };
    if (!player.calendarEditor || typeof player.calendarEditor !== 'object') player.calendarEditor = {};
    const state = player.calendarEditor;
    if (!Array.isArray(state.tours)) state.tours = [];
    if (!Array.isArray(state.cards)) state.cards = [];
    return state;
}
function getCareerEditorEvent(value) {
    return typeof value === 'string' ? (typeof tournamentDatabase !== 'undefined'
        ? tournamentDatabase.find(event => event.name === value || event.sourceName === value) : null) : value;
}
function getCareerEditorTourId(event) {
    if (!event) return 'other';
    if (typeof getCalendarTournamentCycle === 'function') {
        const id = getCalendarTournamentCycle(event);
        if (event.editorCycle === 'custom') {
            const name = String(event.editorTourName || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
            const managed = getCareerCalendarEditorState().tours.find(tour => tour.id.startsWith('custom:')
                && (tour.id === id || tour.name.toLocaleLowerCase() === name));
            if (managed) return managed.id;
        }
        if (id !== 'other' || event.editorCycle) return id;
        const name = `${event.sourceName || event.name || ''} ${event.specialType || ''}`;
        if (/qualifier|q.?school|kwalifikac/i.test(name)) return 'qualifier';
        if (/world darts championship|global darts championship|uk open|british open|matchplay|grand prix|grand slam|champion's slam|classicMasters/i.test(name)) return 'major';
        return id;
    }
    return event.editorCycle === 'custom' ? `custom:${encodeURIComponent(String(event.editorTourName || '').trim().toLocaleLowerCase())}`
        : event.editorCycle || event.specialType || 'other';
}
function getCareerEditorTour(value) {
    const event = getCareerEditorEvent(value);
    return event ? getCareerCalendarEditorState().tours.find(tour => tour.id === getCareerEditorTourId(event)) : null;
}
function isCareerEditorCalendarEmpty() { return getCareerCalendarEditorState().emptyCalendar === true; }
function isCareerEditorTourRankingEnabled(id) {
    const tour = getCareerCalendarEditorState().tours.find(tour => tour.id === id);
    return !tour?.removed && tour?.ranking !== 'none'
        && (!isCareerEditorCalendarEmpty() || typeof tournamentDatabase !== 'undefined'
            && tournamentDatabase.some(event => getCareerEditorTourId(event) === id));
}
function hasCareerTourEntryOverride(value) {
    const event = getCareerEditorEvent(value);
    if (event?.isDoubles || event?.specialType === 'worldCup'
        || typeof isEditorTeamTournament === 'function' && isEditorTeamTournament(event)) return false;
    const tour = getCareerEditorTour(value);
    return Boolean(tour && !tour.removed && tour.entry !== 'native');
}
function getCareerTourFieldSize(event) {
    return hasCareerTourEntryOverride(event) ? getCareerEditorTour(event).fieldSize : Number(event?.editorFieldSize) || 32;
}
function getCareerEditorCard(id) {
    if (id === 'pdc') return { id: 'pdc', name: getCareerCalendarEditorState().pdc?.name || 'PDC Tour Card', tier: 0 };
    return getCareerCalendarEditorState().cards.find(card => card.id === id);
}
function hasCareerEditorCard(candidate, id, date = currentDate) {
    if (!id) return true;
    const required = getCareerEditorCard(id);
    if (!required) return false;
    const year = date.getFullYear();
    if (id === 'pdc') return candidate?.hasTourCard === true
        && (!candidate.tourCardExpiryYear || candidate.tourCardExpiryYear > year);
    return (candidate?.editorCards || []).some(held => {
        const card = getCareerEditorCard(held.id);
        return card && held.startYear <= year && held.expiryYear > year
            && (held.id === id || required.acceptHigher && card.tier > required.tier);
    });
}
function isCareerEditorAccessEligible(event, candidate, date = currentDate) {
    if (typeof isTournamentEditorGenderEligible === 'function' && !isTournamentEditorGenderEligible(event, candidate)) return false;
    if (Array.isArray(candidate?.players)) return candidate.players.every(member => isCareerEditorAccessEligible(event, member, date));
    const tour = getCareerEditorTour(event);
    if (tour?.removed) return false;
    if (!hasCareerEditorCard(candidate, event?.editorRequiredCardId, date)) return false;
    if (tour?.entry === 'card' && !hasCareerEditorCard(candidate, tour.requiredCardId, date)) return false;
    return tour?.entry !== 'fixed' || tour.playerKeys.includes(getTournamentEditorPlayerKey(candidate));
}
function getCareerTourEntryGroups(event, candidates, date = currentDate, options = {}) {
    const tour = getCareerEditorTour(event);
    if (!hasCareerTourEntryOverride(event)) return [];
    const pool = getTournamentEditorCandidates(candidates).filter(candidate => !candidate.retired
        && (options.ignoreAvailability || typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate))
        && (tour.entry === 'fixed' || (Number(candidate.ovr ?? candidate.overall) || 0) >= (Number(event.minOvr) || 0))
        && isCareerEditorAccessEligible(event, candidate, date));
    const ranked = tour.ranking === 'own' ? getCareerTourRanking(tour.id, pool, date.getFullYear())
        : getTournamentEditorRanking(pool, 'oom');
    return [{ key: 'editor-tour', source: 'open', places: tour.fieldSize,
        players: ranked.slice(0, tour.fieldSize), label: tour.name, confirmed: true }];
}
function getCareerTourPrizeMoney(candidate, id, year = currentDate.getFullYear()) {
    return Math.max(0, Number(candidate?.editorTourRankings?.[id]?.[year]) || 0);
}
function getCareerTourRanking(id, candidates = getTournamentEditorCandidates(), year = currentDate.getFullYear()) {
    return [...candidates].filter(candidate => candidate && !candidate.isBye && !candidate.retired)
        .sort((a, b) => getCareerTourPrizeMoney(b, id, year) - getCareerTourPrizeMoney(a, id, year)
            || String(getTournamentEditorPlayerKey(a)).localeCompare(String(getTournamentEditorPlayerKey(b))));
}
function awardCareerTourPrizeMoney(candidate, amount, event, countTowardsRankings = true) {
    const tour = getCareerEditorTour(event);
    if (!tour || tour.ranking === 'native') return false;
    if (tour.ranking === 'own' && countTowardsRankings && event?.rankingOverride !== false && !tour.removed) {
        const year = currentDate.getFullYear();
        candidate.editorTourRankings ||= {};
        candidate.editorTourRankings[tour.id] ||= {};
        candidate.editorTourRankings[tour.id][year] = getCareerTourPrizeMoney(candidate, tour.id, year) + amount;
    }
    return true;
}
function grantCareerEditorCard(candidate, card, year = currentDate.getFullYear()) {
    candidate.editorCards ||= [];
    candidate.editorCards = candidate.editorCards.filter(held => held.id !== card.id);
    candidate.editorCards.push({ id: card.id, startYear: year, expiryYear: year + card.durationYears });
}
function awardCareerEditorSeasonCards(candidates, completedYear) {
    const state = getCareerCalendarEditorState();
    state.awardedYears ||= [];
    if (state.awardedYears.includes(completedYear)) return false;
    for (const card of state.cards) {
        if (!card.awardPlaces || !card.awardTourId || !isCareerEditorTourRankingEnabled(card.awardTourId)) continue;
        // Zero-prize players have not earned a place in this season's tour ranking.
        const ranked = getCareerTourRanking(card.awardTourId, candidates, completedYear)
            .filter(candidate => getCareerTourPrizeMoney(candidate, card.awardTourId, completedYear) > 0);
        ranked.slice(0, card.awardPlaces).forEach(candidate => grantCareerEditorCard(candidate, card, completedYear + 1));
    }
    state.awardedYears.push(completedYear);
    return true;
}
function getCareerPdcCardSetting(key, fallback) {
    const value = getCareerCalendarEditorState().pdc?.[key];
    return Number.isInteger(value) ? value : fallback;
}
function getCareerPdcCardTotal() {
    return getCareerPdcCardSetting('oomPlaces', 64) + getCareerPdcCardSetting('qschoolPlaces', 64);
}
function normalizeCareerCalendarConfiguration(raw) {
    if (raw == null) return null;
    const invalid = () => { throw new Error('Invalid tour/card configuration'); };
    if (typeof raw !== 'object' || Array.isArray(raw)) invalid();
    const str = (value, max = 120) => {
        if (typeof value !== 'string' || !value.trim() || value.length > max) invalid();
        return value.trim();
    };
    const int = (value, min, max) => { if (!Number.isInteger(value) || value < min || value > max) invalid(); return value; };
    if (!Array.isArray(raw.tours) || raw.tours.length > 100 || !Array.isArray(raw.cards) || raw.cards.length > 100) invalid();
    const cards = raw.cards.map(card => ({ id: str(card.id), name: str(card.name, 80), tier: int(card.tier, 1, 100),
        durationYears: int(card.durationYears, 1, 10), acceptHigher: card.acceptHigher === true,
        awardTourId: card.awardTourId == null ? null : str(card.awardTourId, 1000), awardPlaces: int(card.awardPlaces || 0, 0, 256) }));
    const cardIds = new Set(['pdc']);
    for (const card of cards) { if (cardIds.has(card.id)) invalid(); cardIds.add(card.id); }
    const tours = raw.tours.map(tour => {
        const builtInIds = ['major', 'proTour', 'playersChampionship', 'europeanTour', 'challengeTour', 'developmentTour', 'worldSeries', 'premierLeague', 'worldCup', 'qualifier', 'other'];
        if (!builtInIds.includes(tour.id)) {
            if (typeof tour.id !== 'string' || !tour.id.startsWith('custom:')) invalid();
            let decoded;
            try { decoded = decodeURIComponent(tour.id.slice(7)); } catch (_) { invalid(); }
            if (!decoded || tour.id !== `custom:${encodeURIComponent(decoded.trim().replace(/\s+/g, ' ').toLocaleLowerCase())}`) invalid();
        }
        if (!['native', 'own', 'none'].includes(tour.ranking) || !['native', 'open', 'card', 'fixed'].includes(tour.entry)
            || tour.id === 'worldCup' && tour.entry !== 'native') invalid();
        const playerKeys = Array.isArray(tour.playerKeys) ? [...new Set(tour.playerKeys.map(key => str(key, 250)))] : [];
        const fieldSize = int(tour.fieldSize, 8, 256);
        if (!CAREER_EDITOR_FIELD_SIZES.includes(fieldSize) || playerKeys.length > 256
            || tour.entry === 'fixed' && !tour.removed && playerKeys.length !== fieldSize
            || tour.entry === 'card' && !tour.removed && !cardIds.has(tour.requiredCardId)) invalid();
        let promotion;
        if (tour.promotion != null) {
            if (typeof tour.promotion !== 'object' || !['ranking', 'league'].includes(tour.promotion.basis)) invalid();
            promotion = { targetId: str(tour.promotion.targetId, 1000), places: int(tour.promotion.places, 1, 256), basis: tour.promotion.basis };
        }
        return { id: str(tour.id, 1000), name: str(tour.name, 80), ranking: tour.ranking, entry: tour.entry, fieldSize,
            playerKeys, requiredCardId: tour.entry === 'card' ? tour.requiredCardId : null, removed: tour.removed === true,
            ...(promotion ? { promotion } : {}) };
    });
    if (new Set(tours.map(tour => tour.id)).size !== tours.length) invalid();
    if (typeof validateCareerTourPromotionRules === 'function') validateCareerTourPromotionRules(tours, invalid);
    else if (tours.some(tour => tour.promotion)) invalid();
    const customNames = tours.filter(tour => !tour.removed && tour.id.startsWith('custom:')).map(tour => tour.name.toLocaleLowerCase());
    if (new Set(customNames).size !== customNames.length) invalid();
    if (cards.some(card => card.awardTourId && !tours.some(tour => tour.id === card.awardTourId && tour.ranking === 'own' && !tour.removed))) invalid();
    let pdc;
    if (raw.pdc) pdc = { name: str(raw.pdc.name, 80), durationYears: int(raw.pdc.durationYears, 1, 10),
        oomPlaces: int(raw.pdc.oomPlaces, 0, 256), qschoolPlaces: int(raw.pdc.qschoolPlaces, 0, 256),
        secondaryPlaces: int(raw.pdc.secondaryPlaces, 0, 64) };
    return { tours, cards, ...(pdc ? { pdc } : {}), emptyCalendar: raw.emptyCalendar === true };
}
