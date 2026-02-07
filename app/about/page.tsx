
"use client";

import { Info, Shield, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
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
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Secure & Transparent</h3>
                        <p className="text-muted-foreground text-sm">
                            Every report is logged immutably. We believe in complete transparency in civic administration.
                        </p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Community Driven</h3>
                        <p className="text-muted-foreground text-sm">
                            Prioritizing issues based on community impact. The more voices, the faster the resolution.
                        </p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 mb-4">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">City-Wide Coverage</h3>
                        <p className="text-muted-foreground text-sm">
                            Connecting all departments - Road, Water, Electricity, and Sanitation - under one roof.
                        </p>
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden">
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
