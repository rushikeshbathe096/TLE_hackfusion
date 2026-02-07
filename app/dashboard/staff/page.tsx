"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function StaffDashboard() {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'staff')) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'staff') return null;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">My Assignments</h1>

            {!user?.isVerified && (
                <div className="bg-amber-500/20 border border-amber-500/50 p-4 rounded-lg mb-8 text-amber-200">
                    ⚠️ Your account is currently pending verification. You can view assignments but cannot update status until approved.
                </div>
            )}

            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
                <div className="text-white/50 text-center py-12">
                    No tasks assigned yet.
                </div>
            </div>
        </div>
    );
}
