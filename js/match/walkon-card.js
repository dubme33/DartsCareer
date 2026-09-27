const WALKON_CARD_TRANSLATIONS = {
    pl: { age: 'Wiek', rank: 'Ranking OOM', seed: 'Rozstawienie', unseeded: '—', titles: 'Tytuły',
        careerTitles: 'Tytuły w tej karierze', best: 'Najlepszy wynik w sezonie', appearances: 'Występy w sezonie',
        friendly: 'Mecz towarzyski', average: 'Rekord średniej', matches: 'Mecze w sezonie', skip: 'Pomiń zapowiedzi',
        season: 'Sezon {year}', winner: 'Zwycięzca' },
    en: { age: 'Age', rank: 'World ranking', seed: 'Seeding', unseeded: '—', titles: 'Titles',
        careerTitles: 'Titles in this career', best: 'Season best', appearances: 'Season appearances',
        friendly: 'Exhibition match', average: 'Best average', matches: 'Season matches', skip: 'Skip walk-ons',
        season: 'Season {year}', winner: 'Winner' },
    de: { age: 'Alter', rank: 'Weltrangliste', seed: 'Setzposition', unseeded: '—', titles: 'Titel',
        careerTitles: 'Titel in dieser Karriere', best: 'Bestes Saisonergebnis', appearances: 'Saisonteilnahmen',
        friendly: 'Freundschaftsspiel', average: 'Bester Average', matches: 'Saisonspiele', skip: 'Walk-ons überspringen',
        season: 'Saison {year}', winner: 'Sieger' },
    nl: { age: 'Leeftijd', rank: 'Wereldranglijst', seed: 'Plaatsing', unseeded: '—', titles: 'Titels',
        careerTitles: 'Titels in deze carrière', best: 'Beste seizoensresultaat', appearances: 'Deelnames dit seizoen',
        friendly: 'Oefenwedstrijd', average: 'Beste gemiddelde', matches: 'Seizoenwedstrijden', skip: 'Walk-ons overslaan',
        season: 'Seizoen {year}', winner: 'Winnaar' }
};

function trWalkonCard(key, values = {}) {
    const language = typeof currentLang === 'string' && WALKON_CARD_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    return (WALKON_CARD_TRANSLATIONS[language][key] || WALKON_CARD_TRANSLATIONS.pl[key] || key)
        .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
}

function getWalkonTournamentScope(tournament) {
    const title = getPlayerCareerTitleData(tournament);
    const series = getPlayerCareerTitleSeries(title);
    return { key: series ? `series:${series}` : `event:${title.key}`,
        name: series || (typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : title.name) };
}

function getWalkonPlayerCardData(candidate, tournament = null) {
    const year = currentDate.getFullYear();
    const scope = tournament ? getWalkonTournamentScope(tournament) : null;
    const matchesScope = entry => !scope || getWalkonTournamentScope(entry).key === scope.key;
    const allTitles = getPlayerProfileCareerTitles(candidate);
    const titles = allTitles.filter(matchesScope);
    const titleCount = titles.reduce((total, title) => total + (Number(title.count) || 0), 0);
    const years = [...new Set(titles.flatMap(title => Object.keys(title.winsByYear || {})))].sort((a, b) => Number(a) - Number(b));
    // Historical champion lists cover individual events, not every tour. Do not
    // present the simulated tour total as a player's complete real-life record.
    const hasHistoricalCoverage = typeof historicalTournamentChampions !== 'undefined'
        && historicalTournamentChampions.some(history => {
            const event = typeof findHistoricalCareerTournament === 'function' ? findHistoricalCareerTournament(history) : null;
            return matchesScope(event || { name: history.tournament, specialType: history.specialType });
        });
    const season = Number(candidate?.seasonStats?.year) === year ? candidate.seasonStats : null;
    const results = (Array.isArray(season?.results) ? season.results : []).filter(result => matchesScope({
        name: result.tournament, sourceName: result.sourceTournament || result.tournament,
        specialType: result.tournamentSpecialType, worldMastersEvent: result.worldMastersEvent
    }));
    // A tournament can have several walk-ons, but it counts as one appearance.
    const appearances = new Set(results.map(result => {
        const date = new Date(result.timestamp);
        return `${result.sourceTournament || result.tournament}|${Number.isNaN(date.getTime()) ? result.key : date.toDateString()}`;
    }));
    if (tournament) appearances.add(`${tournament.sourceName || tournament.name}|${currentDate.toDateString()}`);
    const best = [...results].filter(result => result.won || Number(result.round) > 0)
        .sort((a, b) => (a.won ? 0 : Number(a.round)) - (b.won ? 0 : Number(b.round)))[0];
    const bestText = best ? getSeasonResultStage(best.round, best.won) : '—';
    const average = Number(candidate?.careerStats?.highestAvg) || Number(season?.highestAvg) || 0;
    return {
        event: scope?.name || trWalkonCard('friendly'),
        titleLabel: trWalkonCard(hasHistoricalCoverage ? 'titles' : 'careerTitles'),
        titleCount, years: years.join(' · '),
        bestLabel: trWalkonCard(tournament ? 'best' : 'average'),
        best: tournament ? bestText : (average > 0 ? average.toFixed(2) : '—'),
        appearancesLabel: trWalkonCard(tournament ? 'appearances' : 'matches'),
        appearances: tournament ? appearances.size : Math.max(0, Number(season?.matchStats?.played) || 0),
        season: trWalkonCard('season', { year })
    };
}

function setWalkonPlayerPhoto(candidate) {
    const photo = document.getElementById('walkon-player-photo');
    const fallback = document.getElementById('walkon-player-monogram');
    if (!photo || !fallback) return;
    const name = String(candidate?.name || '');
    fallback.textContent = name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join('');
    photo.alt = name;
    const custom = typeof getPlayerProfilePhoto === 'function' ? getPlayerProfilePhoto(candidate) : candidate?.photo;
    const bundled = candidate?.sourceName || candidate?.name;
    const sources = [...new Set([custom, bundled ? `zdjecia/${encodeURIComponent(bundled)}.png` : ''].filter(Boolean))];
    photo.hidden = true;
    let index = 0;
    photo.onload = () => { photo.hidden = false; fallback.hidden = true; };
    photo.onerror = () => {
        photo.hidden = true;
        fallback.hidden = false;
        if (++index < sources.length) photo.src = sources[index];
    };
    fallback.hidden = false;
    if (sources.length) photo.src = sources[0];
    else photo.removeAttribute('src');
}

function getWalkonCountryFlagSource(country) {
    const code = typeof flags !== 'undefined' ? flags[String(country || '').trim()] : '';
    return /^[a-z]{2}(?:-[a-z]{3})?$/.test(code || '') ? `assets/flags/${code}.svg` : '';
}

function renderWalkonPlayerCard(candidate) {
    const card = document.getElementById('walkon-player-card');
    if (!card || !candidate) return;
    const tournament = typeof currentMatch !== 'undefined' && currentMatch?.isTournament
        && typeof activeTournament !== 'undefined' ? activeTournament : null;
    const data = getWalkonPlayerCardData(candidate, tournament);
    const set = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
    const age = typeof getPlayerAge === 'function' ? getPlayerAge(candidate) : null;
    const rank = typeof getMatchIntroMainOomRank === 'function' ? getMatchIntroMainOomRank(candidate) : null;
    const seed = tournament && typeof getTournamentSeedNumber === 'function' ? getTournamentSeedNumber(candidate, tournament) : null;
    set('walkon-age-label', trWalkonCard('age'));
    set('walkon-age', Number.isInteger(age) && age >= 0 ? age : '—');
    set('walkon-rank-label', trWalkonCard('rank'));
    set('walkon-rank', rank > 0 && rank < Number.MAX_SAFE_INTEGER ? rank : '—');
    set('walkon-seed-label', trWalkonCard('seed'));
    set('walkon-seed', seed || trWalkonCard('unseeded'));
    const nickname = document.getElementById('walkon-nickname');
    if (nickname) {
        nickname.textContent = typeof getPlayerNickname === 'function'
            ? getPlayerNickname(candidate) : (candidate.nickname ?? candidate.nickName ?? '');
        nickname.hidden = !nickname.textContent;
    }
    const flag = document.getElementById('walkon-player-flag');
    if (flag) {
        const localSource = getWalkonCountryFlagSource(candidate.country);
        flag.innerHTML = localSource ? `<img src="${localSource}" alt="">` : '';
        const flagImage = flag.querySelector?.('img');
        if (flagImage) flagImage.alt = candidate.country || '';
    }
    set('walkon-event-name', data.event);
    set('walkon-titles-label', data.titleLabel);
    set('walkon-titles', data.titleCount > 0 ? `${data.titleCount}× ${trWalkonCard('winner')}` : '0');
    set('walkon-title-years', data.years);
    set('walkon-best-label', data.bestLabel);
    set('walkon-best', data.best);
    set('walkon-appearances-label', data.appearancesLabel);
    set('walkon-appearances', data.appearances);
    set('walkon-season', data.season);
    set('walkon-card-skip', trWalkonCard('skip'));
    setWalkonPlayerPhoto(candidate);
}
