import React from 'react';

interface ButtonProps {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <div className="relative flex z-0 shrink-0 self-stretch my-auto bg-white rounded-lg h-[50px] w-[202px]">
      <button className="absolute top-2/4 z-0 self-start h-8 text-lg tracking-tight leading-8 text-center text-gray-900 -translate-y-2/4 left-0 right-0 w-full">
        {text}
      </button>
    </div>
  );
};

export default Button;