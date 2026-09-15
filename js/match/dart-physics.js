/* Small, renderer-independent collision solver. Board units match the 340px 2D board. */
(function (root) {
    'use strict';
    const order = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const add = (a, b) => a.map((n, i) => n + b[i]);
    const sub = (a, b) => a.map((n, i) => n - b[i]);
    const mul = (a, n) => a.map(value => value * n);
    const dot = (a, b) => a.reduce((sum, n, i) => sum + n * b[i], 0);
    const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
    const unit = vector => mul(vector, 1 / (Math.hypot(...vector) || 1));
    const anchor = point => [(point.x - 170) / 130, (170 - point.y) / 130, .008];

    function basePose(point) {
        const tilt = Math.sin(point.x * .37 + point.y * .23);
        return { x: -.34 - tilt * .045, y: .08 + tilt * .025, z: tilt * .22 };
    }
    // Euler XYZ, shared with Three.js. Roll does not change the longitudinal axis.
    function direction(pose) {
        return [Math.sin(pose.y), -Math.sin(pose.x) * Math.cos(pose.y), Math.cos(pose.x) * Math.cos(pose.y)];
    }
    function field(point) {
        const x = point.x - 170, y = point.y - 170, radius = Math.hypot(x, y);
        if (radius > 130) return { sector: 0, mult: 0 };
        if (radius < 6.5) return { sector: 25, mult: 2 };
        if (radius < 16) return { sector: 25, mult: 1 };
        const angle = (Math.atan2(y, x) + Math.PI / 2 + Math.PI / 20 + Math.PI * 2) % (Math.PI * 2);
        return { sector: order[Math.floor(angle / (Math.PI / 10)) % 20], mult: radius >= 120 ? 2 : radius >= 70 && radius < 80 ? 3 : 1 };
    }
    function shapes(point, pose = basePose(point)) {
        const origin = anchor(point), axis = direction(pose);
        // The flight capsule encloses all four fins; separation is deliberately conservative.
        return [[.002, .205, .006, 'tip'], [.2035, .410, .0215, 'barrel'], [.406, .446, .014, 'neck'],
            [.442, .572, .008, 'shaft'], [.620, .665, .09, 'flight']].map(([start, end, radius, part]) => ({
            a: add(origin, mul(axis, start)), b: add(origin, mul(axis, end)), radius, part
        }));
    }
    function closest(point, segment) {
        const axis = sub(segment.b, segment.a);
        return add(segment.a, mul(axis, clamp(dot(sub(point, segment.a), axis) / (dot(axis, axis) || 1), 0, 1)));
    }
    function segmentDistance(a, b) {
        const u = sub(a.b, a.a), v = sub(b.b, b.a), w = sub(a.a, b.a);
        const aa = dot(u, u), bb = dot(u, v), cc = dot(v, v), dd = dot(u, w), ee = dot(v, w);
        const denominator = aa * cc - bb * bb;
        let s = denominator > 1e-12 ? clamp((bb * ee - cc * dd) / denominator, 0, 1) : 0;
        let t = (bb * s + ee) / cc;
        if (t < 0) { t = 0; s = clamp(-dd / aa, 0, 1); }
        else if (t > 1) { t = 1; s = clamp((bb - dd) / aa, 0, 1); }
        return Math.hypot(...sub(add(a.a, mul(u, s)), add(b.a, mul(v, t))));
    }
    function overlaps(a, b) {
        return a.some(first => b.some(second => segmentDistance(first, second) < first.radius + second.radius + .001));
    }
    function obstacles(darts) {
        return darts.slice(-2).map((dart, index) => ({ index, dart, shapes: shapes(dart, dart.dartPose || basePose(dart)) }));
    }
    function separated(point, pose, previous) {
        const model = shapes(point, pose);
        return previous.every(obstacle => !overlaps(model, obstacle.shapes));
    }
    function contact(point, pose, previous) {
        const origin = anchor(point), axis = direction(pose);
        // Sweep the tip through the final metre of the throw, rather than checking one frame.
        for (let step = 0; step <= 128; step++) {
            const tip = add(origin, mul(axis, .95 * (1 - step / 128)));
            for (const obstacle of previous) for (const shape of obstacle.shapes) {
                const centre = closest(tip, shape), distance = Math.hypot(...sub(tip, centre));
                if (distance > shape.radius + .002) continue;
                const radial = sub(tip, centre);
                const normal = distance > 1e-6 ? unit(radial) : [Math.cos(obstacle.index * 2.4), Math.sin(obstacle.index * 2.4), 0];
                const alignment = Math.hypot(...sub(origin, anchor(obstacle.dart)));
                const severity = shape.part === 'flight' ? (alignment < .009 ? .95 : .22)
                    : clamp(Math.abs(dot(axis, normal)) * .8 + .3, .4, 1);
                return { obstacle: obstacle.index, contact: tip, normal, part: shape.part, severity };
            }
        }
        if (separated(point, pose, previous)) return null;
        // A tip can pass the fins while its own barrel or flights collide later.
        const obstacle = previous.find(item => overlaps(shapes(point, pose), item.shapes));
        const tail = add(origin, mul(axis, .635)), otherTail = add(anchor(obstacle.dart), mul(direction(obstacle.dart.dartPose || basePose(obstacle.dart)), .635));
        return { obstacle: obstacle.index, contact: add(origin, mul(axis, .30)), normal: unit(sub(tail, otherTail)), part: 'flight', severity: .18 };
    }
    function resolve(result, point, darts = [], random = Math.random, allowBounce = true) {
        const pose = basePose(point), previous = obstacles(darts);
        const initial = { ...result, boardPoint: { ...point }, dartPose: pose, physicsResolved: true };
        if (result.bounceOut || !previous.length) return initial;
        const impact = contact(point, pose, previous);
        if (!impact) return initial;
        const roll = random();
        const collision = { ...impact, originalSector: result.sector, originalMult: result.mult,
            plannedPoint: { ...point }, plannedPose: { ...pose }, deflected: false };
        const probability = impact.severity > .6 ? .012 + .028 * impact.severity ** 3 : 0;
        if (allowBounce && roll < probability) {
            return { ...initial, sector: 0, mult: 0, bounceOut: true, bouncedSector: result.sector, bouncedMult: result.mult, collision: { ...collision, bounced: true } };
        }
        const away = Math.hypot(impact.normal[0], impact.normal[1]) > .05
            ? Math.atan2(impact.normal[1], impact.normal[0]) : (darts.length * 2.399963 + roll * .35);
        const angles = [0, .45, -.45, .9, -.9, 1.4, -1.4, 2, -2, Math.PI];
        for (const displacement of [0, .9, 1.8, 2.7, 4.5, 7, 12, 18, 26, 36, 48, 64, 96]) {
            for (const spread of [.18, .32, .46, .62, .8]) for (const offset of angles) {
                const angle = away + offset;
                const finalPoint = { x: point.x + Math.cos(angle) * displacement, y: point.y - Math.sin(angle) * displacement };
                const finalPose = { x: clamp(pose.x - Math.sin(angle) * spread, -1, -.17),
                    y: clamp(pose.y + Math.cos(angle) * spread, -.85, .85), z: pose.z + Math.sin(angle) * .20 };
                if (!separated(finalPoint, finalPose, previous)) continue;
                const hit = field(finalPoint);
                collision.deflected = hit.sector !== result.sector || hit.mult !== result.mult;
                collision.displacement = displacement;
                return { ...initial, ...hit, boardPoint: finalPoint, dartPose: finalPose, collision };
            }
        }
        // At most two obstacles exist. Moving farther than the complete dart width is always clear.
        const finalPoint = { x: point.x + 260, y: point.y };
        while (!separated(finalPoint, pose, previous)) finalPoint.x += 130;
        return { ...initial, ...field(finalPoint), boardPoint: finalPoint, collision: { ...collision, deflected: true, displacement: finalPoint.x - point.x } };
    }
    function register(visit, result) {
        if (!visit || result.bounceOut || !result.boardPoint) return;
        visit.physicsDarts = [...(visit.physicsDarts || []), { ...result.boardPoint, dartPose: result.dartPose }].slice(-3);
    }
    root.dartPhysics = { basePose, direction, field, resolve, register,
        separated: (point, pose, darts) => separated(point, pose, obstacles(darts)) };
})(globalThis);
