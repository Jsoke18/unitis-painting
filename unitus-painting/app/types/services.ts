// app/types/services.ts
export type Service = {
    icon: string;
    label: string;
    title: string;
    description: string;
    imageSrc: string;
    link: string;
  };
  
  export type ServicesContent = {
    heading: string;
    description: string;
    services: Service[];
  };
  
  export const defaultServicesContent: ServicesContent = {
    heading: "Expert Painting Solutions for Every Space",
    description: "Unitus Painting Ltd offers a wide range of painting services for commercial, strata, and residential properties. We are committed to delivering professional results while maintaining high standards of quality, safety, and efficiency.",
    services: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f609be6373b67a1e7974196a374686fb06bda7407dbe85f6522226505a64d686",
        label: "COMMERCIAL",
        title: "Commercial Services",
        description: "At Unitus Painting Ltd, we provide expert commercial painting services to enhance your building's appearance. Whether it's refreshing the exterior, updating interiors, or painting common areas, our skilled team ensures high-quality results that boost your property's aesthetic and professionalism.",
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9",
        link: "/services/commercial-services",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd2445a0273933dddf4aa9d5fad6ff30e1941c1c1713fa460f07ac89658f9cbd",
        label: "STRATA",
        title: "Strata Services",
        description: "At Unitus Painting Ltd., we offer specialized strata painting services tailored to enhance the appearance and value of your property. Our experienced team delivers professional results, whether you're refreshing exteriors, updating common areas, or maintaining interior spaces.",
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/6e19be2f4a6bd20a168cbe08a71d4f039386e8a6c28ab19994bc52980b28ee59",
        link: "/services/strata-services",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6063ad228250655345711f681d6b31e4523ef155d6ed94a7a76a8dd4a1b2ec50",
        label: "RESIDENTIAL",
        title: "Residential Services",
        description: "Transform your home with Unitus Painting Ltd.'s expert residential painting services. Whether you're refreshing a single room or giving your entire home a makeover, our experienced painters deliver high-quality, long-lasting results while ensuring minimal disruption to your daily life.",
        imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/c64b6b1d6cc58d0edfa0d126db56a1f66cec314c83bdebac969ba5b68ea80532",
        link: "/services/residential",
      },
    ]
  };