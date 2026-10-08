// Persistent, hidden career attributes. No RNG from match simulation is consumed.
function hashAiDevelopmentIdentity(text) {
    let hash = 2166136261;
    for (const char of String(text)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
    return hash;
}

function ensureAiDevelopmentWorldSeed(owner = (typeof player !== 'undefined' ? player : null)) {
    if (!owner) return 'pre-career';
    if (typeof owner.aiDevelopmentWorldSeed !== 'string' || !owner.aiDevelopmentWorldSeed) {
        const identity = owner.id || [owner.name, owner.country, owner.birthYear, owner.careerDebutSeason].join('|');
        owner.aiDevelopmentWorldSeed = `foundation-${hashAiDevelopmentIdentity(identity)}`;
    }
    return owner.aiDevelopmentWorldSeed;
}

function prepareAiDevelopmentIdentity(candidate) {
    if (!candidate || candidate.isBye || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate))) return;
    if (!candidate.aiFoundationIdentity) {
        candidate.aiFoundationIdentity = candidate.id || `legacy-${hashAiDevelopmentIdentity(
            [candidate.defaultTemplateIndex, candidate.sourceName || candidate.name, candidate.country,
                candidate.birthYear, candidate.joinedSeason].join('|'))}`;
    }
}

function getAiDevelopmentAttributeRandom(candidate, label) {
    prepareAiDevelopmentIdentity(candidate);
    let value = hashAiDevelopmentIdentity(`${ensureAiDevelopmentWorldSeed()}|${candidate.aiFoundationIdentity}|v1|${label}`);
    return () => {
        value += 0x6D2B79F5;
        let n = Math.imul(value ^ value >>> 15, 1 | value);
        n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
        return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
}

function initializeAiDevelopmentCandidate(candidate, { referenceDate = currentDate, ratingEdited = false } = {}) {
    if (!candidate || candidate.isBye || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate))) return;
    const config = AI_DEVELOPMENT_FOUNDATION_CONFIG, rating = Number(candidate.baseOvr ?? candidate.ovr ?? candidate.overall);
    if (!Number.isFinite(rating)) return;
    const random = getAiDevelopmentAttributeRandom(candidate, 'attributes');
    if (!Number.isFinite(candidate.potential) || candidate.potential < config.potential.min || candidate.potential > config.potential.max) {
        const floor = Math.min(config.potential.max, Math.max(rating,
            Number(candidate.aiDevelopmentSummary?.after) || rating, config.potential.minimumGenerated));
        const bias = Math.max(-1, Math.min(1, (rating - config.potential.ratingReference) / config.potential.ratingRange));
        const bands = config.potential.bands.map((band, index) => ({ ...band,
            weight: floor <= band.max ? band.weight * Math.exp(bias * index * config.potential.ratingBias) : 0 }));
        let roll = random() * bands.reduce((sum, band) => sum + band.weight, 0);
        const band = bands.find(band => (roll -= band.weight) < 0) || bands.at(-1);
        const lower = Math.max(floor, band.min);
        candidate.potential = Math.min(config.potential.max, lower + random() * (band.max - lower));
    }
    if (ratingEdited) candidate.potential = Math.max(candidate.potential, Math.min(config.potential.max, rating));
    if (!Number.isFinite(candidate.developmentRate) || candidate.developmentRate < config.developmentRate.min
        || candidate.developmentRate > config.developmentRate.max) {
        const rateRandom = getAiDevelopmentAttributeRandom(candidate, 'rate');
        candidate.developmentRate = config.developmentRate.min
            + (config.developmentRate.max - config.developmentRate.min) * (rateRandom() + rateRandom()) / 2;
    }
    if (!candidate.aiFoundation || candidate.aiFoundation.version !== config.version) {
        candidate.aiFoundation = { version: config.version, eligibleSince: new Date(referenceDate).getTime() };
    }
    if (typeof initializeAiCareerCandidate === 'function') initializeAiCareerCandidate(candidate, referenceDate);
    if (ratingEdited && candidate.aiCareer) {
        // An editor change is not sporting evidence of growth, decline or recovery.
        candidate.aiCareer.history = [];
        candidate.aiCareer.historicalPeak = { ovr: rating, ranking: null, year: new Date(referenceDate).getFullYear() };
        candidate.aiCareer.evidence = { score: 0, confirmations: [], lastProcessedPeriod: getAiCareerPeriod(new Date(referenceDate)) };
        delete candidate.aiCareer.tournamentEvidence;
    }
}

function initializeAiDevelopmentFoundation(referenceDate = currentDate) {
    ensureAiDevelopmentWorldSeed();
    if (typeof pdcPlayers !== 'undefined') pdcPlayers.forEach(candidate => initializeAiDevelopmentCandidate(candidate, { referenceDate }));
}

function getAiMaturationAgeFactor(age) {
    if (!Number.isFinite(age)) return 0;
    const config = AI_DEVELOPMENT_FOUNDATION_CONFIG.maturation;
    return 1 / (1 + Math.exp((age - config.ageMidpoint) / config.ageWidth));
}

function getAiDevelopmentHeadroomFactor(rating, potential) {
    const config = AI_DEVELOPMENT_FOUNDATION_CONFIG.maturation;
    const x = (potential - rating) / config.headroomWidth;
    const smoothRoom = config.headroomWidth * (Math.max(x, 0) + Math.log1p(Math.exp(-Math.abs(x))));
    return -Math.expm1(-smoothRoom / config.headroomScale);
}

function getAiDevelopmentOvershootFactor(rating, potential) {
    const config = AI_DEVELOPMENT_FOUNDATION_CONFIG.performance;
    return 1 / (1 + Math.exp((rating - potential - config.potentialOvershootMargin)
        / config.potentialOvershootWidth));
}

function getAiPerformanceAgeFactor(candidate, date) {
    const config = AI_DEVELOPMENT_FOUNDATION_CONFIG.performance;
    if (!config.lateDamping) return 1;
    const age = typeof getAiLifecycleAge === 'function' ? getAiLifecycleAge(candidate,date) : getPlayerAge(candidate,date);
    return Number.isFinite(age) ? config.lateFloor + (1-config.lateFloor)/(1+Math.exp((age-config.lateMidpoint)/config.lateWidth)) : 1;
}

function getAiMaturationComponents(candidate, state, completedYear, seasonStart) {
    initializeAiDevelopmentCandidate(candidate);
    const config = AI_DEVELOPMENT_FOUNDATION_CONFIG.maturation;
    const date = new Date(completedYear, 11, 31);
    const age = typeof getAiLifecycleAge === 'function' ? getAiLifecycleAge(candidate, date)
        : typeof getPlayerAge === 'function' ? getPlayerAge(candidate, date) : null;
    const exposure = Math.max(0, Math.min(1, ((state?.matches || 0) - config.minimumMatches + 1)
        / (config.fullExposureMatches - config.minimumMatches + 1)));
    const availableDays = (new Date(completedYear + 1, 0, 1).getTime()
        - Math.max(new Date(completedYear, 0, 1).getTime(), candidate.aiFoundation.eligibleSince)) / 86400000;
    const availability = Math.max(0, Math.min(1, availableDays / 365.2425));
    const active = !(typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate));
    const career = typeof getAiCareerAnnualComponents === 'function'
        ? getAiCareerAnnualComponents(candidate, completedYear, seasonStart, exposure)
        : { maturationMultiplier: 1, growthActive: false, decline: 0, recovery: 0 };
    const normalRaw = Math.min(config.max, config.strength * candidate.developmentRate * getAiMaturationAgeFactor(age));
    const rawCap = career.growthActive ? AI_CAREER_CONFIG.arcs.growthRawCap : config.max;
    const raw = active ? Math.min(rawCap, normalRaw * career.maturationMultiplier) * exposure * availability : 0;
    return { raw, exposure, availability, age, headroom: candidate.potential - seasonStart,
        headroomFactor: getAiDevelopmentHeadroomFactor(seasonStart, candidate.potential), career };
}

function applyAiPermanentRatingAdjustment(candidate, adjustment, minimumRating = null) {
    ensureBaseRatings(candidate);
    if (!Number.isFinite(adjustment)) return 0;
    const before = candidate.baseOvr;
    const floor = Number.isFinite(minimumRating) ? minimumRating : Math.min(45, before);
    candidate.baseOvr = Math.max(floor, Math.min(99, before + adjustment));
    const applied = candidate.baseOvr - before;
    candidate.baseScoring = Math.max(Math.min(45, candidate.baseScoring), Math.min(100, candidate.baseScoring + applied));
    candidate.baseDoubles = Math.max(Math.min(40, candidate.baseDoubles), Math.min(100, candidate.baseDoubles + applied));
    applyForm(candidate);
    return applied;
}

function settleAiFoundationSeason(candidate, state, completedYear, { before, seasonStart, input, limit,
    rawPerformance = null, prestigeFactor = null, performanceAgeFactor = null }) {
    const maturation = getAiMaturationComponents(candidate, state, completedYear, seasonStart);
    const positivePerformance = Math.max(0, input), negativePerformance = Math.min(0, input);
    const maturationInput = maturation.raw * maturation.headroomFactor;
    const recoveryInput = maturation.career.recovery;
    const declineInput = -maturation.career.decline;
    const positiveInput = positivePerformance + maturationInput + recoveryInput;
    const budget = Math.min(AI_DEVELOPMENT_FOUNDATION_CONFIG.performance.maxChange, Math.max(limit, maturation.raw + recoveryInput));
    // Headroom drives maturation. Result-based growth is preserved below potential;
    // one shared budget, smooth overshoot brake and elite cap then constrain both.
    const overshootFactor = getAiDevelopmentOvershootFactor(seasonStart, candidate.potential);
    const positiveChange = limitAiDevelopmentGrowth(seasonStart,
        Math.min(budget, positiveInput) * overshootFactor);
    const negativeInput = negativePerformance + declineInput;
    const after = Math.max(Math.min(45, seasonStart), Math.min(99, seasonStart + positiveChange + negativeInput));
    const actualPositive = negativeInput < 0 ? positiveChange : after - seasonStart;
    const maturationComponent = positiveInput > 0 ? actualPositive * maturationInput / positiveInput : 0;
    const recoveryComponent = positiveInput > 0 ? actualPositive * recoveryInput / positiveInput : 0;
    const actualNegative = after - seasonStart - actualPositive;
    const declineComponent = negativeInput < 0 ? actualNegative * declineInput / negativeInput : 0;
    const performanceComponent = after - seasonStart - maturationComponent - recoveryComponent - declineComponent;
    const adjustment = after - before;
    applyAiPermanentRatingAdjustment(candidate, adjustment, Math.min(45, seasonStart));
    state.settled = true;
    return candidate.aiDevelopmentSummary = { year: completedYear, foundationVersion: AI_DEVELOPMENT_FOUNDATION_CONFIG.version,
        matches: state.matches, since: state.since, seasonStart, before, after, adjustment, change: after - seasonStart,
        potential: candidate.potential, developmentRate: candidate.developmentRate,
        headroom: maturation.headroom, headroomFactor: maturation.headroomFactor, exposure: maturation.exposure,
        availability: maturation.availability, performanceInput: input, maturationInput: maturation.raw,
        rawPerformance, prestigeFactor, performanceAgeFactor,
        maturationHeadroomInput: maturationInput, recoveryInput, declineInput, overshootFactor, positiveBudget: budget,
        performanceComponent, maturationComponent, declineComponent, recoveryComponent,
        careerAnnual: maturation.career.annual || null, ageFactor: getAiMaturationAgeFactor(maturation.age),
        positiveChange, agingComponent: 0, finalPermanentDelta: after - seasonStart, finalAfter: after,
        winRate: state.weight ? state.wins / state.weight : null,
        expectedWinRate: state.weight ? state.expectedWins / state.weight : null };
}

function limitAiFoundationImmediateGrowth(candidate, change) {
    if (change <= 0) return change;
    initializeAiDevelopmentCandidate(candidate);
    let state = candidate.aiDevelopment;
    const year = currentDate.getFullYear();
    if (!state || state.year !== year || state.version !== AI_SEASON_DEVELOPMENT_VERSION) {
        state = candidate.aiDevelopment = { version: AI_SEASON_DEVELOPMENT_VERSION, year,
            since: currentDate.getTime(), matches: 0, weight: 0, baseWeight: 0, wins: 0,
            expectedWins: 0, sensitivity: 0, inSeasonDelta: 0, settled: false };
    }
    if (state.settled) return 0;
    const used = Number(state.provisionalGrowthInput) || 0;
    const input = Math.max(0, Math.min(change, AI_DEVELOPMENT_FOUNDATION_CONFIG.performance.maxChange - used));
    state.provisionalGrowthInput = used + input;
    // Provisional changes are reconciled (subtracted) by the final annual ledger.
    return limitAiDevelopmentGrowth(candidate.baseOvr,
        input * getAiDevelopmentOvershootFactor(candidate.baseOvr, candidate.potential));
}

function getAiNewgenEntryAge(random = Math.random) {
    const bands = AI_DEVELOPMENT_FOUNDATION_CONFIG.newgenAgeBands;
    const total = bands.reduce((sum, band) => sum + band.weight, 0);
    let roll = Math.min(1 - Number.EPSILON, Math.max(0, random())) * total;
    for (const band of bands) {
        if (roll < band.weight) return band.min + Math.floor(roll / band.weight * (band.max - band.min + 1));
        roll -= band.weight;
    }
    return bands.at(-1).max;
}

function recordAiFoundationAging(candidate, before, after) {
    const summary = candidate.aiDevelopmentSummary;
    if (summary?.foundationVersion !== AI_DEVELOPMENT_FOUNDATION_CONFIG.version) return;
    summary.agingComponent = after - before;
    summary.finalPermanentDelta = summary.performanceComponent + summary.maturationComponent + summary.agingComponent
        + (summary.declineComponent || 0) + (summary.recoveryComponent || 0);
    summary.finalAfter = after;
}

function getAiDevelopmentDebug(candidateOrId) {
    const candidate = typeof candidateOrId === 'string' ? pdcPlayers.find(p => p.id === candidateOrId) : candidateOrId;
    if (!candidate) return null;
    const summary = candidate.aiDevelopmentSummary;
    return { id: candidate.id, name: candidate.name, currentBaseOvr: candidate.baseOvr,
        potential: candidate.potential, developmentRate: candidate.developmentRate,
        longevity: candidate.longevity, volatility: candidate.volatility,
        currentArc: candidate.aiCareer?.arc ? { ...candidate.aiCareer.arc } : null,
        breakthroughEvidence: candidate.aiCareer?.evidence ? JSON.parse(JSON.stringify(candidate.aiCareer.evidence)) : null,
        historicalPeak: candidate.aiCareer?.historicalPeak ? { ...candidate.aiCareer.historicalPeak } : null,
        maturation: summary?.maturationComponent ?? null, performance: summary?.performanceComponent ?? null,
        aging: summary?.agingComponent ?? null, decline: summary?.declineComponent ?? null,
        recovery: summary?.recoveryComponent ?? null, finalPermanentDelta: summary?.finalPermanentDelta ?? null,
        headroom: candidate.potential - candidate.baseOvr, lastSeason: summary ? { ...summary } : null };
}
