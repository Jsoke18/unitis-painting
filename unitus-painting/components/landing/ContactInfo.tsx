import React from 'react';

const ContactInfo: React.FC = () => {
  const contactItems = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7d8ee5b0123c4dd454057713d162a84ac767e9c75ccfc2dc27b11c60e73cfc46?apiKey=a05a9fe5da54475091abff9f564d40f8&",
      title: "Mail Us",
      content: "info@unitispainting.com"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/593cd582d27b84b24313b0d1b839b1b5187fd0d16dcd4a5b2a41a1a002429803?apiKey=a05a9fe5da54475091abff9f564d40f8&",
      title: "Call Us",
      content: "604-357-4787"
    }
  ];

  return (
    <div className="flex gap-4 self-start mt-1">
      {contactItems.map((item, index) => (
        <React.Fragment key={index}>
          <img loading="lazy" src={item.icon} alt={`${item.title} icon`} className="object-contain shrink-0 aspect-square rounded-[100px] w-[68px]" />
          <div className="flex flex-col my-auto">
            <div className="self-start text-xl font-bold leading-tight text-blue-950">
              {item.title}
            </div>
            <div className="mt-3 text-base leading-loose text-zinc-500">
              {item.content}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContactInfo;