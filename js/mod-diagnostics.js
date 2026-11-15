function modDiagnosticIdentity(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ł/g, 'l').trim().replace(/\s+/g, ' ');
}
function modDiagnosticObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function buildModMediaInventory(files = []) {
    const inventory = { photos: new Map(), music: new Map(), dartboards: new Map(), surrounds: new Map(), paths: new Set(), collisions: [] };
    const folders = { zdjecia: 'photos', music: 'music', dartboards: 'dartboards', surrounds: 'surrounds' };
    for (const path of files) {
        if (typeof path !== 'string' || /(?:^|\/)__MACOSX\//.test(path)) continue;
        inventory.paths.add(path);
        const match = path.match(/^(zdjecia|music|dartboards|surrounds)\/(?:.*\/)?([^/]+)\.([^.\/]+)$/i);
        if (!match) continue;
        const kind = folders[match[1].toLowerCase()], extension = match[3].toLowerCase();
        if (!(kind === 'music' ? ['mp3', 'ogg', 'wav'] : ['png', 'jpg', 'jpeg', 'webp']).includes(extension)) continue;
        const name = match[2], previous = inventory[kind].get(name);
        if (previous) inventory.collisions.push({ name, path, previous });
        inventory[kind].set(name, path);
    }
    return inventory;
}
function inspectDartsMod(data, context = {}) {
    const report = { issues: [], counts: { error: 0, warning: 0, info: 0 }, players: 0, events: 0, source: context.source || 'file',
        label: context.label || '', mediaChecked: context.files != null || context.media != null };
    const issue = (severity, code, path, params = {}, target = null, record = null, detail = '') => {
        report.counts[severity]++; report.issues.push({ severity, code, path, params, target, record: summarizeModDiagnosticRecord(record), detail });
    };
    if (!modDiagnosticObject(data)) { issue('error', 'invalidRoot', 'mod.json'); return report; }
    if (!['pdcPlayers', 'tournamentDatabase', 'dartboard', 'surround', 'regularSponsorsDB', 'techSponsorsDB', 'historicalChampions', 'sponsorTiers', 'shopDatabase'].some(key => data[key] !== undefined)) {
        issue('error', 'invalidRoot', 'mod.json'); return report;
    }
    for (const field of ['pdcPlayers', 'tournamentDatabase', 'regularSponsorsDB', 'techSponsorsDB', 'historicalChampions']) {
        if (data[field] !== undefined && !Array.isArray(data[field])) issue('error', 'invalidArray', field, { field });
    }
    const players = Array.isArray(data.pdcPlayers) ? data.pdcPlayers : data.pdcPlayers === undefined ? context.players || [] : [];
    const events = Array.isArray(data.tournamentDatabase) ? data.tournamentDatabase : data.tournamentDatabase === undefined ? context.events || [] : [];
    report.players = players.length; report.events = events.length;
    const playerIds = new Map(), playerNames = new Map(), templates = new Map(), aliases = new Map();
    const year = context.year || (typeof currentDate !== 'undefined' ? currentDate.getFullYear() : 2026);
    const media = context.media || (context.files != null ? buildModMediaInventory(context.files) : null);
    if (media) for (const collision of media.collisions || []) issue('warning', 'mediaCollision', collision.path, collision, null, null, collision.previous);
    const mediaHas = (kind, name) => media?.[kind] instanceof Map ? media[kind].has(name) : Boolean(media?.[kind]?.[name]);
    let photos = 0, music = 0, remote = 0;
    const missingPhotos = [], missingMusic = [];
    const foldedMedia = {};
    if (media) for (const kind of ['photos', 'music']) foldedMedia[kind] = new Map(
        (media[kind] instanceof Map ? [...media[kind].keys()] : Object.keys(media[kind] || {})).map(key => [modDiagnosticIdentity(key), key]));
    players.forEach((candidate, index) => {
        const path = `pdcPlayers[${index}]`, target = { kind: 'player', index, key: candidate?.id || '', name: candidate?.name || '', country: candidate?.country || '' };
        if (!modDiagnosticObject(candidate)) { issue('error', 'invalidRecord', path, {}, target, candidate); return; }
        const add = (severity, code, field, params = {}) => issue(severity, code, `${path}${field ? '.' + field : ''}`, { name: candidate.name || path, ...params }, target, candidate);
        if (typeof candidate.name !== 'string' || !candidate.name.trim()) add('error', 'missingName', 'name');
        if (typeof candidate.country !== 'string' || !candidate.country.trim()) add('error', 'missingCountry', 'country');
        const identity = `${modDiagnosticIdentity(candidate.name)}|${modDiagnosticIdentity(candidate.country)}`;
        if (playerNames.has(identity)) add('warning', 'duplicatePlayer', 'name', { other: `pdcPlayers[${playerNames.get(identity)}]` });
        else playerNames.set(identity, index);
        if (candidate.id) { if (playerIds.has(candidate.id)) add('error', 'duplicateId', 'id', { other: `pdcPlayers[${playerIds.get(candidate.id)}]` }); else playerIds.set(candidate.id, index); }
        if (Number.isInteger(candidate.defaultTemplateIndex)) {
            if (templates.has(candidate.defaultTemplateIndex)) add('warning', 'duplicateTemplate', 'defaultTemplateIndex', { other: `pdcPlayers[${templates.get(candidate.defaultTemplateIndex)}]` });
            else templates.set(candidate.defaultTemplateIndex, index);
        }
        for (const field of ['ovr', 'overall', 'scoring', 'doubles']) if (candidate[field] !== undefined
            && (!Number.isFinite(candidate[field]) || candidate[field] < 1 || candidate[field] > 100)) add('error', 'invalidRating', field, { field });
        for (const field of ['prizeMoney', 'proTourPrizeMoney', 'pcPrizeMoney', 'europeanTourPrizeMoney', 'challengeTourPrizeMoney', 'developmentTourPrizeMoney']) {
            if (candidate[field] !== undefined && (!Number.isFinite(candidate[field]) || candidate[field] < 0)) add('error', 'invalidMoney', field, { field });
        }
        if (candidate.birthYear !== undefined && (!Number.isInteger(candidate.birthYear) || candidate.birthYear > year || candidate.birthYear < 1850)) add('warning', 'invalidBirthYear', 'birthYear');
        if (media) {
            const names = [candidate.name, candidate.sourceName].filter(Boolean);
            if (names.some(name => mediaHas('photos', name))) photos++; else missingPhotos.push(candidate.name || path);
            if (names.some(name => mediaHas('music', name))) music++; else missingMusic.push(candidate.name || path);
            for (const kind of ['photos', 'music']) if (!names.some(name => mediaHas(kind, name))) {
                const spelling = names.map(name => foldedMedia[kind].get(modDiagnosticIdentity(name))).find(Boolean);
                if (spelling) add('warning', 'mediaCase', kind === 'photos' ? 'photo' : 'walkon', { file: spelling });
            }
            for (const [field, kind] of [['photo', 'photos'], ['walkon', 'music']]) {
                const value = candidate[field]; if (typeof value !== 'string' || !value.trim()) continue;
                if (/^(https?:|data:|blob:)/i.test(value)) { if (/^https?:/i.test(value)) remote++; continue; }
                const basename = value.replace(/\\/g, '/').split('/').pop().replace(/\.[^.]+$/, '');
                if (!mediaHas(kind, basename)) add('warning', 'missingMedia', field, { file: value });
            }
        }
    });
    const dateValid = (month, day) => Number.isInteger(month) && month >= 0 && month <= 11 && Number.isInteger(day)
        && day >= 1 && day <= new Date(year, month + 1, 0).getDate();
    events.forEach((event, index) => {
        const path = `tournamentDatabase[${index}]`, target = { kind: 'event', index, key: event?.sourceName || event?.name || '' };
        if (!modDiagnosticObject(event)) { issue('error', 'invalidRecord', path, {}, target, event); return; }
        const add = (severity, code, field, params = {}, detail = '') => issue(severity, code, `${path}${field ? '.' + field : ''}`, { name: event.name || path, ...params }, target, event, detail);
        if (typeof event.name !== 'string' || !event.name.trim()) add('error', 'missingName', 'name');
        for (const alias of new Set([event.name, event.sourceName].filter(value => typeof value === 'string' && value.trim()))) {
            const key = modDiagnosticIdentity(alias);
            if (aliases.has(key) && aliases.get(key) !== index) add('error', 'duplicateEvent', 'name', { other: `tournamentDatabase[${aliases.get(key)}]`, alias });
            else aliases.set(key, index);
        }
        if (!dateValid(event.month, event.day)) add('error', 'invalidDate', 'day');
        if (event.endDay !== undefined && !dateValid(event.endMonth ?? event.month, event.endDay)) add('error', 'invalidDate', 'endDay');
        if (event.editorFieldSize != null && ![8, 16, 32, 64, 128, 256].includes(event.editorFieldSize)) add('error', 'invalidFieldSize', 'editorFieldSize');
        if (event.format != null && !['legs', 'sets', '501', 'dido', 'doubles', 'masterout'].includes(String(event.format).toLowerCase())) add('error', 'invalidFormat', 'format');
        for (const field of ['editorNativeRoutes', 'editorQualification']) if (event[field] !== undefined && event[field] !== null
            && (field === 'editorNativeRoutes' ? !Array.isArray(event[field]) : !modDiagnosticObject(event[field]))) add('error', 'invalidRules', field);
        if (event.editorPrizes != null) {
            if (!modDiagnosticObject(event.editorPrizes) || Object.values(event.editorPrizes).some(value => !Number.isFinite(value) || value < 0)) add('error', 'invalidMoney', 'editorPrizes', { field: 'editorPrizes' });
        }
    });
    const graph = events.map(() => new Set()), qualifierTotals = new Map();
    const resolve = value => typeof value === 'string' ? aliases.get(modDiagnosticIdentity(value)) : undefined;
    events.forEach((event, index) => {
        if (!modDiagnosticObject(event)) return;
        const target = { kind: 'event', index, key: event.sourceName || event.name || '' }, path = `tournamentDatabase[${index}]`;
        const add = (code, field, params = {}, detail = '') => issue('error', code, `${path}.${field}`, { name: event.name || path, ...params }, target, event, detail);
        const reference = (key, field, dependency = true) => {
            const linked = resolve(key);
            if (linked === undefined) { add('missingEvent', field, { key }); return null; }
            if (linked === index) { add('selfLink', field); return null; }
            if (dependency) graph[index].add(linked); else graph[linked].add(index);
            return events[linked];
        };
        if (event.qualifierFor) reference(event.qualifierFor, 'qualifierFor', false);
        const rules = event.editorQualification;
        if (rules?.kind === 'qualifier') {
            const main = reference(rules.targetKey, 'editorQualification.targetKey', false);
            if (main) {
                const key = resolve(rules.targetKey), total = (qualifierTotals.get(key) || 0) + (Number(rules.qualifyingPlaces) || 0);
                qualifierTotals.set(key, total);
                const capacity = main.editorFieldSize || (typeof getTournamentEditorNativeQualifierCapacity === 'function' ? getTournamentEditorNativeQualifierCapacity(main) : 1024);
                if (capacity !== null && total > capacity) add('tooManySlots', 'editorQualification.qualifyingPlaces', { total, capacity });
            }
        }
        const routes = [...(Array.isArray(event.editorNativeRoutes) ? event.editorNativeRoutes : []), ...(Array.isArray(rules?.routes) ? rules.routes : [])];
        for (const route of routes) {
            if (!modDiagnosticObject(route)) { add('invalidRules', 'editorQualification.routes'); continue; }
            if (!Number.isInteger(route.places) || route.places < 1) add('invalidRules', 'editorQualification.routes');
            if (route.source === 'qualifier' || route.source === 'tournament') {
                const key = route.source === 'qualifier' ? route.qualifierKey : route.tournamentKey;
                const source = reference(key, 'editorQualification.routes');
                if (source) {
                    const end = new Date(year, source.endMonth ?? source.month, source.endDay ?? source.day);
                    const start = new Date(year, event.month, event.day);
                    if (end >= start) add('lateSource', 'editorQualification.routes', { key });
                    const capacity = source.editorQualification?.kind === 'qualifier' ? source.editorQualification.qualifyingPlaces : source.editorFieldSize || 1024;
                    const sum = routes.filter(r => r && r.source === route.source && (r.qualifierKey || r.tournamentKey) === key).reduce((n, r) => n + (Number(r.places) || 0), 0);
                    if (sum > capacity) add('tooManySlots', 'editorQualification.routes', { total: sum, capacity });
                }
            }
        }
        try {
            if (event.editorNativeRoutes && typeof normalizeTournamentEditorNativeRoutes === 'function') normalizeTournamentEditorNativeRoutes(cloneModDiagnosticValue(event.editorNativeRoutes), cloneModDiagnosticValue(event));
            if (rules?.mode === 'custom' && typeof normalizeTournamentPackRules === 'function') normalizeTournamentPackRules(cloneModDiagnosticValue(rules), event.editorFieldSize || 32);
            if (typeof validateTournamentEditorEventTourLinks === 'function') validateTournamentEditorEventTourLinks(cloneModDiagnosticValue(event), events.filter(modDiagnosticObject), context.tours || []);
        } catch (error) { add('invalidRules', 'editorQualification', {}, error.message); }
    });
    // Iterative DFS also handles a long user-created chain without overflowing.
    const colors = new Uint8Array(events.length);
    for (let root = 0; root < events.length; root++) {
        if (colors[root]) continue;
        const stack = [{ node: root, children: [...graph[root]], index: 0 }]; colors[root] = 1;
        while (stack.length) {
            const frame = stack[stack.length - 1];
            if (frame.index >= frame.children.length) { colors[frame.node] = 2; stack.pop(); continue; }
            const next = frame.children[frame.index++];
            if (colors[next] === 1) issue('error', 'cycle', `tournamentDatabase[${frame.node}]`, { name: events[frame.node]?.name || '', other: events[next]?.name || '' }, { kind: 'event', index: frame.node, key: events[frame.node]?.sourceName || events[frame.node]?.name }, events[frame.node]);
            else if (!colors[next]) { colors[next] = 1; stack.push({ node: next, children: [...graph[next]], index: 0 }); }
        }
    }
    for (const [field, kind, validate] of [['dartboard', 'dartboards', typeof validateModDartboardConfig === 'function' ? validateModDartboardConfig : null],
        ['surround', 'surrounds', typeof validateModSurroundConfig === 'function' ? validateModSurroundConfig : null]]) {
        if (data[field] === undefined) continue;
        try { if (validate) validate(cloneModDiagnosticValue(data[field])); }
        catch (error) { issue('error', 'invalidSkin', field, { field }, null, data[field], error.message); }
        if (media && typeof data[field]?.image === 'string' && !mediaHas(kind, data[field].image.replace(/\.[^.]+$/, ''))) issue('error', 'missingMedia', field + '.image', { file: data[field].image }, null, data[field]);
    }
    if (media) {
        issue('info', 'coverage', 'media', { photos, music, total: players.length });
        if (missingPhotos.length) issue('info', 'optionalPhotos', 'zdjecia/', { count: missingPhotos.length }, null, missingPhotos);
        if (missingMusic.length) issue('info', 'optionalMusic', 'music/', { count: missingMusic.length }, null, missingMusic);
    }
    else issue('info', 'mediaNotChecked', 'media');
    if (remote) issue('info', 'remoteMedia', 'media', { count: remote });
    report.issues.sort((a, b) => ['error', 'warning', 'info'].indexOf(a.severity) - ['error', 'warning', 'info'].indexOf(b.severity));
    return report;
}
function cloneModDiagnosticValue(value) {
    return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}
function summarizeModDiagnosticRecord(record) {
    if (record == null || !modDiagnosticObject(record)) return cloneModDiagnosticValue(record);
    const fields = ['id', 'name', 'sourceName', 'country', 'defaultTemplateIndex', 'birthYear', 'ovr', 'overall', 'scoring', 'doubles',
        'photo', 'walkon', 'prizeMoney', 'proTourPrizeMoney', 'pcPrizeMoney', 'europeanTourPrizeMoney', 'challengeTourPrizeMoney', 'developmentTourPrizeMoney',
        'month', 'day', 'endMonth', 'endDay', 'format', 'specialType', 'qualifierFor', 'qualifyingPlaces', 'editorFieldSize',
        'editorQualification', 'editorNativeRoutes', 'editorPrizes', 'editorCycle', 'editorTourName', 'image', 'center', 'radii', 'rotation'];
    return cloneModDiagnosticValue(Object.fromEntries(fields.filter(key => record[key] !== undefined).map(key => [key, record[key]])));
}
