import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

export const BlackHoleMaterial = shaderMaterial(
    {
        time: 0,
        resolution: new THREE.Vector2(),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vPos;
    void main() {
      vUv = uv;
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    varying vec3 vPos;

    void main() {
      // Normalize coordinates
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec2 p = -1.0 + 2.0 * uv;
      
      // Aspect ratio correction
      p.x *= resolution.x / resolution.y;

      // Distance from center (we assume black hole is roughly screen centered for the effect, 
      // or we map it relative to the object position passed as uniform - simplified here)
      // For a true 3D effect in a scene, we'd need to raymarch, but for a "billboard" effect on the hole itself:
      
      float r = length(p);
      float a = atan(p.y, p.x);
      
      // Gravitational lensing distortion
      // Light bends around the hole: pure black in middle, distorted ring around
      
      float diskRadius = 0.3; // Event horizon roughly
      float distortion = 0.05 / (r - diskRadius); // Distortion strength
      
      // Simple visual representation of blending
      // In a real raymarching shader we would sample background texture with offset
      
      // Placeholder: Procedural accretion disk glow
      float glow = 0.0;
      if (r > diskRadius) {
         glow = 1.0 / (r * 10.0);
         glow *= abs(sin(a * 10.0 - time * 2.0)); // Rotating beams
      }
      
      vec3 color = vec3(0.0);
      
      // Event Horizon
      if (r < diskRadius) {
          color = vec3(0.0); // Pure black
      } else {
          // Accretion disk
          vec3 diskColor = vec3(1.0, 0.6, 0.2);
          color = diskColor * glow * 2.0;
      }

      gl_FragColor = vec4(color, 1.0);
      
      // Transparency for outer glow
      if (r > diskRadius && glow < 0.05) discard;
    }
  `
);

extend({ BlackHoleMaterial });
