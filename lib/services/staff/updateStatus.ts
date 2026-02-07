
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

interface UpdateStatusParams {
    taskId: string;
    staffId: string;
    status: 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED';
    notes?: string;
}

export async function updateStatus({ taskId, staffId, status, notes }: UpdateStatusParams) {
    try {
        await connectDB();

        const complaint = await Complaint.findById(taskId);

        if (!complaint) {
            throw new Error("Complaint not found");
        }

        // Verify assignment
        if (complaint.assignedTo.toString() !== staffId) {
            throw new Error("Unauthorized: Task not assigned to you");
        }

        // Update status and push to history
        complaint.status = status;
        complaint.statusHistory.push({
            status,
            changedBy: staffId,
            timestamp: new Date(),
            notes: notes || `Status updated to ${status}`
        });

        await complaint.save();

        return JSON.parse(JSON.stringify(complaint));
    } catch (error: any) {
        throw new Error(`Failed to update status: ${error.message}`);
    }
}
