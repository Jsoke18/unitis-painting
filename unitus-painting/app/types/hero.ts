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