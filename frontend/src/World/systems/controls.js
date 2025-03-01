import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MathUtils } from "three";

function createControls(camera, canvas) {
 const controls = new OrbitControls(camera, canvas);

 // Enable controls?
 controls.enabled = true;
 controls.autoRotate = false;
 controls.autoRotateSpeed = 0.2;

 // Control limits
 // It's recommended to set some control boundaries
 // to prevent the user from clipping with the objects.

 // Y axis (allow full rotation)
/*  controls.minPolarAngle = MathUtils.degToRad(-90);
 controls.maxPolarAngle = MathUtils.degToRad(90); */

 // X axis
/*  controls.minAzimuthAngle = MathUtils.degToRad(-90); // default
  controls.maxAzimuthAngle = MathUtils.degToRad(90); */

 // Smooth camera:
 // Remember to add to loop updatables to work.
 controls.enableDamping = true;
 controls.enableZoom = true;
 controls.enablePan = false;

  controls.minDistance = 1;
  controls.maxDistance = 30;

 controls.tick = () => controls.update();

 return controls;
}

export { createControls };
