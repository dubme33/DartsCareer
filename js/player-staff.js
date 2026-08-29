// Fixed fictional candidates: browsing the market never consumes simulation RNG.
const PLAYER_STAFF_CONFIG = Object.freeze({ slots: 3 });
// Costs are a recurring career expense. Managers have lower salaries because
// their only benefit is a small percentage of regular sponsor income.
const PLAYER_STAFF_CANDIDATES = Object.freeze([
    { id: 'scoring-1', role: 'scoring', name: 'Adam Lis', level: 1, bonus: 5, signingFee: 6000, salary: 2000 },
    { id: 'scoring-2', role: 'scoring', name: 'Kamil Wrona', level: 2, bonus: 10, signingFee: 18000, salary: 5000 },
    { id: 'scoring-3', role: 'scoring', name: 'Oliver Reed', level: 3, bonus: 15, signingFee: 45000, salary: 10000 },
    { id: 'doubles-1', role: 'doubles', name: 'Ewa Nowak', level: 1, bonus: 5, signingFee: 6000, salary: 2000 },
    { id: 'doubles-2', role: 'doubles', name: 'Sophie Clark', level: 2, bonus: 10, signingFee: 18000, salary: 5000 },
    { id: 'doubles-3', role: 'doubles', name: 'Daniel Hayes', level: 3, bonus: 15, signingFee: 45000, salary: 10000 },
    { id: 'fitness-1', role: 'fitness', name: 'Paweł Mazur', level: 1, bonus: 5, signingFee: 6000, salary: 2000 },
    { id: 'fitness-2', role: 'fitness', name: 'Alice Morgan', level: 2, bonus: 10, signingFee: 18000, salary: 5000 },
    { id: 'fitness-3', role: 'fitness', name: 'Jonas Berg', level: 3, bonus: 15, signingFee: 45000, salary: 10000 },
    { id: 'psychologist-1', role: 'psychologist', name: 'Anna Sokołowska', level: 1, bonus: 5, signingFee: 6000, salary: 2000 },
    { id: 'psychologist-2', role: 'psychologist', name: 'James Walker', level: 2, bonus: 10, signingFee: 18000, salary: 5000 },
    { id: 'psychologist-3', role: 'psychologist', name: 'Sofia Lind', level: 3, bonus: 15, signingFee: 45000, salary: 10000 },
    { id: 'physio-1', role: 'physio', name: 'Marta Wilk', level: 1, bonus: 1, signingFee: 4500, salary: 1500 },
    { id: 'physio-2', role: 'physio', name: 'Tom Bennett', level: 2, bonus: 2, signingFee: 13500, salary: 3500 },
    { id: 'physio-3', role: 'physio', name: 'Lena Fischer', level: 3, bonus: 3, signingFee: 33000, salary: 7500 },
    { id: 'manager-1', role: 'manager', name: 'Piotr Zieliński', level: 1, bonus: 3, signingFee: 9000, salary: 400 },
    { id: 'manager-2', role: 'manager', name: 'Emma Collins', level: 2, bonus: 5, signingFee: 25000, salary: 1000 },
    { id: 'manager-3', role: 'manager', name: 'Victor Laurent', level: 3, bonus: 8, signingFee: 60000, salary: 2000 }
].map(candidate => Object.freeze(candidate)));

function getPlayerStaffCandidate(id) {
    return PLAYER_STAFF_CANDIDATES.find(candidate => candidate.id === id) || null;
}

function playerStaffDateKey(date = currentDate) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parsePlayerStaffDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return playerStaffDateKey(date) === value ? date : null;
}

function getPlayerStaffNextPayDate(contract) {
    const paid = parsePlayerStaffDate(contract?.lastPaidOn);
    const signed = parsePlayerStaffDate(contract?.signedOn);
    if (!paid || !signed) return null;
    // Always anchor to the signing day: 31 Jan -> 28/29 Feb -> 31 Mar.
    const monthEnd = new Date(paid.getFullYear(), paid.getMonth() + 2, 0).getDate();
    return playerStaffDateKey(new Date(paid.getFullYear(), paid.getMonth() + 1, Math.min(signed.getDate(), monthEnd)));
}

function getPlayerStaffState() {
    const state = { version: 1, contracts: [] };
    if (typeof player === 'undefined' || !player) return state;
    const raw = player.staff;
    if (raw?.version !== 1 || !Array.isArray(raw.contracts)) return state;
    const today = playerStaffDateKey();
    const roles = new Set();
    for (const saved of raw.contracts) {
        const candidate = getPlayerStaffCandidate(saved?.candidateId);
        if (!candidate || roles.has(candidate.role) || state.contracts.length >= PLAYER_STAFF_CONFIG.slots) continue;
        if (!parsePlayerStaffDate(saved.signedOn) || !parsePlayerStaffDate(saved.lastPaidOn)
            || saved.signedOn > saved.lastPaidOn || saved.lastPaidOn > today) continue;
        roles.add(candidate.role);
        state.contracts.push({ candidateId: candidate.id, signedOn: saved.signedOn, lastPaidOn: saved.lastPaidOn });
    }
    return state;
}

function initializePlayerStaff(reset = false) {
    if (typeof player === 'undefined' || !player) return;
    player.staff = reset ? { version: 1, contracts: [] } : getPlayerStaffState();
    return player.staff;
}

function restorePlayerStaff() {
    // Loading and rendering never bill the player. Dates in the save prevent a
    // second payment; an overdue contract has no bonus until the next settlement.
    return initializePlayerStaff();
}

function getActivePlayerStaff() {
    const today = playerStaffDateKey();
    return getPlayerStaffState().contracts
        .filter(contract => getPlayerStaffNextPayDate(contract) > today)
        .map(contract => getPlayerStaffCandidate(contract.candidateId));
}

function getPlayerStaffBonus(role) {
    return getActivePlayerStaff().find(candidate => candidate.role === role)?.bonus || 0;
}

function getPlayerStaffTrainingBonus(type) {
    if (type === 'mental') return getPlayerStaffBonus('psychologist');
    if (type === 'endurance') return getPlayerStaffBonus('fitness');
    return type === 'scoring' || type === 'doubles' ? getPlayerStaffBonus(type) : 0;
}

function getPlayerStaffRecoveryBonus(candidate) {
    return typeof player !== 'undefined' && candidate === player ? getPlayerStaffBonus('physio') : 0;
}

function getPlayerStaffSponsorBonus(regularPayment) {
    const payment = Number(regularPayment);
    return Number.isFinite(payment) && payment > 0 ? Math.round(payment * getPlayerStaffBonus('manager') / 100) : 0;
}

function getPlayerStaffHireStatus(id) {
    const candidate = getPlayerStaffCandidate(id);
    if (!candidate || typeof player === 'undefined' || !player) return 'unavailable';
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return 'busy';
    const contracts = getPlayerStaffState().contracts;
    if (contracts.some(contract => contract.candidateId === id)) return 'employed';
    if (contracts.some(contract => getPlayerStaffCandidate(contract.candidateId).role === candidate.role)) return 'roleTaken';
    if (contracts.length >= PLAYER_STAFF_CONFIG.slots) return 'full';
    if (!Number.isFinite(Number(player.budget)) || Number(player.budget) < candidate.signingFee + candidate.salary) return 'funds';
    return 'available';
}

function commitPlayerStaffChange() {
    if (typeof updateHub === 'function') updateHub();
    if (typeof refreshPlayerStaffViews === 'function') refreshPlayerStaffViews();
    if (typeof saveGame === 'function') saveGame(true);
}

function hirePlayerStaff(id) {
    if (getPlayerStaffHireStatus(id) !== 'available') return false;
    const candidate = getPlayerStaffCandidate(id);
    const state = initializePlayerStaff();
    const today = playerStaffDateKey();
    const contract = { candidateId: id, signedOn: today, lastPaidOn: today };
    player.budget = Number(player.budget) - candidate.signingFee - candidate.salary;
    state.contracts.push(contract);
    if (typeof notifyPlayerStaffEvent === 'function') notifyPlayerStaffEvent('hired', { candidate, contract });
    commitPlayerStaffChange();
    return true;
}

function dismissPlayerStaff(id) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (typeof player === 'undefined' || !player) return false;
    const state = getPlayerStaffState();
    const index = state.contracts.findIndex(contract => contract.candidateId === id);
    if (index < 0) return false;
    state.contracts.splice(index, 1);
    player.staff = state;
    if (typeof notifyPlayerStaffEvent === 'function') notifyPlayerStaffEvent('dismissed', { candidate: getPlayerStaffCandidate(id) });
    commitPlayerStaffChange();
    return true;
}

function processPlayerStaffPayroll() {
    const result = { changed: false, total: 0, paid: [], ended: [] };
    if (typeof player === 'undefined' || !player
        || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy())) return result;
    const state = getPlayerStaffState();
    const today = playerStaffDateKey();
    // Settle oldest due payments first; ties keep the hiring order. This also
    // handles an imported overdue save without silently granting free months.
    while (true) {
        const due = state.contracts.map(contract => ({ contract, date: getPlayerStaffNextPayDate(contract) }))
            .filter(item => item.date <= today).sort((a, b) => a.date.localeCompare(b.date))[0];
        if (!due) break;
        result.changed = true;
        const candidate = getPlayerStaffCandidate(due.contract.candidateId);
        if (Number.isFinite(Number(player.budget)) && Number(player.budget) >= candidate.salary) {
            player.budget = Number(player.budget) - candidate.salary;
            due.contract.lastPaidOn = due.date;
            result.total += candidate.salary;
            result.paid.push({ candidate, date: due.date });
        } else {
            state.contracts = state.contracts.filter(contract => contract !== due.contract);
            result.ended.push({ candidate, date: due.date });
        }
    }
    if (result.changed) {
        player.staff = state;
        if (typeof notifyPlayerStaffEvent === 'function') notifyPlayerStaffEvent('payroll', result);
    }
    // advanceDay saves after attaching that day's tournament, never mid-transition.
    return result;
}
