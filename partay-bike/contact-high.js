// 2 different programs selected based on the what the potentiometer
// input is set to.
//
//
// for input via potentiometer wired into sensor input board
export var analogInputs; 
export var frequencyData;

// global hue will be adjusted by where in the cycle we are in the heartbeat. 
// default is magenta, 0.2
export var globalHue = 0.2; 
// 1/0 setting for having the color change or be constant.
export var cycleColor = true;

var lowFreqEnergy = 0;
export var smoothedEnergy = 0; // Holds the smoothed energy value
export var hue = globalHue;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect
var threshold = 0.02; // Minimum energy threshold to activate higher brightness
var defaultBrightness = 0.03; // Reduced default low brightness when under threshold
var elapsedTime = 0; // Manually incremented time variable

// heart stuff
var beatInterval = 1.0; // Time in seconds for one heartbeat cycle
var timeFactor = 0.015;  // 0.015 is about 60bpm // .0075 is like 120bpm rhythm.
export var heartBrightness = 0.1;


var selectedProgram = 0; // Variable to store the selected program

export function beforeRender(delta) {
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

    // Manually increment elapsed time
    elapsedTime += delta;
    if (elapsedTime >= 60000) { // Reset after 60 seconds
        elapsedTime -= 60000;
    }

    // Change hue based on a sine wave over 1 minute
    if (cycleColor) {
        var cycleTime = 240000; // 60 seconds in milliseconds
        var timeFraction = elapsedTime / cycleTime;
        hue = 0.5 + 0.5 * sin(timeFraction * 2 * PI);
    }
    
   
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
        hsv(0.2, 1, heartBrightness);
    }
}
