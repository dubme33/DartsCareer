const AI_FAVORITE_DOUBLES_CONFIG = Object.freeze({
    version: 1,
    profiles: Object.freeze([
        Object.freeze({ share: 0.45, doubles: Object.freeze([16, 8, 20]) }),
        Object.freeze({ share: 0.45, doubles: Object.freeze([20, 10, 16]) }),
        Object.freeze({ share: 0.07, doubles: Object.freeze([18, 16, 20]) }),
        Object.freeze({ share: 0.03, doubles: Object.freeze([16, 20, 8]) })
    ])
});
const AI_FAVORITE_DOUBLES_BY_NAME = new Map();
function getAiFavoriteDoubleIdentity(name) {
    return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/ł/gi, 'l').toLowerCase().replace(/[^a-z0-9]/g, '');
}
if (typeof AI_FAVORITE_DOUBLE_ENTRIES !== 'undefined') {
    AI_FAVORITE_DOUBLE_ENTRIES.forEach(([baseName, realName, doubles]) => {
        for (const name of [baseName, realName]) AI_FAVORITE_DOUBLES_BY_NAME.set(getAiFavoriteDoubleIdentity(name), doubles);
    });
    for (const [alias, name] of [['Nico Springer', 'Niko Springer'], ['Max Hoop', 'Max Hopp'],
        ['Dominik Gruellich', 'Dominik Grüllich'], ['Sebastian Bielicki', 'Sebastian Białecki']]) {
        AI_FAVORITE_DOUBLES_BY_NAME.set(getAiFavoriteDoubleIdentity(alias), AI_FAVORITE_DOUBLES_BY_NAME.get(getAiFavoriteDoubleIdentity(name)));
    }
}
function pickDefaultAiFavoriteDoubles(roll) {
    let remaining = Math.max(0, Math.min(0.999999, Number(roll) || 0));
    for (const profile of AI_FAVORITE_DOUBLES_CONFIG.profiles) {
        if (remaining < profile.share) return profile.doubles.slice();
        remaining -= profile.share;
    }
    return [16, 20, 8];
}
function getDefaultAiFavoriteDoubles(candidate) {
    // Deterministic migration; no new draw from sporting or career RNG.
    const identity = String(candidate?.id || `${candidate?.sourceName || candidate?.name || ''}|${candidate?.country || ''}`);
    let hash = 2166136261;
    for (const char of identity) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
    return pickDefaultAiFavoriteDoubles(hash / 4294967296);
}
function normalizeAiFavoriteDoubles(values) {
    const used = new Set();
    return Array.from({ length: 3 }, (_, index) => {
        const value = Number(values?.[index]);
        if (!Number.isInteger(value) || value < 1 || value > 20 || used.has(value)) return null;
        used.add(value);
        return value;
    });
}
function initializeAiFavoriteDoubles(candidate, { careerPlayer = null } = {}) {
    if (!candidate || candidate.isBye || candidate === careerPlayer
        || (careerPlayer?.id && candidate.id === careerPlayer.id)
        || (typeof player !== 'undefined' && (candidate === player || (player?.id && candidate.id === player.id)))) return;
    // Editor/player packs and explicit multi-choice mod profiles remain authoritative.
    if (candidate.playerEditorProfileOverride === true || candidate.aiFavoriteDoublesCustom === true) return;
    const existing = normalizeAiFavoriteDoubles(candidate.favoriteDoubles);
    if (existing[0] != null && existing.filter(value => value != null).length >= 2) return;
    const known = !candidate.isNewgen && !candidate.editorCreated
        ? AI_FAVORITE_DOUBLES_BY_NAME.get(getAiFavoriteDoubleIdentity(candidate.name)) : null;
    const defaults = known || getDefaultAiFavoriteDoubles(candidate);
    const legacyFirst = Number(candidate.favoriteDouble ?? existing[0]);
    const first = known ? defaults[0] : Number.isInteger(legacyFirst) && legacyFirst >= 1 && legacyFirst <= 20 ? legacyFirst : defaults[0];
    candidate.favoriteDoubles = [first, ...defaults, 16, 20, 8, 10].filter((value, index, values) => values.indexOf(value) === index).slice(0, 3);
    candidate.favoriteDouble = candidate.favoriteDoubles[0];
    candidate.aiFavoriteDoublesVersion = AI_FAVORITE_DOUBLES_CONFIG.version;
}
function applyModPlayerFavoriteDoubles(candidate, modPlayer) {
    if (!candidate || candidate.playerEditorProfileOverride === true) return;
    if (Array.isArray(modPlayer.favoriteDoubles)) {
        const values = normalizeAiFavoriteDoubles(modPlayer.favoriteDoubles);
        if (values[0] != null) {
            candidate.favoriteDoubles = values;
            candidate.favoriteDouble = values[0];
            candidate.aiFavoriteDoublesCustom = true;
        }
    } else if (modPlayer.favoriteDouble != null) {
        const first = Number(modPlayer.favoriteDouble);
        if (Number.isInteger(first) && first >= 1 && first <= 20) {
            const defaults = normalizeAiFavoriteDoubles(candidate.favoriteDoubles).filter(value => value != null);
            candidate.favoriteDoubles = [first, ...defaults, 16, 20, 8, 10]
                .filter((value, index, values) => values.indexOf(value) === index).slice(0, 3);
            candidate.favoriteDouble = first;
            candidate.aiFavoriteDoublesCustom = true;
        }
    }
}
if (typeof pdcPlayers !== 'undefined') pdcPlayers.forEach(candidate => initializeAiFavoriteDoubles(candidate));
