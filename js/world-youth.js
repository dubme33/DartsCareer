// Annual Youth championship state contains stable keys only. Matches, manual
// play, watching, knockout progression and save transactions use game engines.
const WORLD_YOUTH_PRIZES = Object.freeze({winner:15000,2:7000,4:3400,8:2000,16:1500,32:800,64:600,groupThird:400,groupFourth:200});
const WORLD_YOUTH_SEED_ORDER = Object.freeze([1,32,16,17,8,25,9,24,4,29,13,20,5,28,12,21,2,31,15,18,7,26,10,23,3,30,14,19,6,27,11,22]);

function isWorldYouthTournament(event) {
    if(typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(event))return false;
    if (typeof event === 'string') {
        const stored=typeof tournamentDatabase!=='undefined'?tournamentDatabase.find(t=>t.name===event||t.sourceName===event):null;
        if(stored) return stored.specialType==='worldYouth';
        return /(?:world youth championship|młodzieżowe mistrzostwa świata|future stars championship)/i.test(event);
    }
    return event?.specialType==='worldYouth';
}
function worldYouthKey(p){return p&&!p.isBye?String(p.id||`${p.name}|${p.country}`):null;}
function getWorldYouthPlayers(){return typeof getPdcTourCardPlayers==='function'?getPdcTourCardPlayers(true):[...pdcPlayers,player].filter(Boolean);}
function getWorldYouthEdition(year=currentDate.getFullYear(),create=false){
    if(!player) return null;
    if(create) player.worldYouthEditions ||= {};
    return player.worldYouthEditions?.[year] || null;
}
function worldYouthResolve(key){return key?getWorldYouthPlayers().find(p=>worldYouthKey(p)===key)||createMissingTournamentSlot():createMissingTournamentSlot();}
function getWorldYouthBirthDate(p,date=currentDate){
    if(typeof getWomensAgeBirthContext==='function')p=getWomensAgeBirthContext(p,date);
    const text=typeof p?.birthDate==='string'?p.birthDate:typeof p?.dateOfBirth==='string'?p.dateOfBirth:'';
    const parts=/^(\d{4})-(\d{2})-(\d{2})/.exec(text);
    // The existing editor/mod field is birthYear. A changed year must not be
    // silently overridden by an older precise date attached to the profile.
    if(parts&&p.birthYear!=null&&Number.isInteger(Number(p.birthYear))&&Number(p.birthYear)!==+parts[1])return null;
    if(parts){const d=new Date(+parts[1],+parts[2]-1,+parts[3]); if(d.getFullYear()===+parts[1]&&d.getMonth()===+parts[2]-1&&d.getDate()===+parts[3])return d;}
    return null;
}
function worldYouthAge(p,date){
    const context=typeof getWomensAgeBirthContext==='function'?getWomensAgeBirthContext(p,date):p;
    const birth=getWorldYouthBirthDate(p,date);
    if(birth)return date.getFullYear()-birth.getFullYear()-(date.getMonth()<birth.getMonth()||date.getMonth()===birth.getMonth()&&date.getDate()<birth.getDate()?1:0);
    return Number.isInteger(Number(context?.birthYear))&&Number(context.birthYear)>1900?date.getFullYear()-Number(context.birthYear):null;
}
function isWorldYouthEligible(p,date=currentDate){
    if(!p||p.isBye||p.isWorldCupGuest||!p.name)return false;
    if(typeof isRetiredPlayer==='function'&&isRetiredPlayer(p))return false;
    if(typeof isPlayerInjured==='function'&&isPlayerInjured(p))return false;
    const age=worldYouthAge(p,new Date(date.getFullYear(),0,4)),now=worldYouthAge(p,date);
    return age!==null&&age<=23&&now>=16;
}
function hasWorldYouthCalendar(year=currentDate.getFullYear()){
    return Array.isArray(tournamentDatabase)&&tournamentDatabase.some(t=>isWorldYouthTournament(t)&&t.worldYouthPhase==='main'&&!t.editorDisabled);
}
function ensureWorldYouthCalendar(calendar=tournamentDatabase,date=currentDate,{migration=false}={}){
    if (typeof applyCompetitionCalendarNames === 'function') applyCompetitionCalendarNames(calendar);
    if(!Array.isArray(calendar)||!player)return false;
    const native=calendar.some(t=>t.specialType==='developmentTour');
    let main=calendar.find(t=>isWorldYouthTournament(t)&&t.worldYouthPhase==='main');
    if(!main&&!player.worldYouthCalendarInitialized&&native){
        main={name:typeof competitionName==='function'?competitionName('worldYouth'):'Future Stars Championship',sourceName:'World Youth Championship',specialType:'worldYouth',worldYouthPhase:'main',month:9,day:5,
            format:'legs',rankingOverride:false,minOvr:0,city:'Wigan',country:'Anglia'};
        calendar.push(main,{...main,name:`${typeof competitionName==='function'?competitionName('worldYouth'):'Future Stars Championship'} Final`,worldYouthPhase:'final',month:10,day:29,city:'Minehead'});
    }
    player.worldYouthCalendarInitialized=true;
    if(!main)return false;
    calendar.filter(isWorldYouthTournament).forEach(t=>t.rankingOverride=false);
    // Both old calendar versions migrate only future, unplayed default events.
    // Same-day queue already supports the two events on Oct 3 and Oct 4.
    for(const [n,oldMonth,oldDay,month,day] of [[21,8,16,9,3],[22,8,21,9,3],[23,9,19,9,4],[24,9,20,9,4],
        [21,7,19,9,3],[22,8,15,9,3],[23,8,16,9,4],[24,8,21,9,4]]){
        const t=calendar.find(e=>e.specialType==='developmentTour'&&e.developmentTourEvent===n);
        const active=typeof activeTournament!=='undefined'&&activeTournament?.specialType==='developmentTour'&&activeTournament.developmentTourEvent===n;
        if(t&&!t.completed&&!active&&t.month===oldMonth&&t.day===oldDay&&!t.editorModified
            &&date<=new Date(date.getFullYear(),month,day)){t.month=month;t.day=day;}
    }
    const edition=getWorldYouthEdition(date.getFullYear());
    const scheduled=new Date(date.getFullYear(),main.month,main.day);
    if(migration&&!edition&&date>scheduled){
        player.worldYouthEditions ||= {};
        player.worldYouthEditions[date.getFullYear()]={version:1,year:date.getFullYear(),phase:'skipped',diagnostics:['migration-after-main-date'],prizes:{}};
        calendar.filter(isWorldYouthTournament).forEach(t=>t.completed=true);
    }
    const final=calendar.find(t=>isWorldYouthTournament(t)&&t.worldYouthPhase==='final');
    if(final&&!final.editorModified&&!final.completed&&!['final','completed'].includes(edition?.phase)){
        const pc=calendar.find(t=>!t.editorDisabled&&/^(?:Pro Players Finals|(?:PDC )?Players Championship Finals)$/i.test(t.sourceName||t.name));
        if(pc&&date<=new Date(date.getFullYear(),pc.endMonth??pc.month,pc.endDay??pc.day)){
            final.month=pc.endMonth??pc.month;final.day=pc.endDay??pc.day;final.city=pc.city||'Minehead';final.country=pc.country||final.country;
            if(edition)edition.finalDate=new Date(date.getFullYear(),final.month,final.day).getTime();
        }
    }
    return true;
}
function createWorldYouthEdition(event=activeTournament,candidates=getWorldYouthPlayers(),date=currentDate){
    const year=date.getFullYear(),existing=getWorldYouthEdition(year);if(existing)return existing;
    const dtEvents=tournamentDatabase.filter(t=>t.specialType==='developmentTour'&&!t.editorDisabled);
    if(dtEvents.some(t=>!t.completed))throw new Error(worldYouthText('dtPending'));
    const eligible=candidates.filter(p=>isWorldYouthEligible(p,date));
    const dt=typeof getDevelopmentTourOrderOfMerit==='function'?getDevelopmentTourOrderOfMerit(eligible,{includeZero:false}):eligible.filter(p=>p.developmentTourPrizeMoney>0).sort((a,b)=>b.developmentTourPrizeMoney-a.developmentTourPrizeMoney);
    const oom=[...eligible].sort((a,b)=>typeof compareWorldChampionshipOom==='function'?compareWorldChampionshipOom(a,b)
        :(Number(b.prizeMoney)||0)-(Number(a.prizeMoney)||0)||worldYouthKey(a).localeCompare(worldYouthKey(b)));
    const selected=[],routes={},keys=new Set();
    const add=(p,route)=>{const key=worldYouthKey(p);if(key&&!keys.has(key)&&selected.length<128){keys.add(key);selected.push(p);routes[key]=route;}};
    oom.filter(p=>typeof hasPdcTourCardForYear==='function'?hasPdcTourCardForYear(p,year):p.hasTourCard).forEach(p=>add(p,'tourCard'));
    // Transparent database invitations, never invented regional qualifier results.
    const dtKeys=new Set(dt.map(worldYouthKey));
    const requested=Array.isArray(event.worldYouthInvitePlayerIds)?event.worldYouthInvitePlayerIds:[];
    const invites=requested.length?requested.map(k=>eligible.find(p=>worldYouthKey(p)===String(k))).filter(Boolean)
        :oom.filter(p=>!keys.has(worldYouthKey(p))&&!dtKeys.has(worldYouthKey(p)));
    invites.slice(0,32).forEach(p=>add(p,'invitation'));
    dt.forEach(p=>add(p,'developmentTour'));
    const positive=oom.filter(p=>keys.has(worldYouthKey(p))&&(Number(p.prizeMoney)||0)>0);
    const seeds=[...positive,...dt.filter(p=>keys.has(worldYouthKey(p))&&!positive.includes(p)),...selected.filter(p=>!positive.includes(p)&&!dt.includes(p))].slice(0,32);
    const unseeded=selected.filter(p=>!seeds.includes(p));
    for(let i=unseeded.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[unseeded[i],unseeded[j]]=[unseeded[j],unseeded[i]];}
    const groups=WORLD_YOUTH_SEED_ORDER.map((seed,index)=>({label:String.fromCharCode(65+Math.floor(index/26))+String.fromCharCode(65+index%26),
        members:[worldYouthKey(seeds[seed-1]),null,null,null],seedRanks:[seed,99,99,99],matches:createRoundRobinMatches(4)}));
    // Distribute BYEs across groups, keeping a second actual participant where possible.
    for(let slot=1;slot<4;slot++)for(let i=0;i<32;i++)groups[i].members[slot]=worldYouthKey(unseeded.shift());
    const edition={version:1,year,phase:'groups',mainDate:new Date(year,event.month,event.day).getTime(),
        finalDate:new Date(year,10,29).getTime(),participants:selected.map(worldYouthKey),identities:Object.fromEntries(selected.map(p=>[worldYouthKey(p),{name:p.name,country:p.country,templateIndex:typeof getLifecycleTemplateIndex==='function'?getLifecycleTemplateIndex(p):null}])),
        routes,seeds:seeds.map(worldYouthKey),developmentSnapshot:dt.map(p=>({key:worldYouthKey(p),money:Number(p.developmentTourPrizeMoney)||0})),
        developmentCompleted:dtEvents.filter(t=>t.completed).length,groups,rounds:{},prizes:{},diagnostics:[]};
    const final=tournamentDatabase.find(t=>isWorldYouthTournament(t)&&t.worldYouthPhase==='final');
    if(final)edition.finalDate=new Date(year,final.month,final.day).getTime();
    if(selected.length<128)edition.diagnostics.push(`field-shortfall:${128-selected.length}`);
    if(selected.some(p=>!getWorldYouthBirthDate(p)))edition.diagnostics.push('birth-year-fallback');
    if(!tournamentDatabase.some(t=>/players championship finals|pro players finals/i.test(t.sourceName||t.name)))edition.diagnostics.push('final-date-fallback');
    player.worldYouthEditions ||= {};player.worldYouthEditions[year]=edition;event.worldYouthYear=year;
    recordWorldYouthNews('field',edition,event);return edition;
}
function getWorldYouthGroupStandings(group){
    const rows=getRoundRobinStandings(group);
    const compare=(a,b)=>b.wins-a.wins||(b.legsWon-b.legsLost)-(a.legsWon-a.legsLost)||b.legsWon-a.legsWon;
    rows.sort((a,b)=>compare(a,b)||Number(Boolean(group.members[b.memberIndex]))-Number(Boolean(group.members[a.memberIndex]))||a.memberIndex-b.memberIndex);
    // Exact statistical ties are resolved on the board, never by OOM or seed.
    const allPlayed=group.matches.every(m=>m.played);
    if(allPlayed)for(let start=0;start<rows.length;){
        let end=start+1;while(end<rows.length&&compare(rows[start],rows[end])===0)end++;
        const tied=rows.slice(start,end).filter(row=>group.members[row.memberIndex]);
        if(tied.length>1){
            const indices=tied.map(r=>r.memberIndex).sort((a,b)=>String(group.members[a]).localeCompare(String(group.members[b])));
            const tieKey=indices.join(',');group.tieBreaks ||= {};
            if(!group.tieBreaks[tieKey]){
                if(tied.length===2){
                    const head=group.matches.find(m=>indices.includes(m.p1Index)&&indices.includes(m.p2Index));
                    group.tieBreaks[tieKey]={order:[head.winnerIndex,...indices.filter(i=>i!==head.winnerIndex)],matches:[]};
                }else{
                    const losers=[],matches=[];let survivor=indices[0];
                    for(const challenger of indices.slice(1)){
                        const p1=worldYouthResolve(group.members[survivor]),p2=worldYouthResolve(group.members[challenger]);
                        const result=simulateAImatch(p1,p2,{type:'legs',legsToWin:5});
                        const winner=result.winner===p1?survivor:challenger;
                        losers.unshift(winner===survivor?challenger:survivor);matches.push({p1Index:survivor,p2Index:challenger,score1:result.p1Score,score2:result.p2Score,winnerIndex:winner});survivor=winner;
                    }
                    group.tieBreaks[tieKey]={order:[survivor,...losers],matches,fallback:'FT5-playoff'};
                }
            }
            const order=group.tieBreaks[tieKey].order;
            rows.splice(start,end-start,...rows.slice(start,end).sort((a,b)=>(order.indexOf(a.memberIndex)<0?99:order.indexOf(a.memberIndex))-(order.indexOf(b.memberIndex)<0?99:order.indexOf(b.memberIndex))));
        }start=end;
    }
    return rows.map(row=>({...row,difference:row.legsWon-row.legsLost,average:row.darts?3*row.scored/row.darts:null}));
}
function recordWorldYouthGroupMatch(groupIndex,matchIndex,p1Won,score1,score2,raw=null){
    const edition=getWorldYouthEdition();if(edition?.phase!=='groups')return false;
    return recordRoundRobinMatch(edition.groups[groupIndex],matchIndex,p1Won,score1,score2,raw);
}
function* iterateWorldYouthGroups(includeCareer=false){
    const edition=getWorldYouthEdition();if(edition?.phase!=='groups')return;
    for(let gi=0;gi<edition.groups.length;gi++)for(let mi=0;mi<edition.groups[gi].matches.length;mi++){
        const group=edition.groups[gi],match=group.matches[mi];if(match.played)continue;
        const p1=worldYouthResolve(group.members[match.p1Index]),p2=worldYouthResolve(group.members[match.p2Index]);
        if(!includeCareer&&(isCurrentPlayer(p1)||isCurrentPlayer(p2)))continue;
        const result=simulateAImatch(p1,p2,{type:'legs',legsToWin:5});
        recordWorldYouthGroupMatch(gi,mi,result.winner===p1,result.p1Score,result.p2Score,result);yield;
    }
    if(edition.groups.every(g=>g.matches.every(m=>m.played)))completeWorldYouthGroups();
}
function completeWorldYouthGroups(){
    const edition=getWorldYouthEdition();if(edition?.phase!=='groups'||!edition.groups.every(g=>g.matches.every(m=>m.played)))return false;
    const positions=edition.groups.map(getWorldYouthGroupStandings);
    edition.groups.forEach((group,index)=>positions[index].slice(2).forEach((row,i)=>{
        const p=worldYouthResolve(group.members[row.memberIndex]);if(p.isBye)return;
        const prize=getWorldYouthPrize(i===0?'groupThird':'groupFourth',activeTournament);
        awardPrizeMoney(p,prize,activeTournament.name,{countTowardsRankings:false});
        recordSeasonTournamentResult(p,activeTournament,{round:128,stage:i===0?'groupThird':'groupFourth',prizeMoney:prize,countTowardsRankings:false});
    }));
    const member=(index,position)=>edition.groups[index].members[positions[index][position].memberIndex];
    const bracket=[];
    for(const half of [0,16])for(let i=0;i<16;i+=2){const a=half+i,b=(half+16)%32+i;
        bracket.push(member(a,0),member(b+1,1),member(b,1),member(a+1,0));}
    edition.phase='knockout';edition.knockoutKeys=bracket;edition.currentKeys=bracket;edition.currentRound=64;
    tournamentBracket=bracket.map(worldYouthResolve);tournamentRound=64;return true;
}
function getWorldYouthPrize(key,event=activeTournament){
    const main=tournamentDatabase.find(t=>isWorldYouthTournament(t)&&t.worldYouthPhase==='main');
    const custom=main?.editorPrizes?.[key]??event?.editorPrizes?.[key];
    return Number.isFinite(custom)&&custom>=0?custom:WORLD_YOUTH_PRIZES[key]||0;
}
function claimWorldYouthPrize(p,amount,event){
    if(!p||p.isBye)return false;
    const edition=getWorldYouthEdition();const key=worldYouthKey(p);
    if(edition){if(edition.prizes[key])return false;edition.prizes[key]={amount,at:currentDate.getTime()};}
    p.worldYouthPrizeEarnings=(Number(p.worldYouthPrizeEarnings)||0)+amount;return true;
}
function recordWorldYouthKnockoutMatch(event,round,p1,p2,result){
    if(!isWorldYouthTournament(event))return;
    const edition=getWorldYouthEdition();if(!edition)return;
    edition.rounds[round] ||= [];
    const first=worldYouthKey(p1),second=worldYouthKey(p2);
    const slot=Math.floor(tournamentBracket.indexOf(p1)/2);
    if(edition.rounds[round].some(m=>m.slot===slot))return;
    edition.rounds[round].push({slot,p1:first,p2:second,winner:worldYouthKey(result.winner),score1:result.p1Score,score2:result.p2Score,walkover:result.walkover===true,
        average1:Number(result.p1Avg)||null,average2:Number(result.p2Avg)||null});
}
function advanceWorldYouthStage(){
    const edition=getWorldYouthEdition();if(!edition)return null;
    edition.currentKeys=tournamentBracket.map(worldYouthKey);edition.currentRound=tournamentRound;
    if(activeTournament.worldYouthPhase==='main'&&tournamentBracket.length<=2){
        edition.finalists=edition.currentKeys.filter(Boolean);edition.phase='awaitingFinal';edition.grandSlamYear=edition.year;
        recordWorldYouthNews('finalists',edition,activeTournament);
        if(edition.finalists.length!==2)edition.diagnostics.push('finalist-shortfall');return 'worldYouth';
    }
    if(activeTournament.worldYouthPhase==='final'&&tournamentBracket.length<=1){
        edition.champion=edition.currentKeys[0]||null;edition.phase='completed';return 'worldYouth';
    }return null;
}
function concludeWorldYouthEvent(){
    const event=activeTournament,edition=getWorldYouthEdition();if(!event||!edition)return false;
    if(edition.phase==='completed'&&!edition.titleRecorded){
        const champion=worldYouthResolve(edition.champion),runnerKey=edition.finalists?.find(k=>k!==edition.champion),runner=worldYouthResolve(runnerKey);
        if(!champion.isBye){
            const canonical={...event,name:'World Youth Championship',sourceName:'World Youth Championship',worldYouthPhase:'main',rankingOverride:false};
            const prize=getWorldYouthPrize('winner',canonical);awardPrizeMoney(champion,prize,event.name,{countTowardsRankings:false});
            recordSeasonTournamentResult(champion,canonical,{round:2,won:true,prizeMoney:prize,countTowardsRankings:false});
            champion.worldYouthTitles ||= [];if(!champion.worldYouthTitles.some(t=>t.year===edition.year))champion.worldYouthTitles.push({year:edition.year,opponent:runnerKey,score:edition.rounds[2]?.[0]||null,prize});
            if(isCurrentPlayer(champion)){
                if(typeof initCareerStats==='function')initCareerStats();player.careerStats.trophies ||= [];player.careerStats.trophies.push(canonical.name);
                if(typeof addCareerChronicleEvent==='function')addCareerChronicleEvent('trophy',{tournament:canonical.name,prize,youth:true,year:edition.year});
            }
            edition.seniorWorldYear=edition.year;edition.titleRecorded=true;
            scheduleWorldYouthReplacementQualifier(edition);
        }
        if(!runner.isBye&&!edition.prizes[runnerKey])awardPrizeMoney(runner,getWorldYouthPrize(2,event),event.name,{countTowardsRankings:false});
    }
    event.completed=true;
    if(typeof finalizeTournamentMatchHistory==='function')finalizeTournamentMatchHistory(event);
    activeTournament=null;tournamentBracket=[];currentMatch=null;isSkippingTournament=false;
    if(typeof saveGame==='function')saveGame(true);
    if(typeof updateHub==='function')updateHub();if(typeof showScreen==='function')showScreen('screen-hub');return true;
}
function getWorldYouthFinalists(year,candidates=getWorldYouthPlayers()){
    const keys=getWorldYouthEdition(year)?.finalists||[];return keys.map(k=>candidates.find(p=>worldYouthKey(p)===k)).filter(Boolean);
}
function getWorldYouthPendingCareerGroup(){
    const edition=getWorldYouthEdition();if(edition?.phase!=='groups')return null;
    for(let gi=0;gi<edition.groups.length;gi++)for(let mi=0;mi<edition.groups[gi].matches.length;mi++){
        const g=edition.groups[gi],m=g.matches[mi];if(m.played)continue;
        const p1=worldYouthResolve(g.members[m.p1Index]),p2=worldYouthResolve(g.members[m.p2Index]);
        if(isCurrentPlayer(p1)||isCurrentPlayer(p2))return {groupIndex:gi,matchIndex:mi,p1,p2};
    }return null;
}
function startWorldYouthCareerGroupMatch(){
    if(isTournamentSimulationBusy()||currentMatch)return false;
    const pending=getWorldYouthPendingCareerGroup();if(!pending)return false;
    const opponent=isCurrentPlayer(pending.p1)?pending.p2:pending.p1;
    if(opponent.isBye){recordWorldYouthGroupMatch(pending.groupIndex,pending.matchIndex,isCurrentPlayer(pending.p1),isCurrentPlayer(pending.p1)?5:0,isCurrentPlayer(pending.p2)?5:0);return simulateWorldYouthGroups(false);}
    if(typeof maybeBeginPreTournamentPressConference==='function'&&maybeBeginPreTournamentPressConference(activeTournament,opponent,()=>startWorldYouthCareerGroupMatch()))return true;
    tournamentBracket=[player,opponent];tournamentRound=64;
    const modal=document.getElementById('world-youth-modal');if(modal)modal.style.display='none';
    startTournamentMatch();
    if(currentMatch)currentMatch.worldYouthGroupMatch={groupIndex:pending.groupIndex,matchIndex:pending.matchIndex};return true;
}
function finishWorldYouthCareerGroupMatch(won,match){
    const pending=match.worldYouthGroupMatch,edition=getWorldYouthEdition(),group=edition.groups[pending.groupIndex],m=group.matches[pending.matchIndex];
    const first=worldYouthKey(player)===group.members[m.p1Index];
    recordWorldYouthGroupMatch(pending.groupIndex,pending.matchIndex,first?won:!won,
        first?match.p1Legs:match.p2Legs,first?match.p2Legs:match.p1Legs,
        {p1Scored:first?match.stats?.p1AccumulatedScore:match.stats?.p2AccumulatedScore,p2Scored:first?match.stats?.p2AccumulatedScore:match.stats?.p1AccumulatedScore,
        p1Darts:first?match.stats?.p1TotalDarts:match.stats?.p2TotalDarts,p2Darts:first?match.stats?.p2TotalDarts:match.stats?.p1TotalDarts});
    currentMatch=null;
    for(const _ of iterateWorldYouthGroups(false)){};
    saveGame(true);if(edition.phase==='knockout')showBracket();else showWorldYouth();return true;
}
function startWatchingWorldYouthGroup(gi,mi,highlights=false){
    if(isTournamentSimulationBusy()||currentMatch)return false;
    const group=getWorldYouthEdition()?.groups?.[gi],match=group?.matches?.[mi];if(!match||match.played)return false;
    const p1=worldYouthResolve(group.members[match.p1Index]),p2=worldYouthResolve(group.members[match.p2Index]);
    if(p1.isBye||p2.isBye)return false;
    const modal=document.getElementById('world-youth-modal');if(modal)modal.style.display='none';
    return beginSpectatingAiMatch(p1,p2,{type:'legs',legsToWin:5},{spectatorWorldYouthGroupMatch:{groupIndex:gi,matchIndex:mi},spectatorHighlights:highlights===true});
}
async function simulateWorldYouthGroups(includeCareer=false){
    return runTournamentSimulation(async()=>{
        activeTournament.worldYouthSimulateCareer=includeCareer===true;
        await runTournamentSimulationSteps(iterateWorldYouthGroups(includeCareer),worldYouthText('groups'),192);
        if(['knockout','final'].includes(getWorldYouthEdition().phase)&&(includeCareer||!tournamentBracket.some(isCurrentPlayer))){
            const outcome=await simulateTournamentRoundsInBatches(activeTournament);if(outcome==='worldYouth')concludeWorldYouthEvent();
        }else if(getWorldYouthEdition().phase==='knockout')showBracket();else showWorldYouth();return true;
    },{onRestored:()=>showWorldYouth()});
}
function startWorldYouthTournament(){
    ensureWorldYouthCalendar();
    const event=activeTournament;event.worldYouthYear=currentDate.getFullYear();let edition=getWorldYouthEdition();
    if(event.worldYouthPhase==='final'&&edition?.phase!=='final'&&edition?.phase!=='completed'
        &&typeof calendarTournamentReady==='function'&&!calendarTournamentReady(event)){
        activeTournament=null;tournamentBracket=[];return concludeCalendarSessionPause();
    }
    if(event.worldYouthPhase==='main'){
        edition ||= createWorldYouthEdition(event);
        if(edition.phase==='groups'){
            if(isSkippingTournament||shouldAutoSimulateUnwatchedTournament(event,edition.participants.includes(worldYouthKey(player))))return simulateWorldYouthGroups(true);
            showWorldYouth();return true;
        }
    }else{
        if(!edition?.finalists?.length||edition.phase==='skipped'){event.completed=true;activeTournament=null;tournamentBracket=[];saveGame(true);updateHub();return true;}
        if(edition.phase==='awaitingFinal'){edition.phase='final';edition.currentKeys=edition.finalists;edition.currentRound=2;recordWorldYouthNews('final',edition,event);}
    }
    if(['awaitingFinal','completed','skipped'].includes(edition.phase))return concludeWorldYouthEvent();
    if(!tournamentBracket.length){tournamentBracket=edition.currentKeys.map(worldYouthResolve);tournamentRound=edition.currentRound;}
    if(isSkippingTournament||shouldAutoSimulateUnwatchedTournament(event,tournamentBracket.some(isCurrentPlayer)))return simulateHeadlessTournament((function*(){return true;})());
    showBracket();return true;
}

const WORLD_YOUTH_COPY={
    pl:{overview:'Przegląd',groups:'Grupy',knockout:'Drabinka',final:'Finał',prizes:'Nagrody',history:'Historia',records:'Rekordy',nonRanking:'Turniej nierankingowy — nagrody zwiększają zarobki, bez wpływu na OOM.',awaitingFinal:'Oczekiwanie na finał',play:'Rozegraj mecz',simulate:'Symuluj mecze AI',all:'Symuluj cały etap',watch:'Oglądaj',close:'Zamknij',dtPending:'Najpierw należy ukończyć Development Tour.',invites:'Zaproszenia z dostępnej bazy',shortfall:'Wolne miejsca (BYE)',field:'Uczestnicy',dt:'Końcowy Development Tour',phase:'Etap',date:'Data',won:'Wygrane',lost:'Porażki',played:'Mecze',points:'Punkty',difference:'Bilans',average:'Średnia'},
    en:{overview:'Overview',groups:'Groups',knockout:'Bracket',final:'Final',prizes:'Prize money',history:'History',records:'Records',nonRanking:'Non-ranking event — prizes increase earnings without affecting any OOM.',awaitingFinal:'Awaiting Final',play:'Play match',simulate:'Simulate AI matches',all:'Simulate entire stage',watch:'Watch',close:'Close',dtPending:'Complete the Development Tour first.',invites:'Invitations from available database',shortfall:'Empty places (BYE)',field:'Participants',dt:'Final Development Tour',phase:'Stage',date:'Date',won:'Wins',lost:'Losses',played:'Played',points:'Points',difference:'Difference',average:'Average'},
    de:{overview:'Übersicht',groups:'Gruppen',knockout:'Turnierbaum',final:'Finale',prizes:'Preisgeld',history:'Historie',records:'Rekorde',nonRanking:'Nicht ranglistenrelevant — Preisgeld erhöht Einnahmen, aber keine OOM.',awaitingFinal:'Warten auf das Finale',play:'Spiel bestreiten',simulate:'KI-Spiele simulieren',all:'Gesamte Phase simulieren',watch:'Zuschauen',close:'Schließen',dtPending:'Zuerst die Development Tour abschließen.',invites:'Einladungen aus der verfügbaren Datenbank',shortfall:'Freilose (BYE)',field:'Teilnehmer',dt:'Abschließende Development Tour',phase:'Phase',date:'Datum',won:'Siege',lost:'Niederlagen',played:'Spiele',points:'Punkte',difference:'Differenz',average:'Average'},
    nl:{overview:'Overzicht',groups:'Groepen',knockout:'Schema',final:'Finale',prizes:'Prijzengeld',history:'Geschiedenis',records:'Records',nonRanking:'Niet-rankingtoernooi — prijzengeld verhoogt inkomsten zonder invloed op OOM.',awaitingFinal:'Wachten op de finale',play:'Wedstrijd spelen',simulate:'AI-wedstrijden simuleren',all:'Hele fase simuleren',watch:'Kijken',close:'Sluiten',dtPending:'Rond eerst de Development Tour af.',invites:'Uitnodigingen uit de beschikbare database',shortfall:'Vrije plaatsen (BYE)',field:'Deelnemers',dt:'Definitieve Development Tour',phase:'Fase',date:'Datum',won:'Gewonnen',lost:'Verloren',played:'Gespeeld',points:'Punten',difference:'Verschil',average:'Gemiddelde'}
};
function worldYouthText(key){
    const lang=typeof currentLang!=='undefined'?currentLang:typeof language!=='undefined'?language:'pl';
    const extra={pl:{completed:'Zakończony',skipped:'Edycja pominięta',groupThird:'3. miejsce w grupie',groupFourth:'4. miejsce w grupie',highlights:'Skrót meczu',legs:'Legi'},en:{completed:'Completed',skipped:'Edition skipped',groupThird:'3rd in group',groupFourth:'4th in group',highlights:'Highlights',legs:'Legs'},de:{completed:'Abgeschlossen',skipped:'Ausgabe übersprungen',groupThird:'3. Gruppenplatz',groupFourth:'4. Gruppenplatz',highlights:'Highlights',legs:'Legs'},nl:{completed:'Voltooid',skipped:'Editie overgeslagen',groupThird:'3e in de groep',groupFourth:'4e in de groep',highlights:'Hoogtepunten',legs:'Legs'}};
    return (WORLD_YOUTH_COPY[lang]||WORLD_YOUTH_COPY.pl)[key]||(extra[lang]||extra.pl)[key]||key;
}
function showWorldYouth(tab='overview',year=currentDate.getFullYear()){
    const edition=getWorldYouthEdition(year),name=key=>escapeHtml(edition?.identities?.[key]?.name||worldYouthResolve(key)?.name||'BYE');
    let modal=document.getElementById('world-youth-modal');
    if(!modal){modal=document.createElement('div');modal.id='world-youth-modal';modal.className='modal-overlay';document.body.appendChild(modal);}
    const tabs=['overview','groups','knockout','final','prizes','history','records'];let body='';
    if(tab==='overview')body=`<p>${worldYouthText('nonRanking')}</p><p>${worldYouthText('field')}: ${edition?.participants?.length||0}/128 · ${worldYouthText('shortfall')}: ${128-(edition?.participants?.length||0)}</p><p>${worldYouthText('phase')}: ${edition?.phase==='awaitingFinal'?worldYouthText('awaitingFinal'):worldYouthText(edition?.phase||'overview')}</p><p>${worldYouthText('dt')}: ${edition?.developmentCompleted||0}/24</p><p>${worldYouthText('invites')}: ${Object.values(edition?.routes||{}).filter(r=>r==='invitation').length}</p><p>${worldYouthText('date')}: ${edition?new Date(edition.mainDate).toLocaleDateString():'05.10'} / ${edition?new Date(edition.finalDate).toLocaleDateString():'29.11'}</p>`;
    if(tab==='groups')body=(edition?.groups||[]).map((g,gi)=>`<section><h3>${worldYouthText('groups')} ${g.label}</h3><div class="wyc-table"><table><thead><tr><th></th><th>${worldYouthText('played')}</th><th>${worldYouthText('won')}</th><th>${worldYouthText('lost')}</th><th>${worldYouthText('legs')}</th><th>${worldYouthText('difference')}</th><th>${worldYouthText('points')}</th><th>${worldYouthText('average')}</th></tr></thead><tbody>${getWorldYouthGroupStandings(g).map(r=>`<tr><td>${name(g.members[r.memberIndex])}</td><td>${r.played}</td><td>${r.wins}</td><td>${r.losses}</td><td>${r.legsWon}:${r.legsLost}</td><td>${r.difference}</td><td>${r.points}</td><td>${r.average===null?'—':r.average.toFixed(2)}</td></tr>`).join('')}</tbody></table></div>${g.matches.map((m,mi)=>`<p>${name(g.members[m.p1Index])} ${m.played?`${m.score1}:${m.score2}`:'–'} ${name(g.members[m.p2Index])} ${!m.played&&g.members[m.p1Index]&&g.members[m.p2Index]?`<button onclick="startWatchingWorldYouthGroup(${gi},${mi})">${worldYouthText('watch')}</button><button onclick="startWatchingWorldYouthGroup(${gi},${mi},true)">${worldYouthText('highlights')}</button>`:''}</p>`).join('')}</section>`).join('');
    if(tab==='knockout')body=Object.entries(edition?.rounds||{}).sort((a,b)=>b[0]-a[0]).map(([r,matches])=>`<h3>${getRoundName(Number(r))}</h3>${matches.map(m=>`<p>${name(m.p1)} ${m.score1}:${m.score2} ${name(m.p2)}</p>`).join('')}`).join('');
    if(tab==='final')body=`<h3>${edition?.phase==='awaitingFinal'?worldYouthText('awaitingFinal'):worldYouthText('final')}</h3><p>${(edition?.finalists||[]).map(name).join(' — ')}</p><p>${edition?.finalDate?new Date(edition.finalDate).toLocaleDateString():'29.11'}</p>${(edition?.rounds?.[2]||[]).map(m=>`<p>${name(m.p1)} ${m.score1}:${m.score2} ${name(m.p2)}</p>`).join('')}`;
    if(tab==='prizes')body=`<p>${worldYouthText('nonRanking')}</p>${Object.entries(WORLD_YOUTH_PRIZES).map(([key,value])=>`<p>${key==='winner'?'1':key.startsWith('group')?worldYouthText(key):key}: £${getWorldYouthPrize(key).toLocaleString('en-GB')}</p>`).join('')}`;
    if(tab==='history')body=[...(typeof worldYouthHistory!=='undefined'?worldYouthHistory:[]).map(h=>`<p>${h.year}: ${escapeHtml(worldYouthHistoricalName(h.winner,h.winnerIndex))} ${h.score} ${escapeHtml(worldYouthHistoricalName(h.runner,h.runnerIndex))}</p>`),...Object.values(player.worldYouthEditions||{}).filter(e=>e.champion).map(e=>`<p><button onclick="showWorldYouth('final',${e.year})">${e.year}</button>: ${escapeHtml(e.identities[e.champion]?.name||'—')}</p>`)].join('');
    if(tab==='records')body=getWorldYouthRecords().map(r=>`<p>${escapeHtml(r.name)}: ${r.count}</p>`).join('');
    const pending=getWorldYouthPendingCareerGroup();
    modal.innerHTML=`<div class="modal-content world-youth-content"><h2>${escapeHtml(typeof competitionName==='function'?competitionName('worldYouth'):'Future Stars Championship')} ${year}</h2><nav>${tabs.map(k=>`<button onclick="showWorldYouth('${k}',${year})" aria-pressed="${k===tab}">${worldYouthText(k)}</button>`).join('')}</nav>${body}<footer>${edition?.phase==='groups'&&activeTournament&&year===currentDate.getFullYear()?`${pending?`<button onclick="startWorldYouthCareerGroupMatch()">${worldYouthText('play')}</button>`:''}<button onclick="simulateWorldYouthGroups(false)">${worldYouthText('simulate')}</button><button onclick="simulateWorldYouthGroups(true)">${worldYouthText('all')}</button>`:''}<button onclick="document.getElementById('world-youth-modal').style.display='none'">${worldYouthText('close')}</button></footer></div>`;
    modal.style.display='flex';return true;
}
function worldYouthHistoricalName(factual,index){
    const actual=Number.isInteger(index)&&typeof getLifecycleTemplateIndex==='function'?getWorldYouthPlayers().find(p=>getLifecycleTemplateIndex(p)===index):null;
    return actual?.name||factual;
}

function getWorldYouthHistoricalTitles(candidate){
    if(typeof worldYouthHistory==='undefined'||typeof getLifecycleTemplateIndex!=='function'||!candidate
        ||candidate.isNewgen||candidate.editorCreated||candidate.kind==='custom')return [];
    const index=getLifecycleTemplateIndex(candidate);if(!Number.isInteger(index))return [];
    const titles=[],data=getPlayerCareerTitleData({name:'World Youth Championship',sourceName:'World Youth Championship',specialType:'worldYouth'});
    for(const edition of worldYouthHistory.filter(h=>h.winnerIndex===index)){
        const title=upsertPlayerCareerTitle(titles,data,1,new Date(edition.year,10,29).getTime());if(title)title.historical=true;
    }return titles;
}

function getWorldYouthRecords(){
    const records=new Map(),add=(key,name)=>{const row=records.get(key)||{name,count:0};row.count++;records.set(key,row);};
    for(const h of typeof worldYouthHistory!=='undefined'?worldYouthHistory:[])
        add(h.winnerIndex===null?`archive:${h.winner}`:`template:${h.winnerIndex}`,worldYouthHistoricalName(h.winner,h.winnerIndex));
    for(const e of Object.values(player.worldYouthEditions||{}))if(e.champion){
        const identity=e.identities[e.champion],p=getWorldYouthPlayers().find(p=>worldYouthKey(p)===e.champion),index=identity?.templateIndex??(p&&typeof getLifecycleTemplateIndex==='function'?getLifecycleTemplateIndex(p):null);
        add(Number.isInteger(index)?`template:${index}`:`player:${e.champion}`,p?.name||identity?.name||e.champion);
    }return [...records.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name));
}

function applyWorldYouthWorldQualification(result,date,tournament){
    const edition=getWorldYouthEdition(date.getFullYear());
    if(tournament?.worldYouthIgnoreSlot||!edition?.champion)return result;
    const champion=getWorldYouthPlayers().find(p=>worldYouthKey(p)===edition.champion);
    const elsewhere=result.playerIds.includes(edition.champion);
    edition.seniorWorldRoute=edition.seniorWorldDeclined||elsewhere?'tourCardQualifier':'champion';
    const winner=edition.seniorWorldRoute==='champion'?champion
        :getWorldYouthPlayers().find(p=>worldYouthKey(p)===edition.seniorReplacementWinner);
    if(edition.seniorWorldRoute==='tourCardQualifier'&&!edition.seniorReplacementWinner
        &&edition.year===currentDate.getFullYear())scheduleWorldYouthReplacementQualifier(edition);
    // Reserve one flexible OOM place. All fixed regional/cycle routes keep
    // their existing quotas; the field remains 128.
    if(result.participants.length>=128){
        const generic=[...result.categories].reverse().find(c=>['oomFallback','oom81to128','native-oom81to128'].includes(c.key)
            &&c.playerIds.some(k=>String(k)!==edition.champion));
        if(!generic){edition.diagnostics.includes('senior-world-no-flexible-place')||edition.diagnostics.push('senior-world-no-flexible-place');return result;}
        const index=generic.playerIds.findLastIndex(k=>String(k)!==edition.champion),removed=generic.playerIds.splice(index,1)[0];generic.requested=Math.max(0,generic.requested-1);
        if(generic.key==='oom81to128')generic.label=`Niezakwalifikowani z miejsc 81–128 OOM (${generic.requested})`;
        result.participants=result.participants.filter(p=>worldYouthKey(p)!==String(removed));
    }
    if(winner&&!winner.isBye&&!result.participants.some(p=>worldYouthKey(p)===worldYouthKey(winner)))result.participants.push(winner);
    result.playerIds=result.participants.map(worldYouthKey);
    result.categories.push({key:'worldYouthChampion',label:edition.seniorWorldRoute==='champion'?'World Youth Championship':'World Youth — Tour Card Holder Qualifier',
        requested:1,playerIds:winner?[worldYouthKey(winner)]:[],shortfall:winner?0:1});
    result.complete=result.playerIds.length>=128;result.shortfall=Math.max(0,128-result.playerIds.length);return result;
}
function scheduleWorldYouthReplacementQualifier(edition=getWorldYouthEdition()){
    if(!edition?.champion)return null;
    const target=tournamentDatabase.find(t=>/global darts championship|world darts championship/i.test(t.sourceName||t.name)&&!t.qualifierFor);
    if(!target)return null;
    const raw=buildWorldChampionshipQualification(getWorldYouthPlayers(),currentDate,{...target,worldYouthIgnoreSlot:true});
    const duplicate=raw.playerIds.includes(edition.champion);
    if(!duplicate&&!edition.seniorWorldDeclined){edition.seniorWorldRoute='champion';return null;}
    edition.seniorWorldRoute='tourCardQualifier';
    let qualifier=tournamentDatabase.find(t=>t.worldYouthVacancy&&t.worldYouthYear===edition.year);
    if(!qualifier){
        const date=new Date(Math.max(currentDate.getTime(),edition.finalDate||currentDate.getTime()));date.setDate(date.getDate()+1);
        const deadline=new Date(edition.year,target.month,target.day);
        if(date>=deadline)date.setTime(currentDate.getTime());
        if(date>=deadline){
            if(!edition.diagnostics.includes('senior-world-qualification-deadline'))edition.diagnostics.push('senior-world-qualification-deadline');
            return null;
        }
        qualifier={name:typeof competitionDisplayText==='function'?competitionDisplayText('World Youth — Tour Card Holder Qualifier'):'Future Stars Championship — Tour Card Holder Qualifier',sourceName:'World Youth — Tour Card Holder Qualifier',
            specialType:'pdcTourCardQualifier',worldYouthVacancy:true,worldYouthYear:edition.year,qualifierFor:target.name,qualifyingPlaces:1,
            month:date.getMonth(),day:date.getDate(),format:'legs',rankingOverride:false,minOvr:0,city:'Wigan',country:'Anglia'};
        tournamentDatabase.push(qualifier);
    }
    delete target.worldChampionshipQualification;return qualifier;
}
function refreshWorldYouthReplacementQualification(date=currentDate){
    const edition=getWorldYouthEdition(date.getFullYear());
    if(!edition?.champion||edition.phase!=='completed'||edition.seniorReplacementWinner)return;
    const target=tournamentDatabase.find(t=>/global darts championship|world darts championship/i.test(t.sourceName||t.name)&&!t.qualifierFor);
    if(!target||target.completed||target.worldChampionshipDrawVersion||date>=new Date(edition.year,target.month,target.day))return;
    // Another event can qualify the Youth winner after its final. Detect that
    // while the existing replacement qualifier can still be played, independently of UI previews.
    scheduleWorldYouthReplacementQualifier(edition);
}
function ensureWorldYouthQualifierState(event,candidates=getWorldYouthPlayers()){
    const edition=getWorldYouthEdition(currentDate.getFullYear());if(!edition)return null;
    const existing=event.worldYouthQualification;if(existing?.locked||existing?.completed)return existing;
    const target=getPdcTourCardQualifierMainTournament(event);
    const base=buildWorldChampionshipQualification(candidates,currentDate,{...target,worldYouthIgnoreSlot:true});
    const generic=[...base.categories].reverse().find(c=>['oomFallback','oom81to128','native-oom81to128'].includes(c.key)
        &&c.playerIds.some(k=>String(k)!==edition.champion));
    const flexible=base.playerIds.length>=128?generic?.playerIds.findLast(k=>String(k)!==edition.champion):null;
    const automatic=base.playerIds.filter(k=>k!==flexible);
    const holders=getPdcTourCardHolders(candidates).filter(p=>!automatic.includes(worldYouthKey(p)));
    return event.worldYouthQualification={version:1,year:edition.year,qualifyingPlaces:1,automaticPlayerIds:automatic,
        qualifierPlayerIds:holders.map(worldYouthKey),qualifiedPlayerIds:[],categories:[],completed:false,locked:false};
}
function declineWorldYouthSeniorWorldPlace(year=currentDate.getFullYear()){
    const edition=getWorldYouthEdition(year);if(!edition?.champion||edition.seniorReplacementWinner)return false;
    const target=tournamentDatabase.find(t=>/global darts championship|world darts championship/i.test(t.sourceName||t.name)&&!t.qualifierFor);
    if(!target||target.completed||currentDate>=new Date(year,target.month,target.day))return false;
    edition.seniorWorldDeclined=true;scheduleWorldYouthReplacementQualifier(edition);saveGame(true);return true;
}

function recordWorldYouthNews(kind,edition,event){
    if(typeof newsOffer!=='function'||typeof newsPerson!=='function')return;
    edition.newsKeys ||= [];if(edition.newsKeys.includes(kind))return;
    const keys=kind==='field'?edition.seeds:edition.finalists||[],actor=worldYouthResolve(keys[0]),opponent=worldYouthResolve(keys[1]);
    if(actor.isBye)return;
    const facts={actor:newsPerson(actor),opponent:opponent.isBye?null:newsPerson(opponent),
        tournament:newsTournamentSnapshot(event),eventKey:`world-youth:${edition.year}:${kind}`,defending:false,
        participants:edition.participants.length,youthStage:kind,qualification:kind==='finalists'?'Grand Slam':null};
    // Reuse newsroom preview/result templates; explicit Youth taxonomy prevents
    // senior-world and major claims. The champion uses the normal title hook.
    newsOffer('preview',facts.eventKey,facts);edition.newsKeys.push(kind);
}
function renderWorldYouthHonours(candidate){
    const historical=typeof worldYouthHistory!=='undefined'&&typeof getLifecycleTemplateIndex==='function'
        &&!candidate.isNewgen&&!candidate.editorCreated&&candidate.kind!=='custom'
        ?worldYouthHistory.filter(h=>h.winnerIndex===getLifecycleTemplateIndex(candidate)):[];
    const recent=Object.values(player.worldYouthEditions||{}).filter(e=>e.champion===worldYouthKey(candidate));
    if(!historical.length&&!recent.length)return '';
    const rows=historical.map(h=>`${h.year} · ${escapeHtml(worldYouthHistoricalName(h.runner,h.runnerIndex))} · ${h.score}`);
    for(const e of recent){const m=e.rounds?.[2]?.[0],opponent=e.finalists.find(k=>k!==e.champion);
        const score=m?(m.winner===m.p1?`${m.score1}:${m.score2}`:`${m.score2}:${m.score1}`):'—';
        rows.push(`${e.year} · ${escapeHtml(e.identities[opponent]?.name||'—')} · ${score} · £${(e.prizes[e.champion]?.amount||0).toLocaleString('en-GB')}`);}
    return `<section class="profile-career-titles"><h3>${escapeHtml(typeof competitionDisplayText==='function'?competitionDisplayText('World Youth Champion'):'Future Stars Championship — Champion')}</h3><ul>${rows.map(r=>`<li>${r}</li>`).join('')}</ul></section>`;
}
