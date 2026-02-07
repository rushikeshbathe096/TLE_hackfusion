
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MapPin, Calendar, Activity, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface TimelineEvent {
    _id: string;
    action: string;
    timestamp: string;
    actorId: { name: string; role: string };
    newStatus?: string;
}

interface ComplaintDetail {
    _id: string;
    department: string;
    location: string;
    description: string;
    status: string;
    priority: string;
    frequency: number;
    createdAt: string;
    imageUrl?: string;
    timeline: TimelineEvent[];
}

export default function ComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/citizen/complaints/${params.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to load details");
                setComplaint(data.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) fetchDetails();
    }, [params.id]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!complaint) return <div className="p-8">Complaint not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resolved': return 'text-green-600 bg-green-100 border-green-200';
            case 'Rejected': return 'text-red-600 bg-red-100 border-red-200';
            case 'In Progress': return 'text-blue-600 bg-blue-100 border-blue-200';
            default: return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-accent rounded-full transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Complaint #{complaint._id.slice(-6)}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Issue Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-muted-foreground uppercase font-bold">Category</label>
                                <p className="text-lg">{complaint.department} Department</p>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground uppercase font-bold">Description</label>
                                <p className="mt-1 text-sm leading-relaxed">{complaint.description}</p>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground uppercase font-bold">Location</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin size={16} className="text-muted-foreground" />
                                    <span>{complaint.location}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground uppercase font-bold">Submitted On</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            Activity Log
                        </h2>
                        <div className="relative border-l-2 border-muted ml-3 space-y-8 pl-6 py-2">
                            {complaint.timeline.map((event, idx) => (
                                <div key={idx} className="relative">
                                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {event.action === 'CREATED' && 'Complaint Submitted'}
                                            {event.action === 'STATUS_CHANGE' && `Status changed to ${event.newStatus}`}
                                            {event.action === 'ASSIGNED' && 'Staff Assigned'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            by {event.actorId?.name || 'System'} ({event.actorId?.role})
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {complaint.timeline.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No activity recorded.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-medium mb-4">Meta Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Urgency</span>
                                <span className={`font-bold ${complaint.priority === 'High' ? 'text-red-500' :
                                        complaint.priority === 'Medium' ? 'text-amber-500' : 'text-green-500'
                                    }`}>{complaint.priority}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Support Count</span>
                                <span className="font-mono bg-muted px-2 py-0.5 rounded text-sm">{complaint.frequency}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-300">
                        <p><strong>Note:</strong> You cannot edit or delete this complaint to ensure transparency.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
