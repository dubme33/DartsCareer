const LOCAL_DARTS_TEXT={
 title:['Mecz dwóch graczy','Two-player match','Spiel für zwei Spieler','Wedstrijd voor twee spelers'],intro:['Wybierzcie zawodników i lotki. Oboje rzucacie ręcznie na zmianę, bez przeciwnika AI. Wynik nie wpływa na karierę. Mecz pozostaje dostępny do odświeżenia strony.','Choose your players and darts. Both players throw manually in turn, without an AI opponent. Results do not affect careers. The match is available until the page is reloaded.','Wählt Spieler und Darts. Beide werfen abwechselnd manuell, ohne KI-Gegner. Das Ergebnis beeinflusst keine Karriere. Das Spiel bleibt bis zum Neuladen verfügbar.','Kies spelers en darts. Beiden gooien om de beurt handmatig, zonder AI-tegenstander. Resultaten beïnvloeden geen carrière. De wedstrijd blijft beschikbaar tot de pagina herlaadt.'],
 player:['Gracz','Player','Spieler','Speler'],guest:['Gość','Guest','Gast','Gast'],name:['Nazwa gracza','Player name','Spielername','Spelersnaam'],profile:['Lotki zawodnika','Player darts','Spieler-Darts','Darts van speler'],current:['Obecne lotki kariery','Current career darts','Aktuelle Karriere-Darts','Huidige carrièredarts'],slot:['Zapisany zestaw','Saved set','Gespeichertes Set','Opgeslagen set'],kit:['Wybierz zestaw','Choose darts','Darts wählen','Kies darts'],customize:['Dostosuj własne lotki','Customize your darts','Eigene Darts anpassen','Pas je darts aan'],
 start:['Rozpocznij mecz','Start match','Spiel starten','Start wedstrijd'],resume:['Wróć do meczu','Resume match','Spiel fortsetzen','Hervat wedstrijd'],setup:['Nowy mecz','New match','Neues Spiel','Nieuwe wedstrijd'],confirm:['Zakończyć bieżący mecz i utworzyć nowy?','End the current match and create a new one?','Das laufende Spiel beenden und ein neues erstellen?','De huidige wedstrijd stoppen en een nieuwe maken?'],
 back:['Wróć do menu','Back to menu','Zurück zum Menü','Terug naar menu'],score:['Punkty początkowe','Starting score','Startpunktzahl','Beginscore'],legs:['Legi do wygrania','Legs to win','Legs zum Sieg','Legs om te winnen'],starter:['Rozpoczyna pierwszy leg','Starts the first leg','Beginnt das erste Leg','Begint de eerste leg'],rules:['Double-out. Rozpoczynający zmienia się co leg. Celność zależy od wybranego zawodnika; wygląd lotek można zmieniać bez opłat.','Double-out. The starting player alternates each leg. Accuracy uses the selected player’s stats; dart customization is free.','Double-out. Der Anwurf wechselt jedes Leg. Die Präzision stammt vom gewählten Spieler; Darts lassen sich kostenlos anpassen.','Double-out. De starter wisselt ieder leg. Nauwkeurigheid gebruikt de gekozen speler; darts aanpassen is gratis.'],
 turn:['Rzuca','Throwing','Am Wurf','Aan de beurt'],throw:['Rzuć lotką','Throw dart','Dart werfen','Gooi dart'],next:['Przekaż kolejkę','Pass the turn','Wurf übergeben','Geef de beurt door'],nextLeg:['Następny leg','Next leg','Nächstes Leg','Volgende leg'],winner:['Wygrywa','Winner','Sieger','Winnaar'],legWon:['Leg dla','Leg won by','Leg gewonnen von','Leg gewonnen door'],bust:['Bust — punkty kolejki cofnięte','Bust — visit score restored','Bust — Aufnahme zurückgesetzt','Bust — beurt teruggedraaid'],aim:['Cel','Target','Ziel','Doel'],average:['Średnia','Average','Durchschnitt','Gemiddelde'],darts:['Lotki','Darts','Darts','Darts'],miss:['Pudło','Miss','Fehlwurf','Mis'],fallen:['Wypadła','Fallen','Herausgefallen','Gevallen'],checkout:['Najwyższy checkout','Highest checkout','Höchstes Finish','Hoogste finish'],blocked:['Poczekaj na zakończenie meczu, symulacji lub operacji zapisu.','Wait for the match, simulation or save operation to finish.','Warte auf das Ende des Spiels, der Simulation oder des Speichervorgangs.','Wacht tot de wedstrijd, simulatie of opslagactie klaar is.'],loading:['Przygotowanie grafiki…','Preparing artwork…','Grafik wird vorbereitet…','Afbeelding voorbereiden…']
};
let localDartsDrafts=null,localDartsRoster=[],localDartsMatch=null,localDartsSetup={score:501,legsToWin:3,starter:0},localDartsAim=null,localDartsThrowUntil=0,localDartsReturn='screen-create-player',localDartsPendingArt=0,localDartsView='setup',localDartsOpening=false,localDartsOwner=null;
function trLocal(key){return(LOCAL_DARTS_TEXT[key]||[key])[Math.max(0,['pl','en','de','nl'].indexOf(currentLang))]||key;}
function localDartsBlocked(){return typeof isTournamentSimulationBusy==='function'&&isTournamentSimulationBusy()||typeof isCareerSlotOperationBusy==='function'&&isCareerSlotOperationBusy()||document.getElementById('screen-match')?.classList.contains('active');}
function localDartsCareerKits(){
 if(!player?.name)return[];
 const config=normalizeDartCustomization({dartCustomization:player.dartCustomization}),slots=normalizeDartKitSlots({dartKitSlots:player.dartKitSlots});
 return[{key:'current',name:trLocal('current'),configuration:config,angle:getDartEntryAngleForPlayer(player)},...slots.flatMap((s,i)=>s?[{key:'slot'+i,name:trLocal('slot')+' '+(i+1)+(s.name?' · '+s.name:''),configuration:s.configuration,angle:s.configuration.dartEntryAngle}]:[])];
}
function localDartsNativeAppearance(candidate,isCareer=false){
 const native=candidate?getDartLoadoutSnapshot(candidate):{};
 return{...normalizeAiDartAppearance(native),dartEntryAngle:candidate?getDartEntryAngleForPlayer(candidate):20};
}
function selectLocalDartsPlayer(side,key){
 if(![0,1].includes(side)||localDartsView!=='setup')return false;
 const item=localDartsRoster.find(r=>r.key===key),candidate=item?.candidate||null,stats=candidate||{};
 localDartsDrafts[side]={key:item?.key||'guest',name:candidate?.name||trLocal('guest')+' '+(side+1),appearance:localDartsNativeAppearance(candidate,item?.career),kit:'profile',stats:{scoring:Number(stats.scoring)||65,doubles:Number(stats.doubles)||65,
  favoriteDouble:candidate?.favoriteDouble,favoriteDoubles:Array.isArray(candidate?.favoriteDoubles)?[...candidate.favoriteDoubles]:undefined,doubleTraining:candidate?.doubleTraining?JSON.parse(JSON.stringify(candidate.doubleTraining)):undefined}};
 renderLocalDarts();return true;
}
async function showLocalDarts(){
 if(localDartsOpening)return false;if(localDartsBlocked()){alert(trLocal('blocked'));return false;}
 localDartsReturn=player?.name?'screen-hub':'screen-create-player';localDartsOpening=true;
 try{if(typeof waitForPersistedModRestore==='function')await waitForPersistedModRestore();if(localDartsBlocked())return false;
  if(!localDartsDrafts||localDartsOwner!==player){
   localDartsOwner=player;const view=localDartsView;localDartsView='setup';
   localDartsRoster=[...(player?.name?[{key:'career',candidate:player,career:true}]:[]),...(Array.isArray(pdcPlayers)?pdcPlayers:[]).filter(p=>p?.name&&!p.isBye&&p.name!=='BYE').map((candidate,i)=>({key:'db'+i,candidate}))];
   localDartsDrafts=[null,null];selectLocalDartsPlayer(0,localDartsRoster[0]?.key);selectLocalDartsPlayer(1,localDartsRoster[1]?.key);localDartsView=view;
  }
  showScreen('screen-local-darts');renderLocalDarts();return true;
 }finally{localDartsOpening=false;}
}
function localDartsSetKit(side,key){
 const draft=localDartsDrafts[side];if(!draft||localDartsView!=='setup')return false;
 if(key==='profile'){const item=localDartsRoster.find(r=>r.key===draft.key);draft.appearance=localDartsNativeAppearance(item?.candidate,item?.career);}
 else{const kit=localDartsCareerKits().find(k=>k.key===key);if(!kit)return false;draft.appearance={...normalizeAiDartAppearance(getDartConfigurationLoadout(kit.configuration)),dartEntryAngle:kit.angle};}
 draft.kit=key;renderLocalDarts();return true;
}
function localDartsEdit(side,field,value){
 const draft=localDartsDrafts?.[side];if(!draft||localDartsView!=='setup')return false;const a=draft.appearance;
 if(field==='dartEntryAngle'){a.dartEntryAngle=Math.max(-10,Math.min(45,Number(value)||0));}
 else if(/^grip[0-8]$/.test(field)){
  if(!dartCustomizationCatalogue.barrelPattern.some(p=>p.id===value))return false;a.gripRegions=null;a.gripSections[Number(field.slice(4))]=value;
 }else{
  if(!Object.hasOwn(a,field))return false;
  if(field==='barrelLength')a.gripRegions=dartModel.rescaleGripRegions(a.gripRegions,a.barrelLength,Number(value));
  if(field==='barrelPattern'){a.gripRegions=null;a.gripSections=Array(9).fill(value);a.gripZones={front:value,middle:value,rear:value};}
  a[field]=value;const angle=a.dartEntryAngle;draft.appearance={...normalizeAiDartAppearance(a),dartEntryAngle:angle};
 }
 draft.kit='custom';renderLocalDarts();return true;
}
async function localDartsArtwork(side,file){
 const draft=localDartsDrafts?.[side];if(!draft||localDartsView!=='setup'||!file)return false;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){alert(trAiDartEditor('artworkError'));return false;}
 let url;localDartsPendingArt++;renderLocalDarts();
 try{url=URL.createObjectURL(file);const image=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
  if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth>8192||image.naturalHeight>8192)throw new Error('Image size');
  if(localDartsDrafts[side]!==draft||localDartsView!=='setup')return false;
  const canvas=await flightArtworkEditor.open(image,{shape:draft.appearance.flightShape,filename:file.name});if(!canvas||localDartsDrafts[side]!==draft||localDartsView!=='setup')return false;
  const artwork=canvas.toDataURL('image/png');if(!dartModel.validFlightArtwork(artwork))throw new Error('Invalid artwork');dartModel.registerFlightArtwork(artwork,canvas);draft.appearance.flightArtwork=artwork;draft.kit='custom';return true;
 }catch(_){alert(trAiDartEditor('artworkError'));return false;}finally{if(url)URL.revokeObjectURL(url);localDartsPendingArt--;renderLocalDarts();}
}
function localDartsEditor(side){
 const a=localDartsDrafts[side].appearance,esc=escapeHtml,index=Math.max(0,['pl','en','de','nl'].indexOf(currentLang));
 const control=field=>{
  const grip=/^grip[0-8]$/.test(field),value=grip?a.gripSections[Number(field.slice(4))]:a[field],label=grip?'Grip '+(Number(field.slice(4))+1):trAiDartEditor(field),attr=`data-local-side="${side}" data-local-field="${field}"`;
  let input;
  if(/Color$/.test(field))input=`<input type="color" ${attr} value="${esc(value)}">`;
  else if(['barrelLength','barrelDiameter','weightGrams','dartEntryAngle'].includes(field)){const bounds={barrelLength:[35,55,1],barrelDiameter:[5,9,.1],weightGrams:[12,40,1],dartEntryAngle:[-10,45,1]}[field];input=`<input type="number" ${attr} min="${bounds[0]}" max="${bounds[1]}" step="${bounds[2]}" value="${value??(field==='barrelDiameter'?dartModel.dimensions(a).barrelRadius*2:20)}">`;}
  else{const items=grip?dartCustomizationCatalogue.barrelPattern:dartCustomizationCatalogue[field];input=`<select ${attr}>${items.filter(p=>field!=='shaftLength'||dartModel.shaftLengths(a.flightSystem).includes(Number(p.id))).map(p=>`<option value="${esc(p.id)}" ${String(value)===p.id?'selected':''}>${esc(p.names[index])}</option>`).join('')}</select>`;}
  return`<label>${esc(label)}${input}</label>`;
 };
 return`<details class="local-kit-editor" data-local-editor="${side}"><summary>${esc(trLocal('customize'))}</summary>${AI_DART_EDITOR_GROUPS.map(g=>`<fieldset><legend>${esc(trAiDartEditor(g.title))}</legend><div class="lw-fields">${g.fields.map(control).join('')}</div>${g.title==='barrel'?dartGripEditor.markup('local-p'+(side+1),a):''}</fieldset>`).join('')}<div class="lw-fields">${control('dartEntryAngle')}<label>${esc(trAiDartEditor('artwork'))}<input type="file" data-local-art="${side}" accept="image/png,image/jpeg,image/webp" ${localDartsPendingArt?'disabled':''}></label></div><button type="button" data-local-remove-art="${side}" ${a.flightArtwork?'':'disabled'}>${esc(trAiDartEditor('removeArtwork'))}</button>${flightArtworkEditor.controlsMarkup(a.flightShape)}</details>`;
}
function startLocalDartsMatch(){
 if(localDartsView!=='setup'||localDartsBlocked()||localDartsPendingArt||!localDartsDrafts)return false;
 if(localDartsDrafts.some(d=>!d.name.trim()))return false;
 localDartsMatch=localDarts.create(localDartsDrafts.map(d=>({name:d.name.trim().slice(0,80),...d.stats,appearance:d.appearance})),localDartsSetup);if(!localDartsMatch)return false;
 localDartsAim=null;localDartsThrowUntil=0;localDartsView='match';renderLocalDarts();return true;
}
function newLocalDartsMatch(){if(localDartsPendingArt)return false;if(localDartsMatch&&!localDartsMatch.finished&&!confirm(trLocal('confirm')))return false;localDartsMatch=null;localDartsView='setup';renderLocalDarts();return true;}
function throwLocalDart(){
 const s=localDartsMatch;if(localDartsView!=='match'||!s||s.finished||s.closed||Date.now()<localDartsThrowUntil||localDartsBlocked()||!document.getElementById('screen-local-darts')?.classList.contains('active'))return false;
 const aim=localDartsAim||getCheckoutGuideFirstAim(s.scores[s.turn])||{sector:20,mult:3},visit=localDarts.visitFor(s),p=s.players[s.turn],result=calculateVisitThrow(aim.sector,aim.mult,p,visit,s.scores[s.turn],{dartStyle:p.appearance});
 const ok=localDarts.append(s,{aim,sector:result.sector,mult:result.mult,knockedOut:result.knockedOutDartIndices||[],point:result.boardPoint||null,pose:result.dartPose||null,bounceOut:result.bounceOut===true,robinHood:result.robinHood===true,attachedTo:result.robinHood?visit.physicsDarts.at(-1)?.attachedToVisitDartIndex:null});
 if(!ok)return false;localDartsAim=null;localDartsThrowUntil=Date.now()+220;renderLocalDarts();setTimeout(()=>{if(localDartsMatch===s)renderLocalDarts();},230);return true;
}
function renderLocalDarts(){
 const screen=document.getElementById('screen-local-darts');if(!screen?.classList.contains('active')||!localDartsDrafts||localDartsDrafts.some(d=>!d))return;
 const esc=escapeHtml,button=(id,key,disabled=false)=>`<button type="button" id="${id}" ${disabled?'disabled':''}>${esc(trLocal(key))}</button>`;
 // Keep an open component editor open while refreshing a preview.
 const open=[...screen.querySelectorAll('[data-local-editor][open]')].map(d=>d.dataset.localEditor);
 let html=`<h2>${esc(trLocal('title'))}</h2><p>${esc(trLocal('intro'))}</p>`;
 if(localDartsView==='setup'){
  const kits=localDartsCareerKits();html+=`<div class="local-participants">${localDartsDrafts.map((d,i)=>`<section class="local-participant" data-local-player="${i}"><h3>${esc(trLocal('player'))} ${i+1}</h3><label>${esc(trLocal('player'))}<select data-local-roster="${i}"><option value="guest" ${d.key==='guest'?'selected':''}>${esc(trLocal('guest'))}</option>${localDartsRoster.map(r=>`<option value="${r.key}" ${r.key===d.key?'selected':''}>${esc(r.candidate.name)}${r.career?' · '+esc(trLocal('current')):''}</option>`).join('')}</select></label><label>${esc(trLocal('name'))}<input type="text" maxlength="80" data-local-name="${i}" value="${esc(d.name)}"></label><label>${esc(trLocal('kit'))}<select data-local-kit="${i}"><option value="profile" ${d.kit==='profile'?'selected':''}>${esc(trLocal('profile'))}</option>${kits.map(k=>`<option value="${k.key}" ${d.kit===k.key?'selected':''}>${esc(k.name)}</option>`).join('')}${d.kit==='custom'?`<option value="custom" selected>${esc(trLocal('customize'))}</option>`:''}</select></label><div class="local-dart-preview">${dartCustomizationPreviewMarkup(d.appearance,'local-p'+(i+1))}</div><p>${d.appearance.barrelLength} mm · Ø ${dartModel.dimensions(d.appearance).barrelRadius.toFixed(2)*2} mm · ${d.appearance.weightGrams} g</p>${localDartsEditor(i)}</section>`).join('')}</div><p>${esc(trLocal('rules'))}</p><div class="lw-controls">${[['score',[301,501]],['legsToWin',[1,2,3,5,7]],['starter',[0,1]]].map(([field,values])=>`<label>${esc(trLocal(field==='legsToWin'?'legs':field))}<select data-local-option="${field}">${values.map(v=>`<option value="${v}" ${v===localDartsSetup[field]?'selected':''}>${field==='starter'?esc(localDartsDrafts[v].name):v}</option>`).join('')}</select></label>`).join('')}</div>${localDartsPendingArt?`<p role="status">${esc(trLocal('loading'))}</p>`:''}${button('local-start','start',!!localDartsPendingArt||localDartsDrafts.some(d=>!d.name.trim()))}`;
 }else{
  const s=localDartsMatch,p=s.players[s.turn],aim=localDartsAim||getCheckoutGuideFirstAim(s.scores[s.turn])||{sector:20,mult:3},next=s.legWon?(s.starter+s.totalLegs)%2:1-s.turn;
  html+=`<div class="local-scorecards">${s.players.map((p,i)=>`<section class="local-scorecard ${s.turn===i&&!s.finished?'is-active':''}"><h3>${esc(trLocal('player'))} ${i+1} · ${esc(p.name)}</h3><strong>${s.scores[i]}</strong><p>${esc(trLocal('legs'))}: ${s.legs[i]} / ${s.legsToWin}</p><p>${esc(trLocal('average'))}: ${localDarts.average(s,i).toFixed(2)} · ${esc(trLocal('darts'))}: ${s.stats[i].darts}</p><p>180: ${s.stats[i].maximums} · ${esc(trLocal('checkout'))}: ${s.stats[i].bestCheckout}</p></section>`).join('')}</div><h3 class="local-turn" role="status">${esc(s.finished?trLocal('winner')+' · '+s.players[s.winner].name:s.legWon?trLocal('legWon')+' · '+p.name:trLocal('turn')+' · '+p.name)}</h3><div class="local-play-layout"><div><canvas id="local-dartboard" width="340" height="340" aria-label="${esc(trLocal('aim'))}"></canvas><div class="local-shots">${s.shots.map(d=>`<span class="${d.fallen?'local-fallen':''}">${esc(d.fallen?trLocal('fallen'):d.bounceOut?'Bounce-out':d.robinHood?'Robin Hood':d.sector?(d.sector===25?(d.mult===2?'Bull':'25'):(d.mult===3?'T':d.mult===2?'D':'')+d.sector):trLocal('miss'))}</span>`).join('')}</div></div><div><div class="local-dart-preview">${dartCustomizationPreviewMarkup(p.appearance,'local-match')}</div>${s.bust?`<p>${esc(trLocal('bust'))}</p>`:''}${s.finished?'':s.closed?`<p>${esc(trLocal('next'))}: <strong>${esc(s.players[next].name)}</strong></p>${button('local-next',s.legWon?'nextLeg':'next')}`:`<div class="lw-controls"><label>${esc(trLocal('aim'))}<select id="local-aim-sector">${[...Array.from({length:20},(_,i)=>i+1),25,50].map(n=>`<option value="${n}" ${n===(aim.sector===25&&aim.mult===2?50:aim.sector)?'selected':''}>${n===50?'Bull':n}</option>`).join('')}</select></label><label>S / D / T<select id="local-aim-mult" ${aim.sector===25?'disabled':''}>${[1,2,3].map(m=>`<option value="${m}" ${m===aim.mult?'selected':''}>${['S','D','T'][m-1]}</option>`).join('')}</select></label></div>${typeof checkoutGuide==='object'&&checkoutGuide[s.scores[s.turn]]?`<p>${esc(checkoutGuide[s.scores[s.turn]])}</p>`:''}${button('local-throw','throw',Date.now()<localDartsThrowUntil)}`}</div></div>${button('local-new','setup')}`;
 }
 html+=button('local-back','back');screen.innerHTML=html;
 screen.querySelectorAll('[data-local-editor]').forEach(d=>d.open=open.includes(d.dataset.localEditor));
 screen.querySelectorAll('[data-local-roster]').forEach(n=>n.onchange=()=>selectLocalDartsPlayer(Number(n.dataset.localRoster),n.value));screen.querySelectorAll('[data-local-name]').forEach(n=>n.oninput=()=>{localDartsDrafts[Number(n.dataset.localName)].name=n.value;const starter=screen.querySelector('[data-local-option="starter"]');if(starter)starter.options[Number(n.dataset.localName)].textContent=n.value;document.getElementById('local-start').disabled=!!localDartsPendingArt||localDartsDrafts.some(d=>!d.name.trim());});
 screen.querySelectorAll('[data-local-kit]').forEach(n=>n.onchange=()=>localDartsSetKit(Number(n.dataset.localKit),n.value));screen.querySelectorAll('[data-local-option]').forEach(n=>n.onchange=()=>{localDartsSetup[n.dataset.localOption]=Number(n.value);});screen.querySelectorAll('[data-local-field]').forEach(n=>n.onchange=()=>{if(!n.checkValidity()||n.value.trim()===''){renderLocalDarts();return;}localDartsEdit(Number(n.dataset.localSide),n.dataset.localField,n.type==='number'?Number(n.value):n.value);});screen.querySelectorAll('[data-local-art]').forEach(n=>n.onchange=()=>localDartsArtwork(Number(n.dataset.localArt),n.files[0]));screen.querySelectorAll('[data-local-remove-art]').forEach(n=>n.onclick=()=>localDartsEdit(Number(n.dataset.localRemoveArt),'flightArtwork',null));
 document.getElementById('local-start')?.addEventListener('click',startLocalDartsMatch);document.getElementById('local-new')?.addEventListener('click',newLocalDartsMatch);document.getElementById('local-throw')?.addEventListener('click',throwLocalDart);document.getElementById('local-next')?.addEventListener('click',()=>{if(localDarts.next(localDartsMatch)){localDartsAim=null;localDartsThrowUntil=0;renderLocalDarts();}});document.getElementById('local-back').onclick=()=>showScreen(player?.name?localDartsReturn:'screen-create-player');
 const setAim=()=>{const sector=Number(document.getElementById('local-aim-sector').value),mult=Number(document.getElementById('local-aim-mult').value);localDartsAim={sector:sector===50?25:sector,mult:sector===50?2:sector===25?1:mult};renderLocalDarts();};document.getElementById('local-aim-sector')?.addEventListener('change',setAim);document.getElementById('local-aim-mult')?.addEventListener('change',setAim);
 if(localDartsView==='match')renderDartboard2D(document.getElementById('local-dartboard'),localDarts.visitFor(localDartsMatch).physicsDarts);
}
for(const side of [0,1])dartGripEditor.register('local-p'+(side+1),()=>localDartsView==='setup'?localDartsDrafts?.[side]?.appearance:null,regions=>{const a=localDartsDrafts?.[side]?.appearance;if(localDartsView!=='setup'||!a||!dartModel.validGripRegions(regions,a.barrelLength))return false;a.gripRegions=regions;localDartsDrafts[side].kit='custom';renderLocalDarts();return true;});
function refreshLocalDartsTranslations(){document.querySelectorAll('[data-local-label]').forEach(n=>n.textContent=trLocal(n.dataset.localLabel));renderLocalDarts();}
if(typeof document!=='undefined')refreshLocalDartsTranslations();
