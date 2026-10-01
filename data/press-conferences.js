// Six authored questions per topic: 8 pre-tournament and 8 post-match topics.
// Questions and answers are paired as [Polish, English]. Other UI languages
// use the English copy until a dedicated translation is available.
const PRESS_CONFERENCE_TOPICS = [
    {
        id: 'pre_expectations', phase: 'pre',
        questions: [
            ['Z jakimi oczekiwaniami przyjeżdżasz na {tournament}?', 'What are your expectations for {tournament}?'],
            ['Co uznasz za udany występ w {tournament}?', 'What would count as a successful run at {tournament}?'],
            ['Czy myślisz już o końcowym triumfie w {tournament}?', 'Are you already thinking about winning {tournament}?'],
            ['Jak ważny jest dla ciebie start w {tournament}?', 'How important is this appearance at {tournament} to you?'],
            ['Z czym chcesz wyjechać z tego turnieju?', 'What do you want to take away from this tournament?'],
            ['Czy masz konkretny cel na najbliższe dni?', 'Do you have a specific goal for the next few days?']
        ],
        answers: [
            ['Skupiam się na pierwszym meczu i własnej grze.', 'I am focused on the first match and my own game.'],
            ['Przyjechałem tu walczyć o tytuł.', 'I came here to fight for the title.'],
            ['Wszystko poza finałem byłoby rozczarowaniem.', 'Anything short of the final would disappoint me.'],
            ['Chcę cieszyć się sceną i zobaczyć, dokąd mnie to zaprowadzi.', 'I want to enjoy the stage and see where it takes me.']
        ]
    },
    {
        id: 'pre_preparation', phase: 'pre',
        questions: [
            ['Jak wyglądały twoje ostatnie przygotowania do {tournament}?', 'How have you prepared for {tournament}?'],
            ['Na czym najbardziej skupiałeś się podczas treningu?', 'What have you worked on most in practice?'],
            ['Czy zmieniłeś coś w przygotowaniach do tak dużego turnieju?', 'Have you changed anything in your preparation for a major?'],
            ['Jak dbasz o spokój przed pierwszym meczem?', 'How do you stay calm before your opening match?'],
            ['Co było najważniejsze w twoich przygotowaniach w tym tygodniu?', 'What mattered most in your preparation this week?'],
            ['Czy czujesz, że zrobiłeś wszystko, co mogłeś przed turniejem?', 'Do you feel you have done everything possible before the event?']
        ],
        answers: [
            ['Trzymałem się planu treningowego i teraz liczy się wykonanie.', 'I followed my practice plan; now it is about execution.'],
            ['Przygotowałem się świetnie, będzie to widać na scenie.', 'My preparation was excellent and it will show on stage.'],
            ['Nie zdradzę szczegółów. Rywale nie muszą znać mojego planu.', 'I will not reveal the details. My opponents need not know my plan.'],
            ['Było trochę zmian, ale podchodzę do tego spokojnie.', 'There were a few changes, but I am approaching it calmly.']
        ]
    },
    {
        id: 'pre_form', phase: 'pre',
        questions: [
            ['Jak oceniasz swoją obecną formę?', 'How do you rate your current form?'],
            ['Czy twoja gra jest dziś tam, gdzie chciałbyś ją widzieć?', 'Is your game where you want it to be right now?'],
            ['Co daje ci największą pewność siebie przed startem?', 'What gives you the most confidence before the event?'],
            ['Który element swojej gry chciałbyś poprawić w tym turnieju?', 'Which part of your game would you like to improve here?'],
            ['Czy ostatnie występy pomogły ci nabrać pewności?', 'Have your recent appearances helped your confidence?'],
            ['Na ile ufasz dziś swojej grze pod presją?', 'How much do you trust your game under pressure today?']
        ],
        answers: [
            ['Forma jest ważna, ale każdy mecz zaczyna się od zera.', 'Form matters, but every match starts at zero.'],
            ['Czuję się bardzo dobrze i chcę to pokazać.', 'I feel very good and want to show it.'],
            ['Moja gra jest lepsza niż większość rywali sądzi.', 'My game is better than most opponents think.'],
            ['Mam nad czym pracować, lecz jestem gotowy na walkę.', 'I have things to work on, but I am ready to compete.']
        ]
    },
    {
        id: 'pre_pressure', phase: 'pre',
        questions: [
            ['Czy ranga majoru dodaje ci presji?', 'Does the major stage add pressure for you?'],
            ['Jak radzisz sobie z oczekiwaniami kibiców?', 'How do you deal with the fans’ expectations?'],
            ['Czy na takiej scenie gra się inaczej niż na co dzień?', 'Does it feel different playing on a stage like this?'],
            ['Co robisz, kiedy przed turniejem rosną oczekiwania?', 'What do you do when expectations rise before an event?'],
            ['Czy światła i kamery pomagają ci, czy przeszkadzają?', 'Do the lights and cameras help or distract you?'],
            ['Jak utrzymasz koncentrację, gdy zrobi się głośno?', 'How will you stay focused when the arena gets loud?']
        ],
        answers: [
            ['Presja jest częścią gry; pilnuję swojej rutyny.', 'Pressure is part of the game; I stick to my routine.'],
            ['Lubię takie sceny, one wydobywają ze mnie więcej.', 'I enjoy these stages; they bring out more in me.'],
            ['To rywale powinni odczuwać presję, nie ja.', 'My opponents should feel the pressure, not me.'],
            ['Kibice dodają energii, ale wynik rozstrzyga się przy tarczy.', 'The fans give me energy, but the board decides the result.']
        ]
    },
    {
        id: 'pre_draw', phase: 'pre',
        questions: [
            ['Co sądzisz o drodze przez drabinkę w {tournament}?', 'What do you make of your route through the {tournament} draw?'],
            ['Czy przyglądałeś się już możliwym rywalom w kolejnych rundach?', 'Have you looked at possible opponents in later rounds?'],
            ['Jak podchodzisz do losowania tego turnieju?', 'How do you approach the draw for this event?'],
            ['Czy układ drabinki zmienia twoje cele?', 'Does the shape of the draw change your goals?'],
            ['Czy w majorze istnieje łatwa droga do finału?', 'Is there ever an easy route to a major final?'],
            ['Na ile daleko wybiegasz myślami w turniejowej drabince?', 'How far ahead do you look in the tournament draw?']
        ],
        answers: [
            ['Patrzę tylko na najbliższy mecz.', 'I am looking only at the next match.'],
            ['Drabinka daje szansę na wielki wynik.', 'The draw gives me a chance to make a big run.'],
            ['Nie obawiam się żadnego nazwiska w tej drabince.', 'I fear no name in this draw.'],
            ['Na tym poziomie każda runda wymaga dobrej gry.', 'At this level, every round demands good darts.']
        ]
    },
    {
        id: 'pre_goals', phase: 'pre',
        questions: [
            ['Czego chcesz dowiedzieć się o sobie podczas tego majoru?', 'What do you want to learn about yourself at this major?'],
            ['Czy to turniej, w którym chcesz zrobić kolejny krok w karierze?', 'Is this the event where you want to take the next step in your career?'],
            ['Jakie znaczenie ma dla ciebie dobry wynik właśnie tutaj?', 'What would a strong result here mean to you?'],
            ['Czy bardziej liczy się dla ciebie wynik, czy jakość gry?', 'Does the result or the quality of your play matter more to you?'],
            ['Co chciałbyś powiedzieć o swoim występie po turnieju?', 'What would you like to say about your run after the event?'],
            ['Jaki obraz swojej gry chcesz zostawić kibicom?', 'What impression of your game do you want to leave with the fans?']
        ],
        answers: [
            ['Chcę grać odpowiedzialnie i wykorzystać każdą szansę.', 'I want to play responsibly and take every chance.'],
            ['To może być przełomowy tydzień w mojej karierze.', 'This could be a breakthrough week in my career.'],
            ['Chcę, żeby wszyscy zapamiętali moje nazwisko.', 'I want everyone to remember my name.'],
            ['Najpierw dobra gra, potem zobaczymy, dokąd zaprowadzi.', 'Good darts first; then we will see where they take me.']
        ]
    },
    {
        id: 'pre_opponent', phase: 'pre', needsOpponent: true,
        questions: [
            ['Co powiesz o swoim pierwszym rywalu, {opponent}?', 'What do you make of your opening opponent, {opponent}?'],
            ['Czego najbardziej spodziewasz się po meczu z {opponent}?', 'What do you expect most from the match against {opponent}?'],
            ['Jak chcesz narzucić swoje tempo w spotkaniu z {opponent}?', 'How will you set the pace against {opponent}?'],
            ['Czy przygotowywałeś się specjalnie pod grę {opponent}?', 'Did you prepare specifically for {opponent}?'],
            ['Jak ważny będzie początek meczu z {opponent}?', 'How important will the start be against {opponent}?'],
            ['Czy styl gry {opponent} wymaga od ciebie zmian?', 'Does {opponent}’s style require you to change anything?']
        ],
        answers: [
            ['Szanuję rywala, ale skupiam się na własnych rzutach.', 'I respect my opponent, but focus on my own darts.'],
            ['To mocny rywal, jednak jestem gotowy go pokonać.', 'A strong opponent, but I am ready to beat them.'],
            ['Jeśli zagram swoje, rywal nie będzie miał odpowiedzi.', 'If I play my game, my opponent will have no answer.'],
            ['Spodziewam się wyrównanej walki i dobrego meczu.', 'I expect a close fight and a good match.']
        ]
    },
    {
        id: 'pre_h2h', phase: 'pre', needsH2h: true,
        questions: [
            ['Wasz dotychczasowy bilans to {h2h}. Ile to dla ciebie znaczy?', 'Your head-to-head record is {h2h}. How much does that matter?'],
            ['Czy poprzednie spotkania z {opponent} pomagają ci przed tym meczem?', 'Do your previous meetings with {opponent} help before this match?'],
            ['Czy bilans {h2h} wpłynie na twoje podejście do {opponent}?', 'Will the {h2h} record affect your approach to {opponent}?'],
            ['Co wyniosłeś z wcześniejszych pojedynków z {opponent}?', 'What did you learn from earlier meetings with {opponent}?'],
            ['Czy historia spotkań z {opponent} ma znaczenie po wejściu na scenę?', 'Does your history with {opponent} matter once you step on stage?'],
            ['Czy wcześniejsze mecze podpowiadają ci, jak zagrać z {opponent}?', 'Do previous matches tell you how to play {opponent}?']
        ],
        answers: [
            ['Bilans znam, ale ten mecz zaczyna się od 0:0.', 'I know the record, but this match starts at 0–0.'],
            ['Wyciągnąłem wnioski i jestem pewny swojego planu.', 'I have learned from it and trust my plan.'],
            ['Tym razem chcę wyraźnie pokazać, kto jest lepszy.', 'This time I want to show clearly who is better.'],
            ['Historia jest ciekawa dla kibiców; ja zajmę się grą.', 'The history is for the fans; I will focus on the darts.']
        ]
    },
    {
        id: 'post_result', phase: 'post',
        questions: [
            ['Jak podsumujesz wynik {score} w meczu z {opponent}?', 'How do you sum up the {score} result against {opponent}?'],
            ['Jakie uczucie dominuje po takim meczu?', 'What is the strongest feeling after that match?'],
            ['Czy wynik {score} oddaje przebieg spotkania?', 'Does the {score} score reflect how the match went?'],
            ['Co powiedziałbyś o swojej grze tuż po zejściu ze sceny?', 'What would you say about your game just after leaving the stage?'],
            ['Czy to był mecz, którego się spodziewałeś?', 'Was that the match you expected?'],
            ['Co najbardziej zapamiętasz z tego spotkania?', 'What will you remember most from that match?']
        ],
        answers: [
            ['Trzeba uczciwie ocenić grę i wyciągnąć wnioski.', 'We have to assess the performance honestly and learn from it.'],
            ['Dałem kibicom emocje i to dla mnie ważne.', 'I gave the fans something to feel, and that matters to me.'],
            ['Wynik mówi wszystko. Nie mam nic więcej do dodania.', 'The score says it all. I have nothing else to add.'],
            ['To był trudny mecz; doceniam też grę rywala.', 'It was a tough match, and I credit my opponent too.']
        ]
    },
    {
        id: 'post_momentum', phase: 'post',
        questions: [
            ['W którym momencie poczułeś zmianę przebiegu meczu?', 'When did you feel the momentum of the match change?'],
            ['Czy był moment, który szczególnie wpłynął na twoją koncentrację?', 'Was there a moment that particularly affected your focus?'],
            ['Jak reagowałeś na zmianę tempa spotkania?', 'How did you react when the pace of the match changed?'],
            ['Czy po którymś legu musiałeś zmienić plan?', 'Did you have to change your plan after any leg?'],
            ['Co pomogło ci utrzymać rytm w trakcie meczu?', 'What helped you keep your rhythm during the match?'],
            ['Czy łatwo było wrócić do swojego tempa po przerwach?', 'Was it easy to find your pace again after the breaks?']
        ],
        answers: [
            ['Pilnowałem rutyny i reagowałem rzut po rzucie.', 'I kept my routine and responded one throw at a time.'],
            ['Na scenie czułem, że mogę przejąć inicjatywę.', 'On stage I felt I could seize the initiative.'],
            ['Rywal wybił mnie z rytmu, ale to nie jest wymówka.', 'My opponent disrupted my rhythm, but that is no excuse.'],
            ['Obaj mieliśmy swoje momenty; taki jest dart.', 'We both had our moments; that is darts.']
        ]
    },
    {
        id: 'post_scoring', phase: 'post', needsAverage: true,
        questions: [
            ['Twoja średnia wyniosła {average}. Jak oceniasz punktowanie?', 'You averaged {average}. How do you rate your scoring?'],
            ['Czy średnia {average} pokazuje twój rzeczywisty poziom w tym meczu?', 'Does the {average} average reflect your real level in that match?'],
            ['W których momentach punktowanie było dziś najmocniejsze?', 'At which moments was your scoring strongest today?'],
            ['Czy tempo punktowania było takie, jakiego oczekiwałeś?', 'Was your scoring pace what you expected?'],
            ['Jak ważna była regularność na dużych polach?', 'How important was consistency on the big scoring beds?'],
            ['Czy po tym meczu chcesz coś zmienić w punktowaniu?', 'Do you want to change anything about your scoring after this match?']
        ],
        answers: [
            ['Średnia to tylko jedna liczba; liczą się wygrane legi.', 'The average is one number; winning legs is what counts.'],
            ['Jestem zadowolony z rytmu, który pokazałem.', 'I am pleased with the rhythm I showed.'],
            ['Mogłem punktować lepiej i wszyscy to widzieli.', 'I could have scored better and everyone saw it.'],
            ['Były dobre i słabsze momenty, przeanalizuję je.', 'There were strong and weak spells; I will review them.']
        ]
    },
    {
        id: 'post_finishing', phase: 'post',
        questions: [
            ['Jak oceniasz swoją grę na podwójnych?', 'How do you rate your finishing on doubles?'],
            ['Czy końcówki legów wymagały dziś szczególnej cierpliwości?', 'Did the end of the legs demand extra patience today?'],
            ['Jak utrzymywałeś spokój przy okazjach na zamknięcie?', 'How did you stay calm at your checkout chances?'],
            ['Co szczególnie zapamiętasz z końcówek legów?', 'What will you remember most about the ends of the legs?'],
            ['Co decydowało o wyborze dróg do zamknięcia?', 'What shaped your choice of checkout routes?'],
            ['Czy nad podwójnymi będziesz pracować przed następnym meczem?', 'Will you work on doubles before the next match?']
        ],
        answers: [
            ['Na podwójnych trzeba zachować cierpliwość i rutynę.', 'On doubles you need patience and routine.'],
            ['W ważnych chwilach zaufałem ręce.', 'In the big moments I trusted my arm.'],
            ['Powinienem był zamykać szybciej; jestem na siebie zły.', 'I should have finished faster; I am annoyed with myself.'],
            ['Nie każda lotka siada idealnie; ważna jest reakcja.', 'Not every dart lands perfectly; the response matters.']
        ]
    },
    {
        id: 'post_opponent', phase: 'post',
        questions: [
            ['Co w grze {opponent} sprawiło ci dziś najwięcej problemów?', 'What about {opponent}’s game caused you the most trouble?'],
            ['Jak oceniasz występ {opponent}?', 'How do you rate {opponent}’s performance?'],
            ['Czy {opponent} czymś cię dziś zaskoczył?', 'Did {opponent} surprise you in any way today?'],
            ['Jak wyglądał ten mecz z perspektywy rywalizacji z {opponent}?', 'How did the contest with {opponent} feel from your side?'],
            ['Czego nauczyła cię dziś gra przeciwko {opponent}?', 'What did playing {opponent} teach you today?'],
            ['Czy spodziewasz się kolejnego zaciętego meczu z {opponent}?', 'Do you expect another close match with {opponent}?']
        ],
        answers: [
            ['Rywal zasługuje na uznanie; musiałem walczyć o każdą szansę.', 'My opponent deserves credit; every chance had to be earned.'],
            ['Wiedziałem, jak zagrać przeciwko niemu, i trzymałem się planu.', 'I knew how to play them and stuck to the plan.'],
            ['Nie zrobił nic, czego bym się nie spodziewał.', 'They did nothing I did not expect.'],
            ['To dobry przeciwnik i mam nadzieję na rewanż.', 'A good opponent, and I hope we meet again.']
        ]
    },
    {
        id: 'post_h2h', phase: 'post', needsH2h: true,
        questions: [
            ['Przed tym meczem bilans z {opponent} wynosił {h2h}. Co zmieniło dzisiejsze spotkanie?', 'Before today your record with {opponent} was {h2h}. What did this match change?'],
            ['Czy historia spotkań z {opponent} miała dziś znaczenie?', 'Did your history with {opponent} matter today?'],
            ['Jak dzisiejszy mecz wpisuje się w waszą rywalizację?', 'How does today’s match fit into your rivalry?'],
            ['Czy poprzednie pojedynki pomogły ci odczytać grę {opponent}?', 'Did previous meetings help you read {opponent}’s game?'],
            ['Czy po tym spotkaniu inaczej patrzysz na bilans z {opponent}?', 'Do you see your record against {opponent} differently now?'],
            ['Czy chętnie zagrasz z {opponent} ponownie?', 'Would you like to play {opponent} again?']
        ],
        answers: [
            ['Wcześniejsze mecze pomogły, ale każdy wynik trzeba wywalczyć.', 'Earlier matches helped, but every result must be earned.'],
            ['Ta rywalizacja motywuje mnie do jeszcze lepszej gry.', 'This rivalry pushes me to play even better.'],
            ['Nie przywiązuję wagi do bilansu; liczy się dzisiaj.', 'I do not care about the record; today is what matters.'],
            ['Szanuję naszą historię i chętnie znów się zmierzę.', 'I respect our history and would gladly play again.']
        ]
    },
    {
        id: 'post_next', phase: 'post',
        questions: [
            ['Co z tego meczu zabierzesz do kolejnego występu?', 'What will you take from this match into your next appearance?'],
            ['Na czym skupisz się po powrocie do treningu?', 'What will you focus on when you return to practice?'],
            ['Czy ten wynik zmienia twoje plany na kolejne turnieje?', 'Does this result change your plans for future events?'],
            ['Jak szybko potrafisz odciąć się od emocji po meczu?', 'How quickly can you put the emotions of a match behind you?'],
            ['Co jest teraz dla ciebie najważniejsze w karierze?', 'What matters most to you in your career right now?'],
            ['Czy po tym meczu widzisz konkretny element do poprawy?', 'Do you see a specific area to improve after that match?']
        ],
        answers: [
            ['Obejrzę mecz i spokojnie wyciągnę wnioski.', 'I will review the match and learn from it calmly.'],
            ['Ten występ doda mi pewności na kolejne spotkanie.', 'This performance will give me confidence for the next match.'],
            ['Następnym razem nie dam rywalowi tylu okazji.', 'Next time I will not give my opponent so many chances.'],
            ['Najpierw odpocznę, potem wrócę do pracy.', 'First I will rest, then get back to work.']
        ]
    },
    {
        id: 'post_media', phase: 'post',
        questions: [
            ['Co powiedziałbyś kibicom po takim meczu?', 'What would you say to the fans after that match?'],
            ['Jak odbierasz zainteresowanie mediów tym spotkaniem?', 'How do you feel about the media attention around this match?'],
            ['Czy wsparcie kibiców ma dla ciebie znaczenie po zejściu ze sceny?', 'Does fan support matter once you leave the stage?'],
            ['Jaki obraz meczu chciałbyś zostawić widzom?', 'What impression of the match would you like viewers to keep?'],
            ['Co odpowiesz osobom oceniającym cię wyłącznie po wyniku?', 'What do you say to people judging you only by the score?'],
            ['Czy wolisz mówić o emocjach, czy o liczbach po meczu?', 'Do you prefer to discuss the emotions or the numbers after a match?']
        ],
        answers: [
            ['Dziękuję za wsparcie. Chcę reprezentować się jak najlepiej.', 'Thank you for the support. I want to represent myself well.'],
            ['Mam nadzieję, że kibice dobrze się bawili.', 'I hope the fans enjoyed the match.'],
            ['Krytycy mogą pisać, co chcą. Ja znam swoją wartość.', 'Critics can write what they like. I know my worth.'],
            ['Dziś było sporo emocji; doceniam każdego, kto oglądał.', 'There were plenty of emotions today; I appreciate everyone who watched.']
        ]
    }
];

const PRESS_CONFERENCE_JOURNALISTS = [
    { name: 'Marta Wójcik', outlet: 'Darts Weekly' },
    { name: 'Daniel Price', outlet: 'The Oche Report' },
    { name: 'Sophie Clarke', outlet: 'Stage Side' },
    { name: 'Lena Hoffmann', outlet: 'Darts Journal' },
    { name: 'Noah de Vries', outlet: 'The Checkout' },
    { name: 'Alex Morgan', outlet: '180 News' },
    { name: 'Oliwia Nowak', outlet: 'Darts Live' },
    { name: 'Ben Carter', outlet: 'The Darts Desk' }
];
