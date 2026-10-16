/* Current-set averages share the live match's scored points and dart totals. */
function getMatchAverageTotals(match, side) {
    const stats = match?.stats;
    if (!stats || !['p1', 'p2'].includes(side)) return null;
    const accumulated = Number(stats[`${side}AccumulatedScore`]), remaining = Number(match[`${side}Score`]);
    const darts = Number(stats[`${side}TotalDarts`]);
    if (![accumulated, remaining, darts].every(Number.isFinite) || accumulated < 0 || remaining < 0 || remaining > 501 || darts < 0) return null;
    return { points: accumulated + 501 - remaining, darts };
}

function beginMatchSetAverage(match) {
    if (match?.matchFormat?.type !== 'sets') return null;
    const p1 = getMatchAverageTotals(match, 'p1'), p2 = getMatchAverageTotals(match, 'p2');
    if (!p1 || !p2) return null;
    match.setAverageStart = { p1, p2 };
    return match.setAverageStart;
}

function ensureMatchSetAverage(match) {
    if (match?.matchFormat?.type !== 'sets' || !match.stats) return null;
    if (Object.hasOwn(match, 'setAverageStart')) return match.setAverageStart;
    const completedSets = (Number(match.p1Sets) || 0) + (Number(match.p2Sets) || 0);
    if (!completedSets) {
        match.setAverageStart = { p1: { points: 0, darts: 0 }, p2: { points: 0, darts: 0 } };
    } else if (!match.p1Legs && !match.p2Legs && match.p1Score === 501 && match.p2Score === 501
        && !match.stats.p1LegDarts && !match.stats.p2LegDarts) {
        beginMatchSetAverage(match);
    } else {
        // A match without the start totals cannot reconstruct an earlier set.
        // Show no invented average until the next complete set starts.
        match.setAverageStart = null;
    }
    return match.setAverageStart;
}

function getMatchSetAverage(match, side) {
    const start = ensureMatchSetAverage(match)?.[side], totals = getMatchAverageTotals(match, side);
    if (!start || !totals || !Number.isFinite(start.points) || !Number.isFinite(start.darts)
        || start.points < 0 || start.darts < 0 || totals.points < start.points || totals.darts < start.darts) return null;
    const darts = totals.darts - start.darts;
    return darts > 0 ? (totals.points - start.points) * 3 / darts : 0;
}

function getMatchSetAverageText(match, side) {
    const average = getMatchSetAverage(match, side);
    return average === null ? '—' : average.toFixed(2);
}
