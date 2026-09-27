// Separate proficiency for each double; never changes base Doubles or OVR.
const DOUBLE_TRAINING_CONFIG = Object.freeze({ max: 100, maxHitBonus: 10 });

function isDoubleTrainingSector(sector) {
    return Number.isInteger(sector) && sector >= 1 && sector <= 20;
}

function getDoubleTrainingValue(candidate, sector) {
    if (!isDoubleTrainingSector(sector) || !candidate?.doubleTraining
        || Array.isArray(candidate.doubleTraining)) return 0;
    const value = candidate.doubleTraining[sector];
    return typeof value === 'number' && Number.isFinite(value)
        ? Math.max(0, Math.min(DOUBLE_TRAINING_CONFIG.max, value)) : 0;
}

function initializeDoubleTraining(candidate) {
    if (!candidate) return;
    const state = {};
    for (let sector = 1; sector <= 20; sector++) {
        const value = getDoubleTrainingValue(candidate, sector);
        if (value > 0) state[sector] = value;
    }
    candidate.doubleTraining = state;
    return state;
}

function getDoubleTrainingHitBonus(targetSector, targetMult, candidate) {
    return targetMult === 2
        ? getDoubleTrainingValue(candidate, targetSector) / DOUBLE_TRAINING_CONFIG.max * DOUBLE_TRAINING_CONFIG.maxHitBonus : 0;
}

function getDoubleTrainingGain(sector) {
    const value = getDoubleTrainingValue(player, sector);
    const base = value >= 85 ? 4 : value >= 60 ? 7 : 12;
    const equipment = getTrainingEquipmentBonus();
    const staff = typeof getPlayerStaffTrainingBonus === 'function' ? getPlayerStaffTrainingBonus('doubles') : 0;
    const analysis = typeof getCareerAnalysisTrainingBonus === 'function' ? getCareerAnalysisTrainingBonus(player) : 0;
    const rawProf = typeof getPlayerProfessionalism === 'function' ? getPlayerProfessionalism() : Number(player.prof);
    const prof = Number.isFinite(rawProf) ? Math.max(0, Math.min(100, rawProf)) : 50;
    const gain = Math.max(1, base + Math.random() * 4 - 2) * (0.8 + prof / 250)
        * (1 + equipment / 100) * (1 + staff / 100) * (1 + analysis / 100);
    return typeof scalePlayerDevelopmentChange === 'function' ? scalePlayerDevelopmentChange(player, gain) : gain;
}

function awardDoubleTraining(candidate, sector, amount) {
    if (!candidate || !isDoubleTrainingSector(sector) || !Number.isFinite(amount) || amount <= 0) return 0;
    const before = getDoubleTrainingValue(candidate, sector);
    const state = initializeDoubleTraining(candidate);
    state[sector] = Math.min(DOUBLE_TRAINING_CONFIG.max, before + amount);
    return state[sector] - before;
}

const DOUBLE_TRAINING_TEXT = {
    pl: {
        title: 'Trening konkretnego doubla',
        description: 'Wybierz D1–D20 i rozwijaj jego wytrenowanie. Każde 10 punktów daje +1 p.p. szansy trafienia wyłącznie tego doubla, maksymalnie +10 p.p. przy 100/100.',
        sector: 'Wybierz double', proficiency: 'Wytrenowanie', bonus: 'Bonus za trening', chance: 'Szansa trafienia teraz',
        train: 'Trenuj {double} — 1 dzień', max: 'Sektor w pełni wytrenowany', unit: 'p.p.',
        session: 'Koszt: 20 energii i 1 dzień. Wspólny limit: 2 treningi tygodniowo.',
        rules: 'Postęp zwalnia od 60 i 85 punktów. Energia przed sesją, profesjonalizm, sprzęt, trener podwójnych, analiza i tempo rozwoju wpływają na efekty. Trening ogólnych podwójnych nadal rozwija bazową statystykę Doubles; trening sektora rozwija tylko wybrany double.',
        chanceNote: 'Szansa uwzględnia sprzęt, bieżące zmęczenie, ulubione double i trening sektora. W meczu zmieniają ją też forma, presja i grupowanie lotek. Bonusy sumują się; maksymalna szansa przy pełnym wytrenowaniu wynosi 67%.',
        summary: 'Trening {double}: +{gain} wytrenowania ({value}/100). Bonus trafienia: +{bonus} p.p.'
    },
    en: {
        title: 'Train a specific double',
        description: 'Choose D1–D20 and improve its proficiency. Every 10 points adds 1 percentage point to the chance of hitting only that double, up to +10 at 100/100.',
        sector: 'Choose a double', proficiency: 'Proficiency', bonus: 'Training bonus', chance: 'Current hit chance',
        train: 'Train {double} — 1 day', max: 'Sector fully trained', unit: 'pp',
        session: 'Cost: 20 stamina and 1 day. Shared limit: 2 training sessions per week.',
        rules: 'Progress slows at 60 and 85 points. Pre-session stamina, professionalism, equipment, the doubles coach, analysis and development rate affect gains. General doubles training still improves your base Doubles stat; sector training improves only the selected double.',
        chanceNote: 'Chance includes equipment, current fatigue, favourite doubles and sector training. Form, pressure and dart grouping also affect it in matches. Bonuses stack; the maximum chance with full proficiency is 67%.',
        summary: '{double} training: +{gain} proficiency ({value}/100). Hit bonus: +{bonus} pp.'
    },
    de: {
        title: 'Ein bestimmtes Doppel trainieren',
        description: 'Wähle D1–D20 und verbessere die Beherrschung. Je 10 Punkte erhöhen die Trefferchance nur dieses Doppels um 1 Prozentpunkt, bis zu +10 bei 100/100.',
        sector: 'Doppel wählen', proficiency: 'Beherrschung', bonus: 'Trainingsbonus', chance: 'Aktuelle Trefferchance',
        train: '{double} trainieren — 1 Tag', max: 'Sektor vollständig trainiert', unit: 'Prozentpunkte',
        session: 'Kosten: 20 Energie und 1 Tag. Gemeinsames Limit: 2 Einheiten pro Woche.',
        rules: 'Ab 60 und 85 Punkten wird der Fortschritt langsamer. Energie vor der Einheit, Professionalität, Ausrüstung, Doppeltrainer, Analyse und Entwicklungstempo beeinflussen den Zuwachs. Allgemeines Doppeltraining verbessert weiterhin den Basiswert Doubles; Sektortraining verbessert nur das gewählte Doppel.',
        chanceNote: 'Die Chance berücksichtigt Ausrüstung, aktuelle Müdigkeit, Lieblingsdoppel und Sektortraining. Im Match wirken auch Form, Druck und die Gruppierung der Darts. Boni addieren sich; bei voller Beherrschung beträgt die maximale Chance 67%.',
        summary: 'Training {double}: +{gain} Beherrschung ({value}/100). Trefferbonus: +{bonus} Prozentpunkte.'
    },
    nl: {
        title: 'Train een specifieke dubbel',
        description: 'Kies D1–D20 en verbeter je beheersing. Elke 10 punten geeft 1 procentpunt extra kans om alleen die dubbel te raken, tot +10 bij 100/100.',
        sector: 'Kies een dubbel', proficiency: 'Beheersing', bonus: 'Trainingsbonus', chance: 'Huidige trefkans',
        train: 'Train {double} — 1 dag', max: 'Sector volledig getraind', unit: 'procentpunten',
        session: 'Kosten: 20 stamina en 1 dag. Gezamenlijke limiet: 2 trainingen per week.',
        rules: 'Vooruitgang vertraagt vanaf 60 en 85 punten. Stamina vóór de sessie, professionaliteit, uitrusting, de doublescoach, analyse en ontwikkelingstempo beïnvloeden de winst. Algemene doublestraining verbetert nog steeds je basisstatistiek Doubles; sectortraining verbetert alleen de gekozen dubbel.',
        chanceNote: 'De kans omvat uitrusting, huidige vermoeidheid, favoriete dubbels en sectortraining. Vorm, druk en dartgroepering beïnvloeden deze ook tijdens wedstrijden. Bonussen tellen op; de maximale kans bij volledige beheersing is 67%.',
        summary: '{double}-training: +{gain} beheersing ({value}/100). Trefbonus: +{bonus} procentpunten.'
    }
};

function trDoubleTraining(key, values = {}) {
    const lang = typeof currentLang === 'string' ? currentLang : 'pl';
    let text = (DOUBLE_TRAINING_TEXT[lang] || DOUBLE_TRAINING_TEXT.en)[key] || key;
    for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
}

function formatDoubleTrainingNumber(value) {
    const lang = typeof currentLang === 'string' ? currentLang : 'pl';
    return value.toLocaleString({ pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' }[lang] || 'en-GB',
        { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function selectDoubleTrainingSector(sector) {
    if (!isDoubleTrainingSector(sector)) return;
    const select = document.getElementById('train-double-sector');
    if (select) select.value = String(sector);
    initTrainingLimit();
    renderDoubleTraining(TRAINING_CONFIG.weeklyLimit - player.trainingSessionsThisWeek);
}

function renderDoubleTraining(sessionsRemaining) {
    const root = document.getElementById('train-double-sectors');
    if (!root || typeof player === 'undefined' || !player) return;
    const previous = Number(document.getElementById('train-double-sector')?.value);
    const sector = isDoubleTrainingSector(previous) ? previous : 20;
    const value = getDoubleTrainingValue(player, sector);
    const bonus = getDoubleTrainingHitBonus(sector, 2, player);
    const unavailable = value >= DOUBLE_TRAINING_CONFIG.max || sessionsRemaining <= 0
        || getTrainingEnergyMultiplier() * 100 < TRAINING_CONFIG.staminaCost
        || (typeof isPlayerInjured === 'function' && isPlayerInjured(player))
        || (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy());
    const stats = getBoostedPlayerStats();
    const chance = getDoubleTargetHitChance(sector, stats);
    root.innerHTML = `<h3 id="train-double-sectors-title">${trDoubleTraining('title')}</h3>
        <p class="double-training-note">${trDoubleTraining('description')}</p>
        <label for="train-double-sector">${trDoubleTraining('sector')}</label>
        <select id="train-double-sector" onchange="selectDoubleTrainingSector(Number(this.value))">
            ${Array.from({ length: 20 }, (_, i) => i + 1).map(n => `<option value="${n}" ${n === sector ? 'selected' : ''}>D${n}</option>`).join('')}
        </select>
        <div class="double-training-grid" role="group" aria-label="${trDoubleTraining('sector')}">
            ${Array.from({ length: 20 }, (_, i) => i + 1).map(n => {
                const proficiency = getDoubleTrainingValue(player, n);
                return `<button type="button" class="double-training-sector" aria-pressed="${n === sector}"
                    aria-label="D${n}: ${formatDoubleTrainingNumber(proficiency)}/100" onclick="selectDoubleTrainingSector(${n})">
                    <strong>D${n}</strong><span>${formatDoubleTrainingNumber(proficiency)}/100</span>
                    <progress max="100" value="${proficiency}" aria-label="D${n}"></progress></button>`;
            }).join('')}
        </div>
        <div class="double-training-detail" aria-live="polite">
            <strong class="double-training-target">D${sector}</strong>
            <dl><div><dt>${trDoubleTraining('proficiency')}</dt><dd>${formatDoubleTrainingNumber(value)}/100</dd></div>
                <div><dt>${trDoubleTraining('bonus')}</dt><dd>+${formatDoubleTrainingNumber(bonus)} ${trDoubleTraining('unit')}</dd></div>
                <div><dt>${trDoubleTraining('chance')}</dt><dd>${formatDoubleTrainingNumber(chance)}%</dd></div></dl>
            <p class="double-training-note">${trDoubleTraining('session')}</p>
            <button type="button" class="action-btn green" id="train-double-sector-btn"
                onclick="performTraining('double-sector', ${sector})" ${unavailable ? 'disabled' : ''}>${trDoubleTraining(value >= 100 ? 'max' : 'train', { double: `D${sector}` })}</button>
        </div>
        <p class="double-training-note">${trDoubleTraining('chanceNote')}</p>
        <p class="double-training-note">${trDoubleTraining('rules')}</p>`;
    const select = document.getElementById('train-double-sector');
    if (select) select.value = String(sector);
}
