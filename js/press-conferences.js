let pressConferenceResume = null;
let pressConferenceResumeOwner = null;

const PRESS_CONFERENCE_COPY = {
    pl: { pre: 'Konferencja przedturniejowa', post: 'Konferencja pomeczowa', question: 'PYTANIE',
        continue: 'Kontynuuj', reaction: 'Reakcja mediów i sztabu', prof: 'Profesjonalizm', pop: 'Medialność',
        unchanged: 'Bez zmiany statystyk' },
    en: { pre: 'Pre-tournament press conference', post: 'Post-match press conference', question: 'QUESTION',
        continue: 'Continue', reaction: 'Media and team reaction', prof: 'Professionalism', pop: 'Media presence',
        unchanged: 'No attribute changes' },
    de: { pre: 'Pressekonferenz vor dem Turnier', post: 'Pressekonferenz nach dem Spiel', question: 'FRAGE',
        continue: 'Weiter', reaction: 'Reaktion von Medien und Team', prof: 'Professionalität', pop: 'Medienpräsenz',
        unchanged: 'Keine Änderungen' },
    nl: { pre: 'Persconferentie voor het toernooi', post: 'Persconferentie na de wedstrijd', question: 'VRAAG',
        continue: 'Doorgaan', reaction: 'Reactie van media en team', prof: 'Professionaliteit', pop: 'Mediabereik',
        unchanged: 'Geen wijzigingen' }
};

// Each answer has several plausible reactions. Players cannot memorize a
// guaranteed stat change from the position of an answer.
const PRESS_CONFERENCE_REACTIONS = [
    [{ prof: 2, pop: 0 }, { prof: 1, pop: 1 }, { prof: 3, pop: -1 }, { prof: 0, pop: 2 }],
    [{ prof: -1, pop: 3 }, { prof: 0, pop: 2 }, { prof: 1, pop: 2 }, { prof: -2, pop: 4 }],
    [{ prof: -2, pop: 3 }, { prof: -1, pop: 2 }, { prof: 1, pop: 1 }, { prof: -3, pop: 4 }],
    [{ prof: 1, pop: 1 }, { prof: 2, pop: -1 }, { prof: 0, pop: 2 }, { prof: -1, pop: 1 }]
];

function getPressConferenceLanguage() {
    const language = typeof currentLang === 'string' ? currentLang : 'en';
    return PRESS_CONFERENCE_COPY[language] ? language : 'en';
}

function pressConferenceText(pair) {
    return pair[getPressConferenceLanguage() === 'pl' ? 0 : 1];
}

function isMajorPressTournament(tournament) {
    if (!tournament || tournament.qualifierFor || /qualif|kwalifik|gateway|trials/i.test(
        `${tournament.specialType || ''} ${tournament.name || ''} ${tournament.sourceName || ''}`)) return false;
    if (['classicMasters', 'ukOpen', 'worldCup', 'worldMastersFinals'].includes(tournament.specialType)) return true;
    const name = `${tournament.sourceName || ''} ${tournament.name || ''}`.toLocaleLowerCase('en');
    return /(?:global darts league|premier league|crown masters|winmau world masters|pro players finals|players championship finals|global grand prix|world grand prix|british open|uk open|puchar narodów|world cup of darts|global matchplay|world matchplay|global masters finals|world series of darts finals|continental championship|european championship|champion's slam|grand slam of darts|global darts championship|world darts championship)/i.test(name);
}

function isPostMatchPressTournament(tournament) {
    if (isMajorPressTournament(tournament)) return true;
    if (!tournament || tournament.qualifierFor || /qualif|kwalifik/i.test(
        `${tournament.specialType || ''} ${tournament.name || ''} ${tournament.sourceName || ''}`)) return false;
    return /(?:european|continental) tour(?:\s+\d+)?\b/i.test(
        `${tournament.sourceName || ''} ${tournament.name || ''}`);
}

function isWinningPostMatchPressConference(context) {
    const score = /^(\d+):(\d+)$/.exec(String(context?.score || ''));
    return !!score && Number(score[1]) > Number(score[2]);
}

function getPressConferenceState() {
    if (!player.pressConferences || typeof player.pressConferences !== 'object'
        || Array.isArray(player.pressConferences)) player.pressConferences = {};
    const state = player.pressConferences;
    if (!Array.isArray(state.preCompleted)) state.preCompleted = [];
    if (!Array.isArray(state.recentQuestions)) state.recentQuestions = [];
    if (state.pending?.phase === 'post' && !isWinningPostMatchPressConference(state.pending.context)) {
        state.pending = null;
    }
    return state;
}

function getPressConferenceTournamentKey(tournament) {
    const year = typeof currentDate !== 'undefined' && currentDate instanceof Date
        ? currentDate.getFullYear() : new Date().getFullYear();
    return `${year}|${tournament.sourceName || tournament.name}|${tournament.month ?? ''}|${tournament.day ?? ''}`;
}

function getPressConferenceH2h(opponent) {
    const record = opponent?.id && player.rivalries?.[opponent.id];
    return record && Number(record.matches) > 0 ? `${Number(record.wins) || 0}–${Number(record.losses) || 0}` : '';
}

function getPressConferenceTournamentName(tournament) {
    return typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(tournament) : tournament.name;
}

function choosePressConferenceQuestion(phase, context, state) {
    const eligible = PRESS_CONFERENCE_TOPICS.flatMap(topic => {
        if (topic.phase !== phase || (topic.needsOpponent && !context.opponent)
            || (topic.needsH2h && !context.h2h) || (topic.needsAverage && !context.average)) return [];
        return topic.questions.map((_, index) => ({ topic, index, id: `${topic.id}:${index}` }));
    });
    if (!eligible.length) return null;
    const fresh = eligible.filter(item => !state.recentQuestions.includes(item.id));
    const pool = fresh.length ? fresh : eligible;
    return pool[Math.floor(Math.random() * pool.length)];
}

function getPressConferenceQuestion(id) {
    const [topicId, rawIndex] = String(id || '').split(':');
    const topic = PRESS_CONFERENCE_TOPICS.find(item => item.id === topicId);
    const index = Number(rawIndex);
    return topic && Number.isInteger(index) && topic.questions[index] ? { topic, index } : null;
}

function formatPressConferenceText(text, context) {
    return String(text || '').replace(/\{(\w+)\}/g, (_, key) => context?.[key] ?? '');
}

function queuePressConference(phase, context, key = '') {
    const state = getPressConferenceState();
    if (state.pending) return false;
    const selected = choosePressConferenceQuestion(phase, context, state);
    if (!selected) return false;
    state.pending = {
        phase, key, questionId: selected.id,
        journalistIndex: Math.floor(Math.random() * PRESS_CONFERENCE_JOURNALISTS.length),
        context
    };
    if (typeof saveGame === 'function') saveGame(true);
    showPendingPressConference();
    return true;
}

function maybeBeginPreTournamentPressConference(tournament, opponent, resume) {
    if (!isMajorPressTournament(tournament) || !tournament || !player) return false;
    const state = getPressConferenceState();
    const key = getPressConferenceTournamentKey(tournament);
    if (state.preCompleted.includes(key)) return false;
    if (state.pending) {
        if (state.pending.phase === 'pre' && state.pending.key === key) {
            pressConferenceResume = resume;
            pressConferenceResumeOwner = player;
        }
        showPendingPressConference();
        return true;
    }
    const context = {
        tournament: getPressConferenceTournamentName(tournament),
        opponent: opponent?.name || '',
        h2h: getPressConferenceH2h(opponent)
    };
    pressConferenceResume = resume;
    pressConferenceResumeOwner = player;
    if (queuePressConference('pre', context, key)) return true;
    pressConferenceResume = null;
    pressConferenceResumeOwner = null;
    return false;
}

function buildPostMatchPressConferenceContext(match, tournament, round) {
    if (!match || !tournament || !isPostMatchPressTournament(tournament) || match.isSpectator) return null;
    const isSets = match.matchFormat?.type === 'sets';
    const p1 = Number(isSets ? match.p1Sets : match.p1Legs);
    const p2 = Number(isSets ? match.p2Sets : match.p2Legs);
    if (!Number.isFinite(p1) || !Number.isFinite(p2) || p1 <= p2) return null;
    const darts = Number(match.stats?.p1TotalDarts) || 0;
    const points = (Number(match.stats?.p1AccumulatedScore) || 0)
        + Math.max(0, 501 - (Number(match.p1Score) || 0));
    const opponent = match.isWorldCup && match.worldCupTeamP2
        ? { name: match.worldCupTeamP2.country } : match.opponent;
    return {
        tournament: getPressConferenceTournamentName(tournament),
        opponent: opponent?.name || '',
        h2h: match.isWorldCup ? '' : getPressConferenceH2h(opponent),
        score: `${p1}:${p2}`,
        average: darts > 0 ? (points / darts * 3).toFixed(2) : '',
        round: typeof getRoundName === 'function' && !match.grandSlamGroupMatch
            ? getRoundName(round) : ''
    };
}

function queuePostMatchPressConference(context) {
    if (!isWinningPostMatchPressConference(context) || !player || getPressConferenceState().pending) return false;
    return queuePressConference('post', context);
}

function showPendingPressConference() {
    if (typeof document === 'undefined' || !player || !getPressConferenceState().pending) return false;
    const eventModal = document.getElementById('event-modal');
    if (eventModal?.style.display === 'flex') return false;
    const pending = player.pressConferences.pending;
    const selected = getPressConferenceQuestion(pending.questionId);
    const modal = document.getElementById('press-conference-modal');
    if (!selected || !modal) return false;
    const copy = PRESS_CONFERENCE_COPY[getPressConferenceLanguage()];
    const journalist = PRESS_CONFERENCE_JOURNALISTS[pending.journalistIndex]
        || PRESS_CONFERENCE_JOURNALISTS[0];
    document.getElementById('press-conference-type').textContent = copy[pending.phase];
    document.getElementById('press-conference-tournament').textContent = pending.context.tournament;
    document.getElementById('press-conference-journalist').textContent = `${journalist.name} · ${journalist.outlet}`;
    document.getElementById('press-conference-question-label').textContent = copy.question;
    document.getElementById('press-conference-question').textContent = formatPressConferenceText(
        pressConferenceText(selected.topic.questions[selected.index]), pending.context);
    const choices = document.getElementById('press-conference-choices');
    choices.replaceChildren();
    selected.topic.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'press-conference-answer';
        button.textContent = formatPressConferenceText(pressConferenceText(answer), pending.context);
        button.onclick = () => answerPressConference(index);
        choices.appendChild(button);
    });
    document.getElementById('press-conference-outcome').hidden = true;
    modal.style.display = 'flex';
    return true;
}

function answerPressConference(answerIndex) {
    const state = getPressConferenceState();
    const pending = state.pending;
    if (!pending || !getPressConferenceQuestion(pending.questionId)
        || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) return false;
    const possible = PRESS_CONFERENCE_REACTIONS[answerIndex];
    const rolled = possible[Math.floor(Math.random() * possible.length)];
    const oldProf = Number.isFinite(Number(player.prof)) ? Number(player.prof) : 50;
    const oldPop = Number.isFinite(Number(player.pop)) ? Number(player.pop) : 20;
    player.prof = Math.max(0, Math.min(100, oldProf + rolled.prof));
    player.pop = Math.max(0, Math.min(100, oldPop + rolled.pop));
    const actualProf = player.prof - oldProf;
    const actualPop = player.pop - oldPop;
    if (pending.phase === 'pre' && !state.preCompleted.includes(pending.key)) {
        state.preCompleted.push(pending.key);
        state.preCompleted = state.preCompleted.slice(-240);
    }
    state.recentQuestions.push(pending.questionId);
    state.recentQuestions = state.recentQuestions.slice(-16);
    state.pending = null;
    if (typeof updateHub === 'function') updateHub();
    if (typeof saveGame === 'function') saveGame(true);
    const copy = PRESS_CONFERENCE_COPY[getPressConferenceLanguage()];
    const formatDelta = value => value > 0 ? `+${value}` : String(value);
    const changes = [];
    if (actualProf) changes.push(`${copy.prof} ${formatDelta(actualProf)}`);
    if (actualPop) changes.push(`${copy.pop} ${formatDelta(actualPop)}`);
    document.getElementById('press-conference-choices').replaceChildren();
    document.getElementById('press-conference-outcome-title').textContent = copy.reaction;
    document.getElementById('press-conference-outcome-changes').textContent = changes.join(' · ') || copy.unchanged;
    document.getElementById('press-conference-continue').textContent = copy.continue;
    document.getElementById('press-conference-outcome').hidden = false;
    return true;
}

function continueAfterPressConference() {
    const modal = document.getElementById('press-conference-modal');
    if (modal) modal.style.display = 'none';
    const resume = pressConferenceResumeOwner === player ? pressConferenceResume : null;
    pressConferenceResume = null;
    pressConferenceResumeOwner = null;
    if (typeof resume === 'function') resume();
    else if (typeof player !== 'undefined' && player?.pressConferences?.pending) showPendingPressConference();
}
