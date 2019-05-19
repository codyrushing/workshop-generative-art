const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  // create an array of grid points
  const createGrid = () => {
    const points = [];
    const count = 5;
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

  const points = createGrid();


  // draw function
  return ({context, width, height}) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(
      ([u, v]) => {
        const x = u * width;
        const y = v * height;

        context.beginPath();
        context.arc(x, y, 200, 0, Math.PI * 2);
        context.strokeStyle = 'black';
        context.stroke();
      }
    )

  };
};

canvasSketch(sketch, settings);
