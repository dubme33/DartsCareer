/* Optional presentation layer. Match scoring remains in turns.js / leg-flow.js. */
(function () {
    'use strict';

    const stage = document.getElementById('dartboard-3d');
    const canvas2D = document.getElementById('dartboard');
    const matchScreen = document.getElementById('screen-match');
    if (!stage || !canvas2D || !matchScreen) return;
    const libraryUrl = new URL('../vendor/three/three.bundle.min.js?v=0.180.0&classic=1', document.currentScript.src).href;

    const labels = {
        pl: { view: 'Widok', group: 'Widok tarczy', side: 'Z boku', front: 'Na wprost', camera: 'Zmień kamerę', scene: 'Tarcza i lotki w widoku 3D', loading: 'Ładowanie tarczy 3D…', fallback: 'Przeglądarka nie może wyświetlić grafiki 3D. Tarcza działa w 2D.', libraryFallback: 'Nie udało się wczytać biblioteki 3D. Tarcza działa w 2D.' },
        en: { view: 'View', group: 'Dartboard view', side: 'Angled', front: 'Front', camera: 'Change camera', scene: 'Dartboard and darts in 3D', loading: 'Loading the 3D board…', fallback: 'The browser cannot display 3D graphics. The board is displayed in 2D.', libraryFallback: 'The 3D library could not be loaded. The board is displayed in 2D.' },
        de: { view: 'Ansicht', group: 'Dartscheibenansicht', side: 'Seitlich', front: 'Frontal', camera: 'Kamera wechseln', scene: 'Dartscheibe und Darts in 3D', loading: '3D-Dartscheibe wird geladen…', fallback: 'Der Browser kann keine 3D-Grafik anzeigen. Die Scheibe wird in 2D angezeigt.', libraryFallback: 'Die 3D-Bibliothek konnte nicht geladen werden. Die Scheibe wird in 2D angezeigt.' },
        nl: { view: 'Weergave', group: 'Dartbordweergave', side: 'Schuin', front: 'Voorkant', camera: 'Camera wijzigen', scene: 'Dartbord en darts in 3D', loading: '3D-dartbord laden…', fallback: 'De browser kan geen 3D-graphics weergeven. Het bord wordt in 2D weergegeven.', libraryFallback: 'De 3D-bibliotheek kon niet worden geladen. Het bord wordt in 2D weergegeven.' }
    };
    const buttons = {
        two: document.getElementById('board-view-2d'),
        three: document.getElementById('board-view-3d'),
        camera: document.getElementById('board-camera')
    };
    const status = document.getElementById('board-view-status');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resources = new Set();
    const dartMaterials = new Map();
    const dartModels = [];
    const spiderMeshes = [];
    const spiderDetail = Object.freeze({ wireRadius: .00145, faceZ: .0054, bladeWidth: .003, bladeDepth: .004 });
    let mode = readPreference('dartsCareer.boardView', '3d');
    if (mode !== '2d' && mode !== '3d') mode = '3d';
    let cameraView = readPreference('dartsCareer.boardCamera', 'side') === 'front' ? 'front' : 'side';
    let THREE, renderer, scene, camera, modelParts;
    let boardFace, defaultBoardTexture, modBoardTexture = null, skinSource = null;
    let loading = false, failed = false, initialization = null;
    let failureReason = null;
    let seenDarts = [], animations = [], queueUntil = 0, frameId = null;
    let cameraFocus = null, cameraMotion = null, cameraLookAt = null, replayShot = null;
    let restorePending = true, suspendedAt = null, frameCount = 0;

    function readPreference(key, fallback) {
        try { return localStorage.getItem(key) || fallback; } catch (_error) { return fallback; }
    }
    function writePreference(key, value) {
        try { localStorage.setItem(key, value); } catch (_error) { /* Private mode can block storage. */ }
    }
    function text() { return labels[typeof currentLang === 'string' ? currentLang : 'pl'] || labels.en; }
    function active() { return mode === '3d' && !!renderer && !failed; }
    function visible() { return matchScreen.classList.contains('active') && !document.hidden; }
    function spectatorSpeed() {
        return typeof currentMatch !== 'undefined' && currentMatch?.isSpectator
            && typeof getSpectatorPlaybackSpeed === 'function' ? getSpectatorPlaybackSpeed() : 1;
    }
    function paused() { return typeof currentMatch !== 'undefined' && currentMatch?.isSpectator && currentMatch.spectatorPaused; }
    function track(resource) { resources.add(resource); return resource; }

    function refreshUI() {
        const copy = text();
        document.getElementById('board-view-label').textContent = copy.view;
        document.querySelector('.board-view-controls').setAttribute('aria-label', copy.group);
        buttons.two.setAttribute('aria-pressed', String(mode === '2d' || failed));
        buttons.three.setAttribute('aria-pressed', String(mode === '3d' && !failed));
        buttons.three.disabled = failed;
        buttons.camera.hidden = !active();
        buttons.camera.textContent = cameraView === 'side' ? copy.side : copy.front;
        buttons.camera.title = copy.camera;
        buttons.camera.setAttribute('aria-label', `${copy.camera}: ${buttons.camera.textContent}`);
        stage.hidden = !active();
        canvas2D.hidden = active();
        document.getElementById('match-board-view').dataset.view = active() ? '3d' : '2d';
        if (typeof refreshMatchBroadcastScoreboard === 'function') refreshMatchBroadcastScoreboard();
        stage.setAttribute('aria-label', `${copy.scene}${skinSource ? `: ${window.matchBoardSkin.getState().name}` : ''}`);
        status.hidden = !(failed || (loading && mode === '3d'));
        status.textContent = failed ? (failureReason === 'library' ? copy.libraryFallback : copy.fallback) : loading ? copy.loading : '';
    }

    // Local, deterministic noise never consumes the match's random-number stream.
    function noiseSource(seed) {
        return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    }

    function boardTextures() {
        const surface = document.createElement('canvas');
        surface.width = surface.height = 2048;
        const ctx = surface.getContext('2d');
        ctx.scale(2048 / 340, 2048 / 340);
        ctx.fillStyle = '#14171a'; ctx.fillRect(0, 0, 340, 340);
        const colors = { black: '#151817', white: '#e8d9b7', red: '#bf202c', green: '#008c4e' };
        const { innerBull, outerBull, trebleInner, trebleOuter, doubleInner } = matchBoardLayout.radii;
        const arc = (inner, outer, start, end, color) => {
            ctx.beginPath(); ctx.arc(170, 170, outer, start, end);
            if (inner) ctx.arc(170, 170, inner, end, start, true); else ctx.lineTo(170, 170);
            ctx.closePath(); ctx.fillStyle = color; ctx.fill();
        };
        for (let i = 0; i < 20; i++) {
            const start = -Math.PI / 2 - Math.PI / 20 + i * Math.PI / 10;
            const end = start + Math.PI / 10;
            arc(0, 130, start, end, i % 2 ? colors.white : colors.black);
            arc(doubleInner, 130, start, end, i % 2 ? colors.green : colors.red);
            arc(trebleInner, trebleOuter, start, end, i % 2 ? colors.green : colors.red);
        }
        arc(0, outerBull, 0, Math.PI * 2, colors.green);
        arc(0, innerBull, 0, Math.PI * 2, colors.red);
        const noise = noiseSource(71226);
        ctx.lineWidth = .12;
        for (let i = 0; i < 85000; i++) {
            const x = noise() * 260 - 130, y = noise() * 260 - 130;
            if (x * x + y * y > 130 * 130) continue;
            ctx.strokeStyle = noise() > .5 ? 'rgba(255,255,225,.16)' : 'rgba(0,0,0,.20)';
            ctx.beginPath(); ctx.moveTo(170 + x, 170 + y);
            const direction = noise() * Math.PI * 2, length = .3 + noise() * .9;
            ctx.lineTo(170 + x + Math.cos(direction) * length, 170 + y + Math.sin(direction) * length); ctx.stroke();
        }
        ctx.font = '700 19px Arial, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#e8ebec';
        dartboardOrder.forEach((number, i) => {
            const angle = -Math.PI / 2 + i * Math.PI / 10;
            const x = 170 + 148 * Math.cos(angle), y = 170 + 148 * Math.sin(angle);
            ctx.fillStyle = '#050708'; ctx.fillText(String(number), x + .7, y + .8);
            ctx.fillStyle = '#e8ebec'; ctx.fillText(String(number), x, y);
        });
        const texture = track(new THREE.CanvasTexture(surface));
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

        const bumpCanvas = document.createElement('canvas');
        bumpCanvas.width = bumpCanvas.height = 1024;
        const bumpContext = bumpCanvas.getContext('2d');
        const image = bumpContext.createImageData(1024, 1024);
        for (let i = 0; i < image.data.length; i += 4) {
            const value = Math.floor(100 + noise() * 70);
            image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
            image.data[i + 3] = 255;
        }
        bumpContext.putImageData(image, 0, 0);
        return { texture, bump: track(new THREE.CanvasTexture(bumpCanvas)) };
    }

    function addMesh(geometry, material, parent = scene) {
        const mesh = new THREE.Mesh(geometry, material);
        parent.add(mesh); return mesh;
    }
    function material(options) { return track(new THREE.MeshStandardMaterial(options)); }
    function addSpiderMesh(mesh) {
        mesh.visible = !skinSource;
        spiderMeshes.push(mesh);
        return mesh;
    }

    function createScene() {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' });
        renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback('context'); });
        stage.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(30, 1, .1, 30);
        scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x526051, 1.8));
        const key = new THREE.DirectionalLight(0xfff4e5, 3.1);
        key.position.set(-2.5, 3.5, 5); key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        Object.assign(key.shadow.camera, { left: -1.7, right: 1.7, top: 1.7, bottom: -1.7, near: .1, far: 12 });
        key.shadow.bias = -.00015; key.shadow.normalBias = .004;
        scene.add(key);
        const fill = new THREE.DirectionalLight(0xc9e2ff, 1.4);
        fill.position.set(3, -.5, 3); scene.add(fill);

        const rubber = material({ color: 0x182a33, roughness: .96 });
        const surround = addMesh(track(new THREE.CylinderGeometry(1.43, 1.43, .14, 96)), rubber);
        surround.rotation.x = Math.PI / 2; surround.position.z = -.13; surround.receiveShadow = true;
        const boardBody = addMesh(track(new THREE.CylinderGeometry(170 / 130, 170 / 130, .16, 96)), material({ color: 0x111415, roughness: .87 }));
        boardBody.rotation.x = Math.PI / 2; boardBody.position.z = -.08; boardBody.castShadow = true;
        const { texture, bump } = boardTextures();
        defaultBoardTexture = texture;
        boardFace = addMesh(track(new THREE.CircleGeometry(170 / 130, 192)), material({ map: texture, bumpMap: bump, bumpScale: .003, roughness: .94 }));
        boardFace.position.z = .003; boardFace.receiveShadow = true;
        refreshSkin();

        const metal = material({ color: 0xd8e0e3, metalness: .66, roughness: .31 });
        const { innerBull, outerBull, trebleInner, trebleOuter, doubleInner } = matchBoardLayout.radii;
        for (const radius of [innerBull, outerBull, trebleInner, trebleOuter, doubleInner, 130, 163]) {
            const ring = addSpiderMesh(addMesh(track(new THREE.TorusGeometry(radius / 130,
                radius === 163 ? .004 : spiderDetail.wireRadius, 8, 192)), metal));
            ring.position.z = spiderDetail.faceZ;
        }
        const bladeGeometry = track(new THREE.BoxGeometry((130 - outerBull) / 130, spiderDetail.bladeWidth, spiderDetail.bladeDepth));
        for (let i = 0; i < 20; i++) {
            const angle = Math.PI / 2 + Math.PI / 20 - i * Math.PI / 10;
            const blade = addSpiderMesh(addMesh(bladeGeometry, metal));
            blade.rotation.z = angle;
            const middle = (130 + outerBull) / 2;
            blade.position.set(middle / 130 * Math.cos(angle), middle / 130 * Math.sin(angle), spiderDetail.faceZ);
        }
        createModelParts();
        updateCamera();
    }

    function refreshSkin() {
        if (!boardFace || !renderer) return;
        const surface = window.matchBoardSkin?.getCanvas() || null;
        if (surface === skinSource) return;
        if (modBoardTexture) { resources.delete(modBoardTexture); modBoardTexture.dispose(); modBoardTexture = null; }
        skinSource = surface;
        if (surface) {
            modBoardTexture = track(new THREE.CanvasTexture(surface));
            modBoardTexture.colorSpace = THREE.SRGBColorSpace;
            modBoardTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        }
        boardFace.material.map = modBoardTexture || defaultBoardTexture;
        boardFace.material.bumpScale = surface ? .0008 : .003;
        boardFace.material.needsUpdate = true;
        // A photographic skin already contains its own spider. Hiding the generated
        // one prevents parallax from drawing a second wire over doubles and trebles.
        spiderMeshes.forEach(mesh => { mesh.visible = !surface; });
        refreshUI(); requestRender();
    }

    function createModelParts() {
        const cylinder = (top, bottom, length) => {
            const geometry = track(new THREE.CylinderGeometry(top, bottom, length, 24));
            geometry.rotateX(Math.PI / 2); return geometry;
        };
        const barrel = points => {
            const geometry = track(new THREE.LatheGeometry(points.map(([radius, z]) => new THREE.Vector2(radius, z)), 32));
            geometry.rotateX(Math.PI / 2); return geometry;
        };
        const wing = points => {
            const shape = new THREE.Shape();
            shape.moveTo(points[0][0], points[0][1]);
            points.slice(1).forEach(point => shape.lineTo(point[0], point[1]));
            shape.closePath();
            const geometry = track(new THREE.ExtrudeGeometry(shape, { depth: .0018, bevelEnabled: false }));
            geometry.rotateX(Math.PI / 2); return geometry;
        };
        const flights = {
            standard: wing([[0, 0], [.034, .006], [.078, .036], [.080, .142], [.050, .180], [0, .170]]),
            kite: wing([[0, 0], [.032, .008], [.072, .050], [.078, .095], [.044, .178], [0, .164]]),
            pear: wing([[0, 0], [.030, .006], [.061, .030], [.075, .078], [.068, .132], [.041, .177], [0, .164]])
        };
        const stripe = new THREE.Shape();
        stripe.moveTo(0, .078); stripe.lineTo(.071, .078); stripe.lineTo(.071, .092);
        stripe.lineTo(0, .092); stripe.closePath();
        const stripeGeometry = track(new THREE.ShapeGeometry(stripe));
        stripeGeometry.rotateX(Math.PI / 2);
        modelParts = {
            tip: cylinder(.006, .0007, .21),
            barrels: {
                straight: barrel([[.0165, -.1025], [.0195, -.088], [.020, .072], [.017, .1025]]),
                torpedo: barrel([[.0135, -.1025], [.0185, -.078], [.022, -.025], [.022, .025], [.0185, .078], [.014, .1025]]),
                scallop: barrel([[.0155, -.1025], [.0205, -.073], [.020, -.042], [.0168, -.014], [.0168, .018], [.0205, .068], [.016, .1025]])
            },
            neck: cylinder(.017, .0155, .04), shaft: cylinder(.0155, .016, .13),
            flights, stripe: stripeGeometry,
            flightEdges: Object.fromEntries(Object.entries(flights).map(([key, geometry]) => [key, track(new THREE.EdgesGeometry(geometry))])),
            patternRing: track(new THREE.TorusGeometry(.0201, .0008, 6, 28)),
            patternMicro: track(new THREE.TorusGeometry(.0199, .00045, 5, 24)),
            patternShark: track(new THREE.TorusGeometry(.0204, .00135, 7, 28))
        };
    }

    function createDart(data, presentation = null) {
        const group = new THREE.Group();
        const side = data.dartSide || (typeof currentMatch !== 'undefined' && currentMatch?.turn === 'p2' ? 'p2' : 'p1');
        const appearance = data.dartStyle || (typeof window.getMatchDartLoadout === 'function'
            ? window.getMatchDartLoadout(side) : null) || {
            shaftColor: '#263640', flightColor: data.color || '#f1c40f', barrelColor: '#c7cdd1',
            tipColor: '#d9e0e4', barrelShape: 'straight', flightShape: 'standard', barrelPattern: 'rings', patternAccent: '#111820'
        };
        const cachedMaterial = (kind, color, options, line = false) => {
            const key = `${kind}:${color}`;
            if (!dartMaterials.has(key)) dartMaterials.set(key, line
                ? track(new THREE.LineBasicMaterial({ color, ...options }))
                : material({ color, ...options }));
            return dartMaterials.get(key);
        };
        const tipPaint = cachedMaterial('tip', appearance.tipColor, { metalness: .72, roughness: .2 });
        const barrelPaint = cachedMaterial('barrel', appearance.barrelColor, { metalness: .65, roughness: .24 });
        const shaftPaint = cachedMaterial('shaft', appearance.shaftColor, { metalness: .12, roughness: .4 });
        const flightPaint = cachedMaterial('flight', appearance.flightColor, {
            roughness: .48, metalness: .02, side: THREE.DoubleSide, transparent: true, opacity: .94
        });
        const detailPaint = cachedMaterial('detail', appearance.patternAccent, { metalness: .48, roughness: .28, side: THREE.DoubleSide });
        const edgePaint = cachedMaterial('edge', appearance.patternAccent, { transparent: true, opacity: .78 }, true);
        const part = (geometry, appearance, z) => {
            const mesh = addMesh(geometry, appearance, group); mesh.position.z = z; mesh.castShadow = true; return mesh;
        };
        // The tip stays anchored to the scored hit; length is added towards the tail.
        part(modelParts.tip, tipPaint, .100);
        part(modelParts.barrels[appearance.barrelShape] || modelParts.barrels.straight, barrelPaint, .306);
        part(modelParts.neck, shaftPaint, .426);
        part(modelParts.shaft, shaftPaint, .507);
        const pattern = appearance.barrelPattern;
        const positions = pattern === 'rings' ? Array.from({ length: 9 }, (_, i) => .226 + i * .020)
            : pattern === 'micro' ? Array.from({ length: 15 }, (_, i) => .216 + i * .0125)
                : pattern === 'shark' ? Array.from({ length: 5 }, (_, i) => .238 + i * .034) : [];
        const patternGeometry = pattern === 'micro' ? modelParts.patternMicro
            : pattern === 'shark' ? modelParts.patternShark : modelParts.patternRing;
        positions.forEach(z => part(patternGeometry, detailPaint, z));
        const flightShape = modelParts.flights[appearance.flightShape] ? appearance.flightShape : 'standard';
        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2;
            part(modelParts.flights[flightShape], flightPaint, .548).rotation.z = angle;
            part(modelParts.stripe, detailPaint, .548).rotation.z = angle;
            const edge = new THREE.LineSegments(modelParts.flightEdges[flightShape], edgePaint);
            edge.position.z = .548; edge.rotation.z = angle; group.add(edge);
        }
        const display = presentation?.point || matchBoardLayout.toDisplayPoint(data);
        const x = (display.x - 170) / 130, y = (170 - display.y) / 130;
        // Tilt varies deterministically, so changing the view cannot affect a future throw.
        const tilt = Math.sin(data.x * .37 + data.y * .23);
        group.position.set(x, y, .008);
        const pose = presentation?.pose || data.dartPose || { x: -.34 - tilt * .045, y: .08 + tilt * .025, z: tilt * .22 };
        group.rotation.set(pose.x, pose.y, pose.z);
        scene.add(group);
        const dart = { group, data, appearance, x, y, rotation: group.rotation.clone() };
        dartModels.push(dart); return dart;
    }

    function enqueue(dart, bouncing = false, durationScale = 1, replay = false) {
        if (reducedMotion.matches) {
            if (bouncing) { scene.remove(dart.group); dartModels.splice(dartModels.indexOf(dart), 1); }
            requestRender(); return;
        }
        const speed = spectatorSpeed();
        const now = suspendedAt ?? performance.now();
        const earlyBounce = bouncing && dart.data.collision?.bounced;
        const impactProgress = earlyBounce ? Math.max(.55, 1 - (dart.data.collision.contact[2] - .008) / 2.7) : 1;
        // Live darts travel more briskly; replays retain the original timing so slow-motion stays readable.
        const baseFlight = replay ? (dart.data.collision ? 480 : 340) : (dart.data.collision ? 405 : 285);
        const flight = Math.max(45, baseFlight * impactProgress * durationScale / speed);
        const start = Math.max(now, queueUntil);
        const settle = bouncing ? Math.max(80, 420 * durationScale / speed) : Math.max(35, 180 * durationScale / speed);
        animations.push({ dart, bouncing, replay, start, flight, settle, end: start + flight + settle,
            impacted: false, impactCallbacks: [] });
        queueUntil = start + flight + (bouncing ? settle : 0);
        dart.group.visible = false;
        requestRender();
    }

    function focusPoint(target) {
        if (!target || target.sector === 25) return new THREE.Vector3(0, 0, .08);
        const index = dartboardOrder.indexOf(Number(target.sector));
        if (index < 0) return new THREE.Vector3(0, 0, .08);
        const radius = target.mult === 2 ? .965 : target.mult === 3 ? .58 : .78;
        const angle = Math.PI / 2 - index * Math.PI / 10;
        return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, .08);
    }

    function cameraPose(target = cameraFocus) {
        const narrow = Math.min(1, camera.aspect || 1);
        if (!target) {
            return cameraView === 'front'
                ? { position: new THREE.Vector3(.12 / narrow, .08 / narrow, 5.85 / narrow), look: new THREE.Vector3(0, 0, .08) }
                : { position: new THREE.Vector3(-2.65 / narrow, .75 / narrow, 5.25 / narrow), look: new THREE.Vector3(0, 0, .08) };
        }
        const look = focusPoint(target);
        return cameraView === 'front'
            ? { position: new THREE.Vector3(look.x + .04 / narrow, look.y + .04 / narrow, 2.58 / narrow), look }
                : { position: new THREE.Vector3(look.x - 1.18 / narrow, look.y + .34 / narrow, 2.42 / narrow), look };
    }

    function replayCameraPose(name, target) {
        const narrow = Math.min(1, camera.aspect || 1), look = focusPoint(target);
        if (name === 'front-tight') {
            return { position: new THREE.Vector3(look.x + .025 / narrow, look.y + .025 / narrow, 1.92 / narrow), look };
        }
        if (name === 'left-low') {
            return { position: new THREE.Vector3(look.x - .78 / narrow, look.y - .52 / narrow, 1.82 / narrow), look };
        }
        return { position: new THREE.Vector3(look.x - 1.08 / narrow, look.y + .30 / narrow, 1.98 / narrow), look };
    }

    function applyCameraPose(pose) {
        camera.position.copy(pose.position);
        cameraLookAt = pose.look.clone();
        camera.lookAt(cameraLookAt);
    }

    function animateCameraTo(pose, duration = 520) {
        if (!camera || !pose) return false;
        if (reducedMotion.matches || duration <= 0) {
            cameraMotion = null; applyCameraPose(pose); requestRender(); return true;
        }
        cameraMotion = {
            fromPosition: camera.position.clone(),
            fromLook: (cameraLookAt || new THREE.Vector3(0, 0, .08)).clone(),
            toPosition: pose.position, toLook: pose.look,
            start: performance.now(), duration
        };
        requestRender(); return true;
    }

    function animateCamera(target, duration = 520) {
        if (!camera) return false;
        cameraFocus = target && Number.isFinite(Number(target.sector))
            ? { sector: Number(target.sector), mult: Number(target.mult) || 1 }
            : null;
        return animateCameraTo(cameraPose(cameraFocus), duration);
    }

    function setReplayShot(name, target, duration = 460) {
        if (!active() || !camera || !['front-tight', 'left-tight', 'left-low'].includes(name)) return false;
        const clean = target && Number.isFinite(Number(target.sector))
            ? { sector: Number(target.sector), mult: Number(target.mult) || 1 } : { sector: 25, mult: 2 };
        replayShot = { name, target: clean };
        return animateCameraTo(replayCameraPose(name, clean), duration);
    }

    function endReplayCamera() {
        if (!replayShot) return false;
        replayShot = null;
        updateCamera();
        return true;
    }

    function updateCameraMotion(now) {
        if (!cameraMotion) return false;
        const progress = Math.min(1, Math.max(0, (now - cameraMotion.start) / cameraMotion.duration));
        const eased = 1 - Math.pow(1 - progress, 3);
        camera.position.copy(cameraMotion.fromPosition).lerp(cameraMotion.toPosition, eased);
        cameraLookAt = cameraMotion.fromLook.clone().lerp(cameraMotion.toLook, eased);
        camera.lookAt(cameraLookAt);
        if (progress >= 1) cameraMotion = null;
        return true;
    }

    function updateCamera() {
        if (!camera) return;
        cameraMotion = null;
        applyCameraPose(replayShot ? replayCameraPose(replayShot.name, replayShot.target) : cameraPose());
        requestRender();
    }

    function resize() {
        if (!active()) return;
        const width = Math.round(stage.clientWidth), height = Math.round(stage.clientHeight);
        if (width <= 0 || height <= 0) return;
        const dimensions = renderer.getSize(new THREE.Vector2());
        // Supersampling keeps numbers and thin tips crisp, with a bounded pixel budget.
        const ratio = Math.min(2, Math.max(window.devicePixelRatio || 1, 1.5), Math.sqrt(1800000 / (width * height)));
        if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
        if (dimensions.x !== width || dimensions.y !== height) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height; camera.updateProjectionMatrix(); updateCamera();
        }
        requestRender();
    }

    function updateVisibility() {
        const running = active() && visible() && !paused();
        if (!running) {
            if (suspendedAt === null) suspendedAt = performance.now();
            if (frameId !== null) cancelAnimationFrame(frameId);
            frameId = null; return;
        }
        if (suspendedAt !== null) {
            const elapsed = performance.now() - suspendedAt;
            animations.forEach(animation => { animation.start += elapsed; animation.end += elapsed; });
            if (queueUntil) queueUntil += elapsed;
            suspendedAt = null;
        }
        resize(); requestRender();
    }

    function requestRender() {
        if (!active() || !visible() || paused() || frameId !== null) return;
        frameId = requestAnimationFrame(renderFrame);
    }

    function completeImpact(animation) {
        if (!animation || animation.impacted) return;
        animation.impacted = true;
        const callbacks = animation.impactCallbacks.splice(0);
        callbacks.forEach(callback => queueMicrotask(() => {
            try { callback(); } catch (_error) { /* Presentation callbacks cannot break rendering. */ }
        }));
    }

    function renderFrame(now) {
        frameId = null;
        if (!active() || !visible() || paused()) { updateVisibility(); return; }
        updateCameraMotion(now);
        dartModels.forEach(dart => dart.group.rotation.copy(dart.rotation));
        animations = animations.filter(animation => {
            const { dart, start, flight, settle, bouncing } = animation;
            const age = now - start;
            if (age < 0) return true;
            dart.group.visible = true;
            const collision = dart.data.collision;
            const planned = matchBoardLayout.toDisplayPoint(collision?.plannedPoint || dart.data);
            const plannedRotation = collision ? new THREE.Euler(collision.plannedPose.x, collision.plannedPose.y, collision.plannedPose.z) : dart.rotation;
            const incomingAxis = new THREE.Vector3(0, 0, 1).applyEuler(plannedRotation);
            const origin = new THREE.Vector3((planned.x - 170) / 130, (170 - planned.y) / 130, .008);
            const startPoint = origin.clone().addScaledVector(incomingAxis, 2.7 / incomingAxis.z);
            const impact = collision ? new THREE.Vector3(...matchBoardLayout.toDisplayWorld(collision.contact)) : null;
            const earlyBounce = bouncing && collision?.bounced;
            if (age < flight) {
                const t = age / flight;
                const contactAt = impact && !earlyBounce ? Math.max(.55, Math.min(.95, 1 - (impact.z - .008) / 2.7)) : 1;
                if (impact && t >= contactAt) {
                    const after = (t - contactAt) / (1 - contactAt);
                    const end = new THREE.Vector3(dart.x, dart.y, .008);
                    const finalAxis = new THREE.Vector3(0, 0, 1).applyEuler(dart.rotation);
                    const controlA = impact.clone().addScaledVector(new THREE.Vector3(...collision.normal), .16);
                    const controlB = end.clone().addScaledVector(finalAxis, .25);
                    const rest = 1 - after;
                    dart.group.position.copy(impact).multiplyScalar(rest ** 3)
                        .addScaledVector(controlA, 3 * rest * rest * after)
                        .addScaledVector(controlB, 3 * rest * after * after).addScaledVector(end, after ** 3);
                    const turn = Math.sqrt(after);
                    dart.group.rotation.set(plannedRotation.x + (dart.rotation.x - plannedRotation.x) * turn,
                        plannedRotation.y + (dart.rotation.y - plannedRotation.y) * turn,
                        plannedRotation.z + (dart.rotation.z - plannedRotation.z) * turn);
                    shakeContactedDart(dart, Math.sin(Math.PI * after) * .035);
                } else {
                    dart.group.position.copy(startPoint).lerp(impact || new THREE.Vector3(dart.x, dart.y, .008), t / contactAt);
                    dart.group.rotation.copy(plannedRotation);
                }
            } else if (bouncing) {
                completeImpact(animation);
                const t = Math.min(1, (age - flight) / settle);
                const bounceOrigin = earlyBounce ? impact : new THREE.Vector3(dart.x, dart.y, .008);
                const side = collision ? collision.normal[0] : .42;
                dart.group.position.set(bounceOrigin.x + side * .5 * t, bounceOrigin.y + .15 * t - 2.1 * t * t, bounceOrigin.z + .65 * t);
                dart.group.rotation.z = dart.rotation.z + t * 5;
                if (earlyBounce) shakeContactedDart(dart, Math.sin(Math.PI * t) * .045 * (1 - t));
                if (t === 1) {
                    scene.remove(dart.group); dartModels.splice(dartModels.indexOf(dart), 1); return false;
                }
            } else {
                completeImpact(animation);
                dart.group.position.set(dart.x, dart.y, .008);
                dart.group.rotation.copy(dart.rotation);
                const t = Math.min(1, (age - flight) / settle);
                dart.group.rotation.x += Math.sin(t * Math.PI * 5) * .07 * (1 - t);
                if (collision) shakeContactedDart(dart, Math.sin(t * Math.PI * 5) * .015 * (1 - t));
                if (t === 1) return false;
            }
            return true;
        });
        try { renderer.render(scene, camera); frameCount++; }
        catch (_error) { fallback(); return; }
        if (animations.length || cameraMotion) requestRender();
    }

    function shakeContactedDart(incoming, amount) {
        const index = incoming.data.collision?.obstacle;
        const previous = dartModels.filter(dart => dart !== incoming && seenDarts.includes(dart.data));
        const contacted = previous[index];
        if (contacted) contacted.group.rotation.z += amount;
    }

    function clear() {
        animations.forEach(completeImpact);
        if (scene) dartModels.forEach(dart => scene.remove(dart.group));
        dartModels.length = 0; seenDarts = []; animations = []; queueUntil = 0;
        requestRender();
    }

    function fallback(reason = 'graphics') {
        if (failed) return;
        failureReason = reason;
        failed = true; loading = false;
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
        clear();
        if (renderer) {
            try { renderer.dispose(); } catch (_error) { /* The context may already be lost. */ }
        }
        resources.forEach(resource => resource.dispose()); resources.clear();
        dartMaterials.clear(); renderer = null; scene = null; camera = null;
        boardFace = null; defaultBoardTexture = null; modBoardTexture = null; skinSource = null; spiderMeshes.length = 0; replayShot = null;
        stage.replaceChildren(); refreshUI(); drawDartboard();
    }

    // Classic scripts work for both file:// launches and HTTP hosting.
    function loadLibrary() {
        if (window.DartsThree?.WebGLRenderer) return Promise.resolve(window.DartsThree);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = libraryUrl; script.async = true;
            const rejectLibrary = () => {
                script.remove();
                const error = new Error('Unable to load the local 3D library');
                error.boardViewReason = 'library'; reject(error);
            };
            script.onerror = rejectLibrary;
            script.onload = () => {
                if (window.DartsThree?.WebGLRenderer) resolve(window.DartsThree);
                else rejectLibrary();
            };
            document.head.appendChild(script);
        });
    }

    function ensureScene() {
        if (initialization || failed) return;
        loading = true; refreshUI();
        initialization = loadLibrary().then(library => {
            THREE = library; createScene(); loading = false; restorePending = true;
            refreshUI(); updateVisibility(); drawDartboard();
        }).catch(error => fallback(error.boardViewReason || 'graphics'));
    }

    function sync(darts) {
        if (mode !== '3d' || failed) return false;
        if (!renderer) { if (visible()) ensureScene(); return false; }
        const currentDarts = darts.slice(-3);
        const presentations = matchBoardLayout.presentDarts(currentDarts);
        if (seenDarts.length > currentDarts.length || seenDarts.some((dart, i) => dart !== currentDarts[i])) clear();
        for (let i = seenDarts.length; i < currentDarts.length; i++) {
            const dart = createDart(currentDarts[i], presentations[i]);
            if (!restorePending) enqueue(dart);
        }
        seenDarts = currentDarts.slice(); restorePending = false;
        refreshUI(); requestRender(); return true;
    }

    function bounceOut(result) {
        if (!active() || !visible()) return false;
        const point = result.boardPoint || getDartboardHitPoint(result.bouncedSector, result.bouncedMult, result.bouncedSector, result.bouncedMult, () => .5);
        const side = typeof currentMatch !== 'undefined' && currentMatch?.turn === 'p2' ? 'p2' : 'p1';
        const color = side === 'p2' ? '#ecf0f1' : '#f1c40f';
        const dartStyle = typeof window.getMatchDartLoadout === 'function' ? window.getMatchDartLoadout(side) : null;
        enqueue(createDart({ ...point, color, dartSide: side, ...(dartStyle ? { dartStyle } : {}),
            dartPose: result.dartPose, collision: result.collision }), true); return true;
    }

    function setView(value) {
        if (value !== '2d' && value !== '3d' || value === '3d' && failed) return;
        mode = value; writePreference('dartsCareer.boardView', mode);
        clear(); restorePending = true;
        refreshUI(); updateVisibility(); drawDartboard();
    }

    function capture() {
        if (!active() || !renderer || !scene || !camera) return null;
        try {
            renderer.render(scene, camera);
            return renderer.domElement.toDataURL('image/jpeg', .9);
        } catch (_error) { return null; }
    }

    function replayLastDart(slowMotion = 2.1) {
        if (!active() || !visible() || !dartModels.length) return false;
        const dart = [...dartModels].reverse().find(model => seenDarts.includes(model.data));
        if (!dart) return false;
        animations = animations.filter(animation => animation.dart !== dart);
        queueUntil = performance.now();
        enqueue(dart, false, Math.max(1, Number(slowMotion) || 1), true);
        return true;
    }

    function replayThrow(data, slowMotion = 2.1) {
        const point = data?.boardPoint;
        if (!active() || !visible() || !point || !Number.isFinite(Number(point.x)) || !Number.isFinite(Number(point.y))) return false;
        stopReplay();
        const side = data.side === 'p2' ? 'p2' : 'p1';
        const color = side === 'p2' ? '#ecf0f1' : '#f1c40f';
        const dartStyle = typeof window.getMatchDartLoadout === 'function' ? window.getMatchDartLoadout(side) : null;
        const dart = createDart({ x: Number(point.x), y: Number(point.y), color, dartSide: side,
            ...(dartStyle ? { dartStyle } : {}), ...(data.dartPose ? { dartPose: data.dartPose } : {}),
            ...(data.collision ? { collision: data.collision } : {}) });
        enqueue(dart, Boolean(data.bounced), Math.max(1, Number(slowMotion) || 1), true);
        return true;
    }

    function stopReplay() {
        let stopped = false;
        animations = animations.filter(animation => {
            if (!animation.replay) return true;
            if (animation.bouncing || !seenDarts.includes(animation.dart.data)) {
                scene.remove(animation.dart.group);
                const index = dartModels.indexOf(animation.dart);
                if (index >= 0) dartModels.splice(index, 1);
            } else {
                animation.dart.group.visible = true;
                animation.dart.group.position.set(animation.dart.x, animation.dart.y, .008);
                animation.dart.group.rotation.copy(animation.dart.rotation);
            }
            stopped = true; return false;
        });
        if (stopped) { queueUntil = performance.now(); requestRender(); }
        return stopped;
    }

    window.matchBoard3D = {
        sync, clear, bounceOut, setView,
        focusTarget(sector, mult = 1) { return active() && animateCamera({ sector, mult }); },
        clearFocus() { return active() && animateCamera(null, 620); },
        capture, replayLastDart, replayThrow, stopReplay, setReplayShot, endReplayCamera,
        onNextImpact(callback) {
            if (typeof callback !== 'function' || !active() || !visible()) return false;
            const animation = [...animations].reverse().find(item => !item.replay && !item.impacted);
            if (!animation) return false;
            animation.impactCallbacks.push(callback);
            requestRender();
            return true;
        },
        animationDelay(baseDelay) {
            if (!active() || !visible()) return baseDelay;
            const speed = spectatorSpeed();
            const now = suspendedAt ?? performance.now();
            const remaining = Math.max(0, ...animations.map(animation => animation.end - now));
            const hold = reducedMotion.matches ? 0 : 350 / speed;
            // The spectator scheduler subsequently divides the base delay by its speed.
            return Math.max(baseDelay, Math.ceil((remaining + hold) * speed));
        },
        getState() {
            return { mode: active() ? '3d' : '2d', camera: cameraView, loading, failed, failureReason,
                cameraPosition: camera?.position.toArray(), cameraFocus: cameraFocus ? { ...cameraFocus } : null,
                replayCamera: replayShot ? { name: replayShot.name, target: { ...replayShot.target } } : null,
                cameraMoving: Boolean(cameraMotion), rings: matchBoardLayout.radii,
                darts: seenDarts.length, animations: animations.length, transientDarts: dartModels.length - seenDarts.length,
                frames: frameCount, pixelRatio: renderer?.getPixelRatio(), drawCalls: renderer?.info.render.calls,
                geometries: renderer?.info.memory.geometries, textures: renderer?.info.memory.textures,
                boardSkin: skinSource ? window.matchBoardSkin.getState().name : null,
                spider: { source: skinSource ? 'photographic' : 'generated', generated: spiderMeshes.length,
                    generatedVisible: spiderMeshes.filter(mesh => mesh.visible).length, ...spiderDetail },
                viewport: renderer ? renderer.getSize(new THREE.Vector2()).toArray() : null,
                dartDetails: dartModels.filter(dart => seenDarts.includes(dart.data)).map(dart => ({
                    tipLength: modelParts.tip.parameters.height, tilt: dart.rotation.x, point: { x: dart.data.x, y: dart.data.y },
                    appearance: { ...dart.appearance },
                    geometry: { shaftRadius: .016, barrelRadius: .020, flightWings: 4, wingAngleDegrees: 90 },
                    displayPoint: { x: 170 + dart.x * 130, y: 170 - dart.y * 130 },
                    pose: { x: dart.rotation.x, y: dart.rotation.y, z: dart.rotation.z }, collision: dart.data.collision || null,
                    renderedPosition: dart.group.position.toArray(), renderedPose: dart.group.rotation.toArray().slice(0, 3),
                    tailDirection: new THREE.Vector3(0, 0, 1).applyEuler(dart.rotation).toArray()
                })) };
        }
    };
    window.getMatchBoardAnimationDelay = delay => window.matchBoard3D.animationDelay(delay);
    window.refreshMatchBoardViewTranslations = refreshUI;
    window.addEventListener('dartboard-skin-change', refreshSkin);
    buttons.two.addEventListener('click', () => setView('2d'));
    buttons.three.addEventListener('click', () => setView('3d'));
    buttons.camera.addEventListener('click', () => {
        cameraView = cameraView === 'side' ? 'front' : 'side';
        writePreference('dartsCareer.boardCamera', cameraView); updateCamera(); refreshUI();
    });
    new MutationObserver(() => {
        updateVisibility();
        if (visible()) drawDartboard();
    }).observe(matchScreen, { attributes: true, attributeFilter: ['class'] });
    if (typeof ResizeObserver === 'function') new ResizeObserver(resize).observe(stage);
    document.addEventListener('visibilitychange', updateVisibility);
    document.addEventListener('click', event => {
        if (event.target.closest('.spectator-speed-controls')) updateVisibility();
    });
    window.addEventListener('resize', resize);
    refreshUI();
})();
