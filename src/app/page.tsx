"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Navigation } from "@/components/Navigation"
import { ContentSection } from "@/components/ContentSection"

const narrativeText = `HI, I'M MANOJ 🧍‍♂️

I'M IN COLLEGE

JUST FREESTYLING LIFE AT THIS POINT.

I'M IN LOVE WITH CHAOS.

I BUILD SHIT

BREAK IT

FIX IT

AND ACT LIKE THAT WAS ALWAYS THE PLAN.

I DESIGN

I CODE 

I PAINT

I WRITE

I GAME 🎮

PEOPLE CALL IT "LACK OF FOCUS"

I CALL IT BEING ==green:ALIVE==.

I LOVE WHAT I DO ❤️

I DON'T CHASE PERFECT

I CHASE WHAT MY HEART WANTS.

I GET OBSESSED WITH HOW THINGS WORK
  
IN TECH
 
AND IN PEOPLE 🧠

SOMETIMES I STARE AT THE ==purple:UNIVERSE==

LIKE IT BETTER EXPLAIN ITSELF 🪐

BLACK HOLES MAKE MORE SENSE THAN HUMANS.

I LEARN BY MESSING UP.

I ==red:F*CK== AROUND, 

FLOP,

ADJUST &

RUN IT BACK 🔁

I BUILD 
   
STUFF I WANTED TO EXIST

LIFE'S BASICALLY:

**BE AN NPC OR SUFFER.**

I'D RATHER SUFFER. ☠️`

export default function Home() {
  const [sliderValue, setSliderValue] = useState([0])

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
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

      {/* Slider - Bottom Centered */}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex justify-center px-5 pb-6 sm:pb-8 lg:pb-12">
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

