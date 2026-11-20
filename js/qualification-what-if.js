// Financial scenarios own their player copies. They never award cash, run a match,
// complete a qualifier or replace a saved field in the real career.
function cloneQualificationScenario(value) {
    return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}
function qualificationScenarioKey(candidate) { return getPdcTourCardPlayerKey(candidate); }
function qualificationScenarioEventKey(event) { return String(event?.sourceName || event?.name || ''); }
function qualificationScenarioDate(event, year, end = false) {
    return new Date(year + (end ? event.endYearOffset || 0 : 0), end ? event.endMonth ?? event.month : event.month, end ? event.endDay ?? event.day : event.day);
}
function getQualificationScenarioSize(event) {
    if (event.editorFieldSize) return event.editorFieldSize;
    const name = qualificationScenarioEventKey(event).toLowerCase();
    if (isDevelopmentTourTournament(event) || isChallengeTourTournament(event)) return 512;
    if (isEuropeanTourTournament(event)) return 64;
    if (/players championship finals|pro players finals/.test(name)) return 64;
    if (/players championship|pro players cup|world darts championship|global darts championship/.test(name)) return 128;
    if (/uk open|british open/.test(name)) return 160;
    return 32;
}
function isQualificationScenarioSource(event) {
    if (!event || event.completed || event.isDoubles || event.editorTeam || event.editorStructure?.groups || event.editorStructure?.league
        || event.specialType === 'worldCup' || event.qualifierFor || /qualifier/i.test(String(event.specialType || ''))
        || /grand slam|champion's slam/i.test(qualificationScenarioEventKey(event))
        || isTournamentEditorQualifier(event)) return false;
    if (typeof isEditorTeamTournament === 'function' && isEditorTeamTournament(event)) return false;
    if (typeof isWomensSeriesTournament === 'function' && isWomensSeriesTournament(event)) return false;
    if (typeof isWorldYouthTournament === 'function' && isWorldYouthTournament(event)) return false;
    if (typeof isWomensWorldMatchplayTournament === 'function' && isWomensWorldMatchplayTournament(event)) return false;
    const selected = typeof getTournamentEditorPrizeRankings === 'function' ? getTournamentEditorPrizeRankings(event) : null;
    if (selected) return selected.length > 0;
    const tour = typeof getCareerEditorTour === 'function' ? getCareerEditorTour(event) : null;
    return Boolean(tour?.ranking === 'own' || event.rankingOverride !== false
        && (isMainOrderOfMeritRankingTournament(event) || isProTourRankingTournament(event)
            || isChallengeTourTournament(event) || isDevelopmentTourTournament(event)));
}
function getQualificationScenarioSources(target, events = tournamentDatabase, date = currentDate) {
    const year = date.getFullYear(), cutoff = qualificationScenarioDate(target, year).getTime();
    return events.filter(event => event !== target && isQualificationScenarioSource(event)
        && (typeof isTournamentScheduledForCareerYear !== 'function' || isTournamentScheduledForCareerYear(event, year))
        && qualificationScenarioDate(event, year) >= date
        && qualificationScenarioDate(event, year, true).getTime() < cutoff)
        .sort((a, b) => qualificationScenarioDate(a, year) - qualificationScenarioDate(b, year));
}
function qualificationScenarioError(code) { const error = new Error(code); error.scenarioCode = code; return error; }
function qualificationScenarioHasEtSeedException(event) {
    return isEuropeanTourTournament(event)
        && !(typeof hasTournamentEditorQualification === 'function' && hasTournamentEditorQualification(event))
        && !(typeof hasCareerTourEntryOverride === 'function' && hasCareerTourEntryOverride(event));
}
function applyQualificationScenarioPrize(candidate, event, amount, date, noRanking = false) {
    if (!amount || noRanking || event.rankingOverride === false) return;
    const selected = typeof getTournamentEditorPrizeRankings === 'function' ? getTournamentEditorPrizeRankings(event) : null;
    if (selected) return awardSelectedTournamentRankingPrizes(candidate, amount, event, selected, date);
    const tour = typeof getCareerEditorTour === 'function' ? getCareerEditorTour(event) : null;
    if (tour && tour.ranking !== 'native') {
        if (tour.ranking === 'own' && !tour.removed) {
            candidate.editorTourRankings ||= {};
            candidate.editorTourRankings[tour.id] ||= {};
            const year = date.getFullYear();
            candidate.editorTourRankings[tour.id][year] = (Number(candidate.editorTourRankings[tour.id][year]) || 0) + amount;
        }
        return;
    }
    if (isChallengeTourTournament(event)) { awardChallengeTourPrizeMoney(candidate, amount); return; }
    if (isDevelopmentTourTournament(event)) { awardDevelopmentTourPrizeMoney(candidate, amount); return; }
    if (isMainOrderOfMeritRankingTournament(event)) awardMainOrderOfMeritPrizeMoney(candidate, amount, event, date);
    if (isProTourRankingTournament(event)) awardProTourOrderOfMeritPrizeMoney(candidate, amount, event, date);
    if (isPlayersChampionshipTournament(event)) candidate.pcPrizeMoney = (Number(candidate.pcPrizeMoney) || 0) + amount;
    awardEuropeanTourOrderOfMeritPrizeMoney(candidate, amount, event);
}
function qualificationScenarioRankings(candidates, ownKey, tourIds = [], includeWomensSeries = false) {
    const definitions = [['main', 'prizeMoney'], ['protour', 'proTourPrizeMoney'], ['pc', 'pcPrizeMoney'],
        ['europeanTour', 'europeanTourPrizeMoney'], ['challengeTour', 'challengeTourPrizeMoney'], ['developmentTour', 'developmentTourPrizeMoney']];
    return [...definitions.map(([id, field]) => ({ id, amount: p => Number(p[field]) || 0 })),
        ...(includeWomensSeries ? [{ id: 'womensSeries', amount: p => getWomensSeriesPrizeMoney(p) }] : []),
        ...tourIds.map(id => ({ id: `tour:${id}`, amount: p => Number(p.editorTourRankings?.[id]?.[currentDate.getFullYear()]) || 0 }))]
        .map(definition => {
            const tour = definition.id.startsWith('tour:') && typeof getCareerCalendarEditorState === 'function'
                ? getCareerCalendarEditorState().tours.find(tour => tour.id === definition.id.slice(5)) : null;
            const compare = definition.id === 'europeanTour' ? compareEuropeanTourOrderOfMerit
                : definition.id === 'challengeTour' ? compareChallengeTourOrderOfMerit
                    : definition.id === 'developmentTour' ? compareDevelopmentTourOrderOfMerit
                        : definition.id === 'womensSeries' ? compareWomensSeriesCountback
                        : tour ? (a, b) => definition.amount(b) - definition.amount(a)
                            || String(getTournamentEditorPlayerKey(a)).localeCompare(String(getTournamentEditorPlayerKey(b))) : null;
            const pool = tour ? candidates.filter(p => !p.retired && (definition.amount(p) > 0
                || tour.playerKeys?.includes(getTournamentEditorPlayerKey(p)))) : definition.id === 'womensSeries'
                    ? candidates.filter(isWomensSeriesWoman) : candidates;
            const sorted = [...pool].sort(compare || ((a, b) => definition.amount(b) - definition.amount(a)));
            const index = sorted.findIndex(p => qualificationScenarioKey(p) === ownKey);
            return { id: definition.id, position: index + 1, amount: index < 0 ? 0 : definition.amount(sorted[index]) };
        });
}
function qualificationScenarioSummary(preview, ownKey, target, year) {
    const selected = preview.groups.find(group => group.players.some(p => qualificationScenarioKey(p) === ownKey));
    const players = preview.groups.flatMap(group => group.players.map(p => ({ key: qualificationScenarioKey(p), name: p.name, country: p.country })));
    return { status: preview.status, route: selected?.label || getPlanningRouteLabel(preview.route),
        count: preview.count, size: preview.size, locked: Boolean(selected?.confirmed && (preview.groups.some(group => group.key === 'draw')
            || ['worldChampionshipQualification', 'continentalQualification', 'crownMastersQualification', 'ukOpenQualification', 'pdcTourCardQualification'].some(field => target[field]?.year === year))), players };
}
function calculateQualificationScenario({ target, entries = [], candidates, careerPlayer, date = currentDate }) {
    if (!target) throw qualificationScenarioError('invalidScenario');
    const year = date.getFullYear(), targetDate = qualificationScenarioDate(target, year);
    if (target.completed || !getPlanningTournamentKind(target) || targetDate < date || !Array.isArray(entries) || entries.length > 8
        || typeof isTournamentScheduledForCareerYear === 'function' && !isTournamentScheduledForCareerYear(target, year))
        throw qualificationScenarioError('invalidScenario');
    const sourceEvents = getQualificationScenarioSources(target, tournamentDatabase, date);
    const ownKey = qualificationScenarioKey(careerPlayer), originalKeys = new Set(candidates.map(qualificationScenarioKey));
    if (!originalKeys.has(ownKey)) throw qualificationScenarioError('invalidPlayer');
    const seen = new Set(), places = new Map();
    const prepared = entries.filter(entry => entry.result !== 'none').map(entry => {
        const event = sourceEvents.find(event => qualificationScenarioEventKey(event) === entry.eventKey);
        if (!event || !originalKeys.has(entry.playerKey)) throw qualificationScenarioError('invalidScenario');
        const round = entry.result === 'winner' ? 2 : Number(entry.result), size = getQualificationScenarioSize(event);
        if (!Number.isInteger(round) || round < 2 || round > size
            || ![2, 4, 8, 16, 32, 64, 96, 128, 160, 256, 512].includes(round)) throw qualificationScenarioError('invalidResult');
        const key = JSON.stringify([entry.eventKey, entry.playerKey]);
        if (seen.has(key)) throw qualificationScenarioError('duplicateResult');
        seen.add(key);
        const placeKey = JSON.stringify([entry.eventKey, entry.result]), count = (places.get(placeKey) || 0) + 1;
        if (count > (entry.result === 'winner' ? 1 : Math.max(1, Math.floor(round / 2)))) throw qualificationScenarioError('tooManyPlaces');
        places.set(placeKey, count);
        const noRanking = Boolean(entry.noRanking);
        if (noRanking && !(qualificationScenarioHasEtSeedException(event) && round === 32 && entry.result !== 'winner'))
            throw qualificationScenarioError('invalidResult');
        return { ...entry, event, round, noRanking, amount: getPrizeMoney(event, round, entry.result === 'winner'),
            earnedAt: qualificationScenarioDate(event, year, true) };
    }).sort((a, b) => a.earnedAt - b.earnedAt);
    try {
        const before = cloneQualificationScenario(candidates);
        refreshMainOrderOfMerit(before, date); refreshProTourOrderOfMerit(before, date);
        const after = cloneQualificationScenario(before), byKey = new Map(after.map(p => [qualificationScenarioKey(p), p]));
        prepared.forEach(entry => applyQualificationScenarioPrize(byKey.get(entry.playerKey), entry.event, entry.amount, entry.earnedAt, entry.noRanking));
        refreshMainOrderOfMerit(before, targetDate); refreshProTourOrderOfMerit(before, targetDate);
        refreshMainOrderOfMerit(after, targetDate); refreshProTourOrderOfMerit(after, targetDate);
        const ownBefore = before.find(p => qualificationScenarioKey(p) === ownKey), ownAfter = byKey.get(ownKey);
        const targetTour = typeof getCareerEditorTour === 'function' ? getCareerEditorTour(target) : null;
        const tours = [...new Set([...prepared.map(entry => typeof getCareerEditorTour === 'function' ? getCareerEditorTour(entry.event) : null), targetTour]
            .filter(tour => tour?.ranking === 'own').map(tour => tour.id).concat(
                [...(target.editorNativeRoutes || []), ...(target.editorQualification?.routes || [])]
                    .filter(route => route.source === 'tourRanking').map(route => route.tourId)))];
        const selectedRankings = typeof getTournamentEditorPrizeRankings === 'function'
            ? prepared.flatMap(entry => getTournamentEditorPrizeRankings(entry.event) || []) : [];
        for (const id of selectedRankings) if (id.startsWith('tour:') && !tours.includes(id.slice(5))
            && getCareerCalendarEditorState().tours.some(tour => tour.id === id.slice(5) && tour.ranking === 'own' && !tour.removed)) tours.push(id.slice(5));
        const includeWomensSeries = selectedRankings.includes('womensSeries');
        const baseline = qualificationScenarioSummary(buildQualificationPreview(cloneQualificationScenario(target), before, targetDate, ownBefore), ownKey, target, year);
        const projected = qualificationScenarioSummary(buildQualificationPreview(cloneQualificationScenario(target), after, targetDate, ownAfter), ownKey, target, year);
        const oldKeys = new Set(baseline.players.map(p => p.key)), newKeys = new Set(projected.players.map(p => p.key));
        return { date: targetDate.getTime(), targetName: target.name, baseline, projected,
            rankingsBefore: qualificationScenarioRankings(before, ownKey, tours, includeWomensSeries),
            rankingsAfter: qualificationScenarioRankings(after, ownKey, tours, includeWomensSeries),
            gained: projected.players.filter(p => !oldKeys.has(p.key)), lost: baseline.players.filter(p => !newKeys.has(p.key)),
            entries: prepared.map(entry => ({ name: byKey.get(entry.playerKey).name, eventName: entry.event.name,
                result: entry.result, amount: entry.amount, noRanking: entry.noRanking })) };
    } finally {
        // Do not keep an entire projected roster alive through ranking caches.
        invalidateMainOrderOfMeritRefreshCache(); invalidateProTourOrderOfMeritRefreshCache();
        if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache();
    }
}
