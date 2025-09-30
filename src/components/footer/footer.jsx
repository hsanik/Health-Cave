import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Instagram, Mail, Phone, Clock, AlertCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// X (Twitter) Icon Component
const XIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

const services = [
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/music", label: "Music Therapy" },
  { href: "/home/bmi", label: "BMI Calculator" },
  { href: "/chatbot", label: "Health Assistant" },
]

const resources = [
  { href: "/home", label: "Health Tips" },
  { href: "/about", label: "Our Mission" },
  { href: "/contact#faq", label: "FAQs" },
  { href: "/doctors", label: "Specialties" },
]

const legal = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/hipaa-compliance", label: "HIPAA Compliance" },
  { href: "/disclaimer", label: "Disclaimer" },
]

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      {/* Emergency Banner */}
      <div className="bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900">
        <div className="mx-auto w-11/12 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="size-4" />
            <p className="font-medium">
              Medical Emergency? Call 911 immediately. This platform is not for emergency services.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-11/12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/logo_light.png"
                alt="HealthCave"
                width={172}
                height={36}
                className="block dark:hidden object-contain"
              />
              <Image
                src="/images/logo_dark.png"
                alt="HealthCave"
                width={172}
                height={36}
                className="hidden dark:block object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your trusted online medical platform — connect with doctors, get
              health advice, and book appointments from home.
            </p>
            
            {/* Working Hours */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4" />
                Support Hours
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <nav className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide">
              Services
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {services.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide">
              Resources
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact & Legal */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Get in Touch
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:support@healthcave.com"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="size-4 flex-shrink-0" /> 
                  <span className="break-all">support@healthcave.com</span>
                </a>
                <a
                  href="tel:+10000000000"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="size-4 flex-shrink-0" /> +1 (000) 000-0000
                </a>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Legal
              </p>
              <ul className="flex flex-col gap-2 text-sm">
                {legal.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-10 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="size-4 text-red-500 fill-red-500" />
              <span>Caring for your health, anytime, anywhere</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (formerly Twitter)"
                >
                  <XIcon className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='py-4 border-t'>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} HealthCave. All rights reserved. | Designed with care for your health
        </p>
      </div>
    </footer>
  );
}

