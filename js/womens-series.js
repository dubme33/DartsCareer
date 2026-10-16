// Independent annual Women's Series ledger. Shared match, lifecycle and save engines.
const WOMENS_SERIES_TYPE='womensSeries';
const WOMENS_SERIES_PRIZES=Object.freeze({winner:2500,2:1000,4:750,8:500,16:300,32:200,64:75});
const WOMENS_SERIES_CAMPS=Object.freeze([[1,7,'Hildesheim','Niemcy'],[2,21,'Wigan','Anglia'],[4,16,'Leicester','Anglia'],[5,20,'Wigan','Anglia'],[7,22,'Leicester','Anglia'],[9,10,'Wigan','Anglia']]);
function isWomensSeriesTournament(value=typeof activeTournament!=='undefined'?activeTournament:null){
 if(typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(value))return false;
 if(value&&typeof value==='object')return value.specialType===WOMENS_SERIES_TYPE||Number.isInteger(value.womensSeriesEvent);
 const event=typeof getTournamentForPrizeRules==='function'?getTournamentForPrizeRules(value):null;
 return Boolean(event&&(event.specialType===WOMENS_SERIES_TYPE||Number.isInteger(event.womensSeriesEvent)));
}
function womensSeriesKey(p){return String(p?.id||`${p?.sourceName||p?.name||''}|${p?.country||''}`);}
function getWomensSeriesPlayers(candidates){return typeof getDevelopmentTourActivePlayers==='function'?getDevelopmentTourActivePlayers(candidates):[];}
function isWomensSeriesWoman(p){return p?.womensSeriesEligible!==false&&(p?.gender==='female'||p?.competitionCategory==='women');}
function womensSeriesYear(date=currentDate){return (date instanceof Date?date:new Date(date)).getFullYear();}
function womensSeriesSeason(year=womensSeriesYear(),create=true){
 if(!player||typeof player!=='object')return null;
 if(!create)return player.womensSeriesSeasons?.[year]||null;
 player.womensSeriesSeasons ||= {};
 return player.womensSeriesSeasons[year] ||= {version:1,year,events:{},cutoffs:{},closed:false,finalRanking:[],qualifications:{},diagnostics:[]};
}
function womensSeriesEventDate(event,year=womensSeriesYear()){return new Date(year,event.month,event.day);}
function womensSeriesEntryDate(event,year=womensSeriesYear()){
 const date=womensSeriesEventDate(event,year);date.setDate(date.getDate()-((date.getDay()+3)%7||7));return date;
}
function processWomensSeriesEntryCutoffs(date=currentDate){
 const season=womensSeriesSeason(womensSeriesYear(date)),events=tournamentDatabase.filter(isWomensSeriesTournament);
 for(const event of events){
  const deadline=womensSeriesEntryDate(event,season.year),key=deadline.getTime();
  if(deadline>date||season.cutoffs[key])continue;
  const pool=getWomensSeriesPlayers();
  season.cutoffs[key]={date:key,top64:[...getDevelopmentTourTop64PlayerKeys(pool)],late:deadline<new Date(date.getFullYear(),date.getMonth(),date.getDate())};
 }
}
function getWomensSeriesEligiblePlayers(candidates,referenceDate=currentDate,event=null){
 const pool=getWomensSeriesPlayers(candidates),season=womensSeriesSeason(womensSeriesYear(referenceDate),false);
 const frozen=event&&season?.cutoffs?.[womensSeriesEntryDate(event,womensSeriesYear(referenceDate)).getTime()];
 const top64=new Set(frozen?.top64||getDevelopmentTourTop64PlayerKeys(getWomensSeriesPlayers()));
 return pool.filter(p=>isWomensSeriesWoman(p)&&!p.retired
  &&(getDevelopmentTourExactAge(p,referenceDate)??getDevelopmentTourSeasonAge(p,referenceDate))>=16
  &&!top64.has(womensSeriesKey(p))
  &&!(typeof isPdcParticipationRestricted==='function'&&isPdcParticipationRestricted(p,womensSeriesYear(referenceDate)))
  &&p.womensSeriesBanned!==true&&!(Number(p.womensSeriesBanUntil)>referenceDate.getTime()));
}
function getWomensSeriesPrize(round,won,event=activeTournament){
 const key=won&&Number(round)===2?'winner':String(round);
 if(key==='64'&&Number(event?.womensSeriesState?.entrants??event?.womensSeriesEntrants??0)<128)return 0;
 const custom=event?.editorPrizes?.[key];return Number.isFinite(custom)?Math.max(0,custom):WOMENS_SERIES_PRIZES[key]||0;
}
function initializeWomensSeriesDraw(event,participants){
 const season=womensSeriesSeason(),number=event.womensSeriesEvent;
 const state=event.womensSeriesState ||= {version:1,year:season.year,number,entrants:participants.filter(p=>!p.isBye).length,
  draw:participants.map(p=>p.isBye?null:womensSeriesKey(p)),byes:{},playedWins:{},payouts:{},results:{},completed:false};
 season.events[number]=state;
 if((number-1)%4===0&&typeof newsOffer==='function'){
  const actor=getWomensSeriesOrderOfMerit(participants,{includeZero:true})[0];
  if(actor)newsOffer('preview',`ws-open:${season.year}:${number}`,{actor:newsPerson(actor),tournament:newsTournamentSnapshot(event),kind:'ws-open',amount:state.entrants,year:season.year});
 }
 return state;
}
function recordWomensSeriesBye(event,round,p){
 if(!isWomensSeriesTournament(event)||p?.isBye)return;
 const state=event.womensSeriesState;if(state)state.byes[womensSeriesKey(p)]=Number(round);
}
function recordWomensSeriesMatch(event,round,p1,p2,result){
 if(!isWomensSeriesTournament(event)||!event.womensSeriesState)return;
 const state=event.womensSeriesState,winner=result.winner,loser=result.loser||(winner===p1?p2:p1);
 if(!result.walkover&&!p1?.isBye&&!p2?.isBye)state.playedWins[womensSeriesKey(winner)]=(state.playedWins[womensSeriesKey(winner)]||0)+1;
 if(loser&&!loser.isBye)state.results[womensSeriesKey(loser)]={round:Number(round),won:false};
 if(Number(round)===2){state.winner=womensSeriesKey(winner);state.runnerUp=womensSeriesKey(loser);state.finalScore=[Number(result.p1Score)||0,Number(result.p2Score)||0];state.finalPlayerIds=[womensSeriesKey(p1),womensSeriesKey(p2)];}
}
function claimWomensSeriesPrize(p,amount,event){
 if(!isWomensSeriesTournament(event)||!p||p.isBye)return false;
 const state=event.womensSeriesState,key=womensSeriesKey(p);if(!state||state.payouts[key])return false;
 const won=key===state.winner,round=won?2:state.results[key]?.round||Number(tournamentRound);
 const bye=state.byes[key],creditedRound=!won&&bye===round*2&&!state.playedWins[key]?bye:round;
 const rankingAmount=creditedRound!==round?getWomensSeriesPrize(creditedRound,false,event):amount;
 const entry={year:state.year,event:state.number,amount,rankingAmount,round,won,date:currentDate.getTime()};
 state.payouts[key]=entry;p.womensSeriesPrizeHistory ||= [];
 if(!p.womensSeriesPrizeHistory.some(r=>r.year===entry.year&&r.event===entry.event))p.womensSeriesPrizeHistory.push(entry);
 p.womensSeriesPrizeMoney=getWomensSeriesPrizeMoney(p,state.year);p.womensSeriesPrizeEarnings=(Number(p.womensSeriesPrizeEarnings)||0)+amount;
 if(typeof invalidatePlayerRankingCache==='function')invalidatePlayerRankingCache('womensSeries');return true;
}
function getWomensSeriesPrizeMoney(p,year=womensSeriesYear()){return (p?.womensSeriesPrizeHistory||[]).reduce((s,r)=>s+(r.year===year?Number(r.rankingAmount)||0:0),0);}
function compareWomensSeriesCountback(a,b,year=womensSeriesYear(),numbers=null){
 const events=numbers||Object.values(womensSeriesSeason(year,false)?.events||{}).filter(e=>e.completed).sort((a,b)=>(b.date||0)-(a.date||0)||b.number-a.number).map(e=>e.number);
 const money=(p,n)=>Number((p.womensSeriesPrizeHistory||[]).find(r=>r.year===year&&r.event===n)?.rankingAmount)||0;
 const sum=(p,list)=>list.reduce((s,n)=>s+money(p,n),0);
 let diff=getWomensSeriesPrizeMoney(b,year)-getWomensSeriesPrizeMoney(a,year);if(diff)return diff;
 diff=sum(b,events.slice(0,4))-sum(a,events.slice(0,4));if(diff)return diff;
 for(const n of events){diff=money(b,n)-money(a,n);if(diff)return diff;}
 return 0;
}
function getWomensSeriesOrderOfMerit(candidates,{includeZero=false,year=womensSeriesYear()}={}){
 const season=womensSeriesSeason(year,false),pool=getWomensSeriesPlayers(candidates).filter(isWomensSeriesWoman);
 const final=season?.closed?new Map(season.finalRanking.map((r,i)=>[r.id,i])):null;
 return pool.filter(p=>includeZero||getWomensSeriesPrizeMoney(p,year)>0).sort((a,b)=>
  final&&final.has(womensSeriesKey(a))&&final.has(womensSeriesKey(b))?final.get(womensSeriesKey(a))-final.get(womensSeriesKey(b))
  :compareWomensSeriesCountback(a,b,year)||womensSeriesKey(a).localeCompare(womensSeriesKey(b)));
}
function completeWomensSeriesTournament(event,winner){
 if(!isWomensSeriesTournament(event)||!event.womensSeriesState)return;
 const season=womensSeriesSeason(),state=event.womensSeriesState;if(state.completed)return;
 state.completed=true;state.name=event.name;state.sourceName=event.sourceName||event.name;state.date=currentDate.getTime();
 state.winner=womensSeriesKey(winner);state.matchHistory=event.matchHistory;state.totalPaid=Object.values(state.payouts).reduce((s,r)=>s+r.amount,0);
 state.results[state.winner]={round:2,won:true};
 const ranking=getWomensSeriesOrderOfMerit(null,{includeZero:false});state.ranking=ranking.map(p=>womensSeriesKey(p));
 if(ranking[0]&&typeof newsOffer==='function'){
  const old=Object.values(season.events).filter(e=>e.completed&&e!==state).sort((a,b)=>b.date-a.date)[0]?.ranking?.[0];
  if(old&&old!==state.ranking[0])newsOffer('ranking_rise',`ws-leader:${season.year}:${state.number}`,{actor:newsPerson(ranking[0]),tournament:newsTournamentSnapshot(event),kind:'ws-leader',year:season.year,prize:getWomensSeriesPrizeMoney(ranking[0])});
  const titles=Object.values(season.events).filter(e=>e.completed&&e.winner===state.winner).length;
  const previousBest=Math.max(0,...Object.values(player.womensSeriesSeasons||{}).filter(s=>s.year<season.year).flatMap(s=>{const counts={};Object.values(s.events||{}).forEach(e=>{if(e.completed)counts[e.winner]=(counts[e.winner]||0)+1;});return Object.values(counts);}));
  if(titles>Math.max(1,previousBest))newsOffer('record',`ws-record:${season.year}:${state.number}`,{actor:newsPerson(winner),tournament:newsTournamentSnapshot(event),kind:'ws-record',amount:titles,year:season.year});
 }
 if(typeof freezeWomensWorldMatchplayField==='function')freezeWomensWorldMatchplayField();
 if(tournamentDatabase.filter(isWomensSeriesTournament).length===24&&tournamentDatabase.filter(isWomensSeriesTournament).every(e=>e.completed&&!e.womensSeriesMigrationSkipped))closeWomensSeriesSeason(season.year);
}
function closeWomensSeriesSeason(year=womensSeriesYear()){
 const season=womensSeriesSeason(year);if(season.closed)return season;
 let ranked=getWomensSeriesOrderOfMerit(null,{year,includeZero:true}).filter(p=>Object.values(season.events).some(e=>e.draw?.includes(womensSeriesKey(p))));
 const groups=[];for(const p of ranked){const last=groups.at(-1);if(last&&compareWomensSeriesCountback(last[0],p,year)===0)last.push(p);else groups.push([p]);}
 season.countbackPlayoffs ||= [];
 ranked=groups.flatMap(group=>{
  if(group.length<2)return group;
  const ids=group.map(womensSeriesKey),saved=season.countbackPlayoffs.find(r=>r.ids.length===ids.length&&r.ids.every(id=>ids.includes(id)));
  if(saved)return saved.order.map(id=>group.find(p=>womensSeriesKey(p)===id));
  const wins=new Map(group.map(p=>[p,0])),legs=new Map(group.map(p=>[p,0])),matches=[];
  for(let i=0;i<group.length;i++)for(let j=i+1;j<group.length;j++){
   const r=simulateAImatch(group[i],group[j],{type:'legs',legsToWin:4});wins.set(r.winner,wins.get(r.winner)+1);
   legs.set(group[i],legs.get(group[i])+r.p1Score-r.p2Score);legs.set(group[j],legs.get(group[j])+r.p2Score-r.p1Score);
   matches.push({p1:ids[i],p2:ids[j],score:[r.p1Score,r.p2Score],winner:womensSeriesKey(r.winner)});
  }
  group.sort((a,b)=>wins.get(b)-wins.get(a)||legs.get(b)-legs.get(a));
  // A final sporting decider settles identical play-off records; never the main OOM or random ordering.
  for(let i=0;i<group.length-1;i++)if(wins.get(group[i])===wins.get(group[i+1])&&legs.get(group[i])===legs.get(group[i+1])){
   const a=group[i],b=group[i+1],r=simulateAImatch(a,b,{type:'legs',legsToWin:4});matches.push({p1:womensSeriesKey(a),p2:womensSeriesKey(b),score:[r.p1Score,r.p2Score],winner:womensSeriesKey(r.winner)});if(r.winner===b)[group[i],group[i+1]]=[b,a];
  }
  season.countbackPlayoffs.push({ids,order:group.map(womensSeriesKey),matches});return group;
 });
 season.finalRanking=ranked.map(p=>({id:womensSeriesKey(p),name:p.name,country:p.country,money:getWomensSeriesPrizeMoney(p,year)}));
 season.qualifications.qSchoolFreeEntry=season.finalRanking.slice(0,8).map(r=>r.id);
 for(const p of ranked.slice(0,8)){p.qSchoolFreeEntryEntitlements ||= {};p.qSchoolFreeEntryEntitlements[year+1]={source:'womensSeries',earnedYear:year,freeEntry:true,finalStageExemption:false};}
 season.closed=true;season.closedAt=currentDate.getTime();
 const slam=tournamentDatabase.find(t=>!t.qualifierFor&&/grand slam|champion's slam/i.test(t.sourceName||t.name));
 if(slam&&!slam.completed&&typeof buildGrandSlamAutomaticQualification==='function')buildGrandSlamAutomaticQualification(slam,getWomensSeriesPlayers(),currentDate);
 const world=tournamentDatabase.find(t=>!t.qualifierFor&&/global darts championship|world darts championship/i.test(t.sourceName||t.name));
 if(world&&!world.completed&&typeof buildWorldChampionshipQualification==='function')buildWorldChampionshipQualification(getWomensSeriesPlayers(),currentDate,world);
 if(ranked[0]&&typeof newsOffer==='function'){
  const event=tournamentDatabase.find(e=>e.womensSeriesEvent===24),facts={actor:newsPerson(ranked[0]),tournament:newsTournamentSnapshot(event),kind:'ws-season',year,prize:getWomensSeriesPrizeMoney(ranked[0],year)};
  newsOffer('season_review',`ws-season:${year}`,facts);
  if(season.qualifications.worldChampionship?.length)newsOffer('preview',`ws-world:${year}`,{...facts,kind:'ws-world',names:season.qualifications.worldChampionship.map(id=>ranked.find(p=>womensSeriesKey(p)===id)?.name||'').join(', ')});
 }
 return season;
}
function ensureWomensSeriesCalendar(calendar=tournamentDatabase,date=currentDate,{migration=false}={}){
    if (typeof applyCompetitionCalendarNames === 'function') applyCompetitionCalendarNames(calendar);
 if(!Array.isArray(calendar)||typeof isCareerEditorCalendarEmpty==='function'&&isCareerEditorCalendarEmpty())return calendar;
 const year=womensSeriesYear(date),active=typeof activeTournament!=='undefined'?activeTournament:null;
 if(typeof getCareerCalendarEditorState==='function'&&getCareerCalendarEditorState().tours.some(t=>t.id==='womensSeries'&&t.removed))return calendar;
 const usedWeekends=new Set();
 for(let camp=0;camp<6;camp++){
  const [month,day,city,country]=WOMENS_SERIES_CAMPS[camp];let saturday=new Date(year,month,day);
  if(year!==2026){
   saturday.setDate(saturday.getDate()+((6-saturday.getDay()+7)%7));
   const candidates=Array.from({length:9},(_,i)=>new Date(year,month,saturday.getDate()+7*(i%2?-Math.ceil(i/2):i/2)));
   const cost=d=>calendar.filter(e=>!isWomensSeriesTournament(e)).reduce((s,e)=>{
    const from=new Date(year,e.month,e.day),to=new Date(year,e.endMonth??e.month,e.endDay??e.day),sun=new Date(year,d.getMonth(),d.getDate()+1);
    return s+(from<=sun&&to>=d?['developmentTour','challengeTour','pdcQSchool','worldYouth'].includes(e.specialType)?10:3:0);
   },0);
   candidates.sort((a,b)=>cost(a)-cost(b)||Math.abs(a-new Date(year,month,day))-Math.abs(b-new Date(year,month,day)));saturday=candidates.find(d=>!usedWeekends.has(d.getTime()))||candidates[0];
  }
  usedWeekends.add(saturday.getTime());
  for(let local=0;local<4;local++){
   const number=camp*4+local+1,name=`PDC Women's Series ${number}`,target=new Date(year,saturday.getMonth(),saturday.getDate()+Math.floor(local/2));
   if(player?.tournamentEditorDeletedKeys?.includes(name))continue;
   let event=calendar.find(e=>e.womensSeriesEvent===number&&isWomensSeriesTournament(e));
   if(!event){event={name:typeof competitionDisplayText==='function'?competitionDisplayText(name):name.replace("PDC Women's Series","Women's Pro Circuit"),sourceName:name,specialType:WOMENS_SERIES_TYPE,womensSeriesEvent:number,format:'legs',minOvr:0,city,country,month:target.getMonth(),day:target.getDate(),completed:false,rankingOverride:false};calendar.push(event);
    if(migration&&target<new Date(year,date.getMonth(),date.getDate())){event.completed=true;event.womensSeriesMigrationSkipped=true;}
   }else if(event.womensSeriesCalendarYear!==year&&!event.editorModified&&event!==active&&!event.completed){event.month=target.getMonth();event.day=target.getDate();event.city=city;event.country=country;}
   event.womensSeriesCalendarYear=year;
   if(event.womensSeriesState?.year===year)womensSeriesSeason(year).events[number]=event.womensSeriesState;
  }
 }
 const season=womensSeriesSeason(year);
 for(const p of getWomensSeriesPlayers())p.womensSeriesPrizeMoney=getWomensSeriesPrizeMoney(p,year);
 if(migration&&calendar.some(e=>e.womensSeriesMigrationSkipped)&&!season.diagnostics.includes('partial-legacy-season'))season.diagnostics.push('partial-legacy-season');
 calendar.sort((a,b)=>a.month-b.month||a.day-b.day||(a.womensSeriesEvent||0)-(b.womensSeriesEvent||0));return calendar;
}
function getWomensSeriesQualificationPlayers(year=womensSeriesYear(),candidates=null){
 const season=womensSeriesSeason(year,false);if(!season?.closed)return [];
 const byKey=new Map(getWomensSeriesPlayers(candidates).map(p=>[womensSeriesKey(p),p]));
 return season.finalRanking.map(r=>byKey.get(r.id)).filter(p=>p&&isWomensSeriesWoman(p)&&!p.retired&&p.womensSeriesInvitationDeclined?.[year]!==true);
}
function enforceWomensSeriesQualificationDeadline(date=currentDate){
 const year=womensSeriesYear(date),season=womensSeriesSeason(year,false);if(season?.closed)return;
 const events=tournamentDatabase.filter(isWomensSeriesTournament);if(events.length!==24||typeof isCareerEditorCalendarEmpty==='function'&&isCareerEditorCalendarEmpty())return;
 const deadline=tournamentDatabase.filter(e=>!e.completed&&!isWomensSeriesTournament(e)&&/grand slam|champion's slam|global darts championship|world darts championship/i.test(`${e.sourceName||e.name} ${e.qualifierFor||''}`))
  .map(e=>({event:e,date:womensSeriesEventDate(e,year)})).filter(r=>r.date<=date).sort((a,b)=>a.date-b.date)[0];
 if(!deadline||deadline.event.grandSlamState||deadline.event.worldChampionshipDrawVersion)return;
 for(const event of events){
  if(event.completed||womensSeriesEventDate(event,year)<=date)continue;
  event.womensSeriesRequestedDate ||= {month:event.month,day:event.day};
  event.month=date.getMonth();event.day=date.getDate();event.womensSeriesDeadlineAdjusted=true;
 }
}
function applyWomensSeriesWorldQualification(result,date,tournament,candidates){
 if(tournament?.editorNativeRoutes?.some(r=>r.nativeKey==='women'))return result;
 const year=womensSeriesYear(date),season=womensSeriesSeason(year,false),category=result.categories.find(r=>r.key==='women');
 if(!season?.closed||!category||category.requested!==3)return result;
 const flexibleKeys=new Set(['oomFallback']);
 if(result.categories.some(r=>r.key==='womensWorldMatchplayChampion')){flexibleKeys.add('oom81to128');flexibleKeys.add('native-oom81to128');}
 const flexible=new Set(result.categories.filter(r=>flexibleKeys.has(r.key)).flatMap(r=>r.playerIds));
 const fixed=new Set(result.categories.filter(r=>r.key!=='women'&&!flexibleKeys.has(r.key)).flatMap(r=>r.playerIds));
 const wwmEdition=typeof getWomensWorldMatchplayWorldEdition==='function'?getWomensWorldMatchplayWorldEdition(year):null;
 const wwm=wwmEdition&&typeof getWomensWorldMatchplayChampion==='function'?getWomensWorldMatchplayChampion(wwmEdition.year):null;if(wwm)fixed.add(womensSeriesKey(wwm));
 const selected=getWomensSeriesQualificationPlayers(year,candidates).filter(p=>!fixed.has(womensSeriesKey(p))).slice(0,3);
 const ids=selected.map(womensSeriesKey),byKey=new Map(getWomensSeriesPlayers(candidates).map(p=>[womensSeriesKey(p),p]));
 for(const id of ids){
  if(result.playerIds.includes(id))continue;
  const replacement=[...result.playerIds].reverse().find(k=>flexible.has(k)&&!ids.includes(k));
  if(!replacement)continue;
  result.playerIds.splice(result.playerIds.indexOf(replacement),1,id);
  for(const r of result.categories)if(flexibleKeys.has(r.key)){
   const previous=r.playerIds.length;r.playerIds=r.playerIds.filter(k=>k!==replacement);
   if(previous!==r.playerIds.length){r.requested=Math.max(0,r.requested-1);r.shortfall=Math.max(0,r.requested-r.playerIds.length);}
  }
 }
 category.playerIds=ids.filter(id=>result.playerIds.includes(id));category.shortfall=3-category.playerIds.length;
 for(const r of result.categories)if(flexibleKeys.has(r.key))r.playerIds=r.playerIds.filter(k=>!category.playerIds.includes(k));
 result.participants=result.playerIds.map(k=>byKey.get(k)).filter(Boolean);result.players=result.participants;
 if(!tournament?.worldQualificationProjection)season.qualifications.worldChampionship=category.playerIds;
 return result;
}
const WOMENS_SERIES_POPULATION_TARGET=128;
function ensureWomensSeriesPopulation(date=currentDate,{reason='career-start',existingNames=null}={}){
 if(!tournamentDatabase?.some(isWomensSeriesTournament)||typeof isCareerEditorCalendarEmpty==='function'&&isCareerEditorCalendarEmpty())return [];
 if(typeof getCareerCalendarEditorState==='function'&&getCareerCalendarEditorState().tours.some(t=>t.id==='womensSeries'&&t.removed))return [];
 const year=womensSeriesYear(date),season=womensSeriesSeason(year);
 if(season.population||date>new Date(year,0,31)&&reason!=='annual')return [];
 const names=existingNames||new Set(getWomensSeriesPlayers().map(p=>p.name)),before=getWomensSeriesEligiblePlayers(null,date).length,added=[];
 for(let i=before;i<WOMENS_SERIES_POPULATION_TARGET;i++){
  const p=createAnnualNewgen(year,names,Math.random,null,{gender:'female',entryAge:17+Math.floor(Math.random()*9),exactEntryAge:true});
  p.womensSeriesEligible=true;p.womensSeriesRecruit=true;pdcPlayers.push(p);added.push(p);
 }
 season.population={year,reason,target:WOMENS_SERIES_POPULATION_TARGET,eligibleBefore:before,recruitIds:added.map(womensSeriesKey)};return added;
}
function getWomensWorldMatchplayQualifyingRanking(year=womensSeriesYear(),candidates=null){
 if(typeof getWomensWorldMatchplayLedgerRows==='function')return getWomensWorldMatchplayLedgerRows(year,candidates);
 return {year,complete:false,missingPrevious:[17,18,19,20,21,22,23,24],missingCurrent:Array.from({length:16},(_,i)=>i+1),rows:[],priorityPlayers:[],projectedField:[],diagnostic:'matchplay-module-unavailable'};
}
