"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      
      toast({
        title: "Success!",
        description: "Your message has been sent. We'll get back to you soon.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header openingHours="06:00 to 20:00" />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-navy-blue p-8">
              <motion.div variants={fadeIn}>
                <CardTitle className="text-3xl font-bold mb-4 text-black">Get in Touch: Your Vision, Our Expertise</CardTitle>
                <p className="text-black">
                  For any inquiries, questions or commendations, please call: 604-357-4787 or fill out the following form.
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="p-8 bg-white text-black">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div className="md:col-span-2" variants={fadeIn}>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={`border-gray-300 text-black ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={`border-gray-300 text-black ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`border-gray-300 text-black ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                        className={`border-gray-300 text-black ${errors.phone ? 'border-red-500' : ''}`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message</label>
                      <Textarea 
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className={`border-gray-300 text-black ${errors.message ? 'border-red-500' : ''}`}
                        rows={5}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-amber-400 hover:bg-amber-500 text-navy-blue transition-colors duration-300 text-lg font-semibold py-3 rounded-full flex items-center justify-center space-x-2"
                      disabled={isSubmitting}
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <Send size={20} />
                    </Button>
                  </form>
                </motion.div>
                <motion.div className="space-y-8" variants={fadeIn}>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">Contact Information</h3>
                    <div className="space-y-3 text-black">
                      <motion.div 
                        className="flex items-center" 
                        whileHover={{ x: 5 }} 
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Phone className="text-navy-blue mr-3" size={20} />
                        <a 
                          href="tel:604-357-4787" 
                          className="hover:text-navy-blue transition-colors duration-300"
                        >
                          604-357-4787
                        </a>
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">Our Addresses</h3>
                    <div className="space-y-4 text-black">
                      <motion.div className="flex items-start" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <MapPin className="text-navy-blue mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold">Unitus Painting Ltd. (Head office)</p>
                          <p>PO Box 21126</p>
                          <p>Maple Ridge Square RPO</p>
                          <p>Maple Ridge, BC V2X 1P7</p>
                        </div>
                      </motion.div>
                      <motion.div className="flex items-start" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <MapPin className="text-navy-blue mr-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold">Unitus Painting Ltd. (Calgary)</p>
                          <p>PO Box 81041</p>
                          <p>RPO Lake Bonavista</p>
                          <p>Calgary, AB T2J 7C9</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;