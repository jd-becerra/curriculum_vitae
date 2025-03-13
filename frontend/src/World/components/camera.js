import { PerspectiveCamera } from 'three';

function createCamera() {
 const camera = new PerspectiveCamera(
   35, // FOV = Field Of View
   1, // Aspect Ratio
   0.1, // Near clipping
   100, // Far clipping plane
 );

 // Move the camera back so we can view the scene
 //      x y  z
 camera.position.set(0, 0, 0);
 camera.tick = (delta) => {

 };

 return camera;
}

export { createCamera };
