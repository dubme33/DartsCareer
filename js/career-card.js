/* Read-only, bounded data for the downloadable career card. */
(function(root){
 'use strict';
 const clean=(v,max=200)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max):'';
 const positive=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
 const normalize=v=>clean(v).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function titlePriority(row){
  const name=normalize(row.sourceName||row.name);
  if(/world championship|world darts championship|global championship|mistrzostwa swiata/.test(name)&&!/youth|junior|mlodzie/.test(name))return 100;
  if(/world matchplay|global matchplay/.test(name))return 90;
  if(/grand slam/.test(name))return 85;
  if(/premier league.*final|global darts league.*final/.test(name))return 80;
  if(/world grand prix|world masters|uk open|european championship|players championship.*final|players cup.*final|world series.*final|world cup of darts|puchar narodow/.test(name))return 70;
  return row.series?30:40;
 }
 function highlights(rows){
  return(Array.isArray(rows)?rows:[]).filter(r=>r&&typeof r.name==='string'&&positive(r.count)>0)
   .map(r=>({name:clean(r.name,240),count:Math.floor(r.count),series:r.series===true,priority:titlePriority(r),latestYear:Number.isInteger(r.latestYear)?r.latestYear:0,
    years:(Array.isArray(r.years)?r.years:[]).filter(y=>Number.isInteger(y.year)&&y.year>=1900&&y.year<=9999&&positive(y.count)>0).map(y=>y.year)}))
   .sort((a,b)=>b.priority-a.priority||b.count-a.count||b.latestYear-a.latestYear||a.name.localeCompare(b.name)).slice(0,3);
 }
 function create(candidate,{date,rank=null,titleRows=[],loadout={}}={}){
  if(!candidate||!clean(candidate.name))return null;
  const stamp=new Date(date);if(!Number.isFinite(stamp.getTime()))return null;
  const year=stamp.getFullYear(),season=candidate.seasonStats,stats=Number(season?.year)===year?season?.matchStats:null;
  const count=positive(stats?.averageCount),sum=positive(stats?.averageTotal),average=count>0&&Number.isInteger(count)&&sum!==null?sum/count:null;
  const gameDay=[year,String(stamp.getMonth()+1).padStart(2,'0'),String(stamp.getDate()).padStart(2,'0')].join('-');
  return{name:clean(candidate.name,160),nickname:clean(candidate.nickname??candidate.nickName,100),country:clean(candidate.country,100),date:stamp.toISOString(),gameDay,year,
   rank:Number.isInteger(rank)&&rank>0?rank:null,average:average!==null&&Number.isFinite(average)?average:null,averageCount:average===null?0:count,
   highlights:highlights(titleRows),loadout:JSON.parse(JSON.stringify(loadout)),titleCount:(Array.isArray(titleRows)?titleRows:[]).reduce((n,r)=>n+(positive(r?.count)||0),0)};
 }
 function filename(data){const slug=normalize(data.name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)||'player';return`dartscareer-${slug}-${data.gameDay}.png`;}
 root.careerCardData=Object.freeze({create,highlights,filename});
})(globalThis);
