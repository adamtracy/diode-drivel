var beatInterval = 1.0; // Time in seconds for one heartbeat cycle
var ring1Count = 63;
var magenta = 0.2;

export function beforeRender(delta) {
    // Current time in the beat cycle
    var currentTime = time(0.015) // 0.015 is about 1s
    // Normalize time to a 0-1 range for a complete cycle
    var phase = (currentTime % beatInterval) / beatInterval;
    
    // Calculate the brightness for each ring using sin and cos to create the phase offset
    globalInnerBrightness = (cos(phase * 2 * PI) + 1) / 2; // Cosine for inner ring
    globalOuterBrightness = (sin(phase * 2 * PI) + 1) / 2; // Sine for outer ring
}

export function render(index) {
    if (index < ring1Count) {
        // Inner ring
        hsv(magenta, 1, globalInnerBrightness);
    } else {
        // Outer ring
        hsv(magenta, 1, globalOuterBrightness);
    }
}
