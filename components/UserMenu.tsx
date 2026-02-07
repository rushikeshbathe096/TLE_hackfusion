
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

    const calculateProgress = () => {
        if (!user) return 0;
        let fields = [];
        // Basic fields for everyone
        if (user.role === 'citizen') {
            fields = [user.name, user.dob, user.email, user.phoneNumber, user.address, user.profileImage];
        } else {
            fields = [user.name, user.dob, user.email, user.profileImage, user.govtIdUrl];
        }
        const filled = fields.filter(f => f && f.toString().length > 0).length;
        return Math.round((filled / fields.length) * 100);
    };

    const getDashboardLink = () => {
        if (user?.role === 'authority') return '/dashboard/authority';
        if (user?.role === 'staff') return '/dashboard/staff';
        return '/dashboard';
    };

    if (!user) return null;

    const progress = calculateProgress();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="User menu"
            >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg border-2 border-border hover:border-primary/50 transition-all shadow-sm overflow-hidden">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        getInitials(user.name || "")
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-border mb-2">
                        <p className="text-sm font-medium truncate">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>

                        {/* Mini Progress Bar */}
                        <div className="mt-2 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full ${progress === 100 ? "bg-green-500" : "bg-primary"}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-right text-muted-foreground mt-0.5">{progress}% Complete</p>
                    </div>

                    <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <div className="w-4 h-4 rounded-sm border border-current flex items-center justify-center text-[8px]">D</div>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <User size={16} />
                        <span>My Profile</span>
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
