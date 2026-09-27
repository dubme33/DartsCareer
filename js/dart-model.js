/* Shared, millimetre-based dart model for the shop and match presentation. */
(function (root) {
    'use strict';
    const scale = 1 / 170;
    const profiles = {
        straight: [[0, 1.2], [1, 1.65], [4, 3.05], [6, 3.2], [44, 3.2], [48, 2.65], [50, 2.4]],
        torpedo: [[0, 1.2], [2, 2.1], [8, 3.55], [15, 3.8], [23, 3.7], [37, 3.1], [47, 2.5], [50, 2.4]],
        scallop: [[0, 1.2], [4, 3.15], [14, 3.35], [21, 2.75], [28, 2.7], [35, 3.25], [44, 3.3], [50, 2.4]],
        bomb: [[0, 1.2], [3, 2.5], [9, 4.1], [20, 4.2], [30, 3.9], [42, 2.9], [50, 2.4]],
        tapered: [[0, 1.2], [4, 2.25], [12, 2.6], [32, 3.35], [44, 3.5], [48, 2.8], [50, 2.4]]
    };
    // One folded wing: x is distance from the spine, y runs towards the tail.
    const outlines = {
        standard: [[0, 0], [3, 2], [16, 15], [17.5, 18], [17.5, 32], [16, 36], [3, 42], [0, 42]],
        kite: [[0, 0], [2, 1], [15, 22], [15, 25], [3, 41], [0, 42]],
        pear: [[0, 0], [4, 3], [11, 12], [15.5, 21], [16, 28], [14, 34], [9, 39], [3, 42], [0, 42]],
        slim: [[0, 0], [2, 1], [9, 13], [10, 18], [10, 35], [7, 41], [0, 42]],
        no6: [[0, 0], [3, 2], [14, 15], [15, 19], [15, 32], [13, 36], [3, 41], [0, 41]]
    };
    const defaults = Object.freeze({ barrelShape: 'straight', barrelPattern: 'rings', barrelColor: '#c7cdd1',
        barrelAccentColor: '#263640', barrelAccentStyle: 'grooves', shaftColor: '#263640', shaftLength: 35,
        shaftStyle: 'nylon', tipColor: '#d9e0e4', tipLength: 30, tipStyle: 'smooth',
        flightSystem: 'separate', integratedColor: '#f4f6f7',
        flightShape: 'standard', flightColor: '#f1c40f', flightAccentColor: '#15181d', flightPattern: 'stripe' });
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const fract = v => v - Math.floor(v);
    function normalize(input = {}) {
        const a = { ...defaults, ...input };
        for (const key of ['barrelColor', 'barrelAccentColor', 'shaftColor', 'tipColor', 'flightColor', 'flightAccentColor', 'integratedColor']) {
            if (!/^#[0-9a-f]{6}$/i.test(a[key])) a[key] = defaults[key];
        }
        if (!profiles[a.barrelShape]) a.barrelShape = defaults.barrelShape;
        if (!outlines[a.flightShape]) a.flightShape = defaults.flightShape;
        const pointLength = ({ 32: 30, 38: 40, 45: 50 })[Number(a.tipLength)] || Number(a.tipLength);
        a.tipLength = [26, 30, 35, 40, 50].includes(pointLength) ? pointLength : 30;
        a.shaftLength = [28, 35, 41].includes(Number(a.shaftLength)) ? Number(a.shaftLength) : 35;
        if (!['separate', 'integrated-solid', 'integrated-clear'].includes(a.flightSystem)) a.flightSystem = 'separate';
        if (a.flightSystem !== 'separate') a.shaftColor = a.flightColor = a.integratedColor;
        return a;
    }
    function radiusAt(shape, z) {
        const profile = profiles[shape] || profiles.straight;
        for (let i = 1; i < profile.length; i++) if (z <= profile[i][0]) {
            const [start, r0] = profile[i - 1], [end, r1] = profile[i];
            const t = clamp((z - start) / (end - start), 0, 1);
            const eased = t * t * (3 - 2 * t);
            return r0 + (r1 - r0) * eased;
        }
        return profile[profile.length - 1][1];
    }
    function cutAt(pattern, z, angle = 0) {
        // Machined nose, a polished centre land and rear shoulder stay free of cuts.
        if (z < 5 || z > 46 || (z > 25 && z < 30)) return 0;
        const ring = (pitch, depth, width) => {
            const phase = fract((z - 5) / pitch);
            return depth * (1 - clamp((Math.abs(phase - .5) - width / 2) / .09, 0, 1));
        };
        const diamond = () => {
            const u = angle / (Math.PI * 2) * 20;
            const d1 = Math.abs(fract(u + z / 1.6) - .5);
            const d2 = Math.abs(fract(u - z / 1.6) - .5);
            return .32 * (1 - clamp(Math.min(d1, d2) / .19, 0, 1));
        };
        switch (pattern) {
            case 'rings': return ring(2.05, .34, .19);
            case 'micro': return ring(.85, .18, .25);
            case 'shark': { const t = fract((z - 5) / 2.2); return .48 * (t < .22 ? t / .22 : (1 - t) / .78); }
            case 'knurled': return diamond();
            case 'pixel': return (fract(z / 1.5) < .3 || fract(angle / (Math.PI * 2) * 16) < .3) ? .3 : 0;
            case 'axial': return Math.max(ring(3.2, .22, .13), .42 * clamp((Math.cos(angle * 10) - .65) / .35, 0, 1));
            case 'hybrid': return z < 25 ? ring(2.1, .4, .18) : diamond();
            default: return 0;
        }
    }
    function dimensions(input) {
        const a = normalize(input), flightStart = a.tipLength + 50 + a.shaftLength - 10;
        return { tipLength: a.tipLength, barrelLength: 50, shaftLength: a.shaftLength, flightStart,
            totalLength: flightStart + 42, barrelRadius: Math.max(...profiles[a.barrelShape].map(p => p[1])),
            shaftRadius: 2.4, flightWings: 4, wingAngleDegrees: 90,
            flightSystem: a.flightSystem, flightThickness: a.flightSystem === 'separate' ? .15 : .4 };
    }
    function drawFlight(ctx, a, size) {
        ctx.save();
        ctx.clearRect(0, 0, size, size);
        ctx.globalAlpha = a.flightSystem === 'integrated-clear' ? .32 : 1;
        ctx.fillStyle = a.flightColor; ctx.fillRect(0, 0, size, size);
        ctx.globalAlpha = 1; ctx.scale(size / 256, size / 256);
        ctx.fillStyle = a.flightAccentColor; ctx.strokeStyle = a.flightAccentColor;
        if (a.flightPattern === 'stripe') {
            ctx.beginPath(); ctx.moveTo(0, 210); ctx.lineTo(256, 55); ctx.lineTo(256, 92); ctx.lineTo(0, 247); ctx.fill();
            ctx.globalAlpha = .65; ctx.fillRect(0, 18, 256, 5);
        } else if (a.flightPattern === 'chevron') {
            for (const y of [76, 141, 206]) {
                ctx.beginPath(); ctx.moveTo(0, y - 60); ctx.lineTo(215, y); ctx.lineTo(0, y + 45);
                ctx.lineWidth = 17; ctx.stroke();
            }
        } else if (a.flightPattern === 'split') {
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(256, 0); ctx.lineTo(0, 256); ctx.fill();
            ctx.globalAlpha = .45; ctx.fillRect(232, 0, 6, 256);
        } else if (a.flightPattern === 'hex') {
            ctx.lineWidth = 2; ctx.globalAlpha = .85;
            for (let y = -16; y < 280; y += 27) for (let x = -20; x < 280; x += 31) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const t = Math.PI / 3 * i, px = x + (Math.round(y / 27) % 2) * 15.5 + Math.cos(t) * 16, py = y + Math.sin(t) * 16;
                    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
                }
                ctx.closePath(); ctx.stroke();
            }
        } else if (a.flightPattern === 'lightning') {
            for (const x of [-45, 75, 195]) {
                ctx.beginPath(); ctx.moveTo(x + 50, 0); ctx.lineTo(x + 9, 132);
                ctx.lineTo(x + 53, 120); ctx.lineTo(x + 15, 256); ctx.lineTo(x + 111, 88);
                ctx.lineTo(x + 66, 101); ctx.lineTo(x + 105, 0); ctx.closePath(); ctx.fill();
            }
        } else if (a.flightPattern === 'checker') {
            for (let y = 0; y < 256; y += 32) for (let x = 0; x < 256; x += 32) {
                if ((x / 32 + y / 32) % 2 === 0) ctx.fillRect(x, y, 32, 32);
            }
        } else if (a.flightPattern === 'sunburst') {
            for (let i = 0; i < 16; i++) {
                const angle = i * Math.PI / 8;
                ctx.beginPath(); ctx.moveTo(0, 128);
                ctx.lineTo(Math.cos(angle) * 390, 128 + Math.sin(angle) * 390);
                ctx.lineTo(Math.cos(angle + .17) * 390, 128 + Math.sin(angle + .17) * 390);
                ctx.closePath(); ctx.fill();
            }
        } else if (a.flightPattern === 'circuit') {
            ctx.lineWidth = 4;
            for (let i = 0; i < 7; i++) {
                const x = 15 + i * 37, y = 48 + (i % 3) * 48;
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y); ctx.lineTo(x + 18, y + 18);
                ctx.lineTo(x + 18, 224); ctx.stroke();
                ctx.beginPath(); ctx.arc(x + 18, 224, 6, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
            }
        } else if (a.flightPattern === 'contour') {
            ctx.lineWidth = 3;
            for (let row = -4; row < 16; row++) {
                ctx.beginPath();
                for (let x = 0; x <= 256; x += 4) {
                    const y = row * 22 + Math.sin(x / 47 + row * .25) * 23 + Math.cos(x / 27) * 7;
                    if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
                }
                ctx.stroke();
            }
        } else if (a.flightPattern === 'crown') {
            ctx.lineWidth = 7;
            for (const inset of [0, 20]) {
                ctx.beginPath(); ctx.moveTo(22 + inset, 64 + inset); ctx.lineTo(218 - inset, 64 + inset);
                ctx.lineTo(206 - inset, 162 - inset / 2); ctx.lineTo(120, 221 - inset);
                ctx.lineTo(34 + inset, 162 - inset / 2); ctx.closePath(); ctx.stroke();
            }
            ctx.beginPath(); ctx.moveTo(68, 116); ctx.lineTo(65, 84); ctx.lineTo(94, 101);
            ctx.lineTo(120, 78); ctx.lineTo(146, 101); ctx.lineTo(175, 84); ctx.lineTo(172, 116);
            ctx.closePath(); ctx.fill(); ctx.fillRect(70, 123, 100, 8);
            for (const [x, y] of [[30, 29], [184, 18], [215, 229]]) {
                ctx.save(); ctx.translate(x, y); ctx.rotate(.5); ctx.fillRect(-3, -12, 6, 24);
                ctx.fillRect(-12, -3, 24, 6); ctx.restore();
            }
        }
        ctx.restore();
    }

    function createFactory(THREE) {
        const cache = new Map();
        let activeEntries;
        function asset(key, build) {
            let entry = cache.get(key);
            if (!entry) { entry = { resource: build(), refs: 0 }; cache.set(key, entry); }
            if (!activeEntries.has(entry)) { entry.refs++; activeEntries.add(entry); }
            return entry.resource;
        }
        function paint(key, color, options = {}) {
            return asset(`material:${key}:${color}`, () => new THREE.MeshStandardMaterial({ color, ...options }));
        }
        function lathe(key, points, segments = 48) {
            return asset(`lathe:${key}`, () => {
                const g = new THREE.LatheGeometry(points.map(([z, r]) => new THREE.Vector2(r * scale, z * scale)), segments);
                g.rotateX(Math.PI / 2); return g;
            });
        }
        function barrelGeometry(a) {
            const key = ['barrel', a.barrelShape, a.barrelPattern, a.barrelColor, a.barrelAccentColor, a.barrelAccentStyle].join(':');
            return asset(key, () => {
                const vertices = [], colors = [], indices = [], around = 96, along = 500;
                const base = new THREE.Color(a.barrelColor), accent = new THREE.Color(a.barrelAccentColor), color = new THREE.Color();
                for (let j = 0; j <= along; j++) {
                    const z = j * 50 / along;
                    for (let i = 0; i <= around; i++) {
                        const t = i / around * Math.PI * 2, cut = cutAt(a.barrelPattern, z, t);
                        const r = radiusAt(a.barrelShape, z) - cut;
                        vertices.push(Math.cos(t) * r * scale, Math.sin(t) * r * scale, z * scale);
                        const amount = a.barrelAccentStyle === 'split' ? (z < 25 ? 1 : 0)
                            : a.barrelAccentStyle === 'bands' ? ((z > 9 && z < 15) || (z > 34 && z < 40) ? 1 : 0)
                                : clamp(cut / .27, 0, 1);
                        color.copy(base).lerp(accent, amount);
                        colors.push(color.r, color.g, color.b);
                        if (j < along && i < around) {
                            const v = j * (around + 1) + i;
                            indices.push(v, v + 1, v + around + 1, v + 1, v + around + 2, v + around + 1);
                        }
                    }
                }
                const g = new THREE.BufferGeometry();
                g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                g.setIndex(indices); g.computeVertexNormals(); return g;
            });
        }
        function create(input) {
            const a = normalize(input), d = dimensions(a), group = new THREE.Group();
            const integrated = a.flightSystem !== 'separate', clear = a.flightSystem === 'integrated-clear';
            activeEntries = new Set(); group.userData.assets = activeEntries;
            group.userData.dimensions = d;
            const mesh = (geometry, material, z = 0) => {
                const m = new THREE.Mesh(geometry, material); m.position.z = z * scale;
                m.castShadow = true; group.add(m); return m;
            };
            const metal = paint('steel', a.tipColor, { metalness: .82, roughness: .24 });
            // A cylindrical steel point with a short, smoothly ground needle end.
            const tipProfile = [[0, .015], [.8, .13], [3, .4], [7, .75], [11, 1.05], [a.tipLength - 1, 1.05], [a.tipLength, 1.2]];
            if (a.tipStyle !== 'smooth') {
                for (let z = 12; z < a.tipLength - 3; z += a.tipStyle === 'ringed' ? 1.4 : .8) {
                    tipProfile.push([z, 1.05], [z + .18, .9], [z + .4, 1.05]);
                }
                tipProfile.sort((p, q) => p[0] - q[0]);
            }
            mesh(lathe(`point:${a.tipLength}:${a.tipStyle}`, tipProfile), metal);
            mesh(barrelGeometry(a), paint('barrel', '#ffffff', { vertexColors: true, metalness: .8, roughness: .29 }), a.tipLength);
            const shaftZ = a.tipLength + 50;
            const polymerOptions = { metalness: 0, roughness: clear ? .16 : .3,
                clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: 1.15 };
            if (integrated) {
                const polymer = asset(`polymer:${a.flightSystem}:${a.integratedColor}`, () => new THREE.MeshPhysicalMaterial({
                    color: a.integratedColor, ...polymerOptions, transparent: clear, opacity: clear ? .68 : 1, depthWrite: !clear
                }));
                // One moulded stem continues into the flight spine, without slots or a retaining ring.
                const stem = mesh(lathe(`integrated-stem:${a.shaftLength}`, [[0, 2.4], [2, 2.35], [6, 1.95],
                    [a.shaftLength - 13, 1.35], [a.shaftLength - 10, 1.12], [a.shaftLength - 5, .85],
                    [a.shaftLength + 30, .65], [a.shaftLength + 32, .12]]), polymer, shaftZ);
                stem.name = 'integrated-stem'; stem.castShadow = !clear;
            } else {
                const collarPaint = paint('collar', '#bbc4cb', { metalness: .88, roughness: .22 });
                mesh(lathe('collar', [[0, 2.38], [.5, 2.42], [1.8, 2.28], [2.6, 2.18]]), collarPaint, shaftZ);
                const shaftPaint = paint(`shaft:${a.shaftStyle}`, a.shaftColor,
                    { metalness: a.shaftStyle === 'aluminium' ? .72 : .06, roughness: a.shaftStyle === 'carbon' ? .56 : .32 });
                mesh(lathe(`shaft:${a.shaftLength}`, [[1.7, 2.16], [5, 2.05], [a.shaftLength - 13, 1.65],
                    [a.shaftLength - 4, 1.5], [a.shaftLength - 1, 1.35], [a.shaftLength, .6]]), shaftPaint, shaftZ);
                // Four split prongs grip the folded flight, with a separate retaining ring.
                const slotPaint = paint('slot', '#111820', { roughness: .66 });
                const slot = asset('slot', () => new THREE.BoxGeometry(.32 * scale, 2.9 * scale, 9 * scale));
                for (let i = 0; i < 2; i++) mesh(slot, slotPaint, shaftZ + a.shaftLength - 4.5).rotation.z = i * Math.PI / 2;
                mesh(lathe('retaining-ring', [[0, 1.63], [.2, 1.83], [.9, 1.83], [1.1, 1.63]]), collarPaint, shaftZ + a.shaftLength - 10.6);
                if (a.shaftStyle === 'aluminium') {
                    for (let j = 0; j < 4; j++) mesh(lathe(`shaft-ring:${j}`, [[0, 2.08 - j * .025], [.3, 2.08 - j * .025]]), collarPaint, shaftZ + 4 + j * .8);
                } else if (a.shaftStyle === 'carbon') {
                    const weave = asset('carbon-weave', () => {
                        const c = document.createElement('canvas'); c.width = c.height = 64;
                        const ctx = c.getContext('2d'); ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 64, 64);
                        ctx.strokeStyle = '#aaa'; ctx.lineWidth = 3;
                        for (let n = -64; n < 128; n += 8) { ctx.beginPath(); ctx.moveTo(n, 0); ctx.lineTo(n + 64, 64); ctx.stroke(); }
                        const texture = new THREE.CanvasTexture(c); texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(3, 6); return texture;
                    });
                    // The selected colour remains the tint of the composite.
                    shaftPaint.bumpMap = weave; shaftPaint.bumpScale = .035 * scale; shaftPaint.needsUpdate = true;
                }
            }
            const flightKey = `${a.flightSystem}:${a.flightPattern}:${a.flightColor}:${a.flightAccentColor}`;
            const flightMap = asset(`flight-map:${flightKey}`, () => {
                const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
                drawFlight(canvas.getContext('2d'), a, 256);
                const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4; return texture;
            });
            const flightPaint = asset(`flight-paint:${flightKey}`, () => integrated
                ? new THREE.MeshPhysicalMaterial({ map: flightMap, color: '#ffffff', ...polymerOptions,
                    side: clear ? THREE.FrontSide : THREE.DoubleSide, transparent: clear, depthWrite: !clear })
                : new THREE.MeshStandardMaterial({ map: flightMap, color: '#ffffff', roughness: .43, metalness: .02, side: THREE.DoubleSide }));
            const wing = asset(`wing:${a.flightShape}:${d.flightThickness}`, () => {
                const shape = new THREE.Shape();
                const points = outlines[a.flightShape];
                const corners = points.map((point, i) => {
                    const previous = points[(i + points.length - 1) % points.length], next = points[(i + 1) % points.length];
                    const incoming = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
                    const outgoing = Math.hypot(point[0] - next[0], point[1] - next[1]);
                    const trim = point[0] === 0 ? 0 : Math.min(incoming / 2, outgoing / 2, a.flightShape === 'pear' ? 2.8 : 1);
                    return { point, enter: point.map((v,k) => v + (previous[k] - v) * trim / incoming),
                        exit: point.map((v,k) => v + (next[k] - v) * trim / outgoing) };
                });
                shape.moveTo(corners[0].enter[0] * scale, corners[0].enter[1] * scale);
                corners.forEach(({ point, exit }, i) => {
                    shape.quadraticCurveTo(point[0] * scale, point[1] * scale, exit[0] * scale, exit[1] * scale);
                    const next = corners[(i + 1) % corners.length].enter;
                    shape.lineTo(next[0] * scale, next[1] * scale);
                });
                shape.closePath();
                const g = new THREE.ExtrudeGeometry(shape, { depth: d.flightThickness * scale, bevelEnabled: false, curveSegments: 3 });
                const uv = g.getAttribute('uv');
                for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / (17.5 * scale), uv.getY(i) / (42 * scale));
                g.translate(0, 0, -d.flightThickness / 2 * scale); g.rotateX(Math.PI / 2); return g;
            });
            for (let i = 0; i < 4; i++) {
                const fin = mesh(wing, flightPaint, d.flightStart);
                fin.rotation.z = i * Math.PI / 2; fin.name = 'flight-wing'; fin.castShadow = !clear;
                if (clear) {
                    const edge = asset(`flight-edge:${a.flightShape}`, () => new THREE.EdgesGeometry(wing, 35));
                    const edgePaint = asset(`flight-edge-paint:${a.flightColor}`, () => new THREE.LineBasicMaterial({
                        color: a.flightColor, transparent: true, opacity: .55, depthWrite: false }));
                    fin.add(new THREE.LineSegments(edge, edgePaint));
                }
            }
            return group;
        }
        function release(group) {
            group?.userData.assets?.forEach(entry => { entry.refs--; });
            if (group) group.userData.assets = null;
            // Keep reusable parts warm, while bounding GPU memory over a long career.
            if (cache.size > 80) for (const [key, entry] of cache) {
                if (entry.refs === 0) { entry.resource.dispose(); cache.delete(key); }
            }
        }
        function dispose() { cache.forEach(entry => entry.resource.dispose()); cache.clear(); }
        return { create, release, dispose };
    }
    let libraryPromise;
    function studioEnvironment(THREE) {
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#46505b'; ctx.fillRect(0, 0, 512, 256);
        for (const [x, width, light] of [[22, 95, '#f5f7fa'], [180, 28, '#acbbce'], [320, 135, '#e2eaf4']]) {
            const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
            gradient.addColorStop(0, '#46505b'); gradient.addColorStop(.28, light);
            gradient.addColorStop(.72, light); gradient.addColorStop(1, '#46505b');
            ctx.fillStyle = gradient; ctx.fillRect(x, 25, width, 180);
        }
        const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping = THREE.EquirectangularReflectionMapping; return texture;
    }
    function loadThree(url) {
        if (root.DartsThree?.WebGLRenderer) return Promise.resolve(root.DartsThree);
        if (!libraryPromise) libraryPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script'); script.src = url; script.async = true;
            script.onload = () => root.DartsThree?.WebGLRenderer ? resolve(root.DartsThree) : reject(new Error('3D library unavailable'));
            script.onerror = () => { script.remove(); reject(new Error('3D library unavailable')); };
            document.head.appendChild(script);
        }).catch(error => { libraryPromise = null; throw error; });
        return libraryPromise;
    }
    root.dartModel = Object.freeze({ normalize, dimensions, radiusAt, cutAt, profiles, outlines, scale, createFactory, loadThree, studioEnvironment, drawFlight });
})(typeof window !== 'undefined' ? window : globalThis);
