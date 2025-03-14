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
import { Vector3, Object3D, CubeTextureLoader, Scene, MeshPhongMaterial,NoBlending, PCFSoftShadowMap, Mesh, PlaneGeometry, Color } from "three";
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createApp } from "vue";
import ProjectLabel from "../components/labels/ProjectLabel.vue";
import AboutLabel from "../components/labels/AboutLabel.vue";
import ContactLabel from "../components/labels/ContactLabel.vue";
import CertificatesLabel from "../components/labels/CertificatesLabel.vue";
import i18n from "../components/i18n.ts";
import vuetify from "../components/vuetify.ts";

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera;
let cameraPivot;
let renderer;
let scene;
let loop;
let labelRenderer;
let labels = [];

// variable helpers
let isRotating = false;
let targetRotation = new Vector3(0, 0, 0);
let targetPivot = new Vector3(0, 0, 0);

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

function createVueLabel(Component, clientWidth, clientHeight) {
  const container = document.createElement("div");
  const app  = createApp(Component);

  app.use(i18n); // Add locale feature
  app.use(vuetify); // Add vuetify feature
  app.mount(container);

  const obj = new Object3D();
  const cssObj = new CSS3DObject(container);
  cssObj.element.style.pointerEvents = "none";
  // Make all <a> tags clickable
  cssObj.element.querySelectorAll("a").forEach((a) => {
    a.style.pointerEvents = "auto";
  });
  cssObj.name = Component.name;
  // scale the labels to fit the plane
  const scale = 0.00001;

  // Scale the labels based on container size
  const scaleFactor = Math.min(clientWidth, clientHeight) * scale;
  cssObj.scale.set(scaleFactor, scaleFactor, scaleFactor);
  obj.add(cssObj);

  var material = new MeshPhongMaterial({
    opacity	: 0.15,
    color	: new Color( 0x111111 ),
    blending: NoBlending,
    // side	: THREE.DoubleSide,
  });

  var geometry = new PlaneGeometry( 10, 4 );
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
    cameraPivot.rotation.y += (targetRotation.y - cameraPivot.rotation.y) * step;
    cameraPivot.rotation.x += (targetRotation.x - cameraPivot.rotation.x) * step;

    if (Math.abs(targetRotation.y - cameraPivot.rotation.y) < 0.001 &&
        Math.abs(targetRotation.x - cameraPivot.rotation.x) < 0.001) {
      isRotating = false;
    }
  }
}

class World {
   constructor(container) {
      // Instances of camera, scene, and renderer
      camera = createCamera();
      scene = createScene("gray");
      renderer = createRenderer();

      // Create a pivot for the camera
      cameraPivot = new Object3D();
      cameraPivot.add(camera);
      scene.add(cameraPivot);

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

      // Console log click events on the label renderer
      labelRenderer.domElement.addEventListener("click", (event) => {
        console.log("Label clicked", event);
      });

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

      // Light Instance, with optional light helper
      const { lights, lightHelpers } = createLights("white");
      lights.forEach(light => {
        loop.updatables.push(light);
        scene.add(light);
      });

      // If we want to see the lights in the scene, we can add the light helpers
      /* lightHelpers.forEach(lightHelper => {
        scene.add(lightHelper);
      }); */

      // Create a cube
      /* const cube = createCube({
        color: "blue",
      });
      cube.scale.set(0.5, 0.5, 0.5);
      loop.updatables.push(cube);
      scene.add(cube); */

      // load GLTF models (scene, path, position, scale)
      loadGLTF(scene, "3d_models/3d_github_logo.glb", [0, 0, 0.5], 0.1); // Github logo
      loadGLTF(scene, "3d_models/3d_linkedin_logo.glb", [0, 0, 1], 0.1); // LinkedIn logo

      // Create Vue components for labels
      labels = [
        createVueLabel(ProjectLabel, container.clientWidth, container.clientHeight),
        createVueLabel(AboutLabel, container.clientWidth, container.clientHeight),
        createVueLabel(ContactLabel, container.clientWidth, container.clientHeight),
        createVueLabel(CertificatesLabel, container.clientWidth, container.clientHeight),
      ];
      scene.add(...labels);

      // Set the position of the labels and rotate them to face the camera
      const dist = 5;
      labels[0].position.set(0, 0, -dist);
      labels[1].position.set(0, 0, dist);
      labels[1].rotation.y = Math.PI; // rotate 180 degrees on the y axis
      labels[2].position.set(-dist, 0, 0);
      labels[2].rotation.y = Math.PI / 2; // rotate 90 degrees on the y axis
      labels[3].position.set(dist, 0, 0);
      labels[3].rotation.y = -Math.PI / 2; // rotate -90 degrees on the y axis

      // Create controls and push them to the loop
      // const controls = createFirstPersonControls(camera, labelRenderer.domElement);

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
        cameraPivot.rotation.set(0, 0, 0);
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

      forward.applyQuaternion(cameraPivot.quaternion);
      right.applyQuaternion(cameraPivot.quaternion);

      if (direction === "forward") {
        cameraPivot.position.add(forward.multiplyScalar(distance));
      } else if (direction === "backward") {
        cameraPivot.position.sub(forward.multiplyScalar(distance));
      } else if (direction === "left") {
        cameraPivot.position.sub(right.multiplyScalar(distance));
      } else if (direction === "right") {
        cameraPivot.position.add(right.multiplyScalar(distance));
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
