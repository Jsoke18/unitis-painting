'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderProps = {
  openingHours: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

const Header: React.FC<HeaderProps> = ({ openingHours }) => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    if (isScrolled !== scrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  const navItems: NavItem[] = [
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

  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item);
    const isOpen = openDropdown === item.label;
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link 
        href={item.href}
        className={`px-6 py-4 inline-flex items-center group relative
          ${active ? 'text-white' : 'text-neutral-800'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="relative z-10">{item.label}</span>
        {item.children && (
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-1 relative z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        )}
        {/* Background hover effect */}
        {!active && (
          <div
            className={`absolute inset-0 bg-amber-500 opacity-0 transition-opacity duration-200
              ${isHovered ? 'opacity-15' : ''}`}
          />
        )}
      </Link>
    );
  };

  const HeaderContent = () => (
    <>
      <motion.div 
        className="bg-gray-100 w-full overflow-hidden"
        animate={{ height: isScrolled ? 0 : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="text-sm tracking-wide text-blue-950 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
            {openingHours}
          </div>
        </div>
      </motion.div>

      <div className={`bg-white py-4 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&"
              alt="Unitus Painting Ltd. logo"
              className="w-[220px] h-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Button
                variant="ghost"
                className="group text-blue-950 hover:bg-amber-100 rounded-full px-5 py-3 transition-all duration-300"
                onClick={() => setShowEmailOptions(!showEmailOptions)}
                aria-expanded={showEmailOptions}
                aria-haspopup="true"
              >
                <Mail className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"/>
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
                    className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-30"
                  >
                    {emailServices.map((service, index) => (
                      <a
                        key={index}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-amber-50 text-blue-950 transition-colors duration-200"
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
              className="group text-blue-950 hover:bg-amber-100 rounded-full px-5 py-3 transition-all duration-300"
              asChild
            >
              <a href="tel:+16043574787" className="flex items-center">
                <Phone className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"/>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">Call Us</span>
                  <span className="text-sm">604-357-4787</span>
                </div>
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-amber-400 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <nav className="flex">
            <div className="flex text-base font-semibold tracking-wide">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <NavLink item={item} />
                  {isActive(item) && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-6 right-6 h-0.5 bg-white"
                      initial={false}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  <AnimatePresence>
                    {item.children && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto z-50"
                      >
                        {item.children.map((child, childIndex) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link key={childIndex} href={child.href}>
                              <div 
                                className={`px-6 py-2 transition-colors duration-200
                                  ${childActive 
                                    ? 'text-blue-950 bg-amber-50' 
                                    : 'text-neutral-800 hover:text-blue-950 hover:bg-gray-50'
                                  }`}
                              >
                                {child.label}
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </nav>
          <Button 
            variant="default" 
            className="px-8 py-4 text-center bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300 transform hover:scale-105"
          >
            Get a Quote!
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full">
      <header className={`flex flex-col bg-white transition-shadow duration-300 will-change-[shadow] ${isScrolled ? 'shadow-xl' : ''}`}>
        <HeaderContent />
      </header>
      <div className="h-[142px]" />
    </div>
  );
};

export default Header;