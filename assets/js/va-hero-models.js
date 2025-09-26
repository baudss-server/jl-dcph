import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Get the container for the 3D model
// A Y U S I N: Gamitin ang tamang ID na 'three-js-container'
const container = document.getElementById('three-js-container');

if (container) {
    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // 2. Renderer setup
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // 3. Add lights (Ambient at Directional para may anino at highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Tumaas ang intensity
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    let model; // Idineklara ang model sa labas ng loader.load

    // 4. Load the 3D model (gamit ang GLTFLoader)
    const loader = new GLTFLoader();
    loader.load(
        // A Y U S I N: Gumagamit ng absolute path para sa modelo
        '/assets/models/headsets/scene.gltf', 
        function (gltf) {
            model = gltf.scene; // I-assign ang gltf.scene sa model variable
            // Scale and position the model to be visible
            model.scale.set(0.08, 0.08, 0.08); 
            model.position.y = -0.5;
            scene.add(model);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // 5. Camera position
    camera.position.z = 2.5; // In-adjust ang camera para mas malapit sa model

    // 6. Animation loop
    function animate() {
        requestAnimationFrame(animate);
        // Ito ang linya na magpapa-ikot sa modelo.
        if (model) {
            model.rotation.y += 0.005; 
        }
        renderer.render(scene, camera);
    }
    animate();

    // 7. Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}