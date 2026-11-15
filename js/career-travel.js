/* A career-only record of settled tournament results. No rankings or cash are changed. */
(function(root){
 'use strict';
 const clean=(value,max=200)=>typeof value==='string'?value.trim().slice(0,max):'';
 const amount=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null;
 const plain=value=>value&&typeof value==='object'&&!Array.isArray(value);
 const normalized=value=>clean(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
 function isQualifier(event){return typeof isFinanceQualifier==='function'?isFinanceQualifier(event):/qualif|kwalifik|q.?school|pro card trials/i.test(`${event.name} ${event.sourceName||''} ${event.specialType||''}`);}
 function editionKey(event,date,stage=''){
  const year=new Date(date).getFullYear(),school=event.specialType==='pdcQSchool'||/q.?school|pro card trials/i.test(`${event.name} ${event.sourceName||''}`);
  return JSON.stringify([year,clean(event.sourceName||event.name).toLowerCase(),school?[clean(event.country),stage||event.qSchoolStage||'',new Date(date).toISOString().slice(0,10)]:null]);
 }
 function validRow(raw){return plain(raw)&&typeof raw.name==='string'&&Number.isFinite(raw.date)&&!Number.isNaN(new Date(raw.date).getTime())&&Number.isInteger(raw.year)&&raw.year>=1900&&raw.year<=9999;}
 function copyRow(raw){return validRow(raw)?{name:clean(raw.name),sourceName:clean(raw.sourceName),country:clean(raw.country,100),city:clean(raw.city,100),date:raw.date,year:raw.year,
  round:Number.isFinite(raw.round)?Math.max(0,raw.round):0,won:raw.won===true,qualifier:raw.qualifier===true,stage:clean(raw.stage,100),prizeMoney:amount(raw.prizeMoney),inferred:raw.inferred===true,
  resultKeys:Array.isArray(raw.resultKeys)?raw.resultKeys.filter(k=>typeof k==='string').slice(-64).map(k=>k.slice(0,500)):[]}:null;}
 function add(ledger,event,result,{inferred=false,finance=null}={}){
  const date=Number(result.timestamp);if(!Number.isFinite(date)||Number.isNaN(new Date(date).getTime())||!clean(event?.name))return false;
  const year=new Date(date).getFullYear();if(year<1900||year>9999)return false;
  const key=editionKey(event,date,result.stage),resultKey=clean(result.key,500)||JSON.stringify([date,result.round,result.stage||'']);
  let row=copyRow(ledger.entries[key]);if(row)ledger.entries[key]=row;if(!row){row=ledger.entries[key]={name:clean(event.name),sourceName:clean(event.sourceName||event.name),country:clean(event.country,100),city:clean(event.city,100),date,year,
    round:Math.max(0,Number(result.round)||0),won:false,qualifier:isQualifier(event),stage:'',prizeMoney:0,inferred,resultKeys:[]};}
  if(row.resultKeys.includes(resultKey))return false;
  row.resultKeys.push(resultKey);row.resultKeys=row.resultKeys.slice(-64);row.date=Math.max(row.date,date);row.won=row.won||result.won===true;
  row.round=Math.max(0,Number(result.round)||0);row.stage=clean(result.stage,100);
  if(amount(finance?.prize)!==null)row.prizeMoney=finance.prize;
  else if(amount(result.prizeMoney)!==null)row.prizeMoney=row.prizeMoney===null?null:row.prizeMoney+result.prizeMoney;
  else row.prizeMoney=null;
  return true;
 }
 function ensure(candidate,events=[]){
  if(!candidate)return{version:1,entries:{},legacyImported:true};
  if(candidate.careerTravel?.version===1&&plain(candidate.careerTravel.entries)&&candidate.careerTravel.legacyImported===true)return candidate.careerTravel;
  const entries=Object.create(null),raw=candidate.careerTravel;
  if(raw?.version===1&&plain(raw.entries))for(const [key,value]of Object.entries(raw.entries)){const row=copyRow(value);if(row)entries[key]=row;}
  const ledger=candidate.careerTravel={version:1,entries,legacyImported:true};
  const lookup=new Map();for(const event of events)for(const name of [event?.name,event?.sourceName])if(name&&!lookup.has(normalized(name)))lookup.set(normalized(name),event);
  const eventFor=(name,source)=>lookup.get(normalized(source))||lookup.get(normalized(name))||{name,sourceName:source||name,country:'',city:''};
  const finances=plain(candidate.tournamentFinances?.entries)?Object.values(candidate.tournamentFinances.entries):[];
  const financeFor=(event,year)=>finances.find(f=>f.year===year&&[normalized(event.sourceName),normalized(event.name)].includes(normalized(f.sourceName||f.name)));
  for(const result of Array.isArray(candidate.seasonStats?.results)?candidate.seasonStats.results:[]){
   if(!result||typeof result.tournament!=='string')continue;const event=eventFor(result.tournament,result.sourceTournament),year=new Date(result.timestamp).getFullYear();
   add(ledger,event,result,{inferred:true,finance:financeFor(event,year)});
  }
  for(const finance of finances){
   if(!finance||!Number.isInteger(finance.year)||typeof finance.won!=='boolean'||!Number.isFinite(finance.settledAt))continue;
   const event=eventFor(finance.name,finance.sourceName),key=editionKey(event,finance.settledAt,finance.stage);
   if(ledger.entries[key])continue;
   add(ledger,event,{key:`finance:${key}`,timestamp:finance.settledAt,round:finance.round,won:finance.won,stage:finance.stage,prizeMoney:finance.prize},{inferred:true,finance});
  }
  return ledger;
 }
 function record(candidate,event,result){
  if(!event?.name||!result||!Number.isFinite(Number(result.timestamp))||!Number.isFinite(new Date(result.timestamp).getTime()))return false;
  if(typeof player==='undefined'||!player||candidate!==player&&!(typeof isCurrentPlayer==='function'&&isCurrentPlayer(candidate)))return false;
  const ledger=ensure(player,typeof tournamentDatabase!=='undefined'?tournamentDatabase:[]);
  const finance=typeof getTournamentFinanceEntry==='function'?getTournamentFinanceEntry(event,new Date(result.timestamp).getFullYear()):null;
  // The first result may already have been recovered during initialization.
  const key=editionKey(event,result.timestamp,result.stage),existing=ledger.entries[key];
  if(existing?.inferred&&Array.isArray(existing.resultKeys)&&existing.resultKeys.includes(result.key)){
   existing.country=clean(event.country,100);existing.city=clean(event.city,100);existing.inferred=false;return true;
  }
  return add(ledger,event,result,{finance});
 }
 let aliasFlags=null,aliases=new Map();
 function getCountryCode(name){
  const current=typeof flags==='object'?flags:null;
  if(current!==aliasFlags||!aliases.size){aliasFlags=current;aliases=new Map();
   for(const [country,code]of Object.entries(current||{}))if(typeof code==='string')aliases.set(normalized(country),code.toLowerCase());
   for(const code of Object.keys(root.careerWorldAtlas?.positions||{})){
    aliases.set(normalized(code),code);
    if(/^[a-z]{2}$/.test(code))for(const lang of ['pl','en','de','nl']){try{aliases.set(normalized(new Intl.DisplayNames([lang],{type:'region'}).of(code.toUpperCase())),code);}catch(_){}}
   }
   for(const [name,code]of Object.entries({England:'gb-eng',Scotland:'gb-sct',Wales:'gb-wls','Northern Ireland':'gb-nir',Anglia:'gb-eng',Szkocja:'gb-sct',Walia:'gb-wls','Irlandia Północna':'gb-nir',UK:'gb',USA:'us','Great Britain':'gb',Britain:'gb',Turkey:'tr',Turkiye:'tr','Czech Republic':'cz',Holland:'nl','The Netherlands':'nl'}))aliases.set(normalized(name),code);
  }
  return aliases.get(normalized(name))||null;
 }
 function report(ledger,{year=null,qualifiers=false}={}){
  const countries=new Map();let events=0,wins=0,prizes=0,unknownPrizes=0,inferred=0;
  for(const value of Object.values(ledger?.entries||{})){const row=copyRow(value);if(!row||year!==null&&row.year!==Number(year)||!qualifiers&&row.qualifier)continue;
   const code=getCountryCode(row.country),key=code||`unknown:${normalized(row.country)||'missing'}`;
   if(!countries.has(key))countries.set(key,{key,code,name:row.country,position:code?root.careerWorldAtlas?.positions[code]||null:null,entries:[],wins:0,prizes:0,unknownPrizes:0});
   const country=countries.get(key);country.entries.push(row);country.wins+=Number(row.won&&!row.qualifier);country.prizes+=row.prizeMoney||0;country.unknownPrizes+=Number(row.prizeMoney===null);
   events++;wins+=Number(row.won&&!row.qualifier);prizes+=row.prizeMoney||0;unknownPrizes+=Number(row.prizeMoney===null);inferred+=Number(row.inferred);
  }
  const rows=[...countries.values()].sort((a,b)=>b.entries.length-a.entries.length||a.name.localeCompare(b.name));rows.forEach(c=>c.entries.sort((a,b)=>b.date-a.date));
  return{countries:rows,events,wins,prizes,unknownPrizes,inferred};
 }
 root.careerTravel=Object.freeze({ensure,record,report,getCountryCode,editionKey});
 root.recordCareerTravelResult=record;
})(globalThis);
