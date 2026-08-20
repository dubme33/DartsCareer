function showScreen(screenId) {
            // Wyciszamy wszystkie dźwięki meczowe przy wychodzeniu z meczu
            if(screenId !== 'screen-match') { 
                isWalkonSkipped = true; 
                clearTimeout(walkonTimeout); clearInterval(walkonInterval);
                clearTimeout(window.aiTimeout);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if(currentWalkonAudio) { currentWalkonAudio.pause(); currentWalkonAudio = null; }
                if(oppAudio) { oppAudio.pause(); oppAudio = null; }
                if(crowdAudio) { crowdAudio.pause(); crowdAudio.currentTime = 0; }
                if(postMatchAudio) { postMatchAudio.pause(); postMatchAudio.currentTime = 0; }
            }
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        }

        function startCareerAsExistingPlayer() {
            const select = document.getElementById('existing-player-select');
            const selectedPlayer = select && typeof pdcPlayers !== 'undefined'
                ? pdcPlayers.find(candidate => candidate && candidate.id === select.value)
                : null;

            if (!selectedPlayer) {
                alert(trCareerStart('empty'));
                return;
            }

            const asNumber = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
            const overall = asNumber(selectedPlayer.ovr, 55);
            const scoring = asNumber(selectedPlayer.scoring, overall);
            const doubles = asNumber(selectedPlayer.doubles, overall);
            const prizeMoney = asNumber(selectedPlayer.prizeMoney, 0);
            const proTourPrizeMoney = asNumber(selectedPlayer.proTourPrizeMoney, 0);
            const pcPrizeMoney = asNumber(selectedPlayer.pcPrizeMoney, 0);
            const modPhoto = typeof moddedAssets !== 'undefined' ? moddedAssets.photos[selectedPlayer.name] : '';
            const modWalkon = typeof moddedAssets !== 'undefined' ? moddedAssets.music[selectedPlayer.name] : '';

            // Przenosimy dokładnie tego zawodnika z puli AI do kariery, bez tworzenia duplikatu.
            const selectedIndex = pdcPlayers.indexOf(selectedPlayer);
            if (selectedIndex !== -1) pdcPlayers.splice(selectedIndex, 1);

            player = {
                ...selectedPlayer,
                id: selectedPlayer.id,
                overall, ovr: overall, scoring, doubles,
                baseOvr: overall, baseScoring: scoring, baseDoubles: doubles, form: 0,
                favoriteDouble: asNumber(selectedPlayer.favoriteDouble, 20),
                // Prize money determines ranking; the budget is the separate amount used in the shop.
                budget: Math.min(10000, Math.max(500, Math.round(prizeMoney * 0.002))),
                prof: Math.min(95, Math.max(55, Math.round(45 + (overall - 40) * 0.75))),
                pop: Math.min(85, Math.max(20, Math.round(10 + (overall - 40) * 1.2))),
                stamina: 100,
                prizeMoney, proTourPrizeMoney, pcPrizeMoney,
                photo: modPhoto || selectedPlayer.photo || '',
                walkon: modWalkon || selectedPlayer.walkon || null,
                historyPT: {}, historyMain: {},
                activeSponsors: [], technicalPartner: null,
                equipment: { board: 0, surround: 0, light: 0 },
                scoringXP: 0, doublesXP: 0,
                achievements: [],
                careerStats: { highestAvg: 0, highestCheckout: 0, total180s: 0, nineDarters: 0, tonPlusCheckouts: 0, trophies: [] },
                rivalries: {}, activeRivalIds: [], careerChronicle: []
            };

            currentMatch = null;
            activeTournament = null;
            tournamentBracket = [];
            tournamentMatchHistory = [];
            tournamentRound = 32;
            lastTournamentResults = '';
            currentRoundHTML = '';
            preTournamentRanks = { main: 0, pt: 0, pc: 0 };
            gdlTable = [];
            emails = [];
            unreadMailsCount = 0;

            normalizePlayerIds(pdcPlayers, player);
            initAllPlayerSeasonStats();
            initCareerStats();
            initCareerChronicle();
            initRivalries();
            initPlayerXP();
            renderOpponentOptions();
            renderCareerPlayerOptions();
            updateMailBadge();

            const hubPhoto = document.getElementById('hub-photo');
            if (hubPhoto) hubPhoto.src = player.photo || 'https://via.placeholder.com/120?text=ZAWODNIK';
            updateHub();
            showScreen('screen-hub');
        }

        document.getElementById('create-player-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const potVal = document.getElementById('potential').value;
            let ovr = 55;
            if (potVal === 'weak') ovr = 45;
            else if (potVal === 'medium') ovr = 55;
            else if (potVal === 'good') ovr = 65;
            else if (potVal === 'very_good') ovr = 75;
            else if (potVal === 'goat') ovr = 82;
            
            player = {
                id: createEntityId('player'),
                name: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
                country: document.getElementById('nationality').value,
                birthYear: (currentDate instanceof Date ? currentDate.getFullYear() : 2026) - parseInt(document.getElementById('age').value, 10),
                overall: ovr, ovr: ovr, scoring: ovr + 2, doubles: ovr - 2,
                favoriteDouble: parseInt(document.getElementById('favorite-double').value),
                budget: 150, prof: 50, pop: 20, 
                prizeMoney: 30000, 
                proTourPrizeMoney: 20000,
                pcPrizeMoney: 0,      
                photo: "", walkon: null,
                historyPT: {},
                historyMain: {},
                rivalries: {},
                activeRivalIds: [],
                careerChronicle: []
            };
            initAllPlayerSeasonStats();

            const photoInput = document.getElementById('photoUpload');
            const audioInput = document.getElementById('walkonUpload');

            try {
                // Data URL działa także po ponownym uruchomieniu strony, w przeciwieństwie do blob: URL.
                if (photoInput && photoInput.files.length > 0) {
                    player.photo = await convertFileToBase64(photoInput.files[0]);
                    document.getElementById('hub-photo').src = player.photo;
                } else {
                    document.getElementById('hub-photo').src = "https://via.placeholder.com/120?text=ZAWODNIK";
                }

                if (audioInput && audioInput.files.length > 0) {
                    player.walkon = await convertFileToBase64(audioInput.files[0]);
                }
            } catch (error) {
                console.error('Nie udało się odczytać pliku profilu.', error);
                alert('Nie udało się odczytać zdjęcia lub muzyki. Kariera zostanie utworzona bez tego pliku.');
                player.photo = '';
                player.walkon = null;
            }

            updateHub(); 
            showScreen('screen-hub');
        });

        function updateHub() {
            if (typeof player.stamina === 'undefined') player.stamina = 100; // Inicjalizacja dla starych zapisów

            document.getElementById('hub-name').innerText = player.name;
            document.getElementById('hub-flag').innerHTML = getFlagImg(player.country);
            
            let bStats = typeof getBoostedPlayerStats === 'function' ? getBoostedPlayerStats() : { overall: player.overall, scoring: player.scoring, doubles: player.doubles, bonusStr: '', staminaPenalty: 0 };
            
            document.getElementById('hub-ovr').innerText = bStats.overall;
            
            // Kolorowe dopiski o sprzęcie i zmęczeniu
            let extraHTML = "";
            if (bStats.bonusStr) extraHTML += `<span style="font-size: 11px; color: var(--accent-green); margin-left: 5px;">${bStats.bonusStr}</span>`;
            if (bStats.staminaPenalty < 0) extraHTML += `<span style="font-size: 11px; color: var(--accent-red); margin-left: 5px;">(${bStats.staminaPenalty} OVR)</span>`;
            document.getElementById('hub-ovr').innerHTML += extraHTML;
            
            document.getElementById('hub-score-stat').innerText = bStats.scoring;
            document.getElementById('hub-double-stat').innerText = bStats.doubles;
            if(document.getElementById('hub-budget')) document.getElementById('hub-budget').innerText = `£${player.budget.toLocaleString('en-GB')}`;

            // Wyświetlanie energii
            if(document.getElementById('hub-stamina')) {
                document.getElementById('hub-stamina').innerText = `${Math.round(player.stamina)}%`;
                let stamColor = player.stamina > 70 ? '#27ae60' : (player.stamina > 40 ? '#f39c12' : '#c0392b');
                document.getElementById('hub-stamina').style.color = stamColor;
            }
            
            // --- ALGORYTM FOLLOWERSÓW ---
            if (typeof player.pop === 'undefined') player.pop = 20;
            if (typeof player.prof === 'undefined') player.prof = 50;

            let rank = getPlayerRank('main');
            let rankFactor = Math.max(1, 130 - rank); // Skala od 1 do 129
            
            // Baza fanów oparta na rankingu (Top 1 ma ogromną przewagę)
            let baseByRank = Math.pow(rankFactor, 2.5); 
            
            // Mnożnik medialności (od 0.6 dla nudziarzy do x16 dla showmanów 100 Pop)
            let popFactor = Math.pow(player.pop / 25, 2); 
            
            let followers = Math.floor(baseByRank * popFactor * 0.8);
            
            if(document.getElementById('hub-prof')) document.getElementById('hub-prof').innerText = Math.round(player.prof);
            if(document.getElementById('hub-pop')) document.getElementById('hub-pop').innerText = Math.round(player.pop);
            if(document.getElementById('hub-followers')) document.getElementById('hub-followers').innerText = followers.toLocaleString('pl-PL');
            if (typeof refreshActiveRivals === 'function') {
                const rivalTileDesc = document.getElementById('rival-tile-desc');
                if (rivalTileDesc) rivalTileDesc.innerText = trRival('active', { count: refreshActiveRivals().length });
            }
        }

        // --- 5. SYSTEM CZASU, POCZTY I KALENDARZA ---
        function updateDateDisplay() {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            document.getElementById('game-date-display').innerText = currentDate.toLocaleDateString('pl-PL', options);
        }

        // --- BAZA LOSOWYCH E-MAILI (40 WIADOMOŚCI) ---
        const randomEmailsDB = [
    { sender_pl: "Wierny Fan", sender_en: "Loyal Fan", sender_de: "Treuer Fan", sender_nl: "Trouwe fan", subject_pl: "Jesteś niesamowity!", subject_en: "You're amazing!", subject_de: "Du bist großartig!", subject_nl: "Je bent geweldig!", body_pl: "Oglądam wszystkie Twoje mecze. Kiedyś też chciałbym rzucać ze średnią powyżej 90. Trzymaj się!", body_en: "I watch all your matches. One day I'd like to throw with an average over 90. Keep it up!", body_de: "Ich schaue alle deine Spiele. Eines Tages möchte ich mit einem Durchschnitt über 90 werfen. Mach weiter!", body_nl: "Ik kijk al je wedstrijden. Op een dag wil ik graag met een gemiddelde boven de 90 gooien. Doorgaan!" },
    { sender_pl: "Złośliwy Hater", sender_en: "Malicious Hater", sender_de: "Bösartiger Hasser", sender_nl: "Boosaardige hater", subject_pl: "Fart", subject_en: "Pure Luck", subject_de: "Reines Glück", subject_nl: "Puur Geluk", body_pl: "Widziałem Twój wczorajszy mecz. Te podwójne to czysty przypadek, fuks i nic więcej. Niedługo wrócisz do grania w garażu.", body_en: "I saw your match yesterday. Those doubles are pure chance, luck and nothing more. You'll be back in the garage soon.", body_de: "Ich habe dein Spiel gestern gesehen. Diese Doubles sind reiner Zufall, Glück und nichts anderes. Du wirst bald wieder in der Garage spielen.", body_nl: "Ik zag je gisterenavond spelen. Die doubles zijn puur toeval, geluk en niets meer. Je bent binnenkort terug in de garage." },
    { sender_pl: "Dziwny Kibic", sender_en: "Strange Fan", sender_de: "Seltsamer Fan", sender_nl: "Vreemde fan", subject_pl: "Nietypowa prośba", subject_en: "Unusual Request", subject_de: "Ungewöhnliche Anfrage", subject_nl: "Ongebruikelijk verzoek", body_pl: "Kolekcjonuję przepocone ręczniki graczy. Czy byłaby szansa, żebyś po kolejnym turnieju nie wrzucał go do pralki, tylko wysłał mi pocztą? Płacę za przesyłkę!", body_en: "I collect sweaty player towels. Would it be possible for you to mail me your towel after your next tournament instead of washing it? I'll pay for shipping!", body_de: "Ich sammle verschwitztes Handtücher von Spielern. Wäre es möglich, dass du mir dein Handtuch nach deinem nächsten Turnier zuschickst, anstatt es zu waschen? Ich zahle das Porto!", body_nl: "Ik verzamel bezwete handdoeken van spelers. Zou het mogelijk zijn om je handdoek na je volgende toernooi naar me toe te sturen in plaats van hem te wassen? Ik betaal de verzending!" },
    { sender_pl: "Kolega z Touru", sender_en: "Tour Buddy", sender_de: "Tour-Kollege", sender_nl: "Tourbuddy", subject_pl: "Idziemy na piwo?", subject_en: "Going for a beer?", subject_de: "Gehen wir ein Bier trinken?", subject_nl: "Gaan we bier drinken?", body_pl: "Stary, dzisiaj wieczorem po sesji wpadamy do pubu obok hotelu. Stawiam pierwszą kolejkę, nie może Cię zabraknąć!", body_en: "Hey mate, tonight after the session we're heading to the pub next to the hotel. First round's on me, you can't miss it!", body_de: "Hey Kumpel, heute Abend nach der Sitzung gehen wir in die Kneipe neben dem Hotel. Erste Runde geht auf meine Rechnung, du darfst nicht fehlen!", body_nl: "Hé makker, vanavond na de sessie gaan we naar de kroeg naast het hotel. Eerste rondje van mij, je mag niet missen!" },
    { sender_pl: "SPAM", sender_en: "SPAM", sender_de: "SPAM", sender_nl: "SPAM", subject_pl: "Wygrałeś milion funtów!", subject_en: "You won a million pounds!", subject_de: "Du hast eine Million Pfund gewonnen!", subject_nl: "Je hebt een miljoen pond gewonnen!", body_pl: "Gratulacje! Twój e-mail został wylosowany w Wielkiej Loterii. Podaj numer karty i kod CVV, by odebrać nagrodę.", body_en: "Congratulations! Your email was selected in the Great Lottery. Provide your card number and CVV code to claim the prize.", body_de: "Glückwunsch! Deine E-Mail wurde in der Großen Lotterie ausgewählt. Gib deine Kartennummer und deinen CVV-Code an, um den Preis zu beanspruchen.", body_nl: "Gefeliciteerd! Je e-mailadres is geselecteerd in de Grote Loterij. Geef je rekeningnummer en CVV-code op om de prijs op te eisen." },
    { sender_pl: "Administracja", sender_en: "Administration", sender_de: "Verwaltung", sender_nl: "Administratie", subject_pl: "Dress code", subject_en: "Dress code", subject_de: "Kleiderordnung", subject_nl: "Dresscode", body_pl: "Przypominamy, że noszenie czarnych butów bez widocznego logo jest rygorystycznie egzekwowane. Prosimy o przestrzeganie regulaminu.", body_en: "We remind you that wearing black shoes without a visible logo is strictly enforced. Please comply with the regulations.", body_de: "Wir möchten Sie darauf hinweisen, dass das Tragen schwarzer Schuhe ohne sichtbares Logo streng durchgesetzt wird. Bitte beachten Sie die Vorschriften.", body_nl: "We herinneren u eraan dat het dragen van zwarte schoenen zonder zichtbaar logo strikt wordt gehandhaafd. Neem alstublieft de voorschriften in acht." },
    { sender_pl: "Lokalna Pizzeria", sender_en: "Local Pizzeria", sender_de: "Lokale Pizzeria", sender_nl: "Lokale pizzeria", subject_pl: "Darmowa pizza dla graczy", subject_en: "Free pizza for players", subject_de: "Kostenlose Pizza für Spieler", subject_nl: "Gratis pizza voor spelers", body_pl: "Z okazji turnieju w naszym mieście, oferujemy darmową pizzę każdemu zawodnikowi. Wpadnij do nas z kartą zawodnika!", body_en: "For the occasion of the tournament in our city, we offer free pizza to every player. Visit us with your player card!", body_de: "Anlässlich des Turniers in unserer Stadt bieten wir jedem Spieler kostenlose Pizza an. Besuchen Sie uns mit Ihrer Spielerkarte!", body_nl: "Ter gelegenheid van het toernooi in onze stad bieden we gratis pizza aan elke speler. Bezoek ons met je speelerskaart!" },
    { sender_pl: "DartsPlanet (Magazyn)", sender_en: "DartsPlanet (Magazine)", sender_de: "DartsPlanet (Magazin)", sender_nl: "DartsPlanet (Tijdschrift)", subject_pl: "Prośba o wywiad", subject_en: "Interview Request", subject_de: "Interviewanfrage", subject_nl: "Interviewverzoek", body_pl: "Piszę artykuł o wschodzących gwiazdach i zawodnikach w formie. Zgodziłbyś się na krótką, 10-minutową rozmowę przez telefon po weekendzie?", body_en: "I'm writing an article about rising stars and in-form players. Would you agree to a short 10-minute phone interview after the weekend?", body_de: "Ich schreibe einen Artikel über aufstrebende Stars und formstarke Spieler. Würdest du einem kurzen 10-minütigen Telefoninterview nach dem Wochenende zustimmen?", body_nl: "Ik schrijf een artikel over opkomende sterren en formsterkere spelers. Zou je akkoord gaan met een kort 10-minuten telefonisch interview na het weekend?" },
    { sender_pl: "Początkujący Gracz", sender_en: "Beginner Player", sender_de: "Anfängerspieler", sender_nl: "Beginnende speler", subject_pl: "Jak trenujesz podwójne?", subject_en: "How do you train doubles?", subject_de: "Wie trainierst du Doubles?", subject_nl: "Hoe train je doubles?", body_pl: "Mam problem z trafianiem D20 pod presją. Masz może jakieś porady, jak uspokoić głowę? Jesteś moją inspiracją.", body_en: "I have trouble hitting D20 under pressure. Do you have any tips on how to calm your mind? You're my inspiration.", body_de: "Ich habe Schwierigkeiten, D20 unter Druck zu treffen. Hast du Tipps, wie man den Kopf beruhigt? Du bist meine Inspiration.", body_nl: "Ik heb moeite om D20 onder druk te raken. Heb je tips hoe je je hoofd kalm houdt? Je bent mijn inspiratie." },
    { sender_pl: "SPAM", sender_en: "SPAM", sender_de: "SPAM", sender_nl: "SPAM", subject_pl: "Zarabiaj na krypto", subject_en: "Earn on crypto", subject_de: "Mit Krypto Geld verdienen", subject_nl: "Verdien geld met crypto", body_pl: "Koniec z rzucaniem lotkami! Zarabiaj 5 tysięcy funtów dziennie, nie ruszając się z kanapy. Kliknij tutaj.", body_en: "Stop throwing darts! Earn 5 thousand pounds a day without moving from the couch. Click here.", body_de: "Keine Darts mehr werfen! Verdiene 5.000 Pfund pro Tag, ohne die Couch zu verlassen. Klick hier.", body_nl: "Geen pijlen meer gooien! Verdien 5.000 pond per dag zonder van de bank af te gaan. Klik hier." },
    { sender_pl: "Wściekły Gracz Otwarty", sender_en: "Angry Open Player", sender_de: "Wütender Open-Spieler", sender_nl: "Boze Open Speler", subject_pl: "Zabrałeś mi miejsce", subject_en: "You took my spot", subject_de: "Du hast meinen Platz genommen", subject_nl: "Je nam mijn plek in", body_pl: "Gdyby nie Ty, to ja bym się zakwalifikował. Następnym razem udowodnię Ci przy tarczy, że jestem lepszy.", body_en: "If it wasn't for you, I would have qualified. Next time I'll prove to you at the board that I'm better.", body_de: "Wärst du nicht gewesen, hätte ich mich qualifiziert. Beim nächsten Mal werde ich dir am Board beweisen, dass ich besser bin.", body_nl: "Als jij er niet was geweest, had ik me gekwalificeerd. De volgende keer zal ik je op het bord bewijzen dat ik beter ben." },
    { sender_pl: "Recepcja Hotelowa", sender_en: "Hotel Reception", sender_de: "Hotelrezeption", sender_nl: "Hotelreceptie", subject_pl: "Znaleziona ładowarka", subject_en: "Found charger", subject_de: "Gefundenes Ladegerät", subject_nl: "Gevonden oplader", body_pl: "Informujemy, że podczas sprzątania Pana pokoju po ostatnim turnieju znaleźliśmy ładowarkę do telefonu. Przesyłka jest w drodze do Pana bazy.", body_en: "Please be informed that while cleaning your room after the last tournament, we found a phone charger. The package is on its way to your home.", body_de: "Bitte seien Sie darüber informiert, dass wir beim Reinigen Ihres Zimmers nach dem letzten Turnier ein Handy-Ladegerät gefunden haben. Das Paket ist auf dem Weg zu Ihnen.", body_nl: "Houd er rekening mee dat we tijdens het schoonmaken van je kamer na het laatste toernooi een telefoonoplader hebben gevonden. Het pakket is onderweg naar je huis." },
    { sender_pl: "Kibic z Niemiec", sender_en: "Fan from Germany", sender_de: "Fan aus Deutschland", sender_nl: "Fan uit Duitsland", subject_pl: "Kiedy Continental Tour?", subject_en: "When is the Continental Tour?", subject_de: "Wann ist die Continental Tour?", subject_nl: "Wanneer is de Continental Tour?", body_pl: "Cześć! Czekamy tu na Ciebie w Monachium z kuflem zimnego piwa. Mam nadzieję, że zjawisz się w dobrej formie!", body_en: "Hi! We're waiting for you here in Munich with a cold pint of beer. I hope you arrive in good form!", body_de: "Hi! Wir warten hier in München mit einem kalten Bier auf dich. Ich hoffe, du bist in guter Form!", body_nl: "Hoi! We wachten hier op je in München met een koud biertje. Ik hoop dat je in goede vorm aankomt!" },
    { sender_pl: "Trener Mentalny", sender_en: "Mental Coach", sender_de: "Mentaltrainer", sender_nl: "Mentale Coach", subject_pl: "Oferta współpracy", subject_en: "Cooperation offer", subject_de: "Kooperationsangebot", subject_nl: "Samenwerkingsaanbod", body_pl: "Widziałem Twoje nerwy w ostatnich legach. Oferuję sesje oddechowe i trening wyobrażeniowy. Pierwsze spotkanie za pół ceny.", body_en: "I saw your nerves in the final legs. I offer breathing sessions and visualization training. First meeting is half price.", body_de: "Ich sah deine Nervosität in den letzten Legs. Ich biete Atemsitzungen und Visualisierungstraining an. Das erste Treffen kostet den halben Preis.", body_nl: "Ik zag je zenuwen in de laatste legs. Ik bied ademhalingssessies en visualisatietraining aan. De eerste bijeenkomst is voor de helft van de prijs." },
    { sender_pl: "Mama", sender_en: "Mom", sender_de: "Mama", sender_nl: "Mama", subject_pl: "Pamiętaj o witaminach", subject_en: "Remember your vitamins", subject_de: "Denk an deine Vitamine", subject_nl: "Denk aan je vitamines", body_pl: "Synek, widziałam Cię wczoraj w telewizji. Wyglądasz trochę blado, pamiętaj żeby jeść owoce a nie same kebaby z tymi Twoimi kolegami.", body_en: "Son, I saw you on TV yesterday. You look a bit pale, remember to eat fruit and not just kebabs with your friends.", body_de: "Sohn, ich habe dich gestern im Fernsehen gesehen. Du siehst etwas blass aus, denk daran, Obst zu essen und nicht nur Kebabs mit deinen Freunden.", body_nl: "Zoon, ik zag je gisteren op tv. Je ziet er een beetje bleek uit, vergeet niet om fruit te eten en niet alleen kebabs met je vrienden." },
    { sender_pl: "Organizator Turnieju", sender_en: "Tournament Organizer", sender_de: "Turnierorganisator", sender_nl: "Toernooiorganisator", subject_pl: "Opóźnienia", subject_en: "Delays", subject_de: "Verzögerungen", subject_nl: "Vertragingen", body_pl: "Uprzejmie informujemy, że z powodu problemów ze światłem na scenie numer 2, harmonogram dzisiejszej sesji przesuwa się o około 30 minut.", body_en: "Please be advised that due to lighting issues on Stage 2, today's session schedule is delayed by about 30 minutes.", body_de: "Bitte beachten Sie, dass sich der Zeitplan der heutigen Sitzung aufgrund von Beleuchtungsproblemen auf Bühne 2 um etwa 30 Minuten verzögert.", body_nl: "Houd er rekening mee dat door verlichtingsproblemen op podium 2 het schema van de sessie van vandaag met ongeveer 30 minuten is vertraagd." },
    { sender_pl: "Sponsor: Cuespirit", sender_en: "Sponsor: Cuespirit", sender_de: "Sponsor: Cuespirit", sender_nl: "Sponsor: Cuespirit", subject_pl: "Nowe lotki", subject_en: "New darts", subject_de: "Neue Darts", subject_nl: "Nieuwe pijlen", body_pl: "Wysłaliśmy Ci najnowszy prototyp naszych 23-gramowych lotek z miedzianym akcentem. Daj znać, czy balans Ci odpowiada.", body_en: "We've sent you the latest prototype of our 23-gram darts with a copper accent. Let us know if the balance suits you.", body_de: "Wir haben dir den neuesten Prototyp unserer 23-Gramm-Darts mit Kupferakzent geschickt. Lass uns wissen, ob dir die Balance gefällt.", body_nl: "We hebben je het nieuwste prototype van onze 23-gram darts met een koperaccent gestuurd. Laat ons weten of de balans je bevalt." },
    { sender_pl: "Fanatyk Sprzętu", sender_en: "Gear Fanatic", sender_de: "Ausrüstungs-Fanatiker", sender_nl: "Uitrusting Fanaticus", subject_pl: "Jakich piórek używasz?", subject_en: "What flights do you use?", subject_de: "Welche Flights benutzt du?", subject_nl: "Welke flights gebruik je?", body_pl: "Zauważyłem, że Twoje lotki lecą bardzo płasko. Czy to standardowe piórka Number 6, czy może używasz Kytów?", body_en: "I noticed your darts fly very flat. Are they standard Number 6 flights, or maybe you use Kites?", body_de: "Mir ist aufgefallen, dass deine Darts sehr flach fliegen. Sind das Standard-Number-6-Flights oder verwendest du Kites?", body_nl: "Het viel me op dat je pijlen erg vlak vliegen. Zijn het standaard Number 6 flights, of gebruik je misschien Kites?" },
    { sender_pl: "Klub Rzutkowy Sosnowiec", sender_en: "Local Darts Club", sender_de: "Lokaler Dartverein", sender_nl: "Lokale Dartclub", subject_pl: "Zaproszenie", subject_en: "Invitation", subject_de: "Einladung", subject_nl: "Uitnodiging", body_pl: "Panie Mistrzu! Zapraszamy na gościnny występ u nas. Chłopaki nie mogą się doczekać, żeby dostać od Pana łomot 0:6.", body_en: "Master! We invite you for a guest appearance at our club. The boys can't wait to get a 0:6 beating from you.", body_de: "Meister! Wir laden dich zu einem Gastauftritt in unserem Club ein. Die Jungs können es kaum erwarten, von dir mit 0:6 besiegt zu werden.", body_nl: "Meester! We nodigen je uit voor een gastoptreden bij onze club. De jongens kunnen niet wachten om een 0:6 pak slaag van je te krijgen." },
    { sender_pl: "Sfrustrowany Fan", sender_en: "Frustrated Fan", sender_de: "Frustrierter Fan", sender_nl: "Gefrustreerde Fan", subject_pl: "Zrujnowałeś mi kupon", subject_en: "You ruined my bet", subject_de: "Du hast meine Wette ruiniert", subject_nl: "Je hebt mijn weddenschap verpest", body_pl: "Przez Ciebie przegrałem wczoraj 50 funtów u bukmachera. Miałeś trafić minimum trzy maxy, a rzuciłeś ledwo jednego...", body_en: "Because of you, I lost 50 pounds at the bookmaker yesterday. You were supposed to hit at least three maxes, and you barely threw one...", body_de: "Wegen dir habe ich gestern beim Buchmacher 50 Pfund verloren. Du solltest mindestens drei Maxima werfen und hast kaum eins geworfen...", body_nl: "Door jou ben ik gisteren 50 pond kwijtgeraakt bij de bookmaker. Je zou minstens drie maximums gooien, en je gooide er amper één..." },
    { sender_pl: "Finanse", sender_en: "Finance Dept", sender_de: "Finanzabteilung", sender_nl: "Financiële Afdeling", subject_pl: "Powiadomienie podatkowe", subject_en: "Tax notification", subject_de: "Steuermitteilung", subject_nl: "Belastingmelding", body_pl: "Prosimy o upewnienie się, że Pana dane rozliczeniowe są zaktualizowane przed końcem kwartału, aby uniknąć opóźnień w wypłatach.", body_en: "Please ensure your billing details are up to date before the end of the quarter to avoid delays in payouts.", body_de: "Bitte stellen Sie sicher, dass Ihre Rechnungsdaten vor Ende des Quartals auf dem neuesten Stand sind, um Verzögerungen bei Auszahlungen zu vermeiden.", body_nl: "Zorg ervoor dat je factuurgegevens vóór het einde van het kwartaal up-to-date zijn om vertragingen in uitbetalingen te voorkomen." },
    { sender_pl: "Początkujący Gracz", sender_en: "Beginner Player", sender_de: "Anfängerspieler", sender_nl: "Beginnende speler", subject_pl: "Rzuciłem 180!", subject_en: "I hit a 180!", subject_de: "Ich habe eine 180 geworfen!", subject_nl: "Ik heb een 180 gegooid!", body_pl: "Chciałem się tylko pochwalić, że po miesiącach prób w końcu wrzuciłem 3 lotki w czerwoną część 20! Jaram się jak dziecko!", body_en: "I just wanted to brag that after months of trying, I finally put 3 darts in the red part of the 20! I'm as excited as a kid!", body_de: "Ich wollte nur angeben, dass ich nach monatelangen Versuchen endlich 3 Darts in den roten Teil der 20 geworfen habe! Ich freue mich wie ein Kind!", body_nl: "Ik wilde even opscheppen dat ik na maanden proberen eindelijk 3 pijltjes in het rode deel van de 20 heb gegooid! Ik ben zo blij als een kind!" },
    { sender_pl: "SPAM", sender_en: "SPAM", sender_de: "SPAM", sender_nl: "SPAM", subject_pl: "Tabletki na skupienie", subject_en: "Focus pills", subject_de: "Fokus-Pillen", subject_nl: "Focuspillen", body_pl: "Odkryto naturalny środek z Azji, który wyostrza wzrok i redukuje stres. Zamów dwa opakowania w cenie jednego.", body_en: "A natural remedy from Asia has been discovered that sharpens vision and reduces stress. Order two packs for the price of one.", body_de: "Ein natürliches Heilmittel aus Asien wurde entdeckt, das das Sehvermögen schärft und Stress reduziert. Bestelle zwei Packungen zum Preis von einer.", body_nl: "Een natuurlijke remedie uit Azië is ontdekt die het gezichtsvermogen verscherpt en stress vermindert. Bestel twee pakjes voor de prijs van één." },
    { sender_pl: "Hater", sender_en: "Hater", sender_de: "Hater", sender_nl: "Hater", subject_pl: "Brak stylu", subject_en: "No style", subject_de: "Kein Stil", subject_nl: "Geen stijl", body_pl: "Zmień muzykę na wejście, bo uszy więdną. Do tego zrób coś z fryzurą, wyglądasz jak po ciężkiej nocy.", body_en: "Change your walk-on music because my ears are bleeding. Plus, do something with your hair, you look like you had a rough night.", body_de: "Ändere deine Walk-on-Musik, denn meine Ohren bluten. Außerdem tu was mit deinen Haaren, du siehst aus, als hättest du eine harte Nacht gehabt.", body_nl: "Verander je walk-on muziek, want mijn oren bloeden. En doe iets met je haar, je ziet eruit alsof je een zware nacht hebt gehad." },
    { sender_pl: "Dawny Znajomy", sender_en: "Old Friend", sender_de: "Alter Freund", sender_nl: "Oude Vriend", subject_pl: "Pożyczka?", subject_en: "A loan?", subject_de: "Ein Darlehen?", subject_nl: "Een lening?", body_pl: "Kopę lat! Super Ci idzie w telewizji. Słuchaj, miałbyś pożyczyć 200 funtów do pierwszego? Oddam z nawiązką.", body_en: "Long time no see! You're doing great on TV. Listen, could you lend me 200 pounds until the 1st? I'll pay you back with interest.", body_de: "Lange nicht gesehen! Du machst dich toll im Fernsehen. Hör zu, könntest du mir 200 Pfund bis zum Ersten leihen? Ich zahle es mit Zinsen zurück.", body_nl: "Lang niet gezien! Je doet het geweldig op tv. Luister, zou je me 200 pond kunnen lenen tot de 1e? Ik betaal het je terug met rente." },
    { sender_pl: "Anonimowa Fanka", sender_en: "Anonymous Fan Girl", sender_de: "Anonymer weiblicher Fan", sender_nl: "Anonieme Fan Girl", subject_pl: "Zostaniesz moim mężem?", subject_en: "Will you be my husband?", subject_de: "Willst du mein Mann werden?", subject_nl: "Wil je mijn man worden?", body_pl: "Wydrukowałam sobie wielki plakat z Twoim zdjęciem i powiesiłam nad łóżkiem. Wyślesz mi autograf z dedykacją?", body_en: "I printed a huge poster with your photo and hung it over my bed. Will you send me an autograph with a dedication?", body_de: "Ich habe ein riesiges Poster mit deinem Foto gedruckt und über mein Bett gehängt. Schickst du mir ein Autogramm mit Widmung?", body_nl: "Ik heb een enorme poster met je foto afgedrukt en boven mijn bed gehangen. Stuur je me een handtekening met een opdracht?" },
    { sender_pl: "Menadżer Pubu", sender_en: "Pub Manager", sender_de: "Kneipenmanager", sender_nl: "Pub Manager", subject_pl: "Urwana Tarcza", subject_en: "Torn Board", subject_de: "Abgerissenes Dartboard", subject_nl: "Afgescheurd Bord", body_pl: "Pamiętasz jak wczoraj po treningu wyrwałeś nam tarczę ze ściany? Ochrona kazała napisać, żebyś nie wracał bez wiertarki.", body_en: "Remember how you ripped our dartboard off the wall after practice yesterday? Security told me to write to you not to come back without a drill.", body_de: "Erinnerst du dich, wie du gestern nach dem Training unser Dartboard von der Wand gerissen hast? Der Sicherheitsdienst hat mir gesagt, ich soll dir schreiben, dass du ohne Bohrmaschine nicht zurückkommen sollst.", body_nl: "Weet je nog hoe je gisteren na de training ons dartbord van de muur trok? De beveiliging vertelde me je te schrijven om niet terug te komen zonder een boor." },
    { sender_pl: "Zarząd Europe", sender_en: "Europe Board", sender_de: "Europa-Vorstand", sender_nl: "Europa Bestuur", subject_pl: "Bilety lotnicze", subject_en: "Flight tickets", subject_de: "Flugtickets", subject_nl: "Vliegtickets", body_pl: "Informujemy, że proces zwrotu kosztów za przeloty na ostatnie turnieje z cyklu Continental Tour został zakończony.", body_en: "We inform you that the reimbursement process for flights to recent Continental Tour events has been completed.", body_de: "Wir teilen Ihnen mit, dass der Erstattungsprozess für Flüge zu den jüngsten Continental-Tour-Events abgeschlossen ist.", body_nl: "Wij informeren u dat het vergoedingsproces voor vluchten naar recente Continental Tour-evenementen is afgerond." },
    { sender_pl: "Bystry Widz", sender_en: "Sharp Viewer", sender_de: "Aufmerksamer Zuschauer", sender_nl: "Scherpe Kijker", subject_pl: "Literówka na koszulce", subject_en: "Typo on your shirt", subject_de: "Tippfehler auf deinem Hemd", subject_nl: "Typfout op je shirt", body_pl: "Hej, nie wiem czy wiesz, ale chyba firma szyjąca Twoje koszulki pomyliła jedną literę w Twoim nazwisku z tyłu. Zgłoś to!", body_en: "Hey, I don't know if you know, but the company making your shirts misspelled a letter in your name on the back. Report it!", body_de: "Hey, ich weiß nicht, ob du es weißt, aber die Firma, die deine Hemden herstellt, hat einen Buchstaben in deinem Namen auf dem Rücken falsch geschrieben. Melde das!", body_nl: "Hé, ik weet niet of je het weet, maar het bedrijf dat je shirts maakt heeft een letter in je naam op de achterkant verkeerd gespeld. Meld het!" },
    { sender_pl: "Wesoły Taksówkarz", sender_en: "Cheerful Cabbie", sender_de: "Fröhlicher Taxifahrer", sender_nl: "Vrolijke Taxichauffeur", subject_pl: "Dzięki za napiwek", subject_en: "Thanks for the tip", subject_de: "Danke für das Trinkgeld", subject_nl: "Bedankt voor de fooi", body_pl: "Wiozłem Cię wczoraj spod hali pod hotel. Dzięki za tę dychę napiwku, włączyłem żonie powtórkę Twojego meczu wieczorem!", body_en: "I drove you from the venue to the hotel yesterday. Thanks for the tenner tip, I put on a replay of your match for my wife in the evening!", body_de: "Ich bin dich gestern von der Arena zum Hotel gefahren. Danke für das Zehner-Trinkgeld, ich habe abends die Wiederholung deines Spiels für meine Frau eingeschaltet!", body_nl: "Ik heb je gisteren van de locatie naar het hotel gereden. Bedankt voor de fooi van een tientje, ik heb 's avonds een herhaling van je wedstrijd voor mijn vrouw opgezet!" },
    { sender_pl: "Hater", sender_en: "Hater", sender_de: "Hater", sender_nl: "Hater", subject_pl: "Mickael Cię zniszczy", subject_en: "Mickael will destroy you", subject_de: "Mickael wird dich zerstören", subject_nl: "Mickael zal je vernietigen", body_pl: "Ciesz się swoimi wygranymi w pierwszych rundach. Jak tylko trafisz na Van Gervyna albo Humpreysa, to z płaczem wrócisz do domu.", body_en: "Enjoy your wins in the early rounds. As soon as you face Van Gervyn or Humpreys, you'll go home crying.", body_de: "Genieße deine Siege in den ersten Runden. Sobald du auf Van Gervyn oder Humpreys triffst, wirst du weinend nach Hause gehen.", body_nl: "Geniet van je overwinningen in de eerste rondes. Zodra je tegenover Van Gervyn of Humpreys staat, ga je huilend naar huis." },
    { sender_pl: "Sklep Darts Pro", sender_en: "Darts Pro Shop", sender_de: "Darts Pro Shop", sender_nl: "Darts Pro Winkel", subject_pl: "Promocja", subject_en: "Promotion", subject_de: "Aktion", subject_nl: "Promotie", body_pl: "Wielka zimowa wyprzedaż! Wszystkie tarcze treningowe tańsze o 15%. Skorzystaj, póki mamy sprzęt na stanie.", body_en: "Huge winter sale! All practice boards are 15% off. Take advantage while we have gear in stock.", body_de: "Riesiger Winterschlussverkauf! Alle Trainingsboards sind um 15 % reduziert. Greif zu, solange wir Ausrüstung auf Lager haben.", body_nl: "Grote winteruitverkoop! Alle trainingsborden hebben 15% korting. Profiteer ervan zolang we uitrusting op voorraad hebben." },
    { sender_pl: "Kolega z Touru", sender_en: "Tour Buddy", sender_de: "Tour-Kollege", sender_nl: "Tourbuddy", subject_pl: "Zgubiłem lotki", subject_en: "I lost my darts", subject_de: "Ich habe meine Darts verloren", subject_nl: "Ik ben mijn pijlen kwijt", body_pl: "Stary, nie masz gdzieś w zapasie kompletu mosiężnych lotek 22g? Bagaż mi utknął na lotnisku, a gram za 2 godziny!", body_en: "Mate, do you happen to have a spare set of 22g brass darts? My luggage got stuck at the airport, and I play in 2 hours!", body_de: "Kumpel, hast du zufällig ein Ersatzset 22g-Messing-Darts? Mein Gepäck steckt am Flughafen fest, und ich spiele in 2 Stunden!", body_nl: "Makker, heb je toevallig een reserveset koperen pijlen van 22g? Mijn bagage is vast komen te zitten op de luchthaven en ik speel over 2 uur!" },
    { sender_pl: "Fizjoterapeuta", sender_en: "Physiotherapist", sender_de: "Physiotherapeut", sender_nl: "Fysiotherapeut", subject_pl: "Zadbaj o łokieć", subject_en: "Take care of your elbow", subject_de: "Pass auf deinen Ellenbogen auf", subject_nl: "Zorg voor je elleboog", body_pl: "Przypominam, że rzucanie po 5 godzin dziennie mocno obciąża staw łokciowy. Rób przerwy i stosuj zimne okłady!", body_en: "A reminder that throwing for 5 hours a day puts a lot of strain on the elbow joint. Take breaks and use cold compresses!", body_de: "Zur Erinnerung: 5 Stunden tägliches Werfen belastet das Ellenbogengelenk stark. Mach Pausen und benutze kalte Kompressen!", body_nl: "Een herinnering dat 5 uur per dag gooien veel druk op het ellebooggewricht legt. Neem pauzes en gebruik koude kompressen!" },
    { sender_pl: "Młody Fan", sender_en: "Young Fan", sender_de: "Junger Fan", sender_nl: "Jonge Fan", subject_pl: "Chcę być jak Ty", subject_en: "I want to be like you", subject_de: "Ich möchte so sein wie du", subject_nl: "Ik wil zoals jij zijn", body_pl: "Rodzice kupili mi pierwszą tarczę pod choinkę. Marzę, żeby za kilka lat zagrać z Tobą na Mistrzostwach Świata!", body_en: "My parents bought me my first dartboard for Christmas. I dream of playing against you at the World Championship in a few years!", body_de: "Meine Eltern haben mir mein erstes Dartboard zu Weihnachten gekauft. Ich träume davon, in ein paar Jahren gegen dich bei der Weltmeisterschaft zu spielen!", body_nl: "Mijn ouders hebben me mijn eerste dartbord voor Kerstmis gekocht. Ik droom ervan om over een paar jaar tegen je te spelen op het Wereldkampioenschap!" },
    { sender_pl: "Dziennikarz", sender_en: "Journalist", sender_de: "Journalist", sender_nl: "Journalist", subject_pl: "Plotki", subject_en: "Rumors", subject_de: "Gerüchte", subject_nl: "Geruchten", body_pl: "Dotarły do nas słuchy, że zmieniasz sponsora sprzętowego. Czy zechciałbyś udzielić nam ekskluzywnego komentarza w tej sprawie?", body_en: "We've heard rumors that you're changing your equipment sponsor. Would you like to give us an exclusive comment on this matter?", body_de: "Wir haben Gerüchte gehört, dass du deinen Ausrüstungssponsor wechselst. Möchtest du uns einen exklusiven Kommentar zu dieser Angelegenheit geben?", body_nl: "We hebben geruchten gehoord dat je van materiaalsponsor verandert. Wil je ons hierover een exclusief commentaar geven?" },
    { sender_pl: "Kibic z Australii", sender_en: "Fan from Australia", sender_de: "Fan aus Australien", sender_nl: "Fan uit Australië", subject_pl: "Pozdrowienia z antypodów", subject_en: "Greetings from Down Under", subject_de: "Grüße von Down Under", subject_nl: "Groeten uit Down Under", body_pl: "Wstaję o 3 w nocy, żeby oglądać Twoje mecze. Rób swoje i nie oglądaj się na innych, masz tu wierne grono fanów!", body_en: "I wake up at 3 AM to watch your matches. Keep doing your thing and don't look at others, you have a loyal fan base here!", body_de: "Ich wache um 3 Uhr morgens auf, um deine Spiele anzusehen. Mach weiter dein Ding und schau nicht auf die anderen, du hast hier eine treue Fangemeinde!", body_nl: "Ik word om 3 uur 's nachts wakker om je wedstrijden te bekijken. Blijf je ding doen en kijk niet naar anderen, je hebt hier een trouwe schare fans!" },
    { sender_pl: "Firma kurierska", sender_en: "Courier Company", sender_de: "Kurierunternehmen", sender_nl: "Koeriersbedrijf", subject_pl: "Nieudana próba doręczenia", subject_en: "Failed delivery attempt", subject_de: "Fehlgeschlagener Zustellversuch", subject_nl: "Mislukte bezorgpoging", body_pl: "Kurier nie zastał Pana pod adresem domowym. Przesyłka ze sprzętem darterskim oczekuje w lokalnym punkcie odbioru.", body_en: "The courier did not find you at your home address. The package with darts equipment is waiting at the local pickup point.", body_de: "Der Kurier hat Sie unter Ihrer Privatadresse nicht angetroffen. Das Paket mit der Dartausrüstung wartet an der lokalen Abholstation.", body_nl: "De koerier trof u niet aan op uw huisadres. Het pakket met dartuitrusting wacht op het lokale ophaalpunt." },
    { sender_pl: "Dietetyk sportowy", sender_en: "Sports Dietitian", sender_de: "Sportdiätassistent", sender_nl: "Sportdiëtist", subject_pl: "Więcej wody", subject_en: "More water", subject_de: "Mehr Wasser", subject_nl: "Meer water", body_pl: "Proszę, pamiętaj o nawodnieniu w trakcie meczów, szczególnie na tych gorących halach pod reflektorami telewizyjnymi.", body_en: "Please remember to hydrate during matches, especially in those hot venues under the TV spotlights.", body_de: "Bitte denke daran, dich während der Spiele zu hydratisieren, besonders an diesen heißen Veranstaltungsorten unter den TV-Scheinwerfern.", body_nl: "Vergeet niet om te hydrateren tijdens wedstrijden, vooral op die hete locaties onder de tv-spots." },
    { sender_pl: "Hater", sender_en: "Hater", sender_de: "Hater", sender_nl: "Hater", subject_pl: "Emerytura", subject_en: "Retirement", subject_de: "Ruhestand", subject_nl: "Pensioen", body_pl: "Skończ już rzucać. Twoje ostatnie występy to jest jakaś kpina z tego pięknego sportu.", body_en: "Stop throwing already. Your recent performances are a mockery of this beautiful sport.", body_de: "Hör endlich auf zu werfen. Deine jüngsten Auftritte sind ein Hohn auf diesen schönen Sport.", body_nl: "Stop al met gooien. Je recente optredens zijn een aanfluiting van deze prachtige sport." },
    
    { 
        sender_pl: "Menedżer Hotelu", sender_en: "Hotel Manager", sender_de: "Hotelmanager", sender_nl: "Hotelmanager", 
        subject_pl: "Hałas w nocy", subject_en: "Noise at night", subject_de: "Lärm in der Nacht", subject_nl: "Lawaai 's nachts", 
        body_pl: "Goście z pokoju obok skarżyli się, że wczoraj rzucałeś do tarczy do 3 nad ranem. Proszę o zachowanie ciszy nocnej.", body_en: "Guests from the next room complained that you were throwing darts until 3 AM. Please respect quiet hours.", body_de: "Gäste aus dem Nachbarzimmer haben sich beschwert, dass du bis 3 Uhr morgens Darts geworfen hast. Bitte respektiere die Nachtruhe.", body_nl: "Gasten uit de kamer naast je klaagden dat je tot 3 uur 's nachts aan het darten was. Respecteer de nachtrust." 
    },
    { 
        sender_pl: "Była Dziewczyna", sender_en: "Ex-Girlfriend", sender_de: "Ex-Freundin", sender_nl: "Ex-vriendin", 
        subject_pl: "Widziałam Cię w TV", subject_en: "Saw you on TV", subject_de: "Habe dich im TV gesehen", subject_nl: "Zag je op tv", 
        body_pl: "Cześć... widziałam Twój wczorajszy mecz. Zmieniłeś się. Może skoczymy na kawę jak wrócisz z turnieju?", body_en: "Hi... I saw your match yesterday. You've changed. Maybe we could grab a coffee when you're back?", body_de: "Hi... ich habe dein Spiel gestern gesehen. Du hast dich verändert. Vielleicht können wir einen Kaffee trinken, wenn du zurück bist?", body_nl: "Hoi... ik zag je wedstrijd gisteren. Je bent veranderd. Misschien kunnen we koffie drinken als je terug bent?" 
    },
    { 
        sender_pl: "Wściekły Bukmacher", sender_en: "Angry Bettor", sender_de: "Wütender Wetter", sender_nl: "Boze Gokker", 
        subject_pl: "Zepsułeś mi życie!", subject_en: "You ruined my life!", subject_de: "Du hast mein Leben ruiniert!", subject_nl: "Je hebt mijn leven verpest!", 
        body_pl: "Postawiłem wypłatę na to, że zamkniesz lega z 170. Rzuciłeś w 5! Jesteś mi winien pieniądze!", body_en: "I bet my paycheck that you'd check out 170. You hit a 5! You owe me money!", body_de: "Ich habe mein Gehalt darauf gewettet, dass du 170 checkst. Du hast eine 5 getroffen! Du schuldest mir Geld!", body_nl: "Ik wedde mijn salaris dat je 170 zou uitgooien. Je gooide een 5! Je bent me geld schuldig!" 
    },
    { 
        sender_pl: "SPAM", sender_en: "SPAM", sender_de: "SPAM", sender_nl: "SPAM", 
        subject_pl: "Nigeryjski Książę Darta", subject_en: "Nigerian Darts Prince", subject_de: "Nigerianischer Darts-Prinz", subject_nl: "Nigeriaanse Darts Prins", 
        body_pl: "Witam. Mam do przekazania spadek po mistrzu darta z Nigerii. Wyślij mi 500 funtów, aby odblokować miliony.", body_en: "Hello. I have an inheritance from a Nigerian darts champion. Send me 500 pounds to unlock millions.", body_de: "Hallo. Ich habe ein Erbe von einem nigerianischen Darts-Champion. Sende mir 500 Pfund, um Millionen freizuschalten.", body_nl: "Hallo. Ik heb een erfenis van een Nigeriaanse dartskampioen. Stuur me 500 pond om miljoenen te ontgrendelen." 
    },
    { 
        sender_pl: "Producent Butów", sender_en: "Shoe Manufacturer", sender_de: "Schuhhersteller", sender_nl: "Schoenenfabrikant", 
        subject_pl: "Współpraca", subject_en: "Collab", subject_de: "Zusammenarbeit", subject_nl: "Samenwerking", 
        body_pl: "Mamy nowy model butów lakierowanych z wbudowaną amortyzacją do darta. Chcesz przetestować je na scenie?", body_en: "We have a new model of dress shoes with built-in cushioning for darts. Want to test them on stage?", body_de: "Wir haben ein neues Lackschuhmodell mit eingebauter Dämpfung für Darts. Möchtest du sie auf der Bühne testen?", body_nl: "We hebben een nieuw model lakschoenen met ingebouwde demping voor darten. Wil je ze testen op het podium?" 
    },
    { 
        sender_pl: "Dentysta", sender_en: "Dentist", sender_de: "Zahnarzt", sender_nl: "Tandarts", 
        subject_pl: "Wizyta kontrolna", subject_en: "Check-up", subject_de: "Kontrolltermin", subject_nl: "Controle", 
        body_pl: "Widziałem, jak zaciskasz zęby po pudłach. Zapraszam na wizytę kontrolną, zanim zetrzesz szkliwo!", body_en: "I saw you clenching your teeth after misses. Come in for a check-up before you wear down your enamel!", body_de: "Ich habe gesehen, wie du nach Fehlschüssen die Zähne zusammenbeißt. Komm zur Kontrolle, bevor dein Zahnschmelz abgenutzt ist!", body_nl: "Ik zag je tanden op elkaar klemmen na missers. Kom voor een controle voordat je je glazuur verslijt!" 
    },
    { 
        sender_pl: "Twórca Memów", sender_en: "Meme Creator", sender_de: "Meme-Ersteller", sender_nl: "Meme Maker", 
        subject_pl: "Hicior w sieci", subject_en: "Internet hit", subject_de: "Internet-Hit", subject_nl: "Internet hit", 
        body_pl: "Wrzuciłem Twoją minę po wczorajszym pudle na TikToka. Ma już 2 miliony wyświetleń! Jesteś legendą.", body_en: "I posted your face after yesterday's miss on TikTok. It has 2 million views! You're a legend.", body_de: "Ich habe dein Gesicht nach dem gestrigen Fehlschuss auf TikTok gepostet. Es hat 2 Millionen Aufrufe! Du bist eine Legende.", body_nl: "Ik heb je gezicht na de misser van gisteren op TikTok geplaatst. Het heeft 2 miljoen views! Je bent een legende." 
    },
    { 
        sender_pl: "Producent Muzyczny", sender_en: "Music Producer", sender_de: "Musikproduzent", sender_nl: "Muziekproducent", 
        subject_pl: "Nowy Walk-on", subject_en: "New Walk-on", subject_de: "Neuer Walk-on", subject_nl: "Nieuwe Walk-on", 
        body_pl: "Mogę zremiksować Twój utwór na wejście dodając ciężkie basy. Fani oszaleją. Koszt to tylko £300.", body_en: "I can remix your walk-on track adding heavy bass. Fans will go crazy. Cost is only £300.", body_de: "Ich kann deinen Walk-on-Track mit schweren Bässen remixen. Die Fans werden ausrasten. Kostet nur £300.", body_nl: "Ik kan je walk-on nummer remixen met zware bassen. Fans zullen gek worden. Kost slechts £300." 
    },
    { 
        sender_pl: "Stary Nauczyciel", sender_en: "Old Teacher", sender_de: "Alter Lehrer", sender_nl: "Oude Leraar", 
        subject_pl: "Gratulacje", subject_en: "Congratulations", subject_de: "Herzlichen Glückwunsch", subject_nl: "Gefeliciteerd", 
        body_pl: "Zawsze powtarzałem, że matematyka przyda Ci się w życiu. Świetne liczenie w końcówkach. Jestem dumny!", body_en: "I always said math would be useful in your life. Great counting on the checkouts. I'm proud!", body_de: "Ich habe immer gesagt, Mathematik wird im Leben nützlich sein. Tolles Zählen bei den Checkouts. Ich bin stolz!", body_nl: "Ik zei altijd al dat wiskunde nuttig zou zijn in je leven. Geweldig rekenwerk bij de checkouts. Ik ben trots!" 
    },
    { 
        sender_pl: "Rywal z PDC", sender_en: "PDC Rival", sender_de: "PDC-Rivale", sender_nl: "PDC Rivaal", 
        subject_pl: "Sparing?", subject_en: "Practice?", subject_de: "Sparring?", subject_nl: "Oefenen?", 
        body_pl: "Jestem w Twoim mieście w ten weekend. Chcesz wynająć pokój w pubie i porzucać do tarczy bez presji?", body_en: "I'm in your city this weekend. Want to rent a room in a pub and throw some darts without pressure?", body_de: "Ich bin dieses Wochenende in deiner Stadt. Willst du einen Raum in einem Pub mieten und ohne Druck ein paar Darts werfen?", body_nl: "Ik ben dit weekend in jouw stad. Wil je een kamer huren in een pub en zonder druk wat darten?" 
    },
    { 
        sender_pl: "Fundacja Dziecięca", sender_en: "Children's Charity", sender_de: "Kinderhilfswerk", sender_nl: "Kindergoed Doel", 
        subject_pl: "Aukcja charytatywna", subject_en: "Charity auction", subject_de: "Wohltätigkeitsauktion", subject_nl: "Liefdadigheidsveiling", 
        body_pl: "Czy zechciałbyś przekazać swoją meczową koszulkę na naszą aukcję? Bardzo pomożesz potrzebującym dzieciom.", body_en: "Would you be willing to donate your match shirt for our auction? It will greatly help children in need.", body_de: "Wärst du bereit, dein Spielhemd für unsere Auktion zu spenden? Das würde bedürftigen Kindern sehr helfen.", body_nl: "Zou je je wedstrijdshirt willen doneren voor onze veiling? Het zal kinderen in nood enorm helpen." 
    },
    { 
        sender_pl: "Urząd Skarbowy", sender_en: "Tax Office", sender_de: "Finanzamt", sender_nl: "Belastingdienst", 
        subject_pl: "Rozliczenie nagród", subject_en: "Prize money tax", subject_de: "Preisgeldsteuer", subject_nl: "Belasting prijzengeld", 
        body_pl: "Zauważyliśmy wzrost Pana dochodów. Prosimy o zgłoszenie się do urzędu celem wyjaśnienia kwestii podatku od wygranych.", body_en: "We noticed an increase in your income. Please report to the office to clarify the tax on your winnings.", body_de: "Wir haben einen Anstieg Ihres Einkommens festgestellt. Bitte melden Sie sich beim Amt, um die Steuern auf Ihre Gewinne zu klären.", body_nl: "We hebben een stijging van uw inkomen opgemerkt. Meld u zich bij het kantoor om de belasting over uw winsten te verduidelijken." 
    },
    { 
        sender_pl: "Kolega z liceum", sender_en: "High School Buddy", sender_de: "Schulfreund", sender_nl: "Middelbare School Vriend", 
        subject_pl: "Bilety VIP?", subject_en: "VIP Tickets?", subject_de: "VIP-Tickets?", subject_nl: "VIP-tickets?", 
        body_pl: "Siemka! Pamiętasz mnie z chemii? Super Ci idzie. Dałbyś radę załatwić mi 4 darmowe bilety na Mistrzostwa?", body_en: "Hey! Remember me from chemistry? You're doing great. Could you get me 4 free tickets to the Championship?", body_de: "Hey! Erinnerst du dich an mich aus der Chemie? Du machst das super. Könntest du mir 4 Freikarten für die Meisterschaft besorgen?", body_nl: "Hé! Ken je me nog van scheikunde? Je doet het geweldig. Kun je me 4 gratis kaartjes voor het kampioenschap bezorgen?" 
    },
    { 
        sender_pl: "Nawiedzony Fan", sender_en: "Crazy Fan", sender_de: "Verrückter Fan", sender_nl: "Gekke Fan", 
        subject_pl: "Wiem, gdzie mieszkasz", subject_en: "I know where you live", subject_de: "Ich weiß, wo du wohnst", subject_nl: "Ik weet waar je woont", 
        body_pl: "Nie martw się, nie przyjdę! Ale ten nowy kolor rolet w salonie bardzo do Ciebie pasuje. Rzucaj same 180!", body_en: "Don't worry, I won't come over! But that new blind color in your living room really suits you. Hit only 180s!", body_de: "Keine Sorge, ich komme nicht vorbei! Aber die neue Farbe der Jalousien in deinem Wohnzimmer steht dir wirklich gut. Wirf nur 180er!", body_nl: "Maak je geen zorgen, ik kom niet langs! Maar die nieuwe kleur jaloezieën in je woonkamer staat je echt goed. Gooi alleen 180s!" 
    },
    { 
        sender_pl: "Agent Nieruchomości", sender_en: "Real Estate Agent", sender_de: "Immobilienmakler", sender_nl: "Makelaar", 
        subject_pl: "Nowa posiadłość", subject_en: "New mansion", subject_de: "Neues Anwesen", subject_nl: "Nieuw landhuis", 
        body_pl: "Gratulacje wygranych! Może czas wymienić mieszkanie na wille z basenem i prywatną salą treningową?", body_en: "Congrats on your wins! Maybe it's time to upgrade your flat to a mansion with a pool and a private practice room?", body_de: "Glückwunsch zu deinen Siegen! Vielleicht ist es Zeit, deine Wohnung gegen eine Villa mit Pool und privatem Trainingsraum einzutauschen?", body_nl: "Gefeliciteerd met je winst! Misschien is het tijd om je appartement in te ruilen voor een landhuis met een zwembad en een privé oefenruimte?" 
    },
    { 
        sender_pl: "Linie Lotnicze", sender_en: "Airlines", sender_de: "Fluggesellschaft", sender_nl: "Luchtvaartmaatschappij", 
        subject_pl: "Opóźniony lot", subject_en: "Flight delayed", subject_de: "Flug verspätet", subject_nl: "Vlucht vertraagd", 
        body_pl: "Twój lot do Niemiec na kolejny turniej Continental Tour jest opóźniony o 4 godziny. Przepraszamy za niedogodności.", body_en: "Your flight to Germany for the next Continental Tour is delayed by 4 hours. We apologize for the inconvenience.", body_de: "Dein Flug nach Deutschland zur nächsten Continental Tour hat 4 Stunden Verspätung. Wir entschuldigen uns für die Unannehmlichkeiten.", body_nl: "Je vlucht naar Duitsland voor de volgende Continental Tour is met 4 uur vertraagd. Onze excuses voor het ongemak." 
    },
    { 
        sender_pl: "Siłownia", sender_en: "Gym", sender_de: "Fitnessstudio", sender_nl: "Sportschool", 
        subject_pl: "Koniec karnetu", subject_en: "Membership expired", subject_de: "Mitgliedschaft abgelaufen", subject_nl: "Abonnement verlopen", 
        body_pl: "Twój roczny karnet dobiega końca. W rzutkach też trzeba dbać o kondycję. Kliknij tu, aby odnowić subskrypcję.", body_en: "Your annual membership is ending. In darts, you also need to stay in shape. Click here to renew your subscription.", body_de: "Deine Jahresmitgliedschaft endet. Auch beim Darts musst du in Form bleiben. Klicke hier, um dein Abo zu erneuern.", body_nl: "Je jaarabonnement loopt af. In darts moet je ook in vorm blijven. Klik hier om je abonnement te verlengen." 
    },
    { 
        sender_pl: "Masażysta", sender_en: "Masseur", sender_de: "Masseur", sender_nl: "Masseur", 
        subject_pl: "Napięcie w barku", subject_en: "Shoulder tension", subject_de: "Schulterverspannung", subject_nl: "Schouderspanning", 
        body_pl: "Zauważyłem w TV, że dziwnie układasz prawy bark. Zarezerwuj wizytę, zanim nabawisz się przewlekłej kontuzji.", body_en: "I noticed on TV that you're holding your right shoulder weirdly. Book a visit before you get a chronic injury.", body_de: "Mir ist im TV aufgefallen, dass du deine rechte Schulter seltsam hältst. Buche einen Termin, bevor du dich chronisch verletzt.", body_nl: "Ik zag op tv dat je je rechterschouder raar vasthoudt. Boek een afspraak voordat je een chronische blessure oploopt." 
    },
    { 
        sender_pl: "Hater", sender_en: "Hater", sender_de: "Hater", sender_nl: "Hater", 
        subject_pl: "Wygrałeś fuksem", subject_en: "You got lucky", subject_de: "Du hattest Glück", subject_nl: "Je had geluk", 
        body_pl: "Przeciwnik miał gorszy dzień, a Ty myślisz, że jesteś bogiem darta. Prawda jest taka, że jesteś średniakiem.", body_en: "Your opponent had a bad day, and you think you're the god of darts. The truth is, you're just average.", body_de: "Dein Gegner hatte einen schlechten Tag, und du denkst, du bist der Darts-Gott. Die Wahrheit ist, du bist nur Durchschnitt.", body_nl: "Je tegenstander had een slechte dag en jij denkt dat je de god van darts bent. De waarheid is, je bent gewoon gemiddeld." 
    },
    { 
        sender_pl: "Producent Telewizyjny", sender_en: "TV Producer", sender_de: "TV-Produzent", sender_nl: "TV Producent", 
        subject_pl: "Reality Show", subject_en: "Reality Show", subject_de: "Reality-Show", subject_nl: "Reality Show", 
        body_pl: "Tworzymy nowy program 'Taniec z Darterami'. Szukamy charyzmatycznych graczy. Jesteś zainteresowany?", body_en: "We're making a new show 'Dancing with Darts Players'. We are looking for charismatic players. Are you interested?", body_de: "Wir machen eine neue Show 'Dancing with Darts Players'. Wir suchen charismatische Spieler. Bist du interessiert?", body_nl: "We maken een nieuwe show 'Dancing with Darts Players'. We zijn op zoek naar charismatische spelers. Ben je geïnteresseerd?" 
    },
    { 
        sender_pl: "Sąsiad", sender_en: "Neighbour", sender_de: "Nachbar", sender_nl: "Buurman", 
        subject_pl: "Paczka", subject_en: "Package", subject_de: "Paket", subject_nl: "Pakketje", 
        body_pl: "Hej, odebrałem za Ciebie wielką paczkę od jakiegoś sponsora. Kiedy wracasz z tego turnieju? Zajmuje mi pół przedpokoju.", body_en: "Hey, I received a huge package for you from some sponsor. When are you back from the tour? It's taking up half my hallway.", body_de: "Hey, ich habe ein riesiges Paket von einem Sponsor für dich angenommen. Wann kommst du vom Turnier zurück? Es nimmt meinen halben Flur ein.", body_nl: "Hé, ik heb een enorm pakket voor je aangenomen van een sponsor. Wanneer ben je terug van het toernooi? Het neemt mijn halve gang in beslag." 
    },
    { 
        sender_pl: "Wynajmujący", sender_en: "Landlord", sender_de: "Vermieter", sender_nl: "Huisbaas", 
        subject_pl: "Dziury w ścianie", subject_en: "Holes in the wall", subject_de: "Löcher in der Wand", subject_nl: "Gaten in de muur", 
        body_pl: "Byłem w Twoim mieszkaniu. Dlaczego ściana dookoła tarczy jest cała w dziurach? Będziesz musiał pokryć koszty malowania!", body_en: "I visited your flat. Why is the wall around the dartboard full of holes? You will have to cover the painting costs!", body_de: "Ich war in deiner Wohnung. Warum ist die Wand um das Dartboard herum voller Löcher? Du musst die Streichkosten übernehmen!", body_nl: "Ik ben in je appartement geweest. Waarom zit de muur rond het dartbord vol gaten? Je zult de schilderkosten moeten betalen!" 
    },
    { 
        sender_pl: "Klub Rzutkowy", sender_en: "Local Darts Club", sender_de: "Lokaler Dartverein", sender_nl: "Lokale Dartclub", 
        subject_pl: "Mistrzostwa Pubu", subject_en: "Pub Championship", subject_de: "Pub-Meisterschaft", subject_nl: "Pub Kampioenschap", 
        body_pl: "Wiemy, że grasz w Pro Tourze, ale może wpadniesz w czwartek bronić tytułu mistrza naszego osiedlowego pubu?", body_en: "We know you play on the Pro Tour, but maybe you'll drop by on Thursday to defend your local pub championship title?", body_de: "Wir wissen, dass du auf der Pro Tour spielst, aber vielleicht kommst du am Donnerstag vorbei, um deinen lokalen Pub-Meistertitel zu verteidigen?", body_nl: "We weten dat je op de Pro Tour speelt, maar misschien kom je donderdag langs om je lokale pubkampioenschapstitel te verdedigen?" 
    },
    { 
        sender_pl: "Kolekcjoner", sender_en: "Collector", sender_de: "Sammler", sender_nl: "Verzamelaar", 
        subject_pl: "Kupię Twoje lotki", subject_en: "Buying your darts", subject_de: "Kaufe deine Darts", subject_nl: "Koop je pijlen", 
        body_pl: "Dam £1000 za zestaw lotek, którymi wrzuciłeś swoją pierwszą telewizyjną 180-tkę. Odbiór osobisty w Londynie.", body_en: "I'll give you £1000 for the set of darts you used to throw your first televised 180. Personal collection in London.", body_de: "Ich gebe dir £1000 für das Dartset, mit dem du deine erste 180 im Fernsehen geworfen hast. Persönliche Abholung in London.", body_nl: "Ik geef je £1000 voor de set pijlen waarmee je je eerste tv 180 gooide. Persoonlijk afhalen in Londen." 
    },
    { 
        sender_pl: "Trener Psów", sender_en: "Dog Trainer", sender_de: "Hundetrainer", sender_nl: "Hondentrainer", 
        subject_pl: "Twój pies", subject_en: "Your dog", subject_de: "Dein Hund", subject_nl: "Je hond", 
        body_pl: "Twój pies znowu zjadł zapasowe piórka. Musisz chować sprzęt darterski poza jego zasięgiem!", body_en: "Your dog ate the spare flights again. You need to keep your darts gear out of his reach!", body_de: "Dein Hund hat schon wieder die Ersatzflights gefressen. Du musst deine Dartausrüstung außer seiner Reichweite aufbewahren!", body_nl: "Je hond heeft de reserve flights weer opgegeten. Je moet je dartspullen buiten zijn bereik houden!" 
    },
    { 
        sender_pl: "Dziennikarz Tabloidu", sender_en: "Tabloid Journalist", sender_de: "Boulevardjournalist", sender_nl: "Tabloid Journalist", 
        subject_pl: "Zdjęcia z klubu", subject_en: "Photos from the club", subject_de: "Fotos aus dem Club", subject_nl: "Foto's uit de club", 
        body_pl: "Mamy kompromitujące zdjęcia z Twojego wczorajszego świętowania. Jeśli nie udzielisz nam wywiadu, opublikujemy je jutro.", body_en: "We have compromising photos of your celebration last night. If you don't give us an interview, we will publish them tomorrow.", body_de: "Wir haben kompromittierende Fotos von deiner gestrigen Feier. Wenn du uns kein Interview gibst, veröffentlichen wir sie morgen.", body_nl: "We hebben compromitterende foto's van je feest gisteravond. Als je ons geen interview geeft, publiceren we ze morgen." 
    },
    { 
        sender_pl: "Menedżer", sender_en: "Manager", sender_de: "Manager", sender_nl: "Manager", 
        subject_pl: "Wywiad dla radio", subject_en: "Radio interview", subject_de: "Radio-Interview", subject_nl: "Radio-interview", 
        body_pl: "Załatwiłem Ci wejście do porannego pasma w radiu. Pamiętaj: unikaj tematów o alkoholu i promuj zdrowy sport!", body_en: "I got you a spot on the morning radio show. Remember: avoid talking about alcohol and promote healthy sports!", body_de: "Ich habe dir einen Platz in der Morgen-Radioshow besorgt. Denk dran: Vermeide Alkoholthemen und bewirb gesunden Sport!", body_nl: "Ik heb een plekje voor je geregeld in de ochtendradioshow. Onthoud: vermijd praten over alcohol en promoot gezonde sporten!" 
    },
    { 
        sender_pl: "Sklep Internetowy", sender_en: "Online Store", sender_de: "Online-Shop", sender_nl: "Webshop", 
        subject_pl: "Wysyłka zamówienia", subject_en: "Order shipped", subject_de: "Bestellung versandt", subject_nl: "Bestelling verzonden", 
        body_pl: "Twój nowy zapas 50 kompletów piórek i szaftów został wysłany. Życzymy samych podwójnych!", body_en: "Your new supply of 50 sets of flights and shafts has been shipped. We wish you nothing but doubles!", body_de: "Dein neuer Vorrat an 50 Sets Flights und Schäften wurde versandt. Wir wünschen dir nur Doubles!", body_nl: "Je nieuwe voorraad van 50 sets flights en shafts is verzonden. We wensen je alleen maar doubles!" 
    },
    { 
        sender_pl: "Brat", sender_en: "Brother", sender_de: "Bruder", sender_nl: "Broer", 
        subject_pl: "Darmowe piwo", subject_en: "Free beer", subject_de: "Freibier", subject_nl: "Gratis bier", 
        body_pl: "Od kiedy jesteś w TOP rankingach, w lokalnym pubie stawiają mi kolejki za to, że jesteśmy braćmi. Dzięki, braszku!", body_en: "Since you're in the top rankings, the local pub buys me rounds just for being your brother. Thanks, bro!", body_de: "Seitdem du in den Top-Ranglisten bist, gibt mir der lokale Pub Runden aus, nur weil wir Brüder sind. Danke, Bruder!", body_nl: "Sinds je in de top ranking staat, geeft de lokale kroeg me rondjes omdat we broers zijn. Bedankt, broer!" 
    },
    { 
        sender_pl: "Gracz Fantasy Darts", sender_en: "Fantasy Darts Player", sender_de: "Fantasy Darts-Spieler", sender_nl: "Fantasy Darts Speler", 
        subject_pl: "Nie zawiedź mnie", subject_en: "Don't let me down", subject_de: "Lass mich nicht im Stich", subject_nl: "Stel me niet teleur", 
        body_pl: "Ustawiłem Cię na kapitana mojej drużyny w Fantasy Darts. Rzucaj dużo 180, bo walczę o konsolę w nagrodę główną!", body_en: "I made you the captain of my Fantasy Darts team. Throw a lot of 180s, I'm fighting for a console as the main prize!", body_de: "Ich habe dich zum Kapitän meines Fantasy Darts-Teams gemacht. Wirf viele 180er, ich kämpfe um eine Konsole als Hauptpreis!", body_nl: "Ik heb je de aanvoerder van mijn Fantasy Darts-team gemaakt. Gooi veel 180s, ik vecht voor een console als hoofdprijs!" 
    },
    { 
        sender_pl: "Wydawca Gry", sender_en: "Game Publisher", sender_de: "Spiele-Herausgeber", sender_nl: "Speluitgever", 
        subject_pl: "Prawa do wizerunku", subject_en: "Image rights", subject_de: "Bildrechte", subject_nl: "Portretrechten", 
        body_pl: "Chcemy umieścić Twoją postać w naszej najnowszej konsolowej grze o darta. Podeślemy kontrakt wkrótce.", body_en: "We want to feature your character in our newest console darts game. We'll send the contract soon.", body_de: "Wir möchten deinen Charakter in unserem neuesten Konsolen-Dartspiel verwenden. Wir senden den Vertrag in Kürze.", body_nl: "We willen je personage in ons nieuwste console dartspel gebruiken. We sturen het contract binnenkort." 
    },
    { 
        sender_pl: "Anonim", sender_en: "Anonymous", sender_de: "Anonym", sender_nl: "Anoniem", 
        subject_pl: "Wiem jak oszukiwać", subject_en: "I know how to cheat", subject_de: "Ich weiß, wie man betrügt", subject_nl: "Ik weet hoe je moet valsspelen", 
        body_pl: "Znam sekretny sposób na szlifowanie grotów, by wywoływać bouncery u przeciwników. Płatność tylko w krypto.", body_en: "I know a secret way to sharpen points to cause bounce-outs for your opponents. Payment in crypto only.", body_de: "Ich kenne eine geheime Methode, um Spitzen so zu schärfen, dass sie beim Gegner Bouncer verursachen. Zahlung nur in Krypto.", body_nl: "Ik ken een geheime manier om punten te slijpen om bounce-outs bij je tegenstanders te veroorzaken. Betaling alleen in crypto." 
    },
    { 
        sender_pl: "Kolega z touru", sender_en: "Tour Buddy", sender_de: "Tour-Kollege", sender_nl: "Tourbuddy", 
        subject_pl: "Zatrucie...", subject_en: "Food poisoning...", subject_de: "Lebensmittelvergiftung...", subject_nl: "Voedselvergiftiging...", 
        body_pl: "Zjadłem wczoraj ostrygi i wycofuję się z turnieju. Uważaj na bufet na hali, bo spędzisz dzień w toalecie.", body_en: "I ate oysters yesterday and I'm withdrawing from the tournament. Watch out for the buffet at the venue or you'll spend the day in the toilet.", body_de: "Ich habe gestern Austern gegessen und ziehe mich aus dem Turnier zurück. Pass auf das Buffet in der Halle auf, sonst verbringst du den Tag auf der Toilette.", body_nl: "Ik heb gisteren oesters gegeten en trek me terug uit het toernooi. Pas op voor het buffet in de hal, anders breng je de dag door op het toilet." 
    },
    { 
        sender_pl: "Starszy Pan z Pubu", sender_en: "Old Man from Pub", sender_de: "Alter Mann aus dem Pub", sender_nl: "Oude Man uit Pub", 
        subject_pl: "Złe nawyki", subject_en: "Bad habits", subject_de: "Schlechte Angewohnheiten", subject_nl: "Slechte gewoontes", 
        body_pl: "Obserwuję twój rzut od lat. Zauważyłem, że minimalnie opuszczasz łokieć przy ostatniej lotce. Zwróć na to uwagę.", body_en: "I've been watching your throw for years. I noticed you drop your elbow slightly on the last dart. Pay attention to that.", body_de: "Ich beobachte deinen Wurf seit Jahren. Mir ist aufgefallen, dass du beim letzten Dart den Ellenbogen leicht senkst. Achte darauf.", body_nl: "Ik kijk al jaren naar je worp. Het viel me op dat je je elleboog iets laat zakken bij de laatste pijl. Let daar op." 
    },
    { 
        sender_pl: "SPAM", sender_en: "SPAM", sender_de: "SPAM", sender_nl: "SPAM", 
        subject_pl: "Powiększ swój...", subject_en: "Enlarge your...", subject_de: "Vergrößern Sie Ihre...", subject_nl: "Vergroot je...", 
        body_pl: "...arsenał lotek o naszą najnowszą dostawę złotych grotów! Zamów teraz z 50% zniżką.", body_en: "...dart arsenal with our newest shipment of gold points! Order now with a 50% discount.", body_de: "...Dart-Arsenal mit unserer neuesten Lieferung von Goldspitzen! Bestellen Sie jetzt mit 50% Rabatt.", body_nl: "...dartarsenaal met onze nieuwste lading gouden punten! Bestel nu met 50% korting." 
    },
    { 
        sender_pl: "Psycholog Darta", sender_en: "Darts Psychologist", sender_de: "Darts-Psychologe", sender_nl: "Darts Psycholoog", 
        subject_pl: "Presja na podwójnych", subject_en: "Pressure on doubles", subject_de: "Druck auf Doubles", subject_nl: "Druk op doubles", 
        body_pl: "Chcesz przestać trzęść się przy rzutach kończących? Zapraszam na warsztaty mentalne w przyszły wtorek.", body_en: "Want to stop shaking on finishing throws? I invite you to mental workshops next Tuesday.", body_de: "Willst du beim Checkout nicht mehr zittern? Ich lade dich nächsten Dienstag zu mentalen Workshops ein.", body_nl: "Wil je stoppen met trillen bij checkouts? Ik nodig je aanstaande dinsdag uit voor mentale workshops." 
    },
    { 
        sender_pl: "Producent Tarczy", sender_en: "Dartboard Manufacturer", sender_de: "Dartboard-Hersteller", sender_nl: "Dartbord Fabrikant", 
        subject_pl: "Nowy Sizal", subject_en: "New Sisal", subject_de: "Neues Sisal", subject_nl: "Nieuw Sisal", 
        body_pl: "Stworzyliśmy nowy, bezszwowy rodzaj tarczy. Chcemy wysłać Ci prototyp do testów. Oczekuj kuriera wkrótce.", body_en: "We've created a new, seamless type of board. We want to send you a prototype for testing. Expect a courier soon.", body_de: "Wir haben eine neue, nahtlose Art von Board entwickelt. Wir möchten dir einen Prototyp zum Testen senden. Erwarte bald einen Kurier.", body_nl: "We hebben een nieuw, naadloos type bord gemaakt. We willen je een prototype sturen om te testen. Verwacht binnenkort een koerier." 
    },
    { 
        sender_pl: "Osobisty Trener", sender_en: "Personal Trainer", sender_de: "Personal Trainer", sender_nl: "Personal Trainer", 
        subject_pl: "Zadbaj o core", subject_en: "Core strength", subject_de: "Rumpfmuskulatur", subject_nl: "Core stabiliteit", 
        body_pl: "Stabilność rzutu zaczyna się od brzucha i pleców. Nie omijaj treningu siłowego, to widać na długich turniejach.", body_en: "Throw stability starts from the core. Don't skip strength training, it shows in long tournaments.", body_de: "Wurfstabilität beginnt in der Rumpfmuskulatur. Überspringe kein Krafttraining, das macht sich in langen Turnieren bemerkbar.", body_nl: "Werpstabiliteit begint bij de core. Sla krachttraining niet over, het is te zien in lange toernooien." 
    },
    { 
        sender_pl: "E-Sport Event", sender_en: "Esports Event", sender_de: "Esport-Event", sender_nl: "Esports Evenement", 
        subject_pl: "Turniej Gwiazd", subject_en: "Star Tournament", subject_de: "Star-Turnier", subject_nl: "Sterren Toernooi", 
        body_pl: "Szukamy profesjonalnych graczy w darta, którzy chcieliby zagrać w wirtualnego darta z YouTuberami na streamie charytatywnym.", body_en: "We are looking for professional darts players who would like to play virtual darts with YouTubers on a charity stream.", body_de: "Wir suchen professionelle Darts-Spieler, die Lust haben, in einem Charity-Stream virtuelles Darts mit YouTubern zu spielen.", body_nl: "We zijn op zoek naar professionele darters die virtueel willen darten met YouTubers op een liefdadigheidsstream." 
    },
    { 
        sender_pl: "Oszust Biletowy", sender_en: "Ticket Scammer", sender_de: "Ticket-Betrüger", sender_nl: "Ticket Oplichter", 
        subject_pl: "Kupię wejściówki", subject_en: "Buying tickets", subject_de: "Kaufe Tickets", subject_nl: "Koop tickets", 
        body_pl: "Odkupię od Ciebie za potrójną cenę zaproszenia dla graczy, żeby móc kręcić się po zapleczu z VIP-ami. Wchodzisz w to?", body_en: "I'll buy your player guest passes for triple the price so I can hang around backstage with VIPs. Are you in?", body_de: "Ich kaufe dir deine Spieler-Gästepässe zum dreifachen Preis ab, damit ich mich mit VIPs im Backstage-Bereich herumtreiben kann. Bist du dabei?", body_nl: "Ik koop je gastenpassen voor spelers voor drie keer de prijs, zodat ik backstage kan rondhangen met VIPs. Doe je mee?" 
    }

    
];


        function advanceDay() {
            if (activeTournament && !activeTournament.completed) {
                const messages = {
                    pl: 'Najpierw dokończ turniej albo wybierz opcję „Odpuść turniej”.',
                    en: 'Finish the tournament first or choose “Skip tournament”.',
                    de: 'Beende zuerst das Turnier oder wähle „Turnier überspringen“.',
                    nl: 'Maak eerst het toernooi af of kies „Toernooi overslaan“. '
                };
                alert(messages[currentLang] || messages.en);
                return;
            }

            currentDate.setDate(currentDate.getDate() + 1);
            updateDateDisplay();

            if(typeof player.stamina !== 'undefined') player.stamina = Math.min(100, player.stamina + 10); // Odzyskuje 10% dziennie 

            // --- Wypłaty i reset na początku miesiąca/roku ---
            if (currentDate.getDate() === 1) {
                
                // 1. Zwykłe rozliczenia sponsorskie
                let totalSponsorship = 0;
                if (player.activeSponsors && player.activeSponsors.length > 0) {
                    player.activeSponsors.forEach(s => { totalSponsorship += s.monthlyValue; s.months--; });
                    player.activeSponsors = player.activeSponsors.filter(s => s.months > 0);
                }
                if (player.technicalPartner) {
                    totalSponsorship += player.technicalPartner.monthlyValue;
                    player.technicalPartner.months--;
                    if(player.technicalPartner.months <= 0) player.technicalPartner = null;
                }
                if (totalSponsorship > 0) {
                    player.budget += totalSponsorship;
                    let subSpon = t('t-email-spon-sub');
                    let bodySpon = t('t-email-spon-body').replace('{amount}', totalSponsorship.toLocaleString('en-GB'));
                    addEmail(t('t-sender-acc'), subSpon, bodySpon);
                    generateOffers(); updateHub();
                }

                // 2. NOWOŚĆ: Reset rankingu Players Championship (1 stycznia)
                if (currentDate.getMonth() === 0) {
                    const completedYear = currentDate.getFullYear() - 1;
                    addCareerChronicleEvent('season', {
                        year: completedYear,
                        rank: getPlayerRank('main'),
                        prize: player.prizeMoney || 0,
                        timestamp: new Date(completedYear, 11, 31).getTime()
                    });
                    if (typeof processAnnualPlayerLifecycle === 'function') {
                        processAnnualPlayerLifecycle(completedYear);
                    }
                    player.pcPrizeMoney = 0;
                    if (typeof pdcPlayers !== 'undefined') {
                        pdcPlayers.forEach(p => p.pcPrizeMoney = 0);
                    }
                    if (typeof tournamentDatabase !== 'undefined') {
                        tournamentDatabase.forEach(tournament => {
                            tournament.completed = false;
                            tournament.historyLogs = '';
                        });
                    }
                    gdlTable = [];
                    resetAllPlayerSeasonStats(currentDate.getFullYear());
                    if (typeof resetWorldMastersSeason === 'function') resetWorldMastersSeason(currentDate.getFullYear());
                    
                    // Powiadomienie e-mail o nowym sezonie
                    addEmail(t('t-sender-league'), t('t-email-newyear-sub'), t('t-email-newyear-body'));
                    updateHub();
                }
            }
            if (currentDate.getDate() === 1 || currentDate.getDate() === 15) saveGame(true);

            // --- Kwalifikacje do Ligi (1 lutego) ---
            if (currentDate.getMonth() === 1 && currentDate.getDate() === 1) {
                let oomRanked = [...pdcPlayers.filter(candidate => candidate.hasTourCard !== false), player]
                    .sort((a,b) => b.prizeMoney - a.prizeMoney);
                gdlTable = [];
                // Top 4 Order of Merit
                oomRanked.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                // Losowi 4 gracze z miejsc 5-12
                let candidates = shuffle(oomRanked.slice(4, 12));
                candidates.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                
                let isMeSelected = gdlTable.some(g => isCurrentPlayer(g.player));
                let leagueName = pdcPlayers.some(p => p.name === "Luke Littler") ? "Premier League" : "Global Darts League";
                
                let bodyStr = isMeSelected 
                    ? t('t-email-league-qual-yes').replace('{league}', leagueName)
                    : t('t-email-league-qual-no').replace('{league}', leagueName);
                addEmail(t('t-sender-league'), t('t-email-league-qual-sub').replace('{league}', leagueName), bodyStr);
            }
            // -----------------------------------------------------

            document.getElementById('tile-tournament').style.display = 'none';

            if (typeof tournamentDatabase !== 'undefined') {
                const todayTournament = tournamentDatabase.find(t_tour => t_tour.month === currentDate.getMonth() && t_tour.day === currentDate.getDate());
                if (todayTournament) {
                    const tournamentDisplayName = typeof getTournamentDisplayName === 'function'
                        ? getTournamentDisplayName(todayTournament)
                        : todayTournament.name;
                    if (typeof handleWorldMastersTournamentDay === 'function') handleWorldMastersTournamentDay(todayTournament);
                    let formatWarning = todayTournament.format === 'DIDO' ? t('t-alert-tour-dido') : "";
                    
                    let subjectToday = t('t-email-tour-today-sub').replace('{tour}', tournamentDisplayName);
                    let bodyToday = t('t-email-tour-today-body').replace('{city}', t(todayTournament.city));
                    addEmail(t('t-sender-org'), subjectToday, bodyToday);
                    
                    alert(`${t('t-alert-tour-start')} ${tournamentDisplayName}!${formatWarning}`);

                    const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function'
                        && isContinentalQualifierTournament(todayTournament);
                    const playerHasDirectContinentalEntry = isContinentalQualifier
                        && typeof isCareerPlayerDirectlyQualifiedForContinentalTour === 'function'
                        && isCareerPlayerDirectlyQualifiedForContinentalTour(todayTournament);
                    if (playerHasDirectContinentalEntry) {
                        // Zawodnik z miejsc rankingowych ma już gwarantowany start w
                        // turnieju głównym. Kwalifikacje rozstrzygamy w tle, aby nie
                        // blokowały mu kalendarza ani nie wymagały kliknięcia „Odpuść”.
                        activeTournament = todayTournament;
                        startTournament();
                        return;
                    }
                    
                    if (player.overall >= todayTournament.minOvr) {
                        activeTournament = todayTournament;
                        document.getElementById('tour-name-display').innerText = tournamentDisplayName;
                        document.getElementById('tile-tournament').style.display = 'block';
                    } else {
                        let subNoQual = t('t-email-no-qual-sub');
                        let bodyNoQual = t('t-email-no-qual-body').replace('{tour}', tournamentDisplayName);
                        addEmail(t('t-sender-org'), subNoQual, bodyNoQual);
                    }
                    return; 
                }
            }
            
            if (Math.random() < 0.15 && typeof randomEventsDatabase !== 'undefined') { triggerRandomEvent(); return; }
            if (Math.random() < 0.12) { 
                let randomMail = randomEmailsDB[Math.floor(Math.random() * randomEmailsDB.length)];
                addEmail(randomMail.sender_pl, randomMail.subject_pl, randomMail.body_pl); 
            }
        }
        // Zmodyfikuj funkcję dodawania e-maili
    function addEmail(senderKey, subjectKey, bodyKey) {
    const langSuffix = `_${currentLang}`;
    
    // Szukaj w bazie losowych e-maili
    const emailTemplate = randomEmailsDB.find(e => 
        (e[`sender${langSuffix}`] === senderKey || e.sender_pl === senderKey)
    );
    
    if (emailTemplate) {
        const sender = emailTemplate[`sender${langSuffix}`] || emailTemplate.sender_pl;
        const subject = emailTemplate[`subject${langSuffix}`] || emailTemplate.subject_pl;
        const body = emailTemplate[`body${langSuffix}`] || emailTemplate.body_pl;
        
        emails.unshift({ sender, subject, body, date: currentDate.toLocaleDateString('pl-PL'), read: false });
    } else {
        // Fallback dla custom e-maili
        emails.unshift({ sender: senderKey, subject: subjectKey, body: bodyKey, date: currentDate.toLocaleDateString('pl-PL'), read: false });
    }
    
    unreadMailsCount++;
    updateMailBadge();
}

        function updateMailBadge() {
            const badge = document.getElementById('mail-badge');
            if (unreadMailsCount > 0) {
                badge.innerText = unreadMailsCount; badge.style.display = "inline";
            } else {
                badge.style.display = "none";
            }
        }

        function showMailbox() {
    const list = document.getElementById('email-list');
    list.innerHTML = "";
    unreadMailsCount = 0; 
    updateMailBadge();

    if (emails.length === 0) {
        list.innerHTML = `<p style='text-align:center;'>${t('t-no-mails')}</p>`;
    } else {
        emails.forEach(e => {
            // e.sender, e.subject, e.body już zawierają właściwe wartości
            list.innerHTML += `<div style="background:#0f3460; padding:10px; margin-bottom:10px; border-radius:5px; border-left:4px solid var(--accent-green);">
                <small style="color:#bdc3c7;">${escapeHtml(e.date)} | ${t('t-from')}: <strong>${escapeHtml(e.sender)}</strong></small>
                <h4 style="margin:5px 0;">${escapeHtml(e.subject)}</h4>
                <p style="margin:0; font-size:13px;">${sanitizeEmailHtml(e.body)}</p>
            </div>`;
        });
    }
    showScreen('screen-mailbox');
}


        function showCalendar() {
            const list = document.getElementById('calendar-list');
            list.innerHTML = "";
            if(typeof tournamentDatabase === 'undefined') return;

            tournamentDatabase
                .map((tour, idx) => ({ tour, idx }))
                .sort((first, second) => first.tour.month - second.tour.month || first.tour.day - second.tour.day || first.idx - second.idx)
                .forEach(({ tour, idx }) => {
                let statusBadge = tour.completed 
                    ? `<button class="btn-sign" style="background:#3498db;" onclick="viewTournamentHistory(${idx})">${t('t-btn-results')}</button>` 
                    : `<span style="color:var(--accent-green)">${t('t-scheduled')}</span>`;
                    
                const year = currentDate.getFullYear();
                let dateStr = tour.endDay ? `${tour.day}-${tour.endDay}.${(tour.month + 1).toString().padStart(2, '0')}.${year}` : `${tour.day}.${(tour.month + 1).toString().padStart(2, '0')}.${year}`;
                
                list.innerHTML += `<div style="border-bottom:1px solid var(--border-color); padding:10px 0; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${dateStr}</strong> - <span style="color:white; font-size:15px;">${escapeHtml(typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tour) : tour.name)}</span>
                        <br><small style="color:#bdc3c7; display: flex; align-items: center; gap: 5px; margin-top: 3px;">
                            📍 ${escapeHtml(t(tour.city))}, ${getFlagImg(tour.country)} ${escapeHtml(t(tour.country))}
                        </small>
                    </div>
                    <div>${statusBadge}</div>
                </div>`;
            });
            showScreen('screen-calendar');
        }

        function viewTournamentHistory(index) {
            const tour = tournamentDatabase[index];
            if (tour && tour.historyLogs) {
                document.getElementById('t-tour-end-title').innerText = t('t-tour-end-title');
                const dynamicWorldCupHistory = tour.specialType === 'worldCup' && tour.worldCupWinner && typeof trWorldCup === 'function'
                    ? `<strong>${escapeHtml(getTournamentDisplayName(tour))}</strong><br>${trWorldCup('historyWinner', {
                        country: escapeHtml(getWorldCupCountryName(tour.worldCupWinner.country)),
                        players: escapeHtml((tour.worldCupWinner.players || []).join(' / '))
                    })}`
                    : tour.historyLogs;
                document.getElementById('results-content').innerHTML = dynamicWorldCupHistory;
                document.getElementById('t-btn-next-round').style.display = 'none';
                document.getElementById('t-btn-tour-back').style.display = 'block';
                document.getElementById('results-modal').style.display = 'flex';
            } else {
                alert(t('t-alert-no-history'));
            }
        }

        function triggerRandomEvent() {
    const ev = randomEventsDatabase[Math.floor(Math.random() * randomEventsDatabase.length)];
    
    // Wybiór języka
    const langSuffix = `_${currentLang}`;
    
    document.getElementById('event-title').innerText = ev[`title${langSuffix}`] || ev.title_pl;
    document.getElementById('event-desc').innerText = ev[`desc${langSuffix}`] || ev.desc_pl;
    
    const choicesDiv = document.getElementById('event-choices');
    choicesDiv.innerHTML = "";
    
    ev.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        
        const choiceText = choice[`text${langSuffix}`] || choice.text_pl;
        btn.textContent = choiceText;
        
        btn.onclick = function() {
            if (choice.effect.budget) player.budget += choice.effect.budget;
            if (choice.effect.scoring) player.scoring = clamp(player.scoring + choice.effect.scoring, 40, 99);
            if (choice.effect.doubles) player.doubles = clamp(player.doubles + choice.effect.doubles, 40, 99);
            if (choice.effect.prof) player.prof = clamp((player.prof || 50) + choice.effect.prof, 0, 100);
            if (choice.effect.pop) player.pop = clamp((player.pop || 20) + choice.effect.pop, 0, 100);
            if (choice.effect.stamina) player.stamina = clamp(player.stamina + choice.effect.stamina, 0, 100);
            if (choice.effect.form) player.form = clamp((player.form || 0) + choice.effect.form, -5, 5);

            if (choice.effect.scoring || choice.effect.doubles) {
                player.overall = Math.round((player.scoring * 0.6) + (player.doubles * 0.4));
                player.ovr = player.overall; 
            }

            const outcomeMsg = choice[`outcome${langSuffix}`] || choice.outcome_pl;
            alert(outcomeMsg);

            updateHub();
            document.getElementById('event-modal').style.display = "none";
        };
        choicesDiv.appendChild(btn);
    });
    document.getElementById('event-modal').style.display = "flex";
}

        function triggerInterview() {
    if (typeof interviewsDB === 'undefined' || interviewsDB.length === 0) return;

    const s = currentMatch ? currentMatch.stats : null;
    const finalScore = currentMatch ? currentMatch.p1Score : 0;
    const p1TotalPts = s ? s.p1AccumulatedScore + (501 - finalScore) : 0;
    const matchAvg = s && s.p1TotalDarts > 0 ? (p1TotalPts / s.p1TotalDarts) * 3 : 0;
    
    // 1. Zbieramy warunki z rozegranego meczu
    const matchFlags = {
        nine_darter: s && s.p1LegDarts === 9,
        high_avg: matchAvg >= 100,
        "180s": s && s.p1OneEighties >= 5,
        bad_doubles: s && (s.p1DoubleAttempts - s.p1DoubleHits) >= 8,
        whitewash: currentMatch && currentMatch.p2Legs === 0,
        comeback: currentMatch && Math.abs(currentMatch.p1Legs - currentMatch.p2Legs) === 1,
        final_win: tournamentRound === 2
    };

    // 2. Filtrujemy bazę pytań
    let validInterviews = interviewsDB.filter(iv => {
        if (!iv.trigger || iv.trigger === "generic") return true;
        return matchFlags[iv.trigger] === true;
    });

    // 3. Jeśli spełniono specjalne warunki, losujemy z pytań kontekstowych; w innym razie z ogólnych
    const priorityInterviews = validInterviews.filter(iv => iv.trigger && iv.trigger !== "generic");
    const chosenPool = priorityInterviews.length > 0 && Math.random() < 0.75 ? priorityInterviews : validInterviews;
    
    const iv = chosenPool[Math.floor(Math.random() * chosenPool.length)];
    const langSuffix = `_${currentLang}`;

    document.getElementById('event-title').innerText = iv[`title${langSuffix}`] || iv.title_pl;
    document.getElementById('event-desc').innerText = iv[`desc${langSuffix}`] || iv.desc_pl;
    
    const choicesDiv = document.getElementById('event-choices');
    choicesDiv.innerHTML = "";
    
    iv.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        btn.textContent = choice[`text${langSuffix}`] || choice.text_pl;
        
        btn.onclick = function() {
            player.prof = clamp((player.prof || 50) + choice.effect.prof, 0, 100);
            player.pop = clamp((player.pop || 20) + choice.effect.pop, 0, 100);
            
            const outcomeText = choice[`outcome${langSuffix}`] || choice.outcome_pl;
            alert(outcomeText);
            
            updateHub();
            document.getElementById('event-modal').style.display = "none";
        };
        choicesDiv.appendChild(btn);
    });
    document.getElementById('event-modal').style.display = "flex";
}

        // --- SYSTEM RYWALI I HISTORII H2H ---
        function initRivalries() {
            if (!isPlainObject(player.rivalries)) player.rivalries = {};
            if (!Array.isArray(player.activeRivalIds)) player.activeRivalIds = [];
        }

        function getOpponentById(opponentId) {
            return pdcPlayers.find(candidate => candidate.id === opponentId) || null;
        }

        function getRivalryScore(record) {
            const closeRecordBonus = Math.min(record.wins, record.losses) * 3;
            return (record.matches * 3) + (record.importantMatches * 5) + (record.finals * 8) + (Math.abs(record.currentStreak) * 2) + closeRecordBonus;
        }

        function refreshActiveRivals() {
            initRivalries();
            const activeRivals = Object.values(player.rivalries)
                .filter(record => getOpponentById(record.opponentId))
                .filter(record => record.matches >= 2 || record.importantMatches >= 1)
                .sort((first, second) => getRivalryScore(second) - getRivalryScore(first) || second.lastDate - first.lastDate)
                .slice(0, 4);

            player.activeRivalIds = activeRivals.map(record => record.opponentId);
            return activeRivals;
        }

        function recordRivalryMatch(winner, loser, tournament, round, playerScore = '') {
            if (!isCurrentPlayer(winner) && !isCurrentPlayer(loser)) return;
            const opponent = isCurrentPlayer(winner) ? loser : winner;
            if (!opponent || opponent.isBye || !opponent.id) return;

            initRivalries();
            const wasActive = new Set(player.activeRivalIds);
            const playerWon = isCurrentPlayer(winner);
            const record = player.rivalries[opponent.id] || {
                opponentId: opponent.id, matches: 0, wins: 0, losses: 0,
                importantMatches: 0, finals: 0, currentStreak: 0,
                lastTournament: '', lastDate: 0, lastScore: '', lastResult: ''
            };

            record.matches++;
            if (playerWon) {
                record.wins++;
                record.currentStreak = record.currentStreak >= 0 ? record.currentStreak + 1 : 1;
            } else {
                record.losses++;
                record.currentStreak = record.currentStreak <= 0 ? record.currentStreak - 1 : -1;
            }
            if (round <= 8) record.importantMatches++;
            if (round === 2) record.finals++;
            record.lastTournament = tournament?.name || '';
            record.lastDate = currentDate.getTime();
            record.lastScore = playerScore;
            record.lastResult = playerWon ? 'win' : 'loss';
            player.rivalries[opponent.id] = record;

            refreshActiveRivals();
            const becameRival = !wasActive.has(opponent.id) && player.activeRivalIds.includes(opponent.id);
            if (becameRival) {
                addCareerChronicleEvent('rival', { opponentId: opponent.id, opponentName: opponent.name });
                addEmail(
                    trRival('rivalMailSender'),
                    trRival('rivalMailSubject', { name: opponent.name }),
                    trRival('rivalMailBody', { name: opponent.name, wins: record.wins, losses: record.losses })
                );
            }
        }

        function getRivalryStatus(record) {
            const difference = record.wins - record.losses;
            if (difference > 0) return { text: trRival('ahead'), color: 'var(--accent-green)' };
            if (difference < 0) return { text: trRival('behind'), color: 'var(--accent-red)' };
            return { text: trRival('even'), color: '#f1c40f' };
        }

        // Premia jest mała: H2H musi wyraźnie przechylać się w jedną stronę,
        // a maksymalna zmiana wynosi 2 punkty do scoringu i dubli.
        function getRivalryMatchModifier(record) {
            if (!record) return 0;
            const h2hDifference = (record.wins || 0) - (record.losses || 0);
            const streak = record.currentStreak || 0;
            let modifier = 0;

            if (Math.abs(h2hDifference) >= 3) modifier += Math.sign(h2hDifference);
            if (Math.abs(streak) >= 2) modifier += Math.sign(streak);

            return clamp(modifier, -2, 2);
        }

        function applyRivalryMatchModifier(stats, isPlayer) {
            const modifier = isPlayer && currentMatch ? (Number(currentMatch.rivalryModifier) || 0) : 0;
            if (!modifier) return stats;
            return {
                ...stats,
                scoring: clamp((stats.scoring || 0) + modifier, 25, 100),
                doubles: clamp((stats.doubles || 0) + modifier, 25, 100)
            };
        }

        function showRivalriesScreen() {
            updateRivalUIStrings();
            const list = document.getElementById('rival-list');
            const summary = document.getElementById('rival-summary');
            const rivals = refreshActiveRivals();
            summary.innerText = trRival('active', { count: rivals.length });
            list.innerHTML = '';

            if (rivals.length === 0) {
                list.innerHTML = `<p style="text-align:center; color:#bdc3c7; margin-top:70px; line-height:1.5;">${trRival('empty')}</p>`;
            } else {
                rivals.forEach(record => {
                    const opponent = getOpponentById(record.opponentId);
                    if (!opponent) return;
                    const status = getRivalryStatus(record);
                    const streakText = record.currentStreak > 0
                        ? trRival('streakWin', { count: record.currentStreak })
                        : record.currentStreak < 0 ? trRival('streakLoss', { count: Math.abs(record.currentStreak) }) : '';
                    const lastDate = record.lastDate ? new Date(record.lastDate).toLocaleDateString(currentLang) : '—';
                    const scoreText = record.lastScore ? ` · ${escapeHtml(record.lastScore)}` : '';

                    list.innerHTML += `<div style="background:#0f3460; border-left:4px solid ${status.color}; padding:14px; margin-bottom:12px; border-radius:6px;">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                            <strong style="font-size:16px;">${getFlagImg(opponent.country)} ${escapeHtml(opponent.name)}</strong>
                            <span style="color:${status.color}; font-weight:bold; white-space:nowrap;">${status.text}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; gap:10px; margin-top:9px; color:#bdc3c7; font-size:13px; flex-wrap:wrap;">
                            <span>${trRival('h2h')}: <strong style="color:white;">${record.wins}–${record.losses}</strong> (${record.matches} ${trRival('matches')})</span>
                            <span>${record.importantMatches} ${trRival('important')} · ${record.finals} ${trRival('finals')} · ${streakText || '—'}</span>
                        </div>
                        <div style="margin-top:8px; font-size:12px; color:#95a5a6;">${trRival('last')}: ${lastDate} · ${escapeHtml(record.lastTournament || '—')}${scoreText}</div>
                    </div>`;
                });
            }
            showScreen('screen-rivals');
        }

        function attachRankingProfileLinks(list, rankingType) {
            if (typeof openPlayerProfile !== 'function') return;
            list.querySelectorAll('[data-player-id]').forEach(row => {
                row.addEventListener('click', () => openPlayerProfile(row.dataset.playerId, rankingType));
            });
        }

        function showPdcRankings(type = 'main') {
            document.getElementById('btn-rank-main').style.background = type === 'main' ? 'var(--accent-green)' : '#34495e';
            document.getElementById('btn-rank-pt').style.background = type === 'protour' ? 'var(--accent-green)' : '#34495e';
            document.getElementById('btn-rank-pc').style.background = type === 'pc' ? 'var(--accent-green)' : '#34495e';
            
            // INTELIGENTNE WYKRYWANIE MODA (Sprawdza czy Littler jest w grze)
            let isModded = pdcPlayers.some(p => p.name === "Luke Littler");
            let leagueName = isModded ? "Premier League" : "Global Darts League";
            let leagueShort = isModded ? "PL" : "GDL";

            let btnGdl = document.getElementById('btn-rank-gdl');
            if(btnGdl) {
                btnGdl.style.background = type === 'gdl' ? 'var(--accent-green)' : '#8e44ad';
                btnGdl.innerText = t('t-gdl-btn').replace('{league}', leagueShort);
            }
            const btnWorldMasters = document.getElementById('btn-rank-world-masters');
            if (btnWorldMasters) {
                btnWorldMasters.style.background = type === 'worldMasters' ? 'var(--accent-green)' : '#8e44ad';
                if (typeof trWorldMasters === 'function') btnWorldMasters.innerText = trWorldMasters('tableName');
            }

            const list = document.getElementById('pdc-list');
            list.innerHTML = "";

            if (type === 'worldMasters') {
                if (typeof renderWorldMastersRanking === 'function') renderWorldMastersRanking(list);
                else list.innerHTML = '<div style="text-align:center; margin-top:40px; color:#bdc3c7;">Tabela Global Masters jest niedostępna.</div>';
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }
            
            // --- Wyświetlanie tabeli Ligi ---
            if (type === 'gdl') {
                if (typeof gdlTable === 'undefined' || gdlTable.length === 0) {
                    list.innerHTML = `<div style="text-align:center; margin-top:40px; color:#bdc3c7;">Sezon ${leagueName} jeszcze się nie rozpoczął (start 1 lutego).</div>`;
                    showScreen('screen-pdc');
                    return;
                }
                
                // Sortowanie tabeli GDL: 1. Punkty, 2. Różnica legów, 3. Wygrane legi
                let sortedGDL = [...gdlTable].sort((a,b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    let diffA = a.legsWon - a.legsLost;
                    let diffB = b.legsWon - b.legsLost;
                    if (diffB !== diffA) return diffB - diffA;
                    return b.legsWon - a.legsWon;
                });
                
                list.innerHTML += `<div style="border-bottom: 2px solid var(--accent-green); padding: 5px 10px; display: flex; font-size: 12px; color: #bdc3c7; font-weight: bold; background: #0f3460;">
                    <div style="flex: 3;">${t('t-gdl-player')}</div>
                    <div style="flex: 1; text-align: center;">${t('t-gdl-pts')}</div>
                    <div style="flex: 1; text-align: center;">${t('t-gdl-nights')}</div>
                    <div style="flex: 2; text-align: center;">${t('t-gdl-legs')}</div>
                </div>`;
                
                sortedGDL.forEach((row, index) => {
                    let isMe = isCurrentPlayer(row.player);
                    // Podświetlamy TOP 4 (strefa awansu do Play-offów)
                    let bgStyle = isMe ? 'background: rgba(39, 174, 96, 0.2);' : (index < 4 ? 'background: rgba(41, 128, 185, 0.1);' : '');
                    // Oddzielamy TOP 4 przerywaną linią
                    let borderStyle = index === 3 ? 'border-bottom: 2px dashed #3498db;' : 'border-bottom: 1px solid var(--border-color);';
                    
                    let legDiff = row.legsWon - row.legsLost;
                    let sign = legDiff > 0 ? '+' : '';
                    
                    list.innerHTML += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(row.player.id)}" style="${borderStyle} ${bgStyle}">
                        <div style="flex: 3;">
                            <strong>${index + 1}.</strong> ${getFlagImg(row.player.country)} ${escapeHtml(row.player.name)} ${isMe ? "<b style='color:var(--accent-green)'>(TY)</b>" : ""}
                        </div>
                        <div style="flex: 1; text-align: center; color: #f1c40f; font-weight: bold; font-size: 16px;">
                            ${row.points}
                        </div>
                        <div style="flex: 1; text-align: center; color: #ecf0f1;">
                            ${row.nightsWon}
                        </div>
                        <div style="flex: 2; text-align: center; color: #bdc3c7;">
                            ${row.legsWon}-${row.legsLost} <span style="font-size: 11px; margin-left: 3px;">(${sign}${legDiff})</span>
                        </div>
                    </button>`;
                });
                attachRankingProfileLinks(list, type);
                showScreen('screen-pdc');
                return;
            }

            // --- STANDARDOWE RANKINGI OOM / PT / PC ---
            const combinedPlayers = [...pdcPlayers, player];
            
            let sortedPlayers = combinedPlayers.sort((a, b) => {
                if (type === 'protour') return b.proTourPrizeMoney - a.proTourPrizeMoney;
                if (type === 'pc') return b.pcPrizeMoney - a.pcPrizeMoney;
                return b.prizeMoney - a.prizeMoney; 
            });
            
            sortedPlayers.forEach((p, index) => {
                let formVal = Math.round(p.form || 0);
                let formText = formVal > 0 ? `<span style="color:var(--accent-green)">(+${formVal})</span>` : (formVal < 0 ? `<span style="color:var(--accent-red)">(${formVal})</span>` : `<span style="color:gray">(0)</span>`);
                let isMe = isCurrentPlayer(p);
                let bgStyle = isMe ? 'background: rgba(39, 174, 96, 0.2);' : '';
                
                let displayMoney = 0;
                if (type === 'protour') displayMoney = p.proTourPrizeMoney;
                else if (type === 'pc') displayMoney = p.pcPrizeMoney;
                else displayMoney = p.prizeMoney;

                let formattedPrize = displayMoney.toLocaleString('en-GB');
                let displayOvr = Math.round(p.ovr); 

                list.innerHTML += `<button type="button" class="ranking-player-row" data-player-id="${escapeHtml(p.id)}" style="border-bottom: 1px solid var(--border-color); ${bgStyle}">
                    <div>
                        <strong>#${index + 1}</strong> ${getFlagImg(p.country)} ${escapeHtml(p.name)} 
                        <span style="color: #bdc3c7; font-size: 13px; margin-left: 5px;">OVR: ${displayOvr} ${formText}</span> ${isMe ? "<b>(TY)</b>" : ""}
                    </div>
                    <div style="color: #f1c40f; font-weight: bold;">
                        £${formattedPrize}
                    </div>
                </button>`;
            });
            attachRankingProfileLinks(list, type);
            showScreen('screen-pdc');
        }

        // --- 6. MECHANIKA MECZU, TURNIEJÓW I CALLER ---
        
        let tournamentRound = 32; 
        let tournamentBracket = [];
        let tournamentMatchHistory = [];
        let preTournamentRanks = { main: 0, pt: 0, pc: 0 };
        let lastTournamentResults = "";
        let currentRoundHTML = "";

        function getPlayerRank(type) {
            let combinedPlayers = [...pdcPlayers, player];
            let sortedPlayers = combinedPlayers.sort((a, b) => {
                if (type === 'protour') return b.proTourPrizeMoney - a.proTourPrizeMoney;
                if (type === 'pc') return b.pcPrizeMoney - a.pcPrizeMoney;
                return b.prizeMoney - a.prizeMoney;
            });
            return sortedPlayers.findIndex(isCurrentPlayer) + 1;
        }

        function sendTournamentSummaryEmail(tName, prize, wonTournament) {
            let postRanks = { main: getPlayerRank('main'), pt: getPlayerRank('protour'), pc: getPlayerRank('pc') };

            let rankChanges = "";
            let diffMain = preTournamentRanks.main - postRanks.main;
            
            rankChanges += `${t('t-main-rank')} #${postRanks.main} `;
            if (diffMain > 0) rankChanges += `<span style="color:var(--accent-green)">(+${diffMain} ⬆️)</span><br>`;
            else if (diffMain < 0) rankChanges += `<span style="color:var(--accent-red)">(${Math.abs(diffMain)} ⬇️)</span><br>`;
            else rankChanges += `(-)<br>`;

            if (tName.includes("European Tour") || tName.includes("Continental Tour") || tName.includes("Players Championship") || tName.includes("Pro Players Cup") || tName.includes("UK Open") || tName.includes("World Darts Championship") || tName.includes("Global")) {
                let diffPt = preTournamentRanks.pt - postRanks.pt;
                rankChanges += `${t('t-pro-rank')} #${postRanks.pt} `;
                if (diffPt > 0) rankChanges += `<span style="color:var(--accent-green)">(+${diffPt} ⬆️)</span><br>`;
                else if (diffPt < 0) rankChanges += `<span style="color:var(--accent-red)">(${Math.abs(diffPt)} ⬇️)</span><br>`;
                else rankChanges += `(-)<br>`;
            }

            let body1 = t('t-email-tour-sum-body1').replace('{tour}', tName).replace('{prize}', prize.toLocaleString('en-GB'));
            let body = `${body1}${rankChanges}`;

            addEmail(t('t-sender-league'), t('t-email-tour-sum-sub').replace('{tour}', tName), body);
        }


        
