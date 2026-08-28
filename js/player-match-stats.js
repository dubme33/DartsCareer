// Oficjalne single: pomiary z silnika lotka po lotce oraz oznaczone szacunki
// szybkiej symulacji. Przechowujemy sumy, bez historii poszczególnych rzutów.
const PLAYER_MATCH_STATS_TEXT = {
    pl: {
        season: 'Statystyki sezonu {year}', average: 'Średnia sezonu', doubles: 'Skuteczność podwójnych',
        oneEighties: 'Liczba 180', balance: 'Bilans sezonu', wins: 'Wygrane', losses: 'Przegrane',
        recent: 'Ostatnie 10 meczów', win: 'Wygrana', loss: 'Przegrana', legs: 'legi', sets: 'sety',
        recorded: 'Zarejestrowane mecze: {count} · od {date}', coverage: 'Dane z {count}/{total} meczów',
        estimatedCoverage: 'W tym szacowane: {count}',
        averageNote: 'Średnia sezonu to średnia arytmetyczna średnich meczowych. Mecze liczone lotka po lotce dostarczają dokładnych danych o podwójnych i 180. Szybka symulacja szacuje je z umiejętności, średniej i liczby legów. Znak ≈ oznacza wynik zawierający szacunki.',
        scope: 'Tylko oficjalne mecze singlowe. Starsze, niezarejestrowane mecze nie są uzupełniane. Te statystyki nie zmieniają OVR.',
        empty: 'Statystyki pojawią się po pierwszym zarejestrowanym meczu.', noRecent: 'Brak zarejestrowanych meczów.',
        recentNote: 'Od najnowszego, również z poprzedniego sezonu.', noData: 'Brak danych', noAttempts: 'Bez prób na podwójnej',
        recentBalance: '{wins} wygranych · {losses} przegranych', matchAverage: 'Śr. {average}'
    },
    en: {
        season: 'Season statistics {year}', average: 'Season average', doubles: 'Checkout percentage',
        oneEighties: '180s', balance: 'Season record', wins: 'Wins', losses: 'Losses',
        recent: 'Last 10 matches', win: 'Win', loss: 'Loss', legs: 'legs', sets: 'sets',
        recorded: 'Recorded matches: {count} · since {date}', coverage: 'Data from {count}/{total} matches',
        estimatedCoverage: 'Including estimated: {count}',
        averageNote: 'The season average is the arithmetic mean of match averages. Dart-by-dart matches provide exact checkout and 180 data. Quick simulation estimates them from skills, averages and legs played. The ≈ sign marks totals containing estimates.',
        scope: 'Official singles matches only. Older, unrecorded matches are not reconstructed. These statistics do not change OVR.',
        empty: 'Statistics will appear after the first recorded match.', noRecent: 'No recorded matches.',
        recentNote: 'Newest first, including the previous season.', noData: 'No data', noAttempts: 'No checkout attempts',
        recentBalance: '{wins} wins · {losses} losses', matchAverage: 'Avg. {average}'
    },
    de: {
        season: 'Saisonstatistik {year}', average: 'Saisonschnitt', doubles: 'Doppelquote',
        oneEighties: '180er', balance: 'Saisonbilanz', wins: 'Siege', losses: 'Niederlagen',
        recent: 'Letzte 10 Spiele', win: 'Sieg', loss: 'Niederlage', legs: 'Legs', sets: 'Sätze',
        recorded: 'Erfasste Spiele: {count} · seit {date}', coverage: 'Daten aus {count}/{total} Spielen',
        estimatedCoverage: 'Davon geschätzt: {count}',
        averageNote: 'Der Saisonschnitt ist das arithmetische Mittel der Spieldurchschnitte. Einzeln berechnete Würfe liefern genaue Doppel- und 180er-Daten. Die schnelle Simulation schätzt sie anhand von Fähigkeiten, Schnitt und gespielten Legs. ≈ kennzeichnet Werte mit Schätzungen.',
        scope: 'Nur offizielle Einzelspiele. Ältere, nicht erfasste Spiele werden nicht nachgebildet. Diese Statistiken ändern den OVR nicht.',
        empty: 'Statistiken erscheinen nach dem ersten erfassten Spiel.', noRecent: 'Keine erfassten Spiele.',
        recentNote: 'Neueste zuerst, einschließlich der vorherigen Saison.', noData: 'Keine Daten', noAttempts: 'Keine Doppelversuche',
        recentBalance: '{wins} Siege · {losses} Niederlagen', matchAverage: 'Schnitt {average}'
    },
    nl: {
        season: 'Seizoensstatistieken {year}', average: 'Seizoensgemiddelde', doubles: 'Checkoutpercentage',
        oneEighties: '180’s', balance: 'Seizoensbalans', wins: 'Gewonnen', losses: 'Verloren',
        recent: 'Laatste 10 wedstrijden', win: 'Winst', loss: 'Verlies', legs: 'legs', sets: 'sets',
        recorded: 'Vastgelegde wedstrijden: {count} · sinds {date}', coverage: 'Gegevens uit {count}/{total} wedstrijden',
        estimatedCoverage: 'Waarvan geschat: {count}',
        averageNote: 'Het seizoensgemiddelde is het rekenkundige gemiddelde van de wedstrijdgemiddelden. Wedstrijden per dart leveren exacte checkout- en 180-gegevens. Snelle simulatie schat ze op basis van vaardigheden, gemiddelden en gespeelde legs. ≈ markeert waarden met schattingen.',
        scope: 'Alleen officiële enkelwedstrijden. Oudere, niet vastgelegde wedstrijden worden niet gereconstrueerd. Deze statistieken veranderen de OVR niet.',
        empty: 'Statistieken verschijnen na de eerste vastgelegde wedstrijd.', noRecent: 'Geen vastgelegde wedstrijden.',
        recentNote: 'Nieuwste eerst, inclusief het vorige seizoen.', noData: 'Geen gegevens', noAttempts: 'Geen checkoutpogingen',
        recentBalance: '{wins} gewonnen · {losses} verloren', matchAverage: 'Gem. {average}'
    }
};

function trPlayerMatchStats(key, values = {}) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const template = PLAYER_MATCH_STATS_TEXT[language]?.[key] || PLAYER_MATCH_STATS_TEXT.pl[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function getOptionalMatchStat(value) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : null;
}

function getPlayerMatchStatsKey(candidate) {
    return String(candidate?.id || `${candidate?.sourceName || candidate?.name}|${candidate?.country}`);
}

function getQuickSimulatedMatchStats(p1, p2, result) {
    const legs1 = result?.p1LegsWon, legs2 = result?.p2LegsWon;
    if (!p1 || !p2 || p1.isBye || p2.isBye || !Number.isInteger(legs1) || !Number.isInteger(legs2)
        || legs1 < 0 || legs2 < 0 || legs1 + legs2 === 0) return null;
    const tournament = typeof activeTournament !== 'undefined' ? activeTournament : null;
    const seedText = JSON.stringify([currentDate.getTime(), tournament?.sourceName || tournament?.name,
        typeof tournamentRound !== 'undefined' ? tournamentRound : '',
        getPlayerMatchStatsKey(p1), getPlayerMatchStatsKey(p2), result.p1Avg, result.p2Avg, legs1, legs2]);
    let seed = 2166136261;
    for (let i = 0; i < seedText.length; i++) seed = Math.imul(seed ^ seedText.charCodeAt(i), 16777619) >>> 0;
    // Własny generator nie zużywa Math.random: dodatkowe statystyki nie mogą
    // zmieniać zwycięzców, drabinek, średnich ani rozwoju w kolejnych meczach.
    const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return (seed + 0.5) / 4294967296;
    };
    const limit = (value, min, max) => Math.max(min, Math.min(max, value));
    const totalLegs = legs1 + legs2;
    const estimate = (candidate, wonLegs, ownAverage, opponentAverage) => {
        const overall = limit(getOptionalMatchStat(candidate.overall ?? candidate.ovr) ?? 70, 40, 100);
        const scoring = limit(getOptionalMatchStat(candidate.scoring) ?? overall, 40, 100);
        const doubles = limit(getOptionalMatchStat(candidate.doubles) ?? overall, 40, 100);
        const average = limit(getOptionalMatchStat(ownAverage) ?? 60 + overall * 0.42, 45, 125);
        const otherAverage = limit(getOptionalMatchStat(opponentAverage) ?? average, 45, 125);
        const performance = average - (60 + overall * 0.42);
        // Prawdopodobieństwa bazują na calculateThrow. To model zbiorczy,
        // nie rekonstrukcja rzutów. Każdy wygrany leg ma dokładnie jeden checkout.
        const doubleChance = limit(doubles * 0.0045 + performance * 0.004, 0.12, 0.57);
        const tripleChance = limit(scoring * 0.0042 + performance * 0.003, 0.12, 0.54);
        const maxMisses = Math.max(1, Math.floor(1503 / average) - 8);
        const logMissChance = Math.log1p(-doubleChance);
        let doubleAttempts = wonLegs;
        for (let i = 0; i < wonLegs; i++) {
            doubleAttempts += Math.min(maxMisses, Math.floor(Math.log1p(-random()) / logMissChance));
        }
        // Przegrana do zera nie oznacza automatycznie braku prób na podwójnej.
        if (wonLegs === 0) {
            doubleAttempts = Math.floor(totalLegs * random() * limit(1 + (average - otherAverage) / 20, 0.1, 2));
        }
        const scoringVisits = limit(Math.round(501 / average) - 1, 2, 6);
        const losingVisits = Math.max(1, Math.round(scoringVisits * Math.min(1, average / otherAverage)));
        const oneEightyChance = tripleChance ** 3;
        let oneEighties = 0;
        for (let leg = 0; leg < totalLegs; leg++) {
            let legOneEighties = 0;
            const visits = leg < wonLegs ? scoringVisits : losingVisits;
            for (let visit = 0; visit < visits && legOneEighties < 2; visit++) {
                if (random() < oneEightyChance) legOneEighties++;
            }
            oneEighties += legOneEighties;
        }
        return { doubleHits: wonLegs, doubleAttempts, oneEighties, source: 'quick-simulation' };
    };
    return { p1Stats: estimate(p1, legs1, result.p1Avg, result.p2Avg),
        p2Stats: estimate(p2, legs2, result.p2Avg, result.p1Avg) };
}

function ensureSeasonMatchStats(candidate) {
    const season = initPlayerSeasonStats(candidate);
    if (!season) return null;
    if (!season.matchStats || season.matchStats.version !== 1) {
        season.matchStats = { version: 1, since: currentDate.getTime(), recordedKeys: [] };
    }
    const stats = season.matchStats;
    for (const field of ['played', 'wins', 'losses', 'averageTotal', 'averageCount', 'doubleHits', 'doubleAttempts', 'doubleMatches', 'oneEighties', 'oneEightyMatches', 'estimatedDoubleMatches', 'estimatedOneEightyMatches']) {
        stats[field] = getOptionalMatchStat(stats[field]) ?? 0;
    }
    stats.recordedKeys = Array.isArray(stats.recordedKeys) ? stats.recordedKeys.filter(key => typeof key === 'string') : [];
    if (!Number.isFinite(Number(stats.since))) stats.since = currentDate.getTime();
    return stats;
}

function getRecentPlayerMatches(candidate) {
    return (Array.isArray(candidate?.recentMatches) ? candidate.recentMatches : [])
        .filter(match => match && typeof match.opponentName === 'string' && Number.isFinite(match.timestamp)
            && Number.isFinite(match.scoreFor) && Number.isFinite(match.scoreAgainst) && typeof match.won === 'boolean')
        .slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
}

function recordPlayerMatchStats(p1, p2, result, options = {}) {
    const tournament = options.tournament || (typeof activeTournament !== 'undefined' ? activeTournament : null);
    if (!p1 || !p2 || p1.isBye || p2.isBye || !tournament?.name || tournament.isDoubles) return false;
    const players = getCareerProfilePlayers();
    const canonical = candidate => players.find(p => getPlayerMatchStatsKey(p) === getPlayerMatchStatsKey(candidate)) || candidate;
    p1 = canonical(p1); p2 = canonical(p2);
    if (getPlayerMatchStatsKey(p1) === getPlayerMatchStatsKey(p2)) return false;
    const score1 = getOptionalMatchStat(result?.p1Score), score2 = getOptionalMatchStat(result?.p2Score);
    if (!Number.isInteger(score1) || !Number.isInteger(score2) || score1 === score2) return false;
    const inGroups = typeof isGrandSlamGroupStageActive === 'function' && isGrandSlamGroupStageActive(tournament);
    const phase = options.phase || (inGroups ? 'groups' : `round:${options.round ?? (typeof tournamentRound !== 'undefined' ? tournamentRound : '')}`);
    const key = JSON.stringify([getCurrentSeasonYear(), tournament.sourceName || tournament.name,
        tournament.month, tournament.day, phase, [getPlayerMatchStatsKey(p1), getPlayerMatchStatsKey(p2)].sort()]);
    const format = options.format || {};
    let recorded = false;
    [[p1, p2, score1, score2, result.p1Avg, result.p1Stats], [p2, p1, score2, score1, result.p2Avg, result.p2Stats]]
        .forEach(([candidate, opponent, scoreFor, scoreAgainst, matchAverage, detail]) => {
            const stats = ensureSeasonMatchStats(candidate);
            if (!stats || stats.recordedKeys.includes(key)) return;
            const average = getOptionalMatchStat(matchAverage);
            const hits = getOptionalMatchStat(detail?.doubleHits), attempts = getOptionalMatchStat(detail?.doubleAttempts);
            const oneEighties = getOptionalMatchStat(detail?.oneEighties);
            const won = scoreFor > scoreAgainst;
            stats.recordedKeys.push(key);
            stats.played++;
            stats[won ? 'wins' : 'losses']++;
            if (average !== null) { stats.averageTotal += average; stats.averageCount++; }
            if (Number.isInteger(hits) && Number.isInteger(attempts) && hits <= attempts) {
                stats.doubleHits += hits; stats.doubleAttempts += attempts; stats.doubleMatches++;
                if (detail?.source === 'quick-simulation') stats.estimatedDoubleMatches++;
            }
            if (Number.isInteger(oneEighties)) {
                stats.oneEighties += oneEighties; stats.oneEightyMatches++;
                if (detail?.source === 'quick-simulation') stats.estimatedOneEightyMatches++;
            }
            candidate.recentMatches = [{ key, timestamp: currentDate.getTime(), opponentId: opponent.id || '',
                opponentName: opponent.name, opponentCountry: opponent.country || '', tournament: tournament.name,
                sourceTournament: tournament.sourceName || tournament.name, tournamentSpecialType: tournament.specialType || '',
                worldMastersEvent: tournament.worldMastersEvent || '', scoreFor, scoreAgainst, won,
                scoreType: format.type === 'sets' ? 'sets' : 'legs', average
            }, ...getRecentPlayerMatches(candidate)].slice(0, 10);
            recorded = true;
        });
    return recorded;
}

function recordCompletedSinglesMatch(match, tournament = activeTournament) {
    if (!match?.isTournament || match.isWorldCup || match.isDoubles || !match.stats) return false;
    const p1 = match.isSpectator ? match.spectatorP1 : player;
    const isSets = match.matchFormat?.type === 'sets';
    const result = { p1Score: isSets ? match.p1Sets : match.p1Legs, p2Score: isSets ? match.p2Sets : match.p2Legs };
    for (const side of ['p1', 'p2']) {
        const darts = getOptionalMatchStat(match.stats[`${side}TotalDarts`]);
        const accumulated = getOptionalMatchStat(match.stats[`${side}AccumulatedScore`]);
        const remaining = getOptionalMatchStat(match[`${side}Score`]);
        result[`${side}Avg`] = darts > 0 && accumulated !== null && remaining !== null
            ? (accumulated + 501 - remaining) / darts * 3 : null;
        result[`${side}Stats`] = { doubleHits: match.stats[`${side}DoubleHits`],
            doubleAttempts: match.stats[`${side}DoubleAttempts`], oneEighties: match.stats[`${side}OneEighties`] };
    }
    return recordPlayerMatchStats(p1, match.opponent, result, { tournament, format: match.matchFormat,
        round: match.spectatorRound ?? (typeof tournamentRound !== 'undefined' ? tournamentRound : undefined) });
}

function renderPlayerMatchStatistics(candidate) {
    const tr = trPlayerMatchStats, html = escapeHtml;
    const stats = ensureSeasonMatchStats(candidate);
    const season = candidate.seasonStats;
    const recent = getRecentPlayerMatches(candidate);
    const coverage = (count, estimated = 0) => html(tr('coverage', { count, total: stats.played }))
        + (estimated ? `<br>${html(tr('estimatedCoverage', { count: estimated }))}` : '');
    const card = (label, value, note = '') => `<div class="profile-ranking-card"><span>${html(tr(label))}</span><strong>${html(value)}</strong><small>${note}</small></div>`;
    const doubles = stats.doubleMatches && stats.doubleAttempts
        ? `${stats.estimatedDoubleMatches ? '≈ ' : ''}${(100 * stats.doubleHits / stats.doubleAttempts).toFixed(1)}%` : '—';
    const oneEighties = stats.oneEightyMatches ? `${stats.estimatedOneEightyMatches ? '≈ ' : ''}${stats.oneEighties}` : '—';
    const recentWins = recent.filter(match => match.won).length;
    const recentMarkup = recent.map(match => {
        const opponent = getCareerProfilePlayers().find(p => String(p.id) === String(match.opponentId));
        const tournament = { name: match.tournament, sourceName: match.sourceTournament,
            specialType: match.tournamentSpecialType, worldMastersEvent: match.worldMastersEvent };
        const name = typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : match.tournament;
        return `<li class="profile-recent-match"><span class="profile-match-result ${match.won ? 'profile-match-win' : 'profile-match-loss'}">${html(tr(match.won ? 'win' : 'loss'))}</span>
            <div><strong>${getFlagImg(opponent?.country || match.opponentCountry)} ${html(opponent?.name || match.opponentName)}</strong>
            <small>${formatPlayerProfileDate(match.timestamp)} · ${html(name)}</small></div>
            <div class="profile-match-score"><strong>${match.scoreFor}:${match.scoreAgainst}</strong><small>${html(tr(match.scoreType === 'sets' ? 'sets' : 'legs'))}${match.average === null ? '' : ` · ${html(tr('matchAverage', { average: Number(match.average).toFixed(2) }))}`}</small></div></li>`;
    }).join('');
    return `<section class="profile-panel"><h3>${html(tr('season', { year: season.year }))}</h3>
        ${stats.played ? `<p class="profile-stats-note">${html(tr('recorded', { count: stats.played, date: formatPlayerProfileDate(stats.since) }))}</p>` : `<p class="profile-empty">${html(tr('empty'))}</p>`}
        <div class="profile-stat-grid profile-match-stat-grid">
            ${card('average', stats.averageCount ? (stats.averageTotal / stats.averageCount).toFixed(2) : '—', coverage(stats.averageCount))}
            ${card('doubles', doubles, `${stats.doubleMatches ? (stats.doubleAttempts ? `${stats.doubleHits}/${stats.doubleAttempts}` : html(tr('noAttempts'))) : html(tr('noData'))}<br>${coverage(stats.doubleMatches, stats.estimatedDoubleMatches)}`)}
            ${card('oneEighties', oneEighties, coverage(stats.oneEightyMatches, stats.estimatedOneEightyMatches))}
            ${card('balance', `${stats.wins}–${stats.losses}`, `${html(tr('wins'))} / ${html(tr('losses'))}`)}
        </div><p class="profile-stats-note">${html(tr('averageNote'))}</p><p class="profile-stats-note">${html(tr('scope'))}</p>
    </section><section class="profile-panel"><h3>${html(tr('recent'))}</h3>
        ${recent.length ? `<p class="profile-recent-balance">${html(tr('recentBalance', { wins: recentWins, losses: recent.length - recentWins }))}</p><p class="profile-stats-note">${html(tr('recentNote'))}</p><ol class="profile-list">${recentMarkup}</ol>` : `<p class="profile-empty">${html(tr('noRecent'))}</p>`}
    </section>`;
}
