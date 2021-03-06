const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */`
  precision highp float;

  uniform float time;
  uniform float aspect;
  // vUv is the x,y position of the current pixel
  varying vec2 vUv;

  void main () {
    vec3 colorA = vec3(1.0, 0.0, 0.0);
    vec3 colorB = vec3(0.0, 0.0, 1.0);

    // center of the screen is 0.5, 0.5
    // so center a vector from our current pixel to the center of the screen
    vec2 center = vUv - 0.5;
    // aspect ratio was passed in via js below, use that to scale our center vector
    center.x *= aspect;
    float dist = length(center);

    // mix() is like lerp(), and it can interpolate between vectors. the last argument is a value between 0 and 1 to interpolate to
    vec3 color = mix(colorA, colorB, vUv.x);
    // vec3 color = mix(colorA, colorB, vUv.x * (cos(time) + 0.5) + vUv.y * (cos(time) + 0.5)  );

    // set any pixels outside of our center circle to be 0 alpha
    // you can also use aspect to play with the scale of the circle boundary 
    /*
    float alpha = dist > 0.25 * aspect
      ? 0.0
      : 1.0;    
    */
    // this creates the fuzzy border around the circle. pixels that are between 0.495, and 0.505 will receive an opacity between 0 and 1
    // those greater will receive 0, and those less will receive 1
    // a larger range between the min and max values makes a fuzzier alpha gradient
    float alpha = smoothstep(0.505, 0.495, dist * aspect);

    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width/height
    }
  });
};

canvasSketch(sketch, settings);
