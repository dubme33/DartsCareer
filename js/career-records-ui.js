const CAREER_RECORDS_TRANSLATIONS = {
    pl: {
        champions: 'Historia mistrzów', comparison: 'Porównaj zawodników', back: 'Wróć', tournament: 'Turniej',
        historyNote: 'Historia tej kariery. Starsze zapisy mogą być niepełne — pokazujemy tylko zwycięstwa z potwierdzonym rokiem.',
        defender: 'Obrońca tytułu', lastKnown: 'Ostatni zapisany mistrz', record: 'Najwięcej tytułów w zapisanej historii',
        editions: 'Zwycięzcy poszczególnych edycji', year: 'Rok', champion: 'Mistrz', empty: 'Brak potwierdzonych zwycięzców. Kolejne edycje będą zapisywane automatycznie.',
        first: 'Pierwszy zawodnik', second: 'Drugi zawodnik', swap: 'Zamień strony', chooseDifferent: 'Wybierz dwóch różnych zawodników.',
        season: 'Statystyki sezonu {year}', metric: 'Statystyka', average: 'Średnia meczowa', checkout: 'Skuteczność na podwójnych',
        oneEighties: 'Rzucone 180', balance: 'Wygrane / przegrane', titles: 'Tytuły w karierze', overall: 'Overall',
        coverage: 'Dane z {count}/{total} meczów', statsNote: 'Średnia to średnia arytmetyczna zapisanych średnich meczowych. ≈ oznacza dane zawierające szacunki z szybkiej symulacji. — oznacza brak danych.',
        h2h: 'Bezpośrednie spotkania', h2hNote: 'Bilans oficjalnych pojedynków singlowych z całej zapisanej kariery. Starsze zapisy mogą obejmować tylko zachowane ostatnie mecze i bilanse rywalizacji.',
        h2hEmpty: 'Brak zapisanych bezpośrednich spotkań.', matches: '{count} spotkań', form: 'Forma · ostatnie {count} spotkań',
        recent: 'Pokaż ostatnie mecze', noRecent: 'Brak zapisanych meczów.', win: 'Z', loss: 'P', won: 'Zwycięstwo', lost: 'Porażka',
        formNote: 'Od najnowszego meczu; forma może obejmować poprzedni sezon.', legs: 'legi', sets: 'sety'
    },
    en: {
        champions: 'Tournament champions', comparison: 'Compare players', back: 'Back', tournament: 'Tournament',
        historyNote: 'History of this career. Older saves may be incomplete — only wins with a confirmed year are shown.',
        defender: 'Defending champion', lastKnown: 'Last recorded champion', record: 'Most titles in recorded history',
        editions: 'Winners by edition', year: 'Year', champion: 'Champion', empty: 'No confirmed champions yet. Future editions will be saved automatically.',
        first: 'First player', second: 'Second player', swap: 'Swap sides', chooseDifferent: 'Choose two different players.',
        season: 'Season {year} statistics', metric: 'Statistic', average: 'Match average', checkout: 'Checkout rate',
        oneEighties: '180s thrown', balance: 'Wins / losses', titles: 'Career titles', overall: 'Overall',
        coverage: 'Data from {count}/{total} matches', statsNote: 'Average is the arithmetic mean of recorded match averages. ≈ includes estimates from quick simulation. — means no data.',
        h2h: 'Head to head', h2hNote: 'Official singles meetings across the recorded career. Older saves may include only retained recent matches and rivalry records.',
        h2hEmpty: 'No recorded head-to-head matches.', matches: '{count} matches', form: 'Form · last {count} matches',
        recent: 'Show recent matches', noRecent: 'No recorded matches.', win: 'W', loss: 'L', won: 'Win', lost: 'Loss',
        formNote: 'Newest first; form may include the previous season.', legs: 'legs', sets: 'sets'
    },
    de: {
        champions: 'Turniersieger', comparison: 'Spieler vergleichen', back: 'Zurück', tournament: 'Turnier',
        historyNote: 'Historie dieser Karriere. Ältere Spielstände können unvollständig sein. Nur Siege mit bestätigtem Jahr werden angezeigt.',
        defender: 'Titelverteidiger', lastKnown: 'Letzter erfasster Sieger', record: 'Meiste Titel in der erfassten Historie',
        editions: 'Sieger nach Jahr', year: 'Jahr', champion: 'Sieger', empty: 'Noch keine bestätigten Sieger. Künftige Ausgaben werden automatisch gespeichert.',
        first: 'Erster Spieler', second: 'Zweiter Spieler', swap: 'Seiten tauschen', chooseDifferent: 'Wähle zwei verschiedene Spieler.',
        season: 'Statistik der Saison {year}', metric: 'Statistik', average: 'Match-Average', checkout: 'Doppelquote',
        oneEighties: 'Geworfene 180er', balance: 'Siege / Niederlagen', titles: 'Karrieretitel', overall: 'Gesamtstärke',
        coverage: 'Daten aus {count}/{total} Spielen', statsNote: 'Der Average ist das arithmetische Mittel erfasster Match-Averages. ≈ enthält Schätzungen aus der Schnellsimulation. — bedeutet keine Daten.',
        h2h: 'Direkte Duelle', h2hNote: 'Offizielle Einzelduelle der erfassten Karriere. Ältere Spielstände enthalten eventuell nur letzte Spiele und Rivalitätsbilanzen.',
        h2hEmpty: 'Keine direkten Duelle erfasst.', matches: '{count} Spiele', form: 'Form · letzte {count} Spiele',
        recent: 'Letzte Spiele anzeigen', noRecent: 'Keine Spiele erfasst.', win: 'S', loss: 'N', won: 'Sieg', lost: 'Niederlage',
        formNote: 'Neueste zuerst; die Form kann die vorherige Saison umfassen.', legs: 'Legs', sets: 'Sätze'
    },
    nl: {
        champions: 'Toernooiwinnaars', comparison: 'Spelers vergelijken', back: 'Terug', tournament: 'Toernooi',
        historyNote: 'Geschiedenis van deze carrière. Oudere saves kunnen onvolledig zijn. Alleen zeges met een bevestigd jaar worden getoond.',
        defender: 'Titelverdediger', lastKnown: 'Laatst geregistreerde kampioen', record: 'Meeste titels in de opgeslagen geschiedenis',
        editions: 'Winnaars per editie', year: 'Jaar', champion: 'Kampioen', empty: 'Nog geen bevestigde kampioenen. Volgende edities worden automatisch opgeslagen.',
        first: 'Eerste speler', second: 'Tweede speler', swap: 'Wissel kanten', chooseDifferent: 'Kies twee verschillende spelers.',
        season: 'Statistieken seizoen {year}', metric: 'Statistiek', average: 'Wedstrijdgemiddelde', checkout: 'Dubbelpercentage',
        oneEighties: 'Gegooide 180s', balance: 'Gewonnen / verloren', titles: 'Carrièretitels', overall: 'Algemene sterkte',
        coverage: 'Gegevens uit {count}/{total} wedstrijden', statsNote: 'Het gemiddelde is het rekenkundig gemiddelde van opgeslagen wedstrijdgemiddelden. ≈ bevat schattingen uit snelle simulatie. — betekent geen gegevens.',
        h2h: 'Onderlinge duels', h2hNote: 'Officiële enkelduels uit de opgeslagen carrière. Oudere saves kunnen alleen recente wedstrijden en rivaliteitsbalansen bevatten.',
        h2hEmpty: 'Geen onderlinge duels opgeslagen.', matches: '{count} wedstrijden', form: 'Vorm · laatste {count} wedstrijden',
        recent: 'Toon recente wedstrijden', noRecent: 'Geen wedstrijden opgeslagen.', win: 'W', loss: 'V', won: 'Winst', lost: 'Verlies',
        formNote: 'Nieuwste eerst; vorm kan het vorige seizoen omvatten.', legs: 'legs', sets: 'sets'
    }
};

let careerChampionsSelection = '';
let careerComparisonSelection = ['', ''];
let careerComparisonReturn = 'screen-pdc';

function trCareerRecords(key, values = {}) {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    return (CAREER_RECORDS_TRANSLATIONS[language]?.[key] || CAREER_RECORDS_TRANSLATIONS.pl[key] || key)
        .replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function getCareerRecordEvents() {
    const events = new Map();
    Object.values(player?.careerRecords?.tournaments || {}).forEach(event => events.set(event.key, event));
    tournamentDatabase.filter(isCareerChampionship).forEach(event => events.set(getPlayerCareerTitleData(event).key, event));
    return [...events.values()].sort((a, b) => getTournamentDisplayName(a).localeCompare(getTournamentDisplayName(b), getPlayerProfileLocale()));
}

function showTournamentChampions(index) {
    initializeCareerRecords();
    if (Number.isInteger(index) && tournamentDatabase[index]) careerChampionsSelection = getPlayerCareerTitleData(tournamentDatabase[index]).key;
    const events = getCareerRecordEvents();
    if (!events.some(event => getPlayerCareerTitleData(event).key === careerChampionsSelection)) {
        careerChampionsSelection = events.length ? getPlayerCareerTitleData(events[0]).key : '';
    }
    const h = escapeHtml, tr = trCareerRecords;
    document.getElementById('tournament-champions-content').innerHTML = `<h2>${h(tr('champions'))}</h2>
        <p class="records-note">${h(tr('historyNote'))}</p>
        <div class="records-controls"><div><label for="champions-tournament">${h(tr('tournament'))}</label>
        <select id="champions-tournament" onchange="careerChampionsSelection = this.value; renderTournamentChampions()">${events.map(event => {
            const key = getPlayerCareerTitleData(event).key;
            return `<option value="${h(key)}" ${key === careerChampionsSelection ? 'selected' : ''}>${h(getTournamentDisplayName(event))}</option>`;
        }).join('')}</select></div></div><div id="champions-result" aria-live="polite"></div>`;
    renderTournamentChampions();
    showScreen('screen-tournament-champions');
}

function renderTournamentChampions() {
    const event = getCareerRecordEvents().find(candidate => getPlayerCareerTitleData(candidate).key === careerChampionsSelection);
    const h = escapeHtml, tr = trCareerRecords;
    const container = document.getElementById('champions-result');
    const { editions, leaders } = getCareerChampions(event || {});
    if (!editions.length) { container.innerHTML = `<p class="records-empty">${h(tr('empty'))}</p>`; return; }
    const championName = champion => {
        const live = !champion.team && getCareerProfilePlayers().find(candidate => getCareerRecordPlayerKey(candidate) === champion.key);
        return live?.name || (champion.team && typeof getWorldCupCountryName === 'function' ? getWorldCupCountryName(champion.name) : champion.name);
    };
    const latest = editions[0];
    container.innerHTML = `<div class="records-summary">
        <article class="records-champion"><span>${h(tr(latest.year >= getCurrentSeasonYear() - 1 ? 'defender' : 'lastKnown'))}</span>
            <strong>${h(championName(latest))}</strong><small>${latest.year}</small></article>
        <article><span>${h(tr('record'))}</span><strong>${leaders.map(champion => `${h(championName(champion))} <em>×${champion.count}</em>`).join('<br>')}</strong></article>
        </div><h3>${h(tr('editions'))}</h3><div class="records-table-wrap"><table class="records-table">
            <thead><tr><th scope="col">${h(tr('year'))}</th><th scope="col">${h(tr('champion'))}</th></tr></thead>
            <tbody>${editions.map(champion => `<tr><th scope="row"><time datetime="${champion.year}">${champion.year}</time></th>
                <td>${h(championName(champion))}${champion.members?.length ? `<small>${h(champion.members.join(' · '))}</small>` : ''}</td></tr>`).join('')}</tbody>
        </table></div>`;
}

function showPlayerComparison(playerId) {
    initializeCareerRecords();
    const previous = document.querySelector('.screen.active')?.id;
    if (previous !== 'screen-player-comparison') careerComparisonReturn = previous === 'screen-player-profile' ? previous : 'screen-pdc';
    const candidates = getCareerProfilePlayers().sort((a, b) => a.name.localeCompare(b.name, getPlayerProfileLocale()));
    const preferred = playerId == null ? null : candidates.find(candidate => String(candidate.id) === String(playerId));
    if (preferred) careerComparisonSelection[0] = getCareerRecordPlayerKey(preferred);
    if (!candidates.some(candidate => getCareerRecordPlayerKey(candidate) === careerComparisonSelection[0])) {
        careerComparisonSelection[0] = getCareerRecordPlayerKey(player);
    }
    if (!candidates.some(candidate => getCareerRecordPlayerKey(candidate) === careerComparisonSelection[1]) || careerComparisonSelection[0] === careerComparisonSelection[1]) {
        careerComparisonSelection[1] = getCareerRecordPlayerKey(candidates.find(candidate => getCareerRecordPlayerKey(candidate) !== careerComparisonSelection[0]));
    }
    const h = escapeHtml, tr = trCareerRecords;
    document.getElementById('player-comparison-content').innerHTML = `<h2>${h(tr('comparison'))}</h2>
        <div class="records-controls comparison-controls">${[0, 1].map(side => `<div><label for="comparison-player-${side}">${h(tr(side ? 'second' : 'first'))}</label>
            <select id="comparison-player-${side}" onchange="careerComparisonSelection[${side}] = this.value; renderPlayerComparison()">
            ${candidates.map(candidate => { const key = getCareerRecordPlayerKey(candidate); return `<option value="${h(key)}" ${key === careerComparisonSelection[side] ? 'selected' : ''}>${h(candidate.name)}</option>`; }).join('')}
            </select></div>`).join('')}</div>
        <button type="button" class="records-swap" onclick="swapPlayerComparison()">↔ ${h(tr('swap'))}</button>
        <div id="comparison-result" aria-live="polite"></div>`;
    renderPlayerComparison();
    showScreen('screen-player-comparison');
}

function swapPlayerComparison() {
    careerComparisonSelection.reverse();
    careerComparisonSelection.forEach((key, side) => { document.getElementById(`comparison-player-${side}`).value = key; });
    renderPlayerComparison();
}

function closePlayerComparison() {
    if (careerComparisonReturn === 'screen-player-profile') openPlayerProfile(currentPlayerProfileId, playerProfileReturnRanking);
    else showScreen('screen-pdc');
}

function renderPlayerComparison() {
    const candidates = careerComparisonSelection.map(key => getCareerProfilePlayers().find(candidate => getCareerRecordPlayerKey(candidate) === key));
    const container = document.getElementById('comparison-result'), h = escapeHtml, tr = trCareerRecords;
    if (candidates.some(candidate => !candidate) || careerComparisonSelection[0] === careerComparisonSelection[1]) {
        container.innerHTML = `<p class="records-empty">${h(tr('chooseDifferent'))}</p>`; return;
    }
    const data = candidates.map(getPlayerComparisonStats), h2h = getCareerHeadToHead(...candidates);
    const sample = (entry, key) => tr('coverage', { count: entry.stats?.[key] || 0, total: entry.stats?.played || 0 });
    const metric = (key, value, note = () => '') => `<tr><th scope="row">${h(tr(key))}</th>${data.map((entry, side) => `<td><strong>${h(value(entry, side))}</strong><small>${h(note(entry))}</small></td>`).join('')}</tr>`;
    const form = entry => entry.recent.map(match => {
        const label = `${tr(match.won ? 'won' : 'lost')} · ${match.opponentName} ${match.scoreFor}:${match.scoreAgainst} · ${formatPlayerProfileDate(match.timestamp)}`;
        return `<span class="records-form-result ${match.won ? 'records-win' : 'records-loss'}" title="${h(label)}" aria-label="${h(label)}">${h(tr(match.won ? 'win' : 'loss'))}</span>`;
    }).join('');
    container.innerHTML = `<section class="records-h2h"><h3>${h(tr('h2h'))}</h3>
        <div class="records-h2h-score"><strong>${h(candidates[0].name)}</strong><b>${h2h.wins} : ${h2h.losses}</b><strong>${h(candidates[1].name)}</strong></div>
        ${h2h.matches ? `<div class="records-h2h-bar" aria-hidden="true"><span style="width:${100 * h2h.wins / h2h.matches}%"></span></div>` : ''}
        <p>${h(h2h.matches ? tr('matches', { count: h2h.matches }) : tr('h2hEmpty'))}</p>
        <p class="records-note">${h(tr('h2hNote'))}</p></section>
        <h3>${h(tr('season', { year: getCurrentSeasonYear() }))}</h3>
        <div class="records-table-wrap"><table class="records-table comparison-table"><thead><tr><th scope="col">${h(tr('metric'))}</th>
        ${candidates.map(candidate => `<th scope="col">${h(candidate.name)}</th>`).join('')}</tr></thead><tbody>
        ${metric('average', entry => entry.average === null ? '—' : entry.average.toFixed(2), entry => sample(entry, 'averageCount'))}
        ${metric('checkout', entry => entry.checkout === null ? '—' : `${entry.stats.estimatedDoubleMatches ? '≈ ' : ''}${entry.checkout.toFixed(1)}%`, entry => sample(entry, 'doubleMatches'))}
        ${metric('oneEighties', entry => entry.oneEighties === null ? '—' : `${entry.stats.estimatedOneEightyMatches ? '≈ ' : ''}${entry.oneEighties}`, entry => sample(entry, 'oneEightyMatches'))}
        ${metric('balance', entry => entry.stats?.played ? `${entry.stats.wins} / ${entry.stats.losses}` : '—')}
        </tbody></table></div><p class="records-note">${h(tr('statsNote'))}</p>
        <div class="records-table-wrap"><table class="records-table comparison-table"><thead><tr><th scope="col">${h(tr('metric'))}</th>
        ${candidates.map(candidate => `<th scope="col">${h(candidate.name)}</th>`).join('')}</tr></thead><tbody>
        ${metric('titles', entry => entry.titleCount)}
        ${metric('overall', (entry, side) => { const value = Number(candidates[side].ovr ?? candidates[side].overall); return Number.isFinite(value) ? value.toFixed(0) : '—'; })}
        </tbody></table></div>
        <div class="records-summary comparison-form">${data.map((entry, side) => `<article><h3>${h(candidates[side].name)}</h3>
            <p>${h(tr('form', { count: entry.recent.length }))}</p><div class="records-form">${form(entry)}</div>
            ${entry.recent.length ? `<details><summary>${h(tr('recent'))}</summary><ol>${entry.recent.map(match => `<li>
                <strong>${h(match.opponentName)} · ${match.scoreFor}:${match.scoreAgainst} ${h(tr(match.scoreType === 'sets' ? 'sets' : 'legs'))}</strong>
                <small>${h(formatPlayerProfileDate(match.timestamp))} · ${h(getTournamentDisplayName({ name: match.tournament, sourceName: match.sourceTournament, specialType: match.tournamentSpecialType, worldMastersEvent: match.worldMastersEvent }))}</small></li>`).join('')}</ol></details>` : `<p class="records-note">${h(tr('noRecent'))}</p>`}
            </article>`).join('')}</div><p class="records-note">${h(tr('formNote'))}</p>`;
}

function refreshCareerRecordsTranslations() {
    ['champions-calendar-link', 'comparison-ranking-link', 'comparison-profile-link', 'champions-back', 'comparison-back'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = trCareerRecords(id.endsWith('back') ? 'back' : id.startsWith('champions') ? 'champions' : 'comparison');
    });
    if (document.getElementById('screen-tournament-champions')?.classList.contains('active')) showTournamentChampions();
    if (document.getElementById('screen-player-comparison')?.classList.contains('active')) showPlayerComparison();
}
