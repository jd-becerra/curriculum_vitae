import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { Loop } from "./systems/Loop.js";
import { Resizer } from "./systems/Resizer.js";
import { createTerrain } from "./components/objects/terrain.js";
import { createControls } from "./systems/controls.js";
import { createCube } from "./components/objects/cube.js";
import { Vector3 } from "three";

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera;
let renderer;
let scene;
let loop;

// In case we want to create a terrain
function createWorldTerrain(scene) {
    // Create terrain
  // Random values for terrain vertices
  const vertex_count = 12675;
  const random_values = Array.from({length: vertex_count}, () => Math.random() - 0.5);
  const terrain = createTerrain({
    color: "green",
    random_values: random_values,
  });
  loop.updatables.push(terrain);
  scene.add(terrain);
}

class World {
   constructor(container, labels) {
      // Instances of camera, scene, and renderer
      camera = createCamera();
      scene = createScene("gray");
      renderer = createRenderer();
      // Initialize Loop
      loop = new Loop(camera, scene, renderer);
      container.append(renderer.domElement);
      // Light Instance, with optional light helper
      const { lights, lightHelpers } = createLights("white");
      lights.forEach(light => {
        loop.updatables.push(light);
        scene.add(light);
      });
      lightHelpers.forEach(lightHelper => {
        scene.add(lightHelper);
      });

      // Create a cube
      const cube = createCube({
        color: "white",
      });
      loop.updatables.push(cube);
      scene.add(cube);

      // Add labels
      const elem = document.createElement("div");
      elem.textContent = "Lorem ipsum dolor sit amet consectetur adipiscing elit";
      // Text color is black
      elem.style.color = "black";
      const tempV = new Vector3();
      // get center of the cube
      cube.updateWorldMatrix(true, false);
      cube.getWorldPosition(tempV);
      tempV.project(camera); // normalized screen coordinates
      // convert normalized screen coordinates to CSS coordinates
      labels.appendChild(elem);
      const x = (tempV.x *  .5 + .5) * container.clientWidth;
      const y = (tempV.y * -.5 + .5) * container.clientHeight;
      // move the elem to that position
      elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

      // Update label position every frame
      const updateLabelPosition = () => {
        const tempV = new Vector3();
        cube.updateWorldMatrix(true, false);
        cube.getWorldPosition(tempV);
        tempV.project(camera); // Convert world position to screen position

        const x = (tempV.x * 0.5 + 0.5) * container.clientWidth;
        const y = (tempV.y * -0.5 + 0.5) * container.clientHeight;

        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
      };
      // Make an object with a tick method to push to the loop
      const labelUpdate = { tick: updateLabelPosition };
      loop.updatables.push(labelUpdate);

      // Create controls and push them to the loop
      const controls = createControls(camera, renderer.domElement);
      loop.updatables.push(controls);

     const resizer = new Resizer(container, camera, renderer);
      resizer.onResize = () => {
      this.render();
     };

    }
    render() {
     // Draw a single frame
     renderer.render(scene, camera);
   }
    // Animation handlers
   start() {
     loop.start();
   }
    stop() {
     loop.stop();
   }
 }

export { World };
