import { Raycaster } from 'three'
import * as mouseEvents from './mouse_events.js'
import { useMainStore } from '../../components/store'

class PickHelper {
  constructor() {
    this.raycaster = new Raycaster()
    this.pickedObject = null
    this.pickedObjectSavedColor = 0
    this.hoveredObject = null

    this.hoverListener = null
    this.clickListener = null

    // Since we use Pinia, we also read the store to detect if we should force the state of the mouse events
    this.store = useMainStore()
  }

  // Public methods
  click(normalizedPosition, scene, camera, controls, loop) {
    // Block click one time if we are trying to reactivate it, to wait for the click to be released
    if (this.store.shouldDelayClick) {
      this.store.setClickDelay(false)
      return
    }

    if (!this.store.isMouseEventsAllowed) {
      return
    }

    // Restore the color if there was a previously picked object
    if (this.pickedObject) {
      if (this.pickedObject.material && this.pickedObject.material.emissive) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor)
      }
      this.pickedObject = null
    }

    // Cast a ray through the camera frustum
    this.raycaster.setFromCamera(normalizedPosition, camera)
    const intersectedObjects = this.raycaster.intersectObjects(scene.children)

    if (intersectedObjects.length > 0) {
      // Pick the first (closest) intersected object
      let candidate = intersectedObjects[0].object
      if (candidate.area == 'headers' && intersectedObjects.length > 1) {
        // Let click pass through if the object is a PNG header
        candidate = intersectedObjects[1].object
      }

      if (!candidate) return

      this.pickedObject = candidate

      if (!this.pickedObject.clickable) {
        return
      }

      // Handle clicks on selected objects
      const objectName = this.pickedObject.name
      if (objectName == 'Projects Area') {
        mouseEvents.handleProjectsClick(controls, loop, scene)
        this.pickedObject = null
      } else if (objectName == 'Socials Area') {
        mouseEvents.handleSocialsClick(controls, loop, scene)
        this.pickedObject = null
      } else if (objectName == 'About Area') {
        mouseEvents.handleAboutClick(controls, loop, scene)
        this.pickedObject = null
      }
      // If clicked object is a social media icon, open the corresponding link
      else if (mouseEvents.getIsAreaActive('socials')) {
        if (this.pickedObject.name == 'Credits') mouseEvents.handleCreditsClick(loop)
        else mouseEvents.handleSocialIconClick(this.pickedObject.name, loop)
      } else if (mouseEvents.getIsAreaActive('about')) {
        if (mouseEvents.getActiveAboutSubarea() == 'skills') {
          this._removeHoverEffects(loop, normalizedPosition, scene)
          mouseEvents.handleSkillsClick(this.pickedObject.name, loop)
        } else if (
          mouseEvents.getActiveAboutSubarea() == 'main' &&
          objectName == 'About_Me' &&
          !mouseEvents.isBookOpen
        ) {
          mouseEvents.handleOpenBook(this.pickedObject)
        } else if (mouseEvents.getActiveAboutSubarea() == 'experience') {
          mouseEvents.handleExperienceClick(this.pickedObject)
        }
      }
    }
  }

  hover(normalizedPosition, scene, camera, loop, screenPosition, outlinePass) {
    if (!this.store.isMouseEventsAllowed) {
      mouseEvents.handleSocialIconHover(null, loop, scene)
      mouseEvents.handleHardSkillsHover(null, loop, screenPosition)
      return
    }

    this.raycaster.setFromCamera(normalizedPosition, camera)
    const intersectedObjects = this.raycaster.intersectObjects(scene.children)

    if (intersectedObjects.length > 0) {
      let candidate = intersectedObjects[0].object
      if (candidate.area == 'headers' && intersectedObjects.length > 1) {
        // Let hover pass through if the object is a PNG header
        candidate = intersectedObjects[1].object
      }

      if (!candidate) return

      if (candidate != this.hoveredObject) {
        outlinePass.selectedObjects = []
        this.hoveredObject = candidate
      }
      if (candidate?.clickable) {
        document.body.style.cursor = 'pointer'
      }

      if (mouseEvents.getIsAreaActive('socials') && candidate.clickable) {
        // We should instead use mouseEvents to handle the hover
        if (candidate.name !== 'Credits') mouseEvents.handleSocialIconHover(candidate, loop, scene)
        else mouseEvents.handleSocialIconHover(null, loop, scene) // Credits should prevent this
      } else if (mouseEvents.getIsAreaActive('about') && candidate.clickable) {
        if (mouseEvents.getActiveAboutSubarea() === 'skills' && candidate.area === 'about_skills') {
          if (candidate.name !== 'Soft_Skills')
            mouseEvents.handleHardSkillsHover(candidate.parent, loop, screenPosition)
        }
      } else {
        // Remove hover effects
        mouseEvents.handleSocialIconHover(null, loop, scene)
        mouseEvents.handleHardSkillsHover(null, loop, screenPosition)
        mouseEvents.setHoveredObjectTag(null)

        document.body.style.cursor = 'default'
      }

      // Add hovered object to outline pass
      if (
        this.hoveredObject.clickable &&
        mouseEvents.canSetHoveredObject(this.hoveredObject.area)
      ) {
        outlinePass.selectedObjects.push(this.hoveredObject)
        mouseEvents.setHoveredObjectTag(
          this.hoveredObject.name,
          screenPosition,
          this.hoveredObject.area,
        )
        document.body.style.cursor = 'pointer'
      }
    } else {
      // Remove hover effects
      this._removeHoverEffects(loop, screenPosition, scene)
      document.body.style.cursor = 'default'

      mouseEvents.setHoveredObjectTag(null)
      outlinePass.selectedObjects = []
    }
  }

  // Private methods
  _activateMouseEvents(scene, camera, loop) {
    this.clickListener = (event) => {
      const normalizedPosition = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
      this.click(normalizedPosition, scene, camera, loop)
    }

    this.hoverListener = (event) => {
      const normalizedPosition = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
      this.hover(normalizedPosition, scene, camera, loop)
    }

    window.addEventListener('click', this.clickListener)
    window.addEventListener('mousemove', this.hoverListener)
  }

  _deactivateMouseEvents() {
    window.removeEventListener('click', this.clickListener)
    window.removeEventListener('mousemove', this.hoverListener)

    this.clickListener = null
    this.hoverListener = null
  }

  _removeHoverEffects(loop, screenPosition, scene) {
    mouseEvents.handleSocialIconHover(null, loop, scene)
    mouseEvents.handleHardSkillsHover(null, loop, screenPosition)
    document.body.style.cursor = 'default'
  }
}

export { PickHelper }
