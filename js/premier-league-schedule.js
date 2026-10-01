// Eight-player league: two complete round robins in nights 1-7 and 9-15.
// Nights 8 and 16 are the two additional quarter-final rounds.
function getPremierLeagueNightNumber(tournament) {
    const names = [tournament?.sourceName, tournament?.name];
    for (const name of names) {
        const match = String(name || '').match(/(?:global darts league|premier league)\s*[-–]?\s*night\s*(\d+)\b/i);
        if (match) {
            const night = Number(match[1]);
            if (night >= 1 && night <= 16) return night;
        }
    }
    return 0;
}

function getPremierLeaguePlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id != null && candidate.id !== ''
        ? `id:${candidate.id}`
        : `name:${String(candidate.name || '').trim()}|${String(candidate.country || '').trim()}`;
}

function getPremierLeaguePairKey(first, second) {
    return [first, second].sort().join('\u0000');
}

function getPremierLeagueRoundRobinRounds() {
    const rounds = [];
    let positions = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let round = 0; round < 7; round++) {
        rounds.push(Array.from({ length: 4 }, (_, index) => [positions[index], positions[7 - index]]));
        positions = [positions[0], positions[7], ...positions.slice(1, 7)];
    }
    return rounds;
}

const PREMIER_LEAGUE_ROUNDS = getPremierLeagueRoundRobinRounds();

function getPremierLeaguePlannedPairs(night) {
    const round = night <= 7 ? night - 1 : night === 8 ? 3 : night <= 15 ? night - 9 : 0;
    const reverse = night >= 9;
    return PREMIER_LEAGUE_ROUNDS[round].map(([first, second]) => reverse ? [second, first] : [first, second]);
}

function getPremierLeagueRecordedPairs(tournament) {
    if (Array.isArray(tournament?.premierLeagueOpeningPairs)
        && tournament.premierLeagueOpeningPairs.length === 4) {
        return tournament.premierLeagueOpeningPairs.filter(pair => Array.isArray(pair) && pair.length === 2);
    }
    const history = tournament?.matchHistory;
    const opening = history?.blocks?.find(block => block?.type === 'round' && Number(block.round) === 8);
    if (!Array.isArray(opening?.matches) || !Array.isArray(history?.players)) return [];
    return opening.matches.flatMap(match => {
        const first = history.players[match?.[0]]?.[0];
        const second = history.players[match?.[1]]?.[0];
        return first && second ? [[first, second]] : [];
    });
}

function getPremierLeagueHistoricalPairs(tournaments, night) {
    return (Array.isArray(tournaments) ? tournaments : [])
        .map(tournament => ({ tournament, night: getPremierLeagueNightNumber(tournament) }))
        .filter(entry => entry.night > 0 && entry.night < night && entry.tournament.completed)
        .map(entry => ({ night: entry.night, pairs: getPremierLeagueRecordedPairs(entry.tournament) }))
        .filter(entry => entry.pairs.length === 4);
}

function getPremierLeagueAlternativePairs(idealPairs, playerKeys, historicalPairs, night) {
    const counts = new Map();
    const lastPlayed = new Map();
    for (const entry of historicalPairs) for (const pair of entry.pairs) {
        const key = getPremierLeaguePairKey(...pair);
        if (entry.night !== 8 && entry.night !== 16) counts.set(key, (counts.get(key) || 0) + 1);
        lastPlayed.set(key, entry.night);
    }
    const ideal = new Set(idealPairs.map(([first, second]) =>
        getPremierLeaguePairKey(playerKeys[first], playerKeys[second])));
    let best = null;
    let bestCost = Infinity;
    const futureRegularNights = Array.from({ length: Math.max(0, 15 - night) }, (_, index) => night + index + 1)
        .filter(future => future !== 8).length;
    const visit = (remaining, pairs, cost) => {
        if (cost >= bestCost) return;
        if (!remaining.length) {
            const after = new Map(counts);
            if (night !== 8 && night !== 16) for (const [first, second] of pairs) {
                const key = getPremierLeaguePairKey(playerKeys[first], playerKeys[second]);
                after.set(key, (after.get(key) || 0) + 1);
            }
            let shortfall = 0;
            for (let first = 0; first < 8; first++) {
                let capacity = 0;
                for (let second = 0; second < 8; second++) {
                    if (first === second) continue;
                    capacity += Math.max(0, 2 - (after.get(getPremierLeaguePairKey(playerKeys[first], playerKeys[second])) || 0));
                }
                shortfall += Math.max(0, futureRegularNights - capacity);
            }
            const finalCost = cost + shortfall * 2000;
            if (finalCost < bestCost) { best = pairs; bestCost = finalCost; }
            return;
        }
        const first = remaining[0];
        for (const second of remaining.slice(1)) {
            const key = getPremierLeaguePairKey(playerKeys[first], playerKeys[second]);
            const count = counts.get(key) || 0;
            const excess = count >= 2 ? 10000 * (count - 1) : 0;
            const previousNight = lastPlayed.get(key) === night - 1 ? 200 : 0;
            const repeat = count === 1 ? (night <= 7 ? 40 : 4) : 0;
            const deviation = ideal.has(key) ? 0 : 1;
            visit(remaining.filter(index => index !== first && index !== second),
                [...pairs, [first, second]], cost + excess + previousNight + repeat + deviation);
        }
    };
    visit([0, 1, 2, 3, 4, 5, 6, 7], [], 0);
    return best || idealPairs;
}

function buildPremierLeagueNightDraw(tournament, participants, tournaments = []) {
    const night = getPremierLeagueNightNumber(tournament);
    if (!night || !Array.isArray(participants) || participants.length !== 8
        || participants.some(candidate => !candidate)) return null;
    const playerKeys = participants.map(getPremierLeaguePlayerKey);
    if (new Set(playerKeys).size !== 8) return null;
    const idealPairs = getPremierLeaguePlannedPairs(night);
    const historicalPairs = getPremierLeagueHistoricalPairs(tournaments, night);
    const matchesPlan = historicalPairs.every(entry => {
        const planned = getPremierLeaguePlannedPairs(entry.night).map(([first, second]) =>
            getPremierLeaguePairKey(playerKeys[first], playerKeys[second]));
        const recorded = entry.pairs.map(pair => getPremierLeaguePairKey(...pair));
        return planned.every(key => recorded.includes(key));
    });
    const pairings = matchesPlan ? idealPairs
        : getPremierLeagueAlternativePairs(idealPairs, playerKeys, historicalPairs, night);
    tournament.premierLeagueOpeningPairs = pairings.map(([first, second]) =>
        [playerKeys[first], playerKeys[second]]);
    return pairings.flatMap(([first, second]) => [participants[first], participants[second]]);
}
