
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

interface UploadProofParams {
    taskId: string;
    staffId: string;
    proofUrl: string;
    resolutionNotes?: string;
}

export async function uploadProof({ taskId, staffId, proofUrl, resolutionNotes }: UploadProofParams) {
    try {
        await connectDB();

        const complaint = await Complaint.findById(taskId);

        if (!complaint) {
            throw new Error("Complaint not found");
        }

        // Verify assignment (check if staffId is in assignedStaff array)
        const isAssigned = complaint.assignedStaff?.some((id: any) => id.toString() === staffId);

        if (!isAssigned) {
            throw new Error("Unauthorized: Task not assigned to you");
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    proofUrl: proofUrl,
                    resolutionNotes: resolutionNotes,
                    status: 'RESOLVED'
                },
                $push: {
                    statusHistory: {
                        status: 'RESOLVED',
                        changedBy: staffId,
                        notes: `Work resolved with proof.`
                    }
                }
            },
            { new: true, runValidators: false }
        );

        return JSON.parse(JSON.stringify(updatedComplaint));
    } catch (error: any) {
        throw new Error(`Failed to upload proof: ${error.message}`);
    }
}
