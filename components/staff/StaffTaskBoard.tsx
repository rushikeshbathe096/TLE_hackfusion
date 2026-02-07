
"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Clock, AlertCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
    _id: string;
    title: string;
    description: string;
    location: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED';
    createdAt: string;
    proofUrl?: string;
    resolutionNotes?: string;
    // Add other fields as needed
}

export default function StaffTaskBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const router = useRouter();

    // Modal states
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [proofUrl, setProofUrl] = useState("");
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [showProofModal, setShowProofModal] = useState(false);


    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const res = await fetch("/api/staff/tasks/list", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch tasks");

            const data = await res.json();
            setTasks(data.tasks);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        setUpdating(taskId);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/staff/tasks/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ taskId, status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");

            // Optimistic update or refetch
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus as any } : t));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(null);
        }
    };

    const handleProofUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;
        setUpdating(selectedTask._id);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/staff/tasks/upload-proof", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    taskId: selectedTask._id,
                    proofUrl,
                    resolutionNotes
                })
            });

            if (!res.ok) throw new Error("Failed to upload proof");

            // Update local state
            setTasks(prev => prev.map(t => t._id === selectedTask._id ? { ...t, proofUrl, resolutionNotes } : t));
            setShowProofModal(false);
            setProofUrl("");
            setResolutionNotes("");
            setSelectedTask(null);

        } catch (err: any) {
            alert(err.message);
        } finally {
            setUpdating(null);
        }
    };


    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-red-500 p-8">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Assigned Tasks</h2>

            {tasks.length === 0 ? (
                <p className="text-muted-foreground">No tasks assigned to you currently.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task._id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                        ${task.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                task.status === 'ON_HOLD' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
                                <div className="text-xs text-muted-foreground mb-4">
                                    📍 {task.location}
                                </div>

                                {task.proofUrl && (
                                    <div className="mb-4 text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle size={14} /> Proof Uploaded
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-border mt-4 flex flex-col gap-2">
                                {/* Status Actions */}
                                <div className="flex gap-2">
                                    {task.status !== 'IN_PROGRESS' && task.status !== 'RESOLVED' && (
                                        <button
                                            onClick={() => handleStatusUpdate(task._id, 'IN_PROGRESS')}
                                            disabled={!!updating}
                                            className="flex-1 bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            Start
                                        </button>
                                    )}

                                    {task.status === 'IN_PROGRESS' && (
                                        <button
                                            onClick={() => handleStatusUpdate(task._id, 'ON_HOLD')}
                                            disabled={!!updating}
                                            className="flex-1 bg-amber-500 text-white text-xs py-2 rounded hover:bg-amber-600 transition disabled:opacity-50"
                                        >
                                            Hold
                                        </button>
                                    )}

                                    {task.status !== 'RESOLVED' && (
                                        <button
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setShowProofModal(true);
                                                // Pre-fill if exists?
                                                setProofUrl(task.proofUrl || "");
                                                setResolutionNotes(task.resolutionNotes || "");
                                            }}
                                            disabled={!!updating}
                                            className="flex-1 bg-green-600 text-white text-xs py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Proof Upload Modal */}
            {showProofModal && selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Complete Task</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Upload proof of resolution for "{selectedTask.title}".
                        </p>

                        <form onSubmit={handleProofUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Proof Image URL</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://imgur.com/..."
                                    value={proofUrl}
                                    onChange={e => setProofUrl(e.target.value)}
                                    className="w-full p-2 border rounded bg-background text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Resolution Notes</label>
                                <textarea
                                    required
                                    placeholder="Describe how the issue was resolved..."
                                    value={resolutionNotes}
                                    onChange={e => setResolutionNotes(e.target.value)}
                                    className="w-full p-2 border rounded bg-background text-foreground min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowProofModal(false); setSelectedTask(null); }}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                    disabled={!!updating}
                                >
                                    {updating ? 'Saving...' : 'Submit & Resolve'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
