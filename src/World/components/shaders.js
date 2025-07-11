import {
  Vector3,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Color,
  Points,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Mesh,
} from 'three'

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
`

const snowFragmentShader = `
  uniform vec3 color;

  void main() {
    // Calculate distance from center of point
    float dist = length(gl_PointCoord - vec2(0.5));
    // Smooth edge for anti-aliasing
    float alpha = smoothstep(0.5, 0.45, dist);

    // Create a lighter color for the edge
    vec3 edgeColor = mix(color, vec3(1.0), 0.7);

    // Interpolate color: center is color, edge is lighter
    vec3 finalColor = mix(edgeColor, color, 1.0 - smoothstep(0.35, 0.0, dist));

    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function createSnowShaderPlane(
  innerHeight = 40.0,
  initialPos = new Vector3(-40, -60, -15),
  scene,
  loop,
) {
  const particleSystemHeight = 40.0
  const particleSystemWidth = 10.0
  const particleSystemDepth = 70.0
  const count = 70 // number of particles

  // Create points all lined horizontally, half on the left and half on the right
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = initialPos.x + (Math.random() - 0.5) * particleSystemWidth // random X
    positions[i * 3 + 1] = Math.random() * particleSystemHeight // random Y
    positions[i * 3 + 2] = initialPos.z + (Math.random() - 0.5) * particleSystemDepth // random Z
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))

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
  })

  const points = new Points(geometry, material)
  points.position.y = -20
  points.position.x = -5
  points.position.z = 10

  // Add tick to update the shader
  loop.updatables.push({
    tick: (delta) => {
      points.material.uniforms.elapsedTime.value += delta
    },
  })

  // Add a simple panel mesh in front (z axis) that covers the particles like a window USING FUCKING MESH BASIC MATERIAL
  const planeGeo = new PlaneGeometry(particleSystemWidth, particleSystemHeight)
  const planeMaterial = new MeshPhysicalMaterial({
    color: 0xbcd8f3,
    roughness: 0.4,
    transmission: 1,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  })
  const plane = new Mesh(planeGeo, planeMaterial)

  plane.position.set(initialPos.x + 4, 10, initialPos.z + 5)
  plane.scale.set(7, 1, 1)
  plane.rotation.y = Math.PI / 2 // Rotate to face the camera

  scene.add(plane)
  scene.add(points)
}
