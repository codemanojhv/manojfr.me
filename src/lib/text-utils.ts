import { Illustrations } from "@/components/Illustrations"

export const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"] as const

// URL mapping for clickable highlights
export const HIGHLIGHT_URLS: Record<string, string> = {
    'CHAOS': '/chaos',
    'CO-PILOT': '/chaos',
    'FIGHTS GODS IN HIS HEAD': '/mind',
    'STOLEN FROM ALTERNATE TIMELINES': '/projects',
    'TECH NECROMANCER': '/code',
    'VIOLENTLY ALIVE': '/alive',
    'UNIVERSE': '/universe',
    'BLACK HOLES': '/universe',
    'FAILURES': '/learn',
    'MAGIC': '/magic',
}

// Named color mappings for easy customization
export const HIGHLIGHT_COLORS: Record<string, string> = {
    // Basic colors - using full saturation for glass effect
    'red': 'rgba(239, 68, 68, 1)', // red-500
    'blue': 'rgba(59, 130, 246, 1)', // blue-500
    'green': 'rgba(34, 197, 94, 1)', // green-500
    'yellow': 'rgba(234, 179, 8, 1)', // yellow-500
    'purple': 'rgba(168, 85, 247, 1)', // purple-500
    'pink': 'rgba(236, 72, 153, 1)', // pink-500
    'orange': 'rgba(249, 115, 22, 1)', // orange-500
    'cyan': 'rgba(6, 182, 212, 1)', // cyan-500
    'indigo': 'rgba(99, 102, 241, 1)', // indigo-500
    'teal': 'rgba(20, 184, 166, 1)', // teal-500
    'lime': 'rgba(132, 204, 22, 1)', // lime-500
    'amber': 'rgba(245, 158, 11, 1)', // amber-500
    'emerald': 'rgba(16, 185, 129, 1)', // emerald-500
    'violet': 'rgba(139, 92, 246, 1)', // violet-500
    'fuchsia': 'rgba(217, 70, 239, 1)', // fuchsia-500
    'rose': 'rgba(244, 63, 94, 1)', // rose-500
    'sky': 'rgba(14, 165, 233, 1)', // sky-500
    // Default - subtle white for glass effect
    'default': 'rgba(255, 255, 255, 1)',
    'white': 'rgba(255, 255, 255, 1)',
}

export function isImageToken(token: string) {
    const lower = token.toLowerCase()
    return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

export function isEmojiToken(token: string) {
    return Array.from(token).some((char) => {
        const code = char.codePointAt(0)
        return code !== undefined && code >= 0x1f000
    })
}

export function getIllustration(token: string) {
    const map: Record<string, React.ComponentType<{ className?: string }>> = {
        '🧍': Illustrations.Person,
        '🚀': Illustrations.Rocket,
        '💀': Illustrations.Skull,
        '⚡': Illustrations.Lightning,
        '🎨': Illustrations.Art,
        '💻': Illustrations.Code,
        '🖌️': Illustrations.Art,
        '✍️': Illustrations.Art,
        '🎮': Illustrations.Gaming,
        '🧠': Illustrations.Brain,
        '🔥': Illustrations.Fire,
        '🪐': Illustrations.Planet,
        '⚫': Illustrations.BlackHole,
        '🔊': Illustrations.Sound,
        '✨': Illustrations.Stars,
        '☠️': Illustrations.Dead,
        '🧭': Illustrations.Compass,
    }

    // Find the first emoji match
    for (const [emoji, Component] of Object.entries(map)) {
        if (token.includes(emoji)) {
            return Component
        }
    }
    return null
}

export function parseHighlight(highlightText: string): { text: string; bgColor: string; isTailwind: boolean; tailwindClass?: string } {
    // Remove the == markers
    const inner = highlightText.slice(2, -2).trim()

    // Find the first colon to separate color from text
    const colonIndex = inner.indexOf(':')

    // If no colon, it's just text with default color
    if (colonIndex === -1) {
        return { text: inner, bgColor: HIGHLIGHT_COLORS.default, isTailwind: false }
    }

    const colorPart = inner.substring(0, colonIndex).trim()
    const textPart = inner.substring(colonIndex + 1).trim()

    // Check if it's a hex color: ==#ff0000:text== or ==#f00:text==
    if (colorPart.startsWith('#')) {
        const hex = colorPart.replace('#', '')
        let r: number, g: number, b: number

        if (hex.length === 3) {
            // 3-digit hex (e.g., #f00)
            r = parseInt(hex[0] + hex[0], 16)
            g = parseInt(hex[1] + hex[1], 16)
            b = parseInt(hex[2] + hex[2], 16)
        } else if (hex.length === 6) {
            // 6-digit hex (e.g., #ff0000)
            r = parseInt(hex.substring(0, 2), 16)
            g = parseInt(hex.substring(2, 4), 16)
            b = parseInt(hex.substring(4, 6), 16)
        } else {
            // Invalid hex, use default
            return { text: textPart || inner, bgColor: HIGHLIGHT_COLORS.default, isTailwind: false }
        }

        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return { text: textPart || inner, bgColor: HIGHLIGHT_COLORS.default, isTailwind: false }
        }

        return { text: textPart, bgColor: `rgba(${r}, ${g}, ${b}, 1)`, isTailwind: false }
    }

    // Check if it's a Tailwind class: ==bg-blue-500:text==
    if (colorPart.startsWith('bg-')) {
        return { text: textPart, bgColor: '', isTailwind: true, tailwindClass: colorPart }
    }

    // Check if it's a named color: ==red:text==
    const colorName = colorPart.toLowerCase()
    const bgColor = HIGHLIGHT_COLORS[colorName] || HIGHLIGHT_COLORS.default
    return { text: textPart, bgColor, isTailwind: false }
}
