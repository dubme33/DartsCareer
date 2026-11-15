/* Present the caller already assigned to this match, without delaying play. */
(function (root) {
    'use strict';
    const labels = {pl:'Sędzia meczu',en:'Match caller',de:'Schiedsrichter',nl:'Wedstrijdcaller'};
    let element=null,match=null,timer=null;
    function hide() {
        if(timer!==null)clearTimeout(timer);timer=null;match=null;
        if(element)element.hidden=true;
    }
    function refresh() {
        if(!element||element.hidden||!match)return;
        const lang=typeof currentLang==='string'?currentLang:'en';
        element.querySelector('.match-caller-label').textContent=labels[lang]||labels.en;
        element.querySelector('.match-caller-name').textContent=MATCH_CALLERS[match.callerId]||'';
    }
    function show(candidate=typeof currentMatch==='undefined'?null:currentMatch) {
        hide();
        if(!candidate||typeof initializeMatchCaller!=='function'||typeof document==='undefined')return false;
        initializeMatchCaller(candidate);match=candidate;
        if(!element){
            element=document.createElement('aside');element.className='match-caller-card';
            element.setAttribute('role','status');element.setAttribute('aria-live','polite');
            element.innerHTML='<span class="match-caller-icon" aria-hidden="true">🎙</span><div><span class="match-caller-label"></span><strong class="match-caller-name"></strong></div>';
            document.body.appendChild(element);
        }
        element.hidden=false;refresh();
        timer=setTimeout(hide,4500);
        return true;
    }
    root.matchCallerCard=Object.freeze({show,hide,refresh});
})(typeof window!=='undefined'?window:globalThis);
