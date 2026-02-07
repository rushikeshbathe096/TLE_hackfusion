
import Complaint from "@/lib/models/Complaint";
import ActivityLog from "@/lib/models/ActivityLog";
import { connectDB } from "@/lib/mongodb";
import { checkDuplicateComplaint } from "./duplicateCheck";

interface CreateComplaintData {
    userId: string;
    department: 'Road' | 'Water' | 'Electrical' | 'Sanitation';
    location: string;
    description: string;
    imageUrl?: string;
    title: string;
}

export async function createComplaint(data: CreateComplaintData) {
    await connectDB();

    // 1. Check for duplicates
    const duplicateId = await checkDuplicateComplaint(data.department, data.location);

    if (duplicateId) {
        // 2. If duplicate exists, increment frequency
        const existingDetails = await Complaint.findById(duplicateId);

        // check if user already voted (robust comparison for ObjectId vs String)
        const hasVoted = existingDetails.voters && existingDetails.voters.some((v: any) => v.toString() === data.userId.toString());

        if (hasVoted) {
            return {
                complaint: existingDetails,
                isDuplicate: true,
                message: "You have already reported this issue. We are tracking it."
            };
        }

        const newFrequency = (existingDetails.frequency || 1) + 1;
        let newPriority = existingDetails.priority || 'Low'; // Default to Low if missing

        // Dynamic Priority Formula (Thresholds: >3 Medium, >8 High)
        if (newFrequency > 8) newPriority = 'High';
        else if (newFrequency > 3) newPriority = 'Medium';

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            duplicateId,
            {
                $inc: { frequency: 1 },
                $addToSet: { voters: data.userId },
                $set: { priority: newPriority }
            },
            { new: true }
        );

        // Optional: Log the "vote" action if desired, or skip it. 
        // User didn't explicitly ask for log on vote, but logic implies activity.
        // Let's create a log for "VOTE" or "SUPPORT".
        await ActivityLog.create({
            complaintId: duplicateId,
            action: 'STATUS_CHANGE', // Or COMMENT/SUPPORT. Let's use STATUS_CHANGE as frequency/priority changed.
            actorId: data.userId,
            actorRole: 'citizen',
            newStatus: newPriority, // Tracking priority change
            metadata: { message: "Upvoted/Reported Duplicate" },
            timestamp: new Date()
        });

        return {
            complaint: updatedComplaint,
            isDuplicate: true,
            message: "A similar complaint exists. Your report has increased its priority."
        };
    }

    // 3. If no duplicate, create new complaint
    const newComplaint = await Complaint.create({
        // 🔹 REQUIRED FIELDS (NEW SCHEMA)
        title: data.title,                  // ✅ REQUIRED
        description: data.description,
        location: data.location,
        department: data.department,

        // 🔹 USER REFERENCES
        createdBy: data.userId,              // ✅ replaces old userId
        voters: [data.userId],               // keeps your original logic

        // 🔹 OPTIONAL
        imageUrl: data.imageUrl,

        // 🔹 DUPLICATE / WORKFLOW DEFAULTS
        frequency: 1,
        status: "OPEN",

        // 🔹 AUDIT TRAIL (VERY IMPORTANT)
        statusHistory: [
            {
                status: "OPEN",
                changedBy: data.userId,
                notes: "Complaint registered by citizen",
            },
        ],
    });


    // 4. Log Activity
    await ActivityLog.create({
        complaintId: newComplaint._id,
        action: 'CREATED',
        actorId: data.userId,
        actorRole: 'citizen',
        newStatus: 'Pending',
        timestamp: new Date()
    });

    return {
        complaint: newComplaint,
        isDuplicate: false,
        message: "Complaint submitted successfully."
    };
}
