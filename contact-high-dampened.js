export var frequencyData;
var lowFreqEnergy = 0;
var smoothedEnergy = 0; // Holds the smoothed energy value
var hue = 0.2;
var smoothingFactor = 0.1; // Adjust to control the smoothing effect
var threshold = 0.05; // Minimum energy threshold to activate higher brightness
var defaultBrightness = 0.02; // Reduced default low brightness when under threshold

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
}

export function render(index) {
    var brightness = smoothedEnergy;
    hsv(hue, 1, brightness);
}
