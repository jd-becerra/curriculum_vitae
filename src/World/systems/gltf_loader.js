// Load GLTF and GLB models using the THREE.js GLTFLoader

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { createAnimationMixer } from './animation.js'
import { LoopPingPong } from 'three'

const trophies = ['LinkedIn', 'Github', 'Gmail', 'Credits']

function loadGLTF(scene, loop, loadingManager, path, position, scale, name = '') {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader(loadingManager)
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene
        model.name = name
        model.position.set(...position)
        model.scale.set(scale, scale, scale)
        model.renderOrder = 1

        // create animation mixer
        model.mixer = createAnimationMixer(gltf)
        if (model.mixer) {
          loop.updatables.push({
            tick: (delta) => {
              let time = delta

              // if (model.name == 'fire') time = delta * 0.5 // Slow down fire animation
              model.mixer.update(time)
            },
          })
        }

        // Set clickable property for all objects inside the model if applicable
        if (name == 'trophies') {
          model.traverse((child) => {
            if (trophies.includes(child.name)) {
              child.clickable = true
              child.area = child.name != 'Credits' ? 'socials' : 'credits'
            }
          })
        }
        if (name == 'notebook') {
          model.clickable = true
          model.area = 'about_main'

          model.traverse((child) => {
            child.clickable = true
            child.area = 'about_main'
          })
        }

        // These models have animations that should be played automatically
        if (name === 'fire' || name === 'candle_flame' || name === 'butterfly') {
          if (model.mixer && model.mixer.animations.length > 0) {
            const mixer = model.mixer
            const clip = mixer.animations[0] // Get the first animation clip
            const action = mixer.clipAction(clip)

            // Pause butterfly anim for 5 seconds before starting again
            if (name === 'butterfly') {
              loop.updatables.push({
                tick: () => {
                  if (action.time === clip.duration) {
                    action.time = 0 // Reset the animation time
                    action.paused = true // Pause the animation
                    setTimeout(() => {
                      action.paused = false // Resume after 2 seconds
                    }, 5000)
                  }
                },
              })
              action.timeScale = 0.5 // Slow down
              action.setLoop(LoopPingPong, 1) // Play once and then stop
              action.clampWhenFinished = true // Stop the animation when it finishes
            }

            else {
              action.setLoop(LoopPingPong) // Loop the animation
              action.clampWhenFinished = false // Allow looping
            }
            action.play()
          } else {
            console.error('No animation found for fireplace model')
          }
        }

        if (name == 'bookcase') {
          const hardSkills = model.getObjectByName('hard_skills')
          // set all children of hard skills as clickable
          hardSkills.traverse((child) => {
            child.clickable = true
            child.area = 'about_skills'
          })
          const flower = model.getObjectByName('flower')
          flower.traverse((child) => {
            child.clickable = true
            child.area = 'about_skills'
          })
          const hat = model.getObjectByName('hat')
          hat.traverse((child) => {
            child.clickable = true
            child.area = 'about_experience'
          })
          const frame = model.getObjectByName('frame')
          frame.traverse((child) => {
            child.clickable = true
            child.area = 'about_experience'
          })
        }
        if (name === 'desk') {
          const computer = model.getObjectByName('Computer')
          if (computer) {
            computer.clickable = true
            computer.area = 'projects'
          }
        }

        scene.add(model)
        resolve(model) // Return the model when it's loaded
      },
      // called while loading
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (xhr) => {},
      (error) => reject(error),
    )
  })
}

export { loadGLTF }
