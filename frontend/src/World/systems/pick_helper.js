import { Raycaster } from 'three';
import * as mouseEvents from './mouse_events.js';

class PickHelper {
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }

  pick(normalizedPosition, scene, camera, controls, loop) {
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
      if (this.pickedObject.name == 'aboutArea') {
        mouseEvents.handleAboutClick(camera, controls, this.pickedObject, loop);
      }
      else if (this.pickedObject.name == 'Notebook') {
        mouseEvents.handleOpenBook(this.pickedObject);
      }

    }
  }
}

export { PickHelper };
