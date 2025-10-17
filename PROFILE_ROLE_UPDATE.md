# Profile Page - Role-Based Updates

## Overview
Updated the profile page to display role-specific information and fields based on whether the user is a Patient (user), Doctor, or Administrator.

## Changes Made

### 1. Role-Specific Information Sections

#### For Doctors:
**Professional Information Card**
- Specialization field
- Years of Experience
- Hospital/Clinic
- License Number
- Working Hours

**Features:**
- Only visible to users with `role: 'doctor'`
- Allows doctors to manage their professional credentials
- Information can be displayed to patients

#### For Admins:
**Administrator Information Card**
- Shows administrator privileges
- Lists system capabilities:
  - Full access to all features
  - Manage users and doctors
  - View all appointments and payments
  - System analytics and reports
  - Approve doctor applications

**Features:**
- Only visible to users with `role: 'admin'`
- Informational card showing admin capabilities
- Red-themed to indicate elevated privileges

#### For Patients (Regular Users):
**Patient Information Card**
- Shows patient features
- Lists available capabilities:
  - Book appointments with doctors
  - View medical records
  - Manage appointments
  - Secure payment processing
  - Message doctors

**Features:**
- Only visible to users with `role: 'user'`
- Informational card showing patient features
- Green-themed for patient role

### 2. Updated Profile Card (Right Side)

#### Role-Specific Badges:
- **Doctor**: Blue badge with Stethoscope icon - "Healthcare Professional"
- **Admin**: Red badge with Shield icon - "System Administrator"
- **Patient**: Green badge with User icon - "Patient"

#### Role Display:
- Color-coded role badge
- Appropriate icon for each role
- Capitalized role name

#### Doctor-Specific Stats:
- Shows specialization if available
- Shows years of experience if available
- Displayed below role badge

### 3. Updated Privacy Settings

#### Role-Specific Descriptions:
- **Doctor**: "Control your profile visibility to patients"
- **Admin**: "Administrator privacy preferences"
- **Patient**: "Control your privacy preferences"

#### Profile Visibility Toggle:
- Only shown for doctors
- Allows doctors to control if patients can see their profile

#### Email/Phone Toggles:
- **Doctor**: "Display on public profile"
- **Patient**: "Share with healthcare providers"

#### Privacy Tips:
- **Doctor**: Tip about enabling visibility for patient bookings
- **Admin**: Note that admin info is never public
- **Patient**: Note about information sharing with providers

## UI/UX Improvements

### Visual Hierarchy:
1. Basic Information (all users)
2. Role-Specific Information (conditional)
3. Notification Preferences (all users)
4. Privacy Settings (role-adapted)

### Color Coding:
- **Doctor**: Blue theme (professional, medical)
- **Admin**: Red theme (elevated, administrative)
- **Patient**: Green theme (health, wellness)

### Icons:
- **Doctor**: Stethoscope
- **Admin**: Shield
- **Patient**: User

## Benefits

### For Doctors:
✅ Can manage professional credentials
✅ Control profile visibility to patients
✅ Display specialization and experience
✅ Professional information prominently shown

### For Admins:
✅ Clear indication of admin privileges
✅ No unnecessary professional fields
✅ Privacy settings appropriate for admin role

### For Patients:
✅ Clear understanding of available features
✅ No confusing professional fields
✅ Privacy settings focused on healthcare sharing

## Technical Implementation

### Conditional Rendering:
```javascript
{session?.user?.role === 'doctor' && (
  <Card>
    {/* Doctor-specific content */}
  </Card>
)}

{session?.user?.role === 'admin' && (
  <Card>
    {/* Admin-specific content */}
  </Card>
)}

{session?.user?.role === 'user' && (
  <Card>
    {/* Patient-specific content */}
  </Card>
)}
```

### Role Detection:
- Uses `session?.user?.role` from NextAuth session
- Defaults to 'user' if role not set
- Real-time updates when role changes

## Data Flow

### Profile Load:
1. User accesses profile page
2. Session provides user role
3. Page renders role-specific sections
4. Fetches profile data from API
5. Populates fields based on role

### Profile Save:
1. User updates information
2. All fields sent to API (role-specific fields included)
3. API saves to MongoDB
4. Success message shown
5. Data refreshed

## Files Modified

- `/src/app/dashboard/profile/page.jsx` - Updated with role-based sections

## Testing Checklist

### As Doctor:
- [ ] See Professional Information section
- [ ] Can edit specialization, experience, hospital, license
- [ ] See "Healthcare Professional" badge
- [ ] Profile visibility toggle visible
- [ ] Specialization shown in profile card
- [ ] Experience shown in profile card

### As Admin:
- [ ] See Administrator Information section
- [ ] See list of admin privileges
- [ ] See "System Administrator" badge
- [ ] No professional information fields
- [ ] Privacy tip mentions admin info not public

### As Patient:
- [ ] See Patient Information section
- [ ] See list of patient features
- [ ] See "Patient" badge
- [ ] No professional information fields
- [ ] Privacy settings mention healthcare providers

### All Roles:
- [ ] Basic Information section visible
- [ ] Notification Preferences visible
- [ ] Privacy Settings visible
- [ ] Can save changes
- [ ] Changes persist after refresh
- [ ] Role badge shows correct color and icon

## Future Enhancements

1. **Doctor Verification Badge**: Show verified status for doctors
2. **Patient Health Records**: Add health history fields for patients
3. **Admin Activity Log**: Show recent admin actions
4. **Profile Completeness**: Show percentage of profile completion
5. **Profile Preview**: Allow doctors to preview public profile
6. **Role Change History**: Track when user role changed

## Summary

The profile page now provides a personalized experience based on user role:
- ✅ Doctors see professional fields
- ✅ Admins see privilege information
- ✅ Patients see feature information
- ✅ Role-specific privacy settings
- ✅ Color-coded visual indicators
- ✅ Appropriate icons for each role
- ✅ Clean, organized layout

**Each user type now has a tailored profile experience that matches their needs and role in the system!**
