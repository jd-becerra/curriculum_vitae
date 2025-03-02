// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function loadGLTF(scene, path, position, scale) {
  const loader = new GLTFLoader();
  loader.load(path, (gltf) => {
    const model = gltf.scene;
    model.position.set(...position);
    model.scale.set(scale, scale, scale);
    scene.add(model);
  });
}

export { loadGLTF };
