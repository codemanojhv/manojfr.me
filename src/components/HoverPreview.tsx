"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface HoverPreviewProps {
    text: string
    color: string
    mouseX: number
    mouseY: number
}

export function HoverPreview({
    text,
    color,
    mouseX,
    mouseY
}: HoverPreviewProps) {
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    const r = rgbaMatch ? rgbaMatch[1] : '255'
    const g = rgbaMatch ? rgbaMatch[2] : '255'
    const b = rgbaMatch ? rgbaMatch[3] : '255'

    // Position preview near cursor (2cm above cursor)
    // 2cm ≈ 75.6px at 96 DPI, using 76px for consistency
    const offsetX = 15
    const offsetY = -76 // 2cm above cursor

    // Get image path based on text (you can customize this mapping)
    const getImagePath = (text: string): string | null => {
        const imageMap: Record<string, string> = {
            'CHAOS': '/media/chaos.svg',
            'CO-PILOT': '/media/copilot.svg',
            'FIGHTS GODS IN HIS HEAD': '/media/mind.svg',
            'STOLEN FROM ALTERNATE TIMELINES': '/media/projects.svg',
            'TECH NECROMANCER': '/media/code.svg',
            'VIOLENTLY ALIVE': '/media/alive.svg',
            'UNIVERSE': '/media/universe.svg',
            'BLACK HOLES': '/media/universe.svg',
            'FAILURES': '/media/learn.svg',
            'MAGIC': '/media/magic.svg',
        }
        return imageMap[text.toUpperCase()] || null
    }

    const imagePath = getImagePath(text)

    return (
        <motion.div
            className="fixed pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.7, y: mouseY + offsetY - 10 }}
            animate={{
                opacity: 1,
                scale: 1,
                x: mouseX + offsetX,
                y: mouseY + offsetY
            }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.5,
                bounce: 0.3
            }}
            style={{
                transformOrigin: 'top left',
            }}
        >
            <div
                className="rounded-2xl backdrop-blur-2xl border shadow-2xl overflow-hidden w-[280px]"
                style={{
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `0 20px 60px 0 rgba(${r}, ${g}, ${b}, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)`,
                }}
            >
                {/* Image Preview Area */}
                {imagePath && (
                    <div className="w-full h-32 bg-gradient-to-br from-white/10 to-transparent relative overflow-hidden">
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={imagePath}
                                alt={text}
                                width={280}
                                height={128}
                                className="w-full h-full object-cover"
                                unoptimized
                                onError={(e) => {
                                    // Hide image container if image doesn't exist
                                    const container = e.currentTarget.closest('div')
                                    if (container) {
                                        container.style.display = 'none'
                                    }
                                }}
                            />
                        </motion.div>
                    </div>
                )}

                {/* Text Content */}
                <div className="px-4 py-3">
                    <p className="text-white text-sm font-medium uppercase tracking-wide">
                        {text}
                    </p>
                    <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                        <span>Click to explore</span>
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        >
                            →
                        </motion.span>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
