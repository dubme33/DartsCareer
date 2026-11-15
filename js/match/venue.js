/* Venue presentation preferences. Does not write match or career data. */
(function(root){
 'use strict';
 const text={
  title:['Sceneria meczu','Match venue','Spielumgebung','Wedstrijdomgeving'],auto:['Automatycznie','Automatic','Automatisch','Automatisch'],tv:['Scena telewizyjna','Television stage','TV-Bühne','Televisiepodium'],floor:['Sala turniejowa','Floor tournament hall','Turniersaal','Toernooizaal'],wide:['Widok stanowiska','Venue view','Spielort ansehen','Bekijk speelruimte'],close:['Zbliżenie tarczy','Board close-up','Scheibe vergrößern','Dartbord dichtbij'],ambience:['Dźwięki otoczenia','Venue ambience','Umgebungsgeräusche','Omgevingsgeluid'],hint:['Wybór ręczny ma pierwszeństwo przed ustawieniem turnieju. Podczas rzutu kamera wraca do tarczy.','Manual selection overrides the tournament setting. Throwing returns the camera to the board.','Die manuelle Wahl hat Vorrang vor der Turniereinstellung. Beim Wurf kehrt die Kamera zur Scheibe zurück.','Handmatige selectie gaat voor de toernooi-instelling. Bij een worp keert de camera terug naar het bord.'],editor:['Sceneria meczów','Match venue','Spielumgebung','Wedstrijdomgeving']
 };
 const normalize=v=>['tv','floor'].includes(v)?v:'auto';
 const tr=k=>(text[k]||[k])[Math.max(0,['pl','en','de','nl'].indexOf(typeof currentLang==='string'?currentLang:'en'))]||k;
 const read=(key,fallback)=>{try{return localStorage.getItem(key)||fallback;}catch(_){return fallback;}};
 const write=(key,value)=>{try{localStorage.setItem(key,value);}catch(_){}};
 let preference=normalize(read('dartsCareer.matchVenue','auto')),ambientEnabled=read('dartsCareer.venueAmbience','on')!=='off',ownerMatch=null,currentType=null;
 let roomAudio=null,roomContext=null,roomFilter=null,roomSource=null;
 function resolve(match,tournament,setting=preference){
  const manual=normalize(setting);if(manual!=='auto')return manual;
  const specified=normalize(tournament?.matchVenue);if(match?.isTournament&&specified!=='auto')return specified;
  if(!match?.isTournament||!tournament)return'floor';
  if(root.matchCrowd?.isFloorTournament)return root.matchCrowd.isFloorTournament(tournament)?'floor':'tv';
  if(tournament.noCrowd===true||tournament.noWalkons===true)return'floor';
  const name=`${tournament.name||''} ${tournament.sourceName||''} ${tournament.specialType||''}`.toLowerCase();
  return /qualif|q.?school|pro card trials|challenge.?tour|development.?tour|rising stars|future champions|womensseries/.test(name)||/players championship|pro players cup/.test(name)&&!/final/.test(name)?'floor':'tv';
 }
 function snapshot(match=typeof currentMatch!=='undefined'?currentMatch:null){
  if(!match)return null;const tournament=match.isTournament&&typeof activeTournament!=='undefined'?activeTournament:null;
  const p1=match.isSpectator?match.spectatorP1:typeof player!=='undefined'?player:null,p2=match.opponent;
  const country=team=>typeof getWorldCupCountryName==='function'?getWorldCupCountryName(team?.country):team?.country;
  const names=match.isDoubles?[country(match.worldCupTeamP1),country(match.worldCupTeamP2)]:[p1?.name,p2?.name];
  return{type:resolve(match,tournament),palette:root.matchBroadcastTheme?.palette?.(tournament,match)||null,title:tournament?(typeof getTournamentDisplayName==='function'?getTournamentDisplayName(tournament):tournament.name):'DARTS CAREER',
   names:names.map(n=>typeof n==='string'?n.slice(0,80):'-'),scores:[match.p1Score??501,match.p2Score??501],legs:[match.p1Legs||0,match.p2Legs||0],sets:[match.p1Sets||0,match.p2Sets||0],setsMode:match.matchFormat?.type==='sets',target:match.matchFormat?.setsToWin||match.matchFormat?.legsToWin||match.legsToWin||3,turn:match.turn==='p2'?1:0};
 }
 const visible=()=>typeof document!=='undefined'&&document.getElementById('screen-match')?.classList.contains('active')&&!document.hidden;
 function stopRoom(){if(roomAudio){try{roomAudio.pause();}catch(_){}}if(roomContext?.state==='running')roomContext.suspend().catch(()=>{});}
 function room(){
  const volume=typeof globalVolume==='number'?Math.max(0,Math.min(1,globalVolume)):1;
  if(!visible()||!ambientEnabled||currentType!=='floor'||!ownerMatch||!volume){stopRoom();return;}
  if(!roomAudio){
   roomAudio=new Audio('sounds/fans/arenaloop.mp3');roomAudio.loop=true;roomAudio.preload='none';
   const Context=root.AudioContext||root.webkitAudioContext;
   if(Context)try{roomContext=new Context();roomSource=roomContext.createMediaElementSource(roomAudio);roomFilter=roomContext.createBiquadFilter();roomFilter.type='lowpass';roomFilter.frequency.value=620;roomFilter.Q.value=.5;roomSource.connect(roomFilter);roomFilter.connect(roomContext.destination);}catch(_){roomContext?.close?.().catch(()=>{});roomContext=null;roomFilter=null;}
  }
  roomAudio.volume=.035*volume;
  if(roomContext?.state==='suspended')roomContext.resume().catch(()=>{});
  if(roomAudio.paused)try{roomAudio.play()?.catch(()=>{});}catch(_){}
 }
 function updateUI(){
  if(typeof document==='undefined')return;
  document.querySelectorAll('[data-venue-text]').forEach(n=>n.textContent=tr(n.dataset.venueText));
  for(const id of ['match-venue-select','te-match-venue']){const field=document.getElementById(id);if(field)for(const option of field.options)option.textContent=tr(option.value);}
  const select=document.getElementById('match-venue-select');if(select)select.value=preference;
  const checkbox=document.getElementById('match-venue-ambience');if(checkbox)checkbox.checked=ambientEnabled;
  const button=document.getElementById('match-venue-view'),state=root.matchBoard3D?.getState();if(button){button.disabled=state?.mode!=='3d';button.textContent=tr(state?.venueWide?'close':'wide');button.setAttribute('aria-pressed',String(!!state?.venueWide));}
 }
 function refresh(){
  const match=typeof currentMatch!=='undefined'?currentMatch:null,tournament=match?.isTournament&&typeof activeTournament!=='undefined'?activeTournament:null,type=resolve(match,tournament);
  const changed=ownerMatch!==match||currentType!==type,newMatch=ownerMatch!==match;ownerMatch=match;currentType=type;
  const screen=typeof document!=='undefined'?document.getElementById('screen-match'):null;if(screen&&screen.dataset.matchVenue!==type)screen.dataset.matchVenue=type;
  if(changed){root.dispatchEvent?.(new Event('match-venue-change'));if(newMatch&&match)root.matchBoard3D?.setVenueWide?.(!(Number(match.stats?.p1TotalDarts)||Number(match.stats?.p2TotalDarts)||Number(match.p1Legs)||Number(match.p2Legs)));}
  room();updateUI();return snapshot(match);
 }
 function setPreference(value){preference=normalize(value);write('dartsCareer.matchVenue',preference);refresh();if(visible())root.matchCrowd?.start?.();return true;}
 function setAmbience(value){ambientEnabled=value===true;write('dartsCareer.venueAmbience',ambientEnabled?'on':'off');room();root.matchCrowd?.setVolume?.();updateUI();}
 function scoreChanged(){const data=refresh();if(data)root.matchBoard3D?.refreshVenueScore?.(data);}
 function toggleWide(){root.matchBoard3D?.setVenueWide?.(!root.matchBoard3D.getState().venueWide);updateUI();}
 root.matchVenue=Object.freeze({resolve,normalize,snapshot,refresh,scoreChanged,setPreference,setAmbience,toggleWide,tr,updateUI,ambienceGain:()=>ambientEnabled?1:0,
  getState:()=>({preference,type:currentType,wide:!!root.matchBoard3D?.getState().venueWide,ambientEnabled,roomPlaying:!!roomAudio&&!roomAudio.paused,filterFrequency:roomFilter?.frequency.value||null})});
 root.refreshMatchVenueTranslations=updateUI;
 if(typeof document!=='undefined'){
  const screen=document.getElementById('screen-match');if(screen)new MutationObserver(()=>{refresh();if(!visible())stopRoom();}).observe(screen,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRoom();else refresh();});
  document.addEventListener('pointerdown',()=>{if(visible())room();},{passive:true});
  document.addEventListener('click',e=>{if(visible()&&e.target.closest?.('.aim-sector-btn, .aim-multiplier-btn, .tv-quick-throw-btn'))root.matchBoard3D?.setVenueWide?.(false);});
  root.addEventListener('match-venue-view-change',updateUI);updateUI();
 }
})(globalThis);
