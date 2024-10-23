'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (value: string): string => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

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
      
      setSubmitted(true);
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData(initialFormData);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact us directly by phone.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: "Phone",
      icon: <Phone className="text-navy-blue" size={20} />,
      content: (
        <a
          href="tel:604-357-4787"
          className="hover:text-navy-blue transition-colors duration-300"
          aria-label="Call us at 604-357-4787"
        >
          604-357-4787
        </a>
      ),
    },
    {
      title: "Head Office",
      icon: <MapPin className="text-navy-blue" size={20} />,
      content: (
        <div>
          <p className="font-semibold">Unitus Painting Ltd.</p>
          <p>PO Box 21126</p>
          <p>Maple Ridge Square RPO</p>
          <p>Maple Ridge, BC V2X 1P7</p>
        </div>
      ),
    },
    {
      title: "Calgary Office",
      icon: <MapPin className="text-navy-blue" size={20} />,
      content: (
        <div>
          <p className="font-semibold">Unitus Painting Ltd.</p>
          <p>PO Box 81041</p>
          <p>RPO Lake Bonavista</p>
          <p>Calgary, AB T2J 7C9</p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header openingHours="06:00 to 20:00" />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-navy-blue to-blue-700 p-8">
              <CardTitle className="text-4xl font-bold mb-4 text-black">
                Get in Touch
              </CardTitle>
              <p className="text-black text-lg">
                Have a question or ready to transform your space? We're here to help!
              </p>
            </CardHeader>
            
            <CardContent className="p-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  className="md:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "firstName", label: "First Name", placeholder: "John" },
                        { name: "lastName", label: "Last Name", placeholder: "Doe" },
                      ].map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label 
                            htmlFor={field.name}
                            className="text-sm font-medium text-gray-700"
                          >
                            {field.label}
                          </label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={formData[field.name as keyof FormData]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`border-gray-300 focus:ring-2 focus:ring-navy-blue focus:border-transparent
                              ${errors[field.name as keyof FormData] ? 'border-red-500' : ''}`}
                            aria-invalid={!!errors[field.name as keyof FormData]}
                            aria-describedby={errors[field.name as keyof FormData] ? `${field.name}-error` : undefined}
                          />
                          <AnimatePresence>
                            {errors[field.name as keyof FormData] && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-500 text-xs mt-1"
                                id={`${field.name}-error`}
                              >
                                {errors[field.name as keyof FormData]}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* Email and Phone Fields */}
                    {[
                      { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                      { name: "phone", label: "Phone Number", type: "tel", placeholder: "(123) 456-7890" },
                    ].map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label 
                          htmlFor={field.name}
                          className="text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name as keyof FormData]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={`border-gray-300 focus:ring-2 focus:ring-navy-blue focus:border-transparent
                            ${errors[field.name as keyof FormData] ? 'border-red-500' : ''}`}
                          aria-invalid={!!errors[field.name as keyof FormData]}
                          aria-describedby={errors[field.name as keyof FormData] ? `${field.name}-error` : undefined}
                        />
                        <AnimatePresence>
                          {errors[field.name as keyof FormData] && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-xs mt-1"
                              id={`${field.name}-error`}
                            >
                              {errors[field.name as keyof FormData]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    {/* Message Field */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="message"
                        className="text-sm font-medium text-gray-700"
                      >
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className={`border-gray-300 focus:ring-2 focus:ring-navy-blue focus:border-transparent min-h-[120px]
                          ${errors.message ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                      />
                      <AnimatePresence>
                        {errors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-500 text-xs mt-1"
                            id="message-error"
                          >
                            {errors.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full transition-all duration-300 text-lg font-semibold py-3 rounded-full
                        flex items-center justify-center space-x-2
                        ${submitted 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-amber-400 hover:bg-amber-500'} 
                        text-navy-blue`}
                      disabled={isSubmitting || submitted}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          <span>Sending...</span>
                        </>
                      ) : submitted ? (
                        <>
                          <CheckCircle size={20} className="mr-2" />
                          <span>Sent Successfully!</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={20} />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>

                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-6">
                      Contact Information
                    </h3>
                    <div className="space-y-6">
                      {contactInfo.map((info, index) => (
                        <motion.div
                          key={info.title}
                          className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="mr-4 mt-1">{info.icon}</div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">
                              {info.title}
                            </h4>
                            {info.content}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
            </Card>
          
          {/* Add Business Hours Section */}
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="col-span-full md:col-span-3">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">
                      Business Hours
                    </h3>
                    <div className="space-y-2">
                      {[
                        { day: "Monday - Friday", hours: "06:00 - 20:00" },
                        { day: "Saturday", hours: "08:00 - 16:00" },
                        { day: "Sunday", hours: "Closed" }
                      ].map((schedule) => (
                        <div 
                          key={schedule.day}
                          className="flex justify-between items-center text-gray-600"
                        >
                          <span className="font-medium">{schedule.day}</span>
                          <span>{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">
                      Service Areas
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p>British Columbia</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Greater Vancouver</li>
                        <li>Fraser Valley</li>
                        <li>Sea to Sky Corridor</li>
                      </ul>
                      <p className="mt-4">Alberta</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Calgary Metropolitan Area</li>
                        <li>Rocky View County</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">
                      Emergency Service
                    </h3>
                    <p className="text-gray-600 mb-4">
                      24/7 emergency service available for our contracted clients.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-amber-800 font-medium">
                        Emergency Contact:
                      </p>
                      <a 
                        href="tel:604-357-4787"
                        className="text-amber-800 hover:text-navy-blue transition-colors duration-300 font-bold"
                      >
                        604-357-4787
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;