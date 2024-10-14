import React from 'react';

interface StatisticsCardProps {
  iconSrc: string;
  value: string;
  description: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ iconSrc, value, description }) => {
  return (
    <section className="flex flex-col items-center px-7 pt-8 pb-5 bg-zinc-100 min-w-[240px] w-[278px] max-md:px-5">
      <div className="flex overflow-hidden items-start w-[72px]">
        <div className="flex overflow-hidden flex-col justify-center items-center min-h-[73px] w-[72px]">
          <img loading="lazy" src={iconSrc} alt="" className="object-contain w-full aspect-[0.99]" />
        </div>
      </div>
      <h2 className="mt-3.5 text-4xl font-extrabold tracking-wide leading-tight text-center text-blue-950">
        {value}
      </h2>
      <p className="mt-3.5 text-lg tracking-wide text-center text-blue-950">
        {description}
      </p>
    </section>
  );
};

export default StatisticsCard;