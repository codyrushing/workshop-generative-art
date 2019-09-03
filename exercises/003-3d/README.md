Use `canvas-sketch` to scaffold a Three.js sketch like so:

```
npx canvas-sketch {filename}.js --no-install --open --new --template=three
```

## Three.js concepts
* __Material__ - describes the surface qualities of a mesh
  * `MeshBasicMaterial` - you give it a color and that object will always be that color, regardless of light.  A sphere with this material will basically just look like a circle
  * `MeshNormalMaterial` - shows you all of the faces of a mesh
  * `MeshStandardMaterial` - responds to light.  If you render one of these in a scene with no light, you will see nothing.  Just like real life.

* __Geometries__ - the topology or shape of an object.  Three.JS has a bunch built in, or you could import a model

* Geometry combined with materials gives you __Meshes__.  For example, if you want to render 100 boxes, even boxes of different size/shapes, as long as they fit within the definition of a geometry, then you only need one instance of that geometry.  You would then clone that geometry 100 times and possibly give it different meshes to create a scene with 100 objects of similar geometry.

* __Camera__ - a virtual eyepiece or way of looking at the world.  It can have all sorts of different qualities
  * __Perspective camera__ - has a traditional "vanishing point", in which objects that are more in the direction of the vanishing point appear to distort and shrink away.  
  * __Orthographic camera__ - objects further away don't distort and shrink.  It's sort of depth-less.  Great for 2.5d type of look.

* `render.setClearColor()` sets the background color. It's kind of independent of light.
* Without light,

## 3D coordinates
* In 2D, top left of the screen is 0,0 and bottom right is width, height
* In 3D, it doesn't really work like that.  You have to define an origin 0,0 which is the center of the world, not necessarily the center of the screen.  All positions are defined as relative to that.

## Animation export notes
* Add `duration` and `fps` to canvas sketch settings (see 003-animation).
* Run canvas-sketch with `--output=tmp/` to specify a temp directory.
* Click on canvas element in browser, and press cmd+shift+s to save all frames.
* Make sure `duration` is set in the settings, otherwise it will endlessly make frames.
* `canvas-sketch-mp4 tmp/` - uses ffmpeg to build an mp4 from frames
* OR, go to https://giftool.surge.sh/, which will allow you to upload frames and get an mp4

* `eases` is an npm package with a bunch of easing functions
* `bezier-easing` - an npm package to make your own easing functions with cubic bezier values.  Eg