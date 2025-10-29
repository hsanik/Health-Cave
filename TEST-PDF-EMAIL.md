# Quick Test Guide - PDF & Email Features

## 🧪 Test Checklist

### Prerequisites:
- ✅ Backend server running (port 5000)
- ✅ Frontend running (port 3000)
- ✅ Logged in as doctor
- ✅ Email credentials configured in server .env

---

## Test 1: PDF Download (Doctor View)

### Steps:
1. Navigate to `/dashboard/prescriptions`
2. Click on any existing prescription (or create a new one)
3. Click **"Download PDF"** button
4. Check your Downloads folder

### Expected Result:
- ✅ PDF file downloads automatically
- ✅ Filename: `Prescription_RX-2025-XXXXXX_Patient_Name.pdf`
- ✅ PDF opens and displays professionally
- ✅ All prescription details are visible
- ✅ Medications table is formatted correctly
- ✅ Footer shows doctor's signature line

### Success Toast:
```
✓ Prescription PDF downloaded successfully!
```

---

## Test 2: PDF Download (Patient View)

### Steps:
1. Login as patient (use email from prescription)
2. Navigate to `/dashboard/my-prescriptions`
3. Find a prescription card
4. Click the **download icon** (📥)
5. Check your Downloads folder

### Expected Result:
- ✅ PDF downloads automatically
- ✅ Same professional format as doctor view
- ✅ All details visible

### Success Toast:
```
✓ Prescription PDF downloaded successfully!
```

---

## Test 3: Automatic Email (On Creation)

### Steps:
1. Navigate to `/dashboard/prescriptions/create`
2. Fill in the form with **YOUR EMAIL** as Patient ID:
   ```
   Patient Name: Test Patient
   Age: 30
   Gender: Male
   Patient Email/ID: your-email@gmail.com  ← Use your real email!
   
   Diagnosis: Test prescription for email
   
   Medication:
   - Name: Test Medicine
   - Dosage: 500mg
   - Frequency: 2 times daily
   - Duration: 7 days
   ```
3. Click **"Create Prescription"**
4. Check your email inbox (within 30 seconds)

### Expected Result:
- ✅ Prescription created successfully
- ✅ Email arrives in inbox (check spam if not)
- ✅ Email has professional header
- ✅ All prescription details visible
- ✅ Medications formatted in cards
- ✅ "View Prescription Online" button works

### Email Subject:
```
New Prescription Issued - RX-2025-XXXXXX
```

---

## Test 4: Manual Email Send

### Steps:
1. Open any prescription detail page
2. Click **"Send Email"** button (green button with mail icon)
3. Wait for loading toast
4. Check patient's email inbox

### Expected Result:
- ✅ Loading toast appears: "Sending email..."
- ✅ Success toast appears: "Prescription sent to patient@email.com"
- ✅ Email arrives within seconds
- ✅ Same professional format as automatic email

### Success Toast:
```
✓ Prescription sent to patient@email.com
```

---

## Test 5: Email Content Verification

### Open the email and verify:

#### Header Section:
- ✅ Blue header with "New Prescription Issued"
- ✅ Prescription number displayed

#### Content:
- ✅ Patient name greeting
- ✅ Doctor name and specialization
- ✅ Date issued and valid until
- ✅ Diagnosis in highlighted box
- ✅ Each medication in separate card with:
  - Medicine name (bold)
  - Dosage
  - Frequency
  - Duration
  - Instructions

#### Lab Tests (if added):
- ✅ Bulleted list of tests

#### Follow-up (if added):
- ✅ Full formatted date

#### Footer:
- ✅ "View Prescription Online" button
- ✅ Disclaimer text
- ✅ Copyright notice

#### Button Test:
- ✅ Click "View Prescription Online"
- ✅ Opens browser to `/dashboard/my-prescriptions`
- ✅ Prescription is visible

---

## Test 6: PDF Content Verification

### Open the downloaded PDF and verify:

#### Page 1 Header:
- ✅ Blue header bar
- ✅ "MEDICAL PRESCRIPTION" title
- ✅ Prescription number

#### Doctor Information:
- ✅ Name, specialization, ID

#### Patient Information:
- ✅ Name, age, gender, patient ID

#### Diagnosis:
- ✅ Light blue background
- ✅ Full diagnosis text

#### Medications Table:
- ✅ Professional grid layout
- ✅ Headers: #, Medicine, Dosage, Frequency, Duration, Instructions
- ✅ All medications listed
- ✅ Readable font size

#### Lab Tests (if any):
- ✅ Yellow background
- ✅ Numbered list

#### Follow-up (if any):
- ✅ Green background
- ✅ Full date format

#### Footer:
- ✅ Divider line
- ✅ "This is a digitally generated prescription"
- ✅ Valid until date
- ✅ Doctor's signature line with name
- ✅ Generation timestamp

---

## Test 7: Error Handling

### Test Invalid Email:
1. Create prescription with invalid patient ID: "notanemail"
2. Try to send email manually
3. Expected: Error toast "Invalid patient email address"

### Test Network Error:
1. Stop the backend server
2. Try to download PDF (should still work - client-side)
3. Try to send email
4. Expected: Error toast "Failed to send email"

---

## Test 8: Multiple Medications PDF

### Create prescription with 3+ medications:
1. Add multiple medications
2. Download PDF
3. Verify table displays all medications correctly
4. Check if table fits on page

---

## Test 9: Long Text Handling

### Create prescription with long text:
```
Diagnosis: Patient presents with acute upper respiratory tract infection with associated symptoms including persistent cough, nasal congestion, mild fever, and general malaise. Physical examination reveals inflamed pharynx and enlarged cervical lymph nodes.

Notes: Patient advised to maintain adequate hydration, rest, and avoid exposure to cold environments. Follow up if symptoms persist beyond 7 days or worsen. Monitor temperature daily.
```

### Verify:
- ✅ PDF handles long text without cutting off
- ✅ Email displays full text
- ✅ Text wraps properly

---

## Test 10: Print Functionality

### Steps:
1. Open prescription detail page
2. Click **"Print"** button
3. Check print preview

### Expected Result:
- ✅ Print preview opens
- ✅ Header buttons hidden
- ✅ Prescription content visible
- ✅ Professional layout maintained
- ✅ Fits on A4 page

---

## 🐛 Common Issues & Solutions

### Issue: PDF doesn't download
**Solution**: 
- Check browser console for errors
- Try different browser (Chrome recommended)
- Clear browser cache

### Issue: Email doesn't arrive
**Solution**:
- Check spam/junk folder
- Verify patient email is valid
- Check server console for errors
- Verify EMAIL_USER and EMAIL_PASSWORD in server .env

### Issue: Email shows "Failed to send"
**Solution**:
- Check server is running
- Verify .env configuration
- Check Gmail app password is correct
- Look at server console for detailed error

### Issue: PDF formatting looks wrong
**Solution**:
- Update jsPDF: `npm update jspdf`
- Check if prescription has all required fields
- Try different browser

---

## ✅ Success Criteria

All tests pass if:
- ✅ PDF downloads work from both doctor and patient views
- ✅ PDFs are professionally formatted
- ✅ Emails send automatically on creation
- ✅ Manual email sending works
- ✅ Emails arrive within 30 seconds
- ✅ Email content is complete and formatted
- ✅ "View Online" button in email works
- ✅ Error handling works correctly
- ✅ Long text is handled properly
- ✅ Multiple medications display correctly

---

## 📊 Test Results Template

```
Test Date: _______________
Tester: _______________

[ ] Test 1: PDF Download (Doctor) - PASS/FAIL
[ ] Test 2: PDF Download (Patient) - PASS/FAIL
[ ] Test 3: Automatic Email - PASS/FAIL
[ ] Test 4: Manual Email Send - PASS/FAIL
[ ] Test 5: Email Content - PASS/FAIL
[ ] Test 6: PDF Content - PASS/FAIL
[ ] Test 7: Error Handling - PASS/FAIL
[ ] Test 8: Multiple Medications - PASS/FAIL
[ ] Test 9: Long Text - PASS/FAIL
[ ] Test 10: Print Functionality - PASS/FAIL

Overall Status: PASS/FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🎯 Quick Test (5 Minutes)

If you're short on time, run this quick test:

1. **Create prescription** with your email
2. **Download PDF** - verify it looks good
3. **Check email** - verify it arrived
4. **Click "View Online"** in email - verify it works

If all 4 steps work, the implementation is successful! ✅

---

**Ready to test? Start with Test 1 and work your way down!**
