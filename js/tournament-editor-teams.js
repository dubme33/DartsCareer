// Editor UI for independent two-player team events. Entries contain references,
// never copies of the player database.
function teamEditorText(pl, en, de = en, nl = en) {
    return ({ pl, en, de, nl })[typeof currentLang === 'string' ? currentLang : 'pl'] || en;
}

function teamEditorPlayers() {
    return typeof getWorldCupRankedPlayers === 'function' ? getWorldCupRankedPlayers()
        : [player, ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])].filter(Boolean);
}

function teamEditorPlayerLabel(candidate) { return `${candidate.name} — ${candidate.country || '?'}`; }

function updateTeamEditorFields() {
    const selected = tournamentEditorSelected;
    const allowed = tournamentEditorCreating || selected?.isEditorTournament === true;
    const mode = allowed ? tournamentEditorElement('te-team-mode').value : 'solo';
    tournamentEditorElement('te-team-mode-wrap').hidden = !allowed;
    tournamentEditorElement('te-team-mode').disabled = !allowed;
    tournamentEditorElement('te-team-panel').hidden = mode === 'solo';
    tournamentEditorElement('te-national-panel').hidden = mode !== 'national';
    tournamentEditorElement('te-pairs-panel').hidden = mode !== 'pairs';
    tournamentEditorElement('te-team-hint').textContent = mode === 'national'
        ? teamEditorText('Pusta lista: reprezentacje zostaną wybrane według rankingu. Każdy kraj wystawia dwóch najwyżej sklasyfikowanych dostępnych zawodników.',
            'Leave empty to select national teams by ranking. Each country fields its two highest-ranked available players.',
            'Leer lassen, um Nationalteams nach Rangliste auszuwählen. Jedes Land stellt zwei verfügbare Spieler.',
            'Laat leeg om landenteams op ranglijst te kiezen. Elk land levert twee beschikbare spelers.')
        : teamEditorText('Wybierz dwóch różnych zawodników do każdej pary. Liczba par może być mniejsza od rozmiaru drabinki; pozostałe miejsca to wolne losy.',
            'Select two distinct players for each pair. Fewer pairs than bracket slots create byes.',
            'Wähle zwei verschiedene Spieler pro Doppel. Freie Plätze im Turnierbaum werden Freilose.',
            'Kies twee verschillende spelers per koppel. Vrije plaatsen in het schema worden byes.');
    tournamentEditorElement('te-prizes-hint').textContent = mode === 'solo'
        ? trTournamentEditor('prizesHint')
        : teamEditorText('Kwoty brutto dla całego zespołu. Każdy z dwóch zawodników otrzyma połowę.',
            'Gross amounts for the whole team. Each of the two players receives half.',
            'Bruttobeträge für das gesamte Team. Jeder Spieler erhält die Hälfte.',
            'Brutobedragen voor het hele team. Elke speler ontvangt de helft.');
    if (typeof updateTournamentEditorQualificationFields === 'function') updateTournamentEditorQualificationFields();
}

function refreshTournamentTeamEditorTranslations() {
    const labels = {
        'te-team-mode-label': ['Rodzaj turnieju', 'Tournament type', 'Turniertyp', 'Toernooitype'],
        'te-team-title': ['Zespoły', 'Teams', 'Teams', 'Teams'],
        'te-add-national': ['＋ Dodaj kraj', '＋ Add country', '＋ Land hinzufügen', '＋ Land toevoegen'],
        'te-add-pair': ['＋ Dodaj parę', '＋ Add pair', '＋ Doppel hinzufügen', '＋ Koppel toevoegen']
    };
    Object.entries(labels).forEach(([id, words]) => { tournamentEditorElement(id).textContent = teamEditorText(...words); });
    const choices = [
        ['Indywidualny', 'Singles', 'Einzel', 'Individueel'],
        ['Reprezentacje (po 2 zawodników)', 'National teams (2 players)', 'Nationalteams (2 Spieler)', 'Landenteams (2 spelers)'],
        ['Własne pary (po 2 zawodników)', 'Custom pairs (2 players)', 'Eigene Doppel (2 Spieler)', 'Eigen koppels (2 spelers)']
    ];
    [...tournamentEditorElement('te-team-mode').options].forEach((option, index) => {
        option.textContent = teamEditorText(...choices[index]);
    });
    document.querySelectorAll('#te-national-rows .te-team-remove, #te-pair-rows .te-team-remove').forEach(button => {
        button.textContent = teamEditorText('Usuń', 'Remove', 'Entfernen', 'Verwijderen');
    });
    updateTeamEditorFields();
}

function addTeamEditorNationalRow(value = '') {
    const row = document.createElement('div');
    row.className = 'te-team-row';
    const select = document.createElement('select');
    select.className = 'te-team-country';
    const countries = [...new Set(teamEditorPlayers().map(candidate => candidate.country).filter(Boolean))].sort();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = teamEditorText('Wybierz kraj', 'Select country', 'Land wählen', 'Kies land');
    select.appendChild(placeholder);
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = typeof t === 'function' ? t(country) : country;
        select.appendChild(option);
    });
    if (value && !countries.includes(value)) {
        const missing = document.createElement('option');
        missing.value = value;
        missing.textContent = value;
        select.appendChild(missing);
    }
    select.value = value;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'te-team-remove';
    remove.textContent = teamEditorText('Usuń', 'Remove', 'Entfernen', 'Verwijderen');
    remove.onclick = () => row.remove();
    row.append(select, remove);
    tournamentEditorElement('te-national-rows').appendChild(row);
}

function addTeamEditorPairRow(entry = null) {
    const row = document.createElement('div');
    row.className = 'te-team-row te-pair-row';
    const name = document.createElement('input');
    name.className = 'te-pair-name';
    name.type = 'text';
    name.maxLength = 80;
    name.placeholder = teamEditorText('Nazwa pary (opcjonalnie)', 'Pair name (optional)',
        'Doppelname (optional)', 'Koppelnaam (optioneel)');
    name.value = entry?.name || '';
    const candidates = teamEditorPlayers();
    const playerInputs = [0, 1].map(index => {
        const input = document.createElement('input');
        input.className = 'te-pair-player';
        input.type = 'text';
        input.setAttribute('list', 'te-team-player-options');
        input.placeholder = teamEditorText(`Zawodnik ${index + 1}`, `Player ${index + 1}`,
            `Spieler ${index + 1}`, `Speler ${index + 1}`);
        const reference = entry?.players?.[index];
        const candidate = candidates.find(person => reference?.id && String(person.id) === String(reference.id))
            || candidates.find(person => person.name === reference?.name && person.country === reference?.country);
        input.value = candidate ? teamEditorPlayerLabel(candidate) : reference?.name ? `${reference.name} — ${reference.country || '?'}` : '';
        return input;
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'te-team-remove';
    remove.textContent = teamEditorText('Usuń', 'Remove', 'Entfernen', 'Verwijderen');
    remove.onclick = () => row.remove();
    row.append(name, ...playerInputs, remove);
    tournamentEditorElement('te-pair-rows').appendChild(row);
}

function populateTournamentTeamEditor(tournament) {
    const mode = tournament?.isEditorTournament && ['national', 'pairs'].includes(tournament.editorTeamMode)
        ? tournament.editorTeamMode : 'solo';
    tournamentEditorElement('te-team-mode').value = mode;
    tournamentEditorElement('te-national-rows').replaceChildren();
    tournamentEditorElement('te-pair-rows').replaceChildren();
    const options = tournamentEditorElement('te-team-player-options');
    options.replaceChildren();
    teamEditorPlayers().forEach(candidate => {
        const option = document.createElement('option');
        option.value = teamEditorPlayerLabel(candidate);
        options.appendChild(option);
    });
    if (mode === 'national') (tournament.editorTeamEntries || []).forEach(entry => addTeamEditorNationalRow(entry.country));
    if (mode === 'pairs') (tournament.editorTeamEntries || []).forEach(addTeamEditorPairRow);
    updateTeamEditorFields();
}

function getTournamentTeamEditorFormData(fieldSize) {
    const mode = tournamentEditorElement('te-team-mode').disabled ? 'solo' : tournamentEditorValue('te-team-mode');
    if (mode === 'solo') return { editorTeamMode: null, editorTeamEntries: null };
    if (!['national', 'pairs'].includes(mode)) throw new Error(teamEditorText('Nieprawidłowy rodzaj turnieju.', 'Invalid tournament type.'));
    let entries;
    if (mode === 'national') {
        entries = [...document.querySelectorAll('#te-national-rows .te-team-country')].map(select => ({ country: select.value })).filter(entry => entry.country);
        if (new Set(entries.map(entry => entry.country)).size !== entries.length) {
            throw new Error(teamEditorText('Każdy kraj może wystąpić tylko raz.', 'Each country can enter only once.'));
        }
        if (entries.length === 1) throw new Error(teamEditorText('Dodaj co najmniej dwa kraje albo pozostaw listę pustą.', 'Add at least two countries or leave the list empty.'));
    } else {
        const byLabel = new Map(teamEditorPlayers().map(candidate => [teamEditorPlayerLabel(candidate), candidate]));
        entries = [...document.querySelectorAll('#te-pair-rows .te-pair-row')].map(row => {
            const selected = [...row.querySelectorAll('.te-pair-player')].map(input => byLabel.get(input.value.trim()));
            if (selected.some(candidate => !candidate)) throw new Error(teamEditorText('Wybierz dwóch zawodników z listy dla każdej pary.', 'Select two listed players for every pair.'));
            return { name: row.querySelector('.te-pair-name').value.trim().replace(/\s+/g, ' '),
                players: selected.map(candidate => ({ id: candidate.id, name: candidate.name, country: candidate.country })) };
        });
        if (entries.length < 2) throw new Error(teamEditorText('Dodaj co najmniej dwie pary.', 'Add at least two pairs.'));
        const names = entries.map(entry => entry.name.toLocaleLowerCase()).filter(Boolean);
        if (new Set(names).size !== names.length) throw new Error(teamEditorText('Nazwy par muszą być różne.', 'Pair names must be unique.'));
        const keys = entries.flatMap(entry => entry.players.map(reference => `${reference.name}|${reference.country}`));
        if (new Set(keys).size !== keys.length) throw new Error(teamEditorText('Zawodnik może wystąpić tylko w jednej parze.', 'A player can enter only one pair.'));
    }
    if (entries.length > fieldSize) throw new Error(teamEditorText('Liczba zespołów przekracza rozmiar drabinki.', 'Team count exceeds bracket size.'));
    return { editorTeamMode: mode, editorTeamEntries: entries };
}
