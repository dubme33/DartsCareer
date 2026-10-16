// UI for the existing, saved qualification-decline operation. The sport state
// and replacement qualifier remain in world-youth.js and the shared engines.
const WORLD_YOUTH_ACTION_COPY = {
    pl:{decline:'Zrezygnuj z miejsca w seniorskich MŚ za tytuł młodzieżowy',confirm:'Przekazać miejsce za tytuł młodzieżowy do kwalifikatora Tour Card? Inne zdobyte kwalifikacje pozostają ważne.'},
    en:{decline:'Decline the senior World place from the Youth title',confirm:'Transfer the Youth title place to the Tour Card qualifier? Other earned qualifications remain valid.'},
    de:{decline:'Auf den WM-Platz aus dem Jugendtitel verzichten',confirm:'Den Jugendtitel-Platz an das Tour-Card-Qualifikationsturnier übertragen? Andere erreichte Qualifikationen bleiben gültig.'},
    nl:{decline:'Afzien van de WK-plaats uit de jeugdtitel',confirm:'De jeugdtitelplaats aan het Tour Card-kwalificatietoernooi geven? Andere behaalde kwalificaties blijven geldig.'}
};
const showWorldYouthWithoutActions = showWorldYouth;
showWorldYouth = function(tab='overview',year=currentDate.getFullYear()) {
    const result=showWorldYouthWithoutActions(tab,year),edition=getWorldYouthEdition(year);
    if(tab==='overview'&&edition?.phase==='skipped'&&!Number.isFinite(edition.mainDate)){
        const dateOf=phase=>{const t=tournamentDatabase.find(t=>t.specialType==='worldYouth'&&t.worldYouthPhase===phase);
            return t?new Date(year,t.month,t.day).toLocaleDateString():'—';};
        const line=[...document.querySelectorAll('#world-youth-modal p')].find(p=>p.textContent.startsWith(worldYouthText('date')+':'));
        if(line)line.textContent=`${worldYouthText('date')}: ${dateOf('main')} / ${dateOf('final')}`;
    }
    const target=tournamentDatabase.find(t=>/global darts championship|world darts championship/i.test(t.sourceName||t.name)&&!t.qualifierFor);
    if(edition?.phase!=='completed'||edition.champion!==worldYouthKey(player)||edition.seniorWorldRoute!=='champion'
        ||edition.seniorWorldDeclined||!target||target.completed||currentDate>=new Date(year,target.month,target.day))return result;
    const copy=WORLD_YOUTH_ACTION_COPY[typeof currentLang==='string'?currentLang:'en']||WORLD_YOUTH_ACTION_COPY.en;
    const button=document.createElement('button');button.type='button';button.className='world-youth-decline';button.textContent=copy.decline;
    button.addEventListener('click',()=>{if(confirm(copy.confirm)&&declineWorldYouthSeniorWorldPlace(year))showWorldYouth(tab,year);});
    document.querySelector('#world-youth-modal footer')?.prepend(button);return result;
};
