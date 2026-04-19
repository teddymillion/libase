import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900 to-primary-900/40 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 px-6 pt-14 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
          </svg>
        </div>
        <span className="text-white font-display font-bold text-lg tracking-tight">Libase</span>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="space-y-6 max-w-sm">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
            <span className="text-white/80 text-xs font-medium">Smart Wardrobe Assistant</span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-bold text-white leading-tight">
              Dress better<br />
              with what<br />
              <span className="text-primary-400">you already own.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Upload your clothes. Get outfit ideas instantly. Feel confident every day.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#F97316","#8B5CF6","#10B981","#3B82F6"].map((c) => (
                <div key={c} className="w-7 h-7 rounded-full border-2 border-neutral-900" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-white/50 text-xs">Join thousands styling smarter</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full bg-primary-400 text-white font-bold text-base py-4 rounded-2xl text-center hover:bg-primary-500 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary-400/30"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="w-full bg-white/10 backdrop-blur-sm text-white font-semibold text-base py-4 rounded-2xl text-center hover:bg-white/15 active:scale-[0.98] transition-all duration-150 border border-white/10"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom feature strip */}
      <div className="relative z-10 border-t border-white/10 px-6 py-5">
        <div className="flex justify-between max-w-sm">
          {[
            { label: "AI Outfits",    icon: "✨" },
            { label: "Drip Score",    icon: "🔥" },
            { label: "Smart Closet",  icon: "👗" },
          ].map(({ label, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{icon}</span>
              <span className="text-white/50 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
