import { Raycaster } from 'three';
import * as mouseEvents from './mouse_events.js';

class PickHelper {
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;

    this.hoveredObject = null;

    this.hardSkills = [
      'C++',
      'Python',
      'JavaScript',
      'HTML',
      'Node',
      'React',
      'Vue',
      'SQL',
    ]
  }

  // Public methods
  click(normalizedPosition, scene, camera, controls, loop) {
    const time = loop.time;

    // Restore the color if there was a previously picked object
    if (this.pickedObject) {
      if (this.pickedObject.material && this.pickedObject.material.emissive) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      }
      this.pickedObject = null;
    }

    // Cast a ray through the camera frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);

    if (intersectedObjects.length > 0) {
      // Pick the first (closest) intersected object
      this.pickedObject = intersectedObjects[0].object;

      if (!this.pickedObject.clickable) {
        return;
      }

      // Handle clicks on selected objects
      const objectName = this.pickedObject.name;
      if (objectName == 'projectsArea') {
        mouseEvents.handleProjectsClick(camera, controls, this.pickedObject, loop);

        const objectToRemove = scene.getObjectByName("projectsArea");
        if (objectToRemove) {
          scene.remove(objectToRemove);
        }
        this.pickedObject = null;
      }
      else if (objectName == 'socialsArea') {
        mouseEvents.handleSocialsClick(camera, controls, this.pickedObject, loop, self);
        const activateSocialsArea = mouseEvents.toggleIsSocialsActive();
        if (activateSocialsArea) {
          // Remove the object from the scene
          const objectToRemove = scene.getObjectByName("socialsArea");
          if (objectToRemove) {
            scene.remove(objectToRemove);
          }
          this.pickedObject = null;
        }
      }
      else if (objectName == 'aboutArea') {
        mouseEvents.handleAboutClick(camera, controls, this.pickedObject, loop, scene);
        const activateAboutArea = mouseEvents.toggleIsAboutActive();
        if (activateAboutArea) {
          const objectToRemove = scene.getObjectByName("aboutArea");
          if (objectToRemove) {
            scene.remove(objectToRemove);
          }
        }
        this.pickedObject = null;
      }
      else if (objectName == 'Notebook') {
        mouseEvents.handleOpenBook(this.pickedObject);
      }
      // If clicked object is a social media icon, open the corresponding link
      else if (mouseEvents.getIsAreaActive("socials")) {
        console.log("Clicked on social media icon:", this.pickedObject.name);
        mouseEvents.handleSocialIconClick(this.pickedObject.name, loop);
      }
      else if (mouseEvents.getIsAreaActive("about")) {
        console.log("Clicked on about icon:", this.pickedObject.name);
        // mouseEvents.handleAboutBookClick(this.pickedObject.name, loop);
      }
    }
  }

  hover(normalizedPosition, scene, camera, loop, screenPosition, outlinePass) {
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);


    let newHoveredObject = null;
    if (intersectedObjects.length > 0) {
      let candidate = intersectedObjects[0].object;

      if (candidate != this.hoveredObject) {
        outlinePass.selectedObjects = [];
        this.hoveredObject = candidate;
      }

      if (mouseEvents.getIsAreaActive("socials") && candidate.clickable) {
        // Change cursor to pointer
        document.body.style.cursor = 'pointer';
        newHoveredObject = candidate;

        // We should instead use mouseEvents to handle the hover
        mouseEvents.handleSocialIconHover(candidate, loop);
      }
      else if (mouseEvents.getIsAreaActive("about") && candidate.clickable) {
        // Change cursor to pointer
        document.body.style.cursor = 'pointer';
        newHoveredObject = candidate;

        mouseEvents.handleHardSkillsHover(candidate.parent, loop, screenPosition);
      }
      else {
        // Remove hover effects
        mouseEvents.handleSocialIconHover(null, loop);
        mouseEvents.handleHardSkillsHover(null, loop, screenPosition);

        document.body.style.cursor = 'default';
      }

      // Add hovered object to outline pass
      if (this.hoveredObject.clickable) {
        outlinePass.selectedObjects.push(this.hoveredObject);
        document.body.style.cursor = 'pointer';
      }
    } else {
      // Remove hover effects
      mouseEvents.handleSocialIconHover(null, loop);
      mouseEvents.handleHardSkillsHover(null, loop, screenPosition);
      document.body.style.cursor = 'default';

      outlinePass.selectedObjects = [];
    }
  }

  // Private methods
  _activateHover(scene, camera, loop) {
    window.addEventListener("mousemove", (event) => {
      const normalizedPosition = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
      this.hover(normalizedPosition, scene, camera, loop);
    });
  }

  _deactivateHover(scene, camera, loop) {
    window.removeEventListener("mousemove", (event) => {
      const normalizedPosition = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
      this.hover(normalizedPosition, scene, camera, loop);
    });
  }

}

export { PickHelper };
