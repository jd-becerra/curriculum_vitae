import { PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, LoadingManager } from 'three'
import { useMainStore } from '../../components/store'

const loadingPromises = []
let renderedHeaders = []
let currentLang = 'en'
let currentTick = null

const headers = {
  my_projects: {
    path: '/my_projects.png',
    name: 'My Projects Section',
    position: { x: 0, y: 6, z: 8 },
    rotation_y: degToRad(60),
    scale: { x: 8, y: 4 },
  },
  professional_overview: {
    path: '/professional_overview.png',
    name: 'Professional Overview Section',
    position: { x: 6, y: 6, z: -5 },
    rotation_y: degToRad(20),
    scale: { x: 8, y: 4 },
  },
  contact_me: {
    path: '/contact_me.png',
    name: 'Contact Me Section',
    position: { x: 17, y: 5, z: -5 },
    rotation_y: degToRad(10),
    scale: { x: 8, y: 4 },
  },
  about: {
    path: '/about_me.png',
    name: 'About Me Section',
    position: { x: -1.6, y: 2, z: -26 },
  },
  certificates: {
    path: '/certificates.png',
    name: 'Certificates Section',
    position: { x: -4.6, y: -1.5, z: -26 },
  },
  experience: {
    path: '/experience.png',
    name: 'Experience Section',
    position: { x: -1.6, y: -1.5, z: -26 },
  },
  soft_skills: {
    path: '/soft_skills.png',
    name: 'Soft Skills Section',
    position: { x: -1.6, y: 5.2, z: -26 },
  },
  hard_skills: {
    path: '/hard_skills.png',
    name: 'Hard Skills Section',
    position: { x: -5.1, y: 5.2, z: -26 },
  },
  credits: {
    path: '/credits.png',
    name: 'Credits Section',
    position: { x: 14.7, y: 6.3, z: -29 },
  },
  socials: {
    path: '/socials.png',
    name: 'Social Links Icons',
    position: { x: 14.7, y: 4.5, z: -29 },
  },
  projects_expand: {
    path: '/projects_expand.png',
    name: 'Expand Projects',
    position: { x: -1.6, y: 7.5, z: -26 },
  },
}

function createLoadingManager() {
  const manager = new LoadingManager()
  manager.onStart = function () {}
  manager.onLoad = function () {
    console.log('All headers loaded successfully.')
  }
  manager.onProgress = function () {}
  manager.onError = function (url) {
    console.error('There was an error loading ' + url)
  }
  return manager
}

function getCurrentLocale() {
  return useMainStore().getLocale
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

function getHeadersByLang(locale) {
  const basePath = `img/section_headers/${locale}`

  // Add base path to each header path
  const localizedHeaders = {}
  for (const key in headers) {
    localizedHeaders[key] = { ...headers[key] }
    localizedHeaders[key].path = basePath + localizedHeaders[key].path
  }
  return localizedHeaders
}

function headersAlreadyRendered(headerKeys) {
  if (renderedHeaders.length !== headerKeys.length) return false
  return headerKeys.every((key) => {
    return renderedHeaders.some((header) => header.key === key)
  })
}

function createPngHeaders(loop, scene, headerKeys, lang = 'en', manager = null) {
  if (!headerKeys || headerKeys.length === 0) return
  // Avoid unnecessary re-rendering
  if (headersAlreadyRendered(headerKeys) && currentLang === lang) return

  removePngHeaders(scene, loop)

  // Mouse events won't create a manager by itself, but we will also need to create headers
  // on startup, and that process already has a manager, this is why we can pass it as an argument
  if (!manager) manager = createLoadingManager()

  const textureLoader = new TextureLoader(manager)

  currentLang = lang
  const headersByLang = getHeadersByLang(currentLang)

  headerKeys.forEach((key) => {
    const header = headersByLang[key]
    const promise = new Promise(() => {
      loadPngHeader(header, key, loop, scene, textureLoader)
    })
    loadingPromises.push(promise)
  })

  // Monitor language change
  currentTick = {
    tick: () => {
      if (getCurrentLocale() !== currentLang) {
        createPngHeaders(loop, scene, headerKeys, getCurrentLocale(), manager)
      }
    },
  }
  loop.updatables.push(currentTick)

  Promise.all(loadingPromises)
    .then(() => {
      console.log('All PNG headers loaded successfully.')
    })
    .catch((error) => {
      console.error('Error loading PNG headers:', error)
    })
}

function loadPngHeader(headerData, key, loop, scene, textureLoader) {
  let scale = { x: 3, y: 1.5 }
  if (headerData.scale) scale = headerData.scale
  const geometry = new PlaneGeometry(scale.x, scale.y)
  const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true })
  const header = new Mesh(geometry, material)
  header.name = headerData.name
  header.area = 'headers'
  const pos = headerData.position

  header.position.set(pos.x, pos.y, pos.z)

  if (headerData.rotation_y) header.rotation.y = headerData.rotation_y

  // Load the texture
  textureLoader.load(
    headerData.path,
    (texture) => {
      material.map = texture
      material.needsUpdate = true
    },
    undefined,
    (error) => {
      console.error(`Error loading header texture: ${error}`)
    },
  )

  // Add tick to make it bounce
  if (header.name !== 'Credits Section') {
    // Credits must be static for the plaque
    let elapsed = 0
    const bounceHeight = 0.1
    const bounceSpeed = 3
    const initialY = header.position.y
    loop.updatables.push({
      tick: (delta) => {
        elapsed += delta
        const y = initialY + Math.sin(elapsed * bounceSpeed) * bounceHeight
        header.position.set(pos.x, y, pos.z)
      },
    })
  }

  header.layers.set(1) // Set to layer 1 to avoid picking by raycaster

  // Push header to the array for removal later and for checking if it was already rendered
  renderedHeaders.push({ key: key, name: headerData.name })

  scene.add(header)
}

function removePngHeaders(scene, loop) {
  if (currentTick) {
    // Remove previous tick to avoid conflicts with previously added headers
    const index = loop.updatables.indexOf(currentTick)
    if (index !== -1) {
      loop.updatables.splice(index, 1)
      currentTick = null
    }
  }

  renderedHeaders.forEach((headerData) => {
    const header = scene.getObjectByName(headerData.name)
    if (header) {
      scene.remove(header)
      header.geometry.dispose()
      header.material.dispose()
    }
  })

  renderedHeaders = []
}

export { getHeadersByLang, createPngHeaders, removePngHeaders }
