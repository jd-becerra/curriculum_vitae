// Handles animation of objects in Three.js
import { AnimationMixer } from 'three';

function createAnimationMixer(gltf, loop) {
  const clips = gltf.animations;
  if (clips.length === 0) {
    return null;
  }

  console.log(`Animation clips found: ${gltf.animations[0].name}`);

  const mixer = new AnimationMixer(gltf);
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
