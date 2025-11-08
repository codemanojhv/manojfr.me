"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const navLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Blud", href: "#" },
]

export function Navigation() {
  return (
    <nav className="fixed top-0 right-0 z-50 p-4 sm:p-5 lg:p-10 lg:pr-20">
      <div className="flex flex-col items-end gap-2 sm:gap-3 lg:flex-row lg:gap-6">
        {navLinks.map((link, index) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <Link
              href={link.href}
              className="text-[10px] font-medium uppercase tracking-wider text-white/50 transition-all duration-300 hover:text-white/100 sm:text-xs lg:text-sm"
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </nav>
  )
}

