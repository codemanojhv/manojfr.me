"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";
import * as maath from "maath";

export default function DeepSpace() {
    const ref = useRef<any>();

    // Generate 5000 "galaxies" (points) far away
    const { positions, colors } = useMemo(() => {
        // Generate points in a sphere shell between radius 400 and 800
        const pos = maath.random.inSphere(new Float32Array(5000 * 3), { radius: 800 }) as Float32Array;
        const col = new Float32Array(5000 * 3);
        const colorChoices = [
            new THREE.Color("#ffaa88"), // Red/Orange
            new THREE.Color("#88ccff"), // Blue
            new THREE.Color("#ffffff"), // White
            new THREE.Color("#ffddee"), // Pinkish
        ];

        for (let i = 0; i < pos.length; i += 3) {
            // Distance check
            const x = pos[i];
            const y = pos[i + 1];
            const z = pos[i + 2];
            const dist = Math.sqrt(x * x + y * y + z * z);
            if (dist < 300) {
                pos[i] *= 2; // Push them out
            }

            // Color assignment
            const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            col[i] = randomColor.r;
            col[i + 1] = randomColor.g;
            col[i + 2] = randomColor.b;
        }
        return { positions: pos, colors: col };
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta / 200; // Very slow rotation
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={5} // Larger points to look like distant nebulae/galaxies
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}
