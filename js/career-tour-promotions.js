// Evaluate every boundary from the same season snapshot before changing rosters.
function validateCareerTourPromotionRules(tours, invalid) {
    const targets = new Set();
    for (const tour of tours) {
        if (!tour.promotion) continue;
        const rule = tour.promotion, target = tours.find(candidate => candidate.id === rule.targetId);
        if (tour.removed || !target || target.removed || tour === target || tour.entry !== 'fixed' || target.entry !== 'fixed'
            || !Number.isInteger(rule.places) || rule.places < 1 || rule.places > Math.min(tour.fieldSize, target.fieldSize)
            || !['ranking', 'league'].includes(rule.basis) || rule.basis === 'ranking' && (tour.ranking !== 'own' || target.ranking !== 'own')
            || targets.has(rule.targetId)) invalid();
        targets.add(rule.targetId);
        const visited = new Set([tour.id]);
        let next = target;
        while (next) {
            if (visited.has(next.id)) invalid();
            visited.add(next.id); next = next.promotion ? tours.find(candidate => candidate.id === next.promotion.targetId) : null;
        }
    }
    const involved = tours.filter(tour => tour.promotion || targets.has(tour.id));
    const keys = new Set();
    for (const tour of involved) {
        const incoming = tours.find(candidate => candidate.promotion?.targetId === tour.id)?.promotion.places || 0;
        if (incoming + (tour.promotion?.places || 0) > tour.fieldSize) invalid();
        for (const key of tour.playerKeys) { if (keys.has(key)) invalid(); keys.add(key); }
    }
}
function getCareerTourMovementRanking(tour, candidates, year, basis = 'ranking') {
    const members = candidates.filter(candidate => !candidate.retired && tour.playerKeys.includes(getTournamentEditorPlayerKey(candidate)));
    if (basis === 'league') {
        const leagues = tournamentDatabase.filter(event => !event.editorLeagueParentKey && typeof isEditorSeasonLeague === 'function'
            && isEditorSeasonLeague(event) && getCareerEditorTourId(event) === tour.id
            && event.editorLeagueState?.year === year && event.editorLeagueState.completed && !event.editorLeagueState.cancelled);
        if (leagues.length !== 1) return null;
        const byKey = new Map(members.map(candidate => [getTournamentEditorPlayerKey(candidate), candidate]));
        return getEditorLeagueStandings(leagues[0]).map(row => byKey.get(row.key)).filter(Boolean);
    }
    // No sporting result means no roster changes, even if a rule was added late in the season.
    if (!members.some(candidate => getCareerTourPrizeMoney(candidate, tour.id, year) > 0)) return null;
    return getCareerTourRanking(tour.id, members, year);
}
function processCareerTourPromotions(candidates, completedYear) {
    candidates = getTournamentEditorCandidates(candidates);
    const state = getCareerCalendarEditorState();
    state.promotionYears ||= [];
    if (state.promotionYears.includes(completedYear)) return false;
    const snapshots = state.tours.filter(tour => !tour.removed).map(tour => ({ ...tour, playerKeys: [...tour.playerKeys] }));
    const changes = new Map(snapshots.map(tour => [tour.id, { remove: new Set(), add: [] }])), reports = [], claimed = new Set();
    for (const lower of snapshots) {
        const rule = lower.promotion, upper = snapshots.find(tour => tour.id === rule?.targetId);
        if (!rule || !upper || lower.entry !== 'fixed' || upper.entry !== 'fixed') continue;
        const promotedRanking = getCareerTourMovementRanking(lower, candidates, completedYear, rule.basis);
        const relegatedRanking = getCareerTourMovementRanking(upper, candidates, completedYear, rule.basis);
        if (!promotedRanking || !relegatedRanking) { reports.push({ from: lower.id, to: upper.id, skipped: true }); continue; }
        const availableUp = promotedRanking.filter(candidate => !claimed.has(getTournamentEditorPlayerKey(candidate)));
        const availableDown = relegatedRanking.filter(candidate => !claimed.has(getTournamentEditorPlayerKey(candidate)));
        const count = Math.min(rule.places, availableUp.length, availableDown.length);
        const promoted = availableUp.slice(0, count).map(getTournamentEditorPlayerKey);
        const relegated = count ? availableDown.slice(-count).map(getTournamentEditorPlayerKey) : [];
        [...promoted, ...relegated].forEach(key => claimed.add(key));
        for (const key of promoted) changes.get(lower.id).remove.add(key);
        for (const key of relegated) changes.get(upper.id).remove.add(key);
        changes.get(upper.id).add.push(...promoted); changes.get(lower.id).add.push(...relegated);
        reports.push({ from: lower.id, to: upper.id, promoted, relegated });
    }
    for (const tour of state.tours) {
        const change = changes.get(tour.id);
        if (!change || !change.add.length) continue;
        tour.playerKeys = [...tour.playerKeys.filter(key => !change.remove.has(key)), ...change.add];
    }
    state.promotionYears.push(completedYear);
    state.promotionHistory ||= [];
    state.promotionHistory.push({ year: completedYear, reports });
    state.promotionHistory = state.promotionHistory.slice(-10);
    return true;
}
