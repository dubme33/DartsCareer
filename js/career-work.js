const CAREER_WORK_MONTHLY_AMOUNT = 2000;
const CAREER_WORK_PENALTY = 20;

const CAREER_WORK_TEXT = Object.freeze({
    pl: {
        title: '💼 Praca i dart', label: 'Sposób utrzymania',
        job: 'Łączę grę z pracą', darts: 'Skupiam się na darcie',
        jobDetails: '+£2 000 miesięcznie · −20 energii i profesjonalizmu',
        dartsDetails: '−£2 000 miesięcznie · bez kar do energii i profesjonalizmu',
        settlementTitle: 'Miesięczne rozliczenie pracy i darta',
        jobSettlement: 'Wynagrodzenie z pracy: +£2 000.',
        dartsSettlement: 'Koszt skupienia się na darcie: −£2 000.'
    },
    en: {
        title: '💼 Work and darts', label: 'Career focus',
        job: 'Combine darts with a job', darts: 'Focus on darts',
        jobDetails: '+£2,000 per month · −20 energy and professionalism',
        dartsDetails: '−£2,000 per month · no energy or professionalism penalty',
        settlementTitle: 'Monthly work and darts settlement',
        jobSettlement: 'Income from work: +£2,000.',
        dartsSettlement: 'Cost of focusing on darts: −£2,000.'
    },
    de: {
        title: '💼 Arbeit und Darts', label: 'Karriereschwerpunkt',
        job: 'Darts und Beruf verbinden', darts: 'Auf Darts konzentrieren',
        jobDetails: '+£2.000 pro Monat · −20 Energie und Professionalität',
        dartsDetails: '−£2.000 pro Monat · keine Abzüge bei Energie und Professionalität',
        settlementTitle: 'Monatliche Abrechnung für Arbeit und Darts',
        jobSettlement: 'Einkommen aus Arbeit: +£2.000.',
        dartsSettlement: 'Kosten für die Konzentration auf Darts: −£2.000.'
    },
    nl: {
        title: '💼 Werk en darts', label: 'Carrièrekeuze',
        job: 'Darts combineren met werk', darts: 'Volledig focussen op darts',
        jobDetails: '+£2.000 per maand · −20 energie en professionaliteit',
        dartsDetails: '−£2.000 per maand · geen aftrek van energie of professionaliteit',
        settlementTitle: 'Maandelijkse afrekening voor werk en darts',
        jobSettlement: 'Inkomen uit werk: +£2.000.',
        dartsSettlement: 'Kosten om je op darts te richten: −£2.000.'
    }
});

function normalizeCareerWorkMode(value) {
    return value === 'job' ? 'job' : 'darts';
}

function getCareerWorkMode(candidate = typeof player !== 'undefined' ? player : null) {
    return normalizeCareerWorkMode(candidate?.careerWorkMode);
}

function getCareerWorkText() {
    return CAREER_WORK_TEXT[typeof currentLang === 'string' ? currentLang : 'en'] || CAREER_WORK_TEXT.en;
}

function getCareerEffectiveStamina(candidate = typeof player !== 'undefined' ? player : null) {
    const raw = Number(candidate?.stamina);
    const stamina = Number.isFinite(raw) ? raw : 100;
    return Math.max(0, Math.min(100, stamina - (getCareerWorkMode(candidate) === 'job' ? CAREER_WORK_PENALTY : 0)));
}

function getCareerWorkMonthlyAmount(candidate = typeof player !== 'undefined' ? player : null) {
    return getCareerWorkMode(candidate) === 'job' ? CAREER_WORK_MONTHLY_AMOUNT : -CAREER_WORK_MONTHLY_AMOUNT;
}

function refreshCareerWorkUI() {
    if (typeof document === 'undefined') return;
    const text = getCareerWorkText();
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };
    setText('career-work-existing-label', text.label);
    setText('career-work-custom-label', text.label);
    setText('career-work-title', text.title);
    setText('career-work-hub-label', text.label);
    for (const id of ['existing-career-work-mode', 'career-work-mode', 'hub-career-work-mode']) {
        const select = document.getElementById(id);
        if (!select) continue;
        for (const option of select.options || []) option.textContent = text[option.value];
    }
    const mode = getCareerWorkMode();
    const hubSelect = document.getElementById('hub-career-work-mode');
    if (hubSelect) hubSelect.value = mode;
    setText('career-work-current', text[`${mode}Details`]);
    for (const [selectId, hintId] of [
        ['existing-career-work-mode', 'career-work-existing-hint'],
        ['career-work-mode', 'career-work-custom-hint']
    ]) {
        const select = document.getElementById(selectId);
        if (select) setText(hintId, text[`${normalizeCareerWorkMode(select.value)}Details`]);
    }
}

function changeCareerWorkMode(value) {
    if (typeof player === 'undefined' || !player?.name) return false;
    player.careerWorkMode = normalizeCareerWorkMode(value);
    if (typeof updateHub === 'function') updateHub();
    else refreshCareerWorkUI();
    if (typeof saveGame === 'function') saveGame(true);
    return true;
}

function processCareerWorkMonth(candidate = typeof player !== 'undefined' ? player : null,
    date = typeof currentDate !== 'undefined' ? currentDate : null) {
    if (!candidate || !(date instanceof Date) || Number.isNaN(date.getTime()) || date.getDate() !== 1) return null;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (candidate.careerWorkLastSettlement === monthKey) return null;
    const mode = getCareerWorkMode(candidate);
    const amount = getCareerWorkMonthlyAmount(candidate);
    candidate.budget = (Number(candidate.budget) || 0) + amount;
    candidate.careerWorkLastSettlement = monthKey;
    if (typeof player !== 'undefined' && candidate === player && typeof addEmail === 'function') {
        const text = getCareerWorkText();
        addEmail(text.title, text.settlementTitle, `<p>${text[`${mode}Settlement`]}</p>`);
    }
    return { mode, amount, monthKey };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshCareerWorkUI);
    else refreshCareerWorkUI();
}
