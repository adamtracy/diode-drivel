// for input via potentiometer wired into sensor input board
export var frequencyData;
export var analogInputs; 

// Global settings
var beatInterval; // Time in seconds for one heartbeat cycle

// LED ring boundaries 
var outerRingCnt = 40;

// Additional global variables for brightness
export var globalOuterBrightness = 0;
var lowFreqEnergy = 0;
var smoothedEnergy = 0;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect

export function beforeRender(delta) { 
    // Set pulse rate based on potentiometer input (analogInputs[1])
    var bpm = 60 + (analogInputs[1] * 60); // Map input to 60-120 bpm
    beatInterval = 60 / bpm; // Convert bpm to seconds per beat

    // Heartbeat phase calculation
    var currentTime = time(0.015);
    var phase = (currentTime % beatInterval) / beatInterval;
   
    // Brightness control using potentiometer 1
    var bright_factor = analogInputs[0];
    var gammaCorrectedBrightness = bright_factor * sqrt(bright_factor); 
    globalOuterBrightness = (sin(phase * 2 * PI) + 1) / 2 * gammaCorrectedBrightness; 
    
    // Audio-reactive calculations for brightness smoothing
    lowFreqEnergy = 0;
    var totalWeight = 0;
    for (var i = 0; i < 4; i++) { // Focusing on the lower frequencies
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

    // Apply exponential smoothing to the energy
    smoothedEnergy = (smoothingFactor * lowFreqEnergy) + ((1 - smoothingFactor) * smoothedEnergy);
}

export function render(index) {
    // Constant purple color with combined brightness
    var combinedBrightness = globalOuterBrightness; // Single ring, so use outer brightness
    hsv(0.8, 1, combinedBrightness); // Purple color with hue = 0.8
}

