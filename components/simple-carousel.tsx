"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
    {
        id: 1,
        title: "CityPulse Revolution",
        subtitle: "Transforming urban issue reporting into a transparent, action‑driven civic process.",
        features: [
            "Department‑Based Reporting: Citizens select Road, Water, etc.",
            "Duplicate Detection: Locations grouped to increase urgency",
            "Real‑Time Tracking: Full visibility from Open to Resolved",
            "Public Accountability: Fixed timestamps, no silent deletions"
        ],
        gradient: "from-blue-900/90 to-cyan-900/90",
        image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2000"
    },
    {
        id: 2,
        title: "Smart Governance",
        subtitle: "Empowering departments with priority‑driven, data‑backed decision making.",
        features: [
            "Department‑Restricted Dashboards: Focus on relevant issues",
            "Priority‑Based Ordering: Prioritized by frequency and time",
            "Duplicate‑Free Management: Real public demand reflection",
            "Transparent Assignment: Tasks logged and assigned to staff"
        ],
        gradient: "from-indigo-900/90 to-purple-900/90",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
    },
    {
        id: 3,
        title: "Field Action Force",
        subtitle: "Enabling field staff with clear tasks, proof‑based resolution, and real‑time coordination.",
        features: [
            "Department‑Specific Allocation: Only relevant issues assigned",
            "Structured Workflow: Open → In Progress → On Hold → Resolved",
            "Proof‑of‑Work Uploads: Images required for verification",
            "Time‑Stamped Records: Permanent logs for audit tracking"
        ],
        gradient: "from-emerald-900/90 to-teal-900/90",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
    }
];

export function SimpleCarousel() {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((curr) => (curr + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <div className="relative w-full mb-16 px-4 md:px-8">
            {/* 
        Main Container - Increased max-width for wider slides
      */}
            <div className="relative w-full max-w-[1400px] mx-auto h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/20 group">

                {slides.map((slide, idx) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear scale-105 group-hover:scale-110"
                            />
                            {/* Gradient Overlay to ensure text readability */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} mix-blend-multiply`} />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-20 max-w-4xl">
                            <div className="animate-in slide-in-from-left-8 fade-in duration-700 delay-100">
                                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 shadow-sm drop-shadow-md">
                                    {slide.title}
                                </h2>
                                <h3 className="text-xl md:text-2xl font-medium text-white/90 mb-8 border-l-4 border-primary pl-4">
                                    {slide.subtitle}
                                </h3>
                            </div>

                            <div className="space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
                                <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-4">Key Features</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {slide.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-white/90 text-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                ))}

                {/* Bottom Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`transition-all duration-300 rounded-full backdrop-blur-sm ${current === idx
                                ? "w-12 h-2 bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "w-2 h-2 bg-white/40 hover:bg-white/80"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
