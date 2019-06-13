To run the examples, use `canvas-sketch`

```
npx canvas-sketch {filename} --no-install --open
```

Sometimes starting with a blank canvas is a difficult jumping off point.  Building a grid is a way to have something to start with that fills the canvas and can be dynamically changed

`canvas-sketch-utils` has a bunch of util functions.
* random allows you to make deterministic random #s.  Also gaussian randoms and other pseudo-randoms.
* math has a bunch of match stuff

Noise functions allow you to produce values from coordinates, in which nearby values are similar.  So it's spacially aware, helps make natural, undulating systems.
