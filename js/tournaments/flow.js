const PLAYERS_CHAMPIONSHIP_FIELD_SIZE = 128;
const PLAYERS_CHAMPIONSHIP_TOP_20_WITHDRAWAL_CHANCE = 0.30;

const TOURNAMENT_WITHDRAWAL_REPORT_TEXT = {
    pl: {
        sender: 'Biuro turniejowe',
        subject: 'Wycofania z turnieju: {tournament}',
        intro: 'Po zamknięciu listy startowej z turnieju {tournament} wycofali się:',
        nationality: 'Narodowość',
        rank: 'Ranking OOM'
    },
    en: {
        sender: 'Tournament Office',
        subject: 'Tournament withdrawals: {tournament}',
        intro: 'After entries closed, the following players withdrew from {tournament}:',
        nationality: 'Nationality',
        rank: 'OOM ranking'
    },
    de: {
        sender: 'Turnierbüro',
        subject: 'Absagen für das Turnier: {tournament}',
        intro: 'Nach Meldeschluss haben folgende Spieler für {tournament} abgesagt:',
        nationality: 'Nationalität',
        rank: 'OOM-Rangliste'
    },
    nl: {
        sender: 'Toernooibureau',
        subject: 'Afgemeld voor het toernooi: {tournament}',
        intro: 'Na het sluiten van de inschrijving hebben de volgende spelers zich afgemeld voor {tournament}:',
        nationality: 'Nationaliteit',
        rank: 'OOM-ranking'
    }
};

function trTournamentWithdrawalReport(key, values = {}) {
    const language = typeof currentLang === 'string' && TOURNAMENT_WITHDRAWAL_REPORT_TEXT[currentLang]
        ? currentLang
        : 'pl';
    let text = TOURNAMENT_WITHDRAWAL_REPORT_TEXT[language][key]
        || TOURNAMENT_WITHDRAWAL_REPORT_TEXT.pl[key]
        || key;
    Object.entries(values).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, String(value ?? ''));
    });
    return text;
}

function getTournamentWithdrawalPlayerKey(candidate) {
    if (!candidate || candidate.isBye) return '';
    return candidate.id || `${String(candidate.name || '').trim()}|${String(candidate.country || '').trim()}`;
}

function getTournamentWithdrawalCandidates(candidates) {
    const source = Array.isArray(candidates)
        ? candidates
        : [
            ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
            ...(typeof player !== 'undefined' && player?.name ? [player] : [])
        ];
    const unique = new Map();
    source.forEach(candidate => {
        const key = getTournamentWithdrawalPlayerKey(candidate);
        if (key && !unique.has(key)) unique.set(key, candidate);
    });
    return [...unique.values()];
}

function createTournamentWithdrawalReportEntries(withdrawnPlayers = [], candidates) {
    const ranking = getTournamentWithdrawalCandidates(candidates).sort((first, second) =>
        (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || (Number(second?.ovr ?? second?.overall) || 0) - (Number(first?.ovr ?? first?.overall) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl'));
    const rankByKey = new Map(ranking.map((candidate, index) => [getTournamentWithdrawalPlayerKey(candidate), index + 1]));
    const unique = new Map();
    (Array.isArray(withdrawnPlayers) ? withdrawnPlayers : []).forEach(candidate => {
        const key = getTournamentWithdrawalPlayerKey(candidate);
        if (!key || unique.has(key) || (typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate))) return;
        unique.set(key, {
            playerId: candidate.id || '',
            playerKey: key,
            name: String(candidate.name || ''),
            country: String(candidate.country || ''),
            overall: Math.round(Number(candidate.ovr ?? candidate.overall) || 0),
            oomRank: rankByKey.get(key) || 0
        });
    });
    return [...unique.values()];
}

function resolveTournamentWithdrawalReportEntries(tournament, candidates) {
    if (!tournament) return [];
    if (Array.isArray(tournament.withdrawalReportEntries)) return tournament.withdrawalReportEntries;

    const allCandidates = getTournamentWithdrawalCandidates(candidates);
    const candidateByKey = new Map();
    allCandidates.forEach(candidate => {
        const key = getTournamentWithdrawalPlayerKey(candidate);
        candidateByKey.set(key, candidate);
        if (candidate.id) candidateByKey.set(candidate.id, candidate);
        if (candidate.name) candidateByKey.set(candidate.name, candidate);
    });
    const withdrawn = [];
    if (Array.isArray(tournament.playersChampionshipWithdrawals)) {
        withdrawn.push(...tournament.playersChampionshipWithdrawals
            .map(key => candidateByKey.get(key))
            .filter(Boolean));
    }
    if (Array.isArray(tournament.continentalQualification?.withdrawals)) {
        withdrawn.push(...tournament.continentalQualification.withdrawals.map(entry =>
            candidateByKey.get(entry?.withdrawnPlayerId)
            || allCandidates.find(candidate => candidate?.name === entry?.withdrawnPlayerName)
            || (entry?.withdrawnPlayerName ? {
                id: entry.withdrawnPlayerId,
                name: entry.withdrawnPlayerName,
                country: entry.withdrawnPlayerCountry,
                ovr: entry.withdrawnPlayerOverall,
                prizeMoney: entry.withdrawnPlayerPrizeMoney
            } : null)).filter(Boolean));
    }
    return createTournamentWithdrawalReportEntries(withdrawn, allCandidates);
}

function sendTournamentWithdrawalReport(tournament, candidates) {
    if (!tournament || typeof addEmail !== 'function') return false;
    const reportYear = Number(tournament.continentalQualification?.year)
        || (typeof currentDate !== 'undefined' && typeof currentDate?.getFullYear === 'function'
            ? currentDate.getFullYear()
            : 0);
    if (Number(tournament.withdrawalReportSentYear) === reportYear) return false;
    const entries = resolveTournamentWithdrawalReportEntries(tournament, candidates);
    if (!entries.length) return false;
    const displayName = typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(tournament)
        : String(tournament.name || '');
    const safe = typeof escapeHtml === 'function'
        ? escapeHtml
        : value => String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[character]));
    const rows = entries.map((entry, index) => {
        const country = typeof t === 'function' ? t(entry.country) : entry.country;
        const rank = Number(entry.oomRank) > 0 ? `#${entry.oomRank}` : '—';
        return `<strong>${index + 1}. ${safe(entry.name)}</strong><br>`
            + `${safe(trTournamentWithdrawalReport('nationality'))}: ${safe(country || '—')} · `
            + `OVR: ${Number(entry.overall) || 0} · ${safe(trTournamentWithdrawalReport('rank'))}: ${rank}`;
    }).join('<br><br>');
    addEmail(
        trTournamentWithdrawalReport('sender'),
        trTournamentWithdrawalReport('subject', { tournament: displayName }),
        `${safe(trTournamentWithdrawalReport('intro', { tournament: displayName }))}<br><br>${rows}`
    );
    tournament.withdrawalReportSentYear = reportYear;
    return true;
}

function comparePlayersChampionshipReserveOrder(first, second) {
    if (typeof compareChallengeTourOrderOfMerit === 'function') {
        return compareChallengeTourOrderOfMerit(first, second);
    }
    return (Number(second?.challengeTourPrizeMoney) || 0) - (Number(first?.challengeTourPrizeMoney) || 0)
        || (Number(second?.prizeMoney) || 0) - (Number(first?.prizeMoney) || 0)
        || String(first?.name || '').localeCompare(String(second?.name || ''), 'pl');
}

function isPlayersChampionshipFloorTournament(tournament) {
    if (!tournament) return false;
    const name = `${tournament.name || ''} ${tournament.sourceName || ''}`.toLocaleLowerCase('pl');
    return (name.includes('players championship') || name.includes('pro players cup'))
        && !name.includes('final');
}

function normalizePlayersChampionshipVenue(value) {
    return String(value || '').trim().toLocaleLowerCase('pl');
}

function findNextDayPlayersChampionship(tournament, calendar) {
    if (!isPlayersChampionshipFloorTournament(tournament)) return null;
    const tournaments = Array.isArray(calendar)
        ? calendar
        : (typeof tournamentDatabase !== 'undefined' && Array.isArray(tournamentDatabase)
            ? tournamentDatabase
            : []);
    const month = Number(tournament.month);
    const day = Number(tournament.day);
    if (!Number.isInteger(month) || !Number.isInteger(day)) return null;

    const year = typeof currentDate !== 'undefined' && typeof currentDate?.getFullYear === 'function'
        ? currentDate.getFullYear()
        : 2026;
    const nextDate = new Date(Date.UTC(year, month, day));
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const city = normalizePlayersChampionshipVenue(tournament.city);
    const country = normalizePlayersChampionshipVenue(tournament.country);
    if (!city) return null;

    return tournaments.find(candidate => candidate !== tournament
        && candidate?.completed !== true
        && isPlayersChampionshipFloorTournament(candidate)
        && Number(candidate.month) === nextDate.getUTCMonth()
        && Number(candidate.day) === nextDate.getUTCDate()
        && normalizePlayersChampionshipVenue(candidate.city) === city
        && (!country || !candidate.country
            || normalizePlayersChampionshipVenue(candidate.country) === country)) || null;
}

function propagatePlayersChampionshipWithdrawals(tournament, withdrawnPlayers, calendar) {
    const nextTournament = findNextDayPlayersChampionship(tournament, calendar);
    if (!nextTournament) return null;
    const inheritedKeys = (Array.isArray(withdrawnPlayers) ? withdrawnPlayers : [])
        .map(candidate => typeof candidate === 'string'
            ? candidate
            : getTournamentWithdrawalPlayerKey(candidate))
        .filter(Boolean);
    nextTournament.playersChampionshipPairedWithdrawalKeys = [
        ...new Set([
            ...(Array.isArray(nextTournament.playersChampionshipPairedWithdrawalKeys)
                ? nextTournament.playersChampionshipPairedWithdrawalKeys
                : []),
            ...inheritedKeys
        ])
    ];
    return nextTournament;
}

function buildPlayersChampionshipField(cardHolders, replacementPoolOrRandom = [], random = Math.random,
    forcedWithdrawalKeys = []) {
    const legacyCall = typeof replacementPoolOrRandom === 'function';
    const randomFn = legacyCall ? replacementPoolOrRandom : random;
    const rankedCardHolders = [...(Array.isArray(cardHolders) ? cardHolders : [])].sort((a, b) =>
        (Number(b?.prizeMoney) || 0) - (Number(a?.prizeMoney) || 0));
    const replacementPool = legacyCall
        ? rankedCardHolders.slice(PLAYERS_CHAMPIONSHIP_FIELD_SIZE)
        : [...(Array.isArray(replacementPoolOrRandom) ? replacementPoolOrRandom : [])]
            .filter(candidate => !rankedCardHolders.includes(candidate))
            .sort(comparePlayersChampionshipReserveOrder);
    const guaranteedCardField = rankedCardHolders.slice(0, PLAYERS_CHAMPIONSHIP_FIELD_SIZE);
    const vacantPlaceCount = Math.max(0, PLAYERS_CHAMPIONSHIP_FIELD_SIZE - guaranteedCardField.length);
    const vacancyReplacements = replacementPool.slice(0, vacantPlaceCount);
    const baseField = [...guaranteedCardField, ...vacancyReplacements];
    const remainingReplacementPool = replacementPool.slice(vacancyReplacements.length);
    const forcedKeys = new Set(Array.isArray(forcedWithdrawalKeys) ? forcedWithdrawalKeys : []);
    const isForcedWithdrawal = candidate => forcedKeys.has(getTournamentWithdrawalPlayerKey(candidate))
        || forcedKeys.has(candidate?.id)
        || forcedKeys.has(candidate?.name);
    const forcedWithdrawals = baseField.filter(candidate => candidate?.hasTourCard === true
        && !isCurrentPlayer(candidate) && isForcedWithdrawal(candidate));
    const forcedWithdrawalSet = new Set(forcedWithdrawals);
    const randomWithdrawals = baseField
        .slice(0, 20)
        .filter(candidate => candidate?.hasTourCard === true && !isCurrentPlayer(candidate)
            && !forcedWithdrawalSet.has(candidate)
            && randomFn() < PLAYERS_CHAMPIONSHIP_TOP_20_WITHDRAWAL_CHANCE);
    const requestedWithdrawals = [...forcedWithdrawals, ...randomWithdrawals];

    // Nie skracamy drabinki, gdy w bazie byłoby zbyt mało zastępców.
    const withdrawnPlayers = requestedWithdrawals.slice(0, remainingReplacementPool.length);
    const withdrawnSet = new Set(withdrawnPlayers);
    const replacements = remainingReplacementPool.slice(0, withdrawnPlayers.length);

    return {
        participants: [...baseField.filter(candidate => !withdrawnSet.has(candidate)), ...replacements],
        withdrawnPlayers,
        replacements: [...vacancyReplacements, ...replacements]
    };
}

function getTournamentSeedPlayerKey(candidate) {
    if (!candidate || candidate.isBye) return '';
    return candidate.id
        ? `id:${candidate.id}`
        : `name:${String(candidate.name || '').trim()}|${String(candidate.country || '').trim()}`;
}

function getUniqueTournamentSeedCandidates(candidates = []) {
    const unique = [];
    const keys = new Set();
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
        const key = getTournamentSeedPlayerKey(candidate);
        if (!key || keys.has(key)) return;
        keys.add(key);
        unique.push(candidate);
    });
    return unique;
}

function getDefaultTournamentSeedCandidates() {
    return getUniqueTournamentSeedCandidates([
        ...(typeof pdcPlayers !== 'undefined' && Array.isArray(pdcPlayers) ? pdcPlayers : []),
        ...(typeof player !== 'undefined' && player ? [player] : [])
    ]);
}

function tournamentHidesSeedNumbers(tournament) {
    if (!tournament) return true;
    const name = `${tournament.name || ''} ${tournament.sourceName || ''}`.toLocaleLowerCase('pl');
    const specialType = String(tournament.specialType || '').toLocaleLowerCase('pl');
    return name.includes('players championship') || name.includes('pro players cup') || name.includes('pro players finals')
        || name.includes('qualifier') || name.includes('kwalifikacj') || specialType.includes('qualifier')
        || specialType === 'pdcqschool' || specialType === 'challengetour' || specialType === 'developmenttour' || specialType.includes('worldcup')
        || name.includes('rising stars circuit') || name.includes('challenge tour')
        || name.includes('future champions circuit') || name.includes('development tour')
        || name.includes('uk open') || name.includes('british open')
        || name.includes('premier league') || name.includes('global darts league')
        || name.includes('world cup') || name.includes('puchar narodów');
}

function getTournamentSeedRanking(tournament, candidates = getDefaultTournamentSeedCandidates()) {
    const unique = getUniqueTournamentSeedCandidates(candidates);
    if (tournamentHidesSeedNumbers(tournament)) return [];
    const name = `${tournament?.name || ''} ${tournament?.sourceName || ''}`.toLocaleLowerCase('pl');
    const specialType = String(tournament?.specialType || '').toLocaleLowerCase('pl');
    if (specialType === 'classicmasters' && Array.isArray(tournament?.crownMastersQualification?.automaticPlayerIds)) {
        const byKey = new Map(unique.map(candidate => [
            typeof getCrownMastersPlayerKey === 'function'
                ? getCrownMastersPlayerKey(candidate)
                : getTournamentSeedPlayerKey(candidate),
            candidate
        ]));
        return tournament.crownMastersQualification.automaticPlayerIds
            .map(key => byKey.get(key)).filter(Boolean).slice(0, 16);
    }
    if (specialType === 'worldmasters') {
        return typeof getWorldMastersEventSeedPlayers === 'function'
            ? getWorldMastersEventSeedPlayers(tournament)
            : [];
    }
    const isContinentalMain = (typeof isContinentalTourTournament === 'function'
        && isContinentalTourTournament(tournament))
        || /(?:european|continental) tour/.test(name);

    if (isContinentalMain) {
        const seedIds = tournament?.continentalQualification?.oomPlayerIds;
        if (Array.isArray(seedIds)) {
            const byQualificationKey = new Map(unique.map(candidate => [
                typeof getContinentalQualificationPlayerKey === 'function'
                    ? getContinentalQualificationPlayerKey(candidate)
                    : (candidate.id || `${candidate.name || ''}|${candidate.country || ''}`),
                candidate
            ]));
            return seedIds.map(key => byQualificationKey.get(key)).filter(Boolean).slice(0, 16);
        }
        return unique.filter(candidate => candidate.hasTourCard === true)
            .sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0))
            .slice(0, 16);
    }

    const isEuropeanChampionship = (typeof isEuropeanChampionshipTournament === 'function'
        && isEuropeanChampionshipTournament(tournament))
        || name.includes('european championship') || name.includes('continental championship');
    if (isEuropeanChampionship) {
        return typeof getEuropeanTourOrderOfMerit === 'function'
            ? getEuropeanTourOrderOfMerit(unique).slice(0, 16)
            : unique.sort((first, second) => (Number(second.europeanTourPrizeMoney) || 0)
                - (Number(first.europeanTourPrizeMoney) || 0)).slice(0, 16);
    }

    const isWorldMastersFinals = specialType === 'worldmastersfinals'
        || (name.includes('masters finals') && !name.includes('qualifier'));
    if (isWorldMastersFinals && typeof getWorldMastersFinalsField === 'function'
        && typeof resolveWorldMastersPlayers === 'function') {
        const finals = getWorldMastersFinalsField();
        return resolveWorldMastersPlayers((finals?.worldSeriesKeys || []).slice(0, 8));
    }

    return unique.sort((first, second) => (Number(second.prizeMoney) || 0) - (Number(first.prizeMoney) || 0));
}

function setTournamentSeedPlayerKeys(tournament, keys) {
    Object.defineProperty(tournament, 'bracketSeedPlayerKeys', {
        value: Array.isArray(keys) ? keys : [],
        configurable: true,
        enumerable: false,
        writable: true
    });
    return tournament.bracketSeedPlayerKeys;
}

function prepareTournamentSeedNumbers(tournament, candidates, participants) {
    if (!tournament) return [];
    if (tournamentHidesSeedNumbers(tournament)) {
        delete tournament.bracketSeedPlayerKeys;
        return [];
    }
    const participantKeys = new Set((Array.isArray(participants) ? participants : [])
        .map(getTournamentSeedPlayerKey).filter(Boolean));
    const seedPlayerKeys = getTournamentSeedRanking(tournament, candidates)
        .slice(0, 16)
        .map(candidate => {
            const key = getTournamentSeedPlayerKey(candidate);
            return participantKeys.has(key) ? key : '';
        });
    return setTournamentSeedPlayerKeys(tournament, seedPlayerKeys);
}

function getTournamentSeedNumber(candidate, tournament = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    if (!candidate || candidate.isBye || tournamentHidesSeedNumbers(tournament)) return null;
    if (!Array.isArray(tournament.bracketSeedPlayerKeys)) {
        const bracket = typeof tournamentBracket !== 'undefined' && Array.isArray(tournamentBracket)
            ? tournamentBracket
            : [];
        prepareTournamentSeedNumbers(tournament, getDefaultTournamentSeedCandidates(), bracket);
    }
    const candidateKey = getTournamentSeedPlayerKey(candidate);
    if (!candidateKey) return null;
    const index = tournament.bracketSeedPlayerKeys.indexOf(candidateKey);
    return index >= 0 && index < 16 ? index + 1 : null;
}

function getTournamentSeedBadgeHtml(candidate, tournament = (typeof activeTournament !== 'undefined' ? activeTournament : null)) {
    const seedNumber = getTournamentSeedNumber(candidate, tournament);
    if (!seedNumber) return '';
    const label = typeof t === 'function' ? `${t('t-seed')} ${seedNumber}` : `Seed ${seedNumber}`;
    const safeLabel = typeof escapeHtml === 'function'
        ? escapeHtml(label)
        : String(label).replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[character]));
    return `<span class="bracket-seed" title="${safeLabel}" aria-label="${safeLabel}">${seedNumber}</span> `;
}

function getNonPrizeQualifierEliminationMessage(tournament = activeTournament, candidate = player) {
    if (!tournament) return '';
    if (typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(tournament)) {
        return typeof getContinentalQualifierOutcomeMessage === 'function'
            ? getContinentalQualifierOutcomeMessage(false)
            : '';
    }
    if (typeof isPdcTourCardQualifierTournament === 'function' && isPdcTourCardQualifierTournament(tournament)) {
        return typeof getPdcTourCardQualifierOutcomeMessage === 'function'
            ? getPdcTourCardQualifierOutcomeMessage(tournament, candidate)
            : '';
    }
    if (typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(tournament)) {
        return typeof getPdcTourCardOutcomeMessage === 'function'
            ? getPdcTourCardOutcomeMessage(candidate)
            : '';
    }
    if (typeof isWorldMastersFinalsQualifierTournament === 'function'
        && isWorldMastersFinalsQualifierTournament(tournament)) {
        return typeof trWorldMasters === 'function' ? trWorldMasters('finalsRoleOut') : '';
    }
    return '';
}

function skipActiveTournament() {
            if (!activeTournament || (typeof currentMatch !== 'undefined' && currentMatch)
                || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) return false;
            if (!confirm(t('t-confirm-skip'))) return;
            isSkippingTournament = true;
            return startTournament();
        }

        function startTournament() {
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
            if (!activeTournament) return;
            const injuredCareerPlayer = typeof isPlayerInjured === 'function' && isPlayerInjured(player);
            if (injuredCareerPlayer) {
                if (typeof shouldAutoSimulateUnwatchedTournament !== 'function') isSkippingTournament = true;
                if (currentMatch?.isTournament) currentMatch = null;
            }
            if (currentMatch && currentMatch.isTournament && currentMatch.p1Score !== undefined) {
                if (typeof chargeTournamentParticipationStamina === 'function') {
                    chargeTournamentParticipationStamina(activeTournament);
                }
                showScreen('screen-match'); return;
            }
            if (typeof isWorldCupTournament === 'function' && isWorldCupTournament(activeTournament)) {
                return startWorldCupTournament();
            }
            if (typeof isWorldCupQualifierTournament === 'function' && isWorldCupQualifierTournament(activeTournament)) {
                return startWorldCupQualifiers();
            }
            if (!isSkippingTournament && typeof isGrandSlamGroupStageActive === 'function' && isGrandSlamGroupStageActive(activeTournament)) {
                if (typeof shouldAutoSimulateUnwatchedTournament === 'function'
                    && shouldAutoSimulateUnwatchedTournament(activeTournament, grandSlamState.groups.some(group => group.members.some(isCurrentPlayer)))) {
                    isSkippingTournament = true;
                } else {
                    showGrandSlamGroups();
                    return;
                }
            }
            // Zapis sprzed wprowadzenia prawdziwej fazy grupowej zawierał już
            // sztuczną drabinkę Last 32. Możemy ją bezpiecznie zastąpić tylko
            // przed rozegraniem pierwszej rundy.
            if (typeof shouldRefreshGrandSlamOpeningDraw === 'function' && shouldRefreshGrandSlamOpeningDraw(activeTournament)) {
                tournamentBracket = [];
                if (activeTournament) activeTournament.simulationForm = null;
            }
            // Kariera prawdziwym zawodnikiem nie może pozostawić jego dawnego
            // wpisu AI w obsadzie. Naprawiamy też drabinki zapisane przed tą zmianą.
            if (typeof removeCareerPlayerFromAiPool === 'function') removeCareerPlayerFromAiPool();
            if (tournamentBracket && tournamentBracket.length > 1 && typeof repairCareerTournamentBracket === 'function') {
                tournamentBracket = repairCareerTournamentBracket(tournamentBracket);
            }
            if (tournamentBracket && tournamentBracket.length > 1 && typeof repairRetiredTournamentBracket === 'function') {
                tournamentBracket = repairRetiredTournamentBracket(tournamentBracket, activeTournament);
            }
            if (tournamentBracket?.length > 1 && typeof repairInjuredTournamentBracket === 'function') {
                tournamentBracket = repairInjuredTournamentBracket(tournamentBracket);
            }
            // --- ZABEZPIECZENIE: Jeśli turniej już trwa (drabinka jest wygenerowana), to tylko ją pokazujemy i kontynuujemy grę! ---
            if (tournamentBracket && tournamentBracket.length > 1) {
                const hasRecordedTournamentHistory = typeof hasTournamentMatchHistory === 'function'
                    ? hasTournamentMatchHistory(tournamentMatchHistory)
                    : Boolean(Array.isArray(tournamentMatchHistory) && tournamentMatchHistory.length > 0);
                const isWorldMastersActiveTournament = typeof isWorldMastersTournament === 'function' && (
                    isWorldMastersTournament(activeTournament) ||
                    isWorldMastersFinalsTournament(activeTournament) ||
                    isWorldMastersFinalsQualifierTournament(activeTournament)
                );
                const expectedOpeningRound = isWorldMastersActiveTournament && typeof getWorldMastersTournamentRound === 'function'
                    ? getWorldMastersTournamentRound(activeTournament)
                    : null;
                const isWorldMastersFinalsQualifierDraw = typeof isWorldMastersFinalsQualifierTournament === 'function'
                    && isWorldMastersFinalsQualifierTournament(activeTournament);
                const isWorldMastersFinalsDraw = typeof isWorldMastersFinalsTournament === 'function'
                    && isWorldMastersFinalsTournament(activeTournament);
                const staleWorldMastersOpeningDraw = typeof shouldRefreshWorldMastersEventField === 'function'
                    && shouldRefreshWorldMastersEventField(activeTournament);
                const malformedOpeningWorldMastersDraw = expectedOpeningRound === tournamentRound && (
                    tournamentBracket.length !== expectedOpeningRound
                    || tournamentBracket.some(candidate => !candidate || (
                        candidate.isBye
                            ? !isWorldMastersFinalsQualifierDraw
                            : isWorldMastersFinalsQualifierDraw && candidate.hasTourCard !== true
                    ))
                    || (isWorldMastersFinalsDraw && activeTournament.worldMastersFinalsDrawVersion !== (
                        typeof WORLD_MASTERS_FINALS_DRAW_VERSION === 'number' ? WORLD_MASTERS_FINALS_DRAW_VERSION : 2
                    ))
                    || staleWorldMastersOpeningDraw
                );
                const staleWorldMastersFinalsQualifierDraw = isWorldMastersFinalsQualifierDraw && (
                    tournamentBracket.some(candidate => candidate && !candidate.isBye && candidate.hasTourCard !== true)
                    || (!hasRecordedTournamentHistory
                        && (tournamentRound !== expectedOpeningRound || tournamentBracket.length !== expectedOpeningRound))
                );
                const staleEuropeanChampionshipOpeningDraw = typeof isEuropeanChampionshipTournament === 'function'
                    && isEuropeanChampionshipTournament(activeTournament)
                    && tournamentRound === 32
                    && tournamentBracket.length === 32
                    && !hasRecordedTournamentHistory
                    && activeTournament.europeanChampionshipDrawVersion !== EUROPEAN_CHAMPIONSHIP_DRAW_VERSION;
                const activeTournamentName = String(activeTournament?.name || '').toLowerCase();
                const staleWorldChampionshipOpeningDraw = (
                    activeTournamentName.includes('world darts championship')
                    || activeTournamentName.includes('global darts championship')
                ) && tournamentRound === 128
                    && !hasRecordedTournamentHistory
                    && (
                        tournamentBracket.some(candidate => candidate?.isBye)
                        || activeTournament.worldChampionshipQualification?.version !== (
                            typeof WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION === 'number'
                                ? WORLD_CHAMPIONSHIP_QUALIFICATION_VERSION
                                : 1
                        )
                    );
                const staleContinentalQualificationDraw = activeTournament?.specialType === 'continentalQualifier'
                    && ((!hasRecordedTournamentHistory && activeTournament.continentalQualificationVersion !== 2)
                        || (typeof shouldRefreshEmptyContinentalQualifierDraw === 'function'
                            && shouldRefreshEmptyContinentalQualifierDraw(activeTournament, tournamentBracket)));
                const staleContinentalTourOpeningDraw = typeof isContinentalTourTournament === 'function'
                    && isContinentalTourTournament(activeTournament)
                    && tournamentRound === 64
                    && tournamentBracket.length === 64
                    && !hasRecordedTournamentHistory
                    && activeTournament.continentalTourDrawVersion !== (
                        typeof CONTINENTAL_TOUR_DRAW_VERSION === 'number' ? CONTINENTAL_TOUR_DRAW_VERSION : 1
                    );
                const staleQSchoolOpeningDraw = activeTournament?.specialType === 'pdcQSchool'
                    && !hasRecordedTournamentHistory
                    && activeTournament.qSchoolDrawVersion !== (
                        typeof PDC_QSCHOOL_DRAW_VERSION === 'number' ? PDC_QSCHOOL_DRAW_VERSION : 2
                    );
                const isUKOpenActiveTournament = typeof isUKOpenTournament === 'function'
                    && isUKOpenTournament(activeTournament);
                const staleUKOpenOpeningDraw = isUKOpenActiveTournament
                    && !hasRecordedTournamentHistory
                    && tournamentRound === 128
                    && activeTournament.ukOpenQualification?.version !== (
                        typeof UK_OPEN_QUALIFICATION_VERSION === 'number' ? UK_OPEN_QUALIFICATION_VERSION : 1
                    );

                // Starsze zapisy mogły zachować niepełną drabinkę po emeryturze
                // lokalnego uczestnika albo nierozpoczętą obsadę sprzed zmiany
                // zasad zaproszeń. Nie wznawiamy takiej drabinki — tworzymy ją
                // ponownie z dostępnymi zastępcami i aktualną regułą OOM.
                if (!malformedOpeningWorldMastersDraw && !staleWorldMastersFinalsQualifierDraw && !staleEuropeanChampionshipOpeningDraw
                    && !staleWorldChampionshipOpeningDraw && !staleContinentalQualificationDraw && !staleQSchoolOpeningDraw
                    && !staleUKOpenOpeningDraw && !staleContinentalTourOpeningDraw) {
                    propagatePlayersChampionshipWithdrawals(
                        activeTournament,
                        activeTournament.playersChampionshipWithdrawals
                    );
                    sendTournamentWithdrawalReport(activeTournament);
                    if (isSkippingTournament && typeof simulateRemainingTournament === 'function') {
                        isSkippingTournament = false;
                        return simulateRemainingTournament({ withdrawCareerPlayer: true });
                    }
                    if (typeof shouldAutoSimulateUnwatchedTournament === 'function'
                        && shouldAutoSimulateUnwatchedTournament(activeTournament, isCareerPlayerInRemainingBracket()
                            || isCareerPlayerWaitingForTournamentEntry())
                        && typeof simulateRemainingTournament === 'function') return simulateRemainingTournament();
                    if (tournamentBracket.some(isCurrentPlayer) && typeof chargeTournamentParticipationStamina === 'function') {
                        chargeTournamentParticipationStamina(activeTournament);
                    }
                    showBracket();
                    return;
                }
                tournamentBracket = [];
                if (activeTournament) activeTournament.simulationForm = null;
            }

            let tName = activeTournament.name;
            let tNameLow = tName.toLowerCase();
            let tournamentDisplayName = typeof getTournamentDisplayName === 'function'
                ? getTournamentDisplayName(activeTournament)
                : tName;
            // Karta daje stały dostęp do Pro Touru. Gracz bez karty nadal pozostaje
            // w rankingach i może wywalczyć telewizyjny turniej albo wejść jako rezerwowy.
            let allPlayers = typeof getPdcTourCardPlayers === 'function'
                ? getPdcTourCardPlayers(true)
                : [...pdcPlayers, player].filter(candidate => candidate && candidate.hasTourCard !== false);
            let tourCardPlayers = allPlayers.filter(candidate => candidate.hasTourCard === true)
                .filter(candidate => typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate))
                .sort((a, b) => (Number(b.prizeMoney) || 0) - (Number(a.prizeMoney) || 0));
            let nonCardPlayers = allPlayers.filter(candidate => candidate.hasTourCard !== true)
                .filter(candidate => typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate))
                .sort((a, b) => (Number(b.prizeMoney) || 0) - (Number(a.prizeMoney) || 0));
            if (typeof refreshProTourOrderOfMerit === 'function') {
                refreshProTourOrderOfMerit(allPlayers, currentDate);
            }
            const availablePlayers = allPlayers.filter(candidate => typeof isPlayerAvailableForPlay !== 'function' || isPlayerAvailableForPlay(candidate));
            let oomRanked = [...availablePlayers].sort((a,b) => b.prizeMoney - a.prizeMoney);
            let ptRanked = [...availablePlayers].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
            let pcRanked = [...allPlayers].sort((a,b) => b.pcPrizeMoney - a.pcPrizeMoney);
            let etRanked = typeof getEuropeanTourOrderOfMerit === 'function'
                ? getEuropeanTourOrderOfMerit(allPlayers)
                : [...allPlayers].sort((a, b) => (b.europeanTourPrizeMoney || 0) - (a.europeanTourPrizeMoney || 0));
            const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(activeTournament);
            const isContinentalMainEvent = typeof isContinentalTourTournament === 'function' && isContinentalTourTournament(activeTournament);
            const isWorldMastersEvent = typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(activeTournament);
            const isWorldMastersFinals = typeof isWorldMastersFinalsTournament === 'function' && isWorldMastersFinalsTournament(activeTournament);
            const isWorldMastersFinalsQualifier = typeof isWorldMastersFinalsQualifierTournament === 'function' && isWorldMastersFinalsQualifierTournament(activeTournament);
            const isGrandSlamEvent = typeof isGrandSlamTournament === 'function' && isGrandSlamTournament(activeTournament);
            const isEuropeanChampionship = typeof isEuropeanChampionshipTournament === 'function'
                ? isEuropeanChampionshipTournament(activeTournament)
                : (tNameLow.includes('european championship') || tNameLow.includes('continental championship'));
            const isQSchoolEvent = typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(activeTournament);
            const isTourCardQualifierEvent = typeof isPdcTourCardQualifierTournament === 'function'
                && isPdcTourCardQualifierTournament(activeTournament);
            const isChallengeTourEvent = typeof isChallengeTourTournament === 'function'
                && isChallengeTourTournament(activeTournament);
            const isDevelopmentTourEvent = typeof isDevelopmentTourTournament === 'function'
                && isDevelopmentTourTournament(activeTournament);
            const isCrownMastersEvent = typeof isCrownMastersTournament === 'function'
                && isCrownMastersTournament(activeTournament);
            const isCrownMastersQualifier = typeof isCrownMastersQualifierTournament === 'function'
                && isCrownMastersQualifierTournament(activeTournament);
            const isUKOpenEvent = typeof isUKOpenTournament === 'function'
                && isUKOpenTournament(activeTournament);

            let participants = [];

            // --- 1. WYBÓR UCZESTNIKÓW I ROZMIAR DRABINKI ---
            
            // Finały Play-offs
            if (isCrownMastersQualifier) {
                participants = typeof getCrownMastersQualifierParticipants === 'function'
                    ? getCrownMastersQualifierParticipants(activeTournament, allPlayers)
                    : [];
                tournamentRound = typeof getCrownMastersQualifierOpeningRound === 'function'
                    ? getCrownMastersQualifierOpeningRound(participants.length)
                    : 128;

            } else if (isCrownMastersEvent) {
                participants = typeof getCrownMastersMainParticipants === 'function'
                    ? getCrownMastersMainParticipants(activeTournament, allPlayers)
                    : [];
                tournamentRound = 32;

            } else if (isDevelopmentTourEvent) {
                participants = typeof getDevelopmentTourEligiblePlayers === 'function'
                    ? getDevelopmentTourEligiblePlayers(allPlayers, currentDate)
                    : [];
                tournamentRound = typeof getPdcQSchoolOpeningRound === 'function'
                    ? getPdcQSchoolOpeningRound(participants.length)
                    : 16;

            } else if (isChallengeTourEvent) {
                participants = typeof getChallengeTourEligiblePlayers === 'function'
                    ? getChallengeTourEligiblePlayers(allPlayers)
                    : nonCardPlayers;
                tournamentRound = typeof getPdcQSchoolOpeningRound === 'function'
                    ? getPdcQSchoolOpeningRound(participants.length)
                    : 128;

            } else if (isTourCardQualifierEvent) {
                participants = typeof getPdcTourCardQualifierParticipants === 'function'
                    ? getPdcTourCardQualifierParticipants(activeTournament, allPlayers)
                    : tourCardPlayers;
                tournamentRound = typeof getPdcQSchoolOpeningRound === 'function'
                    ? getPdcQSchoolOpeningRound(participants.length)
                    : 128;

            } else if (isQSchoolEvent) {
                participants = typeof getPdcQSchoolParticipants === 'function'
                    ? getPdcQSchoolParticipants(allPlayers)
                    : nonCardPlayers;
                tournamentRound = typeof getPdcQSchoolOpeningRound === 'function'
                    ? getPdcQSchoolOpeningRound(participants.length)
                    : 128;

            } else if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && tNameLow.includes("play-off")) {
                if (!gdlTable || gdlTable.length === 0) {
                    oomRanked.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                }
                let sortedGDL = [...gdlTable].sort((a,b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost));
                participants = [sortedGDL[0].player, sortedGDL[3].player, sortedGDL[1].player, sortedGDL[2].player];
                tournamentRound = 4;

            // Zwykła noc ligowa (Night 1-16)
            } else if (tNameLow.includes("premier") || tNameLow.includes("global darts league")) {
                // Zabezpieczenie: jeśli tabela jest pusta, twórz stawkę natychmiast
                if (!gdlTable || gdlTable.length === 0) {
                    gdlTable = [];
                    oomRanked.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                    let candidates = shuffle(oomRanked.slice(4, 12));
                    candidates.slice(0, 4).forEach(p => gdlTable.push({ player: p, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 }));
                }
                participants = gdlTable.map(g => g.player);
                tournamentRound = 8;

            } else if ((tNameLow.includes("players championship") || tNameLow.includes("pro players cup")) && !tNameLow.includes("final")) {
                const playersChampionshipField = buildPlayersChampionshipField(
                    tourCardPlayers,
                    nonCardPlayers,
                    Math.random,
                    activeTournament.playersChampionshipPairedWithdrawalKeys
                );
                participants = playersChampionshipField.participants;
                activeTournament.playersChampionshipWithdrawals = playersChampionshipField.withdrawnPlayers
                    .map(candidate => candidate.id || candidate.name);
                activeTournament.playersChampionshipReplacements = playersChampionshipField.replacements
                    .map(candidate => candidate.id || candidate.name);
                propagatePlayersChampionshipWithdrawals(
                    activeTournament,
                    playersChampionshipField.withdrawnPlayers
                );
                tournamentRound = 128;
            } else if (isWorldMastersEvent || isWorldMastersFinals || isWorldMastersFinalsQualifier) {
                participants = typeof getWorldMastersTournamentParticipants === 'function'
                    ? getWorldMastersTournamentParticipants(activeTournament)
                    : [];
                tournamentRound = typeof getWorldMastersTournamentRound === 'function'
                    ? getWorldMastersTournamentRound(activeTournament)
                    : (isWorldMastersFinals ? 32 : 16);
            } else if (tNameLow.includes("players championship finals") || tNameLow.includes("pro players finals")) {
                participants = getRankingQualificationGroups(activeTournament, allPlayers).flatMap(group => group.players); tournamentRound = 64;
            } else if (tNameLow.includes("world darts championship") || tNameLow.includes("global darts championship")) {
                const worldChampionshipCandidates = [
                    ...(Array.isArray(pdcPlayers) ? pdcPlayers : []),
                    ...(player?.name ? [player] : [])
                ];
                participants = typeof getWorldChampionshipQualificationField === 'function'
                    ? getWorldChampionshipQualificationField(activeTournament, worldChampionshipCandidates, currentDate)
                    : oomRanked.slice(0, 128);
                tournamentRound = 128;
            } else if (isUKOpenEvent) {
                participants = typeof getUKOpenOpeningParticipants === 'function'
                    ? getUKOpenOpeningParticipants(activeTournament, allPlayers, currentDate)
                    : getRankingQualificationGroups(activeTournament, allPlayers).flatMap(group => group.players);
                tournamentRound = 160;
            } else if (isContinentalQualifier) {
                participants = getContinentalTourQualifierParticipants(activeTournament);
                tournamentRound = typeof getContinentalQualifierOpeningRound === 'function'
                    ? getContinentalQualifierOpeningRound(activeTournament, participants.length)
                    : participants.length;
                activeTournament.continentalQualificationVersion = typeof CONTINENTAL_QUALIFICATION_VERSION === 'number'
                    ? CONTINENTAL_QUALIFICATION_VERSION
                    : 2;
            } else if (isContinentalMainEvent) {
                const continentalField = prepareContinentalTourWithdrawals(activeTournament, { skipCareerPlayer: isSkippingTournament });
                participants = continentalField
                    ? [...continentalField.oomPlayers, ...continentalField.proTourPlayers, ...continentalField.qualifiedPlayers]
                    : [];
                tournamentRound = 64;
            } else if (tNameLow.includes("grand slam") || tNameLow.includes("champion's slam")) {
                const qualifiedField = typeof getPdcTourCardQualifiedMainField === 'function'
                    ? getPdcTourCardQualifiedMainField(activeTournament, availablePlayers)
                    : null;
                if (qualifiedField) participants = qualifiedField;
                else {
                    let qualified = new Set();
                    oomRanked.slice(0, 16).forEach(p => qualified.add(p));
                    let ptIndex = 0;
                    while(qualified.size < 48 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; }
                    participants = Array.from(qualified);
                }
                tournamentRound = 16; 
            } else if (tNameLow.includes("matchplay") || tNameLow.includes("grand prix")) {
                participants = getRankingQualificationGroups(activeTournament, allPlayers).flatMap(group => group.players);
                tournamentRound = 32;
            } else if (isEuropeanChampionship) {
                participants = getRankingQualificationGroups(activeTournament, allPlayers).flatMap(group => group.players);
                tournamentRound = 32;
            } else {
                let qualified = new Set();
                oomRanked.slice(0, 16).forEach(p => qualified.add(p)); 
                let ptIndex = 0;
                while(qualified.size < 32 && ptIndex < ptRanked.length) { qualified.add(ptRanked[ptIndex]); ptIndex++; } 
                participants = Array.from(qualified); tournamentRound = 32;
            }

            if (typeof repairInjuredTournamentBracket === 'function') participants = repairInjuredTournamentBracket(participants);
            // Fixed individual fields retain their size when the database has
            // too few healthy reserves. Missing places are genuine byes.
            if (!isGrandSlamEvent && typeof createPlayerEventBye === 'function') {
                while (participants.length < tournamentRound) participants.push(createPlayerEventBye());
            }
            let playerInTournament = !injuredCareerPlayer && (isUKOpenEvent && typeof getUKOpenFullField === 'function'
                ? getUKOpenFullField(activeTournament, allPlayers, currentDate, true).some(isCurrentPlayer)
                : participants.some(isCurrentPlayer));
            
            if (isSkippingTournament && playerInTournament) {
                if (isUKOpenEvent && typeof removeUKOpenParticipant === 'function') {
                    removeUKOpenParticipant(activeTournament, player, allPlayers);
                    participants = getUKOpenOpeningParticipants(activeTournament, allPlayers, currentDate);
                    playerInTournament = false;
                } else {
                    // Cykle poboczne obejmują już całą uprawnioną pulę.
                    // Po wycofaniu gracza domykamy drabinkę wolnymi losami,
                    // zamiast dopisywać nieuprawnionego zawodnika z ProTouru.
                    const replacementRanking = (isQSchoolEvent || isTourCardQualifierEvent || isContinentalQualifier
                        || isWorldMastersFinalsQualifier || isCrownMastersQualifier
                        || isChallengeTourEvent || isDevelopmentTourEvent)
                        ? []
                        : [...nonCardPlayers, ...(isEuropeanChampionship ? etRanked : ptRanked)];
                    const replacement = replacementRanking.find(p => !participants.includes(p) && !isCurrentPlayer(p));
                    participants = replacement
                        ? participants.map(p => isCurrentPlayer(p) ? replacement : p)
                        : participants.filter(p => !isCurrentPlayer(p));
                    playerInTournament = false;
                }
            }

            sendTournamentWithdrawalReport(activeTournament, allPlayers);

            let isHeadlessSim = false;

            if (isSkippingTournament) {
                // Jeśli gracz celowo nacisnął "Odpuść", symulujemy cały turniej w tle
                alert(t('t-alert-skip-tour').replace('{tour}', tournamentDisplayName));
                isHeadlessSim = true;
            } else if (typeof shouldAutoSimulateUnwatchedTournament === 'function') {
                isHeadlessSim = shouldAutoSimulateUnwatchedTournament(activeTournament, playerInTournament);
            } else if (isQSchoolEvent && !playerInTournament) {
                // Posiadacz karty nie musi brać udziału w Q-Schoolu. Wyniki walki
                // pozostałych zawodników rozstrzygamy automatycznie.
                isHeadlessSim = true;
            } else if (isTourCardQualifierEvent && !playerInTournament) {
                // Brak karty albo bezpośrednia kwalifikacja wyłącza gracza z tego
                // turnieju; wyniki pozostałych posiadaczy kart liczymy w tle.
                isHeadlessSim = true;
            } else if (isCrownMastersQualifier && !playerInTournament) {
                // Top 24 OOM oraz gracze spoza zaproszonej puli nie zatrzymują
                // jednodniowych kwalifikacji wyłaniających osiem miejsc.
                isHeadlessSim = true;
            } else if (isContinentalQualifier && !playerInTournament) {
                // Dotyczy zarówno kwalifikacji dla posiadaczy kart, jak i ścieżek
                // regionalnych. Pełna symulacja zachowuje wyniki i rezerwowych.
                isHeadlessSim = true;
            } else if ((isChallengeTourEvent || isDevelopmentTourEvent) && !playerInTournament) {
                // Gracz niespełniający zasad cyklu nie zatrzymuje kalendarza.
                // Całe wydarzenie uprawnionych zawodników rozgrywamy w tle.
                isHeadlessSim = true;
            } else if (!playerInTournament) {
                // Jeśli gracz się nie zakwalifikował, tylko o tym informujemy, 
                // ale NIE włączamy symulacji w tle, by pokazać mu drabinkę!
                alert(t('t-alert-no-qual').replace('{tour}', tournamentDisplayName));
            }

            isSkippingTournament = false;

            if (playerInTournament && typeof chargeTournamentParticipationStamina === 'function') {
                chargeTournamentParticipationStamina(activeTournament);
            }

            // Przy pomijaniu turnieju przygotowanie grup i drabinki odbywa się
            // już pod blokadą zapisu, z kopią stanu sprzed pierwszego meczu.
            function* prepareOpeningDraw() {
                lastTournamentResults = "";
                if (activeTournament) delete activeTournament.matchHistory;
                if (typeof resetTournamentMatchHistory === 'function') resetTournamentMatchHistory();
                else tournamentMatchHistory = [];
                preTournamentRanks = { main: getPlayerRank('main'), pt: getPlayerRank('protour'), pc: getPlayerRank('pc'), et: getPlayerRank('europeanTour') };
                prepareTournamentSimulationForm(isUKOpenEvent && typeof getUKOpenFullField === 'function'
                    ? getUKOpenFullField(activeTournament, allPlayers, currentDate, true)
                    : participants);
                prepareTournamentSeedNumbers(activeTournament, [...allPlayers, ...participants], participants);

                if (isGrandSlamEvent && typeof initializeGrandSlamTournament === 'function') {
                    const grandSlamStage = isHeadlessSim
                        ? yield* iterateGrandSlamInitialization(participants, true)
                        : initializeGrandSlamTournament(participants, false, !playerInTournament
                            && typeof isTournamentSelectedForWatching === 'function'
                            && isTournamentSelectedForWatching(activeTournament));
                    if (!grandSlamStage) return;
                    if (grandSlamStage.phase === 'groups') {
                        if (typeof saveGame === 'function') saveGame(true);
                        showGrandSlamGroups();
                        return;
                    }
                    participants = grandSlamStage.participants;
                    tournamentRound = 16;
                }

                // --- 2. LOSOWANIE / ROZSTAWIENIE ---
                if (isUKOpenEvent) {
                    participants = typeof buildUKOpenStageDraw === 'function'
                        ? buildUKOpenStageDraw(participants)
                        : shuffle(participants);
                    tournamentRound = 160;
                } else if (isCrownMastersQualifier) {
                    participants = typeof buildCrownMastersQualifierDraw === 'function'
                        ? buildCrownMastersQualifierDraw(participants)
                        : shuffle(participants);
                    tournamentRound = participants.length;
                } else if (isCrownMastersEvent) {
                    participants = typeof buildCrownMastersDraw === 'function'
                        ? buildCrownMastersDraw(participants, activeTournament)
                        : shuffle(participants);
                    tournamentRound = 32;
                } else if (isChallengeTourEvent || isDevelopmentTourEvent) {
                    // Oba cykle poboczne nie mają rozstawień. Wolne losy służą
                    // wyłącznie do domknięcia drabinki do potęgi dwójki.
                    participants = typeof buildPdcQSchoolDraw === 'function'
                        ? buildPdcQSchoolDraw(participants)
                        : shuffle(participants);
                    tournamentRound = participants.length;
                } else if (isTourCardQualifierEvent) {
                    participants = typeof buildPdcTourCardQualifierDraw === 'function'
                        ? buildPdcTourCardQualifierDraw(participants, Math.random, activeTournament.qualifyingPlaces)
                        : shuffle(participants);
                    tournamentRound = participants.length;
                } else if (isQSchoolEvent) {
                    participants = typeof buildPdcQSchoolDraw === 'function'
                        ? buildPdcQSchoolDraw(participants)
                        : shuffle(participants);
                    tournamentRound = participants.length;
                    activeTournament.qSchoolDrawVersion = typeof PDC_QSCHOOL_DRAW_VERSION === 'number'
                        ? PDC_QSCHOOL_DRAW_VERSION
                        : 2;
                } else if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && !tNameLow.includes("play-off")) {
                    participants = shuffle(participants);
                } else if ((tNameLow.includes("premier") || tNameLow.includes("global darts league")) && tNameLow.includes("play-off")) {
                    // Drabinka play-off już ustalona (1 vs 4, 2 vs 3)
                } else if (tNameLow.includes("uk open") || tNameLow.includes("british open")) {
                    participants = shuffle(participants);
                } else if ((tNameLow.includes("players championship") || tNameLow.includes("pro players cup")) && !tNameLow.includes("final")) {
                    let sortedByPT = [...participants].sort((a,b) => b.proTourPrizeMoney - a.proTourPrizeMoney);
                    let seeds = sortedByPT.slice(0, 32);
                    let unseeded = shuffle(sortedByPT.slice(32));
                    let draw = new Array(128);
                    const seedOrder = [1, 32, 16, 17, 8, 25, 9, 24, 4, 29, 13, 20, 5, 28, 12, 21, 2, 31, 15, 18, 7, 26, 10, 23, 3, 30, 14, 19, 6, 27, 11, 22];

                    let unIndex = 0;
                    for (let i = 0; i < 32; i++) {
                        let boardStart = i * 4;
                        draw[boardStart] = seeds[seedOrder[i] - 1];
                        draw[boardStart + 1] = unseeded[unIndex++];
                        draw[boardStart + 2] = unseeded[unIndex++];
                        draw[boardStart + 3] = unseeded[unIndex++];
                    }
                    participants = draw;

                } else if (tNameLow.includes("players championship finals") || tNameLow.includes("pro players finals")) {
                    let seeds = [...participants].sort((a,b) => b.pcPrizeMoney - a.pcPrizeMoney);
                    let draw = new Array(64);
                    const pcfSeedOrder = [
                        1, 64, 32, 33, 16, 49, 17, 48, 8, 57, 25, 40, 9, 56, 24, 41,
                        4, 61, 29, 36, 13, 52, 20, 45, 5, 60, 28, 37, 12, 53, 21, 44,
                        2, 63, 31, 34, 15, 50, 18, 47, 7, 58, 26, 39, 10, 55, 23, 42,
                        3, 62, 30, 35, 14, 51, 19, 46, 6, 59, 27, 38, 11, 54, 22, 43
                    ];
                    for (let i = 0; i < 64; i++) { draw[i] = seeds[pcfSeedOrder[i] - 1]; }
                    participants = draw;

                } else if (isContinentalQualifier) {
                    participants = typeof buildContinentalQualifierDraw === 'function'
                        ? buildContinentalQualifierDraw(activeTournament, participants)
                        : shuffle(participants);
                    tournamentRound = participants.length;

                } else if (isContinentalMainEvent) {
                    const continentalField = typeof getContinentalTourMainField === 'function'
                        ? getContinentalTourMainField(activeTournament)
                        : null;
                    if (continentalField && typeof buildContinentalTourMainDraw === 'function') {
                        participants = buildContinentalTourMainDraw(activeTournament, continentalField);
                    } else {
                        let seeds = participants.slice(0, 16);
                        let unseeded = shuffle(participants.slice(16));
                        let draw = new Array(64);
                        const etSeedOrder = [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11];
                        let unIndex = 0;
                        for (let i = 0; i < 16; i++) {
                            let s = seeds[etSeedOrder[i] - 1];
                            let boardStart = i * 4;
                            draw[boardStart] = s;
                            draw[boardStart + 1] = { name: "(BYE)", isBye: true, country: "Brak", ovr: 0, overall: 0 };
                            draw[boardStart + 2] = unseeded[unIndex++];
                            draw[boardStart + 3] = unseeded[unIndex++];
                        }
                        participants = draw;
                    }

                } else if (isWorldMastersEvent || isWorldMastersFinals || isWorldMastersFinalsQualifier) {
                    participants = typeof buildWorldMastersTournamentDraw === 'function'
                        ? buildWorldMastersTournamentDraw(activeTournament, participants)
                        : shuffle(participants);

                } else if (tNameLow.includes("world darts championship") || tNameLow.includes("global darts championship")) {
                    participants = typeof buildWorldChampionshipDraw === 'function'
                        ? buildWorldChampionshipDraw(participants)
                        : shuffle(participants);

                } else if (isGrandSlamEvent) {
                    // Zwycięzcy 16 rzeczywistych grup są już rozstawieni przez
                    // initializeGrandSlamTournament() w drabince Last 16.
                    participants = tournamentBracket;

                } else if (tNameLow.includes("matchplay") || tNameLow.includes("grand prix")) {
                    let seeds = participants.slice(0, 16);
                    let unseeded = shuffle(participants.slice(16));
                    let draw = new Array(32);
                    const wmSeedOrder = [1, 16, 8, 9, 4, 13, 5, 12, 2, 15, 7, 10, 3, 14, 6, 11];
                    for (let i = 0; i < 16; i++) {
                        let s = seeds[wmSeedOrder[i] - 1];
                        let matchStart = i * 2;
                        draw[matchStart] = s;
                        draw[matchStart + 1] = unseeded[i];
                    }
                    participants = draw;

                } else if (isEuropeanChampionship) {
                    participants = typeof buildEuropeanChampionshipDraw === 'function'
                        ? buildEuropeanChampionshipDraw(participants)
                        : participants;
                    activeTournament.europeanChampionshipDrawVersion = typeof EUROPEAN_CHAMPIONSHIP_DRAW_VERSION === 'number'
                        ? EUROPEAN_CHAMPIONSHIP_DRAW_VERSION
                        : 1;

                } else {
                    let unseeded = shuffle(participants.slice(participants.length / 2));
                    let draw = new Array(participants.length);
                    let head = 0; let tail = participants.length - 2;
                    for(let i = 0; i < participants.length / 2; i++) {
                        let seed = participants[i]; let randomUnseeded = unseeded[i];
                        if (i % 2 === 0) { draw[head] = seed; draw[head+1] = randomUnseeded; head += 2; }
                        else { draw[tail] = seed; draw[tail+1] = randomUnseeded; tail -= 2; }
                    }
                    participants = draw;
                }

                tournamentBracket = typeof repairInjuredTournamentBracket === 'function'
                    ? repairInjuredTournamentBracket(participants) : participants;

                return true;
            }

            const openingDraw = prepareOpeningDraw();
            if (isHeadlessSim) return simulateHeadlessTournament(openingDraw, isGrandSlamEvent);
            let step = openingDraw.next();
            while (!step.done) step = openingDraw.next();
            if (step.value) showBracket();
        }


        function concludeContinentalTourQualifierEvent(showOutcome = true) {
            if (typeof isContinentalQualifierTournament !== 'function' || !isContinentalQualifierTournament(activeTournament)) return null;

            const qualifierTournament = activeTournament;
            const mainTournament = typeof getLinkedContinentalTour === 'function'
                ? getLinkedContinentalTour(qualifierTournament)
                : null;
            const qualificationState = mainTournament?.continentalQualification;
            const playerKey = typeof getContinentalQualificationPlayerKey === 'function'
                ? getContinentalQualificationPlayerKey(player)
                : '';
            const playerQualified = Boolean(qualificationState?.qualifiedPlayerIds?.includes(playerKey));
            const outcomeMessage = showOutcome && typeof getContinentalQualifierOutcomeMessage === 'function'
                ? getContinentalQualifierOutcomeMessage(playerQualified)
                : '';

            qualifierTournament.completed = true;
            if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(qualifierTournament);
            else qualifierTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            document.getElementById('tile-tournament').style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);

            if (outcomeMessage) alert(outcomeMessage);
            return { playerQualified, mainTournament };
        }

        function concludePdcQSchoolEvent(showOutcome = true) {
            if (typeof isPdcQSchoolTournament !== 'function' || !isPdcQSchoolTournament(activeTournament)) return null;
            const qSchoolTournament = activeTournament;
            const playerQualified = player?.hasTourCard === true && player.tourCardSource === 'qschool';
            qSchoolTournament.completed = true;
            if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(qSchoolTournament);
            else qSchoolTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            const tile = document.getElementById('tile-tournament');
            if (tile) tile.style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);
            if (showOutcome && typeof getPdcTourCardOutcomeMessage === 'function') {
                alert(getPdcTourCardOutcomeMessage(player));
            }
            return { playerQualified, tournament: qSchoolTournament };
        }

        function concludePdcTourCardQualifierEvent(showOutcome = true) {
            if (typeof isPdcTourCardQualifierTournament !== 'function'
                || !isPdcTourCardQualifierTournament(activeTournament)) return null;
            const qualifierTournament = activeTournament;
            const message = showOutcome && typeof getPdcTourCardQualifierOutcomeMessage === 'function'
                ? getPdcTourCardQualifierOutcomeMessage(qualifierTournament, player)
                : '';
            qualifierTournament.completed = true;
            if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(qualifierTournament);
            else qualifierTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            const tile = document.getElementById('tile-tournament');
            if (tile) tile.style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);
            if (message) alert(message);
            return { tournament: qualifierTournament };
        }

        function concludeCrownMastersQualifierEvent(showOutcome = true) {
            if (typeof isCrownMastersQualifierTournament !== 'function'
                || !isCrownMastersQualifierTournament(activeTournament)) return null;
            const qualifierTournament = activeTournament;
            const message = showOutcome && typeof getCrownMastersQualifierOutcomeMessage === 'function'
                ? getCrownMastersQualifierOutcomeMessage(qualifierTournament, player)
                : '';
            qualifierTournament.completed = true;
            if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(qualifierTournament);
            else qualifierTournament.historyLogs = lastTournamentResults;
            activeTournament = null;
            tournamentBracket = [];
            const tile = document.getElementById('tile-tournament');
            if (tile) tile.style.display = 'none';
            if (typeof updateHub === 'function') updateHub();
            if (typeof saveGame === 'function') saveGame(true);
            if (message) alert(message);
            return { tournament: qualifierTournament };
        }
        

       function showBracket() {
            document.getElementById('t-btn-play-match').onclick = closeBracketAndPlay;
            document.getElementById('t-btn-sim-round').onclick = simulateNextRound;
            const simulateTournamentButton = document.getElementById('t-btn-sim-tournament');
            if (simulateTournamentButton) simulateTournamentButton.onclick = simulateRemainingTournament;
            document.getElementById('t-btn-play-match').innerText = t('t-btn-play-match');
            document.getElementById('t-btn-sim-round').innerText = t('t-btn-sim-round');
            if (simulateTournamentButton) simulateTournamentButton.innerText = t('t-btn-sim-tournament');
            if (typeof updateTournamentEntrySimulationButton === 'function') {
                updateTournamentEntrySimulationButton('t-btn-sim-to-match');
            }
            document.getElementById('bracket-title').innerText = `🏆 ${t('t-bracket')}: ${getRoundName(tournamentRound)}`;
            const list = document.getElementById('bracket-list'); list.innerHTML = "";
            
            let isPlayerInRound = false;

            for(let i = 0; i < tournamentBracket.length; i += 2) {
                let p1 = tournamentBracket[i]; let p2 = tournamentBracket[i+1];
                let isPlayerMatch = isCurrentPlayer(p1) || isCurrentPlayer(p2);
                const watchedResult = typeof getSpectatedTournamentMatchResult === 'function'
                    ? getSpectatedTournamentMatchResult(p1, p2, tournamentRound, false)
                    : null;
                const canWatchMatch = !isPlayerMatch && !p1?.isBye && !p2?.isBye;
                const watchControl = watchedResult
                    ? `<div style="display:flex; flex-direction:column; align-items:center; min-width:155px; gap:3px;">
                        <button class="btn-sign" disabled style="background:#34495e; margin:0;">✓ ${watchedResult.p1Score}:${watchedResult.p2Score}</button>
                        <small style="color:#bdc3c7;">${t('t-avg-short')} ${watchedResult.p1Avg} – ${watchedResult.p2Avg}</small>
                    </div>`
                    : (canWatchMatch
                        ? `<button class="btn-sign" onclick="startSpectatingTournamentMatch(${i})" style="background:#8e44ad; margin:0; min-width:155px;">👁 ${t('t-btn-watch-match')}</button>`
                        : '');
                
                if (isPlayerMatch) isPlayerInRound = true;

                list.innerHTML += `<div class="bracket-match ${isPlayerMatch ? 'player-match' : ''}">
                    <div style="flex: 1; text-align: left;">${isCurrentPlayer(p1) ? getFlagImg(player.country) : getFlagImg(p1.country)} ${getTournamentSeedBadgeHtml(p1)}${escapeHtml(p1.name)} <span style="color:#bdc3c7; font-size:12px;">(OVR ${getDisplayedOvr(p1)})</span></div>
                    <div class="bracket-vs" style="flex: 0 0 40px; text-align: center;">VS</div>
                    <div style="flex: 1; text-align: right;">${isCurrentPlayer(p2) ? getFlagImg(player.country) : getFlagImg(p2.country)} ${getTournamentSeedBadgeHtml(p2)}${escapeHtml(p2.name)} <span style="color:#bdc3c7; font-size:12px;">(OVR ${getDisplayedOvr(p2)})</span></div>
                    ${watchControl}
                </div>`;
            }

            // Zarządzanie przyciskami w zależności od tego, czy gracz nadal jest w turnieju
            if (isPlayerInRound) {
                document.getElementById('t-btn-play-match').style.display = 'block';
                document.getElementById('t-btn-sim-round').style.display = 'none';
                if (simulateTournamentButton) simulateTournamentButton.style.display = 'none';
            } else {
                document.getElementById('t-btn-play-match').style.display = 'none';
                document.getElementById('t-btn-sim-round').style.display = 'block';
                if (simulateTournamentButton) simulateTournamentButton.style.display = typeof isCareerPlayerWaitingForTournamentEntry === 'function'
                    && isCareerPlayerWaitingForTournamentEntry() ? 'none' : 'block';
            }

            document.getElementById('bracket-modal').style.display = "flex";
        }

        function simulateNextRound() {
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
            const specialTournamentOutcome = advanceTournament(false);

            if (specialTournamentOutcome === true) {
                document.getElementById('bracket-modal').style.display = 'none';
                concludeContinentalTourQualifierEvent(true);
                showTournamentEnd();
                return;
            }
            if (specialTournamentOutcome === 'worldMastersFinalsQualifier') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludeWorldMastersFinalsQualifierEvent(true);
                showTournamentEnd();
                return;
            }
            if (specialTournamentOutcome === 'pdcQSchool') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludePdcQSchoolEvent(true);
                showTournamentEnd();
                return;
            }
            if (specialTournamentOutcome === 'pdcTourCardQualifier') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludePdcTourCardQualifierEvent(true);
                showTournamentEnd();
                return;
            }
            if (specialTournamentOutcome === 'crownMastersQualifier') {
                document.getElementById('bracket-modal').style.display = 'none';
                concludeCrownMastersQualifierEvent(true);
                showTournamentEnd();
                return;
            }

            if (tournamentBracket.length === 1) {
                activeTournament.completed = true;
                if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(activeTournament);
                else activeTournament.historyLogs = lastTournamentResults;
                
                let winner = tournamentBracket[0];
                let winPrize = getPrizeMoney(activeTournament.name, 2, true);
                awardPrizeMoney(winner, winPrize, activeTournament.name);
                if (typeof completeWorldMastersTournament === 'function') completeWorldMastersTournament(activeTournament, winner);
                recordSeasonTournamentResult(winner, activeTournament, { round: 2, prizeMoney: winPrize, won: true });

                // Wypłaty za miejsca 5-8 po finałach Play-offs!
                if (activeTournament.name.includes("Play-offs")) {
                    let sortedGDL = [...gdlTable].sort((a,b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost));
                    Object.entries(GLOBAL_LEAGUE_PLACEMENT_PRIZES).forEach(([position, amount]) => {
                        const row = sortedGDL[Number(position) - 1];
                        if (row) awardPrizeMoney(row.player, amount, activeTournament.name);
                    });
                }

                alert(t('t-alert-tour-sim-end').replace('{tour}', activeTournament.name).replace('{winner}', winner.name));
                
                document.getElementById('bracket-modal').style.display = 'none';
                
                showTournamentEnd(); 

                activeTournament = null;
                tournamentBracket = []; // <--- CZYŚCI DRABINKĘ PO MECZACH AI
                document.getElementById('tile-tournament').style.display = 'none';
                updateHub();
                saveGame(true);
            } else {
                document.getElementById('bracket-modal').style.display = 'none'; // <--- TA LINIJKA NAPRAWIA BŁĄD
                showRoundResults(); 
            }
        }

        function closeBracketAndPlay() { 
            let opponent = null;
            for(let i = 0; i < tournamentBracket.length; i += 2) {
                if(isCurrentPlayer(tournamentBracket[i])) opponent = tournamentBracket[i+1];
                else if(isCurrentPlayer(tournamentBracket[i+1])) opponent = tournamentBracket[i];
            }
            
            if (opponent && opponent.isBye) {
                alert("Otrzymujesz wolny los (BYE) jako zawodnik rozstawiony! Awansujesz do kolejnej fazy bez gry.");
                advanceTournament(true);
                showRoundResults(); // Pokaże symulację rywali
                return;
            }
            
            document.getElementById('bracket-modal').style.display = "none"; 
            startTournamentMatch(); 
        }

        function simulateAImatch(p1, p2, matchFormat) {
    const unavailable = candidate => !candidate || candidate.isBye
        || (typeof isPlayerInjured === 'function' && isPlayerInjured(candidate));
    if (unavailable(p1) || unavailable(p2)) {
        const p1Wins = !unavailable(p1);
        const winner = p1Wins ? p1 : !unavailable(p2) ? p2 : (typeof createPlayerEventBye === 'function' ? createPlayerEventBye() : { isBye: true, name: '(BYE)' });
        const target = matchFormat.type === 'sets' ? matchFormat.setsToWin || 3 : matchFormat.legsToWin || 6;
        return { winner, loser: p1Wins ? p2 : p1, p1Score: p1Wins ? target : 0, p2Score: !unavailable(p2) && !p1Wins ? target : 0,
            scoreStr: `${target}:0`, p1Avg: '0.00', p2Avg: '0.00', walkover: true };
    }
    let p1Ratings = typeof getWorldMastersMatchRatings === 'function' ? getWorldMastersMatchRatings(p1) : p1;
    let p2Ratings = typeof getWorldMastersMatchRatings === 'function' ? getWorldMastersMatchRatings(p2) : p2;
    if (typeof getPlayerEventMatchRatings === 'function') {
        p1Ratings = getPlayerEventMatchRatings(p1, p1Ratings);
        p2Ratings = getPlayerEventMatchRatings(p2, p2Ratings);
    }
    const p1PeakPerformance = typeof rollAiPeakMatchPerformance === 'function'
        ? rollAiPeakMatchPerformance(p1)
        : null;
    const p2PeakPerformance = typeof rollAiPeakMatchPerformance === 'function'
        ? rollAiPeakMatchPerformance(p2)
        : null;
    let p1Chance = getTournamentWinChance(p1, p2);
    p1Chance = Math.max(0.05, Math.min(0.95, p1Chance +
        (((p1PeakPerformance?.ratingBoost || 0) - (p2PeakPerformance?.ratingBoost || 0)) / 100)));
    let p1Legs = 0, p2Legs = 0, p1Sets = 0, p2Sets = 0;
    let p1LegsWon = 0, p2LegsWon = 0;

    let isSets = matchFormat.type === 'sets';
    let targetLegs = matchFormat.legsToWin || 6;
    let targetSets = matchFormat.setsToWin || 3;
    let legsPerSet = matchFormat.legsPerSet || 3;
    const mentalTotals = [0, 0];
    const bounceOutTotals = [0, 0];
    let bounceOutSimulatedDarts = 0;
    let mentalLegCount = 0;
    const legChance = () => {
        let chance = typeof getEnduranceLegWinChance === 'function'
            ? getEnduranceLegWinChance(p1Chance, p1, p2, p1LegsWon + p2LegsWon) : p1Chance;
        if (typeof adjustCareerPreparationWinChance === 'function' && typeof getCareerPreparationMatchModifier === 'function') {
            chance = adjustCareerPreparationWinChance(chance, getCareerPreparationMatchModifier(p1),
                getCareerPreparationMatchModifier(p2), getTournamentSimulationProfile(activeTournament).ratingScale);
        }
        if (typeof getMentalLegPenalties === 'function') {
            const penalties = getMentalLegPenalties(p1, p2, { isTournament: Boolean(activeTournament),
                matchFormat, p1Legs, p2Legs, p1Sets, p2Sets });
            mentalTotals[0] += penalties[0]; mentalTotals[1] += penalties[1]; mentalLegCount++;
            chance = adjustMentalLegWinChance(chance, penalties, getTournamentSimulationProfile(activeTournament).ratingScale);
        }
        if (typeof simulateBounceOutLeg === 'function') {
            const bounce = simulateBounceOutLeg(chance);
            bounceOutTotals[0] += bounce.counts[0]; bounceOutTotals[1] += bounce.counts[1];
            bounceOutSimulatedDarts += bounce.darts;
            chance = bounce.chance;
        }
        return chance;
    };

    // Szybka matematyczna symulacja meczu leg po legu
    while (true) {
        if (Math.random() < legChance()) { p1Legs++; p1LegsWon++; }
        else { p2Legs++; p2LegsWon++; }

        if (isSets) {
            const isDecidingSet = matchFormat.decidingSetWinByTwo &&
                p1Sets === targetSets - 1 && p2Sets === targetSets - 1;
            const legDifference = Math.abs(p1Legs - p2Legs);
            const setHasLegWinner = p1Legs >= legsPerSet || p2Legs >= legsPerSet;

            if (isDecidingSet && matchFormat.decidingSetSuddenDeathAt &&
                p1Legs === matchFormat.decidingSetSuddenDeathAt &&
                p2Legs === matchFormat.decidingSetSuddenDeathAt) {
                // Sudden death rozstrzyga set i tym samym cały mecz.
                if (Math.random() < legChance()) { p1Sets++; p1LegsWon++; }
                else { p2Sets++; p2LegsWon++; }
                p1Legs = 0;
                p2Legs = 0;
            } else if (setHasLegWinner && (!isDecidingSet || legDifference >= 2)) {
                if (p1Legs > p2Legs) p1Sets++;
                else p2Sets++;
                p1Legs = 0;
                p2Legs = 0;
            }
            if (p1Sets >= targetSets || p2Sets >= targetSets) break;
        } else {
            if (matchFormat.winByTwo) {
                if ((p1Legs >= targetLegs || p2Legs >= targetLegs) && Math.abs(p1Legs - p2Legs) >= 2) break;
                // Nagła śmierć (np. w World Matchplay)
                if (p1Legs === matchFormat.suddenDeathAt && p2Legs === matchFormat.suddenDeathAt) {
                    if (Math.random() < legChance()) { p1Legs++; p1LegsWon++; }
                    else { p2Legs++; p2LegsWon++; }
                    break;
                }
            } else {
                if (p1Legs >= targetLegs || p2Legs >= targetLegs) break;
            }
        }
    }

    let p1Won = isSets ? (p1Sets > p2Sets) : (p1Legs > p2Legs);
    
    // ZMIANA TUTAJ: Zawsze najpierw przypisujemy wynik zwycięzcy, a potem przegranego
    let wScore = p1Won ? (isSets ? p1Sets : p1Legs) : (isSets ? p2Sets : p2Legs);
    let lScore = p1Won ? (isSets ? p2Sets : p2Legs) : (isSets ? p1Sets : p1Legs);
    let scoreStr = `${wScore}:${lScore}`;

    // Forma turniejowa wpływa także na wyświetlaną średnią, aby niespodzianka miała wiarygodne statystyki.
    const p1TournamentForm = getTournamentSimulationForm(p1);
    const p2TournamentForm = getTournamentSimulationForm(p2);
    let p1BaseAvg = 60 + (p1Ratings.ovr * 0.42) + (p1TournamentForm * 0.4);
    let p2BaseAvg = 60 + (p2Ratings.ovr * 0.42) + (p2TournamentForm * 0.4);

    // Wybitny występ AI ma odzwierciedlenie zarówno w większej szansie na wygraną,
    // jak i w średniej widocznej w wynikach symulacji.
    const getSimulatedAverage = (candidate, baseAverage, won, peakPerformance, side) => {
        const spread = typeof getConsistencySpread === 'function' ? getConsistencySpread(candidate) : 1;
        const fatigue = typeof getEnduranceMatchPenalty === 'function'
            ? getEnduranceMatchPenalty(candidate, (p1LegsWon + p2LegsWon) / 2) * 0.4 : 0;
        const mentalPenalty = mentalLegCount ? mentalTotals[side] / mentalLegCount * 0.4 : 0;
        const preparation = typeof getCareerPreparationMatchModifier === 'function'
            ? getCareerPreparationMatchModifier(candidate) * 0.4
            : 0;
        const regularAverage = baseAverage + 0.5 + (Math.random() * 9 - 4.5) * spread + (won ? 2 : 0)
            - fatigue - mentalPenalty + preparation;
        const exceptionalAverage = peakPerformance
            ? Math.max(regularAverage, peakPerformance.averageFloor)
            : regularAverage;
        return Math.max(45, Math.min(125, exceptionalAverage)).toFixed(2);
    };
    let p1Avg = getSimulatedAverage(p1, p1BaseAvg, p1Won, p1PeakPerformance, 0);
    let p2Avg = getSimulatedAverage(p2, p2BaseAvg, !p1Won, p2PeakPerformance, 1);
    if (typeof getBounceOutAdjustedAverage === 'function') {
        p1Avg = getBounceOutAdjustedAverage(p1Avg, bounceOutTotals[0], bounceOutSimulatedDarts);
        p2Avg = getBounceOutAdjustedAverage(p2Avg, bounceOutTotals[1], bounceOutSimulatedDarts);
    }
    const result = { p1Avg, p2Avg, p1Score: isSets ? p1Sets : p1Legs, p2Score: isSets ? p2Sets : p2Legs,
        p1LegsWon, p2LegsWon };
    if (typeof getQuickSimulatedMatchStats === 'function') {
        Object.assign(result, getQuickSimulatedMatchStats(p1Ratings, p2Ratings, result));
    }
    result.p1BounceOuts = bounceOutTotals[0]; result.p2BounceOuts = bounceOutTotals[1];
    if (result.p1Stats) result.p1Stats.bounceOuts = bounceOutTotals[0];
    if (result.p2Stats) result.p2Stats.bounceOuts = bounceOutTotals[1];

    // Każdy symulowany oficjalny mecz, także AI kontra AI, aktualizuje rekord sezonu.
    recordSeasonHighestAverage(p1, Number(p1Avg));
    recordSeasonHighestAverage(p2, Number(p2Avg));
    if (typeof recordPlayerMatchStats === 'function') {
        recordPlayerMatchStats(p1, p2, result, { format: matchFormat });
    }

    // --- AKTUALIZACJA REKORDÓW Z SYMULACJI ---
    if (isCurrentPlayer(p1) || isCurrentPlayer(p2)) {
        if (typeof initCareerStats === 'function') initCareerStats(); // Zabezpieczenie obiektu
        
        let myAvg = parseFloat(isCurrentPlayer(p1) ? p1Avg : p2Avg);
        
        // Zapisanie najwyższej średniej z symulacji matematycznej
        recordCareerBestAverage(myAvg);
        saveGame();
    }

    return {
        ...result,
        winner: p1Won ? p1 : p2,
        loser: p1Won ? p2 : p1,
        scoreStr: scoreStr
    };
}

        function advanceTournament(playerAdvancing = true) {
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
            const round = iterateTournamentRound(playerAdvancing);
            let step = round.next();
            while (!step.done) step = round.next();
            return step.value;
        }

        // Oba tryby korzystają z identycznego rozliczenia meczu. Generator oddaje
        // sterowanie dopiero po komplecie wyniku, nagród, OVR i wpisów historii.
        function* iterateTournamentRound(playerAdvancing = true) {
            if (typeof repairInjuredTournamentBracket === 'function') {
                const repaired = repairInjuredTournamentBracket(tournamentBracket);
                if (repaired !== tournamentBracket) repaired.forEach((candidate, index) => { tournamentBracket[index] = candidate; });
            }
            let nextRoundBracket = [];
            const isContinentalQualifier = typeof isContinentalQualifierTournament === 'function' && isContinentalQualifierTournament(activeTournament);
            const isWorldMastersEvent = typeof isWorldMastersTournament === 'function' && isWorldMastersTournament(activeTournament);
            const isWorldMastersFinalsQualifier = typeof isWorldMastersFinalsQualifierTournament === 'function' && isWorldMastersFinalsQualifierTournament(activeTournament);
            const isQSchoolEvent = typeof isPdcQSchoolTournament === 'function' && isPdcQSchoolTournament(activeTournament);
            const isTourCardQualifierEvent = typeof isPdcTourCardQualifierTournament === 'function'
                && isPdcTourCardQualifierTournament(activeTournament);
            const isChallengeTourEvent = typeof isChallengeTourTournament === 'function'
                && isChallengeTourTournament(activeTournament);
            const isDevelopmentTourEvent = typeof isDevelopmentTourTournament === 'function'
                && isDevelopmentTourTournament(activeTournament);
            const isCrownMastersQualifier = typeof isCrownMastersQualifierTournament === 'function'
                && isCrownMastersQualifierTournament(activeTournament);
            const isUKOpenEvent = typeof isUKOpenTournament === 'function'
                && isUKOpenTournament(activeTournament);
            const isSecondaryTourEvent = isChallengeTourEvent || isDevelopmentTourEvent;
            const isNonPrizeQualifier = isContinentalQualifier || isWorldMastersFinalsQualifier || isQSchoolEvent || isTourCardQualifierEvent;
            let prize = isNonPrizeQualifier ? 0 : getPrizeMoney(activeTournament.name, tournamentRound, false);
            const isContinentalAutomaticOpeningLoss = candidate => {
                if (typeof isContinentalTourTournament !== 'function'
                    || !isContinentalTourTournament(activeTournament)) return false;
                const qualification = activeTournament?.continentalQualification;
                // Top 16 OOM zaczyna od Last 32, a Top 16 ProTour od Last 64.
                // Tylko porażka w ich pierwszym meczu jest nagrodą wyłącznie
                // do budżetu; następne rundy zachowują normalne rankingi.
                const automaticPlayerIds = tournamentRound === 32 ? qualification?.oomPlayerIds
                    : tournamentRound === 64 ? qualification?.proTourPlayerIds
                        : null;
                if (!Array.isArray(automaticPlayerIds)) return false;
                const candidateKey = typeof getContinentalQualificationPlayerKey === 'function'
                    ? getContinentalQualificationPlayerKey(candidate)
                    : (candidate?.id || `${candidate?.name || ''}|${candidate?.country || ''}`);
                const replacementEntry = (qualification?.withdrawals || []).find(entry =>
                    entry?.replacementPlayerId === candidateKey);
                if (replacementEntry) {
                    const replacementEntryRound = Number(replacementEntry.entryRound)
                        || (qualification?.oomPlayerIds?.includes(replacementEntry.withdrawnPlayerId) ? 32 : 64);
                    // Rezerwowy nie staje się kwalifikantem. Za porażkę w swoim
                    // pierwszym meczu otrzymuje gotówkę, ale bez pieniędzy do OOM.
                    if (replacementEntryRound === tournamentRound) return true;
                }
                const effectiveAutomaticPlayerIds = typeof getContinentalEffectivePlayerIds === 'function'
                    ? getContinentalEffectivePlayerIds(automaticPlayerIds, qualification)
                    : automaticPlayerIds;
                return effectiveAutomaticPlayerIds.includes(candidateKey);
            };

            let roundHeader = `<h4 style='color:var(--accent-green); margin:15px 0 5px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 3px;'>${getRoundName(tournamentRound)}</h4>`;
            lastTournamentResults += roundHeader;
            currentRoundHTML = roundHeader; 
            if (typeof appendTournamentHistoryRound === 'function') appendTournamentHistoryRound(tournamentRound);

            for(let i=0; i<tournamentBracket.length; i+=2) {
                let p1 = tournamentBracket[i]; let p2 = tournamentBracket[i+1];
                
                // Zabezpieczenie przed pustymi miejscami w drabince
                if (!p1 || !p2) { yield; continue; }
                
                let winner, loser;
                let countPrizeTowardsRankings = !isSecondaryTourEvent;
                
                // ZMIANA: Deklaracja wyników na samej górze pętli, aby były widoczne dla tabeli GDL!
                let matchWScore = 6, matchLScore = 0; 

                if (p1.isBye) { nextRoundBracket.push(p2); yield; continue; }
                if (p2.isBye) { nextRoundBracket.push(p1); yield; continue; }

                if (isCurrentPlayer(p1) || isCurrentPlayer(p2)) {
                    if (playerAdvancing) {
                        winner = isCurrentPlayer(p1) ? p1 : p2;
                        loser = isCurrentPlayer(p1) ? p2 : p1;
                    } else {
                        winner = isCurrentPlayer(p1) ? p2 : p1;
                        loser = isCurrentPlayer(p1) ? p1 : p2;
                    }
                    nextRoundBracket.push(winner);
                    countPrizeTowardsRankings = !isSecondaryTourEvent && !isContinentalAutomaticOpeningLoss(loser);
                    if (!isNonPrizeQualifier) {
                        awardPrizeMoney(loser, prize, activeTournament.name, { countTowardsRankings: countPrizeTowardsRankings });
                    }
                    applyTournamentRatingChange(winner, loser, tournamentRound);

                    let scoreStr = "W:O";
                    let wAvg = "0.00", lAvg = "0.00";
                    if (currentMatch && currentMatch.stats) {
                        let isSets = currentMatch.matchFormat && currentMatch.matchFormat.type === 'sets';
                        
                        // ZMIANA: Zapisanie Twojego wyniku do wyciągniętych wyżej zmiennych
                        matchWScore = isCurrentPlayer(winner) ? (isSets ? currentMatch.p1Sets : currentMatch.p1Legs) : (isSets ? currentMatch.p2Sets : currentMatch.p2Legs);
                        matchLScore = isCurrentPlayer(loser) ? (isSets ? currentMatch.p1Sets : currentMatch.p1Legs) : (isSets ? currentMatch.p2Sets : currentMatch.p2Legs);
                        scoreStr = `${matchWScore}:${matchLScore}`;
                        
                        let p1Avg = formatStat(currentMatch.stats.p1AccumulatedScore + (501 - currentMatch.p1Score), currentMatch.stats.p1TotalDarts);
                        let p2Avg = formatStat(currentMatch.stats.p2AccumulatedScore + (501 - currentMatch.p2Score), currentMatch.stats.p2TotalDarts);
                        wAvg = isCurrentPlayer(winner) ? p1Avg : p2Avg;
                        lAvg = isCurrentPlayer(loser) ? p1Avg : p2Avg;
                    }

                    // Oficjalny mecz z tym samym przeciwnikiem buduje historię H2H i może stworzyć rywalizację.
                    const playedOpponent = isCurrentPlayer(p1) ? p2 : p1;
                    if (currentMatch && currentMatch.isTournament && currentMatch.stats && samePlayer(currentMatch.opponent, playedOpponent)) {
                        const playerScore = isCurrentPlayer(winner)
                            ? `${matchWScore}:${matchLScore}`
                            : `${matchLScore}:${matchWScore}`;
                        recordRivalryMatch(winner, loser, activeTournament, tournamentRound, playerScore);
                    }

                    // --- NOWY, REALISTYCZNY UKŁAD DRABINKI (Twój mecz) ---
                    let isP1Winner = (winner === p1);
                    let p1Style = isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    let p2Style = !isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    
                    let p1FinalAvg = isP1Winner ? wAvg : lAvg;
                    let p2FinalAvg = !isP1Winner ? wAvg : lAvg;
                    let finalScoreStr = isP1Winner ? `${matchWScore}:${matchLScore}` : `${matchLScore}:${matchWScore}`;
                    let p1Flag = typeof getTournamentResultFlag === 'function' ? getTournamentResultFlag(p1) : '';
                    let p2Flag = typeof getTournamentResultFlag === 'function' ? getTournamentResultFlag(p2) : '';

                    let matchResultHTML = `<div style="font-size: 13px; border-bottom: 1px solid #2c3e50; padding: 6px; background: rgba(39, 174, 96, 0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="flex: 1; text-align: right; ${p1Style}">${escapeHtml(p1.name)}${p1Flag ? ` ${p1Flag}` : ''}</span>
                            <span style="flex: 0 0 50px; text-align: center; color: #f1c40f; font-weight: bold;">${finalScoreStr}</span>
                            <span style="flex: 1; text-align: left; ${p2Style}">${p2Flag ? `${p2Flag} ` : ''}${escapeHtml(p2.name)}</span>
                        </div>
                        <div style="color: #7f8c8d; font-size: 11px; text-align: center; margin-top: 3px;">
                            (${t('t-avg-short')} ${p1FinalAvg} - ${p2FinalAvg})
                        </div>
                    </div>`;

                    lastTournamentResults += matchResultHTML;
                    currentRoundHTML += matchResultHTML;
                    if (typeof appendTournamentHistoryMatch === 'function') {
                        appendTournamentHistoryMatch({
                            p1, p2,
                            score1: isP1Winner ? matchWScore : matchLScore,
                            score2: isP1Winner ? matchLScore : matchWScore,
                            average1: p1FinalAvg,
                            average2: p2FinalAvg,
                            careerMatch: true,
                            round: tournamentRound
                        });
                    }

                    if (isWorldMastersEvent && typeof recordWorldMastersMatchResult === 'function') {
                        recordWorldMastersMatchResult(activeTournament, winner, loser, {
                            round: tournamentRound, winnerLegs: matchWScore, loserLegs: matchLScore,
                            winnerAverage: Number(wAvg), loserAverage: Number(lAvg)
                        });
                    }

                } else {
                    let format = getTournamentMatchFormat(activeTournament, tournamentRound);
                    let matchRes = typeof resolveTournamentAiMatch === 'function'
                        ? resolveTournamentAiMatch(p1, p2, format, tournamentRound)
                        : simulateAImatch(p1, p2, format);
                    
                    winner = matchRes.winner; 
                    loser = matchRes.loser;
                    
                    // ZMIANA: Zapisanie wyniku meczu AI do wyciągniętych wyżej zmiennych (zawsze wyższa dla zwycięzcy)
                    matchWScore = Math.max(matchRes.p1Score, matchRes.p2Score);
                    matchLScore = Math.min(matchRes.p1Score, matchRes.p2Score);

                    nextRoundBracket.push(winner);
                    countPrizeTowardsRankings = !isSecondaryTourEvent && !isContinentalAutomaticOpeningLoss(loser);
                    if (!isNonPrizeQualifier) {
                        awardPrizeMoney(loser, prize, activeTournament.name, { countTowardsRankings: countPrizeTowardsRankings });
                    }
                    applyTournamentRatingChange(winner, loser, tournamentRound);

                    let wAvg = winner === p1 ? matchRes.p1Avg : matchRes.p2Avg;
                    let lAvg = loser === p1 ? matchRes.p1Avg : matchRes.p2Avg;

                    // --- NOWY, REALISTYCZNY UKŁAD DRABINKI (Mecze AI) ---
                    let isP1Winner = (winner === p1);
                    let p1Style = isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    let p2Style = !isP1Winner ? 'color: #ffffff; font-weight: bold;' : 'color: #bdc3c7; font-weight: normal;';
                    
                    let p1FinalAvg = isP1Winner ? wAvg : lAvg;
                    let p2FinalAvg = !isP1Winner ? wAvg : lAvg;
                    let finalScoreStr = isP1Winner ? `${matchWScore}:${matchLScore}` : `${matchLScore}:${matchWScore}`;
                    let p1Flag = typeof getTournamentResultFlag === 'function' ? getTournamentResultFlag(p1) : '';
                    let p2Flag = typeof getTournamentResultFlag === 'function' ? getTournamentResultFlag(p2) : '';

                    let matchResultHTML = `<div style="font-size: 13px; border-bottom: 1px solid #2c3e50; padding: 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="flex: 1; text-align: right; ${p1Style}">${escapeHtml(p1.name)}${p1Flag ? ` ${p1Flag}` : ''}</span>
                            <span style="flex: 0 0 50px; text-align: center; color: #f1c40f; font-weight: bold;">${finalScoreStr}</span>
                            <span style="flex: 1; text-align: left; ${p2Style}">${p2Flag ? `${p2Flag} ` : ''}${escapeHtml(p2.name)}</span>
                        </div>
                        <div style="color: #7f8c8d; font-size: 11px; text-align: center; margin-top: 3px;">
                            (${t('t-avg-short')} ${p1FinalAvg} - ${p2FinalAvg})
                        </div>
                    </div>`;

                    lastTournamentResults += matchResultHTML;
                    currentRoundHTML += matchResultHTML;
                    if (typeof appendTournamentHistoryMatch === 'function') {
                        appendTournamentHistoryMatch({
                            p1, p2,
                            score1: isP1Winner ? matchWScore : matchLScore,
                            score2: isP1Winner ? matchLScore : matchWScore,
                            average1: p1FinalAvg,
                            average2: p2FinalAvg,
                            careerMatch: false,
                            round: tournamentRound
                        });
                    }

                    if (isWorldMastersEvent && typeof recordWorldMastersMatchResult === 'function') {
                        recordWorldMastersMatchResult(activeTournament, winner, loser, {
                            round: tournamentRound, winnerLegs: matchWScore, loserLegs: matchLScore,
                            winnerAverage: Number(wAvg), loserAverage: Number(lAvg)
                        });
                    }
                }

                if (isContinentalQualifier && typeof recordContinentalQualifierFinalLoser === 'function') {
                    recordContinentalQualifierFinalLoser(activeTournament, loser, tournamentRound);
                }
                if (!isNonPrizeQualifier) {
                    recordSeasonTournamentResult(loser, activeTournament, {
                        round: tournamentRound,
                        prizeMoney: prize,
                        countTowardsRankings: countPrizeTowardsRankings
                    });
                }

                // --- NOWOŚĆ: Punkty i legi do tabeli Ligi ---
                if ((activeTournament.name.includes("Global Darts League") || activeTournament.name.includes("Premier")) && !activeTournament.name.includes("Play-offs")) {
                    let wGdl = gdlTable.find(g => samePlayer(g.player, winner));
                    let lGdl = gdlTable.find(g => samePlayer(g.player, loser));
                    
                    // Używamy bezpiecznie przekazanych zmiennych matchWScore i matchLScore
                    if(wGdl) { wGdl.legsWon += matchWScore; wGdl.legsLost += matchLScore; }
                    if(lGdl) { lGdl.legsWon += matchLScore; lGdl.legsLost += matchWScore; }

                    if (tournamentRound === 4) { 
                        // Ktoś przegrał w Półfinale GDL
                        if (lGdl) lGdl.points += 2;
                    } else if (tournamentRound === 2) { 
                        // Finał! Zwycięzca i przegrany dostają punkty
                        if (lGdl) lGdl.points += 3;
                        if (wGdl) { wGdl.points += 5; wGdl.nightsWon += 1; }
                    }
                }
                yield;
            } // Koniec pętli for
            const completedRound = tournamentRound;
            if (isUKOpenEvent && typeof getUKOpenNextStage === 'function') {
                const candidates = typeof getPdcTourCardPlayers === 'function'
                    ? getPdcTourCardPlayers(true)
                    : [...(Array.isArray(pdcPlayers) ? pdcPlayers : []), ...(player?.name ? [player] : [])];
                const nextStage = getUKOpenNextStage(activeTournament, nextRoundBracket, completedRound, candidates);
                tournamentBracket = nextStage.bracket;
                tournamentRound = nextStage.round;
            } else {
                tournamentBracket = nextRoundBracket;
                tournamentRound /= 2;
            }
            if (isContinentalQualifier && tournamentBracket.length <= (
                typeof getContinentalQualifierPlaces === 'function'
                    ? getContinentalQualifierPlaces(activeTournament)
                    : 16
            )) {
                completeContinentalTourQualifier(activeTournament, tournamentBracket);
                return true;
            }
            if (isWorldMastersFinalsQualifier && tournamentRound === 4) {
                if (typeof completeWorldMastersFinalsQualifier === 'function') {
                    completeWorldMastersFinalsQualifier(activeTournament, tournamentBracket);
                }
                return 'worldMastersFinalsQualifier';
            }
            if (isQSchoolEvent && tournamentRound === 64) {
                if (typeof completePdcQSchool === 'function') {
                    completePdcQSchool(activeTournament, tournamentBracket, currentDate);
                }
                return 'pdcQSchool';
            }
            if (isTourCardQualifierEvent) {
                const qualifyingPlaces = Math.max(1, Number(activeTournament.qualifyingPlaces) || 8);
                if (tournamentBracket.length <= qualifyingPlaces) {
                    if (typeof completePdcTourCardQualifier === 'function') {
                        completePdcTourCardQualifier(activeTournament, tournamentBracket);
                    }
                    return 'pdcTourCardQualifier';
                }
            }
            if (isCrownMastersQualifier && tournamentBracket.length <= CROWN_MASTERS_QUALIFYING_PLACES) {
                if (typeof completeCrownMastersQualifier === 'function') {
                    completeCrownMastersQualifier(activeTournament, tournamentBracket);
                }
                return 'crownMastersQualifier';
            }
            return false;
        }

        function startTournamentMatch() {
            if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
            if (typeof isPlayerInjured === 'function' && isPlayerInjured(player)) {
                return typeof showPlayerInjuryBlocked === 'function' ? showPlayerInjuryBlocked() : false;
            }
            if (typeof repairInjuredTournamentBracket === 'function') tournamentBracket = repairInjuredTournamentBracket(tournamentBracket);
            let opponent = null;
            for(let i = 0; i < tournamentBracket.length; i += 2) {
                if(isCurrentPlayer(tournamentBracket[i])) opponent = tournamentBracket[i+1];
                else if(isCurrentPlayer(tournamentBracket[i+1])) opponent = tournamentBracket[i];
            }

            const matchFormat = getTournamentMatchFormat(activeTournament, tournamentRound);
            if (!opponent) return false;
            if (opponent.isBye) return closeBracketAndPlay();
            initRivalries();
            const rivalryRecord = opponent && opponent.id ? player.rivalries[opponent.id] : null;
            const isRivalryMatch = Boolean(rivalryRecord && player.activeRivalIds.includes(opponent.id));
            const rivalryModifier = isRivalryMatch ? getRivalryMatchModifier(rivalryRecord) : 0;
            const opponentPeakPerformance = typeof rollAiPeakMatchPerformance === 'function'
                ? rollAiPeakMatchPerformance(opponent)
                : null;

            let starter = Math.random() < 0.5 ? 'p1' : 'p2';
            currentMatch = { 
                vsAI: true, opponent: opponent, 
                p1Score: 501, p2Score: 501, p1Legs: 0, p2Legs: 0, p1Sets: 0, p2Sets: 0, totalLegsPlayed: 0,
                legsToWin: matchFormat.type === 'sets' ? matchFormat.legsPerSet : matchFormat.legsToWin,
                matchFormat: matchFormat, turn: starter, startingPlayer: starter, dartsThrown: 0, isTurnLocked: false, p1TurnStartScore: 501, p2TurnStartScore: 501, isTournament: true, isRivalryMatch: isRivalryMatch, rivalryModifier: rivalryModifier, opponentPeakPerformance,
                stats: { 
                    p1TotalDarts: 0, p1AccumulatedScore: 0, p1First9Score: 0, p1First9Darts: 0, p1LegDarts: 0, p1HighCheckout: 0, p1DoubleAttempts: 0, p1DoubleHits: 0, p1OneEighties: 0,
                    p2TotalDarts: 0, p2AccumulatedScore: 0, p2First9Score: 0, p2First9Darts: 0, p2LegDarts: 0, p2HighCheckout: 0, p2DoubleAttempts: 0, p2DoubleHits: 0, p2OneEighties: 0 
                }
            };
            
            currentTurnScore = 0; document.getElementById('match-log').innerHTML = "";
            if (isRivalryMatch) {
                logThrow(`🔥 ${trRival('h2h')}: ${rivalryRecord.wins}-${rivalryRecord.losses}`, 'system');
                if (rivalryModifier !== 0) {
                    const effectKey = rivalryModifier > 0 ? 'mentalBoost' : 'mentalPressure';
                    logThrow(`🧠 ${trRival(effectKey, { value: Math.abs(rivalryModifier) })}`, 'system');
                }
            }
            drawnDarts = []; drawDartboard(); updateDartDots();

            document.getElementById('score-col-ai').style.display = 'flex'; 
            document.getElementById('match-p1-name').innerHTML = `${getFlagImg(player.country)} ${escapeHtml(player.name)}`;
            document.getElementById('match-p2-name').innerHTML = `${getFlagImg(currentMatch.opponent.country)} ${escapeHtml(currentMatch.opponent.name)}`;
            const rivalryPrefix = isRivalryMatch ? `🔥 ${trRival('tileTitle')} · ` : '';
            const tournamentName = typeof getTournamentDisplayName === 'function'
                ? getTournamentDisplayName(activeTournament)
                : activeTournament.name;
            document.getElementById('match-title').innerText = `${rivalryPrefix}🏆 ${tournamentName} - ${getRoundName(tournamentRound)} (${getMatchFormatLabel(matchFormat)})`;
            
            // --- WCZYTYWANIE ZDJĘĆ NA TABLICĘ ---
            let p1PhotoSrc = player.photo ? player.photo : "https://placehold.co/100/16213e/FFFFFF?text=TY";
            document.getElementById('score-photo-p1').classList.remove('world-cup-flag-photo');
            document.getElementById('score-photo-p2').classList.remove('world-cup-flag-photo');
            document.getElementById('score-photo-p1').src = p1PhotoSrc;
            
            let p2Img = document.getElementById('score-photo-p2');
            const customOpponentPhoto = typeof getPlayerProfilePhoto === 'function'
                ? getPlayerProfilePhoto(currentMatch.opponent)
                : (currentMatch.opponent.photo || moddedAssets.photos[currentMatch.opponent.name]);
            const bundledOpponentName = currentMatch.opponent.sourceName || currentMatch.opponent.name;
            p2Img.src = customOpponentPhoto || `zdjecia/${encodeURIComponent(bundledOpponentName)}.png`;
            p2Img.onerror = function() { this.onerror=null; this.src='https://placehold.co/100/16213e/FFFFFF?text=AI'; };
            // -----------------------------------

            if (typeof applyMatchPlayerPresentationThemes === 'function') {
                applyMatchPlayerPresentationThemes(player, currentMatch.opponent);
            }

            updateScores(); updateMatchStatsUI(); setTurnUI(); showScreen('screen-match');
            playMatchIntro(player.name, currentMatch.opponent.name);
        }

        
