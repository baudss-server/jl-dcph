// assets/js/va-hero-models.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Target container
const container = document.getElementById('three-js-container');

if (!container) {
  console.warn('[VA 3D] Container #three-js-container not found.');
} else {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    65,
    1, // temp aspect; corrected after first size()
    0.1,
    1000
  );

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const dir = new THREE.DirectionalLight(0xffffff, 1.75);
  dir.position.set(5, 5, 6);
  scene.add(dir);

  // Size / resize helpers
  const sizeRenderer = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || Math.max(320, Math.round(w * 0.5));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  // First size
  sizeRenderer();

  // Keep sized with container
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(sizeRenderer);
    ro.observe(container);
  } else {
    window.addEventListener('resize', sizeRenderer);
  }

  // Camera position
  camera.position.set(0, 0.2, 2.2);

  // Load model (robust relative URL from this JS file)
  const loader = new GLTFLoader();
  // from /assets/js/  →  ../models/headsets/scene.gltf
  const MODEL_URL = new URL('../models/headsets/scene.gltf', import.meta.url);

  let model = null;

  loader.load(
    MODEL_URL.href,
    (gltf) => {
      model = gltf.scene;
      // Tweak scale/position a bit so it sits nicely in frame
      model.scale.set(0.08, 0.08, 0.08);
      model.position.set(0, -0.5, 0);
      scene.add(model);
      // One more resize in case layout settled after load
      sizeRenderer();
    },
    undefined,
    (err) => {
      console.error('[VA 3D] GLTF load error:', err);
    }
  );

  // Animate
  const tick = () => {
    requestAnimationFrame(tick);
    if (model) model.rotation.y += 0.005;
    renderer.render(scene, camera);
  };
  tick();
}
