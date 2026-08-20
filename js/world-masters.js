let worldMastersState = null;

const WORLD_MASTERS_SERIES_NAME = 'Global Masters';
const WORLD_MASTERS_FINALS_NAME = 'Global Masters Finals';
const WORLD_MASTERS_FINALS_QUALIFIER_NAME = 'Global Masters Finals Qualifier';

const WORLD_MASTERS_TRANSLATIONS = {
    pl: {
        seriesName: 'Global Masters', desert: 'Desert Masters', arabian: 'Arabian Masters', northern: 'Northern Masters',
        atlantic: 'Atlantic Masters', aotearoa: 'Aotearoa Masters', southern: 'Southern Masters', finals: 'Global Masters Finals', finalsQualifier: 'Kwalifikacje do Global Masters Finals',
        mailSender: 'Global Masters Tour', mailSubject: 'Zaproszenia: {event}', mailBody: 'Ogłoszono obsadę <strong>{event}</strong>.<br><br><strong>Zaproszone gwiazdy PDC:</strong><br>{stars}<br><br><strong>Gracze regionalni:</strong><br>{locals}<br><br>{role}',
        roleStar: '<strong>Otrzymujesz zaproszenie PDC do tego turnieju.</strong>', roleLocal: '<strong>Wystąpisz jako gracz regionalny.</strong>', roleWatch: 'Twoje nazwisko nie znalazło się w tej obsadzie.',
        finalsMailSubject: 'Stawka potwierdzona: {finals}', finalsMailBody: 'Znamy pełną 32-osobową obsadę <strong>{finals}</strong> w Amsterdamie.<br><br>{players}<br><br>{role}',
        finalsRoleIn: '<strong>Zakwalifikowałeś się do finałów Global Masters.</strong>', finalsRoleOut: 'Nie uzyskałeś kwalifikacji do tegorocznych finałów.',
        qualifierMailSubject: 'Awans do finałów: {finals}', qualifierMailBody: 'Po kwalifikatorze dla posiadaczy kart do <strong>{finals}</strong> awans uzyskali:<br><br>{players}',
        tableName: 'Tabela Global Masters', tableEmpty: 'Tabela cyklu zapełni się po pierwszym turnieju.', player: 'Zawodnik', points: 'Pkt', legs: 'Legi', average: 'Śr.', qualified: 'TOP 24',
        qualifierComplete: 'Czterech kwalifikantów do Global Masters Finals zostało wyłonionych.', finalsComplete: 'Global Masters Finals zakończone.'
    },
    en: {
        seriesName: 'Global Masters', desert: 'Desert Masters', arabian: 'Arabian Masters', northern: 'Northern Masters',
        atlantic: 'Atlantic Masters', aotearoa: 'Aotearoa Masters', southern: 'Southern Masters', finals: 'Global Masters Finals', finalsQualifier: 'Global Masters Finals Qualifier',
        mailSender: 'Global Masters Tour', mailSubject: 'Invitations: {event}', mailBody: 'The field for <strong>{event}</strong> has been announced.<br><br><strong>Invited PDC stars:</strong><br>{stars}<br><br><strong>Regional players:</strong><br>{locals}<br><br>{role}',
        roleStar: '<strong>You have received a PDC invitation to this event.</strong>', roleLocal: '<strong>You will play as a regional player.</strong>', roleWatch: 'Your name is not in this field.',
        finalsMailSubject: 'Field confirmed: {finals}', finalsMailBody: 'The full 32-player field for <strong>{finals}</strong> in Amsterdam is confirmed.<br><br>{players}<br><br>{role}',
        finalsRoleIn: '<strong>You have qualified for the Global Masters Finals.</strong>', finalsRoleOut: 'You did not qualify for this year’s finals.',
        qualifierMailSubject: 'Finals qualification: {finals}', qualifierMailBody: 'The Tour Card Holder Qualifier has produced these four qualifiers for <strong>{finals}</strong>:<br><br>{players}',
        tableName: 'Global Masters Standings', tableEmpty: 'The standings will populate after the first event.', player: 'Player', points: 'Pts', legs: 'Legs', average: 'Avg.', qualified: 'TOP 24',
        qualifierComplete: 'The four Global Masters Finals qualifiers have been determined.', finalsComplete: 'The Global Masters Finals are complete.'
    },
    de: {
        seriesName: 'Global Masters', desert: 'Desert Masters', arabian: 'Arabian Masters', northern: 'Northern Masters',
        atlantic: 'Atlantic Masters', aotearoa: 'Aotearoa Masters', southern: 'Southern Masters', finals: 'Global Masters Finals', finalsQualifier: 'Qualifikation für die Global Masters Finals',
        mailSender: 'Global Masters Tour', mailSubject: 'Einladungen: {event}', mailBody: 'Das Teilnehmerfeld für <strong>{event}</strong> wurde bekannt gegeben.<br><br><strong>Eingeladene PDC-Stars:</strong><br>{stars}<br><br><strong>Regionale Spieler:</strong><br>{locals}<br><br>{role}',
        roleStar: '<strong>Du hast eine PDC-Einladung für dieses Turnier erhalten.</strong>', roleLocal: '<strong>Du trittst als regionaler Spieler an.</strong>', roleWatch: 'Dein Name steht nicht in diesem Teilnehmerfeld.',
        finalsMailSubject: 'Teilnehmerfeld bestätigt: {finals}', finalsMailBody: 'Das komplette 32-Spieler-Feld für <strong>{finals}</strong> in Amsterdam steht fest.<br><br>{players}<br><br>{role}',
        finalsRoleIn: '<strong>Du hast dich für die Global Masters Finals qualifiziert.</strong>', finalsRoleOut: 'Du hast dich nicht für die Finals in diesem Jahr qualifiziert.',
        qualifierMailSubject: 'Finalqualifikation: {finals}', qualifierMailBody: 'Der Qualifikator für Tour-Card-Inhaber hat diese vier Spieler für <strong>{finals}</strong> hervorgebracht:<br><br>{players}',
        tableName: 'Global-Masters-Tabelle', tableEmpty: 'Die Tabelle füllt sich nach dem ersten Turnier.', player: 'Spieler', points: 'Pkt.', legs: 'Legs', average: 'Schnitt', qualified: 'TOP 24',
        qualifierComplete: 'Die vier Qualifikanten für die Global Masters Finals stehen fest.', finalsComplete: 'Die Global Masters Finals sind beendet.'
    },
    nl: {
        seriesName: 'Global Masters', desert: 'Desert Masters', arabian: 'Arabian Masters', northern: 'Northern Masters',
        atlantic: 'Atlantic Masters', aotearoa: 'Aotearoa Masters', southern: 'Southern Masters', finals: 'Global Masters Finals', finalsQualifier: 'Kwalificatie Global Masters Finals',
        mailSender: 'Global Masters Tour', mailSubject: 'Uitnodigingen: {event}', mailBody: 'Het deelnemersveld voor <strong>{event}</strong> is bekendgemaakt.<br><br><strong>Uitgenodigde PDC-sterren:</strong><br>{stars}<br><br><strong>Regionale spelers:</strong><br>{locals}<br><br>{role}',
        roleStar: '<strong>Je hebt een PDC-uitnodiging voor dit evenement ontvangen.</strong>', roleLocal: '<strong>Je speelt als regionale speler.</strong>', roleWatch: 'Jouw naam staat niet in dit deelnemersveld.',
        finalsMailSubject: 'Deelnemersveld bevestigd: {finals}', finalsMailBody: 'Het volledige 32-spelersveld voor <strong>{finals}</strong> in Amsterdam is bevestigd.<br><br>{players}<br><br>{role}',
        finalsRoleIn: '<strong>Je hebt je geplaatst voor de Global Masters Finals.</strong>', finalsRoleOut: 'Je hebt je niet geplaatst voor de finales van dit jaar.',
        qualifierMailSubject: 'Kwalificatie voor de finales: {finals}', qualifierMailBody: 'De Tour Card Holder Qualifier leverde deze vier kwalificanten op voor <strong>{finals}</strong>:<br><br>{players}',
        tableName: 'Global Masters-stand', tableEmpty: 'De stand wordt na het eerste evenement gevuld.', player: 'Speler', points: 'Ptn', legs: 'Legs', average: 'Gem.', qualified: 'TOP 24',
        qualifierComplete: 'De vier kwalificanten voor de Global Masters Finals zijn bekend.', finalsComplete: 'De Global Masters Finals zijn afgelopen.'
    }
};

const WORLD_MASTERS_EVENTS = [
    { id: 'desert', name: 'Desert Masters', month: 0, day: 15, endDay: 16, city: 'Sakhir', country: 'Bahrajn', regionCountries: ['Bahrajn', 'Filipiny', 'Japonia', 'Singapur', 'Hongkong'], localPriority: ['Alexis Toylen', 'Laurent Ilogan', 'Motomu Sakaii', 'Ryu Asemoto', 'Paul Limm', 'Man Lok Leun', 'Abdullah Seid', 'Basem Mahmud'] },
    { id: 'arabian', name: 'Arabian Masters', month: 0, day: 19, endDay: 20, city: 'Rijad', country: 'Arabia Saudyjska', regionCountries: ['Bahrajn', 'Filipiny', 'Japonia', 'Singapur', 'Hongkong', 'Indie'], localPriority: ['Alexis Toylen', 'Motomu Sakaii', 'Laurent Ilogan', 'Ryu Asemoto', 'Paul Limm', 'Man Lok Leun', 'Tomoya Gote', 'Nitin Kumor'] },
    { id: 'northern', name: 'Northern Masters', month: 5, day: 5, endDay: 6, city: 'Kopenhaga', country: 'Dania', regionCountries: ['Dania', 'Szwecja', 'Norwegia', 'Łotwa', 'Litwa', 'Finlandia', 'Islandia'], localPriority: ['Mads Ramza', 'Jeff de Giraffe', 'Cor Dekar', 'Oscar Lucasi', 'Darius Labana', 'Viktor Tingren', 'Andreas Harrison', 'Daniel Larssen'] },
    { id: 'atlantic', name: 'Atlantic Masters', month: 5, day: 25, endDay: 26, city: 'Nowy Jork', country: 'USA', regionCountries: ['USA', 'Kanada'], localPriority: ['Jim Longe', 'Alex Spellar', 'Davy Cameran', 'Leon Gates', 'Garry Mayson', 'Fred Kreuger', 'Adam Sevado', 'Braydon Hale'] },
    { id: 'aotearoa', name: 'Aotearoa Masters', month: 7, day: 14, endDay: 15, city: 'Auckland', country: 'Nowa Zelandia', regionCountries: ['Nowa Zelandia', 'Australia'], forceInvite: 'Damian Heat', localPriority: ['Adam Leeke', 'Simon Whitler', 'Ben Robbin', 'Johnny Tatta', 'Mark Cleven', 'Kayden Mils', 'Haupai Puhu', 'Raymond Smyth'] },
    { id: 'southern', name: 'Southern Masters', month: 7, day: 21, endDay: 22, city: 'Wollongong', country: 'Australia', regionCountries: ['Australia', 'Nowa Zelandia'], forceInvite: 'Damian Heat', localPriority: ['Adam Leeke', 'Simon Whitler', 'Raymond Smyth', 'Brody Kling', 'Tim Puse', 'Joe Comit', 'Mal Cumin', 'Ben Robbin'] }
];

const WORLD_MASTERS_CALENDAR = [
    ...WORLD_MASTERS_EVENTS.map(event => ({ ...event, format: 'legs', minOvr: 0, specialType: 'worldMasters', worldMastersEvent: event.id })),
    { name: WORLD_MASTERS_FINALS_QUALIFIER_NAME, month: 8, day: 14, city: 'Amsterdam', country: 'Holandia', format: 'legs', minOvr: 0, specialType: 'worldMastersFinalsQualifier' },
    { name: WORLD_MASTERS_FINALS_NAME, month: 8, day: 17, endDay: 20, city: 'Amsterdam', country: 'Holandia', format: 'legs', minOvr: 0, specialType: 'worldMastersFinals' }
];

function trWorldMasters(key, values = {}) {
    const language = typeof currentLang === 'string' && WORLD_MASTERS_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = WORLD_MASTERS_TRANSLATIONS[language][key] || WORLD_MASTERS_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function getWorldMastersSeasonYear() {
    return currentDate instanceof Date && !Number.isNaN(currentDate.getTime()) ? currentDate.getFullYear() : new Date().getFullYear();
}

function isWorldMastersTournament(tournament = activeTournament) {
    return Boolean(tournament && tournament.specialType === 'worldMasters');
}

function isWorldMastersFinalsTournament(tournament = activeTournament) {
    return Boolean(tournament && tournament.specialType === 'worldMastersFinals');
}

function isWorldMastersFinalsQualifierTournament(tournament = activeTournament) {
    return Boolean(tournament && tournament.specialType === 'worldMastersFinalsQualifier');
}

function isWorldMastersName(name) {
    return WORLD_MASTERS_CALENDAR.some(event => event.name === name)
        || (Array.isArray(tournamentDatabase) && tournamentDatabase.some(event => event.name === name && (
            event.specialType === 'worldMasters' || event.specialType === 'worldMastersFinals' || event.specialType === 'worldMastersFinalsQualifier'
        )));
}

function getWorldMastersEvent(tournament) {
    const id = typeof tournament === 'object' ? tournament?.worldMastersEvent : tournament;
    return WORLD_MASTERS_EVENTS.find(event => event.id === id) || null;
}

function getWorldMastersTournamentDisplayName(tournament) {
    if (tournament && typeof tournament === 'object' && typeof tournament.name === 'string') return tournament.name;
    if (isWorldMastersFinalsQualifierTournament(tournament) || tournament === WORLD_MASTERS_FINALS_QUALIFIER_NAME) {
        return tournamentDatabase.find(event => event.specialType === 'worldMastersFinalsQualifier')?.name || trWorldMasters('finalsQualifier');
    }
    if (isWorldMastersFinalsTournament(tournament) || tournament === WORLD_MASTERS_FINALS_NAME) {
        return tournamentDatabase.find(event => event.specialType === 'worldMastersFinals')?.name || trWorldMasters('finals');
    }
    const event = getWorldMastersEvent(tournament);
    if (!event) return typeof tournament === 'string' ? tournament : tournament?.name || '';
    return tournamentDatabase.find(candidate => candidate.worldMastersEvent === event.id)?.name || trWorldMasters(event.id);
}

function getWorldMastersPlayerKey(candidate) {
    return candidate ? `${candidate.sourceName || candidate.name || ''}|${candidate.country || ''}` : '';
}

function getWorldMastersAllPlayers() {
    const unique = new Map();
    const candidates = [
        ...(Array.isArray(pdcPlayers) ? pdcPlayers : []),
        ...(typeof player !== 'undefined' && player ? [player] : [])
    ];
    candidates.filter(candidate => candidate && !candidate.isBye).forEach(candidate => {
        const key = getWorldMastersPlayerKey(candidate);
        if (key && !unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function findWorldMastersPlayer(key) {
    return getWorldMastersAllPlayers().find(candidate => getWorldMastersPlayerKey(candidate) === key) || null;
}

function shuffleWorldMasters(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const target = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
    }
    return shuffled;
}

function createWorldMastersState(year = getWorldMastersSeasonYear()) {
    return { version: 1, year, events: {}, rows: {}, finalsQualifier: null, finals: null, sentMails: {} };
}

function ensureWorldMastersState(year = getWorldMastersSeasonYear()) {
    if (!worldMastersState || Number(worldMastersState.year) !== year) worldMastersState = createWorldMastersState(year);
    if (!worldMastersState.events || typeof worldMastersState.events !== 'object') worldMastersState.events = {};
    if (!worldMastersState.rows || typeof worldMastersState.rows !== 'object') worldMastersState.rows = {};
    if (!worldMastersState.sentMails || typeof worldMastersState.sentMails !== 'object') worldMastersState.sentMails = {};
    return worldMastersState;
}

function resetWorldMastersSeason(year = getWorldMastersSeasonYear()) {
    worldMastersState = createWorldMastersState(year);
}

function restoreWorldMastersState(savedState) {
    if (!savedState || typeof savedState !== 'object') {
        worldMastersState = null;
        return null;
    }
    worldMastersState = savedState;
    return ensureWorldMastersState(getWorldMastersSeasonYear());
}

function getWorldMastersRow(candidate) {
    if (!candidate) return null;
    const state = ensureWorldMastersState();
    const key = getWorldMastersPlayerKey(candidate);
    if (!state.rows[key]) {
        state.rows[key] = { key, name: candidate.name, country: candidate.country, points: 0, legsWon: 0, legsLost: 0, averageTotal: 0, averageMatches: 0 };
    }
    return state.rows[key];
}

function getWorldMastersRankingRows() {
    const state = ensureWorldMastersState();
    return Object.values(state.rows).map(row => {
        const candidate = findWorldMastersPlayer(row.key);
        return {
            ...row,
            player: candidate,
            pdcMoney: Number(candidate?.prizeMoney) || 0,
            average: row.averageMatches ? row.averageTotal / row.averageMatches : 0
        };
    }).sort((first, second) => second.points - first.points || second.pdcMoney - first.pdcMoney || second.legsWon - first.legsWon || second.average - first.average || first.name.localeCompare(second.name, 'pl'));
}

function resolveWorldMastersPlayers(keys) {
    return (Array.isArray(keys) ? keys : []).map(findWorldMastersPlayer).filter(Boolean);
}

function getWorldMastersTourCardPlayers() {
    return getWorldMastersAllPlayers().filter(candidate => candidate.hasTourCard !== false || isCurrentPlayer(candidate))
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0) || (Number(second.ovr) || 0) - (Number(first.ovr) || 0));
}

function ensureWorldMastersEventField(tournament) {
    const event = getWorldMastersEvent(tournament);
    if (!event) return null;
    const state = ensureWorldMastersState();
    if (state.events[event.id]) return state.events[event.id];

    const topSixteen = getWorldMastersTourCardPlayers().slice(0, 16);
    const forcedPlayer = event.forceInvite ? getWorldMastersAllPlayers().find(candidate => (candidate.sourceName || candidate.name) === event.forceInvite) : null;
    const invited = [];
    if (forcedPlayer) invited.push(forcedPlayer);
    shuffleWorldMasters(topSixteen.filter(candidate => !invited.includes(candidate))).some(candidate => {
        if (invited.length < 8) invited.push(candidate);
        return invited.length === 8;
    });

    const preferredLocals = event.localPriority.map(name => getWorldMastersAllPlayers().find(candidate => (candidate.sourceName || candidate.name) === name)).filter(Boolean);
    const regionalLocals = getWorldMastersAllPlayers().filter(candidate => event.regionCountries.includes(candidate.country));
    const localCandidates = [];
    const addLocal = candidate => {
        if (candidate && !invited.includes(candidate) && !localCandidates.includes(candidate)) localCandidates.push(candidate);
    };
    if (typeof player !== 'undefined' && player && event.regionCountries.includes(player.country)) addLocal(player);
    preferredLocals.forEach(addLocal);
    regionalLocals.sort((first, second) => (Number(second.ovr) || 0) - (Number(first.ovr) || 0)).forEach(addLocal);
    const locals = localCandidates.slice(0, 8);

    const field = {
        invitedKeys: invited.map(getWorldMastersPlayerKey),
        localKeys: locals.map(getWorldMastersPlayerKey),
        completed: false,
        matchKeys: [],
        winnerAwarded: false
    };
    state.events[event.id] = field;
    return field;
}

function getWorldMastersTournamentParticipants(tournament = activeTournament) {
    if (isWorldMastersTournament(tournament)) {
        const field = ensureWorldMastersEventField(tournament);
        return field ? [...resolveWorldMastersPlayers(field.invitedKeys), ...resolveWorldMastersPlayers(field.localKeys)] : [];
    }
    if (isWorldMastersFinalsQualifierTournament(tournament)) return getWorldMastersFinalsQualifierParticipants();
    if (isWorldMastersFinalsTournament(tournament)) return getWorldMastersFinalsField().participants;
    return [];
}

function getWorldMastersTournamentRound(tournament = activeTournament) {
    return isWorldMastersFinalsTournament(tournament) ? 32 : 16;
}

function buildWorldMastersTournamentDraw(tournament, participants = getWorldMastersTournamentParticipants(tournament)) {
    if (isWorldMastersTournament(tournament)) {
        const field = ensureWorldMastersEventField(tournament);
        const invited = resolveWorldMastersPlayers(field?.invitedKeys);
        const locals = shuffleWorldMasters(resolveWorldMastersPlayers(field?.localKeys));
        return invited.flatMap((star, index) => [star, locals[index]]).filter(Boolean);
    }
    if (isWorldMastersFinalsTournament(tournament)) {
        const finals = getWorldMastersFinalsField();
        const seeds = resolveWorldMastersPlayers(finals.worldSeriesKeys.slice(0, 8));
        const nonSeeds = shuffleWorldMasters(participants.filter(candidate => !seeds.includes(candidate)));
        return seeds.flatMap((seed, index) => [seed, nonSeeds[index]]).filter(Boolean);
    }
    return shuffleWorldMasters(participants);
}

function getWorldMastersAutomaticFinalistKeys() {
    const ranking = getWorldMastersRankingRows();
    const worldSeriesKeys = ranking.slice(0, 24).map(row => row.key);
    const selected = new Set(worldSeriesKeys);
    const oomKeys = getWorldMastersTourCardPlayers().filter(candidate => !selected.has(getWorldMastersPlayerKey(candidate))).slice(0, 4).map(getWorldMastersPlayerKey);
    return { worldSeriesKeys, oomKeys };
}

function getWorldMastersFinalsQualifierParticipants() {
    const state = ensureWorldMastersState();
    if (state.finalsQualifier?.participantKeys) return resolveWorldMastersPlayers(state.finalsQualifier.participantKeys);
    const automatic = getWorldMastersAutomaticFinalistKeys();
    const automaticKeys = new Set([...automatic.worldSeriesKeys, ...automatic.oomKeys]);
    const participantKeys = getWorldMastersTourCardPlayers().filter(candidate => !automaticKeys.has(getWorldMastersPlayerKey(candidate))).slice(0, 16).map(getWorldMastersPlayerKey);
    state.finalsQualifier = { participantKeys, qualifiedKeys: [], completed: false };
    return resolveWorldMastersPlayers(participantKeys);
}

function completeWorldMastersFinalsQualifier(tournament, qualifiedPlayers) {
    const state = ensureWorldMastersState();
    const qualifier = state.finalsQualifier || { participantKeys: [], qualifiedKeys: [], completed: false };
    qualifier.qualifiedKeys = qualifiedPlayers.map(getWorldMastersPlayerKey).slice(0, 4);
    qualifier.completed = true;
    state.finalsQualifier = qualifier;
    if (tournament) tournament.worldMastersQualifiers = qualifier.qualifiedKeys;
    sendWorldMastersFinalsQualifierEmail(qualifiedPlayers);
}

function autoCompleteWorldMastersFinalsQualifier() {
    const state = ensureWorldMastersState();
    const participants = getWorldMastersFinalsQualifierParticipants();
    if (!state.finalsQualifier?.completed) completeWorldMastersFinalsQualifier(null, participants.slice(0, 4));
    return resolveWorldMastersPlayers(state.finalsQualifier.qualifiedKeys);
}

function getWorldMastersFinalsField() {
    const state = ensureWorldMastersState();
    if (state.finals?.participantKeys) return { ...state.finals, participants: resolveWorldMastersPlayers(state.finals.participantKeys) };
    const automatic = getWorldMastersAutomaticFinalistKeys();
    let qualifierKeys = state.finalsQualifier?.completed ? state.finalsQualifier.qualifiedKeys : autoCompleteWorldMastersFinalsQualifier().map(getWorldMastersPlayerKey);
    const selected = new Set([...automatic.worldSeriesKeys, ...automatic.oomKeys]);
    qualifierKeys = qualifierKeys.filter(key => !selected.has(key)).slice(0, 4);
    qualifierKeys.forEach(key => selected.add(key));
    const fallbackKeys = getWorldMastersTourCardPlayers().map(getWorldMastersPlayerKey).filter(key => !selected.has(key));
    const participantKeys = [...automatic.worldSeriesKeys, ...automatic.oomKeys, ...qualifierKeys, ...fallbackKeys].slice(0, 32);
    state.finals = { worldSeriesKeys: automatic.worldSeriesKeys, oomKeys: automatic.oomKeys, qualifierKeys, participantKeys, completed: false };
    return { ...state.finals, participants: resolveWorldMastersPlayers(participantKeys) };
}

function recordWorldMastersMatchResult(tournament, winner, loser, details = {}) {
    if (!isWorldMastersTournament(tournament)) return;
    const event = getWorldMastersEvent(tournament);
    const field = ensureWorldMastersEventField(tournament);
    if (!event || !field || !winner || !loser) return;
    const matchKey = `${details.round}|${getWorldMastersPlayerKey(winner)}|${getWorldMastersPlayerKey(loser)}`;
    if (field.matchKeys.includes(matchKey)) return;
    field.matchKeys.push(matchKey);
    const winnerRow = getWorldMastersRow(winner);
    const loserRow = getWorldMastersRow(loser);
    const winnerLegs = Math.max(0, Number(details.winnerLegs) || 0);
    const loserLegs = Math.max(0, Number(details.loserLegs) || 0);
    const addStats = (row, won, lost, average) => {
        row.legsWon += won;
        row.legsLost += lost;
        const numericAverage = Number(average);
        if (Number.isFinite(numericAverage) && numericAverage > 0) {
            row.averageTotal += numericAverage;
            row.averageMatches += 1;
        }
    };
    addStats(winnerRow, winnerLegs, loserLegs, details.winnerAverage);
    addStats(loserRow, loserLegs, winnerLegs, details.loserAverage);
    const eliminationPoints = ({ 16: 1, 8: 3, 4: 5, 2: 8 })[details.round] || 0;
    loserRow.points += eliminationPoints;
}

function completeWorldMastersTournament(tournament, winner) {
    if (!tournament || !winner) return;
    const state = ensureWorldMastersState();
    if (isWorldMastersTournament(tournament)) {
        const field = ensureWorldMastersEventField(tournament);
        if (!field.winnerAwarded) {
            getWorldMastersRow(winner).points += 12;
            field.winnerAwarded = true;
        }
        field.completed = true;
    } else if (isWorldMastersFinalsTournament(tournament)) {
        getWorldMastersFinalsField();
        state.finals = { ...state.finals, completed: true, winnerKey: getWorldMastersPlayerKey(winner) };
    }
    tournament.worldMastersWinner = { name: winner.name, country: winner.country };
}

function getWorldMastersPrizeMoney(tournament, round, won) {
    if (isWorldMastersFinalsTournament(tournament) || tournament === WORLD_MASTERS_FINALS_NAME) {
        if (won && round === 2) return 100000;
        return ({ 2: 60000, 4: 30000, 8: 17500, 16: 10000, 32: 5000 })[round] || 0;
    }
    if (isWorldMastersTournament(tournament) || isWorldMastersName(tournament)) {
        if (won && round === 2) return 30000;
        return ({ 2: 16000, 4: 10000, 8: 5000, 16: 1750 })[round] || 0;
    }
    return 0;
}

function getWorldMastersMatchFormat(tournament, round) {
    if (isWorldMastersFinalsTournament(tournament)) {
        if (round >= 16) return { type: 'legs', legsToWin: 6 };
        if (round === 8) return { type: 'legs', legsToWin: 10 };
        return { type: 'legs', legsToWin: 11 };
    }
    if (isWorldMastersTournament(tournament)) {
        if (round >= 8) return { type: 'legs', legsToWin: 6 };
        if (round === 4) return { type: 'legs', legsToWin: 7 };
        return { type: 'legs', legsToWin: 8 };
    }
    return { type: 'legs', legsToWin: 6 };
}

function getWorldMastersListHtml(players) {
    return players.map(candidate => `${getFlagImg(candidate.country)} ${escapeHtml(candidate.name)}`).join('<br>');
}

function sendWorldMastersInvitationEmail(tournament) {
    if (!isWorldMastersTournament(tournament) || typeof addEmail !== 'function') return;
    const state = ensureWorldMastersState();
    const event = getWorldMastersEvent(tournament);
    const field = ensureWorldMastersEventField(tournament);
    const mailKey = `event:${event.id}`;
    if (!event || !field || state.sentMails[mailKey]) return;
    const invited = resolveWorldMastersPlayers(field.invitedKeys);
    const locals = resolveWorldMastersPlayers(field.localKeys);
    const playerKey = typeof player !== 'undefined' && player ? getWorldMastersPlayerKey(player) : '';
    const role = field.invitedKeys.includes(playerKey) ? trWorldMasters('roleStar') : field.localKeys.includes(playerKey) ? trWorldMasters('roleLocal') : trWorldMasters('roleWatch');
    addEmail(trWorldMasters('mailSender'), trWorldMasters('mailSubject', { event: getWorldMastersTournamentDisplayName(tournament) }), trWorldMasters('mailBody', {
        event: getWorldMastersTournamentDisplayName(tournament), stars: getWorldMastersListHtml(invited), locals: getWorldMastersListHtml(locals), role
    }));
    state.sentMails[mailKey] = true;
}

function sendWorldMastersFinalsQualifierEmail(qualifiedPlayers) {
    const state = ensureWorldMastersState();
    if (state.sentMails.finalsQualifier || typeof addEmail !== 'function') return;
    addEmail(trWorldMasters('mailSender'), trWorldMasters('qualifierMailSubject', { finals: trWorldMasters('finals') }), trWorldMasters('qualifierMailBody', {
        finals: trWorldMasters('finals'), players: getWorldMastersListHtml(qualifiedPlayers)
    }));
    state.sentMails.finalsQualifier = true;
}

function sendWorldMastersFinalsFieldEmail() {
    const state = ensureWorldMastersState();
    if (state.sentMails.finals || typeof addEmail !== 'function') return;
    const finals = getWorldMastersFinalsField();
    const participants = finals.participants;
    const playerKey = typeof player !== 'undefined' && player ? getWorldMastersPlayerKey(player) : '';
    const role = finals.participantKeys.includes(playerKey) ? trWorldMasters('finalsRoleIn') : trWorldMasters('finalsRoleOut');
    addEmail(trWorldMasters('mailSender'), trWorldMasters('finalsMailSubject', { finals: trWorldMasters('finals') }), trWorldMasters('finalsMailBody', {
        finals: trWorldMasters('finals'), players: getWorldMastersListHtml(participants), role
    }));
    state.sentMails.finals = true;
}

function handleWorldMastersTournamentDay(tournament) {
    if (isWorldMastersTournament(tournament)) sendWorldMastersInvitationEmail(tournament);
    if (isWorldMastersFinalsTournament(tournament)) sendWorldMastersFinalsFieldEmail();
}

function concludeWorldMastersFinalsQualifierEvent(showOutcome = true) {
    if (!isWorldMastersFinalsQualifierTournament(activeTournament)) return null;
    const qualifierTournament = activeTournament;
    qualifierTournament.completed = true;
    qualifierTournament.historyLogs = lastTournamentResults;
    activeTournament = null;
    tournamentBracket = [];
    const tile = document.getElementById('tile-tournament');
    if (tile) tile.style.display = 'none';
    if (typeof updateHub === 'function') updateHub();
    if (typeof saveGame === 'function') saveGame(true);
    if (showOutcome) alert(trWorldMasters('qualifierComplete'));
    return qualifierTournament;
}

function migrateWorldMastersCalendar() {
    if (!Array.isArray(tournamentDatabase)) return;
    WORLD_MASTERS_CALENDAR.forEach(template => {
        const existing = tournamentDatabase.find(tournament => tournament.specialType === template.specialType && (template.worldMastersEvent ? tournament.worldMastersEvent === template.worldMastersEvent : true))
            || tournamentDatabase.find(tournament => tournament.name === template.name);
        if (existing) {
            Object.assign(existing, { ...template, name: existing.name || template.name, completed: Boolean(existing.completed), historyLogs: existing.historyLogs || '' });
        } else {
            tournamentDatabase.push({ ...template, completed: false, historyLogs: '' });
        }
    });
    const continentalThirteen = tournamentDatabase.find(tournament => tournament.name === 'Continental Tour 13');
    if (continentalThirteen) Object.assign(continentalThirteen, { month: 8, day: 21, endDay: 23 });
}

function renderWorldMastersRanking(list) {
    const rows = getWorldMastersRankingRows();
    if (!rows.length) {
        list.innerHTML = `<div style="text-align:center; margin-top:40px; color:#bdc3c7;">${trWorldMasters('tableEmpty')}</div>`;
        return;
    }
    list.innerHTML = `<div style="border-bottom:2px solid var(--accent-green); padding:5px 10px; display:flex; font-size:12px; color:#bdc3c7; font-weight:bold; background:#0f3460;"><div style="flex:3;">${trWorldMasters('player')}</div><div style="flex:1; text-align:center;">${trWorldMasters('points')}</div><div style="flex:2; text-align:center;">${trWorldMasters('legs')}</div><div style="flex:1; text-align:right;">${trWorldMasters('average')}</div></div>`;
    rows.forEach((row, index) => {
        const candidate = row.player || row;
        const isMe = candidate && typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
        const qualified = index < 24;
        list.innerHTML += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(candidate?.id || '')}" style="border-bottom:1px solid var(--border-color); ${isMe ? 'background:rgba(39,174,96,.2);' : qualified ? 'background:rgba(41,128,185,.1);' : ''}"><div style="flex:3;"><strong>${index + 1}.</strong> ${getFlagImg(row.country)} ${escapeHtml(row.name)} ${isMe ? '<b style="color:var(--accent-green)">(TY)</b>' : ''}${qualified ? ` <small style="color:#f1c40f;">${trWorldMasters('qualified')}</small>` : ''}</div><div style="flex:1; text-align:center; color:#f1c40f; font-weight:bold;">${row.points}</div><div style="flex:2; text-align:center; color:#bdc3c7;">${row.legsWon}-${row.legsLost}</div><div style="flex:1; text-align:right; color:#bdc3c7;">${row.average ? row.average.toFixed(2) : '—'}</div></button>`;
    });
}

function refreshWorldMastersTranslations() {
    const button = document.getElementById('btn-rank-world-masters');
    if (button) button.innerText = trWorldMasters('tableName');
}

const getBaseTournamentDisplayName = typeof window.getTournamentDisplayName === 'function'
    ? window.getTournamentDisplayName
    : tournament => tournament?.name || tournament || '';
window.getTournamentDisplayName = function getTournamentDisplayName(tournament) {
    if (isWorldMastersTournament(tournament) || isWorldMastersFinalsTournament(tournament) || isWorldMastersFinalsQualifierTournament(tournament)) {
        return getWorldMastersTournamentDisplayName(tournament);
    }
    return getBaseTournamentDisplayName(tournament);
};
