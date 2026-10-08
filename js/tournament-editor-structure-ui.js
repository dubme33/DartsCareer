let editorStructureDraft = { slots: [], assignments: [] };
let editorInvitationDraft = new Map();

function mountEditorStructurePanel() {
    if (document.getElementById('te-structure-panel')) return;
    const panel = document.createElement('fieldset');
    panel.id = 'te-structure-panel'; panel.className = 'tournament-editor-prizes';
    panel.innerHTML = `<legend data-structure-text="title"></legend><p data-structure-text="hint" class="tournament-editor-hint"></p>
        <p id="te-structure-unavailable" data-structure-text="unavailable" hidden></p><div id="te-structure-content">
        <div id="te-invitation-panel" class="tournament-editor-fields"><label class="te-wide"><span data-structure-text="invites"></span><select id="te-invitation-mode"><option value="add" data-structure-text="add"></option><option value="only" data-structure-text="only"></option></select></label>
        <input id="te-invitation-search" class="te-wide" type="search"><p id="te-invitation-count" class="te-wide"></p><div id="te-invitation-list" class="te-wide" style="max-height:220px;overflow:auto"></div></div>
        <div class="tournament-editor-fields" style="margin-top:16px"><label><span data-structure-text="phase"></span><select id="te-structure-phase"><option value="knockout" data-structure-text="knockout"></option><option value="groups" data-structure-text="groups"></option></select></label>
        <label id="te-structure-draw-wrap"><span data-structure-text="draw"></span><select id="te-structure-draw"><option value="auto" data-structure-text="random"></option><option value="manual" data-structure-text="manual"></option></select></label></div>
        <div id="te-league-fields" hidden><p data-structure-text="leagueHint" class="tournament-editor-hint"></p><div class="tournament-editor-fields">
        <label><span data-structure-text="cycles"></span><select id="te-league-cycles"><option value="1" data-structure-text="single"></option><option value="2" data-structure-text="return"></option></select></label>
        <label><span data-structure-text="playoffs"></span><select id="te-league-playoffs">${[0, 2, 4, 8, 16, 32].map(size => `<option value="${size}">${size}</option>`).join('')}</select></label>
        <label><span data-structure-text="leagueLegs"></span><input id="te-league-legs" type="number" min="1" max="30" step="1"></label>
        <label><span data-structure-text="points"></span><input id="te-league-points" type="number" min="1" max="10" step="1"></label>
        <label class="te-wide"><span data-structure-text="tie"></span><select id="te-league-tie"><option value="difference" data-structure-text="difference"></option><option value="head" data-structure-text="head"></option></select></label></div></div>
        <div id="te-structure-group-fields" hidden><div class="tournament-editor-fields">
        ${[['count', 'groups-count', 1, 64], ['advance', 'groups-advance', 1, 7], ['extra', 'groups-extra', 0, 63],
            ['groupLegs', 'groups-legs', 1, 30], ['points', 'groups-points', 1, 10], ['eliminated', 'groups-prize', 0, 999999999]]
            .map(([text, id, min, max]) => `<label><span data-structure-text="${text}"></span><input id="te-${id}" type="number" min="${min}" max="${max}" step="1"></label>`).join('')}
        <label class="te-wide"><span data-structure-text="tie"></span><select id="te-groups-tie"><option value="difference" data-structure-text="difference"></option><option value="head" data-structure-text="head"></option></select></label></div>
        <p id="te-group-rules" class="tournament-editor-hint"></p><h4 data-structure-text="assign"></h4><div id="te-group-assignments" class="tournament-editor-fields"></div></div>
        <datalist id="te-structure-options"></datalist><div id="te-structure-slots" class="tournament-editor-fields" style="margin-top:12px"></div></div>`;
    const form = tournamentEditorElement('tournament-editor-form');
    form.insertBefore(panel, tournamentEditorElement('te-prizes-panel'));
    appendTournamentEditorOption(tournamentEditorElement('te-structure-phase'), 'league', trEditorStructure('league'));
    tournamentEditorElement('te-structure-phase').lastElementChild.dataset.structureText = 'league';
    for (const id of ['te-structure-phase', 'te-structure-draw', 'te-groups-count', 'te-groups-advance', 'te-groups-extra', 'te-groups-legs', 'te-groups-points', 'te-groups-tie']) {
        tournamentEditorElement(id).addEventListener('change', () => {
            if (id === 'te-structure-phase' || id === 'te-groups-count' || id === 'te-groups-advance' || id === 'te-groups-extra') editorStructureDraft.slots = [];
            enableEditorStructureRules(); renderEditorStructureFields();
        });
    }
    tournamentEditorElement('te-invitation-mode').addEventListener('change', () => { enableEditorStructureRules(); renderEditorStructureFields(); });
    tournamentEditorElement('te-invitation-search').addEventListener('input', renderEditorInvitationList);
    form.addEventListener('change', event => {
        if (['te-gender', 'te-min-ovr', 'te-team-mode'].includes(event.target.id) || event.target.closest('#te-team-panel')) renderEditorStructureFields();
    });
}
function editorStructureIsTeamForm() { return ['national', 'pairs'].includes(tournamentEditorElement('te-team-mode')?.value); }
function enableEditorStructureRules() {
    if (!editorStructureIsTeamForm() && !tournamentEditorElement('te-qualification-mode').disabled) {
        tournamentEditorElement('te-qualification-mode').value = 'custom';
        updateTournamentEditorQualificationFields();
    }
}
function editorStructureFormGroups() {
    if (tournamentEditorValue('te-structure-phase') !== 'groups') return null;
    return { count: Number(tournamentEditorValue('te-groups-count')), advance: Number(tournamentEditorValue('te-groups-advance')),
        extra: Number(tournamentEditorValue('te-groups-extra')), legsToWin: Number(tournamentEditorValue('te-groups-legs')),
        winPoints: Number(tournamentEditorValue('te-groups-points')), tie: tournamentEditorValue('te-groups-tie'),
        eliminationPrize: Number(tournamentEditorValue('te-groups-prize')) };
}
function editorStructureFormEntrants() {
    const size = Number(tournamentEditorValue('te-field-size')) || 32;
    if (editorStructureIsTeamForm()) {
        try { return buildEditorTeamField({ ...tournamentEditorSelected, ...getTournamentTeamEditorFormData(size),
            isEditorTournament: true, editorFieldSize: size, minOvr: Number(tournamentEditorValue('te-min-ovr')), editorGender: tournamentEditorValue('te-gender') }); }
        catch { return []; }
    }
    const pool = getTournamentEditorCandidates().filter(candidate => isTournamentEditorGenderEligible(
        { editorGender: tournamentEditorValue('te-gender') }, candidate));
    const invited = [...editorInvitationDraft.keys()].map(key => pool.find(candidate => getTournamentEditorPlayerKey(candidate) === key)).filter(Boolean);
    return getTournamentEditorCandidates(tournamentEditorValue('te-invitation-mode') === 'only'
        ? invited : [...invited, ...getTournamentEditorRanking(pool, 'oom')]).slice(0, size);
}
function populateEditorStructureForm(event) {
    mountEditorStructurePanel();
    editorStructureDraft = structuredClone(event?.editorStructure || { slots: [], assignments: [] });
    editorInvitationDraft = new Map((event?.editorInvitations?.players || []).map(reference => [getTournamentEditorPlayerKey(reference), reference]));
    tournamentEditorElement('te-invitation-mode').value = event?.editorInvitations?.mode || 'add';
    tournamentEditorElement('te-invitation-search').value = '';
    tournamentEditorElement('te-structure-phase').value = event?.editorStructure?.league ? 'league' : event?.editorStructure?.groups ? 'groups' : 'knockout';
    const league = event?.editorStructure?.league || { cycles: 2, playoffs: 4, legsToWin: 6, winPoints: 2, tie: 'difference' };
    for (const [id, property] of [['cycles', 'cycles'], ['playoffs', 'playoffs'], ['legs', 'legsToWin'], ['points', 'winPoints'], ['tie', 'tie']]) tournamentEditorElement(`te-league-${id}`).value = league[property];
    tournamentEditorElement('te-structure-draw').value = event?.editorStructure?.draw || 'auto';
    const groups = event?.editorStructure?.groups || { count: Math.max(1, (Number(event?.editorFieldSize) || 32) / 4),
        advance: 2, extra: 0, legsToWin: 5, winPoints: 2, tie: 'difference', eliminationPrize: 0 };
    for (const [id, property] of [['count', 'count'], ['advance', 'advance'], ['extra', 'extra'], ['legs', 'legsToWin'],
        ['points', 'winPoints'], ['tie', 'tie'], ['prize', 'eliminationPrize']]) tournamentEditorElement(`te-groups-${id}`).value = groups[property];
    refreshEditorStructureTranslations(); renderEditorInvitationList(); renderEditorStructureFields();
}
function refreshEditorStructureTranslations() {
    if (!tournamentEditorElement('te-structure-panel')) return;
    document.querySelectorAll('#te-structure-panel [data-structure-text]').forEach(node => { node.textContent = trEditorStructure(node.dataset.structureText); });
    tournamentEditorElement('te-invitation-search').placeholder = trEditorStructure('search');
    tournamentEditorElement('te-invitation-search').setAttribute('aria-label', trEditorStructure('search'));
    renderEditorInvitationList(); renderEditorStructureFields();
}
function renderEditorInvitationList() {
    if (!tournamentEditorElement('te-invitation-list')) return;
    const search = tournamentEditorValue('te-invitation-search').trim().toLocaleLowerCase();
    const pool = getTournamentEditorCandidates().sort((a, b) => String(a.name).localeCompare(String(b.name)))
        .filter(candidate => `${candidate.name} ${candidate.country}`.toLocaleLowerCase().includes(search));
    const list = tournamentEditorElement('te-invitation-list'); list.replaceChildren();
    for (const candidate of pool) {
        const label = document.createElement('label'); label.className = 'te-checkbox';
        const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
        const key = getTournamentEditorPlayerKey(candidate); checkbox.checked = editorInvitationDraft.has(key);
        const text = document.createElement('span'); text.textContent = `${candidate.name} — ${typeof t === 'function' ? t(candidate.country) : candidate.country} · OVR ${Math.round(candidate.ovr ?? candidate.overall ?? 0)}`;
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) editorInvitationDraft.set(key, editorTeamReference(candidate)); else editorInvitationDraft.delete(key);
            enableEditorStructureRules(); renderEditorStructureFields();
            tournamentEditorElement('te-invitation-count').textContent = trEditorStructure('selected', { count: editorInvitationDraft.size });
        });
        label.append(checkbox, text); list.appendChild(label);
    }
    tournamentEditorElement('te-invitation-count').textContent = trEditorStructure('selected', { count: editorInvitationDraft.size });
}
function renderEditorStructureFields() {
    if (!tournamentEditorElement('te-structure-panel')) return;
    const team = editorStructureIsTeamForm();
    const allowed = team || !tournamentEditorElement('te-qualification-mode').disabled;
    tournamentEditorElement('te-structure-unavailable').hidden = allowed;
    tournamentEditorElement('te-structure-content').hidden = !allowed;
    tournamentEditorElement('te-invitation-panel').hidden = team;
    const groups = editorStructureFormGroups();
    const league = tournamentEditorValue('te-structure-phase') === 'league';
    tournamentEditorElement('te-league-fields').hidden = !league;
    tournamentEditorElement('te-structure-draw-wrap').hidden = league;
    if (league) tournamentEditorElement('te-structure-draw').value = 'auto';
    tournamentEditorElement('te-structure-group-fields').hidden = !groups;
    const entrants = editorStructureFormEntrants();
    const assignments = tournamentEditorElement('te-group-assignments'); assignments.replaceChildren();
    if (groups && Number.isInteger(groups.count) && groups.count >= 1 && groups.count <= 64) {
        tournamentEditorElement('te-group-rules').textContent = trEditorStructure('rules', { groups: groups.count, advance: groups.advance, extra: groups.extra });
        for (const entrant of entrants) {
            const label = document.createElement('label'), name = document.createElement('span'), select = document.createElement('select');
            const key = editorStructureKey(entrant);
            name.textContent = entrant.players ? entrant.country : entrant.name;
            appendTournamentEditorOption(select, '', trEditorStructure('auto'));
            for (let index = 0; index < groups.count; index++) appendTournamentEditorOption(select, String(index), `${trEditorStructure('group')} ${editorStructureGroupLabel(index)}`);
            select.value = String(editorStructureDraft.assignments.find(entry => entry.key === key)?.group ?? '');
            select.addEventListener('change', () => {
                editorStructureDraft.assignments = editorStructureDraft.assignments.filter(entry => entry.key !== key);
                if (select.value !== '') editorStructureDraft.assignments.push({ key, group: Number(select.value) });
            });
            label.append(name, select); assignments.appendChild(label);
        }
    }
    const slotList = tournamentEditorElement('te-structure-slots'); slotList.replaceChildren();
    const options = tournamentEditorElement('te-structure-options'); options.replaceChildren();
    if (tournamentEditorValue('te-structure-draw') !== 'manual') return;
    const drawSize = groups ? 2 ** Math.ceil(Math.log2(groups.count * groups.advance + groups.extra)) : Number(tournamentEditorValue('te-field-size'));
    if (!Number.isInteger(drawSize) || drawSize < 2 || drawSize > 256) return;
    editorStructureDraft.slots = editorStructureDraft.slots.slice(0, drawSize);
    const choices = groups ? editorStructureQualifierCodes(groups).map(code => [code, code])
        : (team ? entrants : getTournamentEditorCandidates()).map(entrant => [editorStructureKey(entrant), entrant.players ? entrant.country : `${entrant.name} — ${entrant.country}`]);
    const labelCounts = new Map();
    for (const choice of choices) {
        const count = (labelCounts.get(choice[1]) || 0) + 1; labelCounts.set(choice[1], count);
        if (count > 1) choice[1] += ` (${count})`;
    }
    choices.push(['bye', trEditorStructure('bye')]);
    for (const [, label] of choices) { const option = document.createElement('option'); option.value = label; options.appendChild(option); }
    for (let index = 0; index < drawSize; index++) {
        const label = document.createElement('label'), title = document.createElement('span'), input = document.createElement('input');
        title.textContent = trEditorStructure('slot', { match: Math.floor(index / 2) + 1, side: index % 2 + 1 });
        input.type = 'text'; input.setAttribute('list', 'te-structure-options'); input.placeholder = trEditorStructure('auto');
        const current = editorStructureDraft.slots[index] || '';
        input.value = choices.find(([key]) => key === current)?.[1] || current;
        input.dataset.slot = String(index); input.dataset.key = current;
        input.addEventListener('change', () => {
            const choice = choices.find(([, text]) => text === input.value.trim());
            const key = input.value.trim() ? choice?.[0] : '';
            input.setCustomValidity(key == null ? trEditorStructure('invalid') : '');
            if (key != null) { editorStructureDraft.slots[index] = key; input.dataset.key = key; }
        });
        label.append(title, input); slotList.appendChild(label);
    }
}
function getEditorStructureFormData(values) {
    if (!tournamentEditorElement('te-structure-panel') || tournamentEditorElement('te-structure-content').hidden) return { editorInvitations: null, editorStructure: null };
    const team = Boolean(values.editorTeamMode), groups = editorStructureFormGroups();
    const league = tournamentEditorValue('te-structure-phase') === 'league' ? {
        cycles: Number(tournamentEditorValue('te-league-cycles')), playoffs: Number(tournamentEditorValue('te-league-playoffs')),
        legsToWin: Number(tournamentEditorValue('te-league-legs')), winPoints: Number(tournamentEditorValue('te-league-points')), tie: tournamentEditorValue('te-league-tie') } : null;
    if (league && (team || !tournamentEditorCreating && !tournamentEditorSelected?.isEditorTournament)) throw new Error(trEditorStructure('leagueInvalid'));
    if (groups && tournamentEditorValue('te-event-kind') === 'qualifier' && !team) throw new Error(trEditorStructure('invalid'));
    const assignmentKeys = new Set(editorStructureFormEntrants().map(editorStructureKey));
    const editorStructure = normalizeEditorStructure({ draw: tournamentEditorValue('te-structure-draw'), groups, league,
        slots: tournamentEditorValue('te-structure-draw') === 'manual' ? [...editorStructureDraft.slots] : [],
        assignments: groups ? editorStructureDraft.assignments.filter(entry => assignmentKeys.has(entry.key)) : [] }, values.editorFieldSize);
    const references = new Map(editorInvitationDraft);
    if (!team && !groups && editorStructure?.draw === 'manual') {
        for (const key of editorStructure.slots) {
            const candidate = getTournamentEditorCandidates().find(person => getTournamentEditorPlayerKey(person) === key);
            if (candidate) references.set(key, editorTeamReference(candidate));
        }
    }
    const editorInvitations = team ? null : normalizeEditorInvitations({ mode: tournamentEditorValue('te-invitation-mode'), players: [...references.values()] }, values.editorFieldSize);
    if (league) validateEditorLeagueEvent({ ...values, isEditorTournament: true, editorStructure });
    return { editorInvitations, editorStructure };
}
