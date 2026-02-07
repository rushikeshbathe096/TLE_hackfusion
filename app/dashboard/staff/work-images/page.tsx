
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Loader2, Calendar, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
    _id: string;
    title: string;
    description: string;
    location: string;
    status: 'IsPending' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED';
    proofUrl?: string;
    resolutionNotes?: string;
    updatedAt: string;
}

export default function WorkImagesPage() {
    const { user, loading: userLoading } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]); // Resolved tasks for gallery
    const [assignedTasks, setAssignedTasks] = useState<Task[]>([]); // Pending tasks for dropdown
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/login");
            return;
        }

        if (user && user.role !== 'staff') {
            // Access denied handled by layout or component return
        }

        if (user) {
            fetchResolvedTasks();
        }
    }, [user, userLoading, router]);

    const fetchResolvedTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/staff/tasks/resolved", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch work images");

            const data = await res.json();
            setTasks(data.tasks);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/staff/tasks/list", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                // Filter out already resolved tasks just in case, though API might normally return all
                setAssignedTasks(data.tasks.filter((t: Task) => t.status !== 'RESOLVED'));
            }
        } catch (err) {
            console.error("Failed to fetch assigned tasks", err);
        }
    };

    const handleStartUpload = () => {
        setIsUploading(true);
        fetchAssignedTasks();
    };

    const handleCancelUpload = () => {
        setIsUploading(false);
        setSelectedTaskId("");
        setProofFile(null);
        setResolutionNotes("");
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTaskId || !proofFile) {
            setError("Please select a task and upload a proof image.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("taskId", selectedTaskId);
            formData.append("proof", proofFile);
            formData.append("resolutionNotes", resolutionNotes);

            const res = await fetch("/api/staff/tasks/upload-proof", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to upload proof");
            }

            // Success
            handleCancelUpload();
            fetchResolvedTasks(); // Refresh gallery
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (userLoading || loading) return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (user?.role !== 'staff') return <div className="text-center p-8 text-red-500">Access Denied</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {/* Header & Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Work Gallery</h1>
                    <p className="text-muted-foreground mt-1">
                        Visual proof of your resolved complaints and tasks.
                    </p>
                </div>
                <button
                    onClick={handleStartUpload}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    + Add Completed Work
                </button>
            </div>

            {/* Upload Modal / Form Area */}
            {isUploading && (
                <div className="bg-card border border-border p-6 rounded-xl shadow-lg mb-8 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">Upload Proof of Work</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Task</label>
                            <select
                                className="w-full p-2 rounded-md border border-input bg-background"
                                value={selectedTaskId}
                                onChange={(e) => setSelectedTaskId(e.target.value)}
                                required
                            >
                                <option value="">-- Select a pending task --</option>
                                {assignedTasks.map(t => (
                                    <option key={t._id} value={t._id}>
                                        {t.title} ({t.location})
                                    </option>
                                ))}
                            </select>
                            {assignedTasks.length === 0 && (
                                <p className="text-xs text-amber-500 mt-1">No pending tasks found.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Proof Image</label>

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors cursor-pointer relative bg-gray-50 hover:bg-gray-100"
                                onClick={() => document.getElementById('file-upload')?.click()}>

                                {proofFile ? (
                                    <div className="text-center w-full">
                                        <p className="text-sm text-green-600 font-medium mb-2 truncate max-w-[200px] mx-auto">
                                            Selected: {proofFile.name}
                                        </p>
                                        <img
                                            src={URL.createObjectURL(proofFile)}
                                            alt="Preview"
                                            className="h-32 mx-auto object-cover rounded-lg shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            className="text-xs text-red-500 mt-2 underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProofFile(null);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload a file</span>
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG to 10MB</p>
                                    </div>
                                )}

                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Resolution Notes</label>
                            <textarea
                                className="w-full p-2 rounded-md border border-input bg-background min-h-[80px]"
                                placeholder="Describe what work was done..."
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting ? "Uploading..." : "Submit & Resolve"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelUpload}
                                className="px-4 py-2 rounded-lg border border-input hover:bg-accent"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {error && !isUploading && (
                <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-100">{error}</div>
            )}

            {tasks.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border px-4">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-primary w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold">No resolved work yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        Once you resolve tasks and upload proof, they will appear here as your portfolio of work.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(task => (
                        <div key={task._id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            {/* Image Area */}
                            <div className="aspect-video bg-muted relative overflow-hidden">
                                {task.proofUrl ? (
                                    <img
                                        src={task.proofUrl}
                                        alt={`Proof for ${task.title}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+Error";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-muted-foreground">
                                        <span className="text-sm">No image uploaded</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                    RESOLVED
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    <Calendar size={14} />
                                    <span>{new Date(task.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>

                                <h3 className="font-semibold text-lg mb-2 line-clamp-1" title={task.title}>
                                    {task.title}
                                </h3>

                                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                                        "{task.resolutionNotes || "No resolution notes provided."}"
                                    </p>
                                </div>

                                <div className="flex items-center text-xs text-muted-foreground pt-2 border-t border-border">
                                    <span className="truncate">📍 {task.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
