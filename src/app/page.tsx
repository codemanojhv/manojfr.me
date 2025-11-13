"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Navigation } from "@/components/Navigation"
import { ContentSection } from "@/components/ContentSection"

const narrativeText = `HI, I'M MANOJ 🧍‍♂️

THE DUDE IN COLLEGE WHO LOOKS LIKE HE'S FREESTYLING LIFE

BUT LOWKEY ==purple:FIGHTS GODS IN HIS HEAD== ⚔️

==red:CHAOS== ISN'T AN ACCIDENT

IT'S THE ==cyan:CO-PILOT== 🚀 

BUILDS THINGS THAT FEEL ==cyan:STOLEN FROM ALTERNATE TIMELINES==

BREAKS THEM FOR FUN

RESURRECTS THEM LIKE A ==violet:TECH NECROMANCER== 💀⚡

DESIGNING 🎨

CODING 💻

PAINTING 🖌️

WRITING ✍️

GAMING 🎮

WHATEVER THE BRAIN DEMANDS THAT DAY 🧠

PEOPLE CALL IT "LACK OF FOCUS"

BUT IT LOOKS MORE LIKE BEING ==red:VIOLENTLY ALIVE== 🔥

THE ==purple:UNIVERSE== GETS STARED AT

LIKE IT'S HIDING ANSWERS 🪐

==purple:BLACK HOLES== STILL MAKE MORE SENSE THAN HUMANS ⚫

==orange:FAILURES== GET MADE LOUDLY 🔊

LESSONS GET ABSORBED QUICK

AND WORLDS GET BUILT THAT NEVER EXISTED BEFORE ✨

LIFE HAS TWO MODES:

**NPC OR SUFFER.**

THE CHOICE? SUFFERING.

BECAUSE THAT'S WHERE THE MAGIC HIDES ☠️

==red:F*CK== NORMAL

I WANT ==purple:MAGIC== ✨`

export default function Home() {
  const [sliderValue, setSliderValue] = useState([0])

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value)
  }

  return (
    <main className="relative h-screen h-dvh w-screen w-dvw overflow-hidden bg-black">
      <Navigation />
      
      {/* Content Sections - Full width, centered like anikjain.com */}
      <div className="absolute inset-0 flex items-center justify-center pb-32 overflow-hidden">
        <div className="w-full flex flex-col justify-center">
          <ContentSection text={narrativeText} sliderValue={sliderValue[0]} />
        </div>
      </div>

      {/* Portrait Placeholder - will be replaced with actual image */}
      <motion.div
        className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 xl:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: sliderValue[0] > 5 ? 0.15 : 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm xl:h-28 xl:w-28"></div>
      </motion.div>

      {/* Slider - Bottom Centered - Increased padding on mobile for better visibility */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex justify-center px-5 pb-20 sm:pb-8 lg:pb-12">
        <div className="w-full max-w-[90%] sm:max-w-[85%] lg:max-w-[80%]">
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            min={0}
            max={100}
            step={0.1}  
            className="w-full"
            aria-label="Narrative control"
          />
        </div>
      </div>
    </main>
  )
}

