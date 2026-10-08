// Groups use the same canonical match list as knockout, so reloads never split
// a result between a standings copy and the live fixture.
function initializeEditorCompetitionGroups() {
    const state = editorTeamState(), rules = activeTournament.editorStructure.groups;
    const capacity = activeTournament.editorFieldSize / rules.count;
    const teams = [...state.teams].sort((a, b) => getWorldCupTeamRating(b) - getWorldCupTeamRating(a));
    state.groups = Array.from({ length: rules.count }, (_, index) => ({ label: editorStructureGroupLabel(index), teamIds: [] }));
    const assigned = new Set();
    for (const entry of activeTournament.editorStructure.assignments) {
        const team = teams.find(candidate => editorStructureKey(candidate) === entry.key);
        if (team && !assigned.has(team.id) && state.groups[entry.group]?.teamIds.length < capacity) {
            state.groups[entry.group].teamIds.push(team.id); assigned.add(team.id);
        }
    }
    for (const team of teams.filter(candidate => !assigned.has(candidate.id))) {
        const group = state.groups.filter(candidate => candidate.teamIds.length < capacity)
            .sort((a, b) => a.teamIds.length - b.teamIds.length)[0];
        if (group) group.teamIds.push(team.id);
    }
    state.phase = 'groups';
    state.matches = state.groups.flatMap((group, groupIndex) => createEditorRoundRobin(group.teamIds).map((pair, index) => ({
        ...createEditorTeamMatch(editorTeamById(pair.first), editorTeamById(pair.second), 0, index),
        id: `editor-group-${groupIndex}-${index}`, groupIndex, matchday: pair.round }))).sort((a, b) => a.matchday - b.matchday || a.groupIndex - b.groupIndex);
}
function getEditorCompetitionStandings(groupIndex) {
    const state = editorTeamState(), group = state.groups[groupIndex], rules = activeTournament.editorStructure.groups;
    const matches = state.phase === 'groups' ? state.matches : state.groupMatches || [];
    const rows = group.teamIds.map(id => ({ id, played: 0, points: 0, wins: 0, legsWon: 0, legsLost: 0,
        seed: state.teams.findIndex(team => team.id === id) }));
    const byId = new Map(rows.map(row => [row.id, row]));
    const played = matches.filter(match => match.groupIndex === groupIndex && match.played);
    for (const match of played) {
        const first = byId.get(match.team1Id), second = byId.get(match.team2Id);
        if (!first || !second) continue;
        first.played++; second.played++;
        first.legsWon += match.score1; first.legsLost += match.score2;
        second.legsWon += match.score2; second.legsLost += match.score1;
        const winner = byId.get(match.winnerId);
        if (winner) { winner.wins++; winner.points += rules.winPoints; }
    }
    for (const row of rows) {
        row.headPoints = 0; row.headDifference = 0; row.headWon = 0;
        if (rules.tie !== 'head') continue;
        const tiedIds = new Set(rows.filter(other => other.points === row.points).map(other => other.id));
        for (const match of played.filter(match => tiedIds.has(match.team1Id) && tiedIds.has(match.team2Id))) {
            if (match.winnerId === row.id) row.headPoints += rules.winPoints;
            if (match.team1Id === row.id) { row.headDifference += match.score1 - match.score2; row.headWon += match.score1; }
            if (match.team2Id === row.id) { row.headDifference += match.score2 - match.score1; row.headWon += match.score2; }
        }
    }
    return rows.sort((a, b) => b.points - a.points || b.headPoints - a.headPoints || b.headDifference - a.headDifference
        || b.headWon - a.headWon || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost) || b.legsWon - a.legsWon || a.seed - b.seed);
}
function completeEditorCompetitionGroups() {
    const state = editorTeamState(), rules = activeTournament.editorStructure.groups;
    if (state.phase !== 'groups' || state.matches.some(match => !match.played)) return false;
    const qualified = [], extra = [];
    for (let index = 0; index < state.groups.length; index++) {
        const rows = getEditorCompetitionStandings(index);
        rows.slice(0, rules.advance).forEach((row, position) => qualified.push({ ...editorTeamById(row.id),
            qualificationCode: `${state.groups[index].label}${position + 1}` }));
        if (rows[rules.advance]) extra.push(rows[rules.advance]);
    }
    extra.sort((a, b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost) || b.legsWon - a.legsWon || a.seed - b.seed)
        .slice(0, rules.extra).forEach((row, index) => qualified.push({ ...editorTeamById(row.id), qualificationCode: `X${index + 1}` }));
    const advancing = new Set(qualified.map(team => team.id));
    if (!state.groupPrizesPaid) {
        state.teams.filter(team => !advancing.has(team.id)).forEach(team => team.players.forEach(candidate => {
            const prize = rules.eliminationPrize / team.players.length;
            if (prize > 0) awardPrizeMoney(candidate, prize, activeTournament.name, { countTowardsRankings: activeTournament.rankingOverride === true });
            if (typeof recordSeasonTournamentResult === 'function') recordSeasonTournamentResult(candidate, activeTournament,
                { round: activeTournament.editorFieldSize, prizeMoney: prize, won: false, countTowardsRankings: activeTournament.rankingOverride === true });
        }));
        state.groupPrizesPaid = true;
    }
    state.groupMatches = state.matches.map(match => ({ ...match }));
    state.phase = 'knockout';
    state.roundSize = 2 ** Math.ceil(Math.log2(rules.count * rules.advance + rules.extra));
    let slots = applyEditorManualDraw(activeTournament, qualified, state.roundSize, entrant => entrant.qualificationCode);
    if (!slots && rules.advance === 2 && rules.extra === 0 && rules.count % 2 === 0) {
        const byCode = new Map(qualified.map(team => [team.qualificationCode, team]));
        slots = [];
        for (let index = 0; index < rules.count; index += 2) {
            const a = state.groups[index].label, b = state.groups[index + 1].label;
            slots.push(byCode.get(`${a}1`) || null, byCode.get(`${b}2`) || null, byCode.get(`${b}1`) || null, byCode.get(`${a}2`) || null);
        }
    }
    if (slots) state.matches = Array.from({ length: state.roundSize / 2 }, (_, index) =>
        createEditorTeamMatch(slots[index * 2], slots[index * 2 + 1], state.roundSize, index));
    else {
        // Group positions use a fresh draw rather than the player slots of the group stage.
        const original = activeTournament.editorStructure;
        try { activeTournament.editorStructure = { ...original, draw: 'auto' }; state.matches = buildEditorTeamRound(qualified, state.roundSize); }
        finally { activeTournament.editorStructure = original; }
    }
    return true;
}
function renderEditorCompetitionGroups(history = false) {
    const state = editorTeamState(), rules = activeTournament.editorStructure.groups;
    const matches = state.phase === 'groups' ? state.matches : state.groupMatches || [];
    return `<p>${escapeHtml(trEditorStructure('rules', { groups: rules.count, advance: rules.advance, extra: rules.extra }))}</p>`
        + state.groups.map((group, groupIndex) => `<section class="world-cup-group"><h4>${trEditorStructure('group')} ${group.label}</h4>
        <table style="width:100%;text-align:left"><thead><tr><th></th><th></th><th>P</th><th>W</th><th>Pts</th><th>+ / −</th></tr></thead><tbody>
        ${getEditorCompetitionStandings(groupIndex).map((row, index) => `<tr style="${index < rules.advance ? 'color:var(--accent-green)' : ''}"><td>${index + 1}</td><td>${escapeHtml(editorTeamById(row.id)?.country || '')}</td><td>${row.played}</td><td>${row.wins}</td><td>${row.points}</td><td>${row.legsWon} / ${row.legsLost}</td></tr>`).join('')}</tbody></table>
        ${matches.filter(match => match.groupIndex === groupIndex).map(renderEditorTeamMatch).join('')}</section>`).join('');
}

function* iterateEditorCompetitionMatches(includeCareer) {
    const state = editorTeamState();
    const nextDay = state.phase === 'groups' ? Math.min(...state.matches.filter(match => !match.played).map(match => match.matchday)) : null;
    for (const match of state.matches) {
        if (match.played || nextDay !== null && match.matchday !== nextDay) continue;
        if (!includeCareer && (editorTeamHasCareerPlayer(editorTeamById(match.team1Id)) || editorTeamHasCareerPlayer(editorTeamById(match.team2Id)))) continue;
        simulateEditorTeamMatch(match);
        yield;
    }
    return true;
}
async function simulateEditorCompetitionInBatches(includeCareer, entire) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    const event = activeTournament, state = editorTeamState();
    if (!state || state.completed) return false;
    return runTournamentSimulation(async () => {
        for (let safety = 0; !state.completed && safety < 32; safety++) {
            await runTournamentSimulationSteps(iterateEditorCompetitionMatches(includeCareer),
                state.phase === 'groups' ? trEditorStructure('group') : state.roundSize,
                state.matches.filter(match => !match.played).length, () => {
                    if (activeTournament !== event || editorTeamState() !== state) throw new Error('Tournament state changed during simulation');
                });
            while (!state.completed && state.matches.every(match => match.played)) advanceEditorTeamRound();
            if (!entire) break;
        }
        if (!state.completed) showEditorTeamOverview();
        return entire ? state.completed : true;
    });
}
