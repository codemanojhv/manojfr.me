
export interface PageContent {
  title: string
  subtitle: string
  description: string
  content: string
  tags: string[]
}

export const pageContent: Record<string, PageContent> = {
  chaos: {
    title: "Controlled Chaos",
    subtitle: "Where the best ideas are born",
    description: "Entropy isn't the enemy. It's the raw material.",
    content: "Most people try to organize their lives into neat little boxes. I prefer to let the boxes burn and see what shapes the ashes make. Chaos is where pattern recognition thrives. It's about surfing the noise to find the signal.",
    tags: ["Entropy", "Design", "Systems"],
  },
  mind: {
    title: "The Mind Palace",
    subtitle: "Fighting Gods in my head",
    description: "A constant battlefield of ideas and contradictions.",
    content: "My internal monologue is less of a stream of consciousness and more of a mosh pit. I'm constantly debating myself, tearing down my own assumptions, and rebuilding them from scratch. It's exhausting. It's necessary.",
    tags: ["Philosophy", "Cognition", "Mental Models"],
  },
  projects: {
    title: "Alternate Timelines",
    subtitle: "Things that shouldn't exist, but do",
    description: "A graveyard of experiments and a garden of products.",
    content: "Every project is an attempt to pull a piece of a different reality into this one. Some survive. Some don't. But every single one of them teaches me something about the physics of creation.",
    tags: ["Dev", "Product", "Experiments"],
  },
  code: {
    title: "Tech Necromancy",
    subtitle: "Resurrecting dead code",
    description: "Code is just modern-day spellcasting.",
    content: "I don't just write code; I negotiate with logic. Sometimes it cooperates, sometimes it demands a sacrifice. The goal isn't just function—it's elegance, efficiency, and a little bit of black magic.",
    tags: ["TypeScript", "Rust", "AI"],
  },
  alive: {
    title: "Violently Alive",
    subtitle: "F*ck being an NPC",
    description: "Life is a participation sport.",
    content: "Passive existence is the default settings. I'm here to mess with the config files. Feeling everything—the highs, the lows, the burnout, the breakthroughs—is the only way to know you're actually running the simulation, not just part of it.",
    tags: ["Lifestyle", "Mindset", "Action"],
  },
  universe: {
    title: "The Universe",
    subtitle: "Staring contest with the void",
    description: "It's hiding answers.",
    content: "Physics, cosmology, the nature of reality. The more you look, the weirder it gets. I'm obsessed with the fundamental laws that govern us, and how we can bend them (metaphorically, mostly).",
    tags: ["Physics", "Cosmology", "Wonder"],
  },
  learn: {
    title: "Loud Failures",
    subtitle: "Crash testing reality",
    description: "If you're not breaking things, you're not moving fast enough.",
    content: "I wear my failures like badges of honor. Each one is a data point. A lesson absorbed. I'd rather crash at 100mph than rust in the driveway.",
    tags: ["Growth", "Failure", "Learning"],
  },
  magic: {
    title: "Magic",
    subtitle: "The intersection of art and tech",
    description: "Any sufficiently advanced technology...",
    content: "Magic is just engineering you don't understand yet. My goal is to build things that make people wonder 'how?'. That moment of awe is the highest ROI you can get.",
    tags: ["UI/UX", "Experience", "Awe"],
  },
}

