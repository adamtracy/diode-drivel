// uses low freq inputs to drive the pulse of a run of diodes.  
// TODO - inner and outer concentric cardioid shapes

export var frequencyData
export var energyAverage
export var maxFrequencyMagnitude
export var maxFrequency
export var accelerometer
export var analogInputs
export var light
export var pixelCount

var lowFreqEnergy = 0;
var hue = 0.2;

export function beforeRender(delta) {
    lowFreqEnergy = 0;
    var totalWeight = 0;
    
    // Apply a nonlinear weighting to the frequency bands
    for (var i = 0; i < 4; i++) {
        // Example of a weighting factor that increases towards the lower end of the spectrum
        var weight = 4 - i; // Gives more importance to the lowest band (index 0)
        lowFreqEnergy += frequencyData[i] * weight;
        totalWeight += weight;
    }
    
    // Normalize by the total weight to get the average
    lowFreqEnergy /= totalWeight;

    // Boost the signal
    var gain = 5;
    lowFreqEnergy *= gain;

    // Clamp the value to prevent it from exceeding 1
    lowFreqEnergy = min(1, lowFreqEnergy);
}

export function render(index) {
    var brightness = lowFreqEnergy;
    
    hsv(hue, 1, brightness);
}
