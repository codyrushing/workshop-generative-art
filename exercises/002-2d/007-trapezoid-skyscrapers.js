const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

/*
Prompt:
* Create a 6x6 grid of points
* Randomly select pairs of points
* Draw a trapezoid by making a line segment from those two points, and then straight down to the bottom of the canvas
* Stack them such that those with the heighest avg Y position are stacked behind shorter ones, creating a city skyline type of effect
*/

// set a deterministic seed
// random.setSeed(400);

// lerp is just a d3 scaleLinear with a domain of ([0, 1])

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const palette = random.shuffle(random.pick(palettes));
  const margin = 0.2;

  // generate grid points
  const count = 4;
  const createGrid = () => {
    const points = [];
    for(let x=0; x<count; x++){
      for(let y=0; y<count; y++){
        // subtract count by 1 here to make a grid that actually spans the canvas edge to edge
        // otherwise, it'd stop at 0.8
        let u = count <= 1 ? 0.5 : x / (count - 1);
        let v = count <= 1 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  };

  // shuffle points
  const points = random.shuffle(createGrid());

  let i = 0;
  const pointGroups = [];
  const groupSize = 2;
  // group adjacent pairs of now shuffled array of points
  while(i < points.length){
    let j = i + groupSize;
    let peaks = points.slice(i, j);
    pointGroups.push({
      peaks,
      avgY: peaks.reduce(
        (acc, v) => {
          acc += v[1];
          return acc;
        },
        0
      ) / groupSize,
      color: random.pick(palette)
    });
    i = j;
  }

  // sort by avg y position between the two points
  pointGroups.sort(
    (a, b) => a.avgY - b.avgY
  );

  // draw function
  return ({context, width, height}) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    pointGroups.forEach(
      ({peaks, color}) => {
        context.beginPath();
        context.fillStyle = color;
        context.globalAlpha = 0.9;
        context.strokeStyle = 'white';
        context.lineWidth = 20;

        // set points for peaks
        peaks = peaks.map(
          p => [p[0] * width, p[1] * height]
        );

        // draw the tops of each shape
        peaks.forEach(
          (p, i) => {
            if(i === 0){
              context.moveTo(p[0], p[1]);
              return;
            }
            context.lineTo(p[0], p[1]);
          }
        );

        // draw down to bottom of canvas
        peaks.reverse().forEach(
          (p, i) => {
            context.lineTo(p[0], height);
          }
        );

        context.closePath();
        context.fill();
        context.stroke();

      }
    );

    // points
    // .forEach(
    //   ({radius, position, color, rotation}) => {
    //     const [u, v] = position;
    //     const x = lerp(width * margin, width * (1 - margin), u);
    //     const y = lerp(height * margin, height * (1 - margin), v);
    //
    //     context.save();
    //     context.fillStyle = color;
    //     context.font = `${radius * width * 0.075}px "Helvetica"`;
    //     // translate to the current coordinate. otherwise, rotation origins would be the top left of the canvas
    //     context.translate(x, y);
    //     context.rotate(rotation);
    //     // draw text at 0 now that the context has been translated to our position
    //     context.fillText('=', 0, 0);
    //     context.restore();
    //     // context.beginPath();
    //     // context.arc(x, y, radius * width * .005, 0, Math.PI * 2);
    //     // context.fillStyle = color;
    //     // context.fill();
    //   }
    // );


  };
};

canvasSketch(sketch, settings);
