import { Mesh, BoxGeometry, MeshPhongMaterial } from 'three'

function createCube(props, loop) {
  const scale = props.scale || [1, 1, 1]
  const position = props.position || [0, 0, 0]
  const geometry = new BoxGeometry(scale[0], scale[1], scale[2])
  const material = new MeshPhongMaterial({
    color: props.color,
    transparent: true,
    opacity: 0.2, // Default opacity set to 0.5
    emissive: 0x270000,
    depthWrite: false,
  })

  const cube = new Mesh(geometry, material)

  cube.position.set(position[0], position[1], position[2])

  // Since the cube is only needed to receive click input, it is not rendered
  // cube.visible = false;

  cube.name = props.name || 'cube'

  // Custom properties
  cube.clickable = true
  cube.elapsed = 0 // keep track of total time

  cube.tick = (delta) => {
    cube.elapsed += delta // accumulate total time

    const maxEmissive = 0x808080
    const speed = 1 // lower = slower pulsing
    const wave = (Math.sin(cube.elapsed * speed) + 1) / 2 // range [0, 1]

    const color = wave * (maxEmissive / 0xffffff)
    cube.material.emissive.setRGB(color, color, color)
  }

  loop.updatables.push(cube)

  return cube
}

function removeAreaSelectors(scene) {
  const projectsArea = scene.getObjectByName('Projects Area')
  if (projectsArea) {
    scene.remove(projectsArea)
  }

  const socialsArea = scene.getObjectByName('Socials Area')
  if (socialsArea) {
    scene.remove(socialsArea)
  }

  const aboutArea = scene.getObjectByName('About Area')
  if (aboutArea) {
    scene.remove(aboutArea)
  }
}

function createAreaSelectors(scene, loop) {
  // create cubes that will be used as click areas for the labels

  const color = 'gray'
  const cubeComputer = createCube(
    {
      color: color,
      scale: [14, 20, 20],
      position: [-23, 0, -11],
      name: 'Projects Area',
    },
    loop,
  )
  scene.add(cubeComputer)
  const cubeSocials = createCube(
    {
      color: color,
      scale: [14, 20, 5],
      position: [14, 0, -26],
      name: 'Socials Area',
    },
    loop,
  )
  scene.add(cubeSocials)
  const cubeBookcase = createCube(
    {
      color: color,
      scale: [14, 20, 5],
      position: [-5, 0, -26],
      name: 'About Area',
    },
    loop,
  )
  scene.add(cubeBookcase)
}

export { createAreaSelectors, removeAreaSelectors }
