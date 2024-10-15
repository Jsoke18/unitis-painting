import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const CommitmentCard = () => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-8">We're Committed to Excellence</h2>
              <div className="space-y-6 text-gray-600 text-lg lg:text-xl">
                <p>
                  At Unitus Painting, we specialize in delivering high-quality painting services for
                  residential, commercial, strata, and industrial properties across Canada. With a team
                  of highly skilled professionals and over a decade of experience, we're dedicated to
                  transforming spaces with precision and care.
                </p>
                <p>
                  We pride ourselves on using advanced techniques and the finest materials to ensure
                  long-lasting and beautiful results. Our commitment to customer satisfaction drives
                  everything we do, from the initial consultation to the final walkthrough.
                </p>
              </div>
            </div>
            <Button className="mt-10 bg-amber-400 text-blue-900 hover:bg-amber-500 transition-colors duration-300 text-xl py-6 px-8">
              Get a Quote
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/41eeac9f89794c72f10ec685f097bc94eb8fee928a606d4ebffbd2a9bc69b97a?placeholderIfAbsent=true&apiKey=a05a9fe5da54475091abff9f564d40f8"
              alt="Unitus Painting professionals at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitmentCard;