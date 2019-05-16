const canvasSketch = require('canvas-sketch');

const settings = {
  // specifies a print style shape layout
  dimensions: 'A4',
  // set dpi to be more print friendly
  pixelsPerInch: 300,
  // can actually abstract to cm
  units: 'cm'
};

const sketch = () => {
  return ({context, width, height}) => {
    context.fillStyle = 'brown';
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, width * 0.3, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = width * 0.05;
    context.stroke();
    // context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
