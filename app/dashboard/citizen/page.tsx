"use client";

import { useState, useEffect } from "react";
import ComplaintForm from "@/components/issues/ComplaintForm";
import ComplaintList from "@/components/issues/ComplaintList";
import { PlusCircle, List, FileText } from "lucide-react";

export default function CitizenDashboard() {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [stats, setStats] = useState({
        totalReports: 0,
        resolved: 0,
        points: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/citizen/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, [view]); // Refresh stats when view changes (e.g. after creating a complaint)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Citizen Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your complaints and view status updates.</p>
                </div>

                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'list'
                            ? 'bg-background shadow-sm text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <List size={16} />
                        My Complaints
                    </button>
                    <button
                        onClick={() => setView('create')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'create'
                            ? 'bg-background shadow-sm text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <PlusCircle size={16} />
                        New Complaint
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div>
                {view === 'list' ? (
                    <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                                <div className="text-muted-foreground text-xs font-medium uppercase">Total Reports</div>
                                <div className="text-2xl font-bold mt-1">{stats.totalReports}</div>
                                <div className="text-xs text-muted-foreground">All time</div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                                <div className="text-muted-foreground text-xs font-medium uppercase">Resolved</div>
                                <div className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</div>
                                <div className="text-xs text-muted-foreground">Successfully fixed</div>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                                <div className="text-muted-foreground text-xs font-medium uppercase">Points</div>
                                <div className="text-2xl font-bold text-amber-500 mt-1">{stats.points}</div>
                                <div className="text-xs text-muted-foreground">Contribution Score</div>
                            </div>
                        </div>

                        <ComplaintList />
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <ComplaintForm />
                    </div>
                )}
            </div>
        </div>
    );
}
