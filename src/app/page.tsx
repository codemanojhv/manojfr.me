"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white flex items-center justify-center">
      <div className="z-10 flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-center"
        >
          Explore the Cosmos
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link href="/universe">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-purple-600/20 border border-purple-500/50 rounded-lg backdrop-blur-sm hover:bg-purple-600/30 transition-all duration-300 text-center"
            >
              <div className="text-xl font-semibold">Universe</div>
              <div className="text-sm text-white/70 mt-1">Explore the stars</div>
            </motion.div>
          </Link>

          <Link href="/blackhole">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600/20 border border-blue-500/50 rounded-lg backdrop-blur-sm hover:bg-blue-600/30 transition-all duration-300 text-center"
            >
              <div className="text-xl font-semibold">Black Hole</div>
              <div className="text-sm text-white/70 mt-1">Enter the void</div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
    </main>
  )
}
