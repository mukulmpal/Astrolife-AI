'use client';

import { DirectionBNav } from './direction-b-nav';
import { DirectionBHero } from './direction-b-hero';
import {
  DirectionBSocialBar,
  DirectionBSampleBlueprint,
  DirectionBFeatures,
  DirectionBHowItWorks,
} from './direction-b-sections';
import {
  DirectionBInsights,
  DirectionBPricing,
  DirectionBTestimonials,
  DirectionBFaq,
  DirectionBFooter,
} from './direction-b-extra-sections';

export interface DirectionBLandingProps {
  showTestimonials?: boolean;
  onGetStarted?: () => void;
}

/**
 * Direction B Landing Page - "The Observatory"
 * Direct voice, Free Vedic Kundli focused
 * Full page with all sections
 */
export function DirectionBLanding({ showTestimonials = true, onGetStarted }: DirectionBLandingProps) {
  return (
    <div style={{ background: 'var(--al-bg)', color: 'var(--al-ivory)' }}>
      <DirectionBNav onGetStarted={onGetStarted} />
      <DirectionBHero />
      <DirectionBSocialBar />
      <DirectionBSampleBlueprint />
      <DirectionBFeatures />
      <DirectionBHowItWorks />
      <DirectionBInsights />
      <DirectionBPricing />
      {showTestimonials && <DirectionBTestimonials />}
      <DirectionBFaq />
      <DirectionBFooter />
    </div>
  );
}

export default DirectionBLanding;
