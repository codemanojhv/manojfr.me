"use client"

import { UnicornHero } from "@/components/UnicornHero"
import { HeroNavigation } from "@/components/HeroNavigation"

export default function Home() {
  return (
    <main className="relative h-screen h-dvh w-screen w-dvw overflow-hidden bg-black">
      {/* UnicornStudio Hero Background */}
      <UnicornHero />

      {/* Hero Navigation - Top Right */}
      <HeroNavigation />
    </main>
  )
}

