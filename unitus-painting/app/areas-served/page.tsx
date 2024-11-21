"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, Phone, Mail, Clock } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Map from "react-map-gl";
import { AreasServedContent, Location } from '@/lib/db/areas-served';

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoiam9zaHNva2UiLCJhIjoiY20yaHV1Ym85MGg5czJpcHZpeW9jenE2YSJ9.dQL_m4RdWh4gRjR144s-ww";

const LocationMap = ({ longitude, latitude, zoom }) => (
  <Map
    mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
    initialViewState={{
      longitude,
      latitude,
      zoom,
    }}
    style={{ width: "100%", height: "100%" }}
    mapStyle="mapbox://styles/mapbox/streets-v11"
  />
);

const LocationCard = ({ title, address, description, mapProps, contact }) => (
  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
    <CardHeader className="bg-blue-950 text-white">
      <CardTitle className="flex items-center text-2xl">
        <MapPinIcon className="mr-2 text-amber-400" size={24} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 flex-grow flex flex-col">
      {/* Info Section */}
      <div className="mb-6 flex-grow">
        {address && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-900">
              {address.title}
            </h3>
            {address.lines.map((line, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">{line}</p>
            ))}
          </div>
        )}
        <p className="text-gray-700 font-medium mb-6">
          {description}
        </p>
        <div className="space-y-3 pt-4 border-t border-gray-200">
          {contact && (
            <>
              {contact.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-3 text-blue-900 flex-shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:text-blue-900 transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-3 text-blue-900 flex-shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-900 transition-colors">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.hours && (
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-3 text-blue-900 flex-shrink-0" />
                  <span>{contact.hours}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Map Section - Fixed height */}
      <div className="h-[300px] w-full relative mt-6">
        <LocationMap {...mapProps} />
      </div>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto animate-pulse">
    {[1, 2, 3].map((index) => (
      <div key={index} className="bg-white rounded-lg shadow-lg h-[600px]">
        <div className="h-16 bg-blue-950 rounded-t-lg" />
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="space-y-2">
            {[1, 2, 3].map((line) => (
              <div key={line} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
          <div className="mt-6 h-[300px] bg-gray-200 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="text-center py-12">
    <div className="text-red-600 text-xl mb-4">
      {error}
    </div>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const AreasServedPage = () => {
  const [content, setContent] = useState<AreasServedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/areas-served');
        if (!response.ok) throw new Error('Failed to fetch areas served content');
        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading the content');
        console.error('Error fetching areas served content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header openingHours={content?.locations[0]?.contact?.hours || "8:00 am - 5:00 pm"} />
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              {content?.page?.title || 'Areas We Serve'}
            </h1>
            <p className="text-xl text-gray-600">
              {content?.page?.subtitle || 'Professional painting services across Western Canada'}
            </p>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {content?.locations.map((location, index) => (
                <LocationCard key={index} {...location} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AreasServedPage;