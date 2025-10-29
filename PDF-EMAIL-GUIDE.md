# PDF Generation & Email Notifications - Implementation Guide

## ✅ Features Implemented

### 1. PDF Generation
- **Library**: jsPDF with jspdf-autotable
- **Professional Layout**: Medical-grade prescription format
- **Auto-download**: One-click PDF download
- **Complete Information**: All prescription details included

### 2. Email Notifications
- **Automatic**: Emails sent when prescription is created
- **Manual**: "Send Email" button for resending
- **Professional Template**: HTML email with all prescription details
- **Patient Links**: Direct link to view prescription online

## 📦 Packages Installed

```bash
npm install jspdf jspdf-autotable
```

## 🔧 Configuration

### Backend (.env file in health-cave-server)

```env
# Email Configuration
EMAIL_USER=testmailpiyal0@gmail.com
EMAIL_PASSWORD=svttgfniqxsjwdhw

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000
```

**Note**: The email credentials are already configured using Gmail SMTP.

## 📄 PDF Generation Features

### What's Included in the PDF:

1. **Header Section**
   - Professional blue header with white text
   - Prescription number prominently displayed
   - Date issued and status

2. **Doctor Information**
   - Doctor name
   - Specialization
   - Doctor ID

3. **Patient Information**
   - Patient name and ID
   - Age and gender
   - Formatted in a clean layout

4. **Diagnosis**
   - Highlighted in light blue background
   - Multi-line support for long diagnoses

5. **Medications Table**
   - Professional grid layout
   - Columns: #, Medicine, Dosage, Frequency, Duration, Instructions
   - Auto-sized columns for readability

6. **Lab Tests** (if any)
   - Yellow highlighted section
   - Numbered list format

7. **Follow-up Date** (if any)
   - Green highlighted section
   - Full date format

8. **Additional Notes** (if any)
   - Plain text section
   - Multi-line support

9. **Footer**
   - Divider line
   - Legal text
   - Valid until date
   - Doctor's signature line
   - Generation timestamp

### PDF File Naming:
```
Prescription_RX-2025-001234_John_Doe.pdf
```

## 📧 Email Notification Features

### When Emails Are Sent:

1. **Automatic**: When a prescription is created
   - Checks if patient ID is a valid email
   - Sends asynchronously (doesn't block response)
   - Logs success/failure

2. **Manual**: Via "Send Email" button
   - Available on prescription detail page
   - Shows loading toast while sending
   - Confirms success with patient email

### Email Template Includes:

1. **Header**
   - Professional blue header
   - Prescription number
   - "New Prescription Issued" title

2. **Patient Greeting**
   - Personalized with patient name
   - Doctor information

3. **Prescription Details**
   - Date issued and valid until
   - Diagnosis

4. **Medications Section**
   - Each medication in a styled card
   - All details: name, dosage, frequency, duration, instructions

5. **Lab Tests** (if any)
   - Bulleted list

6. **Follow-up Date** (if any)
   - Full formatted date

7. **Additional Notes** (if any)
   - Plain text

8. **Call-to-Action Button**
   - "View Prescription Online"
   - Links to patient dashboard

9. **Footer**
   - Legal disclaimer
   - Copyright notice
   - Contact information

## 🚀 How to Use

### For Doctors:

#### Download PDF:
1. Open prescription detail page
2. Click "Download PDF" button
3. PDF automatically downloads with formatted name

#### Send Email:
1. Open prescription detail page
2. Click "Send Email" button (green button)
3. Wait for confirmation toast
4. Patient receives email immediately

### For Patients:

#### Download PDF:
1. Go to "My Prescriptions"
2. Click download icon on any prescription card
3. PDF downloads automatically

#### Receive Email:
1. Email arrives when doctor creates prescription
2. Open email to view all details
3. Click "View Prescription Online" to access dashboard
4. Download PDF from dashboard

## 🔍 API Endpoints

### Send Prescription Email
```
POST /prescriptions/:id/send-email
```

**Request:**
```bash
curl -X POST http://localhost:5000/prescriptions/[prescription-id]/send-email
```

**Response (Success):**
```json
{
  "message": "Prescription email sent successfully",
  "messageId": "abc123@gmail.com"
}
```

**Response (Error):**
```json
{
  "error": "Invalid patient email address"
}
```

## 📱 UI Updates

### Prescription Detail Page:
- **New Button**: "Send Email" (green, with mail icon)
- **Enhanced Download**: Now generates actual PDF
- **Button Order**: Edit | Send Email | Print | Download PDF

### My Prescriptions (Patient):
- **Download Icon**: Now functional, generates PDF
- **Toast Notifications**: Success/error feedback

## 🎨 PDF Styling

### Colors Used:
- **Primary Blue**: #435ba1 (header, borders)
- **Light Blue**: #f0f8ff (diagnosis background)
- **Light Yellow**: #fffacd (lab tests background)
- **Light Green**: #f0fff0 (follow-up background)

### Fonts:
- **Headers**: Helvetica Bold, 12pt
- **Body**: Helvetica Normal, 10pt
- **Title**: Helvetica Bold, 22pt

### Layout:
- **Page Size**: A4
- **Margins**: 15mm
- **Line Spacing**: 5pt
- **Section Spacing**: 10pt

## 📧 Email Styling

### HTML Email Features:
- **Responsive**: Works on all email clients
- **Inline CSS**: Maximum compatibility
- **Professional Colors**: Matches brand
- **Clear Hierarchy**: Easy to read
- **Mobile-Friendly**: Adapts to screen size

## 🧪 Testing

### Test PDF Generation:

1. **Create a test prescription**
2. **Open prescription detail page**
3. **Click "Download PDF"**
4. **Verify PDF contains:**
   - ✅ All prescription details
   - ✅ Professional formatting
   - ✅ Correct patient/doctor info
   - ✅ Medications table
   - ✅ Footer with signature

### Test Email Sending:

1. **Create prescription with valid email**
   - Use your own email as patient ID
2. **Check email inbox**
3. **Verify email contains:**
   - ✅ Professional header
   - ✅ All prescription details
   - ✅ Medications formatted nicely
   - ✅ "View Online" button works
   - ✅ Footer information

### Test Manual Email:

1. **Open existing prescription**
2. **Click "Send Email" button**
3. **Wait for success toast**
4. **Check patient email**

## 🔧 Troubleshooting

### PDF Not Downloading:

**Issue**: PDF doesn't download when clicking button

**Solutions**:
1. Check browser console for errors
2. Verify jsPDF is installed: `npm list jspdf`
3. Check if prescription data is loaded
4. Try different browser (Chrome recommended)

### Email Not Sending:

**Issue**: Email doesn't arrive

**Solutions**:
1. **Check patient email**: Must be valid email format
2. **Check server logs**: Look for email errors
3. **Verify .env file**: EMAIL_USER and EMAIL_PASSWORD set
4. **Check Gmail settings**: 
   - App password must be valid
   - Less secure apps enabled (if needed)
5. **Check spam folder**: Email might be filtered

**Issue**: "Failed to send email" error

**Solutions**:
1. Verify EMAIL_USER and EMAIL_PASSWORD in server .env
2. Check if Gmail account allows SMTP
3. Ensure app password is correct (not regular password)
4. Check server console for detailed error

### PDF Formatting Issues:

**Issue**: PDF looks wrong or cut off

**Solutions**:
1. Check if all prescription fields have data
2. Verify long text fields (diagnosis, notes)
3. Update jsPDF: `npm update jspdf`
4. Check browser compatibility

## 🔐 Security Notes

### Email Security:
- ✅ Uses app-specific password (not main password)
- ✅ SMTP over TLS
- ✅ Email validation before sending
- ✅ Error handling prevents exposure

### PDF Security:
- ✅ Generated client-side (no server storage)
- ✅ Contains only authorized data
- ✅ No sensitive credentials in PDF

## 📊 Email Delivery Status

### Success Indicators:
- ✅ Green success toast appears
- ✅ Console shows "Prescription email sent"
- ✅ Patient receives email within seconds

### Failure Indicators:
- ❌ Red error toast appears
- ❌ Console shows error details
- ❌ Check server logs for specifics

## 🎯 Best Practices

### For Doctors:

1. **Always verify patient email** before creating prescription
2. **Use "Send Email" button** if patient didn't receive initial email
3. **Download PDF** for offline records
4. **Print prescription** for physical copy if needed

### For Patients:

1. **Check spam folder** if email doesn't arrive
2. **Add sender to contacts** to ensure delivery
3. **Download PDF** for offline access
4. **Keep prescriptions** for medical records

## 🚀 Future Enhancements

### Potential Additions:

1. **PDF Attachments**: Attach PDF to email
2. **SMS Notifications**: Send SMS with prescription link
3. **Email Templates**: Multiple template options
4. **Batch Emails**: Send multiple prescriptions at once
5. **Email Scheduling**: Schedule email for later
6. **Read Receipts**: Track if patient opened email
7. **QR Code**: Add QR code to PDF for verification
8. **Digital Signature**: Add doctor's signature image to PDF
9. **Watermark**: Add "COPY" watermark for duplicates
10. **Multi-language**: Support multiple languages in PDF/email

## 📝 Code Structure

### Files Modified/Created:

**New Files:**
- `Health-Cave/src/utils/pdfGenerator.js` - PDF generation utility
- `Health-Cave/PDF-EMAIL-GUIDE.md` - This documentation

**Modified Files:**
- `health-cave-server/index.js` - Email functionality added
- `health-cave-server/.env` - Email configuration
- `Health-Cave/src/app/dashboard/prescriptions/[id]/page.jsx` - PDF & email buttons
- `Health-Cave/src/app/dashboard/my-prescriptions/page.jsx` - PDF download
- `Health-Cave/package.json` - Added jsPDF dependencies

## 🎉 Summary

You now have:
- ✅ Professional PDF generation
- ✅ Automatic email notifications
- ✅ Manual email resending
- ✅ Beautiful email templates
- ✅ One-click downloads
- ✅ Complete documentation

**Everything is working and ready to use!**

---

**Need Help?**
- Check server console for email errors
- Check browser console for PDF errors
- Verify .env configuration
- Test with your own email first
