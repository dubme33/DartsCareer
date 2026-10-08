// A read-only sporting observer. All writes are confined to player.worldNews.
const DARTS_NEWS_DAY = 86400000;
const worldNewsRankingCache = new WeakMap();
function newsNow() { return currentDate.getTime(); }
function newsClone(value) { return JSON.parse(JSON.stringify(value)); }
function newsPerson(value) {
    return value?.name ? { id: String(value.id || value.playerId || ''), name: String(value.name).slice(0,150),
        country: String(value.country || '').slice(0,80) } : null;
}
function newsId(person) { return person?.id || `name:${person?.name || ''}:${person?.country || ''}`; }
function newsNumber(value) { return typeof value === 'number' && Number.isFinite(value) ? value : null; }
function newsRank(value) { return newsNumber(value)>0 ? value : null; }
function newsAge(person) { return typeof getPlayerAge === 'function' ? getPlayerAge(person,currentDate)
    : Number.isInteger(person?.birthYear) ? currentDate.getFullYear()-person.birthYear : null; }
function newsRoster() { return getWorldNewsPlayers(); }
function newsStandings() {
    return newsRoster().filter(p=>p?.name&&!p.isBye&&Number(p.prizeMoney)>0)
        .sort((a,b)=>Number(b.prizeMoney)-Number(a.prizeMoney))
        .map((p,i)=>({ person:newsPerson(p), rank:i+1, money:Number(p.prizeMoney), ovr:worldNewsRating(p), age:newsAge(p) }));
}
function newsCachedRanks() {
    const room=newsRoom();let ranks=worldNewsRankingCache.get(room);
    if(!ranks){ranks=new Map(newsStandings().map(row=>[newsId(row.person),row.rank]));worldNewsRankingCache.set(room,ranks);}
    return ranks;
}
function newsRoom() { return initializeWorldNewsRoom(initWorldNews()); }
function initializeWorldNewsRoom(state) {
    if (state.newsroom?.schemaVersion===DARTS_NEWS_CONFIG.schema) return state.newsroom;
    if(state.newsroom&&state.newsroom.schemaVersion===3) {
        // Upgrade editorial metadata in place. Never discard sporting memory or consumed IDs.
        const room=state.newsroom;room.schemaVersion=DARTS_NEWS_CONFIG.schema;room.configVersion=DARTS_NEWS_CONFIG.configVersion;
        for(const a of [...state.entries,...(room.archive||[])])if(a.type==='article')newsSetArticleTaxonomy(a);
        return room;
    }
    // Preserve legacy entries, read flags and the finalized OOM leader.
    state.newsroom={schemaVersion:DARTS_NEWS_CONFIG.schema, configVersion:DARTS_NEWS_CONFIG.configVersion,
        trackingSince:newsNow(), careerCursor:null, consumedCareerEventIds:[], consumedKeys:[], matchKeys:[],
        archive:[], storylines:[], people:{}, seasons:[], tournaments:[], rivalries:[],
        recentTemplateUsage:[], candidates:[], decisions:[], week:{key:null,count:0,allowance:6},
        rankingBaseline:null, lastRankingCheck:null, lastDaily:null, leaderSince:newsNow(), no1History:[],
        annualReviews:[], retiredIds:[], tournamentTaxonomyVersion:1};
    const room=state.newsroom;
    if(state.leader?.id)room.no1History.push(state.leader.id);
    return room;
}
function restoreWorldNewsRoom(state) {
    const r=initializeWorldNewsRoom(state),cfg=DARTS_NEWS_CONFIG;
    for(const [field,limit] of Object.entries({archive:cfg.archiveLimit,storylines:cfg.storylineLimit,
        consumedCareerEventIds:cfg.eventIdLimit,consumedKeys:cfg.eventIdLimit,matchKeys:cfg.matchKeyLimit,
        recentTemplateUsage:cfg.templateLimit,candidates:cfg.candidateLimit,decisions:cfg.debugLimit,
        seasons:cfg.seasonLimit,tournaments:80,rivalries:80,no1History:100,annualReviews:cfg.seasonLimit,retiredIds:650})) {
        r[field]=Array.isArray(r[field])?r[field].slice(-limit):[];
    }
    r.archive=r.archive.filter(a=>isModernWorldNewsRecord(a)||a&&Number.isSafeInteger(a.id)&&a.id>0
        &&Number.isFinite(a.timestamp)&&typeof a.key==='string'&&['champion','upset','ranking','youth','condition'].includes(a.type)&&a.data);
    r.candidates=r.candidates.filter(c=>c&&typeof c.key==='string'&&c.facts?.actor&&Number.isFinite(c.timestamp));
    r.storylines=r.storylines.filter(s=>s&&typeof s.storylineId==='string'&&Array.isArray(s.players)
        &&['ACTIVE','COOLING','COMPLETED'].includes(s.status)&&Number.isFinite(s.lastUpdate));
    r.storylines.forEach(s=>{s.supportingEvents=(s.supportingEvents||[]).slice(-cfg.supportLimit);});
    r.people=r.people&&typeof r.people==='object'&&!Array.isArray(r.people)?r.people:{};
    const familyMemory=r.recentEditorialFamilies;
    if(familyMemory)r.recentEditorialFamilies=Object.fromEntries(['UPSET','RESULT','MAJOR','WORLD','RANKING','RISE','COMEBACK','DECLINE','PREVIEW','FINAL','OTHER']
        .filter(key=>Array.isArray(familyMemory[key])).map(key=>[key,familyMemory[key].filter(v=>v&&typeof v.blueprint==='string'&&typeof v.opening==='string').slice(-4)]));
    Object.values(r.people).forEach(p=>{p.timeline=Array.isArray(p.timeline)?p.timeline.slice(-cfg.timelineLimit):[];});
    if(!r.week||typeof r.week!=='object')r.week={key:null,count:0,allowance:6};
    state.sequence=Math.max(Number(state.sequence)||0,...r.archive.map(a=>a.id));
    newsMigrateTournamentTaxonomy(state,r);
    return r;
}
function isModernWorldNewsRecord(item) {
    return !!item&&Number.isSafeInteger(item.id)&&item.id>0&&typeof item.key==='string'
        &&Number.isFinite(item.timestamp)&&item.type==='article'&&item.data?.facts?.actor?.name
        &&DARTS_NEWS_CONFIG.categories.includes(item.category)&&typeof item.pattern==='string';
}
function newsRemember(field,key,limit=DARTS_NEWS_CONFIG.eventIdLimit) {
    const list=newsRoom()[field]; if(list.includes(key))return false;
    list.push(key);if(list.length>limit)list.splice(0,list.length-limit);return true;
}
function newsPlayerMemory(person) {
    const r=newsRoom(),id=newsId(person);
    if(!r.people[id]) {
        if(Object.keys(r.people).length>=DARTS_NEWS_CONFIG.peopleLimit) {
            const oldest=Object.entries(r.people).sort((a,b)=>(a[1].lastSeen||0)-(b[1].lastSeen||0))[0];
            if(oldest)delete r.people[oldest[0]];
        }
        r.people[id]={person:newsPerson(person),lastSeen:newsNow(),bestRank:null,previousRank:null,
            majorWins:0,titles:0,worldTitles:0,recentTitles:[],recentRuns:[],timeline:[]};
    }
    const p=r.people[id];p.lastSeen=newsNow();return p;
}
function newsSeason(year=currentDate.getFullYear()) {
    const r=newsRoom();let season=r.seasons.find(s=>s.year===year);
    if(!season) {season={year,startedAt:newsNow(),majorChampions:[],worldChampion:null,no1:null,
        candidates:{},titleCounts:{},worldNo1s:[],reviewed:false};r.seasons.push(season);
        r.seasons.sort((a,b)=>a.year-b.year);r.seasons=r.seasons.slice(-DARTS_NEWS_CONFIG.seasonLimit);}
    return season;
}
function newsTournamentIdentity(t) {
    const catalog=typeof tournamentDatabase!=='undefined'&&Array.isArray(tournamentDatabase)&&t?.id
        ?tournamentDatabase.find(row=>String(row?.id)===String(t.id)):null;
    const identity={...catalog,...t};
    // A display-name edit cannot change the source event's editorial identity.
    identity.sourceName=String(t?.sourceName||catalog?.sourceName||catalog?.name||t?.name||'');
    identity.name=identity.sourceName;
    return identity;
}
function newsTournamentClass(t) {
    const identity=newsTournamentIdentity(t),name=identity.sourceName.toLowerCase(),type=String(identity.specialType||'');
    const cycle=identity.editorCycle||identity.series||(typeof getCalendarTournamentCycle==='function'?getCalendarTournamentCycle(identity):'');
    const qualifier=!!identity.qualifierFor||identity.qualifier===true||cycle==='qualifier'||/qualifier|kwalifikac|q.?school/.test(name+' '+type.toLowerCase());
    const europeanChampionship=/^(?:european|continental) championship\b/.test(name);
    const europeanTour=cycle==='europeanTour'||(typeof isEuropeanTourTournament==='function'?isEuropeanTourTournament(identity):
        /(?:european|continental) tour\b|\(et\b|darts (?:open|trophy|grand prix)|(?:german|dutch) darts championship/.test(name));
    const finals=type==='worldMastersFinals'||/pro players finals|players championship finals|(?:global masters|world series) finals/.test(name);
    const ordinary=europeanTour&&!europeanChampionship||['playersChampionship','proTour','challengeTour','developmentTour','worldSeries'].includes(cycle)&&!finals
        ||['challengeTour','developmentTour','worldMasters'].includes(type)||identity.editorCycle==='other';
    const world=!qualifier&&!ordinary&&(/global darts championship|world darts championship|world championship/.test(name)||identity.world===true);
    const namedMajor=/matchplay|grand prix|grand slam|british open|uk open|crown masters|classicmasters|masters finals|premier league.*play|global darts league.*play|world cup|puchar narodów|champion's slam/.test(name);
    const known=qualifier||ordinary||world||europeanChampionship||finals||namedMajor||cycle==='major';
    // Legacy custom snapshots may have no surviving source metadata. Keep their
    // explicit class only when it does not contradict a known tournament type.
    const major=!qualifier&&!ordinary&&(world||europeanChampionship||finals||namedMajor||cycle==='major'||!known&&identity.major===true);
    let prestige=Number.isFinite(identity.prestige)?identity.prestige:world?1:major?.8:
        ['challengeTour','developmentTour'].includes(cycle)||/challenge|development|rising stars|future champions/.test(name)?.2:.45;
    if(typeof getTournamentSimulationProfile==='function') {
        const profile=getTournamentSimulationProfile(identity);if(profile?.key==='major'||profile?.key==='open')prestige=Math.max(prestige,.7);
    }
    return {qualifier,world,major,prestige,series:europeanTour?'europeanTour':cycle||'other'};
}
function newsTournamentSnapshot(t) {
    const identity=newsTournamentIdentity(t);
    return {id:String(t?.id||''),name:String(t?.name||''),sourceName:identity.sourceName,specialType:String(identity.specialType||''),
        city:String(t?.city||'').slice(0,100),country:String(t?.country||'').slice(0,80),month:newsNumber(t?.month),day:newsNumber(t?.day),
        worldMastersEvent:String(identity.worldMastersEvent||''),editorCycle:String(identity.editorCycle||''),qualifierFor:identity.qualifierFor||null,...newsTournamentClass(t)};
}
function newsMigrateTournamentTaxonomy(state,room) {
    if(room.tournamentTaxonomyVersion===1)return;
    const isEt=t=>{const c=newsTournamentClass(t);return c.series==='europeanTour'&&!c.major&&!c.qualifier;};
    const removedChampions=[];
    const repairFacts=(f,timestamp)=>{
        if(!f)return false;
        const corrected=f.tournament&&isEt(f.tournament);
        if(corrected){Object.assign(f.tournament,newsTournamentSnapshot(f.tournament));f.firstMajor=false;}
        if(Array.isArray(f.titleHistory)) {
            const removed=f.titleHistory.filter(isEt).reduce((n,t)=>n+(Number(t.count)||1),0);
            if(removed){f.titleHistory=f.titleHistory.filter(t=>!isEt(t));
                if(Number.isFinite(f.knownMajorTitles))f.knownMajorTitles=Math.max(0,f.knownMajorTitles-removed);f.firstMajor=false;}
        }
        if(f.previewContext?.recentChampions)f.previewContext.recentChampions=f.previewContext.recentChampions.filter(c=>!isEt({name:c.tournament}));
        if(Number.isFinite(f.majorTitles)&&Number.isFinite(timestamp)) {
            const year=new Date(timestamp).getFullYear(),count=removedChampions.filter(c=>c.year===year&&c.date<=timestamp&&newsId(c.person)===newsId(f.actor)).length;
            if(count)f.majorTitles=Math.max(0,f.majorTitles-count);
        }
        return corrected;
    };
    const removedByPlayer=new Map(),removedDates=new Map();
    for(const season of room.seasons) {
        const removed=(season.majorChampions||[]).filter(c=>isEt(c.tournamentInfo||{name:c.tournament}));
        removedChampions.push(...removed.map(c=>({...c,year:season.year})));
        for(const c of removed){const id=newsId(c.person);removedByPlayer.set(id,(removedByPlayer.get(id)||0)+1);
            if(!removedDates.has(id))removedDates.set(id,new Set());removedDates.get(id).add(c.date);}
        season.majorChampions=(season.majorChampions||[]).filter(c=>!removed.includes(c));
    }
    for(const [id,count]of removedByPlayer){const p=room.people[id];if(!p)continue;
        p.majorWins=Math.max(0,(Number(p.majorWins)||0)-count);
        for(const title of p.recentTitles||[])if(removedDates.get(id).has(title.date))title.major=false;}
    for(const a of [...state.entries,...room.archive])if(a.type==='article') {
        const corrected=repairFacts(a.data?.facts,a.timestamp);if(corrected)newsSetArticleTaxonomy(a);
    }
    for(const memory of room.tournaments){if(memory.tournament&&isEt(memory.tournament))Object.assign(memory.tournament,newsTournamentSnapshot(memory.tournament));
        repairFacts(memory.final,memory.timestamp);}
    for(const c of room.candidates)if(repairFacts(c.facts,c.timestamp)) {
        c.mandatory=false;c.category=newsCategory(c.topic,c.facts);
        if(c.reasons?.includes('major:+13')){c.importanceScore=Math.max(0,c.importanceScore-13);c.reasons=c.reasons.filter(r=>r!=='major:+13');}
    }
    // All IDs, consumed cursors, sporting ledgers and editorial copy stay intact.
    room.tournamentTaxonomyVersion=1;
}
function newsEventKey(t) { return `${currentDate.getFullYear()}:${t?.id||t?.sourceName||t?.name}:${t?.month}:${t?.day}`; }
function newsTournamentMemory(t) {
    const room=newsRoom(),key=newsEventKey(t);let memory=room.tournaments.find(e=>e.key===key);
    if(!memory) {memory={key,tournament:newsTournamentSnapshot(t),timestamp:newsNow(),runs:[],final:null,upsets:0};
        room.tournaments.push(memory);room.tournaments=room.tournaments.slice(-80);}
    return memory;
}
function newsImportance(topic,facts) {
    const rank=newsRank(facts.ranking),old=newsRank(facts.previousRanking),peak=newsRank(facts.historicalPeak?.ranking);
    const elite=rank&&rank<=10?14:rank&&rank<=32?9:rank&&rank<=64?4:0;
    const delta=Number(facts.ovr)-Number(facts.previousOvr);
    const scores={result:45,world_result:100,upset:44,ranking:98,ranking_milestone:56,ranking_race:65,
        preview:57,world_preview:86,world_run:65,deep_run:55,final_preview:93,retirement:26,season_review:90,
        young_elite_player:78,late_bloomer:68,major_decline:65,former_star_falling:69,veteran_resurgence:73,
        one_season_wonder:68,career_peak:51,rising_star:45,breakthrough_confirmed:39,
        career_stagnation:28,career_recovery:24,exceptional_longevity:52,rivalry:63,revenge:65,
        players_watch:51,condition:35,record:67};
    const reasons=[`base:${scores[topic]??40}`];let score=scores[topic]??40;
    if(topic==='condition')score+=['injury','recovered'].includes(facts.kind)?20:newsId(facts.actor)===String(player.id)?17:0;
    if(facts.significance==='high'){score+=4;reasons.push('confirmed-significance:+4');}
    if(facts.confirmations>=2){score+=Math.min(6,facts.confirmations*2);reasons.push('repeated-confirmations');}
    if(!['ranking','world_result','season_review'].includes(topic)){score+=elite;reasons.push(`ranking:${elite}`);}
    if(facts.tournament?.major){score+=13;reasons.push('major:+13');}
    if(facts.tournament?.world&&!['world_result','final_preview'].includes(topic)){score+=12;reasons.push('world:+12');}
    if(topic==='upset'){score+=Math.min(18,Number(facts.gap)||0);if(newsRank(facts.opponentRank)&&facts.opponentRank<=5)score+=10;}
    if(facts.age!==null&&facts.age<=21&&['result','world_run','rising_star','breakthrough_confirmed'].includes(topic))score+=7;
    if(old&&rank&&old>rank)score+=Math.min(12,(old-rank)/3);
    if(peak&&peak<=5&&['career_recovery','veteran_resurgence','former_star_falling','major_decline','retirement'].includes(topic))score+=20;
    if(facts.worldTitles>0&&['career_recovery','veteran_resurgence','retirement'].includes(topic))score+=15;
    if(topic==='retirement'&&(peak&&peak<=5||facts.worldTitles>0))score+=25;
    if(topic==='career_recovery'&&(rank===null||rank>16||delta<3))score-=22;
    if(topic==='career_stagnation'&&(!peak||peak>32))score-=18;
    if(topic==='career_peak'&&(rank===null||rank>32))score-=20;
    if(facts.majorTitles>=3)score+=9;
    if(facts.stage<=4&&facts.tournament?.major&&topic!=='result')score+=5;
    const active=newsRoom().storylines.find(s=>s.status==='ACTIVE'&&s.players.some(p=>newsId(p)===newsId(facts.actor))&&s.importance>=65);
    if(active){score+=5;reasons.push('ongoing-story:+5');}
    const recent=[...initWorldNews().entries,...newsRoom().archive].find(a=>a.type==='article'&&a.topic===topic
        &&newsId(a.data.facts.actor)===newsId(facts.actor)&&newsNow()-a.timestamp<DARTS_NEWS_CONFIG.repeatTopicDays*DARTS_NEWS_DAY);
    if(recent){score-=22;reasons.push('recent-same-topic:-22');}
    if(score>=90&&!newsLeadEligible(topic,facts)){score=89;reasons.push('major-tier-ceiling');}
    return {score:Math.max(0,Math.min(110,Math.round(score))),reasons};
}
function newsLeadEligible(topic,f) {
    if(['world_result','ranking','final_preview','season_review'].includes(topic))return true;
    if(topic==='young_elite_player')return f.age!==null&&f.age<=23&&f.ranking&&f.ranking<=32&&f.ovr>=85;
    if(topic==='late_bloomer')return f.ranking&&f.ranking<=16&&f.ovr-f.previousOvr>=7;
    if(['career_recovery','veteran_resurgence'].includes(topic))return f.ranking&&f.ranking<=16
        &&(f.historicalPeak?.ranking&&f.historicalPeak.ranking<=5||f.worldTitles>0)&&f.ovr-f.previousOvr>=3;
    if(['major_decline','former_star_falling','retirement'].includes(topic))return f.historicalPeak?.ranking&&f.historicalPeak.ranking<=5||f.worldTitles>0;
    if(topic==='upset')return f.tournament?.world||f.tournament?.major&&f.gap>=15&&newsRank(f.opponentRank)&&f.opponentRank<=5;
    if(topic==='world_run')return f.stage<=4&&f.age!==null&&f.age<=23&&(f.ranking===null||f.ranking>16);
    if(topic==='ranking_milestone')return f.milestone<=10&&f.age!==null&&f.age<=23;
    if(topic==='result')return f.firstMajor&&f.ranking&&f.ranking<=10;
    return false;
}
function newsCategory(topic,f) {
    if(f.tournament?.world&&!['ranking','retirement'].includes(topic))return 'WORLD_CHAMPIONSHIP';
    if(topic==='season_review'||topic==='record')return 'RECORD';
    if(topic.includes('preview'))return 'PREVIEW';
    if(topic.startsWith('ranking'))return 'RANKING';
    if(topic==='upset')return 'UPSET';
    if(topic==='result'||topic==='world_result')return 'TOURNAMENT';
    if(topic==='rivalry'||topic==='revenge')return 'RIVALRY';
    if(topic==='retirement')return 'RETIREMENT';
    if(topic==='condition')return 'FORM';
    if(topic==='players_watch')return 'PREVIEW';
    return 'CAREER';
}
function newsTopicPriority(topic) {
    return topic==='world_result'?600:topic==='result'?500:topic==='ranking'?300:topic==='upset'?100:200;
}
function newsSetArticleTaxonomy(a) {
    const f=a.data.facts,topics=a.topics||[a.topic],tags=new Set(a.tags||[]);
    if(f.tournament){Object.assign(f.tournament,newsTournamentSnapshot(f.tournament));if(!f.tournament.major)tags.delete('MAJOR');}
    for(const topic of topics){tags.add(newsCategory(topic,f));
        if(/^(young_elite_player|rising_star|breakthrough_confirmed|late_bloomer|career_|major_decline|former_star_falling|veteran_resurgence|exceptional_longevity|one_season_wonder)/.test(topic))tags.add('CAREER');
        if(topic.startsWith('ranking'))tags.add('RANKING');if(topic==='upset')tags.add('UPSET');}
    if(f.tournament){tags.add('TOURNAMENT');if(f.tournament.major)tags.add('MAJOR');if(f.tournament.world)tags.add('WORLD_CHAMPIONSHIP');}
    if(newsRank(f.ranking)&&newsRank(f.previousRanking)&&f.ranking!==f.previousRanking)tags.add('RANKING');
    const result=topics.includes('world_result')?'world_result':topics.includes('result')?'result':null;
    if(result){a.topic=result;a.primaryCategory=f.tournament?.world?'WORLD_CHAMPIONSHIP':'TOURNAMENT';}
    else a.primaryCategory=newsCategory(a.topic,f);
    a.category=a.primaryCategory;tags.add(a.primaryCategory);a.tags=[...tags].slice(0,12);
    if(result&&f.eventKey)a.canonicalKey=`${f.eventKey}:result`;
    else if(['preview','world_preview','final_preview'].includes(a.topic)&&f.eventKey)
        a.canonicalKey=`${f.eventKey}:${a.topic==='final_preview'?'finalPreview':'preview'}`;
    const ordinaryEt=f.tournament?.series==='europeanTour'&&!f.tournament.major;
    a.depth=ordinaryEt&&a.topic.includes('preview')?(a.tier==='SHORT'?'SHORT':'STANDARD'):f.tournament?.world&&result?'MAJOR_FEATURE':f.tournament?.major&&result||!ordinaryEt&&(a.topic==='final_preview'
        ||['preview','world_preview'].includes(a.topic))?'FEATURE':a.importanceScore>=90?'FEATURE':a.tier==='SHORT'?'SHORT':'STANDARD';
    a.visualType=a.topic.includes('preview')&&a.topic!=='final_preview'?'tournament':f.opponent&&(result||a.topic==='upset'||a.topic==='final_preview')?'split':a.topic.startsWith('ranking')?'ranking':'portrait';
}
function newsDebugDecision(candidate,outcome,reason) {
    const r=newsRoom();r.publicationCounts=r.publicationCounts||{};
    const countKey=outcome+':'+candidate.topic;r.publicationCounts[countKey]=(r.publicationCounts[countKey]||0)+1;
    r.decisions.push({key:candidate.key,topic:candidate.topic,playerId:newsId(candidate.facts.actor),
        importanceScore:candidate.importanceScore,reasons:candidate.reasons,outcome,reason,date:newsNow()});
    r.decisions=r.decisions.slice(-DARTS_NEWS_CONFIG.debugLimit);
}
function newsOffer(topic,key,facts,options={}) {
    if(!facts?.actor?.name||!newsRemember('consumedKeys',key))return null;
    facts=newsSafeFacts(facts);
    const importance=newsImportance(topic,facts),c={topic,key,facts:newsClone(facts),timestamp:options.timestamp??newsNow(),
        importanceScore:importance.score,reasons:importance.reasons,category:newsCategory(topic,facts)};
    c.mandatory=['result','world_result'].includes(topic)&&facts.tournament?.major;
    if(c.mandatory)c.importanceScore=Math.max(c.importanceScore,DARTS_NEWS_CONFIG.majorImportance);
    const r=newsRoom();
    // Facts below the publication threshold can support an existing story; they do not make filler articles.
    if(c.importanceScore<DARTS_NEWS_CONFIG.minimumImportance){
        newsUpdateStoryline(c,false);const supporting=newsFindCombined(c);
        if(supporting){newsMergeArticle(supporting,c);newsDebugDecision(c,'combined',`article:${supporting.id}`);return supporting;}
        newsDebugDecision(c,'ignored','below-threshold');return null;
    }
    newsUpdateStoryline(c,true);newsRecordSeasonCandidate(c);
    const merged=newsFindCombined(c);
    if(merged){newsMergeArticle(merged,c);newsDebugDecision(c,'combined',`article:${merged.id}`);return merged;}
    r.candidates.push(c);r.candidates.sort((a,b)=>b.importanceScore-a.importanceScore||a.timestamp-b.timestamp);
    r.candidates=r.candidates.slice(0,DARTS_NEWS_CONFIG.candidateLimit);
    return newsFlushCandidates().find(a=>a.key===key)||null;
}
function newsSafeFacts(facts) {
    const allowed=['actor','opponent','previous','tournament','eventKey','age','ovr','previousOvr','ranking','previousRanking',
        'historicalPeak','worldTitles','knownMajorTitles','knownTitles','observationType','exceptionalSeason','exceptionalMajorTitles',
        'significance','confirmations','prize','stage','gap','gapMoney','opponentRank','score','unit','majorTitles','recentTitles',
        'firstTitle','firstMajor','firstWorld','amount','returning','reignDays','milestone','challengers','recordKind','youngPlayers',
        'meetings','h2hWins','h2hLosses','defending','year','champion','no1','majorWinners','highlights','dominant','watch',
        'kind','event','country','names','season','route','opponentRoute','titleHistory','previewContext',
        'matchStats','firstRanking','winnerRankBefore','runnerRank','defender','rankAtFinal','coverageStage'];
    const clean={};for(const k of allowed)if(facts[k]!==undefined)clean[k]=newsClone(facts[k]);
    for(const k of ['actor','opponent','previous','champion','no1'])if(clean[k])clean[k]=newsPerson(clean[k]);
    if(clean.historicalPeak)clean.historicalPeak={ovr:newsNumber(clean.historicalPeak.ovr),ranking:newsRank(clean.historicalPeak.ranking),year:newsNumber(clean.historicalPeak.year)};
    if(clean.tournament)clean.tournament=newsTournamentSnapshot(clean.tournament);
    for(const k of ['challengers','youngPlayers','majorWinners'])if(clean[k])clean[k]=clean[k].map(newsPerson).filter(Boolean).slice(0,8);
    if(clean.watch)clean.watch=clean.watch.map(w=>({person:newsPerson(w.person),titles:w.titles,runs:w.runs,ranking:newsRank(w.ranking)})).slice(0,3);
    if(clean.highlights)clean.highlights=clean.highlights.map(h=>({kind:h.kind,person:newsPerson(h.person)})).slice(0,4);
    if(clean.dominant)clean.dominant={person:newsPerson(clean.dominant.person),titles:clean.dominant.titles};
    if(clean.event)clean.event={type:clean.event.type,modifier:clean.event.modifier,startedOn:clean.event.startedOn,endsOn:clean.event.endsOn};
    if(typeof newsSanitizeCoverageFacts==='function')newsSanitizeCoverageFacts(clean);
    return clean;
}
function recordNewsroomLegacy(type,key,data) {
    if(type==='condition') {
        const actor=newsPerson(data.actor),row=newsStandings().find(r=>newsId(r.person)===newsId(actor));
        const injury=['injury','recovered'].includes(data.kind),own=newsId(actor)===String(player.id);
        const priority=injury?(own||row?.rank<=16?66:48):(own?52:row?.rank<=10?49:30);
        const f={actor,kind:data.kind,event:data.event,ranking:row?.rank||null};
        // Conditions use the same bounded queue/budget; injury remains visible when form is hidden.
        if(priority<48){newsRemember('consumedKeys',key);return null;}
        const item=newsOffer('condition',key,f);if(item)return item;
        return null;
    }
    const topic={champion:'result',upset:'upset',ranking:'ranking',youth:'rising_star'}[type];
    if(!topic)return null;
    const actor=data.actor||{id:`team:${data.country}`,name:data.country,country:data.country};
    return newsOffer(topic,key,{...data,actor,tournament:data.tournament?newsTournamentSnapshot(data.tournament):null});
}
function newsFindCombined(c) {
    if(['result','world_result','preview','world_preview','final_preview'].includes(c.topic)&&c.facts.eventKey){
        const suffix=['result','world_result'].includes(c.topic)?'result':c.topic==='final_preview'?'finalPreview':'preview';
        const existing=[...initWorldNews().entries,...newsRoom().archive].find(a=>a.canonicalKey===`${c.facts.eventKey}:${suffix}`);
        if(existing)return existing;
    }
    if(['preview','world_preview','final_preview','season_review','players_watch','rivalry','revenge','condition','retirement'].includes(c.topic))return null;
    return initWorldNews().entries.find(a=>a.type==='article'&&newsId(a.data.facts.actor)===newsId(c.facts.actor)
        &&Math.abs(c.timestamp-a.timestamp)<=DARTS_NEWS_CONFIG.combineDays*DARTS_NEWS_DAY
        &&!['preview','world_preview','final_preview','condition','retirement','season_review','players_watch','rivalry','revenge'].includes(a.topic)
        &&(!a.data.facts.tournament||!c.facts.tournament||a.data.facts.eventKey===c.facts.eventKey));
}
function newsMergeArticle(a,c) {
    const facts=a.data.facts;
    for(const [key,value] of Object.entries(c.facts))if(value!==null&&value!==undefined) {
        if((a.topics||[a.topic]).some(t=>t==='result'||t==='world_result')&&!['result','world_result'].includes(c.topic)
            &&['opponent','score','unit','stage','route','opponentRoute','prize','matchStats','eventKey','tournament'].includes(key))continue;
        if(key==='ranking'&&a.topics?.includes('ranking')&&c.topic!=='ranking')continue;
        if(c.timestamp<(a.factsUpdatedAt??a.timestamp)&&facts[key]!==undefined&&facts[key]!==null)continue;
        facts[key]=value;
    }
    a.supportingKeys=[...new Set([...(a.supportingKeys||[a.key]),c.key])].slice(-8);
    a.topics=[...new Set([...(a.topics||[a.topic]),c.topic])].slice(-6);
    if(newsTopicPriority(c.topic)>newsTopicPriority(a.topic))a.topic=c.topic;
    a.importanceScore=Math.max(a.importanceScore,c.importanceScore);
    a.tier=newsTier(a.importanceScore);a.updatedAt=newsNow();a.factsUpdatedAt=Math.max(a.factsUpdatedAt??a.timestamp,c.timestamp);a.read=false;
    newsSetArticleTaxonomy(a);a.pattern=chooseWorldNewsPattern(a);newsAttachTimeline(a);updateWorldNewsBadge();
}
function newsTier(score){return score>=90?'HEADLINE':score>=72?'MAJOR':score>=56?'STANDARD':'SHORT';}
function newsFlushCandidates() {
    const r=newsRoom(),now=newsNow(),weekKey=Math.floor(now/(7*DARTS_NEWS_DAY)),published=[];
    if(r.week.key!==weekKey)r.week={key:weekKey,count:0,allowance:DARTS_NEWS_CONFIG.normalWeeklyBudget};
    const pending=[];
    for(const c of r.candidates) {
        if(now-c.timestamp>DARTS_NEWS_CONFIG.pendingDays*DARTS_NEWS_DAY){newsDebugDecision(c,'ignored','expired-budget');continue;}
        const combined=newsFindCombined(c);
        if(combined){newsMergeArticle(combined,c);newsDebugDecision(c,'combined',`article:${combined.id}`);continue;}
        if(c.facts.tournament?.world)r.week.allowance=Math.max(r.week.allowance,DARTS_NEWS_CONFIG.worldWeeklyBudget);
        else if(c.facts.tournament?.major)r.week.allowance=Math.max(r.week.allowance,DARTS_NEWS_CONFIG.majorWeeklyBudget);
        const allowance=c.importanceScore>=90?DARTS_NEWS_CONFIG.hardWeeklyBudget:r.week.allowance;
        if(r.week.count>=allowance&&!c.mandatory){pending.push(c);newsDebugDecision(c,'held','weekly-budget');continue;}
        const state=initWorldNews(),a={id:++state.sequence,type:'article',key:c.key,topic:c.topic,category:c.category,
            importanceScore:c.importanceScore,tier:newsTier(c.importanceScore),timestamp:c.timestamp,read:false,
            data:{facts:c.facts},supportingKeys:[c.key],topics:[c.topic]};
        newsSetArticleTaxonomy(a);a.pattern=chooseWorldNewsPattern(a);state.entries.unshift(a);r.week.count++;published.push(a);
        newsDebugDecision(c,'published',a.tier);newsAttachTimeline(a);
    }
    r.candidates=pending;newsPruneArchive();updateWorldNewsBadge();return published;
}
function newsPruneArchive() {
    const state=initWorldNews(),r=newsRoom(),cfg=DARTS_NEWS_CONFIG;
    state.entries.sort((a,b)=>b.timestamp-a.timestamp||b.id-a.id);
    const removed=state.entries.splice(cfg.liveLimit);
    for(const a of removed) {
        // Legacy news is preserved when leaving the live feed as well.
        if(a.type!=='article'||a.importanceScore>=cfg.majorImportance||a.topic==='season_review')r.archive.push(a);
    }
    const bySeason=new Map();
    for(const a of r.archive){const y=new Date(a.timestamp).getFullYear();if(!bySeason.has(y))bySeason.set(y,[]);bySeason.get(y).push(a);}
    const retention=a=>(a.topic==='season_review'||a.topics?.includes('world_result')?200:a.topics?.includes('ranking')?170:a.category==='RETIREMENT'?150:0)+(a.importanceScore||72);
    r.archive=[...bySeason.values()].flatMap(list=>[...list.filter(a=>a.type!=='article'),...list.filter(a=>a.type==='article')
        .sort((a,b)=>retention(b)-retention(a)||b.timestamp-a.timestamp).slice(0,cfg.archivePerSeason)]);
    r.archive.sort((a,b)=>retention(b)-retention(a)||b.timestamp-a.timestamp);
    r.archive=r.archive.slice(0,cfg.archiveLimit).sort((a,b)=>b.timestamp-a.timestamp||b.id-a.id);
}
function newsStoryType(c) {
    const f=c.facts;
    const direct={young_elite_player:f.age!==null&&f.age<=21?'WONDERKID_RISE':'RISE_OF_NEW_STAR',rising_star:'RISE_OF_NEW_STAR',
        late_bloomer:'LATE_BLOOMER',career_stagnation:'CAREER_STAGNATION',major_decline:'FALL_OF_STAR',
        former_star_falling:f.worldTitles>0?'FORMER_CHAMPION_DECLINE':'FALL_OF_STAR',career_recovery:'COMEBACK',
        veteran_resurgence:'VETERAN_RESURGENCE',one_season_wonder:'ONE_SEASON_WONDER',career_peak:'CAREER_BEST_SEASON',
        exceptional_longevity:'RECORD_CHASE',ranking:'WORLD_NO1_BATTLE',ranking_race:'WORLD_NO1_BATTLE',
        rivalry:'RIVALRY',revenge:'REVENGE',world_run:'WORLD_CHAMPIONSHIP_RUN',final_preview:f.tournament?.world?'WORLD_CHAMPIONSHIP_RUN':'DEEP_TOURNAMENT_RUN',
        deep_run:f.age!==null&&f.age<=23?'RISE_OF_NEW_STAR':'DEEP_TOURNAMENT_RUN',
        breakthrough_confirmed:'BREAKTHROUGH_SEASON',record:f.recordKind==='generation'?'GENERATION_CHANGE':'RECORD_CHASE'};
    if(direct[c.topic])return direct[c.topic];
    if(c.topic==='world_preview')return 'WORLD_CHAMPIONSHIP_RUN';
    if(c.topic==='ranking_milestone')return f.age<=23?'RISE_OF_NEW_STAR':'MILESTONE_CHASE';
    if(c.topic==='upset')return f.tournament?.world?'WORLD_CHAMPIONSHIP_RUN':'DEEP_TOURNAMENT_RUN';
    if(c.topic==='result'||c.topic==='world_result')return f.majorTitles>=3?'MAJOR_DOMINANCE':f.recentTitles>=3?'WINNING_STREAK'
        :f.age!==null&&f.age<=23?'RISE_OF_NEW_STAR':f.tournament?.world?'WORLD_CHAMPIONSHIP_RUN':'CAREER_BEST_SEASON';
    return null;
}
function newsUpdateStoryline(c,mayStart) {
    const type=newsStoryType(c);if(!type)return null;
    const r=newsRoom(),f=c.facts,players=[f.actor,...(f.opponent&&['RIVALRY','REVENGE'].includes(type)?[f.opponent]:[])];
    const group=type==='WORLD_NO1_BATTLE'?'world-no1':players.map(newsId).sort().join('|');
    const riseTypes=['RISE_OF_NEW_STAR','WONDERKID_RISE','BREAKTHROUGH_SEASON'];
    let s=r.storylines.find(s=>s.status!=='COMPLETED'&&s.group===group&&(s.type===type||riseTypes.includes(type)&&riseTypes.includes(s.type)));
    if(!s&&!mayStart)return null;
    if(!s) {
        const previous=r.storylines.filter(s=>s.group===group).at(-1);
        s={storylineId:`story:${type}:${group}:${c.timestamp}`,type,group,players:newsClone(players),startDate:c.timestamp,
            lastUpdate:c.timestamp,importance:c.importanceScore,stage:0,status:'ACTIVE',supportingEvents:[],
            headlineContext:{},historicalContext:previous?{previousStorylineId:previous.storylineId,type:previous.type}:null};
        r.storylines.push(s);
    }
    if(s.supportingEvents.some(e=>e.key===c.key))return s;
    const latest=s.supportingEvents.at(-1);
    if(f.eventKey&&latest&&latest.eventKey===f.eventKey&&latest.stage===f.stage&&latest.topic===c.topic) {
        c.facts.storylineStage=s.stage;c.facts.storylineType=s.type;return s;
    }
    s.status='ACTIVE';s.lastUpdate=c.timestamp;s.importance=Math.max(c.importanceScore,s.importance*.98);
    s.stage++;s.players=newsClone(players);s.headlineContext={topic:c.topic,ranking:f.ranking??null,ovr:f.ovr??null,
        tournament:f.tournament?.name||'',stage:f.stage??null};
    s.supportingEvents.push({key:c.key,date:c.timestamp,topic:c.topic,eventKey:f.eventKey||null,stage:f.stage??null,ranking:f.ranking??null,
        ovr:f.ovr??null,tournament:f.tournament?.name||''});s.supportingEvents=s.supportingEvents.slice(-DARTS_NEWS_CONFIG.supportLimit);
    c.facts.storylineStage=s.stage;c.facts.previousStoryDate=s.supportingEvents.length>1?s.supportingEvents.at(-2).date:null;
    c.facts.storylineType=s.type;
    const keepWeight=v=>(v.status==='ACTIVE'?200:v.status==='COOLING'?100:0)+v.importance;
    r.storylines.sort((a,b)=>keepWeight(b)-keepWeight(a)||b.lastUpdate-a.lastUpdate);
    r.storylines=r.storylines.slice(0,DARTS_NEWS_CONFIG.storylineLimit).sort((a,b)=>a.lastUpdate-b.lastUpdate);return s;
}
function newsCoolStorylines() {
    const now=newsNow();newsRoom().storylines.forEach(s=>{
        const days=(now-s.lastUpdate)/DARTS_NEWS_DAY;
        if(days>DARTS_NEWS_CONFIG.completedDays)s.status='COMPLETED';
        else if(days>DARTS_NEWS_CONFIG.coolingDays)s.status='COOLING';
    });
}
function newsAttachTimeline(a) {
    if(a.type!=='article'||a.importanceScore<72)return;
    const p=newsPlayerMemory(a.data.facts.actor),row={articleId:a.id,date:a.timestamp,season:new Date(a.timestamp).getFullYear(),
        topic:a.topic,category:a.category,ranking:a.data.facts.ranking??null};
    const index=p.timeline.findIndex(t=>t.articleId===a.id);if(index>=0)p.timeline[index]=row;else p.timeline.push(row);
    p.timeline=p.timeline.slice(-DARTS_NEWS_CONFIG.timelineLimit);
}
function newsRecordSeasonCandidate(c) {
    const season=newsSeason(Number.isInteger(c.facts.season)?c.facts.season:new Date(c.timestamp).getFullYear()),groups={rising_star:'breakout',young_elite_player:'young',
        breakthrough_confirmed:'breakout',late_bloomer:'breakout',career_recovery:'comeback',veteran_resurgence:'comeback',
        major_decline:'decline',former_star_falling:'decline',ranking_milestone:'climber',one_season_wonder:'oneSeason'};
    const group=groups[c.topic];if(group&&(!season.candidates[group]||season.candidates[group].score<c.importanceScore))
        season.candidates[group]={person:newsPerson(c.facts.actor),score:c.importanceScore,ranking:c.facts.ranking??null};
}
function newsKnownTitles(candidate) {
    // Read the existing title ledger and historical data without calling its mutating initializer.
    const titles=[...(Array.isArray(candidate?.careerTitles)?candidate.careerTitles:[])];
    // A newgen can share a historical champion's name without being that person.
    if(candidate&&!candidate.isNewgen&&typeof getHistoricalPlayerCareerTitles==='function')
        titles.push(...getHistoricalPlayerCareerTitles(candidate));
    return titles;
}
function newsTitleContext(candidate) {
    const titles=newsKnownTitles(candidate);
    return {worldTitles:titles.filter(t=>newsTournamentClass(t).world).reduce((n,t)=>n+(Number(t.count)||0),0),
        knownMajorTitles:titles.filter(t=>newsTournamentClass(t).major).reduce((n,t)=>n+(Number(t.count)||0),0),
        knownTitles:titles.reduce((n,t)=>n+(Number(t.count)||0),0)};
}
function consumeAiCareerNewsObservations() {
    if(typeof getAiCareerObservations!=='function')return [];
    const r=newsRoom(),published=[],roster=new Map(newsRoster().map(p=>[String(p.id),p]));
    const observations=getAiCareerObservations({afterEventId:r.careerCursor});
    for(const o of observations) {
        if(!o||typeof o.eventId!=='string')continue;r.careerCursor=o.eventId;
        if(!newsRemember('consumedCareerEventIds',o.eventId))continue;
        const stamp=typeof o.date==='number'?o.date:Date.parse(o.date);
        if(!Number.isFinite(stamp)||newsNow()-stamp>DARTS_NEWS_CONFIG.observationFreshDays*DARTS_NEWS_DAY||stamp>newsNow())continue;
        const person=newsPerson(o);if(!person)continue;
        const candidate=roster.get(String(o.playerId));
        // Explicit allowlist: never serialize raw career evidence or hidden attributes.
        const facts={actor:person,age:newsNumber(o.age),ovr:newsNumber(o.currentOvr),previousOvr:newsNumber(o.previousRelevantOvr),
            ranking:newsRank(o.currentRanking),previousRanking:newsRank(o.previousRelevantRanking),
            historicalPeak:{ovr:newsNumber(o.historicalPeak?.ovr),ranking:newsRank(o.historicalPeak?.ranking),year:newsNumber(o.historicalPeak?.year)},
            ...newsTitleContext(candidate),observationType:o.observationType,
            significance:['high','medium','low'].includes(o.significance)?o.significance:'medium',season:Number.isInteger(o.season)?o.season:new Date(stamp).getFullYear(),
            confirmations:Array.isArray(o.evidence?.confirmedResults)?o.evidence.confirmedResults.length:0,
            exceptionalSeason:newsNumber(o.evidence?.exceptionalSeason),exceptionalMajorTitles:newsNumber(o.evidence?.majorTitles)};
        const item=newsOffer(o.observationType,`career:${o.eventId}`,facts,{timestamp:stamp});if(item)published.push(item);
    }
    return published;
}
function recordNewsroomMatch(p1,p2,result,options={},key) {
    const t=options.tournament;if(!isWorldNewsSinglesEvent(t)||!newsRemember('matchKeys',key,DARTS_NEWS_CONFIG.matchKeyLimit))return;
    if(result.p1Score===result.p2Score)return;
    const first=result.p1Score>result.p2Score,w=first?p1:p2,l=first?p2:p1;
    const memory=newsTournamentMemory(t),round=Number(options.round??(typeof tournamentRound!=='undefined'?tournamentRound:0));
    const knockout=!/group|league|round.?robin/.test(String(options.phase||''))
        &&!(typeof isGrandSlamGroupStageActive==='function'&&isGrandSlamGroupStageActive(t))
        &&t.editorTeamState?.phase!=='groups'
        &&!(typeof isEditorSeasonLeague==='function'&&isEditorSeasonLeague(t)
            &&typeof editorLeagueStateView==='function'&&editorLeagueStateView()?.phase==='league');
    const ranks=newsCachedRanks();
    const wr=worldNewsRating(w),lr=worldNewsRating(l),gap=lr!==null&&wr!==null?lr-wr:0;
    const f={actor:newsPerson(w),opponent:newsPerson(l),tournament:memory.tournament,eventKey:memory.key,
        ranking:ranks.get(newsId(w))||null,opponentRank:ranks.get(newsId(l))||null,age:newsAge(w),ovr:wr,
        score:`${first?result.p1Score:result.p2Score}:${first?result.p2Score:result.p1Score}`,unit:options.format?.type==='sets'?'sets':'legs',stage:knockout?round:null,gap};
    if(typeof newsCollectCoverageMatch==='function')newsCollectCoverageMatch(memory,f,result,first,knockout);
    if(knockout&&round===2)memory.final=newsClone(f);
    if(gap>=12&&lr>=80&&memory.upsets<3){if(newsOffer('upset',`upset:${key}`,f))memory.upsets++;}
    if(knockout&&memory.tournament.world&&round>=4&&round<=16) {
        if((f.ranking===null||f.ranking>16||f.age!==null&&f.age<=23))newsOffer('world_run',`world-run:${memory.key}:${newsId(w)}:${round}`,{...f,stage:round/2,coverageStage:'reached',route:newsCoverageRoute(memory,newsId(w))});
    }
    if(knockout&&round<=4&&round>=2&&memory.tournament.major)newsRecordRivalry(f,key);
}
function newsRecordRivalry(f,key) {
    const r=newsRoom(),pair=[newsId(f.actor),newsId(f.opponent)].sort().join('|');let row=r.rivalries.find(v=>v.pair===pair);
    if(!row){row={pair,meetings:[],players:[f.actor,f.opponent]};r.rivalries.push(row);r.rivalries=r.rivalries.slice(-80);}
    row.meetings=row.meetings.filter(m=>newsNow()-m.date<3*365*DARTS_NEWS_DAY);
    const previous=row.meetings.at(-1);row.meetings.push({key,date:newsNow(),winner:newsId(f.actor),world:f.tournament.world,final:f.stage===2});
    row.meetings=row.meetings.slice(-12);
    const wins=row.meetings.filter(m=>m.winner===newsId(f.actor)).length,other=row.meetings.length-wins;
    if(row.meetings.length>=3&&wins>0&&other>0&&(row.meetings.filter(m=>m.final).length>=2||row.meetings.filter(m=>m.world).length>=2))
        newsOffer(previous?.winner===newsId(f.opponent)?'revenge':'rivalry',`rivalry:${key}`,
            {...f,meetings:row.meetings.length,h2hWins:wins,h2hLosses:other});
}
function recordNewsroomTournament(candidate,t,result) {
    if(!isWorldNewsSinglesEvent(t)||!newsPerson(candidate))return;
    const memory=newsTournamentMemory(t),person=newsPerson(candidate),p=newsPlayerMemory(person);
    if(!result.won&&(!memory.tournament.major||result.round>8))return;
    const rank=newsCachedRanks().get(newsId(person))||null;
    const f={actor:person,tournament:memory.tournament,eventKey:memory.key,age:newsAge(candidate),ovr:worldNewsRating(candidate),ranking:rank,
        stage:result.round,...newsTitleContext(candidate)};
    if(result.won) {
        if(memory.championId)return;
        memory.championId=newsId(person);memory.completed=true;
        f.ranking=newsStandings().find(row=>newsId(row.person)===newsId(person))?.rank||null;
        const s=newsSeason();s.titleCounts[newsId(person)]=(s.titleCounts[newsId(person)]||0)+1;
        p.titles++;p.recentTitles.push({date:newsNow(),major:memory.tournament.major});p.recentTitles=p.recentTitles.filter(e=>newsNow()-e.date<365*DARTS_NEWS_DAY).slice(-30);
        if(memory.tournament.major){p.majorWins++;s.majorChampions.push({person,tournament:memory.tournament.name,tournamentInfo:memory.tournament,date:newsNow()});s.majorChampions=s.majorChampions.slice(-40);}
        if(memory.tournament.world){p.worldTitles++;s.worldChampion=person;}
        const complete=candidate.isNewgen&&candidate.joinedSeason>=new Date(newsRoom().trackingSince).getFullYear();
        Object.assign(f,{...memory.final,actor:person,ranking:f.ranking,...newsTitleContext(candidate),prize:result.prizeMoney,
            majorTitles:s.majorChampions.filter(e=>newsId(e.person)===newsId(person)).length,recentTitles:p.recentTitles.length,
            firstTitle:!!complete&&f.knownTitles===1,firstMajor:!!complete&&f.knownMajorTitles===1,
            firstWorld:!!complete&&f.worldTitles===1});
        if(typeof newsChampionCoverage==='function')Object.assign(f,newsChampionCoverage(memory,candidate));
        newsOffer(memory.tournament.world?'world_result':'result',`champion:${memory.key}`,f);
        recordWorldNewsRankingChange(t);consumeAiCareerNewsObservations();
    } else if(memory.tournament.major&&result.round<=8) {
        p.recentRuns.push({date:newsNow(),round:result.round,tournament:memory.tournament.name});p.recentRuns=p.recentRuns.slice(-8);
        if(f.age!==null&&f.age<=23||memory.tournament.world&&(rank===null||rank>32))
            newsOffer(memory.tournament.world?'world_run':'deep_run',`run:${memory.key}:${newsId(person)}`,{...f,coverageStage:'finished',route:newsCoverageRoute(memory,newsId(person))});
    }
}
function recordNewsroomRanking(t=null,previous=null,next=null) {
    const r=newsRoom(),rows=newsStandings(),now=newsNow();
    worldNewsRankingCache.set(r,new Map(rows.map(row=>[newsId(row.person),row.rank])));
    if(next&&newsId(next)!==newsId(previous)) {
        const returning=r.no1History.includes(newsId(next));
        const f={actor:newsPerson(next),previous:newsPerson(previous),ranking:1,previousRanking:r.rankingBaseline?.find(p=>p.id===newsId(next))?.rank??null,
            amount:next.amount,returning,reignDays:Math.round((now-r.leaderSince)/DARTS_NEWS_DAY),age:rows[0]?.age??null,
            ...(t?{tournament:newsTournamentSnapshot(t),eventKey:newsEventKey(t)}:{})};
        const item=newsOffer('ranking',`leader:${now}:${newsId(next)}:${newsId(previous)}`,f);
        r.leaderSince=now;if(!returning)r.no1History.push(newsId(next));r.no1History=r.no1History.slice(-100);
        newsSeason().worldNo1s.push(newsPerson(next));newsSeason().worldNo1s=newsSeason().worldNo1s.slice(-50);
        newsCheckRankingMovers(rows,t);return item;
    }
    if(t||r.lastRankingCheck===null||now-r.lastRankingCheck>=DARTS_NEWS_CONFIG.rankingCheckDays*DARTS_NEWS_DAY)newsCheckRankingMovers(rows,t);
    return null;
}
function newsCheckRankingMovers(rows,t) {
    const r=newsRoom(),baseline=new Map((r.rankingBaseline||[]).map(row=>[row.id,row]));
    const rosterById=new Map(newsRoster().map(p=>[newsId(p),p]));
    for(const row of rows) {
        const id=newsId(row.person),old=baseline.get(id),p=newsPlayerMemory(row.person);
        if(!p.titleContextInitialized) {
            const context=newsTitleContext(rosterById.get(id));
            p.worldTitles=Math.max(p.worldTitles,context.worldTitles);p.majorWins=Math.max(p.majorWins,context.knownMajorTitles);
            p.titleContextInitialized=true;
        }
        const previous=p.bestRank,past=old?.rank;
        if(past&&[64,32,16,10].some(threshold=>row.rank<=threshold&&past>threshold)) {
            const milestone=[10,16,32,64].find(threshold=>row.rank<=threshold&&past>threshold);
            newsOffer('ranking_milestone',`milestone:${id}:${milestone}:${currentDate.getFullYear()}`,{actor:row.person,
                ranking:row.rank,previousRanking:past,age:row.age,ovr:row.ovr,milestone,returning:previous!==null&&previous<=milestone,
                firstRanking:rosterById.get(id)?.isNewgen===true&&rosterById.get(id).joinedSeason>=new Date(r.trackingSince).getFullYear()&&(previous===null||previous>milestone),
                ...(t?{tournament:newsTournamentSnapshot(t),eventKey:newsEventKey(t)}:{})});
        }
        if(past&&row.rank<=64&&past-row.rank>=15&&!newsSeason().candidates.climber)newsSeason().candidates.climber={person:row.person,score:past-row.rank,ranking:row.rank};
        p.previousRank=row.rank;p.bestRank=p.bestRank===null?row.rank:Math.min(p.bestRank,row.rank);
    }
    r.rankingBaseline=rows.map(row=>({id:newsId(row.person),rank:row.rank,money:row.money}));r.lastRankingCheck=newsNow();
    newsSeason().no1=rows[0]?.person||null;
    if(rows[0]&&newsNow()-r.leaderSince>=365*DARTS_NEWS_DAY)
        newsOffer('record',`no1-reign:${newsId(rows[0].person)}:${Math.floor((newsNow()-r.leaderSince)/(365*DARTS_NEWS_DAY))}`,
            {actor:rows[0].person,ranking:1,recordKind:'reign',reignDays:Math.floor((newsNow()-r.leaderSince)/DARTS_NEWS_DAY)});
    if(rows.length>=2&&rows[1].money/rows[0].money>=.93) {
        const month=`${currentDate.getFullYear()}:${currentDate.getMonth()}`;
        newsOffer('ranking_race',`no1-race:${month}`,{actor:rows[0].person,opponent:rows[1].person,ranking:1,
            amount:rows[0].money,gapMoney:rows[0].money-rows[1].money,challengers:rows.slice(1,4).filter(r=>r.money/rows[0].money>=.9).map(r=>r.person)});
    }
    const young=rows.slice(0,32).filter(row=>row.age!==null&&row.age<=23);
    if(young.length>=4)newsOffer('record',`generation:${currentDate.getFullYear()}`,{actor:young[0].person,
        recordKind:'generation',youngPlayers:young.map(r=>r.person),ranking:young[0].rank,age:young[0].age});
}
function recordWorldNewsPreview(t) {
    if(!t?.name)return null;const cls=newsTournamentClass(t);if(cls.qualifier||!cls.major)return null;
    const key=`preview:${newsEventKey(t)}`;
    // The daily pre-event window and start hook refer to the same preview.
    // Reject it before any historical lookup, not only at publication time.
    if(newsRoom().consumedKeys.includes(key))return null;
    const rows=newsStandings(),defender=newsRoom().seasons.filter(s=>s.year<currentDate.getFullYear()).at(-1);
    let champion=cls.world?defender?.worldChampion:defender?.majorChampions?.filter(c=>c.tournament===t.name).at(-1)?.person;
    // A retired champion remains part of history, but is no longer a defender.
    if(champion){const active=newsRoster().find(p=>String(p.id)===champion.id);champion=active?newsPerson(active):null;}
    if(!champion) {
        const previousYear=currentDate.getFullYear()-1;
        const matches=newsRoster().filter(p=>newsKnownTitles(p).some(title=>
            (cls.world?newsTournamentClass(title).world:(title.sourceName||title.name)===(t.sourceName||t.name))
            &&(Number(title.winsByYear?.[previousYear])>0||Number(title.lastWonAt)>0&&new Date(title.lastWonAt).getFullYear()===previousYear)));
        // Ambiguous or incomplete history does not justify naming a defender.
        if(matches.length===1)champion=newsPerson(matches[0]);
    }
    const actor=champion||rows[0]?.person;if(!actor)return null;
    return newsOffer(cls.world?'world_preview':'preview',key,{actor,opponent:rows[1]?.person||null,
        defending:!!champion,tournament:newsTournamentSnapshot(t),eventKey:newsEventKey(t),ranking:rows.find(r=>newsId(r.person)===newsId(actor))?.rank||null,
        ...(typeof newsPreviewCoverage==='function'?newsPreviewCoverage(t,champion,rows):{})});
}
function recordWorldNewsRetirements(retirements,year) {
    for(const retired of retirements||[]) {
        const person=newsPerson(retired);if(!person)continue;
        const p=newsRoom().people[newsId(person)];
        newsOffer('retirement',`retirement:${newsId(person)}:${year}`,{actor:person,age:newsNumber(retired.age),ovr:newsNumber(retired.ovr),
            ranking:newsRank(retired.rank),historicalPeak:{ranking:p?.bestRank??null},
            worldTitles:p?.worldTitles||0,majorTitles:p?.majorWins||0});
        newsRoom().storylines.filter(s=>s.players.some(p=>newsId(p)===newsId(person))).forEach(s=>s.status='COMPLETED');
    }
}
function recordWorldNewsSeasonReview(year,archive=null,summaries=[]) {
    const r=newsRoom();if(r.annualReviews.includes(year))return null;
    r.annualReviews.push(year);r.annualReviews=r.annualReviews.slice(-DARTS_NEWS_CONFIG.seasonLimit);
    const season=newsSeason(year);season.reviewed=true;
    const no1=season.no1||newsStandings()[0]?.person,champion=season.worldChampion;
    const dominant=Object.entries(season.titleCounts).sort((a,b)=>b[1]-a[1])[0];
    const dominantPerson=dominant?r.people[dominant[0]]?.person:null;
    const actor=champion||no1||dominantPerson;if(!actor)return null;
    const highlights=Object.entries(season.candidates).filter(([,c])=>c.score>=72).map(([kind,c])=>({kind,person:c.person}));
    if(archive?.awards?.available&&archive.awards.playerYear?.person)highlights.unshift({kind:'playerYear',person:newsPerson(archive.awards.playerYear.person)});
    if(summaries.length&& !highlights.some(h=>h.kind==='decline')) {
        const decline=summaries.filter(s=>s.growth<=-5&&s.rank&&s.rank<=64).sort((a,b)=>a.growth-b.growth)[0];
        if(decline)highlights.push({kind:'decline',person:newsPerson(decline.person)});
    }
    return newsOffer('season_review',`season-review:${year}`,{actor,year,champion,no1,
        majorWinners:[...new Map(season.majorChampions.map(c=>[newsId(c.person),c.person])).values()].slice(0,6),
        highlights:highlights.slice(0,4),dominant:dominant&&dominant[1]>=3?{person:dominantPerson,titles:dominant[1]}:null});
}
function processWorldNewsDaily() {
    const r=newsRoom();if(r.lastDaily===newsNow())return;
    r.lastDaily=newsNow();consumeAiCareerNewsObservations();newsCoolStorylines();newsFlushCandidates();
    if(typeof tournamentDatabase!=='undefined') {
        const upcoming=tournamentDatabase.filter(t=>!t.completed&&!newsTournamentClass(t).qualifier).map(t=>({t,date:new Date(currentDate.getFullYear(),t.month,t.day).getTime()}))
            .filter(e=>e.date>=newsNow()&&e.date-newsNow()<=7*DARTS_NEWS_DAY&&newsTournamentClass(e.t).major).sort((a,b)=>a.date-b.date)[0];
        if(upcoming)recordWorldNewsPreview(upcoming.t);
    }
    if(currentDate.getDate()===1&&[2,5,8].includes(currentDate.getMonth())) {
        const rows=newsStandings(),ids=new Map(rows.map(r=>[newsId(r.person),r]));
        const watch=Object.values(r.people).map(p=>({p,row:ids.get(newsId(p.person)),runs:p.recentRuns.filter(e=>newsNow()-e.date<90*DARTS_NEWS_DAY).length,
            titles:p.recentTitles.filter(e=>newsNow()-e.date<90*DARTS_NEWS_DAY).length})).filter(e=>e.row&&(e.runs>=2||e.titles>=2))
            .sort((a,b)=>(b.titles*3+b.runs)-(a.titles*3+a.runs)).slice(0,3);
        if(watch.length)newsOffer('players_watch',`watch:${currentDate.getFullYear()}:${currentDate.getMonth()}`,
            {actor:watch[0].p.person,ranking:watch[0].row.rank,watch:watch.map(e=>({person:e.p.person,titles:e.titles,runs:e.runs,ranking:e.row.rank}))});
    }
}
function getDartsWorldNewsDebug() {
    const r=newsRoom();return newsClone({candidates:r.candidates,decisions:r.decisions,
        storylines:r.storylines,careerCursor:r.careerCursor,consumedCareerEventIds:r.consumedCareerEventIds,
        recentTemplateUsage:r.recentTemplateUsage,budget:r.week,configVersion:r.configVersion,publicationCounts:r.publicationCounts||{},
        latestArticles:initWorldNews().entries.slice(0,20).map(a=>({id:a.id,topic:a.topic,primaryCategory:a.primaryCategory,tags:a.tags,
            canonicalKey:a.canonicalKey,depth:a.depth,editorial:a.editorial}))});
}
