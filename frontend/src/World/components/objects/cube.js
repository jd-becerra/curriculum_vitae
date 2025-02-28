import {
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  TextureLoader,
} from "three";

export default function createCube(props) {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({
    color: props.color,
  });

  const cube = new Mesh(geometry, material);
  cube.position.set(0, 0, 0);

  cube.tick = (delta) => {
    cube.rotation.y += 0.001;
  };

  return cube;
}

export { createCube };
