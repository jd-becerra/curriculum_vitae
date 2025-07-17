import {
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
  PointLight,
  PointLightHelper,
  RectAreaLight,
} from 'three'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

function createLights() {
  RectAreaLightUniformsLib.init() // If we don't add this, the light will look weird

  // Create two directional lights (one in front, one behind), and one below pointing up
  const lights = [
    // light (color, intensity, distance, decay)
    new AmbientLight('white', 1),
    new DirectionalLight(0xa8bcff, 1.0), // Moonlight
    new RectAreaLight('white', 15, 5, 10), // Rectangular light
    new AmbientLight('white', 0.5),
    new PointLight('yellow', 5, 10, 2.0), // Candle light
    new PointLight('orange', 5, 50, 0.5), // Fireplace light
  ]

  const len = lights.length
  const candleLight = lights[len - 2]
  const fireplaceLight = lights[len - 1]

  // Create a light helper for each light
  const lightHelpers = [
    new DirectionalLightHelper(lights[1], 2, 'white'),
    // new RectAreaLightHelper(lights[1], "white"),
    new PointLightHelper(fireplaceLight, 2, 'red'),
  ]

  // Positions
  lights[1].position.set(-70, 60, -11)
  lights[2].position.set(-5, 11, -9)
  lights[2].rotation.x = -Math.PI / 2
  candleLight.position.set(-25.5, 0, -16.5)
  fireplaceLight.position.set(15, -8, -29)

  lights.forEach((light) => {
    light.tick = () => {}
  })

  // Candle light flicker
  const candleLightDecay = 0.5
  candleLight.tick = () => {
    const flickerAmount = Math.random() * 0.08 - 0.04 // ±0.04
    candleLight.decay = candleLightDecay + flickerAmount
  }

  let fireplaceFlickerTime = 0
  fireplaceLight.tick = (delta) => {
    fireplaceFlickerTime += delta
    if (fireplaceFlickerTime > 0.1) {
      // update every 0.1s (~10fps)
      const flickerAmount = Math.random() * 0.1 - 0.05 // ±0.05
      fireplaceLight.decay = 0.5 + flickerAmount
      fireplaceFlickerTime = 0
    }
  }

  return { lights, lightHelpers }
}
export { createLights }
