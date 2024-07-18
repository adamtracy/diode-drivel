// for input via potentiometer wired into sensor input board
export var analogInputs; 
export var frequencyData;


// global hue will be adjusted by where in the cycle we are in the heartbeat. 
// default is magenta, 0.2
export var globalHue = 0.2; 
// 1/0 setting for having the color change or be constant.
export var cycleColor = true;

export var e_fudge = 0.001;
// frequency in milliseconds for cycle times
export var cycleTime = 30000; // 0 * e_fudge; // 60 seconds in milliseconds
      
var lowFreqEnergy = 0;
export var smoothedEnergy = 0; // Holds the smoothed energy value
export var hue = globalHue;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect
var threshold = 0.02; // Minimum energy threshold to activate higher brightness
var defaultBrightness = 0.005; // Reduced default low brightness when under threshold
export var elapsedTime = 0.005; // Manually incremented time variable

// heart stuff
var beatInterval = 1.0; // Time in seconds for one heartbeat cycle
var timeFactor = 0.015;  // 0.015 is about 60bpm // .0075 is like 120bpm rhythm.
export var heartBrightness = 0.1;


export var selectedProgram = 0; // Variable to store the selected program

export var e_delta = 0;
export var direction = 1;

export function beforeRender(delta) {
  // delta is the elapsed miliseconds since last call. inspecting it seems to be ~5ms
  e_delta = delta; // * e_fudge;
  //increment elapsed time
  elapsedTime = elapsedTime + (direction * delta);
  if (elapsedTime >= cycleTime) { // Reset after 60 seconds
      direction = -1;
  } else if (elapsedTime <= 0.0) {
    direction = 1;
  }
  // Change hue based on a sine wave over 1 minute
  if (cycleColor) {
      var timeFraction = elapsedTime / cycleTime;
      hue = 0.5 + 0.5 * sin(timeFraction * 2 * PI);
  }
  
  lowFreqEnergy = 0;
  var totalWeight = 0;
  
  // Apply a nonlinear weighting to the frequency bands
  for (var i = 3; i < 4; i++) {
      var weight = 4 - i; // More importance to the lowest band (index 0)
      lowFreqEnergy += frequencyData[i] * weight;
      totalWeight += weight;
  }

  if (totalWeight > 0) {
      lowFreqEnergy /= totalWeight;
  }

  var gain = 15;
  lowFreqEnergy *= gain;

  lowFreqEnergy = min(1, lowFreqEnergy);

  // Apply exponential smoothing
  smoothedEnergy = (smoothingFactor * lowFreqEnergy) + ((1 - smoothingFactor) * smoothedEnergy);

  // Apply threshold to determine final brightness
  if (smoothedEnergy < threshold) {
      smoothedEnergy = defaultBrightness;
  }

  // Read potentiometer value and map it to select programs
  var potValue = analogInputs[0];
  selectedProgram = floor(potValue * 2); // Assuming we have 2 programs (0 and 1)
 
  // program heartbeat
  // Current time in the beat cycle
  var currentTime = time(timeFactor)
  // Normalize time to a 0-1 range for a complete cycle
  var phase = (currentTime % beatInterval) / beatInterval;
  
  // Calculate the brightness for each ring using sin and cos to create the phase offset
  heartBrightness = (cos(phase * 2 * PI) + 1) / 2; // Cosine for inner ring
  
  
}

export function render(index) {
    if (selectedProgram == 0) {
        // Program 1: Audio reactive with color cycling
        var brightness = smoothedEnergy;
        hsv(hue, 1, brightness);
    } else if (selectedProgram == 1) {
        // Program 2: Static color at constant brightness
        var constantBrightness = 0.5; // Adjust the constant brightness as desired
        hsv(hue, 1, heartBrightness);
    }
}
