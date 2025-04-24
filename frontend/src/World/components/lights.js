import {
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
  SpotLight,
  SpotLightHelper,
  PointLight,
  PointLightHelper,
  RectAreaLight
} from "three";
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';

 function createLights(color) {
  RectAreaLightUniformsLib.init(); // If we don't add this, the light will look funny

  // Create two directional lights (one in front, one behind), and one below pointing up
  const lights = [
    // light (color, intensity, distance, decay)
    new DirectionalLight(0xA8BCFF, 1.0),  // Moonlight
    new RectAreaLight("white", 15, 5, 10), // Rectangular light
    new AmbientLight("white", 0.5),
    new PointLight("yellow", 5, 10, 2.0), // Candle light
    new PointLight("orange", 10, 100, 0.5), // Fireplace light
  ];

  const len = lights.length;
  const candleLight = lights[len - 2];
  const fireplaceLight = lights[len - 1];

  // Create a light helper for each light
  const lightHelpers = [
    new DirectionalLightHelper(lights[0], 2, "white"),
    // new RectAreaLightHelper(lights[1], "white"),
    new PointLightHelper(fireplaceLight, 2, "red")
  ]

 // Positions
  lights[0].position.set(-70, 60, -11);
  lights[1].position.set(-5, 11, -9);
  lights[1].rotation.x = -Math.PI / 2;
  candleLight.position.set(-25.5, 0, -16.5);
  fireplaceLight.position.set(15, -6, -25);

  lights.forEach(light => {
    light.tick = (delta) => {};
  });

  let t = 0;
  let pauseTime = 0;
  let pauseTimer = 0;
  let isPaused = false;
  let lastDirection = 0;
  let pausedDecay = 0;

  // Candle light flicker
  const candleLightDecay = 0.5;
  candleLight.tick = (delta) => {
    const flickerAmount = Math.random() * 0.08 - 0.04; // ±0.04
    candleLight.decay = candleLightDecay + flickerAmount;
  }

  fireplaceLight.tick = (delta) => {
    const max = 2, min = 0.5;
    const speed = 1;

    if (isPaused) {
      pauseTimer += delta;
      if (pauseTimer >= pauseTime) {
        isPaused = false;
        pauseTimer = 0;
      } else {
        // Make the light flicker during pause
        const flickerAmount = Math.random() * 0.08 - 0.04; // ±0.04
        fireplaceLight.decay = pausedDecay + flickerAmount;
        return;
      }
    }

    t += delta;

    // Calculate decay based on sine, starting with decreasing
    const sine = Math.sin(t * speed - Math.PI / 2); // Shift sine phase by -π/2
    const normalized = (sine + 1) / 2;
    let decay = normalized * (max - min) + min;
    // Add slight variation to decay to simulate flickering
    decay += Math.random() * 0.1 - 0.05;
    fireplaceLight.decay = decay;

    // Calculate derivative to detect peaks (cosine)
    const cosine = Math.cos(t * speed - Math.PI / 2); // Shift cosine phase by -π/2

    // Detect zero-crossing of derivative (turning point)
    const direction = Math.sign(cosine); // +1: decreasing, -1: increasing
    if (direction !== lastDirection) {
      lastDirection = direction;
      isPaused = true;
      pauseTime = 0.1;
      pauseTimer = 0;
      pausedDecay = decay;
    }
  };




   return { lights, lightHelpers };
}
 export { createLights };
