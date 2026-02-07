import { ThemeLogo } from "@/components/theme-logo";
import { SimpleCarousel } from "@/components/simple-carousel";
import { ModeToggle } from "@/components/toggle-theme";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* NAVBAR */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Left: Logo / Name */}
        <a
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <ThemeLogo className="w-12 h-12" />
          <span className="text-xl font-bold text-foreground tracking-tight">
            City Pulse
          </span>
        </a>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-4 text-sm">
          <ModeToggle />
          <a
            href="/login"
            className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            Sign up
          </a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-12 text-center">

        {/* Carousel */}
        <SimpleCarousel />

        {/* Greeting */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Welcome to City Pulse
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Raise civic issues. Amplify local voices. Drive real change.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-cyan-600 text-white font-semibold shadow-lg hover:bg-cyan-700 transition"
          >
            Raise a Problem
          </a>
        </div>

        {/* CARDS */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* About Us */}
          <div className="bg-card text-card-foreground rounded-2xl p-6 text-left ring-1 ring-border shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              About Us
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              City Pulse is a platform that empowers citizens to report and
              track real-world civic issues in their city.
            </p>
          </div>

          {/* Our Use */}
          <div className="bg-card text-card-foreground rounded-2xl p-6 text-left ring-1 ring-border shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              Our Use
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Report potholes, water issues, streetlight failures, or safety
              concerns and help authorities prioritize action.
            </p>
          </div>

          {/* Testimonials */}
          <div className="bg-card text-card-foreground rounded-2xl p-6 text-left ring-1 ring-border shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              Testimonials
            </h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              “City Pulse made it easy to raise issues that actually got noticed.”
            </p>
            <span className="mt-2 block text-xs text-muted-foreground">
              — Early User
            </span>
          </div>

        </section>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} City Pulse • Built for Hackathons
      </footer>
    </div>
  );
}
