// Slot payloads and their small index commit together. The old primary entry
// becomes a pointer; a normal autosave therefore writes the world only once.
const CAREER_SLOT_LIMIT = 10;
const CAREER_SLOT_BACKUP_LIMIT = 3;
const CAREER_SLOT_BACKUP_INTERVAL = 5 * 60 * 1000;
let careerSlotRuntimeId = null, careerSlotRuntimeOwner = null, careerSlotActionBusy = false;
let careerSlotStartToken = null, careerSlotNavigationSafe = false, careerSlotMigrationPromise = null;
let careerSlotLastSave = null;
const careerSlotKnownRevisions = new Map();
const careerSlotMediaIds = new WeakMap();
let careerSlotIdCounter = 0;

function createCareerSlotId(prefix = 'career') {
    let suffix;
    try { suffix = globalThis.crypto?.randomUUID?.(); } catch (_) {}
    if (!suffix) suffix = `${Date.now().toString(36)}-${(++careerSlotIdCounter).toString(36)}`;
    return `${prefix}-${suffix}`;
}
function careerSlotError(code) { const error = new Error(code); error.code = code; return error; }
function isCareerSlotOperationBusy() { return careerSlotActionBusy; }
function getActiveCareerSlotId() {
    return typeof player !== 'undefined' && careerSlotRuntimeOwner === player ? careerSlotRuntimeId : null;
}
function getCareerSlotIdForSave() {
    const owner = typeof player !== 'undefined' ? player : null;
    if (!careerSlotRuntimeId || owner !== careerSlotRuntimeOwner) {
        careerSlotRuntimeId = createCareerSlotId(); careerSlotRuntimeOwner = owner;
    }
    return careerSlotRuntimeId;
}
function adoptCareerSlotState(state) {
    careerSlotRuntimeId = typeof state?.careerSlotId === 'string' ? state.careerSlotId : null;
    careerSlotRuntimeOwner = typeof player !== 'undefined' ? player : null;
    if (careerSlotRuntimeId && Number.isInteger(state.careerSlotRevision)) careerSlotKnownRevisions.set(careerSlotRuntimeId, state.careerSlotRevision);
}
function careerSlotProgress(state) {
    const p = state.player || {}, amount = Number(p.prizeMoney) || 0;
    return { playerName: String(p.name || ''), country: String(p.country || ''), gameDate: new Date(state.currentDate).toISOString(),
        overall: Math.round(Number(p.overall ?? p.ovr) || 0), prizeMoney: amount,
        trophies: Array.isArray(p.careerStats?.trophies) ? p.careerStats.trophies.length : 0,
        tourCard: p.hasTourCard === true, tournament: state.activeTournament?.name || '' };
}
async function careerSlotTransaction(mode, work, includeLegacyMedia = false) {
    const database = await openCareerSaveDatabase();
    let transaction, failure = null, result;
    return withCareerStorageDeadline(new Promise((resolve, reject) => {
        const stores = [CAREER_INDEXED_DB_STORE, CAREER_INDEXED_DB_SLOT_STORE, CAREER_INDEXED_DB_SLOT_META_STORE,
            ...(includeLegacyMedia ? [CAREER_INDEXED_DB_MEDIA_STORE] : [])];
        transaction = database.transaction(stores, mode);
        const fail = error => { failure = error; try { transaction.abort(); } catch (_) {} reject(error); };
        const safe = callback => { try { callback(); } catch (error) { fail(error); } };
        const api = {
            get(store, key, callback) {
                const request = transaction.objectStore(store).get(key);
                request.onsuccess = () => safe(() => callback(request.result));
                request.onerror = () => fail(request.error || transaction.error || careerSlotError('CAREER_SLOT_READ_FAILED'));
            },
            all(store, callback) {
                const request = transaction.objectStore(store).getAll();
                request.onsuccess = () => safe(() => callback(request.result));
                request.onerror = () => fail(request.error || transaction.error || careerSlotError('CAREER_SLOT_READ_FAILED'));
            },
            put(store, record) { transaction.objectStore(store).put(record); },
            remove(store, id) { transaction.objectStore(store).delete(id); },
            done(value) { result = value; }
        };
        transaction.oncomplete = () => resolve(result);
        transaction.onerror = () => reject(failure || transaction.error || careerSlotError('CAREER_SLOT_WRITE_FAILED'));
        transaction.onabort = () => reject(failure || transaction.error || careerSlotError('CAREER_SLOT_WRITE_FAILED'));
        safe(() => work(api));
    }), 'accessing career slots', () => { try { transaction?.abort(); } finally { disableUnresponsiveCareerIndexedDb(database); } });
}
function normalizeCareerSlotPayload(state, id, media = {}) {
    const stored = { ...state, careerSlotId: id, player: { ...state.player } };
    delete stored.careerSlotRevision; delete stored.browserSavedAt;
    const blobs = {};
    for (const kind of ['photo', 'walkon']) {
        const blob = media[kind] ?? media[CAREER_PROFILE_MEDIA_KEYS[kind]];
        if (isCareerProfileMediaBlob(blob)) {
            blobs[kind] = blob; stored.player[kind] = kind === 'photo' ? '' : null;
        } else if (typeof stored.player[kind] === 'string' && stored.player[kind].startsWith('blob:')) {
            stored.player[kind] = kind === 'photo' ? '' : null;
        }
    }
    if (Object.keys(blobs).length) stored.profileMediaRefs = { slotId: id };
    else delete stored.profileMediaRefs;
    return { id, state: stored, media: blobs };
}
function careerSlotMediaKey(kind, blob) {
    let revision = getCareerProfileMediaRevision(blob);
    if (!revision) { if (!careerSlotMediaIds.has(blob)) careerSlotMediaIds.set(blob, createCareerSlotId('media')); revision = careerSlotMediaIds.get(blob); }
    return { id: `media:${kind}:${revision}`, revision };
}
function storeCareerSlotPayload(api, payload, knownRecords, preservedRefs = null) {
    const refs = preservedRefs ? { ...preservedRefs } : {};
    for (const [kind, blob] of Object.entries(payload.media || {})) {
        const media = careerSlotMediaKey(kind, blob); refs[kind] = media.id;
        if (!knownRecords.some(record => record.id === media.id && record.kind === 'media')) {
            api.put(CAREER_INDEXED_DB_SLOT_STORE, { id: media.id, blob, revision: media.revision });
            api.put(CAREER_INDEXED_DB_SLOT_META_STORE, { id: media.id, kind: 'media' });
        }
    }
    const state = { ...payload.state, player: { ...payload.state.player } };
    if (Object.keys(refs).length) { state.profileMediaRefs = { slotId: state.careerSlotId }; for (const kind of Object.keys(refs)) state.player[kind] = kind === 'photo' ? '' : null; }
    else delete state.profileMediaRefs;
    const { media: _binary, ...stored } = payload;
    return { ...stored, state, mediaRefs: refs };
}
function cleanCareerSlotMedia(api, oldRecords, remainingRecords) {
    const referenced = new Set(remainingRecords.filter(meta => ['slot', 'backup'].includes(meta.kind)).flatMap(meta => meta.mediaKeys || []));
    oldRecords.filter(meta => meta.kind === 'media' && !referenced.has(meta.id)).forEach(meta => {
        api.remove(CAREER_INDEXED_DB_SLOT_STORE, meta.id); api.remove(CAREER_INDEXED_DB_SLOT_META_STORE, meta.id);
    });
}
async function ensureCareerSlotMigration() {
    if (careerSlotMigrationPromise) return careerSlotMigrationPromise;
    careerSlotMigrationPromise = (async () => {
        let fallback = null;
        try {
            const value = localStorage.getItem(typeof LEGACY_CAREER_SAVE_KEY !== 'undefined' ? LEGACY_CAREER_SAVE_KEY : 'dartsCareerSave');
            if (value) { fallback = JSON.parse(value); validateGameState(fallback); }
        } catch (_) { fallback = null; }
        return careerSlotTransaction('readwrite', api => {
            api.get(CAREER_INDEXED_DB_STORE, CAREER_INDEXED_DB_PRIMARY_KEY, primary => {
                api.all(CAREER_INDEXED_DB_SLOT_META_STORE, records => {
                    const marker = records.find(record => record.id === 'migration');
                    const old = primary?.state;
                    let validOld = false;
                    try { if (old) { validateGameState(old); validOld = true; } } catch (_) {}
                    const newerFallback = fallback && Number(fallback.browserSavedAt || 0) > Number(primary?.savedAt || 0);
                    const alreadyRecovered = marker && Number(fallback?.browserSavedAt || 0) <= Number(marker.recoveredAt || 0)
                        && fallback?.careerSlotId === marker.recoveredSourceId;
                    const deleted = records.some(record => record.id === fallback?.careerSlotId && record.kind === 'deleted');
                    const freshLegacyFallback = Number(fallback?.browserSavedAt || 0) > Number(marker?.legacyProcessedAt || 0);
                    const shouldRecover = fallback && !alreadyRecovered && !deleted && (!marker || fallback.careerSlotId || freshLegacyFallback) && (!primary || newerFallback);
                    const candidates = [];
                    if (validOld) candidates.push({ state: old, savedAt: Number(primary.savedAt) || Date.now(), reason: 'migrated', legacyMedia: true });
                    if (shouldRecover) candidates.push({ state: fallback, savedAt: Number(fallback.browserSavedAt) || Date.now(), reason: 'recovered', legacyMedia: false });
                    let pending = candidates.length, selected = null;
                    const finish = () => {
                        if (selected) api.put(CAREER_INDEXED_DB_STORE, { id: CAREER_INDEXED_DB_PRIMARY_KEY, slotId: selected.id, savedAt: selected.savedAt });
                        api.put(CAREER_INDEXED_DB_SLOT_META_STORE, { ...marker, id: 'migration', kind: 'migration', version: 1,
                            legacyProcessedAt: Math.max(Number(marker?.legacyProcessedAt || 0), Number(fallback?.browserSavedAt || 0)),
                            ...(shouldRecover ? { recoveredAt: Number(fallback.browserSavedAt) || 0, recoveredSourceId: fallback.careerSlotId } : {}) });
                        api.done(true);
                    };
                    if (!pending) { finish(); return; }
                    candidates.sort((a, b) => a.savedAt - b.savedAt).forEach(item => {
                        const id = createCareerSlotId(item.reason), media = {};
                        const write = () => {
                            const payload = storeCareerSlotPayload(api, normalizeCareerSlotPayload(item.state, id, media), records);
                            api.put(CAREER_INDEXED_DB_SLOT_STORE, { ...payload, revision: 1 });
                            api.put(CAREER_INDEXED_DB_SLOT_META_STORE, { id, kind: 'slot', savedAt: item.savedAt,
                                revision: 1, label: '', lastBackupAt: 0, reason: item.reason, mediaKeys: Object.values(payload.mediaRefs), ...careerSlotProgress(item.state) });
                            if (!selected || item.savedAt >= selected.savedAt) selected = { id, savedAt: item.savedAt };
                            if (--pending === 0) finish();
                        };
                        const refs = item.legacyMedia ? Object.entries(item.state.profileMediaRefs || {}).filter(([kind, key]) => CAREER_PROFILE_MEDIA_KEYS[kind] === key) : [];
                        let remaining = refs.length;
                        if (!remaining) write();
                        else refs.forEach(([kind, key]) => api.get(CAREER_INDEXED_DB_MEDIA_STORE, key, record => {
                            if (isCareerProfileMediaBlob(record?.blob)) media[kind] = record.blob;
                            if (--remaining === 0) write();
                        }));
                    });
                });
            });
        }, true);
    })().catch(error => { careerSlotMigrationPromise = null; throw error; });
    return careerSlotMigrationPromise;
}
async function readCareerSlotRecord(id, backupId = null) {
    await ensureCareerSlotMigration();
    const key = backupId || id;
    return careerSlotTransaction('readonly', api => api.get(CAREER_INDEXED_DB_SLOT_META_STORE, key, meta => {
        if (!meta || (backupId ? meta.kind !== 'backup' || meta.slotId !== id : meta.kind !== 'slot')) { api.done(null); return; }
        api.get(CAREER_INDEXED_DB_SLOT_STORE, key, payload => {
            if (!payload) { api.done(null); return; }
            const entries = Object.entries(payload.mediaRefs || {}), media = { ...(payload.media || {}) };
            let pending = entries.length;
            if (!pending) { api.done({ ...payload, media, meta }); return; }
            entries.forEach(([kind, mediaId]) => api.get(CAREER_INDEXED_DB_SLOT_STORE, mediaId, record => {
                if (!isCareerProfileMediaBlob(record?.blob)) throw careerSlotError('CAREER_SLOT_INVALID');
                media[kind] = record.blob;
                if (record.revision) careerProfileMediaRevisions.set(record.blob, record.revision);
                if (--pending === 0) api.done({ ...payload, media, meta });
            }));
        });
    }));
}
async function readManagedCareerState(id) {
    const record = await readCareerSlotRecord(id);
    if (!record) return null;
    return { ...record.state, careerSlotId: id, careerSlotRevision: record.meta.revision };
}
async function readManagedCareerMedia(id) { return (await readCareerSlotRecord(id))?.media || {}; }
async function listCareerSlots() {
    await ensureCareerSlotMigration();
    return careerSlotTransaction('readonly', api => api.all(CAREER_INDEXED_DB_SLOT_META_STORE, records => {
        api.get(CAREER_INDEXED_DB_STORE, CAREER_INDEXED_DB_PRIMARY_KEY, primary => api.done({
            slots: records.filter(meta => meta.kind === 'slot').sort((a, b) => b.savedAt - a.savedAt),
            backups: records.filter(meta => meta.kind === 'backup').sort((a, b) => b.savedAt - a.savedAt),
            lastSlotId: primary?.slotId || null, activeId: getActiveCareerSlotId() }));
    }));
}
async function writeManagedCareerState(state, media, options = {}) {
    await ensureCareerSlotMigration();
    const id = state.careerSlotId || getCareerSlotIdForSave(), progress = careerSlotProgress(state);
    const savedAt = nextCareerStorageTimestamp();
    const committed = await careerSlotTransaction('readwrite', api => api.all(CAREER_INDEXED_DB_SLOT_META_STORE, records => {
        const previous = records.find(meta => meta.id === id), expected = careerSlotKnownRevisions.get(id);
        if (previous?.kind === 'deleted' || previous && expected !== undefined && previous.revision !== expected
            || !previous && expected !== undefined) throw careerSlotError('CAREER_SLOT_CONFLICT');
        if (!previous && records.filter(meta => meta.kind === 'slot').length >= CAREER_SLOT_LIMIT) throw careerSlotError('CAREER_SLOT_LIMIT');
        const reason = options.slotBackupReason || '';
        const incomingMedia = Object.fromEntries(['photo', 'walkon'].flatMap(kind => {
            const blob = media?.[kind] ?? media?.[CAREER_PROFILE_MEDIA_KEYS[kind]];
            return isCareerProfileMediaBlob(blob) ? [[kind, careerSlotMediaKey(kind, blob).id]] : [];
        }));
        const mediaChanged = media !== undefined && !options.slotOmitMediaFallback && previous
            && JSON.stringify([...(previous.mediaKeys || [])].sort()) !== JSON.stringify(Object.values(incomingMedia).sort());
        const backupDue = Boolean(reason || previous && (mediaChanged || previous.gameDate !== progress.gameDate
            || savedAt - (previous.lastBackupAt || previous.savedAt) >= CAREER_SLOT_BACKUP_INTERVAL));
        const revision = (previous?.revision || 0) + 1;
        const finish = oldPayload => {
            const preserve = media === undefined || options.slotOmitMediaFallback;
            const payload = storeCareerSlotPayload(api, normalizeCareerSlotPayload(state, id, preserve ? oldPayload?.media || {} : media), records, preserve ? oldPayload?.mediaRefs : null);
            let remainingRecords = records.filter(meta => meta.id !== id);
            if (backupDue && (options.slotBackupIncoming || oldPayload)) {
                const source = options.slotBackupIncoming ? payload : oldPayload;
                const backupId = createCareerSlotId('backup');
                const backups = records.filter(meta => meta.kind === 'backup' && meta.slotId === id).sort((a, b) => b.savedAt - a.savedAt);
                backups.slice(CAREER_SLOT_BACKUP_LIMIT - 1).forEach(meta => { api.remove(CAREER_INDEXED_DB_SLOT_STORE, meta.id); api.remove(CAREER_INDEXED_DB_SLOT_META_STORE, meta.id); });
                const removed = new Set(backups.slice(CAREER_SLOT_BACKUP_LIMIT - 1).map(meta => meta.id));
                remainingRecords = remainingRecords.filter(meta => !removed.has(meta.id));
                api.put(CAREER_INDEXED_DB_SLOT_STORE, { ...source, id: backupId });
                const backupMeta = { id: backupId, kind: 'backup', slotId: id, savedAt, mediaKeys: Object.values(source.mediaRefs || {}),
                    reason: reason || 'automatic', ...careerSlotProgress(source.state) };
                api.put(CAREER_INDEXED_DB_SLOT_META_STORE, backupMeta); remainingRecords.push(backupMeta);
            }
            api.put(CAREER_INDEXED_DB_SLOT_STORE, { ...payload, revision });
            const meta = { id, kind: 'slot', revision, savedAt, label: previous?.label || '', mediaKeys: Object.values(payload.mediaRefs || {}),
                lastBackupAt: backupDue ? savedAt : previous?.lastBackupAt || savedAt, ...progress };
            api.put(CAREER_INDEXED_DB_SLOT_META_STORE, meta); remainingRecords.push(meta);
            cleanCareerSlotMedia(api, records, remainingRecords);
            if (id === getActiveCareerSlotId()) api.put(CAREER_INDEXED_DB_STORE, { id: CAREER_INDEXED_DB_PRIMARY_KEY, slotId: id, savedAt });
            api.done({ id, revision, savedAt });
        };
        if (previous && (backupDue && !options.slotBackupIncoming || media === undefined || options.slotOmitMediaFallback)) api.get(CAREER_INDEXED_DB_SLOT_STORE, id, finish);
        else finish(null);
    }));
    careerSlotKnownRevisions.set(id, committed.revision);
    careerSlotLastSave = { id, success: true, savedAt, backend: 'indexeddb' };
    return savedAt;
}
function recordCareerSlotSaveResult(result, state) {
    careerSlotLastSave = { id: state.careerSlotId, success: result.success, backend: result.backend, errorCode: result.errorCode, omittedMedia: result.omittedMedia };
}
async function shouldIgnoreLegacyCareerSlot(state) {
    if (!canUseIndexedDbCareerStorage()) return false;
    return careerSlotTransaction('readonly', api => api.get(CAREER_INDEXED_DB_SLOT_META_STORE, 'migration', marker => {
        if (!state.careerSlotId) { api.done(Boolean(marker) && Number(state.browserSavedAt || 0) <= Number(marker.legacyProcessedAt || 0)); return; }
        api.get(CAREER_INDEXED_DB_SLOT_META_STORE, state.careerSlotId, meta => api.done(meta?.kind === 'deleted'
            || marker?.recoveredSourceId === state.careerSlotId && Number(state.browserSavedAt || 0) <= Number(marker?.recoveredAt || 0)));
    }));
}
async function withCareerSlotAction(action) {
    if (careerSlotActionBusy) throw careerSlotError('CAREER_SLOT_BUSY');
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) throw careerSlotError('CAREER_SLOT_PLAYING');
    careerSlotActionBusy = true;
    try {
        if (typeof setCareerSlotBusyUI === 'function') setCareerSlotBusyUI(true);
        return await action();
    } finally { careerSlotActionBusy = false; if (typeof setCareerSlotBusyUI === 'function') setCareerSlotBusyUI(false); }
}
async function saveCurrentCareerForSlotAction(options = {}) {
    if (typeof player === 'undefined' || !player?.name) { await waitForCareerSaveWrites(); return; }
    await waitForCareerSaveWrites();
    const ok = await saveGame(true, { immediate: true, slotInternal: true, ...options });
    await waitForCareerSaveWrites();
    if (!ok || careerSlotLastSave?.backend !== 'indexeddb' || careerSlotLastSave.omittedMedia || careerSlotLastSave.id !== getActiveCareerSlotId()) throw careerSlotError(careerSlotLastSave?.errorCode || 'CAREER_SLOT_SAVE_REQUIRED');
}
async function selectCareerSlotPointer(id, expected) {
    return careerSlotTransaction('readwrite', api => api.get(CAREER_INDEXED_DB_SLOT_META_STORE, id, meta => {
        if (meta?.kind !== 'slot' || meta.revision !== expected) throw careerSlotError('CAREER_SLOT_CONFLICT');
        api.put(CAREER_INDEXED_DB_STORE, { id: CAREER_INDEXED_DB_PRIMARY_KEY, slotId: id, savedAt: nextCareerStorageTimestamp() });
        api.done(true);
    }));
}
function applyCareerSlotRecord(record, id) {
    if (!restoreGameState(record.state, false)) throw careerSlotError('CAREER_SLOT_INVALID');
    adoptCareerSlotState({ careerSlotId: id, careerSlotRevision: record.meta.revision });
    applyCareerProfileMediaToPlayer(record.media || {});
}
function clearFailedCareerSlotFallback(id) {
    try {
        const key = typeof LEGACY_CAREER_SAVE_KEY !== 'undefined' ? LEGACY_CAREER_SAVE_KEY : 'dartsCareerSave';
        const value = JSON.parse(localStorage.getItem(key) || 'null');
        if (value?.careerSlotId === id) localStorage.removeItem(key);
    } catch (_) {}
}
async function loadCareerSlot(id, backupId = null) {
    return withCareerSlotAction(async () => {
        if (typeof waitForPersistedModRestore === 'function') await waitForPersistedModRestore();
        const target = await readCareerSlotRecord(id, backupId);
        if (!target) throw careerSlotError('CAREER_SLOT_MISSING');
        validateGameState(target.state);
        let reloadAfterConflict = false;
        try { await saveCurrentCareerForSlotAction(); }
        catch (error) {
            if (error.code !== 'CAREER_SLOT_CONFLICT' || backupId || id !== getActiveCareerSlotId()) throw error;
            reloadAfterConflict = true;
        }
        const oldId = getActiveCareerSlotId();
        const oldRecord = oldId ? await readCareerSlotRecord(oldId) : null;
        if (!reloadAfterConflict && oldRecord && oldRecord.meta.revision !== careerSlotKnownRevisions.get(oldId)) throw careerSlotError('CAREER_SLOT_CONFLICT');
        const currentTarget = await readCareerSlotRecord(id);
        if (!currentTarget) throw careerSlotError('CAREER_SLOT_MISSING');
        try {
            const chosen = !reloadAfterConflict && (backupId || oldId === id) ? target : currentTarget;
            validateGameState(chosen.state);
            applyCareerSlotRecord({ ...chosen, meta: currentTarget.meta }, id);
            if (!reloadAfterConflict && (backupId || oldId === id)) await saveCurrentCareerForSlotAction({ slotBackupReason: backupId ? 'before-restore' : 'before-reload' });
            else await selectCareerSlotPointer(id, currentTarget.meta.revision);
            return true;
        } catch (error) {
            clearFailedCareerSlotFallback(id);
            if (oldRecord) { applyCareerSlotRecord(oldRecord, oldId); await selectCareerSlotPointer(oldId, oldRecord.meta.revision).catch(() => {}); }
            else { careerSlotRuntimeId = null; careerSlotRuntimeOwner = null; }
            throw error;
        }
    });
}
async function renameCareerSlot(id, label) {
    label = String(label || '').trim(); if (label.length > 60) throw careerSlotError('CAREER_SLOT_LABEL');
    return careerSlotTransaction('readwrite', api => api.get(CAREER_INDEXED_DB_SLOT_META_STORE, id, meta => {
        if (meta?.kind !== 'slot') throw careerSlotError('CAREER_SLOT_MISSING');
        api.put(CAREER_INDEXED_DB_SLOT_META_STORE, { ...meta, label }); api.done(true);
    }));
}
async function deleteCareerSlot(id) {
    return withCareerSlotAction(async () => {
        if (id === getActiveCareerSlotId()) throw careerSlotError('CAREER_SLOT_DELETE_ACTIVE');
        await careerSlotTransaction('readwrite', api => api.all(CAREER_INDEXED_DB_SLOT_META_STORE, records => {
            const slot = records.find(meta => meta.kind === 'slot' && meta.id === id);
            if (!slot) throw careerSlotError('CAREER_SLOT_MISSING');
            records.filter(meta => meta.id === id || meta.kind === 'backup' && meta.slotId === id).forEach(meta => {
                api.remove(CAREER_INDEXED_DB_SLOT_STORE, meta.id); api.remove(CAREER_INDEXED_DB_SLOT_META_STORE, meta.id);
            });
            api.put(CAREER_INDEXED_DB_SLOT_META_STORE, { id, kind: 'deleted' });
            cleanCareerSlotMedia(api, records, records.filter(meta => meta.id !== id && !(meta.kind === 'backup' && meta.slotId === id)));
            api.get(CAREER_INDEXED_DB_STORE, CAREER_INDEXED_DB_PRIMARY_KEY, primary => {
                if (primary?.slotId === id) {
                    const next = records.filter(meta => meta.kind === 'slot' && meta.id !== id).sort((a, b) => b.savedAt - a.savedAt)[0];
                    if (next) api.put(CAREER_INDEXED_DB_STORE, { id: CAREER_INDEXED_DB_PRIMARY_KEY, slotId: next.id, savedAt: nextCareerStorageTimestamp() });
                    else api.remove(CAREER_INDEXED_DB_STORE, CAREER_INDEXED_DB_PRIMARY_KEY);
                }
                api.done(true);
            });
        }));
        clearFailedCareerSlotFallback(id); careerSlotKnownRevisions.delete(id); return true;
    });
}
async function duplicateCurrentCareerSlot() {
    return withCareerSlotAction(async () => {
        if (!player?.name) throw careerSlotError('CAREER_SLOT_NO_CAREER');
        try { await saveCurrentCareerForSlotAction(); } catch (error) { if (error.code !== 'CAREER_SLOT_CONFLICT') throw error; }
        const oldId = getActiveCareerSlotId();
        const slots = await listCareerSlots(); if (slots.slots.length >= CAREER_SLOT_LIMIT) throw careerSlotError('CAREER_SLOT_LIMIT');
        careerSlotRuntimeId = createCareerSlotId(); careerSlotRuntimeOwner = player;
        try { await saveCurrentCareerForSlotAction(); return careerSlotRuntimeId; }
        catch (error) { clearFailedCareerSlotFallback(careerSlotRuntimeId); careerSlotRuntimeId = oldId; careerSlotRuntimeOwner = player; throw error; }
    });
}
async function checkpointCareerSlotBeforeImport() {
    if (!player?.name) return true;
    try { await withCareerSlotAction(() => saveCurrentCareerForSlotAction({ slotBackupReason: 'before-import', slotBackupIncoming: true })); return true; }
    catch (error) { if (typeof showCareerSlotError === 'function') showCareerSlotError(error); return false; }
}
async function prepareCareerSlotForNewCareer() {
    if (careerSlotStartToken) return null;
    const token = {}; careerSlotStartToken = token;
    try {
        if (!canUseIndexedDbCareerStorage()) {
            let saved = null; try { saved = localStorage.getItem(typeof LEGACY_CAREER_SAVE_KEY !== 'undefined' ? LEGACY_CAREER_SAVE_KEY : 'dartsCareerSave'); } catch (_) {}
            if (player?.name || saved) throw careerSlotError('CAREER_SLOT_SAVE_REQUIRED');
            careerSlotRuntimeId = null; careerSlotRuntimeOwner = null; return token;
        }
        await withCareerSlotAction(async () => {
            await ensureCareerSlotMigration();
            await saveCurrentCareerForSlotAction();
            if ((await listCareerSlots()).slots.length >= CAREER_SLOT_LIMIT) throw careerSlotError('CAREER_SLOT_LIMIT');
        });
        careerSlotRuntimeId = null; careerSlotRuntimeOwner = null;
        return token;
    } catch (error) { careerSlotStartToken = null; if (typeof showCareerSlotError === 'function') showCareerSlotError(error); return null; }
}
async function saveNewCareerSlot(token) {
    if (!token || token !== careerSlotStartToken) return false;
    const ok = await saveGame(true, { immediate: true });
    if (!ok || careerSlotLastSave?.backend !== 'indexeddb' || careerSlotLastSave.omittedMedia) {
        if (typeof showCareerSlotError === 'function') showCareerSlotError(careerSlotError('CAREER_SLOT_NEW_SAVE_WARNING'));
    }
    return ok;
}
function finishCareerSlotNewCareer(token) { if (token && token === careerSlotStartToken) careerSlotStartToken = null; }
async function startNewCareerFromSlots() {
    return withCareerSlotAction(async () => {
        await saveCurrentCareerForSlotAction(); careerSlotNavigationSafe = true; window.location.reload(); return true;
    });
}
async function importStateAsCareerSlot(state) {
    try { validateGameState(state); } catch (_) { throw careerSlotError('CAREER_SLOT_INVALID'); }
    return withCareerSlotAction(async () => {
        if (typeof waitForPersistedModRestore === 'function') await waitForPersistedModRestore();
        await ensureCareerSlotMigration();
        if ((await listCareerSlots()).slots.length >= CAREER_SLOT_LIMIT) throw careerSlotError('CAREER_SLOT_LIMIT');
        await saveCurrentCareerForSlotAction({ slotBackupReason: 'before-import', slotBackupIncoming: true });
        const oldId = getActiveCareerSlotId(), oldRecord = oldId ? await readCareerSlotRecord(oldId) : null;
        const id = createCareerSlotId();
        try {
            if (!restoreGameState(state, false)) throw careerSlotError('CAREER_SLOT_INVALID');
            adoptCareerSlotState({ careerSlotId: id });
            await saveCurrentCareerForSlotAction(); return id;
        } catch (error) {
            clearFailedCareerSlotFallback(id);
            if (oldRecord) applyCareerSlotRecord(oldRecord, oldId);
            else { careerSlotRuntimeId = null; careerSlotRuntimeOwner = null; }
            throw error;
        }
    });
}
async function importCareerSlotFile(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return false;
    try {
        if (file.size > 256 * 1024 * 1024) throw careerSlotError('CAREER_SLOT_FILE_SIZE');
        await importStateAsCareerSlot(JSON.parse(await file.text()));
        if (typeof showCareerSlots === 'function') await showCareerSlots();
        return true;
    } catch (error) { if (typeof showCareerSlotError === 'function') showCareerSlotError(error); return false; }
}
async function exportCareerSlot(id, backupId = null) {
    const record = await readCareerSlotRecord(id, backupId); if (!record) throw careerSlotError('CAREER_SLOT_MISSING');
    const portable = { ...record.state, player: { ...record.state.player } }; delete portable.profileMediaRefs;
    for (const [kind, blob] of Object.entries(record.media || {})) portable.player[kind] = await blobToCareerDataUrl(blob);
    const url = URL.createObjectURL(new Blob([JSON.stringify(portable)], { type: 'application/json' })), link = document.createElement('a');
    link.href = url; link.download = `darts-career-${backupId ? 'backup' : 'slot'}.json`; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000); return true;
}
