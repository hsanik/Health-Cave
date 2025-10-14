# Appointments Page Updates

## Changes Made

### 1. Role-Based Access Control

**Problem**: All users could see ALL appointments in the system.

**Solution**: Implemented role-based data fetching:
- **Admin**: Can see all appointments (uses `/appointments` endpoint)
- **Doctor**: Can only see their own appointments (uses `/appointments/doctor/:doctorId` endpoint)
- **User/Patient**: Can only see their own appointments (uses `/appointments/user/:userId` endpoint)

### 2. Pay Now Button

**New Feature**: Added "Pay Now" button for unpaid appointments.

**Behavior**:
- Shows for users with `paymentStatus === "pending"`
- Only visible to regular users (not admin/doctor)
- Hidden for cancelled appointments
- Redirects to payment page: `/payment/:appointmentId`
- Prominently displayed with credit card icon
- Positioned as the primary action button

**UI Location**: 
- Appears in the action buttons section of each appointment card
- Shows before cancel/manage buttons
- Blue color to indicate primary action

### 3. Updated UI Elements

**Page Title & Description**:
- Admin: "All Appointments" - "Manage all patient appointments and schedules."
- Doctor: "My Appointments" - "Manage your patient appointments and schedules."
- User: "My Appointments" - "View and manage your appointments."

**Action Buttons by Role**:

**Admin**:
- Confirm/Cancel pending appointments
- Mark confirmed appointments as complete
- Delete any appointment

**Doctor**:
- Confirm/Cancel pending appointments
- Mark confirmed appointments as complete

**User**:
- Pay Now (if payment pending)
- Cancel pending appointments

### Backend Endpoints Used

- `GET /appointments` - All appointments (admin only)
- `GET /appointments/user/:userId` - User's appointments
- `GET /appointments/doctor/:doctorId` - Doctor's appointments

### Security Improvements

1. **Data Isolation**: Users can only access their own appointment data
2. **Action Restrictions**: Users have limited actions based on their role
3. **Privacy Protection**: Patients can't see other patients' appointments
4. **Doctor Boundaries**: Doctors can only manage their own patient appointments
5. **Payment Security**: Only unpaid appointment owners can initiate payment

### Testing Recommendations

1. **As Admin**:
   - Should see all appointments
   - Can manage all appointments (confirm, cancel, complete, delete)
   - No "Pay Now" button visible

2. **As Doctor**:
   - Should only see appointments with their patients
   - Can confirm, cancel, and complete appointments
   - Cannot delete appointments
   - No "Pay Now" button visible

3. **As Regular User**:
   - Should only see their own appointments
   - Can see "Pay Now" button for unpaid appointments
   - Can cancel pending appointments
   - Cannot confirm or complete appointments
   - Cannot delete appointments

4. **Payment Flow**:
   - User with pending payment sees "Pay Now" button
   - Clicking redirects to `/payment/:appointmentId`
   - Button disappears after payment is completed
   - Button not shown for cancelled appointments

## Files Modified

- `Health-Cave/src/app/dashboard/appointments/page.jsx`

## Next Steps

Ensure the payment page at `/payment/:appointmentId` exists and properly handles:
- Appointment ID parameter
- Payment processing
- Updating appointment payment status
- Redirecting back to appointments page after successful payment
