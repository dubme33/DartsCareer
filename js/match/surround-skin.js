// Calibrated presentation texture. Board size, scoring and dart physics are independent.
function renderSurroundSkin(image, config, size = 1024) {
    const width = image.naturalWidth, height = image.naturalHeight;
    if (width < 2 || height < 2 || !width || !height || width * height > 25000000) throw new Error('Niepoprawny rozmiar obrazu opony.');
    const source = document.createElement('canvas'); source.width = width; source.height = height;
    const context = source.getContext('2d', { willReadFrequently: true }); context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, width, height).data;
    const output = document.createElement('canvas'); output.width = output.height = size;
    const destination = output.getContext('2d'), frame = destination.createImageData(size, size);
    const shorter = Math.min(width, height), cx = config.center[0] * width, cy = config.center[1] * height;
    const inner = config.radii[0] * shorter, outer = config.radii[1] * shorter, rotation = config.rotation * Math.PI / 180;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const dx = (x + .5) * 2 / size - 1, dy = (y + .5) * 2 / size - 1, radius = Math.hypot(dx, dy);
        if (radius < .62 || radius > 1) continue;
        const angle = Math.atan2(dy, dx) + rotation, r = inner + (outer - inner) * (radius - .62) / .38;
        const sx = Math.max(0, Math.min(width - 1.001, cx + Math.cos(angle) * r));
        const sy = Math.max(0, Math.min(height - 1.001, cy + Math.sin(angle) * r));
        const ix = Math.floor(sx), iy = Math.floor(sy), fx = sx - ix, fy = sy - iy;
        const offset = (y * size + x) * 4, a = (iy * width + ix) * 4, b = a + width * 4;
        for (let c = 0; c < 4; c++) frame.data[offset + c] =
            (pixels[a + c] * (1 - fx) + pixels[a + 4 + c] * fx) * (1 - fy)
            + (pixels[b + c] * (1 - fx) + pixels[b + 4 + c] * fx) * fy;
    }
    destination.putImageData(frame, 0, 0); source.width = source.height = 0;
    return output;
}

(function () {
    'use strict';
    let canvas = null, name = '', loading = false, failed = false, generation = 0, cancelLoad = null;
    function notify() {
        const host = document.querySelector('.dartboard-surround');
        if (host) {
            host.querySelector('.dartboard-surround-skin')?.remove();
            host.classList.toggle('has-surround-skin', !!canvas);
            if (canvas) { canvas.className = 'dartboard-surround-skin'; canvas.setAttribute('aria-hidden', 'true'); host.appendChild(canvas); }
        }
        const view = document.getElementById('match-board-view');
        if (view) view.dataset.surroundSkin = canvas ? name : 'default';
        window.dispatchEvent(new Event('surround-skin-change'));
    }
    window.matchSurroundSkin = {
        getCanvas: () => canvas,
        getState: () => ({ active: !!canvas, name: canvas ? name : null, loading, failed, generation }),
        setMod(assets, config) {
            const version = ++generation; if (cancelLoad) cancelLoad();
            canvas = null; name = ''; loading = false; failed = false; cancelLoad = null; notify();
            if (!config) return Promise.resolve(false);
            const descriptor = validateModSurroundConfig(config), url = assets?.surrounds?.[descriptor.image];
            if (!url) return Promise.resolve(false);
            loading = true;
            return new Promise(resolve => {
                const image = new Image();
                function finish(success) {
                    image.onload = image.onerror = null;
                    if (version === generation) { cancelLoad = null; loading = false; failed = !success; notify(); }
                    resolve(success);
                }
                cancelLoad = () => { image.removeAttribute('src'); finish(false); };
                image.onload = () => {
                    if (version !== generation) { resolve(false); return; }
                    try { canvas = renderSurroundSkin(image, descriptor); name = descriptor.name; finish(true); }
                    catch (error) { console.warn('Nie można wyświetlić opony z moda:', error); canvas = null; finish(false); }
                };
                image.onerror = () => finish(false); image.src = url;
            });
        }
    };
})();
