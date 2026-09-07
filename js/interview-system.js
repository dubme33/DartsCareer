function getInterviewPlayerKey(candidate) {
    if (!candidate) return '';
    if (typeof getCareerRecordPlayerKey === 'function') return getCareerRecordPlayerKey(candidate);
    return String(candidate.id || `${candidate.sourceName || candidate.name || ''}|${candidate.country || ''}`);
}

function getInterviewOpponentWorldTitles(opponent) {
    const empty = { count: 0, reigning: false };
    if (!opponent || typeof getCareerChampions !== 'function') return empty;
    const events = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase : [];
    const worldEvent = events.find(event => !event?.qualifierFor
        && /world darts championship|global darts championship/i.test(`${event?.name || ''} ${event?.sourceName || ''}`));
    if (!worldEvent) return empty;

    try {
        if (typeof initializeCareerRecords === 'function') initializeCareerRecords();
        const editions = getCareerChampions(worldEvent)?.editions || [];
        const opponentKey = getInterviewPlayerKey(opponent);
        const belongsToOpponent = champion => {
            if (champion?.team) return false;
            if (champion?.id && opponent.id) return String(champion.id) === String(opponent.id);
            if (champion?.key && opponentKey) return String(champion.key) === opponentKey;
            return champion?.name === opponent.name && (champion?.country || '') === (opponent.country || '');
        };
        const titles = editions.filter(belongsToOpponent);
        return { count: titles.length, reigning: editions.length > 0 && belongsToOpponent(editions[0]) };
    } catch (_) {
        // Brak lub niepełne archiwum tytułów oznacza brak potwierdzenia,
        // nigdy domysł o mistrzostwie rywala.
        return empty;
    }
}

function buildPostMatchInterviewContext(match, tournament, round) {
    if (!match || !match.stats || !match.opponent) return null;
    const stats = match.stats;
    const isSets = match.matchFormat?.type === 'sets';
    const playerScore = Number(isSets ? match.p1Sets : match.p1Legs);
    const opponentScore = Number(isSets ? match.p2Sets : match.p2Legs);
    if (!Number.isFinite(playerScore) || !Number.isFinite(opponentScore)) return null;

    const totalPoints = (Number(stats.p1AccumulatedScore) || 0) + Math.max(0, 501 - (Number(match.p1Score) || 0));
    const totalDarts = Number(stats.p1TotalDarts) || 0;
    const matchAverageValue = totalDarts > 0 ? totalPoints / totalDarts * 3 : 0;
    const doubleMisses = Math.max(0, (Number(stats.p1DoubleAttempts) || 0) - (Number(stats.p1DoubleHits) || 0));
    const oneEighties = Math.max(0, Number(stats.p1OneEighties) || 0);
    const totalLegs = Math.max(0, Number(match.totalLegsPlayed) || 0);
    const won = playerScore > opponentScore;
    const progression = !isSets && Array.isArray(match.interviewLegScores)
        ? match.interviewLegScores.filter(score => Number.isInteger(score?.p1) && Number.isInteger(score?.p2)) : [];
    const comebackScore = progression.reduce((deepest, score) => {
        const deficit = score.p2 - score.p1;
        return deficit > (deepest?.deficit || 0) ? { ...score, deficit } : deepest;
    }, null);
    const worldTitles = getInterviewOpponentWorldTitles(match.opponent);
    const playedRound = Number(round);

    const context = {
        opponent: match.opponent.name || '',
        finalScore: `${playerScore}:${opponentScore}`,
        playerScore,
        opponentScore,
        scoreType: isSets ? 'sets' : 'legs',
        matchAverage: matchAverageValue.toFixed(2),
        matchAverageValue,
        missedDoubles: doubleMisses,
        oneEighties,
        totalLegs,
        trailScore: comebackScore ? `${comebackScore.p1}:${comebackScore.p2}` : '',
        tournament: tournament?.name || '',
        round: Number.isFinite(playedRound) ? playedRound : null,
        flags: {}
    };
    context.flags = {
        verified_summary: won,
        high_avg_105: won && matchAverageValue > 105,
        reigning_world_champion: won && worldTitles.reigning,
        multi_world_champion: won && worldTitles.count >= 2,
        reached_final: won && playedRound === 4,
        bad_doubles: won && doubleMisses >= 8,
        nine_darter: won && Boolean(match.interviewFacts?.nineDarter || (stats.p1LegDarts === 9 && match.p1Score === 0)),
        comeback: won && !isSets && Boolean(comebackScore && comebackScore.deficit >= 2),
        many_180s: won && oneEighties >= 5,
        low_avg: won && totalDarts > 0 && matchAverageValue < 85,
        big_fish: won && Number(stats.p1HighCheckout) === 170,
        whitewash: won && !isSets && opponentScore === 0
    };
    return context;
}

function getVerifiedPostMatchInterviews(database, context) {
    if (!Array.isArray(database) || !context?.flags) return [];
    return database.filter(interview => interview?.trigger
        && interview.trigger !== 'unverified'
        && context.flags[interview.trigger] === true);
}

function formatPostMatchInterviewText(template, context) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => context?.[key] ?? `{${key}}`);
}
