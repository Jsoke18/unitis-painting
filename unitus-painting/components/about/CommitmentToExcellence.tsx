'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { CommitmentContent } from '@/types/Commitment';
import Link from 'next/link';

const CommitmentCard = () => {
  const [content, setContent] = useState<CommitmentContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/commitment');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching commitment content:', error);
      }
    };

    fetchContent();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.8
      }
    },
    hover: {
      x: 8,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const arrowVariants = {
    hover: {
      x: 4,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  if (!content) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <motion.div
            className="w-full lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-between"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <motion.h2
                className="text-4xl lg:text-5xl font-bold text-blue-900 mb-8"
                variants={textVariants}
              >
                {content.title}
              </motion.h2>
              
              <motion.div
                className="space-y-6 text-gray-600 text-lg lg:text-xl"
                variants={textVariants}
              >
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </motion.div>
            </div>

            <motion.div
              variants={buttonVariants}
              whileHover="hover"
            >
              <Link href={content.button.link}>
                <Button
                  className="mt-10 bg-amber-400 text-blue-900 hover:bg-amber-500
                           transition-all duration-300 text-xl py-6 px-8"
                >
                  {content.button.text}
                  <motion.div
                    variants={arrowVariants}
                  >
                    <ChevronRight className="ml-2 h-6 w-6" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 relative"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={content.image.src}
              alt={content.image.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitmentCard;