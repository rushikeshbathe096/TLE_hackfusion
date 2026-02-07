"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: 1,
        title: "Report Issues Instantly",
        description: "Spot a pothole or broken streetlight? Snap a photo and report it in seconds.",
        color: "bg-blue-500/10",
        textColor: "text-blue-600 dark:text-blue-400"
    },
    {
        id: 2,
        title: "Track Progress Real-time",
        description: "Get live updates as authorities verify and resolve your reported issues.",
        color: "bg-amber-500/10",
        textColor: "text-amber-600 dark:text-amber-400"
    },
    {
        id: 3,
        title: "Make Your City Better",
        description: "Join thousands of citizens working together to build a cleaner, safer community.",
        color: "bg-emerald-500/10",
        textColor: "text-emerald-600 dark:text-emerald-400"
    }
];

export function SimpleCarousel() {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((curr) => (curr + 1) % slides.length);
    }, []);

    const prev = () => {
        setCurrent((curr) => (curr - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(next, 5000); // Auto-slide every 5 seconds
        return () => clearInterval(timer);
    }, [next]);

    return (
        <div className="relative w-full max-w-3xl mx-auto mb-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className={`w-full flex-shrink-0 p-8 sm:p-12 text-center ${slide.color}`}>
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${slide.textColor}`}>
                            {slide.title}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                            {slide.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background border border-border shadow-sm transition-all"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 opacity-70" />
            </button>

            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 hover:bg-background border border-border shadow-sm transition-all"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 opacity-70" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${current === idx
                                ? "bg-primary w-6"
                                : "bg-primary/20 hover:bg-primary/40"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
