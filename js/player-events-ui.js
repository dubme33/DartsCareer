const PLAYER_EVENTS_TEXT = {
    pl: {
        status: 'Zdrowie i forma', healthy: 'Zdrowy · normalna forma', news: 'Zdrowie i forma', sender: 'Sztab medyczny',
        wrist: 'Uraz nadgarstka', shoulder: 'Uraz barku', elbow: 'Uraz łokcia',
        injury: 'Kontuzja: {type}', injuryBody: '{name}: {type}. Pełna rekonwalescencja potrwa do {date} (pozostało {days} dni). Do tego czasu trening i udział w turniejach są zablokowane.',
        recovered: 'Koniec rekonwalescencji', recoveredBody: '{name} zakończył rekonwalescencję i może ponownie trenować oraz uczestniczyć w turniejach.',
        formUp: 'Nagły wzrost formy', formDown: 'Nagły spadek formy',
        formBody: '{name}: {modifier} pkt do poziomu gry, punktacji i podwójnych do {date}. Bazowe statystyki pozostają bez zmian.',
        formEnded: 'Powrót do normalnej formy', formEndedBody: '{name}: czasowa zmiana formy dobiegła końca.',
        blocked: 'Kontuzja blokuje trening i grę do {date}. Odczekaj pełną rekonwalescencję.',
        rules: 'Kontuzje i czasowe zmiany formy mogą dotknąć gracza oraz zawodników AI. Kontuzjowani wracają dopiero po pełnej rekonwalescencji.'
    },
    en: {
        status: 'Health and form', healthy: 'Healthy · normal form', news: 'Health and form', sender: 'Medical staff',
        wrist: 'Wrist injury', shoulder: 'Shoulder injury', elbow: 'Elbow injury',
        injury: 'Injury: {type}', injuryBody: '{name}: {type}. Full recovery takes until {date} ({days} days remaining). Training and tournament participation are blocked until then.',
        recovered: 'Recovery completed', recoveredBody: '{name} has fully recovered and can train and compete in tournaments again.',
        formUp: 'Sudden improvement in form', formDown: 'Sudden drop in form',
        formBody: '{name}: {modifier} points to playing level, scoring and doubles until {date}. Base ratings remain unchanged.',
        formEnded: 'Normal form restored', formEndedBody: '{name}: the temporary change in form has ended.',
        blocked: 'Injury blocks training and play until {date}. Wait for full recovery.',
        rules: 'Injuries and temporary changes in form affect both you and AI players. Injured players must fully recover before returning.'
    },
    de: {
        status: 'Gesundheit und Form', healthy: 'Gesund · normale Form', news: 'Gesundheit und Form', sender: 'Medizinischer Stab',
        wrist: 'Handgelenkverletzung', shoulder: 'Schulterverletzung', elbow: 'Ellbogenverletzung',
        injury: 'Verletzung: {type}', injuryBody: '{name}: {type}. Vollständige Genesung bis {date} (noch {days} Tage). Training und Turnierteilnahme sind bis dahin gesperrt.',
        recovered: 'Genesung abgeschlossen', recoveredBody: '{name} ist vollständig genesen und darf wieder trainieren und an Turnieren teilnehmen.',
        formUp: 'Plötzlicher Formanstieg', formDown: 'Plötzlicher Formabfall',
        formBody: '{name}: {modifier} Punkte auf Spielniveau, Scoring und Doppel bis {date}. Die Basiswerte bleiben unverändert.',
        formEnded: 'Normale Form wiederhergestellt', formEndedBody: '{name}: die vorübergehende Formänderung ist beendet.',
        blocked: 'Verletzung sperrt Training und Spiel bis {date}. Warte auf vollständige Genesung.',
        rules: 'Verletzungen und zeitweilige Formänderungen betreffen dich und KI-Spieler. Verletzte müssen vor ihrer Rückkehr vollständig genesen.'
    },
    nl: {
        status: 'Gezondheid en vorm', healthy: 'Gezond · normale vorm', news: 'Gezondheid en vorm', sender: 'Medische staf',
        wrist: 'Polsblessure', shoulder: 'Schouderblessure', elbow: 'Elleboogblessure',
        injury: 'Blessure: {type}', injuryBody: '{name}: {type}. Volledig herstel duurt tot {date} (nog {days} dagen). Training en deelname aan toernooien zijn tot dan geblokkeerd.',
        recovered: 'Herstel voltooid', recoveredBody: '{name} is volledig hersteld en kan weer trainen en deelnemen aan toernooien.',
        formUp: 'Plotselinge vormstijging', formDown: 'Plotselinge vormdaling',
        formBody: '{name}: {modifier} punten voor speelniveau, scoring en dubbels tot {date}. Basiswaarden blijven gelijk.',
        formEnded: 'Normale vorm hersteld', formEndedBody: '{name}: de tijdelijke vormverandering is voorbij.',
        blocked: 'Een blessure blokkeert training en spel tot {date}. Wacht op volledig herstel.',
        rules: 'Blessures en tijdelijke vormveranderingen treffen jou en AI-spelers. Geblesseerde spelers moeten volledig herstellen voor ze terugkeren.'
    }
};

function trPlayerEvents(key, values = {}) {
    const language = typeof currentLang === 'string' && PLAYER_EVENTS_TEXT[currentLang] ? currentLang : 'pl';
    return (PLAYER_EVENTS_TEXT[language][key] || PLAYER_EVENTS_TEXT.pl[key] || key)
        .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function playerEventDisplayDate(value) {
    const locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[typeof currentLang === 'string' ? currentLang : 'pl'] || 'pl-PL';
    return parsePlayerEventDate(value)?.toLocaleDateString(locale) || '—';
}

function playerEventDaysRemaining(value) {
    const utc = key => { const [year, month, day] = key.split('-').map(Number); return Date.UTC(year, month - 1, day); };
    return Math.max(0, Math.round((utc(value) - utc(playerEventDateKey())) / 86400000));
}

function getPlayerEventPresentation(kind, event, name = '') {
    const values = { name, type: trPlayerEvents(event.type || 'wrist'), date: playerEventDisplayDate(event.endsOn),
        days: playerEventDaysRemaining(event.endsOn), modifier: `${event.modifier > 0 ? '+' : ''}${event.modifier || 0}` };
    return { title: trPlayerEvents(kind, values), body: trPlayerEvents(
        kind === 'formUp' || kind === 'formDown' ? 'formBody' : kind + 'Body', values) };
}

function getPlayerEventStatusMarkup(candidate, showHealthy = false) {
    const injury = getActivePlayerTimedEvent(candidate, true);
    const form = getActivePlayerTimedEvent(candidate);
    const e = escapeHtml;
    const cards = [];
    if (injury) {
        const text = getPlayerEventPresentation('injury', injury, candidate.name);
        cards.push(`<div class="player-event-status event-injury"><strong>🩹 ${e(text.title)}</strong><p>${e(text.body)}</p></div>`);
    }
    if (form) {
        const text = getPlayerEventPresentation(form.modifier > 0 ? 'formUp' : 'formDown', form, candidate.name);
        cards.push(`<div class="player-event-status ${form.modifier > 0 ? 'event-form-up' : 'event-form-down'}"><strong>${form.modifier > 0 ? '↗️' : '↘️'} ${e(text.title)}</strong><p>${e(text.body)}</p></div>`);
    }
    return cards.join('') || (showHealthy ? `<p class="player-event-healthy">${e(trPlayerEvents('healthy'))}</p>` : '');
}

function renderPlayerEventProfile(candidate) {
    return `<section class="profile-panel player-event-profile"><h3>${escapeHtml(trPlayerEvents('status'))}</h3>${getPlayerEventStatusMarkup(candidate, true)}</section>`;
}

function refreshPlayerEventsViews() {
    if (typeof document === 'undefined' || typeof player === 'undefined' || !player) return;
    const markup = getPlayerEventStatusMarkup(player);
    for (const id of ['hub-player-events', 'train-player-events']) {
        const root = document.getElementById(id);
        if (root) { root.innerHTML = markup; root.hidden = !markup; }
    }
}

function showPlayerInjuryBlocked(candidate = player) {
    const injury = getActivePlayerTimedEvent(candidate, true);
    if (injury && typeof alert === 'function') alert(trPlayerEvents('blocked', { date: playerEventDisplayDate(injury.endsOn) }));
    return false;
}

function notifyPlayerEvents(result) {
    const roster = getPlayerEventRoster().sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
    const newsworthy = new Set(roster.slice(0, 64));
    for (const event of result.events) {
        const { candidate, kind, ...data } = event;
        const own = candidate === player || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate));
        if (own && typeof addEmail === 'function') {
            const text = getPlayerEventPresentation(kind, data, candidate.name);
            addEmail(trPlayerEvents('sender'), text.title, `<p>${escapeHtml(text.body)}</p>`);
        }
        if ((own || newsworthy.has(candidate)) && typeof addWorldNews === 'function' && typeof worldNewsPerson === 'function') {
            addWorldNews('condition', `condition:${candidate.id || candidate.name}:${kind}:${kind === 'recovered' || kind === 'formEnded' ? data.endsOn : data.startedOn}`,
                { actor: worldNewsPerson(candidate), kind, event: data });
        }
    }
    refreshPlayerEventsViews();
}
