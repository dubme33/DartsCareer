// ZIP pozostaje skompresowany. Nie tworzymy tekstowych kopii Base64 jego plików.
const MOD_MUSIC_CACHE_BYTES = 32 * 1024 * 1024;
const MOD_MUSIC_CACHE_ENTRIES = 4;
const modMediaRuntimes = new WeakMap();

function createEmptyModAssets() {
    return { photos: Object.create(null), music: Object.create(null), sounds: Object.create(null), sponsors: Object.create(null) };
}

async function readModEntryBlob(entry, mimeType) {
    const blob = await entry.async('blob');
    if (!(blob instanceof Blob)) throw new Error('Niepoprawny plik binarny w modzie.');
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

async function createModMediaAssets(zipContent) {
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
        const folder = relativePath.split('/')[0];
        const filename = relativePath.split('/').pop();
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex <= 0) return;
        const name = filename.slice(0, dotIndex);
        const extension = filename.slice(dotIndex + 1).toLowerCase();
        if (folder === 'music' && audioTypes[extension]) {
            runtime.musicEntries.set(name, { entry, mimeType: audioTypes[extension] });
            assets.music[name] = true; // Obecność utworu, nie gotowy adres audio.
        } else if ((folder === 'zdjecia' || folder === 'sponsors') && imageTypes[extension]) {
            const kind = folder === 'zdjecia' ? 'photos' : 'sponsors';
            eagerEntries.set(`${kind}:${name}`, { kind, name, entry, mimeType: imageTypes[extension] });
        } else if (folder === 'sounds' && audioTypes[extension]) {
            eagerEntries.set(`sounds:${name.toLowerCase()}`, { kind: 'sounds', name: name.toLowerCase(), entry, mimeType: audioTypes[extension] });
        }
    });

    // Tylko kilka plików naraz: bez skoku RAM od Promise.all dla całego moda.
    const entries = [...eagerEntries.values()];
    let nextEntry = 0;
    const workers = Array.from({ length: Math.min(4, entries.length) }, async () => {
        while (!runtime.disposed && nextEntry < entries.length) {
            const descriptor = entries[nextEntry++];
            const blob = await readModEntryBlob(descriptor.entry, descriptor.mimeType);
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
        cached.pending = readModEntryBlob(descriptor.entry, descriptor.mimeType).then(blob => {
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
