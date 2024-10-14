import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="self-center mt-36 ml-12 w-full max-w-[1293px] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/40bdd8d9e849a2ed648dd9efc17fb3b71e147b9339057819d1399c473abb5c78?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="About Us image" className="object-contain grow w-full aspect-[0.99] max-md:mt-10 max-md:max-w-full" />
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-2.5 self-start px-5 py-2.5 text-lg font-medium tracking-wide bg-zinc-100 text-blue-950">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/a6541163e4bf1852241762a0c8ee1a22a288d858023b089b89e66e3285944b6d?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-[0.85] w-[23px]" />
              <div className="basis-auto">Expect The Best</div>
            </div>
            <h2 className="mt-7 text-4xl font-extrabold tracking-wide leading-none text-blue-950 max-md:max-w-full">
              We Deliver Quality and Excellence
            </h2>
            <p className="mt-5 text-xl tracking-wide leading-7 text-zinc-500 max-md:mr-1.5 max-md:max-w-full">
              Unitus Painting Ltd. was founded in 2013. We are trusted professionals, offering high-quality painting services across Greater Vancouver, Fraser Valley, BC Interior, and Calgary.
            </p>
            <p className="mt-4 mr-14 text-xl tracking-wide leading-7 text-zinc-500 max-md:mr-2.5 max-md:max-w-full">
              With over 11 years of experience, we specialize in commercial, strata, and residential painting, while also offering services like caulking, wood replacement, power washing, and more. Our clients appreciate our professionalism, attention to detail, and competitive pricing.
            </p>
            <div className="mt-4 max-w-full w-[622px]">
              <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-[34%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow items-center px-10 py-11 w-full font-extrabold tracking-wide text-center bg-zinc-100 max-md:px-5 max-md:mt-10">
                    <div className="text-7xl leading-none text-amber-400 max-md:text-4xl">11</div>
                    <div className="mt-7 text-xl leading-7 text-blue-950">Years Of <br /> Experience</div>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[66%] max-md:ml-0 max-md:w-full">
                  <ul className="flex flex-col items-start self-stretch my-auto text-xl tracking-wide leading-none text-zinc-500 max-md:mt-10">
                    <li className="self-stretch">- Complete painting and repair services</li>
                    <li className="mt-4">- Skilled and qualified professionals</li>
                    <li className="mt-5">- Full workmanship guarantee</li>
                    <li className="mt-4">- Affordable and reliable</li>
                    <li className="mt-6">- Exceptional customer service</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;