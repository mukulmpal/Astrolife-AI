'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DirectionALanding } from '@/components/landing/direction-a';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setIsLoggedIn(true);
        }
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <DirectionALanding
      showTestimonials
      onGetStarted={() => router.push(isLoggedIn ? '/dashboard/kundli' : '/auth/signup')}
      onSignIn={() => router.push(isLoggedIn ? '/dashboard' : '/login')}
    />
  );
}
