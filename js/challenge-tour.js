const CHALLENGE_TOUR_TYPE = 'challengeTour';
const CHALLENGE_TOUR_VISIBLE_NAME = 'Rising Stars Circuit';
const CHALLENGE_TOUR_EVENT_PRIZES = Object.freeze({ 2: 2000, 4: 1000, 8: 750, 16: 350, 32: 250, 64: 100 });

const CHALLENGE_TOUR_TEXT = Object.freeze({
    pl: Object.freeze({
        tableName: 'Tabela Rising Stars',
        modTableName: 'Tabela {tour}',
        guide: 'Ranking obejmuje wyłącznie nagrody zdobyte w {tour}. Nie wpływa na główny OOM ani ProTour OOM i ustala kolejność rezerwowych do Players Championship. Dwaj najwyżej sklasyfikowani zawodnicy bez karty otrzymują na koniec sezonu dwuletnią kartę PDC.',
        player: 'Zawodnik',
        money: 'Nagrody',
        empty: 'Ranking jest pusty. Pierwsze nagrody pojawią się po rozpoczęciu cyklu.'
    }),
    en: Object.freeze({
        tableName: 'Rising Stars table',
        modTableName: '{tour} table',
        guide: 'The ranking includes only prize money earned on the {tour}. It does not affect the main or ProTour OOM and determines the Players Championship reserve order. The two highest-ranked players without a card earn a two-year PDC Tour Card at the end of the season.',
        player: 'Player',
        money: 'Prize money',
        empty: 'The ranking is empty. The first earnings will appear after the circuit begins.'
    }),
    de: Object.freeze({
        tableName: 'Rising-Stars-Tabelle',
        modTableName: '{tour}-Tabelle',
        guide: 'Die Rangliste umfasst nur Preisgeld aus der {tour}. Sie zählt weder für die Haupt- noch die ProTour-Rangliste und bestimmt die Ersatzreihenfolge für die Players Championship. Die zwei bestplatzierten Spieler ohne Karte erhalten am Saisonende eine zweijährige PDC Tour Card.',
        player: 'Spieler',
        money: 'Preisgeld',
        empty: 'Die Rangliste ist leer. Die ersten Preisgelder erscheinen nach dem Start der Serie.'
    }),
    nl: Object.freeze({
        tableName: 'Rising Stars-stand',
        modTableName: '{tour}-stand',
        guide: 'De ranglijst bevat alleen prijzengeld uit de {tour}. Dit telt niet mee voor de hoofd- of ProTour-ranglijst en bepaalt de reservelijst voor de Players Championship. De twee hoogst geklasseerde spelers zonder kaart verdienen aan het einde van het seizoen een PDC Tour Card voor twee jaar.',
        player: 'Speler',
        money: 'Prijzengeld',
        empty: 'De ranglijst is leeg. De eerste verdiensten verschijnen zodra de cyclus begint.'
    })
});

function getChallengeTourCompetitionDisplayName() {
    const tournaments = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase
        : [];
    const event = tournaments.find(candidate => candidate?.specialType === CHALLENGE_TOUR_TYPE)
        || tournaments.find(candidate => /rising stars circuit|challenge tour/i.test(`${candidate?.name || ''} ${candidate?.sourceName || ''}`));
    const eventName = String(event?.name || CHALLENGE_TOUR_VISIBLE_NAME).trim();
    return eventName
        .replace(/\s*[-–—]?\s*(?:event|turniej|veranstaltung|toernooi)\s*#?\d+\s*$/i, '')
        .replace(/\s+\d+\s*$/, '')
        .trim() || CHALLENGE_TOUR_VISIBLE_NAME;
}

function trChallengeTour(key) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const dictionary = CHALLENGE_TOUR_TEXT[language] || CHALLENGE_TOUR_TEXT.pl;
    const tourName = getChallengeTourCompetitionDisplayName();
    const usesModdedName = tourName.toLocaleLowerCase('pl') !== CHALLENGE_TOUR_VISIBLE_NAME.toLocaleLowerCase('pl');
    const translationKey = key === 'tableName' && usesModdedName ? 'modTableName' : key;
    const text = dictionary[translationKey] || CHALLENGE_TOUR_TEXT.pl[translationKey] || key;
    return text.replaceAll('{tour}', tourName);
}

function getChallengeTourSearchableName(tournamentOrName) {
    if (tournamentOrName && typeof tournamentOrName === 'object') {
        return `${tournamentOrName.name || ''} ${tournamentOrName.sourceName || ''}`.toLocaleLowerCase('pl');
    }
    const name = String(tournamentOrName || '');
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === name || candidate?.sourceName === name)
        : null;
    return `${name} ${tournament?.name || ''} ${tournament?.sourceName || ''}`.toLocaleLowerCase('pl');
}

function isChallengeTourTournament(tournamentOrName = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    if (tournamentOrName && typeof tournamentOrName === 'object'
        && tournamentOrName.specialType === CHALLENGE_TOUR_TYPE) return true;
    const name = getChallengeTourSearchableName(tournamentOrName);
    return name.includes('rising stars circuit') || name.includes('challenge tour');
}

function getChallengeTourPrizeMoney(candidate) {
    return Math.max(0, Number(candidate?.challengeTourPrizeMoney) || 0);
}

function compareChallengeTourOrderOfMerit(first, second) {
    return getChallengeTourPrizeMoney(second) - getChallengeTourPrizeMoney(first)
        || (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function getChallengeTourEligiblePlayers(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const unique = new Map();
    source.forEach(candidate => {
        if (!candidate || candidate.isBye || candidate.hasTourCard === true || !candidate.name) return;
        if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return;
        const key = candidate.id || `${candidate.sourceName || candidate.name}|${candidate.country || ''}`;
        if (!unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()].sort(compareChallengeTourOrderOfMerit);
}

function getChallengeTourOrderOfMerit(candidates, { includeZero = false } = {}) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const unique = new Map();
    source.forEach(candidate => {
        if (!candidate || candidate.isBye || !candidate.name) return;
        if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return;
        const key = candidate.id || `${candidate.sourceName || candidate.name}|${candidate.country || ''}`;
        if (!unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()]
        .filter(candidate => includeZero || getChallengeTourPrizeMoney(candidate) > 0)
        .sort(compareChallengeTourOrderOfMerit);
}

function awardChallengeTourPrizeMoney(candidate, amount) {
    const prize = Math.max(0, Number(amount) || 0);
    if (!candidate || candidate.isBye || prize <= 0) return 0;
    candidate.challengeTourPrizeMoney = getChallengeTourPrizeMoney(candidate) + prize;
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('challengeTour');
    return prize;
}

function resetChallengeTourOrderOfMerit(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : (typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : []);
    const previousYear = typeof currentDate !== 'undefined' && currentDate instanceof Date
        ? currentDate.getFullYear() - 1
        : null;
    source.forEach(candidate => {
        if (candidate && !candidate.isBye) {
            if (previousYear === null || candidate.previousChallengeTourYear !== previousYear) {
                candidate.previousChallengeTourPrizeMoney = getChallengeTourPrizeMoney(candidate);
                candidate.previousChallengeTourYear = previousYear;
            }
            candidate.challengeTourPrizeMoney = 0;
        }
    });
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('challengeTour');
}

function getChallengeTourEventPrize(round, won) {
    if (won && Number(round) === 2) return 3000;
    return CHALLENGE_TOUR_EVENT_PRIZES[Number(round)] || 0;
}

function renderChallengeTourRanking(list) {
    if (!list) return;
    const candidates = typeof getPdcTourCardPlayers === 'function' ? getPdcTourCardPlayers(true) : [];
    const rows = getChallengeTourOrderOfMerit(candidates);
    const guide = `<div class="ranking-points-guide" role="note">ℹ️ ${escapeHtml(trChallengeTour('guide'))}</div>`;
    if (!rows.length) {
        list.innerHTML = `${guide}<div style="text-align:center; margin-top:40px; color:#bdc3c7;">${escapeHtml(trChallengeTour('empty'))}</div>`;
        return;
    }

    let html = `${guide}<div style="border-bottom:2px solid var(--accent-green); padding:5px 10px; display:flex; font-size:12px; color:#bdc3c7; font-weight:bold; background:#0f3460;"><div style="flex:3;">${escapeHtml(trChallengeTour('player'))}</div><div style="flex:1; text-align:right;">${escapeHtml(trChallengeTour('money'))}</div></div>`;
    rows.forEach((candidate, index) => {
        const isMe = typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
        html += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(candidate.id || '')}" style="border-bottom:1px solid var(--border-color); ${isMe ? 'background:rgba(39,174,96,.2);' : ''}"><div style="flex:3;"><strong>#${index + 1}</strong> ${getFlagImg(candidate.country)} ${escapeHtml(candidate.name)} ${isMe ? '<b style="color:var(--accent-green)">(TY)</b>' : ''}</div><div style="flex:1; text-align:right; color:#f1c40f; font-weight:bold;">£${getChallengeTourPrizeMoney(candidate).toLocaleString('en-GB')}</div></button>`;
    });
    list.innerHTML = html;
}
