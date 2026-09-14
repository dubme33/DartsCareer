// Only actual darts populate the detailed report. No extra random draws, ratings
// changes or reconstructed throw histories are needed for this feature.
const MATCH_REPORT_TEXT = {
    pl: {
        title: 'Raport po meczu', open: 'Zobacz raport', close: 'Zamknij raport', win: 'Wygrana', loss: 'Przegrana', friendly: 'Sparing',
        average: 'Średnia meczowa', first9: 'Średnia pierwszych 9 lotek', checkout: 'Skuteczność zamknięć', maximums: 'Rzuty 180',
        matchDarts: 'Lotki meczowe', missed: 'Niewykorzystane: {count}', pressure: 'Zamknięcia pod presją',
        doubles: 'Celność poszczególnych doubli', target: 'Cel', hits: 'Trafienia / próby', accuracy: 'Skuteczność',
        comparison: 'Porównanie z 10 poprzednimi meczami', baseline: 'Poprzednie mecze ({count}): {value}',
        noBaseline: 'Brak wcześniejszych pomiarów', noAttempts: 'Brak prób', noDetails: 'Brak pełnego zapisu lotek. Szczegółowe dane będą dostępne dla nowych meczów.',
        doublesNote: 'Trafienie oznacza wbicie lotki w wybraną podwójną, także przy double-in. Bull to podwójne 25.',
        pressureNote: 'Liczone są próby zamknięcia przy wysokiej presji silnika meczu (co najmniej 50%) oraz wszystkie lotki meczowe. Lotka meczowa może zakończyć całe spotkanie.',
        comparisonNote: 'Średnie są liczone na mecz; skuteczność zamknięć ze wszystkich zmierzonych prób. Uproszczone szacunki zamknięć są pomijane. Sparingi nie zasilają historii turniejowej.',
        advice: 'Co warto poprawić', weakDouble: 'Poćwicz {double}: {hits}/{attempts} trafień ({rate}%).',
        weakCheckout: 'Skup się na zamknięciach: skuteczność wyniosła {rate}%. Ćwicz przejście od ustawienia do doubla.',
        goodScoring: 'Punktowanie było mocną stroną, ale zamknięcia miały tylko {rate}% skuteczności. Priorytetem treningu są double.',
        pressureAdvice: 'Pod presją zamknąłeś {hits}/{attempts} prób. Poćwicz zamknięcia w decydujących legach.',
        matchAdvice: 'Zmarnowałeś {count} lotek meczowych. W treningu odtwarzaj zamknięcia na wygraną.',
        scoringAdvice: 'Średnia spadła o {delta} względem poprzednich meczów. Warto popracować nad regularnością punktowania.',
        smallSample: 'Za mało prób na doublach na pewną diagnozę. Obserwuj kolejne mecze.',
        balanced: 'W tym meczu nie widać wyraźnego problemu z zamknięciami. Utrzymuj regularny trening.', unit: 'p.p.'
    },
    en: {
        title: 'Post-match report', open: 'View report', close: 'Close report', win: 'Win', loss: 'Loss', friendly: 'Friendly',
        average: 'Match average', first9: 'First 9 dart average', checkout: 'Checkout accuracy', maximums: '180s',
        matchDarts: 'Match darts', missed: 'Missed: {count}', pressure: 'Checkouts under pressure',
        doubles: 'Accuracy by double', target: 'Target', hits: 'Hits / attempts', accuracy: 'Accuracy',
        comparison: 'Comparison with the previous 10 matches', baseline: 'Previous matches ({count}): {value}',
        noBaseline: 'No earlier measurements', noAttempts: 'No attempts', noDetails: 'No complete dart record. Detailed data will be available for new matches.',
        doublesNote: 'A hit means hitting the selected double, including double-in. Bull is double 25.',
        pressureNote: 'Includes checkout attempts at high engine pressure (at least 50%) and all match darts. A match dart can win the entire match.',
        comparisonNote: 'Averages are per match; checkout accuracy uses all measured attempts. Simplified checkout estimates are excluded. Friendlies do not enter tournament history.',
        advice: 'What to improve', weakDouble: 'Practise {double}: {hits}/{attempts} hits ({rate}%).',
        weakCheckout: 'Focus on checkouts: accuracy was {rate}%. Practise the transition from setup to double.',
        goodScoring: 'Scoring was a strength, but checkout accuracy was only {rate}%. Prioritise doubles in training.',
        pressureAdvice: 'Under pressure you finished {hits}/{attempts} attempts. Practise checkouts in deciding legs.',
        matchAdvice: 'You missed {count} match darts. Recreate match-winning checkouts in training.',
        scoringAdvice: 'Your average fell by {delta} compared with previous matches. Work on scoring consistency.',
        smallSample: 'Too few double attempts for a firm diagnosis. Watch your next matches.',
        balanced: 'No clear checkout problem in this match. Maintain regular practice.', unit: 'pp'
    },
    de: {
        title: 'Spielbericht', open: 'Bericht ansehen', close: 'Bericht schließen', win: 'Sieg', loss: 'Niederlage', friendly: 'Freundschaftsspiel',
        average: 'Match-Average', first9: 'Average der ersten 9 Darts', checkout: 'Checkout-Quote', maximums: '180er',
        matchDarts: 'Matchdarts', missed: 'Vergeben: {count}', pressure: 'Checkouts unter Druck',
        doubles: 'Trefferquote je Doppel', target: 'Ziel', hits: 'Treffer / Versuche', accuracy: 'Trefferquote',
        comparison: 'Vergleich mit den 10 vorherigen Spielen', baseline: 'Vorherige Spiele ({count}): {value}',
        noBaseline: 'Keine früheren Messwerte', noAttempts: 'Keine Versuche', noDetails: 'Kein vollständiges Dartprotokoll. Details sind für neue Spiele verfügbar.',
        doublesNote: 'Ein Treffer trifft das gewählte Doppel, auch beim Double-in. Bull ist Doppel 25.',
        pressureNote: 'Checkout-Versuche bei hohem Druck im Spielmotor (mindestens 50%) sowie alle Matchdarts. Ein Matchdart kann das gesamte Spiel beenden.',
        comparisonNote: 'Averages werden pro Spiel berechnet, die Checkout-Quote über alle gemessenen Versuche. Vereinfachte Schätzungen sind ausgeschlossen. Freundschaftsspiele zählen nicht zur Turnierhistorie.',
        advice: 'Trainingsempfehlungen', weakDouble: 'Trainiere {double}: {hits}/{attempts} Treffer ({rate}%).',
        weakCheckout: 'Konzentriere dich auf Checkouts: {rate}% Trefferquote. Trainiere den Übergang vom Stellen zum Doppel.',
        goodScoring: 'Das Scoring war stark, die Checkout-Quote lag aber nur bei {rate}%. Trainiere vorrangig Doppel.',
        pressureAdvice: 'Unter Druck gelangen {hits}/{attempts} Checkouts. Trainiere Checkouts in entscheidenden Legs.',
        matchAdvice: 'Du hast {count} Matchdarts vergeben. Trainiere spielentscheidende Checkouts.',
        scoringAdvice: 'Dein Average sank um {delta} gegenüber früheren Spielen. Arbeite an konstantem Scoring.',
        smallSample: 'Zu wenige Doppelversuche für eine sichere Diagnose. Beobachte weitere Spiele.',
        balanced: 'Kein deutliches Checkout-Problem in diesem Spiel. Trainiere weiterhin regelmäßig.', unit: 'PP'
    },
    nl: {
        title: 'Wedstrijdrapport', open: 'Bekijk rapport', close: 'Sluit rapport', win: 'Winst', loss: 'Verlies', friendly: 'Oefenwedstrijd',
        average: 'Wedstrijdgemiddelde', first9: 'Gemiddelde eerste 9 darts', checkout: 'Checkoutpercentage', maximums: '180s',
        matchDarts: 'Matchdarts', missed: 'Gemist: {count}', pressure: 'Checkouts onder druk',
        doubles: 'Nauwkeurigheid per dubbel', target: 'Doel', hits: 'Raak / pogingen', accuracy: 'Nauwkeurigheid',
        comparison: 'Vergelijking met de 10 vorige wedstrijden', baseline: 'Vorige wedstrijden ({count}): {value}',
        noBaseline: 'Geen eerdere metingen', noAttempts: 'Geen pogingen', noDetails: 'Geen volledig dartverslag. Details zijn beschikbaar voor nieuwe wedstrijden.',
        doublesNote: 'Een treffer raakt de gekozen dubbel, ook bij double-in. Bull is dubbel 25.',
        pressureNote: 'Checkoutpogingen bij hoge druk in de wedstrijdmotor (minstens 50%) en alle matchdarts. Een matchdart kan de hele wedstrijd winnen.',
        comparisonNote: 'Gemiddelden zijn per wedstrijd; checkoutpercentages gebruiken alle gemeten pogingen. Vereenvoudigde schattingen tellen niet mee. Oefenwedstrijden komen niet in de toernooihistorie.',
        advice: 'Wat kun je verbeteren?', weakDouble: 'Train {double}: {hits}/{attempts} raak ({rate}%).',
        weakCheckout: 'Focus op checkouts: {rate}% raak. Train de overgang van klaarzetten naar de dubbel.',
        goodScoring: 'Scoren was een sterk punt, maar slechts {rate}% van de checkouts lukte. Geef dubbels prioriteit.',
        pressureAdvice: 'Onder druk lukten {hits}/{attempts} checkouts. Train finishes in beslissende legs.',
        matchAdvice: 'Je miste {count} matchdarts. Oefen wedstrijdwinnende checkouts.',
        scoringAdvice: 'Je gemiddelde daalde met {delta} tegenover vorige wedstrijden. Werk aan constant scoren.',
        smallSample: 'Te weinig dubbelpogingen voor een zekere diagnose. Bekijk je volgende wedstrijden.',
        balanced: 'Geen duidelijk checkoutprobleem in deze wedstrijd. Blijf regelmatig trainen.', unit: 'pp'
    }
};

function trMatchReport(key, values = {}) {
    const lang = typeof currentLang === 'string' ? currentLang : 'pl';
    return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        (MATCH_REPORT_TEXT[lang] || MATCH_REPORT_TEXT.pl)[key] || MATCH_REPORT_TEXT.en[key] || key);
}

function recordMatchReportDart(match, isP1, score, aim, result) {
    if (!match?.stats || match.isDoubles) return;
    if (!match.reportDarts) {
        // A resumed old match has an incomplete history; never label it complete.
        match.reportDarts = { version: 1, complete: !(match.stats.p1TotalDarts || match.stats.p2TotalDarts),
            p1: { doubles: {}, matchAttempts: 0, matchHits: 0, pressureAttempts: 0, pressureHits: 0 },
            p2: { doubles: {}, matchAttempts: 0, matchHits: 0, pressureAttempts: 0, pressureHits: 0 } };
    }
    const side = match.reportDarts[isP1 ? 'p1' : 'p2'];
    const validDouble = aim.mult === 2 && (aim.sector === 25 || (Number.isInteger(aim.sector) && aim.sector >= 1 && aim.sector <= 20));
    if (!validDouble) return;
    const bounced = result?.bounceOut === true;
    const hit = !bounced && result.sector === aim.sector && result.mult === 2;
    const double = side.doubles[aim.sector] || (side.doubles[aim.sector] = { attempts: 0, hits: 0 });
    double.attempts++;
    if (hit) double.hits++;
    const checkoutAttempt = score <= 40 || (score === 50 && aim.sector === 25);
    if (!checkoutAttempt) return;
    const finished = !bounced && score === result.sector * result.mult && result.mult === 2;
    const matchDart = score === aim.sector * 2 && typeof canWinMatchWithNextLeg === 'function' && canWinMatchWithNextLeg(match, isP1);
    if (matchDart) { side.matchAttempts++; if (finished) side.matchHits++; }
    const highPressure = matchDart || (typeof getMatchPressureLevel === 'function' && getMatchPressureLevel(match, isP1, aim, score) >= 0.5);
    if (highPressure) { side.pressureAttempts++; if (finished) side.pressureHits++; }
}

function getMatchReportBaseline(candidate) {
    const previous = typeof getRecentPlayerMatches === 'function' ? getRecentPlayerMatches(candidate) : [];
    const measured = previous.filter(m => m.report?.doubleAttempts > 0 && m.report.source !== 'quick-simulation');
    const averages = previous.map(m => m.average).filter(v => typeof v === 'number' && Number.isFinite(v));
    const first9 = previous.map(m => m.report?.first9).filter(v => typeof v === 'number' && Number.isFinite(v));
    return { matches: previous.length, averageCount: averages.length,
        average: averages.length ? averages.reduce((sum, v) => sum + v, 0) / averages.length : null,
        first9Count: first9.length, first9: first9.length ? first9.reduce((sum, v) => sum + v, 0) / first9.length : null,
        checkoutCount: measured.length, doubleHits: measured.reduce((sum, m) => sum + m.report.doubleHits, 0),
        doubleAttempts: measured.reduce((sum, m) => sum + m.report.doubleAttempts, 0) };
}

function createCompletedMatchReport(match, isP1 = true, candidate = player, tournament = null) {
    if (!match?.stats || match.isDoubles || (match.vsAI === false && !match.isTournament && !match.isSpectator)) return null;
    const opponent = isP1 ? match.opponent : (match.isSpectator ? match.spectatorP1 : player);
    if (!opponent || opponent.isBye) return null;
    const side = isP1 ? 'p1' : 'p2', stats = match.stats;
    const measured = suffix => Number.isFinite(stats[side + suffix]) && stats[side + suffix] >= 0 ? stats[side + suffix] : null;
    const totalDarts = measured('TotalDarts'), accumulated = measured('AccumulatedScore');
    const first9Darts = measured('First9Darts'), first9Score = measured('First9Score');
    const sets = match.matchFormat?.type === 'sets';
    const scoreFor = match[side + (sets ? 'Sets' : 'Legs')], scoreAgainst = match[(isP1 ? 'p2' : 'p1') + (sets ? 'Sets' : 'Legs')];
    const canonical = typeof getCareerProfilePlayers === 'function' && typeof getPlayerMatchStatsKey === 'function'
        ? getCareerProfilePlayers().find(p => getPlayerMatchStatsKey(p) === getPlayerMatchStatsKey(candidate)) || candidate : candidate;
    return { version: 1, timestamp: typeof currentDate !== 'undefined' ? currentDate.getTime() : Date.now(),
        playerName: candidate?.name || '', opponentName: opponent.name, tournament: tournament?.name || '',
        sourceTournament: tournament?.sourceName || tournament?.name || '', tournamentSpecialType: tournament?.specialType || '',
        worldMastersEvent: tournament?.worldMastersEvent || '', scoreFor, scoreAgainst, won: scoreFor > scoreAgainst,
        isFriendly: !match.isTournament, scoreType: sets ? 'sets' : 'legs', source: 'measured',
        average: totalDarts > 0 && accumulated !== null ? (accumulated + 501 - match[side + 'Score']) / totalDarts * 3 : null,
        first9: first9Darts > 0 && first9Score !== null ? first9Score / first9Darts * 3 : null,
        doubleHits: measured('DoubleHits'), doubleAttempts: measured('DoubleAttempts'), oneEighties: measured('OneEighties'),
        bounceOuts: measured('BounceOuts'), complete: match.reportDarts?.complete === true,
        detail: match.reportDarts?.complete === true ? JSON.parse(JSON.stringify(match.reportDarts[side])) : null,
        baseline: getMatchReportBaseline(canonical) };
}

function getMatchReportAdvice(report) {
    const advice = [], detail = report.detail;
    const attempts = report.doubleAttempts || 0, rate = attempts ? report.doubleHits / attempts * 100 : null;
    const baselineRate = report.baseline.doubleAttempts ? report.baseline.doubleHits / report.baseline.doubleAttempts * 100 : null;
    const values = { rate: rate?.toFixed(1) };
    if (attempts >= 5 && (rate < 25 || (baselineRate !== null && rate < baselineRate - 10))) {
        const scoringStrong = report.first9 >= 90 || (report.baseline.average !== null && report.average >= report.baseline.average + 3);
        advice.push(trMatchReport(scoringStrong ? 'goodScoring' : 'weakCheckout', values));
    }
    const weakest = Object.entries(detail?.doubles || {}).filter(([, d]) => d.attempts >= 3 && d.hits / d.attempts < 0.35)
        .sort((a, b) => a[1].hits / a[1].attempts - b[1].hits / b[1].attempts || b[1].attempts - a[1].attempts)[0];
    if (weakest) advice.push(trMatchReport('weakDouble', { double: weakest[0] === '25' ? 'Bull' : `D${weakest[0]}`,
        ...weakest[1], rate: (weakest[1].hits / weakest[1].attempts * 100).toFixed(1) }));
    if (detail?.pressureAttempts >= 3 && detail.pressureHits / detail.pressureAttempts * 100 < Math.max(25, rate - 15)) {
        advice.push(trMatchReport('pressureAdvice', { hits: detail.pressureHits, attempts: detail.pressureAttempts }));
    }
    if (detail?.matchAttempts > detail?.matchHits) advice.push(trMatchReport('matchAdvice', { count: detail.matchAttempts - detail.matchHits }));
    if (report.average !== null && report.baseline.averageCount >= 3 && report.average < report.baseline.average - 5) {
        advice.push(trMatchReport('scoringAdvice', { delta: (report.baseline.average - report.average).toFixed(2) }));
    }
    if (!advice.length) advice.push(trMatchReport(attempts >= 5 ? 'balanced' : 'smallSample'));
    return advice;
}

function renderMatchReport(report) {
    const h = escapeHtml, tr = trMatchReport, baseline = report.baseline;
    const number = value => typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
    const accuracy = (hits, attempts) => attempts > 0 ? `${hits}/${attempts} (${(100 * hits / attempts).toFixed(1)}%)` : tr('noAttempts');
    const compared = (value, previous, count, percentage = false) => previous === null || value === null ? tr('noBaseline')
        : `${tr('baseline', { count, value: percentage ? previous.toFixed(1) + '%' : number(previous) })} · ${value - previous > 0 ? '+' : ''}${(value - previous).toFixed(percentage ? 1 : 2)}${percentage ? ' ' + tr('unit') : ''}`;
    const card = (title, value, note = '') => `<div class="match-report-card"><span>${h(tr(title))}</span><strong>${h(value)}</strong>${note ? `<small>${h(note)}</small>` : ''}</div>`;
    const rate = report.doubleAttempts > 0 ? report.doubleHits / report.doubleAttempts * 100 : null;
    const previousRate = baseline.doubleAttempts ? baseline.doubleHits / baseline.doubleAttempts * 100 : null;
    const detail = report.detail;
    const tournament = { name: report.tournament, sourceName: report.sourceTournament, specialType: report.tournamentSpecialType, worldMastersEvent: report.worldMastersEvent };
    const eventName = report.isFriendly ? tr('friendly') : typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : report.tournament;
    const date = typeof formatPlayerProfileDate === 'function' ? formatPlayerProfileDate(report.timestamp) : new Date(report.timestamp).toLocaleDateString();
    const rows = Object.entries(detail?.doubles || {}).sort((a, b) => b[1].attempts - a[1].attempts || Number(b[0]) - Number(a[0]))
        .map(([sector, d]) => `<tr><th scope="row">${sector === '25' ? 'Bull' : `D${h(sector)}`}</th><td>${h(d.hits)}/${h(d.attempts)}</td><td>${h((100 * d.hits / d.attempts).toFixed(1))}%</td></tr>`).join('');
    return `<article class="match-report"><header><div><h2 id="match-report-title">${h(tr('title'))}</h2><p>${h(report.playerName)} · ${h(tr(report.won ? 'win' : 'loss'))} ${h(report.scoreFor)}:${h(report.scoreAgainst)} · ${h(report.opponentName)}</p><small>${h(eventName)} · ${h(date)}</small></div><button type="button" class="match-report-close" onclick="closeMatchReport()" aria-label="${h(tr('close'))}">×</button></header>
        <h3>${h(tr('comparison'))}</h3><div class="match-report-grid">
        ${card('average', number(report.average), compared(report.average, baseline.average, baseline.averageCount))}
        ${card('first9', number(report.first9), compared(report.first9, baseline.first9, baseline.first9Count))}
        ${card('checkout', report.doubleAttempts === null ? '—' : accuracy(report.doubleHits, report.doubleAttempts), compared(rate, previousRate, baseline.checkoutCount, true))}
        ${card('maximums', report.oneEighties ?? '—')}
        ${card('matchDarts', detail ? accuracy(detail.matchHits, detail.matchAttempts) : '—', detail ? tr('missed', { count: detail.matchAttempts - detail.matchHits }) : '')}
        ${card('pressure', detail ? accuracy(detail.pressureHits, detail.pressureAttempts) : '—')}
        </div><p class="match-report-note">${h(tr('comparisonNote'))}</p>
        ${detail ? `<h3>${h(tr('doubles'))}</h3>${rows ? `<table class="match-report-table"><thead><tr><th>${h(tr('target'))}</th><th>${h(tr('hits'))}</th><th>${h(tr('accuracy'))}</th></tr></thead><tbody>${rows}</tbody></table>` : `<p>${h(tr('noAttempts'))}</p>`}<p class="match-report-note">${h(tr('doublesNote'))}</p><p class="match-report-note">${h(tr('pressureNote'))}</p>` : `<p class="match-report-note">${h(tr('noDetails'))}</p>`}
        <section class="match-report-advice"><h3>${h(tr('advice'))}</h3><ul>${getMatchReportAdvice(report).map(text => `<li>${h(text)}</li>`).join('')}</ul></section></article>`;
}

function showMatchReport(report) {
    if (!report || typeof document === 'undefined') return false;
    let dialog = document.getElementById('match-report-dialog');
    if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'match-report-dialog';
        dialog.setAttribute('aria-labelledby', 'match-report-title');
        document.body.appendChild(dialog);
    }
    dialog.innerHTML = renderMatchReport(report);
    if (!dialog.open) dialog.showModal();
    return true;
}

function closeMatchReport() { document.getElementById('match-report-dialog')?.close(); }

function openPlayerMatchReport(playerKey, matchKey) {
    const candidate = getCareerProfilePlayers().find(p => getPlayerMatchStatsKey(p) === playerKey);
    return showMatchReport(getRecentPlayerMatches(candidate).find(m => m.key === matchKey)?.report);
}

function publishCompletedMatchReport(report) {
    if (!report) return;
    player.lastMatchReport = report;
    showMatchReport(report);
    if (typeof saveGame === 'function') saveGame(true);
}
