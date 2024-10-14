import React from 'react';
import { Button } from '@/components/ui/button'; // ShadCN Button

interface CallToActionProps {
  title: string;
  buttonText: string;
  imageSrc: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ title, buttonText, imageSrc }) => {
  return (
    <section className="bg-gray-50">
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between max-w-7xl mx-auto py-24 px-6 lg:px-12">
        {/* Text and Button Section */}
        <div className="flex flex-col w-full lg:w-[40%] text-center lg:text-left">
          <h1 className="text-5xl font-bold tracking-tight leading-tight text-gray-900 lg:text-6xl">
            {title}
          </h1>
          <Button 
            className="mt-8 px-6 py-4 bg-blue-950 text-white hover:bg-blue-900 rounded-full text-lg flex items-center justify-center gap-2 max-w-xs mx-auto lg:mx-0"
          >
            {buttonText}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-[60%] relative mt-12 lg:mt-0">
          <img
            src={imageSrc}
            alt="Hero"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
