
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                        title="Go Back"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Complaint #{complaint._id.slice(-6)}</h1>
                        <p className="text-muted-foreground mt-1">
                            Detailed view of the reported issue and its current status.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Issue Description Card */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <AlertTriangle size={20} className="text-primary" />
                                Issue Details
                            </h2>
                            <span className="text-xs text-muted-foreground font-mono">
                                ID: {complaint._id}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Department</label>
                                <div className="font-medium text-lg text-foreground">{complaint.department}</div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Submitted On</label>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</label>
                                <div className="flex items-center gap-2 font-medium bg-muted/50 p-3 rounded-lg">
                                    <MapPin size={18} className="text-primary" />
                                    <span>{complaint.location}</span>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Description</label>
                                <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-sm leading-loose">
                                    {complaint.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <HistoryIcon />
                            Activity Log
                        </h2>
                        <div className="relative border-l-2 border-muted ml-3 space-y-8 pl-8 py-2">
                            {complaint.timeline.map((event, idx) => (
                                <div key={idx} className="relative group">
                                    <span className="absolute -left-[39px] top-1 h-5 w-5 rounded-full bg-background border-4 border-primary group-hover:scale-110 transition-transform" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-base font-semibold text-foreground">
                                            {event.action === 'CREATED' && 'Complaint Submitted'}
                                            {event.action === 'STATUS_CHANGE' && `Status updated to ${event.newStatus}`}
                                            {event.action === 'ASSIGNED' && 'Staff Assigned'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            by <span className="font-medium text-foreground">{event.actorId?.name || 'System'}</span> ({event.actorId?.role})
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Clock size={12} />
                                            {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {complaint.timeline.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No activity recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* Image Card (if exists) */}
                    {complaint.imageUrl && (
                        <div className="bg-card p-4 rounded-xl border border-border shadow-sm overflow-hidden">
                            <h3 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">Evidence</h3>
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-border/50 group">
                                <img
                                    src={complaint.imageUrl}
                                    alt="Complaint Evidence"
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-bold mb-4 text-lg">Status Overview</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium text-muted-foreground">Urgency</span>
                                <span className={`font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide border ${complaint.priority === 'High' ? 'text-red-600 bg-red-100 border-red-200' :
                                        complaint.priority === 'Medium' ? 'text-amber-600 bg-amber-100 border-amber-200' :
                                            'text-green-600 bg-green-100 border-green-200'
                                    }`}>{complaint.priority}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium text-muted-foreground">Community Support</span>
                                <div className="flex items-center gap-2">
                                    <Activity size={16} className="text-primary" />
                                    <span className="font-mono font-bold text-lg">{complaint.frequency}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium text-muted-foreground">Est. Resolution</span>
                                <span className="text-sm font-medium">
                                    {complaint.priority === 'High' ? '24-48 Hours' : '3-5 Days'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10 text-sm text-blue-800 dark:text-blue-300">
                        <div className="flex gap-2">
                            <div className="mt-0.5"><CheckCircle size={16} /></div>
                            <div>
                                <p className="font-semibold mb-1">Transparency Note</p>
                                <p className="opacity-90 text-xs leading-relaxed">This record is immutable to ensure transparency. Updates are logged automatically.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HistoryIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
            <path d="M3 3v9h9" />
            <path d="M12 7v5l4 2" />
        </svg>
    );
}
