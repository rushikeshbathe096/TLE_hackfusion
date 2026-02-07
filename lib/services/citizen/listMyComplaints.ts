
import Complaint from "@/lib/models/Complaint";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function listMyComplaints(userId: string) {
    await connectDB();

    // Fetch complaints where user is the creator OR a voter
    const complaints = await Complaint.find({
        $or: [
            { createdBy: userId },
            { voters: userId }
        ]
    })
        .sort({ createdAt: -1 })
        .lean();

    return complaints.map((c: any) => {
        if (!c.priority) {
            const freq = c.frequency || 1;
            if (freq > 8) c.priority = 'High';
            else if (freq > 3) c.priority = 'Medium';
            else c.priority = 'Low';
        }
        return c;
    });
}
