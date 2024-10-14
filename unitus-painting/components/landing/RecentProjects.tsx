import React from 'react';

type ProjectCardProps = {
  image: string;
  title: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title }) => {
  return (
    <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow px-3.5 py-6 w-full text-2xl font-bold tracking-wide text-center bg-white border border-solid border-neutral-300 text-blue-950 max-md:mt-10">
        <img loading="lazy" src={image} alt={title} className="object-contain w-full aspect-[0.74]" />
        <div className="self-center mt-7">{title}</div>
      </div>
    </div>
  );
};

const RecentProjects: React.FC = () => {
  const projects = [
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/b9d70b61f918237578b985586656ae5afd8d14aa1149f2170500a3f425a3e7c7?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "Coal Harbour Strata" },
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/97f1dfc42de7c37375479f0b8938a79dc97335d975a1c2a8180ecfaedba31655?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "Maple Ridge Strata" },
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d2b65ac11b10b7cc7fe041d570c8d11d3018f6eef93b54a2a705d91d231ea18?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "BEST BUY Richmond" },
    { image: "https://cdn.builder.io/api/v1/image/assets/TEMP/071939787f5eb294d052e07a5376859b965984cd37311c1d5ee684f2f6f638a3?apiKey=a05a9fe5da54475091abff9f564d40f8&", title: "Storage Facilities" }
  ];

  return (
    <section className="flex flex-col items-center px-10 py-72 mt-0 w-full bg-blue-950 max-md:px-5 max-md:py-24 max-md:max-w-full">
      <h2 className="text-5xl font-extrabold tracking-wide leading-tight text-center text-white max-md:max-w-full max-md:text-4xl">
        Our Recent Projects
      </h2>
      <div className="self-stretch mt-12 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
      <button className="flex gap-2.5 px-5 py-2.5 mt-32 mb-0 ml-3.5 max-w-full text-xl font-medium tracking-wide leading-none text-center bg-zinc-100 text-blue-950 w-[197px] max-md:mt-10 max-md:mb-2.5">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/9e5413b4977f556fdd7d767fd1f595dd234611c59de7da60d5b5b1455889029b?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 aspect-[0.63] w-[22px]" />
        <span className="grow shrink my-auto w-[122px]">View Gallery</span>
      </button>
    </section>
  );
};

export default RecentProjects;