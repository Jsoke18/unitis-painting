import React from 'react';

interface FormInputProps {
  label: string;
  value?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, value }) => (
  <div className="flex flex-col grow items-start text-xs font-medium leading-loose text-neutral-400 max-md:mt-10">
    <label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</label>
    <input
      type="text"
      id={label.toLowerCase().replace(' ', '-')}
      className="object-contain self-stretch mt-2 w-full aspect-[250] border-b border-gray-300"
      value={value}
    />
  </div>
);

export default FormInput;