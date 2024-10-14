import React from 'react';
import ExpertCard from './ExpertCard';
import { ExpertData } from './types';

const expertsData: ExpertData[] = [
  {
    name: "Bryce Cayer",
    role: "Founder, CEO & Senior Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/cf72a73794addb48e118d48ed8fd9df05d23efc742a83b6c00432f6a380ab7be?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    extraClasses: "px-5 py-7"
  },
  {
    name: "Chris Mitchell",
    role: "Founder, CFO & Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/527eb9fd150b2dc616b08704dd770335f6b0468c0406969ed0844a3022c06913?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    extraClasses: "px-9 py-6 mt-5"
  },
  {
    name: "Keith Yung",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aaa37d679a479b152a382a5b4fc557b7f357085d15234b44c323d8a7f6e5300?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    extraClasses: "px-9 pt-5 pb-3.5"
  },
  {
    name: "Colin Atkinson",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/bca02830c6de5692db82cdcd1537747f9818df9eca024a115cca1a7ff0eb2f4e?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    extraClasses: "px-10 py-6"
  },
  {
    name: "Kyle Rooney",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/765e8b96e602ceb349572b150a35fec30f2ac8ecd359320856f421735adbd718?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    extraClasses: "px-9 py-6"
  },
  {
    name: "Tony Balazs",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/3da8d9d953149e442f735f85f3a2f8f359fcf9d934895b7bc78df1dc21125129?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    extraClasses: "px-5 py-6"
  }
];

const ExpertTeam: React.FC = () => {
  return (
    <section className="flex flex-col max-w-[855px] mx-auto"> {/* mx-auto centers the component */}
      <h1 className="self-center text-5xl font-extrabold tracking-wide leading-tight text-center text-blue-950 max-md:text-4xl">
        Meet Our Experts
      </h1>
      <p className="self-center mt-3 text-lg tracking-wide leading-7 text-center text-zinc-500 max-md:max-w-full">
        Our people are fully qualified with all types of services whether it's a commercial, residential <br /> or industrial you'll get a top-notch service.
      </p>
      <div className="mt-32 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {expertsData.slice(0, 2).map((expert, index) => (
            <div key={index} className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <ExpertCard {...expert} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 w-full max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {expertsData.slice(2, 4).map((expert, index) => (
            <div key={index} className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <ExpertCard {...expert} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 w-full max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {expertsData.slice(4, 6).map((expert, index) => (
            <div key={index} className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <ExpertCard {...expert} />
            </div>
          ))}
        </div>
      </div>
      <ExpertCard
        name="Michael Powell"
        role="Client Relations"
        imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/1614588dec73992d594aa34099aaf2a59503d4115a4d534b76fd10e1f9f0d194?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
        extraClasses="px-8 py-6 mt-24 max-w-full w-[387px]"
        containerClasses="flex flex-col items-center self-center tracking-wide border border-solid border-neutral-300 text-blue-950 max-md:px-5 max-md:mt-10"
      />
    </section>
  );
};

export default ExpertTeam;
