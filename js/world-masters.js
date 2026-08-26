let worldMastersState = null;

const WORLD_MASTERS_SERIES_NAME = 'Global Masters';
const WORLD_MASTERS_FINALS_NAME = 'Global Masters Finals';
const WORLD_MASTERS_FINALS_QUALIFIER_NAME = 'Global Masters Finals Qualifier';
const WORLD_MASTERS_INVITATION_RULE = 'top-14-oom-balanced-8';
const WORLD_MASTERS_FINALS_QUALIFIER_VERSION = 2;
const WORLD_MASTERS_FINALS_QUALIFIER_PLACES = 4;
const WORLD_MASTERS_FINALS_DRAW_VERSION = 2;
const WORLD_MASTERS_LEGACY_EVENT_NAMES = {
    atlantic: ['US Masters']
};

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
    { id: 'northern', name: 'Northern Masters', month: 5, day: 5, endDay: 6, city: 'Kopenhaga', country: 'Dania', regionCountries: ['Dania', 'Szwecja', 'Norwegia', 'Łotwa', 'Litwa', 'Finlandia', 'Islandia'], localPriority: ['Mads Ramza', 'Jeff de Giraffe', 'Cor Deckers', 'Oscar Lukas', 'Darius Labana', 'Victor Tingstrom', 'Andreas Harrison', 'Daniel Larssen'] },
    { id: 'atlantic', name: 'Atlantic Masters', month: 5, day: 25, endDay: 26, city: 'Nowy Jork', country: 'USA', regionCountries: ['USA', 'Kanada'], localPriority: ['Jimmy Longley', 'Alex Spellar', 'Davy Cameran', 'Leon Gates', 'Garry Mayson', 'Fred Kreuger', 'Adam Sevado', 'Braydon Hale'] },
    { id: 'aotearoa', name: 'Aotearoa Masters', month: 7, day: 14, endDay: 15, city: 'Auckland', country: 'Nowa Zelandia', regionCountries: ['Nowa Zelandia', 'Australia'], localPriority: ['Adam Leak', 'Simon Whitler', 'Ben Robbin', 'Johnny Tatta', 'Mark Cleven', 'Kayden Mils', 'Haupai Puhu', 'Raymond Smyth'] },
    { id: 'southern', name: 'Southern Masters', month: 7, day: 21, endDay: 22, city: 'Wollongong', country: 'Australia', regionCountries: ['Australia', 'Nowa Zelandia'], localPriority: ['Adam Leak', 'Simon Whitler', 'Raymond Smyth', 'Brody Kling', 'Tim Puse', 'Joe Comit', 'Mal Cumin', 'Ben Robbin'] }
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

function shuffleWorldMasters(items, random = Math.random) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const target = Math.floor(random() * (index + 1));
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
    return getWorldMastersAllPlayers().filter(candidate => candidate.hasTourCard === true)
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0) || (Number(second.ovr) || 0) - (Number(first.ovr) || 0));
}

function completeWorldMastersFieldKeys(preferredKeys, targetSize, excludedKeys = []) {
    const selected = new Set(excludedKeys);
    const result = [];
    const addCandidate = candidate => {
        const key = getWorldMastersPlayerKey(candidate);
        if (!candidate || !key || selected.has(key) || result.length >= targetSize) return;
        selected.add(key);
        result.push(key);
    };

    resolveWorldMastersPlayers(preferredKeys).forEach(addCandidate);
    getWorldMastersTourCardPlayers().forEach(addCandidate);
    getWorldMastersAllPlayers()
        .slice()
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0) || (Number(second.ovr) || 0) - (Number(first.ovr) || 0))
        .forEach(addCandidate);
    return result;
}

function getWorldMastersEventFieldPlayers(field) {
    return {
        invited: resolveWorldMastersPlayers(field?.invitedKeys),
        locals: resolveWorldMastersPlayers(field?.localKeys)
    };
}

function isWorldMastersEventFieldPlayable(field) {
    if (!field) return false;
    const { invited, locals } = getWorldMastersEventFieldPlayers(field);
    const playerKeys = [...invited, ...locals].map(getWorldMastersPlayerKey);
    return invited.length === 8 && locals.length === 8 && new Set(playerKeys).size === 16;
}

function getWorldMastersInvitationCounts(candidates) {
    const candidateKeys = new Set(candidates.map(getWorldMastersPlayerKey).filter(Boolean));
    const counts = new Map([...candidateKeys].map(key => [key, 0]));
    const state = ensureWorldMastersState();

    Object.values(state.events).forEach(field => {
        (field?.invitedKeys || []).forEach(key => {
            if (counts.has(key)) counts.set(key, counts.get(key) + 1);
        });
    });
    return counts;
}

function createWorldMastersEventField(event) {
    const allPlayers = getWorldMastersAllPlayers();
    const tourCardPlayers = getWorldMastersTourCardPlayers();
    const invited = [];
    const selectedKeys = new Set();
    const addCandidate = (list, candidate) => {
        const key = getWorldMastersPlayerKey(candidate);
        if (!candidate || !key || selectedKeys.has(key)) return false;
        list.push(candidate);
        selectedKeys.add(key);
        return true;
    };

    // Każdy turniej World Series ma ośmiu zaproszonych z aktualnego Top 14
    // Order of Merit. Pierwszeństwo mają zawodnicy z najmniejszą liczbą
    // wcześniejszych zaproszeń w sezonie; losowanie rozstrzyga tylko remisy.
    // Dzięki temu ten sam gracz z Top 14 nie może być pomijany przez cały rok.
    const topOomCandidates = tourCardPlayers.slice(0, 14);
    const invitationCounts = getWorldMastersInvitationCounts(topOomCandidates);
    const balancedTopOomCandidates = shuffleWorldMasters(topOomCandidates)
        .sort((first, second) => (
            (invitationCounts.get(getWorldMastersPlayerKey(first)) || 0)
            - (invitationCounts.get(getWorldMastersPlayerKey(second)) || 0)
        ));
    balancedTopOomCandidates.some(candidate => {
        if (invited.length < 8) addCandidate(invited, candidate);
        return invited.length === 8;
    });

    // Awaryjnie uzupełniamy ósemkę gwiazd całą dostępną bazą. Dzięki temu
    // emerytura zaproszonego zawodnika nie może zostawić niepełnej drabinki.
    allPlayers
        .slice()
        .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0) || (Number(second.ovr) || 0) - (Number(first.ovr) || 0))
        .some(candidate => {
            if (invited.length < 8) addCandidate(invited, candidate);
            return invited.length === 8;
        });

    const locals = [];
    const localCandidates = [];
    const localKeys = new Set();
    const addLocalCandidate = candidate => {
        const key = getWorldMastersPlayerKey(candidate);
        if (!candidate || !key || selectedKeys.has(key) || localKeys.has(key)) return;
        localCandidates.push(candidate);
        localKeys.add(key);
    };

    if (typeof player !== 'undefined' && player && event.regionCountries.includes(player.country)) addLocalCandidate(player);
    event.localPriority
        .map(name => allPlayers.find(candidate => (candidate.sourceName || candidate.name) === name))
        .filter(Boolean)
        .forEach(addLocalCandidate);
    allPlayers
        .filter(candidate => event.regionCountries.includes(candidate.country))
        .sort((first, second) => (Number(second.ovr) || 0) - (Number(first.ovr) || 0))
        .forEach(addLocalCandidate);

    localCandidates.forEach(candidate => {
        if (locals.length < 8) addCandidate(locals, candidate);
    });

    // Zastępca spoza regionu jest lepszy niż puste miejsce w drabince. To jest
    // istotne zwłaszcza kilka sezonów po rozpoczęciu kariery, gdy lokalni weterani
    // mogli już zakończyć karierę.
    shuffleWorldMasters(tourCardPlayers).some(candidate => {
        if (locals.length < 8) addCandidate(locals, candidate);
        return locals.length === 8;
    });
    allPlayers
        .slice()
        .sort((first, second) => (Number(second.ovr) || 0) - (Number(first.ovr) || 0))
        .some(candidate => {
            if (locals.length < 8) addCandidate(locals, candidate);
            return locals.length === 8;
        });

    return {
        invitedKeys: invited.map(getWorldMastersPlayerKey),
        localKeys: locals.map(getWorldMastersPlayerKey),
        invitationRule: WORLD_MASTERS_INVITATION_RULE,
        completed: false,
        matchKeys: [],
        winnerAwarded: false
    };
}

function shouldRefreshWorldMastersEventField(tournament) {
    if (!isWorldMastersTournament(tournament)) return false;
    const event = getWorldMastersEvent(tournament);
    const existingField = event ? ensureWorldMastersState().events[event.id] : null;
    return Boolean(existingField
        && !existingField.completed
        && !existingField.matchKeys?.length
        && existingField.invitationRule !== WORLD_MASTERS_INVITATION_RULE);
}

function ensureWorldMastersEventField(tournament) {
    const event = getWorldMastersEvent(tournament);
    if (!event) return null;
    const state = ensureWorldMastersState();
    const existingField = state.events[event.id];
    const usesCurrentInvitationRule = existingField?.invitationRule === WORLD_MASTERS_INVITATION_RULE;
    if (existingField && (existingField.completed || existingField.matchKeys?.length || (usesCurrentInvitationRule && isWorldMastersEventFieldPlayable(existingField)))) {
        return existingField;
    }

    const field = createWorldMastersEventField(event);
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
    if (isWorldMastersFinalsQualifierTournament(tournament)) {
        return getWorldMastersFinalsQualifierOpeningRound(getWorldMastersFinalsQualifierParticipants().length);
    }
    return isWorldMastersFinalsTournament(tournament) ? 32 : 16;
}

function buildWorldMastersTournamentDraw(tournament, participants = getWorldMastersTournamentParticipants(tournament), random = Math.random) {
    if (isWorldMastersTournament(tournament)) {
        const field = ensureWorldMastersEventField(tournament);
        const invited = resolveWorldMastersPlayers(field?.invitedKeys);
        const locals = shuffleWorldMasters(resolveWorldMastersPlayers(field?.localKeys), random);
        return invited.flatMap((star, index) => [star, locals[index]]).filter(Boolean);
    }
    if (isWorldMastersFinalsTournament(tournament)) {
        const finals = getWorldMastersFinalsField();
        const participantKeys = new Set(participants.map(getWorldMastersPlayerKey));
        const seeds = resolveWorldMastersPlayers(finals.worldSeriesKeys.slice(0, 8))
            .filter(candidate => participantKeys.has(getWorldMastersPlayerKey(candidate)));
        const seedKeys = new Set(seeds.map(getWorldMastersPlayerKey));
        const nonSeeds = shuffleWorldMasters(
            participants.filter(candidate => !seedKeys.has(getWorldMastersPlayerKey(candidate))),
            random
        );

        // Osiem rozstawionych zajmuje osobne sekcje drabinki. Każda sekcja
        // zawiera mecz rozstawionego oraz drugi mecz dwóch nierozstawionych,
        // dzięki czemu wszystkie 32 osoby rzeczywiście grają w Last 32.
        if (participants.length === 32 && seeds.length === 8 && nonSeeds.length === 24) {
            const seedOrder = [0, 7, 3, 4, 1, 6, 2, 5];
            const draw = [];
            let nonSeedIndex = 0;
            seedOrder.forEach(seedIndex => {
                draw.push(
                    seeds[seedIndex],
                    nonSeeds[nonSeedIndex++],
                    nonSeeds[nonSeedIndex++],
                    nonSeeds[nonSeedIndex++]
                );
            });
            tournament.worldMastersFinalsDrawVersion = WORLD_MASTERS_FINALS_DRAW_VERSION;
            return draw;
        }

        return shuffleWorldMasters(participants, random);
    }
    if (isWorldMastersFinalsQualifierTournament(tournament)) {
        return buildWorldMastersFinalsQualifierDraw(participants, random);
    }
    return shuffleWorldMasters(participants, random);
}

function getWorldMastersAutomaticFinalistKeys() {
    const ranking = getWorldMastersRankingRows();
    // W tabeli mogą pozostać stare wpisy zawodników, którzy zakończyli karierę.
    // Do finałów bierzemy wyłącznie graczy, którzy nadal są w bazie.
    const worldSeriesKeys = ranking.filter(row => row.player).slice(0, 24).map(row => row.key);
    const selected = new Set(worldSeriesKeys);
    const oomKeys = getWorldMastersTourCardPlayers().filter(candidate => !selected.has(getWorldMastersPlayerKey(candidate))).slice(0, 4).map(getWorldMastersPlayerKey);
    return { worldSeriesKeys, oomKeys };
}

function getWorldMastersFinalsQualifierEligiblePlayers() {
    const automatic = getWorldMastersAutomaticFinalistKeys();
    const automaticKeys = new Set([...automatic.worldSeriesKeys, ...automatic.oomKeys]);
    return getWorldMastersTourCardPlayers()
        .filter(candidate => !automaticKeys.has(getWorldMastersPlayerKey(candidate)));
}

function getWorldMastersFinalsQualifierOpeningRound(participantCount) {
    let bracketSize = WORLD_MASTERS_FINALS_QUALIFIER_PLACES;
    while (bracketSize < participantCount) bracketSize *= 2;
    return bracketSize;
}

function createWorldMastersFinalsQualifierBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

function buildWorldMastersFinalsQualifierDraw(participants, random = Math.random) {
    const entrants = (Array.isArray(participants) ? participants : [])
        .filter(candidate => candidate && !candidate.isBye && candidate.hasTourCard === true);
    for (let index = entrants.length - 1; index > 0; index--) {
        const target = Math.floor(random() * (index + 1));
        [entrants[index], entrants[target]] = [entrants[target], entrants[index]];
    }
    const bracketSize = getWorldMastersFinalsQualifierOpeningRound(entrants.length);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;

    for (; index < byeCount && index < entrants.length; index++) {
        draw.push(entrants[index], createWorldMastersFinalsQualifierBye());
    }
    for (; index < entrants.length; index += 2) {
        draw.push(entrants[index], entrants[index + 1] || createWorldMastersFinalsQualifierBye());
    }
    while (draw.length < bracketSize) draw.push(createWorldMastersFinalsQualifierBye());
    return draw;
}

function getWorldMastersFinalsQualifierParticipants() {
    const state = ensureWorldMastersState();
    const existingQualifier = state.finalsQualifier;
    const eligiblePlayers = getWorldMastersFinalsQualifierEligiblePlayers();
    const eligibleKeys = eligiblePlayers.map(getWorldMastersPlayerKey);
    const eligibleKeySet = new Set(eligibleKeys);
    const usesCurrentRules = existingQualifier?.version === WORLD_MASTERS_FINALS_QUALIFIER_VERSION
        && Array.isArray(existingQualifier.participantKeys)
        && existingQualifier.participantKeys.length === eligibleKeys.length
        && existingQualifier.participantKeys.every(key => eligibleKeySet.has(key));
    if (usesCurrentRules) {
        return resolveWorldMastersPlayers(existingQualifier.participantKeys);
    }

    state.finalsQualifier = {
        ...(existingQualifier || {}),
        version: WORLD_MASTERS_FINALS_QUALIFIER_VERSION,
        participantKeys: eligibleKeys,
        qualifiedKeys: Array.isArray(existingQualifier?.qualifiedKeys)
            ? existingQualifier.qualifiedKeys.filter(key => eligibleKeySet.has(key)).slice(0, WORLD_MASTERS_FINALS_QUALIFIER_PLACES)
            : [],
        completed: false
    };
    return eligiblePlayers;
}

function completeWorldMastersFinalsQualifier(tournament, qualifiedPlayers) {
    const state = ensureWorldMastersState();
    const eligibleKeys = new Set(getWorldMastersFinalsQualifierEligiblePlayers().map(getWorldMastersPlayerKey));
    const qualifier = state.finalsQualifier || { participantKeys: [], qualifiedKeys: [], completed: false };
    const uniqueKeys = [];
    (Array.isArray(qualifiedPlayers) ? qualifiedPlayers : []).forEach(candidate => {
        const key = getWorldMastersPlayerKey(candidate);
        if (eligibleKeys.has(key) && !uniqueKeys.includes(key) && uniqueKeys.length < WORLD_MASTERS_FINALS_QUALIFIER_PLACES) {
            uniqueKeys.push(key);
        }
    });
    qualifier.version = WORLD_MASTERS_FINALS_QUALIFIER_VERSION;
    qualifier.qualifiedKeys = uniqueKeys;
    qualifier.completed = true;
    state.finalsQualifier = qualifier;
    // Obsada mogła zostać podejrzana przed rozegraniem kwalifikatora. Jeżeli
    // finał jeszcze się nie rozpoczął, wymuszamy ponowne złożenie stawki z
    // faktyczną czwórką zwycięzców kwalifikacji.
    if (!state.finals?.completed) state.finals = null;
    if (tournament) tournament.worldMastersQualifiers = [...qualifier.qualifiedKeys];
    sendWorldMastersFinalsQualifierEmail(resolveWorldMastersPlayers(qualifier.qualifiedKeys));
}

function autoCompleteWorldMastersFinalsQualifier() {
    const state = ensureWorldMastersState();
    const participants = getWorldMastersFinalsQualifierParticipants();
    if (!state.finalsQualifier?.completed) completeWorldMastersFinalsQualifier(null, participants.slice(0, 4));
    return resolveWorldMastersPlayers(state.finalsQualifier.qualifiedKeys);
}

function getWorldMastersFinalsField() {
    const state = ensureWorldMastersState();
    if (state.finals?.participantKeys && state.finals.completed) {
        return { ...state.finals, participants: resolveWorldMastersPlayers(state.finals.participantKeys) };
    }
    if (state.finals?.participantKeys && resolveWorldMastersPlayers(state.finals.participantKeys).length === 32) {
        return { ...state.finals, participants: resolveWorldMastersPlayers(state.finals.participantKeys) };
    }

    const automatic = getWorldMastersAutomaticFinalistKeys();
    const worldSeriesKeys = completeWorldMastersFieldKeys(automatic.worldSeriesKeys, 24);
    const selected = new Set(worldSeriesKeys);
    const oomKeys = completeWorldMastersFieldKeys(automatic.oomKeys, 4, selected);
    oomKeys.forEach(key => selected.add(key));

    const preferredQualifierKeys = state.finalsQualifier?.completed
        ? state.finalsQualifier.qualifiedKeys
        : autoCompleteWorldMastersFinalsQualifier().map(getWorldMastersPlayerKey);
    const qualifierKeys = [];
    const addTourCardQualifier = candidate => {
        const key = getWorldMastersPlayerKey(candidate);
        if (!candidate || candidate.hasTourCard !== true || !key || selected.has(key)
            || qualifierKeys.includes(key) || qualifierKeys.length >= WORLD_MASTERS_FINALS_QUALIFIER_PLACES) return;
        qualifierKeys.push(key);
    };
    resolveWorldMastersPlayers(preferredQualifierKeys).forEach(addTourCardQualifier);
    getWorldMastersFinalsQualifierEligiblePlayers().forEach(addTourCardQualifier);
    qualifierKeys.forEach(key => selected.add(key));

    const participantKeys = completeWorldMastersFieldKeys(
        [...worldSeriesKeys, ...oomKeys, ...qualifierKeys, ...getWorldMastersTourCardPlayers().map(getWorldMastersPlayerKey)],
        32
    );
    state.finals = { worldSeriesKeys, oomKeys, qualifierKeys, participantKeys, completed: false };
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
        // Zapisy sprzed przebudowy cyklu nazywały amerykański event „US Masters”.
        // Najpierw odnajdujemy taki historyczny wpis, aby nie dodać drugiego turnieju
        // na ten sam dzień i zachować jego historię oraz stan aktywnej drabinki.
        const legacyNames = WORLD_MASTERS_LEGACY_EVENT_NAMES[template.worldMastersEvent] || [];
        const existing = tournamentDatabase.find(tournament => legacyNames.includes(tournament.name))
            || tournamentDatabase.find(tournament => tournament.specialType === template.specialType && (template.worldMastersEvent ? tournament.worldMastersEvent === template.worldMastersEvent : true))
            || tournamentDatabase.find(tournament => tournament.name === template.name);
        if (existing) {
            Object.assign(existing, { ...template, name: existing.name || template.name, completed: Boolean(existing.completed), historyLogs: existing.historyLogs || '' });
        } else {
            tournamentDatabase.push({ ...template, completed: false, historyLogs: '' });
        }
    });
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
