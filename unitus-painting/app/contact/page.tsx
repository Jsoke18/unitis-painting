"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
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
                <CardTitle className="text-3xl font-bold mb-4 text-black">Contact Unitus Painting</CardTitle>
                <p className="text-black">
                  We're here to assist with your residential, strata, or commercial painting projects.
                  Whether you need a quote, have questions, or want to book a consultation, contact our team today!
                </p>
              </motion.div>
            </CardHeader>
            <CardContent className="p-8 bg-white text-black">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div className="md:col-span-2" variants={fadeIn}>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input placeholder="First Name" className="border-gray-300 text-black" />
                      <Input placeholder="Last Name" className="border-gray-300 text-black" />
                    </div>
                    <Input type="email" placeholder="Email Address" className="border-gray-300 text-black" />
                    <Input type="tel" placeholder="Phone Number" className="border-gray-300 text-black" />
                    <Textarea placeholder="Your Message" className="border-gray-300 text-black" rows={5} />
                    <Button type="submit" className="w-full bg-navy-blue hover:bg-blue-700 text-black transition-colors duration-300 text-lg font-semibold py-3">
                      Send Message
                    </Button>
                  </form>
                </motion.div>
                <motion.div className="space-y-8" variants={fadeIn}>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">Contact Information</h3>
                    <div className="space-y-3 text-black">
                      <motion.div className="flex items-center" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Phone className="text-navy-blue mr-3" size={20} />
                        <span>604-357-4787</span>
                      </motion.div>
                      <motion.div className="flex items-center" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Mail className="text-navy-blue mr-3" size={20} />
                        <span>info@unituspainting.com</span>
                      </motion.div>
                      <motion.div className="flex items-center" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <MapPin className="text-navy-blue mr-3" size={20} />
                        <span>123 Paint Street, Colorful City, ST 12345</span>
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-blue mb-4">Business Hours</h3>
                    <div className="space-y-2 text-black">
                      <p>Monday - Friday: 6:00 AM - 8:00 PM</p>
                      <p>Saturday: 8:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
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