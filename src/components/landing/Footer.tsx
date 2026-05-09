import Link from "next/link";
import { Sparkles } from "lucide-react";
import { footerColumns } from "@/data/landing";

export function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-grid">
        <div>
          <Link href="/" className="landing-logo" aria-label="AstroLife AI home">
            <span className="landing-logo-mark">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <span>AstroLife AI</span>
          </Link>
          <p>AI-powered Vedic Astrology Intelligence OS.</p>
        </div>

        <div className="landing-footer-columns">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => (
                <Link key={link} href="#">
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="landing-container landing-footer-bottom">
        <span>© 2026 AstroLife AI. All rights reserved.</span>
        <span>Guidance-oriented astrology, not fear-based predictions.</span>
      </div>
    </footer>
  );
}
