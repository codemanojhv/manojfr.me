"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useState, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import "./shaders/CinematicBlackHoleShader";
import { BLACK_HOLE_PRESETS, BlackHolePreset } from "../../data/blackHoles";

function CinematicBlackHole({ color, density, spin, scale }: { color: string, density: number, spin: number, scale: number }) {
    const meshRef = useRef<any>();
    const materialRef = useRef<any>();
    const { camera } = useThree();
    const localCameraPos = useMemo(() => new THREE.Vector3(), []);

    // Smooth transitionRef
    const targetScale = useRef(scale);

    useFrame((state, delta) => {
        if (materialRef.current && meshRef.current) {
            materialRef.current.time += delta;
            // Transform Camera Local
            localCameraPos.copy(camera.position);
            meshRef.current.worldToLocal(localCameraPos);
            materialRef.current.uCameraPos.copy(localCameraPos);

            // Update Uniforms
            const c = new THREE.Color(color);
            // Lerp color for smoothness
            materialRef.current.uColor.lerp(c, delta * 2);

            // Lerp floats
            materialRef.current.uDensity = THREE.MathUtils.lerp(materialRef.current.uDensity, density, delta * 2);
            materialRef.current.uSpin = THREE.MathUtils.lerp(materialRef.current.uSpin, spin, delta * 2);

            // Smooth Scale Transition
            targetScale.current = scale;

            // Scale the MESH to simulate size differences. 
            // Note: The shader uses local coordinates, so scaling the mesh effectively scales the simulation volume in world space.
            const s = meshRef.current.scale.x;
            // Faster lerp for scale
            const newS = THREE.MathUtils.lerp(s, targetScale.current, delta * 2);
            meshRef.current.scale.set(newS, newS, newS);
        }
    });

    return (
        <mesh ref={meshRef} scale={[1, 1, 1]}>
            <boxGeometry args={[30, 30, 30]} />
            {/* @ts-ignore */}
            <cinematicBlackHoleMaterial
                ref={materialRef}
                transparent
                side={THREE.BackSide}
                blending={THREE.NormalBlending}
                depthWrite={false}
            />
        </mesh>
    );
}

export default function BlackHoleScene() {
    const [selectedId, setSelectedId] = useState<string>("gargantua");

    // We keep local params so user can tweak AFTER selecting
    const [params, setParams] = useState({
        color: "#ff8800",
        density: 1.2,
        spin: 1.0,
        bloom: 1.5,
        scale: 1.0
    });

    // When selection changes, update params
    const handleSelect = (id: string) => {
        setSelectedId(id);
        const preset = BLACK_HOLE_PRESETS.find(p => p.id === id);
        if (preset) {
            setParams({
                color: preset.color,
                density: preset.density,
                spin: preset.spin,
                bloom: preset.bloom,
                scale: preset.scale
            });
        }
    };

    const currentPreset = BLACK_HOLE_PRESETS.find(p => p.id === selectedId);

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden font-sans">

            {/* Scene */}
            <Canvas camera={{ position: [0, 5, 20], fov: 45 }}>
                <color attach="background" args={["#000000"]} />

                <Suspense fallback={null}>
                    <CinematicBlackHole
                        color={params.color}
                        density={params.density}
                        spin={params.spin}
                        scale={params.scale} // Pass scale
                    />
                </Suspense>

                <CameraControls minDistance={5} maxDistance={100} dollySpeed={0.5} />

                <EffectComposer disableNormalPass>
                    <Bloom
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.8}
                        intensity={params.bloom}
                        levels={8}
                        mipmapBlur
                    />
                    <ChromaticAberration offset={[0.002, 0.002]} blendFunction={BlendFunction.NORMAL} radialModulation={true} modulationOffset={0.5} />
                    <Noise opacity={0.06} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay - Left: Catalog */}
            <div className="absolute top-10 left-10 w-64 flex flex-col gap-2 pointer-events-auto">
                <h2 className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-2">Cosmic Catalog</h2>
                {BLACK_HOLE_PRESETS.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className={`text-left px-4 py-3 rounded-lg border backdrop-blur-md transition-all group ${selectedId === p.id
                                ? 'bg-white/10 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105'
                                : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/30 hover:scale-105'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold text-sm tracking-wide ${selectedId === p.id ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                {p.name}
                            </span>
                            {selectedId === p.id && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>}
                        </div>
                        <div className="text-[10px] text-white/40 uppercase font-mono">{p.type}</div>
                    </button>
                ))}

                <div className="mt-8">
                    <a href="/universe" className="text-white/40 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Return to Universe
                    </a>
                </div>
            </div>

            {/* UI Overlay - Right: Data & Controls */}
            <div className="absolute top-10 right-10 w-80 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-white text-xs select-none shadow-2xl pointer-events-auto">
                <div className="border-b border-white/10 pb-4 mb-4">
                    <h1 className="text-3xl font-bold mb-1 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">{currentPreset?.name || "Unknown"}</h1>
                    <p className="text-white/60 leading-relaxed text-xs">{currentPreset?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-[10px] font-mono uppercase text-white/50">
                    <div>
                        <div className="mb-1">Mass</div>
                        <div className="text-white font-bold text-sm overflow-hidden text-ellipsis whitespace-nowrap" title={currentPreset?.mass}>{currentPreset?.mass}</div>
                    </div>
                    <div>
                        <div className="mb-1">Distance</div>
                        <div className="text-white font-bold text-sm">{currentPreset?.distance}</div>
                    </div>
                </div>

                {/* Laboratory Controls */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-white/30">
                        <span>Physics Laboratory</span>
                        <span>[Override Active]</span>
                    </div>

                    <div>
                        <label className="block mb-2 font-mono uppercase text-white/70 flex justify-between">
                            <span>Matter Density</span>
                            <span>{params.density.toFixed(1)}</span>
                        </label>
                        <input
                            type="range" min="0.5" max="3.0" step="0.1"
                            value={params.density}
                            onChange={(e) => setParams(p => ({ ...p, density: parseFloat(e.target.value) }))}
                            className="w-full accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-mono uppercase text-white/70 flex justify-between">
                            <span>Spin Velocity</span>
                            <span>{params.spin.toFixed(1)}c</span>
                        </label>
                        <input
                            type="range" min="0.0" max="5.0" step="0.1"
                            value={params.spin}
                            onChange={(e) => setParams(p => ({ ...p, spin: parseFloat(e.target.value) }))}
                            className="w-full accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-mono uppercase text-white/70 flex justify-between">
                            <span>Visual Scale</span>
                            <span>{params.scale.toFixed(1)}x</span>
                        </label>
                        <input
                            type="range" min="0.1" max="5.0" step="0.1"
                            value={params.scale}
                            onChange={(e) => setParams(p => ({ ...p, scale: parseFloat(e.target.value) }))}
                            className="w-full accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-mono uppercase text-white/70">Accretion Color</label>
                        <div className="flex gap-2">
                            {["#ff8800", "#ffaa00", "#0088ff", "#ff4422", "#00ffff", "#ffffff"].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setParams(p => ({ ...p, color: c }))}
                                    className={`w-6 h-6 rounded-full border border-white/30 transition-all ${params.color === c ? 'scale-125 border-white shadow-[0_0_10px_white]' : 'opacity-50 hover:opacity-100'}`}
                                    style={{ background: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
