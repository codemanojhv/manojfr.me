import { notFound } from "next/navigation"
import Link from "next/link"
import { pageContent } from "@/lib/content"

// Force static generation for known paths
export function generateStaticParams() {
  return Object.keys(pageContent).map((slug) => ({
    slug,
  }))
}

export default function Page({ params }: { params: { slug: string } }) {
  const content = pageContent[params.slug]

  if (!content) {
    notFound()
  }

  return (
    <main className="min-h-screen w-full bg-black text-white p-6 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="uppercase tracking-widest text-xs">Back to Manifesto</span>
        </Link>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-purple-400 font-light tracking-wide">
              {content.subtitle}
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent" />

          <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="prose prose-invert prose-lg">
              <p className="text-xl leading-relaxed text-white/80">
                {content.description}
              </p>
              <p className="text-lg leading-relaxed text-white/60 mt-6">
                {content.content}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4">Related Tags</h3>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

