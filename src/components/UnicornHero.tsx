"use client"

import { useEffect } from "react"
import Script from "next/script"

export function UnicornHero() {
  useEffect(() => {
    // Ensure UnicornStudio is initialized when component mounts
    if (typeof window !== "undefined" && window.UnicornStudio && !window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init()
      window.UnicornStudio.isInitialized = true
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div 
        data-us-project="p1tRtRZVB953CevTQCGK" 
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      <Script
        id="unicorn-studio"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(){
              if(!window.UnicornStudio){
                window.UnicornStudio={isInitialized:!1};
                var i=document.createElement("script");
                i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.0/dist/unicornStudio.umd.js",
                i.onload=function(){
                  window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
                },
                (document.head || document.body).appendChild(i)
              }
            }();
          `
        }}
      />
    </div>
  )
}

declare global {
  interface Window {
    UnicornStudio: {
      isInitialized: boolean
      init: () => void
    }
  }
}
