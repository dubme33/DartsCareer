/* Deterministic scoring. Throw accuracy and physics are supplied by the existing match engine. */
(function(root){
 'use strict';
 const checkoutTargets=Object.freeze({easy:[40,32,24,16,20,36,28,12,8,4],standard:[41,52,61,64,68,76,81,85,96,100],hard:[101,104,110,117,121,124,130,132,161,170]});
 let sequence=0;
 const validMode=mode=>['bobs27','clock','checkout'].includes(mode);
 const validField=(sector,mult)=>(sector===0&&mult===0)||(Number.isInteger(sector)&&sector>=1&&sector<=20&&[1,2,3].includes(mult))||(sector===25&&[1,2].includes(mult));
 function create(mode,level='standard',date=new Date().toISOString()){
  if(!validMode(mode)||mode==='checkout'&&!Object.hasOwn(checkoutTargets,level))return null;
  return{version:1,id:`practice-${Date.now()}-${++sequence}`,startedAt:Date.now(),gameDate:new Date(date).toISOString(),mode,level:mode==='checkout'?level:'standard',visits:[{shots:[]}]};
 }
 function cleanShot(raw,index){
  if(!raw||!validField(raw.sector,raw.mult)||!raw.aim||!validField(raw.aim.sector,raw.aim.mult)||raw.aim.sector===0)return null;
  const knockedOut=raw.knockedOut??[];
  if(!Array.isArray(knockedOut)||knockedOut.length>2||knockedOut.some(i=>!Number.isInteger(i)||i<0||i>=index))return null;
  const point=raw.point&&Number.isFinite(raw.point.x)&&Number.isFinite(raw.point.y)&&Math.abs(raw.point.x)<2000&&Math.abs(raw.point.y)<2000?{x:raw.point.x,y:raw.point.y}:null;
  const pose=raw.pose&&['x','y','z'].every(k=>Number.isFinite(raw.pose[k])&&Math.abs(raw.pose[k])<10)?{x:raw.pose.x,y:raw.pose.y,z:raw.pose.z}:null;
  const style={flightSystem:['separate','integrated-solid','integrated-clear','integrated-ribbed','integrated-frosted'].includes(raw.style?.flightSystem)?raw.style.flightSystem:'separate',
   flightColor:/^#[0-9a-f]{6}$/i.test(raw.style?.flightColor)?raw.style.flightColor:'#f1c40f'};
  if(Number.isFinite(raw.style?.dartEntryAngle)&&raw.style.dartEntryAngle>=-10&&raw.style.dartEntryAngle<=45)style.dartEntryAngle=raw.style.dartEntryAngle;
  return{sector:raw.sector,mult:raw.mult,aim:{sector:raw.aim.sector,mult:raw.aim.mult},knockedOut:[...new Set(knockedOut)],point,pose,style,bounceOut:raw.bounceOut===true,robinHood:raw.robinHood===true,
   attachedTo:Number.isInteger(raw.attachedTo)&&raw.attachedTo>=0&&raw.attachedTo<index?raw.attachedTo:null};
 }
 function evaluate(raw){
  if(!raw||raw.version!==1||!validMode(raw.mode)||typeof raw.id!=='string'||raw.id.length>100||!Number.isFinite(raw.startedAt)
   ||!Number.isFinite(new Date(raw.gameDate).getTime())||raw.mode==='checkout'&&!Object.hasOwn(checkoutTargets,raw.level)
   ||!Array.isArray(raw.visits)||!raw.visits.length||raw.visits.length>40)return null;
  const session={version:1,id:raw.id,startedAt:raw.startedAt,gameDate:new Date(raw.gameDate).toISOString(),mode:raw.mode,level:raw.mode==='checkout'?raw.level:'standard',visits:[]};
  let bobScore=27,clockTarget=1,successes=0,darts=0,ended=false,won=false,view=null;
  for(let v=0;v<raw.visits.length;v++){
   const visit=raw.visits[v];if(ended||!Array.isArray(visit?.shots)||visit.shots.length>3||v>0&&!view.closed)return null;
   if(raw.mode==='bobs27'&&v>=21||raw.mode==='checkout'&&v>=10)return null;
   const startTarget=clockTarget,checkoutTarget=checkoutTargets[raw.level]?.[v]||0,shots=[];
   let remaining=checkoutTarget,closed=false,bust=false,hits=0,target=raw.mode==='bobs27'?(v===20?25:v+1):clockTarget;
   for(let index=0;index<visit.shots.length;index++){
    if(closed||ended)return null;const shot=cleanShot(visit.shots[index],index);if(!shot)return null;shots.push({...shot,fallen:false});
    for(const fallen of shot.knockedOut)shots[fallen].fallen=true;
    darts++;clockTarget=startTarget;remaining=checkoutTarget;hits=0;bust=false;let checked=false;
    for(const hit of shots){
     if(hit.fallen||hit.bounceOut||hit.robinHood)continue;
     if(raw.mode==='bobs27'){if(hit.sector===target&&hit.mult===2)hits++;}
     else if(raw.mode==='clock'){if(hit.sector===clockTarget&&hit.mult>0)clockTarget++;}
     else {remaining-=hit.sector*hit.mult;if(remaining<0||remaining===1||remaining===0&&hit.mult!==2){bust=true;break;}if(remaining===0){checked=true;break;}}
    }
    closed=shots.length===3||raw.mode==='checkout'&&(checked||bust)||raw.mode==='clock'&&(clockTarget===21||darts===120);
    if(raw.mode==='clock'&&(clockTarget===21||darts===120)){ended=true;won=clockTarget===21;}
    if(raw.mode==='checkout'&&closed&&checked)successes++;
   }
   if(raw.mode==='bobs27'&&closed){bobScore+=hits?hits*target*2:-target*2;ended=bobScore<0||v===20;won=v===20&&bobScore>=0;}
   if(raw.mode==='checkout'&&closed&&v===9){ended=true;won=successes===10;}
   session.visits.push({shots:shots.map(({fallen,...shot})=>shot)});
   view={round:v+1,shots,target:raw.mode==='clock'?Math.min(20,clockTarget):target,checkoutTarget,remaining,bust,hits,closed};
  }
  return{session,...view,bobScore,clockTarget,successes,darts,ended,won,score:raw.mode==='bobs27'?bobScore:raw.mode==='clock'?darts:successes};
 }
 function append(raw,shot){const state=evaluate(raw);if(!state||state.ended||state.closed)return null;const next=state.session;next.visits.at(-1).shots.push(shot);return evaluate(next)?.session||null;}
 function next(raw){const state=evaluate(raw);if(!state||state.ended||!state.closed)return null;const session=state.session;session.visits.push({shots:[]});return evaluate(session)?.session||null;}
 function visitFor(state){
  const visit={dartsThrown:0,side:'p1',sector:null,mult:null,streak:0,physicsDarts:[],bounceOutLandedDarts:[]};
  for(const [index,shot]of state.shots.entries()){
   const precise=shot.aim.mult>1,hit=precise&&shot.sector===shot.aim.sector&&shot.mult===shot.aim.mult&&!shot.bounceOut&&!shot.robinHood;
   visit.streak=hit?Math.min(2,(visit.sector===shot.aim.sector&&visit.mult===shot.aim.mult?visit.streak:0)+1):0;
   visit.sector=hit?shot.aim.sector:null;visit.mult=hit?shot.aim.mult:null;
   visit.physicsDarts=visit.physicsDarts.filter(d=>!shot.knockedOut.includes(d.visitDartIndex));
   visit.bounceOutLandedDarts=visit.bounceOutLandedDarts.filter(d=>!shot.knockedOut.includes(d.visitDartIndex));
   if(!shot.bounceOut&&shot.point)visit.physicsDarts.push({...shot.point,dartPose:shot.pose||undefined,dartStyle:shot.style,visitDartIndex:index,robinHood:shot.robinHood,attachedToVisitDartIndex:shot.attachedTo});
   if(!shot.bounceOut&&shot.sector>0)visit.bounceOutLandedDarts.push({sector:shot.sector,mult:shot.mult,visitDartIndex:index});
   visit.dartsThrown++;
  }
  return visit;
 }
 function summary(state,aborted=false){return{id:state.session.id,mode:state.session.mode,level:state.session.level,score:state.score,darts:state.darts,progress:Math.min(20,state.clockTarget-1),won:state.won,aborted,finishedAt:Date.now(),gameDate:state.session.gameDate};}
 function validSummary(value){return value&&typeof value.id==='string'&&value.id.length<=100&&validMode(value.mode)&&['easy','standard','hard'].includes(value.level)
  &&Number.isInteger(value.darts)&&value.darts>0&&value.darts<=120&&Number.isInteger(value.score)&&value.score>=-49&&value.score<=1437
  &&Number.isFinite(value.finishedAt)&&Math.abs(value.finishedAt)<=8640000000000000&&Number.isFinite(new Date(value.gameDate).getTime())&&(value.mode!=='checkout'||value.score>=0&&value.score<=10)
  &&(value.mode!=='clock'||value.score===value.darts);}
 function cleanSummary(value){return validSummary(value)?{id:value.id,mode:value.mode,level:value.level,score:value.score,darts:value.darts,progress:Number.isInteger(value.progress)&&value.progress>=0&&value.progress<=20?value.progress:value.won?20:0,won:value.won===true,aborted:value.aborted===true,finishedAt:value.finishedAt,gameDate:new Date(value.gameDate).toISOString()}:null;}
 const key=value=>value.mode==='checkout'?`checkout-${value.level}`:value.mode;
 function isRecord(result,old){if(result.aborted||result.mode==='clock'&&!result.won)return false;return !old||(result.mode==='clock'?result.darts<old.darts:result.score>old.score);}
 function normalize(candidate){
  const old=candidate.practiceMiniGames||{},history=Array.isArray(old.history)?old.history.slice(0,30).map(cleanSummary).filter(Boolean):[],records={};
  for(const name of ['bobs27','clock','checkout-easy','checkout-standard','checkout-hard']){const saved=cleanSummary(old.records?.[name]);if(saved&&key(saved)===name&&isRecord(saved,null))records[name]=saved;}
  for(const result of history)if(isRecord(result,records[key(result)]))records[key(result)]=result;
  return candidate.practiceMiniGames={version:1,active:evaluate(old.active)?.session||null,history,records};
 }
 function finish(data,state,aborted=false){
  if(!state.darts||data.history.some(h=>h.id===state.session.id)||!aborted&&!state.ended)return false;
  const result=summary(state,aborted);data.history.unshift(result);data.history=data.history.slice(0,30);if(isRecord(result,data.records[key(result)]))data.records[key(result)]=result;return true;
 }
 root.practiceGames=Object.freeze({checkoutTargets,create,evaluate,append,next,visitFor,normalize,finish,key});
})(globalThis);
