// Article recipes, not synonym roulette. The selected structure is saved once;
// four language editions are regenerated from immutable sporting snapshots.
const NEWS_ARTICLE_BLUEPRINTS = Object.freeze({
    UPSET:[
        ['surprise','match status consequence ranking history','shock'],
        ['opposition','match consequence event ranking','eliminated','stage'],
        ['ranking','match status consequence history','elite','opponentRank'],
        ['match','status event consequence ranking','edge','score'],
        ['event','match consequence status history','stage','stage'],
        ['outsider','status match ranking consequence','outsider','outsider'],
        ['journey','match status consequence ranking','run','route'],
        ['consequence','match status history ranking','place','advance']
    ],
    RESULT:[
        ['result','match significance route ranking history event','crown'],
        ['event','result match significance ranking route','event'],
        ['match','result opposition significance ranking history','final','score'],
        ['significance','result match route ranking history','first','firstTitle'],
        ['ranking','result match significance history route','ranking','ranking'],
        ['journey','result match ranking significance history','campaign','route'],
        ['history','result significance match ranking route','repeat','repeatTitles'],
        ['narrative','result match significance ranking history','rise','story']
    ],
    MAJOR:[
        ['result','match significance route opposition ranking history event','crown'],
        ['event','result route match ranking significance history','event'],
        ['match','significance result opposition route history ranking','final','score'],
        ['significance','match route ranking history event opposition','first','firstMajor'],
        ['ranking','result significance route match history event','ranking','ranking'],
        ['journey','match result significance history ranking opposition','campaign','route'],
        ['history','result match route opposition significance ranking','repeat','repeatTitles'],
        ['narrative','result match significance route ranking history','rise','story']
    ],
    WORLD:[
        ['result','match significance route opposition history ranking event','world'],
        ['significance','match route history opposition ranking event','firstWorld','firstWorld'],
        ['history','result match route ranking significance opposition','worldHistory','repeatWorld'],
        ['journey','match significance history ranking opposition event','worldRun','route'],
        ['match','significance route opposition history ranking event','worldFinal','score'],
        ['narrative','result match route history ranking significance','worldRise','story']
    ],
    RANKING:[
        ['ranking','cause rankMoney history narrative consequence','position'],
        ['cause','ranking narrative rankMoney history consequence','cause','tournament'],
        ['history','ranking cause rankMoney narrative consequence','return','returning'],
        ['age','ranking cause narrative rankMoney consequence','youth','young'],
        ['narrative','ranking cause history rankMoney consequence','momentum','story'],
        ['rankMoney','ranking cause narrative history consequence','race','money']
    ],
    RISE:[
        ['narrative','ranking age history consequence cause','rise'],
        ['ranking','narrative age cause history consequence','position','ranking'],
        ['age','narrative ranking cause history consequence','young','age'],
        ['cause','narrative ranking history age consequence','run','tournament'],
        ['history','ranking narrative age cause consequence','milestone','history'],
        ['progress','ranking age narrative history cause','next']
    ],
    COMEBACK:[
        ['comeback','ranking history age cause narrative consequence','comeback'],
        ['history','comeback ranking age narrative cause consequence','champion','history'],
        ['ranking','comeback history narrative age cause consequence','return','movement'],
        ['age','comeback ranking history cause narrative consequence','veteran','age'],
        ['cause','comeback ranking history narrative consequence','achievement','tournament'],
        ['narrative','comeback history ranking age consequence','chapter','story']
    ],
    DECLINE:[
        ['decline','ranking history narrative age consequence','slide'],
        ['history','decline ranking age narrative consequence','former','history'],
        ['ranking','history decline narrative age consequence','position','ranking'],
        ['narrative','ranking decline history consequence age','pressure','story'],
        ['age','decline ranking history narrative consequence','chapter','age'],
        ['careerContext','ranking history decline narrative cause','distance']
    ],
    PREVIEW:[
        ['event','defender leaders recent previewStories young rankingContext','event'],
        ['defender','event leaders recent previewStories young rankingContext','defend','defending'],
        ['leaders','event defender previewStories recent young rankingContext','leaders','leaders'],
        ['recent','event leaders defender young previewStories rankingContext','form','recent'],
        ['previewStories','event defender recent leaders young rankingContext','stories','previewStories'],
        ['young','event leaders recent defender previewStories rankingContext','youth','previewYoung']
    ],
    FINAL:[
        ['finalists','route opponentRoute history rivalry ranking event','showdown'],
        ['journey','opponentRoute finalists history ranking rivalry event','roads','route'],
        ['opposition','finalists route opponentRoute ranking history rivalry','opponents','opponent'],
        ['ranking','finalists route opponentRoute rivalry history event','ranking','ranking'],
        ['history','finalists route opponentRoute ranking rivalry event','history','history'],
        ['rivalry','finalists route opponentRoute history ranking event','rivals','rivalry']
    ],
    OTHER:[
        ['context','ranking history narrative age consequence','context'],
        ['event','context ranking narrative history consequence','event','tournament'],
        ['history','context ranking age narrative consequence','history','history'],
        ['ranking','context history narrative age consequence','ranking','ranking'],
        ['narrative','context ranking history age consequence','narrative','story'],
        ['age','context ranking history narrative consequence','age','age']
    ]
});
function newsPublicFacts(a) {
    const raw=a.data?.facts||a.data||{},f={};
    const keys=['actor','opponent','previous','tournament','age','ranking','previousRanking','worldTitles','knownMajorTitles','knownTitles',
        'majorTitles','recentTitles','firstTitle','firstMajor','firstWorld','firstRanking','prize','stage','score','unit',
        'opponentRank','returning','amount','gapMoney','reignDays','milestone','meetings','h2hWins','h2hLosses','defending','defender',
        'year','champion','no1','majorWinners','highlights','dominant','watch','recordKind','youngPlayers','exceptionalSeason',
        'exceptionalMajorTitles','kind','country','names','route','opponentRoute','titleHistory','previewContext','matchStats',
        'winnerRankBefore','runnerRank','previousStoryDate','storylineStage','storylineType','season','coverageStage'];
    for(const k of keys)if(raw[k]!==undefined)f[k]=newsClone(raw[k]);
    if(raw.historicalPeak)f.historicalPeak={ranking:newsRank(raw.historicalPeak.ranking),year:newsNumber(raw.historicalPeak.year)};
    if(!f.actor)f.actor={id:'',name:f.country||'Darts',country:f.country||''};
    if(!f.year&&Number.isFinite(a.timestamp))f.year=new Date(a.timestamp).getFullYear();
    for(const k of ['actor','opponent','previous','defender','champion','no1'])if(f[k])f[k]=newsPerson(f[k]);
    if(f.tournament){f.tournament=newsTournamentSnapshot(f.tournament);
        if(typeof getTournamentDisplayName==='function')f.tournament.name=getTournamentDisplayName(f.tournament);}
    newsSanitizeCoverageFacts(f);
    if(a.type==='ranking'&&!f.ranking)f.ranking=1;
    if(a.type==='youth'&&typeof f.stage==='string')f.stage={semifinal:4,quarterfinal:8,final:2}[f.stage]||null;
    if(f.score)f.score=String(f.score).replace(/:/g,'–');
    for(const route of [f.route,f.opponentRoute])if(route)for(const match of route)match.score=String(match.score).replace(/:/g,'–');
    return f;
}
function newsEditorialFamily(a,f=newsPublicFacts(a)) {
    const topics=a.topics||[a.topic];
    if(topics.includes('world_result')||a.type==='champion'&&f.tournament?.world)return 'WORLD';
    if(topics.includes('result')||a.type==='champion')return f.tournament?.major?'MAJOR':'RESULT';
    if(['preview','world_preview'].includes(a.topic))return 'PREVIEW';
    if(a.topic==='final_preview')return 'FINAL';
    if(a.topic?.startsWith('ranking')||a.type==='ranking')return 'RANKING';
    if(a.topic==='upset'||a.type==='upset')return 'UPSET';
    if(['career_recovery','veteran_resurgence'].includes(a.topic))return 'COMEBACK';
    if(['major_decline','former_star_falling','career_stagnation','one_season_wonder'].includes(a.topic))return 'DECLINE';
    if(['young_elite_player','rising_star','breakthrough_confirmed','late_bloomer','career_peak','world_run','deep_run'].includes(a.topic)||a.type==='youth')return 'RISE';
    return 'OTHER';
}
function newsBlueprintEligible(need,f) {
    if(!need)return true;
    return !!({stage:Number.isInteger(f.stage),advance:Number.isInteger(f.stage)&&f.stage>=4,movement:f.ranking&&f.previousRanking,score:f.score,ranking:f.ranking,opponentRank:f.opponentRank,
        outsider:f.ranking>32&&f.opponentRank<=10&&f.opponentRank>0,route:f.route?.length>=2,
        titleHistory:f.titleHistory?.length,repeatTitles:f.knownTitles>1,repeatWorld:f.worldTitles>1,firstTitle:f.firstTitle,firstMajor:f.firstMajor,firstWorld:f.firstWorld,
        story:f.storylineStage>1,returning:f.returning,young:f.age!==null&&f.age<=23,age:Number.isFinite(f.age),
        tournament:f.tournament?.name,history:f.titleHistory?.length||f.worldTitles||f.historicalPeak?.ranking,
        money:f.amount>0,defending:f.defending,leaders:f.previewContext?.rankingLeaders?.length,
        recent:f.previewContext?.recent?.length,previewStories:f.previewContext?.storylines?.length,
        previewYoung:f.previewContext?.young?.length,opponent:f.opponent?.name,rivalry:f.meetings>=2})[need];
}
function newsChooseEditorialPlan(a,remember=true) {
    const f=newsPublicFacts(a),family=newsEditorialFamily(a,f),recipes=NEWS_ARTICLE_BLUEPRINTS[family];
    if(a.editorial?.version===2&&a.editorial.family===family)return a.editorial;
    const recent=remember?newsRoom().recentTemplateUsage.filter(r=>r.articleId!==a.id).slice(-12):[];
    // Finals and previews can be weeks apart. Their own small memory survives
    // the intervening match reports, rather than always resetting to one recipe.
    const familyRecent=remember?(newsRoom().recentEditorialFamilies?.[family]||[]).filter(r=>r.articleId!==a.id).slice(-4):[];
    const options=recipes.map((r,i)=>({r,i})).filter(e=>newsBlueprintEligible(e.r[3],f));
    options.sort((a,b)=>{
        const cost=e=>recent.reduce((n,v,index)=>n+(v.blueprint===`${family}-${e.i}`?5:0)
            +(v.opening===`${family}:${e.r[0]}`?3:0)+(index===recent.length-1&&v.family===family&&v.headlineFamily===e.r[2]?12:0),0)
            +familyRecent.reduce((n,v,index)=>n+(v.blueprint===`${family}-${e.i}`?6:0)+(v.opening===`${family}:${e.r[0]}`?3:0)
                +(index===familyRecent.length-1&&v.headlineFamily===e.r[2]?16:0),0)
            -(e.r[3]?2:0);
        return cost(a)-cost(b)||a.i-b.i;
    });
    const selected=options[0]||{r:recipes[0],i:0},r=selected.r;
    const plan={version:2,family,blueprint:`${family}-${selected.i}`,headlineFamily:r[2],openingFamily:`${family}:${r[0]}`,
        modules:[r[0],...r[1].split(' ')]};
    if(remember){a.editorial=plan;const room=newsRoom();room.recentTemplateUsage.push({articleId:a.id,
        pattern:plan.blueprint,family,blueprint:plan.blueprint,headlineFamily:plan.headlineFamily,opening:plan.openingFamily,
        angle:family,playerId:newsId(f.actor),date:newsNow()});room.recentTemplateUsage=room.recentTemplateUsage.slice(-DARTS_NEWS_CONFIG.templateLimit);
        room.recentEditorialFamilies=room.recentEditorialFamilies||{};
        room.recentEditorialFamilies[family]=[...familyRecent,{articleId:a.id,blueprint:plan.blueprint,opening:plan.openingFamily,headlineFamily:plan.headlineFamily}].slice(-4);}
    return plan;
}
function chooseWorldNewsPattern(a) {return newsChooseEditorialPlan(a,true).blueprint;}
function getModernWorldNewsPresentation(a) {
    const f=newsPublicFacts(a),plan=newsChooseEditorialPlan(a,false);
    const paragraphs=[],used=new Set();
    const result=['WORLD','MAJOR','RESULT'].includes(plan.family);
    const modules=[...plan.modules,...(result&&f.tournament?.major?['opponentRoute','worldRecord','prize','rivalry']:[]),...(f.tournament?.world?['opposition','rankMoney','young']:[])];
    if(['world_run','deep_run'].includes(a.topic))modules.unshift('runStatus');
    if(a.topic==='one_season_wonder')modules.unshift('exceptionalSeason');
    const limit=a.depth==='MAJOR_FEATURE'?10:a.depth==='FEATURE'?8:a.depth==='SHORT'?2:5;
    for(const id of modules) {
        const text=newsArticleParagraph(id,f,a,plan);
        if(text&&!used.has(text)){paragraphs.push({id,text});used.add(text);}
        if(paragraphs.length>=limit)break;
    }
    if(!paragraphs.length)paragraphs.push({id:'context',text:newsArticleParagraph('context',f,a,plan)});
    const title=newsArticleHeadline(f,a,plan),deck=newsArticleDeck(f,a,plan);
    return {title,deck,body:paragraphs.map(p=>p.text).join('\n\n'),paragraphs,tournament:f.tournament?.name||'',
        byline:newsSay(plan.family==='PREVIEW'||['MAJOR','WORLD','RESULT','FINAL'].includes(plan.family)?'DWN Tournament Desk':'DWN Sports Desk',
            ['PREVIEW','MAJOR','WORLD','RESULT','FINAL'].includes(plan.family)?'Redakcja turniejowa DWN':'Redakcja sportowa DWN',
            ['PREVIEW','MAJOR','WORLD','RESULT','FINAL'].includes(plan.family)?'DWN Turnierredaktion':'DWN Sportredaktion',
            ['PREVIEW','MAJOR','WORLD','RESULT','FINAL'].includes(plan.family)?'DWN Toernooiredactie':'DWN Sportredactie'),
        structure:plan.blueprint,headlineFamily:plan.headlineFamily,openingFamily:plan.family+':'+paragraphs[0].id,depth:a.depth||'STANDARD'};
}
