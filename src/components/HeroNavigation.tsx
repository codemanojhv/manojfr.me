"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const navLinks = [
  { label: "Universe", href: "/universe" },
  { label: "Blackhole", href: "/blackhole" },
]

export function HeroNavigation() {
  return (
    <nav className="fixed top-4 right-4 z-[60] sm:top-6 sm:right-6 lg:top-8 lg:right-8">
      <ul className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        {navLinks.map((link, index) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
          >
            <Link
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-white/80 transition-all duration-300 hover:text-white hover:scale-105 sm:text-sm lg:text-base backdrop-blur-sm bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-white/30"
            >
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}
