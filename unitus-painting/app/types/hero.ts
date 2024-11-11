// types/Hero.ts
export type HeroContent = {
  location: {
    text: string;
  };
  mainHeading: {
    line1: string;
    line2: string;
  };
  subheading: string;
  buttons: {
    primary: {
      text: string;
      link: string;
    };
    secondary: {
      text: string;
      link: string;
    };
  };
  videoUrl: string;
};

export const defaultHeroContent: HeroContent = {
  location: {
    text: "Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary"
  },
  mainHeading: {
    line1: "Transform Your Space",
    line2: "Professional Painting Services"
  },
  subheading: "Expert residential and commercial painting solutions delivered with precision, professionalism, and attention to detail.",
  buttons: {
    primary: {
      text: "Explore Our Services",
      link: "/services"
    },
    secondary: {
      text: "Get Free Quote",
      link: "/contact"
    }
  },
  videoUrl: "https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4"
};