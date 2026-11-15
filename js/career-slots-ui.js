const CAREER_SLOTS_TEXT = {
    title: ['Twoje kariery', 'Your careers', 'Deine Karrieren', 'Jouw carrières'],
    open: ['Panel karier', 'Career slots', 'Karriereplätze', 'Carrièreslots'],
    intro: ['Oddzielne sloty zachowują postęp, bazę kariery oraz zdjęcie i muzykę profilu. Przełączenie zapisuje bieżącą karierę.', 'Separate slots preserve progress, the career database, and profile photo and music. Switching saves your current career.', 'Getrennte Plätze speichern Fortschritt, Karrieredatenbank sowie Profilfoto und Musik. Beim Wechsel wird deine aktuelle Karriere gespeichert.', 'Aparte slots bewaren voortgang, carrièredatabase, profielfoto en muziek. Wisselen slaat je huidige carrière op.'],
    backupsHint: ['Do 10 slotów i 3 kopii na karierę. Kopie powstają przy zmianie daty w grze lub co 5 minut zapisywania, a także przed importem i przywracaniem.', 'Up to 10 slots and 3 backups per career. Backups are made when the game date changes or after 5 minutes of saving, and before imports and restoration.', 'Bis zu 10 Plätze und 3 Kopien je Karriere. Kopien entstehen bei geändertem Spieldatum oder nach 5 Minuten beim Speichern sowie vor Import und Wiederherstellung.', 'Tot 10 slots en 3 kopieën per carrière. Kopieën ontstaan bij een andere speldatum of na 5 minuten bij opslaan, en vóór import en herstel.'],
    shared: ['Pakiet moda i ustawienia strony są wspólne dla przeglądarki. Wczytanie slotu zachowuje zapisane dane jego kariery.', 'The mod package and site settings are shared in this browser. Loading a slot preserves its saved career data.', 'Mod-Paket und Seiteneinstellungen werden im Browser geteilt. Beim Laden bleiben die gespeicherten Karrieredaten des Platzes erhalten.', 'Het modpakket en site-instellingen worden in deze browser gedeeld. Laden behoudt de opgeslagen carrièregegevens van het slot.'],
    save: ['Zapisz bieżącą karierę', 'Save current career', 'Aktuelle Karriere speichern', 'Huidige carrière opslaan'],
    fork: ['Zapisz jako osobny slot', 'Save as a separate slot', 'Als eigenen Platz speichern', 'Als apart slot opslaan'],
    manualBackup: ['Utwórz kopię teraz', 'Create backup now', 'Jetzt Kopie erstellen', 'Nu kopie maken'],
    new: ['Ekran startowy / nowa kariera', 'Start screen / new career', 'Startbildschirm / neue Karriere', 'Startscherm / nieuwe carrière'],
    import: ['Importuj JSON do nowego slotu', 'Import JSON into a new slot', 'JSON in neuen Platz importieren', 'JSON in een nieuw slot importeren'],
    refresh: ['Odśwież listę', 'Refresh list', 'Liste aktualisieren', 'Lijst vernieuwen'],
    back: ['Wróć', 'Back', 'Zurück', 'Terug'],
    load: ['Wczytaj', 'Load', 'Laden', 'Laden'],
    export: ['Eksportuj JSON', 'Export JSON', 'JSON exportieren', 'JSON exporteren'],
    remove: ['Usuń slot', 'Delete slot', 'Platz löschen', 'Slot verwijderen'],
    active: ['Aktywna kariera', 'Active career', 'Aktive Karriere', 'Actieve carrière'],
    last: ['Ostatnio używana', 'Last used', 'Zuletzt verwendet', 'Laatst gebruikt'],
    label: ['Nazwa slotu', 'Slot name', 'Name des Platzes', 'Slotnaam'],
    rename: ['Zmień nazwę', 'Rename', 'Umbenennen', 'Hernoemen'],
    date: ['Data w grze', 'Game date', 'Spieldatum', 'Speldatum'],
    saved: ['Ostatni zapis', 'Last saved', 'Zuletzt gespeichert', 'Laatst opgeslagen'],
    trophies: ['Trofea', 'Trophies', 'Trophäen', 'Trofeeën'],
    rankingMoney: ['Pieniądze OOM', 'OOM earnings', 'OOM-Preisgeld', 'OOM-prijzengeld'],
    openDescription: ['Wybierz karierę lub przywróć wcześniejszą kopię.', 'Choose a career or restore an earlier backup.', 'Wähle eine Karriere oder stelle eine frühere Kopie wieder her.', 'Kies een carrière of herstel een eerdere kopie.'],
    localStorageHint: ['Sloty są zapisane w tej przeglądarce. Eksport JSON pozwala zachować kopię poza nią.', 'Slots are saved in this browser. Export JSON to keep a copy elsewhere.', 'Plätze werden in diesem Browser gespeichert. Mit JSON-Export behältst du eine Kopie außerhalb des Browsers.', 'Slots staan in deze browser. Exporteer JSON om elders een kopie te bewaren.'],
    card: ['Karta PDC', 'PDC card', 'PDC-Karte', 'PDC-kaart'],
    backups: ['Automatyczne kopie ({count})', 'Automatic backups ({count})', 'Automatische Kopien ({count})', 'Automatische kopieën ({count})'],
    noBackups: ['Kopie pojawią się podczas kolejnych zapisów. Możesz też utworzyć kopię teraz.', 'Backups appear during later saves. You can also create a backup now.', 'Kopien entstehen bei späteren Speichervorgängen. Du kannst auch jetzt eine erstellen.', 'Kopieën ontstaan bij volgende opslagmomenten. Je kunt ook nu een kopie maken.'],
    restore: ['Przywróć tę kopię', 'Restore this backup', 'Diese Kopie wiederherstellen', 'Deze kopie herstellen'],
    empty: ['Nie masz jeszcze zapisanych karier. Rozpocznij grę lub zaimportuj JSON.', 'No careers have been saved yet. Start a game or import JSON.', 'Noch keine gespeicherten Karrieren. Starte ein Spiel oder importiere JSON.', 'Er zijn nog geen opgeslagen carrières. Start een spel of importeer JSON.'],
    count: ['Zajęte sloty: {count}/{limit}', 'Slots used: {count}/{limit}', 'Belegte Plätze: {count}/{limit}', 'Gebruikte slots: {count}/{limit}'],
    working: ['Zabezpieczanie i wczytywanie kariery…', 'Securing and loading career data…', 'Karrieredaten werden gesichert und geladen…', 'Carrièregegevens beveiligen en laden…'],
    done: ['Zapisano zmiany.', 'Changes saved.', 'Änderungen gespeichert.', 'Wijzigingen opgeslagen.'],
    fallbackLoad: ['Spróbuj wczytać zapis awaryjny', 'Try loading the fallback save', 'Notfallspeicherstand laden', 'Reserveopslag proberen te laden'],
    deleteConfirm: ['Usunąć slot „{name}” i wszystkie jego kopie? Najpierw możesz wyeksportować JSON. Pozostałe kariery zostaną zachowane.', 'Delete “{name}” and all its backups? You can export JSON first. Other careers will be preserved.', '„{name}“ und alle zugehörigen Kopien löschen? Du kannst zuerst JSON exportieren. Andere Karrieren bleiben erhalten.', '“{name}” en alle kopieën verwijderen? Je kunt eerst JSON exporteren. Andere carrières blijven behouden.'],
    restoreConfirm: ['Przywrócić kopię z {date}? Bieżący zapis tego slotu zostanie najpierw zachowany jako kopia.', 'Restore the backup from {date}? This slot’s current save will first be preserved as a backup.', 'Kopie vom {date} wiederherstellen? Der aktuelle Stand dieses Platzes wird zuvor als Kopie gesichert.', 'Kopie van {date} herstellen? De huidige opslag van dit slot wordt eerst als kopie bewaard.'],
    automatic: ['Kopia automatyczna', 'Automatic backup', 'Automatische Kopie', 'Automatische kopie'],
    manual: ['Kopia ręczna', 'Manual backup', 'Manuelle Kopie', 'Handmatige kopie'],
    beforeImport: ['Przed importem', 'Before import', 'Vor dem Import', 'Vóór import'],
    beforeRestore: ['Przed przywróceniem', 'Before restoration', 'Vor der Wiederherstellung', 'Vóór herstel'],
    beforeReload: ['Przed ponownym wczytaniem', 'Before reloading', 'Vor erneutem Laden', 'Vóór opnieuw laden'],
    CAREER_SLOT_BUSY: ['Trwa inna operacja na karierach. Zaczekaj na jej zakończenie.', 'Another career operation is running. Wait for it to finish.', 'Eine andere Karriereaktion läuft. Warte auf ihren Abschluss.', 'Er loopt een andere carrièreactie. Wacht tot die klaar is.'],
    CAREER_SLOT_PLAYING: ['Najpierw zakończ symulację turnieju lub bieżący mecz.', 'Finish the tournament simulation or current match first.', 'Beende zuerst die Turniersimulation oder das aktuelle Spiel.', 'Rond eerst de toernooisimulatie of huidige wedstrijd af.'],
    CAREER_SLOT_LIMIT: ['Wykorzystano 10 slotów. Wyeksportuj i usuń nieużywaną karierę, aby utworzyć następną.', 'All 10 slots are used. Export and delete an unused career to create another.', 'Alle 10 Plätze sind belegt. Exportiere und lösche eine ungenutzte Karriere für einen neuen Platz.', 'Alle 10 slots zijn gebruikt. Exporteer en verwijder een ongebruikte carrière voor een nieuw slot.'],
    CAREER_SLOT_CONFLICT: ['Inna karta przeglądarki zmieniła ten slot. Wczytaj go ponownie albo zapisz bieżący postęp jako osobny slot.', 'Another browser tab changed this slot. Reload it or save your current progress as a separate slot.', 'Ein anderer Browser-Tab hat diesen Platz geändert. Lade ihn erneut oder speichere deinen Fortschritt als eigenen Platz.', 'Een ander browsertabblad heeft dit slot gewijzigd. Laad het opnieuw of sla je voortgang als apart slot op.'],
    CAREER_SLOT_SAVE_REQUIRED: ['Nie udało się bezpiecznie zapisać pełnej kariery w slocie. Operację przerwano. Zachowaj postęp przez eksport JSON i sprawdź dostępne miejsce w przeglądarce.', 'The complete career could not be safely saved in a slot. The operation was stopped. Export JSON to preserve progress and check browser storage space.', 'Die vollständige Karriere konnte nicht sicher gespeichert werden. Die Aktion wurde abgebrochen. Exportiere JSON und prüfe den Browserspeicher.', 'De volledige carrière kon niet veilig in een slot worden opgeslagen. De actie is gestopt. Exporteer JSON en controleer browseropslag.'],
    CAREER_SLOT_DELETE_ACTIVE: ['Aktywnej kariery nie można usunąć podczas gry. Wczytaj inny slot lub użyj przycisku ekranu startowego.', 'The active career cannot be deleted during play. Load another slot or use the start-screen button.', 'Die aktive Karriere kann während des Spiels nicht gelöscht werden. Lade einen anderen Platz oder wechsle zum Startbildschirm.', 'De actieve carrière kan tijdens het spelen niet worden verwijderd. Laad een ander slot of ga naar het startscherm.'],
    CAREER_SLOT_MISSING: ['Ten slot lub kopia nie jest już dostępny. Odśwież listę.', 'This slot or backup is no longer available. Refresh the list.', 'Dieser Platz oder diese Kopie ist nicht mehr verfügbar. Aktualisiere die Liste.', 'Dit slot of deze kopie is niet meer beschikbaar. Vernieuw de lijst.'],
    CAREER_SLOT_INVALID: ['Nieprawidłowy zapis kariery. Dotychczasowy stan pozostaje zabezpieczony.', 'Invalid career save. The previous state remains protected.', 'Ungültiger Karrierespeicherstand. Der bisherige Stand bleibt gesichert.', 'Ongeldige carrièreopslag. De vorige toestand blijft beschermd.'],
    CAREER_SLOT_LABEL: ['Nazwa slotu może mieć do 60 znaków.', 'A slot name can contain up to 60 characters.', 'Ein Platzname darf höchstens 60 Zeichen haben.', 'Een slotnaam mag maximaal 60 tekens bevatten.'],
    CAREER_SLOT_FILE_SIZE: ['Plik kariery przekracza 256 MB.', 'The career file exceeds 256 MB.', 'Die Karrieredatei überschreitet 256 MB.', 'Het carrièrebestand is groter dan 256 MB.'],
    CAREER_SLOT_NO_CAREER: ['Najpierw rozpocznij lub wczytaj karierę.', 'Start or load a career first.', 'Starte oder lade zuerst eine Karriere.', 'Start of laad eerst een carrière.'],
    CAREER_SLOT_NEW_SAVE_WARNING: ['Kariera została rozpoczęta, ale nie udało się zapisać jej w całości ze zdjęciem i muzyką. Wyeksportuj JSON, aby zachować pełny postęp, i sprawdź dostępne miejsce w przeglądarce.', 'Your career has started, but could not be fully saved with its photo and music. Export JSON to preserve everything and check browser storage space.', 'Deine Karriere wurde gestartet, konnte aber nicht vollständig mit Foto und Musik gespeichert werden. Exportiere JSON und prüfe den Browserspeicher.', 'Je carrière is gestart, maar kon niet volledig met foto en muziek worden opgeslagen. Exporteer JSON om alles te bewaren en controleer browseropslag.'],
    storageError: ['Panel wielu karier wymaga działającej pamięci IndexedDB. Dotychczasowy zapis pozostaje na swoim miejscu. Możesz spróbować zapisu awaryjnego lub eksportu JSON.', 'Multiple careers require working IndexedDB storage. The existing save remains in place. You can try fallback loading or export JSON.', 'Mehrere Karrieren benötigen funktionierenden IndexedDB-Speicher. Der vorhandene Spielstand bleibt erhalten. Versuche den Notfallspeicherstand oder JSON-Export.', 'Meerdere carrières vereisen werkende IndexedDB-opslag. De bestaande opslag blijft behouden. Probeer de reserveopslag of JSON-export.']
};
function trCareerSlots(key, params = {}) {
    const index = Math.max(0, ['pl', 'en', 'de', 'nl'].indexOf(typeof currentLang === 'string' ? currentLang : 'pl'));
    return (CAREER_SLOTS_TEXT[key]?.[index] || key).replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}
let careerSlotsView = null, careerSlotsReturnScreen = '', careerSlotsGeneration = 0, careerSlotsUiBusy = false;
let careerSlotsViewError = '', careerSlotsNotice = '', careerSlotsInertNodes = [];
function careerSlotErrorText(error) {
    return CAREER_SLOTS_TEXT[error?.code] ? trCareerSlots(error.code) : error instanceof SyntaxError ? trCareerSlots('CAREER_SLOT_INVALID') : trCareerSlots('storageError');
}
function showCareerSlotError(error) {
    careerSlotsViewError = careerSlotErrorText(error);
    if (document.getElementById('screen-career-slots')?.classList.contains('active')) renderCareerSlots();
    else alert(careerSlotsViewError);
}
function setCareerSlotBusyUI(busy) {
    document.getElementById('career-slot-busy')?.remove();
    if (!busy) { careerSlotsInertNodes.forEach(([node, inert]) => { node.inert = inert; }); careerSlotsInertNodes = []; return; }
    careerSlotsInertNodes = [...document.querySelectorAll('main, header, footer')].map(node => [node, node.inert]);
    careerSlotsInertNodes.forEach(([node]) => { node.inert = true; });
    const overlay = document.createElement('div'); overlay.id = 'career-slot-busy'; overlay.setAttribute('role', 'status');
    overlay.textContent = trCareerSlots('working'); document.body.appendChild(overlay);
}
function careerSlotsDate(value, time = false) {
    const locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[currentLang] || 'en-GB';
    const date = new Date(value); return Number.isNaN(date.getTime()) ? '—' : time ? date.toLocaleString(locale) : date.toLocaleDateString(locale);
}
function refreshCareerSlotsTranslations() {
    document.querySelectorAll('[data-career-slots-label]').forEach(node => { node.textContent = trCareerSlots(node.dataset.careerSlotsLabel); });
    if (document.getElementById('screen-career-slots')?.classList.contains('active')) renderCareerSlots();
}
async function showCareerSlots() {
    const active = document.querySelector('.screen.active')?.id;
    if (active === 'screen-match' && typeof currentMatch !== 'undefined' && currentMatch) { showCareerSlotError(careerSlotError('CAREER_SLOT_PLAYING')); return false; }
    if (active && active !== 'screen-career-slots') careerSlotsReturnScreen = active;
    showScreen('screen-career-slots'); renderCareerSlots();
    return refreshCareerSlotsList();
}
async function refreshCareerSlotsList() {
    const generation = ++careerSlotsGeneration;
    try {
        const view = await listCareerSlots(); if (generation !== careerSlotsGeneration) return;
        careerSlotsView = view; careerSlotsViewError = '';
    } catch (error) { if (generation !== careerSlotsGeneration) return; careerSlotsViewError = careerSlotErrorText(error); }
    if (document.getElementById('screen-career-slots')?.classList.contains('active')) renderCareerSlots();
}
function renderCareerSlots() {
    const screen = document.getElementById('screen-career-slots'); if (!screen) return;
    const active = Boolean(typeof player !== 'undefined' && player?.name), view = careerSlotsView;
    const disabled = careerSlotsUiBusy ? ' disabled' : '';
    const button = (id, key, unavailable = false) => `<button type="button" id="${id}"${unavailable || careerSlotsUiBusy ? ' disabled' : ''}>${escapeHtml(trCareerSlots(key))}</button>`;
    screen.innerHTML = `<h2>${escapeHtml(trCareerSlots('title'))}</h2><p>${escapeHtml(trCareerSlots('intro'))}</p>
        <p class="career-slots-note">${escapeHtml(trCareerSlots('backupsHint'))}</p><p class="career-slots-note">${escapeHtml(trCareerSlots('shared'))}</p><p class="career-slots-note">${escapeHtml(trCareerSlots('localStorageHint'))}</p>
        <div class="career-slots-toolbar">${button('career-slots-save','save',!active)}${button('career-slots-fork','fork',!active || view?.slots.length >= CAREER_SLOT_LIMIT)}
        ${button('career-slots-backup','manualBackup',!active)}${button('career-slots-new','new')}${button('career-slots-import-button','import',view?.slots.length >= CAREER_SLOT_LIMIT)}
        <input id="career-slots-import" type="file" accept=".json,application/json" hidden>${button('career-slots-refresh','refresh')}</div>
        <p id="career-slots-status" role="status" aria-live="polite">${escapeHtml(careerSlotsViewError || (careerSlotsNotice ? trCareerSlots(careerSlotsNotice) : ''))}</p>
        ${careerSlotsViewError ? button('career-slots-fallback','fallbackLoad') : ''}
        ${view ? `<p>${escapeHtml(trCareerSlots('count',{count:view.slots.length,limit:CAREER_SLOT_LIMIT}))}</p>` : ''}
        <div class="career-slot-list">${view?.slots.length ? view.slots.map(slot => {
            const backups = view.backups.filter(backup => backup.slotId === slot.id), isActive = slot.id === getActiveCareerSlotId();
            const progress = meta => `${escapeHtml(trCareerSlots('date'))}: ${escapeHtml(careerSlotsDate(meta.gameDate))} · OVR ${meta.overall} · ${escapeHtml(trCareerSlots('rankingMoney'))}: £${Number(meta.prizeMoney || 0).toLocaleString()} · ${escapeHtml(trCareerSlots('trophies'))}: ${meta.trophies}`;
            const action = (key, label, extra = '', blocked = false) => `<button type="button" data-slot-action="${key}" data-slot-id="${escapeHtml(slot.id)}"${extra}${blocked || careerSlotsUiBusy ? ' disabled' : ''}>${escapeHtml(trCareerSlots(label))}</button>`;
            return `<article class="career-slot-card" data-career-slot="${escapeHtml(slot.id)}"><div class="career-slot-heading"><h3>${escapeHtml(slot.label || slot.playerName)}</h3>
                ${isActive ? `<span class="career-slot-active">${escapeHtml(trCareerSlots('active'))}</span>` : !active && view.lastSlotId === slot.id ? `<span>${escapeHtml(trCareerSlots('last'))}</span>` : ''}</div>
                <p>${typeof getFlagImg === 'function' ? getFlagImg(slot.country) : ''} ${escapeHtml(slot.playerName)}${slot.tourCard ? ' · ' + escapeHtml(trCareerSlots('card')) : ''}</p>
                <p>${progress(slot)}</p><p class="career-slots-note">${escapeHtml(trCareerSlots('saved'))}: ${escapeHtml(careerSlotsDate(slot.savedAt,true))}</p>
                ${slot.tournament ? `<p>${escapeHtml(slot.tournament)}</p>` : ''}
                <div class="career-slot-rename"><label for="slot-name-${escapeHtml(slot.id)}">${escapeHtml(trCareerSlots('label'))}</label><input id="slot-name-${escapeHtml(slot.id)}" maxlength="60" value="${escapeHtml(slot.label)}" placeholder="${escapeHtml(slot.playerName)}"${disabled}>${action('rename','rename')}</div>
                <div class="career-slots-toolbar">${action('load','load')}${action('export','export')}${action('delete','remove','',isActive)}</div>
                <details class="career-slot-backups"><summary>${escapeHtml(trCareerSlots('backups',{count:backups.length}))}</summary>
                ${backups.length ? backups.map(backup => {
                    const reason = { 'before-import':'beforeImport','before-restore':'beforeRestore','before-reload':'beforeReload',manual:'manual' }[backup.reason] || 'automatic';
                    const attr = ` data-backup-id="${escapeHtml(backup.id)}"`;
                    return `<section class="career-slot-backup"><h4>${escapeHtml(trCareerSlots(reason))} · ${escapeHtml(careerSlotsDate(backup.savedAt,true))}</h4><p>${progress(backup)}</p>
                        <div class="career-slots-toolbar">${action('restore','restore',attr)}${action('export','export',attr)}</div></section>`;
                }).join('') : `<p>${escapeHtml(trCareerSlots('noBackups'))}</p>`}</details></article>`;
        }).join('') : view ? `<p>${escapeHtml(trCareerSlots('empty'))}</p>` : `<p>${escapeHtml(trCareerSlots('working'))}</p>`}</div>
        ${button('career-slots-back','back')}`;
    document.getElementById('career-slots-save').onclick = () => runCareerSlotsUIAction(() => withCareerSlotAction(() => saveCurrentCareerForSlotAction()));
    document.getElementById('career-slots-backup').onclick = () => runCareerSlotsUIAction(() => withCareerSlotAction(() => saveCurrentCareerForSlotAction({slotBackupReason:'manual',slotBackupIncoming:true})));
    document.getElementById('career-slots-fork').onclick = () => runCareerSlotsUIAction(duplicateCurrentCareerSlot);
    document.getElementById('career-slots-new').onclick = () => runCareerSlotsUIAction(startNewCareerFromSlots);
    document.getElementById('career-slots-refresh').onclick = refreshCareerSlotsList;
    document.getElementById('career-slots-import-button').onclick = () => document.getElementById('career-slots-import').click();
    document.getElementById('career-slots-import').onchange = importCareerSlotFile;
    document.getElementById('career-slots-fallback')?.addEventListener('click', () => runCareerSlotsUIAction(async()=>{if(!await loadGame(false))throw careerSlotError('CAREER_SLOT_MISSING');}));
    document.getElementById('career-slots-back').onclick = () => showScreen(careerSlotsReturnScreen || 'screen-create-player');
    screen.querySelectorAll('[data-slot-action]').forEach(node => node.addEventListener('click', () => {
        const id=node.dataset.slotId, backupId=node.dataset.backupId, slot=view.slots.find(slot=>slot.id===id);
        if (!slot) return;
        const action=node.dataset.slotAction;
        if (action==='delete' && !confirm(trCareerSlots('deleteConfirm',{name:slot.label||slot.playerName}))) return;
        if (action==='restore') {
            const backup=view.backups.find(backup=>backup.id===backupId);
            if (!backup || !confirm(trCareerSlots('restoreConfirm',{date:careerSlotsDate(backup.savedAt,true)}))) return;
        }
        const name = document.getElementById(`slot-name-${id}`)?.value || '';
        runCareerSlotsUIAction(()=>action==='rename'?renameCareerSlot(id,name):action==='delete'?deleteCareerSlot(id)
            :action==='export'?exportCareerSlot(id,backupId):loadCareerSlot(id,backupId));
    }));
}
async function runCareerSlotsUIAction(action) {
    if (careerSlotsUiBusy) return false;
    careerSlotsUiBusy=true;careerSlotsNotice='';careerSlotsViewError='';renderCareerSlots();
    try { await action();careerSlotsNotice='done';await refreshCareerSlotsList();return true; }
    catch(error){careerSlotsViewError=careerSlotErrorText(error);return false;}
    finally{careerSlotsUiBusy=false;if(document.getElementById('screen-career-slots')?.classList.contains('active'))renderCareerSlots();}
}
if (typeof document!=='undefined') refreshCareerSlotsTranslations();
