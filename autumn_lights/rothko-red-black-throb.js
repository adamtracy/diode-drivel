// Define Rothko colors
var redHue = 0.0;  // Hue for red (0 corresponds to red in HSV)
var brightnessRed = 0.3;  // Brightness for red area
var minBrightness = 0.2;  // Minimum brightness for the transition area to prevent full darkness
var blackHue = 0.0;  // Hue for black (doesn't matter since value is zero)
var brightnessBlack = 0.0;  // Brightness for black area

// Define parameters for the throbbing transition
var blackBandHeight = 0.1;  // Height of the black band (10% of the total height)
var transitionThickness = 0.24;  // Thickness of the transition band (14% of the height)
var pulseSpeed = 0.5;  // Speed of the throbbing effect

// Define parameters for left and right throbbing margins
var marginWidth = 0.07;  // Width of the left and right margins (7% of the total width)

export function render2D(index, x, y) {
    // Define the boundaries for the black band and the transition area
    var blackStart = 1.0 - blackBandHeight;  // Black band starts at 90% of the height
    var transitionStart = blackStart - transitionThickness;  // Transition starts just above the black band

    // Determine which region the current pixel belongs to for the main area
    var finalBrightness;

    if (y < transitionStart) {
        // Upper red area
        finalBrightness = brightnessRed;
    } else if (y >= blackStart) {
        // Lower black area
        finalBrightness = brightnessBlack;
    } else {
        // Transition area - apply throbbing effect with a minimum brightness
        var pulse = 0.5 + 0.5 * sin(time(pulseSpeed) * 2 * PI);  // Throbbing effect from 0 to 1
        var blendFactor = (y - transitionStart) / transitionThickness;  // Linear blend factor from 0 to 1

        // Mix between the red brightness and a minimum brightness to avoid complete black
        finalBrightness = mix(brightnessRed, minBrightness, blendFactor) * pulse;
    }

    // Apply the brightness for the main area
    hsv(redHue, 1, finalBrightness);

    // Add throbbing effect for left and right margins, keeping them consistent with the main black band behavior
    if (x < marginWidth || x > 1.0 - marginWidth) {
        if (y < transitionStart) {
            // Upper red area for margins
            hsv(redHue, 1, brightnessRed);
        } else if (y >= blackStart) {
            // Lower black area for margins
            hsv(blackHue, 1, brightnessBlack);
        } else {
            // Transition area for margins - apply throbbing effect similar to the main area
            var pulseMargin = 0.5 + 0.5 * sin(time(pulseSpeed) * 2 * PI);
            var marginBlendFactor = (y - transitionStart) / transitionThickness;  // Linear blend factor from 0 to 1

            // Nonlinear transition from red to a minimum brightness using cubic ease-in
            var nonlinearBlendFactor = pow(marginBlendFactor, 3);
            var marginBrightness = mix(brightnessRed, minBrightness, nonlinearBlendFactor) * pulseMargin;

            hsv(redHue, 1, marginBrightness);
        }
    }
}
