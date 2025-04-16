import { Raycaster } from 'three';
import * as mouseEvents from './mouse_events.js';

class PickHelper {
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;

    this.hoveredObject = null;
    this.hoveredObjectInitialY = null;
    this.hoverTick = null;

    this.gmailLink = "jbecerraofficial@gmail.com";
    this.linkedinLink = "https://www.linkedin.com/in/jes%C3%BAs-david-becerra-063694310/";
    this.githubLink = "https://github.com/jd-becerra";
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
      if (objectName== 'aboutArea') {
        mouseEvents.handleAboutClick(camera, controls, this.pickedObject, loop);

        const objectToRemove = scene.getObjectByName("aboutArea");
        if (objectToRemove) {
          scene.remove(objectToRemove);
        }
        this.pickedObject = null;
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

          // Remove the object from the scene
          const objectToRemove = scene.getObjectByName("socialsArea");
          if (objectToRemove) {
            scene.remove(objectToRemove);
          }
          this.pickedObject = null;


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
      // If clicked object is a social media icon, open the corresponding link
      else if (mouseEvents.getIsSocialsActive()) {
          if (this.pickedObject.parent.name == 'Gmail') {
          this._removeHoverTick(loop);
          window.open(`mailto:${this.gmailLink}`, '_blank');
        }
        else if (this.pickedObject.parent.name == 'LinkedIn') {
          this._removeHoverTick(loop);
          window.open(this.linkedinLink, '_blank');

        }
        else if (this.pickedObject.parent.name == 'Github') {
          this._removeHoverTick(loop);
          window.open(this.githubLink, '_blank');
        }
      }

    }
  }

  hover(normalizedPosition, scene, camera, loop) {
    this.raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);

    let newHoveredObject = null;
    if (intersectedObjects.length > 0) {
      const candidate = intersectedObjects[0].object;
      if (['Gmail', 'LinkedIn', 'Github'].includes(candidate.parent.name)) {
        // Change cursor to pointer
        document.body.style.cursor = 'pointer';
        newHoveredObject = candidate.parent;
      }
    }

    // If hover has changed
    if (newHoveredObject !== this.hoveredObject) {
      // Reset old hovered object's position before nulling it
      if (this.hoveredObject && this.hoveredObjectInitialY != null) {
        this.hoveredObject.position.y = this.hoveredObjectInitialY;
      }

      // Remove old tick
      this._removeHoverTick(loop);

      this.hoveredObject = newHoveredObject;

      if (this.hoveredObject) {
        this.hoveredObjectInitialY = this.hoveredObject.position.y;

        let time = 0;
        this.hoverTick = {
          tick: (delta) => {
            time += delta;
            let amplitude = 1;
            this.hoveredObject.position.y = this.hoveredObjectInitialY + Math.sin(time * 3) * amplitude;
          },
        };
        loop.updatables.push(this.hoverTick);
      } else {
        this.hoveredObjectInitialY = null;
        this.hoverTick = null;
        // Reset cursor to default if not hovering a candidate
        document.body.style.cursor = 'default';
      }
    } else if (!newHoveredObject) {
      // Reset cursor to default if no candidate is hovered
      document.body.style.cursor = 'default';
    }
  }

  // Private methods
  _removeHoverTick(loop) {
    if (this.hoverTick && loop.updatables.includes(this.hoverTick)) {
      const index = loop.updatables.indexOf(this.hoverTick);
      if (index > -1) loop.updatables.splice(index, 1);
    }
  }

}

export { PickHelper };
