// Define parameters for the sine wave
var waveFrequency = 1;  // Number of sine wave cycles across the width
var waveAmplitude = 0.3;  // Amplitude of the wave (0.0 to 1.0)
var movementSpeed = 0.02;  // Speed of the wave movement
var hue = 0.7;  // Set a fixed hue for the wave (e.g., green-cyan)
var brightness = 0.2;  // Fixed brightness level

export function render2D(index, x, y) {
    // Calculate the wave phase using time to create slow motion movement
    var wavePhase = time(movementSpeed);

    // Calculate the target y-value for the sine wave, adding the phase to move it over time
    var waveY = 0.5 + waveAmplitude * sin(waveFrequency * x * 2 * PI + wavePhase);

    // Check if the current pixel is close to the sine wave path
    var tolerance = 0.05;  // Determines how thick the sine wave is

    if (abs(y - waveY) < tolerance) {
        // If the pixel is close to the wave, light it up
        hsv(hue, 1, brightness);
    } else {
        // Otherwise, turn the pixel off
        hsv(0, 0, 0);
    }
}
