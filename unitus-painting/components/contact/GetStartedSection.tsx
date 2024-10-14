import React from 'react';
import Button from './Button';

interface GetStartedSectionProps {
  title: string;
  buttonText: string;
}

const GetStartedSection: React.FC<GetStartedSectionProps> = ({ title, buttonText }) => {
  return (
    <section className="flex relative gap-9 items-center py-16 bg-amber-400 px-[668px] max-md:px-5">
      <h2 className="z-0 self-stretch my-auto text-3xl tracking-tighter leading-none text-right text-black">
        {title}
      </h2>
      <Button text={buttonText} />
    </section>
  );
};

export default GetStartedSection;