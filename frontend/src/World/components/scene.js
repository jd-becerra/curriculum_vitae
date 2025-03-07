import { Color, Scene, Fog } from "three";

function createScene(color) {
  const scene = new Scene();

  if (color == "transparent") scene.background = null;
  else scene.background = new Color(color);

  scene.fog = new Fog(color, 50, 90);

  return scene;
}

export { createScene };
