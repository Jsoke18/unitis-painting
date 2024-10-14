import React from 'react';
import ContactInfo from './ContactInfo';
import FormInput from './FormInput';
import MessageInput from './MessageInput';
import SendButton from './SendButton';

interface ContactFormProps {
  title: string;
  description: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ title, description }) => {
  const contactInfoItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4f334d9e854bb7dacb7d866e49c1c073d5fd6e048a9a41cee88ee3ebad23528e?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "+1 604-716-4054" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1521c76a1cc6b1830c82a3396471c5afdaed5e01af3d73aaa78024c561e28b32?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8", text: "info@unituspainting.com" }
  ];

  return (
    <div className="flex flex-col rounded-none">
      <div className="py-2 pr-12 pl-2.5 w-full bg-white rounded-xl shadow-2xl max-md:pr-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[45%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col items-start px-10 pt-10 pb-40 mx-auto w-full text-base text-white rounded-xl bg-blue-950 max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:max-w-full">
              <h2 className="text-3xl font-semibold">{title}</h2>
              <p className="self-stretch mt-1.5 text-lg text-stone-300 max-md:max-w-full">
                {description}
              </p>
              {contactInfoItems.map((item, index) => (
                <ContactInfo key={index} icon={item.icon} text={item.text} />
              ))}
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[55%] max-md:ml-0 max-md:w-full">
            <form className="flex flex-col mt-10 w-full max-md:mt-10 max-md:max-w-full">
              <div className="max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                  <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                    <FormInput label="First Name" />
                    <FormInput label="Email" />
                  </div>
                  <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                    <FormInput label="Last Name" value="Doe" />
                    <FormInput label="Phone Number" value="+1 012 3456 789" />
                  </div>
                </div>
              </div>
              <MessageInput />
              <SendButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;