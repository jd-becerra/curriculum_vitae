import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InstancedMesh, Object3D } from 'three'

export function createBushes(scene) {
  const loader = new GLTFLoader()
  const url = '3d_models/bush_big.glb'

  loader.load(url, (gltf) => {
    const bushMesh = gltf.scene.children[0]
    const geometry = bushMesh.geometry
    const material = bushMesh.material

    const dummy = new Object3D()
    const initialPos = { x: -185, y: -10, z: -150 }

    const rows = 2,
      cols = 24,
      spacingX = 95,
      spacingZ = 12,
      colSize = 8, // every colSize'th bush will have a bigger gap
      gapSize = 40,
      rotation = -Math.PI / 2,
      count = rows * cols

    const instancedMesh = new InstancedMesh(geometry, material, count)

    let index = 0

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let scale = Math.random() * (15 - 10) + 10
        dummy.scale.set(scale, scale, scale)

        // Random rotation around the Y axis between 0 and 45 degrees
        dummy.rotation.set(rotation, 0, Math.random() * (Math.PI / 4))

        // Every end of row gets more spacing, else 12

        const x = initialPos.x + row * spacingX
        let z = initialPos.z + col * spacingZ

        // Every colSize'th bush will have a bigger gap
        if (col % colSize === 0 && col !== 0) z += gapSize

        dummy.position.set(x, initialPos.y, z)
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(index++, dummy.matrix)
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    scene.add(instancedMesh)
  })
}
