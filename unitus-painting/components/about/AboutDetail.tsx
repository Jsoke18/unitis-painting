import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Header Component
interface HeaderProps {
  name: string;
  backgroundImage: string;
}

const Header: React.FC<HeaderProps> = ({ name, backgroundImage }) => {
  return (
    <header className="relative w-full h-[458px] flex items-center justify-center text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-blue-950/80" />
      <h1 className="relative z-10 text-6xl font-extrabold tracking-wider text-center max-w-4xl mx-auto leading-tight">
        {name}
      </h1>
    </header>
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
    <Card className="mx-auto mt-20 max-w-6xl shadow-lg">
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
  );
};

// Newsletter Section Component
const NewsletterSection: React.FC = () => {
  return (
    <section className="bg-amber-400 py-20 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-blue-950">Subscribe to Our Newsletter</h2>
            <p className="mt-4 text-blue-950/80">
              Stay in touch with us to get the latest news. We're here to meet your electrical service needs for your dream building.
            </p>
          </div>
          <div className="md:w-1/2">
            <form className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow"
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
  const headerProps = {
    name: "Bryce Cayer",
    backgroundImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/d91b7698f0139952b976e7e2b55ca4ece494875c8f0df88c83b39e517b572d54?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
  };
  const aboutProps = {
    name: "Bryce Cayer",
    title: "Founder, CEO, & Senior Project Manager",
    description: "Bryce is the co-founder of Unitus Painting, which he established in 2013 with his business partner and former university roommate, Chris. His journey in the painting industry began in 2006, shortly after completing his commerce degree at university in Victoria. A family man at heart, Bryce resides in Maple Ridge with his wife Danielle and their three children: Sidney, Autumn, and baby Kasen. The family's household is complete with their small, characterful chihuahua named Romeo. Bryce's approach to business reflects his commitment to customer satisfaction. He believes Unitus Painting stands out because of their focus on efficiency and professionalism, catering to busy clients who value their time. Under his leadership, the company has developed systems that ensure a smooth process from quoting to job completion, providing customers with peace of mind throughout their painting projects. With his extensive experience in the industry and dedication to delivering positive experiences, Bryce continues to successfully run operations at Unitus Painting, contributing to its growth and reputation as a trusted painting service provider.",
    phone: "604-716-4054",
    email: "bryce@unituspainting.com",
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/4d0ff4655fbd2d991505c37d91dea0861c1b998ce00f74989885a0bf2fae9ae5?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...headerProps} />
      <AboutSection {...aboutProps} />
      <NewsletterSection />
    </div>
  );
};

export default MainComponent;