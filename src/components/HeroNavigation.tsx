"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const navLinks = [
  { label: "Universe", href: "/universe" },
  { label: "Blackhole", href: "/blackhole" },
]

export function HeroNavigation() {
  return (
    <nav className="fixed top-3 right-3 z-[60] sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 safe-area-inset">
      <ul className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {navLinks.map((link, index) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
          >
            <Link
              href={link.href}
              className="
                block
                text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg
                font-semibold 
                uppercase 
                tracking-wider 
                text-white/80 
                transition-all 
                duration-300 
                hover:text-white 
                active:scale-95
                sm:hover:scale-105 
                backdrop-blur-sm 
                bg-white/5 
                hover:bg-white/10
                px-2.5 py-1.5
                sm:px-3 sm:py-2 
                md:px-4 md:py-2.5
                lg:px-5 lg:py-3
                rounded-md
                sm:rounded-lg 
                border 
                border-white/10 
                hover:border-white/30
                touch-manipulation
                select-none
                whitespace-nowrap
              "
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}
