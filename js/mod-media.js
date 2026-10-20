// ZIP pozostaje skompresowany. Nie tworzymy tekstowych kopii Base64 jego plików.
const MOD_MUSIC_CACHE_BYTES = 32 * 1024 * 1024;
const MOD_MUSIC_CACHE_ENTRIES = 4;
const modMediaRuntimes = new WeakMap();
let modWalkonRandomState = Date.now() >>> 0;

function createEmptyModAssets() {
    return { photos: Object.create(null), music: Object.create(null), sounds: Object.create(null), callers: Object.create(null), sponsors: Object.create(null), dartboards: Object.create(null), surrounds: Object.create(null), walkons: [] };
}

// Radius fractions refer to the shorter side of the original photograph.
function validateModDartboardConfig(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)
        || typeof config.image !== 'string' || !config.image.trim()
        || /[/\\]/.test(config.image) || config.image.length > 120) {
        throw new Error('Niepoprawna konfiguracja tarczy: dartboard.image musi wskazywać nazwę obrazu w folderze dartboards.');
    }
    const center = config.center ?? [.5, .5];
    const radii = config.radii ?? [6.5, 16, 70, 80, 120, 130, 170].map(radius => radius / 340);
    if (!Array.isArray(center) || center.length !== 2 || !center.every(value => Number.isFinite(value) && value > 0 && value < 1)
        || !Array.isArray(radii) || radii.length !== 7
        || !radii.every((value, index) => Number.isFinite(value) && value > 0 && value <= .5 && (index === 0 || value > radii[index - 1]))) {
        throw new Error('Niepoprawny środek lub promienie pierścieni tarczy w modzie.');
    }
    const rotation = config.rotation ?? 0;
    if (!Number.isFinite(rotation) || Math.abs(rotation) > 360 || (config.name !== undefined && typeof config.name !== 'string')) {
        throw new Error('Niepoprawna nazwa lub obrót tarczy w modzie.');
    }
    return { image: config.image.trim(), name: (config.name || config.image).trim().slice(0, 100), center: [...center], radii: [...radii], rotation };
}

function validateModSurroundConfig(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)
        || typeof config.image !== 'string' || !config.image.trim() || /[/\\]/.test(config.image) || config.image.length > 120)
        throw new Error('Niepoprawna konfiguracja opony: surround.image musi wskazywać obraz w folderze surrounds.');
    const center = config.center ?? [.5, .5], radii = config.radii ?? [.31, .49], rotation = config.rotation ?? 0;
    if (!Array.isArray(center) || center.length !== 2 || !center.every(value => Number.isFinite(value) && value > 0 && value < 1)
        || !Array.isArray(radii) || radii.length !== 2 || !radii.every(Number.isFinite)
        || radii[0] <= 0 || radii[1] <= radii[0] || radii[1] > .5
        || !Number.isFinite(rotation) || Math.abs(rotation) > 360
        || (config.name !== undefined && typeof config.name !== 'string'))
        throw new Error('Niepoprawny środek, promienie lub obrót opony w modzie.');
    return { image: config.image.trim(), name: (config.name || config.image).trim().slice(0, 100), center: [...center], radii: [...radii], rotation };
}

const MOD_SPONSOR_LOGO_ALIAS_GROUPS = Object.freeze([
    Object.freeze(['elten', 'eltensafetyshoes'])
]);

function normalizeModSponsorLogoName(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('en')
        .replace(/[^a-z0-9]/g, '');
}

function getModSponsorLogoAsset(assets, sponsorName) {
    const sponsorAssets = assets?.sponsors;
    if (!sponsorAssets || typeof sponsorAssets !== 'object') return '';
    if (typeof sponsorAssets[sponsorName] === 'string') return sponsorAssets[sponsorName];

    const normalizedName = normalizeModSponsorLogoName(sponsorName);
    if (!normalizedName) return '';
    const acceptedNames = new Set([normalizedName]);
    MOD_SPONSOR_LOGO_ALIAS_GROUPS.forEach(group => {
        if (group.includes(normalizedName)) group.forEach(alias => acceptedNames.add(alias));
    });
    const match = Object.entries(sponsorAssets).find(([assetName, assetUrl]) =>
        typeof assetUrl === 'string' && acceptedNames.has(normalizeModSponsorLogoName(assetName)));
    return match?.[1] || '';
}

async function readModEntryBlob(entry, mimeType, sniffAudio = false) {
    const blob = await entry.async('blob');
    if (!(blob instanceof Blob)) throw new Error('Niepoprawny plik binarny w modzie.');
    if (sniffAudio) {
        // A few supplied .wav recordings actually contain MP3 data. Preserve
        // their bytes and score keys, but give the browser the real MIME type.
        const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
        const text = String.fromCharCode(...header);
        if (text.startsWith('RIFF') && text.slice(8, 12) === 'WAVE') mimeType = 'audio/wav';
        else if (text.startsWith('ID3') || header[0] === 0xff && (header[1] & 0xe0) === 0xe0) mimeType = 'audio/mpeg';
        else if (text.startsWith('OggS')) mimeType = 'audio/ogg';
    }
    return blob.type === mimeType ? blob : blob.slice(0, blob.size, mimeType);
}

function removeModMusicCacheEntry(runtime, key, entry) {
    if (entry.url) URL.revokeObjectURL(entry.url);
    runtime.musicBytes -= entry.blob?.size || 0;
    entry.url = '';
    entry.blob = null;
    runtime.musicCache.delete(key);
}

function trimModMusicCache(runtime) {
    const unused = [...runtime.musicCache.entries()]
        .filter(([, entry]) => entry.users === 0 && entry.url)
        .sort((first, second) => first[1].lastUsed - second[1].lastUsed);
    for (const [key, entry] of unused) {
        if (!runtime.disposed && runtime.musicBytes <= MOD_MUSIC_CACHE_BYTES
            && runtime.musicCache.size <= MOD_MUSIC_CACHE_ENTRIES) break;
        removeModMusicCacheEntry(runtime, key, entry);
    }
}

function disposeModMediaAssets(assets) {
    const runtime = modMediaRuntimes.get(assets);
    if (!runtime || runtime.disposed) return;
    runtime.disposed = true;
    runtime.eagerBlobs.forEach((_, url) => URL.revokeObjectURL(url));
    runtime.eagerBlobs.clear();
    runtime.musicEntries.clear();
    // Trwające odtwarzanie ma własne zwolnienie; nie unieważniamy mu adresu.
    trimModMusicCache(runtime);
}

async function createModMediaAssets(zipContent, reuse = null) {
    const assets = createEmptyModAssets();
    const runtime = {
        disposed: false, eagerBlobs: new Map(), musicEntries: new Map(),
        musicCache: new Map(), musicBytes: 0, clock: 0
    };
    modMediaRuntimes.set(assets, runtime);
    const imageTypes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
    const audioTypes = { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg' };
    const eagerEntries = new Map();

    zipContent.forEach((relativePath, entry) => {
        if (entry.dir) return;
        // ZIP folder names may keep the capitalisation chosen in Explorer.
        // Keep file stems unchanged: player and manifest image keys are exact.
        const folder = relativePath.split('/')[0].toLowerCase();
        const filename = relativePath.split('/').pop();
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex <= 0) return;
        const name = filename.slice(0, dotIndex);
        const extension = filename.slice(dotIndex + 1).toLowerCase();
        const randomWalkon = /^walkon\/r([1-9]|[1-6]\d|70)\.mp3$/i.exec(relativePath);
        const caller = /^callers\/(russbray|huwware|kirkbevins)\/([^/]+)\.(mp3|wav|ogg)$/i.exec(relativePath);
        if (caller) {
            const id = caller[1].toLowerCase(), key = caller[2].toLowerCase();
            assets.callers[id] ||= Object.create(null);
            assets.callers[id][key] = true;
            // Caller recordings share the bounded audio cache, rather than
            // unpacking every voice during import or duplicating legacy sounds.
            runtime.musicEntries.set(`caller/${id}/${key}`, { entry, mimeType: audioTypes[extension], sniffAudio: true });
        } else if (randomWalkon) {
            const track = `r${Number(randomWalkon[1])}`;
            // Keep the pool separate from personal files named after players.
            runtime.musicEntries.set(`walkon/${track}`, { entry, mimeType: 'audio/mpeg' });
            if (!assets.walkons.includes(track)) assets.walkons.push(track);
        } else if (folder === 'music' && audioTypes[extension]) {
            runtime.musicEntries.set(name, { entry, mimeType: audioTypes[extension] });
            assets.music[name] = true; // Obecność utworu, nie gotowy adres audio.
        } else if (['zdjecia', 'sponsors', 'dartboards', 'surrounds'].includes(folder) && imageTypes[extension]) {
            const kind = folder === 'zdjecia' ? 'photos' : folder;
            eagerEntries.set(`${kind}:${name}`, { kind, name, entry, mimeType: imageTypes[extension] });
        } else if (folder === 'sounds' && audioTypes[extension]) {
            eagerEntries.set(`sounds:${name.toLowerCase()}`, { kind: 'sounds', name: name.toLowerCase(), entry, mimeType: audioTypes[extension] });
        }
    });
    assets.walkons.sort((first, second) => Number(first.slice(1)) - Number(second.slice(1)));

    // Tylko kilka plików naraz: bez skoku RAM od Promise.all dla całego moda.
    const entries = [...eagerEntries.values()];
    // Only an overlay built from the active ZIP may reuse its unchanged folders.
    // Each runtime owns a separate URL, so a failed import cannot revoke the old mod.
    const reusableKinds = new Set(reuse?.kinds || []);
    let nextEntry = 0;
    const workers = Array.from({ length: Math.min(4, entries.length) }, async () => {
        while (!runtime.disposed && nextEntry < entries.length) {
            const descriptor = entries[nextEntry++];
            const previousUrl = reuse?.assets?.[descriptor.kind]?.[descriptor.name];
            const previousBlob = reusableKinds.has(descriptor.kind)
                ? getModMediaBlobByUrl(reuse.assets, previousUrl) : null;
            const blob = previousBlob || await readModEntryBlob(descriptor.entry, descriptor.mimeType);
            if (runtime.disposed) return;
            const url = URL.createObjectURL(blob);
            runtime.eagerBlobs.set(url, blob);
            assets[descriptor.kind][descriptor.name] = url;
        }
    });
    try {
        await Promise.all(workers);
        return assets;
    } catch (error) {
        disposeModMediaAssets(assets);
        await Promise.allSettled(workers);
        throw error;
    }
}

async function acquireModMusicAsset(assets, name) {
    const legacyUrl = assets?.music?.[name];
    if (typeof legacyUrl === 'string') return { url: legacyUrl, blob: null, release() {} };
    const runtime = modMediaRuntimes.get(assets);
    const descriptor = runtime?.musicEntries.get(name);
    if (!runtime || runtime.disposed || !descriptor) return { url: '', blob: null, release() {} };
    let cached = runtime.musicCache.get(name);
    if (!cached) {
        cached = { users: 0, url: '', blob: null, lastUsed: ++runtime.clock, pending: null };
        runtime.musicCache.set(name, cached);
        cached.pending = readModEntryBlob(descriptor.entry, descriptor.mimeType, descriptor.sniffAudio).then(blob => {
            if (runtime.disposed) throw new Error('Paczka moda została zmieniona podczas odczytu muzyki.');
            cached.url = URL.createObjectURL(blob);
            cached.blob = blob;
            runtime.musicBytes += blob.size;
            trimModMusicCache(runtime);
        }).catch(error => {
            if (runtime.musicCache.get(name) === cached) runtime.musicCache.delete(name);
            throw error;
        });
    }
    cached.users++;
    cached.lastUsed = ++runtime.clock;
    try {
        await cached.pending;
        if (runtime.disposed) throw new Error('Paczka moda została zmieniona podczas odczytu muzyki.');
    } catch (error) {
        cached.users--;
        trimModMusicCache(runtime);
        throw error;
    }
    let released = false;
    return {
        url: cached.url,
        blob: cached.blob,
        release() {
            if (released) return;
            released = true;
            cached.users--;
            cached.lastUsed = ++runtime.clock;
            trimModMusicCache(runtime);
        }
    };
}

function getRandomModWalkonIndex(length) {
    // Audio variation must not consume the sport simulation's Math.random stream.
    const limit = 0x100000000 - 0x100000000 % length;
    let sample;
    do {
        try {
            if (typeof globalThis.crypto?.getRandomValues !== 'function') throw new Error('Crypto unavailable');
            sample = globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
        } catch (_) {
            modWalkonRandomState = (Math.imul(modWalkonRandomState, 1664525) + 1013904223) >>> 0;
            sample = modWalkonRandomState;
        }
    } while (sample >= limit);
    return sample % length;
}

async function acquireRandomModWalkonAsset(assets) {
    const pool = assets?.walkons;
    if (!Array.isArray(pool) || !pool.length) return { url: '', blob: null, release() {} };
    return acquireModMusicAsset(assets, `walkon/${pool[getRandomModWalkonIndex(pool.length)]}`);
}

async function acquireModCallerAsset(assets, callerId, key) {
    const value = assets?.callers?.[callerId]?.[key];
    if (typeof value === 'string') return { url: value, blob: null, release() {} };
    if (value !== true) return { url: '', blob: null, release() {} };
    return acquireModMusicAsset(assets, `caller/${callerId}/${key}`);
}

function getModMediaBlobByUrl(assets, url) {
    const runtime = modMediaRuntimes.get(assets);
    if (!runtime) return null;
    if (runtime.eagerBlobs.has(url)) return runtime.eagerBlobs.get(url);
    for (const cached of runtime.musicCache.values()) {
        if (cached.url === url) return cached.blob;
    }
    return null;
}

async function getModCareerProfileMedia(assets, name) {
    const photoUrl = assets?.photos?.[name] || '';
    const result = { photo: getModMediaBlobByUrl(assets, photoUrl) || photoUrl, walkon: null };
    try {
        const music = await acquireModMusicAsset(assets, name);
        try { result.walkon = music.blob || music.url || null; }
        finally { music.release(); }
    } catch (error) {
        console.warn('Nie udało się odczytać muzyki zawodnika z moda.', error);
    }
    return result;
}

function getModMediaMemoryStats(assets) {
    const runtime = modMediaRuntimes.get(assets);
    if (!runtime) return { musicBytes: 0, cachedTracks: 0, availableTracks: 0 };
    return {
        musicBytes: runtime.musicBytes,
        cachedTracks: runtime.musicCache.size,
        availableTracks: runtime.musicEntries.size
    };
}
