import React from 'react';

const MessageInput: React.FC = () => (
  <>
    <label htmlFor="message" className="self-start mt-28 text-xs font-medium leading-loose text-neutral-400 max-md:mt-10">
      Message
    </label>
    <textarea
      id="message"
      className="object-contain mt-2 w-full aspect-[500] max-md:max-w-full border border-gray-300 p-2"
      placeholder="Write your message.."
    />
  </>
);

export default MessageInput;