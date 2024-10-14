import React from 'react';

interface TimelineItemProps {
  year: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, description }) => {
  return (
    <div className="flex relative flex-col py-8 pr-24 pl-8 bg-white border border-solid border-blue-950 border-opacity-20 min-h-[141px] max-md:px-5 max-md:max-w-full mb-6">
      <p className="z-0 text-lg leading-7 text-zinc-500 max-md:max-w-full">{description}</p>
      <div className="absolute -top-3.5 px-10 py-1.5 max-w-full text-xl font-extrabold leading-snug text-amber-400 whitespace-nowrap bg-blue-950 bottom-[117px] left-[19px] right-[427px] w-[140px] max-md:px-5">
        {year}
      </div>
    </div>
  );
};

export default TimelineItem;