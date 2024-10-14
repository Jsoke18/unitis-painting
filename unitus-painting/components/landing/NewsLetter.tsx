"use client";
import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center px-16 py-28 mt-24 w-full bg-amber-400 max-md:px-5 max-md:pt-24 max-md:mt-10 max-md:max-w-full">
      <div className="ml-6 w-full max-w-[1200px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow tracking-wide text-blue-950 max-md:mt-10 max-md:max-w-full">
              <h2 className="self-start text-3xl font-extrabold leading-snug">Subscribe To Our Blog</h2>
              <p className="mt-4 text-lg font-semibold leading-7 max-md:max-w-full">
                Stay updated with the latest painting trends, tips, and our project showcases. Get expert insights for your commercial and residential painting needs.
              </p>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <form className="flex flex-wrap text-blue-950 max-md:mt-10 max-md:max-w-full">
              <label htmlFor="email" className="sr-only">Enter your email address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="flex overflow-hidden flex-col grow shrink-0 text-lg border-l-2 border-white basis-0 border-y-2 w-fit px-6 py-7 max-md:px-5"
                required
              />
              <button type="submit" className="flex overflow-hidden flex-col text-xl font-semibold text-center whitespace-nowrap bg-white border-2 border-white border-solid px-9 py-7 max-md:px-5">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;