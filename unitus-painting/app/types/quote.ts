// app/types/quote.ts
export interface ProjectType {
    value: string;
    label: string;
  }
  
  export interface QuoteContent {
    heading: string;
    description: string;
    bulletPoints: string[];
    formLabels: {
      name: string;
      email: string;
      phone: string;
      projectType: string;
      submitButton: string;
    };
    projectTypes: ProjectType[];
  }
  
  export const defaultQuoteContent: QuoteContent = {
    heading: "Get a Free Quote Today",
    description: "Ready to transform your space? Whether it's a residential, commercial, strata, or hospitality we're here to bring your vision to life. Get a personalized quote for your painting needs.",
    bulletPoints: [
      "Expert consultation",
      "Tailored solutions for your project",
      "Competitive pricing",
      "Quick response time"
    ],
    formLabels: {
      name: "Your Name",
      email: "Your Email",
      phone: "Your Phone",
      projectType: "Select Project Type",
      submitButton: "Get Your Free Quote"
    },
    projectTypes: [
      { value: "residential", label: "Residential" },
      { value: "commercial", label: "Commercial" },
      { value: "strata", label: "Strata" },
      { value: "other", label: "Other" }
    ]
  };