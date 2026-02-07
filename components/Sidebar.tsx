"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Info,
    Phone,
    HelpCircle,
    Users,
    ClipboardCheck,
    CheckSquare,
    Image as ImageIcon,
    Menu,
    X,
    FolderOpen
} from "lucide-react";

interface SidebarProps {
    role: "citizen" | "authority" | "staff";
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Common links or modify as needed
    const citizenLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Complain", href: "/dashboard/complain", icon: FileText },
        { name: "About Us", href: "/dashboard/about", icon: Info },
        { name: "Contact", href: "/dashboard/contact", icon: Phone },
        { name: "Help", href: "/dashboard/citizen/help", icon: HelpCircle },
    ];

    const authorityLinks = [
        { name: "Dashboard", href: "/dashboard/authority", icon: LayoutDashboard },
        { name: "Staff Allocated", href: "/dashboard/authority/allocation", icon: Users },
        { name: "Computed Reports", href: "/dashboard/authority/reports", icon: ClipboardCheck },
        { name: "Staff Work Done", href: "/dashboard/authority/work-done", icon: CheckSquare },
    ];

    const staffLinks = [
        { name: "Dashboard", href: "/dashboard/staff", icon: LayoutDashboard },
        { name: "Work Images", href: "/dashboard/staff/work-images", icon: ImageIcon },
        { name: "Help", href: "/help", icon: HelpCircle },
    ];

    type LinkItem = { name: string; href: string; icon: React.ElementType };
    let links: LinkItem[] = [];
    if (role === "citizen") links = citizenLinks;
    else if (role === "authority") links = authorityLinks;
    else if (role === "staff") links = staffLinks;

    return (
        <>
            {/* Hamburger Toggle Button - Mobile & Desktop */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-6 z-50 p-2 rounded-lg bg-background/50 text-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-md transition-all shadow-sm border border-border"
                    aria-label="Open Sidebar"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl bg-gradient-to-b from-blue-50 to-white dark:from-zinc-800 dark:to-zinc-950 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
                        <div className="w-10 h-10 relative flex items-center justify-center">
                            <img
                                src="/city_logo2.png"
                                alt="CityPulse Logo"
                                className="w-full h-full object-contain dark:hidden"
                            />
                            <img
                                src="/city_logo3.png"
                                alt="CityPulse Logo"
                                className="w-full h-full object-contain hidden dark:block"
                            />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white tracking-wide">CityPulse</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-md dark:bg-white dark:text-black dark:shadow-none font-medium"
                                    : "text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700/50 hover:shadow-sm dark:hover:shadow-none hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-primary-foreground dark:text-black" : "text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
