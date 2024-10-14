import React from 'react';

type TestimonialProps = {
  name: string;
  location: string;
  avatarSrc: string;
  content: string;
};

const Testimonial: React.FC<TestimonialProps> = ({ name, location, avatarSrc, content }) => {
  return (
    <div className="flex overflow-hidden flex-col border border-solid border-zinc-300 max-md:max-w-full">
      <div className="flex overflow-hidden flex-col px-10 py-10 -mt-1 w-full border border-solid border-zinc-300 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col w-full max-md:max-w-full">
          <div className="flex flex-wrap gap-5 justify-between items-start pb-7 w-full max-md:max-w-full">
            <div className="flex gap-2.5">
              <div className="flex flex-col my-auto text-2xl font-bold tracking-wide text-blue-950">
                <div className="mt-4 leading-snug">{name}</div>
                <div className="self-start mt-3.5 text-lg text-zinc-500">{location}</div>
              </div>
            </div>
            <div className="flex relative flex-col aspect-square rounded-[100px] w-[55px]">
              <img loading="lazy" src={avatarSrc} alt={`${name}'s avatar`} className="object-cover absolute inset-0 size-full rounded-[100px]" />
            </div>
          </div>
        </div>
        <p className="mt-7 text-lg tracking-wide leading-7 text-zinc-500 max-md:max-w-full">
          {content}
        </p>
      </div>
    </div>
  );
};

const CustomerFeedback: React.FC = () => {
  const testimonial = {
    name: "Nancy luther",
    location: "NewYork",
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/ff58155191ecc29c3bdae3c79770d14291662ee44036e102c5629586e66e23a9?apiKey=a05a9fe5da54475091abff9f564d40f8&",
    content: "We have had several good experiences with Blue Collar team. Most recently, they replaced our 20-year-old HVAC system with a new, modern, and more efficient system & it worked fine."
  };

  return (
    <section className="self-center mt-56 w-full max-w-[1200px] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col max-md:mt-10 max-md:max-w-full">
            <Testimonial {...testimonial} />
            <div className="flex gap-5 self-start mt-7">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d03c5582e3a943fb5ffc8393127d6661bc87e59a268d765f7930fbbabfaf1bd8?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Testimonial image 1" className="object-contain w-full aspect-square rounded-[100px] w-[50px]" />
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0b180addfa846bb6a5e0a2f39e401e298a6bfc880f26c6f084d45ffc93a0c45f?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Testimonial image 2" className="object-contain w-full aspect-square rounded-[100px] w-[50px]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow w-full bg-amber-400 max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-col items-start py-12 pr-20 pl-10 w-full bg-amber-400 max-md:px-5 max-md:max-w-full">
              <div className="flex flex-col w-48 max-w-full bg-zinc-100">
                <div className="flex gap-2.5 px-5 py-2.5 bg-zinc-100 max-md:pr-5">
                  <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f572d1c73f449c4d473989daee1ebdbeabe3e764c0449ffabb95960b8c3c3ba?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain w-full aspect-[0.81] w-[22px]" />
                  <div className="flex flex-col self-start mt-2 text-lg font-medium tracking-wide text-blue-950">
                    <div className="z-10">Any Question</div>
                  </div>
                </div>
              </div>
              <h3 className="z-10 mt-4 text-2xl font-extrabold tracking-wide leading-8 text-blue-950 w-[447px]">
                We're Here to Help
              </h3>
              <p className="z-10 mt-4 text-lg tracking-wide leading-7 text-blue-950 max-md:max-w-full">
                Have questions about your painting project? Need a quote or assistance? Our team is ready to provide expert support. Contact us:
              </p>
              <div className="flex gap-5 mt-3">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8bf65fbc994aecc4c06114c730704d90d1e1ba958689be049655fde2691a0a3?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Phone icon" className="object-contain w-full aspect-square rounded-[100px] w-[50px]" />
                <div className="my-auto text-3xl font-extrabold tracking-wide text-white basis-auto">
                  604-357-4787
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;