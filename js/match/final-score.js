(function () {
    'use strict';

    const overlay = document.getElementById('match-final-score');
    if (!overlay) return;
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

    const translations = {
        pl: 'WYNIK KOŃCOWY', en: 'FINAL SCORE', de: 'ENDSTAND', nl: 'EINDSTAND'
    };

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
    }

    function finishPresentation() {
        clearTimeout(displayTimer);
        clearTimeout(hideTimer);
        displayTimer = null;
        overlay.classList.remove('is-visible');
        hideTimer = setTimeout(() => {
            hideTimer = null;
            overlay.hidden = true;
            overlay.setAttribute('aria-hidden', 'true');
            const resolve = resolvePresentation;
            resolvePresentation = null;
            if (resolve) resolve();
        }, 360);
    }

    function show({ match, tournament, winnerSide } = {}) {
        if (!match) return Promise.resolve(false);
        if (resolvePresentation) {
            const previousResolve = resolvePresentation;
            resolvePresentation = null;
            clearTimeout(displayTimer);
            clearTimeout(hideTimer);
            displayTimer = hideTimer = null;
            previousResolve();
        }
        clearTimeout(hideTimer);
        hideTimer = null;

        const setMatch = match.matchFormat?.type === 'sets';
        resultScores.p1.textContent = String(match[setMatch ? 'p1Sets' : 'p1Legs'] ?? 0);
        resultScores.p2.textContent = String(match[setMatch ? 'p2Sets' : 'p2Legs'] ?? 0);
        resultLabel.textContent = translations[language()];
        eventName.textContent = document.getElementById('broadcast-event')?.textContent?.trim()
            || tournament?.name || document.getElementById('match-title')?.textContent?.trim() || 'Darts Career';
        setPlayer('p1', match, winnerSide);
        setPlayer('p2', match, winnerSide);

        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        const frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : callback => setTimeout(callback, 0);
        frame(() => overlay.classList.add('is-visible'));

        const duration = match.isSpectator ? 4200 : 5200;
        return new Promise(resolve => {
            resolvePresentation = resolve;
            displayTimer = setTimeout(finishPresentation, duration);
        });
    }

    for (const side of ['p1', 'p2']) {
        players[side].photo.addEventListener('load', () => {
            players[side].photo.hidden = false;
            players[side].initial.hidden = true;
        });
        players[side].photo.addEventListener('error', () => {
            players[side].photo.hidden = true;
            players[side].initial.hidden = false;
        });
    }

    window.matchFinalScore = Object.freeze({
        show,
        hide: finishPresentation,
        getState() {
            return { visible: !overlay.hidden && overlay.classList.contains('is-visible') };
        }
    });
})();
