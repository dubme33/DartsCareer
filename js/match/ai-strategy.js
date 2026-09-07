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

// Trasy z tabeli rozpoczynające się od Bulla mają bezpieczniejszy wariant,
// gdy rywal nie czeka na checkout. Dla 82 treble jest lepszym celem także
// pod presją i zapobiega trasie 132 wymagającej dwóch kolejnych Bulli.
const AI_BULL_ROUTE_ALTERNATIVES = Object.freeze({
    82: { sector: 14, mult: 3 },
    132: { sector: 20, mult: 3 }
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
    if (score >= 2 && score <= 40 && score % 2 === 0) return { sector: score / 2, mult: 2 };
    return null;
}

function isAiCheckoutScore(score) {
    const normalizedScore = Math.floor(Number(score));
    return normalizedScore >= 2 && normalizedScore <= 170
        && Boolean(checkoutGuide[normalizedScore])
        && !AI_BOGEY_SCORES.has(normalizedScore);
}

function shouldAiAttackBull(opponentScore) {
    // Brak wyniku przeciwnika zachowuje zgodność niezależnych podglądów tras.
    if (opponentScore === undefined || opponentScore === null || opponentScore === '') return true;
    return isAiCheckoutScore(opponentScore);
}

function getOneDartSetupAim(score) {
    // Do 60 tabela rozpoczyna się od singla zostawiającego double.
    if (score <= 60) {
        const guideAim = getCheckoutGuideFirstAim(score);
        if (guideAim && guideAim.mult === 1) return guideAim;
    }

    // Przy wyższych wynikach celujemy w naturalny treble z trasy checkoutowej.
    // Dzięki temu 107 prowadzi przez T19 (S19 zostawia 88), zamiast sztucznego
    // S11 pozostawiającego 96. Dwie trasy zaczynające się od Bulla mają
    // wariant treblowy, bo jedną lotką i tak nie można nimi skończyć lega.
    const checkoutAim = getCheckoutGuideFirstAim(score);
    if (checkoutAim) return AI_BULL_ROUTE_ALTERNATIVES[score] || checkoutAim;

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
    if (AI_BOGEY_SETUP_AIMS[score]) return AI_BOGEY_SETUP_AIMS[score];

    // Ostatnią lotką wybieramy najwyższy treble, który nie pozostawia bogey.
    // Dla wyższych wyników nadal punktujemy możliwie wysoko, zamiast sztucznie
    // schodzić singlami do 160-170.
    const t20Leave = score - 60;
    if (dartsLeft === 1 && t20Leave <= 170 && !isAiCheckoutScore(t20Leave)) {
        for (let sector = 19; sector >= 10; sector--) {
            const leave = score - (sector * 3);
            if (leave > 170 || isAiCheckoutScore(leave)) {
                return { sector, mult: 3 };
            }
        }
    }

    return { sector: 20, mult: 3 };
}

function getOptimalAim(score, isDIDO, dartsLeft = 3, opponentScore) {
    const normalizedScore = Math.max(0, Math.floor(Number(score) || 0));
    const normalizedDartsLeft = Math.max(1, Math.min(3, Math.floor(Number(dartsLeft) || 1)));
    const attackBull = shouldAiAttackBull(opponentScore);

    if (isDIDO && normalizedScore === 501) return { sector: 20, mult: 2 };

    // 50 rozmieniamy na S10 -> D20, gdy mamy zapasową lotkę albo rywal nie
    // czeka na checkout. Bulla atakujemy ostatnią lotką głównie pod presją.
    if (normalizedScore === 50) {
        return normalizedDartsLeft > 1 || !attackBull
            ? { sector: 10, mult: 1 }
            : { sector: 25, mult: 2 };
    }

    const oneDartCheckout = getOneDartCheckoutAim(normalizedScore);
    if (oneDartCheckout) return oneDartCheckout;

    if (normalizedDartsLeft === 1) return getOneDartSetupAim(normalizedScore);

    // Pod presją wyniki 61-70 gramy przez treble (wynik - 50), dzięki czemu
    // trafiony single nadal zostawia Bulla. Bez presji wybieramy zwykłą trasę
    // z preferowanym double, bo ostatnią lotką i tak nie będziemy atakować 50.
    if (normalizedDartsLeft === 2 && normalizedScore >= 61 && normalizedScore <= 70) {
        return attackBull
            ? { sector: normalizedScore - 50, mult: 3 }
            : getCheckoutGuideFirstAim(normalizedScore);
    }

    const maximumCheckout = normalizedDartsLeft === 2 ? 110 : 170;
    if (normalizedScore <= maximumCheckout && checkoutGuide[normalizedScore]) {
        const checkoutAim = getCheckoutGuideFirstAim(normalizedScore);
        if (checkoutAim?.sector === 25 && AI_BULL_ROUTE_ALTERNATIVES[normalizedScore]
            && (!attackBull || normalizedScore === 82)) {
            return AI_BULL_ROUTE_ALTERNATIVES[normalizedScore];
        }
        return checkoutAim;
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

function getAiScoringAim(score, isDIDO, dartsLeft, visit, opponentScore) {
    const aim = getOptimalAim(score, isDIDO, dartsLeft, opponentScore);
    // Checkouty, podwójne otwierające i konkretne ustawienia mają pierwszeństwo
    // przed zmianą sektora. Pierwsza lotka nie ma jeszcze czego omijać.
    if (dartsLeft >= 3 || score <= 170 || aim.mult !== 3
        || !visit?.blockedTriples?.includes(aim.sector)) return aim;
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
