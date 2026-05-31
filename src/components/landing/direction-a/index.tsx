'use client';

import { DirectionANav } from './direction-a-nav';
import { DirectionAHero } from './direction-a-hero';
import {
  DirectionAProblem,
  DirectionAFeatures,
  DirectionAHowItWorks,
  DirectionAPricing,
  DirectionATestimonials,
  DirectionAClosing,
  DirectionAFooter,
} from './direction-a-sections';

export interface DirectionALandingProps {
  showTestimonials?: boolean;
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

/**
 * Direction A — "The Manuscript"
 * World-class editorial landing: celestial instrument, folio sections,
 * refined serif typography, scroll-revealed manuscript layout.
 */
export function DirectionALanding({
  showTestimonials = true,
  onGetStarted,
  onSignIn,
}: DirectionALandingProps) {
  return (
    <div id="top" style={{ background: 'var(--al-bg)', color: 'var(--al-ivory)' }}>
      <DirectionANav onSignIn={onSignIn} onGetStarted={onGetStarted} />
      <DirectionAHero onGetStarted={onGetStarted} />
      <DirectionAProblem />
      <DirectionAFeatures />
      <DirectionAHowItWorks />
      <DirectionAPricing />
      <DirectionATestimonials />
      <DirectionAClosing onGetStarted={onGetStarted} />
      <DirectionAFooter />
    </div>
  );
}

export default DirectionALanding;
