"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GoogleSignInButton() {
    const { t } = useLanguage();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGoogleSignIn = () => {
        window.location.href = "/api/auth/google";
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-background border border-input hover:bg-accent hover:text-accent-foreground text-foreground font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
        >
            {mounted ? (
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
            ) : (
                <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
            )}
            Sign in with Google
        </button>
    );
}
