"use client";

import ComplaintForm from "@/components/issues/ComplaintForm";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

export default function ComplainPage() {
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

            <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 p-1">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
                    <p className="text-muted-foreground mt-2">
                        Submit a new complaint regarding infrastructure issues. Please provide accurate details.
                    </p>
                </div>

                <ComplaintForm />
            </div>
        </div>
    );
}
