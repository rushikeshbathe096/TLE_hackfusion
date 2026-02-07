
"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Clock, MapPin, Activity } from "lucide-react";

interface Complaint {
    _id: string;
    title: string;
    department: 'Road' | 'Water' | 'Electrical' | 'Sanitation';
    location: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED';
    priority: 'Low' | 'Medium' | 'High';
    frequency: number;
    createdAt: string;
    updatedAt: string;
}

export default function ComplaintList() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/citizen/complaints/list", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch complaints");
            }

            setComplaints(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'RESOLVED': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'ON_HOLD': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
        }
    };

    // ... (getPriorityColor stays same)
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-500 font-bold';
            case 'Medium': return 'text-amber-500 font-medium';
            default: return 'text-green-500';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
                <button onClick={fetchComplaints} className="ml-auto underline text-sm">Retry</button>
            </div>
        );
    }

    if (complaints.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                <p>No complaints found. Raise an issue to contribute!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
                <div key={complaint._id} className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{complaint.title}</h3>
                    <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{complaint.department}</div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{complaint.description}</p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={16} />
                            <span className="truncate">{complaint.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Priority: </span>
                            <span className={getPriorityColor(complaint.priority)}>{complaint.priority}</span>
                        </div>
                        {complaint.frequency > 1 && (
                            <div className="text-xs text-amber-500 font-medium mt-2">
                                🔥 {complaint.frequency} people reported this
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
