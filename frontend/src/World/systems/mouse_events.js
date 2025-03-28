import { MathUtils } from 'three';
import {Tween, Easing} from '@tweenjs/tween.js';
import { AnimationClip } from 'three';

function handleAboutClick(camera, controls, object, loop) {
  controls.minDistance = 28;
  controls.maxDistance = 32;

  const from = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z
  };
  const to = {
    x: -35,
    y: 0,
    z: -10
  };

  const t = new Tween(from)
    .to(to, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      controls.target.set(from.x, from.y, from.z);
      controls.update();
    })
    .start();

  // Make second tween for polar and azimuth angles
  const fromAngles = {
    polar: [controls.minPolarAngle, controls.maxPolarAngle],
    azimuth: [controls.minAzimuthAngle, controls.maxAzimuthAngle]
  };
  const toAngles = {
    polar: [MathUtils.degToRad(90), MathUtils.degToRad(95)],
    azimuth: [MathUtils.degToRad(80), MathUtils.degToRad(90)]
  };

  const t2 = new Tween(fromAngles)
    .to(toAngles, 1000)
    .easing(Easing.Quadratic.Out)
    .onUpdate(() => {
      controls.minPolarAngle = fromAngles.polar[0];
      controls.maxPolarAngle = fromAngles.polar[1];
      controls.minAzimuthAngle = fromAngles.azimuth[0];
      controls.maxAzimuthAngle = fromAngles.azimuth[1];
      controls.update();
    })
    .start();


  loop.updatables.push({
    tick: (delta) => {
      t.update();
      t2.update();
    }
  });
}

function handleOpenBook(object) {
  let parent = object.parent;
  while (parent && !parent.mixer) {
    parent = parent.parent;
  }
  if (!parent) {
    console.error('No parent with mixer found for object:', object.name);
    return;
  }

  const mixer = parent.mixer;

  if (!mixer || mixer == undefined) {
    console.error('No mixer found for object:', object.name);
    return;
  }
  if (!mixer.animations || mixer.animations.length === 0) {
    console.error('No animations found for object:', object.name);
    return;
  }

  // Play first animation

  const animation = mixer.clipAction(mixer.animations[0], mixer.target);
  animation.play();
}

export { handleAboutClick, handleOpenBook };
