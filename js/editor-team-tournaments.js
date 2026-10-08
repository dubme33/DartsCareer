// Knockout events created in the tournament editor. World Cup retains its own
// fixed format; this engine only reuses the existing doubles match mechanics.
function isEditorTeamTournament(event = activeTournament) {
    return event?.isEditorTournament === true && ['national', 'pairs'].includes(event.editorTeamMode);
}

function editorTeamText(pl, en) { return typeof currentLang !== 'undefined' && currentLang === 'pl' ? pl : en; }
function editorTeamState() { return typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament)
    ? editorLeagueStateView() : activeTournament?.editorTeamState; }
function editorTeamById(id) { return editorTeamState()?.teams.find(team => team.id === id) || null; }
function editorTeamHasCareerPlayer(team) { return Boolean(team?.players?.some(candidate => isCurrentPlayer(candidate))); }
function editorTeamLabel(team) { return team?.country || ''; }
function editorTeamFlag(team) { return team?.flagCountry ? getFlagImg(team.flagCountry) : ''; }
function editorTeamReference(candidate) { return { id: candidate.id, name: candidate.name, country: candidate.country }; }
function isEditorCompetitionEntrantAlive(event, identity = isCurrentPlayer) {
    if (typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(event)) return isEditorLeaguePlayerPending(event, identity);
    const state = event?.editorTeamState;
    if (!state || state.completed) return false;
    const team = state.teams.find(candidate => candidate.players.some(identity));
    if (!team) return false;
    if (state.phase === 'groups') return state.groups.some(group => group.teamIds.includes(team.id));
    return state.matches.some(match => (!match.played || match.winnerId === team.id)
        && (match.team1Id === team.id || match.team2Id === team.id));
}

function resolveEditorTeamPlayer(reference, pool) {
    if (!reference) return null;
    return pool.find(candidate => reference.id && candidate.id && String(candidate.id) === String(reference.id))
        || pool.find(candidate => candidate.name === reference.name && candidate.country === reference.country)
        || null;
}

function buildEditorTeamField(event) {
    if (!event.editorTeamMode) {
        const fixedLeague = typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(event)
            && typeof getCareerEditorTour === 'function' && getCareerEditorTour(event)?.entry === 'fixed';
        const options = { ignoreAvailability: typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(event) };
        const participants = fixedLeague ? getCareerTourEntryGroups(event, undefined, currentDate, options).flatMap(group => group.players)
            : getTournamentEditorParticipants(event, undefined, currentDate, options);
        return participants.map(candidate => ({
        id: `editor-solo-${getTournamentEditorPlayerKey(candidate)}`, country: candidate.name,
        flagCountry: candidate.country, players: [candidate] }));
    }
    const pool = getWorldCupRankedPlayers().filter(candidate =>
        (typeof isTournamentEditorGenderEligible !== 'function' || isTournamentEditorGenderEligible(event, candidate))
        && (typeof isCareerEditorAccessEligible !== 'function' || isCareerEditorAccessEligible(event, candidate)));
    const size = Math.min(256, Number(event.editorFieldSize) || 32);
    const minOvr = Number(event.minOvr) || 0;
    if (event.editorTeamMode === 'national') {
        const countryCounts = new Map();
        pool.filter(candidate => Number(candidate.ovr ?? candidate.overall) >= minOvr)
            .forEach(candidate => countryCounts.set(candidate.country, (countryCounts.get(candidate.country) || 0) + 1));
        const countries = Array.isArray(event.editorTeamEntries) && event.editorTeamEntries.length
            ? event.editorTeamEntries.map(entry => entry.country)
            : [...countryCounts].filter(([, count]) => count >= 2).map(([country]) => country);
        const eligibleCountries = [...new Set(countries)].filter(country => !event.editorGender || (countryCounts.get(country) || 0) >= 2);
        const teams = buildWorldCupTeams(eligibleCountries.slice(0, size), { candidates: pool, event })
            .filter(team => team.players.every(candidate => Number(candidate.ovr ?? candidate.overall) >= minOvr));
        teams.sort((a, b) => getWorldCupTeamRating(b) - getWorldCupTeamRating(a));
        return teams.map((team, index) => ({ id: `editor-team-${index}`, country: getWorldCupCountryName(team.country),
            flagCountry: team.country, players: team.players }));
    }
    const used = new Set();
    return (event.editorTeamEntries || []).slice(0, size).map((entry, index) => {
        const players = (entry.players || []).map(reference => resolveEditorTeamPlayer(reference, pool));
        if (players.length !== 2 || players.some(candidate => !candidate || Number(candidate.ovr ?? candidate.overall) < minOvr)) return null;
        const keys = players.map(candidate => getWorldCupPlayerIdentity(candidate));
        if (keys[0] === keys[1] || keys.some(key => used.has(key))) return null;
        keys.forEach(key => used.add(key));
        const name = String(entry.name || '').trim() || players.map(candidate => candidate.name).join(' / ');
        return { id: `editor-team-${index}`, country: name, flagCountry: players[0].country === players[1].country
            ? players[0].country : null, players };
    }).filter(Boolean);
}

function createEditorTeamMatch(team1, team2, roundSize, index) {
    return { id: `etm-${roundSize}-${index}`, team1Id: team1?.id || null, team2Id: team2?.id || null,
        winnerId: team1 && !team2 ? team1.id : team2 && !team1 ? team2.id : null,
        played: !team1 || !team2, score1: null, score2: null };
}

function buildEditorTeamRound(teams, roundSize) {
    // Keep byes apart: each first-round fixture has at least one entrant.
    const slots = Array(roundSize).fill(null);
    const manual = typeof applyEditorManualDraw === 'function' ? applyEditorManualDraw(activeTournament, teams, roundSize) : null;
    if (manual) return Array.from({ length: roundSize / 2 }, (_, index) =>
        createEditorTeamMatch(manual[index * 2], manual[index * 2 + 1], roundSize, index));
    const ranked = [...teams].sort((a, b) => getWorldCupTeamRating(b) - getWorldCupTeamRating(a));
    const bits = Math.log2(roundSize);
    const order = Array.from({ length: roundSize }, (_, seed) => {
        let number = seed, position = 0;
        for (let bit = 0; bit < bits; bit++) { position = position * 2 + number % 2; number = Math.floor(number / 2); }
        return position;
    });
    ranked.forEach((team, index) => { slots[order[index]] = team; });
    return Array.from({ length: roundSize / 2 }, (_, index) =>
        createEditorTeamMatch(slots[index * 2], slots[index * 2 + 1], roundSize, index));
}

function getEditorTeamMatchFormat() {
    if (typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament) && editorTeamState()?.phase === 'league')
        return { type: 'legs', legsToWin: getEditorLeagueRoot().editorStructure.league.legsToWin };
    if (editorTeamState()?.phase === 'groups') return { type: 'legs', legsToWin: activeTournament.editorStructure.groups.legsToWin };
    const format = activeTournament?.editorMatchFormat;
    if (format?.type === 'rounds') return format.rounds[editorTeamState()?.roundSize] || { type: 'legs', legsToWin: 6 };
    if (format?.type === 'sets') return { type: 'sets', setsToWin: format.setsToWin, legsPerSet: format.legsPerSet };
    return { type: 'legs', legsToWin: format?.legsToWin || 6 };
}

function getEditorTeamPendingMatch() {
    const state = editorTeamState();
    if (!state) return null;
    return state.matches.find(match => !match.played &&
        (editorTeamHasCareerPlayer(editorTeamById(match.team1Id)) || editorTeamHasCareerPlayer(editorTeamById(match.team2Id)))) || null;
}

function startEditorTeamTournament() {
    if (!(isEditorTeamTournament() || typeof isEditorGroupTournament === 'function' && isEditorGroupTournament(activeTournament)) || activeTournament.completed) return false;
    if (!editorTeamState()) {
        const teams = buildEditorTeamField(activeTournament);
        if (teams.length < 2) {
            const cancelled = activeTournament;
            cancelled.completed = true;
            cancelled.historyLogs = `<p>${escapeHtml(editorTeamText('Turniej nie odbył się: brakuje dwóch dostępnych zespołów.',
                'The event was cancelled: fewer than two teams are available.'))}</p>`;
            activeTournament = null;
            updateHub();
            if (typeof saveGame === 'function') saveGame(true);
            alert(editorTeamText('Turniej drużynowy wymaga co najmniej dwóch dostępnych zespołów.',
                'A team event requires at least two available teams.'));
            return false;
        }
        const size = Number(activeTournament.editorFieldSize) || 32;
        activeTournament.editorTeamState = { teams, roundSize: size, matches: buildEditorTeamRound(teams, size),
            history: [], completed: false };
        if (typeof initializeEditorCompetitionGroups === 'function' && isEditorGroupTournament(activeTournament)) initializeEditorCompetitionGroups();
        if (typeof prepareTournamentSimulationForm === 'function' && !activeTournament.editorTeamMode) prepareTournamentSimulationForm(teams.flatMap(team => team.players));
        while (!editorTeamState().completed && editorTeamState().matches.every(match => match.played)) {
            advanceEditorTeamRound();
        }
        if (typeof saveGame === 'function') saveGame(true);
    }
    if (typeof isSkippingTournament !== 'undefined' && isSkippingTournament) {
        isSkippingTournament = false;
        return simulateEditorTeamTournament();
    }
    if (typeof shouldAutoSimulateUnwatchedTournament === 'function'
        && shouldAutoSimulateUnwatchedTournament(activeTournament, isEditorCompetitionEntrantAlive(activeTournament))) {
        return simulateEditorTeamTournament();
    }
    return showEditorTeamOverview();
}

function editorTeamRoundLabel(size) {
    if (size === 2) return editorTeamText('Finał', 'Final');
    if (size === 4) return editorTeamText('Półfinały', 'Semi-finals');
    if (size === 8) return editorTeamText('Ćwierćfinały', 'Quarter-finals');
    return editorTeamText(`Ostatnia ${size}`, `Last ${size}`);
}

function renderEditorTeamMatch(match) {
    const first = editorTeamById(match.team1Id), second = editorTeamById(match.team2Id);
    const label = team => team ? `${editorTeamFlag(team)} ${escapeHtml(editorTeamLabel(team))}` : editorTeamText('Wolny los', 'Bye');
    return `<div class="bracket-match ${editorTeamHasCareerPlayer(first) || editorTeamHasCareerPlayer(second) ? 'player-match' : ''}">
        <div style="flex:1;text-align:right">${label(first)}</div>
        <div class="bracket-vs">${match.played && first && second ? `${match.score1}:${match.score2}` : '—'}</div>
        <div style="flex:1;text-align:left">${label(second)}</div></div>`;
}

function showEditorTeamOverview() {
    const state = editorTeamState();
    if (!state || state.completed) return false;
    const modal = document.getElementById('bracket-modal');
    const inGroups = state.phase === 'groups';
    const inLeague = typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament);
    document.getElementById('bracket-title').textContent = `${activeTournament.name} — ${inGroups ? trEditorStructure('group') : inLeague && state.phase === 'league' ? trEditorStructure('matchday', { round: (activeTournament.editorLeagueRound || 0) + 1 }) : editorTeamRoundLabel(state.roundSize)}`;
    document.getElementById('bracket-list').innerHTML = inGroups ? renderEditorCompetitionGroups() : (inLeague ? renderEditorLeagueTable() : '') + state.matches.map(renderEditorTeamMatch).join('');
    const pending = getEditorTeamPendingMatch();
    const play = document.getElementById('t-btn-play-match');
    const simulate = document.getElementById('t-btn-sim-round');
    const finish = document.getElementById('t-btn-sim-tournament');
    play.style.display = pending ? 'block' : 'none';
    if (pending) {
        play.textContent = typeof trEditorStructure === 'function' ? trEditorStructure('play') : editorTeamText('Rozegraj mecz drużynowy', 'Play team match');
        play.onclick = () => startEditorTeamMatch(pending);
    }
    simulate.style.display = 'block';
    simulate.textContent = inLeague ? trEditorStructure('leagueRound') : inGroups ? trEditorStructure('groupRound') : pending ? editorTeamText('Symuluj pozostałe mecze', 'Simulate other matches')
        : editorTeamText('Symuluj rundę', 'Simulate round');
    simulate.onclick = () => simulateEditorTeamRound(false);
    if (finish) {
        const stillAlive = isEditorCompetitionEntrantAlive(activeTournament);
        finish.style.display = !stillAlive ? 'block' : 'none';
        finish.textContent = inLeague ? trEditorStructure('leagueRound') : editorTeamText('Symuluj turniej', 'Simulate tournament');
        finish.onclick = simulateEditorTeamTournament;
    }
    for (const id of ['t-btn-sim-to-match', 't-btn-skip-bracket']) {
        const button = document.getElementById(id); if (button) button.style.display = 'none';
    }
    modal.style.display = 'flex';
    return true;
}

function editorTeamPayout(team, round, won) {
    if (!team || !activeTournament) return;
    const prize = Number(getPrizeMoney(activeTournament, round, won)) || 0;
    team.players.forEach(candidate => {
        if (candidate.isWorldCupGuest) return;
        if (prize > 0) awardPrizeMoney(candidate, prize / team.players.length, activeTournament.name,
            { countTowardsRankings: activeTournament.rankingOverride === true });
        if (typeof recordSeasonTournamentResult === 'function') recordSeasonTournamentResult(candidate, activeTournament,
            { round, prizeMoney: prize / team.players.length, won, countTowardsRankings: activeTournament.rankingOverride === true });
    });
}

function finishEditorTeamStateMatch(match, winnerId, score1, score2) {
    if (!match || match.played) return false;
    match.played = true;
    match.winnerId = winnerId;
    match.score1 = score1;
    match.score2 = score2;
    const loser = editorTeamById(winnerId === match.team1Id ? match.team2Id : match.team1Id);
    if (editorTeamState().phase !== 'groups' && !(typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament))) editorTeamPayout(loser, editorTeamState().roundSize, false);
    return true;
}

function simulateEditorTeamMatch(match) {
    const team1 = editorTeamById(match.team1Id), team2 = editorTeamById(match.team2Id);
    const format = getEditorTeamMatchFormat();
    if (!activeTournament.editorTeamMode && typeof simulateAImatch === 'function') {
        const result = simulateAImatch(team1.players[0], team2.players[0], format);
        finishEditorTeamStateMatch(match, result.winner === team1.players[0] ? team1.id : team2.id, result.p1Score, result.p2Score);
        return;
    }
    const chance = Math.max(0.08, Math.min(0.92,
        1 / (1 + Math.exp((getWorldCupTeamRating(team2) - getWorldCupTeamRating(team1)) / 7))));
    let score1 = 0, score2 = 0;
    const needed = format.type === 'sets' ? format.setsToWin : format.legsToWin;
    while (score1 < needed && score2 < needed) {
        if (format.type === 'sets') {
            let legs1 = 0, legs2 = 0;
            while (legs1 < format.legsPerSet && legs2 < format.legsPerSet) {
                if (Math.random() < chance) legs1++; else legs2++;
            }
            if (legs1 > legs2) score1++; else score2++;
        } else if (Math.random() < chance) score1++; else score2++;
    }
    const winner = score1 > score2 ? team1 : team2;
    recordWorldCupTeamAverage(team1, getWorldCupSimulatedAverage(team1, winner === team1));
    recordWorldCupTeamAverage(team2, getWorldCupSimulatedAverage(team2, winner === team2));
    finishEditorTeamStateMatch(match, winner.id, score1, score2);
}

function advanceEditorTeamRound() {
    if (typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament)) return completeEditorLeagueMatchday();
    const state = editorTeamState();
    if (!state || state.matches.some(match => !match.played)) return false;
    if (state.phase === 'groups') return completeEditorCompetitionGroups();
    state.history.push({ roundSize: state.roundSize, matches: state.matches.map(match => ({ ...match })) });
    if (state.roundSize === 2) {
        const winner = editorTeamById(state.matches[0].winnerId);
        editorTeamPayout(winner, 2, true);
        if (typeof recordCareerChampion === 'function' && winner) recordCareerChampion(activeTournament,
            activeTournament.editorTeamMode ? winner : winner.players[0]);
        activeTournament.completed = true;
        state.completed = true;
        activeTournament.editorTeamWinner = winner?.country || '';
        activeTournament.historyLogs = `<h3>${escapeHtml(activeTournament.name)} — ${escapeHtml(winner?.country || '')}</h3>`
            + (state.groups ? renderEditorCompetitionGroups(true) : '')
            + state.history.map(round => `<section class="world-cup-previous-round"><h4>${escapeHtml(editorTeamRoundLabel(round.roundSize))}</h4>`
                + round.matches.map(match => `<div class="world-cup-mini-match"><span>${escapeHtml(editorTeamById(match.team1Id)?.country || 'BYE')}</span>`
                    + `<strong>${match.score1 == null ? '—' : `${match.score1}:${match.score2}`}</strong>`
                    + `<span>${escapeHtml(editorTeamById(match.team2Id)?.country || 'BYE')}</span></div>`).join('') + '</section>').join('');
        if (typeof finishTournamentFinances === 'function') finishTournamentFinances(activeTournament);
        const finished = activeTournament;
        activeTournament = null;
        document.getElementById('bracket-modal').style.display = 'none';
        showScreen('screen-hub');
        updateHub();
        if (typeof showTournamentFinanceCompletion === 'function') showTournamentFinanceCompletion(finished);
        if (typeof saveGame === 'function') saveGame(true);
        return true;
    }
    const winners = state.matches.map(match => editorTeamById(match.winnerId));
    state.roundSize /= 2;
    state.matches = Array.from({ length: winners.length / 2 }, (_, index) =>
        createEditorTeamMatch(winners[index * 2], winners[index * 2 + 1], state.roundSize, index));
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function simulateEditorTeamRound(includeCareer = false) {
    if (typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament)) return simulateEditorLeagueMatchday(includeCareer);
    if (typeof simulateEditorCompetitionInBatches === 'function' && activeTournament?.editorStructure) {
        return simulateEditorCompetitionInBatches(includeCareer, false);
    }
    const state = editorTeamState();
    if (!state || state.completed) return false;
    state.matches.filter(match => !match.played).forEach(match => {
        if (!includeCareer && (editorTeamHasCareerPlayer(editorTeamById(match.team1Id))
            || editorTeamHasCareerPlayer(editorTeamById(match.team2Id)))) return;
        simulateEditorTeamMatch(match);
    });
    while (!state.completed && state.matches.every(match => match.played)) advanceEditorTeamRound();
    if (!state.completed) showEditorTeamOverview();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function simulateEditorTeamTournament() {
    if (typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament)) return simulateEditorLeagueMatchday(true);
    if (typeof simulateEditorCompetitionInBatches === 'function' && activeTournament?.editorStructure) {
        return simulateEditorCompetitionInBatches(true, true);
    }
    const state = editorTeamState();
    if (!state) return false;
    for (let safety = 0; !state.completed && safety < 9; safety++) {
        simulateEditorTeamRound(true);
    }
    return state.completed;
}

function startEditorTeamMatch(match) {
    if (!match || match.played || currentMatch || !activeTournament) return false;
    const first = editorTeamById(match.team1Id), second = editorTeamById(match.team2Id);
    if (!first || !second) return false;
    const careerTeam = editorTeamHasCareerPlayer(first) ? first : second;
    if (!editorTeamHasCareerPlayer(careerTeam)) return false;
    if (typeof isPlayerInjured === 'function' && isPlayerInjured(player)) {
        return typeof showPlayerInjuryBlocked === 'function' ? showPlayerInjuryBlocked() : false;
    }
    const opponent = careerTeam === first ? second : first;
    const format = getEditorTeamMatchFormat();
    const starter = Math.random() < 0.5 ? 'p1' : 'p2';
    if (typeof chargeTournamentParticipationStamina === 'function') chargeTournamentParticipationStamina(activeTournament);
    const doubles = careerTeam.players.length === 2;
    currentMatch = { vsAI: true, isTournament: true, isEditorTeamTournament: true, isDoubles: doubles,
        opponent: opponent.players[0], editorTeamMatchId: match.id,
        worldCupTeamP1: careerTeam, worldCupTeamP2: opponent,
        doublesThrower: { p1: Math.max(0, careerTeam.players.findIndex(isCurrentPlayer)), p2: 0 },
        p1Score: 501, p2Score: 501, p1Legs: 0, p2Legs: 0, p1Sets: 0, p2Sets: 0, totalLegsPlayed: 0,
        legsToWin: format.type === 'sets' ? format.legsPerSet : format.legsToWin, matchFormat: format,
        turn: starter, startingPlayer: starter, dartsThrown: 0, isTurnLocked: false,
        p1TurnStartScore: 501, p2TurnStartScore: 501,
        stats: Object.fromEntries(['p1', 'p2'].flatMap(side => ['TotalDarts', 'AccumulatedScore', 'First9Score',
            'First9Darts', 'LegDarts', 'HighCheckout', 'DoubleAttempts', 'DoubleHits', 'OneEighties', 'HundredPlus', 'OneFortyPlus']
            .map(key => [side + key, 0]))) };
    if (typeof prepareMatchBullOff === 'function') prepareMatchBullOff(currentMatch,
        careerTeam.players[currentMatch.doublesThrower.p1], opponent.players[0],
        { p1: careerTeam.country, p2: opponent.country });
    currentTurnScore = 0;
    if (typeof tournamentRound !== 'undefined') tournamentRound = editorTeamState().roundSize;
    document.getElementById('match-log').innerHTML = '';
    drawnDarts = [];
    drawDartboard(); updateDartDots();
    document.getElementById('score-col-ai').style.display = 'flex';
    for (const [side, team] of [['p1', careerTeam], ['p2', opponent]]) {
        document.getElementById(`match-${side}-name`).innerHTML = `${editorTeamFlag(team)} <strong>${escapeHtml(team.country)}</strong>`
            + (doubles ? `<br><small>${escapeHtml(team.players.map(candidate => candidate.name).join(' / '))}</small>` : '');
        const photo = document.getElementById(`score-photo-${side}`);
        photo.src = doubles && team.flagCountry ? getWorldCupFlagUrl(team.flagCountry)
            : (typeof getPlayerProfilePhoto === 'function' ? getPlayerProfilePhoto(team.players[0])
                : team.players[0].photo) || 'https://placehold.co/100/16213e/FFFFFF?text=TEAM';
        photo.classList.toggle('world-cup-flag-photo', doubles && Boolean(team.flagCountry));
    }
    document.getElementById('match-title').textContent = `${activeTournament.name} — ${editorTeamState().phase === 'groups'
        ? `${trEditorStructure('group')} ${editorTeamState().groups[match.groupIndex].label}` : editorTeamState().phase === 'league'
            ? trEditorStructure('matchday', { round: (activeTournament.editorLeagueRound || 0) + 1 }) : editorTeamRoundLabel(editorTeamState().roundSize)}`;
    if (typeof applyMatchPlayerPresentationThemes === 'function') applyMatchPlayerPresentationThemes(player, opponent);
    ['visit', 'leg', 'match'].forEach(item => { document.getElementById(`t-btn-sim-${item}`).style.display = ''; });
    updateScores(); updateMatchStatsUI(); setTurnUI();
    document.getElementById('bracket-modal').style.display = 'none';
    showScreen('screen-match');
    if (typeof showMatchBullOff === 'function') showMatchBullOff();
    return true;
}

function finishEditorTeamTournamentMatch() {
    const state = editorTeamState();
    const match = state?.matches.find(candidate => candidate.id === currentMatch?.editorTeamMatchId);
    if (!match || !currentMatch || match.played) return false;
    const first = currentMatch.worldCupTeamP1, second = currentMatch.worldCupTeamP2;
    const p1 = currentMatch.matchFormat?.type === 'sets' ? currentMatch.p1Sets : currentMatch.p1Legs;
    const p2 = currentMatch.matchFormat?.type === 'sets' ? currentMatch.p2Sets : currentMatch.p2Legs;
    recordWorldCupTeamAverage(first, getPlayedWorldCupAverage(true));
    recordWorldCupTeamAverage(second, getPlayedWorldCupAverage(false));
    const firstWasDrawnFirst = match.team1Id === first.id;
    finishEditorTeamStateMatch(match, p1 > p2 ? first.id : second.id,
        firstWasDrawnFirst ? p1 : p2, firstWasDrawnFirst ? p2 : p1);
    currentMatch = null;
    showScreen('screen-hub');
    if (typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(activeTournament)) {
        if (state.matches.every(candidate => candidate.played)) advanceEditorTeamRound();
    } else while (!state.completed && state.matches.every(candidate => candidate.played)) advanceEditorTeamRound();
    if (activeTournament) showEditorTeamOverview();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}
