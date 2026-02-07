
import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATED', 'ASSIGNED', 'STATUS_CHANGE', 'COMMENT', 'IMAGE_UPLOAD']
    },
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actorRole: {
        type: String,
        enum: ['citizen', 'authority', 'staff'],
        required: true
    },
    previousStatus: {
        type: String
    },
    newStatus: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now,
        immutable: true // Ensure timestamp cannot be changed
    }
});

const ActivityLog = (mongoose.models && mongoose.models.ActivityLog) ? mongoose.models.ActivityLog : mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
