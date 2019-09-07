## Shaders
* Written in GLSL, a typed C-like language
* A fragment shader is run for every pixel.  It determines what color is drawn for that color.  It doesn't know what's happening with other pixels, its only job is to determine a color for the current pixel
* Different variable types:
    * `varying` - a value that is constant for the current pixel, but can change for each individual pixel.  An example might be the x,y position of the pixel. As far as the graphical pipeline goes, varyings are set from vertex shaders and passed down into fragment shaders.
    * `uniform` - value that is the same across all of our pixels.  Usually passed in from JS that is invoking the GLSL shader
* The goal of the `main()` function is to set `gl_FragColor` to the desired color of the pixel, usually a `vec4` rgba.

### using `canvas-sketch` to scaffold a shader
```
canvas-sketch filename.js --new --no-install --template=shader
```

## glsl
* `mix()` - interpolating between vectors.  First two arguments are vectors to interpolate between, last arg is a float between 0 
and 1
```
// get an interpolated color between colorA and colorB based on vUv.x
vec3 color = mix(colorA, colorB, vUv.x);
```
* vector math
    * shorthands
    ```glsl
    someVec2 - vec2(0.5, 0.5);
    someVec2 - vec2(0.5);
    someVec2 - 0.5;
    ```
    These are all equivalent.
    * `length(someVec2)` - gives the length of a vector
* `step(threshold, value)` - a step function returns 0 if `value` is greater than `threshold` and 1.0 if less.
* `smoothstep(min, max, value)` - this returns an interpolated value between 0 and 1, based on where `value` lies between `min` and `max`.  it's like a d3 linear scale that is clamped, so it will always return a value that is not less than `min` and not greater than `max`

* You can add any fragment shader to a Three.js mesh using the `fragmentShader` option in the material constructor
* `--hot` canvas-sketch CLI option for hot reloading

### Importing modules into GLSL
* Some GLSL utilities are published on npm.  With the magic of `glslify`, we can "import" modules into our shader code, even though this isn't supported in glsl, glslify provides some syntactical tools to do so

A note about noise.  If you're doing an animation, you likely want the current time to be a variable in the noise generation.  

## Vertex shaders
* these are a different thing. fragement shaders drive the colors in individual pixels, and they could be used to color everything in a Three.JS sketch.  You could also use a fragment shader which could, for example, change the entire topology of a mesh in Three.js.  Vertex shaders output a `gl_Position` instead of a `gl_FragColor`.  Insead of running on every pixel, it runs on every vertex in a particular mesh.  
* More info and lessons here - [https://github.com/Jam3/jam3-lesson-webgl-shader-threejs](https://github.com/Jam3/jam3-lesson-webgl-shader-threejs).