import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const [userLocation, setUserLocation] = useState('Calgary, AB');

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
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, []);

  const getClosestLocation = (lat: number, lon: number): string => {
    const calgary = { lat: 51.0447, lon: -114.0719, name: "Calgary, AB" };
    const vancouver = { lat: 49.2827, lon: -123.1207, name: "Vancouver, BC" };

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

    const distToCalgary = calcDistance(lat, lon, calgary.lat, calgary.lon);
    const distToVancouver = calcDistance(lat, lon, vancouver.lat, vancouver.lon);

    return distToCalgary < distToVancouver ? calgary.name : vancouver.name;
  };

  return (
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/192b18d784640b366909dfe342aa9156116872eaf1e2b8f7a75c0b003757fc35?apiKey=a05a9fe5da54475091abff9f564d40f8&" alt="Company logo" className="h-12 w-auto mb-4" />
            <p className="text-sm mt-4">
              We are here to fit the needs of your basic services for your dream building whether it's commercial, residential or industrial.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="#team" className="hover:text-amber-400 transition-colors">Team</a></li>
              <li><a href="#blog" className="hover:text-amber-400 transition-colors">Blog</a></li>
              <li><a href="#locations" className="hover:text-amber-400 transition-colors">Locations</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-amber-400 transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-slate-600" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold">Mail Us</p>
              <a href="mailto:info@unitispainting.com" className="text-sm hover:text-amber-400 transition-colors">info@unitispainting.com</a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold">Call Us</p>
              <a href="tel:604-716-4054" className="text-sm hover:text-amber-400 transition-colors">604-716-4054</a>
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
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">&copy; 2023 Unitus Painting. All rights reserved.</p>
          <div className="flex space-x-4">
            <Input type="email" placeholder="Enter your email" className="bg-blue-900 border-blue-800 text-white placeholder-gray-400" />
            <Button variant="secondary" className="bg-amber-400 text-blue-950 hover:bg-amber-500">Subscribe</Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;