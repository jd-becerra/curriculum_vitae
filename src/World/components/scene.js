import { Color, Scene, Fog } from "three";

function createScene(color) {
  const scene = new Scene();

  if (color == "transparent") scene.background = null;
  else scene.background = new Color(color);

  return scene;
}

export { createScene };
