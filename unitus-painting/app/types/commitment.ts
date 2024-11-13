export interface CommitmentContent {
    title: string;
    paragraphs: string[];
    button: {
      text: string;
      link: string;
    };
    image: {
      src: string;
      alt: string;
    };
  }