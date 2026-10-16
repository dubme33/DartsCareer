function isNativeWomensLiveSaveTournament(event){return isWomensSeriesTournament(event)||(typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(event));}
// Women's Series live checkpoints use the native match state and transitions.
// Other tournaments retain their existing save behaviour.
function getWomensSeriesMatchForSave(){
 if(!isNativeWomensLiveSaveTournament(activeTournament)||!currentMatch?.isTournament||currentMatch.isFinishing)return null;
 const match=currentMatch;
 if(match.isDartInFlight||match.isTurnLocked||match.matchEnding||match.dartsThrown>=3)return null;
 const data={...match,opponent:getPlayerSaveReference(match.opponent),
  spectatorP1:match.spectatorP1?getPlayerSaveReference(match.spectatorP1):null,
  spectatorP2:match.spectatorP2?getPlayerSaveReference(match.spectatorP2):null,
  isDartInFlight:false,isTurnLocked:false,introInProgress:false,womensSeriesSaving:false,
  spectatorPaused:Boolean(match.isSpectator||match.careerAutoplay)};
 delete data.pendingImpactAction;
 return JSON.parse(JSON.stringify({version:1,year:currentDate.getFullYear(),event:activeTournament.womensSeriesEvent,
  tournamentId:typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(activeTournament)?'pdc-womens-world-matchplay':null,round:tournamentRound,match:data,currentTurnScore,drawnDarts}));
}
function restoreWomensSeriesMatchFromSave(state){
 const saved=state?.womensSeriesMatch;
 if(!saved||saved.version!==1||!isNativeWomensLiveSaveTournament(activeTournament)
  ||(saved.tournamentId==='pdc-womens-world-matchplay')!==Boolean(typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(activeTournament))
  ||saved.year!==currentDate.getFullYear()||saved.event!==activeTournament.womensSeriesEvent
  ||activeTournament.completed||!saved.match?.isTournament)return false;
 const m=saved.match;
 if(!['p1Score','p2Score','p1Legs','p2Legs','dartsThrown'].every(k=>Number.isFinite(m[k])&&m[k]>=0)
  ||m.p1Score>501||m.p2Score>501||m.dartsThrown>=3||!m.stats)return false;
 const opponent=resolveLoadedPlayer(m.opponent);if(!opponent||opponent.isBye)return false;
 clearTimeout(window.aiTimeout);window.aiTimeout=null;
 if(typeof spectatorPendingPlayback!=='undefined'){if(spectatorPendingPlayback?.timerId)clearTimeout(spectatorPendingPlayback.timerId);spectatorPendingPlayback=null;}
 currentMatch={...m,opponent,isDartInFlight:false,isTurnLocked:false,introInProgress:false,womensSeriesSaving:false,
  spectatorP1:m.spectatorP1?resolveLoadedPlayer(m.spectatorP1):null,
  spectatorP2:m.spectatorP2?resolveLoadedPlayer(m.spectatorP2):null,
  matchFormat:getTournamentMatchFormat(activeTournament,saved.round),womensSeriesRestored:true,
  spectatorPaused:Boolean(m.isSpectator||m.careerAutoplay)};
 currentTurnScore=Number(saved.currentTurnScore)||0;drawnDarts=Array.isArray(saved.drawnDarts)?saved.drawnDarts:[];
 return true;
}
function resumeWomensSeriesSavedMatch(){
 if(!isNativeWomensLiveSaveTournament(activeTournament)||!currentMatch?.womensSeriesRestored)return false;
 currentMatch.womensSeriesRestored=false;
 const p1=currentMatch.isSpectator?currentMatch.spectatorP1:player,p2=currentMatch.opponent;
 document.getElementById('match-p1-name').innerHTML=`${getFlagImg(p1.country)} ${escapeHtml(p1.name)}`;
 document.getElementById('match-p2-name').innerHTML=`${getFlagImg(p2.country)} ${escapeHtml(p2.name)}`;
 if(typeof setSpectatorPlayerPhoto==='function'){setSpectatorPlayerPhoto('score-photo-p1',p1,'P1');setSpectatorPlayerPhoto('score-photo-p2',p2,'P2');}
 updateScores();updateMatchStatsUI();updateDartDots();drawDartboard();showScreen('screen-match');
 setTurnUI();return true;
}
function clearWomensSeriesMatchBeforeLoad(){
 if(!isNativeWomensLiveSaveTournament(activeTournament)||!currentMatch?.isTournament)return;
 clearTimeout(window.aiTimeout);window.aiTimeout=null;
 if(typeof spectatorPendingPlayback!=='undefined'){if(spectatorPendingPlayback?.timerId)clearTimeout(spectatorPendingPlayback.timerId);spectatorPendingPlayback=null;}
 currentMatch=null;currentTurnScore=0;drawnDarts=[];
}
async function prepareWomensSeriesLiveSave(){
 const match=currentMatch;if(!isNativeWomensLiveSaveTournament(activeTournament)||!match?.isTournament||match.isFinishing)return;
 const controlled=typeof isMatchPlaybackControlled==='function'&&isMatchPlaybackControlled(match),wasPaused=match.spectatorPaused;
 match.womensSeriesSaving=true;if(controlled)setSpectatorPaused(true);
 const start=Date.now();
 const release=()=>{
  match.womensSeriesSaving=false;
  if(currentMatch===match){if(controlled&&!wasPaused)setSpectatorPaused(false);else if(!controlled&&!match.isTurnLocked&&!match.isDartInFlight)setTurnUI();}
 };
 try{
  while(currentMatch===match&&(match.isDartInFlight||match.isTurnLocked||match.matchEnding||match.dartsThrown>=3)){
   if(match.matchEnding&&typeof finishMatch==='function'){finishMatch();break;}
   if(!match.isDartInFlight){
    window.matchTVDirector?.skipReplay?.();
    const pending=typeof spectatorPendingPlayback!=='undefined'?spectatorPendingPlayback:null;
    if(pending?.match===match&&pending.kind!=='throw'){
     if(pending.timerId)clearTimeout(pending.timerId);spectatorPendingPlayback=null;window.aiTimeout=null;
     pending.callback();continue;
    }
   }
   if(Date.now()-start>10000)throw new Error('Women’s Series: match transition is still pending; save was not written.');
   await new Promise(resolve=>setTimeout(resolve,20));
  }
  return release;
 }catch(error){release();throw error;}
}
if(typeof aiTurn==='function'){
 const womensSeriesNativeAiTurn=aiTurn;
 aiTurn=function(...args){if(isNativeWomensLiveSaveTournament(activeTournament)&&currentMatch?.womensSeriesSaving)return;return womensSeriesNativeAiTurn(...args);};
}
if(typeof saveGame==='function'){
 const womensSeriesNativeSaveGame=saveGame;
 saveGame=async function(...args){
  if(!isNativeWomensLiveSaveTournament(activeTournament)||!currentMatch?.isTournament)return womensSeriesNativeSaveGame(...args);
  const release=await prepareWomensSeriesLiveSave();try{return await womensSeriesNativeSaveGame(...args);}finally{release?.();}
 };
}
