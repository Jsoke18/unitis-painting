import React from 'react';

interface HistoryCardProps {
  icon: string;
  title: string;
  description: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-wrap gap-5 mt-10 w-full max-md:mt-10 max-md:mr-2.5 max-md:max-w-full">
      <div className="flex overflow-hidden items-start self-start">
        <div className="flex overflow-hidden flex-col justify-center items-center w-8 min-h-[32px]">
          <img loading="lazy" src={icon} alt="" className="object-contain w-full aspect-square" />
        </div>
      </div>
      <div className="flex flex-col grow shrink-0 tracking-wide basis-0 w-fit max-md:max-w-full">
        <h3 className="self-start text-xl font-extrabold leading-snug text-blue-950">{title}</h3>
        <p className="mt-2 text-lg leading-7 text-zinc-500 max-md:max-w-full">{description}</p>
      </div>
    </div>
  );
};

export default HistoryCard;