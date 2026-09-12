// Stored on the career player, independently of annual calendar/stat resets.
const CAREER_RECORDS_VERSION = 2;
const HISTORICAL_CHAMPIONS_VERSION = 2;
const CAREER_HISTORY_LAST_REAL_SEASON = 2025;
const CAREER_HEAD_TO_HEAD_PACKED_FORMAT = 'indexed-v1';
let careerRecordsInitializing = false;
let careerHeadToHeadRevision = 0;
const careerHeadToHeadPackCache = new WeakMap();
const careerHeadToHeadDirtyKeys = new WeakMap();

function isPackedCareerHeadToHead(value) {
    return value && typeof value === 'object' && !Array.isArray(value)
        && value.format === CAREER_HEAD_TO_HEAD_PACKED_FORMAT
        && Array.isArray(value.players) && Array.isArray(value.tournaments)
        && Array.isArray(value.rounds) && Array.isArray(value.rows);
}

function markCareerHeadToHeadChanged(headToHead, pairKey) {
    careerHeadToHeadRevision++;
    if (!headToHead || typeof headToHead !== 'object') return;
    if (!careerHeadToHeadDirtyKeys.has(headToHead)) careerHeadToHeadDirtyKeys.set(headToHead, new Set());
    careerHeadToHeadDirtyKeys.get(headToHead).add(pairKey);
}

function createCareerHeadToHeadPackState(cached = null) {
    const packed = cached?.packed;
    const players = packed ? [...packed.players] : [];
    const tournaments = packed ? [...packed.tournaments] : [];
    const rounds = packed ? [...packed.rounds] : [];
    return {
        players, tournaments, rounds,
        rows: packed ? [...packed.rows] : [],
        fallback: packed?.fallback ? { ...packed.fallback } : {},
        rowByPairKey: cached ? new Map(cached.rowByPairKey) : new Map(),
        playerIndexes: new Map(players.map((value, index) => [value, index])),
        tournamentIndexes: new Map(tournaments.map((value, index) => [value, index])),
        roundIndexes: new Map(rounds.map((value, index) => [value, index]))
    };
}

function packCareerHeadToHeadEntry(pairKey, entry, state) {
    const intern = (value, values, indexes) => {
        if (!indexes.has(value)) {
            indexes.set(value, values.length);
            values.push(value);
        }
        return indexes.get(value);
    };
    let pair, last;
    try {
        pair = JSON.parse(pairKey);
        last = JSON.parse(entry?.lastKey);
    } catch (_) {
        return null;
    }
    const entryKeys = entry && typeof entry === 'object' ? Object.keys(entry) : [];
    const canPack = Array.isArray(pair) && pair.length === 2 && pair.every(value => typeof value === 'string')
        && JSON.stringify(pair) === pairKey
        && Array.isArray(entry?.wins) && entry.wins.length === 2 && entry.wins.every(Number.isFinite)
        && Number.isFinite(entry?.since)
        && entryKeys.every(key => ['wins', 'lastKey', 'since'].includes(key))
        && Array.isArray(last) && last.length === 6
        && Number.isFinite(last[0]) && typeof last[1] === 'string'
        && Number.isFinite(last[2]) && Number.isFinite(last[3]) && typeof last[4] === 'string'
        && Array.isArray(last[5]) && last[5].length === 2 && last[5].every(value => typeof value === 'string')
        && JSON.stringify(last) === entry.lastKey;
    if (!canPack) return null;
    return [
        intern(pair[0], state.players, state.playerIndexes), intern(pair[1], state.players, state.playerIndexes),
        entry.wins[0], entry.wins[1], entry.since, last[0],
        intern(last[1], state.tournaments, state.tournamentIndexes), last[2], last[3],
        intern(last[4], state.rounds, state.roundIndexes),
        intern(last[5][0], state.players, state.playerIndexes), intern(last[5][1], state.players, state.playerIndexes)
    ];
}

function packCareerHeadToHead(headToHead) {
    if (!headToHead || typeof headToHead !== 'object' || Array.isArray(headToHead)
        || isPackedCareerHeadToHead(headToHead)) return headToHead || {};
    const cached = careerHeadToHeadPackCache.get(headToHead);
    if (cached?.revision === careerHeadToHeadRevision) return cached.packed;
    const dirtyKeys = careerHeadToHeadDirtyKeys.get(headToHead);
    if (cached && (!dirtyKeys || !dirtyKeys.size)) {
        cached.revision = careerHeadToHeadRevision;
        return cached.packed;
    }

    const state = createCareerHeadToHeadPackState(cached);
    const entries = cached
        ? [...dirtyKeys].map(pairKey => [pairKey, headToHead[pairKey]])
        : Object.entries(headToHead);
    entries.forEach(([pairKey, entry]) => {
        const row = packCareerHeadToHeadEntry(pairKey, entry, state);
        const existingRow = state.rowByPairKey.get(pairKey);
        if (row) {
            if (Number.isInteger(existingRow)) state.rows[existingRow] = row;
            else {
                state.rowByPairKey.set(pairKey, state.rows.length);
                state.rows.push(row);
            }
            delete state.fallback[pairKey];
        } else {
            if (Number.isInteger(existingRow)) {
                state.rows[existingRow] = null;
                state.rowByPairKey.delete(pairKey);
            }
            state.fallback[pairKey] = entry;
        }
    });

    const packed = {
        format: CAREER_HEAD_TO_HEAD_PACKED_FORMAT,
        players: state.players, tournaments: state.tournaments, rounds: state.rounds, rows: state.rows
    };
    if (Object.keys(state.fallback).length) packed.fallback = state.fallback;
    careerHeadToHeadPackCache.set(headToHead, {
        revision: careerHeadToHeadRevision, packed, rowByPairKey: state.rowByPairKey
    });
    if (dirtyKeys) dirtyKeys.clear();
    return packed;
}

function unpackCareerHeadToHead(packed) {
    if (!isPackedCareerHeadToHead(packed)) return packed && typeof packed === 'object' ? packed : {};
    const restored = {};
    packed.rows.forEach(row => {
        if (!Array.isArray(row) || row.length !== 12) return;
        const pair = [packed.players[row[0]], packed.players[row[1]]];
        const lastPlayers = [packed.players[row[10]], packed.players[row[11]]];
        const tournament = packed.tournaments[row[6]], round = packed.rounds[row[9]];
        if (!pair.every(value => typeof value === 'string')
            || !lastPlayers.every(value => typeof value === 'string')
            || typeof tournament !== 'string' || typeof round !== 'string'
            || ![row[2], row[3], row[4], row[5], row[7], row[8]].every(Number.isFinite)) return;
        restored[JSON.stringify(pair)] = {
            wins: [row[2], row[3]],
            lastKey: JSON.stringify([row[5], tournament, row[7], row[8], round, lastPlayers]),
            since: row[4]
        };
    });
    Object.entries(packed.fallback && typeof packed.fallback === 'object' ? packed.fallback : {})
        .forEach(([key, entry]) => { restored[key] = entry; });
    return restored;
}

function getCareerRecordsForSave(records = typeof player !== 'undefined' ? player?.careerRecords : null) {
    if (!records || typeof records !== 'object') return records;
    return { ...records, headToHead: packCareerHeadToHead(records.headToHead) };
}

function getCareerRecordPlayerKey(candidate) {
    return String(candidate?.id || `${candidate?.sourceName || candidate?.name || ''}|${candidate?.country || ''}`);
}

function normalizeHistoricalChampionName(value) {
    return String(value || '').trim().toLocaleLowerCase('pl').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\s+/g, ' ');
}

function getHistoricalChampionProfile(historicalId) {
    return typeof historicalChampionProfiles !== 'undefined'
        ? historicalChampionProfiles?.[historicalId] || null
        : null;
}

function findHistoricalChampionPlayer(historicalId) {
    const profile = getHistoricalChampionProfile(historicalId);
    if (!profile) return null;
    const aliases = new Set([profile.name, ...(profile.aliases || [])].map(normalizeHistoricalChampionName));
    return getCareerProfilePlayers().find(candidate => [candidate?.name, candidate?.sourceName]
        .some(name => aliases.has(normalizeHistoricalChampionName(name)))) || null;
}

function buildHistoricalIndividualChampion(historicalId, edition) {
    const profile = getHistoricalChampionProfile(historicalId);
    if (!profile) return null;
    const live = findHistoricalChampionPlayer(historicalId);
    return {
        key: live ? getCareerRecordPlayerKey(live) : `historical:${historicalId}`,
        id: live?.id || '', name: live?.name || profile.name,
        country: live?.country || profile.country || '', team: false,
        historical: true, historicalId,
        year: edition.year, editionLabel: edition.label || '', sortOrder: edition.sortOrder || edition.year
    };
}

function buildHistoricalTeamChampion(edition) {
    const members = (edition.members || []).map(historicalId => {
        const profile = getHistoricalChampionProfile(historicalId);
        const live = findHistoricalChampionPlayer(historicalId);
        return { historicalId, key: live ? getCareerRecordPlayerKey(live) : `historical:${historicalId}`,
            name: live?.name || profile?.name || historicalId };
    });
    return {
        key: `team:${edition.country}`, id: '', name: edition.country, country: edition.country,
        team: true, historical: true, year: edition.year,
        editionLabel: edition.label || '', sortOrder: edition.sortOrder || edition.year,
        members: members.map(member => member.name), memberKeys: members.map(member => member.key),
        historicalMemberIds: members.map(member => member.historicalId)
    };
}

function normalizeHistoricalEdition(rawEdition, team) {
    if (Array.isArray(rawEdition)) {
        return { year: Number(rawEdition[0]), champion: rawEdition[1], editionKey: String(rawEdition[0]),
            label: '', sortOrder: Number(rawEdition[0]) };
    }
    if (!rawEdition || typeof rawEdition !== 'object') return null;
    const year = Number(rawEdition.year);
    return { ...rawEdition, year, champion: team ? '' : rawEdition.champion,
        editionKey: String(rawEdition.editionKey || year), label: rawEdition.label || '',
        sortOrder: Number(rawEdition.sortOrder) || year };
}

function findHistoricalCareerTournament(history) {
    if (typeof tournamentDatabase === 'undefined' || !Array.isArray(tournamentDatabase)) return null;
    const target = normalizeHistoricalChampionName(history.tournament);
    return tournamentDatabase.find(event => history.specialType && event?.specialType === history.specialType)
        || tournamentDatabase.find(event => [event?.name, event?.sourceName]
            .some(name => normalizeHistoricalChampionName(name) === target))
        || null;
}

function seedHistoricalCareerChampions(records) {
    if (typeof historicalTournamentChampions === 'undefined' || !Array.isArray(historicalTournamentChampions)) return;
    // Kariera zaczyna się 1 stycznia 2026. Usuwamy wyłącznie stare dane
    // startowe oznaczone jako historyczne; wyników rozegranych w karierze nie ruszamy.
    Object.values(records.tournaments || {}).forEach(entry => {
        Object.entries(entry?.editions || {}).forEach(([editionKey, champion]) => {
            const year = Number(champion?.year) || Number(String(editionKey).slice(0, 4));
            if (champion?.historical && year > CAREER_HISTORY_LAST_REAL_SEASON) delete entry.editions[editionKey];
        });
    });
    historicalTournamentChampions.forEach(history => {
        const event = findHistoricalCareerTournament(history);
        if (!event || !isCareerChampionship(event)) return;
        const titleData = getPlayerCareerTitleData(event);
        const eventKey = JSON.stringify(titleData.key);
        const entry = records.tournaments[eventKey] ||= { ...titleData, editions: {}, conflicts: [] };
        entry.editions ||= {};
        if (!Array.isArray(entry.conflicts)) entry.conflicts = [];
        (history.editions || []).forEach(rawEdition => {
            const edition = normalizeHistoricalEdition(rawEdition, history.team);
            if (!edition || !Number.isInteger(edition.year) || edition.year < 1900 || edition.year > 2100) return;
            if (entry.conflicts.includes(edition.year) || entry.editions[String(edition.year)] || entry.editions[edition.editionKey]) return;
            const champion = history.team
                ? buildHistoricalTeamChampion(edition)
                : buildHistoricalIndividualChampion(edition.champion, edition);
            if (champion) entry.editions[edition.editionKey] = champion;
        });
    });
    records.historicalChampionsVersion = HISTORICAL_CHAMPIONS_VERSION;
}

function applyHistoricalChampionModOverrides(overrides, { useRealNameFallback = false } = {}) {
    if (typeof historicalChampionProfiles === 'undefined') return;
    if (useRealNameFallback) {
        Object.values(historicalChampionProfiles).forEach(profile => {
            const realName = Array.isArray(profile?.aliases)
                ? profile.aliases.find(alias => typeof alias === 'string' && alias.trim())
                : '';
            if (realName) profile.name = realName.trim();
        });
    }
    if (!Array.isArray(overrides)) return;
    overrides.forEach(override => {
        const profile = override && historicalChampionProfiles[override.id];
        if (!profile) return;
        if (typeof override.name === 'string' && override.name.trim()) profile.name = override.name.trim();
        if (typeof override.country === 'string' && override.country.trim()) profile.country = override.country.trim();
    });
}

function applyHistoricalChampionModData(modData = {}) {
    // Starsze mody nie posiadają sekcji historicalChampions. Sama obecność moda
    // oznacza jednak, że prawdziwe nazwy są pożądane również dla emerytów, których
    // nie da się odnaleźć w aktualnej liście pdcPlayers.
    applyHistoricalChampionModOverrides(
        Array.isArray(modData?.historicalChampions) ? modData.historicalChampions : [],
        { useRealNameFallback: true }
    );
}

function getCareerRecordTournament(tournament) {
    const name = tournament?.sourceName || tournament?.name || '';
    const normalize = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
    return (typeof tournamentDatabase !== 'undefined' ? tournamentDatabase : []).find(event =>
        [event.name, event.sourceName].some(alias => alias && normalize(alias) === normalize(name))) || tournament;
}

function isCareerChampionship(tournament) {
    const event = getCareerRecordTournament(tournament);
    return Boolean(event?.name) && !event.qualifierFor
        && !/qualif|kwalifikac|q.?school|pro card trials|night\s*\d|wiecz[oó]r\s*\d/i.test(`${event.name} ${event.sourceName || ''} ${event.specialType || ''}`);
}

function isCareerTeamChampionship(tournament) {
    const event = getCareerRecordTournament(tournament);
    return event?.isDoubles || event?.specialType === 'worldCup'
        || /puchar narodów|world cup|nations cup/i.test(`${event?.name} ${event?.sourceName || ''}`);
}

function initializeCareerRecords(reset = false) {
    if (typeof player === 'undefined' || !player) return null;
    if (careerRecordsInitializing) return player.careerRecords || null;
    if (!reset && isPackedCareerHeadToHead(player.careerRecords?.headToHead)) {
        player.careerRecords.headToHead = unpackCareerHeadToHead(player.careerRecords.headToHead);
        careerHeadToHeadRevision++;
    }
    if (!reset && player.careerRecords?.version === CAREER_RECORDS_VERSION
        && player.careerRecords?.historicalChampionsVersion === HISTORICAL_CHAMPIONS_VERSION) return player.careerRecords;

    const previous = !reset && player.careerRecords && typeof player.careerRecords === 'object'
        ? player.careerRecords : null;
    const records = player.careerRecords = previous || { version: CAREER_RECORDS_VERSION, tournaments: {}, headToHead: {} };
    records.tournaments ||= {};
    records.headToHead ||= {};
    careerRecordsInitializing = true;
    try {
        if (!reset && !previous) {
            // Import only dated wins. Totals with unknown years cannot identify an edition.
            getCareerProfilePlayers().forEach(candidate => {
                getPlayerCareerTitles(candidate).forEach(title => {
                    Object.entries(title.winsByYear || {}).forEach(([year, count]) => {
                        if (count > 0) recordCareerChampion(title, candidate, Number(year), true);
                    });
                });
                (candidate.seasonStats?.results || []).forEach(result => {
                    if (!result.won) return;
                    const year = result.timestamp > 0 ? new Date(result.timestamp).getFullYear() : Number(candidate.seasonStats.year);
                    recordCareerChampion({ name: result.tournament, sourceName: result.sourceTournament,
                        specialType: result.tournamentSpecialType }, candidate, year, true);
                });
            });
            const seen = new Set();
            const candidates = getCareerProfilePlayers();
            candidates.forEach(candidate => {
                getRecentPlayerMatches(candidate).forEach(match => {
                    if (!match.key || seen.has(match.key)) return;
                    const opponent = candidates.find(other => match.opponentId
                        ? String(other.id) === String(match.opponentId)
                        : other.name === match.opponentName && (other.country || '') === (match.opponentCountry || ''));
                    if (!opponent) return;
                    seen.add(match.key);
                    recordCareerHeadToHead(candidate, opponent, match.scoreFor, match.scoreAgainst, match.key, match.timestamp);
                });
            });
        }
        seedHistoricalCareerChampions(records);
        records.version = CAREER_RECORDS_VERSION;
    } finally {
        careerRecordsInitializing = false;
    }
    return records;
}

function recordCareerChampion(tournament, winner, year = getCurrentSeasonYear(), migrating = false) {
    if (!winner || !Number.isInteger(year) || year < 1900 || year > getCurrentSeasonYear() || !isCareerChampionship(tournament)) return;
    const records = initializeCareerRecords();
    if (!records) return;
    const event = getCareerRecordTournament(tournament);
    const team = isCareerTeamChampionship(event);
    if (team && !winner.country) return;
    const key = getPlayerCareerTitleData(event).key;
    const eventKey = JSON.stringify(key);
    const entry = records.tournaments[eventKey] ||= { ...getPlayerCareerTitleData(event), editions: {}, conflicts: [] };
    const champion = { key: team ? `team:${winner.country}` : getCareerRecordPlayerKey(winner),
        id: team ? '' : (winner.id || ''), name: team ? winner.country : winner.name,
        country: winner.country || '', team: Boolean(team) };
    if (team) {
        const members = (winner.players || [winner]).filter(Boolean);
        champion.members = members.map(member => typeof member === 'string' ? member : member.name).filter(Boolean);
        champion.memberKeys = members.map(member => typeof member === 'string' ? '' : getCareerRecordPlayerKey(member));
    }
    const previous = entry.editions[year];
    if (migrating && (entry.conflicts.includes(year) || (previous && previous.key !== champion.key))) {
        delete entry.editions[year];
        if (!entry.conflicts.includes(year)) entry.conflicts.push(year);
        return;
    }
    if (team && previous?.key === champion.key && !previous.historical) {
        champion.members = [...new Set([...(previous.members || []), ...champion.members])];
    }
    entry.editions[year] = champion;
    if (!migrating) entry.conflicts = entry.conflicts.filter(value => value !== year);
}

function getCareerChampions(tournament) {
    const key = getPlayerCareerTitleData(getCareerRecordTournament(tournament)).key;
    const entry = player?.careerRecords?.tournaments?.[JSON.stringify(key)];
    const editions = Object.entries(entry?.editions || {}).map(([editionKey, champion]) => {
        const storedYear = Number(champion?.year);
        const parsedYear = Number(String(editionKey).slice(0, 4));
        const year = Number.isInteger(storedYear) ? storedYear : parsedYear;
        return { year, editionKey, sortOrder: Number(champion?.sortOrder) || year, ...champion };
    }).filter(champion => Number.isInteger(champion.year))
        .sort((a, b) => b.sortOrder - a.sortOrder || b.year - a.year || b.editionKey.localeCompare(a.editionKey));
    const counts = new Map();
    editions.forEach(champion => {
        const current = counts.get(champion.key) || { ...champion, count: 0 };
        current.count++;
        counts.set(champion.key, current);
    });
    const best = Math.max(0, ...[...counts.values()].map(champion => champion.count));
    return { editions, leaders: [...counts.values()].filter(champion => champion.count === best) };
}

function recordCareerHeadToHead(first, second, score1, score2, matchKey, timestamp = currentDate.getTime()) {
    if (!Number.isInteger(score1) || !Number.isInteger(score2) || score1 < 0 || score2 < 0 || score1 === score2 || !matchKey) return;
    const keys = [getCareerRecordPlayerKey(first), getCareerRecordPlayerKey(second)].sort();
    if (keys[0] === keys[1]) return;
    const records = initializeCareerRecords();
    if (!records) return;
    const pairKey = JSON.stringify(keys);
    const entry = records.headToHead[pairKey] ||= { wins: [0, 0], lastKey: '', since: timestamp };
    if (entry.lastKey === matchKey) return;
    const winnerKey = getCareerRecordPlayerKey(score1 > score2 ? first : second);
    entry.wins[keys.indexOf(winnerKey)]++;
    entry.since = Math.min(entry.since, timestamp);
    // Official match-stat keys already guard retries throughout the season.
    // Retain only the latest key; do not duplicate an entire match log per pair.
    entry.lastKey = matchKey;
    markCareerHeadToHeadChanged(records.headToHead, pairKey);
}

function getCareerHeadToHead(first, second) {
    const firstKey = getCareerRecordPlayerKey(first), secondKey = getCareerRecordPlayerKey(second);
    const keys = [firstKey, secondKey].sort();
    if (firstKey === secondKey) return { wins: 0, losses: 0, matches: 0 };
    const entry = player?.careerRecords?.headToHead?.[JSON.stringify(keys)];
    let wins = entry?.wins[keys.indexOf(firstKey)] || 0;
    let losses = entry?.wins[keys.indexOf(secondKey)] || 0;
    // Older careers already keep the career player's full rivalry totals.
    const ownKey = getCareerRecordPlayerKey(player);
    const rivalry = player?.rivalries?.[firstKey === ownKey ? second.id : secondKey === ownKey ? first.id : ''];
    if (rivalry && Number(rivalry.matches) > wins + losses) {
        wins = Number(firstKey === ownKey ? rivalry.wins : rivalry.losses) || 0;
        losses = Number(firstKey === ownKey ? rivalry.losses : rivalry.wins) || 0;
    }
    return { wins, losses, matches: wins + losses };
}

function getPlayerComparisonStats(candidate) {
    const stats = Number(candidate?.seasonStats?.year) === getCurrentSeasonYear() ? candidate.seasonStats.matchStats : null;
    const recent = getRecentPlayerMatches(candidate);
    // Legacy title normalization operates on a copy: browsing must not reset stats.
    const titles = getPlayerCareerTitles({ careerTitlesVersion: candidate.careerTitlesVersion,
        careerTitles: JSON.parse(JSON.stringify(candidate.careerTitles || [])),
        careerStats: candidate.careerStats, careerChronicle: candidate.careerChronicle,
        seasonStats: { results: (candidate.seasonStats?.results || []).map(result => ({ ...result })) } });
    return { stats, recent, titleCount: titles.reduce((sum, title) => sum + title.count, 0),
        average: stats?.averageCount > 0 ? stats.averageTotal / stats.averageCount : null,
        checkout: stats?.doubleMatches > 0 && stats.doubleAttempts > 0 ? stats.doubleHits / stats.doubleAttempts * 100 : null,
        oneEighties: stats?.oneEightyMatches > 0 ? stats.oneEighties : null };
}
