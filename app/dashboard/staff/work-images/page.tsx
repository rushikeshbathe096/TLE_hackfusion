
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Loader2, Calendar, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// @ts-ignore
import Galaxy from "@/components/Galaxy";
import { useTheme } from "next-themes";

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
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Form State
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
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

    const isLight = mounted && resolvedTheme === 'light';

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-20' : 'opacity-100'}`}>
                {/* @ts-ignore */}
                <Galaxy
                    starSpeed={0.5}
                    density={0.8}
                    hueShift={isLight ? 200 : 140}
                    speed={1}
                    glowIntensity={isLight ? 0.03 : 0.2}
                    saturation={0}
                    mouseRepulsion
                    repulsionStrength={2}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    transparent
                />
            </div>
            <div className="relative z-10 space-y-8 animate-in fade-in duration-500 p-1">
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
                    <div className="bg-card/90 backdrop-blur-sm border border-border p-6 rounded-xl shadow-lg mb-8 animate-in slide-in-from-top-4">
                        <h3 className="text-lg font-semibold mb-4">Upload Proof of Work</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">Select Task</label>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 pl-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none shadow-sm font-medium"
                                        value={selectedTaskId}
                                        onChange={(e) => setSelectedTaskId(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>-- Select a pending task --</option>
                                        {assignedTasks.map(t => (
                                            <option key={t._id} value={t._id}>
                                                {t.title} — {t.location}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {assignedTasks.length === 0 && (
                                    <p className="text-xs text-amber-500 mt-2 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span>
                                        No pending tasks found.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">Proof Image</label>
                                <div
                                    className={`mt-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer relative group ${proofFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
                                        }`}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    {proofFile ? (
                                        <div className="text-center w-full relative z-10">
                                            <div className="mb-3 relative group-hover:scale-105 transition-transform">
                                                <img
                                                    src={URL.createObjectURL(proofFile)}
                                                    alt="Preview"
                                                    className="h-40 mx-auto object-cover rounded-lg shadow-md border border-border"
                                                />
                                            </div>
                                            <p className="text-sm text-green-600 font-bold truncate max-w-[200px] mx-auto bg-green-50 px-2 py-1 rounded inline-block">
                                                {proofFile.name}
                                            </p>
                                            <button
                                                type="button"
                                                className="block mx-auto mt-2 text-xs text-red-500 font-bold hover:underline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setProofFile(null);
                                                }}
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-3">
                                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-foreground">Click to upload proof</p>
                                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                            </div>
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
                                <label className="block text-sm font-semibold mb-2 text-foreground">Resolution Notes</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-input bg-background min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-y font-medium text-sm placeholder:text-muted-foreground/70"
                                    placeholder="Describe the work done..."
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                />
                            </div>

                            {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : "Submit & Mark Resolved"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelUpload}
                                    className="px-5 py-2.5 rounded-xl border border-input font-semibold hover:bg-accent transition-colors"
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
                            <div key={task._id} className="bg-card/80 backdrop-blur-sm border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
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
        </div>
    );
}
