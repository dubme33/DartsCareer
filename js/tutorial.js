const TUTORIAL_VERSION = 1;

const TUTORIAL_CHAPTER_ACTIONS = Object.freeze({
    firstSteps: ['calendar', 'training'],
    hub: ['hub', 'mailbox'],
    training: ['training', 'staff', 'infrastructure'],
    tour: ['calendar', 'planning', 'rankings'],
    match: ['match'],
    economy: ['sponsors', 'shop', 'staff', 'infrastructure', 'lifestyle'],
    world: ['news', 'rivals', 'archive', 'trophy', 'chronicle'],
    saves: ['hub']
});

const TUTORIAL_DESTINATION_HANDLERS = Object.freeze({
    hub: () => showScreen('screen-hub'),
    mailbox: () => showMailbox(),
    training: () => showTrainingScreen(),
    staff: () => showPlayerStaff(),
    infrastructure: () => showCareerInfrastructure(),
    calendar: () => showCalendar(),
    planning: () => showCareerPlanning(),
    rankings: () => showPdcRankings(),
    match: () => showOpponentSelection(),
    sponsors: () => showSponsorsScreen(),
    shop: () => showShopScreen(),
    lifestyle: () => showCareerLifestyle(),
    news: () => showWorldNews(),
    rivals: () => showRivalriesScreen(),
    archive: () => showSeasonArchive(),
    trophy: () => showTrophyRoom(),
    chronicle: () => showCareerChronicle()
});

const TUTORIAL_TEXTS = {
    pl: {
        tileTitle: '🎓 Samouczek',
        tileDesc: 'Poznaj mechaniki gry i wszystkie ekrany kariery.',
        newBadge: 'NOWE', completedBadge: 'GOTOWE',
        title: '🎓 Samouczek',
        intro: 'Rozwijaj rozdziały w dowolnej kolejności. Znajdziesz tu zasady gry, przeznaczenie kafelków i skróty do najważniejszych ekranów.',
        progress: 'Poznano {done}/{total}', tip: 'Wskazówka', back: 'Wróć do Menu',
        welcomeSender: 'Zespół Darts Career',
        welcomeSubject: 'Witaj w Darts Career!',
        welcomeBody: 'Twoja kariera właśnie się rozpoczyna. Jeśli chcesz poznać trening, turnieje, rankingi i pozostałe możliwości, odwiedź kafelek <strong>Samouczek</strong> w menu kariery.',
        welcomeAction: 'Otwórz samouczek',
        destinations: {
            hub: 'Otwórz hub', mailbox: 'Otwórz pocztę', training: 'Otwórz trening', staff: 'Otwórz sztab',
            infrastructure: 'Otwórz bazę i podróże', calendar: 'Otwórz kalendarz', planning: 'Otwórz kwalifikacje i OOM',
            rankings: 'Otwórz bazę graczy', match: 'Otwórz wybór meczu', sponsors: 'Otwórz sponsorów',
            shop: 'Otwórz sklep', lifestyle: 'Otwórz personalizację', news: 'Otwórz wiadomości ze świata',
            rivals: 'Otwórz rywali', archive: 'Otwórz archiwum sezonów', trophy: 'Otwórz salę trofeów',
            chronicle: 'Otwórz kronikę'
        },
        chapters: [
            {
                id: 'firstSteps', icon: '🚀', title: 'Pierwsze kroki',
                summary: 'Na początku skup się na najbliższym turnieju, energii oraz możliwościach rozwoju zawodnika.',
                bullets: [
                    'Sprawdź Kalendarz, aby zobaczyć najbliższe turnieje i kwalifikacje.',
                    'Wykorzystuj trening, ale zostaw energię potrzebną do gry w turniejach.',
                    'Nie musisz otwierać każdego kafelka od razu — większość systemów nabiera znaczenia wraz z rozwojem kariery.',
                    'Gdy nadejdzie dzień turnieju, w hubie pojawi się wyróżniony kafelek wydarzenia.'
                ],
                tip: 'Dobry pierwszy tydzień to sprawdzenie kalendarza, jeden trening i odpoczynek przed ważnym wydarzeniem.'
            },
            {
                id: 'hub', icon: '🏠', title: 'Hub, czas i poczta',
                summary: 'Hub jest centrum kariery. Pokazuje formę zawodnika, finanse, datę oraz wejścia do wszystkich systemów.',
                bullets: [
                    'Przycisk Symuluj 1 Dzień przesuwa kalendarz i zwykle regeneruje energię.',
                    'Górny panel pokazuje OVR, scoring, podwójne, energię, przygotowanie, budżet i cechy dodatkowe.',
                    'Skrzynka zawiera zaproszenia, rozliczenia, informacje o kwalifikacjach i inne ważne komunikaty.',
                    'Licznik przy poczcie pokazuje liczbę nieprzeczytanych wiadomości.'
                ],
                tip: 'Przed przesunięciem dnia sprawdź, czy w hubie nie czeka aktywny turniej albo ważna wiadomość.'
            },
            {
                id: 'training', icon: '🎯', title: 'Trening, energia i przygotowanie',
                summary: 'Rozwój wymaga planowania: sesje zużywają czas oraz energię, a ich skuteczność zależy od kondycji zawodnika.',
                bullets: [
                    'Trening trwa jeden dzień, kosztuje 20 energii i jest ograniczony do dwóch sesji tygodniowo.',
                    'Im mniej energii masz przed sesją, tym mniej XP otrzymasz.',
                    'Scoring i podwójne rozwijają bazowe umiejętności; wytrzymałość, regularność i psychika są osobnymi cechami.',
                    'Sztab, sprzęt i prywatna baza mogą zwiększać skuteczność treningu, regenerację lub przygotowanie.'
                ],
                tip: 'Najbardziej opłacalny trening wykonasz przy wysokiej energii. Trening przy zmęczeniu nadal kosztuje pełny dzień.'
            },
            {
                id: 'tour', icon: '📅', title: 'Kalendarz, kwalifikacje i rankingi',
                summary: 'Turnieje mają różne ścieżki dostępu, formaty, nagrody oraz wpływ na poszczególne rankingi.',
                bullets: [
                    'Kalendarz pokazuje terminy wydarzeń, ich status oraz dostęp do wyników i finansów.',
                    'Karta PDC obowiązuje przez dwa sezony i otwiera dostęp do Pro Touru oraz kwalifikacji kartowiczów.',
                    'Główny Order of Merit korzysta z nagród z dwóch lat, a pozostałe rankingi mają własne okresy i turnieje.',
                    'Kwalifikacje i OOM pokazują prognozowane miejsca, zapewnione awanse i pieniądze, które wkrótce wypadną z rankingu.'
                ],
                tip: 'Sprawdzaj pieniądze do obrony przed planowaniem sezonu — wysoka pozycja może spaść mimo dobrego aktualnego dorobku.'
            },
            {
                id: 'match', icon: '⚔️', title: 'Rozgrywanie meczu',
                summary: 'Podczas swojej kolejki wybierasz sektor i mnożnik, a umiejętności, presja oraz sytuacja w meczu wpływają na rzut.',
                bullets: [
                    'Wybierz numer 1–20 albo Bull, następnie Single, Double lub Treble i rzuć lotką.',
                    'Przy checkoutach musisz zakończyć lega trafieniem podwójnego pola; bust kasuje wynik całego podejścia.',
                    'Momentum, przygotowanie, psychika, regularność i zmęczenie mogą zmieniać skuteczność w meczu bez zmiany bazowego OVR.',
                    'Możesz symulować pojedynczy leg albo cały mecz. Oficjalne spotkania zapisują statystyki i historię kariery.'
                ],
                tip: 'Nie zawsze celuj w T20. Przy końcówkach warto ustawić wygodny double, zwłaszcza ulubione pole zawodnika.'
            },
            {
                id: 'economy', icon: '💷', title: 'Sponsorzy, sprzęt, sztab i baza',
                summary: 'Budżet finansuje rozwój zaplecza, pracowników, podróże i elementy kosmetyczne.',
                bullets: [
                    'Sponsorzy regularni płacą miesięcznie, a partner techniczny może wymagać używania określonych lotek.',
                    'Cele sponsorskie dają premie i mogą poprawić przyszłe oferty bez kar za niepowodzenie.',
                    'Sprzęt kupuje się kolejno poziom po poziomie; wyposażenie z czasem się zużywa.',
                    'Sztab pobiera opłaty za podpis i pensje. Baza oraz lepsza podróż mogą poprawić przygotowanie, regenerację i trening.',
                    'Dom, koszulki, gabloty i oprawa wejścia są kolekcją kosmetyczną i nie zwiększają OVR.'
                ],
                tip: 'Nie wydawaj całego budżetu na jedną rzecz — przed zakupem uwzględnij pensje, utrzymanie bazy i podróż na turniej.'
            },
            {
                id: 'world', icon: '📰', title: 'Świat kariery, rywale i historia',
                summary: 'Kilka ekranów pomaga śledzić wydarzenia, wyniki zawodników i najważniejsze momenty całej kariery.',
                bullets: [
                    'Ze świata darta pokazuje mistrzów, sensacje, młode talenty i zmiany lidera OOM.',
                    'Rywale zapisują oficjalny bilans H2H, ważne spotkania i aktualne serie.',
                    'Archiwum sezonów porównuje kolejne lata, rozwój, wyniki i nagrody roczne.',
                    'Sala Trofeów pokazuje osiągnięcia i wygrane puchary, a Kronika zapisuje ważne chwile kariery.',
                    'Baza graczy otwiera rankingi, profile, statystyki, historię tytułów i porównanie zawodników.'
                ],
                tip: 'Po dużym turnieju zajrzyj do wiadomości ze świata i kroniki — zobaczysz, jak wynik wpłynął na całą karierę.'
            },
            {
                id: 'saves', icon: '💾', title: 'Zapisy gry i mody',
                summary: 'Postęp można zachować w przeglądarce oraz pobrać jako przenośny plik bezpieczeństwa.',
                bullets: [
                    'Zapisz grę przechowuje bieżącą karierę w pamięci przeglądarki, a Wczytaj grę przywraca ostatni zapis.',
                    'Pobierz plik zapisu tworzy kopię JSON, którą można później wgrać w tej lub innej przeglądarce.',
                    'Wgraj Mod przyjmuje paczkę ZIP z nazwami, zdjęciami, muzyką i innymi obsługiwanymi danymi.',
                    'Zdjęcie zawodnika i muzykę walk-on możesz zmienić z poziomu górnego panelu huba.'
                ],
                tip: 'Przed dłuższą przerwą albo dużą aktualizacją pobierz plik zapisu na dysk. To najbezpieczniejsza kopia kariery.'
            }
        ]
    },
    en: {
        tileTitle: '🎓 Tutorial', tileDesc: 'Learn the game mechanics and every career screen.',
        newBadge: 'NEW', completedBadge: 'DONE', title: '🎓 Tutorial',
        intro: 'Open the chapters in any order. They explain the rules, each menu tile and provide shortcuts to important screens.',
        progress: 'Learned {done}/{total}', tip: 'Tip', back: 'Back to Menu',
        welcomeSender: 'Darts Career Team', welcomeSubject: 'Welcome to Darts Career!',
        welcomeBody: 'Your career has just begun. To learn about training, tournaments, rankings and the other options, visit the <strong>Tutorial</strong> tile in the career menu.',
        welcomeAction: 'Open tutorial',
        destinations: {
            hub: 'Open hub', mailbox: 'Open mailbox', training: 'Open training', staff: 'Open staff', infrastructure: 'Open base & travel',
            calendar: 'Open calendar', planning: 'Open qualification & OOM', rankings: 'Open player database', match: 'Open match selection',
            sponsors: 'Open sponsors', shop: 'Open equipment shop', lifestyle: 'Open customisation', news: 'Open world news',
            rivals: 'Open rivals', archive: 'Open season archive', trophy: 'Open trophy room', chronicle: 'Open chronicle'
        },
        chapters: [
            { id: 'firstSteps', icon: '🚀', title: 'First steps', summary: 'Start with the next event, your energy and the most useful ways to develop your player.', bullets: ['Check the Calendar for upcoming tournaments and qualifiers.', 'Use training, but keep enough energy for tournament play.', 'You do not need to open every tile immediately; many systems become more useful as your career grows.', 'When an event is due, a highlighted tournament tile appears in the hub.'], tip: 'A good first week is checking the calendar, completing one training session and resting before an important event.' },
            { id: 'hub', icon: '🏠', title: 'Hub, time and mailbox', summary: 'The hub is your career centre. It shows player condition, finances, the date and every career system.', bullets: ['Simulate 1 Day advances the calendar and normally restores energy.', 'The player panel shows OVR, scoring, doubles, energy, preparation, budget and separate traits.', 'The Mailbox contains invitations, payments, qualification notices and other important messages.', 'The mailbox badge shows how many messages are unread.'], tip: 'Before advancing the day, check for an active tournament or an important new message.' },
            { id: 'training', icon: '🎯', title: 'Training, energy and preparation', summary: 'Development requires planning because training consumes both time and energy.', bullets: ['Training takes one day, costs 20 energy and is limited to two sessions per week.', 'Lower starting energy means less XP from the session.', 'Scoring and doubles are base skills; endurance, consistency and mental toughness are separate traits.', 'Staff, equipment and a private base can improve training, recovery or preparation.'], tip: 'Training is most efficient at high energy. A tired session still consumes a full day.' },
            { id: 'tour', icon: '📅', title: 'Calendar, qualification and rankings', summary: 'Events have different entry routes, formats, prize tables and ranking effects.', bullets: ['The Calendar shows event dates, status, results and financial information.', 'A PDC Tour Card lasts two seasons and unlocks the Pro Tour and card-holder qualifiers.', 'The main Order of Merit uses two years of prize money; other rankings have their own windows and events.', 'Qualification & OOM shows projected fields, secured places and money that will soon expire.'], tip: 'Check money to defend before planning the season; a strong current rank can still fall when old prizes expire.' },
            { id: 'match', icon: '⚔️', title: 'Playing a match', summary: 'Choose a sector and multiplier. Skill, pressure and the match situation determine the outcome of each dart.', bullets: ['Choose 1–20 or a bull target, select Single, Double or Treble, then throw.', 'A checkout must end on a double; a bust cancels the whole visit.', 'Momentum, preparation, mentality, consistency and fatigue can affect match performance without changing base OVR.', 'You can simulate a leg or the full match. Official matches record statistics and career history.'], tip: 'T20 is not always best. Set up a comfortable double, especially your player’s favourite.' },
            { id: 'economy', icon: '💷', title: 'Sponsors, equipment, staff and base', summary: 'Your budget funds career support, travel and cosmetic collections.', bullets: ['Regular sponsors pay monthly; a technical partner may require its darts.', 'Sponsor goals offer bonuses and improve future offers without failure penalties.', 'Equipment is upgraded one tier at a time and wears down over time.', 'Staff charge signing fees and salaries. A base and better travel can improve preparation, recovery and training.', 'Homes, shirts, displays and walk-ons are cosmetic and do not raise OVR.'], tip: 'Keep money available for salaries, base maintenance and tournament travel before making a large purchase.' },
            { id: 'world', icon: '📰', title: 'Career world, rivals and history', summary: 'These screens track the wider darts world and the story of your career.', bullets: ['World News reports champions, upsets, young talents and changes at the top of the OOM.', 'Rivals stores official H2H records, important matches and streaks.', 'Season Archive compares years, development, results and annual awards.', 'The Trophy Room shows achievements and titles; the Chronicle records major career moments.', 'Player Database opens rankings, profiles, statistics, title histories and comparisons.'], tip: 'After a major event, check World News and the Chronicle to see its wider impact.' },
            { id: 'saves', icon: '💾', title: 'Saves and mods', summary: 'Keep progress in the browser or download a portable safety copy.', bullets: ['Save Game stores the current career in the browser; Load Game restores the latest save.', 'Download Save File creates a JSON backup that can be uploaded later.', 'Upload Mod accepts a ZIP with supported names, photos, music and other data.', 'Change your player photo and walk-on music from the top of the hub.'], tip: 'Download a save file before a long break or a major update. It is the safest career backup.' }
        ]
    },
    de: {
        tileTitle: '🎓 Tutorial', tileDesc: 'Lerne die Spielmechaniken und alle Karrierebildschirme kennen.',
        newBadge: 'NEU', completedBadge: 'FERTIG', title: '🎓 Tutorial',
        intro: 'Öffne die Kapitel in beliebiger Reihenfolge. Sie erklären Regeln, Menükacheln und führen zu wichtigen Bildschirmen.',
        progress: 'Gelernt {done}/{total}', tip: 'Tipp', back: 'Zurück zum Menü',
        welcomeSender: 'Darts-Career-Team', welcomeSubject: 'Willkommen bei Darts Career!',
        welcomeBody: 'Deine Karriere beginnt gerade. Informationen zu Training, Turnieren, Ranglisten und weiteren Möglichkeiten findest du in der Kachel <strong>Tutorial</strong> im Karrieremenü.',
        welcomeAction: 'Tutorial öffnen',
        destinations: { hub: 'Hub öffnen', mailbox: 'Postfach öffnen', training: 'Training öffnen', staff: 'Team öffnen', infrastructure: 'Basis & Reisen öffnen', calendar: 'Kalender öffnen', planning: 'Qualifikation & OOM öffnen', rankings: 'Spielerdatenbank öffnen', match: 'Spielauswahl öffnen', sponsors: 'Sponsoren öffnen', shop: 'Ausrüstung öffnen', lifestyle: 'Personalisierung öffnen', news: 'Weltnachrichten öffnen', rivals: 'Rivalen öffnen', archive: 'Saisonarchiv öffnen', trophy: 'Trophäenraum öffnen', chronicle: 'Chronik öffnen' },
        chapters: [
            { id: 'firstSteps', icon: '🚀', title: 'Erste Schritte', summary: 'Konzentriere dich zuerst auf das nächste Turnier, deine Energie und die Entwicklung.', bullets: ['Prüfe den Kalender auf Turniere und Qualifikationen.', 'Nutze Training, behalte aber genug Energie für Turniere.', 'Nicht jede Kachel ist sofort wichtig; viele Systeme wachsen mit der Karriere.', 'Am Veranstaltungstag erscheint eine hervorgehobene Turnierkachel im Hub.'], tip: 'Eine gute erste Woche: Kalender prüfen, einmal trainieren und vor dem wichtigen Termin ausruhen.' },
            { id: 'hub', icon: '🏠', title: 'Hub, Zeit und Postfach', summary: 'Der Hub zeigt Zustand, Finanzen, Datum und alle Karrieresysteme.', bullets: ['1 Tag simulieren verschiebt den Kalender und regeneriert normalerweise Energie.', 'Der Spielerbereich zeigt OVR, Scoring, Doppel, Energie, Vorbereitung, Budget und Eigenschaften.', 'Das Postfach enthält Einladungen, Zahlungen und Qualifikationsmeldungen.', 'Die Zahl an der Kachel zeigt ungelesene Nachrichten.'], tip: 'Prüfe vor dem nächsten Tag aktive Turniere und neue Nachrichten.' },
            { id: 'training', icon: '🎯', title: 'Training, Energie und Vorbereitung', summary: 'Training verbraucht Zeit und Energie und sollte geplant werden.', bullets: ['Eine Einheit dauert einen Tag, kostet 20 Energie und ist zweimal pro Woche möglich.', 'Weniger Startenergie bedeutet weniger XP.', 'Scoring und Doppel sind Basiswerte; Ausdauer, Konstanz und mentale Stärke sind separate Eigenschaften.', 'Team, Ausrüstung und Trainingsbasis können Training, Erholung und Vorbereitung verbessern.'], tip: 'Bei hoher Energie ist Training am effektivsten; auch müdes Training verbraucht einen ganzen Tag.' },
            { id: 'tour', icon: '📅', title: 'Kalender, Qualifikation und Ranglisten', summary: 'Turniere unterscheiden sich bei Zugang, Format, Preisgeld und Ranglistenwirkung.', bullets: ['Der Kalender zeigt Termine, Status, Ergebnisse und Finanzen.', 'Eine PDC Tour Card gilt zwei Saisons und öffnet Pro Tour und Karten-Qualifikationen.', 'Die Haupt-OOM nutzt zwei Jahre Preisgeld; andere Ranglisten haben eigene Zeiträume.', 'Qualifikation & OOM zeigt Prognosen, sichere Plätze und bald verfallendes Preisgeld.'], tip: 'Prüfe zu verteidigendes Preisgeld, bevor du die Saison planst.' },
            { id: 'match', icon: '⚔️', title: 'Ein Match spielen', summary: 'Wähle Segment und Multiplikator; Können, Druck und Spielsituation bestimmen den Wurf.', bullets: ['Wähle 1–20 oder Bull, dann Single, Double oder Treble.', 'Ein Checkout muss auf einem Doppel enden; ein Bust löscht die gesamte Aufnahme.', 'Momentum, Vorbereitung, Mentalität, Konstanz und Müdigkeit beeinflussen die Leistung.', 'Du kannst Leg oder Match simulieren; offizielle Matches speichern Statistiken.'], tip: 'T20 ist nicht immer optimal. Stelle ein angenehmes Doppel, besonders das Lieblingsdoppel.' },
            { id: 'economy', icon: '💷', title: 'Sponsoren, Ausrüstung, Team und Basis', summary: 'Das Budget finanziert Unterstützung, Reisen und kosmetische Sammlungen.', bullets: ['Reguläre Sponsoren zahlen monatlich; Technikpartner können bestimmte Darts verlangen.', 'Sponsorziele bringen Boni und verbessern künftige Angebote ohne Strafe bei Misserfolg.', 'Ausrüstung wird stufenweise verbessert und nutzt sich ab.', 'Teammitglieder kosten Gebühren und Gehalt; Basis und Reisen beeinflussen Vorbereitung und Erholung.', 'Wohnungen, Shirts, Vitrinen und Walk-ons sind rein kosmetisch.'], tip: 'Plane Gehälter, Unterhalt und Reisen ein, bevor du viel Geld ausgibst.' },
            { id: 'world', icon: '📰', title: 'Karrierewelt, Rivalen und Geschichte', summary: 'Diese Bildschirme dokumentieren die Dartswelt und deine Karriere.', bullets: ['Weltnachrichten zeigen Sieger, Überraschungen, Talente und OOM-Führungswechsel.', 'Rivalen speichert offizielle H2H-Bilanzen und Serien.', 'Das Saisonarchiv vergleicht Jahre, Entwicklung und Auszeichnungen.', 'Trophäenraum und Chronik sammeln Erfolge, Titel und wichtige Momente.', 'Die Spielerdatenbank enthält Ranglisten, Profile, Statistiken und Vergleiche.'], tip: 'Prüfe nach einem Major die Weltnachrichten und deine Chronik.' },
            { id: 'saves', icon: '💾', title: 'Spielstände und Mods', summary: 'Speichere im Browser oder lade eine portable Sicherheitskopie herunter.', bullets: ['Spiel speichern sichert die Karriere im Browser; Spiel laden stellt sie wieder her.', 'Spielstand herunterladen erstellt eine JSON-Sicherung.', 'Mod hochladen akzeptiert ZIP-Pakete mit unterstützten Namen, Bildern, Musik und Daten.', 'Foto und Walk-on-Musik lassen sich oben im Hub ändern.'], tip: 'Lade vor einer langen Pause oder großen Aktualisierung einen Spielstand herunter.' }
        ]
    },
    nl: {
        tileTitle: '🎓 Tutorial', tileDesc: 'Leer de spelmechanieken en alle carrièreschermen kennen.',
        newBadge: 'NIEUW', completedBadge: 'KLAAR', title: '🎓 Tutorial',
        intro: 'Open de hoofdstukken in elke gewenste volgorde. Ze leggen regels en tegels uit en linken naar belangrijke schermen.',
        progress: 'Geleerd {done}/{total}', tip: 'Tip', back: 'Terug naar menu',
        welcomeSender: 'Darts Career-team', welcomeSubject: 'Welkom bij Darts Career!',
        welcomeBody: 'Je carrière is net begonnen. Bezoek de tegel <strong>Tutorial</strong> in het carrièremenu voor uitleg over training, toernooien, ranglijsten en andere mogelijkheden.',
        welcomeAction: 'Tutorial openen',
        destinations: { hub: 'Hub openen', mailbox: 'Postvak openen', training: 'Training openen', staff: 'Staf openen', infrastructure: 'Basis & reizen openen', calendar: 'Kalender openen', planning: 'Kwalificatie & OOM openen', rankings: 'Spelersdatabase openen', match: 'Wedstrijdkeuze openen', sponsors: 'Sponsors openen', shop: 'Uitrusting openen', lifestyle: 'Personalisatie openen', news: 'Wereldnieuws openen', rivals: 'Rivalen openen', archive: 'Seizoensarchief openen', trophy: 'Trofeeënkamer openen', chronicle: 'Kroniek openen' },
        chapters: [
            { id: 'firstSteps', icon: '🚀', title: 'Eerste stappen', summary: 'Begin met het volgende evenement, je energie en de ontwikkeling van je speler.', bullets: ['Bekijk de Kalender voor toernooien en kwalificaties.', 'Train, maar houd genoeg energie over voor toernooien.', 'Niet elke tegel is direct nodig; veel systemen worden later belangrijker.', 'Op de dag van een evenement verschijnt een opvallende toernooitegel in de hub.'], tip: 'Een goede eerste week: kalender bekijken, één keer trainen en rusten voor een belangrijk evenement.' },
            { id: 'hub', icon: '🏠', title: 'Hub, tijd en postvak', summary: 'De hub toont conditie, financiën, datum en alle carrièresystemen.', bullets: ['1 dag simuleren verplaatst de kalender en herstelt normaal energie.', 'Het spelerspaneel toont OVR, scoring, dubbels, energie, voorbereiding, budget en eigenschappen.', 'Het Postvak bevat uitnodigingen, betalingen en kwalificatieberichten.', 'De badge toont het aantal ongelezen berichten.'], tip: 'Controleer actieve toernooien en nieuwe berichten voordat je een dag verdergaat.' },
            { id: 'training', icon: '🎯', title: 'Training, energie en voorbereiding', summary: 'Training kost tijd en energie en vraagt daarom planning.', bullets: ['Een training duurt één dag, kost 20 energie en kan twee keer per week.', 'Minder energie bij de start betekent minder XP.', 'Scoring en dubbels zijn basisvaardigheden; uithoudingsvermogen, consistentie en mentale kracht zijn aparte eigenschappen.', 'Staf, uitrusting en een privébasis kunnen training, herstel en voorbereiding verbeteren.'], tip: 'Training is het efficiëntst met veel energie; vermoeide training kost nog steeds een volledige dag.' },
            { id: 'tour', icon: '📅', title: 'Kalender, kwalificatie en ranglijsten', summary: 'Evenementen verschillen in toegang, format, prijzengeld en ranglijsteffect.', bullets: ['De Kalender toont data, status, uitslagen en financiën.', 'Een PDC Tour Card duurt twee seizoenen en geeft toegang tot de Pro Tour en kwalificaties.', 'De hoofd-OOM gebruikt twee jaar prijzengeld; andere ranglijsten hebben eigen perioden.', 'Kwalificatie & OOM toont prognoses, zekere plaatsen en geld dat binnenkort vervalt.'], tip: 'Bekijk te verdedigen prijzengeld voordat je het seizoen plant.' },
            { id: 'match', icon: '⚔️', title: 'Een wedstrijd spelen', summary: 'Kies sector en multiplier; vaardigheid, druk en wedstrijdsituatie bepalen de worp.', bullets: ['Kies 1–20 of Bull en daarna Single, Double of Treble.', 'Een checkout moet eindigen op een dubbel; een bust wist de hele beurt.', 'Momentum, voorbereiding, mentaliteit, consistentie en vermoeidheid beïnvloeden prestaties.', 'Je kunt een leg of wedstrijd simuleren; officiële wedstrijden bewaren statistieken.'], tip: 'T20 is niet altijd optimaal. Zet een prettige dubbel klaar, vooral de favoriete dubbel.' },
            { id: 'economy', icon: '💷', title: 'Sponsors, uitrusting, staf en basis', summary: 'Je budget betaalt ondersteuning, reizen en cosmetische verzamelingen.', bullets: ['Reguliere sponsors betalen maandelijks; een technische partner kan bepaalde darts vereisen.', 'Sponsordoelen geven bonussen en verbeteren toekomstige aanbiedingen zonder straf bij mislukking.', 'Uitrusting wordt per niveau verbeterd en slijt na verloop van tijd.', 'Staf kost tekengeld en salaris; basis en reizen beïnvloeden voorbereiding en herstel.', 'Huizen, shirts, vitrines en walk-ons zijn cosmetisch en verhogen OVR niet.'], tip: 'Reserveer geld voor salarissen, onderhoud en reizen voordat je een grote aankoop doet.' },
            { id: 'world', icon: '📰', title: 'Carrièrewereld, rivalen en geschiedenis', summary: 'Deze schermen volgen de dartwereld en het verhaal van je carrière.', bullets: ['Wereldnieuws meldt kampioenen, verrassingen, talenten en wisselingen aan de OOM-top.', 'Rivalen bewaart officiële H2H-resultaten en reeksen.', 'Het Seizoensarchief vergelijkt jaren, ontwikkeling en prijzen.', 'Trofeeënkamer en Kroniek verzamelen prestaties, titels en belangrijke momenten.', 'De Spelersdatabase bevat ranglijsten, profielen, statistieken en vergelijkingen.'], tip: 'Bekijk na een groot evenement het Wereldnieuws en je Kroniek.' },
            { id: 'saves', icon: '💾', title: 'Opslaan en mods', summary: 'Bewaar voortgang in de browser of download een draagbare veiligheidskopie.', bullets: ['Spel opslaan bewaart de carrière in de browser; Spel laden herstelt de laatste opslag.', 'Opslagbestand downloaden maakt een JSON-back-up.', 'Mod uploaden accepteert ZIP-pakketten met ondersteunde namen, foto’s, muziek en gegevens.', 'Wijzig spelersfoto en walk-onmuziek bovenaan de hub.'], tip: 'Download voor een lange pauze of grote update een opslagbestand.' }
        ]
    }
};

const TUTORIAL_SECTION_IDS = Object.freeze(TUTORIAL_TEXTS.en.chapters.map(chapter => chapter.id));

function getTutorialLanguage() {
    return typeof currentLang === 'string' && TUTORIAL_TEXTS[currentLang] ? currentLang : 'en';
}

function getTutorialText() {
    return TUTORIAL_TEXTS[getTutorialLanguage()];
}

function tutorialFormat(template, values = {}) {
    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function tutorialEscape(value) {
    if (typeof escapeHtml === 'function') return escapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character]);
}

function ensureTutorialState(candidate = typeof player === 'object' ? player : null) {
    if (!candidate || typeof candidate !== 'object') {
        return { version: TUTORIAL_VERSION, opened: false, visitedSections: [], welcomeMailSent: false };
    }
    const previous = candidate.tutorialState && typeof candidate.tutorialState === 'object'
        ? candidate.tutorialState
        : {};
    const visitedSections = Array.isArray(previous.visitedSections)
        ? [...new Set(previous.visitedSections.filter(id => TUTORIAL_SECTION_IDS.includes(id)))]
        : [];
    candidate.tutorialState = {
        version: TUTORIAL_VERSION,
        opened: previous.opened === true,
        visitedSections,
        welcomeMailSent: previous.welcomeMailSent === true
    };
    return candidate.tutorialState;
}

function initializeTutorialForNewCareer() {
    if (typeof player !== 'object' || !player) return null;
    if (player.tutorialState?.welcomeMailSent === true) {
        const existingState = ensureTutorialState(player);
        updateTutorialTile();
        return existingState;
    }
    player.tutorialState = {
        version: TUTORIAL_VERSION,
        opened: false,
        visitedSections: [],
        welcomeMailSent: false
    };
    const state = player.tutorialState;
    if (typeof addEmail === 'function' && !state.welcomeMailSent) {
        const text = getTutorialText();
        addEmail(text.welcomeSender, text.welcomeSubject, text.welcomeBody, { action: 'tutorial' });
        state.welcomeMailSent = true;
    }
    updateTutorialTile();
    return state;
}

function restoreTutorialState() {
    const state = ensureTutorialState();
    updateTutorialTile();
    return state;
}

function getTutorialProgress() {
    const state = ensureTutorialState();
    return { done: state.visitedSections.length, total: TUTORIAL_SECTION_IDS.length };
}

function updateTutorialTile() {
    if (typeof document === 'undefined') return;
    const text = getTutorialText();
    const state = ensureTutorialState();
    const progress = getTutorialProgress();
    const title = document.getElementById('tutorial-tile-title');
    const description = document.getElementById('tutorial-tile-desc');
    const badge = document.getElementById('tutorial-tile-badge');
    if (title) title.textContent = text.tileTitle;
    if (description) {
        description.textContent = state.opened
            ? `${text.tileDesc} ${tutorialFormat(text.progress, progress)}.`
            : text.tileDesc;
    }
    if (badge) {
        badge.textContent = progress.done === progress.total ? text.completedBadge : text.newBadge;
        badge.hidden = state.opened && progress.done !== progress.total;
    }
}

function updateTutorialProgressUI() {
    if (typeof document === 'undefined') return;
    const progress = getTutorialProgress();
    const progressElement = document.getElementById('tutorial-progress');
    if (progressElement) {
        progressElement.textContent = tutorialFormat(getTutorialText().progress, progress);
    }
    updateTutorialTile();
}

function markTutorialSectionVisited(sectionId) {
    if (!TUTORIAL_SECTION_IDS.includes(sectionId)) return false;
    const state = ensureTutorialState();
    if (state.visitedSections.includes(sectionId)) return false;
    state.visitedSections.push(sectionId);
    updateTutorialProgressUI();
    return true;
}

function renderTutorialActionButtons(chapterId, text) {
    const actions = TUTORIAL_CHAPTER_ACTIONS[chapterId] || [];
    if (!actions.length) return '';
    return `<div class="tutorial-links">${actions.map(action => (
        `<button type="button" class="tutorial-link" data-tutorial-action="${tutorialEscape(action)}">${tutorialEscape(text.destinations[action] || action)}</button>`
    )).join('')}</div>`;
}

function renderTutorialScreen() {
    if (typeof document === 'undefined') return;
    const text = getTutorialText();
    const state = ensureTutorialState();
    const title = document.getElementById('tutorial-title');
    const intro = document.getElementById('tutorial-intro');
    const back = document.getElementById('tutorial-back');
    const sections = document.getElementById('tutorial-sections');
    if (title) title.textContent = text.title;
    if (intro) intro.textContent = text.intro;
    if (back) back.textContent = text.back;
    if (!sections) return;

    sections.innerHTML = text.chapters.map(chapter => {
        const visited = state.visitedSections.includes(chapter.id);
        return `<details class="tutorial-section${visited ? ' is-visited' : ''}" data-tutorial-section="${tutorialEscape(chapter.id)}">
            <summary>${tutorialEscape(chapter.icon)} ${tutorialEscape(chapter.title)}</summary>
            <div class="tutorial-section-content">
                <p>${tutorialEscape(chapter.summary)}</p>
                <ul>${chapter.bullets.map(bullet => `<li>${tutorialEscape(bullet)}</li>`).join('')}</ul>
                <p class="tutorial-tip"><strong>${tutorialEscape(text.tip)}:</strong> ${tutorialEscape(chapter.tip)}</p>
                ${renderTutorialActionButtons(chapter.id, text)}
            </div>
        </details>`;
    }).join('');

    sections.querySelectorAll('[data-tutorial-section]').forEach(details => {
        details.addEventListener('toggle', () => {
            if (!details.open) return;
            if (markTutorialSectionVisited(details.dataset.tutorialSection)) {
                details.classList.add('is-visited');
            }
        });
    });
    sections.querySelectorAll('[data-tutorial-action]').forEach(button => {
        button.addEventListener('click', () => openTutorialDestination(button.dataset.tutorialAction));
    });
    updateTutorialProgressUI();
}

function showTutorial() {
    const state = ensureTutorialState();
    state.opened = true;
    renderTutorialScreen();
    updateTutorialTile();
    showScreen('screen-tutorial');
}

function openTutorialDestination(destination) {
    const handler = TUTORIAL_DESTINATION_HANDLERS[destination];
    if (typeof handler !== 'function') return false;
    handler();
    return true;
}

function refreshTutorialTranslations() {
    updateTutorialTile();
    const screen = typeof document !== 'undefined' ? document.getElementById('screen-tutorial') : null;
    if (screen?.classList.contains('active')) renderTutorialScreen();
}

function getTutorialEmailActionHtml(email) {
    if (!email || email.action !== 'tutorial') return '';
    return `<button type="button" class="email-action-button" onclick="showTutorial()">${tutorialEscape(getTutorialText().welcomeAction)}</button>`;
}
