'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinIcon } from 'lucide-react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const AreasServedPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Areas We Serve</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MapPinIcon className="mr-2 text-blue-600" />
                  British Columbia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Unitus Painting Ltd. (Head office)</h3>
                <p>PO Box 21126</p>
                <p>Maple Ridge Square RPO</p>
                <p>Maple Ridge, BC V2X 1P7</p>
                <p className="mt-4">Serving the Greater Vancouver Area and Fraser Valley</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MapPinIcon className="mr-2 text-blue-600" />
                  Alberta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Unitus Painting Ltd. (Calgary)</h3>
                <p>PO Box 81041</p>
                <p>RPO Lake Bonavista</p>
                <p>Calgary, AB T2J 7C9</p>
                <p className="mt-4">Serving Calgary and surrounding areas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AreasServedPage;