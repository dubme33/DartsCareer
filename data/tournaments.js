const tournamentDatabase = [
    // --- STYCZEŃ (Miesiąc 0) ---
    { name: "Pro Card Trials", month: 0, day: 5, endDay: 11, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia", specialType: "pdcQSchool", cycleStartYear: 2026, cycleEveryYears: 2 },
    { name: "Desert Masters", month: 0, day: 15, endDay: 16, format: "legs", minOvr: 0, city: "Sakhir", country: "Bahrajn", specialType: "worldMasters", worldMastersEvent: "desert" },
    { name: "Arabian Masters", month: 0, day: 19, endDay: 20, format: "legs", minOvr: 0, city: "Rijad", country: "Arabia Saudyjska", specialType: "worldMasters", worldMastersEvent: "arabian" },

    // --- LUTY (Miesiąc 1) ---
    { name: "Global Darts League - Night 1", month: 1, day: 5, city: "Newcastle", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 1", month: 1, day: 9, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 2", month: 1, day: 10, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Global Darts League - Night 2", month: 1, day: 12, city: "Antwerpia", country: "Belgia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 3", month: 1, day: 16, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 4", month: 1, day: 17, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Continental Tour 1 - Qualifiers", month: 1, day: 18, format: "legs", minOvr: 0, city: "Kraków", country: "Polska", specialType: "continentalQualifier", qualifierFor: "Continental Tour 1" },
    { name: "Global Darts League - Night 3", month: 1, day: 19, city: "Glasgow", country: "Szkocja", minOvr: 0, format: "501" },
    { name: "Continental Tour 1", month: 1, day: 20, endDay: 22, format: "legs", minOvr: 55, city: "Kraków", country: "Polska" },
    { name: "Pro Players Cup 5", month: 1, day: 24, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 6", month: 1, day: 25, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Global Darts League - Night 4", month: 1, day: 26, city: "Belfast", country: "Irlandia Północna", minOvr: 0, format: "501" },

    // --- MARZEC (Miesiąc 2) ---
    { name: "Global Darts League - Night 5", month: 2, day: 5, city: "Cardiff", country: "Walia", minOvr: 0, format: "501" },
    { name: "British Open", month: 2, day: 6, endDay: 8, format: "legs", minOvr: 0, city: "Minehead", country: "Anglia" },
    { name: "Continental Tour 2 - Qualifiers", month: 2, day: 11, format: "legs", minOvr: 0, city: "Göttingen", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 2" },
    { name: "Global Darts League - Night 6", month: 2, day: 12, city: "Nottingham", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 2", month: 2, day: 13, endDay: 15, format: "legs", minOvr: 55, city: "Göttingen", country: "Niemcy" },
    { name: "Continental Tour 3 - Qualifiers", month: 2, day: 18, format: "legs", minOvr: 0, city: "Wieze", country: "Belgia", specialType: "continentalQualifier", qualifierFor: "Continental Tour 3" },
    { name: "Global Darts League - Night 7", month: 2, day: 19, city: "Dublin", country: "Irlandia", minOvr: 0, format: "501" },
    { name: "Continental Tour 3", month: 2, day: 20, endDay: 22, format: "legs", minOvr: 55, city: "Wieze", country: "Belgia" },
    { name: "Global Darts League - Night 8", month: 2, day: 26, city: "Berlin", country: "Niemcy", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 7", month: 2, day: 30, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 8", month: 2, day: 31, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },

    // --- KWIECIEŃ (Miesiąc 3) ---
    { name: "Global Darts League - Night 9", month: 3, day: 2, city: "Manchester", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 4 - Qualifiers", month: 3, day: 3, format: "legs", minOvr: 0, city: "Monachium", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 4" },
    { name: "Continental Tour 4", month: 3, day: 4, endDay: 6, format: "legs", minOvr: 55, city: "Monachium", country: "Niemcy" },
    { name: "Global Darts League - Night 10", month: 3, day: 9, city: "Brighton", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 9", month: 3, day: 13, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 10", month: 3, day: 14, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Continental Tour 5 - Qualifiers", month: 3, day: 15, format: "legs", minOvr: 0, city: "Sindelfingen", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 5" },
    { name: "Global Darts League - Night 11", month: 3, day: 16, city: "Rotterdam", country: "Holandia", minOvr: 0, format: "501" },
    { name: "Continental Tour 5", month: 3, day: 17, endDay: 19, format: "legs", minOvr: 55, city: "Sindelfingen", country: "Niemcy" },
    { name: "Global Darts League - Night 12", month: 3, day: 23, city: "Liverpool", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 11", month: 3, day: 27, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 12", month: 3, day: 28, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Global Darts League - Night 13", month: 3, day: 30, city: "Aberdeen", country: "Szkocja", minOvr: 0, format: "501" },
    
    // --- MAJ (Miesiąc 4) ---
    { name: "Pro Players Cup 13", month: 4, day: 4, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 14", month: 4, day: 5, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Continental Tour 6 - Qualifiers", month: 4, day: 6, format: "legs", minOvr: 0, city: "Graz", country: "Austria", specialType: "continentalQualifier", qualifierFor: "Continental Tour 6" },
    { name: "Global Darts League - Night 14", month: 4, day: 7, city: "Leeds", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 6", month: 4, day: 8, endDay: 10, format: "legs", minOvr: 55, city: "Graz", country: "Austria" },
    { name: "Pro Players Cup 15", month: 4, day: 12, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 16", month: 4, day: 13, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Global Darts League - Night 15", month: 4, day: 14, city: "Birmingham", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 17", month: 4, day: 18, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 18", month: 4, day: 19, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Continental Tour 7 - Qualifiers", month: 4, day: 20, format: "legs", minOvr: 0, city: "Riesa", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 7" },
    { name: "Global Darts League - Night 16", month: 4, day: 21, city: "Sheffield", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 7", month: 4, day: 22, endDay: 24, format: "legs", minOvr: 55, city: "Riesa", country: "Niemcy" },
    { name: "Continental Tour 8 - Qualifiers", month: 4, day: 27, format: "legs", minOvr: 0, city: "Kiel", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 8" },
    { name: "Global Darts League - Play-offs", month: 4, day: 28, city: "Londyn", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 8", month: 4, day: 29, endDay: 31, format: "legs", minOvr: 55, city: "Kiel", country: "Niemcy" },

    // --- CZERWIEC (Miesiąc 5) ---
    { name: "Pro Players Cup 19", month: 5, day: 2, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 20", month: 5, day: 3, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Northern Masters", month: 5, day: 5, endDay: 6, format: "legs", minOvr: 0, city: "Kopenhaga", country: "Dania", specialType: "worldMasters", worldMastersEvent: "northern" },
    { name: "Kwalifikacje Pucharu Narodów", month: 5, day: 9, endDay: 10, format: "doubles", minOvr: 0, city: "Frankfurt", country: "Niemcy", specialType: "worldCupQualifiers" },
    { name: "Puchar Narodów", month: 5, day: 11, endDay: 14, format: "doubles", minOvr: 0, city: "Frankfurt", country: "Niemcy", specialType: "worldCup" },
    { name: "Pro Players Cup 21", month: 5, day: 16, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 22", month: 5, day: 17, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Continental Tour 9 - Qualifiers", month: 5, day: 18, format: "legs", minOvr: 0, city: "Bratysława", country: "Słowacja", specialType: "continentalQualifier", qualifierFor: "Continental Tour 9" },
    { name: "Continental Tour 9", month: 5, day: 19, endDay: 21, format: "legs", minOvr: 55, city: "Bratysława", country: "Słowacja" },
    { name: "Atlantic Masters", month: 5, day: 25, endDay: 26, format: "legs", minOvr: 0, city: "Nowy Jork", country: "USA", specialType: "worldMasters", worldMastersEvent: "atlantic" },

    // --- LIPIEC (Miesiąc 6) ---
    { name: "Pro Players Cup 23", month: 6, day: 6, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 24", month: 6, day: 7, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Continental Tour 10 - Qualifiers", month: 6, day: 8, format: "legs", minOvr: 0, city: "Leverkusen", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 10" },
    { name: "Continental Tour 10", month: 6, day: 10, endDay: 12, format: "legs", minOvr: 55, city: "Leverkusen", country: "Niemcy" },
    { name: "Global Matchplay", month: 6, day: 18, endDay: 26, format: "legs", minOvr: 65, city: "Blackpool", country: "Anglia" },
    { name: "Pro Players Cup 25", month: 6, day: 28, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 26", month: 6, day: 29, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },

    // --- SIERPIEŃ (Miesiąc 7) ---
    { name: "Aotearoa Masters", month: 7, day: 14, endDay: 15, format: "legs", minOvr: 0, city: "Auckland", country: "Nowa Zelandia", specialType: "worldMasters", worldMastersEvent: "aotearoa" },
    { name: "Southern Masters", month: 7, day: 21, endDay: 22, format: "legs", minOvr: 0, city: "Wollongong", country: "Australia", specialType: "worldMasters", worldMastersEvent: "southern" },
    { name: "Pro Players Cup 27", month: 7, day: 25, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 28", month: 7, day: 26, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Continental Tour 11 - Qualifiers", month: 7, day: 27, format: "legs", minOvr: 0, city: "Budapeszt", country: "Węgry", specialType: "continentalQualifier", qualifierFor: "Continental Tour 11" },
    { name: "Continental Tour 11", month: 7, day: 28, endDay: 30, format: "legs", minOvr: 55, city: "Budapeszt", country: "Węgry" },

    // --- WRZESIEŃ (Miesiąc 8) ---
    { name: "Continental Tour 12 - Qualifiers", month: 8, day: 3, format: "legs", minOvr: 0, city: "Praga", country: "Czechy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 12" },
    { name: "Continental Tour 12", month: 8, day: 4, endDay: 6, format: "legs", minOvr: 55, city: "Praga", country: "Czechy" },
    { name: "Continental Tour 13 - Qualifiers", month: 8, day: 10, format: "legs", minOvr: 0, city: "Antwerpia", country: "Belgia", specialType: "continentalQualifier", qualifierFor: "Continental Tour 13" },
    { name: "Continental Tour 13", month: 8, day: 11, endDay: 13, format: "legs", minOvr: 55, city: "Antwerpia", country: "Belgia" },
    { name: "Global Masters Finals Qualifier", month: 8, day: 14, format: "legs", minOvr: 0, city: "Amsterdam", country: "Holandia", specialType: "worldMastersFinalsQualifier" },
    { name: "Global Masters Finals", month: 8, day: 17, endDay: 20, format: "legs", minOvr: 0, city: "Amsterdam", country: "Holandia", specialType: "worldMastersFinals" },
    { name: "Pro Players Cup 29", month: 8, day: 22, format: "legs", minOvr: 0, city: "Den Bosch", country: "Holandia" },
    { name: "Pro Players Cup 30", month: 8, day: 23, format: "legs", minOvr: 0, city: "Den Bosch", country: "Holandia" },
    { name: "Global Grand Prix", month: 8, day: 28, endMonth: 9, endDay: 4, format: "DIDO", minOvr: 65, city: "Leicester", country: "Anglia" },

    // --- PAŹDZIERNIK (Miesiąc 9) ---
    { name: "Continental Tour 14 - Qualifiers", month: 9, day: 8, format: "legs", minOvr: 0, city: "Bazylea", country: "Szwajcaria", specialType: "continentalQualifier", qualifierFor: "Continental Tour 14" },
    { name: "Continental Tour 14", month: 9, day: 9, endDay: 11, format: "legs", minOvr: 55, city: "Bazylea", country: "Szwajcaria" },
    { name: "Continental Tour 15 - Qualifiers", month: 9, day: 15, format: "legs", minOvr: 0, city: "Maastricht", country: "Holandia", specialType: "continentalQualifier", qualifierFor: "Continental Tour 15" },
    { name: "Continental Tour 15", month: 9, day: 16, endDay: 18, format: "legs", minOvr: 55, city: "Maastricht", country: "Holandia" },
    { name: "Continental Championship", month: 9, day: 22, endDay: 25, format: "legs", minOvr: 60, city: "Dortmund", country: "Niemcy" },
    { name: "Pro Players Cup 31", month: 9, day: 28, format: "legs", minOvr: 0, city: "Den Bosch", country: "Holandia" },
    { name: "Pro Players Cup 32", month: 9, day: 29, format: "legs", minOvr: 0, city: "Den Bosch", country: "Holandia" },

    // --- LISTOPAD (Miesiąc 10) ---
    { name: "Pro Players Cup 33", month: 10, day: 4, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 34", month: 10, day: 5, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Champion's Gateway", month: 10, day: 6, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia", specialType: "pdcTourCardQualifier", qualifierFor: "Champion's Slam", qualifyingPlaces: 8 },
    { name: "Champion's Slam", month: 10, day: 14, endDay: 22, format: "legs", minOvr: 65, city: "Wolverhampton", country: "Anglia" },
    { name: "Pro Players Finals", month: 10, day: 27, endDay: 29, format: "legs", minOvr: 60, city: "Minehead", country: "Anglia" },

    // --- GRUDZIEŃ (Miesiąc 11) ---
    { name: "Global Darts Championship", month: 11, day: 15, endDay: 31, format: "sets", minOvr: 60, city: "Londyn", country: "Anglia" }
];

const CONTINENTAL_TOUR_2026_QUALIFIER_SCHEDULE = Object.freeze([
    ['Continental Tour 1',  [1, 13], [1, 14], [1, 15], [1, 18]],
    ['Continental Tour 2',  [1, 27], [1, 28], [2, 1],  [2, 2]],
    ['Continental Tour 3',  [2, 3],  [2, 16], [2, 17], [2, 18]],
    ['Continental Tour 4',  [2, 27], [2, 28], [2, 29], [3, 3]],
    ['Continental Tour 5',  [3, 10], [3, 11], [3, 12], [3, 15]],
    ['Continental Tour 6',  [4, 1],  [4, 2],  [4, 3],  [4, 6]],
    ['Continental Tour 7',  [4, 15], [4, 16], [4, 17], [4, 20]],
    ['Continental Tour 8',  [4, 11], [4, 25], [4, 26], [4, 27]],
    ['Continental Tour 9',  [5, 7],  [5, 8],  [5, 15], [5, 18]],
    ['Continental Tour 10', [6, 3],  [6, 4],  [6, 5],  [6, 8]],
    ['Continental Tour 11', [7, 20], [7, 23], [7, 24], [7, 27]],
    ['Continental Tour 12', [7, 31], [8, 1],  [8, 2],  [8, 3]],
    ['Continental Tour 13', [8, 7],  [8, 8],  [8, 9],  [8, 10]],
    ['Continental Tour 14', [9, 5],  [9, 6],  [9, 7],  [9, 8]],
    ['Continental Tour 15', [9, 12], [9, 13], [9, 14], [9, 15]]
]);

const CONTINENTAL_TOUR_QUALIFIER_PATH_DEFINITIONS = Object.freeze([
    ['host', 'Host Nation Qualifier'],
    ['nordicBaltic', 'Nordic & Baltic Qualifier'],
    ['eastEurope', 'East Europe Qualifier'],
    ['card', 'Pro Card Qualifier']
]);

function syncContinentalTourQualificationCalendar(calendar = tournamentDatabase) {
    if (!Array.isArray(calendar)) return calendar;
    const existingQualifiers = calendar.filter(tournament => tournament?.specialType === 'continentalQualifier');
    const reusable = new Map();
    existingQualifiers.forEach(tournament => {
        const path = tournament.qualifierPath || 'card';
        reusable.set(`${tournament.qualifierFor}|${path}`, tournament);
    });

    for (let index = calendar.length - 1; index >= 0; index--) {
        if (calendar[index]?.specialType === 'continentalQualifier') calendar.splice(index, 1);
    }

    CONTINENTAL_TOUR_2026_QUALIFIER_SCHEDULE.forEach(([mainName, ...dates]) => {
        const mainTournament = calendar.find(tournament => tournament.name === mainName);
        if (!mainTournament) return;
        CONTINENTAL_TOUR_QUALIFIER_PATH_DEFINITIONS.forEach(([path, label], pathIndex) => {
            const [month, day] = dates[pathIndex];
            const key = `${mainName}|${path}`;
            const qualifier = reusable.get(key) || {};
            Object.assign(qualifier, {
                name: `${mainName} - ${label}`,
                month,
                day,
                format: 'legs',
                minOvr: 0,
                city: mainTournament.city,
                country: mainTournament.country,
                specialType: 'continentalQualifier',
                qualifierPath: path,
                qualifierFor: mainName,
                completed: qualifier.completed === true,
                historyLogs: typeof qualifier.historyLogs === 'string' ? qualifier.historyLogs : ''
            });
            delete qualifier.endMonth;
            delete qualifier.endDay;
            calendar.push(qualifier);
        });
    });
    calendar.sort((first, second) => first.month - second.month
        || first.day - second.day
        || String(first.name).localeCompare(String(second.name), 'pl'));
    return calendar;
}

syncContinentalTourQualificationCalendar(tournamentDatabase);

// Niezmienny wzorzec służy również do aktualizacji terminarza w starszych zapisach.
// Stan rozegrania i historia turniejów pozostają przy tym nietknięte.
const PDC_2026_CALENDAR_TEMPLATE = tournamentDatabase.map(tournament => ({ ...tournament }));
const PDC_2026_CALENDAR_FIELDS = [
    'name', 'month', 'day', 'endMonth', 'endDay', 'format', 'minOvr', 'city', 'country',
    'specialType', 'worldMastersEvent', 'qualifierFor', 'qualifierPath', 'qualifyingPlaces', 'cycleStartYear', 'cycleEveryYears'
];

function findPdc2026CalendarEntry(calendar, template) {
    return calendar.find(tournament => tournament.name === template.name)
        || calendar.find(tournament => tournament.sourceName === template.name)
        || (template.worldMastersEvent
            ? calendar.find(tournament => tournament.worldMastersEvent === template.worldMastersEvent)
            : null)
        || (template.qualifierFor
            ? calendar.find(tournament => tournament.qualifierFor === template.qualifierFor
                && (!template.qualifierPath || tournament.qualifierPath === template.qualifierPath))
            : null)
        || (template.specialType && ['worldCup', 'worldCupQualifiers', 'worldMastersFinals', 'worldMastersFinalsQualifier', 'pdcQSchool'].includes(template.specialType)
            ? calendar.find(tournament => tournament.specialType === template.specialType)
            : null);
}

function syncPdc2026TournamentCalendar(calendar = tournamentDatabase) {
    if (!Array.isArray(calendar)) return calendar;

    // Stary kwalifikator z systemu kart został zastąpiony pełną, regionalną
    // kwalifikacją 128-osobową bezpośrednio przy grudniowych MŚ.
    for (let index = calendar.length - 1; index >= 0; index--) {
        const tournament = calendar[index];
        if (tournament?.specialType === 'pdcTourCardQualifier'
            && tournament.qualifierFor === 'Global Darts Championship') {
            calendar.splice(index, 1);
        }
    }

    PDC_2026_CALENDAR_TEMPLATE.forEach(template => {
        let tournament = findPdc2026CalendarEntry(calendar, template);
        if (!tournament) {
            tournament = { ...template, completed: false, historyLogs: '' };
            calendar.push(tournament);
            return;
        }

        // Mod z prawdziwymi nazwami przechowuje bazową nazwę w sourceName.
        // Migracja ma poprawić daty i zasady turnieju, ale nie może cofnąć
        // nazwy wyświetlanej ani zerwać odnośnika kwalifikacji do głównej imprezy.
        const hasDisplayNameOverride = tournament.sourceName === template.name
            && tournament.name !== template.name;
        const displayName = hasDisplayNameOverride ? tournament.name : null;
        const displayQualifierFor = hasDisplayNameOverride && template.qualifierFor
            ? tournament.qualifierFor
            : null;

        PDC_2026_CALENDAR_FIELDS.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(template, field)) tournament[field] = template[field];
            else delete tournament[field];
        });

        if (hasDisplayNameOverride) {
            tournament.name = displayName;
            tournament.sourceName = template.name;
            if (template.qualifierFor && displayQualifierFor) {
                tournament.qualifierFor = displayQualifierFor;
            }
        }
    });

    calendar.sort((first, second) => first.month - second.month
        || first.day - second.day
        || String(first.name).localeCompare(String(second.name), 'pl'));
    return calendar;
}

// --- BAZA OSIĄGNIĘĆ ---
        
