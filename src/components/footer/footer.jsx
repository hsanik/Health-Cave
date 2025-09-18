import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  // { href: "/dashboard", label: "Dashboard" },
]

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-11/12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:items-start gap-8 md:gap-12">
          {/* Left */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex">
              <Image
                src="/images/logo_light.png"
                alt="HealthCave"
                width={132}
                height={36}
                className="block dark:hidden object-contain"
                style={{ width: 'auto' }}
              />
              <Image
                src="/images/logo_dark.png"
                alt="HealthCave"
                width={132}
                height={36}
                className="hidden dark:block object-contain"
                style={{ width: 'auto' }}
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your trusted online medical platform — connect with doctors, get
              health advice, and book appointments from home.
            </p>
          </div>

          {/* Middle */}
          <nav className="w-full max-w-[220px] md:justify-self-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right */}
          <div className="md:justify-self-end">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Get in touch
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:support@healthcave.com"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <Mail className="size-4" /> support@healthcave.com
              </a>
              <br />
              <a
                href="tel:+10000000000"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <Phone className="size-4" /> +1 (000) 000-0000
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="size-4" />
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
      <div className='pb-4'>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} HealthCave. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

