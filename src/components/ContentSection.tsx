"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo, useRef } from "react"
import { Illustrations } from "@/components/Illustrations"

interface ContentSectionProps {
  text: string
  sliderValue: number
}

// URL mapping for clickable highlights
const HIGHLIGHT_URLS: Record<string, string> = {
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

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"] as const

function isImageToken(token: string) {
  const lower = token.toLowerCase()
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function isEmojiToken(token: string) {
  return Array.from(token).some((char) => {
    const code = char.codePointAt(0)
    return code !== undefined && code >= 0x1f000
  })
}

function getIllustration(token: string) {
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

// Named color mappings for easy customization
// Colors are optimized for glassmorphism effect (will be applied with 0.2 opacity + blur)
const HIGHLIGHT_COLORS: Record<string, string> = {
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

// Parse highlight syntax: ==color:text== or ==text==
// Supports: ==red:text==, ==#ff0000:text==, ==bg-blue-500:text==, ==text== (default)
function parseHighlight(highlightText: string): { text: string; bgColor: string; isTailwind: boolean; tailwindClass?: string } {
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

// Hover Preview Component with image preview
function HoverPreview({ 
  text, 
  color, 
  mouseX, 
  mouseY 
}: { 
  text: string
  color: string
  mouseX: number
  mouseY: number 
}) {
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

export function ContentSection({ text, sliderValue }: ContentSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null)
  const [previewText, setPreviewText] = useState<string>("")
  const [previewColor, setPreviewColor] = useState<string>("rgba(255, 255, 255, 1)")
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [windowWidth, setWindowWidth] = useState(1200) // Use consistent initial value
  const [isMounted, setIsMounted] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track window width and mouse position for responsive calculations
  useEffect(() => {
    setIsMounted(true)
    const updateWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("resize", updateWidth)
      window.removeEventListener("mousemove", handleMouseMove)
      // Clean up hover timeout on unmount
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Memoize word processing to ensure consistency between server and client
  const { allWords, visibleWordIndices } = useMemo(() => {
    // Split text into lines (by double newlines or single newlines)
    const lines = text.split(/\n+/).filter(line => line.trim().length > 0)
    
    // Process lines to handle bold text (**text**) and highlighted text (==text==) that might span multiple words
    const processLine = (line: string): string[] => {
      const words: string[] = []
      let currentWord = ""
      let inBold = false
      let inHighlight = false
      
      const tokens = line.trim().split(/\s+/)
      tokens.forEach((token) => {
        // Check for highlight first (==text==)
        if (token.startsWith("==") && token.endsWith("==") && token.length > 4) {
          // Single word highlight
          words.push(token)
        } else if (token.startsWith("==") && !inHighlight && !inBold) {
          // Start of highlight
          inHighlight = true
          currentWord = token
        } else if (token.endsWith("==") && token.length >= 3 && inHighlight) {
          // End of highlight
          currentWord += " " + token
          words.push(currentWord)
          currentWord = ""
          inHighlight = false
        } else if (inHighlight) {
          // Middle of highlight
          currentWord += " " + token
        }
        // Check for bold (**text**)
        else if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
          // Single word bold
          words.push(token)
        } else if (token.startsWith("**") && !inBold && !inHighlight) {
          // Start of bold
          inBold = true
          currentWord = token
        } else if (token.endsWith("**") && token.length >= 3 && inBold) {
          // End of bold
          currentWord += " " + token
          words.push(currentWord)
          currentWord = ""
          inBold = false
        } else if (inBold) {
          // Middle of bold
          currentWord += " " + token
        } else {
          // Normal word
          words.push(token)
        }
      })
      
      if (currentWord) words.push(currentWord) // Handle unclosed bold or highlight
      
      return words
    }
    
    // Flatten all words across all lines with their line index and global index
    const allWordsArray: Array<{ word: string; lineIndex: number; wordIndex: number; globalIndex: number }> = []
    let globalIdx = 0
    lines.forEach((line, lineIndex) => {
      const words = processLine(line)
      words.forEach((word, wordIndex) => {
        allWordsArray.push({ word, lineIndex, wordIndex, globalIndex: globalIdx++ })
      })
    })

    if (allWordsArray.length === 0) {
      return { allWords: [], visibleWordIndices: new Set<number>() }
    }

    const sliderProgress = Math.max(0, Math.min(1, sliderValue / 100))
    const totalWords = allWordsArray.length

    // Calculate which words are visible based on slider progress
    // This must be consistent between server and client
    const visibleIndices = new Set<number>()
    
    // Find the last index of the first line to make all first line words visible at 0%
    let firstLineLastIndex = -1
    for (let i = 0; i < allWordsArray.length; i++) {
      if (allWordsArray[i].lineIndex === 0) {
        firstLineLastIndex = i
      } else {
        break
      }
    }
    
    allWordsArray.forEach((wordData) => {
      // All words from the first line (including emojis) always visible at 0%
      if (wordData.lineIndex === 0 && wordData.globalIndex <= firstLineLastIndex) {
        visibleIndices.add(wordData.globalIndex)
        return
      }
      
      // Distribute words across slider progress
      const wordProgress = wordData.globalIndex / (totalWords - 1)
      if (sliderProgress >= wordProgress - 0.001) {
        visibleIndices.add(wordData.globalIndex)
      }
    })

    return { allWords: allWordsArray, visibleWordIndices: visibleIndices }
  }, [text, sliderValue])

  if (allWords.length === 0) {
    return null
  }

  const totalWords = allWords.length

  // Calculate visible word count for responsive alignment
  const visibleWordCount = visibleWordIndices.size
  
  // Use consistent values for SSR - only calculate responsive alignment after mount
  // During SSR, use default desktop values to ensure consistency
  const effectiveWindowWidth = isMounted ? windowWidth : 1200
  const isMobile = effectiveWindowWidth < 640
  const isTablet = effectiveWindowWidth >= 640 && effectiveWindowWidth < 1024
  
  // Estimate content width for alignment decisions
  const fontSize = effectiveWindowWidth >= 1024 
    ? effectiveWindowWidth * 0.015 
    : effectiveWindowWidth >= 640 
    ? 18 
    : 16
  
  const charWidth = fontSize * 0.58
  const wordGap = 12
  
  let estimatedWidth = 0
  visibleWordIndices.forEach((globalIndex) => {
    const wordData = allWords[globalIndex]
    if (isImageToken(wordData.word) || isEmojiToken(wordData.word)) {
      estimatedWidth += effectiveWindowWidth >= 1024 ? 56 : effectiveWindowWidth >= 640 ? 48 : 40
    } else {
      // Account for highlight and bold markers
      const isHighlight = wordData.word.startsWith("==") && wordData.word.endsWith("==")
      const isBold = wordData.word.startsWith("**") && wordData.word.endsWith("**")
      let displayWord: string
      if (isHighlight) {
        const parsed = parseHighlight(wordData.word)
        displayWord = parsed.text
      } else if (isBold) {
        displayWord = wordData.word.slice(2, -2)
      } else {
        displayWord = wordData.word
      }
      estimatedWidth += displayWord.length * charWidth
      // Add padding for highlighted words (px-2 = 8px on each side = 16px total)
      if (isHighlight) {
        estimatedWidth += 16
      }
    }
    estimatedWidth += wordGap
  })
  
  const padding = effectiveWindowWidth >= 1024 ? 160 : effectiveWindowWidth >= 640 ? 80 : 40
  const availableWidth = Math.max(300, effectiveWindowWidth - padding)
  const widthRatio = availableWidth > 0 ? estimatedWidth / availableWidth : 0
  
  // Center when content is small, left-align as it grows
  const centerThreshold = isMobile ? 0.45 : isTablet ? 0.55 : 0.65
  const justifyThreshold = isMobile ? 0.8 : isTablet ? 0.85 : 0.9
  
  const shouldCenter = widthRatio < centerThreshold
  const shouldJustify = widthRatio >= justifyThreshold && effectiveWindowWidth >= 1024

  return (
    <>
      <AnimatePresence>
        {previewPosition && (
          <HoverPreview
            text={previewText}
            color={previewColor}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
        )}
      </AnimatePresence>
      <div 
        className="w-full flex transition-all duration-700 ease-out px-5 lg:pl-10 lg:pr-20"
        style={{
          justifyContent: shouldCenter ? "center" : "flex-start",
        }}
      >
      <p
        suppressHydrationWarning
        className={`flex flex-wrap gap-x-3 gap-y-2 text-base leading-8 uppercase tracking-tight text-white lg:text-[1.5vw] lg:leading-[1.6] transition-all duration-700 ${
          shouldJustify ? "content-text" : ""
        }`}
        style={{
          textAlign: shouldCenter ? "center" : shouldJustify ? "justify" : "left",
          maxWidth: shouldCenter ? "none" : "100%",
        }}
      >
        {allWords.map((wordData) => {
          const isVisible = visibleWordIndices.has(wordData.globalIndex)
          const uniqueId = `${wordData.globalIndex}-${wordData.word}`
          const word = wordData.word
          
          // All words from the first line are always visible
          const isFirstLine = wordData.lineIndex === 0
          
          if (!isVisible && !isFirstLine) {
            return null
          }

          // Only track hover for images, emojis, and highlights
          const isImage = isImageToken(word)
          const isEmoji = isEmojiToken(word)
          const isHighlight = word.startsWith("==") && word.endsWith("==")
          const isInteractive = isImage || isEmoji || isHighlight
          
          const isHovered = hoveredIndex === uniqueId
          // Dim ALL elements (including regular text) when hovering over any interactive element
          const isDimmed = hoveredIndex !== null && !isHovered

          if (isImage) {
            const src = word.startsWith("/") ? word : `/media/${word}`
            const isProfile = word.includes("manoj.png")

            if (isProfile) {
              return (
                <motion.span
                  key={uniqueId}
                  className="inline-flex items-center justify-center align-middle mx-1"
                  initial={{ scale: 0, opacity: 0, rotate: -20 }}
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    opacity: isDimmed ? 0.2 : 1,
                    rotate: isHovered ? 5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => setHoveredIndex(uniqueId)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Image
                    src={src}
                    alt={word}
                    width={100}
                    height={100}
                    className="h-12 w-auto sm:h-16 lg:h-[4.5vw] object-contain hover:scale-110 transition-transform duration-300" 
                  />
                </motion.span>
              )
            }

            return (
              <motion.span
                key={uniqueId}
                className="inline-flex items-center"
                initial={{ scale: 0.75, opacity: 0.85 }}
                animate={{
                  scale: isHovered ? 1.18 : 1,
                  opacity: isDimmed ? 0.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 520, damping: 24 }}
                onMouseEnter={() => setHoveredIndex(uniqueId)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={src}
                  alt={word}
                  width={56}
                  height={56}
                  className="h-8 w-auto sm:h-10 lg:h-[2.8vw] object-contain"
                />
              </motion.span>
            )
          }

          if (isEmoji) {
            const Illustration = getIllustration(word)
            
            if (Illustration) {
              return (
                <motion.span
                  key={uniqueId}
                  className="inline-flex items-center justify-center align-text-bottom"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    opacity: isDimmed ? 0.2 : 1,
                    rotate: isHovered ? 10 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 520, damping: 24 }}
                  onMouseEnter={() => setHoveredIndex(uniqueId)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Illustration className="h-6 w-6 sm:h-8 sm:w-8 lg:h-[2vw] lg:w-[2vw]" />
                </motion.span>
              )
            }

            return (
              <motion.span
                key={uniqueId}
                className="inline-block"
                initial={{ scale: 0.6, opacity: 0.85 }}
                animate={{
                  scale: isHovered ? 1.18 : 1,
                  opacity: isDimmed ? 0.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 520, damping: 24 }}
                onMouseEnter={() => setHoveredIndex(uniqueId)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {word}
              </motion.span>
            )
          }

          // Check if word should be bold (starts with **) or highlighted (starts with ==)
          const isBold = word.startsWith("**") && word.endsWith("**")
          
          let displayWord: string
          let highlightStyle: React.CSSProperties = {}
          let highlightClassName = ""
          let parsed: { text: string; bgColor: string; isTailwind: boolean; tailwindClass?: string } | null = null
          
          if (isHighlight) {
            parsed = parseHighlight(word)
            displayWord = parsed.text
            
            if (parsed.isTailwind && parsed.tailwindClass) {
              // Use Tailwind class for background with glassmorphism
              highlightClassName = `px-2.5 py-1 ${parsed.tailwindClass}/20 rounded-xl backdrop-blur-xl border border-white/20 shadow-lg`
              highlightStyle = {
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
              }
            } else {
              // Use inline style for custom color with enhanced glassmorphism
              // Extract RGB values from rgba color and create glass effect
              const rgbaMatch = parsed.bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
              if (rgbaMatch) {
                const r = rgbaMatch[1]
                const g = rgbaMatch[2]
                const b = rgbaMatch[3]
                // Enhanced glassmorphism effect with more blur, glow, and depth
                highlightStyle = {
                  backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
                  backdropFilter: 'blur(20px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: `
                    0 8px 32px 0 rgba(${r}, ${g}, ${b}, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
                  `,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }
              } else {
                // Fallback for non-rgba colors
                highlightStyle = {
                  backgroundColor: parsed.bgColor,
                  backdropFilter: 'blur(20px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }
              }
              highlightClassName = "px-2.5 py-1 rounded-xl cursor-pointer"
            }
          } else if (isBold) {
            displayWord = word.slice(2, -2)
          } else {
            displayWord = word
          }

          // Check if this highlight is clickable
          const clickableUrl = isHighlight ? HIGHLIGHT_URLS[displayWord.toUpperCase()] : null
          const isClickable = clickableUrl !== undefined

          // Enhanced hover styles for clickable highlights
          const hoverStyle: React.CSSProperties = isHovered && isHighlight ? {
            transform: 'scale(1.05) translateY(-2px)',
            backgroundColor: highlightStyle.backgroundColor?.replace('0.15', '0.25').replace('0.2', '0.3') || highlightStyle.backgroundColor,
            boxShadow: highlightStyle.boxShadow?.toString().replace('0.25', '0.4').replace('0.2', '0.35') || highlightStyle.boxShadow,
            border: '1px solid rgba(255, 255, 255, 0.4)',
          } : {}

          const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
            setHoveredIndex(uniqueId)
            if (isClickable && isHighlight && parsed) {
              // Update mouse position immediately
              setMousePosition({ x: e.clientX, y: e.clientY })
              // Clear any existing timeout
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current)
              }
              // Show preview after a short delay
              hoverTimeoutRef.current = setTimeout(() => {
                setPreviewPosition({ x: e.clientX, y: e.clientY })
                setPreviewText(displayWord)
                setPreviewColor(parsed.bgColor)
              }, 200)
            }
          }

          const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
            if (isClickable && isHighlight && hoveredIndex === uniqueId) {
              setMousePosition({ x: e.clientX, y: e.clientY })
              if (previewPosition) {
                setPreviewPosition({ x: e.clientX, y: e.clientY })
              }
            }
          }

          const handleMouseLeave = () => {
            setHoveredIndex(null)
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current)
            }
            setPreviewPosition(null)
          }

          const handleClick = () => {
            if (isClickable && clickableUrl) {
              window.open(clickableUrl, '_blank')
            }
          }

          // Only add hover handlers and effects for highlighted text
          if (isHighlight) {
            return (
              <motion.span
                key={uniqueId}
                className={`inline-block transition-all duration-300 ${
                  isBold ? "font-bold" : ""
                } ${highlightClassName} ${isClickable ? "hover:scale-105" : ""}`}
                style={{ 
                  opacity: isDimmed ? 0.2 : 1,
                  ...highlightStyle,
                  ...hoverStyle
                }}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {displayWord}
              </motion.span>
            )
          }
          
          // Regular text - no hover effects but can be dimmed
          return (
            <span
              key={uniqueId}
              className={`inline-block transition-opacity duration-300 ${isBold ? "font-bold" : ""}`}
              style={{
                opacity: isDimmed ? 0.2 : 1,
              }}
            >
              {displayWord}
            </span>
          )
        })}
      </p>
    </div>
    </>
  )
}
