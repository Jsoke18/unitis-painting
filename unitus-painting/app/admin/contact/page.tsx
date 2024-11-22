'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface OfficeInfo {
  companyName: string;
  poBox: string;
  addressLine1: string;
  addressLine2: string;
}

interface ContactPageContent {
  pageTitle: string;
  pageDescription: string;
  openingHours: string;
  phoneNumber: string;
  headOffice: OfficeInfo;
  calgaryOffice: OfficeInfo;
}

interface ContactEditorProps {
  initialContent?: ContactPageContent;
  onSave?: (content: ContactPageContent) => Promise<void>;
  onCancel?: () => void;
  apiEndpoint?: string;
  className?: string;
}

const defaultContent: ContactPageContent = {
  pageTitle: '',
  pageDescription: '',
  openingHours: '',
  phoneNumber: '',
  headOffice: {
    companyName: '',
    poBox: '',
    addressLine1: '',
    addressLine2: ''
  },
  calgaryOffice: {
    companyName: '',
    poBox: '',
    addressLine1: '',
    addressLine2: ''
  }
};

function transformApiData(apiData: any): ContactPageContent {
  const content = { ...defaultContent };

  // Transform base fields
  content.pageTitle = apiData.pageTitle || '';
  content.pageDescription = apiData.pageDescription || '';
  content.openingHours = apiData.openingHours || '';

  // Transform contact info array to our structure
  if (Array.isArray(apiData.contactInfo)) {
    apiData.contactInfo.forEach((info: any) => {
      switch (info.infoType) {
        case 'phone':
          content.phoneNumber = info.phoneNumber || '';
          break;
        case 'head_office':
          content.headOffice = {
            companyName: info.companyName || '',
            poBox: info.poBox || '',
            addressLine1: info.addressLine1 || '',
            addressLine2: info.addressLine2 || ''
          };
          break;
        case 'calgary_office':
          content.calgaryOffice = {
            companyName: info.companyName || '',
            poBox: info.poBox || '',
            addressLine1: info.addressLine1 || '',
            addressLine2: info.addressLine2 || ''
          };
          break;
      }
    });
  }

  return content;
}

function transformForApi(content: ContactPageContent): any {
  return {
    pageTitle: content.pageTitle,
    pageDescription: content.pageDescription,
    openingHours: content.openingHours,
    contactInfo: [
      {
        infoType: 'phone',
        title: 'Phone',
        phoneNumber: content.phoneNumber
      },
      {
        infoType: 'head_office',
        title: 'Head Office',
        companyName: content.headOffice.companyName,
        poBox: content.headOffice.poBox,
        addressLine1: content.headOffice.addressLine1,
        addressLine2: content.headOffice.addressLine2
      },
      {
        infoType: 'calgary_office',
        title: 'Calgary Office',
        companyName: content.calgaryOffice.companyName,
        poBox: content.calgaryOffice.poBox,
        addressLine1: content.calgaryOffice.addressLine1,
        addressLine2: content.calgaryOffice.addressLine2
      }
    ],
    formFields: [] // Include empty formFields array to satisfy backend validation
  };
}

export function ContactEditor({
  initialContent,
  onSave,
  onCancel,
  apiEndpoint = '/api/contact',
  className = ''
}: ContactEditorProps) {
  const [loading, setLoading] = useState(!initialContent);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<ContactPageContent>(
    initialContent ? transformApiData(initialContent) : defaultContent
  );

  useEffect(() => {
    if (!initialContent) {
      fetchContent();
    }
  }, [initialContent]);

  const fetchContent = async () => {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch content');
      }
      const data = await response.json();
      setContent(transformApiData(data));
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load contact page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (onSave) {
        await onSave(content);
      } else {
        const transformedContent = transformForApi(content);
        console.log('Sending content:', transformedContent); // Debug log
        
        const response = await fetch(apiEndpoint, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transformedContent)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save content');
        }
        
        toast.success('Contact page content saved successfully');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save contact page content');
    } finally {
      setSaving(false);
    }
  };

  const updateOffice = (office: 'headOffice' | 'calgaryOffice', field: keyof OfficeInfo, value: string) => {
    setContent(prev => ({
      ...prev,
      [office]: {
        ...prev[office],
        [field]: value
      }
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-8 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Contact Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Page Title</Label>
              <Input
                id="pageTitle"
                value={content.pageTitle}
                onChange={e => setContent(prev => ({ ...prev, pageTitle: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="pageDescription">Page Description</Label>
              <Textarea
                id="pageDescription"
                value={content.pageDescription}
                onChange={e => setContent(prev => ({ ...prev, pageDescription: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                value={content.openingHours}
                onChange={e => setContent(prev => ({ ...prev, openingHours: e.target.value }))}
              />
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={content.phoneNumber}
                  onChange={e => setContent(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="(604) 357-4787"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Head Office</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={content.headOffice.companyName}
                  onChange={e => updateOffice('headOffice', 'companyName', e.target.value)}
                />
              </div>
              <div>
                <Label>PO Box</Label>
                <Input
                  value={content.headOffice.poBox}
                  onChange={e => updateOffice('headOffice', 'poBox', e.target.value)}
                />
              </div>
              <div>
                <Label>Address Line 1</Label>
                <Input
                  value={content.headOffice.addressLine1}
                  onChange={e => updateOffice('headOffice', 'addressLine1', e.target.value)}
                />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input
                  value={content.headOffice.addressLine2}
                  onChange={e => updateOffice('headOffice', 'addressLine2', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calgary Office</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={content.calgaryOffice.companyName}
                  onChange={e => updateOffice('calgaryOffice', 'companyName', e.target.value)}
                />
              </div>
              <div>
                <Label>PO Box</Label>
                <Input
                  value={content.calgaryOffice.poBox}
                  onChange={e => updateOffice('calgaryOffice', 'poBox', e.target.value)}
                />
              </div>
              <div>
                <Label>Address Line 1</Label>
                <Input
                  value={content.calgaryOffice.addressLine1}
                  onChange={e => updateOffice('calgaryOffice', 'addressLine1', e.target.value)}
                />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input
                  value={content.calgaryOffice.addressLine2}
                  onChange={e => updateOffice('calgaryOffice', 'addressLine2', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-6">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContactEditor;