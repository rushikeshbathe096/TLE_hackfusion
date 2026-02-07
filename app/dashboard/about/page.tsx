"use client";

import { Info, Shield, Users, Globe } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

export default function AboutPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = mounted && resolvedTheme === 'light';

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-30' : 'opacity-100'}`}>
                <Galaxy
                    starSpeed={0.5}
                    density={1}
                    hueShift={isLight ? 200 : 140}
                    speed={1}
                    glowIntensity={isLight ? 0.1 : 0.3}
                    saturation={0}
                    mouseRepulsion
                    repulsionStrength={2}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    transparent
                />
            </div>

            <div className="relative z-10 container mx-auto max-w-4xl animate-in fade-in duration-500 p-1">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Info size={32} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">About CityPulse</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Empowering citizens to build better communities through transparent issue reporting and efficient resolution.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Secure & Transparent</h3>
                        <p className="text-muted-foreground text-sm">
                            Every report is logged immutably. We believe in complete transparency in civic administration.
                        </p>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Community Driven</h3>
                        <p className="text-muted-foreground text-sm">
                            Prioritizing issues based on community impact. The more voices, the faster the resolution.
                        </p>
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 mb-4">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">City-Wide Coverage</h3>
                        <p className="text-muted-foreground text-sm">
                            Connecting all departments - Road, Water, Electricity, and Sanitation - under one roof.
                        </p>
                    </div>
                </div>

                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border overflow-hidden">
                    <div className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            CityPulse was born from a simple idea: that every citizen deserves a voice in the maintenance of their city.
                            We bridge the gap between the public and municipal authorities, ensuring that infrastructure issues
                            are not just reported, but resolved efficiently. By leveraging technology, we create a direct line of
                            communication that holds authorities accountable and keeps citizens informed.
                        </p>
                        <div className="flex justify-center">
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
