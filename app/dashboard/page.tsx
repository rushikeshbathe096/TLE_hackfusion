"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ComplaintList from "@/components/issues/ComplaintList";
import { useUser } from "@/contexts/UserContext";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

export default function DashboardPage() {
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    setMounted(true);
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

  const isLight = mounted && resolvedTheme === 'light';

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-30' : 'opacity-100'}`}>
        <Galaxy
          starSpeed={0.5}
          density={1}
          hueShift={isLight ? 200 : 140} // Shift towards blue for light mode
          speed={1}
          glowIntensity={isLight ? 0.1 : 0.3} // Reduce glow in light mode
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
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name || "User"}! 👋</h1>
          <p className="text-muted-foreground mt-2">{user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card/80 backdrop-blur-sm text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
            <div className="text-muted-foreground text-sm font-medium uppercase">Total Reports</div>
            <div className="text-2xl font-bold mt-2">{stats.totalReports}</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-green-500/50 transition-colors">
            <div className="text-muted-foreground text-sm font-medium uppercase">Resolved</div>
            <div className="text-2xl font-bold text-green-600 mt-2">{stats.resolved}</div>
            <div className="text-xs text-muted-foreground mt-1">Successfully fixed</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-blue-500/50 transition-colors">
            <div className="text-muted-foreground text-sm font-medium uppercase">In Progress</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{stats.inProgress || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Being worked on</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-yellow-500/50 transition-colors">
            <div className="text-muted-foreground text-sm font-medium uppercase">Open</div>
            <div className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending review</div>
          </div>
        </div>

        {/* Complaint List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Complaints</h2>
          <ComplaintList />
        </div>
      </div>
    </div>
  );
}
