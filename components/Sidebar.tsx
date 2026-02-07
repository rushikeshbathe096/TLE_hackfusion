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
    X
} from "lucide-react";

interface SidebarProps {
    role: "citizen" | "authority" | "staff";
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

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
            {/* Hamburger Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-all shadow-lg"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}


            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 flex items-center justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
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
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} className={isActive ? "text-amber-300" : "text-white/50 group-hover:text-white transition-colors"} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
