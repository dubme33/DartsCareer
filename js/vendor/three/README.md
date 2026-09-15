Three.js 0.180.0, vendored from the published npm package. License: MIT (see LICENSE).

Runtime: three.bundle.min.js, a classic script exposing window.DartsThree. This supports
direct file:// launches as well as HTTP hosting, without requiring module requests.
The original three.module.min.js and three.core.min.js are kept as build inputs.
Source: https://github.com/mrdoob/three.js/tree/r180
Package: https://www.npmjs.com/package/three/v/0.180.0

The game loads this library only when the 3D match view is opened. No CDN is used at runtime.

Bundle generation (esbuild 0.25.9):

    esbuild js/vendor/three/three.module.min.js --bundle --format=iife --global-name=DartsThree --minify --legal-comments=inline --target=es2020 --outfile=js/vendor/three/three.bundle.min.js
