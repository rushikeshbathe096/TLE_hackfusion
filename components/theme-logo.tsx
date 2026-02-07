"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

export function ThemeLogo({ className }: { className?: string }) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Default to light logo (city_logo2.png) during SSR to avoid hydration mismatch
    const logoSrc = mounted && resolvedTheme === "dark" ? "/city_logo3.png" : "/city_logo2.png"

    return (
        <div className={`relative ${className}`}>
            <Image
                src={logoSrc}
                alt="City Pulse Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}
