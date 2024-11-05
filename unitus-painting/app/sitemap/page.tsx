import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Footer from "@/components/landing/Footer";

const mainSections = [
  {
    title: "Main Pages",
    pages: [
      { title: "Home", href: "/" },
      { title: "About Us", href: "/about" },
      { title: "Contact Us", href: "/contact" },
      { title: "Areas Served", href: "/areas-served" },
      { title: "Blog", href: "/blog" },
      { title: "Project Gallery", href: "/project-gallery" },
    ]
  },
  {
    title: "About",
    pages: [
      { title: "Our Approach", href: "/our-approach" },
      { title: "Warranty", href: "/warranty" },
    ]
  },
  {
    title: "Services",
    pages: [
      { title: "All Services", href: "/services" },
      { title: "Cabinet Painting", href: "/services/cabinet-painting" },
      { title: "Carpentry", href: "/services/carpentry" },
      { title: "Caulking", href: "/services/caulking" },
      { title: "Commercial Services", href: "/services/commercial-services" },
      { title: "Exterior Painting", href: "/services/exterior-painting" },
      { title: "Interior Painting", href: "/services/interior-painting" },
      { title: "Line Painting", href: "/services/line-painting" },
      { title: "Power Washing", href: "/services/power-washing" },
      { title: "Repair", href: "/services/repair" },
      { title: "Residential", href: "/services/residential" },
      { title: "Strata Services", href: "/services/strata-services" },
    ]
  }
];

const Sitemap = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-950">Site Navigation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {mainSections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-lg font-semibold text-blue-950">
                {section.title}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                {section.pages.map((page, pageIndex) => (
                  <li key={pageIndex}>
                    <Link
                      href={page.href}
                      className="text-gray-600 hover:text-blue-950 hover:underline"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Sitemap;