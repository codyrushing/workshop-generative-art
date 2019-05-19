const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

// set a deterministic seed
// random.setSeed(400);

// lerp is just a d3 scaleLinear with a domain of ([0, 1])

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const palette = random.pick(palettes);
  // create an array of grid points
  const count = 40;
  const createGrid = () => {
    const points = [];
    for(let x=0; x<count; x++){
      for(let y=0; y<count; y++){
        // subtract count by 1 here to make a grid that actually spans the canvas edge to edge
        // otherwise, it'd stop at 0.8
        let u = count <= 1 ? 0.5 : x / (count - 1);
        let v = count <= 1 ? 0.5 : y / (count - 1);
        points.push({
          position: [u, v],
          //
          radius: Math.abs(random.gaussian()),
          color: random.pick(palette)
        });
      }
    }
    return points;
  };

  const margin = 0.2;
  const points = createGrid()
    .filter(
      () => random.value() < 0.5
    );

  // draw function
  return ({context, width, height}) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points
    .forEach(
      ({radius, position, color}) => {
        const [u, v] = position;
        const x = lerp(width * margin, width * (1 - margin), u);
        const y = lerp(height * margin, height * (1 - margin), v);

        context.beginPath();
        context.arc(x, y, radius * width * .006, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      }
    );
  };
};

canvasSketch(sketch, settings);
