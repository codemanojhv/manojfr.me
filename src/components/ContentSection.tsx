"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"

interface ContentSectionProps {
  text: string
  sliderValue: number
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

export function ContentSection({ text, sliderValue }: ContentSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null)
  const [windowWidth, setWindowWidth] = useState(1200) // Use consistent initial value
  const [isMounted, setIsMounted] = useState(false)

  // Track window width for responsive calculations (only on client after mount)
  useEffect(() => {
    setIsMounted(true)
    const updateWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
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
    allWordsArray.forEach((wordData) => {
      // First few words always visible
      if (wordData.globalIndex < 3) {
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

          if (!isVisible && wordData.globalIndex > 2) {
            return null
          }

          const isHovered = hoveredIndex === uniqueId
          const isDimmed = hoveredIndex !== null && !isHovered

          if (isImageToken(word)) {
            const src = word.startsWith("/") ? word : `/media/${word}`
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

          if (isEmojiToken(word)) {
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
          const isHighlight = word.startsWith("==") && word.endsWith("==")
          
          let displayWord: string
          let highlightStyle: React.CSSProperties = {}
          let highlightClassName = ""
          
          if (isHighlight) {
            const parsed = parseHighlight(word)
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
              // Use inline style for custom color with glassmorphism
              // Extract RGB values from rgba color and create glass effect
              const rgbaMatch = parsed.bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
              if (rgbaMatch) {
                const r = rgbaMatch[1]
                const g = rgbaMatch[2]
                const b = rgbaMatch[3]
                // Create glassmorphism effect with multiple layers
                highlightStyle = {
                  backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: `0 8px 32px 0 rgba(${r}, ${g}, ${b}, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)`,
                }
              } else {
                // Fallback for non-rgba colors
                highlightStyle = {
                  backgroundColor: parsed.bgColor,
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
                }
              }
              highlightClassName = "px-2.5 py-1 rounded-xl"
            }
          } else if (isBold) {
            displayWord = word.slice(2, -2)
          } else {
            displayWord = word
          }

          return (
            <span
              key={uniqueId}
              className={`inline-block transition-all duration-200 ${
                isBold ? "font-bold" : ""
              } ${highlightClassName}`}
              style={{ 
                opacity: isDimmed ? 0.2 : 1,
                ...highlightStyle
              }}
            >
              {displayWord}
            </span>
          )
        })}
      </p>
    </div>
  )
}

