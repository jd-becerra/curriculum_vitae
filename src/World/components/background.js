// Module to create a background (it provides functions to do it through a cube texture with six images or an hdri file through RGBELoader)
import { CubeTextureLoader } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function createSkybox(path, format = '.png') {
  const loader = new CubeTextureLoader();

  const texture = loader.load([
    path + "posx" + format, // right
    path + "negx" + format, // left
    path + "posy" + format, // top
    path + "negy" + format, // bottom
    path + "posz" + format, // front
    path + "negz" + format, // back
  ]);

  return texture;
}


// NOT WORKING
// Module to create an HDRI background
function createHDRI(path, renderer) {
  const loader = new RGBELoader();

  return new Promise((resolve, reject) => {
    loader.setDataType(THREE.UnsignedByteType);
    loader.load(path, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      pmremGenerator.dispose();
      resolve(envMap);
    });
  });
}

export { createSkybox, createHDRI };
