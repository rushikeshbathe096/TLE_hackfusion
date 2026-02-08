"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Users, Briefcase, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

interface StaffMember {
    _id: string;
    name: string;
    email: string;
    activeTasks: number;
}

export default function StaffAllocationPage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
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
            fetchStaffWorkload();
        }
    }, [user, userLoading, router]);

    const fetchStaffWorkload = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/authority/staff/workload", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch staff data");
            const data = await res.json();
            setStaffList(data.staff);
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
                    <h1 className="text-3xl font-bold tracking-tight">Staff Allocated</h1>
                    <p className="text-muted-foreground text-lg">
                        Monitor workload distribution for {user.department} Department.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffList.map((staff) => (
                        <div key={staff._id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {staff.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{staff.name}</h3>
                                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Briefcase size={16} />
                                        <span className="text-sm font-medium">Active Tasks</span>
                                    </div>
                                    <span className={`text-xl font-bold ${staff.activeTasks === 0 ? "text-green-500" :
                                        staff.activeTasks > 5 ? "text-red-500" : "text-primary"
                                        }`}>
                                        {staff.activeTasks}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {staff.activeTasks === 0 ? (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <CheckCircle2 size={12} /> Available for immediate assignment
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            Currently working on {staff.activeTasks} issue{staff.activeTasks !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {staffList.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No staff members found in this department.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
