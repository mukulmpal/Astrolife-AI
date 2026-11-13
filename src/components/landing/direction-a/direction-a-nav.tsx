'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PanchangStrip } from './panchang-strip';

interface DirectionANavProps {
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export function DirectionANav({ onSignIn, onGetStarted }: DirectionANavProps) {
  const [solid, setSolid] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  // Scroll spy to highlight active section in navbar
  useEffect(() => {
    const sectionIds = ['features', 'how', 'pricing', 'testimonials'];

    const handleScrollSpy = () => {
      // Find all target top-level sections and their absolute document offsets
      const sections = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return { id, top, height: el.offsetHeight };
        })
        .filter((s): s is { id: string; top: number; height: number } => s !== null);

      sections.sort((a, b) => a.top - b.top);

      const triggerPoint = window.scrollY + 200;

      // If user is near the very top of the page (Hero & Problem section), clear highlight
      if (window.scrollY < 400) {
        setActiveSection('');
        return;
      }

      let current = '';
      for (const section of sections) {
        if (triggerPoint >= section.top && triggerPoint < section.top + section.height) {
          current = `#${section.id}`;
          break;
        }
      }

      if (!current) {
        for (let i = sections.length - 1; i >= 0; i--) {
          if (triggerPoint >= sections[i].top) {
            current = `#${sections[i].id}`;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } catch {
      // In case client env missing during build
    }
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      window.location.reload();
    } catch (e) {
      console.error('Logout error:', e);
      window.location.assign('/logout');
    }
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 transition-all duration-500 shadow-xs"
      style={{
        background: solid ? 'color-mix(in srgb, var(--al-bg) 92%, transparent)' : '#FAF5EB',
        backdropFilter: solid ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${solid ? 'var(--al-line)' : 'rgba(184, 134, 11, 0.25)'}`,
      }}
    >
      <PanchangStrip />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3 md:px-10">
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2 sm:gap-3 group"
        >
          <svg width="24" height="24" viewBox="-12 -12 24 24" style={{ color: 'var(--al-gold)' }} className="sm:w-[26px] sm:h-[26px] transition-transform duration-300 group-hover:scale-110">
            <circle r="10.5" stroke="currentColor" strokeWidth="0.7" fill="none" />
            <polygon points="0,-6 5,3 -5,3" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <polygon points="0,6 5,-3 -5,-3" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle r="1.9" fill="var(--al-accent)" />
          </svg>
          <span
            className="font-serif text-base sm:text-lg font-medium uppercase transition-colors group-hover:text-amber-400"
            style={{ color: 'var(--al-ivory)', letterSpacing: '0.18em' }}
          >
            AstroLife
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:gap-9 md:flex">
          {[
            ['Features', '#features'],
            ['How It Works', '#how'],
            ['Pricing', '#pricing'],
            ['Reviews', '#testimonials'],
          ].map(([label, href]) => {
            const isActive = activeSection === href;
            return (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className={`group relative text-sm transition-colors duration-200 ${
                  isActive ? 'font-semibold text-amber-400' : 'hover:text-amber-300'
                }`}
                style={{ color: isActive ? '#D4AF37' : 'var(--al-ivory-dim)' }}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                    isActive ? 'w-full shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'w-0 group-hover:w-full'
                  }`}
                  style={{ background: '#D4AF37' }}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-medium transition-colors hover:text-amber-400"
                style={{ color: 'var(--al-ivory)' }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border transition-opacity hover:opacity-80"
                style={{
                  color: 'var(--al-ivory-dim)',
                  borderColor: 'rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                title="Sign out of AstroLife"
                type="button"
              >
                Logout
              </button>
              <Link
                href="/dashboard"
                className="cursor-pointer rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-semibold tracking-wide transition-transform duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))',
                  color: 'var(--al-bg)',
                }}
              >
                Open Dashboard ✦
              </Link>
            </>
          ) : (
            <>
              <a
                href="/login"
                onClick={(event) => {
                  if (!onSignIn) return;
                  event.preventDefault();
                  onSignIn();
                }}
                className="hidden text-sm font-medium sm:inline"
                style={{ color: 'var(--al-ivory)' }}
              >
                Sign in
              </a>
              <button
                onClick={onGetStarted}
                className="cursor-pointer rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-semibold tracking-wide transition-transform duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))',
                  color: 'var(--al-bg)',
                }}
              >
                <span className="hidden sm:inline">Generate </span>Free Kundli
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
