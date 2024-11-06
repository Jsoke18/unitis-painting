'use client'
import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Available locations
const locations = [
  { value: "vancouver", label: "Vancouver, BC" },
  { value: "kelowna", label: "Kelowna, BC" },
  { value: "calgary", label: "Calgary, AB" }
];

interface QuoteRequestDialogProps {
  buttonClassName?: string;
  buttonContent?: React.ReactNode;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  projectType: 'residential' | 'commercial' | 'strata';
  message: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  projectType: 'residential',
  message: ''
};

const QuoteRequestDialog: React.FC<QuoteRequestDialogProps> = ({ 
  buttonClassName = "px-8 py-4 text-center bg-blue-950 text-white hover:bg-blue-900 transition-all duration-300 transform hover:scale-105",
  buttonContent = "Get a Quote!"
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setIsSubmitted(false);
      setOpen(false);
      setFormData(initialFormData);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            className={buttonClassName}
          >
            {buttonContent}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-500 text-center">
              Thank you for your interest. We'll get back to you within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className={buttonClassName}
        >
          {buttonContent}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Request a Free Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below and our team will get back to you within 24 hours with a customized quote.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com" 
                  required 
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(604) 555-0123" 
                  required 
                />
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={formData.location}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                  required
                >
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Project Type</Label>
                <RadioGroup 
                  value={formData.projectType}
                  onValueChange={(value: 'residential' | 'commercial' | 'strata') => 
                    setFormData(prev => ({ ...prev, projectType: value }))}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residential" id="residential" />
                    <Label htmlFor="residential">Residential</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <Label htmlFor="commercial">Commercial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strata" id="strata" />
                    <Label htmlFor="strata">Strata</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="message">Additional Details (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us more about your project..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestDialog;