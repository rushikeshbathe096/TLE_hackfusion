
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Upload, AlertCircle, X } from "lucide-react";

export default function ComplaintForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error" | "info";
        text: string;
    } | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        department: "Road",
        location: "",
        description: "",
        imageUrl: "",
    });

    const departments = ["Road", "Water", "Electrical", "Sanitation"];

    const handleLocationClick = () => {
        const mockLocations = [
            "123 Main St, Central District",
            "Near City Park, North Road",
            "456 Market Ave, West End",
            "Opposite Railway Station, East Zone",
        ];
        const randomLoc =
            mockLocations[Math.floor(Math.random() * mockLocations.length)];
        setFormData((prev) => ({ ...prev, location: randomLoc }));
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setMessage({
                type: "error",
                text: "Image size must be less than 5MB",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                imageUrl: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/citizen/complaints/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit complaint");
            }

            if (data.isDuplicate) {
                setMessage({ type: "info", text: data.message });
            } else {
                setMessage({
                    type: "success",
                    text: "Complaint submitted successfully!",
                });
                setFormData({
                    title: "",
                    department: "Road",
                    location: "",
                    description: "",
                    imageUrl: "",
                });
                router.refresh();
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Raise a Complaint</h2>

            {message && (
                <div className="p-4 rounded-lg mb-4 text-sm flex items-start gap-2">
                    <AlertCircle size={16} />
                    <span>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        type="text"
                        required
                        placeholder="Brief title of the issue"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* Department Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Issue Category (Department)</label>
                    <div className="grid grid-cols-2 gap-2">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                type="button"
                                onClick={() => setFormData({ ...formData, department: dept })}
                                className={`p-3 rounded-lg text-sm font-medium transition-all border ${formData.department === dept
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-accent hover:text-accent-foreground border-input"
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            required
                            placeholder="Enter location or use pin"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <button
                            type="button"
                            onClick={handleLocationClick}
                            className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            title="Use Current Location"
                        >
                            <MapPin size={20} />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        required
                        placeholder="Describe the issue..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                {/* IMAGE UPLOAD */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Attach Image (Optional)
                    </label>

                    {!formData.imageUrl ? (
                        <div className="border-2 border-dashed rounded-lg p-6 text-center relative">
                            <Upload size={24} className="mx-auto mb-2" />
                            <span className="text-xs">
                                Click to upload image (Max 5MB)
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    ) : (
                        <div className="relative h-48">
                            <img
                                src={formData.imageUrl}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Submitting...
                        </>
                    ) : (
                        "Submit Report"
                    )}
                </button>
            </form>
        </div>
    );
}
