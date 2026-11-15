const TOURNAMENT_ABSENCE_TEXT = {
    title: ['Absencje','Absences','Abwesenheiten','Afwezigheid'],
    intro: ['Zgłoś absencję swojego lub wybranego zawodnika. Wybierz dzień jej ogłoszenia; do tego dnia zgłoszenie pozostaje planem.', 'Declare an absence for your player or another player. Choose its announcement date; until then it remains a plan.', 'Melde deinen oder einen anderen Spieler ab. Wähle das Bekanntgabedatum; bis dahin bleibt es eine Planung.', 'Meld je eigen of een andere speler af. Kies de datum van bekendmaking; tot die dag blijft het een plan.'],
    etHint: ['Absencja w głównym ET obejmuje też jego kwalifikacje. Przed kwalifikatorem kartowiczów zastępstwa pochodzą z rankingu; później z zapisanej listy rezerwowej.', 'Absence from an ET main event also covers its qualifiers. Before the Tour Card qualifier, ranking replacements apply; later, the saved reserve list applies.', 'Eine Absage für das ET-Hauptturnier gilt auch für dessen Qualifikationen. Vor der Tour-Card-Qualifikation rückt die Rangliste nach, danach die gespeicherte Reserveliste.', 'Een afmelding voor het ET-hoofdtoernooi geldt ook voor de kwalificaties. Vóór de Tour Card-kwalificatie schuift de ranking door, daarna geldt de opgeslagen reservelijst.'],
    qualifierDate: ['Kwalifikacje kartowiczów: {date}.','Tour Card qualifier: {date}.','Tour-Card-Qualifikation: {date}.','Tour Card-kwalificatie: {date}.'],
    lockHint: ['Ogłoszona absencja jest wiążąca, ponieważ może zwolnić miejsce dla innego zawodnika. Możesz anulować zgłoszenie z przyszłą datą ogłoszenia.', 'An announced absence is binding because it can release a place for another player. You can cancel an announcement scheduled for a future date.', 'Eine bekanntgegebene Absage ist verbindlich, da ein anderer Spieler nachrücken kann. Eine für später geplante Bekanntgabe kann storniert werden.', 'Een bekendgemaakte afmelding is bindend, omdat een andere speler de plaats kan innemen. Een geplande bekendmaking met een toekomstige datum kun je annuleren.'],
    player: ['Zawodnik','Player','Spieler','Speler'],
    search: ['Szukaj zawodnika','Search players','Spieler suchen','Spelers zoeken'],
    own: ['Twój zawodnik','Your player','Dein Spieler','Jouw speler'],
    announceOn: ['Data ogłoszenia','Announcement date','Bekanntgabedatum','Datum bekendmaking'],
    announced: ['Ogłoszono','Announced','Bekanntgegeben','Bekendgemaakt'],
    pending: ['Zaplanowano','Planned','Geplant','Gepland'],
    reason: ['Powód','Reason','Grund','Reden'],
    rest: ['Odpoczynek','Rest','Pause','Rust'],
    personal: ['Powody osobiste','Personal reasons','Persönliche Gründe','Persoonlijke redenen'],
    travel: ['Problemy z podróżą','Travel issues','Reiseprobleme','Reisproblemen'],
    add: ['Zgłoś absencję','Declare absence','Absage melden','Afmelden'],
    cancel: ['Anuluj plan','Cancel plan','Plan stornieren','Plan annuleren'],
    close: ['Zamknij','Close','Schließen','Sluiten'],
    empty: ['Brak zgłoszonych absencji.','No absences declared.','Keine Absagen gemeldet.','Geen afmeldingen gemeld.'],
    saved: ['Absencja została zapisana.','Absence saved.','Absage gespeichert.','Afmelding opgeslagen.'],
    cancelled: ['Plan został anulowany.','Plan cancelled.','Plan storniert.','Plan geannuleerd.'],
    error: ['Nie można dodać tego zgłoszenia. Sprawdź datę, zawodnika i istniejące absencje.', 'This absence cannot be added. Check the date, player and existing absences.', 'Diese Absage kann nicht hinzugefügt werden. Prüfe Datum, Spieler und vorhandene Absagen.', 'Deze afmelding kan niet worden toegevoegd. Controleer de datum, speler en bestaande afmeldingen.'],
    saveError: ['Zmiana jest w grze, ale nie udało się zapisać kariery. Spróbuj zapisać ją ponownie.', 'The change is in the game, but the career could not be saved. Try saving again.', 'Die Änderung ist im Spiel, aber die Karriere konnte nicht gespeichert werden. Bitte erneut speichern.', 'De wijziging staat in het spel, maar de carrière kon niet worden opgeslagen. Probeer opnieuw op te slaan.'],
    inherited: ['Zgłoszenie z głównego ET','From the ET main event','Vom ET-Hauptturnier','Van het ET-hoofdtoernooi'],
    sender: ['Biuro turniejowe','Tournament Office','Turnierbüro','Toernooibureau'],
    subject: ['Wycofania: {event}','Withdrawals: {event}','Absagen: {event}','Afmeldingen: {event}'],
    beforeQualifier: ['Przed kwalifikacjami','Before qualifying','Vor der Qualifikation','Vóór de kwalificatie'],
    beforeEvent: ['Przed turniejem','Before the event','Vor dem Turnier','Vóór het toernooi'],
    noEntry: ['Po ogłoszeniu wybrany zawodnik nie wystąpi w tym turnieju.','After the announcement the selected player will not enter this event.','Nach der Bekanntgabe tritt der gewählte Spieler bei diesem Turnier nicht an.','Na de bekendmaking neemt de gekozen speler niet deel aan dit toernooi.']
};
function trTournamentAbsence(key) {
    return (TOURNAMENT_ABSENCE_TEXT[key] || [key])[Math.max(0,['pl','en','de','nl'].indexOf(typeof currentLang === 'string' ? currentLang : 'pl'))] || key;
}
function getTournamentAbsenceCalendarHtml(event,index) {
    const entries = getTournamentAbsenceEntries(event,{includeFuture:true});
    if (!canManageTournamentAbsences(event) && !entries.length) return '';
    const count = new Set(entries.map(entry => entry.playerKey)).size;
    return `<button type="button" class="btn-sign absence-event-link" onclick="showTournamentAbsences(${index})">${escapeHtml(trTournamentAbsence('title'))}${count ? ` (${count})` : ''}</button>`;
}
function closeTournamentAbsences() { document.getElementById('tournament-absence-dialog')?.close(); }
function showTournamentAbsences(index) {
    const event = tournamentDatabase[index];
    if (!event) return false;
    closeTournamentAbsences();
    document.getElementById('tournament-absence-dialog')?.remove();
    const dialog = document.createElement('dialog');dialog.id='tournament-absence-dialog';dialog.className='tournament-absence-dialog';
    dialog.setAttribute('aria-labelledby','absence-title');document.body.appendChild(dialog);
    dialog.addEventListener('close',()=>dialog.remove(),{once:true});
    renderTournamentAbsences(dialog,index);
    dialog.showModal();return true;
}
function renderTournamentAbsences(dialog,index,message = '') {
    const event=tournamentDatabase[index],h=escapeHtml,tr=trTournamentAbsence,today=tournamentAbsenceDateKey();
    const entries=getTournamentAbsenceEntries(event,{includeFuture:true}).sort((a,b)=>a.announcedOn.localeCompare(b.announcedOn)||a.name.localeCompare(b.name));
    const editable=canManageTournamentAbsences(event),title=typeof getTournamentDisplayName==='function'?getTournamentDisplayName(event):event.name;
    const et=typeof isContinentalTourTournament==='function'&&isContinentalTourTournament(event);
    const qualifier=et?getContinentalAbsenceCardQualifier(event):null;
    const defaultDate=[today,tournamentAbsenceDaysBefore(qualifier&&isContinentalAbsenceEntryOpen(event)?qualifier:event,TOURNAMENT_ABSENCE_LEAD_DAYS)].sort().at(-1);
    dialog.innerHTML=`<div class="absence-heading"><div><h2 id="absence-title">${h(tr('title'))}</h2><p>${h(title)}</p></div><button type="button" data-absence-close aria-label="${h(tr('close'))}">×</button></div>
        <p>${h(tr('intro'))}</p>${et?`<p class="absence-hint">${h(tr('etHint'))}${qualifier?` ${h(tr('qualifierDate').replace('{date}',tournamentAbsenceDateKey(tournamentAbsenceStartDate(qualifier))))}`:''}</p>`:''}
        <p class="absence-hint">${h(tr('lockHint'))}</p>
        <ul class="absence-list">${entries.length?entries.map((entry,i)=>`<li><div><strong>${h(entry.name)}</strong><small>${h(tr(entry.announcedOn>today?'pending':'announced'))}: ${h(entry.announcedOn)} · ${h(tr(entry.reason))}${entry.inherited?` · ${h(tr('inherited'))}`:''}</small></div>
            ${editable&&entry.source==='manual'&&!entry.inherited&&entry.announcedOn>today?`<button type="button" data-absence-cancel="${i}">${h(tr('cancel'))}</button>`:''}</li>`).join(''):`<li>${h(tr('empty'))}</li>`}</ul>
        ${editable?`<form id="tournament-absence-form"><label for="absence-search">${h(tr('search'))}</label><input id="absence-search" type="search" autocomplete="off">
            <label for="absence-player">${h(tr('player'))}</label><select id="absence-player" required></select>
            <div class="absence-fields"><div><label for="absence-date">${h(tr('announceOn'))}</label><input type="date" id="absence-date" value="${defaultDate}" min="${today}" max="${tournamentAbsenceDateKey(tournamentAbsenceStartDate(event))}" required></div>
            <div><label for="absence-reason">${h(tr('reason'))}</label><select id="absence-reason">${['rest','personal','travel'].map(reason=>`<option value="${reason}">${h(tr(reason))}</option>`).join('')}</select></div></div>
            <p class="absence-hint">${h(tr('noEntry'))}</p><button class="action-btn green" type="submit">${h(tr('add'))}</button></form>`:''}
        <p id="absence-status" role="status" aria-live="polite">${h(message)}</p><button type="button" class="btn-sign" data-absence-close>${h(tr('close'))}</button>`;
    dialog.querySelectorAll('[data-absence-close]').forEach(button=>button.addEventListener('click',closeTournamentAbsences));
    const save=async success=>{
        let text=tr(success);
        try { if (typeof saveGame==='function' && await saveGame(true,{immediate:true})===false) text=tr('saveError'); }
        catch(_error){text=tr('saveError');}
        if (document.getElementById('screen-calendar')?.classList.contains('active')) showCalendar();
        if (dialog.isConnected) renderTournamentAbsences(dialog,index,text);
    };
    dialog.querySelectorAll('[data-absence-cancel]').forEach(button=>button.addEventListener('click',async()=>{
        button.disabled=true;const entry=entries[Number(button.dataset.absenceCancel)];
        if (cancelPendingTournamentAbsence(event,entry.playerKey)) await save('cancelled');
        else renderTournamentAbsences(dialog,index,tr('error'));
    }));
    if (!editable) return;
    const roster=getTournamentAbsenceRoster().sort((a,b)=>Number(typeof isCurrentPlayer==='function'&&isCurrentPlayer(b))-Number(typeof isCurrentPlayer==='function'&&isCurrentPlayer(a))||a.name.localeCompare(b.name));
    const updatePlayers=()=>{
        const query=dialog.querySelector('#absence-search').value.trim().toLocaleLowerCase(),select=dialog.querySelector('#absence-player'),previous=select.value;
        const selected=roster.filter(candidate=>!entries.some(entry=>entry.playerKey===tournamentAbsencePlayerKey(candidate))
            && (!query||candidate.name.toLocaleLowerCase().includes(query))).slice(0,100);
        select.innerHTML=selected.map(candidate=>`<option value="${h(tournamentAbsencePlayerKey(candidate))}">${h(candidate.name)}${typeof isCurrentPlayer==='function'&&isCurrentPlayer(candidate)?` — ${h(tr('own'))}`:''}</option>`).join('');
        if (selected.some(candidate=>tournamentAbsencePlayerKey(candidate)===previous)) select.value=previous;
    };
    updatePlayers();dialog.querySelector('#absence-search').addEventListener('input',updatePlayers);
    dialog.querySelector('#tournament-absence-form').addEventListener('submit',async eventObject=>{
        eventObject.preventDefault();const button=eventObject.currentTarget.querySelector('button[type="submit"]');button.disabled=true;
        const candidate=roster.find(p=>tournamentAbsencePlayerKey(p)===dialog.querySelector('#absence-player').value);
        if (scheduleTournamentAbsence(event,candidate,{announcedOn:dialog.querySelector('#absence-date').value,reason:dialog.querySelector('#absence-reason').value})) await save('saved');
        else renderTournamentAbsences(dialog,index,tr('error'));
    });
}
