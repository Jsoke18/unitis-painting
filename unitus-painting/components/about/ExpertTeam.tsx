import React from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';

// Data structure for each expert
interface ExpertData {
  name: string;
  role: string;
  imageSrc: string;
  link: string;
}

// Array of expert data
const expertsData: ExpertData[] = [
  {
    name: "Bryce Cayer",
    role: "Founder, CEO & Senior Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/cf72a73794addb48e118d48ed8fd9df05d23efc742a83b6c00432f6a380ab7be?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/about/bryce-cayer"
  },
  {
    name: "Chris Mitchell",
    role: "Founder, CFO & Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/527eb9fd150b2dc616b08704dd770335f6b0468c0406969ed0844a3022c06913?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/expert/chris-mitchell"
  },
  {
    name: "Keith Yung",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/7aaa37d679a479b152a382a5b4fc557b7f357085d15234b44c323d8a7f6e5300?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/expert/keith-yung"
  },
  {
    name: "Colin Atkinson",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/bca02830c6de5692db82cdcd1537747f9818df9eca024a115cca1a7ff0eb2f4e?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/expert/colin-atkinson"
  },
  {
    name: "Kyle Rooney",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/765e8b96e602ceb349572b150a35fec30f2ac8ecd359320856f421735adbd718?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/expert/kyle-rooney"
  },
  {
    name: "Tony Balazs",
    role: "Project Manager",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/3da8d9d953149e442f735f85f3a2f8f359fcf9d934895b7bc78df1dc21125129?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/expert/tony-balazs"
  },
  {
    name: "Michael Powell",
    role: "Client Relations",
    imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/1614588dec73992d594aa34099aaf2a59503d4115a4d534b76fd10e1f9f0d194?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8",
    link: "/expert/michael-powell"
  }
];

// Expert Card Component
const ExpertCard: React.FC<ExpertData> = ({ name, role, imageSrc, link }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="aspect-w-4 aspect-h-3">
      <img src={imageSrc} alt={name} className="object-cover w-full h-full" />
    </div>
    <div className="p-6">
      <Link href={link}>
        <h3 className="text-xl font-semibold text-blue-900 mb-2 hover:text-blue-600 transition-colors duration-300">{name}</h3>
      </Link>
      <p className="text-gray-600">{role}</p>
    </div>
  </div>
);

// Expert Team Component
const ExpertTeam: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full mb-6">
            <User className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-tight">
            Meet Our Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our people are fully qualified with all types of services whether it's commercial, residential, or industrial. You'll get top-notch service every time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertsData.map((expert, index) => (
            <ExpertCard key={index} {...expert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertTeam;