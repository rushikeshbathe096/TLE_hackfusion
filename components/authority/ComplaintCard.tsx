
"use client";

import { useState } from "react";
import { User, MapPin, Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

interface Complaint {
    _id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    createdAt: string;
    assignedTo?: {
        name: string;
        email: string;
    };
    priorityScore: number;
    frequency: number;
}

interface ComplaintCardProps {
    complaint: Complaint;
    staffList: any[];
    onAssign: (complaintId: string, staffId: string) => Promise<void>;
}

export default function ComplaintCard({ complaint, staffList, onAssign }: ComplaintCardProps) {
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState("");

    const getPriorityColor = (score: number) => {
        if (score >= 7) return "text-red-500 bg-red-50 border-red-200";
        if (score >= 5) return "text-orange-500 bg-orange-50 border-orange-200";
        return "text-green-500 bg-green-50 border-green-200";
    };

    const handleAssign = async () => {
        if (!selectedStaff) return;
        await onAssign(complaint._id, selectedStaff);
        setIsAssigning(false);
    };

    return (
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            {/* Priority Indicator */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl border-l border-b ${getPriorityColor(complaint.priorityScore)}`}>
                Priority Score: {complaint.priorityScore}
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-bold pr-24 line-clamp-1" title={complaint.title}>{complaint.title}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                    <Clock size={12} />
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <AlertTriangle size={12} />
                    <span>Frequency: {complaint.frequency || 1}</span>
                </div>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 bg-muted/50 p-2 rounded-lg">
                {complaint.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span className="truncate max-w-[150px]">{complaint.location}</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Assigned Status */}
                    {complaint.assignedTo ? (
                        <div className="flex items-center gap-1.5 text-primary text-sm font-medium bg-primary/5 px-2 py-1 rounded-md">
                            <User size={14} />
                            <span className="truncate max-w-[100px]">{complaint.assignedTo.name}</span>
                        </div>
                    ) : (
                        <div className="relative">
                            {isAssigning ? (
                                <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                                    <select
                                        className="text-xs p-1 border rounded bg-background max-w-[120px]"
                                        value={selectedStaff}
                                        onChange={(e) => setSelectedStaff(e.target.value)}
                                        autoFocus
                                        onBlur={() => !selectedStaff && setIsAssigning(false)}
                                    >
                                        <option value="">Select Staff...</option>
                                        {staffList.map(s => (
                                            <option key={s._id} value={s._id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleAssign}
                                        disabled={!selectedStaff}
                                        className="bg-primary text-primary-foreground p-1 rounded hover:opacity-90 disabled:opacity-50"
                                    >
                                        <CheckCircle size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAssigning(true)}
                                    className="text-xs bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-full font-medium shadow-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                                >
                                    Assign <ArrowRight size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border-green-200' :
                        complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            complaint.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                    {complaint.status.replace('_', ' ')}
                </span>
            </div>
        </div>
    );
}
