"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, CheckCircle, User } from "lucide-react";
import { useTheme } from "next-themes";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

interface ResolvedComplaint {
    _id: string;
    title: string;
    proofUrl: string;
    resolutionNotes: string;
    updatedAt: string;
    assignedStaff?: {
        name: string;
        email: string;
    }[];
}

export default function WorkDonePage() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [complaints, setComplaints] = useState<ResolvedComplaint[]>([]);
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
            fetchResolvedWork();
        }
    }, [user, userLoading, router]);

    const fetchResolvedWork = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/authority/complaints/resolved", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch resolved work");
            const data = await res.json();
            setComplaints(data.complaints);
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
                    <h1 className="text-3xl font-bold tracking-tight">Staff Work Done</h1>
                    <p className="text-muted-foreground text-lg">
                        Visual gallery of completed work by {user.department} staff.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            {/* Image Area */}
                            <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
                                {complaint.proofUrl ? (
                                    <img
                                        src={complaint.proofUrl}
                                        alt="Proof of work"
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <ImageIcon size={48} className="mb-2 opacity-50" />
                                        <span className="text-sm">No Image Available</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm line-clamp-2">{complaint.resolutionNotes}</p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-bold text-lg line-clamp-1" title={complaint.title}>{complaint.title}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Resolved on {new Date(complaint.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="font-medium text-green-700">Verified</span>
                                    </div>
                                    {complaint.assignedStaff && complaint.assignedStaff.length > 0 && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={complaint.assignedStaff.map(s => s.name).join(", ")}>
                                            <User size={12} />
                                            <span className="truncate max-w-[100px]">
                                                {complaint.assignedStaff.length === 1
                                                    ? complaint.assignedStaff[0].name
                                                    : `${complaint.assignedStaff.length} Staff`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {complaints.length === 0 && (
                        <div className="col-span-full text-center py-16 text-muted-foreground border border-dashed rounded-xl">
                            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No completed work proofs found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
