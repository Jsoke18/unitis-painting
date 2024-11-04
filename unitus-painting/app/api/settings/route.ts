// app/api/settings/route.ts
import { NextResponse } from 'next/server';

const defaultSettings = {
  stats: {
    totalProjects: 4000,
    yearsInBusiness: 15,
    serviceAreas: 12,
    averageRating: 4.9
  },
  text: {
    mainHeading: "What Our Clients Say",
    mainSubheading: "Read experiences from our valued customers",
    statsSubtext: "Serving Calgary, Kewlona, and the Greater Vancouver since 2009",
    averageRatingText: "Average Customer Rating",
    customerStoriesLabel: "Customer Stories",
    callTitle: "We're Here to Help",
    callSubtitle: "Have questions about your painting project? Need a quote or assistance?",
    formNameLabel: "Name",
    formNamePlaceholder: "Your name",
    formEmailLabel: "Email",
    formEmailPlaceholder: "Your email",
    formMessageLabel: "Message",
    formMessagePlaceholder: "Tell us about your project...",
    formSubmitText: "Send Message",
    formSuccessMessage: "Thanks for reaching out! We'll get back to you shortly.",
    formErrorMessage: "There was an error sending your message. Please try again.",
    directCallText: "Call us directly",
    phoneNumber: "604-357-4787"
  }
};

if (typeof window !== 'undefined' && !localStorage.getItem('siteSettings')) {
  localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
}

export async function GET() {
  try {
    const settings = typeof window !== 'undefined' 
      ? localStorage.getItem('siteSettings') 
      : JSON.stringify(defaultSettings);
    
    return NextResponse.json(JSON.parse(settings || JSON.stringify(defaultSettings)));
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { type, data } = await request.json();
    const currentSettings = JSON.parse(
      localStorage.getItem('siteSettings') || JSON.stringify(defaultSettings)
    );
    
    let updatedSettings = { ...currentSettings };
    
    if (type === 'stats') {
      updatedSettings.stats = { ...updatedSettings.stats, ...data };
    } else if (type === 'text') {
      updatedSettings.text = { ...updatedSettings.text, ...data };
    }

    localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}