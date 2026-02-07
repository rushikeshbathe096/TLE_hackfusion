"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#001219] text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#001e3c] to-[#001219] text-white">
            <nav className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                <div className="font-bold text-xl">CityPulse Field Staff</div>
                <div className="flex items-center gap-4">
                    <span>{user?.name} ({user?.department} Dept)</span>
                    <button onClick={handleLogout} className="px-4 py-2 bg-rose-500/20 text-rose-300 rounded hover:bg-rose-500/30">Logout</button>
                </div>
            </nav>

            <main className="p-8">
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
            </main>
        </div>
    );
}
