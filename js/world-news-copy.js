// Public editorial copy. Every interpolation comes from newsPublicFacts(); no
// skill ratings, hidden attributes, fabricated quotations or match chronology.
function newsCopy(lines,v={}) {return newsSay(...lines).replace(/\{(\w+)\}/g,(_,k)=>v[k]??'').replace(/\b1 places\b/g,'1 place').replace(/\bA (?=(?:8\d*|11|18)–\d)/g,'An ');}
function newsEditorialValues(f) {
    return {n:f.actor.name,o:f.opponent?.name||'',t:f.tournament?.name||'',city:f.tournament?.city||'',
        rank:f.ranking||'',old:f.previousRanking||'',opRank:f.opponentRank||'',score:f.score||'',age:f.age??'',
        stage:f.stage||'',milestone:f.milestone||f.ranking||'',next:Number.isInteger(f.stage)&&f.stage>=4?f.stage/2:'',year:f.year||f.season||'',
        money:f.prize>0?'£'+Math.round(f.prize).toLocaleString('en-GB'):'',worldTitles:f.worldTitles||0,
        majorTitles:f.knownMajorTitles||0,change:f.previousRanking&&f.ranking?Math.abs(f.previousRanking-f.ranking):0,
        leader:f.previewContext?.rankingLeaders?.[0]?.person.name||'',formPlayer:f.previewContext?.recent?.[0]?.person.name||'',
        storyPlayer:f.previewContext?.storylines?.[0]?.person.name||'',youngPlayer:f.previewContext?.young?.[0]?.person.name||''};
}
function newsArticleHeadline(f,a,p) {
    const v=newsEditorialValues(f),key=p.headlineFamily;
    if(['world_run','deep_run'].includes(a.topic)&&f.stage)return newsCopy(f.coverageStage==='reached'?
        ['{n} reaches the last {stage} at {t}','{n} w Top {stage} w {t}','{n} erreicht die letzten {stage} bei {t}','{n} bereikt de laatste {stage} op {t}']:
        ['{t} run takes {n} to the last {stage}','Droga {n} w {t} prowadzi do Top {stage}','Der Lauf von {n} bei {t} führt in die letzten {stage}','De reeks van {n} op {t} leidt naar de laatste {stage}'],v);
    if(p.family==='RANKING'&&key==='return'&&f.ranking===1)return newsCopy(['{n} returns as World No. 1','{n} wraca na pierwsze miejsce świata','{n} kehrt als Weltnummer eins zurück','{n} terug als wereldnummer één'],v);
    const tables={
        UPSET:{
            shock:['{n} shocks {o} at {t}','{n} zaskakuje {o} w {t}','{n} überrascht {o} bei {t}','{n} verrast {o} op {t}'],
            eliminated:['{t}: {o} falls as {n} advances','{t}: {o} odpada, {n} gra dalej','{t}: {o} scheidet aus, {n} kommt weiter','{t}: {o} eruit, {n} gaat verder'],
            elite:['World No. {opRank} beaten as {n} makes a statement','{n} pokonuje numer {opRank} świata','{n} bezwingt die Nummer {opRank} der Welt','{n} verslaat de nummer {opRank} van de wereld'],
            edge:['{n} edges {o} {score} in tournament surprise','{n} wygrywa z {o} {score} i sprawia niespodziankę','{n} setzt sich überraschend mit {score} gegen {o} durch','{n} verrast met {score} tegen {o}'],
            stage:['Surprise in the last {stage}: {n} gets past {o}','Sensacja w rundzie Top {stage}: {n} pokonuje {o}','Überraschung unter den letzten {stage}: {n} schlägt {o}','Verrassing bij de laatste {stage}: {n} klopt {o}'],
            outsider:['Outsider {n} upsets the order against {o}','Niżej notowany {n} zatrzymuje {o}','Außenseiter {n} setzt sich gegen {o} durch','Outsider {n} verslaat {o}'],
            run:['{n} extends the run with a surprise win over {o}','Przygoda {n} trwa po niespodziewanej wygranej z {o}','{n} setzt den Lauf mit einem Überraschungssieg gegen {o} fort','{n} vervolgt de opmars met verrassingszege op {o}'],
            place:['Last-{next} place for {n} after {o} is eliminated','{n} w Top {next} po wyeliminowaniu {o}','{n} erreicht die letzten {next}, {o} scheidet aus','{n} bij de laatste {next} na uitschakeling van {o}']},
        RESULT:{
            crown:['{n} takes the honours at {t}','{n} zdobywa trofeum w {t}','{n} gewinnt den Titel bei {t}','{n} pakt de titel op {t}'],
            event:['{t} finds its champion in {n}','{t}: trofeum dla {n}','{t}: Der Titel geht an {n}','{t}: de trofee gaat naar {n}'],
            final:['{n} beats {o} to settle the {t} final','{n} pokonuje {o} w finale {t}','{n} besiegt {o} im Finale von {t}','{n} verslaat {o} in finale van {t}'],
            first:['First career title for {n} at {t}','Pierwszy tytuł w karierze {n}: {t}','Erster Karrieretitel für {n} bei {t}','Eerste carrièretitel voor {n} op {t}'],
            ranking:['World No. {rank} {n} adds the {t} title','Numer {rank} świata {n} triumfuje w {t}','Weltnummer {rank} {n} gewinnt {t}','Wereldnummer {rank} {n} wint {t}'],
            campaign:['{n} completes the winning route at {t}','Zwycięska droga {n} w {t}','{n} krönt den Turnierlauf bei {t}','{n} bekroont de toernooiweek op {t}'],
            repeat:['Another trophy for {n} as {t} concludes','Kolejne trofeum {n} na zakończenie {t}','Weiterer Titel für {n} zum Abschluss von {t}','Nieuwe trofee voor {n} bij afsluiting van {t}'],
            rise:['The next chapter for {n}: victory at {t}','Kolejny rozdział {n}: zwycięstwo w {t}','Das nächste Kapitel für {n}: Sieg bei {t}','Het volgende hoofdstuk voor {n}: winst op {t}']},
        MAJOR:{
            crown:['{n} conquers {t} to claim the major crown','{n} zdobywa wielkie trofeum w {t}','{n} erobert den Major-Titel bei {t}','{n} grijpt de majorzege op {t}'],
            event:['{t} belongs to {n} after title-winning finale','{t} dla {n} po zwycięskim finale','{t} gehört nach dem Finalsieg {n}','{t} is voor {n} na gewonnen finale'],
            final:['{n} defeats {o} for {t} glory','{n} pokonuje {o} i zdobywa {t}','{n} bezwingt {o} zum Sieg bei {t}','{n} verslaat {o} voor winst op {t}'],
            first:['{n} claims first major title at {t}','{n}: pierwszy wielki tytuł w {t}','{n} holt ersten Major-Titel bei {t}','{n} pakt eerste major op {t}'],
            ranking:['{n} adds a major crown from World No. {rank}','{n}, numer {rank} świata, z wielkim trofeum','Weltnummer {rank} {n} holt einen Major-Titel','Wereldnummer {rank} {n} pakt majorzege'],
            campaign:['The road ends in a trophy for {n} at {t}','Droga {n} w {t} zakończona trofeum','Der Weg von {n} bei {t} endet mit dem Titel','De route van {n} op {t} eindigt met de trofee'],
            repeat:['{n} adds {t} to the major collection','{n} dokłada {t} do kolekcji wielkich trofeów','{n} ergänzt die Major-Sammlung um {t}','{n} voegt {t} toe aan majorcollectie'],
            rise:['{n} backs up the rise with {t} triumph','{n} potwierdza swoją drogę triumfem w {t}','{n} bestätigt den Aufstieg mit Sieg bei {t}','{n} bevestigt opmars met zege op {t}']},
        WORLD:{
            world:['{n} crowned world champion after {t} final','{n} mistrzem świata po finale {t}','{n} ist nach dem Finale von {t} Weltmeister','{n} wereldkampioen na finale van {t}'],
            firstWorld:['First world crown for {n} completes the championship journey','Pierwsza korona mistrza świata wieńczy drogę {n}','Erster WM-Titel krönt den Weg von {n}','Eerste wereldtitel bekroont de opmars van {n}'],
            worldHistory:['{n} writes another world-title chapter','{n} dopisuje kolejny rozdział historii mistrzostw świata','{n} schreibt ein weiteres Kapitel der WM-Geschichte','{n} schrijft nieuw hoofdstuk in WK-geschiedenis'],
            worldRun:['The road to the world crown: {n} completes the run','Droga do korony świata: zwycięski turniej {n}','Der Weg zur Weltkrone: {n} vollendet den Lauf','De weg naar de wereldtitel: {n} bekroont de reeks'],
            worldFinal:['{n} beats {o} {score} to win the world final','{n} pokonuje {o} {score} w finale mistrzostw świata','{n} gewinnt das WM-Finale mit {score} gegen {o}','{n} wint WK-finale met {score} van {o}'],
            worldRise:['The rise reaches the world crown for {n}','Droga {n} prowadzi do mistrzostwa świata','Der Aufstieg von {n} führt zum WM-Titel','De opmars van {n} leidt naar de wereldtitel']},
        RANKING:{
            position:f.ranking===1?(f.returning?['{n} returns to the top of the world','{n} wraca na szczyt świata','{n} kehrt an die Weltspitze zurück','{n} terug aan de wereldtop']:['{n} takes over as World No. 1','{n} nowym numerem jeden świata','{n} übernimmt die Weltrangliste','{n} neemt over als wereldnummer één']):['{n} climbs to World No. {rank}','{n} awansuje na numer {rank} świata','{n} steigt auf Weltranglistenplatz {rank}','{n} stijgt naar wereldranglijstpositie {rank}'],
            cause:['{t} puts {n} at the centre of the ranking story','{t} stawia {n} w centrum walki o ranking','{t} rückt {n} ins Zentrum des Ranglistengeschehens','{t} brengt {n} centraal in het ranglijstverhaal'],
            return:['{n} climbs back into the Top {milestone}','{n} wraca do Top {milestone}','{n} kehrt in die Top {milestone} zurück','{n} terug in de Top {milestone}'],
            youth:['{age}-year-old {n} makes the move to No. {rank}','{n}, {age} lat: awans na miejsce {rank}','{n} erreicht mit {age} Platz {rank}','{n} bereikt op {age}-jarige leeftijd plaats {rank}'],
            momentum:['The ascent of {n} is reflected in the rankings','Droga {n} w górę znajduje odbicie w rankingu','Der Aufstieg von {n} spiegelt sich in der Rangliste','De opmars van {n} zichtbaar op de ranglijst'],
            race:a.topic==='ranking_race'?['{o} keeps the pressure on {n} in the No. 1 race','{o} naciska na {n} w walce o numer jeden','{o} setzt {n} im Kampf um Platz eins unter Druck','{o} houdt druk op {n} in strijd om nummer één']:f.ranking===1?['World No. 1: the Order of Merit lead changes hands to {n}','Numer jeden świata: {n} przejmuje Order of Merit','Weltnummer eins: {n} übernimmt die Order of Merit','Wereldnummer één: {n} neemt de Order of Merit over']:['{n} moves to No. {rank} in the prize-money rankings','{n} na miejscu {rank} w rankingu nagród','{n} erreicht Platz {rank} in der Preisgeldrangliste','{n} bereikt plaats {rank} op de prijzengeldranglijst']},
        RISE:{
            rise:['{n} emerges as a player to watch','{n} coraz wyraźniej zaznacza swoją obecność','{n} wird zum Spieler im Blickpunkt','{n} wordt een speler om te volgen'],
            position:['{n} brings the breakthrough to World No. {rank}','Przełom {n} prowadzi na miejsce {rank}','Der Durchbruch von {n} führt zu Platz {rank}','Doorbraak brengt {n} naar plaats {rank}'],
            young:f.age<=21&&f.ranking&&f.ranking<=32?['{age}-year-old {n} breaks into the elite','{n}, {age} lat: nowa twarz elity','{n} erreicht mit {age} die Elite','{n} bereikt op {age}-jarige leeftijd de elite']:['A new chapter at {age} for {n}','Nowy rozdział {n} w wieku {age} lat','Ein neues Kapitel mit {age} für {n}','Een nieuw hoofdstuk op {age} voor {n}'],
            run:['{t} places {n} firmly in the spotlight','{t} kieruje uwagę na {n}','{t} rückt {n} ins Rampenlicht','{t} zet {n} in de schijnwerpers'],
            milestone:['{n} builds on a significant career milestone','{n} kontynuuje drogę po ważnym osiągnięciu','{n} baut auf einem wichtigen Karriereschritt auf','{n} bouwt voort op belangrijke carrièremijlpaal'],
            next:['The next step for {n} after the breakthrough','Kolejny krok {n} po przełomie','Der nächste Schritt für {n} nach dem Durchbruch','De volgende stap voor {n} na de doorbraak']},
        COMEBACK:{
            comeback:f.historicalPeak?.ranking===1?['Former World No. 1 {n} back in contention','Były numer jeden {n} znów w grze','Frühere Weltnummer eins {n} wieder im Rennen','Voormalig wereldnummer één {n} weer in de strijd']:['{n} works back towards the leading ranks','{n} wraca w stronę czołówki','{n} kämpft sich zurück Richtung Spitze','{n} keert terug richting de top'],
            champion:['The comeback story of {n} gathers substance','Powrót {n} nabiera znaczenia','Das Comeback von {n} gewinnt Kontur','De comeback van {n} krijgt vorm'],
            return:['{n} climbs from No. {old} to No. {rank} in a comeback','Powrót {n}: awans z miejsca {old} na {rank}','Das Comeback von {n}: von Platz {old} auf {rank}','De comeback van {n}: van plaats {old} naar {rank}'],
            veteran:['{n} writes another chapter at {age}','{n} pisze kolejny rozdział w wieku {age} lat','{n} schreibt mit {age} ein weiteres Kapitel','{n} schrijft op {age} een nieuw hoofdstuk'],
            achievement:['{t} adds weight to the recovery of {n}','{t} wzmacnia historię powrotu {n}','{t} stärkt das Comeback von {n}','{t} geeft gewicht aan herstel van {n}'],
            chapter:['The return of {n} moves into its next chapter','Powrót {n} wchodzi w kolejny rozdział','Das Comeback von {n} erreicht das nächste Kapitel','De terugkeer van {n} gaat een nieuw hoofdstuk in']},
        DECLINE:{
            slide:['{n} faces a difficult slide from the leading ranks','{n} w trudnym okresie po latach w czołówce','{n} verliert den Anschluss an die Spitze','{n} verliest aansluiting met de top'],
            former:['A former star under pressure: the changing position of {n}','Dawna gwiazda pod presją: zmiana pozycji {n}','Ein früherer Star unter Druck: die neue Lage von {n}','Voormalige ster onder druk: de veranderde positie van {n}'],
            position:['World No. {rank}: how far {n} has slipped','Numer {rank} świata: spadek pozycji {n}','Platz {rank}: der Rückfall von {n}','Wereldnummer {rank}: de terugval van {n}'],
            pressure:['A difficult stretch continues for {n}','Trudny okres {n} trwa','Die schwierige Phase von {n} setzt sich fort','De moeilijke periode van {n} houdt aan'],
            chapter:['A different chapter at {age} for {n}','Inny rozdział {n} w wieku {age} lat','Ein anderes Kapitel mit {age} für {n}','Een ander hoofdstuk op {age} voor {n}'],
            distance:['{n} faces the distance back to the elite','{n} przed trudną drogą do elity','{n} vor dem Weg zurück in die Elite','{n} voor de weg terug naar de elite']},
        PREVIEW:{
            event:f.tournament?.world?['The world championship takes centre stage','Mistrzostwa świata na pierwszym planie','Die Weltmeisterschaft rückt ins Zentrum','Het wereldkampioenschap staat centraal']:['{t} preview: the stories before the opening round','{t}: historie przed pierwszą rundą','{t}: die Geschichten vor der Auftaktrunde','{t}: de verhalen voor de eerste ronde'],
            defend:['{n} prepares to defend the {t} crown','{n} przed obroną tytułu w {t}','{n} vor der Titelverteidigung bei {t}','{n} voor titelverdediging op {t}'],
            leaders:['{leader} heads the ranking picture before {t}','{leader} na czele rankingu przed {t}','{leader} führt die Rangliste vor {t} an','{leader} voert de ranglijst aan voor {t}'],
            form:['Recent results put {formPlayer} in focus ahead of {t}','Ostatnie wyniki kierują uwagę na {formPlayer} przed {t}','Jüngste Ergebnisse rücken {formPlayer} vor {t} in den Blick','Recente resultaten brengen {formPlayer} voor {t} in beeld'],
            stories:['The {storyPlayer} story continues as {t} approaches','Historia {storyPlayer} trwa przed {t}','Die Geschichte von {storyPlayer} geht vor {t} weiter','Het verhaal van {storyPlayer} gaat voor {t} verder'],
            youth:['Young player {youngPlayer} in focus before {t}','Młody {youngPlayer} w centrum uwagi przed {t}','Nachwuchsspieler {youngPlayer} im Blickpunkt vor {t}','Jonge speler {youngPlayer} in beeld voor {t}']},
        FINAL:{
            showdown:['{n} and {o} set for the {t} final','{n} i {o} zagrają w finale {t}','{n} und {o} im Finale von {t}','{n} en {o} treffen elkaar in finale van {t}'],
            roads:['Two routes, one trophy: {n} meets {o}','Dwie drogi, jedno trofeum: {n} zagra z {o}','Zwei Wege, ein Titel: {n} trifft {o}','Twee routes, één trofee: {n} tegen {o}'],
            opponents:['{o} stands between {n} and the {t} crown','{o} na drodze {n} do trofeum {t}','{o} steht zwischen {n} und dem Titel bei {t}','{o} staat tussen {n} en de trofee op {t}'],
            ranking:['World No. {rank} {n} meets {o} for the title','Numer {rank} świata {n} zmierzy się z {o} o tytuł','Weltnummer {rank} {n} spielt gegen {o} um den Titel','Wereldnummer {rank} {n} ontmoet {o} voor de titel'],
            history:['{n} and {o} prepare to add a {t} chapter','{n} i {o} przed nowym rozdziałem {t}','{n} und {o} vor einem neuen Kapitel bei {t}','{n} en {o} voor nieuw hoofdstuk op {t}'],
            rivals:['A familiar meeting with a trophy at stake: {n} versus {o}','Znani rywale, stawką trofeum: {n} kontra {o}','Bekannte Rivalen, ein Titel als Einsatz: {n} gegen {o}','Bekende rivalen, een trofee op het spel: {n} tegen {o}']}
    };
    v.stage=f.stage||'';
    if(p.family==='OTHER') {
        if(a.topic==='retirement')return newsCopy(['{n} calls time on a professional career','{n} kończy profesjonalną karierę','{n} beendet die Profikarriere','{n} beëindigt de professionele carrière'],v);
        if(a.topic==='season_review')return newsCopy(['{year} in review: the stories that shaped the season','Sezon {year}: wydarzenia, które zapamiętamy','Saison {year}: die prägenden Geschichten','Seizoen {year}: de bepalende verhalen'],v);
        if(a.topic==='rivalry'||a.topic==='revenge')return newsCopy(a.topic==='revenge'?['{n} turns the tables on {o}','{n} rewanżuje się {o}','{n} nimmt Revanche gegen {o}','{n} neemt revanche op {o}']:['{n} and {o}: a rivalry on the major stage','{n} i {o}: rywalizacja na wielkiej scenie','{n} und {o}: Rivalität auf großer Bühne','{n} en {o}: rivaliteit op het grote podium'],v);
        if(a.topic==='players_watch')return newsCopy(['Players to watch: recent results put {n} in focus','Zawodnicy do obserwowania: dobre wyniki {n}','Spieler im Fokus: jüngste Ergebnisse von {n}','Spelers om te volgen: recente resultaten van {n}'],v);
        if(a.topic==='exceptional_longevity')return newsCopy(['{n} remains among the leaders at {age}','{n} nadal w czołówce w wieku {age} lat','{n} bleibt mit {age} unter den Führenden','{n} blijft op {age} bij de top'],v);
        if(a.topic==='condition')return newsCopy(f.kind==='injury'?['Injury interrupts the campaign of {n}','Kontuzja przerywa sezon {n}','Verletzung unterbricht die Saison von {n}','Blessure onderbreekt seizoen van {n}']:['A fitness update for {n}','Nowe informacje o dyspozycji {n}','Ein Fitness-Update zu {n}','Een fitheidsupdate over {n}'],v);
        return newsCopy(['{n} in focus as the season develops','{n} w centrum uwagi w trakcie sezonu','{n} im Blickpunkt der Saison','{n} in beeld tijdens het seizoen'],v);
    }
    return newsCopy(tables[p.family]?.[key]||tables.RISE.rise,v);
}
function newsArticleDeck(f,a,p) {
    const v=newsEditorialValues(f);
    if(a.topic==='season_review')return newsCopy(['The world champion, the Order of Merit and the major stories of {year}.','Mistrz świata, Order of Merit i najważniejsze historie sezonu {year}.','Der Weltmeister, die Order of Merit und die großen Geschichten von {year}.','De wereldkampioen, de Order of Merit en de grote verhalen van {year}.'],v);
    if(['RESULT','MAJOR','WORLD'].includes(p.family))return newsCopy(f.opponent&&f.score?
        ['A {score} victory over {o} secures the {t} trophy for {n}.','Wygrana {score} z {o} daje {n} trofeum {t}.','Ein {score}-Sieg gegen {o} sichert {n} den Titel bei {t}.','Een zege van {score} op {o} bezorgt {n} de trofee van {t}.']:
        ['{n} finishes {t} as champion, adding the title to the season’s honours.','{n} kończy {t} jako mistrz i dopisuje tytuł do dorobku sezonu.','{n} beendet {t} als Champion und ergänzt die Saisonbilanz.','{n} sluit {t} af als kampioen en voegt de titel toe aan de seizoensbalans.'],v);
    if(p.family==='FINAL')return newsCopy(['Two finalists remain, with the {t} title still to be decided.','Pozostało dwóch finalistów; tytuł w {t} pozostaje do rozstrzygnięcia.','Zwei Finalisten bleiben, der Titel bei {t} ist noch offen.','Twee finalisten blijven over; de titel op {t} moet nog worden beslist.'],v);
    if(p.family==='PREVIEW')return newsCopy(['The championship picture, recent winners and developing stories ahead of {t}.','Sytuacja w czołówce, ostatni zwycięzcy i historie przed {t}.','Die Spitzengruppe, jüngste Sieger und die Geschichten vor {t}.','Het beeld aan de top, recente winnaars en de verhalen voor {t}.'],v);
    if(p.family==='UPSET')return newsCopy(f.score?['{n} beats {o} {score} at {t}, changing the tournament picture.','{n} pokonuje {o} {score} w {t}, zmieniając obraz turnieju.','{n} schlägt {o} bei {t} mit {score} und verändert das Turnierbild.','{n} verslaat {o} met {score} op {t} en verandert het toernooibeeld.']:['{n} gets past {o} at {t}.','{n} pokonuje {o} w {t}.','{n} setzt sich gegen {o} bei {t} durch.','{n} verslaat {o} op {t}.'],v);
    if(f.ranking&&f.previousRanking&&f.ranking!==f.previousRanking)return newsCopy(['From World No. {old} to No. {rank}: the latest chapter in the campaign of {n}.','Z miejsca {old} na {rank}: najnowszy rozdział sezonu {n}.','Von Weltranglistenplatz {old} auf {rank}: das jüngste Kapitel von {n}.','Van wereldranglijstplaats {old} naar {rank}: het nieuwste hoofdstuk van {n}.'],v);
    return newsCopy(f.ranking?['{n} is World No. {rank} as this chapter of the season unfolds.','{n} zajmuje miejsce {rank} świata w tym rozdziale sezonu.','{n} steht in diesem Kapitel der Saison auf Weltranglistenplatz {rank}.','{n} staat in dit hoofdstuk van het seizoen op wereldranglijstplaats {rank}.']:['The latest sporting chapter for {n}.','Najnowszy sportowy rozdział {n}.','Das jüngste sportliche Kapitel von {n}.','Het nieuwste sportieve hoofdstuk van {n}.'],v);
}
function newsRoundLabel(round) {
    const names={2:['Final','Finał','Finale','Finale'],4:['Semi-final','Półfinał','Halbfinale','Halve finale'],8:['Quarter-final','Ćwierćfinał','Viertelfinale','Kwartfinale']};
    return names[round]?newsSay(...names[round]):newsCopy(['Last {round}','Top {round}','Letzte {round}','Laatste {round}'],{round});
}
