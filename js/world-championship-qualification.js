const WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION = 1;
const WORLD_CHAMPIONSHIP_FIELD_SIZE = 128;
const WORLD_CHAMPIONSHIP_OOM_PLACES = 80;

const WORLD_CHAMPIONSHIP_COUNTRY_GROUPS = Object.freeze({
    asia: ['Bahrajn', 'Chiny', 'Filipiny', 'Hongkong', 'Indie', 'Japonia', 'Malezja', 'Mongolia', 'Singapur', 'Tajlandia', 'Tajwan'],
    belgiumNetherlands: ['Belgia', 'Holandia'],
    mediterranean: ['Chorwacja', 'Cypr', 'Francja', 'Gibraltar', 'Grecja', 'Hiszpania', 'Izrael', 'Malta', 'Portugalia', 'Słowenia', 'Turcja', 'Włochy'],
    southEastEurope: ['Albania', 'Bośnia i Hercegowina', 'Bułgaria', 'Chorwacja', 'Czarnogóra', 'Grecja', 'Kosowo', 'Macedonia Północna', 'Rumunia', 'Serbia', 'Słowenia'],
    dach: ['Austria', 'Niemcy', 'Szwajcaria'],
    ukIreland: ['Anglia', 'Irlandia', 'Irlandia Północna', 'Szkocja', 'Walia'],
    northAmerica: ['Kanada', 'Meksyk', 'USA'],
    caribbeanSouthAmerica: ['Argentyna', 'Bahamy', 'Barbados', 'Brazylia', 'Gujana', 'Jamajka', 'Kolumbia', 'Trynidad i Tobago', 'Wenezuela'],
    scandinaviaBaltic: ['Dania', 'Estonia', 'Finlandia', 'Islandia', 'Litwa', 'Norwegia', 'Szwecja', 'Łotwa'],
    oceania: ['Australia', 'Fidżi', 'Nowa Zelandia', 'Papua-Nowa Gwinea', 'Samoa'],
    africa: ['Algieria', 'Botswana', 'Egipt', 'Ghana', 'Kenia', 'Malawi', 'Maroko', 'Nigeria', 'RPA', 'Tunezja', 'Uganda', 'Zimbabwe']
});

function normalizeWorldChampionshipCountry(country) {
    return String(country || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLocaleLowerCase('pl');
}

const WORLD_CHAMPIONSHIP_NORMALIZED_COUNTRY_GROUPS = Object.freeze(
    Object.fromEntries(Object.entries(WORLD_CHAMPIONSHIP_COUNTRY_GROUPS)
        .map(([group, countries]) => [group, new Set(countries.map(normalizeWorldChampionshipCountry))]))
);

function getWorldChampionshipPlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id || `${candidate.name || ''}|${candidate.country || ''}`;
}

function isWorldChampionshipEligiblePlayer(candidate) {
    if (!candidate || candidate.isBye || candidate.isWorldCupGuest || !candidate.name) return false;
    return !(typeof isRetiredPlayer === 'function' && isRetiredPlayer(candidate));
}

function uniqueWorldChampionshipPlayers(candidates) {
    const unique = new Map();
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        if (!isWorldChampionshipEligiblePlayer(candidate)) return;
        const key = getWorldChampionshipPlayerKey(candidate);
        if (!unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function compareWorldChampionshipOom(first, second) {
    return (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.proTourPrizeMoney) || 0) - (Number(first?.proTourPrizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function isWorldChampionshipCountry(candidate, country) {
    return normalizeWorldChampionshipCountry(candidate?.country) === normalizeWorldChampionshipCountry(country);
}

function isWorldChampionshipCountryGroup(candidate, group) {
    return WORLD_CHAMPIONSHIP_NORMALIZED_COUNTRY_GROUPS[group]
        ?.has(normalizeWorldChampionshipCountry(candidate?.country)) === true;
}

function getWorldChampionshipPlayerAge(candidate, referenceDate) {
    const date = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    const year = Number.isNaN(date.getTime()) ? 2026 : date.getFullYear();
    return Number.isInteger(candidate?.birthYear) ? year - candidate.birthYear : null;
}

function isWorldChampionshipWoman(candidate) {
    const gender = String(candidate?.gender ?? candidate?.sex ?? '').trim().toLocaleLowerCase('pl');
    return ['female', 'woman', 'kobieta', 'f'].includes(gender);
}

function getWorldChampionshipQualificationCandidates(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : [
            ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
            ...(typeof player !== 'undefined' && player?.name ? [player] : [])
        ];
    return uniqueWorldChampionshipPlayers(source).sort(compareWorldChampionshipOom);
}

function buildWorldChampionshipQualification(candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : new Date(2026, 11, 1))) {
    const ranked = getWorldChampionshipQualificationCandidates(candidates);
    const selected = [];
    const selectedKeys = new Set();
    const categories = [];

    const addCategory = (key, label, count, pool, predicate = () => true) => {
        const additions = [];
        for (const candidate of pool) {
            const candidateKey = getWorldChampionshipPlayerKey(candidate);
            if (selectedKeys.has(candidateKey) || !predicate(candidate)) continue;
            selected.push(candidate);
            selectedKeys.add(candidateKey);
            additions.push(candidate);
            if (additions.length >= count) break;
        }
        categories.push({
            key,
            label,
            requested: count,
            playerIds: additions.map(getWorldChampionshipPlayerKey),
            shortfall: Math.max(0, count - additions.length)
        });
        return additions;
    };

    const outsideTop80 = ranked.slice(WORLD_CHAMPIONSHIP_OOM_PLACES);
    addCategory('oomTop80', 'Top 80 OOM', 80, ranked);
    addCategory('poland', 'Najlepszy Polak spoza Top 80 OOM', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Polska'));
    addCategory('czechia', 'Najlepszy Czech spoza Top 80 OOM', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Czechy'));
    addCategory('youth16to18', 'Najlepszy gracz w wieku 16–18 lat spoza Top 80 OOM', 1, outsideTop80, candidate => {
        const age = getWorldChampionshipPlayerAge(candidate, referenceDate);
        return age >= 16 && age <= 18;
    });
    addCategory('india', 'Najlepszy zawodnik z Indii spoza Top 80 OOM', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Indie'));
    addCategory('women', 'Cztery najlepsze kobiety spoza Top 80 OOM', 4, outsideTop80, isWorldChampionshipWoman);
    addCategory('china', 'Najlepszy zawodnik z Chin spoza Top 80 OOM', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Chiny'));
    addCategory('japan', 'Najlepszy zawodnik z Japonii spoza Top 80 OOM', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Japonia'));
    addCategory('asia', 'Siedmiu najlepszych pozostałych zawodników z Azji', 7, outsideTop80, candidate => (
        isWorldChampionshipCountryGroup(candidate, 'asia')
        && !['Indie', 'Chiny', 'Japonia'].some(country => isWorldChampionshipCountry(candidate, country))
    ));
    addCategory('belgiumNetherlands', 'Najlepszy zawodnik z Belgii lub Holandii', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'belgiumNetherlands'));
    addCategory('mediterranean', 'Najlepszy zawodnik z krajów śródziemnomorskich', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'mediterranean'));
    addCategory('southEastEurope', 'Najlepszy zawodnik z południowo-wschodniej Europy', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'southEastEurope'));
    addCategory('dach', 'Najlepszy zawodnik z Niemiec, Austrii lub Szwajcarii', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'dach'));
    addCategory('hungary', 'Najlepszy zawodnik z Węgier', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Węgry'));
    addCategory('ukIreland', 'Najlepszy zawodnik z UK lub Irlandii', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'ukIreland'));
    addCategory('northAmerica', 'Czterech najlepszych zawodników z Ameryki Północnej', 4, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'northAmerica'));
    addCategory('usa', 'Najlepszy pozostały zawodnik z USA', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'USA'));
    addCategory('canada', 'Najlepszy pozostały zawodnik z Kanady', 1, outsideTop80, candidate => isWorldChampionshipCountry(candidate, 'Kanada'));
    addCategory('caribbeanSouthAmerica', 'Najlepszy zawodnik z Karaibów lub Ameryki Południowej', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'caribbeanSouthAmerica'));
    // Numeracja przekazana dla tej kategorii przewiduje tylko jedno miejsce: 111.
    addCategory('scandinaviaBaltic', 'Najlepszy zawodnik ze Skandynawii lub krajów bałtyckich', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'scandinaviaBaltic'));
    addCategory('oceania', 'Czterech najlepszych zawodników z Oceanii', 4, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'oceania'));
    addCategory('oom81to128', 'Czterech najlepszych niezakwalifikowanych z miejsc 81–128 OOM', 4, ranked.slice(80, 128));
    addCategory('youth16to23', 'Czterech najlepszych graczy w wieku 16–23 lat spoza Top 80 OOM', 4, outsideTop80, candidate => {
        const age = getWorldChampionshipPlayerAge(candidate, referenceDate);
        return age >= 16 && age <= 23;
    });
    addCategory('africa', 'Najlepszy zawodnik z Afryki', 1, outsideTop80, candidate => isWorldChampionshipCountryGroup(candidate, 'africa'));
    addCategory('nonCard', 'Czterech najlepszych zawodników bez karty PDC', 4, outsideTop80, candidate => candidate.hasTourCard !== true);

    if (selected.length < WORLD_CHAMPIONSHIP_FIELD_SIZE) {
        addCategory(
            'oomFallback',
            'Uzupełnienie według OOM z powodu braku kandydatów regionalnych',
            WORLD_CHAMPIONSHIP_FIELD_SIZE - selected.length,
            ranked
        );
    }

    return {
        version: WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION,
        year: referenceDate instanceof Date ? referenceDate.getFullYear() : new Date(referenceDate).getFullYear(),
        playerIds: selected.slice(0, WORLD_CHAMPIONSHIP_FIELD_SIZE).map(getWorldChampionshipPlayerKey),
        participants: selected.slice(0, WORLD_CHAMPIONSHIP_FIELD_SIZE),
        categories,
        complete: selected.length >= WORLD_CHAMPIONSHIP_FIELD_SIZE,
        shortfall: Math.max(0, WORLD_CHAMPIONSHIP_FIELD_SIZE - selected.length)
    };
}

function resolveWorldChampionshipPlayerKeys(keys, candidates) {
    const byKey = new Map(getWorldChampionshipQualificationCandidates(candidates)
        .map(candidate => [getWorldChampionshipPlayerKey(candidate), candidate]));
    return (Array.isArray(keys) ? keys : []).map(key => byKey.get(key)).filter(Boolean);
}

function getWorldChampionshipQualificationField(tournament, candidates, referenceDate = (typeof currentDate !== 'undefined' ? currentDate : new Date(2026, 11, 1))) {
    const year = referenceDate instanceof Date ? referenceDate.getFullYear() : new Date(referenceDate).getFullYear();
    const existing = tournament?.worldChampionshipQualification;
    if (existing?.version === WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION && existing.year === year) {
        const resolved = resolveWorldChampionshipPlayerKeys(existing.playerIds, candidates);
        if (resolved.length === WORLD_CHAMPIONSHIP_FIELD_SIZE) return resolved;
    }

    const qualification = buildWorldChampionshipQualification(candidates, referenceDate);
    if (tournament) {
        tournament.worldChampionshipQualification = {
            version: qualification.version,
            year: qualification.year,
            playerIds: [...qualification.playerIds],
            categories: qualification.categories.map(category => ({ ...category, playerIds: [...category.playerIds] })),
            complete: qualification.complete,
            shortfall: qualification.shortfall
        };
    }
    return qualification.participants;
}

function shuffleWorldChampionshipPlayers(players, random = Math.random) {
    const shuffled = [...players];
    for (let index = shuffled.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function buildWorldChampionshipDraw(participants, random = Math.random) {
    const ranked = uniqueWorldChampionshipPlayers(participants).sort(compareWorldChampionshipOom);
    if (ranked.length !== WORLD_CHAMPIONSHIP_FIELD_SIZE) return shuffleWorldChampionshipPlayers(ranked, random);

    const seeds = ranked.slice(0, 32);
    const unseeded = shuffleWorldChampionshipPlayers(ranked.slice(32), random);
    const draw = new Array(WORLD_CHAMPIONSHIP_FIELD_SIZE);
    const seedOrder = [1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21, 2, 31, 15, 18, 7, 26, 10, 23, 3, 30, 14, 19, 6, 27, 11, 22];
    let unseededIndex = 0;

    for (let section = 0; section < 32; section++) {
        const sectionStart = section * 4;
        draw[sectionStart] = seeds[seedOrder[section] - 1];
        draw[sectionStart + 1] = unseeded[unseededIndex++];
        draw[sectionStart + 2] = unseeded[unseededIndex++];
        draw[sectionStart + 3] = unseeded[unseededIndex++];
    }
    return draw;
}
