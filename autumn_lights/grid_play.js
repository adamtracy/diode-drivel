// export var watch = 0;
// export function render2D(index, x, y) {
//   hsv(x, 1, y);
// }

// export function render2D(index, x, y) {
//     var wave = sin(time(0.5) + x * PI2);  // Time-based wave moving along x
//     hsv(0.9, 1, wave * y);  // Purple hue, brightness varies with the wave and y
// }

// export function render2D(index, x, y) {
//     var distance = sqrt((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5));
//     hsv(distance, 1, 1 - distance); // Hue and brightness change based on distance from the center
// }

// export function render2D(index, x, y) {
//     // Calculate the distance from the center of the grid (0.5, 0.5)
//     var distanceFromCenter = sqrt((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5));
    
//     // Use the distance to create a concentric circle effect
//     // Modulate the hue based on distance to create rings
//     var hue = distanceFromCenter * 6.0;  // Scale the distance to control hue
    
//     // Use a sine wave to create alternating bright/dim circles
//     var brightness = abs(sin(distanceFromCenter * 10.0 - time(0.5)));  // Sine wave rings

//     // Apply the HSV values to render the concentric circles
//     hsv(hue, 1, brightness);
// }


// export function render2D(index, x, y) {
//     var distanceFromCenter = sqrt((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5));
//     var radius = time(0.2) % 1.0;  // Expanding radius
//     var hue = 0.6;  // Cyan color

//     // Fade brightness as pixels approach the radius
//     if (distanceFromCenter < radius) {
//         var brightness = 1.0 - (distanceFromCenter / radius);  // Fading brightness
//         hsv(hue, 1, brightness);
//     } else {
//         hsv(0, 0, 0);  // Turn off pixels outside the radius
//     }
// }


export function render2D(index, x, y) {
    // Calculate distance from the center of the grid (0.5, 0.5)
    var distanceFromCenter = sqrt((x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5));

    // Use time to calculate the expanding ring's radius
    var radius = time(0.02) % 1.0;  // Expands over time (cycle every 5 seconds)

    // Define the thickness of the ring (how wide the ring is)
    var ringThickness = 0.05;  // The ring will have a small thickness

    // Set a solid color for the ring (monochromatic)
    var hue = 0.8;  // Cyan color (or set any fixed hue for monochrome)
    var brightness = 0.4;  // Full brightness inside the ring

    // If the pixel's distance is within the ring's radius and thickness, light it up
    if (abs(distanceFromCenter - radius) < ringThickness) {
        hsv(hue, 1, brightness);  // Inside the expanding ring
    } else {
        hsv(0, 0, 0);  // Outside the ring (turned off)
    }
}
