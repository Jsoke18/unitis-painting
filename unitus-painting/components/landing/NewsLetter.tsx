// components/sections/GetQuote.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuoteContent, defaultQuoteContent } from '@/app/types/quote';

const GetQuote: React.FC = () => {
  const [content, setContent] = useState<QuoteContent>(defaultQuoteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/quote');
        if (!response.ok) throw new Error('Failed to fetch quote content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching quote content:', error);
        setContent(defaultQuoteContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a better loading state
  }

  return (
    <section className="bg-amber-400 py-20 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-extrabold text-blue-950 mb-4">
              {content.heading}
            </h2>
            <p className="text-lg text-blue-950 mb-6">
              {content.description}
            </p>
            <ul className="list-disc list-inside text-blue-950">
              {content.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 max-w-md">
            <form className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder={content.formLabels.name}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder={content.formLabels.email}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="tel"
                  placeholder={content.formLabels.phone}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{content.formLabels.projectType}</option>
                  {content.projectTypes.map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-blue-950 text-white hover:bg-blue-800">
                {content.formLabels.submitButton}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetQuote;