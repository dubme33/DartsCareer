// Only compact career summaries and award winners survive a season. Current
// baselines cover the roster; no match logs or player objects are duplicated.
const SEASON_ARCHIVE_VERSION = 1;
const SEASON_AWARD_MIN_MATCHES = 10;

function seasonArchiveNumber(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

function seasonArchivePerson(candidate) {
    return { id: String(candidate.id || ''), name: String(candidate.name || ''), country: String(candidate.country || '') };
}

function seasonArchivePersonKey(candidate) {
    return candidate?.id ? `id:${candidate.id}` : `name:${candidate?.name || ''}`;
}

function seasonArchivePlayers() {
    return typeof getCareerProfilePlayers === 'function' ? getCareerProfilePlayers() : [...pdcPlayers, player].filter(Boolean);
}

function seasonArchiveOvr(candidate) {
    return seasonArchiveNumber(candidate === player ? candidate.overall ?? candidate.ovr : candidate.ovr ?? candidate.overall);
}

function seasonArchiveRankings(candidates) {
    return new Map([...candidates].sort((a, b) => (Number(b.prizeMoney) || 0) - (Number(a.prizeMoney) || 0))
        .map((candidate, index) => [seasonArchivePersonKey(candidate), index + 1]));
}

function seasonArchiveResultTournament(result) {
    return { name: result.tournament || '', sourceName: result.sourceTournament || result.tournament || '',
        specialType: result.tournamentSpecialType || '' };
}

function seasonArchiveIsQualifier(tournament) {
    return /qualifier|kwalifikac|q-school|qschool|pro card trials/i.test(`${tournament.name} ${tournament.sourceName || ''} ${tournament.specialType || ''}`);
}

function seasonArchiveIsTeam(tournament) {
    return tournament.isDoubles || /worldcup|world cup|puchar narodów/i.test(`${tournament.name} ${tournament.sourceName || ''} ${tournament.specialType || ''}`);
}

function seasonArchiveResults(candidate, year) {
    if (candidate.seasonStats?.year !== year || !Array.isArray(candidate.seasonStats.results)) return [];
    return candidate.seasonStats.results.filter(result => result && typeof result.tournament === 'string');
}

function createSeasonArchiveBaseline(candidate, current, rank = null, fullSeason = false) {
    const results = seasonArchiveResults(candidate, current.year);
    return { person: seasonArchivePerson(candidate), startOvr: seasonArchiveOvr(candidate), startRank: rank, modOvrAdjustment: 0,
        startedAt: currentDate.getTime(), fullSeason,
        rookie: candidate.careerDebutSeason === current.year || (candidate.isNewgen === true && candidate.joinedSeason === current.year),
        earnings: results.reduce((sum, result) => sum + (seasonArchiveNumber(result.prizeMoney) || 0), 0),
        rankingEarnings: results.reduce((sum, result) => sum + (typeof isMainOrderOfMeritRankingTournament === 'function'
            && isMainOrderOfMeritRankingTournament(seasonArchiveResultTournament(result)) ? seasonArchiveNumber(result.prizeMoney) || 0 : 0), 0) };
}

function beginSeasonArchiveYear(fullSeason = false) {
    const state = player.seasonArchive;
    const candidates = seasonArchivePlayers();
    const ranks = seasonArchiveRankings(candidates);
    const current = { year: currentDate.getFullYear(), startedAt: currentDate.getTime(), fullSeason, baselines: [] };
    current.baselines = candidates.map(candidate => createSeasonArchiveBaseline(candidate, current, ranks.get(seasonArchivePersonKey(candidate)), fullSeason));
    state.current = current;
    return current;
}

function initializeSeasonArchive(reset = false) {
    if (reset || !player.seasonArchive || player.seasonArchive.version !== SEASON_ARCHIVE_VERSION) {
        player.seasonArchive = { version: SEASON_ARCHIVE_VERSION, since: currentDate.getTime(), seasons: [], current: null };
    }
    const state = player.seasonArchive;
    if (!state.current || state.current.year !== currentDate.getFullYear()) {
        const atStart = currentDate.getMonth() === 0 && currentDate.getDate() === 1;
        const hasResults = seasonArchivePlayers().some(candidate => seasonArchiveResults(candidate, currentDate.getFullYear()).length
            || (candidate.seasonStats?.year === currentDate.getFullYear() && candidate.seasonStats.matchStats?.played > 0));
        beginSeasonArchiveYear(atStart && !hasResults);
    }
    return state;
}

function findSeasonArchiveBaseline(candidate, current) {
    return current.baselines.find(row => seasonArchivePersonKey(row.person) === seasonArchivePersonKey(candidate));
}

function recordSeasonArchivePrize(candidate, amount, tournamentOrName) {
    if (!candidate || candidate.isBye || !Number.isFinite(amount) || amount <= 0) return;
    const state = initializeSeasonArchive();
    const current = state.current;
    let row = findSeasonArchiveBaseline(candidate, current);
    if (!row) {
        row = createSeasonArchiveBaseline(candidate, current);
        current.baselines.push(row);
    }
    row.earnings += amount;
    if (typeof isMainOrderOfMeritRankingTournament === 'function' && isMainOrderOfMeritRankingTournament(tournamentOrName)) {
        row.rankingEarnings += amount;
    }
}

function buildSeasonArchiveSummary(candidate, current, ranks) {
    const baseline = findSeasonArchiveBaseline(candidate, current);
    const stats = candidate.seasonStats?.year === current.year ? candidate.seasonStats.matchStats : null;
    const count = field => seasonArchiveNumber(stats?.[field]) || 0;
    const results = seasonArchiveResults(candidate, current.year);
    const titles = results.filter(result => result.won && !seasonArchiveIsQualifier(seasonArchiveResultTournament(result)));
    const ovr = seasonArchiveOvr(candidate);
    const startOvr = baseline?.startOvr ?? null;
    return { year: current.year, closed: false, asOf: currentDate.getTime(), startedAt: current.startedAt,
        fullSeason: current.fullSeason === true, person: seasonArchivePerson(candidate),
        rank: ranks.get(seasonArchivePersonKey(candidate)) || null, oomMoney: seasonArchiveNumber(candidate.prizeMoney),
        ovr, startOvr, growth: ovr !== null && startOvr !== null ? Number((ovr - startOvr - (baseline?.modOvrAdjustment || 0)).toFixed(4)) : null,
        average: count('averageCount') ? count('averageTotal') / count('averageCount') : null,
        averageCount: count('averageCount'), played: count('played'), wins: count('wins'), losses: count('losses'),
        checkout: count('doubleMatches') && count('doubleAttempts') ? 100 * count('doubleHits') / count('doubleAttempts') : null,
        doubleMatches: count('doubleMatches'), doubleHits: count('doubleHits'), doubleAttempts: count('doubleAttempts'),
        estimatedDoubleMatches: count('estimatedDoubleMatches'), matchStatsSince: seasonArchiveNumber(stats?.since),
        titles: titles.filter(result => !seasonArchiveIsTeam(seasonArchiveResultTournament(result))).length,
        teamTitles: titles.filter(result => seasonArchiveIsTeam(seasonArchiveResultTournament(result))).length,
        earnings: baseline?.earnings ?? null, rankingEarnings: baseline?.rankingEarnings ?? null,
        rookie: baseline?.rookie === true, fullOvrTracking: baseline?.fullSeason === true };
}

function getLiveSeasonArchiveSummary() {
    const current = initializeSeasonArchive().current;
    return buildSeasonArchiveSummary(player, current, seasonArchiveRankings(seasonArchivePlayers()));
}

function selectSeasonArchiveAwards(summaries, fullSeason) {
    const awards = { available: fullSeason === true, playerYear: null, rookie: null, progress: null };
    if (!fullSeason) return awards;
    const eligible = summaries.filter(row => row.played >= SEASON_AWARD_MIN_MATCHES);
    const compare = (a, b) => (b.rankingEarnings || 0) - (a.rankingEarnings || 0) || b.titles - a.titles || b.wins - a.wins
        || (b.average || 0) - (a.average || 0) || a.person.name.localeCompare(b.person.name)
        || a.person.id.localeCompare(b.person.id);
    const snapshot = row => row ? { person: { ...row.person }, rankingEarnings: row.rankingEarnings, titles: row.titles,
        wins: row.wins, average: row.average, played: row.played, growth: row.growth } : null;
    awards.playerYear = snapshot(eligible.filter(row => row.rankingEarnings >= 1).sort(compare)[0]);
    awards.rookie = snapshot(eligible.filter(row => row.rookie && row.rankingEarnings >= 1).sort(compare)[0]);
    awards.progress = snapshot(eligible.filter(row => row.fullOvrTracking && row.growth > 0)
        .sort((a, b) => b.growth - a.growth || compare(a, b))[0]);
    return awards;
}

function finalizeSeasonArchive(year = currentDate.getFullYear()) {
    // Archive before advancing the date: both money expiry and ageing on
    // 1 January would otherwise corrupt the final rank and OVR for this year.
    if (currentDate.getFullYear() !== year || currentDate.getMonth() !== 11 || currentDate.getDate() !== 31
        || (typeof activeTournament !== 'undefined' && activeTournament && !activeTournament.completed)
        || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) return null;
    const state = initializeSeasonArchive();
    if (state.seasons.some(row => row.year === year)) return null;
    const candidates = seasonArchivePlayers();
    const ranks = seasonArchiveRankings(candidates);
    const summaries = candidates.map(candidate => buildSeasonArchiveSummary(candidate, state.current, ranks));
    const own = summaries.find(row => seasonArchivePersonKey(row.person) === seasonArchivePersonKey(player));
    if (!own) return null;
    const summary = { ...own, closed: true, awards: selectSeasonArchiveAwards(summaries, state.current.fullSeason) };
    state.seasons.push(summary);
    state.seasons.sort((a, b) => a.year - b.year);
    return summary;
}

function resolveSeasonArchivePerson(person, candidates) {
    if (!person) return null;
    const byId = candidates.find(candidate => seasonArchivePersonKey(candidate) === seasonArchivePersonKey(person));
    if (byId) return byId;
    if (typeof resolveLoadedPlayer === 'function') {
        const resolved = resolveLoadedPlayer(person);
        return candidates.includes(resolved) ? resolved : null;
    }
    const matches = candidates.filter(candidate => candidate.name === person.name && candidate.country === person.country);
    return matches.length === 1 ? matches[0] : null;
}

function restoreSeasonArchive() {
    const state = initializeSeasonArchive();
    const seen = new Set();
    state.seasons = (Array.isArray(state.seasons) ? state.seasons : []).filter(row => {
        if (!row || !Number.isInteger(row.year) || row.year < 1900 || row.year > currentDate.getFullYear()
            || row.closed !== true || seen.has(row.year)) return false;
        seen.add(row.year);
        return true;
    }).sort((a, b) => a.year - b.year);
    const current = state.current;
    if (!Array.isArray(current.baselines) || !Number.isFinite(current.startedAt)) {
        beginSeasonArchiveYear(false);
        return;
    }
    const candidates = seasonArchivePlayers();
    const keys = new Set();
    current.fullSeason = current.fullSeason === true;
    current.baselines = current.baselines.filter(row => {
        if (!row?.person || typeof row.person.name !== 'string' || seasonArchiveNumber(row.earnings) === null
            || seasonArchiveNumber(row.rankingEarnings) === null) { current.fullSeason = false; return false; }
        const candidate = resolveSeasonArchivePerson(row.person, candidates);
        if (candidate) row.person.id = String(candidate.id || '');
        const key = seasonArchivePersonKey(row.person);
        if (keys.has(key)) { current.fullSeason = false; return false; }
        keys.add(key);
        row.startOvr = seasonArchiveNumber(row.startOvr);
        row.modOvrAdjustment = Number.isFinite(row.modOvrAdjustment) ? row.modOvrAdjustment : 0;
        row.fullSeason = row.fullSeason === true;
        row.rookie = row.rookie === true;
        return true;
    });
    if (!findSeasonArchiveBaseline(player, current)) current.fullSeason = false;
}

function snapshotSeasonArchiveModRatings() {
    if (!player.seasonArchive?.current) return null;
    return seasonArchivePlayers().map(candidate => ({ person: seasonArchivePerson(candidate), ovr: seasonArchiveOvr(candidate) }));
}

function reconcileSeasonArchiveModRatings(before) {
    if (!before || !player.seasonArchive?.current) return;
    restoreSeasonArchive();
    const candidates = seasonArchivePlayers();
    for (const old of before) {
        const candidate = resolveSeasonArchivePerson(old.person, candidates);
        if (!candidate) continue;
        const baseline = findSeasonArchiveBaseline(candidate, player.seasonArchive.current);
        const now = seasonArchiveOvr(candidate);
        if (baseline && baseline.startOvr !== null && old.ovr !== null && now !== null) {
            // A mod's rating correction is not player development.
            baseline.modOvrAdjustment = (baseline.modOvrAdjustment || 0) + now - old.ovr;
        }
    }
}
