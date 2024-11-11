// app/admin/hero/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { HeroContent, defaultHeroContent } from '../../types/Hero.ts';

const HeroAdmin = () => {
  const [content, setContent] = useState<HeroContent>(defaultHeroContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/hero');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to load content' });
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      
      if (!response.ok) throw new Error('Failed to update content');
      
      setStatus({ type: 'success', message: 'Content updated successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save changes' });
      console.error('Error saving content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (path: string, value: string) => {
    setContent(prev => {
      const newContent = { ...prev };
      const parts = path.split('.');
      let current = newContent as any;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newContent;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Hero Section Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status.message && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Location Text</label>
              <Input
                value={content.location.text}
                onChange={(e) => handleChange('location.text', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Main Heading - Line 1</label>
              <Input
                value={content.mainHeading.line1}
                onChange={(e) => handleChange('mainHeading.line1', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Main Heading - Line 2</label>
              <Input
                value={content.mainHeading.line2}
                onChange={(e) => handleChange('mainHeading.line2', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Subheading</label>
              <Textarea
                value={content.subheading}
                onChange={(e) => handleChange('subheading', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Primary Button Text</label>
              <Input
                value={content.buttons.primary.text}
                onChange={(e) => handleChange('buttons.primary.text', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Primary Button Link</label>
              <Input
                value={content.buttons.primary.link}
                onChange={(e) => handleChange('buttons.primary.link', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Secondary Button Text</label>
              <Input
                value={content.buttons.secondary.text}
                onChange={(e) => handleChange('buttons.secondary.text', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Secondary Button Link</label>
              <Input
                value={content.buttons.secondary.link}
                onChange={(e) => handleChange('buttons.secondary.link', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Video URL</label>
              <Input
                value={content.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroAdmin;