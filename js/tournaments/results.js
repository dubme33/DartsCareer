const TOURNAMENT_MATCH_HISTORY_VERSION = 1;

function createTournamentMatchHistory() {
    return { version: TOURNAMENT_MATCH_HISTORY_VERSION, players: [], blocks: [] };
}

function hasTournamentMatchHistory(history) {
    return Boolean(history
        && Number(history.version) === TOURNAMENT_MATCH_HISTORY_VERSION
        && Array.isArray(history.players)
        && Array.isArray(history.blocks)
        && history.blocks.length > 0);
}

function normalizeTournamentMatchHistory(history) {
    if (!history || Number(history.version) !== TOURNAMENT_MATCH_HISTORY_VERSION) return null;

    const players = (Array.isArray(history.players) ? history.players : [])
        .filter(entry => Array.isArray(entry) && entry.length >= 2)
        .map(entry => [String(entry[0] || ''), String(entry[1] || '')]);
    const blocks = (Array.isArray(history.blocks) ? history.blocks : []).flatMap(block => {
        if (!block || typeof block !== 'object') return [];
        if (block.type === 'round') {
            const round = Math.max(2, Number(block.round) || 2);
            const matches = (Array.isArray(block.matches) ? block.matches : [])
                .filter(match => Array.isArray(match) && match.length >= 7)
                .map(match => [
                    Math.max(0, Number(match[0]) || 0),
                    Math.max(0, Number(match[1]) || 0),
                    Math.max(0, Number(match[2]) || 0),
                    Math.max(0, Number(match[3]) || 0),
                    Number.isFinite(Number(match[4])) ? Number(match[4]) : 0,
                    Number.isFinite(Number(match[5])) ? Number(match[5]) : 0,
                    Math.max(0, Number(match[6]) || 0)
                ])
                .filter(match => match[0] < players.length && match[1] < players.length);
            return [{ type: 'round', round, matches }];
        }
        if (block.type === 'grandSlamGroups') {
            const groups = (Array.isArray(block.groups) ? block.groups : []).map(group => ({
                label: String(group?.label || ''),
                rows: (Array.isArray(group?.rows) ? group.rows : [])
                    .filter(row => Array.isArray(row) && row.length >= 4)
                    .map(row => [
                        Math.max(0, Number(row[0]) || 0),
                        Math.max(0, Number(row[1]) || 0),
                        Math.max(0, Number(row[2]) || 0),
                        Math.max(0, Number(row[3]) || 0)
                    ])
                    .filter(row => row[0] < players.length)
            }));
            return [{ type: 'grandSlamGroups', groups }];
        }
        return [];
    });

    return { version: TOURNAMENT_MATCH_HISTORY_VERSION, players, blocks };
}

function resetTournamentMatchHistory() {
    tournamentMatchHistory = createTournamentMatchHistory();
    return tournamentMatchHistory;
}

function getTournamentHistoryPlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id
        ? `id:${candidate.id}`
        : `name:${String(candidate.name || '').trim()}|${String(candidate.country || '').trim()}`;
}

function getTournamentHistoryPlayerIndex(candidate, history = tournamentMatchHistory) {
    if (!history || !Array.isArray(history.players) || !candidate) return -1;
    const key = getTournamentHistoryPlayerKey(candidate);
    let index = history.players.findIndex(entry => Array.isArray(entry) && entry[0] === key);
    if (index !== -1) return index;
    history.players.push([key, String(candidate.name || '')]);
    return history.players.length - 1;
}

function appendTournamentHistoryRound(round = tournamentRound) {
    if (!tournamentMatchHistory || typeof tournamentMatchHistory !== 'object') resetTournamentMatchHistory();
    const numericRound = Math.max(2, Number(round) || 2);
    let block = [...tournamentMatchHistory.blocks]
        .reverse()
        .find(candidate => candidate?.type === 'round' && candidate.round === numericRound);
    if (!block) {
        block = { type: 'round', round: numericRound, matches: [] };
        tournamentMatchHistory.blocks.push(block);
    }
    return block;
}

function appendTournamentHistoryMatch({
    p1, p2, score1, score2, average1, average2, careerMatch = false, round = tournamentRound
}) {
    const block = appendTournamentHistoryRound(round);
    const p1Index = getTournamentHistoryPlayerIndex(p1);
    const p2Index = getTournamentHistoryPlayerIndex(p2);
    if (p1Index < 0 || p2Index < 0) return null;

    const compactMatch = [
        p1Index,
        p2Index,
        Math.max(0, Number(score1) || 0),
        Math.max(0, Number(score2) || 0),
        Number.isFinite(Number(average1)) ? Number(Number(average1).toFixed(2)) : 0,
        Number.isFinite(Number(average2)) ? Number(Number(average2).toFixed(2)) : 0,
        careerMatch ? 1 : 0
    ];
    const duplicate = block.matches.some(match => match[0] === p1Index && match[1] === p2Index);
    if (!duplicate) block.matches.push(compactMatch);
    return compactMatch;
}

function appendGrandSlamGroupsToTournamentHistory(groups) {
    if (!Array.isArray(groups)) return null;
    if (!tournamentMatchHistory || typeof tournamentMatchHistory !== 'object') resetTournamentMatchHistory();
    const existing = tournamentMatchHistory.blocks.find(block => block?.type === 'grandSlamGroups');
    if (existing) return existing;

    const block = {
        type: 'grandSlamGroups',
        groups: groups.map(group => ({
            label: String(group?.label || ''),
            rows: (Array.isArray(group?.rows) ? group.rows : []).map(row => [
                getTournamentHistoryPlayerIndex(row.player),
                Math.max(0, Number(row.wins) || 0),
                Math.max(0, Number(row.legsWon) || 0),
                Math.max(0, Number(row.legsLost) || 0)
            ])
        }))
    };
    tournamentMatchHistory.blocks.push(block);
    return block;
}

function escapeTournamentHistoryText(value) {
    if (typeof escapeHtml === 'function') return escapeHtml(String(value ?? ''));
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function getTournamentHistoryPlayerName(history, index) {
    return escapeTournamentHistoryText(history?.players?.[index]?.[1] || '—');
}

function formatTournamentHistoryAverage(value) {
    const average = Number(value);
    return Number.isFinite(average) ? average.toFixed(2) : '0.00';
}

function renderTournamentHistoryRound(history, block) {
    const roundLabel = typeof getRoundName === 'function' ? getRoundName(block.round) : `Round ${block.round}`;
    const averageLabel = typeof t === 'function' ? t('t-avg-short') : 'AVG';
    const matches = block.matches.map(match => {
        const [p1Index, p2Index, score1, score2, average1, average2, flags] = match;
        const p1Won = Number(score1) > Number(score2);
        const p1Style = p1Won ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
        const p2Style = p1Won ? 'color: #bdc3c7; font-weight: normal;' : 'color: #ffffff; font-weight: bold;';
        const careerBackground = (Number(flags) & 1) === 1 ? ' background: rgba(39, 174, 96, 0.2);' : '';
        return `<div style="font-size: 13px; border-bottom: 1px solid #2c3e50; padding: 6px;${careerBackground}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="flex: 1; text-align: right; ${p1Style}">${getTournamentHistoryPlayerName(history, p1Index)}</span>
                <span style="flex: 0 0 50px; text-align: center; color: #f1c40f; font-weight: bold;">${score1}:${score2}</span>
                <span style="flex: 1; text-align: left; ${p2Style}">${getTournamentHistoryPlayerName(history, p2Index)}</span>
            </div>
            <div style="color: #7f8c8d; font-size: 11px; text-align: center; margin-top: 3px;">
                (${escapeTournamentHistoryText(averageLabel)} ${formatTournamentHistoryAverage(average1)} - ${formatTournamentHistoryAverage(average2)})
            </div>
        </div>`;
    }).join('');
    return `<h4 style='color:var(--accent-green); margin:15px 0 5px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 3px;'>${escapeTournamentHistoryText(roundLabel)}</h4>${matches}`;
}

function renderGrandSlamHistoryBlock(history, block) {
    const groupsHtml = block.groups.map(group => {
        const rows = group.rows.map((row, index) =>
            `<div>${index + 1}. ${getTournamentHistoryPlayerName(history, row[0])} — ${row[1]}W, ${row[2]}-${row[3]}</div>`
        ).join('');
        return `<div style="margin:6px 0;"><strong>Grupa ${escapeTournamentHistoryText(group.label)}</strong>${rows}</div>`;
    }).join('');
    return `<h4 style="color:var(--accent-green);">Faza grupowa Grand Slam</h4>${groupsHtml}`;
}

function renderTournamentMatchHistory(history, { currentRoundOnly = false } = {}) {
    if (!hasTournamentMatchHistory(history)) return '';
    const blocks = currentRoundOnly
        ? [history.blocks.filter(block => block?.type === 'round').at(-1)].filter(Boolean)
        : history.blocks;
    return blocks.map(block => {
        if (block.type === 'round') return renderTournamentHistoryRound(history, block);
        if (block.type === 'grandSlamGroups') return renderGrandSlamHistoryBlock(history, block);
        return '';
    }).join('');
}

function finalizeTournamentMatchHistory(tournament, fallbackHtml = typeof lastTournamentResults === 'string' ? lastTournamentResults : '') {
    if (!tournament) return false;
    if (hasTournamentMatchHistory(tournamentMatchHistory)) {
        tournament.matchHistory = tournamentMatchHistory;
        tournament.historyLogs = '';
        return true;
    }
    tournament.historyLogs = fallbackHtml;
    return false;
}

function getCompletedTournamentHistoryHtml(tournament) {
    if (!tournament) return '';
    if (hasTournamentMatchHistory(tournament.matchHistory)) {
        return renderTournamentMatchHistory(tournament.matchHistory);
    }
    return typeof tournament.historyLogs === 'string' ? tournament.historyLogs : '';
}

function restoreActiveTournamentMatchHistory(savedHistory, fallbackLastHtml = '', fallbackRoundHtml = '') {
    tournamentMatchHistory = normalizeTournamentMatchHistory(savedHistory);
    if (hasTournamentMatchHistory(tournamentMatchHistory)) {
        lastTournamentResults = renderTournamentMatchHistory(tournamentMatchHistory);
        currentRoundHTML = renderTournamentMatchHistory(tournamentMatchHistory, { currentRoundOnly: true });
    } else {
        lastTournamentResults = typeof fallbackLastHtml === 'string' ? fallbackLastHtml : '';
        currentRoundHTML = typeof fallbackRoundHtml === 'string' ? fallbackRoundHtml : '';
    }
    return tournamentMatchHistory;
}

function showRoundResults() {
            document.getElementById('t-tour-end-title').innerText = t('t-round-results');
            document.getElementById('results-content').innerHTML = currentRoundHTML;
            document.getElementById('t-btn-next-round').style.display = 'block';
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
            const playerStillInTournament = Array.isArray(tournamentBracket)
                && tournamentBracket.some(candidate => typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate));
            if (simulateTournamentButton) {
                simulateTournamentButton.style.display = activeTournament && tournamentBracket.length > 1 && !playerStillInTournament
                    ? 'block'
                    : 'none';
            }
            document.getElementById('t-btn-tour-back').style.display = 'none';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function showTournamentEnd() {
            document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
            document.getElementById('results-content').innerHTML = lastTournamentResults;
            document.getElementById('t-btn-next-round').style.display = 'none';
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
            if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
            document.getElementById('t-btn-tour-back').style.display = 'block';
            document.getElementById('results-modal').style.display = 'flex';
        }

        function showCompletedTournamentResults(tournament) {
            const historyHtml = getCompletedTournamentHistoryHtml(tournament);
            if (!historyHtml) return false;
            document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
            document.getElementById('results-content').innerHTML = historyHtml;
            document.getElementById('t-btn-next-round').style.display = 'none';
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament-results');
            if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
            document.getElementById('t-btn-tour-back').style.display = 'block';
            document.getElementById('results-modal').style.display = 'flex';
            return true;
        }

        function proceedToNextRound() {
            document.getElementById('results-modal').style.display = 'none';
            showBracket();
        }
        
        
