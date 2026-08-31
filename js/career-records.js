// Stored on the career player, independently of annual calendar/stat resets.
function getCareerRecordPlayerKey(candidate) {
    return String(candidate?.id || `${candidate?.sourceName || candidate?.name || ''}|${candidate?.country || ''}`);
}

function getCareerRecordTournament(tournament) {
    const name = tournament?.sourceName || tournament?.name || '';
    const normalize = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
    return (typeof tournamentDatabase !== 'undefined' ? tournamentDatabase : []).find(event =>
        [event.name, event.sourceName].some(alias => alias && normalize(alias) === normalize(name))) || tournament;
}

function isCareerChampionship(tournament) {
    const event = getCareerRecordTournament(tournament);
    return Boolean(event?.name) && !event.qualifierFor
        && !/qualif|kwalifikac|q.?school|pro card trials|night\s*\d|wiecz[oó]r\s*\d/i.test(`${event.name} ${event.sourceName || ''} ${event.specialType || ''}`);
}

function isCareerTeamChampionship(tournament) {
    const event = getCareerRecordTournament(tournament);
    return event?.isDoubles || event?.specialType === 'worldCup'
        || /puchar narodów|world cup|nations cup/i.test(`${event?.name} ${event?.sourceName || ''}`);
}

function initializeCareerRecords(reset = false) {
    if (typeof player === 'undefined' || !player) return null;
    if (!reset && player.careerRecords?.version === 1) return player.careerRecords;
    const records = player.careerRecords = { version: 1, tournaments: {}, headToHead: {} };
    if (reset) return records;
    // Import only dated wins. Totals with unknown years cannot identify an edition.
    getCareerProfilePlayers().forEach(candidate => {
        getPlayerCareerTitles(candidate).forEach(title => {
            Object.entries(title.winsByYear || {}).forEach(([year, count]) => {
                if (count > 0) recordCareerChampion(title, candidate, Number(year), true);
            });
        });
        (candidate.seasonStats?.results || []).forEach(result => {
            if (!result.won) return;
            const year = result.timestamp > 0 ? new Date(result.timestamp).getFullYear() : Number(candidate.seasonStats.year);
            recordCareerChampion({ name: result.tournament, sourceName: result.sourceTournament,
                specialType: result.tournamentSpecialType }, candidate, year, true);
        });
    });
    const seen = new Set();
    const candidates = getCareerProfilePlayers();
    candidates.forEach(candidate => {
        getRecentPlayerMatches(candidate).forEach(match => {
            if (!match.key || seen.has(match.key)) return;
            const opponent = candidates.find(other => match.opponentId
                ? String(other.id) === String(match.opponentId)
                : other.name === match.opponentName && (other.country || '') === (match.opponentCountry || ''));
            if (!opponent) return;
            seen.add(match.key);
            recordCareerHeadToHead(candidate, opponent, match.scoreFor, match.scoreAgainst, match.key, match.timestamp);
        });
    });
    return records;
}

function recordCareerChampion(tournament, winner, year = getCurrentSeasonYear(), migrating = false) {
    if (!winner || !Number.isInteger(year) || year < 1900 || year > getCurrentSeasonYear() || !isCareerChampionship(tournament)) return;
    const records = initializeCareerRecords();
    if (!records) return;
    const event = getCareerRecordTournament(tournament);
    const team = isCareerTeamChampionship(event);
    if (team && !winner.country) return;
    const key = getPlayerCareerTitleData(event).key;
    const eventKey = JSON.stringify(key);
    const entry = records.tournaments[eventKey] ||= { ...getPlayerCareerTitleData(event), editions: {}, conflicts: [] };
    const champion = { key: team ? `team:${winner.country}` : getCareerRecordPlayerKey(winner),
        id: team ? '' : (winner.id || ''), name: team ? winner.country : winner.name,
        country: winner.country || '', team: Boolean(team) };
    if (team) champion.members = (winner.players || [winner]).map(member => typeof member === 'string' ? member : member.name).filter(Boolean);
    const previous = entry.editions[year];
    if (migrating && (entry.conflicts.includes(year) || (previous && previous.key !== champion.key))) {
        delete entry.editions[year];
        if (!entry.conflicts.includes(year)) entry.conflicts.push(year);
        return;
    }
    if (team && previous?.key === champion.key) champion.members = [...new Set([...(previous.members || []), ...champion.members])];
    entry.editions[year] = champion;
    if (!migrating) entry.conflicts = entry.conflicts.filter(value => value !== year);
}

function getCareerChampions(tournament) {
    const key = getPlayerCareerTitleData(getCareerRecordTournament(tournament)).key;
    const entry = player?.careerRecords?.tournaments?.[JSON.stringify(key)];
    const editions = Object.entries(entry?.editions || {}).map(([year, champion]) => ({ year: Number(year), ...champion }))
        .sort((a, b) => b.year - a.year);
    const counts = new Map();
    editions.forEach(champion => {
        const current = counts.get(champion.key) || { ...champion, count: 0 };
        current.count++;
        counts.set(champion.key, current);
    });
    const best = Math.max(0, ...[...counts.values()].map(champion => champion.count));
    return { editions, leaders: [...counts.values()].filter(champion => champion.count === best) };
}

function recordCareerHeadToHead(first, second, score1, score2, matchKey, timestamp = currentDate.getTime()) {
    if (!Number.isInteger(score1) || !Number.isInteger(score2) || score1 < 0 || score2 < 0 || score1 === score2 || !matchKey) return;
    const keys = [getCareerRecordPlayerKey(first), getCareerRecordPlayerKey(second)].sort();
    if (keys[0] === keys[1]) return;
    const records = initializeCareerRecords();
    if (!records) return;
    const entry = records.headToHead[JSON.stringify(keys)] ||= { wins: [0, 0], lastKey: '', since: timestamp };
    if (entry.lastKey === matchKey) return;
    const winnerKey = getCareerRecordPlayerKey(score1 > score2 ? first : second);
    entry.wins[keys.indexOf(winnerKey)]++;
    entry.since = Math.min(entry.since, timestamp);
    // Official match-stat keys already guard retries throughout the season.
    // Retain only the latest key; do not duplicate an entire match log per pair.
    entry.lastKey = matchKey;
}

function getCareerHeadToHead(first, second) {
    const firstKey = getCareerRecordPlayerKey(first), secondKey = getCareerRecordPlayerKey(second);
    const keys = [firstKey, secondKey].sort();
    if (firstKey === secondKey) return { wins: 0, losses: 0, matches: 0 };
    const entry = player?.careerRecords?.headToHead?.[JSON.stringify(keys)];
    let wins = entry?.wins[keys.indexOf(firstKey)] || 0;
    let losses = entry?.wins[keys.indexOf(secondKey)] || 0;
    // Older careers already keep the career player's full rivalry totals.
    const ownKey = getCareerRecordPlayerKey(player);
    const rivalry = player?.rivalries?.[firstKey === ownKey ? second.id : secondKey === ownKey ? first.id : ''];
    if (rivalry && Number(rivalry.matches) > wins + losses) {
        wins = Number(firstKey === ownKey ? rivalry.wins : rivalry.losses) || 0;
        losses = Number(firstKey === ownKey ? rivalry.losses : rivalry.wins) || 0;
    }
    return { wins, losses, matches: wins + losses };
}

function getPlayerComparisonStats(candidate) {
    const stats = Number(candidate?.seasonStats?.year) === getCurrentSeasonYear() ? candidate.seasonStats.matchStats : null;
    const recent = getRecentPlayerMatches(candidate);
    // Legacy title normalization operates on a copy: browsing must not reset stats.
    const titles = getPlayerCareerTitles({ careerTitlesVersion: candidate.careerTitlesVersion,
        careerTitles: JSON.parse(JSON.stringify(candidate.careerTitles || [])),
        careerStats: candidate.careerStats, careerChronicle: candidate.careerChronicle,
        seasonStats: { results: (candidate.seasonStats?.results || []).map(result => ({ ...result })) } });
    return { stats, recent, titleCount: titles.reduce((sum, title) => sum + title.count, 0),
        average: stats?.averageCount > 0 ? stats.averageTotal / stats.averageCount : null,
        checkout: stats?.doubleMatches > 0 && stats.doubleAttempts > 0 ? stats.doubleHits / stats.doubleAttempts * 100 : null,
        oneEighties: stats?.oneEightyMatches > 0 ? stats.oneEighties : null };
}
