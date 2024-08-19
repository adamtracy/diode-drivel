// for input via potentiometer wired into sensor input board
export var analogInputs; 
// for data coming from mic on sensor input board
export var frequencyData;

// global hue will be adjusted by where in the cycle we are in the heartbeat. 
export var globalHue = 0.2; // default is magenta, 0.2

// Change this if you dont want the color to change.
export var cycleColor = true;

export var cycleTime = 30000; // frequency in milliseconds for cycle times, 60 seconds in milliseconds

var lowFreqEnergy = 0;
export var smoothedEnergy = 0; // Holds the smoothed energy value
export var hue = globalHue;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect
var threshold = 0.02; // Minimum energy threshold to activate higher brightness
var defaultBrightness = 0.005; // Reduced default low brightness when under threshold
export var elapsedTime = 0.005; // Manually incremented time variable

// Heartbeat stuff
var beatInterval = 1.0; // Time in seconds for one heartbeat cycle
var timeFactor = 0.015;  // 0.015 is about 60bpm, 0.0075 is like 120bpm rhythm.
export var heartBrightness = 0.1;

export var selectedProgram = 0; // Variable to store the selected program
export var e_delta = 0;
export var direction = 1;

export function beforeRender(delta) {
  // Update elapsed time with direction control
  e_delta = delta; 
  elapsedTime += direction * delta;
  if (elapsedTime >= cycleTime) { 
    direction = -1;
  } else if (elapsedTime <= 0) {
    direction = 1;
  }

  // Change hue based on a sine wave over the cycle time
  if (cycleColor) {
    var timeFraction = elapsedTime / cycleTime;
    hue = 0.5 + 0.5 * sin(timeFraction * 2 * PI);
  }
  
  // Audio reactive calculations
  lowFreqEnergy = 0;
  var totalWeight = 0;
  for (var i = 3; i < 4; i++) {
    var weight = 4 - i;
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
  if (smoothedEnergy < threshold) {
    smoothedEnergy = defaultBrightness;
  }

  // Read potentiometer value to select program
  var potValue = analogInputs[0];
  selectedProgram = floor(potValue * 2); // Assuming we have 2 programs (0 and 1)

  // Heartbeat brightness calculation
  var currentTime = time(timeFactor);
  var phase = (currentTime % beatInterval) / beatInterval;
  heartBrightness = (cos(phase * 2 * PI) + 1) / 2;
}

// for input via potentiometer wired into sensor input board
export var analogInputs; 
// for data coming from mic on sensor input board
export var frequencyData;

// global hue will be adjusted by where in the cycle we are in the heartbeat. 
export var globalHue = 0.2; // default is magenta, 0.2

// Change this if you dont want the color to change.
export var cycleColor = true;

export var cycleTime = 30000; // frequency in milliseconds for cycle times, 60 seconds in milliseconds

var lowFreqEnergy = 0;
export var smoothedEnergy = 0; // Holds the smoothed energy value
export var hue = globalHue;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect
var threshold = 0.02; // Minimum energy threshold to activate higher brightness
var defaultBrightness = 0.005; // Reduced default low brightness when under threshold
export var elapsedTime = 0.005; // Manually incremented time variable

// Heartbeat stuff
var beatInterval = 1.0; // Time in seconds for one heartbeat cycle
var timeFactor = 0.015;  // 0.015 is about 60bpm, 0.0075 is like 120bpm rhythm.
export var heartBrightness = 0.1;

export var selectedProgram = 0; // Variable to store the selected program
export var e_delta = 0;
export var direction = 1;

// New variables for the cloudburst effect
var cloudburstCenter =40;
var cloudburstIntensity = 0;
var cloudburstDecay = 0.001; // Decay rate of the burst
var cloudburstSpeed = 0.002; // Speed of the burst expansion


export function beforeRender(delta) {
  // Read potentiometer value to select program
  var potValue = analogInputs[0];

  selectedProgram = floor(potValue * 4); 
  
  // Update elapsed time with direction control
  e_delta = delta; 
  elapsedTime += direction * delta;
  if (elapsedTime >= cycleTime) { 
    direction = -1;
  } else if (elapsedTime <= 0) {
    direction = 1;
  }

  // Change hue based on a sine wave over the cycle time
  if (cycleColor) {
    var timeFraction = elapsedTime / cycleTime;
    hue = 0.5 + 0.5 * sin(timeFraction * 2 * PI);
  }
  
  // Audio reactive calculations
  lowFreqEnergy = 0;
  var totalWeight = 0;
  for (var i = 3; i < 4; i++) {
    var weight = 4 - i;
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
  if (smoothedEnergy < threshold) {
    smoothedEnergy = defaultBrightness;
  }

  
  // Heartbeat brightness calculation
  var currentTime = time(timeFactor);
  var phase = (currentTime % beatInterval) / beatInterval;
  heartBrightness = (cos(phase * 2 * PI) + 1) / 2;
  
  // Update cloudburst intensity and center for Program 4
  cloudburstCenter = floor(pixelCount / 2); // Center of the strip
  cloudburstIntensity = max(cloudburstIntensity - cloudburstDecay * delta, 0); // Decay over time
  if (cloudburstIntensity <= 0.01) { // Trigger new burst when the old one fades
    cloudburstIntensity = 1.0;
  }
}

export function render(index) {
  if (selectedProgram == 0) {
    // Program 1: Audio reactive with color cycling
    var brightness = smoothedEnergy;
    hsv(hue, 1, brightness);
  } else if (selectedProgram == 1) {
    // Program 2: Propagating heartbeat effect
    var heartbeatPhase = time(timeFactor) - (index / pixelCount);
    var waveBrightness = (cos(heartbeatPhase * 2 * PI) + 1) / 2;
    var brightness = heartBrightness * waveBrightness;
    hsv(hue, 1, brightness);
  } else if (selectedProgram == 2) {
    // Program 3: Gentle flowing wave
    var wavePhase = time(timeFactor * 2.5) + index / pixelCount; // Slower, flowing wave
    var brightness = 0.3 + 0.7 * sin(wavePhase * 2 * PI);
    hsv(hue, 1, brightness);
  } else if (selectedProgram == 3) {
    // Program 4: Bright pink-white cloudburst effect
    var distanceFromCenter = abs(index - cloudburstCenter);
    var distanceFactor = max(1.0 - (distanceFromCenter * cloudburstSpeed), 0);
    var brightness = cloudburstIntensity * distanceFactor;
    hsv(0.95, 0.2, brightness); // Pink-white hue
  }
}
