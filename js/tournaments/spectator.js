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
        leagueCounted: stored.leagueCounted === true,
        p1Scored: stored.p1Scored, p2Scored: stored.p2Scored, p1Darts: stored.p1Darts, p2Darts: stored.p2Darts,
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

function isMatchPlaybackControlled(match = currentMatch) {
    return Boolean(match && (match.isSpectator || match.careerAutoplay));
}

function canStartCareerAutoplay(match = currentMatch) {
    return Boolean(match?.vsAI && !match.isSpectator && !match.careerAutoplay
        && !match.isFinishing && !match.matchEnding && !match.matchIncidents?.pending
        && !(typeof isMatchFinished === 'function' && isMatchFinished(match))
        && !(typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())
        && !(match.bullOff && ['tie', 'result'].includes(match.bullOff.status)));
}

function startCareerAutoplay(highlights = false) {
    if (!canStartCareerAutoplay()) return false;
    const match = currentMatch;
    match.careerAutoplay = true;
    match.spectatorPaused = false;
    match.spectatorPlaybackSpeed = 1;
    match.spectatorHighlights = highlights === true;
    match.spectatorSkipThrow = false;
    if (spectatorPendingPlayback?.match !== match) spectatorPendingPlayback = null;
    setSpectatorMatchControls(true);
    if (match.introInProgress && typeof ensureCareerAutoplayIntro === 'function') ensureCareerAutoplayIntro();
    if (typeof isMatchBullOffPending === 'function' && isMatchBullOffPending(match)) {
        if (match.bullOff.status === 'pending' && !match.bullOff.waitingForRemoval) scheduleMatchBullAi(match);
        renderMatchBullOff(match);
    } else if (!match.introInProgress) setTurnUI();
    return true;
}

function stopCareerAutoplay() {
    if (!currentMatch?.careerAutoplay || currentMatch.isFinishing) return false;
    const match = currentMatch;
    match.careerAutoplay = false;
    match.spectatorPaused = false;
    match.spectatorSkipThrow = false;
    const pending = spectatorPendingPlayback;
    const playerTurn = match.turn === 'p1' && (!match.isDoubles || isCareerPlayerThrowing(true));
    const playerBullTurn = match.bullOff?.status === 'pending' && match.bullOff.turn === 'p1';
    let retainedAction = false;
    if (pending?.match === match) {
        if (pending.kind === 'throw' && (isMatchBullOffPendingSafe(match) ? playerBullTurn : playerTurn)) {
            clearTimeout(pending.timerId);
            spectatorPendingPlayback = null;
            window.aiTimeout = null;
        } else {
            retainedAction = true;
            if (!pending.timerId) armSpectatorPendingPlayback(pending);
        }
    }
    setSpectatorMatchControls(false);
    if (!match.isDartInFlight) {
        updateScores(); updateMatchStatsUI(); updateDartDots(); drawDartboard();
    }
    if (isMatchBullOffPendingSafe(match)) {
        renderMatchBullOff(match);
        if (!retainedAction && match.bullOff.status === 'pending' && !match.bullOff.waitingForRemoval) scheduleMatchBullAi(match);
    } else if (!retainedAction && !match.introInProgress) setTurnUI();
    return true;
}

function isMatchBullOffPendingSafe(match) {
    return typeof isMatchBullOffPending === 'function' && isMatchBullOffPending(match);
}

// Use the live dart engine for the omitted scoring. Never skip a checkout visit
// or a deciding leg, so every leg/set/match winner is still seen on the board.
function shouldSkipSpectatorScoring(match = currentMatch) {
    if (!isMatchPlaybackControlled(match) || !match.spectatorHighlights || match.introInProgress
        || match.isFinishing || match.matchEnding || match.suddenDeath
        || (typeof isMatchBullOffPending === 'function' && isMatchBullOffPending(match))) return false;
    if (!(match.p1Score > 170 && match.p2Score > 170)) return false;
    // Reveal the last dart of a potential maximum, with the two scored darts
    // already on the board. TV can replay the complete recorded visit.
    if (match === currentMatch && match.dartsThrown === 2
        && typeof currentTurnScore !== 'undefined' && currentTurnScore === 120) return false;
    const format = match.matchFormat || {};
    const target = Number(format.type === 'sets' ? format.legsPerSet : format.legsToWin);
    return !(target > 1 && match.p1Legs >= target - 1 && match.p2Legs >= target - 1);
}

function setSpectatorHighlights(enabled) {
    if (!isMatchPlaybackControlled()) return false;
    currentMatch.spectatorHighlights = enabled === true;
    if (!currentMatch.spectatorHighlights) {
        currentMatch.spectatorSkipThrow = false;
        if (!currentMatch.isDartInFlight) {
            updateScores(); updateMatchStatsUI(); updateDartDots(); drawDartboard();
        }
    }
    updateSpectatorSpeedControls();
    return currentMatch.spectatorHighlights;
}

function toggleSpectatorHighlights() {
    return setSpectatorHighlights(!currentMatch?.spectatorHighlights);
}

function getSpectatorPlaybackSpeed() {
    const speed = Number(currentMatch?.spectatorPlaybackSpeed);
    return SPECTATOR_PLAYBACK_SPEEDS.includes(speed) ? speed : 1;
}

function getSpectatorPlaybackDelay(normalDelay, spectatorBaseDelay = normalDelay) {
    if (!isMatchPlaybackControlled()) return normalDelay;
    // Yield between omitted darts: pause/exit can interrupt even a long match.
    if (shouldSkipSpectatorScoring()) return 10;
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

function scheduleSpectatorPlaybackAction(callback, normalDelay, spectatorBaseDelay = normalDelay, kind = 'flow') {
    if (!isMatchPlaybackControlled()) return setTimeout(callback, normalDelay);

    if (spectatorPendingPlayback?.timerId) clearTimeout(spectatorPendingPlayback.timerId);
    const pending = {
        match: currentMatch,
        callback,
        kind,
        remaining: getSpectatorPlaybackDelay(normalDelay, spectatorBaseDelay),
        startedAt: null,
        timerId: null
    };
    spectatorPendingPlayback = pending;
    if (currentMatch.spectatorPaused) return null;
    return armSpectatorPendingPlayback(pending);
}

function setSpectatorPaused(paused) {
    if (!isMatchPlaybackControlled()) return false;
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
        if (isMatchBullOffPendingSafe(currentMatch)) scheduleMatchBullAi(currentMatch);
        else if (!window.matchTVDirector?.deferMatchAction?.(setTurnUI)) setTurnUI();
    }

    updateSpectatorSpeedControls();
    return shouldPause;
}

function toggleSpectatorPause() {
    if (!isMatchPlaybackControlled()) return false;
    return setSpectatorPaused(!currentMatch.spectatorPaused);
}

function updateSpectatorSpeedControls() {
    const controls = document.getElementById('spectator-speed-controls');
    if (!controls) return;

    const spectating = isMatchPlaybackControlled();
    controls.style.display = spectating ? 'flex' : 'none';
    const exitButton = document.getElementById('spectator-exit-btn');
    if (exitButton) exitButton.style.display = currentMatch?.isSpectator ? '' : 'none';
    const stopButton = document.getElementById('career-autoplay-stop-btn');
    if (stopButton) stopButton.style.display = currentMatch?.careerAutoplay ? '' : 'none';
    const startControls = document.getElementById('career-autoplay-controls');
    if (startControls) startControls.style.display = currentMatch?.vsAI && !spectating ? 'flex' : 'none';
    document.querySelectorAll?.('[data-career-autoplay-start]').forEach(button => {
        button.disabled = !canStartCareerAutoplay();
        button.title = t('t-career-autoplay-help');
    });
    const bullStart = document.getElementById('bull-autoplay-start');
    const bullControls = document.getElementById('bull-playback-controls');
    if (bullStart) bullStart.style.display = currentMatch?.isSpectator || currentMatch?.careerAutoplay ? 'none' : 'flex';
    if (bullControls) bullControls.style.display = spectating ? 'flex' : 'none';
    const bullStop = document.getElementById('bull-autoplay-stop');
    if (bullStop) bullStop.style.display = currentMatch?.careerAutoplay ? '' : 'none';
    const pauseButton = document.getElementById('spectator-pause-btn');
    if (pauseButton) {
        const paused = Boolean(currentMatch?.spectatorPaused);
        const translationKey = paused ? 't-spectator-resume' : 't-spectator-pause';
        const fallbackLabel = paused ? 'Wznów' : 'Pauza';
        pauseButton.innerText = `${paused ? '▶' : '⏸'} ${typeof t === 'function' ? t(translationKey) : fallbackLabel}`;
        pauseButton.classList.toggle('paused', paused);
        pauseButton.setAttribute('aria-pressed', String(paused));
        const bullPause = document.getElementById('bull-playback-pause');
        if (bullPause) {
            bullPause.innerText = pauseButton.innerText;
            bullPause.setAttribute('aria-pressed', String(paused));
        }
    }
    const highlightsButton = document.getElementById('spectator-highlights-btn');
    if (highlightsButton) {
        const enabled = Boolean(currentMatch?.spectatorHighlights);
        highlightsButton.innerText = `🎬 ${t(enabled ? 't-spectator-highlights-on' : 't-btn-watch-highlights')}`;
        highlightsButton.title = t('t-spectator-highlights-help');
        highlightsButton.classList.toggle('active', enabled);
        highlightsButton.setAttribute('aria-pressed', String(enabled));
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
    if (!isMatchPlaybackControlled() || !SPECTATOR_PLAYBACK_SPEEDS.includes(parsedSpeed)) {
        return getSpectatorPlaybackSpeed();
    }

    currentMatch.spectatorPlaybackSpeed = parsedSpeed;
    updateSpectatorSpeedControls();
    return parsedSpeed;
}

function setSpectatorMatchControls(spectating) {
    const controls = document.getElementById('player-controls');
    const throwButton = document.getElementById('throw-btn');
    const simulateVisitButton = document.getElementById('t-btn-sim-visit');
    const simulateLegButton = document.getElementById('t-btn-sim-leg');
    const simulateMatchButton = document.getElementById('t-btn-sim-match');
    const backButton = document.getElementById('t-btn-match-back');
    if (controls) controls.style.display = spectating ? 'none' : '';
    if (throwButton) throwButton.style.display = spectating ? 'none' : '';
    if (simulateVisitButton) simulateVisitButton.style.display = spectating ? 'none' : '';
    if (simulateLegButton) simulateLegButton.style.display = spectating ? 'none' : '';
    if (simulateMatchButton) simulateMatchButton.style.display = spectating ? 'none' : '';
    if (backButton) backButton.style.display = spectating ? 'none' : '';
    updateSpectatorSpeedControls();
    window.matchTVMode?.refresh?.();
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

function startSpectatingTournamentMatch(bracketIndex, highlights = false) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (!activeTournament || currentMatch || !Array.isArray(tournamentBracket)) return false;
    const p1 = tournamentBracket[bracketIndex];
    const p2 = tournamentBracket[bracketIndex + 1];
    if (!p1 || !p2 || p1.isBye || p2.isBye || isCurrentPlayer(p1) || isCurrentPlayer(p2)) return false;
    if (typeof isPlayerInjured === 'function' && (isPlayerInjured(p1) || isPlayerInjured(p2))) return false;

    const existingResult = getSpectatedTournamentMatchResult(p1, p2);
    if (existingResult) return false;

    const matchFormat = getTournamentMatchFormat(activeTournament, tournamentRound);
    return beginSpectatingAiMatch(p1, p2, matchFormat,
        { spectatorRound: tournamentRound, spectatorMatchIndex: bracketIndex, spectatorHighlights: highlights === true }, getRoundName(tournamentRound));
}

function beginSpectatingAiMatch(p1, p2, matchFormat, matchFields = {}, roundLabel = '') {
    if (!activeTournament || currentMatch || !p1 || !p2 || p1.isBye || p2.isBye) return false;
    const team1 = matchFields.worldCupTeamP1;
    const team2 = matchFields.worldCupTeamP2;
    const firstName = team1 ? getWorldCupCountryName(team1.country) : p1.name;
    const secondName = team2 ? getWorldCupCountryName(team2.country) : p2.name;
    const starter = Math.random() < 0.5 ? 'p1' : 'p2';
    currentMatch = {
        vsAI: true,
        isTournament: true,
        isSpectator: true,
        spectatorP1: p1,
        opponent: p2,
        spectatorPlaybackSpeed: 1,
        spectatorPaused: false,
        spectatorHighlights: false,
        spectatorSkippedDarts: 0,
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
            p1HighCheckout: 0, p1DoubleAttempts: 0, p1DoubleHits: 0, p1OneEighties: 0, p1HundredPlus: 0, p1OneFortyPlus: 0,
            p2TotalDarts: 0, p2AccumulatedScore: 0, p2First9Score: 0, p2First9Darts: 0, p2LegDarts: 0,
            p2HighCheckout: 0, p2DoubleAttempts: 0, p2DoubleHits: 0, p2OneEighties: 0, p2HundredPlus: 0, p2OneFortyPlus: 0
        },
        ...matchFields
    };
    if (typeof prepareMatchBullOff === 'function') {
        prepareMatchBullOff(currentMatch, team1?.players?.[0] || p1, team2?.players?.[0] || p2,
            { p1: firstName, p2: secondName });
    }

    currentTurnScore = 0;
    drawnDarts = [];
    document.getElementById('bracket-modal').style.display = 'none';
    document.getElementById('match-log').innerHTML = '';
    document.getElementById('score-col-ai').style.display = 'flex';
    document.getElementById('match-p1-name').innerHTML = team1
        ? `${getFlagImg(team1.country)} <strong>${escapeHtml(firstName)}</strong><br><small>${escapeHtml(team1.players.map(candidate => candidate.name).join(' / '))}</small>`
        : `${getFlagImg(p1.country)} ${escapeHtml(p1.name)}`;
    document.getElementById('match-p2-name').innerHTML = team2
        ? `${getFlagImg(team2.country)} <strong>${escapeHtml(secondName)}</strong><br><small>${escapeHtml(team2.players.map(candidate => candidate.name).join(' / '))}</small>`
        : `${getFlagImg(p2.country)} ${escapeHtml(p2.name)}`;
    document.getElementById('match-title').innerText = `👁 ${t('t-spectator-title')}: ${roundLabel} (${getMatchFormatLabel(matchFormat)})`;
    if (team1 && team2) {
        for (const [side, team] of [['p1', team1], ['p2', team2]]) {
            const photo = document.getElementById(`score-photo-${side}`);
            photo.src = getWorldCupFlagUrl(team.country);
            photo.classList.add('world-cup-flag-photo');
        }
    } else {
        setSpectatorPlayerPhoto('score-photo-p1', p1, 'P1');
        setSpectatorPlayerPhoto('score-photo-p2', p2, 'P2');
    }
    if (typeof applyMatchPlayerPresentationThemes === 'function') {
        applyMatchPlayerPresentationThemes(p1, p2);
    }
    setSpectatorMatchControls(true);

    drawDartboard();
    updateDartDots();
    updateScores();
    updateMatchStatsUI();
    showScreen('screen-match');
    logThrow(`👁 ${t('t-spectator-watching')}: ${escapeHtml(firstName)} vs ${escapeHtml(secondName)}`, 'system');
    if (typeof showMatchBullOff === 'function') showMatchBullOff();
    else if (typeof playMatchIntro === 'function') playMatchIntro(firstName, secondName);
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
    let completeGrandSlamGroups = false;
    if (watchedMatch.spectatorWorldCupMatchId) {
        const match = getCurrentWorldCupStageMatches().find(candidate => candidate.id === watchedMatch.spectatorWorldCupMatchId);
        if (!match || match.played) return false;
        recordWorldCupTeamAverage(watchedMatch.worldCupTeamP1, Number(p1Average));
        recordWorldCupTeamAverage(watchedMatch.worldCupTeamP2, Number(p2Average));
        finishWorldCupStateMatch(match, p1Won ? match.team1Id : match.team2Id, p1Score, p2Score);
    } else {
        if (watchedMatch.spectatorWorldYouthGroupMatch) {
            const {groupIndex,matchIndex}=watchedMatch.spectatorWorldYouthGroupMatch;
            if (!recordWorldYouthGroupMatch(groupIndex,matchIndex,p1Won,p1Score,p2Score,
                {p1Scored:p1Points,p2Scored:p2Points,p1Darts:watchedMatch.stats.p1TotalDarts,p2Darts:watchedMatch.stats.p2TotalDarts})) return false;
            const edition=getWorldYouthEdition();
            if(edition.groups.every(g=>g.matches.every(m=>m.played)))completeWorldYouthGroups();
        } else if (watchedMatch.spectatorGrandSlamGroupMatch) {
            const { groupIndex, matchIndex } = watchedMatch.spectatorGrandSlamGroupMatch;
            if (!recordGrandSlamGroupMatch(groupIndex, matchIndex, p1Won, p1Score, p2Score)) return false;
            completeGrandSlamGroups = areGrandSlamGroupsComplete();
        } else {
            const key = getTournamentSpectatorMatchKey(p1, p2, watchedMatch.spectatorRound);
            if (!activeTournament.spectatedMatchResults || typeof activeTournament.spectatedMatchResults !== 'object') {
                activeTournament.spectatedMatchResults = {};
            }
            const leagueCounted = typeof recordPremierLeagueStandingsMatch === 'function'
                && recordPremierLeagueStandingsMatch(activeTournament, watchedMatch.spectatorRound,
                    winner, p1Won ? p2 : p1, winnerScore, loserScore);
            activeTournament.spectatedMatchResults[key] = {
                round: watchedMatch.spectatorRound,
                p1Key: getTournamentSpectatorPlayerKey(p1),
                p2Key: getTournamentSpectatorPlayerKey(p2),
                winnerKey: getTournamentSpectatorPlayerKey(winner),
                scoreStr: `${winnerScore}:${loserScore}`,
                p1Score,
                p2Score,
                p1Scored: p1Points, p2Scored: p2Points, p1Darts: watchedMatch.stats.p1TotalDarts, p2Darts: watchedMatch.stats.p2TotalDarts,
                p1Avg: p1Average,
                p2Avg: p2Average,
                p1BounceOuts: watchedMatch.stats.p1BounceOuts || 0,
                p2BounceOuts: watchedMatch.stats.p2BounceOuts || 0,
                leagueCounted
            };
        }
        if (typeof recordSeasonHighestAverage === 'function') {
            recordSeasonHighestAverage(p1, Number(p1Average));
            recordSeasonHighestAverage(p2, Number(p2Average));
        }
        if (typeof recordCompletedSinglesMatch === 'function') recordCompletedSinglesMatch(watchedMatch);
        if (completeGrandSlamGroups) {
            completeGrandSlamGroupStage();
            appendGrandSlamGroupResultsToHistory();
        }
    }

    clearTimeout(window.aiTimeout);
    if (spectatorPendingPlayback?.match === watchedMatch) spectatorPendingPlayback = null;
    currentMatch = null;
    currentTurnScore = 0;
    drawnDarts = [];
    setSpectatorMatchControls(false);
    showScreen('screen-hub');
    returnToSpectatedTournamentOverview(watchedMatch);
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function exitSpectatingTournamentMatch() {
    if (!currentMatch?.isSpectator) return false;
    const watchedMatch = currentMatch;
    // Unieważnij mecz przed czyszczeniem animacji: spóźnione callbacki rzutu
    // sprawdzają tożsamość meczu i nie mogą wznowić przerwanego oglądania.
    currentMatch = null;
    clearTimeout(spectatorPendingPlayback?.match === watchedMatch ? spectatorPendingPlayback.timerId : null);
    clearTimeout(window.aiTimeout);
    window.aiTimeout = null;
    spectatorPendingPlayback = null;
    if (typeof cancelMatchIntro === 'function') cancelMatchIntro();
    window.matchBoard3D?.clear?.();
    currentTurnScore = 0;
    drawnDarts = [];
    setSpectatorMatchControls(false);
    if (window.matchTVMode?.getState?.().active) void window.matchTVMode.exit();
    showScreen('screen-hub');
    returnToSpectatedTournamentOverview(watchedMatch);
    return true;
}

function returnToSpectatedTournamentOverview(watchedMatch) {
    if (watchedMatch.spectatorWorldCupMatchId) showWorldCupOverview();
    else if (watchedMatch.spectatorWorldYouthGroupMatch) { if(getWorldYouthEdition()?.phase==='groups')showWorldYouth('groups');else showBracket(); }
    else if (watchedMatch.spectatorGrandSlamGroupMatch && isGrandSlamGroupStageActive()) showGrandSlamGroups();
    else showBracket();
}
