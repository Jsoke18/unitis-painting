import React from 'react';

type ServiceTabProps = {
  icon: string;
  label: string;
  isActive: boolean;
};

const ServiceTab: React.FC<ServiceTabProps> = ({ icon, label, isActive }) => {
  const baseClasses = "flex gap-2.5 px-10 py-4 border border-solid max-md:px-5";
  const activeClasses = isActive ? "bg-white border-white" : "bg-amber-400 border-blue-950";

  return (
    <div className={`${baseClasses} ${activeClasses}`}>
      <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 w-9 aspect-square" />
      <div className="my-auto basis-auto">{label}</div>
    </div>
  );
};

const Services: React.FC = () => {
  const services = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f609be6373b67a1e7974196a374686fb06bda7407dbe85f6522226505a64d686?apiKey=a05a9fe5da54475091abff9f564d40f8&", label: "COMMERCIAL", isActive: true },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd2445a0273933dddf4aa9d5fad6ff30e1941c1c1713fa460f07ac89658f9cbd?apiKey=a05a9fe5da54475091abff9f564d40f8&", label: "STRATA", isActive: false },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6063ad228250655345711f681d6b31e4523ef155d6ed94a7a76a8dd4a1b2ec50?apiKey=a05a9fe5da54475091abff9f564d40f8&", label: "RESIDENTIAL", isActive: false }
  ];

  return (
    <section className="flex z-10 flex-col items-center px-20 pt-28 mt-36 w-full bg-amber-400 max-md:px-5 max-md:pt-24 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col items-center ml-4 max-w-full w-[1160px]">
        <div className="flex gap-2.5 px-5 py-2.5 max-w-full text-lg font-medium tracking-wide text-center bg-zinc-100 text-blue-950 w-[223px]">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/2fb1571042200156160d3ff53ccaf903449ecdb9924e0162bf226193ecaf3fb8?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-[0.85] w-[23px]" />
          <div className="grow shrink my-auto w-[145px]">View All Services</div>
        </div>
        <h2 className="mt-8 text-4xl font-extrabold tracking-wide leading-none text-center text-blue-950 max-md:max-w-full">
          Expert Painting Solutions for Every Space
        </h2>
        <p className="mt-7 text-lg tracking-wide leading-7 text-center text-blue-950 max-md:max-w-full">
          Unitus Painting Ltd offers a wide range of painting services for commercial, strata, and residential properties. We are committed to delivering professional results while maintaining high standards of quality, safety, and efficiency. Our customers appreciate our focus on minimizing disruptions, meticulous attention to detail, and competitive pricing.
        </p>
        <div className="flex flex-wrap gap-5 justify-between mt-6 max-w-full text-lg font-semibold tracking-wide leading-loose whitespace-nowrap text-neutral-800 w-[764px]">
          {services.map((service, index) => (
            <ServiceTab key={index} {...service} />
          ))}
        </div>
        <div className="self-stretch px-16 pt-32 pb-16 mt-14 bg-white shadow-[-1px_6px_18px_rgba(0,0,0,0.09)] max-md:px-5 max-md:pt-24 max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            Continuing from where we left off:

            <div className="flex flex-col w-[55%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow items-start tracking-wide text-blue-950 max-md:mt-10 max-md:max-w-full">
                <h3 className="text-4xl font-extrabold leading-none">Commercial Services</h3>
                <p className="self-stretch mt-10 text-lg leading-7 text-zinc-500 max-md:max-w-full">
                  At Unitus Painting Ltd, we provide expert commercial painting services to enhance your building's appearance. Whether it's refreshing the exterior, updating interiors, or painting common areas, our skilled team ensures high-quality results that boost your property's aesthetic and professionalism.
                </p>
                <button className="px-11 py-7 mt-9 text-xl font-semibold bg-amber-400 border-2 border-amber-400 border-solid max-md:px-5">
                  Read More
                </button>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[45%] max-md:ml-0 max-md:w-full">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d1b5c36af93a6b25b46964e94f894cbae859c1dacce4938ef288dd0342d49ec9?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Commercial painting service" className="object-contain grow mt-3 w-full aspect-[1.33] max-md:mt-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;