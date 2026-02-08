"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import StatsPanel from "./StatsPanel";
// Dynamically import MapPreview to prevent Leaflet SSR issues
const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });
import DepartmentCharts from "./DepartmentCharts";
import { Loader2 } from "lucide-react";

export default function ImpactSection() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/public/landing-stats');
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch landing stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <section className="mb-20 animate-fade-in-up delay-200">
            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Impact & Insights</h2>
                <p className="text-muted-foreground">Real-time data on how complaints are being resolved across the city.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: Map */}
                <div className="w-full">
                    <MapPreview complaints={data.mapData} />
                </div>

                {/* RIGHT: Stats Panel */}
                <div className="w-full">
                    <StatsPanel stats={data.stats} />
                </div>
            </div>

            {/* BOTTOM: Charts */}
            <DepartmentCharts data={data.departmentStats} />
        </section>
    );
}
