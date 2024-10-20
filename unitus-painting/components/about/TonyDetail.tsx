import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import YouTubeStylePlayer from './YoutubeStylePlayer';

// Floating Quick Info Component
const FloatingQuickInfo: React.FC<{ name: string; title: string; phone: string; email: string }> = ({ name, title, phone, email }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isOpen ? 0 : 100 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="fixed bottom-0 right-4 bg-white shadow-lg rounded-t-lg overflow-hidden z-50"
    >
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Quick Info</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-600">{title}</p>
            <div className="mt-2 space-y-1">
              <a href={`tel:${phone}`} className="flex items-center text-sm text-blue-600">
                <Phone size={16} className="mr-2" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center text-sm text-blue-600">
                <Mail size={16} className="mr-2" /> {email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// About Section Component
interface AboutSectionProps {
  name: string;
  title: string;
  description: string;
  phone: string;
  email: string;
  image: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ name, title, description, phone, email, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="mx-auto mt-40 max-w-6xl shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/5">
              <Avatar className="w-full h-auto aspect-square">
                <AvatarImage src={image} alt={`${name}'s portrait`} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
            <div className="md:w-3/5">
              <CardHeader className="p-0">
                <CardTitle className="text-3xl font-bold text-blue-950">About {name}</CardTitle>
                <p className="text-xl text-zinc-500 mt-2">{title}</p>
              </CardHeader>
              <p className="mt-4 text-zinc-700 leading-relaxed">{description}</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <span className="font-semibold text-blue-950 w-20">Phone:</span>
                  <span className="text-zinc-700">{phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-blue-950 w-20">Email:</span>
                  <span className="text-zinc-700">{email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Newsletter Section Component
const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Subscribing email:', email);
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail('');
  };

  return (
    <motion.section 
      className="bg-amber-400 py-20 mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-950">Subscribe to Our Newsletter</h2>
            <p className="mt-4 text-blue-950/80">
              Stay in touch with us to get the latest news and updates about our painting services.
            </p>
          </div>
          <div className="md:w-1/2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// Main Component
const MainComponent: React.FC = () => {
  const aboutProps = {
    name: "Tony Balazs",
    title: "Project Manager",
    description: "Working in Vancouver’s painting industry for the past 16 years, Tony has an extensive knowledge in coatings of all types.  As an Account Development Manager at Dulux/PPG Paints. he has built many lasting relationships with leading paint contractors. He's adept at product recommendations, paint application/performance and colour needs. At Unitus, Tony looks forward to new relationships and providing second-to-none customer service. He, his wife Julia, and daughter Zoey, can be seen out in their neighbourhood enjoying all that Vancouver's Fairview area and Granville Island has to offer.",
    phone: "604-727-6787",
    email: "tony@unituspainting.com",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/765e8b96e602ceb349572b150a35fec30f2ac8ecd359320856f421735adbd718?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <YouTubeStylePlayer url="/videos/meet-the-manager-bryce.mp4" />
      <AboutSection {...aboutProps} />
      <NewsletterSection />
      <FloatingQuickInfo {...aboutProps} />
    </div>
  );
};

export default MainComponent;