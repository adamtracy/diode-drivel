// dual chest/back cardioid nest illumination

var beatInterval = 1.0; // Time in seconds for one heartbeat cycle

var innerRingCnt = 16;
var outerRingCnt = 26;

// outer ring boundaries 
ring1start = 0;
ring1End = ring1start + outerRingCnt;
// inner ring boundaries
ring2Start = ring1End + 1;
ring2End = ring2Start + innerRingCnt;

ring3Start = ring2End + 1;
ring3End =  ring3Start + outerRingCnt;
ring4Start = ring3End + 1;
ring4End = ring4Start + innerRingCnt; 

var magenta = 0.2;

export function beforeRender(delta) { 
    // Current time in the beat cycle
    var currentTime = time(0.0075) // 0.015 is about 60bpm // .0075 is like 120bpm rhythm.
    // Normalize time to a 0-1 range for a complete cycle
    var phase = (currentTime % beatInterval) / beatInterval;
    
    // Calculate the brightness for each ring using sin and cos to create the phase offset
    globalInnerBrightness = (cos(phase * 2 * PI) + 1) / 2; // Cosine for inner ring
    globalOuterBrightness = (sin(phase * 2 * PI) + 1) / 2; // Sine for outer ring
}

export function render(index) {
    if (ring2Start < index && ring2End >= index || ring4Start < index && index < ring4End) { 
        // Inner ring
        hsv(magenta, 1, globalInnerBrightness);
    } else {
        // Outer ring
        hsv(magenta, 1, globalOuterBrightness);
    }
}
