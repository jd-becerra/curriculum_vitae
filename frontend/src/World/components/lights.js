import {
  DirectionalLight,
  DirectionalLightHelper,
} from "three";
 function createLights(color) {

  // Create two directional lights (one in front, one behind)
  const lights = [
    new DirectionalLight(color, 4),
    new DirectionalLight(color, 2 ),
  ];

  // Create a light helper for each light
  const lightHelpers = lights.map(light => new DirectionalLightHelper(light, 5));

  // Positions
  lights[0].position.set(0, 10, 10); // front
  lights[1].position.set(0, 10, -10); // back


  lights[0].tick = (delta) => {};
  lights[1].tick = (delta) => {};

   return { lights, lightHelpers };
}
 export { createLights };
