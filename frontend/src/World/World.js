import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { Loop } from "./systems/Loop.js";
import { Resizer } from "./systems/Resizer.js";
import { createTerrain } from "./components/objects/terrain.js";
import { createControls } from "./systems/controls.js";
import { createCube } from "./components/objects/cube.js";
import { Vector3, Object3D, CubeTextureLoader } from "three";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createApp } from "vue";
import ProjectLabel from "../components/labels/ProjectLabel.vue";
import AboutLabel from "../components/labels/AboutLabel.vue";
import ContactLabel from "../components/labels/ContactLabel.vue";
import CertificatesLabel from "../components/labels/CertificatesLabel.vue";

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera;
let renderer;
let scene;
let loop;
let labelRenderer;

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

function createVueLabel(Component) {
  const container = document.createElement("div");
  createApp(Component).mount(container);
  return new CSS3DObject(container);
}

class World {
   constructor(container) {
      // Instances of camera, scene, and renderer
      camera = createCamera();
      scene = createScene("gray");
      renderer = createRenderer();

      // Create a CSS2DRenderer for labels
      labelRenderer = new CSS3DRenderer();
      labelRenderer.setSize(container.clientWidth, container.clientHeight);
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = "0px";
      labelRenderer.domElement.style.width = "100%";
      labelRenderer.domElement.style.height = "100%";
      labelRenderer.domElement.style.transform = `scale(${window.devicePixelRatio})`;
      labelRenderer.domElement.style.transformOrigin = "top left";
      // Allow pointer events to pass through the label while still receiving them
      // labelRenderer.domElement.style.pointerEvents = "none";
      labelRenderer.domElement.style.backgroundColor = "transparent";
      labelRenderer.domElement.style.zIndex = "1";
      container.appendChild(labelRenderer.domElement);

      // Set background
      const loader = new CubeTextureLoader();
      const path = "textures/skybox/";
      const format = ".png";
      const texture = loader.load([
        path + "0" + format,
        path + "1" + format,
        path + "2" + format,
        path + "3" + format,
        path + "4" + format,
        path + "5" + format,
      ]);
      scene.background = texture;

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
      cube.layers.enableAll();

      // Create Vue components for labels
      const labels = [
        createVueLabel(ProjectLabel),
        createVueLabel(AboutLabel),
        createVueLabel(ContactLabel),
        createVueLabel(CertificatesLabel),
      ];
      scene.add(...labels);

      // Set the position of the labels and rotate them to face the camera
      const dist = 400;
      labels[0].position.set(0, 0, -dist);
      labels[1].position.set(0, 0, dist);
      labels[2].position.set(-dist, 0, 0);
      labels[3].position.set(dist, 0, 0);

      // Create controls and push them to the loop
      const controls = createControls(camera, labelRenderer.domElement);
      loop.updatables.push(controls);

      loop.updatables.push({
        tick: (delta) => {
          labels.forEach(label => {
            label.lookAt(camera.position);
          });

          renderer.render(scene, camera);
          labelRenderer.render(scene, camera);
        },
      });

      const resizer = new Resizer(container, camera, renderer);
      resizer.onResize = () => {
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        this.render();
      };

      this.render(); // render from the start

    }
    render() {
     // Draw a single frame
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
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
