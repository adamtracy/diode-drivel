var numGrids = 16;          // Total number of grids
var ledsPerGrid = 36;       // Number of LEDs per grid (6x6)
var numLEDs = numGrids * ledsPerGrid;  // Total number of LEDs

// Adjusted time offsets for each grid to be very close, promoting more synchronization
var timeOffsets = [
  0.10, 0.102, 0.104, 0.106,
  0.108, 0.110, 0.112, 0.114,
  0.116, 0.118, 0.120, 0.122,
  0.124, 0.126, 0.128, 0.130
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

  // Use the pulse value to set the brightness of the base color
  var baseColor = gridColors[gridNumber];
  var r = baseColor[0] * pulse;
  var g = baseColor[1] * pulse;
  var b = baseColor[2] * pulse;

  // Set the color of the current LED
  rgb(r, g, b);
}
