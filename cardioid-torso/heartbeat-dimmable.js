// using a BOJACK potentiometer P/N: B10K, RSTC: 10KOhm, Power: 500mW wired into the 5th pole
// of the analog input array (along with grnd + 3.3v out).  At first, the linear processing yielded
// a very small range of motion in the dial had too much effect.  GPT noted: "Human perception of brightness 
// is logarithmic, meaning equal increments in light intensity are not perceived as equal increments in 
// brightness. You might want to apply a gamma correction to bright_factor to linearize the perception 
// of brightness changes.

// for audio input embedded in the sensor input board
export var frequencyData;
// for input via potentiometer wired into sensor input board
export var analogInputs; 
// global hue will be adjusted by where in the cycle we are in the heartbeat. 
// default is magenta, 0.2
export var magenta = 0.2;
export var globalHue = magenta; 
// 1/0 setting for having the color change or be constant.
export var cycleColor = true;


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

export function beforeRender(delta) { 
    // Current time in the beat cycle
    var currentTime = time(0.015) // 0.015 is about 60bpm // .0075 is like 120bpm rhythm.
    // Normalize time to a 0-1 range for a complete cycle
    var phase = (currentTime % beatInterval) / beatInterval;
    
    // Calculate hue transition from red (0) to blue (0.66) based on the phase
    var hue = 0 + (0.66 * phase); // Transition from 0 (red) to 0.66 (blue) over the cycle
    if (cycleColor) {
    // Assign the dynamically calculated hue to a global variable to be used in render()
      globalHue = hue;
    }
    var bright_factor = analogInputs[0];
   
    // GPT originally suggested Math.pow(bright_factor, gamma);, but htat function is not available on pixel 
    // Approximating a power function using multiples and square roots. Approximation for cube root
    var gammaCorrectedBrightness = bright_factor * sqrt(bright_factor); 
    
    // Calculate the brightness for each ring using sin and cos to create the phase offset
    globalInnerBrightness = (cos(phase * 2 * PI) + 1) / 2 * gammaCorrectedBrightness; // Cosine for inner ring
    globalOuterBrightness = (sin(phase * 2 * PI) + 1) / 2 * gammaCorrectedBrightness; // Sine for outer ring
}

export function render(index) {
    if (ring2Start < index && ring2End >= index || ring4Start < index && index < ring4End) { 
        // Inner ring
        hsv(globalHue, 1, globalInnerBrightness);
    } else {
        // Outer ring
        hsv(globalHue, 1, globalOuterBrightness);
    }
}
