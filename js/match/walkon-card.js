const WALKON_CARD_TRANSLATIONS = {
    pl: { age: 'Wiek', rank: 'Ranking OOM', seed: 'Rozstawienie', unseeded: '—', titles: 'Tytuły',
        careerTitles: 'Tytuły w tej karierze', best: 'Najlepszy wynik w sezonie', appearances: 'Występy w sezonie',
        friendly: 'Mecz towarzyski', average: 'Rekord średniej', matches: 'Mecze w sezonie', skip: 'Pomiń oba wejścia', skipCurrent: 'Pomiń ten walk-on', playMusic: '▶ Włącz muzykę',
        season: 'Sezon {year}', winner: 'Zwycięzca', fullscreen: 'Pełny ekran', exitFullscreen: 'Zamknij pełny ekran',
        leagueTable: 'Tabela {league}', leaguePlayoffs: 'TOP 4 · play-offy', leagueColumns: 'Pkt · bilans legów',
        stakes: 'Stawka meczu', rivalry: 'Historia rywalizacji', groupMatch: 'Walka o wyjście z grupy',
        groupDetail: 'Wynik tego meczu wpłynie na układ grupy.', qualifierFinal: 'Decydujący mecz kwalifikacji',
        winTitle: 'Wygrana daje tytuł', leagueNightWin: 'Wygrana daje zwycięstwo w tej nocy ligowej', titlePrize: 'Nagroda za zwycięstwo: £{amount}',
        winAdvance: 'Wygrana daje awans do: {stage}', leaguePosition: 'Miejsce #{rank} w tabeli ligowej',
        leagueGap: 'Miejsce #{rank} · {gap} pkt do TOP 4', leagueTie: 'Miejsce #{rank} · remis punktowy z TOP 4, liczą się legi',
        leagueElimination: 'Porażka zakończy szanse na play-offy',
        oomGap: 'Do TOP 16 OOM brakuje £{amount}', oomProjection: 'Awans zapewni co najmniej £{amount}; przy obecnym progu wystarczy to na TOP 16 OOM',
        oomExpiring: '£{amount} z tego turnieju wygaśnie w OOM {date}',
        firstMeeting: 'Pierwszy oficjalny pojedynek tych zawodników', noPreviousOfficial: 'Brak wcześniejszych oficjalnych pojedynków', h2h: 'Bilans H2H: {wins} : {losses}',
        rivalryWinStreak: 'Seria zwycięstw z tym rywalem: {count}', rivalryLossStreak: 'Seria porażek z tym rywalem: {count}',
        lastMeeting: 'Ostatnio: {event} · {score}', lastFinal: 'Ostatni wspólny finał: {event} · {score}' },
    en: { age: 'Age', rank: 'World ranking', seed: 'Seeding', unseeded: '—', titles: 'Titles',
        careerTitles: 'Titles in this career', best: 'Season best', appearances: 'Season appearances',
        friendly: 'Exhibition match', average: 'Best average', matches: 'Season matches', skip: 'Skip both walk-ons', skipCurrent: 'Skip this walk-on', playMusic: '▶ Play music',
        season: 'Season {year}', winner: 'Winner', fullscreen: 'Full screen', exitFullscreen: 'Exit full screen',
        leagueTable: '{league} standings', leaguePlayoffs: 'TOP 4 · play-offs', leagueColumns: 'Pts · leg difference',
        stakes: 'Match stakes', rivalry: 'Head-to-head story', groupMatch: 'Group qualification at stake',
        groupDetail: 'This result will affect the group standings.', qualifierFinal: 'Decisive qualifier match',
        winTitle: 'Victory wins the title', leagueNightWin: 'Victory wins this league night', titlePrize: 'Winner prize: £{amount}',
        winAdvance: 'Victory advances to: {stage}', leaguePosition: 'League position #{rank}',
        leagueGap: 'Position #{rank} · {gap} pts behind the TOP 4', leagueTie: 'Position #{rank} · level on points with the TOP 4; legs decide',
        leagueElimination: 'A loss ends the chance of reaching the play-offs',
        oomGap: '£{amount} behind the OOM TOP 16', oomProjection: 'Advancing secures at least £{amount}; enough for the current OOM TOP 16 threshold',
        oomExpiring: '£{amount} from this event expires from the OOM on {date}',
        firstMeeting: 'First official meeting between these players', noPreviousOfficial: 'No previous official meetings', h2h: 'Head to head: {wins} : {losses}',
        rivalryWinStreak: 'Winning streak against this rival: {count}', rivalryLossStreak: 'Losing streak against this rival: {count}',
        lastMeeting: 'Last meeting: {event} · {score}', lastFinal: 'Last final together: {event} · {score}' },
    de: { age: 'Alter', rank: 'Weltrangliste', seed: 'Setzposition', unseeded: '—', titles: 'Titel',
        careerTitles: 'Titel in dieser Karriere', best: 'Bestes Saisonergebnis', appearances: 'Saisonteilnahmen',
        friendly: 'Freundschaftsspiel', average: 'Bester Average', matches: 'Saisonspiele', skip: 'Beide Walk-ons überspringen', skipCurrent: 'Diesen Walk-on überspringen', playMusic: '▶ Musik abspielen',
        season: 'Saison {year}', winner: 'Sieger', fullscreen: 'Vollbild', exitFullscreen: 'Vollbild verlassen',
        leagueTable: '{league}-Tabelle', leaguePlayoffs: 'TOP 4 · Play-offs', leagueColumns: 'Pkt · Leg-Differenz',
        stakes: 'Bedeutung des Spiels', rivalry: 'Direkter Vergleich', groupMatch: 'Kampf ums Weiterkommen in der Gruppe',
        groupDetail: 'Das Ergebnis beeinflusst die Gruppentabelle.', qualifierFinal: 'Entscheidendes Qualifikationsspiel',
        winTitle: 'Ein Sieg bringt den Titel', leagueNightWin: 'Ein Sieg gewinnt diesen Ligaabend', titlePrize: 'Preisgeld für den Sieger: £{amount}',
        winAdvance: 'Ein Sieg führt in: {stage}', leaguePosition: 'Platz #{rank} in der Liga',
        leagueGap: 'Platz #{rank} · {gap} Punkte hinter den TOP 4', leagueTie: 'Platz #{rank} · punktgleich mit den TOP 4; die Legs entscheiden',
        leagueElimination: 'Eine Niederlage beendet die Chance auf die Play-offs',
        oomGap: '£{amount} Rückstand auf die OOM TOP 16', oomProjection: 'Der Einzug sichert mindestens £{amount}; genug für die aktuelle OOM TOP-16-Grenze',
        oomExpiring: '£{amount} aus diesem Turnier verfallen am {date} aus der OOM',
        firstMeeting: 'Erstes offizielles Duell dieser Spieler', noPreviousOfficial: 'Keine früheren offiziellen Duelle', h2h: 'Direkter Vergleich: {wins} : {losses}',
        rivalryWinStreak: 'Siegesserie gegen diesen Gegner: {count}', rivalryLossStreak: 'Niederlagenserie gegen diesen Gegner: {count}',
        lastMeeting: 'Letztes Duell: {event} · {score}', lastFinal: 'Letztes gemeinsames Finale: {event} · {score}' },
    nl: { age: 'Leeftijd', rank: 'Wereldranglijst', seed: 'Plaatsing', unseeded: '—', titles: 'Titels',
        careerTitles: 'Titels in deze carrière', best: 'Beste seizoensresultaat', appearances: 'Deelnames dit seizoen',
        friendly: 'Oefenwedstrijd', average: 'Beste gemiddelde', matches: 'Seizoenwedstrijden', skip: 'Beide walk-ons overslaan', skipCurrent: 'Deze walk-on overslaan', playMusic: '▶ Muziek afspelen',
        season: 'Seizoen {year}', winner: 'Winnaar', fullscreen: 'Volledig scherm', exitFullscreen: 'Volledig scherm sluiten',
        leagueTable: '{league}-stand', leaguePlayoffs: 'TOP 4 · play-offs', leagueColumns: 'Pnt · legverschil',
        stakes: 'Wedstrijdinzet', rivalry: 'Onderlinge historie', groupMatch: 'Strijd om doorgang uit de groep',
        groupDetail: 'Dit resultaat beïnvloedt de groepsstand.', qualifierFinal: 'Beslissende kwalificatiewedstrijd',
        winTitle: 'Winst levert de titel op', leagueNightWin: 'Winst betekent de zege op deze competitieavond', titlePrize: 'Prijs voor de winnaar: £{amount}',
        winAdvance: 'Winst betekent plaatsing voor: {stage}', leaguePosition: 'Plaats #{rank} in de competitie',
        leagueGap: 'Plaats #{rank} · {gap} punten achter de TOP 4', leagueTie: 'Plaats #{rank} · gelijk in punten met de TOP 4; legs beslissen',
        leagueElimination: 'Verlies maakt plaatsing voor de play-offs onmogelijk',
        oomGap: '£{amount} achter de OOM TOP 16', oomProjection: 'Doorgaan garandeert minstens £{amount}; genoeg voor de huidige OOM TOP-16-grens',
        oomExpiring: '£{amount} uit dit toernooi vervalt op {date} uit de OOM',
        firstMeeting: 'Eerste officiële duel tussen deze spelers', noPreviousOfficial: 'Geen eerdere officiële duels', h2h: 'Onderling resultaat: {wins} : {losses}',
        rivalryWinStreak: 'Zegereeks tegen deze rivaal: {count}', rivalryLossStreak: 'Verliesreeks tegen deze rivaal: {count}',
        lastMeeting: 'Laatste duel: {event} · {score}', lastFinal: 'Laatste onderlinge finale: {event} · {score}' }
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

function fitWalkonLedNames() {
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return;
    for (const id of ['walkon-arena-name-left', 'walkon-arena-name-right']) {
        const name = document.getElementById(id);
        const area = name?.parentElement;
        if (!area?.clientHeight || !area.clientWidth || !name.textContent) continue;
        // Use natural layout dimensions, before the panels' perspective and
        // rotation. Reset first so shorter names and taller windows can grow.
        name.style.fontSize = '';
        const fontSize = parseFloat(window.getComputedStyle(name).fontSize);
        const scale = Math.min(1, (area.clientHeight - 4) / name.offsetHeight,
            (area.clientWidth - 4) / name.offsetWidth);
        if (scale < 1 && scale > 0) name.style.fontSize = `${Math.floor(fontSize * scale * .98 * 100) / 100}px`;
    }
}

let walkonLedSizeObserver = null;
let walkonLedFitInitialized = false;
function refreshWalkonLedNames() {
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return;
    if (!walkonLedFitInitialized) {
        walkonLedFitInitialized = true;
        if (typeof window.ResizeObserver === 'function') {
            walkonLedSizeObserver = new window.ResizeObserver(fitWalkonLedNames);
            for (const area of document.querySelectorAll('.walkon-arena-led-label')) walkonLedSizeObserver.observe(area);
        }
        // Width changes also change the CSS font size even when the panel's
        // height is unchanged. Font loading can change the measured glyphs.
        window.addEventListener('resize', fitWalkonLedNames);
        document.fonts?.ready.then(fitWalkonLedNames);
        document.fonts?.addEventListener('loadingdone', fitWalkonLedNames);
    }
    fitWalkonLedNames();
    // Card rendering precedes showing the stage on the first introduction.
    window.requestAnimationFrame(fitWalkonLedNames);
}

function getWalkonLeagueStandings(tournament) {
    if (!tournament || typeof getPlayerCareerTitlePremierLeagueStage !== 'function'
        || !getPlayerCareerTitlePremierLeagueStage(tournament)
        || typeof gdlTable === 'undefined' || !Array.isArray(gdlTable)) return [];
    return gdlTable.filter(row => row?.player).slice().sort((first, second) =>
        (Number(second.points) || 0) - (Number(first.points) || 0)
        || ((Number(second.legsWon) || 0) - (Number(second.legsLost) || 0))
            - ((Number(first.legsWon) || 0) - (Number(first.legsLost) || 0))
        || (Number(second.legsWon) || 0) - (Number(first.legsWon) || 0)).slice(0, 8);
}

function renderWalkonLeagueStandings(candidate, tournament) {
    const panel = document.getElementById('walkon-league-standings');
    if (!panel) return;
    const rows = getWalkonLeagueStandings(tournament);
    panel.hidden = rows.length === 0;
    const list = document.getElementById('walkon-league-rows');
    if (!list) return;
    if (!rows.length) { list.innerHTML = ''; return; }
    const displayName = typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(tournament) : tournament.name || '';
    const league = /premier\s+league/i.test(displayName)
        || (!/global\s+darts\s+league/i.test(displayName) && typeof pdcPlayers !== 'undefined'
            && pdcPlayers.some(player => player?.name === 'Luke Littler'))
        ? 'Premier League' : 'Global Darts League';
    document.getElementById('walkon-league-title').textContent = trWalkonCard('leagueTable', { league });
    document.getElementById('walkon-league-key').textContent = `${trWalkonCard('leaguePlayoffs')} · ${trWalkonCard('leagueColumns')}`;
    list.innerHTML = rows.map((row, index) => {
        const points = Number(row.points) || 0;
        const difference = (Number(row.legsWon) || 0) - (Number(row.legsLost) || 0);
        const active = candidate === row.player
            || (typeof samePlayer === 'function' && samePlayer(candidate, row.player));
        return `<li class="walkon-league-row${index < 4 ? ' playoff' : ''}${active ? ' current' : ''}"${active ? ' aria-current="true"' : ''}>
            <span class="walkon-league-rank">${index + 1}.</span>
            <span class="walkon-league-name" title="${escapeHtml(row.player.name || '')}">${escapeHtml(row.player.name || '')}</span>
            <strong class="walkon-league-points">${points}</strong>
            <span class="walkon-league-difference">${difference > 0 ? '+' : ''}${difference}</span>
        </li>`;
    }).join('');
}

function getWalkonMatchOpponent(candidate) {
    if (typeof currentMatch === 'undefined' || !currentMatch?.vsAI
        || currentMatch.isWorldCup || currentMatch.isDoubles) return null;
    const first = typeof getCurrentSinglesMatchPlayer === 'function'
        ? getCurrentSinglesMatchPlayer(true)
        : (currentMatch.isSpectator ? currentMatch.spectatorP1 : typeof player !== 'undefined' ? player : null);
    const second = typeof getCurrentSinglesMatchPlayer === 'function'
        ? getCurrentSinglesMatchPlayer(false) : currentMatch.opponent;
    const matches = other => candidate === other
        || (typeof samePlayer === 'function' && samePlayer(candidate, other));
    if (matches(first)) return second;
    if (matches(second)) return first;
    return null;
}

function getWalkonMatchStake(candidate, tournament) {
    if (!tournament || typeof currentMatch === 'undefined' || !currentMatch?.isTournament) return null;
    const round = Number(currentMatch.spectatorRound ?? (typeof tournamentRound !== 'undefined' ? tournamentRound : 0));
    const names = `${tournament.name || ''} ${tournament.sourceName || ''} ${tournament.specialType || ''}`;
    const qualifier = /qualif|kwalifikac|q[\s-]*school|trials/i.test(names)
        || (typeof isTournamentEditorQualifier === 'function' && isTournamentEditorQualifier(tournament));
    const leagueStage = typeof getPlayerCareerTitlePremierLeagueStage === 'function'
        ? getPlayerCareerTitlePremierLeagueStage(tournament) : null;
    const group = Boolean(currentMatch.grandSlamGroupMatch)
        || (typeof isGrandSlamGroupStageActive === 'function' && isGrandSlamGroupStageActive(tournament));
    let headline = '', detail = '';
    if (group) {
        headline = trWalkonCard('groupMatch');
        detail = trWalkonCard('groupDetail');
    } else if (round === 2 && qualifier) {
        headline = trWalkonCard('qualifierFinal');
    } else if (round === 2) {
        headline = trWalkonCard(leagueStage === 'night' ? 'leagueNightWin' : 'winTitle');
        const prize = typeof getPrizeMoney === 'function' ? Number(getPrizeMoney(tournament, 2, true)) || 0 : 0;
        if (prize > 0) detail = trWalkonCard('titlePrize', { amount: prize.toLocaleString('en-GB') });
    } else if (round > 2 && Number.isInteger(round / 2) && typeof getRoundName === 'function') {
        const nextStage = getRoundName(round / 2);
        if (nextStage) headline = trWalkonCard('winAdvance', { stage: nextStage });
    }
    let extra = '';
    const leagueRows = getWalkonLeagueStandings(tournament);
    if (leagueRows.length >= 5) {
        const position = leagueRows.findIndex(row => row.player === candidate
            || (typeof samePlayer === 'function' && samePlayer(row.player, candidate)));
        if (position >= 0) {
            const rank = position + 1;
            if (position < 4) extra = trWalkonCard('leaguePosition', { rank });
            else {
                const gap = (Number(leagueRows[3].points) || 0) - (Number(leagueRows[position].points) || 0);
                extra = trWalkonCard(gap > 0 ? 'leagueGap' : 'leagueTie', { rank, gap });
                const night = Number(names.match(/\bnight\s*(\d+)\b/i)?.[1]);
                if (leagueStage === 'night' && night >= 1 && night <= 16 && [8, 4, 2].includes(round)) {
                    const points = Number(leagueRows[position].points) || 0;
                    const cutoff = Number(leagueRows[3].points) || 0;
                    const remainingMaximum = (16 - night) * 5;
                    const pointsForLoss = round === 4 ? 2 : round === 2 ? 3 : 0;
                    if (points + pointsForLoss + remainingMaximum < cutoff
                        && points + 5 + remainingMaximum >= cutoff) detail = trWalkonCard('leagueElimination');
                }
            }
        }
    } else if (typeof isMainOrderOfMeritRankingTournament === 'function'
        && isMainOrderOfMeritRankingTournament(tournament)
        && tournament.rankingOverride !== false && !group
        && typeof getCachedRankedPlayers === 'function') {
        const ranking = getCachedRankedPlayers('main');
        const position = ranking.findIndex(row => row === candidate
            || (typeof samePlayer === 'function' && samePlayer(row, candidate)));
        if (position >= 16 && position < 24 && ranking[15]) {
            const gap = (Number(ranking[15].prizeMoney) || 0) - (Number(candidate.prizeMoney) || 0);
            if (gap > 0) {
                const nextPrize = round > 2 && typeof getPrizeMoney === 'function'
                    ? Number(getPrizeMoney(tournament, round / 2, false)) || 0 : 0;
                extra = trWalkonCard(nextPrize > gap ? 'oomProjection' : 'oomGap', {
                    amount: (nextPrize > gap ? nextPrize : gap).toLocaleString('en-GB')
                });
            }
        }
    }
    if (!extra && typeof currentDate !== 'undefined' && typeof getMainOomDefence === 'function'
        && typeof isMainOrderOfMeritRankingTournament === 'function'
        && isMainOrderOfMeritRankingTournament(tournament)) {
        const now = currentDate.getTime();
        const namesToDefend = new Set([tournament.name, tournament.sourceName].filter(Boolean));
        const expiring = getMainOomDefence(candidate, currentDate).entries.filter(entry =>
            namesToDefend.has(entry.tournament) && entry.expiresAt >= now
            && entry.expiresAt <= now + 30 * 86400000);
        const amount = expiring.reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
        if (amount > 0) {
            const locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[currentLang] || 'en-GB';
            extra = trWalkonCard('oomExpiring', { amount: amount.toLocaleString('en-GB'),
                date: new Date(expiring[0].expiresAt).toLocaleDateString(locale) });
        }
    }
    return headline || detail || extra ? { headline, detail, extra } : null;
}

function getWalkonRivalryStory(candidate, opponent) {
    if (!opponent) return null;
    const careerPlayer = typeof player !== 'undefined' ? player : null;
    const careerIsCandidate = candidate === careerPlayer
        || (typeof samePlayer === 'function' && samePlayer(candidate, careerPlayer));
    const careerIsOpponent = opponent === careerPlayer
        || (typeof samePlayer === 'function' && samePlayer(opponent, careerPlayer));
    const record = careerIsCandidate || careerIsOpponent
        ? careerPlayer?.rivalries?.[(careerIsCandidate ? opponent : candidate)?.id] : null;
    const result = typeof getCareerHeadToHead === 'function'
        ? getCareerHeadToHead(candidate, opponent)
        : record ? { wins: careerIsCandidate ? record.wins : record.losses,
            losses: careerIsCandidate ? record.losses : record.wins, matches: record.matches } : null;
    const headline = result?.matches > 0
        ? trWalkonCard('h2h', { wins: result.wins, losses: result.losses })
        : trWalkonCard(currentMatch?.isTournament ? 'firstMeeting' : 'noPreviousOfficial');
    const formatScore = score => {
        if (!careerIsOpponent) return String(score || '');
        const parts = String(score || '').match(/^(\d+):(\d+)$/);
        return parts ? `${parts[2]}:${parts[1]}` : '';
    };
    const eventName = meeting => typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName({ name: meeting.tournament, sourceName: meeting.sourceTournament })
        : meeting.tournament;
    const recent = Array.isArray(record?.recentMeetings) ? record.recentMeetings[0] : null;
    const fromProfile = !recent && typeof getRecentPlayerMatches === 'function'
        ? getRecentPlayerMatches(candidate).find(match => String(match.opponentId) === String(opponent.id)) : null;
    const last = recent ? { event: eventName(recent), score: formatScore(recent.score) }
        : fromProfile ? { event: eventName(fromProfile), score: `${fromProfile.scoreFor}:${fromProfile.scoreAgainst}` }
            : record?.lastScore ? { event: eventName({ tournament: record.lastTournament,
                sourceTournament: record.lastTournament }), score: formatScore(record.lastScore) } : null;
    const streak = Number(record?.currentStreak) || 0;
    const perspectiveStreak = careerIsOpponent ? -streak : streak;
    const detail = Math.abs(perspectiveStreak) >= 2
        ? trWalkonCard(perspectiveStreak > 0 ? 'rivalryWinStreak' : 'rivalryLossStreak', { count: Math.abs(perspectiveStreak) })
        : last?.score ? trWalkonCard('lastMeeting', last) : '';
    const final = record?.lastFinal;
    const rematchStory = careerIsCandidate || careerIsOpponent
        ? (typeof getPendingMatchStoryRematch === 'function' ? getPendingMatchStoryRematch(careerIsCandidate ? opponent : candidate) : null)
        : null;
    const extra = [final?.score ? trWalkonCard('lastFinal', { event: eventName(final), score: formatScore(final.score) }) : '',
        rematchStory && typeof getMatchStoryText === 'function' ? getMatchStoryText('walkon', rematchStory) : '']
        .filter(Boolean).join(' · ');
    return { headline, detail, extra };
}

function renderWalkonMatchStory(candidate, tournament) {
    const panel = document.getElementById('walkon-match-story');
    if (!panel) return;
    const opponent = getWalkonMatchOpponent(candidate);
    const stake = opponent ? getWalkonMatchStake(candidate, tournament) : null;
    const rivalry = opponent ? getWalkonRivalryStory(candidate, opponent) : null;
    const set = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value || ''; };
    const setCard = (prefix, data, title) => {
        const card = document.getElementById(`${prefix}-card`);
        if (card) card.hidden = !data;
        set(`${prefix}-title`, title);
        set(`${prefix}-headline`, data?.headline);
        set(`${prefix}-detail`, data?.detail);
        set(`${prefix}-extra`, data?.extra);
    };
    setCard('walkon-stake', stake, trWalkonCard('stakes'));
    setCard('walkon-rivalry', rivalry, trWalkonCard('rivalry'));
    panel.hidden = !stake && !rivalry;
}

function renderWalkonPlayerCard(candidate) {
    const card = document.getElementById('walkon-player-card');
    if (!card || !candidate) return;
    const tournament = typeof currentMatch !== 'undefined' && currentMatch?.isTournament
        && typeof activeTournament !== 'undefined' ? activeTournament : null;
    const data = getWalkonPlayerCardData(candidate, tournament);
    renderWalkonLeagueStandings(candidate, tournament);
    renderWalkonMatchStory(candidate, tournament);
    const set = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
    set('walkon-arena-event', tournament && typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : data.event);
    set('walkon-arena-name-left', candidate.name || '');
    set('walkon-arena-name-right', candidate.name || '');
    refreshWalkonLedNames();
    if (typeof window !== 'undefined' && window.matchBroadcastTheme) {
        window.matchBroadcastTheme.apply(tournament, typeof currentMatch !== 'undefined' ? currentMatch : null);
    }
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
    set('walkon-card-skip-current', trWalkonCard('skipCurrent'));
    set('walkon-card-skip', trWalkonCard('skip'));
    set('walkon-card-play-music', trWalkonCard('playMusic'));
    if (typeof window !== 'undefined') window.walkonFullscreen?.refresh();
    setWalkonPlayerPhoto(candidate);
}
