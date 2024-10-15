// TODO compare this with pulse_solids.js. i like this one better i thnnk

var numGrids = 16;          // Total number of grids
var ledsPerGrid = 36;       // Number of LEDs per grid (6x6)
var numLEDs = numGrids * ledsPerGrid;  // Total number of LEDs

// Static time offsets for each grid, keeping them constant
var timeOffsets = [
  0.09, 0.10, 0.11, 0.12,
  0.13, 0.14, 0.15, 0.16,
  0.17, 0.18, 0.19, 0.20,
  0.21, 0.22, 0.23, 0.24
];

// Hard-coded colors for each grid (R, G, B values between 0 and 1)
var gridColors = [
  [1, 0, 0],    // Red
  [0, 1, 0],    // Green
  [0, 0, 1],    // Blue
  [1, 1, 0],    // Yellow
  [1, 0, 1],    // Magenta
  [0, 1, 1],    // Cyan
  [0.5, 0.5, 0],// Olive
  [0.5, 0, 0.5],// Purple
  [0.5, 1, 0.5],// Light Green
  [1, 0.5, 0],  // Orange
  [0, 0.5, 1],  // Sky Blue
  [0.5, 0, 1],  // Violet
  [0.5, 0.5, 1],// Light Blue
  [1, 0.5, 0.5],// Light Red
  [0.5, 1, 1],  // Aqua
  [1, 1, 1]     // White
];

export function beforeRender(delta) {
  // No changes needed here; offsets remain constant
}

export function render(index) {
  // Determine the grid number for the current LED
  var gridNumber = floor(index / ledsPerGrid);
  
  // Calculate the time-based pulse for the current grid using the constant offset
  var phase = time(timeOffsets[gridNumber]);
  var pulse = wave(phase);

  // Get the base color for the current grid
  var baseColor = gridColors[gridNumber];

  // Use the pulse value to scale the base color
  var r = baseColor[0] * pulse;
  var g = baseColor[1] * pulse;
  var b = baseColor[2] * pulse;

  // Set the color of the current LED
  rgb(r, g, b);
}
