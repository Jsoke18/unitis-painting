"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { HeroContent } from "@/app/types/hero";
import { useRouter } from "next/navigation";

const defaultHeroContent: HeroContent = {
  location: {
    text: "Serving Greater Vancouver, Fraser Valley, BC Interior, and Calgary",
  },
  mainHeading: {
    line1: "Transform Your Space",
    line2: "Professional Painting Services",
  },
  subheading:
    "Expert residential and commercial painting solutions delivered with precision, professionalism, and attention to detail.",
  buttons: {
    primary: {
      text: "Explore Our Services",
      link: "/services",
    },
    secondary: {
      text: "Get Free Quote",
      link: "/contact",
    },
  },
  videoUrl: "https://storage.googleapis.com/unitis-videos/Banner%20Video.mp4",
};

const HeroAdmin = () => {
  const router = useRouter();
  const [content, setContent] = useState<HeroContent>(defaultHeroContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/hero");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content");
      }
      const data = await response.json();
      setContent(data);
      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content", {
        icon: <AlertCircle className="w-4 h-4" />,
        description: "Please refresh the page or try again later",
        action: {
          label: "Retry",
          onClick: () => fetchContent(),
        },
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving changes...", {
      description: "Publishing updates to the hero section"
    });

    try {
      const response = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update content");
      }

      setHasChanges(false);
      router.refresh();

      toast.success("Changes saved successfully", {
        id: toastId,
        icon: <CheckCircle2 className="w-4 h-4" />,
        description: "Your changes are now live on the website. Refresh the home page to see updates.",
        duration: 5000,
        action: {
          label: "View Site",
          onClick: () => window.open('/', '_blank'),
        },
      });
    } catch (error) {
      console.error("Error saving content:", error);
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

  const handleChange = (path: string, value: string) => {
    setContent((prev) => {
      const newContent = { ...prev };
      const parts = path.split(".");
      let current = newContent as any;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newContent;
    });
    setHasChanges(true);
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your changes? All unsaved changes will be lost."
    );
    if (confirmReset) {
      fetchContent();
      toast.info("Content reset", {
        description: "All changes have been reset to the last saved version",
        duration: 3000,
      });
    }
  };

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

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
          <CardTitle>Edit Hero Section Content</CardTitle>
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
                Location Text
              </label>
              <Input
                value={content.location.text}
                onChange={(e) => handleChange("location.text", e.target.value)}
                placeholder="Enter location text..."
                className="bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Main Heading - Line 1
              </label>
              <Input
                value={content.mainHeading.line1}
                onChange={(e) =>
                  handleChange("mainHeading.line1", e.target.value)
                }
                placeholder="Enter main heading first line..."
                className="bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Main Heading - Line 2
              </label>
              <Input
                value={content.mainHeading.line2}
                onChange={(e) =>
                  handleChange("mainHeading.line2", e.target.value)
                }
                placeholder="Enter main heading second line..."
                className="bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Subheading
              </label>
              <Textarea
                value={content.subheading}
                onChange={(e) => handleChange("subheading", e.target.value)}
                placeholder="Enter subheading text..."
                className="min-h-[100px] bg-white"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Primary Button Text
                </label>
                <Input
                  value={content.buttons.primary.text}
                  onChange={(e) =>
                    handleChange("buttons.primary.text", e.target.value)
                  }
                  placeholder="Enter primary button text..."
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Primary Button Link
                </label>
                <Input
                  value={content.buttons.primary.link}
                  onChange={(e) =>
                    handleChange("buttons.primary.link", e.target.value)
                  }
                  placeholder="Enter primary button link..."
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Secondary Button Text
                </label>
                <Input
                  value={content.buttons.secondary.text}
                  onChange={(e) =>
                    handleChange("buttons.secondary.text", e.target.value)
                  }
                  placeholder="Enter secondary button text..."
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Secondary Button Link
                </label>
                <Input
                  value={content.buttons.secondary.link}
                  onChange={(e) =>
                    handleChange("buttons.secondary.link", e.target.value)
                  }
                  placeholder="Enter secondary button link..."
                  className="bg-white"
                />
              </div>
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
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset} 
              disabled={saving || !hasChanges}
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

export default HeroAdmin;