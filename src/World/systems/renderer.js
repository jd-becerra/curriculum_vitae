import { WebGLRenderer } from "three";

function createRenderer() {
 const renderer = new WebGLRenderer({ antialias: false});

 // Turn on the physically correct lighting model.
 renderer.physicallyCorrectLights = true;

 // AS LAST RESORT FOR PERFORMANCE
 // renderer.setPixelRatio( window.devicePixelRatio * 0.5 );

 return renderer;
}

export { createRenderer };
