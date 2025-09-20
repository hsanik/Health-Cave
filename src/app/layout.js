import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer/footer";
import BackToTop from "@/components/back-to-top/back-to-top";


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
        <Navbar />
        <main className="mx-auto w-11/12 py-6">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
