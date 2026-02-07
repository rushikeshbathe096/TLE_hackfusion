
import { connectToDatabase } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";

interface UploadProofParams {
    taskId: string;
    staffId: string;
    proofUrl: string;
    resolutionNotes?: string;
}

export async function uploadProof({ taskId, staffId, proofUrl, resolutionNotes }: UploadProofParams) {
    try {
        await connectToDatabase();

        const complaint = await Complaint.findById(taskId);

        if (!complaint) {
            throw new Error("Complaint not found");
        }

        // Verify assignment
        if (complaint.assignedTo.toString() !== staffId) {
            throw new Error("Unauthorized: Task not assigned to you");
        }

        complaint.proofUrl = proofUrl;
        if (resolutionNotes) {
            complaint.resolutionNotes = resolutionNotes;
        }

        // Auto-resolve if proof is uploaded? Or just update fields. 
        // User requirements say "Upload proof ... Add resolution notes", usually implies marking resolved or part of resolution.
        // For now, just update fields. User can set status to RESOLVED separately or we could mandate it.
        // Let's assume this is just for updating the proof details.

        await complaint.save();

        return JSON.parse(JSON.stringify(complaint));
    } catch (error: any) {
        throw new Error(`Failed to upload proof: ${error.message}`);
    }
}
