"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HUD({ activeObject, onClose, onTeleport }: { activeObject: any, onClose: () => void, onTeleport: () => void }) {
    if (!activeObject) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-10 left-10 md:w-96 p-6 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white font-mono z-50 pointer-events-auto shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">{activeObject.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
                </div>

                <div className="space-y-4 text-sm text-gray-300">
                    <p className="leading-relaxed">{activeObject.description}</p>

                    <button
                        onClick={onTeleport}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-cyan-300 font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                    >
                        <span>🚀</span> Teleport Here
                    </button>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div>
                            <span className="text-gray-500 block text-xs uppercase">Type</span>
                            <span>{activeObject.type}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs uppercase">Distance</span>
                            <span>{activeObject.distance}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs uppercase">Mass</span>
                            <span>{activeObject.mass}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs uppercase">Age</span>
                            <span>{activeObject.age}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
