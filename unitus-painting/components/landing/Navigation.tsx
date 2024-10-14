import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = ["Home", "About Us", "Services", "Blog", "Contact Us"];

  return (
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
  );
};

export default Navigation;