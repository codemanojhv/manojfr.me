"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture, Trail } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
    name: string;
    size: number;
    distance: number;
    speed: number;
    color: string;
    textureUrl?: string; // Optional texture
    description: string;
    data: any; // Extra data for HUD
    children?: React.ReactNode; // For Moons
    onSelect: (data: any) => void;
}

export default function Planet({
    name, size, distance, speed, color, textureUrl, description, data, children, onSelect
}: PlanetProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Random start angle
    const offset = useRef(Math.random() * Math.PI * 2);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + offset.current;

        if (groupRef.current) {
            // Orbit logic
            groupRef.current.position.x = Math.cos(t) * distance;
            groupRef.current.position.z = Math.sin(t) * distance;
        }

        if (meshRef.current) {
            // Self-rotation
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <>
            <group ref={groupRef}>
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect({
                            name,
                            description,
                            type: "Planet",
                            distance: `${distance} AU`, // Simplified
                            ...data,
                            position: [groupRef.current?.position.x, groupRef.current?.position.y, groupRef.current?.position.z]
                        });
                    }}
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                    onPointerOut={() => setHovered(false)}
                >
                    <sphereGeometry args={[size, 64, 64]} />
                    {/* Fallback to color, but ready for texture mapping if we add it later */}
                    <meshStandardMaterial
                        color={color}
                        roughness={0.7}
                        metalness={0.2}
                    />

                    {hovered && (
                        <Html distanceFactor={15}>
                            <div className="bg-black/80 text-cyan-300 p-2 rounded border border-cyan-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md whitespace-nowrap">
                                {name}
                            </div>
                        </Html>
                    )}
                </mesh>

                {/* Render Moons/Children relative to this planet */}
                {children}
            </group>
        </>
    );
}
