"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export function SimpleCarousel() {
    const { t } = useLanguage();
    const [current, setCurrent] = useState(0);

    const slides = [
        {
            id: 1,
            title: t('slides.revolution.title'),
            subtitle: t('slides.revolution.subtitle'),
            features: t('slides.revolution.features'), // features is an array in translations
            gradient: "from-blue-900/90 to-cyan-900/90",
            image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2000"
        },
        {
            id: 2,
            title: t('slides.governance.title'),
            subtitle: t('slides.governance.subtitle'),
            features: t('slides.governance.features'),
            gradient: "from-indigo-900/90 to-purple-900/90",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
        },
        {
            id: 3,
            title: t('slides.force.title'),
            subtitle: t('slides.force.subtitle'),
            features: t('slides.force.features'),
            gradient: "from-emerald-900/90 to-teal-900/90",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
        }
    ];

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
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 shadow-sm drop-shadow-md break-words">
                                    {slide.title}
                                </h2>
                                <h3 className="text-xl md:text-2xl font-medium text-white/90 mb-8 border-l-4 border-primary pl-4">
                                    {slide.subtitle}
                                </h3>
                            </div>

                            <div className="space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
                                <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-4">Key Features</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {(slide.features as string[]).map((feature: string, i: number) => (
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
