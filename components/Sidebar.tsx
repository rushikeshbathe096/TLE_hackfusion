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
        { name: "About Us", href: "/about", icon: Info },
        { name: "Contact", href: "/contact", icon: Phone },
        { name: "Help", href: "/help", icon: HelpCircle },
    ];

    const authorityLinks = [
        { name: "Dashboard", href: "/dashboard/authority", icon: LayoutDashboard },
        { name: "Staff Allocation", href: "/dashboard/authority/allocation", icon: Users },
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
            {/* Hamburger Toggle Button - Mobile Only or when sidebar is hidden */}
            {/* Note: In previous layout sidebar was fixed. With the new Navbar, we might want 
                the toggle to be part of the Navbar or floating. 
                For now, keeping floating but adjusting z-index and color.
            */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-20 left-4 z-50 p-2 rounded-lg bg-card border border-border text-foreground hover:bg-accent shadow-md md:hidden"
                    aria-label="Open Sidebar"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}


            {/* Sidebar */}
            {/* 
                Desktop: always visible (translate-x-0)
                Mobile: controlled by isOpen
            */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border flex flex-col z-30 transition-transform duration-300 ease-in-out shadow-sm
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="p-4 flex items-center justify-between md:hidden">
                    <span className="font-bold text-lg">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
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
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
