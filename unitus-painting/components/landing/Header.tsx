'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, Menu, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import QuoteRequestDialog from './QuoteRequestDialog';

// Types
type HeaderProps = {};

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

type BusinessHours = {
  [key: string]: {
    open: string;
    close: string;
  } | null; // Allow null for closed days
};

type BusinessStatus = {
  isOpen: boolean;
  nextOpenTime: string;
  currentDayHours: string;
  message: string;
};
// Email service configurations
const emailServices = [
  { name: 'Gmail', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=info@unituspainting.com' },
  { name: 'Outlook', url: 'https://outlook.live.com/mail/0/deeplink/compose?to=info@unituspainting.com' },
  { name: 'Yahoo', url: 'https://compose.mail.yahoo.com/?to=info@unituspainting.com' },
];

// Navigation items
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

// Constants
const BUSINESS_HOURS: BusinessHours = {
  monday: { open: '8:00 AM', close: '5:00 PM' },
  tuesday: { open: '8:00 AM', close: '5:00 PM' },
  wednesday: { open: '8:00 AM', close: '5:00 PM' },
  thursday: { open: '8:00 AM', close: '5:00 PM' },
  friday: { open: '8:00 AM', close: '5:00 PM' },
  saturday: { open: '8:00 AM', close: '5:00 PM' },
  sunday: null, // Closed
};

const Header: React.FC<HeaderProps> = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [businessStatus, setBusinessStatus] = useState<BusinessStatus>({
    isOpen: false,
    nextOpenTime: '',
    currentDayHours: '',
    message: '',
  });

  // Helper function to convert time string to hour number
  const getHourFromTimeString = (timeString: string): number => {
    const [time, period] = timeString.split(' ');
    let [hours] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours;
  };

  const updateBusinessStatus = useCallback(() => {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];
    const currentHour = now.getHours();
    
    // Handle Sunday or any closed day
    if (!BUSINESS_HOURS[currentDay]) {
      const nextOpenDay = days.find((day, index) => {
        const nextDayIndex = (now.getDay() + index) % 7;
        return BUSINESS_HOURS[days[nextDayIndex]] !== null;
      }) || 'monday';
      
      const nextDayHours = BUSINESS_HOURS[nextOpenDay]!;
      setBusinessStatus({
        isOpen: false,
        nextOpenTime: `${nextOpenDay.charAt(0).toUpperCase() + nextOpenDay.slice(1)} at ${nextDayHours.open}`,
        currentDayHours: 'Closed',
        message: `Closed - Opens ${nextOpenDay.charAt(0).toUpperCase() + nextOpenDay.slice(1)} at ${nextDayHours.open}`,
      });
      return;
    }

    const todayHours = BUSINESS_HOURS[currentDay]!;
    const currentDayHours = `${todayHours.open} - ${todayHours.close}`;
    
    const openHour = getHourFromTimeString(todayHours.open);
    const closeHour = getHourFromTimeString(todayHours.close);
    
    const isOpen = currentHour >= openHour && currentHour < closeHour;
    
    let message = '';
    if (isOpen) {
      message = `Open Today: ${currentDayHours}`;
    } else {
      if (currentHour >= closeHour) {
        let nextDay = days[(now.getDay() + 1) % 7];
        while (!BUSINESS_HOURS[nextDay]) {
          nextDay = days[(days.indexOf(nextDay) + 1) % 7];
        }
        const nextDayHours = BUSINESS_HOURS[nextDay]!;
        const nextDayName = nextDay === 'monday' && currentDay !== 'sunday' ? 'Monday' : 'Tomorrow';
        message = `Closed - Opens ${nextDayName} at ${nextDayHours.open}`;
      } else {
        message = `Closed - Opens Today at ${todayHours.open}`;
      }
    }
    
    setBusinessStatus({
      isOpen,
      nextOpenTime: '',
      currentDayHours,
      message,
    });
  }, []);


  useEffect(() => {
    updateBusinessStatus();
    const interval = setInterval(updateBusinessStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateBusinessStatus]);

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  const MobileNavItem = ({ item }: { item: NavItem }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const active = isActive(item);
  
    return (
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          {item.children ? (
            <button
              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
              className={`flex items-center justify-between w-full ${
                active ? 'text-blue-950' : 'text-gray-700'
              }`}
            >
              {item.label}
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  isSubMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          ) : (
            <Link
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={active ? 'text-blue-950' : 'text-gray-700'}
            >
              {item.label}
            </Link>
          )}
        </div>

        <AnimatePresence>
          {item.children && isSubMenuOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-gray-50"
            >
              {(item.label === "Services" || item.label === "About Us") && (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block p-4 pl-8 text-blue-950 font-medium border-b border-gray-200"
                >
                  {`View ${item.label}`} →
                </Link>
              )}
              {item.children.map((child, index) => (
                <Link
                  key={index}
                  href={child.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block p-4 pl-8 ${
                    pathname === child.href
                      ? 'text-blue-950 bg-amber-50'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const DesktopNavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item);
    const isOpen = openDropdown === item.label;

    return (
      <div className="relative">
        <Link 
          href={item.href}
          className={`px-6 py-4 inline-flex items-center relative
            ${active ? 'text-white' : 'text-neutral-800 hover:text-white transition-colors duration-200'}`}
        >
          <span className="relative z-10">{item.label}</span>
          {item.children && (
            <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </Link>
        {active && (
          <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-white" />
        )}
      </div>
    );
  };

  return (
    <>
      <div style={{ paddingTop: '142px' }} />
      
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white">
        <motion.div 
          className="bg-gray-100 w-full overflow-hidden"
          animate={{ height: isScrolled ? 0 : 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
            <div className="text-sm tracking-wide text-blue-950 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={`inline-block w-2 h-2 rounded-full ${
                businessStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}/>
              <span>{businessStatus.message}</span>
            </div>
          </div>
        </motion.div>

        <div className={`bg-white py-4 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
            <Link href="/" className="transition-transform hover:scale-105 duration-300">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&"
                alt="Unitus Painting Ltd. logo"
                className="w-[180px] md:w-[220px] h-auto"
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <div className="relative">
                <Button
                  variant="ghost"
                  className="group text-blue-950 hover:bg-amber-100 rounded-full px-5 py-3 transition-all duration-300"
                  onClick={() => setShowEmailOptions(!showEmailOptions)}
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

            <Button
              variant="ghost"
              className="md:hidden text-blue-950"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="hidden md:block bg-amber-400">
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
                    <DesktopNavLink item={item} />
                    <AnimatePresence>
                      {item.children && openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg py-2 min-w-[200px] max-h-[400px] overflow-y-auto z-50"
                        >
                          {item.children.map((child, childIndex) => (
                            <Link key={childIndex} href={child.href}>
                              <div 
                                className={`px-6 py-2 transition-colors duration-200
                                  ${pathname === child.href
                                    ? 'text-blue-950 bg-amber-50' 
                                    : 'text-neutral-800 hover:text-blue-950 hover:bg-gray-50'
                                  }`}
                              >
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </nav>
            <QuoteRequestDialog buttonClassName="px-8 py-4 text-center bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300 transform hover:scale-105" />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-blue-950">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="py-2">
                {navItems.map((item, index) => (
                  <MobileNavItem key={index} item={item} />
                ))}
              </div>

              <div className="p-4 space-y-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  asChild
                >
                  <a href="mailto:info@unituspainting.com" className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>info@unituspainting.com</span>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  asChild
                >
                  <a href="tel:+16043574787" className="flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>604-357-4787</span>
                  </a>
                </Button>
                <QuoteRequestDialog buttonClassName="w-full px-4 py-2 text-center bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;