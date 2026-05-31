'use client';

import { useRouter } from 'next/navigation';
import { DirectionBLanding } from '@/components/landing/direction-b';

export default function LandingBPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  return <DirectionBLanding showTestimonials={true} onGetStarted={handleGetStarted} />;
}
