/* Television-style presentation of the live match, including sets and doubles. */
(function () {
    'use strict';
    const panel = document.getElementById('broadcast-scoreboard');
    if (!panel) return;
    const copy = {
        pl: { title: 'Wynik meczu', legs: 'Legi', sets: 'Sety', first: 'Do', practice: 'Trening', friendly: 'Mecz towarzyski', turn: 'Rzuca', starter: 'Rozpoczyna lega', checkout: 'Możliwy checkout', nine: 'Szansa na nine-dartera', goalLegs: 'legów', goalSets: 'setów' },
        en: { title: 'Match score', legs: 'Legs', sets: 'Sets', first: 'First to', practice: 'Practice', friendly: 'Friendly match', turn: 'Throwing', starter: 'Started the leg', checkout: 'Possible checkout', nine: 'Nine-darter possible' },
        de: { title: 'Spielstand', legs: 'Legs', sets: 'Sets', first: 'Bis', practice: 'Training', friendly: 'Freundschaftsspiel', turn: 'Am Wurf', starter: 'Beginnt das Leg', checkout: 'Mögliches Checkout', nine: 'Neundarter möglich' },
        nl: { title: 'Wedstrijdstand', legs: 'Legs', sets: 'Sets', first: 'Eerste tot', practice: 'Training', friendly: 'Vriendschappelijk', turn: 'Aan de beurt', starter: 'Begon de leg', checkout: 'Mogelijke checkout', nine: 'Negendarter mogelijk' }
    };
    const put = (id, value) => {
        const element = document.getElementById(id);
        const text = String(value ?? '');
        if (element.textContent !== text) element.textContent = text;
    };
    // Common broadcast flags are vector artwork so they also stay crisp offline.
    const flagArt = {
        'gb-eng': '<path fill="#fff" d="M0 0h30v20H0z"/><path fill="#ce1124" d="M12 0h6v20h-6zM0 7h30v6H0z"/>',
        'gb-sct': '<path fill="#0065bd" d="M0 0h30v20H0z"/><path stroke="#fff" stroke-width="4" d="M0 0l30 20M30 0L0 20"/>',
        pl: '<path fill="#fff" d="M0 0h30v10H0z"/><path fill="#dc143c" d="M0 10h30v10H0z"/>',
        nl: '<path fill="#ae1c28" d="M0 0h30v7H0z"/><path fill="#fff" d="M0 7h30v6H0z"/><path fill="#21468b" d="M0 13h30v7H0z"/>'
    };
    function refresh() {
        const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
        const tournament = match?.isTournament && typeof activeTournament !== 'undefined' ? activeTournament : null;
        window.matchBroadcastTheme?.apply(tournament, match);
        panel.hidden = !match;
        if (!match) return;
        const labels = copy[typeof currentLang === 'string' ? currentLang : 'pl'] || copy.en;
        const sets = match.matchFormat?.type === 'sets';
        panel.classList.toggle('has-sets', sets);
        panel.classList.toggle('is-practice', !match.vsAI);
        panel.setAttribute('aria-label', labels.title);
        put('broadcast-legs-label', labels.legs);
        put('broadcast-sets-label', labels.sets);
        const limit = sets ? match.matchFormat.setsToWin : match.matchFormat?.legsToWin;
        put('broadcast-format', !match.vsAI ? labels.practice : `${labels.first} ${limit || 6} ${sets ? (labels.goalSets || labels.sets.toLowerCase()) : (labels.goalLegs || labels.legs.toLowerCase())}`);
        const round = match.spectatorRound ?? (typeof tournamentRound !== 'undefined' ? tournamentRound : null);
        const event = tournament ? (typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : tournament.name) : '';
        const roundLabel = tournament && round != null && typeof getRoundName === 'function' ? getRoundName(round) : '';
        put('broadcast-event', [event, roundLabel].filter(Boolean).join(' · ') || (match.vsAI ? labels.friendly : labels.practice));
        document.getElementById('broadcast-sets-label').hidden = !sets;
        const routes = { p1: [], p2: [] };
        if (!match.isFinishing && typeof matchBroadcastCheckout !== 'undefined') {
            for (const side of ['p1', 'p2']) {
                const isThrowing = match.turn === side;
                const dartsLeft = isThrowing ? (match.isTurnLocked ? 0 : 3 - (match.dartsThrown || 0)) : 3;
                routes[side] = matchBroadcastCheckout.route(match[`${side}Score`], dartsLeft);
            }
        }
        const longestRoute = Math.max(routes.p1.length, routes.p2.length);
        panel.classList.toggle('has-checkout', longestRoute > 0);
        panel.style.setProperty('--checkout-count', String(longestRoute));
        const legStarter = match.isTournament ? window.matchBroadcastTheme?.legStarter(match) : null;
        let anyNine = false;
        for (const side of ['p1', 'p2']) {
            const isP1 = side === 'p1';
            const candidate = match.isDoubles
                ? (isP1 ? match.worldCupTeamP1 : match.worldCupTeamP2)
                : (isP1 ? (match.isSpectator ? match.spectatorP1 : (typeof player !== 'undefined' ? player : null)) : match.opponent);
            const name = match.isDoubles ? candidate?.country : candidate?.name;
            put(`broadcast-name-${side}`, name || '—');
            put(`broadcast-score-${side}`, match[`${side}Score`]);
            put(`broadcast-legs-${side}`, match[`${side}Legs`] || 0);
            put(`broadcast-sets-${side}`, match[`${side}Sets`] || 0);
            document.getElementById(`broadcast-sets-${side}`).hidden = !sets;
            const flag = document.getElementById(`broadcast-flag-${side}`);
            if (flag.dataset.country !== (candidate?.country || '')) {
                flag.dataset.country = candidate?.country || '';
                const code = typeof flags !== 'undefined' ? flags[candidate?.country] : '';
                flag.innerHTML = flagArt[code]
                    ? `<svg viewBox="0 0 30 20" aria-hidden="true">${flagArt[code]}</svg>`
                    : (typeof getFlagImg === 'function' ? getFlagImg(candidate?.country) : '');
                flag.setAttribute('aria-label', candidate?.country || '');
            }
            const row = document.getElementById(`broadcast-${side}`);
            const throwing = match.turn === side;
            const startsLeg = legStarter === side;
            row.classList.toggle('is-throwing', throwing);
            row.classList.toggle('started-leg', startsLeg);
            const starterDot = document.getElementById(`broadcast-starter-${side}`);
            starterDot.hidden = !startsLeg;
            starterDot.setAttribute('aria-hidden', String(!startsLeg));
            starterDot.setAttribute('aria-label', labels.starter);
            const checkout = document.getElementById(`broadcast-checkout-${side}`);
            const route = routes[side];
            row.classList.toggle('has-checkout', route.length > 0);
            row.style.setProperty('--row-checkout-count', String(route.length));
            checkout.setAttribute('aria-hidden', String(!route.length));
            // Keep the last tokens while the strip retracts; no extra animation on refresh.
            if (route.length) {
                checkout.style.setProperty('--checkout-count', String(route.length));
                Array.from(checkout.children).forEach((slot, index) => {
                    slot.hidden = index >= route.length;
                    const token = route[index] || '';
                    if (slot.textContent !== token) slot.textContent = token;
                });
                checkout.setAttribute('aria-label', `${labels.checkout}: ${route.join(' ')}`);
            }
            const legDarts = Number(match.stats?.[`${side}LegDarts`]) || 0;
            const nine = route.length > 0 && matchBroadcastCheckout.nineDartPossible(match[`${side}Score`], legDarts);
            const nineBadge = document.getElementById(`broadcast-nine-${side}`);
            row.classList.toggle('has-nine', nine);
            nineBadge.setAttribute('aria-hidden', String(!nine));
            nineBadge.setAttribute('aria-label', labels.nine);
            anyNine ||= nine;
            row.setAttribute('aria-label', `${name || '—'}: ${match[`${side}Score`]}${startsLeg ? ` · ${labels.starter}` : ''}${throwing ? ` · ${labels.turn}` : ''}${nine ? ` · ${labels.nine}` : ''}`);
        }
        panel.classList.toggle('has-nine', anyNine);
    }
    window.refreshMatchBroadcastScoreboard = refresh;
    refresh();
})();
