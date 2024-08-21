// for input via potentiometer wired into sensor input board
export var frequencyData;
export var analogInputs; 

// Global settings
export var magenta = 0.2; // default is magenta, 0.2
export var globalHue = magenta; 
export var cycleColor = true;
export var _selectedProgram;
var beatInterval = 1.0; // Time in seconds for one heartbeat cycle

// LED ring boundaries 
var innerRingCnt = 16;
var outerRingCnt = 26;
var ring1start = 0;
var ring1End = ring1start + outerRingCnt;
var ring2Start = ring1End + 1;
var ring2End = ring2Start + innerRingCnt;
var ring3Start = ring2End + 1;
var ring3End = ring3Start + outerRingCnt;
var ring4Start = ring3End + 1;
var ring4End = ring4Start + innerRingCnt; 

// Additional global variables for brightness
export var globalInnerBrightness = 0;
export var globalOuterBrightness = 0;
var lowFreqEnergy = 0;
var smoothedEnergy = 0;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect

export function beforeRender(delta) { 
    // Heartbeat phase calculation
    var currentTime = time(0.015);
    var phase = (currentTime % beatInterval) / beatInterval;
    
    // Calculate hue based on phase
    var hue = 0 + (0.66 * phase); 
    if (cycleColor) {
        globalHue = hue;
    }
   
    // Brightness control using potentiometer 1
    var bright_factor = analogInputs[0];
    var gammaCorrectedBrightness = bright_factor * sqrt(bright_factor); 
    globalInnerBrightness = (cos(phase * 2 * PI) + 1) / 2 * gammaCorrectedBrightness; 
    globalOuterBrightness = (sin(phase * 2 * PI) + 1) / 2 * gammaCorrectedBrightness; 
    
    // Audio-reactive calculations for Program 3
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
    // Program selector using potentiometer 2
    _selectedProgram = floor(analogInputs[1] * 4); // Adjusted for 4 programs
    
    if (_selectedProgram == 0) {
        // Program 1: Standard heartbeat effect
        if (ring2Start < index && ring2End >= index || ring4Start < index && index < ring4End) { 
            hsv(globalHue, 1, globalInnerBrightness);
        } else {
            hsv(globalHue, 1, globalOuterBrightness);
        }
    } else if (_selectedProgram == 1) {
        // Program 2: Randomized colors effect
        var randomHue = random(1.0); // Random hue between 0 and 1
        if (ring2Start < index && ring2End >= index || ring4Start < index && index < ring4End) { 
            hsv(randomHue, 1, globalInnerBrightness);
        } else {
            hsv(randomHue, 1, globalOuterBrightness);
        }
    } else if (_selectedProgram == 2) {
        // Program 4: Combined brightness (both rings pulse together)
        var combinedBrightness = (globalInnerBrightness + globalOuterBrightness) / 2;
        hsv(globalHue, 1, combinedBrightness);
    } else { // selectedProgram == 3
        // Program 3: Audio-reactive pulsing effect
        var brightness = smoothedEnergy; // Use the smoothed energy as brightness
        hsv(globalHue, 1, brightness); // Apply to all rings
    }
}

