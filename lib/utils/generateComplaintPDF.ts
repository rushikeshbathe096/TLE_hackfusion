
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateComplaintPDF = async (complaint: any, user: any) => {
    try {
        const doc = new jsPDF();

        // -- Header --
        doc.setFillColor(33, 33, 33); // Dark background
        doc.rect(0, 0, 210, 40, 'F');

        // Add Logo
        try {
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

        // Handle if user object is passed directly or populated from API
        const userName = user.name || "N/A";
        const userEmail = user.email || "N/A";
        const userPhone = user.phoneNumber || "N/A";
        const userAddress = user.address || "N/A";

        doc.text(`Name: ${userName}`, 14, 62);
        doc.text(`Email: ${userEmail}`, 14, 67);
        doc.text(`Phone: ${userPhone}`, 14, 72);

        const splitAddress = doc.splitTextToSize(`Address: ${userAddress}`, 90);
        doc.text(splitAddress, 14, 77);

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
                ['Community Impact', `${complaint.frequency || 1} Report(s)`]
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
        return true;

    } catch (err) {
        console.error("PDF Generation Error:", err);
        return false;
    }
};
