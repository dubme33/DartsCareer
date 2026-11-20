const QUALIFICATION_SCENARIO_TEXT = {
    title: ['Co, jeśli?', 'What if?', 'Was wäre, wenn?', 'Wat als?'],
    intro: ['Ustaw wyniki swoje i rywali. Sprawdź wpływ nagród na rankingi i kwalifikację.', 'Set results for yourself and your rivals. See how prize money changes rankings and qualification.', 'Lege Ergebnisse für dich und deine Rivalen fest. Prüfe die Folgen für Ranglisten und Qualifikation.', 'Stel resultaten voor jezelf en rivalen in. Bekijk de gevolgen voor ranglijsten en kwalificatie.'],
    assumptions: ['To scenariusz warunkowy: zakłada udział wskazanych graczy. Pozostałe wyniki pozostają bez zmian; znane pieniądze wygasają zgodnie z datą turnieju docelowego. Wyniki służą do obliczenia nagród rankingowych. Kwalifikatory, miejsca za tytuły, nowe kontuzje i przyszłe karty nie są rozgrywane ani przewidywane. Awans nie jest gwarantowany.', 'This is a conditional scenario assuming the selected players take part. Other results stay unchanged; known prize money expires by the target event date. Results are used to calculate ranking money. Qualifiers, title-based places, new injuries and future cards are not simulated or predicted. Qualification is not guaranteed.', 'Dies ist ein bedingtes Szenario mit angenommener Teilnahme der gewählten Spieler. Andere Ergebnisse bleiben gleich; bekanntes Preisgeld verfällt bis zum Zieltermin. Ergebnisse berechnen Ranglistenpreisgeld. Qualifikationen, titelbasierte Plätze, neue Verletzungen und künftige Karten werden nicht simuliert. Eine Qualifikation ist nicht garantiert.', 'Dit scenario gaat uit van deelname van de gekozen spelers. Overige resultaten blijven gelijk; bekend prijzengeld vervalt tot de datum van het doeltoernooi. Resultaten berekenen rankinggeld. Kwalificaties, titelplaatsen, nieuwe blessures en toekomstige kaarten worden niet gesimuleerd. Plaatsing is niet gegarandeerd.'],
    target: ['Turniej docelowy', 'Target tournament', 'Zielturnier', 'Doeltoernooi'],
    player: ['Zawodnik', 'Player', 'Spieler', 'Speler'],
    event: ['Turniej z hipotetycznym wynikiem', 'Event with a hypothetical result', 'Turnier mit hypothetischem Ergebnis', 'Toernooi met hypothetisch resultaat'],
    result: ['Wynik', 'Result', 'Ergebnis', 'Resultaat'],
    none: ['Bez dodatkowej nagrody', 'No additional prize', 'Kein zusätzliches Preisgeld', 'Geen extra prijzengeld'],
    winner: ['Zwycięstwo', 'Winner', 'Turniersieg', 'Winnaar'],
    round: ['Odpadnięcie: Last {round}', 'Eliminated: Last {round}', 'Ausgeschieden: Last {round}', 'Uitgeschakeld: Last {round}'],
    add: ['Dodaj wynik gracza / rywala', 'Add a player / rival result', 'Spieler- / Rivalenergebnis hinzufügen', 'Resultaat van speler / rivaal toevoegen'],
    remove: ['Usuń wynik', 'Remove result', 'Ergebnis entfernen', 'Resultaat verwijderen'],
    calculate: ['Oblicz scenariusz', 'Calculate scenario', 'Szenario berechnen', 'Scenario berekenen'],
    reset: ['Wyczyść scenariusz', 'Clear scenario', 'Szenario leeren', 'Scenario wissen'],
    computing: ['Obliczanie…', 'Calculating…', 'Berechnung…', 'Berekenen…'],
    empty: ['Brak wcześniejszych indywidualnych turniejów rankingowych z drabinką do wykorzystania w tym scenariuszu. Wybierz późniejszy turniej docelowy.', 'There are no earlier singles ranking knockout events for this scenario. Choose a later target event.', 'Für dieses Szenario gibt es keine früheren Einzel-Ranglistenturniere im K.-o.-Format. Wähle ein späteres Zielturnier.', 'Er zijn geen eerdere individuele rankingtoernooien met een knock-outschema. Kies een later doeltoernooi.'],
    baseline: ['Bez dodatkowych wyników', 'Without additional results', 'Ohne zusätzliche Ergebnisse', 'Zonder extra resultaten'],
    projected: ['Po Twoich założeniach', 'With your assumptions', 'Mit deinen Annahmen', 'Met jouw aannames'],
    inField: ['W przewidywanej stawce', 'In the projected field', 'Im prognostizierten Feld', 'In het verwachte deelnemersveld'],
    at: ['Prognoza na {date}', 'Projection for {date}', 'Prognose für {date}', 'Prognose voor {date}'],
    ranking: ['Ranking', 'Ranking', 'Rangliste', 'Ranglijst'],
    amount: ['Nagroda brutto', 'Gross prize', 'Bruttopreisgeld', 'Brutoprijs'],
    gained: ['Wchodzą do przewidywanej stawki', 'Enter the projected field', 'Neu im prognostizierten Feld', 'Nieuw in het verwachte deelnemersveld'],
    lost: ['Wypadają z przewidywanej stawki', 'Leave the projected field', 'Verlassen das prognostizierte Feld', 'Verlaten het verwachte deelnemersveld'],
    unchanged: ['Przewidywana obsada bez zmian.', 'The projected field is unchanged.', 'Das prognostizierte Feld bleibt gleich.', 'Het verwachte deelnemersveld blijft gelijk.'],
    locked: ['Zapisane miejsca i ustalona drabinka zachowują dotychczasową obsadę.', 'Saved places and an established draw retain their existing entrants.', 'Gespeicherte Plätze und festgelegte Auslosungen behalten ihre Teilnehmer.', 'Opgeslagen plaatsen en een vastgesteld schema behouden hun deelnemers.'],
    noRanking: ['Rozstawiony ET: porażka w pierwszym meczu po wolnym losie — bez punktów rankingowych', 'ET seed: first-match defeat after a bye — no ranking money', 'ET-Setzspieler: erste Niederlage nach Freilos — kein Ranglistenpreisgeld', 'ET-geplaatste speler: verlies na eerste bye — geen rankinggeld'],
    invalidScenario: ['Sprawdź zawodników, daty i turnieje. Wyniki muszą poprzedzać turniej docelowy; maksymalnie 8 wpisów.', 'Check players, dates and events. Results must precede the target event; at most 8 entries.', 'Prüfe Spieler, Termine und Turniere. Ergebnisse müssen vor dem Zielturnier liegen; höchstens 8 Einträge.', 'Controleer spelers, datums en toernooien. Resultaten moeten vóór het doeltoernooi vallen; maximaal 8 regels.'],
    invalidPlayer: ['Wybrany zawodnik nie jest już dostępny. Otwórz kalkulator ponownie.', 'The selected player is no longer available. Reopen the calculator.', 'Der gewählte Spieler ist nicht mehr verfügbar. Öffne den Rechner erneut.', 'De gekozen speler is niet meer beschikbaar. Open de calculator opnieuw.'],
    invalidResult: ['Ten wynik nie pasuje do wybranego turnieju.', 'This result is not valid for the selected event.', 'Dieses Ergebnis passt nicht zum gewählten Turnier.', 'Dit resultaat past niet bij het gekozen toernooi.'],
    duplicateResult: ['Jeden gracz może mieć tylko jeden wynik w tym samym turnieju.', 'A player can have only one result in the same event.', 'Ein Spieler kann je Turnier nur ein Ergebnis haben.', 'Een speler kan per toernooi maar één resultaat hebben.'],
    tooManyPlaces: ['Za dużo graczy z tym wynikiem w jednym turnieju, np. dwóch zwycięzców.', 'Too many players have this result in one event, such as two winners.', 'Zu viele Spieler mit diesem Ergebnis in einem Turnier, etwa zwei Sieger.', 'Te veel spelers met dit resultaat in één toernooi, zoals twee winnaars.'],
    failed: ['Nie udało się obliczyć scenariusza. Sprawdź bazę w diagnostyce.', 'Could not calculate the scenario. Check the database using diagnostics.', 'Das Szenario konnte nicht berechnet werden. Prüfe die Datenbank mit der Diagnose.', 'Het scenario kon niet worden berekend. Controleer de database met diagnostiek.']
};
function trQualificationScenario(key, params = {}) {
    const index = Math.max(0, ['pl', 'en', 'de', 'nl'].indexOf(typeof currentLang === 'string' ? currentLang : 'pl'));
    return (QUALIFICATION_SCENARIO_TEXT[key]?.[index] || key).replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
}
let qualificationScenarioDraft = null;
function getQualificationScenarioDraft() {
    const identity = `${qualificationScenarioKey(player)}:${currentDate.getFullYear()}`;
    if (qualificationScenarioDraft?.identity !== identity) qualificationScenarioDraft = { identity, targetKey: '', entries: [], report: null };
    return qualificationScenarioDraft;
}
function qualificationScenarioResultOptions(event, selected) {
    const size = getQualificationScenarioSize(event);
    const values = ['none', 'winner', ...[2, 4, 8, 16, 32, 64, 96, 128, 160, 256, 512]
        .filter(round => round <= size && (![96, 160].includes(round) || size === 160)).map(String)];
    return values.map(value => `<option value="${value}"${value === selected ? ' selected' : ''}>${escapeHtml(trQualificationScenario(value === 'none' || value === 'winner' ? value : 'round', { round: value }))}</option>`).join('');
}
function renderQualificationScenario() {
    const draft = getQualificationScenarioDraft(), events = getPlanningTournaments().filter(entry => entry.date >= currentDate
        && (typeof isTournamentScheduledForCareerYear !== 'function' || isTournamentScheduledForCareerYear(entry.tournament, currentDate.getFullYear())));
    if (!events.length) return `<p>${escapeHtml(trPlanning('noEvents'))}</p>`;
    const selected = events.find(entry => qualificationScenarioEventKey(entry.tournament) === draft.targetKey)
        || events.find(entry => getPlanningTournamentKind(entry.tournament) === 'worlds') || events[events.length - 1];
    draft.targetKey = qualificationScenarioEventKey(selected.tournament);
    const sources = getQualificationScenarioSources(selected.tournament), sourceKeys = new Set(sources.map(qualificationScenarioEventKey));
    const players = getPdcTourCardPlayers(true).filter(p => p && !p.isBye && !p.retired);
    const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name, currentLang));
    if (!draft.initialized && sources.length) {
        draft.entries.push({ playerKey: qualificationScenarioKey(player), eventKey: qualificationScenarioEventKey(sources[0]), result: '8', noRanking: false });
        draft.initialized = true;
    }
    draft.entries.forEach(entry => {
        if (!players.some(p => qualificationScenarioKey(p) === entry.playerKey)) entry.playerKey = qualificationScenarioKey(player);
        if (!sourceKeys.has(entry.eventKey)) entry.eventKey = qualificationScenarioEventKey(sources[0]);
        const event = sources.find(event => qualificationScenarioEventKey(event) === entry.eventKey);
        if (event && Number(entry.result) > getQualificationScenarioSize(event)) entry.result = 'none';
        if (!(event && qualificationScenarioHasEtSeedException(event) && entry.result === '32')) entry.noRanking = false;
    });
    const options = events.map(entry => `<option value="${escapeHtml(qualificationScenarioEventKey(entry.tournament))}"${entry === selected ? ' selected' : ''}>${escapeHtml(getPlanningDate(entry.date))} · ${escapeHtml(getTournamentDisplayName(entry.tournament))}</option>`).join('');
    const rows = sources.length ? draft.entries.map((entry, index) => {
        const event = sources.find(event => qualificationScenarioEventKey(event) === entry.eventKey);
        const select = (name, label, content) => `<label for="scenario-${name}-${index}">${escapeHtml(label)}</label><select id="scenario-${name}-${index}" data-scenario-row="${index}" data-scenario-field="${name}">${content}</select>`;
        return `<fieldset class="scenario-entry"><legend>${index + 1}. ${escapeHtml(trQualificationScenario('result'))}</legend>
            ${select('playerKey', trQualificationScenario('player'), sorted.map(p => `<option value="${escapeHtml(qualificationScenarioKey(p))}"${qualificationScenarioKey(p) === entry.playerKey ? ' selected' : ''}>${escapeHtml(p.name)} · ${escapeHtml(t(p.country))}</option>`).join(''))}
            ${select('eventKey', trQualificationScenario('event'), sources.map(e => `<option value="${escapeHtml(qualificationScenarioEventKey(e))}"${e === event ? ' selected' : ''}>${escapeHtml(getPlanningDate(qualificationScenarioDate(e, currentDate.getFullYear())))} · ${escapeHtml(getTournamentDisplayName(e))}</option>`).join(''))}
            ${select('result', trQualificationScenario('result'), qualificationScenarioResultOptions(event, entry.result))}
            ${qualificationScenarioHasEtSeedException(event) && entry.result === '32' ? `<label class="scenario-checkbox"><input type="checkbox" data-scenario-row="${index}" data-scenario-field="noRanking"${entry.noRanking ? ' checked' : ''}>${escapeHtml(trQualificationScenario('noRanking'))}</label>` : ''}
            <button type="button" data-scenario-remove="${index}">${escapeHtml(trQualificationScenario('remove'))}</button></fieldset>`;
    }).join('') : `<p class="planning-note">${escapeHtml(trQualificationScenario('empty'))}</p>`;
    return `<p>${escapeHtml(trQualificationScenario('intro'))}</p><p class="planning-note">${escapeHtml(trQualificationScenario('assumptions'))}</p>
        <label class="planning-label" for="scenario-target">${escapeHtml(trQualificationScenario('target'))}</label><select id="scenario-target">${options}</select>
        <div class="scenario-entries">${rows}</div><div class="scenario-actions">
        <button id="scenario-add" type="button"${draft.entries.length >= 8 || !sources.length ? ' disabled' : ''}>${escapeHtml(trQualificationScenario('add'))}</button>
        <button id="scenario-calculate" type="button"${!sources.length ? ' disabled' : ''}>${escapeHtml(trQualificationScenario('calculate'))}</button>
        <button id="scenario-reset" type="button">${escapeHtml(trQualificationScenario('reset'))}</button></div>
        <p id="scenario-error" role="status" aria-live="polite"></p><div id="scenario-report" aria-live="polite">${draft.report ? renderQualificationScenarioReport(draft.report) : ''}</div>`;
}
function bindQualificationScenario() {
    const draft = getQualificationScenarioDraft();
    document.getElementById('scenario-target')?.addEventListener('change', event => { draft.targetKey = event.target.value; draft.report = null; renderCareerPlanning(); });
    document.querySelectorAll('[data-scenario-field]').forEach(control => control.addEventListener('change', () => {
        draft.entries[Number(control.dataset.scenarioRow)][control.dataset.scenarioField] = control.type === 'checkbox' ? control.checked : control.value;
        draft.report = null; const id = control.id; renderCareerPlanning(); if (id) document.getElementById(id)?.focus();
    }));
    document.querySelectorAll('[data-scenario-remove]').forEach(button => button.addEventListener('click', () => {
        draft.entries.splice(Number(button.dataset.scenarioRemove), 1); draft.report = null; renderCareerPlanning();
    }));
    document.getElementById('scenario-add')?.addEventListener('click', () => {
        if (draft.entries.length >= 8) return;
        const target = tournamentDatabase.find(event => qualificationScenarioEventKey(event) === draft.targetKey);
        const source = getQualificationScenarioSources(target)[0]; if (!source) return;
        const rival = getPdcTourCardPlayers(true).find(p => qualificationScenarioKey(p) !== qualificationScenarioKey(player));
        draft.entries.push({ playerKey: qualificationScenarioKey(rival || player), eventKey: qualificationScenarioEventKey(source), result: 'none', noRanking: false });
        draft.report = null; renderCareerPlanning();
    });
    document.getElementById('scenario-reset')?.addEventListener('click', () => { draft.entries = []; draft.report = null; draft.initialized = true; renderCareerPlanning(); });
    document.getElementById('scenario-calculate')?.addEventListener('click', () => {
        const error = document.getElementById('scenario-error');
        try {
            const target = tournamentDatabase.find(event => qualificationScenarioEventKey(event) === draft.targetKey);
            draft.report = calculateQualificationScenario({ target, entries: draft.entries, candidates: getPdcTourCardPlayers(true), careerPlayer: player });
            document.getElementById('scenario-report').innerHTML = renderQualificationScenarioReport(draft.report); error.textContent = '';
        } catch (failure) { draft.report = null; document.getElementById('scenario-report').textContent = ''; error.textContent = trQualificationScenario(failure.scenarioCode || 'failed'); }
    });
}
function renderQualificationScenarioReport(report) {
    const heading = trQualificationScenario('at', { date: getPlanningDate(report.date) });
    const status = (preview, key) => `<section class="planning-status planning-${preview.status}"><h4>${escapeHtml(trQualificationScenario(key))}</h4><strong>${escapeHtml(['in', 'confirmed'].includes(preview.status) ? trQualificationScenario('inField') : trPlanning(preview.status))}</strong><p>${escapeHtml(preview.route)}</p></section>`;
    const names = { main: 'Order of Merit', protour: 'ProTour OOM', pc: 'Players Championship OOM', europeanTour: 'European Tour OOM', challengeTour: 'Challenge Tour OOM', developmentTour: 'Development Tour OOM', womensSeries: "Women's Series OOM" };
    const rows = report.rankingsAfter.map((row, index) => {
        const before = report.rankingsBefore[index];
        const tour = row.id.startsWith('tour:') ? getCareerCalendarEditorState().tours.find(tour => tour.id === row.id.slice(5)) : null;
        return `<tr><th scope="row">${escapeHtml(tour?.name || names[row.id] || row.id)}</th><td>${before.position ? '#' + before.position : '—'} · ${planningMoney(before.amount)}</td><td>${row.position ? '#' + row.position : '—'} · ${planningMoney(row.amount)}</td></tr>`;
    }).join('');
    const movement = (key, players) => players.length ? `<h4>${escapeHtml(trQualificationScenario(key))}</h4><ul>${players.map(p => `<li>${escapeHtml(p.name)}</li>`).join('')}</ul>` : '';
    return `<h3>${escapeHtml(heading)}</h3><div class="scenario-comparison">${status(report.baseline, 'baseline')}${status(report.projected, 'projected')}</div>
        ${report.baseline.locked || report.projected.locked ? `<p class="planning-note">${escapeHtml(trQualificationScenario('locked'))}</p>` : ''}
        <div class="planning-table-wrap"><table class="planning-table"><thead><tr><th>${escapeHtml(trQualificationScenario('ranking'))}</th><th>${escapeHtml(trQualificationScenario('baseline'))}</th><th>${escapeHtml(trQualificationScenario('projected'))}</th></tr></thead><tbody>${rows}</tbody></table></div>
        <details class="planning-route"><summary>${escapeHtml(trQualificationScenario('amount'))}</summary><ul>${report.entries.map(entry => `<li><span>${escapeHtml(entry.name)} · ${escapeHtml(entry.eventName)} · ${escapeHtml(trQualificationScenario(entry.result === 'winner' ? 'winner' : 'round', { round: entry.result }))}</span><span>${planningMoney(entry.amount)}${entry.noRanking ? ' · ' + escapeHtml(trQualificationScenario('noRanking')) : ''}</span></li>`).join('')}</ul></details>
        ${movement('gained', report.gained)}${movement('lost', report.lost)}${!report.gained.length && !report.lost.length ? `<p>${escapeHtml(trQualificationScenario('unchanged'))}</p>` : ''}`;
}
