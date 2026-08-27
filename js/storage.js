const CAREER_INDEXED_DB_NAME = 'dartsCareerStorage';
const CAREER_INDEXED_DB_VERSION = 4;
const CAREER_INDEXED_DB_STORE = 'careerSaves';
const CAREER_INDEXED_DB_MEDIA_STORE = 'profileMedia';
const CAREER_INDEXED_DB_MOD_STORE = 'modPackages';
const CAREER_INDEXED_DB_PRIMARY_KEY = 'primary';
const CAREER_INDEXED_DB_ACTIVE_MOD_KEY = 'active';
const CAREER_PROFILE_MEDIA_KEYS = Object.freeze({
    photo: 'career-profile-photo',
    walkon: 'career-profile-walkon'
});
const CAREER_PROFILE_MEDIA_METADATA_KEY = 'career-profile-media-metadata';
const careerProfileMediaRevisions = new WeakMap();

let careerIndexedDbPromise = null;
const careerProfileMediaRuntime = {
    photo: { blob: null, url: '' },
    walkon: { blob: null, url: '' }
};

function canUseIndexedDbCareerStorage() {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
}

function openCareerSaveDatabase() {
    if (!canUseIndexedDbCareerStorage()) {
        return Promise.reject(new Error('IndexedDB nie jest dostępne w tej przeglądarce.'));
    }
    if (careerIndexedDbPromise) return careerIndexedDbPromise;

    careerIndexedDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(CAREER_INDEXED_DB_NAME, CAREER_INDEXED_DB_VERSION);
        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(CAREER_INDEXED_DB_STORE)) {
                database.createObjectStore(CAREER_INDEXED_DB_STORE, { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains(CAREER_INDEXED_DB_MEDIA_STORE)) {
                database.createObjectStore(CAREER_INDEXED_DB_MEDIA_STORE, { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains(CAREER_INDEXED_DB_MOD_STORE)) {
                database.createObjectStore(CAREER_INDEXED_DB_MOD_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => {
            const database = request.result;
            database.onversionchange = () => {
                database.close();
                careerIndexedDbPromise = null;
            };
            resolve(database);
        };
        request.onerror = () => {
            careerIndexedDbPromise = null;
            reject(request.error || new Error('Nie udało się otworzyć IndexedDB.'));
        };
    });
    return careerIndexedDbPromise;
}

function isCareerProfileMediaBlob(value) {
    return typeof Blob !== 'undefined' && value instanceof Blob;
}

function getCareerProfileMediaRevision(blob) {
    if (!careerProfileMediaRevisions.has(blob)) {
        let revision;
        // Nie korzystamy z Math.random(), aby zapis nie zużywał losowań gry.
        // Gdy brak bezpiecznego identyfikatora, zachowujemy dotychczasowy pełny zapis.
        try {
            if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
                revision = crypto.randomUUID();
            } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
                revision = Array.from(crypto.getRandomValues(new Uint32Array(4)), part => part.toString(16).padStart(8, '0')).join('');
            }
        } catch (_) {
            return undefined;
        }
        if (!revision) return undefined;
        careerProfileMediaRevisions.set(blob, revision);
    }
    return careerProfileMediaRevisions.get(blob);
}

function revokeCareerProfileMediaUrl(kind) {
    const runtime = careerProfileMediaRuntime[kind];
    if (!runtime?.url || typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') return;
    URL.revokeObjectURL(runtime.url);
    runtime.url = '';
}

function clearCareerProfileMediaRuntime() {
    Object.keys(careerProfileMediaRuntime).forEach(kind => {
        revokeCareerProfileMediaUrl(kind);
        careerProfileMediaRuntime[kind].blob = null;
    });
}

function applyCareerProfileMediaBlob(kind, blob) {
    const runtime = careerProfileMediaRuntime[kind];
    if (!runtime) return '';
    if (!isCareerProfileMediaBlob(blob)) {
        revokeCareerProfileMediaUrl(kind);
        runtime.blob = null;
        return '';
    }
    if (runtime.blob === blob && runtime.url) return runtime.url;

    revokeCareerProfileMediaUrl(kind);
    runtime.blob = blob;
    runtime.url = typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
        ? URL.createObjectURL(blob)
        : '';
    return runtime.url;
}

function setPlayerProfileMediaFromFile(kind, file) {
    if (!['photo', 'walkon'].includes(kind) || !isCareerProfileMediaBlob(file)) return '';
    const mediaUrl = applyCareerProfileMediaBlob(kind, file);
    if (typeof player !== 'undefined' && player) player[kind] = mediaUrl;
    return mediaUrl;
}

async function getCareerProfileMediaBlob(kind, value) {
    const runtime = careerProfileMediaRuntime[kind];
    if (runtime?.blob && runtime.url && value === runtime.url) return runtime.blob;
    if (isCareerProfileMediaBlob(value)) return value;
    if (typeof getModMediaBlobByUrl === 'function' && typeof moddedAssets !== 'undefined') {
        const modBlob = getModMediaBlobByUrl(moddedAssets, value);
        if (modBlob) return modBlob;
    }
    if (typeof value !== 'string' || !value.startsWith('data:')) return null;

    const response = await fetch(value);
    if (!response.ok) throw new Error(`Nie udało się przekonwertować multimedia profilu: ${kind}.`);
    return response.blob();
}

function blobToCareerDataUrl(blob) {
    if (!isCareerProfileMediaBlob(blob)) return Promise.resolve('');
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error || new Error('Nie udało się odczytać pliku profilu.'));
        reader.readAsDataURL(blob);
    });
}

async function createCareerIndexedDbPayload(gameState) {
    const storedState = {
        ...gameState,
        player: { ...(gameState?.player || {}) }
    };
    const media = {};
    const mediaRefs = {};

    for (const kind of Object.keys(CAREER_PROFILE_MEDIA_KEYS)) {
        const value = storedState.player[kind];
        const blob = await getCareerProfileMediaBlob(kind, value);
        const storageKey = CAREER_PROFILE_MEDIA_KEYS[kind];
        media[storageKey] = blob;
        if (blob) {
            mediaRefs[kind] = storageKey;
            storedState.player[kind] = kind === 'photo' ? '' : null;
        } else if (typeof value === 'string' && value.startsWith('blob:')) {
            // Blob URL nie działa po ponownym uruchomieniu. Bez odpowiadającego mu
            // obiektu binarnego bezpieczniej go pominąć niż zapisać martwy adres.
            storedState.player[kind] = kind === 'photo' ? '' : null;
        }
    }

    if (Object.keys(mediaRefs).length) storedState.profileMediaRefs = mediaRefs;
    else delete storedState.profileMediaRefs;
    const mediaByKind = Object.fromEntries(
        Object.entries(CAREER_PROFILE_MEDIA_KEYS).map(([kind, key]) => [kind, media[key]])
    );
    return { state: storedState, media, mediaByKind };
}

async function createPortableCareerGameState(gameState) {
    const portableState = {
        ...gameState,
        player: { ...(gameState?.player || {}) }
    };
    delete portableState.profileMediaRefs;

    for (const kind of Object.keys(CAREER_PROFILE_MEDIA_KEYS)) {
        const value = portableState.player[kind];
        if (isCareerProfileMediaBlob(value) || (typeof value === 'string' && value.startsWith('blob:'))) {
            const blob = await getCareerProfileMediaBlob(kind, value);
            portableState.player[kind] = blob ? await blobToCareerDataUrl(blob) : (kind === 'photo' ? '' : null);
        }
    }
    return portableState;
}

function applyCareerProfileMediaToPlayer(media = {}) {
    if (typeof player === 'undefined' || !player) return;
    Object.keys(CAREER_PROFILE_MEDIA_KEYS).forEach(kind => {
        const blob = media[kind];
        if (!isCareerProfileMediaBlob(blob)) return;
        player[kind] = applyCareerProfileMediaBlob(kind, blob);
    });
    if (typeof document !== 'undefined') {
        const hubPhoto = document.getElementById('hub-photo');
        if (hubPhoto && player.photo) hubPhoto.src = player.photo;
    }
}

async function writeCareerStateToIndexedDb(gameState, media = undefined) {
    const database = await openCareerSaveDatabase();
    return new Promise((resolve, reject) => {
        const storeNames = media
            ? [CAREER_INDEXED_DB_STORE, CAREER_INDEXED_DB_MEDIA_STORE]
            : [CAREER_INDEXED_DB_STORE];
        const transaction = database.transaction(storeNames, 'readwrite');
        const savedAt = Date.now();
        const request = transaction.objectStore(CAREER_INDEXED_DB_STORE).put({
            id: CAREER_INDEXED_DB_PRIMARY_KEY,
            savedAt,
            state: gameState
        });

        if (media) {
            const mediaStore = transaction.objectStore(CAREER_INDEXED_DB_MEDIA_STORE);
            // Czytamy tylko mały rekord wersji, bez pobierania plików. Sprawdzenie
            // i zapis są w jednej transakcji, więc błąd lub inna karta przeglądarki
            // nie mogą pozostawić kariery z referencją do niewłaściwego pliku.
            const metadataRequest = mediaStore.get(CAREER_PROFILE_MEDIA_METADATA_KEY);
            metadataRequest.onsuccess = () => {
                try {
                    const previous = metadataRequest.result?.revisions;
                    const savedRevisions = previous && typeof previous === 'object' && !Array.isArray(previous)
                        ? previous
                        : {};
                    const nextRevisions = { ...savedRevisions };
                    let mediaChanged = false;

                    Object.entries(media).forEach(([id, blob]) => {
                        const hasBlob = isCareerProfileMediaBlob(blob);
                        const revision = hasBlob ? getCareerProfileMediaRevision(blob) : null;
                        if (revision !== undefined && Object.prototype.hasOwnProperty.call(savedRevisions, id) && savedRevisions[id] === revision) return;

                        if (hasBlob) mediaStore.put({ id, blob, savedAt, revision });
                        else mediaStore.delete(id);
                        nextRevisions[id] = revision;
                        mediaChanged = true;
                    });

                    if (mediaChanged) {
                        mediaStore.put({ id: CAREER_PROFILE_MEDIA_METADATA_KEY, revisions: nextRevisions, savedAt });
                    }
                } catch (error) {
                    transaction.abort();
                    reject(error);
                }
            };
            metadataRequest.onerror = () => reject(metadataRequest.error || transaction.error || new Error('Odczyt wersji multimediów nie powiódł się.'));
        }

        transaction.oncomplete = () => resolve(savedAt);
        transaction.onerror = () => reject(transaction.error || request.error || new Error('Zapis IndexedDB nie powiódł się.'));
        transaction.onabort = () => reject(transaction.error || request.error || new Error('Zapis IndexedDB został przerwany.'));
    });
}

async function readCareerStateFromIndexedDb() {
    const database = await openCareerSaveDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(CAREER_INDEXED_DB_STORE, 'readonly');
        const request = transaction.objectStore(CAREER_INDEXED_DB_STORE).get(CAREER_INDEXED_DB_PRIMARY_KEY);
        request.onsuccess = () => resolve(request.result?.state || null);
        request.onerror = () => reject(request.error || transaction.error || new Error('Odczyt IndexedDB nie powiódł się.'));
    });
}

async function readCareerProfileMediaFromIndexedDb(mediaRefs) {
    if (!mediaRefs || typeof mediaRefs !== 'object') return {};
    const allowedRefs = Object.fromEntries(Object.entries(CAREER_PROFILE_MEDIA_KEYS).map(([kind, key]) => [key, kind]));
    const requestedEntries = Object.entries(mediaRefs)
        .filter(([, key]) => allowedRefs[key]);
    if (!requestedEntries.length) return {};

    const database = await openCareerSaveDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(CAREER_INDEXED_DB_MEDIA_STORE, 'readonly');
        const store = transaction.objectStore(CAREER_INDEXED_DB_MEDIA_STORE);
        const media = {};
        let pending = requestedEntries.length;

        requestedEntries.forEach(([kind, key]) => {
            const request = store.get(key);
            request.onsuccess = () => {
                const record = request.result;
                if (isCareerProfileMediaBlob(record?.blob)) {
                    media[kind] = record.blob;
                    if (typeof record.revision === 'string' && record.revision) {
                        careerProfileMediaRevisions.set(record.blob, record.revision);
                    }
                }
                pending--;
                if (pending === 0) resolve(media);
            };
            request.onerror = () => reject(request.error || transaction.error || new Error('Odczyt multimediów profilu nie powiódł się.'));
        });
    });
}

async function writeCareerModPackageToIndexedDb(modPackage, metadata = {}) {
    if (!isCareerProfileMediaBlob(modPackage)) {
        throw new Error('Paczka moda musi być plikiem binarnym.');
    }
    const database = await openCareerSaveDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(CAREER_INDEXED_DB_MOD_STORE, 'readwrite');
        const savedAt = Date.now();
        const record = {
            id: CAREER_INDEXED_DB_ACTIVE_MOD_KEY,
            blob: modPackage,
            name: String(metadata.name || modPackage.name || 'mod.zip'),
            size: Number(modPackage.size) || 0,
            type: String(modPackage.type || 'application/zip'),
            lastModified: Number(metadata.lastModified || modPackage.lastModified) || null,
            savedAt
        };
        const request = transaction.objectStore(CAREER_INDEXED_DB_MOD_STORE).put(record);
        transaction.oncomplete = () => resolve({ ...record });
        transaction.onerror = () => reject(transaction.error || request.error || new Error('Zapis moda w IndexedDB nie powiódł się.'));
        transaction.onabort = () => reject(transaction.error || request.error || new Error('Zapis moda w IndexedDB został przerwany.'));
    });
}

async function readCareerModPackageFromIndexedDb() {
    const database = await openCareerSaveDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(CAREER_INDEXED_DB_MOD_STORE, 'readonly');
        const request = transaction.objectStore(CAREER_INDEXED_DB_MOD_STORE).get(CAREER_INDEXED_DB_ACTIVE_MOD_KEY);
        request.onsuccess = () => {
            const record = request.result;
            resolve(record && isCareerProfileMediaBlob(record.blob) ? record : null);
        };
        request.onerror = () => reject(request.error || transaction.error || new Error('Odczyt moda z IndexedDB nie powiódł się.'));
    });
}

async function deleteCareerModPackageFromIndexedDb() {
    const database = await openCareerSaveDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(CAREER_INDEXED_DB_MOD_STORE, 'readwrite');
        const request = transaction.objectStore(CAREER_INDEXED_DB_MOD_STORE).delete(CAREER_INDEXED_DB_ACTIVE_MOD_KEY);
        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error || request.error || new Error('Usunięcie zapamiętanego moda nie powiodło się.'));
        transaction.onabort = () => reject(transaction.error || request.error || new Error('Usunięcie zapamiętanego moda zostało przerwane.'));
    });
}
