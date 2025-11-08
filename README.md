# Manoj's Portfolio

A minimalist, single-page portfolio website with a slider-controlled narrative reveal experience.

## Features

- **Slider-controlled content reveal**: Navigate through the narrative using a horizontal slider (RTL direction)
- **Word-by-word animations**: Text appears word-by-word as you move through each section
- **Smooth, cinematic transitions**: Opacity and subtle Y-translation animations
- **Responsive design**: Optimized for mobile and desktop
- **Modern tech stack**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI (Slider)
- **Fonts**: Inter (with Helvetica Neue fallback)

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
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/
│   ├── Navigation.tsx       # Top-right navigation links
│   ├── ContentSection.tsx   # Individual content section with animations
│   └── ui/
│       └── slider.tsx       # Slider component (Radix UI wrapper)
└── lib/
    └── utils.ts        # Utility functions
```

## Customization

### Content

Edit the `contentSections` array in `src/app/page.tsx` to modify the narrative content.

### Colors

Update the color scheme in `tailwind.config.js`:
- Background: `#000000`
- Foreground: `#FFFFFF`
- Accent: `#A855F7` (Purple)

### Fonts

The site uses Inter font by default. To change fonts, update `src/app/layout.tsx` and the font configuration in `tailwind.config.js`.

## License

MIT

