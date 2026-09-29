// Brief choices at the start of a career player's visit. Rolled outcomes live
// on the active match, so UI refreshes cannot reroll a pending decision.
const MATCH_INCIDENT_COPY = {
    pl: {
        kicker: 'SYTUACJA W MECZU', scoring: 'punktowanie', doubles: 'podwójne', prof: 'profesjonalizm', pop: 'medialność',
        note: 'Skutek wyboru jest zmienny. Punktowanie i podwójne: ta kolejka. Profesjonalizm i medialność: na stałe.',
        crowd: ['Trybuny podkręcają tempo', 'Głośny doping rozprasza Cię przed podejściem.', 'Odpowiedz tłumowi', 'Wycisz otoczenie'],
        pause: ['Przerwa w rytmie', 'Krótka przerwa wybiła Cię z rytmu.', 'Rzuć od razu', 'Ułóż oddech'],
        rival: ['Rywal trafia wysoką kolejkę', 'Po wysokim wyniku rywala wybierasz, jak odpowiedzieć.', 'Idź po wysoką kolejkę', 'Zagraj spokojnie'],
        checkout: ['Szansa na zamknięcie', 'Masz podejście z szansą na checkout. Jak ustawisz tempo?', 'Skup się na podwójnej', 'Utrzymaj agresję'],
        camera: ['Kamera przy Twoim podejściu', 'Realizator kieruje kamerę prosto na Ciebie.', 'Zagraj pod publiczność', 'Skup się wyłącznie na tarczy'],
        heckler: ['Zaczepka z trybun', 'Jeden z kibiców próbuje wytrącić Cię z równowagi.', 'Odpowiedz z uśmiechem', 'Zignoruj zaczepkę'],
        grip: ['Śliska lotka', 'Lotka nie leży w dłoni tak pewnie jak zwykle.', 'Popraw chwyt i rzuć', 'Poświęć chwilę na osuszenie dłoni'],
        referee: ['Prośba sędziego', 'Sędzia prosi o moment cierpliwości przed kolejnym podejściem.', 'Poczekaj spokojnie', 'Upomnij się o wznowienie'],
        fan_sign: ['Transparent z Twoim imieniem', 'W pierwszym rzędzie widać transparent przygotowany dla Ciebie.', 'Podziękuj gestem kibicom', 'Pozostań w meczowym skupieniu'],
        announcer: ['Wywołanie nazwiska', 'Caller głośno zapowiada Twoje kolejne podejście.', 'Wejdź z energią', 'Zachowaj stały rytuał'],
        lights: ['Zmiana świateł na scenie', 'Światła na chwilę zmieniają ustawienie przy stanowisku.', 'Dostosuj pozycję', 'Rzucaj bez zwłoki'],
        flight: ['Poluzowane piórko', 'Przed podejściem zauważasz, że piórko jednej z lotek lekko się wysunęło.', 'Popraw piórko', 'Zaufaj dotychczasowemu chwytowi'],
        scoreboard: ['Migający ekran wyników', 'Ekran z wynikiem na moment przygasa przed Twoją kolejką.', 'Sprawdź wynik u sędziego', 'Zachowaj tempo i podejdź'],
        opponent_delay: ['Rywal zwleka przy tarczy', 'Rywal nieco dłużej wyciąga lotki, a Ty czekasz przy stanowisku.', 'Poczekaj cierpliwie', 'Poproś o szybsze tempo'],
        dart_check: ['Lotka przy drucie', 'Sędzia sprawdza, po której stronie drutu znalazła się lotka rywala.', 'Przyjmij decyzję sędziego', 'Domagaj się ponownego sprawdzenia'],
        dry_throat: ['Sucho w gardle', 'Przed podejściem czujesz, że potrzebujesz chwili oddechu.', 'Weź łyk wody', 'Rzucaj bez przerwy'],
        shoulder: ['Spięte ramię', 'Ramię jest sztywniejsze niż zwykle po poprzednich kolejkach.', 'Rozluźnij bark', 'Utrzymaj rytm rzutów'],
        silence: ['Nagle zapada cisza', 'Tuż przed rzutem gwar widowni na moment cichnie.', 'Wykorzystaj ciszę', 'Wyobraź sobie doping'],
        familiar_face: ['Znajoma twarz na widowni', 'Wśród kibiców dostrzegasz kogoś, kto mocno Cię wspiera.', 'Odmachnij w stronę trybun', 'Skup wzrok na tarczy'],
        opponent_space: ['Rywal zasłania linię wzroku', 'Po swojej kolejce rywal zatrzymuje się zbyt blisko Twojego pola widzenia.', 'Poproś uprzejmie o miejsce', 'Przesuń się i rzucaj'],
        replay_screen: ['Powtórka na ekranie LED', 'Na wielkim ekranie pojawia się powtórka Twojej poprzedniej kolejki.', 'Rzuć okiem na ekran', 'Patrz tylko na tarczę']
    },
    en: {
        kicker: 'MATCH MOMENT', scoring: 'scoring', doubles: 'doubles', prof: 'professionalism', pop: 'media presence',
        note: 'The outcome varies. Scoring and doubles: this visit. Professionalism and media presence: permanent.',
        crowd: ['The crowd gets louder', 'The noise breaks your concentration before the visit.', 'Feed off the crowd', 'Block out the noise'],
        pause: ['Break in rhythm', 'A short pause has interrupted your rhythm.', 'Throw right away', 'Settle your breathing'],
        rival: ['A big visit from your rival', 'After your opponent scores heavily, you decide how to respond.', 'Go for a big score', 'Stay composed'],
        checkout: ['Checkout chance', 'You have a chance to finish this visit. How do you approach it?', 'Focus on the double', 'Keep attacking'],
        camera: ['The camera is on you', 'The director points the camera straight at you.', 'Play to the crowd', 'Focus only on the board'],
        heckler: ['A heckler in the crowd', 'One spectator is trying to unsettle you.', 'Smile and respond', 'Ignore the heckler'],
        grip: ['Slippery dart', 'The dart does not sit as firmly in your hand as usual.', 'Adjust your grip and throw', 'Take a moment to dry your hand'],
        referee: ['The referee asks you to wait', 'The referee requests a moment before play resumes.', 'Wait patiently', 'Ask to resume play'],
        fan_sign: ['A sign with your name', 'A fan in the front row has made a sign just for you.', 'Acknowledge the fans', 'Stay focused on the match'],
        announcer: ['Your name is called', 'The caller loudly announces your next visit.', 'Step up with energy', 'Keep your usual routine'],
        lights: ['The stage lights shift', 'The lighting briefly changes around the oche.', 'Adjust your position', 'Throw without delay'],
        flight: ['Loose flight', 'You notice that one dart flight has come slightly loose before your visit.', 'Fix the flight', 'Trust your usual grip'],
        scoreboard: ['Flickering scoreboard', 'The scoreboard briefly dims before your visit.', 'Check the score with the referee', 'Keep your pace and step up'],
        opponent_delay: ['Opponent lingers at the board', 'Your opponent takes a little longer to collect their darts.', 'Wait patiently', 'Ask for a quicker pace'],
        dart_check: ['Dart on the wire', 'The referee checks which side of the wire your opponent’s dart landed on.', 'Accept the referee’s call', 'Insist on another check'],
        dry_throat: ['Dry throat', 'You feel like you need a moment to breathe before stepping up.', 'Take a sip of water', 'Throw without a pause'],
        shoulder: ['Tight shoulder', 'Your throwing arm feels stiffer than usual after the previous visits.', 'Loosen your shoulder', 'Keep your throwing rhythm'],
        silence: ['Sudden silence', 'The crowd falls quiet for a moment just before your throw.', 'Use the silence', 'Imagine the cheers'],
        familiar_face: ['A familiar face in the crowd', 'You spot someone in the crowd who is cheering you on.', 'Wave back', 'Keep your eyes on the board'],
        opponent_space: ['Opponent in your sightline', 'After their visit, your opponent stops too close to your line of sight.', 'Politely ask for space', 'Move aside and throw'],
        replay_screen: ['Replay on the LED screen', 'The big screen shows a replay of your previous visit.', 'Glance at the screen', 'Keep your eyes on the board']
    },
    de: {
        kicker: 'MOMENT IM MATCH', scoring: 'Scoring', doubles: 'Doppel', prof: 'Professionalität', pop: 'Medienpräsenz',
        note: 'Das Ergebnis variiert. Scoring und Doppel: nur diese Aufnahme. Professionalität und Medienpräsenz: dauerhaft.',
        crowd: ['Die Menge wird lauter', 'Der Lärm stört deine Konzentration vor dem Wurf.', 'Nutze die Stimmung', 'Blende den Lärm aus'],
        pause: ['Rhythmus unterbrochen', 'Eine kurze Pause hat dich aus dem Rhythmus gebracht.', 'Sofort werfen', 'Ruhig durchatmen'],
        rival: ['Starke Aufnahme des Gegners', 'Nach dem hohen Ergebnis deines Gegners entscheidest du, wie du reagierst.', 'Hohes Ergebnis anvisieren', 'Ruhig bleiben'],
        checkout: ['Chance zum Finish', 'Du kannst in diesem Durchgang ausmachen. Wie gehst du vor?', 'Auf das Doppel konzentrieren', 'Weiter angreifen'],
        camera: ['Die Kamera ist auf dich gerichtet', 'Die Regie zeigt jetzt deine Aufnahme.', 'Für das Publikum spielen', 'Nur auf das Board achten'],
        heckler: ['Zwischenruf aus dem Publikum', 'Ein Zuschauer versucht, dich aus der Ruhe zu bringen.', 'Mit einem Lächeln reagieren', 'Den Zwischenruf ignorieren'],
        grip: ['Rutschiger Dart', 'Der Dart liegt nicht so sicher in der Hand wie sonst.', 'Griff anpassen und werfen', 'Hand kurz abtrocknen'],
        referee: ['Bitte des Schiedsrichters', 'Der Schiedsrichter bittet vor der nächsten Aufnahme um Geduld.', 'Geduldig warten', 'Um Fortsetzung bitten'],
        fan_sign: ['Schild mit deinem Namen', 'Ein Fan in der ersten Reihe hält ein Schild für dich hoch.', 'Den Fans zuwinken', 'Auf das Match konzentrieren'],
        announcer: ['Dein Name wird aufgerufen', 'Der Caller kündigt deine nächste Aufnahme laut an.', 'Mit Energie antreten', 'Beim Ritual bleiben'],
        lights: ['Wechselndes Bühnenlicht', 'Das Licht am Oche ändert sich kurz.', 'Position anpassen', 'Ohne Pause werfen'],
        flight: ['Lockeres Flight', 'Vor deiner Aufnahme bemerkst du, dass sich ein Flight leicht gelöst hat.', 'Flight befestigen', 'Dem gewohnten Griff vertrauen'],
        scoreboard: ['Flackernde Anzeigetafel', 'Die Ergebnisanzeige wird vor deiner Aufnahme kurz dunkel.', 'Spielstand beim Schiedsrichter prüfen', 'Im eigenen Tempo antreten'],
        opponent_delay: ['Gegner bleibt am Board', 'Dein Gegner braucht etwas länger, um die Darts zu holen.', 'Geduldig warten', 'Um schnelleres Spiel bitten'],
        dart_check: ['Dart am Draht', 'Der Schiedsrichter prüft, auf welcher Seite des Drahts der Dart des Gegners steckt.', 'Entscheidung akzeptieren', 'Weitere Prüfung verlangen'],
        dry_throat: ['Trockener Hals', 'Vor deiner Aufnahme brauchst du einen Moment zum Durchatmen.', 'Einen Schluck Wasser trinken', 'Ohne Pause werfen'],
        shoulder: ['Verspannte Schulter', 'Dein Wurfarm fühlt sich nach den letzten Aufnahmen steifer an.', 'Schulter lockern', 'Wurfrhythmus beibehalten'],
        silence: ['Plötzliche Stille', 'Kurz vor deinem Wurf wird es im Publikum für einen Moment still.', 'Die Stille nutzen', 'Dir den Jubel vorstellen'],
        familiar_face: ['Vertrautes Gesicht im Publikum', 'Du entdeckst jemanden im Publikum, der dich besonders anfeuert.', 'Zurückwinken', 'Auf das Board schauen'],
        opponent_space: ['Gegner im Sichtfeld', 'Nach seiner Aufnahme bleibt der Gegner zu nah an deiner Blicklinie stehen.', 'Höflich um Platz bitten', 'Ausweichen und werfen'],
        replay_screen: ['Wiederholung auf dem LED-Bildschirm', 'Auf der großen Leinwand läuft eine Wiederholung deiner letzten Aufnahme.', 'Kurz hinschauen', 'Nur auf das Board schauen']
    },
    nl: {
        kicker: 'MOMENT IN DE WEDSTRIJD', scoring: 'scoren', doubles: 'dubbels', prof: 'professionaliteit', pop: 'media-aandacht',
        note: 'De uitkomst varieert. Scoren en dubbels: alleen deze beurt. Professionaliteit en media-aandacht: blijvend.',
        crowd: ['Het publiek wordt luider', 'Het lawaai verstoort je concentratie voor je beurt.', 'Gebruik de sfeer', 'Sluit het lawaai buiten'],
        pause: ['Ritme onderbroken', 'Een korte pauze heeft je uit je ritme gehaald.', 'Gooi meteen', 'Haal rustig adem'],
        rival: ['Hoge beurt van de tegenstander', 'Na de hoge score van je tegenstander bepaal je je reactie.', 'Ga voor een hoge score', 'Blijf beheerst'],
        checkout: ['Kans op een finish', 'Je kunt deze beurt uitgooien. Welke aanpak kies je?', 'Focus op de dubbel', 'Blijf aanvallen'],
        camera: ['De camera staat op jou', 'De regisseur richt de camera op je beurt.', 'Speel voor het publiek', 'Focus alleen op het bord'],
        heckler: ['Een roeper in het publiek', 'Een toeschouwer probeert je uit je concentratie te halen.', 'Reageer met een glimlach', 'Negeer de roeper'],
        grip: ['Gladde dart', 'De dart ligt minder stevig in je hand dan normaal.', 'Pas je grip aan en gooi', 'Droog je hand even af'],
        referee: ['Verzoek van de scheidsrechter', 'De scheidsrechter vraagt even geduld voor het spel hervat.', 'Wacht geduldig', 'Vraag om door te spelen'],
        fan_sign: ['Een bord met jouw naam', 'Een fan op de eerste rij heeft een bord voor je gemaakt.', 'Bedank de fans met een gebaar', 'Blijf bij de wedstrijd'],
        announcer: ['Je naam wordt omgeroepen', 'De caller kondigt je volgende beurt luid aan.', 'Stap vol energie naar voren', 'Houd je vaste routine aan'],
        lights: ['Veranderend podiumlicht', 'Het licht rond de oche verandert even.', 'Pas je positie aan', 'Gooi meteen'],
        flight: ['Losse flight', 'Voor je beurt merk je dat een flight iets loszit.', 'Zet de flight vast', 'Vertrouw op je gewone grip'],
        scoreboard: ['Flikkerend scorebord', 'Het scorebord valt vlak voor je beurt even weg.', 'Controleer de stand bij de scheidsrechter', 'Houd je tempo aan'],
        opponent_delay: ['Tegenstander blijft bij het bord', 'Je tegenstander neemt wat langer de tijd om de darts te pakken.', 'Wacht geduldig', 'Vraag om meer tempo'],
        dart_check: ['Dart tegen de draad', 'De scheidsrechter bekijkt aan welke kant van de draad de dart van je tegenstander zit.', 'Accepteer de beslissing', 'Eis een tweede controle'],
        dry_throat: ['Droge keel', 'Voor je beurt heb je even behoefte om op adem te komen.', 'Neem een slok water', 'Gooi zonder pauze'],
        shoulder: ['Stijve schouder', 'Je werparm voelt stijver dan normaal na de vorige beurten.', 'Maak je schouder los', 'Houd je werpritme aan'],
        silence: ['Plotselinge stilte', 'Vlak voor je worp wordt het publiek even stil.', 'Gebruik de stilte', 'Denk aan het gejuich'],
        familiar_face: ['Bekend gezicht in het publiek', 'Je ziet iemand in het publiek die je extra aanmoedigt.', 'Zwaai terug', 'Houd je ogen op het bord'],
        opponent_space: ['Tegenstander in je zichtlijn', 'Na de beurt blijft je tegenstander te dicht bij je zichtlijn staan.', 'Vraag beleefd om ruimte', 'Ga opzij en gooi'],
        replay_screen: ['Herhaling op het ledscherm', 'Het grote scherm toont een herhaling van je vorige beurt.', 'Kijk even naar het scherm', 'Kijk alleen naar het bord']
    }
};

// Three plausible outcomes per choice. Throwing modifiers last for one visit;
// the much smaller career changes persist.
const MATCH_INCIDENT_OUTCOMES = Object.freeze({
    crowd: [
        [{ scoring: 7, doubles: -3, pop: 1 }, { scoring: 3, doubles: 1, pop: 1 }, { scoring: -3, doubles: -2 }],
        [{ scoring: -1, doubles: 6, prof: 1 }, { scoring: 2, doubles: 3 }, { scoring: -2, doubles: 1 }]
    ],
    pause: [
        [{ scoring: 6, doubles: -3 }, { scoring: 3, doubles: 1 }, { scoring: -4, doubles: -2 }],
        [{ scoring: -2, doubles: 7, prof: 1 }, { scoring: 1, doubles: 4 }, { scoring: -3, doubles: 1 }]
    ],
    rival: [
        [{ scoring: 9, doubles: -5, pop: 1 }, { scoring: 5, doubles: -2 }, { scoring: -4, doubles: -4 }],
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 3 }]
    ],
    checkout: [
        [{ scoring: -3, doubles: 9, prof: 1 }, { scoring: 1, doubles: 6 }, { scoring: -4, doubles: 2 }],
        [{ scoring: 7, doubles: -4 }, { scoring: 3, doubles: 2 }, { scoring: -3, doubles: -2 }]
    ],
    camera: [
        [{ scoring: 7, doubles: -4, pop: 1 }, { scoring: 3, doubles: 1, pop: 1 }, { scoring: -4, doubles: -3, pop: -1 }],
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 4, doubles: 1 }, { scoring: -2, doubles: 2 }]
    ],
    heckler: [
        [{ scoring: 6, doubles: -3, pop: 1 }, { scoring: 2, doubles: 1, pop: 1 }, { scoring: -5, doubles: -3, pop: -1 }],
        [{ scoring: 2, doubles: 5, prof: 1 }, { scoring: 4, doubles: 1 }, { scoring: -3, doubles: 1 }]
    ],
    grip: [
        [{ scoring: 6, doubles: -3 }, { scoring: 3, doubles: 1 }, { scoring: -4, doubles: -2 }],
        [{ scoring: -1, doubles: 6, prof: 1 }, { scoring: 2, doubles: 3 }, { scoring: -3, doubles: 1 }]
    ],
    referee: [
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 1 }],
        [{ scoring: 7, doubles: -4 }, { scoring: 3, doubles: -1 }, { scoring: -4, doubles: -3, prof: -1 }]
    ],
    fan_sign: [
        [{ scoring: 6, doubles: -3, pop: 1 }, { scoring: 2, doubles: 2, pop: 1 }, { scoring: -3, doubles: -3 }],
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 4, doubles: 1 }, { scoring: -2, doubles: 2 }]
    ],
    announcer: [
        [{ scoring: 8, doubles: -4, pop: 1 }, { scoring: 4, doubles: 1 }, { scoring: -4, doubles: -2 }],
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 2 }]
    ],
    lights: [
        [{ scoring: 3, doubles: 5, prof: 1 }, { scoring: 4, doubles: 1 }, { scoring: -3, doubles: 1 }],
        [{ scoring: 7, doubles: -4 }, { scoring: 3, doubles: 1 }, { scoring: -5, doubles: -2 }]
    ],
    flight: [
        [{ scoring: 1, doubles: 5, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 1 }],
        [{ scoring: 6, doubles: -4 }, { scoring: 2, doubles: 1 }, { scoring: -5, doubles: -2 }]
    ],
    scoreboard: [
        [{ scoring: -1, doubles: 5, prof: 1 }, { scoring: 2, doubles: 2 }, { scoring: -3, doubles: 1 }],
        [{ scoring: 7, doubles: -3 }, { scoring: 3, doubles: 1 }, { scoring: -4, doubles: -3 }]
    ],
    opponent_delay: [
        [{ scoring: 2, doubles: 5, prof: 1 }, { scoring: 4, doubles: 1 }, { scoring: -3, doubles: 1 }],
        [{ scoring: 7, doubles: -3 }, { scoring: 3, doubles: 1 }, { scoring: -4, doubles: -4, prof: -1 }]
    ],
    dart_check: [
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 1 }],
        [{ scoring: 5, doubles: -3 }, { scoring: 2, doubles: 2 }, { scoring: -4, doubles: -2, prof: -1 }]
    ],
    dry_throat: [
        [{ scoring: 2, doubles: 5 }, { scoring: 4, doubles: 1 }, { scoring: -2, doubles: 1 }],
        [{ scoring: 7, doubles: -3 }, { scoring: 3, doubles: 1 }, { scoring: -5, doubles: -2 }]
    ],
    shoulder: [
        [{ scoring: 2, doubles: 6 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 1 }],
        [{ scoring: 7, doubles: -4 }, { scoring: 4, doubles: 1 }, { scoring: -4, doubles: -3 }]
    ],
    silence: [
        [{ scoring: 4, doubles: 4 }, { scoring: 2, doubles: 3 }, { scoring: -4, doubles: -2 }],
        [{ scoring: 8, doubles: -4 }, { scoring: 3, doubles: 1 }, { scoring: -5, doubles: -3 }]
    ],
    familiar_face: [
        [{ scoring: 6, doubles: -3, pop: 1 }, { scoring: 2, doubles: 2, pop: 1 }, { scoring: -3, doubles: -3 }],
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 1 }]
    ],
    opponent_space: [
        [{ scoring: 2, doubles: 5, prof: 1 }, { scoring: 4, doubles: 1 }, { scoring: -3, doubles: 1 }],
        [{ scoring: 7, doubles: -3 }, { scoring: 3, doubles: 1 }, { scoring: -4, doubles: -3 }]
    ],
    replay_screen: [
        [{ scoring: 6, doubles: -3, pop: 1 }, { scoring: 3, doubles: 2 }, { scoring: -4, doubles: -3 }],
        [{ scoring: 1, doubles: 6, prof: 1 }, { scoring: 3, doubles: 2 }, { scoring: -2, doubles: 1 }]
    ]
});

let matchIncidentResultTimer = null;
const MATCH_STORY_TYPES = Object.freeze(['heckler', 'fan_sign', 'referee', 'opponent_delay', 'opponent_space', 'camera', 'rival']);
const MATCH_STORY_TEXT = {
    pl: { walkon: 'Trybuny pamiętają: {moment}', rematch: 'Kibice pamiętają sytuację „{moment}” z poprzedniego meczu z {opponent}. Początek spotkania ma dodatkowy ładunek emocji.',
        interview: 'Wracając do sytuacji „{moment}” z meczu z {opponent}: czy dzisiaj postąpiłbyś tak samo?', followUp: 'Ta decyzja wróci w wywiadzie, przy następnym spotkaniu z rywalem i w ocenie sponsora.' },
    en: { walkon: 'The crowd remembers: {moment}', rematch: 'The crowd remembers “{moment}” from your last match with {opponent}. The opening visit carries extra pressure.',
        interview: 'About “{moment}” against {opponent}: would you make the same choice again?', followUp: 'This choice can resurface in an interview, your next meeting and sponsor assessment.' },
    de: { walkon: 'Das Publikum erinnert sich: {moment}', rematch: 'Das Publikum erinnert sich an „{moment}“ aus dem letzten Spiel gegen {opponent}. Der Auftakt ist besonders aufgeladen.',
        interview: 'Zur Situation „{moment}“ gegen {opponent}: Würdest du heute wieder so handeln?', followUp: 'Diese Entscheidung kann im Interview, beim nächsten Duell und bei Sponsoren wieder auftauchen.' },
    nl: { walkon: 'Het publiek herinnert zich: {moment}', rematch: 'Het publiek herinnert zich „{moment}” uit je vorige wedstrijd tegen {opponent}. De opening brengt extra spanning.',
        interview: 'Over „{moment}” tegen {opponent}: zou je vandaag weer hetzelfde doen?', followUp: 'Deze keuze kan terugkomen in een interview, de volgende ontmoeting en de beoordeling door sponsors.' }
};
const MATCH_STORY_INTERVIEW_COPY = {
    pl: { title: '🎤 Echo wydarzeń z meczu', calm: 'Postąpiłem najlepiej, jak mogłem. Szanuję rywala i kibiców.',
        lively: 'Tak, zrobiłbym to ponownie. Takie emocje napędzają widowisko.',
        calmResult: 'Spokojna odpowiedź zostaje dobrze przyjęta przez organizatorów.',
        livelyResult: 'Wypowiedź przyciąga uwagę kibiców i mediów.' },
    en: { title: '🎤 A moment revisited', calm: 'I did what felt right. I respect my opponent and the fans.',
        lively: 'Yes, I would do it again. Those moments make the show.',
        calmResult: 'Officials respond well to your measured answer.',
        livelyResult: 'Your answer draws attention from fans and the media.' },
    de: { title: '🎤 Ein Moment wirkt nach', calm: 'Ich habe nach bestem Wissen gehandelt. Ich respektiere Gegner und Fans.',
        lively: 'Ja, ich würde es wieder tun. Solche Momente machen das Spiel aus.',
        calmResult: 'Deine ruhige Antwort kommt bei den Offiziellen gut an.',
        livelyResult: 'Deine Antwort erregt die Aufmerksamkeit von Fans und Medien.' },
    nl: { title: '🎤 Een moment blijft hangen', calm: 'Ik deed wat juist voelde. Ik respecteer mijn tegenstander en de fans.',
        lively: 'Ja, ik zou het opnieuw doen. Zulke momenten maken de wedstrijd.',
        calmResult: 'Officials waarderen je beheerste antwoord.',
        livelyResult: 'Je antwoord trekt de aandacht van fans en media.' }
};

function getMatchStoryText(key, story, language = typeof currentLang === 'string' ? currentLang : 'pl') {
    const lang = language;
    const copy = MATCH_STORY_TEXT[lang] || MATCH_STORY_TEXT.pl;
    const moment = (MATCH_INCIDENT_COPY[lang] || MATCH_INCIDENT_COPY.pl)[story?.type]?.[0] || '';
    return copy[key].replace(/\{moment\}/g, moment).replace(/\{opponent\}/g, story?.opponentName || '');
}

function createMatchStoryInterview(story) {
    if (!story) return null;
    const interview = { choices: [{ effect: { prof: 2, pop: 0 } }, { effect: { prof: -1, pop: 2 } }] };
    for (const lang of ['pl', 'en', 'de', 'nl']) {
        const copy = MATCH_STORY_INTERVIEW_COPY[lang];
        interview[`title_${lang}`] = copy.title;
        interview[`desc_${lang}`] = getMatchStoryText('interview', story, lang);
        interview.choices[0][`text_${lang}`] = copy.calm;
        interview.choices[0][`outcome_${lang}`] = copy.calmResult;
        interview.choices[1][`text_${lang}`] = copy.lively;
        interview.choices[1][`outcome_${lang}`] = copy.livelyResult;
    }
    return interview;
}

function getMatchStories() {
    if (typeof player === 'undefined' || !player) return [];
    if (!Array.isArray(player.matchStories)) player.matchStories = [];
    return player.matchStories;
}

function recordMatchIncidentStory(match, type, choice, effect) {
    if (!match?.isTournament || !match.opponent || !MATCH_STORY_TYPES.includes(type)
        || match.isSpectator || match.isDoubles || typeof player === 'undefined' || !player) return null;
    const stories = getMatchStories();
    const id = (Number(player.matchStoryNextId) || 0) + 1;
    player.matchStoryNextId = id;
    const opponent = match.opponent;
    const sponsorScore = Math.max(-2, Math.min(2, (Number(effect.prof) || 0)
        + (type === 'referee' || type === 'opponent_space' || type === 'opponent_delay' ? (choice === 0 ? 1 : -1) : 0)));
    const story = { id, type, choice, opponentId: opponent.id ?? null, opponentName: String(opponent.name || ''),
        interviewPending: true, rematchPending: true, sponsorPending: true, sponsorScore,
        crowdScore: type === 'heckler' || type === 'fan_sign' || type === 'camera' || type === 'rival'
            ? (choice === 0 ? 2 : -1) : (choice === 0 ? 1 : -2) };
    stories.push(story);
    // Keep saves bounded while retaining every unresolved thread when possible.
    if (stories.length > 32) stories.splice(stories.findIndex(entry => !entry.interviewPending && !entry.rematchPending && !entry.sponsorPending) >= 0
        ? stories.findIndex(entry => !entry.interviewPending && !entry.rematchPending && !entry.sponsorPending) : 0, 1);
    match.matchIncidents.storyId = id;
    return story;
}

function getMatchStoryForInterview(id = null) {
    const stories = getMatchStories();
    return (id == null ? null : stories.find(story => story.id === id && story.interviewPending))
        || stories.find(story => story.interviewPending) || null;
}

function getPendingMatchStoryRematch(opponent) {
    if (!opponent) return null;
    return getMatchStories().find(entry => entry.rematchPending &&
        (entry.opponentId != null && opponent.id != null
            ? String(entry.opponentId) === String(opponent.id)
            : entry.opponentName === opponent.name)) || null;
}

function resolveMatchStoryInterview(story, choice) {
    if (!story?.interviewPending) return false;
    story.interviewPending = false;
    story.sponsorScore = Math.max(-2, Math.min(2, (Number(story.sponsorScore) || 0) + (choice === 0 ? 1 : -1)));
    return true;
}

function takeMatchStorySponsorAssessment() {
    const pending = getMatchStories().filter(story => story.sponsorPending);
    if (!pending.length) return 0;
    pending.forEach(story => { story.sponsorPending = false; });
    return Math.max(-5, Math.min(5, pending.reduce((total, story) => total + (Number(story.sponsorScore) || 0), 0) * 2));
}

function formatMatchStorySponsorAssessment(percent) {
    const number = Number(percent) || 0;
    if (!number) return '';
    const labels = { pl: 'Ocena zachowania w meczu', en: 'Match conduct assessment',
        de: 'Bewertung des Verhaltens im Spiel', nl: 'Beoordeling van wedstrijdgedrag' };
    return `${labels[typeof currentLang === 'string' ? currentLang : 'pl'] || labels.pl}: ${number > 0 ? '+' : ''}${number}%`;
}

function activateMatchStoryRematch(match) {
    if (!match?.opponent || match.isSpectator || match.isDoubles || match.matchStoryRematch) return false;
    const story = getPendingMatchStoryRematch(match.opponent);
    if (!story) return false;
    story.rematchPending = false;
    match.matchStoryRematch = { storyId: story.id, scoring: Number(story.crowdScore) || 0 };
    const message = getMatchStoryText('rematch', story);
    if (typeof logThrow === 'function') logThrow(message, 'system');
    showMatchIncidentResult(message);
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function getMatchIncidentCopy() {
    return MATCH_INCIDENT_COPY[typeof currentLang === 'string' ? currentLang : 'pl'] || MATCH_INCIDENT_COPY.pl;
}

function getMatchIncidentState(match) {
    if (!match.matchIncidents) match.matchIncidents = {
        visitsSeen: 0, shown: 0, lastVisit: -100, lastLeg: -1, lastToken: '', lastType: '', pending: null, effect: null
    };
    return match.matchIncidents;
}

function getMatchIncidentOutcome(type, index, random = Math.random) {
    const variants = MATCH_INCIDENT_OUTCOMES[type]?.[index];
    if (!variants) return null;
    return { ...variants[Math.min(variants.length - 1, Math.floor(random() * variants.length))] };
}

function formatMatchIncidentEffect(effect, copy) {
    const sign = value => value > 0 ? `+${value}` : String(value);
    return ['scoring', 'doubles', 'prof', 'pop']
        .filter(key => Number(effect[key]) !== 0 && Number.isFinite(Number(effect[key])))
        .map(key => `${copy[key]} ${sign(effect[key])}`)
        .join(' · ');
}

function renderMatchIncident(match) {
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('match-incident');
    if (!panel) return;
    const wasHidden = panel.hidden;
    const pending = match && !match.matchEnding && !match.isFinishing
        && Number(match.p1Score) > 0 && Number(match.p2Score) > 0
        ? match.matchIncidents?.pending : null;
    panel.hidden = !pending;
    if (!pending) return;
    const copy = getMatchIncidentCopy();
    const entry = copy[pending.type];
    if (!entry || !MATCH_INCIDENT_OUTCOMES[pending.type]) { panel.hidden = true; return; }
    document.getElementById('match-incident-kicker').textContent = copy.kicker;
    document.getElementById('match-incident-title').textContent = entry[0];
    document.getElementById('match-incident-description').textContent = entry[1];
    document.getElementById('match-incident-duration').textContent = copy.note;
    for (let index = 0; index < 2; index++) {
        const button = document.getElementById(`match-incident-choice-${index}`);
        if (button) button.textContent = entry[index + 2];
    }
    if (wasHidden) document.getElementById('match-incident-choice-0')?.focus?.();
}

function clearMatchIncidentAfterMatch(match) {
    if (match?.matchIncidents) {
        match.matchIncidents.pending = null;
        match.matchIncidents.effect = null;
    }
    if (matchIncidentResultTimer !== null && typeof clearTimeout === 'function') {
        clearTimeout(matchIncidentResultTimer);
        matchIncidentResultTimer = null;
    }
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('match-incident');
    if (panel) panel.hidden = true;
    const result = document.getElementById('match-incident-result');
    if (result) result.hidden = true;
}

function showMatchIncidentResult(message) {
    if (typeof document === 'undefined') return;
    const result = document.getElementById('match-incident-result');
    if (!result) return;
    result.textContent = message;
    result.hidden = false;
    if (matchIncidentResultTimer !== null && typeof clearTimeout === 'function') clearTimeout(matchIncidentResultTimer);
    if (typeof setTimeout === 'function') {
        matchIncidentResultTimer = setTimeout(() => {
            result.hidden = true;
            matchIncidentResultTimer = null;
        }, 4500);
    }
}

function mayShowMatchIncident(match) {
    return Boolean(match && match.vsAI && !match.isSpectator && !match.isFinishing && !match.matchEnding
        && Number(match.p1Score) > 0 && Number(match.p2Score) > 0
        && !match.introInProgress && !match.isTurnLocked && !match.isDartInFlight
        && match.turn === 'p1' && match.dartsThrown === 0
        && (!match.isDoubles || typeof isCareerPlayerThrowing === 'function' && isCareerPlayerThrowing(true))
        && !(typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())
        && !(typeof isFastForwardingTournament === 'function' && isFastForwardingTournament()));
}

function getAvailableMatchIncidentTypes(match) {
    const types = ['crowd', 'pause', 'heckler', 'grip', 'referee', 'fan_sign',
        'flight', 'scoreboard', 'dry_throat', 'shoulder', 'silence', 'familiar_face'];
    const opponentHasVisitedThisLeg = (Number(match.stats?.p2LegDarts) || 0) > 0;
    if (opponentHasVisitedThisLeg) types.push('opponent_delay', 'dart_check', 'opponent_space');
    const stageMatch = typeof window !== 'undefined' && window.matchCrowd?.isStageMatch?.(match,
        typeof activeTournament !== 'undefined' ? activeTournament : null);
    if (stageMatch) types.push('camera', 'announcer', 'lights', 'replay_screen');
    if (opponentHasVisitedThisLeg && (Number(match.lastOpponentVisitScore) || 0) >= 140) types.push('rival');
    if (Number(match.p1Score) <= 170 && Number(match.p1Score) > 1) types.push('checkout');
    return types;
}

function maybeOfferMatchIncident(match, random = Math.random) {
    if (!mayShowMatchIncident(match)) return false;
    activateMatchStoryRematch(match);
    const state = getMatchIncidentState(match);
    if (state.pending) { renderMatchIncident(match); return true; }
    const token = `${match.totalLegsPlayed || 0}:${match.stats?.p1TotalDarts || 0}:${match.stats?.p2TotalDarts || 0}`;
    if (state.lastToken === token) return false;
    state.lastToken = token;
    state.visitsSeen++;
    if (state.visitsSeen < 2 || state.shown >= 3 || state.lastLeg === (match.totalLegsPlayed || 0)
        || state.visitsSeen - state.lastVisit < 4) return false;
    const due = state.shown === 0 ? state.visitsSeen >= 7 : state.visitsSeen - state.lastVisit >= 8;
    if (!due && random() >= 0.16) return false;
    const types = getAvailableMatchIncidentTypes(match);
    const fresh = types.filter(type => type !== state.lastType);
    const pool = fresh.length ? fresh : types;
    const type = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
    state.pending = { type, outcomes: [getMatchIncidentOutcome(type, 0, random), getMatchIncidentOutcome(type, 1, random)] };
    state.shown++;
    state.lastVisit = state.visitsSeen;
    state.lastLeg = match.totalLegsPlayed || 0;
    state.lastType = type;
    renderMatchIncident(match);
    return true;
}

function applyMatchIncidentCareerEffect(effect) {
    const applied = { ...effect };
    if (typeof player === 'undefined' || !player) return applied;
    for (const [key, field, fallback] of [['prof', 'prof', 50], ['pop', 'pop', 20]]) {
        if (!Number.isFinite(Number(effect[key])) || Number(effect[key]) === 0) continue;
        const raw = Number(player[field]);
        const before = Number.isFinite(raw) ? raw : fallback;
        player[field] = Math.max(0, Math.min(100, before + Number(effect[key])));
        applied[key] = player[field] - before;
    }
    return applied;
}

function resolveMatchIncident(choiceIndex) {
    const match = typeof currentMatch !== 'undefined' ? currentMatch : null;
    if (!match || match.matchEnding || match.isFinishing
        || Number(match.p1Score) <= 0 || Number(match.p2Score) <= 0) {
        clearMatchIncidentAfterMatch(match);
        return false;
    }
    const state = match?.matchIncidents;
    const type = state?.pending?.type;
    const index = Number(choiceIndex);
    if (!mayShowMatchIncident(match) || !MATCH_INCIDENT_OUTCOMES[type]
        || !Number.isInteger(index) || index < 0 || index > 1) return false;
    const copy = getMatchIncidentCopy();
    // Older saves may contain a pending choice from before outcomes were stored.
    const rolled = state.pending.outcomes?.[index] || getMatchIncidentOutcome(type, index);
    const effect = applyMatchIncidentCareerEffect(rolled);
    state.pending = null;
    const story = recordMatchIncidentStory(match, type, index, effect);
    state.effect = { scoring: Number(effect.scoring) || 0, doubles: Number(effect.doubles) || 0,
        leg: match.totalLegsPlayed || 0 };
    renderMatchIncident(match);
    const resultText = `${copy[type][index + 2]} · ${formatMatchIncidentEffect(effect, copy)}`
        + (story ? ` · ${getMatchStoryText('followUp', story)}` : '');
    if (typeof logThrow === 'function') logThrow(resultText, 'system');
    showMatchIncidentResult(resultText);
    if ((effect.prof || effect.pop) && typeof updateHub === 'function') updateHub();
    if (typeof setTurnUI === 'function') setTurnUI();
    if (typeof document !== 'undefined') document.getElementById('throw-btn')?.focus?.();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function applyMatchIncidentToStats(match, stats) {
    const effect = match?.matchIncidents?.effect;
    if (!match || match.turn !== 'p1' || match.isSpectator || match.dartsThrown >= 3) return stats;
    const clampStat = value => Math.max(0, Math.min(110, value));
    const incidentActive = effect && effect.leg === (match.totalLegsPlayed || 0);
    const rematch = match.matchStoryRematch && (match.totalLegsPlayed || 0) === 0
        && (Number(match.stats?.p1TotalDarts) || 0) < 3 ? match.matchStoryRematch.scoring : 0;
    if (!incidentActive && !rematch) return stats;
    return { ...stats, scoring: clampStat((Number(stats.scoring) || 0) + (incidentActive ? effect.scoring : 0) + rematch),
        doubles: clampStat((Number(stats.doubles) || 0) + (incidentActive ? effect.doubles : 0)) };
}

function clearMatchIncidentVisit(match) {
    if (match?.matchIncidents) match.matchIncidents.effect = null;
}
