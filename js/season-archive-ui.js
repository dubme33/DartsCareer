const SEASON_ARCHIVE_TEXT = {
    pl: {
        title: 'Archiwum sezonów', tile: 'Porównaj lata, rozwój i nagrody roczne.',
        intro: 'Twoja kariera rok po roku. Sezon zamykamy 31 grudnia, przed zmianami rankingu i wieku.',
        year: 'Sezon do podsumowania', metric: 'Metryka wykresu', chart: 'Wykres rozwoju', comparison: 'Porównanie sezonów',
        rank: 'Ranking OOM', ovr: 'OVR', average: 'Średnia meczowa', checkout: 'Checkout %', titles: 'Tytuły singlowe', earnings: 'Nagrody turniejowe',
        season: 'Sezon', live: 'W toku', closed: 'Zakończony', partial: 'Niepełne dane', full: 'Śledzony od początku',
        period: 'Stan na {date} · pomiar od {start}', empty: 'Zakończone sezony pojawią się tutaj po zmianie roku. Na razie możesz śledzić bieżący sezon.',
        coverage: 'Mecze: {played} · bilans: {wins}–{losses}. Średnia z {averageCount} meczów. Checkout z {doubleMatches}/{played} meczów, w tym {estimated} szacowanych.',
        detail: 'Wzrost OVR w okresie pomiaru: {growth}. Tytuły drużynowe: {teamTitles}. Z nagród turniejowych do głównego OOM: {rankingEarnings}.',
        dataNote: '— oznacza brak danych, a ≈ checkout obejmujący szacunki szybkich symulacji. Zarobki to nagrody turniejowe brutto, bez sponsorów, zakupów i innych zdarzeń. Starych sezonów nie odtwarzamy; w starszym zapisie pierwsze podsumowanie może być niepełne.',
        chartNote: 'Widoczny zakres: {first}–{last}. Wybierz starszy sezon, aby przesunąć wykres. Puste dane przerywają linię; pusty punkt oznacza sezon w toku.',
        rankNote: 'W rankingu niższy numer oznacza lepszy wynik.', noChart: 'Brak danych dla tej metryki. Pojawią się po rozegraniu oficjalnych meczów.',
        awards: 'Nagrody świata gry', playerYear: 'Zawodnik roku', rookie: 'Debiutant roku', progress: 'Największy postęp',
        awardsLive: 'Nagrody zostaną przyznane po zamknięciu pełnego sezonu. To wyróżnienia bez premii pieniężnej i bez zmian umiejętności.',
        awardsPartial: 'Nie przyznano nagród: ten sezon nie był śledzony od początku.', noWinner: 'Brak zawodnika spełniającego warunki.',
        awardResult: 'Nagrody do OOM: {money} · tytuły singlowe: {titles} · wygrane mecze: {wins}', awardGrowth: 'Wzrost bazowego OVR: +{growth}',
        rules: 'Zasady podsumowań i nagród',
        criteria: 'Minimum 10 zapisanych oficjalnych meczów singlowych. Zawodnik roku: najwięcej nagród do głównego OOM w danym roku (minimum £1). Debiutant: te same kryteria, wyłącznie nowy własny zawodnik lub newgen w swoim sezonie debiutu. Największy postęp: największy dodatni wzrost bazowego OVR, mierzony od początku sezonu, bez korekt z moda. Remisy rozstrzygają kolejno: nagrody OOM, tytuły singlowe, wygrane mecze, średnia, nazwa i identyfikator zawodnika. Tytuły nie obejmują kwalifikatorów; zwycięstwa drużynowe są liczone osobno.',
        back: 'Wróć do Menu'
    },
    en: {
        title: 'Season archive', tile: 'Compare seasons, development and annual awards.',
        intro: 'Your career year by year. Seasons close on 31 December, before ranking expiry and ageing.',
        year: 'Season summary', metric: 'Chart metric', chart: 'Development chart', comparison: 'Season comparison',
        rank: 'OOM rank', ovr: 'OVR', average: 'Match average', checkout: 'Checkout %', titles: 'Singles titles', earnings: 'Tournament earnings',
        season: 'Season', live: 'In progress', closed: 'Completed', partial: 'Partial data', full: 'Tracked from the start',
        period: 'As of {date} · tracked since {start}', empty: 'Completed seasons will appear after the year changes. You can track the current season now.',
        coverage: 'Matches: {played} · record: {wins}–{losses}. Average from {averageCount} matches. Checkouts from {doubleMatches}/{played} matches, including {estimated} estimated.',
        detail: 'OVR growth during tracking: {growth}. Team titles: {teamTitles}. Tournament earnings counting toward main OOM: {rankingEarnings}.',
        dataNote: '— means no data; ≈ marks checkouts including quick-simulation estimates. Earnings are gross tournament prizes, excluding sponsors, purchases and other events. Past seasons are not reconstructed; the first summary in an older save may be incomplete.',
        chartNote: 'Displayed: {first}–{last}. Select an older season to move the chart. Missing data breaks the line; hollow points mark an ongoing season.',
        rankNote: 'A lower ranking number is better.', noChart: 'No data for this metric yet. Play official matches to start tracking it.',
        awards: 'Game world awards', playerYear: 'Player of the year', rookie: 'Rookie of the year', progress: 'Most improved',
        awardsLive: 'Awards are granted when a fully tracked season closes. They are honours without money or skill bonuses.',
        awardsPartial: 'No awards: this season was not tracked from the start.', noWinner: 'No eligible player.',
        awardResult: 'Main OOM earnings: {money} · singles titles: {titles} · matches won: {wins}', awardGrowth: 'Base OVR improvement: +{growth}',
        rules: 'Summary and award rules',
        criteria: 'At least 10 recorded official singles matches. Player of the year: most main OOM prize money earned that year (at least £1). Rookie: the same criteria, restricted to a newly created career player or a newgen in their debut season. Most improved: largest positive base OVR gain, tracked from the start of the season, excluding mod adjustments. Ties use main OOM earnings, singles titles, match wins, average, name and player ID, in that order. Titles exclude qualifiers; team titles are counted separately.',
        back: 'Back to Menu'
    },
    de: {
        title: 'Saisonarchiv', tile: 'Saisons, Entwicklung und Jahresauszeichnungen vergleichen.',
        intro: 'Deine Karriere, Jahr für Jahr. Abschluss am 31. Dezember, vor Ranglistenverfall und Alterung.',
        year: 'Saisonübersicht', metric: 'Diagrammwert', chart: 'Entwicklung', comparison: 'Saisonvergleich',
        rank: 'OOM-Platz', ovr: 'OVR', average: 'Matchschnitt', checkout: 'Checkout %', titles: 'Einzeltitel', earnings: 'Turnierpreisgeld',
        season: 'Saison', live: 'Läuft', closed: 'Abgeschlossen', partial: 'Unvollständige Daten', full: 'Seit Saisonbeginn erfasst',
        period: 'Stand: {date} · erfasst seit {start}', empty: 'Abgeschlossene Saisons erscheinen nach dem Jahreswechsel. Die laufende Saison ist bereits sichtbar.',
        coverage: 'Spiele: {played} · Bilanz: {wins}–{losses}. Schnitt aus {averageCount} Spielen. Checkouts aus {doubleMatches}/{played} Spielen, davon {estimated} geschätzt.',
        detail: 'OVR-Zuwachs im erfassten Zeitraum: {growth}. Teamtitel: {teamTitles}. Haupt-OOM-Preisgeld dieser Saison: {rankingEarnings}.',
        dataNote: '— bedeutet keine Daten; ≈ kennzeichnet Checkouts mit Schätzungen aus Schnellsimulationen. Einnahmen sind Brutto-Turnierpreise ohne Sponsoren, Käufe und andere Ereignisse. Frühere Saisons werden nicht rekonstruiert; die erste Übersicht eines älteren Spielstands kann unvollständig sein.',
        chartNote: 'Zeitraum: {first}–{last}. Eine ältere Saison verschiebt das Diagramm. Datenlücken unterbrechen die Linie; hohle Punkte zeigen die laufende Saison.',
        rankNote: 'Ein kleinerer Rang ist besser.', noChart: 'Noch keine Daten für diesen Wert. Spiele offizielle Partien, um ihn zu erfassen.',
        awards: 'Auszeichnungen der Spielwelt', playerYear: 'Spieler des Jahres', rookie: 'Debütant des Jahres', progress: 'Größter Fortschritt',
        awardsLive: 'Auszeichnungen folgen nach Abschluss einer vollständig erfassten Saison. Sie geben weder Geld noch Fertigkeitsboni.',
        awardsPartial: 'Keine Auszeichnungen: Die Saison wurde nicht von Anfang an erfasst.', noWinner: 'Kein berechtigter Spieler.',
        awardResult: 'Haupt-OOM-Preisgeld: {money} · Einzeltitel: {titles} · Siege: {wins}', awardGrowth: 'Zuwachs der Basis-OVR: +{growth}',
        rules: 'Regeln für Archiv und Auszeichnungen',
        criteria: 'Mindestens 10 erfasste offizielle Einzelspiele. Spieler des Jahres: höchstes Haupt-OOM-Preisgeld des Jahres (mindestens £1). Debütant: gleiche Kriterien, nur neu erstellte Karrierespieler oder Newgens in ihrer Debütsaison. Größter Fortschritt: höchster positiver Basis-OVR-Zuwachs seit Saisonbeginn, ohne Mod-Korrekturen. Gleichstände: OOM-Preisgeld, Einzeltitel, Siege, Schnitt, Name und Spieler-ID. Qualifikationen zählen nicht als Titel; Teamtitel werden separat gezählt.',
        back: 'Zurück zum Menü'
    },
    nl: {
        title: 'Seizoensarchief', tile: 'Vergelijk seizoenen, ontwikkeling en jaarprijzen.',
        intro: 'Je carrière, jaar voor jaar. Seizoenen sluiten op 31 december, vóór rankingverval en veroudering.',
        year: 'Seizoensoverzicht', metric: 'Grafiekwaarde', chart: 'Ontwikkeling', comparison: 'Seizoensvergelijking',
        rank: 'OOM-positie', ovr: 'OVR', average: 'Wedstrijdgemiddelde', checkout: 'Checkout %', titles: 'Singlestitels', earnings: 'Toernooiprijzengeld',
        season: 'Seizoen', live: 'Bezig', closed: 'Afgerond', partial: 'Onvolledige gegevens', full: 'Vanaf de start gevolgd',
        period: 'Stand: {date} · gevolgd sinds {start}', empty: 'Afgeronde seizoenen verschijnen na de jaarwisseling. Je kunt het huidige seizoen al volgen.',
        coverage: 'Wedstrijden: {played} · balans: {wins}–{losses}. Gemiddelde uit {averageCount} wedstrijden. Checkouts uit {doubleMatches}/{played} wedstrijden, waarvan {estimated} geschat.',
        detail: 'OVR-groei in de meetperiode: {growth}. Teamtitels: {teamTitles}. Prijzengeld voor de hoofd-OOM dit seizoen: {rankingEarnings}.',
        dataNote: '— betekent geen gegevens; ≈ betekent checkouts met schattingen uit snelle simulaties. Inkomsten zijn bruto toernooiprijzen, zonder sponsors, aankopen en andere gebeurtenissen. Eerdere seizoenen worden niet gereconstrueerd; het eerste overzicht in een oudere save kan onvolledig zijn.',
        chartNote: 'Periode: {first}–{last}. Kies een ouder seizoen om de grafiek te verschuiven. Ontbrekende gegevens onderbreken de lijn; open punten markeren het lopende seizoen.',
        rankNote: 'Een lager rankingnummer is beter.', noChart: 'Nog geen gegevens voor deze waarde. Speel officiële wedstrijden om ze bij te houden.',
        awards: 'Prijzen uit de spelwereld', playerYear: 'Speler van het jaar', rookie: 'Debutant van het jaar', progress: 'Meeste vooruitgang',
        awardsLive: 'Prijzen volgen na een volledig gevolgd seizoen. Het zijn onderscheidingen zonder geld- of vaardigheidsbonus.',
        awardsPartial: 'Geen prijzen: dit seizoen werd niet vanaf het begin gevolgd.', noWinner: 'Geen speler voldoet aan de voorwaarden.',
        awardResult: 'Hoofd-OOM-prijzengeld: {money} · singlestitels: {titles} · gewonnen wedstrijden: {wins}', awardGrowth: 'Groei van basis-OVR: +{growth}',
        rules: 'Regels voor overzichten en prijzen',
        criteria: 'Minstens 10 geregistreerde officiële singleswedstrijden. Speler van het jaar: meeste hoofd-OOM-prijzengeld in dat jaar (minstens £1). Debutant: dezelfde criteria, alleen een nieuw gemaakte carrièrespeler of newgen in diens debuutseizoen. Meeste vooruitgang: grootste positieve basis-OVR-groei vanaf het seizoenbegin, zonder modcorrecties. Gelijke standen: OOM-prijzengeld, singlestitels, zeges, gemiddelde, naam en speler-ID. Kwalificaties tellen niet als titel; teamtitels tellen apart.',
        back: 'Terug naar Menu'
    }
};
const SEASON_ARCHIVE_METRICS = ['rank', 'ovr', 'average', 'checkout', 'titles', 'earnings'];
let seasonArchiveSelectedYear = null;
let seasonArchiveSelectedMetric = 'ovr';

function trSeasonArchive(key, values = {}) {
    const lang = typeof currentLang === 'string' ? currentLang : 'en';
    return (SEASON_ARCHIVE_TEXT[lang]?.[key] || SEASON_ARCHIVE_TEXT.en[key] || key)
        .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function seasonArchiveLocale() {
    return { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[typeof currentLang === 'string' ? currentLang : 'en'] || 'en-GB';
}

function seasonArchiveDate(value) {
    return Number.isFinite(value) && Number.isFinite(new Date(value).getTime())
        ? new Date(value).toLocaleDateString(seasonArchiveLocale()) : '—';
}

function seasonArchiveFormat(value, metric, estimated = false) {
    if (seasonArchiveNumber(value) === null) return '—';
    if (metric === 'earnings' || metric === 'rankingEarnings') return `£${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
    if (metric === 'rank') return `#${value}`;
    const formatted = value.toLocaleString(seasonArchiveLocale(), { maximumFractionDigits: metric === 'titles' ? 0 : 2 });
    return `${estimated ? '≈ ' : ''}${formatted}${metric === 'checkout' ? '%' : ''}`;
}

function seasonArchiveGrowth(value) {
    return Number.isFinite(value) ? `${value > 0 ? '+' : ''}${value.toLocaleString(seasonArchiveLocale(), { maximumFractionDigits: 2 })}` : '—';
}

function getSeasonArchiveRows() {
    const state = initializeSeasonArchive();
    const rows = [...state.seasons];
    if (!rows.some(row => row.year === currentDate.getFullYear())) rows.push(getLiveSeasonArchiveSummary());
    return rows.sort((a, b) => a.year - b.year);
}

function renderSeasonArchiveChart(rows = getSeasonArchiveRows()) {
    const target = document.getElementById('season-archive-chart');
    if (!target) return;
    const metric = seasonArchiveSelectedMetric;
    const narrow = typeof window !== 'undefined' && window.innerWidth < 650;
    const limit = narrow ? 4 : 10;
    const selectedIndex = rows.findIndex(row => row.year === seasonArchiveSelectedYear);
    const end = Math.min(rows.length, Math.max(limit, selectedIndex + 1));
    const visible = rows.slice(Math.max(0, end - limit), end);
    const values = visible.map(row => seasonArchiveNumber(row[metric])).filter(value => value !== null);
    if (!values.length) { target.innerHTML = `<p class="archive-empty">${escapeHtml(trSeasonArchive('noChart'))}</p>`; return; }
    const width = narrow ? 340 : 760, height = 245, left = 62, right = width - 22, top = 24, bottom = 199;
    const low = Math.min(...values), high = Math.max(...values);
    const padding = Math.max((high - low) * .15, metric === 'earnings' ? 100 : 1);
    const min = metric === 'checkout' ? 0 : Math.max(metric === 'rank' ? 1 : 0, Math.floor(low - padding));
    const max = metric === 'checkout' ? 100 : Math.max(min + 1, Math.ceil(high + padding));
    const x = i => visible.length === 1 ? (left + right) / 2 : left + i * (right - left) / (visible.length - 1);
    const y = value => metric === 'rank' ? top + (value - min) / (max - min) * (bottom - top)
        : bottom - (value - min) / (max - min) * (bottom - top);
    const tick = value => metric === 'earnings' ? `£${Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`
        : `${metric === 'rank' ? '#' : ''}${Number(value.toFixed(1)).toLocaleString(seasonArchiveLocale())}${metric === 'checkout' ? '%' : ''}`;
    const ticks = [...new Set([min, metric === 'rank' ? Math.round((min + max) / 2) : (min + max) / 2, max])];
    let path = '', connected = false;
    visible.forEach((row, i) => {
        const value = seasonArchiveNumber(row[metric]);
        if (value === null) { connected = false; return; }
        path += `${connected ? 'L' : 'M'}${x(i).toFixed(2)},${y(value).toFixed(2)} `;
        connected = true;
    });
    const points = visible.map((row, i) => {
        const value = seasonArchiveNumber(row[metric]);
        return `<text x="${x(i)}" y="228" text-anchor="middle" class="archive-chart-label">${row.year}</text>${value === null ? '' :
            `<circle cx="${x(i)}" cy="${y(value)}" r="${row.year === seasonArchiveSelectedYear ? 6 : 4}" class="archive-chart-point${row.closed ? '' : ' archive-chart-live'}"><title>${escapeHtml(`${row.year}: ${seasonArchiveFormat(value, metric, metric === 'checkout' && row.estimatedDoubleMatches > 0)} · ${trSeasonArchive(row.closed ? 'closed' : 'live')}`)}</title></circle>`}`;
    }).join('');
    target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(trSeasonArchive('chart') + ': ' + trSeasonArchive(metric))}">
        ${ticks.map(value => `<line x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}" class="archive-chart-grid"/><text x="${left - 9}" y="${y(value) + 4}" text-anchor="end" class="archive-chart-label">${escapeHtml(tick(value))}</text>`).join('')}
        <path d="${path}" class="archive-chart-line"/>${points}</svg>
        <p class="archive-note">${escapeHtml(trSeasonArchive('chartNote', { first: visible[0].year, last: visible.at(-1).year }))}${metric === 'rank' ? ` ${escapeHtml(trSeasonArchive('rankNote'))}` : ''}</p>`;
}

function renderSeasonArchiveAwards(row) {
    const awards = row.awards;
    if (!row.closed || awards?.available !== true) return `<p class="archive-note">${escapeHtml(trSeasonArchive(row.closed ? 'awardsPartial' : 'awardsLive'))}</p>`;
    return `<div class="archive-awards-grid">${['playerYear', 'rookie', 'progress'].map((type, i) => {
        const winner = awards[type];
        const name = typeof winner?.person?.name === 'string' ? winner.person.name : null;
        return `<article class="archive-award"><h4>${['🏆', '🌟', '📈'][i]} ${escapeHtml(trSeasonArchive(type))}</h4>
            <strong>${escapeHtml(name || trSeasonArchive('noWinner'))}</strong>${name ? `<p>${escapeHtml(trSeasonArchive('awardResult', {
                money: seasonArchiveFormat(winner.rankingEarnings, 'earnings'), titles: seasonArchiveNumber(winner.titles) ?? '—', wins: seasonArchiveNumber(winner.wins) ?? '—' }))}</p>
            ${type === 'progress' ? `<p>${escapeHtml(trSeasonArchive('awardGrowth', { growth: seasonArchiveFormat(winner.growth, 'ovr') }))}</p>` : ''}` : ''}</article>`;
    }).join('')}</div>`;
}

function renderSeasonArchive() {
    const target = document.getElementById('season-archive-content');
    if (!target) return;
    const rows = getSeasonArchiveRows();
    if (!rows.some(row => row.year === seasonArchiveSelectedYear)) seasonArchiveSelectedYear = rows.filter(row => row.closed).at(-1)?.year || rows.at(-1).year;
    const selected = rows.find(row => row.year === seasonArchiveSelectedYear);
    const coverage = Object.fromEntries(['played', 'wins', 'losses', 'averageCount', 'doubleMatches']
        .map(key => [key, seasonArchiveNumber(selected[key]) ?? '—']));
    const yearSelect = document.getElementById('season-archive-year');
    if (yearSelect) {
        yearSelect.innerHTML = [...rows].reverse().map(row => `<option value="${row.year}">${row.year} · ${escapeHtml(trSeasonArchive(row.closed ? 'closed' : 'live'))}</option>`).join('');
        yearSelect.value = String(seasonArchiveSelectedYear);
    }
    const metricSelect = document.getElementById('season-archive-metric');
    if (metricSelect) {
        metricSelect.innerHTML = SEASON_ARCHIVE_METRICS.map(metric => `<option value="${metric}">${escapeHtml(trSeasonArchive(metric))}</option>`).join('');
        metricSelect.value = seasonArchiveSelectedMetric;
    }
    target.innerHTML = `<div class="archive-summary-head"><h3>${selected.year} · ${escapeHtml(trSeasonArchive(selected.closed ? 'closed' : 'live'))}</h3>
        <span class="archive-status${selected.fullSeason ? '' : ' archive-partial'}">${escapeHtml(trSeasonArchive(selected.fullSeason ? 'full' : 'partial'))}</span></div>
        <p class="archive-note">${escapeHtml(trSeasonArchive('period', { date: seasonArchiveDate(selected.asOf), start: seasonArchiveDate(selected.startedAt) }))}</p>
        ${rows.some(row => row.closed) ? '' : `<p class="archive-empty">${escapeHtml(trSeasonArchive('empty'))}</p>`}
        <div class="archive-stat-grid">${SEASON_ARCHIVE_METRICS.map(metric => `<div><span>${escapeHtml(trSeasonArchive(metric))}</span><strong>${escapeHtml(seasonArchiveFormat(selected[metric], metric, metric === 'checkout' && selected.estimatedDoubleMatches > 0))}</strong></div>`).join('')}</div>
        <p class="archive-note">${escapeHtml(trSeasonArchive('coverage', { ...coverage, estimated: seasonArchiveNumber(selected.estimatedDoubleMatches) ?? '—' }))}</p>
        <p class="archive-note">${escapeHtml(trSeasonArchive('detail', { growth: seasonArchiveGrowth(selected.growth), teamTitles: seasonArchiveNumber(selected.teamTitles) ?? '—', rankingEarnings: seasonArchiveFormat(selected.rankingEarnings, 'rankingEarnings') }))}</p>
        <h3>${escapeHtml(trSeasonArchive('awards'))} · ${selected.year}</h3>${renderSeasonArchiveAwards(selected)}
        <h3 id="season-archive-comparison-title">${escapeHtml(trSeasonArchive('comparison'))}</h3>
        <div class="archive-table-wrap" role="region" aria-labelledby="season-archive-comparison-title" tabindex="0"><table class="archive-table">
            <thead><tr><th scope="col">${escapeHtml(trSeasonArchive('season'))}</th>${SEASON_ARCHIVE_METRICS.map(metric => `<th scope="col">${escapeHtml(trSeasonArchive(metric))}</th>`).join('')}</tr></thead>
            <tbody>${[...rows].reverse().map(row => `<tr${row.year === selected.year ? ' class="archive-selected-row"' : ''}><th scope="row">${row.year}<small>${escapeHtml(trSeasonArchive(row.closed ? 'closed' : 'live'))}${row.fullSeason ? '' : ' · ' + escapeHtml(trSeasonArchive('partial'))}</small></th>${SEASON_ARCHIVE_METRICS.map(metric => `<td>${escapeHtml(seasonArchiveFormat(row[metric], metric, metric === 'checkout' && row.estimatedDoubleMatches > 0))}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>`;
    renderSeasonArchiveChart(rows);
}

function refreshSeasonArchiveTranslations() {
    const ids = { 'season-archive-tile-title': 'title', 'season-archive-title': 'title', 'season-archive-tile-desc': 'tile',
        'season-archive-intro': 'intro', 'season-archive-year-label': 'year', 'season-archive-metric-label': 'metric',
        'season-archive-chart-title': 'chart', 'season-archive-data-note': 'dataNote', 'season-archive-rules-title': 'rules',
        'season-archive-rules': 'criteria', 'season-archive-back': 'back' };
    for (const [id, key] of Object.entries(ids)) {
        const node = document.getElementById(id);
        if (node) node.textContent = (key === 'title' ? '📊 ' : '') + trSeasonArchive(key);
    }
    if (document.getElementById('screen-season-archive')?.classList.contains('active')) renderSeasonArchive();
}

function showSeasonArchive() {
    refreshSeasonArchiveTranslations();
    renderSeasonArchive();
    showScreen('screen-season-archive');
}

function changeSeasonArchiveYear(value) {
    const year = Number(value);
    if (Number.isInteger(year)) seasonArchiveSelectedYear = year;
    renderSeasonArchive();
}

function changeSeasonArchiveMetric(value) {
    if (!SEASON_ARCHIVE_METRICS.includes(value)) return;
    seasonArchiveSelectedMetric = value;
    renderSeasonArchiveChart();
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', () => {
        if (document.getElementById('screen-season-archive')?.classList.contains('active')) renderSeasonArchiveChart();
    });
}
