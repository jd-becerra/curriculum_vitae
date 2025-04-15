// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createAnimationMixer } from './animation.js';

const clickableObjects = [
  'notebook',
  'linkedin',
  'github',
  'gmail',
];

function loadGLTF(scene, loop, path, position, scale, name = '') {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        model.name = name;
        model.position.set(...position);
        model.scale.set(scale, scale, scale);
        scene.add(model);
        model.renderOrder = 1;

        // create animation mixer
        model.mixer = createAnimationMixer(gltf);
        loop.updatables.push({
          tick: (delta) => {
            // Make animation faster (too slow on threejs)
            model.mixer.update(delta * 1.5);
          },
        });

        // Set clickable property for all objects inside the model if applicable
        if (clickableObjects.includes(model.name) || (model.parent && clickableObjects.includes(model.parent.name))) {
          model.traverse((child) => {
            if (child.isMesh) {
              console.log(`Setting clickable for ${child.name}`);
              child.clickable = true; // Set clickable property
              child.material.emissive = child.material.color.clone(); // Store original color
              child.material.emissiveIntensity = 0.5; // Set emissive intensity
            }
          });
        }

        resolve(model); // Return the model when it's loaded
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export { loadGLTF };
