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
      className="flex flex-col bg-white relative z-20 shadow-md"
    >
      {/* Top bar */}
      <div className="bg-gray-100 w-full py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="text-sm tracking-wide text-blue-950 font-medium">
            Opening Hours: {openingHours}
          </div>
          <div className="flex gap-6">
            {[Facebook, Twitter, Instagram].map((Icon, index) => (
              <motion.a
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                aria-label={Icon.name}
                className="text-blue-950 hover:text-amber-500 transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <motion.img
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&"
            alt="Unitus Painting Ltd. logo"
            className="w-[220px] h-auto"
          />
          <div className="flex items-center gap-6">
            {[
              { icon: Mail, label: 'Mail Us', value: 'support@unituspainting.com' },
              { icon: Phone, label: 'Call Us', value: '604-357-4787' },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Button variant="ghost" className="text-blue-950 hover:bg-amber-100 rounded-full px-5 py-3">
                  <Icon className="mr-3" size={24} />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="text-sm">{value}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-amber-400 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <motion.nav
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex"
          >
            <div className="flex text-base font-semibold tracking-wide">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  className={`cursor-pointer px-6 py-4 transition-colors ${
                    index === 0 ? "text-white" : "text-neutral-800 hover:text-white"
                  }`}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.nav>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="default" className="px-8 py-4 text-center bg-blue-950 text-white rounded-none hover:bg-blue-900 transition-colors">
              Get a Quote!
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;