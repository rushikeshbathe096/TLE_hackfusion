"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeLogo } from "@/components/theme-logo";

export default function StaffDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (!data.ok || data.user.role !== 'staff') {
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }
                setUser(data.user);
            })
            .catch(() => {
                localStorage.removeItem("token");
                router.push("/login");
            })
            .finally(() => setLoading(false));
    }, [router]);

    function handleLogout() {
        localStorage.removeItem("token");
        router.push("/");
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <nav className="p-6 border-b border-border flex justify-between items-center bg-card shadow-sm">
                <div className="flex items-center gap-3">
                    <ThemeLogo className="w-8 h-8" />
                    <div className="font-bold text-xl">Field Staff</div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{user?.name} ({user?.department} Dept)</span>
                    <button onClick={handleLogout} className="px-4 py-2 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition">Logout</button>
                </div>
            </nav>

            <main className="p-8">
                <h1 className="text-3xl font-bold mb-6">My Assignments</h1>

                {!user?.isVerified && (
                    <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-lg mb-8 text-amber-600 dark:text-amber-400">
                        ⚠️ Your account is currently pending verification. You can view assignments but cannot update status until approved.
                    </div>
                )}

                <div className="mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
                    <div className="text-muted-foreground text-center py-12">
                        No tasks assigned yet.
                    </div>
                </div>
            </main>
        </div>
    );
}
