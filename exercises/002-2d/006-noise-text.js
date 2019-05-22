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
  const count = 50;
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
          radius: Math.abs(random.noise2D(u, v)),
          color: random.pick(palette),
          rotation: random.noise2D(u, v) * .5
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

  console.log(points);

  // draw function
  return ({context, width, height}) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points
    .forEach(
      ({radius, position, color, rotation}) => {
        const [u, v] = position;
        const x = lerp(width * margin, width * (1 - margin), u);
        const y = lerp(height * margin, height * (1 - margin), v);

        context.save();
        context.fillStyle = color;
        context.font = `${radius * width * 0.075}px "Helvetica"`;
        // translate to the current coordinate. otherwise, rotation origins would be the top left of the canvas
        context.translate(x, y);
        context.rotate(rotation);
        // draw text at 0 now that the context has been translated to our position
        context.fillText('=', 0, 0);
        context.restore();
        // context.beginPath();
        // context.arc(x, y, radius * width * .005, 0, Math.PI * 2);
        // context.fillStyle = color;
        // context.fill();
      }
    );
  };
};

canvasSketch(sketch, settings);
