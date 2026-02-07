
"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Loader2, Camera, Save, User, MapPin, Phone, Calendar, FileBadge, ArrowLeft, Upload } from "lucide-react";

export default function ProfilePage() {
    const { user, refreshUser, loading: userLoading } = useUser();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const govtIdInputRef = useRef<HTMLInputElement>(null);

    // Add initial state to reset on cancel
    const [initialData, setInitialData] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        dob: "",
        phoneNumber: "",
        address: "",
        profileImage: "",
        govtIdUrl: ""
    });

    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/login");
        } else if (user) {
            const userData = {
                name: user.name || "",
                email: user.email || "",
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
                phoneNumber: user.phoneNumber || "",
                address: user.address || "",
                profileImage: user.profileImage || "",
                govtIdUrl: user.govtIdUrl || ""
            };
            setFormData(userData);
            setInitialData(userData);
        }
    }, [user, userLoading, router]);

    const calculateProgress = () => {
        if (!user) return 0;
        let fields = [];
        if (user.role === 'citizen') {
            fields = [formData.name, formData.dob, formData.email, formData.phoneNumber, formData.address, formData.profileImage];
        } else {
            fields = [formData.name, formData.dob, formData.email, formData.profileImage, formData.govtIdUrl];
        }
        const filled = fields.filter(f => f && f.length > 0).length;
        return Math.round((filled / fields.length) * 100);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'govtId') => {
        if (!isEditing) return; // Prevent upload if not editing
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setErrorMsg("");

        try {
            const token = localStorage.getItem("token");
            const form = new FormData();
            form.append("file", file);
            form.append("type", type);

            const res = await fetch("/api/user/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: form
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();

            if (type === 'profile') {
                setFormData(prev => ({ ...prev, profileImage: data.url }));
            } else {
                setFormData(prev => ({ ...prev, govtIdUrl: data.url }));
            }
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to update profile");

            await refreshUser(); // Update context
            setSuccessMsg("Profile updated successfully! Redirecting...");
            setIsEditing(false); // Switch back to view mode
            setInitialData(formData); // Update initial data

            // Redirect to dashboard based on role
            setTimeout(() => {
                if (user.role === 'citizen') router.push('/dashboard/citizen');
                else if (user.role === 'staff') router.push('/dashboard/staff');
                else if (user.role === 'authority') router.push('/dashboard/authority');
            }, 1000);

        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!user) return null;

    const progress = calculateProgress();

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full hover:bg-accent transition-colors"
                            title="Go Back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                            <p className="text-muted-foreground">Complete your profile to fully verify your account.</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">Profile Completion</span>
                        <span className={`font-bold text-sm ${progress === 100 ? "text-green-600" : "text-primary"}`}>{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${progress === 100 ? "bg-green-500" : "bg-primary"}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {progress < 100 && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Add your {user.role === 'citizen' ? 'address and photo' : 'govt ID'} to reach 100%.
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Image & Basic Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card border rounded-xl p-6 shadow-sm text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4 group">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-background shadow-lg bg-muted flex items-center justify-center">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-muted-foreground opacity-50" />
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                                            disabled={uploading}
                                        >
                                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleUpload(e, 'profile')}
                                        />
                                    </>
                                )}
                            </div>
                            <h2 className="text-xl font-bold">{formData.name || "User"}</h2>
                            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-8 shadow-sm space-y-6">
                            <h3 className="text-xl font-semibold border-b pb-4 mb-4">Personal Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 rounded-md border bg-background disabled:opacity-70 disabled:cursor-not-allowed"
                                        placeholder="John Doe"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Calendar size={14} /> Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full p-2 rounded-md border bg-background disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Email (Read Only)</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full p-2 rounded-md border bg-muted text-muted-foreground cursor-not-allowed"
                                    />
                                </div>

                                {(user.role === 'citizen') && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Phone size={14} /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="w-full p-2 rounded-md border bg-background disabled:opacity-70 disabled:cursor-not-allowed"
                                            placeholder="+91 98765 43210"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                )}
                            </div>

                            {user.role === 'citizen' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin size={14} /> Address
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-2 rounded-md border bg-background min-h-[80px] disabled:opacity-70 disabled:cursor-not-allowed"
                                        placeholder="Enter your full address..."
                                        disabled={!isEditing}
                                    />
                                </div>
                            )}

                            {(user.role === 'staff' || user.role === 'authority') && (
                                <div className="space-y-4 pt-4 border-t">
                                    <h4 className="font-medium text-sm flex items-center gap-2">
                                        <FileBadge size={16} /> Government ID Verification
                                    </h4>

                                    <div className="flex items-center gap-4">
                                        <div
                                            onClick={() => isEditing && govtIdInputRef.current?.click()}
                                            className={`border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center w-full text-muted-foreground ${isEditing ? 'cursor-pointer hover:bg-muted/50 transition-colors' : 'cursor-not-allowed opacity-70'}`}
                                        >
                                            {formData.govtIdUrl ? (
                                                <div className="text-center">
                                                    <p className="text-green-600 font-bold mb-2">ID Uploaded ✓</p>
                                                    <img src={formData.govtIdUrl} alt="Govt ID" className="h-24 object-contain mx-auto" />
                                                    {isEditing && <p className="text-xs mt-2">Click to change</p>}
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload size={24} className="mb-2" />
                                                    <span className="text-sm">Click to upload Government ID</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={govtIdInputRef}
                                            className="hidden"
                                            onChange={(e) => handleUpload(e, 'govtId')}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            )}

                            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                            {successMsg && <p className="text-green-600 text-sm font-bold">{successMsg}</p>}

                            {isEditing && (
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={loading || uploading}
                                        className="w-1/3 bg-muted text-muted-foreground py-3 rounded-lg font-bold hover:bg-muted/80 transition-opacity"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || uploading}
                                        className="w-2/3 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
