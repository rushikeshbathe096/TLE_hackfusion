
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";
import { calculatePriority } from "./calculatePriority";

export async function getDepartmentComplaints(department: string) {
    await connectDB();

    const complaints = await Complaint.find({ department })
        .populate("assignedStaff", "name email")
        .populate("createdBy", "name")
        .lean();

    // Calculate priority and sort
    const complaintsWithPriority = complaints.map((complaint: any) => {
        const priorityScore = calculatePriority({
            frequency: complaint.frequency || 1,
            createdAt: complaint.createdAt
        });
        return { ...complaint, priorityScore };
    });

    // Sort: Priority Score DESC, then CreatedAt ASC
    complaintsWithPriority.sort((a: any, b: any) => {
        if (b.priorityScore !== a.priorityScore) {
            return b.priorityScore - a.priorityScore; // Higher priority first
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Older first (if same priority)
    });

    return complaintsWithPriority;
}
