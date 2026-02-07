
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

export async function getResolvedTasks(staffId: string) {
    try {
        await connectDB();

        // Find resolved complaints assigned to this staff member
        // Ideally we only want ones with proofUrl, but lets get all resolved for now
        const tasks = await Complaint.find({
            assignedStaff: staffId,
            status: 'RESOLVED'
        })
            .sort({ updatedAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(tasks));
    } catch (error: any) {
        throw new Error(`Failed to fetch resolved tasks: ${error.message}`);
    }
}
