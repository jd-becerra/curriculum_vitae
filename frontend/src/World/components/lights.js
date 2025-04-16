import {
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
  SpotLight,
  SpotLightHelper,
} from "three";
 function createLights(color) {

  // Create two directional lights (one in front, one behind), and one below pointing up
  const lights = [
    new DirectionalLight(color, 0.9),
    new AmbientLight(color, 0.5),
    new SpotLight(color, 0.5),
  ];

  // Create a light helper for each light
  const lightHelpers = [
    new DirectionalLightHelper(lights[0], 2, "white"),
    new SpotLightHelper(lights[2], 2, "blue"),
  ]

 // Positions
  lights[0].position.set(5, 5, -15);
  lights[1].position.set(0, 5, 10);
  lights[2].position.set(5, 10, -15);

  lights.forEach(light => {
    light.tick = (delta) => {};
  });


   return { lights, lightHelpers };
}
 export { createLights };
