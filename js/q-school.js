// Annual UK/EU Q-School edition state. Daily events use the ordinary tournament engine.
const PDC_QSCHOOL_EDITION_VERSION = 2;
// Final 2025 Top 16, in ranking order. Values are stable base-template identities,
// also retained by cosmetic mods. Null means absent from the supplied database.
// https://www.dartsrankings.com/challengetour2025
// https://www.dartsrankings.com/developmenttour2025
const PDC_QSCHOOL_OPENING_TOP16 = Object.freeze({
    challengeTour: Object.freeze([129,90,160,96,141,354,113,377,93,103,76,111,156,133,null,161]),
    developmentTour: Object.freeze([68,76,107,82,354,103,55,77,392,85,102,332,338,null,159,127])
});

function getPdcQSchoolOpeningSnapshot(candidates) {
    const byIndex = new Map(candidates.map(candidate => {
        // Some base-roster additions have an implicit template lineage. Reuse
        // the existing resolver, which excludes custom players and newgens.
        const index = typeof getLifecycleTemplateIndex === 'function' ? getLifecycleTemplateIndex(candidate)
            : !candidate.isNewgen && !candidate.editorCreated && candidate.kind !== 'custom'
                && Number.isInteger(candidate.defaultTemplateIndex) ? candidate.defaultTemplateIndex : null;
        return [index, getPdcTourCardPlayerKey(candidate)];
    }).filter(([index]) => Number.isInteger(index)));
    return Object.fromEntries(Object.entries(PDC_QSCHOOL_OPENING_TOP16)
        .map(([tour, indices]) => [tour, indices.map(index => index === null ? null : byIndex.get(index) || null)]));
}
function isPdcParticipationRestricted(candidate, year = getPdcTourCardReferenceYear()) {
    return Boolean(candidate?.pdcParticipationRestrictions?.[year]);
}
function isPdcRestrictedEventEligible(event, candidate, date = currentDate) {
    const year = getPdcTourCardReferenceYear(date);
    if (event?.specialType === 'pdcQSchool') return candidate?.pdcTourCard?.qSchoolBarredYear !== year;
    if (!isPdcParticipationRestricted(candidate, year)) return true;
    // PDPA 5.2 concerns ProTour (including its qualifiers) and secondary tours.
    const name = `${event?.name || ''} ${event?.sourceName || ''}`.toLowerCase();
    const restricted = (typeof isChallengeTourTournament === 'function' && isChallengeTourTournament(event))
        || (typeof isDevelopmentTourTournament === 'function' && isDevelopmentTourTournament(event))
        || (typeof isEuropeanTourTournament === 'function' && isEuropeanTourTournament(event))
        || (typeof isPdcTourCardQualifierTournament === 'function' && isPdcTourCardQualifierTournament(event))
        || (typeof isPlayersChampionshipTournament === 'function' && isPlayersChampionshipTournament(event))
        || (/players championship|pro players cup/.test(name) && !name.includes('final'))
        || /women.s series/.test(name);
    return !restricted;
}
function disqualifyPdcQSchoolRanking(candidate, edition, zone, reason, day = null) {
    const key = getPdcTourCardPlayerKey(candidate), region = edition[zone];
    region.rankingIneligible ||= {};
    region.rankingIneligible[key] ||= { reason, day };
    candidate.pdcParticipationRestrictions ||= {};
    candidate.pdcParticipationRestrictions[edition.year] ||= { reason, qSchoolZone: zone, day };
}
function declinePdcQSchoolTourCard(candidate, edition = getPdcQSchoolEdition()) {
    const key = getPdcTourCardPlayerKey(candidate), zone = edition.zones[key];
    if (!zone || ![...edition[zone].directCards, ...edition[zone].rankingCards].includes(key)
        || !hasPdcTourCardForYear(candidate, edition.year)) return false;
    disqualifyPdcQSchoolRanking(candidate, edition, zone, 'declined-tour-card');
    clearPdcTourCard(candidate, edition.year);
    appendPdcCardHistory(getPdcCardRecord(candidate), { type: 'declined', source: 'qschool', year: edition.year });
    return true;
}
const PDC_QSCHOOL_UK_COUNTRIES = new Set(['Anglia','Szkocja','Walia','Wielka Brytania','Irlandia Północna','Irlandia','Gibraltar',
    'England','Scotland','Wales','Northern Ireland','Ireland','Republic of Ireland']);
const PDC_QSCHOOL_EU_COUNTRIES = new Set(['Albania','Andora','Austria','Belgia','Białoruś','Bośnia i Hercegowina','Bułgaria',
    'Chorwacja','Cypr','Czechy','Dania','Estonia','Finlandia','Francja','Grecja','Hiszpania','Holandia','Islandia','Kosowo',
    'Liechtenstein','Litwa','Luksemburg','Łotwa','Macedonia Północna','Malta','Mołdawia','Monako','Niemcy','Norwegia','Polska',
    'Portugalia','Rosja','Rumunia','San Marino','Serbia','Słowacja','Słowenia','Szwajcaria','Szwecja','Turcja','Ukraina','Węgry','Włochy',
    'Netherlands','Germany','Belgium','France','Spain','Portugal','Poland','Sweden','Norway','Denmark','Finland','Austria','Switzerland',
    'Czech Republic','Czechia','Hungary','Italy','Croatia','Slovakia','Slovenia','Greece','Romania','Lithuania','Latvia','Estonia']);

function getPdcQSchoolEditions(owner = (typeof player !== 'undefined' ? player : null)) {
    if (!owner) return {};
    if (!owner.pdcQSchoolEditions || typeof owner.pdcQSchoolEditions !== 'object') owner.pdcQSchoolEditions = {};
    return owner.pdcQSchoolEditions;
}
function getPdcQSchoolZone(candidate, edition) {
    const key = getPdcTourCardPlayerKey(candidate);
    if (edition.zones[key]) return edition.zones[key];
    let zone = PDC_QSCHOOL_UK_COUNTRIES.has(candidate.country) ? 'UK' : PDC_QSCHOOL_EU_COUNTRIES.has(candidate.country) ? 'EU' : null;
    if (!zone) {
        if (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate) && ['UK','EU'].includes(player.qSchoolPreferredZone)) zone = player.qSchoolPreferredZone;
        else {
            let hash = 2166136261;
            for (const char of key) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
            zone = (hash >>> 0) % 2 ? 'UK' : 'EU';
        }
    }
    return edition.zones[key] = zone;
}
function isPdcQSchoolAgeEligible(candidate, year) {
    const cutoff = new Date(year, 0, 4);
    if (typeof getWomensAgeBirthContext === 'function') candidate=getWomensAgeBirthContext(candidate,cutoff);
    if (candidate.birthDate && (candidate.birthYear==null || !Number.isInteger(Number(candidate.birthYear))
        || Number(candidate.birthDate.slice(0,4))===Number(candidate.birthYear))) {
        const born = new Date(candidate.birthDate);
        if (!Number.isNaN(born.getTime())) return new Date(born.getFullYear() + 16, born.getMonth(), born.getDate()) <= cutoff;
    }
    return !Number.isInteger(candidate.birthYear) || year - candidate.birthYear >= 16;
}
function isPdcQSchoolEntrant(candidate, year) {
    return isPdcTourCardEligiblePlayer(candidate) && !hasPdcTourCardForYear(candidate, year) && isPdcQSchoolAgeEligible(candidate, year)
        && candidate.pdcTourCard?.qSchoolBarredYear !== year;
}
function createPdcQSchoolRegion() {
    return { entrants: [], exemptions: {}, firstDirect: [], firstRanking: {}, finalRanking: {},
        finalField: null, firstDays: {}, finalDays: {}, attendance: [], directCards: [], rankingCards: [], playoffResults: {}, rankingIneligible: {} };
}
function getPdcQSchoolEdition(year = getPdcTourCardReferenceYear(), candidates = getPdcTourCardPlayers(), owner = player) {
    const editions = getPdcQSchoolEditions(owner);
    const existing = editions[year];
    if (existing?.legacy || existing?.completed || existing?.UK?.attendance.length || existing?.EU?.attendance.length) return existing;
    const roster = uniquePdcTourCardPlayers(candidates);
    const rosterSignature = `${getPdcTourCardTotalPlaces()}:` + roster.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate.country,
        candidate.birthDate || null, candidate.birthYear, hasPdcTourCardForYear(candidate, year), candidate.pdcTourCard?.lostYear,
        candidate.pdcTourCard?.qSchoolBarredYear].join(':')).sort().join('|');
    if (existing?.rosterSignature === rosterSignature) return existing;
    const edition = { version: PDC_QSCHOOL_EDITION_VERSION, year, zones: {}, identities: {}, UK: createPdcQSchoolRegion(), EU: createPdcQSchoolRegion(),
        vacancies: Math.max(0, getPdcTourCardTotalPlaces() - getPdcTourCardHolders(candidates, year).length), allocations: null,
        diagnostics: [], completed: false, rosterSignature };
    if (existing) edition.zones = existing.zones;
    if (getPdcTourCardHolders(candidates, year).length > getPdcTourCardTotalPlaces()) edition.diagnostics.push('card-capacity-exceeded');
    const previous = getPdcCardSeasonStore(owner)[year - 1];
    const snapshot = previous?.snapshot || (year === 2026 ? getPdcQSchoolOpeningSnapshot(roster) : null);
    for (const candidate of roster) {
        if (!isPdcQSchoolEntrant(candidate, year)) continue;
        const key = getPdcTourCardPlayerKey(candidate), zone = getPdcQSchoolZone(candidate, edition), region = edition[zone];
        edition.identities[key] = { name: candidate.name, country: candidate.country };
        region.entrants.push(key);
        if (previous?.lostPlayerIds?.includes(key) || candidate.pdcTourCard?.lostYear === year) region.exemptions[key] = 'lost-card';
        else if (snapshot?.challengeTour?.slice(0,16).includes(key)) region.exemptions[key] = 'challenge-tour-top16';
        else if (snapshot?.developmentTour?.slice(0,16).includes(key)) region.exemptions[key] = 'development-tour-top16';
    }
    if (edition.vacancies < 16) edition.diagnostics.push('fewer-than-16-vacancies');
    return editions[year] = existing ? Object.assign(existing, edition) : edition;
}
function getPdcQSchoolRankingRow(region, stage, key) {
    const table = stage === 'first' ? region.firstRanking : region.finalRanking;
    return table[key] ||= { key, points: 0, won: 0, lost: 0, scored: 0, darts: 0, averagesComplete: true, days: [] };
}
function comparePdcQSchoolRows(a, b) {
    const base = b.points - a.points || (b.won - b.lost) - (a.won - a.lost) || b.won - a.won;
    if (base) return base;
    if (a.averageComparable !== false && b.averageComparable !== false && a.averagesComplete && b.averagesComplete && a.darts > 0 && b.darts > 0)
        return (b.scored * a.darts - a.scored * b.darts) / (a.darts * b.darts);
    return 0;
}
function getPdcQSchoolRanking(region, stage, excluded = []) {
    const table = stage === 'first' ? region.firstRanking : region.finalRanking;
    const omit = new Set(excluded);
    const rows = Object.values(table).filter(row => !omit.has(row.key) && (stage !== 'final' || !region.rankingIneligible?.[row.key]));
    const groups = new Map();
    for (const row of rows) {
        const group = `${row.points}:${row.won-row.lost}:${row.won}`;
        if (!groups.has(group)) groups.set(group,[]);
        groups.get(group).push(row);
    }
    for (const group of groups.values()) {
        const reliable = group.every(row => row.averagesComplete && row.darts > 0);
        group.forEach(row => row.averageComparable = reliable);
    }
    return rows.sort((a,b) => comparePdcQSchoolRows(a,b) || a.key.localeCompare(b.key));
}

function selectPdcQSchoolRankingPlaces(edition, zone, stage, places, excluded, purpose, candidates = getPdcTourCardPlayers()) {
    const region = edition[zone], rows = getPdcQSchoolRanking(region, stage, excluded);
    if (places <= 0) return [];
    if (rows.length <= places) return rows.map(row => row.key);
    const cutoff = rows[places - 1];
    const tied = rows.filter(row => comparePdcQSchoolRows(row, cutoff) === 0);
    if (tied.length <= 1) return rows.slice(0,places).map(row => row.key);
    const better = rows.filter(row => comparePdcQSchoolRows(row, cutoff) < 0), needed = places - better.length;
    const signature = `${purpose}:${tied.map(row => row.key).sort().join(',')}:${needed}`;
    let saved = region.playoffResults[signature];
    if (!saved) {
        if (typeof simulateAImatch !== 'function') throw new Error('Q-School playoff requires the match engine');
        const byKey = new Map(candidates.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
        const remaining = tied.map(row => row.key).sort(), matches = [];
        // A fixed pairing order only constructs the playoff draw. Every eliminated
        // player loses an actual FT5/FT6 match; no random ranking tie-break exists.
        let cursor = 0;
        while (remaining.length > needed) {
            const i = cursor % remaining.length, j = (i + 1) % remaining.length;
            const p1 = byKey.get(remaining[i]), p2 = byKey.get(remaining[j]);
            if (!p1 || !p2) throw new Error('Q-School playoff player missing');
            const result = simulateAImatch(p1, p2, { type: 'legs', legsToWin: stage === 'first' ? 5 : 6 });
            const winner = getPdcTourCardPlayerKey(result.winner), loser = winner === remaining[i] ? remaining[j] : remaining[i];
            matches.push({ p1: remaining[i], p2: remaining[j], winner, p1Score: result.p1Score, p2Score: result.p2Score,
                p1Avg: result.p1Avg, p2Avg: result.p2Avg });
            remaining.splice(remaining.indexOf(loser),1); cursor++;
        }
        saved = region.playoffResults[signature] = { winners: remaining, matches, stage, purpose };
    }
    return [...better.map(row => row.key), ...saved.winners];
}

function getPdcQSchoolDayParticipants(tournament, candidates = getPdcTourCardPlayers()) {
    const year = Number(tournament.qSchoolYear) || getPdcTourCardReferenceYear(), edition = getPdcQSchoolEdition(year);
    const region = edition[tournament.qSchoolZone], stage = tournament.qSchoolStage, day = Number(tournament.qSchoolDay);
    const byKey = new Map(uniquePdcTourCardPlayers(stage === 'final' ? getPdcTourCardPlayers() : candidates)
        .map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    const eligible = key => byKey.has(key) && isPdcQSchoolEntrant(byKey.get(key), year)
        && (stage !== 'final' || !region.directCards.includes(key));
    let keys;
    if (stage === 'first') keys = region.entrants.filter(key => eligible(key) && !region.exemptions[key] && !region.firstDirect.includes(key));
    else {
        if (!region.finalField) {
            const automatic = [...new Set([...Object.keys(region.exemptions), ...region.firstDirect])].filter(eligible);
            if (automatic.length > 128) edition.diagnostics.push(`${tournament.qSchoolZone}:more-than-128-automatic`);
            const extra = selectPdcQSchoolRankingPlaces(edition, tournament.qSchoolZone, 'first', Math.max(0,128 - automatic.length),
                [...automatic, ...region.entrants.filter(key => !eligible(key))], 'final-field', candidates);
            region.finalField = [...automatic, ...extra];
        }
        keys = region.finalField.filter(eligible);
        const reserves = getPdcQSchoolRanking(region, 'first', [...keys, ...region.firstDirect, ...Object.keys(region.exemptions),
            ...region.entrants.filter(key => !eligible(key))]);
        if (keys.length < 128 && reserves.length) {
            const extra = selectPdcQSchoolRankingPlaces(edition, tournament.qSchoolZone, 'first', 128 - keys.length,
                [...keys, ...region.firstDirect, ...Object.keys(region.exemptions), ...region.entrants.filter(key => !eligible(key))], `reserve-day-${day}`, candidates);
            keys.push(...extra); region.finalField = [...new Set([...region.finalField, ...extra])];
        }
        keys = keys.slice(0,128);
        if (keys.length < 128 && !edition.diagnostics.includes(`${tournament.qSchoolZone}:final-field-short`)) edition.diagnostics.push(`${tournament.qSchoolZone}:final-field-short`);
    }
    const days = stage === 'first' ? region.firstDays : region.finalDays;
    if (!days[day]) days[day] = { participants: keys, matches: {}, qualified: [], completed: false };
    const available = new Map(candidates.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    return days[day].participants.filter(key => eligible(key) && available.has(key)).map(key => available.get(key));
}

function confirmPdcQSchoolAllocations(edition, candidates = getPdcTourCardPlayers(), registrations = {}) {
    if (edition.allocations) return edition.allocations;
    const byKey = new Map(candidates.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    const counts = {};
    for (const zone of ['UK','EU']) {
        const region = edition[zone];
        const registered = registrations[zone] || Object.keys(region.exemptions).filter(key => {
            const candidate = byKey.get(key);
            return candidate && isPdcQSchoolEntrant(candidate, edition.year)
                && (typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate));
        });
        // First Stage participants are already known; Final-only entrants are
        // registered before either region starts playing. Later reserves have
        // already competed in First Stage and cannot change this denominator.
        counts[zone] = [...new Set([...region.attendance, ...registered])].length;
    }
    edition.allocationParticipants = counts;
    edition.allocationConfirmedBeforeFinal = !['UK','EU'].some(zone => Object.values(edition[zone].finalDays)
        .some(day => Object.keys(day.matches || {}).length || day.completed));
    edition.allocationConfirmedAt = currentDate.toISOString();
    edition.allocations = allocatePdcQSchoolPlaces(edition.vacancies, counts.UK, counts.EU);
    if (!edition.allocationConfirmedBeforeFinal) edition.diagnostics.push('allocation-migrated-mid-final');
    return edition.allocations;
}

function auditPdcQSchoolFinalAttendance(edition, zone, day, participants, candidates = getPdcTourCardPlayers()) {
    const region = edition[zone], state = region.finalDays[day];
    if (!state) return;
    const present = new Set(participants.map(getPdcTourCardPlayerKey));
    const byKey = new Map(candidates.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    state.attendance = [...present];
    for (const key of state.participants) {
        if (present.has(key) || region.directCards.includes(key)) continue;
        const candidate = byKey.get(key);
        if (candidate) disqualifyPdcQSchoolRanking(candidate, edition, zone, 'missed-final-day', Number(day));
    }
}

function registerPdcQSchoolDayAttendance(tournament, participants) {
    if (!tournament.qSchoolStage) return;
    const edition = getPdcQSchoolEdition(tournament.qSchoolYear), region = edition[tournament.qSchoolZone];
    const stage = tournament.qSchoolStage, day = tournament.qSchoolDay;
    const state = (stage === 'first' ? region.firstDays : region.finalDays)[day];
    if (!state) return;
    const real = uniquePdcTourCardPlayers(participants);
    if (stage === 'final') {
        confirmPdcQSchoolAllocations(edition, getPdcTourCardPlayers(), { [tournament.qSchoolZone]: real.map(getPdcTourCardPlayerKey) });
        auditPdcQSchoolFinalAttendance(edition, tournament.qSchoolZone, day, real);
    }
    for (const candidate of real) {
        const key = getPdcTourCardPlayerKey(candidate);
        if (!region.attendance.includes(key)) region.attendance.push(key);
        const row = getPdcQSchoolRankingRow(region, stage, key);
        if (!row.days.includes(day)) row.days.push(day);
    }
    const size = getPdcQSchoolOpeningRound(real.length, stage === 'first' ? 32 : 128);
    state.firstScoringRound = real.length === size ? size : size / 2;
}

function recordPdcQSchoolMatch(tournament, round, p1, p2, result) {
    if (!tournament.qSchoolStage || p1?.isBye || p2?.isBye) return;
    const edition = getPdcQSchoolEdition(tournament.qSchoolYear), region = edition[tournament.qSchoolZone], stage = tournament.qSchoolStage;
    const day = (stage === 'first' ? region.firstDays : region.finalDays)[tournament.qSchoolDay];
    if (!day) return;
    const k1 = getPdcTourCardPlayerKey(p1), k2 = getPdcTourCardPlayerKey(p2), key = `${round}:${k1}:${k2}`;
    if (day.matches[key]) return;
    const target = stage === 'first' ? 5 : 6;
    const s1 = Number(result.p1Score), s2 = Number(result.p2Score);
    const winner = getPdcTourCardPlayerKey(result.winner), r1 = getPdcQSchoolRankingRow(region,stage,k1), r2 = getPdcQSchoolRankingRow(region,stage,k2);
    const score1 = Number.isFinite(s1) ? s1 : winner === k1 ? target : 0;
    const score2 = Number.isFinite(s2) ? s2 : winner === k2 ? target : 0;
    day.matches[key] = { round, p1:k1, p2:k2, winner, p1Score:score1, p2Score:score2,
        p1Scored:result.p1Scored, p2Scored:result.p2Scored, p1Darts:result.p1Darts, p2Darts:result.p2Darts };
    r1.won += score1; r1.lost += score2; r2.won += score2; r2.lost += score1;
    if (round <= (stage === 'first' ? day.firstScoringRound : 64)) (winner === k1 ? r1 : r2).points++;
    for (const [row, side] of [[r1,'p1'],[r2,'p2']]) {
        const darts = Number(result[`${side}Darts`]), scored = Number(result[`${side}Scored`]);
        if (darts > 0 && Number.isFinite(scored)) { row.darts += darts; row.scored += scored; }
        else row.averagesComplete = false;
    }
}

function allocatePdcQSchoolPlaces(vacancies, ukParticipants, euParticipants, directCards = 16) {
    const total = Math.max(0, Number(vacancies) || 0), ranking = Math.max(0,total - directCards), population = ukParticipants + euParticipants;
    if (!population) return { UK:0, EU:0, rankingUK:0, rankingEU:0, direct:directCards };
    const uk = ranking * ukParticipants / population, eu = ranking * euParticipants / population;
    let rankingUK = Math.floor(uk), rankingEU = Math.floor(eu);
    if (rankingUK + rankingEU < ranking) {
        if (uk - rankingUK >= eu - rankingEU) rankingUK++; else rankingEU++;
    }
    return { UK:8 + rankingUK, EU:8 + rankingEU, rankingUK, rankingEU, direct:directCards };
}

function awardPdcQSchoolCard(candidate, edition) {
    if (!candidate || hasPdcTourCardForYear(candidate, edition.year) || isPdcParticipationRestricted(candidate, edition.year)) return false;
    if (getPdcTourCardHolders().length >= getPdcTourCardTotalPlaces()) {
        if (!edition.diagnostics.includes('card-capacity-reached')) edition.diagnostics.push('card-capacity-reached');
        return false;
    }
    setPdcTourCard(candidate, 'qschool', edition.year);
    resetPdcNewCardOrderOfMerit(candidate, currentDate);
    return true;
}

function completePdcQSchoolDay(tournament, survivors, candidates = getPdcTourCardPlayers()) {
    const edition = getPdcQSchoolEdition(tournament.qSchoolYear, candidates), region = edition[tournament.qSchoolZone], stage = tournament.qSchoolStage;
    const day = (stage === 'first' ? region.firstDays : region.finalDays)[tournament.qSchoolDay];
    if (!day || day.completed) return day?.qualified || [];
    const qualified = uniquePdcTourCardPlayers(survivors).map(getPdcTourCardPlayerKey);
    day.qualified = qualified; day.completed = true; tournament.completed = true;
    tournament.qSchoolQualifiedPlayerIds = qualified;
    tournament.qSchoolDayOutcome = stage;
    if (stage === 'first') region.firstDirect = [...new Set([...region.firstDirect, ...qualified])];
    else {
        for (const candidate of uniquePdcTourCardPlayers(survivors)) if (awardPdcQSchoolCard(candidate, edition)) region.directCards.push(getPdcTourCardPlayerKey(candidate));
        if (['UK','EU'].every(zone => [1,2,3,4].every(d => edition[zone].finalDays[d]?.completed))) finishPdcQSchoolEdition(edition, candidates);
    }
    if (typeof renderPdcQSchoolOverview === 'function') renderPdcQSchoolOverview();
    return qualified;
}
function finishPdcQSchoolEdition(edition, candidates = getPdcTourCardPlayers()) {
    if (edition.completed) return edition;
    const actualDirect = edition.UK.directCards.length + edition.EU.directCards.length;
    if (actualDirect !== 16) edition.diagnostics.push('fewer-than-16-direct-card-winners');
    // Save migration can lack the new confirmation record. Freeze once, never
    // recompute a confirmed allocation from the last Final Stage day's attendance.
    confirmPdcQSchoolAllocations(edition, candidates);
    const byKey = new Map(candidates.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    for (const zone of ['UK','EU']) {
        const region = edition[zone];
        for (const [d, state] of Object.entries(region.finalDays)) if (state.completed)
            auditPdcQSchoolFinalAttendance(edition, zone, d, (state.attendance || Object.values(region.finalRanking)
                .filter(row => row.days.includes(Number(d))).map(row => row.key)).map(key => byKey.get(key)).filter(Boolean), candidates);
        const excluded = region.entrants.filter(key => !byKey.has(key) || hasPdcTourCardForYear(byKey.get(key), edition.year)
            || !isPdcQSchoolEntrant(byKey.get(key), edition.year)
            // A reserve starts when called up; all remaining scheduled days must be played.
            || ![1,2,3,4].filter(d => region.finalDays[d]?.participants.includes(key)).every(d => region.finalRanking[key]?.days.includes(d)));
        const quota = edition.allocations[`ranking${zone}`];
        const keys = selectPdcQSchoolRankingPlaces(edition, zone, 'final', quota, excluded, 'tour-cards', candidates);
        for (const key of keys) if (awardPdcQSchoolCard(byKey.get(key), edition)) region.rankingCards.push(key);
        if (region.rankingCards.length < quota) edition.diagnostics.push(`${zone}:ranking-card-field-short`);
    }
    const holders = getPdcTourCardHolders(candidates, edition.year).length;
    if (holders !== getPdcTourCardTotalPlaces()) edition.diagnostics.push(`active-cards:${holders}/${getPdcTourCardTotalPlaces()}`);
    edition.completed = true;
    return edition;
}

function getPdcQSchoolCalendarStart(calendar, year) {
    let start = year === 2026 ? new Date(year,0,5) : new Date(year,0,4);
    if (year !== 2026) while (start.getDay() !== 1) start.setDate(start.getDate()+1);
    // A World Championship crossing into January must finish before card trials.
    for (const event of calendar) {
        if (!/world darts championship|global darts championship/i.test(`${event.name} ${event.sourceName || ''}`)) continue;
        if (event.month === 11 && event.endMonth === 0) {
            const after = new Date(year,0,(Number(event.endDay)||3)+2);
            if (after > start) start = after;
        }
    }
    const overlaps = date => calendar.some(event => event.specialType !== 'pdcQSchool' && event.month === date.getMonth()
        && event.day <= date.getDate() && (Number(event.endDay)||event.day) >= date.getDate());
    for (let attempt=0; attempt<365; attempt++) {
        if (!Array.from({length:7},(_,i) => new Date(start.getFullYear(),start.getMonth(),start.getDate()+i)).some(overlaps)) return start;
        start.setDate(start.getDate()+1);
    }
    throw new Error('No available week for annual Q-School');
}

function ensurePdcQSchoolCalendar(calendar = tournamentDatabase, referenceDate = currentDate, options = {}) {
    if (typeof applyCompetitionCalendarNames === 'function') applyCompetitionCalendarNames(calendar);
    if (!Array.isArray(calendar) || !isPdcTourCardSystemEnabled()
        || (typeof isCareerEditorCalendarEmpty === 'function' && isCareerEditorCalendarEmpty())) return calendar;
    const year = getPdcTourCardReferenceYear(referenceDate);
    let root = calendar.find(event => event.specialType === 'pdcQSchool' && (!event.qSchoolStage || event.qSchoolRoot));
    if (!root || (typeof hasTournamentEditorQualification === 'function' && hasTournamentEditorQualification(root)) || root.editorModified) return calendar;
    const editions = getPdcQSchoolEditions(), saved = editions[year];
    const inProgress = options.activeTournament?.specialType === 'pdcQSchool' && !options.activeTournament.qSchoolStage;
    if (!root.qSchoolStage && (root.completed || inProgress || options.legacy)) {
        editions[year] ||= { version:1, year, legacy:true, completed:root.completed === true };
        root.qSchoolYear = year; root.cycleEveryYears = 1;
        return calendar;
    }
    if (saved?.legacy && root.qSchoolYear === year) return calendar;
    const start = getPdcQSchoolCalendarStart(calendar,year);
    for (const zone of ['UK','EU']) for (let i=0;i<7;i++) {
        const stage = i<3 ? 'first' : 'final', day = i<3 ? i+1 : i-2;
        let event = zone === 'UK' && i===0 ? root : calendar.find(candidate => candidate.qSchoolZone===zone && candidate.qSchoolStage===stage && candidate.qSchoolDay===day);
        if (!event) {
            event = { name:`${zone} ${typeof competitionName==='function'?competitionName('pdcQSchool'):'Pro Card Trials'} · ${stage === 'first' ? 'First' : 'Final'} Stage · Day ${day}`,
                sourceName:`${zone} Q-School · ${stage === 'first' ? 'First' : 'Final'} Stage · Day ${day}`,
                sourceName:`${zone} Q-School · ${stage === 'first' ? 'First' : 'Final'} Stage · Day ${day}`,
                specialType:'pdcQSchool', format:'legs', minOvr:0, historyLogs:'', completed:false };
            calendar.push(event);
        }
        const date = new Date(year,start.getMonth(),start.getDate()+i);
        Object.assign(event,{ qSchoolRoot:event===root, qSchoolYear:year, qSchoolZone:zone, qSchoolStage:stage, qSchoolDay:day,
            month:date.getMonth(), day:date.getDate(), endDay:date.getDate(), endMonth:date.getMonth(),
            city:zone==='UK'?'Milton Keynes':'Kalkar', country:zone==='UK'?'Anglia':'Niemcy', cycleEveryYears:1 });
        if (event===root) event.qSchoolDisplayName = `UK ${typeof competitionName==='function'?competitionName('pdcQSchool'):'Pro Card Trials'} · First Stage · Day 1`;
    }
    return calendar;
}

function isCareerPlayerEligibleForPdcQSchoolDay(tournament) {
    if (!tournament.qSchoolStage) return !player.hasTourCard;
    const year = tournament.qSchoolYear || getPdcTourCardReferenceYear();
    if (!isPdcQSchoolEntrant(player, year)) return false;
    const edition = getPdcQSchoolEdition(year), key = getPdcTourCardPlayerKey(player);
    if (getPdcQSchoolZone(player, edition) !== tournament.qSchoolZone) return false;
    const region = edition[tournament.qSchoolZone];
    if (tournament.qSchoolStage === 'first') return !region.exemptions[key] && !region.firstDirect.includes(key);
    if (region.directCards.includes(key)) return false;
    if (region.exemptions[key] || region.firstDirect.includes(key)) return true;
    if (![1,2,3].every(day => region.firstDays[day]?.completed)) return false;
    const eventDate = new Date(year,tournament.month,tournament.day);
    if (eventDate <= currentDate) return getPdcQSchoolDayParticipants(tournament).some(candidate => getPdcTourCardPlayerKey(candidate) === key);
    return region.finalField?.includes(key) || Boolean(region.firstRanking[key]);
}

if (typeof tournamentDatabase !== 'undefined') ensurePdcQSchoolCalendar(tournamentDatabase, currentDate);
