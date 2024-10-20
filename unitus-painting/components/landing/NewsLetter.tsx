"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GetQuote: React.FC = () => {
  return (
    <section className="bg-amber-400 py-20 mt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-extrabold text-blue-950 mb-4">
              Get a Free Quote Today
            </h2>
            <p className="text-lg text-blue-950 mb-6">
              Ready to transform your space? Whether it's a residential, commercial, strata, or hospitality we're here to bring your vision to life. Get a personalized quote for your painting needs.
            </p>
            <ul className="list-disc list-inside text-blue-950">
              <li>Expert consultation</li>
              <li>Tailored solutions for your project</li>
              <li>Competitive pricing</li>
              <li>Quick response time</li>
            </ul>
          </div>
          <div className="md:w-1/2 max-w-md">
            <form className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="strata">Strata</option>
                  <option value="strata">Other</option>

                </select>
              </div>
              <Button type="submit" className="w-full bg-blue-950 text-white hover:bg-blue-800">
                Get Your Free Quote
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetQuote;