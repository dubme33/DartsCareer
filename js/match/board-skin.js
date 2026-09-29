/* Mod photographs are calibrated once; scoring and dart physics keep their coordinates. */
const DARTBOARD_SKIN_RADII = matchBoardLayout.displayRadii;

function getDartboardSkinSourceRadius(radius, sourceRadii) {
    for (let index = 1; index < DARTBOARD_SKIN_RADII.length; index++) {
        if (radius <= DARTBOARD_SKIN_RADII[index]) {
            const fraction = (radius - DARTBOARD_SKIN_RADII[index - 1])
                / (DARTBOARD_SKIN_RADII[index] - DARTBOARD_SKIN_RADII[index - 1]);
            return sourceRadii[index - 1] + fraction * (sourceRadii[index] - sourceRadii[index - 1]);
        }
    }
    return sourceRadii[sourceRadii.length - 1];
}

function traceDartboardSkinWires(frame, size) {
    const { innerBull, outerBull, trebleInner, trebleOuter, doubleInner, doubleOuter } = matchBoardLayout.radii;
    const scale = size / 340, pixels = frame.data;
    function channel(x, y, c) {
        const px = Math.max(0, Math.min(size - 1, Math.floor(x * scale)));
        const py = Math.max(0, Math.min(size - 1, Math.floor(y * scale)));
        return pixels[(py * size + px) * 4 + c];
    }
    function edgeOffset(x, y, nx, ny) {
        let strongest = 0;
        const samples = [];
        // The calibrated photo can differ from an ideal circle by a fraction of
        // a board pixel. Find the colour transition, not a second theoretical wire.
        for (let step = -24; step <= 24; step++) {
            const distance = step * .05;
            let contrast = 0;
            for (let c = 0; c < 3; c++) {
                let difference = 0;
                for (const along of [-.3, 0, .3]) {
                    const sx = x - ny * along, sy = y + nx * along;
                    difference += channel(sx + nx * (distance + .35), sy + ny * (distance + .35), c)
                        - channel(sx + nx * (distance - .35), sy + ny * (distance - .35), c);
                }
                contrast += difference * difference;
            }
            samples.push({ distance, contrast });
            strongest = Math.max(strongest, contrast);
        }
        if (strongest < 2500) return 0;
        // Centre the transition, including its antialiasing; selecting the first
        // equally strong gradient would bias a wire towards one side of the field.
        let weightedOffset = 0, totalWeight = 0;
        for (const sample of samples) {
            const weight = Math.max(0, sample.contrast - strongest * .6);
            weightedOffset += sample.distance * weight;
            totalWeight += weight;
        }
        return totalWeight ? weightedOffset / totalWeight : 0;
    }
    const rings = [innerBull, outerBull, trebleInner, trebleOuter, doubleInner, doubleOuter].map(radius => {
        const offsets = Array.from({ length: 40 }, (_, i) => {
            // Sample inside sectors, away from crossings with radial wires.
            const angle = -Math.PI / 2 + Math.floor(i / 2) * Math.PI / 10 + (i % 2 ? 1 : -1) * Math.PI / 40;
            return { angle, offset: edgeOffset(170 + radius * Math.cos(angle), 170 + radius * Math.sin(angle), Math.cos(angle), Math.sin(angle)) };
        });
        // A smooth fitted circle/ellipse follows photographic perspective without
        // turning sisal texture into a jagged wire. Uniform paired samples retain
        // orthogonality of the first two angular harmonics.
        const coefficients = [0, 1, 2, 3, 4].map(term => offsets.reduce((sum, sample) => {
            const basis = term === 0 ? 1 : term === 1 ? Math.cos(sample.angle) : term === 2 ? Math.sin(sample.angle)
                : term === 3 ? Math.cos(2 * sample.angle) : Math.sin(2 * sample.angle);
            return sum + sample.offset * basis;
        }, 0) / offsets.length * (term === 0 ? 1 : 2));
        const at = angle => radius + coefficients[0] + coefficients[1] * Math.cos(angle) + coefficients[2] * Math.sin(angle)
            + coefficients[3] * Math.cos(2 * angle) + coefficients[4] * Math.sin(2 * angle);
        return { radius, at };
    });
    const spokes = Array.from({ length: 20 }, (_, sector) => {
        const angle = -Math.PI / 2 - Math.PI / 20 + sector * Math.PI / 10;
        const dx = Math.cos(angle), dy = Math.sin(angle);
        const samples = [25, 35, 45, 55, 65, 88, 98, 108, 118].map(radius => ({ radius,
            offset: edgeOffset(170 + radius * dx, 170 + radius * dy, -dy, dx) }));
        const meanRadius = samples.reduce((sum, sample) => sum + sample.radius, 0) / samples.length;
        const meanOffset = samples.reduce((sum, sample) => sum + sample.offset, 0) / samples.length;
        const slope = samples.reduce((sum, sample) => sum + (sample.radius - meanRadius) * (sample.offset - meanOffset), 0)
            / samples.reduce((sum, sample) => sum + (sample.radius - meanRadius) ** 2, 0);
        const at = radius => {
            const offset = meanOffset + slope * (radius - meanRadius);
            return { x: 170 + radius * dx - offset * dy, y: 170 + radius * dy + offset * dx };
        };
        function intersection(ring) {
            let radius = ring.at(angle);
            for (let step = 0; step < 4; step++) {
                const point = at(radius), x = point.x - 170, y = point.y - 170;
                radius += ring.at(Math.atan2(y, x)) - Math.hypot(x, y);
            }
            return radius;
        }
        return { angle, at, start: intersection(rings[1]), end: intersection(rings[5]) };
    });
    return { rings, spokes };
}

function enhanceWinmauDartboardWires(context, size, frame) {
    const { rings, spokes } = traceDartboardSkinWires(frame, size);
    context.save();
    context.scale(size / 340, size / 340);
    context.lineCap = 'butt';
    context.lineJoin = 'round';
    context.beginPath();
    for (const ring of rings) {
        for (let step = 0; step <= 720; step++) {
            const angle = step * Math.PI / 360, radius = ring.at(angle);
            const x = 170 + radius * Math.cos(angle), y = 170 + radius * Math.sin(angle);
            if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
    }
    for (const spoke of spokes) {
        const start = spoke.at(spoke.start), end = spoke.at(spoke.end);
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
    }
    // Reinforce the calibrated photograph on its own plane so both views retain
    // one aligned spider, with a dark edge and a narrow silver blade highlight.
    context.lineWidth = .65;
    context.strokeStyle = 'rgba(24, 30, 34, .48)';
    context.stroke();
    context.lineWidth = .38;
    context.strokeStyle = 'rgba(190, 201, 208, .9)';
    context.stroke();
    context.lineWidth = .12;
    context.strokeStyle = 'rgba(241, 247, 250, .85)';
    context.stroke();
    context.restore();
}

function renderDartboardSkin(image, config, size = 2048) {
    const width = image.naturalWidth, height = image.naturalHeight;
    if (!width || !height) throw new Error('Nie można odczytać obrazu tarczy.');
    const source = document.createElement('canvas');
    source.width = width; source.height = height;
    const context = source.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, width, height).data;
    const output = document.createElement('canvas');
    output.width = output.height = size;
    const destination = output.getContext('2d');
    const frame = destination.createImageData(size, size);
    const data = frame.data, half = size / 2;
    const scale = Math.min(width, height), cx = config.center[0] * width, cy = config.center[1] * height;
    const radii = [0, ...config.radii.map(radius => radius * scale)];
    const rotation = config.rotation * Math.PI / 180, cos = Math.cos(rotation), sin = Math.sin(rotation);
    if (cx - radii[7] < 0 || cy - radii[7] < 0 || cx + radii[7] > width || cy + radii[7] > height) {
        throw new Error('Obraz tarczy nie obejmuje jej całego obwodu.');
    }
    // Inverse radial mapping prevents photographic ring proportions changing scores.
    // Bilinear sampling retains the original logos and sisal, without white corners.
    for (let y = 0; y < size; y++) {
        const dy = y + .5 - half;
        for (let x = 0; x < size; x++) {
            const dx = x + .5 - half, distance = Math.hypot(dx, dy);
            if (distance > half) continue;
            const radius = getDartboardSkinSourceRadius(distance * 340 / size, radii);
            const factor = distance ? radius / distance : 0;
            const sx = Math.max(0, Math.min(width - 1, cx + (dx * cos + dy * sin) * factor - .5));
            const sy = Math.max(0, Math.min(height - 1, cy + (-dx * sin + dy * cos) * factor - .5));
            const x0 = Math.floor(sx), y0 = Math.floor(sy), tx = sx - x0, ty = sy - y0;
            const a = (y0 * width + x0) * 4, b = (y0 * width + Math.min(x0 + 1, width - 1)) * 4;
            const c = (Math.min(y0 + 1, height - 1) * width + x0) * 4;
            const d = (Math.min(y0 + 1, height - 1) * width + Math.min(x0 + 1, width - 1)) * 4;
            const offset = (y * size + x) * 4;
            for (let channel = 0; channel < 4; channel++) {
                data[offset + channel] = (pixels[a + channel] * (1 - tx) + pixels[b + channel] * tx) * (1 - ty)
                    + (pixels[c + channel] * (1 - tx) + pixels[d + channel] * tx) * ty;
            }
        }
    }
    destination.putImageData(frame, 0, 0);
    if (config.image === 'winmau-blade-x' || /winmau\s+blade\s+x/i.test(config.name)) {
        enhanceWinmauDartboardWires(destination, size, frame);
    }
    source.width = source.height = 0;
    return output;
}

(function () {
    'use strict';
    let canvas = null, name = '', loading = false, failed = false, generation = 0;
    let pendingImage = null, cancelLoad = null;
    function notify() {
        const view = document.getElementById('match-board-view');
        if (view) view.dataset.boardSkin = canvas ? name : 'default';
        window.dispatchEvent(new Event('dartboard-skin-change'));
        if (typeof drawDartboard === 'function') drawDartboard();
    }
    window.matchBoardSkin = {
        getCanvas: () => canvas,
        getState: () => ({ active: !!canvas, name: canvas ? name : null, loading, failed, generation }),
        setMod(assets, config) {
            const version = ++generation;
            if (cancelLoad) cancelLoad();
            if (pendingImage) { pendingImage.removeAttribute('src'); pendingImage = null; }
            cancelLoad = null;
            canvas = null; name = ''; loading = false; failed = false;
            notify();
            if (!config) return Promise.resolve(false);
            const descriptor = validateModDartboardConfig(config);
            const url = assets?.dartboards?.[descriptor.image];
            if (!url) return Promise.resolve(false);
            loading = true;
            return new Promise(resolve => {
                const image = new Image(); pendingImage = image;
                function finish(success) {
                    image.onload = image.onerror = null;
                    if (version === generation) { pendingImage = null; cancelLoad = null; loading = false; failed = !success; notify(); }
                    resolve(success);
                }
                cancelLoad = () => finish(false);
                image.onload = () => {
                    if (version !== generation) { resolve(false); return; }
                    try { canvas = renderDartboardSkin(image, descriptor); name = descriptor.name; finish(true); }
                    catch (error) { console.warn('Nie można wyświetlić tarczy z moda:', error); canvas = null; finish(false); }
                };
                image.onerror = () => finish(false);
                image.src = url;
            });
        }
    };
}());
