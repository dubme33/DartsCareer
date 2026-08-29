// Cosmetic career spending. These purchases never change OVR, match ratings,
// stamina, preparation, ranking money or sponsor income.
const CAREER_LIFESTYLE_CATALOG = Object.freeze({
    property: Object.freeze({
        starterFlat: Object.freeze({ cost: 0 }),
        cityApartment: Object.freeze({ cost: 75000 }),
        familyHouse: Object.freeze({ cost: 300000 }),
        modernResidence: Object.freeze({ cost: 900000 }),
        championEstate: Object.freeze({ cost: 2000000 })
    }),
    displayCase: Object.freeze({
        basicShelf: Object.freeze({ cost: 0 }),
        oakCabinet: Object.freeze({ cost: 20000 }),
        illuminatedGallery: Object.freeze({ cost: 75000 }),
        championsHall: Object.freeze({ cost: 250000 })
    }),
    shirt: Object.freeze({
        classic: Object.freeze({ cost: 0 }),
        crimson: Object.freeze({ cost: 5000 }),
        royal: Object.freeze({ cost: 12000 }),
        emerald: Object.freeze({ cost: 20000 }),
        championGold: Object.freeze({ cost: 30000, requiresTrophies: 1 })
    }),
    entrance: Object.freeze({
        standard: Object.freeze({ cost: 0 }),
        lights: Object.freeze({ cost: 10000 }),
        smoke: Object.freeze({ cost: 25000 }),
        ledScreens: Object.freeze({ cost: 60000 }),
        pyrotechnics: Object.freeze({ cost: 150000, requiresTrophies: 1 })
    })
});

const CAREER_LIFESTYLE_META = Object.freeze({
    property: Object.freeze({ owned: 'ownedProperties', active: 'activeProperty', starter: 'starterFlat' }),
    displayCase: Object.freeze({ owned: 'ownedDisplayCases', active: 'activeDisplayCase', starter: 'basicShelf' }),
    shirt: Object.freeze({ owned: 'ownedShirts', active: 'activeShirt', starter: 'classic' }),
    entrance: Object.freeze({ owned: 'ownedEntrances', active: 'activeEntrance', starter: 'standard' })
});

function getCareerLifestyleDateKey(value = currentDate) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function initializeCareerLifestyle(reset = false, candidate = player) {
    if (!candidate) return null;
    const previous = !reset && candidate.careerLifestyle && typeof candidate.careerLifestyle === 'object'
        ? candidate.careerLifestyle
        : {};
    const normalized = { version: 1 };
    Object.entries(CAREER_LIFESTYLE_META).forEach(([category, meta]) => {
        const catalog = CAREER_LIFESTYLE_CATALOG[category];
        const savedOwned = !reset && Array.isArray(previous[meta.owned]) ? previous[meta.owned] : [];
        const owned = [...new Set([meta.starter, ...savedOwned.filter(id => Object.hasOwn(catalog, id))])];
        normalized[meta.owned] = owned;
        normalized[meta.active] = owned.includes(previous[meta.active]) ? previous[meta.active] : meta.starter;
    });
    normalized.featuredTrophyKeys = !reset && Array.isArray(previous.featuredTrophyKeys)
        ? [...new Set(previous.featuredTrophyKeys.filter(key => typeof key === 'string'))].slice(0, 3)
        : [];
    normalized.lastPurchaseOn = !reset && typeof previous.lastPurchaseOn === 'string'
        ? previous.lastPurchaseOn
        : '';

    if (!reset && previous === candidate.careerLifestyle) {
        Object.assign(previous, normalized);
        candidate.careerLifestyle = previous;
    } else {
        candidate.careerLifestyle = normalized;
    }
    return candidate.careerLifestyle;
}

function restoreCareerLifestyle() {
    return initializeCareerLifestyle(false);
}

function getCareerLifestyleState(candidate = player) {
    if (!candidate) return null;
    const isCareerPlayer = typeof player !== 'undefined' && candidate === player;
    if (!isCareerPlayer && !candidate.careerLifestyle) return null;
    return initializeCareerLifestyle(false, candidate);
}

function getCareerLifestyleItem(category, id) {
    return CAREER_LIFESTYLE_CATALOG[category]?.[id] || null;
}

function getCareerLifestyleCollectionValue(candidate = player) {
    const state = getCareerLifestyleState(candidate);
    if (!state) return 0;
    return Object.entries(CAREER_LIFESTYLE_META).reduce((total, [category, meta]) => total
        + state[meta.owned].reduce((categoryTotal, id) => categoryTotal
            + (CAREER_LIFESTYLE_CATALOG[category][id]?.cost || 0), 0), 0);
}

function getCareerLifestyleTrophyCount(candidate = player) {
    return Array.isArray(candidate?.careerStats?.trophies) ? candidate.careerStats.trophies.length : 0;
}

function isCareerLifestyleRequirementMet(category, id, candidate = player) {
    const item = getCareerLifestyleItem(category, id);
    return Boolean(item && getCareerLifestyleTrophyCount(candidate) >= (item.requiresTrophies || 0));
}

function canChangeCareerLifestyle() {
    return typeof isTournamentSimulationBusy !== 'function' || !isTournamentSimulationBusy();
}

function refreshCareerLifestyleViews(feedbackKey = '', params = {}) {
    if (feedbackKey && typeof setCareerLifestyleFeedback === 'function') setCareerLifestyleFeedback(feedbackKey, params);
    if (typeof applyCareerLifestyleVisuals === 'function') applyCareerLifestyleVisuals();
    if (typeof updateHub === 'function') updateHub();
    else if (typeof updateCareerLifestyleHub === 'function') updateCareerLifestyleHub();
    if (typeof renderCareerLifestyle === 'function') renderCareerLifestyle();
}

function purchaseCareerLifestyleItem(category, id) {
    if (!canChangeCareerLifestyle()) return false;
    const meta = CAREER_LIFESTYLE_META[category];
    const item = getCareerLifestyleItem(category, id);
    const state = getCareerLifestyleState();
    if (!meta || !item || !state || state[meta.owned].includes(id)) return false;
    if (!isCareerLifestyleRequirementMet(category, id)) {
        refreshCareerLifestyleViews('trophyRequired', { amount: item.requiresTrophies || 1 });
        return false;
    }
    if ((Number(player.budget) || 0) < item.cost) {
        refreshCareerLifestyleViews('insufficient', { amount: item.cost });
        return false;
    }
    const itemName = typeof trCareerLifestyle === 'function' ? trCareerLifestyle(`${category}.${id}`) : id;
    const displayAmount = typeof careerLifestyleMoney === 'function' ? careerLifestyleMoney(item.cost) : `£${item.cost}`;
    const confirmed = typeof confirm !== 'function' || confirm(typeof trCareerLifestyle === 'function'
        ? trCareerLifestyle('confirmPurchase', { item: itemName, amount: displayAmount })
        : `Purchase ${itemName} for £${item.cost}?`);
    if (!confirmed) return false;

    player.budget -= item.cost;
    state[meta.owned].push(id);
    state[meta.active] = id;
    state.lastPurchaseOn = getCareerLifestyleDateKey();
    refreshCareerLifestyleViews('purchased', { item: itemName, amount: item.cost });
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function activateCareerLifestyleItem(category, id) {
    if (!canChangeCareerLifestyle()) return false;
    const meta = CAREER_LIFESTYLE_META[category];
    const state = getCareerLifestyleState();
    if (!meta || !state || !state[meta.owned].includes(id) || state[meta.active] === id) return false;
    state[meta.active] = id;
    const itemName = typeof trCareerLifestyle === 'function' ? trCareerLifestyle(`${category}.${id}`) : id;
    refreshCareerLifestyleViews('activated', { item: itemName });
    if (typeof renderCareerLifestyleTrophyRoom === 'function') renderCareerLifestyleTrophyRoom();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function getCareerLifestyleTrophyName(trophy) {
    if (typeof getTournamentDisplayName === 'function') return getTournamentDisplayName(trophy);
    if (trophy && typeof trophy === 'object') return trophy.name || trophy.tournament || '';
    return String(trophy || '');
}

function normalizeCareerLifestyleTrophyName(trophy) {
    return getCareerLifestyleTrophyName(trophy).trim().toLocaleLowerCase();
}

function getCareerLifestyleTrophyCollection(candidate = player) {
    const trophies = Array.isArray(candidate?.careerStats?.trophies) ? candidate.careerStats.trophies : [];
    const chronicle = Array.isArray(candidate?.careerChronicle)
        ? candidate.careerChronicle.filter(event => event?.type === 'trophy')
            .sort((first, second) => (Number(first.timestamp) || 0) - (Number(second.timestamp) || 0))
        : [];
    const eventQueues = new Map();
    chronicle.forEach(event => {
        const key = normalizeCareerLifestyleTrophyName(event.tournament);
        if (!eventQueues.has(key)) eventQueues.set(key, []);
        eventQueues.get(key).push(event);
    });
    return trophies.map((trophy, index) => {
        const name = getCareerLifestyleTrophyName(trophy);
        const event = eventQueues.get(normalizeCareerLifestyleTrophyName(trophy))?.shift() || null;
        const timestamp = Number(event?.timestamp) || 0;
        const date = timestamp ? new Date(timestamp) : null;
        return {
            key: `trophy-${index}`,
            name,
            timestamp,
            year: date && !Number.isNaN(date.getTime()) ? date.getFullYear() : null,
            prize: Math.max(0, Number(event?.prize) || 0)
        };
    });
}

function getCareerLifestyleFeaturedTrophies(candidate = player) {
    const state = getCareerLifestyleState(candidate);
    const collection = getCareerLifestyleTrophyCollection(candidate);
    if (!state) return [];
    const keys = new Set(collection.map(trophy => trophy.key));
    state.featuredTrophyKeys = state.featuredTrophyKeys.filter(key => keys.has(key)).slice(0, 3);
    const selected = state.featuredTrophyKeys.map(key => collection.find(trophy => trophy.key === key)).filter(Boolean);
    return selected.length ? selected : [...collection].slice(-3).reverse();
}

function toggleFeaturedCareerTrophy(key) {
    if (!canChangeCareerLifestyle()) return false;
    const state = getCareerLifestyleState();
    const collection = getCareerLifestyleTrophyCollection();
    if (!collection.some(trophy => trophy.key === key)) return false;
    const index = state.featuredTrophyKeys.indexOf(key);
    if (index >= 0) {
        state.featuredTrophyKeys.splice(index, 1);
    } else {
        if (state.featuredTrophyKeys.length >= 3) {
            refreshCareerLifestyleViews('featuredLimit');
            return false;
        }
        state.featuredTrophyKeys.push(key);
    }
    if (typeof renderCareerLifestyleTrophyRoom === 'function') renderCareerLifestyleTrophyRoom();
    if (typeof renderCareerLifestyle === 'function') renderCareerLifestyle();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}
