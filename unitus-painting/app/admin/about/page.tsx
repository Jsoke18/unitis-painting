'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AboutContent, defaultAboutContent } from '@/app/types/about';

const AboutCMS: React.FC = () => {
  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/about');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
      setHasChanges(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error("Failed to load content", {
        icon: <AlertCircle className="w-4 h-4" />,
        description: "Please refresh the page or try again later",
        action: {
          label: "Retry",
          onClick: () => fetchContent(),
        },
      });
      setContent(defaultAboutContent);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving changes...", {
      description: "Publishing updates to the about section"
    });

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error('Failed to update content');

      setHasChanges(false);

      toast.success("Changes saved successfully", {
        id: toastId,
        icon: <CheckCircle2 className="w-4 h-4" />,
        description: "Your changes are now live on the website. Refresh the about page to see updates.",
        duration: 5000,
        action: {
          label: "View Site",
          onClick: () => window.open('/about', '_blank'),
        },
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Failed to save changes", {
        id: toastId,
        icon: <AlertCircle className="w-4 h-4" />,
        description: error instanceof Error 
          ? `Error: ${error.message}. Please try again or contact support if the issue persists.`
          : "An unexpected error occurred. Please try again.",
        duration: 7000,
        action: {
          label: "Retry",
          onClick: () => handleSave(),
        },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset to default content? All unsaved changes will be lost."
    );
    if (confirmReset) {
      setContent(defaultAboutContent);
      setHasChanges(true);
      toast.info("Content reset to default", {
        description: "All changes have been reset to the default version",
        duration: 3000,
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (field: 'paragraphs' | 'bulletPoints', index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    setHasChanges(true);
  };

  const addArrayItem = (field: 'paragraphs' | 'bulletPoints', defaultValue: string = '') => {
    setContent(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
    setHasChanges(true);
  };

  const removeArrayItem = (field: 'paragraphs' | 'bulletPoints', index: number) => {
    setContent(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    setHasChanges(true);
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Edit About Section Content</CardTitle>
          {hasChanges && (
            <span className="text-sm text-yellow-600 font-medium">
              ⚠️ Unsaved changes
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Badge Text
              </label>
              <Input
                value={content.badge.text}
                onChange={(e) => handleChange("badge", { text: e.target.value })}
                placeholder="Enter badge text..."
                className="bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Heading
              </label>
              <Input
                value={content.heading}
                onChange={(e) => handleChange("heading", e.target.value)}
                placeholder="Enter heading..."
                className="bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Video URL
              </label>
              <Input
                value={content.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                placeholder="Enter video URL..."
                className="bg-white"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium mb-1.5 block">
                Paragraphs
              </label>
              {content.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => handleArrayChange('paragraphs', index, e.target.value)}
                    placeholder={`Paragraph ${index + 1}`}
                    className="bg-white min-h-[100px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('paragraphs', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('paragraphs')}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Paragraph
              </Button>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium mb-1.5 block">
                Bullet Points
              </label>
              {content.bulletPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => handleArrayChange('bulletPoints', index, e.target.value)}
                    placeholder={`Bullet point ${index + 1}`}
                    className="bg-white"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem('bulletPoints', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('bulletPoints')}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Bullet Point
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset} 
              disabled={saving}
              className="min-w-[130px]"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="min-w-[140px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Publish Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutCMS;