// Handles animation of objects in Three.js
import { AnimationMixer } from 'three';

function createAnimationMixer(gltf, loop) {
  const clips = gltf.animations;
  if (clips.length === 0) {
    return null;
  }
  const model = gltf.scene;
  const skeleton = model.getObjectByProperty('type', 'Bone');

  const mixer = new AnimationMixer(skeleton || model);
  mixer.animations = clips;
  mixer.target = skeleton || model;

  return mixer;
}

export { createAnimationMixer };
