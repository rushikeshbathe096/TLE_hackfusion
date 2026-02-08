
"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle, Clock, BarChart3, RefreshCw } from "lucide-react";
import ComplaintCard from "@/components/authority/ComplaintCard";
import { useTheme } from "next-themes";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

export default function AuthorityDashboard() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!userLoading && (!user || user.role !== 'authority')) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchAllData();
        }
    }, [user, userLoading, router]);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [complaintsRes, statsRes, staffRes] = await Promise.all([
                fetch("/api/authority/complaints/list", { headers }),
                fetch("/api/authority/complaints/stats", { headers }),
                fetch("/api/authority/staff/list", { headers })
            ]);

            if (!complaintsRes.ok || !statsRes.ok || !staffRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const complaintsData = await complaintsRes.json();
            const statsData = await statsRes.json();
            const staffData = await staffRes.json();

            setComplaints(complaintsData.complaints);
            setStats(statsData.stats);
            setStaffList(staffData.staff);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (complaintId: string, staffIds: string[]) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/authority/complaints/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ complaintId, staffIds })
            });

            if (!res.ok) throw new Error("Failed to assign staff");

            // Refresh data to show updated assignment
            fetchAllData();
        } catch (err: any) {
            alert("Error assigning staff: " + err.message);
        }
    };

    if (userLoading || loading) return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!user || user.role !== 'authority') return null;

    const isLight = mounted && resolvedTheme === 'light';

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-20' : 'opacity-100'}`}>
                <Galaxy
                    starSpeed={0.5}
                    density={1}
                    hueShift={isLight ? 200 : 140}
                    speed={1}
                    glowIntensity={isLight ? 0.05 : 0.3}
                    saturation={0}
                    mouseRepulsion
                    repulsionStrength={2}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    transparent
                />
            </div>

            <div className="relative z-10 space-y-8 animate-in fade-in duration-500 p-1">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Authority Dashboard</h1>
                        <p className="text-muted-foreground text-lg flex items-center gap-2">
                            {user.department} Department <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold">Head</span>
                        </p>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card border p-6 rounded-xl shadow-sm">
                            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total</h3>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm">
                            <h3 className="text-orange-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle size={14} /> Open
                            </h3>
                            <p className="text-3xl font-bold mt-2 text-orange-700">{stats.open}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
                            <h3 className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <Clock size={14} /> In Progress
                            </h3>
                            <p className="text-3xl font-bold mt-2 text-blue-700">{stats.inProgress}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
                            <h3 className="text-green-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle size={14} /> Resolved
                            </h3>
                            <p className="text-3xl font-bold mt-2 text-green-700">{stats.resolved}</p>
                        </div>
                    </div>
                )}

                {/* Priority Distribution (Mini) */}
                {stats && (
                    <div className="flex gap-4 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border">
                        <span className="font-semibold flex items-center gap-2"><BarChart3 size={16} /> Priority Breakdown:</span>
                        <span className="text-red-500 font-medium">High: {stats.highPriority}</span>
                        <span className="text-orange-500 font-medium">Medium: {stats.mediumPriority}</span>
                        <span className="text-green-500 font-medium">Low: {stats.lowPriority}</span>
                    </div>
                )}

                {/* Complaints List */}
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h2 className="text-xl font-bold">Department Complaints</h2>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Sorted by Priority & Date</span>
                    </div>

                    {complaints.length === 0 ? (
                        <div className="text-muted-foreground text-center py-16">
                            No complaints found for {user.department}.
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {complaints.map(complaint => (
                                <ComplaintCard
                                    key={complaint._id}
                                    complaint={complaint}
                                    staffList={staffList}
                                    onAssign={handleAssign}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
