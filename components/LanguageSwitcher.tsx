"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = {
        en: "English",
        hi: "हिंदी (Hindi)",
        mr: "मराठी (Marathi)",
    };

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
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle language"
            >
                <Languages className="h-[1.2rem] w-[1.2rem]" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-slate-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setLanguage("en");
                                setIsOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-sm text-left ${language === "en"
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => {
                                setLanguage("hi");
                                setIsOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-sm text-left ${language === "hi"
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            हिंदी
                        </button>
                        <button
                            onClick={() => {
                                setLanguage("mr");
                                setIsOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-sm text-left ${language === "mr"
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            मराठी
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
