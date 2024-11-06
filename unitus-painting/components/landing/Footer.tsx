'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from "sonner";

// Types remain the same
type Location = {
  lat: number;
  lon: number;
  name: string;
};

type FooterSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

// Constants remain the same
const COMPANY_LOCATIONS: Location[] = [
  { lat: 51.0447, lon: -114.0719, name: "Calgary, AB" },
  { lat: 49.2827, lon: -123.1207, name: "Vancouver, BC" },
  { lat: 49.8880, lon: -119.4960, name: "Kelowna, BC" },
];

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Explore",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Areas Served", href: "/areas-served" },
      { label: "Our Approach", href: "/our-approach" },
      { label: "Warranty", href: "/warranty" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Contact Us", href: "/contact" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail('');
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-blue-950 text-white w-full">
      <div className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and Description Section */}
            <div className="col-span-1 md:col-span-2 flex flex-col">
              <div className="flex items-start">
                <Link href="/" className="inline-block">
                  <img 
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/192b18d784640b366909dfe342aa9156116872eaf1e2b8f7a75c0b003757fc35?apiKey=a05a9fe5da54475091abff9f564d40f8&" 
                    alt="Unitus Painting logo" 
                    className="h-16 w-auto object-contain hover:opacity-90 transition-opacity" 
                  />
                </Link>
              </div>
              <div className="mt-6 max-w-md">
                <p className="text-base leading-relaxed text-gray-300">
                  We are here to fit the needs of your basic services for your dream building whether it's commercial, residential or industrial.
                </p>
              </div>
            </div>

            {/* Navigation Sections */}
            {FOOTER_SECTIONS.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-400">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href} 
                        className="text-gray-300 hover:text-amber-400 transition-colors duration-200 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <Separator className="my-10 bg-slate-800" />
          
          {/* Contact Information - Adjusted for alignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-200">Mail Us</p>
                <a 
                  href="mailto:info@unituspainting.com" 
                  className="text-sm text-gray-300 hover:text-amber-400 transition-colors duration-200"
                >
                  info@unituspainting.com
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-200">Call Us</p>
                <a 
                  href="tel:604-357-4787" 
                  className="text-sm text-gray-300 hover:text-amber-400 transition-colors duration-200"
                >
                  604-357-4787
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-200">Our Locations</p>
                <div className="space-y-1">
                  {COMPANY_LOCATIONS.map((location, index) => (
                    <p key={index} className="text-sm text-gray-300">{location.name}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-10 bg-slate-800" />
          
          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} Unitus Painting. All rights reserved.
            </p>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto space-x-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-900 border-blue-800 text-white placeholder:text-white/70 max-w-xs" 
              />
              <Button 
                type="submit"
                variant="secondary" 
                className="bg-amber-400 text-blue-950 hover:bg-amber-500 transition-all duration-200 whitespace-nowrap"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;