// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function loadGLTF(scene, path, position, scale, name = '') {
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

        resolve(model); // Return the model when it's loaded
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export { loadGLTF };
