'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList,
  Paintbrush, 
  Shield, 
  CheckCircle,
  Droplets,
  Eye,
  Calendar,
  SprayCan,
  HeartHandshake,
  Ruler
} from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const OurApproach = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);


  const processSteps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Assessment",
      description: "Comprehensive site evaluation and project scope definition. We outline requirements, timeline, and logistics for minimal business disruption."
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Planning",
      description: "Detailed project specifications, timeline mapping, and resource allocation. All methods and materials are documented for stakeholder approval."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Scheduling",
      description: "Flexible execution windows including after-hours and weekend options to accommodate your operational needs."
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Preparation",
      description: "Thorough surface preparation with full area protection. We maintain site safety and cleanliness throughout the project."
    },
    {
      icon: <SprayCan className="w-6 h-6" />,
      title: "Application",
      description: "Premium commercial-grade materials applied using industry-leading techniques for durability and aesthetics."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Quality Control",
      description: "Rigorous quality assurance process ensuring all work meets project specifications and industry standards."
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "Project Completion",
      description: "Final inspection and sign-off process, ensuring all deliverables meet your requirements."
    }
  ];

  const keyFeatures = [
    { icon: <Shield className="w-6 h-6" />, label: "Industry Certified" },
    { icon: <Calendar className="w-6 h-6" />, label: "On-Time Delivery" },
    { icon: <Paintbrush className="w-6 h-6" />, label: "Commercial Grade" },
    { icon: <CheckCircle className="w-6 h-6" />, label: "Quality Assured" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header openingHours="8:00 am - 5:00 pm"/>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-100 via-white to-blue-100 pt-32 pb-20 px-4">
        <motion.div 
          className="container mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-950 tracking-tight">
            Our Approach
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Efficient, systematic execution for commercial, hospitality, and multi-unit projects.
          </p>
        </motion.div>

        {/* Key Features Grid */}
        <motion.div 
          className="container mx-auto max-w-4xl mt-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-blue-950 mb-2 flex justify-center">{feature.icon}</div>
                <div className="text-sm font-medium text-blue-950">{feature.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Process Steps */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl
                ${activeStep === index ? 'ring-2 ring-blue-950 ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full transition-colors duration-300
                    ${activeStep === index ? 'bg-blue-100 text-blue-950' : 'bg-gray-100 text-gray-600'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600">Step {index + 1}</span>
                      <h3 className="text-xl font-bold text-blue-950">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center bg-white p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-4">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-gray-600 mb-6">
            Learn how our proven approach can deliver results for your property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform duration-300"
            >
              Request Project Consultation
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-950 text-blue-950 hover:bg-blue-50 px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform duration-300"
            >
              See Our Services
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default OurApproach;