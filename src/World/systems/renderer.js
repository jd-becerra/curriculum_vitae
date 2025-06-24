import { WebGLRenderer, PCFSoftShadowMap } from "three";

function createRenderer() {
 const renderer = new WebGLRenderer({ antialias: false});

 // Turn on the physically correct lighting model.
 renderer.physicallyCorrectLights = true;

 // AS LAST RESORT FOR PERFORMANCE
 // renderer.setPixelRatio( window.devicePixelRatio * 0.5 );

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor( 0x000000, 0 );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "2";
  renderer.domElement.style.pointerEvents = "none";

  return renderer;
}

export { createRenderer };
