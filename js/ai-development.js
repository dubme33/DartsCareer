// Rozwój AI jest rozliczany z całego sezonu. Drobne korekty meczowe są częścią
// tej samej zmiany, a nie drugą premią. Nie zmieniamy treningu gracza kariery.
const AI_SEASON_DEVELOPMENT_VERSION = 1;
const AI_SEASON_DEVELOPMENT_MAX_CHANGE = 10;

function getAiDevelopmentRating(candidate, year) {
    const career = typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
    const rating = Number(career ? candidate?.overall ?? candidate?.ovr
        : candidate?.baseOvr ?? candidate?.ovr ?? candidate?.overall);
    if (!Number.isFinite(rating)) return null;
    const state = candidate?.aiDevelopment;
    // Oczekiwania dotyczą poziomu na początek sezonu, bez tegorocznego transferu
    // meczowego. Korekty bazy/moda pozostają niezależne od rozwoju za wyniki.
    return rating - (!career && state?.version === AI_SEASON_DEVELOPMENT_VERSION
        && state.year === year ? Number(state.inSeasonDelta) || 0 : 0);
}

function getAiDevelopmentRaceWinChance(chance, target) {
    target = Math.max(1, Math.min(35, Math.round(Number(target) || 6)));
    let term = chance ** target, probability = term;
    for (let losses = 1; losses < target; losses++) {
        term *= (target + losses - 1) / losses * (1 - chance);
        probability += term;
    }
    return probability;
}

function getAiDevelopmentMatchExpectation(ratingDifference, format, profile) {
    // getTournamentWinChance opisuje LEG, nie cały mecz. Faworyt w długim
    // meczu ma większe oczekiwania niż w krótkim, także w formacie setowym.
    // Uśrednienie po formie zapobiega karaniu za zwykłą zmienność turniejów;
    // nie korzystamy z RNG ani z wylosowanej formy ocenianego występu.
    const race = difference => {
        const legChance = 1 / (1 + Math.exp(-difference / profile.ratingScale));
        return format.type === 'sets'
            ? getAiDevelopmentRaceWinChance(getAiDevelopmentRaceWinChance(legChance, format.legsPerSet || 3), format.setsToWin || 3)
            : getAiDevelopmentRaceWinChance(legChance, format.legsToWin || 6);
    };
    const spread = (profile.formSpread || 0) * 1.2;
    return 0.5 * race(ratingDifference) + 0.25 * race(ratingDifference - spread)
        + 0.25 * race(ratingDifference + spread);
}

function getAiDevelopmentMatchWeight(tournament, round) {
    const names = `${tournament.name || ''} ${tournament.sourceName || ''} ${tournament.specialType || ''}`;
    if (/qualifier|kwalifikac|q-school|qschool|pro card trials/i.test(names)) return 0.35;
    const profile = getTournamentSimulationProfile({ ...tournament, name: names });
    const eventWeight = profile.key === 'major' || profile.key === 'open' ? 1.5
        : profile.key === 'european' ? 1.15 : 1;
    return eventWeight * (round === 2 ? 1.2 : round === 4 ? 1.1 : 1);
}

function recordAiDevelopmentMatch(candidate, opponent, won, tournament, format = {}, round) {
    if (!candidate || !opponent || candidate.isBye || opponent.isBye || tournament?.isDoubles
        || !tournament?.name || typeof won !== 'boolean'
        || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate))) return;
    const year = currentDate.getFullYear();
    const rating = getAiDevelopmentRating(candidate, year), opposition = getAiDevelopmentRating(opponent, year);
    if (rating === null || opposition === null) return;
    let state = candidate.aiDevelopment;
    if (!state || state.version !== AI_SEASON_DEVELOPMENT_VERSION || state.year !== year) {
        state = candidate.aiDevelopment = { version: AI_SEASON_DEVELOPMENT_VERSION, year,
            since: currentDate.getTime(), matches: 0, weight: 0, wins: 0, expectedWins: 0,
            sensitivity: 0, inSeasonDelta: 0, settled: false };
    }
    if (state.settled) return;
    const profile = getTournamentSimulationProfile({ ...tournament,
        name: `${tournament.name} ${tournament.sourceName || ''}` });
    const expected = difference => getAiDevelopmentMatchExpectation(difference, format, profile);
    const difference = rating - opposition;
    const weight = getAiDevelopmentMatchWeight(tournament, Number(round));
    state.matches++;
    state.weight += weight;
    state.wins += won ? weight : 0;
    state.expectedWins += weight * expected(difference);
    state.sensitivity += weight * (expected(difference + 1) - expected(difference - 1)) / 2;
}

function recordAiDevelopmentImmediateChange(candidate, delta) {
    const state = candidate?.aiDevelopment;
    if (state?.version === AI_SEASON_DEVELOPMENT_VERSION && state.year === currentDate.getFullYear()
        && !state.settled && Number.isFinite(delta)) state.inSeasonDelta += delta;
}

function limitAiDevelopmentGrowth(rating, change) {
    if (change <= 0) return change;
    let remaining = change, increase = 0;
    // Hamujemy wyłącznie wzrost, nie porażki zawodnika z wysokim OVR.
    // Nie ma przydziału punktów według miejsca w OOM ani automatycznych awansów.
    for (const [ceiling, multiplier] of [[85, 1], [90, 0.6], [94, 0.3], [99, 0.15]]) {
        const room = Math.max(0, ceiling - rating - increase);
        const used = Math.min(remaining, room / multiplier);
        increase += used * multiplier;
        remaining -= used;
    }
    return increase;
}

function settleAiSeasonDevelopment(completedYear) {
    if (!Number.isInteger(completedYear) || !Array.isArray(pdcPlayers)) return [];
    const changes = [];
    for (const candidate of pdcPlayers) {
        const state = candidate?.aiDevelopment;
        if (!candidate || candidate.isBye || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate))
            || state?.version !== AI_SEASON_DEVELOPMENT_VERSION || state.year !== completedYear || state.settled) continue;
        if (![state.matches, state.weight, state.wins, state.expectedWins, state.sensitivity, state.inSeasonDelta]
            .every(Number.isFinite) || state.matches < 0 || state.weight < 0 || state.sensitivity < 0) continue;
        const before = Number(candidate.baseOvr ?? candidate.ovr);
        if (!Number.isFinite(before)) continue;
        // Mała próbka nie pozwala wnioskować o całym sezonie. 60 ważonych
        // meczów pozwala na pełne ±10; pojedynczy puchar nie daje skoku o 9 OVR.
        const limit = AI_SEASON_DEVELOPMENT_MAX_CHANGE * Math.min(1, state.weight / 60);
        const performanceChange = state.matches >= 12
            ? Math.max(-limit, Math.min(limit, (state.wins - state.expectedWins) / (state.sensitivity + 0.6)))
            : state.inSeasonDelta;
        const seasonStart = before - state.inSeasonDelta;
        const totalChange = state.matches >= 12 ? limitAiDevelopmentGrowth(seasonStart, performanceChange) : state.inSeasonDelta;
        const after = Math.max(45, Math.min(99, seasonStart + totalChange));
        const adjustment = after - before;
        ensureBaseRatings(candidate);
        candidate.baseOvr = after;
        candidate.baseScoring = Math.max(45, Math.min(100, candidate.baseScoring + adjustment));
        candidate.baseDoubles = Math.max(40, Math.min(100, candidate.baseDoubles + adjustment));
        applyForm(candidate);
        state.settled = true;
        candidate.aiDevelopmentSummary = { year: completedYear, matches: state.matches, since: state.since,
            change: after - seasonStart, adjustment, before, after,
            winRate: state.weight ? state.wins / state.weight : null,
            expectedWinRate: state.weight ? state.expectedWins / state.weight : null };
        changes.push({ id: candidate.id, ...candidate.aiDevelopmentSummary });
    }
    return changes;
}
