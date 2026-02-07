"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TaskCard from "@/components/staff/TaskCard";
import { Loader2, RefreshCw } from "lucide-react";

export default function StaffDashboard() {
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/staff/complaints", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(data.complaints);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (taskId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/staff/complaints/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ taskId, status: newStatus })
            });

            if (res.ok) {
                // Optimistic update or refresh
                fetchTasks();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    useEffect(() => {
        if (!userLoading && (!user || user.role !== 'staff')) {
            router.push("/login");
            return;
        }
        if (user) {
            fetchTasks();
        }
    }, [user, userLoading, router]);

    if (userLoading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!user || user.role !== 'staff') return null;

    const isProfileComplete = user?.name && user?.email && user?.dob && user?.profileImage && user?.govtIdUrl;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
                <button onClick={fetchTasks} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <RefreshCw size={20} />
                </button>
            </div>

            {!user?.isVerified && !isProfileComplete && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-600 dark:text-amber-400 flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <p className="font-medium">Verification Pending</p>
                        <p className="text-sm opacity-90">Your account is currently pending verification. You can view assignments but cannot update status until approved.</p>
                    </div>
                </div>
            )}

            <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Assigned Tasks ({tasks.length})</h2>

                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : tasks.length === 0 ? (
                    <div className="text-muted-foreground text-center py-12 bg-muted/30 rounded-lg border border-dashed border-border">
                        No tasks assigned yet. Good job!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map(task => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
