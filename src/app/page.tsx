'use client';

import { useRouter } from 'next/navigation';
import { DirectionALanding } from '@/components/landing/direction-a';

export default function Home() {
  const router = useRouter();

  return (
    <DirectionALanding
      showTestimonials
      onGetStarted={() => router.push('/auth/signup')}
      onSignIn={() => router.push('/auth/signin')}
    />
  );
}
