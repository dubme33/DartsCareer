const UK_OPEN_DRAW_TEXT={
 title:['Ceremonia losowania UK Open','UK Open draw ceremony','UK-Open-Auslosung','UK Open-loting'],open:['Pokaż losowanie UK Open','Show UK Open draw','UK-Open-Auslosung zeigen','Toon UK Open-loting'],
 intro:['Jedna pula, bez rozstawień. Grupy wejścia określają rundę dołączenia, a nie ograniczenia przy dobieraniu par.','One pool, no seeding. Entry groups determine when players join, not who they can face.','Ein Lostopf, keine Setzliste. Einstiegsgruppen bestimmen die Einstiegsrunde, nicht die möglichen Gegner.','Eén pot, geen geplaatste spelers. Instroomgroepen bepalen de instapronde, niet wie elkaar kan treffen.'],
 next:['Odkryj kolejnego zawodnika','Reveal next player','Nächsten Spieler aufdecken','Onthul volgende speler'],all:['Pokaż całe losowanie','Reveal full draw','Gesamte Auslosung zeigen','Toon volledige loting'],continue:['Przejdź do drabinki','Continue to bracket','Zum Turnierbaum','Naar het schema'],back:['Wróć do menu','Back to menu','Zurück zum Menü','Terug naar menu'],
 progress:['Odkryci zawodnicy','Players revealed','Aufgedeckte Spieler','Onthulde spelers'],pairs:['Skompletowane pary','Completed pairs','Vollständige Paarungen','Volledige duels'],last:['Ostatnio wylosowany','Last player drawn','Zuletzt gezogen','Laatst getrokken'],start:['Odkryj pierwszego zawodnika','Reveal the first player','Decke den ersten Spieler auf','Onthul de eerste speler'],unknown:['Czeka na losowanie','Awaiting draw','Noch nicht gezogen','Nog niet geloot'],
 possible:['Możliwi rywale','Possible opponents','Mögliche Gegner','Mogelijke tegenstanders'],pending:['Twoja para nie jest jeszcze znana. Zawodnik czekający na drugą osobę również pozostaje możliwym rywalem.','Your pairing is not known yet. A player still waiting for a partner remains a possible opponent.','Deine Paarung steht noch nicht fest. Ein Spieler ohne Partner bleibt ein möglicher Gegner.','Je duel is nog niet bekend. Een speler die nog op een tegenstander wacht, blijft een mogelijke tegenstander.'],
 waiting:['Jesteś już wylosowany. Teraz poznasz rywala.','You have been drawn. Your opponent is next.','Du wurdest gezogen. Als Nächstes folgt dein Gegner.','Je bent getrokken. Je tegenstander volgt nu.'],opponent:['Twój rywal','Your opponent','Dein Gegner','Je tegenstander'],pool:['Pozostali w puli','Remaining in the pool','Noch im Lostopf','Nog in de pot'],
 later:['Dołączysz w rundzie','You enter in round','Dein Einstieg erfolgt in Runde','Je stroomt in tijdens ronde'],absent:['Nie bierzesz udziału w tej rundzie.','You are not playing in this round.','Du spielst in dieser Runde nicht mit.','Je speelt niet in deze ronde.'],done:['Losowanie zakończone','Draw complete','Auslosung abgeschlossen','Loting voltooid'],empty:['Pula jest pusta.','The pool is empty.','Der Lostopf ist leer.','De pot is leeg.'],
 origins:['Grupy wejścia w tej rundzie','Entry groups in this round','Einstiegsgruppen dieser Runde','Instroomgroepen in deze ronde'],previous:['Awans z poprzedniej rundy','Through from the previous round','Sieger der vorherigen Runde','Door uit de vorige ronde'],entrant:['Uczestnik losowania','Draw entrant','Teilnehmer','Deelnemer'],challenge:['Challenge Tour — 16 miejsc','Challenge Tour — 16 places','Challenge Tour — 16 Plätze','Challenge Tour — 16 plaatsen'],development:['Development Tour — 16 miejsc','Development Tour — 16 places','Development Tour — 16 Plätze','Development Tour — 16 plaatsen'],bye:['Wolny los','Bye','Freilos','Bye'],pair:['Para','Pair','Paarung','Duel'],saveFailed:['Nie udało się zapisać postępu losowania. Zrób eksport kariery do JSON przed zamknięciem strony.','Draw progress could not be saved. Export your career as JSON before closing the page.','Der Fortschritt konnte nicht gespeichert werden. Exportiere die Karriere vor dem Schließen als JSON.','De voortgang kon niet worden opgeslagen. Exporteer je carrière als JSON voordat je de pagina sluit.']
};
let ukOpenDrawSession=null,ukOpenDrawDeferred=null;
function trUKOpenDraw(key){return(UK_OPEN_DRAW_TEXT[key]||[key])[Math.max(0,['pl','en','de','nl'].indexOf(currentLang))]||key;}
function ukOpenDrawContext(){
 if(!activeTournament||!isUKOpenTournament(activeTournament)||activeTournament.completed||typeof isTournamentSimulationBusy==='function'&&isTournamentSimulationBusy())return null;
 const year=currentDate.getFullYear(),drawKey=ukOpenDraw.signature(activeTournament,tournamentBracket,tournamentRound,year);return drawKey?{event:activeTournament,owner:player,bracket:tournamentBracket,round:tournamentRound,year,drawKey}:null;
}
function ukOpenDrawHasResults(context){
 if(currentMatch?.isTournament)return true;
 for(let i=0;i<context.bracket.length;i+=2)if(typeof getSpectatedTournamentMatchResult==='function'&&getSpectatedTournamentMatchResult(context.bracket[i],context.bracket[i+1],context.round,false))return true;
 return false;
}
function ukOpenDrawSessionValid(session){const context=ukOpenDrawContext();return!!session&&ukOpenDrawSession===session&&context?.event===session.event&&context.owner===session.owner&&context.drawKey===session.drawKey;}
function persistUKOpenDraw(session,immediate=false){
 if(!ukOpenDrawSessionValid(session)||typeof saveGame!=='function')return;
 const revision=++session.writeRevision;try{Promise.resolve(saveGame(true,immediate?{immediate:true}:{})).then(ok=>{if(ukOpenDrawSessionValid(session)&&session.writeRevision===revision){session.saveFailed=ok===false;const status=session.dialog.querySelector('[data-uk-draw-save]');if(status)status.textContent=session.saveFailed?trUKOpenDraw('saveFailed'):'';}},()=>{if(ukOpenDrawSessionValid(session)){session.saveFailed=true;renderUKOpenDraw();}});}catch(_){session.saveFailed=true;renderUKOpenDraw();}
}
function closeUKOpenDraw(goToHub=true){
 const session=ukOpenDrawSession;if(!session)return false;persistUKOpenDraw(session,true);ukOpenDrawSession=null;if(session.dialog.open)session.dialog.close();session.dialog.remove();if(goToHub)showScreen('screen-hub');return true;
}
function maybeShowUKOpenDrawCeremony(force=false){
 // Fast-forward requests its final bracket before releasing the simulation lock.
 // Wait for that lock instead of exposing the complete draw underneath the ceremony.
 if(activeTournament&&isUKOpenTournament(activeTournament)&&typeof isTournamentSimulationBusy==='function'&&isTournamentSimulationBusy()&&typeof waitForTournamentSimulation==='function'){
  const pending={event:activeTournament,owner:player,drawKey:ukOpenDraw.signature(activeTournament,tournamentBracket,tournamentRound,currentDate.getFullYear())};
  if(!ukOpenDrawDeferred||ukOpenDrawDeferred.drawKey!==pending.drawKey||ukOpenDrawDeferred.event!==pending.event){ukOpenDrawDeferred=pending;Promise.resolve(waitForTournamentSimulation()).then(()=>{if(ukOpenDrawDeferred!==pending)return;ukOpenDrawDeferred=null;const current=ukOpenDrawContext();if(current?.event===pending.event&&current.owner===pending.owner&&current.drawKey===pending.drawKey)showBracket();},()=>{if(ukOpenDrawDeferred===pending)ukOpenDrawDeferred=null;});}
  document.getElementById('bracket-modal').style.display='none';return true;
 }
 const context=ukOpenDrawContext(),button=document.getElementById('uk-open-draw-open');if(button){button.hidden=!context;button.textContent=trUKOpenDraw('open');}
 if(!context){if(ukOpenDrawSession)closeUKOpenDraw(false);return false;}
 const state=ukOpenDraw.restore(context.event.ukOpenDrawCeremony,context.event,context.bracket,context.round,context.year,ukOpenDrawHasResults(context));
 if(!state)return false;
 const changed=JSON.stringify(context.event.ukOpenDrawCeremony)!==JSON.stringify(state);
 // An older save with watched matches already has a public draw. Do not conceal it.
 if(!force&&state.revealed===state.slotCount){if(changed)context.event.ukOpenDrawCeremony=state;return false;}
 context.event.ukOpenDrawCeremony=state;
 document.getElementById('bracket-modal').style.display='none';document.getElementById('bracket-list').innerHTML='';
 if(ukOpenDrawSession?.event===context.event&&ukOpenDrawSession.drawKey===context.drawKey&&ukOpenDrawSession.owner===context.owner){renderUKOpenDraw();return true;}
 if(ukOpenDrawSession)closeUKOpenDraw(false);
 const dialog=document.createElement('dialog');dialog.id='uk-open-draw-dialog';dialog.className='uk-open-draw-dialog';dialog.setAttribute('aria-labelledby','uk-open-draw-title');
 ukOpenDrawSession={...context,dialog,writeRevision:0,saveFailed:false};document.body.appendChild(dialog);renderUKOpenDraw();dialog.showModal();dialog.oncancel=e=>{e.preventDefault();closeUKOpenDraw();};if(changed)persistUKOpenDraw(ukOpenDrawSession,true);return true;
}
function revealUKOpenDraw(all=false){
 const session=ukOpenDrawSession;if(!ukOpenDrawSessionValid(session)){closeUKOpenDraw(false);return false;}
 const next=ukOpenDraw.reveal(session.event.ukOpenDrawCeremony,session.drawKey,all);if(!next)return false;session.event.ukOpenDrawCeremony=next;renderUKOpenDraw();persistUKOpenDraw(session);return true;
}
function finishUKOpenDraw(){
 const session=ukOpenDrawSession;if(!ukOpenDrawSessionValid(session)||session.event.ukOpenDrawCeremony.revealed!==session.bracket.length)return false;
 closeUKOpenDraw(false);showBracket();return true;
}
function ukOpenDrawEntry(candidate,session){
 if(!candidate||candidate.isBye)return'';const state=session.event.ukOpenQualification,key=getUKOpenPlayerKey(candidate);
 const group=UK_OPEN_GROUPS.find(g=>state?.[g.stateKey]?.includes(key));if(!group)return trUKOpenDraw('entrant');if(group.entryRound>session.round)return trUKOpenDraw('previous');
 if(group.key==='ukOpenChallenge16')return trUKOpenDraw('challenge');if(group.key==='ukOpenDevelopment16')return trUKOpenDraw('development');
 const from={ukOpenOom1To32:1,ukOpenOom33To64:33,ukOpenOom65To96:65,ukOpenOom97To128:97}[group.key];return'OOM '+from+'–'+(from+31);
}
function renderUKOpenDraw(){
 const s=ukOpenDrawSession;if(!s||!ukOpenDrawSessionValid(s))return false;
 const state=s.event.ukOpenDrawCeremony,v=ukOpenDraw.view(s.bracket,state,getUKOpenPlayerKey(s.owner)),esc=escapeHtml;if(!v)return false;
 const focus=s.dialog.contains(document.activeElement)?document.activeElement.id:null,originsOpen=s.dialog.querySelector('[data-uk-draw-origins]')?.open;
 const name=p=>p?.isBye||!p?trUKOpenDraw('bye'):p.name,identity=p=>`<span class="uk-draw-name">${p&&!p.isBye?getFlagImg(p.country).replace('<img ','<img width="20" height="14" onerror="this.style.display=\'none\'" '):''}<span class="uk-draw-player-text">${esc(name(p))}</span></span>`,person=p=>p?`<div class="uk-draw-person ${isCurrentPlayer(p)?'is-player':''}">${identity(p)}<small>${esc(ukOpenDrawEntry(p,s))}</small></div>`:`<div class="uk-draw-person is-hidden"><span aria-hidden="true">?</span><small>${esc(trUKOpenDraw('unknown'))}</small></div>`;
 let own=`<p>${esc(trUKOpenDraw('absent'))}</p>`;
 if(v.own==='paired')own=`<p>${esc(trUKOpenDraw('opponent'))}</p>${person(v.opponent)}`;
 else if(v.own!=='absent')own=`<p>${esc(trUKOpenDraw(v.own==='waiting'?'waiting':'pending'))}</p><strong>${esc(trUKOpenDraw('possible'))}: ${v.possible.length}</strong>`;
 else{const state=s.event.ukOpenQualification,key=getUKOpenPlayerKey(s.owner),group=UK_OPEN_GROUPS.find(g=>state?.[g.stateKey]?.includes(key));if(group&&group.entryRound<s.round)own=`<p>${esc(trUKOpenDraw('later'))}: ${esc(getUKOpenRoundName(group.entryRound)||getRoundName(group.entryRound))}</p>`;}
 const pool=v.own==='pending'||v.own==='waiting'?v.possible:v.pool,originCounts=new Map();for(const p of s.bracket){const label=p?.isBye?trUKOpenDraw('bye'):ukOpenDrawEntry(p,s);originCounts.set(label,(originCounts.get(label)||0)+1);}
 s.dialog.innerHTML=`<header><p class="uk-draw-eyebrow">${esc(typeof getTournamentDisplayName==='function'?getTournamentDisplayName(s.event):s.event.name)}</p><h2 id="uk-open-draw-title">${esc(trUKOpenDraw('title'))}</h2><p>${esc(getRoundName(s.round))}</p></header><p class="uk-draw-intro">${esc(trUKOpenDraw('intro'))}</p><div class="uk-draw-progress"><span>${esc(trUKOpenDraw('progress'))}: <strong>${v.revealed}/${v.slotCount}</strong></span><span>${esc(trUKOpenDraw('pairs'))}: <strong>${v.completedPairs}/${v.slotCount/2}</strong></span></div>
 <div class="uk-draw-stage"><section class="uk-draw-ball" aria-live="polite"><small>${esc(trUKOpenDraw(v.finished?'done':v.last?'last':'start'))}</small>${v.last?identity(v.last):'<span class="uk-draw-question" aria-hidden="true">?</span>'}${v.last?`<span>${esc(ukOpenDrawEntry(v.last,s))}</span>`:''}</section><section class="uk-draw-own" aria-live="polite">${own}</section></div>
 <div class="uk-draw-actions">${!v.finished?`<button type="button" id="uk-draw-next">${esc(trUKOpenDraw('next'))}</button><button type="button" id="uk-draw-all">${esc(trUKOpenDraw('all'))}</button>`:`<button type="button" id="uk-draw-continue">${esc(trUKOpenDraw('continue'))}</button>`}<button type="button" id="uk-draw-back">${esc(trUKOpenDraw('back'))}</button></div>
 <p class="uk-draw-save" data-uk-draw-save role="status">${s.saveFailed?esc(trUKOpenDraw('saveFailed')):''}</p><details data-uk-draw-origins ${originsOpen?'open':''}><summary>${esc(trUKOpenDraw('origins'))}</summary><ul>${[...originCounts].map(([label,count])=>`<li>${esc(label)}: <strong>${count}</strong></li>`).join('')}</ul></details>
 <h3>${esc(trUKOpenDraw(v.own==='pending'||v.own==='waiting'?'possible':'pool'))} (${pool.length})</h3><div class="uk-draw-pool" tabindex="0" aria-label="${esc(trUKOpenDraw('pool'))}">${pool.length?pool.map(p=>`<span>${identity(p)}</span>`).join(''):`<p>${esc(trUKOpenDraw('empty'))}</p>`}</div>
 <h3>${esc(trUKOpenDraw('pairs'))}</h3><div class="uk-draw-pairs">${v.pairs.map(p=>`<article class="uk-draw-pair ${p.complete?'is-complete':''}" data-uk-draw-pair="${p.number}"><span class="uk-draw-pair-number">${esc(trUKOpenDraw('pair'))} ${p.number}</span>${person(p.first)}<span class="uk-draw-vs">vs</span>${person(p.second)}</article>`).join('')}</div>`;
 s.dialog.querySelector('#uk-draw-next')?.addEventListener('click',()=>revealUKOpenDraw());s.dialog.querySelector('#uk-draw-all')?.addEventListener('click',()=>revealUKOpenDraw(true));s.dialog.querySelector('#uk-draw-continue')?.addEventListener('click',finishUKOpenDraw);s.dialog.querySelector('#uk-draw-back').onclick=()=>closeUKOpenDraw();if(focus)s.dialog.querySelector('#'+focus)?.focus({preventScroll:true});return true;
}
function refreshUKOpenDrawTranslations(){const button=document.getElementById('uk-open-draw-open');if(button)button.textContent=trUKOpenDraw('open');if(ukOpenDrawSession){if(!ukOpenDrawSessionValid(ukOpenDrawSession))closeUKOpenDraw(false);else renderUKOpenDraw();}}
