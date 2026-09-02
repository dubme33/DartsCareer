let isFastForwardingTournament = false;
let tournamentSimulationFinished = Promise.resolve(true);
let tournamentSimulationSaveBlocked = false;
const TOURNAMENT_SIMULATION_BATCH_MS = 8;
const TOURNAMENT_SIMULATION_BATCH_PAIRS = 16;
const MATCH_CHECKPOINT_BATCH_RECORDS = 64;

function isTournamentSimulationBusy() {
    return isFastForwardingTournament;
}

function waitForTournamentSimulation() {
    return tournamentSimulationFinished;
}

function isTournamentSimulationSaveSafe() {
    return !tournamentSimulationSaveBlocked;
}

function clearTournamentSimulationSaveBlock() {
    tournamentSimulationSaveBlocked = false;
}

function yieldTournamentSimulation() {
    // Rzeczywista przerwa w głównym wątku, nie samo Promise.resolve(). Działa
    // również w tle, gdzie requestAnimationFrame może się całkiem zatrzymać.
    return new Promise(resolve => setTimeout(resolve, 0));
}

function tournamentSimulationNow() {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function lockTournamentSimulationInterface() {
    const dialog = document.getElementById('tournament-simulation-dialog');
    const blockAction = event => {
        if (!isFastForwardingTournament) return;
        if (dialog && dialog.contains(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    };
    const preventClose = event => event.preventDefault();
    const preventUnload = event => { event.preventDefault(); event.returnValue = ''; };
    const events = ['click', 'keydown', 'change', 'input', 'submit'];
    const unlock = () => {
        events.forEach(name => document.removeEventListener(name, blockAction, true));
        window.removeEventListener('beforeunload', preventUnload);
        if (dialog) {
            dialog.removeEventListener('cancel', preventClose);
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
        }
    };
    try {
        events.forEach(name => document.addEventListener(name, blockAction, true));
        window.addEventListener('beforeunload', preventUnload);
        if (dialog) {
            dialog.addEventListener('cancel', preventClose);
            if (typeof dialog.showModal === 'function') dialog.showModal();
            else dialog.setAttribute('open', '');
        }
        return unlock;
    } catch (error) {
        unlock();
        throw error;
    }
}

function updateTournamentSimulationProgress(round, processed, total) {
    const label = document.getElementById('tournament-simulation-progress-label');
    const roundLabel = typeof round === 'string' ? round : getRoundName(round);
    if (label) label.textContent = `${roundLabel} — ${t('t-simulation-round-progress')}: ${processed} / ${total}`;
    const bar = document.getElementById('tournament-simulation-progress');
    if (bar) { bar.max = Math.max(1, total); bar.value = processed; }
}

async function advanceTournamentInBatches(tournament) {
    const bracket = tournamentBracket;
    const roundNumber = tournamentRound;
    const total = Math.ceil(bracket.length / 2);
    return runTournamentSimulationSteps(iterateTournamentRound(false), roundNumber, total, () => {
        if (activeTournament !== tournament || tournamentBracket !== bracket || tournamentRound !== roundNumber) {
            throw new Error('Stan turnieju zmienił się w trakcie symulacji.');
        }
    });
}

async function runTournamentSimulationSteps(steps, round, total, checkState) {
    let processed = 0;
    updateTournamentSimulationProgress(round, 0, total);
    while (true) {
        if (checkState) checkState();
        const startedAt = tournamentSimulationNow();
        let batchPairs = 0;
        do {
            const step = steps.next();
            if (step.done) {
                updateTournamentSimulationProgress(round, total, total);
                return step.value;
            }
            processed++;
            batchPairs++;
        } while (batchPairs < TOURNAMENT_SIMULATION_BATCH_PAIRS
            && tournamentSimulationNow() - startedAt < TOURNAMENT_SIMULATION_BATCH_MS);
        updateTournamentSimulationProgress(round, processed, total);
        await yieldTournamentSimulation();
    }
}

async function simulateTournamentRoundsInBatches(tournament) {
    let outcome = false;
    let simulatedRounds = 0;
    while (tournamentBracket.length > 1 && simulatedRounds < 16) {
        outcome = await advanceTournamentInBatches(tournament);
        simulatedRounds++;
        if (outcome) return outcome;
        if (tournamentBracket.length > 1) await yieldTournamentSimulation();
    }
    if (tournamentBracket.length !== 1) throw new Error('Nie udało się zamknąć drabinki turnieju.');
    return outcome;
}

async function cloneMatchCheckpointInBatches(state) {
    const clone = value => typeof structuredClone === 'function'
        ? structuredClone(value)
        : (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
    const copy = {};
    let startedAt = tournamentSimulationNow();
    let items = 0;
    // Zapis używa referencji ID między zawodnikami i turniejami. Największe
    // listy można więc kopiować po rekordzie bez klonowania całej kariery naraz.
    for (const [key, value] of Object.entries(state)) {
        if ((key === 'pdcPlayers' || key === 'tournamentDatabase') && Array.isArray(value)) {
            copy[key] = [];
            for (const record of value) {
                copy[key].push(clone(record));
                if (++items >= MATCH_CHECKPOINT_BATCH_RECORDS
                    || tournamentSimulationNow() - startedAt >= TOURNAMENT_SIMULATION_BATCH_MS) {
                    await yieldTournamentSimulation();
                    startedAt = tournamentSimulationNow();
                    items = 0;
                }
            }
        } else {
            copy[key] = clone(value);
        }
        if (tournamentSimulationNow() - startedAt >= TOURNAMENT_SIMULATION_BATCH_MS) {
            await yieldTournamentSimulation();
            startedAt = tournamentSimulationNow();
            items = 0;
        }
    }
    await yieldTournamentSimulation();
    return copy;
}

async function createTournamentSimulationCheckpoint({ cooperative = false } = {}) {
    const state = buildGameState();
    const payload = typeof createCareerIndexedDbPayload === 'function'
        ? await createCareerIndexedDbPayload(state)
        : { state, mediaByKind: {} };
    // Jedna kopia bezpieczeństwa na całą operację. Pliki profilu pozostają
    // binarne, poza klonowanym stanem; nie kopiujemy ich do Base64.
    return {
        state: cooperative ? await cloneMatchCheckpointInBatches(payload.state)
            : typeof structuredClone === 'function'
            ? structuredClone(payload.state)
            : JSON.parse(JSON.stringify(payload.state)),
        media: payload.mediaByKind
    };
}

function isCareerPlayerInRemainingBracket() {
    return Array.isArray(tournamentBracket)
        && tournamentBracket.some(candidate => typeof isCurrentPlayer === 'function' && isCurrentPlayer(candidate));
}

function setRemainingTournamentButtonsDisabled(disabled) {
    ['t-btn-sim-tournament', 't-btn-sim-tournament-results'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = disabled;
    });
}

function awardGlobalLeaguePlayoffPlacementPrizes(tournament) {
    if (!tournament?.name?.includes('Play-offs') || typeof gdlTable === 'undefined' || !Array.isArray(gdlTable)) return;
    const sortedLeague = [...gdlTable].sort((first, second) => second.points - first.points
        || (second.legsWon - second.legsLost) - (first.legsWon - first.legsLost));
    Object.entries(GLOBAL_LEAGUE_PLACEMENT_PRIZES).forEach(([position, prize]) => {
        const row = sortedLeague[Number(position) - 1];
        if (row) awardPrizeMoney(row.player, prize, tournament.name);
    });
}

function finishFastForwardedTournament({ announceWinner = false } = {}) {
    if (!activeTournament || !Array.isArray(tournamentBracket) || tournamentBracket.length !== 1) return null;

    const completedTournament = activeTournament;
    const winner = tournamentBracket[0];
    const winnerPrize = getPrizeMoney(completedTournament.name, 2, true);

    completedTournament.completed = true;
    if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(completedTournament);
    else completedTournament.historyLogs = lastTournamentResults;
    awardPrizeMoney(winner, winnerPrize, completedTournament.name);
    if (typeof completeWorldMastersTournament === 'function') completeWorldMastersTournament(completedTournament, winner);
    if (typeof isGrandSlamTournament === 'function' && isGrandSlamTournament(completedTournament)
        && typeof grandSlamState !== 'undefined' && grandSlamState) {
        grandSlamState.phase = 'completed';
    }
    recordSeasonTournamentResult(winner, completedTournament, { round: 2, prizeMoney: winnerPrize, won: true });
    awardGlobalLeaguePlayoffPlacementPrizes(completedTournament);

    if (announceWinner) {
        alert(t('t-alert-tour-sim-end').replace('{tour}', completedTournament.name).replace('{winner}', winner.name));
    }

    const bracketModal = document.getElementById('bracket-modal');
    if (bracketModal) bracketModal.style.display = 'none';
    const resultsModal = document.getElementById('results-modal');
    if (resultsModal) resultsModal.style.display = 'none';

    showTournamentEnd();
    activeTournament = null;
    tournamentBracket = [];

    const tournamentTile = document.getElementById('tile-tournament');
    if (tournamentTile) tournamentTile.style.display = 'none';
    if (typeof updateHub === 'function') updateHub();
    if (typeof saveGame === 'function') saveGame(true);
    return { tournament: completedTournament, winner };
}

function finishFastForwardedSpecialTournament(outcome) {
    const bracketModal = document.getElementById('bracket-modal');
    if (bracketModal) bracketModal.style.display = 'none';
    const resultsModal = document.getElementById('results-modal');
    if (resultsModal) resultsModal.style.display = 'none';

    if (outcome === true) {
        concludeContinentalTourQualifierEvent(true);
        showTournamentEnd();
        return true;
    }
    if (outcome === 'worldMastersFinalsQualifier') {
        concludeWorldMastersFinalsQualifierEvent(true);
        showTournamentEnd();
        return true;
    }
    if (outcome === 'pdcQSchool') {
        concludePdcQSchoolEvent(true);
        showTournamentEnd();
        return true;
    }
    if (outcome === 'pdcTourCardQualifier') {
        concludePdcTourCardQualifierEvent(true);
        showTournamentEnd();
        return true;
    }
    return false;
}

async function simulateRemainingTournament(options = {}) {
    // Zwykły przycisk po odpadnięciu nie może wycofać gracza. Taką zgodę
    // przekazuje wyłącznie potwierdzone „Odpuść” dla istniejącej drabinki.
    if (!Array.isArray(tournamentBracket) || tournamentBracket.length <= 1
        || (isCareerPlayerInRemainingBracket() && options?.withdrawCareerPlayer !== true)) return false;

    return runTournamentSimulation(async () => {
        const outcome = await simulateTournamentRoundsInBatches(activeTournament);
        if (!finishFastForwardedSpecialTournament(outcome)) finishFastForwardedTournament({ announceWinner: false });
        return true;
    });
}

function finishHeadlessTournament(specialTournamentOutcome) {
    if (specialTournamentOutcome === true) {
        concludeContinentalTourQualifierEvent(false);
        return;
    }
    if (specialTournamentOutcome === 'worldMastersFinalsQualifier') {
        concludeWorldMastersFinalsQualifierEvent(false);
        return;
    }
    if (specialTournamentOutcome === 'pdcQSchool') {
        concludePdcQSchoolEvent(false);
        return;
    }
    if (specialTournamentOutcome === 'pdcTourCardQualifier') {
        concludePdcTourCardQualifierEvent(false);
        return;
    }
    
    // Przypisanie nagród i ostateczne zamknięcie turnieju
    activeTournament.completed = true;
    if (typeof finalizeTournamentMatchHistory === 'function') finalizeTournamentMatchHistory(activeTournament);
    else activeTournament.historyLogs = lastTournamentResults;
    
    let winner = tournamentBracket[0];
    let winPrize = getPrizeMoney(activeTournament.name, 2, true);
    awardPrizeMoney(winner, winPrize, activeTournament.name);
    if (typeof completeWorldMastersTournament === 'function') completeWorldMastersTournament(activeTournament, winner);
    recordSeasonTournamentResult(winner, activeTournament, { round: 2, prizeMoney: winPrize, won: true });

    // Wypłaty za miejsca 5-8 po finałach Play-offs
    if (activeTournament.name.includes("Play-offs")) {
        let sortedGDL = [...gdlTable].sort((a,b) => b.points - a.points || (b.legsWon - b.legsLost) - (a.legsWon - a.legsLost));
        Object.entries(GLOBAL_LEAGUE_PLACEMENT_PRIZES).forEach(([position, amount]) => {
            const row = sortedGDL[Number(position) - 1];
            if (row) awardPrizeMoney(row.player, amount, activeTournament.name);
        });
    }
    
    activeTournament = null; 
    tournamentBracket = []; // <--- CZYŚCI DRABINKĘ PO SYMULACJI
    saveGame(true);
    
    // Ukrywamy kafelek aktywnego turnieju, aktualizujemy dane i wracamy do Hubu
    let tileTour = document.getElementById('tile-tournament');
    if (tileTour) tileTour.style.display = 'none';
    
    updateHub();
    showScreen('screen-hub');
}

function simulateHeadlessTournament(prepareDraw, hasGroupStage = false) {
    const tournament = activeTournament;
    return runTournamentSimulation(async () => {
        const prepared = await runTournamentSimulationSteps(
            prepareDraw,
            hasGroupStage ? t('t-simulation-groups') : tournamentRound,
            hasGroupStage ? 48 : 0,
            () => {
                if (activeTournament !== tournament) throw new Error('Zmieniono turniej w trakcie przygotowania.');
            }
        );
        if (!prepared) throw new Error('Nie udało się przygotować turnieju.');
        // Dajemy interfejsowi pokazać drabinkę/postęp po przygotowaniu grup.
        await yieldTournamentSimulation();
        const outcome = await simulateTournamentRoundsInBatches(tournament);
        finishHeadlessTournament(outcome);
        return true;
    }, { onRestored: () => {
        const modal = document.getElementById('bracket-modal');
        if (modal) modal.style.display = 'none';
        if (typeof showScreen === 'function') showScreen('screen-hub');
    } });
}

async function runTournamentSimulation(operation, { onRestored = () => showBracket(), match = null } = {}) {
    if (isFastForwardingTournament || tournamentSimulationSaveBlocked || !activeTournament
        || (typeof currentMatch !== 'undefined' && currentMatch && currentMatch !== match)) return false;
    if (match && (currentMatch !== match || match.isFinishing)) return false;

    isFastForwardingTournament = true;
    if (match) { match.isFinishing = true; match.isTurnLocked = true; }
    const matchButtons = [];
    let releaseSaveBarrier;
    tournamentSimulationFinished = new Promise(resolve => { releaseSaveBarrier = resolve; });
    let unlockInterface = () => {};
    let checkpoint = null;
    let safeToSave = true;

    try {
        if (match) {
            for (const id of ['t-btn-sim-visit', 't-btn-sim-leg', 't-btn-sim-match', 'throw-btn']) {
                const button = document.getElementById(id);
                if (button) {
                    matchButtons.push({ button, disabled: button.disabled });
                    button.disabled = true;
                }
            }
        }
        setRemainingTournamentButtonsDisabled(true);
        unlockInterface = lockTournamentSimulationInterface();
        updateTournamentSimulationProgress(tournamentRound, 0, Math.ceil(tournamentBracket.length / 2));
        await yieldTournamentSimulation();
        // Starszy zapis ma referencje do zawodników: musi skończyć zapisywanie
        // przed pierwszą zmianą nagród. Nowe autosave'y czekają na barierze.
        if (typeof waitForCareerSaveWrites === 'function') await waitForCareerSaveWrites();
        checkpoint = await createTournamentSimulationCheckpoint({ cooperative: Boolean(match) });
        return await operation();
    } catch (error) {
        console.error('Nie udało się dokończyć symulacji turnieju.', error);
        if (checkpoint) {
            safeToSave = false;
            try {
                safeToSave = restoreGameState(checkpoint.state, false, { tournamentRollback: true });
                if (safeToSave && typeof applyCareerProfileMediaToPlayer === 'function') {
                    applyCareerProfileMediaToPlayer(checkpoint.media);
                }
                if (safeToSave) onRestored();
            } catch (restoreError) {
                safeToSave = false;
                console.error('Nie udało się przywrócić stanu sprzed symulacji.', restoreError);
            }
        }
        alert(t(safeToSave ? 't-simulation-error-restored' : 't-simulation-error-reload'));
        return false;
    } finally {
        tournamentSimulationSaveBlocked = !safeToSave;
        if (match) delete match.isFinishing;
        isFastForwardingTournament = false;
        releaseSaveBarrier(safeToSave);
        unlockInterface();
        setRemainingTournamentButtonsDisabled(false);
        matchButtons.forEach(({ button, disabled }) => {
            button.disabled = button.id === 'throw-btn' && currentMatch === match ? true : disabled;
        });
    }
}
