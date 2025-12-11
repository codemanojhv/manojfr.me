"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useState, useRef, useMemo } from "react";
import * as THREE from "three";
import StarField from "./StarField";
import Galaxy from "./Galaxy";
import BlackHole from "./BlackHole";
import StarSystem from "./StarSystem";
import DeepSpace from "./DeepSpace";
import HUD from "./HUD";
import UserMarker from "./UserMarker";

export default function UniverseScene() {
    const [activeObject, setActiveObject] = useState<any>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const cameraControlsRef = useRef<CameraControls>(null);

    const handleTeleport = (position: [number, number, number]) => {
        if (cameraControlsRef.current) {
            const [x, y, z] = position;
            cameraControlsRef.current.setLookAt(
                x, y, z + 8, // Camera position
                x, y, z,     // Target position
                true         // Animate
            );
        }
    };

    const handleLocateMe = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });

                // Teleport logic for "Locate Me"
                // Earth is at [0, -5, 10] in the Solar System component, and Solar System is at [0, -5, 10] in Scene?
                // Wait, in previous step I put Solar System at [0, -5, 10].
                // Inside Solar System, Earth is at distance 12.
                // This nesting makes world coordinate calc tricky without a scene graph lookup.
                // IMPROVEMENT: For now, I know the math:
                // SolarSystem Pos: [0, -5, 10]
                // Earth is child of SolarSystem. Earth moves! 
                // Ah, Earth orbits in `StarSystem` (was `SolarSystem`). 
                // `Planet.tsx` updates ref.position based on time.
                // TO FLY TO EARTH correctly, I need its current world position, which changes every frame.
                // However, `handleTeleport` just flies to a static point or passed point.
                // The "Earth" object passed to `activeObject` has a `position` that IS calculated in `Planet.tsx` onClick.
                // So if I trigger a click on Earth or simulate it, I get the position.
                // BUT, to just fly there from a button, I might need to find the Earth object.

                // SIMPLIFICATION:
                // I will just enable the marker. The user can then "Teleport" to Earth using the standard UI if they want,
                // OR I can try to auto-select Earth.
                // Let's just set the marker first so it appears.

                // Better UX: Auto-select Earth so the HUD opens and they can click "Teleport".
                // Even better: Calculate approximate Earth pos.

                alert(`Found you at ${latitude.toFixed(2)}, ${longitude.toFixed(2)}! Look for the RED marker on Earth.`);

            }, (error) => {
                console.error("Error getting location:", error);
                alert("Could not get your location. Please enable permissions.");
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    // Dynamic Planets Data to include UserMarker
    const solarSystemPlanets = useMemo(() => [
        { name: "Mercury", size: 0.4, distance: 5, speed: 1.2, color: "#A5A5A5", description: "The swift planet.", data: { type: "Terrestrial" } },
        { name: "Venus", size: 0.7, distance: 8, speed: 0.9, color: "#E3BB76", description: "The morning star.", data: { type: "Terrestrial" } },
        {
            name: "Earth",
            size: 0.8,
            distance: 12,
            speed: 0.6,
            color: "#2255ff",
            description: "Home.",
            data: { type: "Terrestrial" },
            // Inject UserMarker as a child if location exists
            children: userLocation ? (
                <UserMarker lat={userLocation.lat} lon={userLocation.lon} radius={0.8} />
            ) : null
        },
        { name: "Mars", size: 0.5, distance: 16, speed: 0.5, color: "#ff4422", description: "The Red Planet.", data: { type: "Terrestrial" } },
        { name: "Jupiter", size: 1.8, distance: 24, speed: 0.2, color: "#D9A873", description: "The King of Planets.", data: { type: "Gas Giant" } },
        { name: "Saturn", size: 1.5, distance: 32, speed: 0.15, color: "#F4D03F", description: "Lord of the Rings.", data: { type: "Gas Giant" } },
    ], [userLocation]);

    const alphaCentauriPlanets = useMemo(() => [
        { name: "Proxima b", size: 0.85, distance: 4, speed: 1.5, color: "#d2b48c", description: "A potentially habitable exoplanet orbiting Proxima Centauri.", data: { type: "Super Earth" } },
        { name: "Proxima c", size: 1.2, distance: 9, speed: 0.4, color: "#add8e6", description: "A frozen super-earth candidate.", data: { type: "Ice Giant" } },
    ], []);

    return (
        <div className="w-full h-screen bg-black relative">
            <Canvas camera={{ position: [0, 20, 40], fov: 60 }}>
                <EffectComposer>
                    <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>

                <ambientLight intensity={0.1} />

                {/* Controls - CameraControls for programmatic movement */}
                <CameraControls
                    ref={cameraControlsRef}
                    maxDistance={200}
                    minDistance={2}
                    dollySpeed={0.5}
                />

                <Suspense fallback={null}>
                    <color attach="background" args={["#000005"]} />

                    {/* Background Stars (simple cheap ones) */}
                    {/* <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}

                    {/* Custom StarField for detailed aesthetic */}
                    <StarField />
                    <DeepSpace />

                    <Galaxy onSelect={setActiveObject} />
                    <BlackHole onSelect={setActiveObject} />

                    {/* System 1: The Solar System */}
                    <StarSystem
                        position={[0, -5, 10]}
                        name="Sun"
                        starColor="#ffdd00"
                        planets={solarSystemPlanets}
                        onSelect={setActiveObject}
                    />

                    {/* System 2: Alpha Centauri (Neighbor) */}
                    <StarSystem
                        position={[200, 20, -100]}
                        name="Alpha Centauri A"
                        starColor="#ffaa55"
                        starSize={3}
                        planets={alphaCentauriPlanets}
                        onSelect={setActiveObject}
                    />
                </Suspense>
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute top-10 left-10 pointer-events-auto">
                <h1 className="text-white text-4xl font-bold tracking-tighter mix-blend-difference">UNIVERSE</h1>
                <p className="text-cyan-400 text-xs tracking-widest uppercase mt-2 opacity-80 animate-pulse">
                    Interactive Simulation
                </p>
            </div>

            {/* UI Overlay */}
            <div className="absolute top-20 left-10 pointer-events-auto">
                <button
                    onClick={handleLocateMe}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 rounded-full backdrop-blur-md transition-all group"
                >
                    <span className="text-xl group-hover:scale-125 transition-transform">🌍</span>
                    <span className="font-mono text-sm uppercase tracking-wider font-bold">Locate Me</span>
                </button>
            </div>

            {/* HUD Overlay for Information */}
            <HUD
                activeObject={activeObject}
                onClose={() => setActiveObject(null)}
                onTeleport={() => {
                    if (activeObject && activeObject.position) {
                        handleTeleport(activeObject.position);
                    }
                }}
            />
        </div>
    );
}
