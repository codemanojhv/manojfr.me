# Customizable Highlight Guide

## 🎨 Highlight Syntax

You can highlight text with custom colors using the `==` syntax. Each highlight can have its own unique color!

## Basic Usage

### Default Highlight (White)
```
==TEXT==
```
Uses the default white/transparent background.

### Named Colors
```
==red:TEXT==
==blue:TEXT==
==green:TEXT==
==yellow:TEXT==
==purple:TEXT==
==pink:TEXT==
==orange:TEXT==
==cyan:TEXT==
```

### Available Named Colors
- `red`, `blue`, `green`, `yellow`, `purple`, `pink`, `orange`
- `cyan`, `indigo`, `teal`, `lime`, `amber`, `emerald`
- `violet`, `fuchsia`, `rose`, `sky`
- `white` or `default` (default highlight)

### Hex Colors
```
==#ff0000:TEXT==        (Red)
==#00ff00:TEXT==        (Green)
==#0000ff:TEXT==        (Blue)
==#ff00ff:TEXT==        (Magenta)
==#f00:TEXT==           (Short hex - Red)
```

### Tailwind Classes (Advanced)
```
==bg-blue-500:TEXT==
==bg-red-600:TEXT==
==bg-green-400/50:TEXT==
```

### Multi-Word Highlights
```
==red:THIS IS HIGHLIGHTED==
==blue:MULTIPLE WORDS HERE==
```

## Examples

```typescript
const narrativeText = `HI, I'M MANOJ 🧍‍♂️

==red:I'M IN COLLEGE==

JUST FREESTYLING LIFE AT THIS POINT.

==blue:I'M IN LOVE WITH CHAOS==

I BUILD SHIT

==green:BREAK IT==

==yellow:FIX IT==

AND ACT LIKE THAT WAS ALWAYS THE PLAN.

==purple:I DESIGN==
==cyan:I CODE==
==pink:I PAINT==

==#ff6b6b:THIS IS CUSTOM RED==
==#4ecdc4:THIS IS CUSTOM TEAL==`
```

## Combining with Bold

You can use highlights with bold text (they work independently):
```
**BOLD TEXT**
==red:HIGHLIGHTED TEXT==
==blue:**BOLD AND HIGHLIGHTED**==  (Note: This won't work - use one or the other)
```

## Color Customization

To add or modify colors, edit the `HIGHLIGHT_COLORS` object in `src/components/ContentSection.tsx`:

```typescript
const HIGHLIGHT_COLORS: Record<string, string> = {
  'red': 'rgba(239, 68, 68, 0.3)',
  'blue': 'rgba(59, 130, 246, 0.3)',
  // Add your custom color here
  'mycolor': 'rgba(255, 0, 128, 0.3)',
}
```

Then use it: `==mycolor:TEXT==`

## Tips

- Use different colors to create visual hierarchy
- Hex colors give you precise control
- Tailwind classes offer advanced styling options
- Each highlight can have a unique color
- Highlights work with emojis and images too!

