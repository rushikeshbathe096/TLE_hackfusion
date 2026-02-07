export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#001e3c] to-[#001219] text-white antialiased">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center ring-1 ring-white/10">SP</div>
          <span className="font-semibold text-lg">S.P.I.T Hackfusion</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <a href="/login" className="ml-4 px-4 py-2 hover:text-white">Sign in</a>
          <a href="/signup" className="ml-2 rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">Sign up</a>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center gap-12">
        <section className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Build fast. Ship faster.
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl">
            A polished starter landing page for your hackathon project — crafted to impress judges and users alike. Responsive, modern, and ready-to-demo.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a href="/signup" className="inline-flex items-center gap-3 bg-cyan-900 text-amber-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:brightness-95">
              Get Started
            </a>
            <a href="#features" className="inline-flex items-center gap-3 bg-cyan-900 border border-white/10 px-5 py-3 rounded-lg text-white/90 hover:bg-white/5">
              See features
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/80">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="font-semibold">Lightning fast</div>
              <div className="mt-1 text-xs">Optimized for performance and demo-ready.</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="font-semibold">Responsive</div>
              <div className="mt-1 text-xs">Looks great on phones, tablets, and desktops.</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="font-semibold">Beautiful design</div>
              <div className="mt-1 text-xs">Modern UI components and accessible colors.</div>
            </div>
          </div>
        </section>

        <aside className="w-full md:w-1/2 flex justify-center">
          <div className="w-[360px] h-[280px] bg-gradient-to-tr from-white/6 to-white/3 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <svg viewBox="0 0 800 520" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="10" width="780" height="500" rx="20" fill="url(#g)" opacity="0.18"/>
              <g transform="translate(40,40)">
                <rect x="0" y="0" width="320" height="200" rx="12" fill="#fff" opacity="0.06" />
                <rect x="16" y="16" width="64" height="10" rx="4" fill="#fff" opacity="0.14" />
                <rect x="16" y="40" width="280" height="10" rx="4" fill="#fff" opacity="0.08" />
                <rect x="16" y="64" width="160" height="10" rx="4" fill="#fff" opacity="0.08" />
                <rect x="0" y="220" width="320" height="80" rx="12" fill="#fff" opacity="0.04" />
              </g>
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stop-color="#fff" stop-opacity="0.06" />
                  <stop offset="1" stop-color="#fff" stop-opacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </aside>
      </main>

      <section id="features" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/6 rounded-2xl p-6">
            <h3 className="font-semibold">Realtime-ready</h3>
            <p className="mt-2 text-sm text-white/80">Plug in WebSockets or serverless functions to show live updates during demo.</p>
          </div>
          <div className="bg-white/6 rounded-2xl p-6">
            <h3 className="font-semibold">Integrations</h3>
            <p className="mt-2 text-sm text-white/80">Prepped for databases, auth providers, and deployment platforms.</p>
          </div>
          <div className="bg-white/6 rounded-2xl p-6">
            <h3 className="font-semibold">Accessible</h3>
            <p className="mt-2 text-sm text-white/80">High-contrast, readable typography, and keyboard-friendly components.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className="max-w-6xl mx-auto px-6 py-8 text-center text-white/70">
        <div>Built for the hackathon — good luck! • <a href="#" className="text-white/90 underline">Demo</a></div>
      </footer>
    </div>
  );
}
