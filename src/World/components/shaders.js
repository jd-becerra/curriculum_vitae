import { Vector3, BufferGeometry, BufferAttribute, ShaderMaterial, Color, Points } from 'three';

const snowVertexShader = `
  uniform float radiusX;
  uniform float radiusZ;
  uniform float size;
  uniform float scale;
  uniform float height;
  uniform float elapsedTime;
  uniform float speed;

  void main() {
    vec3 pos = position;
    pos.x += cos((elapsedTime * speed + position.z) * 0.25) * radiusX;
    pos.y = mod(pos.y - elapsedTime * speed, height);
    pos.z += sin((elapsedTime * speed + position.x) * 0.25) * radiusZ;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const snowFragmentShader = `
  uniform vec3 color;

  void main() {
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createSnowShaderPlane(innerHeight = 40.0, initialPos = new Vector3(0, 0, 0)) {
  const particleSystemHeight = 40.0;
  const particleSystemWidth = 10.0;
  const particleSystemDepth = 70.0;
  const count = 70; // number of particles

  // Create points all lined horizontally, half on the left and half on the right
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = initialPos.x + (Math.random() - 0.5) * particleSystemWidth; // random X
    positions[i * 3 + 1] = Math.random() * particleSystemHeight; // random Y
    positions[i * 3 + 2] = initialPos.z + (Math.random() - 0.5) * particleSystemDepth; // random Z
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new ShaderMaterial({
    uniforms: {
      color: { value: new Color(0xffffff) },
      size: { type: 'f', value: 0.8 },
      scale: { type: 'f', value: innerHeight / 2 },
      height: { value: particleSystemHeight },
      elapsedTime: { value: 0 },
      speed: { value: 2.0 },
      radiusX: { type: 'f', value: 2.5 },
      radiusZ: { type: 'f', value: 2.5 },
    },
    vertexShader: snowVertexShader,
    fragmentShader: snowFragmentShader,
    transparent: true,
  });

  const points = new Points(geometry, material);
  return points;
}
