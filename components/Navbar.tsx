
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
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

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4 md:px-8 shadow-lg">

            {/* Left: Logo and Name (offset for sidebar toggle on mobile/desktop) */}
            <div className="flex items-center gap-3 ml-14 md:ml-20 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">
                        SP
                    </div>
                    <span className="font-bold text-lg text-white tracking-wide hidden sm:block">CityPulse</span>
                </div>
            </div>

            {/* Right: User Profile */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/10 hover:border-white/30 transition-all shadow-lg">
                        {getInitials(user?.name || "")}
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-3 border-b border-white/10 mb-2">
                            <p className="text-sm text-white font-medium truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-white/50 truncate">{user?.email}</p>
                        </div>

                        <Link
                            href="/dashboard/profile" // Placeholder path for now
                            className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <User size={16} />
                            <span>Profile <span className="text-xs text-white/40 ml-1">(50% complete)</span></span>
                        </Link>

                        <button
                            onClick={() => {
                                setIsDropdownOpen(false);
                                logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
