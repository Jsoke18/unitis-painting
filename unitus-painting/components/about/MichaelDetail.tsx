import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Image from 'next/image';

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
    <Card className="mx-auto mt-32 max-w-6xl shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/5 relative">
            <Image 
              src={image}
              alt={`${name}'s portrait`}
              width={400}
              height={400}
              layout="responsive"
              objectFit="cover"
            />
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
                <a href={`tel:${phone}`} className="flex items-center text-zinc-700">
                  <Phone size={16} className="mr-2" /> {phone}
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-blue-950 w-20">Email:</span>
                <a href={`mailto:${email}`} className="flex items-center text-zinc-700">
                  <Mail size={16} className="mr-2" /> {email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Newsletter Section Component
const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail('');
  };

  return (
    <section className="bg-amber-400 py-20">
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
    </section>
  );
};

// Main Component
const MainComponent: React.FC = () => {
  const michaelProps = {
    name: "Michael Powell",
    title: "Project Manager",
    description: "Checking out a job at Science World. A sales and marketing background from corporate America, more than 12 years in commercial painting, and a desire to conduct win/win business, allows Mike to comfortably develop and build relationships. A passionate cyclist and wannabe drone pilot keep him occupied in beautiful BC : ))",
    phone: "604-202-6407",
    email: "keith@unituspainting.com",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1614588dec73992d594aa34099aaf2a59503d4115a4d534b76fd10e1f9f0d194?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
  };

  return (
    <div>
      <AboutSection {...michaelProps} />
      <NewsletterSection />
    </div>
  );
};

export default MainComponent;