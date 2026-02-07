
import Complaint from "@/lib/models/Complaint";
import ActivityLog from "@/lib/models/ActivityLog";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function getComplaintDetails(complaintId: string) {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
        throw new Error("Invalid Complaint ID");
    }

    const complaint = await Complaint.findById(complaintId).lean();

    if (!complaint) {
        return null;
    }

    const activityLogs = await ActivityLog.find({ complaintId })
        .sort({ timestamp: 1 }) // Chronological order
        .populate('actorId', 'name role') // Populate actor details
        .lean();

    return {
        ...complaint,
        timeline: activityLogs
    };
}
