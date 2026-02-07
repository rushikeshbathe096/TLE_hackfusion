"use client";

import { useState, useEffect } from "react";
import ComplaintList from "@/components/issues/ComplaintList";
import { useUser } from "@/contexts/UserContext";

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalReports: 0,
    resolved: 0,
    points: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

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
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name || "User"}! 👋</h1>
        <p className="text-muted-foreground mt-2">{user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-muted-foreground text-sm font-medium uppercase">Total Reports</div>
          <div className="text-2xl font-bold mt-2">{stats.totalReports}</div>
          <div className="text-xs text-muted-foreground mt-1">All time</div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-muted-foreground text-sm font-medium uppercase">Resolved</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.resolved}</div>
          <div className="text-xs text-muted-foreground mt-1">Successfully fixed</div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-muted-foreground text-sm font-medium uppercase">Points</div>
          <div className="text-2xl font-bold text-amber-500 mt-2">{stats.points}</div>
          <div className="text-xs text-muted-foreground mt-1">Contribution Score</div>
        </div>
      </div>

      {/* Complaint List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Complaints</h2>
        <ComplaintList />
      </div>
    </div>
  );
}
