let worldNewsSeasonFilter='current';
function newsLabel(key) {
    const labels={latest:['Latest coverage','Najnowsze wiadomości','Aktuelle Meldungen','Laatste nieuws'],
        trending:['Trending stories','Główne wątki','Aktuelle Geschichten','Verhalen in beeld'],
        rankings:['The No. 1 race','Wyścig o numer jeden','Kampf um Platz eins','Strijd om nummer één'],
        champions:['Recent major champions','Ostatni mistrzowie majorów','Jüngste Major-Sieger','Recente majorwinnaars'],
        archive:['Season archive','Archiwum sezonów','Saisonarchiv','Seizoensarchief'],current:['Current coverage','Aktualne wydarzenia','Aktuelle Berichte','Actuele verhalen'],
        allSeasons:['All seasons','Wszystkie sezony','Alle Saisons','Alle seizoenen'],timeline:['Career chronicle','Kronika kariery','Karrierechronik','Carrièrekroniek'],
        emptyTrend:['New storylines will appear when results warrant them.','Nowe wątki pojawią się, gdy uzasadnią je wyniki.','Neue Geschichten entstehen aus bedeutsamen Ergebnissen.','Nieuwe verhalen ontstaan uit betekenisvolle resultaten.'],
        history:['Open article','Otwórz artykuł','Artikel öffnen','Artikel openen'],
        development:['Latest recorded development','Ostatnie potwierdzone wydarzenie','Letzte erfasste Entwicklung','Laatste vastgelegde ontwikkeling'],
        HEADLINE:['Lead story','Temat dnia','Topmeldung','Hoofdverhaal'],MAJOR:['In focus','W centrum uwagi','Im Fokus','In beeld'],
        STANDARD:['Report','Relacja','Bericht','Verslag'],SHORT:['Brief','W skrócie','Kurzmeldung','Kort nieuws'],
        TOURNAMENT:['Tournament','Turniej','Turnier','Toernooi'],BREAKING:['Breaking','Pilne','Eilmeldung','Breaking'],
        RANKING:['Rankings','Ranking','Rangliste','Ranglijst'],CAREER:['Career','Kariera','Karriere','Carrière'],FORM:['Form & fitness','Forma i zdrowie','Form & Gesundheit','Vorm & gezondheid'],
        MILESTONE:['Milestone','Osiągnięcie','Meilenstein','Mijlpaal'],RECORD:['Records & season','Rekordy i sezon','Rekorde & Saison','Records & seizoen'],
        UPSET:['Upset','Sensacja','Überraschung','Verrassing'],WORLD_CHAMPIONSHIP:['World Championship','Mistrzostwa świata','Weltmeisterschaft','Wereldkampioenschap'],
        RIVALRY:['Rivalry','Rywalizacja','Rivalität','Rivaliteit'],RETIREMENT:['Retirement','Emerytura','Karriereende','Pensioen'],PREVIEW:['Preview','Zapowiedź','Vorschau','Voorbeschouwing']};
    return labels[key]?newsSay(...labels[key]):key;
}
function getNewsroomArticles() {
    const state=initWorldNews(),all=[...state.entries,...newsRoom().archive];
    return [...new Map(all.map(a=>[a.id,a])).values()].filter(isWorldNewsEntryVisible)
        .sort((a,b)=>b.timestamp-a.timestamp||b.id-a.id);
}
function setWorldNewsSeason(value) {
    worldNewsSeasonFilter=value==='all'||value==='current'||/^\d{4}$/.test(value)?value:'current';
    worldNewsVisibleCount=WORLD_NEWS_CONFIG.pageSize;renderWorldNews();
}
function newsStoryTitle(s) {
    const n=s.players[0]?.name||'',o=s.players[1]?.name||'';
    const titles={RISE_OF_NEW_STAR:newsSay(`The rise of ${n}`,`Droga ${n} do czołówki`,`Der Aufstieg von ${n}`,`De opmars van ${n}`),
        WONDERKID_RISE:newsSay(`A young star: ${n}`,`Młoda gwiazda: ${n}`,`Junger Star: ${n}`,`Jonge ster: ${n}`),
        WORLD_NO1_BATTLE:newsLabel('rankings'),WORLD_CHAMPIONSHIP_RUN:newsSay(`${n} on the world stage`,`${n} na mistrzostwach świata`,`${n} auf der WM-Bühne`,`${n} op het WK`),
        RIVALRY:`${n} × ${o}`,REVENGE:`${n} × ${o}`,
        FALL_OF_STAR:newsSay(`${n} fights to hold on`,`${n} walczy o powrót`,`${n} kämpft um den Anschluss`,`${n} vecht voor aansluiting`),
        FORMER_CHAMPION_DECLINE:newsSay(`A champion under pressure: ${n}`,`Mistrz pod presją: ${n}`,`Ein Champion unter Druck: ${n}`,`Kampioen onder druk: ${n}`),
        COMEBACK:newsSay(`${n}'s comeback`,`${n}: powrót`,`${n}: Comeback`,`${n}: comeback`),
        VETERAN_RESURGENCE:newsSay(`One more chapter for ${n}`,`Kolejny rozdział ${n}`,`Ein weiteres Kapitel für ${n}`,`Een nieuw hoofdstuk voor ${n}`),
        LATE_BLOOMER:newsSay(`${n} finds a new level`,`${n} na nowym poziomie`,`${n} auf neuem Niveau`,`${n} op een nieuw niveau`),
        MAJOR_DOMINANCE:newsSay(`${n}'s major run`,`Wielkie tytuły ${n}`,`Die Major-Serie von ${n}`,`De majorreeks van ${n}`),
        WINNING_STREAK:newsSay(`${n}'s trophy streak`,`Seria tytułów ${n}`,`Die Titelserie von ${n}`,`De titelreeks van ${n}`)};
    return titles[s.type]||newsSay(`${n}: the season's story`,`${n}: historia sezonu`,`${n}: Saisonverlauf`,`${n}: het seizoensverhaal`);
}
