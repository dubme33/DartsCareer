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
        if (!Number.isInteger(dartsThrownInLeg) || dartsThrownInLeg < 6 || dartsThrownInLeg >= 9) return false;
        return route(score, Math.min(3, 9 - dartsThrownInLeg)).length > 0;
    }
    return Object.freeze({ route, nineDartPossible });
})();
