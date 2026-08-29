// Seasonal clauses are independent of monthly contracts: an accepted bonus
// remains payable after the sponsor's monthly contract expires.
const SPONSOR_GOAL_CONFIG = Object.freeze({ limit: 3, offerBonusPerGoal: 5, historyYears: 10 });
const SPONSOR_GOAL_TEXT = {
    pl: {
        title: 'Cele sponsorskie · {year}', summary: 'Przyjęte cele: {count}/3',
        rules: 'Do 3 celów rocznie u zwykłych sponsorów. Nowe cele przyjmujesz do 30 listopada. Premie są rozliczane przy przejściu do nowego roku, także po wygaśnięciu kontraktu. Brak kar, zmian OVR i pieniędzy do rankingu.',
        futureBonus: 'Każdy wykonany cel daje +5% do stawek nowych zwykłych ofert w następnym roku (maks. +15%).',
        offerBonus: 'Nowe zwykłe oferty w {year}: +{percent}% za cele z poprzedniego sezonu.',
        empty: 'Podpisz zwykły kontrakt z celem lub przyjmij aneks przy obecnym sponsorze.',
        clause: 'Cel sezonowy w kontrakcie', annex: 'Opcjonalny aneks na ten sezon', accept: 'Przyjmij cel',
        rank: 'Zakończ sezon w TOP {target} głównego OOM', wins: 'Wygraj {target} oficjalnych meczów singlowych od przyjęcia celu',
        quarterfinal: 'Osiągnij ćwierćfinał lub lepszy wynik w turnieju głównego OOM od przyjęcia celu',
        reward: 'Premia: {amount} · termin: 31.12.{year}', rankProgress: 'Obecnie #{rank} · cel TOP {target}',
        countProgress: 'Postęp: {count}/{target}', pending: 'W trakcie', reached: 'Cel osiągnięty · premia na koniec roku',
        provisional: 'Obecnie w wymaganym TOP · liczy się ranking 31 grudnia', completed: 'Wykonany · wypłacono {amount}',
        failed: 'Niewykonany · bez kary', paidRank: 'Pozycja na koniec sezonu: #{rank}',
        linked: 'Cel tego sponsora jest już zapisany w panelu sezonu.', limit: 'Limit 3 celów na ten sezon wykorzystany.',
        closed: 'Nowe cele będą dostępne 1 stycznia. Obecne pozostają ważne.',
        history: 'Poprzednie sezony', accepted: 'Cel przyjęty. Warunki i premia zostały zapisane.',
        sender: 'Rozliczenia sponsorskie', mailSubject: 'Cele sponsorskie — sezon {year}',
        seasonTitle: 'Cele sponsorskie · {year}',
        seasonDetail: 'Wykonano {completed}/{total} celów · premie {amount} · nowe oferty w {nextYear}: +{percent}%.',
        monthlyBoost: 'Stawka zawiera +{percent}% za cele z poprzedniego sezonu.'
    },
    en: {
        title: 'Sponsor goals · {year}', summary: 'Accepted goals: {count}/3',
        rules: 'Up to 3 regular-sponsor goals per year, accepted by 30 November. Bonuses are settled when you advance into the new year, even after the monthly contract expires. No penalties, OVR changes or ranking money.',
        futureBonus: 'Each completed goal adds 5% to new regular-sponsor offers next year (up to 15%).',
        offerBonus: 'New regular-sponsor offers in {year}: +{percent}% for last season’s goals.',
        empty: 'Sign a regular contract with a goal or accept an addendum from a current sponsor.',
        clause: 'Season goal in this contract', annex: 'Optional addendum for this season', accept: 'Accept goal',
        rank: 'Finish the season in the main OOM Top {target}', wins: 'Win {target} official singles matches after accepting the goal',
        quarterfinal: 'Reach a quarter-final or better in a main OOM tournament after accepting the goal',
        reward: 'Bonus: {amount} · deadline: 31 Dec {year}', rankProgress: 'Currently #{rank} · target Top {target}',
        countProgress: 'Progress: {count}/{target}', pending: 'In progress', reached: 'Goal achieved · bonus due at year end',
        provisional: 'Currently within the target · the 31 December ranking decides', completed: 'Completed · paid {amount}',
        failed: 'Not completed · no penalty', paidRank: 'Season-end position: #{rank}',
        linked: 'This sponsor’s goal is already recorded in the season panel.', limit: 'All 3 goals for this season have been accepted.',
        closed: 'New goals become available on 1 January. Current goals remain valid.',
        history: 'Previous seasons', accepted: 'Goal accepted. Its terms and bonus have been saved.',
        sender: 'Sponsor accounts', mailSubject: 'Sponsor goals — season {year}', seasonTitle: 'Sponsor goals · {year}',
        seasonDetail: '{completed}/{total} goals completed · bonuses {amount} · new offers in {nextYear}: +{percent}%.',
        monthlyBoost: 'Rate includes +{percent}% for last season’s goals.'
    },
    de: {
        title: 'Sponsorenziele · {year}', summary: 'Angenommene Ziele: {count}/3',
        rules: 'Bis zu 3 Ziele pro Jahr bei regulären Sponsoren, annehmbar bis zum 30. November. Die Prämien werden beim Wechsel ins neue Jahr ausgezahlt, auch nach Vertragsende. Keine Strafen, OVR-Änderungen oder Ranglistengelder.',
        futureBonus: 'Jedes erfüllte Ziel erhöht neue reguläre Sponsorenangebote im Folgejahr um 5% (max. 15%).',
        offerBonus: 'Neue reguläre Angebote {year}: +{percent}% für die Ziele der Vorsaison.',
        empty: 'Unterschreibe einen regulären Vertrag mit Ziel oder nimm einen Nachtrag eines aktuellen Sponsors an.',
        clause: 'Saisonziel im Vertrag', annex: 'Optionaler Nachtrag für diese Saison', accept: 'Ziel annehmen',
        rank: 'Beende die Saison in den Top {target} der Haupt-OOM', wins: 'Gewinne nach Annahme des Ziels {target} offizielle Einzelspiele',
        quarterfinal: 'Erreiche nach Annahme des Ziels mindestens ein Viertelfinale in einem Haupt-OOM-Turnier',
        reward: 'Prämie: {amount} · Frist: 31.12.{year}', rankProgress: 'Aktuell #{rank} · Ziel Top {target}',
        countProgress: 'Fortschritt: {count}/{target}', pending: 'In Arbeit', reached: 'Ziel erreicht · Prämie zum Jahresende',
        provisional: 'Aktuell im Zielbereich · entscheidend ist die Rangliste am 31. Dezember', completed: 'Erfüllt · {amount} ausgezahlt',
        failed: 'Nicht erfüllt · keine Strafe', paidRank: 'Platz zum Saisonende: #{rank}',
        linked: 'Das Ziel dieses Sponsors steht bereits in der Saisonübersicht.', limit: 'Alle 3 Ziele für diese Saison wurden angenommen.',
        closed: 'Neue Ziele sind ab dem 1. Januar verfügbar. Aktuelle Ziele bleiben gültig.',
        history: 'Frühere Saisons', accepted: 'Ziel angenommen. Bedingungen und Prämie wurden gespeichert.',
        sender: 'Sponsorenabrechnung', mailSubject: 'Sponsorenziele — Saison {year}', seasonTitle: 'Sponsorenziele · {year}',
        seasonDetail: '{completed}/{total} Ziele erfüllt · Prämien {amount} · neue Angebote {nextYear}: +{percent}%.',
        monthlyBoost: 'Der Betrag enthält +{percent}% für die Ziele der Vorsaison.'
    },
    nl: {
        title: 'Sponsordoelen · {year}', summary: 'Geaccepteerde doelen: {count}/3',
        rules: 'Maximaal 3 doelen per jaar bij gewone sponsors, te accepteren tot en met 30 november. Bonussen worden bij de overgang naar het nieuwe jaar betaald, ook na afloop van het maandcontract. Geen straffen, OVR-wijzigingen of rankinggeld.',
        futureBonus: 'Elk behaald doel verhoogt nieuwe gewone sponsoraanbiedingen volgend jaar met 5% (max. 15%).',
        offerBonus: 'Nieuwe gewone aanbiedingen in {year}: +{percent}% voor de doelen van vorig seizoen.',
        empty: 'Teken een gewoon contract met een doel of accepteer een aanvulling van een huidige sponsor.',
        clause: 'Seizoensdoel in dit contract', annex: 'Optionele aanvulling voor dit seizoen', accept: 'Doel accepteren',
        rank: 'Eindig het seizoen in de top {target} van de hoofd-OOM', wins: 'Win {target} officiële enkelpartijen na het accepteren van het doel',
        quarterfinal: 'Bereik na het accepteren van het doel minimaal een kwartfinale in een hoofd-OOM-toernooi',
        reward: 'Bonus: {amount} · deadline: 31 dec {year}', rankProgress: 'Momenteel #{rank} · doel top {target}',
        countProgress: 'Voortgang: {count}/{target}', pending: 'Bezig', reached: 'Doel behaald · bonus aan het einde van het jaar',
        provisional: 'Momenteel binnen het doel · de ranking op 31 december bepaalt het resultaat', completed: 'Behaald · {amount} betaald',
        failed: 'Niet behaald · geen straf', paidRank: 'Positie aan het einde van het seizoen: #{rank}',
        linked: 'Het doel van deze sponsor staat al in het seizoensoverzicht.', limit: 'Alle 3 doelen voor dit seizoen zijn geaccepteerd.',
        closed: 'Nieuwe doelen zijn beschikbaar op 1 januari. Huidige doelen blijven geldig.',
        history: 'Vorige seizoenen', accepted: 'Doel geaccepteerd. De voorwaarden en bonus zijn opgeslagen.',
        sender: 'Sponsoradministratie', mailSubject: 'Sponsordoelen — seizoen {year}', seasonTitle: 'Sponsordoelen · {year}',
        seasonDetail: '{completed}/{total} doelen behaald · bonussen {amount} · nieuwe aanbiedingen in {nextYear}: +{percent}%.',
        monthlyBoost: 'Het bedrag bevat +{percent}% voor de doelen van vorig seizoen.'
    }
};

function trSponsorGoal(key, values = {}) {
    const lang = typeof currentLang === 'string' ? currentLang : 'en';
    const text = SPONSOR_GOAL_TEXT[lang]?.[key] || SPONSOR_GOAL_TEXT.en[key] || key;
    return text.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function initSponsorGoals() {
    if (!player.sponsorGoals || typeof player.sponsorGoals !== 'object' || Array.isArray(player.sponsorGoals)) {
        player.sponsorGoals = { version: 1, goals: [] };
    }
    if (!Array.isArray(player.sponsorGoals.goals)) player.sponsorGoals.goals = [];
    return player.sponsorGoals;
}

function normalizeSponsorGoals() {
    const state = initSponsorGoals();
    const keys = new Set();
    state.goals = state.goals.filter(goal => {
        if (!goal || typeof goal.sponsor !== 'string' || !Number.isInteger(goal.year)
            || !['rank', 'wins', 'quarterfinal'].includes(goal.type)
            || !['pending', 'completed', 'failed'].includes(goal.status)
            || !Number.isFinite(goal.bonus) || goal.bonus < 0
            || !Number.isFinite(goal.target) || goal.target < 1
            || !Number.isFinite(goal.acceptedAt)) return false;
        const key = `${goal.year}|${goal.sponsor}`;
        if (keys.has(key)) return false;
        keys.add(key);
        goal.progress = Math.min(goal.target, Math.max(0, Number(goal.progress) || 0));
        return true;
    });
    return state;
}

function getSponsorGoalsForYear(year = currentDate.getFullYear()) {
    return initSponsorGoals().goals.filter(goal => goal.year === year);
}

function getSponsorOfferBonusPercent(year = currentDate.getFullYear()) {
    return Math.min(SPONSOR_GOAL_CONFIG.limit, getSponsorGoalsForYear(year - 1)
        .filter(goal => goal.status === 'completed').length) * SPONSOR_GOAL_CONFIG.offerBonusPerGoal;
}

function getSponsorGoalOffer(sponsor) {
    if (!sponsor || typeof sponsor.name !== 'string' || sponsor.type === 'tech'
        || !(Number(sponsor.monthlyValue) > 0) || currentDate.getMonth() === 11) return null;
    const year = currentDate.getFullYear();
    const goals = getSponsorGoalsForYear(year);
    if (goals.length >= SPONSOR_GOAL_CONFIG.limit || goals.some(goal => goal.sponsor === sponsor.name)) return null;
    const rank = getPlayerRank('main');
    // Sponsor names choose the clause without consuming the match RNG.
    const hash = Array.from(sponsor.name).reduce((value, char) => (value * 31 + char.codePointAt(0)) >>> 0, 0);
    const types = player.hasTourCard === true && rank > 0 && rank <= 128
        ? ['wins', 'rank', 'quarterfinal'] : ['wins'];
    const type = types[hash % types.length];
    const remaining = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, currentDate.getMonth(), currentDate.getDate()))
        / (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1));
    const wins = rank > 64 ? 12 : rank > 32 ? 20 : 30;
    const targetRank = rank > 64 ? 64 : rank > 32 ? 32 : rank > 16 ? 16 : rank > 8 ? 8 : rank > 4 ? 4 : 1;
    const target = type === 'rank' ? targetRank : type === 'wins' ? Math.max(1, Math.ceil(wins * remaining)) : 1;
    const multiplier = type === 'rank' ? 2 : type === 'quarterfinal' ? 1.5 : 1;
    const bonus = Math.max(10, Math.round(Number(sponsor.monthlyValue) * multiplier * remaining / 10) * 10);
    return { sponsor: sponsor.name, year, type, target, bonus };
}

function acceptSponsorGoal(sponsor) {
    // Only a signed regular contract may create a payable clause.
    if (!Array.isArray(player.activeSponsors) || !player.activeSponsors.includes(sponsor)) return null;
    const offer = getSponsorGoalOffer(sponsor);
    if (!offer) return null;
    const goal = { ...offer, acceptedAt: currentDate.getTime(), progress: 0, status: 'pending' };
    initSponsorGoals().goals.push(goal);
    return goal;
}

function acceptSponsorGoalAnnex(index) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    const sponsor = Number.isInteger(index) ? player.activeSponsors?.[index] : null;
    if (!acceptSponsorGoal(sponsor)) return false;
    if (typeof saveGame === 'function') saveGame(true);
    showSponsorsScreen();
    return true;
}

function recordSponsorGoalProgress(candidate, type) {
    if (!candidate || (candidate !== player && !(candidate.id && candidate.id === player.id))) return;
    for (const goal of getSponsorGoalsForYear()) {
        if (goal.status === 'pending' && goal.type === type && currentDate.getTime() >= goal.acceptedAt) {
            goal.progress = Math.min(goal.target, goal.progress + 1);
        }
    }
}

function recordSponsorGoalTournament(candidate, tournament, result) {
    if (!result || result.round > 8 || tournament.isDoubles
        || typeof isMainOrderOfMeritRankingTournament !== 'function'
        || !isMainOrderOfMeritRankingTournament(tournament)) return;
    recordSponsorGoalProgress(candidate, 'quarterfinal');
}

function settleSponsorGoals(year) {
    // Take the 31 December snapshot BEFORE advancing the date, expiring OOM
    // money, retiring players or clearing season statistics.
    if (currentDate.getFullYear() !== year || currentDate.getMonth() !== 11 || currentDate.getDate() !== 31) return null;
    const goals = getSponsorGoalsForYear(year);
    const pending = goals.filter(goal => goal.status === 'pending');
    if (!pending.length) return null;
    const finalRank = getPlayerRank('main');
    let payout = 0;
    for (const goal of pending) {
        const completed = goal.type === 'rank' ? finalRank > 0 && finalRank <= goal.target : goal.progress >= goal.target;
        goal.status = completed ? 'completed' : 'failed';
        goal.settledAt = currentDate.getTime();
        if (goal.type === 'rank') goal.finalRank = finalRank;
        if (completed) payout += goal.bonus;
    }
    player.budget = (Number(player.budget) || 0) + payout;
    const completed = goals.filter(goal => goal.status === 'completed').length;
    const totalBonus = goals.filter(goal => goal.status === 'completed').reduce((sum, goal) => sum + goal.bonus, 0);
    const percent = getSponsorOfferBonusPercent(year + 1);
    const data = { year, completed, total: goals.length, prize: totalBonus, percent, timestamp: currentDate.getTime() };
    if (typeof addCareerChronicleEvent === 'function') addCareerChronicleEvent('sponsorSeason', data);
    if (typeof addEmail === 'function') {
        const body = trSponsorGoal('seasonDetail', {
            ...data, amount: sponsorGoalMoney(totalBonus), nextYear: year + 1
        });
        const details = goals.map(goal => `${escapeHtml(goal.sponsor)}: ${escapeHtml(trSponsorGoal(goal.status === 'completed' ? 'completed' : 'failed', { amount: sponsorGoalMoney(goal.bonus) }))}`);
        addEmail(trSponsorGoal('sender'), trSponsorGoal('mailSubject', { year }), `${escapeHtml(body)}<br><br>${details.join('<br>')}`);
    }
    initSponsorGoals().goals = initSponsorGoals().goals.filter(goal => goal.year > year - SPONSOR_GOAL_CONFIG.historyYears);
    return data;
}

function sponsorGoalMoney(value) {
    return `£${Number(value || 0).toLocaleString('en-GB')}`;
}

function renderSponsorGoalOffer(sponsor, index = null) {
    const offer = getSponsorGoalOffer(sponsor);
    if (!offer) {
        const reason = getSponsorGoalsForYear().some(goal => goal.sponsor === sponsor.name) ? 'linked'
            : currentDate.getMonth() === 11 ? 'closed' : 'limit';
        return `<p class="sponsor-goal-note">${escapeHtml(trSponsorGoal(reason))}</p>`;
    }
    return `<div class="sponsor-goal-clause">
        <strong>${escapeHtml(trSponsorGoal(index === null ? 'clause' : 'annex'))}</strong>
        <p>${escapeHtml(trSponsorGoal(offer.type, offer))}</p>
        <p class="sponsor-goal-reward">${escapeHtml(trSponsorGoal('reward', { ...offer, amount: sponsorGoalMoney(offer.bonus) }))}</p>
        ${index === null ? '' : `<button type="button" class="btn-sign" onclick="acceptSponsorGoalAnnex(${index})">${escapeHtml(trSponsorGoal('accept'))}</button>`}
    </div>`;
}

function renderSponsorGoalCard(goal) {
    const rank = goal.status === 'pending' ? getPlayerRank('main') : goal.finalRank;
    const onTarget = goal.type === 'rank' ? rank > 0 && rank <= goal.target : goal.progress >= goal.target;
    const status = goal.status !== 'pending' ? goal.status : onTarget ? (goal.type === 'rank' ? 'provisional' : 'reached') : 'pending';
    const progress = goal.type === 'rank'
        ? trSponsorGoal(goal.status === 'pending' ? 'rankProgress' : 'paidRank', { rank: rank || '—', target: goal.target })
        : trSponsorGoal('countProgress', { count: goal.progress, target: goal.target });
    const amount = sponsorGoalMoney(goal.bonus);
    return `<article class="sponsor-goal-card ${goal.status === 'completed' ? 'goal-completed' : ''}">
        <div class="sponsor-goal-card-head"><strong>${escapeHtml(goal.sponsor)}</strong><span>${goal.year}</span></div>
        <p>${escapeHtml(trSponsorGoal(goal.type, goal))}</p>
        <p class="sponsor-goal-reward">${escapeHtml(trSponsorGoal('reward', { ...goal, amount }))}</p>
        <p>${escapeHtml(progress)}</p>
        ${goal.type === 'rank' ? '' : `<progress value="${goal.progress}" max="${goal.target}" aria-label="${escapeHtml(progress)}"></progress>`}
        <p class="sponsor-goal-status">${escapeHtml(trSponsorGoal(status, { amount }))}</p>
    </article>`;
}

function renderSponsorGoalsPanel() {
    const panel = document.getElementById('sponsor-season-goals');
    if (!panel) return;
    const year = currentDate.getFullYear();
    const goals = getSponsorGoalsForYear(year);
    const previous = initSponsorGoals().goals.filter(goal => goal.year < year).slice().sort((a, b) => b.year - a.year);
    panel.innerHTML = `<div class="sponsor-goal-heading"><h3 id="sponsor-goal-title">${escapeHtml(trSponsorGoal('title', { year }))}</h3>
        <strong>${escapeHtml(trSponsorGoal('summary', { count: goals.length }))}</strong></div>
        <p class="sponsor-goal-note">${escapeHtml(trSponsorGoal('rules'))}</p>
        <p class="sponsor-goal-note">${escapeHtml(trSponsorGoal('futureBonus'))}</p>
        <p class="sponsor-goal-reward">${escapeHtml(trSponsorGoal('offerBonus', { year, percent: getSponsorOfferBonusPercent(year) }))}</p>
        ${goals.length ? `<div class="sponsor-goals-grid">${goals.map(renderSponsorGoalCard).join('')}</div>` : `<p>${escapeHtml(trSponsorGoal('empty'))}</p>`}
        ${previous.length ? `<details class="sponsor-goal-history"><summary>${escapeHtml(trSponsorGoal('history'))}</summary><div class="sponsor-goals-grid">${previous.map(renderSponsorGoalCard).join('')}</div></details>` : ''}`;
}
