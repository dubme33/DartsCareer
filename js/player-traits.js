// Development traits are deliberately separate from scoring, doubles and OVR.
const PLAYER_TRAITS_CONFIG = Object.freeze({ version: 2, xpPerPoint: 100, weeklyMatchXP: 8, longMatchLegs: 12 });
const PLAYER_TRAIT_TYPES = Object.freeze(['endurance', 'consistency', 'mental']);

function getTraitTournamentText(tournament) {
    if (typeof tournament === 'string') return tournament;
    return `${tournament?.name || ''} ${tournament?.sourceName || ''} ${tournament?.specialType || ''}`;
}

function isTraitQualifier(tournament) {
    return /qualifier|kwalifikac|q-school|qschool|pro card trials/i.test(getTraitTournamentText(tournament));
}

function getMentalAgeBonus(candidate, date = currentDate) {
    const age = Number.isInteger(candidate?.birthYear) ? date.getFullYear() - candidate.birthYear : 35;
    return Math.max(0, Math.min(20, Math.floor((age - 18) / 2)));
}

function getMentalTitleCount(candidate) {
    // Read the same sources as the career-title migration without mutating them
    // or counting the current season twice. Unknown historical wins stay unknown.
    const titles = Array.isArray(candidate?.careerTitles) ? candidate.careerTitles : [];
    let count = titles.reduce((sum, title) => {
        const hasIdentity = typeof title === 'string'
            ? title.trim().length > 0
            : Boolean(title && (getTraitTournamentText(title).trim() || String(title.key || '').trim()));
        if (!hasIdentity || isTraitQualifier(title)) return sum;
        const amount = typeof title === 'string' ? 1 : Number(title.count ?? 1);
        return sum + (Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0);
    }, 0);
    const version = typeof PLAYER_CAREER_TITLES_VERSION !== 'undefined' ? PLAYER_CAREER_TITLES_VERSION : 1;
    const legacy = Array.isArray(candidate?.careerStats?.trophies)
        ? candidate.careerStats.trophies.filter(title => typeof title === 'string' ? title.trim() : title)
        : [];
    if (candidate?.careerTitlesVersion !== version && legacy.length) {
        return count + legacy.filter(title => !isTraitQualifier(title)).length;
    }
    const results = Array.isArray(candidate?.seasonStats?.results) ? candidate.seasonStats.results : [];
    for (const result of results) {
        const tournament = { name: result?.tournament, sourceName: result?.sourceTournament,
            specialType: result?.tournamentSpecialType };
        if (result?.won && getTraitTournamentText(tournament).trim() && !result.careerTitleRecorded
            && !isTraitQualifier(tournament)) count++;
    }
    return count;
}

function getInitialMentalTrait(candidate) {
    return 45 + getMentalAgeBonus(candidate) + Math.min(20, getMentalTitleCount(candidate));
}

function getTraitAgeBaseline(candidate, date = currentDate) {
    const age = Number.isInteger(candidate?.birthYear) ? date.getFullYear() - candidate.birthYear : 35;
    return Math.max(20, 82 - Math.max(0, Math.min(age, 35) - 25) - Math.max(0, age - 35) * 2);
}

function getInitialConsistency(candidate) {
    // Stable migration/newgen values, with no consumption of match simulation RNG.
    const key = String(candidate?.id || candidate?.name || 'career');
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (Math.imul(hash, 31) + key.charCodeAt(i)) >>> 0;
    return 45 + hash % 21;
}

function getPlayerTrait(candidate, type) {
    if (!candidate || !PLAYER_TRAIT_TYPES.includes(type)) return 50;
    const value = candidate.traits?.[type];
    return typeof value === 'number' && Number.isFinite(value)
        ? Math.max(0, Math.min(100, value))
        : (type === 'endurance' ? getTraitAgeBaseline(candidate)
            : type === 'mental' ? getInitialMentalTrait(candidate) : getInitialConsistency(candidate));
}

function initializePlayerTraits(candidate, reset = false) {
    if (!candidate || candidate.isBye) return null;
    const previous = !reset && candidate.traits && typeof candidate.traits === 'object' ? candidate.traits : {};
    const baseline = getTraitAgeBaseline(candidate);
    const validNumber = (value, fallback) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
    const endurance = Math.round(Math.max(0, Math.min(100,
        validNumber(previous.endurance, baseline) + baseline - validNumber(previous.ageBaseline, baseline))));
    const consistency = Math.round(Math.max(0, Math.min(100, validNumber(previous.consistency, getInitialConsistency(candidate)))));
    const mentalAgeBonus = getMentalAgeBonus(candidate);
    const oldAgeBonus = Math.max(0, Math.min(20, validNumber(previous.mentalAgeBonus, mentalAgeBonus)));
    const savedTitleBonus = Math.max(0, Math.min(20, validNumber(previous.mentalTitleBonus, 0)));
    // Experience already earned is not lost if an older save/mod lacks part of its title history.
    const mentalTitleBonus = Math.max(savedTitleBonus, Math.min(20, getMentalTitleCount(candidate)));
    const oldTitleBonus = Math.max(0, Math.min(20, validNumber(previous.mentalTitleBonus, mentalTitleBonus)));
    const hasPreviousMental = typeof previous.mental === 'number' && Number.isFinite(previous.mental);
    const mental = Math.round(Math.max(0, Math.min(100,
        hasPreviousMental
            ? previous.mental + mentalAgeBonus - oldAgeBonus + mentalTitleBonus - oldTitleBonus
            : 45 + mentalAgeBonus + mentalTitleBonus)));
    const xp = (type, value) => value >= 100 ? 0 : Math.max(0, Math.min(99.9, validNumber(previous[`${type}XP`], 0)));
    const weekly = previous.matchXP || {};
    candidate.traits = {
        version: PLAYER_TRAITS_CONFIG.version, endurance, consistency, mental,
        enduranceXP: xp('endurance', endurance), consistencyXP: xp('consistency', consistency), ageBaseline: baseline,
        mentalXP: xp('mental', mental), mentalAgeBonus, mentalTitleBonus,
        matchXP: {
            week: typeof weekly.week === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(weekly.week) ? weekly.week : '',
            endurance: Math.max(0, Math.min(8, validNumber(weekly.endurance, 0))),
            consistency: Math.max(0, Math.min(8, validNumber(weekly.consistency, 0)))
        }
    };
    return candidate.traits;
}

function initializeAllPlayerTraits(reset = false) {
    const candidates = [...(typeof pdcPlayers !== 'undefined' ? pdcPlayers : []),
        ...(typeof player !== 'undefined' && player ? [player] : [])];
    new Set(candidates).forEach(candidate => initializePlayerTraits(candidate, reset));
}

function getTraitProgressMultiplier(candidate, type) {
    const value = getPlayerTrait(candidate, type);
    return value >= 90 ? 0.25 : value >= 80 ? 0.5 : 1;
}

function awardPlayerTraitXP(candidate, type, amount) {
    if (!PLAYER_TRAIT_TYPES.includes(type) || !Number.isFinite(amount) || amount <= 0) return 0;
    const state = initializePlayerTraits(candidate);
    if (!state || state[type] >= 100) return 0;
    const total = Math.round((state[`${type}XP`] + amount) * 10) / 10;
    const gained = Math.min(100 - state[type], Math.floor(total / PLAYER_TRAITS_CONFIG.xpPerPoint));
    state[type] += gained;
    state[`${type}XP`] = state[type] === 100 ? 0 : Math.round((total - gained * 100) * 10) / 10;
    return gained;
}

function getPlayerTraitTrainingXP(type, random = Math.random) {
    const bonus = typeof getPlayerStaffTrainingBonus === 'function' ? getPlayerStaffTrainingBonus(type) : 0;
    const analysisBonus = typeof getCareerAnalysisTrainingBonus === 'function' ? getCareerAnalysisTrainingBonus(player) : 0;
    const professionalism = Math.max(0, Math.min(100, Number(player.prof) || 0));
    return (16 + random() * 4 - 2) * (0.8 + professionalism / 250)
        * getTraitProgressMultiplier(player, type) * (1 + bonus / 100) * (1 + analysisBonus / 100);
}

function getTraitWeekKey(date = currentDate) {
    const monday = new Date(date);
    monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

// Called only inside the existing official-result deduplication guard.
function awardOfficialMatchTraitXP(candidate, totalLegs) {
    const state = initializePlayerTraits(candidate);
    if (!state) return;
    const week = getTraitWeekKey();
    if (state.matchXP.week !== week) state.matchXP = { week, endurance: 0, consistency: 0 };
    for (const type of ['consistency', 'endurance']) {
        if (type === 'endurance' && !(totalLegs >= PLAYER_TRAITS_CONFIG.longMatchLegs)) continue;
        const rawXP = Math.min(2, PLAYER_TRAITS_CONFIG.weeklyMatchXP - candidate.traits.matchXP[type]);
        awardPlayerTraitXP(candidate, type, rawXP * getTraitProgressMultiplier(candidate, type));
        candidate.traits.matchXP[type] += rawXP;
    }
}

function getConsistencySpread(candidate) {
    return 1.35 - getPlayerTrait(candidate, 'consistency') * 0.007;
}

function getEnduranceStaminaCost(candidate, baseCost) {
    return Math.max(0, Math.round(baseCost * (1.2 - getPlayerTrait(candidate, 'endurance') * 0.004)));
}

function getEnduranceMatchPenalty(candidate, completedLegs) {
    return Math.min(6, Math.max(0, completedLegs - 8) / 5 * (1.25 - getPlayerTrait(candidate, 'endurance') / 100));
}

function getEnduranceLegWinChance(chance, p1, p2, completedLegs) {
    if (completedLegs <= 8) return chance;
    const scale = typeof getTournamentSimulationProfile === 'function' ? getTournamentSimulationProfile(activeTournament).ratingScale : 28;
    const logOdds = Math.log(chance / (1 - chance));
    const difference = getEnduranceMatchPenalty(p2, completedLegs) - getEnduranceMatchPenalty(p1, completedLegs);
    return 1 / (1 + Math.exp(-(logOdds + difference / scale)));
}

function applyPlayerTraitsToMatchStats(candidate, stats, isP1, match = currentMatch) {
    if (!match || !candidate) return stats;
    const leg = Math.max(0, Math.floor(Number(match.totalLegsPlayed) || 0));
    if (match.traitLegForm?.leg !== leg) match.traitLegForm = { leg, players: {} };
    const key = `${isP1 ? 'p1' : 'p2'}:${candidate.id || candidate.name || 'player'}`;
    const forms = match.traitLegForm.players;
    if (!Number.isFinite(forms[key])) {
        forms[key] = (Math.random() + Math.random() - 1) * 4 * getConsistencySpread(candidate);
    }
    // Reuse the same leg form when switching between manual play and fast-forward.
    // Never write effective performance back to the player's base ratings.
    const preparation = typeof getCareerPreparationMatchModifier === 'function'
        ? getCareerPreparationMatchModifier(candidate)
        : 0;
    const modifier = forms[key] - getEnduranceMatchPenalty(candidate, leg) + preparation;
    return { ...stats, scoring: stats.scoring + modifier, doubles: stats.doubles + modifier };
}
