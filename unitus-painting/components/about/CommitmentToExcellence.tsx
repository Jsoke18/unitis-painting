import React from 'react';
import { Button } from '@/components/ui/button'; // Importing ShadCN button for consistent styling
import { Card, CardContent } from '@/components/ui/card'; // Keeping the available components from ShadCN

const QuoteButton: React.FC = () => {
  return (
    <Button className="self-start px-11 py-5 mt-8 text-xl font-semibold tracking-wide bg-amber-400 border-2 border-amber-400 text-blue-950 max-md:px-5 max-md:ml-2">
      Get a Quote
    </Button>
  );
};

const ContentSection: React.FC = () => {
  return (
    <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
      <h1 className="mr-8 text-4xl font-extrabold tracking-wide leading-none text-blue-950 max-md:mr-2.5 max-md:max-w-full">
        We're Committed to Excellence
      </h1>
      <p className="mt-10 text-lg tracking-wide leading-7 text-zinc-500 max-md:max-w-full">
        At Unitus Painting, we specialize in delivering high-quality painting services for residential, commercial, strata, and industrial properties across Canada. With a team of highly skilled professionals and over a decade of experience, we're dedicated to transforming spaces with precision and care. Whether it's exterior painting to enhance curb appeal, interior painting for fresh, inviting spaces, or complex industrial jobs, we bring exceptional craftsmanship to every project.
      </p>
      <p className="mt-6 ml-2.5 text-lg tracking-wide leading-7 text-zinc-500 max-md:mr-0.5 max-md:max-w-full">
        We pride ourselves on using advanced techniques and the finest materials to ensure long-lasting and beautiful results. Our commitment to customer satisfaction drives everything we do, from the initial consultation to the final walkthrough.
      </p>
    </div>
  );
};

const CommitmentToExcellence: React.FC = () => {
  return (
    <Card className="flex gap-5 p-6 bg-white rounded-lg shadow-lg max-md:flex-col pt-56">
      <CardContent className="w-6/12 max-md:w-full">
        <ContentSection />
        <QuoteButton />
      </CardContent>
      <div className="w-6/12 max-md:w-full max-md:mt-10">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/41eeac9f89794c72f10ec685f097bc94eb8fee928a606d4ebffbd2a9bc69b97a?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
          alt="Unitus Painting project showcase"
          className="object-cover w-full rounded-2xl aspect-[1.27] max-md:max-w-full"
        />
      </div>
    </Card>
  );
};

export default CommitmentToExcellence;
