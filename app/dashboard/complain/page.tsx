
"use client";

import ComplaintForm from "@/components/issues/ComplaintForm";

export default function ComplainPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
                <p className="text-muted-foreground mt-2">
                    Submit a new complaint regarding infrastructure issues. Please provide accurate details.
                </p>
            </div>

            <ComplaintForm />
        </div>
    );
}
