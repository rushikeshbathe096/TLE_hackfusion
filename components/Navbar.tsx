"use client";

import Link from "next/link";
import { ThemeLogo } from "@/components/theme-logo";
import UserMenu from "@/components/UserMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-xl border-b border-border z-40 flex items-center justify-between px-4 md:px-8 shadow-sm">

            {/* Left: Logo and Name */}
            {/* Adjusted margin to avoid overlap with fixed sidebar hamburger */}
            <div className="flex items-center gap-3 ml-24 transition-all duration-300">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <ThemeLogo className="w-8 h-8" />
                    <span className="font-bold text-lg text-foreground tracking-wide hidden sm:block">CityPulse</span>
                </Link>
            </div>

            {/* Right: User Profile */}
            <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <UserMenu />
            </div>
        </nav>
    );
}
