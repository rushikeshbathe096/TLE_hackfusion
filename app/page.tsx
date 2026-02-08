"use client";

import { ThemeLogo } from "@/components/theme-logo";
import { SimpleCarousel } from "@/components/simple-carousel";
import { ModeToggle } from "@/components/toggle-theme";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
// @ts-ignore
import Particles from "@/components/Particles";
import { ShieldCheck, Landmark, FileSearch } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import ImpactSection from "@/components/landing/ImpactSection";
import GeminiChatbot from "@/components/landing/GeminiChatbot";


export default function Home() {
  const { user, loading } = useUser();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">

      {/* Dark Mode Background Effect */}
      {mounted && resolvedTheme === "dark" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            particleCount={300}
            particleSpread={10}
            speed={0.1}
            particleColors={["#ffffff", "#ffffff", "#ffffff"]}
            moveParticlesOnHover={false}
            particleHoverFactor={1.7}
            alphaParticles={false}
            particleBaseSize={180}
            sizeRandomness={0.8}
            cameraDistance={50}
            disableRotation={false}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}

      {/* Light Mode Background Effect */}
      {mounted && resolvedTheme === "light" && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <Particles
            particleCount={300}
            particleSpread={10}
            speed={0.1}
            particleColors={["#3b82f6", "#8b5cf6", "#10b981"]} // Brand colors (Blue, Purple, Emerald)
            moveParticlesOnHover={false}
            particleHoverFactor={1.7}
            alphaParticles={false}
            particleBaseSize={180}
            sizeRandomness={0.8}
            cameraDistance={50}
            disableRotation={false}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}

      {/* Content wrapper with z-index to stay above background */}
      <div className="relative z-10">

        {/* NAVBAR */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            {/* Left: Logo / Name */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition"
            >
              <ThemeLogo className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight whitespace-nowrap">
                City Pulse
              </span>
            </Link>

            {/* Right: Auth buttons */}
            <div className="flex items-center gap-2 sm:gap-4 text-sm">
              <LanguageSwitcher />
              <ModeToggle />

              {!loading && user ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition whitespace-nowrap"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm whitespace-nowrap"
                  >
                    {t('nav.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-12 text-center">

          {/* Carousel */}
          <SimpleCarousel />

          {/* HERO SECTION */}
          <div className="mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 drop-shadow-sm break-words leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>



            <GeminiChatbot />

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('hero.cta_report')}
              </Link>
            </div>
          </div>

          {/* IMPACT & INSIGHTS SECTION */}
          <ImpactSection />

          {/* CARDS */}
          <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Built on Trust */}
            <div className="bg-card text-card-foreground rounded-2xl p-6 text-left ring-1 ring-border shadow-sm hover:shadow-md transition border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                {t('features.trust.title')}
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  {t('features.trust.desc1')}
                </p>
                <p>
                  {t('features.trust.desc2')}
                </p>
              </div>
            </div>

            {/* Designed for Authorities */}
            <div className="bg-card text-card-foreground rounded-2xl p-6 text-left ring-1 ring-border shadow-sm hover:shadow-md transition border-t-4 border-purple-500">
              <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <Landmark className="w-6 h-6" />
                {t('features.authority.title')}
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  {t('features.authority.desc1')}
                </p>
                <p>
                  {t('features.authority.desc2')}
                </p>
              </div>
            </div>

            {/* Powered by Transparency */}
            <div className="bg-card text-card-foreground rounded-2xl p-6 text-left ring-1 ring-border shadow-sm hover:shadow-md transition border-t-4 border-emerald-500">
              <h3 className="text-xl font-bold mb-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <FileSearch className="w-6 h-6" />
                {t('features.transparency.title')}
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  {t('features.transparency.desc1')}
                </p>
                <p>
                  {t('features.transparency.desc2')}
                </p>
              </div>
            </div>

          </section>
        </main>

        {/* FOOTER */}
        <footer className="text-center py-8 text-muted-foreground text-sm">
          {t('footer.rights')} • Built for Hackathons
        </footer>
      </div>
    </div>
  );
}
