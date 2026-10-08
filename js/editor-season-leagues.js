// Each calendar entry owns one matchday. The parent owns the single fixture ledger.
Object.assign(EDITOR_STRUCTURE_TEXT, {
    league: ['Liga sezonowa', 'Season league', 'Saisonliga', 'Seizoenscompetitie'],
    cycles: ['Mecze z każdym rywalem', 'Meetings with each opponent', 'Spiele gegen jeden Gegner', 'Wedstrijden tegen elke tegenstander'],
    single: ['Jeden mecz', 'One match', 'Ein Spiel', 'Eén wedstrijd'],
    return: ['Mecz i rewanż', 'Home and return match', 'Hin- und Rückspiel', 'Heen- en terugwedstrijd'],
    playoffs: ['Uczestnicy play-offów (0 = mistrz z tabeli)', 'Playoff entrants (0 = table champion)', 'Playoff-Teilnehmer (0 = Tabellenmeister)', 'Play-offdeelnemers (0 = kampioen via stand)'],
    leagueHint: ['Liga indywidualna dla maksymalnie 32 zawodników. Daty początku i końca wyznaczają sezon; kolejki i rundy play-offów zostaną równomiernie wpisane do kalendarza. Skład jest ustalany przy pierwszej kolejce. Nagrody wypłacane są raz, na końcu ligi. Między kolejkami możesz grać inne turnieje.', 'Singles league for up to 32 players. Start and end dates define the season; matchdays and playoff rounds are evenly spread across the calendar. The field is fixed on the first matchday. Prizes are paid once at the end. Other tournaments can be played between matchdays.', 'Einzelliga mit bis zu 32 Spielern. Start und Ende bestimmen die Saison; Spieltage und Playoffs werden gleichmäßig im Kalender verteilt. Das Feld steht ab dem ersten Spieltag fest. Preisgelder werden einmal am Ende vergeben. Andere Turniere sind zwischen Spieltagen möglich.', 'Individuele competitie met maximaal 32 spelers. Begin en einde bepalen het seizoen; speelronden en play-offs worden gelijkmatig verdeeld. Het deelnemersveld staat vanaf de eerste ronde vast. Prijzen worden eenmaal aan het einde betaald. Andere toernooien kunnen tussendoor worden gespeeld.'],
    leagueInvalid: ['Liga wymaga formatu indywidualnego, 8, 16 lub 32 miejsc i poprawnej liczby uczestników play-offów. Zostaw co najmniej jeden dzień na każdą kolejkę i rundę play-offów między datami początku i końca.', 'A league needs singles, 8, 16 or 32 slots and a valid playoff size. Allow at least one day for every matchday and playoff round between the start and end dates.', 'Eine Liga benötigt Einzel, 8, 16 oder 32 Plätze und eine gültige Playoff-Größe. Plane mindestens einen Tag je Spieltag und Playoff-Runde zwischen Start und Ende ein.', 'Een competitie vereist individuele wedstrijden, 8, 16 of 32 plaatsen en een geldig aantal play-offdeelnemers. Plan minstens één dag per speelronde en play-offronde tussen begin en einde.'],
    matchday: ['Kolejka {round}', 'Matchday {round}', 'Spieltag {round}', 'Speelronde {round}'],
    playoffRound: ['Play-offy · {round}', 'Playoffs · {round}', 'Playoffs · {round}', 'Play-offs · {round}'],
    leagueRound: ['Symuluj kolejkę', 'Simulate matchday', 'Spieltag simulieren', 'Simuleer speelronde'],
    leagueLegs: ['Legi do wygrania w lidze', 'Legs to win in the league', 'Legs zum Sieg in der Liga', 'Legs om te winnen in de competitie'],
    standings: ['Tabela ligi', 'League standings', 'Ligatabelle', 'Competitiestand']
});
function getEditorLeagueRoot(event = activeTournament) {
    return event?.editorLeagueParentKey ? tournamentDatabase.find(candidate => !candidate.editorLeagueParentKey
        && tournamentEditorKey(candidate) === event.editorLeagueParentKey) : event;
}
function getEditorLeagueRoundCount(event) {
    const rules = event.editorStructure.league;
    return (event.editorFieldSize - 1) * rules.cycles + (rules.playoffs ? Math.log2(rules.playoffs) : 0);
}
function getEditorLeagueCalendarDates(event, year = currentDate.getFullYear()) {
    const start = Date.UTC(year, event.month, event.day), end = Date.UTC(year, event.endMonth ?? event.month, event.endDay ?? event.day);
    const count = getEditorLeagueRoundCount(event), span = Math.round((end - start) / 86400000);
    if (span < count - 1) throw new Error(trEditorStructure('leagueInvalid'));
    return Array.from({ length: count }, (_, index) => new Date(start + Math.floor(index * span / (count - 1)) * 86400000));
}
function validateEditorLeagueEvent(event) {
    if (!isEditorSeasonLeague(event)) return;
    if (!event.isEditorTournament || event.editorTeamMode || event.qualifierFor || event.editorQualification?.kind === 'qualifier')
        throw new Error(trEditorStructure('leagueInvalid'));
    getEditorLeagueCalendarDates(event);
}
function rebuildEditorLeagueCalendar(root) {
    const key = tournamentEditorKey(root);
    tournamentDatabase.splice(0, tournamentDatabase.length, ...tournamentDatabase.filter(event => event.editorLeagueParentKey !== key));
    if (!isEditorSeasonLeague(root)) return;
    const dates = getEditorLeagueCalendarDates(root), regular = (root.editorFieldSize - 1) * root.editorStructure.league.cycles;
    dates.slice(1).forEach((date, offset) => {
        const round = offset + 1, title = round < regular ? `Round ${round + 1}` : `Playoffs ${round - regular + 1}`;
        const name = `${root.name} · ${title}`;
        tournamentDatabase.push({ ...root, name, sourceName: `${key} · league-round-${round}`, month: date.getUTCMonth(), day: date.getUTCDate(),
            endMonth: date.getUTCMonth(), endDay: date.getUTCDate(), completed: root.editorLeagueState?.completed === true, historyLogs: '', editorLeagueState: undefined,
            editorLeagueParentKey: key, editorLeagueRound: round });
    });
}
function prepareEditorLeagueTourUpdate(events, tour) {
    if (tour.entry === 'native') return [];
    return events.filter(event => !event.editorLeagueParentKey && isEditorSeasonLeague(event) && event.editorFieldSize !== tour.fieldSize).map(root => {
        const editorStructure = normalizeEditorStructure(root.editorStructure, tour.fieldSize);
        const editorInvitations = tour.entry === 'fixed' ? null : normalizeEditorInvitations(root.editorInvitations, tour.fieldSize);
        const editorQualification = { mode: 'custom', kind: 'main', card: 'all', minAge: 0, maxAge: 0, countries: [], routes: [{ source: 'oom', places: tour.fieldSize }] };
        const updated = { editorFieldSize: tour.fieldSize, editorStructure, editorInvitations, editorQualification };
        validateEditorLeagueEvent({ ...root, ...updated });
        return [root, updated];
    });
}
function editorLeagueStateView(event = activeTournament) {
    const root = getEditorLeagueRoot(event), state = root?.editorLeagueState;
    if (!state) return null;
    const round = event.editorLeagueRound || 0, regular = (root.editorFieldSize - 1) * root.editorStructure.league.cycles;
    return { teams: state.teams, matches: state.fixtures.filter(match => match.matchday === round),
        phase: round < regular ? 'league' : 'knockout', roundSize: round < regular ? root.editorFieldSize
            : Math.max(2, root.editorStructure.league.playoffs / 2 ** (round - regular)),
        completed: event.completed === true };
}
function initializeEditorSeasonLeague(root) {
    const size = root.editorFieldSize, rules = root.editorStructure.league;
    const teams = buildEditorTeamField(root).slice(0, size).map(team => ({ ...team, players: team.players.map(editorTeamReference) }));
    // A nominal field keeps matchday dates stable when an invitation or roster member is unavailable.
    const ids = Array.from({ length: size }, (_, index) => teams[index]?.id || `league-bye-${index}`);
    const firstHalf = createEditorRoundRobin(ids), fixtures = [];
    for (let cycle = 0; cycle < rules.cycles; cycle++) for (const pair of firstHalf) {
        const a = teams.find(team => team.id === pair.first), b = teams.find(team => team.id === pair.second);
        const matchday = cycle * (size - 1) + pair.round;
        if (a && b) fixtures.push({ ...createEditorTeamMatch(cycle ? b : a, cycle ? a : b, size, fixtures.length),
            id: `league-${matchday}-${fixtures.length}`, matchday });
    }
    root.editorLeagueState = { year: currentDate.getFullYear(), fieldSize: size, rules: { ...rules }, teams, fixtures, completed: false, prizesPaid: false };
    resolveEditorLeaguePlayers(root);
}
function resolveEditorLeaguePlayers(root) {
    const pool = getTournamentEditorCandidates();
    root.editorLeagueState.teams.forEach(team => { team.players = team.players.map(reference => resolveEditorTeamPlayer(reference, pool) || { ...reference, retired: true }); });
}
function getEditorLeagueStandings(root = getEditorLeagueRoot()) {
    const state = root?.editorLeagueState;
    if (!state) return [];
    const rules = state.rules || root.editorStructure.league, regular = ((state.fieldSize || root.editorFieldSize) - 1) * rules.cycles;
    const matches = state.fixtures.filter(match => match.matchday < regular && match.played);
    const rows = state.teams.map((team, seed) => ({ id: team.id, key: editorStructureKey(team), played: 0, wins: 0, points: 0,
        legsWon: 0, legsLost: 0, seed, headPoints: 0, headDifference: 0, headWon: 0 }));
    const byId = new Map(rows.map(row => [row.id, row]));
    for (const match of matches) {
        const a = byId.get(match.team1Id), b = byId.get(match.team2Id);
        if (!a || !b) continue;
        a.played++; b.played++; a.legsWon += match.score1; a.legsLost += match.score2;
        b.legsWon += match.score2; b.legsLost += match.score1;
        const winner = byId.get(match.winnerId); if (winner) { winner.points += rules.winPoints; winner.wins++; }
    }
    if (rules.tie === 'head') for (const row of rows) {
        const tied = new Set(rows.filter(other => other.points === row.points).map(other => other.id));
        for (const match of matches.filter(match => tied.has(match.team1Id) && tied.has(match.team2Id))) {
            if (match.winnerId === row.id) row.headPoints += rules.winPoints;
            if (match.team1Id === row.id) { row.headDifference += match.score1 - match.score2; row.headWon += match.score1; }
            if (match.team2Id === row.id) { row.headDifference += match.score2 - match.score1; row.headWon += match.score2; }
        }
    }
    return rows.sort((a, b) => b.points - a.points || b.headPoints - a.headPoints || b.headDifference - a.headDifference
        || b.headWon - a.headWon || b.legsWon - b.legsLost - (a.legsWon - a.legsLost) || b.legsWon - a.legsWon || a.seed - b.seed);
}
function buildEditorLeaguePlayoff(root, round) {
    const state = root.editorLeagueState, regular = (root.editorFieldSize - 1) * root.editorStructure.league.cycles;
    if (state.fixtures.some(match => match.matchday === round)) return;
    const size = root.editorStructure.league.playoffs / 2 ** (round - regular);
    let teams;
    if (round === regular) {
        teams = getEditorLeagueStandings(root).slice(0, size).map(row => state.teams.find(team => team.id === row.id));
        // 1-v-last, 2-v-penultimate; reverse the lower half to preserve seeded paths.
        let order = [1, 2];
        for (let width = 4; width <= size; width *= 2) order = order.flatMap(seed => [seed, width + 1 - seed]);
        const slots = order.map(seed => teams[seed - 1] || null);
        teams = slots;
    } else teams = state.fixtures.filter(match => match.matchday === round - 1).map(match => state.teams.find(team => team.id === match.winnerId) || null);
    for (let index = 0; index < size / 2; index++) state.fixtures.push({ ...createEditorTeamMatch(teams[index * 2], teams[index * 2 + 1], size, index),
        id: `league-playoff-${round}-${index}`, matchday: round });
}
function renderEditorLeagueTable(root = getEditorLeagueRoot()) {
    const state = root.editorLeagueState;
    return `<h4>${escapeHtml(trEditorStructure('standings'))}</h4><table style="width:100%;text-align:left"><thead><tr><th>#</th><th></th><th>P</th><th>W</th><th>Pts</th><th>+ / −</th></tr></thead><tbody>`
        + getEditorLeagueStandings(root).map((row, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(state.teams.find(team => team.id === row.id)?.country || '')}</td><td>${row.played}</td><td>${row.wins}</td><td>${row.points}</td><td>${row.legsWon} / ${row.legsLost}</td></tr>`).join('') + '</tbody></table>';
}
function renderEditorLeagueFixtures(root = getEditorLeagueRoot()) {
    return root.editorLeagueState.fixtures.map(match => `<div class="world-cup-mini-match"><small>${match.matchday + 1}</small><span>${escapeHtml(root.editorLeagueState.teams.find(team => team.id === match.team1Id)?.country || 'BYE')}</span><strong>${match.played ? `${match.score1 ?? '—'}:${match.score2 ?? '—'}` : '—'}</strong><span>${escapeHtml(root.editorLeagueState.teams.find(team => team.id === match.team2Id)?.country || 'BYE')}</span></div>`).join('');
}
function isEditorLeaguePlayerPending(event, identity = isCurrentPlayer) {
    const view = editorLeagueStateView(event);
    if (!view || event.completed) return false;
    const team = view.teams.find(candidate => candidate.players.some(identity));
    if (!team) return false;
    if (view.phase === 'knockout' && !view.matches.length) {
        const root = getEditorLeagueRoot(event), round = event.editorLeagueRound || 0;
        const regular = (root.editorFieldSize - 1) * root.editorStructure.league.cycles;
        return round === regular ? getEditorLeagueStandings(root).slice(0, root.editorStructure.league.playoffs).some(row => row.id === team.id)
            : root.editorLeagueState.fixtures.some(match => match.matchday === round - 1 && match.winnerId === team.id);
    }
    return view.matches.some(match => !match.played && [match.team1Id, match.team2Id].includes(team.id));
}
function startEditorSeasonLeague() {
    const root = getEditorLeagueRoot(), event = activeTournament;
    if (!root || !isEditorSeasonLeague(root) || event.completed) return false;
    if (!root.editorLeagueState || root.editorLeagueState.year !== currentDate.getFullYear()) initializeEditorSeasonLeague(root);
    resolveEditorLeaguePlayers(root);
    const round = event.editorLeagueRound || 0, regular = (root.editorFieldSize - 1) * root.editorStructure.league.cycles;
    if (round >= regular) buildEditorLeaguePlayoff(root, round);
    for (const match of editorTeamState().matches.filter(match => !match.played)) forfeitEditorLeagueMatch(match);
    prepareTournamentSimulationForm(root.editorLeagueState.teams.flatMap(team => team.players));
    if (editorLeagueStateView().matches.every(match => match.played)) return completeEditorLeagueMatchday();
    if (isSkippingTournament) { isSkippingTournament = false; return simulateEditorLeagueMatchday(true, true); }
    if (shouldAutoSimulateUnwatchedTournament(event, isEditorLeaguePlayerPending(event))) return simulateEditorLeagueMatchday(true);
    showEditorTeamOverview(); saveGame(true); return true;
}
function forfeitEditorLeagueMatch(match, withdrawCareer = false) {
    const a = editorTeamById(match.team1Id), b = editorTeamById(match.team2Id);
    const unavailable = team => !team?.players?.length || team.players.some(candidate => candidate.retired
        || typeof isPlayerAvailableForPlay === 'function' && !isPlayerAvailableForPlay(candidate)
        || withdrawCareer && isCurrentPlayer(candidate));
    const aOut = unavailable(a), bOut = unavailable(b);
    if (!aOut && !bOut) return false;
    const winner = aOut && bOut ? null : aOut ? b : a, format = getEditorTeamMatchFormat();
    const needed = format.type === 'sets' ? format.setsToWin : format.legsToWin;
    finishEditorTeamStateMatch(match, winner?.id || null, winner === a ? needed : 0, winner === b ? needed : 0);
    return true;
}
async function simulateEditorLeagueMatchday(includeCareer = false, withdrawCareer = false) {
    if (isTournamentSimulationBusy()) return false;
    const event = activeTournament;
    return runTournamentSimulation(async () => {
        function* iterate() {
            for (const match of editorTeamState().matches) {
                if (match.played) continue;
                const a = editorTeamById(match.team1Id), b = editorTeamById(match.team2Id);
                const career = editorTeamHasCareerPlayer(a) || editorTeamHasCareerPlayer(b);
                if (career && !includeCareer) continue;
                if (!forfeitEditorLeagueMatch(match, withdrawCareer)) simulateEditorTeamMatch(match);
                yield;
            }
            return true;
        }
        await runTournamentSimulationSteps(iterate(), trEditorStructure('league'), editorTeamState().matches.length,
            () => { if (activeTournament !== event) throw new Error('League matchday changed during simulation'); });
        if (editorTeamState().matches.every(match => match.played)) completeEditorLeagueMatchday();
        else showEditorTeamOverview();
        return true;
    });
}
function completeEditorLeagueMatchday() {
    const event = activeTournament, root = getEditorLeagueRoot(), state = root?.editorLeagueState;
    if (!state || event.completed || editorTeamState().matches.some(match => !match.played)) return false;
    const round = event.editorLeagueRound || 0, last = getEditorLeagueRoundCount(root) - 1;
    if (round === last && !state.prizesPaid) {
        const standings = getEditorLeagueStandings(root), rules = root.editorStructure.league;
        let winnerId = rules.playoffs ? editorTeamState().matches[0]?.winnerId : standings[0]?.id;
        // No remaining entrant is a valid completed league with no champion or payout.
        if (state.teams.length < 2) winnerId = null;
        const places = new Map(standings.map((row, index) => [row.id, index === 0 ? 2 : 2 ** Math.ceil(Math.log2(index + 1))]));
        if (rules.playoffs) for (const match of state.fixtures.filter(match => match.matchday >= (root.editorFieldSize - 1) * rules.cycles)) {
            const size = rules.playoffs / 2 ** (match.matchday - (root.editorFieldSize - 1) * rules.cycles);
            for (const id of [match.team1Id, match.team2Id]) if (id && id !== match.winnerId) places.set(id, size);
        }
        if (winnerId) state.teams.forEach(team => editorTeamPayout(team, team.id === winnerId ? 2 : Math.max(2, places.get(team.id) || root.editorFieldSize), team.id === winnerId));
        state.prizesPaid = true; state.completed = true; state.winnerId = winnerId;
        const winner = state.teams.find(team => team.id === winnerId);
        root.editorTeamWinner = winner?.country || '';
        if (winner && typeof recordCareerChampion === 'function') recordCareerChampion(root, winner.players[0]);
    }
    event.completed = true;
    event.historyLogs = renderEditorLeagueTable(root) + editorTeamState().matches.map(renderEditorTeamMatch).join('');
    root.historyLogs = renderEditorLeagueTable(root) + renderEditorLeagueFixtures(root);
    if (typeof finishTournamentFinances === 'function') finishTournamentFinances(event);
    activeTournament = null; document.getElementById('bracket-modal').style.display = 'none';
    showScreen('screen-hub'); updateHub(); saveGame(true); return true;
}
function cancelEditorSeasonLeague(event) {
    const root = getEditorLeagueRoot(event);
    for (const entry of tournamentDatabase.filter(candidate => candidate === root || candidate.editorLeagueParentKey === tournamentEditorKey(root))) {
        entry.completed = true; entry.editorCancelledYear = currentDate.getFullYear();
        if (typeof finishTournamentFinances === 'function') finishTournamentFinances(entry);
    }
    if (root.editorLeagueState) {
        root.editorLeagueState.completed = true; root.editorLeagueState.cancelled = true;
        root.historyLogs = renderEditorLeagueTable(root) + renderEditorLeagueFixtures(root);
    }
    if (getEditorLeagueRoot(activeTournament) === root) {
        activeTournament = null; tournamentBracket = []; currentMatch = null;
        document.getElementById('bracket-modal').style.display = 'none';
    }
    updateHub(); return true;
}
