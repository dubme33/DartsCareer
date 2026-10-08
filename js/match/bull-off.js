// One pre-match dart per side. The bull winner starts the first leg; subsequent legs alternate.
const MATCH_BULL_TEXT = {
    pl: { backstage: 'ZAPLECZE · PRZED WEJŚCIEM', title: 'Rzut na bulla', round: 'Próba {round}', instruction: 'Po jednym rzucie. Trafienie bliżej środka daje prawo rozpoczęcia meczu.',
        yourTurn: 'Twoja kolej — celuj w środek tarczy.', waiting: 'Rzuca {name}…', throw: 'Rzuć na bulla',
        bull: 'Bull (50)', outer: 'Outer bull (25)', outside: 'Poza bullem', bounced: 'Lotka wypadła — powtórz rzut.',
        tie: 'Remis — kolejna próba w odwrotnej kolejności.', winner: '{name} rozpocznie mecz.' },
    en: { backstage: 'BACKSTAGE · BEFORE WALK-ONS', title: 'Diddle for the bull', round: 'Round {round}', instruction: 'One dart each. The player closer to the centre starts the match.',
        yourTurn: 'Your turn — aim for the centre.', waiting: '{name} is throwing…', throw: 'Throw for the bull',
        bull: 'Bull (50)', outer: 'Outer bull (25)', outside: 'Outside the bull', bounced: 'The dart fell out — throw again.',
        tie: 'Tie — throw again in reverse order.', winner: '{name} starts the match.' },
    de: { backstage: 'HINTER DER BÜHNE · VOR DEM EINLAUF', title: 'Bullwurf', round: 'Versuch {round}', instruction: 'Je ein Dart. Wer näher an der Mitte ist, beginnt das Match.',
        yourTurn: 'Du bist dran — ziele auf die Mitte.', waiting: '{name} wirft…', throw: 'Auf das Bull werfen',
        bull: 'Bull (50)', outer: 'Outer Bull (25)', outside: 'Außerhalb des Bulls', bounced: 'Dart herausgefallen — erneut werfen.',
        tie: 'Gleichstand — erneut in umgekehrter Reihenfolge werfen.', winner: '{name} beginnt das Match.' },
    nl: { backstage: 'ACHTER DE COULISSEN · VOOR DE OPKOMST', title: 'Bullworp', round: 'Ronde {round}', instruction: 'Ieder één dart. Wie het dichtst bij het midden komt, begint de wedstrijd.',
        yourTurn: 'Jij bent aan de beurt — mik op het midden.', waiting: '{name} gooit…', throw: 'Gooi op de bull',
        bull: 'Bull (50)', outer: 'Outer bull (25)', outside: 'Buiten de bull', bounced: 'Dart viel uit het bord — gooi opnieuw.',
        tie: 'Gelijk — opnieuw gooien in omgekeerde volgorde.', winner: '{name} begint de wedstrijd.' }
};
let matchBullTimer = null;
let matchBullRemovalTimer = null;
let matchBullBoardMount = null;
let matchBullBoardObserver = null;
const MATCH_BULL_SETTINGS_TEXT = {
    pl: { title: '🎯 Rzut do bulla', intro: 'Ustalanie rozpoczynającego mecz rzutem do środka tarczy.', label: 'Rzut do bulla przed meczem',
        enabled: 'Włączony (domyślnie)', disabled: 'Wyłączony', rule: 'Po wyłączeniu rozpoczynający jest wybierany losowo. Dotyczy gry, oglądania i symulacji meczów.' },
    en: { title: '🎯 Throw for the bull', intro: 'Decide who starts the match by throwing for the centre of the board.', label: 'Throw for the bull before matches',
        enabled: 'Enabled (default)', disabled: 'Disabled', rule: 'When disabled, the starting player is chosen at random. Applies to played, watched and simulated matches.' },
    de: { title: '🎯 Bullwurf', intro: 'Ein Wurf auf die Mitte entscheidet, wer das Match beginnt.', label: 'Bullwurf vor dem Match',
        enabled: 'Aktiviert (Standard)', disabled: 'Deaktiviert', rule: 'Bei Deaktivierung wird der Startspieler zufällig gewählt. Gilt für gespielte, angeschaute und simulierte Matches.' },
    nl: { title: '🎯 Bullworp', intro: 'Een worp naar het midden bepaalt wie de wedstrijd begint.', label: 'Bullworp voor wedstrijden',
        enabled: 'Ingeschakeld (standaard)', disabled: 'Uitgeschakeld', rule: 'Bij uitschakeling wordt de startspeler willekeurig gekozen. Geldt voor gespeelde, bekeken en gesimuleerde wedstrijden.' }
};
function initializeMatchBullOffSettings(candidate = typeof player === 'object' ? player : null, reset = false) {
    if (!candidate) return false;
    candidate.bullOffEnabled = reset || typeof candidate.bullOffEnabled !== 'boolean' ? true : candidate.bullOffEnabled;
    return candidate.bullOffEnabled;
}
function isMatchBullOffEnabled() {
    return typeof player !== 'object' || player?.bullOffEnabled !== false;
}
function changeMatchBullOffSetting(value) {
    if (typeof player !== 'object' || !player?.name || !['enabled', 'disabled'].includes(value)
        || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) return false;
    player.bullOffEnabled = value === 'enabled';
    refreshMatchBullOffSettingsUI();
    if (!player.bullOffEnabled && typeof currentMatch !== 'undefined' && isMatchBullOffPending(currentMatch)
        && document.getElementById('match-bull-off')?.hidden === false) skipMatchBullOff(currentMatch);
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}
function refreshMatchBullOffSettingsUI() {
    if (typeof document === 'undefined') return;
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const text = MATCH_BULL_SETTINGS_TEXT[language] || MATCH_BULL_SETTINGS_TEXT.en;
    for (const key of ['title', 'intro', 'label', 'enabled', 'disabled', 'rule']) {
        const node = document.getElementById(`bull-off-settings-${key}`);
        if (node) node.textContent = text[key];
    }
    const select = document.getElementById('hub-bull-off-mode');
    if (select) select.value = isMatchBullOffEnabled() ? 'enabled' : 'disabled';
}
function refreshMatchBullBoardView() {
    const two = document.getElementById('match-bull-view-2d');
    const three = document.getElementById('match-bull-view-3d');
    const matchThree = document.getElementById('board-view-3d');
    const stage = document.getElementById('dartboard-3d');
    if (!two || !three || !matchThree || !stage || typeof matchThree.getAttribute !== 'function'
        || typeof two.setAttribute !== 'function' || typeof three.setAttribute !== 'function') return;
    const preferred3d = matchThree.getAttribute('aria-pressed') === 'true';
    two.setAttribute('aria-pressed', String(!preferred3d));
    three.setAttribute('aria-pressed', String(preferred3d));
    three.disabled = matchThree.disabled;
    const board2d = document.getElementById('match-bull-board-2d');
    const board3d = document.getElementById('match-bull-board-3d');
    if (board2d && board3d) {
        board2d.hidden = !stage.hidden;
        board3d.hidden = stage.hidden;
    }
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const labels = { pl: 'Widok tarczy', en: 'Dartboard view', de: 'Dartscheibenansicht', nl: 'Dartbordweergave' };
    const label = document.getElementById('match-bull-view-label');
    const group = document.getElementById('match-bull-view-controls');
    if (label) label.textContent = labels[language] || labels.en;
    if (group) group.setAttribute('aria-label', labels[language] || labels.en);
}
function setMatchBullBoardView(view) {
    if (view !== '2d' && view !== '3d' || typeof window === 'undefined' || !window.matchBoard3D) return;
    window.matchBoard3D.setView(view);
    refreshMatchBullBoardView();
}
function mountMatchBullBoard() {
    const canvas = document.getElementById('dartboard');
    const stage = document.getElementById('dartboard-3d');
    const board2d = document.getElementById('match-bull-board-2d');
    const board3d = document.getElementById('match-bull-board-3d');
    if (!canvas?.parentNode || !stage?.parentNode || !board2d?.appendChild || !board3d?.appendChild) return;
    if (!matchBullBoardMount) {
        matchBullBoardMount = [canvas, stage].map(node => ({ node, parent: node.parentNode, next: node.nextSibling }));
        board2d.appendChild(canvas);
        board3d.appendChild(stage);
    }
    if (!matchBullBoardObserver && typeof MutationObserver === 'function') {
        matchBullBoardObserver = new MutationObserver(refreshMatchBullBoardView);
        matchBullBoardObserver.observe(stage, { attributes: true, attributeFilter: ['hidden'] });
        const matchThree = document.getElementById('board-view-3d');
        if (matchThree) matchBullBoardObserver.observe(matchThree, { attributes: true, attributeFilter: ['aria-pressed', 'disabled'] });
    }
    refreshMatchBullBoardView();
    if (typeof window !== 'undefined') window.matchBoard3D?.refreshLayout?.();
    if (typeof drawDartboard === 'function') drawDartboard();
}
function restoreMatchBullBoard() {
    if (matchBullBoardObserver) matchBullBoardObserver.disconnect();
    matchBullBoardObserver = null;
    if (!matchBullBoardMount) return;
    matchBullBoardMount.forEach(({ node, parent, next }) => parent.insertBefore(node, next));
    matchBullBoardMount = null;
    if (typeof window !== 'undefined') window.matchBoard3D?.refreshLayout?.();
}
function clearMatchBullBoardDarts() {
    if (typeof drawnDarts === 'undefined') return;
    drawnDarts = [];
    if (typeof drawDartboard === 'function') drawDartboard();
}
function getMatchBullBoardRadius(dart) {
    if (!dart || dart.ring === 'bounced') return Infinity;
    const distance = Math.hypot(Number(dart.x) || 0, Number(dart.y) || 0);
    if (dart.ring === 'bull') return Math.min(1, distance / 0.13) * 6.4;
    if (dart.ring === 'outer') return 6.6 + Math.max(0, Math.min(1, (distance - 0.18) / 0.16)) * 9.2;
    const miss = Math.max(0, Math.min(1, (distance - 0.40) / 0.54));
    return 17 + Math.pow(miss, 1.6) * 15;
}
function showMatchBullBoardDart(dart, side) {
    if (typeof drawnDarts === 'undefined' || typeof drawDartboard !== 'function') return;
    const length = Math.hypot(dart.x, dart.y);
    const boardRadius = getMatchBullBoardRadius(dart);
    const scale = length ? boardRadius / length : 0;
    const color = side === 'p1' ? '#f6bf37' : '#4eb8ff';
    const dartStyle = typeof window !== 'undefined' && typeof window.getMatchDartLoadout === 'function'
        ? window.getMatchDartLoadout(side) : null;
    drawnDarts.push({ x: 170 + dart.x * scale, y: 170 + dart.y * scale, color, dartSide: side,
        ...(dartStyle ? { dartStyle } : {}) });
    drawDartboard();
}
function restoreMatchBullBoardDarts(state) {
    clearMatchBullBoardDarts();
    if (!state?.throws) return;
    for (const side of ['p1', 'p2']) {
        const dart = state.throws[side];
        if (!dart || dart.ring === 'bounced') continue;
        if (side === state.first && dart.ring === 'bull' && matchBullRemovalTimer === null) continue;
        showMatchBullBoardDart(dart, side);
    }
}
function pullFirstMatchBullDart(match) {
    const state = match.bullOff;
    if (!matchBullBoardMount) {
        clearMatchBullBoardDarts();
        renderMatchBullOff(match);
        scheduleMatchBullAi(match);
        return;
    }
    state.waitingForRemoval = true;
    state.message = trMatchBull('bull');
    renderMatchBullOff(match);
    matchBullRemovalTimer = setTimeout(() => {
        matchBullRemovalTimer = null;
        if (currentMatch !== match || state.status !== 'pending') return;
        clearMatchBullBoardDarts();
        state.waitingForRemoval = false;
        state.message = '';
        renderMatchBullOff(match);
        scheduleMatchBullAi(match);
    }, 800);
}
function trMatchBull(key, values = {}) {
    const language = typeof currentLang === 'string' && MATCH_BULL_TEXT[currentLang] ? currentLang : 'pl';
    return (MATCH_BULL_TEXT[language][key] || MATCH_BULL_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, field) => String(values[field] ?? ''));
}
function getMatchBullSkill(candidate) {
    if (Number.isFinite(candidate)) return Math.max(0, Math.min(100, candidate));
    const scoring = Number(candidate?.scoring) || Number(candidate?.overall) || Number(candidate?.ovr) || 65;
    const doubles = Number(candidate?.doubles) || scoring;
    return Math.max(0, Math.min(100, (scoring + doubles) / 2));
}
function rollMatchBullDart(candidate, random = Math.random) {
    const skill = getMatchBullSkill(candidate);
    if (random() < 0.008) return { ring: 'bounced', x: 0, y: 0 };
    const chance = random();
    const bullChance = 0.07 + skill * 0.0012;
    const outerChance = 0.18 + skill * 0.0011;
    const ring = chance < bullChance ? 'bull' : chance < bullChance + outerChance ? 'outer' : 'outside';
    const radius = ring === 'bull' ? random() * 0.13
        : ring === 'outer' ? 0.18 + random() * 0.16 : 0.40 + random() * 0.54;
    const angle = random() * Math.PI * 2;
    return { ring, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}
function compareMatchBullDarts(first, second) {
    // Two red-bull hits are a tie even when their visual landing points differ.
    if (first?.ring === 'bull' && second?.ring === 'bull') return 0;
    return Math.sign(getMatchBullBoardRadius(second) - getMatchBullBoardRadius(first));
}
function resolveMatchBullAutomatically(p1, p2, random = Math.random) {
    if (!isMatchBullOffEnabled()) return random() < 0.5 ? 'p1' : 'p2';
    let first = random() < 0.5 ? 'p1' : 'p2';
    for (let round = 1; round <= 50; round++) {
        let dart1 = rollMatchBullDart(p1, random), dart2 = rollMatchBullDart(p2, random);
        while (dart1.ring === 'bounced') dart1 = rollMatchBullDart(p1, random);
        while (dart2.ring === 'bounced') dart2 = rollMatchBullDart(p2, random);
        const comparison = compareMatchBullDarts(dart1, dart2);
        if (comparison) return comparison > 0 ? 'p1' : 'p2';
        first = first === 'p1' ? 'p2' : 'p1';
    }
    return first;
}
function prepareMatchBullOff(match, p1, p2, names = {}) {
    clearTimeout(matchBullTimer);
    clearTimeout(matchBullRemovalTimer);
    matchBullTimer = null;
    matchBullRemovalTimer = null;
    restoreMatchBullBoard();
    clearMatchBullBoardDarts();
    document.getElementById('match-bull-off').hidden = true;
    if (!isMatchBullOffEnabled()) {
        // Match constructors already choose an unbiased starter. Keep that choice
        // and hold the turn controls until showMatchBullOff starts the normal intro.
        match.bullOff = { status: 'skipped', names: { p1: names.p1 || p1?.name || '', p2: names.p2 || p2?.name || '' } };
        return;
    }
    const first = Math.random() < 0.5 ? 'p1' : 'p2';
    match.bullOff = { status: 'pending', first, turn: first, round: 1,
        throws: { p1: null, p2: null }, names: { p1: names.p1 || p1?.name || '', p2: names.p2 || p2?.name || '' },
        skills: { p1: getMatchBullSkill(p1), p2: getMatchBullSkill(p2) }, message: '' };
}
function isMatchBullOffPending(match = currentMatch) {
    return Boolean(match?.bullOff && match.bullOff.status !== 'complete');
}
function renderMatchBullOff(match = currentMatch) {
    if (!isMatchBullOffPending(match)) return;
    const state = match.bullOff;
    const text = id => document.getElementById(id);
    text('match-bull-backstage').textContent = trMatchBull('backstage');
    text('match-bull-title').textContent = trMatchBull('title');
    text('match-bull-round').textContent = trMatchBull('round', { round: state.round });
    text('match-bull-instruction').textContent = trMatchBull('instruction');
    text('match-bull-p1-name').textContent = state.names.p1;
    text('match-bull-p2-name').textContent = state.names.p2;
    for (const side of ['p1', 'p2']) {
        const dart = state.throws[side];
        text(`match-bull-${side}-result`).textContent = dart ? trMatchBull(dart.ring) : '—';
    }
    refreshMatchBullBoardView();
    const playerTurn = !match.isSpectator && state.status === 'pending' && state.turn === 'p1'
        && !state.waitingForRemoval;
    text('match-bull-prompt').textContent = state.message || (state.status === 'result' ? ''
        : playerTurn ? trMatchBull('yourTurn') : trMatchBull('waiting', { name: state.names[state.turn] }));
    const button = text('match-bull-throw');
    button.textContent = trMatchBull('throw');
    button.hidden = !playerTurn;
    button.disabled = !playerTurn;
    if (playerTurn && !text('match-bull-off').hidden) button.focus();
}
function showMatchBullOff(match = currentMatch) {
    if (isMatchBullOffPending(match) && (!isMatchBullOffEnabled() || match.bullOff.status === 'skipped')) {
        skipMatchBullOff(match);
        return false;
    }
    if (!isMatchBullOffPending(match)) { setTurnUI(); return false; }
    document.getElementById('match-bull-off').hidden = false;
    mountMatchBullBoard();
    if (match.bullOff.waitingForRemoval && matchBullRemovalTimer === null) {
        match.bullOff.waitingForRemoval = false;
        match.bullOff.message = '';
    }
    restoreMatchBullBoardDarts(match.bullOff);
    renderMatchBullOff(match);
    if (match.isSpectator || match.bullOff.turn !== 'p1') document.getElementById('match-bull-off').focus();
    scheduleMatchBullAi(match);
    return true;
}
function skipMatchBullOff(match = currentMatch) {
    if (!match || currentMatch !== match || !isMatchBullOffPending(match)) return false;
    clearTimeout(matchBullTimer);
    clearTimeout(matchBullRemovalTimer);
    matchBullTimer = null;
    matchBullRemovalTimer = null;
    clearMatchBullBoardDarts();
    restoreMatchBullBoard();
    document.getElementById('match-bull-off').hidden = true;
    const starter = ['p1', 'p2'].includes(match.startingPlayer) ? match.startingPlayer : (Math.random() < 0.5 ? 'p1' : 'p2');
    match.startingPlayer = starter;
    match.turn = starter;
    match.bullOff.status = 'complete';
    match.bullOff.skipped = true;
    if (!match.isWorldCup && typeof playMatchIntro === 'function') {
        playMatchIntro(match.bullOff.names.p1, match.bullOff.names.p2);
    } else setTurnUI();
    return true;
}
function scheduleMatchBullAi(match) {
    clearTimeout(matchBullTimer);
    const state = match.bullOff;
    if (state.status !== 'pending' || state.turn === 'p1' && !match.isSpectator) return;
    matchBullTimer = setTimeout(() => {
        if (currentMatch === match && state.status === 'pending') advanceMatchBullOff(match);
    }, 650);
}
function advanceMatchBullOff(match = currentMatch) {
    if (!match || currentMatch !== match || match.bullOff?.status !== 'pending'
        || match.bullOff.waitingForRemoval) return false;
    const state = match.bullOff, side = state.turn;
    if (side === 'p1' && !match.isSpectator && !document.getElementById('match-bull-off').hidden
        && state.throws.p1) return false;
    state.message = '';
    const dart = rollMatchBullDart(state.skills[side]);
    if (dart.ring === 'bounced') {
        state.message = trMatchBull('bounced');
        renderMatchBullOff(match);
        scheduleMatchBullAi(match);
        return true;
    }
    state.throws[side] = dart;
    showMatchBullBoardDart(dart, side);
    const other = side === 'p1' ? 'p2' : 'p1';
    if (!state.throws[other]) {
        state.turn = other;
        if (dart.ring === 'bull') {
            pullFirstMatchBullDart(match);
            return true;
        }
        renderMatchBullOff(match);
        scheduleMatchBullAi(match);
        return true;
    }
    const comparison = compareMatchBullDarts(state.throws.p1, state.throws.p2);
    if (!comparison) {
        state.status = 'tie';
        state.message = trMatchBull('tie');
        state.round++;
        state.first = state.first === 'p1' ? 'p2' : 'p1';
        state.turn = state.first;
        renderMatchBullOff(match);
        matchBullTimer = setTimeout(() => {
            if (currentMatch !== match || state.status !== 'tie') return;
            state.status = 'pending';
            state.throws = { p1: null, p2: null };
            state.message = '';
            clearMatchBullBoardDarts();
            renderMatchBullOff(match);
            scheduleMatchBullAi(match);
        }, 1100);
        return true;
    }
    const winner = comparison > 0 ? 'p1' : 'p2';
    state.status = 'result';
    state.message = trMatchBull('winner', { name: state.names[winner] });
    renderMatchBullOff(match);
    matchBullTimer = setTimeout(() => {
        if (currentMatch !== match || state.status !== 'result') return;
        match.startingPlayer = winner;
        match.turn = winner;
        state.status = 'complete';
        clearTimeout(matchBullRemovalTimer);
        matchBullRemovalTimer = null;
        clearMatchBullBoardDarts();
        restoreMatchBullBoard();
        document.getElementById('match-bull-off').hidden = true;
        if (typeof logThrow === 'function') {
            const message = trMatchBull('winner', { name: state.names[winner] });
            logThrow(`🎯 ${typeof escapeHtml === 'function' ? escapeHtml(message) : message}`, 'system');
        }
        if (!match.isWorldCup && typeof playMatchIntro === 'function') {
            playMatchIntro(state.names.p1, state.names.p2);
        } else setTurnUI();
    }, 1350);
    return true;
}

if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', refreshMatchBullOffSettingsUI);
}
