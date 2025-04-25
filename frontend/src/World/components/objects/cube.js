import {
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,  // If we want to use a texture and shadows, use MeshStandardMaterial
  MeshPhongMaterial,
  WireframeGeometry,
  LineSegments,
  TextureLoader,
} from "three";

export default function createCube(props) {
  const scale = props.scale || [1, 1, 1];
  const position = props.position || [0, 0, 0];
  const geometry = new BoxGeometry(scale[0], scale[1], scale[2]);
  const wireframe = new WireframeGeometry(geometry);
  const material = new MeshPhongMaterial({
    color: props.color,
    transparent: true,
    opacity: 0, // Default opacity set to 0.5
    emissive: 0x270000,
  });

  const cube = new Mesh(geometry, material);

  cube.position.set(position[0], position[1], position[2]);

  // Since the cube is only needed to receive click input, it is not rendered
  // cube.visible = false;

  cube.name = props.name || "cube";

  // Custom properties
  cube.clickable = true;

  cube.tick = (delta) => {
    //cube.rotation.y += 0.01;

    /* // Move the cube in orbit
    cube.position.x = Math.cos(cube.rotation.y) * 2;
    cube.position.z = Math.sin(cube.rotation.y) * 2; */
  };

  return cube;
}

export { createCube };
