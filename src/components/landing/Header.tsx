"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { chatHref, ctaHref, navLinks } from "@/data/landing";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="landing-header">
      <div className="landing-container landing-nav">
        <Link href="/" className="landing-logo" aria-label="AstroLife AI home">
          <span className="landing-logo-mark">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <span>AstroLife AI</span>
        </Link>

        <nav className="landing-nav-links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="landing-nav-actions">
          <Link href="/login" className="landing-login">
            Login
          </Link>
          <Link href={ctaHref} className="landing-btn landing-btn-sm landing-btn-primary">
            Generate Free Kundli
          </Link>
        </div>

        <button className="landing-menu-btn" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="landing-mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="landing-mobile-actions">
            <Link href={chatHref} className="landing-btn landing-btn-ghost" onClick={() => setOpen(false)}>
              Ask AI Astrologer
            </Link>
            <Link href={ctaHref} className="landing-btn landing-btn-primary" onClick={() => setOpen(false)}>
              Generate Free Kundli
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
