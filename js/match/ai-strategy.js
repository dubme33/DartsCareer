// Wyniki poniżej 170, których nie da się zamknąć w trzech lotkach.
const AI_BOGEY_SCORES = new Set([169, 168, 166, 165, 163, 162, 159]);

// Na tych wynikach zejście z T20 jest świadomym ustawieniem kolejnej wizyty.
const AI_BOGEY_SETUP_AIMS = Object.freeze({
    169: { sector: 19, mult: 3 },
    168: { sector: 20, mult: 3 },
    166: { sector: 19, mult: 3 },
    165: { sector: 19, mult: 3 },
    163: { sector: 19, mult: 3 },
    162: { sector: 18, mult: 3 },
    159: { sector: 19, mult: 3 }
});

// Ustawienia wysokich wyników zależne od liczby lotek pozostałych w podejściu.
const HIGH_SCORE_SETUP_AIMS = Object.freeze({
    '233:3': { sector: 19, mult: 1 }, '214:2': { sector: 19, mult: 1 }, '195:1': { sector: 25, mult: 1 },
    '259:3': { sector: 19, mult: 1 }, '240:2': { sector: 20, mult: 1 }, '220:1': { sector: 20, mult: 3 },
    '265:3': { sector: 19, mult: 1 }, '246:2': { sector: 19, mult: 1 },
    '269:3': { sector: 19, mult: 1 }, '250:2': { sector: 20, mult: 3 }, '190:1': { sector: 20, mult: 1 },
    '302:3': { sector: 18, mult: 1 }, '284:2': { sector: 20, mult: 3 }, '224:1': { sector: 20, mult: 3 },
    '303:3': { sector: 19, mult: 3 },
    '305:3': { sector: 18, mult: 1 }, '287:2': { sector: 20, mult: 3 }, '227:1': { sector: 20, mult: 3 },
    '306:3': { sector: 19, mult: 1 },
    '308:3': { sector: 18, mult: 1 }, '290:2': { sector: 20, mult: 3 }, '230:1': { sector: 20, mult: 3 },
    '309:3': { sector: 19, mult: 1 }
});

function parseAiAimToken(token) {
    if (!token) return null;
    if (token === 'BULL') return { sector: 25, mult: 2 };

    const multiplier = token.startsWith('T') ? 3 : token.startsWith('D') ? 2 : 1;
    const sector = Number.parseInt(token.replace(/^[TD]/, ''), 10);
    return Number.isFinite(sector) ? { sector, mult: multiplier } : null;
}

function getCheckoutGuideFirstAim(score) {
    const route = checkoutGuide[score];
    return route ? parseAiAimToken(route.split(' ')[0]) : null;
}

function getOneDartCheckoutAim(score) {
    if (score === 50) return { sector: 25, mult: 2 };
    if (score >= 2 && score <= 40 && score % 2 === 0) return { sector: score / 2, mult: 2 };
    return null;
}

function getHighScoreSetupAim(score, dartsLeft) {
    return HIGH_SCORE_SETUP_AIMS[`${score}:${dartsLeft}`] || null;
}

function getOneDartSetupAim(score) {
    // Do 60 tabela rozpoczyna się od singla zostawiającego double.
    if (score <= 60) {
        const guideAim = getCheckoutGuideFirstAim(score);
        if (guideAim && guideAim.mult === 1) return guideAim;
    }

    // Preferowane doubles lub Bull na następną wizytę. Outer Bull daje
    // ustawienie 61 -> 36, a przy 62-70 odpowiedni single zostawia 50.
    const preferredLeaves = [40, 32, 36, 24, 20, 16, 50, 60, 56, 52, 48, 44, 64, 72, 80, 96, 100];
    const setupTargets = [
        { sector: 25, mult: 1, points: 25 },
        ...Array.from({ length: 20 }, (_, index) => ({ sector: 20 - index, mult: 1, points: 20 - index }))
    ];

    for (const leave of preferredLeaves) {
        const target = setupTargets.find(candidate => score - candidate.points === leave);
        if (target) return { sector: target.sector, mult: target.mult };
    }

    return getScoringSetupAim(score, 1);
}

function getScoringSetupAim(score, dartsLeft) {
    const exactSetup = getHighScoreSetupAim(score, dartsLeft);
    if (exactSetup) return exactSetup;

    if (AI_BOGEY_SETUP_AIMS[score]) return AI_BOGEY_SETUP_AIMS[score];

    // Ostatnią lotką nie zostawiamy bogey number. Schodzimy kolejno na
    // T19, T18, T17 itd., aż następna wizyta ponownie ma checkout.
    if (dartsLeft === 1 && AI_BOGEY_SCORES.has(score - 60)) {
        for (let sector = 19; sector >= 10; sector--) {
            const leave = score - (sector * 3);
            if (leave > 170 || (checkoutGuide[leave] && !AI_BOGEY_SCORES.has(leave))) {
                return { sector, mult: 3 };
            }
        }
    }

    return { sector: 20, mult: 3 };
}

function getOptimalAim(score, isDIDO, dartsLeft = 3) {
    const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
    const normalizedDartsLeft = Math.max(1, Math.min(3, Math.floor(Number(dartsLeft) || 1)));

    if (isDIDO && normalizedScore === 501) return { sector: 20, mult: 2 };

    // Mając zapasową lotkę, 50 rozmieniamy na S10 -> D20 zamiast od razu
    // podejmować trudniejszą próbę na środku tarczy.
    if (normalizedScore === 50 && normalizedDartsLeft > 1) return { sector: 10, mult: 1 };

    const oneDartCheckout = getOneDartCheckoutAim(normalizedScore);
    if (oneDartCheckout) return oneDartCheckout;

    if (normalizedDartsLeft === 1) return getOneDartSetupAim(normalizedScore);

    // Z dwiema lotkami wyniki 61-70 gramy przez treble (wynik - 50).
    // Treble zostawia zwykły double, a single nadal daje szansę na Bulla.
    if (normalizedDartsLeft === 2 && normalizedScore >= 61 && normalizedScore <= 70) {
        return { sector: normalizedScore - 50, mult: 3 };
    }

    const maximumCheckout = normalizedDartsLeft === 2 ? 110 : 170;
    if (normalizedScore <= maximumCheckout && checkoutGuide[normalizedScore]) {
        return getCheckoutGuideFirstAim(normalizedScore);
    }

    return getScoringSetupAim(normalizedScore, normalizedDartsLeft);
}

function createAiScoringVisit() {
    return { blockedTriples: [], dartsThrown: 0 };
}

function getAiScoringVisit(match, isP1) {
    const side = isP1 ? 'p1' : 'p2';
    let visit = match.aiScoringVisit;
    // Lotki są wyjmowane po podejściu. Nie przenosimy przesłony między
    // zawodnikami, partnerami deblowymi, legami ani do kolejnej wizyty.
    if (!visit || visit.side !== side || match.dartsThrown === 0 || visit.dartsThrown > match.dartsThrown) {
        visit = match.aiScoringVisit = { ...createAiScoringVisit(), side };
    }
    return visit;
}

function getAiScoringAim(score, isDIDO, dartsLeft, visit) {
    const aim = getOptimalAim(score, isDIDO, dartsLeft);
    // Checkouty, podwójne otwierające i konkretne ustawienia mają pierwszeństwo
    // przed zmianą sektora. Pierwsza lotka nie ma jeszcze czego omijać.
    if (dartsLeft >= 3 || score <= 170 || aim.mult !== 3
        || getHighScoreSetupAim(score, dartsLeft) || !visit?.blockedTriples?.includes(aim.sector)) return aim;
    const hasCheckout = leave => Boolean(checkoutGuide[leave]) && !AI_BOGEY_SCORES.has(leave);
    const originalLeave = score - aim.sector * 3;
    for (const sector of [20, 19, 18, 17]) {
        if (visit.blockedTriples.includes(sector)) continue;
        const leave = score - sector * 3;
        if (leave < 2 || AI_BOGEY_SCORES.has(leave)) continue;
        if (dartsLeft === 1) {
            if (hasCheckout(originalLeave) && !hasCheckout(leave)) continue;
            // Także trafienie singla powinno zostawić rozsądny wynik. Np. na
            // 181 T19/S19 i T18/S18 grożą bogey; wolne T17 zostawia 130/164.
            if (AI_BOGEY_SCORES.has(score - sector)) continue;
        }
        return { sector, mult: 3 };
    }
    return aim;
}

function recordAiScoringObstruction(visit, aim, result, dartsLeft, random = Math.random) {
    if (!visit) return;
    visit.dartsThrown++;
    if (dartsLeft <= 1 || aim?.mult !== 3 || ![20, 19, 18, 17].includes(aim.sector)
        || result?.sector !== aim.sector || ![1, 3].includes(result.mult)
        || visit.blockedTriples.includes(aim.sector)) return;
    // Modelujemy kąt wbicia i lotkę blisko drutu, nie sam fakt trafienia T20.
    // Dobry treble zwykle jest markerem i nadal pozwala rzucić 180. Single
    // po próbie treble częściej zasłania mały sektor. Bez kary do celności/OVR.
    const obstructionChance = result.mult === 1 ? 0.24 : 0.04;
    if (random() < obstructionChance) visit.blockedTriples.push(aim.sector);
}
