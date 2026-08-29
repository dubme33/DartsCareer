// News observes recorded results. It never rolls dice or changes player skills,
// rankings or money. Keeping it on player also makes simulation rollback atomic.
const WORLD_NEWS_CONFIG = Object.freeze({ limit: 180, pageSize: 20, upsetsPerEvent: 3, upsetGap: 12, youngAge: 23 });
const WORLD_NEWS_TEXT = {
    pl: {
        title: 'Ze świata darta', tile: 'Wyniki, sensacje i bohaterowie sezonu.',
        scope: 'Doniesienia z tej kariery, wyłącznie na podstawie zapisanych wyników. Mecze gracza i AI. Bez wpływu na rozgrywkę.',
        archive: 'Archiwum: {count}/180 · zbierane od {date}', unreadCount: 'Nieprzeczytane: {count}',
        all: 'Wszystkie', unread: 'Nieprzeczytane', upset: 'Sensacje', champion: 'Mistrzowie', youth: 'Młode talenty', ranking: 'Lider OOM',
        back: 'Wróć do Menu', markRead: 'Oznacz wszystkie jako przeczytane', more: 'Pokaż więcej ({count})', fresh: 'NOWE',
        empty: 'Tu pojawią się wiadomości po kolejnych meczach i turniejach. Nie odtwarzamy wydarzeń sprzed dodania wiadomości do tego zapisu.',
        backToNews: 'Wróć do wiadomości',
        noMatches: 'Brak wiadomości w tej kategorii.', profile: 'Profil: {name}',
        upsetTitle: '{name} ogrywa faworyta!',
        upsetBody: '{name} pokonuje {opponent} wynikiem {score} ({unit}). Pokonany rywal miał o {gap} punktów wyższy bazowy OVR.',
        championTitle: '{name} wygrywa turniej!', championBody: '{name} zdobywa tytuł w {tournament}.',
        prize: 'Nagroda za zwycięstwo: {amount}.',
        youthTitle: 'Młody talent błyszczy: {name}',
        youthBody: '{name}, wiek: {age}, osiąga {stage} w {tournament}. Wyróżniamy mocny wynik młodego zawodnika rozwijającego swoją karierę.',
        semifinal: 'półfinał', final: 'finał', titleStage: 'zwycięstwo',
        rankingTitle: '{name} nowym liderem OOM',
        rankingBody: '{name} przejmuje prowadzenie w głównym Order of Merit po {previous}. Aktualny dorobek lidera: {amount}.',
        firstLeaderBody: '{name} obejmuje prowadzenie w głównym Order of Merit z dorobkiem {amount}.',
        afterTournament: 'Po rozliczeniu turnieju: {tournament}.', afterDate: 'Po aktualizacji rankingu na nowy dzień.',
        teamTitle: '{country} wygrywa Puchar Narodów!', teamBody: 'Zwycięski zespół: {names}.',
        legs: 'legi', sets: 'sety', rules: 'Jak wybieramy wiadomości?',
        criteria: 'Sensacja: zwycięzca ma bazowy OVR niższy o co najmniej 12 od rywala z OVR 80+. Maksymalnie 3 sensacje z turnieju. Młode talenty: do 23 lat, OVR poniżej 85 i co najmniej półfinał imprezy głównego OOM; jedno wyróżnienie na zawodnika w sezonie. Tytuły nie obejmują kwalifikatorów. Zmiany lidera sprawdzamy po turnieju i po zmianie daty.'
    },
    en: {
        title: 'Darts world news', tile: 'Results, upsets and the season’s standout players.',
        scope: 'News from this career, based only on recorded results. Includes player and AI matches. No effect on gameplay.',
        archive: 'Archive: {count}/180 · tracking since {date}', unreadCount: 'Unread: {count}',
        all: 'All', unread: 'Unread', upset: 'Upsets', champion: 'Champions', youth: 'Young talents', ranking: 'OOM leader',
        back: 'Back to Menu', markRead: 'Mark all as read', more: 'Show more ({count})', fresh: 'NEW',
        empty: 'News will appear after upcoming matches and tournaments. Events from before news tracking began in this save are not reconstructed.',
        backToNews: 'Back to news',
        noMatches: 'No news in this category.', profile: 'Profile: {name}',
        upsetTitle: '{name} beats the favourite!',
        upsetBody: '{name} defeats {opponent} by {score} ({unit}). Before the result, the beaten player’s base rating was {gap} OVR higher.',
        championTitle: '{name} wins the tournament!', championBody: '{name} takes the title at {tournament}.',
        prize: 'Winner’s prize: {amount}.',
        youthTitle: 'Young talent shines: {name}',
        youthBody: '{name}, age {age}, achieves {stage} at {tournament}. A standout result for a young player building their career.',
        semifinal: 'a semi-final', final: 'a final', titleStage: 'victory',
        rankingTitle: '{name} is the new OOM leader',
        rankingBody: '{name} takes over from {previous} at the top of the main Order of Merit. The leader’s current total is {amount}.',
        firstLeaderBody: '{name} leads the main Order of Merit with {amount}.',
        afterTournament: 'After all prizes were awarded at {tournament}.', afterDate: 'After the daily ranking update.',
        teamTitle: '{country} wins the Nations Cup!', teamBody: 'Winning team: {names}.',
        legs: 'legs', sets: 'sets', rules: 'How is news selected?',
        criteria: 'Upset: a winner with a base OVR at least 12 lower than an opponent rated 80+. At most 3 upsets per tournament. Young talents: age 23 or younger, OVR below 85, and at least a main OOM semi-final; one spotlight per player per season. Titles exclude qualifiers. Leader changes are checked after tournaments and date changes.'
    },
    de: {
        title: 'Nachrichten aus der Dartswelt', tile: 'Ergebnisse, Überraschungen und die Spieler der Saison.',
        scope: 'Nachrichten aus dieser Karriere, ausschließlich aus erfassten Ergebnissen. Spieler- und KI-Partien. Ohne Einfluss auf das Spiel.',
        archive: 'Archiv: {count}/180 · erfasst seit {date}', unreadCount: 'Ungelesen: {count}',
        all: 'Alle', unread: 'Ungelesen', upset: 'Überraschungen', champion: 'Turniersieger', youth: 'Junge Talente', ranking: 'OOM-Spitze',
        back: 'Zurück zum Menü', markRead: 'Alle als gelesen markieren', more: 'Mehr anzeigen ({count})', fresh: 'NEU',
        empty: 'Nach den nächsten Spielen und Turnieren erscheinen hier Nachrichten. Ereignisse vor Beginn der Nachrichtenerfassung werden nicht rekonstruiert.',
        backToNews: 'Zurück zu den Nachrichten',
        noMatches: 'Keine Nachrichten in dieser Kategorie.', profile: 'Profil: {name}',
        upsetTitle: '{name} schlägt den Favoriten!',
        upsetBody: '{name} besiegt {opponent} mit {score} ({unit}). Vor dem Ergebnis war die Basiswertung des unterlegenen Spielers um {gap} OVR höher.',
        championTitle: '{name} gewinnt das Turnier!', championBody: '{name} holt den Titel bei {tournament}.',
        prize: 'Siegprämie: {amount}.',
        youthTitle: 'Junges Talent glänzt: {name}',
        youthBody: '{name}, Alter: {age}, erreicht {stage} bei {tournament}. Ein starker Auftritt eines jungen Spielers auf seinem Karriereweg.',
        semifinal: 'das Halbfinale', final: 'das Finale', titleStage: 'den Turniersieg',
        rankingTitle: '{name} führt jetzt die OOM an',
        rankingBody: '{name} löst {previous} an der Spitze der Haupt-Order-of-Merit ab. Aktueller Betrag des Spitzenreiters: {amount}.',
        firstLeaderBody: '{name} führt die Haupt-Order-of-Merit mit {amount} an.',
        afterTournament: 'Nach der vollständigen Preisgeldvergabe bei {tournament}.', afterDate: 'Nach der täglichen Ranglistenaktualisierung.',
        teamTitle: '{country} gewinnt den Nations Cup!', teamBody: 'Siegerteam: {names}.',
        legs: 'Legs', sets: 'Sätze', rules: 'Wie werden Nachrichten ausgewählt?',
        criteria: 'Überraschung: Der Sieger hat mindestens 12 Basis-OVR weniger als ein Gegner mit OVR 80+. Höchstens 3 Meldungen pro Turnier. Junge Talente: bis 23 Jahre, OVR unter 85 und mindestens ein Halbfinale in einem Haupt-OOM-Turnier; eine Würdigung pro Spieler und Saison. Titel schließen Qualifikationen aus. Führungswechsel werden nach Turnieren und Datumswechseln geprüft.'
    },
    nl: {
        title: 'Nieuws uit de dartswereld', tile: 'Uitslagen, verrassingen en de spelers van het seizoen.',
        scope: 'Nieuws uit deze carrière, uitsluitend op basis van vastgelegde uitslagen. Inclusief speler- en AI-wedstrijden. Geen invloed op het spel.',
        archive: 'Archief: {count}/180 · bijgehouden sinds {date}', unreadCount: 'Ongelezen: {count}',
        all: 'Alles', unread: 'Ongelezen', upset: 'Verrassingen', champion: 'Kampioenen', youth: 'Jonge talenten', ranking: 'OOM-leider',
        back: 'Terug naar Menu', markRead: 'Alles als gelezen markeren', more: 'Meer tonen ({count})', fresh: 'NIEUW',
        empty: 'Nieuws verschijnt na komende wedstrijden en toernooien. Gebeurtenissen van vóór het begin van de nieuwsregistratie worden niet gereconstrueerd.',
        backToNews: 'Terug naar nieuws',
        noMatches: 'Geen nieuws in deze categorie.', profile: 'Profiel: {name}',
        upsetTitle: '{name} verslaat de favoriet!',
        upsetBody: '{name} verslaat {opponent} met {score} ({unit}). Vóór de uitslag was de basisrating van de verslagen speler {gap} OVR hoger.',
        championTitle: '{name} wint het toernooi!', championBody: '{name} pakt de titel bij {tournament}.',
        prize: 'Prijzengeld voor de winnaar: {amount}.',
        youthTitle: 'Jong talent schittert: {name}',
        youthBody: '{name}, leeftijd {age}, bereikt {stage} bij {tournament}. Een sterke prestatie van een jonge speler die aan een carrière bouwt.',
        semifinal: 'de halve finale', final: 'de finale', titleStage: 'de toernooizege',
        rankingTitle: '{name} is de nieuwe OOM-leider',
        rankingBody: '{name} neemt de leiding in de hoofd-Order of Merit over van {previous}. Het huidige totaal van de leider is {amount}.',
        firstLeaderBody: '{name} leidt de hoofd-Order of Merit met {amount}.',
        afterTournament: 'Na uitbetaling van alle prijzen bij {tournament}.', afterDate: 'Na de dagelijkse rankingupdate.',
        teamTitle: '{country} wint de Nations Cup!', teamBody: 'Winnend team: {names}.',
        legs: 'legs', sets: 'sets', rules: 'Hoe wordt nieuws gekozen?',
        criteria: 'Verrassing: de winnaar heeft minstens 12 basis-OVR minder dan een tegenstander met OVR 80+. Maximaal 3 per toernooi. Jonge talenten: tot 23 jaar, OVR onder 85 en minstens een halve finale in een hoofd-OOM-toernooi; één vermelding per speler per seizoen. Titels sluiten kwalificaties uit. Nieuwe leiders worden na toernooien en datumwijzigingen gecontroleerd.'
    }
};
let worldNewsFilter = 'all';
let worldNewsVisibleCount = WORLD_NEWS_CONFIG.pageSize;

function trWorldNews(key, values = {}) {
    const lang = typeof currentLang === 'string' ? currentLang : 'en';
    return (WORLD_NEWS_TEXT[lang]?.[key] || WORLD_NEWS_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function initWorldNews() {
    if (!player.worldNews || player.worldNews.version !== 1) {
        player.worldNews = { version: 1, since: currentDate.getTime(), entries: [], sequence: 0,
            leader: null, leaderInitialized: false, season: currentDate.getFullYear(), upsets: {}, youngPlayers: [] };
    }
    return player.worldNews;
}

function worldNewsPerson(candidate) {
    if (!candidate || candidate.isBye || !candidate.name) return null;
    return { id: String(candidate.id || ''), name: String(candidate.name), sourceName: String(candidate.sourceName || candidate.name),
        country: String(candidate.country || '') };
}

function worldNewsPersonKey(candidate) {
    return candidate?.id ? `id:${candidate.id}` : `name:${candidate?.sourceName || candidate?.name || ''}`;
}

function getWorldNewsPlayers() {
    return typeof getCareerProfilePlayers === 'function' ? getCareerProfilePlayers() : [...pdcPlayers, player].filter(Boolean);
}

function resolveWorldNewsPerson(person, candidates = getWorldNewsPlayers()) {
    if (!person || (typeof isRetiredPlayer === 'function' && isRetiredPlayer(person))) return null;
    const byId = candidates.find(candidate => worldNewsPersonKey(candidate) === worldNewsPersonKey(person));
    if (byId) return byId;
    // Save migrations can merge duplicate players or replace legacy IDs.
    // Reuse the same aliases/name resolution as saved tournament references.
    if (typeof resolveLoadedPlayer === 'function') {
        const resolved = resolveLoadedPlayer(person);
        return candidates.includes(resolved) ? resolved : null;
    }
    const byName = candidates.filter(candidate => candidate.name === person.name
        && (!person.country || candidate.country === person.country));
    return byName.length === 1 ? byName[0] : null;
}

function getWorldNewsLeader(previous = null) {
    let leader = null;
    let amount = 0;
    for (const candidate of getWorldNewsPlayers()) {
        const money = Number(candidate.prizeMoney);
        if (!candidate.name || candidate.isBye || !Number.isFinite(money) || money <= 0) continue;
        if (money > amount || (money === amount && worldNewsPersonKey(candidate) === worldNewsPersonKey(previous))) {
            leader = candidate;
            amount = money;
        }
    }
    return leader ? { ...worldNewsPerson(leader), amount } : null;
}

function initializeWorldNews(reset = false) {
    if (reset) delete player.worldNews;
    const state = initWorldNews();
    if (!state.leaderInitialized) {
        state.leader = getWorldNewsLeader();
        state.leaderInitialized = true;
    }
    worldNewsFilter = 'all';
    worldNewsVisibleCount = WORLD_NEWS_CONFIG.pageSize;
    updateWorldNewsBadge();
    return state;
}

function restoreWorldNews() {
    const state = initWorldNews();
    const seen = new Set();
    const seenIds = new Set();
    state.entries = (Array.isArray(state.entries) ? state.entries : []).filter(item => {
        if (!item || typeof item.key !== 'string' || !Number.isSafeInteger(item.id) || item.id < 1
            || !['upset', 'champion', 'youth', 'ranking'].includes(item.type)
            || !Number.isFinite(item.timestamp) || !Number.isFinite(new Date(item.timestamp).getTime())
            || !item.data || typeof item.data !== 'object' || Array.isArray(item.data)
            || seen.has(item.key) || seenIds.has(item.id)) return false;
        const data = item.data;
        const validPerson = person => person && typeof person.name === 'string' && person.name.length > 0;
        if (data.tournament && (typeof data.tournament !== 'object' || typeof data.tournament.name !== 'string')) return false;
        const teamTitle = item.type === 'champion' && typeof data.country === 'string' && typeof data.names === 'string';
        if (!teamTitle && !validPerson(data.actor)) return false;
        if (item.type === 'upset' && (!validPerson(data.opponent) || typeof data.score !== 'string' || !Number.isFinite(data.gap))) return false;
        if (item.type === 'youth' && (!Number.isFinite(data.age) || !['titleStage', 'final', 'semifinal'].includes(data.stage))) return false;
        if (item.type === 'ranking' && (!Number.isFinite(data.amount) || (data.previous && !validPerson(data.previous)))) return false;
        seen.add(item.key);
        seenIds.add(item.id);
        item.read = item.read === true;
        return true;
    }).sort((a, b) => b.timestamp - a.timestamp || b.id - a.id).slice(0, WORLD_NEWS_CONFIG.limit);
    state.sequence = Math.max(Number.isSafeInteger(state.sequence) ? state.sequence : 0, ...state.entries.map(item => item.id));
    if (!Number.isFinite(state.since)) state.since = currentDate.getTime();
    if (!state.upsets || typeof state.upsets !== 'object' || Array.isArray(state.upsets)) state.upsets = {};
    state.youngPlayers = Array.isArray(state.youngPlayers) ? state.youngPlayers.filter(key => typeof key === 'string') : [];
    state.leaderInitialized = state.leaderInitialized === true;
    if (state.leader && typeof state.leader.name !== 'string') { state.leader = null; state.leaderInitialized = false; }
    const candidates = getWorldNewsPlayers();
    const migratedKeys = new Map();
    const reconnect = person => {
        const candidate = resolveWorldNewsPerson(person, candidates);
        if (!candidate) return;
        migratedKeys.set(worldNewsPersonKey(person), worldNewsPersonKey(candidate));
        person.id = String(candidate.id || '');
    };
    reconnect(state.leader);
    state.entries.forEach(item => ['actor', 'opponent', 'previous'].forEach(role => reconnect(item.data[role])));
    state.youngPlayers = [...new Set(state.youngPlayers.map(key => migratedKeys.get(key) || key))];
    initializeWorldNews();
}

function resetWorldNewsRankingBaseline() {
    const state = initWorldNews();
    state.leader = getWorldNewsLeader(state.leader);
    state.leaderInitialized = true;
}

function worldNewsSeasonState() {
    const state = initWorldNews();
    if (state.season !== currentDate.getFullYear()) {
        state.season = currentDate.getFullYear();
        state.upsets = {};
        state.youngPlayers = [];
    }
    return state;
}

function worldNewsEventKey(tournament) {
    return JSON.stringify([currentDate.getFullYear(), tournament.sourceName || tournament.name, tournament.month, tournament.day]);
}

function worldNewsTournament(tournament) {
    return { name: String(tournament.name), sourceName: String(tournament.sourceName || tournament.name),
        specialType: String(tournament.specialType || ''), worldMastersEvent: String(tournament.worldMastersEvent || '') };
}

function isWorldNewsSinglesEvent(tournament) {
    if (!tournament?.name || tournament.isDoubles) return false;
    const text = `${tournament.name} ${tournament.sourceName || ''} ${tournament.specialType || ''}`.toLowerCase();
    return !/qualifier|kwalifikac|q-school|qschool|worldcup|world cup|puchar narodów/.test(text);
}

function addWorldNews(type, key, data) {
    const state = initWorldNews();
    if (state.entries.some(item => item.key === key)) return null;
    const item = { id: ++state.sequence, key, type, timestamp: currentDate.getTime(), data, read: false };
    state.entries.unshift(item);
    if (state.entries.length > WORLD_NEWS_CONFIG.limit) state.entries.length = WORLD_NEWS_CONFIG.limit;
    updateWorldNewsBadge();
    return item;
}

function worldNewsRating(candidate) {
    const isCareer = candidate === player || (candidate.id && candidate.id === player.id);
    const value = Number(isCareer ? candidate.overall ?? candidate.ovr : candidate.ovr);
    return Number.isFinite(value) && value > 0 ? value : null;
}

function recordWorldNewsMatch(p1, p2, result, options, key) {
    const tournament = options.tournament;
    if (!isWorldNewsSinglesEvent(tournament) || p1.isBye || p2.isBye) return;
    const firstWins = result.p1Score > result.p2Score;
    const winner = firstWins ? p1 : p2;
    const loser = firstWins ? p2 : p1;
    const winnerRating = worldNewsRating(winner), loserRating = worldNewsRating(loser);
    if (winnerRating === null || loserRating === null || loserRating < 80 || loserRating - winnerRating < WORLD_NEWS_CONFIG.upsetGap) return;
    const state = worldNewsSeasonState();
    const eventKey = worldNewsEventKey(tournament);
    if ((state.upsets[eventKey] || 0) >= WORLD_NEWS_CONFIG.upsetsPerEvent) return;
    const item = addWorldNews('upset', `upset:${key}`, {
        actor: worldNewsPerson(winner), opponent: worldNewsPerson(loser), tournament: worldNewsTournament(tournament),
        score: `${firstWins ? result.p1Score : result.p2Score}:${firstWins ? result.p2Score : result.p1Score}`,
        unit: options.format?.type === 'sets' ? 'sets' : 'legs', gap: Number((loserRating - winnerRating).toFixed(1))
    });
    if (item) state.upsets[eventKey] = (state.upsets[eventKey] || 0) + 1;
}

function recordWorldNewsTournament(candidate, tournament, result) {
    if (!isWorldNewsSinglesEvent(tournament) || !worldNewsPerson(candidate)) return;
    const eventKey = worldNewsEventKey(tournament);
    if (result.won) {
        addWorldNews('champion', `champion:${eventKey}`, { actor: worldNewsPerson(candidate),
            tournament: worldNewsTournament(tournament), prize: result.prizeMoney });
        recordWorldNewsRankingChange(tournament);
    }
    const age = typeof getPlayerAge === 'function' ? getPlayerAge(candidate) :
        Number.isInteger(candidate.birthYear) ? currentDate.getFullYear() - candidate.birthYear : null;
    const rating = worldNewsRating(candidate);
    if (!(age > 0 && age <= WORLD_NEWS_CONFIG.youngAge) || rating === null || rating >= 85 || result.round > 4
        || typeof isMainOrderOfMeritRankingTournament !== 'function' || !isMainOrderOfMeritRankingTournament(tournament)) return;
    const state = worldNewsSeasonState();
    const key = worldNewsPersonKey(candidate);
    if (state.youngPlayers.includes(key)) return;
    const item = addWorldNews('youth', `youth:${state.season}:${key}`, { actor: worldNewsPerson(candidate), age,
        stage: result.won ? 'titleStage' : result.round === 2 ? 'final' : 'semifinal', tournament: worldNewsTournament(tournament) });
    if (item) state.youngPlayers.push(key);
}

function recordWorldNewsTeamTitle(team, tournament) {
    if (!team?.country || !Array.isArray(team.players) || !tournament?.name) return;
    addWorldNews('champion', `champion:${worldNewsEventKey(tournament)}`, { country: String(team.country),
        names: team.players.map(candidate => String(candidate.name || '')).join(', '), tournament: worldNewsTournament(tournament) });
}

function recordWorldNewsRankingChange(tournament = null) {
    const state = initWorldNews();
    const previous = state.leader;
    const next = getWorldNewsLeader(previous);
    if (!state.leaderInitialized) { state.leader = next; state.leaderInitialized = true; return null; }
    state.leader = next;
    if (!next || worldNewsPersonKey(next) === worldNewsPersonKey(previous)) return null;
    return addWorldNews('ranking', `ranking:${currentDate.getTime()}:${tournament ? worldNewsEventKey(tournament) : 'day'}:${worldNewsPersonKey(previous)}:${worldNewsPersonKey(next)}`, {
        actor: next, previous, amount: next.amount, tournament: tournament ? worldNewsTournament(tournament) : null
    });
}

function updateWorldNewsBadge() {
    if (typeof document === 'undefined') return;
    const badge = document.getElementById('world-news-badge');
    if (!badge) return;
    const count = initWorldNews().entries.filter(item => !item.read).length;
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.style.display = count ? 'inline-block' : 'none';
}

function getWorldNewsPresentation(item) {
    const data = item.data;
    const tournament = data.tournament ? (typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(data.tournament) : data.tournament.name) : '';
    const values = { ...data, name: data.actor?.name || '', opponent: data.opponent?.name || '', previous: data.previous?.name || '',
        tournament, amount: `£${Number(data.amount ?? data.prize ?? 0).toLocaleString('en-GB')}`,
        stage: trWorldNews(data.stage || 'semifinal'), unit: trWorldNews(data.unit === 'sets' ? 'sets' : 'legs') };
    if (data.country) {
        values.country = typeof getWorldCupCountryName === 'function' ? getWorldCupCountryName(data.country) : data.country;
        return { title: trWorldNews('teamTitle', values), body: trWorldNews('teamBody', values), tournament };
    }
    const title = trWorldNews(`${item.type}Title`, values);
    let body = trWorldNews(item.type === 'ranking' && !data.previous ? 'firstLeaderBody' : `${item.type}Body`, values);
    if (item.type === 'champion' && data.prize > 0) body += ` ${trWorldNews('prize', values)}`;
    if (item.type === 'ranking') body += ` ${trWorldNews(data.tournament ? 'afterTournament' : 'afterDate', values)}`;
    return { title, body, tournament };
}

function worldNewsDate(timestamp) {
    const locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[typeof currentLang === 'string' ? currentLang : 'en'];
    return new Date(timestamp).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

function getFilteredWorldNews() {
    return initWorldNews().entries.filter(item => worldNewsFilter === 'all'
        || (worldNewsFilter === 'unread' ? !item.read : item.type === worldNewsFilter));
}

function renderWorldNews() {
    const list = document.getElementById('world-news-list');
    if (!list) return;
    const state = initWorldNews();
    const unread = state.entries.filter(item => !item.read).length;
    const summary = document.getElementById('world-news-summary');
    if (summary) summary.textContent = `${trWorldNews('archive', { count: state.entries.length, date: worldNewsDate(state.since) })} · ${trWorldNews('unreadCount', { count: unread })}`;
    const filters = document.getElementById('world-news-filters');
    if (filters) filters.innerHTML = ['all', 'unread', 'upset', 'champion', 'youth', 'ranking'].map(filter =>
        `<button type="button" aria-pressed="${worldNewsFilter === filter}" onclick="showWorldNews('${filter}')">${escapeHtml(trWorldNews(filter))}</button>`).join('');
    const items = getFilteredWorldNews();
    const candidates = getWorldNewsPlayers();
    const playersByKey = new Map(candidates.map(candidate => [worldNewsPersonKey(candidate), candidate]));
    list.innerHTML = items.slice(0, worldNewsVisibleCount).map(item => {
        const text = getWorldNewsPresentation(item);
        const profiles = ['actor', 'opponent'].filter(role => item.data[role] && (playersByKey.has(worldNewsPersonKey(item.data[role]))
            || resolveWorldNewsPerson(item.data[role], candidates)))
            .map(role => `<button type="button" class="world-news-profile" onclick="openWorldNewsPlayer(${item.id}, '${role}')">${escapeHtml(trWorldNews('profile', { name: item.data[role].name }))}</button>`).join('');
        return `<article class="world-news-card news-${item.type}${item.read ? '' : ' news-unread'}">
            <div class="world-news-meta"><span class="world-news-category">${escapeHtml(trWorldNews(item.type))}</span><time>${escapeHtml(worldNewsDate(item.timestamp))}</time>${item.read ? '' : `<strong class="world-news-new">${escapeHtml(trWorldNews('fresh'))}</strong>`}</div>
            <h3>${escapeHtml(text.title)}</h3>
            ${text.tournament ? `<p class="world-news-event">${escapeHtml(text.tournament)}</p>` : ''}
            <p>${escapeHtml(text.body)}</p>
            ${profiles ? `<div class="world-news-profiles">${profiles}</div>` : ''}
        </article>`;
    }).join('') || `<p class="world-news-empty">${escapeHtml(trWorldNews(state.entries.length ? 'noMatches' : 'empty'))}</p>`;
    const more = document.getElementById('world-news-more');
    if (more) { more.hidden = items.length <= worldNewsVisibleCount; more.textContent = trWorldNews('more', { count: Math.max(0, items.length - worldNewsVisibleCount) }); }
    const read = document.getElementById('world-news-read');
    if (read) read.disabled = unread === 0;
    updateWorldNewsBadge();
}

function updateWorldNewsStrings() {
    const fields = { 'world-news-title': 'title', 'world-news-tile-title': 'title', 'world-news-tile-desc': 'tile',
        'world-news-scope': 'scope', 'world-news-back': 'back', 'world-news-read': 'markRead',
        'world-news-rules-title': 'rules', 'world-news-rules': 'criteria' };
    for (const [id, key] of Object.entries(fields)) {
        const node = document.getElementById(id);
        if (node) node.textContent = (id.endsWith('title') && key === 'title' ? '📰 ' : '') + trWorldNews(key);
    }
}

function refreshWorldNewsTranslations() {
    updateWorldNewsStrings();
    if (document.getElementById('screen-world-news')?.classList.contains('active')) renderWorldNews();
}

function showWorldNews(filter = 'all') {
    worldNewsFilter = ['all', 'unread', 'upset', 'champion', 'youth', 'ranking'].includes(filter) ? filter : 'all';
    worldNewsVisibleCount = WORLD_NEWS_CONFIG.pageSize;
    updateWorldNewsStrings();
    renderWorldNews();
    showScreen('screen-world-news');
}

function showMoreWorldNews() {
    worldNewsVisibleCount += WORLD_NEWS_CONFIG.pageSize;
    renderWorldNews();
}

function returnToWorldNews() {
    updateWorldNewsStrings();
    renderWorldNews();
    showScreen('screen-world-news');
}

function markWorldNewsRead() {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    const entries = initWorldNews().entries;
    if (!entries.some(item => !item.read)) return false;
    entries.forEach(item => { item.read = true; });
    renderWorldNews();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function openWorldNewsPlayer(id, role) {
    if (!['actor', 'opponent'].includes(role)) return false;
    const person = initWorldNews().entries.find(item => item.id === id)?.data[role];
    if (!person) return false;
    const candidate = resolveWorldNewsPerson(person);
    if (!candidate || typeof openPlayerProfile !== 'function') return false;
    openPlayerProfile(candidate.id, 'world-news');
    return true;
}
