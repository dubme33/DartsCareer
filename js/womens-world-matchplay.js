// One rolling ranking (Women's Series ledger), isolated non-ranking championship.
const WOMENS_WORLD_MATCHPLAY_TYPE='womensWorldMatchplay';
const WOMENS_WORLD_MATCHPLAY_NAME="PDC Women's World Matchplay";
const WOMENS_WORLD_MATCHPLAY_PRIZES=Object.freeze({winner:15000,2:8000,4:4500,8:2000});
const WOMENS_WORLD_MATCHPLAY_SEED_ORDER=Object.freeze([1,8,4,5,2,7,3,6]);
function isWomensWorldMatchplayTournament(value=typeof activeTournament!=='undefined'?activeTournament:null){
 const event=typeof value==='string'?(typeof getTournamentForPrizeRules==='function'?getTournamentForPrizeRules(value):null):value;
 return Boolean(event&&(event.womensWorldMatchplay===true||event.specialType===WOMENS_WORLD_MATCHPLAY_TYPE
  ||event.tournamentId==='pdc-womens-world-matchplay'||event.sourceName===WOMENS_WORLD_MATCHPLAY_NAME));
}
function womensWorldMatchplayEdition(year=womensSeriesYear(),create=false){
 if(!player)return null;
 if(create){player.womensWorldMatchplayEditions ||= {};player.womensWorldMatchplayEditions[year] ||= {
  version:1,year,phase:'qualification',participants:[],seeds:[],matches:[],payouts:{},identities:{},diagnostics:[],newsKeys:[]};}
 return player.womensWorldMatchplayEditions?.[year]||null;
}
function womensWorldMatchplayPlayers(candidates=null){return getWomensSeriesPlayers(candidates);}
function resolveWomensWorldMatchplayPlayer(id,candidates=null){return womensWorldMatchplayPlayers(candidates).find(p=>womensSeriesKey(p)===String(id))||null;}
function isWomensWorldMatchplayEligible(p,date=currentDate){
 return p&&!p.isBye&&isWomensSeriesWoman(p)&&!p.retired
  &&(getDevelopmentTourExactAge(p,date)??getDevelopmentTourSeasonAge(p,date))>=16
  &&!(typeof isPdcParticipationRestricted==='function'&&isPdcParticipationRestricted(p,date.getFullYear()))
  &&p.womensSeriesBanned!==true&&!(Number(p.womensSeriesBanUntil)>date.getTime());
}
function getWomensWorldMatchplayEvent(year=womensSeriesYear()){
 return tournamentDatabase.find(e=>isWomensWorldMatchplayTournament(e)&&(!e.womensWorldMatchplayYear||e.womensWorldMatchplayYear===year))||null;
}
function getWomensWorldMatchplayJulyFallback(calendar,year){
 const candidates=Array.from({length:31},(_,i)=>new Date(year,6,i+1)).sort((a,b)=>Math.abs(a.getDate()-26)-Math.abs(b.getDate()-26)||a-b);
 return candidates.find(date=>!calendar.some(e=>!isWomensWorldMatchplayTournament(e)&&!isWomensSeriesTournament(e)
  &&date>=new Date(year,e.month,e.day)&&date<=new Date(year,e.endMonth??e.month,e.endDay??e.day)))||new Date(year,6,26);
}
function ensureWomensWorldMatchplayCalendar(calendar=tournamentDatabase,date=currentDate,{migration=false}={}){
    if (typeof applyCompetitionCalendarNames === 'function') applyCompetitionCalendarNames(calendar);
 if(!Array.isArray(calendar)||!player||typeof isCareerEditorCalendarEmpty==='function'&&isCareerEditorCalendarEmpty())return calendar;
 if(typeof getCareerCalendarEditorState==='function'&&getCareerCalendarEditorState().tours.some(t=>t.id==='womensWorldMatchplay'&&t.removed))return calendar;
 const year=date.getFullYear();let event=calendar.find(isWomensWorldMatchplayTournament);
 if(!event&&!calendar.some(isWomensSeriesTournament))return calendar;
 if(!event&&player.tournamentEditorDeletedKeys?.includes(WOMENS_WORLD_MATCHPLAY_NAME))return calendar;
 const senior=calendar.find(e=>typeof isSeniorWorldMatchplayTournament==='function'&&isSeniorWorldMatchplayTournament(e));
 const seniorDate=senior?new Date(year,senior.endMonth??senior.month,senior.endDay??senior.day):null;
 const scheduled=seniorDate?.getMonth()===6?seniorDate:getWomensWorldMatchplayJulyFallback(calendar,year);
 if(!event){event={name:typeof competitionName==='function'?competitionName('womensWorldMatchplay'):"Women's Global Matchplay",sourceName:WOMENS_WORLD_MATCHPLAY_NAME,
  specialType:WOMENS_WORLD_MATCHPLAY_TYPE,womensWorldMatchplay:true,tournamentId:'pdc-womens-world-matchplay',
  month:scheduled.getMonth(),day:scheduled.getDate(),format:'legs',minOvr:0,city:'Blackpool',country:'Anglia',venue:'Winter Gardens',rankingOverride:false};calendar.push(event);}
 const previousEdition=womensWorldMatchplayEdition(year);
 if(!event.editorModified&&(event.womensWorldMatchplayYear!==year||!previousEdition||['qualification','qualified'].includes(previousEdition.phase))){event.month=scheduled.getMonth();event.day=scheduled.getDate();}
 event.womensWorldMatchplay=true;event.womensWorldMatchplayYear=year;event.session='afternoon';event.rankingOverride=false;
 if(!senior||seniorDate.getMonth()!==6)event.womensWorldMatchplayDateReason=senior?'senior-matchplay-outside-july-fallback':'senior-matchplay-unavailable-july-fallback';
 else if(!event.editorModified)event.womensWorldMatchplayDateReason='senior-matchplay-final-day';
 const edition=womensWorldMatchplayEdition(year,true);
 if(!edition.date||['qualification','qualified'].includes(edition.phase))edition.date=new Date(year,event.month,event.day).getTime();
 edition.eventKey ||= event.sourceName||event.name;
 if(edition.phase==='completed')event.completed=true;
 if(migration&&edition.phase==='qualification'&&edition.date<new Date(year,date.getMonth(),date.getDate()).getTime()){
  event.completed=true;event.womensWorldMatchplayMigrationSkipped=true;edition.phase='legacy-skipped';
  if(!edition.diagnostics.includes('past-edition-not-backfilled'))edition.diagnostics.push('past-edition-not-backfilled');
 }
 if(edition.phase==='qualification'&&Array.from({length:16},(_,i)=>i+1).every(n=>womensSeriesSeason(year,false)?.events?.[n]?.completed))freezeWomensWorldMatchplayField(event);
 return calendar;
}
function enforceWomensWorldMatchplayCutoff(date=currentDate){
 const event=getWomensWorldMatchplayEvent(),edition=womensWorldMatchplayEdition();
 if(!event||event.completed||edition?.seeds.length||new Date(date.getFullYear(),event.month,event.day)>date)return;
 const pending=tournamentDatabase.filter(e=>isWomensSeriesTournament(e)&&e.womensSeriesEvent<=16&&!e.completed);
 if(pending.length&&edition&&!edition.diagnostics.includes('ws-cutoff-session-order-adjusted'))edition.diagnostics.push('ws-cutoff-session-order-adjusted');
 for(const ws of pending){
  if(new Date(date.getFullYear(),ws.month,ws.day)<=date)continue;
  ws.womensWorldMatchplayRequestedDate ||= {month:ws.month,day:ws.day};ws.month=date.getMonth();ws.day=date.getDate();
 }
}
function getWomensWorldMatchplayLedgerRows(year,candidates=null){
 const previous=womensSeriesSeason(year-1,false),current=womensSeriesSeason(year,false);
 const missingPrevious=Array.from({length:8},(_,i)=>i+17).filter(n=>!previous?.events?.[n]?.completed);
 const missingCurrent=Array.from({length:16},(_,i)=>i+1).filter(n=>!current?.events?.[n]?.completed);
 const ordered=[...[...(Object.values(current?.events||{}))].filter(e=>e.completed&&e.number<=16).sort((a,b)=>b.date-a.date||b.number-a.number).map(e=>[year,e.number]),
  ...Object.values(previous?.events||{}).filter(e=>e.completed&&e.number>=17&&e.number<=24).sort((a,b)=>b.date-a.date||b.number-a.number).map(e=>[year-1,e.number])];
 const amount=(p,y,n)=>Number((p.womensSeriesPrizeHistory||[]).find(e=>e.year===y&&e.event===n)?.rankingAmount)||0;
 const rows=womensWorldMatchplayPlayers(candidates).filter(isWomensSeriesWoman).map(p=>({player:p,
  money:ordered.reduce((sum,[y,n])=>sum+amount(p,y,n),0),countback:ordered.map(([y,n])=>amount(p,y,n))}));
 const compare=(a,b)=>b.money-a.money||b.countback.slice(0,4).reduce((s,n)=>s+n,0)-a.countback.slice(0,4).reduce((s,n)=>s+n,0)
  ||a.countback.reduce((diff,n,i)=>diff||b.countback[i]-n,0);
 rows.sort((a,b)=>compare(a,b)||womensSeriesKey(a.player).localeCompare(womensSeriesKey(b.player)));
 const direct=getPdcTourCardHolders(womensWorldMatchplayPlayers(candidates)).filter(p=>isWomensWorldMatchplayEligible(p)).sort(comparePdcTourCardRanking),ids=new Set(direct.map(womensSeriesKey));
 return {year,complete:!missingPrevious.length&&!missingCurrent.length,missingPrevious,missingCurrent,rows,priorityPlayers:direct,
  projectedField:[...direct,...rows.map(r=>r.player).filter(p=>!ids.has(womensSeriesKey(p))&&isWomensWorldMatchplayEligible(p))].slice(0,8),
  historicalStatus:missingPrevious.length?'unavailable':'complete',
  diagnostic:missingPrevious.length?'missing-previous-season-ledger':missingCurrent.length?'qualifying-period-in-progress':null,
  compare,countbackRule:'last-four-events-then-event-by-event-with-sporting-decider'};
}
function freezeWomensWorldMatchplayField(event=getWomensWorldMatchplayEvent()){
 if(!event)return null;const edition=womensWorldMatchplayEdition(event.womensWorldMatchplayYear||womensSeriesYear(),true);
 if(edition.seeds.length||edition.phase==='completed'||edition.phase==='legacy-skipped')return edition;
 const ranking=getWomensWorldMatchplayQualifyingRanking(edition.year);
 if(ranking.missingCurrent.length)return edition;
 let field=[...ranking.projectedField];if(field.length!==8){edition.diagnostics.push('fewer-than-eight-eligible-women');return edition;}
 // ID orders are display stability only. Resolve all seeded ties by recorded
 // sporting deciders, using the existing Women's Series playoff principle.
 field.sort((a,b)=>ranking.compare(ranking.rows.find(r=>r.player===a),ranking.rows.find(r=>r.player===b)));
 edition.countbackPlayoffs ||= [];
 const groups=[];for(const p of field){const last=groups.at(-1);if(last&&ranking.compare(ranking.rows.find(r=>r.player===last[0]),ranking.rows.find(r=>r.player===p))===0)last.push(p);else groups.push([p]);}
 const boundary=ranking.rows.filter(r=>isWomensWorldMatchplayEligible(r.player)&&!ranking.priorityPlayers.some(p=>samePlayer(p,r.player)));
 const remaining=Math.max(0,8-Math.min(8,ranking.priorityPlayers.length));
 if(remaining&&boundary[remaining-1]){
  const tie=boundary.filter(r=>ranking.compare(r,boundary[remaining-1])===0).map(r=>r.player);
  if(tie.length>1){const order=settleWomensWorldMatchplayTie(tie,edition);const tiedIds=new Set(tie.map(womensSeriesKey));
   const fixed=boundary.slice(0,remaining).filter(r=>!tiedIds.has(womensSeriesKey(r.player))).map(r=>r.player);
   field=[...ranking.priorityPlayers.slice(0,8),...fixed,...order.slice(0,remaining-fixed.length)].slice(0,8);
   field.sort((a,b)=>ranking.compare(ranking.rows.find(r=>r.player===a),ranking.rows.find(r=>r.player===b)));
  }
 }
 const seedGroups=[];for(const p of field){const last=seedGroups.at(-1);if(last&&ranking.compare(ranking.rows.find(r=>r.player===last[0]),ranking.rows.find(r=>r.player===p))===0)last.push(p);else seedGroups.push([p]);}
 field=seedGroups.flatMap(g=>g.length>1?settleWomensWorldMatchplayTie(g,edition):g);
 edition.seeds=field.map(womensSeriesKey);edition.participants=[...edition.seeds];edition.phase='qualified';edition.frozenAt=currentDate.getTime();
 edition.rankingSnapshot=ranking.rows.map((r,i)=>({id:womensSeriesKey(r.player),name:r.player.name,country:r.player.country,rank:i+1,money:r.money,countback:r.countback}));
 edition.priorityIds=ranking.priorityPlayers.slice(0,8).map(womensSeriesKey);edition.missingPrevious=ranking.missingPrevious;edition.missingCurrent=[];edition.historicalStatus=ranking.historicalStatus;edition.countbackRule=ranking.countbackRule;
 for(const p of field)edition.identities[womensSeriesKey(p)]={name:p.name,country:p.country,templateIndex:typeof getLifecycleTemplateIndex==='function'?getLifecycleTemplateIndex(p):null};
 recordWomensWorldMatchplayNews('field',edition,event);return edition;
}
function settleWomensWorldMatchplayTie(group,edition){
 const ids=group.map(womensSeriesKey),saved=edition.countbackPlayoffs.find(e=>e.ids.length===ids.length&&e.ids.every(id=>ids.includes(id)));
 if(saved)return saved.order.map(id=>group.find(p=>womensSeriesKey(p)===id));
 // Pairwise insertion with a proper FT4 match; no OOM, ID or random draw decides.
 const order=[],matches=[];for(const p of group){let index=0;while(index<order.length){const q=order[index],r=simulateAImatch(p,q,{type:'legs',legsToWin:4});matches.push({p1:womensSeriesKey(p),p2:womensSeriesKey(q),score:[r.p1Score,r.p2Score],winner:womensSeriesKey(r.winner)});if(r.winner===p)break;index++;}order.splice(index,0,p);}
 edition.countbackPlayoffs.push({ids,order:order.map(womensSeriesKey),matches});return order;
}
function initializeWomensWorldMatchplayDraw(event){
 const edition=freezeWomensWorldMatchplayField(event);if(!edition?.seeds.length)return [];
 const draw=WOMENS_WORLD_MATCHPLAY_SEED_ORDER.map(seed=>resolveWomensWorldMatchplayPlayer(edition.seeds[seed-1]));
 if(draw.some(p=>!p)){edition.diagnostics.push('saved-participant-missing-from-database');return [];}
 edition.draw ||= draw.map(womensSeriesKey);edition.phase='quarterfinal';
 if(typeof setTournamentSeedPlayerKeys==='function')setTournamentSeedPlayerKeys(event,edition.seeds.map(id=>getTournamentSeedPlayerKey(resolveWomensWorldMatchplayPlayer(id))));
 recordWomensWorldMatchplayNews('preview',edition,event);return draw;
}
function getWomensWorldMatchplayPrize(round,won,event=getWomensWorldMatchplayEvent()){
 const key=won&&Number(round)===2?'winner':String(round),custom=event?.editorPrizes?.[key];
 return Number.isFinite(custom)&&custom>=0?custom:WOMENS_WORLD_MATCHPLAY_PRIZES[key]||0;
}
function recordWomensWorldMatchplayMatch(event,round,p1,p2,result){
 if(!isWomensWorldMatchplayTournament(event)||!result?.winner)return;
 const edition=womensWorldMatchplayEdition(event.womensWorldMatchplayYear||womensSeriesYear(),true),key=`${round}:${womensSeriesKey(p1)}:${womensSeriesKey(p2)}`;
 if(edition.matches.some(m=>m.key===key))return;
 const loser=result.winner===p1?p2:p1;
 edition.matches.push({key,round:Number(round),p1:womensSeriesKey(p1),p2:womensSeriesKey(p2),winner:womensSeriesKey(result.winner),loser:womensSeriesKey(loser),
  score:[Number(result.p1Score)||0,Number(result.p2Score)||0],date:currentDate.getTime(),walkover:result.walkover===true});
 if(Number(round)===2){edition.champion=womensSeriesKey(result.winner);edition.runnerUp=womensSeriesKey(loser);edition.finalScore=result.winner===p1?[result.p1Score,result.p2Score]:[result.p2Score,result.p1Score];edition.finalDate=currentDate.getTime();}
}
function claimWomensWorldMatchplayPrize(p,amount,event){
 if(!isWomensWorldMatchplayTournament(event)||p?.isBye)return false;
 const edition=womensWorldMatchplayEdition(event.womensWorldMatchplayYear||womensSeriesYear(),true),id=womensSeriesKey(p);
 if(edition.payouts[id]||!edition.participants.includes(id))return false;
 const result=edition.matches.find(m=>m.loser===id),won=edition.champion===id;
 if(!won&&!result)return false;
 edition.payouts[id]={amount,round:won?2:result.round,won,date:currentDate.getTime()};
 p.womensWorldMatchplayEarnings=(Number(p.womensWorldMatchplayEarnings)||0)+amount;return true;
}
function completeWomensWorldMatchplayTournament(event,winner){
 if(!isWomensWorldMatchplayTournament(event))return;
 const edition=womensWorldMatchplayEdition(event.womensWorldMatchplayYear||womensSeriesYear(),true);if(edition.phase==='completed')return;
 edition.champion=womensSeriesKey(winner);edition.phase='completed';edition.completedAt=currentDate.getTime();
 const world=getWomensWorldMatchplayWorldTarget(),worldDate=world?new Date(edition.year,world.month,world.day):null;
 edition.totalPaid=Object.values(edition.payouts).reduce((s,p)=>s+p.amount,0);edition.qualifications={grandSlam:edition.year,
  worldChampionship:worldDate?(worldDate>=currentDate&&!world.completed&&!world.worldChampionshipDrawVersion?edition.year:edition.year+1):null};
 edition.matchHistory=event.matchHistory;recordWomensWorldMatchplayNews('champion',edition,event);
 refreshWomensWorldMatchplayReplacementQualification(currentDate);
}
function advanceWomensWorldMatchplayStage(event){
 if(!isWomensWorldMatchplayTournament(event))return;
 const edition=womensWorldMatchplayEdition();edition.phase=tournamentRound===4?'semifinal':tournamentRound===2?'final':edition.phase;
 if(tournamentRound===4)recordWomensWorldMatchplayNews('quarterfinals',edition,event);
 if(tournamentRound===2)recordWomensWorldMatchplayNews('final',edition,event);
}
function getWomensWorldMatchplayChampion(year=womensSeriesYear()){
 if(typeof getCareerCalendarEditorState==='function'&&getCareerCalendarEditorState().tours.some(t=>t.id==='womensWorldMatchplay'&&t.removed))return null;
 const edition=womensWorldMatchplayEdition(year),event=tournamentDatabase.find(isWomensWorldMatchplayTournament);
 return edition?.phase==='completed'&&event&&!event.womensWorldMatchplayMigrationSkipped?resolveWomensWorldMatchplayPlayer(edition.champion):null;
}
function recordWomensWorldMatchplayNews(kind,edition,event){
 if(!edition||typeof newsOffer!=='function'||typeof newsPerson!=='function'||edition.newsKeys.includes(kind))return;
 const actor=resolveWomensWorldMatchplayPlayer(edition.champion||edition.seeds[0]);if(!actor)return;
 newsOffer('preview',`wwm:${edition.year}:${kind}`,{actor:newsPerson(actor),tournament:newsTournamentSnapshot(event),kind:`wwm-${kind}`,year:edition.year,
  amount:edition.participants.length,names:edition.seeds.map(id=>resolveWomensWorldMatchplayPlayer(id)?.name||edition.identities[id]?.name||id).join(', ')});
 edition.newsKeys.push(kind);
}
function getWomensWorldMatchplayWorldTarget(){return tournamentDatabase.find(e=>!e.qualifierFor&&/global darts championship|world darts championship/i.test(e.sourceName||e.name));}
function getWomensWorldMatchplayWorldEdition(year=womensSeriesYear()){
 return Object.values(player?.womensWorldMatchplayEditions||{}).filter(e=>e.phase==='completed'
  &&(e.qualifications?.worldChampionship??e.year)===year).sort((a,b)=>(b.finalDate||0)-(a.finalDate||0))[0]||null;
}
function getWomensWorldMatchplayOtherWorldRoutes(date=currentDate,candidates=null,target=getWomensWorldMatchplayWorldTarget()){
 if(!target)return null;
 // Ignore both optional champion slots while discovering independent routes.
 // Otherwise the Youth and WWM vacancy refreshes would call each other.
 return buildWorldChampionshipQualification(womensWorldMatchplayPlayers(candidates),date,{...target,worldYouthIgnoreSlot:true,womensWorldMatchplayIgnoreSlot:true,worldQualificationProjection:true});
}
function hasWomensWorldMatchplayOtherWorldRoute(edition,result){
 return result.categories.some(c=>!['oomFallback','women','womensWorldMatchplayChampion'].includes(c.key)&&c.playerIds.includes(edition.champion));
}
function applyWomensWorldMatchplayWorldQualification(result,date,tournament,candidates=null){
 const edition=getWomensWorldMatchplayWorldEdition(date.getFullYear()),champion=edition?getWomensWorldMatchplayChampion(edition.year):null;
 if(tournament?.womensWorldMatchplayIgnoreSlot||!edition||!champion)return result;
 const elsewhere=hasWomensWorldMatchplayOtherWorldRoute(edition,result);
 edition.seniorWorldRoute=edition.seniorWorldDeclined||elsewhere?'tourCardQualifier':'champion';
 const winner=edition.seniorWorldRoute==='champion'?champion:resolveWomensWorldMatchplayPlayer(edition.seniorReplacementWinner,candidates);
 if(edition.seniorWorldRoute==='tourCardQualifier'&&!edition.seniorReplacementWinner)scheduleWomensWorldMatchplayReplacementQualifier(edition);
 const ids=new Set(result.playerIds);
 if(edition.seniorWorldRoute==='champion'&&ids.has(edition.champion)){
  for(const category of result.categories)if(category.key==='oomFallback')category.playerIds=category.playerIds.filter(id=>id!==edition.champion);
 }else if(result.participants.length>=128){
  const flexible=[...result.categories].reverse().find(c=>['oomFallback','oom81to128','native-oom81to128'].includes(c.key)&&c.playerIds.some(id=>id!==edition.champion&&id!==womensSeriesKey(winner)));
  if(!flexible){if(!edition.diagnostics.includes('world-no-flexible-place'))edition.diagnostics.push('world-no-flexible-place');return result;}
  const removed=flexible.playerIds.splice(flexible.playerIds.findLastIndex(id=>id!==edition.champion&&id!==womensSeriesKey(winner)),1)[0];
  flexible.requested=Math.max(0,flexible.requested-1);result.participants=result.participants.filter(p=>womensSeriesKey(p)!==removed);
 }
 if(winner&&!result.participants.some(p=>samePlayer(p,winner)))result.participants.push(winner);
 result.playerIds=result.participants.map(womensSeriesKey);
 result.categories.push({key:'womensWorldMatchplayChampion',label:edition.seniorWorldRoute==='champion'?WOMENS_WORLD_MATCHPLAY_NAME:'Women’s World Matchplay — Tour Card Holder Qualifier',
  requested:1,playerIds:winner?[womensSeriesKey(winner)]:[],shortfall:winner?0:1});
 result.complete=result.playerIds.length>=128;result.shortfall=Math.max(0,128-result.playerIds.length);return result;
}
function scheduleWomensWorldMatchplayReplacementQualifier(edition=womensWorldMatchplayEdition()){
 if(!edition?.champion||edition.phase!=='completed'||!tournamentDatabase.some(isWomensWorldMatchplayTournament))return null;
 const target=getWomensWorldMatchplayWorldTarget(),qualificationYear=edition.qualifications?.worldChampionship??edition.year;
 const reference=qualificationYear>currentDate.getFullYear()?new Date(qualificationYear,target?.month??11,target?.day??10):currentDate;
 const raw=getWomensWorldMatchplayOtherWorldRoutes(reference,null,target);if(!target||!raw)return null;
 if(!edition.seniorWorldDeclined&&!hasWomensWorldMatchplayOtherWorldRoute(edition,raw)){edition.seniorWorldRoute='champion';return null;}
 edition.seniorWorldRoute='tourCardQualifier';
 let qualifier=tournamentDatabase.find(e=>e.womensWorldMatchplayVacancy&&e.womensWorldMatchplayYear===edition.year);
 if(qualifier)return qualifier;
 const deadline=new Date(qualificationYear,target.month,target.day),date=new Date(currentDate);date.setDate(date.getDate()+1);
 if(date>=deadline)date.setTime(currentDate.getTime());
 if(date>=deadline){if(!edition.diagnostics.includes('world-qualification-deadline'))edition.diagnostics.push('world-qualification-deadline');return null;}
 qualifier={name:typeof competitionDisplayText==='function'?competitionDisplayText('Women’s World Matchplay — Tour Card Holder Qualifier'):"Women's Global Matchplay — Tour Card Holder Qualifier",sourceName:'Women’s World Matchplay — Tour Card Holder Qualifier',
  specialType:'pdcTourCardQualifier',womensWorldMatchplayVacancy:true,womensWorldMatchplayYear:edition.year,womensWorldMatchplayQualifierScheduleYear:date.getFullYear(),qualifierFor:target.name,qualifyingPlaces:1,
  month:date.getMonth(),day:date.getDate(),format:'legs',rankingOverride:false,minOvr:0,city:'Wigan',country:'Anglia'};
 tournamentDatabase.push(qualifier);
 if(qualificationYear===currentDate.getFullYear()&&!target.completed&&!target.worldChampionshipDrawVersion)delete target.worldChampionshipQualification;
 return qualifier;
}
function refreshWomensWorldMatchplayReplacementQualification(date=currentDate){
 const target=getWomensWorldMatchplayWorldTarget(),edition=womensWorldMatchplayEdition(date.getFullYear())?.phase==='completed'?womensWorldMatchplayEdition(date.getFullYear()):getWomensWorldMatchplayWorldEdition(date.getFullYear());
 const qualificationYear=edition?.qualifications?.worldChampionship??edition?.year;
 if(!edition||edition.phase!=='completed'||edition.seniorReplacementWinner||!target
  ||qualificationYear<date.getFullYear()||qualificationYear===date.getFullYear()&&(target.completed||target.worldChampionshipDrawVersion)
  ||date>=new Date(qualificationYear,target.month,target.day))return;
 scheduleWomensWorldMatchplayReplacementQualifier(edition);
}
function ensureWomensWorldMatchplayQualifierState(event,candidates=womensWorldMatchplayPlayers()){
 const edition=womensWorldMatchplayEdition(event.womensWorldMatchplayYear||womensSeriesYear());if(!edition)return null;
 if(event.womensWorldMatchplayQualification?.locked||event.womensWorldMatchplayQualification?.completed)return event.womensWorldMatchplayQualification;
 const target=getWomensWorldMatchplayWorldTarget(),year=edition.qualifications?.worldChampionship??edition.year;
 const reference=year>currentDate.getFullYear()?new Date(year,target.month,target.day):currentDate;
 const base=getWomensWorldMatchplayOtherWorldRoutes(reference,candidates),generic=[...base.categories].reverse().find(c=>['oomFallback','oom81to128','native-oom81to128'].includes(c.key)&&c.playerIds.some(k=>k!==edition.champion));
 const flexible=base.playerIds.length>=128?generic?.playerIds.findLast(k=>k!==edition.champion):null;
 const automatic=base.playerIds.filter(k=>k!==flexible),holders=getPdcTourCardHolders(candidates).filter(p=>!automatic.includes(womensSeriesKey(p)));
 return event.womensWorldMatchplayQualification={version:1,year,qualifyingPlaces:1,automaticPlayerIds:automatic,
  qualifierPlayerIds:holders.map(womensSeriesKey),qualifiedPlayerIds:[],categories:[],completed:false,locked:false};
}
function declineWomensWorldMatchplayWorldPlace(year=womensSeriesYear()){
 const edition=womensWorldMatchplayEdition(year),target=getWomensWorldMatchplayWorldTarget();
 const qualificationYear=edition?.qualifications?.worldChampionship??year;
 if(!edition?.champion||edition.seniorReplacementWinner||!target
  ||qualificationYear===currentDate.getFullYear()&&(target.completed||target.worldChampionshipDrawVersion)
  ||currentDate>=new Date(qualificationYear,target.month,target.day))return false;
 edition.seniorWorldDeclined=true;scheduleWomensWorldMatchplayReplacementQualifier(edition);saveGame(true);return true;
}
