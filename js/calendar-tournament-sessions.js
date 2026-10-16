// Persist only parked tournament state. Never park a live match or duplicate players.
function isSeniorWorldMatchplayTournament(event){
 if(!event||typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(event))return false;
 return /^(?:Global|World|PDC World) Matchplay$/i.test(event.sourceName||event.name||'');
}
function isPlayersChampionshipFinalsSessionTournament(event){
 if(!event||!/^(?:Pro Players Finals|(?:PDC )?Players Championship Finals)$/i.test(event.sourceName||event.name||''))return false;
 if(typeof hasTournamentEditorQualification==='function'&&hasTournamentEditorQualification(event)
  ||typeof hasCareerTourEntryOverride==='function'&&hasCareerTourEntryOverride(event))return false;
 return true;
}
function isCalendarSessionTournament(event){return isSeniorWorldMatchplayTournament(event)||isPlayersChampionshipFinalsSessionTournament(event);}
function isWorldYouthFinalCalendarSession(event){return event?.specialType==='worldYouth'&&event.worldYouthPhase==='final';}
function getPlayersChampionshipFinalsYouthSession(event){
 if(!isPlayersChampionshipFinalsSessionTournament(event)||event.editorDisabled)return null;
 return tournamentDatabase.find(candidate=>isWorldYouthFinalCalendarSession(candidate)&&!candidate.editorDisabled&&!candidate.editorModified
  &&candidate.month===(event.endMonth??event.month)&&candidate.day===(event.endDay??event.day))||null;
}
function getCalendarTournamentSessionDate(event,round=tournamentRound,year=currentDate.getFullYear()){
 const start=new Date(year,event.month,event.day),end=new Date(year,event.endMonth??event.month,event.endDay??event.day);
 const fractions=isPlayersChampionshipFinalsSessionTournament(event)?{64:0,32:0.5,16:0.5,8:1,4:1,2:1}:{32:0,16:0.5,8:0.75,4:0.875,2:1};
 return new Date(start.getTime()+Math.floor(Math.max(0,(end-start)/86400000)*(fractions[round]??0))*86400000);
}
function getCareerCalendarSessions(){player.calendarTournamentSessions ||= {version:1,parked:{},log:[]};return player.calendarTournamentSessions;}
function getCalendarSessionKey(event,year=currentDate.getFullYear()){return `${year}:${event.sourceName||event.name}`;}
function getParkedCalendarTournament(event){return player?.calendarTournamentSessions?.parked?.[getCalendarSessionKey(event)]||null;}
function calendarTournamentSessionScheduledForDate(event,date=currentDate){
 const held=getParkedCalendarTournament(event);
 return Boolean(held&&held.readyAt===new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime());
}
function calendarTournamentReady(event,date=currentDate){
 const held=getParkedCalendarTournament(event);if(held&&held.readyAt>date.getTime())return false;
 if(typeof currentMatch!=='undefined'&&currentMatch&&typeof activeTournament!=='undefined'&&activeTournament!==event
  &&[event,activeTournament].some(candidate=>isPlayersChampionshipFinalsSessionTournament(candidate)||isWorldYouthFinalCalendarSession(candidate)))return false;
 if(isWorldYouthFinalCalendarSession(event)&&!event.completed){
  if(new Date(date.getFullYear(),event.month,event.day)>date)return false;
  const host=tournamentDatabase.find(candidate=>getPlayersChampionshipFinalsYouthSession(candidate)===event);
  if(host&&!host.completed&&getParkedCalendarTournament(host)?.round!==2)return false;
 }
 if(held?.round===2){const youth=getPlayersChampionshipFinalsYouthSession(event);if(youth&&!youth.completed)return false;}
 return true;
}
function calendarTournamentSessionOrder(event){
 if(typeof isWomensSeriesTournament==='function'&&isWomensSeriesTournament(event))return 0;
 if(typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(event))return 1;
 if(isWorldYouthFinalCalendarSession(event))return 1;
 if(isPlayersChampionshipFinalsSessionTournament(event)&&getParkedCalendarTournament(event)?.round===2)return 3;
 if(isSeniorWorldMatchplayTournament(event)&&getParkedCalendarTournament(event)?.round===2)return 3;
 return 2;
}
function parkCalendarTournamentAfterRound(event=activeTournament){
 if(!isCalendarSessionTournament(event)||!event.endDay&&!isPlayersChampionshipFinalsSessionTournament(event)||tournamentBracket.length<=1)return false;
 const ready=getCalendarTournamentSessionDate(event,tournamentRound);
 const women=typeof getWomensWorldMatchplayEvent==='function'?getWomensWorldMatchplayEvent():null;
 const womenBeforeFinal=isSeniorWorldMatchplayTournament(event)&&tournamentRound===2&&women&&!women.completed
  &&new Date(currentDate.getFullYear(),women.month,women.day).getTime()===ready.getTime()&&ready<=currentDate;
 const youth=getPlayersChampionshipFinalsYouthSession(event);
 const youthBeforeFinal=tournamentRound===2&&youth&&!youth.completed&&ready<=currentDate;
 if(ready<=currentDate&&!womenBeforeFinal&&!youthBeforeFinal)return false;
 const state=getCareerCalendarSessions(),key=getCalendarSessionKey(event);
 state.parked[key]={version:1,year:currentDate.getFullYear(),eventKey:event.sourceName||event.name,readyAt:ready.getTime(),round:tournamentRound,
  participants:(event.calendarSessionParticipants||[]),bracket:tournamentBracket.map(p=>p.isBye?{isBye:true,name:'(BYE)'}:getPlayerSaveReference(p)),
  matchHistory:structuredClone(tournamentMatchHistory),lastTournamentResults,currentRoundHTML,preTournamentRanks:structuredClone(preTournamentRanks),
  session:tournamentRound===2?'evening':'round',skipping:isSkippingTournament===true};
 event.calendarSessionParticipants ||= state.parked[key].bracket.map(r=>r.id).filter(Boolean);
 state.log.push({eventKey:key,action:'park',round:tournamentRound,at:currentDate.getTime(),readyAt:ready.getTime()});
 activeTournament=null;tournamentBracket=[];tournamentMatchHistory=null;lastTournamentResults='';currentRoundHTML='';preTournamentRanks={};isSkippingTournament=false;
 return 'calendarSession';
}
function resumeCalendarTournamentSession(event){
 const held=getParkedCalendarTournament(event);if(!held)return false;
 if(!calendarTournamentReady(event)||currentMatch)return false;
 const bracket=held.bracket.map(p=>p.isBye?p:resolveLoadedPlayer(p));
 if(bracket.some(p=>!p))throw new Error('Saved tournament participant is unavailable; the final has not been redrawn.');
 activeTournament=event;tournamentBracket=bracket;tournamentRound=held.round;
 tournamentMatchHistory=held.matchHistory;lastTournamentResults=held.lastTournamentResults||'';currentRoundHTML=held.currentRoundHTML||'';preTournamentRanks=held.preTournamentRanks||{};
 // A previous day's skip never authorises skipping the player's next match.
 isSkippingTournament=false;event.calendarSession=held.session;
 const state=getCareerCalendarSessions();delete state.parked[getCalendarSessionKey(event)];
 state.log.push({eventKey:getCalendarSessionKey(event),action:'resume',round:held.round,at:currentDate.getTime(),session:held.session});return true;
}
function concludeCalendarSessionPause(){
 currentMatch=null;
 for(const id of ['bracket-modal','results-modal','tile-tournament']){const element=document.getElementById(id);if(element)element.style.display='none';}
 if(typeof updateHub==='function')updateHub();if(typeof showScreen==='function')showScreen('screen-hub');if(typeof saveGame==='function')saveGame(true);return true;
}
