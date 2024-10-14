import React from 'react';

interface ContactInfoProps {
  icon: string;
  text: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text }) => (
  <div className="flex gap-6 mt-10 max-md:mt-10">
    <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 w-6 aspect-square" />
    <div className="basis-auto">{text}</div>
  </div>
);

export default ContactInfo;