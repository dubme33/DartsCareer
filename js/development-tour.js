const DEVELOPMENT_TOUR_TYPE = 'developmentTour';
const DEVELOPMENT_TOUR_VISIBLE_NAME = 'Future Champions Circuit';
const DEVELOPMENT_TOUR_MIN_AGE = 16;
const DEVELOPMENT_TOUR_MAX_AGE = 23;
const DEVELOPMENT_TOUR_OOM_CUTOFF = 64;
const DEVELOPMENT_TOUR_EVENT_PRIZES = Object.freeze({ 2: 2000, 4: 1000, 8: 750, 16: 350, 32: 250, 64: 100 });

const DEVELOPMENT_TOUR_TEXT = Object.freeze({
    pl: Object.freeze({
        tableName: 'Tabela Future Champions',
        modTableName: 'Tabela {tour}',
        guide: 'Ranking obejmuje wyłącznie nagrody zdobyte w {tour}. Cykl jest dostępny dla graczy, którzy na początku roku mają 16–23 lata i nie zajmują miejsca w TOP 64 głównego OOM. Nagrody nie wpływają na pozostałe rankingi.',
        player: 'Zawodnik',
        money: 'Nagrody',
        empty: 'Ranking jest pusty. Pierwsze nagrody pojawią się po rozpoczęciu cyklu.'
    }),
    en: Object.freeze({
        tableName: 'Future Champions table',
        modTableName: '{tour} table',
        guide: 'The ranking includes only prize money earned on the {tour}. The circuit is open to players aged 16–23 at the start of the year who are outside the main OOM Top 64. Prize money does not affect other rankings.',
        player: 'Player',
        money: 'Prize money',
        empty: 'The ranking is empty. The first earnings will appear after the circuit begins.'
    }),
    de: Object.freeze({
        tableName: 'Future-Champions-Tabelle',
        modTableName: '{tour}-Tabelle',
        guide: 'Die Rangliste umfasst nur Preisgeld aus der {tour}. Spielberechtigt sind zu Jahresbeginn 16- bis 23-Jährige außerhalb der Top 64 der Haupt-OOM. Das Preisgeld zählt für keine andere Rangliste.',
        player: 'Spieler',
        money: 'Preisgeld',
        empty: 'Die Rangliste ist leer. Die ersten Preisgelder erscheinen nach dem Start der Serie.'
    }),
    nl: Object.freeze({
        tableName: 'Future Champions-stand',
        modTableName: '{tour}-stand',
        guide: 'De ranglijst bevat alleen prijzengeld uit de {tour}. De reeks is voor spelers die aan het begin van het jaar 16–23 zijn en buiten de Top 64 van de hoofd-OOM staan. Het prijzengeld telt niet mee voor andere ranglijsten.',
        player: 'Speler',
        money: 'Prijzengeld',
        empty: 'De ranglijst is leeg. De eerste verdiensten verschijnen zodra de cyclus begint.'
    })
});

function getDevelopmentTourCompetitionDisplayName() {
    const tournaments = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase
        : [];
    const event = tournaments.find(candidate => candidate?.specialType === DEVELOPMENT_TOUR_TYPE)
        || tournaments.find(candidate => /future champions circuit|development tour/i.test(`${candidate?.name || ''} ${candidate?.sourceName || ''}`));
    const eventName = String(event?.name || DEVELOPMENT_TOUR_VISIBLE_NAME).trim();
    return eventName
        .replace(/\s*[-–—]?\s*(?:event|turniej|veranstaltung|toernooi)\s*#?\d+\s*$/i, '')
        .replace(/\s+\d+\s*$/, '')
        .trim() || DEVELOPMENT_TOUR_VISIBLE_NAME;
}

function trDevelopmentTour(key) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const dictionary = DEVELOPMENT_TOUR_TEXT[language] || DEVELOPMENT_TOUR_TEXT.pl;
    const tourName = getDevelopmentTourCompetitionDisplayName();
    const usesModdedName = tourName.toLocaleLowerCase('pl') !== DEVELOPMENT_TOUR_VISIBLE_NAME.toLocaleLowerCase('pl');
    const translationKey = key === 'tableName' && usesModdedName ? 'modTableName' : key;
    const text = dictionary[translationKey] || DEVELOPMENT_TOUR_TEXT.pl[translationKey] || key;
    return text.replaceAll('{tour}', tourName);
}

function getDevelopmentTourSearchableName(tournamentOrName) {
    if (tournamentOrName && typeof tournamentOrName === 'object') {
        return `${tournamentOrName.name || ''} ${tournamentOrName.sourceName || ''}`.toLocaleLowerCase('pl');
    }
    const name = String(tournamentOrName || '');
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === name || candidate?.sourceName === name)
        : null;
    return `${name} ${tournament?.name || ''} ${tournament?.sourceName || ''}`.toLocaleLowerCase('pl');
}

function isDevelopmentTourTournament(tournamentOrName = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    if (tournamentOrName && typeof tournamentOrName === 'object'
        && tournamentOrName.specialType === DEVELOPMENT_TOUR_TYPE) return true;
    const name = getDevelopmentTourSearchableName(tournamentOrName);
    return name.includes('future champions circuit') || name.includes('development tour');
}

function getDevelopmentTourReferenceYear(referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    const date = referenceDate instanceof Date
        ? referenceDate
        : referenceDate ? new Date(referenceDate) : new Date(2026, 0, 1);
    return Number.isNaN(date.getTime()) ? 2026 : date.getFullYear();
}

function getDevelopmentTourSeasonAge(candidate, referenceDate) {
    const birthYear = Number(candidate?.birthYear);
    return Number.isInteger(birthYear) ? getDevelopmentTourReferenceYear(referenceDate) - birthYear : null;
}

function getDevelopmentTourPlayerKey(candidate) {
    if (!candidate || candidate.isBye) return '';
    return candidate.id || `${candidate.sourceName || candidate.name || ''}|${candidate.country || ''}`;
}

function getDevelopmentTourPrizeMoney(candidate) {
    return Math.max(0, Number(candidate?.developmentTourPrizeMoney) || 0);
}

function compareDevelopmentTourOrderOfMerit(first, second) {
    return getDevelopmentTourPrizeMoney(second) - getDevelopmentTourPrizeMoney(first)
        || (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getDevelopmentTourActivePlayers(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const unique = new Map();
    source.forEach(candidate => {
        if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return;
        if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return;
        const key = getDevelopmentTourPlayerKey(candidate);
        if (key && !unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function getDevelopmentTourTop64PlayerKeys(candidates) {
    return new Set(getDevelopmentTourActivePlayers(candidates)
        .sort((first, second) => (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
            || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
            || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl'))
        .slice(0, DEVELOPMENT_TOUR_OOM_CUTOFF)
        .map(getDevelopmentTourPlayerKey));
}

function getDevelopmentTourEligiblePlayers(candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : null)) {
    const active = getDevelopmentTourActivePlayers(candidates);
    const top64 = getDevelopmentTourTop64PlayerKeys(active);
    return active.filter(candidate => {
        const age = getDevelopmentTourSeasonAge(candidate, referenceDate);
        return age >= DEVELOPMENT_TOUR_MIN_AGE && age <= DEVELOPMENT_TOUR_MAX_AGE
            && !top64.has(getDevelopmentTourPlayerKey(candidate));
    }).sort(compareDevelopmentTourOrderOfMerit);
}

function isDevelopmentTourEligiblePlayer(candidate, candidates, referenceDate) {
    const key = getDevelopmentTourPlayerKey(candidate);
    return Boolean(key && getDevelopmentTourEligiblePlayers(candidates, referenceDate)
        .some(eligible => getDevelopmentTourPlayerKey(eligible) === key));
}

function getDevelopmentTourOrderOfMerit(candidates, { includeZero = false } = {}) {
    return getDevelopmentTourActivePlayers(candidates)
        .filter(candidate => includeZero || getDevelopmentTourPrizeMoney(candidate) > 0)
        .sort(compareDevelopmentTourOrderOfMerit);
}

function awardDevelopmentTourPrizeMoney(candidate, amount) {
    const prize = Math.max(0, Number(amount) || 0);
    if (!candidate || candidate.isBye || prize <= 0) return 0;
    candidate.developmentTourPrizeMoney = getDevelopmentTourPrizeMoney(candidate) + prize;
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('developmentTour');
    return prize;
}

function resetDevelopmentTourOrderOfMerit(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const previousYear = typeof currentDate !== 'undefined' && currentDate instanceof Date
        ? currentDate.getFullYear() - 1
        : null;
    source.forEach(candidate => {
        if (candidate && !candidate.isBye) {
            if (previousYear === null || candidate.previousDevelopmentTourYear !== previousYear) {
                candidate.previousDevelopmentTourPrizeMoney = getDevelopmentTourPrizeMoney(candidate);
                candidate.previousDevelopmentTourYear = previousYear;
            }
            candidate.developmentTourPrizeMoney = 0;
        }
    });
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('developmentTour');
}

function getDevelopmentTourEventPrize(round, won) {
    if (won && Number(round) === 2) return 3000;
    return DEVELOPMENT_TOUR_EVENT_PRIZES[Number(round)] || 0;
}

function renderDevelopmentTourRanking(list) {
    if (!list) return;
    const candidates = typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : [];
    const rows = getDevelopmentTourOrderOfMerit(candidates);
    const guide = `<div class="ranking-points-guide" role="note">ℹ️ ${escapeHtml(trDevelopmentTour('guide'))}</div>`;
    if (!rows.length) {
        list.innerHTML = `${guide}<div style="text-align:center; margin-top:40px; color:#bdc3c7;">${escapeHtml(trDevelopmentTour('empty'))}</div>`;
        return;
    }

    let html = `${guide}<div style="border-bottom:2px solid var(--accent-green); padding:5px 10px; display:flex; font-size:12px; color:#bdc3c7; font-weight:bold; background:#0f3460;"><div style="flex:3;">${escapeHtml(trDevelopmentTour('player'))}</div><div style="flex:1; text-align:right;">${escapeHtml(trDevelopmentTour('money'))}</div></div>`;
    rows.forEach((candidate, index) => {
        const isMe = typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
        html += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(candidate.id || '')}" style="border-bottom:1px solid var(--border-color); ${isMe ? 'background:rgba(39,174,96,.2);' : ''}"><div style="flex:3;"><strong>#${index + 1}</strong> ${getFlagImg(candidate.country)} ${escapeHtml(candidate.name)} ${isMe ? '<b style="color:var(--accent-green)">(TY)</b>' : ''}</div><div style="flex:1; text-align:right; color:#f1c40f; font-weight:bold;">£${getDevelopmentTourPrizeMoney(candidate).toLocaleString('en-GB')}</div></button>`;
    });
    list.innerHTML = html;
}
