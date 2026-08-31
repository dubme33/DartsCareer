// A cash ledger, separate from OOM totals and from recurring career expenses.
function getFinanceTournament(tournamentOrName) {
    const event = typeof tournamentOrName === 'string' ? { name: tournamentOrName } : tournamentOrName;
    if (!event?.name) return null;
    const names = [event.name, event.sourceName].filter(Boolean);
    const events = typeof tournamentDatabase !== 'undefined' ? tournamentDatabase : [];
    return events.find(candidate => names.some(name => name === candidate.name || name === candidate.sourceName))
        || (typeof isWorldCupTournament === 'function' && isWorldCupTournament(event) ? events.find(isWorldCupTournament) : null) || event;
}

function getTournamentFinanceKey(event, year = getCurrentSeasonYear()) {
    const tournament = getFinanceTournament(event);
    return JSON.stringify([Number(year), String(tournament?.sourceName || tournament?.name || '').trim().toLowerCase()]);
}

function initializeTournamentFinances(reset = false) {
    if (typeof player === 'undefined' || !player) return null;
    if (!reset && player.tournamentFinances?.version === 1) return player.tournamentFinances;
    const ledger = player.tournamentFinances = { version: 1, entries: {} };
    if (reset) return ledger;
    const seen = new Set();
    // Older saves contain final prizes, but not a complete transaction history.
    (player.seasonStats?.results || []).forEach(result => {
        const year = result.timestamp > 0 ? new Date(result.timestamp).getFullYear() : Number(player.seasonStats.year);
        const event = getFinanceTournament({ name: result.tournament, sourceName: result.sourceTournament,
            specialType: result.tournamentSpecialType });
        const key = result.key || JSON.stringify([year, result.tournament, result.timestamp]);
        if (!event || !Number.isInteger(year) || seen.has(key)) return;
        seen.add(key);
        const entry = ensureTournamentFinanceEntry(event, year);
        entry.partial = true;
        entry.travel = null;
        entry.bonuses = null;
        entry.sponsorBonus = null;
        if (Number.isFinite(result.prizeMoney) && result.prizeMoney >= 0) entry.prize += result.prizeMoney;
        else entry.prize = null;
        entry.settledAt = result.timestamp || null;
        entry.round = result.round;
        entry.won = Boolean(result.won);
        entry.stage = result.stage || '';
    });
    (typeof tournamentDatabase !== 'undefined' ? tournamentDatabase : []).forEach(event => {
        if (!Number.isInteger(event.travelChargedYear) || !Number.isFinite(event.travelCostPaid)) return;
        const existing = getTournamentFinanceEntry(event, event.travelChargedYear);
        const entry = existing || ensureTournamentFinanceEntry(event, event.travelChargedYear);
        entry.partial = true;
        entry.travel = event.travelCostPaid;
        entry.bonuses = null;
        entry.sponsorBonus = null;
        if (!existing) entry.prize = null;
    });
    return ledger;
}

function ensureTournamentFinanceEntry(event, year = getCurrentSeasonYear()) {
    const tournament = getFinanceTournament(event);
    if (!tournament) return null;
    const ledger = initializeTournamentFinances();
    if (!ledger) return null;
    const key = getTournamentFinanceKey(tournament, year);
    return ledger.entries[key] ||= { year, name: tournament.name, sourceName: tournament.sourceName || tournament.name,
        specialType: tournament.specialType || '', prize: 0, travel: 0, bonuses: 0, sponsorBonus: 0,
        partial: false, startedAt: currentDate.getTime(), settledAt: null };
}

function getTournamentFinanceEntry(event, year = getCurrentSeasonYear()) {
    return player?.tournamentFinances?.entries?.[getTournamentFinanceKey(event, year)] || null;
}

function recordTournamentCash(event, kind, amount, date = currentDate) {
    if (!['prize', 'travel', 'bonuses', 'sponsorBonus'].includes(kind) || !Number.isFinite(amount) || amount < 0) return;
    const entry = ensureTournamentFinanceEntry(event, getCurrentSeasonYear(date));
    if (!entry) return;
    if (kind === 'travel') entry.travel = amount; // One journey per edition; use the actual debit.
    else entry[kind] = (entry[kind] || 0) + amount;
    if (getFinanceTournament(event)?.completed) finishTournamentFinances(event);
}

function finishTournamentFinances(event) {
    const entry = getTournamentFinanceEntry(event);
    if (entry && event?.completed) entry.settledAt ||= currentDate.getTime();
}

function recordTournamentFinanceResult(candidate, event, result) {
    if (typeof isCurrentPlayer !== 'function' || !isCurrentPlayer(candidate)) return;
    const entry = ensureTournamentFinanceEntry(event);
    if (!entry) return;
    entry.settledAt = currentDate.getTime();
    entry.round = result.round;
    entry.won = Boolean(result.won);
    entry.stage = result.stage || '';
    // Prize cash is recorded at payout, never added again from a result.
    if (entry.prize === null && Number.isFinite(result.prizeMoney)) entry.prize = result.prizeMoney;
}

function recordTournamentAchievementCash(amount, event = null) {
    const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
    const tournament = event || (match?.isTournament && !match.isSpectator
        ? (typeof activeTournament !== 'undefined' ? activeTournament : null) : null);
    if (tournament) recordTournamentCash(tournament, 'bonuses', amount);
}

function getTournamentNetCash(entry) {
    if (!entry || entry.prize === null || entry.travel === null) return null;
    return entry.prize + (entry.bonuses || 0) + (entry.sponsorBonus || 0) - entry.travel;
}

function isFinanceQualifier(event) {
    return /qualif|kwalifikac|q.?school|pro card trials/i.test(`${event.name} ${event.sourceName || ''} ${event.specialType || ''}`);
}

function getTournamentPrizePreview(tournament) {
    const event = getFinanceTournament(tournament);
    if (!event) return null;
    const name = event.name, text = `${name} ${event.sourceName || ''}`.toLowerCase();
    const qualifier = isFinanceQualifier(event);
    const team = !qualifier && (event.specialType === 'worldCup' || /world cup|puchar narodów/.test(text));
    const league = /global darts league|premier/.test(name.toLowerCase());
    const playoffs = league && name.includes('Play-offs');
    const slam = !qualifier && /grand slam|champion's slam/.test(text);
    const rows = [];
    if (qualifier) return { event, rows, rankings: [], qualifier: true, team: false };
    if (team) {
        Object.entries(WORLD_CUP_PRIZES).forEach(([stage, amount]) => rows.push({ stage, amount: amount / 2, teamAmount: amount }));
    } else {
        let openingRound = 32;
        if (league) openingRound = playoffs ? 4 : 8;
        else if (typeof isWorldMastersFinalsTournament === 'function' && isWorldMastersFinalsTournament(event)) openingRound = 32;
        else if (typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(event)) openingRound = 16;
        else if (/world darts championship|global darts championship|uk open|british open/.test(text)) openingRound = 128;
        else if (typeof isPlayersChampionshipTournament === 'function' && isPlayersChampionshipTournament(event)) openingRound = 128;
        else if (/players championship finals|pro players finals/.test(text)
            || (typeof isEuropeanTourTournament === 'function' && isEuropeanTourTournament(event))) openingRound = 64;
        else if (slam) openingRound = 16;
        const add = (round, won = false) => {
            const amount = getPrizeMoney(name, round, won);
            rows.push({ round, won, amount: Number.isFinite(amount) ? amount : null });
        };
        add(2, true);
        for (let round = 2; round <= openingRound; round *= 2) add(round);
        if (slam) rows.push({ stage: 'groupExit', amount: 0 });
        if (playoffs) Object.entries(GLOBAL_LEAGUE_PLACEMENT_PRIZES).forEach(([position, amount]) => rows.push({ position: Number(position), amount }));
    }
    const rankings = [];
    // Match awardPrizeMoney's non-ranking branches before checking OOM helpers.
    const series = typeof isWorldMastersName === 'function' && isWorldMastersName(name);
    if (!team && !league && !series) {
        if (typeof isMainOrderOfMeritRankingTournament === 'function' && isMainOrderOfMeritRankingTournament(name)) rankings.push('mainOom');
        if (typeof isProTourRankingTournament === 'function' && isProTourRankingTournament(name)) rankings.push('ProTour');
        if (typeof isPlayersChampionshipTournament === 'function' && isPlayersChampionshipTournament(name)) rankings.push('Players Championship OOM');
        if (typeof isEuropeanTourTournament === 'function' && isEuropeanTourTournament(name)) rankings.push('European Tour OOM');
    }
    return { event, rows, rankings, team, qualifier, slam, playoffs, league };
}
