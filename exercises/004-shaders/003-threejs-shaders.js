const canvasSketch = require('canvas-sketch');
const convexHull = require('convex-hull');
const random = require('canvas-sketch-util/random');
const { linspace } = require('canvas-sketch-util/math');
const glslify = require('glslify');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  const vertexShader = glslify(`
    varying vec2 vUv;

    uniform float time;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');
 
    void main () {
      // set varying vUv here in vertex shader so it can be used in fragment shader
      vUv = uv;

      vec3 transformed = position.xyz;

      // layering two different noise layers
      // value += amplitude * 4dnoise( 3dposition * frequency, time)
      // frequency and amplitude are values in noise generation just like you would think of in wave signals
      float offset = 0.0;
      offset += 0.5 * noise(vec4(position.xyz * 0.5, time * 0.25));
      offset += 0.25 * noise(vec4(position.xyz * 1.5, time * 0.25));

      // normal is the surface normal at this vertex. basically it's the vector pointing out from the center of the sphere
      // more more useful for manipulating topology of a mesh
      transformed += normal * offset;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `);

  const fragmentShader = glslify(`
    varying vec2 vUv;
    uniform float time;

    #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

    void main () {
      // set a hue based on x position on sphere
      float hue = mix(0.2, 0.5, sin(vUv.x * 3.14));
      // set saturation to 0.5
      // set lightness to the y position on the sphere, so fully light (white) at north pole, and fully dark (black) at south pole
      vec3 color = hsl2rgb(vec3(hue, 0.5, vUv.y));
      gl_FragColor = vec4(color, 1.0);
    }
  `);

  const geometry = new THREE.SphereGeometry(1, 64, 64);

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.ShaderMaterial({
      flatShading: true,
      // wireframe: true,
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      // this is where we pass in uniforms from JS to shaders
      uniforms: {
        time: { value: 0 }
      }
    })
  );
  scene.add(mesh);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time }) {
      mesh.rotation.y = time;
      mesh.material.uniforms.time.value = time;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);