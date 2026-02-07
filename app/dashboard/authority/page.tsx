"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AuthorityDashboard() {
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
                if (!data.ok || data.user.role !== 'authority') {
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
            <Sidebar role="authority" onLogout={handleLogout} />

            <main className="p-8 pt-24 pl-8 md:pl-20">
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
            </main>
        </div>
    );
}
