"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";
import Planet from "./Planet";

interface StarSystemProps {
    position: [number, number, number];
    name: string;
    starColor: string;
    starSize?: number;
    planets: any[];
    onSelect: (data: any) => void;
}

export default function StarSystem({ position, name, starColor, starSize = 2.5, planets, onSelect }: StarSystemProps) {
    return (
        <group position={position}>
            {/* Star - Using simple geometry but with high-intensity emission for glow */}
            {/* For true volumetric starts we'd need shaders, but high intensity point light + bloom is standard "game" star look */}
            <mesh
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect({
                        name: name,
                        description: `The central star of the ${name} System.`,
                        type: "Star",
                        distance: "0 AU",
                        mass: "1 Solar Mass",
                        age: "Unknown",
                        position: position
                    });
                }}
            >
                <sphereGeometry args={[starSize, 64, 64]} />
                <meshBasicMaterial color={starColor} />
                {/* Real intense light source */}
                <pointLight intensity={3} distance={300} decay={1} color={starColor} />

                {/* Star Corona / Atmosphere Glow - Multiple layers for volumetric feel */}
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[starSize, 32, 32]} />
                    <meshBasicMaterial color={starColor} transparent opacity={0.4} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
                </mesh>
                <mesh scale={[1.5, 1.5, 1.5]}>
                    <sphereGeometry args={[starSize, 32, 32]} />
                    <meshBasicMaterial color={starColor} transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
                </mesh>
                {/* Wide lens flare region */}
                <mesh scale={[4, 4, 4]}>
                    <sphereGeometry args={[starSize, 16, 16]} />
                    <meshBasicMaterial color={starColor} transparent opacity={0.05} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
                </mesh>
            </mesh>

            {/* Planets */}
            {planets.map((planet, index) => (
                <Planet
                    key={index}
                    {...planet}
                    onSelect={(data) => {
                        // Patch the position to be World Position for the HUD teleport
                        const absX = position[0] + data.position[0];
                        const absY = position[1] + data.position[1];
                        const absZ = position[2] + data.position[2];

                        onSelect({
                            ...data,
                            position: [absX, absY, absZ]
                        });
                    }}
                />
            ))}
        </group>
    );
}
