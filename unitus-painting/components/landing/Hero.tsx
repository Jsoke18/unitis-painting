import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="flex relative flex-col justify-center py-2.5 w-full text-lg tracking-wide text-white min-h-[782px] max-md:max-w-full">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9dc7082eebedd185118f716dd4106e7fb7af0f1c9a5225c7cf2d0b62945ab10f?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Background image" className="object-cover absolute inset-0 size-full" />
      <div className="flex relative flex-col items-start px-20 pt-56 pb-28 w-full bg-blue-950 bg-opacity-80 max-md:px-5 max-md:py-24 max-md:max-w-full">
        <div className="flex flex-col items-start -mb-6 max-w-full w-[712px] max-md:mb-2.5">
          <div className="flex flex-wrap gap-2.5 px-5 py-2 font-medium bg-white bg-opacity-20">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c50bfc0b5564c810ab319a1e3f5823bc288c4926cbddf24070062312f3e06e94?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-[0.91] w-[30px]" />
            <div className="flex-auto my-auto max-md:max-w-full">
              Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary
            </div>
          </div>
          <h1 className="self-stretch mt-14 text-6xl font-extrabold tracking-wider leading-[78px] max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-[58px]">
            Professional Painting Services Across Canada
          </h1>
          <button className="px-4 py-6 mt-14 font-semibold leading-loose bg-amber-400 border-2 border-amber-400 border-solid text-blue-950 max-md:pr-5 max-md:mt-10">
            Explore Our Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;