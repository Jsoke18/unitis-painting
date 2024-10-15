import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center mt-16 max-md:mt-10">
      <h1 className="text-4xl font-extrabold tracking-wide leading-loose text-center text-blue-950 max-md:max-w-full">
        About Our Exterior Painting Services
      </h1>
      <p className="mt-3.5 text-xl tracking-wide leading-7 text-black w-[910px] max-md:max-w-full">
        Improve the look and protection of your property with our expert exterior painting services. Whether you're refreshing your home's exterior, reviving worn siding, or updating a larger commercial or industrial building, our skilled painters provide lasting, high-quality results.
        <br />
        We start with thorough surface preparation, cleaning, sanding, and priming to ensure the best paint adhesion. Using top-quality, weather-resistant paints, we protect your property from moisture, UV rays, and other environmental factors. Our color consultants work with you to choose the perfect shades, and our professional application ensures a smooth, flawless finish every time.
        <br />
        With a focus on efficiency, we complete projects on time with minimal disruption to your routine. Contact us today to enhance your property's appearance and durability with our reliable exterior painting services.
      </p>
    </section>
  );
};

export default AboutSection;