"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, Phone, Mail, Clock } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Map from "react-map-gl";

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

const AreasServedPage = () => {
  const locations = [
    {
      title: "British Columbia",
      address: {
        title: "Unitus Painting Ltd. (Head office)",
        lines: [
          "PO Box 21126",
          "Maple Ridge Square RPO",
          "Maple Ridge, BC V2X 1P7"
        ]
      },
      description: "Serving the Greater Vancouver Area and Fraser Valley",
      mapProps: {
        longitude: -122.5976,
        latitude: 49.2194,
        zoom: 9
      },
      contact: {
        phone: "1-833-300-6888",
        email: "info@unituspainting.com",
        hours: "8:00 am - 5:00 pm"
      }
    },
    {
      title: "Okanagan",
      description: "Serving Kamloops, Vernon, and Kelowna areas",
      mapProps: {
        longitude: -119.4960,
        latitude: 49.8880,
        zoom: 8
      },
      contact: {
        phone: "1-833-300-6888",
        email: "info@unituspainting.com",
        hours: "8:00 am - 5:00 pm"
      }
    },
    {
      title: "Alberta",
      address: {
        title: "Unitus Painting Ltd. (Calgary)",
        lines: [
          "PO Box 81041",
          "RPO Lake Bonavista",
          "Calgary, AB T2J 7C9"
        ]
      },
      description: "Serving Calgary and surrounding areas",
      mapProps: {
        longitude: -114.0719,
        latitude: 51.0447,
        zoom: 9
      },
      contact: {
        phone: "1-833-300-6888",
        email: "info@unituspainting.com",
        hours: "8:00 am - 5:00 pm"
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header openingHours="8:00 am - 5:00 pm"/>
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Areas We Serve
            </h1>
            <p className="text-xl text-gray-600">
              Professional painting services across Western Canada
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {locations.map((location, index) => (
              <LocationCard key={index} {...location} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AreasServedPage;