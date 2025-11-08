# Content Guide

## Content Sections

The portfolio narrative is divided into 10 sections, each mapped to a slider range:

### Section 1 (100-90): Introduction
- **Emoji**: 🧑🏻‍🎨
- **Content**: Identity introduction

### Section 2 (90-80): Skills & Creative Spread
- **Emoji**: 🎮
- **Content**: Diverse interests and skills

### Section 3 (80-70): Curiosity & Consciousness
- **Emoji**: 🪐
- **Content**: Obsession with how things work, universe mindset

### Section 4 (70-60): Philosophy on Building
- **Emoji**: ⚡
- **Content**: Building vs waiting, taking action

### Section 5 (60-50): Current Projects
- **Emoji**: 🚀
- **Content**: Blud and theux.space projects

### Section 6 (50-40): Growth Style
- **Emoji**: 🧠
- **Content**: ML but with emotional damage, learning from mistakes

### Section 7 (40-30): Acceptance of Direction
- **Emoji**: 🧭
- **Content**: Uncertainty but moving forward

### Section 8 (30-20): Core Vibe
- **Emoji**: 🌱
- **Content**: Figuring things out while building

### Section 9 (20-10): Main Character vs NPC
- **Emoji**: 🎭
- **Content**: Worldview on life roles

### Section 10 (10-0): Closing Statement
- **Emoji**: 🏁
- **Content**: Resolve and conclusion

## Customization

To modify content, edit the `contentSections` array in `src/app/page.tsx`.

Each section has:
- `id`: Unique identifier
- `range`: Slider value range `[start, end]`
- `emoji`: Emoji icon for the section
- `lines`: Array of text lines

## Animation Behavior

- **Word-by-word reveal**: Words appear sequentially as slider moves through section
- **Smooth transitions**: Opacity and Y-translation animations 
- **Section fading**: Sections fade in/out at range boundaries
- **Emoji scaling**: Emojis scale from 0.7 to 1.0 on appearance

## Slider Behavior

- **RTL Direction**: Moving slider left reveals progression (100 → 0)
- **No scrolling**: Page does not scroll, only slider controls content
- **Touch support**: Works on mobile with touch gestures
- **Smooth stepping**: 0.1 step increment for fine control

