export const generatePrescriptionPDF = async (prescription) => {
  // Dynamic import for client-side only
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header with border
  doc.setFillColor(67, 91, 161); // #435ba1
  doc.rect(0, 0, pageWidth, 30, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICAL PRESCRIPTION", pageWidth / 2, 15, { align: "center" });

  // Prescription Number
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Prescription #: ${prescription.prescriptionNumber}`, pageWidth / 2, 23, {
    align: "center",
  });

  yPosition = 40;

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Date and Status
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateIssued = new Date(prescription.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Date Issued: ${dateIssued}`, 15, yPosition);
  doc.text(`Status: ${prescription.status.toUpperCase()}`, pageWidth - 15, yPosition, {
    align: "right",
  });

  yPosition += 10;

  // Divider line
  doc.setDrawColor(67, 91, 161);
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);

  yPosition += 10;

  // Doctor Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Doctor Information", 15, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${prescription.doctorName}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Specialization: ${prescription.doctorSpecialization}`, 15, yPosition);
  yPosition += 5;
  doc.text(`ID: ${prescription.doctorId}`, 15, yPosition);
  yPosition += 10;

  // Patient Information Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 15, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${prescription.patientName}`, 15, yPosition);
  doc.text(`Age: ${prescription.patientAge} years`, pageWidth / 2, yPosition);
  yPosition += 5;
  doc.text(`Patient ID: ${prescription.patientId}`, 15, yPosition);
  doc.text(`Gender: ${prescription.patientGender}`, pageWidth / 2, yPosition);
  yPosition += 10;

  // Diagnosis Section
  doc.setFillColor(240, 248, 255); // Light blue background
  doc.rect(15, yPosition - 5, pageWidth - 30, 15, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Diagnosis", 17, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const diagnosisLines = doc.splitTextToSize(prescription.diagnosis, pageWidth - 40);
  doc.text(diagnosisLines, 17, yPosition);
  yPosition += diagnosisLines.length * 5 + 8;

  // Medications Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Prescribed Medications", 15, yPosition);
  yPosition += 7;

  // Medications Table
  const medicationData = prescription.medications.map((med, index) => [
    index + 1,
    med.name,
    med.dosage,
    med.frequency,
    med.duration || "N/A",
    med.instructions || "N/A",
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [["#", "Medicine", "Dosage", "Frequency", "Duration", "Instructions"]],
    body: medicationData,
    theme: "grid",
    headStyles: {
      fillColor: [67, 91, 161],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 40 },
    },
    margin: { left: 15, right: 15 },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Lab Tests Section (if any)
  if (prescription.labTests && prescription.labTests.length > 0) {
    doc.setFillColor(255, 250, 205); // Light yellow background
    doc.rect(15, yPosition - 5, pageWidth - 30, 10 + prescription.labTests.length * 5, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Lab Tests", 17, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    prescription.labTests.forEach((test, index) => {
      doc.text(`${index + 1}. ${test}`, 20, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // Follow-up Date (if any)
  if (prescription.followUpDate) {
    doc.setFillColor(240, 255, 240); // Light green background
    doc.rect(15, yPosition - 5, pageWidth - 30, 12, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Follow-up Appointment", 17, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const followUpDate = new Date(prescription.followUpDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(followUpDate, 17, yPosition);
    yPosition += 10;
  }

  // Additional Notes (if any)
  if (prescription.notes) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Notes", 15, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const notesLines = doc.splitTextToSize(prescription.notes, pageWidth - 30);
    doc.text(notesLines, 15, yPosition);
    yPosition += notesLines.length * 5 + 10;
  }

  // Footer
  const footerY = pageHeight - 40;

  // Divider line
  doc.setDrawColor(67, 91, 161);
  doc.setLineWidth(0.5);
  doc.line(15, footerY, pageWidth - 15, footerY);

  // Footer text
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("This is a digitally generated prescription.", 15, footerY + 5);
  doc.text("For any queries, please contact the doctor.", 15, footerY + 10);

  // Valid until
  const validUntil = new Date(prescription.expiresAt).toLocaleDateString();
  doc.text(`Valid until: ${validUntil}`, 15, footerY + 15);

  // Doctor's Signature
  doc.setFont("helvetica", "normal");
  doc.text("Doctor's Signature", pageWidth - 15, footerY + 5, { align: "right" });
  doc.setLineWidth(0.3);
  doc.line(pageWidth - 60, footerY + 10, pageWidth - 15, footerY + 10);
  doc.setFont("helvetica", "bold");
  doc.text(prescription.doctorName, pageWidth - 15, footerY + 15, { align: "right" });

  // Verification note
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return doc;
};

export const downloadPrescriptionPDF = async (prescription) => {
  const doc = await generatePrescriptionPDF(prescription);
  const fileName = `Prescription_${prescription.prescriptionNumber}_${prescription.patientName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};

export const getPrescriptionPDFBlob = async (prescription) => {
  const doc = await generatePrescriptionPDF(prescription);
  return doc.output("blob");
};
