"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { HoverPreview } from "@/components/HoverPreview"
import {
  isImageToken,
  isEmojiToken,
  getIllustration,
  parseHighlight,
  HIGHLIGHT_URLS
} from "@/lib/text-utils"

interface ContentSectionProps {
  text: string
  sliderValue: number
}

export function ContentSection({ text, sliderValue }: ContentSectionProps) {
  const router = useRouter()
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

  // Staggered entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

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
        <motion.p
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          suppressHydrationWarning
          className={`flex flex-wrap gap-x-3 gap-y-2 text-base leading-8 uppercase tracking-wide font-medium text-white lg:text-[1.5vw] lg:leading-[1.6] transition-all duration-700 drop-shadow-md ${shouldJustify ? "content-text" : ""
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
                    variants={itemVariants}
                    className="inline-flex items-center justify-center align-middle mx-1"
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
                      className="h-12 w-auto sm:h-16 lg:h-[4.5vw] object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                    />
                  </motion.span>
                )
              }

              return (
                <motion.span
                  key={uniqueId}
                  variants={itemVariants}
                  className="inline-flex items-center"
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
                    className="h-8 w-auto sm:h-10 lg:h-[2.8vw] object-contain drop-shadow-md"
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
                    variants={itemVariants}
                    className="inline-flex items-center justify-center align-text-bottom"
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      opacity: isDimmed ? 0.2 : 1,
                      rotate: isHovered ? 10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 520, damping: 24 }}
                    onMouseEnter={() => setHoveredIndex(uniqueId)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Illustration className="h-6 w-6 sm:h-8 sm:w-8 lg:h-[2vw] lg:w-[2vw] drop-shadow-md" />
                  </motion.span>
                )
              }

              return (
                <motion.span
                  key={uniqueId}
                  variants={itemVariants}
                  className="inline-block"
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
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: `
                    0 8px 32px 0 rgba(${r}, ${g}, ${b}, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
                  `,
                    textShadow: `0 0 20px rgba(${r}, ${g}, ${b}, 0.5)`,
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
                if (clickableUrl.startsWith('/')) {
                  router.push(clickableUrl)
                } else {
                  window.open(clickableUrl, '_blank')
                }
              }
            }

            // Only add hover handlers and effects for highlighted text
            if (isHighlight) {
              return (
                <motion.span
                  key={uniqueId}
                  variants={itemVariants}
                  className={`inline-block transition-all duration-300 ${isBold ? "font-bold" : ""
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
              <motion.span
                key={uniqueId}
                variants={itemVariants}
                className={`inline-block transition-opacity duration-300 ${isBold ? "font-bold" : ""}`}
                style={{
                  opacity: isDimmed ? 0.2 : 1,
                }}
              >
                {displayWord}
              </motion.span>
            )
          })}
        </motion.p>
      </div>
    </>
  )
}
