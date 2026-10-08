// Compact accepted-match snapshots for editorial use. No bracket or player writes.
function newsCoverageRoute(memory,id) {
    return (memory.matches||[]).filter(m=>newsId(m.winner)===id)
        .sort((a,b)=>b.round-a.round).slice(-DARTS_NEWS_CONFIG.articleRouteLimit)
        .map(m=>({opponent:m.loser,round:m.round,score:m.score,unit:m.unit,opponentRank:m.opponentRank}));
}
function newsCoverageStats(result,first) {
    // Exact accepted result only. Approximate simulation stats stay out of journalism.
    const detail=first?result.p1Stats:result.p2Stats,avg=first?result.p1Avg:result.p2Avg;
    if(!detail||detail.source!=='measured'||detail.approximate===true||detail.estimated===true)return null;
    const stats={};
    if(Number.isFinite(avg)&&avg>0)stats.average=Number(avg.toFixed(2));
    if(Number.isInteger(detail.oneEighties)&&detail.oneEighties>=0)stats.oneEighties=detail.oneEighties;
    if(Number.isFinite(detail.highCheckout)&&detail.highCheckout>0)stats.highCheckout=detail.highCheckout;
    return Object.keys(stats).length?stats:null;
}
function newsCollectCoverageMatch(memory,f,result,first,knockout) {
    if(!memory.tournament.major||!knockout||!Number.isInteger(f.stage)||f.stage<2)return;
    const row={winner:f.actor,loser:f.opponent,round:f.stage,score:f.score,unit:f.unit,
        ranking:f.ranking,opponentRank:f.opponentRank};
    memory.matches=memory.matches||[];
    memory.matches.push(row);memory.matches=memory.matches.slice(-DARTS_NEWS_CONFIG.coverageMatchLimit);
    const stats=newsCoverageStats(result,first);if(stats)f.matchStats=stats;
    if(f.stage===2)memory.final=newsClone(f);
    if(f.stage===4) {
        memory.finalists=memory.finalists||[];
        if(!memory.finalists.some(p=>newsId(p.person)===newsId(f.actor)))
            memory.finalists.push({person:f.actor,ranking:f.ranking,age:f.age});
        if(memory.finalists.length===2) {
            const [a,b]=memory.finalists;
            const rival=newsRoom().rivalries.find(r=>r.pair===[newsId(a.person),newsId(b.person)].sort().join('|'));
            newsOffer('final_preview',`final-preview:${memory.key}`,{actor:a.person,opponent:b.person,
                tournament:memory.tournament,eventKey:memory.key,stage:2,age:a.age,ranking:a.ranking,opponentRank:b.ranking,
                route:newsCoverageRoute(memory,newsId(a.person)),opponentRoute:newsCoverageRoute(memory,newsId(b.person)),
                ...(rival&&rival.meetings.length>=2?{meetings:rival.meetings.length,h2hWins:rival.meetings.filter(m=>m.winner===newsId(a.person)).length,
                    h2hLosses:rival.meetings.filter(m=>m.winner===newsId(b.person)).length}:{}),
                ...newsTitleContext(newsRoster().find(p=>String(p.id)===a.person.id))});
        }
    }
    // Only recent coverage needs full match snapshots; articles retain their own routes.
    const recent=newsRoom().tournaments.filter(t=>t.matches?.length).slice(-DARTS_NEWS_CONFIG.coverageHistoryEvents);
    for(const old of newsRoom().tournaments)if(old.matches&&!recent.includes(old))delete old.matches;
}
function newsChampionCoverage(memory,candidate) {
    const final=memory.final;
    const titles=new Map();
    for(const t of newsKnownTitles(candidate).filter(t=>newsTournamentClass(t).major)) {
        const key=t.sourceName||t.name,row=titles.get(key)||{name:String(t.name),count:0,years:[]};
        row.count+=Number(t.count)||1;row.years=[...new Set([...row.years,...Object.keys(t.winsByYear||{}).filter(y=>/^\d{4}$/.test(y)).map(Number)])].sort((a,b)=>a-b).slice(-5);titles.set(key,row);
    }
    const history=[...titles.values()].slice(-8);
    const pair=final?[newsId(candidate),newsId(final.opponent)].sort().join('|'):null;
    const rival=pair?newsRoom().rivalries.find(r=>r.pair===pair):null;
    const preview=[...initWorldNews().entries,...newsRoom().archive].find(a=>a.canonicalKey===memory.key+':preview');
    return {route:newsCoverageRoute(memory,newsId(candidate)),opponentRoute:final?newsCoverageRoute(memory,newsId(final.opponent)):[],
        winnerRankBefore:final?.ranking||null,runnerRank:final?.opponentRank||null,titleHistory:history,
        ...(preview?.data.facts.defender?{defender:preview.data.facts.defender}:{}),
        ...(rival?.meetings.length>=2?{meetings:rival.meetings.length,h2hWins:rival.meetings.filter(m=>m.winner===newsId(candidate)).length,
            h2hLosses:rival.meetings.filter(m=>m.winner!==newsId(candidate)).length}:{})};
}
function newsPreviewCoverage(t,champion,rows) {
    const room=newsRoom(),season=newsSeason(),known=new Map(rows.map(r=>[newsId(r.person),r]));
    const recent=Object.values(room.people).map(p=>({person:p.person,ranking:known.get(newsId(p.person))?.rank||null,
        titles:p.recentTitles.filter(e=>newsNow()-e.date<=90*DARTS_NEWS_DAY).length,
        runs:p.recentRuns.filter(e=>newsNow()-e.date<=90*DARTS_NEWS_DAY).length}))
        .filter(p=>p.ranking&&(p.titles>=2||p.runs>=2)).sort((a,b)=>(b.titles*3+b.runs)-(a.titles*3+a.runs)).slice(0,3);
    const story=room.storylines.filter(s=>s.status==='ACTIVE'&&s.importance>=72&&s.stage>=2).sort((a,b)=>b.importance-a.importance).slice(0,2);
    return {defender:champion||null,previewContext:{rankingLeaders:rows.slice(0,3).map(r=>({person:r.person,rank:r.rank})),
        recentChampions:season.majorChampions.slice(-4).map(c=>({person:c.person,tournament:c.tournament})),
        recent,storylines:story.map(s=>({person:s.players[0],type:s.type,tournament:s.headlineContext.tournament,ranking:s.headlineContext.ranking})),
        young:rows.filter(r=>r.age!==null&&r.age<=23&&r.rank<=32).slice(0,2).map(r=>({person:r.person,age:r.age,rank:r.rank}))}};
}
function newsSanitizeCoverageFacts(f) {
    const route=value=>(Array.isArray(value)?value:[]).filter(r=>r?.opponent?.name&&Number.isInteger(r.round)&&r.round>=2
        &&typeof r.score==='string'&&/^\d+[:–-]\d+$/.test(r.score)).slice(-DARTS_NEWS_CONFIG.articleRouteLimit)
        .map(r=>({opponent:newsPerson(r.opponent),round:r.round,score:r.score,unit:r.unit==='sets'?'sets':'legs',opponentRank:newsRank(r.opponentRank)}));
    if(f.route)f.route=route(f.route);if(f.opponentRoute)f.opponentRoute=route(f.opponentRoute);
    if(f.titleHistory)f.titleHistory=f.titleHistory.filter(t=>t&&typeof t.name==='string').slice(-8)
        .map(t=>({name:t.name.slice(0,150),count:Math.max(1,Math.min(999,Number(t.count)||1)),years:(t.years||[]).filter(Number.isInteger).slice(-5)}));
    if(f.defender)f.defender=newsPerson(f.defender);
    if(f.matchStats){const clean={};for(const k of ['average','oneEighties','highCheckout'])if(Number.isFinite(f.matchStats[k]))clean[k]=f.matchStats[k];f.matchStats=clean;}
    if(f.previewContext) {
        const c=f.previewContext;
        f.previewContext={rankingLeaders:(c.rankingLeaders||[]).slice(0,3).map(r=>({person:newsPerson(r.person),rank:newsRank(r.rank)})),
            recentChampions:(c.recentChampions||[]).slice(-4).map(r=>({person:newsPerson(r.person),tournament:String(r.tournament||'').slice(0,150)})),
            recent:(c.recent||[]).slice(0,3).map(r=>({person:newsPerson(r.person),ranking:newsRank(r.ranking),titles:Number(r.titles)||0,runs:Number(r.runs)||0})),
            young:(c.young||[]).slice(0,2).map(r=>({person:newsPerson(r.person),rank:newsRank(r.rank),age:newsNumber(r.age)})),
            storylines:(c.storylines||[]).slice(0,2).map(r=>({person:newsPerson(r.person),type:String(r.type||''),tournament:String(r.tournament||'').slice(0,150),ranking:newsRank(r.ranking)}))};
    }
}
