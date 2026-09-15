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
