import { Clock } from 'three';

const clock = new Clock();


class Loop {
 constructor(camera, scene, renderer, cssRenderer = null) {
   this.camera = camera;
   this.scene = scene;
   this.renderer = renderer;
   this.updatables = [];
 }

 start() {
   this.renderer.setAnimationLoop(() => {
       this.tick();
   });
 }

 render() {
  this.renderer.render(this.scene, this.camera);

 }

 stop() {
   this.renderer.setAnimationLoop(null);
 }

 tick() {
   const delta = clock.getDelta();
   for (const object of this.updatables) {
       object.tick(delta);
   }
 }
}

export { Loop }
