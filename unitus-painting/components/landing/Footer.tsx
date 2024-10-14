import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col pt-12 pr-5 pb-24 pl-20 w-full bg-blue-950 max-md:pl-5 max-md:max-w-full">
      <div className="flex gap-5 justify-between items-start self-center max-w-full tracking-wide text-white w-[1096px]">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/192b18d784640b366909dfe342aa9156116872eaf1e2b8f7a75c0b003757fc35?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Company logo" className="object-contain shrink-0 mt-1.5 max-w-full aspect-[2.33] w-[179px]" />
        <div className="flex flex-wrap gap-4">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/462fdce2184de3c54aac76eca5ca77a1acf7fa701e04a0fe754ded5e17cf0af6?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-square rounded-[100px] w-[68px]" />
          <div className="flex flex-col my-auto">
            <div className="self-start text-xl font-bold leading-tight">Mail Us</div>
            <div className="mt-3 text-lg">support@unitispainting</div>
          </div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e22c7e26f88d4f8a889aba91020b479e2f9dd2f1a7b4abd5cdac8c3e0c793b2?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-square rounded-[100px] w-[68px]" />
          <div className="flex flex-col my-auto">
            <div className="self-start text-xl font-bold leading-tight">Call Us</div>
            <div className="mt-3 text-lg">+01 569 896 654</div>
          </div>
        </div>
        <div className="flex gap-4">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0027d9ab16f556a4832e5175b1f06f381d2ee9eac1f4244b1155160eff7ac344?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-square rounded-[100px] w-[68px]" />
          <div className="flex flex-col my-auto">
            <div className="self-start text-xl font-bold leading-tight">Location</div>
            <div className="mt-3 text-lg">Calgary, AB</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 items-start self-end pt-12 pr-20 pb-20 mt-9 max-w-full border-t border-b border-slate-600 w-[1469px] max-md:pr-5">
        <div className="flex flex-col self-stretch">
          <p className="text-lg tracking-wide leading-7 text-white">
            We are here to fit the needs of your basic <br /> services for your dream building whether its <br />a commercial, residential or industry.
          </p>
          <div className="flex gap-4 self-start mt-14 max-md:mt-10">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/89bf102881daeb1238efa42fb07331669dec07b548e5dc6144932d0e2b40f897?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Social media icon" className="object-contain shrink-0 aspect-square rounded-[100px] w-[60px]" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/16028d8035ed792fdd69ab18bfcde158602ded044f5ffc6d414ee3a6bad0f9a3?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Social media icon" className="object-contain shrink-0 aspect-square rounded-[100px] w-[60px]" />
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ce6755edeb57992829ce976a18a509e132f9cdad5e7c1215b33c380f6ff69db6?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Social media icon" className="object-contain shrink-0 aspect-square rounded-[100px] w-[60px]" />
          </div>
        </div>
        <nav className="flex flex-col items-start text-lg tracking-wide text-white">
          <h3 className="text-xl font-bold leading-snug text-amber-400">Explore</h3>
          <ul>
            <li className="self-stretch mt-4 max-md:mr-1"><a href="#about">About Us</a></li>
            <li className="mt-6"><a href="#team">Team</a></li>
            <li className="mt-6"><a href="#blog">Blog</a></li>
            <li className="self-stretch mt-5"><a href="#locations">Locations</a></li>
          </ul>
        </nav>
        <nav className="flex flex-col items-start mt-1.5 text-lg tracking-wide text-white">
          <h3 className="self-stretch text-xl font-bold leading-snug text-amber-400">Quick Links</h3>
          <ul>
            <li className="mt-3"><a href="#home">Home</a></li>
            <li className="mt-6"><a href="#services">Services</a></li>
            <li className="mt-5"><a href="#projects">Projects</a></li>
            <li className="mt-5"><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;