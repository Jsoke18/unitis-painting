import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import reviewsData from '@/public/data/reviews.json';

// Types
type TestimonialProps = {
  name: string;
  location: string;
  avatarSrc: string;
  content: string;
  rating: number;
  date: string;
};

type FormData = {
  name: string;
  email: string;
  message: string;
};

// Rating Stars Component
const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          "w-4 h-4",
          i < rating 
            ? "fill-amber-400 text-amber-400" 
            : "fill-gray-200 text-gray-200"
        )}
      />
    ))}
  </div>
);

// Individual Testimonial Component
const Testimonial: React.FC<TestimonialProps> = ({ 
  name, 
  location, 
  avatarSrc, 
  content,
  rating,
  date 
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-amber-400">
                <AvatarImage src={avatarSrc} alt={`${name}'s avatar`} />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-blue-950">{name}</h3>
                <p className="text-sm text-zinc-500">{location}</p>
                <div className="flex items-center mt-1">
                  <RatingStars rating={rating} />
                  <span className="text-xs text-zinc-500 ml-2">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-zinc-700 leading-relaxed">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Contact Form Component
const ContactForm: React.FC<{
  formStatus: 'idle' | 'submitting' | 'success' | 'error';
  onSubmit: (e: React.FormEvent) => void;
}> = ({ formStatus, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project..."
            className="min-h-[100px] resize-none bg-white"
            required
          />
        </div>
      </div>

      {formStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Thanks for reaching out! We'll get back to you shortly.
          </AlertDescription>
        </Alert>
      )}

      {formStatus === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            There was an error sending your message. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-950 hover:bg-blue-900 text-white"
        disabled={formStatus === 'submitting'}
      >
        {formStatus === 'submitting' ? (
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              ◌
            </motion.div>
            Sending...
          </div>
        ) : (
          "Send Message"
        )}
      </Button>
    </motion.form>
  );
};

// Main Component
const CustomerFeedback: React.FC = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const currentTestimonial = reviewsData.testimonials[currentTestimonialIndex];

  const handlePrevTestimonial = () => {
    setAutoplayEnabled(false);
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? reviewsData.testimonials.length - 1 : prev - 1
    );
    setTimeout(() => setAutoplayEnabled(true), 5000);
  };

  const handleNextTestimonial = () => {
    setAutoplayEnabled(false);
    setCurrentTestimonialIndex((prev) => 
      prev === reviewsData.testimonials.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setAutoplayEnabled(true), 5000);
  };

  // Auto-rotate testimonials with cleanup
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoplayEnabled) {
      timer = setInterval(() => {
        setCurrentTestimonialIndex((prev) => 
          prev === reviewsData.testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [autoplayEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }
  };

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Testimonials Section */}
          <motion.div className="space-y-6">
            <div>
              <Badge variant="default" className="mb-4 bg-blue-950">
                Customer Stories
              </Badge>
              <h2 className="text-3xl font-bold text-blue-950">
                What Our Clients Say
              </h2>
              <p className="text-zinc-600 mt-2">
                Read authentic experiences from our valued customers
              </p>
            </div>
  
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Testimonial {...currentTestimonial} />
                </motion.div>
              </AnimatePresence>
  
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevTestimonial}
                  className="rounded-full hover:bg-blue-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextTestimonial}
                  className="rounded-full hover:bg-blue-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
  
              <div className="flex justify-center mt-4 space-x-2">
                {reviewsData.testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTestimonialIndex(index);
                      setAutoplayEnabled(false);
                      setTimeout(() => setAutoplayEnabled(true), 5000);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      currentTestimonialIndex === index
                        ? "bg-blue-950 w-4"
                        : "bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </div>
  
            {/* Simple Stats Section */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left side - Projects Stats */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-blue-950 font-semibold">4000+</span>
                    </div>
                    <span className="text-zinc-600">Projects Completed</span>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Serving Greater Vancouver since 2009
                  </p>
                </div>
  
                {/* Right side - Rating Stats */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-amber-100 px-3 py-1 rounded-full">
                      <span className="text-amber-700 font-semibold">4.9</span>
                    </div>
                    <div className="flex items-center">
                      <RatingStars rating={4.9} />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Average Customer Rating
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
  
          {/* Contact Form Section */}
          <motion.div
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: 50 },
            }}
            className="relative"
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 rounded-bl-full opacity-10" />
              
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-blue-950">
                  We're Here to Help
                </CardTitle>
                <CardDescription>
                  Have questions about your painting project? Need a quote or assistance?
                </CardDescription>
              </CardHeader>
  
              <CardContent className="space-y-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                    <Phone className="h-6 w-6 text-blue-950" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-950 font-medium">Call us directly</p>
                    <p className="text-lg font-bold text-blue-950">604-357-4787</p>
                  </div>
                </div>
  
                <Separator />
                
                <ContactForm 
                  formStatus={formStatus}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerFeedback;