const TUTORIAL_VERSION = 2;

const TUTORIAL_CHAPTER_ACTIONS = Object.freeze({
    firstSteps: ['calendar', 'training'],
    hub: ['hub', 'mailbox'],
    training: ['training', 'staff', 'infrastructure'],
    tour: ['calendar', 'planning', 'rankings'],
    match: ['match'],
    economy: ['sponsors', 'shop', 'staff', 'infrastructure', 'lifestyle'],
    world: ['news', 'rivals', 'archive', 'trophy', 'chronicle'],
    tourPaths: ['calendar', 'planning', 'rankings'],
    broadcast: ['match', 'more'],
    matchMoments: ['match', 'more'],
    identity: ['shop', 'lifestyle', 'playerEditor', 'more'],
    careerChoices: ['more', 'sponsors', 'news'],
    editing: ['playerEditor', 'tournamentEditor', 'worldCupTeams'],
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
    chronicle: () => showCareerChronicle(),
    more: () => { showScreen('screen-hub'); if (typeof selectHubCategory === 'function') selectHubCategory('more'); },
    playerEditor: () => showPlayerEditor(),
    tournamentEditor: () => showTournamentEditor(),
    worldCupTeams: () => showWorldCupTeamEditor()
});

const TUTORIAL_TEXTS = {
    pl: {
        tileTitle: '🎓 Samouczek',
        tileDesc: 'Poznaj mechaniki gry i wszystkie ekrany kariery.',
        newBadge: 'NOWE', updatedBadge: 'NOWOŚCI', completedBadge: 'GOTOWE',
        title: '🎓 Samouczek',
        intro: 'Otwieraj rozdziały w dowolnej kolejności. Poznasz zasady, nowe mechaniki i skróty do ekranów kariery.',
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
            chronicle: 'Otwórz kronikę', more: 'Otwórz opcje', playerEditor: 'Otwórz edytor zawodników',
            tournamentEditor: 'Otwórz edytor turniejów', worldCupTeams: 'Edytuj zespoły World Cup'
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
        newBadge: 'NEW', updatedBadge: 'UPDATED', completedBadge: 'DONE', title: '🎓 Tutorial',
        intro: 'Open chapters in any order to learn the rules, newer mechanics and shortcuts to career screens.',
        progress: 'Learned {done}/{total}', tip: 'Tip', back: 'Back to Menu',
        welcomeSender: 'Darts Career Team', welcomeSubject: 'Welcome to Darts Career!',
        welcomeBody: 'Your career has just begun. To learn about training, tournaments, rankings and the other options, visit the <strong>Tutorial</strong> tile in the career menu.',
        welcomeAction: 'Open tutorial',
        destinations: {
            hub: 'Open hub', mailbox: 'Open mailbox', training: 'Open training', staff: 'Open staff', infrastructure: 'Open base & travel',
            calendar: 'Open calendar', planning: 'Open qualification & OOM', rankings: 'Open player database', match: 'Open match selection',
            sponsors: 'Open sponsors', shop: 'Open equipment shop', lifestyle: 'Open customisation', news: 'Open world news',
            rivals: 'Open rivals', archive: 'Open season archive', trophy: 'Open trophy room', chronicle: 'Open chronicle',
            more: 'Open options', playerEditor: 'Open player editor', tournamentEditor: 'Open tournament editor', worldCupTeams: 'Edit World Cup teams'
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
        newBadge: 'NEU', updatedBadge: 'AKTUALISIERT', completedBadge: 'FERTIG', title: '🎓 Tutorial',
        intro: 'Öffne Kapitel in beliebiger Reihenfolge und entdecke Regeln, neue Mechaniken und wichtige Karrierebildschirme.',
        progress: 'Gelernt {done}/{total}', tip: 'Tipp', back: 'Zurück zum Menü',
        welcomeSender: 'Darts-Career-Team', welcomeSubject: 'Willkommen bei Darts Career!',
        welcomeBody: 'Deine Karriere beginnt gerade. Informationen zu Training, Turnieren, Ranglisten und weiteren Möglichkeiten findest du in der Kachel <strong>Tutorial</strong> im Karrieremenü.',
        welcomeAction: 'Tutorial öffnen',
        destinations: { hub: 'Hub öffnen', mailbox: 'Postfach öffnen', training: 'Training öffnen', staff: 'Team öffnen', infrastructure: 'Basis & Reisen öffnen', calendar: 'Kalender öffnen', planning: 'Qualifikation & OOM öffnen', rankings: 'Spielerdatenbank öffnen', match: 'Spielauswahl öffnen', sponsors: 'Sponsoren öffnen', shop: 'Ausrüstung öffnen', lifestyle: 'Personalisierung öffnen', news: 'Weltnachrichten öffnen', rivals: 'Rivalen öffnen', archive: 'Saisonarchiv öffnen', trophy: 'Trophäenraum öffnen', chronicle: 'Chronik öffnen', more: 'Optionen öffnen', playerEditor: 'Spielereditor öffnen', tournamentEditor: 'Turniereditor öffnen', worldCupTeams: 'World-Cup-Teams bearbeiten' },
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
        newBadge: 'NIEUW', updatedBadge: 'BIJGEWERKT', completedBadge: 'KLAAR', title: '🎓 Tutorial',
        intro: 'Open hoofdstukken in elke gewenste volgorde voor regels, nieuwe functies en snelkoppelingen naar carrièreschermen.',
        progress: 'Geleerd {done}/{total}', tip: 'Tip', back: 'Terug naar menu',
        welcomeSender: 'Darts Career-team', welcomeSubject: 'Welkom bij Darts Career!',
        welcomeBody: 'Je carrière is net begonnen. Bezoek de tegel <strong>Tutorial</strong> in het carrièremenu voor uitleg over training, toernooien, ranglijsten en andere mogelijkheden.',
        welcomeAction: 'Tutorial openen',
        destinations: { hub: 'Hub openen', mailbox: 'Postvak openen', training: 'Training openen', staff: 'Staf openen', infrastructure: 'Basis & reizen openen', calendar: 'Kalender openen', planning: 'Kwalificatie & OOM openen', rankings: 'Spelersdatabase openen', match: 'Wedstrijdkeuze openen', sponsors: 'Sponsors openen', shop: 'Uitrusting openen', lifestyle: 'Personalisatie openen', news: 'Wereldnieuws openen', rivals: 'Rivalen openen', archive: 'Seizoensarchief openen', trophy: 'Trofeeënkamer openen', chronicle: 'Kroniek openen', more: 'Opties openen', playerEditor: 'Spelereditor openen', tournamentEditor: 'Toernooieditor openen', worldCupTeams: 'World Cup-teams bewerken' },
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

// Extra chapters are inserted before Saves, preserving the IDs and progress of
// the original eight chapters in older careers.
const TUTORIAL_NEW_CHAPTERS = {
    pl: [
        {
            id: 'tourPaths', icon: '🏆', title: 'Cykle i turnieje specjalne',
            summary: 'Players Championship, European Tour, Challenge Tour, Development Tour i majory mają różne zasady wejścia.',
            bullets: [
                'Karta PDC otwiera Players Championship; Challenge Tour jest cyklem dla zawodników bez karty, a Development Tour dla uprawnionych młodych graczy. Każdy cykl ma własny ranking.',
                'European Tour ma osobne ścieżki kwalifikacji, m.in. dla gospodarzy. Sprawdź zakładkę kwalifikacji przed dniem wydarzenia.',
                'Do majorów prowadzą rankingi, kwalifikacje lub wyniki innych turniejów. Grand Slam ma fazę grupową, a World Cup rozgrywają reprezentacje.',
                'Możesz oglądać dostępne mecze AI, także w grupach Grand Slam i na World Cup. Gdy nie bierzesz udziału, możesz symulować turniej w tle.',
                'Najwyżej sklasyfikowani zawodnicy mogą sporadycznie odpuścić turnieje Players Championship, Challenge Tour i Development Tour.'
            ],
            tip: 'Przed odpuszczeniem dnia sprawdź w Kalendarzu, czy masz własny mecz lub kwalifikację.'
        },
        {
            id: 'broadcast', icon: '📺', title: 'Rzut na bulla, walk-ony i transmisja',
            summary: 'Przed meczem i podczas gry możesz wybrać sposób oglądania oraz oprawę spotkania.',
            bullets: [
                'Rzut na bulla odbywa się za kulisami przed walk-onami. Bliższa środka lotka daje prawo rozpoczęcia meczu; remis oznacza kolejną próbę.',
                'Plansze walk-onów pokazują zdjęcie, flagę, pseudonim i osiągnięcia. Możesz włączyć ich pełnoekranowy widok lub pominąć wejścia.',
                'Podczas meczu wybieraj widok 2D, 3D lub kamerę pod kątem. Tryb TV dodaje tablicę wyników, drogi checkoutu i transmisyjną oprawę.',
                'Opcje reżysera pozwalają osobno ustawić częstotliwość powtórek i plansz statystycznych, także podczas oglądania meczów AI.',
                'Po oficjalnym meczu dostępny jest raport ze statystykami. W opcjach możesz też osobno dopasować rozmiar tarczy i interfejsu.'
            ],
            tip: 'Jeśli grasz na mniejszym ekranie, dopasuj rozmiary tarczy i panelu w sekcji Więcej.'
        },
        {
            id: 'matchMoments', icon: '🎭', title: 'Nieoczekiwane zdarzenia w meczu',
            summary: 'Rzadkie sytuacje przerywają rutynę meczu i pozwalają zareagować na to, co dzieje się przy tarczy.',
            bullets: [
                'Może pojawić się decyzja dotycząca sprzętu, sędziego, rywala lub koncentracji. Ta sama odpowiedź nie gwarantuje identycznego skutku.',
                'Niektóre wybory zmieniają chwilowo punktowanie lub podwójne, a inne profesjonalizm i medialność. Wybrane sytuacje wracają później jako historia rywalizacji.',
                'Sytuacje związane z publicznością występują tylko w turniejach scenicznych, nie w podłogowych Players Championship ani kwalifikacjach.',
                'Bounce-out i bardzo rzadki Robin Hood nie dają punktów za taką lotkę. Robin Hood wymaga klasycznego shafta i piórka.',
                'W sekcji Więcej możesz wyłączyć wydarzenia meczowe i osobno wyłączyć bounce-outy.'
            ],
            tip: 'Przeczytaj opis decyzji przed wyborem — skutki mogą być różne nawet przy tej samej odpowiedzi.'
        },
        {
            id: 'identity', icon: '🎨', title: 'Tożsamość zawodnika i własne lotki',
            summary: 'Pseudonim, zdjęcie, wejście i wygląd zestawu lotek pomagają nadać karierze własny styl.',
            bullets: [
                'Pseudonim wybierasz przy tworzeniu zawodnika, a później zmieniasz w sekcji Więcej. Widać go na walk-onie i w profilu.',
                'W edytorze zawodników można zmieniać pseudonimy, dane i zdjęcia także innych darterów. Muzykę walk-on można dodać lub zmienić osobno.',
                'W sklepie zbudujesz zestaw lotek: wybierzesz m.in. grip dla przodu, środka i tyłu barrela, jego długość 35–55 mm oraz wagę 12–40 g.',
                'Możesz wybierać piórka i systemy zintegrowane albo wgrać własną grafikę na piórka. Wygląd, rozmiar i waga zestawu nie zmieniają celności.',
                'Koszulki, dom, gabloty i efekty wejścia są ozdobami kariery; nie podnoszą umiejętności zawodnika.'
            ],
            tip: 'Po zakupie części użyj podglądu lotki w sklepie, zanim wybierzesz wygląd całego zestawu.'
        },
        {
            id: 'careerChoices', icon: '🎙️', title: 'Praca, media i konferencje prasowe',
            summary: 'Twoje decyzje poza tarczą wpływają na budżet, profesjonalizm i rozpoznawalność.',
            bullets: [
                'Łączenie darta z pracą daje £2 000 miesięcznie, ale obniża efektywną energię i profesjonalizm o 20. Skupienie się na darcie kosztuje £2 000 miesięcznie bez tych kar.',
                'Sposób utrzymania możesz zmienić w sekcji Więcej. Kara za pracę obowiązuje tylko tak długo, jak wybierasz pracę.',
                'Przed pierwszym meczem majoru odbywa się konferencja przedturniejowa. Po twoich zwycięstwach w majorach i European Tour pojawiają się konferencje pomeczowe.',
                'Dziennikarze pytają o formę, mecz, rywala i znany bilans H2H. Masz cztery odpowiedzi, których wpływ na profesjonalizm i medialność może się różnić.',
                'Zachowanie w wywiadach i wydarzeniach meczowych może wpłynąć na przyszłe oferty sponsorów. Wiadomości o zmianach formy zawodników można ukryć w opcjach.'
            ],
            tip: 'Sprawdzaj miesięczny bilans pracy, pensji sztabu i utrzymania bazy przed większymi zakupami.'
        },
        {
            id: 'editing', icon: '🛠️', title: 'Edytory, kwalifikacje i pakiety turniejów',
            summary: 'Możesz dostosować zawodników, kalendarz, zasady awansu i składy reprezentacji.',
            bullets: [
                'Edytor zawodników pozwala zmieniać dane istniejących graczy i dodawać nowych. Stamtąd otworzysz też edytor turniejów i zespołów World Cup.',
                'Edytor turniejów obsługuje nowe oraz istniejące wydarzenia, ich format, kraj gospodarza i kwalifikacje — także na podstawie kraju zawodnika.',
                'Kwalifikatory można powiązać z turniejami wbudowanymi w grę. Przy zmianie gospodarza European Tour możesz poprawić kwalifikację gospodarzy bez przebudowy całego cyklu.',
                'Pakiet turniejów eksportuje kalendarz, kwalifikatory i zasady do jednego pliku. Przed importem zobaczysz podgląd i wybierzesz, co zrobić z wydarzeniami o tej samej nazwie.',
                'W edytorze World Cup wybierzesz po dwóch zawodników z tego samego kraju; skład będzie użyty w kolejnej edycji turnieju.'
            ],
            tip: 'Przed większą przebudową kalendarza pobierz kopię zapisu gry.'
        }
    ],
    en: [
        {
            id: 'tourPaths', icon: '🏆', title: 'Tours and special events',
            summary: 'Players Championship, European Tour, Challenge Tour, Development Tour and majors have different entry rules.',
            bullets: [
                'A PDC Tour Card opens Players Championship. Challenge Tour is for non-card holders; Development Tour is for eligible young players. Each has its own ranking.',
                'European Tour has separate qualification routes, including host-nation places. Check the qualification tab before an event.',
                'Major places come from rankings, qualifiers or results elsewhere. Grand Slam has groups, while national teams compete at the World Cup.',
                'You can watch eligible AI matches, including Grand Slam groups and the World Cup. Events you do not play can be simulated in the background.',
                'Top-ranked players can occasionally miss Players Championship, Challenge Tour and Development Tour events.'
            ],
            tip: 'Before skipping a day, check the Calendar for your own match or qualifier.'
        },
        {
            id: 'broadcast', icon: '📺', title: 'Bull-off, walk-ons and TV coverage',
            summary: 'Choose how to view the match and its presentation before and during play.',
            bullets: [
                'The bull-off happens backstage before walk-ons. The dart closer to the centre wins the first throw; a tie means another attempt.',
                'Walk-on cards show photos, flags, nicknames and achievements. You can view introductions full screen or skip them.',
                'Choose a 2D, 3D or angled board view. TV mode adds a broadcast scoreboard, checkout routes and presentation.',
                'Director options set replay and statistics-card frequency separately, including when you watch AI matches.',
                'Official matches produce a statistics report. Options also let you size the board and interface independently.'
            ],
            tip: 'On a smaller screen, adjust board and interface sizes in More.'
        },
        {
            id: 'matchMoments', icon: '🎭', title: 'Unexpected match moments',
            summary: 'Rare situations interrupt a match and let you respond to events at the oche.',
            bullets: [
                'Equipment, officials, opponents or concentration may require a decision. The same reply does not guarantee the same outcome.',
                'Choices may briefly change scoring or doubles, or affect professionalism and media presence. Some return later as a rivalry story.',
                'Crowd incidents occur only at stage events, not floor Players Championship matches or qualifiers.',
                'A bounce-out or the extremely rare Robin Hood dart scores nothing. Robin Hood requires a classic shaft and flight.',
                'In More, you can disable match incidents and separately disable bounce-outs.'
            ],
            tip: 'Read the situation before choosing; even a familiar answer can have a different effect.'
        },
        {
            id: 'identity', icon: '🎨', title: 'Player identity and custom darts',
            summary: 'Give your career its own style with a nickname, photo, walk-on and dart setup.',
            bullets: [
                'Choose a nickname when creating your player and change it later in More. It appears on walk-ons and player profiles.',
                'The Player Editor can change other players’ nicknames, details and photos. Walk-on music can be added or changed separately.',
                'Build darts in the shop with grip by barrel section, a 35–55 mm barrel and a weight of 12–40 g.',
                'Choose flights and integrated systems or upload your own flight artwork. Appearance, barrel length and weight do not change accuracy.',
                'Shirts, homes, trophy displays and entrance effects are cosmetic and do not raise skill.'
            ],
            tip: 'Preview parts in the shop before settling on the look of the full set.'
        },
        {
            id: 'careerChoices', icon: '🎙️', title: 'Work, media and press conferences',
            summary: 'Choices away from the board affect your budget, professionalism and public profile.',
            bullets: [
                'Combining darts with a job brings in £2,000 monthly but reduces effective energy and professionalism by 20. Focusing on darts costs £2,000 monthly without those penalties.',
                'Change your career focus in More. The job penalty lasts only while you keep that choice.',
                'There is a press conference before your first match at a major, and another after your wins at majors and European Tour events.',
                'Journalists ask about form, the match, opponents and known head-to-head records. Four replies can affect professionalism and media presence in different ways.',
                'Conduct in interviews and match incidents can affect future sponsor offers. You can hide player form-change news in Options.'
            ],
            tip: 'Check monthly work income, staff wages and base costs before a large purchase.'
        },
        {
            id: 'editing', icon: '🛠️', title: 'Editors, qualifiers and tournament packs',
            summary: 'Customize players, the calendar, qualification rules and national teams.',
            bullets: [
                'The Player Editor changes existing players and adds new ones. It also leads to the Tournament and World Cup Team editors.',
                'The Tournament Editor handles new and existing events, their format, host country and qualification, including country-based entry.',
                'Qualifiers can target built-in events. Change a European Tour host qualifier without rebuilding the whole tour.',
                'A tournament pack exports the calendar, qualifiers and rules to one file. Before importing, preview changes and choose how to handle matching event names.',
                'In the World Cup editor, choose two players from the same country for the next edition.'
            ],
            tip: 'Download a save backup before making major calendar changes.'
        }
    ],
    de: [
        {
            id: 'tourPaths', icon: '🏆', title: 'Touren und besondere Turniere',
            summary: 'Players Championship, European Tour, Challenge Tour, Development Tour und Majors haben unterschiedliche Zugangsregeln.',
            bullets: [
                'Eine PDC Tour Card öffnet Players Championship. Challenge Tour ist für Spieler ohne Karte, Development Tour für berechtigte junge Spieler. Jede Tour hat eine eigene Rangliste.',
                'Die European Tour bietet mehrere Qualifikationswege, darunter Plätze für das Gastgeberland. Prüfe vor dem Turnier die Qualifikationsansicht.',
                'Major-Plätze kommen über Ranglisten, Qualifikationen oder Ergebnisse anderer Turniere. Grand Slam hat Gruppen; beim World Cup spielen Nationalteams.',
                'Du kannst verfügbare KI-Matches ansehen, auch Grand-Slam-Gruppen und World Cup. Turniere ohne deine Teilnahme lassen sich im Hintergrund simulieren.',
                'Hochplatzierte Spieler können Players Championship, Challenge Tour und Development Tour gelegentlich auslassen.'
            ],
            tip: 'Prüfe vor dem Überspringen eines Tages im Kalender deine Matches und Qualifikationen.'
        },
        {
            id: 'broadcast', icon: '📺', title: 'Bullwurf, Walk-ons und TV-Modus',
            summary: 'Bestimme vor und während eines Matches, wie du es siehst und präsentierst.',
            bullets: [
                'Der Bullwurf findet hinter der Bühne vor den Walk-ons statt. Wer näher an der Mitte landet, beginnt; bei Gleichstand wird erneut geworfen.',
                'Walk-on-Karten zeigen Foto, Flagge, Spitzname und Erfolge. Einläufe können im Vollbild gezeigt oder übersprungen werden.',
                'Wähle 2D, 3D oder eine schräge Kamera. Der TV-Modus ergänzt Anzeigetafel, Checkout-Wege und Übertragungsoptik.',
                'In den Regieoptionen stellst du Wiederholungen und Statistikkarten getrennt ein, auch beim Zuschauen von KI-Matches.',
                'Offizielle Matches erzeugen einen Statistikbericht. In Optionen kannst du Board und Bedienfeld getrennt skalieren.'
            ],
            tip: 'Auf kleinen Bildschirmen lassen sich Board und Bedienfeld unter Mehr anpassen.'
        },
        {
            id: 'matchMoments', icon: '🎭', title: 'Unerwartete Matchmomente',
            summary: 'Seltene Situationen unterbrechen das Match und verlangen eine Entscheidung am Oche.',
            bullets: [
                'Ausrüstung, Schiedsrichter, Gegner oder Konzentration können eine Entscheidung erfordern. Dieselbe Antwort hat nicht immer dieselbe Wirkung.',
                'Entscheidungen ändern manchmal kurz Scoring oder Doppel, manchmal Professionalität oder Medienpräsenz. Manche werden später Teil einer Rivalengeschichte.',
                'Publikumssituationen gibt es nur bei Bühnenturnieren, nicht bei Players Championship auf dem Floor oder Qualifikationen.',
                'Bounce-outs und extrem seltene Robin-Hood-Darts zählen nicht. Robin Hood erfordert klassischen Shaft und Flight.',
                'Unter Mehr kannst du Matchereignisse und separat Bounce-outs ausschalten.'
            ],
            tip: 'Lies die Situation vor der Wahl; auch vertraute Antworten können anders wirken.'
        },
        {
            id: 'identity', icon: '🎨', title: 'Spieleridentität und eigene Darts',
            summary: 'Spitzname, Foto, Einlauf und Dart-Set geben deiner Karriere einen eigenen Stil.',
            bullets: [
                'Wähle beim Erstellen einen Spitznamen und ändere ihn später unter Mehr. Er erscheint beim Walk-on und im Spielerprofil.',
                'Im Spielereditor kannst du Spitznamen, Daten und Fotos anderer Spieler ändern. Walk-on-Musik lässt sich separat hinzufügen oder wechseln.',
                'Im Shop wählst du Griffzonen am Barrel, 35–55 mm Länge und ein Gewicht von 12–40 g.',
                'Wähle Flights und integrierte Systeme oder lade ein eigenes Flight-Motiv hoch. Aussehen, Länge und Gewicht ändern die Zielgenauigkeit nicht.',
                'Shirts, Wohnungen, Vitrinen und Einlaufeffekte sind kosmetisch und erhöhen keine Fähigkeiten.'
            ],
            tip: 'Sieh dir Teile im Shop an, bevor du das Aussehen des ganzen Sets festlegst.'
        },
        {
            id: 'careerChoices', icon: '🎙️', title: 'Arbeit, Medien und Pressekonferenzen',
            summary: 'Entscheidungen neben dem Board beeinflussen Budget, Professionalität und Bekanntheit.',
            bullets: [
                'Darts mit einem Beruf zu verbinden bringt monatlich £2.000, senkt aber effektive Energie und Professionalität um 20. Vollzeit-Darts kosten £2.000 monatlich ohne diese Abzüge.',
                'Den Karriereschwerpunkt änderst du unter Mehr. Der Abzug gilt nur, solange du dich für Arbeit entscheidest.',
                'Vor dem ersten Match eines Majors gibt es eine Pressekonferenz; nach deinen Siegen bei Majors und European-Tour-Turnieren ebenfalls.',
                'Journalisten fragen nach Form, Match, Gegner und bekannten Direktduellen. Vier Antworten können Professionalität und Medienpräsenz unterschiedlich verändern.',
                'Verhalten in Interviews und Matchereignissen kann spätere Sponsorenangebote beeinflussen. Formmeldungen über andere Spieler lassen sich ausblenden.'
            ],
            tip: 'Berücksichtige Arbeitseinkommen, Teamgehälter und Basiskosten vor großen Ausgaben.'
        },
        {
            id: 'editing', icon: '🛠️', title: 'Editoren, Qualifikationen und Turnierpakete',
            summary: 'Bearbeite Spieler, Kalender, Qualifikationsregeln und Nationalteams.',
            bullets: [
                'Im Spielereditor bearbeitest du vorhandene Spieler oder fügst neue hinzu. Von dort erreichst du Turniereditor und World-Cup-Teameditor.',
                'Der Turniereditor bearbeitet neue und bestehende Events, Format, Gastgeberland und Qualifikation, auch nach Land.',
                'Qualifikationen können mit eingebauten Events verknüpft werden. Ändere die Gastgeberqualifikation einer European Tour ohne Neubau der ganzen Serie.',
                'Ein Turnierpaket exportiert Kalender, Qualifikationen und Regeln in eine Datei. Vor dem Import siehst du eine Vorschau und entscheidest über gleiche Eventnamen.',
                'Im World-Cup-Editor wählst du zwei Spieler desselben Landes für die nächste Ausgabe.'
            ],
            tip: 'Lade vor größeren Kalenderänderungen eine Sicherung deines Spielstands herunter.'
        }
    ],
    nl: [
        {
            id: 'tourPaths', icon: '🏆', title: 'Tours en speciale toernooien',
            summary: 'Players Championship, European Tour, Challenge Tour, Development Tour en majors hebben andere toelatingsregels.',
            bullets: [
                'Een PDC Tour Card opent Players Championship. Challenge Tour is voor spelers zonder kaart; Development Tour voor geschikte jonge spelers. Elke tour heeft een eigen ranglijst.',
                'European Tour kent verschillende kwalificatieroutes, waaronder plaatsen voor het gastland. Bekijk vooraf de kwalificatiepagina.',
                'Majors gebruiken ranglijsten, kwalificaties of resultaten elders. Grand Slam heeft poules; bij de World Cup spelen landenteams.',
                'Je kunt geschikte AI-wedstrijden bekijken, ook Grand Slam-poules en World Cup. Toernooien zonder jouw deelname kun je op de achtergrond simuleren.',
                'Hooggeplaatste spelers kunnen af en toe Players Championship, Challenge Tour of Development Tour overslaan.'
            ],
            tip: 'Controleer voor het overslaan van een dag je eigen wedstrijden en kwalificaties in de Kalender.'
        },
        {
            id: 'broadcast', icon: '📺', title: 'Bullworp, walk-ons en tv-uitzending',
            summary: 'Kies voor en tijdens een wedstrijd hoe je die bekijkt en presenteert.',
            bullets: [
                'De bullworp gebeurt achter de schermen vóór de walk-ons. De dart het dichtst bij het midden geeft de eerste beurt; bij gelijkstand wordt opnieuw gegooid.',
                'Walk-onkaarten tonen foto, vlag, bijnaam en prestaties. Bekijk de opkomst op volledig scherm of sla haar over.',
                'Kies 2D, 3D of een schuine camera. Tv-modus voegt scorebord, checkoutroutes en een uitzendingstijl toe.',
                'Met regieopties stel je herhalingen en statistiekkaarten apart in, ook bij het bekijken van AI-wedstrijden.',
                'Officiële wedstrijden leveren een statistiekrapport op. In Opties kun je bord en bediening los van elkaar schalen.'
            ],
            tip: 'Pas op kleinere schermen de grootte van bord en bediening aan onder Meer.'
        },
        {
            id: 'matchMoments', icon: '🎭', title: 'Onverwachte wedstrijdmomenten',
            summary: 'Zeldzame situaties onderbreken de wedstrijd en laten je reageren bij de oche.',
            bullets: [
                'Uitrusting, scheidsrechter, tegenstander of concentratie kunnen een keuze vereisen. Dezelfde reactie heeft niet altijd hetzelfde gevolg.',
                'Keuzes veranderen soms tijdelijk scoring of dubbels, soms professionaliteit of mediabereik. Sommige keren later terug in een rivaliteitsverhaal.',
                'Publiekssituaties komen alleen voor bij podiumtoernooien, niet bij Players Championship op de vloer of kwalificaties.',
                'Bounce-outs en uiterst zeldzame Robin Hood-darts leveren geen punten op. Robin Hood vereist een klassieke shaft en flight.',
                'Onder Meer kun je wedstrijdmomenten en afzonderlijk bounce-outs uitschakelen.'
            ],
            tip: 'Lees de situatie vóór je kiest; ook een bekend antwoord kan anders uitpakken.'
        },
        {
            id: 'identity', icon: '🎨', title: 'Speleridentiteit en eigen darts',
            summary: 'Geef je carrière stijl met een bijnaam, foto, opkomst en dartset.',
            bullets: [
                'Kies bij het maken van je speler een bijnaam en wijzig die later onder Meer. Hij verschijnt bij walk-ons en in profielen.',
                'In de Spelereditor kun je bijnamen, gegevens en foto’s van andere spelers wijzigen. Walk-onmuziek kun je apart toevoegen of vervangen.',
                'In de winkel kies je grip per barrelzone, een lengte van 35–55 mm en een gewicht van 12–40 g.',
                'Kies flights en geïntegreerde systemen of upload eigen flightafbeeldingen. Uiterlijk, lengte en gewicht veranderen de nauwkeurigheid niet.',
                'Shirts, huizen, vitrines en opkomsteffecten zijn cosmetisch en verhogen vaardigheden niet.'
            ],
            tip: 'Bekijk onderdelen in de winkel voordat je het uiterlijk van je hele set vastlegt.'
        },
        {
            id: 'careerChoices', icon: '🎙️', title: 'Werk, media en persconferenties',
            summary: 'Keuzes buiten het bord beïnvloeden budget, professionaliteit en bekendheid.',
            bullets: [
                'Darts combineren met werk levert maandelijks £2.000 op, maar verlaagt effectieve energie en professionaliteit met 20. Volledig op darts focussen kost £2.000 per maand zonder die straf.',
                'Wijzig je carrièrekeuze onder Meer. De werkstraf geldt alleen zolang je voor werk kiest.',
                'Voor je eerste wedstrijd op een major is er een persconferentie; na jouw overwinningen op majors en European Tour eveneens.',
                'Journalisten vragen naar vorm, wedstrijd, tegenstander en bekende onderlinge resultaten. Vier antwoorden kunnen professionaliteit en mediabereik verschillend beïnvloeden.',
                'Gedrag in interviews en wedstrijdmomenten kan latere sponsorvoorstellen beïnvloeden. Nieuws over vormwisselingen kun je verbergen.'
            ],
            tip: 'Houd rekening met werkinkomen, staflonen en basiskosten vóór grote aankopen.'
        },
        {
            id: 'editing', icon: '🛠️', title: 'Editors, kwalificaties en toernooipakketten',
            summary: 'Pas spelers, kalender, kwalificatieregels en landenteams aan.',
            bullets: [
                'De Spelereditor wijzigt bestaande spelers en voegt nieuwe toe. Van daaruit open je ook de Toernooieditor en World Cup-teameditor.',
                'De Toernooieditor ondersteunt nieuwe en bestaande evenementen, format, gastland en kwalificatie, ook op land.',
                'Kwalificaties kunnen aan ingebouwde evenementen worden gekoppeld. Wijzig de gastlandkwalificatie van European Tour zonder de hele tour opnieuw te maken.',
                'Een toernooipakket exporteert kalender, kwalificaties en regels in één bestand. Bekijk vóór import de wijzigingen en beslis wat er met gelijke evenementnamen gebeurt.',
                'Kies in de World Cup-editor twee spelers uit hetzelfde land voor de volgende editie.'
            ],
            tip: 'Download een back-up van je spelstand voordat je de kalender flink wijzigt.'
        }
    ]
};

for (const language of Object.keys(TUTORIAL_TEXTS)) {
    TUTORIAL_TEXTS[language].chapters.splice(-1, 0, ...TUTORIAL_NEW_CHAPTERS[language]);
}

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
        return { version: TUTORIAL_VERSION, opened: false, visitedSections: [], welcomeMailSent: false, updateAvailable: false };
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
        welcomeMailSent: previous.welcomeMailSent === true,
        updateAvailable: previous.updateAvailable === true
            || (previous.opened === true && (Number(previous.version) || 0) < TUTORIAL_VERSION)
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
        welcomeMailSent: false,
        updateAvailable: false
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
        badge.textContent = progress.done === progress.total ? text.completedBadge
            : state.updateAvailable ? text.updatedBadge : text.newBadge;
        badge.hidden = state.opened && !state.updateAvailable && progress.done !== progress.total;
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
    if (typeof saveGame === 'function') saveGame(true);
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
    state.updateAvailable = false;
    renderTutorialScreen();
    updateTutorialTile();
    showScreen('screen-tutorial');
    if (typeof saveGame === 'function') saveGame(true);
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
