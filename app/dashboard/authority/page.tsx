"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthorityDashboard() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'authority')) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
    if (!user || user.role !== 'authority') return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Department Overview: {user?.department}</h1>
            </div>

            {!user?.isVerified && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-600 dark:text-amber-400 flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <p className="font-medium">Verification Pending</p>
                        <p className="text-sm opacity-90">Your account is currently pending verification. Some features may be restricted until an administrator approves your Government ID.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Pending Issues</h3>
                    <p className="text-4xl font-bold mt-2">12</p>
                </div>
                <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">In Progress</h3>
                    <p className="text-4xl font-bold mt-2">5</p>
                </div>
                <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm">
                    <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Resolved Today</h3>
                    <p className="text-4xl font-bold mt-2">3</p>
                </div>
            </div>

            <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
                <div className="text-muted-foreground text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
                    No issues loaded yet.
                </div>
            </div>
        </div>
    );
}
