import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer/footer";
import BackToTop from "@/components/back-to-top/back-to-top";
import { Toaster } from "react-hot-toast";
import AuthSessionProvider from "@/components/providers/session-provider";
import ChatbotComponent from "./chatbot/ChatbotComponent";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "HealthCave",
  description: "Your trusted online medical platform — connect with doctors, get health advice, and book appointments from home.",
  icons: {
    icon: "images/logo01.png",
    shortcut: "images/logo01.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body className="antialiased">
        <AuthSessionProvider>
          <Navbar />
          <main className="mx-auto w-11/12 py-6">
            {children}
          </main>
          <div className="chatbot-container">
            <ChatbotComponent />
          </div>
          <Footer />
          <BackToTop />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
