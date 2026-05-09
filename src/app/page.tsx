import { AIAgents } from "@/components/landing/AIAgents";
import { AstrologyEngines } from "@/components/landing/AstrologyEngines";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { Problem } from "@/components/landing/Problem";
import { SocialProof } from "@/components/landing/SocialProof";
import { Testimonials } from "@/components/landing/Testimonials";
import { Trust } from "@/components/landing/Trust";
import { UseCases } from "@/components/landing/UseCases";

export default function Home() {
  return (
    <>
      <Header />
      <main className="landing-page">
        <Hero />
        <SocialProof />
        <Problem />
        <Features />
        <AIAgents />
        <HowItWorks />
        <AstrologyEngines />
        <UseCases />
        <Pricing />
        <Testimonials />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
