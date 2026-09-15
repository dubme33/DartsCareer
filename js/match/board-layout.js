/* Presentation coordinates only. Match accuracy, scoring and collisions retain their original board. */
(function (root) {
    'use strict';
    const logicRadii = Object.freeze([0, 6.5, 16, 70, 80, 120, 130, 170]);
    // The red bull is slightly smaller on screen. Logical scoring still uses 6.5.
    const displayRadii = Object.freeze([0, 5.8, 12, 71.4, 78.6, 122.8, 130, 170]);
    const radii = Object.freeze({ innerBull: displayRadii[1], outerBull: displayRadii[2],
        trebleInner: displayRadii[3], trebleOuter: displayRadii[4], doubleInner: displayRadii[5], doubleOuter: displayRadii[6] });

    function mapRadius(radius, from, to) {
        for (let index = 1; index < from.length; index++) {
            if (radius <= from[index]) {
                const fraction = (radius - from[index - 1]) / (from[index] - from[index - 1]);
                return to[index - 1] + fraction * (to[index] - to[index - 1]);
            }
        }
        return radius;
    }
    const toDisplayRadius = radius => mapRadius(radius, logicRadii, displayRadii);
    function toDisplayPoint(point) {
        const x = point.x - 170, y = point.y - 170, radius = Math.hypot(x, y);
        const scale = radius ? toDisplayRadius(radius) / radius : 1;
        return { x: 170 + x * scale, y: 170 + y * scale };
    }
    function toDisplayWorld(point) {
        const display = toDisplayPoint({ x: 170 + point[0] * 130, y: 170 - point[1] * 130 });
        return [(display.x - 170) / 130, (170 - display.y) / 130, point[2]];
    }
    function sameField(point, expected, physics) {
        const x = point.x - 170, y = point.y - 170, radius = Math.hypot(x, y);
        const scale = radius ? mapRadius(radius, displayRadii, logicRadii) / radius : 1;
        const field = physics.field({ x: 170 + x * scale, y: 170 + y * scale });
        return field.sector === expected.sector && field.mult === expected.mult;
    }
    let cachedDarts = [], cachedPositions = [], cachedPresentations = [];
    function presentDarts(darts) {
        const positions = darts.map(data => [data.x, data.y, data.dartPose?.x, data.dartPose?.y, data.dartPose?.z].join(','));
        if (darts.length === cachedDarts.length && darts.every((data, index) => data === cachedDarts[index] && positions[index] === cachedPositions[index])) return cachedPresentations;
        const previous = [], physics = root.dartPhysics;
        const presentations = darts.map(data => {
            const point = toDisplayPoint(data), pose = data.dartPose || physics?.basePose(data);
            let presentation = { point, pose };
            if (physics && !physics.separated(point, pose, previous)) {
                const expected = physics.field(data);
                const nearest = previous.reduce((best, dart) => Math.hypot(dart.x - point.x, dart.y - point.y) < Math.hypot(best.x - point.x, best.y - point.y) ? dart : best, previous[0]);
                const away = Math.atan2(point.y - nearest.y, point.x - nearest.x) + previous.length * .37;
                search: for (const distance of [0, .9, 1.8, 2.7, 4.5, 7, 12, 18, 26, 36, 48]) {
                    for (const spread of [0, .18, .32, .46, .62, .8]) for (const offset of [0, .45, -.45, .9, -.9, 1.4, -1.4, 2, -2, Math.PI]) {
                        const angle = away + offset;
                        const candidate = { x: point.x + Math.cos(angle) * distance, y: point.y + Math.sin(angle) * distance };
                        if (!sameField(candidate, expected, physics)) continue;
                        const adjusted = { x: Math.max(-1, Math.min(-.17, pose.x + Math.sin(angle) * spread)),
                            y: Math.max(-.85, Math.min(.85, pose.y + Math.cos(angle) * spread)), z: pose.z };
                        if (!physics.separated(candidate, adjusted, previous)) continue;
                        presentation = { point: candidate, pose: adjusted }; break search;
                    }
                }
            }
            // Only the view receives these corrections. The stored hit and pose are untouched.
            previous.push({ ...presentation.point, dartPose: presentation.pose });
            return presentation;
        });
        cachedDarts = darts.slice(); cachedPositions = positions; cachedPresentations = presentations;
        return presentations;
    }
    root.matchBoardLayout = Object.freeze({ radii, logicRadii, displayRadii, toDisplayRadius, toDisplayPoint, toDisplayWorld, presentDarts });
}(globalThis));
