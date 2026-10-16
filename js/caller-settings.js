const MATCH_CALLERS = Object.freeze({ russbray: 'Russ Bray', huwware: 'Huw Ware', kirkbevins: 'Kirk Bevins' });
const CALLER_SETTINGS_COPY = {
    pl: { title: '🎙 Caller', label: 'Ulubiony caller', random: 'Losowe (domyślnie)', help: 'Jeden caller na cały mecz. Zmiana dotyczy kolejnego meczu. Dodatkowe głosy wymagają nagrań w modzie.', missing: 'Brak nagrań wybranego callera w aktywnym modzie.' },
    en: { title: '🎙 Caller', label: 'Favourite caller', random: 'Random (default)', help: 'One caller for the whole match. Changes apply to the next match. Additional voices require recordings in the mod.', missing: 'The selected caller recordings are missing from the active mod.' },
    de: { title: '🎙 Caller', label: 'Bevorzugter Caller', random: 'Zufällig (Standard)', help: 'Ein Caller für das gesamte Spiel. Änderungen gelten ab dem nächsten Spiel. Zusätzliche Stimmen benötigen Aufnahmen im Mod.', missing: 'Die Aufnahmen des ausgewählten Callers fehlen im aktiven Mod.' },
    nl: { title: '🎙 Caller', label: 'Favoriete caller', random: 'Willekeurig (standaard)', help: 'Eén caller voor de hele wedstrijd. Wijzigingen gelden vanaf de volgende wedstrijd. Extra stemmen vereisen opnamen in de mod.', missing: 'De opnamen van de gekozen caller ontbreken in de actieve mod.' }
};
let callerRandomState = Date.now() >>> 0;

function normalizeCallerPreference(value) {
    return typeof value === 'string' && (value === 'random' || Object.hasOwn(MATCH_CALLERS, value)) ? value : 'random';
}
function getCallerPreference() {
    return normalizeCallerPreference(typeof player === 'undefined' ? null : player?.callerPreference);
}
function getAvailableMatchCallers(assets = typeof moddedAssets === 'undefined' ? null : moddedAssets) {
    return Object.keys(MATCH_CALLERS).filter(id => id === 'russbray'
        || Object.keys(assets?.callers?.[id] || {}).some(key => /^\d+$/.test(key)));
}
function getCallerRandomIndex(length) {
    if (typeof getRandomModWalkonIndex === 'function') return getRandomModWalkonIndex(length);
    // Cosmetic selection never advances the sport simulation's Math.random.
    const limit = 0x100000000 - 0x100000000 % length;
    let value;
    do {
        try {
            if (typeof globalThis.crypto?.getRandomValues !== 'function') throw new Error('Crypto unavailable');
            value = globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
        } catch (_) { callerRandomState = (Math.imul(callerRandomState, 1664525) + 1013904223) >>> 0; value = callerRandomState; }
    } while (value >= limit);
    return value % length;
}
function initializeMatchCaller(match = typeof currentMatch === 'undefined' ? null : currentMatch) {
    if (match && Object.hasOwn(MATCH_CALLERS, match.callerId)) return match.callerId;
    const preference = getCallerPreference(), available = getAvailableMatchCallers();
    const id = preference === 'random' ? available[getCallerRandomIndex(available.length)] : preference;
    if (match) match.callerId = id;
    return id;
}
function refreshCallerSettingsUI() {
    if (typeof document === 'undefined') return;
    const copy = CALLER_SETTINGS_COPY[typeof currentLang === 'string' ? currentLang : 'en'] || CALLER_SETTINGS_COPY.en;
    for (const [id, text] of [['caller-settings-title', copy.title], ['caller-settings-label', copy.label], ['caller-settings-help', copy.help]]) {
        const node = document.getElementById(id); if (node) node.textContent = text;
    }
    const select = document.getElementById('hub-caller-preference');
    if (!select) return;
    const available = getAvailableMatchCallers(), preference = getCallerPreference();
    for (const option of select.options) {
        option.textContent = option.value === 'random' ? copy.random : MATCH_CALLERS[option.value];
        option.disabled = option.value !== 'random' && !available.includes(option.value);
    }
    select.value = preference;
    const status = document.getElementById('caller-settings-status');
    if (status) status.textContent = preference !== 'random' && !available.includes(preference) ? copy.missing : '';
}
function changeCallerPreference(value) {
    if (typeof player === 'undefined' || !player?.name || normalizeCallerPreference(value) !== value) return false;
    player.callerPreference = value;
    refreshCallerSettingsUI();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}
function hasMatchCallerClip(assets, id, key) {
    return Boolean(assets?.callers?.[id]?.[key] || id === 'russbray' && assets?.sounds?.[key]);
}
function getMatchCallerClipKeys(event, id, assets) {
    const aliases = event === 'win_match' ? ['game_shot_match', 'game_show_match', 'game_shot_leg', 'game_shot']
        : event === 'win_leg' ? ['game_shot_leg', 'game_shot'] : [String(event).toLowerCase()];
    const exact = aliases.find(key => hasMatchCallerClip(assets, id, key));
    if (exact) return [exact];
    const score = Number(event);
    if (Number.isInteger(score) && score > 100 && score <= 180
        && hasMatchCallerClip(assets, id, '100') && hasMatchCallerClip(assets, id, String(score - 100))) {
        return ['100', String(score - 100)];
    }
    return id === 'russbray' ? [event === 'win_leg' ? 'game_shot' : aliases[0]] : [];
}
async function acquireMatchCallerClip(assets, id, key) {
    if (assets?.callers?.[id]?.[key] && typeof acquireModCallerAsset === 'function') {
        const clip = await acquireModCallerAsset(assets, id, key);
        if (clip.url) return clip;
    }
    const source = id === 'russbray' ? assets?.sounds?.[key] || `sounds/${key}.wav` : '';
    return { url: source, release() {} };
}
async function playMatchCallerEvent(event, playerName = '', context = null) {
    const match = context ? context.match : typeof currentMatch === 'undefined' ? null : currentMatch;
    const assets = context ? context.assets : typeof moddedAssets === 'undefined' ? null : moddedAssets;
    const id = context ? context.id : initializeMatchCaller(match);
    const current = () => (!match || typeof currentMatch !== 'undefined' && currentMatch === match)
        && (typeof moddedAssets === 'undefined' || moddedAssets === assets);
    const keys = getMatchCallerClipKeys(event, id, assets);
    if (!current()) return;
    if (!keys.length) return playRobotCaller(event, playerName);
    for (const key of keys) {
        let clip;
        try {
            clip = await acquireMatchCallerClip(assets, id, key);
            if (!current()) return;
            if (!clip.url) { await playRobotCaller(event, playerName); return; }
            await playCallerClip(clip.url, keys.length === 1 ? event : Number(key), playerName, !clip.url.startsWith('sounds/'));
        } catch (_error) {
            if (current()) await playRobotCaller(event, playerName);
            return;
        } finally { clip?.release(); }
    }
}
// Only small timing metadata is retained. Decoded audio buffers are discarded,
// and the weak key lets a replaced mod and its cache be collected normally.
const callerRequireStartTimes = new WeakMap();
function getCallerRequireSpeechStart(buffer) {
    const size = Math.max(1, Math.round(buffer.sampleRate * .005));
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) => buffer.getChannelData(i));
    const levels = [];
    let peak = 0;
    for (let start = 0; start < buffer.length; start += size) {
        let energy = 0, samples = 0;
        for (const channel of channels) for (let i = start; i < Math.min(start + size, buffer.length); i++) {
            energy += channel[i] * channel[i]; samples++;
        }
        const rms = Math.sqrt(energy / samples);
        levels.push(rms); peak = Math.max(peak, rms);
    }
    if (!peak) return 0;
    const first = levels.findIndex(level => level >= Math.max(.0005, peak * .006));
    // Keep 25 ms before the first audible sample, including quiet consonants.
    return first > 0 ? Math.max(0, first * size / buffer.sampleRate - .025) : 0;
}
async function getCallerRequireStartTime(assets, id, key, blob) {
    if (!assets || !blob?.arrayBuffer || typeof OfflineAudioContext !== 'function') return 0;
    let times = callerRequireStartTimes.get(assets);
    if (!times) { times = new Map(); callerRequireStartTimes.set(assets, times); }
    const cacheKey = `${id}:${key}`;
    if (!times.has(cacheKey)) times.set(cacheKey, (async () => {
        try {
            const decoder = new OfflineAudioContext(1, 1, 44100);
            const buffer = await decoder.decodeAudioData(await blob.arrayBuffer());
            return getCallerRequireSpeechStart(buffer);
        } catch (_error) { return 0; } // Playback still works when analysis is unavailable.
    })());
    return times.get(cacheKey);
}
async function playMatchCallerRequire(score) {
    const context = { match: typeof currentMatch === 'undefined' ? null : currentMatch,
        assets: typeof moddedAssets === 'undefined' ? null : moddedAssets, id: initializeMatchCaller() };
    const keys = getMatchCallerClipKeys(score, context.id, context.assets);
    if (!['huwware', 'kirkbevins'].includes(context.id) || !keys.length || typeof Audio !== 'function') {
        await playMatchCallerEvent('require', '', context);
        return playMatchCallerEvent(score, '', context);
    }
    const current = () => (!context.match || typeof currentMatch !== 'undefined' && currentMatch === context.match)
        && (typeof moddedAssets === 'undefined' || moddedAssets === context.assets);
    // Unpack, preload and analyse the next number while "You require" plays.
    // Existing mod-media reference counts protect every prepared clip until used.
    const pending = Promise.allSettled(keys.map(async key => {
        const clip = await acquireMatchCallerClip(context.assets, context.id, key);
        const item = { clip, audio: null, startTime: Promise.resolve(0) };
        if (clip.url && current()) {
            try {
                item.audio = new Audio(clip.url);
                item.audio.preload = 'auto';
                item.audio.onerror = () => {}; // Playback owns fallback after the prefix.
                item.audio.load?.();
            } catch (_error) { item.audio = null; }
            item.startTime = getCallerRequireStartTime(context.assets, context.id, key, clip.blob);
        }
        return item;
    }));
    let prepared;
    try {
        await playMatchCallerEvent('require', '', context);
        prepared = await pending;
        if (!current()) return;
        for (let i = 0; i < prepared.length; i++) {
            const result = prepared[i], item = result.status === 'fulfilled' ? result.value : null;
            if (!item?.clip.url) { if (current()) await playRobotCaller(keys.length === 1 ? score : Number(keys[i]), ''); continue; }
            const startTime = await item.startTime;
            if (!current()) return;
            await playCallerClip(item.clip.url, keys.length === 1 ? score : Number(keys[i]), '', true,
                { audio: item.audio, startTime });
        }
    } finally {
        prepared ||= await pending;
        for (const result of prepared) if (result.status === 'fulfilled') {
            const { clip, audio } = result.value;
            if (audio) {
                audio.onerror = null;
                try { audio.pause(); audio.removeAttribute?.('src'); audio.load?.(); } catch (_error) {}
            }
            clip.release();
        }
    }
}
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshCallerSettingsUI);
    else refreshCallerSettingsUI();
}
