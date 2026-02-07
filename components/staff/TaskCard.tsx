
"use client";

import { useState } from "react";
import { Clock, MapPin, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface TaskCardProps {
    task: any;
    onUpdateStatus: (taskId: string, newStatus: string) => Promise<void>;
}

export default function TaskCard({ task, onUpdateStatus }: TaskCardProps) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        if (loading) return;
        setLoading(true);
        await onUpdateStatus(task._id, newStatus);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
            case 'ON_HOLD': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(task.createdAt).toLocaleDateString()}
                </span>
            </div>

            <h3 className="font-bold text-lg mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin size={14} />
                <span className="truncate">{task.location}</span>
            </div>

            {/* Status Controls */}
            {task.status !== 'RESOLVED' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    {task.status === 'OPEN' && (
                        <button
                            onClick={() => handleStatusChange('IN_PROGRESS')}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : "Start Work"}
                        </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                        <>
                            <button
                                onClick={() => handleStatusChange('RESOLVED')}
                                disabled={loading}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <><CheckCircle size={14} /> Mark Done</>}
                            </button>
                            <button
                                onClick={() => handleStatusChange('ON_HOLD')}
                                disabled={loading}
                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg text-xs font-medium transition-colors"
                            >
                                On Hold
                            </button>
                        </>
                    )}

                    {task.status === 'ON_HOLD' && (
                        <button
                            onClick={() => handleStatusChange('IN_PROGRESS')}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium transition-colors"
                        >
                            Resume Work
                        </button>
                    )}
                </div>
            )}
            {task.status === 'RESOLVED' && (
                <div className="mt-4 pt-4 border-t border-border text-center text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Completed
                </div>
            )}
        </div>
    );
}
