"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n/translations";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && (savedLang === "en" || savedLang === "hi" || savedLang === "mr")) {
            setLanguage(savedLang);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("language", language);
        }
    }, [language, mounted]);

    const t = (key: string) => {
        const keys = key.split(".");
        let value: any = translations[language];
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
