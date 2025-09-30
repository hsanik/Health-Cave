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

## 🚀 Key Features

- **📊 Personal Health Dashboard** - Track your health stats, monitor progress, and manage your wellness goals in real-time
- **🧮 Smart Health Calculators** - Automated BMI, calorie tracking, and hydration calculators to help you stay on top of your health
- **📅 Easy Appointment Booking** - Schedule consultations with doctors, nutritionists, and fitness trainers with just a few clicks
- **💬 Real-Time Chat** - Instant messaging with healthcare providers for quick consultations and follow-ups
- **🤖 AI Health Chatbot** - Get instant answers to your health questions 24/7
- **👨‍⚕️ Doctor Profiles & Directory** - Browse and connect with verified healthcare professionals
- **📝 E-Prescription Generator** - Digital prescriptions delivered securely to your dashboard
- **💳 Secure Payment Gateway** - Safe and encrypted online payment processing for consultations
- **📱 Video Consultations** - Real-time telemedicine appointments from the comfort of your home
- **📚 Health Blog & Articles** - Stay informed with wellness tips, health news, and expert advice
- **🎵 Audio Therapy** - Relax and unwind with curated relaxation music and meditation tracks
- **🌐 Multi-Language Support** - Access the platform in your preferred language
- **🔐 Role-Based Access Control** - Customized dashboards for patients, doctors, and administrators
- **🔒 Data Security** - Your health information is encrypted and protected with industry-standard security

## 🛠️ Tech Stack

**Frontend:**
- ⚛️ Next.js 15.5 (App Router)
- 🎨 Tailwind CSS 4
- 🎭 Framer Motion for animations
- 🧩 Radix UI components
- 🎯 React 19

**Backend:**
- 🔐 NextAuth.js for authentication
- 🗄️ MongoDB for database
- 📧 Nodemailer for email services
- 🔑 bcrypt for password hashing

**Additional Tools:**
- 🗺️ Leaflet for maps
- 🤖 React Chatbot Kit
- 🎨 Lucide React icons
- 🔔 React Hot Toast for notifications
- ⚡ SweetAlert2 for beautiful alerts

## 🌐 Live Demo

**Check out the live application:** [https://healthcave.vercel.app/](https://healthcave.vercel.app/)

Experience all the features firsthand:
- Browse our verified doctors directory
- Use the BMI calculator
- Explore the health blog and resources
- Try the AI health chatbot
- Listen to relaxing audio therapy tracks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas account)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hsanik/Health-Cave.git
   cd Health-Cave
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=noreply@healthcave.com
   
   # Optional: Payment Gateway (add your keys)
   PAYMENT_API_KEY=your_payment_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage

### For Patients:
1. **Register/Login** - Create your account or sign in
2. **Complete Your Profile** - Add your health information and medical history
3. **Explore Doctors** - Browse through our verified healthcare professionals
4. **Book Appointments** - Schedule consultations at your convenience
5. **Track Your Health** - Use BMI calculators and monitor your wellness journey
6. **Chat with AI** - Get instant health tips and guidance from our chatbot

### For Doctors:
1. **Professional Registration** - Sign up with your medical credentials
2. **Set Your Availability** - Manage your consultation schedule
3. **Patient Management** - Access patient profiles and medical history
4. **Generate E-Prescriptions** - Create digital prescriptions easily
5. **Video Consultations** - Conduct online appointments seamlessly

## 📁 Project Structure

```
Health-Cave/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── (auth)/       # Authentication pages
│   │   ├── api/          # API routes
│   │   ├── chatbot/      # Chatbot implementation
│   │   ├── dashboard/    # User dashboards
│   │   ├── doctors/      # Doctor listings & profiles
│   │   └── ...
│   ├── components/       # Reusable React components
│   │   ├── authentication/
│   │   ├── footer/
│   │   ├── nav/
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions & configurations
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
│   ├── data/            # JSON data files
│   └── images/          # Image assets
└── ...
```

## 🌟 Features in Detail

### Smart Health Dashboard
Your personalized dashboard gives you a bird's-eye view of your health metrics, upcoming appointments, recent consultations, and personalized health recommendations.

### AI-Powered Chatbot
Our intelligent chatbot is trained to answer common health queries, help you navigate the platform, and provide basic health guidance 24/7.

### Secure Authentication
We use NextAuth.js with MongoDB adapter to ensure your account is protected with industry-standard security practices including password hashing and secure session management.

### Real-Time Notifications
Stay updated with instant notifications for appointment confirmations, prescription updates, and important health reminders.

## 🚀 Deployment

This project is deployed on **Vercel** for optimal performance and seamless CI/CD.

**Live Site:** [https://healthcave.vercel.app/](https://healthcave.vercel.app/)

### Deploy Your Own

You can deploy your own instance of HealthCave on Vercel:

1. Fork this repository
2. Import your fork on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hsanik/Health-Cave)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/hsanik/Health-Cave/issues/new) with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📸 Screenshots & Features

Visit [https://healthcave.vercel.app/](https://healthcave.vercel.app/) to see:

- **Homepage** - Beautiful landing page with health and wellness banner
- **Doctor Directory** - Meet our team of certified healthcare professionals:
  - Cardiac Surgery, Cardiology, Gynecology
  - Psychiatry, Orthopedics, Dermatology specialists
- **BMI Calculator** - Interactive tool with health categories
- **FAQ Section** - Comprehensive answers to common questions
- **Contact Page** - Get in touch with our support team
- **Music Therapy** - Relaxation and wellness audio tracks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the DevBytes team

## 📧 Contact

Have questions or suggestions? We'd love to hear from you!

- **Website:** [https://healthcave.vercel.app/](https://healthcave.vercel.app/)
- **Email:** support@healthcave.com
- **GitHub:** [Health-Cave Repository](https://github.com/hsanik/Health-Cave)
- **Issues:** [Report a Bug](https://github.com/hsanik/Health-Cave/issues)

## 🙏 Acknowledgments

- Thanks to all contributors who helped shape this project
- Special thanks to the Next.js and MongoDB teams for amazing documentation
- Icons by Lucide React
- UI components inspired by shadcn/ui

---

<div align="center">

### 🌟 [Visit HealthCave Live](https://healthcave.vercel.app/) 🌟

Made with 💚 for a healthier world by the DevBytes team

**Deployed on:** [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://healthcave.vercel.app/)

⭐ **Star us on GitHub** — it motivates us a lot!

[⬆ Back to Top](#-healthcave)

</div>