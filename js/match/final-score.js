(function () {
    'use strict';

    const overlay = document.getElementById('match-final-score');
    if (!overlay) return;
    const statsOverlay = document.getElementById('match-post-stats');
    const eventName = document.getElementById('match-final-event');
    const resultLabel = document.getElementById('match-final-label');
    const resultScores = {
        p1: document.getElementById('match-final-score-p1'),
        p2: document.getElementById('match-final-score-p2')
    };
    const players = {
        p1: {
            panel: document.getElementById('match-final-p1'),
            photo: document.getElementById('match-final-photo-p1'),
            initial: document.getElementById('match-final-initial-p1'),
            first: document.getElementById('match-final-first-p1'),
            last: document.getElementById('match-final-last-p1')
        },
        p2: {
            panel: document.getElementById('match-final-p2'),
            photo: document.getElementById('match-final-photo-p2'),
            initial: document.getElementById('match-final-initial-p2'),
            first: document.getElementById('match-final-first-p2'),
            last: document.getElementById('match-final-last-p2')
        }
    };
    let displayTimer = null;
    let hideTimer = null;
    let resolvePresentation = null;
    let phase = 'idle';
    let presentationId = 0;

    const translations = {
        pl: 'WYNIK KOŃCOWY', en: 'FINAL SCORE', de: 'ENDSTAND', nl: 'EINDSTAND'
    };
    const statsTranslations = {
        pl: { title: 'STATYSTYKI MECZU', average: 'ŚREDNIA 3 LOTKI', oneEighties: '180', highCheckout: 'NAJWYŻSZY CHECKOUT', checkouts: 'CHECKOUTY', checkoutPct: 'SKUTECZNOŚĆ CHECKOUTÓW', breaks: 'PRZEŁAMANIA', legs: 'WYNIK W LEGACH', sets: 'WYNIK W SETACH' },
        en: { title: 'MATCH STATS', average: '3-DART AVERAGE', oneEighties: '180s', highCheckout: 'HIGHEST CHECKOUT', checkouts: 'CHECKOUTS', checkoutPct: 'CHECKOUT SUCCESS', breaks: 'BREAKS OF THROW', legs: 'FINAL LEG SCORE', sets: 'FINAL SET SCORE' },
        de: { title: 'MATCHSTATISTIK', average: '3-DART-SCHNITT', oneEighties: '180ER', highCheckout: 'HÖCHSTES FINISH', checkouts: 'CHECKOUTS', checkoutPct: 'CHECKOUT-QUOTE', breaks: 'BREAKS', legs: 'ENDERGEBNIS LEGS', sets: 'ENDERGEBNIS SETS' },
        nl: { title: 'WEDSTRIJDSTATISTIEKEN', average: '3-DARTGEMIDDELDE', oneEighties: '180-ERS', highCheckout: 'HOOGSTE FINISH', checkouts: 'CHECKOUTS', checkoutPct: 'CHECKOUTPERCENTAGE', breaks: 'BREAKS', legs: 'EINDSTAND LEGS', sets: 'EINDSTAND SETS' }
    };
    const statsPlayers = statsOverlay ? Object.fromEntries(['p1', 'p2'].map(side => [side, {
        panel: document.getElementById(`match-post-stats-${side}`),
        photo: document.getElementById(`match-post-stats-photo-${side}`),
        initial: document.getElementById(`match-post-stats-initial-${side}`),
        name: document.getElementById(`match-post-stats-name-${side}`),
        score: document.getElementById(`match-post-stats-score-${side}`)
    }])) : null;

    function language() {
        return typeof currentLang === 'string' && translations[currentLang] ? currentLang : 'en';
    }

    function nameFor(side, match) {
        const fromBroadcast = document.getElementById(`broadcast-name-${side}`)?.textContent?.trim();
        if (fromBroadcast && fromBroadcast !== '—') return fromBroadcast;
        if (match?.isDoubles) {
            return (side === 'p1' ? match.worldCupTeamP1 : match.worldCupTeamP2)?.country || side.toUpperCase();
        }
        const candidate = side === 'p1'
            ? (match?.isSpectator ? match.spectatorP1 : (typeof player !== 'undefined' ? player : null))
            : match?.opponent;
        return candidate?.name || side.toUpperCase();
    }

    function splitName(name) {
        const words = String(name || '').trim().split(/\s+/).filter(Boolean);
        if (words.length < 2) return { first: '', last: words[0] || '' };
        return { first: words.slice(0, -1).join(' '), last: words.at(-1) };
    }

    function initials(name) {
        const words = String(name || '').trim().split(/\s+/).filter(Boolean);
        return (words.length > 1 ? `${words[0][0]}${words.at(-1)[0]}` : words[0]?.slice(0, 2) || '').toUpperCase();
    }

    let nameMeasureContext = null;
    function fitPlayerNames() {
        if (phase !== 'score' || typeof window.getComputedStyle !== 'function' || typeof document.createElement !== 'function') return;
        if (!nameMeasureContext) nameMeasureContext = document.createElement('canvas').getContext('2d');
        if (!nameMeasureContext) return;
        for (const side of ['p1', 'p2']) {
            for (const element of [players[side].first, players[side].last]) {
                // Reset before measuring so a new player or a wider screen can
                // use the normal size again. Only unusually long words shrink.
                element.style.fontSize = '';
                const style = window.getComputedStyle(element);
                const parentStyle = window.getComputedStyle(element.parentElement);
                const width = element.parentElement.clientWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
                const fontSize = parseFloat(style.fontSize);
                if (!width || !fontSize) continue;
                nameMeasureContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                const longest = Math.max(0, ...element.textContent.toUpperCase().split(/\s+/)
                    .map(word => nameMeasureContext.measureText(word).width));
                if (longest > width) element.style.fontSize = `${Math.max(12, fontSize * (width - 1) / longest).toFixed(2)}px`;
            }
        }
    }

    function setPlayer(side, match, winnerSide) {
        const elements = players[side];
        const name = nameFor(side, match);
        const parts = splitName(name);
        const sourcePhoto = document.getElementById(`score-photo-${side}`);
        const photoUrl = sourcePhoto?.currentSrc || sourcePhoto?.src || '';
        elements.first.textContent = parts.first;
        elements.last.textContent = parts.last;
        elements.initial.textContent = initials(name);
        elements.photo.alt = name;
        elements.panel.classList.toggle('is-winner', side === winnerSide);
        elements.photo.classList.toggle('world-cup-flag-photo', Boolean(sourcePhoto?.classList.contains('world-cup-flag-photo')));
        if (photoUrl) {
            elements.photo.src = photoUrl;
            elements.photo.hidden = false;
            elements.initial.hidden = true;
        } else {
            elements.photo.removeAttribute('src');
            elements.photo.hidden = true;
            elements.initial.hidden = false;
        }
        if (statsPlayers) {
            const stat = statsPlayers[side];
            stat.name.textContent = name;
            stat.initial.textContent = initials(name);
            stat.photo.alt = name;
            stat.panel.classList.toggle('is-winner', side === winnerSide);
            stat.photo.classList.toggle('world-cup-flag-photo', Boolean(sourcePhoto?.classList.contains('world-cup-flag-photo')));
            if (photoUrl) {
                stat.photo.src = photoUrl;
                stat.photo.hidden = false;
                stat.initial.hidden = true;
            } else {
                stat.photo.removeAttribute('src');
                stat.photo.hidden = true;
                stat.initial.hidden = false;
            }
        }
    }

    function statNumber(value) {
        return Math.max(0, Number(value) || 0);
    }

    function populateStats(match, setMatch) {
        if (!statsOverlay) return;
        const copy = statsTranslations[language()];
        const labels = { average: copy.average, '180s': copy.oneEighties, 'high-checkout': copy.highCheckout,
            checkouts: copy.checkouts, 'checkout-pct': copy.checkoutPct, breaks: copy.breaks };
        document.getElementById('match-post-stats-title').textContent = copy.title;
        document.getElementById('match-post-stats-event').textContent = eventName.textContent;
        document.getElementById('match-post-stats-score-label').textContent = copy[setMatch ? 'sets' : 'legs'];
        for (const [key, label] of Object.entries(labels)) {
            document.getElementById(`match-post-stats-label-${key}`).textContent = label;
        }
        const data = match.stats || {};
        for (const side of ['p1', 'p2']) {
            const darts = statNumber(data[`${side}TotalDarts`]);
            const score = Number(match[`${side}Score`]);
            const points = statNumber(data[`${side}AccumulatedScore`])
                + (Number.isFinite(score) ? Math.max(0, 501 - score) : 0);
            const hits = statNumber(data[`${side}DoubleHits`]);
            const attempts = statNumber(data[`${side}DoubleAttempts`]);
            const values = {
                average: darts ? (points / darts * 3).toFixed(2) : '0.00',
                '180s': String(statNumber(data[`${side}OneEighties`])),
                'high-checkout': String(statNumber(data[`${side}HighCheckout`]) || '—'),
                checkouts: `${hits}/${attempts}`,
                'checkout-pct': `${(attempts ? hits / attempts * 100 : 0).toFixed(1)}%`,
                breaks: String(statNumber(match.breaksOfThrow?.[side]))
            };
            statsPlayers[side].score.textContent = resultScores[side].textContent;
            for (const [key, value] of Object.entries(values)) {
                document.getElementById(`match-post-stats-${side}-${key}`).textContent = value;
            }
        }
    }

    function completePresentation() {
        phase = 'idle';
        const resolve = resolvePresentation;
        resolvePresentation = null;
        if (resolve) resolve();
    }

    function finishStats() {
        if (phase !== 'stats') return;
        clearTimeout(displayTimer);
        displayTimer = null;
        statsOverlay.classList.remove('is-visible');
        hideTimer = setTimeout(() => {
            hideTimer = null;
            statsOverlay.hidden = true;
            statsOverlay.setAttribute('aria-hidden', 'true');
            completePresentation();
        }, 360);
    }

    function finishPresentation() {
        if (phase !== 'score') return;
        clearTimeout(displayTimer);
        displayTimer = null;
        overlay.classList.remove('is-visible');
        hideTimer = setTimeout(() => {
            hideTimer = null;
            overlay.hidden = true;
            overlay.setAttribute('aria-hidden', 'true');
            if (!statsOverlay || (typeof arePostMatchReportsEnabled === 'function' && !arePostMatchReportsEnabled())) {
                return completePresentation();
            }
            phase = 'stats';
            statsOverlay.hidden = false;
            statsOverlay.setAttribute('aria-hidden', 'false');
            const id = presentationId;
            const frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : callback => setTimeout(callback, 0);
            frame(() => { if (presentationId === id) statsOverlay.classList.add('is-visible'); });
            displayTimer = setTimeout(finishStats, matchStatsDuration);
        }, 360);
    }

    const matchStatsDuration = 4800;

    function hide() {
        presentationId++;
        clearTimeout(displayTimer);
        clearTimeout(hideTimer);
        displayTimer = hideTimer = null;
        for (const layer of [overlay, statsOverlay]) {
            if (!layer) continue;
            layer.classList.remove('is-visible');
            layer.hidden = true;
            layer.setAttribute('aria-hidden', 'true');
        }
        completePresentation();
    }

    function show({ match, tournament, winnerSide } = {}) {
        if (!match) return Promise.resolve(false);
        hide();

        const setMatch = match.matchFormat?.type === 'sets';
        resultScores.p1.textContent = String(match[setMatch ? 'p1Sets' : 'p1Legs'] ?? 0);
        resultScores.p2.textContent = String(match[setMatch ? 'p2Sets' : 'p2Legs'] ?? 0);
        resultLabel.textContent = translations[language()];
        eventName.textContent = document.getElementById('broadcast-event')?.textContent?.trim()
            || tournament?.name || document.getElementById('match-title')?.textContent?.trim() || 'Darts Career';
        setPlayer('p1', match, winnerSide);
        setPlayer('p2', match, winnerSide);
        populateStats(match, setMatch);

        phase = 'score';
        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        const id = presentationId;
        const frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : callback => setTimeout(callback, 0);
        frame(() => {
            if (presentationId !== id) return;
            fitPlayerNames();
            overlay.classList.add('is-visible');
        });

        const duration = match.isSpectator ? 4200 : 5200;
        return new Promise(resolve => {
            resolvePresentation = resolve;
            displayTimer = setTimeout(finishPresentation, duration);
        });
    }

    for (const side of ['p1', 'p2']) {
        for (const elements of [players[side], statsPlayers?.[side]].filter(Boolean)) {
            elements.photo.addEventListener('load', () => {
                elements.photo.hidden = false;
                elements.initial.hidden = true;
            });
            elements.photo.addEventListener('error', () => {
                elements.photo.hidden = true;
                elements.initial.hidden = false;
            });
        }
    }

    window.addEventListener?.('resize', fitPlayerNames);

    window.matchFinalScore = Object.freeze({
        show,
        hide,
        getState() {
            return { visible: phase !== 'idle', phase };
        }
    });
})();
