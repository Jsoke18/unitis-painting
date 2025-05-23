import React, { useState, useEffect } from 'react';
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
import { useReviewStore } from '@/lib/reviewService';

const defaultSettings = {
  stats: {
    totalProjects: 0,
    yearsInBusiness: 0,
    serviceAreas: 0,
    averageRating: 0
  },
  text: {
    mainHeading: "Customer Testimonials",
    mainSubheading: "See what our clients have to say about us",
    customerStoriesLabel: "Reviews",
    callTitle: "Get in Touch",
    callSubtitle: "We'd love to hear from you",
    formNameLabel: "Name",
    formNamePlaceholder: "Your name",
    formEmailLabel: "Email",
    formEmailPlaceholder: "your.email@example.com",
    formMessageLabel: "Message",
    formMessagePlaceholder: "Tell us about your project",
    formSubmitText: "Send Message",
    formSuccessMessage: "Thank you! We'll be in touch soon.",
    formErrorMessage: "There was an error sending your message. Please try again.",
    directCallText: "Prefer to talk now?",
    phoneNumber: "(833)-300-6888"
  }
};

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

const Testimonial: React.FC<{
  name: string;
  location: string;
  avatarSrc: string;
  content: string;
  rating: number;
  date: string;
}> = ({ name, location, avatarSrc, content, rating, date }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
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
                <AvatarImage src={avatarSrc} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
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

const ContactForm: React.FC<{
  settings: typeof defaultSettings;
  formStatus: 'idle' | 'submitting' | 'success' | 'error';
  onSubmit: (e: React.FormEvent) => void;
}> = ({ settings, formStatus, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <motion.form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{settings.text.formNameLabel}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={settings.text.formNamePlaceholder}
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{settings.text.formEmailLabel}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={settings.text.formEmailPlaceholder}
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{settings.text.formMessageLabel}</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={settings.text.formMessagePlaceholder}
            className="min-h-[100px] resize-none bg-white"
            required
          />
        </div>
      </div>

      {formStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {settings.text.formSuccessMessage}
          </AlertDescription>
        </Alert>
      )}

      {formStatus === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {settings.text.formErrorMessage}
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
          settings.text.formSubmitText
        )}
      </Button>
    </motion.form>
  );
};

export const CustomerFeedback: React.FC = () => {
  const [settings] = useState(defaultSettings);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { reviews, stats, isLoading, error, fetchReviews } = useReviewStore();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoplayEnabled && reviews.length > 0) {
      timer = setInterval(() => {
        setCurrentTestimonialIndex((prev) => 
          prev === reviews.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [autoplayEnabled, reviews.length]);

  if (error) {
    return (
      <Alert className="m-4 bg-red-50 border-red-200">
        <AlertDescription className="text-red-800">
          Error loading reviews: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handlePrevTestimonial = () => {
    setAutoplayEnabled(false);
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? reviews.length - 1 : prev - 1
    );
    setTimeout(() => setAutoplayEnabled(true), 5000);
  };

  const handleNextTestimonial = () => {
    setAutoplayEnabled(false);
    setCurrentTestimonialIndex((prev) => 
      prev === reviews.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setAutoplayEnabled(true), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      
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

  const currentTestimonial = reviews[currentTestimonialIndex];

  if (!currentTestimonial) {
    return null;
  }

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <motion.div className="space-y-6">
            <div>
              <Badge variant="default" className="mb-4 bg-blue-950">
                {settings.text.customerStoriesLabel}
              </Badge>
              <h2 className="text-3xl font-bold text-blue-950">
                {settings.text.mainHeading}
              </h2>
              <p className="text-zinc-600 mt-2">
                {settings.text.mainSubheading}
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
                {reviews.map((_, index) => (
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
          </motion.div>

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
                  {settings.text.callTitle}
                </CardTitle>
                <CardDescription>
                  {settings.text.callSubtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                  <Phone className="h-6 w-6 text-blue-950" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-950 font-medium">
                      {settings.text.directCallText}
                    </p>
                    <p className="text-lg font-bold text-blue-950">
                      {settings.text.phoneNumber}
                    </p>
                  </div>
                </div>

                <Separator />
                
                <ContactForm 
                  settings={settings}
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