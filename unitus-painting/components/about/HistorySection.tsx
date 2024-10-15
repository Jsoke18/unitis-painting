import React from 'react';
import { CheckCircle, Calendar } from 'lucide-react';

const HistorySection = () => {
  const historyCards = [
    {
      title: "Our Company",
      description: "Founded with a mission to deliver top-quality painting services, Unitus Painting quickly earned a reputation for reliability and attention to detail. Over the years, we have expanded our expertise across Canada, serving homes, businesses, and large-scale developments with the same dedication to excellence."
    },
    {
      title: "Our Mission",
      description: "We aim to exceed client expectations with every job, offering expert service, quality work, and competitive pricing for both residential and industrial painting needs."
    }
  ];

  const timelineItems = [
    { year: "2013", description: "Unitus Painting is founded, focusing on high-quality residential and commercial painting services" },
    { year: "2015", description: "Expansion into large-scale commercial and industrial painting across Canada" },
    { year: "2020", description: "Recognition as a trusted industry leader in residential, strata, and industrial painting services" },
    { year: "2023", description: "Further expansion of services, with a focus on high-rise buildings, warehousing, and hospitality sectors, reinforcing their role as a premier painting contractor across the nation" }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">Our History</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-8 leading-tight">
              Let's Build Something <br /> Together
            </h1>
            <p className="text-gray-600 mb-12 text-lg leading-relaxed">
              With the company officially becoming operational in 2015, we aim to create unmatched positive relationships with our valued customers and help them with any electrical problem.
            </p>
            {historyCards.map((card, index) => (
              <div key={index} className="mb-8 bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <h3 className="flex items-center text-xl font-semibold text-blue-800 mb-4">
                  <CheckCircle className="mr-3 text-blue-500" size={24} />
                  {card.title}
                </h3>
                <p className="text-gray-600 ml-9 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="lg:w-1/2">
            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-300">
              {timelineItems.map((item, index) => (
                <div key={index} className="mb-12 last:mb-0">
                  <div className="absolute left-[-8px] w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                  <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ml-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-3">{item.year}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;