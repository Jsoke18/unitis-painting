'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Trash2, RotateCcw, Save } from "lucide-react";
import { CommitmentContent } from '@/types/Commitment';

const CommitmentCMS = () => {
  const [formData, setFormData] = useState<CommitmentContent>({
    title: '',
    paragraphs: [''],
    button: { text: '', link: '' },
    image: { src: '', alt: '' }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/commitment');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await fetch('/api/commitment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      setSuccess('Content updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () => {
    setFormData(prev => ({
      ...prev,
      paragraphs: [...prev.paragraphs, '']
    }));
  };

  const removeParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Commitment Section</CardTitle>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={fetchContent}
                disabled={saving}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="button" className="flex-1">Button</TabsTrigger>
              <TabsTrigger value="image" className="flex-1">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter section title"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Paragraphs</Label>
                  {formData.paragraphs.map((paragraph, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={paragraph}
                        onChange={(e) => {
                          const newParagraphs = [...formData.paragraphs];
                          newParagraphs[index] = e.target.value;
                          setFormData(prev => ({ ...prev, paragraphs: newParagraphs }));
                        }}
                        placeholder={`Paragraph ${index + 1}`}
                        className="min-h-[100px]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParagraph(index)}
                        className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addParagraph}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Paragraph
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="button" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.button.text}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    button: { ...prev.button, text: e.target.value }
                  }))}
                  placeholder="Enter button text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={formData.button.link}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    button: { ...prev.button, link: e.target.value }
                  }))}
                  placeholder="Enter button link"
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageSrc">Image URL</Label>
                <Input
                  id="imageSrc"
                  value={formData.image.src}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    image: { ...prev.image, src: e.target.value }
                  }))}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageAlt">Image Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={formData.image.alt}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    image: { ...prev.image, alt: e.target.value }
                  }))}
                  placeholder="Enter image alt text"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommitmentCMS;