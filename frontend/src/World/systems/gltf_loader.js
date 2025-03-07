// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function loadGLTF(scene, path, position, scale) {
  const loader = new GLTFLoader();
  let model;
  loader.load(path, (gltf) => {
    model = gltf.scene;
    // name the model with the last part of the path (without the extension)
    model.name = path.split("/").pop().split(".")[0];

    model.position.set(...position);
    model.scale.set(scale, scale, scale);
    scene.add(model);
    model.renderOrder = 1;
  });
}

export { loadGLTF };
