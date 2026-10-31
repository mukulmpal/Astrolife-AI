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

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
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
        <a href="#top" className="flex items-center gap-2 sm:gap-3">
          <svg width="24" height="24" viewBox="-12 -12 24 24" style={{ color: 'var(--al-gold)' }} className="sm:w-[26px] sm:h-[26px]">
            <circle r="10.5" stroke="currentColor" strokeWidth="0.7" fill="none" />
            <polygon points="0,-6 5,3 -5,3" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <polygon points="0,6 5,-3 -5,-3" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <circle r="1.9" fill="var(--al-accent)" />
          </svg>
          <span
            className="font-serif text-base sm:text-lg font-medium uppercase"
            style={{ color: 'var(--al-ivory)', letterSpacing: '0.18em' }}
          >
            AstroLife
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:gap-9 md:flex">
          {[
            ['Features', '#features'],
            ['Astro-Vastu', '/dashboard/vastu'],
            ['Palmistry', '/dashboard/palmistry'],
            ['How it works', '#how'],
            ['Pricing', '#pricing'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative text-sm"
              style={{ color: 'var(--al-ivory-dim)' }}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--al-gold)' }}
              />
            </a>
          ))}
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
