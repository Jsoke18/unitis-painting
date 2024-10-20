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
                  For any inquiries, questions or commendations, please call: 604-357-4787 or fill out the following form.
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