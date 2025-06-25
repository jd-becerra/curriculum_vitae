import { createApp } from 'vue'
import i18n from '../../components/i18n.ts'
import vuetify from '../../components/vuetify.ts'
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { Object3D, Vector2, Color, MeshBasicMaterial, PlaneGeometry, Mesh, NoBlending } from 'three'
import ProjectLabel from '../../components/labels/ProjectLabel.vue'

let labels = []

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

function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

function getClosestSize(width, height) {
  const closestWidth = Object.keys(widths).reduce((prev, curr) => {
    curr = Number(curr) // Convert string key to number
    prev = Number(prev)
    return Math.abs(curr - width) < Math.abs(prev - width) && curr <= width ? curr : prev
  })

  const closestHeight = Object.keys(heights).reduce((prev, curr) => {
    curr = Number(curr) // Convert string key to number
    prev = Number(prev)
    return Math.abs(curr - height) < Math.abs(prev - height) && curr <= height ? curr : prev
  })

  const w = widths[closestWidth]
  const h = heights[closestHeight]

  return {
    width: w,
    height: h,
  }
}

function createVueRenderer(clientWidth, clientHeight) {
  const labelRenderer = new CSS3DRenderer()
  labelRenderer.setSize(clientWidth, clientHeight)
  // Name the renderer
  labelRenderer.domElement.className = 'label-renderer'
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.width = '100%'
  labelRenderer.domElement.style.height = '100%'
  labelRenderer.domElement.style.transform = `scale(${window.devicePixelRatio})`
  labelRenderer.domElement.style.transformOrigin = 'top left'
  // Allow pointer events to pass through the label while still receiving them
  labelRenderer.domElement.style.pointerEvents = 'none'
  labelRenderer.domElement.style.backgroundColor = 'transparent'
  labelRenderer.domElement.style.zIndex = '1'

  return labelRenderer
}

function createVueLabel(Component, clientWidth, clientHeight, size = new Vector2(10, 4)) {
  const container = document.createElement('v-app')
  const app = createApp(Component)

  app.use(i18n) // Add locale feature
  app.use(vuetify) // Add vuetify feature
  app.mount(container)

  const obj = new Object3D()
  const cssObj = new CSS3DObject(container)
  cssObj.element.style.pointerEvents = 'auto'
  cssObj.element.className = 'vue-label-3d'

  // const aspectRatio = clientWidth / clientHeight;

  // Calculate base width dynamically
  const baseSize = getClosestSize(clientWidth, clientHeight)
  const baseWidth = baseSize.width
  const height = baseSize.height

  // Set container dimensions
  cssObj.element.style.width = `${baseWidth}px`
  cssObj.element.style.height = `${height}px`
  cssObj.element.style.overflow = 'hidden' // Prevent unwanted stretching

  // Choose allowed pointer events
  /*   const allowedPointerEvents = ["a", "button", "v-carousel-item"];
  // Get all elements that are allowed to receive pointer events
  allowedPointerEvents.forEach(el => {
    cssObj.element.querySelectorAll(el).forEach(el => {
      el.style.pointerEvents = "auto";
    });
  }); */
  cssObj.name = Component.name
  // scale the labels to fit the plane
  const scale = 0.000016
  cssObj.scale.set(baseSize.width * scale, baseSize.height * scale, 1)
  obj.add(cssObj)

  var material = new MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: new Color(0x111111),
    blending: NoBlending,
  })

  var geometry = new PlaneGeometry(size.x, size.y)
  var mesh = new Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  obj.lightShadowMesh = mesh
  obj.add(mesh)

  obj.cssObj = cssObj // For later reference

  labels.push(obj)
  return obj
}

function createComputerLabel(clientWidth, clientHeight) {
  const size = new Vector2(7.1, 4.0)
  const label = createVueLabel(ProjectLabel, clientWidth, clientHeight, size)
  label.position.set(-26.2, -0.7, -9.5)
  label.updateMatrix()
  label.rotateY(degToRad(90))
  label.rotateX(degToRad(0))
  return label
}

function updateLabels(clientWidth, clientHeight) {
  // Resize labels
  labels.forEach((label) => {
    const baseSize = getClosestSize(clientWidth, clientHeight)
    const baseWidth = baseSize.width
    const height = baseSize.height

    label.cssObj.element.style.width = `${baseWidth}px`
    label.cssObj.element.style.height = `${height}px`

    // Set the scale of the label
    const scale = 0.000016
    label.cssObj.scale.set(baseWidth * scale, height * scale, 1)
    label.lightShadowMesh.geometry.dispose()
  })
}

export {
  createVueRenderer,
  createVueLabel,
  createComputerLabel,
  updateLabels
}
