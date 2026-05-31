'use client';

import { useRouter } from 'next/navigation';
import { DirectionALanding } from '@/components/landing/direction-a';

export default function LandingAPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <DirectionALanding
      showTestimonials={true}
      onGetStarted={handleGetStarted}
      onSignIn={handleSignIn}
    />
  );
}
