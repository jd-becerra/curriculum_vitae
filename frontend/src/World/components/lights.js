import {
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
} from "three";
 function createLights(color) {

  // Create two directional lights (one in front, one behind), and one below pointing up
  const lights = [
    new DirectionalLight(color, 5),
    new AmbientLight(color, 0.5),
  ];

  // Create a light helper for each light
  const lightHelpers = [
    new DirectionalLightHelper(lights[0], 2, "white"),
  ]

 // Positions
  lights[0].position.set(5, 5, -15);
  lights[1].position.set(0, 5, 10);

  lights.forEach(light => {
    light.tick = (delta) => {};
  });


   return { lights, lightHelpers };
}
 export { createLights };
