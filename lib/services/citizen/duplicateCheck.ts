
import Complaint from "@/lib/models/Complaint";
import { connectDB } from "@/lib/mongodb"; // Assuming there is a dbConnect helper, I should check lib/mongodb.ts

export async function checkDuplicateComplaint(department: string, location: string): Promise<string | null> {
    await connectDB();

    // Normalizing location for better matching (simple case-insensitive trimmed match)
    // In a real app, this would use geospatial data or fuzzy search
    const normalizedLocation = new RegExp(`^${location.trim()}$`, 'i');

    const existingComplaint = await Complaint.findOne({
        department: department,
        location: { $regex: normalizedLocation },
        status: { $in: ['OPEN', 'IN_PROGRESS', 'ON_HOLD'] } // Only check active complaints
    });

    if (existingComplaint) {
        return existingComplaint._id.toString();
    }

    return null;
}
