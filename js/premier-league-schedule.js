// Eight-player league: two complete round robins in nights 1-7 and 9-15.
// Nights 8 and 16 are the two additional quarter-final rounds.
function getPremierLeagueNightNumber(tournament) {
    const names = [tournament?.sourceName, tournament?.name];
    for (const name of names) {
        const match = String(name || '').match(/(?:global darts league|premier league)\s*[-–]?\s*night\s*(\d+)\b/i);
        if (match) {
            const night = Number(match[1]);
            if (night >= 1 && night <= 16) return night;
        }
    }
    return 0;
}

function getPremierLeaguePlayerKey(candidate) {
    if (!candidate) return '';
    return candidate.id != null && candidate.id !== ''
        ? `id:${candidate.id}`
        : `name:${String(candidate.name || '').trim()}|${String(candidate.country || '').trim()}`;
}

function isPremierLeagueSeasonEvent(event) {
    return Boolean(event && !event.isEditorTournament && (getPremierLeagueNightNumber(event)
        || [event.sourceName, event.name].some(name => /^(?:premier league|global darts league)\s*[-–—]?\s*play-offs?$/i.test(name || ''))));
}

function hasDeclinedPremierLeagueInvitation(candidate, date) {
    return candidate?.premierLeagueDeclinedYear === date.getFullYear();
}

function getOpenPremierLeagueInvitation() {
    const year = currentDate.getFullYear();
    if (!player?.name || hasDeclinedPremierLeagueInvitation(player, currentDate)) return null;
    const invitedIndex = gdlTable.findIndex(row => isCurrentPlayer(row.player));
    if (invitedIndex < 0) return null;

    const events = tournamentDatabase.filter(event => isPremierLeagueSeasonEvent(event)
        && isTournamentScheduledForCareerYear(event, year));
    if (events.some(event => tournamentAbsenceDrawStarted(event) || event.premierLeagueOpeningPairs?.length
        || hasCareerTourEntryOverride(event) || hasTournamentEditorQualification(event))) return null;
    const openingNight = events.filter(getPremierLeagueNightNumber)
        .sort((a, b) => a.month - b.month || a.day - b.day)[0];
    return openingNight ? { year, invitedIndex, openingNight } : null;
}

function declinePremierLeagueInvitation(year) {
    const invitation = getOpenPremierLeagueInvitation();
    if (!invitation || invitation.year !== year) return null;

    const invited = new Set(gdlTable.map(row => getPremierLeaguePlayerKey(row.player)));
    const replacement = getPdcTourCardPlayers(false)
        .filter(candidate => !isCurrentPlayer(candidate) && !invited.has(getPremierLeaguePlayerKey(candidate))
            && isPlayerAvailableForPlay(candidate)
            && isCareerEditorAccessEligible(invitation.openingNight, candidate, currentDate))
        .sort((a, b) => (Number(b.prizeMoney) || 0) - (Number(a.prizeMoney) || 0))[0];

    player.premierLeagueDeclinedYear = year;
    if (replacement) {
        gdlTable[invitation.invitedIndex] = { player: replacement, points: 0, nightsWon: 0, legsWon: 0, legsLost: 0 };
    } else {
        gdlTable.splice(invitation.invitedIndex, 1);
    }
    return { replacement };
}

function premierLeagueInvitationText(key, name = '') {
    const copy = {
        decline: ['Odrzuć zaproszenie do ligi', 'Decline league invitation', 'Liga-Einladung ablehnen', 'Competitie-uitnodiging weigeren'],
        confirm: ['Odrzucić zaproszenie na cały sezon, łącznie z play-offami? Miejsce otrzyma kolejny uprawniony zawodnik z rankingu. Tej decyzji nie można cofnąć.',
            'Decline the invitation for the entire season, including the play-offs? The next eligible player in the rankings will be offered your place. This decision is final.',
            'Die Einladung für die gesamte Saison einschließlich der Play-offs ablehnen? Der nächste berechtigte Spieler in der Rangliste erhält den Platz. Die Entscheidung ist endgültig.',
            'De uitnodiging voor het hele seizoen inclusief de play-offs weigeren? De eerstvolgende speelgerechtigde speler op de ranglijst krijgt je plek. Deze beslissing is definitief.'],
        replaced: ['Zaproszenie odrzucone. Twoje miejsce zajmuje {name}.', 'Invitation declined. {name} takes your place.',
            'Einladung abgelehnt. {name} übernimmt deinen Platz.', 'Uitnodiging geweigerd. {name} neemt je plek over.'],
        vacant: ['Zaproszenie odrzucone. Nie ma obecnie uprawnionego zastępcy.', 'Invitation declined. No eligible replacement is currently available.',
            'Einladung abgelehnt. Derzeit steht kein berechtigter Ersatzspieler zur Verfügung.', 'Uitnodiging geweigerd. Er is momenteel geen speelgerechtigde vervanger.'],
        saveError: ['Nie udało się zapisać kariery. Zapisz ją ręcznie przed wyjściem z gry.', 'The career could not be saved. Save manually before leaving the game.',
            'Die Karriere konnte nicht gespeichert werden. Speichere sie vor dem Verlassen manuell.', 'De carrière kon niet worden opgeslagen. Sla handmatig op voordat je het spel afsluit.']
    };
    const lang = typeof currentLang === 'string' ? ['pl', 'en', 'de', 'nl'].indexOf(currentLang) : 0;
    return copy[key][Math.max(0, lang)].replace('{name}', () => name);
}

function getPremierLeagueInvitationButtonHtml(year) {
    return `<button type="button" class="btn-sign" onclick="confirmPremierLeagueInvitationDecline(${year})">${escapeHtml(premierLeagueInvitationText('decline'))}</button>`;
}

async function confirmPremierLeagueInvitationDecline(year) {
    if (!window.confirm(premierLeagueInvitationText('confirm'))) return false;
    const decision = declinePremierLeagueInvitation(year);
    if (!decision) return false;

    let message = decision.replacement
        ? premierLeagueInvitationText('replaced', decision.replacement.name) : premierLeagueInvitationText('vacant');
    try {
        if (await saveGame(true, { immediate: true }) === false) message += `\n${premierLeagueInvitationText('saveError')}`;
    } catch (_error) {
        message += `\n${premierLeagueInvitationText('saveError')}`;
    }
    if (document.getElementById('screen-mailbox')?.classList.contains('active')) showMailbox();
    if (document.getElementById('screen-calendar')?.classList.contains('active')) showCalendar();
    updateTournamentEntrySimulationButton('t-btn-sim-to-match-hub');
    window.alert(message);
    return true;
}

function getPremierLeaguePairKey(first, second) {
    return [first, second].sort().join('\u0000');
}

function getPremierLeagueRoundRobinRounds() {
    const rounds = [];
    let positions = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let round = 0; round < 7; round++) {
        rounds.push(Array.from({ length: 4 }, (_, index) => [positions[index], positions[7 - index]]));
        positions = [positions[0], positions[7], ...positions.slice(1, 7)];
    }
    return rounds;
}

const PREMIER_LEAGUE_ROUNDS = getPremierLeagueRoundRobinRounds();

function getPremierLeaguePlannedPairs(night) {
    const round = night <= 7 ? night - 1 : night === 8 ? 3 : night <= 15 ? night - 9 : 0;
    const reverse = night >= 9;
    return PREMIER_LEAGUE_ROUNDS[round].map(([first, second]) => reverse ? [second, first] : [first, second]);
}

function getPremierLeagueRecordedPairs(tournament) {
    if (Array.isArray(tournament?.premierLeagueOpeningPairs)
        && tournament.premierLeagueOpeningPairs.length === 4) {
        return tournament.premierLeagueOpeningPairs.filter(pair => Array.isArray(pair) && pair.length === 2);
    }
    const history = tournament?.matchHistory;
    const opening = history?.blocks?.find(block => block?.type === 'round' && Number(block.round) === 8);
    if (!Array.isArray(opening?.matches) || !Array.isArray(history?.players)) return [];
    return opening.matches.flatMap(match => {
        const first = history.players[match?.[0]]?.[0];
        const second = history.players[match?.[1]]?.[0];
        return first && second ? [[first, second]] : [];
    });
}

function getPremierLeagueHistoricalPairs(tournaments, night) {
    return (Array.isArray(tournaments) ? tournaments : [])
        .map(tournament => ({ tournament, night: getPremierLeagueNightNumber(tournament) }))
        .filter(entry => entry.night > 0 && entry.night < night && entry.tournament.completed)
        .map(entry => ({ night: entry.night, pairs: getPremierLeagueRecordedPairs(entry.tournament) }))
        .filter(entry => entry.pairs.length === 4);
}

function getPremierLeagueAlternativePairs(idealPairs, playerKeys, historicalPairs, night) {
    const counts = new Map();
    const lastPlayed = new Map();
    for (const entry of historicalPairs) for (const pair of entry.pairs) {
        const key = getPremierLeaguePairKey(...pair);
        if (entry.night !== 8 && entry.night !== 16) counts.set(key, (counts.get(key) || 0) + 1);
        lastPlayed.set(key, entry.night);
    }
    const ideal = new Set(idealPairs.map(([first, second]) =>
        getPremierLeaguePairKey(playerKeys[first], playerKeys[second])));
    let best = null;
    let bestCost = Infinity;
    const futureRegularNights = Array.from({ length: Math.max(0, 15 - night) }, (_, index) => night + index + 1)
        .filter(future => future !== 8).length;
    const visit = (remaining, pairs, cost) => {
        if (cost >= bestCost) return;
        if (!remaining.length) {
            const after = new Map(counts);
            if (night !== 8 && night !== 16) for (const [first, second] of pairs) {
                const key = getPremierLeaguePairKey(playerKeys[first], playerKeys[second]);
                after.set(key, (after.get(key) || 0) + 1);
            }
            let shortfall = 0;
            for (let first = 0; first < 8; first++) {
                let capacity = 0;
                for (let second = 0; second < 8; second++) {
                    if (first === second) continue;
                    capacity += Math.max(0, 2 - (after.get(getPremierLeaguePairKey(playerKeys[first], playerKeys[second])) || 0));
                }
                shortfall += Math.max(0, futureRegularNights - capacity);
            }
            const finalCost = cost + shortfall * 2000;
            if (finalCost < bestCost) { best = pairs; bestCost = finalCost; }
            return;
        }
        const first = remaining[0];
        for (const second of remaining.slice(1)) {
            const key = getPremierLeaguePairKey(playerKeys[first], playerKeys[second]);
            const count = counts.get(key) || 0;
            const excess = count >= 2 ? 10000 * (count - 1) : 0;
            const previousNight = lastPlayed.get(key) === night - 1 ? 200 : 0;
            const repeat = count === 1 ? (night <= 7 ? 40 : 4) : 0;
            const deviation = ideal.has(key) ? 0 : 1;
            visit(remaining.filter(index => index !== first && index !== second),
                [...pairs, [first, second]], cost + excess + previousNight + repeat + deviation);
        }
    };
    visit([0, 1, 2, 3, 4, 5, 6, 7], [], 0);
    return best || idealPairs;
}

function buildPremierLeagueNightDraw(tournament, participants, tournaments = []) {
    const night = getPremierLeagueNightNumber(tournament);
    if (!night || !Array.isArray(participants) || participants.length !== 8
        || participants.some(candidate => !candidate)) return null;
    const playerKeys = participants.map(getPremierLeaguePlayerKey);
    if (new Set(playerKeys).size !== 8) return null;
    const idealPairs = getPremierLeaguePlannedPairs(night);
    const historicalPairs = getPremierLeagueHistoricalPairs(tournaments, night);
    const matchesPlan = historicalPairs.every(entry => {
        const planned = getPremierLeaguePlannedPairs(entry.night).map(([first, second]) =>
            getPremierLeaguePairKey(playerKeys[first], playerKeys[second]));
        const recorded = entry.pairs.map(pair => getPremierLeaguePairKey(...pair));
        return planned.every(key => recorded.includes(key));
    });
    const pairings = matchesPlan ? idealPairs
        : getPremierLeagueAlternativePairs(idealPairs, playerKeys, historicalPairs, night);
    tournament.premierLeagueOpeningPairs = pairings.map(([first, second]) =>
        [playerKeys[first], playerKeys[second]]);
    return pairings.flatMap(([first, second]) => [participants[first], participants[second]]);
}
