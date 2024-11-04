'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Types
type HeaderProps = {
  openingHours: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
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

// Available services for quote request
const services = [
  { value: "interior", label: "Interior Painting" },
  { value: "exterior", label: "Exterior Painting" },
  { value: "cabinet", label: "Cabinet Painting" },
  { value: "commercial", label: "Commercial Services" },
  { value: "strata", label: "Strata Services" },
  { value: "carpentry", label: "Carpentry" },
  { value: "repair", label: "Repair" },
  { value: "power-washing", label: "Power Washing" },
  { value: "line-painting", label: "Line Painting" },
  { value: "caulking", label: "Caulking" }
];

// Available locations
const locations = [
  { value: "vancouver", label: "Vancouver, BC" },
  { value: "kelowna", label: "Kelowna, BC" },
  { value: "calgary", label: "Calgary, AB" }
];

// Quote Request Dialog Component
const QuoteRequestDialog = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    projectType: 'residential',
    timeline: '',
    message: ''
  });

  useEffect(() => {
    // Handle body scroll lock when dialog is open
    if (open) {
      document.body.style.overflow = 'hidden';
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const handleServiceToggle = (value: string) => {
    setSelectedServices(prev => 
      prev.includes(value)
        ? prev.filter(service => service !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setIsSubmitted(false);
      setOpen(false);
      setSelectedServices([]);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        projectType: 'residential',
        timeline: '',
        message: ''
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            className="px-8 py-4 text-center bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300 transform hover:scale-105"
          >
            Get a Quote!
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-500 text-center">
              Thank you for your interest. We'll get back to you within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="px-8 py-4 text-center bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300 transform hover:scale-105"
        >
          Get a Quote!
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Request a Free Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below and our team will get back to you within 24 hours with a customized quote.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com" 
                  required 
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(604) 555-0123" 
                  required 
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={formData.location}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  required
                >
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Service Type</Label>
                <RadioGroup 
                  value={formData.projectType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residential" id="residential" />
                    <Label htmlFor="residential">Residential</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <Label htmlFor="commercial">Commercial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strata" id="strata" />
                    <Label htmlFor="strata">Strata</Label>
                  </div>
                </RadioGroup>
              </div>

              

              <div className="space-y-2 mt-4">
                <Label htmlFor="message">Additional Details (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us more about your project..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting || selectedServices.length === 0}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Header Component (continued)
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

  // Helper function to check if a nav item is active
  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  // Navigation Link Component
  const NavLink = ({ item }: { item: NavItem }) => {
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
      {/* Spacer div to prevent content jump */}
      <div style={{ paddingTop: '142px' }} />
      
      {/* Fixed header container */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white">
        {/* Top bar */}
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

        {/* Main header */}
        <div className={`bg-white py-4 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
            <Link href="/" className="transition-transform hover:scale-105 duration-300">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b68ca45052d057c3539f5259eaebc8fc853392e2bc5d444f2225c9e4d6265ec?apiKey=a05a9fe5da54475091abff9f564d40f8&"
                alt="Unitus Painting Ltd. logo"
                className="w-[220px] h-auto"
              />
            </Link>
            <div className="flex items-center gap-6">
              {/* Email Button */}
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

              {/* Phone Button */}
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

        {/* Navigation */}
        <div className="bg-amber-400">
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
            <QuoteRequestDialog />
          </div>
        </div>
      </header>

      {/* Style to prevent scrollbar shift */}
      <style jsx global>{`
        .dialog-open {
          overflow: hidden !important;
          padding-right: var(--scrollbar-width, 15px);
        }

        @media (max-width: 640px) {
          .dialog-open {
            padding-right: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Header;