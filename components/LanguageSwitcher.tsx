"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: "en", label: "English", native: "English" },
        { code: "hi", label: "Hindi", native: "हिंदी" },
        { code: "mr", label: "Marathi", native: "मराठी" },
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative z-10 inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300
                    ${isOpen
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                    }
                    border border-slate-200 dark:border-slate-800
                `}
                aria-label="Toggle language"
            >
                <div className="flex items-baseline font-bold">
                    <span className={`text-sm transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>A</span>
                    <span className={`text-lg ml-0.5 transition-transform duration-300 ${isOpen ? 'scale-125 -rotate-12' : ''}`}>अ</span>
                </div>
            </button>

            {/* Dropdown with crazy glassmorphism and animation */}
            <div
                className={`
                    absolute right-0 mt-3 w-56 origin-top-right rounded-2xl 
                    bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl 
                    shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
                    ring-1 ring-slate-200 dark:ring-slate-800
                    transform transition-all duration-300 ease-out
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 visible'
                        : 'opacity-0 scale-95 -translate-y-4 invisible pointer-events-none'
                    }
                    overflow-hidden
                `}
            >
                <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Select Language / भाषा चुनें
                    </div>

                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code as any);
                                setIsOpen(false);
                            }}
                            className={`
                                group relative flex items-center w-full px-3 py-3 text-sm rounded-xl transition-all duration-200
                                ${language === lang.code
                                    ? "bg-gradient-to-r from-amber-500/10 to-transparent text-amber-700 dark:text-amber-400 font-medium"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:pl-4"
                                }
                            `}
                        >
                            <span className="flex-1 flex flex-col items-start">
                                <span className="text-base">{lang.native}</span>
                                <span className="text-[10px] opacity-60 uppercase">{lang.label}</span>
                            </span>

                            {language === lang.code && (
                                <Check className="w-4 h-4 text-amber-500 animate-in fade-in zoom-in duration-300" />
                            )}

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
