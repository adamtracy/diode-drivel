// for input via potentiometer wired into sensor input board
export var analogInputs; 
export var frequencyData;

// global hue will be adjusted by where in the cycle we are in the heartbeat. 
// default is magenta, 0.2
export var globalHue = 0.2; 
// 1/0 setting for having the color change or be constant.
export var cycleColor = true;

var lowFreqEnergy = 0;
var smoothedEnergy = 0; // Holds the smoothed energy value
export var hue = globalHue;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect
var threshold = 0.02; // Minimum energy threshold to activate higher brightness
var defaultBrightness = 0.03; // Reduced default low brightness when under threshold
var elapsedTime = 0; // Manually incremented time variable

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

    // Manually increment elapsed time
    elapsedTime += delta;
    if (elapsedTime >= 60000) { // Reset after 60 seconds
        elapsedTime -= 60000;
    }

    // Change hue based on a sine wave over 1 minute
    if (cycleColor) {
        var cycleTime = 600000; // 60 seconds in milliseconds
        var timeFraction = elapsedTime / cycleTime;
        hue = 0.5 + 0.5 * sin(timeFraction * 2 * PI);
    }
}

export function render(index) {
    var brightness = smoothedEnergy;
    hsv(hue, 1, brightness);
}

