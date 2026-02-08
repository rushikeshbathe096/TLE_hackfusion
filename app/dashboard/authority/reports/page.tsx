"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, TrendingUp, BarChart, MapPin, Clock } from "lucide-react";
import { useTheme } from "next-themes";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

interface ReportData {
    avgResolutionTimeHours: number;
    topLocations: { location: string; count: number }[];
    priorityDistribution: { high: number; medium: number; low: number };
    totalComplaints: number;
    recentComplaints: any[];
}

import { FileText, Download } from "lucide-react";
import { generateComplaintPDF } from "@/lib/utils/generateComplaintPDF";

export default function ReportsPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [showAllComplaints, setShowAllComplaints] = useState(false);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
                <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
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
                                    <>
                                        {data.topLocations.slice(0, showAllLocations ? undefined : 3).map((loc, idx) => (
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
                                        ))}

                                        {data.topLocations.length > 3 && (
                                            <button
                                                onClick={() => setShowAllLocations(!showAllLocations)}
                                                className="text-xs font-medium text-primary hover:underline w-full text-center pt-2"
                                            >
                                                {showAllLocations ? "Show Less" : `See ${data.topLocations.length - 3} More Problem Areas`}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No location data available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {data && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FileText size={24} /> Recent Complaint Reports
                        </h2>
                        <p className="text-muted-foreground">Download official PDF reports for recent complaints filed by citizens.</p>

                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Title / ID</th>
                                            <th className="px-6 py-4">Citizen</th>
                                            <th className="px-6 py-4">Location</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {data?.recentComplaints.slice(0, showAllComplaints ? undefined : 3).map((complaint) => (
                                            <tr key={complaint._id} className="hover:bg-muted/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{complaint.title}</div>
                                                    <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {complaint._id.substring(0, 8)}...</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {complaint.createdBy?.name || "Anonymous"}
                                                    <div className="text-xs text-muted-foreground">{complaint.createdBy?.phoneNumber || "No Phone"}</div>
                                                </td>
                                                <td className="px-6 py-4 truncate max-w-[150px]" title={complaint.location}>
                                                    {complaint.location}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={async () => {
                                                            setGeneratingPdf(complaint._id);
                                                            await generateComplaintPDF(complaint, complaint.createdBy || {});
                                                            setGeneratingPdf(null);
                                                        }}
                                                        disabled={generatingPdf === complaint._id}
                                                        className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {generatingPdf === complaint._id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <Download size={14} />
                                                        )}
                                                        {generatingPdf === complaint._id ? "Generating..." : "Download PDF"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!data?.recentComplaints || data.recentComplaints.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                                    No complaints found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {data?.recentComplaints && data.recentComplaints.length > 3 && (
                            <div className="text-center pt-2">
                                <button
                                    onClick={() => setShowAllComplaints(!showAllComplaints)}
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    {showAllComplaints ? "Show Less" : `See All Recent Reports (${data.recentComplaints.length})`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
