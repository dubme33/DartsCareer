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
 const ownMatch=Boolean(currentMatch&&!currentMatch.isSpectator);
 currentMatch=null;
 for(const id of ['bracket-modal','results-modal','tile-tournament']){const element=document.getElementById(id);if(element)element.style.display='none';}
 if(typeof updateHub==='function')updateHub();if(typeof showScreen==='function')showScreen('screen-hub');
 refreshCalendarSessionHub();
 if(ownMatch)showParkedCalendarTournamentResults();
 if(typeof saveGame==='function')saveGame(true);return true;
}

const CALENDAR_SESSION_COPY={
 pl:{title:'Turniej trwa — kolejna sesja',results:'Wyniki i następna runda',open:'Przejdź do następnej rundy',next:'Następna runda: {round} — {date}.',wait:'Wyniki zostały zapisane. Przesuwaj kalendarz do daty kolejnej rundy.',earlier:'Najpierw musi zakończyć się wcześniejsza sesja zaplanowana na ten dzień.'},
 en:{title:'Tournament in progress — next session',results:'Results and next round',open:'Go to the next round',next:'Next round: {round} — {date}.',wait:'Results have been saved. Advance the calendar to the date of the next round.',earlier:'The earlier session scheduled for this day must finish first.'},
 de:{title:'Turnier läuft — nächste Sitzung',results:'Ergebnisse und nächste Runde',open:'Zur nächsten Runde',next:'Nächste Runde: {round} — {date}.',wait:'Die Ergebnisse wurden gespeichert. Gehe im Kalender bis zum Datum der nächsten Runde weiter.',earlier:'Zuerst muss die frühere Sitzung dieses Tages beendet werden.'},
 nl:{title:'Toernooi bezig — volgende sessie',results:'Uitslagen en volgende ronde',open:'Ga naar de volgende ronde',next:'Volgende ronde: {round} — {date}.',wait:'De uitslagen zijn opgeslagen. Ga in de kalender naar de datum van de volgende ronde.',earlier:'De eerdere sessie van deze dag moet eerst worden afgerond.'}
};
function getNextParkedCalendarTournament(){
 if(!player||!Array.isArray(tournamentDatabase))return null;
 return tournamentDatabase.filter(event=>!event.completed&&getParkedCalendarTournament(event))
  .sort((a,b)=>getParkedCalendarTournament(a).readyAt-getParkedCalendarTournament(b).readyAt)[0]||null;
}
function getCalendarSessionPresentation(event){
 const held=getParkedCalendarTournament(event);if(!held)return null;
 const lang=typeof currentLang==='string'?currentLang:'en',copy=CALENDAR_SESSION_COPY[lang]||CALENDAR_SESSION_COPY.en;
 const date=new Date(held.readyAt).toLocaleDateString({pl:'pl-PL',en:'en-GB',de:'de-DE',nl:'nl-NL'}[lang]||'en-GB');
 const round=typeof getRoundName==='function'?getRoundName(held.round):String(held.round);
 return {held,copy,next:copy.next.replace('{round}',round).replace('{date}',date),
  note:held.readyAt>currentDate.getTime()?copy.wait:calendarTournamentReady(event)?'':copy.earlier,
  name:typeof getTournamentDisplayName==='function'?getTournamentDisplayName(event):event.name};
}
function refreshCalendarSessionHub(){
 const tile=document.getElementById('tile-calendar-session');if(!tile)return;
 const event=getNextParkedCalendarTournament(),view=event&&getCalendarSessionPresentation(event);
 tile.style.display=view?'block':'none';if(!view)return;
 document.getElementById('calendar-session-title').textContent=view.copy.title;
 document.getElementById('calendar-session-name').textContent=view.name;
 document.getElementById('calendar-session-date').textContent=`${view.next} ${view.note}`.trim();
 document.getElementById('calendar-session-open').textContent=calendarTournamentReady(event)?view.copy.open:view.copy.results;
}
function showParkedCalendarTournamentResults(){
 if(currentMatch)return false;
 const event=getNextParkedCalendarTournament(),view=event&&getCalendarSessionPresentation(event);if(!view)return false;
 const escape=value=>typeof escapeHtml==='function'?escapeHtml(value):String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const history=typeof renderTournamentMatchHistory==='function'?renderTournamentMatchHistory(view.held.matchHistory,{currentRoundOnly:true}):'';
 const bracket=view.held.bracket.map(reference=>reference.isBye?reference:resolveLoadedPlayer(reference));
 const pairs=[];for(let i=0;i<bracket.length;i+=2)pairs.push(`<div>${escape(bracket[i]?.name||'(BYE)')} — ${escape(bracket[i+1]?.name||'(BYE)')}</div>`);
 document.getElementById('bracket-modal').style.display='none';
 document.getElementById('t-tour-end-title').innerText=`${view.name} — ${t('t-round-results')}`;
 document.getElementById('results-content').innerHTML=`<section class="calendar-session-results"><h4>${escape(view.next)}</h4><p>${escape(view.note)}</p></section>`
  +(history||view.held.currentRoundHTML||view.held.lastTournamentResults||'')
  +`<section class="calendar-session-results"><h4>${escape(view.next)}</h4>${pairs.join('')}`
  +(calendarTournamentReady(event)?`<button type="button" class="action-btn" onclick="openCalendarTournamentSession()">${escape(view.copy.open)}</button>`:'')+'</section>';
 for(const id of ['t-btn-next-round','t-btn-sim-tournament-results','t-btn-sim-to-match-results']){
  const button=document.getElementById(id);if(button)button.style.display='none';
 }
 if(typeof updateTournamentFinanceResults==='function')updateTournamentFinanceResults(event);
 document.getElementById('t-btn-tour-back').style.display='block';
 const modal=document.getElementById('results-modal');modal.style.display='flex';
 const panel=modal.querySelector?.('.modal-content');if(panel)panel.scrollTop=0;
 return true;
}
function openCalendarTournamentSession(){
 if(currentMatch||typeof isTournamentSimulationBusy==='function'&&isTournamentSimulationBusy())return false;
 const event=getNextParkedCalendarTournament();if(!event)return false;
 if(activeTournament&&activeTournament!==event||!calendarTournamentReady(event))return showParkedCalendarTournamentResults();
 if(!activateTournamentFromCalendar(event))return false;
 document.getElementById('results-modal').style.display='none';refreshCalendarSessionHub();return startTournament();
}
