// Career infrastructure is a money sink and a small source of temporary match
// preparation. It never changes saved scoring, doubles or base OVR.
const CAREER_INFRASTRUCTURE_CONFIG = Object.freeze({
    version: 1,
    initialPreparation: 70,
    basePurchasePrice: 100000,
    facilities: Object.freeze({
        training: Object.freeze({
            upgradePrices: Object.freeze({ 2: 150000, 3: 350000 }),
            maintenance: Object.freeze([0, 1000, 3000, 7000]),
            preparationPerTraining: Object.freeze([0, 1, 2, 3])
        }),
        recovery: Object.freeze({
            upgradePrices: Object.freeze({ 2: 200000, 3: 450000 }),
            maintenance: Object.freeze([0, 1000, 3500, 8000]),
            preparationPerRest: Object.freeze([0, 1, 2, 3]),
            staminaPerRest: Object.freeze([0, 0, 1, 2])
        }),
        analysis: Object.freeze({
            upgradePrices: Object.freeze({ 2: 250000, 3: 600000 }),
            maintenance: Object.freeze([0, 500, 2500, 6000]),
            trainingXpPercent: Object.freeze([0, 1, 3, 5]),
            travelPreparationReduction: Object.freeze([0, 0, 1, 2])
        })
    }),
    travel: Object.freeze({
        economy: Object.freeze({ baseCost: 0, staminaMultiplier: 1, preparationLoss: 8 }),
        comfort: Object.freeze({ baseCost: 2500, staminaMultiplier: 0.85, preparationLoss: 4 }),
        premium: Object.freeze({ baseCost: 8000, staminaMultiplier: 0.7, preparationLoss: 1 })
    })
});

const CAREER_FACILITY_TYPES = Object.freeze(['training', 'recovery', 'analysis']);
const CAREER_TRAVEL_STANDARDS = Object.freeze(['economy', 'comfort', 'premium']);

function clampCareerInfrastructureValue(value, min, max, fallback = min) {
    const numeric = Number(value);
    return Math.max(min, Math.min(max, Number.isFinite(numeric) ? numeric : fallback));
}

function getCareerInfrastructureDateKey(value = currentDate) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseCareerInfrastructureDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function addCareerInfrastructureMonth(value, anchorDay = null) {
    const date = parseCareerInfrastructureDate(value);
    if (!date) return '';
    const targetYear = date.getFullYear() + (date.getMonth() === 11 ? 1 : 0);
    const targetMonth = (date.getMonth() + 1) % 12;
    const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
    const requestedDay = Math.max(1, Math.min(31, Number(anchorDay) || date.getDate()));
    return getCareerInfrastructureDateKey(new Date(targetYear, targetMonth, Math.min(requestedDay, lastDay)));
}

function initializeCareerInfrastructure(reset = false, candidate = player) {
    if (!candidate) return null;
    const previous = !reset && candidate.careerInfrastructure && typeof candidate.careerInfrastructure === 'object'
        ? candidate.careerInfrastructure
        : {};
    const baseOwned = reset ? false : previous.baseOwned === true;
    const previousLevels = previous.facilityLevels && typeof previous.facilityLevels === 'object'
        ? previous.facilityLevels
        : {};
    const facilityLevels = Object.fromEntries(CAREER_FACILITY_TYPES.map(type => [type,
        baseOwned ? Math.floor(clampCareerInfrastructureValue(previousLevels[type], 1, 3, 1)) : 0]));
    const preparation = clampCareerInfrastructureValue(previous.preparation, 0, 100,
        CAREER_INFRASTRUCTURE_CONFIG.initialPreparation);
    const travelStandard = CAREER_TRAVEL_STANDARDS.includes(previous.travelStandard)
        ? previous.travelStandard
        : 'economy';
    const purchasedOn = baseOwned && parseCareerInfrastructureDate(previous.purchasedOn)
        ? previous.purchasedOn
        : (baseOwned ? getCareerInfrastructureDateKey() : '');
    const maintenanceDay = baseOwned
        ? Math.max(1, Math.min(31, Math.floor(Number(previous.maintenanceDay) || parseCareerInfrastructureDate(purchasedOn)?.getDate() || 1)))
        : 0;
    const nextMaintenanceDueOn = baseOwned && parseCareerInfrastructureDate(previous.nextMaintenanceDueOn)
        ? previous.nextMaintenanceDueOn
        : (baseOwned ? addCareerInfrastructureMonth(purchasedOn, maintenanceDay) : '');

    // Keep the existing object identity. Several helpers normalize the state while
    // a payment operation still holds a reference to it.
    const normalized = {
        version: CAREER_INFRASTRUCTURE_CONFIG.version,
        preparation,
        travelStandard,
        baseOwned,
        maintenanceActive: baseOwned ? previous.maintenanceActive !== false : false,
        facilityLevels,
        purchasedOn,
        maintenanceDay,
        lastMaintenanceOn: baseOwned && parseCareerInfrastructureDate(previous.lastMaintenanceOn)
            ? previous.lastMaintenanceOn
            : purchasedOn,
        nextMaintenanceDueOn
    };
    if (!reset && previous === candidate.careerInfrastructure) {
        Object.assign(previous, normalized);
        candidate.careerInfrastructure = previous;
    } else {
        candidate.careerInfrastructure = normalized;
    }
    return candidate.careerInfrastructure;
}

function restoreCareerInfrastructure() {
    return initializeCareerInfrastructure(false);
}

function getCareerInfrastructureState(candidate = player) {
    if (!candidate) return null;
    const isCareerPlayer = typeof player !== 'undefined' && candidate === player;
    if (!isCareerPlayer && !candidate.careerInfrastructure) return null;
    return initializeCareerInfrastructure(false, candidate);
}

function isCareerBaseActive(candidate = player) {
    const state = getCareerInfrastructureState(candidate);
    return Boolean(state?.baseOwned && state.maintenanceActive);
}

function getCareerFacilityLevel(type, candidate = player) {
    if (!CAREER_FACILITY_TYPES.includes(type) || !isCareerBaseActive(candidate)) return 0;
    return getCareerInfrastructureState(candidate).facilityLevels[type];
}

function getCareerBaseMaintenance(candidate = player) {
    const state = getCareerInfrastructureState(candidate);
    if (!state?.baseOwned) return 0;
    return CAREER_FACILITY_TYPES.reduce((total, type) => total
        + CAREER_INFRASTRUCTURE_CONFIG.facilities[type].maintenance[state.facilityLevels[type]], 0);
}

function getCareerPreparation(candidate = player) {
    const state = getCareerInfrastructureState(candidate);
    return state ? state.preparation : CAREER_INFRASTRUCTURE_CONFIG.initialPreparation;
}

function changeCareerPreparation(amount, candidate = player) {
    const state = getCareerInfrastructureState(candidate);
    if (!state || !Number.isFinite(Number(amount))) return getCareerPreparation(candidate);
    state.preparation = clampCareerInfrastructureValue(state.preparation + Number(amount), 0, 100,
        CAREER_INFRASTRUCTURE_CONFIG.initialPreparation);
    return state.preparation;
}

function getCareerPreparationMatchModifier(candidate) {
    if (!candidate?.careerInfrastructure) return 0;
    return Math.max(-3, Math.min(2, (getCareerPreparation(candidate) - 70) / 15));
}

function adjustCareerPreparationWinChance(chance, firstModifier, secondModifier, scale = 28) {
    const difference = Number(firstModifier || 0) - Number(secondModifier || 0);
    if (!difference) return chance;
    const bounded = Math.max(0.000001, Math.min(0.999999, Number(chance) || 0.5));
    return 1 / (1 + Math.exp(-(Math.log(bounded / (1 - bounded)) + difference / Math.max(1, scale))));
}

function recordCareerTrainingPreparation(candidate = player) {
    const level = getCareerFacilityLevel('training', candidate);
    const gain = CAREER_INFRASTRUCTURE_CONFIG.facilities.training.preparationPerTraining[level] || 0;
    if (gain) changeCareerPreparation(gain, candidate);
    return gain;
}

function recoverCareerPreparation(candidate = player) {
    const current = getCareerPreparation(candidate);
    const baselineRecovery = current < CAREER_INFRASTRUCTURE_CONFIG.initialPreparation ? 1 : 0;
    const level = getCareerFacilityLevel('recovery', candidate);
    const facilityRecovery = CAREER_INFRASTRUCTURE_CONFIG.facilities.recovery.preparationPerRest[level] || 0;
    const gain = baselineRecovery + facilityRecovery;
    if (gain) changeCareerPreparation(gain, candidate);
    return gain;
}

function getCareerRecoveryStaminaBonus(candidate = player) {
    const level = getCareerFacilityLevel('recovery', candidate);
    return CAREER_INFRASTRUCTURE_CONFIG.facilities.recovery.staminaPerRest[level] || 0;
}

function getCareerAnalysisTrainingBonus(candidate = player) {
    const level = getCareerFacilityLevel('analysis', candidate);
    return CAREER_INFRASTRUCTURE_CONFIG.facilities.analysis.trainingXpPercent[level] || 0;
}

function getCareerAnalysisTravelReduction(candidate = player) {
    const level = getCareerFacilityLevel('analysis', candidate);
    return CAREER_INFRASTRUCTURE_CONFIG.facilities.analysis.travelPreparationReduction[level] || 0;
}

function canChangeCareerInfrastructure() {
    return typeof isTournamentSimulationBusy !== 'function' || !isTournamentSimulationBusy();
}

function refreshCareerInfrastructureViews(feedbackKey = '', params = {}) {
    if (feedbackKey && typeof setCareerInfrastructureFeedback === 'function') {
        setCareerInfrastructureFeedback(feedbackKey, params);
    }
    if (typeof updateHub === 'function') updateHub();
    if (typeof renderCareerInfrastructure === 'function') renderCareerInfrastructure();
}

function purchaseCareerBase() {
    if (!canChangeCareerInfrastructure()) return false;
    const state = getCareerInfrastructureState();
    if (!state || state.baseOwned) return false;
    const firstMaintenance = CAREER_INFRASTRUCTURE_CONFIG.facilities.training.maintenance[1]
        + CAREER_INFRASTRUCTURE_CONFIG.facilities.recovery.maintenance[1]
        + CAREER_INFRASTRUCTURE_CONFIG.facilities.analysis.maintenance[1];
    const total = CAREER_INFRASTRUCTURE_CONFIG.basePurchasePrice + firstMaintenance;
    if ((Number(player.budget) || 0) < total) {
        refreshCareerInfrastructureViews('insufficient', { amount: total });
        return false;
    }
    if (typeof confirm === 'function' && !confirm(typeof trCareerInfrastructure === 'function'
        ? trCareerInfrastructure('confirmPurchase', { price: CAREER_INFRASTRUCTURE_CONFIG.basePurchasePrice,
            maintenance: firstMaintenance, total })
        : `Purchase the training base for £${total}?`)) return false;

    player.budget -= total;
    const today = getCareerInfrastructureDateKey();
    Object.assign(state, {
        baseOwned: true,
        maintenanceActive: true,
        facilityLevels: { training: 1, recovery: 1, analysis: 1 },
        purchasedOn: today,
        maintenanceDay: parseCareerInfrastructureDate(today).getDate(),
        lastMaintenanceOn: today,
        nextMaintenanceDueOn: addCareerInfrastructureMonth(today, parseCareerInfrastructureDate(today).getDate())
    });
    refreshCareerInfrastructureViews('purchased', { total, maintenance: firstMaintenance });
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function upgradeCareerFacility(type) {
    if (!canChangeCareerInfrastructure() || !CAREER_FACILITY_TYPES.includes(type)) return false;
    const state = getCareerInfrastructureState();
    if (!state?.baseOwned) return false;
    const currentLevel = state.facilityLevels[type];
    const nextLevel = currentLevel + 1;
    if (nextLevel > 3) return false;
    const price = CAREER_INFRASTRUCTURE_CONFIG.facilities[type].upgradePrices[nextLevel];
    if ((Number(player.budget) || 0) < price) {
        refreshCareerInfrastructureViews('insufficient', { amount: price });
        return false;
    }
    if (typeof confirm === 'function' && !confirm(typeof trCareerInfrastructure === 'function'
        ? trCareerInfrastructure('confirmUpgrade', { facility: trCareerInfrastructure(type), level: nextLevel, price })
        : `Upgrade ${type} to level ${nextLevel} for £${price}?`)) return false;
    player.budget -= price;
    state.facilityLevels[type] = nextLevel;
    refreshCareerInfrastructureViews('upgraded', { facility: typeof trCareerInfrastructure === 'function'
        ? trCareerInfrastructure(type) : type, level: nextLevel, price });
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function resumeCareerBaseMaintenance() {
    if (!canChangeCareerInfrastructure()) return false;
    const state = getCareerInfrastructureState();
    if (!state?.baseOwned || state.maintenanceActive) return false;
    const amount = getCareerBaseMaintenance();
    if ((Number(player.budget) || 0) < amount) {
        refreshCareerInfrastructureViews('insufficient', { amount });
        return false;
    }
    player.budget -= amount;
    const today = getCareerInfrastructureDateKey();
    state.maintenanceActive = true;
    state.maintenanceDay = parseCareerInfrastructureDate(today).getDate();
    state.lastMaintenanceOn = today;
    state.nextMaintenanceDueOn = addCareerInfrastructureMonth(today, state.maintenanceDay);
    refreshCareerInfrastructureViews('resumed', { amount, date: state.nextMaintenanceDueOn });
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function processCareerInfrastructureMaintenance() {
    const result = { changed: false, total: 0, paid: [], missed: [] };
    if (!canChangeCareerInfrastructure()) return result;
    const state = getCareerInfrastructureState();
    if (!state?.baseOwned) return result;
    const today = currentDate instanceof Date ? currentDate : new Date(currentDate);
    let due = parseCareerInfrastructureDate(state.nextMaintenanceDueOn);
    let guard = 0;
    while (due && due <= today && guard++ < 120) {
        const dueKey = getCareerInfrastructureDateKey(due);
        const amount = getCareerBaseMaintenance();
        if ((Number(player.budget) || 0) >= amount) {
            player.budget -= amount;
            state.maintenanceActive = true;
            result.total += amount;
            result.paid.push({ date: dueKey, amount });
        } else {
            state.maintenanceActive = false;
            result.missed.push({ date: dueKey, amount });
        }
        result.changed = true;
        state.lastMaintenanceOn = dueKey;
        state.nextMaintenanceDueOn = addCareerInfrastructureMonth(dueKey, state.maintenanceDay);
        due = parseCareerInfrastructureDate(state.nextMaintenanceDueOn);
    }
    if (result.changed && typeof notifyCareerInfrastructureMaintenance === 'function') {
        notifyCareerInfrastructureMaintenance(result);
    }
    return result;
}

function getCareerTournamentTravelMultiplier(tournament) {
    const text = typeof getTraitTournamentText === 'function'
        ? getTraitTournamentText(tournament).toLowerCase()
        : `${tournament?.name || ''} ${tournament?.sourceName || ''} ${tournament?.specialType || ''}`.toLowerCase();
    if (/world darts championship|global darts championship|world cup|worldcup|puchar narodów/.test(text)) return 2.5;
    if (typeof isMentalMajorTournament === 'function' && isMentalMajorTournament(tournament)) return 2;
    if (/european tour|continental tour|world masters|worldmasters/.test(text)) return 1.5;
    return 1;
}

function getCareerTravelQuote(tournament, standard = getCareerInfrastructureState()?.travelStandard || 'economy') {
    const selected = CAREER_TRAVEL_STANDARDS.includes(standard) ? standard : 'economy';
    const config = CAREER_INFRASTRUCTURE_CONFIG.travel[selected];
    const eventMultiplier = getCareerTournamentTravelMultiplier(tournament);
    return {
        standard: selected,
        cost: Math.round(config.baseCost * eventMultiplier),
        staminaMultiplier: config.staminaMultiplier,
        preparationLoss: config.preparationLoss,
        eventMultiplier
    };
}

function isCareerTournamentTravelCharged(tournament, participationDate = currentDate) {
    const date = participationDate instanceof Date ? participationDate : new Date(participationDate);
    return Boolean(tournament && !Number.isNaN(date.getTime())
        && Number(tournament.travelChargedYear) === date.getFullYear());
}

function setCareerTravelStandard(standard) {
    if (!canChangeCareerInfrastructure() || !CAREER_TRAVEL_STANDARDS.includes(standard)) return false;
    if (typeof activeTournament !== 'undefined' && activeTournament
        && isCareerTournamentTravelCharged(activeTournament)) {
        refreshCareerInfrastructureViews('travelLocked');
        return false;
    }
    const state = getCareerInfrastructureState();
    state.travelStandard = standard;
    refreshCareerInfrastructureViews('travelSelected', { standard: typeof trCareerInfrastructure === 'function'
        ? trCareerInfrastructure(standard) : standard });
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function chargeCareerTournamentTravel(tournament, participationDate = currentDate) {
    if (!tournament || !player) return null;
    const date = participationDate instanceof Date ? participationDate : new Date(participationDate);
    if (Number.isNaN(date.getTime())) return null;
    if (isCareerTournamentTravelCharged(tournament, date)) {
        return {
            ...getCareerTravelQuote(tournament, tournament.travelStandardUsed),
            cost: Number(tournament.travelCostPaid) || 0,
            preparationLoss: Number(tournament.travelPreparationLoss) || 0,
            requestedStandard: tournament.travelRequestedStandard || tournament.travelStandardUsed,
            downgraded: tournament.travelRequestedStandard !== tournament.travelStandardUsed,
            alreadyCharged: true
        };
    }

    const state = getCareerInfrastructureState();
    const requestedStandard = state.travelStandard;
    let quote = getCareerTravelQuote(tournament, requestedStandard);
    let downgraded = false;
    if ((Number(player.budget) || 0) < quote.cost) {
        quote = getCareerTravelQuote(tournament, 'economy');
        downgraded = requestedStandard !== 'economy';
    }
    player.budget = Math.max(0, (Number(player.budget) || 0) - quote.cost);
    const preparationLoss = Math.max(0, quote.preparationLoss - getCareerAnalysisTravelReduction(player));
    changeCareerPreparation(-preparationLoss, player);
    tournament.travelChargedYear = date.getFullYear();
    tournament.travelRequestedStandard = requestedStandard;
    tournament.travelStandardUsed = quote.standard;
    tournament.travelCostPaid = quote.cost;
    tournament.travelPreparationLoss = preparationLoss;
    const result = { ...quote, preparationLoss, requestedStandard, downgraded, alreadyCharged: false };
    if (typeof notifyCareerTournamentTravel === 'function') notifyCareerTournamentTravel(result, tournament);
    if (typeof updateHub === 'function') updateHub();
    return result;
}
