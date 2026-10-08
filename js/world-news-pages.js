// Browser presentation is separate from saved sporting and editorial state.
let worldNewsSection='home',worldNewsArticleId=null,worldNewsPortalScroll=0,worldNewsTournamentFilter='';
function newsUi(key) {
    const labels={home:['Home','Start','Start','Home'],latest:['Latest','Najnowsze','Aktuell','Laatste'],
        TOURNAMENT:['Tournaments','Turnieje','Turniere','Toernooien'],RANKING:['Rankings','Rankingi','Ranglisten','Ranglijsten'],
        CAREER:['Careers','Kariery','Karrieren','Carrières'],WORLD_CHAMPIONSHIP:['World Championship','Mistrzostwa świata','Weltmeisterschaft','Wereldkampioenschap'],
        archive:['Archive','Archiwum','Archiv','Archief'],back:['Back to coverage','Wróć do wiadomości','Zurück zu den Berichten','Terug naar berichten'],
        related:['Related coverage','Powiązane relacje','Verwandte Berichte','Verwante berichten'],journey:['Follow the tournament','Historia turnieju','Das Turnier verfolgen','Volg het toernooi'],
        route:['Road through the tournament','Droga przez turniej','Weg durch das Turnier','Route door het toernooi'],
        latestStory:['Latest chapter','Najnowszy rozdział','Jüngstes Kapitel','Nieuwste hoofdstuk'],
        title:['Darts World News','Darts World News','Darts World News','Darts World News'],
        category:['Category','Kategoria','Kategorie','Categorie'],allEvents:['All tournaments','Wszystkie turnieje','Alle Turniere','Alle toernooien'],
        completed:['Champion','Mistrz','Champion','Kampioen'],read:['Read the story','Czytaj artykuł','Artikel lesen','Lees het verhaal']};
    return labels[key]?newsSay(...labels[key]):newsLabel(key);
}
function newsHasTag(a,tag) {
    const aliases={champion:'TOURNAMENT',upset:'UPSET',youth:'CAREER',ranking:'RANKING',condition:'FORM'};
    return a.primaryCategory===tag||a.category===tag||a.tags?.includes(tag)||aliases[a.type]===tag;
}
function getNewsroomFilteredArticles() {
    const aliases={champion:'TOURNAMENT',upset:'UPSET',youth:'CAREER',ranking:'RANKING',condition:'FORM'};
    return getNewsroomArticles().filter(a=>worldNewsSeasonFilter==='all'||(worldNewsSeasonFilter==='current'
        ?a.timestamp>=newsNow()-365*DARTS_NEWS_DAY:new Date(a.timestamp).getFullYear()===Number(worldNewsSeasonFilter)))
        .filter(a=>worldNewsFilter==='all'||worldNewsFilter==='unread'&&!a.read||newsHasTag(a,aliases[worldNewsFilter]||worldNewsFilter))
        .filter(a=>!worldNewsTournamentFilter||(a.data.facts||a.data).eventKey===worldNewsTournamentFilter);
}
function newsStablePlayer(id) {return id?newsRoster().find(p=>String(p.id)===String(id)):null;}
function resolveWorldNewsPlayerImage(playerId,person={}) {
    const candidate=newsStablePlayer(playerId);
    if(!candidate)return {kind:'fallback',name:person.name||'',country:person.country||''};
    const image=typeof getPlayerProfilePhoto==='function'?getPlayerProfilePhoto(candidate):candidate.photo;
    // User/mod-provided URLs are supported. No remote default or photograph is bundled.
    const source=typeof image==='string'?image.trim():'';
    const safe=source&&!/[\u0000-\u001f]/.test(source)&&! /^(?:javascript|vbscript|data:(?!image\/))/i.test(source);
    return {kind:safe?'portrait':'fallback',src:safe?source:null,name:candidate.name,country:candidate.country||''};
}
let worldNewsCountryAliases;
function getWorldNewsCountryLabel(country) {
    const raw=typeof country==='string'?country.trim():'';
    if(!raw)return '—';
    const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(!worldNewsCountryAliases){
        worldNewsCountryAliases=new Map();
        // Reuse the game's country catalog and translations, including mod
        // labels in another language and the codes already used for flags.
        const catalog=typeof flags==='object'?flags:{};
        for(const [name,code] of Object.entries(catalog)){
            const labels=[name,code];
            if(typeof translations==='object')for(const lang of ['en','pl','de','nl'])labels.push(translations[lang]?.[name]);
            for(const label of labels)if(typeof label==='string')worldNewsCountryAliases.set(normalize(label),name);
        }
    }
    const canonical=worldNewsCountryAliases.get(normalize(raw))||raw;
    const label=typeof getWorldCupCountryName==='function'?getWorldCupCountryName(canonical)
        :typeof t==='function'?t(canonical):canonical;
    return typeof label==='string'&&label.trim()?label:raw;
}
function newsAvatar(person,side='') {
    const resolved=resolveWorldNewsPlayerImage(person?.id,person),name=person?.name||'DWN';
    const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(n=>[...n][0]).join('').toUpperCase();
    const fallback=`<svg viewBox="0 0 300 280" aria-hidden="true" focusable="false"><circle cx="150" cy="95" r="44"/><path d="M38 280c4-78 44-123 112-123s108 45 112 123Z"/><text x="150" y="240" text-anchor="middle">${escapeHtml(initials)}</text></svg>`;
    const portrait=resolved.src?`<div class="dwn-portrait-image" data-portrait-mode="foreground"><img src="${escapeHtml(resolved.src)}" alt="${escapeHtml(name)}" loading="lazy" onload="this.closest('.dwn-avatar').classList.add('portrait-ready')" onerror="this.hidden=true;this.closest('.dwn-avatar').classList.remove('portrait-ready')"></div>`:'';
    return `<div class="dwn-avatar ${side}${portrait?' portrait-safe':''}">${fallback}${portrait}<span>${escapeHtml(name)}<small>${escapeHtml(getWorldNewsCountryLabel(person?.country||resolved.country))}</small></span></div>`;
}
function renderWorldNewsVisual(item,hero=false) {
    const f=newsPublicFacts(item),family=newsEditorialFamily(item,f),split=f.opponent&&['UPSET','FINAL','RESULT','MAJOR','WORLD'].includes(family);
    const tournament=family==='PREVIEW',kind=tournament?'tournament':split?'split':family==='RANKING'?'ranking':'portrait';
    return `<div class="dwn-visual visual-${kind}${hero?' visual-hero':''}" aria-label="${escapeHtml(f.tournament?.name||f.actor.name)}">
        <div class="dwn-board" aria-hidden="true"></div><span class="dwn-visual-mark" aria-hidden="true">DWN / ${escapeHtml(f.tournament?.world?'WORLD':f.tournament?.major?'MAJOR':'DARTS')}</span>
        ${tournament?`<strong class="dwn-tournament-name">${escapeHtml(f.tournament.name)}</strong>`:newsAvatar(f.actor,'avatar-a')+(split?newsAvatar(f.opponent,'avatar-b'):'')}
        ${split?'<b class="dwn-versus" aria-hidden="true">×</b>':''}${family==='RANKING'&&f.ranking?`<strong class="dwn-rank-number" aria-hidden="true">${f.ranking===1?'#1':'#'+f.ranking}</strong>`:''}
        <span class="dwn-visual-caption">${escapeHtml(tournament?newsLabel('PREVIEW'):f.tournament?.name||newsLabel(item.primaryCategory||item.category||'CAREER'))}</span></div>`;
}
function renderNewsroomCard(item,lead=false,compact=false) {
    const text=getWorldNewsPresentation(item),category=item.primaryCategory||item.category||'CAREER';
    return `<article class="world-news-card tier-${(item.tier||'STANDARD').toLowerCase()}${lead?' news-lead':''}${compact?' news-compact':''}">
        <a class="dwn-card-link" href="#darts-world-news/article/${item.id}" onclick="return openWorldNewsArticle(${item.id},event)">
        ${renderWorldNewsVisual(item,lead)}<div class="dwn-card-copy"><div class="world-news-meta"><span class="world-news-category">${escapeHtml(newsLabel(category))}</span><time datetime="${new Date(item.timestamp).toISOString()}">${escapeHtml(worldNewsDate(item.timestamp))}</time>${item.read?'':`<span class="world-news-new">${escapeHtml(trWorldNews('fresh'))}</span>`}</div>
        ${lead?`<p class="news-kicker">${escapeHtml(newsLabel('HEADLINE'))}</p>`:''}<h3>${escapeHtml(text.title)}</h3><p class="dwn-deck">${escapeHtml(text.deck||text.body.split('\n')[0].slice(0,180))}</p>
        ${lead?`<span class="dwn-read-link">${escapeHtml(newsUi('read'))} <span aria-hidden="true">↗</span></span>`:''}</div></a></article>`;
}
function newsNavigateSection(section) {
    worldNewsSection=section;worldNewsArticleId=null;worldNewsTournamentFilter='';
    worldNewsSeasonFilter=section==='archive'?'all':'current';
    worldNewsFilter=['TOURNAMENT','RANKING','CAREER','WORLD_CHAMPIONSHIP'].includes(section)?section:'all';
    newsSetBrowserRoute('#darts-world-news');showWorldNews(worldNewsFilter);
}
function newsSetBrowserRoute(hash,replace=false) {
    if(typeof window==='undefined'||!window.history)return;
    window.history.scrollRestoration='manual';
    if(window.location.hash!==hash)window.history[replace?'replaceState':'pushState']({dwn:true},'',hash);
}
function newsRouteId() {
    if(typeof window==='undefined')return null;
    const found=/^#darts-world-news\/article\/(\d+)$/.exec(window.location.hash);return found?Number(found[1]):null;
}
function newsRestoreScroll(value) {if(typeof window!=='undefined')window.requestAnimationFrame(()=>window.scrollTo({top:value,behavior:'instant'}));}
function openWorldNewsArticle(id,event) {
    if(event&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button>0))return true;
    if(event)event.preventDefault();const a=getNewsroomArticles().find(a=>a.id===Number(id));if(!a)return false;
    if(worldNewsArticleId===null&&typeof window!=='undefined'&&document.getElementById('screen-world-news')?.classList.contains('active'))worldNewsPortalScroll=window.scrollY;
    worldNewsArticleId=a.id;newsSetBrowserRoute('#darts-world-news/article/'+a.id);a.read=true;
    updateWorldNewsStrings();showScreen('screen-world-news');renderWorldNewsPortal();newsRestoreScroll(0);
    updateWorldNewsBadge();if(typeof saveGame==='function')saveGame(true);return false;
}
function closeWorldNewsArticle() {
    worldNewsArticleId=null;newsSetBrowserRoute('#darts-world-news');renderWorldNewsPortal();newsRestoreScroll(worldNewsPortalScroll);
}
function newsHandleBrowserRoute() {
    const id=newsRouteId();
    if(id!==null){openWorldNewsArticle(id);return;}
    if(worldNewsArticleId!==null){worldNewsArticleId=null;showScreen('screen-world-news');renderWorldNewsPortal();newsRestoreScroll(worldNewsPortalScroll);}
}
if(typeof window!=='undefined'&&window.addEventListener){window.addEventListener('hashchange',newsHandleBrowserRoute);window.addEventListener('popstate',newsHandleBrowserRoute);}
function newsPlayerLink(person) {
    if(!person?.name)return '';
    if(!newsStablePlayer(person.id))return `<span>${escapeHtml(person.name)}</span>`;
    return `<button class="world-news-profile" type="button" data-player-id="${escapeHtml(person.id)}" onclick="openDwnPlayer(this.dataset.playerId)">${escapeHtml(person.name)} <span aria-hidden="true">↗</span></button>`;
}
function openDwnPlayer(id) {
    const p=newsStablePlayer(id);if(!p||typeof openPlayerProfile!=='function')return false;
    openPlayerProfile(p.id,'world-news');return true;
}
function getWorldNewsRelated(item) {
    const f=item.data.facts||item.data,room=newsRoom();
    const stories=room.storylines.filter(s=>s.supportingEvents.some(e=>item.supportingKeys?.includes(e.key)));
    return getNewsroomArticles().filter(a=>a.id!==item.id).map(a=>{
        const af=a.data.facts||a.data;let score=0;
        if(f.eventKey&&af.eventKey===f.eventKey)score+=100;
        if(newsId(af.actor)===newsId(f.actor))score+=30;
        if(f.opponent&&[newsId(af.actor),newsId(af.opponent)].includes(newsId(f.opponent)))score+=15;
        if(stories.some(s=>s.supportingEvents.some(e=>a.supportingKeys?.includes(e.key))))score+=40;
        return {a,score};
    }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||b.a.timestamp-a.a.timestamp).slice(0,DARTS_NEWS_CONFIG.relatedLimit).map(r=>r.a);
}
function newsArticleResultBox(item,f) {
    if(!f.opponent||!f.score)return '';
    const scores=f.score.split('–');
    return `<section class="dwn-scorebox"><h3>${escapeHtml(f.tournament?.name||'')} ${f.stage?'— '+escapeHtml(newsRoundLabel(f.stage)):''}</h3><p><span>${newsPlayerLink(f.actor)}</span><strong>${escapeHtml(scores[0])}</strong></p><p><span>${newsPlayerLink(f.opponent)}</span><strong>${escapeHtml(scores[1]||'')}</strong></p><small>${escapeHtml(trWorldNews(f.unit==='sets'?'sets':'legs'))}</small></section>`;
}
function renderWorldNewsArticle(item) {
    const text=getWorldNewsPresentation(item),f=newsPublicFacts(item),related=getWorldNewsRelated(item);
    const sameEvent=f.tournament&&((item.data.facts||item.data).eventKey)?getNewsroomArticles().filter(a=>a.id!==item.id&&(a.data.facts||a.data).eventKey===(item.data.facts||item.data).eventKey).sort((a,b)=>a.timestamp-b.timestamp):[];
    const relevant=newsRoom().storylines.filter(s=>s.status!=='COMPLETED'&&s.supportingEvents.some(e=>item.supportingKeys?.includes(e.key))).sort((a,b)=>b.importance-a.importance)[0];
    const previousChapter=relevant&&relevant.stage>=2?getNewsroomArticles().find(a=>a.id!==item.id&&relevant.supportingEvents.some(e=>a.supportingKeys?.includes(e.key))):null;
    const route=f.route?.length?`<section class="dwn-route"><h3>${escapeHtml(newsUi('route'))}</h3><ol>${f.route.map(m=>`<li><span>${escapeHtml(newsRoundLabel(m.round))}</span><span>${newsPlayerLink(m.opponent)}</span><strong>${escapeHtml(m.score)}</strong></li>`).join('')}</ol></section>`:'';
    const journey=sameEvent.length?`<section class="dwn-journey"><h3>${escapeHtml(newsUi('journey'))}</h3><ol>${sameEvent.slice(0,8).map(a=>`<li><a href="#darts-world-news/article/${a.id}" onclick="return openWorldNewsArticle(${a.id},event)">${escapeHtml(getWorldNewsPresentation(a).title)}</a><small>${escapeHtml(worldNewsDate(a.timestamp))}</small></li>`).join('')}</ol></section>`:'';
    return `<button type="button" class="dwn-back" onclick="closeWorldNewsArticle()">← ${escapeHtml(newsUi('back'))}</button><article class="dwn-full-article depth-${(item.depth||'STANDARD').toLowerCase()}">
        <header class="dwn-article-header"><p class="news-kicker">${escapeHtml(newsLabel(item.primaryCategory||item.category||'CAREER'))}${text.tournament?' / '+escapeHtml(text.tournament):''}</p><h2>${escapeHtml(text.title)}</h2><p class="dwn-standfirst">${escapeHtml(text.deck||'')}</p><p class="dwn-byline">${escapeHtml(text.byline||'DWN Sports Desk')} <span>·</span> <time datetime="${new Date(item.timestamp).toISOString()}">${escapeHtml(worldNewsDate(item.timestamp))}</time></p></header>
        ${renderWorldNewsVisual(item,true)}<div class="dwn-article-columns"><div class="dwn-article-body">${(text.paragraphs||[{id:'legacy',text:text.body}]).map(p=>`<p>${escapeHtml(p.text)}</p>`).join('')}
        <div class="dwn-article-players">${newsPlayerLink(f.actor)}${f.opponent&&newsId(f.opponent)!==newsId(f.actor)?newsPlayerLink(f.opponent):''}</div>
        ${previousChapter?`<section class="dwn-story-context"><h3>${escapeHtml(newsStoryTitle(relevant))}</h3><a href="#darts-world-news/article/${previousChapter.id}" onclick="return openWorldNewsArticle(${previousChapter.id},event)">${escapeHtml(getWorldNewsPresentation(previousChapter).title)} ↗</a></section>`:''}</div>
        <aside class="dwn-article-aside">${newsArticleResultBox(item,f)}${f.ranking?`<section class="dwn-ranking-box"><h3>${escapeHtml(newsLabel('RANKING'))}</h3><strong>${f.previousRanking&&f.previousRanking!==f.ranking?'#'+f.previousRanking+' → ':''}#${f.ranking}</strong><p>Order of Merit</p></section>`:''}${route}${journey}</aside></div></article>
        ${related.length?`<section class="dwn-related"><h2>${escapeHtml(newsUi('related'))}</h2><div>${related.map(a=>renderNewsroomCard(a)).join('')}</div></section>`:''}`;
}
function renderNewsroomSidebar() {
    const r=newsRoom(),seen=new Set(),articles=getNewsroomArticles();
    const trending=r.storylines.filter(s=>s.status==='ACTIVE'&&s.importance>=72&&s.stage>=2).sort((a,b)=>b.importance-a.importance||b.lastUpdate-a.lastUpdate)
        .filter(s=>{const key=s.type==='WORLD_NO1_BATTLE'?'race':newsId(s.players[0]);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,4);
    const node=document.getElementById('world-news-trending');if(node)node.innerHTML=`<h3>${escapeHtml(newsLabel('trending'))}</h3>`+trending.map(s=>{
        const article=articles.find(a=>s.supportingEvents.some(e=>a.supportingKeys?.includes(e.key)));if(!article)return '';
        return `<div class="news-trend"><h4>${escapeHtml(newsStoryTitle(s))}</h4><a href="#darts-world-news/article/${article.id}" onclick="return openWorldNewsArticle(${article.id},event)">${escapeHtml(getWorldNewsPresentation(article).title)} <span aria-hidden="true">↗</span></a><small>${escapeHtml(worldNewsDate(article.timestamp))}</small></div>`;
    }).join('');
    if(node&&!node.innerHTML.includes('news-trend'))node.hidden=true;else if(node)node.hidden=false;
    const rankings=document.getElementById('world-news-ranking-snapshot'),rows=newsStandings().slice(0,5);
    if(rankings)rankings.innerHTML=`<h3>${escapeHtml(newsLabel('rankings'))}</h3><p class="news-side-note">Order of Merit</p><ol>${rows.map(r=>`<li>${newsPlayerLink(r.person)}<strong>£${Math.round(r.money).toLocaleString('en-GB')}</strong></li>`).join('')}</ol>`;
    const champions=document.getElementById('world-news-champions');if(champions)champions.innerHTML=`<h3>${escapeHtml(newsLabel('champions'))}</h3>`+newsSeason().majorChampions.slice(-4).reverse().map(c=>`<p>${newsPlayerLink(c.person)}<small>${escapeHtml(c.tournament)}</small></p>`).join('');
}
function renderWorldNewsTournamentHub(items) {
    const node=document.getElementById('world-news-tournament-hub');if(!node)return;
    const major=items.find(a=>(a.data.facts||a.data).tournament?.major),f=major&&(major.data.facts||major.data);
    node.hidden=worldNewsSection!=='TOURNAMENT'||!f;if(node.hidden)return;
    const winner=items.find(a=>a.canonicalKey===`${f.eventKey}:result`),preview=items.find(a=>a.canonicalKey===`${f.eventKey}:preview`);
    node.innerHTML=`<p class="news-kicker">${escapeHtml(newsLabel('MAJOR'))}</p><h2>${escapeHtml(f.tournament.name)}</h2><p>${escapeHtml(worldNewsDate(major.timestamp))}${winner?' · '+escapeHtml(newsUi('completed'))+': '+escapeHtml(winner.data.facts.actor.name):preview?.data.facts.defender?' · '+escapeHtml(newsSay('Defending champion','Obrońca tytułu','Titelverteidiger','Titelverdediger'))+': '+escapeHtml(preview.data.facts.defender.name):''}</p>`;
}
function renderWorldNewsPortal() {
    const list=document.getElementById('world-news-list');if(!list)return;
    const home=document.getElementById('world-news-home'),detail=document.getElementById('world-news-article');
    if(home?.dataset)home.dataset.section=worldNewsSection;
    const active=worldNewsArticleId!==null?getNewsroomArticles().find(a=>a.id===worldNewsArticleId):null;
    if(home)home.hidden=!!active;if(detail){detail.hidden=!active;detail.innerHTML=active?renderWorldNewsArticle(active):'';}
    const nav=document.getElementById('world-news-nav');if(nav)nav.innerHTML=['home','latest','TOURNAMENT','RANKING','CAREER','WORLD_CHAMPIONSHIP','archive'].map(k=>`<button type="button" aria-pressed="${worldNewsSection===k&&!active}" onclick="newsNavigateSection('${k}')">${escapeHtml(newsUi(k))}</button>`).join('');
    if(active)return;
    const articles=getNewsroomArticles(),items=getNewsroomFilteredArticles(),summary=document.getElementById('world-news-summary');
    if(summary)summary.textContent=newsSay(`${items.length} stories · ${articles.filter(a=>!a.read).length} unread`,`${items.length} wiadomości · ${articles.filter(a=>!a.read).length} nieprzeczytanych`,`${items.length} Meldungen · ${articles.filter(a=>!a.read).length} ungelesen`,`${items.length} berichten · ${articles.filter(a=>!a.read).length} ongelezen`);
    const selector=document.getElementById('world-news-season');if(selector){const years=[...new Set(articles.map(a=>new Date(a.timestamp).getFullYear()))].sort((a,b)=>b-a);
        selector.innerHTML=`<option value="current">${escapeHtml(newsLabel('current'))}</option><option value="all">${escapeHtml(newsLabel('allSeasons'))}</option>`+years.map(y=>`<option value="${y}">${y}</option>`).join('');selector.value=worldNewsSeasonFilter;}
    const seasonLabel=document.getElementById('world-news-season-label');if(seasonLabel)seasonLabel.textContent=newsLabel('archive');
    const filters=document.getElementById('world-news-filters');if(filters)filters.innerHTML=`<label>${escapeHtml(newsUi('category'))}<select aria-label="${escapeHtml(newsUi('category'))}" onchange="showWorldNews(this.value)">${['all','unread',...DARTS_NEWS_CONFIG.categories].map(k=>`<option value="${k}"${worldNewsFilter===k?' selected':''}>${escapeHtml(k==='all'||k==='unread'?trWorldNews(k):newsLabel(k))}</option>`).join('')}</select></label>`;
    const events=document.getElementById('world-news-tournament-filter');if(events){const unique=[...new Map(articles.filter(a=>(a.data.facts||a.data).eventKey).map(a=>{const f=a.data.facts||a.data;return [f.eventKey,f.tournament?.name+' · '+new Date(a.timestamp).getFullYear()];})).entries()];
        events.innerHTML=`<option value="">${escapeHtml(newsUi('allEvents'))}</option>`+unique.map(([key,name])=>`<option value="${escapeHtml(key)}"${worldNewsTournamentFilter===key?' selected':''}>${escapeHtml(name)}</option>`).join('');}
    const featureMode=worldNewsSection==='home'&&worldNewsFilter==='all'&&worldNewsSeasonFilter==='current';
    const recent=featureMode?items.filter(a=>a.importanceScore>=72&&newsNow()-a.timestamp<21*DARTS_NEWS_DAY).sort((a,b)=>(b.importanceScore-(newsNow()-b.timestamp)/DARTS_NEWS_DAY*1.5)-(a.importanceScore-(newsNow()-a.timestamp)/DARTS_NEWS_DAY*1.5)):[];
    const lead=recent.find(a=>a.tier==='HEADLINE')||recent.find(a=>a.data.facts?.tournament?.major&&a.topic==='result'),secondary=recent.filter(a=>a!==lead).slice(0,3),chosen=new Set([lead,...secondary].filter(Boolean).map(a=>a.id));
    const leadArea=document.getElementById('world-news-lead'),featured=document.getElementById('world-news-featured');
    if(leadArea){leadArea.innerHTML=lead?renderNewsroomCard(lead,true):'';leadArea.hidden=!lead;}
    if(featured){featured.innerHTML=secondary.map(a=>renderNewsroomCard(a)).join('');featured.hidden=!secondary.length;if(featured.dataset)featured.dataset.count=secondary.length;}
    list.innerHTML=items.filter(a=>!chosen.has(a.id)).slice(0,worldNewsVisibleCount).map(a=>renderNewsroomCard(a,false,true)).join('')||(!lead?`<p class="world-news-empty">${escapeHtml(trWorldNews(articles.length?'noMatches':'empty'))}</p>`:'');
    const feedTitle=document.getElementById('world-news-feed-title');if(feedTitle)feedTitle.textContent=worldNewsSection==='archive'?newsLabel('archive'):worldNewsSection==='TOURNAMENT'?newsUi('TOURNAMENT'):newsLabel('latest');
    const more=document.getElementById('world-news-more');if(more){more.hidden=items.length-chosen.size<=worldNewsVisibleCount;more.textContent=trWorldNews('more',{count:Math.max(0,items.length-chosen.size-worldNewsVisibleCount)});}
    const read=document.getElementById('world-news-read');if(read)read.disabled=!articles.some(a=>!a.read);
    renderWorldNewsTournamentHub(items);renderNewsroomSidebar();updateWorldNewsBadge();
}
function renderWorldNewsTimeline(candidate) {
    const p=newsRoom().people[newsId(candidate)];if(!p?.timeline?.length)return '';
    const articles=new Map(getNewsroomArticles().map(a=>[a.id,a]));
    const rows=p.timeline.filter(row=>articles.has(row.articleId)).slice(-8).reverse();if(!rows.length)return '';
    return `<section class="profile-panel news-profile-timeline"><h3>DWN / ${escapeHtml(newsLabel('timeline'))}</h3><ol>${rows.map(row=>`<li><time>${row.season}</time><a href="#darts-world-news/article/${row.articleId}" onclick="return openWorldNewsArticle(${row.articleId},event)">${escapeHtml(getWorldNewsPresentation(articles.get(row.articleId)).title)}</a></li>`).join('')}</ol></section>`;
}
