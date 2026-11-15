const CAREER_CARD_TEXT={
 open:['Pobierz kartę kariery','Download career card','Karrierekarte herunterladen','Carrièrekaart downloaden'],profile:['Profil i karta kariery','Profile and career card','Profil und Karrierekarte','Profiel en carrièrekaart'],
 title:['Twoja karta kariery','Your career card','Deine Karrierekarte','Je carrièrekaart'],intro:['Aktualny stan kariery na jednej grafice. Pobierz PNG i udostępnij je np. na Discordzie.','Your current career on one image. Download the PNG and share it on Discord, for example.','Deine aktuelle Karriere auf einem Bild. Lade das PNG herunter und teile es zum Beispiel auf Discord.','Je huidige carrière op één afbeelding. Download de PNG en deel hem bijvoorbeeld op Discord.'],
 download:['Pobierz PNG','Download PNG','PNG herunterladen','PNG downloaden'],close:['Zamknij','Close','Schließen','Sluiten'],loading:['Przygotowywanie karty…','Preparing card…','Karte wird erstellt…','Kaart voorbereiden…'],error:['Nie udało się przygotować karty. Spróbuj ponownie.','The card could not be created. Please try again.','Die Karte konnte nicht erstellt werden. Versuche es erneut.','De kaart kon niet worden gemaakt. Probeer het opnieuw.'],
 photoMissing:['Zdjęcie nie jest dostępne. Możesz dodać je w menu kariery i pobrać kartę ponownie.','Photo unavailable. You can add one in the career menu and download the card again.','Foto nicht verfügbar. Du kannst im Karrieremenü eines hinzufügen und die Karte erneut herunterladen.','Foto niet beschikbaar. Voeg er een toe in het carrièremenu en download de kaart opnieuw.'],
 rank:['RANKING ŚWIATOWY · OOM','WORLD RANKING · OOM','WELTRANGLISTE · OOM','WERELDRANGLIJST · OOM'],average:['ŚREDNIA SEZONU','SEASON AVERAGE','SAISONSCHNITT','SEIZOENSGEMIDDELDE'],matches:['Mecze z danymi','Matches with data','Spiele mit Daten','Wedstrijden met gegevens'],avgNote:['Średnia arytmetyczna z zarejestrowanych średnich meczowych w sezonie.','Arithmetic mean of recorded match averages this season.','Arithmetischer Mittelwert der erfassten Spieldurchschnitte dieser Saison.','Rekenkundig gemiddelde van vastgelegde wedstrijdgemiddelden dit seizoen.'],
 successes:['NAJWIĘKSZE SUKCESY','CAREER HIGHLIGHTS','GRÖSSTE ERFOLGE','GROOTSTE SUCCESSEN'],empty:['Pierwsze sukcesy jeszcze przed Tobą','Your first successes are still ahead','Die ersten Erfolge liegen noch vor dir','Je eerste successen liggen nog voor je'],noData:['Brak danych','No data','Keine Daten','Geen gegevens'],darts:['AKTUALNE LOTKI','CURRENT DARTS','AKTUELLE DARTS','HUIDIGE DARTS'],barrel:['Barrel','Barrel','Barrel','Barrel'],point:['Grot','Point','Spitze','Punt'],shaft:['Shaft','Shaft','Shaft','Shaft'],card:['KARTA KARIERY','CAREER CARD','KARRIEREKARTE','CARRIÈREKAART'],titles:['Tytuły kariery','Career titles','Karrieretitel','Carrièretitels']
};
let careerCardActive=null,careerCardGeneration=0;
function trCareerCard(key,language=currentLang){return(CAREER_CARD_TEXT[key]||[key])[Math.max(0,['pl','en','de','nl'].indexOf(language))]||key;}
function careerCardOwn(candidate){return!!player?.name&&!!candidate&&(candidate===player||typeof samePlayer==='function'&&samePlayer(candidate,player));}
function renderCareerCardProfileAction(candidate){return careerCardOwn(candidate)?`<div class="career-card-profile-action"><button type="button" class="action-btn" data-career-card-label="open" onclick="openCareerCard()">${escapeHtml(trCareerCard('open'))}</button></div>`:'';}
function careerCardSnapshot(){
 // Title recovery may normalize its argument. Give it a copy of only its inputs.
 const owner=player,copy=JSON.parse(JSON.stringify({id:owner.id,name:owner.name,sourceName:owner.sourceName,country:owner.country,kind:owner.kind,isNewgen:owner.isNewgen,editorCreated:owner.editorCreated,
  careerTitles:owner.careerTitles,careerTitlesVersion:owner.careerTitlesVersion,careerStats:{trophies:owner.careerStats?.trophies},careerChronicle:owner.careerChronicle,seasonStats:owner.seasonStats}));
 const titles=getPlayerProfileCareerTitles(copy),rows=getPlayerCareerTitleRows(titles);
 return careerCardData.create(owner,{date:currentDate,rank:getRankingPosition(owner,'main'),titleRows:rows,loadout:getDartLoadoutSnapshot(owner)});
}
function careerCardLoadImage(source,timeout=6500){
 return new Promise(resolve=>{let url;try{url=new URL(source,document.baseURI);}catch(_){resolve(null);return;}if(typeof source!=='string'||!source||!['http:','https:','blob:','data:'].includes(url.protocol)||url.protocol==='data:'&&!/^data:image\//i.test(source)){resolve(null);return;}
  const image=new Image();image.crossOrigin='anonymous';image.referrerPolicy='no-referrer';let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);image.onload=image.onerror=null;resolve(value);};
  const timer=setTimeout(()=>finish(null),timeout);image.onload=()=>finish(image.naturalWidth&&image.naturalHeight?image:null);image.onerror=()=>finish(null);image.src=source;
 });
}
function closeCareerCard(){careerCardGeneration++;const old=careerCardActive;careerCardActive=null;if(old?.dialog.open)old.dialog.close();old?.dialog.remove();old?.trigger?.focus({preventScroll:true});}
function careerCardFitText(ctx,text,x,y,width,size=32,min=18,color='#eef4fb'){
 let value=String(text),font=size;ctx.fillStyle=color;ctx.textAlign='left';ctx.font=`600 ${font}px Arial, sans-serif`;
 while(font>min&&ctx.measureText(value).width>width){font--;ctx.font=`600 ${font}px Arial, sans-serif`;}
 if(ctx.measureText(value).width>width){const chars=Array.from(value);while(chars.length&&ctx.measureText(chars.join('')+'…').width>width)chars.pop();value=chars.join('')+'…';}
 ctx.fillText(value,x,y);return value;
}
function drawCareerCard(canvas,data,{photo=null,dart=null,language='pl'}={}){
 const c=canvas.getContext('2d'),tr=k=>trCareerCard(k,language),locale={pl:'pl-PL',en:'en-GB',de:'de-DE',nl:'nl-NL'}[language]||'en-GB',a=dartModel.normalize(data.loadout),diameter=(dartModel.dimensions(a).barrelRadius*2).toFixed(1);
 canvas.width=1200;canvas.height=800;const bg=c.createLinearGradient(0,0,1200,800);bg.addColorStop(0,'#142c43');bg.addColorStop(1,'#080f22');c.fillStyle=bg;c.fillRect(0,0,1200,800);
 c.fillStyle='#29cb92';c.fillRect(0,0,1200,9);c.fillStyle='#1d3f55';for(let i=0;i<6;i++){c.beginPath();c.moveTo(930+i*62,0);c.lineTo(1200,220+i*62);c.lineTo(1200,230+i*62);c.lineTo(920+i*62,0);c.fill();}
 c.fillStyle='#8ce9c4';c.font='700 21px Arial, sans-serif';c.fillText('DARTS CAREER',52,57);c.textAlign='right';c.fillStyle='#a9bed0';c.font='16px Arial, sans-serif';c.fillText(tr('card')+' · '+new Date(data.date).toLocaleDateString(locale),1148,57);c.textAlign='left';
 c.fillStyle='#203c52';c.fillRect(52,110,278,346);
 if(photo){const scale=Math.max(278/photo.naturalWidth,346/photo.naturalHeight),w=278/scale,h=346/scale;c.save();c.beginPath();c.rect(52,110,278,346);c.clip();c.drawImage(photo,(photo.naturalWidth-w)/2,Math.min((photo.naturalHeight-h)/2,photo.naturalHeight*.08),w,h,52,110,278,346);c.restore();}
 else{c.fillStyle='#416076';c.beginPath();c.arc(191,225,58,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(191,382,104,95,0,Math.PI,Math.PI*2);c.fill();const initials=data.name.split(/\s+/).map(p=>Array.from(p)[0]).slice(0,2).join('').toUpperCase();c.fillStyle='#fff';c.textAlign='center';c.font='700 42px Arial, sans-serif';c.fillText(initials,191,241);c.textAlign='left';}
 c.strokeStyle='#4e7788';c.lineWidth=2;c.strokeRect(52,110,278,346);
 careerCardFitText(c,data.name,370,160,778,48,26);if(data.nickname)careerCardFitText(c,'“'+data.nickname+'”',370,209,778,28,20,'#8ce9c4');
 let country=data.country;if(typeof t==='function'&&language===currentLang)country=t(country);careerCardFitText(c,country||'DARTS CAREER',370,254,778,22,18,'#a9bed0');
 for(const [x,w,label,value]of [[370,365,tr('rank'),data.rank?'#'+data.rank:'—'],[755,393,tr('average')+' · '+data.year,data.average===null?'—':data.average.toFixed(2)]]){c.fillStyle='#19384c';c.fillRect(x,288,w,124);careerCardFitText(c,label,x+22,319,w-44,17,13,'#a9bed0');c.fillStyle='#fff';c.font='700 51px Arial, sans-serif';c.fillText(value,x+22,379);}
 careerCardFitText(c,data.averageCount?tr('matches')+': '+data.averageCount:tr('noData'),777,401,345,13,12,'#a9bed0');
 careerCardFitText(c,tr('titles').toUpperCase(),52,497,278,18,14,'#a9bed0');careerCardFitText(c,String(data.titleCount),52,551,278,48,30,'#8ce9c4');
 careerCardFitText(c,tr('successes'),370,453,778,19,15,'#8ce9c4');
 if(!data.highlights.length)careerCardFitText(c,tr('empty'),370,507,778,27,20,'#a9bed0');
 data.highlights.forEach((row,i)=>{c.fillStyle='#29cb92';c.fillRect(370,481+i*39,4,21);const year=row.years.length?' · '+row.years.slice(-3).join(', '):'';careerCardFitText(c,row.name+' ×'+row.count+year,390,499+i*39,758,26,17);});
 c.fillStyle='#112c40';c.fillRect(52,602,1096,142);c.strokeStyle='#365769';c.strokeRect(52,602,1096,142);careerCardFitText(c,tr('darts'),76,634,282,18,14,'#8ce9c4');careerCardFitText(c,tr('barrel')+' '+a.barrelLength+' × '+diameter+' mm',76,670,300,19,15);careerCardFitText(c,a.weightGrams+' g · '+tr('point')+' '+a.tipLength+' mm',76,701,300,19,15,'#b1c9d7');
 if(dart)c.drawImage(dart,390,605,734,136);
 c.fillStyle='#8ca6b9';c.font='13px Arial, sans-serif';c.fillText(tr('avgNote'),52,776);c.textAlign='right';c.fillStyle='#8ce9c4';c.font='700 16px Arial, sans-serif';c.fillText('dartscareer.pl',1148,776);c.textAlign='left';
}
async function openCareerCard(){
 if(!player?.name||typeof isTournamentSimulationBusy==='function'&&isTournamentSimulationBusy()||typeof isCareerSlotOperationBusy==='function'&&isCareerSlotOperationBusy())return false;
 closeCareerCard();const owner=player,token=++careerCardGeneration,language=currentLang,dialog=document.createElement('dialog');dialog.id='career-card-dialog';dialog.className='career-card-dialog';const esc=escapeHtml;
 dialog.innerHTML=`<h2 id="career-card-title">${esc(trCareerCard('title'))}</h2><p>${esc(trCareerCard('intro'))}</p><p id="career-card-status" role="status" aria-live="polite">${esc(trCareerCard('loading'))}</p><canvas id="career-card-canvas" width="1200" height="800" role="img" aria-label="${esc(trCareerCard('title'))}" hidden></canvas><p class="career-card-note">${esc(trCareerCard('avgNote'))}</p><div class="career-card-actions"><button type="button" id="career-card-download" disabled>${esc(trCareerCard('download'))}</button><button type="button" id="career-card-close">${esc(trCareerCard('close'))}</button></div>`;
 dialog.setAttribute('aria-labelledby','career-card-title');const active=careerCardActive={owner,token,dialog,trigger:document.activeElement,blob:null,data:null};document.body.appendChild(dialog);dialog.showModal();dialog.oncancel=e=>{e.preventDefault();closeCareerCard();};dialog.querySelector('#career-card-close').onclick=closeCareerCard;dialog.querySelector('#career-card-download').onclick=downloadCareerCard;
 const valid=()=>careerCardActive===active&&careerCardGeneration===token&&player===owner&&dialog.open;
 try{
  const data=careerCardSnapshot();if(!data)throw new Error('No snapshot');active.data=data;
  const [photo,art]=await Promise.all([careerCardLoadImage(getPlayerProfilePhoto(owner)),data.loadout.flightArtwork?careerCardLoadImage(data.loadout.flightArtwork):null]);if(!valid())return false;
  if(art)dartModel.registerFlightArtwork(data.loadout.flightArtwork,art);
  const svg=document.createElement('div');svg.innerHTML=dartCustomizationPreviewMarkup(data.loadout,'career-share-card');const element=svg.querySelector('svg');element.setAttribute('xmlns','http://www.w3.org/2000/svg');element.setAttribute('width','1000');element.setAttribute('height','185');
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(element)],{type:'image/svg+xml;charset=utf-8'}));let dart;try{dart=await careerCardLoadImage(url);}finally{URL.revokeObjectURL(url);}if(!valid())return false;
  if(!dart)throw new Error('Dart image unavailable');const canvas=dialog.querySelector('canvas');drawCareerCard(canvas,data,{photo,dart,language});
  const blob=await new Promise((resolve,reject)=>{try{canvas.toBlob(v=>v?resolve(v):reject(new Error('PNG unavailable')),'image/png');}catch(e){reject(e);}});if(!valid())return false;
  active.blob=blob;canvas.hidden=false;dialog.querySelector('#career-card-status').textContent=photo?'':trCareerCard('photoMissing',language);dialog.querySelector('#career-card-download').disabled=false;return true;
 }catch(_){if(valid())dialog.querySelector('#career-card-status').textContent=trCareerCard('error',language);return false;}
}
function downloadCareerCard(){
 const active=careerCardActive;if(!active?.blob||active.owner!==player||!active.dialog.open)return false;
 const url=URL.createObjectURL(active.blob),link=document.createElement('a');link.href=url;link.download=careerCardData.filename(active.data);document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);return true;
}
function refreshCareerCardTranslations(){document.querySelectorAll('[data-career-card-label]').forEach(n=>n.textContent=trCareerCard(n.dataset.careerCardLabel));if(careerCardActive){if(careerCardActive.owner!==player)closeCareerCard();else openCareerCard();}}
if(typeof document!=='undefined')refreshCareerCardTranslations();
