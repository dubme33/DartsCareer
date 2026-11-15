/* Local exhibition rules. Deliberately independent of career match state and saving. */
(function(root){
 'use strict';
 const field=(s,m)=>(s===0&&m===0)||(Number.isInteger(s)&&s>=1&&s<=20&&[1,2,3].includes(m))||(s===25&&[1,2].includes(m));
 function create(players,{score=501,legsToWin=3,starter=0}={}){
  if(!Array.isArray(players)||players.length!==2||players.some(p=>!p||typeof p.name!=='string'||!p.name.trim())||![301,501].includes(score)||![1,2,3,5,7].includes(legsToWin)||![0,1].includes(starter))return null;
  return{players:JSON.parse(JSON.stringify(players)),startScore:score,legsToWin,starter,turn:starter,legs:[0,0],scores:[score,score],visitStart:score,shots:[],closed:false,bust:false,legWon:false,finished:false,winner:null,totalLegs:0,
   stats:[0,1].map(()=>({darts:0,points:0,visits:0,busts:0,maximums:0,checkoutAttempts:0,checkouts:0,bestCheckout:0})),lastVisit:null};
 }
 function append(state,raw){
  if(!state||state.finished||state.closed||state.shots.length>=3||!raw||!field(raw.sector,raw.mult)||!raw.aim||!field(raw.aim.sector,raw.aim.mult)||raw.aim.sector===0)return false;
  const knockedOut=raw.knockedOut||[],index=state.shots.length;
  if(!Array.isArray(knockedOut)||knockedOut.length>2||knockedOut.some(i=>!Number.isInteger(i)||i<0||i>=index))return false;
  const shot={...raw,aim:{...raw.aim},knockedOut:[...new Set(knockedOut)],fallen:false};
  const stats=state.stats[state.turn];stats.darts++;
  if(raw.aim.mult===2&&raw.aim.sector*2===state.scores[state.turn])stats.checkoutAttempts++;
  state.shots.push(shot);for(const i of shot.knockedOut)state.shots[i].fallen=true;
  let remaining=state.visitStart,bust=false,checked=false;
  for(const hit of state.shots){
   if(hit.fallen||hit.bounceOut||hit.robinHood)continue;
   remaining-=hit.sector*hit.mult;
   if(remaining<0||remaining===1||remaining===0&&hit.mult!==2){bust=true;break;}
   if(remaining===0){checked=true;break;}
  }
  state.bust=bust;state.scores[state.turn]=bust?state.visitStart:remaining;state.closed=bust||checked||state.shots.length===3;
  if(state.closed){
   const points=bust?0:state.visitStart-remaining;stats.points+=points;stats.visits++;stats.busts+=Number(bust);stats.maximums+=Number(points===180);
   state.lastVisit={turn:state.turn,points,bust,darts:state.shots.length};
   if(checked){stats.checkouts++;stats.bestCheckout=Math.max(stats.bestCheckout,points);state.legs[state.turn]++;state.totalLegs++;state.legWon=true;
    if(state.legs[state.turn]>=state.legsToWin){state.finished=true;state.winner=state.turn;}}
  }
  return true;
 }
 function next(state){
  if(!state||!state.closed||state.finished)return false;
  if(state.legWon){state.scores=[state.startScore,state.startScore];state.turn=(state.starter+state.totalLegs)%2;}else state.turn=1-state.turn;
  state.shots=[];state.visitStart=state.scores[state.turn];state.closed=false;state.bust=false;state.legWon=false;return true;
 }
 function average(state,side){const stats=state.stats[side],pending=side===state.turn&&!state.closed?state.visitStart-state.scores[side]:0;return stats.darts?(stats.points+pending)*3/stats.darts:0;}
 function visitFor(state){
  const visit={dartsThrown:0,side:state.turn?'p2':'p1',sector:null,mult:null,streak:0,physicsDarts:[],bounceOutLandedDarts:[]};
  for(const [index,shot]of state.shots.entries()){
   const hit=shot.aim.mult>1&&shot.sector===shot.aim.sector&&shot.mult===shot.aim.mult&&!shot.bounceOut&&!shot.robinHood;
   visit.streak=hit?Math.min(2,(visit.sector===shot.aim.sector&&visit.mult===shot.aim.mult?visit.streak:0)+1):0;visit.sector=hit?shot.aim.sector:null;visit.mult=hit?shot.aim.mult:null;
   visit.physicsDarts=visit.physicsDarts.filter(d=>!shot.knockedOut.includes(d.visitDartIndex));visit.bounceOutLandedDarts=visit.bounceOutLandedDarts.filter(d=>!shot.knockedOut.includes(d.visitDartIndex));
   if(!shot.bounceOut&&shot.point)visit.physicsDarts.push({...shot.point,dartPose:shot.pose||undefined,dartStyle:state.players[state.turn].appearance,visitDartIndex:index,robinHood:shot.robinHood===true,attachedToVisitDartIndex:shot.attachedTo});
   if(!shot.bounceOut&&!shot.robinHood&&shot.sector>0)visit.bounceOutLandedDarts.push({sector:shot.sector,mult:shot.mult,visitDartIndex:index});visit.dartsThrown++;
  }
  return visit;
 }
 root.localDarts=Object.freeze({create,append,next,average,visitFor});
})(globalThis);
