// Custom classes for the 3D world
import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { loadGLTF } from "./systems/gltf_loader.js";
import { Loop } from "./systems/Loop.js";
import { Resizer } from "./systems/Resizer.js";
import { createTerrain } from "./components/objects/terrain.js";
import { createOrbitControls, createFirstPersonControls, createDragControls, createPointerLockControls } from "./systems/controls.js";
import { createCube } from "./components/objects/cube.js";
import { createSkybox } from "./components/background.js";
import { PickHelper } from "./systems/pick_helper.js";

// Three.js imports
import { Vector3, Object3D, Scene, MeshPhongMaterial, NoBlending, PCFSoftShadowMap, Mesh, PlaneGeometry, Color, Vector2 } from "three";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

// Vue components
import ProjectLabel from "../components/labels/ProjectLabel.vue";
import AboutLabel from "../components/labels/AboutLabel.vue";
import ContactLabel from "../components/labels/ContactLabel.vue";
import CertificatesLabel from "../components/labels/CertificatesLabel.vue";

// Vue imports
import { createApp } from "vue";
import i18n from "../components/i18n.ts";
import vuetify from "../components/vuetify.ts";

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera;
let renderer;
let scene;
let loop;
let labelRenderer;
let labels = [];

// variable helpers
let isRotating = false;
let targetRotation = new Vector3(0, 0, 0);
let targetPivot = new Vector3(0, 0, 0);
const startCameraPosition = {x: -40, y: 5, z: -40};
const startCameraRotation = {x: 0, y: 80, z: 0};

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

function createVueLabel(Component, clientWidth, clientHeight, size = new Vector2(10, 4)) {
  const container = document.createElement("div");
  const app  = createApp(Component);

  app.use(i18n); // Add locale feature
  app.use(vuetify); // Add vuetify feature
  app.mount(container);

  const obj = new Object3D();
  const cssObj = new CSS3DObject(container);
  cssObj.element.style.pointerEvents = "auto";
  // Make the container fill the screen (center elements)
  cssObj.element.style.width = "500px";
  cssObj.element.style.height = "300px";

  // Choose allowed pointer events
  const allowedPointerEvents = ["a", "button", "v-carousel-item"];
  let allowedElements = [];
  // Get all elements that are allowed to receive pointer events
  allowedPointerEvents.forEach(el => {
    cssObj.element.querySelectorAll(el).forEach(el => {
      el.style.pointerEvents = "auto";
    });
  });
  cssObj.name = Component.name;
  // scale the labels to fit the plane
  const scale = 0.00001;

  // Scale the labels based on container size
  const scaleFactor = Math.min(clientWidth, clientHeight) * scale;
  cssObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
  obj.add(cssObj);

  var material = new MeshPhongMaterial({
    transparent: true,
    opacity	: 0,
    color	: new Color( 0x111111 ),
    blending: NoBlending,
  });

  var geometry = new PlaneGeometry(size.x, size.y);
  var mesh = new Mesh( geometry, material );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  obj.lightShadowMesh = mesh;
  obj.add( mesh );

  obj.cssObj = cssObj; // For later reference

  return obj;
}

function updateLabels(clientWidth, clientHeight) {
  const dist = 5;

  const scale = 0.00001;
  const scaleFactor = Math.min(clientWidth, clientHeight) * scale;
  labels.forEach((label, index) => {
    label.cssObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

}

function rotateTick(delta) {
  if (isRotating) {
    const step = 0.05; // Smaller step for smoother rotation
    camera.rotation.y += (targetRotation.y - camera.rotation.y) * step;
    camera.rotation.x += (targetRotation.x - camera.rotation.x) * step;

    if (Math.abs(targetRotation.y - camera.rotation.y) < 0.001 &&
        Math.abs(targetRotation.x - camera.rotation.x) < 0.001) {
      isRotating = false;
    }
  }
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

class World {
   constructor(container) {
      // Instances of camera, scene, and renderer
      camera = createCamera(startCameraPosition, startCameraRotation);
      scene = createScene("gray");
      renderer = createRenderer();
      scene.add(camera);

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
      labelRenderer.domElement.style.pointerEvents = "auto";
      labelRenderer.domElement.style.backgroundColor = "transparent";
      labelRenderer.domElement.style.zIndex = "1";

      renderer.setClearColor( 0x000000, 0 );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFSoftShadowMap;
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0px";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.zIndex = "2";
      renderer.domElement.style.pointerEvents = "none";

      container.appendChild(renderer.domElement);
      container.appendChild(labelRenderer.domElement);

      // Set background (with skybox)
      const path = "textures/skybox/";
      const format = ".jpg";
      scene.background = createSkybox(path, format);

      // Initialize Loop
      loop = new Loop(camera, scene, renderer);

      // Light Instance, with optional light helper
      const { lights, lightHelpers } = createLights("white");
      lights.forEach(light => {
        loop.updatables.push(light);
        scene.add(light);
      });

      // If we want to see the lights in the scene, we can add the light helpers
      lightHelpers.forEach(lightHelper => {
        scene.add(lightHelper);
      });

      // Create a cube
      /* const cube = createCube({
        color: "blue",
      });
      cube.scale.set(0.5, 0.5, 0.5);
      loop.updatables.push(cube);
      scene.add(cube); */

      // load GLTF models (scene, path, position, scale)
/*       loadGLTF(scene, "3d_models/3d_github_logo.glb", [0, 0, 0.5], 0.1); // Github logo
      loadGLTF(scene, "3d_models/3d_linkedin_logo.glb", [0, 0, 1], 0.1); // LinkedIn logo */
      loadGLTF(scene, "3d_models/cabin_log.glb", [-20, -10, -10], 0.7, "cabin"); // Log cabin interior
      loadGLTF(scene, "3d_models/desk.glb", [-20, -10, -10], 0.7, "desk");

      let labelComputer = createVueLabel(ProjectLabel, container.clientWidth, container.clientHeight, new Vector2(5.1, 2.7));
      labelComputer.position.set(-16, -0.7, -5.6);
      labelComputer.updateMatrix();
      labelComputer.rotateY(degToRad(90));
      labelComputer.rotateX(degToRad(-10));
      scene.add(labelComputer);

      // create cubes that will be used as click areas for the labels
      let cubeComputer = createCube({
        color: "blue",
        scale: [20,10,20],
        position: [-10, -4, -11],
        name: "aboutArea",
      });
      scene.add(cubeComputer);

      const controls = createOrbitControls(camera, labelRenderer.domElement);
      loop.updatables.push(controls);
      // Add the rotate tick to the loop
      loop.updatables.push({
        tick: rotateTick,
      });

      loop.updatables.push({
        tick: (delta) => {
          labelRenderer.render(scene, camera);
          renderer.render(scene, camera);
        },
      });

      // Add the pick helper
      const pickHelper = new PickHelper();
      window.addEventListener("click", (event) => {
        const normalizedPosition = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        };
        pickHelper.pick(normalizedPosition, scene, camera, controls, loop);
      });

      const resizer = new Resizer(container, camera, renderer);
      resizer.onResize = () => {
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        updateLabels(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        this.render();
      };

      this.render(); // render from the start

    }
    render() {
     // Draw a single frame
      camera.updateMatrixWorld();
      labelRenderer.render(scene, camera);
      renderer.render(scene, camera);
    }


    // Camera handlers
    zoomCamera(direction) {
      const distance = 0.5;
      if (direction === "in") {
        camera.position.z -= distance;
      } else if (direction === "out") {
        camera.position.z += distance;
      }
    }

    rotateCamera(direction) {
      // Look at closest CSS3DObject label

      const angle = Math.PI / 2;

      if (direction === "left") {
        targetRotation.y += angle;
      } else if (direction === "right") {
        targetRotation.y -= angle;
      } else if (direction === "reset") {
        camera.rotation.set(0, 0, 0);
        targetRotation.set(0, 0, 0);
        camera.position.set(0, 0, 10); // Reset camera offset if needed
        return;
      } else {
        console.error("Invalid direction");
        return;
      }

      isRotating = true;
    }

    // Movement handlers
    moveCamera(direction) {
      const distance = 0.5;

      // Get direction the camera is facing
      const forward = new Vector3(0, 0, -1);
      const right = new Vector3(1, 0, 0);

      forward.applyQuaternion(camera.quaternion);
      right.applyQuaternion(camecameraraPivot.quaternion);

      if (direction === "forward") {
        camera.position.add(forward.multiplyScalar(distance));
      } else if (direction === "backward") {
        camera.position.sub(forward.multiplyScalar(distance));
      } else if (direction === "left") {
        camera.position.sub(right.multiplyScalar(distance));
      } else if (direction === "right") {
        camera.position.add(right.multiplyScalar(distance));
      } else {
        console.error("Invalid direction");
        return;
      }
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
