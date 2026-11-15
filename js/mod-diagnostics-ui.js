const MOD_DIAGNOSTIC_TEXT = {
    title: ['Diagnostyka modów i bazy', 'Mod & database diagnostics', 'Mod- und Datenbankdiagnose', 'Mod- en databasediagnostiek'],
    open: ['Sprawdź mod / bazę', 'Check mod / database', 'Mod / Datenbank prüfen', 'Mod / database controleren'],
    intro: ['Sprawdź aktywną bazę albo paczkę ZIP/plik mod.json przed wczytaniem. Raport wskazuje błędy i ostrzeżenia; skan nie stosuje zmian.', 'Check the active database or a ZIP/mod.json before importing it. The report lists errors and warnings; scanning applies no changes.', 'Prüfe die aktive Datenbank oder eine ZIP/mod.json vor dem Import. Der Bericht zeigt Fehler und Warnungen; die Prüfung ändert keine Daten.', 'Controleer de actieve database of een ZIP/mod.json vóór import. Het rapport toont fouten en waarschuwingen; scannen wijzigt niets.'],
    current: ['Sprawdź aktywną bazę', 'Check active database', 'Aktive Datenbank prüfen', 'Actieve database controleren'],
    file: ['Sprawdź paczkę ZIP / mod.json', 'Check ZIP / mod.json', 'ZIP / mod.json prüfen', 'ZIP / mod.json controleren'],
    again: ['Sprawdź ponownie', 'Check again', 'Erneut prüfen', 'Opnieuw controleren'],
    download: ['Pobierz raport JSON', 'Download JSON report', 'JSON-Bericht herunterladen', 'JSON-rapport downloaden'],
    back: ['Wróć', 'Back', 'Zurück', 'Terug'],
    returnReport: ['Wróć do diagnostyki', 'Return to diagnostics', 'Zurück zur Diagnose', 'Terug naar diagnostiek'],
    search: ['Szukaj w raporcie', 'Search report', 'Bericht durchsuchen', 'Rapport doorzoeken'],
    all: ['Wszystkie', 'All', 'Alle', 'Alle'],
    level: ['Poziom komunikatu', 'Message level', 'Meldungsstufe', 'Meldingsniveau'],
    error: ['Błędy', 'Errors', 'Fehler', 'Fouten'],
    warning: ['Ostrzeżenia', 'Warnings', 'Warnungen', 'Waarschuwingen'],
    info: ['Informacje', 'Information', 'Informationen', 'Informatie'],
    summary: ['Zawodnicy: {players} · Turnieje: {events}', 'Players: {players} · Events: {events}', 'Spieler: {players} · Turniere: {events}', 'Spelers: {players} · Toernooien: {events}'],
    clean: ['Nie znaleziono błędów blokujących. Przejrzyj również ostrzeżenia i informacje o mediach.', 'No blocking errors found. Also review warnings and media information.', 'Keine blockierenden Fehler gefunden. Prüfe auch Warnungen und Medienhinweise.', 'Geen blokkerende fouten gevonden. Bekijk ook waarschuwingen en media-informatie.'],
    empty: ['Brak pozycji pasujących do filtrów.', 'No issues match the filters.', 'Keine Einträge passen zu den Filtern.', 'Geen meldingen komen overeen met de filters.'],
    scanning: ['Sprawdzanie danych…', 'Checking data…', 'Daten werden geprüft…', 'Gegevens controleren…'],
    more: ['Pokaż kolejne 100', 'Show next 100', 'Weitere 100 anzeigen', 'Volgende 100 tonen'],
    record: ['Pokaż wpis i lokalizację', 'Show record and location', 'Eintrag und Fundstelle anzeigen', 'Gegeven en locatie tonen'],
    edit: ['Otwórz w edytorze', 'Open in editor', 'Im Editor öffnen', 'Openen in editor'],
    fileNotice: ['To raport pliku przed importem. Rozwiń wpis, aby znaleźć dane do poprawienia w mod.json, popraw paczkę i sprawdź ją ponownie. Dla aktywnej kariery dostępne jest przejście do edytora.', 'This is a file report before import. Expand a record to locate the data in mod.json, fix the pack and check it again. Active-career reports can open the editor.', 'Dies ist ein Dateibericht vor dem Import. Klappe Einträge auf, korrigiere die Daten in mod.json und prüfe das Paket erneut. Berichte zur aktiven Karriere können den Editor öffnen.', 'Dit is een bestandsrapport vóór import. Vouw een gegeven uit, verbeter de gegevens in mod.json en controleer het pakket opnieuw. Rapporten van een actieve carrière kunnen de editor openen.'],
    noCareer: ['Przejście do edytora jest dostępne w aktywnej karierze.', 'Opening the editor is available in an active career.', 'Der Editor kann in einer aktiven Karriere geöffnet werden.', 'De editor kan worden geopend in een actieve carrière.'],
    stale: ['Ten wpis został zmieniony lub usunięty. Sprawdź bazę ponownie.', 'This record changed or was removed. Check the database again.', 'Dieser Eintrag wurde geändert oder gelöscht. Prüfe die Datenbank erneut.', 'Dit gegeven is gewijzigd of verwijderd. Controleer de database opnieuw.'],
    busy: ['Zaczekaj na zakończenie symulacji turnieju.', 'Wait for the tournament simulation to finish.', 'Warte auf das Ende der Turniersimulation.', 'Wacht tot de toernooisimulatie klaar is.'],
    invalidArchive: ['Nie można sprawdzić tego pliku.', 'This file could not be checked.', 'Diese Datei konnte nicht geprüft werden.', 'Dit bestand kon niet worden gecontroleerd.'],
    manifestTooLarge: ['Plik mod.json przekracza 32 MB.', 'mod.json exceeds 32 MB.', 'mod.json überschreitet 32 MB.', 'mod.json is groter dan 32 MB.'],
    invalidRoot: ['Oczekiwano obiektu mod.json z danymi gry.', 'Expected a mod.json object containing game data.', 'Ein mod.json-Objekt mit Spieldaten wird erwartet.', 'Een mod.json-object met spelgegevens wordt verwacht.'],
    invalidArray: ['Pole {field} musi być listą.', '{field} must be a list.', '{field} muss eine Liste sein.', '{field} moet een lijst zijn.'],
    invalidRecord: ['Wpis musi być obiektem danych.', 'The record must be a data object.', 'Der Eintrag muss ein Datenobjekt sein.', 'Het gegeven moet een gegevensobject zijn.'],
    missingName: ['Brakuje nazwy.', 'A name is missing.', 'Der Name fehlt.', 'Een naam ontbreekt.'],
    missingCountry: ['Brakuje kraju zawodnika.', 'The player country is missing.', 'Das Land des Spielers fehlt.', 'Het land van de speler ontbreekt.'],
    duplicatePlayer: ['{name}: powtórzone nazwisko i kraj; porównaj z {other}.', '{name}: duplicate name and country; compare with {other}.', '{name}: Name und Land doppelt; vergleiche mit {other}.', '{name}: dubbele naam en land; vergelijk met {other}.'],
    duplicateId: ['{name}: identyfikator powtarza się w {other}.', '{name}: the ID is also used in {other}.', '{name}: Die ID wird auch in {other} verwendet.', '{name}: de ID wordt ook gebruikt in {other}.'],
    duplicateTemplate: ['{name}: ten sam szablon zawodnika wskazuje {other}.', '{name}: the same player template is referenced by {other}.', '{name}: dieselbe Spielervorlage wird von {other} verwendet.', '{name}: hetzelfde spelerssjabloon wordt door {other} gebruikt.'],
    duplicateEvent: ['Nazwa lub alias „{alias}” jest też używany w {other}.', 'The name or alias “{alias}” is also used in {other}.', 'Der Name oder Alias „{alias}“ wird auch in {other} verwendet.', 'De naam of alias “{alias}” wordt ook gebruikt in {other}.'],
    invalidRating: ['{field}: wymagana liczba od 1 do 100.', '{field}: a number from 1 to 100 is required.', '{field}: Eine Zahl von 1 bis 100 ist erforderlich.', '{field}: een getal van 1 tot 100 is vereist.'],
    invalidMoney: ['{field}: nagroda lub ranking musi być nieujemną liczbą.', '{field}: prize money or ranking must be a nonnegative number.', '{field}: Preisgeld oder Ranglistenwert muss eine nichtnegative Zahl sein.', '{field}: prijzengeld of rankingwaarde moet een niet-negatief getal zijn.'],
    invalidBirthYear: ['Nietypowy lub nieprawidłowy rok urodzenia.', 'Unusual or invalid birth year.', 'Ungewöhnliches oder ungültiges Geburtsjahr.', 'Ongebruikelijk of ongeldig geboortejaar.'],
    invalidDate: ['Nieprawidłowy dzień lub miesiąc turnieju.', 'Invalid event day or month.', 'Ungültiger Turniertag oder -monat.', 'Ongeldige toernooidag of -maand.'],
    invalidFieldSize: ['Własna drabinka wymaga 8, 16, 32, 64, 128 lub 256 miejsc.', 'A custom field needs 8, 16, 32, 64, 128 or 256 places.', 'Ein eigenes Feld benötigt 8, 16, 32, 64, 128 oder 256 Plätze.', 'Een eigen deelnemersveld vereist 8, 16, 32, 64, 128 of 256 plaatsen.'],
    invalidFormat: ['Nieznany format. Obsługiwane: legs, sets, 501, DIDO, doubles, masterOut.', 'Unknown format. Supported: legs, sets, 501, DIDO, doubles, masterOut.', 'Unbekanntes Format. Unterstützt: legs, sets, 501, DIDO, doubles, masterOut.', 'Onbekend formaat. Ondersteund: legs, sets, 501, DIDO, doubles, masterOut.'],
    invalidRules: ['Nieprawidłowa pula miejsc, ścieżka kwalifikacji lub połączenie z cyklem.', 'Invalid place allocation, qualification route or tour link.', 'Ungültige Platzverteilung, Qualifikationsroute oder Tourverknüpfung.', 'Ongeldige plaatsverdeling, kwalificatieroute of tourkoppeling.'],
    missingEvent: ['Nie istnieje powiązany turniej: {key}.', 'Linked event does not exist: {key}.', 'Verknüpftes Turnier existiert nicht: {key}.', 'Gekoppeld toernooi bestaat niet: {key}.'],
    selfLink: ['Turniej odwołuje się do samego siebie.', 'The event references itself.', 'Das Turnier verweist auf sich selbst.', 'Het toernooi verwijst naar zichzelf.'],
    lateSource: ['Źródło „{key}” nie kończy się przed turniejem docelowym.', 'Source “{key}” does not finish before the target event.', 'Quelle „{key}“ endet nicht vor dem Zielturnier.', 'Bron “{key}” eindigt niet vóór het doeltoernooi.'],
    tooManySlots: ['Przydzielono {total} miejsc przy dostępnych {capacity}.', '{total} places allocated, but only {capacity} are available.', '{total} Plätze vergeben, aber nur {capacity} verfügbar.', '{total} plaatsen toegewezen, maar slechts {capacity} beschikbaar.'],
    cycle: ['Pętla kwalifikacji: „{name}” zależy od „{other}”, który prowadzi z powrotem do tej ścieżki.', 'Qualification cycle: “{name}” depends on “{other}”, which leads back to this route.', 'Qualifikationsschleife: „{name}“ hängt von „{other}“ ab, das zurück zu dieser Route führt.', 'Kwalificatiekring: “{name}” hangt af van “{other}”, dat naar deze route terugleidt.'],
    missingMedia: ['Nie znaleziono pliku lub klucza mediów: {file}.', 'Media file or key not found: {file}.', 'Mediendatei oder -schlüssel nicht gefunden: {file}.', 'Mediabestand of -sleutel niet gevonden: {file}.'],
    mediaCollision: ['Kilka plików używa klucza „{name}”. Podczas importu jeden zasłoni drugi.', 'Multiple files use the key “{name}”. One will overwrite another during import.', 'Mehrere Dateien verwenden „{name}“. Eine verdeckt beim Import die andere.', 'Meerdere bestanden gebruiken “{name}”. Eén overschrijft een ander bij import.'],
    mediaCase: ['Plik „{file}” różni się pisownią od nazwiska „{name}”. Gra rozróżnia wielkość liter w nazwach plików.', '“{file}” differs in spelling from “{name}”. File keys are case-sensitive.', '„{file}“ hat eine andere Schreibweise als „{name}“. Dateischlüssel unterscheiden Groß- und Kleinschreibung.', '“{file}” heeft een andere schrijfwijze dan “{name}”. Bestandssleutels zijn hoofdlettergevoelig.'],
    invalidSkin: ['Nieprawidłowa konfiguracja: {field}.', 'Invalid configuration: {field}.', 'Ungültige Konfiguration: {field}.', 'Ongeldige configuratie: {field}.'],
    coverage: ['Media osobiste: zdjęcia {photos}/{total}, muzyka {music}/{total}. Brak opcjonalnego pliku uruchamia standardowy wygląd lub dźwięk.', 'Personal media: photos {photos}/{total}, music {music}/{total}. Missing optional files use the default appearance or sound.', 'Persönliche Medien: Fotos {photos}/{total}, Musik {music}/{total}. Fehlende optionale Dateien nutzen Standardbild oder -ton.', 'Persoonlijke media: foto’s {photos}/{total}, muziek {music}/{total}. Bij ontbrekende optionele bestanden wordt de standaardweergave of -klank gebruikt.'],
    optionalPhotos: ['Brak osobistych zdjęć dla {count} graczy. Rozwiń listę, aby sprawdzić nazwiska; pliki są opcjonalne.', 'Personal photos are missing for {count} players. Expand the list to see names; these files are optional.', 'Für {count} Spieler fehlen persönliche Fotos. Klappe die Namensliste auf; die Dateien sind optional.', 'Persoonlijke foto’s ontbreken voor {count} spelers. Vouw de namenlijst uit; de bestanden zijn optioneel.'],
    optionalMusic: ['Brak osobistej muzyki dla {count} graczy. Rozwiń listę, aby sprawdzić nazwiska; pliki są opcjonalne.', 'Personal music is missing for {count} players. Expand the list to see names; these files are optional.', 'Für {count} Spieler fehlt persönliche Musik. Klappe die Namensliste auf; die Dateien sind optional.', 'Persoonlijke muziek ontbreekt voor {count} spelers. Vouw de namenlijst uit; de bestanden zijn optioneel.'],
    mediaNotChecked: ['Brak paczki mediów do sprawdzenia. Wybierz ZIP, aby zweryfikować zdjęcia i dźwięki.', 'No media pack is available to check. Choose a ZIP to verify photos and sounds.', 'Kein Medienpaket zur Prüfung verfügbar. Wähle eine ZIP, um Bilder und Töne zu prüfen.', 'Geen mediapakket beschikbaar. Kies een ZIP om foto’s en geluiden te controleren.'],
    remoteMedia: ['{count} odnośników do zewnętrznych mediów: dostępność w sieci nie została sprawdzona.', '{count} external media links: network availability was not checked.', '{count} externe Medienlinks: Netzwerkverfügbarkeit wurde nicht geprüft.', '{count} externe medialinks: beschikbaarheid op het netwerk is niet gecontroleerd.']
};
function trModDiagnostic(key, params = {}) {
    const index = Math.max(0, ['pl', 'en', 'de', 'nl'].indexOf(typeof currentLang === 'string' ? currentLang : 'pl'));
    return (MOD_DIAGNOSTIC_TEXT[key]?.[index] || key).replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}
let modDiagnosticReport = null, modDiagnosticTargets = null, modDiagnosticFile = null, modDiagnosticGeneration = 0;
let modDiagnosticReturnScreen = '', modDiagnosticLimit = 100, modDiagnosticLevel = 'all', modDiagnosticQuery = '';
function ensureModDiagnosticScreen() {
    if (document.getElementById('screen-mod-diagnostics')) return;
    const screen = document.createElement('main'); screen.id = 'screen-mod-diagnostics'; screen.className = 'screen mod-diagnostics-screen';
    document.body.appendChild(screen);
}
function showModDiagnostics() {
    const active = document.querySelector('.screen.active')?.id;
    if (active && active !== 'screen-mod-diagnostics') modDiagnosticReturnScreen = active;
    ensureModDiagnosticScreen(); renderModDiagnostics(); showScreen('screen-mod-diagnostics');
}
function refreshModDiagnosticsTranslations() {
    document.querySelectorAll('[data-mod-diagnostics-label]').forEach(node => { node.textContent = trModDiagnostic(node.dataset.modDiagnosticsLabel); });
    if (document.getElementById('screen-mod-diagnostics')?.classList.contains('active')) renderModDiagnostics();
}
function renderModDiagnostics() {
    const screen = document.getElementById('screen-mod-diagnostics'); if (!screen) return;
    screen.innerHTML = `<h2>${escapeHtml(trModDiagnostic('title'))}</h2><p>${escapeHtml(trModDiagnostic('intro'))}</p>
        <div class="scenario-actions"><button id="diagnostic-current" type="button">${escapeHtml(trModDiagnostic('current'))}</button>
        <button id="diagnostic-file-button" type="button">${escapeHtml(trModDiagnostic('file'))}</button><input id="diagnostic-file" type="file" accept=".zip,.json,application/json" hidden>
        <button id="diagnostic-again" type="button"${!modDiagnosticReport ? ' disabled' : ''}>${escapeHtml(trModDiagnostic('again'))}</button>
        <button id="diagnostic-export" type="button"${!modDiagnosticReport ? ' disabled' : ''}>${escapeHtml(trModDiagnostic('download'))}</button></div>
        <p id="diagnostic-status" role="status" aria-live="polite"></p><div id="diagnostic-summary"></div>
        <div class="diagnostic-filters"><label>${escapeHtml(trModDiagnostic('search'))}<input id="diagnostic-search" type="search" value="${escapeHtml(modDiagnosticQuery)}"></label>
        <label>${escapeHtml(trModDiagnostic('level'))}<select id="diagnostic-level">${['all', 'error', 'warning', 'info'].map(level => `<option value="${level}"${level === modDiagnosticLevel ? ' selected' : ''}>${escapeHtml(trModDiagnostic(level))}</option>`).join('')}</select></label></div>
        <div id="diagnostic-list"></div><button id="diagnostic-more" type="button" hidden>${escapeHtml(trModDiagnostic('more'))}</button>
        <button id="diagnostic-back" type="button" class="action-btn">${escapeHtml(trModDiagnostic('back'))}</button>`;
    document.getElementById('diagnostic-current').onclick = scanCurrentModDatabase;
    document.getElementById('diagnostic-file-button').onclick = () => document.getElementById('diagnostic-file').click();
    document.getElementById('diagnostic-file').onchange = event => { const file = event.target.files[0]; event.target.value = ''; if (file) scanModDiagnosticFile(file); };
    document.getElementById('diagnostic-again').onclick = () => modDiagnosticFile ? scanModDiagnosticFile(modDiagnosticFile) : scanCurrentModDatabase();
    document.getElementById('diagnostic-export').onclick = exportModDiagnosticReport;
    document.getElementById('diagnostic-search').oninput = event => { modDiagnosticQuery = event.target.value; modDiagnosticLimit = 100; renderModDiagnosticIssues(); };
    document.getElementById('diagnostic-level').onchange = event => { modDiagnosticLevel = event.target.value; modDiagnosticLimit = 100; renderModDiagnosticIssues(); };
    document.getElementById('diagnostic-more').onclick = () => { modDiagnosticLimit += 100; renderModDiagnosticIssues(); };
    document.getElementById('diagnostic-back').onclick = () => showScreen(modDiagnosticReturnScreen || 'screen-start');
    renderModDiagnosticIssues();
}
function renderModDiagnosticIssues() {
    const report = modDiagnosticReport, summary = document.getElementById('diagnostic-summary'), list = document.getElementById('diagnostic-list');
    if (!summary || !list) return;
    if (!report) { summary.textContent = ''; list.textContent = ''; return; }
    summary.innerHTML = `<h3>${escapeHtml(report.source === 'current' ? trModDiagnostic('current') : report.label)}</h3><p>${escapeHtml(trModDiagnostic('summary', report))}</p>
        <div class="diagnostic-counts">${['error', 'warning', 'info'].map(level => `<span class="diagnostic-${level}">${escapeHtml(trModDiagnostic(level))}: <strong>${report.counts[level]}</strong></span>`).join('')}</div>
        ${!report.counts.error ? `<p>${escapeHtml(trModDiagnostic('clean'))}</p>` : ''}
        ${report.source !== 'current' ? `<p class="planning-note">${escapeHtml(trModDiagnostic('fileNotice'))}</p>` : !player?.name ? `<p>${escapeHtml(trModDiagnostic('noCareer'))}</p>` : ''}`;
    const query = modDiagnosticIdentity(modDiagnosticQuery);
    const matches = report.issues.map((issue, index) => ({ issue, index })).filter(({ issue }) => (modDiagnosticLevel === 'all' || issue.severity === modDiagnosticLevel)
        && (!query || modDiagnosticIdentity([trModDiagnostic(issue.code, issue.params), issue.path, issue.params.name, issue.detail].join(' ')).includes(query)));
    list.innerHTML = matches.slice(0, modDiagnosticLimit).map(({ issue, index }) => `<article class="diagnostic-issue diagnostic-${issue.severity}">
        <span class="diagnostic-badge">${escapeHtml(trModDiagnostic(issue.severity))}</span><p>${escapeHtml(trModDiagnostic(issue.code, issue.params))}</p>
        <code>${escapeHtml(issue.path)}</code>${issue.detail ? `<p class="planning-note">${escapeHtml(issue.detail)}</p>` : ''}
        ${issue.record != null ? `<details><summary>${escapeHtml(trModDiagnostic('record'))}</summary><pre>${escapeHtml(JSON.stringify(issue.record, null, 2))}</pre></details>` : ''}
        ${report.source === 'current' && player?.name && issue.target ? `<button type="button" data-diagnostic-edit="${index}">${escapeHtml(trModDiagnostic('edit'))}</button>` : ''}</article>`).join('') || `<p>${escapeHtml(trModDiagnostic('empty'))}</p>`;
    document.getElementById('diagnostic-more').hidden = matches.length <= modDiagnosticLimit;
    list.querySelectorAll('[data-diagnostic-edit]').forEach(button => { button.onclick = () => openModDiagnosticTarget(Number(button.dataset.diagnosticEdit)); });
}
function scanCurrentModDatabase() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) { document.getElementById('diagnostic-status').textContent = trModDiagnostic('busy'); return; }
    modDiagnosticGeneration++; modDiagnosticFile = null;
    const players = typeof pdcPlayers !== 'undefined' ? [...pdcPlayers] : [];
    if (typeof player !== 'undefined' && player?.name && !players.includes(player)) players.push(player);
    const events = typeof tournamentDatabase !== 'undefined' ? [...tournamentDatabase] : [];
    const active = typeof activeModData !== 'undefined' ? activeModData : null;
    const assets = active && typeof moddedAssets !== 'undefined' ? moddedAssets : null;
    modDiagnosticTargets = { players, events };
    modDiagnosticReport = inspectDartsMod({ pdcPlayers: players, tournamentDatabase: events,
        ...(active?.dartboard ? { dartboard: active.dartboard } : {}), ...(active?.surround ? { surround: active.surround } : {}) },
        { source: 'current', label: trModDiagnostic('current'), media: assets,
            tours: typeof player !== 'undefined' ? cloneModDiagnosticValue(player?.calendarEditor?.tours || []) : [] });
    modDiagnosticLimit = 100; renderModDiagnostics();
}
async function scanModDiagnosticFile(file) {
    const generation = ++modDiagnosticGeneration; modDiagnosticFile = file;
    document.getElementById('diagnostic-status').textContent = trModDiagnostic('scanning');
    try {
        let data, files = null;
        if (/\.json$/i.test(file.name)) {
            if (file.size > 32 * 1024 * 1024) throw new Error(trModDiagnostic('manifestTooLarge'));
            data = JSON.parse(await file.text());
        } else {
            const archive = await JSZip.loadAsync(file), manifest = findModManifest(archive);
            if (Number(manifest.entry._data?.uncompressedSize) > 32 * 1024 * 1024) throw new Error(trModDiagnostic('manifestTooLarge'));
            data = JSON.parse(await manifest.entry.async('string'));
            files = Object.values(archive.files).filter(entry => !entry.dir && entry.name.startsWith(manifest.prefix)).map(entry => entry.name.slice(manifest.prefix.length));
        }
        if (generation !== modDiagnosticGeneration) return;
        modDiagnosticTargets = null;
        modDiagnosticReport = inspectDartsMod(data, { source: 'file', label: file.name, files,
            players: typeof pdcPlayers !== 'undefined' ? pdcPlayers : [], events: typeof tournamentDatabase !== 'undefined' ? tournamentDatabase : [],
            tours: Array.isArray(data?.calendarEditor?.tours) ? data.calendarEditor.tours : [] });
    } catch (error) {
        if (generation !== modDiagnosticGeneration) return;
        modDiagnosticTargets = null; modDiagnosticReport = { source: 'file', label: file.name, players: 0, events: 0,
            counts: { error: 1, warning: 0, info: 0 }, issues: [{ severity: 'error', code: 'invalidArchive', path: file.name, params: {}, detail: error.message }] };
    }
    modDiagnosticLimit = 100;
    if (document.getElementById('screen-mod-diagnostics')?.classList.contains('active')) renderModDiagnostics();
}
function openModDiagnosticTarget(index) {
    const issue = modDiagnosticReport?.issues[index], target = issue?.target;
    if (modDiagnosticReport?.source !== 'current' || !target || !player?.name) return;
    const record = modDiagnosticTargets?.[target.kind === 'player' ? 'players' : 'events']?.[target.index];
    const available = target.kind === 'player' ? [...pdcPlayers, player] : tournamentDatabase;
    if (!record || !available.includes(record)) { document.getElementById('diagnostic-status').textContent = trModDiagnostic('stale'); return; }
    if (target.kind === 'player') { showPlayerEditor(); selectPlayerEditorCandidate(record.id); }
    else { showTournamentEditor(); populateTournamentEditorForm(record); }
    const screen = document.getElementById(target.kind === 'player' ? 'screen-player-editor' : 'screen-tournament-editor');
    let button = screen.querySelector('[data-diagnostic-return]');
    if (!button) { button = document.createElement('button'); button.type = 'button'; button.dataset.diagnosticReturn = ''; button.dataset.modDiagnosticsLabel = 'returnReport'; button.className = 'action-btn'; screen.prepend(button); }
    button.textContent = trModDiagnostic('returnReport'); button.onclick = () => { showModDiagnostics(); scanCurrentModDatabase(); };
    const fields = target.kind === 'player' ? { name: 'player-editor-first-name', country: 'player-editor-country', photo: 'player-editor-photo-url', walkon: 'player-editor-walkon-url' }
        : { name: 'te-name', day: 'te-start', endDay: 'te-end', editorQualification: 'te-qualification-mode', editorPrizes: 'te-prize-winner' };
    const field = fields[issue.path.split('.').pop()]; if (field) document.getElementById(field)?.focus();
}
function exportModDiagnosticReport() {
    if (!modDiagnosticReport) return;
    const blob = new Blob([JSON.stringify(modDiagnosticReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'dartscareer-diagnostics.json'; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
if (typeof document !== 'undefined') refreshModDiagnosticsTranslations();
