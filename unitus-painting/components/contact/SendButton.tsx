import React from 'react';

const SendButton: React.FC = () => (
  <button
    type="submit"
    className="gap-2.5 self-end px-12 py-4 mt-9 text-base font-medium text-center text-white rounded-md bg-blue-950 min-h-[53px] shadow-[0px_0px_14px_rgba(0,0,0,0.12)] max-md:px-5"
  >
    Send Message
  </button>
);

export default SendButton;