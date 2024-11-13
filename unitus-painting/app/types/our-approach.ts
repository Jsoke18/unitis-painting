// app/types/our-approach.ts
export type KeyFeature = {
  icon: string;
  label: string;
};

export type ProcessStep = {
  icon: string;
  title: string;
  description: string;
};

export type Button = {
  text: string;
  link: string;
};

export type CTASection = {
  title: string;
  subtitle: string;
  primaryButton: Button;
  secondaryButton: Button;
};

export type HeroSection = {
  title: string;
  subtitle: string;
};

export type OurApproachContent = {
  hero: HeroSection;
  keyFeatures: KeyFeature[];
  processSteps: ProcessStep[];
  cta: CTASection;
};