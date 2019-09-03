## Shaders
* Written in GLSL, a typed C-like language
* A fragment shader is run for every pixel.  It determines what color is drawn for that color.  It doesn't know what's happening with other pixels, its only job is to determine a color for the current pixel
* Different variable types:
    * `varying` - a value that is constant for the current pixel, but can change for each individual pixel.  An example might be the x,y position of the pixel
    * `uniform` - value that is the same across all of our pixels.  Usually passed in from JS that is invoking the GLSL shader
* The goal of the `main()` function is to set `gl_FragColor` to the desired color of the pixel, usually a `vec4` rgba.

### using `canvas-sketch` to scaffold a shader
```
canvas-sketch filename.js --new --no-install --template=shader
```