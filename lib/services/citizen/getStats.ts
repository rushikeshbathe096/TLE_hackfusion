
import Complaint from "@/lib/models/Complaint";
import { connectDB } from "@/lib/mongodb";

export async function getCitizenStats(userId: string) {
    await connectDB();

    // Aggregation to get counts by status
    const stats = await Complaint.aggregate([
        { $match: { userId: new Object(userId) } }, // Ensure ObjectId if stored as such, or string if stored as string. Model uses ObjectId ref.
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
        if (item._id === 'Resolved') resolved = item.count;
        if (item._id === 'Pending') pending = item.count;
        if (item._id === 'In Progress') inProgress = item.count;
        if (item._id === 'Rejected') rejected = item.count;
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
