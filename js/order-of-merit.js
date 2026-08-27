// Główny PDC Order of Merit: wyłącznie nagrody z turniejów rankingowych
// zdobyte w kroczącym okresie dwóch lat kalendarzowych.
const MAIN_ORDER_OF_MERIT_VERSION = 2;
let mainOrderOfMeritRefreshCache = null;

function getMainOomExpiryTime(earnedAt) {
    const expiryDate = new Date(Number(earnedAt));
    if (Number.isNaN(expiryDate.getTime())) return null;
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    return expiryDate.getTime();
}

function getMainOomRefreshSnapshot(candidate) {
    const history = Array.isArray(candidate?.mainPrizeHistory) ? candidate.mainPrizeHistory : null;
    const lastEntry = history?.at(-1);
    const lastEarnedAt = Number(lastEntry?.earnedAt);
    const lastAmount = Number(lastEntry?.amount);
    return {
        candidate,
        history,
        historyLength: history?.length || 0,
        lastEarnedAt: Number.isFinite(lastEarnedAt) ? lastEarnedAt : null,
        lastAmount: Number.isFinite(lastAmount) ? lastAmount : null,
        prizeMoney: Number(candidate?.prizeMoney) || 0,
        version: candidate?.mainOomHistoryVersion
    };
}

function isMainOomRefreshSnapshotCurrent(snapshot, candidate) {
    if (!snapshot || snapshot.candidate !== candidate) return false;
    const history = Array.isArray(candidate?.mainPrizeHistory) ? candidate.mainPrizeHistory : null;
    const lastEntry = history?.at(-1);
    const lastEarnedAt = Number(lastEntry?.earnedAt);
    const lastAmount = Number(lastEntry?.amount);
    return snapshot.history === history
        && snapshot.historyLength === (history?.length || 0)
        && snapshot.lastEarnedAt === (Number.isFinite(lastEarnedAt) ? lastEarnedAt : null)
        && snapshot.lastAmount === (Number.isFinite(lastAmount) ? lastAmount : null)
        && snapshot.prizeMoney === (Number(candidate?.prizeMoney) || 0)
        && snapshot.version === candidate?.mainOomHistoryVersion;
}

function canReuseMainOrderOfMeritRefresh(candidates, referenceTime) {
    const cache = mainOrderOfMeritRefreshCache;
    if (!cache || candidates.length < 64 || cache.candidates.length !== candidates.length) return false;
    if (referenceTime < cache.referenceTime) return false;
    if (Number.isFinite(cache.nextExpiryTime) && referenceTime >= cache.nextExpiryTime) return false;
    return candidates.every((candidate, index) =>
        isMainOomRefreshSnapshotCurrent(cache.candidates[index], candidate));
}

function updateMainOrderOfMeritRefreshCache(candidates, referenceTime) {
    let nextExpiryTime = Infinity;
    candidates.forEach(candidate => {
        (Array.isArray(candidate?.mainPrizeHistory) ? candidate.mainPrizeHistory : []).forEach(entry => {
            const expiryTime = getMainOomExpiryTime(entry?.earnedAt);
            if (Number.isFinite(expiryTime) && expiryTime > referenceTime && expiryTime < nextExpiryTime) {
                nextExpiryTime = expiryTime;
            }
        });
    });
    mainOrderOfMeritRefreshCache = {
        referenceTime,
        nextExpiryTime,
        candidates: candidates.map(getMainOomRefreshSnapshot)
    };
}

function invalidateMainOrderOfMeritRefreshCache() {
    mainOrderOfMeritRefreshCache = null;
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('main');
}

function getMainOomReferenceTime(referenceDate = typeof currentDate !== 'undefined' ? currentDate : null) {
    const time = referenceDate instanceof Date
        ? referenceDate.getTime()
        : (Number.isFinite(Number(referenceDate)) ? Number(referenceDate) : new Date(referenceDate).getTime());
    return Number.isFinite(time) ? time : Date.now();
}

function getMainOomTournamentName(tournamentOrName) {
    return typeof tournamentOrName === 'string'
        ? tournamentOrName
        : String(tournamentOrName?.name || '');
}

function getMainOomTournamentSourceName(tournamentOrName) {
    if (typeof getTournamentSourceName === 'function') return getTournamentSourceName(tournamentOrName);
    if (tournamentOrName && typeof tournamentOrName === 'object') {
        return String(tournamentOrName.sourceName || tournamentOrName.name || '');
    }
    const name = getMainOomTournamentName(tournamentOrName);
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === name)
        : null;
    return String(tournament?.sourceName || name);
}

function isMainOrderOfMeritRankingTournament(tournamentOrName) {
    const displayName = getMainOomTournamentName(tournamentOrName).toLocaleLowerCase();
    const sourceName = getMainOomTournamentSourceName(tournamentOrName).toLocaleLowerCase();
    const searchableName = `${displayName} ${sourceName}`;
    const specialType = typeof tournamentOrName === 'object'
        ? String(tournamentOrName?.specialType || '').toLocaleLowerCase()
        : '';

    if (specialType.includes('qualifier') || specialType.includes('worldmasters') || specialType.includes('worldcup')) return false;
    if (searchableName.includes('qualifier') || searchableName.includes('kwalifikacj')) return false;
    if (searchableName.includes('world masters') || searchableName.includes('masters finals')) return false;
    if (searchableName.includes('global darts league') || searchableName.includes('premier league')) return false;
    if (searchableName.includes('world cup') || searchableName.includes('puchar narodów')) return false;

    if (typeof isProTourRankingTournament === 'function' && isProTourRankingTournament(tournamentOrName)) return true;

    return searchableName.includes('world darts championship')
        || searchableName.includes('global darts championship')
        || searchableName.includes('uk open')
        || searchableName.includes('british open')
        || searchableName.includes('world matchplay')
        || searchableName.includes('global matchplay')
        || searchableName.includes('world grand prix')
        || searchableName.includes('global grand prix')
        || searchableName.includes('european championship')
        || searchableName.includes('continental championship')
        || searchableName.includes('grand slam of darts')
        || searchableName.includes("champion's slam")
        || searchableName.includes('players championship finals')
        || searchableName.includes('pro players finals');
}

function getMainOomCutoffTime(referenceTime) {
    const cutoff = new Date(referenceTime);
    cutoff.setFullYear(cutoff.getFullYear() - 2);
    return cutoff.getTime();
}

function getMainOomHistoricalEntries(templateIndex) {
    if (!Number.isInteger(templateIndex) || typeof PDC_OOM_HISTORICAL_EVENTS === 'undefined') return [];
    const entries = PDC_OOM_HISTORICAL_EVENTS.flatMap(event => {
        // Stan otwarcia jest już stanem po MŚ 2026, więc nagroda z edycji
        // 2024 została w tym momencie obroniona/usunięta z rankingu.
        if (event?.key === 'world-championship-2024') return [];
        const amount = Math.max(0, Number(event?.prizes?.[templateIndex]) || 0);
        if (amount <= 0) return [];
        return [{
            tournament: String(event.key),
            amount,
            earnedAt: new Date(event.year, event.month, event.day).getTime(),
            historical: true,
            eventKey: String(event.key)
        }];
    });

    const worldChampionshipPrize = typeof PDC_OOM_WORLD_CHAMPIONSHIP_2026_PRIZES !== 'undefined'
        ? Math.max(0, Number(PDC_OOM_WORLD_CHAMPIONSHIP_2026_PRIZES[templateIndex]) || 0)
        : 0;
    if (worldChampionshipPrize > 0) {
        entries.push({
            tournament: 'world-championship-2026',
            amount: worldChampionshipPrize,
            // W kalendarzu gry kariera zaczyna się 1 stycznia, ale jej OOM
            // odpowiada opublikowanemu stanowi po finale z 3 stycznia.
            earnedAt: new Date(2026, 0, 1).getTime(),
            historical: true,
            eventKey: 'world-championship-2026'
        });
    }

    return reconcileMainOomOpeningSnapshot(entries, templateIndex);
}

function reconcileMainOomOpeningSnapshot(entries, templateIndex) {
    if (typeof PDC_OOM_OPENING_TOTALS === 'undefined') return entries;

    const hasSnapshotValue = Object.prototype.hasOwnProperty.call(PDC_OOM_OPENING_TOTALS, templateIndex);
    const targetTotal = hasSnapshotValue ? Math.max(0, Number(PDC_OOM_OPENING_TOTALS[templateIndex]) || 0) : 0;
    const reconciled = entries.map(entry => ({ ...entry }));
    let currentTotal = reconciled.reduce((sum, entry) => sum + entry.amount, 0);

    if (currentTotal > targetTotal) {
        let excess = currentTotal - targetTotal;
        // Najpierw korygujemy rozbieżności w rozbiciu sezonu 2025. Kwoty
        // z 2024 pozostają nienaruszone tak długo, jak to możliwe, dzięki
        // czemu nadal wypadają z OOM w prawidłwych terminach w 2026 roku.
        const reducibleEntries = reconciled
            .filter(entry => entry.eventKey !== 'world-championship-2026')
            .sort((first, second) => {
                const firstYear = Number(String(first.eventKey || '').match(/(20\d{2})$/)?.[1]) || 0;
                const secondYear = Number(String(second.eventKey || '').match(/(20\d{2})$/)?.[1]) || 0;
                return secondYear - firstYear || second.earnedAt - first.earnedAt;
            });

        for (const entry of reducibleEntries) {
            if (excess <= 0) break;
            const reduction = Math.min(entry.amount, excess);
            entry.amount -= reduction;
            excess -= reduction;
        }
        if (excess > 0) {
            const worldsEntry = reconciled.find(entry => entry.eventKey === 'world-championship-2026');
            if (worldsEntry) worldsEntry.amount = Math.max(0, worldsEntry.amount - excess);
        }
    }

    const positiveEntries = reconciled.filter(entry => entry.amount > 0);
    currentTotal = positiveEntries.reduce((sum, entry) => sum + entry.amount, 0);
    if (currentTotal < targetTotal) {
        positiveEntries.push({
            tournament: '__opening_oom_reconciliation__',
            amount: targetTotal - currentTotal,
            earnedAt: new Date(2025, 0, 1).getTime(),
            historical: true,
            eventKey: 'opening-reconciliation-2025'
        });
    }
    return positiveEntries;
}

function inferMainOomTemplateIndex(candidate, fallbackIndex = null) {
    if (Number.isInteger(candidate?.defaultTemplateIndex)) return candidate.defaultTemplateIndex;
    const historySize = typeof PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX !== 'undefined'
        ? PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX.length
        : 0;
    if (Number.isInteger(fallbackIndex) && fallbackIndex >= 0 && fallbackIndex < historySize) return fallbackIndex;

    const normalize = value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');
    const names = new Set([candidate?.sourceName, candidate?.name].map(normalize).filter(Boolean));
    if (typeof defaultPdcPlayerTemplates !== 'undefined' && Array.isArray(defaultPdcPlayerTemplates)) {
        const index = defaultPdcPlayerTemplates.findIndex(template => names.has(normalize(template?.name)));
        if (index >= 0 && index < historySize) return index;
    }
    if (typeof PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX !== 'undefined') {
        const index = PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX.findIndex(name => names.has(normalize(name)));
        if (index >= 0) return index;
    }
    return null;
}

function sanitiseMainOomHistory(entries) {
    return (Array.isArray(entries) ? entries : [])
        .map(entry => ({
            tournament: String(entry?.tournament || ''),
            amount: Math.max(0, Number(entry?.amount) || 0),
            earnedAt: Number(entry?.earnedAt),
            ...(entry?.historical ? { historical: true } : {}),
            ...(entry?.eventKey ? { eventKey: String(entry.eventKey) } : {})
        }))
        .filter(entry => entry.tournament && entry.amount > 0 && Number.isFinite(entry.earnedAt));
}

function getMainOomTournamentDate(tournamentName, referenceTime) {
    const tournament = typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
        ? tournamentDatabase.find(candidate => candidate?.name === tournamentName || candidate?.sourceName === tournamentName)
        : null;
    if (!tournament || !Number.isInteger(tournament.month) || !Number.isInteger(tournament.day)) return referenceTime;

    const reference = new Date(referenceTime);
    const month = Number.isInteger(tournament.endMonth) ? tournament.endMonth : tournament.month;
    const day = Number.isInteger(tournament.endDay) ? tournament.endDay : tournament.day;
    const eventDate = new Date(reference.getFullYear(), month, day);
    if (!tournament.completed || eventDate.getTime() > referenceTime) {
        eventDate.setFullYear(eventDate.getFullYear() - 1);
    }
    return eventDate.getTime();
}

function getLegacyMainOomEntries(candidate, referenceTime) {
    const legacyHistory = candidate?.historyMain && typeof candidate.historyMain === 'object'
        ? candidate.historyMain
        : {};
    const entries = [];

    Object.entries(legacyHistory).forEach(([tournamentName, rawValue]) => {
        if (!isMainOrderOfMeritRankingTournament(tournamentName)) return;
        const values = Array.isArray(rawValue) ? rawValue : [rawValue];
        const amount = Math.max(0, Number(values.at(-1)) || 0);
        if (amount <= 0) return;

        // W starym systemie początkowe kwoty były sztucznie dzielone przez 80.
        // Ostatni element tablicy był jednak faktyczną wypłatą. Jeżeli
        // turniej nie jest ukończony w bieżącym sezonie, przypisujemy ją do
        // poprzedniej edycji (ważne przy wczytywaniu zapisów z 2027+).
        entries.push({
            tournament: tournamentName,
            amount,
            earnedAt: getMainOomTournamentDate(tournamentName, referenceTime)
        });
    });
    return entries;
}

function normaliseMainOrderOfMeritHistory(candidate, referenceTime, fallbackIndex = null) {
    if (!candidate || candidate.isBye) return [];
    const templateIndex = inferMainOomTemplateIndex(candidate, fallbackIndex);
    if (Number.isInteger(templateIndex) && !Number.isInteger(candidate.defaultTemplateIndex)) {
        candidate.defaultTemplateIndex = templateIndex;
    }

    if (candidate.mainOomHistoryVersion === MAIN_ORDER_OF_MERIT_VERSION && Array.isArray(candidate.mainPrizeHistory)) {
        candidate.mainPrizeHistory = sanitiseMainOomHistory(candidate.mainPrizeHistory);
        return candidate.mainPrizeHistory;
    }

    const existingHistory = sanitiseMainOomHistory(candidate.mainPrizeHistory);
    if (Number.isInteger(templateIndex)) {
        const gameEarnedEntries = existingHistory.filter(entry => !entry.historical);
        const legacyEntries = existingHistory.length ? [] : getLegacyMainOomEntries(candidate, referenceTime);
        candidate.mainPrizeHistory = [
            ...getMainOomHistoricalEntries(templateIndex),
            ...gameEarnedEntries,
            ...legacyEntries
        ];
    } else {
        candidate.mainPrizeHistory = existingHistory.length
            ? existingHistory
            : getLegacyMainOomEntries(candidate, referenceTime);
    }
    candidate.mainOomHistoryVersion = MAIN_ORDER_OF_MERIT_VERSION;
    return candidate.mainPrizeHistory;
}

function refreshMainOrderOfMerit(candidates, referenceDate) {
    const referenceTime = getMainOomReferenceTime(referenceDate);
    const cutoff = getMainOomCutoffTime(referenceTime);
    const list = Array.isArray(candidates) ? candidates : [];
    if (canReuseMainOrderOfMeritRefresh(list, referenceTime)) return false;

    list.forEach(candidate => {
        if (!candidate || candidate.isBye) return;
        const activeEntries = normaliseMainOrderOfMeritHistory(candidate, referenceTime)
            .filter(entry => entry.earnedAt > cutoff && entry.earnedAt <= referenceTime);
        candidate.mainPrizeHistory = activeEntries;
        candidate.prizeMoney = activeEntries.reduce((total, entry) => total + entry.amount, 0);
        candidate.mainOomHistoryVersion = MAIN_ORDER_OF_MERIT_VERSION;
    });

    if (list.length >= 64) {
        const ranked = list.filter(candidate => candidate && !candidate.isBye)
            .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
        ranked.forEach((candidate, index) => {
            candidate.mainOomTourCardProtected = index < 64;
        });
    }
    if (list.length >= 64) updateMainOrderOfMeritRefreshCache(list, referenceTime);
    if (typeof invalidatePlayerRankingCache === 'function') invalidatePlayerRankingCache('main');
    return true;
}

function awardMainOrderOfMeritPrizeMoney(candidate, amount, tournamentOrName, referenceDate) {
    if (!candidate || !isMainOrderOfMeritRankingTournament(tournamentOrName)) return false;
    const prize = Math.max(0, Number(amount) || 0);
    if (prize <= 0) return false;

    const referenceTime = getMainOomReferenceTime(referenceDate);
    refreshMainOrderOfMerit([candidate], referenceTime);
    const tournamentName = getMainOomTournamentName(tournamentOrName);
    candidate.mainPrizeHistory.push({ tournament: tournamentName, amount: prize, earnedAt: referenceTime });
    if (!candidate.historyMain || typeof candidate.historyMain !== 'object') candidate.historyMain = {};
    candidate.historyMain[tournamentName] = (Number(candidate.historyMain[tournamentName]) || 0) + prize;
    refreshMainOrderOfMerit([candidate], referenceTime);
    // Pełny ranking musi zostać ponownie sprawdzony po zmianie historii jednego gracza.
    // Snapshot wykrywa zmianę również bez tego wywołania, ale jawne unieważnienie
    // od razu usuwa nieaktualną mapę pozycji używaną przez interfejs.
    invalidateMainOrderOfMeritRefreshCache();
    return true;
}

function migrateMainOrderOfMeritFromHistory(candidates, tournaments, referenceDate) {
    refreshMainOrderOfMerit(candidates, referenceDate);
}

// Ustawienie prawidłowego rankingu na ekranie startowym, jeszcze przed
// rozpoczęciem kariery. Pseudonimy zawodników pozostają bez zmian.
if (typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)) {
    const historicalPlayerCount = typeof PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX !== 'undefined'
        ? PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX.length
        : 0;
    pdcPlayers.slice(0, historicalPlayerCount).forEach((candidate, index) => {
        if (candidate && !Number.isInteger(candidate.defaultTemplateIndex)) candidate.defaultTemplateIndex = index;
    });
    refreshMainOrderOfMerit(pdcPlayers, typeof currentDate !== 'undefined' ? currentDate : new Date(2026, 0, 1));
}
if (typeof defaultPdcPlayerTemplates !== 'undefined' && Array.isArray(defaultPdcPlayerTemplates)) {
    const historicalTemplateCount = typeof PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX !== 'undefined'
        ? PDC_OOM_REAL_NAMES_BY_TEMPLATE_INDEX.length
        : 0;
    defaultPdcPlayerTemplates.slice(0, historicalTemplateCount).forEach((candidate, index) => {
        if (candidate && !Number.isInteger(candidate.defaultTemplateIndex)) candidate.defaultTemplateIndex = index;
    });
    refreshMainOrderOfMerit(defaultPdcPlayerTemplates, typeof currentDate !== 'undefined' ? currentDate : new Date(2026, 0, 1));
}
