
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

export async function getAssignedTasks(staffId: string) {
    try {
        await connectDB();

        // Find complaints assigned to this staff member (using assignedStaff array)
        // Sort by updatedAt descending (newest activity first)
        const tasks = await Complaint.find({ assignedStaff: staffId })
            .sort({ updatedAt: -1 })
            .populate('createdBy', 'name email') // Optional: show citizen info
            .lean();

        return JSON.parse(JSON.stringify(tasks));
    } catch (error: any) {
        throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
}
