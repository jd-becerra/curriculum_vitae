// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createAnimationMixer } from './animation.js';
import { LoopRepeat, LoopPingPong, Color } from 'three';

const trophies = [
  'LinkedIn',
  'Github',
  'Gmail',

];

function loadGLTF(
    scene,
    loop,
    loadingManager,
    path,
    position,
    scale,
    name = '',
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
          loop.updatables.push({
            tick: (delta) => {

              let time = delta;

              if (model.name == 'fire') time = delta * 0.5; // Slow down fire animation
              model.mixer.update(delta);
            },
          });
        }

        // Set clickable property for all objects inside the model if applicable
        if (name == 'trophies') {
          model.traverse((child) => {
            if (trophies.includes(child.name)) {
              child.clickable = true;
              child.area = 'socials';
            }
          });
        }
        if (name == 'notebook') {
          model.clickable = true;
          model.area = 'about_main';

          model.traverse((child) => {
            child.clickable = true;
            child.area = 'about_main';
          });
        }

        // These models have animations that should be played automatically
        if (name === 'fire'  || name === 'candle_flame' || name === 'butterfly') {
          if (model.mixer && model.mixer.animations.length > 0) {
            const mixer = model.mixer;
            const clip = mixer.animations[0]; // Get the first animation clip
            const action = mixer.clipAction(clip);
            action.setLoop(LoopPingPong); // Loop the animation
            action.clampWhenFinished = false; // Allow looping
            action.play();
          } else {
            console.error('No animation found for fireplace model');
          }
        }
        
        if (name == 'bookcase') {
          const hardSkills = model.getObjectByName('hard_skills');
          // set all children of hard skills as clickable
          hardSkills.traverse((child) => {
            child.clickable = true;
            child.area = 'about_skills';
          });
          const flower = model.getObjectByName('flower');
          flower.traverse((child) => {
            child.clickable = true;
            child.area = 'about_skills';

          });
        }

        // If we have an lod, add model to the corresponding lod level
        if (lod && lod_level !== null && lod_level >= 0) {
          lod.addLevel(model, lod_level);
        }

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
