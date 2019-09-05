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

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');
  void main () {
    // vec3 colorA = vec3(1.0, 0.0, 0.0);
    // vec3 colorB = vec3(0.0, 0.0, 1.0);

    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);
    
    // mix() is like lerp(), and it can interpolate between vectors. the last argument is a value between 0 and 1 to interpolate to
    // vec3 color = mix(colorA, colorB, vUv.x);
    // vec3 color = mix(colorA, colorB, vUv.x * (cos(time) + 0.5) + vUv.y * (cos(time) + 0.5)  );

    // returns a floating point from -1 to 1
    // pass it a vector scaled to our aspect ratio to prevent distortions at non-square screen sizes
    // and pass it time
    float n = noise(vec3(center, time));

    vec3 color = hsl2rgb(
        // establish a base hue (0.6)
        // the scale of n corresponds to the diversity of hue caused by noise
        0.6 + n * 0.2, 
        0.5, 
        0.5
    );
    float alpha = smoothstep(0.302, 0.298, dist);

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
