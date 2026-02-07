import Complaint from "@/lib/models/Complaint";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function getCitizenStats(userId: string) {
    await connectDB();

    // Aggregation to get counts by status
    const stats = await Complaint.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // Default values
    let totalReports = 0;
    let resolved = 0;
    let pending = 0;
    let inProgress = 0;
    let rejected = 0;

    stats.forEach(item => {
        totalReports += item.count;
        // Match ENUM values from model: OPEN, IN_PROGRESS, ON_HOLD, RESOLVED
        if (item._id === 'RESOLVED') resolved = item.count;
        if (item._id === 'OPEN') pending = item.count;
        if (item._id === 'IN_PROGRESS') inProgress = item.count;
        if (item._id === 'ON_HOLD') rejected = item.count; // Mapping ON_HOLD to rejected/pending bucket if needed, or just track it.
    });

    // Calculate "Points" (Gamification MVP)
    // 10 points for reporting, 50 for resolved? 
    // Let's just say 10 points per report for now.
    const points = totalReports * 10;

    return {
        totalReports,
        resolved,
        pending,
        inProgress,
        rejected,
        points
    };
}
