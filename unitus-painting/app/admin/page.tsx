'use client';

import React from 'react';
import { Card } from 'antd';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileEdit,
  Users,
  Home,
  Info,
  MapPin,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigationCards = [
    {
      title: 'Update Home Page',
      description: 'Manage hero section, services, reviews, and other landing page content',
      icon: <Home className="w-6 h-6" />,
      href: '/admin/hero',
      color: '#4f46e5'
    },
    {
      title: 'Project Showcase',
      description: 'Add and manage project portfolios and case studies',
      icon: <FileEdit className="w-6 h-6" />,
      href: '/admin/projects',
      color: '#0891b2'
    },
    {
      title: 'About Section',
      description: 'Update company history, approach, and commitment content',
      icon: <Info className="w-6 h-6" />,
      href: '/admin/about-hero',
      color: '#059669'
    },
    {
      title: 'Areas Served',
      description: 'Manage service locations and area-specific content',
      icon: <MapPin className="w-6 h-6" />,
      href: '/admin/areas-served',
      color: '#dc2626'
    },
    {
      title: 'Blog Management',
      description: 'Create and edit blog posts and articles',
      icon: <MessageSquare className="w-6 h-6" />,
      href: '/admin/blog',
      color: '#7c3aed'
    },

  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome to Unitus Painting CMS</h1>
        <p className="text-gray-500 mt-2">
          Select a section below to start managing your website content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card 
              hoverable
              className="h-full transition-all duration-300 hover:shadow-lg"
              bodyStyle={{ padding: '24px' }}
            >
              <div className="space-y-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <div style={{ color: card.color }}>
                    {card.icon}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-gray-500 text-sm">{card.description}</p>
                </div>

                <div 
                  className="flex items-center text-sm font-medium"
                  style={{ color: card.color }}
                >
                  Manage
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900">Need Help?</h2>
        <p className="text-blue-700 mt-2">
          If you need assistance using the CMS or have any questions, please contact your system administrator.
        </p>
      </div>
    </div>
  );
}