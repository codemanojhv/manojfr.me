"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

interface UserMarkerProps {
    lat: number;
    lon: number;
    radius: number;
}

export default function UserMarker({ lat, lon, radius }: UserMarkerProps) {
    const markerRef = useRef<THREE.Group>(null);

    const position = useMemo(() => {
        // Convert Lat/Lon to 3D position on sphere
        // Three.js Sphere:
        // UV mapping usually starts with 0 lon at +Z or -Z depending on texture rotation.
        // Earth textures often align such that lon 0 is at Greenwich.
        // We assume standard spherical mapping.

        // Convert to radians
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180); // Offset might be needed depending on texture

        // Spherical to Cartesian
        // x = r * sin(phi) * cos(theta)
        // z = r * sin(phi) * sin(theta)
        // y = r * cos(phi)
        // Note: In Three.js, Y is up. Lat affects Y (Phi). Lon affects X/Z (Theta).

        // Adjusting for standard Earth texture alignment (often needs -rotation on X or Y)
        // We'll try standard logic first:
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
    }, [lat, lon, radius]);

    useFrame((state) => {
        if (markerRef.current) {
            markerRef.current.lookAt(new THREE.Vector3(0, 0, 0)); // Point outward/inward
        }
    });

    return (
        <group position={position} ref={markerRef}>
            {/* Pin / Marker Visual */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#ff0000" />
            </mesh>

            {/* Pulsing Ring */}
            <mesh position={[0, 0, 0]}>
                <ringGeometry args={[0.05, 0.08, 32]} />
                <meshBasicMaterial color="#ff0000" side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>

            {/* Label */}
            <Html distanceFactor={10}>
                <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute" />
                    <div className="mt-4 bg-red-500/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                        YOU ARE HERE
                    </div>
                </div>
            </Html>
        </group>
    );
}
