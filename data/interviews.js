const interviewsDB = [
    {
        title_pl: "🎤 Wywiad po meczu", title_en: "🎤 Post-match Interview", title_de: "🎤 Interview nach dem Spiel", title_nl: "🎤 Interview na de wedstrijd",
        desc_pl: "Dziennikarz Cloud Sports pyta: 'Kibice na hali gwizdali dzisiaj przy Twoich podwójnych. Jak sobie z tym radzisz?'",
        desc_en: "Cloud Sports reporter asks: 'The crowd was whistling during your doubles tonight. How do you deal with that?'",
        desc_de: "Ein Cloud Sports-Reporter fragt: 'Die Zuschauer haben heute bei deinen Doubles gepfiffen. Wie gehst du damit um?'",
        desc_nl: "Cloud Sports-verslaggever vraagt: 'Het publiek floot vanavond tijdens je dubbels. Hoe ga je daarmee om?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zawsze skupiam się tylko na tarczy. Szanuję kibiców, to część tego sportu.",
                text_en: "[Professionalism] I always focus purely on the board. I respect the crowd, it's part of the sport.",
                text_de: "[Professionalität] Ich konzentriere mich nur auf das Board. Ich respektiere die Fans, das gehört dazu.",
                text_nl: "[Professionaliteit] Ik focus me puur op het bord. Ik respecteer het publiek, het hoort erbij.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Eksperci chwalą Twój chłodny profesjonalizm.", outcome_en: "Pundits praise your cool professionalism.", outcome_de: "Experten loben deine professionelle Gelassenheit.", outcome_nl: "Analisten prijzen je professionele kalmte."
            },
            {
                text_pl: "[Medialność] Niech sobie gwiżdżą! I tak zamknąłem decydującego lega. Kocham uciszać halę!",
                text_en: "[Showmanship] Let them whistle! I still pinned the winning double. I love silencing the crowd!",
                text_de: "[Showmanship] Sollen sie doch pfeifen! Ich habe das Doppel trotzdem getroffen. Ich liebe es, die Halle zum Schweigen zu bringen!",
                text_nl: "[Showmanship] Laat ze maar fluiten! Ik raakte de winnende dubbel toch wel. Heerlijk om de zaal stil te krijgen!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Internet płonie! Twoja bezczelność przyciąga rzesze nowych fanów.", outcome_en: "The internet is on fire! Your swagger attracts crowds of new fans.", outcome_de: "Das Internet brennt! Deine freche Art bringt dir viele neue Follower.", outcome_nl: "Het internet ontploft! Je bravoure trekt hordes nieuwe fans aan."
            }
        ]
    },
    {
        title_pl: "🎤 Studio DartsZone", title_en: "🎤 DartsZone Studio", title_de: "🎤 DartsZone Studio", title_nl: "🎤 DartsZone Studio",
        desc_pl: "Ekspert pyta: 'Twój kolejny rywal twierdzi, że gładko Cię ogra. Co mu odpowiesz?'",
        desc_en: "Pundit asks: 'Your next opponent claims he will easily blow you away. What's your response?'",
        desc_de: "Der Experte fragt: 'Dein nächster Gegner behauptet, er wird dich leicht schlagen. Deine Antwort?'",
        desc_nl: "De analist vraagt: 'Je volgende tegenstander beweert dat hij makkelijk van je wint. Wat zeg je daarop?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Tarcza wszystko zweryfikuje. Będę przygotowany na 100%.",
                text_en: "[Professionalism] The board does the talking. I will be 100% prepared.",
                text_de: "[Professionalität] Das Board wird die Antwort geben. Ich werde zu 100% bereit sein.",
                text_nl: "[Professionaliteit] Het bord zal het uitwijzen. Ik zal 100% voorbereid zijn.",
                effect: { prof: 2, pop: 0 },
                outcome_pl: "Spokojna, dojrzała wypowiedź. Zyskujesz szacunek w szatni.", outcome_en: "A mature, calm statement. You gain respect in the locker room.", outcome_de: "Eine reife, ruhige Aussage. Du gewinnst Respekt im Spielbereich.", outcome_nl: "Een volwassen, rustige reactie. Je wint respect in de kleedkamer."
            },
            {
                text_pl: "[Medialność] Może tak gadać, dopóki nie dostanie lania. Szybko pożałuje tych słów!",
                text_en: "[Showmanship] Big talk until he gets battered. He will regret saying that very soon!",
                text_de: "[Showmanship] Große Worte, bis er verliert. Er wird diese Worte sehr schnell bereuen!",
                text_nl: "[Showmanship] Grote woorden tot hij verliest. Hij krijgt heel snel spijt van die uitspraak!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Mocny trash-talk! Telewizja zapowiada ten pojedynek jako starcie wagi ciężkiej.", outcome_en: "Spicy trash-talk! TV promoters hype this up as a heavyweight clash.", outcome_de: "Heißer Trash-Talk! Das Fernsehen kündigt das Duell als Blockbuster an.", outcome_nl: "Pittige trash-talk! De tv kondigt dit duel aan als een titanenstrijd."
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów ITVee", title_en: "🎤 ITVee Flash Zone", title_de: "🎤 ITVee Flash-Zone", title_nl: "🎤 ITVee Flash Zone",
        desc_pl: "Dziennikarz: 'Zanotowałeś dziś wybitną średnią powyżej 105 punktów. Jesteś w życiowej formie?'",
        desc_en: "Reporter: 'You averaged over 105 tonight. Are you playing the best darts of your life?'",
        desc_de: "Reporter: 'Du hattest heute einen Schnitt von über 105. Spielst du die besten Darts deines Lebens?'",
        desc_nl: "Verslaggever: 'Je gooide vanavond ruim 105 gemiddeld. Speel je de beste darts uit je leven?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] To owoc godzin spędzonych na tarczy treningowej, ale to dopiero początek.",
                text_en: "[Professionalism] It's the result of hours on the practice board, but the job is not done.",
                text_de: "[Professionalität] Das ist das Ergebnis harter Arbeit am Trainingsboard, aber es ist noch ein weiter Weg.",
                text_nl: "[Professionaliteit] Dit is het resultaat van urenlang trainen, maar we zijn er nog lang niet.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Kibice doceniają Twoją etykę pracy i skromność.", outcome_en: "Fans appreciate your work ethic and modesty.", outcome_de: "Die Fans schätzen deine Arbeitsmoral und Bescheidenheit.", outcome_nl: "Fans waarderen je werkethiek en bescheidenheid."
            },
            {
                text_pl: "[Medialność] Kiedy rzucam w ten sposób, nikt na tej planecie nie jest w stanie mnie zatrzymać!",
                text_en: "[Showmanship] When I'm in this rhythm, nobody on this planet can stop me!",
                text_de: "[Showmanship] Wenn ich in diesem Rhythmus bin, kann mich niemand auf diesem Planeten stoppen!",
                text_nl: "[Showmanship] Als ik zo gooi, kan niemand op deze planeet me stoppen!",
                effect: { prof: -5, pop: 6 },
                outcome_pl: "Cytat obiega wszystkie portale społecznościowe!", outcome_en: "Your quote goes viral across all social media platforms!", outcome_de: "Dein Zitat geht in allen sozialen Medien viral!", outcome_nl: "Je quote gaat viraal op alle sociale kanalen!"
            }
        ]
    },
    {
        title_pl: "🎤 Konferencja Prasowa", title_en: "🎤 Press Conference", title_de: "🎤 Pressekonferenz", title_nl: "🎤 Persconferentie",
        desc_pl: "Pytanie od Viaplayr: 'Czy Twoja głośna celebracja po wygranym legu nie była przesadą w stronę rywala?'",
        desc_en: "Question from Viaplayr: 'Was your wild celebration after that leg a bit disrespectful to your rival?'",
        desc_de: "Frage von Viaplayr: 'War dein wilder Jubel nach dem Leg etwas respektlos gegenüber dem Gegner?'",
        desc_nl: "Vraag van Viaplayr: 'Was je uitbundige viering na die leg niet een beetje respectloos naar je rivaal?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Przepraszam, jeśli to tak wyglądało. To były czyste sportowe emocje w kluczowym momencie.",
                text_en: "[Professionalism] I apologize if it looked that way. It was just pure emotion in a crucial moment.",
                text_de: "[Professionalität] Entschuldigung, falls es so aussah. Das waren reine Emotionen in einem Schlüsselmoment.",
                text_nl: "[Professionaliteit] Mijn excuses als het zo leek. Het was pure ontlading op een belangrijk moment.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Sędziowie i oficjele chwalą Twoją klasę.", outcome_en: "Officials and tournament directors praise your class.", outcome_de: "Offizielle loben deine sportliche Größe.", outcome_nl: "Officials en toernooidirectie prijzen je klasse."
            },
            {
                text_pl: "[Medialność] To jest wielka scena, a nie partia szachów! Jeśli rywal nie potrafi tego znieść, niech zmieni dyscyplinę.",
                text_en: "[Showmanship] This is big-time entertainment, not chess! If he can't handle it, play something else.",
                text_de: "[Showmanship] Das ist die große Bühne und kein Schach! Wenn er das nicht aushält, soll er was anderes spielen.",
                text_nl: "[Showmanship] Dit is topsport en entertainment, geen schaken! Als hij er niet tegen kan, moet hij wat anders gaan doen.",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Nagranie z Twoim krzykiem trafia na czołówki gazet sportowych!", outcome_en: "Footage of your roar leads every major sports news outlet!", outcome_de: "Der Clip mit deinem Brüllen landet auf allen Titelseiten!", outcome_nl: "De beelden van je schreeuw halen alle sportvoorpagina's!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zaciętym thrillerze", title_en: "🎤 Thriller Post-Match", title_de: "🎤 Nach dem Nervenkrimi", title_nl: "🎤 Na de zenuwslopende partij",
        desc_pl: "Darts Talk: 'Wygrałeś decydującego lega rzutem w sam środek tarczy. Co działo się w Twojej głowie?'",
        desc_en: "Darts Talk: 'You took out the decider on the Bullseye. What was going through your mind?'",
        desc_de: "Darts Talk: 'Du hast das Decider-Leg auf dem Bullseye geholt. Was ging dir durch den Kopf?'",
        desc_nl: "Darts Talk: 'Je pakte de beslissende leg via de Bullseye. Wat ging er door je heen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Ćwiczyłem ten scenariusz setki razy. Po prostu zaufałem technice rzutu.",
                text_en: "[Professionalism] I've drilled that scenario hundreds of times. I simply trusted my mechanics.",
                text_de: "[Professionalität] Ich habe dieses Szenario hundertmal trainiert. Ich habe meiner Technik vertraut.",
                text_nl: "[Professionaliteit] Ik heb dit scenario honderden keren getraind. Ik vertrouwde op mijn techniek.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Trenerzy stawiają Cię za wzór opanowania.", outcome_en: "Coaches use your routine as a textbook example.", outcome_de: "Trainer nutzen deinen Wurf als Paradebeispiel.", outcome_nl: "Trainers noemen jouw routine een schoolvoorbeeld."
            },
            {
                text_pl: "[Medialność] Miałem w żyłach lód. Zrobiłem to dla widowiska, wiedziałem, że trybuny eksplodują!",
                text_en: "[Showmanship] Pure ice in my veins. Did it for the show, I knew the crowd would lose their minds!",
                text_de: "[Showmanship] Eis in meinen Adern. Ich tat es für die Show, ich wusste, die Fans rasten aus!",
                text_nl: "[Showmanship] Ijs in mijn aderen. Ik deed het voor de show, ik wist dat het dak eraf zou gaan!",
                effect: { prof: -2, pop: 4 },
                outcome_pl: "Komentatorzy okrzyknęli Cię graczem o nerwach ze stali.", outcome_en: "Commentators label you the coldest clutch player in darts.", outcome_de: "Kommentatoren nennen dich den eiskaltesten Crunch-Time-Spieler.", outcome_nl: "Commentatoren noemen je de meest ijskoude speler van het circuit."
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Sport1 TV", title_en: "🎤 Sport1 TV Interview", title_de: "🎤 Sport1 TV Interview", title_nl: "🎤 Sport1 TV Interview",
        desc_pl: "Dziennikarz pyta: 'Twoja nowa koszulka meczowa i muzyka na wejście wzbudzają spore kontrowersje. Dlaczego taka zmiana?'",
        desc_en: "Reporter asks: 'Your new walk-on track and match shirt sparked a lot of debate. Why the drastic change?'",
        desc_de: "Reporter fragt: 'Dein neuer Walk-on-Song und dein Trikot sorgen für Diskussionen. Warum der Wechsel?'",
        desc_nl: "Verslaggever vraagt: 'Je nieuwe opkomstmuziek en shirt zorgen voor veel ophef. Waarom die verandering?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Sprzęt i strój mają być przede wszystkim wygodne, by nic nie przeszkadzało w rzucie.",
                text_en: "[Professionalism] My shirt and gear just need to be comfortable so nothing interferes with my throw.",
                text_de: "[Professionalität] Kleidung und Darts müssen bequem sein, damit der Wurf nicht gestört wird.",
                text_nl: "[Professionaliteit] Mijn kleding moet vooral comfortabel zijn zodat niets mijn worp hindert.",
                effect: { prof: 2, pop: -1 },
                outcome_pl: "Skupienie na sporcie zyskuje uznanie ekspertów.", outcome_en: "Focusing purely on the game earns you respect from purists.", outcome_de: "Der pure Fokus auf den Sport gefällt den Traditionalisten.", outcome_nl: "De pure focus op het spel wordt gewaardeerd door kenners."
            },
            {
                text_pl: "[Medialność] Bo tworzę markę! Ludzie przychodzą oglądać show, a ja daję im powód do zapamiętania mnie.",
                text_en: "[Showmanship] Because I'm building a brand! People pay to see rockstars, and I deliver.",
                text_de: "[Showmanship] Weil ich eine Marke baue! Die Leute wollen Rockstars sehen, und ich liefere ab.",
                text_nl: "[Showmanship] Omdat ik aan een merk bouw! Mensen betalen voor een show en ik lever die.",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Twoja koszulka bije rekordy sprzedaży w oficjalnym sklepie!", outcome_en: "Your match shirt breaks sales records in the merchandise shop!", outcome_de: "Dein Trikot bricht Verkaufsrekorde im Merchandise-Shop!", outcome_nl: "Je shirt breekt verkooprecords in de fanshop!"
            }
        ]
    },
    {
        title_pl: "🎤 Rozmowa w strefie mieszanej", title_en: "🎤 Mixed Zone Chat", title_de: "🎤 Mixed-Zone Interview", title_nl: "🎤 Mixed Zone Gesprek",
        desc_pl: "PDChat: 'Wielu zarzuca Ci, że rzucasz za wolno i celowo wybijasz rywali z rytmu. Odpowiesz na te zarzuty?'",
        desc_en: "PDChat asks: 'Critics say you throw too slowly and intentionally disrupt your opponent's rhythm. Thoughts?'",
        desc_de: "PDChat fragt: 'Kritiker sagen, du wirfst zu langsam und störst absichtlich den Rhythmus der Gegner. Was sagst du?'",
        desc_nl: "PDChat: 'Critici beweren dat je te traag gooit en bewust het ritme van je tegenstander breekt. Jouw reactie?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Każdy ma swój naturalny rytm oddechowy. Gram zgodnie z przepisami federacji.",
                text_en: "[Professionalism] Everyone has their own natural cadence. I play strictly within PDC rules.",
                text_de: "[Professionalität] Jeder hat seinen natürlichen Rhythmus. Ich halte mich streng an die PDC-Regeln.",
                text_nl: "[Professionaliteit] Iedereen heeft zijn eigen natuurlijke ritme. Ik speel strikt volgens de PDC-regels.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Zamykasz temat bez wywoływania zbędnego skandalu.", outcome_en: "You shut down the controversy with elegance.", outcome_de: "Du beendest die Kontroverse sachlich und elegant.", outcome_nl: "Je snoert critici de mond zonder relletjes te veroorzaken."
            },
            {
                text_pl: "[Medialność] Jeśli rywal nie potrafi utrzymać koncentracji, to jego problem. Gram tak, żeby wygrać!",
                text_en: "[Showmanship] If they can't handle my pace, that's their weakness. I play to win at all costs!",
                text_de: "[Showmanship] Wenn sie mein Tempo nicht abkönnen, ist das ihre Schwäche. Ich spiele, um zu gewinnen!",
                text_nl: "[Showmanship] Als ze mijn tempo niet aankunnen, is dat hun probleem. Ik speel om te winnen!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Twoja wypowiedź wywołuje gorącą debatę w darterskich podcastach.", outcome_en: "Your comment triggers heated debates on all major darts podcasts.", outcome_de: "Dein Kommentar löst hitzige Debatten in Darts-Podcasts aus.", outcome_nl: "Je uitspraak zorgt voor felle discussies in dartspodcasts."
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad przed kamerami", title_en: "🎤 On-Camera Interview", title_de: "🎤 Kamera-Interview", title_nl: "🎤 Camera-interview",
        desc_pl: "Cloud Sports: 'Właśnie pokonałeś aktualnego mistrza świata. Czujesz się faworytem do trofeum?'",
        desc_en: "Cloud Sports: 'You just knocked out the reigning World Champion. Do you consider yourself the favorite now?'",
        desc_de: "Cloud Sports: 'Du hast gerade den amtierenden Weltmeister besiegt. Siehst du dich jetzt als Titelfavorit?'",
        desc_nl: "Cloud Sports: 'Je hebt zojuist de regerend wereldkampioen uitgeschakeld. Zie je jezelf nu als favoriet?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Podchodzę do każdego meczu krok po kroku. Następna runda to zupełnie nowe wyzwanie.",
                text_en: "[Professionalism] One match at a time. The next round is a completely fresh challenge.",
                text_de: "[Professionalität] Ein Spiel nach dem anderen. Die nächste Runde ist eine völlig neue Herausforderung.",
                text_nl: "[Professionaliteit] Wedstrijd voor wedstrijd. De volgende ronde is weer een heel nieuw duel.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci chwalą Twoje dojrzałe, mistrzowskie podejście.", outcome_en: "Pundits applaud your championship-level mindset.", outcome_de: "Experten loben deine meisterhafte Einstellung.", outcome_nl: "Analisten prijzen je volwassen kampioensmentaliteit."
            },
            {
                text_pl: "[Medialność] Skoro mistrz pakuje walizki, to puchar jest praktycznie mój. Kto ma mnie powstrzymać?",
                text_en: "[Showmanship] The champ is packing bags, so that trophy is mine. Who is gonna stop me now?",
                text_de: "[Showmanship] Der Champion packt ein, die Trophäe gehört mir. Wer soll mich jetzt noch stoppen?",
                text_nl: "[Showmanship] De kampioen ligt eruit, dus die beker is van mij. Wie gaat me nu nog tegenhouden?",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Bukmacherzy natychmiast drastycznie obniżają kursy na Twoje zwycięstwo!", outcome_en: "Bookmakers slash your title-winning odds to record lows!", outcome_de: "Wettanbieter senken die Quoten auf deinen Turniersieg drastisch!", outcome_nl: "Bookmakers verlagen direct de quoteringen voor jouw toernooiwinst!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Mediów", title_en: "🎤 Media Zone", title_de: "🎤 Medienbereich", title_nl: "🎤 Mediazone",
        desc_pl: "Pytanie od Darts Weekly: 'Zauważyliśmy, że przed meczami unikasz rozmów z innymi graczami. Dlaczego?'",
        desc_en: "Darts Weekly asks: 'We noticed you avoid backstage chats with players before matches. Why is that?'",
        desc_de: "Darts Weekly fragt: 'Uns ist aufgefallen, dass du Gespräche im Backstage meidest. Warum?'",
        desc_nl: "Darts Weekly vraagt: 'Het valt op dat je gesprekken backstage met collega's vermijdt. Waarom?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] W szatni muszę wejść w 'strefę' i skupić się na rozgrzewce. Przyjaźnie zostawiam na czas po turnieju.",
                text_en: "[Professionalism] Backstage I need to enter the zone and warm up. Friendships wait until after the tourney.",
                text_de: "[Professionalität] Im Backstage muss ich in den Tunnel. Freundschaften müssen bis nach dem Turnier warten.",
                text_nl: "[Professionaliteit] Backstage moet ik in mijn zone komen. Vriendschappen wachten maar tot na het toernooi.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Wszyscy w tourze wiedzą, że przy tarczy jesteś stuprocentowym profesjonalistą.", outcome_en: "The entire circuit recognizes you as an uncompromising professional.", outcome_de: "Die gesamte Tour respektiert deine kompromisslose Professionalität.", outcome_nl: "Iedereen op het circuit weet dat je een compromisloze prof bent."
            },
            {
                text_pl: "[Medialność] Nie przyjechałem tu zawierać przyjaźni, tylko zabierać im czeki z nagrodami!",
                text_en: "[Showmanship] I didn't come here to make buddies. I came to take their prize money!",
                text_de: "[Showmanship] Ich bin nicht hier, um Freunde zu finden. Ich bin hier, um ihre Preisgelder einzusacken!",
                text_nl: "[Showmanship] Ik ben hier niet om vrienden te maken. Ik ben hier om hun prijzengeld af te pakken!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Rywale czują przed Tobą respekt, a fani uwielbiają Twój bezwzględny styl.", outcome_en: "Rivals fear facing you, while fans love your ruthless attitude.", outcome_de: "Gegner fürchten dich, während die Fans deine Härte lieben.", outcome_nl: "Tegenstanders vrezen je en fans smullen van je meedogenloze houding."
            }
        ]
    },
    {
        title_pl: "🎤 Studio pomeczowe", title_en: "🎤 Post-Match Desk", title_de: "🎤 Nachbesprechung", title_nl: "🎤 Nabeschouwing",
        desc_pl: "Dziennikarz: 'W pierwszej rundzie omal nie odpadłeś ze skazywanym na pożarcie kwalifikantem. Skąd te nerwy?'",
        desc_en: "Reporter: 'You were on the brink of defeat against a rank outsider in round one. Why the struggle?'",
        desc_de: "Reporter: 'In Runde eins standest du gegen einen krassen Außenseiter kurz vor dem Aus. Woher die Nerven?'",
        desc_nl: "Verslaggever: 'In de eerste ronde kroop je door het oog van de naald tegen een underdog. Waar kwamen die zenuwen vandaan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] W dzisiejszym darcie każdy rzuca wybitnie. Mój rywal zagrał wspaniały mecz, szacunek dla niego.",
                text_en: "[Professionalism] Modern darts is ruthless; anyone can average 100+. Huge respect to him for a great fight.",
                text_de: "[Professionalität] Das Niveau ist enorm hoch; jeder kann überraschen. Großer Respekt an ihn für den Kampf.",
                text_nl: "[Professionaliteit] Het niveau is tegenwoordig bizar hoog; iedereen kan stunten. Veel respect voor zijn partij.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Klasa i pokora przysparzają Ci uznania w oczach starszyzny darterskiej.", outcome_en: "Class and humility earn you praise from darts legends.", outcome_de: "Deine Demut und Klasse bringen dir Lob von Darts-Legenden ein.", outcome_nl: "Klasse en nederigheid leveren je lof op van dartlegendes."
            },
            {
                text_pl: "[Medialność] Po prostu dałem mu trochę tlenu, żeby widzowie przed telewizorami mieli ciekawszy spektakl!",
                text_en: "[Showmanship] Just gave him some air to make the TV broadcast more entertaining for the viewers!",
                text_de: "[Showmanship] Ich habe ihm nur etwas Luft gelassen, damit die TV-Zuschauer eine spannende Show bekommen!",
                text_nl: "[Showmanship] Ik gaf hem expres wat ruimte zodat de kijkers thuis een spannende show kregen!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Twoja nonszalancja staje się memem w internecie!", outcome_en: "Your cheeky nonchalance turns into an instant viral meme!", outcome_de: "Deine freche Nonchalance wird sofort zum Internet-Meme!", outcome_nl: "Je brutale nonchalance verandert direct in een virale meme!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Darts Live", title_en: "🎤 Darts Live Exclusive", title_de: "🎤 Darts Live Exklusiv", title_nl: "🎤 Darts Live Exclusief",
        desc_pl: "Pytanie: 'Często eksperymentujesz z wagą i piórkami lotek w trakcie turniejów. Czy to nie zbyt ryzykowne?'",
        desc_en: "Question: 'You often tweak your dart weights and flights mid-tournament. Isn't that too risky?'",
        desc_de: "Frage: 'Du wechselst mitten im Turnier oft Darts und Flights. Ist das nicht zu riskant?'",
        desc_nl: "Vraag: 'Je wisselt tijdens toernooien nogal eens van pijlen en flights. Is dat niet te riskant?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Testuję każdy detal w bazie treningowej. Zmiany opieram na analizie aerodynamiki.",
                text_en: "[Professionalism] Every micro-tweak is tested in my practice lair based on aerodynamic feedback.",
                text_de: "[Professionalität] Jedes Detail wird im Training getestet und basiert auf aerodynamischen Daten.",
                text_nl: "[Professionaliteit] Elk detail test ik uitgebreid in mijn trainingsruimte op basis van data.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Producenci sprzętu doceniają Twoją wiedzę techniczną.", outcome_en: "Equipment manufacturers praise your analytical understanding.", outcome_de: "Ausrüster schätzen dein tiefes technisches Verständnis.", outcome_nl: "Materiaalfabrikanten waarderen je technische inzicht."
            },
            {
                text_pl: "[Medialność] Dobrego rzucającego poznasz po tym, że wygra nawet gwoździami wyjętymi z płotu!",
                text_en: "[Showmanship] A truly elite darter can win throwing rusty nails pulled from a fence!",
                text_de: "[Showmanship] Ein echter Champ gewinnt selbst, wenn er rostige Nägel wirft!",
                text_nl: "[Showmanship] Een echte topspeler wint zelfs als hij met roestige spijkers gooit!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Twoje hasło trafia na koszulki kibiców!", outcome_en: "Fans print your catchphrase onto custom T-shirts!", outcome_de: "Fans drucken deinen Spruch auf ihre Trikots!", outcome_nl: "Fans drukken jouw uitspraak op hun shirts!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów", title_en: "🎤 Flash Interview", title_de: "🎤 Blitz-Interview", title_nl: "🎤 Flitsinterview",
        desc_pl: "Dziennikarz: 'W trakcie meczu wymieniłeś kilka ostrych spojrzeń z rywalem przy tarczy. Co tam zaszło?'",
        desc_en: "Reporter: 'You exchanged some fiery death-stares with your opponent at the oche. What happened?'",
        desc_de: "Reporter: 'Du hast dir am Oche einige giftige Blicke mit deinem Gegner zugeworfen. Was war da los?'",
        desc_nl: "Verslaggever: 'Je wisselde een paar giftige blikken uit met je tegenstander bij de oche. Wat gebeurde er?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Nic osobistego, walka o każdy milimetr tarczy budzi napięcie. Podaliśmy sobie dłonie.",
                text_en: "[Professionalism] Nothing personal, just intense battle for inches on the board. We shook hands.",
                text_de: "[Professionalität] Nichts Persönliches, nur ein harter Kampf um Millimeter. Wir haben uns die Hand gegeben.",
                text_nl: "[Professionaliteit] Niets persoonlijks, gewoon een felle strijd om centimeters. We hebben elkaar de hand geschud.",
                effect: { prof: 2, pop: 0 },
                outcome_pl: "Unikasz eskalacji konfliktu w mediach.", outcome_en: "You defuse any potential media-fueled feud.", outcome_de: "Du entschärfst den medialen Streit sofort.", outcome_nl: "Je voorkomt een door de media opgeblazen vete."
            },
            {
                text_pl: "[Medialność] Próbował wejść mi do głowy swoimi minami, więc pokazałem mu, kto tu rządzi!",
                text_en: "[Showmanship] He tried playing cheap psychological mind games, so I put him back in his place!",
                text_de: "[Showmanship] Er wollte Psycho-Spielchen spielen, also habe ich ihm gezeigt, wer hier der Boss ist!",
                text_nl: "[Showmanship] Hij probeerde mentale spelletjes te spelen, dus ik heb hem even op zijn plek gezet!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fragmenty Waszego starcia stają się hitem YouTube!", outcome_en: "Clips of the staredown rack up millions of views on YouTube!", outcome_de: "Der Clip mit dem Staredown geht auf YouTube durch die Decke!", outcome_nl: "Beelden van de staredown gaan viraal op YouTube!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po awansie do Finału", title_en: "🎤 Finalist Interview", title_de: "🎤 Finalisten-Interview", title_nl: "🎤 Interview na plaatsing Finale",
        desc_pl: "Cloud Sports: 'Jutro zagrasz w wielkim finale o najważniejszy puchar w sezonie. Jak spędzisz dzisiejszy wieczór?'",
        desc_en: "Cloud Sports: 'Tomorrow you play in the Grand Final for the biggest title of the year. How will you spend tonight?'",
        desc_de: "Cloud Sports: 'Morgen spielst du im großen Finale um den wichtigsten Titel. Wie verbringst du den Abend?'",
        desc_nl: "Cloud Sports: 'Morgen speel je de grote finale om de belangrijkste titel. Hoe ziet je avond eruit?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Lekka kolacja, analiza zapisu meczów rywala i wczesny sen. Pełna regeneracja.",
                text_en: "[Professionalism] Light dinner, video analysis of my opponent's patterns, and early sleep. Pure recovery.",
                text_de: "[Professionalität] Leichtes Abendessen, Videoanalyse des Gegners und früh schlafen. Regeneration pur.",
                text_nl: "[Professionaliteit] Lichte maaltijd, video-analyse van mijn tegenstander en vroeg naar bed. Rust en herstel.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Media opisują Cię jako absolutnego tytana dyscypliny.", outcome_en: "Media portrays you as the ultimate titan of self-discipline.", outcome_de: "Die Medien bezeichnen dich als Vorbild an Selbstdisziplin.", outcome_nl: "De media omschrijven je als een baken van zelfdiscipline."
            },
            {
                text_pl: "[Medialność] Zamawiam wielką pizzę, puszczę głośną muzykę i nagram vloga dla fanów. Zero stresu!",
                text_en: "[Showmanship] Ordering a massive pizza, blasting loud tunes, and dropping a vlog for the fans. Zero stress!",
                text_de: "[Showmanship] Ich bestelle eine Riesenpizza, drehe die Musik auf und mache einen Vlog für meine Fans. Null Stress!",
                text_nl: "[Showmanship] Ik bestel een grote pizza, zet harde muziek op en drop een vlog voor de fans. Geen stress!",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Twój profil społecznościowy zalewa fala pozytywnych komentarzy.", outcome_en: "Your social feeds are flooded with love and massive engagement.", outcome_de: "Deine Social-Media-Kanäle explodieren vor Zuspruch.", outcome_nl: "Je social media ontploft met duizenden reacties."
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa", title_en: "🎤 Press Hub", title_de: "🎤 Pressezentrum", title_nl: "🎤 Perscentrum",
        desc_pl: "Pytanie od The Daily Dart: 'Zarobiłeś w tym roku już fortunę na nagrodach. Czy pieniądze zmieniają Twoje podejście?'",
        desc_en: "The Daily Dart asks: 'You've banked a fortune in prize money this season. Does the wealth change you?'",
        desc_de: "The Daily Dart fragt: 'Du hast dieses Jahr ein Vermögen verdient. Verändert dich das viele Geld?'",
        desc_nl: "The Daily Dart vraagt: 'Je hebt dit jaar een fortuin verdiend. Verandert dat vele geld jou?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Pieniądze inwestuję w sprzęt, fizjoterapeutę i rozwój bazy. Liczą się tylko trofea.",
                text_en: "[Professionalism] The money is reinvested into my physio, training facility, and craft. Only trophies matter.",
                text_de: "[Professionalität] Ich investiere alles in Physio, Trainingsausstattung und mein Spiel. Nur Trophäen zählen.",
                text_nl: "[Professionaliteit] Ik herinvesteer alles in fysio, trainingsruimte en mijn spel. Alleen bekers tellen.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Inwestorzy i sponsorzy uznają Cię za niezwykle stabilnego partnera biznesowego.", outcome_en: "Major corporate sponsors view you as a premier, stable brand ambassador.", outcome_de: "Große Sponsoren sehen in dir einen seriösen, verlässlichen Werbeträger.", outcome_nl: "Grote bedrijven zien in jou een uiterst betrouwbare ambassadeur."
            },
            {
                text_pl: "[Medialność] Kupię sobie nowy sportowy samochód i złoty zegarek! Trzeba korzystać z życia!",
                text_en: "[Showmanship] Buying a brand new supercar and a gold watch! You gotta flaunt the success!",
                text_de: "[Showmanship] Ich kaufe mir einen Sportwagen und eine goldene Uhr! Man muss das Leben feiern!",
                text_nl: "[Showmanship] Ik koop een nieuwe sportwagen en een gouden horloge! Je moet van het succes genieten!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Tabloidy rozpisują się o Twoim ekstrawaganckim stylu życia!", outcome_en: "Tabloids eagerly write cover stories on your flashy, rockstar lifestyle!", outcome_de: "Boulevardblätter stürzen sich begeistert auf deinen Luxus-Lifestyle!", outcome_nl: "Tabloids schrijven gretig over jouw opvallende levensstijl!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po pudłach na dublach", title_en: "🎤 Post-Match Scramble", title_de: "🎤 Nach Doppel-Problemen", title_nl: "🎤 Na dubbel-problemen",
        desc_pl: "DartsZone: 'Wygrałeś, ale zmarnowałeś dziś aż 14 lotek na podwójnych. Skąd taki kryzys na finiszach?'",
        desc_en: "DartsZone: 'You survived, but squandered 14 darts at doubles today. What caused the checkout drought?'",
        desc_de: "DartsZone: 'Du hast gewonnen, aber 14 Darts auf Doppel vergeben. Woher kamen die Checkout-Probleme?'",
        desc_nl: "DartsZone: 'Je wint, maar miste wel 14 pijlen op de dubbels. Waar kwamen die problemen vandaan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zauważyłem techniczny błąd w wypuszczeniu lotki. Jutro rano spędzę 2 godziny tylko na rzutach w pierścień podwójny.",
                text_en: "[Professionalism] Spotted a tiny flaw in my release. Tomorrow morning I'm dedicating 2 hours solely to outer ring drills.",
                text_de: "[Professionalität] Ein kleiner technischer Fehler beim Abwurf. Morgen früh trainiere ich 2 Stunden nur Doppel.",
                text_nl: "[Professionaliteit] Ik zag een technisch foutje bij de release. Morgenochtend train ik 2 uur lang puur op dubbels.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Komentatorzy podziwiają Twoją samokrytykę i dążenie do perfekcji.", outcome_en: "Pundits admire your brutal honesty and relentless pursuit of perfection.", outcome_de: "Experten bewundern deine Selbstkritik und deinen Perfektionismus.", outcome_nl: "Analisten bewonderen je zelfkritiek en drang naar perfectie."
            },
            {
                text_pl: "[Medialność] Nieważne ile zmarnowałem, liczy się to, że ta najważniejsza wpadła. Zwycięzców się nie sądzi!",
                text_en: "[Showmanship] Doesn't matter how many I missed; the match-dart went in. History remembers winners!",
                text_de: "[Showmanship] Egal wie viele ich verpasst habe; der Matchdart saß. Geschichte schreiben die Sieger!",
                text_nl: "[Showmanship] Maakt niet uit hoeveel ik miste; de matchdart zat. Alleen de overwinning telt!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Fani uwielbiają Twoją pewność siebie niezależnie od formy!", outcome_en: "Fans love that your swagger never wavers even on bad days!", outcome_de: "Fans lieben es, dass dein Selbstvertrauen niemals wankt!", outcome_nl: "Fans waarderen het dat je zelfvertrouwen nooit wankelt!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po 9-Darterze", title_en: "🎤 Nine-Darter Special", title_de: "🎤 Nach dem 9-Darter", title_nl: "🎤 Na de 9-Darter",
        desc_pl: "Cloud Sports: 'PERFEKCYJNY LEG! Trafiłeś perfekcyjnego 9-dartera przed milionami widzów! Jakie to uczucie?!'",
        desc_en: "Cloud Sports: 'THE PERFECT LEG! You threw a 9-darter on live global television! Describe the feeling!'",
        desc_de: "Cloud Sports: 'DAS PERFEKTE LEG! Du hast einen 9-Darter live im TV geworfen! Beschreibe das Gefühl!'",
        desc_nl: "Cloud Sports: 'DE PERFECTE LEG! Je gooide een 9-darter live op tv voor miljoenen kijkers! Hoe voelt dat?!'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Wspaniałe uczucie, ale najważniejsze to nie stracić koncentracji i doprowadzić mecz do zwycięstwa.",
                text_en: "[Professionalism] Magical moment, but the priority is maintaining focus to seal the entire match.",
                text_de: "[Professionalität] Ein magischer Moment, aber das Wichtigste ist, fokussiert zu bleiben und das Spiel zu gewinnen.",
                text_nl: "[Professionaliteit] Magisch, maar de prioriteit blijft om gefocust te blijven en de wedstrijd te winnen.",
                effect: { prof: 4, pop: 2 },
                outcome_pl: "Eksperci podkreślają Twoją niesamowitą dyscyplinę umysłu.", outcome_en: "Analysts highlight your incredible iron-clad mental focus.", outcome_de: "Experten betonen deinen unerschütterlichen mentalen Fokus.", outcome_nl: "Analisten roemen je ijzersterke mentale focus."
            },
            {
                text_pl: "[Medialność] TAAAK! Właśnie po to ludzie kupują bilety! Jestem artystą tej tarczy!",
                text_en: "[Showmanship] BOOM! That is exactly why fans buy tickets! You are watching pure genius!",
                text_de: "[Showmanship] BOOM! Genau dafür kaufen die Leute Tickets! Ihr seht hier pure Magie!",
                text_nl: "[Showmanship] BOOM! Dit is waarom mensen een kaartje kopen! Pure magie op het podium!",
                effect: { prof: -2, pop: 8 },
                outcome_pl: "Nagranie z Twoim 9-darterem osiąga 10 milionów wyświetleń na TikToku!", outcome_en: "The video of your 9-darter pulls over 10 million views overnight on TikTok!", outcome_de: "Dein 9-Darter-Video knackt über Nacht die 10-Millionen-Marke auf TikTok!", outcome_nl: "De video van je 9-darter haalt in één nacht meer dan 10 miljoen views op TikTok!"
            }
        ]
    },
    {
        title_pl: "🎤 Pytanie od kibiców", title_en: "🎤 Fan Q&A", title_de: "🎤 Fan-Fragen", title_nl: "🎤 Vragen van fans",
        desc_pl: "DartsZone: 'Kibice pytają w sieci: skąd czerpiesz inspirację do swojego unikalnego stylu rzutu?'",
        desc_en: "DartsZone: 'Fans online are asking: where do you draw inspiration for your distinct throwing technique?'",
        desc_de: "DartsZone: 'Fans im Netz fragen: Woher nimmst du die Inspiration für deinen Wurfstil?'",
        desc_nl: "DartsZone: 'Fans vragen online: waar haal je de inspiratie vandaan voor jouw unieke werpstijl?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Inspirowałem się legendami darta, ale styl wykułem przez tysiące godzin samotnych powtórzeń.",
                text_en: "[Professionalism] Inspired by past legends, but forged through thousands of hours of solo repetition.",
                text_de: "[Professionalität] Inspiriert von Legenden, aber geformt durch tausende Stunden einsames Training.",
                text_nl: "[Professionaliteit] Geïnspireerd door legendes, maar geslepen door duizenden uren van solo-training.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Młodzi zawodnicy analizują Twój chwyt klatka po klatce.", outcome_en: "Young darters dissect your grip frame-by-frame on training forums.", outcome_de: "Nachwuchsspieler analysieren deinen Griff Bild für Bild.", outcome_nl: "Jonge darters analyseren jouw grip beeld voor beeld."
            },
            {
                text_pl: "[Medialność] Urodziłem się z tym talentem! Rzucanie lotkami mam we krwi, tego nie da się nauczyć.",
                text_en: "[Showmanship] Born with pure god-given talent! You either have this magic in your blood or you don't.",
                text_de: "[Showmanship] Mit purem Talent geboren! Entweder man hat diese Magie im Blut, oder eben nicht.",
                text_nl: "[Showmanship] Geboren met puur natuurtalent! Dit heb je in je bloed of niet.",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Twoja pewność siebie budzi skrajne emocje – od uwielbienia po zazdrość!", outcome_en: "Your swagger polarizes the scene – people either adore you or love to hate you!", outcome_de: "Dein Selbstbewusstsein spaltet die Szene – man liebt oder hasst dich!", outcome_nl: "Je zelfvertrouwen verdeelt de dartwereld – men houdt van je of haat je!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po trudnym powrocie (Comeback)", title_en: "🎤 Great Comeback", title_de: "🎤 Nach großem Comeback", title_nl: "🎤 Na grote comeback",
        desc_pl: "Cloud Sports: 'Przegrywałeś już 1:5, a wygrałeś 6:5! Jak dokonałeś tego cudu?'",
        desc_en: "Cloud Sports: 'You were 1-5 down and pulled off a 6-5 miracle! How on earth did you turn it around?'",
        desc_de: "Cloud Sports: 'Du lagst 1:5 hinten und hast 6:5 gewonnen! Wie hast du dieses Wunder geschafft?'",
        desc_nl: "Cloud Sports: 'Je stond 1-5 achter en won alsnog met 6-5! Hoe flikte je dat huzarenstukje?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zmieniłem tempo stania przy oche i skupiłem się na wygrywaniu pojedynczych legów.",
                text_en: "[Professionalism] Adjusted my setup rhythm at the oche and focused purely on one single leg at a time.",
                text_de: "[Professionalität] Ich habe meinen Rhythmus angepasst und mich nur auf jedes einzelne Leg konzentriert.",
                text_nl: "[Professionaliteit] Ik paste mijn ritme aan en focuste me puur op één leg tegelijk.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Twoja taktyczna dojrzałość trafia do analiz taktycznych stacji telewizyjnych.", outcome_en: "TV analysts break down your tactical discipline in the post-match breakdown.", outcome_de: "TV-Analysten loben deine taktische Disziplin im Replay.", outcome_nl: "Analisten prijzen je tactische discipline in de nabeschouwing."
            },
            {
                text_pl: "[Medialność] Rywal myślał, że ma mnie na widelcu. Zapomniał, że potwory budzą się pod presją!",
                text_en: "[Showmanship] He thought he had me buried. He forgot that beasts thrive under pressure!",
                text_de: "[Showmanship] Er dachte, er hätte mich erledigt. Aber Raubtiere wachen erst unter Druck auf!",
                text_nl: "[Showmanship] Hij dacht dat hij er al was. Hij vergat even dat roofdieren pas wakker worden onder druk!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Komentatorzy uznają ten comeback za najbardziej elektryzujący moment sezonu!", outcome_en: "Commentators call this turnaround the most electrifying spectacle of the tour!", outcome_de: "Kommentatoren küren das Comeback zum elektrisierendsten Moment der Saison!", outcome_nl: "Commentatoren noemen deze comeback het meest zinderende moment van het seizoen!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash", title_en: "🎤 Flash Zone", title_de: "🎤 Flash-Zone", title_nl: "🎤 Flitszone",
        desc_pl: "PDChat: 'Twój przeciwnik po meczu narzekał na przeciągi i temperaturę na scenie. Miałeś podobne odczucia?'",
        desc_en: "PDChat: 'Your opponent complained about stage draft and hall temperature. Did you feel the same?'",
        desc_de: "PDChat: 'Dein Gegner hat sich über Zugluft und Hallentemperatur beschwert. Hast du das auch so empfunden?'",
        desc_nl: "PDChat: 'Je tegenstander klaagde over tocht en temperatuur op het podium. Had jij daar ook last van?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Warunki na scenie są jednakowe dla obu graczy. Trzeba się dostosować, a nie szukać wymówek.",
                text_en: "[Professionalism] Conditions are identical for both darters. You adapt; you don't make excuses.",
                text_de: "[Professionalität] Die Bedingungen sind für beide gleich. Man passt sich an, statt Ausreden zu suchen.",
                text_nl: "[Professionaliteit] De omstandigheden zijn voor iedereen gelijk. Je past je aan, geen excuses.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Kibice i dziennikarze chwalą Twoje twarde, sportowe zasady.", outcome_en: "Fans and media laud your no-nonsense athletic mindset.", outcome_de: "Medien loben deine kompromisslose sportliche Haltung.", outcome_nl: "Media en fans prijzen je nuchtere topsportmentaliteit."
            },
            {
                text_pl: "[Medialność] Przeciąg? Jedyny wiatr, jaki tam wiał, to pęd moich lotek lądujących w potrójnej dwudziestce!",
                text_en: "[Showmanship] Draft? The only breeze up there was the wind from my darts crashing into the T20!",
                text_de: "[Showmanship] Zugluft? Der einzige Wind kam von meinen Darts, die im T20 einschlugen!",
                text_nl: "[Showmanship] Tocht? De enige wind op het podium kwam van mijn pijlen die in de T20 vlogen!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Twoja cięta riposta staje się viralem!", outcome_en: "Your sharp one-liner becomes an overnight internet sensation!", outcome_de: "Dein trockener Spruch wird zum absoluten Internet-Hit!", outcome_nl: "Je gevatte opmerking wordt een instant internethit!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po debiucie na scenie", title_en: "🎤 Stage Debut Interview", title_de: "🎤 Nach dem Bühnendebüt", title_nl: "🎤 Na het podiumdebuut",
        desc_pl: "DartsZone: 'To Twój pierwszy występ przed 5-tysięczną publicznością. Czułeś paraliżującą presję?'",
        desc_en: "DartsZone: 'First time playing in front of 5,000 screaming fans. Did you feel any stage fright?'",
        desc_de: "DartsZone: 'Dein erster Auftritt vor 5.000 Fans. Hattest du Lampenfieber?'",
        desc_nl: "DartsZone: 'Je eerste optreden voor 5.000 schreeuwende fans. Had je last van plankenkoorts?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Na początku tętno skoczyło, ale technika oddechowa pozwoliła mi szybko uspokoić rękę.",
                text_en: "[Professionalism] Heart was pounding early, but my breathing routine quickly steadied my hand.",
                text_de: "[Professionalität] Das Herz klopfte, aber Atemübungen brachten die nötige Ruhe in meine Hand.",
                text_nl: "[Professionaliteit] De hartslag was hoog, maar ademhalingsoefeningen brachten snel rust in mijn arm.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Psychologowie sportowi chwalą Twoje przygotowanie mentalne.", outcome_en: "Sports psychologists highlight your elite mental toolkit.", outcome_de: "Sportpsychologen loben deine mentale Vorbereitung.", outcome_nl: "Sportpsychologen prijzen je mentale beheersing."
            },
            {
                text_pl: "[Medialność] Paraliż? Ja się urodziłem dla takich tłumów! Im głośniej wyją, tym lepiej rzucam!",
                text_en: "[Showmanship] Fright? I feed on this noise! The louder they roar, the better I throw!",
                text_de: "[Showmanship] Angst? Ich lebe für diese Kulisse! Je lauter sie brüllen, desto besser werfe ich!",
                text_nl: "[Showmanship] Angst? Ik leef voor deze menigte! Hoe harder ze schreeuwen, hoe beter ik gooi!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fani na hali skandują Twoje nazwisko jeszcze długo po meczu!", outcome_en: "The crowd keeps chanting your name long after the broadcast finishes!", outcome_de: "Die Fans in der Halle singen deinen Namen noch lange nach dem Spiel!", outcome_nl: "De fans in de zaal scanderen je naam nog lang na de uitzending!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad przed kamerami ITVee", title_en: "🎤 ITVee Stage Desk", title_de: "🎤 ITVee Bühneninterview", title_nl: "🎤 ITVee Podiuminterview",
        desc_pl: "Dziennikarz: 'Wygrałeś 10. mecz z rzędu w cyklu PDC. Widzisz kogoś, kto może przerwać tę serię?'",
        desc_en: "Reporter: 'That's 10 consecutive match wins on the PDC circuit. Can anyone stop this streak?'",
        desc_de: "Reporter: 'Das ist dein 10. Sieg in Folge auf der PDC-Tour. Kann diese Serie überhaupt jemand stoppen?'",
        desc_nl: "Verslaggever: 'Dat is je 10e overwinning op rij in het PDC-circuit. Kan iemand deze zegereeks stoppen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Statystyki nic nie znaczą przy kolejnym losowaniu. Każdy rywal w Pro Tourze jest groźny.",
                text_en: "[Professionalism] Winning streaks mean nothing in the next draw. Every pro player is dangerous.",
                text_de: "[Professionalität] Serien bedeuten bei der nächsten Auslosung nichts. Jeder Profi ist gefährlich.",
                text_nl: "[Professionaliteit] Zegereeksen zeggen niets bij de volgende loting. Elke prof is gevaarlijk.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Szacunek wobec reszty stawki przysparza Ci sympatii rywali.", outcome_en: "Your respect toward the field earns you goodwill among tour pros.", outcome_de: "Dein Respekt bringt dir Sympathien bei den Kollegen ein.", outcome_nl: "Je respectvolle houding levert je veel sympathie op bij collega's."
            },
            {
                text_pl: "[Medialność] Szczerze? Musiałbym chyba rzucać lewą ręką, żeby któryś z nich miał ze mną szanse!",
                text_en: "[Showmanship] Honestly? I'd probably have to throw left-handed to give any of them a fighting chance!",
                text_de: "[Showmanship] Ehrlich? Ich müsste wohl mit links werfen, damit sie eine Chance haben!",
                text_nl: "[Showmanship] Eerlijk? Ik zou met links moeten gooien om ze een kans te geven!",
                effect: { prof: -5, pop: 7 },
                outcome_pl: "Arogancja najwyższej próby! Twoje nazwisko jest najgorętszym tematem w darcie.", outcome_en: "Peak arrogance! Your name is the most talked-about topic in global darts.", outcome_de: "Pure Arroganz! Dein Name ist das heißeste Thema der gesamten Darts-Welt.", outcome_nl: "Ongekende arrogantie! Je naam is het gesprek van de dag in de sportwereld."
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash Cloud Sports", title_en: "🎤 Cloud Sports Flash", title_de: "🎤 Cloud Sports Flash", title_nl: "🎤 Cloud Sports Flash",
        desc_pl: "Reporter: 'W połowie meczu zmieniłeś punkt celowania z T20 na T19. Skąd ta nagła decyzja taktyczna?'",
        desc_en: "Reporter: 'Mid-game you switched your scoring target from T20 down to T19. Why the sudden shift?'",
        desc_de: "Reporter: 'Mitten im Spiel hast du dein Scoring von T20 auf T19 umgestellt. Warum dieser Wechsel?'",
        desc_nl: "Verslaggever: 'Halverwege de partij schakelde je over van T20 naar T19. Waarom die plotselinge keuze?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zauważyłem, że lotki w T20 układały się zbyt stromo i blokowały pole. T19 dawało lepszy kąt wlotu.",
                text_en: "[Professionalism] First dart was standing up and blocking the bed. T19 offered a cleaner entry angle.",
                text_de: "[Professionalität] Die erste Feder stand zu steil im T20. Das T19-Segment bot den besseren Einfallswinkel.",
                text_nl: "[Professionaliteit] De eerste pijl lag in de weg in de T20. De T19 bood een veel betere invalshoek.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Komentatorzy chwalą Twój wybitny zmysł taktyczny i geometrię rzutu.", outcome_en: "Pundits marvel at your tactical IQ and board geometry awareness.", outcome_de: "Experten loben deinen taktischen Scharfsinn am Board.", outcome_nl: "Analisten roemen je tactische inzicht en bordkennis."
            },
            {
                text_pl: "[Medialność] T20 zrobiło się dla mnie za nudne! Chciałem pokazać, że umiem niszczyć tarczę w każdym sektorze.",
                text_en: "[Showmanship] T20 got boring! Wanted to prove I can dismantle the board wherever I aim.",
                text_de: "[Showmanship] Das T20 wurde mir zu langweilig! Wollte zeigen, dass ich jedes Segment dominieren kann.",
                text_nl: "[Showmanship] T20 werd te saai! Ik wilde laten zien dat ik overal op het bord kan domineren.",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Fani na trybunach uwielbiają Twoją brawurę i styl zabawy!", outcome_en: "The crowd goes wild for your swagger and flair!", outcome_de: "Die Fans feiern deine Leichtigkeit und Show-Qualitäten!", outcome_nl: "Het publiek smult van je bravoure en flair!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po nerwowej końcówce", title_en: "🎤 Tension at the Oche", title_de: "🎤 Nervenkitzel am Oche", title_nl: "🎤 Spanning aan de oche",
        desc_pl: "Darts Talk: 'Rywal spudłował 6 lotek meczowych, po czym wszedłeś na tarczę i skończyłeś mecz. Miał pecha?'",
        desc_en: "Darts Talk: 'Opponent blew 6 match darts before you stepped up to steal the win. Did he get unlucky?'",
        desc_de: "Darts Talk: 'Dein Gegner hat 6 Matchdarts vergeben, bevor du zugeschlagen hast. Hatte er Pech?'",
        desc_nl: "Darts Talk: 'Je tegenstander miste 6 matchdarts voordat jij toesloeg. Had hij gewoon pech?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Znam to uczucie, presja bywa bezlitosna. Współczuję mu, bo walczył dzielnie.",
                text_en: "[Professionalism] I know that feeling; pressure is brutal. Sympathies to him, he put up a great fight.",
                text_de: "[Professionalität] Ich kenne dieses Gefühl; der Druck ist brutal. Mitgefühl für ihn, er hat stark gekämpft.",
                text_nl: "[Professionaliteit] Ik ken dat gevoel; de druk is enorm. Medeleven voor hem, hij vocht dapper.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Rywal dziękuje Ci za pełne klasy zachowanie po meczu.", outcome_en: "Your opponent thanks you backstage for showing true sportsmanship.", outcome_de: "Dein Gegner bedankt sich im Backstage für dein faires Verhalten.", outcome_nl: "Je tegenstander bedankt je backstage voor je sportieve houding."
            },
            {
                text_pl: "[Medialność] Presja rozbija słabych graczy w pył. Jeśli dajesz mi drugą szansę, to sam podpisujesz swój wyrok!",
                text_en: "[Showmanship] Pressure breaks pretenders. Give me a second life, and you sign your own defeat!",
                text_de: "[Showmanship] Druck bricht schwache Nerven. Gib mir eine zweite Chance, und du hast verloren!",
                text_nl: "[Showmanship] Druk breekt de zwakkeren. Geef je mij een tweede kans, dan teken je je eigen vonnis!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Eksperci okrzyknęli Cię bezlitosnym egzekutorem!", outcome_en: "Media pundits label you the most ruthless finisher on tour!", outcome_de: "Experten küren dich zum eiskaltesten Vollstrecker der Tour!", outcome_nl: "Analisten bestempelen je als de meest meedogenloze afmaker van het circuit!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zwycięstwie w turnieju", title_en: "🎤 Champion's Circle", title_de: "🎤 Siegerinterview", title_nl: "🎤 Kampioensinterview",
        desc_pl: "Cloud Sports: 'Wznosisz trofeum w górę! Komu dedykujesz to wspaniałe zwycięstwo?'",
        desc_en: "Cloud Sports: 'Lifting the trophy into the air! Who do you dedicate this triumph to?'",
        desc_de: "Cloud Sports: 'Du stemmst die Trophäe in die Höhe! Wem widmest du diesen Triumph?'",
        desc_nl: "Cloud Sports: 'Je tilt de beker omhoog! Aan wie draag je deze overwinning op?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Mojej rodzinie, sponsorom i całemu zespołowi, który dba o moją formę każdego dnia.",
                text_en: "[Professionalism] To my family, my sponsors, and the whole support team working tirelessly behind me.",
                text_de: "[Professionalität] Meiner Familie, den Sponsoren und meinem Team, das täglich hinter mir steht.",
                text_nl: "[Professionaliteit] Aan mijn familie, sponsors en het hele team dat dagelijks voor me klaarstaat.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Sponsorzy są zachwyceni Twoim lojalnym podejściem.", outcome_en: "Corporate partners are thrilled with your loyalty and class.", outcome_de: "Sponsoren sind begeistert von deiner Loyalität und Vorbildfunktion.", outcome_nl: "Sponsors zijn dolblij met je loyaliteit en professionele uitstraling."
            },
            {
                text_pl: "[Medialność] Wszystkim hejterom, którzy we mnie wątpili! Patrzcie na ten puchar i płaczcie!",
                text_en: "[Showmanship] To all the haters who doubted me! Look at this silverware and weep!",
                text_de: "[Showmanship] An alle Hater, die an mir gezweifelt haben! Schaut auf den Pokal und weint!",
                text_nl: "[Showmanship] Aan alle haters die aan me twijfelden! Kijk naar deze beker en huil maar!",
                effect: { prof: -4, pop: 7 },
                outcome_pl: "Nagranie z dedykacją staje się hitem w internecie!", outcome_en: "Your fiery victory speech goes ultra-viral across sports media!", outcome_de: "Deine Siegesrede schlägt im Internet ein wie eine Bombe!", outcome_nl: "Je overwinningsspeech wordt miljoenen keren bekeken op internet!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów Viaplayr", title_en: "🎤 Viaplayr Flash Desk", title_de: "🎤 Viaplayr Flash-Desk", title_nl: "🎤 Viaplayr Flash Desk",
        desc_pl: "Dziennikarz: 'W trakcie meczu publiczność głośno wspierała Twojego rywala. Czułeś się samotny na scenie?'",
        desc_en: "Reporter: 'The entire arena was chanting for your rival. Did you feel completely alone up there?'",
        desc_de: "Reporter: 'Die ganze Halle hat deinen Gegner angefeuert. Hast du dich einsam auf der Bühne gefühlt?'",
        desc_nl: "Verslaggever: 'De hele zaal zong voor je tegenstander. Voelde je je eenzaam op het podium?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Kibice mają prawo kibicować komu chcą. Moim zadaniem jest trafianie potrójnych, nie walka z trybunami.",
                text_en: "[Professionalism] Crowd has every right to back their hero. My job is hitting trebles, not fighting the fans.",
                text_de: "[Professionalität] Die Fans dürfen anfeuern, wen sie wollen. Mein Job ist es, Trebles zu treffen, nicht gegen Fans zu kämpfen.",
                text_nl: "[Professionaliteit] Fans mogen aanmoedigen wie ze willen. Mijn taak is triples gooien, niet vechten met de zaal.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Dojrzała postawa zyskuje uznanie nawet wśród wrogich kibiców.", outcome_en: "Your stoic maturity wins over even hostile fanbases.", outcome_de: "Deine reife Haltung bringt dir selbst bei gegnerischen Fans Respekt ein.", outcome_nl: "Je volwassen houding dwingt zelfs bij vijandige fans respect af."
            },
            {
                text_pl: "[Medialność] Uwielbiam rolę złego charakteru! Im bardziej na mnie buczą, tym większą mam satysfakcję z ich uciszenia!",
                text_en: "[Showmanship] I love playing the villain! The louder they boo, the sweeter it feels when I take the win!",
                text_de: "[Showmanship] Ich liebe die Schurkenrolle! Je lauter sie buhen, desto süßer schmeckt der Sieg!",
                text_nl: "[Showmanship] Ik speel graag de schurk! Hoe harder ze jouwen, hoe zoeter de overwinning smaakt!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Zyskujesz reputację największego antybohatera i showmana w tourze!", outcome_en: "You cement your status as the premier anti-hero and ultimate entertainer of the tour!", outcome_de: "Du festigst deinen Ruf als charismatischer Anti-Held der Darts-Welt!", outcome_nl: "Je vestigt je status als de ultieme antiheld en showman van het circuit!"
            }
        ]
    },
    {
        title_pl: "🎤 Studio Cloud Sports", title_en: "🎤 Cloud Sports Studio", title_de: "🎤 Cloud Sports Studio", title_nl: "🎤 Cloud Sports Studio",
        desc_pl: "Ekspert pyta: 'Twój styl rzutu wydaje się bardzo dynamiczny i agresywny. Czy to celowa taktyka zastraszania rywali?'",
        desc_en: "Pundit asks: 'Your throwing motion looks very rapid and aggressive. Is that an intentional intimidation tactic?'",
        desc_de: "Experte fragt: 'Dein Wurfstil wirkt extrem dynamisch und aggressiv. Ist das eine bewusste Taktik zur Einschüchterung?'",
        desc_nl: "Analist vraagt: 'Je werpstijl oogt enorm snel en agressief. Is dat een bewuste tactiek om tegenstanders te intimideren?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] To po prostu naturalna mechanika mojego ciała. Skupiam się na powtarzalności, nie na rywalu.",
                text_en: "[Professionalism] It is simply my natural biomechanics. I focus purely on consistency, not my opponent.",
                text_de: "[Professionalität] Das ist reine Biomechanik. Ich konzentriere mich auf Konstanz, nicht auf den Gegner.",
                text_nl: "[Professionaliteit] Dat is puur mijn natuurlijke biomechanica. Ik focus op herhaling, niet op de tegenstander.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Trenerzy i analitycy doceniają Twoją techniczną dojrzałość.", outcome_en: "Coaches and analysts praise your technical discipline.", outcome_de: "Trainer und Analysten loben deine technische Disziplin.", outcome_nl: "Trainers en analisten prijzen je technische discipline."
            },
            {
                text_pl: "[Medialność] Jeśli szybkie tempo ich przeraża, to świetnie! Lubię patrzeć, jak panikują przy tarczy.",
                text_en: "[Showmanship] If my lightning pace terrifies them, even better! I love seeing them panic at the oche.",
                text_de: "[Showmanship] Wenn mein Tempo ihnen Angst macht, umso besser! Ich liebe es, sie panisch zu sehen.",
                text_nl: "[Showmanship] Als mijn tempo ze angst inboezemt, des te beter! Mooi om ze te zien zweten bij de oche.",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Komentatorzy nadają Ci przydomek bezwzględnego rewolwerowca!", outcome_en: "Commentators nickname you the ruthless gunslinger of the tour!", outcome_de: "Kommentatoren geben dir den Spitznamen 'Gunslinger'!", outcome_nl: "Commentatoren bombarderen je tot de snelste scherpschutter van het circuit!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów DartsZone", title_en: "🎤 DartsZone Flash Area", title_de: "🎤 DartsZone Interviewzone", title_nl: "🎤 DartsZone Interviewzone",
        desc_pl: "Dziennikarz: 'Wygrałeś spotkanie, rzucając aż osiem 180-tek w sześciu legach. Czy to był perfekcyjny scoring?'",
        desc_en: "Reporter: 'You won the match hitting eight 180s in just six legs. Was that maximum scoring perfection?'",
        desc_de: "Reporter: 'Acht 180er in sechs Legs! War das die absolute Perfektion beim Scoring?'",
        desc_nl: "Verslaggever: 'Acht 180-ers in slechts zes legs! Was dat ultieme perfectie op de triples?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Scoring był solidny, ale duble wciąż wymagają poprawy. Zawsze jest miejsce na postęp.",
                text_en: "[Professionalism] Scoring was solid, but doubles need work. There is always room for improvement.",
                text_de: "[Professionalität] Das Scoring war solide, aber die Doppel müssen besser werden. Man kann immer lernen.",
                text_nl: "[Professionaliteit] De scores waren degelijk, maar de dubbels moeten scherper. Er is altijd ruimte voor verbetering.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Eksperci są pod wrażeniem Twoich wyśrubowanych standardów.", outcome_en: "Pundits are amazed by your extraordinarily high standards.", outcome_de: "Experten sind beeindruckt von deinen extrem hohen Ansprüchen.", outcome_nl: "Analisten zijn onder de indruk van jouw torenhoge standaarden."
            },
            {
                text_pl: "[Medialność] Czerwone pole w T20 dzisiaj płonęło! Fani dostali to, za co zapłacili – rzeź na potrójnych!",
                text_en: "[Showmanship] The T20 bed was on fire! Fans got what they paid for – pure maximum carnage!",
                text_de: "[Showmanship] Das T20-Bett hat gebrannt! Die Fans bekamen ihr Spektakel – ein absolutes Feuerwerk!",
                text_nl: "[Showmanship] Het rood van de T20 stond in brand! De fans kregen waar voor hun geld – pure show!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Twój występ trafia do zestawienia najefektowniejszych meczów roku!", outcome_en: "Your highlights are compiled into the best displays of the season!", outcome_de: "Deine Highlights landen in den besten Zusammenschnitten des Jahres!", outcome_nl: "Jouw beelden belanden in de hoogtepunten van het jaar!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa ITVee", title_en: "🎤 ITVee Press Desk", title_de: "🎤 ITVee Pressebereich", title_nl: "🎤 ITVee Persdesk",
        desc_pl: "Pytanie: 'Twój przeciwnik po porażce nie podał Ci ręki i od razu zszedł ze sceny. Jak to skomentujesz?'",
        desc_en: "Question: 'Your opponent refused to shake hands and stormed off stage. What is your take on that?'",
        desc_de: "Frage: 'Dein Gegner hat dir den Handschlag verweigert und die Bühne verlassen. Dein Kommentar?'",
        desc_nl: "Vraag: 'Je tegenstander weigerde een handdruk en beende van het podium. Wat vind je daarvan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Emocje biorą górę po ciężkim meczu. Porozmawiamy w szatni, gdy opadnie kurz.",
                text_en: "[Professionalism] Emotions run high after a grueling match. We will clear the air backstage later.",
                text_de: "[Professionalität] Emotionen kochen hoch nach so einem Spiel. Wir reden später im Backstage in Ruhe.",
                text_nl: "[Professionaliteit] Emoties lopen hoog op na zo'n zware partij. We praten het backstage wel uit.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Klasa i spokój w trudnej sytuacji zjednują Ci sympatię zarządu federacji.", outcome_en: "Your graceful response earns respect from tournament directors.", outcome_de: "Deine souveräne Antwort bringt dir Respekt bei der Turnierleitung ein.", outcome_nl: "Je beheerste reactie levert respect op bij de toernooidirectie."
            },
            {
                text_pl: "[Medialność] Boli go porażka! Jeśli nie umie przegrywać z uśmiechem, niech wraca grać w pubie!",
                text_en: "[Showmanship] The truth hurts! If he can't swallow a defeat, he should go back to local leagues!",
                text_de: "[Showmanship] Verlieren tut weh! Wenn er das nicht abkann, soll er zurück in die Kneipe!",
                text_nl: "[Showmanship] Verliezen doet pijn! Als hij daar niet tegen kan, moet hij weer in de kroeg gaan gooien!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Dziennikarze podchwytują konflikt, robiąc z tego główny nagłówek dnia!", outcome_en: "Tabloids turn the confrontation into the biggest sports headline of the week!", outcome_de: "Die Boulevardpresse macht daraus die Schlagzeile der Woche!", outcome_nl: "De media maken van het conflict het gesprek van de dag!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Viaplayr", title_en: "🎤 Viaplayr Feature", title_de: "🎤 Viaplayr Feature", title_nl: "🎤 Viaplayr Feature",
        desc_pl: "Reporter: 'Wielu młodych adeptów darta kopiuje Twój chwyt lotki. Czujesz się wzorem do naśladowania?'",
        desc_en: "Reporter: 'Many young players are copying your exact grip. Do you see yourself as a role model?'",
        desc_de: "Reporter: 'Viele Nachwuchsspieler kopieren deinen Wurfstil. Siehst du dich als Vorbild?'",
        desc_nl: "Verslaggever: 'Veel jonge darters kopiëren jouw grip. Zie je jezelf als een rolmodel?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Cieszę się, ale radzę każdemu szukać własnego chwytu i budować indywidualny styl.",
                text_en: "[Professionalism] I am honored, but I advise every junior to develop their own natural grip.",
                text_de: "[Professionalität] Das ehrt mich, aber jeder sollte seinen eigenen natürlichen Stil entwickeln.",
                text_nl: "[Professionaliteit] Een eer, maar ik raad iedereen aan om zijn eigen natuurlijke stijl te vinden.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Akademie darta chętnie zapraszają Cię na warsztaty z młodzieżą.", outcome_en: "Darts academies invite you to host youth masterclasses.", outcome_de: "Darts-Akademien laden dich zu Workshops für Junioren ein.", outcome_nl: "Dartsacademies nodigen je uit voor clinics met de jeugd."
            },
            {
                text_pl: "[Medialność] Kopiują najlepszych! Jeśli chcą zdobywać puchary, muszą rzucać dokładnie tak jak ja!",
                text_en: "[Showmanship] They copy the greatest! If they want glory, they better replicate my exact magic!",
                text_de: "[Showmanship] Man kopiert eben die Besten! Wer Trophäen will, muss werfen wie ich!",
                text_nl: "[Showmanship] Ze kopiëren de beste! Wie bekers wil winnen, kan maar beter precies gooien zoals ik!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Kolejne miliony wyświetleń na TikToku pod hashtagiem z Twoim nazwiskiem!", outcome_en: "Millions of impressions flood TikTok under your signature hashtag!", outcome_de: "Millionen Views auf TikTok unter deinem Namen!", outcome_nl: "Miljoenen views op TikTok onder jouw hashtag!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Mieszana PDChat", title_en: "🎤 PDChat Mixed Zone", title_de: "🎤 PDChat Mixed-Zone", title_nl: "🎤 PDChat Mixed Zone",
        desc_pl: "Dziennikarz pyta: 'Przed meczem widać było, że pijesz wyłącznie wodę, podczas gdy inni wolą piwo. Skąd taki rygor?'",
        desc_en: "Reporter asks: 'Pre-match you drank only water while others drank beer. Why this strict lifestyle?'",
        desc_de: "Reporter fragt: 'Vor dem Spiel trinkst du nur Wasser, während andere Bier trinken. Woher diese Strenge?'",
        desc_nl: "Verslaggever vraagt: 'Voor de partij dronk je puur water terwijl anderen bier drinken. Vanwaar die discipline?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Współczesny dart to zawodowy sport. Dobre nawodnienie i czysty umysł to podstawa sukcesu.",
                text_en: "[Professionalism] Modern darts is professional athletics. Clean hydration and sharp mind are essential.",
                text_de: "[Professionalität] Moderner Dartsport ist Hochleistungssport. Hydration und klarer Kopf sind Pflicht.",
                text_nl: "[Professionaliteit] Modern darts is topsport. Goede hydratatie en een scherpe focus zijn cruciaal.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Lekarze i dietetycy sportowi stawiają Cię za wzór nowoczesnego atlety.", outcome_en: "Sports scientists hold you up as the gold standard of modern darts athletes.", outcome_de: "Sportmediziner loben deinen vorbildlichen Lebensstil.", outcome_nl: "Sportartsen prijzen je voorbeeldige levensstijl als topsporter."
            },
            {
                text_pl: "[Medialność] Każdy ma swój sposób na zabawę! Ja po prostu wolę świętować drogim szampanem po finale!",
                text_en: "[Showmanship] Everyone has their party routine! I just prefer popping vintage champagne after the final!",
                text_de: "[Showmanship] Jeder wie er mag! Ich feiere lieber mit teurem Champagner nach dem Finale!",
                text_nl: "[Showmanship] Ieder zijn ding! Ik trek liever een fles dure champagne open na de finale!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Kluby nocne i producenci alkoholi luksusowych oferują lukratywne kontrakty!", outcome_en: "Luxury lifestyle brands queue up to offer endorsement deals!", outcome_de: "Lifestyle-Marken stehen Schlange für Werbedeals!", outcome_nl: "Luxe lifestylemerken staan in de rij voor sponsordeals!"
            }
        ]
    },
    {
        title_pl: "🎤 Studio Sport1 TV", title_en: "🎤 Sport1 TV Desk", title_de: "🎤 Sport1 TV Studio", title_nl: "🎤 Sport1 TV Studio",
        desc_pl: "Pytanie: 'Czy uważasz, że kalendarz turniejowy PDC jest obecnie zbyt przeładowany wyjazdami?'",
        desc_en: "Question: 'Do you feel the PDC tournament schedule has become overloaded with international travel?'",
        desc_de: "Frage: 'Glaubst du, dass der PDC-Turnierkalender mittlerweile zu vollgepackt mit Reisen ist?'",
        desc_nl: "Vraag: 'Vind je dat de PDC-toernooikalender tegenwoordig te vol zit met internationale reizen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Podróże to trudny element tej pracy, ale profesjonalista musi umieć zarządzać regeneracją.",
                text_en: "[Professionalism] Travel is exhausting, but managing fatigue is the hallmark of a true professional.",
                text_de: "[Professionalität] Reisen ist anstrengend, aber Regenerationsmanagement gehört zum Profisein dazu.",
                text_nl: "[Professionaliteit] Reizen is zwaar, maar goed omgaan met herstel hoort bij een echte prof.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Organizatorzy cyklu turniejowego szanują Twoją dyscyplinę.", outcome_en: "Tour promoters respect your constructive attitude.", outcome_de: "Die Tour-Veranstalter schätzen deine professionelle Einstellung.", outcome_nl: "Toernooiorganisatoren waarderen je professionele houding."
            },
            {
                text_pl: "[Medialność] Więcej turniejów to więcej kasy do zgarnięcia! Mogę latać po całym świecie co weekend!",
                text_en: "[Showmanship] More tournaments mean more cash up for grabs! I will fly anywhere to claim my cheques!",
                text_de: "[Showmanship] Mehr Turniere bedeuten mehr Preisgeld! Ich fliege überall hin, um abzukassieren!",
                text_nl: "[Showmanship] Meer toernooien betekent meer prijzengeld! Ik vlieg overal heen om te cashen!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fani uwielbiają Twój nieposkromiony apetyt na kolejne nagrody!", outcome_en: "Fans love your unquenchable hunger for prize money and glory!", outcome_de: "Die Fans lieben deinen unstillbaren Hunger auf Preisgelder!", outcome_nl: "Fans smullen van je honger naar overwinningen en prijzengeld!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash Darts Talk", title_en: "🎤 Darts Talk Flash", title_de: "🎤 Darts Talk Flash", title_nl: "🎤 Darts Talk Flash",
        desc_pl: "Dziennikarz: 'Wygrałeś spotkanie zaledwie jednym przełamaniem. Czy czujesz, że miałeś dziś sporo szczęścia?'",
        desc_en: "Reporter: 'You edged the match by a single break of throw. Did luck play a big role today?'",
        desc_de: "Reporter: 'Du hast das Spiel mit nur einem Break gewonnen. War da heute viel Glück im Spiel?'",
        desc_nl: "Verslaggever: 'Je won de partij met slechts één break verschil. Speelde geluk vandaag een grote rol?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Szczęście sprzyja przygotowanym. Wykorzystałem jedyną szansę, którą dał mi rywal.",
                text_en: "[Professionalism] Luck favors the prepared mind. I simply capitalized on the sole opening I got.",
                text_de: "[Professionalität] Glück hat nur der Tüchtige. Ich habe die einzige Chance eiskalt genutzt.",
                text_nl: "[Professionaliteit] Geluk dwing je af. Ik profiteerde optimaal van de enige kans die ik kreeg.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci podkreślają Twoją zabójczą skuteczność w kluczowych momentach.", outcome_en: "Commentators praise your clinical opportunism in high-leverage legs.", outcome_de: "Experten loben deine gnadenlose Effizienz in den Schlüsselmomenten.", outcome_nl: "Analisten roemen je dodelijke efficiëntie op cruciale momenten."
            },
            {
                text_pl: "[Medialność] Szczęście? To był czysty geniusz w najważniejszym legu meczu!",
                text_en: "[Showmanship] Luck? That was pure clutch genius in the biggest leg of the night!",
                text_de: "[Showmanship] Glück? Das war pure Genialität im wichtigsten Leg des Abends!",
                text_nl: "[Showmanship] Geluk? Dat was pure genialiteit in de belangrijkste leg van de avond!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Klip z Twoim przełamaniem krąży jako podręcznik zimnej krwi!", outcome_en: "Clips of your break of throw circulate as the definition of cold-blooded darts!", outcome_de: "Der Clip deines Breaks geht als Musterbeispiel für Nervenstärke viral!", outcome_nl: "Het fragment van jouw break gaat rond als het ultieme bewijs van stalen zenuwen!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po wygranym ćwierćfinale", title_en: "🎤 Quarterfinal Debrief", title_de: "🎤 Nach dem Viertelfinale", title_nl: "🎤 Na de kwartfinale",
        desc_pl: "Cloud Sports: 'W półfinale czeka na Ciebie numer jeden rankingu światowego. Czy masz na niego specjalny plan?'",
        desc_en: "Cloud Sports: 'World Number 1 awaits you in the semifinal. Do you have a specialized gameplan?'",
        desc_de: "Cloud Sports: 'Im Halbfinale wartet die Nummer 1 der Welt. Hast du einen speziellen Matchplan?'",
        desc_nl: "Cloud Sports: 'In de halve finale wacht de nummer 1 van de wereld. Heb je een specifiek strijdplan?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Znamy się doskonale. Skupię się na utrzymaniu własnego licznika i regularnym domykaniu legów.",
                text_en: "[Professionalism] We know each other's games well. I will focus on holding my throw and hitting clinical checkouts.",
                text_de: "[Professionalität] Wir kennen uns gut. Mein Fokus liegt auf den eigenen Anwürfen und sicheren Checkouts.",
                text_nl: "[Professionaliteit] We kennen elkaar goed. De focus ligt op eigen legbehoud en strakke finishes.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Dojrzała zapowiedź budzi respekt przed jutrzejszym hitem.", outcome_en: "A mature statement builds immense anticipation for tomorrow's clash.", outcome_de: "Eine reife Aussage sorgt für Vorfreude auf den morgigen Kracher.", outcome_nl: "Een volwassen vooruitblik zorgt voor enorme voorpret bij de fans."
            },
            {
                text_pl: "[Medialność] Plan jest prosty: wyjść, rozbić go 180-tkami i zrzucić z tronu na oczach całego świata!",
                text_en: "[Showmanship] The plan is simple: blast him off the stage with 180s and take his crown on live TV!",
                text_de: "[Showmanship] Der Plan ist simpel: Ihn mit 180ern von der Bühne fegen und vor aller Welt entthronen!",
                text_nl: "[Showmanship] Het plan is simpel: hem wegblazen met 180-ers en live op tv van zijn troon stoten!",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Bilety na sesję wieczorną wyprzedają się w kilka minut!", outcome_en: "Tickets for the evening session sell out within minutes of your broadcast!", outcome_de: "Tickets für die Abendsession sind binnen Minuten restlos ausverkauft!", outcome_nl: "Kaarten voor de avondsessie zijn binnen enkele minuten uitverkocht!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa The Dart Paper", title_en: "🎤 The Dart Paper Interview", title_de: "🎤 The Dart Paper Presse", title_nl: "🎤 The Dart Paper Interview",
        desc_pl: "Pytanie: 'Wielu graczy zatrudnia psychologów sportowych. Czy korzystasz z pomocy specjalistów od głowy?'",
        desc_en: "Question: 'Many tour pros employ sports psychologists. Do you utilize mental performance coaches?'",
        desc_de: "Frage: 'Viele Profis arbeiten mit Mentaltrainern. Nutzt du sportpsychologische Unterstützung?'",
        desc_nl: "Vraag: 'Veel profs werken met sportpsychologen. Maak jij gebruik van mentale begeleiding?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Tak, regularny trening mentalny i techniki wizualizacji to klucz do stabilności w turniejach.",
                text_en: "[Professionalism] Yes, visualization and mental conditioning routines are critical for long-term consistency.",
                text_de: "[Professionalität] Ja, Visualisierung und mentales Training sind der Schlüssel zu konstanter Leistung.",
                text_nl: "[Professionaliteit] Ja, visualisatie en mentale training zijn essentieel voor constante topprestaties.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Trenerzy stawiają Twoje profesjonalne przygotowanie za wzór dla kadry.", outcome_en: "National coaching setups highlight your progressive approach.", outcome_de: "Leistungszentren loben deinen modernen Trainingsansatz.", outcome_nl: "Nationale bonden noemen jouw aanpak een lichtend voorbeeld."
            },
            {
                text_pl: "[Medialność] Moją psychologią jest wiara we własne ręce i chęć zmiażdżenia każdego, kto stanie naprzeciwko!",
                text_en: "[Showmanship] My psychology is believing in my right arm and crushing anyone standing across from me!",
                text_de: "[Showmanship] Meine Psychologie ist der Glaube an meinen Arm und der Wille, jeden Gegner zu dominieren!",
                text_nl: "[Showmanship] Mijn psychologie is blind vertrouwen in mijn rechterarm en iedereen van het bord vegen!",
                effect: { prof: -3, pop: 4 },
                outcome_pl: "Cytat staje się internetowym manifestem pewności siebie!", outcome_en: "Your quote becomes a viral manifesto of ultimate self-belief!", outcome_de: "Dein Zitat wird zum viralen Manifest für unbändiges Selbstvertrauen!", outcome_nl: "Je quote wordt een virale hit als ultiem symbool van zelfvertrouwen!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zmianie lotek", title_en: "🎤 Equipment Change Chat", title_de: "🎤 Nach Materialwechsel", title_nl: "🎤 Na materiaalwissel",
        desc_pl: "DartsZone: 'Zagrałeś dziś nowym modelem lotek z innym frezowaniem. Jak oceniasz ich zachowanie w tarczy?'",
        desc_en: "DartsZone: 'You debuted a new barrel grip profile tonight. How did they sit in the sisal under TV heat?'",
        desc_de: "DartsZone: 'Du hast heute Darts mit neuem Grip gespielt. Wie fühlten sie sich unter den Scheinwerfern an?'",
        desc_nl: "DartsZone: 'Je speelde met een nieuw type grip op je barrels. Hoe voelde dat onder de warme tv-lampen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Nowy mikrorowek daje lepszą kontrolę przy spoconych dłoniach. Sprzęt spisał się bez zarzutu.",
                text_en: "[Professionalism] The micro-grooves provide superior release control under hot lights. The barrels performed perfectly.",
                text_de: "[Professionalität] Das Micro-Grip-Profil gibt perfekte Kontrolle bei schwitzigen Händen. Top-Material.",
                text_nl: "[Professionaliteit] De micro-grip geeft perfecte controle bij warme handen. Het materiaal voldeed aan alle eisen.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Twój sponsor techniczny notuje natychmiastowy skok zamówień na ten model!", outcome_en: "Your technical darts sponsor reports an instant surge in pre-orders!", outcome_de: "Dein Ausrüster verzeichnet einen sofortigen Ansturm auf das Modell!", outcome_nl: "Je materiaalsponsor ziet direct een enorme piek in bestellingen!"
            },
            {
                text_pl: "[Medialność] Te lotki są jak pociski samonaprowadzające! W moich rękach każda lotka staje się śmiercionośna!",
                text_en: "[Showmanship] These barrels are laser-guided missiles! In my hands, any piece of tungsten is deadly!",
                text_de: "[Showmanship] Diese Darts sind lasergesteuerte Raketen! In meinen Händen ist jedes Tungsten tödlich!",
                text_nl: "[Showmanship] Deze pijlen zijn net lasergestuurde raketten! In mijn handen is elk stuk tungsten dodelijk!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Fani masowo wykupują Twoje sygnowane rzutki!", outcome_en: "Fans clean out stock of your signature darts worldwide!", outcome_de: "Fans kaufen weltweit deine Signature-Darts leer!", outcome_nl: "Fans kopen wereldwijd jouw signature pijlen massaal op!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash ITVee", title_en: "🎤 ITVee Flash Zone", title_de: "🎤 ITVee Flash-Zone", title_nl: "🎤 ITVee Flitszone",
        desc_pl: "Reporter: 'Wygrałeś mecz, zamykając 125 punktów przez Bull-25-Bullseye! Czy to była zaplanowana trasa?'",
        desc_en: "Reporter: 'You sealed victory checking out 125 via Bull-25-Bullseye! Was that planned showboating?'",
        desc_de: "Reporter: 'Du beendest das Spiel mit einem 125er Finish über Bull-25-Bull! War das geplante Show?'",
        desc_nl: "Verslaggever: 'Je besliste de partij met een 125 finish via Bull-25-Bullseye! Was dat gepland spektakel?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Pierwsza lotka trafiła w czerwony środek, więc matematycznie była to najbardziej logiczna ścieżka.",
                text_en: "[Professionalism] The first dart hit the red bull, so mathematically it was the cleanest remaining route.",
                text_de: "[Professionalität] Der erste Dart saß im Bull, mathematisch war es der sauberste verbliebene Weg.",
                text_nl: "[Professionaliteit] De eerste pijl zat in de bull, wiskundig gezien was het de meest logische route.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci matematyki darterskiej chwalą Twoje błyskawiczne liczenie.", outcome_en: "Darts mathematicians praise your split-second arithmetic brilliance.", outcome_de: "Darts-Mathematiker loben dein blitzschnelles Rechenvermögen.", outcome_nl: "Rekenmeesters in de studio prijzen je razendsnelle bordkennis."
            },
            {
                text_pl: "[Medialność] Oczywiście! Zwykłe końcówki są nudne, publiczność zasługuje na absolutną magię na tarczy!",
                text_en: "[Showmanship] Absolutely! Standard routes are boring; the paying audience deserves pure showtime wizardry!",
                text_de: "[Showmanship] Na klar! Standardwege sind langweilig, die Fans wollen echte Magie am Board sehen!",
                text_nl: "[Showmanship] Zeker weten! Standaard routes zijn saai, het publiek verdient pure tovenarij!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Finisz zostaje okrzyknięty zagraniem miesiąca w telewizji!", outcome_en: "Your finish is voted the undisputed TV shot of the month!", outcome_de: "Dein Finish wird im TV zum Checkout des Monats gewählt!", outcome_nl: "Je finish wordt op tv unaniem verkozen tot finish van de maand!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Viaplayr", title_en: "🎤 Viaplayr Exclusive", title_de: "🎤 Viaplayr Exklusiv", title_nl: "🎤 Viaplayr Exclusief",
        desc_pl: "Dziennikarz: 'Czy czujesz, że sędzia caller zbyt wolno wyciągał lotki, co spowalniało Twój rytm rzutowy?'",
        desc_en: "Reporter: 'Did you feel the stage referee pulled darts too slowly, disrupting your rhythm?'",
        desc_de: "Reporter: 'Fandest du, dass der Caller die Darts zu langsam notiert und deinen Fluss gestört hat?'",
        desc_nl: "Verslaggever: 'Vond je dat de caller de scores te langzaam omriep en je ritme verstoorde?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Sędziowie na scenie wykonują znakomitą i trudną pracę. Nie szukam problemów tam, gdzie ich nie ma.",
                text_en: "[Professionalism] Stage referees do an outstanding and difficult job. I focus entirely on my own performance.",
                text_de: "[Professionalität] Die Schiedsrichter leisten fantastische Arbeit. Ich suche Fehler nur bei mir selbst.",
                text_nl: "[Professionaliteit] De officials doen fantastisch werk. Ik zoek de fouten altijd bij mezelf.",
                effect: { prof: 4, pop: -1 },
                outcome_pl: "Sędziowie i oficjele turniejowi darzą Cię ogromnym szacunkiem.", outcome_en: "PDC officials and referees deeply respect your professionalism.", outcome_de: "Offizielle und Schiedsrichter schätzen deine vorbildliche Art.", outcome_nl: "PDC-officials en scheidsrechters waarderen je respectvolle opstelling."
            },
            {
                text_pl: "[Medialność] Powinien założyć wrotki! Kiedy jestem w transie, muszę mieć wolną tarczę w ułamku sekundy!",
                text_en: "[Showmanship] Put some roller skates on him! When I am in the zone, I need that board clear immediately!",
                text_de: "[Showmanship] Gebt dem Mann Rollschuhe! Wenn ich im Tunnel bin, muss das Board sofort frei sein!",
                text_nl: "[Showmanship] Geef die man rolschaatsen! Als ik in de zone zit, moet dat bord meteen leeg zijn!",
                effect: { prof: -4, pop: 5 },
                outcome_pl: "Twoja wypowiedź wywołuje salwy śmiechu w studiu telewizyjnym!", outcome_en: "Your cheeky quote triggers bursts of laughter in the television studio!", outcome_de: "Dein Spruch sorgt für schallendes Gelächter im Fernsehstudio!", outcome_nl: "Je uitspraak zorgt voor grote hilariteit in de studio!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Mediów DartWorld 24", title_en: "🎤 DartWorld 24 Desk", title_de: "🎤 DartWorld 24 Studio", title_nl: "🎤 DartWorld 24 Studio",
        desc_pl: "Pytanie: 'Czy Twoja rutyna treningowa obejmuje bieganie lub trening na siłowni, jak u nowoczesnych sportowców?'",
        desc_en: "Question: 'Does your regimen include cardio and gym workouts like a modern athlete?'",
        desc_de: "Frage: 'Gehören Ausdauer- und Krafttraining zu deinem Alltag wie bei modernen Athleten?'",
        desc_nl: "Vraag: 'Maakt conditie- en krachttraining deel uit van jouw routine zoals bij moderne atleten?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Tak, wzmacnianie mięśni głębokich i nóg jest kluczem, by stać stabilnie przez 2 godziny meczu.",
                text_en: "[Professionalism] Yes, core strength and endurance workouts ensure absolute stability during long matches.",
                text_de: "[Professionalität] Ja, Rumpf- und Beintraining sind essenziell für einen felsenfesten Stand am Oche.",
                text_nl: "[Professionaliteit] Ja, core-stability en conditie zijn cruciaal om urenlang stabiel aan de oche te staan.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Dziennikarze sportowi chwalą Twoje nowatorskie podejście do przygotowania fizycznego.", outcome_en: "Mainstream sports media highlights your modern physical conditioning.", outcome_de: "Sportjournalisten loben deinen modernen Fitnessansatz.", outcome_nl: "Sportjournalisten prijzen jouw moderne fysieke benadering van de sport."
            },
            {
                text_pl: "[Medialność] Moją siłownią jest podnoszenie kufli i pucharów! Liczy się tylko oko i stalowa ręka!",
                text_en: "[Showmanship] My gym routine is lifting trophies! All that matters is razor vision and a golden arm!",
                text_de: "[Showmanship] Mein Fitnessstudio ist das Heben von Pokalen! Alles was zählt sind Auge und Hand!",
                text_nl: "[Showmanship] Mijn sportschool is het tillen van bekers! Het enige wat telt is een scherp oog en een gouden arm!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Tradycyjni fani darta uznają Cię za prawdziwą duszę towarzystwa!", outcome_en: "Old-school darts fans salute you as a true pub-culture legend!", outcome_de: "Oldschool-Dartsfans feiern dich als echte Kultfigur!", outcome_nl: "Oldschool dartfans eren jou als een echte cultheld van de sport!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po meczu w Premier League / GDL", title_en: "🎤 Premier League / GDL Night", title_de: "🎤 Premier League / GDL Abend", title_nl: "🎤 Premier League / GDL Avond",
        desc_pl: "Cloud Sports: 'Kolejny czwartkowy wieczór, kolejna pełna hala na 10 tysięcy widzów. Jak radzisz sobie ze zmęczeniem w lidze?'",
        desc_en: "Cloud Sports: 'Another Thursday night in front of 10,000 screaming fans. How do you manage the league grind?'",
        desc_de: "Cloud Sports: 'Wieder ein Donnerstag vor 10.000 Fans. Wie meisterst du diesen wöchentlichen Liga-Stress?'",
        desc_nl: "Cloud Sports: 'Weer een donderdagavond voor 10.000 man. Hoe ga je om met de loodzware wekelijkse competitie?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Odpowiednia dieta, sen i regeneracja między czwartkiem a turniejami weekendowymi to podstawa.",
                text_en: "[Professionalism] Strict nutrition, sleep discipline, and recovery between Thursdays and weekends are non-negotiable.",
                text_de: "[Professionalität] Disziplin bei Ernährung, Schlaf und Erholung zwischen den Spieltagen ist Pflicht.",
                text_nl: "[Professionaliteit] Strikte voeding, slaap en herstel tussen de donderdagen en het weekend zijn essentieel.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Komentatorzy wskazują Cię jako wzór wytrzymałości w maratonie ligowym.", outcome_en: "Pundits pinpoint your endurance as the blueprint for surviving the league grind.", outcome_de: "Kommentatoren loben deine Ausdauer im langen Liga-Marathon.", outcome_nl: "Analisten noemen jouw uithoudingsvermogen de blauwdruk voor de competitie."
            },
            {
                text_pl: "[Medialność] Kocham to! Dajcie mi mikrofon, dajcie mi 10 tysięcy ludzi i patrzcie, jak robię show!",
                text_en: "[Showmanship] I thrive on this! Give me the spotlight, 10,000 screaming fans, and watch me put on a show!",
                text_de: "[Showmanship] Ich liebe das! Gebt mir die Bühne, 10.000 Fans und schaut zu, wie ich die Hütte abreiße!",
                text_nl: "[Showmanship] Ik leef hiervoor! Geef mij de schijnwerpers, 10.000 man en geniet van de show!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Organizatorzy ligi traktują Cię jako główną lokomotywę marketingową!", outcome_en: "League promoters utilize your face as the headline billboard for the tour!", outcome_de: "Die Liga-Vermarkter nutzen dein Gesicht als Hauptplakat der gesamten Tour!", outcome_nl: "De toernooiorganisatie gebruikt jouw beeltenis als het uithangbord van de competitie!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Błyskawiczna PDChat", title_en: "🎤 PDChat Flash Desk", title_de: "🎤 PDChat Blitz-Zone", title_nl: "🎤 PDChat Flitsdesk",
        desc_pl: "Dziennikarz: 'Wygrałeś mecz ze średnią poniżej 85 punktów. Jak podsumujesz to mało efektowne spotkanie?'",
        desc_en: "Reporter: 'You scraped through with a sub-85 average. How do you assess this scrappy performance?'",
        desc_de: "Reporter: 'Ein mühsamer Sieg mit einem Schnitt unter 85. Wie bewertest du diesen Arbeitssieg?'",
        desc_nl: "Verslaggever: 'Een moeizame zege met een gemiddelde onder de 85. Hoe kijk je terug op deze worstelpartij?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Czasami trzeba umieć wygrać brzydki mecz. Zwycięstwo to zwycięstwo, ale wracam prosto do tarczy treningowej.",
                text_en: "[Professionalism] Sometimes you have to win ugly. A win is a win, but I am heading straight back to the practice board.",
                text_de: "[Professionalität] Manchmal muss man dreckig gewinnen. Sieg ist Sieg, aber morgen wird hart trainiert.",
                text_nl: "[Professionaliteit] Soms moet je lelijk winnen. Winst is winst, maar ik sta morgen weer vroeg aan het bord.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Eksperci chwalą Twój pragmatyzm i umiejętność przepychania trudnych spotkań.", outcome_en: "Pundits praise your championship grit and ability to win when playing below par.", outcome_de: "Experten loben deine mentale Härte bei schwächeren Leistungen.", outcome_nl: "Analisten prijzen je vermogen om ook op mindere dagen de winst over de streep te trekken."
            },
            {
                text_pl: "[Medialność] Nawet rzucając na pół gwizdka, jestem lepszy od większości tych chłopaków!",
                text_en: "[Showmanship] Even throwing in second gear with my eyes half-closed, I am still levels above the rest!",
                text_de: "[Showmanship] Selbst im Schongang bin ich immer noch eine Klasse besser als die Konkurrenz!",
                text_nl: "[Showmanship] Zelfs op halve kracht ben ik nog steeds een klasse beter dan de rest hier!",
                effect: { prof: -4, pop: 4 },
                outcome_pl: "Twoja wypowiedź podgrzewa atmosferę w szatni przed kolejną rundą!", outcome_en: "Your swagger sparks fierce dressing-room debates ahead of the next round!", outcome_de: "Dein Spruch sorgt für reichlich Zündstoff im Spielbereich!", outcome_nl: "Je uitspraak zet de verhoudingen in de kleedkamer op scherp!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po zwycięstwie w World Grand Prix", title_en: "🎤 World Grand Prix Debrief", title_de: "🎤 Nach dem World Grand Prix", title_nl: "🎤 Na de World Grand Prix",
        desc_pl: "Cloud Sports: 'Zasady Double-In/Double-Out sprawiają wielu graczom ogromne trudności. Dlaczego dla Ciebie to taka łatwizna?'",
        desc_en: "Cloud Sports: 'Double-In/Double-Out format breaks so many players. Why do you make it look so effortless?'",
        desc_de: "Cloud Sports: 'Der Double-In/Double-Out-Modus bricht viele Stars. Warum wirkt das bei dir so spielend leicht?'",
        desc_nl: "Cloud Sports: 'Het Double-In/Double-Out format breekt veel toppers. Waarom oogt het bij jou zo moeiteloos?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Mój sekret to setki godzin spędzonych na rzutach w pierścień podwójny przed turniejem. Trening popłaca.",
                text_en: "[Professionalism] My secret is hundreds of hours practicing outer ring targets exclusively. Dedicated preparation pays off.",
                text_de: "[Professionalität] Mein Geheimnis sind hunderte Stunden gezieltes Doppeltraining. Harte Arbeit zahlt sich aus.",
                text_nl: "[Professionaliteit] Mijn geheim is honderden uren gericht trainen op de buitenste ring. Voorbereiding loont.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Zostajesz uznany za najbardziej technicznego mistrza podwójnych w tourze.", outcome_en: "Pundits crown you the premier technical master of the outer wire in darts.", outcome_de: "Experten küren dich zum technisch versiertesten Doppel-Spezialisten der Welt.", outcome_nl: "Analisten kronen jou tot de meest begaafde dubbelspecialist van de tour."
            },
            {
                text_pl: "[Medialność] Bo ja trafiam duble na zawołanie! Nie ma znaczenia, czy zaczynam od góry, czy od dołu tarczy!",
                text_en: "[Showmanship] Because I hit doubles in my sleep! Doesn't matter if I start on top or finish on the wire!",
                text_de: "[Showmanship] Weil ich Doppel im Schlaf treffe! Egal ob zum Start oder zum Sieg – ich treffe immer!",
                text_nl: "[Showmanship] Omdat ik dubbels met mijn ogen dicht raak! Maakt niet uit of het om te beginnen of finishen is!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Kibice uznają Cię za króla formatu z podwójnym otwarciem!", outcome_en: "Fans celebrate you as the undisputed king of the Double-In format!", outcome_de: "Die Fans feiern dich als unumstrittenen König des Double-In-Formats!", outcome_nl: "Fans vieren jou als de onbetwiste koning van het Double-In format!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Prasowa DartsZone", title_en: "🎤 DartsZone Press Hub", title_de: "🎤 DartsZone Pressezentrum", title_nl: "🎤 DartsZone Pershub",
        desc_pl: "Pytanie: 'Widzieliśmy, że po wygranym meczu rozdałeś autografy i robiłeś zdjęcia z fanami przez ponad godzinę. Nie jesteś zmęczony?'",
        desc_en: "Question: 'You spent over an hour signing autographs and taking selfies with fans after your win. Not exhausted?'",
        desc_de: "Frage: 'Du hast nach dem Sieg über eine Stunde lang Autogramme geschrieben und Selfies gemacht. Gar nicht müde?'",
        desc_nl: "Vraag: 'Je hebt na je zege meer dan een uur handtekeningen uitgedeeld en selfies gemaakt. Ben je niet kapot?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Kibice płacą za bilety i wspierają nasz sport. Poświęcenie im czasu to mój zawodowy obowiązek.",
                text_en: "[Professionalism] Fans pay their hard-earned money to support us. Giving back my time is a professional duty.",
                text_de: "[Professionalität] Die Fans zahlen hart verdientes Geld für Tickets. Ihnen Zeit zu schenken, ist meine Pflicht als Profi.",
                text_nl: "[Professionaliteit] De fans betalen hun zuurverdiende geld voor tickets. Tijd voor ze maken is mijn plicht als prof.",
                effect: { prof: 3, pop: 1 },
                outcome_pl: "Kibice na całym świecie uznają Cię za wzór sportowca z klasą.", outcome_en: "Fans globally praise your down-to-earth humility and ambassadorial class.", outcome_de: "Fans weltweit schätzen deine Fannähe und Bodenständigkeit.", outcome_nl: "Fans wereldwijd prijzen jouw benaderbaarheid en klasse als ambassadeur."
            },
            {
                text_pl: "[Medialność] Uwielbiam blask fleszy i uwielbienie tłumów! Fani wiedzą, kto jest prawdziwą gwiazdą tego wieczoru!",
                text_en: "[Showmanship] I live for the flashing cameras and the adoration! The crowd knows who the real superstar is!",
                text_de: "[Showmanship] Ich lebe für das Scheinwerferlicht und den Jubel! Die Fans wissen, wer hier der Superstar ist!",
                text_nl: "[Showmanship] Ik leef voor de camera's en de adoratie! Het publiek weet wie de echte superster is!",
                effect: { prof: -2, pop: 6 },
                outcome_pl: "Twoje zdjęcia z fanami zalewają media społecznościowe, windując zasięgi!", outcome_en: "Fan selfies explode across social feeds, sending your follower count soaring!", outcome_de: "Fan-Selfies überfluten die Feeds und lassen deine Followerzahlen explodieren!", outcome_nl: "Fan-selfies overspoelen social media en laten je volgersaantal exploderen!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po Big Fishu (170 checkout)", title_en: "🎤 Big Fish Checkout Special", title_de: "🎤 Nach dem 'Big Fish' (170)", title_nl: "🎤 Na de 'Big Fish' (170 finish)",
        desc_pl: "Cloud Sports: 'BIG FISH! Zamknąłeś 170 punktów rzutem w sam środek tarczy! Czy to najpiękniejszy zamek w Twojej karierze?'",
        desc_en: "Cloud Sports: 'THE BIG FISH! You took out 170 right in the dead-center Bullseye! The greatest checkout of your life?'",
        desc_de: "Cloud Sports: 'THE BIG FISH! 170 Punkte mitten ins Bullseye zum Sieg! Der schönste Checkout deines Lebens?'",
        desc_nl: "Cloud Sports: 'THE BIG FISH! Je gooide 170 uit recht in de Bullseye! De mooiste finish uit je carrière?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zawsze celuję w Bullseye z pełnym przekonaniem. Piękny finisz, ale najważniejsza jest wygrana w całym meczu.",
                text_en: "[Professionalism] I committed to the Bullseye with 100% conviction. A fantastic finish, but closing the match is what matters.",
                text_de: "[Professionalität] Ich habe das Bullseye mit voller Überzeugung anvisiert. Ein tolles Finish, aber der Sieg zählt.",
                text_nl: "[Professionaliteit] Ik gooide met volle overtuiging op de Bullseye. Een fantastische finish, maar de winst telt.",
                effect: { prof: 4, pop: 1 },
                outcome_pl: "Komentatorzy chwalą Twoje opanowanie przy najtrudniejszym zamku świata.", outcome_en: "Pundits applaud your cool composure executing the hardest finish in darts.", outcome_de: "Experten loben deine Eiseskälte beim schwierigsten Checkout der Welt.", outcome_nl: "Analisten prijzen je kalmte bij de moeilijkste finish in de dartssport."
            },
            {
                text_pl: "[Medialność] Wyciągnąłem wielką rybę na oczach całego świata! Kto potrafi to zrobić lepiej niż ja?!",
                text_en: "[Showmanship] Reeled in the Big Fish on live world television! Nobody on this earth does it with more swagger than me!",
                text_de: "[Showmanship] Den 'Big Fish' live vor Millionen gefangen! Niemand zelebriert das besser als ich!",
                text_nl: "[Showmanship] De Big Fish binnengehaald voor miljoenen kijkers! Niemand doet dit met meer klasse dan ik!",
                effect: { prof: -2, pop: 7 },
                outcome_pl: "Nagranie z Twoim 170 checkoutem staje się hitem programów sportowych!", outcome_en: "Broadcast replay of your 170 becomes the top sports reel of the week globally!", outcome_de: "Dein 170er-Finish wird zum weltweiten Top-Highlight der Sportwoche!", outcome_nl: "De beelden van je 170 finish worden wereldwijd het sporthoogtepunt van de week!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Wywiadów Viaplayr", title_en: "🎤 Viaplayr Flash Corner", title_de: "🎤 Viaplayr Blitz-Ecke", title_nl: "🎤 Viaplayr Flitshoek",
        desc_pl: "Reporter: 'Wygrałeś mecz bez straty ani jednego lega (tzw. whitewash 6:0). Czy rywal w ogóle zawiesił poprzeczkę?'",
        desc_en: "Reporter: 'You swept the match without conceding a single leg (6-0 whitewash). Did your rival even challenge you?'",
        desc_de: "Reporter: 'Ein glatter 6:0-Whitewash ohne Legverlust. War dein Gegner überhaupt eine Hürde?'",
        desc_nl: "Verslaggever: 'Een afgetekende 6-0 whitewash zonder legverlies. Was je tegenstander überhaupt een partij?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Wynik 6:0 nie oddaje walki na tarczy. Rywal miał swoje szanse na dublach, ja byłem po prostu skuteczniejszy.",
                text_en: "[Professionalism] The 6-0 scoreline is flattering. He had chances at doubles; I was just sharper on my checkouts.",
                text_de: "[Professionalität] Das 6:0 täuscht etwas. Er hatte seine Chancen auf Doppel, ich war heute einfach konsequenter.",
                text_nl: "[Professionaliteit] De 6-0 vertekent het beeld. Hij had kansen op de dubbels, ik was vandaag gewoon klinischer.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Rywal dziękuje Ci w wywiadzie za okazany szacunek mimo wysokiej porażki.", outcome_en: "Your defeated opponent publicly thanks you for your respectful comments.", outcome_de: "Dein Gegner bedankt sich öffentlich für deine fairen Worte trotz der Niederlage.", outcome_nl: "Je tegenstander bedankt je publiekelijk voor je respectvolle woorden na de afstraffing."
            },
            {
                text_pl: "[Medialność] Zmiotłem go ze sceny jak pył! Następnym razem niech lepiej odda mecz walkowerem, zaoszczędzi wstydu!",
                text_en: "[Showmanship] Absolute demolition job! Next time he should just concede a walkover and save himself the embarrassment!",
                text_de: "[Showmanship] Absolute Zerstörung! Nächstes Mal sollte er lieber kampflos aufgeben, um sich die Blamage zu sparen!",
                text_nl: "[Showmanship] Complete vernedering! Volgende keer kan hij beter forfait geven, dat scheelt hem schaamte!",
                effect: { prof: -4, pop: 6 },
                outcome_pl: "Twoje bezwzględne podsumowanie wywołuje burzę komentarzy w sieci!", outcome_en: "Your brutal assessment triggers an intense storm of comments across darts forums!", outcome_de: "Dein gnadenloser Spruch entfacht heftige Diskussionen in den Foren!", outcome_nl: "Je keiharde analyse zorgt voor een storm aan reacties op dartfora!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad dla Darts Talk", title_en: "🎤 Darts Talk Studio", title_de: "🎤 Darts Talk Studio", title_nl: "🎤 Darts Talk Studio",
        desc_pl: "Dziennikarz pyta: 'Twoje tempo rzutu jest uznawane za najszybsze w całym tourze. Nie boisz się utraty kontroli?'",
        desc_en: "Reporter asks: 'Your rhythm is officially clocked as the fastest in the PDC. Aren't you afraid of losing control?'",
        desc_de: "Reporter fragt: 'Dein Wurftempo gilt offiziell als das schnellste der Tour. Hast du keine Angst vor Kontrollverlust?'",
        desc_nl: "Verslaggever vraagt: 'Jouw werptempo is officieel het hoogste van het circuit. Ben je niet bang de controle te verliezen?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Płynność rzutu wynika z pamięci mięśniowej. Zbyt długie myślenie przy tarczy tylko przeszkadza.",
                text_en: "[Professionalism] Fluidity comes from pure muscle memory. Overthinking at the oche only creates unnecessary doubt.",
                text_de: "[Professionalität] Das Tempo kommt aus dem Muskelgedächtnis. Zu viel Nachdenken am Oche stört nur den Fluss.",
                text_nl: "[Professionaliteit] Dat tempo komt uit spiergeheugen. Te veel nadenken aan de oche verstoort alleen maar je flow.",
                effect: { prof: 3, pop: 0 },
                outcome_pl: "Analitycy techniczni uznają Twój rzut za biomechaniczne arcydzieło.", outcome_en: "Biomechanical analysts praise your stroke as a masterpiece of efficient movement.", outcome_de: "Bewegungsanalysten loben deinen Wurf als Meisterwerk der Effizienz.", outcome_nl: "Bewegingswetenschappers noemen jouw worp een meesterwerk van efficiëntie."
            },
            {
                text_pl: "[Medialność] Rzucam szybko, trafiam celnie i nie marnuję czasu widzów! Jestem darterem ery TikToka!",
                text_en: "[Showmanship] I throw fast, strike true, and never waste viewers' time! I am the ultimate rapid-fire superstar!",
                text_de: "[Showmanship] Ich werfe schnell, treffe perfekt und verschwende keine Zeit! Ich bin der Rockstar der neuen Generation!",
                text_nl: "[Showmanship] Ik gooi snel, raak alles en verspil niemands tijd! Ik ben de superster van de nieuwe generatie!",
                effect: { prof: -3, pop: 5 },
                outcome_pl: "Młodzi fani uwielbiają Twoje błyskawiczne tempo rzucania!", outcome_en: "Gen-Z darts fans celebrate your lightning-fast entertainment value!", outcome_de: "Junge Fans feiern dein rasantes Tempo und deinen Entertainment-Faktor!", outcome_nl: "De jonge generatie fans smult van jouw moordende tempo en entertainmentwaarde!"
            }
        ]
    },
    {
        title_pl: "🎤 Strefa Flash Cloud Sports", title_en: "🎤 Cloud Sports Flash Area", title_de: "🎤 Cloud Sports Flash-Ecke", title_nl: "🎤 Cloud Sports Flitszone",
        desc_pl: "Reporter: 'Przed decydującym rzutem w podwójną odwróciłeś się do publiczności i poprosiłeś o hałas. Czy to nie było zbyt ryzykowne?'",
        desc_en: "Reporter: 'Before the winning match dart, you turned to the crowd asking for more noise. Too risky?'",
        desc_de: "Reporter: 'Vor dem Matchdart hast du dich umgedreht und die Fans angeheizt. War das nicht zu riskant?'",
        desc_nl: "Verslaggever: 'Voor de winnende matchdart draaide je je om naar het publiek voor meer lawaai. Te riskant?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Zrobiłem to pod wpływem ogromnych emocji, ale w przyszłości muszę zachować większy chłód.",
                text_en: "[Professionalism] Carried away by the moment, but moving forward I must keep my emotions strictly checked.",
                text_de: "[Professionalität] Das war der pure Adrenalinkick, aber künftig muss ich da professioneller und kühler bleiben.",
                text_nl: "[Professionaliteit] Dat was pure adrenaline, maar in het vervolg moet ik mijn hoofd koeler houden.",
                effect: { prof: 3, pop: -1 },
                outcome_pl: "Dojrzała autorefleksja spotyka się z uznaniem ekspertów.", outcome_en: "Your mature self-awareness earns praise from veteran commentators.", outcome_de: "Deine reife Selbstkritik wird von Experten positiv hervorgehoben.", outcome_nl: "Je volwassen zelfreflectie wordt geprezen door ervaren analisten."
            },
            {
                text_pl: "[Medialność] Ryzykowne? Ja żyję dla takich chwil! Uwielbiam rzucać, kiedy 10 tysięcy gardeł krzyczy moje imię!",
                text_en: "[Showmanship] Risky? I live for this! I thrive when 10,000 screaming fans are roaring my name!",
                text_de: "[Showmanship] Riskant? Ich lebe dafür! Ich treffe am besten, wenn 10.000 Kehlen meinen Namen brüllen!",
                text_nl: "[Showmanship] Riskant? Ik leef hiervoor! Ik gooi het best als 10.000 kelen mijn naam schreeuwen!",
                effect: { prof: -3, pop: 6 },
                outcome_pl: "Klip z Twoim gestem staje się czołówką telewizyjnych zapowiedzi kolejnych gal!", outcome_en: "Footage of you hyping the crowd becomes the official TV promo opener!", outcome_de: "Der Clip wird zum offiziellen TV-Trailer für die nächsten Darts-Events!", outcome_nl: "De beelden waarin je het publiek opzweept worden de officiële tv-promo!"
            }
        ]
    },
    {
        title_pl: "🎤 Wywiad po meczu z legendą darta", title_en: "🎤 Legend Clash Interview", title_de: "🎤 Nach dem Duell mit der Legende", title_nl: "🎤 Na het duel met de legende",
        desc_pl: "DartsZone: 'Właśnie pokonałeś wielokrotnego mistrza świata i legendę tego sportu. Czas na zmianę warty na szczycie?'",
        desc_en: "DartsZone: 'You just dethroned a multi-time World Champion and living legend. Is this the official changing of the guard?'",
        desc_de: "DartsZone: 'Du hast gerade einen mehrfachen Weltmeister und Legende geschlagen. Ist das der Wachwechsel?'",
        desc_nl: "DartsZone: 'Je hebt zojuist een meervoudig wereldkampioen en levende legende verslagen. Is de macht gewisseld?'",
        choices: [
            {
                text_pl: "[Profesjonalizm] Gra z taką legendą to ogromny zaszczyt. Osiągnął w tym sporcie wszystko, mam do niego bezgraniczny szacunek.",
                text_en: "[Professionalism] Sharing the oche with a true icon is an honor. He paved the way for all of us; utmost respect.",
                text_de: "[Professionalität] Mit so einer Ikone auf der Bühne zu stehen, ist eine Ehre. Größter Respekt vor seiner Lebensleistung.",
                text_nl: "[Professionaliteit] Met zo'n icoon op het podium staan is een eer. Hij plaveide de weg voor ons allen; enorm veel respect.",
                effect: { prof: 4, pop: 0 },
                outcome_pl: "Pokora i szacunek wobec legendy zjednują Ci sympatię całego środowiska darterskiego.", outcome_en: "Your heartfelt respect for the icon wins the hearts of purists worldwide.", outcome_de: "Dein aufrichtiger Respekt bringt dir die Sympathie der gesamten Darts-Welt ein.", outcome_nl: "Je oprechte respect voor het icoon verovert de harten van alle dartfans."
            },
            {
                text_pl: "[Medialność] Jego czas minął, teraz nadchodzi moja era! Pora, żeby starzy mistrzowie zrobili miejsce nowemu królowi!",
                text_en: "[Showmanship] His era is over; my dynasty begins tonight! Time for the old guard to step aside for the new king!",
                text_de: "[Showmanship] Seine Zeit ist vorbei, meine Ära beginnt! Zeit für die alten Meister, Platz für den neuen König zu machen!",
                text_nl: "[Showmanship] Zijn tijd is voorbij, mijn tijdperk begint nu! Tijd voor de oude garde om plaats te maken voor de nieuwe koning!",
                effect: { prof: -5, pop: 7 },
                outcome_pl: "Twoja bezkompromisowa deklaracja staje się tematem numer jeden we wszystkich mediach sportowych!", outcome_en: "Your bold declaration dominates every sports front page and debate show worldwide!", outcome_de: "Deine Kampfansage dominiert weltweit die Titelseiten der Sportpresse!", outcome_nl: "Je gewaagde uitspraak domineert alle sportvoorpagina's en talkshows!"
            }
        ]
    }
];

// --- LOSOWE EVENTY ---
