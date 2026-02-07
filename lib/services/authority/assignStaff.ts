
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/lib/models/Complaint";
import User from "@/lib/models/User";

interface AssignParams {
    complaintId: string;
    staffId: string;
    authorityDepartment: string; // To ensure authority manages their own dept
}

export async function assignStaff({ complaintId, staffId, authorityDepartment }: AssignParams) {
    await connectDB();

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    if (complaint.department !== authorityDepartment) {
        throw new Error("Unauthorized: Cannot assign complaint from another department");
    }

    const staff = await User.findById(staffId);
    if (!staff) throw new Error("Staff member not found");

    if (staff.role !== 'staff') {
        throw new Error("User assigned is not a staff member");
    }

    if (staff.department !== authorityDepartment) {
        throw new Error("Cannot assign to staff from different department");
    }

    // Update
    complaint.assignedTo = staffId;
    complaint.status = 'IN_PROGRESS'; // Automatically move to in progress or stay open? Requirement says Open -> In Progress. Assigning usually implies starting work or at least delegation. Let's keep status as is or update. User workflow: Authority assigns -> Staff executes.
    // Let's just assign. Staff might move it to In Progress. Or assignment moves it.
    // "Authority assigns, Staff executes".
    // Let's leave status change to staff or separate action, but assignment usually implies "In Progress" in many systems. 
    // However, user workflow says "OPEN -> IN_PROGRESS". If newly assigned, it's pending staff action.
    // Let's NOT change status automatically unless requested. But typically assignment means it's now being looked at.
    // I'll leave status alone for now, or maybe set to 'IN_PROGRESS' if it was 'OPEN'.
    if (complaint.status === 'OPEN') {
        complaint.status = 'IN_PROGRESS';
    }

    await complaint.save();
    return complaint;
}
