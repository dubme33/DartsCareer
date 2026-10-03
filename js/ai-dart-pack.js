// Share only AI opponents' visual dart setups. Match results and player attributes stay local.
const AI_DART_PACK_FORMAT = 'darts-career-ai-darts-pack';
const AI_DART_PACK_VERSION = 1;
const AI_DART_PACK_MAX_BYTES = 64 * 1024 * 1024;
const AI_DART_PACK_MAX_PLAYERS = 5000;
const AI_DART_PACK_TEXT = {
    pl: { title: 'Baza lotek AI', intro: 'Wyeksportuj wygląd lotek zawodników AI do pliku JSON lub wczytaj zestawy od innego gracza.',
        export: 'Eksportuj lotki', import: 'Wczytaj lotki', preview: 'Podgląd importu',
        hint: 'Wybierz lotki do zastąpienia. Oceny, wyniki i finanse zawodników pozostaną bez zmian.',
        cancel: 'Anuluj', apply: 'Zastosuj wybrane lotki', replace: 'Zastąp lotki', skip: 'Pomiń',
        summary: 'Do zastąpienia: {replace} · bez zmian: {same} · brak dopasowania: {missing} · pominięte: {skip}',
        exported: 'Wyeksportowano lotki {count} zawodników.', imported: 'Zmieniono lotki {count} zawodników.',
        invalid: 'Nieprawidłowa lub nieobsługiwana baza lotek.', tooLarge: 'Plik przekracza limit 64 MB.',
        duplicate: 'Powtarzający się zawodnik: {name}', noChanges: 'Nie wybrano żadnych zmian.',
        saveFailed: 'Lotki zostały zmienione, ale zapis kariery się nie powiódł.',
        career: 'Twoja postać kariery', missing: 'Brak zawodnika w tej karierze',
        ambiguous: 'Nie można jednoznacznie dopasować zawodnika', same: 'Taki sam wygląd lotek' },
    en: { title: 'AI darts database', intro: 'Export AI players’ dart appearances to JSON or load setups shared by another player.',
        export: 'Export darts', import: 'Load darts', preview: 'Import preview',
        hint: 'Choose which dart setups to replace. Players’ ratings, results and finances stay unchanged.',
        cancel: 'Cancel', apply: 'Apply selected darts', replace: 'Replace darts', skip: 'Skip',
        summary: 'Replace: {replace} · unchanged: {same} · unmatched: {missing} · skipped: {skip}',
        exported: 'Exported darts for {count} players.', imported: 'Changed darts for {count} players.',
        invalid: 'Invalid or unsupported darts database.', tooLarge: 'File exceeds the 64 MB limit.',
        duplicate: 'Duplicate player: {name}', noChanges: 'No changes selected.',
        saveFailed: 'Darts were changed, but saving the career failed.',
        career: 'Your career player', missing: 'Player absent from this career',
        ambiguous: 'Cannot match player unambiguously', same: 'Same dart appearance' },
    de: { title: 'KI-Darts-Datenbank', intro: 'Dart-Designs der KI-Spieler als JSON exportieren oder geteilte Designs laden.',
        export: 'Darts exportieren', import: 'Darts laden', preview: 'Importvorschau',
        hint: 'Wähle die zu ersetzenden Darts. Werte, Ergebnisse und Finanzen bleiben unverändert.',
        cancel: 'Abbrechen', apply: 'Ausgewählte Darts übernehmen', replace: 'Darts ersetzen', skip: 'Überspringen',
        summary: 'Ersetzen: {replace} · unverändert: {same} · nicht gefunden: {missing} · übersprungen: {skip}',
        exported: 'Darts für {count} Spieler exportiert.', imported: 'Darts für {count} Spieler geändert.',
        invalid: 'Ungültige oder nicht unterstützte Darts-Datenbank.', tooLarge: 'Datei überschreitet 64 MB.',
        duplicate: 'Doppelter Spieler: {name}', noChanges: 'Keine Änderungen ausgewählt.',
        saveFailed: 'Darts wurden geändert, aber die Karriere konnte nicht gespeichert werden.',
        career: 'Dein Karriere-Spieler', missing: 'Spieler fehlt in dieser Karriere',
        ambiguous: 'Spieler kann nicht eindeutig zugeordnet werden', same: 'Gleiches Dart-Design' },
    nl: { title: 'AI-dartsdatabase', intro: 'Exporteer het uiterlijk van AI-darts als JSON of laad gedeelde ontwerpen.',
        export: 'Darts exporteren', import: 'Darts laden', preview: 'Importvoorbeeld',
        hint: 'Kies welke darts worden vervangen. Scores, resultaten en financiën blijven behouden.',
        cancel: 'Annuleren', apply: 'Gekozen darts toepassen', replace: 'Darts vervangen', skip: 'Overslaan',
        summary: 'Vervangen: {replace} · ongewijzigd: {same} · niet gevonden: {missing} · overgeslagen: {skip}',
        exported: 'Darts voor {count} spelers geëxporteerd.', imported: 'Darts voor {count} spelers gewijzigd.',
        invalid: 'Ongeldige of niet-ondersteunde dartsdatabase.', tooLarge: 'Bestand is groter dan 64 MB.',
        duplicate: 'Dubbele speler: {name}', noChanges: 'Geen wijzigingen gekozen.',
        saveFailed: 'Darts zijn gewijzigd, maar de carrière kon niet worden opgeslagen.',
        career: 'Je eigen carrièrespeler', missing: 'Speler ontbreekt in deze carrière',
        ambiguous: 'Speler kan niet eenduidig worden gekoppeld', same: 'Zelfde dartontwerp' }
};
function trAiDartPack(key, values = {}) {
    const lang = typeof currentLang === 'string' && AI_DART_PACK_TEXT[currentLang] ? currentLang : 'pl';
    return (AI_DART_PACK_TEXT[lang][key] || AI_DART_PACK_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, field) => String(values[field] ?? ''));
}
function aiDartPackError(key, values) { return new Error(trAiDartPack(key, values)); }
function normalizeAiDartPackEntry(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)
        || !['template', 'source', 'custom', 'newgen'].includes(raw.kind)
        || typeof isValidAiDartAppearance !== 'function' || !isValidAiDartAppearance(raw.appearance))
        throw aiDartPackError('invalid');
    const index = raw.kind === 'template' ? playerPackInt(raw.defaultTemplateIndex, 0, 99999) : null;
    const entry = { kind: raw.kind, defaultTemplateIndex: index,
        sourceName: playerPackString(raw.sourceName, 120, true),
        name: playerPackString(raw.name, 120, true), country: playerPackString(raw.country, 80, true),
        appearance: normalizeAiDartAppearance(raw.appearance) };
    if (raw.kind === 'newgen') entry.id = playerPackString(raw.id, 120, true);
    entry.key = raw.kind === 'newgen' ? `newgen:${entry.id}`
        : playerPackKey({ ...entry, editorCreated: entry.kind === 'custom' });
    if (entry.key !== raw.key) throw aiDartPackError('invalid');
    return entry;
}
function parseAiDartPack(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)
        || raw.format !== AI_DART_PACK_FORMAT || raw.version !== AI_DART_PACK_VERSION
        || !Array.isArray(raw.darts) || raw.darts.length > AI_DART_PACK_MAX_PLAYERS)
        throw aiDartPackError('invalid');
    const darts = raw.darts.map(normalizeAiDartPackEntry);
    const keys = new Set();
    for (const entry of darts) {
        if (keys.has(entry.key)) throw aiDartPackError('duplicate', { name: entry.name });
        keys.add(entry.key);
    }
    return { format: AI_DART_PACK_FORMAT, version: AI_DART_PACK_VERSION, darts };
}
function createAiDartPackEntry(candidate) {
    const index = getPlayerEditorTemplateIndex(candidate);
    const kind = candidate.isNewgen ? 'newgen' : Number.isInteger(index) && index >= 0
        ? 'template' : candidate.editorCreated ? 'custom' : 'source';
    const entry = { kind, defaultTemplateIndex: kind === 'template' ? index : null,
        sourceName: candidate.sourceName || candidate.name, name: candidate.name, country: candidate.country,
        appearance: getAiDartAppearanceForPlayer(candidate) };
    if (kind === 'newgen') entry.id = candidate.id;
    entry.key = kind === 'newgen' ? `newgen:${entry.id}`
        : playerPackKey({ ...entry, editorCreated: kind === 'custom' });
    return normalizeAiDartPackEntry(entry);
}
function createAiDartPack() {
    if (typeof pdcPlayers === 'undefined' || !Array.isArray(pdcPlayers)) throw aiDartPackError('invalid');
    return parseAiDartPack({ format: AI_DART_PACK_FORMAT, version: AI_DART_PACK_VERSION,
        darts: pdcPlayers.filter(candidate => candidate && !candidate.isBye
            && candidate !== player && candidate.id !== player?.id && !isPlayerEditorDeleted(candidate))
            .map(createAiDartPackEntry) });
}
function planAiDartPackImport(pack, choices = {}, database = pdcPlayers) {
    const lookup = createPlayerPackLookup(database);
    return pack.darts.map(entry => {
        const match = entry.kind === 'newgen'
            ? { target: database.find(candidate => candidate?.isNewgen && candidate.id === entry.id) || null }
            : findPlayerPackTarget(entry, database, lookup);
        const target = match.target || null;
        const reason = match.reason || (isPlayerPackCareer(entry, target) ? 'career'
            : !target || isPlayerEditorDeleted(target) ? 'missing' : null);
        const same = !reason && JSON.stringify(getAiDartAppearanceForPlayer(target)) === JSON.stringify(entry.appearance);
        const action = reason || same ? 'skip' : choices[entry.key] === 'skip' ? 'skip' : 'replace';
        return { entry, target, reason, same, action, available: reason || same ? ['skip'] : ['replace', 'skip'] };
    });
}
let stagedAiDartPack = null;
let aiDartPackChoices = {};
let aiDartPackFileGeneration = 0;
function setAiDartPackStatus(message = '', error = false) {
    const element = document.getElementById('ai-dart-pack-status');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('is-error', error);
}
function refreshAiDartPackTranslations() {
    if (typeof document === 'undefined' || !document.getElementById('ai-dart-pack-heading')) return;
    const ids = { 'ai-dart-pack-heading': 'title', 'ai-dart-pack-intro': 'intro',
        'ai-dart-pack-export': 'export', 'ai-dart-pack-import': 'import',
        'ai-dart-pack-preview-title': 'preview', 'ai-dart-pack-hint': 'hint',
        'ai-dart-pack-cancel': 'cancel', 'ai-dart-pack-apply': 'apply' };
    for (const [id, key] of Object.entries(ids)) document.getElementById(id).textContent = trAiDartPack(key);
    if (stagedAiDartPack) renderAiDartPackPreview();
}
function exportAiDartPack() {
    try {
        const pack = createAiDartPack();
        const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
        if (blob.size > AI_DART_PACK_MAX_BYTES) throw aiDartPackError('tooLarge');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = 'darts-career-ai-darts-pack.json';
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
        setAiDartPackStatus(trAiDartPack('exported', { count: pack.darts.length }));
        return true;
    } catch (error) { setAiDartPackStatus(error.message || trAiDartPack('invalid'), true); return false; }
}
function openAiDartPackPicker() {
    const input = document.getElementById('ai-dart-pack-file');
    if (input) { input.value = ''; input.click(); }
}
function stageAiDartPackText(text) {
    try {
        if (typeof text !== 'string' || new Blob([text]).size > AI_DART_PACK_MAX_BYTES)
            throw aiDartPackError('tooLarge');
        stagedAiDartPack = parseAiDartPack(JSON.parse(text.replace(/^\uFEFF/, '')));
        aiDartPackChoices = {};
        renderAiDartPackPreview();
        setAiDartPackStatus();
        return true;
    } catch (error) {
        stagedAiDartPack = null;
        document.getElementById('ai-dart-pack-preview').hidden = true;
        setAiDartPackStatus(error instanceof SyntaxError ? trAiDartPack('invalid')
            : error.message || trAiDartPack('invalid'), true);
        return false;
    }
}
async function stageAiDartPackFile(event) {
    const file = event?.target?.files?.[0];
    if (!file) return false;
    const generation = ++aiDartPackFileGeneration;
    stagedAiDartPack = null; aiDartPackChoices = {};
    document.getElementById('ai-dart-pack-preview').hidden = true;
    if (file.size > AI_DART_PACK_MAX_BYTES) { setAiDartPackStatus(trAiDartPack('tooLarge'), true); return false; }
    try { const text = await file.text(); return generation === aiDartPackFileGeneration && stageAiDartPackText(text); }
    catch (_) { setAiDartPackStatus(trAiDartPack('invalid'), true); return false; }
}
function cancelAiDartPackImport() {
    aiDartPackFileGeneration++;
    stagedAiDartPack = null; aiDartPackChoices = {};
    document.getElementById('ai-dart-pack-preview').hidden = true;
    setAiDartPackStatus();
}
function chooseAiDartPackAction(key, action) {
    if (!['replace', 'skip'].includes(action)) return;
    aiDartPackChoices[key] = action;
    renderAiDartPackPreview();
}
function renderAiDartPackPreview() {
    if (!stagedAiDartPack || typeof document === 'undefined') return;
    const rows = planAiDartPackImport(stagedAiDartPack, aiDartPackChoices);
    const list = document.getElementById('ai-dart-pack-list');
    list.replaceChildren();
    const counts = { replace: 0, same: 0, missing: 0, skip: 0 };
    for (const row of rows) {
        if (row.reason) counts.missing++;
        else if (row.same) counts.same++;
        else counts[row.action]++;
        if (row.same) continue;
        const item = document.createElement('div'); item.className = 'ai-dart-pack-row';
        if (row.reason) item.classList.add('locked');
        const description = document.createElement('div');
        const title = document.createElement('strong'); title.textContent = row.entry.name;
        const detail = document.createElement('small');
        detail.textContent = row.reason ? trAiDartPack(row.reason) : row.entry.country;
        description.append(title, detail);
        const select = document.createElement('select'); select.setAttribute('aria-label', row.entry.name);
        for (const action of row.available) {
            const option = document.createElement('option'); option.value = action;
            option.textContent = trAiDartPack(action); select.appendChild(option);
        }
        select.value = row.action; select.disabled = row.available.length === 1;
        select.addEventListener('change', () => chooseAiDartPackAction(row.entry.key, select.value));
        item.append(description, select); list.appendChild(item);
    }
    document.getElementById('ai-dart-pack-summary').textContent = trAiDartPack('summary', counts);
    document.getElementById('ai-dart-pack-apply').disabled = counts.replace === 0;
    document.getElementById('ai-dart-pack-preview').hidden = false;
}
async function applyStagedAiDartPack() {
    if (!stagedAiDartPack) return false;
    const rows = planAiDartPackImport(stagedAiDartPack, aiDartPackChoices);
    const selected = rows.filter(row => row.action === 'replace' && row.target && !row.reason && !row.same);
    if (!selected.length) { setAiDartPackStatus(trAiDartPack('noChanges'), true); return false; }
    for (const row of selected) row.target.aiDartAppearance = normalizeAiDartAppearance(row.entry.appearance);
    cancelAiDartPackImport();
    const current = typeof playerEditorCreating !== 'undefined' && !playerEditorCreating
        && typeof getPlayerEditorCandidate === 'function' ? getPlayerEditorCandidate() : null;
    if (current && selected.some(row => row.target === current)
        && typeof populateAiDartEditor === 'function') populateAiDartEditor(current);
    try {
        const saved = typeof saveGame !== 'function' || await saveGame(true, { immediate: true });
        if (saved === false) throw new Error('Save failed');
        setAiDartPackStatus(trAiDartPack('imported', { count: selected.length }));
        return true;
    } catch (_) { setAiDartPackStatus(trAiDartPack('saveFailed'), true); return false; }
}
if (typeof document !== 'undefined') refreshAiDartPackTranslations();
