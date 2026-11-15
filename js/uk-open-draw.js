/* Presentation of an existing UK Open draw; never shuffles or simulates. */
(function(root){
 'use strict';
 const key=(p,index)=>!p||p.isBye?'bye:'+index:String(p.id||[p.sourceName||p.name||'',p.country||''].join('|'));
 function signature(event,bracket,round,year){
  if(!event||!Array.isArray(bracket)||bracket.length<2||bracket.length>256||bracket.length%2||!Number.isInteger(round)||round<2||!Number.isInteger(year))return null;
  return JSON.stringify([year,String(event.sourceName||event.name||''),round,Array.from(bracket,key)]);
 }
 function restore(raw,event,bracket,round,year,alreadyPlayed=false){
  const drawKey=signature(event,bracket,round,year);if(!drawKey)return null;
  const count=bracket.length,valid=raw?.version===1&&raw.drawKey===drawKey&&raw.slotCount===count&&Number.isInteger(raw.revealed)&&raw.revealed>=0&&raw.revealed<=count;
  return{version:1,drawKey,slotCount:count,revealed:alreadyPlayed?count:valid?raw.revealed:0};
 }
 function reveal(state,drawKey,all=false){
  if(!state||state.version!==1||state.drawKey!==drawKey||!Number.isInteger(state.revealed)||state.revealed<0||state.revealed>state.slotCount)return null;
  return{...state,revealed:all?state.slotCount:Math.min(state.slotCount,state.revealed+1)};
 }
 function view(bracket,state,ownKey){
  if(!state||!Array.isArray(bracket)||state.slotCount!==bracket.length||!Number.isInteger(state.revealed)||state.revealed<0||state.revealed>bracket.length)return null;
  bracket=Array.from(bracket,p=>p||{name:'(BYE)',isBye:true});
  const count=state.revealed,pairs=[];for(let i=0;i<bracket.length;i+=2)pairs.push({number:i/2+1,first:i<count?bracket[i]:null,second:i+1<count?bracket[i+1]:null,complete:i+1<count});
  const ownIndex=ownKey?bracket.findIndex((p,i)=>!p?.isBye&&key(p,i)===ownKey):-1,opponentIndex=ownIndex>=0?ownIndex^1:-1,paired=ownIndex>=0&&count>Math.max(ownIndex,opponentIndex);
  const pool=bracket.filter((p,i)=>i>=count).slice().sort((a,b)=>String(a?.name||'').localeCompare(String(b?.name||'')));
  const possible=ownIndex<0||paired?[]:bracket.filter((p,i)=>i!==ownIndex&&(i>=count||count%2===1&&i===count-1)).slice().sort((a,b)=>String(a?.name||'').localeCompare(String(b?.name||'')));
  return{pairs,pool,possible,own:ownIndex<0?'absent':paired?'paired':count>ownIndex?'waiting':'pending',opponent:paired?bracket[opponentIndex]:null,
   revealed:count,slotCount:bracket.length,completedPairs:Math.floor(count/2),finished:count===bracket.length,last:count?bracket[count-1]:null};
 }
 root.ukOpenDraw=Object.freeze({key,signature,restore,reveal,view});
})(globalThis);
