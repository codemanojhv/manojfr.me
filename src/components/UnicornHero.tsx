"use client"

import { useEffect, useRef, useState } from "react"

export function UnicornHero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const scriptLoadedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Prevent double loading in development mode (React Strict Mode)
    if (scriptLoadedRef.current) return
    scriptLoadedRef.current = true

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="unicornstudio"]')
    if (existingScript) {
      // Script already loaded, just initialize if needed
      if (typeof window !== "undefined" && window.UnicornStudio) {
        if (!window.UnicornStudio.isInitialized) {
          try {
            window.UnicornStudio.init()
            window.UnicornStudio.isInitialized = true
          } catch (error) {
            console.error("Failed to initialize UnicornStudio:", error)
            setHasError(true)
          }
        }
        setIsLoaded(true)
      }
      return
    }

    // Initialize window.UnicornStudio if it doesn't exist
    if (typeof window !== "undefined" && !window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} }
    }

    // Load UnicornStudio script
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.0/dist/unicornStudio.umd.js"
    script.async = true
    
    script.onload = () => {
      if (typeof window !== "undefined" && window.UnicornStudio) {
        if (!window.UnicornStudio.isInitialized) {
          try {
            // Wait a bit for the script to be fully ready
            setTimeout(() => {
              if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
                window.UnicornStudio.init()
                window.UnicornStudio.isInitialized = true
                setIsLoaded(true)
              }
            }, 100)
          } catch (error) {
            console.error("Failed to initialize UnicornStudio:", error)
            setHasError(true)
          }
        } else {
          setIsLoaded(true)
        }
      }
    }
    
    script.onerror = (error) => {
      console.error("Failed to load UnicornStudio script:", error)
      setHasError(true)
    }
    
    document.head.appendChild(script)

    return () => {
      // Cleanup handled by UnicornStudio
    }
  }, [])

  if (hasError) {
    return (
      <div className="relative w-full h-screen h-dvh overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <p className="text-white/30 text-xs sm:text-sm text-center">Background animation unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen h-dvh overflow-hidden"
    >
      <div 
        data-us-project="p1tRtRZVB953CevTQCGK" 
        className="w-full h-full min-h-screen min-h-dvh"
        style={{
          width: '100vw',
          height: '100vh',
          minHeight: '100dvh',
          position: 'relative'
        }}
      />
    </div>
  )
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean
      init: () => void
    }
  }
}
