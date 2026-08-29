// Mental toughness only reduces a small, temporary pressure penalty. It never
// changes saved ratings, grants guaranteed checkouts or consumes additional RNG.
const MENTAL_PRESSURE_MAX_PENALTY = 4;

function isMentalMajorTournament(tournament) {
    if (!tournament || isTraitQualifier(tournament)) return false;
    return /world darts championship|global darts championship|matchplay|grand prix|grand slam|champion's slam|uk open|british open|european championship|continental championship|players championship finals|pro players finals|masters finals|worldmastersfinals|world cup|worldcup|puchar narodów|(?:premier league|global darts league).*play-offs/i
        .test(getTraitTournamentText(tournament));
}

function canWinMatchWithNextLeg(match, isP1) {
    if (!match) return false;
    if (match.suddenDeath) return true;
    const format = match.matchFormat || {};
    const ownLegs = Number(isP1 ? match.p1Legs : match.p2Legs) || 0;
    const otherLegs = Number(isP1 ? match.p2Legs : match.p1Legs) || 0;
    if (format.type === 'sets') {
        const targetSets = Number(format.setsToWin) || 3;
        if ((Number(isP1 ? match.p1Sets : match.p2Sets) || 0) < targetSets - 1) return false;
        const decider = match.p1Sets === targetSets - 1 && match.p2Sets === targetSets - 1;
        const suddenDeath = decider && format.decidingSetSuddenDeathAt
            && ownLegs === format.decidingSetSuddenDeathAt && otherLegs === ownLegs;
        return ownLegs + 1 >= (Number(format.legsPerSet) || 3)
            && (suddenDeath || !decider || !format.decidingSetWinByTwo || ownLegs + 1 - otherLegs >= 2);
    }
    const suddenDeath = format.suddenDeathAt && ownLegs === format.suddenDeathAt && otherLegs === ownLegs;
    return ownLegs + 1 >= (Number(format.legsToWin || match.legsToWin) || 6)
        && (suddenDeath || !format.winByTwo || ownLegs + 1 - otherLegs >= 2);
}

function getMatchPressureLevel(match, isP1, aim = null, score = null, quick = false) {
    if (!match || (match.vsAI === false && !match.isTournament && !match.isSpectator && !match.isDoubles)) return 0;
    const tournament = match.tournament || (typeof activeTournament !== 'undefined' ? activeTournament : null);
    let pressure = match.isTournament && match.worldCupStage !== 'qualifier' && isMentalMajorTournament(tournament) ? 0.3 : 0;
    const format = match.matchFormat || {};
    const p1Legs = Number(match.p1Legs) || 0, p2Legs = Number(match.p2Legs) || 0;
    const tiedSuddenDeath = format.type === 'sets'
        ? match.p1Sets === (Number(format.setsToWin) || 3) - 1
            && match.p2Sets === (Number(format.setsToWin) || 3) - 1
            && Number(format.decidingSetSuddenDeathAt) > 0
            && p1Legs === Number(format.decidingSetSuddenDeathAt) && p2Legs === p1Legs
        : Number(format.suddenDeathAt) > 0 && p1Legs === Number(format.suddenDeathAt) && p2Legs === p1Legs;
    if (format.type === 'sets') {
        const targetSets = Number(format.setsToWin) || 3;
        if (match.p1Sets === targetSets - 1 && match.p2Sets === targetSets - 1) pressure += 0.5;
        const targetLegs = Number(format.legsPerSet) || 3;
        if (p1Legs >= targetLegs - 1 && p2Legs >= targetLegs - 1) pressure += 0.3;
    } else {
        const targetLegs = Number(format.legsToWin || match.legsToWin) || 6;
        if (p1Legs >= targetLegs - 1 && p2Legs >= targetLegs - 1) pressure += 0.65;
    }
    if (match.suddenDeath || tiedSuddenDeath) return 1;
    if (canWinMatchWithNextLeg(match, isP1)) {
        const remaining = score ?? (isP1 ? match.p1Score : match.p2Score);
        const isMatchDart = aim?.mult === 2 && (aim.sector === 25 || (aim.sector >= 1 && aim.sector <= 20))
            && remaining === aim.sector * 2;
        if (isMatchDart) pressure += 0.4;
        // Quick simulations have no individual darts: a modest closing-leg
        // contribution approximates the pressure of the eventual match dart.
        else if (quick) pressure += 0.15;
    }
    const mistakes = match.mentalMistakes;
    if (mistakes?.leg === (Number(match.totalLegsPlayed) || 0) && mistakes[isP1 ? 'p1' : 'p2'] > 0) pressure += 0.2;
    return Math.min(1, pressure);
}

function getMentalPressurePenalty(candidate, pressure) {
    return MENTAL_PRESSURE_MAX_PENALTY * Math.max(0, Math.min(1, pressure)) * (1 - getPlayerTrait(candidate, 'mental') / 100);
}

function applyMentalPressureToStats(candidate, stats, isP1, aim, score, match = currentMatch) {
    const penalty = getMentalPressurePenalty(candidate, getMatchPressureLevel(match, isP1, aim, score));
    return penalty ? { ...stats, scoring: stats.scoring - penalty, doubles: stats.doubles - penalty } : stats;
}

function recordMentalThrowOutcome(isP1, score, aim, result, match = currentMatch) {
    if (!match || match.suddenDeath || (match.vsAI === false && !match.isTournament && !match.isDoubles)) return;
    const leg = Number(match.totalLegsPlayed) || 0;
    if (match.mentalMistakes?.leg !== leg) match.mentalMistakes = { leg, p1: 0, p2: 0 };
    const side = isP1 ? 'p1' : 'p2';
    match.mentalMistakes[side] = Math.max(0, match.mentalMistakes[side] - 1);
    const remaining = score - result.sector * result.mult;
    const bust = remaining < 0 || remaining === 1 || (remaining === 0 && result.mult !== 2);
    const missedCheckout = aim.mult === 2 && score === aim.sector * 2 && !(remaining === 0 && result.mult === 2);
    if (bust || missedCheckout) match.mentalMistakes[side] = 3;
}

function getMentalLegPenalties(p1, p2, match) {
    return [getMentalPressurePenalty(p1, getMatchPressureLevel(match, true, null, null, true)),
        getMentalPressurePenalty(p2, getMatchPressureLevel(match, false, null, null, true))];
}

function adjustMentalLegWinChance(chance, penalties, scale = 28) {
    const difference = penalties[1] - penalties[0];
    if (!difference) return chance;
    const bounded = Math.max(0.000001, Math.min(0.999999, chance));
    return 1 / (1 + Math.exp(-(Math.log(bounded / (1 - bounded)) + difference / scale)));
}
