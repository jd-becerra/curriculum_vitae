import {
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,  // If we want to use a texture and shadows, use MeshStandardMaterial
  MeshPhongMaterial,
  WireframeGeometry,
  LineSegments,
  TextureLoader,
} from "three";

function createCube(props) {
  const scale = props.scale || [1, 1, 1];
  const position = props.position || [0, 0, 0];
  const geometry = new BoxGeometry(scale[0], scale[1], scale[2]);
  const wireframe = new WireframeGeometry(geometry);
  const material = new MeshPhongMaterial({
    color: props.color,
    transparent: true,
    opacity: 0.1, // Default opacity set to 0.5
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

function removeAreaSelectors(scene) {
  const projectsArea = scene.getObjectByName("Projects Area");
  if (projectsArea) {
    scene.remove(projectsArea);
  }

  const socialsArea = scene.getObjectByName("Socials Area");
  if (socialsArea) {
    scene.remove(socialsArea);
  }

  const aboutArea = scene.getObjectByName("About Area");
  if (aboutArea) {
    scene.remove(aboutArea);
  }
}

function createAreaSelectors(scene) {
  // create cubes that will be used as click areas for the labels
  const cubeComputer = createCube({
    color: "blue",
    scale: [15,10,20],
    position: [-15, -3, -5],
    name: "Projects Area",
  });
  scene.add(cubeComputer);
  const cubeSocials = createCube({
    color: "red",
    scale: [14,12,10],
    position: [14, 4, -30],
    name: "Socials Area",
  });
  scene.add(cubeSocials);
  const cubeBookcase = createCube({
    color: "yellow",
    scale: [14,22,10],
    position: [-5, 0, -30],
    name: "About Area",
  });
  scene.add(cubeBookcase);
}

export { createAreaSelectors, removeAreaSelectors };
