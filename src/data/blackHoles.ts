export type BlackHolePreset = {
    id: string;
    name: string;
    type: string;
    mass: string; // Display string
    distance: string;

    // Physics / Visual Params
    color: string;
    density: number; // 0.5 to 3.0
    spin: number; // 0.0 to 5.0
    scale: number; // Visual scale multiplier (1.0 = Standard)
    bloom: number; // Glow intensity

    description: string;
};

export const BLACK_HOLE_PRESETS: BlackHolePreset[] = [
    {
        id: "gargantua",
        name: "Gargantua",
        type: "Supermassive (Fictional)",
        mass: "100 Million Suns",
        distance: "10 Billion ly",
        color: "#ff8800",
        density: 1.2,
        spin: 1.0,
        scale: 1.0,
        bloom: 1.5,
        description: "The immense, glowing giant from Interstellar. Known for its perfect Einstein ring and high-speed accretion disk."
    },
    {
        id: "m87",
        name: "M87*",
        type: "Supermassive",
        mass: "6.5 Billion Suns",
        distance: "53 Million ly",
        color: "#ffaa00", // Gold/Orange
        density: 0.8, // Fuzzy
        spin: 0.5, // Slow rotation
        scale: 2.5, // Massive
        bloom: 1.0,
        description: "The first black hole ever imaged by humanity. A colossus at the center of the Virgo A galaxy, firing a jet of plasma 5,000 light-years long."
    },
    {
        id: "ton618",
        name: "TON 618",
        type: "Hyperluminous Quasar",
        mass: "66 Billion Suns",
        distance: "18.2 Billion ly",
        color: "#0088ff", // Blinding UV/Blue
        density: 2.5, // Extremely dense disk
        spin: 4.0, // Relativistic spin
        scale: 5.0, // Unfathomably large
        bloom: 2.8, // Blinding
        description: "The largest black hole known to existence. A quasar shining brighter than 140 trillion suns. It is the absolute apex of gravity."
    },
    {
        id: "sag_a",
        name: "Sagittarius A*",
        type: "Supermassive",
        mass: "4.3 Million Suns",
        distance: "26,000 ly",
        color: "#ff4422", // Reddish/Dim
        density: 0.6, // Starved
        spin: 0.8,
        scale: 0.8, // Comparatively small
        bloom: 1.2,
        description: "The dormant heart of our own Milky Way galaxy. It is currently starving, consuming only whispers of gas from nearby stars."
    },
    {
        id: "cygnus",
        name: "Cygnus X-1",
        type: "Stellar Mass",
        mass: "21 Suns",
        distance: "6,000 ly",
        color: "#00ffff", // X-Ray Blue
        density: 2.0, // Feeding vigorously
        spin: 5.0, // Near max spin
        scale: 0.3, // Tiny
        bloom: 2.0,
        description: "A violent stellar-mass black hole stripping matter from a companion blue supergiant star. A chaotic X-ray source."
    }
];
