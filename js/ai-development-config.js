// Permanent AI development. Attribute version stays at 1 so existing talent is preserved.
const AI_DEVELOPMENT_FOUNDATION_CONFIG = Object.freeze({
    version: 1, configVersion: 'foundation-final-1',
    potential: Object.freeze({
        min: 40, max: 99, minimumGenerated: 58, ratingReference: 62, ratingRange: 12, ratingBias: 0.35,
        bands: Object.freeze([
            { min: 58, max: 79, weight: 70 }, { min: 80, max: 84, weight: 18 },
            { min: 85, max: 89, weight: 9 }, { min: 90, max: 94, weight: 2.8 },
            { min: 95, max: 99, weight: 0.2 }
        ])
    }),
    developmentRate: Object.freeze({ min: 0.65, max: 1.35 }),
    maturation: Object.freeze({ strength: 2.6, max: 2.6, ageMidpoint: 28, ageWidth: 3,
        headroomWidth: 2, headroomScale: 6, minimumMatches: 6, fullExposureMatches: 20 }),
    performance: Object.freeze({ maxChange: 10, fullWeight: 60, minimumMatches: 12, growthMultiplier: 1.05,
        prestigeSymmetric: 1, lateDamping: 1, lateMidpoint: 35, lateWidth: 4, lateFloor: 0.2,
        potentialOvershootMargin: 2, potentialOvershootWidth: 1.5 }),
    softCaps: Object.freeze([[85, 1], [90, 0.75], [94, 0.45], [99, 0.2]].map(Object.freeze)),
    newgenAgeBands: Object.freeze([
        { min: 17, max: 20, weight: 35 }, { min: 21, max: 24, weight: 40 },
        { min: 25, max: 29, weight: 20 }, { min: 30, max: 35, weight: 5 }
    ].map(Object.freeze))
});
