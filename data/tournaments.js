const tournamentDatabase = [
    // --- STYCZEŃ (Miesiąc 0) ---
    { name: "Desert Masters", month: 0, day: 15, endDay: 16, format: "legs", minOvr: 0, city: "Sakhir", country: "Bahrajn", specialType: "worldMasters", worldMastersEvent: "desert" },
    { name: "Arabian Masters", month: 0, day: 19, endDay: 20, format: "legs", minOvr: 0, city: "Rijad", country: "Arabia Saudyjska", specialType: "worldMasters", worldMastersEvent: "arabian" },

    // --- LUTY (Miesiąc 1) ---
    { name: "Pro Players Cup 1", month: 1, day: 3, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 2", month: 1, day: 4, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Global Darts League - Night 1", month: 1, day: 5, city: "Newcastle", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 2", month: 1, day: 12, city: "Antwerpia", country: "Belgia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 3", month: 1, day: 19, city: "Glasgow", country: "Szkocja", minOvr: 0, format: "501" },
    { name: "Continental Tour 1 - Qualifiers", month: 1, day: 18, format: "legs", minOvr: 0, city: "Kraków", country: "Polska", specialType: "continentalQualifier", qualifierFor: "Continental Tour 1" },
    { name: "Continental Tour 1", month: 1, day: 20, endDay: 22, format: "legs", minOvr: 55, city: "Kraków", country: "Polska" },
    { name: "Continental Tour 2 - Qualifiers", month: 1, day: 25, format: "legs", minOvr: 0, city: "Wieze", country: "Belgia", specialType: "continentalQualifier", qualifierFor: "Continental Tour 2" },
    { name: "Global Darts League - Night 4", month: 1, day: 26, city: "Belfast", country: "Irlandia Północna", minOvr: 0, format: "501" },
    { name: "Continental Tour 2", month: 1, day: 27, endDay: 29, format: "legs", minOvr: 55, city: "Wieze", country: "Belgia" },

    // --- MARZEC (Miesiąc 2) ---
    { name: "Global Darts League - Night 5", month: 2, day: 5, city: "Cardiff", country: "Walia", minOvr: 0, format: "501" },
    { name: "British Open", month: 2, day: 6, endDay: 8, format: "legs", minOvr: 0, city: "Minehead", country: "Anglia" },
    { name: "Pro Players Cup 3", month: 2, day: 10, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Pro Players Cup 4", month: 2, day: 11, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Global Darts League - Night 6", month: 2, day: 12, city: "Nottingham", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 3 - Qualifiers", month: 2, day: 9, format: "legs", minOvr: 0, city: "Göttingen", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 3" },
    { name: "Continental Tour 3", month: 2, day: 13, endDay: 15, format: "legs", minOvr: 55, city: "Göttingen", country: "Niemcy" },
    { name: "Continental Tour 4 - Qualifiers", month: 2, day: 17, format: "legs", minOvr: 0, city: "Monachium", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 4" },
    { name: "Continental Tour 4", month: 2, day: 20, endDay: 22, format: "legs", minOvr: 55, city: "Monachium", country: "Niemcy" },
    { name: "Global Darts League - Night 7", month: 2, day: 19, city: "Dublin", country: "Irlandia", minOvr: 0, format: "501" },
    { name: "Continental Tour 5 - Qualifiers", month: 2, day: 24, format: "legs", minOvr: 0, city: "Riesa", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 5" },
    { name: "Continental Tour 5", month: 2, day: 27, endDay: 29, format: "legs", minOvr: 55, city: "Riesa", country: "Niemcy" },
    { name: "Global Darts League - Night 8", month: 2, day: 26, city: "Berlin", country: "Niemcy", minOvr: 0, format: "501" },

    // --- KWIECIEŃ (Miesiąc 3) ---
    { name: "Global Darts League - Night 9", month: 3, day: 2, city: "Manchester", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Pro Players Cup 5", month: 3, day: 7, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 6", month: 3, day: 8, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Global Darts League - Night 10", month: 3, day: 9, city: "Brighton", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 6 - Qualifiers", month: 3, day: 14, format: "legs", minOvr: 0, city: "Sindelfingen", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 6" },
    { name: "Continental Tour 6", month: 3, day: 17, endDay: 19, format: "legs", minOvr: 55, city: "Sindelfingen", country: "Niemcy" },
    { name: "Global Darts League - Night 11", month: 3, day: 16, city: "Rotterdam", country: "Holandia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 12", month: 3, day: 23, city: "Liverpool", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Night 13", month: 3, day: 30, city: "Aberdeen", country: "Szkocja", minOvr: 0, format: "501" },
    
    // --- MAJ (Miesiąc 4) ---
    { name: "Pro Players Cup 7", month: 4, day: 4, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 8", month: 4, day: 5, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Continental Tour 7 - Qualifiers", month: 4, day: 6, format: "legs", minOvr: 0, city: "Graz", country: "Austria", specialType: "continentalQualifier", qualifierFor: "Continental Tour 7" },
    { name: "Global Darts League - Night 14", month: 4, day: 7, city: "Leeds", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 7", month: 4, day: 8, endDay: 10, format: "legs", minOvr: 55, city: "Graz", country: "Austria" },
    { name: "Global Darts League - Night 15", month: 4, day: 14, city: "Birmingham", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Continental Tour 8 - Qualifiers", month: 4, day: 20, format: "legs", minOvr: 0, city: "Leverkusen", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 8" },
    { name: "Continental Tour 8", month: 4, day: 22, endDay: 24, format: "legs", minOvr: 55, city: "Leverkusen", country: "Niemcy" },
    { name: "Global Darts League - Night 16", month: 4, day: 21, city: "Sheffield", country: "Anglia", minOvr: 0, format: "501" },
    { name: "Global Darts League - Play-offs", month: 4, day: 28, city: "Londyn", country: "Anglia", minOvr: 0, format: "501" },

    // --- CZERWIEC (Miesiąc 5) ---
    { name: "Pro Players Cup 9", month: 5, day: 7, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Pro Players Cup 10", month: 5, day: 8, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy" },
    { name: "Kwalifikacje Pucharu Narodów", month: 5, day: 9, endDay: 10, format: "doubles", minOvr: 0, city: "Frankfurt", country: "Niemcy", specialType: "worldCupQualifiers" },
    { name: "Puchar Narodów", month: 5, day: 11, endDay: 14, format: "doubles", minOvr: 0, city: "Frankfurt", country: "Niemcy", specialType: "worldCup" },
    { name: "Continental Tour 9 - Qualifiers", month: 5, day: 18, format: "legs", minOvr: 0, city: "Bratysława", country: "Słowacja", specialType: "continentalQualifier", qualifierFor: "Continental Tour 9" },
    { name: "Continental Tour 9", month: 5, day: 19, endDay: 21, format: "legs", minOvr: 55, city: "Bratysława", country: "Słowacja" },
    { name: "Northern Masters", month: 5, day: 5, endDay: 6, format: "legs", minOvr: 0, city: "Kopenhaga", country: "Dania", specialType: "worldMasters", worldMastersEvent: "northern" },
    { name: "Atlantic Masters", month: 5, day: 25, endDay: 26, format: "legs", minOvr: 0, city: "Nowy Jork", country: "USA", specialType: "worldMasters", worldMastersEvent: "atlantic" },
    { name: "Pro Players Cup 11", month: 5, day: 28, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 12", month: 5, day: 29, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },

    // --- LIPIEC (Miesiąc 6) ---
    { name: "Pro Players Cup 13", month: 6, day: 10, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 14", month: 6, day: 11, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Continental Tour 10 - Qualifiers", month: 6, day: 15, format: "legs", minOvr: 0, city: "Hildesheim", country: "Niemcy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 10" },
    { name: "Continental Tour 10", month: 6, day: 16, endDay: 18, format: "legs", minOvr: 55, city: "Hildesheim", country: "Niemcy" },
    { name: "Global Matchplay", month: 6, day: 22, endDay: 30, format: "legs", minOvr: 65, city: "Blackpool", country: "Anglia" },

    // --- SIERPIEŃ (Miesiąc 7) ---
    { name: "Pro Players Cup 15", month: 7, day: 2, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Pro Players Cup 16", month: 7, day: 3, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Continental Tour 11 - Qualifiers", month: 7, day: 5, format: "legs", minOvr: 0, city: "Antwerpia", country: "Belgia", specialType: "continentalQualifier", qualifierFor: "Continental Tour 11" },
    { name: "Continental Tour 11", month: 7, day: 6, endDay: 8, format: "legs", minOvr: 55, city: "Antwerpia", country: "Belgia" },
    { name: "Aotearoa Masters", month: 7, day: 14, endDay: 15, format: "legs", minOvr: 0, city: "Auckland", country: "Nowa Zelandia", specialType: "worldMasters", worldMastersEvent: "aotearoa" },
    { name: "Southern Masters", month: 7, day: 21, endDay: 22, format: "legs", minOvr: 0, city: "Wollongong", country: "Australia", specialType: "worldMasters", worldMastersEvent: "southern" },
    { name: "Pro Players Cup 17", month: 7, day: 20, format: "legs", minOvr: 0, city: "Milton Keynes", country: "Anglia" },
    { name: "Continental Tour 12 - Qualifiers", month: 7, day: 23, format: "legs", minOvr: 0, city: "Budapeszt", country: "Węgry", specialType: "continentalQualifier", qualifierFor: "Continental Tour 12" },
    { name: "Continental Tour 12", month: 7, day: 24, endDay: 26, format: "legs", minOvr: 55, city: "Budapeszt", country: "Węgry" },

    // --- WRZESIEŃ (Miesiąc 8) ---
    { name: "Pro Players Cup 18", month: 8, day: 1, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 19", month: 8, day: 2, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Global Grand Prix", month: 8, day: 7, endDay: 13, format: "DIDO", minOvr: 65, city: "Leicester", country: "Anglia" },
    { name: "Global Masters Finals Qualifier", month: 8, day: 14, format: "legs", minOvr: 0, city: "Amsterdam", country: "Holandia", specialType: "worldMastersFinalsQualifier" },
    { name: "Continental Tour 13 - Qualifiers", month: 8, day: 15, format: "legs", minOvr: 0, city: "Praga", country: "Czechy", specialType: "continentalQualifier", qualifierFor: "Continental Tour 13" },
    { name: "Global Masters Finals", month: 8, day: 17, endDay: 20, format: "legs", minOvr: 0, city: "Amsterdam", country: "Holandia", specialType: "worldMastersFinals" },
    { name: "Continental Tour 13", month: 8, day: 21, endDay: 23, format: "legs", minOvr: 55, city: "Praga", country: "Czechy" },

    // --- PAŹDZIERNIK (Miesiąc 9) ---
    { name: "Pro Players Cup 20", month: 9, day: 1, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Pro Players Cup 21", month: 9, day: 2, format: "legs", minOvr: 0, city: "Wigan", country: "Anglia" },
    { name: "Continental Tour 14 - Qualifiers", month: 9, day: 8, format: "legs", minOvr: 0, city: "Bazylea", country: "Szwajcaria", specialType: "continentalQualifier", qualifierFor: "Continental Tour 14" },
    { name: "Continental Tour 14", month: 9, day: 9, endDay: 11, format: "legs", minOvr: 55, city: "Bazylea", country: "Szwajcaria" },
    { name: "Continental Tour 15 - Qualifiers", month: 9, day: 15, format: "legs", minOvr: 0, city: "Maastricht", country: "Holandia", specialType: "continentalQualifier", qualifierFor: "Continental Tour 15" },
    { name: "Continental Tour 15", month: 9, day: 16, endDay: 18, format: "legs", minOvr: 55, city: "Maastricht", country: "Holandia" },
    { name: "Pro Players Cup 22", month: 9, day: 24, format: "legs", minOvr: 0, city: "Leicester", country: "Anglia" },
    { name: "Continental Championship", month: 9, day: 28, endDay: 31, format: "legs", minOvr: 60, city: "Dortmund", country: "Niemcy" },

    // --- LISTOPAD (Miesiąc 10) ---
    { name: "Pro Players Cup 23", month: 10, day: 4, format: "legs", minOvr: 0, city: "Barnsley", country: "Anglia" },
    { name: "Pro Players Cup 24", month: 10, day: 5, format: "legs", minOvr: 0, city: "Barnsley", country: "Anglia" },
    { name: "Pro Players Cup 25", month: 10, day: 11, format: "legs", minOvr: 0, city: "Barnsley", country: "Anglia" },
    { name: "Champion's Slam", month: 10, day: 16, endDay: 24, format: "legs", minOvr: 65, city: "Wolverhampton", country: "Anglia" },
    { name: "Pro Players Finals", month: 10, day: 27, endDay: 29, format: "legs", minOvr: 60, city: "Minehead", country: "Anglia" },

    // --- GRUDZIEŃ (Miesiąc 11) ---
    { name: "Global Darts Championship", month: 11, day: 15, endDay: 31, format: "sets", minOvr: 60, city: "Londyn", country: "Anglia" }
];

// --- BAZA OSIĄGNIĘĆ ---
        
