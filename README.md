# Cosmic Explorer

Interactive 3D simulations of the cosmos featuring a universe explorer and black hole visualization.

## Features

- **Universe Explorer**: Navigate through a 3D starfield with galaxies, solar systems, and planets
- **Black Hole Simulation**: Cinematic visualization of black holes with customizable physics parameters
- **WebGL/Three.js**: Built with React Three Fiber for high-performance 3D rendering
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **3D Library**: Three.js with React Three Fiber, Drei, and Postprocessing
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Shaders**: Custom GLSL shaders for black hole effects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page with navigation to simulations
│   ├── universe/
│   │   └── page.tsx         # Universe simulation page
│   ├── blackhole/
│   │   └── page.tsx         # Black hole simulation page
│   └── globals.css          # Global styles
├── components/
│   └── universe/
│       ├── UniverseScene.tsx       # Main universe scene
│       ├── BlackHoleScene.tsx      # Main black hole scene
│       ├── StarField.tsx           # Star particle system
│       ├── Galaxy.tsx              # Galaxy component
│       ├── StarSystem.tsx          # Solar system component
│       ├── Planet.tsx              # Planet component
│       ├── BlackHole.tsx           # Black hole component
│       ├── HUD.tsx                 # UI overlay for universe
│       └── shaders/                # Custom GLSL shaders
├── data/
│   └── blackHoles.ts        # Black hole presets and data
└── lib/
    └── utils.ts             # Utility functions
```

## Features

### Universe Simulation
- Interactive camera controls
- Procedurally generated star systems
- Multiple galaxies to explore
- Planet details and information HUD
- Teleportation between systems
- User position marker

### Black Hole Simulation
- Multiple black hole presets (Sagittarius A*, M87, Gargantua, etc.)
- Real-time physics parameter adjustments
- Custom GLSL shaders for gravitational lensing
- Accretion disk visualization
- Cinematic camera controls

## Customization

### Adding New Black Hole Presets

Edit `src/data/blackHoles.ts` to add new black hole configurations with custom parameters.

### Colors

Update the color scheme in `tailwind.config.js` and component files as needed.

## License

MIT
