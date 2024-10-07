// Define the number of rings and their origin points
var numRings = 2;
var ringOrigins = [
    [0.25, 0.25],  // Top-left quarter
    [0.75, 0.25],  // Top-right quarter
    [0.5, 0.75]    // Bottom-center
];

// Define other parameters for the rings
var ringThickness = 0.02;  // Thickness of each ring
var hue = 0.8;  // Fixed hue for a monochrome effect
var brightness = 0.4;  // Brightness level for the rings

// Initialize the radii array with zeros for each ring
var radii = [0, 0, 0];

export function beforeRender(delta) {
    for (var i = 0; i < numRings; i++) {
        // Calculate the expanding radius for each ring with a slower update frequency
        radii[i] = (time(0.2 + i * 0.0005) % 1.0);  // Much slower update rate for reduced load
    }
}

export function render2D(index, x, y) {
    // Loop over each ring and calculate its effect on the current pixel
    for (var i = 0; i < numRings; i++) {
        // Get the origin of the current ring
        var originX = ringOrigins[i][0];
        var originY = ringOrigins[i][1];

        // Calculate the distance from the ring's origin to the current pixel
        var distanceFromOrigin = sqrt((x - originX) * (x - originX) + (y - originY) * (y - originY));

        // Get the precomputed radius for the current ring
        var radius = radii[i];

        // If the pixel's distance is within the ring's radius and thickness, light it up
        if (abs(distanceFromOrigin - radius) < ringThickness) {
            hsv(hue, 1, brightness);
            return;  // Stop here to avoid overwriting if multiple rings overlap
        }
    }

    // If no ring effect matches, turn the pixel off
    hsv(0, 0, 0);
}
