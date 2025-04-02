import { Raycaster } from 'three';
import * as mouseEvents from './mouse_events.js';

class PickHelper {
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }

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

      console.log('Picked object:', this.pickedObject.name, 'with parent:', this.pickedObject.parent.name);
      if (!this.pickedObject.clickable) {
        return;
      }

      // Handle clicks on selected objects
      const objectName = this.pickedObject.name;
      if (objectName== 'aboutArea') {
        mouseEvents.handleAboutClick(camera, controls, this.pickedObject, loop);
      }
      else if (objectName == 'socialsArea') {
        mouseEvents.handleSocialsClick(camera, controls, this.pickedObject, loop, self);

        let activateSocialsArea = mouseEvents.toggleIsSocialsActive();
        if (activateSocialsArea) {
          window.addEventListener("mousemove", (event) => {
            const normalizedPosition = {
              x: (event.clientX / window.innerWidth) * 2 - 1,
              y: -(event.clientY / window.innerHeight) * 2 + 1,
            };
            this.hover(normalizedPosition, scene, camera, loop);
          });
        } else {
          // Remove the event listener if the area is not active
          window.removeEventListener("mousemove", (event) => {
            const normalizedPosition = {
              x: (event.clientX / window.innerWidth) * 2 - 1,
              y: -(event.clientY / window.innerHeight) * 2 + 1,
            };
            this.hover(normalizedPosition, scene, camera, loop);
          });
        }
      }
      else if (objectName == 'Notebook') {
        mouseEvents.handleOpenBook(this.pickedObject);
      }

    }
  }

  hover(normalizedPosition, scene, camera, loop) {
    // Cast a ray through the camera frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);

    if (intersectedObjects.length > 0) {
      // Pick the first (closest) intersected object
      const hoveredObject = intersectedObjects[0].object;

      console.log('Hovered object:', hoveredObject.name, 'with parent:', hoveredObject.parent.name);

    }
  }
}

export { PickHelper };
