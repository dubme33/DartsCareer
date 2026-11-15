/* Dated entries belong to one event edition. Reading a field never rolls attendance. */
const TOURNAMENT_ABSENCE_VERSION = 1;
const TOURNAMENT_ABSENCE_LEAD_DAYS = 3;

function tournamentAbsenceDateKey(date = currentDate) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseTournamentAbsenceDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number), date = new Date(year, month - 1, day);
    return tournamentAbsenceDateKey(date) === value ? date : null;
}
function tournamentAbsenceStartDate(event, date = currentDate) {
    if (!event || !Number.isInteger(event.month) || !Number.isInteger(event.day)) return null;
    const start = new Date(date.getFullYear(), event.month, event.day);
    return start.getMonth() === event.month && start.getDate() === event.day ? start : null;
}
function tournamentAbsenceDaysBefore(event, days, date = currentDate) {
    const start = tournamentAbsenceStartDate(event, date);
    if (!start) return '';
    start.setDate(start.getDate() - days);
    return tournamentAbsenceDateKey(start);
}
function tournamentAbsencePlayerKey(candidate) {
    return candidate && !candidate.isBye ? String(candidate.id || `${candidate.name || ''}|${candidate.country || ''}`) : '';
}
function getTournamentAbsenceRoster() {
    const unique = new Map();
    for (const candidate of [typeof player !== 'undefined' ? player : null,
        ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : [])]) {
        const key = tournamentAbsencePlayerKey(candidate);
        if (key && candidate.name && !candidate.retired && !candidate.isWorldCupGuest
            && !(typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) && !unique.has(key)) unique.set(key, candidate);
    }
    return [...unique.values()];
}
function getTournamentAbsenceState(event, create = false, date = currentDate) {
    if (!event) return null;
    const state = event.tournamentAbsences;
    if (state?.version === TOURNAMENT_ABSENCE_VERSION && state.year === date.getFullYear()
        && Array.isArray(state.entries) && state.generated && typeof state.generated === 'object') return state;
    return create ? event.tournamentAbsences = { version: TOURNAMENT_ABSENCE_VERSION,
        year: date.getFullYear(), entries: [], generated: {} } : null;
}
function getTournamentAbsenceEntries(event, { date = currentDate, includeFuture = false, inherit = true } = {}) {
    const today = tournamentAbsenceDateKey(date);
    const own = (getTournamentAbsenceState(event, false, date)?.entries || [])
        .filter(entry => entry?.playerKey && parseTournamentAbsenceDate(entry.announcedOn)
            && (includeFuture || entry.announcedOn <= today));
    if (!inherit || typeof isContinentalQualifierTournament !== 'function' || !isContinentalQualifierTournament(event)) return own;
    const main = getLinkedContinentalTour(event);
    return [...own, ...getTournamentAbsenceEntries(main, { date, includeFuture, inherit: false })
        .map(entry => ({ ...entry, inherited: true }))];
}
function isTournamentPlayerAbsent(event, candidate, date = currentDate) {
    const key = tournamentAbsencePlayerKey(candidate);
    return Boolean(key && getTournamentAbsenceEntries(event, { date }).some(entry => entry.playerKey === key));
}
function tournamentAbsenceDrawStarted(event) {
    return Boolean(event?.completed || event?.matchHistory?.blocks?.some(block => block?.matches?.length)
        || String(event?.historyLogs || '').trim() || event?.calendarSession
        || (typeof activeTournament !== 'undefined' && activeTournament === event
            && ((typeof currentMatch !== 'undefined' && currentMatch)
                || (typeof tournamentBracket !== 'undefined' && tournamentBracket?.length > 0))));
}
function canManageTournamentAbsences(event, date = currentDate) {
    const start = tournamentAbsenceStartDate(event, date);
    if (!start || tournamentAbsenceDateKey(start) < tournamentAbsenceDateKey(date) || tournamentAbsenceDrawStarted(event)) return false;
    if (typeof isTournamentScheduledForCareerYear === 'function' && !isTournamentScheduledForCareerYear(event, date.getFullYear())) return false;
    return !(typeof isWorldCupTournament === 'function' && isWorldCupTournament(event))
        && !(typeof isWorldCupQualifierTournament === 'function' && isWorldCupQualifierTournament(event))
        && !(typeof isEditorTeamTournament === 'function' && isEditorTeamTournament(event))
        && !(typeof isEditorSeasonLeague === 'function' && isEditorSeasonLeague(event))
        && !(event.specialType === 'worldYouth' && event.worldYouthPhase === 'final');
}
function addTournamentAbsenceEntry(event, candidate, { announcedOn, reason = 'rest', source = 'ai', phase = 'event' }) {
    const state = getTournamentAbsenceState(event, true), key = tournamentAbsencePlayerKey(candidate);
    if (!key || state.entries.some(entry => entry.playerKey === key)) return false;
    state.entries.push({ playerKey: key, name: String(candidate.name || ''), country: String(candidate.country || ''),
        overall: Math.round(Number(candidate.ovr ?? candidate.overall) || 0), announcedOn, reason, source, phase, notified: false });
    return true;
}
function scheduleTournamentAbsence(event, candidate, { announcedOn = tournamentAbsenceDateKey(), reason = 'personal' } = {}) {
    const rosterPlayer = getTournamentAbsenceRoster().find(p => tournamentAbsencePlayerKey(p) === tournamentAbsencePlayerKey(candidate));
    if (!rosterPlayer || !canManageTournamentAbsences(event) || !parseTournamentAbsenceDate(announcedOn)
        || announcedOn < tournamentAbsenceDateKey() || announcedOn > tournamentAbsenceDateKey(tournamentAbsenceStartDate(event))) return false;
    if (!addTournamentAbsenceEntry(event, rosterPlayer, { announcedOn, reason: ['rest','personal','travel'].includes(reason) ? reason : 'personal', source: 'manual' })) return false;
    processTournamentAbsences(currentDate, { generate: false });
    return true;
}
function cancelPendingTournamentAbsence(event, key) {
    const state = getTournamentAbsenceState(event);
    if (!state || !canManageTournamentAbsences(event)) return false;
    const index = state.entries.findIndex(entry => entry.playerKey === key && entry.source === 'manual'
        && entry.announcedOn > tournamentAbsenceDateKey());
    if (index < 0) return false;
    state.entries.splice(index, 1);
    return true;
}
function hasGeneratedTournamentAbsences(event, phase = 'event') {
    return getTournamentAbsenceState(event)?.generated[phase] === true;
}
function getContinentalAbsenceCardQualifier(main) {
    const names = new Set([main?.name, main?.sourceName].filter(Boolean));
    return (typeof tournamentDatabase !== 'undefined' ? tournamentDatabase : []).find(event =>
        typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(event)
        && getContinentalQualifierPath(event) === 'card' && names.has(event.qualifierFor)) || null;
}
function isContinentalAbsenceEntryOpen(main, date = currentDate) {
    if (main?.continentalQualification?.paths?.card?.completed || main?.editorNativeRoutes?.length) return false;
    const qualifier = getContinentalAbsenceCardQualifier(main);
    return qualifier ? !tournamentAbsenceDrawStarted(qualifier)
        && tournamentAbsenceDateKey(date) <= tournamentAbsenceDateKey(tournamentAbsenceStartDate(qualifier, date))
        : tournamentAbsenceDateKey(date) < tournamentAbsenceDaysBefore(main, 21, date);
}
function generateTournamentAbsencePhase(event, phase, candidates, chance, random) {
    const state = getTournamentAbsenceState(event, true);
    if (state.generated[phase]) return false;
    state.generated[phase] = true;
    const today = tournamentAbsenceDateKey(), own = candidate => typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
    const eligible = candidates.filter(candidate => candidate && !candidate.isBye && !own(candidate)
        && !isTournamentPlayerAbsent(event, candidate)
        && (typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate)));
    // Keep two entrants for the small secondary-tour fields, as in the existing attendance model.
    const secondary = phase === 'event' && typeof getSecondaryTourWithdrawalType === 'function' ? getSecondaryTourWithdrawalType(event) : '';
    const wholeField = secondary === 'developmentTour' && typeof getDevelopmentTourEligiblePlayers === 'function'
        ? getDevelopmentTourEligiblePlayers(getTournamentAbsenceRoster()) : candidates;
    let remaining = secondary ? Math.max(0, wholeField.filter(candidate => !isTournamentPlayerAbsent(event,candidate)
        && (typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate))).length - 2) : Infinity;
    const paired = typeof findNextDayTournamentInSameVenue === 'function' && phase === 'event'
        ? findNextDayTournamentInSameVenue(event, undefined, other =>
            (isPlayersChampionshipFloorTournament(event) && isPlayersChampionshipFloorTournament(other))
            || (getSecondaryTourWithdrawalType(event) && getSecondaryTourWithdrawalType(event) === getSecondaryTourWithdrawalType(other))) : null;
    for (const candidate of eligible) {
        if (!remaining || random() >= (typeof chance === 'function' ? chance(candidate) : chance)) continue;
        if (addTournamentAbsenceEntry(event, candidate, { announcedOn: today, phase })) {
            remaining--;
            if (paired && !tournamentAbsenceDrawStarted(paired)) addTournamentAbsenceEntry(paired, candidate, { announcedOn: today, phase });
        }
    }
    return true;
}
function getTournamentAbsenceAICandidates(event) {
    const roster = getTournamentAbsenceRoster().filter(candidate =>
        typeof isCareerEditorAccessEligible !== 'function' || isCareerEditorAccessEligible(event, candidate));
    if (typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(event)) {
        const main = getLinkedContinentalTour(event);
        return main ? buildContinentalQualifierPool(main, getContinentalQualifierPath(event), ensureContinentalQualificationState(main), roster) : [];
    }
    if (typeof hasTournamentEditorQualification === 'function' && hasTournamentEditorQualification(event)
        || typeof hasCareerTourEntryOverride === 'function' && hasCareerTourEntryOverride(event)) return null;
    if (typeof isPlayersChampionshipFloorTournament === 'function' && isPlayersChampionshipFloorTournament(event)) {
        return roster.filter(candidate => candidate.hasTourCard === true)
            .sort((a,b) => (Number(b.prizeMoney)||0)-(Number(a.prizeMoney)||0)).slice(0,20);
    }
    const type = typeof getSecondaryTourWithdrawalType === 'function' ? getSecondaryTourWithdrawalType(event) : '';
    if (type === 'challengeTour' && typeof getChallengeTourEligiblePlayers === 'function') return getChallengeTourEligiblePlayers(roster).sort(compareChallengeTourOrderOfMerit);
    if (type === 'developmentTour' && typeof getDevelopmentTourEligiblePlayers === 'function') return getDevelopmentTourEligiblePlayers(roster)
        .sort(compareDevelopmentTourOrderOfMerit).slice(0,20);
    return null;
}
function notifyTournamentAbsences(event, date = currentDate) {
    if (typeof addEmail !== 'function') return false;
    const entries = getTournamentAbsenceEntries(event, { date, inherit: false }).filter(entry => !entry.notified);
    if (!entries.length) return false;
    const safe = typeof escapeHtml === 'function' ? escapeHtml : value => String(value).replace(/[&<>"']/g,
        c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const tr = typeof trTournamentAbsence === 'function' ? trTournamentAbsence : key => ({ sender:'Tournament Office',
        subject:'Withdrawals: {event}', announced:'Announced', rest:'Rest', personal:'Personal reasons', travel:'Travel', beforeQualifier:'Before the qualifier', beforeEvent:'Before the event' }[key] || key);
    const title = typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(event) : event.name;
    const silentChallenge = typeof getSecondaryTourWithdrawalType === 'function' && getSecondaryTourWithdrawalType(event) === 'challengeTour';
    const reportEntries = entries.filter(entry => entry.source === 'manual' || !silentChallenge);
    const body = reportEntries.map(entry => `<strong>${safe(entry.name)}</strong> — ${safe(tr(entry.reason))}<br>`
        + `${safe(tr('announced'))}: ${safe(entry.announcedOn)}${entry.phase === 'early' ? ` · ${safe(tr('beforeQualifier'))}` : ''}`).join('<br><br>');
    if (reportEntries.length) addEmail(tr('sender'), tr('subject').replace('{event}', title), body);
    entries.forEach(entry => { entry.notified = true; });
    return true;
}
function processTournamentAbsences(date = currentDate, { generate = true, random = Math.random, notify = true } = {}) {
    if (typeof tournamentDatabase === 'undefined' || !tournamentAbsenceDateKey(date)) return { changed: false };
    const today = tournamentAbsenceDateKey(date), events = tournamentDatabase.filter(event => {
        const start = tournamentAbsenceStartDate(event, date);
        return start && tournamentAbsenceDateKey(start) >= today && !tournamentAbsenceDrawStarted(event)
            && (typeof isTournamentScheduledForCareerYear !== 'function' || isTournamentScheduledForCareerYear(event, date.getFullYear()));
    });
    let changed = false;
    // Process automatic ET places first, before generating any qualifier's attendance.
    for (const event of events) {
        if (typeof isContinentalTourTournament !== 'function' || !isContinentalTourTournament(event)) continue;
        const qualifier = getContinentalAbsenceCardQualifier(event);
        const earlyDue = qualifier ? tournamentAbsenceDaysBefore(qualifier, TOURNAMENT_ABSENCE_LEAD_DAYS, date)
            : tournamentAbsenceDaysBefore(event, 24, date);
        if (isContinentalAbsenceEntryOpen(event, date)) {
            if (generate && today >= earlyDue && !hasGeneratedTournamentAbsences(event, 'early')) {
                const state = ensureContinentalQualificationState(event);
                changed = generateTournamentAbsencePhase(event, 'early', resolveContinentalQualificationPlayers(state.oomPlayerIds), .12, random) || changed;
            }
            if (today >= earlyDue && getTournamentAbsenceEntries(event, { date }).length && typeof prepareContinentalTourEarlyAbsences === 'function')
                changed = prepareContinentalTourEarlyAbsences(event, date) || changed;
        }
    }
    for (const event of events) {
        if (today >= tournamentAbsenceDaysBefore(event, TOURNAMENT_ABSENCE_LEAD_DAYS, date)) {
            const continental = typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(event);
            if (continental) {
                if (generate && !hasGeneratedTournamentAbsences(event, 'late')) {
                    const state = ensureContinentalQualificationState(event);
                    // Conditional second roll keeps the original 20% total chance for a seed.
                    const chance = hasGeneratedTournamentAbsences(event, 'early') ? .08 / .88 : .20;
                    changed = generateTournamentAbsencePhase(event, 'late', state.withdrawalsProcessed ? [] : resolveContinentalQualificationPlayers(state.oomPlayerIds), chance, random) || changed;
                }
            } else if (generate && !hasGeneratedTournamentAbsences(event)) {
                const candidates = getTournamentAbsenceAICandidates(event);
                if (candidates) {
                    const qualifier = typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(event);
                    const challenge = typeof getSecondaryTourWithdrawalType === 'function' && getSecondaryTourWithdrawalType(event) === 'challengeTour';
                    const legacyAttendance = Array.isArray(event.playersChampionshipWithdrawals) || Array.isArray(event.secondaryTourWithdrawals);
                    changed = generateTournamentAbsencePhase(event, 'event', legacyAttendance ? [] : candidates,
                        qualifier ? .06 : challenge ? getChallengeTourWithdrawalChance : .30, random) || changed;
                }
            }
        }
        if (typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(event)
            && !isContinentalAbsenceEntryOpen(event, date)
            && event.continentalQualification?.paths?.card?.completed
            && (!event.editorNativeRoutes?.length || ['card','host','nordicBaltic','eastEurope']
                .every(path => event.continentalQualification?.paths?.[path]?.completed))
            && getTournamentAbsenceEntries(event, { date }).length) {
            const before = JSON.stringify(event.continentalQualification.withdrawals || []);
            prepareContinentalTourWithdrawals(event, { refreshInjuries: true, includeRandom: false, completeMissing: false });
            changed = before !== JSON.stringify(event.continentalQualification.withdrawals || []) || changed;
        }
        if (notify) changed = notifyTournamentAbsences(event, date) || changed;
    }
    return { changed };
}
