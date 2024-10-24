"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Map from "react-map-gl";

// You'll need to replace this with your actual Mapbox access token
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
    style={{ width: "100%", height: 300 }}
    mapStyle="mapbox://styles/mapbox/streets-v11"
  />
);

const AreasServedPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header openingHours="8:00 am - 5:00 pm"/>
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4 mt-24 mb-24">
          <h1 className="text-4xl font-bold text-center mb-20">
            Areas We Serve
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-blue-900">
                  <MapPinIcon className="mr-2 text-blue-900" />
                  British Columbia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">
                  Unitus Painting Ltd. (Head office)
                </h3>
                <p>PO Box 21126</p>
                <p>Maple Ridge Square RPO</p>
                <p>Maple Ridge, BC V2X 1P7</p>
                <p className="mt-4 mb-4">
                  Serving the Greater Vancouver Area and Fraser Valley
                </p>
                <LocationMap
                  longitude={-122.5976}
                  latitude={49.2194}
                  zoom={9}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-blue-900">
                  <MapPinIcon className="mr-2 text-blue-900" />
                  Alberta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">
                  Unitus Painting Ltd. (Calgary)
                </h3>
                <p>PO Box 81041</p>
                <p>RPO Lake Bonavista</p>
                <p>Calgary, AB T2J 7C9</p>
                <p className="mt-4 mb-4">
                  Serving Calgary and surrounding areas
                </p>
                <LocationMap
                  longitude={-114.0719}
                  latitude={51.0447}
                  zoom={9}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer  />
    </div>
  );
};

export default AreasServedPage;
