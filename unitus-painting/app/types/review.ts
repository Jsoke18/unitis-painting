// types/reviews.ts
export interface Review {
    name: string;
    location: string;
    avatarSrc: string;
    content: string;
    rating: number;
    date: string;
  }
  
  export interface ReviewsData {
    testimonials: Review[];
    stats: {
      totalProjects: number;
      yearsInBusiness: number;
      serviceAreas: number;
      averageRating: number;
    };
  }