// Custom classes for the 3D world
import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { loadGLTF } from "./systems/gltf_loader.js";
import { Loop } from "./systems/Loop.js";
import { Resizer } from "./systems/Resizer.js";
import { createOrbitControls } from "./systems/controls.js";
import { createSnowShaderPlane } from "./components/shaders.js";
import { createCube } from "./components/objects/cube.js";
// import { createSkybox } from "./components/background.js";
import { PickHelper } from "./systems/pick_helper.js";
import { createLoadingManager } from "./systems/loading_manager.js";
import { createOutlineComposer } from "./systems/outline.js";
import { useMainStore } from "../components/store.ts";
import {
  handleReturnToMainView,
  handleProjectsClick,
  handleSocialsClick,
  handleAboutClick,
} from "./systems/mouse_events.js";

// Three.js imports
import {
  Vector3,
  Object3D,
  Scene,
  MeshPhongMaterial,
  MeshBasicMaterial,
  NoBlending,
  PCFSoftShadowMap,
  Mesh, PlaneGeometry,
  Color,
  Vector2,
  EquirectangularReflectionMapping,
  LOD,
} from "three";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// Vue components
import ProjectLabel from "../components/labels/ProjectLabel.vue";
import AboutLabel from "../components/labels/AboutLabel.vue";
import ContactLabel from "../components/labels/ContactLabel.vue";
import CertificatesLabel from "../components/labels/CertificatesLabel.vue";

// Vue imports
import { createApp } from "vue";
import i18n from "../components/i18n.ts";
import vuetify from "../components/vuetify.ts";
import Stats from "stats.js";

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera;
let renderer;
let scene;
let loop;
let controls;
let labelRenderer;
let labels = [];
let outlineComposer;

const loadingPromises = [];

// variable helpers
const startCameraPosition = {x: -10, y: 10, z: -30};
const startCameraRotation = {x: 0, y: 0, z: 0};

// Resolutions
const widths = {
  1920: 690,
  1760: 680,
  1680: 670,
  1600: 670,
  1440: 670,
  1366: 670,
  1280: 660,
  1152: 650,
  1024: 640,
  900: 630,
  800: 620,
  700: 610,
  600: 600,
  500: 590,
  400: 580,
  300: 570,
}

const heights = {
  1000: 500,
  900: 490,
  800: 490,
  700: 480,
  600: 470,
  500: 470,
  400: 460,
  300: 450,
  200: 440,
}

function getClosestSize(width, height) {
  const closestWidth = Object.keys(widths).reduce((prev, curr) => {
    curr = Number(curr); // Convert string key to number
    prev = Number(prev);
    return (Math.abs(curr - width) < Math.abs(prev - width) && curr <= width) ? curr : prev;
  });

  const closestHeight = Object.keys(heights).reduce((prev, curr) => {
    curr = Number(curr); // Convert string key to number
    prev = Number(prev);
    return (Math.abs(curr - height) < Math.abs(prev - height) && curr <= height) ? curr : prev;
  });

  const w = widths[closestWidth];
  const h = heights[closestHeight];

  return {
    width: w,
    height: h,
  };
};

function createVueLabel(Component, clientWidth, clientHeight, size = new Vector2(10, 4)) {
  const container = document.createElement("v-app");
  const app  = createApp(Component);

  app.use(i18n); // Add locale feature
  app.use(vuetify); // Add vuetify feature
  app.mount(container);

  const obj = new Object3D();
  const cssObj = new CSS3DObject(container);
  cssObj.element.style.pointerEvents = "auto";
  cssObj.element.className = "vue-label-3d";

  const aspectRatio = clientWidth / clientHeight;

  // Calculate base width dynamically
  const baseSize = getClosestSize(clientWidth, clientHeight);
  const baseWidth = baseSize.width;
  const height = baseSize.height;

  // Set container dimensions
  cssObj.element.style.width = `${baseWidth}px`;
  cssObj.element.style.height = `${height}px`;
  cssObj.element.style.overflow = "hidden"; // Prevent unwanted stretching

  // Choose allowed pointer events
/*   const allowedPointerEvents = ["a", "button", "v-carousel-item"];
  // Get all elements that are allowed to receive pointer events
  allowedPointerEvents.forEach(el => {
    cssObj.element.querySelectorAll(el).forEach(el => {
      el.style.pointerEvents = "auto";
    });
  }); */
  cssObj.name = Component.name;
  // scale the labels to fit the plane
  const scale = 0.000016;
  cssObj.scale.set(baseSize.width * scale, baseSize.height * scale, 1);
  obj.add(cssObj);

  var material = new MeshBasicMaterial({
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

function showStats() {
  var stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  function animate() {

    stats.begin();

    // monitored code goes here

    stats.end();

    requestAnimationFrame( animate );

  }
  requestAnimationFrame( animate );
}

function loadHDR(path, loadingManager) {
  return new Promise((resolve, reject) => {
/*     new RGBELoader(loadingManager).load(
      path,
      (texture) => resolve(texture),
      undefined,
      (err) => reject(err)
    ); */

    // Experimental EXR loader
    new EXRLoader(loadingManager).load(
      path,
      (texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        resolve(texture);
      },
      undefined,
      (err) => reject(err)
    );
  });
}

function updateLabels(clientWidth, clientHeight) {
  // Resize labels

  labels.forEach(label => {
    const baseSize = getClosestSize(clientWidth, clientHeight);
    console.log("Setting base size: ", baseSize, "for ", clientWidth, "x", clientHeight);
    const baseWidth = baseSize.width;
    const height = baseSize.height;

    label.cssObj.element.style.width = `${baseWidth}px`;
    label.cssObj.element.style.height = `${height}px`;

    // Set the scale of the label
    const scale = 0.000016;
    label.cssObj.scale.set(baseWidth * scale, height * scale, 1);
    label.lightShadowMesh.geometry.dispose();
  }
  );

}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

class World {
   constructor(container) {
      const manager = createLoadingManager();
      showStats();

      // Instances of camera, scene, and renderer
      camera = createCamera(startCameraPosition, startCameraRotation, container.clientWidth, container.clientHeight);
      scene = createScene("gray");
      renderer = createRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      scene.add(camera);

      // Create a CSS2DRenderer for labels
      labelRenderer = new CSS3DRenderer();
      labelRenderer.setSize(container.clientWidth, container.clientHeight);
      // Name the renderer
      labelRenderer.domElement.className = "label-renderer";
      labelRenderer.domElement.style.position = "absolute";
      labelRenderer.domElement.style.top = "0px";
      labelRenderer.domElement.style.width = "100%";
      labelRenderer.domElement.style.height = "100%";
      labelRenderer.domElement.style.transform = `scale(${window.devicePixelRatio})`;
      labelRenderer.domElement.style.transformOrigin = "top left";
      // Allow pointer events to pass through the label while still receiving them
      labelRenderer.domElement.style.pointerEvents = "none";
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
/*       const path = "textures/skybox/";
      const format = ".jpg";
      scene.background = createSkybox(path, format); */

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
      });
     */

      // For performance, we will add an LOD object to reduce the number of polygons rendered
      const lod = new LOD();

      const objectsPos = [-20, -10, -10];

      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/room.glb", objectsPos, 0.7, "room"));
      loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/trophies.glb", objectsPos, 0.7, "trophies", "socials")); // For socials and credits
      loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/desk.glb", objectsPos, 0.7, "desk", "projects"));
      loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/bookcase.glb", objectsPos, 0.7, "bookcase", "about"));
      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/notebook.glb", objectsPos, 0.7, "notebook"));
      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/butterfly.glb", objectsPos, 0.7, "butterfly"));
      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/fireplace.glb", objectsPos, 0.7, "fireplace"));
      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/fire.glb", objectsPos, 0.7, "fire"));
      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/candle_flame.glb", objectsPos, 0.7, "candle_flame"));
      // loadingPromises.push(loadGLTF(scene, loop, manager, "3d_models/exterior.glb", objectsPos, 0.7, "exterior"));
      // scene.add(lod);

      // Add snow shader
      const snowShaderPlane = createSnowShaderPlane(container.clientHeight, new Vector3(-40, -60, -15));
      snowShaderPlane.position.y = -20;
      snowShaderPlane.position.x = -5;
      snowShaderPlane.position.z = 10;
      // Add tick to update the shader
      loop.updatables.push({
        tick: (delta) => {
          snowShaderPlane.material.uniforms.elapsedTime.value += delta;
        },
      });
      scene.add(snowShaderPlane);

      let labelComputer = createVueLabel(ProjectLabel, container.clientWidth, container.clientHeight, new Vector2(7.1, 4.0));
      labelComputer.position.set(-26.2, -0.7, -9.5);
      labelComputer.updateMatrix();
      labelComputer.rotateY(degToRad(90));
      labelComputer.rotateX(degToRad(0));
      scene.add(labelComputer);

      // create cubes that will be used as click areas for the labels
      const cubeComputer = createCube({
        color: "blue",
        scale: [15,10,20],
        position: [-15, -3, -5],
        name: "projectsArea",
      });
      scene.add(cubeComputer);
      const cubeSocials = createCube({
        color: "red",
        scale: [14,12,10],
        position: [14, 4, -30],
        name: "socialsArea",
      });
      scene.add(cubeSocials);
      const cubeBookcase = createCube({
        color: "yellow",
        scale: [14,22,10],
        position: [-5, 0, -30],
        name: "aboutArea",
      });
      scene.add(cubeBookcase);

      controls = createOrbitControls(camera, labelRenderer.domElement);

      loop.updatables.push(controls);

      // Create composer for outline
      const { composer, outlinePass, onResize: resizeComposer } = createOutlineComposer(renderer, scene, camera, container);
      outlineComposer = composer;

      // Add the pick helper
      const pickHelper = new PickHelper();
      // Listeners
      window.addEventListener("click", (event) => {
        const normalizedPosition = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        };
        pickHelper.click(normalizedPosition, scene, camera, controls, loop);
      });
      window.addEventListener("mousemove", (event) => {
        const normalizedPosition = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        };
        const screenPosition = new Vector2(event.clientX, event.clientY);
        pickHelper.hover(normalizedPosition, scene, camera, loop, screenPosition, outlinePass);
      });
      const store = useMainStore();
      store.disableMouseEvents();

      loop.updatables.push({
        tick: (delta) => {
          this.render();
        },
      });


/*    window.addEventListener("mousemove", (event) => {
        const normalizedPosition = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        };
        pickHelper.hover(normalizedPosition, scene, camera, loop);
      }); */

      const resizer = new Resizer(container, camera, renderer);
      resizer.onResize = () => {
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        updateLabels(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        resizeComposer(container.clientWidth, container.clientHeight);
        this.render();
      };

      // Load HDR background
/*       loadingPromises.push(
        loadHDR("textures/background.exr", manager).then((texture) => {
          texture.mapping = EquirectangularReflectionMapping;
          texture.intensity = 0.1;
          scene.background = texture;
          scene.environment = texture;
        })
      ); */


       // render from the start

      // Log when all models are loaded
      Promise.all(loadingPromises).then(() => {
        setTimeout(() => {
          // resizer.onResize(); // I don't like this solution
          // Once the world is loaded, allow clicks
          store.enableMouseEvents();
          labelRenderer.domElement.style.pointerEvents = "auto";
          this.render();
          const loadingElement = document.querySelector(".loading");
          if (loadingElement) {
            loadingElement.style.display = "none";
          } else {
            console.error("Loading element not found");
          }
        }, 0);
      });

    }
    render() {
     // Draw a single frame
      camera.updateMatrixWorld();
      labelRenderer.render(scene, camera);
      // renderer.render(scene, camera);
      outlineComposer.render();
    }

    // Helpers to move to different areas
    moveToMainArea() {
      handleReturnToMainView(controls, loop, scene);
    }

    moveToProjectsArea() {
      handleProjectsClick(controls, loop, scene);
    }

    moveToSocialsArea() {
      handleSocialsClick(controls, loop, scene);
    }

    moveToAboutArea() {
      handleAboutClick(controls, loop, scene);
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
