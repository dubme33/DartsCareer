// Career-owned entry rules. The same selection is used by the draw and preview.
const TOURNAMENT_EDITOR_RANKINGS = {
    open: 'prizeMoney', oom: 'prizeMoney', protour: 'proTourPrizeMoney', pc: 'pcPrizeMoney',
    europeanTour: 'europeanTourPrizeMoney', challengeTour: 'challengeTourPrizeMoney', developmentTour: 'developmentTourPrizeMoney', womensSeries:'womensSeriesPrizeMoney'
};

function getTournamentEditorNativeRouteDefinitions(tournament) {
    const name = String(tournament?.sourceName || tournament?.name || '');
    if (tournament?.isEditorTournament || !/(?:world(?: darts)?|global darts) championship/i.test(name)
        || typeof buildWorldChampionshipQualification !== 'function') return [];
    return buildWorldChampionshipQualification([]).categories.filter(route => route.key !== 'oomFallback');
}

function normalizeTournamentEditorNativeRoutes(raw, tournament) {
    if (raw == null || Array.isArray(raw) && !raw.length) return null;
    const definitions = getTournamentEditorNativeRouteDefinitions(tournament);
    if (!Array.isArray(raw) || raw.length > definitions.length || hasTournamentEditorQualification(tournament))
        throw new Error('Invalid native qualification routes');
    const used = new Set();
    return raw.map(value => {
        const definition = definitions.find(route => route.key === value?.nativeKey);
        if (!definition || used.has(value.nativeKey) || !Number.isInteger(value.places)
            || value.places < 1 || value.places > definition.requested
            || ![...Object.keys(TOURNAMENT_EDITOR_RANKINGS), 'country', 'tourRanking'].includes(value.source))
            throw new Error('Invalid native qualification routes');
        used.add(value.nativeKey);
        const route = { nativeKey: value.nativeKey, source: value.source, places: value.places };
        if (value.source === 'tourRanking') {
            if (typeof value.tourId !== 'string' || !value.tourId.trim() || value.tourId.length > 1000
                || /[\u0000-\u001f\u007f]/.test(value.tourId)) throw new Error('Invalid native qualification routes');
            route.tourId = value.tourId.trim();
        }
        if (value.source === 'country') {
            if (typeof value.country !== 'string' || !value.country.trim() || value.country.length > 80
                || /[\u0000-\u001f\u007f]/.test(value.country)
                || !Object.hasOwn(TOURNAMENT_EDITOR_RANKINGS, value.ranking)) throw new Error('Invalid native qualification routes');
            route.country = value.country.trim(); route.ranking = value.ranking;
        }
        return route;
    });
}

function validateTournamentEditorNativeRouteLinks(tournament, routes, events = tournamentDatabase, tours = null) {
    validateTournamentEditorCycleRankingLinks(tournament, routes, events, tours);
}

function validateTournamentEditorCycleRankingLinks(tournament, routes, events = tournamentDatabase, tours = null) {
    if (!routes?.length) return;
    const availableTours = tours || (typeof getCareerCalendarEditorState === 'function' ? getCareerCalendarEditorState().tours : []);
    routes.filter(route => route.source === 'tourRanking').forEach(route => {
        const tour = availableTours.find(candidate => candidate.id === route.tourId && !candidate.removed && candidate.ranking === 'own');
        const tourEvents = events.filter(event => event.editorCycle === 'custom'
            ? tour && String(event.editorTourName || '').trim().toLocaleLowerCase() === tour.name.toLocaleLowerCase()
            : typeof getCareerEditorTourId === 'function' && getCareerEditorTourId(event) === route.tourId);
        const start = new Date(2027, tournament.month, tournament.day);
        if (!tour || !tourEvents.length || tourEvents.some(event => event === tournament
            || new Date(2027, event.endMonth ?? event.month, event.endDay ?? event.day) >= start))
            throw new Error('Invalid cycle ranking qualification');
    });
}

function validateTournamentEditorEventTourLinks(tournament, events = tournamentDatabase, tours = null) {
    for (const [routes, message] of [[tournament.editorNativeRoutes, 'invalidNativeRoute'],
        [tournament.editorQualification?.routes, 'invalidTourRoute']]) {
        try { validateTournamentEditorCycleRankingLinks(tournament, routes, events, tours); }
        catch (_error) { throw new Error(typeof trTournamentEditor === 'function' ? trTournamentEditor(message) : 'Invalid cycle ranking qualification'); }
    }
}

function getTournamentEditorCycleRankingPool(route, candidates, referenceDate) {
    if (typeof getCareerTourRanking !== 'function' || typeof getCareerTourPrizeMoney !== 'function'
        || typeof getCareerCalendarEditorState !== 'function') return [];
    const tour = getCareerCalendarEditorState().tours.find(candidate => candidate.id === route.tourId);
    if (!tour || tour.removed || tour.ranking !== 'own') return [];
    return getCareerTourRanking(route.tourId, candidates, referenceDate.getFullYear())
        .filter(candidate => getCareerTourPrizeMoney(candidate, route.tourId, referenceDate.getFullYear()) > 0);
}

function getTournamentEditorNativeRoutePool(tournament, route, candidates, referenceDate) {
    const all = getTournamentEditorCandidates(candidates).filter(candidate =>
        isTournamentEditorCandidateEligible({ ...tournament, editorQualification: { card: 'all' } }, candidate, referenceDate));
    if (route.source === 'tourRanking') {
        // Rank the whole cycle first; an unavailable leader passes the place down.
        return getTournamentEditorCycleRankingPool(route, all, referenceDate);
    }
    return getTournamentEditorRanking(all.filter(candidate => route.source !== 'country'
        || matchesTournamentEditorCountry(candidate, route.country)), route.source === 'country' ? route.ranking : route.source);
}

function getTournamentEditorNativeRouteLabel(route) {
    const text = key => typeof trTournamentEditor === 'function' ? trTournamentEditor(key) : key;
    if (route.source === 'tourRanking') {
        const tour = typeof getCareerCalendarEditorState === 'function'
            ? getCareerCalendarEditorState().tours.find(candidate => candidate.id === route.tourId) : null;
        return `${text('tourRanking')} · ${tour?.name || route.tourId}`;
    }
    return route.source === 'country' ? `${typeof t === 'function' ? t(route.country) : route.country} · ${text(route.ranking)}` : text(route.source);
}

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

function getTournamentEditorGender(tournament) {
    if (typeof isWorldCupQualifierTournament === 'function' && isWorldCupQualifierTournament(tournament)
        && typeof getWorldCupRosterEvent === 'function') return getWorldCupRosterEvent()?.editorGender || 'all';
    return tournament?.editorGender || 'all';
}

function isTournamentEditorGenderEligible(tournament, candidate) {
    const gender = getTournamentEditorGender(tournament);
    if (!['male', 'female'].includes(gender)) return true;
    if (Array.isArray(candidate?.players)) return candidate.players.every(member => isTournamentEditorGenderEligible(tournament, member));
    return Boolean(candidate) && (candidate.gender === 'female' ? 'female' : 'male') === gender;
}

function isTournamentEditorGenderChangeLocked(tournament, gender) {
    if ((tournament?.editorGender || 'all') === (gender || 'all')) return false;
    const keys = [tournament?.name, tournament?.sourceName].filter(Boolean);
    if (typeof tournamentDatabase !== 'undefined' && tournamentDatabase.some(event => event !== tournament
        && (keys.includes(event.qualifierFor) || isTournamentEditorQualifier(event) && keys.includes(event.editorQualification.targetKey))
        && (event.completed || typeof isTournamentEditorActive === 'function' && isTournamentEditorActive(event)))) return true;
    return typeof isWorldCupTournament === 'function' && isWorldCupTournament(tournament)
        && typeof worldCupState !== 'undefined' && Boolean(worldCupState && !worldCupState.completed);
}

function normalizeTournamentEditorCities(value) {
    const entries = value == null || value === '' ? [] : typeof value === 'string' ? value.split(/[;\r\n]+/) : value;
    if (!Array.isArray(entries)) throw new Error('Invalid cities');
    const nonempty = entries.filter(city => typeof city !== 'string' || city.trim());
    if (nonempty.length > 50) throw new Error('Invalid cities');
    const cities = nonempty.map(city => {
        if (typeof city !== 'string') throw new Error('Invalid cities');
        const text = city.normalize('NFC').trim().replace(/\s+/g, ' ');
        if (text.length > 80 || /[\u0000-\u001f\u007f]/.test(text)) throw new Error('Invalid cities');
        return text;
    }).filter(Boolean);
    return [...new Map(cities.map(city => [city.toLocaleLowerCase(), city])).values()];
}

function isTournamentEditorCityEligible(tournament, candidate) {
    if (!Array.isArray(tournament?.editorCities) || !tournament.editorCities.length) return true;
    if (Array.isArray(candidate?.players)) return candidate.players.length > 0
        && candidate.players.every(member => isTournamentEditorCityEligible(tournament, member));
    const hometown = typeof candidate?.hometown === 'string'
        ? candidate.hometown.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase() : '';
    return Boolean(hometown) && tournament.editorCities.some(city => city.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase() === hometown);
}

function isTournamentEditorCandidateEligible(tournament, candidate, referenceDate, options = {}) {
    const rules = tournament.editorQualification;
    if (!isTournamentEditorGenderEligible(tournament, candidate)) return false;
    if (!isTournamentEditorCityEligible(tournament, candidate)) return false;
    if (typeof isCareerEditorAccessEligible === 'function' && !isCareerEditorAccessEligible(tournament, candidate, referenceDate)) return false;
    if (!candidate || candidate.isBye || candidate.retired === true
        || (!options.ignoreAvailability && typeof isPlayerAvailableForPlay === 'function' && !isPlayerAvailableForPlay(candidate))) return false;
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

function isTournamentEditorNativeTarget(tournament) {
    if (!tournament || hasTournamentEditorQualification(tournament) || tournament.qualifierFor
        || /qualifier|kwalifikac/i.test(`${tournament.specialType || ''} ${tournament.sourceName || tournament.name || ''}`)) return false;
    const name = String(tournament.sourceName || tournament.name || '').toLowerCase();
    return !/world cup|global cup|puchar narodów|grand slam|champion's slam|premier|global darts league/.test(name)
        && !['worldCup', 'worldCupQualifier', 'worldCupQualifiers'].includes(tournament.specialType);
}

function getTournamentEditorNativeQualifierCapacity(tournament) {
    if (!isTournamentEditorNativeTarget(tournament)) return 0;
    if (tournament.isEditorTournament === true) return Number(tournament.editorFieldSize) || 32;
    const name = String(tournament.sourceName || tournament.name || '').toLowerCase();
    if (typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(tournament))
        return typeof CONTINENTAL_QUALIFIER_PATHS !== 'undefined'
            ? CONTINENTAL_QUALIFIER_PATHS.host.places : 4;
    if (typeof getWorldMastersTournamentRound === 'function'
        && (typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(tournament)
            || typeof isWorldMastersFinalsTournament === 'function' && isWorldMastersFinalsTournament(tournament)))
        return getWorldMastersTournamentRound(tournament);
    if (/players championship finals|pro players finals/.test(name)) return 64;
    if (/players championship|pro players cup/.test(name)) return 128;
    if (/uk open|british open/.test(name) || tournament.specialType === 'ukOpen') return 160;
    if (/world championship|global championship/.test(name)) return 128;
    // Other fixed built-in knockout fields use 32 places. Dynamic secondary tours
    // can vary with eligibility, so their draw applies the available places.
    if (/challenge tour|development tour/.test(name)) return null;
    return 32;
}

function getTournamentEditorNativeQualifierWinners(main, candidates, referenceDate = currentDate) {
    if (!isTournamentEditorNativeTarget(main) || typeof tournamentDatabase === 'undefined') return [];
    const targetKey = String(main.sourceName || main.name || '');
    const byKey = new Map(getTournamentEditorCandidates(candidates).map(candidate => [getTournamentEditorPlayerKey(candidate), candidate]));
    const used = new Set();
    return tournamentDatabase.filter(event => isTournamentEditorQualifier(event)
        && event.editorQualification.targetKey === targetKey && event.completed
        && event.editorQualifierResults?.year === referenceDate.getFullYear()).flatMap(event =>
        (event.editorQualifierResults.playerKeys || []).slice(0, event.editorQualification.qualifyingPlaces)).flatMap(key => {
        const candidate = byKey.get(key);
        if (!candidate || used.has(key) || !isTournamentEditorGenderEligible(main, candidate)
            || (typeof isCareerEditorAccessEligible === 'function' && !isCareerEditorAccessEligible(main, candidate, referenceDate))
            || (Number(candidate.ovr ?? candidate.overall) || 0) < (Number(main.minOvr) || 0)
            || (typeof isPlayerAvailableForPlay === 'function' && !isPlayerAvailableForPlay(candidate))) return [];
        used.add(key);
        return [candidate];
    });
}

function applyTournamentEditorNativeQualifierDraw(main, draw, candidates, referenceDate = currentDate) {
    if (!Array.isArray(draw) || !draw.length || typeof isContinentalTourTournament === 'function'
        && isContinentalTourTournament(main)) return draw;
    const winners = getTournamentEditorNativeQualifierWinners(main, candidates, referenceDate);
    if (!winners.length) return draw;
    const result = [...draw];
    const key = getTournamentEditorPlayerKey;
    const existing = new Set(result.map(key).filter(Boolean));
    const winnerKeys = new Set(winners.map(key));
    const protectedCount = Math.min(16, Math.floor(result.length / 2), Math.max(0, result.length - winnerKeys.size));
    const protectedKeys = new Set(getTournamentEditorRanking(result.filter(candidate => candidate && !candidate.isBye
        && !winnerKeys.has(key(candidate))), 'oom').slice(0, protectedCount).map(key));
    winners.forEach(winner => {
        const winnerKey = key(winner);
        if (existing.has(winnerKey)) return;
        let index = result.findLastIndex(candidate => !candidate || candidate.isBye);
        if (index < 0) {
            const replaceable = result.map((candidate, slot) => ({ candidate, slot }))
                .filter(entry => entry.candidate && !protectedKeys.has(key(entry.candidate))
                    && !winnerKeys.has(key(entry.candidate)))
                .sort((first, second) => (Number(first.candidate.prizeMoney) || 0) - (Number(second.candidate.prizeMoney) || 0));
            index = replaceable[0]?.slot ?? -1;
        }
        if (index < 0) return;
        existing.delete(key(result[index]));
        result[index] = winner;
        existing.add(winnerKey);
    });
    return result;
}

function getTournamentEditorQualificationGroups(tournament, candidates, referenceDate = currentDate, options = {}) {
    if (typeof hasCareerTourEntryOverride === 'function' && hasCareerTourEntryOverride(tournament)) return getCareerTourEntryGroups(tournament, candidates, referenceDate, options);
    if (!hasTournamentEditorQualification(tournament)) return [];
    const rules = tournament.editorQualification;
    const all = getTournamentEditorCandidates(candidates);
    let eligible = all.filter(candidate => isTournamentEditorCandidateEligible(tournament, candidate, referenceDate, options));
    if (isTournamentEditorQualifier(tournament)) {
        const main = getTournamentEditorLinkedMain(tournament);
        if (main && !options.automaticOnly) {
            const automaticKeys = new Set(hasTournamentEditorQualification(main)
                ? getTournamentEditorQualificationGroups(main, all, referenceDate, { automaticOnly: true })
                    .flatMap(group => group.players.map(getTournamentEditorPlayerKey))
                : typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(main)
                    && typeof buildContinentalAutomaticField === 'function'
                    ? Object.values(buildContinentalAutomaticField(all)).flat().map(getTournamentEditorPlayerKey) : []);
            eligible = eligible.filter(candidate => isTournamentEditorGenderEligible(main, candidate)
                && (hasTournamentEditorQualification(main)
                ? isTournamentEditorCandidateEligible(main, candidate, referenceDate)
                : (Number(candidate.ovr ?? candidate.overall) || 0) >= (Number(main.minOvr) || 0))
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
            pool = eligible.filter(candidate => !reservedKeys.has(getTournamentEditorPlayerKey(candidate))
                && (route.source !== 'country' || matchesTournamentEditorCountry(candidate, route.country)));
            players = route.source === 'tourRanking' ? getTournamentEditorCycleRankingPool(route, pool, referenceDate)
                : getTournamentEditorRanking(pool, route.source === 'country' ? route.ranking || 'oom' : route.source);
        }
        // Earlier routes take priority; ranking places roll down without duplicates.
        players = players.filter(candidate => !used.has(getTournamentEditorPlayerKey(candidate))).slice(0, route.places);
        players.forEach(candidate => used.add(getTournamentEditorPlayerKey(candidate)));
        return { key: `editor-${index}`, source: route.source, qualifierKey: route.qualifierKey,
            country: route.country, ranking: route.ranking, tourId: route.tourId,
            places: route.places, players, pending, confirmed, eligible: pool };
    });
}

function getTournamentEditorParticipants(tournament, candidates, referenceDate = currentDate, options = {}) {
    const participants = getTournamentEditorQualificationGroups(tournament, candidates, referenceDate, options).flatMap(group => group.players);
    return typeof applyTournamentEditorInvitations === 'function'
        ? applyTournamentEditorInvitations(tournament, participants, candidates, referenceDate, options) : participants;
}

function buildTournamentEditorDraw(tournament, participants) {
    const size = typeof getCareerTourFieldSize === 'function' ? getCareerTourFieldSize(tournament) : Number(tournament.editorFieldSize) || 32;
    const real = participants.filter(candidate => candidate && !candidate.isBye);
    const manual = typeof applyEditorManualDraw === 'function' ? applyEditorManualDraw(tournament, real, size) : null;
    if (manual) return manual.map(candidate => candidate || { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 });
    const shuffled = typeof shuffle === 'function' ? shuffle([...real]) : [...real];
    const draw = Array.from({ length: size }, () => ({ name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 }));
    // Place entrants in opposite halves first, then opposite quarters, etc.
    // Even with many empty places, two actual players survive to the final.
    const bits = Math.log2(size);
    shuffled.slice(0, size).forEach((candidate, index) => {
        let slot = 0;
        for (let bit = 0; bit < bits; bit++) slot = slot * 2 + ((index >> bit) & 1);
        draw[slot] = candidate;
    });
    return draw;
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
