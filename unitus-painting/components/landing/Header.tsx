import React from 'react';
import SocialIcons from './SocialIcons';
import ContactInfo from './ContactInfo';

type HeaderProps = {
  openingHours: string;
};

const Header: React.FC<HeaderProps> = ({ openingHours }) => {
  return (
    <header className="flex overflow-hidden flex-col bg-white">
      <div className="flex flex-col justify-center items-center px-16 py-5 w-full bg-zinc-100 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between max-w-full w-[1162px]">
          <div className="my-auto text-lg tracking-wide text-blue-950">
            Opening Hours: {openingHours}
          </div>
          <SocialIcons />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 justify-between self-center mt-16 max-w-full tracking-wide w-[1163px] max-md:mt-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Company logo" className="object-contain shrink-0 max-w-full aspect-[2.31] w-[250px]" />
        <ContactInfo />
      </div>
    </header>
  );
};

export default Header;