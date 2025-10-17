# 🏥 HealthCave

> Your digital companion for a healthier tomorrow

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://healthcave.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/hsanik/Health-Cave)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**🌐 Live Website:** [https://healthcave.vercel.app/](https://healthcave.vercel.app/)  
**📂 Repository:** [https://github.com/hsanik/Health-Cave](https://github.com/hsanik/Health-Cave)

HealthCave is a modern, full-featured health and wellness platform that bridges the gap between patients and healthcare providers. Built with cutting-edge technologies, it offers a seamless experience for managing your health journey, consulting with professionals, and accessing wellness resources—all in one place.

## ✨ Why HealthCave?

We believe healthcare should be accessible, efficient, and user-focused. HealthCave brings together patients, doctors, nutritionists, and trainers in a digital ecosystem designed to make health management effortless. Whether you're tracking your BMI, booking a consultation, or relaxing with audio therapy, we've got you covered.

---

## � Keey Features

### � **User Management & Authentication**
- 🔐 **Secure Authentication** - NextAuth.js with multiple providers (Email, Google, GitHub)
- 👥 **Role-Based Access Control** - Separate dashboards for Patients, Doctors, and Admins
- 📧 **Email Verification** - Secure account verification via email
- 🔑 **Password Reset** - Forgot password functionality with secure token-based reset
- 📸 **Profile Photo Upload** - Upload and update profile pictures via ImgBB API
- ✏️ **Profile Management** - Complete profile editing with real-time updates

### 👨‍⚕️ **Doctor Features**
- 📋 **Doctor Directory** - Browse verified healthcare professionals with detailed profiles
- 🔍 **Advanced Search & Filters** - Filter by specialization, availability, price, and location
- ⭐ **Doctor Ratings** - View ratings and patient reviews
- 📅 **Dynamic Availability** - Real-time schedule management with weekly off days
- � **Consultaction Fees** - Transparent pricing for each doctor
- 🏥 **Hospital/Clinic Information** - Complete practice details
- 🗣️ **Multi-Language Support** - Doctors can specify languages they speak
- 📊 **Patient Count** - Display total patients treated
- � **Quailifications & Experience** - Detailed professional credentials
- 🖼️ **Professional Photos** - High-quality profile images

### 📅 **Appointment System**
- 🕐 **Smart Booking** - Book appointments based on doctor's actual availability
- ⏰ **Time Slot Management** - 30-minute interval slots generated from doctor's schedule
- � *e*Validation Logic** - Prevents booking:
  - Past time slots
  - Doctor's off days
  - Outside working hours
  - Already booked slots
- 📆 **Weekly Schedule Display** - See doctor's complete weekly availability
- � **Appoitntment Status** - Pending, Confirmed, Cancelled, Completed
- 💳 **Payment Integration** - Stripe payment gateway for consultation fees
- 📧 **Email Notifications** - Appointment confirmations and reminders
- � **Appointtment Management** - View, cancel, or reschedule appointments
- 🕐 **12-Hour Time Format** - User-friendly time display with AM/PM

### 💬 **Communication**
- 💬 **Real-Time Chat** - Instant messaging between patients and doctors
- 🤖 **AI Health Chatbot** - 24/7 automated health assistance
- 📹 **Video Consultations** - Telemedicine appointments with video calls
- ✉️ **Email System** - Automated email notifications for important events

### 📊 **Health Tools & Calculators**
- 🧮 **BMI Calculator** - Calculate Body Mass Index with health recommendations
- 💧 **Hydration Tracker** - Monitor daily water intake
- 🔥 **Calorie Calculator** - Track daily caloric needs
- 📈 **Health Dashboard** - Personal health metrics and progress tracking

### 💳 **Payment & Billing**
- 💰 **Stripe Integration** - Secure payment processing
- 🧾 **Payment History** - Track all transactions
- 💳 **Multiple Payment Methods** - Credit/debit cards support
- 📊 **Payment Status** - Real-time payment tracking (Pending/Paid)
- 🔒 **Secure Checkout** - PCI-compliant payment processing

### 🎵 **Wellness Features**
- 🎵 **Audio Therapy** - Curated relaxation music and meditation tracks
- 📚 **Health Blog** - Wellness tips, health news, and expert advice
- 🧘‍♀️ **Meditation Resources** - Guided meditation and mindfulness content
- 💪 **Fitness Tips** - Exercise guides and workout recommendations

### 🔐 **Admin Dashboard**
- 👥 **User Management** - View and manage all users
- 👨‍⚕️ **Doctor Management** - Approve or reject doctor applications
- 📊 **Analytics** - System-wide statistics and insights
- 📅 **Appointment Overview** - Monitor all appointments
- 💰 **Payment Tracking** - View all transactions
- 🏥 **Add Doctors** - Manually add verified doctors to the system
- 📝 **Doctor Applications** - Review and process doctor registration requests

### 🎨 **User Experience**
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- ⚡ **Fast Performance** - Optimized loading and caching
- ✨ **Smooth Animations** - Framer Motion for delightful interactions
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 🌐 **Multi-Language Support** - Platform available in multiple languages

### 🔒 **Security & Privacy**
- 🔐 **Data Encryption** - All sensitive data encrypted
- 🔑 **Password Hashing** - bcrypt for secure password storage
- 🛡️ **HIPAA Compliant** - Healthcare data protection standards
- 🔒 **Secure Sessions** - JWT-based authentication
- 🚫 **XSS Protection** - Cross-site scripting prevention
- 🔐 **CSRF Protection** - Cross-site request forgery prevention
- ✉️ **Email Verification** - Prevent fake accounts
- 🔑 **Environment Variables** - Secure API key management

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **Next.js 15.5** - React framework with App Router
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🎭 **Framer Motion** - Animation library
- 🧩 **Radix UI** - Accessible component primitives
- 🎯 **React 19** - Latest React features
- 🎨 **Lucide React** - Beautiful icon library
- 🔔 **React Hot Toast** - Elegant notifications
- ⚡ **SweetAlert2** - Beautiful alerts and modals

### **Backend**
- 🔐 **NextAuth.js** - Authentication solution
- 🗄️ **MongoDB** - NoSQL database
- ✉️ **Nodemailer** - Email service
- 🔑 **bcrypt** - Password hashing
- 💳 **Stripe** - Payment processing
- 🔗 **Axios** - HTTP client

### **Additional Tools**
- 🗺️ **Leaflet** - Interactive maps
- 🤖 **React Chatbot Kit** - AI chatbot framework
- � **ImgBBB API** - Image hosting service
- 🎵 **Audio Player** - Custom audio therapy player
- 📊 **Chart.js** - Data visualization

---

## 🌐 Live Demo

**Check out the live application:** [https://healthcave.vercel.app/](https://healthcave.vercel.app/)

Experience all features firsthand:
- Browse verified doctors directory
- Use health calculators
- Explore the health blog
- Try the AI health chatbot
- Listen to relaxing audio therapy

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

---

## 🔧 Installation

### 1. **Clone the repository**
```bash
git clone https://github.com/hsanik/Health-Cave.git
cd Health-Cave
```

### 2. **Install dependencies**
```bash
npm install
# or
yarn install
```

### 3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthCave

# Server URI
NEXT_PUBLIC_SERVER_URI=http://localhost:5000

# Email Configuration (Gmail)
EMAIL_FROM=support@healthcave.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stripe Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ImgBB API (Image Upload)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### 4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

### 5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 Usage Guide

### **For Patients:**

1. **Register/Login**
   - Create account with email or social login (Google/GitHub)
   - Verify email address

2. **Complete Profile**
   - Add personal information
   - Upload profile photo
   - Set notification preferences

3. **Find Doctors**
   - Browse doctor directory
   - Use filters (specialization, availability, price)
   - View doctor profiles and ratings

4. **Book Appointment**
   - Select doctor and date
   - Choose available time slot
   - Fill appointment details
   - Complete payment

5. **Manage Appointments**
   - View upcoming appointments
   - Cancel or reschedule
   - Pay pending fees

6. **Use Health Tools**
   - Calculate BMI
   - Track hydration
   - Monitor health metrics

7. **Chat & Consult**
   - Message doctors
   - Use AI chatbot
   - Join video consultations

### **For Doctors:**

1. **Professional Registration**
   - Apply with medical credentials
   - Wait for admin approval

2. **Set Up Profile**
   - Add qualifications and experience
   - Upload professional photo
   - Set consultation fees

3. **Manage Availability**
   - Set weekly schedule
   - Mark off days
   - Update working hours

4. **Handle Appointments**
   - View appointment requests
   - Confirm or cancel
   - Mark as completed

5. **Patient Communication**
   - Chat with patients
   - Conduct video consultations
   - Send follow-up messages

### **For Admins:**

1. **Dashboard Overview**
   - View system statistics
   - Monitor user activity
   - Track payments

2. **User Management**
   - View all users
   - Manage roles
   - Handle reports

3. **Doctor Management**
   - Review applications
   - Approve/reject doctors
   - Add doctors manually

4. **Appointment Oversight**
   - Monitor all appointments
   - Resolve disputes
   - Generate reports

---

## 📁 Project Structure

```
Health-Cave/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/           # NextAuth configuration
│   │   │   ├── appointments/   # Appointment endpoints
│   │   │   ├── profile/        # Profile management
│   │   │   ├── stripe/         # Payment processing
│   │   │   └── users/          # User management
│   │   ├── dashboard/          # User Dashboards
│   │   │   ├── appointments/   # Appointment management
│   │   │   ├── profile/        # Profile settings
│   │   │   ├── availability/   # Doctor availability
│   │   │   ├── addDoctor/      # Add doctor (admin)
│   │   │   ├── doctorList/     # Doctor list (admin)
│   │   │   └── analytics/      # Analytics (admin)
│   │   ├── doctors/            # Doctor Directory
│   │   │   ├── [id]/          # Doctor detail page
│   │   │   └── page.jsx       # Doctors list
│   │   ├── book-appointment/   # Appointment Booking
│   │   │   └── [id]/          # Book with specific doctor
│   │   ├── appointment-confirmation/ # Confirmation page
│   │   ├── payment/            # Payment pages
│   │   ├── chat/               # Chat system
│   │   ├── video-call/         # Video consultation
│   │   ├── music/              # Audio therapy
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   └── doctorApply/        # Doctor application
│   ├── components/             # Reusable Components
│   │   ├── ui/                # UI components
│   │   ├── nav/               # Navigation
│   │   ├── footer/            # Footer
│   │   └── authentication/    # Auth components
│   ├── lib/                   # Utilities
│   │   ├── mongodb.js        # MongoDB connection
│   │   └── utils.js          # Helper functions
│   ├── utils/                # Utility Functions
│   │   ├── doctorUtils.js    # Doctor name formatting
│   │   └── availabilityUtils.js # Availability logic
│   └── hooks/                # Custom React Hooks
├── public/                   # Static Assets
│   ├── data/                # JSON data
│   ├── images/              # Images
│   └── audio/               # Audio files
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json             # Dependencies
```

---

## 🌟 Feature Highlights

### **Smart Appointment Booking**
Our intelligent booking system ensures you can only book valid appointments:
- ✅ Only shows available time slots
- ✅ Prevents booking past times
- ✅ Respects doctor's off days
- ✅ Shows doctor's weekly schedule
- ✅ Real-time slot availability

### **Dynamic Doctor Availability**
Each doctor has a unique schedule:
- 📅 Different working hours per day
- 🚫 Custom off days (not just weekends)
- ⏰ 30-minute time slot intervals
- 🔄 Real-time availability updates

### **Profile Photo Upload**
Seamless image upload experience:
- � Cllick camera icon to upload
- ✅ Automatic validation (type & size)
- ☁️ Cloud storage via ImgBB
- ⚡ Instant preview
- 🔄 Auto-refresh after upload

### **Comprehensive Dashboard**
Role-specific dashboards for everyone:
- 👤 **Patients**: Appointments, health tools, chat
- 👨‍⚕️ **Doctors**: Schedule, patients, earnings
- 🔐 **Admins**: Analytics, user management, oversight

---

## 🚀 Deployment

### **Vercel Deployment** (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hsanik/Health-Cave)

### **Manual Deployment**

```bash
# Build the project
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Contribution Guidelines**
- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation
- Be respectful and collaborative

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? [Open an issue](https://github.com/hsanik/Health-Cave/issues/new)

**Include:**
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

---

## 📸 Screenshots

Visit [https://healthcave.vercel.app/](https://healthcave.vercel.app/) to explore:

- 🏠 **Homepage** - Modern landing page
- 👨‍⚕️ **Doctor Directory** - Browse healthcare professionals
- 📅 **Booking System** - Smart appointment scheduling
- 💬 **Chat Interface** - Real-time messaging
- 📊 **Dashboard** - Personalized user dashboard
- 🧮 **Health Tools** - BMI calculator and more
- 🎵 **Audio Therapy** - Relaxation music player

---

## 📝 API Documentation

### **Authentication Endpoints**
```
POST /api/auth/register        - Register new user
POST /api/auth/login           - User login
POST /api/auth/verify-email    - Verify email
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password  - Reset password
```

### **Appointment Endpoints**
```
GET  /api/appointments              - Get all appointments
GET  /api/appointments/user/:id     - Get user appointments
GET  /api/appointments/doctor/:id   - Get doctor appointments
POST /api/appointments              - Create appointment
PUT  /api/appointments/:id/status   - Update status
DELETE /api/appointments/:id        - Delete appointment
```

### **Doctor Endpoints**
```
GET  /api/doctors           - Get all doctors
GET  /api/doctors/:id       - Get doctor by ID
POST /api/doctors           - Add new doctor
PUT  /api/doctors/:id       - Update doctor
```

### **Profile Endpoints**
```
GET  /api/profile/simple    - Get user profile
PUT  /api/profile/update    - Update profile
POST /api/profile/upload    - Upload profile photo
```

---

## 🔐 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTPS in production
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ NoSQL injection prevention
- ✅ XSS protection

---

## 📊 Performance Optimization

- ⚡ Next.js Image optimization
- 🗜️ Code splitting and lazy loading
- 💾 MongoDB indexing
- 🔄 Data caching strategies
- 📦 Bundle size optimization
- 🚀 CDN for static assets
- ⚡ Server-side rendering (SSR)
- 🎯 Static site generation (SSG)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by **DevBytes Team**

### **Contributors**
- **Piyal Islam** - Full Stack Developer
- **Sajid Hassan Anik** - Full Stack Developer

---

## 📧 Contact & Support

**Need help?** We're here for you!

- 🌐 **Website:** [https://healthcave.vercel.app/](https://healthcave.vercel.app/)
- ✉️ **Email:** support@healthcave.com
- 💬 **GitHub Issues:** [Report a Bug](https://github.com/hsanik/Health-Cave/issues)
- � **Twittter:** [@HealthCave](https://twitter.com/healthcave)

---

## 🙏 Acknowledgments

Special thanks to:
- **Next.js Team** - Amazing framework
- **MongoDB** - Reliable database
- **Vercel** - Seamless deployment
- **Stripe** - Secure payments
- **ImgBB** - Image hosting
- **shadcn/ui** - Beautiful components
- **Lucide** - Icon library
- **All Contributors** - Your support matters!

---

## 🎯 Roadmap

### **Coming Soon**
- [ ] Mobile app (React Native)
- [ ] Prescription management system
- [ ] Lab test booking
- [ ] Medicine delivery integration
- [ ] Health insurance integration
- [ ] Multi-language support expansion
- [ ] AI-powered diagnosis assistant
- [ ] Wearable device integration
- [ ] Telemedicine group sessions
- [ ] Health records on blockchain

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/hsanik/Health-Cave?style=social)
![GitHub forks](https://img.shields.io/github/forks/hsanik/Health-Cave?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/hsanik/Health-Cave?style=social)
![GitHub issues](https://img.shields.io/github/issues/hsanik/Health-Cave)
![GitHub pull requests](https://img.shields.io/github/issues-pr/hsanik/Health-Cave)

---

<div align="center">

### 🌟 [Visit HealthCave Live](https://healthcave.vercel.app/) 🌟

**Made with 💚 for a healthier world**

**Deployed on:** [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://healthcave.vercel.app/)

⭐ **Star us on GitHub** — it motivates us a lot!

---

**© 2025 HealthCave. All rights reserved.**

[⬆ Back to Top](#-healthcave)

</div>
