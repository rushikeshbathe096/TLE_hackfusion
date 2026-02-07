"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function AuthorityDashboard() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'authority')) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'authority') return null;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">Department Overview: {user?.department}</h1>

            {!user?.isVerified && (
                <div className="bg-amber-500/20 border border-amber-500/50 p-4 rounded-lg mb-8 text-amber-200">
                    ⚠️ Your account is currently pending verification. Some features may be restricted until an administrator approves your Government ID.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-white/60 text-sm font-medium uppercase">Pending Issues</h3>
                    <p className="text-4xl font-bold mt-2">12</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-white/60 text-sm font-medium uppercase">In Progress</h3>
                    <p className="text-4xl font-bold mt-2">5</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-white/60 text-sm font-medium uppercase">Resolved Today</h3>
                    <p className="text-4xl font-bold mt-2">3</p>
                </div>
            </div>

            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
                <div className="text-white/50 text-center py-12">
                    No issues loaded yet.
                </div>
            </div>
        </div>
    );
}
