"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "./shaders/RealisticBlackHoleShader"; // Import the shader

export default function BlackHole({ onSelect }: { onSelect: (data: any) => void }) {
  const meshRef = useRef<any>();
  const materialRef = useRef<any>();
  const { size, camera } = useThree();

  // Helper vector to avoid GC
  const localCameraPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (materialRef.current && meshRef.current) {
      materialRef.current.time += delta;

      // Transform World Camera Position -> Mesh Local Position
      // This ensures the raymarching (which happens in local space 0..10) matches the view
      localCameraPos.copy(camera.position);
      meshRef.current.worldToLocal(localCameraPos);

      materialRef.current.uCameraPos.copy(localCameraPos);
    }
  });

  return (
    <group
      position={[-20, 5, -10]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect({
          name: "Gargantua",
          description: "A supermassive rotating black hole. The event horizon marks the point of no return. Time flows significantly slower near its enormous gravitational well.",
          type: "Supermassive Black Hole",
          distance: "55M ly",
          mass: "100M Solar Masses",
          age: "Unknown",
          position: [-20, 5, -10]
        });
      }}
    >
      {/* 
         Volumetric Box
         We use a large box to define the "volume" of space where the Black Hole exists.
         The shader raymarches INSIDE this local coordinate system.
         Local Coords: -10 to +10 (since args are 20).
      */}
      <mesh ref={meshRef}>
        <boxGeometry args={[20, 20, 20]} />
        {/* @ts-ignore */}
        <realisticBlackHoleMaterial
          ref={materialRef}
          transparent
          side={THREE.BackSide} // Render on inside faces so we can fly *into* it
          blending={THREE.NormalBlending}
          depthWrite={false}
          uColor={new THREE.Color("#ffaa55")}
        />
      </mesh>
    </group>
  );
}
