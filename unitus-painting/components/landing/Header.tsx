'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type HeaderProps = {
  openingHours: string;
  pathname: string;
};

const Header: React.FC<HeaderProps> = ({ openingHours, pathname }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showEmailOptions, setShowEmailOptions] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    {
      label: "About Us",
      href: "/about",
      children: [
        { label: "Our Approach", href: "/our-approach" },
        { label: "Warranty", href: "/warranty" },
      ],
    },
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Cabinet Painting", href: "/services/cabinet-painting" },
        { label: "Carpentry", href: "/services/carpentry" },
        { label: "Caulking", href: "/services/caulking" },
        { label: "Commercial Services", href: "/services/commercial-services" },
        { label: "Exterior Painting", href: "/services/exterior-painting" },
        { label: "Interior Painting", href: "/services/interior-painting" },
        { label: "Line Painting", href: "/services/line-painting" },
        { label: "Power Washing", href: "/services/power-washing" },
        { label: "Repair", href: "/services/repair" },
        { label: "Residential", href: "/services/residential" },
        { label: "Strata Services", href: "/services/strata-services" },
      ],
    },
    { label: "Areas Served", href: "/areas-served" },
    { label: "Blog", href: "/blog" },
    { label: "Project Gallery", href: "/project-gallery" },
    { label: "Contact Us", href: "/contact" },
  ];

  const emailServices = [
    { name: 'Gmail', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=info@unituspainting.com' },
    { name: 'Outlook', url: 'https://outlook.live.com/mail/0/deeplink/compose?to=info@unituspainting.com' },
    { name: 'Yahoo', url: 'https://compose.mail.yahoo.com/?to=info@unituspainting.com' },
  ];

  const HeaderContent = () => (
    <>
      {/* Top bar */}
      <div className="bg-gray-100 w-full py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="text-sm tracking-wide text-blue-950 font-medium">
            Hours of Operation: {openingHours}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <Link href="/">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&"
              alt="Unitus Painting Ltd. logo"
              className="w-[220px] h-auto cursor-pointer"
            />
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Button
                variant="ghost"
                className="text-blue-950 hover:bg-amber-100 rounded-full px-5 py-3"
                onClick={() => setShowEmailOptions(!showEmailOptions)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">Mail Us</span>
                  <span className="text-sm">info@unituspainting.com</span>
                </div>
              </Button>
              <AnimatePresence>
                {showEmailOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 bg-white shadow-md py-2 min-w-[200px] z-30"
                  >
                    {emailServices.map((service, index) => (
                      <a
                        key={index}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-gray-100 text-blue-950"
                      >
                        {service.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              className="text-blue-950 hover:bg-amber-100 rounded-full px-5 py-3"
              asChild
            >
              <a href="tel:+16043574787" className="flex items-center">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">Call Us</span>
                  <span className="text-sm">604-357-4787</span>
                </div>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-amber-400 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <nav className="flex">
            <div className="flex text-base font-semibold tracking-wide">
              {navItems.map((item, index) => {
                const isOpen = openDropdown === item.label;
                const isActive = pathname === item.href;
                return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div
                      className={`cursor-pointer px-6 py-4 transition-colors ${
                        isActive ? "text-white" : "text-neutral-800 hover:text-white"
                      } flex items-center`}
                    >
                      <Link href={item.href} className="flex items-center">
                        {item.label}
                      </Link>
                      {item.children && (
                        <motion.div
                          initial={false}
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-1"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>
                    <AnimatePresence>
                      {item.children && isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 bg-white shadow-md py-2 min-w-[200px] max-h-[400px] overflow-y-auto"
                        >
                          {item.children.map((child: any, childIndex: number) => (
                            <Link key={childIndex} href={child.href}>
                              <div className="px-6 py-2 text-neutral-800 hover:text-blue-950 hover:bg-gray-100">
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </nav>
          <div>
            <Button variant="default" className="px-8 py-4 text-center bg-blue-950 text-white rounded-none hover:bg-blue-900 transition-colors">
              Get a Quote!
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <header className="flex flex-col bg-white relative z-20 shadow-md">
      <HeaderContent />
    </header>
  );
};

export default Header;