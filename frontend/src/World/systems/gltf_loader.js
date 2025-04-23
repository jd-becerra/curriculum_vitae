// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createAnimationMixer } from './animation.js';
import { LoopRepeat, LoopPingPong, Color } from 'three';

const clickableObjects = [
  'notebook',
  'linkedin',
  'github',
  'gmail',
];

function loadGLTF(
    scene,
    loop,
    loadingManager,
    path,
    position,
    scale,
    name = '',
    selectable = false,
    area = "",
    lod = null,
    lod_level = -1,
  ) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader(loadingManager);
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        model.name = name;
        model.position.set(...position);
        model.scale.set(scale, scale, scale);
        model.renderOrder = 1;

        // create animation mixer
        model.mixer = createAnimationMixer(gltf);
        if (model.mixer) {
          console.log(`Animation mixer created for ${model.name}`);
          loop.updatables.push({
            tick: (delta) => {

              let time = delta;

              if (model.name == 'fire') time = delta * 0.5; // Slow down fire animation
              model.mixer.update(delta);
            },
          });
        }
        model.selectable = selectable;
        model.area = area;

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

        // These models have animations that should be played automatically
        if (model.name === 'fire'  || model.name === 'candle_flame' || model.name === 'butterfly') {

          if (model.mixer && model.mixer.animations.length > 0) {
            const mixer = model.mixer;
            const clip = mixer.animations[0]; // Get the first animation clip
            console.log('Fireplace animation found:', clip);
            const action = mixer.clipAction(clip);
            action.setLoop(LoopPingPong); // Loop the animation
            action.clampWhenFinished = false; // Allow looping
            action.play();
          } else {
            console.error('No animation found for fireplace model');
          }
        }

        // If we have an lod, add model to the corresponding lod level
        if (lod && lod_level !== null && lod_level >= 0) {
          lod.addLevel(model, lod_level);
        }

        model.onAfterRender = (renderer, scene, camera) => {
          console.log(`Model ${model.name} rendered`);
        };


        scene.add(model);
        resolve(model); // Return the model when it's loaded
      },
      // called while loading
      (xhr) => {},
      (error) => reject(error)
    );
  });
}

export { loadGLTF };
