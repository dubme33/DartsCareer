function getTournamentSpectatorPlayerKey(candidate) {
    if (!candidate) return '';
    return String(candidate.id || `${candidate.name || ''}|${candidate.country || ''}`);
}

function getTournamentSpectatorMatchKey(p1, p2, round = tournamentRound) {
    return `${round}::${getTournamentSpectatorPlayerKey(p1)}::${getTournamentSpectatorPlayerKey(p2)}`;
}

function getSpectatedTournamentMatchResult(p1, p2, round = tournamentRound, consume = false) {
    const results = activeTournament?.spectatedMatchResults;
    if (!results || typeof results !== 'object') return null;
    const key = getTournamentSpectatorMatchKey(p1, p2, round);
    const stored = results[key];
    if (!stored) return null;

    const p1Key = getTournamentSpectatorPlayerKey(p1);
    const p1Won = stored.winnerKey === p1Key;
    const result = {
        winner: p1Won ? p1 : p2,
        loser: p1Won ? p2 : p1,
        scoreStr: stored.scoreStr,
        p1Avg: stored.p1Avg,
        p2Avg: stored.p2Avg,
        p1Score: stored.p1Score,
        p2Score: stored.p2Score,
        spectated: true
    };

    if (consume) {
        delete results[key];
        if (Object.keys(results).length === 0) delete activeTournament.spectatedMatchResults;
    }
    return result;
}

function resolveTournamentAiMatch(p1, p2, matchFormat, round = tournamentRound) {
    return getSpectatedTournamentMatchResult(p1, p2, round, true)
        || simulateAImatch(p1, p2, matchFormat);
}

function getCurrentSinglesMatchPlayer(isP1) {
    if (!currentMatch) return null;
    if (currentMatch.isSpectator) return isP1 ? currentMatch.spectatorP1 : currentMatch.opponent;
    return isP1 ? player : currentMatch.opponent;
}

function getCurrentSinglesMatchPlayerName(isP1) {
    return getCurrentSinglesMatchPlayer(isP1)?.name || '';
}

const SPECTATOR_PLAYBACK_SPEEDS = Object.freeze([1, 2, 4, 8, 16]);
let spectatorPendingPlayback = null;

function getSpectatorPlaybackSpeed() {
    const speed = Number(currentMatch?.spectatorPlaybackSpeed);
    return SPECTATOR_PLAYBACK_SPEEDS.includes(speed) ? speed : 1;
}

function getSpectatorPlaybackDelay(normalDelay, spectatorBaseDelay = normalDelay) {
    if (!currentMatch?.isSpectator) return normalDelay;
    return Math.max(25, Math.round(spectatorBaseDelay / getSpectatorPlaybackSpeed()));
}

function armSpectatorPendingPlayback(pending) {
    if (!pending || currentMatch !== pending.match || pending.match.spectatorPaused) return null;
    pending.startedAt = Date.now();
    pending.timerId = setTimeout(() => {
        if (spectatorPendingPlayback !== pending || currentMatch !== pending.match) return;
        if (pending.match.spectatorPaused) {
            pending.remaining = 0;
            pending.timerId = null;
            return;
        }

        spectatorPendingPlayback = null;
        window.aiTimeout = null;
        pending.callback();
    }, pending.remaining);
    window.aiTimeout = pending.timerId;
    return pending.timerId;
}

function scheduleSpectatorPlaybackAction(callback, normalDelay, spectatorBaseDelay = normalDelay) {
    if (!currentMatch?.isSpectator) return setTimeout(callback, normalDelay);

    if (spectatorPendingPlayback?.timerId) clearTimeout(spectatorPendingPlayback.timerId);
    const pending = {
        match: currentMatch,
        callback,
        remaining: getSpectatorPlaybackDelay(normalDelay, spectatorBaseDelay),
        startedAt: null,
        timerId: null
    };
    spectatorPendingPlayback = pending;
    if (currentMatch.spectatorPaused) return null;
    return armSpectatorPendingPlayback(pending);
}

function setSpectatorPaused(paused) {
    if (!currentMatch?.isSpectator) return false;
    const shouldPause = Boolean(paused);
    if (currentMatch.spectatorPaused === shouldPause) return shouldPause;

    currentMatch.spectatorPaused = shouldPause;
    const pending = spectatorPendingPlayback;
    if (pending?.match === currentMatch) {
        if (shouldPause && pending.timerId) {
            const elapsed = Math.max(0, Date.now() - pending.startedAt);
            pending.remaining = Math.max(0, pending.remaining - elapsed);
            clearTimeout(pending.timerId);
            pending.timerId = null;
            window.aiTimeout = null;
        } else if (!shouldPause && !pending.timerId) {
            armSpectatorPendingPlayback(pending);
        }
    } else if (!shouldPause && !currentMatch.introInProgress && typeof setTurnUI === 'function') {
        setTurnUI();
    }

    updateSpectatorSpeedControls();
    return shouldPause;
}

function toggleSpectatorPause() {
    if (!currentMatch?.isSpectator) return false;
    return setSpectatorPaused(!currentMatch.spectatorPaused);
}

function updateSpectatorSpeedControls() {
    const controls = document.getElementById('spectator-speed-controls');
    if (!controls) return;

    const spectating = Boolean(currentMatch?.isSpectator);
    controls.style.display = spectating ? 'flex' : 'none';
    const pauseButton = document.getElementById('spectator-pause-btn');
    if (pauseButton) {
        const paused = Boolean(currentMatch?.spectatorPaused);
        const translationKey = paused ? 't-spectator-resume' : 't-spectator-pause';
        const fallbackLabel = paused ? 'Wznów' : 'Pauza';
        pauseButton.innerText = `${paused ? '▶' : '⏸'} ${typeof t === 'function' ? t(translationKey) : fallbackLabel}`;
        pauseButton.classList.toggle('paused', paused);
        pauseButton.setAttribute('aria-pressed', String(paused));
    }
    if (!spectating || typeof controls.querySelectorAll !== 'function') return;

    const selectedSpeed = getSpectatorPlaybackSpeed();
    controls.querySelectorAll('[data-spectator-speed]').forEach(button => {
        const isActive = Number(button.dataset.spectatorSpeed) === selectedSpeed;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

function setSpectatorPlaybackSpeed(speed) {
    const parsedSpeed = Number(speed);
    if (!currentMatch?.isSpectator || !SPECTATOR_PLAYBACK_SPEEDS.includes(parsedSpeed)) {
        return getSpectatorPlaybackSpeed();
    }

    currentMatch.spectatorPlaybackSpeed = parsedSpeed;
    updateSpectatorSpeedControls();
    return parsedSpeed;
}

function setSpectatorMatchControls(spectating) {
    const controls = document.getElementById('player-controls');
    const throwButton = document.getElementById('throw-btn');
    const simulateLegButton = document.getElementById('t-btn-sim-leg');
    const simulateMatchButton = document.getElementById('t-btn-sim-match');
    const backButton = document.getElementById('t-btn-match-back');
    if (controls) controls.style.display = spectating ? 'none' : '';
    if (throwButton) throwButton.style.display = spectating ? 'none' : '';
    if (simulateLegButton) simulateLegButton.style.display = spectating ? 'none' : '';
    if (simulateMatchButton) simulateMatchButton.style.display = spectating ? 'none' : '';
    if (backButton) backButton.style.display = spectating ? 'none' : '';
    updateSpectatorSpeedControls();
}

function setSpectatorPlayerPhoto(elementId, candidate, fallbackLabel) {
    const image = document.getElementById(elementId);
    if (!image) return;
    image.classList.remove('world-cup-flag-photo');
    const customPhoto = typeof getPlayerProfilePhoto === 'function' ? getPlayerProfilePhoto(candidate) : candidate.photo;
    const modPhoto = typeof moddedAssets !== 'undefined'
        ? (moddedAssets.photos?.[candidate.name] || moddedAssets.photos?.[candidate.sourceName])
        : null;
    image.src = customPhoto || modPhoto || `zdjecia/${encodeURIComponent(candidate.sourceName || candidate.name)}.png`;
    image.onerror = function spectatorPhotoFallback() {
        this.onerror = null;
        this.src = `https://placehold.co/100/16213e/FFFFFF?text=${fallbackLabel}`;
    };
}

function startSpectatingTournamentMatch(bracketIndex) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (!activeTournament || currentMatch || !Array.isArray(tournamentBracket)) return false;
    const p1 = tournamentBracket[bracketIndex];
    const p2 = tournamentBracket[bracketIndex + 1];
    if (!p1 || !p2 || p1.isBye || p2.isBye || isCurrentPlayer(p1) || isCurrentPlayer(p2)) return false;

    const existingResult = getSpectatedTournamentMatchResult(p1, p2);
    if (existingResult) return false;

    const matchFormat = getTournamentMatchFormat(activeTournament, tournamentRound);
    const starter = Math.random() < 0.5 ? 'p1' : 'p2';
    currentMatch = {
        vsAI: true,
        isTournament: true,
        isSpectator: true,
        spectatorP1: p1,
        opponent: p2,
        spectatorPlaybackSpeed: 1,
        spectatorPaused: false,
        spectatorRound: tournamentRound,
        spectatorMatchIndex: bracketIndex,
        p1Score: 501,
        p2Score: 501,
        p1Legs: 0,
        p2Legs: 0,
        p1Sets: 0,
        p2Sets: 0,
        totalLegsPlayed: 0,
        legsToWin: matchFormat.type === 'sets' ? matchFormat.legsPerSet : matchFormat.legsToWin,
        matchFormat,
        turn: starter,
        startingPlayer: starter,
        dartsThrown: 0,
        isTurnLocked: false,
        p1TurnStartScore: 501,
        p2TurnStartScore: 501,
        p1Momentum: 0,
        p2Momentum: 0,
        p1PeakPerformance: typeof rollAiPeakMatchPerformance === 'function' ? rollAiPeakMatchPerformance(p1) : null,
        p2PeakPerformance: typeof rollAiPeakMatchPerformance === 'function' ? rollAiPeakMatchPerformance(p2) : null,
        stats: {
            p1TotalDarts: 0, p1AccumulatedScore: 0, p1First9Score: 0, p1First9Darts: 0, p1LegDarts: 0,
            p1HighCheckout: 0, p1DoubleAttempts: 0, p1DoubleHits: 0, p1OneEighties: 0,
            p2TotalDarts: 0, p2AccumulatedScore: 0, p2First9Score: 0, p2First9Darts: 0, p2LegDarts: 0,
            p2HighCheckout: 0, p2DoubleAttempts: 0, p2DoubleHits: 0, p2OneEighties: 0
        }
    };

    currentTurnScore = 0;
    drawnDarts = [];
    document.getElementById('bracket-modal').style.display = 'none';
    document.getElementById('match-log').innerHTML = '';
    document.getElementById('score-col-ai').style.display = 'flex';
    document.getElementById('match-p1-name').innerHTML = `${getFlagImg(p1.country)} ${escapeHtml(p1.name)}`;
    document.getElementById('match-p2-name').innerHTML = `${getFlagImg(p2.country)} ${escapeHtml(p2.name)}`;
    document.getElementById('match-title').innerText = `👁 ${t('t-spectator-title')}: ${getRoundName(tournamentRound)} (${getMatchFormatLabel(matchFormat)})`;
    setSpectatorPlayerPhoto('score-photo-p1', p1, 'P1');
    setSpectatorPlayerPhoto('score-photo-p2', p2, 'P2');
    if (typeof applyMatchPlayerPresentationThemes === 'function') {
        applyMatchPlayerPresentationThemes(p1, p2);
    }
    setSpectatorMatchControls(true);

    drawDartboard();
    updateDartDots();
    updateScores();
    updateMatchStatsUI();
    showScreen('screen-match');
    logThrow(`👁 ${t('t-spectator-watching')}: ${escapeHtml(p1.name)} vs ${escapeHtml(p2.name)}`, 'system');
    if (typeof playMatchIntro === 'function') playMatchIntro(p1.name, p2.name);
    else setTurnUI();
    return true;
}

function finishSpectatedTournamentMatch() {
    if (!currentMatch?.isSpectator || !activeTournament) return false;
    const watchedMatch = currentMatch;
    const p1 = watchedMatch.spectatorP1;
    const p2 = watchedMatch.opponent;
    const isSets = watchedMatch.matchFormat?.type === 'sets';
    const p1Score = isSets ? watchedMatch.p1Sets : watchedMatch.p1Legs;
    const p2Score = isSets ? watchedMatch.p2Sets : watchedMatch.p2Legs;
    const p1Won = p1Score > p2Score;
    const winner = p1Won ? p1 : p2;
    const winnerScore = Math.max(p1Score, p2Score);
    const loserScore = Math.min(p1Score, p2Score);
    const p1Points = watchedMatch.stats.p1AccumulatedScore + (501 - watchedMatch.p1Score);
    const p2Points = watchedMatch.stats.p2AccumulatedScore + (501 - watchedMatch.p2Score);
    const p1Average = formatStat(p1Points, watchedMatch.stats.p1TotalDarts);
    const p2Average = formatStat(p2Points, watchedMatch.stats.p2TotalDarts);
    const key = getTournamentSpectatorMatchKey(p1, p2, watchedMatch.spectatorRound);

    if (!activeTournament.spectatedMatchResults || typeof activeTournament.spectatedMatchResults !== 'object') {
        activeTournament.spectatedMatchResults = {};
    }
    activeTournament.spectatedMatchResults[key] = {
        round: watchedMatch.spectatorRound,
        p1Key: getTournamentSpectatorPlayerKey(p1),
        p2Key: getTournamentSpectatorPlayerKey(p2),
        winnerKey: getTournamentSpectatorPlayerKey(winner),
        scoreStr: `${winnerScore}:${loserScore}`,
        p1Score,
        p2Score,
        p1Avg: p1Average,
        p2Avg: p2Average
    };

    if (typeof recordSeasonHighestAverage === 'function') {
        recordSeasonHighestAverage(p1, Number(p1Average));
        recordSeasonHighestAverage(p2, Number(p2Average));
    }
    if (typeof recordCompletedSinglesMatch === 'function') recordCompletedSinglesMatch(watchedMatch);

    clearTimeout(window.aiTimeout);
    if (spectatorPendingPlayback?.match === watchedMatch) spectatorPendingPlayback = null;
    currentMatch = null;
    currentTurnScore = 0;
    drawnDarts = [];
    setSpectatorMatchControls(false);
    showScreen('screen-hub');
    showBracket();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}
