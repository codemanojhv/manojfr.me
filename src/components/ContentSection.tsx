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
      const displayWord = isHighlight 
        ? wordData.word.slice(2, -2) 
        : isBold 
        ? wordData.word.slice(2, -2) 
        : wordData.word
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
          const displayWord = isBold ? word.slice(2, -2) : isHighlight ? word.slice(2, -2) : word

          return (
            <span
              key={uniqueId}
              className={`inline-block transition-opacity duration-200 ${
                isBold ? "font-bold" : ""
              } ${
                isHighlight 
                  ? "px-2 py-1 bg-white/20 rounded-lg backdrop-blur-sm" 
                  : ""
              }`}
              style={{ opacity: isDimmed ? 0.2 : 1 }}
            >
              {displayWord}
            </span>
          )
        })}
      </p>
    </div>
  )
}

