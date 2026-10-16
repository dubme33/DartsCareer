// Canonical PDC entitlement. Compatibility fields are mirrors, never separate grants.
const PDC_CARD_OPENING_GRANTS = Object.freeze([
    { source: 'challenge-tour', start: 2024, through: 2025, indices: [239, 107] },
    { source: 'challenge-tour', start: 2025, through: 2026, indices: [69, 78] },
    { source: 'development-tour', start: 2025, through: 2026, indices: [37, 55] },
    { source: 'qschool', start: 2025, through: 2026,
      indices: [73,43,88,80,67,74,101,70,98,68,99,79,86,91,95,100,71,75,145,56,84,124,134,77,125,117,66,85,89] },
    { source: 'challenge-tour', start: 2026, through: 2027, indices: [129, 90] },
    { source: 'development-tour', start: 2026, through: 2027, indices: [76, 107] }
]);

function getPdcCardRecord(candidate) {
    if (!candidate) return null;
    if (!candidate.pdcTourCard || candidate.pdcTourCard.version !== 2) {
        candidate.pdcTourCard = { version: 2, guaranteeStartYear: null, guaranteedThroughYear: null,
            guaranteeSource: null, retainedYear: null, lostYear: null, history: [] };
    }
    if (!Array.isArray(candidate.pdcTourCard.history)) candidate.pdcTourCard.history = [];
    return candidate.pdcTourCard;
}

function hasPdcTourCardForYear(candidate, year = getPdcTourCardReferenceYear()) {
    if (!candidate || !isPdcTourCardSystemEnabled() || !isPdcTourCardEligiblePlayer(candidate)) return false;
    const card = candidate.pdcTourCard;
    if (!card || card.version !== 2) return candidate.hasTourCard === true;
    return Number(card.retainedYear) === Number(year)
        || (Number.isInteger(card.guaranteeStartYear) && card.guaranteeStartYear <= year
            && Number.isInteger(card.guaranteedThroughYear) && card.guaranteedThroughYear >= year);
}

function syncPdcTourCard(candidate, year = getPdcTourCardReferenceYear()) {
    const card = getPdcCardRecord(candidate);
    if (!card) return candidate;
    candidate.hasTourCard = hasPdcTourCardForYear(candidate, year);
    const guaranteed = candidate.hasTourCard && card.guaranteeStartYear <= year && card.guaranteedThroughYear >= year;
    candidate.tourCardSource = candidate.hasTourCard ? (guaranteed ? card.guaranteeSource : 'oom') : null;
    candidate.tourCardStartYear = guaranteed ? card.guaranteeStartYear : (candidate.hasTourCard ? year : null);
    candidate.tourCardExpiryYear = guaranteed ? card.guaranteedThroughYear + 1 : (candidate.hasTourCard ? year + 1 : null);
    candidate.tourCardCycleYear = year;
    candidate.tourCardSystemVersion = 2;
    return candidate;
}

function appendPdcCardHistory(card, entry) {
    if (!card.history.some(saved => saved.type === entry.type && saved.year === entry.year && saved.source === entry.source))
        card.history.push(entry);
}

function setPdcTourCard(candidate, source, year) {
    if (!candidate) return candidate;
    if (!isPdcTourCardSystemEnabled()) return clearPdcTourCard(candidate, year);
    const card = getPdcCardRecord(candidate);
    if (source === 'oom') {
        if (card.qSchoolBarredYear === year || card.resignedYear === year) return syncPdcTourCard(candidate, year);
        card.retainedYear = year;
        appendPdcCardHistory(card, { type: 'retained', source: 'oom', year });
    } else {
        card.guaranteeStartYear = year;
        card.guaranteedThroughYear = year + getPdcTourCardSetting('durationYears', 2) - 1;
        card.guaranteeSource = source;
        appendPdcCardHistory(card, { type: 'won', source, year, through: card.guaranteedThroughYear });
    }
    return syncPdcTourCard(candidate, year);
}

function clearPdcTourCard(candidate, year = getPdcTourCardReferenceYear()) {
    if (!candidate) return candidate;
    const card = getPdcCardRecord(candidate);
    if (candidate.hasTourCard) {
        appendPdcCardHistory(card, { type: 'lost', source: candidate.tourCardSource, year });
        card.lostYear = year;
    }
    // Explicit editor removal cancels entitlement, but retains its historical record.
    card.guaranteeStartYear = null; card.guaranteedThroughYear = null; card.guaranteeSource = null; card.retainedYear = null;
    return syncPdcTourCard(candidate, year);
}

function resignPdcTourCard(candidate, year = getPdcTourCardReferenceYear()) {
    if (!hasPdcTourCardForYear(candidate, year)) return false;
    const card = getPdcCardRecord(candidate);
    clearPdcTourCard(candidate, year);
    card.resignedYear = year;
    card.qSchoolBarredYear = year + 1;
    appendPdcCardHistory(card, { type: 'resigned', source: 'voluntary', year });
    return true;
}

function initializePdcTourCards2026(candidates, referenceDate = currentDate) {
    const year = getPdcTourCardReferenceYear(referenceDate);
    const ranked = uniquePdcTourCardPlayers(candidates).sort(comparePdcTourCardRanking);
    if (year !== 2026) return migratePdcTourCardSystem(ranked, referenceDate);
    ranked.forEach(candidate => {
        candidate.pdcTourCard = { version: 2, guaranteeStartYear: null, guaranteedThroughYear: null,
            guaranteeSource: null, retainedYear: null, lostYear: null, history: [] };
    });
    if (isPdcTourCardSystemEnabled()) {
        ranked.slice(0, getPdcTourCardSetting('oomPlaces', 64)).forEach(candidate => setPdcTourCard(candidate, 'oom', year));
        for (const grant of PDC_CARD_OPENING_GRANTS) {
            for (const candidate of ranked) {
                if (!grant.indices.includes(candidate.defaultTemplateIndex)) continue;
                const card = getPdcCardRecord(candidate);
                card.guaranteeStartYear = grant.start; card.guaranteedThroughYear = grant.through;
                card.guaranteeSource = grant.source;
                appendPdcCardHistory(card, { type: 'won', source: grant.source, year: grant.start, through: grant.through, historical: true });
            }
        }
    }
    ranked.forEach(candidate => {
        const card = getPdcCardRecord(candidate);
        if (card.guaranteedThroughYear === year - 1 && !hasPdcTourCardForYear(candidate, year)) {
            card.lostYear = year;
            appendPdcCardHistory(card, { type: 'lost', source: card.guaranteeSource, year, historical: true });
        }
        syncPdcTourCard(candidate, year);
    });
    return ranked;
}

function migratePdcTourCardSystem(candidates, referenceDate = currentDate) {
    const year = getPdcTourCardReferenceYear(referenceDate);
    const ranked = uniquePdcTourCardPlayers(candidates).sort(comparePdcTourCardRanking);
    for (const candidate of ranked) {
        if (candidate.pdcTourCard?.version !== 2) {
            const held = candidate.hasTourCard === true;
            const start = Number(candidate.tourCardStartYear), expiry = Number(candidate.tourCardExpiryYear);
            const source = candidate.tourCardSource || 'legacy';
            const card = getPdcCardRecord(candidate);
            if (held) {
                // Preserve known old guarantees, including old OOM grants. Unknown rights last
                // the loaded season only; never apply historical real-world grants to a save.
                card.guaranteeStartYear = Number.isInteger(start) && start > 1900 ? start : year;
                card.guaranteedThroughYear = Number.isInteger(expiry) && expiry > 1900 ? expiry - 1 : year;
                card.guaranteeSource = source;
                appendPdcCardHistory(card, { type: 'migrated', source, year, through: card.guaranteedThroughYear });
            }
            card.migrated = true;
        }
        syncPdcTourCard(candidate, year);
    }
    return ranked;
}

function getPdcCardSeasonStore(owner = (typeof player !== 'undefined' ? player : null)) {
    if (!owner) return {};
    if (!owner.pdcTourCardSeasons || typeof owner.pdcTourCardSeasons !== 'object') owner.pdcTourCardSeasons = {};
    return owner.pdcTourCardSeasons;
}

function snapshotPdcTourCardSeason(candidates, completedYear, owner = player) {
    const store = getPdcCardSeasonStore(owner);
    if (store[completedYear]?.snapshot) return store[completedYear];
    const ranked = uniquePdcTourCardPlayers(candidates).sort(comparePdcTourCardRanking);
    const snapshot = { top64: ranked.slice(0, getPdcTourCardSetting('oomPlaces', 64)).map(getPdcTourCardPlayerKey),
        holders: ranked.filter(candidate => hasPdcTourCardForYear(candidate, completedYear)).map(getPdcTourCardPlayerKey),
        challengeTour: getPdcSecondaryTourCardRanking(ranked, 'challengeTour', completedYear).map(getPdcTourCardPlayerKey),
        developmentTour: getPdcSecondaryTourCardRanking(ranked, 'developmentTour', completedYear).map(getPdcTourCardPlayerKey) };
    return store[completedYear] = { version: 2, year: completedYear, snapshot, settled: false };
}

function settlePdcTourCardSeason(candidates, completedYear, owner = player) {
    const players = uniquePdcTourCardPlayers(candidates), year = completedYear + 1;
    const state = snapshotPdcTourCardSeason(players, completedYear, owner);
    if (state.settled) { players.forEach(candidate => syncPdcTourCard(candidate, year)); return state; }
    if (isPdcTourCardSystemEnabled()) {
        players.filter(candidate => state.snapshot.top64.includes(getPdcTourCardPlayerKey(candidate)))
            .forEach(candidate => setPdcTourCard(candidate, 'oom', year));
        players.forEach(candidate => syncPdcTourCard(candidate, year));
        awardPdcSecondaryTourCards(players, completedYear, owner);
    } else players.forEach(candidate => clearPdcTourCard(candidate, year));
    state.lostPlayerIds = state.snapshot.holders.filter(key => !players.some(candidate => getPdcTourCardPlayerKey(candidate) === key && hasPdcTourCardForYear(candidate, year)));
    for (const candidate of players) {
        if (!state.lostPlayerIds.includes(getPdcTourCardPlayerKey(candidate))) continue;
        const card = getPdcCardRecord(candidate); card.lostYear = year;
        appendPdcCardHistory(card, { type: 'lost', source: card.guaranteeSource || 'oom', year });
    }
    state.vacancies = Math.max(0, getPdcTourCardTotalPlaces() - getPdcTourCardHolders(players, year).length);
    state.settled = true;
    return state;
}

function awardPdcSecondaryTourCards(candidates, completedYear, owner = (typeof player !== 'undefined' ? player : null)) {
    const year = Number(completedYear), cardStartYear = year + 1, players = uniquePdcTourCardPlayers(candidates);
    if (!isPdcTourCardSystemEnabled() || !Number.isInteger(year) || !owner) return { processed: false, year, categories: [], recipients: [] };
    if (!Array.isArray(owner.pdcSecondaryTourCardAwards)) owner.pdcSecondaryTourCardAwards = [];
    const prior = owner.pdcSecondaryTourCardAwards.find(entry => entry.year === year);
    const byKey = new Map(players.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    const snapshot = getPdcCardSeasonStore(owner)[year]?.snapshot;
    const categories = ['challengeTour', 'developmentTour'].map(type => {
        if (prior) return { type, playerIds: prior[`${type}PlayerIds`] || [] };
        const ranking = snapshot?.[type] ? snapshot[type].map(key => byKey.get(key)).filter(Boolean)
            : getPdcSecondaryTourCardRanking(players, type, year);
        const awarded = [];
        const places = getPdcTourCardSetting('secondaryPlaces', 2);
        if (typeof isCareerEditorTourRankingEnabled !== 'function' || isCareerEditorTourRankingEnabled(type)) {
            for (const candidate of ranking) {
                if (awarded.length >= places) break;
                if (hasPdcTourCardForYear(candidate, cardStartYear)) continue;
                if (typeof isPdcParticipationRestricted === 'function' && isPdcParticipationRestricted(candidate, year)) continue;
                // The ranking is the record of eligible participation in the completed season.
                if (type === 'developmentTour' && typeof getDevelopmentTourSeasonAge === 'function') {
                    const age = getDevelopmentTourSeasonAge(candidate, new Date(year, 0, 4));
                    if (age !== null && (age < 16 || age > 23)) continue;
                }
                setPdcTourCard(candidate, type === 'challengeTour' ? 'challenge-tour' : 'development-tour', cardStartYear);
                awarded.push(getPdcTourCardPlayerKey(candidate));
            }
        }
        return { type, playerIds: awarded };
    });
    if (!prior) owner.pdcSecondaryTourCardAwards.push({ year, cardStartYear,
        challengeTourPlayerIds: categories[0].playerIds, developmentTourPlayerIds: categories[1].playerIds });
    return { processed: !prior, year, cardStartYear, categories,
        recipients: categories.flatMap(category => category.playerIds.map(key => byKey.get(key)).filter(Boolean)) };
}

function migratePdcSecondaryTourCardAwards() {
    // Loading is not a season transition. Existing award ledgers are preserved.
    return null;
}
function fillPdcTourCardVacancies() { return []; } // Vacancies belong to the annual Q-School.
function beginPdcTourCardCycle(candidates, referenceDate = currentDate) {
    const year = getPdcTourCardReferenceYear(referenceDate);
    const ranked = uniquePdcTourCardPlayers(candidates).sort(comparePdcTourCardRanking);
    ranked.forEach(candidate => {
        const card = getPdcCardRecord(candidate);
        if (card.retainedYear === year) card.retainedYear = null;
    });
    ranked.slice(0, getPdcTourCardSetting('oomPlaces', 64)).forEach(candidate => setPdcTourCard(candidate, 'oom', year));
    ranked.forEach(candidate => syncPdcTourCard(candidate, year));
    return ranked;
}
function processPdcTourCardCycleStart(candidates, referenceDate = currentDate) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    if (date.getMonth() !== 0 || date.getDate() !== 1 || !isPdcQSchoolYear(date)) return false;
    const year = date.getFullYear() - 1, prior = getPdcCardSeasonStore()[year]?.settled;
    settlePdcTourCardSeason(candidates, year);
    return !prior;
}
function getPdcTourCardHolders(candidates = getPdcTourCardPlayers(), year = getPdcTourCardReferenceYear()) {
    if (!isPdcTourCardSystemEnabled()) return [];
    return uniquePdcTourCardPlayers(candidates).filter(candidate => hasPdcTourCardForYear(candidate, year));
}
function getPdcNonCardPlayers(candidates = getPdcTourCardPlayers()) {
    return uniquePdcTourCardPlayers(candidates).filter(candidate => !hasPdcTourCardForYear(candidate)).sort(comparePdcTourCardRanking);
}
function getPdcQSchoolAvailablePlaces(candidates = getPdcTourCardPlayers()) {
    return Math.max(0, getPdcTourCardTotalPlaces() - getPdcTourCardHolders(candidates).length);
}
function getPdcQSchoolParticipants(candidates = getPdcTourCardPlayers(), tournament = null) {
    if (!isPdcTourCardSystemEnabled()) return [];
    if (tournament?.qSchoolStage && typeof getPdcQSchoolDayParticipants === 'function') return getPdcQSchoolDayParticipants(tournament, candidates);
    return getPdcNonCardPlayers(candidates);
}

function resetPdcNewCardOrderOfMerit(candidate, referenceDate = currentDate) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    candidate.pdcOomResetAt = date.getTime();
    if (typeof invalidateMainOrderOfMeritRefreshCache === 'function') invalidateMainOrderOfMeritRefreshCache();
    if (typeof refreshMainOrderOfMerit === 'function') refreshMainOrderOfMerit([candidate], date);
    else candidate.prizeMoney = 0;
}

function seedCareerPlayerIntoPdcTop64(candidate, candidates, referenceDate = currentDate) {
    if (!candidate || !isPdcTourCardSystemEnabled()) return false;
    // This explicit start option changes this player's entitlement only.
    setPdcTourCard(candidate, 'editor', getPdcTourCardReferenceYear(referenceDate));
    return candidate.hasTourCard;
}

function getPdcTourCardLabel(candidate) {
    if (!candidate?.hasTourCard) return '';
    const lang = typeof currentLang === 'string' ? currentLang : 'pl', card = candidate.pdcTourCard;
    const text = { pl: ['Karta PDC','Gwarancja do','Top 64 na sezon'], en: ['PDC Tour Card','Guaranteed through','Top 64 for season'],
        de: ['PDC Tour Card','Garantiert bis','Top 64 für Saison'], nl: ['PDC Tour Card','Gegarandeerd t/m','Top 64 voor seizoen'] }[lang] || ['PDC Tour Card','Guaranteed through','Top 64 for season'];
    if (!card) return text[0];
    const parts = [text[0]], year = getPdcTourCardReferenceYear();
    const sources = { pl: { qschool: 'Q-School', 'challenge-tour': 'Challenge Tour', 'development-tour': 'Development Tour', editor: 'edytor', legacy: 'starszy zapis', oom: 'starszy OOM' },
        en: { qschool: 'Q-School', 'challenge-tour': 'Challenge Tour', 'development-tour': 'Development Tour', editor: 'editor', legacy: 'legacy save', oom: 'legacy OOM' },
        de: { qschool: 'Q-School', 'challenge-tour': 'Challenge Tour', 'development-tour': 'Development Tour', editor: 'Editor', legacy: 'älterer Spielstand', oom: 'ältere OOM' },
        nl: { qschool: 'Q-School', 'challenge-tour': 'Challenge Tour', 'development-tour': 'Development Tour', editor: 'editor', legacy: 'oude opslag', oom: 'oude OOM' } };
    if (card.guaranteedThroughYear >= year) parts.push(`${text[1]} ${card.guaranteedThroughYear} (${sources[lang]?.[card.guaranteeSource] || card.guaranteeSource || text[0]})`);
    if (card.retainedYear === year) parts.push(`${text[2]} ${year}`);
    const label = parts.join(' · ');
    return typeof competitionDisplayText === 'function' ? competitionDisplayText(label) : label;
}

const PDC_TOUR_CARD_SYSTEM_VERSION = 2;
const PDC_TOUR_CARD_CYCLE_START_YEAR = 2026;
const PDC_TOUR_CARD_CYCLE_LENGTH = 2;
const PDC_TOUR_CARD_OOM_PLACES = 64;
const PDC_TOUR_CARD_QSCHOOL_PLACES = 64;
const PDC_TOUR_CARD_TOTAL = PDC_TOUR_CARD_OOM_PLACES + PDC_TOUR_CARD_QSCHOOL_PLACES;
const PDC_SECONDARY_TOUR_CARD_PLACES = 2;
const PDC_QSCHOOL_TYPE = 'pdcQSchool';
const PDC_TOUR_CARD_QUALIFIER_TYPE = 'pdcTourCardQualifier';
const PDC_QSCHOOL_DRAW_VERSION = 2;
const GRAND_SLAM_BOOTSTRAP_YEAR = 2026;
const GRAND_SLAM_TELEVISED_FINALIST_LIMIT = 24;
const GRAND_SLAM_AUTOMATIC_PLACES = 40;
const GRAND_SLAM_TOUR_CARD_QUALIFIER_PLACES = 8;
const GRAND_SLAM_QUALIFICATION_VERSION = 2;

const GRAND_SLAM_2026_BOOTSTRAP = Object.freeze({
    televised: Object.freeze([
        ['Lucas Little', 'Luke Littler'],
        ['Luke Humphreys', 'Luke Humphries'],
        ['Lucas Little', 'Luke Littler'],
        ['Nate Asp', 'Nathan Aspinall'],
        ['Lucas Little', 'Luke Littler'],
        ['Gion van Ween', 'Gian van Veen']
    ]),
    youth: Object.freeze([
        ['Gion van Ween', 'Gian van Veen'],
        ['Bo Graves', 'Beau Greaves']
    ])
});

const GRAND_SLAM_NORDIC_BALTIC_COUNTRIES = new Set([
    'Dania', 'Estonia', 'Finlandia', 'Islandia', 'Litwa', 'Łotwa', 'Norwegia', 'Szwecja'
]);
const GRAND_SLAM_ANZ_COUNTRIES = new Set(['Australia', 'Nowa Zelandia']);

function getPdcTourCardSetting(key, fallback) {
    return typeof getCareerPdcCardSetting === 'function' ? getCareerPdcCardSetting(key, fallback) : fallback;
}
function isPdcTourCardSystemEnabled() {
    return typeof isCareerPdcCardEnabled !== 'function' || isCareerPdcCardEnabled();
}
function getPdcTourCardTotalPlaces() {
    return getPdcTourCardSetting('oomPlaces', PDC_TOUR_CARD_OOM_PLACES)
        + getPdcTourCardSetting('qschoolPlaces', PDC_TOUR_CARD_QSCHOOL_PLACES);
}

function getPdcTourCardReferenceYear(referenceDate = currentDate) {
    if (Number.isInteger(referenceDate) && referenceDate >= 1900 && referenceDate <= 9999) return referenceDate;
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    return Number.isNaN(date.getTime()) ? PDC_TOUR_CARD_CYCLE_START_YEAR : date.getFullYear();
}

function getPdcTourCardCycleYear(referenceDate = currentDate) { return getPdcTourCardReferenceYear(referenceDate); }
function isPdcQSchoolYear(yearOrDate = currentDate) {
    const year = yearOrDate instanceof Date ? yearOrDate.getFullYear() : Number(yearOrDate);
    return isPdcTourCardSystemEnabled() && Number.isInteger(year) && year >= 2026;
}

function isPdcQSchoolTournament(tournament = activeTournament) {
    if (typeof hasTournamentEditorQualification === 'function' && hasTournamentEditorQualification(tournament)) return false;
    if (typeof hasCareerTourEntryOverride === 'function' && hasCareerTourEntryOverride(tournament)) return false;
    return Boolean(tournament && tournament.specialType === PDC_QSCHOOL_TYPE);
}

function isPdcTourCardQualifierTournament(tournament = activeTournament) {
    if (typeof hasTournamentEditorQualification === 'function' && hasTournamentEditorQualification(tournament)) return false;
    if (typeof hasCareerTourEntryOverride === 'function' && hasCareerTourEntryOverride(tournament)) return false;
    return Boolean(tournament && tournament.specialType === PDC_TOUR_CARD_QUALIFIER_TYPE);
}

function isTournamentScheduledForCareerYear(tournament, year = getPdcTourCardReferenceYear()) {
    if(tournament?.womensWorldMatchplayVacancy)return (tournament.womensWorldMatchplayQualifierScheduleYear??tournament.womensWorldMatchplayYear)===year;
    if (tournament?.worldYouthVacancy) return tournament.worldYouthYear === year;
    if (!isPdcQSchoolTournament(tournament)) return true;
    return isPdcQSchoolYear(year);
}

function isPdcTourCardEligiblePlayer(candidate) {
    if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return false;
    if (typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate)) return false;
    return true;
}

function getPdcTourCardPlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id || `${candidate.name || ''}|${candidate.country || ''}`;
}

function uniquePdcTourCardPlayers(candidates) {
    const unique = new Map();
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (!isPdcTourCardEligiblePlayer(candidate)) return;
        const key = getPdcTourCardPlayerKey(candidate);
        if (!unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function getPdcTourCardPlayers(includeCareerPlayer = true) {
    const candidates = Array.isArray(pdcPlayers) ? [...pdcPlayers] : [];
    if (includeCareerPlayer && typeof player !== 'undefined' && player?.name) candidates.push(player);
    return uniquePdcTourCardPlayers(candidates);
}

function comparePdcTourCardRanking(first, second) {
    return (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function isGrandSlamMainTournament(tournament) {
    if(typeof isWomensSeriesTournament==='function'&&isWomensSeriesTournament(tournament))return false;
    const name = `${tournament?.name || ''} ${tournament?.sourceName || ''}`.toLowerCase();
    return !String(tournament?.specialType || '').toLowerCase().includes('qualifier')
        && (name.includes('grand slam') || name.includes("champion's slam"));
}

function normalizeGrandSlamIdentity(value) {
    return String(value || '').trim().toLocaleLowerCase('pl');
}

function findGrandSlamPlayerByAliases(candidates, aliases) {
    const accepted = new Set((Array.isArray(aliases) ? aliases : [aliases]).map(normalizeGrandSlamIdentity));
    return uniquePdcTourCardPlayers(candidates).find(candidate => accepted.has(normalizeGrandSlamIdentity(candidate.name))
        || accepted.has(normalizeGrandSlamIdentity(candidate.sourceName))) || null;
}

function getGrandSlamQualificationEventKind(tournament) {
    if(typeof isWomensWorldMatchplayTournament==='function'&&isWomensWorldMatchplayTournament(tournament))return 'womensWorldMatchplay';
    if (!tournament || String(tournament.specialType || '').toLowerCase().includes('qualifier')) return '';
    const name = `${tournament.name || ''} ${tournament.sourceName || ''}`.toLowerCase();
    if (tournament.specialType === 'classicMasters') return 'worldMasters';
    if (tournament.specialType === 'ukOpen' || name.includes('uk open') || name.includes('british open')) return 'ukOpen';
    if (tournament.specialType === 'worldCup' || name.includes('world cup') || name.includes('puchar narodów')) return 'worldCup';
    if (tournament.specialType === 'worldMastersFinals' || name.includes('world series') && name.includes('final')) return 'worldSeriesFinals';
    if (isGrandSlamMainTournament(tournament)) return 'grandSlam';
    if (name.includes('players championship finals') || name.includes('pro players finals')) return 'playersChampionshipFinals';
    if (name.includes('world darts championship') || name.includes('global darts championship')) return 'worldChampionship';
    if (name.includes('premier league') && (name.includes('final') || name.includes('play-off'))
        || name.includes('global darts league') && name.includes('play-off')) return 'premierLeague';
    if (name.includes('world matchplay') || name.includes('global matchplay')) return 'worldMatchplay';
    if (name.includes('world grand prix') || name.includes('global grand prix')) return 'worldGrandPrix';
    if (name.includes('european championship') || name.includes('continental championship')) return 'europeanChampionship';
    if (name.includes('european tour') || /^continental tour \d+\b/.test(name)) return 'europeanTour';
    if ((name.includes('players championship') || name.includes('pro players cup')) && !name.includes('final')) return 'playersChampionship';
    return '';
}

function resolveGrandSlamHistoryPlayer(entry, candidates) {
    if (!Array.isArray(entry)) return null;
    const storedKey = String(entry[0] || '');
    const storedName = normalizeGrandSlamIdentity(entry[1]);
    const storedCountry = String(entry[2] || '');
    const roster = uniquePdcTourCardPlayers(candidates);
    if (storedKey.startsWith('id:')) {
        const id = storedKey.slice(3);
        const byId = roster.find(candidate => String(candidate.id || '') === id);
        if (byId) return byId;
    }
    if (storedKey.startsWith('name:')) {
        const key = storedKey.slice(5);
        const byLegacyKey = roster.find(candidate => getPdcTourCardPlayerKey(candidate) === key);
        if (byLegacyKey) return byLegacyKey;
    }
    return roster.find(candidate => {
        const names = [candidate.name, candidate.sourceName].map(normalizeGrandSlamIdentity);
        return names.includes(storedName) && (!storedCountry || candidate.country === storedCountry);
    }) || null;
}

function readGrandSlamFinalistsFromMatchHistory(tournament, candidates = getPdcTourCardPlayers()) {
    const history = tournament?.matchHistory;
    const finalBlock = (Array.isArray(history?.blocks) ? history.blocks : [])
        .filter(block => block?.type === 'round' && Number(block.round) === 2 && Array.isArray(block.matches))
        .at(-1);
    const match = finalBlock?.matches?.[0];
    if (!Array.isArray(match) || match.length < 4) return { winners: [], runnersUp: [] };
    const first = resolveGrandSlamHistoryPlayer(history.players?.[Number(match[0])], candidates);
    const second = resolveGrandSlamHistoryPlayer(history.players?.[Number(match[1])], candidates);
    if (!first || !second || Number(match[2]) === Number(match[3])) return { winners: [], runnersUp: [] };
    return Number(match[2]) > Number(match[3])
        ? { winners: [first], runnersUp: [second] }
        : { winners: [second], runnersUp: [first] };
}

function saveGrandSlamQualificationFinalists(tournament, year, winners, runnersUp) {
    if (!tournament || !Number.isInteger(Number(year))) return false;
    const kind = getGrandSlamQualificationEventKind(tournament);
    if (!kind) return false;
    const winnerIds = uniquePdcTourCardPlayers(winners).map(getPdcTourCardPlayerKey);
    const runnerUpIds = uniquePdcTourCardPlayers(runnersUp).map(getPdcTourCardPlayerKey);
    if (!winnerIds.length || !runnerUpIds.length) return false;
    if (!tournament.grandSlamQualificationFinalists || typeof tournament.grandSlamQualificationFinalists !== 'object') {
        tournament.grandSlamQualificationFinalists = {};
    }
    tournament.grandSlamQualificationFinalists[year] = {
        version: GRAND_SLAM_QUALIFICATION_VERSION,
        kind,
        winnerPlayerIds: winnerIds,
        runnerUpPlayerIds: runnerUpIds
    };
    return true;
}

function archiveGrandSlamTournamentFinalists(tournament, year = getPdcTourCardReferenceYear(), candidates = getPdcTourCardPlayers()) {
    const finalists = readGrandSlamFinalistsFromMatchHistory(tournament, candidates);
    return saveGrandSlamQualificationFinalists(tournament, Number(year), finalists.winners, finalists.runnersUp);
}

function archiveGrandSlamWorldCupFinalists(tournament, winnerTeam, runnerUpTeam,
    year = getPdcTourCardReferenceYear()) {
    return saveGrandSlamQualificationFinalists(tournament, Number(year), winnerTeam?.players || [], runnerUpTeam?.players || []);
}

function findGrandSlamQualificationTournament(kind) {
    if (typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(tournament => getGrandSlamQualificationEventKind(tournament) === kind) || null;
}

function getGrandSlamEventFinalists(kind, year, candidates = getPdcTourCardPlayers()) {
    const tournament = findGrandSlamQualificationTournament(kind);
    if (!tournament) return { winners: [], runnersUp: [] };
    const stored = tournament.grandSlamQualificationFinalists?.[year];
    if (stored) {
        return {
            winners: resolvePdcTourCardPlayerKeys(stored.winnerPlayerIds, candidates),
            runnersUp: resolvePdcTourCardPlayerKeys(stored.runnerUpPlayerIds, candidates)
        };
    }
    // Compact history belongs to this season. Previous seasons must use
    // their archived finalists; unfinished events do not award places.
    if (Number(year) !== getPdcTourCardReferenceYear() || tournament.completed !== true) {
        return { winners: [], runnersUp: [] };
    }
    return readGrandSlamFinalistsFromMatchHistory(tournament, candidates);
}

function getGrandSlamRegionCountries(region) {
    if (typeof worldRegions !== 'undefined' && worldRegions?.[region]) {
        return new Set(Object.keys(worldRegions[region]));
    }
    if (region === 'Azja') return new Set([
        'Bahrajn', 'Chiny', 'Filipiny', 'Hongkong', 'Indie', 'Japonia', 'Malezja', 'Mongolia',
        'Singapur', 'Tajlandia', 'Tajwan'
    ]);
    if (region === 'Ameryka Północna') return new Set([
        'Bahamy', 'Barbados', 'Kanada', 'Meksyk', 'Portoryko', 'Trynidad i Tobago', 'USA'
    ]);
    return new Set();
}

function getGrandSlamTourWinnerRanking(kind, year, candidates) {
    if (typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return [];
    const counts = new Map();
    tournamentDatabase.filter(tournament => getGrandSlamQualificationEventKind(tournament) === kind)
        .forEach(tournament => {
            const stored = tournament.grandSlamQualificationFinalists?.[year];
            const winners = stored
                ? resolvePdcTourCardPlayerKeys(stored.winnerPlayerIds, candidates)
                : Number(year) === getPdcTourCardReferenceYear() && tournament.completed === true
                    ? readGrandSlamFinalistsFromMatchHistory(tournament, candidates).winners : [];
            winners.forEach(candidate => {
                const key = getPdcTourCardPlayerKey(candidate);
                const entry = counts.get(key) || { player: candidate, wins: 0 };
                entry.wins++;
                counts.set(key, entry);
            });
        });
    return [...counts.values()].sort((first, second) => second.wins - first.wins
        || comparePdcTourCardRanking(first.player, second.player));
}

function buildGrandSlamAutomaticQualification(mainTournament, candidates = getPdcTourCardPlayers(),
    referenceDate = (typeof currentDate !== 'undefined' ? currentDate : new Date(GRAND_SLAM_BOOTSTRAP_YEAR, 0, 1))) {
    const allPlayers = uniquePdcTourCardPlayers(candidates);
    const year = getPdcTourCardReferenceYear(referenceDate);
    const previousYear = year - 1;
    const oomRanked = [...allPlayers].sort(comparePdcTourCardRanking);
    const qualifiedKeys = new Set();
    const televisedKeys = new Set();
    const categories = [];
    const addCategory = (key, requested, rawPlayers, { televised = false } = {}) => {
        const added = [];
        uniquePdcTourCardPlayers(rawPlayers).forEach(candidate => {
            const playerKey = getPdcTourCardPlayerKey(candidate);
            if (televised) {
                if (televisedKeys.has(playerKey)) return;
                if (televisedKeys.size >= GRAND_SLAM_TELEVISED_FINALIST_LIMIT) return;
                televisedKeys.add(playerKey);
            }
            if (qualifiedKeys.has(playerKey) || qualifiedKeys.size >= GRAND_SLAM_AUTOMATIC_PLACES) return;
            qualifiedKeys.add(playerKey);
            added.push(candidate);
        });
        categories.push({ key, requested, players: added, playerIds: added.map(getPdcTourCardPlayerKey) });
        return added;
    };

    const televised = [];
    if (year === GRAND_SLAM_BOOTSTRAP_YEAR) {
        GRAND_SLAM_2026_BOOTSTRAP.televised.forEach(aliases => {
            const candidate = findGrandSlamPlayerByAliases(allPlayers, aliases);
            if (candidate) televised.push(candidate);
        });
    } else {
        ['grandSlam', 'playersChampionshipFinals', 'worldChampionship'].forEach(kind => {
            const finalists = getGrandSlamEventFinalists(kind, previousYear, allPlayers);
            televised.push(...finalists.winners, ...finalists.runnersUp);
        });
    }
    ['worldMasters', 'ukOpen', 'premierLeague', 'worldCup', 'worldMatchplay', 'worldSeriesFinals',
        'worldGrandPrix', 'europeanChampionship'].forEach(kind => {
        const finalists = getGrandSlamEventFinalists(kind, year, allPlayers);
        televised.push(...finalists.winners, ...finalists.runnersUp);
    });
    addCategory('slamTelevisedFinalists', GRAND_SLAM_TELEVISED_FINALIST_LIMIT, televised, { televised: true });

    if (year === GRAND_SLAM_BOOTSTRAP_YEAR) {
        addCategory('slamYouth2025', 2, GRAND_SLAM_2026_BOOTSTRAP.youth
            .map(aliases => findGrandSlamPlayerByAliases(allPlayers, aliases)).filter(Boolean));
    }

    const youthLeader = oomRanked.find(candidate => {
        const context=typeof getWomensAgeBirthContext==='function'?getWomensAgeBirthContext(candidate,new Date(year,0,4)):candidate;
        return Number.isInteger(Number(context.birthYear)) && year-Number(context.birthYear)<21;
    });
    if (typeof hasWorldYouthCalendar === 'function' && hasWorldYouthCalendar(year)) {
        addCategory('slamYouth',2,getWorldYouthFinalists(year,allPlayers));
    } else addCategory('slamYouth', 1, youthLeader ? [youthLeader] : []);

    const challengeRanking = typeof getChallengeTourOrderOfMerit === 'function'
        ? getChallengeTourOrderOfMerit(allPlayers, { includeZero: false })
        : [...allPlayers].filter(candidate => (Number(candidate.challengeTourPrizeMoney) || 0) > 0)
            .sort((first, second) => (Number(second.challengeTourPrizeMoney) || 0) - (Number(first.challengeTourPrizeMoney) || 0)
                || comparePdcTourCardRanking(first, second));
    addCategory('slamChallenge', 1, challengeRanking.slice(0, 1));

    const developmentRanking = typeof getDevelopmentTourOrderOfMerit === 'function'
        ? getDevelopmentTourOrderOfMerit(allPlayers, { includeZero: false })
        : [...allPlayers].filter(candidate => (Number(candidate.developmentTourPrizeMoney) || 0) > 0)
            .sort((first, second) => (Number(second.developmentTourPrizeMoney) || 0) - (Number(first.developmentTourPrizeMoney) || 0)
                || comparePdcTourCardRanking(first, second));
    addCategory('slamDevelopment', 1, developmentRanking.slice(0, 1));

    const wwmChampion=typeof getWomensWorldMatchplayChampion==='function'?getWomensWorldMatchplayChampion(year):null;
    addCategory('slamWomensWorldMatchplay',1,wwmChampion?[wwmChampion]:[]);
    const nativeWomensSeries=typeof getWomensSeriesQualificationPlayers==='function'&&typeof tournamentDatabase!=='undefined'&&tournamentDatabase.some(e=>isWomensSeriesTournament(e));
    const womensSeriesQualifiers=nativeWomensSeries?getWomensSeriesQualificationPlayers(year,allPlayers):[];
    if(!nativeWomensSeries)addCategory('slamWomen', 2, oomRanked.filter(candidate => candidate.gender === 'female').slice(0, 2));
    const asia = getGrandSlamRegionCountries('Azja');
    const northAmerica = getGrandSlamRegionCountries('Ameryka Północna');
    addCategory('slamAsia', 1, oomRanked.filter(candidate => asia.has(candidate.country)).slice(0, 1));
    addCategory('slamNorthAmerica', 1, oomRanked.filter(candidate => northAmerica.has(candidate.country)).slice(0, 1));
    addCategory('slamNordicBaltic', 1, oomRanked.filter(candidate => GRAND_SLAM_NORDIC_BALTIC_COUNTRIES.has(candidate.country)).slice(0, 1));
    addCategory('slamAnz', 1, oomRanked.filter(candidate => GRAND_SLAM_ANZ_COUNTRIES.has(candidate.country)).slice(0, 1));
    const addTourWinners = (key, kind) => {
        // Resolve the existing routes first, retaining the one WS place.
        const reserved=womensSeriesQualifiers.some(p=>!qualifiedKeys.has(getPdcTourCardPlayerKey(p)))?1:0;
        const requested = Math.max(0, GRAND_SLAM_AUTOMATIC_PLACES - reserved - qualifiedKeys.size);
        const rankedWinners = getGrandSlamTourWinnerRanking(kind, year, allPlayers).map(entry => entry.player)
            .filter(p=>!qualifiedKeys.has(getPdcTourCardPlayerKey(p))).slice(0,requested);
        addCategory(key, requested, rankedWinners);
    };
    addTourWinners('slamEuropeanTourWinners', 'europeanTour');
    if (qualifiedKeys.size < GRAND_SLAM_AUTOMATIC_PLACES) addTourWinners('slamPlayersChampionshipWinners', 'playersChampionship');

    if(nativeWomensSeries){
        addCategory('slamWomen',1,womensSeriesQualifiers.filter(p=>!qualifiedKeys.has(getPdcTourCardPlayerKey(p))).slice(0,1));
        const season=womensSeriesSeason(year,false);if(season?.closed)season.qualifications.grandSlam=categories.find(c=>c.key==='slamWomen')?.playerIds||[];
    }

    if (qualifiedKeys.size < GRAND_SLAM_AUTOMATIC_PLACES) {
        const requested = GRAND_SLAM_AUTOMATIC_PLACES - qualifiedKeys.size;
        addCategory('slamFallback', requested, oomRanked.filter(candidate => !qualifiedKeys.has(getPdcTourCardPlayerKey(candidate))));
    }

    const byKey = new Map(allPlayers.map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    return {
        version: GRAND_SLAM_QUALIFICATION_VERSION,
        year,
        players: [...qualifiedKeys].map(key => byKey.get(key)).filter(Boolean),
        categories
    };
}

function getPdcSecondaryTourCardRanking(candidates, type, completedYear = null) {
    const players = uniquePdcTourCardPlayers(candidates);
    const previousMoneyField = type === 'challengeTour'
        ? 'previousChallengeTourPrizeMoney'
        : 'previousDevelopmentTourPrizeMoney';
    const previousYearField = type === 'challengeTour'
        ? 'previousChallengeTourYear'
        : 'previousDevelopmentTourYear';
    const archivedRanking = Number.isInteger(Number(completedYear))
        ? players.filter(candidate => Number(candidate[previousYearField]) === Number(completedYear)
            && (Number(candidate[previousMoneyField]) || 0) > 0)
        : [];
    if (archivedRanking.length) {
        return archivedRanking.sort((first, second) => (Number(second[previousMoneyField]) || 0)
            - (Number(first[previousMoneyField]) || 0) || comparePdcTourCardRanking(first, second));
    }
    if (type === 'challengeTour' && typeof getChallengeTourOrderOfMerit === 'function') {
        return getChallengeTourOrderOfMerit(players, { includeZero: false });
    }
    if (type === 'developmentTour' && typeof getDevelopmentTourOrderOfMerit === 'function') {
        return getDevelopmentTourOrderOfMerit(players, { includeZero: false });
    }
    const moneyField = type === 'challengeTour' ? 'challengeTourPrizeMoney' : 'developmentTourPrizeMoney';
    return players
        .filter(candidate => (Number(candidate[moneyField]) || 0) > 0)
        .sort((first, second) => (Number(second[moneyField]) || 0) - (Number(first[moneyField]) || 0)
            || comparePdcTourCardRanking(first, second));
}

function getPdcQSchoolOpeningRound(participantCount, minimum = 128) {
    let bracketSize = minimum;
    while (bracketSize < participantCount) bracketSize *= 2;
    return bracketSize;
}

function getPdcTourCardQualifierMainTournament(qualifierTournament) {
    if (!qualifierTournament?.qualifierFor || !Array.isArray(tournamentDatabase)) return null;
    return tournamentDatabase.find(tournament => tournament.name === qualifierTournament.qualifierFor)
        || tournamentDatabase.find(tournament => tournament.sourceName === qualifierTournament.qualifierFor)
        || null;
}

function buildPdcTourCardAutomaticField(mainTournament, candidates = getPdcTourCardPlayers()) {
    const allPlayers = uniquePdcTourCardPlayers(candidates);
    const name = String(mainTournament?.name || '').toLowerCase();
    const oomRanked = [...allPlayers].sort(comparePdcTourCardRanking);
    const proTourRanked = [...allPlayers].sort((first, second) =>
        (Number(second.proTourPrizeMoney) || 0) - (Number(first.proTourPrizeMoney) || 0)
        || comparePdcTourCardRanking(first, second));
    const qualified = new Set();

    if (isGrandSlamMainTournament(mainTournament)) {
        return buildGrandSlamAutomaticQualification(mainTournament, allPlayers).players;
    } else if (name.includes('world darts championship') || name.includes('global darts championship')) {
        oomRanked.slice(0, 32).forEach(candidate => qualified.add(candidate));
        for (const candidate of proTourRanked) {
            qualified.add(candidate);
            if (qualified.size >= 64) break;
        }
        for (const candidate of oomRanked) {
            qualified.add(candidate);
            if (qualified.size >= 96) break;
        }
    }
    return [...qualified];
}

function isPdcTourCardQualificationLocked(qualifierTournament, state, referenceDate = currentDate) {
    if (state?.year !== getPdcTourCardReferenceYear(referenceDate)) return false;
    if (state.locked === true || qualifierTournament?.completed === true) return true;
    // An older save could inherit last year's completed flag while its
    // calendar still marks this year's qualifier as unplayed.
    if (state.completed === true && qualifierTournament?.completed !== false) return true;
    if (qualifierTournament?.matchHistory?.blocks?.some(block => block?.type === 'round' && block.matches?.length)) return true;
    // Older saves lack the explicit flag: retain the field once a draw exists.
    return Boolean(typeof activeTournament !== 'undefined' && activeTournament
        && [activeTournament.name, activeTournament.sourceName].filter(Boolean)
            .some(name => [qualifierTournament?.name, qualifierTournament?.sourceName].includes(name))
        && typeof tournamentBracket !== 'undefined' && Array.isArray(tournamentBracket)
        && tournamentBracket.some(candidate => candidate && !candidate.isBye));
}

function previewPdcTourCardQualificationState(qualifierTournament, candidates = getPdcTourCardPlayers(),
    referenceDate = currentDate) {
    if(qualifierTournament?.womensWorldMatchplayVacancy&&typeof ensureWomensWorldMatchplayQualifierState==='function')return ensureWomensWorldMatchplayQualifierState(qualifierTournament,candidates);
    if(qualifierTournament?.worldYouthVacancy && typeof ensureWorldYouthQualifierState==='function')return ensureWorldYouthQualifierState(qualifierTournament,candidates);
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    if (!mainTournament) return null;
    const year = getPdcTourCardReferenceYear(referenceDate);
    const existing = mainTournament.pdcTourCardQualification;
    if (existing?.year === year && Array.isArray(existing.automaticPlayerIds)
        && Array.isArray(existing.qualifierPlayerIds)
        && isPdcTourCardQualificationLocked(qualifierTournament, existing, referenceDate)) {
        return { ...existing, qualifiedPlayerIds: existing.qualifiedPlayerIds || [],
            qualifyingPlaces: Math.max(1, Number(existing.qualifyingPlaces) || Number(qualifierTournament.qualifyingPlaces) || 8),
            locked: true };
    }

    const allPlayers = uniquePdcTourCardPlayers(candidates);
    const grandSlamQualification = isGrandSlamMainTournament(mainTournament)
        ? buildGrandSlamAutomaticQualification(mainTournament, allPlayers, referenceDate)
        : null;
    const automaticPlayers = grandSlamQualification?.players
        || buildPdcTourCardAutomaticField(mainTournament, allPlayers);
    const automaticKeys = new Set(automaticPlayers.map(getPdcTourCardPlayerKey));
    const qualifierPlayers = getPdcTourCardHolders(allPlayers)
        .filter(candidate => !automaticKeys.has(getPdcTourCardPlayerKey(candidate)))
        .sort(comparePdcTourCardRanking);
    const currentSeason = existing?.year === year && (existing.completed !== true
        || isPdcTourCardQualificationLocked(qualifierTournament, existing, referenceDate)) ? existing : null;
    const previousQualified = Array.isArray(currentSeason?.qualifiedPlayerIds)
        ? resolvePdcTourCardPlayerKeys(currentSeason.qualifiedPlayerIds, allPlayers)
            .filter(candidate => !automaticKeys.has(getPdcTourCardPlayerKey(candidate)))
        : [];
    const migratedQualified = uniquePdcTourCardPlayers([
        ...previousQualified,
        ...(currentSeason?.completed ? qualifierPlayers : [])
    ]).slice(0, Math.max(1, Number(qualifierTournament.qualifyingPlaces) || GRAND_SLAM_TOUR_CARD_QUALIFIER_PLACES));
    return {
        version: grandSlamQualification?.version || 1,
        year,
        qualifyingPlaces: Math.max(1, Number(qualifierTournament.qualifyingPlaces) || GRAND_SLAM_TOUR_CARD_QUALIFIER_PLACES),
        automaticPlayerIds: automaticPlayers.map(getPdcTourCardPlayerKey),
        qualifierPlayerIds: qualifierPlayers.map(getPdcTourCardPlayerKey),
        qualifiedPlayerIds: migratedQualified.map(getPdcTourCardPlayerKey),
        categories: grandSlamQualification?.categories?.map(category => ({
            key: category.key,
            requested: category.requested,
            playerIds: category.playerIds
        })) || [],
        completed: currentSeason?.completed === true,
        locked: currentSeason?.completed === true,
        migratedFromQualificationVersion: existing?.year === year && existing?.version !== undefined
            && existing.version !== (grandSlamQualification?.version || 1)
            ? existing.version
            : currentSeason?.migratedFromQualificationVersion
    };
}

function ensurePdcTourCardQualificationState(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    if(qualifierTournament?.womensWorldMatchplayVacancy&&typeof ensureWomensWorldMatchplayQualifierState==='function')return ensureWomensWorldMatchplayQualifierState(qualifierTournament,candidates);
    if(qualifierTournament?.worldYouthVacancy && typeof ensureWorldYouthQualifierState==='function')return ensureWorldYouthQualifierState(qualifierTournament,candidates);
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    const projected = previewPdcTourCardQualificationState(qualifierTournament, candidates);
    if (!mainTournament || !projected) return null;
    const existing = mainTournament.pdcTourCardQualification;
    if (existing?.year === projected.year) {
        Object.assign(existing, projected);
        return existing;
    }
    mainTournament.pdcTourCardQualification = projected;
    return projected;
}

function lockPdcTourCardQualificationState(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    if (state) state.locked = true;
    return state;
}

function resolvePdcTourCardPlayerKeys(keys, candidates = getPdcTourCardPlayers()) {
    const byKey = new Map(uniquePdcTourCardPlayers(candidates).map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    return (Array.isArray(keys) ? keys : []).map(key => byKey.get(key)).filter(Boolean);
}

function getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    if (!state) return [];
    const automaticKeys = new Set(state.automaticPlayerIds);
    return getPdcTourCardHolders(candidates)
        .filter(candidate => !automaticKeys.has(getPdcTourCardPlayerKey(candidate)))
        .sort(comparePdcTourCardRanking);
}

function getPdcTourCardQualifierParticipants(qualifierTournament, candidates = getPdcTourCardPlayers()) {
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    const eligibleKeys = new Set(getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates)
        .map(getPdcTourCardPlayerKey));
    return resolvePdcTourCardPlayerKeys(state?.qualifierPlayerIds, candidates)
        .filter(candidate => eligibleKeys.has(getPdcTourCardPlayerKey(candidate)));
}

function getPdcTourCardQualifierOpeningRound(participantCount, qualifyingPlaces = 8) {
    const minimumSize = Math.max(2, Number(participantCount) || 0, Math.max(1, Number(qualifyingPlaces) || 8) * 2);
    let bracketSize = 2;
    while (bracketSize < minimumSize) bracketSize *= 2;
    return bracketSize;
}

function buildPdcTourCardQualifierDraw(participants, random = Math.random, qualifyingPlaces = undefined) {
    const entrants = shufflePdcQSchoolPlayers(getPdcTourCardHolders(participants), random);
    const places = Math.max(1, Number(qualifyingPlaces)
        || Number(typeof activeTournament !== 'undefined' && activeTournament?.qualifyingPlaces) || 8);
    const bracketSize = getPdcTourCardQualifierOpeningRound(entrants.length, places);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;
    for (; index < byeCount && index < entrants.length; index++) draw.push(entrants[index], createPdcQSchoolBye());
    for (; index < entrants.length; index += 2) draw.push(entrants[index], entrants[index + 1] || createPdcQSchoolBye());
    while (draw.length < bracketSize) draw.push(createPdcQSchoolBye());
    return draw;
}

function completePdcTourCardQualifier(qualifierTournament, qualifiedPlayers) {
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    const state = ensurePdcTourCardQualificationState(qualifierTournament);
    if (!mainTournament || !state) return null;
    const eligibleKeys = new Set(getPdcTourCardQualifierEligiblePlayers(qualifierTournament)
        .map(getPdcTourCardPlayerKey));
    const qualifiers = uniquePdcTourCardPlayers(qualifiedPlayers)
        .filter(candidate => eligibleKeys.has(getPdcTourCardPlayerKey(candidate)))
        .slice(0, state.qualifyingPlaces);
    state.qualifiedPlayerIds = qualifiers.map(getPdcTourCardPlayerKey);
    if(qualifierTournament.womensWorldMatchplayVacancy&&typeof womensWorldMatchplayEdition==='function'){const e=womensWorldMatchplayEdition(qualifierTournament.womensWorldMatchplayYear??state.year);if(e)e.seniorReplacementWinner=state.qualifiedPlayerIds[0]||null;delete mainTournament.worldChampionshipQualification;}
    if(qualifierTournament.worldYouthVacancy && typeof getWorldYouthEdition==='function'){const edition=getWorldYouthEdition(state.year);if(edition)edition.seniorReplacementWinner=state.qualifiedPlayerIds[0]||null;delete mainTournament.worldChampionshipQualification;}
    state.completed = true;
    state.locked = true;
    qualifierTournament.completed = true;
    qualifierTournament.historyLogs = typeof lastTournamentResults === 'string' ? lastTournamentResults : '';
    return state;
}

function repairLegacyGrandSlamQualification(mainTournament, qualifierTournament, state, candidates) {
    const blocks = qualifierTournament?.matchHistory?.blocks;
    const mainName = `${mainTournament?.name || ''} ${mainTournament?.sourceName || ''}`.toLowerCase();
    // Starsze wersje mogły uruchomić grupy wewnątrz kwalifikatora albo zbudować
    // dla małej obsady drabinkę Last 128. W obu przypadkach zapisywały mniej niż
    // osiem miejsc. Zachowujemy przyznane awanse, a brakujące odtwarzamy według
    // najdalszej osiągniętej rundy. Nie powtarzamy meczów ani nie zmieniamy ich historii.
    if (!state?.completed || mainTournament?.completed
        || (!mainName.includes('grand slam') && !mainName.includes("champion's slam"))
        || state.qualifiedPlayerIds.length >= state.qualifyingPlaces) return false;
    const eligible = new Map(getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates)
        .map(candidate => [getPdcTourCardPlayerKey(candidate), candidate]));
    const selected = new Set();
    const addKey = key => {
        if (selected.size < state.qualifyingPlaces && eligible.has(key)) selected.add(key);
    };
    state.qualifiedPlayerIds.forEach(addKey);
    const historyPlayers = qualifierTournament?.matchHistory?.players || [];
    const addHistoryPlayer = index => {
        const entry = historyPlayers[index];
        if (typeof entry?.[0] !== 'string') return;
        const key = entry[0].startsWith('id:') ? entry[0].slice(3) : entry[0].replace(/^name:/, '');
        addKey(key);
    };
    const rounds = (Array.isArray(blocks) ? blocks : [])
        .filter(block => block?.type === 'round' && Array.isArray(block.matches))
        .sort((first, second) => Number(first.round) - Number(second.round));
    for (const round of rounds) {
        round.matches.forEach(match => addHistoryPlayer(Number(match[2]) >= Number(match[3]) ? match[0] : match[1]));
        round.matches.forEach(match => addHistoryPlayer(Number(match[2]) >= Number(match[3]) ? match[1] : match[0]));
        if (selected.size >= state.qualifyingPlaces) break;
    }
    // Gdy fragment starej historii nie istnieje, korzystamy z kolejności
    // zapisanej listy uczestników tego kwalifikatora, nadal tylko z kartą.
    state.qualifierPlayerIds.forEach(addKey);
    if (selected.size <= state.qualifiedPlayerIds.length) return false;
    state.qualifiedPlayerIds = [...selected];
    state.legacyGrandSlamQualifierRepaired = true;
    return true;
}

function getPdcTourCardQualifiedMainField(mainTournament, candidates = getPdcTourCardPlayers()) {
    const qualifierTournament = Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(tournament => tournament.specialType === PDC_TOUR_CARD_QUALIFIER_TYPE
            && (tournament.qualifierFor === mainTournament?.name || tournament.qualifierFor === mainTournament?.sourceName))
        : null;
    if (!qualifierTournament) return null;
    const state = ensurePdcTourCardQualificationState(qualifierTournament, candidates);
    repairLegacyGrandSlamQualification(mainTournament, qualifierTournament, state, candidates);
    if (!state.completed) {
        state.qualifiedPlayerIds = getPdcTourCardQualifierParticipants(qualifierTournament, candidates)
            .slice(0, state.qualifyingPlaces).map(getPdcTourCardPlayerKey);
        state.completed = true;
        state.migratedWithoutQualifier = true;
    }
    const eligibleKeys = new Set(getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates)
        .map(getPdcTourCardPlayerKey));
    const automaticPlayers = resolvePdcTourCardPlayerKeys(state.automaticPlayerIds, candidates);
    const qualifiedPlayers = resolvePdcTourCardPlayerKeys(state.qualifiedPlayerIds, candidates)
        .filter(candidate => eligibleKeys.has(getPdcTourCardPlayerKey(candidate)));
    const field = uniquePdcTourCardPlayers([...automaticPlayers, ...qualifiedPlayers]);
    const mainName = `${mainTournament?.name || ''} ${mainTournament?.sourceName || ''}`.toLowerCase();

    // Zapis może wskazywać na zawodników, których nie ma już w pdcPlayers
    // (np. po migracji starszej bazy). Grand Slam ma 16 grup po 3 osoby,
    // dlatego brakujące miejsca uzupełniamy zachowaną, uporządkowaną listą
    // uczestników kwalifikatora. Nie zmieniamy ośmiu faktycznych awansów.
    if (!mainName.includes('grand slam') && !mainName.includes("champion's slam")) return field;

    const fieldSize = 48;
    const fieldKeys = new Set(field.map(getPdcTourCardPlayerKey));
    const replacementKeys = [];
    const addReplacement = candidate => {
        if (!candidate) return;
        const key = getPdcTourCardPlayerKey(candidate);
        if (candidate.hasTourCard !== true || fieldKeys.has(key) || replacementKeys.includes(key)) return;
        replacementKeys.push(key);
    };

    // Zachowujemy poprzednie zastępstwa, aby wczytanie tego samego zapisu
    // dawało identyczną obsadę. Dopiero potem dokładamy następnych według
    // kolejności ustalonej w kwalifikatorze.
    resolvePdcTourCardPlayerKeys(state.missingAutomaticReplacementPlayerIds, candidates).forEach(addReplacement);
    resolvePdcTourCardPlayerKeys(state.qualifierPlayerIds, candidates).forEach(addReplacement);
    getPdcTourCardQualifierEligiblePlayers(qualifierTournament, candidates).forEach(addReplacement);

    const missingPlaces = Math.max(0, fieldSize - field.length);
    const replacements = resolvePdcTourCardPlayerKeys(replacementKeys.slice(0, missingPlaces), candidates);
    if (replacements.length > 0) {
        state.missingAutomaticReplacementPlayerIds = replacements.map(getPdcTourCardPlayerKey);
        return uniquePdcTourCardPlayers([...field, ...replacements]);
    }
    return field;
}

function isCareerPlayerAutomaticallyQualifiedForPdcCardQualifier(qualifierTournament) {
    const state = previewPdcTourCardQualificationState(qualifierTournament);
    return Boolean(state?.automaticPlayerIds.includes(getPdcTourCardPlayerKey(player)));
}

function getPdcTourCardQualifierOutcomeMessage(qualifierTournament, candidate = player) {
    const mainTournament = getPdcTourCardQualifierMainTournament(qualifierTournament);
    const state = mainTournament?.pdcTourCardQualification;
    const qualified = Boolean(state?.qualifiedPlayerIds.includes(getPdcTourCardPlayerKey(candidate)));
    const eventName = mainTournament?.name || qualifierTournament?.qualifierFor || '';
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const messages = qualified
        ? { pl: `Awansujesz do ${eventName}!`, en: `You qualify for ${eventName}!`, de: `Du qualifizierst dich für ${eventName}!`, nl: `Je plaatst je voor ${eventName}!` }
        : { pl: `Nie udało Ci się awansować do ${eventName}.`, en: `You did not qualify for ${eventName}.`, de: `Du hast dich nicht für ${eventName} qualifiziert.`, nl: `Je hebt je niet geplaatst voor ${eventName}.` };
    const text = messages[language] || messages.pl;
    return typeof competitionDisplayText === 'function' ? competitionDisplayText(text) : text;
}

function shufflePdcQSchoolPlayers(candidates, random = Math.random) {
    const shuffled = [...candidates];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function createPdcQSchoolBye() {
    return { name: '(BYE)', isBye: true, country: 'Brak', ovr: 0, overall: 0 };
}

function buildPdcQSchoolDraw(participants, random = Math.random, minimum = 128) {
    const entrants = shufflePdcQSchoolPlayers(uniquePdcTourCardPlayers(participants), random);
    const bracketSize = getPdcQSchoolOpeningRound(entrants.length, minimum);
    const byeCount = Math.max(0, bracketSize - entrants.length);
    const draw = [];
    let index = 0;

    for (; index < byeCount && index < entrants.length; index++) {
        draw.push(entrants[index], createPdcQSchoolBye());
    }
    for (; index < entrants.length; index += 2) {
        draw.push(entrants[index], entrants[index + 1] || createPdcQSchoolBye());
    }
    while (draw.length < bracketSize) draw.push(createPdcQSchoolBye());
    return draw;
}

function completePdcQSchool(tournament, qualifiedPlayers, referenceDate = currentDate) {
    if (!isPdcTourCardSystemEnabled()) return [];
    const cycleYear = getPdcTourCardCycleYear(referenceDate);
    const allPlayers = uniquePdcTourCardPlayers([
        ...getPdcTourCardPlayers(),
        ...(Array.isArray(qualifiedPlayers) ? qualifiedPlayers : [])
    ]);
    // Starszy zapis wczytany już po styczniowym terminie mógł otrzymać zastępcze
    // karty migracyjne. Jeśli sam Q-School jest jednak rozgrywany, jego wyniki
    // muszą zastąpić ten techniczny przydział, a nie zostać przez niego zablokowane.
    allPlayers
        .filter(candidate => candidate.hasTourCard === true && candidate.tourCardSource === 'qschool-migration')
        .forEach(candidate => clearPdcTourCard(candidate, cycleYear));
    const availablePlaces = getPdcQSchoolAvailablePlaces(allPlayers);
    const qualifiers = uniquePdcTourCardPlayers(qualifiedPlayers).slice(0, availablePlaces);
    qualifiers.forEach(candidate => setPdcTourCard(candidate, 'qschool', cycleYear));

    if (tournament) {
        tournament.completed = true;
        tournament.qSchoolYear = cycleYear;
        tournament.qSchoolAvailablePlaces = availablePlaces;
        tournament.qSchoolQualifiedPlayerIds = qualifiers.map(getPdcTourCardPlayerKey);
        if (typeof lastTournamentResults === 'string') tournament.historyLogs = lastTournamentResults;
    }
    return qualifiers;
}

function getPdcTourCardOutcomeMessage(candidate = player) {
    const qualified = candidate?.hasTourCard === true && candidate.tourCardSource === 'qschool';
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    const messages = qualified
        ? {
            pl: 'Gratulacje! Zdobywasz kartę PDC na dwa lata.',
            en: 'Congratulations! You earn a two-year PDC Tour Card.',
            de: 'Glückwunsch! Du erhältst eine PDC Tour Card für zwei Jahre.',
            nl: 'Gefeliciteerd! Je verdient een PDC Tour Card voor twee jaar.'
        }
        : {
            pl: 'Nie udało Ci się zdobyć karty PDC w tym Q-Schoolu.',
            en: 'You did not earn a PDC Tour Card at this Q-School.',
            de: 'Du hast bei dieser Q-School keine PDC Tour Card gewonnen.',
            nl: 'Je hebt bij deze Q-School geen PDC Tour Card verdiend.'
        };
    const text = messages[language] || messages.pl;
    return typeof competitionDisplayText === 'function' ? competitionDisplayText(text) : text;
}

// Fresh database bootstrap is separate from restoring existing entitlements.
if (typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)) {
    const referenceDate = typeof currentDate !== 'undefined' ? currentDate : new Date(2026, 0, 1);
    if (pdcPlayers.some(candidate => candidate.tourCardSystemVersion || candidate.pdcTourCard || candidate.hasTourCard === true)) migratePdcTourCardSystem(pdcPlayers, referenceDate);
    else initializePdcTourCards2026(pdcPlayers, referenceDate);
}
