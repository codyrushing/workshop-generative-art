const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');

// lerp is just a d3 scaleLinear with a domain of ([0, 1])

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
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
        points.push([u, v]);
      }
    }
    return points;
  };

  const margin = 0.2;
  const points = createGrid().filter(
    () => Math.random() < 0.5
  );

  // draw function
  return ({context, width, height}) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(
      ([u, v]) => {
        const x = lerp(width * margin, width * (1 - margin), u);
        const y = lerp(height * margin, height * (1 - margin), v);

        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2);
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.stroke();
      }
    )

  };
};

canvasSketch(sketch, settings);
