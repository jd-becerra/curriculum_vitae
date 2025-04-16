// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createAnimationMixer } from './animation.js';
import { LoopRepeat, LoopPingPong } from 'three';

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
        if (model.mixer) {
          console.log(`Animation mixer created for ${model.name}`);
          loop.updatables.push({
            tick: (delta) => {
              // Make animation faster (too slow on threejs)
              model.mixer.update(delta * 1.5);
            },
          });
        }

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

        // If model name is "fireplace", start fire animation (0th animation)
        if (model.name === 'fireplace') {
          if (model.mixer && model.mixer.animations.length > 0) {
            const mixer = model.mixer;
            const action = mixer.clipAction(mixer.animations[0], mixer.target);
            action.setLoop(LoopPingPong); // Loop the animation
            action.clampWhenFinished = false; // Allow looping
            action.play();
          } else {
            console.error('No animation found for fireplace model');
          }
        }


        resolve(model); // Return the model when it's loaded
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export { loadGLTF };
