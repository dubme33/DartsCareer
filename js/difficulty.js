const CAREER_DIFFICULTY_PROFILES = Object.freeze({
    easy: Object.freeze({ growth: 1.25, decline: 0.75, sponsors: 1.25, prizeTax: 0 }),
    normal: Object.freeze({ growth: 1, decline: 1, sponsors: 1, prizeTax: 0 }),
    hard: Object.freeze({ growth: 0.75, decline: 1.25, sponsors: 0.75, prizeTax: 0.3 })
});

const CAREER_DIFFICULTY_TEXT = Object.freeze({
    pl: {
        label: 'Poziom trudności:', tileTitle: '🎚️ Poziom trudności', tileIntro: 'Możesz go zmienić w dowolnym momencie kariery.',
        easy: 'Łatwy', normal: 'Normalny', hard: 'Trudny',
        easyDetails: 'Rozwój OVR +25% · spadki −25% · sponsorzy +25%',
        normalDetails: 'Dotychczasowy balans rozwoju, spadków i sponsorów',
        hardDetails: 'Rozwój OVR −25% · spadki +25% · sponsorzy −25% · podatek od nagród turniejowych 30%'
    },
    en: {
        label: 'Difficulty:', tileTitle: '🎚️ Difficulty', tileIntro: 'You can change it at any point in your career.',
        easy: 'Easy', normal: 'Normal', hard: 'Hard',
        easyDetails: 'OVR growth +25% · declines −25% · sponsors +25%',
        normalDetails: 'The existing balance for growth, declines and sponsors',
        hardDetails: 'OVR growth −25% · declines +25% · sponsors −25% · tournament prize tax 30%'
    },
    de: {
        label: 'Schwierigkeitsgrad:', tileTitle: '🎚️ Schwierigkeitsgrad', tileIntro: 'Du kannst ihn jederzeit in deiner Karriere ändern.',
        easy: 'Leicht', normal: 'Normal', hard: 'Schwer',
        easyDetails: 'OVR-Entwicklung +25% · Rückgänge −25% · Sponsoren +25%',
        normalDetails: 'Bisherige Balance bei Entwicklung, Rückgängen und Sponsoren',
        hardDetails: 'OVR-Entwicklung −25% · Rückgänge +25% · Sponsoren −25% · Steuer auf Turnierpreisgeld 30%'
    },
    nl: {
        label: 'Moeilijkheid:', tileTitle: '🎚️ Moeilijkheid', tileIntro: 'Je kunt dit op elk moment in je carrière wijzigen.',
        easy: 'Makkelijk', normal: 'Normaal', hard: 'Moeilijk',
        easyDetails: 'OVR-groei +25% · dalingen −25% · sponsors +25%',
        normalDetails: 'De bestaande balans voor groei, dalingen en sponsors',
        hardDetails: 'OVR-groei −25% · dalingen +25% · sponsors −25% · belasting op toernooiprijzen 30%'
    }
});

function normalizeCareerDifficulty(value) {
    return Object.prototype.hasOwnProperty.call(CAREER_DIFFICULTY_PROFILES, value) ? value : 'normal';
}

function getCareerDifficulty(candidate = typeof player !== 'undefined' ? player : null) {
    return normalizeCareerDifficulty(candidate?.difficulty);
}

function getCareerDifficultyProfile(candidate = typeof player !== 'undefined' ? player : null) {
    return CAREER_DIFFICULTY_PROFILES[getCareerDifficulty(candidate)];
}

function isCareerDifficultyPlayer(candidate) {
    if (!candidate || typeof player === 'undefined' || !player) return false;
    if (candidate === player) return true;
    if (typeof isCurrentPlayer === 'function') return isCurrentPlayer(candidate);
    return Boolean(candidate.id && player.id && candidate.id === player.id);
}

function getCareerDifficultyDevelopmentMultiplier(candidate, change) {
    if (!isCareerDifficultyPlayer(candidate)) return 1;
    const profile = getCareerDifficultyProfile(player);
    return Number(change) < 0 ? profile.decline : profile.growth;
}

function getCareerDifficultySponsorMultiplier(candidate = typeof player !== 'undefined' ? player : null) {
    return getCareerDifficultyProfile(candidate).sponsors;
}

function getCareerDifficultyTournamentPrizeTaxRate(candidate = typeof player !== 'undefined' ? player : null) {
    return isCareerDifficultyPlayer(candidate) ? getCareerDifficultyProfile(player).prizeTax : 0;
}

function getCareerDifficultyText() {
    const language = typeof currentLang === 'string' ? currentLang : 'pl';
    return CAREER_DIFFICULTY_TEXT[language] || CAREER_DIFFICULTY_TEXT.en;
}

function getSelectedCareerDifficulty(source = 'custom') {
    if (typeof document === 'undefined') return 'normal';
    const id = source === 'existing' ? 'existing-career-difficulty' : 'career-difficulty';
    return normalizeCareerDifficulty(document.getElementById(id)?.value);
}

function refreshCareerDifficultyUI() {
    if (typeof document === 'undefined') return;
    const text = getCareerDifficultyText();
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText('career-difficulty-label', text.label);
    setText('existing-career-difficulty-label', text.label);
    setText('career-difficulty-hub-label', text.label);
    setText('career-difficulty-title', text.tileTitle);
    setText('career-difficulty-intro', text.tileIntro);

    document.querySelectorAll('[data-career-difficulty-option]').forEach(option => {
        const difficulty = normalizeCareerDifficulty(option.value);
        option.textContent = text[difficulty];
    });

    for (const [selectId, hintId] of [
        ['career-difficulty', 'career-difficulty-hint'],
        ['existing-career-difficulty', 'existing-career-difficulty-hint']
    ]) {
        const select = document.getElementById(selectId);
        if (select) setText(hintId, text[`${normalizeCareerDifficulty(select.value)}Details`]);
    }

    const hubSelect = document.getElementById('hub-career-difficulty');
    if (hubSelect) hubSelect.value = getCareerDifficulty();
    setText('career-difficulty-current', text[`${getCareerDifficulty()}Details`]);
}

function syncCareerDifficultyInputs(value) {
    const difficulty = normalizeCareerDifficulty(value);
    if (typeof document !== 'undefined') {
        ['career-difficulty', 'existing-career-difficulty'].forEach(id => {
            const select = document.getElementById(id);
            if (select) select.value = difficulty;
        });
    }
    refreshCareerDifficultyUI();
    return difficulty;
}

function getDifficultySponsorContracts(candidate) {
    const contracts = Array.isArray(candidate?.activeSponsors) ? [...candidate.activeSponsors] : [];
    if (candidate?.technicalPartner) contracts.push(candidate.technicalPartner);
    return contracts.filter(contract => contract && Number.isFinite(Number(contract.monthlyValue)));
}

function initializeCareerDifficulty(candidate = typeof player !== 'undefined' ? player : null) {
    if (!candidate) return 'normal';
    candidate.difficulty = getCareerDifficulty(candidate);
    const sponsorMultiplier = getCareerDifficultySponsorMultiplier(candidate);
    getDifficultySponsorContracts(candidate).forEach(contract => {
        if (!Number.isFinite(Number(contract.difficultyBaseMonthlyValue))) {
            contract.difficultyBaseMonthlyValue = Number(contract.monthlyValue) / sponsorMultiplier;
        }
    });
    const goals = Array.isArray(candidate.sponsorGoals?.goals) ? candidate.sponsorGoals.goals : [];
    goals.filter(goal => goal?.status === 'pending' && Number.isFinite(Number(goal.bonus))).forEach(goal => {
        if (!Number.isFinite(Number(goal.difficultyBaseBonus))) {
            goal.difficultyBaseBonus = Number(goal.bonus) / sponsorMultiplier;
        }
    });
    if (typeof player !== 'undefined' && candidate === player) refreshCareerDifficultyUI();
    return candidate.difficulty;
}

function rescaleCareerDifficultySponsors(candidate, previousDifficulty, nextDifficulty) {
    const previousMultiplier = CAREER_DIFFICULTY_PROFILES[previousDifficulty].sponsors;
    const nextMultiplier = CAREER_DIFFICULTY_PROFILES[nextDifficulty].sponsors;
    getDifficultySponsorContracts(candidate).forEach(contract => {
        const savedBase = Number(contract.difficultyBaseMonthlyValue);
        const baseValue = Number.isFinite(savedBase) ? savedBase : Number(contract.monthlyValue) / previousMultiplier;
        contract.difficultyBaseMonthlyValue = baseValue;
        contract.monthlyValue = Math.max(0, Math.round(baseValue * nextMultiplier));
    });
    const goals = Array.isArray(candidate.sponsorGoals?.goals) ? candidate.sponsorGoals.goals : [];
    goals.filter(goal => goal?.status === 'pending' && Number.isFinite(Number(goal.bonus))).forEach(goal => {
        const savedBase = Number(goal.difficultyBaseBonus);
        const baseValue = Number.isFinite(savedBase) ? savedBase : Number(goal.bonus) / previousMultiplier;
        goal.difficultyBaseBonus = baseValue;
        goal.bonus = Math.max(10, Math.round(baseValue * nextMultiplier / 10) * 10);
    });
}

function setCareerDifficulty(value, options = {}) {
    if (typeof player === 'undefined' || !player || !player.name) return false;
    const nextDifficulty = normalizeCareerDifficulty(value);
    const previousDifficulty = initializeCareerDifficulty(player);
    if (nextDifficulty === previousDifficulty) {
        refreshCareerDifficultyUI();
        return true;
    }

    rescaleCareerDifficultySponsors(player, previousDifficulty, nextDifficulty);
    player.difficulty = nextDifficulty;
    if (typeof resetSponsorOffers === 'function') resetSponsorOffers();
    refreshCareerDifficultyUI();
    if (typeof updateHubOverview === 'function') updateHubOverview();
    if (options.save !== false && typeof saveGame === 'function') saveGame(true);
    return true;
}

function changeCareerDifficulty(value) {
    return setCareerDifficulty(value);
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshCareerDifficultyUI);
    else refreshCareerDifficultyUI();
}
