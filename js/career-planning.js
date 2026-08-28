// Podgląd nie wywołuje ensure*Field ani symulacji: nie utrwala przyszłych obsad.
const CAREER_PLANNING_TEXT = {
    title: ['Kwalifikacje i OOM', 'Qualification & OOM', 'Qualifikation & OOM', 'Kwalificatie & OOM'],
    tile: ['Sprawdź awans i pieniądze do obrony.', 'Track qualification and money to defend.', 'Qualifikation und zu verteidigendes Preisgeld.', 'Volg kwalificatie en te verdedigen prijzengeld.'],
    qualification: ['Podgląd kwalifikacji', 'Qualification preview', 'Qualifikationsvorschau', 'Kwalificatieoverzicht'],
    defence: ['Pieniądze do obrony', 'Money to defend', 'Preisgeld verteidigen', 'Prijzengeld verdedigen'],
    tournament: ['Turniej', 'Tournament', 'Turnier', 'Toernooi'],
    back: ['Wróć do menu', 'Back to menu', 'Zurück zum Menü', 'Terug naar menu'],
    asOf: ['Stan na {date}', 'As of {date}', 'Stand: {date}', 'Stand op {date}'],
    eventDate: ['Początek turnieju: {date}', 'Tournament starts: {date}', 'Turnierbeginn: {date}', 'Toernooistart: {date}'],
    notice: ['Prognoza według dzisiejszych rankingów. Obsada może się zmienić do rozpoczęcia turnieju lub kwalifikacji. Podgląd nie rozgrywa kwalifikatorów.', 'Projection based on today’s rankings. The field can change until the tournament or qualifiers start. Viewing this screen does not run qualifiers.', 'Prognose nach heutigen Ranglisten. Das Feld kann sich bis zum Turnier- oder Qualifikationsbeginn ändern. Diese Vorschau spielt keine Qualifikation aus.', 'Prognose op basis van de huidige ranglijsten. Het veld kan veranderen tot het toernooi of de kwalificatie start. Dit overzicht speelt geen kwalificaties.'],
    in: ['Obecnie wchodzisz', 'Currently in the field', 'Aktuell im Teilnehmerfeld', 'Momenteel geplaatst'],
    confirmed: ['Masz zapewniony awans', 'Qualification secured', 'Qualifikation gesichert', 'Kwalificatie verzekerd'],
    pending: ['Awans przez kwalifikator', 'Qualifier still required', 'Qualifikation noch nötig', 'Kwalificatie nog nodig'],
    out: ['Obecnie poza stawką', 'Currently outside the field', 'Aktuell nicht im Feld', 'Momenteel buiten het veld'],
    pendingReason: ['Możesz walczyć o miejsce przez: {route}. Wynik nie jest jeszcze rozstrzygnięty.', 'You can compete for a place via: {route}. The result is not yet decided.', 'Du kannst dich über {route} qualifizieren. Das Ergebnis steht noch nicht fest.', 'Je kunt een plaats verdienen via: {route}. De uitslag staat nog niet vast.'],
    outReason: ['Nie zajmujesz obecnie miejsca w żadnej ścieżce awansu. Sprawdź poniżej zasady i obsadę każdej puli.', 'You do not currently hold a place through any qualification route. Check the rules and fields below.', 'Du hast aktuell keinen Platz über einen Qualifikationsweg. Regeln und Teilnehmer stehen unten.', 'Je hebt momenteel geen plaats via een kwalificatieroute. Bekijk hieronder de regels en deelnemers.'],
    field: ['Obsadzone lub przewidywane miejsca: {count}/{total}', 'Confirmed or projected places: {count}/{total}', 'Bestätigte oder prognostizierte Plätze: {count}/{total}', 'Bevestigde of verwachte plaatsen: {count}/{total}'],
    placesPending: ['Pozostałe miejsca rozstrzygną kwalifikacje.', 'Remaining places will be decided by qualifiers.', 'Die übrigen Plätze werden in Qualifikationen vergeben.', 'De overige plaatsen worden via kwalificaties bepaald.'],
    emptyGroup: ['Brak zakwalifikowanych zawodników w tej puli.', 'No qualified players in this group.', 'Keine qualifizierten Spieler in dieser Gruppe.', 'Geen gekwalificeerde spelers in deze groep.'],
    noEvents: ['Brak nadchodzących turniejów objętych podglądem w tym sezonie.', 'No upcoming previewed tournaments this season.', 'Keine anstehenden Turniere mit Vorschau in dieser Saison.', 'Geen komende toernooien met een overzicht dit seizoen.'],
    noPlayer: ['Najpierw rozpocznij karierę.', 'Start a career first.', 'Starte zuerst eine Karriere.', 'Start eerst een carrière.'],
    draw: ['Ustalona obsada turnieju', 'Confirmed tournament field', 'Festgelegtes Teilnehmerfeld', 'Vastgesteld deelnemersveld'],
    oomTop80: ['Top 80 OOM', 'Top 80 OOM', 'Top 80 OOM', 'Top 80 OOM'],
    oom16: ['Top 16 OOM', 'Top 16 OOM', 'Top 16 OOM', 'Top 16 OOM'],
    pt16: ['16 kolejnych z ProTour OOM', 'Next 16 from ProTour OOM', 'Nächste 16 der ProTour OOM', 'Volgende 16 uit ProTour OOM'],
    pc64: ['Top 64 Players Championship OOM', 'Top 64 Players Championship OOM', 'Top 64 Players Championship OOM', 'Top 64 Players Championship OOM'],
    et32: ['Top 32 European Tour OOM', 'Top 32 European Tour OOM', 'Top 32 European Tour OOM', 'Top 32 European Tour OOM'],
    card128: ['Posiadacze karty PDC według OOM', 'PDC Tour Card holders by OOM', 'PDC-Tour-Card-Inhaber nach OOM', 'PDC Tour Card-houders volgens OOM'],
    reserves: ['Uzupełnienie: zawodnicy bez karty według OOM', 'Reserves: non-card players by OOM', 'Nachrücker ohne Tour Card nach OOM', 'Reserves zonder Tour Card volgens OOM'],
    women: ['4 kobiety spoza Top 80 OOM', '4 women outside the OOM Top 80', '4 Frauen außerhalb der OOM-Top-80', '4 vrouwen buiten de OOM Top 80'],
    youth16to18: ['1 zawodnik w wieku 16–18 lat', '1 player aged 16–18', '1 Spieler im Alter von 16–18', '1 speler van 16–18 jaar'],
    youth16to23: ['4 zawodników w wieku 16–23 lat', '4 players aged 16–23', '4 Spieler im Alter von 16–23', '4 spelers van 16–23 jaar'],
    nonCard: ['4 zawodników bez karty PDC', '4 non-Tour-Card players', '4 Spieler ohne Tour Card', '4 spelers zonder Tour Card'],
    oom81to128: ['4 kolejnych z miejsc 81–128 OOM', 'Next 4 from OOM positions 81–128', 'Nächste 4 der OOM-Plätze 81–128', 'Volgende 4 van OOM-plaatsen 81–128'],
    oomFallback: ['Uzupełnienie brakujących miejsc według OOM', 'Unfilled places allocated by OOM', 'Auffüllen freier Plätze nach OOM', 'Open plaatsen aangevuld volgens OOM'],
    worldsNote: ['Top 80 wchodzi bezpośrednio. Kolejne pule pomijają już zakwalifikowanych. Decyduje OOM, następnie ProTour i OVR; brak kandydatów uzupełnia OOM.', 'The Top 80 qualify directly. Later routes exclude players already selected. Order: OOM, then ProTour and OVR; missing places are filled by OOM.', 'Die Top 80 qualifizieren sich direkt. Weitere Wege schließen bereits Qualifizierte aus. Reihenfolge: OOM, ProTour, OVR; freie Plätze werden nach OOM ergänzt.', 'De Top 80 plaatst zich direct. Latere routes sluiten reeds geplaatste spelers uit. Volgorde: OOM, ProTour, OVR; open plaatsen worden via OOM aangevuld.'],
    card: ['Kwalifikator posiadaczy karty PDC', 'PDC Tour Card qualifier', 'PDC-Tour-Card-Qualifikation', 'PDC Tour Card-kwalificatie'],
    host: ['Kwalifikator gospodarzy bez karty', 'Host-nation qualifier without Tour Cards', 'Gastgeberqualifikation ohne Tour Card', 'Gastlandkwalificatie zonder Tour Card'],
    nordicBaltic: ['Kwalifikator nordycko-bałtycki bez karty', 'Nordic & Baltic non-card qualifier', 'Nordisch-baltische Qualifikation ohne Tour Card', 'Noords-Baltische kwalificatie zonder Tour Card'],
    eastEurope: ['Kwalifikator Europy Wschodniej bez karty', 'Eastern Europe non-card qualifier', 'Osteuropa-Qualifikation ohne Tour Card', 'Oost-Europese kwalificatie zonder Tour Card'],
    continentalNote: ['Bezpośredni awans: 16 z OOM i 16 kolejnych z ProTour, wyłącznie z kartą PDC. Pozostałe 16 miejsc pochodzi z czterech kwalifikatorów.', 'Direct places: 16 OOM and the next 16 ProTour players, all with Tour Cards. Four qualifiers award the remaining 16 places.', 'Direktplätze: 16 OOM und die nächsten 16 ProTour-Spieler, alle mit Tour Card. Vier Qualifikationen vergeben die übrigen 16 Plätze.', 'Direct: 16 OOM-spelers en de volgende 16 ProTour-spelers, allemaal met Tour Card. Vier kwalificaties verdelen de overige 16 plaatsen.'],
    automatic: ['Awans bezpośredni: Top 16 OOM + 24 kolejnych z ProTour', 'Direct: Top 16 OOM + next 24 ProTour', 'Direkt: Top 16 OOM + nächste 24 ProTour', 'Direct: Top 16 OOM + volgende 24 ProTour'],
    ws24: ['Top 24 World Series (braki uzupełnia OOM)', 'Top 24 World Series (gaps filled by OOM)', 'Top 24 World Series (freie Plätze nach OOM)', 'Top 24 World Series (aangevuld via OOM)'],
    wsOom4: ['4 kolejnych według OOM', 'Next 4 by OOM', 'Nächste 4 nach OOM', 'Volgende 4 volgens OOM'],
    region: ['Pula regionalna: {region}', 'Regional route: {region}', 'Regionaler Weg: {region}', 'Regionale route: {region}'],
    asia: ['Azja — pozostali zawodnicy', 'Asia — remaining players', 'Asien — übrige Spieler', 'Azië — overige spelers'],
    belgiumNetherlands: ['Belgia i Holandia', 'Belgium & Netherlands', 'Belgien & Niederlande', 'België & Nederland'],
    mediterranean: ['Kraje śródziemnomorskie', 'Mediterranean countries', 'Mittelmeerländer', 'Mediterrane landen'],
    southEastEurope: ['Europa Południowo-Wschodnia', 'South-Eastern Europe', 'Südosteuropa', 'Zuidoost-Europa'],
    dach: ['Niemcy, Austria, Szwajcaria', 'Germany, Austria, Switzerland', 'Deutschland, Österreich, Schweiz', 'Duitsland, Oostenrijk, Zwitserland'],
    ukIreland: ['UK i Irlandia', 'UK & Ireland', 'UK & Irland', 'VK & Ierland'],
    northAmerica: ['Ameryka Północna', 'North America', 'Nordamerika', 'Noord-Amerika'],
    caribbeanSouthAmerica: ['Karaiby i Ameryka Południowa', 'Caribbean & South America', 'Karibik & Südamerika', 'Cariben & Zuid-Amerika'],
    scandinaviaBaltic: ['Skandynawia i kraje bałtyckie', 'Scandinavia & Baltic countries', 'Skandinavien & Baltikum', 'Scandinavië & Baltische landen'],
    oceania: ['Oceania', 'Oceania', 'Ozeanien', 'Oceanië'],
    africa: ['Afryka', 'Africa', 'Afrika', 'Afrika'],
    total: ['Aktualny główny OOM', 'Current main OOM', 'Aktuelle Haupt-OOM', 'Huidige hoofd-OOM'],
    days: ['Najbliższe {days} dni', 'Next {days} days', 'Nächste {days} Tage', 'Komende {days} dagen'],
    expires: ['Wypada z OOM', 'Expires from OOM', 'Verfällt aus der OOM', 'Vervalt uit OOM'],
    remaining: ['Pozostanie: {money}', 'Remaining: {money}', 'Verbleibend: {money}', 'Resterend: {money}'],
    projectedRank: ['Prognozowane miejsce: #{rank}', 'Projected position: #{rank}', 'Prognostizierter Rang: #{rank}', 'Verwachte positie: #{rank}'],
    forecastNote: ['Prognoza bez nowych nagród u wszystkich zawodników. Wygasają tylko pieniądze rankingowe — budżet pozostaje bez zmian.', 'Projection with no new prizes for any player. Only ranking money expires; your wallet is unchanged.', 'Prognose ohne neue Preisgelder für alle Spieler. Nur Ranglistenpreisgeld verfällt; dein Budget bleibt unverändert.', 'Prognose zonder nieuwe prijzen voor alle spelers. Alleen rankinggeld vervalt; je budget verandert niet.'],
    inside: ['Jesteś w Top {limit}', 'You are in the Top {limit}', 'Du bist in den Top {limit}', 'Je staat in de Top {limit}'],
    outside: ['Do Top {limit}', 'To reach the Top {limit}', 'Bis zu den Top {limit}', 'Tot de Top {limit}'],
    margin: ['Przewaga nad pierwszym poza progiem: {money}', 'Lead over first outside the cutoff: {money}', 'Vorsprung vor dem ersten außerhalb: {money}', 'Voorsprong op de eerste buiten de grens: {money}'],
    gap: ['Do kwoty na progu brakuje: {money}', 'Gap to the cutoff total: {money}', 'Abstand zum Grenzbetrag: {money}', 'Achterstand op het grensbedrag: {money}'],
    noBoundary: ['Brak zawodnika poza tym progiem.', 'No player beyond this cutoff.', 'Kein Spieler außerhalb dieser Grenze.', 'Geen speler buiten deze grens.'],
    tieNote: ['Równa kwota nie gwarantuje miejsca. Top 64 OOM chroni kartę PDC; Top 80 to bezpośrednia ścieżka do MŚ.', 'An equal total does not guarantee a place. Top 64 OOM protects a Tour Card; Top 80 is the direct World Championship route.', 'Ein gleicher Betrag garantiert keinen Platz. Top 64 schützt die Tour Card; Top 80 ist der direkte WM-Weg.', 'Een gelijk bedrag garandeert geen plaats. Top 64 beschermt de Tour Card; Top 80 is de directe WK-route.'],
    expiries: ['Terminy utraty pieniędzy rankingowych', 'Ranking money expiry dates', 'Ablaufdaten des Ranglistenpreisgeldes', 'Vervaldata van rankinggeld'],
    expiryDate: ['Data wygaśnięcia', 'Expiry date', 'Ablaufdatum', 'Vervaldatum'],
    prize: ['Źródło nagrody', 'Prize source', 'Preisgeldquelle', 'Bron van prijzengeld'],
    amount: ['Kwota', 'Amount', 'Betrag', 'Bedrag'],
    noExpiries: ['Nie masz obecnie pieniędzy rankingowych do obrony.', 'You currently have no ranking money to defend.', 'Du hast aktuell kein Ranglistenpreisgeld zu verteidigen.', 'Je hebt momenteel geen rankinggeld te verdedigen.'],
    reconciliation: ['Historyczne wyrównanie OOM', 'Historical OOM adjustment', 'Historische OOM-Anpassung', 'Historische OOM-correctie'],
    legacy: ['Historyczna nagroda', 'Historical prize', 'Historisches Preisgeld', 'Historische prijs'],
    seasonTotal: ['{name} — suma sezonu {year}', '{name} — season {year} total', '{name} — Saison {year} gesamt', '{name} — seizoenstotaal {year}']
};

function trPlanning(key, values = {}) {
    const index = Math.max(0, ['pl', 'en', 'de', 'nl'].indexOf(typeof currentLang === 'string' ? currentLang : 'en'));
    let text = CAREER_PLANNING_TEXT[key]?.[index] || key;
    Object.entries(values).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); });
    return text;
}

function getPlanningRouteLabel(key) {
    const countries = { poland: 'Polska', czechia: 'Czechy', india: 'Indie', china: 'Chiny', japan: 'Japonia', hungary: 'Węgry', usa: 'USA', canada: 'Kanada' };
    return countries[key] ? trPlanning('region', { region: t(countries[key]) }) : trPlanning(key);
}

function getPlanningTournamentKind(tournament) {
    if (!tournament || String(tournament.specialType || '').toLowerCase().includes('qualifier')) return '';
    if (isWorldMastersFinalsTournament(tournament)) return 'worldSeries';
    if (isContinentalTourTournament(tournament)) return 'continental';
    const name = String(tournament.name || '').toLowerCase();
    if (name.includes('world darts championship') || name.includes('global darts championship')) return 'worlds';
    if (name.includes('grand slam') || name.includes("champion's slam")) return 'slam';
    if (name.includes('matchplay') || name.includes('grand prix') || name.includes('uk open') || name.includes('british open')
        || name.includes('players championship finals') || name.includes('pro players finals') || isEuropeanChampionshipTournament(tournament)) return 'ranking';
    return '';
}

function buildQualificationPreview(tournament, candidates, referenceDate = currentDate, careerPlayer = player) {
    const year = referenceDate.getFullYear();
    const all = uniquePdcTourCardPlayers(candidates);
    const key = getPdcTourCardPlayerKey;
    const resolve = ids => resolvePdcTourCardPlayerKeys(ids, all);
    const kind = getPlanningTournamentKind(tournament);
    const groups = [];
    const add = (route, places, players, confirmed = false, pending = false, eligible = []) => {
        groups.push({ key: route, places, players, confirmed, pending, eligible });
    };
    let note = '', size = 0;
    if (kind === 'worlds') {
        const saved = tournament.worldChampionshipQualification;
        const locked = saved?.year === year && saved.version === WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION
            && resolve(saved.playerIds).length === WORLD_CHAMPIONSHIP_FIELD_SIZE;
        if (locked) {
            if (Array.isArray(saved.categories) && saved.categories.length) saved.categories.forEach(category => add(category.key, category.requested, resolve(category.playerIds), true));
            else add('draw', WORLD_CHAMPIONSHIP_FIELD_SIZE, resolve(saved.playerIds), true);
        } else {
            buildWorldChampionshipQualification(all, referenceDate).categories
                .forEach(category => add(category.key, category.requested, resolve(category.playerIds)));
        }
        size = WORLD_CHAMPIONSHIP_FIELD_SIZE;
        note = 'worldsNote';
    } else if (kind === 'ranking') {
        (getRankingQualificationGroups(tournament, all) || []).forEach(group => add(group.key, group.places, group.players));
        size = groups.reduce((sum, group) => sum + group.places, 0);
        // UK Open rezerwy wypełniają miejsca kartowiczów, nie powiększają stawki.
        if (groups.some(group => group.key === 'card128')) size = 128;
    } else if (kind === 'continental') {
        const saved = tournament.continentalQualification;
        const locked = saved?.year === year && saved.version === CONTINENTAL_QUALIFICATION_VERSION
            && Array.isArray(saved.oomPlayerIds) && Array.isArray(saved.proTourPlayerIds);
        const automatic = buildContinentalAutomaticField(all);
        const state = locked ? JSON.parse(JSON.stringify(saved)) : {
            oomPlayerIds: automatic.oomPlayers.map(key), proTourPlayerIds: automatic.proTourPlayers.map(key), paths: {}
        };
        add('oom16', 16, resolve(state.oomPlayerIds), locked);
        add('pt16', 16, resolve(state.proTourPlayerIds), locked);
        Object.entries(CONTINENTAL_QUALIFIER_PATHS).forEach(([path, config]) => {
            const pathState = state.paths?.[path];
            const complete = pathState?.completed === true;
            const selected = resolve(pathState?.qualifiedPlayerIds || [])
                .filter(p => isContinentalQualifierPathEligible(p, tournament, path)).slice(0, config.places);
            add(path, config.places, selected, complete, !complete,
                complete ? [] : buildContinentalQualifierPool(tournament, path, state, all));
        });
        size = 48;
        note = 'continentalNote';
    } else if (kind === 'slam') {
        const qualifier = tournamentDatabase.find(event => event.specialType === 'pdcTourCardQualifier'
            && [tournament.name, tournament.sourceName].filter(Boolean).includes(event.qualifierFor));
        const saved = tournament.pdcTourCardQualification;
        const state = saved?.year === year ? saved : null;
        const automatic = state ? resolve(state.automaticPlayerIds) : buildPdcTourCardAutomaticField(tournament, all);
        add('automatic', 40, automatic, Boolean(state));
        const used = new Set(automatic.map(key));
        const eligible = all.filter(p => p.hasTourCard === true && !used.has(key(p)));
        if (qualifier) {
            add('card', state?.qualifyingPlaces || Number(qualifier.qualifyingPlaces) || 8,
                resolve(state?.qualifiedPlayerIds || []).filter(p => eligible.includes(p)), state?.completed === true,
                state?.completed !== true, eligible);
        } else {
            // Starsze kalendarze bez kwalifikatora korzystają w grze z ProTour.
            add('oomFallback', 8, [...all].sort((a, b) => (b.proTourPrizeMoney || 0) - (a.proTourPrizeMoney || 0))
                .filter(p => !used.has(key(p))).slice(0, 8));
        }
        size = 48;
    } else if (kind === 'worldSeries') {
        const state = typeof worldMastersState !== 'undefined' && worldMastersState?.year === year ? worldMastersState : {};
        const wsKey = getWorldMastersPlayerKey;
        const byKey = new Map(all.map(p => [wsKey(p), p]));
        const resolveWs = ids => (ids || []).map(id => byKey.get(id)).filter(Boolean);
        const finals = state.finals;
        const locked = resolveWs(finals?.participantKeys).length === 32;
        const automatic = getWorldMastersAutomaticFinalistKeys(all, state);
        const seriesKeys = locked ? finals.worldSeriesKeys : completeWorldMastersFieldKeys(automatic.worldSeriesKeys, 24, [], all);
        const oomKeys = locked ? finals.oomKeys : completeWorldMastersFieldKeys(automatic.oomKeys, 4, seriesKeys, all);
        add('ws24', 24, resolveWs(seriesKeys), locked);
        add('wsOom4', 4, resolveWs(oomKeys), locked);
        const direct = new Set([...seriesKeys, ...oomKeys]);
        const qualifier = state.finalsQualifier;
        const qualified = resolveWs(locked ? finals.qualifierKeys : qualifier?.qualifiedKeys)
            .filter(p => p.hasTourCard === true && !direct.has(wsKey(p))).slice(0, 4);
        add('card', 4, qualified, locked || qualifier?.completed === true, !locked && !qualifier?.completed,
            all.filter(p => p.hasTourCard === true && !direct.has(wsKey(p))));
        size = 32;
    }

    // W otwartej drabince liczą się faktycznie zapisane nazwiska, nie nowa prognoza.
    if (typeof activeTournament !== 'undefined' && activeTournament?.name === tournament?.name
        && typeof tournamentRound !== 'undefined' && tournamentRound === size
        && typeof tournamentBracket !== 'undefined' && tournamentBracket.length === size
        && tournamentBracket.every(p => p && !p.isBye)) {
        groups.length = 0;
        add('draw', size, tournamentBracket, true);
    }
    const ownKey = key(careerPlayer);
    const selectedGroup = groups.find(group => group.players.some(p => key(p) === ownKey));
    const pendingGroup = groups.find(group => group.pending && group.eligible.some(p => key(p) === ownKey));
    const status = selectedGroup ? (selectedGroup.confirmed ? 'confirmed' : 'in') : pendingGroup ? 'pending' : 'out';
    return { groups, size, kind, note, status, route: selectedGroup?.key || pendingGroup?.key || '',
        count: new Set(groups.flatMap(group => group.players.map(key))).size };
}

let careerPlanningTab = 'qualification';
let careerPlanningTournamentIndex = null;

function getPlanningDate(date) {
    const locale = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[currentLang] || 'en-GB';
    return new Date(date).toLocaleDateString(locale);
}

function planningMoney(amount) { return `£${Number(amount || 0).toLocaleString('en-GB')}`; }

function getPlanningTournaments() {
    const year = currentDate.getFullYear();
    return tournamentDatabase.map((tournament, index) => ({ tournament, index,
        date: new Date(year, tournament.month, tournament.day),
        end: new Date(year, tournament.endMonth ?? tournament.month, tournament.endDay ?? tournament.day)
    })).filter(entry => !entry.tournament.completed && entry.end >= currentDate && getPlanningTournamentKind(entry.tournament))
        .sort((a, b) => a.date - b.date || a.index - b.index);
}

function updateCareerPlanningStrings() {
    const keys = { 'planning-title': 'title', 'planning-tile-title': 'title', 'planning-tile-desc': 'tile',
        'planning-tab-qualification': 'qualification', 'planning-tab-defence': 'defence',
        'planning-calendar-link': 'qualification', 'planning-ranking-link': 'defence', 'planning-back': 'back' };
    Object.entries(keys).forEach(([id, key]) => {
        const node = document.getElementById(id);
        if (node) node.textContent = (id === 'planning-tile-title' ? '📊 ' : '') + trPlanning(key);
    });
}

function refreshCareerPlanningTranslations() {
    updateCareerPlanningStrings();
    if (document.getElementById('screen-planning')?.classList.contains('active')) renderCareerPlanning();
}

function showCareerPlanning(tab = 'qualification', tournamentIndex = null) {
    careerPlanningTab = tab === 'defence' ? 'defence' : 'qualification';
    if (Number.isInteger(tournamentIndex)) careerPlanningTournamentIndex = tournamentIndex;
    updateCareerPlanningStrings();
    renderCareerPlanning();
    showScreen('screen-planning');
}

function renderCareerPlanning() {
    const content = document.getElementById('planning-content');
    if (!content) return;
    ['qualification', 'defence'].forEach(tab => {
        const button = document.getElementById(`planning-tab-${tab}`);
        button?.setAttribute('aria-pressed', String(careerPlanningTab === tab));
    });
    if (!player?.name) { content.innerHTML = `<p>${escapeHtml(trPlanning('noPlayer'))}</p>`; return; }
    const candidates = getPdcTourCardPlayers(true);
    refreshMainOrderOfMerit(candidates, currentDate);
    refreshProTourOrderOfMerit(candidates, currentDate);
    content.innerHTML = careerPlanningTab === 'defence' ? renderPlanningDefence(candidates) : renderPlanningQualification(candidates);
    const select = document.getElementById('planning-tournament');
    if (select) select.addEventListener('change', () => {
        careerPlanningTournamentIndex = Number(select.value);
        renderCareerPlanning();
        document.getElementById('planning-tournament')?.focus();
    });
}

function renderPlanningQualification(candidates) {
    const events = getPlanningTournaments();
    if (!events.length) return `<p class="planning-note">${escapeHtml(trPlanning('noEvents'))}</p>`;
    const selected = events.find(entry => entry.index === careerPlanningTournamentIndex)
        || events.find(entry => getPlanningTournamentKind(entry.tournament) === 'worlds') || events[0];
    careerPlanningTournamentIndex = selected.index;
    const preview = buildQualificationPreview(selected.tournament, candidates);
    const label = getPlanningRouteLabel(preview.route);
    const reason = preview.status === 'out' ? trPlanning('outReason')
        : preview.status === 'pending' ? trPlanning('pendingReason', { route: label }) : label;
    const options = events.map(entry => `<option value="${entry.index}"${entry.index === selected.index ? ' selected' : ''}>${escapeHtml(getPlanningDate(entry.date))} · ${escapeHtml(getTournamentDisplayName(entry.tournament))}</option>`).join('');
    const ownKey = getPdcTourCardPlayerKey(player);
    const groups = preview.groups.filter(group => group.places > 0).map((group, index) => {
        const own = group.players.some(p => getPdcTourCardPlayerKey(p) === ownKey);
        const rows = group.players.map(p => `<li${getPdcTourCardPlayerKey(p) === ownKey ? ' class="planning-me"' : ''}><span>${getFlagImg(p.country)} ${escapeHtml(p.name)}</span><span>OVR ${Math.round(p.ovr ?? p.overall)} · ${planningMoney(p.prizeMoney)}</span></li>`).join('');
        return `<details class="planning-route"${own || index === 0 ? ' open' : ''}>
            <summary>${escapeHtml(getPlanningRouteLabel(group.key))}<span>${group.players.length}/${group.places}${group.confirmed ? ' ✓' : ''}</span></summary>
            ${group.pending ? `<p class="planning-note">${escapeHtml(trPlanning('placesPending'))}</p>` : ''}
            ${rows ? `<ul>${rows}</ul>` : `<p class="planning-note">${escapeHtml(trPlanning('emptyGroup'))}</p>`}</details>`;
    }).join('');
    return `<label class="planning-label" for="planning-tournament">${escapeHtml(trPlanning('tournament'))}</label>
        <select id="planning-tournament">${options}</select>
        <p class="planning-note">${escapeHtml(trPlanning('eventDate', { date: getPlanningDate(selected.date) }))} · ${escapeHtml(trPlanning('asOf', { date: getPlanningDate(currentDate) }))}</p>
        <section class="planning-status planning-${preview.status}" aria-live="polite"><strong>${escapeHtml(trPlanning(preview.status))}</strong><p>${escapeHtml(reason)}</p></section>
        <p class="planning-note">${escapeHtml(trPlanning('notice'))}</p>
        ${preview.note ? `<p class="planning-rule">${escapeHtml(trPlanning(preview.note))}</p>` : ''}
        <h3 class="planning-field-count">${escapeHtml(trPlanning('field', { count: preview.count, total: preview.size }))}</h3>${groups}`;
}

function getPlanningPrizeName(entry) {
    const key = entry.eventKey || entry.tournament || '';
    if (key.includes('opening-reconciliation') || key === '__opening_oom_reconciliation__') return trPlanning('reconciliation');
    const historical = key.match(/^(players-championship-finals|players-championship|european-tour|uk-open|world-championship|world-matchplay|world-grand-prix|european-championship|grand-slam)-(\d{4})$/);
    if (historical) {
        const names = { 'players-championship-finals': 'Players Championship Finals', 'players-championship': 'Players Championship',
            'european-tour': 'European Tour', 'uk-open': 'UK Open', 'world-championship': 'World Darts Championship',
            'world-matchplay': 'World Matchplay', 'world-grand-prix': 'World Grand Prix',
            'european-championship': 'European Championship', 'grand-slam': 'Grand Slam of Darts' };
        const name = names[historical[1]], year = historical[2];
        return ['players-championship', 'european-tour'].includes(historical[1]) ? trPlanning('seasonTotal', { name, year }) : `${name} ${year}`;
    }
    return key.startsWith('__') ? trPlanning('legacy') : getTournamentDisplayName(entry.tournament || trPlanning('legacy'));
}

function renderPlanningDefence(candidates) {
    const overview = getMainOomDefenceOverview(player, candidates, currentDate);
    const cards = overview.windows.map(window => `<section class="planning-card"><h3>${escapeHtml(trPlanning('days', { days: window.days }))}</h3>
        <span>${escapeHtml(trPlanning('expires'))}</span><strong class="planning-loss">${planningMoney(window.expiring)}</strong>
        <p>${escapeHtml(trPlanning('remaining', { money: planningMoney(window.remaining) }))}</p>
        <p>${escapeHtml(trPlanning('projectedRank', { rank: window.rank }))}</p><small>${getPlanningDate(window.date)}</small></section>`).join('');
    const targets = overview.targets.map(target => `<section class="planning-card"><h3>${escapeHtml(trPlanning(target.inside ? 'inside' : 'outside', { limit: target.limit }))}</h3>
        <p>${escapeHtml(target.difference === null ? trPlanning('noBoundary') : trPlanning(target.inside ? 'margin' : 'gap', { money: planningMoney(target.difference) }))}</p>
        ${target.boundary ? `<small>${escapeHtml(target.boundary.name)}</small>` : ''}</section>`).join('');
    const entries = overview.entries.map(entry => `<tr><td>${getPlanningDate(entry.expiresAt)}</td><td>${escapeHtml(getPlanningPrizeName(entry))}</td><td>${planningMoney(entry.amount)}</td></tr>`).join('');
    return `<p class="planning-note">${escapeHtml(trPlanning('asOf', { date: getPlanningDate(currentDate) }))}</p>
        <section class="planning-status"><strong>${escapeHtml(player.name)} · #${overview.rank} · ${planningMoney(overview.total)}</strong><p>${escapeHtml(trPlanning('total'))}</p></section>
        <div class="planning-grid">${cards}</div><p class="planning-note">${escapeHtml(trPlanning('forecastNote'))}</p>
        <div class="planning-grid">${targets}</div><p class="planning-note">${escapeHtml(trPlanning('tieNote'))}</p>
        <h3>${escapeHtml(trPlanning('expiries'))}</h3>${entries ? `<div class="planning-table-wrap"><table class="planning-table"><thead><tr><th scope="col">${escapeHtml(trPlanning('expiryDate'))}</th><th scope="col">${escapeHtml(trPlanning('prize'))}</th><th scope="col">${escapeHtml(trPlanning('amount'))}</th></tr></thead><tbody>${entries}</tbody></table></div>` : `<p class="planning-note">${escapeHtml(trPlanning('noExpiries'))}</p>`}`;
}
