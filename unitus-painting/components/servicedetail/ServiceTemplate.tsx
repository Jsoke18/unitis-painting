import React from 'react';

interface ServiceItem {
  icon: string;
  name: string;
}

interface ProjectItem {
  image: string;
  title: string;
}

interface PageContent {
  headerTitle: string;
  headerImage: string;
  services: ServiceItem[];
  projects: ProjectItem[];
  descriptionTitle: string;
  descriptionContent: string;
  descriptionImage: string;
}

interface PageTemplateProps {
  content: PageContent;
}

const Header: React.FC<{ title: string, image: string }> = ({ title, image }) => {
  return (
    <header className="flex relative flex-col -mb-px w-full text-6xl font-extrabold tracking-wider leading-tight text-center text-white min-h-[389px] max-md:max-w-full max-md:text-4xl">
      <img loading="lazy" src={image} alt="Page header background" className="object-cover absolute inset-0 size-full" />
      <div className="relative pt-48 pr-16 pb-40 pl-24 -mt-1 mr-11 w-full bg-blue-950 bg-opacity-80 max-md:px-5 max-md:pt-24 max-md:pb-28 max-md:max-w-full max-md:text-4xl">
        {title}
      </div>
    </header>
  );
};

const ServiceList: React.FC<{ services: ServiceItem[] }> = ({ services }) => {
  return (
    <div className="flex flex-col grow min-h-[875px] max-md:mt-10">
      <div className="flex w-full min-h-[42px]" />
      <div className="flex flex-col mt-5 w-full min-h-[716px]">
        <h3 className="flex items-center w-full min-h-[59px]">
          <div className="flex overflow-hidden flex-col self-stretch my-auto max-w-[334px] w-[19px]">
            <div className="flex overflow-hidden flex-col justify-center items-center min-h-[19px] w-[19px]">
              <div className="flex w-full min-h-[19px]" />
            </div>
          </div>
          <div className="self-stretch my-auto text-3xl font-bold tracking-wide leading-snug text-blue-950 w-[262px]">
            Provided Services
          </div>
        </h3>
        {services.map((service, index) => (
          <div key={index} className="flex items-center pb-5 mt-5 w-full min-h-[58px]">
            <div className="flex overflow-hidden flex-col self-stretch my-auto max-w-[334px] w-[19px]">
              <div className="flex overflow-hidden flex-col justify-center items-center min-h-[19px] w-[19px]">
                <img loading="lazy" src={service.icon} alt={`${service.name} icon`} className="object-contain w-full aspect-square" />
              </div>
            </div>
            <div className="self-stretch pl-2.5 my-auto text-base tracking-wide text-zinc-500">
              {service.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectShowcase: React.FC<{ projects: ProjectItem[] }> = ({ projects }) => {
  return (
    <section className="self-stretch mt-44 max-md:mt-10 max-md:max-w-full">
      <h2 className="ml-4 text-3xl font-extrabold tracking-wide leading-loose text-center text-blue-950 max-md:ml-2.5">
        Project Showcase
      </h2>
      <div className="flex gap-5 mt-4 max-md:flex-col">
        {projects.map((project, index) => (
          <div key={index} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow px-6 pt-9 pb-14 text-2xl font-bold tracking-wide text-center border border-solid border-neutral-300 text-blue-950 max-md:px-5 max-md:mt-5">
              <img loading="lazy" src={project.image} alt={project.title} className="object-contain w-full aspect-[1.33]" />
              <div className="self-center mt-44 max-md:mt-10">{project.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CallToAction: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center px-16 py-16 mt-56 w-full bg-amber-400 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-wrap gap-9 max-w-full w-[552px]">
        <h2 className="flex-auto my-auto text-3xl tracking-tighter leading-none text-right text-black">
          Ready to get started?
        </h2>
        <button className="px-14 py-2.5 text-lg tracking-tight leading-8 text-center text-gray-900 bg-white rounded-lg max-md:px-5">
          Get a Quote
        </button>
      </div>
    </section>
  );
};

const MainServiceTemplate: React.FC<PageTemplateProps> = ({ content }) => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Header title={content.headerTitle} image={content.headerImage} />
      <main className="flex flex-col items-start px-14 mt-14 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="ml-20 w-full max-w-[1349px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <aside className="flex flex-col w-[27%] max-md:ml-0 max-md:w-full">
              <ServiceList services={content.services} />
            </aside>
            <section className="flex flex-col ml-5 w-[73%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col mt-20 tracking-wide max-md:mt-10 max-md:max-w-full">
                <img loading="lazy" src={content.descriptionImage} alt="Services illustration" className="object-contain w-full aspect-[1.85] max-md:mr-2.5 max-md:max-w-full" />
                <h2 className="self-start mt-7 text-3xl font-extrabold leading-loose text-center text-blue-950 max-md:max-w-full">
                  {content.descriptionTitle}
                </h2>
                <p className="mt-6 text-xl leading-7 text-black max-md:max-w-full">
                  {content.descriptionContent}
                </p>
              </div>
            </section>
          </div>
        </div>
        <ProjectShowcase projects={content.projects} />
      </main>
      <CallToAction />
    </div>
  );
};

export default MainServiceTemplate;