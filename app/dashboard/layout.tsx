
"use client";

import { UserProvider, useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <DashboardContent>{children}</DashboardContent>
        </UserProvider>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Protect the route
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login"); // or "/"
        }
    }, [user, loading, router]);

    if (!mounted || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0f172a] text-white">
                <Loader2 className="animate-spin text-amber-500" size={48} />
            </div>
        );
    }

    // If user is not logged in, we are redirecting, so return null or loader
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#001e3c] to-[#001219] text-white selection:bg-amber-500/30">
            <Navbar />
            <Sidebar role={user.role as any || "citizen"} />

            {/* Main Content Area */}
            {/* Add padding top for Navbar. 
          Sidebar is fixed/overlay, so simple padding-left might not be enough if we want persistent sidebar.
          Use standard container pattern. 
       */}
            <main className="pt-20 px-4 md:px-8 pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
