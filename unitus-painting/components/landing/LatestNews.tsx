import React from 'react';

type ArticleProps = {
  title: string;
  content: string;
};

const Article: React.FC<ArticleProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow tracking-wide max-md:mt-10 max-md:max-w-full">
        <h3 className="text-3xl font-bold leading-10 text-blue-950 max-md:max-w-full">{title}</h3>
        <p className="mt-5 text-lg leading-7 text-zinc-500 max-md:mr-2.5 max-md:max-w-full">{content}</p>
        <button className="flex flex-1 gap-3 mt-7 text-xl font-semibold tracking-wide text-blue-950">
          View More
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8da5449f06c8a18136a468a86c66419b6b6ae847fef764b5e0cbe83a1ce591be?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain w-full aspect-[0.62] w-2" />
        </button>
      </div>
    </div>
  );
};

const LatestNews: React.FC = () => {
  const articles = [
    {
      title: "Understanding Elastomeric Coating: How it Differs from Traditional Latex Paint",
      content: "When it comes to protecting and beautifying your home or commercial property in Calgary, Okanagan or Vancouver Lower Mainland choosing..."
    },
    {
      title: "The Ultimate Guide to Painting Vinyl Siding in Calgary, Kelowna, & Vancouver Lower",
      content: "When it comes to enhancing the curb appeal of your home, few projects make as big an impact as painting your vinyl siding. Whether your..."
    }
  ];

  return (
    <section className="flex flex-col items-center px-16 mt-24 w-full max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <h2 className="mt-24 ml-4 text-5xl font-extrabold tracking-wide leading-tight text-center text-blue-950 max-md:mt-10 max-md:max-w-full max-md:text-4xl">
        Latest News & Articles
      </h2>
      <div className="mt-14 ml-4 w-full max-w-[1190px] max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {articles.map((article, index) => (
            <Article key={index} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;