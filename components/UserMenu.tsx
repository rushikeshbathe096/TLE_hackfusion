
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { User, LogOut } from "lucide-react";

export default function UserMenu() {
    const { user, logout } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="User menu"
            >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border-2 border-border hover:border-primary/50 transition-all shadow-sm">
                    {getInitials(user.name || "")}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-border mb-2">
                        <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                        href="#" // Placeholder path for now
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <User size={16} />
                        <span>Profile <span className="text-xs text-muted-foreground ml-1">(50% complete)</span></span>
                    </Link>

                    <button
                        onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
