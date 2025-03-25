import { Raycaster, MathUtils, Vector3 } from 'three';
import {Tween, Easing} from '@tweenjs/tween.js';

class PickHelper {
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }

  pick(normalizedPosition, scene, camera, controls, loop) {
    const time = loop.time;

    // Restore the color if there was a previously picked object
    if (this.pickedObject) {
      if (this.pickedObject.material && this.pickedObject.material.emissive) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      }
      this.pickedObject = null;
    }

    // Cast a ray through the camera frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);

    if (intersectedObjects.length > 0) {
      // Pick the first (closest) intersected object
      this.pickedObject = intersectedObjects[0].object;

      if (!this.pickedObject.clickable) {
        return;
      }
      // Handle clicks on selected objects
      if (this.pickedObject.name === 'aboutArea') {
        handleAboutClick(camera, controls, this.pickedObject, loop);
      }
    }
  }
}

// Functions to handle clicks on selected objects

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

export { PickHelper };
