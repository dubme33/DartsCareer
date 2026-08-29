let worldCupState = null;
let isFastForwardingWorldCup = false;

const WORLD_CUP_TOURNAMENT_NAME = 'Puchar Narodów';
const WORLD_CUP_LEGACY_NAME = 'World Cup of Darts';
const WORLD_CUP_QUALIFIER_TOURNAMENT_NAME = 'Kwalifikacje Pucharu Narodów';

const WORLD_CUP_TRANSLATIONS = {
    pl: {
        tournamentName: 'Puchar Narodów', qualifierTournamentName: 'Kwalifikacje Pucharu Narodów', qualifierAsian: 'Kwalifikacje Asian Tour', qualifierNordic: 'Ranking Nordic & Baltic', qualifierLatin: 'Kwalifikacje Latin America & Caribbean', qualifierAfrican: 'Kwalifikacje African Darts Group',
        guestName: 'Kwalifikant {country} {slot}', incompleteQualifiers: 'Kwalifikacje nie wyłoniły kompletu 40 reprezentacji.', missingQualifiedTeam: 'Brakuje reprezentacji zakwalifikowanej do {tournament}.',
        payoutWinner: 'Zwycięzca {tournament}', payoutRunnerUp: 'Finalista {tournament}', payoutSemiFinal: 'Półfinalista {tournament}', payoutQuarterFinal: 'Ćwierćfinalista {tournament}', payoutLast16: '{tournament} — Top 16', payoutGroupSecond: '{tournament} — 2. miejsce w grupie', payoutGroupThird: '{tournament} — 3. miejsce w grupie',
        mailSender: 'Federacja Pucharu Narodów', fallbackPartner: 'partnerem z reprezentacji', selectionRouteRanking: 'awans z {event}', selectionRouteDirect: 'bezpośredni awans do turnieju głównego',
        selectionSubject: 'Powołanie: {country} — {tournament}', selectionBody: 'Zostałeś powołany do reprezentacji {country} wraz z zawodnikiem {partner}.<br><br>Wasza para uzyskała {route} i rozpocznie rywalizację od fazy grupowej lub Top 16, zależnie od rozstawienia.',
        selectionQualifierSubject: 'Powołanie do kwalifikacji: {country}', selectionQualifierBody: 'Zostałeś powołany do reprezentacji {country} wraz z zawodnikiem {partner}.<br><br>Wasza droga do {tournament} prowadzi przez {event}. Mecze Twojej reprezentacji rozegrasz osobiście w deblu.',
        qualificationResultsSubject: 'Kwalifikacje zakończone — {tournament}', qualificationResultsBody: 'Regionalne kwalifikacje zostały rozstrzygnięte. Oto reprezentacje, które wywalczyły siedem ostatnich miejsc w turnieju głównym:<br><br>{qualifierResults}<br><br><strong>Pełna stawka {tournament} (40 reprezentacji):</strong><br>{nations}.',
        regionalQualifiers: 'Kwalifikacje regionalne', groupStage: 'Faza grupowa', last16: 'Top 16', quarterFinal: 'Ćwierćfinał', semiFinal: 'Półfinał', final: 'Finał', knockoutStage: 'Faza pucharowa',
        group: 'Grupa {label}', qualified: 'AWANS', winsAbbreviation: 'W', methodRanking: 'awans z rankingu', methodEvent: 'kwalifikator regionalny', placeOne: 'miejsce', placeMany: 'miejsca',
        qualificationHeading: 'Droga do {tournament}', qualificationSummary: '33 reprezentacje otrzymały bezpośredni awans. Pozostałych 7 miejsc wyłaniają kwalifikacje regionalne.', qualificationMatchIntro: 'Mecze kwalifikacyjne są rozgrywane do 4 wygranych legów. Twoją reprezentację prowadzisz osobiście.', groupIntro: '40 reprezentacji · gra wyłącznie deblowa · zwycięzca każdej grupy awansuje do Top 16.', knockoutIntro: '{directSeeds} rozstawione reprezentacje dołączyły do {groupWinners} zwycięzców grup.',
        playMatch: 'Zagraj: {team1} — {team2}', simulateQualifications: 'Symuluj pozostałe kwalifikacje', simulateNextStage: 'Symuluj dalszy etap {tournament}', simulateOtherMatches: 'Symuluj pozostałe mecze AI', matchTitle: '{tournament} — {round} · do {legs} legów',
        historyWinner: 'Zwycięzca: {country} ({players})', historyGroups: 'Faza grupowa', historyGroupWinner: 'Zwycięzca grupy: {country}', historyKnockout: 'Faza pucharowa', historyChampion: 'Mistrz: {country}', winnerAlert: '🏆 Zdobywasz {tournament} dla reprezentacji {country}!', otherWinnerAlert: '🏆 {tournament} wygrywa reprezentacja {country}!'
    },
    en: {
        tournamentName: 'Nations Cup', qualifierTournamentName: 'Nations Cup Qualifiers', qualifierAsian: 'Asian Tour Qualifier', qualifierNordic: 'Nordic & Baltic Rankings', qualifierLatin: 'Latin America & Caribbean Qualifier', qualifierAfrican: 'African Darts Group Qualifier',
        guestName: '{country} Qualifier {slot}', incompleteQualifiers: 'The qualifiers did not produce a complete field of 40 national teams.', missingQualifiedTeam: 'A national team qualified for the {tournament} is missing.',
        payoutWinner: '{tournament} champion', payoutRunnerUp: '{tournament} runner-up', payoutSemiFinal: '{tournament} semi-finalist', payoutQuarterFinal: '{tournament} quarter-finalist', payoutLast16: '{tournament} — Last 16', payoutGroupSecond: '{tournament} — 2nd place in group', payoutGroupThird: '{tournament} — 3rd place in group',
        mailSender: 'Nations Cup Federation', fallbackPartner: 'a national-team partner', selectionRouteRanking: 'qualification through the {event}', selectionRouteDirect: 'direct entry to the main tournament',
        selectionSubject: 'Selection: {country} — {tournament}', selectionBody: 'You have been selected for {country} alongside {partner}.<br><br>Your pair secured {route} and will begin in the group stage or the Last 16, depending on seeding.',
        selectionQualifierSubject: 'Qualifier selection: {country}', selectionQualifierBody: 'You have been selected for {country} alongside {partner}.<br><br>Your route to the {tournament} runs through the {event}. You will play your national team’s doubles matches yourself.',
        qualificationResultsSubject: 'Qualifiers complete — {tournament}', qualificationResultsBody: 'The regional qualifiers have concluded. These national teams secured the final seven places in the main tournament:<br><br>{qualifierResults}<br><br><strong>Full {tournament} field (40 national teams):</strong><br>{nations}.',
        regionalQualifiers: 'Regional qualifiers', groupStage: 'Group stage', last16: 'Last 16', quarterFinal: 'Quarter-final', semiFinal: 'Semi-final', final: 'Final', knockoutStage: 'Knockout stage',
        group: 'Group {label}', qualified: 'QUALIFIED', winsAbbreviation: 'W', methodRanking: 'ranking qualification', methodEvent: 'regional qualifier', placeOne: 'place', placeMany: 'places',
        qualificationHeading: 'Road to the {tournament}', qualificationSummary: '33 national teams received direct entry. Regional qualifiers determine the remaining 7 places.', qualificationMatchIntro: 'Qualifier matches are first to 4 legs. You manage your national team personally.', groupIntro: '40 national teams · doubles only · each group winner advances to the Last 16.', knockoutIntro: '{directSeeds} seeded national teams joined {groupWinners} group winners.',
        playMatch: 'Play: {team1} — {team2}', simulateQualifications: 'Simulate remaining qualifiers', simulateNextStage: 'Simulate next {tournament} stage', simulateOtherMatches: 'Simulate remaining AI matches', matchTitle: '{tournament} — {round} · first to {legs} legs',
        historyWinner: 'Winner: {country} ({players})', historyGroups: 'Group stage', historyGroupWinner: 'Group winner: {country}', historyKnockout: 'Knockout stage', historyChampion: 'Champions: {country}', winnerAlert: '🏆 You win the {tournament} for {country}!', otherWinnerAlert: '🏆 {country} win the {tournament}!'
    },
    de: {
        tournamentName: 'Nationenpokal', qualifierTournamentName: 'Nationenpokal-Qualifikation', qualifierAsian: 'Asian-Tour-Qualifikation', qualifierNordic: 'Nordic-&-Baltic-Rangliste', qualifierLatin: 'Latin-America-&-Caribbean-Qualifikation', qualifierAfrican: 'African-Darts-Group-Qualifikation',
        guestName: 'Qualifikant {country} {slot}', incompleteQualifiers: 'Die Qualifikationen haben kein vollständiges Feld von 40 Nationalteams ergeben.', missingQualifiedTeam: 'Eine für den {tournament} qualifizierte Mannschaft fehlt.',
        payoutWinner: 'Sieger des {tournament}', payoutRunnerUp: 'Finalist des {tournament}', payoutSemiFinal: 'Halbfinalist des {tournament}', payoutQuarterFinal: 'Viertelfinalist des {tournament}', payoutLast16: '{tournament} — Letzte 16', payoutGroupSecond: '{tournament} — 2. Platz in der Gruppe', payoutGroupThird: '{tournament} — 3. Platz in der Gruppe',
        mailSender: 'Nationenpokal-Föderation', fallbackPartner: 'einem Nationalmannschaftspartner', selectionRouteRanking: 'die Qualifikation über die {event}', selectionRouteDirect: 'den direkten Einzug ins Hauptturnier',
        selectionSubject: 'Nominierung: {country} — {tournament}', selectionBody: 'Du wurdest gemeinsam mit {partner} für {country} nominiert.<br><br>Euer Doppel sicherte sich {route} und startet je nach Setzliste in der Gruppenphase oder in den Letzten 16.',
        selectionQualifierSubject: 'Nominierung für die Qualifikation: {country}', selectionQualifierBody: 'Du wurdest gemeinsam mit {partner} für {country} nominiert.<br><br>Dein Weg zum {tournament} führt über die {event}. Die Doppelspiele deiner Nationalmannschaft spielst du selbst.',
        qualificationResultsSubject: 'Qualifikationen abgeschlossen — {tournament}', qualificationResultsBody: 'Die regionalen Qualifikationen sind beendet. Diese Nationalteams sicherten sich die letzten sieben Plätze im Hauptturnier:<br><br>{qualifierResults}<br><br><strong>Vollständiges Feld des {tournament} (40 Nationalteams):</strong><br>{nations}.',
        regionalQualifiers: 'Regionale Qualifikationen', groupStage: 'Gruppenphase', last16: 'Letzte 16', quarterFinal: 'Viertelfinale', semiFinal: 'Halbfinale', final: 'Finale', knockoutStage: 'K.-o.-Phase',
        group: 'Gruppe {label}', qualified: 'QUALIFIZIERT', winsAbbreviation: 'S', methodRanking: 'Qualifikation über die Rangliste', methodEvent: 'regionale Qualifikation', placeOne: 'Platz', placeMany: 'Plätze',
        qualificationHeading: 'Der Weg zum {tournament}', qualificationSummary: '33 Nationalteams erhielten einen direkten Startplatz. Regionale Qualifikationen vergeben die übrigen 7 Plätze.', qualificationMatchIntro: 'Qualifikationsspiele werden bis 4 gewonnene Legs gespielt. Du führst deine Nationalmannschaft selbst.', groupIntro: '40 Nationalteams · nur Doppel · jeder Gruppensieger erreicht die Letzten 16.', knockoutIntro: '{directSeeds} gesetzte Nationalteams treffen auf {groupWinners} Gruppensieger.',
        playMatch: 'Spielen: {team1} — {team2}', simulateQualifications: 'Restliche Qualifikationen simulieren', simulateNextStage: 'Nächste Phase des {tournament} simulieren', simulateOtherMatches: 'Übrige KI-Spiele simulieren', matchTitle: '{tournament} — {round} · bis {legs} gewonnene Legs',
        historyWinner: 'Sieger: {country} ({players})', historyGroups: 'Gruppenphase', historyGroupWinner: 'Gruppensieger: {country}', historyKnockout: 'K.-o.-Phase', historyChampion: 'Meister: {country}', winnerAlert: '🏆 Du gewinnst den {tournament} für {country}!', otherWinnerAlert: '🏆 {country} gewinnt den {tournament}!'
    },
    nl: {
        tournamentName: 'Landentoernooi', qualifierTournamentName: 'Kwalificaties Landentoernooi', qualifierAsian: 'Kwalificatie Asian Tour', qualifierNordic: 'Nordic & Baltic-ranglijst', qualifierLatin: 'Kwalificatie Latin America & Caribbean', qualifierAfrican: 'Kwalificatie African Darts Group',
        guestName: 'Kwalificant {country} {slot}', incompleteQualifiers: 'De kwalificaties hebben geen volledig veld van 40 nationale teams opgeleverd.', missingQualifiedTeam: 'Een voor het {tournament} gekwalificeerd nationaal team ontbreekt.',
        payoutWinner: 'Winnaar van het {tournament}', payoutRunnerUp: 'Finalist van het {tournament}', payoutSemiFinal: 'Halvefinalist van het {tournament}', payoutQuarterFinal: 'Kwartfinalist van het {tournament}', payoutLast16: '{tournament} — Laatste 16', payoutGroupSecond: '{tournament} — 2e plaats in de groep', payoutGroupThird: '{tournament} — 3e plaats in de groep',
        mailSender: 'Federatie Landentoernooi', fallbackPartner: 'een teamgenoot uit de nationale ploeg', selectionRouteRanking: 'kwalificatie via de {event}', selectionRouteDirect: 'rechtstreekse plaatsing voor het hoofdtoernooi',
        selectionSubject: 'Selectie: {country} — {tournament}', selectionBody: 'Je bent samen met {partner} geselecteerd voor {country}.<br><br>Jullie koppel heeft {route} behaald en begint, afhankelijk van de plaatsing, in de groepsfase of de Laatste 16.',
        selectionQualifierSubject: 'Selectie voor kwalificatie: {country}', selectionQualifierBody: 'Je bent samen met {partner} geselecteerd voor {country}.<br><br>Jullie weg naar het {tournament} loopt via de {event}. Je speelt de dubbelwedstrijden van je nationale ploeg zelf.',
        qualificationResultsSubject: 'Kwalificaties afgerond — {tournament}', qualificationResultsBody: 'De regionale kwalificaties zijn afgerond. Deze nationale teams veroverden de laatste zeven plaatsen in het hoofdtoernooi:<br><br>{qualifierResults}<br><br><strong>Volledig deelnemersveld van het {tournament} (40 nationale teams):</strong><br>{nations}.',
        regionalQualifiers: 'Regionale kwalificaties', groupStage: 'Groepsfase', last16: 'Laatste 16', quarterFinal: 'Kwartfinale', semiFinal: 'Halve finale', final: 'Finale', knockoutStage: 'Knock-outfase',
        group: 'Groep {label}', qualified: 'GEKWALIFICEERD', winsAbbreviation: 'W', methodRanking: 'kwalificatie via ranglijst', methodEvent: 'regionale kwalificatie', placeOne: 'plaats', placeMany: 'plaatsen',
        qualificationHeading: 'Weg naar het {tournament}', qualificationSummary: '33 nationale teams kregen directe plaatsing. Regionale kwalificaties bepalen de overige 7 plaatsen.', qualificationMatchIntro: 'Kwalificatiewedstrijden gaan tot 4 gewonnen legs. Je leidt je nationale ploeg zelf.', groupIntro: '40 nationale teams · alleen dubbels · iedere groepswinnaar gaat door naar de Laatste 16.', knockoutIntro: '{directSeeds} geplaatste nationale teams voegen zich bij {groupWinners} groepswinnaars.',
        playMatch: 'Spelen: {team1} — {team2}', simulateQualifications: 'Overige kwalificaties simuleren', simulateNextStage: 'Volgende fase van het {tournament} simuleren', simulateOtherMatches: 'Overige AI-wedstrijden simuleren', matchTitle: '{tournament} — {round} · eerste tot {legs} legs',
        historyWinner: 'Winnaar: {country} ({players})', historyGroups: 'Groepsfase', historyGroupWinner: 'Groepswinnaar: {country}', historyKnockout: 'Knock-outfase', historyChampion: 'Kampioen: {country}', winnerAlert: '🏆 Je wint het {tournament} voor {country}!', otherWinnerAlert: '🏆 {country} wint het {tournament}!'
    }
};

const WORLD_CUP_COUNTRY_TRANSLATIONS = {
    en: { Anglia: 'England', Holandia: 'Netherlands', Szkocja: 'Scotland', 'Irlandia Północna': 'Northern Ireland', Walia: 'Wales', Niemcy: 'Germany', Belgia: 'Belgium', Polska: 'Poland', Austria: 'Austria', Irlandia: 'Ireland', Szwecja: 'Sweden', Chorwacja: 'Croatia', Czechy: 'Czech Republic', Łotwa: 'Latvia', Węgry: 'Hungary', Finlandia: 'Finland', Chiny: 'China', Australia: 'Australia', Francja: 'France', Hiszpania: 'Spain', Kanada: 'Canada', Litwa: 'Lithuania', Słowenia: 'Slovenia', Szwajcaria: 'Switzerland', USA: 'United States', Portugalia: 'Portugal', Włochy: 'Italy', Japonia: 'Japan', Filipiny: 'Philippines', 'Nowa Zelandia': 'New Zealand', Gibraltar: 'Gibraltar', Indie: 'India', Hongkong: 'Hong Kong', Mongolia: 'Mongolia', Singapur: 'Singapore', Tajlandia: 'Thailand', Malezja: 'Malaysia', Tajwan: 'Taiwan', Bahrajn: 'Bahrain', Bahamy: 'Bahamas', Dania: 'Denmark', Norwegia: 'Norway', Islandia: 'Iceland', 'Trynidad i Tobago': 'Trinidad and Tobago', Argentyna: 'Argentina', Brazylia: 'Brazil', Gujana: 'Guyana', RPA: 'South Africa', Uganda: 'Uganda', Malawi: 'Malawi' },
    de: { Anglia: 'England', Holandia: 'Niederlande', Szkocja: 'Schottland', 'Irlandia Północna': 'Nordirland', Walia: 'Wales', Niemcy: 'Deutschland', Belgia: 'Belgien', Polska: 'Polen', Austria: 'Österreich', Irlandia: 'Irland', Szwecja: 'Schweden', Chorwacja: 'Kroatien', Czechy: 'Tschechien', Łotwa: 'Lettland', Węgry: 'Ungarn', Finlandia: 'Finnland', Chiny: 'China', Australia: 'Australien', Francja: 'Frankreich', Hiszpania: 'Spanien', Kanada: 'Kanada', Litwa: 'Litauen', Słowenia: 'Slowenien', Szwajcaria: 'Schweiz', USA: 'Vereinigte Staaten', Portugalia: 'Portugal', Włochy: 'Italien', Japonia: 'Japan', Filipiny: 'Philippinen', 'Nowa Zelandia': 'Neuseeland', Gibraltar: 'Gibraltar', Indie: 'Indien', Hongkong: 'Hongkong', Mongolia: 'Mongolei', Singapur: 'Singapur', Tajlandia: 'Thailand', Malezja: 'Malaysia', Tajwan: 'Taiwan', Bahrajn: 'Bahrain', Bahamy: 'Bahamas', Dania: 'Dänemark', Norwegia: 'Norwegen', Islandia: 'Island', 'Trynidad i Tobago': 'Trinidad und Tobago', Argentyna: 'Argentinien', Brazylia: 'Brasilien', Gujana: 'Guyana', RPA: 'Südafrika', Uganda: 'Uganda', Malawi: 'Malawi' },
    nl: { Anglia: 'Engeland', Holandia: 'Nederland', Szkocja: 'Schotland', 'Irlandia Północna': 'Noord-Ierland', Walia: 'Wales', Niemcy: 'Duitsland', Belgia: 'België', Polska: 'Polen', Austria: 'Oostenrijk', Irlandia: 'Ierland', Szwecja: 'Zweden', Chorwacja: 'Kroatië', Czechy: 'Tsjechië', Łotwa: 'Letland', Węgry: 'Hongarije', Finlandia: 'Finland', Chiny: 'China', Australia: 'Australië', Francja: 'Frankrijk', Hiszpania: 'Spanje', Kanada: 'Canada', Litwa: 'Litouwen', Słowenia: 'Slovenië', Szwajcaria: 'Zwitserland', USA: 'Verenigde Staten', Portugalia: 'Portugal', Włochy: 'Italië', Japonia: 'Japan', Filipiny: 'Filipijnen', 'Nowa Zelandia': 'Nieuw-Zeeland', Gibraltar: 'Gibraltar', Indie: 'India', Hongkong: 'Hongkong', Mongolia: 'Mongolië', Singapur: 'Singapore', Tajlandia: 'Thailand', Malezja: 'Maleisië', Tajwan: 'Taiwan', Bahrajn: 'Bahrein', Bahamy: "Bahama's", Dania: 'Denemarken', Norwegia: 'Noorwegen', Islandia: 'IJsland', 'Trynidad i Tobago': 'Trinidad en Tobago', Argentyna: 'Argentinië', Brazylia: 'Brazilië', Gujana: 'Guyana', RPA: 'Zuid-Afrika', Uganda: 'Oeganda', Malawi: 'Malawi' }
};

function trWorldCup(key, values = {}) {
    const language = typeof currentLang === 'string' && WORLD_CUP_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = WORLD_CUP_TRANSLATIONS[language][key] || WORLD_CUP_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function getWorldCupTournamentDisplayName() {
    return tournamentDatabase.find(tournament => tournament.specialType === 'worldCup')?.name || trWorldCup('tournamentName');
}

function getWorldCupQualifierTournamentDisplayName() {
    return tournamentDatabase.find(tournament => tournament.specialType === 'worldCupQualifiers')?.name || trWorldCup('qualifierTournamentName');
}

function getWorldCupCountryName(country) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    return WORLD_CUP_COUNTRY_TRANSLATIONS[language]?.[country] || country;
}

function getWorldCupQualifierLabel(event) {
    const key = ({
        'asian-tour': 'qualifierAsian', 'nordic-baltic': 'qualifierNordic',
        'latin-caribbean': 'qualifierLatin', 'african-darts': 'qualifierAfrican'
    })[event?.id];
    return key ? trWorldCup(key) : (event?.label || '');
}

function getTournamentDisplayName(tournament) {
    const name = typeof tournament === 'string' ? tournament : tournament?.name;
    if (tournament && typeof tournament === 'object' && typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(tournament)) {
        return getContinentalQualifierDisplayName(tournament);
    }
    if ((tournament && typeof tournament === 'object' && isWorldCupQualifierTournament(tournament)) ||
        name === WORLD_CUP_QUALIFIER_TOURNAMENT_NAME || tournamentDatabase.some(candidate => candidate.specialType === 'worldCupQualifiers' && candidate.name === name)) {
        return getWorldCupQualifierTournamentDisplayName();
    }
    if ((tournament && typeof tournament === 'object' && isWorldCupTournament(tournament)) ||
        name === WORLD_CUP_TOURNAMENT_NAME || name === WORLD_CUP_LEGACY_NAME || tournamentDatabase.some(candidate => candidate.specialType === 'worldCup' && candidate.name === name)) {
        return getWorldCupTournamentDisplayName();
    }
    return name || '';
}

const WORLD_CUP_AUTOMATIC_NATIONS = [
    'Anglia', 'Holandia', 'Szkocja', 'Irlandia Północna', 'Walia', 'Niemcy', 'Belgia', 'Polska',
    'Austria', 'Irlandia', 'Szwecja', 'Chorwacja', 'Czechy', 'Łotwa', 'Węgry', 'Finlandia', 'Chiny',
    'Australia', 'Francja', 'Hiszpania', 'Kanada', 'Litwa', 'Słowenia', 'Szwajcaria', 'USA', 'Portugalia',
    'Włochy', 'Japonia', 'Filipiny', 'Nowa Zelandia', 'Gibraltar', 'Indie', 'Hongkong'
];

const WORLD_CUP_QUALIFIER_EVENTS = [
    {
        id: 'asian-tour', label: 'Kwalifikacje Asian Tour', slots: 3, method: 'event',
        nations: ['Mongolia', 'Singapur', 'Tajlandia', 'Malezja', 'Tajwan', 'Bahrajn']
    },
    {
        id: 'nordic-baltic', label: 'Ranking Nordic & Baltic', slots: 2, method: 'ranking',
        nations: ['Dania', 'Norwegia', 'Islandia']
    },
    {
        id: 'latin-caribbean', label: 'Kwalifikacje Latin America & Caribbean', slots: 1, method: 'event',
        nations: ['Trynidad i Tobago', 'Argentyna', 'Brazylia', 'Gujana', 'Bahamy']
    },
    {
        id: 'african-darts', label: 'Kwalifikacje African Darts Group', slots: 1, method: 'event',
        nations: ['RPA', 'Uganda', 'Malawi']
    }
];

const WORLD_CUP_PRIZES = {
    winner: 100000,
    runnerUp: 48000,
    semiFinal: 30000,
    quarterFinal: 20000,
    last16: 10000,
    groupSecond: 6000,
    groupThird: 5000
};

const WORLD_CUP_KNOCKOUT_DRAW_VERSION = 2;
const WORLD_CUP_KNOCKOUT_SEED_ORDER = [
    [1, 16], [8, 9], [4, 13], [5, 12],
    [2, 15], [7, 10], [3, 14], [6, 11]
];

function isWorldCupTournament(tournament = activeTournament) {
    return Boolean(tournament && (tournament.specialType === 'worldCup' ||
        tournament.name === WORLD_CUP_TOURNAMENT_NAME || tournament.name === WORLD_CUP_LEGACY_NAME));
}

function isWorldCupQualifierTournament(tournament = activeTournament) {
    return Boolean(tournament && (tournament.specialType === 'worldCupQualifiers' ||
        tournament.name === WORLD_CUP_QUALIFIER_TOURNAMENT_NAME));
}

function getWorldCupFlagUrl(country) {
    if (typeof flags === 'undefined' || !flags[country]) return 'https://placehold.co/160x100/16213e/ffffff?text=FLAG';
    return `https://flagcdn.com/w160/${flags[country]}.png`;
}

const WORLD_CUP_PLAYER_NAME_ALIASES = {
    'garry anders': 'garry anderson',
    'michele turetti': 'michele turetta'
};

function getWorldCupPlayerIdentity(candidate) {
    if (!candidate || typeof candidate !== 'object') return '';
    if (candidate.isWorldCupGuest && candidate.id) return candidate.id;

    // Zapisane kariery mogą zawierać stare, zduplikowane wpisy bazy z różnymi ID.
    // Dla reprezentacji nazwisko i kraj wyznaczają jednego prawdziwego zawodnika.
    const rawName = String(candidate.name || '').trim().toLocaleLowerCase('pl');
    const name = WORLD_CUP_PLAYER_NAME_ALIASES[rawName] || rawName;
    const country = String(candidate.country || '').trim().toLocaleLowerCase('pl');
    return name && country ? `${name}|${country}` : String(candidate.id || '');
}

function getWorldCupRankedPlayers() {
    const candidates = [player, ...(Array.isArray(pdcPlayers) ? pdcPlayers : [])]
        .filter(candidate => candidate && !candidate.isBye);
    const uniquePlayers = new Map();
    candidates.forEach(candidate => {
        const key = getWorldCupPlayerIdentity(candidate);
        if (!key) return;

        const alreadyAdded = uniquePlayers.get(key);
        // Jeżeli gracz kariery ma identyczne dane jak wpis bazy, to on ma pierwszeństwo.
        if (!alreadyAdded || candidate === player || isCurrentPlayer(candidate)) uniquePlayers.set(key, candidate);
    });

    return [...uniquePlayers.values()].sort((first, second) => {
        const rankingDifference = (second.prizeMoney || 0) - (first.prizeMoney || 0);
        if (rankingDifference !== 0) return rankingDifference;
        // Przy równych zerowych zarobkach zawodnik kariery ma pierwszeństwo,
        // dzięki czemu może rzeczywiście zagrać w kwalifikacjach własnego kraju.
        const careerPlayerDifference = Number(isCurrentPlayer(second)) - Number(isCurrentPlayer(first));
        if (careerPlayerDifference !== 0) return careerPlayerDifference;
        return String(first.name || '').localeCompare(String(second.name || ''), 'pl');
    });
}

function repairWorldCupTeamRosters() {
    if (!worldCupState || !Array.isArray(worldCupState.teams)) return false;

    const rankedPlayers = getWorldCupRankedPlayers();
    let changed = false;

    worldCupState.teams.forEach((team, countryIndex) => {
        if (!team || !team.country) return;
        const currentPlayers = Array.isArray(team.players) ? team.players : [];
        let teamChanged = !Array.isArray(team.players);
        const uniquePlayers = [];
        const playerKeys = new Set();

        currentPlayers.forEach(candidate => {
            const key = getWorldCupPlayerIdentity(candidate);
            if (!candidate || !key || playerKeys.has(key) || uniquePlayers.length >= 2) {
                changed = true;
                teamChanged = true;
                return;
            }
            playerKeys.add(key);
            uniquePlayers.push(candidate);
        });

        const replacements = rankedPlayers.filter(candidate =>
            candidate.country === team.country && !playerKeys.has(getWorldCupPlayerIdentity(candidate))
        );
        while (uniquePlayers.length < 2) {
            const replacement = replacements.shift() || createWorldCupQualifier(team.country, uniquePlayers.length + 1, countryIndex);
            uniquePlayers.push(replacement);
            playerKeys.add(getWorldCupPlayerIdentity(replacement));
            changed = true;
            teamChanged = true;
        }

        if (teamChanged || currentPlayers.length !== uniquePlayers.length || currentPlayers.some((candidate, index) => candidate !== uniquePlayers[index])) {
            team.players = uniquePlayers;
        }
        team.containsPlayer = uniquePlayers.some(candidate => isCurrentPlayer(candidate));
    });

    return changed;
}

function createWorldCupQualifier(country, slot, countryIndex) {
    const rating = Math.max(50, 63 - Math.floor(countryIndex / 5) - (slot - 1) * 2);
    return {
        id: `wc-qualifier-${country.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${slot}`,
        name: trWorldCup('guestName', { country: getWorldCupCountryName(country), slot }),
        country,
        ovr: rating,
        overall: rating,
        scoring: rating + 1,
        doubles: rating - 1,
        prizeMoney: 0,
        proTourPrizeMoney: 0,
        pcPrizeMoney: 0,
        isWorldCupGuest: true
    };
}

function getWorldCupAutomaticNationList() {
    const nations = [...WORLD_CUP_AUTOMATIC_NATIONS];
    const qualifierNations = new Set(WORLD_CUP_QUALIFIER_EVENTS.flatMap(event => event.nations));
    if (player && player.country && !nations.includes(player.country) && !qualifierNations.has(player.country)) {
        nations[nations.length - 1] = player.country;
    }
    return [...new Set(nations)].slice(0, 33);
}

function buildWorldCupTeams(nations = getWorldCupAutomaticNationList()) {
    const rankedPlayers = getWorldCupRankedPlayers();
    const oomRanks = new Map(rankedPlayers.map((candidate, index) => [candidate.id || `${candidate.name}|${candidate.country}`, index + 1]));
    const byCountry = new Map();
    rankedPlayers.forEach(candidate => {
        if (!byCountry.has(candidate.country)) byCountry.set(candidate.country, []);
        byCountry.get(candidate.country).push(candidate);
    });

    return nations.map((country, countryIndex) => {
        const eligiblePlayers = [...(byCountry.get(country) || [])]
            .sort((first, second) => (oomRanks.get(first.id || `${first.name}|${first.country}`) || 999) - (oomRanks.get(second.id || `${second.name}|${second.country}`) || 999));
        const players = eligiblePlayers.slice(0, 2);
        while (players.length < 2) players.push(createWorldCupQualifier(country, players.length + 1, countryIndex));

        const leader = eligiblePlayers[0];
        return {
            id: `wc-team-${country.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
            country,
            players,
            // Do rozstawienia liczą się tylko zawodnicy z kartą PDC. Zawodnicy
            // dopisani jako reprezentacyjni kwalifikanci mają hasTourCard=false.
            tourCardCount: eligiblePlayers.filter(candidate => candidate.hasTourCard !== false).length,
            leaderRank: leader ? (oomRanks.get(leader.id || `${leader.name}|${leader.country}`) || 999) : 999,
            containsPlayer: players.some(candidate => isCurrentPlayer(candidate))
        };
    });
}

function sortWorldCupTeamsForSeeding(teams) {
    return [...teams].sort((first, second) => {
        const firstHasPair = first.tourCardCount >= 2 ? 1 : 0;
        const secondHasPair = second.tourCardCount >= 2 ? 1 : 0;
        if (secondHasPair !== firstHasPair) return secondHasPair - firstHasPair;
        if (first.leaderRank !== second.leaderRank) return first.leaderRank - second.leaderRank;
        return first.country.localeCompare(second.country, 'pl');
    }).map((team, index) => ({ ...team, seed: index + 1 }));
}

function getWorldCupTeam(teamId) {
    return worldCupState ? worldCupState.teams.find(team => team.id === teamId) : null;
}

function getWorldCupTeamLabel(team) {
    if (!team) return '';
    return `${getWorldCupCountryName(team.country)} · ${team.players.map(candidate => candidate.name).join(' / ')}`;
}

function getWorldCupTeamRating(team) {
    const players = team && Array.isArray(team.players) ? team.players : [];
    if (!players.length) return 55;
    const teamRating = players.reduce((sum, candidate) => sum + (Number(candidate.ovr ?? candidate.overall) || 55), 0) / players.length;
    return Math.max(45, Math.min(96, teamRating));
}

function getWorldCupSimulatedAverage(team, won, mentalPenalty = 0, preparationModifier = 0) {
    const players = team && Array.isArray(team.players) ? team.players : [];
    if (!players.length) return 60;
    const teamOverall = players.reduce((sum, candidate) => sum + (Number(candidate.ovr ?? candidate.overall) || 55), 0) / players.length;
    const form = typeof getTournamentSimulationForm === 'function'
        ? players.reduce((sum, candidate) => sum + (getTournamentSimulationForm(candidate) || 0), 0) / players.length
        : 0;
    return Math.max(45, Math.min(125, 60 + teamOverall * 0.42 + form * 0.4 + (Math.random() * 9 - 4)
        + (won ? 2 : 0) - mentalPenalty * 0.4 + preparationModifier * 0.4));
}

function recordWorldCupTeamAverage(team, average) {
    if (!team || !Number.isFinite(Number(average)) || typeof recordSeasonHighestAverage !== 'function') return;
    team.players.filter(candidate => !candidate.isWorldCupGuest)
        .forEach(candidate => recordSeasonHighestAverage(candidate, average));
}

function getPlayedWorldCupAverage(isP1) {
    if (!currentMatch || !currentMatch.stats) return null;
    const stats = currentMatch.stats;
    const totalDarts = isP1 ? stats.p1TotalDarts : stats.p2TotalDarts;
    if (!totalDarts) return null;
    const accumulated = isP1 ? stats.p1AccumulatedScore : stats.p2AccumulatedScore;
    const score = isP1 ? currentMatch.p1Score : currentMatch.p2Score;
    return ((accumulated + (501 - score)) / totalDarts) * 3;
}

function getWorldCupMatchFormat(stage) {
    if (stage === 'group' || stage === 'qualifier') return { type: 'legs', legsToWin: 4 };
    if (stage === 'final') return { type: 'legs', legsToWin: 10 };
    return { type: 'legs', legsToWin: 8 };
}

function createWorldCupMatch(team1, team2, stage, groupIndex = null) {
    return {
        id: `wc-match-${stage}-${groupIndex ?? 'ko'}-${team1.id}-${team2.id}`,
        team1Id: team1.id,
        team2Id: team2.id,
        stage,
        groupIndex,
        played: false,
        winnerId: null,
        score1: null,
        score2: null
    };
}

function shuffleWorldCupTeams(teams) {
    const shuffled = [...teams];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const targetIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]];
    }
    return shuffled;
}

function compareWorldCupQualificationTeams(first, second) {
    const firstHasPair = first.tourCardCount >= 2 ? 1 : 0;
    const secondHasPair = second.tourCardCount >= 2 ? 1 : 0;
    if (secondHasPair !== firstHasPair) return secondHasPair - firstHasPair;
    if (first.leaderRank !== second.leaderRank) return first.leaderRank - second.leaderRank;
    return getWorldCupTeamRating(second) - getWorldCupTeamRating(first) || first.country.localeCompare(second.country, 'pl');
}

function createWorldCupQualificationGroup(eventId, label, teams) {
    return {
        id: `wc-qualifier-${eventId}-${label}`,
        label,
        teamIds: teams.map(team => team.id),
        matches: teams.flatMap((team, index) => teams.slice(index + 1)
            .map(opponent => createWorldCupMatch(team, opponent, 'qualifier', `${eventId}-${label}`))),
        standings: []
    };
}

function buildWorldCupQualificationEvent(event, automaticCountries) {
    const teams = buildWorldCupTeams(event.nations)
        .filter(team => !automaticCountries.has(team.country));
    const teamCountries = Object.fromEntries(teams.map(team => [team.id, team.country]));
    const baseEvent = {
        id: event.id,
        label: event.label,
        slots: event.slots,
        method: event.method,
        teamCountries,
        groups: [],
        qualifiedTeamIds: [],
        completed: false
    };

    if (event.method === 'ranking') {
        const rankedTeams = [...teams].sort(compareWorldCupQualificationTeams);
        return {
            ...baseEvent,
            entries: rankedTeams.map((team, index) => ({ teamId: team.id, country: team.country, position: index + 1 })),
            qualifiedTeamIds: rankedTeams.slice(0, event.slots).map(team => team.id),
            completed: true
        };
    }

    const drawnTeams = shuffleWorldCupTeams(teams);
    const groups = event.id === 'asian-tour'
        ? [
            createWorldCupQualificationGroup(event.id, 'A', drawnTeams.slice(0, 3)),
            createWorldCupQualificationGroup(event.id, 'B', drawnTeams.slice(3, 6))
        ]
        : [createWorldCupQualificationGroup(event.id, 'A', drawnTeams)];
    return { ...baseEvent, groups };
}

function buildWorldCupGroupStage(selectedTeams) {
    const seededTeams = sortWorldCupTeamsForSeeding(selectedTeams);
    const directSeeds = seededTeams.slice(0, 4).map(team => team.id);
    const groupSeeds = seededTeams.slice(4, 16);
    const remainingTeams = shuffleWorldCupTeams(seededTeams.slice(16));
    const groups = groupSeeds.map((seededTeam, index) => {
        const team1 = remainingTeams[index * 2];
        const team2 = remainingTeams[index * 2 + 1];
        const groupTeams = [seededTeam, team1, team2];
        return {
            id: `wc-group-${String.fromCharCode(65 + index)}`,
            label: String.fromCharCode(65 + index),
            teamIds: groupTeams.map(team => team.id),
            matches: [
                createWorldCupMatch(groupTeams[0], groupTeams[1], 'group', index),
                createWorldCupMatch(groupTeams[0], groupTeams[2], 'group', index),
                createWorldCupMatch(groupTeams[1], groupTeams[2], 'group', index)
            ],
            standings: []
        };
    });

    worldCupState.teams = seededTeams;
    worldCupState.directSeeds = directSeeds;
    worldCupState.groups = groups;
    worldCupState.knockout = null;
    worldCupState.phase = 'groups';
}

function buildWorldCupState() {
    const automaticTeams = buildWorldCupTeams(getWorldCupAutomaticNationList());
    const automaticCountries = new Set(automaticTeams.map(team => team.country));
    const events = WORLD_CUP_QUALIFIER_EVENTS.map(event => buildWorldCupQualificationEvent(event, automaticCountries));
    const qualifierTeams = events.flatMap(event => Object.keys(event.teamCountries)
        .map(teamId => buildWorldCupTeams([event.teamCountries[teamId]])[0]));
    const allTeams = [...automaticTeams, ...qualifierTeams];
    const uniqueTeams = [...new Map(allTeams.map(team => [team.id, team])).values()];

    return {
        version: 5,
        qualifications: {
            automaticTeamIds: automaticTeams.map(team => team.id),
            events
        },
        phase: 'qualifications',
        teams: uniqueTeams,
        directSeeds: [],
        groups: [],
        knockout: null,
        knockoutHistory: [],
        payouts: {},
        pendingMatchId: null,
        completed: false
    };
}

function simulateWorldCupMatch(match) {
    const team1 = getWorldCupTeam(match.team1Id);
    const team2 = getWorldCupTeam(match.team2Id);
    const format = getWorldCupMatchFormat(match.stage);
    let team1Chance = Math.max(0.3, Math.min(0.7, 0.5 + (getWorldCupTeamRating(team1) - getWorldCupTeamRating(team2)) / 90));
    const preparationModifiers = [team1, team2].map(team => typeof getCareerPreparationMatchModifier === 'function'
        ? team.players.reduce((sum, candidate) => sum + getCareerPreparationMatchModifier(candidate), 0) / team.players.length
        : 0);
    if (typeof adjustCareerPreparationWinChance === 'function') {
        team1Chance = adjustCareerPreparationWinChance(team1Chance, preparationModifiers[0], preparationModifiers[1]);
    }
    const mentalTeams = typeof getMentalLegPenalties === 'function' ? [team1, team2].map(team => ({ traits: {
        mental: team.players.reduce((sum, candidate) => sum + getPlayerTrait(candidate, 'mental'), 0) / team.players.length
    } })) : null;
    const mentalTotals = [0, 0];
    let score1 = 0;
    let score2 = 0;

    while (score1 < format.legsToWin && score2 < format.legsToWin) {
        const penalties = mentalTeams ? getMentalLegPenalties(mentalTeams[0], mentalTeams[1], {
            isTournament: true, worldCupStage: match.stage, matchFormat: format, p1Legs: score1, p2Legs: score2,
            tournament: { name: WORLD_CUP_TOURNAMENT_NAME }
        }) : [0, 0];
        mentalTotals[0] += penalties[0]; mentalTotals[1] += penalties[1];
        const chance = mentalTeams ? adjustMentalLegWinChance(team1Chance, penalties) : team1Chance;
        if (Math.random() < chance) score1++; else score2++;
    }
    const team1Won = score1 > score2;
    const team1Average = getWorldCupSimulatedAverage(team1, team1Won, mentalTotals[0] / (score1 + score2), preparationModifiers[0]);
    const team2Average = getWorldCupSimulatedAverage(team2, !team1Won, mentalTotals[1] / (score1 + score2), preparationModifiers[1]);
    recordWorldCupTeamAverage(team1, team1Average);
    recordWorldCupTeamAverage(team2, team2Average);
    finishWorldCupStateMatch(match, team1Won ? team1.id : team2.id, score1, score2);
}

function finishWorldCupStateMatch(match, winnerId, score1, score2) {
    if (!match || match.played) return;
    match.played = true;
    match.winnerId = winnerId;
    match.score1 = score1;
    match.score2 = score2;
    worldCupState.pendingMatchId = null;
}

function getWorldCupGroupStandings(group) {
    const table = group.teamIds.map(teamId => ({ teamId, wins: 0, legsWon: 0, legsLost: 0 }));
    group.matches.filter(match => match.played).forEach(match => {
        const first = table.find(row => row.teamId === match.team1Id);
        const second = table.find(row => row.teamId === match.team2Id);
        first.legsWon += match.score1;
        first.legsLost += match.score2;
        second.legsWon += match.score2;
        second.legsLost += match.score1;
        if (match.winnerId === match.team1Id) first.wins++; else second.wins++;
    });
    return table.sort((first, second) => {
        if (second.wins !== first.wins) return second.wins - first.wins;
        const firstDiff = first.legsWon - first.legsLost;
        const secondDiff = second.legsWon - second.legsLost;
        if (secondDiff !== firstDiff) return secondDiff - firstDiff;
        if (second.legsWon !== first.legsWon) return second.legsWon - first.legsWon;
        return (getWorldCupTeam(first.teamId).seed || 99) - (getWorldCupTeam(second.teamId).seed || 99);
    });
}

function compareWorldCupStandingRows(first, second) {
    if (second.wins !== first.wins) return second.wins - first.wins;
    const firstDifference = first.legsWon - first.legsLost;
    const secondDifference = second.legsWon - second.legsLost;
    if (secondDifference !== firstDifference) return secondDifference - firstDifference;
    if (second.legsWon !== first.legsWon) return second.legsWon - first.legsWon;
    return getWorldCupTeam(first.teamId).country.localeCompare(getWorldCupTeam(second.teamId).country, 'pl');
}

function getWorldCupQualificationMatches() {
    if (!worldCupState || !worldCupState.qualifications) return [];
    return worldCupState.qualifications.events.flatMap(event => event.groups.flatMap(group => group.matches));
}

function completeWorldCupQualifications() {
    if (!worldCupState || !worldCupState.qualifications) return;
    const qualification = worldCupState.qualifications;
    qualification.events.forEach(event => {
        if (event.completed) return;
        const groupTables = event.groups.map(group => {
            const standings = getWorldCupGroupStandings(group);
            group.standings = standings;
            return standings;
        });
        let qualifiedTeamIds = [];
        if (event.id === 'asian-tour') {
            const groupWinners = groupTables.map(standings => standings[0]);
            const bestRunnerUp = groupTables.map(standings => standings[1])
                .sort(compareWorldCupStandingRows)[0];
            qualifiedTeamIds = [...groupWinners, bestRunnerUp].map(row => row.teamId);
        } else {
            qualifiedTeamIds = groupTables.flatMap(standings => standings.slice(0, event.slots).map(row => row.teamId));
        }
        event.qualifiedTeamIds = qualifiedTeamIds.slice(0, event.slots);
        event.completed = true;
    });

    const selectedTeamIds = [
        ...qualification.automaticTeamIds,
        ...qualification.events.flatMap(event => event.qualifiedTeamIds)
    ];
    const uniqueTeamIds = [...new Set(selectedTeamIds)];
    if (uniqueTeamIds.length !== 40) throw new Error(trWorldCup('incompleteQualifiers'));
    const selectedTeams = uniqueTeamIds.map(getWorldCupTeam).filter(Boolean);
    if (selectedTeams.length !== 40) throw new Error(trWorldCup('missingQualifiedTeam', { tournament: getWorldCupTournamentDisplayName() }));
    buildWorldCupGroupStage(selectedTeams);
    sendWorldCupQualificationResultsEmail(selectedTeams);
}

function awardWorldCupTeamPrize(teamId, amount, stage, won = false) {
    const key = `${teamId}-${stage}`;
    if (worldCupState.payouts[key]) return;
    worldCupState.payouts[key] = true;

    const team = getWorldCupTeam(teamId);
    if (!team) return;
    const individualPrize = amount / 2;
    team.players.filter(candidate => !candidate.isWorldCupGuest).forEach(candidate => {
        if (typeof recordSeasonArchivePrize === 'function') recordSeasonArchivePrize(candidate, individualPrize, { name: WORLD_CUP_TOURNAMENT_NAME, specialType: 'worldCup' });
        // Puchar Narodów jest turniejem nierankingowym: tylko zawodnik kariery otrzymuje
        // swoją połowę do portfela, bez zmiany Order of Merit ani innych rankingów.
        if (isCurrentPlayer(candidate)) {
            if (!Number.isFinite(Number(player.budget))) player.budget = 0;
            player.budget += individualPrize;
        }
        if (typeof recordSeasonTournamentResult === 'function') {
            recordSeasonTournamentResult(candidate, { name: WORLD_CUP_TOURNAMENT_NAME }, {
                round: stage === 'groupThird' || stage === 'groupSecond' ? 64 : stage === 'last16' ? 16 : stage === 'quarterFinal' ? 8 : stage === 'semiFinal' ? 4 : 2,
                prizeMoney: individualPrize,
                won,
                stage: `worldCup:${stage}`
            });
        }
    });
}

function getWorldCupPayoutLabel(stage) {
    const key = ({
        winner: 'payoutWinner', runnerUp: 'payoutRunnerUp', semiFinal: 'payoutSemiFinal', quarterFinal: 'payoutQuarterFinal',
        last16: 'payoutLast16', groupSecond: 'payoutGroupSecond', groupThird: 'payoutGroupThird'
    })[stage];
    return key ? trWorldCup(key, { tournament: getWorldCupTournamentDisplayName() }) : getWorldCupTournamentDisplayName();
}

function getWorldCupSeasonResultStage(stage) {
    const storedStage = String(stage || '');
    const stageKey = storedStage.startsWith('worldCup:') ? storedStage.slice('worldCup:'.length) : ({
        'Zwycięzca Pucharu Narodów': 'winner', 'Finalista Pucharu Narodów': 'runnerUp', 'Półfinalista Pucharu Narodów': 'semiFinal',
        'Ćwierćfinalista Pucharu Narodów': 'quarterFinal', 'Puchar Narodów — Top 16': 'last16',
        'Puchar Narodów — 2. miejsce w grupie': 'groupSecond', 'Puchar Narodów — 3. miejsce w grupie': 'groupThird'
    })[storedStage];
    return stageKey ? getWorldCupPayoutLabel(stageKey) : storedStage;
}

function getWorldCupOpeningKnockoutContenders() {
    if (!worldCupState || !Array.isArray(worldCupState.groups)) return null;

    const contendersBySeed = new Map();
    worldCupState.directSeeds.map(getWorldCupTeam).filter(Boolean).forEach((team, index) => {
        const seed = Number.isInteger(Number(team.seed)) ? Number(team.seed) : index + 1;
        contendersBySeed.set(seed, team);
    });

    worldCupState.groups.forEach((group, index) => {
        const standings = group.standings?.length ? group.standings : getWorldCupGroupStandings(group);
        const winner = standings[0] ? getWorldCupTeam(standings[0].teamId) : null;
        const seededTeam = getWorldCupTeam(group.teamIds?.[0]);
        const seed = Number.isInteger(Number(seededTeam?.seed)) ? Number(seededTeam.seed) : index + 5;
        if (winner) contendersBySeed.set(seed, winner);
    });

    return contendersBySeed.size === 16 ? contendersBySeed : null;
}

function buildWorldCupOpeningKnockoutMatches() {
    const contendersBySeed = getWorldCupOpeningKnockoutContenders();
    if (!contendersBySeed) return [];

    const matches = WORLD_CUP_KNOCKOUT_SEED_ORDER.map(([firstSeed, secondSeed]) => {
        const firstTeam = contendersBySeed.get(firstSeed);
        const secondTeam = contendersBySeed.get(secondSeed);
        return firstTeam && secondTeam ? createWorldCupMatch(firstTeam, secondTeam, 'last16') : null;
    });

    return matches.every(Boolean) ? matches : [];
}

function repairWorldCupOpeningKnockoutDraw() {
    const knockout = worldCupState?.knockout;
    if (!knockout || knockout.round !== 16 || knockout.drawVersion === WORLD_CUP_KNOCKOUT_DRAW_VERSION) return false;
    if (knockout.matches?.some(match => match.played || match.winnerId)) return false;

    const matches = buildWorldCupOpeningKnockoutMatches();
    if (matches.length !== 8) return false;

    worldCupState.knockout = { round: 16, matches, drawVersion: WORLD_CUP_KNOCKOUT_DRAW_VERSION };
    worldCupState.pendingMatchId = null;
    return true;
}

function completeWorldCupGroupStage() {
    worldCupState.groups.forEach(group => {
        const standings = getWorldCupGroupStandings(group);
        group.standings = standings;
        awardWorldCupTeamPrize(standings[1].teamId, WORLD_CUP_PRIZES.groupSecond, 'groupSecond');
        awardWorldCupTeamPrize(standings[2].teamId, WORLD_CUP_PRIZES.groupThird, 'groupThird');
    });

    const matches = buildWorldCupOpeningKnockoutMatches();

    worldCupState.phase = 'knockout';
    worldCupState.knockout = { round: 16, matches, drawVersion: WORLD_CUP_KNOCKOUT_DRAW_VERSION };
}

function archiveWorldCupKnockoutRound(round) {
    if (!worldCupState || !round || !Array.isArray(round.matches) || !round.matches.every(match => match.played)) return;
    if (!Array.isArray(worldCupState.knockoutHistory)) worldCupState.knockoutHistory = [];

    const archivedRound = {
        round: round.round,
        matches: round.matches.map(match => ({
            team1Id: match.team1Id,
            team2Id: match.team2Id,
            played: true,
            winnerId: match.winnerId,
            score1: match.score1,
            score2: match.score2
        }))
    };
    const existingIndex = worldCupState.knockoutHistory.findIndex(entry => entry.round === archivedRound.round);
    if (existingIndex >= 0) worldCupState.knockoutHistory[existingIndex] = archivedRound;
    else worldCupState.knockoutHistory.push(archivedRound);
}

function getWorldCupHistoryRoundLabel(round) {
    const key = ({ 16: 'last16', 8: 'quarterFinal', 4: 'semiFinal', 2: 'final' })[round];
    return key ? trWorldCup(key) : trWorldCup('knockoutStage');
}

function getWorldCupHistoryTeamLabel(teamId) {
    const team = getWorldCupTeam(teamId);
    return team ? escapeHtml(getWorldCupCountryName(team.country)) : '—';
}

function buildWorldCupTournamentHistory(winner) {
    if (!worldCupState) return '';

    const groupHistory = (worldCupState.groups || []).map(group => {
        const standings = group.standings?.length ? group.standings : getWorldCupGroupStandings(group);
        const groupWinnerTeam = standings[0] ? getWorldCupTeam(standings[0].teamId) : null;
        const groupWinner = groupWinnerTeam ? getWorldCupCountryName(groupWinnerTeam.country) : '—';
        const rows = standings.map((row, index) => {
            const emphasis = index === 0 ? ' style="color:var(--accent-green); font-weight:bold;"' : '';
            return `<li${emphasis}>${index + 1}. ${getWorldCupHistoryTeamLabel(row.teamId)} <small>· ${row.wins}${trWorldCup('winsAbbreviation')} · ${row.legsWon}-${row.legsLost}</small></li>`;
        }).join('');
        const matches = (group.matches || []).map(match => {
            const score = match.played ? `${match.score1}:${match.score2}` : '—';
            return `<div>${getWorldCupHistoryTeamLabel(match.team1Id)} <strong>${score}</strong> ${getWorldCupHistoryTeamLabel(match.team2Id)}</div>`;
        }).join('');
        return `<section style="margin:12px 0; padding:10px; background:#16213e; border:1px solid #2c3e50; border-radius:6px;">
            <h4 style="margin:0 0 6px;">${escapeHtml(trWorldCup('group', { label: group.label }))}</h4>
            <p style="margin:0 0 7px; color:var(--accent-green);"><strong>${escapeHtml(trWorldCup('historyGroupWinner', { country: groupWinner }))}</strong></p>
            <ol style="margin:0 0 8px; padding-left:22px;">${rows}</ol>
            <div style="font-size:12px; color:#bdc3c7; line-height:1.55;">${matches}</div>
        </section>`;
    }).join('');

    const roundsBySize = new Map();
    (worldCupState.knockoutHistory || []).forEach(round => roundsBySize.set(round.round, round));
    if (worldCupState.knockout?.round && !roundsBySize.has(worldCupState.knockout.round)) {
        roundsBySize.set(worldCupState.knockout.round, worldCupState.knockout);
    }
    const knockoutHistory = [...roundsBySize.values()]
        .sort((first, second) => second.round - first.round)
        .map(round => {
            const matches = (round.matches || []).map(match => {
                const score = Number.isFinite(Number(match.score1)) && Number.isFinite(Number(match.score2))
                    ? `${match.score1}:${match.score2}`
                    : '—';
                return `<div style="padding:4px 0; border-bottom:1px solid #2c3e50;">${getWorldCupHistoryTeamLabel(match.team1Id)} <strong style="color:#f1c40f;">${score}</strong> ${getWorldCupHistoryTeamLabel(match.team2Id)}</div>`;
            }).join('');
            return `<section style="margin:12px 0;"><h4 style="margin:0 0 6px; color:var(--accent-green);">${escapeHtml(getWorldCupHistoryRoundLabel(round.round))}</h4>${matches}</section>`;
        }).join('');

    const championCountry = winner?.country ? getWorldCupCountryName(winner.country) : '—';
    return `<section class="world-cup-history">
        <h3 style="margin:0 0 10px;">🏆 ${escapeHtml(getWorldCupTournamentDisplayName())}</h3>
        <p style="margin:0 0 16px; font-size:16px; color:var(--accent-green);"><strong>${escapeHtml(trWorldCup('historyChampion', { country: championCountry }))}</strong></p>
        <h3 style="margin:0 0 8px;">${escapeHtml(trWorldCup('historyGroups'))}</h3>
        ${groupHistory || '<p>—</p>'}
        <h3 style="margin:18px 0 8px;">${escapeHtml(trWorldCup('historyKnockout'))}</h3>
        ${knockoutHistory || '<p>—</p>'}
    </section>`;
}

function rebuildCompletedWorldCupCalendarHistory() {
    if (!worldCupState?.completed || !Array.isArray(tournamentDatabase)) return false;
    const tournament = tournamentDatabase.find(candidate => candidate.specialType === 'worldCup');
    if (!tournament) return false;

    let winner = tournament.worldCupWinner || null;
    if (!winner) {
        const finalMatch = worldCupState.knockout?.matches?.find(match => match.winnerId);
        const winnerTeam = finalMatch ? getWorldCupTeam(finalMatch.winnerId) : null;
        if (winnerTeam) winner = { country: winnerTeam.country, players: winnerTeam.players.map(candidate => candidate.name) };
    }
    if (!winner?.country) return false;

    tournament.historyLogs = buildWorldCupTournamentHistory(winner);
    return true;
}

function getWorldCupPendingMatch() {
    if (!worldCupState || !worldCupState.pendingMatchId) return null;
    const allMatches = worldCupState.phase === 'qualifications'
        ? getWorldCupQualificationMatches()
        : worldCupState.phase === 'groups'
            ? worldCupState.groups.flatMap(group => group.matches)
            : (worldCupState.knockout ? worldCupState.knockout.matches : []);
    return allMatches.find(match => match.id === worldCupState.pendingMatchId) || null;
}

function teamContainsCareerPlayer(team) {
    return Boolean(team && team.players.some(candidate => isCurrentPlayer(candidate)));
}

function sendWorldCupSelectionEmail() {
    if (!worldCupState || worldCupState.selectionEmailSent || typeof addEmail !== 'function') return;
    const careerTeam = worldCupState.teams.find(teamContainsCareerPlayer);
    if (!careerTeam) return;

    const qualification = worldCupState.qualifications;
    const directEntry = qualification?.automaticTeamIds?.includes(careerTeam.id);
    const qualifierEvent = qualification?.events?.find(event =>
        Object.prototype.hasOwnProperty.call(event.teamCountries || {}, careerTeam.id));
    const qualifiedByRanking = qualifierEvent?.method === 'ranking' && qualifierEvent.qualifiedTeamIds?.includes(careerTeam.id);
    const partner = careerTeam.players.find(candidate => !isCurrentPlayer(candidate));
    const partnerName = partner ? partner.name : trWorldCup('fallbackPartner');
    const sender = trWorldCup('mailSender');
    let subject;
    let body;
    const country = `<strong>${escapeHtml(getWorldCupCountryName(careerTeam.country))}</strong>`;
    const partnerLabel = `<strong>${escapeHtml(partnerName)}</strong>`;
    const tournament = getWorldCupTournamentDisplayName();

    if (directEntry || qualifiedByRanking) {
        const route = qualifiedByRanking
            ? trWorldCup('selectionRouteRanking', { event: getWorldCupQualifierLabel(qualifierEvent) })
            : trWorldCup('selectionRouteDirect');
        subject = trWorldCup('selectionSubject', { country: getWorldCupCountryName(careerTeam.country), tournament });
        body = trWorldCup('selectionBody', { country, partner: partnerLabel, route: `<strong>${escapeHtml(route)}</strong>` });
    } else if (qualifierEvent) {
        subject = trWorldCup('selectionQualifierSubject', { country: getWorldCupCountryName(careerTeam.country) });
        body = trWorldCup('selectionQualifierBody', { country, partner: partnerLabel, tournament, event: `<strong>${escapeHtml(getWorldCupQualifierLabel(qualifierEvent))}</strong>` });
    } else {
        return;
    }

    addEmail(sender, subject, body);
    worldCupState.selectionEmailSent = true;
}

function sendWorldCupQualificationResultsEmail(selectedTeams) {
    if (!worldCupState || worldCupState.qualificationResultsEmailSent || typeof addEmail !== 'function') return;
    const qualification = worldCupState.qualifications;
    if (!qualification || !qualification.events?.every(event => event.completed)) return;

    const qualifierResults = qualification.events.map(event => {
        const countries = (event.qualifiedTeamIds || [])
            .map(teamId => getWorldCupTeam(teamId)?.country)
            .filter(Boolean)
            .map(getWorldCupCountryName)
            .map(escapeHtml);
        return `<strong>${escapeHtml(getWorldCupQualifierLabel(event))}:</strong> ${countries.join(', ') || '—'}`;
    }).join('<br>');
    const tournamentNations = [...selectedTeams]
        .map(team => team.country)
        .map(getWorldCupCountryName)
        .sort((first, second) => first.localeCompare(second, ({ pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' })[currentLang] || 'en-GB'))
        .map(escapeHtml)
        .join(', ');

    const tournament = getWorldCupTournamentDisplayName();
    const sender = trWorldCup('mailSender');
    const subject = trWorldCup('qualificationResultsSubject', { tournament });
    const body = trWorldCup('qualificationResultsBody', { tournament, qualifierResults, nations: tournamentNations });
    addEmail(sender, subject, body);
    worldCupState.qualificationResultsEmailSent = true;
}

function completeWorldCupQualifierCalendarEvent() {
    if (!isWorldCupQualifierTournament()) return;

    activeTournament.completed = true;
    activeTournament.historyLogs = `<strong>${getWorldCupQualifierTournamentDisplayName()}</strong><br>${trWorldCup('qualificationResultsSubject', { tournament: getWorldCupTournamentDisplayName() })}`;
    activeTournament = null;
    const tile = document.getElementById('tile-tournament');
    if (tile) tile.style.display = 'none';
    const modal = document.getElementById('bracket-modal');
    if (modal) modal.style.display = 'none';
    if (typeof updateHub === 'function') updateHub();
    if (typeof saveGame === 'function') saveGame(true);
    if (typeof showScreen === 'function') showScreen('screen-hub');
}

function getCurrentWorldCupStageMatches() {
    if (!worldCupState) return [];
    if (worldCupState.phase === 'qualifications') return getWorldCupQualificationMatches();
    if (worldCupState.phase === 'groups') return worldCupState.groups.flatMap(group => group.matches);
    return worldCupState.knockout?.matches || [];
}

function getWorldCupCareerMatchInCurrentStage() {
    return getCurrentWorldCupStageMatches().find(match => {
        if (match.played) return false;
        const team1 = getWorldCupTeam(match.team1Id);
        const team2 = getWorldCupTeam(match.team2Id);
        return teamContainsCareerPlayer(team1) || teamContainsCareerPlayer(team2);
    }) || null;
}

function completeWorldCupKnockoutRound(currentRound) {
    const losingStage = currentRound.round === 16 ? 'last16' : currentRound.round === 8 ? 'quarterFinal' : currentRound.round === 4 ? 'semiFinal' : 'runnerUp';
    const losingPrize = WORLD_CUP_PRIZES[losingStage];
    currentRound.matches.forEach(match => {
        const loserId = match.winnerId === match.team1Id ? match.team2Id : match.team1Id;
        awardWorldCupTeamPrize(loserId, losingPrize, losingStage);
    });
    archiveWorldCupKnockoutRound(currentRound);

    const winners = currentRound.matches.map(match => getWorldCupTeam(match.winnerId));
    if (winners.length === 1) {
        awardWorldCupTeamPrize(winners[0].id, WORLD_CUP_PRIZES.winner, 'winner', true);
        finishWorldCupTournament(winners[0]);
        return false;
    }

    const nextRound = currentRound.round / 2;
    const nextStage = nextRound === 2 ? 'final' : nextRound === 4 ? 'semiFinal' : 'quarterFinal';
    const matches = [];
    for (let index = 0; index < winners.length; index += 2) {
        matches.push(createWorldCupMatch(winners[index], winners[index + 1], nextStage));
    }
    worldCupState.knockout = { round: nextRound, matches };
    return true;
}

function simulateWorldCupCurrentStage(showOverview = true, onlyAIMatches = false) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    const stage = iterateWorldCupCurrentStage(showOverview, onlyAIMatches);
    let step = stage.next();
    while (!step.done) step = stage.next();
    return step.value;
}

function* iterateWorldCupCurrentStage(showOverview = true, onlyAIMatches = false) {
    if (!worldCupState || worldCupState.completed) return false;

    const careerMatch = !worldCupState.skipPlayerMatches && getWorldCupCareerMatchInCurrentStage();
    if (careerMatch && !onlyAIMatches) {
        worldCupState.pendingMatchId = careerMatch.id;
        if (showOverview) showWorldCupOverview();
        return false;
    }

    const matches = getCurrentWorldCupStageMatches()
        .filter(match => !match.played)
        .filter(match => {
            if (!onlyAIMatches) return true;
            return !teamContainsCareerPlayer(getWorldCupTeam(match.team1Id)) && !teamContainsCareerPlayer(getWorldCupTeam(match.team2Id));
        });
    for (const match of matches) {
        simulateWorldCupMatch(match);
        yield;
    }

    const remainingCareerMatch = !worldCupState.skipPlayerMatches && getWorldCupCareerMatchInCurrentStage();
    if (remainingCareerMatch) {
        worldCupState.pendingMatchId = remainingCareerMatch.id;
        if (typeof saveGame === 'function') saveGame(true);
        if (showOverview) showWorldCupOverview();
        return true;
    }

    if (worldCupState.phase === 'qualifications') {
        completeWorldCupQualifications();
        // Kwalifikacje mają osobny termin w kalendarzu. Po ich domknięciu nie
        // uruchamiamy automatycznie turnieju głównego z innego dnia.
        if (isWorldCupQualifierTournament()) {
            completeWorldCupQualifierCalendarEvent();
            return false;
        }
    } else if (worldCupState.phase === 'groups') {
        completeWorldCupGroupStage();
    } else {
        const tournamentContinues = completeWorldCupKnockoutRound(worldCupState.knockout);
        if (!tournamentContinues) return false;
    }

    if (typeof saveGame === 'function') saveGame(true);
    if (showOverview) showWorldCupOverview();
    return true;
}

function simulateSkippedWorldCup() {
    if (!worldCupState || worldCupState.completed || !worldCupState.skipPlayerMatches) return false;
    const qualifierCalendarEvent = isWorldCupQualifierTournament();
    const tournament = activeTournament;
    const state = worldCupState;
    return runTournamentSimulation(async () => {
        let safety = 0;
        while (worldCupState && !worldCupState.completed && safety < 6) {
            const phaseBefore = worldCupState.phase;
            await runTournamentSimulationSteps(
                iterateWorldCupCurrentStage(false), getWorldCupRoundLabel(),
                getCurrentWorldCupStageMatches().filter(match => !match.played).length,
                () => {
                    if (activeTournament !== tournament || worldCupState !== state) {
                        throw new Error('Stan Pucharu Narodów zmienił się w trakcie symulacji.');
                    }
                }
            );
            safety++;
            if (qualifierCalendarEvent || worldCupState.completed || worldCupState.phase === phaseBefore) break;
            await yieldTournamentSimulation();
        }
        return true;
    }, { onRestored: () => showWorldCupOverview() });
}

function isWorldCupCareerTeamStillAlive() {
    if (!worldCupState || worldCupState.completed) return false;
    const careerTeam = worldCupState.teams.find(teamContainsCareerPlayer);
    if (!careerTeam) return false;

    // Przed fazą pucharową wynik gracza może nadal zależeć od pozostałych
    // spotkań grupowych, więc nie udostępniamy jeszcze skrótu całych zawodów.
    if (worldCupState.phase !== 'knockout') return true;

    return (worldCupState.knockout?.matches || []).some(match => {
        const includesCareerTeam = match.team1Id === careerTeam.id || match.team2Id === careerTeam.id;
        return includesCareerTeam && (!match.played || match.winnerId === careerTeam.id);
    });
}

function simulateRemainingWorldCupTournament() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (isFastForwardingWorldCup || !worldCupState || worldCupState.completed || isWorldCupCareerTeamStillAlive()) return false;

    const completedTournament = activeTournament;
    const button = document.getElementById('t-btn-sim-tournament');
    isFastForwardingWorldCup = true;
    if (button) button.disabled = true;
    worldCupState.skipPlayerMatches = true;

    try {
        let simulatedStages = 0;
        while (!worldCupState.completed && simulatedStages < 8) {
            simulateWorldCupCurrentStage(false);
            simulatedStages++;
        }

        if (!worldCupState.completed) return false;
        if (completedTournament?.historyLogs && typeof showCompletedTournamentResults === 'function') {
            showCompletedTournamentResults(completedTournament);
        }
        return true;
    } finally {
        isFastForwardingWorldCup = false;
        if (button) button.disabled = false;
    }
}

function advanceWorldCup() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (!worldCupState || worldCupState.completed) return;
    if (worldCupState.skipPlayerMatches) {
        return simulateSkippedWorldCup();
    }

    const careerMatch = getWorldCupCareerMatchInCurrentStage();
    worldCupState.pendingMatchId = careerMatch ? careerMatch.id : null;
    showWorldCupOverview();
}

function getWorldCupRoundLabel() {
    if (!worldCupState) return '';
    if (worldCupState.phase === 'qualifications') return trWorldCup('regionalQualifiers');
    if (worldCupState.phase === 'groups') return trWorldCup('groupStage');
    const key = ({ 16: 'last16', 8: 'quarterFinal', 4: 'semiFinal', 2: 'final' })[worldCupState.knockout.round];
    return key ? trWorldCup(key) : trWorldCup('knockoutStage');
}

function renderWorldCupMiniMatch(firstCountry, score, secondCountry) {
    return `<div class="world-cup-mini-match">
        <span class="world-cup-mini-home">${escapeHtml(getWorldCupCountryName(firstCountry))}</span>
        <strong>${score}</strong>
        <span class="world-cup-mini-away">${escapeHtml(getWorldCupCountryName(secondCountry))}</span>
    </div>`;
}

function renderWorldCupGroup(group) {
    const rows = getWorldCupGroupStandings(group).map((row, index) => {
        const team = getWorldCupTeam(row.teamId);
        return `<div class="world-cup-group-row ${teamContainsCareerPlayer(team) ? 'world-cup-player-team' : ''}">
            <span>${index + 1}. ${getFlagImg(team.country)} ${escapeHtml(getWorldCupCountryName(team.country))}</span>
            <span>${row.wins}${trWorldCup('winsAbbreviation')} · ${row.legsWon}-${row.legsLost}</span>
        </div>`;
    }).join('');
    const matches = group.matches.map(match => {
        const team1 = getWorldCupTeam(match.team1Id);
        const team2 = getWorldCupTeam(match.team2Id);
        const score = match.played ? `${match.score1}:${match.score2}` : '—';
        return renderWorldCupMiniMatch(team1.country, score, team2.country);
    }).join('');
    return `<section class="world-cup-group"><h4>${trWorldCup('group', { label: group.label })}</h4>${rows}<div class="world-cup-mini-matches">${matches}</div></section>`;
}

function renderWorldCupQualifications() {
    if (!worldCupState || !worldCupState.qualifications || !Array.isArray(worldCupState.qualifications.events)) return '';
    const events = worldCupState.qualifications.events.map(event => {
        const getCountry = teamId => event.teamCountries?.[teamId] || getWorldCupTeam(teamId)?.country || '—';
        const qualifiedIds = new Set(event.qualifiedTeamIds || []);
        const entries = event.method === 'ranking'
            ? (event.entries || []).map(entry => `<li class="${qualifiedIds.has(entry.teamId) ? 'world-cup-qualified' : ''}">
                <span>${entry.position}. ${getFlagImg(entry.country)} ${escapeHtml(getWorldCupCountryName(entry.country))}</span>
                <strong>${qualifiedIds.has(entry.teamId) ? trWorldCup('qualified') : '—'}</strong>
            </li>`).join('')
            : event.groups.map(group => {
                const standings = group.standings?.length ? group.standings : getWorldCupGroupStandings(group);
                const rows = standings.map((row, index) => `<li class="${qualifiedIds.has(row.teamId) ? 'world-cup-qualified' : ''}">
                    <span>${index + 1}. ${getFlagImg(getCountry(row.teamId))} ${escapeHtml(getWorldCupCountryName(getCountry(row.teamId)))} <small>${row.wins}${trWorldCup('winsAbbreviation')} · ${row.legsWon}-${row.legsLost}</small></span>
                    <strong>${qualifiedIds.has(row.teamId) ? trWorldCup('qualified') : '—'}</strong>
                </li>`).join('');
                const matches = group.matches.map(match => renderWorldCupMiniMatch(
                    getCountry(match.team1Id),
                    match.played ? `${match.score1}:${match.score2}` : '—',
                    getCountry(match.team2Id)
                )).join('');
                return `<div class="world-cup-qualifier-group"><h5>${trWorldCup('group', { label: group.label })}</h5><ol>${rows}</ol><div class="world-cup-mini-matches">${matches}</div></div>`;
            }).join('');
        const methodLabel = event.method === 'ranking' ? trWorldCup('methodRanking') : trWorldCup('methodEvent');
        return `<section class="world-cup-qualifier-event">
            <h4>${escapeHtml(getWorldCupQualifierLabel(event))} <small>· ${event.slots} ${event.slots === 1 ? trWorldCup('placeOne') : trWorldCup('placeMany')} · ${methodLabel}</small></h4>
            <ol>${entries}</ol>
        </section>`;
    }).join('');
    return `<section class="world-cup-qualifications">
        <h3>${trWorldCup('qualificationHeading', { tournament: getWorldCupTournamentDisplayName() })}</h3>
        <p>${trWorldCup('qualificationSummary')}</p>
        <div class="world-cup-qualifier-grid">${events}</div>
    </section>`;
}

function showWorldCupOverview() {
    if (!worldCupState) return;
    const modal = document.getElementById('bracket-modal');
    const title = document.getElementById('bracket-title');
    const list = document.getElementById('bracket-list');
    const playButton = document.getElementById('t-btn-play-match');
    const simulateButton = document.getElementById('t-btn-sim-round');
    const simulateTournamentButton = document.getElementById('t-btn-sim-tournament');
    const pending = getWorldCupPendingMatch();

    title.innerText = `🏆 ${getWorldCupTournamentDisplayName()} — ${getWorldCupRoundLabel()}`;
    if (worldCupState.phase === 'qualifications') {
        list.innerHTML = `${renderWorldCupQualifications()}<p class="world-cup-intro">${trWorldCup('qualificationMatchIntro')}</p>`;
    } else if (worldCupState.phase === 'groups') {
        list.innerHTML = `${renderWorldCupQualifications()}<p class="world-cup-intro">${trWorldCup('groupIntro')}</p><div class="world-cup-groups">${worldCupState.groups.map(renderWorldCupGroup).join('')}</div>`;
    } else {
        const rows = worldCupState.knockout.matches.map(match => {
            const team1 = getWorldCupTeam(match.team1Id);
            const team2 = getWorldCupTeam(match.team2Id);
            const score = match.played ? `${match.score1}:${match.score2}` : 'VS';
            return `<div class="bracket-match ${(teamContainsCareerPlayer(team1) || teamContainsCareerPlayer(team2)) ? 'player-match' : ''}">
                <div style="flex:1;text-align:right;">${getFlagImg(team1.country)} ${escapeHtml(getWorldCupTeamLabel(team1))}</div>
                <div class="bracket-vs">${score}</div>
                <div style="flex:1;text-align:left;">${getFlagImg(team2.country)} ${escapeHtml(getWorldCupTeamLabel(team2))}</div>
            </div>`;
        }).join('');
        const archivedRounds = [...(worldCupState.knockoutHistory || [])]
            .sort((first, second) => second.round - first.round)
            .map(round => {
                const matches = round.matches.map(match => {
                    const team1 = getWorldCupTeam(match.team1Id);
                    const team2 = getWorldCupTeam(match.team2Id);
                    return renderWorldCupMiniMatch(team1.country, `${match.score1}:${match.score2}`, team2.country);
                }).join('');
                return `<section class="world-cup-previous-round"><h4>${escapeHtml(getWorldCupHistoryRoundLabel(round.round))}</h4>${matches}</section>`;
            }).join('');
        list.innerHTML = `<p class="world-cup-intro">${trWorldCup('knockoutIntro', { directSeeds: worldCupState.directSeeds.length, groupWinners: 12 })}</p>${archivedRounds}<h3 style="margin:14px 0 8px;">${escapeHtml(getWorldCupHistoryRoundLabel(worldCupState.knockout.round))}</h3>${rows}`;
    }

    if (pending) {
        const team1 = getWorldCupTeam(pending.team1Id);
        const team2 = getWorldCupTeam(pending.team2Id);
        playButton.style.display = 'block';
        playButton.innerText = trWorldCup('playMatch', { team1: getWorldCupCountryName(team1.country), team2: getWorldCupCountryName(team2.country) });
        playButton.onclick = startWorldCupPendingMatch;
        simulateButton.style.display = 'block';
        simulateButton.innerText = trWorldCup('simulateOtherMatches');
        simulateButton.onclick = () => simulateWorldCupCurrentStage(true, true);
    } else {
        playButton.style.display = 'none';
        simulateButton.style.display = 'block';
        simulateButton.innerText = worldCupState.phase === 'qualifications'
            ? trWorldCup('simulateQualifications')
            : trWorldCup('simulateNextStage', { tournament: getWorldCupTournamentDisplayName() });
        simulateButton.onclick = () => simulateWorldCupCurrentStage(true);
    }
    if (simulateTournamentButton) {
        const canFastForwardTournament = worldCupState.phase === 'knockout'
            && !worldCupState.completed
            && !isWorldCupCareerTeamStillAlive();
        simulateTournamentButton.style.display = canFastForwardTournament ? 'block' : 'none';
        simulateTournamentButton.innerText = t('t-btn-sim-tournament');
        simulateTournamentButton.onclick = simulateRemainingWorldCupTournament;
    }
    modal.style.display = 'flex';
}

function refreshWorldCupTranslations() {
    const modal = document.getElementById('bracket-modal');
    if (worldCupState && modal?.style.display === 'flex') showWorldCupOverview();

    if (!currentMatch?.isWorldCup) return;
    const playerTeam = currentMatch.worldCupTeamP1;
    const opponentTeam = currentMatch.worldCupTeamP2;
    const format = currentMatch.matchFormat || getWorldCupMatchFormat('group');
    document.getElementById('match-p1-name').innerHTML = `${getFlagImg(playerTeam.country)} <strong>${escapeHtml(getWorldCupCountryName(playerTeam.country))}</strong><br><small>${escapeHtml(playerTeam.players.map(candidate => candidate.name).join(' / '))}</small>`;
    document.getElementById('match-p2-name').innerHTML = `${getFlagImg(opponentTeam.country)} <strong>${escapeHtml(getWorldCupCountryName(opponentTeam.country))}</strong><br><small>${escapeHtml(opponentTeam.players.map(candidate => candidate.name).join(' / '))}</small>`;
    document.getElementById('match-title').innerText = `🏆 ${trWorldCup('matchTitle', { tournament: getWorldCupTournamentDisplayName(), round: getWorldCupRoundLabel(), legs: format.legsToWin })}`;
}

function startWorldCupTournament() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (!isWorldCupTournament()) return;
    const shouldCreateState = !worldCupState || worldCupState.completed;
    if (shouldCreateState) worldCupState = buildWorldCupState();
    const rostersRepaired = repairWorldCupTeamRosters();
    const knockoutDrawRepaired = repairWorldCupOpeningKnockoutDraw();
    if (shouldCreateState || rostersRepaired || knockoutDrawRepaired) {
        sendWorldCupSelectionEmail();
        if (typeof saveGame === 'function') saveGame(true);
    }
    const isSkipping = typeof isSkippingTournament !== 'undefined' && isSkippingTournament;
    if (isSkipping) {
        worldCupState.skipPlayerMatches = true;
        isSkippingTournament = false;
    }
    if (!worldCupState.skipPlayerMatches && worldCupState.teams.some(teamContainsCareerPlayer) && typeof chargeTournamentParticipationStamina === 'function') {
        chargeTournamentParticipationStamina(activeTournament);
    }
    if (!worldCupState.skipPlayerMatches && !worldCupState.qualificationsAcknowledged) {
        worldCupState.qualificationsAcknowledged = true;
        showWorldCupOverview();
        return;
    }
    return advanceWorldCup();
}

function startWorldCupQualifiers() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (!isWorldCupQualifierTournament()) return;
    const shouldCreateState = !worldCupState || worldCupState.completed;
    if (shouldCreateState) worldCupState = buildWorldCupState();
    const rostersRepaired = repairWorldCupTeamRosters();
    const knockoutDrawRepaired = repairWorldCupOpeningKnockoutDraw();
    if (shouldCreateState || rostersRepaired || knockoutDrawRepaired) {
        sendWorldCupSelectionEmail();
        if (typeof saveGame === 'function') saveGame(true);
    }
    const isSkipping = typeof isSkippingTournament !== 'undefined' && isSkippingTournament;
    if (isSkipping) {
        worldCupState.skipPlayerMatches = true;
        isSkippingTournament = false;
    }
    if (!worldCupState.skipPlayerMatches && worldCupState.teams.some(teamContainsCareerPlayer) && typeof chargeTournamentParticipationStamina === 'function') {
        chargeTournamentParticipationStamina(activeTournament);
    }
    if (!worldCupState.skipPlayerMatches && !worldCupState.qualificationsAcknowledged) {
        worldCupState.qualificationsAcknowledged = true;
        showWorldCupOverview();
        return;
    }
    return advanceWorldCup();
}

function startWorldCupPendingMatch() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    const match = getWorldCupPendingMatch();
    if (!match) return;
    document.getElementById('bracket-modal').style.display = 'none';
    startWorldCupMatch(match);
}

function getDoublesCurrentThrower(isP1) {
    if (!currentMatch || !currentMatch.isDoubles) return isP1 ? player : currentMatch.opponent;
    const team = isP1 ? currentMatch.worldCupTeamP1 : currentMatch.worldCupTeamP2;
    const side = isP1 ? 'p1' : 'p2';
    return team.players[currentMatch.doublesThrower[side]] || team.players[0];
}

function getDoublesTeamName(isP1) {
    if (!currentMatch || !currentMatch.isDoubles) return isP1 ? player.name : currentMatch.opponent.name;
    return (isP1 ? currentMatch.worldCupTeamP1 : currentMatch.worldCupTeamP2).country;
}

function getCurrentMatchThrowerName(isP1) {
    if (!currentMatch || !currentMatch.isDoubles) return isP1 ? player.name : currentMatch.opponent.name;
    const thrower = getDoublesCurrentThrower(isP1);
    return thrower ? thrower.name : getDoublesTeamName(isP1);
}

function isCareerPlayerThrowing(isP1) {
    if (!isP1) return false;
    if (!currentMatch || !currentMatch.isDoubles) return true;
    return samePlayer(getDoublesCurrentThrower(true), player);
}

function startWorldCupMatch(match) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    repairWorldCupTeamRosters();
    const team1 = getWorldCupTeam(match.team1Id);
    const team2 = getWorldCupTeam(match.team2Id);
    const playerTeam = teamContainsCareerPlayer(team1) ? team1 : team2;
    const opponentTeam = playerTeam === team1 ? team2 : team1;
    const format = getWorldCupMatchFormat(match.stage);
    const starter = Math.random() < 0.5 ? 'p1' : 'p2';

    currentMatch = {
        vsAI: true,
        isTournament: true,
        isWorldCup: true,
        isDoubles: true,
        opponent: opponentTeam.players[0],
        worldCupMatchId: match.id,
        worldCupStage: match.stage,
        worldCupTeamP1: playerTeam,
        worldCupTeamP2: opponentTeam,
        doublesThrower: { p1: playerTeam.players.findIndex(candidate => isCurrentPlayer(candidate)), p2: 0 },
        p1Score: 501, p2Score: 501, p1Legs: 0, p2Legs: 0, p1Sets: 0, p2Sets: 0, totalLegsPlayed: 0,
        legsToWin: format.legsToWin, matchFormat: format, turn: starter, startingPlayer: starter, dartsThrown: 0, isTurnLocked: false,
        p1TurnStartScore: 501, p2TurnStartScore: 501,
        stats: {
            p1TotalDarts: 0, p1AccumulatedScore: 0, p1First9Score: 0, p1First9Darts: 0, p1LegDarts: 0, p1HighCheckout: 0, p1DoubleAttempts: 0, p1DoubleHits: 0, p1OneEighties: 0,
            p2TotalDarts: 0, p2AccumulatedScore: 0, p2First9Score: 0, p2First9Darts: 0, p2LegDarts: 0, p2HighCheckout: 0, p2DoubleAttempts: 0, p2DoubleHits: 0, p2OneEighties: 0
        }
    };
    if (currentMatch.doublesThrower.p1 < 0) currentMatch.doublesThrower.p1 = 0;

    currentTurnScore = 0;
    document.getElementById('match-log').innerHTML = '';
    drawnDarts = [];
    drawDartboard();
    updateDartDots();
    document.getElementById('score-col-ai').style.display = 'flex';
    document.getElementById('match-p1-name').innerHTML = `${getFlagImg(playerTeam.country)} <strong>${escapeHtml(getWorldCupCountryName(playerTeam.country))}</strong><br><small>${escapeHtml(playerTeam.players.map(candidate => candidate.name).join(' / '))}</small>`;
    document.getElementById('match-p2-name').innerHTML = `${getFlagImg(opponentTeam.country)} <strong>${escapeHtml(getWorldCupCountryName(opponentTeam.country))}</strong><br><small>${escapeHtml(opponentTeam.players.map(candidate => candidate.name).join(' / '))}</small>`;
    document.getElementById('match-title').innerText = `🏆 ${trWorldCup('matchTitle', { tournament: getWorldCupTournamentDisplayName(), round: getWorldCupRoundLabel(), legs: format.legsToWin })}`;
    document.getElementById('score-photo-p1').src = getWorldCupFlagUrl(playerTeam.country);
    document.getElementById('score-photo-p2').src = getWorldCupFlagUrl(opponentTeam.country);
    document.getElementById('score-photo-p1').classList.add('world-cup-flag-photo');
    document.getElementById('score-photo-p2').classList.add('world-cup-flag-photo');
    document.getElementById('t-btn-sim-leg').style.display = '';
    document.getElementById('t-btn-sim-match').style.display = '';
    updateScores();
    updateMatchStatsUI();
    setTurnUI();
    showScreen('screen-match');
    logThrow(`🌍 ${getWorldCupTeamLabel(playerTeam)} vs ${getWorldCupTeamLabel(opponentTeam)}`, 'system');
}

function finishWorldCupMatch() {
    const match = getWorldCupPendingMatch();
    if (!match || !currentMatch) return;
    const playerWon = currentMatch.p1Legs > currentMatch.p2Legs;
    const playerTeamAverage = getPlayedWorldCupAverage(true);
    const opponentTeamAverage = getPlayedWorldCupAverage(false);
    recordWorldCupTeamAverage(currentMatch.worldCupTeamP1, playerTeamAverage);
    recordWorldCupTeamAverage(currentMatch.worldCupTeamP2, opponentTeamAverage);
    if (playerTeamAverage !== null && typeof recordCareerBestAverage === 'function') {
        recordCareerBestAverage(playerTeamAverage);
    }
    if (typeof checkAchievements === 'function') checkAchievements('stats');
    const p1WasOriginallyFirst = match.team1Id === currentMatch.worldCupTeamP1.id;
    const score1 = p1WasOriginallyFirst ? currentMatch.p1Legs : currentMatch.p2Legs;
    const score2 = p1WasOriginallyFirst ? currentMatch.p2Legs : currentMatch.p1Legs;
    finishWorldCupStateMatch(match, playerWon ? currentMatch.worldCupTeamP1.id : currentMatch.worldCupTeamP2.id, score1, score2);
    currentMatch = null;
    document.getElementById('t-btn-sim-leg').style.display = '';
    document.getElementById('t-btn-sim-match').style.display = '';
    advanceWorldCup();
    saveGame(true);
}

function finishWorldCupTournament(winner) {
    worldCupState.phase = 'completed';
    worldCupState.completed = true;
    if (activeTournament) {
        activeTournament.completed = true;
        activeTournament.worldCupWinner = {
            country: winner.country,
            players: winner.players.map(candidate => candidate.name)
        };
        activeTournament.historyLogs = buildWorldCupTournamentHistory(winner);
        if (typeof recordWorldNewsTeamTitle === 'function') recordWorldNewsTeamTitle(winner, activeTournament);
    }
    const careerPlayerWon = teamContainsCareerPlayer(winner);
    if (careerPlayerWon) {
        initCareerStats();
        player.careerStats.trophies.push(WORLD_CUP_TOURNAMENT_NAME);
        addCareerChronicleEvent('trophy', { tournament: WORLD_CUP_TOURNAMENT_NAME, prize: WORLD_CUP_PRIZES.winner / 2 });
        checkAchievements('tour_win', WORLD_CUP_TOURNAMENT_NAME);
    }
    if (!isFastForwardingWorldCup) {
        alert(careerPlayerWon
            ? trWorldCup('winnerAlert', { tournament: getWorldCupTournamentDisplayName(), country: getWorldCupCountryName(winner.country) })
            : trWorldCup('otherWinnerAlert', { tournament: getWorldCupTournamentDisplayName(), country: getWorldCupCountryName(winner.country) }));
    }
    activeTournament = null;
    const bracketModal = document.getElementById('bracket-modal');
    if (bracketModal) bracketModal.style.display = 'none';
    const tile = document.getElementById('tile-tournament');
    if (tile) tile.style.display = 'none';
    updateHub();
    saveGame(true);
    showScreen('screen-hub');
}
