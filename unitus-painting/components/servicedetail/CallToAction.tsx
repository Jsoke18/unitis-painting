import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center px-16 py-16 mt-32 w-full bg-amber-400 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-wrap gap-9 max-w-full w-[557px]">
        <h2 className="flex-auto my-auto text-3xl tracking-tighter leading-none text-right text-black">
          Ready to get started?
        </h2>
        <button className="px-14 py-2.5 text-lg tracking-tight leading-8 text-center text-gray-900 bg-white rounded-lg max-md:px-5">
          Get a Quote
        </button>
      </div>
    </section>
  );
};

export default CallToAction;