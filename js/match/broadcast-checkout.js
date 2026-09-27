/* Read-only checkout suggestions for the television overlay. */
var matchBroadcastCheckout = (function () {
    'use strict';
    const finishes = [20, 16, 18, 12, 10, 8, 6, 4, 2, 1, 19, 17, 15, 14, 13, 11, 9, 7, 5, 3]
        .map(sector => ({ token: `D${sector}`, points: sector * 2 }));
    finishes.push({ token: 'BULL', points: 50 });
    const targets = [
        ...Array.from({ length: 20 }, (_, i) => ({ token: `T${20 - i}`, points: (20 - i) * 3 })),
        ...Array.from({ length: 20 }, (_, i) => ({ token: String(20 - i), points: 20 - i })),
        { token: '25', points: 25 },
        ...finishes
    ];
    // A perfect leg can still need two visits after its first three darts.
    // Cache every reachable double-out total, including gaps below the maximum.
    const nineDartFinishes = [new Set(), new Set(finishes.map(finish => finish.points))];
    const targetPoints = new Set(targets.map(target => target.points));
    for (let darts = 2; darts <= 6; darts++) {
        const totals = new Set(nineDartFinishes[darts - 1]);
        for (const total of nineDartFinishes[darts - 1]) {
            for (const points of targetPoints) totals.add(total + points);
        }
        nineDartFinishes.push(totals);
    }
    function value(token) {
        if (token === 'BULL') return 50;
        if (token === '25') return 25;
        const match = /^([TD]?)([1-9]|1\d|20)$/.exec(token);
        return match ? Number(match[2]) * (match[1] === 'T' ? 3 : match[1] === 'D' ? 2 : 1) : NaN;
    }
    function route(score, dartsLeft = 3) {
        if (!Number.isInteger(score) || score < 2 || score > 170
            || !Number.isInteger(dartsLeft) || dartsLeft < 1 || dartsLeft > 3) return [];
        const guide = typeof getCheckoutPath === 'function' ? getCheckoutPath(score) : '';
        const tokens = guide ? guide.split(/\s+/) : [];
        if (tokens.length && tokens.length <= dartsLeft
            && finishes.some(finish => finish.token === tokens[tokens.length - 1])
            && tokens.reduce((sum, token) => sum + value(token), 0) === score) return tokens;
        const direct = finishes.find(finish => finish.points === score);
        if (direct) return [direct.token];
        if (dartsLeft >= 2) {
            for (const finish of finishes) {
                const first = targets.find(target => target.points + finish.points === score);
                if (first) return [first.token, finish.token];
            }
        }
        if (dartsLeft === 3) {
            for (const finish of finishes) for (const first of targets) {
                const second = targets.find(target => first.points + target.points + finish.points === score);
                if (second) return [first.token, second.token, finish.token];
            }
        }
        return [];
    }
    function nineDartPossible(score, dartsThrownInLeg) {
        if (!Number.isInteger(score) || !Number.isInteger(dartsThrownInLeg)
            || dartsThrownInLeg < 3 || dartsThrownInLeg >= 9) return false;
        return nineDartFinishes[9 - dartsThrownInLeg].has(score);
    }
    return Object.freeze({ route, nineDartPossible });
})();
