let grandSlamState = null;

const GRAND_SLAM_FORMAT_VERSION = 2;
const GRAND_SLAM_KNOCKOUT_SEED_ORDER = [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11];

function isGrandSlamTournament(tournament = activeTournament) {
    // Nazwa kwalifikatora z moda również zawiera „Grand Slam”. Typ i
    // powiązanie z turniejem mają pierwszeństwo przed samą etykietą.
    if (!tournament || tournament.qualifierFor || tournament.specialType === 'pdcTourCardQualifier') return false;
    const name = `${tournament.name || ''} ${tournament.sourceName || ''}`.toLocaleLowerCase('pl');
    return name.includes('grand slam') || name.includes("champion's slam");
}

function getGrandSlamTournamentKey(tournament = activeTournament) {
    if (!isGrandSlamTournament(tournament)) return '';
    const year = currentDate instanceof Date && !Number.isNaN(currentDate.getTime()) ? currentDate.getFullYear() : '';
    return `${year}|${tournament.name}|${tournament.month}|${tournament.day}`;
}

function resetGrandSlamState() {
    grandSlamState = null;
}

function getGrandSlamGroupMatchFormat() {
    return { type: 'legs', legsToWin: 5 };
}

function getGrandSlamGroupLabel(index) {
    return String.fromCharCode(65 + index);
}

function createGrandSlamGroupState(participants, tournament = activeTournament) {
    const rankedParticipants = [...participants]
        .filter(candidate => candidate && !candidate.isBye)
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0)
            || (Number(second.ovr) || 0) - (Number(first.ovr) || 0));

    if (rankedParticipants.length < 48) return null;

    const field = rankedParticipants.slice(0, 48);
    const groups = Array.from({ length: 16 }, (_, index) => ({
        label: getGrandSlamGroupLabel(index),
        members: [field[index], field[index + 16], field[index + 32]],
        seedRanks: [index + 1, index + 17, index + 33],
        matches: [
            { p1Index: 0, p2Index: 1, played: false, winnerIndex: null, score1: null, score2: null },
            { p1Index: 0, p2Index: 2, played: false, winnerIndex: null, score1: null, score2: null },
            { p1Index: 1, p2Index: 2, played: false, winnerIndex: null, score1: null, score2: null }
        ],
        standings: []
    }));

    return {
        version: GRAND_SLAM_FORMAT_VERSION,
        tournamentKey: getGrandSlamTournamentKey(tournament),
        phase: 'groups',
        groups,
        knockoutParticipantKeys: []
    };
}

function getGrandSlamGroupStandings(group) {
    if (!group || !Array.isArray(group.members)) return [];

    const standings = group.members.map((candidate, memberIndex) => ({
        memberIndex,
        wins: 0,
        legsWon: 0,
        legsLost: 0,
        seedRank: Number(group.seedRanks?.[memberIndex]) || 99
    }));

    (group.matches || []).filter(match => match.played).forEach(match => {
        const first = standings[match.p1Index];
        const second = standings[match.p2Index];
        if (!first || !second) return;
        const score1 = Math.max(0, Number(match.score1) || 0);
        const score2 = Math.max(0, Number(match.score2) || 0);
        first.legsWon += score1;
        first.legsLost += score2;
        second.legsWon += score2;
        second.legsLost += score1;
        if (match.winnerIndex === match.p1Index) first.wins++;
        if (match.winnerIndex === match.p2Index) second.wins++;
    });

    return standings.sort((first, second) => second.wins - first.wins
        || (second.legsWon - second.legsLost) - (first.legsWon - first.legsLost)
        || second.legsWon - first.legsWon
        || first.seedRank - second.seedRank);
}

function updateGrandSlamGroupStandings(group) {
    const standings = getGrandSlamGroupStandings(group);
    group.standings = standings;
    return standings;
}

function recordGrandSlamGroupMatch(groupIndex, matchIndex, p1Won, score1, score2) {
    const group = grandSlamState?.groups?.[groupIndex];
    const match = group?.matches?.[matchIndex];
    if (!group || !match || match.played) return false;

    match.played = true;
    match.winnerIndex = p1Won ? match.p1Index : match.p2Index;
    match.score1 = Math.max(0, Number(score1) || 0);
    match.score2 = Math.max(0, Number(score2) || 0);
    updateGrandSlamGroupStandings(group);
    return true;
}

function getPendingGrandSlamCareerMatch() {
    if (!grandSlamState || grandSlamState.phase !== 'groups') return null;

    for (let groupIndex = 0; groupIndex < grandSlamState.groups.length; groupIndex++) {
        const group = grandSlamState.groups[groupIndex];
        for (let matchIndex = 0; matchIndex < group.matches.length; matchIndex++) {
            const match = group.matches[matchIndex];
            if (match.played) continue;
            const p1 = group.members[match.p1Index];
            const p2 = group.members[match.p2Index];
            if (isCurrentPlayer(p1) || isCurrentPlayer(p2)) {
                return { groupIndex, matchIndex, group, match, p1, p2 };
            }
        }
    }
    return null;
}

function simulateGrandSlamAiGroupMatches(includeCareerPlayer = false) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return 0;
    const matches = iterateGrandSlamAiGroupMatches(includeCareerPlayer);
    let step = matches.next();
    while (!step.done) step = matches.next();
    return step.value;
}

function* iterateGrandSlamAiGroupMatches(includeCareerPlayer = false) {
    if (!grandSlamState || grandSlamState.phase !== 'groups') return 0;
    let simulated = 0;

    for (const [groupIndex, group] of grandSlamState.groups.entries()) {
        for (const [matchIndex, match] of group.matches.entries()) {
            if (match.played) continue;
            const p1 = group.members[match.p1Index];
            const p2 = group.members[match.p2Index];
            if (!includeCareerPlayer && (isCurrentPlayer(p1) || isCurrentPlayer(p2))) continue;

            const result = simulateAImatch(p1, p2, getGrandSlamGroupMatchFormat());
            recordGrandSlamGroupMatch(groupIndex, matchIndex, result.winner === p1, result.p1Score, result.p2Score);
            simulated++;
            yield;
        }
    }
    return simulated;
}

function areGrandSlamGroupsComplete() {
    return Boolean(grandSlamState && grandSlamState.groups.every(group => group.matches.every(match => match.played)));
}

function completeGrandSlamGroupStage() {
    if (!areGrandSlamGroupsComplete()) return null;

    const winnersBySeed = new Map();
    grandSlamState.groups.forEach((group, index) => {
        const winner = updateGrandSlamGroupStandings(group)[0];
        if (winner) winnersBySeed.set(index + 1, group.members[winner.memberIndex]);
    });
    if (winnersBySeed.size !== 16) return null;

    const knockoutParticipants = GRAND_SLAM_KNOCKOUT_SEED_ORDER.map(seed => winnersBySeed.get(seed));
    if (knockoutParticipants.some(candidate => !candidate)) return null;

    grandSlamState.phase = 'knockout';
    grandSlamState.knockoutParticipantKeys = knockoutParticipants.map(candidate => candidate.id || `${candidate.name}|${candidate.country}`);
    tournamentBracket = knockoutParticipants;
    tournamentRound = 16;
    return knockoutParticipants;
}

function appendGrandSlamGroupResultsToHistory() {
    if (!grandSlamState || grandSlamState.historyRecorded) return;
    const historyGroups = grandSlamState.groups.map(group => ({
        label: group.label,
        rows: getGrandSlamGroupStandings(group).map(row => {
            const candidate = group.members[row.memberIndex];
            return { player: candidate, wins: row.wins, legsWon: row.legsWon, legsLost: row.legsLost };
        })
    }));
    if (typeof appendGrandSlamGroupsToTournamentHistory === 'function') {
        appendGrandSlamGroupsToTournamentHistory(historyGroups);
    }
    const groupsHtml = historyGroups.map(group => {
        const rows = group.rows.map((row, index) =>
            `<div>${index + 1}. ${escapeHtml(row.player.name)} — ${row.wins}W, ${row.legsWon}-${row.legsLost}</div>`
        ).join('');
        return `<div style="margin:6px 0;"><strong>Grupa ${group.label}</strong>${rows}</div>`;
    }).join('');
    lastTournamentResults += `<h4 style="color:var(--accent-green);">Faza grupowa Grand Slam</h4>${groupsHtml}`;
    grandSlamState.historyRecorded = true;
}

function initializeGrandSlamTournament(participants, simulateEntireGroupStage = false) {
    const initialization = iterateGrandSlamInitialization(participants, simulateEntireGroupStage);
    let step = initialization.next();
    while (!step.done) step = initialization.next();
    return step.value;
}

function* iterateGrandSlamInitialization(participants, simulateEntireGroupStage = false) {
    const tournamentKey = getGrandSlamTournamentKey();
    if (!grandSlamState || grandSlamState.tournamentKey !== tournamentKey || grandSlamState.phase === 'completed') {
        grandSlamState = createGrandSlamGroupState(participants);
    }
    if (!grandSlamState) return null;

    if (grandSlamState.phase === 'groups') {
        yield* iterateGrandSlamAiGroupMatches(simulateEntireGroupStage);
        if (areGrandSlamGroupsComplete()) {
            const knockoutParticipants = completeGrandSlamGroupStage();
            appendGrandSlamGroupResultsToHistory();
            return { phase: 'knockout', participants: knockoutParticipants };
        }
    }

    return { phase: grandSlamState.phase, participants: grandSlamState.phase === 'knockout' ? tournamentBracket : [] };
}

function isGrandSlamGroupStageActive(tournament = activeTournament) {
    return Boolean(isGrandSlamTournament(tournament)
        && grandSlamState?.phase === 'groups'
        && grandSlamState.tournamentKey === getGrandSlamTournamentKey(tournament));
}

function shouldRefreshGrandSlamOpeningDraw(tournament = activeTournament) {
    return Boolean(isGrandSlamTournament(tournament)
        && !grandSlamState
        && tournamentRound === 32
        && tournamentBracket?.length === 32);
}

function simulateGrandSlamRemainingAiGroupMatches() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    simulateGrandSlamAiGroupMatches(false);
    if (areGrandSlamGroupsComplete()) {
        const knockoutParticipants = completeGrandSlamGroupStage();
        appendGrandSlamGroupResultsToHistory();
        if (knockoutParticipants) {
            alert('Faza grupowa Grand Slam zakończona. Zwycięzcy grup awansowali do Last 16.');
            showBracket();
            saveGame(true);
            return;
        }
    }
    showGrandSlamGroups();
    saveGame(true);
}

function startGrandSlamCareerGroupMatch() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    const pending = getPendingGrandSlamCareerMatch();
    if (!pending) return;

    const opponent = isCurrentPlayer(pending.p1) ? pending.p2 : pending.p1;
    tournamentBracket = [player, opponent];
    tournamentRound = 32;
    document.getElementById('bracket-modal').style.display = 'none';
    startTournamentMatch();
    if (currentMatch) {
        currentMatch.grandSlamGroupMatch = { groupIndex: pending.groupIndex, matchIndex: pending.matchIndex };
    }
}

function isGrandSlamCareerGroupMatch(match = currentMatch) {
    return Boolean(match?.grandSlamGroupMatch && grandSlamState?.phase === 'groups');
}

function finishGrandSlamCareerGroupMatch(playerWon, match = currentMatch) {
    const pending = match?.grandSlamGroupMatch;
    if (!pending || !grandSlamState || grandSlamState.phase !== 'groups') return null;

    const groupMatch = grandSlamState.groups[pending.groupIndex]?.matches?.[pending.matchIndex];
    const originalP1 = groupMatch ? grandSlamState.groups[pending.groupIndex].members[groupMatch.p1Index] : null;
    const originalP1IsCareerPlayer = isCurrentPlayer(originalP1);
    recordGrandSlamGroupMatch(
        pending.groupIndex,
        pending.matchIndex,
        originalP1IsCareerPlayer ? playerWon : !playerWon,
        originalP1IsCareerPlayer ? match.p1Legs : match.p2Legs,
        originalP1IsCareerPlayer ? match.p2Legs : match.p1Legs
    );
    tournamentBracket = [];
    simulateGrandSlamAiGroupMatches(false);

    if (!areGrandSlamGroupsComplete()) return { phase: 'groups' };

    const knockoutParticipants = completeGrandSlamGroupStage();
    appendGrandSlamGroupResultsToHistory();
    return {
        phase: 'knockout',
        playerAdvanced: knockoutParticipants?.some(isCurrentPlayer),
        participants: knockoutParticipants
    };
}

function renderGrandSlamGroup(group) {
    const standings = getGrandSlamGroupStandings(group);
    const rows = standings.map((row, index) => {
        const candidate = group.members[row.memberIndex];
        const isCareerPlayer = isCurrentPlayer(candidate);
        return `<div style="display:grid; grid-template-columns:24px 1fr 38px 52px; gap:6px; padding:3px 0; ${isCareerPlayer ? 'color:var(--accent-green); font-weight:bold;' : ''}">
            <span>${index + 1}.</span><span>${getFlagImg(candidate.country)} ${escapeHtml(candidate.name)}</span><span>${row.wins}W</span><span>${row.legsWon}-${row.legsLost}</span>
        </div>`;
    }).join('');
    const matches = group.matches.map(match => {
        const p1 = group.members[match.p1Index];
        const p2 = group.members[match.p2Index];
        const score = match.played ? `${match.score1}:${match.score2}` : '—';
        return `<div style="font-size:11px; color:#bdc3c7;">${escapeHtml(p1.name)} <strong>${score}</strong> ${escapeHtml(p2.name)}</div>`;
    }).join('');
    return `<section style="background:#16213e; border:1px solid #2c3e50; border-radius:6px; padding:9px; margin:6px 0;">
        <h4 style="margin:0 0 5px; color:var(--accent-yellow);">Grupa ${group.label}</h4>${rows}<div style="border-top:1px solid #2c3e50; margin-top:5px; padding-top:4px;">${matches}</div>
    </section>`;
}

function showGrandSlamGroups() {
    if (!isGrandSlamGroupStageActive()) return false;
    const pending = getPendingGrandSlamCareerMatch();
    const hasAiMatches = grandSlamState.groups.some(group => group.matches.some(match => {
        if (match.played) return false;
        return !isCurrentPlayer(group.members[match.p1Index]) && !isCurrentPlayer(group.members[match.p2Index]);
    }));

    const title = document.getElementById('bracket-title');
    const list = document.getElementById('bracket-list');
    const playButton = document.getElementById('t-btn-play-match');
    const simulateButton = document.getElementById('t-btn-sim-round');
    const simulateTournamentButton = document.getElementById('t-btn-sim-tournament');
    title.innerText = `🏆 ${activeTournament.name} — Faza grupowa`;
    list.innerHTML = `<p style="margin:0 0 10px; color:#bdc3c7;">16 grup po 3 zawodników. Awans uzyskuje wyłącznie zwycięzca każdej grupy.</p>${grandSlamState.groups.map(renderGrandSlamGroup).join('')}`;

    playButton.onclick = startGrandSlamCareerGroupMatch;
    playButton.innerText = pending ? `Zagraj: Grupa ${pending.group.label}` : 'Brak meczu gracza';
    playButton.style.display = pending ? 'block' : 'none';
    simulateButton.onclick = simulateGrandSlamRemainingAiGroupMatches;
    simulateButton.innerText = 'Symuluj mecze AI w grupach';
    simulateButton.style.display = hasAiMatches ? 'block' : 'none';
    if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
    document.getElementById('bracket-modal').style.display = 'flex';
    return true;
}

function getGrandSlamStateForSave() {
    if (!grandSlamState) return null;
    const saveReference = candidate => typeof getPlayerSaveReference === 'function'
        ? getPlayerSaveReference(candidate)
        : candidate;
    return {
        ...grandSlamState,
        groups: grandSlamState.groups.map(group => ({
            ...group,
            members: group.members.map(saveReference),
            matches: group.matches.map(match => ({ ...match })),
            standings: (group.standings || []).map(row => ({ ...row }))
        }))
    };
}

function restoreGrandSlamState(savedState) {
    if (!savedState || typeof savedState !== 'object' || !Array.isArray(savedState.groups)) {
        grandSlamState = null;
        return null;
    }

    const resolveCandidate = candidate => typeof resolveLoadedPlayer === 'function'
        ? resolveLoadedPlayer(candidate)
        : candidate;
    const groups = savedState.groups.map(group => ({
        ...group,
        members: Array.isArray(group.members) ? group.members.map(resolveCandidate).filter(Boolean) : [],
        matches: Array.isArray(group.matches) ? group.matches.map(match => ({ ...match })) : [],
        standings: Array.isArray(group.standings) ? group.standings.map(row => ({ ...row })) : []
    })).filter(group => group.members.length === 3 && group.matches.length === 3);

    if (groups.length !== 16) {
        grandSlamState = null;
        return null;
    }
    grandSlamState = { ...savedState, version: GRAND_SLAM_FORMAT_VERSION, groups };
    return grandSlamState;
}
