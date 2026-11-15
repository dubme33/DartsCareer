/* Shared image fitting and printable flight guides for the career and AI editors. */
(function (root) {
    'use strict';
    const copy = {
        pl: { title:'Dopasuj grafikę piórka', hint:'Podgląd pokazuje obie strony złożonego piórka. Przesuń obraz tak, aby ważne elementy mieściły się w obrysie.',
            fit:'Dopasowanie', contain:'Cały obraz', cover:'Wypełnij', template:'Gotowy szablon', zoom:'Powiększenie', horizontal:'Poziomo', vertical:'Pionowo', rotate:'Obróć o 90°',
            apply:'Zastosuj grafikę', cancel:'Anuluj', png:'Szablon PNG', svg:'Szablon SVG', guides:'Pokaż obrys',
            templateHint:'Szablon przedstawia jedno skrzydełko. Umieść grafikę w obrysie, usuń prowadnice i zapisz PNG. Przy wczytywaniu wybierz „Gotowy szablon”.' },
        en: { title:'Fit flight artwork', hint:'The preview shows both sides of the folded flight. Move the image to keep important details inside the outline.',
            fit:'Fit', contain:'Whole image', cover:'Fill', template:'Prepared template', zoom:'Zoom', horizontal:'Horizontal', vertical:'Vertical', rotate:'Rotate 90°',
            apply:'Apply artwork', cancel:'Cancel', png:'PNG template', svg:'SVG template', guides:'Show outline',
            templateHint:'The template shows one wing. Place artwork inside the outline, remove guides and save as PNG. Select “Prepared template” when importing.' },
        de: { title:'Flight-Motiv anpassen', hint:'Die Vorschau zeigt beide Seiten des gefalteten Flights. Verschiebe das Bild, bis wichtige Details im Umriss liegen.',
            fit:'Anpassung', contain:'Ganzes Bild', cover:'Ausfüllen', template:'Fertige Vorlage', zoom:'Vergrößerung', horizontal:'Horizontal', vertical:'Vertikal', rotate:'Um 90° drehen',
            apply:'Motiv übernehmen', cancel:'Abbrechen', png:'PNG-Vorlage', svg:'SVG-Vorlage', guides:'Umriss zeigen',
            templateHint:'Die Vorlage zeigt einen Flügel. Motiv im Umriss platzieren, Hilfslinien entfernen und als PNG speichern. Beim Laden „Fertige Vorlage“ wählen.' },
        nl: { title:'Flightafbeelding passend maken', hint:'Het voorbeeld toont beide zijden van de gevouwen flight. Verplaats de afbeelding zodat belangrijke details binnen de omtrek vallen.',
            fit:'Aanpassing', contain:'Hele afbeelding', cover:'Opvullen', template:'Klaar sjabloon', zoom:'Vergroting', horizontal:'Horizontaal', vertical:'Verticaal', rotate:'90° draaien',
            apply:'Afbeelding toepassen', cancel:'Annuleren', png:'PNG-sjabloon', svg:'SVG-sjabloon', guides:'Omtrek tonen',
            templateHint:'Het sjabloon toont één vleugel. Plaats de afbeelding binnen de omtrek, verwijder hulplijnen en sla op als PNG. Kies “Klaar sjabloon” bij het laden.' }
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
        const path=points(shape).map(([x,y],i)=>`${i?'L':'M'}${(x/17.5*512).toFixed(2)} ${((1-y/42)*512).toFixed(2)}`).join(' ')+' Z';
        return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>DartsCareer ${shape} flight template</title><defs><clipPath id="wing"><path d="${path}"/></clipPath></defs><g id="artwork" clip-path="url(#wing)"><rect width="512" height="512" fill="white"/></g><g id="guides" fill="none" stroke="#279b8d" stroke-width="3"><path d="${path}"/><path d="M32 180H300V380H32Z" stroke-dasharray="8 6"/></g></svg>`;
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
        return `<div class="flight-template-tools"><button type="button" onclick="flightArtworkEditor.downloadTemplate('${safe}','png')">${t.png}</button><button type="button" onclick="flightArtworkEditor.downloadTemplate('${safe}','svg')">${t.svg}</button><small>${t.templateHint}</small></div>`;
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
