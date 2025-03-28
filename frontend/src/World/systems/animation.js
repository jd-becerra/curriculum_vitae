// Handles animation of objects in Three.js
import { AnimationMixer } from 'three';

function createAnimationMixer(gltf, loop) {
  const mixer = new AnimationMixer(gltf);
  const clips = gltf.animations;
  mixer.animations = clips;

  // Set the animation root (might be a skeleton or the model itself)
  const model = gltf.scene;
  mixer.target = model;
  const skeleton = model.getObjectByProperty('type', 'Bone');
  if (skeleton) {
    mixer.target = skeleton;
  }

  return mixer;
}

export { createAnimationMixer };
