import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import {
  Vector2,
} from "three";

export function createOutlineComposer(renderer, scene, camera, container) {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(window.devicePixelRatio);
  composer.setSize(container.clientWidth, container.clientHeight);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const outlinePass = new OutlinePass(
    new Vector2(container.innerWidth, container.innerHeight),
    scene,
    camera
  );
  outlinePass.edgeStrength = 3.0;
  outlinePass.edgeGlow = 0.0;
  outlinePass.edgeThickness = 1.0;
  outlinePass.visibleEdgeColor.set("#ffffff");
  outlinePass.hiddenEdgeColor.set("#190a05");
  composer.addPass(outlinePass);

/*   const fxaaPass = new ShaderPass(FXAAShader);
  fxaaPass.material.uniforms["resolution"].value.set(
    1 / container.innerWidth,
    1 / container.innerHeight
  );
  composer.addPass(fxaaPass); */

  return {
    composer,
    outlinePass,

    // we need to update outlinePass on container resize
    onResize: (width, height) => {
      composer.setSize(width, height);
      outlinePass.setSize(width, height);
      fxaaPass.material.uniforms['resolution'].value.set(1 / width, 1 / height);
    },
  };
}
