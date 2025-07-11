import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
import { DragControls } from 'three/addons/controls/DragControls.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { MathUtils } from 'three'

function createOrbitControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas)

  // Enable controls?
  controls.enabled = true
  controls.autoRotate = false
  controls.autoRotateSpeed = 0.2

  // Control limits
  // It's recommended to set some control boundaries
  // to prevent the user from clipping with the objects.

  // Y axis (allow to look up only a bit). Final values: max = 85, min = 80
  controls.maxPolarAngle = MathUtils.degToRad(85) // look up
  controls.minPolarAngle = MathUtils.degToRad(80) // look down

  // X axis. Final values: max = 35, min = 30
  controls.maxAzimuthAngle = MathUtils.degToRad(40) // look right
  controls.minAzimuthAngle = MathUtils.degToRad(25) // look left

  // Smooth camera:
  // Remember to add to loop updatables to work.
  controls.enableDamping = true
  controls.enableZoom = true
  controls.enablePan = true

  controls.minDistance = 5
  controls.maxDistance = 10

  controls.target.set(17, 4, 17)

  controls.tick = () => {
    // Update the controls
    controls.update()
  }

  return controls
}

function createFirstPersonControls(camera, canvas) {
  const controls = new FirstPersonControls(camera, canvas)
  // Movement settings
  controls.movementSpeed = 100
  controls.lookSpeed = 5
  // Vertical constraints
  controls.lookVertical = true
  controls.constrainVertical = true
  controls.verticalMin = Math.PI / 2.5 // 45 degrees
  controls.verticalMax = Math.PI / 1.7 // 135 degrees
  // Disable automatic mouse look by default
  controls.activeLook = true
  controls.mouseDragOn = false

  // Add damping variables
  const dampingFactor = 0.1
  let targetLon = controls.lon
  let targetLat = controls.lat
  let isMoving = false

  // Handle mouse events properly
  canvas.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
      // Left mouse button
      controls.activeLook = true
      controls.mouseDragOn = true
      isMoving = true
    }
  })

  canvas.addEventListener('mouseup', () => {
    controls.activeLook = false
    controls.mouseDragOn = false

    // When releasing mouse, store the target position
    targetLon = controls.lon
    targetLat = controls.lat
  })

  canvas.addEventListener('mouseleave', () => {
    controls.activeLook = false
    controls.mouseDragOn = false

    // When mouse leaves canvas, store the target position
    targetLon = controls.lon
    targetLat = controls.lat
  })

  // Override the update method to add damping
  const originalUpdate = controls.update
  controls.update = function (delta) {
    if (isMoving) {
      // When moving, update the target
      targetLon = controls.lon
      targetLat = controls.lat
    } else {
      // Apply damping when not actively moving
      const lonDiff = targetLon - controls.lon
      const latDiff = targetLat - controls.lat

      // Only apply damping if there's significant movement
      if (Math.abs(lonDiff) > 0.01 || Math.abs(latDiff) > 0.01) {
        controls.lon += lonDiff * dampingFactor
        controls.lat += latDiff * dampingFactor
      }
    }

    // Check if mouse is being held down
    isMoving = controls.mouseDragOn

    // Call the original update method
    originalUpdate.call(this, delta)
  }

  // Update function
  controls.tick = (delta) => {
    controls.update(delta)
  }

  return controls
}

function createDragControls(camera, canvas, objects) {
  const controls = new DragControls(objects, camera, canvas)

  controls.addEventListener('dragstart', function (event) {
    event.object.material.emissive.set(0xaaaaaa)
  })

  controls.addEventListener('dragend', function (event) {
    event.object.material.emissive.set(0x000000)
  })

  controls.tick = () => controls.update()

  return controls
}

function createPointerLockControls(camera, canvas) {
  const controls = new PointerLockControls(camera, canvas)

  controls.tick = () => controls.update()

  return controls
}

export {
  createOrbitControls,
  createFirstPersonControls,
  createDragControls,
  createPointerLockControls,
}
