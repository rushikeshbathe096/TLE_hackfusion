"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffDashboard() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'staff')) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
    if (!user || user.role !== 'staff') return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>

            {!user?.isVerified && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-600 dark:text-amber-400 flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <p className="font-medium">Verification Pending</p>
                        <p className="text-sm opacity-90">Your account is currently pending verification. You can view assignments but cannot update status until approved.</p>
                    </div>
                </div>
            )}

            <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
                <div className="text-muted-foreground text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
                    No tasks assigned yet.
                </div>
            </div>
        </div>
    );
}
