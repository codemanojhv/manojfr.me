"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "LinkedIn", href: "https://linkedin.com/in/manoj" }, // Placeholder
  { label: "Instagram", href: "https://instagram.com/manoj" }, // Placeholder
  { label: "YouTube", href: "https://youtube.com/@manoj" }, // Placeholder
  { label: "Blud", href: "#" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 right-0 z-50 p-4 sm:p-5 lg:p-10 lg:pr-20">
      <div className="flex flex-col items-end gap-2 sm:gap-3 lg:flex-row lg:gap-6">
        {navLinks.map((link, index) => {
          const isActive = pathname === link.href
          
          // Don't show Home link if we are already on home
          if (link.href === "/" && pathname === "/") return null

          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link
                href={link.href}
                className={`text-[10px] font-medium uppercase tracking-wider transition-all duration-300 sm:text-xs lg:text-sm ${
                  isActive ? "text-white" : "text-white/50 hover:text-white/100"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </nav>
  )
}
