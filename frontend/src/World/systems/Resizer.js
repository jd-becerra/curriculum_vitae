const setSize = (container, camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};
 class Resizer {
  constructor(container, camera, renderer) {
    // Set initial size on load.
    setSize(container, camera, renderer);
     window.addEventListener('resize', () => {
      // Set the size again if a resize occurs
      setSize(container, camera, renderer);
      // Perform any custom actions.
      this.onResize();
    });
  }
   onResize() {}
}
 export { Resizer };
