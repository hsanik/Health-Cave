# HealthCave Role Assignment System

## 🎯 **How Users Get Different Roles**

### **1. 🟢 Patient Role (Default)**
**How to become a Patient:**
- **Automatic**: All new users start as "patient" role
- **Registration**: Sign up through `/register` page
- **Booking**: When booking first appointment, role upgrades from "user" to "patient"
- **Access**: Basic health management features

**Patient Journey:**
```
New User Registration → "user" role → Book Appointment → "patient" role
```

### **2. 🔵 Doctor Role**
**How to become a Doctor:**
- **Step 1**: Apply through `/doctorApply` page
- **Step 2**: Admin reviews application in `/dashboard/makeDoctor`
- **Step 3**: Admin approves application
- **Step 4**: User gets "doctor" role and access to doctor dashboard

**Doctor Journey:**
```
User → Apply via /doctorApply → Admin Review → Admin Approval → Doctor Role
```

**Doctor Application Process:**
1. Fill out comprehensive application form
2. Provide medical credentials and qualifications
3. Submit for admin review
4. Wait for admin approval
5. Get doctor dashboard access

### **3. 🔴 Admin Role**
**How to become an Admin:**
- **Method 1**: Hardcoded admin emails in system
- **Method 2**: Database role assignment
- **Method 3**: Super admin promotion

**Current Admin Emails:**
```javascript
const adminEmails = [
  'admin@healthcave.com',
  'admin@example.com', 
  'admin@gmail.com'
]
```

## 🔄 **Role Assignment Flow**

### **Registration Process:**
```javascript
// 1. User registers
POST /api/auth/register
{
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "user" // Default role
}

// 2. Role determination on login/dashboard access
- Check session.user.role
- If "user" or undefined → Check if doctor exists
- If doctor exists → role = "doctor"
- If admin email → role = "admin"  
- Default → role = "patient"
```

### **Doctor Application Flow:**
```javascript
// 1. User applies to be doctor
POST /doctorApply
{
  name: "Dr. Sarah Johnson",
  specialization: "Cardiology",
  experience: "10 years",
  qualification: "MD, MBBS",
  hospital: "City Hospital",
  email: "sarah@example.com",
  phone: "+1234567890",
  language: "English",
  image: "profile-url",
  role: "user"
}

// 2. Admin reviews and approves
POST /makeDoctor
- Moves application from doctorApply → doctors collection
- User now has doctor role access
```

## 🛠️ **Current Implementation**

### **Role Detection Logic:**
```javascript
export const determineUserRole = async (session) => {
  // 1. Check session role first
  if (session.user.role && session.user.role !== 'user') {
    return session.user.role
  }

  // 2. Check if user is in doctors collection
  const doctors = await fetchDoctors()
  const isDoctor = doctors.some(doctor => doctor.email === session.user.email)
  if (isDoctor) return 'doctor'

  // 3. Check if user is admin
  const adminEmails = ['admin@healthcave.com', ...]
  if (adminEmails.includes(session.user.email)) return 'admin'

  // 4. Default to patient
  return 'patient'
}
```

### **Automatic Role Upgrades:**
- **User → Patient**: When booking first appointment
- **User → Doctor**: When admin approves doctor application
- **User → Admin**: Manual assignment or hardcoded email list

## 📋 **Role Permissions**

### **🟢 Patient Permissions:**
- View own appointments
- Book new appointments
- Access own medical records
- Message doctors
- Update profile

### **🔵 Doctor Permissions:**
- Manage own appointments
- View patient records (assigned patients)
- Set availability schedule
- Message patients
- Practice analytics
- Update profile

### **🔴 Admin Permissions:**
- Manage all users
- Approve/reject doctor applications
- View all appointments
- System analytics
- Manage doctors list
- Full platform access

## 🚀 **Recommended Improvements**

### **1. Database Role Storage:**
Instead of checking collections every time, store role in user document:

```javascript
// User Schema Enhancement
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String, // "admin", "doctor", "patient"
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Role Update API:**
```javascript
// PUT /api/users/:id/role
{
  role: "doctor", // New role
  updatedBy: "admin_user_id" // Who made the change
}
```

### **3. Admin Management System:**
Create admin management instead of hardcoded emails:

```javascript
// Admin Collection
{
  userId: ObjectId,
  permissions: ["manage_doctors", "manage_users", "view_analytics"],
  createdBy: ObjectId,
  createdAt: Date
}
```

## 🔧 **How to Test Roles**

### **Test as Patient:**
1. Register with any email
2. Login → Automatically gets patient dashboard
3. Book appointment → Role confirmed as patient

### **Test as Doctor:**
1. Register with any email
2. Apply via `/doctorApply`
3. Login as admin → Approve application in `/dashboard/makeDoctor`
4. Login with doctor email → Gets doctor dashboard

### **Test as Admin:**
1. Register with admin email (`admin@healthcave.com`)
2. Login → Automatically gets admin dashboard
3. Can manage all users and doctors

## 📝 **Current Role Assignment Summary**

| Role | How to Get | Access Level | Dashboard Features |
|------|------------|--------------|-------------------|
| **Patient** | Default for all users | Basic | Appointments, Records, Messages |
| **Doctor** | Apply + Admin Approval | Practice Management | Patients, Availability, Analytics |
| **Admin** | Hardcoded Email List | Full System Access | All Users, Doctors, System Analytics |

The system is designed to be secure with proper role validation and prevents unauthorized access to sensitive features.