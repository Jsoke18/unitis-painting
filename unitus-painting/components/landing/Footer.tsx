'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { toast } from "sonner";

// Types
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

// Constants
const COMPANY_LOCATIONS: Location[] = [
  { lat: 51.0447, lon: -114.0719, name: "Calgary, AB" },
  { lat: 49.2827, lon: -123.1207, name: "Vancouver, BC" },
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

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com/unituspainting", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/unituspainting", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/unituspainting", label: "LinkedIn" },
];

const Footer: React.FC = () => {
  const [userLocation, setUserLocation] = useState('Calgary, AB');
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const closestLocation = getClosestLocation(latitude, longitude);
          setUserLocation(closestLocation);
        },
        error => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const getClosestLocation = (lat: number, lon: number): string => {
    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    let closestLocation = COMPANY_LOCATIONS[0];
    let minDistance = calcDistance(lat, lon, COMPANY_LOCATIONS[0].lat, COMPANY_LOCATIONS[0].lon);

    COMPANY_LOCATIONS.forEach(location => {
      const distance = calcDistance(lat, lon, location.lat, location.lon);
      if (distance < minDistance) {
        minDistance = distance;
        closestLocation = location;
      }
    });

    return closestLocation.name;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
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
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/192b18d784640b366909dfe342aa9156116872eaf1e2b8f7a75c0b003757fc35?apiKey=a05a9fe5da54475091abff9f564d40f8&" 
                alt="Unitus Painting logo" 
                className="h-12 w-auto mb-4 cursor-pointer hover:opacity-90 transition-opacity" 
              />
            </Link>
            <p className="text-sm mt-4">
              We are here to fit the needs of your basic services for your dream building whether it's commercial, residential or industrial.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {SOCIAL_LINKS.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-amber-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Sections */}
          {FOOTER_SECTIONS.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-amber-400">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="hover:text-amber-400 transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="my-8 bg-slate-600" />
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold">Mail Us</p>
              <a 
                href="mailto:info@unituspainting.com" 
                className="text-sm hover:text-amber-400 transition-colors"
              >
                info@unituspainting.com
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold">Call Us</p>
              <a 
                href="tel:604-357-4787" 
                className="text-sm hover:text-amber-400 transition-colors"
              >
                604-357-4787
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-sm">{userLocation}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-slate-600" />
        
        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Unitus Painting. All rights reserved.
          </p>
          <form onSubmit={handleSubscribe} className="flex space-x-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-blue-900 border-blue-800 text-white placeholder-gray-400" 
            />
            <Button 
              type="submit"
              variant="secondary" 
              className="bg-amber-400 text-blue-950 hover:bg-amber-500"
              disabled={isSubscribing}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;