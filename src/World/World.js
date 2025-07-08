// Custom classes for the 3D world
import { createCamera } from './components/camera.js'
import { createLights } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createRenderer } from './systems/renderer.js'
import { loadGLTF } from './systems/gltf_loader.js'
import { Loop } from './systems/Loop.js'
import { Resizer } from './systems/Resizer.js'
import { createOrbitControls } from './systems/controls.js'
import { createSnowShaderPlane } from './components/shaders.js'
import { createAreaSelectors } from './components/objects/cube.js'
// import { createSkybox } from "./components/background.js";
import { PickHelper } from './systems/pick_helper.js'
import { createLoadingManager } from './systems/loading_manager.js'
import { createOutlineComposer } from './systems/outline.js'
import { useMainStore } from '../components/store.ts'
import {
  handleReturnToMainView,
  handleProjectsClick,
  handleSocialsClick,
  handleAboutClick,
  handleAboutSubarea,
} from './systems/mouse_events.js'
import { createPngHeaders } from './systems/png_loader.js'

// Three.js imports
import { Vector3, Vector2, EquirectangularReflectionMapping } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'

// Vue components
import { createVueRenderer, createComputerLabel, updateLabels } from './systems/vue_renderer.js'

import Stats from 'stats.js'

// These variables are module-scoped: we cannot access them
// from outside the module.
let camera
let renderer
let scene
let loop
let controls
let labelRenderer
let outlineComposer

const loadingPromises = []

// variable helpers
const startCameraPosition = { x: -10, y: 10, z: -30 }
const startCameraRotation = { x: 0, y: 0, z: 0 }

function showStats() {
  var stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  function animate() {
    stats.begin()

    // monitored code goes here

    stats.end()

    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
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
        texture.mapping = EquirectangularReflectionMapping
        resolve(texture)
      },
      undefined,
      (err) => reject(err),
    )
  })
}

class World {
  constructor(container) {
    const store = useMainStore()
    const manager = createLoadingManager()
    // showStats();

    // Instances of camera, scene, and renderer
    camera = createCamera(
      startCameraPosition,
      startCameraRotation,
      container.clientWidth,
      container.clientHeight,
    )
    scene = createScene('gray')
    renderer = createRenderer()

    scene.add(camera)

    // Create a CSS2DRenderer for labels
    labelRenderer = createVueRenderer(container.clientWidth, container.clientHeight)

    container.appendChild(renderer.domElement)
    container.appendChild(labelRenderer.domElement)

    // Set background (with skybox)
    /*
      const path = "textures/skybox/";
      const format = ".jpg";
      scene.background = createSkybox(path, format);
    */

    // Initialize Loop
    loop = new Loop(camera, scene, renderer)

    // Light Instance, with optional light helper
    const { lights, lightHelpers } = createLights('white')
    lights.forEach((light) => {
      loop.updatables.push(light)
      scene.add(light)
    })

    // If we want to see the light position in the scene, we can add the light helpers
    /* lightHelpers.forEach(lightHelper => {
          scene.add(lightHelper);
        });
      */

    const objectsPos = [-20, -10, -10]

    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/trophies.glb', objectsPos, 0.7, 'trophies'),
    )
    // For socials and credits
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/desk.glb', objectsPos, 0.7, 'desk'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/bookcase.glb', objectsPos, 0.7, 'bookcase'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/notebook.glb', objectsPos, 0.7, 'notebook'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/room.glb', objectsPos, 0.7, 'room'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/butterfly.glb', objectsPos, 0.7, 'butterfly'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/fire.glb', objectsPos, 0.7, 'fire'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/candle_flame.glb', objectsPos, 0.7, 'candle_flame'),
    )
    loadingPromises.push(
      loadGLTF(scene, loop, manager, '3d_models/exterior.glb', objectsPos, 0.7, 'exterior'),
    )

    // This are the only headers to be rendered at the start
    const headersToRender = ['my_projects', 'professional_overview', 'contact_me']
    createPngHeaders(loop, scene, headersToRender, store.getLocale, manager)

    // Add snow shader
    const snowShaderPlane = createSnowShaderPlane(
      container.clientHeight,
      new Vector3(-40, -60, -15),
    )
    snowShaderPlane.position.y = -20
    snowShaderPlane.position.x = -5
    snowShaderPlane.position.z = 10
    // Add tick to update the shader
    loop.updatables.push({
      tick: (delta) => {
        snowShaderPlane.material.uniforms.elapsedTime.value += delta
      },
    })
    scene.add(snowShaderPlane)

    scene.add(createComputerLabel(container.clientWidth, container.clientHeight))

    // Create selectors to move through the scene
    createAreaSelectors(scene)

    controls = createOrbitControls(camera, labelRenderer.domElement)

    loop.updatables.push(controls)

    // Create composer for outline
    const { composer, onResize: resizeComposer } = createOutlineComposer(
      renderer,
      scene,
      camera,
      container,
    )
    outlineComposer = composer

    // Add the pick helper (needs the outline pass to highlight objects)
    const pickHelper = new PickHelper(store.getOutlinePass)
    store.initializePickHelper(pickHelper)

    // Listeners
    window.addEventListener('click', (event) => {
      const normalizedPosition = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }

      if (store.isMouseEventsAllowed) {
        pickHelper.click(normalizedPosition, scene, camera, controls, loop)
      }
    })
    window.addEventListener('mousemove', (event) => {
      const normalizedPosition = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
      const screenPosition = new Vector2(event.clientX, event.clientY)
      pickHelper.hover(normalizedPosition, scene, camera, loop, screenPosition)
    })
    store.disableMouseEvents()

    loop.updatables.push({
      tick: () => {
        this.render()
      },
    })

    const resizer = new Resizer(container, camera, renderer)
    resizer.onResize = () => {
      labelRenderer.setSize(container.clientWidth, container.clientHeight)
      updateLabels(container.clientWidth, container.clientHeight)
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
      resizeComposer(container.clientWidth, container.clientHeight)
      this.render()
    }

    // Load HDR background

    loadingPromises.push(
      loadHDR("textures/background.exr", manager).then((texture) => {
        texture.mapping = EquirectangularReflectionMapping;
        texture.intensity = 0.1;
        scene.background = texture;
        scene.environment = texture;
    }));

    // render from the start

    // Log when all models are loaded
    Promise.all(loadingPromises).then(() => {
      setTimeout(() => {
        // resizer.onResize(); // I don't like this solution
        // Once the world is loaded, allow clicks
        store.disableMouseEvents() // Only allow clicks when the user clicks out of the info panel
        labelRenderer.domElement.style.pointerEvents = 'auto'
        this.render()
        const loadingElement = document.querySelector('.loading')
        if (loadingElement) {
          loadingElement.style.display = 'none'
        } else {
          console.error('Loading element not found')
        }
      }, 0)
    })
  }
  render() {
    // Draw a single frame
    camera.updateMatrixWorld()
    labelRenderer.render(scene, camera)
    // renderer.render(scene, camera);
    outlineComposer.render()
  }

  // Helpers to move to different areas
  moveToMainArea() {
    handleReturnToMainView(controls, loop, scene)
  }
  moveToProjectsArea() {
    handleProjectsClick(controls, loop, scene)
  }
  moveToSocialsArea() {
    handleSocialsClick(controls, loop, scene)
  }
  moveToAboutArea() {
    handleAboutClick(controls, loop, scene)
  }
  moveToAboutMainSubarea() {
    handleAboutSubarea(controls, loop, scene, 'main')
  }
  moveToAboutSkillsSubarea() {
    handleAboutSubarea(controls, loop, scene, 'skills')
  }
  moveToAboutExperienceSubarea() {
    handleAboutSubarea(controls, loop, scene, 'experience')
  }

  // Animation handlers
  start() {
    loop.start()
  }
  stop() {
    loop.stop()
  }
}

export { World }
