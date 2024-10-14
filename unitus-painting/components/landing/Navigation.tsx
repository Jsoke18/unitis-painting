import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  openingHours: string;
};

const Header: React.FC<HeaderProps> = ({ openingHours }) => {
  const navItems = ["Home", "About Us", "Services", "Blog", "Contact Us"];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col bg-white relative z-20"
    >
      <div className="flex justify-between items-center px-16 py-2 w-full bg-zinc-100 max-md:px-5">
        <div className="text-sm tracking-wide text-blue-950">
          Opening Hours: {openingHours}
        </div>
        <div className="flex gap-4">
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="#"
            aria-label="Facebook"
          >
            <Facebook className="text-blue-950 w-4 h-4" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="#"
            aria-label="Twitter"
          >
            <Twitter className="text-blue-950 w-4 h-4" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            href="#"
            aria-label="Instagram"
          >
            <Instagram className="text-blue-950 w-4 h-4" />
          </motion.a>
        </div>
      </div>
      <div className="flex justify-center bg-white py-4">
        <div className="flex justify-between items-center max-w-[1200px] w-full px-4">
          <motion.img
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&"
            alt="Unitus Painting Ltd. logo"
            className="w-[200px] h-auto"
          />
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center"
            >
              <Button variant="ghost" className="text-blue-950 bg-amber-400 rounded-md px-4 py-2">
                <Phone className="mr-2" size={20} />
                <div className="flex flex-col items-start ml-2">
                  <span className="text-xs font-semibold">Call Us</span>
                  <span className="text-sm">604-357-4787</span>
                </div>
              </Button>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center"
            >
              <Button variant="ghost" className="text-blue-950 bg-amber-400 rounded-md px-4 py-2">
                <Mail className="mr-2" size={20} />
                <div className="flex flex-col items-start ml-2">
                  <span className="text-xs font-semibold">Mail Us</span>
                  <span className="text-sm">support@unitispainting.com</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center w-full bg-amber-400"
      >
        <div className="flex justify-between items-center py-3 px-6 max-w-[1200px] w-full text-base font-semibold tracking-wide">
          <div className="flex gap-8 my-auto text-neutral-800">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer ${index === 0 ? "text-white" : ""}`}
              >
                {item}
              </motion.div>
            ))}
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="default" className="px-6 py-2 text-center bg-blue-950 text-zinc-100 rounded-none">
              Get a Quote!
            </Button>
          </motion.div>
        </div>
      </motion.nav>
    </motion.header>
  );
};

export default Header;