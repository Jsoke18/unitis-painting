import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

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
          <div className="md:w-2/5 relative">
            <Image 
              src={image} 
              alt={`${name}'s portrait`} 
              layout="responsive"
              width={400}
              height={400}
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
            Stay in touch with us to get the latest news and updates about our painting services.
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
  const aboutProps = {
    name: "Chris Mitchell",
    title: "Founder, CFO, & Project Manager",
    description: "Chris has been in the painting industry since graduating from Royal Roads University in 2006. Before becoming project manager, he worked as a sales representative for a local coatings company in specifying products and resolving issues for other painting contractors.  This experience has been invaluable, having first hand experience with the products we use, and the experience with troubleshooting difficult projects.  He also manages several behind-the-scene operations, including finance and maintaining company accreditations. Chris currently resides in Salmon Arm with his wife Ashly, son Jackson, and English bulldog, Maximus.  His passions include environmental consciousness and innovative technologies, with hopes of having an all-electric vehicle fleet in the coming years.  Through Unitus Painting, he has supported causes close to his heart, such as Autism, Pediatric Cancer, and local community youth sports teams.",
    phone: "604-518-0763",
    email: "chris@unituspainting.com",
    image: "/photos/chris.webp"
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow mt-32">
        <AboutSection {...aboutProps} />
      </div>
      <NewsletterSection />
    </div>
  );
};

export default MainComponent;