let playerProfileReturnRanking = 'main';
let currentPlayerProfileId = null;

const PLAYER_PROFILE_TRANSLATIONS = {
    pl: {
        winner: 'Zwycięzca', runnerUp: 'Finalista', semiFinalist: 'Półfinalista', quarterFinalist: 'Ćwierćfinalista',
        last16: '1/8 finału', last32: 'Ostatnia 32', last64: 'Ostatnia 64', last128: 'Ostatnia 128', lastRound: 'Ostatnia {round}',
        noPrize: 'bez nagrody', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'Brak rozegranych turniejów w tym sezonie.', noHighlights: 'Największe sukcesy pojawią się po rozegraniu turniejów.',
        photoAlt: 'Zdjęcie zawodnika', photoPlaceholder: 'ZAWODNIK', profile: 'PROFIL ZAWODNIKA', age: 'Wiek', years: '{age} lat',
        seasonHighestAverage: 'Najwyższa średnia sezonu', highlights: 'Największe sukcesy — sezon {year}', results: 'Wyniki wszystkich turniejów — sezon {year}', back: 'Wróć do rankingów'
    },
    en: {
        winner: 'Champion', runnerUp: 'Runner-up', semiFinalist: 'Semi-finalist', quarterFinalist: 'Quarter-finalist',
        last16: 'Last 16', last32: 'Last 32', last64: 'Last 64', last128: 'Last 128', lastRound: 'Last {round}',
        noPrize: 'no prize money', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'No tournaments played this season.', noHighlights: 'Major achievements will appear after tournaments are played.',
        photoAlt: 'Player photo', photoPlaceholder: 'PLAYER', profile: 'PLAYER PROFILE', age: 'Age', years: '{age} years old',
        seasonHighestAverage: 'Highest season average', highlights: 'Major achievements — season {year}', results: 'All tournament results — season {year}', back: 'Back to rankings'
    },
    de: {
        winner: 'Sieger', runnerUp: 'Finalist', semiFinalist: 'Halbfinalist', quarterFinalist: 'Viertelfinalist',
        last16: 'Letzte 16', last32: 'Letzte 32', last64: 'Letzte 64', last128: 'Letzte 128', lastRound: 'Letzte {round}',
        noPrize: 'kein Preisgeld', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'In dieser Saison wurden noch keine Turniere gespielt.', noHighlights: 'Die größten Erfolge erscheinen nach gespielten Turnieren.',
        photoAlt: 'Spielerfoto', photoPlaceholder: 'SPIELER', profile: 'SPIELERPROFIL', age: 'Alter', years: '{age} Jahre',
        seasonHighestAverage: 'Höchster Saisonschnitt', highlights: 'Größte Erfolge — Saison {year}', results: 'Alle Turnierergebnisse — Saison {year}', back: 'Zurück zu den Ranglisten'
    },
    nl: {
        winner: 'Winnaar', runnerUp: 'Finalist', semiFinalist: 'Halvefinalist', quarterFinalist: 'Kwartfinalist',
        last16: 'Laatste 16', last32: 'Laatste 32', last64: 'Laatste 64', last128: 'Laatste 128', lastRound: 'Laatste {round}',
        noPrize: 'geen prijzengeld', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'Dit seizoen zijn nog geen toernooien gespeeld.', noHighlights: 'De grootste prestaties verschijnen na gespeelde toernooien.',
        photoAlt: 'Spelersfoto', photoPlaceholder: 'SPELER', profile: 'SPELERS­PROFIEL', age: 'Leeftijd', years: '{age} jaar',
        seasonHighestAverage: 'Hoogste seizoensgemiddelde', highlights: 'Grootste prestaties — seizoen {year}', results: 'Alle toernooiresultaten — seizoen {year}', back: 'Terug naar de ranglijsten'
    }
};

function trPlayerProfile(key, values = {}) {
    const language = typeof currentLang === 'string' && PLAYER_PROFILE_TRANSLATIONS[currentLang] ? currentLang : 'pl';
    const template = PLAYER_PROFILE_TRANSLATIONS[language][key] || PLAYER_PROFILE_TRANSLATIONS.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function getPlayerProfileLocale() {
    return ({ pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' })[currentLang] || 'en-GB';
}

function getCurrentSeasonYear(referenceDate) {
    const sourceDate = referenceDate || (typeof currentDate !== 'undefined' ? currentDate : new Date());
    const date = sourceDate instanceof Date ? sourceDate : new Date(sourceDate);
    return Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
}

function getCareerProfilePlayers() {
    const candidates = [];
    if (typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)) candidates.push(...pdcPlayers);
    if (typeof player !== 'undefined' && player) candidates.push(player);

    const uniquePlayers = new Map();
    candidates.forEach(candidate => {
        if (!candidate || candidate.isBye) return;
        const key = candidate.id ? `id:${candidate.id}` : `name:${candidate.name || ''}`;
        if (!uniquePlayers.has(key)) uniquePlayers.set(key, candidate);
    });
    return [...uniquePlayers.values()];
}

function initPlayerSeasonStats(candidate, year = getCurrentSeasonYear()) {
    if (!candidate || candidate.isBye) return null;

    if (!candidate.seasonStats || Number(candidate.seasonStats.year) !== year) {
        candidate.seasonStats = { year, highestAvg: 0, results: [] };
    }

    if (!Array.isArray(candidate.seasonStats.results)) candidate.seasonStats.results = [];
    const highestAvg = Number(candidate.seasonStats.highestAvg);
    candidate.seasonStats.highestAvg = Number.isFinite(highestAvg) && highestAvg >= 0
        ? Number(highestAvg.toFixed(2))
        : 0;
    candidate.seasonStats.year = year;
    return candidate.seasonStats;
}

function initAllPlayerSeasonStats(year = getCurrentSeasonYear()) {
    getCareerProfilePlayers().forEach(candidate => initPlayerSeasonStats(candidate, year));
}

function resetAllPlayerSeasonStats(year = getCurrentSeasonYear()) {
    getCareerProfilePlayers().forEach(candidate => {
        candidate.seasonStats = { year, highestAvg: 0, results: [] };
    });
}

function recordSeasonHighestAverage(candidate, average) {
    const numericAverage = Number(average);
    if (!Number.isFinite(numericAverage) || numericAverage < 0) return false;

    const stats = initPlayerSeasonStats(candidate);
    if (!stats) return false;

    const roundedAverage = Number(numericAverage.toFixed(2));
    if (roundedAverage <= stats.highestAvg) return false;

    stats.highestAvg = roundedAverage;
    return true;
}

function getSeasonResultStage(round, won) {
    if (won) return trPlayerProfile('winner');

    const stages = {
        2: 'runnerUp',
        4: 'semiFinalist',
        8: 'quarterFinalist',
        16: 'last16',
        32: 'last32',
        64: 'last64',
        128: 'last128'
    };
    return stages[round] ? trPlayerProfile(stages[round]) : trPlayerProfile('lastRound', { round });
}

function recordSeasonTournamentResult(candidate, tournament, details = {}) {
    if (!candidate || candidate.isBye || !tournament || !tournament.name) return null;

    const stats = initPlayerSeasonStats(candidate);
    if (!stats) return null;

    const round = Math.max(2, Number(details.round) || 2);
    const won = Boolean(details.won);
    const prizeMoney = Math.max(0, Number(details.prizeMoney) || 0);
    const timestamp = (typeof currentDate !== 'undefined' && currentDate instanceof Date)
        ? currentDate.getTime()
        : Date.now();
    const key = `${stats.year}|${tournament.name}|${timestamp}`;

    if (stats.results.some(result => result.key === key)) return null;

    const result = {
        key,
        tournament: tournament.name,
        round,
        won,
        stage: typeof details.stage === 'string' ? details.stage : '',
        prizeMoney,
        timestamp
    };
    stats.results.push(result);
    return result;
}

function getRankingPosition(candidate, type) {
    const profilePlayers = [...getCareerProfilePlayers()];
    if (type === 'protour' && typeof refreshProTourOrderOfMerit === 'function') {
        refreshProTourOrderOfMerit(profilePlayers, currentDate);
    }
    const rankedPlayers = profilePlayers.sort((first, second) => {
        if (type === 'protour') return (second.proTourPrizeMoney || 0) - (first.proTourPrizeMoney || 0);
        if (type === 'pc') return (second.pcPrizeMoney || 0) - (first.pcPrizeMoney || 0);
        if (type === 'europeanTour') return typeof compareEuropeanTourOrderOfMerit === 'function'
            ? compareEuropeanTourOrderOfMerit(first, second)
            : (second.europeanTourPrizeMoney || 0) - (first.europeanTourPrizeMoney || 0);
        return (second.prizeMoney || 0) - (first.prizeMoney || 0);
    });
    const index = rankedPlayers.findIndex(row => samePlayer(row, candidate));
    return index === -1 ? null : index + 1;
}

function getGdlRankingPosition(candidate) {
    if (typeof gdlTable === 'undefined' || !Array.isArray(gdlTable) || gdlTable.length === 0) return null;

    const rankedTable = [...gdlTable].sort((first, second) => {
        if (second.points !== first.points) return second.points - first.points;
        const firstDiff = first.legsWon - first.legsLost;
        const secondDiff = second.legsWon - second.legsLost;
        if (secondDiff !== firstDiff) return secondDiff - firstDiff;
        return second.legsWon - first.legsWon;
    });
    const index = rankedTable.findIndex(row => samePlayer(row.player, candidate));
    return index === -1 ? null : index + 1;
}

function getSeasonHighlights(results) {
    const resultValue = result => (result.won ? 10000 : 1000 - Math.min(Number(result.round) || 1000, 999));
    return [...results]
        .sort((first, second) => resultValue(second) - resultValue(first) || second.timestamp - first.timestamp)
        .slice(0, 5);
}

function formatPlayerProfileDate(timestamp) {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(getPlayerProfileLocale());
}

function getPlayerProfilePhoto(candidate) {
    if (candidate && candidate.photo) return candidate.photo;
    if (typeof moddedAssets !== 'undefined' && moddedAssets.photos && candidate && candidate.name) {
        return moddedAssets.photos[candidate.name] || '';
    }
    return '';
}

function renderSeasonResult(result) {
    const tournamentName = typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(result.tournament)
        : result.tournament;
    const stage = result.stage && (result.tournament === 'Puchar Narodów' || result.tournament === 'World Cup of Darts') && typeof getWorldCupSeasonResultStage === 'function'
        ? getWorldCupSeasonResultStage(result.stage)
        : (result.stage || getSeasonResultStage(result.round, result.won));
    const prizeText = result.prizeMoney > 0 ? `£${result.prizeMoney.toLocaleString('en-GB')}` : trPlayerProfile('noPrize');
    return `<li class="profile-list-item">
        <div><strong>${escapeHtml(tournamentName)}</strong><span>${escapeHtml(stage)}</span></div>
        <small>${formatPlayerProfileDate(result.timestamp)} · ${prizeText}</small>
    </li>`;
}

function openPlayerProfile(playerId, rankingType = 'main') {
    const selectedPlayer = getCareerProfilePlayers().find(candidate => String(candidate.id) === String(playerId));
    if (!selectedPlayer) return;

    playerProfileReturnRanking = rankingType;
    currentPlayerProfileId = selectedPlayer.id;
    const stats = initPlayerSeasonStats(selectedPlayer);
    const results = [...stats.results].sort((first, second) => second.timestamp - first.timestamp);
    const highlights = getSeasonHighlights(results);
    const age = getPlayerAge(selectedPlayer);
    const overall = Math.round(Number(selectedPlayer.ovr ?? selectedPlayer.overall) || 0);
    const rankings = [
        [trPlayerProfile('orderOfMerit'), getRankingPosition(selectedPlayer, 'main')],
        [trPlayerProfile('proSeries'), getRankingPosition(selectedPlayer, 'protour')],
        [trPlayerProfile('playersCup'), getRankingPosition(selectedPlayer, 'pc')],
        ['European Tour OOM', getRankingPosition(selectedPlayer, 'europeanTour')],
        [trPlayerProfile('gdl'), getGdlRankingPosition(selectedPlayer)]
    ];

    const rankingMarkup = rankings.map(([label, position]) => `<div class="profile-ranking-card">
        <span>${label}</span><strong>${position ? `#${position}` : '—'}</strong>
    </div>`).join('');
    const resultsMarkup = results.length
        ? results.map(renderSeasonResult).join('')
        : `<p class="profile-empty">${trPlayerProfile('noResults')}</p>`;
    const highlightsMarkup = highlights.length
        ? highlights.map(renderSeasonResult).join('')
        : `<p class="profile-empty">${trPlayerProfile('noHighlights')}</p>`;

    const content = document.getElementById('player-profile-content');
    content.innerHTML = `<section class="player-profile-hero">
        <img id="player-profile-photo" class="player-profile-photo" alt="${escapeHtml(trPlayerProfile('photoAlt'))}">
        <div>
            <p class="profile-eyebrow">${trPlayerProfile('profile')}</p>
            <h2>${getFlagImg(selectedPlayer.country)} ${escapeHtml(selectedPlayer.name)}</h2>
            <p class="profile-subtitle">${trPlayerProfile('age')}: <strong>${age === null ? '—' : trPlayerProfile('years', { age })}</strong> · Overall: <strong>${overall}</strong></p>
        </div>
    </section>
    <section class="profile-stat-grid">
        ${rankingMarkup}
        <div class="profile-ranking-card profile-average-card"><span>${trPlayerProfile('seasonHighestAverage')}</span><strong>${stats.highestAvg > 0 ? stats.highestAvg.toFixed(2) : '—'}</strong></div>
    </section>
    <section class="profile-panel">
        <h3>${trPlayerProfile('highlights', { year: stats.year })}</h3>
        <ul class="profile-list">${highlightsMarkup}</ul>
    </section>
    <section class="profile-panel">
        <h3>${trPlayerProfile('results', { year: stats.year })}</h3>
        <ul class="profile-list">${resultsMarkup}</ul>
    </section>`;

    const photo = document.getElementById('player-profile-photo');
    const fallbackPhoto = `https://placehold.co/160x160/16213e/ffffff?text=${encodeURIComponent(trPlayerProfile('photoPlaceholder'))}`;
    photo.src = getPlayerProfilePhoto(selectedPlayer) || fallbackPhoto;
    photo.onerror = () => {
        photo.onerror = null;
        photo.src = fallbackPhoto;
    };
    updatePlayerProfileStaticStrings();
    showScreen('screen-player-profile');
}

function updatePlayerProfileStaticStrings() {
    const button = document.getElementById('player-profile-back');
    if (button) button.innerText = trPlayerProfile('back');
}

function refreshPlayerProfileTranslations() {
    if (currentPlayerProfileId !== null && document.getElementById('screen-player-profile')?.classList.contains('active')) {
        openPlayerProfile(currentPlayerProfileId, playerProfileReturnRanking);
        return;
    }
    updatePlayerProfileStaticStrings();
}

function closePlayerProfile() {
    showPdcRankings(playerProfileReturnRanking);
}
