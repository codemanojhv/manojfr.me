import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Cinematic Black Hole Shader
// Optimized for dedicated view: Higher step count, more noise details.

const CinematicBlackHoleMaterial = shaderMaterial(
    {
        time: 0,
        uCameraPos: new THREE.Vector3(),
        uColor: new THREE.Color("#ff6600"),
        uDensity: 1.0, // Multiplier for disk density
        uSpin: 1.0, // Multiplier for rotation speed
    },
    // Vertex Shader
    `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float time;
    uniform vec3 uCameraPos;
    uniform vec3 uColor;
    uniform float uDensity;
    uniform float uSpin;
    varying vec3 vPosition;
    
    // ULTRA QUALITY SETTINGS
    #define MAX_STEPS 300       // 2.5x standard
    #define STEP_SIZE 0.08      // Finer steps
    #define MAX_DIST 60.0
    
    // Noise functions
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(in vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 57.0 + 113.0 * p.z;
        return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                       mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                   mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                       mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    }
    
    // Octave FBM for more detail
    float fbm(vec3 p) {
        float f = 0.0;
        float amp = 0.5;
        // 4 Octaves
        for(int i=0; i<4; i++) {
            f += amp * noise(p);
            p = p * 2.02;
            amp *= 0.5;
        }
        return f;
    }
    
    mat2 rot2D(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    void main() {
        vec3 ro = uCameraPos;
        vec3 rd = normalize(vPosition - ro);
        
        // Ray Jump Optimization
        float startDist = 0.0;
        float distToCenter = length(ro);
        float volumeRadius = 14.0; 
        
        if (distToCenter > volumeRadius) {
            float b = dot(ro, rd);
            float c = dot(ro, ro) - volumeRadius * volumeRadius;
            float h = b*b - c;
            if(h < 0.0) { discard; }
            startDist = -b - sqrt(h);
            startDist = max(0.0, startDist); 
        }
        
        vec4 col = vec4(0.0);
        vec3 curPos = ro + rd * startDist;
        
        float eventHorizonRadius = 1.0;
        float diskInner = 1.4;
        float diskOuter = 6.5; // Larger disk
        float diskHeight = 0.3;
        
        for(int i=0; i<MAX_STEPS; i++) {
            float d = length(curPos);
            
            // Event Horizon
            if(d < eventHorizonRadius) {
                col.rgb = vec3(0.0);
                col.a = 1.0;
                break;
            }
            
            // Gravity bending (Stronger for visual drama)
            float force = 1.5 / (d * d + 0.05);
            vec3 toCenter = normalize(-curPos);
            rd = normalize(rd + toCenter * force * (STEP_SIZE * 0.8));
            
            // Accretion Disk
            if(abs(curPos.y) < diskHeight) {
                float r = length(curPos.xz);
                if(r > diskInner && r < diskOuter) {
                    vec3 samplePos = curPos;
                    // Spin
                    float rotSpeed = time * uSpin * (3.5 / (r+0.1)); 
                    samplePos.xz *= rot2D(rotSpeed);
                    
                    // Detail Noise
                    float dens = fbm(samplePos * 2.0 + vec3(0, time * uSpin * 0.5, 0));
                    
                    float radialFade = smoothstep(diskOuter, diskOuter-2.0, r) * smoothstep(diskInner, diskInner+0.3, r);
                    float verticalFade = 1.0 - smoothstep(0.0, diskHeight, abs(curPos.y));
                    
                    float finalDensity = dens * radialFade * verticalFade * uDensity;
                    
                    // Doppler
                    vec3 velocity = normalize(vec3(-curPos.z, 0.0, curPos.x)); 
                    float viewDot = dot(rd, velocity);
                    float doppler = 1.0 - viewDot * 0.7; // Strong doppler
                    
                    vec3 hotColor = vec3(0.9, 0.95, 1.0);
                    vec3 userCol = uColor;
                    vec3 localCol = mix(userCol, hotColor, finalDensity * doppler * doppler);
                    
                    float alphaStep = finalDensity * 0.15;
                    // Additive empyreal glow
                    col.rgb += localCol * alphaStep * doppler * 2.5 * (1.0 - col.a * 0.8);
                    col.a += alphaStep;
                }
            }
            
            curPos += rd * STEP_SIZE;
            
            if(col.a >= 0.99) break; 
            if(d > volumeRadius + 2.0) break; 
        }

        // Star Lensing
        if(col.a < 1.0) {
            vec3 starDir = normalize(rd);
            float s = pow(hash(dot(starDir, vec3(12.3, 45.6, 78.9))), 500.0);
            
            // High quality nebula background
            float neb = fbm(starDir * 1.5);
            vec3 bgCol = vec3(0.01, 0.01, 0.03) * neb; // Dark blue space
            bgCol += vec3(s);
            
            col.rgb += bgCol * (1.0 - col.a);
            col.a = 1.0; 
        }
        
        gl_FragColor = col;
        // ACES Tone mapping for cinematic look
        gl_FragColor.rgb = (gl_FragColor.rgb * (2.51 * gl_FragColor.rgb + 0.03)) / (gl_FragColor.rgb * (2.43 * gl_FragColor.rgb + 0.59) + 0.14);
    }
  `
);

extend({ CinematicBlackHoleMaterial });
