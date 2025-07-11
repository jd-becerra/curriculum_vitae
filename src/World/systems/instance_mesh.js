import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { InstancedMesh, Object3D } from 'three'

export function createBushes(scene) {
  const loader = new GLTFLoader()
  const url = '3d_models/bush_big.glb'

  loader.load(url, (gltf) => {
    const bushMesh = gltf.scene.children[0]
    const geometry = bushMesh.geometry
    const material = bushMesh.material

    const count = 30
    const instancedMesh = new InstancedMesh(geometry, material, count)

    const dummy = new Object3D()
    const initialPos = { x: -185, y: -10, z: -60 }

    const numRows = 2

    const rowOffsets = [0, 0] // Cumulative Z offset per row

    const rotation = -Math.PI / 2
    for (let i = 0; i < count; i++) {
      const row = i % numRows
      const column = Math.floor(i / numRows)

      let scale = Math.random() * (15 - 10) + 10
      dummy.scale.set(scale, scale, scale)
      // Random rotation around the Y axis between 0 and 45 degrees
      dummy.rotation.set(rotation, 0, Math.random() * (Math.PI / 4))

      // Every 6th in a row gets more spacing
      let spacingZ = (column + 1) % 6 === 0 ? 40 : Math.random() * (15 - 10) + 10
      rowOffsets[row] += spacingZ
      let spacingX = Math.random() * (95 - 90) + 90

      dummy.position.set(
        initialPos.x + row * spacingX,
        initialPos.y, // random Y bump
        initialPos.z + rowOffsets[row],
      )

      dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, dummy.matrix)
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    scene.add(instancedMesh)
  })
}
