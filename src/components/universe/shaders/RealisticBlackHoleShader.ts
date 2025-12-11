import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Volumetric Black Hole Shader
// Uses a Box to bound the volume.
// Rays are cast from the Camera (transformed to local space) towards the Box fragments.

const RealisticBlackHoleMaterial = shaderMaterial(
    {
        time: 0,
        uCameraPos: new THREE.Vector3(), // Local space camera position
        uColor: new THREE.Color("#ff6600"),
    },
    // Vertex Shader
    `
    varying vec3 vPosition;
    void main() {
      // Pass local position which corresponds to the box surface
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float time;
    uniform vec3 uCameraPos; // Camera position in local space
    uniform vec3 uColor;
    varying vec3 vPosition; // Fragment position in local space
    
    #define MAX_STEPS 128
    #define STEP_SIZE 0.15
    #define MAX_DIST 50.0
    
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
    float fbm(vec3 p) {
        float f = 0.0;
        f += 0.5000 * noise(p); p = p * 2.02;
        f += 0.2500 * noise(p); p = p * 2.03;
        f += 0.1250 * noise(p);
        return f;
    }
    
    // Rotation matrix around Y axis
    mat2 rot2D(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    void main() {
        // 1. Setup Ray
        // Camera is at uCameraPos (local space).
        // Ray goes towards vPosition (point on the box).
        
        vec3 ro = uCameraPos;
        vec3 rd = normalize(vPosition - ro);
        
        // --- OPTIMIZATION: Ray Jump ---
        // analytically intersect a Sphere of radius 12.0 and start marching there.
        
        float startDist = 0.0;
        float distToCenter = length(ro);
        float volumeRadius = 12.0;
        
        if (distToCenter > volumeRadius) {
            float b = dot(ro, rd);
            float c = dot(ro, ro) - volumeRadius * volumeRadius;
            float h = b*b - c;
            
            if(h < 0.0) {
                 gl_FragColor = vec4(0.0);
                 return;
            }
            startDist = -b - sqrt(h);
            startDist = max(0.0, startDist); 
        }
        
        // Raymarch Parameters
        vec4 col = vec4(0.0);
        vec3 curPos = ro + rd * startDist; // Jump
        
        // Black Hole Parameters
        float eventHorizonRadius = 1.0;
        float diskInner = 1.6;
        float diskOuter = 6.0;
        float diskHeight = 0.2;
        
        for(int i=0; i<MAX_STEPS; i++) {
            float d = length(curPos);
            
            // --- EVENT HORIZON ---
            if(d < eventHorizonRadius) {
                col.rgb = vec3(0.0);
                col.a = 1.0;
                break;
            }
            
            // --- GRAVITY BENDING ---
            float force = 1.2 / (d * d + 0.1);
            vec3 toCenter = normalize(-curPos);
            rd = normalize(rd + toCenter * force * 0.1); 
            
            // --- ACCRETION DISK ---
            if(abs(curPos.y) < diskHeight) {
                float r = length(curPos.xz);
                if(r > diskInner && r < diskOuter) {
                    
                    vec3 samplePos = curPos;
                    float rotSpeed = time * (3.0 / (r+0.1)); 
                    samplePos.xz *= rot2D(rotSpeed);
                    
                    float dens = fbm(samplePos * 1.5 + vec3(0, time*0.5, 0));
                    
                    float profile = smoothstep(diskOuter, diskOuter-2.0, r) * smoothstep(diskInner, diskInner+0.5, r);
                    float yProfile = 1.0 - smoothstep(0.0, diskHeight, abs(curPos.y));
                    
                    float finalDensity = dens * profile * yProfile;
                    
                    // Doppler
                    vec3 velocity = normalize(vec3(-curPos.z, 0.0, curPos.x)); 
                    float viewDot = dot(rd, velocity);
                    float doppler = 1.0 - viewDot * 0.6;
                    
                    vec3 hotColor = vec3(0.8, 0.9, 1.0);
                    vec3 coldColor = uColor;
                    vec3 localCol = mix(coldColor, hotColor, finalDensity * doppler);
                    
                    float alphaStep = finalDensity * 0.2;
                    col.rgb += localCol * alphaStep * doppler * 2.0 * (1.0 - col.a);
                    col.a += alphaStep;
                }
            }
            
            curPos += rd * STEP_SIZE;
            
            if(col.a >= 0.98) break; 
            if(d > volumeRadius + 1.0) break; 
        }

        // --- BACKGROUND LENSING ---
        if(col.a < 1.0) {
            vec3 starDir = normalize(rd);
            float s = pow(hash(dot(starDir, vec3(12.3, 45.6, 78.9))), 400.0);
            
            float nebula = fbm(starDir * 1.5);
            vec3 bgCol = vec3(0.02, 0.0, 0.05) * nebula;
            bgCol += vec3(s);
            
            col.rgb += bgCol * (1.0 - col.a);
            col.a = 1.0; 
        }
        
        gl_FragColor = col;
        // Tone mapping
        gl_FragColor.rgb = gl_FragColor.rgb / (gl_FragColor.rgb + vec3(1.0));
        gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2));
    }
  `
);

extend({ RealisticBlackHoleMaterial });
