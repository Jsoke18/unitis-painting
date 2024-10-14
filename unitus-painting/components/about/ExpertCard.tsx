import React from 'react';
import { ExpertData } from './types';

const ExpertCard: React.FC<ExpertData> = ({ name, role, imageSrc, extraClasses, containerClasses = "" }) => {
  return (
    <div className={`flex flex-col items-center border border-solid border-neutral-300 ${extraClasses} ${containerClasses}`}>
      <div className="flex items-center self-stretch min-h-[364px]">
        <img loading="lazy" src={imageSrc} alt={`${name}, ${role}`} className="object-contain self-stretch my-auto aspect-[0.89] min-w-[240px] w-full" />
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-wide leading-10 text-center h-[39px] text-blue-950">
        {name}
      </h2>
      <p className="mt-3 text-lg tracking-wide leading-7 text-center text-zinc-500">
        {role}
      </p>
      <button className="mt-5 text-xs font-semibold tracking-tight leading-loose text-blue-950">
        About
      </button>
    </div>
  );
};

export default ExpertCard;