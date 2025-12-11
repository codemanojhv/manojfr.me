"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Planet from "./Planet";

function ISS({ parentRadius }: { parentRadius: number }) {
    const ref = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            const t = clock.getElapsedTime() * 2; // Fast orbit
            ref.current.position.x = Math.cos(t) * (parentRadius + 0.5);
            ref.current.position.z = Math.sin(t) * (parentRadius + 0.5);
            ref.current.rotation.y += 0.02;
        }
    });

    return (
        <group ref={ref}>
            <mesh>
                <boxGeometry args={[0.2, 0.1, 0.1]} />
                <meshStandardMaterial color="white" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0.2, 0, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.01]} />
                <meshStandardMaterial color="#3366ff" roughness={0.2} metalness={0.5} />
            </mesh>
            <mesh position={[-0.2, 0, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.01]} />
                <meshStandardMaterial color="#3366ff" roughness={0.2} metalness={0.5} />
            </mesh>
        </group>
    )
}

export default function SolarSystem({ onSelect }: { onSelect: (data: any) => void }) {
    return (
        <group position={[0, -5, 10]}>
            {/* Sun */}
            <mesh
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect({
                        name: "Sun",
                        description: "The star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.",
                        type: "Yellow Dwarf Star",
                        distance: "0 AU",
                        mass: "1 Solar Mass",
                        age: "4.6 Billion Years",
                        position: [0, -5, 10]
                    });
                }}
            >
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshBasicMaterial color="#ffdd00" />
                <pointLight intensity={2.5} distance={100} decay={2} color="#ffdd00" />
                {/* Sun Glow */}
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[2.5, 32, 32]} />
                    <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} side={THREE.BackSide} />
                </mesh>
            </mesh>

            {/* Mercury */}
            <Planet
                name="Mercury"
                size={0.4}
                distance={5}
                speed={1.2}
                color="#A5A5A5"
                description="The smallest planet in the Solar System and the closest to the Sun."
                data={{ mass: "0.055 Earths", type: "Terrestrial" }}
                onSelect={onSelect}
            />

            {/* Venus */}
            <Planet
                name="Venus"
                size={0.7}
                distance={8}
                speed={0.9}
                color="#E3BB76"
                description="The second planet from the Sun. It has a dense atmosphere containing carbon dioxide."
                data={{ mass: "0.815 Earths", type: "Terrestrial" }}
                onSelect={onSelect}
            />

            {/* Earth */}
            <Planet
                name="Earth"
                size={0.8}
                distance={12}
                speed={0.6}
                color="#2255ff"
                description="Our home. The only known planet in the universe to harbor life."
                data={{ mass: "1 Earth", type: "Terrestrial" }}
                onSelect={onSelect}
            >
                {/* Moon */}
                <Planet
                    name="Moon"
                    size={0.27}
                    distance={2}
                    speed={2}
                    color="#dddddd"
                    description="Earth's only natural satellite."
                    data={{ mass: "0.012 Earths", type: "Moon" }}
                    onSelect={onSelect}
                />
                {/* ISS */}
                <ISS parentRadius={0.8} />
            </Planet>

            {/* Mars */}
            <Planet
                name="Mars"
                size={0.5}
                distance={16}
                speed={0.5}
                color="#ff4422"
                description="The Red Planet. Dusty, cold, desert world with a very thin atmosphere."
                data={{ mass: "0.107 Earths", type: "Terrestrial" }}
                onSelect={onSelect}
            />

            {/* Jupiter */}
            <Planet
                name="Jupiter"
                size={1.8}
                distance={24}
                speed={0.2}
                color="#D9A873"
                description="The largest planet in the Solar System. A gas giant with a mass one-thousandth that of the Sun."
                data={{ mass: "317.8 Earths", type: "Gas Giant" }}
                onSelect={onSelect}
            >
                <Planet
                    name="Europa"
                    size={0.2}
                    distance={3}
                    speed={1.5}
                    color="#dcdcdc"
                    description="One of Jupiter's Galilean moons. It has a smooth ice crust."
                    data={{ mass: "0.008 Earths", type: "Moon" }}
                    onSelect={onSelect}
                />
            </Planet>

            {/* Saturn */}
            <Planet
                name="Saturn"
                size={1.5}
                distance={32}
                speed={0.15}
                color="#F4D03F"
                description="The sixth planet from the Sun and the second-largest, famous for its ring system."
                data={{ mass: "95.2 Earths", type: "Gas Giant" }}
                onSelect={onSelect}
            >
                {/* Saturn Rings Visual */}
                <mesh rotation={[Math.PI / 3, 0, 0]}>
                    <ringGeometry args={[2, 3.5, 64]} />
                    <meshBasicMaterial color="#CDB684" side={THREE.DoubleSide} transparent opacity={0.6} />
                </mesh>
                <Planet
                    name="Titan"
                    size={0.3}
                    distance={4}
                    speed={1}
                    color="#e3bb76"
                    description="Saturn's largest moon."
                    data={{ mass: "0.0225 Earths", type: "Moon" }}
                    onSelect={onSelect}
                />
            </Planet>

        </group>
    );
}
