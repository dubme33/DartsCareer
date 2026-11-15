/* Shared image fitting and printable flight guides for the career and AI editors. */
(function (root) {
    'use strict';
    const copy = {
        pl: { title:'Dopasuj grafikę piórka', hint:'Podgląd pokazuje obie strony złożonego piórka. Przesuń obraz tak, aby ważne elementy mieściły się w obrysie.',
            fit:'Dopasowanie', contain:'Cały obraz', cover:'Wypełnij', template:'Gotowy szablon', zoom:'Powiększenie', horizontal:'Poziomo', vertical:'Pionowo', rotate:'Obróć o 90°',
            apply:'Zastosuj grafikę', cancel:'Anuluj', png:'Szablon PNG', svg:'Szablon SVG', guides:'Pokaż obrys',
            templateTitle:'Szablon grafiki piórka',
            templateHint:'To szablon jednego skrzydełka lotki. Białe pole jest miejscem na Twój wzór, a turkusowa linia pokazuje jego kształt. To nie jest element rozgrywki.',
            templateHelp:'Jak użyć szablonu?',
            templateSteps:['Pobierz PNG lub SVG i otwórz w edytorze graficznym. Umieść swój wzór w białym polu.', 'Usuń turkusowy obrys (w SVG: grupa „guides”). Zapisz PNG w rozmiarze 512 × 512 px, bez kadrowania.', 'Wczytaj PNG jako grafikę piórka, wybierz „Gotowy szablon” i sprawdź podgląd przed zastosowaniem.'],
            templateNote:'Kwadratowy plik jest nakładany na model piórka; podgląd w grze pokazuje jego proporcje. Podpis poza obrysem jest wycinany przy imporcie.',
            templateLabels:['SZABLON PIÓRKA', '1 skrzydełko · 512 × 512 px', 'Grafika w białym polu', 'Usuń turkusowy obrys'] },
        en: { title:'Fit flight artwork', hint:'The preview shows both sides of the folded flight. Move the image to keep important details inside the outline.',
            fit:'Fit', contain:'Whole image', cover:'Fill', template:'Prepared template', zoom:'Zoom', horizontal:'Horizontal', vertical:'Vertical', rotate:'Rotate 90°',
            apply:'Apply artwork', cancel:'Cancel', png:'PNG template', svg:'SVG template', guides:'Show outline',
            templateTitle:'Flight artwork template',
            templateHint:'This is a template for one wing of a dart flight. The white area is for your design; the teal line marks its shape. This is not part of a match.',
            templateHelp:'How do I use the template?',
            templateSteps:['Download PNG or SVG and open it in an image editor. Place your design in the white area.', 'Remove the teal outline (the “guides” group in SVG). Save as a 512 × 512 px PNG without cropping.', 'Import the PNG as flight artwork, select “Prepared template” and check the preview before applying.'],
            templateNote:'The square file is mapped onto the flight model; the game preview shows its proportions. The caption outside the outline is clipped away on import.',
            templateLabels:['FLIGHT TEMPLATE', '1 wing · 512 × 512 px', 'Design in the white area', 'Remove the teal outline'] },
        de: { title:'Flight-Motiv anpassen', hint:'Die Vorschau zeigt beide Seiten des gefalteten Flights. Verschiebe das Bild, bis wichtige Details im Umriss liegen.',
            fit:'Anpassung', contain:'Ganzes Bild', cover:'Ausfüllen', template:'Fertige Vorlage', zoom:'Vergrößerung', horizontal:'Horizontal', vertical:'Vertikal', rotate:'Um 90° drehen',
            apply:'Motiv übernehmen', cancel:'Abbrechen', png:'PNG-Vorlage', svg:'SVG-Vorlage', guides:'Umriss zeigen',
            templateTitle:'Vorlage für ein Flight-Motiv',
            templateHint:'Dies ist eine Vorlage für einen Flügel des Dart-Flights. Die weiße Fläche ist für dein Motiv; die türkise Linie zeigt die Form. Dies ist kein Teil eines Spiels.',
            templateHelp:'Wie benutze ich die Vorlage?',
            templateSteps:['PNG oder SVG herunterladen und in einem Bildeditor öffnen. Das Motiv in die weiße Fläche setzen.', 'Die türkise Kontur entfernen (SVG-Gruppe „guides“). Ohne Zuschneiden als PNG mit 512 × 512 px speichern.', 'Das PNG als Flight-Motiv laden, „Fertige Vorlage“ wählen und die Vorschau vor dem Übernehmen prüfen.'],
            templateNote:'Die quadratische Datei wird auf das Flight-Modell gelegt; die Vorschau zeigt seine Proportionen. Die Beschriftung außerhalb der Kontur wird beim Import abgeschnitten.',
            templateLabels:['FLIGHT-VORLAGE', '1 Flügel · 512 × 512 px', 'Motiv in die weiße Fläche', 'Türkise Kontur entfernen'] },
        nl: { title:'Flightafbeelding passend maken', hint:'Het voorbeeld toont beide zijden van de gevouwen flight. Verplaats de afbeelding zodat belangrijke details binnen de omtrek vallen.',
            fit:'Aanpassing', contain:'Hele afbeelding', cover:'Opvullen', template:'Klaar sjabloon', zoom:'Vergroting', horizontal:'Horizontaal', vertical:'Verticaal', rotate:'90° draaien',
            apply:'Afbeelding toepassen', cancel:'Annuleren', png:'PNG-sjabloon', svg:'SVG-sjabloon', guides:'Omtrek tonen',
            templateTitle:'Sjabloon voor flightafbeeldingen',
            templateHint:'Dit is een sjabloon voor één vleugel van een dartflight. Het witte vlak is voor je ontwerp; de groene lijn geeft de vorm aan. Dit is geen onderdeel van een wedstrijd.',
            templateHelp:'Hoe gebruik ik het sjabloon?',
            templateSteps:['Download PNG of SVG en open het in een afbeeldingseditor. Plaats je ontwerp in het witte vlak.', 'Verwijder de groene omtrek (de SVG-groep “guides”). Sla op als PNG van 512 × 512 px zonder bijsnijden.', 'Importeer de PNG als flightafbeelding, kies “Klaar sjabloon” en controleer het voorbeeld voordat je toepast.'],
            templateNote:'Het vierkante bestand wordt op het flightmodel geplaatst; het voorbeeld toont de verhoudingen. Het bijschrift buiten de omtrek wordt bij het importeren weggesneden.',
            templateLabels:['FLIGHT-SJABLOON', '1 vleugel · 512 × 512 px', 'Ontwerp in het witte vlak', 'Verwijder de groene lijn'] }
    };
    const text = () => copy[typeof currentLang === 'string' ? currentLang : 'en'] || copy.en;
    let active = null;
    const points = shape => root.dartModel.outlines[shape] || root.dartModel.outlines.standard;
    function trace(ctx, shape, size) {
        ctx.beginPath();
        points(shape).forEach(([x,y], i) => ctx[i ? 'lineTo' : 'moveTo'](x / 17.5 * size, (1-y/42)*size));
        ctx.closePath();
    }
    function layout(width, height, shape, options = {}) {
        const rotation = ((Number(options.rotation) || 0) % 360 + 360) % 360;
        const turned = rotation % 180 !== 0;
        const w = Math.max(1, turned ? height : width), h = Math.max(1, turned ? width : height);
        const maxX = Math.min(17.5, Math.max(...points(shape).map(p=>p[0])));
        const maxY = Math.max(...points(shape).map(p=>p[1]));
        const factor = (options.fit === 'cover' ? Math.max(maxX / w, maxY / h) : Math.min(maxX / w, maxY / h))
            * Math.max(.25, Math.min(3, (Number(options.zoom) || 100) / 100));
        return { width:width*factor, height:height*factor, rotation,
            x:maxX/2 + Math.max(-100,Math.min(100,Number(options.x)||0))*maxX/100,
            y:42-maxY/2 + Math.max(-100,Math.min(100,Number(options.y)||0))*maxY/100 };
    }
    function render(image, shape, options = {}, size = 256) {
        const canvas = document.createElement('canvas');canvas.width=canvas.height=size;
        const ctx=canvas.getContext('2d');
        ctx.save();trace(ctx,shape,size);ctx.clip();
        if(options.fit==='template') {
            ctx.drawImage(image,0,0,size,size);
        } else {
            const box=layout(image.naturalWidth||image.width,image.naturalHeight||image.height,shape,options);
            // Work in physical flight dimensions so photos keep their proportions
            // after the model maps this square texture onto a folded wing.
            ctx.scale(size/17.5,size/42);ctx.translate(box.x,box.y);ctx.rotate(box.rotation*Math.PI/180);
            ctx.drawImage(image,-box.width/2,-box.height/2,box.width,box.height);
        }
        ctx.restore();return canvas;
    }
    function templateSvg(shape) {
        if(!Object.hasOwn(root.dartModel.outlines,shape))shape='standard';
        const t=text(),escape=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
        const path=points(shape).map(([x,y],i)=>`${i?'L':'M'}${(x/17.5*512).toFixed(2)} ${((1-y/42)*512).toFixed(2)}`).join(' ')+' Z';
        // Keep captions strictly outside the texture footprint: template imports
        // use the same wing path to clip them, without changing the 512px UV map.
        const labels=t.templateLabels.map((label,i)=>`<text x="336" y="${456+i*14}"${i===0?' font-weight="bold"':''}>${escape(label)}</text>`).join('');
        return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>DartsCareer — ${escape(t.templateTitle)} (${shape})</title><desc>${escape([t.templateHint,...t.templateSteps,t.templateNote].join(' '))}</desc><defs><clipPath id="wing"><path d="${path}"/></clipPath><mask id="outside-wing" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><rect width="512" height="512" fill="white"/><path d="${path}" fill="black"/></mask></defs><g id="artwork" clip-path="url(#wing)"><rect width="512" height="512" fill="white"/></g><g id="guides" fill="none" stroke="#279b8d" stroke-width="3"><path d="${path}"/></g><g id="instructions" mask="url(#outside-wing)"><rect x="328" y="442" width="180" height="64" rx="4" fill="#eaf7f5"/><g fill="#24514a" font-family="Arial, sans-serif" font-size="12">${labels}</g></g></svg>`;
    }
    function saveBlob(blob, name) {
        const url=URL.createObjectURL(blob),link=document.createElement('a');
        link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),3000);
    }
    async function downloadTemplate(shape='standard', format='png') {
        if(!Object.hasOwn(root.dartModel.outlines,shape))shape='standard';
        const svg=templateSvg(shape),name=`darts-career-flight-template-${shape}`;
        if(format==='svg'){saveBlob(new Blob([svg],{type:'image/svg+xml'}),name+'.svg');return true;}
        const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
        try {
            const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
            const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
            canvas.getContext('2d').drawImage(img,0,0);
            const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
            if(!blob)throw Error('Template could not be created');saveBlob(blob,name+'.png');return true;
        } finally {URL.revokeObjectURL(url);}
    }
    function controlsMarkup(shape) {
        const t=text(),safe=Object.hasOwn(root.dartModel.outlines,shape)?shape:'standard';
        return `<div class="flight-template-tools"><strong class="flight-template-title">${t.templateTitle}</strong><small>${t.templateHint}</small><button type="button" onclick="flightArtworkEditor.downloadTemplate('${safe}','png')">${t.png}</button><button type="button" onclick="flightArtworkEditor.downloadTemplate('${safe}','svg')">${t.svg}</button><details class="flight-template-help"><summary>${t.templateHelp}</summary><ol>${t.templateSteps.map(step=>`<li>${step}</li>`).join('')}</ol><p>${t.templateNote}</p></details></div>`;
    }
    function open(image,{shape='standard',filename=''}={}) {
        active?.finish(null);
        const t=text(),dialog=document.createElement('dialog');dialog.className='flight-artwork-dialog';
        dialog.setAttribute('aria-labelledby','flight-artwork-title');
        dialog.innerHTML=`<h3 id="flight-artwork-title">${t.title}</h3><p>${t.hint}</p><div class="flight-artwork-layout"><canvas width="360" height="360" aria-label="${t.title}"></canvas><div class="flight-artwork-controls"><label>${t.fit}<select data-art-option="fit"><option value="contain">${t.contain}</option><option value="cover">${t.cover}</option><option value="template">${t.template}</option></select></label>${[['zoom',25,300,100,t.zoom],['x',-100,100,0,t.horizontal],['y',-100,100,0,t.vertical]].map(([key,min,max,value,label])=>`<label>${label} <output data-art-output="${key}">${value}</output><input type="range" data-art-option="${key}" min="${min}" max="${max}" value="${value}"></label>`).join('')}<button type="button" data-art-rotate>${t.rotate}</button><label class="flight-artwork-guide"><input type="checkbox" data-art-guides checked>${t.guides}</label></div></div>${controlsMarkup(shape)}<div class="flight-artwork-footer"><button type="button" data-art-cancel>${t.cancel}</button><button type="button" data-art-apply>${t.apply}</button></div>`;
        document.body.appendChild(dialog);
        const options={fit:/flight-template/i.test(filename)?'template':'contain',zoom:100,x:0,y:0,rotation:0};
        dialog.querySelector('[data-art-option="fit"]').value=options.fit;
        for(const range of dialog.querySelectorAll('input[data-art-option]'))range.disabled=options.fit==='template';
        const preview=dialog.querySelector('canvas'),ctx=preview.getContext('2d');
        const redraw=()=>{
            const imageCanvas=render(image,shape,options,256);
            ctx.clearRect(0,0,360,360);ctx.fillStyle='#132a45';ctx.fillRect(0,0,360,360);
            // Show the same texture mirrored about the central fold.
            for(const side of [-1,1]){
                ctx.save();ctx.translate(180,22);ctx.scale(side,1);
                ctx.drawImage(imageCanvas,0,0,132,316);
                if(dialog.querySelector('[data-art-guides]').checked){ctx.scale(132/256,316/256);trace(ctx,shape,256);ctx.strokeStyle='#7ce6cb';ctx.lineWidth=2;ctx.stroke();}
                ctx.restore();
            }
        };
        dialog.querySelectorAll('[data-art-option]').forEach(control=>control.addEventListener('input',()=>{
            const key=control.dataset.artOption;options[key]=key==='fit'?control.value:Number(control.value);
            const output=dialog.querySelector(`[data-art-output="${key}"]`);if(output)output.textContent=control.value;
            for(const range of dialog.querySelectorAll('input[data-art-option]'))range.disabled=options.fit==='template';
            redraw();
        }));
        dialog.querySelector('[data-art-rotate]').addEventListener('click',()=>{if(options.fit!=='template'){options.rotation=(options.rotation+90)%360;redraw();}});
        dialog.querySelector('[data-art-guides]').addEventListener('change',redraw);
        return new Promise(resolve=>{
            let settled=false;
            const finish=value=>{if(settled)return;settled=true;if(active?.dialog===dialog)active=null;dialog.close?.();dialog.remove();resolve(value);};
            active={dialog,finish};
            dialog.querySelector('[data-art-cancel]').addEventListener('click',()=>finish(null));
            dialog.addEventListener('cancel',event=>{event.preventDefault();finish(null);});
            dialog.querySelector('[data-art-apply]').addEventListener('click',()=>finish(render(image,shape,options)));
            redraw();if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
        });
    }
    root.flightArtworkEditor=Object.freeze({open,render,layout,templateSvg,downloadTemplate,controlsMarkup,
        cancel:()=>active?.finish(null)});
})(typeof window!=='undefined'?window:globalThis);
