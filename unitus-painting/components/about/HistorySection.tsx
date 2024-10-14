import React from 'react';
import HistoryCard from './HistoryCard';
import TimelineItem from './TimelineItem';

interface HistorySectionProps {}

const HistorySection: React.FC<HistorySectionProps> = () => {
  const historyCards = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c32db287824a14c324ad64822f49067b613a896c62250b3f0c88dd5e66503afb?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
      title: "Our Company",
      description: "Founded with a mission to deliver top-quality painting services, Unitus Painting quickly earned a reputation for reliability and attention to detail. Over the years, we have expanded our expertise across Canada, serving homes, businesses, and large-scale developments with the same dedication to excellence."
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b8901a5a5316ba32b62fda1e63b63cdab02cfde7ac9e7f8c2ab3af4f0f876e8e?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
      title: "Our Mission",
      description: "We aim to exceed client expectations with every job, offering expert service, quality work, and competitive pricing for both residential and industrial painting needs."
    }
  ];

  const timelineItems = [
    {
      year: "2013",
      description: "Unitus Painting is founded, focusing on high-quality residential and commercial painting services"
    },
    {
      year: "2015",
      description: "Expansion into large-scale commercial and industrial painting across Canada"
    },
    {
      year: "2020",
      description: "Recognition as a trusted industry leader in residential, strata, and industrial painting services"
    },
    {
      year: "2023",
      description: "Further expansion of services, with a focus on high-rise buildings, warehousing, and hospitality sectors, reinforcing their role as a premier painting contractor across the nation"
    }
  ];

  return (
    <section className="flex flex-col justify-center items-center px-16 py-32 w-full bg-zinc-100 max-md:px-5 max-md:py-24 max-md:max-w-full mt-32">
      <div className="mb-0 ml-6 max-w-full w-[1245px] max-md:mb-2.5">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-2.5 self-start px-5 py-2.5 bg-white">
                <div className="flex overflow-hidden flex-col max-w-[136px] w-[22px]">
                  <div className="flex overflow-hidden flex-col justify-center items-center py-1 min-h-[27px] w-[22px]">
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/b965ed624c31e46f4ec6eefb9c185ac4cb1be1523508858734db26f8fa28742c?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8" alt="" className="object-contain w-full aspect-square" />
                  </div>
                </div>
                <h2 className="self-start text-lg font-medium tracking-wide text-blue-950">Our History</h2>
              </div>
              <h1 className="mt-3 text-5xl font-extrabold tracking-wide leading-[59px] text-blue-950 max-md:max-w-full max-md:text-4xl max-md:leading-[58px]">
                Let's Build Something <br /> Together
              </h1>
              <p className="mt-4 mr-6 text-lg tracking-wide leading-7 text-zinc-500 max-md:mr-2.5 max-md:max-w-full">
                With the company officially becoming operational in 2015. We <br /> aim to create unmatched positive relationships with our valued <br /> customers and help them with any electrical problem.
              </p>
              {historyCards.map((card, index) => (
                <HistoryCard key={index} {...card} />
              ))}
            </div>
          </div>
          <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-wrap grow gap-4 mt-20 max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col items-start max-md:hidden">
                <div className="flex flex-col items-start pt-12 pb-32 max-md:pb-24">
                  <div className="flex shrink-0 -mb-6 bg-white border-4 border-solid border-blue-950 h-[15px] rounded-[100px] w-[15px] max-md:mb-2.5" />
                </div>
                <div className="flex z-10 flex-col items-start pt-12 pb-32 -mt-5 max-md:pb-24">
                  <div className="flex shrink-0 mb-0 bg-white border-4 border-solid border-blue-950 h-[15px] rounded-[100px] w-[15px] max-md:mb-2.5" />
                </div>
                <div className="flex flex-col items-start self-stretch pt-12 pr-1.5 pb-20 max-md:hidden">
                  <div className="flex shrink-0 bg-white border-4 border-solid border-blue-950 h-[15px] rounded-[100px] w-[15px]" />
                  <div className="flex shrink-0 mt-40 bg-white border-4 border-solid border-blue-950 h-[15px] rounded-[100px] w-[15px] max-md:mt-10" />
                </div>
              </div>
              <div className="flex flex-col grow shrink-0 tracking-wide basis-0 w-fit max-md:max-w-full">
                {timelineItems.map((item, index) => (
                  <TimelineItem key={index} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;