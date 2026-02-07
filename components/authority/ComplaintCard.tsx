
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
    assignedStaff?: {
        _id: string;
        name: string;
        email: string;
    }[];
    priorityScore: number;
    frequency: number;
}

interface ComplaintCardProps {
    complaint: Complaint;
    staffList: any[];
    onAssign: (complaintId: string, staffIds: string[]) => Promise<void>;
}

export default function ComplaintCard({ complaint, staffList, onAssign }: ComplaintCardProps) {
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

    const availableStaffCount = staffList.filter(s => s.isAvailable).length;

    const getPriorityColor = (score: number) => {
        if (score >= 7) return "text-red-500 bg-red-50 border-red-200";
        if (score >= 5) return "text-orange-500 bg-orange-50 border-orange-200";
        return "text-green-500 bg-green-50 border-green-200";
    };

    const toggleStaffSelection = (staffId: string) => {
        setSelectedStaffIds(prev =>
            prev.includes(staffId)
                ? prev.filter(id => id !== staffId)
                : [...prev, staffId]
        );
    };

    const handleAssign = async () => {
        // Allow saving empty list (clearing assignments)
        await onAssign(complaint._id, selectedStaffIds);
        setIsAssigning(false);
        setSelectedStaffIds([]);
    };

    return (
        // Removed overflow-hidden to allow dropdown to pop out
        <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            {/* Priority Indicator - manually rounded top-right to match card */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-tr-xl rounded-bl-xl border-l border-b ${getPriorityColor(complaint.priorityScore)}`}>
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
                    {complaint.assignedStaff && complaint.assignedStaff.length > 0 && !isAssigning ? (
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {complaint.assignedStaff.slice(0, 3).map((staff, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border-2 border-background shadow-sm" title={staff.name}>
                                        {staff.name.charAt(0)}
                                    </div>
                                ))}
                                {complaint.assignedStaff.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold border-2 border-background shadow-sm">
                                        +{complaint.assignedStaff.length - 3}
                                    </div>
                                )}
                            </div>

                            {/* (+) Button to Add/Manage */}
                            <button
                                onClick={() => {
                                    const currentIds = complaint.assignedStaff?.map((s: any) => s._id) || [];
                                    setSelectedStaffIds(currentIds);
                                    setIsAssigning(true);
                                }}
                                className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                                title="Manage Staff (Add/Remove)"
                            >
                                <span className="text-base font-bold leading-none mb-0.5">+</span>
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            {isAssigning ? (
                                <>
                                    {/* Backdrop to close when clicking outside */}
                                    <div className="fixed inset-0 z-40" onClick={() => setIsAssigning(false)}></div>

                                    <div className="absolute bottom-full right-0 mb-2 w-72 bg-popover border border-border shadow-2xl rounded-xl p-4 z-50 animate-in fade-in zoom-in-95 ring-1 ring-black/5 dark:ring-white/10">
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b">
                                            <span className="text-sm font-bold">Manage Staff</span>
                                            <button onClick={() => setIsAssigning(false)} className="text-muted-foreground hover:bg-muted p-1 rounded-full px-2 text-xs">
                                                Close
                                            </button>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto space-y-1 mb-3 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                                            {staffList.map(s => {
                                                const isAssigned = selectedStaffIds.includes(s._id);
                                                const actuallyAssignedToThis = complaint.assignedStaff?.some(as => as._id === s._id);
                                                const isDisabled = !s.isAvailable && !actuallyAssignedToThis;

                                                return (
                                                    <div
                                                        key={s._id}
                                                        onClick={() => !isDisabled && toggleStaffSelection(s._id)}
                                                        className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${isAssigned ? 'bg-primary/10 border-primary/50' : 'hover:bg-muted/50 border-transparent'
                                                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAssigned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                                {s.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className={`text-sm font-medium truncate ${isAssigned ? 'text-foreground' : 'text-muted-foreground'}`}>{s.name}</span>
                                                                {isDisabled && <span className="text-[10px] text-red-500">Busy on other task</span>}
                                                            </div>
                                                        </div>

                                                        {isAssigned && <CheckCircle size={16} className="text-primary fill-primary/20" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={handleAssign}
                                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:brightness-110 shadow-md transition-all active:scale-95"
                                        >
                                            {selectedStaffIds.length === 0 ? "Clear Assignments" : `Save Changes (${selectedStaffIds.length})`}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsAssigning(true)}
                                    className="text-xs bg-foreground text-background px-3 py-1.5 rounded-full font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                                >
                                    Assign <span className="text-base font-bold leading-none ml-1 mb-0.5">+</span>
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
