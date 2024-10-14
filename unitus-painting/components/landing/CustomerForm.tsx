import React from 'react';

const ContactForm: React.FC = () => {
  return (
    <form className="flex flex-col grow w-full bg-zinc-100 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col px-10 py-20 bg-zinc-100 max-md:px-5 max-md:max-w-full">
        <label htmlFor="name" className="sr-only">Your Name</label>
        <input
          id="name"
          type="text"
          placeholder="Your Name"
          className="overflow-hidden px-5 py-7 text-lg bg-white border border-solid border-stone-300 text-zinc-500 max-md:max-w-full"
        />
        <label htmlFor="email" className="sr-only">Your Email</label>
        <input
          id="email"
          type="email"
          placeholder="Your Email"
          className="overflow-hidden px-5 py-7 mt-6 text-lg bg-white border border-solid border-stone-300 text-zinc-500 max-md:max-w-full"
        />
        <label htmlFor="phone" className="sr-only">Phone Number</label>
        <input
          id="phone"
          type="tel"
          placeholder="Phone Number"
          className="overflow-hidden px-5 py-7 mt-6 text-lg bg-white border border-solid border-stone-300 text-zinc-500 max-md:max-w-full"
        />
        <label htmlFor="date" className="sr-only">Date</label>
        <input
          id="date"
          type="date"
          placeholder="Date"
          className="overflow-hidden px-5 py-7 mt-6 text-lg whitespace-nowrap bg-white border border-solid border-stone-300 text-zinc-500 max-md:max-w-full"
        />
        <label htmlFor="message" className="sr-only">Message</label>
        <textarea
          id="message"
          placeholder="Your Message"
          className="flex overflow-hidden shrink-0 mt-6 bg-white border border-solid border-stone-300 h-[150px] max-md:max-w-full"
        ></textarea>
        <button type="submit" className="flex overflow-hidden flex-col justify-center items-center px-20 py-7 mt-9 text-xl font-semibold text-center whitespace-nowrap bg-amber-400 border-2 border-amber-400 border-solid text-blue-950 max-md:px-5 max-md:max-w-full">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactForm;