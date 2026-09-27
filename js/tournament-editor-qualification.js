// Career-owned entry rules. The same selection is used by the draw and preview.
const TOURNAMENT_EDITOR_RANKINGS = {
    open: 'prizeMoney', oom: 'prizeMoney', protour: 'proTourPrizeMoney', pc: 'pcPrizeMoney',
    europeanTour: 'europeanTourPrizeMoney', challengeTour: 'challengeTourPrizeMoney', developmentTour: 'developmentTourPrizeMoney'
};

function hasTournamentEditorQualification(tournamentOrName) {
    const tournament = typeof tournamentOrName === 'string'
        ? (typeof tournamentDatabase !== 'undefined' ? tournamentDatabase.find(event =>
            event.name === tournamentOrName || event.sourceName === tournamentOrName) : null)
        : tournamentOrName;
    return tournament?.editorQualification?.mode === 'custom';
}

function isTournamentEditorQualifier(tournament) {
    return hasTournamentEditorQualification(tournament) && tournament.editorQualification.kind === 'qualifier';
}

function getTournamentEditorPlayerKey(candidate) {
    if (!candidate || candidate.isBye) return '';
    return candidate.id || `${candidate.name || ''}|${candidate.country || ''}`;
}

function getTournamentEditorCandidates(candidates) {
    const source = Array.isArray(candidates) ? candidates : [
        ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
        ...(typeof player !== 'undefined' && player?.name ? [player] : [])
    ];
    const unique = new Map();
    source.forEach(candidate => {
        const key = getTournamentEditorPlayerKey(candidate);
        if (key && !unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function matchesTournamentEditorCountry(candidate, country) {
    const required = String(country || '').trim().toLocaleLowerCase();
    return Boolean(required) && required === String(candidate?.country || '').trim().toLocaleLowerCase();
}

function isTournamentEditorCandidateEligible(tournament, candidate, referenceDate) {
    const rules = tournament.editorQualification;
    if (!candidate || candidate.isBye || candidate.retired === true
        || (typeof isPlayerAvailableForPlay === 'function' && !isPlayerAvailableForPlay(candidate))) return false;
    if ((Number(candidate.ovr ?? candidate.overall) || 0) < (Number(tournament.minOvr) || 0)) return false;
    if (rules.card === 'holders' && candidate.hasTourCard !== true) return false;
    if (rules.card === 'nonholders' && candidate.hasTourCard === true) return false;
    if (rules.minAge || rules.maxAge) {
        const age = typeof getPlayerAge === 'function' ? getPlayerAge(candidate, referenceDate)
            : Number.isInteger(candidate.birthYear) ? referenceDate.getFullYear() - candidate.birthYear : null;
        if (age === null || age < (rules.minAge || 0) || age > (rules.maxAge || 100)) return false;
    }
    return !rules.countries?.length || rules.countries.some(country => matchesTournamentEditorCountry(candidate, country));
}

function getTournamentEditorRanking(candidates, source) {
    const property = TOURNAMENT_EDITOR_RANKINGS[source] || 'prizeMoney';
    return [...candidates].sort((first, second) => (Number(second[property]) || 0) - (Number(first[property]) || 0)
        || String(getTournamentEditorPlayerKey(first)).localeCompare(String(getTournamentEditorPlayerKey(second))));
}

function getTournamentEditorLinkedMain(qualifier) {
    return tournamentDatabase.find(event => event !== qualifier
        && [event.sourceName, event.name].filter(Boolean).includes(qualifier.editorQualification?.targetKey));
}

function getTournamentEditorQualificationGroups(tournament, candidates, referenceDate = currentDate, options = {}) {
    if (!hasTournamentEditorQualification(tournament)) return [];
    const rules = tournament.editorQualification;
    const all = getTournamentEditorCandidates(candidates);
    let eligible = all.filter(candidate => isTournamentEditorCandidateEligible(tournament, candidate, referenceDate));
    if (isTournamentEditorQualifier(tournament)) {
        const main = getTournamentEditorLinkedMain(tournament);
        if (main && !options.automaticOnly) {
            const automaticKeys = new Set(getTournamentEditorQualificationGroups(main, all, referenceDate, { automaticOnly: true })
                .flatMap(group => group.players.map(getTournamentEditorPlayerKey)));
            eligible = eligible.filter(candidate => isTournamentEditorCandidateEligible(main, candidate, referenceDate)
                && !automaticKeys.has(getTournamentEditorPlayerKey(candidate)));
            const previousQualifiers = tournamentDatabase.filter(event => event !== tournament
                && isTournamentEditorQualifier(event) && event.editorQualification.targetKey === rules.targetKey
                && event.completed && event.editorQualifierResults?.year === referenceDate.getFullYear());
            const qualifiedKeys = new Set(previousQualifiers.flatMap(event => event.editorQualifierResults.playerKeys));
            eligible = eligible.filter(candidate => !qualifiedKeys.has(getTournamentEditorPlayerKey(candidate)));
        }
    }
    const reservedKeys = new Set();
    if (!isTournamentEditorQualifier(tournament)) (rules.routes || []).filter(route => route.source === 'qualifier').forEach(route => {
        const qualifier = tournamentDatabase.find(event => [event.sourceName, event.name].filter(Boolean).includes(route.qualifierKey));
        if (qualifier?.completed && qualifier.editorQualifierResults?.year === referenceDate.getFullYear()) {
            qualifier.editorQualifierResults.playerKeys.forEach(key => reservedKeys.add(key));
        }
    });
    const used = new Set();
    return (rules.routes || []).filter(route => !options.automaticOnly || route.source !== 'qualifier').map((route, index) => {
        let players = [], pending = false, confirmed = false, pool = [];
        if (route.source === 'qualifier') {
            const qualifier = tournamentDatabase.find(event => [event.sourceName, event.name].filter(Boolean).includes(route.qualifierKey));
            const result = qualifier?.editorQualifierResults;
            confirmed = Boolean(qualifier?.completed && result?.year === referenceDate.getFullYear());
            pending = !confirmed;
            const resultKeys = new Set(confirmed ? result.playerKeys : []);
            players = eligible.filter(candidate => resultKeys.has(getTournamentEditorPlayerKey(candidate)));
            if (pending && qualifier) pool = getTournamentEditorQualificationGroups(qualifier, all, referenceDate)
                .flatMap(group => group.players);
        } else {
            const pool = eligible.filter(candidate => !reservedKeys.has(getTournamentEditorPlayerKey(candidate))
                && (route.source !== 'country' || matchesTournamentEditorCountry(candidate, route.country)));
            players = getTournamentEditorRanking(pool, route.source === 'country' ? route.ranking || 'oom' : route.source);
        }
        // Earlier routes take priority; ranking places roll down without duplicates.
        players = players.filter(candidate => !used.has(getTournamentEditorPlayerKey(candidate))).slice(0, route.places);
        players.forEach(candidate => used.add(getTournamentEditorPlayerKey(candidate)));
        return { key: `editor-${index}`, source: route.source, qualifierKey: route.qualifierKey,
            country: route.country, ranking: route.ranking,
            places: route.places, players, pending, confirmed, eligible: pool };
    });
}

function getTournamentEditorParticipants(tournament, candidates, referenceDate = currentDate) {
    return getTournamentEditorQualificationGroups(tournament, candidates, referenceDate).flatMap(group => group.players);
}

function buildTournamentEditorDraw(tournament, participants) {
    const size = tournament.editorFieldSize || 32;
    const draw = typeof shuffle === 'function' ? shuffle([...participants]) : [...participants];
    while (draw.length < size) draw.push({ name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 });
    // Spread vacancies across pairs, avoiding BYE versus BYE where possible.
    const real = draw.filter(candidate => !candidate.isBye), byes = draw.filter(candidate => candidate.isBye);
    const paired = [];
    while (real.length || byes.length) {
        paired.push(real.shift() || byes.shift());
        paired.push(byes.shift() || real.shift());
    }
    return paired;
}

function completeTournamentEditorQualifier(tournament, survivors, referenceDate = currentDate) {
    tournament.editorQualifierResults = { year: referenceDate.getFullYear(), playerKeys:
        getTournamentEditorCandidates(survivors).map(getTournamentEditorPlayerKey)
            .slice(0, tournament.editorQualification.qualifyingPlaces) };
}

function concludeTournamentEditorQualifier(showOutcome = true) {
    const tournament = activeTournament;
    if (!isTournamentEditorQualifier(tournament)) return false;
    const qualified = tournament.editorQualifierResults?.playerKeys?.includes(getTournamentEditorPlayerKey(player));
    tournament.completed = true;
    if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(tournament);
    else tournament.historyLogs = lastTournamentResults;
    activeTournament = null;
    tournamentBracket = [];
    const tile = document.getElementById('tile-tournament');
    if (tile) tile.style.display = 'none';
    if (typeof updateHub === 'function') updateHub();
    if (typeof saveGame === 'function') saveGame(true);
    if (showOutcome && typeof trTournamentEditor === 'function') alert(trTournamentEditor(qualified ? 'qualified' : 'notQualified'));
    return true;
}
