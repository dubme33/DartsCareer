/* One on-demand WebGL preview, reused when the shop updates. No background animation loop. */
(function (root) {
    'use strict';
    const libraryUrl = new URL('vendor/three/three.bundle.min.js?v=0.180.0&classic=1', document.currentScript.src).href;
    let renderer, scene, camera, pivot, model, factory, observer, host, request = 0, failed = false, loading;
    let look = { x: .55, y: Math.PI / 2, z: .16 };
    function render() {
        if (!renderer || !host?.isConnected || !host.clientWidth) return;
        const width = host.clientWidth, height = host.clientHeight, aspect = width / height;
        const span = model.userData.dimensions.totalLength * root.dartModel.scale * 1.18;
        const vertical = Math.max(.35, span / aspect);
        camera.left = -vertical * aspect / 2; camera.right = vertical * aspect / 2;
        camera.top = vertical / 2; camera.bottom = -vertical / 2; camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        pivot.rotation.set(look.x, look.y, look.z);
        renderer.render(scene, camera);
    }
    function reset() { look = { x: .55, y: Math.PI / 2, z: .16 }; render(); }
    function initialize(THREE) {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
        scene = new THREE.Scene(); scene.environment = root.dartModel.studioEnvironment(THREE);
        scene.add(new THREE.HemisphereLight('#f3f7ff', '#465568', 2));
        const key = new THREE.DirectionalLight('#ffffff', 3.2); key.position.set(-1, 2, 3); scene.add(key);
        const rim = new THREE.DirectionalLight('#bfd8ff', 2); rim.position.set(1, -1, 2); scene.add(rim);
        camera = new THREE.OrthographicCamera(-1, 1, .5, -.5, .01, 10); camera.position.set(0, 0, 3);
        pivot = new THREE.Group(); pivot.rotation.order = 'ZXY'; scene.add(pivot); factory = root.dartModel.createFactory(THREE);
        const canvas = renderer.domElement;
        canvas.tabIndex = 0; canvas.setAttribute('role', 'img');
        let drag;
        canvas.addEventListener('pointerdown', event => {
            drag = { x: event.clientX, y: event.clientY, look: { ...look } }; canvas.setPointerCapture(event.pointerId);
        });
        canvas.addEventListener('pointermove', event => {
            if (!drag) return;
            look.x = drag.look.x + (event.clientX - drag.x) * .014;
            look.y = Math.max(.45, Math.min(2.7, drag.look.y + (event.clientY - drag.y) * .01)); render();
        });
        for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, () => { drag = null; });
        canvas.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
            event.preventDefault();
            if (event.key === 'Home') return reset();
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') look.x += event.key === 'ArrowLeft' ? -.18 : .18;
            else look.y = Math.max(.45, Math.min(2.7, look.y + (event.key === 'ArrowUp' ? -.12 : .12)));
            render();
        });
        canvas.addEventListener('webglcontextlost', event => {
            event.preventDefault(); failed = true;
            observer?.disconnect(); host?.classList.remove('has-3d'); canvas.remove();
            factory.dispose(); scene.environment.dispose(); renderer.dispose();
        });
        if (typeof ResizeObserver === 'function') observer = new ResizeObserver(render);
        else root.addEventListener('resize', render);
    }
    async function mount(target, appearance, label) {
        host = target; const ticket = ++request;
        if (!host || failed) return;
        try {
            if (!loading) loading = root.dartModel.loadThree(libraryUrl).then(initialize);
            await loading;
            if (ticket !== request || !host.isConnected) return;
            if (model) { pivot.remove(model); factory.release(model); }
            model = factory.create(appearance);
            model.position.z = -model.userData.dimensions.totalLength * root.dartModel.scale / 2;
            pivot.add(model); host.appendChild(renderer.domElement); host.classList.add('has-3d');
            renderer.domElement.setAttribute('aria-label', label);
            observer?.disconnect(); observer?.observe(host); render();
        } catch (_error) {
            failed = true; host?.classList.remove('has-3d');
            factory?.dispose(); scene?.environment?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
        }
    }
    root.dartPreview = Object.freeze({ mount, reset });
})(window);
