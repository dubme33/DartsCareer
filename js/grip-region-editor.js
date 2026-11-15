/* Shared millimetre controls for career and AI grip regions. */
(function(root){
    'use strict';
    const copy={
        pl:{enable:'Swobodne strefy gripu',back:'Przywróć 9 sekcji',add:'Dodaj strefę',clear:'Wyczyść strefy',
            intro:'Ustaw własne granice i nakładaj wzory na ten sam odcinek barrela.',
            hint:'Poza strefami barrel jest gładki. Nakładające się strefy łączą nacięcia. Odległości liczymy od początku barrela przy grocie. Przy zmianie długości strefy skalują się proporcjonalnie.',
            region:'Strefa',pattern:'Wzór',start:'Początek',end:'Koniec',duplicate:'Duplikuj',remove:'Usuń',
            empty:'Brak stref — barrel jest gładki.',bounds:'Dostępny odcinek: {start}–{end} mm.',limit:'Maksymalnie {count} stref.',
            legacy:'Przywrócenie poprzednich dziewięciu sekcji zastępuje swobodne strefy.'},
        en:{enable:'Free grip regions',back:'Restore 9 sections',add:'Add region',clear:'Clear regions',
            intro:'Set custom boundaries and overlap patterns on the same part of the barrel.',
            hint:'Areas outside regions are smooth. Overlaps combine the cuts. Distances start at the point end of the barrel. Regions scale proportionally when barrel length changes.',
            region:'Region',pattern:'Pattern',start:'Start',end:'End',duplicate:'Duplicate',remove:'Remove',
            empty:'No regions — the barrel is smooth.',bounds:'Available span: {start}–{end} mm.',limit:'Up to {count} regions.',
            legacy:'Restoring your previous nine sections replaces the free regions.'},
        de:{enable:'Freie Grip-Zonen',back:'9 Abschnitte wiederherstellen',add:'Zone hinzufügen',clear:'Zonen leeren',
            intro:'Lege eigene Grenzen fest und überlagere Muster auf demselben Barrel-Abschnitt.',
            hint:'Außerhalb der Zonen bleibt das Barrel glatt. Überlappungen verbinden die Schnitte. Abstände beginnen am spitzenseitigen Barrel-Ende. Bei einer Längenänderung skalieren die Zonen proportional.',
            region:'Zone',pattern:'Muster',start:'Anfang',end:'Ende',duplicate:'Duplizieren',remove:'Entfernen',
            empty:'Keine Zonen — das Barrel ist glatt.',bounds:'Verfügbarer Bereich: {start}–{end} mm.',limit:'Bis zu {count} Zonen.',
            legacy:'Das Wiederherstellen deiner bisherigen neun Abschnitte ersetzt die freien Zonen.'},
        nl:{enable:'Vrije gripzones',back:'9 delen herstellen',add:'Zone toevoegen',clear:'Zones wissen',
            intro:'Stel eigen grenzen in en laat patronen op hetzelfde deel van de barrel overlappen.',
            hint:'Buiten de zones blijft de barrel glad. Overlap combineert de inkepingen. Afstanden beginnen aan de puntzijde van de barrel. Bij een andere lengte schalen de zones evenredig mee.',
            region:'Zone',pattern:'Patroon',start:'Begin',end:'Einde',duplicate:'Dupliceren',remove:'Verwijderen',
            empty:'Geen zones — de barrel is glad.',bounds:'Beschikbaar bereik: {start}–{end} mm.',limit:'Maximaal {count} zones.',
            legacy:'Het herstellen van je eerdere negen delen vervangt de vrije zones.'}
    };
    const lang=()=>typeof currentLang==='string'&&Object.hasOwn(copy,currentLang)?currentLang:'en';
    const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const number=value=>Number(value).toFixed(1);
    const adapters=new Map();
    function register(scope,get,set){if(!/^local-p[12]$/.test(scope)||typeof get!=='function'||typeof set!=='function')return false;adapters.set(scope,{get,set});return true;}
    function snapshot(scope){
        if(adapters.has(scope))return{a:adapters.get(scope).get(),owned:null};
        if(scope==='career'&&typeof player!=='undefined'&&player){const s=root.normalizeDartCustomization(player);return{a:s.selected,owned:s.owned.barrelPattern};}
        if(scope==='ai'&&typeof root.getAiDartGripEditorState==='function')return{a:root.getAiDartGripEditorState(),owned:null};
        return null;
    }
    function markup(scope,a,owned=null){
        if(!a||!(['career','ai'].includes(scope)||adapters.has(scope)))return '';
        const t=copy[lang()],active=Array.isArray(a.gripRegions),regions=a.gripRegions||[],length=Number(a.barrelLength)||50;
        const button=(action,text,extra='')=>`<button type="button" data-grip-action="${action}" onclick="dartGripEditor.action('${scope}','${action}')" ${extra}>${esc(text)}</button>`;
        if(!active)return `<div class="grip-region-editor" data-grip-editor="${scope}"><p>${esc(t.intro)}</p>${button('enable',t.enable)}</div>`;
        const index={pl:0,en:1,de:2,nl:3}[lang()];
        const items=root.dartCustomizationCatalogue.barrelPattern.filter(item=>item.id!=='smooth');
        return `<div class="grip-region-editor is-active" data-grip-editor="${scope}"><div class="grip-region-toolbar">${button('add',t.add,regions.length>=root.dartModel.maxGripRegions?'disabled':'')}${button('clear',t.clear,!regions.length?'disabled':'')}${button('back',t.back)}</div>
            <p>${esc(t.hint)}</p><p class="grip-region-limits">${esc(t.bounds.replace('{start}',5).replace('{end}',length-4))} ${esc(t.limit.replace('{count}',root.dartModel.maxGripRegions))}</p>
            ${!regions.length?`<p>${esc(t.empty)}</p>`:''}<div class="grip-region-list">${regions.map((region,i)=>{
                const hue=(i*47+172)%360;
                return `<article class="grip-region-row" data-grip-region="${i}" data-length="${length}" style="--region-color:hsl(${hue} 60% 67%)"><header><strong>${esc(t.region)} ${i+1}</strong><div><button type="button" data-grip-duplicate onclick="dartGripEditor.action('${scope}','duplicate',${i})" ${regions.length>=root.dartModel.maxGripRegions?'disabled':''}>${esc(t.duplicate)}</button><button type="button" data-grip-remove onclick="dartGripEditor.action('${scope}','remove',${i})">${esc(t.remove)}</button></div></header>
                    <label class="grip-region-pattern">${esc(t.pattern)}<select data-grip-pattern onchange="dartGripEditor.action('${scope}','pattern',${i},this.value)">${items.map(item=>`<option value="${item.id}" ${item.id===region.pattern?'selected':''}>${esc(item.names[index])}${owned&&!owned.includes(item.id)?` · £${item.price}`:''}</option>`).join('')}</select></label>
                    <div class="grip-region-track" aria-hidden="true"><span data-grip-band style="left:${region.start/length*100}%;width:${(region.end-region.start)/length*100}%"></span></div>
                    <div class="grip-region-bounds">${['start','end'].map(bound=>`<label>${esc(t[bound])}<span><input type="number" data-grip-bound="${bound}" data-grip-number min="5" max="${length-4}" step="0.1" value="${number(region[bound])}" aria-label="${esc(t.region)} ${i+1}: ${esc(t[bound])} (mm)" onchange="dartGripEditor.commit('${scope}',${i},this)"/> mm</span><input type="range" data-grip-bound="${bound}" data-grip-slider min="5" max="${length-4}" step="0.1" value="${number(region[bound])}" aria-label="${esc(t.region)} ${i+1}: ${esc(t[bound])} (mm)" oninput="dartGripEditor.preview(this)" onchange="dartGripEditor.commit('${scope}',${i},this)"/></label>`).join('')}</div>
                </article>`;
            }).join('')}</div><small>${esc(t.legacy)}</small></div>`;
    }
    function restore(scope){
        const s=snapshot(scope);if(!s?.a)return;
        const host=document.querySelector(`[data-grip-editor="${scope}"]`);
        if(host)host.outerHTML=markup(scope,s.a,s.owned);
    }
    function action(scope,action,index,value){
        const s=snapshot(scope);if(!s?.a)return false;
        let regions=s.a.gripRegions?.map(r=>({...r}))??null;
        if(action==='enable')regions=root.dartModel.legacyGripRegions(s.a);
        else if(action==='back')regions=null;
        else if(action==='clear')regions=[];
        else{
            if(!Array.isArray(regions))return false;
            if(action==='add')regions.push({start:5,end:s.a.barrelLength-4,pattern:'rings'});
            else{
                if(!Number.isInteger(index)||!regions[index])return false;
                if(action==='remove')regions.splice(index,1);
                else if(action==='duplicate')regions.push({...regions[index]});
                else if(['pattern','start','end'].includes(action))regions[index][action]=value;
                else return false;
            }
        }
        const ok=adapters.has(scope)?adapters.get(scope).set(regions):scope==='career'?root.setDartGripRegions(regions):root.changeAiDartGripRegions(regions);
        if(!ok)restore(scope);return ok;
    }
    function preview(control){
        const row=control.closest('[data-grip-region]');if(!row)return false;
        const bound=control.dataset.gripBound,other=bound==='start'?'end':'start';
        const original=control.value;if(original.trim()===''||!Number.isFinite(Number(original)))return false;
        const otherValue=Number(row.querySelector(`[data-grip-number][data-grip-bound="${other}"]`).value);
        let value=Number(original);value=bound==='start'?Math.min(value,otherValue-.1):Math.max(value,otherValue+.1);
        value=Math.max(5,Math.min(Number(row.dataset.length)-4,value));
        row.querySelectorAll(`[data-grip-bound="${bound}"]`).forEach(input=>{input.value=number(value);});
        const start=Number(row.querySelector('[data-grip-number][data-grip-bound="start"]').value),end=Number(row.querySelector('[data-grip-number][data-grip-bound="end"]').value);
        const band=row.querySelector('[data-grip-band]');band.style.left=start/Number(row.dataset.length)*100+'%';band.style.width=(end-start)/Number(row.dataset.length)*100+'%';
        return true;
    }
    function commit(scope,index,control){
        if(!preview(control)){restore(scope);return false;}
        return action(scope,control.dataset.gripBound,index,Number(control.value));
    }
    root.dartGripEditor=Object.freeze({markup,action,preview,commit,register});
})(window);
