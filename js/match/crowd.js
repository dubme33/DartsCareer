(() => {
    'use strict';

    const AUDIO_ROOT = 'sounds/fans/';
    const ARENA_VOLUME = 0.08;
    const CHANT_VOLUME = 0.18;
    const REACTION_VOLUME = 0.58;
    const CHANT_MIN_DELAY = 32000;
    const CHANT_DELAY_SPREAD = 36000;
    const pendingCues = new Set();
    const activeReactions = new Set();
    let arenaFallback = null;
    let chantAudio = null;
    let chantTimer = null;
    let activeMatch = null;
    let crowdTournament = null;
    let enabled = false;
    let randomState = 0x6d2b79f5;
    let lastCue = null;
    let cueHistory = [];
    let visits = makeVisitState();

    function makeSideState() {
        return { t20Hits: 0, trebles: 0, yeahFamily: null };
    }

    function makeVisitState() {
        return { p1: makeSideState(), p2: makeSideState() };
    }

    function volume() {
        return typeof globalVolume === 'number' ? Math.max(0, Math.min(1, globalVolume)) : 1;
    }

    function tournamentText(tournament) {
        return `${tournament?.name || ''} ${tournament?.sourceName || ''}`.toLocaleLowerCase('pl');
    }

    function isFloorTournament(tournament) {
        if (!tournament) return true;
        if (tournament.noCrowd === true || tournament.noWalkons === true) return true;
        if (typeof isFloorTournamentWithoutWalkons === 'function') {
            try { return Boolean(isFloorTournamentWithoutWalkons(tournament)); } catch (_error) { /* use the local rule */ }
        }
        const name = tournamentText(tournament);
        const specialType = String(tournament.specialType || '').toLocaleLowerCase('pl');
        const qualifier = specialType.includes('qualifier') || specialType === 'pdcqschool'
            || name.includes('qualifier') || name.includes('kwalifikacj')
            || name.includes('q-school') || name.includes('pro card trials');
        const playersChampionship = name.includes('players championship') || name.includes('pro players cup');
        const playersChampionshipFinals = name.includes('players championship finals') || name.includes('pro players finals');
        const challengeTour = specialType === 'challengetour'
            || name.includes('rising stars circuit') || name.includes('challenge tour');
        const developmentTour = specialType === 'developmenttour'
            || name.includes('future champions circuit') || name.includes('development tour');
        return qualifier || challengeTour || developmentTour || (playersChampionship && !playersChampionshipFinals);
    }

    function isStageMatch(match = currentMatch, tournament = activeTournament) {
        return Boolean(match?.isTournament && tournament && !isFloorTournament(tournament));
    }

    function hashSeed(value) {
        let hash = 2166136261;
        for (const char of String(value || 'Darts Career TV')) {
            hash ^= char.charCodeAt(0);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0 || 0x6d2b79f5;
    }

    // Osobny generator nie zużywa Math.random używanego przez celność i fizykę meczu.
    function crowdRandom() {
        randomState ^= randomState << 13;
        randomState ^= randomState >>> 17;
        randomState ^= randomState << 5;
        return (randomState >>> 0) / 4294967296;
    }

    function source(name, aliases = []) {
        const sounds = typeof moddedAssets !== 'undefined' && moddedAssets?.sounds ? moddedAssets.sounds : {};
        for (const key of [name, ...aliases]) {
            if (typeof sounds[key] === 'string' && sounds[key]) return sounds[key];
        }
        return `${AUDIO_ROOT}${name}.mp3`;
    }

    function getArenaAudio() {
        return typeof crowdAudio !== 'undefined' && crowdAudio ? crowdAudio : arenaFallback;
    }

    function setArenaAudio(audio) {
        arenaFallback = audio;
        if (typeof crowdAudio !== 'undefined') crowdAudio = audio;
    }

    function safePlay(audio) {
        try {
            const promise = audio.play();
            if (promise && typeof promise.catch === 'function') promise.catch(() => {});
        } catch (_error) { /* Audio is optional and cannot interrupt scoring. */ }
    }

    function stopAudio(audio, rewind = true) {
        if (!audio) return;
        try {
            audio.pause();
            if (rewind) audio.currentTime = 0;
        } catch (_error) { /* Ignore a decoder that is already gone. */ }
    }

    function updateVolumes() {
        const global = volume();
        const arena = getArenaAudio();
        if (arena) arena.volume = ARENA_VOLUME * global;
        if (chantAudio) chantAudio.volume = CHANT_VOLUME * global;
        activeReactions.forEach(audio => { audio.volume = REACTION_VOLUME * global; });
    }

    function rememberCue(name) {
        lastCue = name;
        cueHistory.push(name);
        if (cueHistory.length > 16) cueHistory = cueHistory.slice(-16);
    }

    function playReaction(name) {
        if (!enabled || !name) return;
        let audio;
        try { audio = new Audio(source(name)); } catch (_error) { return; }
        audio.volume = REACTION_VOLUME * volume();
        const release = () => activeReactions.delete(audio);
        audio.onended = release;
        audio.onerror = release;
        activeReactions.add(audio);
        while (activeReactions.size > 2) {
            const oldest = activeReactions.values().next().value;
            activeReactions.delete(oldest);
            stopAudio(oldest);
        }
        rememberCue(name);
        safePlay(audio);
    }

    function impactDelay(extra = 0) {
        let delay = 520;
        if (typeof getMatchBoardAnimationDelay === 'function') {
            try { delay = Math.max(delay, Number(getMatchBoardAnimationDelay(520)) || 0); } catch (_error) { /* keep fallback */ }
        }
        if (activeMatch?.isSpectator && typeof getSpectatorPlaybackDelay === 'function') {
            try { delay = Number(getSpectatorPlaybackDelay(delay, delay)) || delay; } catch (_error) { /* keep fallback */ }
        }
        return Math.min(1300, delay) + extra;
    }

    function queueReaction(name, extraDelay = 0) {
        if (!enabled || !name) return null;
        const match = activeMatch;
        const timer = setTimeout(() => {
            pendingCues.delete(timer);
            if (enabled && activeMatch === match) playReaction(name);
        }, impactDelay(extraDelay));
        pendingCues.add(timer);
        return name;
    }

    function clearChant() {
        clearTimeout(chantTimer);
        chantTimer = null;
        stopAudio(chantAudio);
        chantAudio = null;
    }

    function scheduleChant() {
        clearTimeout(chantTimer);
        if (!enabled) return;
        const delay = Math.round(CHANT_MIN_DELAY + crowdRandom() * CHANT_DELAY_SPREAD);
        chantTimer = setTimeout(() => {
            chantTimer = null;
            if (!enabled || (typeof document !== 'undefined' && document.hidden)) {
                scheduleChant();
                return;
            }
            playChant();
        }, delay);
    }

    function playChant() {
        if (!enabled) return null;
        clearChant();
        const name = `chant${1 + Math.floor(crowdRandom() * 5)}`;
        try { chantAudio = new Audio(source(name)); } catch (_error) { scheduleChant(); return null; }
        chantAudio.volume = CHANT_VOLUME * volume();
        chantAudio.onended = () => { chantAudio = null; scheduleChant(); };
        chantAudio.onerror = () => { chantAudio = null; scheduleChant(); };
        rememberCue(name);
        safePlay(chantAudio);
        return name;
    }

    function start(match = currentMatch, tournament = activeTournament) {
        if (!isStageMatch(match, tournament)) {
            stop();
            return false;
        }
        if (enabled && activeMatch === match) {
            const arena = getArenaAudio();
            if (arena?.paused) safePlay(arena);
            updateVolumes();
            return true;
        }
        stop();
        activeMatch = match;
        crowdTournament = tournament;
        enabled = true;
        visits = makeVisitState();
        lastCue = null;
        cueHistory = [];
        randomState = hashSeed(`${tournament.name}|${tournament.specialType || ''}|${Date.now()}`);
        try {
            const arena = new Audio(source('arenaloop', ['crowd']));
            arena.loop = true;
            setArenaAudio(arena);
            updateVolumes();
            safePlay(arena);
        } catch (_error) { setArenaAudio(null); }
        scheduleChant();
        return true;
    }

    function ensureStarted() {
        const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
        const tournament = typeof activeTournament !== 'undefined' ? activeTournament : null;
        if (enabled && activeMatch === match) return true;
        return start(match, tournament);
    }

    function yeahCue(state, suffix) {
        if (!state.yeahFamily) state.yeahFamily = 1 + Math.floor(crowdRandom() * 4);
        return `yeah${state.yeahFamily}${suffix}`;
    }

    function onThrow(event) {
        if (!event?.side || !ensureStarted()) return null;
        const side = event.side === 'p2' ? 'p2' : 'p1';
        if (Number(event.dartNumber) <= 1) visits[side] = makeSideState();
        const state = visits[side];
        const targetSector = Number(event.target?.sector);
        const targetMult = Number(event.target?.mult);
        const hitSector = Number(event.hit?.sector);
        const hitMult = Number(event.hit?.mult);
        const landed = !event.bounced && !event.bust;
        const hitT20 = landed && hitSector === 20 && hitMult === 3;
        const hitTargetTreble = landed && targetMult === 3 && hitSector === targetSector && hitMult === 3;
        const missedDouble = targetMult === 2 && !event.legCompleted
            && !(landed && hitSector === targetSector && hitMult === 2);
        const missedThirdTreble = targetMult === 3 && state.trebles >= 2 && !hitTargetTreble;
        let primary = null;
        let nineDarter = null;

        if (event.legCompleted) {
            primary = yeahCue(state, 3);
            if (Number(event.legDarts) === 9) nineDarter = '9darter3';
        } else if (missedDouble || missedThirdTreble) {
            primary = `ouh${1 + Math.floor(crowdRandom() * 5)}`;
        } else if (hitT20) {
            state.t20Hits++;
            primary = yeahCue(state, Math.min(3, state.t20Hits));
        }

        if (event.visitComplete && Number(event.visitScore) === 180) {
            if (Number(event.legDarts) === 3 && Number(event.scoreAfter) === 321) nineDarter = '9darter1';
            else if (Number(event.legDarts) === 6 && Number(event.scoreAfter) === 141) nineDarter = '9darter2';
        }

        if (landed && hitMult === 3) state.trebles++;
        else state.trebles = 0;
        if (primary) queueReaction(primary);
        if (nineDarter) queueReaction(nineDarter, 720);
        return primary || nineDarter;
    }

    function finishMatch() {
        clearChant();
        stopAudio(getArenaAudio());
        enabled = false;
    }

    function stop() {
        enabled = false;
        clearChant();
        pendingCues.forEach(clearTimeout);
        pendingCues.clear();
        activeReactions.forEach(audio => stopAudio(audio));
        activeReactions.clear();
        stopAudio(getArenaAudio());
        activeMatch = null;
        crowdTournament = null;
        visits = makeVisitState();
    }

    function getPostMatchSource(match = currentMatch, tournament = activeTournament) {
        return isStageMatch(match, tournament) ? source('chasethesun') : '';
    }

    window.matchCrowd = Object.freeze({
        start, stop, finishMatch, onThrow, setVolume: updateVolumes,
        isStageMatch, getPostMatchSource, playChant,
        getState() {
            return {
                enabled, stageMatch: isStageMatch(activeMatch, crowdTournament),
                arenaPlaying: Boolean(getArenaAudio() && !getArenaAudio().paused),
                chantPlaying: Boolean(chantAudio && !chantAudio.paused),
                pendingCues: pendingCues.size, activeReactions: activeReactions.size,
                lastCue, history: cueHistory.slice(),
                visits: JSON.parse(JSON.stringify(visits))
            };
        }
    });
})();
