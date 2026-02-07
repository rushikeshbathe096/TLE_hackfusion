
"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Clock, MapPin, Activity, FileText, Download } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Complaint {
    _id: string;
    title: string;
    department: 'Road' | 'Water' | 'Electrical' | 'Sanitation';
    location: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED';
    priority: 'Low' | 'Medium' | 'High';
    frequency: number;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
}

export default function ComplaintList() {
    const { user } = useUser();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/citizen/complaints/list", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch complaints");
            }

            setComplaints(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const generatePDF = async (complaint: Complaint) => {
        if (!user) return;
        setGeneratingPdf(complaint._id);

        try {
            const doc = new jsPDF();

            // -- Header --
            doc.setFillColor(33, 33, 33); // Dark background
            doc.rect(0, 0, 210, 40, 'F');

            // Add Logo
            try {
                // Use absolute URL for the logo
                const logoUrl = `${window.location.origin}/city_logo3.png`;
                const logoImg = new Image();
                logoImg.src = logoUrl;

                // Wait for logo to load
                await new Promise((resolve) => {
                    logoImg.onload = resolve;
                    logoImg.onerror = resolve; // Continue even if logo fails
                });

                // Add logo to PDF (x, y, width, height)
                doc.addImage(logoImg, 'PNG', 14, 10, 20, 20);
            } catch (e) {
                console.warn("Logo load failed", e);
            }

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            // Adjusted x-coordinate to account for logo
            doc.text("CityPulse Citizen Report", 115, 20, { align: "center" });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 115, 30, { align: "center" });

            // -- Citizen Details --
            doc.setTextColor(33, 33, 33);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Citizen Profile", 14, 55);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Name: ${user.name}`, 14, 62);
            doc.text(`Email: ${user.email}`, 14, 67);
            doc.text(`Phone: ${user.phoneNumber || 'N/A'}`, 14, 72);
            if (user.address) {
                const splitAddress = doc.splitTextToSize(`Address: ${user.address}`, 90);
                doc.text(splitAddress, 14, 77);
            }

            // -- Complaint Summary --
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Complaint Details", 110, 55);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Title: ${complaint.title}`, 110, 62);
            doc.text(`Department: ${complaint.department}`, 110, 67);
            doc.text(`Status: ${complaint.status.replace('_', ' ')}`, 110, 72);
            doc.text(`Date Filed: ${new Date(complaint.createdAt).toLocaleDateString()}`, 110, 77);
            doc.text(`Complaint ID: ${complaint._id}`, 110, 82);

            // -- Description & Location Table --
            let startY = 95;

            autoTable(doc, {
                startY: startY,
                head: [['Field', 'Details']],
                body: [
                    ['Location', complaint.location],
                    ['Description', complaint.description],
                    ['Priority', complaint.priority],
                    ['Community Impact', `${complaint.frequency} Report(s)`]
                ],
                theme: 'grid',
                headStyles: { fillColor: [66, 66, 66] },
                styles: { fontSize: 10, cellPadding: 3 },
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
            });

            // -- Image (if available) --
            // @ts-ignore
            let finalY = doc.lastAutoTable.finalY + 10;

            if (complaint.imageUrl) {
                try {
                    // We need to fetch the image to convert it to base64 or blob for jsPDF
                    // This assumes the image URL is accessible (e.g., from public folder or generic URL)
                    // If strictly local (e.g., /uploads/...), we might need the full URL.
                    // For now, let's try strict loading if it is a relative path.
                    const imgUrl = complaint.imageUrl.startsWith("http")
                        ? complaint.imageUrl
                        : `${window.location.origin}${complaint.imageUrl}`;

                    const img = new Image();
                    img.src = imgUrl;

                    // Wait for image to load to get dims
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });

                    // Add image to PDF (fit width keeping aspect ratio, max height 80)
                    const imgProps = doc.getImageProperties(img);
                    const pdfWidth = doc.internal.pageSize.getWidth() - 28;
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    // Check if new page is needed
                    if (finalY + pdfHeight > 280) {
                        doc.addPage();
                        finalY = 20;
                    }

                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text("Attached Evidence:", 14, finalY);
                    doc.addImage(img, 'JPEG', 14, finalY + 5, pdfWidth, Math.min(pdfHeight, 100)); // Cap height at 100 to save space

                    finalY += Math.min(pdfHeight, 100) + 15;

                } catch (e) {
                    console.error("Could not add image to PDF", e);
                    doc.setFontSize(10);
                    doc.setTextColor(255, 0, 0);
                    doc.text("(Image attachment could not be loaded)", 14, finalY);
                    finalY += 10;
                }
            }

            // -- Footer --
            const pageCount = doc.internal.pages.length - 1; // fix for extra page bug in some versions
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${pageCount} - CityPulse Official Report`, 105, 290, { align: "center" });
            }

            doc.save(`Complaint_Report_${complaint._id.substring(0, 8)}.pdf`);

        } catch (err) {
            console.error("PDF Generation Error:", err);
            alert("Failed to generate PDF report.");
        } finally {
            setGeneratingPdf(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'RESOLVED': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'ON_HOLD': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'text-red-500 font-bold';
            case 'Medium': return 'text-amber-500 font-medium';
            default: return 'text-green-500';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
                <button onClick={fetchComplaints} className="ml-auto underline text-sm">Retry</button>
            </div>
        );
    }

    if (complaints.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                <p>No complaints found. Raise an issue to contribute!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
                <div key={complaint._id} className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{complaint.title}</h3>
                    <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{complaint.department}</div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{complaint.description}</p>

                    <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin size={16} />
                                <span className="truncate">{complaint.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="text-muted-foreground" />
                                <span className="text-muted-foreground">Priority: </span>
                                <span className={getPriorityColor(complaint.priority)}>{complaint.priority}</span>
                            </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex items-center justify-between pt-2">
                            {complaint.frequency > 1 && (
                                <div className="text-xs text-amber-500 font-medium">
                                    🔥 {complaint.frequency} reported
                                </div>
                            )}

                            <button
                                onClick={() => generatePDF(complaint)}
                                disabled={generatingPdf === complaint._id}
                                className="ml-auto flex items-center gap-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                                title="Download Official Report"
                            >
                                {generatingPdf === complaint._id ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <FileText size={12} />
                                )}
                                {generatingPdf === complaint._id ? "Generating..." : "PDF Report"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
