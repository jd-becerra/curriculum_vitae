import { PerspectiveCamera } from 'three';

function createCamera(position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) {
 const camera = new PerspectiveCamera(
   35, // FOV = Field Of View
   1, // Aspect Ratio
   0.1, // Near clipping
   100, // Far clipping plane
 );

 // Move the camera back so we can view the scene
 //      x y  z
  camera.position.set(position.x, position.y, position.z);
  camera.rotateX(rotation.x);
  camera.rotateY(rotation.y);
  camera.rotateZ(rotation.z);
  camera.tick = (delta) => {

 };

 return camera;
}


export { createCamera };
