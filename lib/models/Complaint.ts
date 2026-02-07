import mongoose from "mongoose";

/* ---------------- STATUS HISTORY ---------------- */
const StatusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED"],
        required: true,
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    notes: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

/* ---------------- COMPLAINT SCHEMA ---------------- */
const ComplaintSchema = new mongoose.Schema(
    {
        /* ---- CORE INFO (Citizen) ---- */
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        department: {
            type: String,
            enum: ["Road", "Water", "Electrical", "Sanitation"],
            required: true,
        },

        imageUrl: {
            type: String,
        },

        /* ---- DUPLICATE HANDLING ---- */
        frequency: {
            type: Number,
            default: 1,
        },

        voters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        /* ---- WORKFLOW ---- */
        status: {
            type: String,
            enum: ["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED"],
            default: "OPEN",
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Staff
            default: null,
        },

        /* ---- STAFF RESOLUTION ---- */
        proofUrl: {
            type: String,
        },

        resolutionNotes: {
            type: String,
        },

        statusHistory: [StatusHistorySchema],

        /* ---- AUDIT ---- */
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // creates createdAt & updatedAt automatically
    }
);

/* ---- DUPLICATE DETECTION INDEX ---- */
ComplaintSchema.index({ department: 1, location: 1 });

/* ---------------- EXPORT ---------------- */
const Complaint =
    mongoose.models.Complaint ||
    mongoose.model("Complaint", ComplaintSchema);

export default Complaint;