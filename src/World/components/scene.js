import { Color, Scene } from "three";
import { useMainStore } from "../../components/store";

function createScene(color) {
  const scene = new Scene();

  if (color == "transparent") scene.background = null;
  else scene.background = new Color(color);

  const store = useMainStore();
  store.set3DScene(scene);

  return scene;
}

export { createScene };
