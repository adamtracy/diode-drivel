// Define the number of rings and their origin points
var numRings = 3;
var ringOrigins = [
    [0.25, 0.25],  // Top-left quarter
    [0.75, 0.25],  // Top-right quarter
    [0.5, 0.75]    // Bottom-center
];

// Define other parameters for the rings
var ringThickness = 0.05;  // Thickness of each ring
var hue = 0.5;  // Fixed hue for a monochrome effect
var brightness = 0.4;  // Brightness level for the rings

export function render2D(index, x, y) {
    // Loop over each ring and calculate its effect on the current pixel
    for (var i = 0; i < numRings; i++) {
        // Get the origin of the current ring
        var originX = ringOrigins[i][0];
        var originY = ringOrigins[i][1];

        // Calculate the distance from the ring's origin to the current pixel
        var distanceFromOrigin = sqrt((x - originX) * (x - originX) + (y - originY) * (y - originY));

        // Use time to calculate the expanding radius of the current ring
        var radius = (time(0.02 + i * 0.01) % 1.0);  // Slightly different time factor for each ring

        // If the pixel's distance is within the ring's radius and thickness, light it up
        if (abs(distanceFromOrigin - radius) < ringThickness) {
            hsv(hue, 1, brightness);
            return;  // Stop here to avoid overwriting if multiple rings overlap
        }
    }

    // If no ring effect matches, turn the pixel off
    hsv(0, 0, 0);
}
