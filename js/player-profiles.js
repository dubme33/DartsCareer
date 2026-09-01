let playerProfileReturnRanking = 'main';
let currentPlayerProfileId = null;
const PLAYER_CAREER_TITLES_VERSION = 1;
// winsByYear extends version 1 without re-importing its legacy trophy totals.

const PLAYER_PROFILE_TRANSLATIONS = {
    pl: {
        winner: 'Zwycięzca', runnerUp: 'Finalista', semiFinalist: 'Półfinalista', quarterFinalist: 'Ćwierćfinalista',
        last16: '1/8 finału', last32: 'Ostatnia 32', last64: 'Ostatnia 64', last128: 'Ostatnia 128', lastRound: 'Ostatnia {round}',
        noPrize: 'bez nagrody', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'Brak rozegranych turniejów w tym sezonie.', noHighlights: 'Największe sukcesy pojawią się po rozegraniu turniejów.',
        photoAlt: 'Zdjęcie zawodnika', photoPlaceholder: 'ZAWODNIK', profile: 'PROFIL ZAWODNIKA', age: 'Wiek', years: '{age} lat',
        seasonHighestAverage: 'Najwyższa średnia sezonu', highlights: 'Największe sukcesy — sezon {year}', results: 'Wyniki wszystkich turniejów — sezon {year}', back: 'Wróć do rankingów', tourCardHolder: 'POSIADACZ KARTY PDC', tourCardValid: 'ważna do końca {year}',
        careerTitles: 'Tytuły kariery', noCareerTitles: 'Brak zdobytych tytułów.', unknownTitleYear: 'rok nieznany'
    },
    en: {
        winner: 'Champion', runnerUp: 'Runner-up', semiFinalist: 'Semi-finalist', quarterFinalist: 'Quarter-finalist',
        last16: 'Last 16', last32: 'Last 32', last64: 'Last 64', last128: 'Last 128', lastRound: 'Last {round}',
        noPrize: 'no prize money', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'No tournaments played this season.', noHighlights: 'Major achievements will appear after tournaments are played.',
        photoAlt: 'Player photo', photoPlaceholder: 'PLAYER', profile: 'PLAYER PROFILE', age: 'Age', years: '{age} years old',
        seasonHighestAverage: 'Highest season average', highlights: 'Major achievements — season {year}', results: 'All tournament results — season {year}', back: 'Back to rankings', tourCardHolder: 'PDC TOUR CARD HOLDER', tourCardValid: 'valid through {year}',
        careerTitles: 'Career titles', noCareerTitles: 'No titles won yet.', unknownTitleYear: 'year unknown'
    },
    de: {
        winner: 'Sieger', runnerUp: 'Finalist', semiFinalist: 'Halbfinalist', quarterFinalist: 'Viertelfinalist',
        last16: 'Letzte 16', last32: 'Letzte 32', last64: 'Letzte 64', last128: 'Letzte 128', lastRound: 'Letzte {round}',
        noPrize: 'kein Preisgeld', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'In dieser Saison wurden noch keine Turniere gespielt.', noHighlights: 'Die größten Erfolge erscheinen nach gespielten Turnieren.',
        photoAlt: 'Spielerfoto', photoPlaceholder: 'SPIELER', profile: 'SPIELERPROFIL', age: 'Alter', years: '{age} Jahre',
        seasonHighestAverage: 'Höchster Saisonschnitt', highlights: 'Größte Erfolge — Saison {year}', results: 'Alle Turnierergebnisse — Saison {year}', back: 'Zurück zu den Ranglisten', tourCardHolder: 'PDC-TOUR-CARD-INHABER', tourCardValid: 'gültig bis Ende {year}',
        careerTitles: 'Karrieretitel', noCareerTitles: 'Noch keine Titel gewonnen.', unknownTitleYear: 'Jahr unbekannt'
    },
    nl: {
        winner: 'Winnaar', runnerUp: 'Finalist', semiFinalist: 'Halvefinalist', quarterFinalist: 'Kwartfinalist',
        last16: 'Laatste 16', last32: 'Laatste 32', last64: 'Laatste 64', last128: 'Laatste 128', lastRound: 'Laatste {round}',
        noPrize: 'geen prijzengeld', orderOfMerit: 'Order of Merit', proSeries: 'Pro Series', playersCup: 'Players Cup', gdl: 'GDL',
        noResults: 'Dit seizoen zijn nog geen toernooien gespeeld.', noHighlights: 'De grootste prestaties verschijnen na gespeelde toernooien.',
        photoAlt: 'Spelersfoto', photoPlaceholder: 'SPELER', profile: 'SPELERS­PROFIEL', age: 'Leeftijd', years: '{age} jaar',
        seasonHighestAverage: 'Hoogste seizoensgemiddelde', highlights: 'Grootste prestaties — seizoen {year}', results: 'Alle toernooiresultaten — seizoen {year}', back: 'Terug naar de ranglijsten', tourCardHolder: 'PDC TOUR CARD-HOUDER', tourCardValid: 'geldig tot eind {year}',
        careerTitles: 'Carrièretitels', noCareerTitles: 'Nog geen titels gewonnen.', unknownTitleYear: 'jaar onbekend'
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
        // Przed wyczyszczeniem starego sezonu przenosimy jego zwycięstwa do
        // trwałego rejestru kariery (ważne również dla starszych zapisów).
        if (candidate.seasonStats && typeof ensurePlayerCareerTitles === 'function') {
            ensurePlayerCareerTitles(candidate);
        }
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
        ensurePlayerCareerTitles(candidate);
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

function normalizePlayerCareerTitle(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
}

function getPlayerCareerTitleData(tournamentOrName) {
    const tournament = tournamentOrName && typeof tournamentOrName === 'object' ? tournamentOrName : null;
    const name = String(tournament?.name || tournamentOrName || '').trim();
    const sourceName = String(tournament?.sourceName || name).trim();
    return {
        key: normalizePlayerCareerTitle(sourceName || name),
        name,
        sourceName,
        specialType: tournament?.specialType || '',
        worldMastersEvent: tournament?.worldMastersEvent || ''
    };
}

function getPlayerCareerTitleYear(timestamp) {
    const value = Number(timestamp);
    if (!Number.isFinite(value) || value <= 0) return null;
    const year = new Date(value).getFullYear();
    return Number.isInteger(year) ? year : null;
}

function getPlayerCareerTitleYears(entry) {
    const years = {};
    let remaining = Math.max(1, Math.floor(Number(entry.count) || 1));
    if (entry.winsByYear && typeof entry.winsByYear === 'object') {
        Object.entries(entry.winsByYear).sort(([a], [b]) => Number(b) - Number(a)).forEach(([year, count]) => {
            const amount = Math.min(remaining, Math.max(0, Math.floor(Number(count) || 0)));
            if (!/^\d{4}$/.test(year) || !Number.isFinite(amount) || !amount) return;
            years[year] = amount;
            remaining -= amount;
        });
    } else {
        // Older saves only retained the first/last win. Never invent the
        // intervening years, or assign every historical title to the last year.
        [...new Set([entry.lastWonAt, entry.firstWonAt])].forEach(timestamp => {
            const year = getPlayerCareerTitleYear(timestamp);
            if (year === null || !remaining) return;
            years[year] = (years[year] || 0) + 1;
            remaining--;
        });
    }
    return years;
}

function upsertPlayerCareerTitle(titleList, titleData, count = 1, timestamp = 0, history = null) {
    if (!Array.isArray(titleList) || !titleData?.key) return null;
    const increment = Math.max(1, Math.floor(Number(count) || 1));
    const wonAt = Math.max(0, Number(timestamp) || 0);
    let entry = titleList.find(candidate => candidate?.key === titleData.key);
    if (!entry) {
        entry = { ...titleData, count: 0, firstWonAt: wonAt, lastWonAt: wonAt, winsByYear: {} };
        titleList.push(entry);
    }
    if (!entry.winsByYear) entry.winsByYear = getPlayerCareerTitleYears(entry);
    entry.count = Math.max(0, Math.floor(Number(entry.count) || 0)) + increment;
    const year = getPlayerCareerTitleYear(wonAt);
    const years = history ? getPlayerCareerTitleYears(history) : (year === null ? {} : { [year]: increment });
    Object.entries(years).forEach(([wonYear, amount]) => {
        entry.winsByYear[wonYear] = (entry.winsByYear[wonYear] || 0) + amount;
    });
    if (titleData.name) entry.name = titleData.name;
    if (titleData.sourceName) entry.sourceName = titleData.sourceName;
    if (titleData.specialType) entry.specialType = titleData.specialType;
    if (titleData.worldMastersEvent) entry.worldMastersEvent = titleData.worldMastersEvent;
    const firstWonAt = Math.max(0, Number(history?.firstWonAt) || wonAt);
    if (!entry.firstWonAt || (firstWonAt && firstWonAt < entry.firstWonAt)) entry.firstWonAt = firstWonAt;
    if (wonAt > (Number(entry.lastWonAt) || 0)) entry.lastWonAt = wonAt;
    return entry;
}

function sanitisePlayerCareerTitles(candidate) {
    const mergedTitles = [];
    (Array.isArray(candidate?.careerTitles) ? candidate.careerTitles : []).forEach(rawEntry => {
        const entry = rawEntry && typeof rawEntry === 'object' ? rawEntry : { name: rawEntry };
        const titleData = getPlayerCareerTitleData({
            name: entry.name,
            sourceName: entry.sourceName || entry.key || entry.name,
            specialType: entry.specialType,
            worldMastersEvent: entry.worldMastersEvent
        });
        upsertPlayerCareerTitle(mergedTitles, titleData, entry.count, entry.lastWonAt || entry.firstWonAt, entry);
    });
    candidate.careerTitles = mergedTitles;
    return mergedTitles;
}

function addPlayerCareerTitle(candidate, tournamentOrName, timestamp = 0, count = 1) {
    if (!candidate || candidate.isBye) return null;
    if (!Array.isArray(candidate.careerTitles)) candidate.careerTitles = [];
    return upsertPlayerCareerTitle(candidate.careerTitles, getPlayerCareerTitleData(tournamentOrName), count, timestamp);
}

function recoverPlayerCareerTitleYears(candidate) {
    const titles = candidate.careerTitles.filter(title =>
        Object.values(title.winsByYear).reduce((sum, amount) => sum + amount, 0) < title.count);
    if (!titles.length) return;
    const aliases = new Map();
    titles.forEach(title => {
        const tournament = getPlayerCareerTitleTournament(title);
        [title.key, title.name, title.sourceName, tournament.name, tournament.sourceName].filter(Boolean)
            .forEach(name => aliases.set(normalizePlayerCareerTitle(name), title));
    });
    const sources = [
        (Array.isArray(candidate.seasonStats?.results) ? candidate.seasonStats.results : [])
            .filter(result => result?.won && result.careerTitleRecorded),
        (Array.isArray(candidate.careerChronicle) ? candidate.careerChronicle : [])
            .filter(event => event?.type === 'trophy')
    ];
    sources.forEach(events => {
        const evidence = new Map();
        const seen = new Set();
        events.forEach(event => {
            const title = aliases.get(normalizePlayerCareerTitle(event.sourceTournament || event.tournament))
                || aliases.get(normalizePlayerCareerTitle(event.tournament));
            const year = getPlayerCareerTitleYear(event.timestamp);
            if (!title || year === null) return;
            const key = `${title.key}|${event.timestamp}`;
            if (seen.has(key)) return;
            seen.add(key);
            if (!evidence.has(title)) evidence.set(title, {});
            const years = evidence.get(title);
            years[year] = (years[year] || 0) + 1;
        });
        evidence.forEach((years, title) => {
            let remaining = title.count - Object.values(title.winsByYear).reduce((sum, amount) => sum + amount, 0);
            Object.entries(years).forEach(([year, amount]) => {
                // These sources describe the same wins, so take the greater
                // known count, without increasing the career total.
                const extra = Math.min(remaining, Math.max(0, amount - (title.winsByYear[year] || 0)));
                if (extra > 0) title.winsByYear[year] = (title.winsByYear[year] || 0) + extra;
                remaining -= extra;
            });
        });
    });
}

function ensurePlayerCareerTitles(candidate) {
    if (!candidate || candidate.isBye) return [];
    const titles = sanitisePlayerCareerTitles(candidate);
    const seasonResults = Array.isArray(candidate.seasonStats?.results) ? candidate.seasonStats.results : [];

    if (candidate.careerTitlesVersion !== PLAYER_CAREER_TITLES_VERSION) {
        const legacyTrophies = Array.isArray(candidate.careerStats?.trophies)
            ? candidate.careerStats.trophies.filter(Boolean)
            : [];
        if (legacyTrophies.length) {
            legacyTrophies.forEach(trophy => addPlayerCareerTitle(candidate, trophy));
            // Lista pucharów własnego zawodnika obejmowała już również jego
            // zwycięstwa z bieżącego sezonu, więc nie naliczamy ich drugi raz.
            seasonResults.filter(result => result?.won).forEach(result => { result.careerTitleRecorded = true; });
        }
        candidate.careerTitlesVersion = PLAYER_CAREER_TITLES_VERSION;
    }

    seasonResults.forEach(result => {
        if (!result?.won || result.careerTitleRecorded) return;
        addPlayerCareerTitle(candidate, {
            name: result.tournament,
            sourceName: result.sourceTournament || result.tournament,
            specialType: result.tournamentSpecialType || '',
            worldMastersEvent: result.worldMastersEvent || ''
        }, result.timestamp);
        result.careerTitleRecorded = true;
    });
    recoverPlayerCareerTitleYears(candidate);
    return titles;
}

function getPlayerCareerTitles(candidate) {
    return [...ensurePlayerCareerTitles(candidate)].sort((first, second) =>
        (Number(second.count) || 0) - (Number(first.count) || 0)
        || (Number(second.lastWonAt) || 0) - (Number(first.lastWonAt) || 0)
        || String(first.name || '').localeCompare(String(second.name || ''), getPlayerProfileLocale()));
}

function getPlayerCareerTitleTournament(title) {
    const currentTournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(tournament => getPlayerCareerTitleData(tournament).key === title.key)
        : null;
    return currentTournament || {
        name: title.name,
        sourceName: title.sourceName,
        specialType: title.specialType,
        worldMastersEvent: title.worldMastersEvent
    };
}

function getPlayerCareerTitlePremierLeagueStage(tournament) {
    const names = `${tournament.name || ''} ${tournament.sourceName || ''}`;
    if (!/premier\s+league|global\s+darts\s+league/i.test(names)
        || /qualif|kwalifikac|q.?school/i.test(`${names} ${tournament.specialType || ''}`)) return null;
    if (/\bfinals?\b|\bplay[\s-]*offs?\b/i.test(names)) return 'finals';
    return /\bnight\s*\d+\b|\bwiecz[oó]r\s*\d+\b/i.test(names) ? 'night' : null;
}

function getPlayerCareerTitleDisplayName(title) {
    const displayTarget = getPlayerCareerTitleTournament(title);
    if (getPlayerCareerTitlePremierLeagueStage(displayTarget) === 'finals') {
        return 'Premier League - Finals Night';
    }
    return typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(displayTarget)
        : (displayTarget.name || title.sourceName || '');
}

function getPlayerCareerTitleSeries(title) {
    const tournament = getPlayerCareerTitleTournament(title);
    const names = `${tournament.name} ${tournament.sourceName || ''} ${tournament.specialType || ''}`;
    // Finals and qualifiers stay separate from the series win counters.
    if (/final|play[\s-]*off|qualifier|kwalifikac|q-school|qschool/i.test(names)) return null;
    if (getPlayerCareerTitlePremierLeagueStage(tournament) === 'night') {
        return 'Premier League - Nights';
    }
    if (typeof isPlayersChampionshipTournament === 'function' && isPlayersChampionshipTournament(tournament)) {
        return 'Players Championship';
    }
    if (typeof isEuropeanTourTournament === 'function' && isEuropeanTourTournament(tournament)) {
        return 'European Tour';
    }
    return null;
}

function getPlayerCareerTitleRows(titles) {
    const series = new Map();
    const individual = [];
    titles.forEach(title => {
        const seriesName = getPlayerCareerTitleSeries(title);
        if (seriesName) {
            series.set(seriesName, (series.get(seriesName) || 0) + title.count);
            return;
        }
        const name = getPlayerCareerTitleDisplayName(title);
        let remaining = title.count;
        Object.entries(title.winsByYear).forEach(([year, count]) => {
            for (let index = 0; index < count; index++) individual.push({ name, year: Number(year), count: 1 });
            remaining -= count;
        });
        if (remaining > 0) individual.push({ name, year: null, count: remaining });
    });
    const compareNames = (a, b) => a.name.localeCompare(b.name, getPlayerProfileLocale());
    return [
        ...[...series].map(([name, count]) => ({ name, count, series: true }))
            .sort((a, b) => b.count - a.count || compareNames(a, b)),
        ...individual.sort((a, b) => (b.year || 0) - (a.year || 0) || compareNames(a, b))
    ];
}

function renderPlayerCareerTitles(candidate) {
    const titles = getPlayerCareerTitles(candidate);
    const totalTitles = titles.reduce((sum, title) => sum + Math.max(0, Number(title.count) || 0), 0);
    const listMarkup = titles.length
        ? getPlayerCareerTitleRows(titles).map(title => {
            const year = title.series ? '' : title.year
                ? ` <time datetime="${title.year}">${title.year}</time>`
                : ` <small class="profile-career-title-unknown">— ${escapeHtml(trPlayerProfile('unknownTitleYear'))}</small>`;
            const count = title.series || title.count > 1 ? `<strong>×${title.count}</strong>` : '';
            return `<li><span>${escapeHtml(title.name)}${year}</span>${count}</li>`;
        }).join('')
        : `<li class="profile-career-titles-empty">${escapeHtml(trPlayerProfile('noCareerTitles'))}</li>`;
    return `<aside class="profile-career-titles">
        <h3><span>🏆 ${escapeHtml(trPlayerProfile('careerTitles'))}</span><strong>${totalTitles}</strong></h3>
        <ul>${listMarkup}</ul>
    </aside>`;
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
    if (won) ensurePlayerCareerTitles(candidate);

    const result = {
        key,
        tournament: tournament.name,
        sourceTournament: tournament.sourceName || tournament.name,
        tournamentSpecialType: tournament.specialType || '',
        worldMastersEvent: tournament.worldMastersEvent || '',
        round,
        won,
        stage: typeof details.stage === 'string' ? details.stage : '',
        prizeMoney,
        timestamp
    };
    stats.results.push(result);
    if (typeof recordTournamentFinanceResult === 'function') recordTournamentFinanceResult(candidate, tournament, result);
    if (typeof recordSponsorGoalTournament === 'function') recordSponsorGoalTournament(candidate, tournament, result);
    if (won) {
        addPlayerCareerTitle(candidate, tournament, timestamp);
        result.careerTitleRecorded = true;
        if (typeof recordCareerChampion === 'function' && !isCareerTeamChampionship(tournament)) {
            recordCareerChampion(tournament, candidate, stats.year);
        }
        if (typeof initializePlayerTraits === 'function') initializePlayerTraits(candidate);
    }
    if (typeof recordWorldNewsTournament === 'function') recordWorldNewsTournament(candidate, tournament, result);
    return result;
}

function getRankingPosition(candidate, type) {
    if (typeof getCachedRankedPlayers === 'function') {
        const index = getCachedRankedPlayers(type).findIndex(row => samePlayer(row, candidate));
        return index === -1 ? null : index + 1;
    }
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
        return moddedAssets.photos[candidate.name] || moddedAssets.photos[candidate.sourceName] || '';
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
    const tourCardExpirySeason = Number(selectedPlayer.tourCardExpiryYear) - 1;
    const tourCardMarkup = selectedPlayer.hasTourCard === true
        ? `<p style="display:inline-block; margin:8px 0 0; padding:5px 10px; border-radius:14px; background:#8e44ad; color:white; font-size:12px; font-weight:bold;">🎫 ${trPlayerProfile('tourCardHolder')}${Number.isInteger(tourCardExpirySeason) ? ` · ${trPlayerProfile('tourCardValid', { year: tourCardExpirySeason })}` : ''}</p>`
        : '';
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
    const careerTitlesMarkup = renderPlayerCareerTitles(selectedPlayer);

    const content = document.getElementById('player-profile-content');
    content.innerHTML = `<section class="player-profile-hero">
        <img id="player-profile-photo" class="player-profile-photo" alt="${escapeHtml(trPlayerProfile('photoAlt'))}">
        <div class="player-profile-identity">
            <p class="profile-eyebrow">${trPlayerProfile('profile')}</p>
            <h2>${getFlagImg(selectedPlayer.country)} ${escapeHtml(selectedPlayer.name)}</h2>
            <p class="profile-subtitle">${trPlayerProfile('age')}: <strong>${age === null ? '—' : trPlayerProfile('years', { age })}</strong> · Overall: <strong>${overall}</strong></p>
            ${tourCardMarkup}
        </div>
        ${careerTitlesMarkup}
    </section>
    <section class="profile-stat-grid">
        ${rankingMarkup}
        <div class="profile-ranking-card profile-average-card"><span>${trPlayerProfile('seasonHighestAverage')}</span><strong>${stats.highestAvg > 0 ? stats.highestAvg.toFixed(2) : '—'}</strong></div>
    </section>
    ${typeof renderPlayerTraitProfile === 'function' ? renderPlayerTraitProfile(selectedPlayer) : ''}
    ${typeof renderPlayerMatchStatistics === 'function' ? renderPlayerMatchStatistics(selectedPlayer) : ''}
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
    if (button) button.innerText = playerProfileReturnRanking === 'world-news' && typeof trWorldNews === 'function'
        ? trWorldNews('backToNews') : trPlayerProfile('back');
}

function refreshPlayerProfileTranslations() {
    if (currentPlayerProfileId !== null && document.getElementById('screen-player-profile')?.classList.contains('active')) {
        openPlayerProfile(currentPlayerProfileId, playerProfileReturnRanking);
        return;
    }
    updatePlayerProfileStaticStrings();
}

function closePlayerProfile() {
    if (playerProfileReturnRanking === 'world-news' && typeof returnToWorldNews === 'function') {
        returnToWorldNews();
        return;
    }
    showPdcRankings(playerProfileReturnRanking);
}
