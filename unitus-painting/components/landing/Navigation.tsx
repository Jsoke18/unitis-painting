import React from 'react';

const Navigation: React.FC = () => {
  const navItems = ["Home", "About Us", "Services", "Blog", "Contact Us"];

  return (
    <nav className="flex z-10 flex-wrap gap-5 justify-between self-center py-2.5 pr-2.5 pl-11 mt-7 max-w-full text-xl font-semibold tracking-wide bg-amber-400 w-[1200px] max-md:pl-5">
      <div className="flex gap-8 my-auto text-neutral-800 max-md:max-w-full">
        {navItems.map((item, index) => (
          <div key={index} className={index === 0 ? "text-white" : ""}>
            {item}
          </div>
        ))}
        <div className="flex gap-2 self-start whitespace-nowrap">
          <div className="grow">Services</div>
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3493bb7b3ba42807d2ed7ba71a053dbea43399654cf512e33a9fe437e53e950e?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="" className="object-contain shrink-0 self-start mt-1.5 w-3.5 aspect-[1.56]" />
        </div>
      </div>
      <button className="px-16 py-7 text-center border-2 border-solid bg-blue-950 border-blue-950 text-zinc-100 max-md:px-5">
        Get a Quote!
      </button>
    </nav>
  );
};

export default Navigation;