// We wont be able to use a typical pixel mapping approach available in the 'Blaze 
// at the art show.  So this uses pixel index offset and good old render(index){}
// to create a show of pulsing cubes.  

// Number of LEDs per 6x6 module
var moduleSize = 36;

// Total number of modules
var numModules = 16;

// Colors to use for the modules (you can add more colors to this array)
var moduleColors = [
    [0.0, 1, 1],   // Red
    [0.33, 1, 1],  // Green
    [0.66, 1, 1],  // Blue
    [0.1, 1, 1],   // Orange
    [0.5, 1, 1],   // Cyan
    [0.9, 1, 1],   // Pink
    [0.25, 1, 1],  // Yellow
    [0.75, 1, 1]   // Purple
];

// Number of colors in the array
var numColors = moduleColors.length;

// Variable to track the current color shift
var colorShift = 0;

// Variable to track the previous value of the pulse
var previousPulse = 0;

export function beforeRender(delta) {
    // Calculate the pulsing brightness value from the sine wave
    var pulse = 0.3 + 0.2 * sin(time(0.1) * 2 * PI);  // Oscillates between 0.1 and 0.5

    // Check if the pulse is transitioning from its lowest value (nadir)
    if (previousPulse < 0.3 && pulse >= 0.3) {
        // Increment the color shift, cycling through the number of colors
        colorShift = (colorShift + 1) % numColors;
    }

    // Update the previous pulse value for the next frame
    previousPulse = pulse;
}

export function render(index) {
    // Determine which module the current LED belongs to
    var moduleIndex = floor(index / moduleSize);

    // Calculate the color index for the current module, considering the color shift
    var colorIndex = (moduleIndex + colorShift) % numColors;

    // Retrieve the color for this module
    var hue = moduleColors[colorIndex][0];
    var saturation = moduleColors[colorIndex][1];

    // Calculate pulsing brightness from 0.1 to 0.5
    var pulse = 0.3 + 0.2 * sin(time(0.1) * 2 * PI);

    // Set the color for the current LED with the pulsing brightness
    hsv(hue, saturation, pulse);
}
