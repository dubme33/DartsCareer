// Opening doubles are measured separately from checkout doubles, without RNG.
const MATCH_DOUBLE_IN_COPY = {
    pl: { label: 'Skuteczność wejść (Double-in)', attempts: 'Wejścia / próby', unknown: 'Brak pełnych danych o wejściach w tym meczu.' },
    en: { label: 'Double-in success', attempts: 'Entries / attempts', unknown: 'Complete opening-double data is unavailable for this match.' },
    de: { label: 'Double-in-Quote', attempts: 'Eröffnungen / Versuche', unknown: 'Keine vollständigen Eröffnungsdaten für dieses Spiel.' },
    nl: { label: 'Double-in-percentage', attempts: 'Starts / pogingen', unknown: 'Geen volledige openingsgegevens voor deze wedstrijd.' }
};
function getMatchDoubleInStatsCopy() {
    return MATCH_DOUBLE_IN_COPY[typeof currentLang === 'string' ? currentLang : 'en'] || MATCH_DOUBLE_IN_COPY.en;
}
function isMatchDoubleIn(match, tournament = typeof activeTournament === 'undefined' ? null : activeTournament) {
    return Boolean(match && (match.doubleInStats?.format === 'DIDO' || tournament?.format === 'DIDO'));
}
function ensureMatchDoubleInStats(match) {
    if (!match?.stats || !isMatchDoubleIn(match)) return null;
    if (!match.doubleInStats) {
        match.doubleInStats = { format: 'DIDO' };
        for (const side of ['p1', 'p2']) match.doubleInStats[side] = {
            hits: 0, attempts: 0, complete: Number(match.stats[`${side}TotalDarts`]) === 0
        };
    }
    return match.doubleInStats;
}
function getMatchDoubleInStats(match, side) {
    const data = ensureMatchDoubleInStats(match)?.[side];
    return data && data.complete === true && Number.isInteger(data.hits) && Number.isInteger(data.attempts)
        && data.hits >= 0 && data.attempts >= data.hits ? data : null;
}
function getMatchDoubleInPercentage(match, side) {
    const data = getMatchDoubleInStats(match, side);
    return data ? `${(data.attempts ? data.hits / data.attempts * 100 : 0).toFixed(1)}%` : '—';
}
function getMatchDoubleInStatsText(match, side) {
    const data = getMatchDoubleInStats(match, side);
    return data ? `${data.hits}/${data.attempts} (${getMatchDoubleInPercentage(match, side)})` : '—';
}
function isOpeningDoubleHit(dart) {
    return dart?.mult === 2 && (dart.sector >= 1 && dart.sector <= 20 || dart.sector === 25)
        && !dart.fallen && !dart.bounceOut && !dart.robinHood;
}
function recordMatchDoubleInDart(match, isP1, score, dart, visit = null) {
    const side = isP1 ? 'p1' : 'p2', data = ensureMatchDoubleInStats(match)?.[side];
    if (!data) return;
    // The existing scoring ledger has already removed knocked-out points. Recount
    // the surviving opening: an earlier scoring dart may now be a failed entry.
    if (visit?.doubleInTally) {
        let remaining = visit.startScore, hits = 0, attempts = 0;
        for (const previous of visit.darts) {
            if (!previous) continue;
            if (remaining === 501) { attempts++; if (isOpeningDoubleHit(previous)) hits++; }
            remaining -= previous.points;
        }
        data.hits += hits - visit.doubleInTally.hits;
        data.attempts += attempts - visit.doubleInTally.attempts;
        visit.doubleInTally = { hits, attempts };
    } else if (visit && visit.darts.length === 0) visit.doubleInTally = { hits: 0, attempts: 0 };
    if (score !== 501) return;
    const hit = isOpeningDoubleHit(dart) ? 1 : 0;
    data.attempts++; data.hits += hit;
    if (visit?.doubleInTally) { visit.doubleInTally.attempts++; visit.doubleInTally.hits += hit; }
}
function refreshMatchDoubleInStats() {
    if (typeof document === 'undefined') return;
    const match = typeof currentMatch === 'undefined' ? null : currentMatch;
    const enabled = isMatchDoubleIn(match), copy = getMatchDoubleInStatsCopy();
    for (const [id, side] of [['t-stat-double-in-lbl', null], ['stat-double-in', 'p1'], ['stat-opp-double-in', 'p2']]) {
        const node = document.getElementById(id);
        if (!node) continue;
        node.hidden = !enabled;
        node.textContent = side ? getMatchDoubleInStatsText(match, side) : copy.label;
        node.title = side && !getMatchDoubleInStats(match, side) ? copy.unknown : '';
    }
}
