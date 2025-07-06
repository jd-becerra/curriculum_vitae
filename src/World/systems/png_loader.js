import { PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader, LoadingManager } from 'three'
import { useMainStore } from '../../components/store'

const loadingPromises = []
let renderedHeaders = []
let currentLang = 'en'
let currentTick = null

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

function getHeadersByLang(locale) {
  const basePath = `img/section_headers/${locale}`

  return {
    my_projects: {
      path: `${basePath}/my_projects.png`,
      name: 'My Projects Section',
      position: { x: -1.6, y: 8.5, z: -26 },
    },
    professional_overview: {
      path: `${basePath}/professional_overview.png`,
      name: 'Professional Overview Section',
      position: { x: -5.1, y: 8.5, z: -26 },
    },
    contact_me: {
      path: `${basePath}/contact_me.png`,
      name: 'Contact Me Section',
      position: { x: -1.6, y: 3.5, z: -26 },
    },
    about: {
      path: `${basePath}/about_me.png`,
      name: 'About Me Section',
      position: { x: -1.6, y: 2, z: -26 },
    },
    certificates: {
      path: `${basePath}/certificates.png`,
      name: 'Certificates Section',
      position: { x: -4.6, y: -1.5, z: -26 },
    },
    experience: {
      path: `${basePath}/experience.png`,
      name: 'Experience Section',
      position: { x: -1.6, y: -1.5, z: -26 },
    },
    soft_skills: {
      path: `${basePath}/soft_skills.png`,
      name: 'Soft Skills Section',
      position: { x: -1.6, y: 5.2, z: -26 },
    },
    hard_skills: {
      path: `${basePath}/hard_skills.png`,
      name: 'Hard Skills Section',
      position: { x: -5.1, y: 5.2, z: -26 },
    },
    credits: {
      path: `${basePath}/credits.png`,
      name: 'Credits Section',
      position: { x: 14.7, y: 6.3, z: -29 },
    },
    socials: {
      path: `${basePath}/socials.png`,
      name: 'Social Links Icons',
      position: { x: 14.7, y: 4.5, z: -29 },
    },
    projects_expand: {
      path: `${basePath}/projects_expand.png`,
      name: 'Expand Projects',
      position: { x: -1.6, y: 7.5, z: -26 },
    },
  }
}

function createPngHeaders(loop, scene, headerNames, lang = 'en', manager = null) {
  if (!headerNames || headerNames.length === 0) return

  if (renderedHeaders.length > 0) removePngHeaders(scene, loop)

  // Mouse events won't create a manager by itself, but we will also need to create headers
  // on startup, and that process already has a manager, this is why we can pass it as an argument
  if (!manager) manager = createLoadingManager()

  const textureLoader = new TextureLoader(manager)

  const planeSize = { x: 3, y: 1.5 }

  currentLang = lang
  const headers = getHeadersByLang(currentLang)

  headerNames.forEach((key) => {
    const header = headers[key]
    const promise = new Promise(() => {
      loadPngHeader(
        header.path,
        header.name,
        header.position,
        planeSize,
        loop,
        scene,
        textureLoader,
      )
    })
    loadingPromises.push(promise)
  })

  // Monitor language change
  currentTick ={
    tick: () => {
      if (getCurrentLocale() !== currentLang) {
        createPngHeaders(loop, scene, headerNames, getCurrentLocale(), manager)
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

function loadPngHeader(url, name, pos, scale, loop, scene, textureLoader) {
  const geometry = new PlaneGeometry(scale.x, scale.y)
  const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true })
  const header = new Mesh(geometry, material)
  header.name = name
  header.area = 'headers'

  header.position.set(pos.x, pos.y, pos.z)

  // Load the texture
  textureLoader.load(
    url,
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
  if (name !== 'Credits Section') {
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

  header.cickable = false
  header.layers.set(1) // Set to layer 1 to avoid picking by raycaster

  // Push header to the array for removal later
  renderedHeaders.push(header.name)

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

  renderedHeaders.forEach((headerName) => {
    const header = scene.getObjectByName(headerName)
    if (header) {
      scene.remove(header)
      header.geometry.dispose()
      header.material.dispose()
    }
  })

  renderedHeaders = []
}

export { getHeadersByLang, createPngHeaders, removePngHeaders }
