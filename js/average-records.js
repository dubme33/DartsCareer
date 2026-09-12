let averageRecordsSortMode = 'season';

function getAverageRecordsSeasonYear() {
    if (typeof getCurrentSeasonYear === 'function') return getCurrentSeasonYear();
    const date = typeof currentDate !== 'undefined' ? new Date(currentDate) : new Date();
    return Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
}

function getAverageRecordsCandidates() {
    if (typeof getCareerProfilePlayers === 'function') return getCareerProfilePlayers();
    const candidates = [];
    if (typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers)) candidates.push(...pdcPlayers);
    if (typeof player !== 'undefined' && player) candidates.push(player);
    return candidates.filter(candidate => candidate && !candidate.isBye);
}

function getPlayerSeasonHighestAverage(candidate, year = getAverageRecordsSeasonYear()) {
    if (!candidate || Number(candidate.seasonStats?.year) !== Number(year)) return 0;
    const average = Number(candidate.seasonStats?.highestAvg);
    return Number.isFinite(average) && average > 0 ? Number(average.toFixed(2)) : 0;
}

function getAverageRecordsRanking(mode = averageRecordsSortMode, candidates = getAverageRecordsCandidates(), year = getAverageRecordsSeasonYear()) {
    const sortMode = mode === 'career' ? 'career' : 'season';
    return candidates
        .filter(candidate => candidate && !candidate.isBye)
        .map(candidate => ({
            player: candidate,
            season: getPlayerSeasonHighestAverage(candidate, year),
            career: typeof getPlayerCareerHighestAverage === 'function'
                ? getPlayerCareerHighestAverage(candidate)
                : Math.max(0, Number(candidate.careerStats?.highestAvg) || 0),
            careerYear: Number.isInteger(Number(candidate.careerStats?.highestAvgYear))
                ? Number(candidate.careerStats.highestAvgYear)
                : null
        }))
        .filter(row => row[sortMode] > 0)
        .sort((first, second) => second[sortMode] - first[sortMode]
            || second[sortMode === 'season' ? 'career' : 'season'] - first[sortMode === 'season' ? 'career' : 'season']
            || (Number(second.player.prizeMoney) || 0) - (Number(first.player.prizeMoney) || 0)
            || String(first.player.name || '').localeCompare(String(second.player.name || '')));
}

function formatAverageRecord(value) {
    const average = Number(value);
    return Number.isFinite(average) && average > 0 ? average.toFixed(2) : '—';
}

function renderAverageRecordsRanking(list = document.getElementById('pdc-list')) {
    if (!list) return;
    const year = getAverageRecordsSeasonYear();
    const rows = getAverageRecordsRanking(averageRecordsSortMode, getAverageRecordsCandidates(), year);
    const seasonActive = averageRecordsSortMode === 'season';
    const careerActive = averageRecordsSortMode === 'career';
    const controls = `<section class="average-records-intro">
        <h3>🎯 ${escapeHtml(t('t-average-records-title'))}</h3>
        <p>${escapeHtml(t('t-average-records-note'))}</p>
        <div class="average-records-switch" role="group" aria-label="${escapeHtml(t('t-average-records-sort-label'))}">
            <button type="button" class="${seasonActive ? 'active' : ''}" aria-pressed="${seasonActive}" onclick="setAverageRecordsSortMode('season')">${escapeHtml(t('t-average-records-season'))} ${year}</button>
            <button type="button" class="${careerActive ? 'active' : ''}" aria-pressed="${careerActive}" onclick="setAverageRecordsSortMode('career')">${escapeHtml(t('t-average-records-career'))}</button>
        </div>
    </section>`;
    const header = `<div class="average-records-header">
        <span>${escapeHtml(t('t-average-records-player'))}</span>
        <span>${escapeHtml(t('t-average-records-season-column'))}</span>
        <span>${escapeHtml(t('t-average-records-career-column'))}</span>
    </div>`;
    const body = rows.length ? rows.map((row, index) => {
        const candidate = row.player;
        const isMe = typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate);
        const careerYear = row.careerYear === null ? '' : `<small>${row.careerYear}</small>`;
        return `<button type="button" class="ranking-player-row average-record-row" data-player-id="${escapeHtml(candidate.id || '')}">
            <span class="average-record-player"><strong>#${index + 1}</strong> ${getFlagImg(candidate.country)} ${escapeHtml(candidate.name)}${isMe ? ` <b>${escapeHtml(t('t-average-records-you'))}</b>` : ''}</span>
            <span class="average-record-value ${seasonActive ? 'sorted' : ''}">${formatAverageRecord(row.season)}</span>
            <span class="average-record-value ${careerActive ? 'sorted' : ''}">${formatAverageRecord(row.career)}${careerYear}</span>
        </button>`;
    }).join('') : `<p class="average-records-empty">${escapeHtml(t('t-average-records-empty'))}</p>`;

    list.innerHTML = controls + header + body;
}

function setAverageRecordsSortMode(mode) {
    averageRecordsSortMode = mode === 'career' ? 'career' : 'season';
    const list = document.getElementById('pdc-list');
    renderAverageRecordsRanking(list);
    if (list && typeof attachRankingProfileLinks === 'function') attachRankingProfileLinks(list, 'averages');
}

function refreshAverageRecordsTranslations() {
    if (typeof currentPdcRankingType === 'string' && currentPdcRankingType === 'averages') {
        setAverageRecordsSortMode(averageRecordsSortMode);
    }
}
