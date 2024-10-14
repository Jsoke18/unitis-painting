import React from 'react';

const NotableClients: React.FC = () => {
  const clients = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/0057f7c4d4561963734f5078a3464f4d4f0af798c40d4a924a58b830b4ccfe9d?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 1", className: "object-contain shrink-0 self-stretch my-auto max-w-full aspect-[3.72] w-[245px]" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/23e45d0ae41deb68f3a4886e27af289f43b8a92d7f244d0372457c1157ff9ca2?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 2", className: "object-contain shrink-0 self-start max-w-full aspect-[1.77] w-[154px]" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aa19ae66818b5dc74ed754a7bd4356c6e3d9a4131664e24b27c51154ef7e8cb?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 3", className: "object-contain shrink-0 self-stretch my-auto max-w-full aspect-[2.92] w-[243px]" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a8c6de74e7315654a3462be197bf2fe564cdb8aee213d0ce07eb6d99341b9d59?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 4", className: "object-contain shrink-0 self-stretch my-auto max-w-full aspect-[5.99] w-[245px]" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3319b354ea81da0086bfd6959b6a3a8ddca4939377fa04e0b036aad4d56216e?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 5", className: "object-contain shrink-0 self-stretch my-auto max-w-full aspect-[3.86] w-[301px]" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a31d639dda1fcd12e87def942d33b49296f0a7062659d83adc2280b32f839258?apiKey=a05a9fe5da54475091abff9f564d40f8&", alt: "Client logo 6", className: "object-contain shrink-0 self-stretch max-w-full aspect-[3.03] w-[276px]" }
  ];

  return (
    <section className="flex flex-col items-center px-16 mt-16 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <h2 className="self-center mt-48 ml-4 text-5xl font-extrabold tracking-wide leading-tight text-center text-blue-950 max-md:mt-10 max-md:text-4xl">
        Notable Clients
      </h2>
      <div className="flex flex-wrap gap-5 justify-between items-center self-stretch mt-16">
        {clients.map((client, index) => (
          <img key={index} loading="lazy" src={client.src} alt={client.alt} className={client.className} />
        ))}
      </div>
    </section>
  );
};

export default NotableClients;