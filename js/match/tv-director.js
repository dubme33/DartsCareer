/* Broadcast graphics and camera direction. This layer observes match events only. */
(function () {
    'use strict';

    const screen = document.getElementById('screen-match');
    const boardView = document.getElementById('match-board-view');
    const board2D = document.getElementById('dartboard');
    const watermark = document.getElementById('tv-watermark');
    const statCard = document.getElementById('tv-stat-card');
    const statKicker = document.getElementById('tv-stat-kicker');
    const statTitle = document.getElementById('tv-stat-title');
    const statBody = document.getElementById('tv-stat-body');
    const statPlayers = {
        p1: {
            photo: document.getElementById('tv-stat-photo-p1'), initial: document.getElementById('tv-stat-initial-p1'),
            name: document.getElementById('tv-stat-name-p1'), score: document.getElementById('tv-stat-score-p1'),
            matchScore: document.getElementById('tv-stat-match-p1')
        },
        p2: {
            photo: document.getElementById('tv-stat-photo-p2'), initial: document.getElementById('tv-stat-initial-p2'),
            name: document.getElementById('tv-stat-name-p2'), score: document.getElementById('tv-stat-score-p2'),
            matchScore: document.getElementById('tv-stat-match-p2')
        }
    };
    const statFormat = document.getElementById('tv-stat-format');
    const statMatchLabel = document.getElementById('tv-stat-match-label');
    const momentBanner = document.getElementById('tv-moment-banner');
    const momentKicker = document.getElementById('tv-moment-kicker');
    const momentTitle = document.getElementById('tv-moment-title');
    const momentDetail = document.getElementById('tv-moment-detail');
    const replay = document.getElementById('tv-replay');
    const replayImage = document.getElementById('tv-replay-image');
    const replayCaption = document.getElementById('tv-replay-caption');
    const replaySkip = document.getElementById('tv-replay-skip');
    const replayStinger = document.getElementById('tv-replay-stinger');
    const stingerLabel = document.getElementById('tv-stinger-label');
    if (!screen || !boardView || !watermark || !statCard || !momentBanner || !replay || !replayStinger) return;

    const translations = {
        pl: {
            matchStats: 'STATYSTYKI MECZU', visits: 'WYSOKIE KOLEJKI', checkout: 'SKUTECZNOŚĆ CHECKOUTÓW',
            legHistory: 'HISTORIA LEGÓW', oneEighties: 'RZUCONE 180', wonIn: 'wygrywa w {darts}. lotce',
            replay: 'POWTÓRKA', replayOf: 'Zakończenie lega', skip: 'Pomiń powtórkę',
            moment: 'MOMENT MECZU', legWon: 'KONIEC LEGA', maximum: 'Maksimum 180', bigVisit: 'Wysoka kolejka',
            bullFinish: 'Bull na zakończenie', highCheckout: 'Wysoki checkout', bounceOut: 'Bounce-out',
            hundred: '100+', oneForty: '140+', attempts: 'trafionych', leg: 'LEG', darts: 'lotek'
        },
        en: {
            matchStats: 'MATCH STATS', visits: 'HIGH-SCORING VISITS', checkout: 'CHECKOUT PERCENTAGE',
            legHistory: 'LEG HISTORY', oneEighties: '180s SCORED', wonIn: 'wins in {darts} darts',
            replay: 'REPLAY', replayOf: 'Leg-winning dart', skip: 'Skip replay',
            moment: 'MATCH MOMENT', legWon: 'LEG COMPLETE', maximum: 'Maximum 180', bigVisit: 'Big visit',
            bullFinish: 'Bull finish', highCheckout: 'High checkout', bounceOut: 'Bounce-out',
            hundred: '100+', oneForty: '140+', attempts: 'made', leg: 'LEG', darts: 'darts'
        },
        de: {
            matchStats: 'MATCHSTATISTIK', visits: 'HOHE AUFNAHMEN', checkout: 'CHECKOUT-QUOTE',
            legHistory: 'LEG-VERLAUF', oneEighties: 'GEWORFENE 180ER', wonIn: 'gewinnt mit {darts} Darts',
            replay: 'WIEDERHOLUNG', replayOf: 'Leg-Dart', skip: 'Wiederholung überspringen',
            moment: 'MATCHMOMENT', legWon: 'LEG BEENDET', maximum: 'Maximum 180', bigVisit: 'Hohe Aufnahme',
            bullFinish: 'Bull-Finish', highCheckout: 'Hohes Checkout', bounceOut: 'Bounce-out',
            hundred: '100+', oneForty: '140+', attempts: 'Treffer', leg: 'LEG', darts: 'Darts'
        },
        nl: {
            matchStats: 'WEDSTRIJDSTATISTIEKEN', visits: 'HOGE BEURTEN', checkout: 'CHECKOUTPERCENTAGE',
            legHistory: 'LEGOVERZICHT', oneEighties: 'GEGOOIDE 180-ERS', wonIn: 'wint in {darts} darts',
            replay: 'HERHALING', replayOf: 'Winnende leg-dart', skip: 'Herhaling overslaan',
            moment: 'WEDSTRIJDMOMENT', legWon: 'LEG AFGELOPEN', maximum: 'Maximum 180', bigVisit: 'Hoge beurt',
            bullFinish: 'Bull-finish', highCheckout: 'Hoge checkout', bounceOut: 'Bounce-out',
            hundred: '100+', oneForty: '140+', attempts: 'geraakt', leg: 'LEG', darts: 'darts'
        }
    };

    let session = null;
    let cardTimer = null, cardHideTimer = null, focusTimer = null;
    let replayCueTimer = null, replayEndTimer = null, replayTransitionTimer = null, momentTimer = null;
    const cardQueue = [];
    const replaySlowMotion = 4.6;
    const replayShotLength = 2500;

    function text() { return translations[typeof currentLang === 'string' ? currentLang : 'pl'] || translations.en; }
    function tvActive() { return screen.classList.contains('match-tv-mode'); }
    function speed() {
        return typeof currentMatch !== 'undefined' && currentMatch?.isSpectator
            && typeof getSpectatorPlaybackSpeed === 'function' ? Math.max(.5, getSpectatorPlaybackSpeed()) : 1;
    }
    function makeSession(match) {
        return {
            match, visits: { p1: { hundred: 0, oneForty: 0 }, p2: { hundred: 0, oneForty: 0 } },
            visitHits: { p1: [], p2: [] }, completedVisits: 0, legs: [], replayRunning: false,
            presentationPending: false, pendingReplayKind: null, deferredActions: [],
            queuedBounceReplay: { p1: null, p2: null }, awaitingCallerReplay: null, waitingForCaller: false,
            replayPhase: 'idle', replayShot: null, focused: null, lastCard: null
        };
    }
    function ensureSession() {
        const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
        if (!session || session.match !== match) {
            session = makeSession(match);
            clearPresentation();
        }
        return session;
    }
    function sideName(side) {
        const fromScoreboard = document.getElementById(`broadcast-name-${side}`)?.textContent?.trim();
        if (fromScoreboard && fromScoreboard !== '—') return fromScoreboard;
        const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
        if (!match) return side.toUpperCase();
        if (match.isDoubles) return (side === 'p1' ? match.worldCupTeamP1 : match.worldCupTeamP2)?.country || side.toUpperCase();
        const candidate = side === 'p1' ? (match.isSpectator ? match.spectatorP1 : (typeof player !== 'undefined' ? player : null)) : match.opponent;
        return candidate?.name || side.toUpperCase();
    }
    function initials(name) {
        const words = String(name || '').trim().split(/\s+/).filter(Boolean);
        return (words.length > 1 ? `${words[0][0]}${words.at(-1)[0]}` : words[0]?.slice(0, 2) || '').toUpperCase();
    }
    function refreshStatCardPlayers() {
        const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
        const setMatch = match?.matchFormat?.type === 'sets';
        for (const side of ['p1', 'p2']) {
            const elements = statPlayers[side];
            const name = sideName(side);
            const sourcePhoto = document.getElementById(`score-photo-${side}`);
            const photoUrl = sourcePhoto?.currentSrc || sourcePhoto?.src || '';
            elements.name.textContent = name;
            elements.initial.textContent = initials(name);
            elements.score.textContent = String(match?.[`${side}Score`] ?? '—');
            elements.matchScore.textContent = String(match?.[`${side}${setMatch ? 'Sets' : 'Legs'}`] ?? 0);
            elements.photo.alt = name;
            elements.photo.classList.toggle('world-cup-flag-photo', Boolean(sourcePhoto?.classList.contains('world-cup-flag-photo')));
            if (photoUrl) {
                elements.photo.classList.remove('is-missing');
                elements.initial.hidden = true;
                if (elements.photo.src !== photoUrl) elements.photo.src = photoUrl;
            } else {
                elements.photo.removeAttribute('src');
                elements.photo.classList.add('is-missing');
                elements.initial.hidden = false;
            }
        }
        statFormat.textContent = document.getElementById('broadcast-format')?.textContent?.trim() || '';
        statMatchLabel.textContent = document.getElementById(setMatch ? 'broadcast-sets-label' : 'broadcast-legs-label')?.textContent?.trim()
            || (setMatch ? 'Sets' : 'Legs');
    }
    for (const side of ['p1', 'p2']) {
        statPlayers[side].photo.addEventListener('load', () => {
            statPlayers[side].photo.classList.remove('is-missing');
            statPlayers[side].initial.hidden = true;
        });
        statPlayers[side].photo.addEventListener('error', () => {
            statPlayers[side].photo.classList.add('is-missing');
            statPlayers[side].initial.hidden = false;
        });
    }
    function stats() { return (typeof currentMatch !== 'undefined' && currentMatch?.stats) || {}; }
    function checkoutLine(side) {
        const data = stats(), hits = Number(data[`${side}DoubleHits`]) || 0, attempts = Number(data[`${side}DoubleAttempts`]) || 0;
        return `${attempts ? Math.round(hits / attempts * 100) : 0}%  ·  ${hits}/${attempts} ${text().attempts}`;
    }
    function oneEighties(side) { return Number(stats()[`${side}OneEighties`]) || 0; }
    function field(target) {
        const sector = Number(target?.sector) || 0, mult = Number(target?.mult) || 0;
        if (sector === 25) return mult === 2 ? 'Bull' : '25';
        return `${mult === 3 ? 'T' : mult === 2 ? 'D' : ''}${sector}`;
    }
    function targetFromCode(code) {
        const value = String(code || '').trim();
        if (/^bull$/i.test(value)) return { sector: 25, mult: 2 };
        if (value === '25') return { sector: 25, mult: 1 };
        const parsed = /^([TDS])?(\d+)$/.exec(value);
        if (!parsed) return null;
        return { sector: Number(parsed[2]), mult: parsed[1] === 'T' ? 3 : parsed[1] === 'D' ? 2 : 1 };
    }
    function routeTarget(score, dartsLeft) {
        const route = window.matchBroadcastCheckout?.route(Number(score), Math.max(1, Number(dartsLeft) || 1));
        return targetFromCode(route?.[0]);
    }

    function cameraPercent(target) {
        if (!target || target.sector === 25) return { x: 50, y: 50 };
        const order = typeof dartboardOrder !== 'undefined' ? dartboardOrder : [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
        const index = order.indexOf(Number(target.sector));
        if (index < 0) return { x: 50, y: 50 };
        const radius = target.mult === 2 ? 36.8 : target.mult === 3 ? 22.2 : 30;
        const angle = -Math.PI / 2 + index * Math.PI / 10;
        return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
    }
    function focusTarget(target) {
        if (!tvActive() || !target) return false;
        cancelScheduledFocus();
        const clean = { sector: Number(target.sector), mult: Number(target.mult) || 1 };
        if (!Number.isFinite(clean.sector)) return false;
        const point = cameraPercent(clean), zoom = clean.mult === 2 ? 1.78 : 1.68;
        boardView.style.setProperty('--tv-focus-shift-x', `${(50 - point.x) * zoom}%`);
        boardView.style.setProperty('--tv-focus-shift-y', `${(50 - point.y) * zoom}%`);
        boardView.classList.add('tv-camera-focus');
        window.matchBoard3D?.focusTarget(clean.sector, clean.mult);
        ensureSession().focused = clean;
        return true;
    }
    function clearFocus() {
        cancelScheduledFocus();
        boardView.classList.remove('tv-camera-focus');
        boardView.style.removeProperty('--tv-focus-shift-x');
        boardView.style.removeProperty('--tv-focus-shift-y');
        window.matchBoard3D?.clearFocus();
        if (session) session.focused = null;
    }
    function cancelScheduledFocus() {
        clearTimeout(focusTimer);
        focusTimer = null;
    }
    function postImpactDelay() {
        let delay = typeof getMatchBoardAnimationDelay === 'function' ? getMatchBoardAnimationDelay(650) : 650;
        if (currentMatch?.isSpectator && typeof getSpectatorPlaybackDelay === 'function') {
            delay = getSpectatorPlaybackDelay(delay, delay);
        }
        return delay;
    }
    function afterDartImpact(state, action) {
        cancelScheduledFocus();
        const match = state.match;
        focusTimer = setTimeout(() => {
            focusTimer = null;
            if (!tvActive() || session !== state || currentMatch !== match || state.replayRunning) return;
            action();
        }, postImpactDelay());
    }

    function renderRows(rows) {
        statBody.replaceChildren();
        rows.forEach(([label, value, accent]) => {
            const row = document.createElement('div'); row.className = 'tv-stat-row';
            const name = document.createElement('span'); name.textContent = label;
            const result = document.createElement('strong'); result.textContent = value;
            if (accent) result.classList.add('is-accent');
            row.append(name, result); statBody.appendChild(row);
        });
    }
    function queueCard(card, priority = false) {
        if (!tvActive()) return;
        if (priority) cardQueue.unshift(card); else cardQueue.push(card);
        if (cardQueue.length > 5) cardQueue.splice(1, cardQueue.length - 5);
        pumpCards();
    }
    function pumpCards() {
        if (!tvActive() || !session || session.presentationPending || session.replayRunning || cardTimer || !cardQueue.length) return;
        const card = cardQueue.shift();
        statKicker.textContent = card.kicker;
        statTitle.textContent = card.title;
        renderRows(card.rows);
        refreshStatCardPlayers();
        statCard.hidden = false;
        requestAnimationFrame(() => statCard.classList.add('is-visible'));
        session.lastCard = card.kind;
        const minimum = currentMatch?.isSpectator ? 2400 : 4200;
        cardTimer = setTimeout(() => {
            cardTimer = null; statCard.classList.remove('is-visible');
            cardHideTimer = setTimeout(() => { statCard.hidden = true; cardHideTimer = null; pumpCards(); }, 380);
        }, Math.max(minimum, (card.duration || 5600) / speed()));
    }
    function overviewCard(kind = '180') {
        const copy = text();
        if (kind === 'checkout') return {
            kind, kicker: copy.matchStats, title: copy.checkout,
            rows: [['P1 · ' + sideName('p1'), checkoutLine('p1')], ['P2 · ' + sideName('p2'), checkoutLine('p2')]]
        };
        if (kind === 'visits') {
            const state = ensureSession();
            return { kind, kicker: copy.matchStats, title: copy.visits, rows: ['p1', 'p2'].map(side => [sideName(side), `${copy.hundred}  ${state.visits[side].hundred}   ·   ${copy.oneForty}  ${state.visits[side].oneForty}`]) };
        }
        return { kind: '180', kicker: copy.matchStats, title: copy.oneEighties,
            rows: [[sideName('p1'), String(oneEighties('p1')), oneEighties('p1') > 0], [sideName('p2'), String(oneEighties('p2')), oneEighties('p2') > 0]] };
    }
    function legCard() {
        const copy = text(), legs = ensureSession().legs.slice(-4).reverse();
        return { kind: 'legs', kicker: copy.matchStats, title: copy.legHistory, duration: 6500,
            rows: legs.map(leg => [`${copy.leg} ${leg.number} · ${leg.winner}`, copy.wonIn.replace('{darts}', leg.darts), leg.number === ensureSession().legs.length]) };
    }

    function captureFrame() {
        const from3D = window.matchBoard3D?.capture?.();
        if (from3D) return from3D;
        try { return board2D?.toDataURL('image/jpeg', .9) || null; } catch (_error) { return null; }
    }

    function replayPayload(event) {
        if (!event || event.bust) return null;
        const total = Number(event.visitScore) || 0;
        if (event.legCompleted) {
            const kind = Number(event.hit?.sector) === 25 && Number(event.hit?.mult) === 2
                ? 'bull-finish' : total >= 100 ? 'high-checkout' : 'checkout';
            return { ...event, replayKind: kind };
        }
        if (event.visitComplete && total === 180) return { ...event, replayKind: '180' };
        if (event.visitComplete && (total === 170 || total === 171)) return { ...event, replayKind: String(total) };
        if (event.bounced) return { ...event, replayKind: 'bounce' };
        return null;
    }
    function replayHeadline(payload) {
        const copy = text();
        if (payload.replayKind === '180') return copy.maximum;
        if (payload.replayKind === '170' || payload.replayKind === '171') return `${copy.bigVisit} ${payload.replayKind}`;
        if (payload.replayKind === 'bull-finish') return copy.bullFinish;
        if (payload.replayKind === 'high-checkout') return `${copy.highCheckout} ${Number(payload.visitScore) || ''}`.trim();
        if (payload.replayKind === 'bounce') return copy.bounceOut;
        return copy.replayOf;
    }
    function hideMomentBanner() {
        momentBanner.classList.remove('is-visible');
        momentBanner.hidden = true;
    }
    function showMomentBanner(payload) {
        const copy = text(), name = payload.playerName || sideName(payload.side);
        const leg = payload.legCompleted;
        momentKicker.textContent = leg ? copy.legWon : copy.moment;
        momentTitle.textContent = leg ? `LEG — ${name}`
            : payload.replayKind === '180' ? `180 — ${name}`
                : payload.replayKind === '170' || payload.replayKind === '171' ? `${payload.replayKind} — ${name}`
                    : `${replayHeadline(payload)} — ${name}`;
        const parts = [];
        if (leg && Number(payload.legDarts)) parts.push(`${payload.legDarts} ${copy.darts}`);
        parts.push(replayHeadline(payload));
        const shownTarget = payload.bounced ? payload.target : payload.hit;
        if (shownTarget?.sector) parts.push(field(shownTarget));
        momentDetail.textContent = parts.join('  ·  ');
        momentBanner.hidden = false;
        requestAnimationFrame(() => momentBanner.classList.add('is-visible'));
    }
    function releasePresentation(state = session) {
        if (!state) return;
        state.presentationPending = false;
        state.pendingReplayKind = null;
        state.waitingForCaller = false;
        screen.classList.remove('tv-director-hold');
        hideMomentBanner();
        const actions = state.deferredActions.splice(0);
        actions.forEach(entry => queueMicrotask(() => {
            if (typeof currentMatch !== 'undefined' && currentMatch === entry.match) entry.action();
        }));
    }
    function deferMatchAction(action) {
        const state = ensureSession();
        if (!tvActive() || !state.presentationPending || state.match !== currentMatch || typeof action !== 'function') return false;
        state.deferredActions.push({ match: currentMatch, action });
        return true;
    }

    function scaledReplayTime(milliseconds, minimum = 35) {
        return Math.max(minimum, Math.round(milliseconds / speed()));
    }
    function clearReplayTimers() {
        clearTimeout(replayCueTimer); clearTimeout(replayEndTimer); clearTimeout(replayTransitionTimer); clearTimeout(momentTimer);
        replayCueTimer = replayEndTimer = replayTransitionTimer = momentTimer = null;
    }
    function hideStinger() {
        replayStinger.hidden = true;
        replayStinger.classList.remove('is-covering', 'is-opening', 'is-outro');
    }
    function openStinger(onOpened = null) {
        replayStinger.classList.remove('is-covering');
        replayStinger.classList.add('is-opening');
        const duration = scaledReplayTime(620);
        replayTransitionTimer = setTimeout(() => {
            replayTransitionTimer = null; hideStinger();
            if (onOpened) onOpened();
        }, duration);
    }
    function coverWithStinger(outro, onCovered) {
        const duration = scaledReplayTime(620);
        replayStinger.style.setProperty('--stinger-duration', `${duration}ms`);
        replayStinger.hidden = false;
        replayStinger.classList.remove('is-covering', 'is-opening', 'is-outro');
        if (outro) replayStinger.classList.add('is-outro');
        requestAnimationFrame(() => replayStinger.classList.add('is-covering'));
        replayTransitionTimer = setTimeout(() => {
            replayTransitionTimer = null;
            if (onCovered) onCovered();
        }, duration);
    }
    function resetReplayDom() {
        window.matchBoard3D?.stopReplay?.();
        window.matchBoard3D?.endReplayCamera?.();
        replay.classList.remove('is-visible', 'is-live-3d');
        replay.hidden = true;
        replay.removeAttribute('data-shot');
        replayImage.removeAttribute('src');
        hideStinger();
        screen.classList.remove('tv-replay-running');
        watermark.classList.remove('is-replay-cue', 'is-replay', 'is-replay-outro');
        if (session) {
            session.replayRunning = false;
            session.replayPhase = 'idle';
            session.replayShot = null;
        }
        clearFocus();
        releasePresentation();
    }
    function finishReplay(skipped = false) {
        clearReplayTimers();
        if (skipped || !tvActive() || !session?.replayRunning) {
            resetReplayDom();
            pumpCards();
            return;
        }
        if (session.replayPhase === 'outro') return;
        session.replayPhase = 'outro';
        window.matchBoard3D?.stopReplay?.();
        watermark.classList.remove('is-replay-cue', 'is-replay');
        watermark.classList.add('is-replay-outro');
        coverWithStinger(true, () => {
            replay.classList.remove('is-visible', 'is-live-3d');
            replay.hidden = true;
            replay.removeAttribute('data-shot');
            replayImage.removeAttribute('src');
            window.matchBoard3D?.endReplayCamera?.();
            screen.classList.remove('tv-replay-running');
            clearFocus();
            openStinger(() => {
                watermark.classList.remove('is-replay-outro');
                if (session) {
                    session.replayRunning = false;
                    session.replayPhase = 'idle';
                    session.replayShot = null;
                }
                releasePresentation();
                pumpCards();
            });
        });
    }
    function setupReplay(payload) {
        if (!tvActive() || !session || session.match !== currentMatch) return null;
        const image = captureFrame();
        const boardState = window.matchBoard3D?.getState?.();
        const live3D = Boolean(boardState?.mode === '3d' && !boardState.failed
            && (boardState.darts > 0 || payload.bounced && payload.boardPoint));
        if (!image && !live3D) return null;
        replay.classList.toggle('is-live-3d', live3D);
        if (image) replayImage.src = image; else replayImage.removeAttribute('src');
        const details = [replayHeadline(payload), payload.playerName];
        if (payload.legCompleted && Number(payload.legDarts)) details.push(`${payload.legDarts} ${text().darts}`);
        const shownTarget = payload.bounced ? payload.target : payload.hit;
        if (shownTarget?.sector) details.push(field(shownTarget));
        replayCaption.textContent = details.filter(Boolean).join(' · ');
        document.getElementById('tv-replay-badge').textContent = text().replay;
        replay.setAttribute('aria-label', text().replay);
        replayImage.alt = text().replayOf;
        replaySkip.textContent = text().skip;
        replay.hidden = false;
        requestAnimationFrame(() => replay.classList.add('is-visible'));
        return { live3D };
    }
    function playReplayShot(payload, shot, live3D) {
        if (!session?.replayRunning || session.replayPhase !== 'playing') return;
        session.replayShot = shot;
        replay.dataset.shot = shot;
        if (live3D) {
            window.matchBoard3D?.setReplayShot?.(shot, payload.bounced ? payload.target : payload.hit, scaledReplayTime(480));
            if (payload.bounced) window.matchBoard3D?.replayThrow?.(payload, replaySlowMotion);
            else window.matchBoard3D?.replayLastDart?.(replaySlowMotion);
        }
    }
    function replayShot(payload) {
        if (payload.bounced) return 'left-low';
        if (payload.legCompleted) return 'left-tight';
        return 'front-tight';
    }
    function startReplaySequence(payload, live3D) {
        if (!session?.replayRunning) return;
        session.replayPhase = 'playing';
        watermark.classList.remove('is-replay-cue'); watermark.classList.add('is-replay');
        playReplayShot(payload, replayShot(payload), live3D);
        replayEndTimer = setTimeout(() => finishReplay(false), scaledReplayTime(replayShotLength + 150));
    }
    function beginReplayTransition(payload) {
        if (!tvActive() || !session || session.match !== currentMatch) return;
        clearTimeout(cardTimer); clearTimeout(cardHideTimer); cardTimer = cardHideTimer = null;
        statCard.classList.remove('is-visible'); statCard.hidden = true;
        session.replayRunning = true;
        session.replayPhase = 'intro';
        session.replayShot = null;
        screen.classList.add('tv-replay-running');
        stingerLabel.textContent = text().replay;
        coverWithStinger(false, () => {
            const prepared = setupReplay(payload);
            if (!prepared) { finishReplay(true); return; }
            replayTransitionTimer = setTimeout(() => {
                replayTransitionTimer = null;
                openStinger();
                startReplaySequence(payload, prepared.live3D);
            }, scaledReplayTime(360));
        });
    }
    function scheduleReplayCue(payload, state, callerFinished) {
        if (!tvActive() || session !== state || currentMatch !== state.match || !state.presentationPending) {
            releasePresentation(state);
            return;
        }
        let delay = callerFinished ? 120
            : (typeof getMatchBoardAnimationDelay === 'function' ? getMatchBoardAnimationDelay(620) : 620);
        if (!callerFinished && currentMatch?.isSpectator && typeof getSpectatorPlaybackDelay === 'function') {
            delay = getSpectatorPlaybackDelay(delay, delay);
        }
        const minimum = callerFinished ? 80 : (currentMatch?.isSpectator ? 25 : 450);
        replayCueTimer = setTimeout(() => {
            replayCueTimer = null;
            if (!tvActive() || session !== state || currentMatch !== state.match || !state.presentationPending) { releasePresentation(state); return; }
            showMomentBanner(payload);
            const hold = payload.legCompleted ? 1450 : 1100;
            momentTimer = setTimeout(() => {
                momentTimer = null;
                momentBanner.classList.remove('is-visible');
                momentTimer = setTimeout(() => {
                    momentTimer = null; momentBanner.hidden = true; beginReplayTransition(payload);
                }, scaledReplayTime(340));
            }, scaledReplayTime(hold));
        }, Math.min(1050, Math.max(minimum, delay)));
    }
    function prepareReplay(payload, callerCompletion = null) {
        const state = ensureSession();
        if (!tvActive() || !payload || state.presentationPending) return false;
        clearTimeout(replayCueTimer); clearTimeout(momentTimer);
        state.presentationPending = true;
        state.pendingReplayKind = payload.replayKind;
        state.waitingForCaller = Boolean(callerCompletion && typeof callerCompletion.then === 'function');
        screen.classList.add('tv-director-hold');
        clearTimeout(cardTimer); clearTimeout(cardHideTimer); cardTimer = cardHideTimer = null;
        statCard.classList.remove('is-visible'); statCard.hidden = true;
        watermark.classList.add('is-replay-cue');
        if (state.waitingForCaller) {
            Promise.resolve(callerCompletion).catch(() => undefined).then(() => {
                if (session !== state || !state.presentationPending || state.pendingReplayKind !== payload.replayKind) return;
                state.waitingForCaller = false;
                scheduleReplayCue(payload, state, true);
            });
        } else scheduleReplayCue(payload, state, false);
        return true;
    }

    function onCaller(callerCompletion, context = {}) {
        const state = ensureSession();
        const payload = state.awaitingCallerReplay;
        if (!tvActive() || !payload || state.presentationPending) return false;
        if (context.side && payload.side && context.side !== payload.side) return false;
        state.awaitingCallerReplay = null;
        return prepareReplay(payload, callerCompletion);
    }

    function clearPresentation(clearQueue = true) {
        clearTimeout(cardTimer); clearTimeout(cardHideTimer); cancelScheduledFocus(); clearReplayTimers();
        cardTimer = cardHideTimer = null;
        if (clearQueue) cardQueue.length = 0;
        statCard.classList.remove('is-visible'); statCard.hidden = true;
        hideMomentBanner();
        replay.classList.remove('is-visible'); replay.hidden = true; replayImage.removeAttribute('src');
        replay.classList.remove('is-live-3d'); replay.removeAttribute('data-shot');
        hideStinger();
        window.matchBoard3D?.stopReplay?.();
        window.matchBoard3D?.endReplayCamera?.();
        screen.classList.remove('tv-replay-running', 'tv-director-hold');
        watermark.classList.remove('is-replay-cue', 'is-replay', 'is-replay-outro');
        if (session) {
            session.replayRunning = false; session.replayPhase = 'idle'; session.replayShot = null;
            session.waitingForCaller = false; session.awaitingCallerReplay = null;
            session.queuedBounceReplay.p1 = null; session.queuedBounceReplay.p2 = null;
        }
        releasePresentation();
    }

    function onMode(enabled) {
        const state = ensureSession();
        if (!enabled) { clearPresentation(); clearFocus(); return; }
        replaySkip.textContent = text().skip;
        setTimeout(() => { if (tvActive() && session === state) queueCard(overviewCard('180')); }, 650);
        const match = state.match;
        if (match) {
            const side = match.turn === 'p2' ? 'p2' : 'p1';
            const target = routeTarget(match[`${side}Score`], 3 - (match.dartsThrown || 0));
            if (target) focusTarget(target);
        }
    }
    function onAim(event) {
        const state = ensureSession();
        if (!tvActive() || state.presentationPending || !event?.aim || event.side !== currentMatch?.turn) return;
        const hits = state.visitHits[event.side] || [];
        const lastTwo = hits.slice(-2);
        const groupedTreble = lastTwo.length === 2 && lastTwo.every(hit => hit.mult === 3 && hit.sector === lastTwo[0].sector && hit.sector >= 17);
        if (Number(event.score) <= 170 || groupedTreble) focusTarget(event.aim);
    }
    function onThrow(event) {
        const state = ensureSession();
        if (!event?.side) return;
        const side = event.side;
        if (!event.bounced && !event.bust && event.hit?.sector) state.visitHits[side].push({ sector: Number(event.hit.sector), mult: Number(event.hit.mult) });

        if (event.visitComplete) {
            const total = Number(event.visitScore) || 0;
            if (!event.bust && total >= 100 && total < 140) state.visits[side].hundred++;
            else if (!event.bust && total >= 140 && total < 180) state.visits[side].oneForty++;
            state.completedVisits++;
        }

        const highlight = tvActive() ? replayPayload(event) : null;
        let callerQueued = false;
        if (tvActive() && highlight?.replayKind === 'bounce' && !event.visitComplete) {
            state.queuedBounceReplay[side] = highlight;
            state.pendingReplayKind = 'bounce';
        } else if (tvActive() && !event.legCompleted
            && ((highlight && (highlight.replayKind === '180' || highlight.replayKind === 'bounce'))
                || (event.visitComplete && state.queuedBounceReplay[side]))) {
            state.awaitingCallerReplay = highlight?.replayKind === '180' || highlight?.replayKind === 'bounce'
                ? highlight : state.queuedBounceReplay[side];
            state.queuedBounceReplay[side] = null;
            state.pendingReplayKind = state.awaitingCallerReplay.replayKind;
            callerQueued = true;
        } else if (highlight) {
            if (event.legCompleted) state.queuedBounceReplay[side] = null;
            prepareReplay(highlight);
        }
        if (tvActive() && event.visitComplete && Number(event.visitScore) === 180) queueCard(overviewCard('180'), true);
        if (event.legCompleted) {
            const number = Math.max(state.legs.length + 1, (Number(currentMatch?.totalLegsPlayed) || 0) + 1);
            const winner = currentMatch?.isDoubles ? sideName(side) : (event.playerName || sideName(side));
            state.legs.push({ number, winner, darts: Number(event.legDarts) || 0 });
            state.visitHits[side] = [];
            if (tvActive()) {
                if (state.legs.length % 2 === 0) queueCard(legCard());
                else queueCard(overviewCard('checkout'));
            }
            return;
        }

        if (tvActive() && event.visitComplete) {
            if (state.completedVisits % 8 === 0) queueCard(overviewCard('checkout'));
            else if (state.completedVisits % 4 === 0) queueCard(overviewCard('visits'));
        }

        if (!tvActive()) return;
        if (highlight || callerQueued) {
            if (event.visitComplete) state.visitHits[side] = [];
            return;
        }
        if (event.visitComplete || event.bust) {
            afterDartImpact(state, clearFocus);
            state.visitHits[side] = [];
            return;
        }
        const checkoutTarget = routeTarget(event.scoreAfter, 3 - Number(event.dartNumber));
        if (checkoutTarget) { afterDartImpact(state, () => focusTarget(checkoutTarget)); return; }
        const hits = state.visitHits[side].slice(-2);
        if (hits.length === 2 && hits.every(hit => hit.mult === 3 && hit.sector === hits[0].sector && hit.sector >= 17)) {
            afterDartImpact(state, () => focusTarget(hits[0]));
        }
    }

    function previewSelectedAim() {
        if (!tvActive() || !currentMatch || currentMatch.isSpectator || currentMatch.turn !== 'p1') return;
        const sectorValue = Number(document.getElementById('aim-sector')?.value);
        const multiplierValue = Number(document.getElementById('aim-multiplier')?.value);
        const aim = sectorValue === 50 ? { sector: 25, mult: 2 } : { sector: sectorValue, mult: multiplierValue };
        onAim({ side: 'p1', aim, score: currentMatch.p1Score, dartNumber: currentMatch.dartsThrown + 1 });
    }
    document.addEventListener('click', event => {
        if (event.target.closest('.aim-sector-btn, .aim-multiplier-btn')) queueMicrotask(previewSelectedAim);
    });
    document.addEventListener('click', event => {
        if (event.target.closest('#board-view-2d, #board-view-3d')) clearFocus();
    }, true);
    replaySkip.addEventListener('click', () => finishReplay(true));

    window.matchTVDirector = Object.freeze({
        onMode, onAim, onThrow, onCaller, focusTarget, clearFocus, deferMatchAction,
        showOverview(kind = '180') { if (tvActive()) queueCard(overviewCard(kind), true); },
        skipReplay() { if (session?.presentationPending || session?.replayRunning) finishReplay(true); },
        getState() {
            const state = ensureSession();
            return { active: tvActive(), visits: JSON.parse(JSON.stringify(state.visits)), completedVisits: state.completedVisits,
                legs: state.legs.map(leg => ({ ...leg })), replay: state.replayRunning,
                presentationPending: state.presentationPending, pendingReplayKind: state.pendingReplayKind,
                waitingForCaller: state.waitingForCaller, awaitingCallerReplay: state.awaitingCallerReplay?.replayKind || null,
                deferredActions: state.deferredActions.length,
                replayPhase: state.replayPhase, replayShot: state.replayShot, replaySlowMotion,
                stinger: replayStinger.hidden ? 'hidden' : replayStinger.classList.contains('is-covering') ? 'covering' : 'opening',
                focused: state.focused ? { ...state.focused } : null,
                card: state.lastCard, queuedCards: cardQueue.length };
        }
    });
})();
