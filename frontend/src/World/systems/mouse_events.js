import { MathUtils } from 'three';
import {Tween, Easing} from '@tweenjs/tween.js';
import { AnimationClip, LoopOnce, LoopRepeat } from 'three';

// State variables
let isBookOpen = false;
let isSocialsAreaActive = false;

function getAnimation(animations, name) {
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    if (animation.name === name) {
      return animation;
    }
  }
  return null;
}

function handleSocialsHover(object, loop, picker) {
  // Make the object bounce
  loop.updatables.push({
    tick: (delta) => {
      object.rotation.y += delta * 0.1;
      object.rotation.x += delta * 0.1;
      object.rotation.z += delta * 0.1;
    }
  });

}


function handleAboutClick(camera, controls, object, loop) {
  const minDistance = 28;
  const maxDistance = 32;
  const to = {x: -35, y: 0, z: -10};

  const angles = {
    yUp: MathUtils.degToRad(95),
    yDown: MathUtils.degToRad(90),
    xLeft: MathUtils.degToRad(80),
    xRight: MathUtils.degToRad(95)
  }
  moveToArea(controls, loop, to, angles);
}

function handleSocialsClick(camera, controls, object, loop) {
  const minDistance = 28;
  const maxDistance = 32;
  const to = {x: -40, y: 5, z: -24};
  const angles = {
    yDown: MathUtils.degToRad(90),
    yUp: MathUtils.degToRad(92),
    xLeft: MathUtils.degToRad(85),
    xRight: MathUtils.degToRad(87)
  }
  moveToArea(controls, loop, to, angles);
}

function toggleIsSocialsActive() {
  isSocialsAreaActive = !isSocialsAreaActive;
  return isSocialsAreaActive;
}

function getIsSocialsActive() {
  return isSocialsAreaActive;
}

function moveToArea(controls, loop, to, angles) {
  controls.minDistance = 28;
  controls.maxDistance = 32;

  const from = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z
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
    polar: [angles.yDown, angles.yUp], // Y axis
    azimuth: [angles.xLeft, angles.xRight] // X axis
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

  // Determine which animation to play
  let bookAnimation = isBookOpen ? getAnimation(mixer.animations, "Close") : getAnimation(mixer.animations, "Open");
  isBookOpen = !isBookOpen;

  if (!bookAnimation) {
    console.error('No animation found for object:', object.name);
    return;
  }

  // Stop all other animations to prevent conflicts
  mixer.stopAllAction();

  // Play the new animation
  const animation = mixer.clipAction(bookAnimation, mixer.target);
  animation.setLoop(LoopOnce);
  animation.clampWhenFinished = true;
  animation.reset().play(); // Ensure animation starts fresh
}

export {
  handleAboutClick,
  handleOpenBook,
  handleSocialsClick,
  handleSocialsHover,
  toggleIsSocialsActive,
  getIsSocialsActive,
};
