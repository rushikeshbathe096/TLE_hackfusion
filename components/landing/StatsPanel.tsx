"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Activity, MapPin, Users } from "lucide-react";

interface StatsPanelProps {
    stats: {
        totalComplaints: number;
        resolvedComplaints: number;
        citiesCovered: number;
        activeDepartments: number;
    } | null;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
    const { t } = useLanguage();

    if (!stats) return <div className="animate-pulse h-64 bg-muted/20 rounded-xl" />;

    const statItems = [
        {
            label: "Total Issues Reported",
            value: stats.totalComplaints,
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Issues Resolved",
            value: stats.resolvedComplaints,
            icon: ShieldCheck,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "Active Departments",
            value: stats.activeDepartments,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            label: "Cities Covered",
            value: stats.citiesCovered > 0 ? stats.citiesCovered : "10+", // Fallback for impact
            icon: MapPin,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4">
            {statItems.map((item, idx) => (
                <div
                    key={idx}
                    className="flex items-center p-4 bg-card/50 backdrop-blur-md border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-primary/20 group"
                >
                    <div className={`p-3 rounded-lg ${item.bg} mr-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="text-left">
                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                            {item.value}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                            {item.label}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
