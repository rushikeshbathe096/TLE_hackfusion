
"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, TrendingUp, BarChart, MapPin, Clock } from "lucide-react";

interface ReportData {
    avgResolutionTimeHours: number;
    topLocations: { location: string; count: number }[];
    priorityDistribution: { high: number; medium: number; low: number };
    totalComplaints: number;
}

export default function ReportsPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userLoading && (!user || user.role !== 'authority')) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchReports();
        }
    }, [user, userLoading, router]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/authority/reports", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch reports");
            const reportData = await res.json();
            setData(reportData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (userLoading || loading) return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!user || user.role !== 'authority') return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Computed Reports</h1>
                <p className="text-muted-foreground text-lg">
                    Analytics and insights for {user.department} Department.
                </p>
            </div>

            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Key Metrics Card */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp size={20} /> Key Metrics
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                        <Clock size={16} /> Avg. Resolution Time
                                    </p>
                                    <p className="text-3xl font-bold mt-1 text-primary">
                                        {data.avgResolutionTimeHours} <span className="text-sm font-normal text-muted-foreground">hours</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                                        <BarChart size={16} /> Total Reports Processed
                                    </p>
                                    <p className="text-3xl font-bold mt-1 text-primary font-mono">
                                        {data.totalComplaints}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Geography Card */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin size={20} /> Top Problem Areas
                        </h2>

                        <div className="space-y-4">
                            {data.topLocations.length > 0 ? (
                                data.topLocations.map((loc, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{loc.location}</span>
                                            <span className="text-muted-foreground">{loc.count} reports</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${(loc.count / data.totalComplaints) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No location data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
